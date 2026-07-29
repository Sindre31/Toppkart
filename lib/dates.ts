/** Date helpers.
 *
 *  Formatting goes through `Intl.DateTimeFormat` on the tag `htmlLang()`
 *  returns, so the same call renders «12. august 2026» for a Norwegian reader
 *  and "August 12, 2026" for an English one. The Norwegian output is identical
 *  to the hand-rolled month table this file used to carry.
 *
 *  Parsing and arithmetic stay dependency-free: the app only ever needs to read
 *  a date the database wrote and add days to it for the end of a trial.
 */

import { htmlLang, type Lang } from "@/lib/i18n";

/** Anything a date can arrive as: an ISO string, a timestamp, or a Date. */
export type DateInput = string | number | Date;

/** Parse to a Date, or null when the input is missing/unparseable.
 *  A bare `YYYY-MM-DD` is read as a local calendar date (not UTC midnight), so
 *  it never slips to the previous day west of Greenwich. */
export function toDate(value: DateInput | null | undefined): Date | null {
  if (value === null || value === undefined || value === "") return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : new Date(value.getTime());
  }

  if (typeof value === "number") {
    const fromNumber = new Date(value);
    return Number.isNaN(fromNumber.getTime()) ? null : fromNumber;
  }

  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (dateOnly) {
    return new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]));
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** `addDays(new Date(), 14)` → the day the trial ends. Never mutates the input. */
export function addDays(value: DateInput, days: number): Date {
  const base = toDate(value) ?? new Date();
  const next = new Date(base.getTime());
  next.setDate(next.getDate() + days);
  return next;
}

/* — formatting —
 *
 * Building an `Intl.DateTimeFormat` is the expensive part, so the two we need
 * are memoised per language and reused for the rest of the process.
 */

const DATE_FORMATS: Partial<Record<Lang, Intl.DateTimeFormat>> = {};
const TIME_FORMATS: Partial<Record<Lang, Intl.DateTimeFormat>> = {};

function dateFormat(lang: Lang): Intl.DateTimeFormat {
  return (DATE_FORMATS[lang] ??= new Intl.DateTimeFormat(htmlLang(lang), {
    day: "numeric",
    month: "long",
    year: "numeric",
  }));
}

/** Norwegian keeps the 24-hour clock the prototypes use; English gets whatever
 *  the locale prefers, which is `9:30 AM`. */
function timeFormat(lang: Lang): Intl.DateTimeFormat {
  return (TIME_FORMATS[lang] ??=
    lang === "no"
      ? new Intl.DateTimeFormat(htmlLang(lang), { hour: "2-digit", minute: "2-digit", hour12: false })
      : new Intl.DateTimeFormat(htmlLang(lang), { hour: "numeric", minute: "2-digit" }));
}

/** «12. august 2026» / "August 12, 2026". Returns an empty string for a
 *  missing/invalid date, so callers can render it straight into copy without
 *  guarding first. */
export function formatDate(value: DateInput | null | undefined, lang: Lang = "no"): string {
  const date = toDate(value);
  if (!date) return "";
  return dateFormat(lang).format(date);
}

/** «12. august 2026, 09:30» / "August 12, 2026, 9:30 AM" — for timestamps where
 *  the clock matters. */
export function formatDateTime(value: DateInput | null | undefined, lang: Lang = "no"): string {
  const date = toDate(value);
  if (!date) return "";
  return `${formatDate(date, lang)}, ${timeFormat(lang).format(date)}`;
}

/** Former names of `formatDate` / `formatDateTime`, kept so call sites that
 *  have not been passed a language yet keep working. Prefer the new names. */
export const formatNorwegianDate = formatDate;
export const formatNorwegianDateTime = formatDateTime;

/** `YYYY-MM-DD` for the given date, in local time. Machine-readable, so it is
 *  the same in both languages. */
export function toISODateString(value: DateInput): string {
  const date = toDate(value) ?? new Date();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${mm}-${dd}`;
}
