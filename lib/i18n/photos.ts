/** NO/EN for krediteringen under bildene av toppene (`components/PeakPhoto.tsx`). */

import type { Lang, Translated } from "./index";
import { pick } from "./index";

export interface PhotoDict {
  /** «Foto: …» foran fotografens navn. */
  by: string;
  /** Lenketeksten til bildets side på Commons. */
  source: string;
  alt: (peak: string) => string;
}

const PHOTO: Translated<PhotoDict> = {
  no: { by: "Foto", source: "Wikimedia Commons", alt: (peak) => `${peak}` },
  en: { by: "Photo", source: "Wikimedia Commons", alt: (peak) => `${peak}` },
};

export function photoDict(lang: Lang): PhotoDict {
  return pick(PHOTO, lang);
}
