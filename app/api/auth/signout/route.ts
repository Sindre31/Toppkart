import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/config";
import { clearDemoSession } from "@/lib/demo-session";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { CLEAR_OFFLINE_HEADERS } from "@/lib/offline/clear";

/** POST — ends the session (Supabase in live mode, cookies in demo) and
 *  returns the visitor to the landing page. Tours saved for offline use go with
 *  it; see `lib/offline/clear.ts`. */
export async function POST(request: Request) {
  if (isSupabaseConfigured) {
    const supabase = await getSupabaseServerClient();
    if (supabase) await supabase.auth.signOut();
  } else {
    await clearDemoSession();
  }
  // 303 so the browser follows with a GET after the POST.
  return NextResponse.redirect(new URL("/", request.url), {
    status: 303,
    headers: CLEAR_OFFLINE_HEADERS,
  });
}
