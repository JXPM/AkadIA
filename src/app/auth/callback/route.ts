import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Échange le code OAuth/magic-link contre une session, puis redirige.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/app/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    return NextResponse.redirect(
      `${origin}/connexion?error=${encodeURIComponent(error.message)}`
    );
  }

  return NextResponse.redirect(`${origin}/connexion?error=Code%20manquant`);
}
