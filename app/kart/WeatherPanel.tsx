"use client";

import { useEffect, useState } from "react";
import {
  Cloud,
  CloudFog,
  CloudHail,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Moon,
  Sun,
} from "lucide-react";

import type { Lang } from "@/lib/i18n";
import { mapDict } from "@/lib/i18n/map";
import {
  compassFrom,
  describeSymbol,
  yrUrl,
  type SymbolInfo,
  type WeatherForecast,
} from "@/lib/weather";
import s from "./kart.module.css";

/** Været på toppen de neste tre dagene, fra MET Norway.
 *
 *  Hentes i nettleseren av samme grunn som skredvarselet (`AvalanchePanel`):
 *  toppen byttes uten navigasjon, og en rundtur til serveren per trykk ville
 *  gjort at panelet hang etter valget. Og som skredvarselet er det åpent for
 *  alle — vær er sikkerhetsinformasjon om fjellet man ser på.
 *
 *  Panelet sier hva tallene er. Temperaturen er regnet for toppens høyde;
 *  vinden er modellens og ikke ryggens. Det står under tallene, ikke i en
 *  fotnote ingen leser. */

/** Ikonet for et symbol. Én gren per familie, og ingen tabell over
 *  komponenter: en komponent valgt ved et oppslag under rendring er en ny
 *  komponent for React hver gang. */
function SymbolIcon({ info }: { info: SymbolInfo | null }) {
  const p = { className: s.weatherIcon, size: 22, strokeWidth: 1.5, "aria-hidden": true } as const;
  switch (info?.kind) {
    case "clear":
      return info.night ? <Moon {...p} /> : <Sun {...p} />;
    case "fair":
    case "partly":
      return info.night ? <CloudMoon {...p} /> : <CloudSun {...p} />;
    case "fog":
      return <CloudFog {...p} />;
    case "rain":
      return <CloudRain {...p} />;
    case "sleet":
      return <CloudHail {...p} />;
    case "snow":
      return <CloudSnow {...p} />;
    case "thunder":
      return <CloudLightning {...p} />;
    default:
      return <Cloud {...p} />;
  }
}

export function WeatherPanel({
  slug,
  lat,
  lng,
  lang,
}: {
  slug: string;
  lat: number;
  lng: number;
  lang: Lang;
}) {
  const t = mapDict(lang);
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);

  useEffect(() => {
    /* Som i `AvalanchePanel`: et sent svar for en topp leseren alt har forlatt,
       skal ikke tegnes. Tømmingen ved bytte gjør `key={slug}` på kallstedet. */
    let current = true;
    fetch(`/api/vaer?${new URLSearchParams({ tur: slug })}`)
      .then((res) => (res.ok ? res.json() : { state: "unavailable" }))
      .then((data: WeatherForecast) => {
        if (current) setForecast(data);
      })
      .catch(() => {
        if (current) setForecast({ state: "unavailable" });
      });
    return () => {
      current = false;
    };
  }, [slug]);

  const locale = lang === "en" ? "en-GB" : "nb-NO";
  const num = (v: number, digits = 0) =>
    v.toLocaleString(locale, { maximumFractionDigits: digits, minimumFractionDigits: 0 });
  const dayLabel = (date: string, i: number) => {
    if (i === 0) return t.weatherToday;
    if (i === 1) return t.weatherTomorrow;
    /* Middag UTC er samme kalenderdag i Norge året rundt. */
    const name = new Date(`${date}T12:00:00Z`).toLocaleDateString(locale, {
      weekday: "long",
      timeZone: "Europe/Oslo",
    });
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <section className={s.avalanche}>
      <h3 className={s.avalancheHead}>
        {t.weatherTitle}
        {forecast?.state === "ok" ? (
          <span className={s.avalancheRegion}>{t.weatherAltitude(forecast.altitude)}</span>
        ) : null}
      </h3>

      {forecast === null ? (
        <p className={s.avalancheNote}>{t.weatherLoading}</p>
      ) : forecast.state !== "ok" ? (
        <p className={s.avalancheNote}>{t.weatherUnavailable}</p>
      ) : (
        <>
          {(() => {
            const info = describeSymbol(forecast.now.symbol, lang);
            return (
              <div className={s.weatherNow}>
                <SymbolIcon info={info} />
                <span className={s.weatherTemp}>{num(forecast.now.temperature)} °C</span>
                <span className={s.weatherNowText}>
                  <span className={s.weatherDay}>{t.weatherNow}</span>
                  {info ? `${info.text}, ` : ""}
                  {t.weatherWindNow(num(forecast.now.windSpeed), compassFrom(forecast.now.windFrom, lang))}
                </span>
              </div>
            );
          })()}

          <ul className={s.weatherDays}>
            {forecast.days.map((day, i) => {
              const info = describeSymbol(day.symbol, lang);
              return (
                <li key={day.date} className={s.weatherRow}>
                  <SymbolIcon info={info} />
                  <div>
                    <div className={s.weatherRowHead}>
                      <span className={s.weatherDay}>{dayLabel(day.date, i)}</span>
                      {info ? <span>{info.text}</span> : null}
                    </div>
                    <div className={s.weatherRowFacts}>
                      {t.weatherTempRange(num(day.minTemp), num(day.maxTemp))} ·{" "}
                      {t.weatherWindMax(num(day.maxWind), compassFrom(day.maxWindFrom, lang))} ·{" "}
                      {num(day.precipitation, 1)} mm
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <p className={s.avalancheNote}>{t.weatherNote}</p>
        </>
      )}

      <a
        className={s.avalancheSource}
        href={yrUrl(lat, lng, lang)}
        target="_blank"
        rel="noreferrer"
      >
        {t.weatherSource}
      </a>
    </section>
  );
}
