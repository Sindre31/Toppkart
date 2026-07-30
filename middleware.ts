import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env, isSupabaseConfigured } from "@/lib/config";
import { LANG_COOKIE, LANG_COOKIE_MAX_AGE, LANG_PARAM, isLang } from "@/lib/i18n";

/** Promotes `?lang=` into the `tk_lang` cookie and redirects to the same URL
 *  without the parameter. This is what the language switcher links hit: the
 *  choice persists, the address bar stays clean, and `/kart?lang=en` remains a
 *  shareable entry point into the English site. */
function languageRedirect(request: NextRequest): NextResponse | null {
  const requested = request.nextUrl.searchParams.get(LANG_PARAM);
  if (!isLang(requested)) return null;

  /* Next prefetches `<Link>` targets speculatively, and the switcher renders one
     link per language. Honouring `?lang=` on a prefetch therefore set the cookie
     for a language nobody clicked — with both links prefetched on sight,
     whichever response landed last silently won. A speculative fetch must not
     change a stored preference, so prefetches fall through and just render. */
  if (request.headers.get("next-router-prefetch")) return null;

  const url = request.nextUrl.clone();
  url.searchParams.delete(LANG_PARAM);
  const response = NextResponse.redirect(url);
  response.cookies.set(LANG_COOKIE, requested, {
    path: "/",
    maxAge: LANG_COOKIE_MAX_AGE,
    sameSite: "lax",
  });
  return response;
}

/** Keeps the Supabase auth cookie fresh on every navigation. In demo mode
 *  (no keys) this is a pass-through — nothing to refresh, nothing to crash on. */
export async function middleware(request: NextRequest) {
  const langResponse = languageRedirect(request);
  if (langResponse) return langResponse;

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
