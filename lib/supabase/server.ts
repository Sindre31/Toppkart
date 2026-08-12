import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
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

/** Service-role client for webhook handlers. Never expose to the browser.
 *
 *  `createClient` sto som et `require()` inne i funksjonen, for å holde
 *  `@supabase/supabase-js` utenfor bunter som ikke bruker den. Den jobben gjør
 *  ikke et require lenger: denne modulen importerer `next/headers` øverst, som
 *  gjør hele fila server-only, og bunteren tar den aldri med til nettleseren
 *  uansett hvordan importen er skrevet. Igjen sto bare et krav som er unntatt
 *  fra typesjekk og fra linting. */
export function getSupabaseAdminClient() {
  if (!env.supabaseUrl || !env.supabaseServiceKey) return null;
  return createClient(env.supabaseUrl, env.supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
