import { createClient } from "@supabase/supabase-js";

// Auto-detect correct values regardless of which env field they ended up in
function resolveSupabaseEnv() {
  const raw = [
    process.env.SUPABASE_URL ?? "",
    process.env.SUPABASE_ANON_KEY ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  ];

  function decodeJwtRole(token: string): string | null {
    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(Buffer.from(payload, "base64").toString());
      return decoded.role ?? null;
    } catch {
      return null;
    }
  }

  const url = raw.find((v) => v.startsWith("https://"));
  const anonKey = raw.find((v) => v.startsWith("eyJ") && decodeJwtRole(v) === "anon");
  const serviceRoleKey = raw.find((v) => v.startsWith("eyJ") && decodeJwtRole(v) === "service_role");

  if (!url) throw new Error("SUPABASE_URL (https://...) not found in any env var");
  if (!anonKey) throw new Error("Supabase anon key not found in env vars");
  if (!serviceRoleKey) throw new Error("Supabase service_role key not found in env vars");

  return { url, anonKey, serviceRoleKey };
}

const { url, anonKey, serviceRoleKey } = resolveSupabaseEnv();

export const supabaseUrl = url;
export const supabaseAnonKey = anonKey;

// Admin client — full access, service role key, server-side ONLY — never send to browser
export const supabaseAdmin = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Anon client — for auth operations on behalf of users
export const supabase = createClient(url, anonKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
