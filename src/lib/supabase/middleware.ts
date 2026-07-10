import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { roleHome } from "@/lib/roles";

// Rafraîchit la session Supabase (cookies) à chaque requête et protège les
// espaces privés. Appelé par `src/middleware.ts` uniquement quand le backend
// est branché (sinon no-op : mode démo en accès libre).
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT : ne pas exécuter de code entre createServerClient et getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isProtected =
    path.startsWith("/app") ||
    path.startsWith("/admin") ||
    path.startsWith("/formateur") ||
    path.startsWith("/cours");
  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/connexion";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  // Contrôle par rôle : /admin réservé aux admins, /formateur aux
  // formateurs et admins. Les apprenants sont renvoyés vers leur espace.
  const needsRole = path.startsWith("/admin")
    ? ["admin", "super_admin"]
    : path.startsWith("/formateur")
      ? ["admin", "super_admin", "formateur"]
      : null;
  if (user && needsRole) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (!needsRole.includes(profile?.role ?? "apprenant")) {
      const url = request.nextUrl.clone();
      url.pathname = "/app/dashboard";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  // Évite de rester sur les pages d'auth une fois connecté :
  // chacun est renvoyé vers l'espace de son rôle.
  if (user && (path === "/connexion" || path === "/inscription")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    const url = request.nextUrl.clone();
    url.pathname = roleHome(profile?.role);
    url.search = "";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
