import Stripe from "stripe";
import { env, isStripeConfigured } from "@/lib/config";

let cached: Stripe | null = null;

/** Stripe client, or null when no secret key is configured (demo mode). */
export function getStripe(): Stripe | null {
  if (!isStripeConfigured) return null;
  cached ??= new Stripe(env.stripeSecretKey, { typescript: true });
  return cached;
}

export function priceIdFor(plan: "maned" | "ar"): string {
  return plan === "ar" ? env.stripePriceYearly : env.stripePriceMonthly;
}
