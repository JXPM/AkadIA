// Sessions live façon Kahoot — logique serveur partagée.
// Les invités (sans compte) passent par les routes /api/live/* qui utilisent
// le client service role : les tables restent fermées au public (RLS).
import "server-only";
import { createAdminClient } from "./supabase/admin";
import { normaliserCode } from "./live-utils";

export { QUESTION_DUREE_S, genererCode, normaliserCode, calculerPoints } from "./live-utils";

// États d'une session live.
export type EtatSession = "lobby" | "question" | "resultats" | "terminee";

export type LiveQuestion = {
  id: string;
  enonce: string;
  options: string[];
  position: number;
};

export type SessionRow = {
  id: string;
  organization_id: string;
  quiz_id: string | null;
  titre: string;
  code: string | null;
  etat: EtatSession;
  question_index: number;
  question_started_at: string | null;
  active: boolean | null;
};

export async function getSessionByCode(code: string): Promise<SessionRow | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("sessions")
    .select("id, organization_id, quiz_id, titre, code, etat, question_index, question_started_at, active")
    .eq("code", normaliserCode(code))
    .maybeSingle();
  return (data as SessionRow) ?? null;
}

export async function getSessionById(id: string): Promise<SessionRow | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("sessions")
    .select("id, organization_id, quiz_id, titre, code, etat, question_index, question_started_at, active")
    .eq("id", id)
    .maybeSingle();
  return (data as SessionRow) ?? null;
}

/** Questions d'un quiz, ordonnées, sans la bonne réponse (côté joueur). */
export async function getQuestionsPubliques(quizId: string): Promise<LiveQuestion[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("questions")
    .select("id, enonce, options, position")
    .eq("quiz_id", quizId)
    .order("position", { ascending: true });
  return (data ?? []).map((q) => ({
    id: q.id,
    enonce: q.enonce,
    options: Array.isArray(q.options) ? (q.options as string[]) : [],
    position: q.position ?? 0,
  }));
}

export type QuestionComplete = LiveQuestion & { reponse: number };

export async function getQuestionComplete(
  quizId: string,
  index: number
): Promise<QuestionComplete | null> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("questions")
    .select("id, enonce, options, reponse, position")
    .eq("quiz_id", quizId)
    .order("position", { ascending: true });
  const q = (data ?? [])[index];
  if (!q) return null;
  return {
    id: q.id,
    enonce: q.enonce,
    options: Array.isArray(q.options) ? (q.options as string[]) : [],
    reponse: typeof q.reponse === "number" ? q.reponse : Number(q.reponse ?? -1),
    position: q.position ?? 0,
  };
}

export type Participant = {
  id: string;
  pseudo: string;
  score: number;
};

export async function getParticipants(sessionId: string): Promise<Participant[]> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("session_participants")
    .select("id, pseudo, score")
    .eq("session_id", sessionId)
    .order("score", { ascending: false })
    .order("joined_at", { ascending: true });
  return (data ?? []) as Participant[];
}
