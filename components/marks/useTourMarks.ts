"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { applyMark, type MarkPatch, type TourMark } from "@/lib/tour-marks";

/** Leserens favoritter og gåtte turer, i nettleseren.
 *
 *  Hentes én gang per side. Endringer vises med det samme og sendes etterpå;
 *  sier serveren nei, rulles den ene endringen tilbake og `failed` settes, så
 *  knappen kan si at det ikke ble lagret — en stjerne som lyser for en
 *  favoritt som ikke finnes, er verre enn en som ikke lyste. */

export type MarksState =
  | { status: "loading" }
  /** Ikke innlogget, eller lista kunne ikke hentes. Knappene sender da til
   *  innlogging eller står av. */
  | { status: "signedOut" }
  | { status: "unavailable" }
  | { status: "ready"; marks: ReadonlyMap<string, TourMark> };

function osloToday(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Oslo" });
}

export function useTourMarks() {
  const [state, setState] = useState<MarksState>({ status: "loading" });
  const [failed, setFailed] = useState<string | null>(null);
  /* Den siste endringen per tur. Kommer to trykk raskt etter hverandre, skal et
     sent svar på det første ikke overskrive det andre. */
  const seq = useRef(new Map<string, number>());

  useEffect(() => {
    let alive = true;
    fetch("/api/turmerker", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: { signedIn: boolean; marks: TourMark[] }) => {
        if (!alive) return;
        setState(
          data.signedIn
            ? { status: "ready", marks: new Map(data.marks.map((m) => [m.slug, m])) }
            : { status: "signedOut" },
        );
      })
      .catch(() => {
        if (alive) setState({ status: "unavailable" });
      });
    return () => {
      alive = false;
    };
  }, []);

  const update = useCallback(
    async (slug: string, patch: MarkPatch) => {
      if (state.status !== "ready") return;
      const before = state.marks.get(slug);
      const n = (seq.current.get(slug) ?? 0) + 1;
      seq.current.set(slug, n);

      const put = (mark: TourMark | null | undefined) =>
        setState((prev) => {
          if (prev.status !== "ready") return prev;
          const marks = new Map(prev.marks);
          if (mark) marks.set(slug, mark);
          else marks.delete(slug);
          return { status: "ready", marks };
        });

      setFailed(null);
      put(applyMark(before, slug, patch, osloToday()));
      try {
        const res = await fetch("/api/turmerker", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ slug, ...patch }),
        });
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as { mark: TourMark | null };
        if (seq.current.get(slug) === n) put(data.mark);
      } catch {
        if (seq.current.get(slug) === n) {
          put(before);
          setFailed(slug);
        }
      }
    },
    [state],
  );

  return { state, update, failed };
}
