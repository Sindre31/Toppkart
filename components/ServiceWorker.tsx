"use client";

import { useEffect } from "react";

/** Registrerer `public/sw.js`, som lar lagrede turer virke uten dekning.
 *
 *  Bare i produksjonsbygget. Under `next dev` har chunkene samme navn fra én
 *  endring til den neste, og en service worker som svarer på dem fra en lagret
 *  kopi ville servert gammel kode til utvikleren uten at noe sa fra.
 *
 *  `updateViaCache: "none"`: nettleseren skal hente `sw.js` på nytt hver gang den
 *  sjekker, ikke bruke en HTTP-cachet utgave. En feil i service workeren skal
 *  kunne rettes med en ny versjon. */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator) || !window.isSecureContext) return;
    navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" }).catch(() => {
      /* Uten service worker virker alt som før — bare ikke uten nett. */
    });
  }, []);
  return null;
}
