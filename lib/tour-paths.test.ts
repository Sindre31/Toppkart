import { describe, expect, it } from "vitest";

import nextConfig from "../next.config";
import { TOUR_SLUGS_ENV, isUnknownTour, parseTourSlugs } from "@/lib/tour-paths";
import { TOURS } from "@/lib/tours";

/** Middleware svarer 404 på `/tur/<slug>` for alt som ikke står i lista, så
 *  lista må være nøyaktig turene. En slug for mye er en myk 404 igjen; en for
 *  lite er en ekte tur som svarer «finnes ikke». */

const known = parseTourSlugs(nextConfig.env?.[TOUR_SLUGS_ENV]);

describe("the slug list next.config.ts builds", () => {
  it("is exactly the tours", () => {
    expect([...known].sort()).toEqual(TOURS.map((t) => t.slug).sort());
  });

  it("lets every tour through", () => {
    for (const tour of TOURS) expect(isUnknownTour(`/tur/${tour.slug}`, known), tour.slug).toBe(false);
  });
});

describe("isUnknownTour", () => {
  const slugs = new Set(["slogen", "kirketaket"]);

  it("flags a slug that is not a tour", () => {
    expect(isUnknownTour("/tur/finnesikke", slugs)).toBe(true);
    expect(isUnknownTour("/tur/finnesikke/", slugs)).toBe(true);
    expect(isUnknownTour("/tur/SLOGEN", slugs)).toBe(true);
    expect(isUnknownTour("/tur/%E0%A4%A", slugs)).toBe(true);
  });

  it("leaves known tours and every other path alone", () => {
    expect(isUnknownTour("/tur/slogen", slugs)).toBe(false);
    expect(isUnknownTour("/tur/slogen/", slugs)).toBe(false);
    expect(isUnknownTour("/turer", slugs)).toBe(false);
    expect(isUnknownTour("/tur", slugs)).toBe(false);
    expect(isUnknownTour("/kart", slugs)).toBe(false);
    expect(isUnknownTour("/tur/slogen/noe", slugs)).toBe(false);
  });

  it("decodes before comparing", () => {
    expect(isUnknownTour("/tur/kirke%74aket", slugs)).toBe(false);
  });

  it("fails open without a list", () => {
    expect(isUnknownTour("/tur/finnesikke", new Set())).toBe(false);
  });
});
