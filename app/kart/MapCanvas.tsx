"use client";

/** The Leaflet half of the map page. Loaded through `next/dynamic` with
 *  `ssr: false` from MapView — Leaflet touches `window` at import time. */

import { useEffect, useMemo } from "react";
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
import { routeFor } from "@/lib/tours";
import type { Tour } from "@/lib/types";

/** Initial view — mainland Norway, as in the prototype. */
const NORWAY: LatLngBoundsExpression = [
  [58.0, 4.5],
  [70.6, 26.0],
];

const MARKER_STROKE = "#f2f2f3";
const ROUTE_ACCENT = "#416180"; // accent-700

export interface MapCanvasProps {
  tours: readonly Tour[];
  /** Slugs surviving the sidebar filters — everything else dims. */
  visible: ReadonlySet<string>;
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
  /** Language for the tooltips and Leaflet's own controls. Peak names are
   *  proper nouns and are rendered as they come. */
  lang: Lang;
}

/** Schematic route line for the selected tour: white underlay, dashed accent
 *  overlay, trailhead dot — then fly the map to it. */
function RouteLayer({ tour, startLabel }: { tour: Tour; startLabel: string }) {
  const map = useMap();
  const points = useMemo<LatLngTuple[]>(() => routeFor(tour), [tour]);

  useEffect(() => {
    map.flyToBounds(latLngBounds(points).pad(0.35), { duration: 0.8 });
  }, [map, points]);

  return (
    <>
      <Polyline positions={points} pathOptions={{ color: MARKER_STROKE, weight: 6, opacity: 0.8 }} />
      <Polyline
        positions={points}
        pathOptions={{ color: ROUTE_ACCENT, weight: 3, dashArray: "7 6" }}
      />
      <CircleMarker
        center={points[0]}
        radius={6}
        pathOptions={{
          color: ROUTE_ACCENT,
          weight: 2,
          fillColor: MARKER_STROKE,
          fillOpacity: 1,
        }}
      >
        <Tooltip direction="top" offset={[0, -6]}>
          {startLabel}
        </Tooltip>
      </CircleMarker>
    </>
  );
}

export default function MapCanvas({
  tours,
  visible,
  selectedSlug,
  onSelect,
  lang,
}: MapCanvasProps) {
  const t = mapDict(lang);
  const selected = tours.find((tour) => tour.slug === selectedSlug) ?? null;

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

      {selected ? (
        <RouteLayer key={selected.slug} tour={selected} startLabel={t.startTooltip} />
      ) : null}
    </MapContainer>
  );
}
