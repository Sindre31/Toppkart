/** Favoritter og turer leseren har gått — den rene delen.
 *
 *  Ingen importer fra server eller nettleser: dette leses av API-ruta, av
 *  kartet og guiden i nettleseren, og av Min side på serveren, og de skal være
 *  enige om hva en markering er.
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

/** Leser kroppen på `POST /api/turmerker`. Null for alt som ikke er en
 *  gyldig forespørsel — et felt av feil type er ikke «ingen endring». */
export function parseMarkRequest(body: unknown): ({ slug: string } & MarkPatch) | null {
  if (!body || typeof body !== "object") return null;
  const { slug, favorite, done } = body as Record<string, unknown>;
  if (typeof slug !== "string" || !SLUG.test(slug)) return null;
  if (favorite !== undefined && typeof favorite !== "boolean") return null;
  if (done !== undefined && typeof done !== "boolean") return null;
  if (favorite === undefined && done === undefined) return null;
  return { slug, ...(favorite !== undefined && { favorite }), ...(done !== undefined && { done }) };
}

/* — demomodus: markeringene i én informasjonskapsel — */

/** `slogen|f|2026-10-05;kirketaket|-|` — kompakt, fordi en informasjonskapsel
 *  har fire kilobyte å gjøre det på. Demomodus er ikke en sikkerhetsgrense og
 *  ikke et lager; dette er nok til at flyten kan prøves uten Supabase. */
export function encodeDemoMarks(marks: readonly TourMark[]): string {
  return marks.map((m) => `${m.slug}|${m.favorite ? "f" : "-"}|${m.doneOn ?? ""}`).join(";");
}

export function decodeDemoMarks(value: string | undefined): TourMark[] {
  if (!value) return [];
  const out: TourMark[] = [];
  for (const part of value.split(";")) {
    const [slug, fav, date] = part.split("|");
    if (!slug || !SLUG.test(slug)) continue;
    const mark = { slug, favorite: fav === "f", doneOn: date && DATE.test(date) ? date : null };
    if (mark.favorite || mark.doneOn) out.push(mark);
  }
  return out;
}

/** Turer gått og høydemeter samlet, for Min side. Turer som ikke lenger finnes
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
