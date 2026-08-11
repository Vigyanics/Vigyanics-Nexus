import { createClient } from "@supabase/supabase-js";

// Injected at build time via vite.config.ts define block from server env vars
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const isConfigured = supabaseUrl && supabaseUrl.startsWith("https://");

// Create a mock client when Supabase is not configured (so the site can still load)
function createMockClient() {
  // Creates a chainable query builder that always returns itself and resolves to { data, error }
  function createQueryBuilder(): Record<string, unknown> {
    const builder: Record<string, unknown> = {};
    // All PostgREST methods return the builder itself for chaining
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
    // .then makes it thenable / awaitable
    builder["then"] = (resolve: (v: unknown) => void) => {
      resolve({ data: null, error: null });
    };
    builder["catch"] = () => builder;
    builder["finally"] = (cb: () => void) => {
      cb();
      return builder;
    };
    // Also make builder a proper Promise by delegating
    const originalThen = builder["then"];
    builder["then"] = function (resolve: (v: unknown) => void, reject?: (v: unknown) => void) {
      return Promise.resolve({ data: null, error: null }).then(resolve, reject);
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
      signInWithPassword: () => Promise.resolve({ data: null, error: null }),
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

  return mockClient as unknown as ReturnType<typeof createClient>;
}

export const supabase = isConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey)
  : createMockClient();
export default supabase;
