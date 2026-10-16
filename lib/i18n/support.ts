/** NO/EN dictionary for voluntary support — the Vipps number on `/om`.
 *
 *  The number is there for whoever wants to chip in. It stands on `/om` and
 *  nowhere else: no prompt, no nagging. */

import type { Lang, Translated } from "./index";
import { pick } from "./index";

export interface SupportDict {
  /** «Vipps» — the label beside the number. A brand name, the same in both
   *  languages, but kept here so the sentence around it can move. */
  vipps: string;
  copy: string;
  copied: string;
}

const SUPPORT: Translated<SupportDict> = {
  no: {
    vipps: "Vipps",
    copy: "Kopier nummer",
    copied: "Kopiert",
  },
  en: {
    vipps: "Vipps",
    copy: "Copy number",
    copied: "Copied",
  },
};

export function supportDict(lang: Lang): SupportDict {
  return pick(SUPPORT, lang);
}
