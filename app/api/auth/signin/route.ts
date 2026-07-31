import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/config";
import { requestOrigin } from "@/lib/origin";
import { setDemoEmail } from "@/lib/demo-session";
import { LANG_COOKIE, toLang, type Lang } from "@/lib/i18n";
import { systemDict } from "@/lib/i18n/system";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** The reader's language, read straight off the request. A Route Handler is
 *  handed the request, so it can take the cookie from the header it already
 *  has rather than reaching for `getLang()`. The name comes from `LANG_COOKIE`,
 *  so this reader can never drift from the one the pages use. */
function langOf(request: Request): Lang {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${LANG_COOKIE}=([^;]*)`));
  return toLang(match?.[1]);
}

/** Only same-origin relative paths may ride along to the magic link. */
function safeNext(value: unknown): string {
  if (typeof value !== "string") return "/kart";
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return "/kart";
  return value;
}

/** POST { email, next? } — sends a magic link (live) or opens the demo session.
 *  The response is identical whether or not the address has an account.
 *
 *  The login form prints `error` verbatim, so the replies follow the language
 *  the reader is browsing in. */
export async function POST(request: Request) {
  const t = systemDict(langOf(request));

  let payload: unknown = null;
  try {
    payload = await request.json();
  } catch {
    payload = null;
  }
  const body = (payload ?? {}) as { email?: unknown; next?: unknown };
  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: t.authInvalidEmail },
      { status: 400 },
    );
  }

  const next = safeNext(body.next);

  if (isSupabaseConfigured) {
    const supabase = await getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { ok: false, error: t.authSendFailed },
        { status: 503 },
      );
    }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Same reasoning as the Google route: the link has to come back to
        // the origin the link was asked for from.
        emailRedirectTo: `${requestOrigin(request)}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      return NextResponse.json(
        { ok: false, error: t.authSendFailed },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  }

  // Demo mode: no keys, so the cookie session stands in for the mail round-trip.
  await setDemoEmail(email);
  return NextResponse.json({ ok: true, demo: true });
}
