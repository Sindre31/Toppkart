import { describe, expect, it } from "vitest";

import { applyMark, doneTotals, parseStoredMarks, type TourMark } from "@/lib/tour-marks";

const today = "2026-10-05";

describe("applyMark", () => {
  it("adds a favourite to nothing", () => {
    expect(applyMark(undefined, "slogen", { favorite: true }, today)).toEqual({
      slug: "slogen",
      favorite: true,
      doneOn: null,
    });
  });

  it("dates a tour as done today, and keeps the favourite", () => {
    const prev: TourMark = { slug: "slogen", favorite: true, doneOn: null };
    expect(applyMark(prev, "slogen", { done: true }, today)).toEqual({
      slug: "slogen",
      favorite: true,
      doneOn: today,
    });
  });

  it("does not move the date when a done tour is marked done again", () => {
    const prev: TourMark = { slug: "slogen", favorite: false, doneOn: "2026-03-14" };
    expect(applyMark(prev, "slogen", { done: true }, today)?.doneOn).toBe("2026-03-14");
  });

  it("returns null when nothing is left, so the row is deleted", () => {
    const prev: TourMark = { slug: "slogen", favorite: true, doneOn: null };
    expect(applyMark(prev, "slogen", { favorite: false }, today)).toBeNull();
    const done: TourMark = { slug: "slogen", favorite: false, doneOn: today };
    expect(applyMark(done, "slogen", { done: false }, today)).toBeNull();
  });
});

describe("parseStoredMarks", () => {
  it("round-trips what the hook writes", () => {
    const marks: TourMark[] = [
      { slug: "slogen", favorite: true, doneOn: "2026-10-05" },
      { slug: "kirketaket", favorite: false, doneOn: "2026-02-01" },
    ];
    expect(parseStoredMarks(JSON.stringify(marks))).toEqual(marks);
  });

  it("drops what it cannot read instead of guessing", () => {
    expect(parseStoredMarks(null)).toEqual([]);
    expect(parseStoredMarks("not json")).toEqual([]);
    expect(parseStoredMarks('{"slug":"slogen"}')).toEqual([]);
    expect(
      parseStoredMarks(
        JSON.stringify([
          { slug: "Slogen!", favorite: true },
          { slug: "slogen", favorite: "yes", doneOn: "i går" },
          { slug: "kirketaket", favorite: true, doneOn: "5. oktober" },
        ]),
      ),
    ).toEqual([{ slug: "kirketaket", favorite: true, doneOn: null }]);
  });
});

describe("doneTotals", () => {
  it("counts done tours and their vertical, skipping favourites and unknown tours", () => {
    const marks: TourMark[] = [
      { slug: "a", favorite: false, doneOn: today },
      { slug: "b", favorite: true, doneOn: null },
      { slug: "c", favorite: true, doneOn: today },
      { slug: "gone", favorite: false, doneOn: today },
    ];
    const vertical: Record<string, number> = { a: 1000, b: 500, c: 750 };
    expect(doneTotals(marks, (s) => vertical[s])).toEqual({ count: 2, verticalM: 1750 });
  });
});
