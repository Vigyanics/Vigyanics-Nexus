import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const isConfigured = supabaseUrl && supabaseUrl.startsWith("https://") && supabaseAnonKey;

// Create a mock client when Supabase is not configured (so the admin panel can still load)
function createMockClient() {
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
      return Promise.resolve({ data: null, error: null }).then(resolve);
    };
    builder["catch"] = () => builder;
    builder["finally"] = (cb: () => void) => {
      cb();
      return builder;
    };
    return builder;
  }

  const mockClient: Record<string, unknown> = {
    from: () => createQueryBuilder(),
    channel: () => ({
      on: () => ({
        subscribe: () => ({}),
      }),
    }),
    removeChannel: () => Promise.resolve(),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        download: () => Promise.resolve({ data: null, error: null }),
        list: () => Promise.resolve({ data: [], error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
      }),
    },
    rpc: () => Promise.resolve({ data: null, error: null }),
    functions: {
      invoke: () => Promise.resolve({ data: null, error: null }),
    },
  };

  // This client is only used as an offline-safe fallback. It intentionally
  // implements the subset of the Supabase API used by the UI.
  return mockClient as unknown as ReturnType<typeof createClient>;
}

let supabase: ReturnType<typeof createClient>;
try {
  supabase = isConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createMockClient();
} catch {
  supabase = createMockClient();
}

export { supabase };
export default supabase;
