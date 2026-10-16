"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

import type { Lang } from "@/lib/i18n";
import { useStages } from "./GuideStages";
import type { CanvasStage } from "./GuideMapCanvas";
import styles from "./GuideMap.module.css";

/** Kartet ved siden av teksten i turguiden: ruta over Kartverket, delt i
 *  etappene, med en pille øverst som sier hva som er uthevet og en lenke inn i
 *  hovedkartet.
 *
 *  Rammen og pillene rendres med en gang; bare kartet inni venter på Leaflet.
 *  `isolation` i rammen holder Leaflets egne z-indekser (kontrollene ligger på
 *  1000) inne i den, så de ikke legger seg over den klebrige menyen.
 *
 *  Offline: `planTourTiles` lagrer Kartverkets fliser langs ruta på nivå 10–15,
 *  og chunken med Leaflet følges fra sida av `staticRefs`, så kartet virker
 *  også i en lagret guide — der det er lagret. */
const GuideMapCanvas = dynamic(() => import("./GuideMapCanvas"), { ssr: false });

export function GuideMap({
  points,
  stages,
  label,
  wholeLabel,
  stageLabels,
  mapHref,
  openLabel,
  lang,
}: {
  points: readonly [number, number][];
  stages: readonly CanvasStage[];
  /** Skjermleserens beskrivelse av kartet. */
  label: string;
  /** «Hele ruta · 5,5 km» */
  wholeLabel: string;
  /** «Etappe 2 · 520–900 moh», én per etappe. */
  stageLabels: readonly string[];
  mapHref: string;
  openLabel: string;
  lang: Lang;
}) {
  const { active, setHover, togglePin } = useStages();

  return (
    <div className={styles.frame} role="region" aria-label={label}>
      {points.length >= 2 ? (
        <GuideMapCanvas
          points={points}
          stages={stages}
          active={active}
          onHover={setHover}
          onPin={togglePin}
          lang={lang}
        />
      ) : null}
      <div className={styles.overlay}>
        <span className={styles.pill} aria-live="polite">
          <span className={styles.dot} aria-hidden="true" />
          {active === null ? wholeLabel : stageLabels[active]}
        </span>
        <Link className={`${styles.pill} ${styles.link}`} href={mapHref}>
          {openLabel}
        </Link>
      </div>
    </div>
  );
}
