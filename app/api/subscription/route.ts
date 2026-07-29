import { NextResponse } from "next/server";
import { TRIAL_DAYS } from "@/lib/config";
import { getViewer } from "@/lib/access";
import { getStripe } from "@/lib/stripe";
import { getBillingRefs } from "@/lib/invoices";
import { getDemoSubscription, updateDemoSubscription } from "@/lib/demo-session";

/** Cancel / resume the viewer's subscription.
 *
 *  POST { action: "cancel" | "resume" }. Cancelling schedules the end of the
 *  paid period (`cancel_at_period_end`) — access is kept until then. The
 *  subscription id is always looked up server-side from the session; a client
 *  supplied id is never accepted.
 */

const DAY = 86_400_000;

export async function POST(request: Request) {
  const viewer = await getViewer();
  if (!viewer.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body: unknown = await request.json().catch(() => null);
  const action = (body as { action?: unknown } | null)?.action;
  if (action !== "cancel" && action !== "resume") {
    return NextResponse.json({ error: "bad_action" }, { status: 400 });
  }

  const stripe = getStripe();

  if (!stripe) {
    // Demo mode — the cookie-backed subscription stands in for Stripe.
    const sub = await getDemoSubscription();
    if (!sub) return NextResponse.json({ error: "no_subscription" }, { status: 400 });
    if (action === "cancel") {
      await updateDemoSubscription({ status: "canceled", cancelAtPeriodEnd: true });
    } else {
      const started = sub.memberSince ? new Date(sub.memberSince).getTime() : 0;
      const inTrial = started > 0 && Date.now() < started + TRIAL_DAYS * DAY;
      await updateDemoSubscription({
        status: inTrial ? "trialing" : "active",
        cancelAtPeriodEnd: false,
      });
    }
    return NextResponse.json({ ok: true });
  }

  try {
    const { subscriptionId } = await getBillingRefs(viewer.userId);
    if (!subscriptionId) {
      return NextResponse.json({ error: "no_subscription" }, { status: 400 });
    }
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: action === "cancel",
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "update_failed" }, { status: 502 });
  }
}
