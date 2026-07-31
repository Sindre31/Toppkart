import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/** Only same-origin relative paths are accepted as a landing target. */
function safeNext(value: string | null): string {
  if (!value) return "/kart";
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return "/kart";
  return value;
}

/** Landing point for both sign-in routes: exchange ?code= for a session, then
 *  continue to ?next=.
 *
 *  Magic links and Google come back the same way — a `code` in the query — so
 *  one handler serves both. They fail differently, though: an expired link and
 *  a cancelled Google consent screen are not the same thing to a reader, so the
 *  failure carries which one it was and the login page picks the wording.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = safeNext(url.searchParams.get("next"));
  const code = url.searchParams.get("code");

  // Google reports a refused or failed consent screen as ?error=, not ?code=.
  const oauthError = url.searchParams.get("error");
  const failed = (kind: "1" | "google") =>
    NextResponse.redirect(new URL(`/logg-inn?feil=${kind}`, url.origin));

  if (oauthError) return failed("google");
  if (!code) return failed("1");

  const supabase = await getSupabaseServerClient();
  if (!supabase) return failed("1");

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return failed("1");

  return NextResponse.redirect(new URL(next, url.origin));
}
