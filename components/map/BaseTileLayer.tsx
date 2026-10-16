"use client";

/** OpenStreetMap under Kartverket, uten flisene Kartverket dekker uansett.
 *
 *  Et vanlig `TileLayer` med én endring: der `coveredByKartverket` sier at
 *  flisa ligger helt inne i Norge, får Leaflet et tomt bilde i stedet for en
 *  adresse. Ingen forespørsel, og ikke noe annet kart som blinker fram under
 *  Kartverket mens det lastes. Brukes av hovedkartet og av kartet i turguidene.
 *
 *  Importeres bare fra modulene som lastes uten SSR — Leaflet rører `window`. */

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { TileLayer, type Coords, type TileLayerOptions } from "leaflet";

import {
  BASE_ATTRIBUTION,
  BASE_MAX_NATIVE_ZOOM,
  BASE_URL,
  MAX_ZOOM,
  coveredByKartverket,
} from "@/lib/map-tiles";

/** En gjennomsiktig 1×1 GIF. */
const BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

const OutsideNorwayLayer = TileLayer.extend({
  getTileUrl(this: TileLayer, coords: Coords) {
    if (coveredByKartverket(coords.z, coords.x, coords.y)) return BLANK;
    return TileLayer.prototype.getTileUrl.call(this, coords);
  },
}) as unknown as new (url: string, options?: TileLayerOptions) => TileLayer;

export function BaseTileLayer({ options }: { options?: TileLayerOptions }) {
  const map = useMap();

  useEffect(() => {
    const layer = new OutsideNorwayLayer(BASE_URL, {
      attribution: BASE_ATTRIBUTION,
      maxZoom: MAX_ZOOM,
      maxNativeZoom: BASE_MAX_NATIVE_ZOOM,
      zIndex: 0,
      ...options,
    }).addTo(map);
    return () => {
      layer.remove();
    };
    // `options` er en konstant hos begge som bruker laget.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return null;
}
