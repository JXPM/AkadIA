import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  QUESTION_DUREE_S,
  getParticipants,
  getQuestionComplete,
  getQuestionsPubliques,
  getSessionById,
} from "@/lib/live";

// État de la partie côté participant (interrogé en polling ~2 s).
// Ne révèle jamais la bonne réponse pendant la phase « question ».
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session");
  const participantId = searchParams.get("participant");

  if (!sessionId || !participantId) {
    return NextResponse.json({ error: "Paramètres manquants." }, { status: 400 });
  }

  const session = await getSessionById(sessionId);
  if (!session || !session.quiz_id) {
    return NextResponse.json({ error: "Session introuvable." }, { status: 404 });
  }

  const questions = await getQuestionsPubliques(session.quiz_id);
  const participants = await getParticipants(session.id);
  const moi = participants.find((p) => p.id === participantId);
  if (!moi) {
    return NextResponse.json({ error: "Participant inconnu." }, { status: 404 });
  }
  const rang = participants.findIndex((p) => p.id === participantId) + 1;

  const base = {
    etat: session.etat,
    titre: session.titre,
    questionIndex: session.question_index,
    totalQuestions: questions.length,
    pseudo: moi.pseudo,
    score: moi.score,
    rang,
    nbParticipants: participants.length,
  };

  if (session.etat === "question") {
    const q = questions[session.question_index];
    const admin = createAdminClient();
    const { data: maReponse } = await admin
      .from("session_answers")
      .select("id")
      .eq("participant_id", participantId)
      .eq("question_id", q?.id ?? "")
      .maybeSingle();

    const elapsed = session.question_started_at
      ? (Date.now() - new Date(session.question_started_at).getTime()) / 1000
      : 0;

    return NextResponse.json({
      ...base,
      question: q ? { enonce: q.enonce, options: q.options } : null,
      tempsRestant: Math.max(0, Math.round(QUESTION_DUREE_S - elapsed)),
      aRepondu: Boolean(maReponse),
    });
  }

  if (session.etat === "resultats") {
    const q = await getQuestionComplete(session.quiz_id, session.question_index);
    const admin = createAdminClient();
    const { data: maReponse } = await admin
      .from("session_answers")
      .select("correcte, points")
      .eq("participant_id", participantId)
      .eq("question_id", q?.id ?? "")
      .maybeSingle();

    return NextResponse.json({
      ...base,
      question: q ? { enonce: q.enonce, options: q.options } : null,
      bonneReponse: q?.reponse ?? null,
      maReponse: maReponse ?? null,
    });
  }

  if (session.etat === "terminee") {
    return NextResponse.json({
      ...base,
      podium: participants.slice(0, 3).map((p) => ({ pseudo: p.pseudo, score: p.score })),
    });
  }

  // lobby
  return NextResponse.json(base);
}
