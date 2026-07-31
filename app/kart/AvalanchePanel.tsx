"use client";

import { useEffect, useState } from "react";
import type { AvalancheForecast } from "@/lib/avalanche";
import { DANGER_COLORS } from "@/lib/avalanche";
import type { Lang } from "@/lib/i18n";
import { mapDict } from "@/lib/i18n/map";
import s from "./kart.module.css";

/** Today's Varsom danger level for the selected peak.
 *
 *  Fetched in the browser rather than rendered on the server, because the peak
 *  changes without a navigation — the map swaps `slug` in place, and a server
 *  round-trip per marker tap would make the panel lag the selection.
 *
 *  Every outcome says something. A forecast that cannot be reached, a peak
 *  outside the forecast regions, and a summer day with no assessment are three
 *  different facts, and none of them is «danger level 0» — see `lib/avalanche`.
 */
export function AvalanchePanel({ slug, lang }: { slug: string; lang: Lang }) {
  const t = mapDict(lang);
  const [forecast, setForecast] = useState<AvalancheForecast | null>(null);

  useEffect(() => {
    // Guard against a slow answer for a peak the reader has already left.
    let current = true;
    setForecast(null);

    const params = new URLSearchParams({ tur: slug, lang });
    fetch(`/api/skredvarsel?${params}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: AvalancheForecast | null) => {
        if (current) setForecast(data);
      })
      .catch(() => {
        if (current) {
          setForecast({
            state: "unavailable",
            level: null,
            regionName: null,
            mainText: null,
            date: "",
          });
        }
      });

    return () => {
      current = false;
    };
  }, [slug, lang]);

  const level = forecast?.state === "level" ? forecast.level : null;
  const colors = level ? DANGER_COLORS[level] : null;

  return (
    <section className={s.avalanche}>
      <h3 className={s.avalancheHead}>
        {t.avalancheTitle}
        {forecast?.regionName ? (
          <span className={s.avalancheRegion}>{forecast.regionName}</span>
        ) : null}
      </h3>

      {forecast === null ? (
        <p className={s.avalancheNote}>{t.dangerLoading}</p>
      ) : level && colors ? (
        <>
          <div
            className={s.avalancheLevel}
            style={{ background: colors.bg, color: colors.fg }}
          >
            <span className={s.avalancheNum}>{level}</span>
            <span>{t.dangerLevelLabel(level, t.dangerLevels[level - 1])}</span>
          </div>
          {forecast.mainText ? (
            <p className={s.avalancheText}>{forecast.mainText}</p>
          ) : null}
        </>
      ) : (
        <p className={s.avalancheNote}>
          {forecast.state === "notAssessed"
            ? t.dangerNotAssessed
            : forecast.state === "outsideRegion"
              ? t.dangerOutsideRegion
              : t.dangerUnavailable}
        </p>
      )}

      <a
        className={s.avalancheSource}
        href="https://varsom.no"
        target="_blank"
        rel="noreferrer"
      >
        {t.dangerSource}
      </a>
    </section>
  );
}
