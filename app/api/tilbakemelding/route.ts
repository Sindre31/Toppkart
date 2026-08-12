import { NextResponse } from "next/server";

import { getViewer } from "@/lib/access";
import { FEEDBACK_MAX_LENGTH } from "@/lib/i18n/feedback";
import { rateLimitKey, withinRateLimit } from "@/lib/rate-limit";
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
 *
 *  That decision is what makes the rate limit necessary. An open write endpoint
 *  with a honeypot is protected against a form filler that fills in every field
 *  it finds, and against nothing else — anyone who opens the network tab sees
 *  one POST with three fields in it and can repeat it in a loop. The limit is
 *  the second half of the same decision: the door stays open, but nobody gets
 *  to come through it a thousand times a minute.
 */
export const runtime = "nodejs";

/** Ti på timen, per avsender.
 *
 *  Satt der en som mener noe aldri kommer til å merke det. Har du ti ting å si
 *  om Toppkart i løpet av en time, er du en av de mest engasjerte leserne
 *  nettstedet har, og den ellevte kan vente til neste time — eller gå til
 *  support-adressa, som ikke er her og ikke er begrenset. */
const FEEDBACK_RATE = { limit: 10, windowSeconds: 60 * 60 } as const;

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

  /* Etter innholdssjekkene, før skrivinga. En tom melding koster ingen rad og
     skal ikke koste noen et oppslag heller; det er den gyldige meldinga i loop
     som er problemet, og den blir talt her. */
  if (!(await withinRateLimit(rateLimitKey("tilbakemelding", request), FEEDBACK_RATE))) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const viewer = await getViewer();
  /* Demo mode hands out `demo:<e-post>` as a user id. That is not a uuid and
     has no row in auth.users, so it would fail the foreign key. */
  const userId = viewer.userId && !viewer.userId.startsWith("demo:") ? viewer.userId : null;

  const { error } = await admin.from("tk_feedback").insert({
    user_id: userId,
    email: viewer.email,
    message,
    path: str(payload.path).slice(0, 512) || null,
    lang: payload.lang === "en" ? "en" : "no",
  });

  if (error) {
    console.error("[tilbakemelding] kunne ikke lagre:", error.message);
    return NextResponse.json({ error: "unavailable" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
