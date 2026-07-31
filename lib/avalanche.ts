import type { Lang } from "@/lib/i18n";

/** Today's avalanche danger for a coordinate, from Varsom (NVE).
 *
 *  Source: the national avalanche warning service, the same forecast the
 *  guides already tell people to read. Free, no key, no attribution beyond
 *  naming Varsom and linking back — which the UI does.
 *
 *  Endpoint:
 *    /AvalancheWarningByCoordinates/Simple/{lat}/{lon}/{langKey}/{from}/{to}
 *    langKey 1 = Norwegian, 2 = English.
 *
 *  Two answers are easy to misread as a rating and are not:
 *
 *  - `DangerLevel: "0"` with «Ikke vurdert». Outside the season — roughly May
 *    to November — every region answers this. Zero is not a low danger, it is
 *    *no assessment*, and showing it as a number on the same scale as 1–5
 *    would be inventing a forecast nobody made.
 *  - `null` for the whole response. The coordinate is outside every forecast
 *    region. Not an empty array — `null`.
 *
 *  Both get their own state, so the UI can say which is true rather than
 *  rendering an empty box.
 *
 *  Nothing here throws. An avalanche panel that cannot load must not take the
 *  tour detail down with it.
 */

/** 1–5 is the European scale. `notAssessed` and `outsideRegion` are the two
 *  non-answers above; `unavailable` is our own failure to reach Varsom. */
export type AvalancheState = "level" | "notAssessed" | "outsideRegion" | "unavailable";

export interface AvalancheForecast {
  state: AvalancheState;
  /** 1–5, only when `state` is `"level"`. */
  level: number | null;
  /** Varsom's forecast region, e.g. «Lyngen». Null when outside one. */
  regionName: string | null;
  /** The forecast's own summary sentence. Varsom writes it; we do not edit it. */
  mainText: string | null;
  /** ISO date the forecast covers, in Norwegian local time. */
  date: string;
}

const BASE = "https://api01.nve.no/hydrology/forecast/avalanche/v6.3.2/api";

/** The forecast is published per Norwegian calendar day, so the date has to be
 *  Oslo's — a UTC server would ask for yesterday for part of the evening. */
export function osloDate(now: Date = new Date()): string {
  return now.toLocaleDateString("en-CA", { timeZone: "Europe/Oslo" });
}

interface VarsomSimple {
  DangerLevel?: string | null;
  RegionName?: string | null;
  MainText?: string | null;
}

function unavailable(date: string): AvalancheForecast {
  return { state: "unavailable", level: null, regionName: null, mainText: null, date };
}

export async function getAvalancheForecast(
  lat: number,
  lng: number,
  lang: Lang,
  now: Date = new Date(),
): Promise<AvalancheForecast> {
  const date = osloDate(now);
  const langKey = lang === "en" ? 2 : 1;
  const url = `${BASE}/AvalancheWarningByCoordinates/Simple/${lat}/${lng}/${langKey}/${date}/${date}`;

  let payload: unknown;
  try {
    const res = await fetch(url, {
      // Varsom publishes once a day and revises in the afternoon. Half an hour
      // is far fresher than the forecast changes, and keeps us off their API
      // on every marker tap.
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return unavailable(date);
    payload = await res.json();
  } catch {
    // Network, timeout, or malformed JSON — all the same to the reader.
    return unavailable(date);
  }

  // `null` rather than `[]` is what a coordinate outside every region returns.
  if (!Array.isArray(payload) || payload.length === 0) {
    return { state: "outsideRegion", level: null, regionName: null, mainText: null, date };
  }

  const first = payload[0] as VarsomSimple;
  const regionName = first.RegionName?.trim() || null;
  const mainText = first.MainText?.trim() || null;
  const level = Number.parseInt(first.DangerLevel ?? "", 10);

  if (!Number.isFinite(level) || level < 1 || level > 5) {
    // "0" — in the region, but no assessment for this date.
    return { state: "notAssessed", level: null, regionName, mainText, date };
  }

  return { state: "level", level, regionName, mainText, date };
}

/** The European avalanche danger scale's own colours.
 *
 *  Deliberately outside the site palette. These five are a safety standard
 *  every skier already reads at a glance, and restyling them in steel blue to
 *  match the brand would make the most important thing on the page harder to
 *  read. Level 5 is black, the way Varsom shows it.
 */
export const DANGER_COLORS: Record<number, { bg: string; fg: string }> = {
  1: { bg: "#ccff66", fg: "#1d2d3d" },
  2: { bg: "#ffff00", fg: "#1d2d3d" },
  3: { bg: "#ff9900", fg: "#1d2d3d" },
  4: { bg: "#ff0000", fg: "#ffffff" },
  5: { bg: "#000000", fg: "#ffffff" },
};
