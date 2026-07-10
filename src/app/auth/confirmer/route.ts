import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseEnabled } from "@/lib/supabase/config";

// Cible du bouton « Confirmer mon email » de notre email HTML maison.
// Vérifie le jeton généré par generateLink (Server Action signUp), ouvre la
// session et redirige vers l'espace demandé.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const next = searchParams.get("next") ?? "/app/dashboard";
  const dest = next.startsWith("/") && !next.startsWith("//") ? next : "/app/dashboard";

  if (!isSupabaseEnabled()) {
    return NextResponse.redirect(`${origin}${dest}`);
  }

  if (tokenHash) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type: "signup",
      token_hash: tokenHash,
    });
    if (!error) {
      return NextResponse.redirect(`${origin}${dest}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/connexion?error=${encodeURIComponent(
      "Lien de confirmation invalide ou expiré. Réinscrivez-vous ou contactez le support."
    )}`
  );
}
