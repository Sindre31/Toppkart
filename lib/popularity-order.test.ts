import { describe, expect, it } from "vitest";

import { byPopularity } from "./popularity-order";

const tours = ["a", "b", "c", "d"].map((slug) => ({ slug }));

describe("byPopularity", () => {
  it("puts the most read first", () => {
    const order = byPopularity(tours, { a: { views: 5 }, b: { views: 50 }, c: { views: 20 } });
    expect(order.map((t) => t.slug)).toEqual(["b", "c", "a", "d"]);
  });

  it("keeps the editorial order between ties and tours without an article", () => {
    const order = byPopularity(tours, { c: { views: 10 } });
    expect(order.map((t) => t.slug)).toEqual(["c", "a", "b", "d"]);
  });

  it("leaves the list as it is when there is no data", () => {
    expect(byPopularity(tours, {})).toEqual(tours);
  });
});
