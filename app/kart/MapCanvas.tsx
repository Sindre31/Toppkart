"use client";

/** The Leaflet half of the map page. Loaded through `next/dynamic` with
 *  `ssr: false` from MapView — Leaflet touches `window` at import time. */

import { useEffect, useMemo, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Polyline,
  TileLayer,
  Tooltip,
  ZoomControl,
  useMap,
} from "react-leaflet";
import {
  latLngBounds,
  type LatLngBounds,
  type LatLngBoundsExpression,
  type LatLngExpression,
  type LatLngTuple,
  type Map as LeafletMap,
} from "leaflet";
import "leaflet/dist/leaflet.css";

import { GRADE_COLORS } from "@/lib/config";
import type { Lang } from "@/lib/i18n";
import { mapDict } from "@/lib/i18n/map";
import type { TourRoute } from "@/lib/routes";
import type { Tour } from "@/lib/types";

/** Initial view — mainland Norway, as in the prototype. */
const NORWAY: LatLngBoundsExpression = [
  [58.0, 4.5],
  [70.6, 26.0],
];

const MARKER_STROKE = "#f2f2f3";
const ROUTE_ACCENT = "#416180"; // accent-700
const ROUTE_ALT = "#8aa2b8"; // the peak's other routes, a step back

const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
/** Leaflets standard, og det `TileLayer` under kjører med. */
const TILE_SIZE = 256;

/** Zoomen en topp får når vi ikke har rutelinja å ramme inn ennå — omtrent det
 *  en ruteinnramming lander på, så den etterfølgende justeringen blir kort. */
const PEAK_ZOOM = 12;

type RouteTable = Record<string, readonly TourRoute[]>;

/** Der flyturen ender. Samme regnestykke som `flyToBounds` gjør internt, men vi
 *  trenger svaret på forhånd for å kunne hente flisene før vi lander. */
function targetView(map: LeafletMap, bounds: LatLngBounds) {
  const zoom = map.getBoundsZoom(bounds);
  const sw = map.project(bounds.getSouthWest(), zoom);
  const ne = map.project(bounds.getNorthEast(), zoom);
  return { center: map.unproject(sw.add(ne).divideBy(2), zoom), zoom };
}

/** Be nettleseren om flisene vi lander på, mens flyturen ennå pågår.
 *
 *  Uten dette ber Leaflet om dem først når bevegelsen er ferdig, og et skjermbilde
 *  med fliser tar noen hundre millisekunder å få ned. Det er det man ser: kartet
 *  står et øyeblikk med den forrige zoomens fliser strukket opp — uskarpt, som om
 *  det ikke er lastet — og blir så plutselig skarpt når de riktige lander.
 *
 *  Et skjermbilde er et par dusin fliser. De hentes med samme URL og uten
 *  `crossOrigin`, akkurat som `TileLayer` selv gjør, slik at Leaflets egen
 *  forespørsel treffer nettleserens cache i stedet for nettet. Blir turen
 *  avbrutt er tapet et titalls fliser som uansett ligger klare neste gang noen
 *  ser på det området. */
function prefetchTiles(map: LeafletMap, center: LatLngExpression, zoom: number) {
  const z = Math.round(zoom);
  const half = map.getSize().divideBy(2);
  const middle = map.project(center, z);
  const from = middle.subtract(half).divideBy(TILE_SIZE).floor();
  const to = middle.add(half).divideBy(TILE_SIZE).floor();
  const span = 2 ** z;

  for (let x = from.x; x <= to.x; x += 1) {
    for (let y = from.y; y <= to.y; y += 1) {
      /* Utenfor polene finnes det ingen fliser; rundt datolinja gjør det det. */
      if (y < 0 || y >= span) continue;
      const image = new Image();
      image.src = TILE_URL.replace("{z}", String(z))
        .replace("{x}", String(((x % span) + span) % span))
        .replace("{y}", String(y));
    }
  }
}

const veilTimers = new WeakMap<HTMLElement, number>();

/** Skjuler topp- og rutelaget mens vi flyr, og henter det fram ved landing.
 *
 *  Leaflet tegner ikke vektorene om underveis i en flytur — det er ett SVG-lag,
 *  og det skaleres. Fra landsvisningen ned til en topp er det åtte nivåer, altså
 *  256 ganger: en toppmarkør på 7 px blir til en blå flate på 1800, og
 *  rutelinja til en tilsvarende stripe. Det er ikke flisene som gjør turen rar å
 *  se på, det er dette — tre sirkler som dekker skjermen mens kartet er på vei.
 *
 *  De sier heller ingenting så lenge de er feil størrelse, så de tones ut ved
 *  avgang og inn igjen når vi er framme, over kartet man kom for å se. Bare når
 *  hoppet er stort nok til at skaleringen synes; en kort justering mellom to
 *  nabotopper skal ikke blinke. */
function veilVectors(map: LeafletMap, jump: number, seconds: number) {
  if (jump < 2) return;
  const pane = map.getPane("overlayPane");
  if (!pane) return;

  const show = () => {
    window.clearTimeout(veilTimers.get(pane));
    veilTimers.delete(pane);
    pane.style.opacity = "1";
  };

  window.clearTimeout(veilTimers.get(pane));
  pane.style.transition = "opacity 160ms ease-out";
  pane.style.opacity = "0";
  map.once("moveend", show);
  /* Ryggdekning. Blir turen avbrutt på en måte som ikke ender i `moveend`, skal
     laget fram igjen likevel — et kart uten topper er en verre feil enn en
     innblending på feil tidspunkt. */
  veilTimers.set(pane, window.setTimeout(show, seconds * 1000 + 400));
}

/** Flyr kartet til et utsnitt, og er framme med bildene.
 *
 *  Lengden følger hoppet, og er satt slik at flisene rekker fram: fra
 *  landsvisningen ned til en topp er det åtte zoomnivåer, og et skjermbilde lå
 *  nede etter ~0,75 s mot et rør på seks samtidige og 150 ms per flis. Den faste
 *  0,8-sekunderen som stod her landet altså akkurat foran sine egne bilder. En
 *  kort justering mellom to utsnitt på samme fjell skal fortsatt være kjapp. */
function flyToView(map: LeafletMap, center: LatLngExpression, zoom: number) {
  /* Respekter systemvalget, som resten av sida gjør i CSS-en: da er dette et
     bytte av utsnitt, ikke en flytur. */
  const still = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (still) {
    map.setView(center, zoom, { animate: false });
    return;
  }

  prefetchTiles(map, center, zoom);
  const jump = Math.abs(zoom - map.getZoom());
  const seconds = Math.min(1.1, 0.5 + jump * 0.08);
  veilVectors(map, jump, seconds);
  map.flyTo(center, zoom, { duration: seconds });
}

function flyToArea(map: LeafletMap, area: LatLngBounds) {
  const { center, zoom } = targetView(map, area);
  flyToView(map, center, zoom);
}

/** Sikter inn toppen med det samme i det korte vinduet etter montering der
 *  rutebunten fortsatt er på vei (se `useRouteTable`).
 *
 *  Uten den skjer det ingenting når man trykker i det vinduet — kartet blir
 *  stående, og hopper så av seg selv når linjene lander. Her flyr det på trykket,
 *  og innrammingen som kommer med linjene er en kort justering derfra. */
function PeakFocus({ tour }: { tour: Tour }) {
  const map = useMap();

  useEffect(() => {
    flyToView(map, [tour.lat, tour.lng], PEAK_ZOOM);
  }, [map, tour]);

  return null;
}

/** Terrenglinjene, hentet i sin egen bunt så snart kartet er montert.
 *
 *  De lå tidligere i den samme bunten som Leaflet, og det er en dyrere plass enn
 *  den ser ut som: `MapContainer` rendres ikke før hele bunten er lastet, og
 *  `TileLayer` ber ikke om en eneste flis før den er rendret. 47 rutelinjer —
 *  71 kB komprimert, 62 % av bunten — stod altså på rekke *foran* det første
 *  kartbildet, ikke ved siden av det.
 *
 *  Alternativet var å hente linjene per valgt topp. Det sparer de samme
 *  bytene, men flytter kostnaden til klikket: hver rute er ~1,4 kB
 *  komprimert, så det man betaler er ikke data, det er en rundtur — hver gang,
 *  hver økt, og på de forbindelsene folk faktisk har i fjellet. Å tegne ruta med
 *  det samme er det denne sida er til for.
 *
 *  Så: alt sammen, men ikke i veien. Importen starter når kartet monteres og
 *  lastes parallelt med flisene, og er nede lenge før noen rekker å velge en
 *  topp. Fram til da er kartet fullt brukbart — det mangler bare linja.
 *
 *  Modulen er ren data uten importer, så den blir en egen bunt av seg selv, og
 *  Turbopack gir den et innholdsbasert navn som kan bufres for godt. */
function useRouteTable(): RouteTable | null {
  const [routes, setRoutes] = useState<RouteTable | null>(null);

  useEffect(() => {
    let alive = true;
    import("@/lib/routes").then((m) => {
      if (alive) setRoutes(m.ROUTES);
    });
    return () => {
      alive = false;
    };
  }, []);

  return routes;
}

export interface MapCanvasProps {
  tours: readonly Tour[];
  /** Slugs surviving the sidebar filters — everything else dims. */
  visible: ReadonlySet<string>;
  selectedSlug: string | null;
  /** Which of the selected tour's routes is drawn; null means the tour's own. */
  selectedRouteId: string | null;
  onSelect: (slug: string) => void;
  onSelectRoute: (routeId: string) => void;
  /** Language for the tooltips and Leaflet's own controls. Peak names are
   *  proper nouns and are rendered as they come. */
  lang: Lang;
}

/** Every route up the selected tour.
 *
 *  The chosen route is drawn white-cased with an accent line on top; the peak's
 *  other routes sit underneath in a lighter tone so you can see at a glance that
 *  there is more than one way up, and clicking one selects it. Each route keeps
 *  its own trailhead dot, because alternatives usually start somewhere else
 *  entirely.
 *
 *  The lines are real terrain geometry (see `lib/routes`), a hundred points or
 *  more following the valley and ridge the route uses, so they are drawn solid
 *  and round-joined rather than as the dashed placeholder they replace. */
function RouteLayer({
  tour,
  routeTable,
  routeId,
  onSelectRoute,
  startLabel,
}: {
  tour: Tour;
  /** Linjene, når de har landet. Null i det korte vinduet etter montering der
   *  bunten fortsatt er på vei; da tegnes ingen rute, og resten av kartet
   *  virker som før. */
  routeTable: RouteTable;
  routeId: string | null;
  onSelectRoute: (routeId: string) => void;
  startLabel: string;
}) {
  const map = useMap();
  const routes = useMemo(() => routeTable[tour.slug] ?? [], [routeTable, tour]);
  /* Samme regel som `routeById` i `lib/tours`: en ukjent eller manglende id
     faller tilbake på turens egen rute, så en foreldet `?rute=` i en delt lenke
     fortsatt tegner noe. */
  const active = useMemo(
    () => (routeId ? routes.find((r) => r.id === routeId) : undefined) ?? routes[0] ?? null,
    [routes, routeId],
  );

  const lines = useMemo(
    () =>
      routes.map((route) => {
        const points: LatLngTuple[] = [];
        for (let i = 0; i < route.line.length; i += 3) {
          points.push([route.line[i], route.line[i + 1]]);
        }
        return { route, points };
      }),
    [routes],
  );

  const activePoints = useMemo<LatLngTuple[]>(
    () => lines.find((l) => l.route.id === active?.id)?.points ?? [],
    [lines, active],
  );

  /* Frame every route, not just the chosen one — otherwise picking an alternative
     that starts in the next valley flies the map somewhere unexpected. */
  const allPoints = useMemo<LatLngTuple[]>(() => lines.flatMap((l) => l.points), [lines]);

  useEffect(() => {
    if (!allPoints.length) return;
    flyToArea(map, latLngBounds(allPoints).pad(0.14));
  }, [map, allPoints]);

  if (!activePoints.length) return null;

  return (
    <>
      {lines
        .filter((l) => l.route.id !== active?.id)
        .map(({ route, points }) => (
          <Polyline
            key={route.id}
            positions={points}
            eventHandlers={{ click: () => onSelectRoute(route.id) }}
            pathOptions={{
              color: ROUTE_ALT,
              weight: 3,
              opacity: 0.75,
              dashArray: "2 7",
              lineCap: "round",
              /* A hairline is hard to hit; widen the invisible click target. */
              interactive: true,
            }}
          >
            <Tooltip direction="top" sticky>
              {route.name}
            </Tooltip>
          </Polyline>
        ))}

      <Polyline
        positions={activePoints}
        pathOptions={{
          color: MARKER_STROKE,
          weight: 7,
          opacity: 0.85,
          lineJoin: "round",
          lineCap: "round",
        }}
      />
      <Polyline
        positions={activePoints}
        pathOptions={{
          color: ROUTE_ACCENT,
          weight: 3.5,
          lineJoin: "round",
          lineCap: "round",
        }}
      />

      {lines.map(({ route, points }) => {
        const isActive = route.id === active?.id;
        /* Name the actual parking place — "Start / parkering" alone is a lot less
           useful than "Skorgedalen" when you are planning the drive. */
        const label = route.trailhead ? `${startLabel}: ${route.trailhead}` : startLabel;
        return (
          <CircleMarker
            key={`start-${route.id}`}
            center={points[0]}
            radius={isActive ? 6 : 4.5}
            eventHandlers={isActive ? undefined : { click: () => onSelectRoute(route.id) }}
            pathOptions={{
              color: isActive ? ROUTE_ACCENT : ROUTE_ALT,
              weight: 2,
              fillColor: MARKER_STROKE,
              fillOpacity: 1,
            }}
          >
            <Tooltip direction="top" offset={[0, -6]}>
              {routes.length > 1 ? `${route.name} — ${label}` : label}
            </Tooltip>
          </CircleMarker>
        );
      })}
    </>
  );
}

export default function MapCanvas({
  tours,
  visible,
  selectedSlug,
  selectedRouteId,
  onSelect,
  onSelectRoute,
  lang,
}: MapCanvasProps) {
  const t = mapDict(lang);
  const selected = tours.find((tour) => tour.slug === selectedSlug) ?? null;
  const routeTable = useRouteTable();

  return (
    <MapContainer bounds={NORWAY} zoomControl={false} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        url={TILE_URL}
        attribution="© OpenStreetMap contributors"
        /* Ikke bygg rutenettet på nytt for hvert nivå flyturen passerer.

           Leaflet gjør det som standard: hver gang zoomen krysser et helt nivå
           underveis, kastes rutenettet og et helt skjermbilde med fliser
           bestilles på nytt. Fra landsvisningen ned til en topp er det åtte
           nivåer, og ingen av dem rekker å bli synlige — de blir avbrutt av det
           neste. Sammen med resten av endringen her gikk ett trykk fra 253
           flisforespørsler til 119, og et sprang mellom to topper i hver sin
           ende av landet fra 369 til 75.

           Av: turen går over det forrige nivåets fliser, strukket, og målnivået
           — hentet av `flyToView` mens vi flyr — er nede før vi lander. Det
           gjelder klyping på berøringsskjerm også: da blir bildet skarpt når
           fingrene slipper, i stedet for å blafre gjennom nivåene. */
        updateWhenZooming={false}
        /* Litt margin utenfor kanten, så en flytur som lander med et lite
           etterslep ikke viser grått i ytterkant mens den setter seg. */
        keepBuffer={3}
      />
      {/* Leaflet's zoom buttons ship English titles; give them the page's. */}
      <ZoomControl position="bottomright" zoomInTitle={t.zoomIn} zoomOutTitle={t.zoomOut} />

      {tours.map((tour) => {
        const shown = visible.has(tour.slug);
        const isSelected = tour.slug === selectedSlug;
        return (
          <CircleMarker
            key={tour.slug}
            center={[tour.lat, tour.lng]}
            radius={isSelected ? 10 : 7}
            pathOptions={{
              color: MARKER_STROKE,
              weight: isSelected ? 2.5 : 1.5,
              fillColor: GRADE_COLORS[tour.grade - 1],
              opacity: shown ? 1 : 0.15,
              fillOpacity: shown ? 0.95 : 0.12,
            }}
            eventHandlers={{ click: () => onSelect(tour.slug) }}
          >
            <Tooltip direction="top" offset={[0, -8]}>
              {tour.name}
            </Tooltip>
          </CircleMarker>
        );
      })}

      {selected && routeTable ? (
        <RouteLayer
          key={selected.slug}
          tour={selected}
          routeTable={routeTable}
          routeId={selectedRouteId}
          onSelectRoute={onSelectRoute}
          startLabel={t.startTooltip}
        />
      ) : null}
      {selected && !routeTable ? <PeakFocus key={selected.slug} tour={selected} /> : null}
    </MapContainer>
  );
}
