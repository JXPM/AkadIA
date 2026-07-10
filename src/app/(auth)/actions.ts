"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { sendEmail } from "@/lib/email";
import { confirmationEmail, recoveryEmail } from "@/lib/email-templates";
import { roleHome } from "@/lib/roles";

function safeRedirect(target: FormDataEntryValue | null): string {
  const t = String(target ?? "");
  // N'autoriser que les chemins internes.
  return t.startsWith("/") && !t.startsWith("//") ? t : "/app/dashboard";
}

async function homeForUser(userId: string): Promise<string> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  return roleHome(data?.role);
}

// Traduit les erreurs Supabase Auth affichées à l'utilisateur.
function frAuthError(message: string): string {
  const map: Record<string, string> = {
    "Invalid login credentials": "Email ou mot de passe incorrect.",
    "Email not confirmed":
      "Votre email n'est pas encore confirmé. Vérifiez votre boîte de réception.",
    "User already registered": "Un compte existe déjà avec cet email.",
    "A user with this email address has already been registered":
      "Un compte existe déjà avec cet email.",
    "Password should be at least 6 characters":
      "Le mot de passe doit contenir au moins 6 caractères.",
    "Email rate limit exceeded":
      "Trop de tentatives. Réessayez dans quelques minutes.",
  };
  return map[message] ?? message;
}

export async function signIn(formData: FormData) {
  const demande = String(formData.get("redirect") ?? "");

  // Mode démo : accès direct sans authentification.
  if (!isSupabaseEnabled()) redirect(safeRedirect(demande));

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/connexion?error=${encodeURIComponent(frAuthError(error.message))}`);
  }

  // Destination explicite (page protégée demandée) sinon espace du rôle.
  const dest =
    demande.startsWith("/") && !demande.startsWith("//")
      ? demande
      : await homeForUser(data.user!.id);

  revalidatePath("/", "layout");
  redirect(dest);
}

export async function signUp(formData: FormData) {
  const dest = safeRedirect(formData.get("redirect"));

  if (!isSupabaseEnabled()) redirect(dest);

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const prenom = String(formData.get("prenom") ?? "");
  const nom = String(formData.get("nom") ?? "");

  // Création du compte via l'API admin : Supabase n'envoie AUCUN email.
  // generateLink crée l'utilisateur (non confirmé) et retourne le jeton de
  // confirmation ; l'email HTML est envoyé par nos soins (src/lib/email.ts).
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.generateLink({
    type: "signup",
    email,
    password,
    options: { data: { prenom, nom } },
  });
  if (error) {
    redirect(`/inscription?error=${encodeURIComponent(frAuthError(error.message))}`);
  }

  const tokenHash = data.properties?.hashed_token;
  const origin = (await headers()).get("origin") ?? "";
  const confirmUrl = `${origin}/auth/confirmer?token_hash=${encodeURIComponent(
    tokenHash ?? ""
  )}&next=${encodeURIComponent(dest)}`;

  const mail = confirmationEmail({ prenom, confirmUrl });
  const { sent } = await sendEmail({ to: email, ...mail });
  if (!sent) {
    // SMTP absent (dev) : le lien est loggé côté serveur pour tester le flux.
    console.warn(`[auth] Lien de confirmation pour ${email} : ${confirmUrl}`);
  }

  redirect(`/inscription/verification?email=${encodeURIComponent(email)}`);
}

/** Inscription via lien d'invitation partageable : rejoint l'organisation
 *  du code en apprenant (le code est revalidé côté serveur). */
export async function signUpViaInvitation(formData: FormData) {
  if (!isSupabaseEnabled()) redirect("/app/dashboard");

  const code = String(formData.get("code") ?? "").trim();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const prenom = String(formData.get("prenom") ?? "");
  const nom = String(formData.get("nom") ?? "");

  const admin = createAdminClient();
  const { data: org } = await admin
    .from("organizations")
    .select("id, nom")
    .eq("invite_code", code)
    .maybeSingle();
  if (!org) {
    redirect(`/invitation/${encodeURIComponent(code)}?error=${encodeURIComponent("Lien d'invitation invalide.")}`);
  }

  const { data, error } = await admin.auth.admin.generateLink({
    type: "signup",
    email,
    password,
    options: {
      data: {
        prenom,
        nom,
        invited_org: org!.id,
        invited_role: "apprenant",
      },
    },
  });
  if (error) {
    redirect(
      `/invitation/${encodeURIComponent(code)}?error=${encodeURIComponent(frAuthError(error.message))}`
    );
  }

  const tokenHash = data.properties?.hashed_token;
  const origin = (await headers()).get("origin") ?? "";
  const confirmUrl = `${origin}/auth/confirmer?token_hash=${encodeURIComponent(
    tokenHash ?? ""
  )}&next=${encodeURIComponent("/app/dashboard")}`;

  const mail = confirmationEmail({ prenom, confirmUrl });
  const { sent } = await sendEmail({ to: email, ...mail });
  if (!sent) console.warn(`[auth] Lien de confirmation (invitation) pour ${email} : ${confirmUrl}`);

  redirect(`/inscription/verification?email=${encodeURIComponent(email)}`);
}

export async function demanderReinitialisation(formData: FormData) {
  if (!isSupabaseEnabled()) redirect("/connexion");

  const email = String(formData.get("email") ?? "").trim();
  if (!email) redirect("/mot-de-passe-oublie?error=Email%20requis");

  // generateLink type recovery : Supabase n'envoie rien, on émet notre email.
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
  });

  if (!error && data.properties?.hashed_token) {
    const origin = (await headers()).get("origin") ?? "";
    const resetUrl = `${origin}/auth/confirmer?token_hash=${encodeURIComponent(
      data.properties.hashed_token
    )}&type=recovery&next=${encodeURIComponent("/reinitialiser")}`;

    const { data: profil } = await admin
      .from("profiles")
      .select("prenom")
      .eq("id", data.user?.id ?? "")
      .maybeSingle();

    const mail = recoveryEmail({ prenom: profil?.prenom ?? undefined, resetUrl });
    const { sent } = await sendEmail({ to: email, ...mail });
    if (!sent) console.warn(`[auth] Lien de réinitialisation pour ${email} : ${resetUrl}`);
  }
  // Toujours le même message, que le compte existe ou non (anti-énumération).
  redirect("/mot-de-passe-oublie?sent=1");
}

export async function definirNouveauMotDePasse(formData: FormData) {
  if (!isSupabaseEnabled()) redirect("/connexion");

  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "");
  if (password.length < 8) {
    redirect("/reinitialiser?error=" + encodeURIComponent("8 caractères minimum."));
  }
  if (password !== confirmation) {
    redirect(
      "/reinitialiser?error=" + encodeURIComponent("Les deux mots de passe ne correspondent pas.")
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    redirect("/reinitialiser?error=" + encodeURIComponent(frAuthError(error.message)));
  }

  revalidatePath("/", "layout");
  redirect("/app/dashboard");
}

export async function signInWithGoogle(formData: FormData) {
  const dest = safeRedirect(formData.get("redirect"));

  if (!isSupabaseEnabled()) redirect(dest);

  const origin = (await headers()).get("origin") ?? "";
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(dest)}`,
    },
  });
  if (error || !data.url) {
    redirect(`/connexion?error=${encodeURIComponent(error?.message ?? "OAuth indisponible")}`);
  }
  redirect(data.url);
}

export async function signOut() {
  if (isSupabaseEnabled()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  revalidatePath("/", "layout");
  redirect("/connexion");
}
