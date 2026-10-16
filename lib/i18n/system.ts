/** NO/EN dictionary for the system surfaces — the pages the reader never asks
 *  for (404, unexpected error).
 *
 *  These strings sit outside the marketing pages, but they are still read by
 *  the same person, so they follow the same voice: calm, factual, no
 *  exclamation marks. Strings that interpolate runtime values are exposed as
 *  small functions rather than templates with placeholders, so the argument
 *  order is checked by the compiler.
 */

import type { Lang, Translated } from "./index";
import { pick } from "./index";

export interface SystemDict {
  /* — 404 — */
  notFoundMetaTitle: string;
  notFoundKicker: string;
  notFoundTitle: string;
  notFoundBody: string;
  notFoundMap: string;
  /* — unexpected error — */
  errorKicker: string;
  errorTitle: string;
  errorBody: string;
  errorRetry: string;
  errorMap: string;
}

const SYSTEM: Translated<SystemDict> = {
  no: {
    notFoundMetaTitle: "Siden finnes ikke",
    notFoundKicker: "Feil 404",
    notFoundTitle: "Utenfor kartet",
    notFoundBody:
      "Siden du leter etter finnes ikke. Den kan ha flyttet seg, eller lenken kan være skrevet feil.",
    notFoundMap: "Åpne kartet",
    errorKicker: "Noe gikk galt",
    errorTitle: "Uventet feil",
    errorBody:
      "Vi klarte ikke å laste siden. Prøv på nytt — hjelper det ikke, gå tilbake til kartet.",
    errorRetry: "Prøv på nytt",
    errorMap: "Åpne kartet",
  },
  en: {
    notFoundMetaTitle: "Page not found",
    notFoundKicker: "Error 404",
    notFoundTitle: "Off the map",
    notFoundBody:
      "The page you are looking for does not exist. It may have moved, or the link may be mistyped.",
    notFoundMap: "Open the map",
    errorKicker: "Something went wrong",
    errorTitle: "Unexpected error",
    errorBody:
      "We could not load the page. Try again — if that does not help, head back to the map.",
    errorRetry: "Try again",
    errorMap: "Open the map",
  },
};

export function systemDict(lang: Lang): SystemDict {
  return pick(SYSTEM, lang);
}
