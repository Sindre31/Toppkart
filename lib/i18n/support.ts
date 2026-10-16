/** NO/EN dictionary for voluntary support — the Vipps number on `/om` and the
 *  one-time prompt (`components/SupportPrompt.tsx`).
 *
 *  The number is there for whoever wants to chip in, and the copy says so
 *  plainly: no guilt, no countdown, asked once. */

import type { Lang, Translated } from "./index";
import { pick } from "./index";

export interface SupportDict {
  /** «Vipps» — the label beside the number. A brand name, the same in both
   *  languages, but kept here so the sentence around it can move. */
  vipps: string;
  copy: string;
  copied: string;
  /* — the prompt — */
  promptTitle: string;
  promptBody: string;
  promptClose: string;
}

const SUPPORT: Translated<SupportDict> = {
  no: {
    vipps: "Vipps",
    copy: "Kopier nummer",
    copied: "Kopiert",
    promptTitle: "Støtt Toppkart",
    promptBody:
      "Har du glede av appen, kan du støtte arbeidet med en Vipps — et par kroner holder kartet oppe og guidene oppdatert.",
    promptClose: "Lukk",
  },
  en: {
    vipps: "Vipps",
    copy: "Copy number",
    copied: "Copied",
    promptTitle: "Support Toppkart",
    promptBody:
      "If you enjoy the app, you can support the work with a Vipps — a few kroner keep the map running and the guides up to date.",
    promptClose: "Close",
  },
};

export function supportDict(lang: Lang): SupportDict {
  return pick(SUPPORT, lang);
}
