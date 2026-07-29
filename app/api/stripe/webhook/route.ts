import type Stripe from "stripe";
import { NextResponse } from "next/server";
import { env } from "@/lib/config";
import { getStripe } from "@/lib/stripe";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { sendReceiptEmail, sendWelcomeEmail } from "@/lib/email";
import type { SubscriptionStatus } from "@/lib/types";

/** Stripe webhook — the only writer of `public.subscriptions`.
 *
 *  Stripe signs the raw request body, so this handler must run on Node (not the
 *  Edge runtime, which would hand us a stream we cannot re-read) and must read
 *  `await request.text()` before anything parses it as JSON.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SupabaseAdmin = NonNullable<ReturnType<typeof getSupabaseAdminClient>>;

interface CardFields {
  card_brand: string;
  card_last4: string;
  card_exp_month: number;
  card_exp_year: number;
}

interface SubscriptionRow {
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: SubscriptionStatus;
  plan: "maned" | "ar";
  cancel_at_period_end: boolean;
  current_period_end: string | null;
  trial_end: string | null;
  card_brand?: string | null;
  card_last4?: string | null;
  card_exp_month?: number | null;
  card_exp_year?: number | null;
}

// ---------------------------------------------------------------------------
// Mapping helpers
// ---------------------------------------------------------------------------

/** Stripe has eight subscription statuses; the app has five. Anything that
 *  means "the customer paid or is trialing" grants access, anything terminal
 *  maps to `canceled`, and the half-finished states map to `none` so they never
 *  accidentally open the paywall. */
function mapStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  switch (status) {
    case "trialing":
      return "trialing";
    case "active":
      return "active";
    case "past_due":
      return "past_due";
    case "canceled":
    case "unpaid":
    case "incomplete_expired":
      return "canceled";
    case "incomplete":
    case "paused":
    default:
      return "none";
  }
}

function planFromPriceId(priceId: string | null | undefined): "maned" | "ar" | null {
  if (!priceId) return null;
  if (env.stripePriceYearly && priceId === env.stripePriceYearly) return "ar";
  if (env.stripePriceMonthly && priceId === env.stripePriceMonthly) return "maned";
  return null;
}

/** Plan comes from the configured price ids; the billing interval is the
 *  fallback for test-mode prices that were created outside the env config. */
function planFor(subscription: Stripe.Subscription): "maned" | "ar" {
  const item = subscription.items.data[0];
  const fromPrice = planFromPriceId(item?.price?.id);
  if (fromPrice) return fromPrice;
  return item?.price?.recurring?.interval === "year" ? "ar" : "maned";
}

function toIso(seconds: number | null | undefined): string | null {
  if (typeof seconds !== "number") return null;
  return new Date(seconds * 1000).toISOString();
}

/** As of the 2025 Stripe API versions `current_period_end` lives on the
 *  subscription *item*, not on the subscription. Take the furthest one out. */
function periodEndFor(subscription: Stripe.Subscription): string | null {
  const ends = subscription.items.data
    .map((item) => item.current_period_end)
    .filter((value): value is number => typeof value === "number");
  if (!ends.length) return null;
  return toIso(Math.max(...ends));
}

function idOf(value: string | { id: string } | null | undefined): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

/** Card details for «Betalingsmetode» on Min side. The default payment method
 *  usually arrives as a bare id on webhook payloads, so it has to be fetched. */
async function cardFieldsFor(
  stripe: Stripe,
  subscription: Stripe.Subscription,
): Promise<CardFields | null> {
  const pm = subscription.default_payment_method;
  let paymentMethod: Stripe.PaymentMethod | null = null;

  if (pm && typeof pm !== "string") {
    paymentMethod = pm;
  } else if (typeof pm === "string") {
    try {
      paymentMethod = await stripe.paymentMethods.retrieve(pm);
    } catch (error) {
      console.warn("[stripe-webhook] kunne ikke hente betalingsmetode", pm, error);
      return null;
    }
  }

  const card = paymentMethod?.card;
  if (!card) return null;

  return {
    // Stripe reports «visa»; Min side renders «Visa •••• 4242».
    card_brand: card.brand.charAt(0).toUpperCase() + card.brand.slice(1),
    card_last4: card.last4,
    card_exp_month: card.exp_month,
    card_exp_year: card.exp_year,
  };
}

// ---------------------------------------------------------------------------
// Resolving the app user behind a Stripe customer
// ---------------------------------------------------------------------------

async function userIdByCustomerId(admin: SupabaseAdmin, customerId: string | null): Promise<string | null> {
  if (!customerId) return null;
  const { data } = await admin
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();
  return data?.user_id ?? null;
}

async function userIdByEmail(admin: SupabaseAdmin, email: string | null | undefined): Promise<string | null> {
  if (!email) return null;
  for (const candidate of [email, email.toLowerCase()]) {
    const { data } = await admin
      .from("profiles")
      .select("user_id")
      .eq("email", candidate)
      .maybeSingle();
    if (data?.user_id) return data.user_id;
  }
  return null;
}

/** The email Stripe holds for a customer, used as the last resort for both user
 *  resolution and for addressing the receipt. */
async function customerEmail(stripe: Stripe, customerId: string | null): Promise<string | null> {
  if (!customerId) return null;
  try {
    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) return null;
    return customer.email ?? null;
  } catch (error) {
    console.warn("[stripe-webhook] kunne ikke hente kunde", customerId, error);
    return null;
  }
}

interface ResolveInput {
  clientReferenceId?: string | null;
  customerId: string | null;
  email?: string | null;
}

/** Prefer `client_reference_id` — that is the Supabase user id we handed to
 *  Checkout. Then the customer id we have already stored, then the email. */
async function resolveUserId(
  admin: SupabaseAdmin,
  stripe: Stripe,
  input: ResolveInput,
): Promise<string | null> {
  if (input.clientReferenceId) return input.clientReferenceId;

  const byCustomer = await userIdByCustomerId(admin, input.customerId);
  if (byCustomer) return byCustomer;

  const byEmail = await userIdByEmail(admin, input.email);
  if (byEmail) return byEmail;

  return userIdByEmail(admin, await customerEmail(stripe, input.customerId));
}

// ---------------------------------------------------------------------------
// Writes
// ---------------------------------------------------------------------------

async function upsertSubscription(admin: SupabaseAdmin, row: SubscriptionRow): Promise<void> {
  const { error } = await admin.from("subscriptions").upsert(row, { onConflict: "user_id" });
  if (error) {
    // Rethrown so the outer handler logs it; Stripe will retry the delivery.
    throw new Error(`subscriptions upsert failed: ${error.message}`);
  }
}

async function syncSubscription(
  admin: SupabaseAdmin,
  stripe: Stripe,
  subscription: Stripe.Subscription,
  userId: string,
  statusOverride?: SubscriptionStatus,
): Promise<SubscriptionRow> {
  const card = await cardFieldsFor(stripe, subscription);
  const row: SubscriptionRow = {
    user_id: userId,
    stripe_customer_id: idOf(subscription.customer),
    stripe_subscription_id: subscription.id,
    status: statusOverride ?? mapStatus(subscription.status),
    plan: planFor(subscription),
    cancel_at_period_end: subscription.cancel_at_period_end,
    current_period_end: periodEndFor(subscription),
    trial_end: toIso(subscription.trial_end),
    ...(card ?? {}),
  };
  await upsertSubscription(admin, row);
  return row;
}

async function retrieveSubscription(stripe: Stripe, id: string | null): Promise<Stripe.Subscription | null> {
  if (!id) return null;
  try {
    return await stripe.subscriptions.retrieve(id, { expand: ["default_payment_method"] });
  } catch (error) {
    console.warn("[stripe-webhook] kunne ikke hente abonnement", id, error);
    return null;
  }
}

/** The invoice mirror is a convenience for «02 · Kvitteringer» on Min side.
 *  Stripe stays the source of truth, so a failure here is logged, not fatal. */
async function mirrorInvoice(
  admin: SupabaseAdmin,
  invoice: Stripe.Invoice,
  userId: string,
): Promise<void> {
  if (!invoice.id) return;
  const { error } = await admin.from("invoices").upsert(
    {
      id: invoice.id,
      user_id: userId,
      amount_total: invoice.amount_paid || invoice.total,
      currency: invoice.currency,
      status: invoice.status,
      hosted_invoice_url: invoice.hosted_invoice_url ?? null,
      invoice_pdf: invoice.invoice_pdf ?? null,
    },
    { onConflict: "id" },
  );
  if (error) console.warn("[stripe-webhook] kunne ikke speile faktura", invoice.id, error.message);
}

function subscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
  return idOf(invoice.parent?.subscription_details?.subscription ?? null);
}

// ---------------------------------------------------------------------------
// Event handlers
// ---------------------------------------------------------------------------

async function handleCheckoutCompleted(
  admin: SupabaseAdmin,
  stripe: Stripe,
  session: Stripe.Checkout.Session,
): Promise<void> {
  if (session.mode !== "subscription") return;

  const customerId = idOf(session.customer);
  const email = session.customer_details?.email ?? session.customer_email ?? null;

  const userId = await resolveUserId(admin, stripe, {
    clientReferenceId: session.client_reference_id,
    customerId,
    email,
  });

  if (!userId) {
    // Nothing to attach the subscription to. Answering 200 anyway is deliberate:
    // a 4xx/5xx here would make Stripe retry this delivery for days without the
    // outcome ever changing. The event is logged so it can be replayed by hand
    // once the account exists.
    console.error(
      "[stripe-webhook] checkout.session.completed uten brukertreff",
      JSON.stringify({ session: session.id, customerId, email }),
    );
    return;
  }

  const subscription = await retrieveSubscription(stripe, idOf(session.subscription));
  if (!subscription) return;

  const row = await syncSubscription(admin, stripe, subscription, userId);

  const recipient = email ?? (await customerEmail(stripe, customerId));
  if (!recipient) return;

  await sendWelcomeEmail({ to: recipient, trialEnd: row.trial_end, plan: row.plan });

  // Trials are charged 0 kr today, so a receipt only makes sense when the
  // session actually collected money (a subscription started without a trial).
  if (session.amount_total && session.amount_total > 0) {
    await sendReceiptEmail({
      to: recipient,
      amountTotal: session.amount_total,
      currency: session.currency ?? "nok",
      periodEnd: row.current_period_end,
      plan: row.plan,
    });
  }
}

async function handleSubscriptionEvent(
  admin: SupabaseAdmin,
  stripe: Stripe,
  subscription: Stripe.Subscription,
  statusOverride?: SubscriptionStatus,
): Promise<void> {
  const customerId = idOf(subscription.customer);
  const userId = await resolveUserId(admin, stripe, { customerId });

  if (!userId) {
    // Same reasoning as above: log and return 200 rather than retry forever.
    console.error(
      "[stripe-webhook] abonnementshendelse uten brukertreff",
      JSON.stringify({ subscription: subscription.id, customerId }),
    );
    return;
  }

  await syncSubscription(admin, stripe, subscription, userId, statusOverride);
}

async function handleInvoicePaid(
  admin: SupabaseAdmin,
  stripe: Stripe,
  invoice: Stripe.Invoice,
): Promise<void> {
  const customerId = idOf(invoice.customer);
  const email = invoice.customer_email ?? null;
  const userId = await resolveUserId(admin, stripe, { customerId, email });

  if (!userId) {
    console.error(
      "[stripe-webhook] invoice.paid uten brukertreff",
      JSON.stringify({ invoice: invoice.id, customerId, email }),
    );
    return;
  }

  await mirrorInvoice(admin, invoice, userId);

  // A paid invoice moves the period forward and flips trialing → active.
  const subscription = await retrieveSubscription(stripe, subscriptionIdFromInvoice(invoice));
  const row = subscription ? await syncSubscription(admin, stripe, subscription, userId) : null;

  const recipient = email ?? (await customerEmail(stripe, customerId));
  const amount = invoice.amount_paid || invoice.total;
  if (!recipient || amount <= 0) return;

  await sendReceiptEmail({
    to: recipient,
    amountTotal: amount,
    currency: invoice.currency,
    invoiceNumber: invoice.number,
    periodEnd: row?.current_period_end ?? null,
    hostedInvoiceUrl: invoice.hosted_invoice_url,
    invoicePdf: invoice.invoice_pdf,
    plan: row?.plan ?? "maned",
  });
}

async function handleInvoicePaymentFailed(
  admin: SupabaseAdmin,
  stripe: Stripe,
  invoice: Stripe.Invoice,
): Promise<void> {
  const subscription = await retrieveSubscription(stripe, subscriptionIdFromInvoice(invoice));
  if (!subscription) return;
  // Stripe reports `past_due` on the subscription itself, but not always before
  // this event lands, so the status is forced.
  await handleSubscriptionEvent(admin, stripe, subscription, "past_due");
}

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

export async function POST(request: Request): Promise<NextResponse> {
  const stripe = getStripe();
  const admin = getSupabaseAdminClient();

  // Demo mode: keys absent. Answer honestly instead of throwing — nothing in
  // the app depends on this route being live for the flow to be walkable.
  if (!stripe || !env.stripeWebhookSecret) {
    return NextResponse.json(
      { error: "Stripe er ikke konfigurert. Sett STRIPE_SECRET_KEY og STRIPE_WEBHOOK_SECRET." },
      { status: 503 },
    );
  }
  if (!admin) {
    return NextResponse.json(
      { error: "Supabase er ikke konfigurert. Sett NEXT_PUBLIC_SUPABASE_URL og SUPABASE_SERVICE_ROLE_KEY." },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Mangler stripe-signature-header." }, { status: 400 });
  }

  // Raw body, byte for byte. Anything that re-serialises it breaks the signature.
  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, env.stripeWebhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "ukjent feil";
    console.warn("[stripe-webhook] ugyldig signatur:", message);
    return NextResponse.json({ error: `Ugyldig signatur: ${message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(admin, stripe, event.data.object);
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionEvent(admin, stripe, event.data.object);
        break;

      case "customer.subscription.deleted":
        // Deleted means gone for good; access still runs to current_period_end,
        // which grantsAccess() in lib/access.ts honours.
        await handleSubscriptionEvent(admin, stripe, event.data.object, "canceled");
        break;

      case "invoice.paid":
        await handleInvoicePaid(admin, stripe, event.data.object);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(admin, stripe, event.data.object);
        break;

      default:
        // Everything else is subscribed to by mistake or by a future feature.
        break;
    }
  } catch (error) {
    // A genuine failure (Supabase down, Stripe unreachable). 500 lets Stripe
    // retry with backoff, which is what we want here — unlike an unresolvable
    // user, this will succeed on a later attempt.
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[stripe-webhook] ${event.type} feilet:`, message);
    return NextResponse.json({ error: message }, { status: 500 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
