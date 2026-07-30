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
  /* — map figure — */
  mapImageAlt: (peak: string) => string;
  figureCaption: string;
  figureCaptionLink: string;
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
  /* — page furniture — */
  footerNote: string;
  notFoundTitle: string;
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
    mapImageAlt: (peak) => `Skjematisk kartutsnitt av ruta opp ${peak}`,
    figureCaption: "Skjematisk kartutsnitt i prototypen — ",
    figureCaptionLink: "se turen i kartet",
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
    footerNote: "Eksempelinnhold i prototypen — ikke en reell turbeskrivelse.",
    notFoundTitle: "Turen finnes ikke",
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
    mapImageAlt: (peak) => `Schematic map detail of the route up ${peak}`,
    figureCaption: "Schematic map detail in this prototype — ",
    figureCaptionLink: "see the tour on the map",
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
    footerNote: "Sample content in this prototype — not a real tour description.",
    notFoundTitle: "Tour not found",
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
