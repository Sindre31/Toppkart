import { describe, expect, it } from "vitest";

import {
  applyMark,
  decodeDemoMarks,
  doneTotals,
  encodeDemoMarks,
  parseMarkRequest,
  type TourMark,
} from "@/lib/tour-marks";

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

describe("parseMarkRequest", () => {
  it("accepts one field or both", () => {
    expect(parseMarkRequest({ slug: "slogen", favorite: true })).toEqual({ slug: "slogen", favorite: true });
    expect(parseMarkRequest({ slug: "slogen", done: false, favorite: true })).toEqual({
      slug: "slogen",
      favorite: true,
      done: false,
    });
  });

  it("refuses anything that is not a request", () => {
    expect(parseMarkRequest(null)).toBeNull();
    expect(parseMarkRequest({ slug: "slogen" })).toBeNull();
    expect(parseMarkRequest({ slug: "slogen", favorite: "true" })).toBeNull();
    expect(parseMarkRequest({ slug: "../etc", favorite: true })).toBeNull();
    expect(parseMarkRequest({ slug: "", done: true })).toBeNull();
  });
});

describe("demo cookie", () => {
  it("round-trips", () => {
    const marks: TourMark[] = [
      { slug: "slogen", favorite: true, doneOn: "2026-10-05" },
      { slug: "kirketaket", favorite: true, doneOn: null },
      { slug: "storgalten", favorite: false, doneOn: "2026-01-02" },
    ];
    expect(decodeDemoMarks(encodeDemoMarks(marks))).toEqual(marks);
  });

  it("drops what it cannot read instead of guessing", () => {
    expect(decodeDemoMarks("slogen|f|05.10.2026;BAD SLUG|f|;tomt|-|")).toEqual([
      { slug: "slogen", favorite: true, doneOn: null },
    ]);
    expect(decodeDemoMarks(undefined)).toEqual([]);
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
