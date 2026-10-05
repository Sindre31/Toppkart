import type { Lang } from "@/lib/i18n";
import { osloDate } from "@/lib/avalanche";

/** Værvarsel for toppen, fra MET Norway (Locationforecast 2.0).
 *
 *  Kilde: Meteorologisk institutt, det samme varselet Yr viser. Gratis og uten
 *  nøkkel, på tre vilkår: en `User-Agent` som sier hvem vi er og hvordan vi
 *  nås, høyst fire desimaler i koordinatene, og at vi ikke spør oftere enn
 *  varselet endrer seg (`Expires` i svaret, omtrent en halvtime). Dataene er
 *  CC BY 4.0, så kilden står under panelet. Se https://api.met.no/doc/TermsOfService.
 *
 *  Høyden sendes med: `altitude` er toppunktet, og da regner MET temperaturen
 *  om til den høyden i stedet for modellterrengets, som på et spisst fjell kan
 *  ligge flere hundre meter lavere. Vinden blir *ikke* regnet om. Den er
 *  modellens vind i et rutenett på 2,5 km, og en eksponert rygg blåser ofte
 *  mer — det sier panelet, i stedet for å late som tallet er toppens.
 *
 *  Ingenting her kaster. Et værpanel som ikke laster, skal ikke ta turpanelet
 *  med seg.
 */

const ENDPOINT = "https://api.met.no/weatherapi/locationforecast/2.0/compact";

/** MET avviser anonyme klienter med 403. Adressen er support-postkassa, som
 *  står i bunnteksten på hver side og leses. */
const USER_AGENT = "Toppkart/1.0 (+https://toppkart.no; support@toppkart.no)";

/* — det vi sender til nettleseren — */

export interface WeatherNow {
  /** °C ved toppens høyde. */
  temperature: number;
  /** m/s, modellvind. */
  windSpeed: number;
  /** Grader, retningen vinden kommer *fra*. */
  windFrom: number;
  /** METs symbolkode for neste time, f.eks. `lightsnowshowers_day`. */
  symbol: string | null;
}

export interface WeatherDay {
  /** Norsk kalenderdag, `YYYY-MM-DD`. */
  date: string;
  /** Symbolet for dagtid (neste 12 timer fra 06 UTC), eller det nærmeste. */
  symbol: string | null;
  minTemp: number;
  maxTemp: number;
  /** Sterkeste vind i døgnet, m/s, og hvor den kommer fra. */
  maxWind: number;
  maxWindFrom: number;
  /** Nedbør i døgnet, mm. */
  precipitation: number;
}

export type WeatherForecast =
  | {
      state: "ok";
      /** Når MET sist oppdaterte varselet, ISO. */
      updatedAt: string;
      /** Høyden varselet er regnet for, moh. */
      altitude: number;
      now: WeatherNow;
      days: WeatherDay[];
    }
  | { state: "unavailable" };

/* — METs format, så langt vi leser det — */

interface MetDetails {
  air_temperature?: number;
  wind_speed?: number;
  wind_from_direction?: number;
  precipitation_amount?: number;
}

interface MetPeriod {
  summary?: { symbol_code?: string };
  details?: MetDetails;
}

export interface MetStep {
  time: string;
  data: {
    instant: { details: MetDetails };
    next_1_hours?: MetPeriod;
    next_6_hours?: MetPeriod;
    next_12_hours?: MetPeriod;
  };
}

export interface MetPayload {
  properties?: {
    meta?: { updated_at?: string };
    timeseries?: MetStep[];
  };
}

const HOUR = 3_600_000;

/** Gjør METs tidsserie om til «nå» og de neste `dayCount` dagene.
 *
 *  Døgnene er norske kalenderdager, ikke UTC: en tur i morgen er i morgen her.
 *  Serien har timesteg de første par døgnene og seks-timers blokker etter
 *  det, så nedbøren summeres med en markør for hvor langt vi har talt — en
 *  timesverdi og en seks-timersverdi som starter samtidig, beskriver det samme
 *  regnet og skal ikke legges sammen. En blokk regnes til dagen den starter i;
 *  ved midnatt kan det flytte et par timers nedbør til feil side, og det er
 *  mindre galt enn å dele den på en måte varselet ikke gjør selv.
 */
export function summarize(
  payload: MetPayload,
  now: Date,
  altitude: number,
  dayCount = 3,
): WeatherForecast {
  const series = payload.properties?.timeseries;
  const updatedAt = payload.properties?.meta?.updated_at;
  if (!Array.isArray(series) || !series.length || !updatedAt) return { state: "unavailable" };

  const steps = series
    .map((s) => ({ ...s, t: Date.parse(s.time) }))
    .filter((s) => Number.isFinite(s.t) && typeof s.data?.instant?.details?.air_temperature === "number")
    .sort((a, b) => a.t - b.t);

  /* «Nå» er det siste steget som har begynt, eller det første om varselet
     ennå ikke har nådd hit. */
  const current = [...steps].reverse().find((s) => s.t <= now.getTime()) ?? steps[0];
  if (!current) return { state: "unavailable" };
  const ci = current.data.instant.details;

  const firstDate = osloDate(now);
  const days: WeatherDay[] = [];
  const byDate = new Map<string, typeof steps>();
  for (const s of steps) {
    if (s.t < current.t) continue;
    const date = osloDate(new Date(s.t));
    if (date < firstDate) continue;
    if (!byDate.has(date)) {
      if (byDate.size === dayCount) break;
      byDate.set(date, []);
    }
    byDate.get(date)!.push(s);
  }

  for (const [date, list] of byDate) {
    let minTemp = Infinity;
    let maxTemp = -Infinity;
    let maxWind = -Infinity;
    let maxWindFrom = 0;
    let precipitation = 0;
    let coveredUntil = -Infinity;

    for (const s of list) {
      const d = s.data.instant.details;
      minTemp = Math.min(minTemp, d.air_temperature!);
      maxTemp = Math.max(maxTemp, d.air_temperature!);
      if (typeof d.wind_speed === "number" && d.wind_speed > maxWind) {
        maxWind = d.wind_speed;
        maxWindFrom = d.wind_from_direction ?? 0;
      }
      if (s.t < coveredUntil) continue;
      const one = s.data.next_1_hours?.details?.precipitation_amount;
      const six = s.data.next_6_hours?.details?.precipitation_amount;
      if (typeof one === "number") {
        precipitation += one;
        coveredUntil = s.t + HOUR;
      } else if (typeof six === "number") {
        precipitation += six;
        coveredUntil = s.t + 6 * HOUR;
      }
    }

    days.push({
      date,
      symbol: daySymbol(list),
      minTemp: round1(minTemp),
      maxTemp: round1(maxTemp),
      maxWind: round1(Math.max(maxWind, 0)),
      maxWindFrom,
      precipitation: round1(precipitation),
    });
  }

  return {
    state: "ok",
    updatedAt,
    altitude: Math.round(altitude),
    now: {
      temperature: round1(ci.air_temperature!),
      windSpeed: round1(ci.wind_speed ?? 0),
      windFrom: ci.wind_from_direction ?? 0,
      symbol:
        current.data.next_1_hours?.summary?.symbol_code ??
        current.data.next_6_hours?.summary?.symbol_code ??
        null,
    },
    days,
  };
}

/** Symbolet for dagen: tolv-timersvarselet fra 06 UTC — kl. 07/08 til 19/20
 *  norsk tid, altså turdagen — eller, for i dag når det er passert, det
 *  første tolv-timersvarselet som er igjen. */
function daySymbol(list: readonly MetStep[]): string | null {
  const morning = list.find((s) => s.time.slice(11, 13) === "06" && s.data.next_12_hours);
  const pick = morning ?? list.find((s) => s.data.next_12_hours) ?? list[0];
  return (
    pick?.data.next_12_hours?.summary?.symbol_code ??
    pick?.data.next_6_hours?.summary?.symbol_code ??
    pick?.data.next_1_hours?.summary?.symbol_code ??
    null
  );
}

/** Én desimal, og aldri `-0`: -0,04 °C skal stå som 0, ikke «−0». */
function round1(v: number): number {
  return Math.round(v * 10) / 10 || 0;
}

/* — henting — */

export async function getWeatherForecast(
  lat: number,
  lng: number,
  altitude: number,
  now: Date = new Date(),
): Promise<WeatherForecast> {
  /* Fire desimaler er ~10 m og METs grense; flere gir 403. */
  const params = new URLSearchParams({
    lat: lat.toFixed(4),
    lon: lng.toFixed(4),
    altitude: String(Math.round(altitude)),
  });

  let payload: MetPayload;
  try {
    const res = await fetch(`${ENDPOINT}?${params}`, {
      headers: { "User-Agent": USER_AGENT },
      /* Varselet oppdateres omtrent hver halvtime, og `Expires` sier det
         samme. Oftere enn dette er å spørre om noe vi allerede har, og det er
         det MET ber oss la være. */
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return { state: "unavailable" };
    payload = (await res.json()) as MetPayload;
  } catch {
    return { state: "unavailable" };
  }

  return summarize(payload, now, altitude);
}

/* — tekst og ikon, delt med panelet — */

export type SymbolKind =
  | "clear"
  | "fair"
  | "partly"
  | "cloudy"
  | "fog"
  | "rain"
  | "sleet"
  | "snow"
  | "thunder";

export interface SymbolInfo {
  kind: SymbolKind;
  night: boolean;
  text: string;
}

const SKY: Record<string, { kind: SymbolKind; no: string; en: string }> = {
  clearsky: { kind: "clear", no: "Klarvær", en: "Clear sky" },
  fair: { kind: "fair", no: "Lettskyet", en: "Fair" },
  partlycloudy: { kind: "partly", no: "Delvis skyet", en: "Partly cloudy" },
  cloudy: { kind: "cloudy", no: "Skyet", en: "Cloudy" },
  fog: { kind: "fog", no: "Tåke", en: "Fog" },
};

const FALL: Record<string, { no: string; showers: string; en: string }> = {
  rain: { no: "regn", showers: "regnbyger", en: "rain" },
  sleet: { no: "sludd", showers: "sluddbyger", en: "sleet" },
  snow: { no: "snø", showers: "snøbyger", en: "snow" },
};

/** METs symbolkode som tekst og ikonfamilie.
 *
 *  Koden er bygget av deler — styrke, type, byger, torden, tid på døgnet —
 *  så den leses som det, i stedet for en tabell over alle 41. To av METs egne
 *  koder er stavet med en ekstra s (`lightssleetshowersandthunder`,
 *  `lightssnowshowersandthunder`); de er like gyldige, og de leses likt. En
 *  kode vi ikke kjenner, gir `null`, ikke en gjetning. */
export function describeSymbol(code: string | null, lang: Lang): SymbolInfo | null {
  if (!code) return null;
  const [base, time] = code.split("_");
  const night = time === "night" || time === "polartwilight";

  const sky = SKY[base];
  if (sky) return { kind: sky.kind, night, text: sky[lang] };

  const m = /^(lights?|heavy)?(rain|sleet|snow)(showers)?(andthunder)?$/.exec(base);
  if (!m) return null;
  const [, strength, type, showers, thunder] = m;
  const light = strength?.startsWith("light") ?? false;
  const heavy = strength === "heavy";
  const fall = FALL[type];

  let text: string;
  if (lang === "no") {
    if (showers) {
      text = `${light ? "Lette " : heavy ? "Kraftige " : ""}${fall.showers}`;
    } else {
      text = `${light ? "Lett " : heavy ? "Kraftig " : ""}${fall.no}`;
    }
    if (thunder) text += " og torden";
  } else {
    text = `${light ? "Light " : heavy ? "Heavy " : ""}${fall.en}${showers ? " showers" : ""}`;
    if (thunder) text += " and thunder";
  }
  text = text.charAt(0).toUpperCase() + text.slice(1);

  return { kind: thunder ? "thunder" : (type as SymbolKind), night, text };
}

const COMPASS = {
  no: ["N", "NØ", "Ø", "SØ", "S", "SV", "V", "NV"],
  en: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"],
} as const;

/** `210` → `"SV"`. Retningen vinden kommer fra, som i et vindvarsel. */
export function compassFrom(degrees: number, lang: Lang): string {
  const i = Math.round((((degrees % 360) + 360) % 360) / 45) % 8;
  return COMPASS[lang][i];
}

/** Yrs side for samme punkt — det fulle varselet, time for time. */
export function yrUrl(lat: number, lng: number, lang: Lang): string {
  const point = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  return lang === "en"
    ? `https://www.yr.no/en/forecast/daily-table/${point}`
    : `https://www.yr.no/nb/v%C3%A6rvarsel/daglig-tabell/${point}`;
}
