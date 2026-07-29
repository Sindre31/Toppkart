/** Norwegian date helpers.
 *
 *  Dependency-free on purpose: no Intl locale data, no date library. The whole
 *  app writes dates the way the prototypes do — «12. august 2026» — and adds
 *  days when it needs the end of a 14-day trial.
 */

export const NORWEGIAN_MONTHS = [
  "januar",
  "februar",
  "mars",
  "april",
  "mai",
  "juni",
  "juli",
  "august",
  "september",
  "oktober",
  "november",
  "desember",
] as const;

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

/** «12. august 2026». Returns an empty string for a missing/invalid date, so
 *  callers can render it straight into copy without guarding first. */
export function formatNorwegianDate(value: DateInput | null | undefined): string {
  const date = toDate(value);
  if (!date) return "";
  return `${date.getDate()}. ${NORWEGIAN_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/** «12. august 2026, 09:30» — for timestamps where the clock matters. */
export function formatNorwegianDateTime(value: DateInput | null | undefined): string {
  const date = toDate(value);
  if (!date) return "";
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${formatNorwegianDate(date)}, ${hh}:${mm}`;
}

/** `YYYY-MM-DD` for the given date, in local time. */
export function toISODateString(value: DateInput): string {
  const date = toDate(value) ?? new Date();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${mm}-${dd}`;
}
