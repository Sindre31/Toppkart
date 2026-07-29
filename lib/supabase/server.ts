import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { env, isSupabaseConfigured } from "@/lib/config";

/** Request-scoped Supabase client for Server Components and Route Handlers.
 *  Returns null when Supabase is not configured (demo mode). */
export async function getSupabaseServerClient() {
  if (!isSupabaseConfigured) return null;
  const cookieStore = await cookies();
  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        // Server Components cannot set cookies; middleware and Route Handlers
        // can, and that is where the session refresh happens.
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          /* called from a Server Component — safe to ignore */
        }
      },
    },
  });
}

/** Service-role client for webhook handlers. Never expose to the browser. */
export function getSupabaseAdminClient() {
  if (!env.supabaseUrl || !env.supabaseServiceKey) return null;
  const { createClient } = require("@supabase/supabase-js") as typeof import("@supabase/supabase-js");
  return createClient(env.supabaseUrl, env.supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
