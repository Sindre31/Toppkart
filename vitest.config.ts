import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/** Unit tests. Node environment, no DOM, no browser.
 *
 *  What is tested is deliberately narrow: the pure functions where being wrong
 *  produces a working request and a false answer — the route geometry in
 *  `lib/tours.ts`, the stored favourites in `lib/tour-marks.ts`, the map
 *  coverage in `lib/map-tiles.ts` — none of which throws when it is wrong.
 *
 *  Everything that talks to Supabase stays out. Testing it would mean mocking
 *  the SDK, and a mock is a statement about how the API behaves — which is
 *  exactly the thing the test could not have caught anyway.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts", "components/**/*.test.ts"],
  },
});
