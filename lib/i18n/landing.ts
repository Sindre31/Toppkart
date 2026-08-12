/** NO/EN dictionary for the front page.
 *
 *  The landing page is pure copy — every string it renders lives here. The
 *  units in the data plate are copy too: «29 kr» and «14 dager» carry one, and
 *  the unit is the part that has to change language. Prices stay in kroner in
 *  both languages; the product is sold in Norway.
 *
 *  What is *not* copy is how many tours and regions the map holds. Those two
 *  figures sat here as the literals «214» and «12» and were wrong by an order of
 *  magnitude — the map has never had 214 tours. They are counted from `TOURS`
 *  now and passed in as `PlateFigures`, so the plate cannot claim a number the
 *  map does not have. `plateRows` and `plateFoot` are therefore functions of
 *  those figures rather than plain strings.
 *
 *  The counting is done by the caller, not here: this module is imported by a
 *  client component, and importing the tour catalogue would send every route's
 *  geometry to the browser on a page that draws no map.
 *
 *  Section kickers keep their numbering (`02 · …`) — the numbers are part of the
 *  blueprint conceit, not of the sentence.
 */

import type { Lang, Translated } from "./index";
import { pick } from "./index";

/** One row of the «Toppkart — nøkkeldata» plate: property, figure, remark. The
 *  ordinal (`01`…`04`) is generated from the index, not stored. */
export interface PlateRow {
  prop: string;
  val: string;
  rem: string;
}

/** What the plate counts, read off the tour catalogue by `DataPlate`. */
export interface PlateFigures {
  /** Tours on the map. */
  tours: number;
  /** Regions those tours cover. */
  regions: number;
  /** Tours with a written guide behind the subscription — fewer than `tours`,
   *  and the plate says so rather than implying every peak has one. */
  guides: number;
  /** Region of the northernmost tour, and of the southernmost. Proper nouns:
   *  they stay Norwegian in both languages. */
  north: string;
  south: string;
}

export interface GuideCell {
  title: string;
  body: string;
}

export interface LandingDict {
  /* — <head> — */
  metaTitle: string;
  metaDescription: string;
  /* — hero — */
  heroLine1: string;
  heroLine2: string;
  lede: string;
  ctaTrial: string;
  ctaMap: string;
  priceNote: string;
  /* — hero og abonnementsseksjon, sett av en som allerede abonnerer — */
  /** Erstatter «Prøv gratis i 14 dager» når leseren har tilgang. */
  ctaTours: string;
  /** Erstatter «Deretter 29 kr/mnd» når leseren har tilgang. */
  priceNoteActive: string;
  /** Knappa som erstatter påmeldingsfeltet i «04 · Abonnement». */
  planAccount: string;
  /** Erstatter `planNote` — den handler om å begynne, og det er gjort. */
  planNoteActive: string;
  /* — data plate — */
  plateLabel: string;
  plateSheet: string;
  plateRows: (figures: PlateFigures) => readonly PlateRow[];
  plateFoot: (figures: PlateFigures) => string;
  /* — 02 · what a guide holds — */
  guidesKicker: string;
  guideCells: readonly GuideCell[];
  /* — 03 · safety first — */
  safetyKicker: string;
  safetyHeading: string;
  safetyBody: string;
  /** Lenka i figurteksten under kartet i seksjon 03. Erstatter `safetyPhotoAlt`,
   *  som beskrev et fotografi siden aldri har vist — figuren er nå Kirketakets
   *  rute, tegnet av `RouteMap`, som skriver sin egen alternative tekst. */
  safetyFigureLink: string;
  /* — 04 · subscription — */
  planKicker: string;
  planHeading: string;
  planBody: string;
  planNote: string;
  planPrice: string;
  planPriceUnit: string;
  planAnnualPrice: string;
  planAnnualUnit: string;
  planPoints: readonly string[];
  /* — trial signup row — */
  emailPlaceholder: string;
  emailLabel: string;
  emailSubmit: string;
  emailInvalid: string;
}

const LANDING: Translated<LandingDict> = {
  no: {
    metaTitle: "Alle toppturene. Ett kart.",
    metaDescription:
      "Toppkart er en feltguide for skiturer i Norge: kvalitetssikrede toppturer på ett kart, med rute, høydemeter, bratthet og skredterreng. 29 kr/mnd, 14 dager gratis.",

    heroLine1: "Alle toppturene.",
    heroLine2: "Ett kart.",
    lede:
      "Toppkart er en feltguide for skiturer i Norge: kvalitetssikrede toppturer på ett kart, med rute, høydemeter, bratthet og skredterreng — skrevet for at du skal komme trygt opp og trygt ned. For deg som går din første topptur, og for deg som går din hundrede.",
    ctaTrial: "Prøv gratis i 14 dager",
    ctaMap: "Se kartet",
    priceNote: "Deretter 29 kr/mnd. Ingen binding.",
    ctaTours: "Alle turene",
    priceNoteActive: "Abonnementet ditt er aktivt — alle guidene er åpne.",
    planAccount: "Min side",
    planNoteActive:
      "Du abonnerer allerede. Kvitteringer, kort og oppsigelse ligger på Min side.",

    plateLabel: "Toppkart — nøkkeldata",
    plateSheet: "Ark 01 av 04",
    plateRows: (f) => [
      { prop: "Toppturer i kartet", val: String(f.tours), rem: `Fra ${f.north} i nord til ${f.south} i sør` },
      { prop: "Regioner", val: String(f.regions), rem: "Alle med opptegnet rute og høydeprofil" },
      { prop: "Pris per måned", val: "29 kr", rem: "Ingen binding" },
      { prop: "Gratis prøveperiode", val: "14 dager", rem: "Kort kreves — første trekk etter prøveperioden" },
    ],
    plateFoot: (f) =>
      `Hver topp er stedfestet mot Kartverkets terrengmodell, og ${f.guides} av turene har en full turguide skrevet mot ruta. Sjekk alltid skredvarselet på varsom.no før du går.`,

    guidesKicker: "02 · Hva hver turguide holder",
    guideCells: [
      {
        title: "Rute og nedkjøring",
        body: "Opptegnet rute med høydeprofil, normal tidsbruk og beskrivelse av både oppstigning og nedkjøring — inkludert hvor folk pleier å gjøre feil. GPX-fil til klokke og app.",
      },
      {
        title: "Skredterreng",
        body: "Bratthetskart, utløpssoner og hvilke himmelretninger ruta eksponerer deg mot — koblet til dagens skredvarsel fra Varsom, rett i turguiden.",
      },
      {
        title: "Sesong og forhold",
        body: "Når på året turen er på sitt beste, hvor snøen legger seg, og alternative ruter når forholdene ikke spiller på lag. Skrevet av folk som går turene selv.",
      },
    ],

    safetyKicker: "03 · Trygghet først",
    safetyHeading: "Skrevet for å komme hjem",
    safetyBody:
      "I snitt dør fem mennesker i snøskred i Norge hvert år — de fleste på topptur. Hver guide i Toppkart er derfor bygget rundt terrenget, ikke rundt bildene: bratthet, utløpssoner og trygge alternativer står først, pudderpratet sist.",
    safetyFigureLink: "Les turguiden til Kirketaket",

    planKicker: "04 · Abonnement",
    planHeading: "Hele kartet. Alle guidene.",
    planBody:
      "Én pris, alt åpent. Nye turer legges til hver sesong, og guidene revideres når terrenget eller normalruta endrer seg. Avslutt når du vil — abonnementet stopper ved neste trekk.",
    planNote:
      "Du logger inn med Google — ingen passord. Betaling håndteres sikkert av Stripe. Du legger inn kort ved start — første trekk etter 14 dager.",
    planPrice: "29 kr",
    planPriceUnit: "per måned",
    planAnnualPrice: "290 kr",
    planAnnualUnit: "per år — to måneder gratis",
    planPoints: [
      "14 dager gratis prøveperiode",
      "Alle turguider, GPX og høydeprofiler",
      "Skredterreng og Varsom-varsel per tur",
      "Ingen binding — avslutt når som helst",
    ],

    emailPlaceholder: "din@epost.no",
    emailLabel: "E-postadresse",
    emailSubmit: "Start prøveperiode",
    emailInvalid: "Skriv inn en gyldig e-postadresse.",
  },

  en: {
    metaTitle: "Every ski tour. One map.",
    metaDescription:
      "Toppkart is a field guide to ski touring in Norway: quality-assured peaks on a single map, with routes, vertical gain, steepness and avalanche terrain. 29 kr/month, 14 days free.",

    heroLine1: "Every ski tour.",
    heroLine2: "One map.",
    lede:
      "Toppkart is a field guide to ski touring in Norway: quality-assured peaks on a single map, with routes, vertical gain, steepness and avalanche terrain — written to get you safely up and safely back down. For your first ski tour, and for your hundredth.",
    ctaTrial: "Try free for 14 days",
    ctaMap: "See the map",
    priceNote: "Then 29 kr/month. No lock-in.",
    ctaTours: "Every tour",
    priceNoteActive: "Your subscription is active — every guide is open.",
    planAccount: "My account",
    planNoteActive:
      "You already subscribe. Receipts, card and cancellation live on your account page.",

    plateLabel: "Toppkart — key figures",
    plateSheet: "Sheet 01 of 04",
    plateRows: (f) => [
      { prop: "Tours on the map", val: String(f.tours), rem: `From ${f.north} in the north to ${f.south} in the south` },
      { prop: "Regions", val: String(f.regions), rem: "Every one with drawn routes and elevation profiles" },
      { prop: "Price per month", val: "29 kr", rem: "No lock-in" },
      { prop: "Free trial", val: "14 days", rem: "Card required — first charge after the trial" },
    ],
    plateFoot: (f) =>
      `Every summit is placed against Kartverket's terrain model, and ${f.guides} of the tours have a full guide written against the route. Always check the avalanche forecast at varsom.no before you head out.`,

    guidesKicker: "02 · What every guide holds",
    guideCells: [
      {
        title: "Route and descent",
        body: "A drawn route with elevation profile, typical time, and a description of both the ascent and the descent — including where people usually get it wrong. GPX file for your watch and your app.",
      },
      {
        title: "Avalanche terrain",
        body: "Slope-angle maps, runout zones and the aspects the route exposes you to — tied to the day's Varsom forecast, right there in the guide.",
      },
      {
        title: "Season and conditions",
        body: "When the tour is at its best, where the snow settles, and alternative lines for when conditions won't play along. Written by people who ski these tours themselves.",
      },
    ],

    safetyKicker: "03 · Safety first",
    safetyHeading: "Written to get you home",
    safetyBody:
      "On average, five people die in avalanches in Norway every year — most of them ski touring. Every guide in Toppkart is therefore built around the terrain, not around the photos: steepness, runout zones and safer alternatives come first, the powder talk last.",
    safetyFigureLink: "Read the Kirketaket guide",

    planKicker: "04 · Subscription",
    planHeading: "The whole map. Every guide.",
    planBody:
      "One price, everything open. New tours are added every season, and guides are revised whenever the terrain or the normal route changes. Cancel whenever you like — the subscription stops at the next charge.",
    planNote:
      "You sign in with Google — no passwords. Payments are handled securely by Stripe. You add a card at signup — first charge after 14 days.",
    planPrice: "29 kr",
    planPriceUnit: "per month",
    planAnnualPrice: "290 kr",
    planAnnualUnit: "per year — two months free",
    planPoints: [
      "14-day free trial",
      "Every guide, GPX file and elevation profile",
      "Avalanche terrain and Varsom forecast per tour",
      "No lock-in — cancel anytime",
    ],

    emailPlaceholder: "you@example.com",
    emailLabel: "Email address",
    emailSubmit: "Start free trial",
    emailInvalid: "Enter a valid email address.",
  },
};

export function landingDict(lang: Lang): LandingDict {
  return pick(LANDING, lang);
}
