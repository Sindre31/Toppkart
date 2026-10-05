/** NO/EN dictionary for favourites and done tours — the buttons on the guide
 *  and the map panel, the filter on the map, and «Mine turer» on Min side.
 *  Its own file because three pages render it. */

import type { Lang, Translated } from "./index";
import { pick } from "./index";

export interface MarksDict {
  favorite: string;
  done: string;
  /** «Gått 5. oktober 2026» on the pressed button. */
  doneOn: (date: string) => string;
  /** Title on the buttons for a signed-out reader. */
  signInToMark: string;
  saveFailed: string;
  /* — the filter on /kart — */
  filterLabel: string;
  filterAll: string;
  filterFavorites: string;
  filterDone: string;
  filterNotDone: string;
  /* — list badges, for screen readers — */
  badgeFavorite: string;
  badgeDone: string;
  /* — Min side — */
  kicker: string;
  favoritesTitle: string;
  doneTitle: string;
  doneTotals: (count: number, vertical: string) => string;
  emptyFavorites: string;
  emptyDone: string;
  unavailable: string;
}

const MARKS: Translated<MarksDict> = {
  no: {
    favorite: "Favoritt",
    done: "Har gått",
    doneOn: (date) => `Gått ${date}`,
    signInToMark: "Logg inn for å lagre favoritter og turer du har gått",
    saveFailed: "Endringen ble ikke lagret. Prøv igjen.",
    filterLabel: "Mine turer",
    filterAll: "Alle turer",
    filterFavorites: "Favoritter",
    filterDone: "Har gått",
    filterNotDone: "Ikke gått",
    badgeFavorite: "Favoritt",
    badgeDone: "Gått",
    kicker: "03 · Mine turer",
    favoritesTitle: "Favoritter",
    doneTitle: "Turer du har gått",
    doneTotals: (count, vertical) =>
      `${count} ${count === 1 ? "tur" : "turer"} · ${vertical} høydemeter`,
    emptyFavorites: "Ingen ennå. Trykk «Favoritt» på en tur, i kartet eller på guiden.",
    emptyDone: "Ingen ennå. Trykk «Har gått» på en tur når du har vært på toppen.",
    unavailable: "Turlista di kunne ikke hentes akkurat nå.",
  },
  en: {
    favorite: "Favourite",
    done: "Done it",
    doneOn: (date) => `Done ${date}`,
    signInToMark: "Sign in to save favourites and the tours you have done",
    saveFailed: "The change was not saved. Try again.",
    filterLabel: "My tours",
    filterAll: "All tours",
    filterFavorites: "Favourites",
    filterDone: "Done",
    filterNotDone: "Not done",
    badgeFavorite: "Favourite",
    badgeDone: "Done",
    kicker: "03 · My tours",
    favoritesTitle: "Favourites",
    doneTitle: "Tours you have done",
    doneTotals: (count, vertical) =>
      `${count} ${count === 1 ? "tour" : "tours"} · ${vertical} m vertical`,
    emptyFavorites: "None yet. Press «Favourite» on a tour, on the map or on its guide.",
    emptyDone: "None yet. Press «Done it» on a tour once you have been to the top.",
    unavailable: "Your list could not be loaded right now.",
  },
};

export function marksDict(lang: Lang): MarksDict {
  return pick(MARKS, lang);
}
