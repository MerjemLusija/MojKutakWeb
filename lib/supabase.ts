import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Javni (anon) Supabase klijent — radi i na serveru i u browseru.
 * `null` kada .env.local nije podešen; tada stranica nema recepata.
 */
export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, { auth: { persistSession: false } })
    : null;
