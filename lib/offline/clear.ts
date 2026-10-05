/** Sendes med svaret på utlogging og sletting av kontoen.
 *
 *  `"storage"` tømmer Cache Storage — der turene lagret med «Lagre offline»
 *  ligger — og avregistrerer service workeren, som registreres på nytt ved neste
 *  sidevisning. De lagrede guidene er abonnentens; en delt eller lånt telefon
 *  skal ikke sitte igjen med dem etter at kontoen er logget ut. Informasjons-
 *  kapslene, språkvalget med, er ikke med i `"storage"` og blir stående.
 *
 *  Service workeren gjør det samme når den ser forespørselen gå forbi
 *  (`public/sw.js`), for nettlesere som ikke støtter overskriften. */
export const CLEAR_OFFLINE_HEADERS = { "Clear-Site-Data": '"storage"' } as const;
