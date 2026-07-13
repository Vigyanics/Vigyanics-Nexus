import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseUrl.startsWith("https://")) {
  throw new Error("VITE_SUPABASE_URL is not configured correctly");
}

// Browser-safe client — anon key ONLY, service role key never leaves the server
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
