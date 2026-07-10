import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { calculerPoints, getQuestionComplete, getSessionById } from "@/lib/live";

// Un participant répond à la question en cours.
export async function POST(req: Request) {
  const { sessionId, participantId, reponse } = await req.json().catch(() => ({}));
  const choix = Number(reponse);

  if (!sessionId || !participantId || !Number.isInteger(choix)) {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const session = await getSessionById(String(sessionId));
  if (!session || !session.quiz_id) {
    return NextResponse.json({ error: "Session introuvable." }, { status: 404 });
  }
  if (session.etat !== "question") {
    return NextResponse.json({ error: "Les réponses sont closes pour cette question." }, { status: 409 });
  }

  const admin = createAdminClient();
  const { data: participant } = await admin
    .from("session_participants")
    .select("id, score")
    .eq("id", String(participantId))
    .eq("session_id", session.id)
    .maybeSingle();
  if (!participant) {
    return NextResponse.json({ error: "Participant inconnu." }, { status: 404 });
  }

  const question = await getQuestionComplete(session.quiz_id, session.question_index);
  if (!question) {
    return NextResponse.json({ error: "Question introuvable." }, { status: 404 });
  }

  const correcte = choix === question.reponse;
  const elapsedMs = session.question_started_at
    ? Date.now() - new Date(session.question_started_at).getTime()
    : 0;
  const points = calculerPoints(correcte, elapsedMs);

  const { error } = await admin.from("session_answers").insert({
    session_id: session.id,
    participant_id: participant.id,
    question_id: question.id,
    reponse: choix,
    correcte,
    points,
  });

  if (error) {
    const deja = error.code === "23505";
    return NextResponse.json(
      { error: deja ? "Tu as déjà répondu à cette question." : "Réponse non enregistrée." },
      { status: deja ? 409 : 500 }
    );
  }

  if (points > 0) {
    await admin
      .from("session_participants")
      .update({ score: participant.score + points })
      .eq("id", participant.id);
  }

  return NextResponse.json({ ok: true });
}
