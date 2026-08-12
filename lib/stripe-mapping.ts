import type Stripe from "stripe";

import { env } from "@/lib/config";
import type { SubscriptionStatus } from "@/lib/types";

/** Reading a Stripe object into the shape this app stores.
 *
 *  These lived inside `app/api/stripe/webhook/route.ts` until they needed
 *  testing. They are the part of the webhook that can be wrong without anything
 *  failing: a status mapped to the wrong side of the paywall, or a period end
 *  read off a field Stripe has moved, produces a perfectly successful request
 *  and a subscription row that lies. Nothing else in the file is like that —
 *  the rest talks to Stripe or Postgres and complains loudly when it cannot.
 *
 *  So they are separated by testability rather than by subject: everything here
 *  is a pure function of its arguments, `lib/stripe-mapping.test.ts` covers all
 *  of it, and the route keeps the half that needs the network.
 */

/** Stripe has eight subscription statuses; the app has five. Anything that
 *  means "the customer paid or is trialing" grants access, anything terminal
 *  maps to `canceled`, and the half-finished states map to `none` so they never
 *  accidentally open the paywall. */
export function mapStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
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

export function planFromPriceId(priceId: string | null | undefined): "maned" | "ar" | null {
  if (!priceId) return null;
  if (env.stripePriceYearly && priceId === env.stripePriceYearly) return "ar";
  if (env.stripePriceMonthly && priceId === env.stripePriceMonthly) return "maned";
  return null;
}

/** Plan comes from the configured price ids; the billing interval is the
 *  fallback for test-mode prices that were created outside the env config. */
export function planFor(subscription: Stripe.Subscription): "maned" | "ar" {
  const item = subscription.items.data[0];
  const fromPrice = planFromPriceId(item?.price?.id);
  if (fromPrice) return fromPrice;
  return item?.price?.recurring?.interval === "year" ? "ar" : "maned";
}

export function toIso(seconds: number | null | undefined): string | null {
  if (typeof seconds !== "number") return null;
  return new Date(seconds * 1000).toISOString();
}

/** As of the 2025 Stripe API versions `current_period_end` lives on the
 *  subscription *item*, not on the subscription. Take the furthest one out. */
export function periodEndFor(subscription: Stripe.Subscription): string | null {
  const ends = subscription.items.data
    .map((item) => item.current_period_end)
    .filter((value): value is number => typeof value === "number");
  if (!ends.length) return null;
  return toIso(Math.max(...ends));
}

export function idOf(value: string | { id: string } | null | undefined): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

export function subscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
  return idOf(invoice.parent?.subscription_details?.subscription ?? null);
}
