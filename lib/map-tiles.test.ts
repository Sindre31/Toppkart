import { describe, expect, it } from "vitest";

import { coveredByKartverket } from "./map-tiles";

/** Flisa som inneholder et punkt, på nivå z. */
function tileAt(lat: number, lng: number, z: number): [number, number, number] {
  const n = 2 ** z;
  const r = (lat * Math.PI) / 180;
  return [
    z,
    Math.floor(((lng + 180) / 360) * n),
    Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n),
  ];
}

describe("coveredByKartverket", () => {
  it("skips OSM in the middle of Norway, at every zoom from the coverage level down", () => {
    for (const z of [8, 10, 13, 17]) {
      expect(coveredByKartverket(...tileAt(60.2, 7.5, z)), `Hardangervidda z${z}`).toBe(true);
    }
  });

  it("keeps OSM outside Norway", () => {
    expect(coveredByKartverket(...tileAt(59.33, 18.07, 12))).toBe(false); // Stockholm
    expect(coveredByKartverket(...tileAt(60.17, 24.94, 12))).toBe(false); // Helsingfors
    expect(coveredByKartverket(...tileAt(57.0, 2.0, 10))).toBe(false); // Nordsjøen
  });

  it("never skips above the level coverage was measured at", () => {
    expect(coveredByKartverket(...tileAt(60.2, 7.5, 7))).toBe(false);
  });
});
