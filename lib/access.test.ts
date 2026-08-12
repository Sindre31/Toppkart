import { afterEach, describe, expect, it, vi } from "vitest";

import { grantsAccess } from "@/lib/access";
import type { Subscription, SubscriptionStatus } from "@/lib/types";

/** The gate. Every guide, every GPX file and every elevation profile on the site
 *  is behind this one boolean, and it is a pure function of a row, so there is
 *  no reason for it to be untested.
 *
 *  It is also mirrored in SQL — `public.tk_has_active_subscription()` in
 *  `supabase/schema.sql` — and the two must agree. These cases are written so
 *  they can be read against that function line by line.
 */

function sub(status: SubscriptionStatus, currentPeriodEnd: string | null = null): Subscription {
  return {
    status,
    cancelAtPeriodEnd: false,
    currentPeriodEnd,
    trialEnd: null,
    memberSince: null,
    paymentMethod: null,
    plan: "maned",
  };
}

afterEach(() => {
  vi.useRealTimers();
});

describe("grantsAccess", () => {
  it("refuses a viewer with no subscription at all", () => {
    expect(grantsAccess(null)).toBe(false);
  });

  it("admits a running trial and an active subscription", () => {
    expect(grantsAccess(sub("trialing"))).toBe(true);
    expect(grantsAccess(sub("active"))).toBe(true);
  });

  /* `past_due` is the one that looks like it should pass and must not. Stripe
     sets it when a renewal charge fails, and the customer keeps it while the
     retries run — days during which the app has not been paid. `none` covers
     Stripe's half-finished states, which is where a Checkout that was abandoned
     at the card form ends up. */
  it("refuses past_due and none", () => {
    expect(grantsAccess(sub("past_due"))).toBe(false);
    expect(grantsAccess(sub("none"))).toBe(false);
  });

  describe("a cancelled subscription", () => {
    /* The rule the product promises: cancelling stops the next charge, it does
       not take away the period already paid for. Cancel on the 2nd having paid
       to the 30th, and the guides stay readable until the 30th. */
    it("keeps access until the period it paid for runs out", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-08-12T12:00:00Z"));
      expect(grantsAccess(sub("canceled", "2026-08-30T00:00:00Z"))).toBe(true);
    });

    it("loses access once that period has passed", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-08-12T12:00:00Z"));
      expect(grantsAccess(sub("canceled", "2026-08-01T00:00:00Z"))).toBe(false);
    });

    /* The boundary is strictly greater than now, so the instant the period ends
       the access does. A row that expires exactly now has been paid for up to
       this moment and not through it. */
    it("is closed at the exact moment the period ends", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-08-30T00:00:00Z"));
      expect(grantsAccess(sub("canceled", "2026-08-30T00:00:00Z"))).toBe(false);
    });

    /* A cancelled row with no period end is a row we cannot reason about. It
       must close, not open: the alternative is a free subscription created by a
       missing field. */
    it("is closed when there is no period end to check", () => {
      expect(grantsAccess(sub("canceled", null))).toBe(false);
    });

    /* `new Date("tullball").getTime()` is NaN, and every comparison against NaN
       is false — which happens to be the safe answer here. It is asserted so
       that it stays the answer if the comparison is ever rewritten. */
    it("is closed when the period end is unparseable", () => {
      expect(grantsAccess(sub("canceled", "ikke en dato"))).toBe(false);
    });
  });
});
