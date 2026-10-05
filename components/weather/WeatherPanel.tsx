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
import { weatherDict } from "@/lib/i18n/weather";
import {
  compassFrom,
  describeSymbol,
  yrUrl,
  type SymbolInfo,
  type WeatherForecast,
} from "@/lib/weather";
import s from "./weather.module.css";

/** Været på toppen de neste tre dagene, fra MET Norway.
 *
 *  Står i turpanelet på `/kart` og på turguiden, og er åpent for alle begge
 *  steder — vær er sikkerhetsinformasjon om fjellet man ser på, som
 *  skredvarselet.
 *
 *  Hentes i nettleseren, også på guiden der sida ellers rendres på serveren.
 *  På kartet byttes toppen uten navigasjon, og en rundtur per trykk ville
 *  gjort at panelet hang etter valget. På guiden ville et varsel i HTML-en
 *  gjort at sida ventet på MET før den første byten — og en guide lagret med
 *  «Lagre offline» ville vist et varsel fra den dagen den ble lagret, som om
 *  det var dagens.
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
  heading: Heading = "h3",
  className,
}: {
  slug: string;
  lat: number;
  lng: number;
  lang: Lang;
  /** Overskriftsnivået der panelet står: `h3` i kartets turpanel, `h2` som
   *  egen del av turguiden. */
  heading?: "h2" | "h3";
  /** Rammen rundt kommer fra stedet panelet står, ikke fra panelet. */
  className?: string;
}) {
  const t = weatherDict(lang);
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
    if (i === 0) return t.today;
    if (i === 1) return t.tomorrow;
    /* Middag UTC er samme kalenderdag i Norge året rundt. */
    const name = new Date(`${date}T12:00:00Z`).toLocaleDateString(locale, {
      weekday: "long",
      timeZone: "Europe/Oslo",
    });
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <section className={className ? `${s.panel} ${className}` : s.panel}>
      <Heading className={s.head}>
        {t.title}
        {forecast?.state === "ok" ? (
          <span className={s.headAside}>{t.altitude(forecast.altitude)}</span>
        ) : null}
      </Heading>

      {forecast === null ? (
        <p className={s.note}>{t.loading}</p>
      ) : forecast.state !== "ok" ? (
        <p className={s.note}>{t.unavailable}</p>
      ) : (
        <>
          {(() => {
            const info = describeSymbol(forecast.now.symbol, lang);
            return (
              <div className={s.weatherNow}>
                <SymbolIcon info={info} />
                <span className={s.weatherTemp}>{num(forecast.now.temperature)} °C</span>
                <span className={s.weatherNowText}>
                  <span className={s.weatherDay}>{t.now}</span>
                  {info ? `${info.text}, ` : ""}
                  {t.windNow(num(forecast.now.windSpeed), compassFrom(forecast.now.windFrom, lang))}
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
                      {t.tempRange(num(day.minTemp), num(day.maxTemp))} ·{" "}
                      {t.windMax(num(day.maxWind), compassFrom(day.maxWindFrom, lang))} ·{" "}
                      {num(day.precipitation, 1)} mm
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <p className={s.note}>{t.note}</p>
        </>
      )}

      <a
        className={s.source}
        href={yrUrl(lat, lng, lang)}
        target="_blank"
        rel="noreferrer"
      >
        {t.source}
      </a>
    </section>
  );
}
