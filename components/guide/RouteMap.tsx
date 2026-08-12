import { Blueprint } from "@/components/Blueprint";
import type { Lang } from "@/lib/i18n";
import { decimalLabel } from "@/lib/i18n/format";
import { guideDict } from "@/lib/i18n/guide";

/** Ruta opp, sett ovenfra — tegnet av turens egne punkter.
 *
 *  Her sto det tidligere `/assets/kontur.png`: ett bilde, det samme på alle 86
 *  tursidene, med alt-teksten «Skjematisk kartutsnitt av ruta opp X». Den var
 *  ikke sann. Det var ikke ruta opp X, det var den samme streken uansett hvilket
 *  fjell man sto på — og fra `/turer` og nedover var det den eneste illustrasjonen
 *  86 sider hadde.
 *
 *  Linja finnes allerede. `routeProfile()` gir punktene `/kart` tegner: en
 *  minstekostvei løst over Kartverkets 1 m terrengmodell gjennom korridoren ruta
 *  faktisk bruker. Å tegne dem her koster ingen ny fil, ingen ny forespørsel og
 *  ingen kartflate — det er inline SVG, servert med sida, ulik på hver av de 86.
 *
 *  Projeksjonen er equirectangular om rutas eget midtpunkt. Over noen få
 *  kilometer i Norge er avviket fra en ekte kartprojeksjon under en promille —
 *  langt mindre enn strekens egen bredde — og til gjengjeld slipper vi å dra inn
 *  et projeksjonsbibliotek for å tegne en strek. `cos(lat)` er det ene leddet som
 *  betyr noe: uten det blir Lyngen presset dobbelt så bredt som det er.
 *
 *  Målestokken er ikke pynt. En rute uten den kunne vært 800 meter eller åtte
 *  kilometer — formen alene sier ingenting — så rutenettet har en kjent
 *  maskevidde, og den står skrevet i hjørnet.
 */

/* 3:2, som bildet det erstatter — figuren står i samme rad som høydeprofilen,
   og raden skal ikke flytte seg. */
const W = 600;
const H = 400;
/** Luft rundt ruta, så starten og toppen ikke klistrer seg til kanten. */
const PAD = 30;

/** Maskevidder en leser kan regne i hodet. Meter. */
const GRID_STEPS = [100, 200, 250, 500, 1000, 2000, 2500, 5000, 10000];
/** Under dette blir rutenettet støy framfor målestokk. SVG-enheter. */
const MIN_GRID_UNITS = 55;

/** Meter per breddegrad. Lengdegraden krymper med `cos(lat)`. */
const M_PER_DEG_LAT = 111_320;

interface Plan {
  /** Rutas punkter i SVG-koordinater, i rekkefølge. */
  xy: [number, number][];
  /** Hvor mange meter én SVG-enhet er. */
  metresPerUnit: number;
}

function plan(points: readonly [number, number][]): Plan | null {
  if (points.length < 2) return null;

  const lats = points.map((p) => p[0]);
  const lngs = points.map((p) => p[1]);
  const lat0 = (Math.min(...lats) + Math.max(...lats)) / 2;
  const lng0 = (Math.min(...lngs) + Math.max(...lngs)) / 2;
  const mPerDegLng = M_PER_DEG_LAT * Math.cos((lat0 * Math.PI) / 180);

  /* Meter øst og nord for rutas midtpunkt. */
  const east = points.map(([, lng]) => (lng - lng0) * mPerDegLng);
  const north = points.map(([lat]) => (lat - lat0) * M_PER_DEG_LAT);

  /* Én felles skala for begge akser — en rute tegnet med hver sin er ikke et
     kart, den er en graf. `Math.max(…, 1)` for den teoretiske ruta som går rett
     nord: null bredde ville gitt en uendelig skala. */
  const spanE = Math.max(...east) - Math.min(...east);
  const spanN = Math.max(...north) - Math.min(...north);
  const scale = Math.min((W - 2 * PAD) / Math.max(spanE, 1), (H - 2 * PAD) / Math.max(spanN, 1));

  const midE = (Math.min(...east) + Math.max(...east)) / 2;
  const midN = (Math.min(...north) + Math.max(...north)) / 2;

  return {
    xy: points.map((_, i) => [
      W / 2 + (east[i] - midE) * scale,
      /* Minus: nord er opp i et kart og ned i et koordinatsystem. */
      H / 2 - (north[i] - midN) * scale,
    ]),
    metresPerUnit: 1 / scale,
  };
}

/** Den minste maskevidden som fortsatt er stor nok til å leses. */
function gridStep(metresPerUnit: number): number {
  const wanted = MIN_GRID_UNITS * metresPerUnit;
  return GRID_STEPS.find((step) => step >= wanted) ?? GRID_STEPS[GRID_STEPS.length - 1];
}

/** `6517` → `«6,5 km»`; `1000` → `«1 km»`; `840` → `«840 m»`.
 *
 *  Hele kilometer skrives uten desimal. Målestokken er nesten alltid et rundt
 *  tall, og «1,0 km» under en strek som er nøyaktig én kilometer lover en
 *  presisjon streken ikke har. */
function distanceLabel(metres: number, lang: Lang): string {
  if (metres < 1000) return `${Math.round(metres)} m`;
  const km = (metres / 1000).toFixed(1).replace(/\.0$/, "");
  return `${decimalLabel(km.replace(".", ","), lang)} km`;
}

export function RouteMap({
  peak,
  points,
  distanceM,
  gainM,
  trailhead,
  lang,
  caption = true,
  children,
}: {
  peak: string;
  points: readonly [number, number][];
  distanceM: number;
  gainM: number;
  trailhead: string;
  lang: Lang;
  /** Om figurteksten under kartet skal stå.
   *
   *  Den hører hjemme på en turside, der den er en opplysning om nettopp denne
   *  ruta — utgangspunkt, lengde, stigning, og forbeholdet om at linja er
   *  beregnet og ikke innspilt. På forsida er figuren et eksempel på hva en
   *  guide inneholder, ikke en guide, og da blir de tallene noe leseren må ta
   *  stilling til uten å ha spurt om dem. Der står lenka alene. */
  caption?: boolean;
  /** Lenka inn i kartet, satt av sida som eier stien dit. */
  children?: React.ReactNode;
}) {
  const t = guideDict(lang);
  const laid = plan(points);
  if (!laid) return null;

  const { xy, metresPerUnit } = laid;
  const d = xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join("");
  const [startX, startY] = xy[0];
  const [summitX, summitY] = xy[xy.length - 1];

  const step = gridStep(metresPerUnit);
  const cell = step / metresPerUnit;
  /* Rutenettet legges ut fra midten, så det står i ro om ruta er høy eller bred. */
  const verticals: number[] = [];
  for (let x = W / 2; x > 0; x -= cell) verticals.push(x);
  for (let x = W / 2 + cell; x < W; x += cell) verticals.push(x);
  const horizontals: number[] = [];
  for (let y = H / 2; y > 0; y -= cell) horizontals.push(y);
  for (let y = H / 2 + cell; y < H; y += cell) horizontals.push(y);

  const distance = distanceLabel(distanceM, lang);

  return (
    <Blueprint as="figure" style={{ margin: 0, padding: "18px 20px" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", height: "auto", display: "block", aspectRatio: "3 / 2" }}
        role="img"
        aria-label={t.routeMapAria(peak, distance, gainM)}
      >
        <g stroke="#1d1f2016" strokeWidth="1">
          {verticals.map((x) => (
            <line key={`v${x}`} x1={x.toFixed(1)} y1="0" x2={x.toFixed(1)} y2={H} />
          ))}
          {horizontals.map((y) => (
            <line key={`h${y}`} x1="0" y1={y.toFixed(1)} x2={W} y2={y.toFixed(1)} />
          ))}
        </g>

        {/* Ruta tegnes to ganger: en bred strek i papirfargen under, så linja
            over. Uten den forsvinner streken i rutenettet hver gang den krysser
            en maske. Det er den samme grunnen kart har hvite kanter rundt veier. */}
        <path
          d={d}
          fill="none"
          stroke="#f2f2f3"
          strokeWidth="6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          d={d}
          fill="none"
          stroke="#416180"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Start: en ring, som på et kart. Toppen: en trekant. */}
        <circle cx={startX.toFixed(1)} cy={startY.toFixed(1)} r="5" fill="#f2f2f3" stroke="#416180" strokeWidth="2" />
        <path
          d={`M${summitX.toFixed(1)},${(summitY - 7).toFixed(1)} L${(summitX + 6).toFixed(1)},${(summitY + 4).toFixed(1)} L${(summitX - 6).toFixed(1)},${(summitY + 4).toFixed(1)} Z`}
          fill="#416180"
        />

        {/* Nordpil. Projeksjonen er nord-opp, så den er en opplysning og ikke
            en dekorasjon — uten den er et kart uten kanter ikke orientert. */}
        <g stroke="#5d5d60" strokeWidth="1.5" fill="none">
          <line x1={W - 22} y1="34" x2={W - 22} y2="14" />
          <path d={`M${W - 27},20 L${W - 22},13 L${W - 17},20`} />
        </g>
        <text x={W - 22} y="48" fontSize="12" fill="#5d5d60" fontFamily="monospace" textAnchor="middle">
          N
        </text>

        {/* Målestokken: én maske i rutenettet, med vidden skrevet på. */}
        <g stroke="#5d5d60" strokeWidth="1.5">
          <line x1="20" y1={H - 22} x2={20 + cell} y2={H - 22} />
          <line x1="20" y1={H - 27} x2="20" y2={H - 17} />
          <line x1={20 + cell} y1={H - 27} x2={20 + cell} y2={H - 17} />
        </g>
        <text x="20" y={H - 30} fontSize="12" fill="#5d5d60" fontFamily="monospace">
          {distanceLabel(step, lang)}
        </text>
      </svg>

      {caption || children ? (
        <figcaption className="note" style={{ margin: "12px 0 0" }}>
          {caption ? `${t.routeMapCaption(trailhead, distance, gainM)} ` : null}
          {children}
        </figcaption>
      ) : null}
    </Blueprint>
  );
}
