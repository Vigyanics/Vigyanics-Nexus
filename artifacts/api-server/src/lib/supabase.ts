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

  return { url: url ?? "", anonKey: anonKey ?? "", serviceRoleKey: serviceRoleKey ?? "" };
}

const { url, anonKey, serviceRoleKey } = resolveSupabaseEnv();

export const supabaseUrl = url || undefined;
export const supabaseAnonKey = anonKey || undefined;

const isConfigured = !!(url && anonKey && serviceRoleKey);

// Creates a chainable query builder that always returns itself and resolves to { data: null, error: null }
function createQueryBuilder(): Record<string, unknown> {
  const builder: Record<string, unknown> = {};
  const chainMethods = [
    "select", "eq", "neq", "gt", "gte", "lt", "lte", "like", "ilike",
    "is", "in", "contains", "containedBy", "rangeGt", "rangeGte",
    "rangeLt", "rangeLte", "overlaps", "textSearch", "match", "not",
    "filter", "or", "and", "order", "limit", "offset", "range",
    "single", "maybeSingle", "csv", "abortSignal",
  ];
  for (const method of chainMethods) {
    builder[method] = (..._args: unknown[]) => builder;
  }
  builder["then"] = function (resolve: (v: unknown) => void, _reject?: (v: unknown) => void) {
    return Promise.resolve({ data: [], error: null, count: 0 }).then(resolve);
  };
  builder["catch"] = () => builder;
  builder["finally"] = (cb: () => void) => {
    cb();
    return builder;
  };
  return builder;
}

// Create mock clients when Supabase is not configured
function createMockClient() {
  return {
    auth: {
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      getUser: (token?: string) => Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      admin: {
        createUser: () => Promise.resolve({ data: { user: { id: "", email: "", user_metadata: {} } }, error: null }),
      },
    },
    from: () => createQueryBuilder(),
    channel: () => ({
      on: () => ({
        subscribe: () => ({}),
      }),
    }),
    removeChannel: () => Promise.resolve(),
    rpc: () => Promise.resolve({ data: null, error: null }),
    functions: {
      invoke: () => Promise.resolve({ data: null, error: null }),
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        download: () => Promise.resolve({ data: null, error: null }),
        list: () => Promise.resolve({ data: [], error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
      }),
    },
  };
}

// Admin client — full access, service role key, server-side ONLY — never send to browser
export const supabaseAdmin = isConfigured
  ? createClient(url, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : (createMockClient() as unknown as ReturnType<typeof createClient>);

// Anon client — for auth operations on behalf of users
export const supabase = isConfigured
  ? createClient(url, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : (createMockClient() as unknown as ReturnType<typeof createClient>);
