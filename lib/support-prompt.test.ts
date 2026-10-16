import { describe, expect, it } from "vitest";

import { SUPPORT_PROMPT_VISIT, nextVisit } from "@/lib/support-prompt";

function store(): Storage {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
    clear: () => data.clear(),
    key: () => null,
    get length() {
      return data.size;
    },
  };
}

describe("nextVisit", () => {
  it("shows on the third visit, and only then", () => {
    const local = store();
    const results = Array.from({ length: 6 }, () => nextVisit(local, store()));
    expect(SUPPORT_PROMPT_VISIT).toBe(3);
    expect(results).toEqual([false, false, true, false, false, false]);
  });

  it("counts a session once, however many pages it opens", () => {
    const local = store();
    const session = store();
    for (let i = 0; i < 5; i++) expect(nextVisit(local, session)).toBe(false);
    expect(local.getItem("tk_visits")).toBe("1");
  });

  it("stays quiet when storage throws", () => {
    const broken = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };
    expect(nextVisit(broken, broken)).toBe(false);
  });
});
