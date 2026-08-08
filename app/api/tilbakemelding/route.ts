import { NextResponse } from "next/server";

import { getViewer } from "@/lib/access";
import { sendFeedbackNotice } from "@/lib/email";
import type { Lang } from "@/lib/i18n";
import { FEEDBACK_MAX_LENGTH } from "@/lib/i18n/feedback";
import { requestOrigin } from "@/lib/origin";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

/** «Gi tilbakemelding» — writes one row to `tk_feedback`.
 *
 *  The service role is what writes: the table has RLS on and no policies, so
 *  neither `anon` nor `authenticated` can reach it from the browser. That also
 *  means nothing reads it back through the app — open it in the SQL editor.
 *
 *  Signing in is not required. The people most likely to have something useful
 *  to say are the ones who have not signed up, and turning them away to protect
 *  an inbox would lose exactly the feedback worth having.
 */
export const runtime = "nodejs";

type Payload = Record<string, unknown>;

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export async function POST(request: Request) {
  let payload: Payload = {};
  try {
    const parsed: unknown = await request.json();
    if (parsed && typeof parsed === "object") payload = parsed as Payload;
  } catch {
    payload = {};
  }

  /* Honeypot. The field is hidden and labelled as something a form-filler wants
     to complete, so a human never touches it and a naive bot always does.
     Answering 200 rather than an error keeps the bot from learning what tripped
     it — an honest rejection here is just a hint to try again differently. */
  if (str(payload.selskap).trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const message = str(payload.message).trim();
  if (!message) {
    return NextResponse.json({ error: "empty" }, { status: 400 });
  }
  if (message.length > FEEDBACK_MAX_LENGTH) {
    return NextResponse.json({ error: "too_long" }, { status: 400 });
  }

  const admin = getSupabaseAdminClient();
  if (!admin) {
    console.warn("[tilbakemelding] SUPABASE_SERVICE_ROLE_KEY mangler — ingenting lagret");
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  const viewer = await getViewer();
  /* Demo mode hands out `demo:<e-post>` as a user id. That is not a uuid and
     has no row in auth.users, so it would fail the foreign key. */
  const userId = viewer.userId && !viewer.userId.startsWith("demo:") ? viewer.userId : null;

  const path = str(payload.path).slice(0, 512) || null;
  const lang: Lang = payload.lang === "en" ? "en" : "no";

  const { error } = await admin.from("tk_feedback").insert({
    user_id: userId,
    email: viewer.email,
    message,
    path,
    lang,
  });

  if (error) {
    console.error("[tilbakemelding] kunne ikke lagre:", error.message);
    return NextResponse.json({ error: "unavailable" }, { status: 502 });
  }

  /* Tell whoever is in `ADMIN_EMAILS`. The row is already written, and the
     reader's submission succeeded the moment it was — so a mail server having
     a bad day must not turn their «takk» into an error. `sendFeedbackNotice`
     never throws, and the `catch` is there for the case where that stops being
     true rather than because it currently can.
     Awaited rather than fired and forgotten: on a serverless runtime the
     function can be frozen the instant the response is returned, and a promise
     nobody is waiting on is a promise that may never run. */
  try {
    await sendFeedbackNotice({
      message,
      from: viewer.email,
      path,
      readerLang: lang,
      origin: requestOrigin(request),
    });
  } catch (cause) {
    console.error("[tilbakemelding] varsel feilet:", cause);
  }

  return NextResponse.json({ ok: true });
}
