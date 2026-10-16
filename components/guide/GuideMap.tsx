"use client";

import dynamic from "next/dynamic";

import { Blueprint } from "@/components/Blueprint";
import { distanceLabel } from "@/components/guide/RouteMap";
import type { Lang } from "@/lib/i18n";
import { guideDict } from "@/lib/i18n/guide";

/** Kartet i turguiden: ruta opp over Kartverket, og leseren kan dra og zoome.
 *
 *  Erstatter `RouteMap` på tursidene, som tegnet det samme som et stillbilde av
 *  tolv fliser. `RouteMap` står fortsatt på `/om`, der figuren er et eksempel og
 *  ikke et arbeidsverktøy.
 *
 *  Rammen og figurteksten rendres av serveren; bare kartet inni venter på
 *  Leaflet. Høyden er låst av forholdet 3:2, så sida flytter seg ikke når
 *  kartet kommer. `isolation` holder Leaflets egne z-indekser (kontrollene
 *  ligger på 1000) inne i figuren, så de ikke legger seg over den klebrige
 *  menyen når man ruller.
 *
 *  Offline: `planTourTiles` lagrer Kartverkets fliser langs ruta på nivå
 *  10–15, og chunken med Leaflet følges fra sida av `staticRefs`, så kartet
 *  virker også i en lagret guide — der det er lagret. */
const GuideMapCanvas = dynamic(() => import("./GuideMapCanvas"), { ssr: false });

export function GuideMap({
  peak,
  points,
  distanceM,
  gainM,
  trailhead,
  lang,
  children,
}: {
  peak: string;
  points: readonly [number, number][];
  distanceM: number;
  gainM: number;
  trailhead: string;
  lang: Lang;
  /** Lenka inn i hovedkartet, satt av sida som eier stien dit. */
  children?: React.ReactNode;
}) {
  const t = guideDict(lang);
  const distance = distanceLabel(distanceM, lang);

  return (
    <Blueprint as="figure" style={{ margin: 0, padding: "18px 20px" }}>
      <div
        role="region"
        aria-label={t.routeMapAria(peak, distance, gainM)}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "3 / 2",
          isolation: "isolate",
          background: "#fff",
        }}
      >
        {points.length >= 2 ? <GuideMapCanvas points={points} lang={lang} /> : null}
      </div>

      <figcaption className="note" style={{ margin: "12px 0 0" }}>
        {t.routeMapCaption(trailhead, distance, gainM)} {children} {t.routeMapCredit}
      </figcaption>
    </Blueprint>
  );
}
