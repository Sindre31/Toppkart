import { describe, expect, it } from "vitest";

import { durationBand, routeFacts } from "./route-facts";
import { getTour, routesFor } from "./tours";

describe("durationBand", () => {
  it("bands the skinning model into two-hour windows", () => {
    expect(durationBand(4221, 1215)).toBe("5–7 t");
    expect(durationBand(2000, 300)).toBe("1–3 t");
  });
});

describe("routeFacts", () => {
  it("keeps the tour's own figures for its own route and measures the others", () => {
    const tour = getTour("galdhopiggen")!;
    const routes = routesFor(tour);
    expect(routes.length).toBeGreaterThan(1);
    const facts = routeFacts(tour, routes);
    expect(facts[routes[0].id]).toEqual({ verticalM: tour.verticalM, duration: tour.duration, aspect: tour.aspect });
    const other = facts[routes[1].id];
    expect(other.verticalM).toBe(Math.round(routes[1].gainM / 10) * 10);
    expect(other.verticalM).not.toBe(tour.verticalM);
    expect(["N", "NØ", "Ø", "SØ", "S", "SV", "V", "NV"]).toContain(other.aspect);
  });
});
