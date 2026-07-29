/** NO/EN dictionary for the map page.
 *
 *  The UI strings were lifted verbatim from `design-reference/kart.html` →
 *  `I18N`. A handful of keys at the end cover strings the prototype expressed
 *  inline (the schematic-route note, the trailhead tooltip) plus the labels the
 *  React version needs for accessibility and the unlocked state.
 *
 *  Tour *content* — teasers, seasons, aspects — is translated separately, in
 *  `./content` and `./format`; the prototype left it Norwegian.
 */

import type { Lang, Translated } from "./index";
import { pick } from "./index";

/** Grade names indexed 1…4 — index 0 is unused, matching the prototype. */
export type GradeNames = readonly [string, string, string, string, string];

export interface Dict {
  /* — topbar — */
  login: string;
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
  /* — React additions: labels + the unlocked (subscriber) state — */
  langGroup: string;
  gradeGroup: string;
  searchLabel: string;
  regionLabel: string;
  mapLoading: string;
  unlockedTitle: string;
  unlockedBody: string;
  guidePending: string;
}

const MAP: Translated<Dict> = {
  no: {
    login: "Logg inn",
    trial: "Prøv gratis",
    all: "Alle",
    search: "Søk etter topp eller region…",
    allRegions: "Alle regioner",
    tours: "turer",
    tour: "tur",
    approx: "Posisjoner er omtrentlige i prototypen.",
    back: "← Til lista",
    grades: ["", "Enkel", "Middels", "Krevende", "Ekspert"],
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
      "Ingen passord — vi sender en innloggingslenke på e-post. Sikker betaling via Stripe. Kort legges inn ved start — første trekk etter prøveperioden.",
    close: "Lukk",
    pwKick2: "Sjekk innboksen",
    pwDoneTitle: "Lenken er sendt",
    pwDoneBody: "Åpne e-posten og trykk på lenken for å logge inn og starte prøveperioden.",
    close2: "Lukk",
    schematicNote: "Rutelinjen på kartet er skjematisk i prototypen.",
    startTooltip: "Start / parkering",
    langGroup: "Språk / Language",
    gradeGroup: "Vanskelighetsgrad",
    searchLabel: "Søk etter topp eller region",
    regionLabel: "Region",
    mapLoading: "Laster kartet…",
    unlockedTitle: "Du har full tilgang",
    unlockedBody: "Rutebeskrivelse, høydeprofil, GPX og skredterreng er åpne for deg.",
    guidePending: "Full turguide for denne toppen er under arbeid.",
  },
  en: {
    login: "Log in",
    trial: "Try for free",
    all: "All",
    search: "Search peak or region…",
    allRegions: "All regions",
    tours: "tours",
    tour: "tour",
    approx: "Positions are approximate in this prototype.",
    back: "← Back to list",
    grades: ["", "Easy", "Moderate", "Demanding", "Expert"],
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
      "No passwords — we email you a sign-in link. Payments handled securely by Stripe. Card added at signup — first charge after the trial.",
    close: "Close",
    pwKick2: "Check your inbox",
    pwDoneTitle: "Link sent",
    pwDoneBody: "Open the email and click the link to sign in and start your trial.",
    close2: "Close",
    schematicNote: "The route line on the map is schematic in this prototype.",
    startTooltip: "Trailhead / parking",
    langGroup: "Språk / Language",
    gradeGroup: "Difficulty",
    searchLabel: "Search peak or region",
    regionLabel: "Region",
    mapLoading: "Loading the map…",
    unlockedTitle: "You have full access",
    unlockedBody: "Route description, elevation profile, GPX and avalanche terrain are open to you.",
    guidePending: "The full guide for this peak is still being written.",
  },
};

export function mapDict(lang: Lang): Dict {
  return pick(MAP, lang);
}
