import { describe, expect, it } from "vitest";

import { cumulativeM, deriveStages, heightMentions, leadIn, slopeFigure, splitLede } from "./stages";

describe("heightMentions", () => {
  it("keeps heights and drops distances, slopes, decimals and road numbers", () => {
    const text = "Fra fv. 863 på 11 moh går du 1,39 km til 185 moh, 30–35 grader, så 300 høydemeter til 620.";
    expect(heightMentions(text)).toEqual([11, 185, 620]);
  });
});

describe("deriveStages", () => {
  /* En jevn rygg fra 100 til 1000 moh, ti meter mellom hvert punkt. */
  const elevations = Array.from({ length: 91 }, (_, i) => 100 + i * 10);
  const cum = elevations.map((_, i) => i * 10);

  it("splits at the heights the paragraphs name", () => {
    const stages = deriveStages(
      ["Fra parkeringen opp til skoggrensa på 400 moh.", "Over 400 åpner det seg til 700.", "De siste 300 mot toppen."],
      elevations,
      cum,
    );
    expect(stages.map((s) => [s.startM, s.endM])).toEqual([
      [100, 400],
      [400, 700],
      [700, 1000],
    ]);
    expect(stages[0].startFrac).toBe(0);
    expect(stages[2].endFrac).toBe(1);
  });

  it("falls back to an even split of the remaining ascent", () => {
    const stages = deriveStages(["Første.", "Andre.", "Tredje."], elevations, cum);
    expect(stages.map((s) => s.endM)).toEqual([400, 700, 1000]);
  });

  it("gives no stages without text or with too short a line", () => {
    expect(deriveStages([], elevations, cum)).toEqual([]);
    expect(deriveStages(["a", "b", "c"], [1, 2], [0, 1])).toEqual([]);
  });
});

describe("cumulativeM", () => {
  it("scales the sum to the route's stated length", () => {
    const cum = cumulativeM(
      [
        [60, 10],
        [60.001, 10],
        [60.002, 10],
      ],
      300,
    );
    expect(cum[0]).toBe(0);
    expect(cum[2]).toBeCloseTo(300);
    expect(cum[1]).toBeCloseTo(150);
  });
});

describe("text helpers", () => {
  it("italicises a short closing sentence only", () => {
    expect(splitLede("Bred rygg og lang sesong. Norges kanskje mest populære topptur.")).toEqual({
      body: "Bred rygg og lang sesong.",
      italic: "Norges kanskje mest populære topptur.",
    });
    expect(splitLede("Én setning.").italic).toBeNull();
  });

  it("bolds a short lead-in before a colon", () => {
    expect(leadIn("Vanligste feil: å dra for langt mot sør.")).toEqual({
      lead: "Vanligste feil",
      rest: ": å dra for langt mot sør.",
    });
    expect(leadIn("Ned samme vei som du kom opp, hele veien til bilen.").lead).toBeNull();
  });

  it("reads the first slope figure", () => {
    expect(slopeFigure("Flanken holder 30–35 grader, med steg på 40.")).toBe("30–35°");
    expect(slopeFigure("Ingen tall her.")).toBeNull();
  });
});
