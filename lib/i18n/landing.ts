/** NO/EN dictionary for `/om`, the about page. It was the front page until the
 *  map took over `/`.
 *
 *  The page is pure copy — every string it renders lives here.
 *  The only number with a unit on it is the Vipps number, which is the same
 *  in both languages.
 *
 *  What is *not* copy is how many tours and regions the map holds. Those two
 *  figures sat here as the literals «214» and «12» and were wrong by an order of
 *  magnitude — the map has never had 214 tours. They are counted from `TOURS`
 *  now and passed in as `PlateFigures`, so the plate cannot claim a number the
 *  map does not have. `plateRows` is therefore a function of those figures
 *  rather than a plain list.
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
 *  ordinal (`01`, `02`) is generated from the index, not stored. */
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
  ctaMap: string;
  /* — data plate — */
  plateLabel: string;
  plateRows: (figures: PlateFigures) => readonly PlateRow[];
  plateFoot: string;
  /* — 02 · what a guide holds — */
  guidesKicker: string;
  guideCells: readonly GuideCell[];
  /* — 03 · safety first — */
  safetyKicker: string;
  safetyHeading: string;
  safetyBody: string;
  /** Det eneste som står under kartet i seksjon 03: en vei inn i kartet.
   *
   *  Erstatter `safetyPhotoAlt`, som beskrev et fotografi siden aldri har vist.
   *  Figuren er nå Kirketakets rute, tegnet av `RouteMap`, som skriver sin egen
   *  alternative tekst — og som her står uten figurtekst, fordi lengden og
   *  stigningen til én bestemt tur ikke er det forsida handler om. */
  safetyFigureLink: string;
  /* — 04 · support — */
  supportKicker: string;
  supportHeading: string;
  supportBody: string;
}

const LANDING: Translated<LandingDict> = {
  no: {
    metaTitle: "Om Toppkart",
    metaDescription:
      "Toppkart er en feltguide for skiturer i Norge: kvalitetssikrede toppturer på ett kart, med rute, høydemeter, bratthet og skredterreng.",

    heroLine1: "Alle toppturene.",
    heroLine2: "Ett kart.",
    lede:
      "Kvalitetssikrede toppturer i hele Norge, med rute, høydemeter, bratthet og skredterreng — skrevet for at du skal komme trygt opp og trygt ned.",
    ctaMap: "Se kartet",

    plateLabel: "Toppkart i tall",
    plateRows: (f) => [
      { prop: "Toppturer i kartet", val: String(f.tours), rem: `Fra ${f.north} i nord til ${f.south} i sør` },
      { prop: "Regioner", val: String(f.regions), rem: "Alle med opptegnet rute og høydeprofil" },
    ],
    plateFoot:
      "Hver topp er stedfestet mot Kartverkets terrengmodell. Sjekk alltid skredvarselet på varsom.no før du går.",

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
        body: "Når på året turen er på sitt beste, hvor snøen legger seg, og alternative ruter når forholdene ikke spiller på lag.",
      },
    ],

    safetyKicker: "03 · Trygghet først",
    safetyHeading: "Skrevet for å komme hjem",
    safetyBody:
      "I snitt dør fem mennesker i snøskred i Norge hvert år — de fleste på topptur. Hver guide i Toppkart er derfor bygget rundt terrenget, ikke rundt bildene: bratthet, utløpssoner og trygge alternativer står først, pudderpratet sist.",
    safetyFigureLink: "Se Kirketaket i kartet",

    supportKicker: "04 · Støtt Toppkart",
    supportHeading: "Har du glede av Toppkart?",
    supportBody:
      "Nye turer legges til hver sesong, og guidene revideres når terrenget eller normalruta endrer seg. Vil du støtte arbeidet, kan du sende en Vipps.",
  },

  en: {
    metaTitle: "About Toppkart",
    metaDescription:
      "Toppkart is a field guide to ski touring in Norway: quality-assured peaks on a single map, with routes, vertical gain, steepness and avalanche terrain.",

    heroLine1: "Every ski tour.",
    heroLine2: "One map.",
    lede:
      "Quality-assured ski tours across Norway, with routes, vertical gain, steepness and avalanche terrain — written to get you safely up and safely back down.",
    ctaMap: "See the map",

    plateLabel: "Toppkart in numbers",
    plateRows: (f) => [
      { prop: "Tours on the map", val: String(f.tours), rem: `From ${f.north} in the north to ${f.south} in the south` },
      { prop: "Regions", val: String(f.regions), rem: "Every one with drawn routes and elevation profiles" },
    ],
    plateFoot:
      "Every summit is placed against Kartverket's terrain model. Always check the avalanche forecast at varsom.no before you head out.",

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
        body: "When the tour is at its best, where the snow settles, and alternative lines for when conditions won't play along.",
      },
    ],

    safetyKicker: "03 · Safety first",
    safetyHeading: "Written to get you home",
    safetyBody:
      "On average, five people die in avalanches in Norway every year — most of them ski touring. Every guide in Toppkart is therefore built around the terrain, not around the photos: steepness, runout zones and safer alternatives come first, the powder talk last.",
    safetyFigureLink: "See Kirketaket on the map",

    supportKicker: "04 · Support Toppkart",
    supportHeading: "Enjoying Toppkart?",
    supportBody:
      "New tours are added every season, and guides are revised whenever the terrain or the normal route changes. If you want to support the work, you can send a Vipps.",
  },
};

export function landingDict(lang: Lang): LandingDict {
  return pick(LANDING, lang);
}
