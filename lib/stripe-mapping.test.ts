import type Stripe from "stripe";
import { describe, expect, it } from "vitest";

import {
  idOf,
  mapStatus,
  periodEndFor,
  planFor,
  subscriptionIdFromInvoice,
  toIso,
} from "@/lib/stripe-mapping";

/** The Stripe reading layer.
 *
 *  These fail quietly by construction: every one of them returns a plausible
 *  value for input it has misunderstood, the webhook writes that value, and the
 *  request comes back 200. The row is then wrong until somebody complains.
 */

/* Only the fields the functions under test actually read. A full
   `Stripe.Subscription` fixture would be four hundred lines of things nobody
   here looks at, and it would go stale the next time Stripe adds a field. */
function subscription(overrides: {
  status?: Stripe.Subscription.Status;
  items?: { priceId?: string; interval?: "month" | "year"; periodEnd?: number | null }[];
}): Stripe.Subscription {
  const items = overrides.items ?? [{ interval: "month" }];
  return {
    status: overrides.status ?? "active",
    items: {
      data: items.map((item) => ({
        price: {
          id: item.priceId,
          recurring: item.interval ? { interval: item.interval } : undefined,
        },
        current_period_end: item.periodEnd,
      })),
    },
  } as unknown as Stripe.Subscription;
}

describe("mapStatus", () => {
  it("passes the two statuses that grant access straight through", () => {
    expect(mapStatus("trialing")).toBe("trialing");
    expect(mapStatus("active")).toBe("active");
  });

  it("keeps past_due distinct — the app shows it, it does not grant on it", () => {
    expect(mapStatus("past_due")).toBe("past_due");
  });

  /* All three mean the same thing to this app: over, and not coming back.
     `unpaid` is where Stripe parks a subscription after the retries are
     exhausted; `incomplete_expired` is a Checkout whose first payment never
     completed within the window. */
  it("folds every terminal status into canceled", () => {
    expect(mapStatus("canceled")).toBe("canceled");
    expect(mapStatus("unpaid")).toBe("canceled");
    expect(mapStatus("incomplete_expired")).toBe("canceled");
  });

  /* The load-bearing case. `incomplete` is a subscription whose first charge
     has not gone through yet — Stripe creates it the moment Checkout starts,
     before any money moves. Mapping it anywhere near «active» hands the guides
     to anyone who opens the payment page and closes it. */
  it("maps the half-finished statuses to none, never to access", () => {
    expect(mapStatus("incomplete")).toBe("none");
    expect(mapStatus("paused")).toBe("none");
  });

  /* Stripe has added statuses before and will again. Whatever arrives next must
     land on the closed side of the gate without anyone having to remember to
     handle it. */
  it("maps an unknown future status to none", () => {
    expect(mapStatus("noe-stripe-fant-på" as Stripe.Subscription.Status)).toBe("none");
  });
});

describe("planFor", () => {
  /* No env price ids are set in the test run, so this exercises the interval
     fallback — which is the path a test-mode price created by hand takes. */
  it("reads the plan off the billing interval when no price id matches", () => {
    expect(planFor(subscription({ items: [{ interval: "year" }] }))).toBe("ar");
    expect(planFor(subscription({ items: [{ interval: "month" }] }))).toBe("maned");
  });

  it("falls back to monthly for a subscription with no items", () => {
    expect(planFor(subscription({ items: [] }))).toBe("maned");
  });
});

describe("periodEndFor", () => {
  /* This is the one that broke. Stripe moved `current_period_end` off the
     subscription and onto the item in the 2025 API versions; read from the old
     place it is `undefined`, which stores as null, which makes a cancelled
     subscription lose access immediately instead of at the end of the month. */
  it("reads the period end off the item, not the subscription", () => {
    const end = Math.floor(Date.parse("2026-09-01T00:00:00Z") / 1000);
    expect(periodEndFor(subscription({ items: [{ periodEnd: end }] }))).toBe(
      "2026-09-01T00:00:00.000Z",
    );
  });

  it("takes the furthest end when a subscription has several items", () => {
    const near = Math.floor(Date.parse("2026-09-01T00:00:00Z") / 1000);
    const far = Math.floor(Date.parse("2026-12-01T00:00:00Z") / 1000);
    expect(
      periodEndFor(subscription({ items: [{ periodEnd: near }, { periodEnd: far }] })),
    ).toBe("2026-12-01T00:00:00.000Z");
  });

  it("returns null rather than a wrong date when no item carries one", () => {
    expect(periodEndFor(subscription({ items: [{ periodEnd: null }] }))).toBeNull();
    expect(periodEndFor(subscription({ items: [] }))).toBeNull();
  });
});

describe("toIso", () => {
  it("reads Stripe's seconds as seconds", () => {
    // 1 767 225 600 is 2026-01-01T00:00:00Z. Off by a factor of 1000 and this
    // lands in 1970, which is a date the app would happily store.
    expect(toIso(1_767_225_600)).toBe("2026-01-01T00:00:00.000Z");
  });

  it("returns null for missing input", () => {
    expect(toIso(null)).toBeNull();
    expect(toIso(undefined)).toBeNull();
  });

  /* Zero is a real timestamp to `typeof value === "number"` and a falsy value to
     anything written with `if (!value)`. It has to survive as a date. */
  it("treats 0 as a timestamp and not as absent", () => {
    expect(toIso(0)).toBe("1970-01-01T00:00:00.000Z");
  });
});

describe("idOf", () => {
  it("accepts both shapes Stripe sends an association in", () => {
    expect(idOf("cus_123")).toBe("cus_123");
    expect(idOf({ id: "cus_123" })).toBe("cus_123");
  });

  it("returns null for absent", () => {
    expect(idOf(null)).toBeNull();
    expect(idOf(undefined)).toBeNull();
  });
});

describe("subscriptionIdFromInvoice", () => {
  /* Also moved: the subscription an invoice belongs to now hangs off
     `parent.subscription_details` rather than a top-level `subscription`. */
  it("digs the subscription id out of the invoice parent", () => {
    const invoice = {
      parent: { subscription_details: { subscription: "sub_123" } },
    } as unknown as Stripe.Invoice;
    expect(subscriptionIdFromInvoice(invoice)).toBe("sub_123");
  });

  it("returns null for an invoice with no subscription behind it", () => {
    expect(subscriptionIdFromInvoice({} as Stripe.Invoice)).toBeNull();
  });
});
