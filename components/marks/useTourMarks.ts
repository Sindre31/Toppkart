"use client";

import { useCallback, useState, useSyncExternalStore } from "react";

import { applyMark, parseStoredMarks, type MarkPatch, type TourMark } from "@/lib/tour-marks";

/** Leserens favoritter og gåtte turer, i nettleseren.
 *
 *  Toppkart har ingen kontoer, så lista ligger i `localStorage` på enheten.
 *  Den leses gjennom `useSyncExternalStore`: under serverrendringen finnes det
 *  ingen lagring, og da er svaret «laster»; i nettleseren følger alle knappene
 *  på sida — og andre faner — med når lista endres.
 *
 *  Kan ikke lagringen skrives — privat vindu, blokkerte nettstedsdata, full
 *  disk — står lista uendret og `failed` settes, så knappen kan si at det ikke
 *  ble lagret. En stjerne som lyser for en favoritt som ikke finnes, er verre
 *  enn en som ikke lyste. */

export type MarksState =
  | { status: "loading" }
  /** Lagringen kan ikke leses i denne nettleseren. Knappene står av. */
  | { status: "unavailable" }
  | { status: "ready"; marks: ReadonlyMap<string, TourMark> };

const STORAGE_KEY = "tk_marks";
const LOADING: MarksState = { status: "loading" };
const UNAVAILABLE: MarksState = { status: "unavailable" };

const listeners = new Set<() => void>();
/** Siste lesning, så samme lagrede tekst gir samme objekt — det
 *  `useSyncExternalStore` krever for ikke å rendre i det uendelige. */
let cache: { raw: string | null; state: MarksState } | null = null;

function snapshot(): MarksState {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return UNAVAILABLE;
  }
  if (cache?.raw === raw) return cache.state;
  const marks = parseStoredMarks(raw);
  cache = { raw, state: { status: "ready", marks: new Map(marks.map((m) => [m.slug, m])) } };
  return cache.state;
}

function serverSnapshot(): MarksState {
  return LOADING;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function osloToday(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Oslo" });
}

export function useTourMarks() {
  const state = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const [failed, setFailed] = useState<string | null>(null);

  const update = useCallback(
    (slug: string, patch: MarkPatch) => {
      if (state.status !== "ready") return;
      const marks = new Map(state.marks);
      const next = applyMark(marks.get(slug), slug, patch, osloToday());
      if (next) marks.set(slug, next);
      else marks.delete(slug);

      setFailed(null);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...marks.values()]));
      } catch {
        setFailed(slug);
        return;
      }
      listeners.forEach((listener) => listener());
    },
    [state],
  );

  return { state, update, failed };
}
