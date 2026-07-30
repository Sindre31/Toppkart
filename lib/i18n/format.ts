/** Localisation of the *structured* tour fields.
 *
 *  Tour rows carry compact Norwegian tokens — aspect `"SØ"`, season
 *  `"des–mai"`, duration `"5–7 t"`, grade `1…4`. These are data, not prose, so
 *  they are converted mechanically here instead of being duplicated per tour in
 *  `./content`. Anything editorial (teasers, route descriptions) lives there.
 */

import type { Grade } from "@/lib/types";
import type { Lang } from "./index";

/* — compass aspect — */

const ASPECT_EN: Record<string, string> = {
  N: "N",
  S: "S",
  "Ø": "E",
  V: "W",
  NV: "NW",
  "NØ": "NE",
  SV: "SW",
  "SØ": "SE",
};

/** `"SØ"` → `"SE"` in English; unchanged in Norwegian. Unknown codes pass
 *  through untouched so a new aspect never renders as an empty cell. */
export function aspectLabel(aspect: string, lang: Lang): string {
  if (lang === "no") return aspect;
  return ASPECT_EN[aspect.trim().toUpperCase()] ?? aspect;
}

/* — season window — */

const MONTH_EN: Record<string, string> = {
  jan: "Jan",
  feb: "Feb",
  mar: "Mar",
  apr: "Apr",
  mai: "May",
  jun: "Jun",
  jul: "Jul",
  aug: "Aug",
  sep: "Sep",
  okt: "Oct",
  nov: "Nov",
  des: "Dec",
};

/** `"des–mai"` → `"Dec–May"`. Splits on the en dash the data uses, and on a
 *  plain hyphen too, so hand-entered rows localise as well. */
export function seasonLabel(season: string, lang: Lang): string {
  if (lang === "no") return season;
  return season.replace(/[a-zæøå]+/gi, (month) => MONTH_EN[month.toLowerCase()] ?? month);
}

/* — duration — */

/** `"5–7 t"` → `"5–7 h"`. Only the unit is translated; the range is data. */
export function durationLabel(duration: string, lang: Lang): string {
  if (lang === "no") return duration;
  return duration.replace(/\bt\b/g, "h");
}

/* — grade — */

const GRADE_NAMES: Record<Lang, Record<Grade, string>> = {
  no: { 1: "Enkel", 2: "Middels", 3: "Krevende", 4: "Ekspert" },
  en: { 1: "Easy", 2: "Moderate", 3: "Demanding", 4: "Expert" },
};

export function gradeLabel(grade: Grade, lang: Lang): string {
  return GRADE_NAMES[lang][grade];
}

/* — elevation — */

/** The unit that follows a summit height: `moh` / `m`. */
export function elevationUnit(lang: Lang): string {
  return lang === "no" ? "moh" : "m";
}

/** `1439` → `"1439 moh"` / `"1439 m"`. */
export function elevationLabel(metres: number, lang: Lang): string {
  return `${metres} ${elevationUnit(lang)}`;
}

/** Rewrites `moh` inside an editorial string (`"60 moh"`, `"900 og 1200 moh"`).
 *  Used for the elevation-profile labels, which are prose-adjacent data. */
export function rewriteElevationUnit(text: string, lang: Lang): string {
  if (lang === "no") return text;
  return text.replace(/\bmoh\b/g, "m");
}

/* — numbers — */

/** Norwegian writes decimals with a comma (`5,5 km`), English with a point. */
export function decimalLabel(text: string, lang: Lang): string {
  if (lang === "no") return text;
  return text.replace(/(\d),(\d)/g, "$1.$2");
}
