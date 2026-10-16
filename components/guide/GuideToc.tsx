"use client";

import { useEffect, useRef, useState } from "react";

import { CapsText } from "@/components/CapsText";
import styles from "./GuideToc.module.css";

/** Innholdslista i turguiden: en rad med lenker som står klistret under
 *  menyen mens man leser, og som viser hvor i guiden man er.
 *
 *  Guiden er lang — over fem skjermhøyder på en telefon — og den som står ved
 *  bilen vil som regel ha én ting: nedkjøringen, skredterrenget eller kartet.
 *  Uten lista var veien dit å rulle og lete.
 *
 *  Lenkene er vanlige `#anker`, så lista virker før JavaScript er lastet og i
 *  en guide lagret offline. Skriptet legger bare til to ting: myk rulling (når
 *  leseren ikke har bedt om redusert bevegelse) og markeringen av seksjonen
 *  man står i. */
export function GuideToc({
  items,
  label,
}: {
  items: { id: string; label: string }[];
  label: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      /* Seksjonen man står i er den siste som har passert lista. Terskelen er
         der en seksjon lander etter et trykk i lista (`scroll-margin-top`),
         pluss litt, så et trykk alltid markerer det man trykket på. */
      const threshold = parseFloat(getComputedStyle(sections[0]).scrollMarginTop) + 24;
      let current: string | null = null;
      for (const el of sections) {
        if (el.getBoundingClientRect().top <= threshold) current = el.id;
      }
      /* Helt nederst kan den siste seksjonen være for kort til å nå terskelen;
         da er det likevel den man leser. */
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = sections[sections.length - 1].id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  /* På en smal skjerm ruller lista sidelengs. Den aktive lenka skal være
     synlig i den, ellers viser markeringen ingenting. Bare lista ruller her —
     `scrollIntoView` ville også flyttet sida. */
  useEffect(() => {
    const list = listRef.current;
    const link = active ? list?.querySelector<HTMLElement>(`a[href="#${active}"]`) : null;
    if (!list || !link) return;
    const left = link.offsetLeft - list.offsetLeft;
    if (left < list.scrollLeft || left + link.offsetWidth > list.scrollLeft + list.clientWidth) {
      list.scrollTo({ left: Math.max(0, left - 16) });
    }
  }, [active]);

  const onClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    window.history.replaceState(window.history.state, "", `#${id}`);
  };

  return (
    <nav className={styles.toc} aria-label={label}>
      <ol className={styles.list} ref={listRef}>
        {items.map((item, i) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={styles.link}
              aria-current={active === item.id ? "location" : undefined}
              onClick={(e) => onClick(e, item.id)}
            >
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              {/* Egen `span` av samme grunn som i `GuideHeading`: lenka er en
                  flex-rad, og «Ø» fra `CapsText` ville ellers stått for seg. */}
              <span>
                <CapsText>{item.label}</CapsText>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
