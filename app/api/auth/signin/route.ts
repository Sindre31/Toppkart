import { NextResponse } from "next/server";
import { env, isSupabaseConfigured } from "@/lib/config";
import { setDemoEmail } from "@/lib/demo-session";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Only same-origin relative paths may ride along to the magic link. */
function safeNext(value: unknown): string {
  if (typeof value !== "string") return "/kart";
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return "/kart";
  return value;
}

/** POST { email, next? } — sends a magic link (live) or opens the demo session.
 *  The response is identical whether or not the address has an account. */
export async function POST(request: Request) {
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
      { ok: false, error: "Skriv inn en gyldig e-postadresse." },
      { status: 400 },
    );
  }

  const next = safeNext(body.next);

  if (isSupabaseConfigured) {
    const supabase = await getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json(
        { ok: false, error: "Vi klarte ikke å sende innloggingslenken. Prøv igjen om litt." },
        { status: 503 },
      );
    }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${env.siteUrl}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      return NextResponse.json(
        { ok: false, error: "Vi klarte ikke å sende innloggingslenken. Prøv igjen om litt." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  }

  // Demo mode: no keys, so the cookie session stands in for the mail round-trip.
  await setDemoEmail(email);
  return NextResponse.json({ ok: true, demo: true });
}
