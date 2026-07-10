import { createClient } from "@supabase/supabase-js";

// Client Supabase avec la clé service role : réservé au serveur (Server
// Actions / Route Handlers). Contourne la RLS — ne jamais l'exposer au client.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
