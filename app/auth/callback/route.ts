import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/** Only same-origin relative paths are accepted as a landing target. */
function safeNext(value: string | null): string {
  if (!value) return "/kart";
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return "/kart";
  return value;
}

/** Magic-link landing: exchange ?code= for a session, then continue to ?next=. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = safeNext(url.searchParams.get("next"));
  const code = url.searchParams.get("code");
  const failed = new URL("/logg-inn?feil=1", url.origin);

  if (!code) return NextResponse.redirect(failed);

  const supabase = await getSupabaseServerClient();
  if (!supabase) return NextResponse.redirect(failed);

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(failed);

  return NextResponse.redirect(new URL(next, url.origin));
}
