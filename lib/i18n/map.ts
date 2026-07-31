/** NO/EN dictionary for the map page.
 *
 *  The UI strings were lifted verbatim from `design-reference/kart.html` →
 *  `I18N`. A handful of keys at the end cover strings the prototype expressed
 *  inline (the schematic-route note, the trailhead tooltip) plus the labels the
 *  React version needs for accessibility and the unlocked state.
 *
 *  Tour *content* — teasers, seasons, aspects, durations — is translated
 *  separately, in `./content` and `./format`; the page runs each row through
 *  `localizeTours()` before rendering it. Only chrome lives here.
 */

import { gradeLabel } from "./format";
import type { Lang, Translated } from "./index";
import { pick } from "./index";

/** Grade names indexed 1…4 — index 0 is unused, matching the prototype. */
export type GradeNames = readonly [string, string, string, string, string];

/** The grade names come from `./format`, which every other page also reads, so
 *  the map can never drift out of step with the guide pages. */
function gradeNames(lang: Lang): GradeNames {
  return ["", gradeLabel(1, lang), gradeLabel(2, lang), gradeLabel(3, lang), gradeLabel(4, lang)];
}

export interface Dict {
  /* — document head — */
  metaTitle: string;
  metaDescription: string;
  /* — topbar — */
  login: string;
  /** Replaces login + trial in the topbar once there is a session. */
  account: string;
  trial: string;
  /* — filters — */
  all: string;
  search: string;
  allRegions: string;
  tours: string;
  tour: string;
  approx: string;
  /* — detail — */
  back: string;
  grades: GradeNames;
  moh: string;
  stHm: string;
  stTime: string;
  stGrade: string;
  stAsp: string;
  stSea: string;
  openGuide: string;
  /* — locked block — */
  lockTitle: string;
  lockBody: string;
  lockCta: string;
  chips: readonly string[];
  /* — paywall copy (kept from the prototype; the dialog is now `/betaling`) — */
  pwKick: string;
  pwTitle: string;
  pwBody: string;
  pwSend: string;
  pwNote: string;
  close: string;
  pwKick2: string;
  pwDoneTitle: string;
  pwDoneBody: string;
  close2: string;
  /* — strings the prototype held inline — */
  schematicNote: string;
  startTooltip: string;
  /** Heading above the route picker, shown when a peak has more than one way up. */
  routesLabel: string;
  /** Screen-reader name for the picker itself. */
  routesGroup: string;
  /* — React additions: labels + the unlocked (subscriber) state — */
  gradeGroup: string;
  searchLabel: string;
  regionLabel: string;
  /** Titles on Leaflet's own zoom buttons, which default to English. */
  zoomIn: string;
  zoomOut: string;
  mapLoading: string;
  /* — mobile: the list/map toggle, one pane at a time on a narrow screen — */
  showMap: string;
  showList: string;
  /** Bottom bar on the map once a peak is picked: opens the detail panel. */
  showInfo: string;
  /** Clears the picked peak and returns to the plain map. */
  clearPeak: string;
  unlockedTitle: string;
  unlockedBody: string;
  guidePending: string;
}

const MAP: Translated<Dict> = {
  no: {
    metaTitle: "Kartet",
    metaDescription:
      "Alle toppturene på ett kart: grad, høydemeter, normaltid, himmelretning og sesong for hver topp.",
    login: "Logg inn",
    account: "Min side",
    trial: "Prøv gratis",
    all: "Alle",
    search: "Søk etter topp eller region…",
    allRegions: "Alle regioner",
    tours: "turer",
    tour: "tur",
    approx: "Toppunkter er hentet fra Kartverkets terrengmodell.",
    back: "← Til lista",
    grades: gradeNames("no"),
    moh: "moh",
    stHm: "Høydemeter",
    stTime: "Normaltid",
    stGrade: "Grad",
    stAsp: "Himmelretning",
    stSea: "Sesong",
    openGuide: "Åpne turguiden",
    lockTitle: "Resten av guiden er låst",
    lockBody: "Rutebeskrivelse, høydeprofil, GPX og skredterreng åpnes med abonnement.",
    lockCta: "Start gratis prøveperiode",
    chips: ["Rutebeskrivelse", "Høydeprofil", "GPX", "Skredterreng", "Varsom-varsel"],
    pwKick: "Abonnement",
    pwTitle: "14 dager gratis — deretter 29 kr/mnd",
    pwBody:
      "Full tilgang til alle turguider, GPX-filer, høydeprofiler og skredterreng. Ingen binding — avslutt når du vil.",
    pwSend: "Send lenke",
    pwNote:
      "Ingen passord — du logger inn med Google. Sikker betaling via Stripe. Kort legges inn ved start — første trekk etter prøveperioden.",
    close: "Lukk",
    pwKick2: "Sjekk innboksen",
    pwDoneTitle: "Lenken er sendt",
    pwDoneBody: "Åpne e-posten og trykk på lenken for å logge inn og starte prøveperioden.",
    close2: "Lukk",
    schematicNote:
      "Rutelinjene er beregnet i Kartverkets terrengmodell. Generert geometri — ikke innspilte spor.",
    startTooltip: "Start / parkering",
    routesLabel: "Ruter opp",
    routesGroup: "Velg rute",
    gradeGroup: "Vanskelighetsgrad",
    searchLabel: "Søk etter topp eller region",
    regionLabel: "Region",
    zoomIn: "Zoom inn",
    zoomOut: "Zoom ut",
    mapLoading: "Laster kartet…",
    showMap: "Vis kart",
    showList: "Vis liste",
    showInfo: "Vis info",
    clearPeak: "Lukk valgt topp",
    unlockedTitle: "Du har full tilgang",
    unlockedBody: "Rutebeskrivelse, høydeprofil, GPX og skredterreng er åpne for deg.",
    guidePending: "Full turguide for denne toppen er under arbeid.",
  },
  en: {
    metaTitle: "The map",
    metaDescription:
      "Every ski tour on one map: grade, vertical gain, typical time, aspect and season for each peak.",
    login: "Log in",
    account: "My account",
    trial: "Try for free",
    all: "All",
    search: "Search peak or region…",
    allRegions: "All regions",
    tours: "tours",
    tour: "tour",
    approx: "Summit positions come from Kartverket's terrain model.",
    back: "← Back to list",
    grades: gradeNames("en"),
    moh: "m",
    stHm: "Vertical gain",
    stTime: "Typical time",
    stGrade: "Grade",
    stAsp: "Aspect",
    stSea: "Season",
    openGuide: "Open the guide",
    lockTitle: "The rest of this guide is locked",
    lockBody:
      "Route description, elevation profile, GPX and avalanche terrain open with a subscription.",
    lockCta: "Start free trial",
    chips: [
      "Route description",
      "Elevation profile",
      "GPX",
      "Avalanche terrain",
      "Varsom forecast",
    ],
    pwKick: "Subscription",
    pwTitle: "14 days free — then 29 kr/month",
    pwBody:
      "Full access to every guide, GPX file, elevation profile and avalanche terrain map. No lock-in — cancel anytime.",
    pwSend: "Send link",
    pwNote:
      "No passwords — you sign in with Google. Payments handled securely by Stripe. Card added at signup — first charge after the trial.",
    close: "Close",
    pwKick2: "Check your inbox",
    pwDoneTitle: "Link sent",
    pwDoneBody: "Open the email and click the link to sign in and start your trial.",
    close2: "Close",
    schematicNote:
      "The route lines are solved over Kartverket's terrain model. Generated geometry — not recorded tracks.",
    startTooltip: "Trailhead / parking",
    routesLabel: "Routes up",
    routesGroup: "Choose a route",
    gradeGroup: "Difficulty",
    searchLabel: "Search peak or region",
    regionLabel: "Region",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    mapLoading: "Loading the map…",
    showMap: "Show map",
    showList: "Show list",
    showInfo: "Show info",
    clearPeak: "Clear selected peak",
    unlockedTitle: "You have full access",
    unlockedBody: "Route description, elevation profile, GPX and avalanche terrain are open to you.",
    guidePending: "The full guide for this peak is still being written.",
  },
};

export function mapDict(lang: Lang): Dict {
  return pick(MAP, lang);
}
