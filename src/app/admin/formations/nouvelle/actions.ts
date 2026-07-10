"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type PlanGenere = {
  titre: string;
  objectifs: string[];
  modules: { titre: string; lecons: string[]; quiz: string }[];
  projetFinal: string;
};

function slugifier(titre: string): string {
  const base = titre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
  return `${base}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Enregistre le plan généré comme formation brouillon (modules + leçons). */
export async function creerFormationDepuisPlan(
  plan: PlanGenere
): Promise<{ ok?: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("organization_id, role")
    .eq("id", user!.id)
    .maybeSingle();
  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    redirect("/app/dashboard");
  }

  if (!plan?.titre?.trim() || !plan.modules?.length) {
    return { error: "Plan invalide." };
  }

  const { data: formation, error } = await admin
    .from("formations")
    .insert({
      organization_id: profile!.organization_id,
      auteur_id: user!.id,
      slug: slugifier(plan.titre),
      titre: plan.titre.trim(),
      description: plan.projetFinal || null,
      objectifs: plan.objectifs ?? [],
      status: "brouillon",
      duree_heures: plan.modules.length * 2,
    })
    .select("id")
    .single();
  if (error || !formation) return { error: "Création de la formation impossible." };

  for (const [mi, m] of plan.modules.entries()) {
    const { data: module_, error: mErr } = await admin
      .from("modules")
      .insert({ formation_id: formation.id, titre: m.titre, position: mi })
      .select("id")
      .single();
    if (mErr || !module_) continue;

    const { data: chapitre } = await admin
      .from("chapitres")
      .insert({ module_id: module_.id, titre: m.titre, position: 0 })
      .select("id")
      .single();
    if (!chapitre) continue;

    const lessons = [
      ...m.lecons.map((titre, li) => ({
        chapitre_id: chapitre.id,
        titre,
        type: "texte" as const,
        duree_min: 10,
        position: li,
      })),
      {
        chapitre_id: chapitre.id,
        titre: m.quiz || `Quiz : ${m.titre}`,
        type: "quiz" as const,
        duree_min: 10,
        position: m.lecons.length,
      },
    ];
    await admin.from("lessons").insert(lessons);
  }

  revalidatePath("/admin/formations");
  return { ok: true };
}
