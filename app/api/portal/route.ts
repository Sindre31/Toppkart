import { NextResponse } from "next/server";
import { env } from "@/lib/config";
import { getViewer } from "@/lib/access";
import { getStripe } from "@/lib/stripe";
import { getBillingRefs } from "@/lib/invoices";

/** Stripe Customer Portal — «Endre betalingsmetode» on /min-side.
 *  The session is always re-checked here; nothing is trusted from the client. */
export async function POST() {
  const viewer = await getViewer();
  if (!viewer.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const stripe = getStripe();
  if (!stripe) {
    // Demo mode: no billing keys configured. The UI explains this in Norwegian.
    return NextResponse.json({ demo: true });
  }

  try {
    const { customerId } = await getBillingRefs(viewer.userId);
    if (!customerId) {
      return NextResponse.json({ error: "no_customer" }, { status: 400 });
    }
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${env.siteUrl}/min-side`,
    });
    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "portal_failed" }, { status: 502 });
  }
}
