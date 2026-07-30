/** Strings shared by the site chrome — the nav, the footer, the language
 *  switcher. Page-specific copy lives in the sibling namespace files. */

import type { Lang, Translated } from "./index";
import { pick } from "./index";

export interface CommonDict {
  /* — nav — */
  brandHome: string;
  map: string;
  login: string;
  logout: string;
  account: string;
  trial: string;
  contents: string;
  price: string;
  /* — footer — */
  footerMap: string;
  /* — language switcher — */
  langLabel: string;
  langSwitchTo: string;
  /* — generic — */
  close: string;
  back: string;
  loading: string;
}

const COMMON: Translated<CommonDict> = {
  no: {
    brandHome: "Til forsiden",
    map: "Kartet",
    login: "Logg inn",
    logout: "Logg ut",
    account: "Min side",
    trial: "Prøv gratis",
    contents: "Innhold",
    price: "Pris",
    footerMap: "Kartet",
    langLabel: "Språk",
    langSwitchTo: "Bytt til engelsk",
    close: "Lukk",
    back: "Tilbake",
    loading: "Laster…",
  },
  en: {
    brandHome: "Back to the front page",
    map: "The map",
    login: "Log in",
    logout: "Log out",
    account: "My account",
    trial: "Try for free",
    contents: "Contents",
    price: "Pricing",
    footerMap: "The map",
    langLabel: "Language",
    langSwitchTo: "Switch to Norwegian",
    close: "Close",
    back: "Back",
    loading: "Loading…",
  },
};

export function commonDict(lang: Lang): CommonDict {
  return pick(COMMON, lang);
}

/* — site-level metadata — */

export interface SiteMeta {
  name: string;
  tagline: string;
  description: string;
}

/** The English half of `SITE` in `lib/config.ts`. The name is a proper noun and
 *  is identical in both languages; the tagline and description are copy. */
const SITE_META: Translated<SiteMeta> = {
  no: {
    name: "Toppkart",
    tagline: "Alle toppturene. Ett kart.",
    description:
      "Toppkart er en feltguide for skiturer i Norge: kvalitetssikrede toppturer på ett kart, med rute, høydemeter, bratthet og skredterreng.",
  },
  en: {
    name: "Toppkart",
    tagline: "Every ski tour. One map.",
    description:
      "Toppkart is a field guide to ski touring in Norway: quality-assured peaks on a single map, with routes, vertical gain, steepness and avalanche terrain.",
  },
};

export function siteMeta(lang: Lang): SiteMeta {
  return pick(SITE_META, lang);
}
