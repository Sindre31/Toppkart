/** NO/EN dictionary for the summit forecast (`components/weather/WeatherPanel`).
 *
 *  Its own file because the panel is: it stands on `/kart` and on the guide
 *  page, and neither page's dictionary should own strings the other renders.
 *  The forecast's own words — «Lett snø», «SV» — come from `lib/weather`, which
 *  reads them off MET's symbol codes.
 */

import type { Lang, Translated } from "./index";
import { pick } from "./index";

export interface WeatherDict {
  title: string;
  altitude: (m: number) => string;
  now: string;
  today: string;
  tomorrow: string;
  /** «−5 til −1 °C» */
  tempRange: (min: string, max: string) => string;
  /** «vind opptil 14 m/s fra SV» */
  windMax: (speed: string, from: string) => string;
  /** «vind 6 m/s fra S» */
  windNow: (speed: string, from: string) => string;
  loading: string;
  unavailable: string;
  note: string;
  source: string;
}

const WEATHER: Translated<WeatherDict> = {
  no: {
    title: "Vær på toppen",
    altitude: (m) => `${m} moh`,
    now: "Nå",
    today: "I dag",
    tomorrow: "I morgen",
    tempRange: (min, max) => (min === max ? `${min} °C` : `${min} til ${max} °C`),
    windMax: (speed, from) => `vind opptil ${speed} m/s fra ${from}`,
    windNow: (speed, from) => `vind ${speed} m/s fra ${from}`,
    loading: "Henter værvarsel …",
    unavailable: "Værvarselet kunne ikke hentes nå. Sjekk yr.no før du drar.",
    note:
      "Temperaturen er regnet for toppens høyde. Vinden er modellens, og på en eksponert rygg blåser det ofte mer.",
    source: "Yr · data fra MET Norway",
  },
  en: {
    title: "Weather on the summit",
    altitude: (m) => `${m} m`,
    now: "Now",
    today: "Today",
    tomorrow: "Tomorrow",
    tempRange: (min, max) => (min === max ? `${min} °C` : `${min} to ${max} °C`),
    windMax: (speed, from) => `wind up to ${speed} m/s from ${from}`,
    windNow: (speed, from) => `wind ${speed} m/s from ${from}`,
    loading: "Loading the forecast …",
    unavailable: "Could not load the forecast. Check yr.no before you go.",
    note:
      "Temperature is for the summit's height. Wind is the model's, and an exposed ridge often blows harder.",
    source: "Yr · data from MET Norway",
  },
};

export function weatherDict(lang: Lang): WeatherDict {
  return pick(WEATHER, lang);
}
