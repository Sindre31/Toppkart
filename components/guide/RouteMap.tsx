import { Blueprint } from "@/components/Blueprint";
import type { Lang } from "@/lib/i18n";
import { decimalLabel } from "@/lib/i18n/format";
import { guideDict } from "@/lib/i18n/guide";

/** Ruta opp, tegnet over Kartverkets kart.
 *
 *  Den startet som `/assets/kontur.png`: ett bilde, det samme på alle
 *  tursidene, med alt-teksten «Skjematisk kartutsnitt av ruta opp X». Det var
 *  ikke ruta opp X — det var den samme streken uansett hvilket fjell man sto
 *  på. Så ble det rutas egne punkter i en tom ramme med et tegnet rutenett bak,
 *  som var sant, men som viste en strek som svevde: formen på ruta og ingenting
 *  om terrenget den går i. En rute uten fjell rundt seg er en graf.
 *
 *  Nå ligger Kartverkets topografiske fliser under. Det er det samme kartet
 *  `/kart` tegner, i det samme rutenettet, og linja er regnet ut i den samme
 *  høydemodellen flisene er tegnet av — så høydekurvene under streken er de
 *  kurvene streken faktisk fulgte.
 *
 *  **Projeksjonen er ikke lenger vår egen.** Den var equirectangular om rutas
 *  midtpunkt, som er godt nok når ingenting skal stemme overens med noe. Nå må
 *  streken ligge på riktig sted i et bilde noen andre har tegnet, og da må vi
 *  regne i nøyaktig deres projeksjon: sfærisk Mercator, samme som WMTS-en og
 *  samme som Leaflet. Regnestykket under er det Leaflet gjør internt; det er
 *  ikke mye, og alternativet er et bibliotek for å plassere tolv bilder.
 *
 *  Flisene er vanlige `<img>`, ikke `next/image`: de kommer fra en flis-cache
 *  som allerede har dem ferdig skalert i riktig størrelse, og å sende dem
 *  gjennom en optimaliserer ville koste en rundtur for å produsere den samme
 *  256×256-fila. Plasseringa er i prosent, ikke piksler, fordi figuren er
 *  responsiv og bare kjenner høyde/bredde-forholdet sitt — som er låst, så
 *  prosent i begge akser skalerer likt og flisene holder seg firkantede.
 */

/* 3:2. Figuren står i samme rad som høydeprofilen, og raden skal ikke flytte
   seg. Tallene er også lerretet alt under regnes i: viewBox-en til SVG-en er
   `0 0 600 400`, og én enhet der er én kartpiksel. */
const W = 600;
const H = 400;
/** Luft rundt ruta, så starten og toppen ikke klistrer seg til kanten.
 *
 *  Holdes lav med vilje. Zoom er heltall, så hver piksel lagt til her er en
 *  halvering av målestokken i det øyeblikket ruta ikke lenger får plass — og
 *  forsøket på å gi nordpila albuerom ved å øke denne kostet et helt nivå på
 *  Kirketaket. Kollisjonen løses der den oppstår i stedet: `quietCorners()`
 *  flytter pila og målestokken dit ruta ikke er. */
const PAD = 34;

/** Hjørnene, med klokka fra øverst til venstre. */
const CORNERS = ["tl", "tr", "bl", "br"] as const;
type Corner = (typeof CORNERS)[number];

/** Hvor stort et område i hjørnet vi regner som opptatt. SVG-enheter. */
const CORNER_W = 150;
const CORNER_H = 80;

/** De to roligste hjørnene, målt mot ruta selv.
 *
 *  Nordpila og målestokken må stå et sted, og hvilket sted som er ledig er
 *  ikke det samme fra tur til tur: en tur som går nordover fyller toppen av
 *  bildet, en som går vestover fyller venstresida. Med faste hjørner traff
 *  toppmarkøren nordpila på omtrent annenhver tur — halvgjennomsiktige plater
 *  gjorde det lesbart, ikke tilsiktet.
 *
 *  Så vi teller hvor mange av rutas punkter som faller i hvert hjørne og tar de
 *  to roligste. Rekkefølgen mellom like hjørner er `CORNERS`, som er fast, så
 *  den samme ruta får det samme bildet hver gang. */
function quietCorners(xy: readonly [number, number][]): { north: Corner; scale: Corner } {
  const score = (corner: Corner) => {
    const left = corner === "tl" || corner === "bl" ? 0 : W - CORNER_W;
    const top = corner === "tl" || corner === "tr" ? 0 : H - CORNER_H;
    return xy.filter(
      ([x, y]) => x >= left && x <= left + CORNER_W && y >= top && y <= top + CORNER_H,
    ).length;
  };
  const ranked = [...CORNERS].sort((a, b) => score(a) - score(b));
  return { north: ranked[0], scale: ranked[1] };
}

/** WMTS-en serverer 256-pikslers fliser i `webmercator`-rutenettet. */
const TILE = 256;
/** Så langt Kartverkets cache er tegnet i praksis. Nivå 19 svarer 400. */
const MAX_Z = 17;
/** Under dette er ruta så lang at kartet uansett bare er en flate. */
const MIN_Z = 6;

/** Jordas omkrets ved ekvator, meter. Meter per piksel er dette delt på
 *  bredden av verden i piksler, ganget med `cos(lat)`. */
const EQUATOR_M = 40_075_016.686;

/** Målestokker en leser kan regne i hodet. Meter. */
const SCALE_STEPS = [100, 200, 250, 500, 1000, 2000, 2500, 5000, 10000];
/** Kortere enn dette blir målestokken for stump til å leses. SVG-enheter. */
const MIN_SCALE_UNITS = 55;

/** Kartverkets to serier. Fargelagt der kartet skal leses, gråtone der figuren
 *  er et eksempel og ikke et arbeidsverktøy — begge er Kartverkets egne, så
 *  gråtonen er tegnet for å være grå og ikke et fargekart med filter over. */
const LAYER = { colour: "topo", grey: "topograatone" } as const;

export type MapTone = keyof typeof LAYER;

function tileUrl(tone: MapTone, z: number, x: number, y: number): string {
  /* Rekkefølgen i stien er {z}/{y}/{x} — TileMatrix, TileRow, TileCol. y før x,
     motsatt av OpenStreetMap. Byttes de om, blir kartet speilvendt om
     diagonalen uten at en eneste forespørsel feiler. */
  return `https://cache.kartverket.no/v1/wmts/1.0.0/${LAYER[tone]}/default/webmercator/${z}/${y}/${x}.png`;
}

/** Lengdegrad → verdenspiksel-X ved zoom z. */
export function worldX(lng: number, z: number): number {
  return ((lng + 180) / 360) * TILE * 2 ** z;
}

/** Breddegrad → verdenspiksel-Y ved zoom z. Mercators strekk i ett uttrykk. */
export function worldY(lat: number, z: number): number {
  const s = Math.sin((lat * Math.PI) / 180);
  return (0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * TILE * 2 ** z;
}

interface Tile {
  key: string;
  src: string;
  /** Prosent av figurens bredde/høyde. */
  left: number;
  top: number;
}

export interface Plan {
  /** Rutas punkter i figurens eget koordinatsystem (piksler, 0…W / 0…H). */
  xy: [number, number][];
  tiles: Tile[];
  /** Hvor mange meter én enhet i viewBox-en er. */
  metresPerUnit: number;
}

export function plan(points: readonly [number, number][], tone: MapTone): Plan | null {
  if (points.length < 2) return null;

  const lats = points.map((p) => p[0]);
  const lngs = points.map((p) => p[1]);
  const lat0 = (Math.min(...lats) + Math.max(...lats)) / 2;

  /* Største zoom der hele ruta fortsatt får plass innenfor lufta. Vi teller
     nedover framfor å regne det ut, fordi zoom er heltall uansett og lista er
     tolv ledd lang. */
  let z = MAX_Z;
  for (; z > MIN_Z; z -= 1) {
    const xs = lngs.map((lng) => worldX(lng, z));
    const ys = lats.map((lat) => worldY(lat, z));
    const spanX = Math.max(...xs) - Math.min(...xs);
    const spanY = Math.max(...ys) - Math.min(...ys);
    if (spanX <= W - 2 * PAD && spanY <= H - 2 * PAD) break;
  }

  const xs = lngs.map((lng) => worldX(lng, z));
  const ys = lats.map((lat) => worldY(lat, z));
  /* Utsnittet sentreres på rutas omsluttende rektangel, ikke på toppen: en
     rute som går langt sidelengs skal ikke havne halvveis utenfor kanten. */
  const originX = (Math.min(...xs) + Math.max(...xs)) / 2 - W / 2;
  const originY = (Math.min(...ys) + Math.max(...ys)) / 2 - H / 2;

  const span = 2 ** z;
  const tiles: Tile[] = [];
  for (let tx = Math.floor(originX / TILE); tx <= Math.floor((originX + W) / TILE); tx += 1) {
    for (let ty = Math.floor(originY / TILE); ty <= Math.floor((originY + H) / TILE); ty += 1) {
      /* Utenfor rutenettet finnes det ingen fliser. Ingen norsk rute kommer i
         nærheten av kanten, men en manglende sjekk her er en 400 fra
         Kartverket og en ødelagt bilderute i figuren. */
      if (ty < 0 || ty >= span) continue;
      const wrapped = ((tx % span) + span) % span;
      tiles.push({
        key: `${tx}/${ty}`,
        src: tileUrl(tone, z, wrapped, ty),
        left: ((tx * TILE - originX) / W) * 100,
        top: ((ty * TILE - originY) / H) * 100,
      });
    }
  }

  return {
    xy: points.map((_, i) => [xs[i] - originX, ys[i] - originY]),
    tiles,
    metresPerUnit: (EQUATOR_M * Math.cos((lat0 * Math.PI) / 180)) / (TILE * 2 ** z),
  };
}

/** Den korteste målestokken som fortsatt er lang nok til å leses. */
function scaleStep(metresPerUnit: number): number {
  const wanted = MIN_SCALE_UNITS * metresPerUnit;
  return SCALE_STEPS.find((step) => step >= wanted) ?? SCALE_STEPS[SCALE_STEPS.length - 1];
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
  tone = "colour",
  caption = true,
  children,
}: {
  peak: string;
  points: readonly [number, number][];
  distanceM: number;
  gainM: number;
  trailhead: string;
  lang: Lang;
  /** Fargelagt kart der figuren skal leses som et kart (tursidene), gråtone der
   *  den er et eksempel på hva en guide inneholder (forsida). */
  tone?: MapTone;
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
  const laid = plan(points, tone);
  if (!laid) return null;

  const { xy, tiles, metresPerUnit } = laid;
  const d = xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join("");
  const [startX, startY] = xy[0];
  const [summitX, summitY] = xy[xy.length - 1];

  const step = scaleStep(metresPerUnit);
  const bar = step / metresPerUnit;
  const distance = distanceLabel(distanceM, lang);

  const corner = quietCorners(xy);
  const INSET = 10;
  const northX = corner.north === "tl" || corner.north === "bl" ? INSET : W - 36 - INSET;
  const northY = corner.north === "tl" || corner.north === "tr" ? INSET : H - 46 - INSET;
  const scaleX = corner.scale === "tl" || corner.scale === "bl" ? INSET : W - (bar + 30) - INSET;
  const scaleY = corner.scale === "tl" || corner.scale === "tr" ? INSET : H - 32 - INSET;

  return (
    <Blueprint as="figure" style={{ margin: 0, padding: "18px 20px" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "3 / 2",
          overflow: "hidden",
          /* Under flisene, og i kanten hvis en av dem ikke kommer fram.
             Kartverkets papirfarge, så et hull ser ut som tomt kart og ikke
             som et hull. */
          background: "#fff",
        }}
      >
        {tiles.map((tile) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={tile.key}
            src={tile.src}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            style={{
              position: "absolute",
              left: `${tile.left}%`,
              top: `${tile.top}%`,
              width: `${(TILE / W) * 100}%`,
              height: `${(TILE / H) * 100}%`,
            }}
          />
        ))}

        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          role="img"
          aria-label={t.routeMapAria(peak, distance, gainM)}
        >
          {/* Ruta tegnes to ganger: en bred strek i papirfargen under, så linja
              over. Det var nødvendig mot et tegnet rutenett og er mer nødvendig
              nå — under streken ligger høydekurver, stier og skrift, og uten
              kappen forsvinner den i dem med jevne mellomrom. Det er den samme
              grunnen kart har hvite kanter rundt veier. */}
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

          {/* Nordpil og målestokk står på en lys plate hver. Mot en tom ramme
              kunne de stå fritt; over et kart med kurver og skrift under må de
              ha noe å stå på for å kunne leses. Hvilket hjørne de står i,
              avgjør ruta — se `quietCorners`. */}
          <g transform={`translate(${northX}, ${northY})`}>
            <rect width="36" height="46" fill="#ffffffcc" />
            <g stroke="#5d5d60" strokeWidth="1.5" fill="none">
              <line x1="18" y1="32" x2="18" y2="12" />
              <path d="M13,18 L18,11 L23,18" />
            </g>
            <text x="18" y="44" fontSize="12" fill="#5d5d60" fontFamily="monospace" textAnchor="middle">
              N
            </text>
          </g>

          <g transform={`translate(${scaleX}, ${scaleY})`}>
            <rect width={bar + 30} height="32" fill="#ffffffcc" />
            <g stroke="#5d5d60" strokeWidth="1.5">
              <line x1="8" y1="24" x2={8 + bar} y2="24" />
              <line x1="8" y1="19" x2="8" y2="29" />
              <line x1={8 + bar} y1="19" x2={8 + bar} y2="29" />
            </g>
            <text x="8" y="15" fontSize="12" fill="#5d5d60" fontFamily="monospace">
              {distanceLabel(step, lang)}
            </text>
          </g>
        </svg>
      </div>

      <figcaption className="note" style={{ margin: "12px 0 0" }}>
        {caption ? `${t.routeMapCaption(trailhead, distance, gainM)} ` : null}
        {children}
        {/* Lisensen på flisene krever at opphavet står synlig. Det gjør det her,
            uansett om figurteksten ellers står eller ikke. */}
        {caption || children ? " " : null}
        {t.routeMapCredit}
      </figcaption>
    </Blueprint>
  );
}
