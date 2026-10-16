/** NO/EN dictionary for the tour guide page (`/tur/[slug]`).
 *
 *  UI only: section headings, stat labels, the buttons and the
 *  accessible labels. The editorial prose — intro, ascent, descent, avalanche
 *  notes, elevation-profile labels — comes from `./content`, and the structured
 *  tour tokens (aspect, season, duration, grade) from `./format`.
 *
 *  The three keys that carry data are functions rather than strings, so the
 *  sentence order stays translatable instead of being glued together in JSX.
 */

import type { Lang, Translated } from "./index";
import { pick } from "./index";

export interface GuideDict {
  /* — header — */
  backToMap: string;
  seasonPrefix: string;
  downloadGpx: string;
  openInMap: string;
  /* — «Lagre offline» (`components/guide/OfflineSave.tsx`) — */
  saveOffline: string;
  savingOffline: (percent: number) => string;
  savedOffline: (size: string) => string;
  removeOffline: string;
  offlineHint: string;
  offlineSavedHint: string;
  offlineErrorNetwork: string;
  offlineErrorQuota: string;
  offlineErrorLocked: string;
  /* — key figures — */
  statSummit: string;
  statVertical: string;
  statTime: string;
  statGrade: string;
  statAspect: string;
  /* — kartfiguren (`components/guide/RouteMap.tsx`) — */
  routeMapAria: (peak: string, distance: string, gain: number) => string;
  routeMapCaption: (trailhead: string, distance: string, gain: number) => string;
  routeMapCaptionLink: string;
  /** Kartverkets lisens (CC BY 4.0) krever synlig kreditering på flisene
   *  figuren tegner over. Står i figurteksten uansett om resten gjør det. */
  routeMapCredit: string;
  /* — innholdslista som står klistret øverst mens man leser — */
  tocLabel: string;
  conditionsTitle: string;
  conditionsNote: string;
  routeTitle: string;
  routeStart: string;
  routeLength: string;
  routeGain: string;
  otherRoutesTitle: string;
  otherRouteLink: string;
  /* — guide sections — */
  ascentTitle: string;
  descentTitle: string;
  avalancheTitle: string;
  varsomLinkTitle: string;
  /* — elevation profile — */
  elevationTitle: string;
  elevationAria: (start: string, end: string, distance: string) => string;
  /* — v3: «Før du går», etappene, kartet ved siden — */
  beforeTitle: string;
  checklistLabel: string;
  /** Sjekklista under skredfaren og været. Hintet står dempet til høyre. */
  checklist: readonly { text: string; hint: string }[];
  accessTitle: string;
  directions: string;
  /** «Opp, i fire etapper». Tallet skrives med bokstaver der det er naturlig. */
  stagesTitle: (count: number) => string;
  stagesHint: string;
  /** Pillen over kartet og tooltipen på linja. */
  wholeRoute: (distance: string) => string;
  stageLabel: (num: number, range: string) => string;
  /** Det mørke kortet etter etappene. */
  lineNoteLead: string;
  lineNote: string;
  downTitle: string;
  photoTitle: string;
  openInMainMap: string;
  steepest: (range: string) => string;
  footerCredit: string;
  /* — guide not written yet — */
  guidePendingTitle: string;
  guidePendingBody: string;
  /* — naboturer i samme region — */
  moreInRegion: (region: string) => string;
  /* — GPX file (served by `app/api/gpx/[slug]`, read in the user's GPS app) — */
  gpxNotFound: string;
  gpxDesc: (peak: string, region: string) => string;
  gpxSummitType: string;
  gpxStartType: string;
}

const GUIDE: Translated<GuideDict> = {
  no: {
    backToMap: "← Tilbake til kartet",
    seasonPrefix: "Sesong",
    downloadGpx: "Last ned GPX",
    openInMap: "Åpne i kartet",
    saveOffline: "Lagre offline",
    savingOffline: (p) => `Lagrer … ${p} %`,
    savedOffline: (size) => `Lagret offline · ${size}`,
    removeOffline: "Fjern",
    offlineHint:
      "Lagrer guiden, kartet langs ruta og GPX-fila på denne enheten, så de virker uten dekning.",
    offlineSavedHint:
      "Åpne toppkart.no som vanlig i fjellet — uten dekning får du den lagrede guiden og kartet, med posisjonen din.",
    offlineErrorNetwork: "Lagringen stoppet før den var ferdig. Sjekk nettet og prøv igjen.",
    offlineErrorQuota: "Det er ikke plass på enheten. Fjern andre lagrede turer og prøv igjen.",
    offlineErrorLocked: "Guiden kom ikke tilbake som den skulle. Prøv igjen.",
    statSummit: "Topp",
    statVertical: "Høydemeter",
    statTime: "Normaltid",
    statGrade: "Grad",
    statAspect: "Himmelretning",
    routeMapAria: (peak, distance, gain) =>
      `Ruta opp ${peak} sett ovenfra: ${distance} og ${gain} høydemeter fra start til topp`,
    routeMapCaption: (trailhead, distance, gain) =>
      `Ruta opp fra ${trailhead} — ${distance}, ${gain} høydemeter. Linja er beregnet i Kartverkets terrengmodell, ikke et innspilt spor.`,
    routeMapCaptionLink: "Se turen i kartet",
    routeMapCredit: "Kartgrunnlag © Kartverket.",
    tocLabel: "Innhold i guiden",
    conditionsTitle: "Forhold i dag",
    conditionsNote:
      "Sjekk skredvarselet og været rett før du går — begge kan endre seg i løpet av dagen.",
    routeTitle: "Ruta",
    routeStart: "Start",
    routeLength: "Lengde",
    routeGain: "Stigning",
    otherRoutesTitle: "Andre ruter opp",
    otherRouteLink: "Se i kartet",
    ascentTitle: "Oppstigning",
    descentTitle: "Nedkjøring",
    avalancheTitle: "Skredterreng",
    varsomLinkTitle: "Skredvarselet på varsom.no (åpnes i ny fane)",
    elevationTitle: "Høydeprofil",
    elevationAria: (start, end, distance) =>
      `Høydeprofil fra ${start} til ${end} over ${distance}`,
    beforeTitle: "Før du går",
    checklistLabel: "Sjekkliste før turen",
    checklist: [
      { text: "Les dagens skredvarsel", hint: "varsom.no" },
      { text: "Sjekk været på toppen", hint: "vind og sikt" },
      { text: "Sender/mottaker, søkestang og spade", hint: "sjekk batteriet" },
      { text: "GPX på klokka eller telefonen", hint: "last ned over" },
      { text: "Guiden lagret offline", hint: "ofte ingen dekning" },
      { text: "Si fra hvor du går og når du er tilbake", hint: "" },
    ],
    accessTitle: "Kom deg dit",
    directions: "Veibeskrivelse ↗",
    stagesTitle: (count) =>
      `Opp, i ${["", "én", "to", "tre", "fire", "fem", "seks", "sju", "åtte"][count] ?? count} ${count === 1 ? "etappe" : "etapper"}`,
    stagesHint: "Pek for å se den i kartet",
    wholeRoute: (distance) => `Hele ruta · ${distance}`,
    stageLabel: (num, range) => `Etappe ${num} · ${range}`,
    lineNoteLead: "Linja er beregnet,",
    lineNote: "ikke gått med GPS. Den viser hvor ruta går — les terrenget, ikke streken.",
    downTitle: "Ned",
    photoTitle: "Fjellet",
    openInMainMap: "Åpne i hovedkartet ↗",
    steepest: (range) => `brattest ${range}`,
    footerCredit: "Kartgrunnlag © Kartverket · Linja er beregnet i terrengmodellen, ikke et innspilt spor.",
    guidePendingTitle: "Turguide",
    guidePendingBody: "Turguiden for denne toppen er under arbeid.",
    moreInRegion: (region) => `Flere turer i ${region}`,
    gpxNotFound: "Fant ikke turen.",
    gpxDesc: (peak, region) =>
      `${peak} (${region}) — oppstigning fra Toppkart, beregnet i Kartverkets terrengmodell. Generert geometri, ikke et innspilt spor: sjekk kart og skredvarsel før du går.`,
    gpxSummitType: "Topp",
    gpxStartType: "Start / parkering",
  },
  en: {
    backToMap: "← Back to the map",
    seasonPrefix: "Season",
    downloadGpx: "Download GPX",
    saveOffline: "Save offline",
    savingOffline: (p) => `Saving … ${p}%`,
    savedOffline: (size) => `Saved offline · ${size}`,
    removeOffline: "Remove",
    offlineHint:
      "Saves the guide, the map along the route and the GPX file on this device, so they work without coverage.",
    offlineSavedHint:
      "Open toppkart.no as usual in the mountains — without coverage you get the saved guide and map, with your position.",
    offlineErrorNetwork: "Saving stopped before it finished. Check your connection and try again.",
    offlineErrorQuota: "There is no room left on this device. Remove other saved tours and try again.",
    offlineErrorLocked: "The guide did not come back as expected. Try again.",
    openInMap: "Open on the map",
    statSummit: "Summit",
    statVertical: "Vertical gain",
    statTime: "Typical time",
    statGrade: "Grade",
    statAspect: "Aspect",
    routeMapAria: (peak, distance, gain) =>
      `The route up ${peak} seen from above: ${distance} and ${gain} metres of ascent from start to summit`,
    routeMapCaption: (trailhead, distance, gain) =>
      `The ascent from ${trailhead} — ${distance}, ${gain} metres of ascent. The line is solved over Kartverket's terrain model, not a recorded track.`,
    routeMapCaptionLink: "See the tour on the map",
    routeMapCredit: "Map data © Kartverket.",
    tocLabel: "In this guide",
    conditionsTitle: "Conditions today",
    conditionsNote:
      "Check the avalanche forecast and the weather right before you go — both can change during the day.",
    routeTitle: "The route",
    routeStart: "Start",
    routeLength: "Distance",
    routeGain: "Ascent",
    otherRoutesTitle: "Other ways up",
    otherRouteLink: "See on the map",
    ascentTitle: "Ascent",
    descentTitle: "Descent",
    avalancheTitle: "Avalanche terrain",
    varsomLinkTitle: "The avalanche forecast at varsom.no (opens in a new tab)",
    elevationTitle: "Elevation profile",
    elevationAria: (start, end, distance) =>
      `Elevation profile from ${start} to ${end} over ${distance}`,
    beforeTitle: "Before you go",
    checklistLabel: "Checklist before the tour",
    checklist: [
      { text: "Read today's avalanche forecast", hint: "varsom.no" },
      { text: "Check the weather on the summit", hint: "wind and visibility" },
      { text: "Transceiver, probe and shovel", hint: "check the battery" },
      { text: "GPX on your watch or phone", hint: "download above" },
      { text: "Guide saved offline", hint: "often no coverage" },
      { text: "Tell someone where you're going and when you'll be back", hint: "" },
    ],
    accessTitle: "Getting there",
    directions: "Directions ↗",
    stagesTitle: (count) =>
      `Up, in ${["", "one", "two", "three", "four", "five", "six", "seven", "eight"][count] ?? count} ${count === 1 ? "stage" : "stages"}`,
    stagesHint: "Point at one to see it on the map",
    wholeRoute: (distance) => `Whole route · ${distance}`,
    stageLabel: (num, range) => `Stage ${num} · ${range}`,
    lineNoteLead: "The line is computed,",
    lineNote: "not walked with a GPS. It shows where the route goes — read the terrain, not the line.",
    downTitle: "Down",
    photoTitle: "The mountain",
    openInMainMap: "Open in the main map ↗",
    steepest: (range) => `steepest ${range}`,
    footerCredit: "Map data © Kartverket · The line is computed in the terrain model, not a recorded track.",
    guidePendingTitle: "Tour guide",
    guidePendingBody: "The guide for this peak is still being written.",
    moreInRegion: (region) => `More tours in ${region}`,
    gpxNotFound: "Tour not found.",
    gpxDesc: (peak, region) =>
      `${peak} (${region}) — ascent from Toppkart, solved over Kartverket's terrain model. Generated geometry, not a recorded track: check the map and the avalanche forecast before you go.`,
    gpxSummitType: "Summit",
    gpxStartType: "Trailhead / parking",
  },
};

export function guideDict(lang: Lang): GuideDict {
  return pick(GUIDE, lang);
}
