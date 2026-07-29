import { NextResponse } from "next/server";

import { getViewer } from "@/lib/access";
import { TRIAL_DAYS, env, isStripeConfigured } from "@/lib/config";
import { getDemoEmail, setDemoEmail, startDemoSubscription } from "@/lib/demo-session";
import { getStripe, priceIdFor } from "@/lib/stripe";

/** Starts the 14-day trial.
 *
 *  live: creates a hosted Stripe Checkout session (subscription, card required
 *  at signup) and hands the client its URL. demo: flips the cookie-backed
 *  subscription on so the rest of the flow stays walkable without keys.
 *
 *  This route never receives card details — in live mode the card is entered on
 *  Stripe's own page, in demo mode the card form is a drawing.
 */

type Plan = "maned" | "ar";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isPlan(value: unknown): value is Plan {
  return value === "maned" || value === "ar";
}

function readEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return EMAIL_RE.test(trimmed) ? trimmed : null;
}

export async function POST(request: Request) {
  let payload: Record<string, unknown> = {};
  try {
    const parsed: unknown = await request.json();
    if (parsed && typeof parsed === "object") payload = parsed as Record<string, unknown>;
  } catch {
    payload = {};
  }

  const plan = payload.plan ?? "maned";
  if (!isPlan(plan)) {
    return NextResponse.json({ error: "Ukjent abonnement. Velg månedlig eller årlig." }, { status: 400 });
  }
  const email = readEmail(payload.email);

  const stripe = getStripe();

  /* ── demo mode ─────────────────────────────────────────────────────────── */
  if (!isStripeConfigured || !stripe) {
    const existing = await getDemoEmail();
    if (!existing) {
      if (!email) {
        return NextResponse.json({ error: "Skriv inn en gyldig e-postadresse." }, { status: 400 });
      }
      await setDemoEmail(email);
    }
    await startDemoSubscription(plan);
    return NextResponse.json({ ok: true, demo: true });
  }

  /* ── live mode ─────────────────────────────────────────────────────────── */
  const price = priceIdFor(plan);
  if (!price) {
    return NextResponse.json(
      { error: "Prisen for dette abonnementet er ikke satt opp ennå. Prøv igjen senere." },
      { status: 503 },
    );
  }

  const viewer = await getViewer();
  const customerEmail = viewer.email ?? email;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      subscription_data: { trial_period_days: TRIAL_DAYS },
      // Kort kreves ved oppstart — første trekk skjer etter prøveperioden.
      payment_method_collection: "always",
      ...(customerEmail ? { customer_email: customerEmail } : {}),
      ...(viewer.userId ? { client_reference_id: viewer.userId } : {}),
      success_url: `${env.siteUrl}/betaling?status=ok`,
      cancel_url: `${env.siteUrl}/betaling`,
      allow_promotion_codes: true,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Fikk ikke svar fra betalingsleverandøren. Prøv igjen om litt." },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      { error: "Vi fikk ikke startet betalingen. Prøv igjen om litt." },
      { status: 502 },
    );
  }
}
