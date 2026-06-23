"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseEnabled } from "@/lib/supabase/config";

function safeRedirect(target: FormDataEntryValue | null): string {
  const t = String(target ?? "");
  // N'autoriser que les chemins internes.
  return t.startsWith("/") && !t.startsWith("//") ? t : "/app/dashboard";
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
    redirect(`/connexion?error=${encodeURIComponent(error.message)}`);
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

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { prenom, nom } },
  });
  if (error) {
    redirect(`/inscription?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect(dest);
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
