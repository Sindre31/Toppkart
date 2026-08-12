import { describe, expect, it } from "vitest";

import { rateLimitKey, withinRateLimit } from "@/lib/rate-limit";

/** The limiter's own logic, which is the key and the failure behaviour. The
 *  counting itself is one SQL statement in `supabase/schema.sql` and is not
 *  reachable from here — there is no database in a unit test run, which is
 *  precisely the condition the fail-open path exists for and the one asserted
 *  below.
 */

function requestFrom(headers: Record<string, string>): Request {
  return new Request("https://toppkart.no/api/tilbakemelding", { method: "POST", headers });
}

describe("rateLimitKey", () => {
  it("keys on the first address in x-forwarded-for", () => {
    /* The header is a list appended to by each hop: client first, proxies
       after. Keying on the last entry would key on our own edge, which is one
       key for every visitor at once. */
    const key = rateLimitKey("tilbakemelding", requestFrom({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" }));
    const same = rateLimitKey("tilbakemelding", requestFrom({ "x-forwarded-for": "203.0.113.7" }));
    expect(key).toBe(same);
  });

  it("falls back to x-real-ip", () => {
    expect(rateLimitKey("tilbakemelding", requestFrom({ "x-real-ip": "203.0.113.7" }))).toBeTruthy();
  });

  it("gives different callers different keys", () => {
    const a = rateLimitKey("tilbakemelding", requestFrom({ "x-forwarded-for": "203.0.113.7" }));
    const b = rateLimitKey("tilbakemelding", requestFrom({ "x-forwarded-for": "203.0.113.8" }));
    expect(a).not.toBe(b);
  });

  it("gives the same caller different keys in different scopes", () => {
    /* Otherwise a second limited endpoint would spend the first one's
       allowance, and hitting the feedback limit would lock the reader out of
       something unrelated. */
    const a = rateLimitKey("tilbakemelding", requestFrom({ "x-forwarded-for": "203.0.113.7" }));
    const b = rateLimitKey("noe-annet", requestFrom({ "x-forwarded-for": "203.0.113.7" }));
    expect(a).not.toBe(b);
  });

  it("never puts the address in the key", () => {
    /* The stored key is the whole reason this is not personal data at rest. */
    const key = rateLimitKey("tilbakemelding", requestFrom({ "x-forwarded-for": "203.0.113.7" }))!;
    expect(key).not.toContain("203.0.113.7");
    expect(key).toMatch(/^tilbakemelding:[0-9a-f]{32}$/);
  });

  it("returns null when there is no address to key on", () => {
    /* Local development. Without this, every request on the machine shares one
       key and the limiter becomes a denial of service against everybody. */
    expect(rateLimitKey("tilbakemelding", requestFrom({}))).toBeNull();
    expect(rateLimitKey("tilbakemelding", requestFrom({ "x-forwarded-for": "  " }))).toBeNull();
  });
});

describe("withinRateLimit", () => {
  it("allows the request when there is no key", async () => {
    await expect(withinRateLimit(null, { limit: 1, windowSeconds: 60 })).resolves.toBe(true);
  });

  it("allows the request when there is no database to count in", async () => {
    /* Fails open, deliberately: the cost of being wrong here is turning away
       someone with something to say. `lib/admin.ts` fails closed for the
       opposite reason. */
    await expect(
      withinRateLimit("tilbakemelding:abc", { limit: 1, windowSeconds: 60 }),
    ).resolves.toBe(true);
  });
});
