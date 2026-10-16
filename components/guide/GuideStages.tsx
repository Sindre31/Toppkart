"use client";

/** Etappene i turguiden, og tilstanden kartet, høydeprofilen og kortene deler.
 *
 *  `hover` er etappen pekeren står over — på et kort, på linja i kartet eller i
 *  profilen. `pinned` er etappen leseren har klikket på, og står til det klikkes
 *  igjen. `active = hover ?? pinned` styrer alle tre samtidig: den etappen er
 *  tykk i kartet og profilen og løftet i lista, de andre dempes.
 *
 *  Sida er en serverkomponent; tilstanden bor her, i en kontekst rundt begge
 *  kolonnene, så bare bitene som faktisk reagerer er klientkomponenter. */

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import styles from "./GuideStages.module.css";

interface StageState {
  count: number;
  active: number | null;
  setHover: (index: number | null) => void;
  togglePin: (index: number) => void;
}

const StageContext = createContext<StageState>({
  count: 0,
  active: null,
  setHover: () => {},
  togglePin: () => {},
});

export function useStages(): StageState {
  return useContext(StageContext);
}

export function StageProvider({ count, children }: { count: number; children: ReactNode }) {
  const [hover, setHover] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const togglePin = useCallback((index: number) => setPinned((p) => (p === index ? null : index)), []);
  const value = useMemo(
    () => ({ count, active: hover ?? pinned, setHover, togglePin }),
    [count, hover, pinned, togglePin],
  );
  return <StageContext.Provider value={value}>{children}</StageContext.Provider>;
}

/** Et område som løfter én etappe mens pekeren står over det. «Kom deg dit»
 *  bruker det for den første: starten er der etappe 1 begynner. */
export function StageHoverArea({
  index,
  className,
  children,
}: {
  index: number;
  className?: string;
  children: ReactNode;
}) {
  const { count, setHover } = useStages();
  if (index >= count) return <div className={className}>{children}</div>;
  return (
    <div className={className} onMouseEnter={() => setHover(index)} onMouseLeave={() => setHover(null)}>
      {children}
    </div>
  );
}

export interface StageItem {
  title: string;
  meta: string;
  body: string;
}

/** Lista over etappene. Hvert kort er en knapp: et klikk låser etappen i kartet
 *  og profilen, et nytt klikk slipper den. Tastaturet kommer dit samme vei. */
export function StageList({ items }: { items: readonly StageItem[] }) {
  const { active, setHover, togglePin } = useStages();
  return (
    <ol className={styles.list}>
      {items.map((item, i) => (
        <li key={i}>
          <button
            type="button"
            className={styles.stage}
            data-active={active === i || undefined}
            aria-pressed={active === i}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            onClick={() => togglePin(i)}
          >
            <span className={styles.num} aria-hidden="true">
              {i + 1}
            </span>
            <span className={styles.content}>
              <span className={styles.head}>
                <span className={styles.title}>{item.title}</span>
                <span className={styles.meta}>{item.meta}</span>
              </span>
              <span className={styles.body}>{item.body}</span>
            </span>
          </button>
        </li>
      ))}
    </ol>
  );
}
