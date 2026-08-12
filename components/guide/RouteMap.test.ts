import { describe, expect, it } from "vitest";

import { plan, worldX, worldY } from "@/components/guide/RouteMap";
import { TOURS, routeProfile } from "@/lib/tours";

/** The projection behind the route figure.
 *
 *  This is the quiet-failure case in its purest form. If the maths is wrong,
 *  nothing throws, no request fails, and every one of the ninety tour pages
 *  renders a handsome map with the route drawn in the wrong place — a line
 *  climbing a valley it does not climb, over contours that belong to somewhere
 *  else. The figure is *more* convincing when it is wrong, because a real map
 *  underneath makes a drawn line look surveyed.
 *
 *  So the numbers are pinned against spherical Mercator computed independently,
 *  and the layout is checked against the tile grid it has to line up with.
 */

/* Kirketaket: the tour the figure was first drawn for, and the one whose summit
   height was baked into the placeholder it replaced. */
const KIRKETAKET: [number, number] = [62.61158, 7.90672];

describe("worldX / worldY", () => {
  /* Greenwich and the equator sit at the exact middle of the world square at
     every zoom. If either function has picked up an offset, this is where it
     shows without any arithmetic to check. */
  it("puts 0°/0° at the centre of the world", () => {
    for (const z of [0, 5, 13]) {
      const half = (256 * 2 ** z) / 2;
      expect(worldX(0, z)).toBeCloseTo(half, 6);
      expect(worldY(0, z)).toBeCloseTo(half, 6);
    }
  });

  it("places a known Norwegian point on its documented tile", () => {
    /* z13 x4275 y2255 is the tile fetched from Kartverket while building this,
       and it is the one with Kirketaket's «1439» spot height on it. The point
       must land inside that tile, or the figure is drawing the right line on
       the wrong paper. */
    const [lat, lng] = KIRKETAKET;
    expect(Math.floor(worldX(lng, 13) / 256)).toBe(4275);
    expect(Math.floor(worldY(lat, 13) / 256)).toBe(2255);
  });

  /* Mercator stretches northward: a degree of latitude is worth more pixels at
     70°N than at 58°N. Getting this backwards — or dropping it, as an
     equirectangular projection does — squashes northern Norway. */
  it("stretches with latitude, the way Mercator does", () => {
    const atLyngen = worldY(69, 13) - worldY(69.1, 13);
    const atGausta = worldY(59, 13) - worldY(59.1, 13);
    expect(atLyngen).toBeGreaterThan(atGausta);
  });

  it("doubles the world for every zoom level", () => {
    expect(worldX(7.9, 13)).toBeCloseTo(worldX(7.9, 12) * 2, 6);
    expect(worldY(62.6, 13)).toBeCloseTo(worldY(62.6, 12) * 2, 6);
  });
});

describe("plan", () => {
  const points = routeProfile(TOURS.find((t) => t.slug === "kirketaket")!)!.points;

  it("returns nothing for a route too short to draw", () => {
    expect(plan([], "colour")).toBeNull();
    expect(plan([KIRKETAKET], "colour")).toBeNull();
  });

  it("keeps every point of every route inside the figure", () => {
    /* The whole point of choosing the zoom by fitting. A route that overflows
       is a route with its summit cropped off, and nothing would report it. */
    for (const tour of TOURS) {
      const laid = plan(routeProfile(tour)!.points, "colour")!;
      for (const [x, y] of laid.xy) {
        expect(x, tour.slug).toBeGreaterThanOrEqual(0);
        expect(x, tour.slug).toBeLessThanOrEqual(600);
        expect(y, tour.slug).toBeGreaterThanOrEqual(0);
        expect(y, tour.slug).toBeLessThanOrEqual(400);
      }
    }
  });

  it("covers the whole figure with tiles, with none wasted", () => {
    /* 600×400 over 256px tiles needs at most 4 columns and 3 rows. More than
       that means the grid is being computed past the edges and we are asking
       Kartverket for pictures nobody sees. */
    for (const tour of TOURS) {
      const { tiles } = plan(routeProfile(tour)!.points, "colour")!;
      expect(tiles.length, tour.slug).toBeGreaterThan(0);
      expect(tiles.length, tour.slug).toBeLessThanOrEqual(12);

      /* Every corner of the figure has to sit on some tile. */
      for (const [cx, cy] of [[0, 0], [599, 0], [0, 399], [599, 399]]) {
        const covered = tiles.some(
          (tile) =>
            cx >= (tile.left / 100) * 600 &&
            cx <= (tile.left / 100) * 600 + 256 &&
            cy >= (tile.top / 100) * 400 &&
            cy <= (tile.top / 100) * 400 + 256,
        );
        expect(covered, `${tour.slug} @ ${cx},${cy}`).toBe(true);
      }
    }
  });

  it("asks Kartverket for the layer the tone names", () => {
    expect(plan(points, "colour")!.tiles[0].src).toContain("/topo/");
    expect(plan(points, "grey")!.tiles[0].src).toContain("/topograatone/");
  });

  it("agrees with the route's own measured length", () => {
    /* The scale bar is drawn from `metresPerUnit`, and the caption's distance
       comes from the route data. Walking the drawn line in figure units and
       converting back has to land near the measured distance — this is the one
       assertion that ties the projection to the metres in the prose. It is
       loose on purpose: the drawn line is a straight-segment simplification, so
       it is a little shorter than the ground distance. */
    const { xy, metresPerUnit } = plan(points, "colour")!;
    let units = 0;
    for (let i = 1; i < xy.length; i += 1) {
      units += Math.hypot(xy[i][0] - xy[i - 1][0], xy[i][1] - xy[i - 1][1]);
    }
    const metres = units * metresPerUnit;
    const measured = routeProfile(TOURS.find((t) => t.slug === "kirketaket")!)!.distanceM;
    expect(metres).toBeGreaterThan(measured * 0.8);
    expect(metres).toBeLessThan(measured * 1.2);
  });
});
