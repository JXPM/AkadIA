// Le backend Supabase est-il branché ? Sinon l'app tourne en mode démo
// (données locales + accès libre aux espaces privés). Partagé par le
// middleware, les Server Actions et la couche d'accès aux données.
export function isSupabaseEnabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_DEMO_MODE !== "1" &&
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
