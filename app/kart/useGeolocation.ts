"use client";

/** Leserens posisjon, når hen ber om den.
 *
 *  Ingenting skjer før knappen er trykt: nettleseren spør om lov først da, og
 *  ikke ved sidelast. Posisjonen lever bare i denne tilstanden — den sendes
 *  ikke til serveren, lagres ikke og logges ikke. Det er det `/personvern` lover.
 *
 *  `watchPosition` og ikke `getCurrentPosition`, fordi dette brukes i fjellet:
 *  prikken skal flytte seg mens man går, ikke stå der den sto da man trykket. */

import { useCallback, useEffect, useRef, useState } from "react";

export interface Position {
  lat: number;
  lng: number;
  /** Radius i meter som posisjonen med 68 % sannsynlighet ligger innenfor. */
  accuracy: number;
}

export type GeoError = "denied" | "unavailable" | "unsupported";

export type GeoState =
  | { status: "off" }
  | { status: "locating" }
  | { status: "on"; position: Position }
  | { status: "error"; error: GeoError };

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({ status: "off" });
  const watchId = useRef<number | null>(null);
  /** Om denne overvåkingen har levert minst én posisjon. */
  const hasFix = useRef(false);

  const stop = useCallback(() => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setState({ status: "error", error: "unsupported" });
      return;
    }
    stop();
    hasFix.current = false;
    setState({ status: "locating" });
    watchId.current = navigator.geolocation.watchPosition(
      (p) => {
        hasFix.current = true;
        setState({
          status: "on",
          position: { lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy },
        });
      },
      (err) => {
        /* Et nei er endelig; å fortsette å lytte ville bare gi samme nei igjen. */
        if (err.code === err.PERMISSION_DENIED) {
          stop();
          setState({ status: "error", error: "denied" });
          return;
        }
        /* Et tidsavbrudd midt i en tur — i et skar, under et heng — skal ikke
           viske ut prikken. Den siste kjente posisjonen er fortsatt det beste vi
           har, og overvåkingen fortsetter. Bare uten noen posisjon i det hele
           tatt er dette en feil å vise. */
        if (hasFix.current) return;
        stop();
        setState({ status: "error", error: "unavailable" });
      },
      { enableHighAccuracy: true, maximumAge: 10_000, timeout: 20_000 },
    );
  }, [stop]);

  const toggle = useCallback(() => {
    if (state.status === "on" || state.status === "locating") {
      stop();
      setState({ status: "off" });
    } else {
      start();
    }
  }, [state.status, start, stop]);

  useEffect(() => stop, [stop]);

  return { state, toggle };
}
