import { createClient } from "@supabase/supabase-js";

// Injected at build time via vite.config.ts define block from server env vars
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseUrl.startsWith("https://")) {
  throw new Error("VITE_SUPABASE_URL is not configured correctly");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
