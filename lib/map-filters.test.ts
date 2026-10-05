import { describe, expect, it } from "vitest";

import {
  ASPECT_SECTORS,
  VERTICAL_BANDS,
  distanceM,
  formatDistance,
  inVerticalBand,
  matchesAspect,
} from "@/lib/map-filters";
import { localizeTours } from "@/lib/i18n/content";
import { TOURS } from "@/lib/tours";

describe("matchesAspect", () => {
  it("puts an intermediate direction under both of its neighbours", () => {
    expect(matchesAspect("NØ", "N")).toBe(true);
    expect(matchesAspect("NØ", "E")).toBe(true);
    expect(matchesAspect("NØ", "S")).toBe(false);
    expect(matchesAspect("NØ", "W")).toBe(false);
    expect(matchesAspect("SV", "S")).toBe(true);
    expect(matchesAspect("SV", "W")).toBe(true);
  });

  it("reads Norwegian and English codes alike", () => {
    expect(matchesAspect("Ø", "E")).toBe(true);
    expect(matchesAspect("E", "E")).toBe(true);
    expect(matchesAspect("V", "W")).toBe(true);
    expect(matchesAspect("W", "W")).toBe(true);
    expect(matchesAspect("NV", "W")).toBe(true);
    expect(matchesAspect("NW", "W")).toBe(true);
  });

  it("matches nothing for a code that is not a compass direction", () => {
    for (const sector of ASPECT_SECTORS) {
      expect(matchesAspect("", sector)).toBe(false);
      expect(matchesAspect("NNNE", sector)).toBe(false);
      expect(matchesAspect("Nord", sector)).toBe(false);
    }
  });

  it("finds every tour under at least one sector, in both languages", () => {
    for (const lang of ["no", "en"] as const) {
      for (const tour of localizeTours(TOURS, lang)) {
        const hits = ASPECT_SECTORS.filter((s) => matchesAspect(tour.aspect, s));
        expect(hits.length, `${tour.slug} (${lang}: ${tour.aspect})`).toBeGreaterThan(0);
      }
    }
  });
});

describe("inVerticalBand", () => {
  it("puts a boundary value in exactly one band", () => {
    for (const v of [0, 699, 700, 999, 1000, 1299, 1300, 2500]) {
      const hits = VERTICAL_BANDS.filter((b) => inVerticalBand(v, b.id));
      expect(hits.length, String(v)).toBe(1);
    }
    expect(inVerticalBand(1000, "1000-1300")).toBe(true);
    expect(inVerticalBand(1000, "700-1000")).toBe(false);
  });

  it("leaves no band empty on the real data", () => {
    for (const band of VERTICAL_BANDS) {
      expect(TOURS.some((t) => inVerticalBand(t.verticalM, band.id)), band.id).toBe(true);
    }
  });
});

describe("distanceM", () => {
  it("is zero to itself and symmetric", () => {
    const a = { lat: 69.65, lng: 18.96 };
    const b = { lat: 59.91, lng: 10.75 };
    expect(distanceM(a, a)).toBe(0);
    expect(distanceM(a, b)).toBeCloseTo(distanceM(b, a), 6);
  });

  it("measures Tromsø–Oslo as the known ~1150 km great circle", () => {
    const d = distanceM({ lat: 69.6492, lng: 18.9553 }, { lat: 59.9139, lng: 10.7522 });
    expect(d / 1000).toBeGreaterThan(1140);
    expect(d / 1000).toBeLessThan(1160);
  });

  it("gets a short east–west hop right at high latitude", () => {
    /* One degree of longitude at 69° N is ~40 km, not the ~111 km it is at the
       equator — the mistake an equirectangular shortcut makes. */
    const d = distanceM({ lat: 69, lng: 18 }, { lat: 69, lng: 19 });
    expect(d / 1000).toBeGreaterThan(39.5);
    expect(d / 1000).toBeLessThan(40.5);
  });
});

describe("formatDistance", () => {
  it("rounds metres to tens below a kilometre", () => {
    expect(formatDistance(847, "no")).toBe("850 m");
    expect(formatDistance(4, "en")).toBe("0 m");
    expect(formatDistance(997, "no")).toBe("1,0 km");
  });

  it("keeps one decimal below ten kilometres, with the right separator", () => {
    expect(formatDistance(4260, "no")).toBe("4,3 km");
    expect(formatDistance(4260, "en")).toBe("4.3 km");
  });

  it("drops the decimal from ten kilometres up", () => {
    expect(formatDistance(12_340, "no")).toBe("12 km");
    expect(formatDistance(9_970, "no")).toBe("10 km");
    expect(formatDistance(1_234_000, "en")).toBe("1,234 km");
  });
});
