"use client";

/** Leaflet-halvdelen av kartet i turguiden. Lastes gjennom `next/dynamic` uten
 *  SSR fra `GuideMap`, fordi Leaflet rører `window` i det øyeblikket modulen
 *  importeres.
 *
 *  De samme lagene som hovedkartet (`lib/map-tiles.ts`), med ruta, starten og
 *  toppen over. Kartet åpner rammet inn rundt ruta, og leseren kan dra og zoome
 *  derfra.
 *
 *  Musehjulet er av til man har klikket i kartet. Ellers stopper sida å rulle
 *  hver gang pekeren passerer over figuren på vei ned til rutebeskrivelsen, og
 *  kartet zoomer i stedet. */

import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Polyline, TileLayer, ZoomControl, useMap } from "react-leaflet";
import { latLngBounds, type LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";

import { BaseTileLayer } from "@/components/map/BaseTileLayer";
import { startIcon, summitIcon } from "@/components/map/markers";
import type { Lang } from "@/lib/i18n";
import { mapDict } from "@/lib/i18n/map";
import { MAX_ZOOM, TILE_ATTRIBUTION, TILE_URL } from "@/lib/map-tiles";

const ROUTE = "#416180"; // accent-700, som på hovedkartet
const PAPER = "#f2f2f3";
/** Luft rundt ruta når kartet åpner, i piksler. */
const PAD = 34;
/** Tettere enn dette åpner kartet ikke, selv for en kort rute: på nivå 17 er
 *  terrenget rundt borte, og det er det figuren skal vise. */
const FIT_MAX_ZOOM = 16;

const START_ICON = startIcon(ROUTE);
const SUMMIT_ICON = summitIcon(ROUTE);

/** Slår på musehjulet ved klikk i kartet, og av igjen når pekeren forlater det. */
function WheelAfterClick() {
  const map = useMap();
  useEffect(() => {
    const on = () => map.scrollWheelZoom.enable();
    const off = () => map.scrollWheelZoom.disable();
    map.on("click", on);
    map.on("mouseout", off);
    return () => {
      map.off("click", on);
      map.off("mouseout", off);
    };
  }, [map]);
  return null;
}

export default function GuideMapCanvas({
  points,
  lang,
}: {
  points: readonly [number, number][];
  lang: Lang;
}) {
  const t = mapDict(lang);
  const line = useMemo(() => points.map(([lat, lng]): LatLngTuple => [lat, lng]), [points]);
  const bounds = useMemo(() => latLngBounds(line), [line]);

  return (
    <MapContainer
      bounds={bounds}
      boundsOptions={{ padding: [PAD, PAD], maxZoom: FIT_MAX_ZOOM }}
      zoomControl={false}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <BaseTileLayer />
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} maxZoom={MAX_ZOOM} zIndex={1} />
      <ZoomControl position="bottomright" zoomInTitle={t.zoomIn} zoomOutTitle={t.zoomOut} />
      <WheelAfterClick />

      {/* To ganger: en bred strek i papirfargen under, så linja over, så ruta
          ikke forsvinner i høydekurvene og skrifta under. */}
      <Polyline
        positions={line}
        interactive={false}
        pathOptions={{ color: PAPER, weight: 6, lineCap: "round", lineJoin: "round" }}
      />
      <Polyline
        positions={line}
        interactive={false}
        pathOptions={{ color: ROUTE, weight: 2.5, lineCap: "round", lineJoin: "round" }}
      />
      <Marker position={line[0]} icon={START_ICON} interactive={false} keyboard={false} />
      <Marker position={line[line.length - 1]} icon={SUMMIT_ICON} interactive={false} keyboard={false} />
    </MapContainer>
  );
}
