/** Etappene i turguiden, avledet av det som allerede finnes: rutelinja fra
 *  `routeProfile()` og avsnittene i `guide.ascent`.
 *
 *  Designet (`design-reference/v3/README.md` → «Etapper») deler oppstigningen
 *  i 3–5 etapper, hver koblet til en strekning av linja, så kortet, kartet og
 *  høydeprofilen kan peke på det samme stykket. Guideteksten er allerede skrevet
 *  i den rekkefølgen: ett avsnitt per strekning, nedenfra og opp — 3 til 6
 *  avsnitt per tur. Så hvert avsnitt blir en etappe, og det som gjenstår er å
 *  finne hvor på linja den ene slutter og den neste begynner.
 *
 *  Det gjøres med høyden. Et avsnitt som begynner et nytt stykke av ruta, nevner
 *  som regel høyden det begynner på («Mellom 800 og 860 moh …», «På rundt 400
 *  svinger du …»). To tall peker på grensa: den høyeste høyden forrige avsnitt
 *  nevner (der det sluttet) og den første dette avsnittet nevner (der det
 *  begynner). Den laveste av dem er grensa — et avsnitt nevner gjerne et punkt
 *  lenger opp på sin egen strekning før det er ferdig, sjelden et lenger ned.
 *  Begge må ligge over forrige grense og under toppen; finnes ingen, deles
 *  resten av stigningen likt.
 *  Høyden slås så opp i linja: første punkt etter forrige grense som når den.
 *
 *  Det er en heuristikk, og den er bevisst enkel: den bommer i verste fall med
 *  et par hundre meter langs ruta, og da står etappen fortsatt i riktig
 *  rekkefølge med riktig tekst. Grensene leses alltid fra den norske teksten,
 *  så etappene er de samme på begge språk.
 *
 *  Ingen importer fra nettleseren her, så dette kan testes for seg. */

export interface Stage {
  /** 0-basert. */
  index: number;
  /** Første og siste punkt i linja, begge med. Etappe n+1 starter der n slutter. */
  from: number;
  to: number;
  /** Høyden der etappen starter og slutter, moh. */
  startM: number;
  endM: number;
  /** Lengde langs linja, meter. */
  lengthM: number;
  /** Andel av hele ruta, 0–1, der etappen starter og slutter. */
  startFrac: number;
  endFrac: number;
}

const EARTH_M = 6_371_000;

function haversine(a: readonly [number, number], b: readonly [number, number]): number {
  const toRad = Math.PI / 180;
  const dLat = (b[0] - a[0]) * toRad;
  const dLng = (b[1] - a[1]) * toRad;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * toRad) * Math.cos(b[0] * toRad) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Avstanden fra start til hvert punkt, skalert så den siste er `totalM`.
 *
 *  Summen av rette strekk mellom punktene er litt kortere enn rutas oppgitte
 *  lengde, som er målt langs bakken. Skaleringen gjør at etappene summerer seg
 *  til det tallet guiden ellers viser. */
export function cumulativeM(points: readonly (readonly [number, number])[], totalM?: number): number[] {
  const out = [0];
  for (let i = 1; i < points.length; i += 1) out.push(out[i - 1] + haversine(points[i - 1], points[i]));
  const raw = out[out.length - 1];
  if (!totalM || raw <= 0) return out;
  const k = totalM / raw;
  return out.map((d) => d * k);
}

/** Enheter som sier at et tall ikke er en høyde. Sjekkes rett etter tallet,
 *  også etter et intervall: «30–35 grader». */
const NOT_HEIGHT_AFTER =
  /^\s*(?:[–-]\s*\d+\s*)?(?:km\b|m\b|meter|metre|kilometer|grader|grad\b|°|høydemeter|høgdemeter|hm\b|%|min\b|minutt|t\b|timer|mm\b|cm\b|år\b)/i;
/** Veinummer og liknende rett foran tallet: «fv. 863», «E6». */
const NOT_HEIGHT_BEFORE = /(?:\b(?:fv|rv|ev|kv|e)\.?|nr\.?)\s*$/i;

/** Tallene i et avsnitt som kan være høyder, i den rekkefølgen de står.
 *
 *  To til fire sifre, ikke del av et desimaltall («34,6», «6,04 km») og ikke
 *  festet til bokstaver («Fv91»). */
export function heightMentions(text: string): number[] {
  const out: number[] = [];
  for (const m of text.matchAll(/(?<![\p{L}\d,.])(\d{2,4})(?![\d]|[,.]\d)/gu)) {
    const at = m.index ?? 0;
    const after = text.slice(at + m[0].length, at + m[0].length + 14);
    const before = text.slice(Math.max(0, at - 6), at);
    if (NOT_HEIGHT_AFTER.test(after) || NOT_HEIGHT_BEFORE.test(before)) continue;
    out.push(Number(m[1]));
  }
  return out;
}

/** Etappene langs linja.
 *
 *  `paragraphs` er oppstigningsteksten på norsk, ett avsnitt per etappe. Uten
 *  avsnitt, eller med en linje for kort til å deles, blir det ingen etapper —
 *  da tegnes ruta i ett stykke. */
export function deriveStages(
  paragraphs: readonly string[],
  elevations: readonly number[],
  cum: readonly number[],
): Stage[] {
  const k = paragraphs.length;
  const n = elevations.length;
  if (k === 0 || n < k + 1 || cum.length !== n) return [];

  const startM = elevations[0];
  const topM = Math.max(...elevations);
  const bounds = [0];
  let prevIdx = 0;
  let prevM = startM;

  for (let i = 1; i < k; i += 1) {
    /* Etappene som gjenstår etter denne grensa trenger minst ett punkt hver. */
    const maxIdx = n - 1 - (k - 1 - i);
    const remaining = k - i + 1;
    const fallback = prevM + (topM - prevM) / remaining;

    const indexFor = (target: number) => {
      for (let j = prevIdx + 1; j <= maxIdx; j += 1) if (elevations[j] >= target) return j;
      return -1;
    };

    const inRange = (h: number) => h > prevM + 25 && h < topM - 15;
    const ended = heightMentions(paragraphs[i - 1]).filter(inRange);
    const begins = heightMentions(paragraphs[i]).find(inRange);
    const candidates = [
      ...(ended.length ? [Math.max(...ended)] : []),
      ...(begins !== undefined ? [begins] : []),
    ];
    let idx = candidates.length ? indexFor(Math.min(...candidates)) : -1;
    if (idx === -1) idx = indexFor(fallback);
    /* Linja når aldri målet før det er for sent: del det som er igjen likt på
       punktene. */
    if (idx === -1) idx = Math.min(maxIdx, prevIdx + Math.max(1, Math.round((n - 1 - prevIdx) / remaining)));

    bounds.push(idx);
    prevIdx = idx;
    prevM = elevations[idx];
  }
  bounds.push(n - 1);

  const total = cum[n - 1] || 1;
  return paragraphs.map((_, i) => {
    const from = bounds[i];
    const to = bounds[i + 1];
    return {
      index: i,
      from,
      to,
      startM: Math.round(elevations[from]),
      endM: Math.round(elevations[to]),
      lengthM: cum[to] - cum[from],
      startFrac: cum[from] / total,
      endFrac: cum[to] / total,
    };
  });
}

/** Etappen med mest stigning per meter — «brattest 900–1200 moh» over
 *  høydeprofilen. Null når ingen etappe stiger. */
export function steepestStage(stages: readonly Stage[]): Stage | null {
  let best: Stage | null = null;
  let bestRate = 0;
  for (const s of stages) {
    if (s.lengthM <= 0) continue;
    const rate = (s.endM - s.startM) / s.lengthM;
    if (rate > bestRate) {
      best = s;
      bestRate = rate;
    }
  }
  return best;
}

/** Deler ingressen i det som står i vanlig skrift og en kort avsluttende
 *  setning i kursiv, slik designet setter den. Lange avslutninger blir stående
 *  rett: en kursiv setning på tre linjer leses som et sitat. */
export function splitLede(text: string): { body: string; italic: string | null } {
  const parts = text.trim().match(/[^.!?]+[.!?]+(?=\s|$)|[^.!?]+$/g);
  if (!parts || parts.length < 2) return { body: text, italic: null };
  const last = parts[parts.length - 1].trim();
  if (last.length > 64) return { body: text, italic: null };
  return { body: parts.slice(0, -1).join("").trim(), italic: last };
}

/** Fet innledning på et avsnitt: det som står før første kolon eller punktum,
 *  når det er kort nok til å være en innledning og ikke en setning.
 *  «Vanligste feil: å slippe seg …» → «Vanligste feil» + «: å slippe seg …». */
export function leadIn(text: string): { lead: string | null; rest: string } {
  const m = text.match(/^([^.:;]{3,40})([.:])\s/);
  if (!m) return { lead: null, rest: text };
  return { lead: m[1], rest: text.slice(m[1].length) };
}

/** Den første gradangivelsen i en tekst, som et tall for et kort: «30–35°».
 *  Null når teksten ikke nevner grader. */
export function slopeFigure(text: string): string | null {
  const m = text.match(/(\d{1,2})(?:\s*[–-]\s*(\d{1,2}))?\s*(?:grader|°|degrees)/i);
  if (!m) return null;
  return m[2] ? `${m[1]}–${m[2]}°` : `${m[1]}°`;
}

/** Høydeprofilens viewBox. Står her og ikke i `ElevationProfile.tsx`: den er en
 *  klientmodul, og en konstant importert derfra til en serverkomponent er en
 *  klientreferanse, ikke et tall. */
export const PROFILE_W = 600;
export const PROFILE_H = 150;

export interface ProfileGeometry {
  /** Punktene i viewBox-koordinater. */
  xy: readonly [number, number][];
  /** Første og siste punkt i `xy` per etappe, og etappens utstrekning i x. */
  spans: readonly { from: number; to: number; x0: number; x1: number }[];
}
