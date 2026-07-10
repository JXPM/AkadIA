"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { sendEmail } from "@/lib/email";
import { confirmationEmail } from "@/lib/email-templates";

function safeRedirect(target: FormDataEntryValue | null): string {
  const t = String(target ?? "");
  // N'autoriser que les chemins internes.
  return t.startsWith("/") && !t.startsWith("//") ? t : "/app/dashboard";
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
  const dest = safeRedirect(formData.get("redirect"));

  // Mode démo : accès direct sans authentification.
  if (!isSupabaseEnabled()) redirect(dest);

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/connexion?error=${encodeURIComponent(frAuthError(error.message))}`);
  }

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
