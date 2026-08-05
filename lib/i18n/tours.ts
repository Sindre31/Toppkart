/** NO/EN dictionary for the tour index (`/turer`).
 *
 *  The page is a list of links, so almost everything it renders is data:
 *  peak names and regions are proper nouns, teasers come from `./content`, and
 *  the key figures go through `./format`. What is left here is the furniture
 *  around them.
 *
 *  Counts are functions rather than glued-together strings — seven of the
 *  eighteen regions hold a single tour, and «1 turer» is the kind of detail a
 *  reader notices immediately.
 */

import type { Lang, Translated } from "./index";
import { pick } from "./index";

export interface ToursDict {
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  heading: string;
  lede: (tours: number, regions: number) => string;
  openMap: string;
  regionsLabel: string;
  tourCount: (n: number) => string;
  /* — kortene — */
  statSummit: string;
  statVertical: string;
  statTime: string;
  seasonPrefix: string;
}

const TOURS_DICT: Translated<ToursDict> = {
  no: {
    metaTitle: "Alle turene",
    metaDescription:
      "Alle toppturene i Toppkart, sortert på region: høyde, høydemeter, normaltid, grad og sesong for hver topp — med turguide for hver enkelt.",
    kicker: "Turoversikt",
    heading: "Alle turene",
    lede: (tours, regions) =>
      `${tours} toppturer i ${regions} regioner, fra Lyngen i nord til Gaustatoppen i sør. Hver topp har sin egen turguide med rute, høydeprofil, GPX og skredterreng.`,
    openMap: "Se turene i kartet",
    regionsLabel: "Hopp til region",
    tourCount: (n) => (n === 1 ? "1 tur" : `${n} turer`),
    statSummit: "Topp",
    statVertical: "Høydemeter",
    statTime: "Normaltid",
    seasonPrefix: "Sesong",
  },
  en: {
    metaTitle: "All the tours",
    metaDescription:
      "Every ski tour in Toppkart, grouped by region: summit height, vertical gain, typical time, grade and season for each peak — each with its own guide.",
    kicker: "Tour index",
    heading: "All the tours",
    lede: (tours, regions) =>
      `${tours} ski tours across ${regions} regions, from Lyngen in the north to Gaustatoppen in the south. Every peak has its own guide with the route, elevation profile, GPX and avalanche terrain.`,
    openMap: "See the tours on the map",
    regionsLabel: "Jump to region",
    tourCount: (n) => (n === 1 ? "1 tour" : `${n} tours`),
    statSummit: "Summit",
    statVertical: "Vertical gain",
    statTime: "Typical time",
    seasonPrefix: "Season",
  },
};

export function toursDict(lang: Lang): ToursDict {
  return pick(TOURS_DICT, lang);
}
