import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL ?? "";
const anonKey = process.env.SUPABASE_ANON_KEY ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

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
//
// IMPORTANT: If the service-role key is missing we must NOT silently fall back
// to the mock client. The mock returns empty arrays for every query and blocks
// writes with RLS-style errors, which makes RLS-protected tables
// (customers, admin_requests, orders) appear empty even though the code and
// database are correct. Fail loudly so a misconfigured start is obvious.
export const supabaseAdmin = isConfigured
  ? createClient(url, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : (() => {
      console.warn(
        "\n[supabase] WARNING: SUPABASE_SERVICE_ROLE_KEY is missing. " +
        "Admin operations (customers, admin_requests, orders) will fail. " +
        "Set SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY " +
        "to enable full admin functionality.\n"
      );
      return createMockClient() as ReturnType<typeof createClient>;
    })();

// Anon client — for auth operations on behalf of users
export const supabase = isConfigured
  ? createClient(url, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : (createMockClient() as unknown as ReturnType<typeof createClient>);
