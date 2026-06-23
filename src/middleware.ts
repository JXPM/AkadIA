import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Mode démo : pas de session à gérer, espaces privés en accès libre.
  if (!isSupabaseEnabled()) return NextResponse.next();
  return updateSession(request);
}

export const config = {
  matcher: [
    // Tout sauf assets statiques et images.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
