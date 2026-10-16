"use client";

/** Leaflet-halvdelen av kartet i turguiden. Lastes gjennom `next/dynamic` uten
 *  SSR fra `GuideMap`, fordi Leaflet rører `window` i det øyeblikket modulen
 *  importeres.
 *
 *  De samme lagene som hovedkartet (`lib/map-tiles.ts`). Ruta tegnes som én
 *  hvit underlinje og én aksentlinje per etappe over den: etappen leseren peker
 *  på er tykk, de andre dempes. Linjene svarer selv på pekeren, så kartet kan
 *  brukes andre veien — pek på et stykke av ruta og kortet i teksten løftes.
 *
 *  Kartet står i en klebrig kolonne som kan endre høyde (vinduet, mobilens
 *  adresselinje), så størrelsen følges med en `ResizeObserver` og ikke bare ved
 *  montering. Musehjulet er av til man har klikket i kartet, og av igjen når
 *  pekeren forlater det — ellers stopper sida å rulle hver gang pekeren passerer
 *  over kartet på vei nedover teksten. */

import { useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, Polyline, TileLayer, Tooltip, ZoomControl, useMap } from "react-leaflet";
import { latLngBounds, type LatLngTuple, type Polyline as LeafletPolyline } from "leaflet";
import "leaflet/dist/leaflet.css";

import { BaseTileLayer } from "@/components/map/BaseTileLayer";
import { stageIcon, startIcon, summitIcon } from "@/components/map/markers";
import type { Lang } from "@/lib/i18n";
import { mapDict } from "@/lib/i18n/map";
import { MAX_ZOOM, TILE_ATTRIBUTION, TILE_URL } from "@/lib/map-tiles";

const ACCENT = "#8a2a5b";
/** Luft rundt ruta når kartet åpner, i piksler. */
const PAD = 48;
/** Tettere enn dette åpner kartet ikke, selv for en kort rute: på nivå 16 er
 *  terrenget rundt borte, og det er det kartet skal vise. */
const FIT_MAX_ZOOM = 15;

const START_ICON = startIcon(ACCENT);
const SUMMIT_ICON = summitIcon(ACCENT);

/** Slår på musehjulet ved klikk i kartet, av igjen når pekeren forlater det, og
 *  følger størrelsen på beholderen. */
function MapBehaviour() {
  const map = useMap();
  useEffect(() => {
    const on = () => map.scrollWheelZoom.enable();
    const off = () => map.scrollWheelZoom.disable();
    map.on("click", on);
    map.on("mouseout", off);

    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => map.invalidateSize());
    observer?.observe(map.getContainer());
    return () => {
      map.off("click", on);
      map.off("mouseout", off);
      observer?.disconnect();
    };
  }, [map]);
  return null;
}

/** Én etappe av linja. Den aktive legges øverst, så den ligger over naboene
 *  der to etapper møtes. */
function Segment({
  positions,
  tooltip,
  active,
  dimmed,
  interactive,
  onHover,
  onPin,
}: {
  positions: LatLngTuple[];
  tooltip: string;
  active: boolean;
  dimmed: boolean;
  interactive: boolean;
  onHover: (on: boolean) => void;
  onPin: () => void;
}) {
  const ref = useRef<LeafletPolyline>(null);
  useEffect(() => {
    if (active) ref.current?.bringToFront();
  }, [active]);

  return (
    <Polyline
      ref={ref}
      positions={positions}
      interactive={interactive}
      pathOptions={{
        color: ACCENT,
        weight: active ? 6 : 3,
        opacity: dimmed ? 0.3 : 1,
        lineCap: "round",
        lineJoin: "round",
      }}
      eventHandlers={
        interactive
          ? { mouseover: () => onHover(true), mouseout: () => onHover(false), click: onPin }
          : undefined
      }
    >
      {tooltip ? (
        <Tooltip sticky direction="top">
          {tooltip}
        </Tooltip>
      ) : null}
    </Polyline>
  );
}

export interface CanvasStage {
  from: number;
  to: number;
  tooltip: string;
}

export default function GuideMapCanvas({
  points,
  stages,
  active,
  onHover,
  onPin,
  lang,
}: {
  points: readonly [number, number][];
  stages: readonly CanvasStage[];
  active: number | null;
  onHover: (index: number | null) => void;
  onPin: (index: number) => void;
  lang: Lang;
}) {
  const t = mapDict(lang);
  const line = useMemo(() => points.map(([lat, lng]): LatLngTuple => [lat, lng]), [points]);
  const bounds = useMemo(() => latLngBounds(line), [line]);
  const segments = useMemo(
    () =>
      stages.length
        ? stages.map((s) => ({ ...s, positions: line.slice(s.from, s.to + 1) }))
        : [{ from: 0, to: line.length - 1, tooltip: "", positions: line }],
    [stages, line],
  );
  const icons = useMemo(() => stages.map((_, i) => stageIcon(i + 1, ACCENT)), [stages]);

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={{ padding: [PAD, PAD], maxZoom: FIT_MAX_ZOOM }}
      zoomControl={false}
      scrollWheelZoom={false}
      style={{ position: "absolute", inset: 0 }}
    >
      <BaseTileLayer />
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} maxZoom={MAX_ZOOM} zIndex={1} />
      <ZoomControl position="bottomright" zoomInTitle={t.zoomIn} zoomOutTitle={t.zoomOut} />
      <MapBehaviour />

      {/* Hvit underlinje, så ruta ikke forsvinner i høydekurvene og skrifta. */}
      <Polyline
        positions={line}
        interactive={false}
        pathOptions={{ color: "#fff", weight: 8, opacity: 0.9, lineCap: "round", lineJoin: "round" }}
      />
      {segments.map((seg, i) => (
        <Segment
          key={i}
          positions={seg.positions}
          tooltip={seg.tooltip}
          active={active === i}
          dimmed={active !== null && active !== i}
          interactive={stages.length > 0}
          onHover={(on) => onHover(on ? i : null)}
          onPin={() => onPin(i)}
        />
      ))}

      {stages.slice(1).map((s, i) => (
        <Marker key={`etappe-${i + 2}`} position={line[s.from]} icon={icons[i + 1]} interactive={false} keyboard={false} />
      ))}
      <Marker position={line[0]} icon={START_ICON} interactive={false} keyboard={false} />
      <Marker position={line[line.length - 1]} icon={SUMMIT_ICON} interactive={false} keyboard={false} />
    </MapContainer>
  );
}
