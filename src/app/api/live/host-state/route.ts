import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  QUESTION_DUREE_S,
  getParticipants,
  getQuestionComplete,
  getQuestionsPubliques,
  getSessionById,
} from "@/lib/live";

// État complet de la session pour la console du formateur (polling ~2 s).
// Réservé aux formateurs/admins de l'organisation propriétaire.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session");
  if (!sessionId) {
    return NextResponse.json({ error: "Paramètre session manquant." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("organization_id, role")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile || !["formateur", "admin", "super_admin"].includes(profile.role)) {
    return NextResponse.json({ error: "Accès réservé aux formateurs." }, { status: 403 });
  }

  const session = await getSessionById(sessionId);
  if (!session || session.organization_id !== profile.organization_id) {
    return NextResponse.json({ error: "Session introuvable." }, { status: 404 });
  }

  const participants = await getParticipants(session.id);
  const questions = session.quiz_id ? await getQuestionsPubliques(session.quiz_id) : [];

  const base = {
    etat: session.etat,
    code: session.code,
    titre: session.titre,
    questionIndex: session.question_index,
    totalQuestions: questions.length,
    participants,
  };

  if (session.etat === "lobby" || session.etat === "terminee") {
    return NextResponse.json(base);
  }

  // question / resultats : question complète + répartition des réponses.
  const q = session.quiz_id
    ? await getQuestionComplete(session.quiz_id, session.question_index)
    : null;
  const { data: answers } = await admin
    .from("session_answers")
    .select("reponse, correcte")
    .eq("session_id", session.id)
    .eq("question_id", q?.id ?? "");

  const repartition = (q?.options ?? []).map(
    (_, i) => (answers ?? []).filter((a) => Number(a.reponse) === i).length
  );

  const elapsed = session.question_started_at
    ? (Date.now() - new Date(session.question_started_at).getTime()) / 1000
    : 0;

  return NextResponse.json({
    ...base,
    question: q,
    nbReponses: (answers ?? []).length,
    repartition,
    tempsRestant: Math.max(0, Math.round(QUESTION_DUREE_S - elapsed)),
  });
}
