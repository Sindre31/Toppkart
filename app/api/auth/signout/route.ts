import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/config";
import { clearDemoSession } from "@/lib/demo-session";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/** POST — ends the session (Supabase in live mode, cookies in demo) and
 *  returns the visitor to the landing page. */
export async function POST(request: Request) {
  if (isSupabaseConfigured) {
    const supabase = await getSupabaseServerClient();
    if (supabase) await supabase.auth.signOut();
  } else {
    await clearDemoSession();
  }
  // 303 so the browser follows with a GET after the POST.
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
