"use client";

/** Sjekklista under «Før du går», lagret på enheten per tur.
 *
 *  Samme mønster som favorittene (`components/marks/useTourMarks.ts`): Toppkart
 *  har ingen kontoer, så avkrysningene ligger i `localStorage`, lest gjennom
 *  `useSyncExternalStore`. På serveren finnes ingen lagring, og da står alt
 *  uavkrysset; andre faner følger med når lista endres.
 *
 *  Nøkkelen er én for alle turene, med en liste per tur — `tk_checks` →
 *  `{ "kirketaket": [0, 2] }`. Kan lagringen ikke skrives (privat vindu, full
 *  disk), virker lista likevel for økta: avkrysningen står i minnet og
 *  forsvinner ved neste besøk, framfor at boksen nekter å bli krysset av. */

import { useCallback, useState, useSyncExternalStore } from "react";
import { Check } from "lucide-react";

import styles from "./Checklist.module.css";

const STORAGE_KEY = "tk_checks";
const EMPTY: readonly number[] = [];

const listeners = new Set<() => void>();
let cache: { raw: string | null; table: Record<string, readonly number[]> } | null = null;

function readTable(): Record<string, readonly number[]> {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (cache?.raw === raw) return cache.table;
  let table: Record<string, readonly number[]> = {};
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      for (const [slug, value] of Object.entries(parsed)) {
        if (Array.isArray(value)) {
          table[slug] = value.filter((n): n is number => Number.isInteger(n) && n >= 0 && n < 50);
        }
      }
    }
  } catch {
    table = {};
  }
  cache = { raw, table };
  return table;
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

export function Checklist({
  slug,
  items,
  label,
}: {
  slug: string;
  items: readonly { text: string; hint: string }[];
  label: string;
}) {
  const stored = useSyncExternalStore(
    subscribe,
    () => readTable()[slug] ?? EMPTY,
    () => EMPTY,
  );
  /* Det som ikke kunne lagres, for resten av økta. */
  const [local, setLocal] = useState<readonly number[] | null>(null);
  const checked = local ?? stored;

  const toggle = useCallback(
    (index: number) => {
      const next = checked.includes(index) ? checked.filter((n) => n !== index) : [...checked, index].sort();
      const table = { ...readTable() };
      if (next.length) table[slug] = next;
      else delete table[slug];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(table));
        setLocal(null);
        listeners.forEach((listener) => listener());
      } catch {
        setLocal(next);
      }
    },
    [checked, slug],
  );

  return (
    <ul className={styles.list} aria-label={label}>
      {items.map((item, i) => {
        const on = checked.includes(i);
        return (
          <li key={i}>
            <label className={styles.row} data-on={on || undefined}>
              <input
                type="checkbox"
                className={styles.input}
                checked={on}
                onChange={() => toggle(i)}
              />
              <span className={styles.ring} aria-hidden="true">
                <Check size={12} strokeWidth={3} />
              </span>
              <span className={styles.text}>{item.text}</span>
              {item.hint ? <span className={styles.hint}>{item.hint}</span> : null}
            </label>
          </li>
        );
      })}
    </ul>
  );
}
