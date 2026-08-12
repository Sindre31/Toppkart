import { describe, expect, it } from "vitest";

import {
  REGIONS,
  TOURS,
  getTour,
  regionAnchor,
  routeById,
  routeFor,
  routeProfile,
  routesFor,
  toursInRegion,
} from "@/lib/tours";

/** The tour data and the geometry read off it.
 *
 *  The Python checks under `scripts/build-routes/` are the real audit — they
 *  measure every line against Kartverket's terrain model and against mapped
 *  ground, which nothing in this process can do. What they cannot do is run in
 *  CI: they need network access to Geonorge and a few hundred megabytes of
 *  cached raster tiles.
 *
 *  So this file checks the part that survives generation: that the emitted
 *  TypeScript is internally consistent, and that the accessors over it behave
 *  at the edges. It is a tripwire on the pipeline's output, not a second
 *  opinion on the terrain. Every assertion here is one that a regenerated
 *  `lib/routes.ts` could break silently — a truncated line, a route whose gain
 *  no longer matches the card, a slug that stopped resolving.
 */

describe("the tour list", () => {
  it("is not empty and every slug is unique", () => {
    expect(TOURS.length).toBeGreaterThan(0);
    expect(new Set(TOURS.map((t) => t.slug)).size).toBe(TOURS.length);
  });

  it("puts every tour in a declared region", () => {
    /* `REGIONS` drives the filters on `/kart` and the grouping on `/turer`. A
       tour whose region is not in the list disappears from both while still
       existing — findable only by URL. */
    for (const tour of TOURS) {
      expect(REGIONS, tour.slug).toContain(tour.region);
    }
  });

  it("declares no region that has no tours in it", () => {
    for (const region of REGIONS) {
      expect(toursInRegion(region), region).not.toHaveLength(0);
    }
  });

  it("grades every tour 1–4", () => {
    /* `GRADE_COLORS[tour.grade - 1]` indexes a four-element array. Anything
       outside the range paints a marker `undefined`. */
    for (const tour of TOURS) {
      expect([1, 2, 3, 4], tour.slug).toContain(tour.grade);
    }
  });

  it("gives every tour a position inside Norway", () => {
    for (const tour of TOURS) {
      expect(tour.lat, tour.slug).toBeGreaterThan(57);
      expect(tour.lat, tour.slug).toBeLessThan(72);
      expect(tour.lng, tour.slug).toBeGreaterThan(4);
      expect(tour.lng, tour.slug).toBeLessThan(32);
    }
  });

  it("gives every region an anchor that survives a URL", () => {
    /* The anchors end up in shared links. A region that ASCII-folds to the same
       string as another would send both to the same place on `/turer`. */
    const anchors = REGIONS.map(regionAnchor);
    for (const anchor of anchors) {
      expect(anchor).toMatch(/^[a-z0-9-]+$/);
    }
    expect(new Set(anchors).size).toBe(REGIONS.length);
  });
});

describe("getTour", () => {
  it("resolves every slug in the list", () => {
    for (const tour of TOURS) {
      expect(getTour(tour.slug)?.slug).toBe(tour.slug);
    }
  });

  it("returns undefined for a slug that is not ours", () => {
    /* `/api/skredvarsel` leans on this: taking a slug rather than a coordinate
       is what stops the endpoint being an open proxy to Varsom. */
    expect(getTour("mount-doom")).toBeUndefined();
    expect(getTour("")).toBeUndefined();
  });
});

describe("the routes", () => {
  it("gives every tour at least one", () => {
    for (const tour of TOURS) {
      expect(routesFor(tour), tour.slug).not.toHaveLength(0);
    }
  });

  it("stores each line as whole lat/lng/elevation triples", () => {
    /* The flat array is read three at a time. A length that is not a multiple
       of three means the last point comes out with an undefined coordinate —
       and `[undefined, undefined]` draws as a jump to null island. */
    for (const tour of TOURS) {
      for (const route of routesFor(tour)) {
        expect(route.line.length % 3, `${tour.slug}/${route.id}`).toBe(0);
        expect(route.line.length, `${tour.slug}/${route.id}`).toBeGreaterThanOrEqual(6);
      }
    }
  });

  it("gives every route of a tour a distinct id", () => {
    for (const tour of TOURS) {
      const ids = routesFor(tour).map((r) => r.id);
      expect(new Set(ids).size, tour.slug).toBe(ids.length);
    }
  });

  it("ends every line on the summit it belongs to", () => {
    /* The strongest statement the data makes about itself: the last vertex of
       the drawn line is the peak the card describes. If a corridor is re-pinned
       and the line stops short, this is what notices. */
    for (const tour of TOURS) {
      const profile = routeProfile(tour)!;
      const [lat, lng] = profile.points[profile.points.length - 1];
      const metres = Math.hypot(
        (lat - tour.lat) * 111_320,
        (lng - tour.lng) * 111_320 * Math.cos((lat * Math.PI) / 180),
      );
      expect(metres, tour.slug).toBeLessThan(25);

      const summit = profile.elevations[profile.elevations.length - 1];
      expect(Math.abs(summit - tour.summitM), tour.slug).toBeLessThanOrEqual(5);
    }
  });

  it("agrees with the card about the vertical", () => {
    /* Same rule `check_routes.py` enforces at generation time: the card's
       `verticalM` is the first route's cumulative ascent, to within 10 m. The
       card and the line are edited by different passes, and this is the seam
       where they drift apart. */
    for (const tour of TOURS) {
      const profile = routeProfile(tour)!;
      expect(Math.abs(profile.gainM - tour.verticalM), tour.slug).toBeLessThanOrEqual(10);
    }
  });
});

describe("routeById", () => {
  const multi = TOURS.find((t) => routesFor(t).length > 1)!;

  it("returns the named route", () => {
    const wanted = routesFor(multi)[1];
    expect(routeById(multi, wanted.id)?.id).toBe(wanted.id);
  });

  it("falls back to the tour's own route for an unknown or missing id", () => {
    /* `?rute=` travels in shared links. A stale one has to draw something
       rather than nothing — an empty map reads as a broken page. */
    const first = routesFor(multi)[0].id;
    expect(routeById(multi, "rute-som-ikke-finnes")?.id).toBe(first);
    expect(routeById(multi, null)?.id).toBe(first);
    expect(routeById(multi, undefined)?.id).toBe(first);
  });
});

describe("routeProfile", () => {
  const tour = TOURS[0];

  it("pairs every point with its own elevation", () => {
    /* `points[i]` and `elevations[i]` describe the same place — the GPX writer
       and the elevation profile both index them in lockstep. */
    const profile = routeProfile(tour)!;
    expect(profile.points.length).toBe(profile.elevations.length);
    expect(profile.points.length).toBeGreaterThan(1);
  });

  it("draws the same points routeFor draws", () => {
    /* The map uses one, the GPX file the other. A reader who compares the two
       is comparing the same line, and that has to stay true. */
    expect(routeProfile(tour)!.points).toEqual(routeFor(tour));
  });

  it("carries the metadata the GPX filename and caption are built from", () => {
    const profile = routeProfile(tour)!;
    expect(profile.routeId).toBeTruthy();
    expect(profile.routeName).toBeTruthy();
    expect(profile.distanceM).toBeGreaterThan(0);
  });
});
