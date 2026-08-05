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
import { latLngBounds, type LatLngBoundsExpression, type LatLngTuple } from "leaflet";
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

type RouteTable = Record<string, readonly TourRoute[]>;

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
    map.flyToBounds(latLngBounds(allPoints).pad(0.14), { duration: 0.8 });
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
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
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
    </MapContainer>
  );
}
