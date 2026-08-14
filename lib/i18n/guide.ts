/** NO/EN dictionary for the tour guide page (`/tur/[slug]`).
 *
 *  UI only: section headings, stat labels, the locked block, the buttons and the
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
  downloadGpxLocked: string;
  requiresSubscription: string;
  openInMap: string;
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
  /* — guide sections — */
  ascentTitle: string;
  descentTitle: string;
  avalancheTitle: string;
  varsomLinkTitle: string;
  /* — elevation profile — */
  elevationTitle: string;
  elevationAria: (start: string, end: string, distance: string) => string;
  /* — guide not written yet — */
  guidePendingTitle: string;
  guidePendingBody: string;
  /* — locked state — */
  lockedTitle: string;
  lockedBody: (trialDays: number, price: string) => string;
  lockedCta: string;
  /* — naboturer i samme region — */
  moreInRegion: (region: string) => string;
  allTours: string;
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
    downloadGpxLocked: "Last ned GPX — krever abonnement",
    requiresSubscription: "Krever abonnement",
    openInMap: "Åpne i kartet",
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
    ascentTitle: "Oppstigning",
    descentTitle: "Nedkjøring",
    avalancheTitle: "Skredterreng",
    varsomLinkTitle: "Skredvarselet på varsom.no (åpnes i ny fane)",
    elevationTitle: "Høydeprofil",
    elevationAria: (start, end, distance) =>
      `Høydeprofil fra ${start} til ${end} over ${distance}`,
    guidePendingTitle: "Turguide",
    guidePendingBody: "Turguiden for denne toppen er under arbeid.",
    lockedTitle: "Resten av guiden er låst",
    lockedBody: (trialDays, price) =>
      `Rutebeskrivelse, nedkjøring og skredterreng åpnes med abonnement — ${trialDays} dager gratis, deretter ${price}/mnd.`,
    lockedCta: "Start gratis prøveperiode",
    moreInRegion: (region) => `Flere turer i ${region}`,
    allTours: "Se alle turene",
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
    downloadGpxLocked: "Download GPX — requires a subscription",
    requiresSubscription: "Requires a subscription",
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
    ascentTitle: "Ascent",
    descentTitle: "Descent",
    avalancheTitle: "Avalanche terrain",
    varsomLinkTitle: "The avalanche forecast at varsom.no (opens in a new tab)",
    elevationTitle: "Elevation profile",
    elevationAria: (start, end, distance) =>
      `Elevation profile from ${start} to ${end} over ${distance}`,
    guidePendingTitle: "Tour guide",
    guidePendingBody: "The guide for this peak is still being written.",
    lockedTitle: "The rest of this guide is locked",
    lockedBody: (trialDays, price) =>
      `Route description, descent and avalanche terrain open with a subscription — ${trialDays} days free, then ${price}/month.`,
    lockedCta: "Start free trial",
    moreInRegion: (region) => `More tours in ${region}`,
    allTours: "See all the tours",
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
