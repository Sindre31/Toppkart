/** NO/EN dictionary for the map page.
 *
 *  The UI strings were lifted verbatim from `design-reference/kart.html` →
 *  `I18N`. A handful of keys at the end cover strings the prototype expressed
 *  inline (the schematic-route note, the trailhead tooltip) plus the labels the
 *  React version needs for accessibility and the guide block.
 *
 *  Tour *content* — teasers, seasons, aspects, durations — is translated
 *  separately, in `./content` and `./format`; the page runs each row through
 *  `localizeTours()` before rendering it. Only chrome lives here.
 */

import { gradeLabel } from "./format";
import type { Lang, Translated } from "./index";
import { pick } from "./index";
import type { AspectSector, VerticalBand } from "../map-filters";

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
  /** Den korte varianten, i linja nederst på mobilkartet. */
  guideShort: string;
  /* — strings the prototype held inline — */
  schematicNote: string;
  startTooltip: string;
  /** Heading above the route picker, shown when a peak has more than one way up. */
  routesLabel: string;
  /** Screen-reader name for the picker itself. */
  routesGroup: string;
  /* — React additions: labels + the guide block — */
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
  /* — today's avalanche danger, from Varsom — */
  avalancheTitle: string;
  /** 1–5 on the European scale, indexed from 1. */
  dangerLevels: readonly string[];
  dangerLevelLabel: (level: number, name: string) => string;
  /** Out of season: in a region, but nobody has assessed today. */
  dangerNotAssessed: string;
  /** The peak is not inside any Varsom forecast region. */
  dangerOutsideRegion: string;
  /** We could not reach Varsom. */
  dangerUnavailable: string;
  dangerLoading: string;
  dangerSource: string;

  guidePending: string;

  /* — aspect and vertical filters — */
  aspectFilterLabel: string;
  allAspects: string;
  aspectSectors: Record<AspectSector, string>;
  verticalFilterLabel: string;
  allVertical: string;
  verticalBands: Record<VerticalBand, string>;
  resetFilters: string;
  /** Knappen som folder ut region, retning, høydemeter og «mine turer». */
  moreFilters: string;
  /** Skjermleserteksten på krysset i en aktiv filterbrikke. */
  removeFilter: (label: string) => string;
  /** Lista når ingen turer passer filtrene. */
  noMatches: string;
  /* — the reader's position — */
  /** The toggle beside the search box: sort by distance, and show the dot. */
  nearMe: string;
  /** Map button, off and on. */
  locate: string;
  locateStop: string;
  /** Replaces `approx` under the filters while the list is sorted by distance. */
  sortedByDistance: string;
  /** Under lista når den står etter Wikipedia-visninger. Kort; forklaringen
   *  står i `sortedByPopularityHint`, som `title`. */
  sortedByPopularity: string;
  sortedByPopularityHint: string;
  /** «12 km unna» on a card. Straight-line distance to the summit. */
  distanceAway: (distance: string) => string;
  youAreHere: string;
  locating: string;
  geoDenied: string;
  geoUnavailable: string;
  geoUnsupported: string;
}

const MAP: Translated<Dict> = {
  no: {
    metaTitle: "Alle toppturene. Ett kart.",
    metaDescription:
      "Alle toppturene i Norge på ett kart: rute, høydemeter, bratthet, skredterreng og sesong for hver topp.",
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
    guideShort: "Turguide",
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
    avalancheTitle: "Skredfare i dag",
    dangerLevels: ["Liten", "Moderat", "Betydelig", "Stor", "Meget stor"],
    dangerLevelLabel: (level, name) => `Faregrad ${level} — ${name}`,
    dangerNotAssessed: "Ikke vurdert i dag. Varsom varsler i skredsesongen, omtrent desember til mai.",
    dangerOutsideRegion: "Toppen ligger utenfor Varsoms varslingsregioner.",
    dangerUnavailable: "Skredvarselet kunne ikke hentes nå. Sjekk varsom.no før du drar.",
    dangerLoading: "Henter skredvarsel …",
    dangerSource: "Varsom.no",
    guidePending: "Full turguide for denne toppen er under arbeid.",
    aspectFilterLabel: "Himmelretning",
    allAspects: "Alle retninger",
    aspectSectors: { N: "Nordvendt", E: "Østvendt", S: "Sørvendt", W: "Vestvendt" },
    verticalFilterLabel: "Høydemeter",
    allVertical: "Alle høydemeter",
    verticalBands: {
      lt700: "Under 700 m",
      "700-1000": "700–1000 m",
      "1000-1300": "1000–1300 m",
      gte1300: "1300 m og mer",
    },
    resetFilters: "Nullstill",
    moreFilters: "Flere filtre",
    removeFilter: (label) => `Fjern filteret «${label}»`,
    noMatches: "Ingen turer passer filtrene.",
    nearMe: "Nær meg",
    locate: "Vis posisjonen min",
    locateStop: "Skjul posisjonen min",
    sortedByDistance: "nærmest først, i luftlinje",
    sortedByPopularity: "mest populære først",
    sortedByPopularityHint: "Etter visninger på norsk Wikipedia siste år.",
    distanceAway: (d) => `${d} unna`,
    youAreHere: "Du er her",
    locating: "Finner posisjonen din …",
    geoDenied:
      "Nettleseren har ikke lov til å dele posisjonen. Slå det på i innstillingene for nettstedet og prøv igjen.",
    geoUnavailable: "Fant ikke posisjonen din akkurat nå. Prøv igjen om litt.",
    geoUnsupported: "Nettleseren din kan ikke dele posisjon.",
  },
  en: {
    metaTitle: "Every ski tour. One map.",
    metaDescription:
      "Every ski tour in Norway on one map: route, vertical gain, steepness, avalanche terrain and season for each peak.",
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
    guideShort: "Guide",
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
    avalancheTitle: "Avalanche danger today",
    dangerLevels: ["Low", "Moderate", "Considerable", "High", "Very high"],
    dangerLevelLabel: (level, name) => `Danger level ${level} — ${name}`,
    dangerNotAssessed: "Not assessed today. Varsom forecasts during the avalanche season, roughly December to May.",
    dangerOutsideRegion: "This peak lies outside Varsom's forecast regions.",
    dangerUnavailable: "Could not load the avalanche forecast. Check varsom.no before you go.",
    dangerLoading: "Loading avalanche forecast …",
    dangerSource: "Varsom.no",
    guidePending: "The full guide for this peak is still being written.",
    aspectFilterLabel: "Aspect",
    allAspects: "All aspects",
    aspectSectors: { N: "North-facing", E: "East-facing", S: "South-facing", W: "West-facing" },
    verticalFilterLabel: "Vertical gain",
    allVertical: "Any vertical",
    verticalBands: {
      lt700: "Under 700 m",
      "700-1000": "700–1000 m",
      "1000-1300": "1000–1300 m",
      gte1300: "1300 m and up",
    },
    resetFilters: "Clear",
    moreFilters: "More filters",
    removeFilter: (label) => `Remove the filter “${label}”`,
    noMatches: "No tours match these filters.",
    nearMe: "Near me",
    locate: "Show my location",
    locateStop: "Hide my location",
    sortedByDistance: "nearest first, as the crow flies",
    sortedByPopularity: "most popular first",
    sortedByPopularityHint: "By views on Norwegian Wikipedia over the past year.",
    distanceAway: (d) => `${d} away`,
    youAreHere: "You are here",
    locating: "Finding your location …",
    geoDenied:
      "The browser is not allowed to share your location. Turn it on in the site settings and try again.",
    geoUnavailable: "Could not find your location right now. Try again in a moment.",
    geoUnsupported: "Your browser cannot share its location.",
  },
};

export function mapDict(lang: Lang): Dict {
  return pick(MAP, lang);
}
