import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/** Unit tests. Node environment, no DOM, no browser.
 *
 *  What is tested is deliberately narrow: the pure functions where being wrong
 *  produces a working request and a false answer. The gate in `lib/access.ts`,
 *  the Stripe mapping in `lib/stripe-mapping.ts`, and the route geometry in
 *  `lib/tours.ts`. Those three decide, respectively, who may read what, what a
 *  subscription row says, and where a line on the map goes — and none of them
 *  throws when it is wrong.
 *
 *  Everything that talks to Supabase, Stripe or Resend stays out. Testing it
 *  would mean mocking three SDKs, and a mock is a statement about how the API
 *  behaves — which is exactly the thing the test could not have caught anyway
 *  (see `periodEndFor`, wrong because Stripe moved a field, in a way any mock
 *  written at the time would have reproduced faithfully).
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
});
