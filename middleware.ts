import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env, isSupabaseConfigured } from "@/lib/config";

/** Keeps the Supabase auth cookie fresh on every navigation. In demo mode
 *  (no keys) this is a pass-through — nothing to refresh, nothing to crash on. */
export async function middleware(request: NextRequest) {
  if (!isSupabaseConfigured) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Touching getUser() is what triggers the refresh + Set-Cookie.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|css|js|map|txt|xml|json|gpx|woff|woff2|ttf)$).*)",
  ],
};
