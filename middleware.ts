import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env, isSupabaseConfigured } from "@/lib/config";
import { LANG_COOKIE, LANG_COOKIE_MAX_AGE, LANG_PARAM, isLang } from "@/lib/i18n";

/** Promotes `?lang=` into the `tk_lang` cookie and redirects to the same URL
 *  without the parameter. This is what the language switcher links hit: the
 *  choice persists, the address bar stays clean, and `/kart?lang=en` remains a
 *  shareable entry point into the English site. */
function languageRedirect(request: NextRequest): NextResponse | null {
  /* Pages only. `?lang=` is a reader-facing switch, and answering an API call
     with a redirect plus a cookie is not what a caller asked for — it silently
     swallowed `/api/skredvarsel?...&lang=no`, which never reached its handler
     at all. Route handlers read the language off the query themselves. */
  if (request.nextUrl.pathname.startsWith("/api/")) return null;

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

/** Forwards a stray auth `?code=` to `/auth/callback`.
 *
 *  Supabase does not always use the `redirect_to` it is handed. If that URL is
 *  missing from the Redirect URLs allow-list, it silently substitutes the
 *  project's **Site URL** — and that field is normally a bare domain with no
 *  path, so the browser arrives at `/?code=…` instead of `/auth/callback?code=…`.
 *  The landing page has no idea what to do with a code, so sign-in dead-ends on
 *  a page that looks perfectly normal and simply is not signed in.
 *
 *  Catching it here costs nothing and makes a bare Site URL a working
 *  configuration rather than a silent failure. It is a safety net, not a
 *  substitute for the allow-list: if `redirect_to` is rejected, Supabase also
 *  drops the `next` we asked for, so the visitor lands on the default page
 *  rather than the one they were heading to.
 */
function strayAuthCode(request: NextRequest): NextResponse | null {
  const { pathname, searchParams } = request.nextUrl;
  if (pathname === "/auth/callback") return null;
  if (!searchParams.has("code") && !searchParams.has("error")) return null;

  const url = request.nextUrl.clone();
  url.pathname = "/auth/callback";
  return NextResponse.redirect(url);
}

/** Keeps the Supabase auth cookie fresh on every navigation. In demo mode
 *  (no keys) this is a pass-through — nothing to refresh, nothing to crash on. */
export async function middleware(request: NextRequest) {
  const strayCode = strayAuthCode(request);
  if (strayCode) return strayCode;

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
