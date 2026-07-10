"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";
import { invitationEmail } from "@/lib/email-templates";

// Invite un membre (apprenant ou formateur) dans l'organisation de l'admin.
// Le trigger handle_new_user (migration 0005) lit invited_org/invited_role
// dans les métadonnées : l'invité rejoint l'organisation au lieu d'en créer une.
export async function inviterMembre(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const roleDemande = String(formData.get("role") ?? "apprenant");
  const role = ["apprenant", "formateur"].includes(roleDemande) ? roleDemande : "apprenant";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("organization_id, role, prenom, nom")
    .eq("id", user!.id)
    .maybeSingle();
  if (!profile || !["admin", "super_admin"].includes(profile.role)) {
    redirect("/app/dashboard");
  }

  if (!email) {
    redirect("/admin/equipe?error=" + encodeURIComponent("Email requis."));
  }

  const { data: org } = await admin
    .from("organizations")
    .select("nom")
    .eq("id", profile!.organization_id)
    .maybeSingle();

  const { data, error } = await admin.auth.admin.generateLink({
    type: "invite",
    email,
    options: {
      data: {
        invited_org: profile!.organization_id,
        invited_role: role,
      },
    },
  });

  if (error || !data.properties?.hashed_token) {
    const deja = /already/i.test(error?.message ?? "");
    redirect(
      "/admin/equipe?error=" +
        encodeURIComponent(
          deja ? "Un compte existe déjà avec cet email." : "Invitation impossible."
        )
    );
  }

  const origin = (await headers()).get("origin") ?? "";
  const inviteUrl = `${origin}/auth/confirmer?token_hash=${encodeURIComponent(
    data.properties!.hashed_token
  )}&type=invite&next=${encodeURIComponent("/reinitialiser")}`;

  const invitant = [profile!.prenom, profile!.nom].filter(Boolean).join(" ").trim();
  const mail = invitationEmail({
    organisation: org?.nom ?? "votre organisation",
    invitant: invitant || undefined,
    inviteUrl,
  });
  const { sent } = await sendEmail({ to: email, ...mail });
  if (!sent) console.warn(`[invitation] Lien pour ${email} : ${inviteUrl}`);

  revalidatePath("/admin/equipe");
  redirect("/admin/equipe?sent=" + encodeURIComponent(email));
}
