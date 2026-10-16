/** Favoritter og turer leseren har gått — den rene delen.
 *
 *  Markeringene ligger i leserens egen nettleser (`localStorage`, se
 *  `components/marks/useTourMarks.ts`) — Toppkart har ingen kontoer. Ingen
 *  importer fra nettleseren her, så dette kan testes for seg.
 *
 *  Én markering per tur og leser, med to felt: favoritt (av/på) og datoen turen
 *  ble gått (eller ingenting). En markering der begge er tomme, finnes ikke — den
 *  slettes i stedet for å bli liggende som en rad som sier ingenting. */

export interface TourMark {
  slug: string;
  favorite: boolean;
  /** Norsk kalenderdag, `YYYY-MM-DD`, eller null for ikke gått. */
  doneOn: string | null;
}

/** Det en knapp ber om. Utelatte felt beholdes som de var. */
export interface MarkPatch {
  favorite?: boolean;
  /** `true` merker turen som gått i dag — eller beholder datoen den allerede
   *  har. `false` fjerner den. */
  done?: boolean;
}

/** Markeringen etter `patch`, eller null når det ikke er noe igjen å lagre.
 *
 *  Å trykke «Gått» på en tur som alt er gått, flytter ikke datoen. Datoen er
 *  når man gikk den, ikke når man sist trykket. */
export function applyMark(
  prev: TourMark | undefined,
  slug: string,
  patch: MarkPatch,
  today: string,
): TourMark | null {
  const favorite = patch.favorite ?? prev?.favorite ?? false;
  const doneOn =
    patch.done === undefined ? (prev?.doneOn ?? null) : patch.done ? (prev?.doneOn ?? today) : null;
  return favorite || doneOn ? { slug, favorite, doneOn } : null;
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG = /^[a-z0-9-]{1,80}$/;

/** Leser lista slik den ligger lagret. Alt som ikke er en gyldig markering,
 *  droppes framfor å gjettes på — og en lagring som ikke kan leses i det hele
 *  tatt, er en tom liste, ikke en feil. */
export function parseStoredMarks(value: string | null): TourMark[] {
  if (!value) return [];
  let raw: unknown;
  try {
    raw = JSON.parse(value);
  } catch {
    return [];
  }
  if (!Array.isArray(raw)) return [];
  const out: TourMark[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const { slug, favorite, doneOn } = item as Record<string, unknown>;
    if (typeof slug !== "string" || !SLUG.test(slug)) continue;
    const mark = {
      slug,
      favorite: favorite === true,
      doneOn: typeof doneOn === "string" && DATE.test(doneOn) ? doneOn : null,
    };
    if (mark.favorite || mark.doneOn) out.push(mark);
  }
  return out;
}

/** Turer gått og høydemeter samlet, for «Mine turer». Turer som ikke lenger finnes
 *  i datasettet, telles ikke — de har ingen høydemeter å legge til. */
export function doneTotals(
  marks: readonly TourMark[],
  verticalOf: (slug: string) => number | undefined,
): { count: number; verticalM: number } {
  let count = 0;
  let verticalM = 0;
  for (const m of marks) {
    if (!m.doneOn) continue;
    const v = verticalOf(m.slug);
    if (v === undefined) continue;
    count += 1;
    verticalM += v;
  }
  return { count, verticalM };
}
