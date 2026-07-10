"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { genererCode } from "@/lib/live";

export type QuestionInput = {
  enonce: string;
  options: string[];
  reponse: number; // index de la bonne option
};

// Vérifie que l'utilisateur est formateur/admin et retourne son contexte.
async function requireFormateur() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion?redirect=/formateur");

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("organization_id, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !["formateur", "admin", "super_admin"].includes(profile.role)) {
    redirect("/app/dashboard");
  }
  return { userId: user.id, organizationId: profile!.organization_id as string };
}

/** Crée un quiz (titre + questions QCM) pour l'organisation du formateur. */
export async function enregistrerQuiz(payload: {
  titre: string;
  questions: QuestionInput[];
}): Promise<{ quizId?: string; error?: string }> {
  const { userId, organizationId } = await requireFormateur();

  const titre = payload.titre.trim();
  const questions = (payload.questions ?? []).filter(
    (q) =>
      q.enonce.trim().length > 0 &&
      q.options.filter((o) => o.trim().length > 0).length >= 2 &&
      q.reponse >= 0 &&
      q.reponse < q.options.length
  );
  if (!titre || questions.length === 0) {
    return { error: "Titre et au moins une question complète requis." };
  }

  const admin = createAdminClient();
  const { data: quiz, error } = await admin
    .from("quizzes")
    .insert({ titre, organization_id: organizationId, created_by: userId })
    .select("id")
    .single();
  if (error || !quiz) return { error: "Création du quiz impossible." };

  const { error: qError } = await admin.from("questions").insert(
    questions.map((q, i) => ({
      quiz_id: quiz.id,
      type: "qcm",
      enonce: q.enonce.trim(),
      options: q.options.map((o) => o.trim()).filter(Boolean),
      reponse: q.reponse,
      points: 1,
      position: i,
    }))
  );
  if (qError) {
    await admin.from("quizzes").delete().eq("id", quiz.id);
    return { error: "Enregistrement des questions impossible." };
  }

  revalidatePath("/formateur");
  return { quizId: quiz.id };
}

/** Lance une session live pour un quiz : génère le code et ouvre le lobby. */
export async function creerSession(quizId: string): Promise<{ sessionId?: string; error?: string }> {
  const { userId, organizationId } = await requireFormateur();

  const admin = createAdminClient();
  const { data: quiz } = await admin
    .from("quizzes")
    .select("id, titre")
    .eq("id", quizId)
    .eq("organization_id", organizationId)
    .maybeSingle();
  if (!quiz) return { error: "Quiz introuvable." };

  // Code unique : quelques tentatives en cas de (rare) collision.
  for (let essai = 0; essai < 5; essai++) {
    const { data: session, error } = await admin
      .from("sessions")
      .insert({
        organization_id: organizationId,
        formateur_id: userId,
        quiz_id: quiz.id,
        titre: quiz.titre,
        code: genererCode(),
        etat: "lobby",
        question_index: -1,
        active: true,
        debut_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (!error && session) {
      revalidatePath("/formateur");
      return { sessionId: session.id };
    }
    if (error && error.code !== "23505") return { error: "Création de session impossible." };
  }
  return { error: "Création de session impossible (code)." };
}

/** Pilote la machine à états de la session (console formateur). */
export async function commandeSession(
  sessionId: string,
  commande: "demarrer" | "resultats" | "suivante" | "terminer"
): Promise<{ ok?: boolean; error?: string }> {
  const { organizationId } = await requireFormateur();

  const admin = createAdminClient();
  const { data: session } = await admin
    .from("sessions")
    .select("id, organization_id, quiz_id, etat, question_index")
    .eq("id", sessionId)
    .maybeSingle();
  if (!session || session.organization_id !== organizationId) {
    return { error: "Session introuvable." };
  }

  const { count } = await admin
    .from("questions")
    .select("id", { count: "exact", head: true })
    .eq("quiz_id", session.quiz_id ?? "");
  const total = count ?? 0;

  if (commande === "demarrer" || commande === "suivante") {
    const nextIndex = commande === "demarrer" ? 0 : session.question_index + 1;
    if (nextIndex >= total) {
      await admin
        .from("sessions")
        .update({ etat: "terminee", active: false })
        .eq("id", session.id);
      return { ok: true };
    }
    await admin
      .from("sessions")
      .update({
        etat: "question",
        question_index: nextIndex,
        question_started_at: new Date().toISOString(),
      })
      .eq("id", session.id);
    return { ok: true };
  }

  if (commande === "resultats") {
    await admin.from("sessions").update({ etat: "resultats" }).eq("id", session.id);
    return { ok: true };
  }

  await admin
    .from("sessions")
    .update({ etat: "terminee", active: false })
    .eq("id", session.id);
  return { ok: true };
}
