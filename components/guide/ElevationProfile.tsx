"use client";

import { useStages } from "./GuideStages";
import { PROFILE_H, PROFILE_W, type ProfileGeometry } from "./stages";
import styles from "./ElevationProfile.module.css";

/** Høydeprofilen under kartet, regnet fra rutas egne høyder (`routeProfile`),
 *  over viewBox «0 0 600 150».
 *
 *  Ett `path` per etappe, så profilen kan utheve det samme stykket som kartet
 *  og lista: aktiv etappe tykk, de andre dempet. Over hver etappe ligger et
 *  usynlig felt som pekemål — en linje på 2,5 px er for smal å treffe.
 *
 *  Koordinatene regnes på serveren (`profileGeometry` i sida); her tegnes de. */

/* Skriften som stil, ikke som attributt: et presentasjonsattributt leser ikke
   CSS-variabler. */
const LABEL = { fontSize: 11, fill: "rgba(28,38,34,0.55)", style: { fontFamily: "var(--font-body)" } } as const;

function pathOf(xy: readonly [number, number][]): string {
  return xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

export function ElevationProfile({
  geometry,
  title,
  summary,
  label,
  startLabel,
  endLabel,
}: {
  geometry: ProfileGeometry;
  title: string;
  /** «5,5 km · ↑ 1270 m · brattest 900–1200 moh» */
  summary: string;
  /** Skjermleserens beskrivelse. */
  label: string;
  startLabel: string;
  endLabel: string;
}) {
  const { active, setHover, togglePin } = useStages();
  const { xy, spans } = geometry;
  const line = pathOf(xy);
  const area = `${line} L${PROFILE_W},${PROFILE_H} L0,${PROFILE_H} Z`;
  const segments = spans.length ? spans : [{ from: 0, to: xy.length - 1, x0: 0, x1: PROFILE_W }];

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <span className={styles.title}>{title}</span>
        <span className={styles.summary}>{summary}</span>
      </div>
      <svg viewBox={`0 0 ${PROFILE_W} ${PROFILE_H}`} className={styles.svg} role="img" aria-label={label}>
        <line x1="0" y1="40" x2={PROFILE_W} y2="40" stroke="rgba(28,38,34,0.1)" />
        <line x1="0" y1="80" x2={PROFILE_W} y2="80" stroke="rgba(28,38,34,0.1)" />
        <path d={area} fill="rgba(138,42,91,0.08)" />
        {segments.map((seg, i) => {
          const on = active === i;
          const dim = active !== null && !on;
          return (
            <g key={i}>
              <path
                d={pathOf(xy.slice(seg.from, seg.to + 1))}
                fill="none"
                stroke={dim ? "rgba(138,42,91,0.3)" : "#8a2a5b"}
                strokeWidth={on ? 5 : 2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {spans.length ? (
                <>
                  <rect
                    x={seg.x0}
                    y="0"
                    width={Math.max(0, seg.x1 - seg.x0)}
                    height={PROFILE_H}
                    fill={on ? "rgba(138,42,91,0.08)" : "transparent"}
                    className={styles.target}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => togglePin(i)}
                  />
                  <text
                    x={(seg.x0 + seg.x1) / 2}
                    y="146"
                    {...LABEL}
                    fontWeight="600"
                    textAnchor="middle"
                    pointerEvents="none"
                  >
                    {i + 1}
                  </text>
                </>
              ) : null}
            </g>
          );
        })}
        <text x="4" y="126" {...LABEL} pointerEvents="none">
          {startLabel}
        </text>
        <text x={PROFILE_W - 4} y="9" {...LABEL} textAnchor="end" pointerEvents="none">
          {endLabel}
        </text>
      </svg>
    </div>
  );
}
