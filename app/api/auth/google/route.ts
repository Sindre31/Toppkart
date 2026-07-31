import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/config";
import { requestOrigin } from "@/lib/origin";
import { setDemoEmail } from "@/lib/demo-session";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/** Only same-origin relative paths may ride along through the provider. */
function safeNext(value: string | null): string {
  if (!value) return "/kart";
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return "/kart";
  return value;
}

/** GET /api/auth/google?next= — start the Google sign-in round-trip.
 *
 *  No mail is involved anywhere in this flow: the browser goes to Google,
 *  Google sends it back to `/auth/callback` with a `code`, and the callback
 *  trades that for a session. Supabase reads the address out of the Google
 *  profile, so the account still has an e-mail — it just never has to send one.
 *
 *  A GET rather than a POST because the response is a redirect the browser
 *  follows; the login page links straight here.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = safeNext(url.searchParams.get("next"));

  if (!isSupabaseConfigured) {
    // Demo mode: there is no Google to talk to, so stand in a demo session and
    // land where the caller asked, keeping the whole flow clickable with no keys.
    await setDemoEmail("demo@toppkart.no");
    return NextResponse.redirect(new URL(next, url.origin));
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) return NextResponse.redirect(new URL("/logg-inn?feil=google", url.origin));

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      // The origin the visitor is actually on, not NEXT_PUBLIC_SITE_URL: the
      // session cookie must be set on the domain they came from.
      redirectTo: `${requestOrigin(request)}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error || !data?.url) {
    return NextResponse.redirect(new URL("/logg-inn?feil=google", url.origin));
  }
  return NextResponse.redirect(data.url);
}
