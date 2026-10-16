/** Start- og toppmarkørene, felles for hovedkartet og kartet i turguidene.
 *
 *  Tidligere var starten en liten ring og toppen enten gradprikken eller en
 *  trekant på 14 px — lett å miste i et kart fullt av høydekurver. Nå er de
 *  to tegn man kjenner fra papirkart: «P» i en ring der man parkerer og går,
 *  og en trekant på toppen. Hvit kant og en svak skygge holder dem lesbare over
 *  både bre, skog og by.
 *
 *  `divIcon` og ikke SVG-vektorer: markørene ligger i Leaflets markørlag, som
 *  flyttes og ikke skaleres under en flytur. Vektorlaget strekkes, og en sirkel
 *  på 7 px blir en flate over hele skjermen på vei ned åtte nivåer.
 *
 *  Importeres bare fra modulene som lastes uten SSR — Leaflet rører `window`. */

import { divIcon, type DivIcon } from "leaflet";

const SHADOW = "filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))";
/** Skriften `next/font` har lastet. Familienavnet den får er generert, så
 *  markørene leser variabelen og ikke navnet. */
const FONT = "var(--font-body)";
const PAPER = "#f4f1ea";

/** Start / parkering. `small` for de andre rutenes startpunkter. */
export function startIcon(color: string, small = false): DivIcon {
  const size = small ? 18 : 26;
  const r = size / 2 - 2;
  const c = size / 2;
  return divIcon({
    className: "",
    html: `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="${SHADOW}" aria-hidden="true"><circle cx="${c}" cy="${c}" r="${r}" fill="#fff" stroke="${color}" stroke-width="2.5"/><text x="${c}" y="${c + size * 0.18}" text-anchor="middle" style="font-family:${FONT}" font-weight="700" font-size="${Math.round(size * 0.5)}" fill="${color}">P</text></svg>`,
    iconSize: [size, size],
    iconAnchor: [c, c],
    tooltipAnchor: [0, -c],
  });
}

/** Toppen. */
export function summitIcon(color: string): DivIcon {
  return divIcon({
    className: "",
    html: `<svg width="28" height="25" viewBox="0 0 26 23" style="${SHADOW}" aria-hidden="true"><path d="M13,2 L24,21 L2,21 Z" fill="${color}" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>`,
    iconSize: [28, 25],
    /* Tyngdepunktet i trekanten, ikke midten av boksen: der står toppen. */
    iconAnchor: [14, 16],
    tooltipAnchor: [0, -15],
  });
}

/** Skillet mellom to etapper i turguiden: nummeret på etappen som begynner her,
 *  i en papirsirkel med aksentkant. */
export function stageIcon(num: number, color: string): DivIcon {
  return divIcon({
    className: "",
    html: `<div style="width:20px;height:20px;border-radius:50%;background:${PAPER};border:2px solid ${color};color:${color};font:700 11px/1 ${FONT};display:grid;place-items:center;box-shadow:0 1px 3px rgba(0,0,0,0.25)" aria-hidden="true">${num}</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}
