"use client";

/** Skredfaren og været på toppen, som to små kort — på turguiden under «Før du
 *  går» og i turpanelet på kartet.
 *
 *  Begge hentes i nettleseren. På kartet byttes toppen uten navigasjon, og en
 *  rundtur til serveren per trykk ville gjort at kortene hang etter valget. På
 *  guiden ville et varsel i HTML-en gjort at sida ventet på Varsom og MET før
 *  første byte — og en guide lagret offline ville vist et varsel fra dagen den
 *  ble lagret, som om det var dagens.
 *
 *  Hvert utfall sier noe. Et varsel som ikke kan hentes, en topp utenfor
 *  varslingsregionene og en sommerdag uten vurdering er tre forskjellige ting,
 *  og ingen av dem er «faregrad 0» — se `lib/avalanche`.
 *
 *  Skredfargene er Varsoms egne (`DANGER_COLORS`) og tilpasses ikke paletten.
 *
 *  Bytter leseren topp, skal kortene lages på nytt (`key={slug}` på
 *  kallstedet), så den forrige toppens faregrad aldri står under det nye
 *  navnet. */

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

import { DANGER_COLORS, type AvalancheForecast } from "@/lib/avalanche";
import type { Lang } from "@/lib/i18n";
import { mapDict } from "@/lib/i18n/map";
import { weatherDict } from "@/lib/i18n/weather";
import { compassFrom, describeSymbol, yrUrl, type SymbolInfo, type WeatherForecast } from "@/lib/weather";
import s from "./conditions.module.css";

type Size = "lg" | "sm";

function useAvalanche(slug: string, lang: Lang): AvalancheForecast | null {
  const [forecast, setForecast] = useState<AvalancheForecast | null>(null);
  useEffect(() => {
    // Et sent svar for en topp leseren alt har forlatt, skal ikke tegnes.
    let current = true;
    fetch(`/api/skredvarsel?${new URLSearchParams({ tur: slug, lang })}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: AvalancheForecast | null) => {
        if (current) setForecast(data);
      })
      .catch(() => {
        if (current) {
          setForecast({ state: "unavailable", level: null, regionName: null, mainText: null, date: "" });
        }
      });
    return () => {
      current = false;
    };
  }, [slug, lang]);
  return forecast;
}

function useWeather(slug: string): WeatherForecast | null {
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  useEffect(() => {
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
  return forecast;
}

/** Ikonet for et værsymbol. Én gren per familie og ingen tabell over
 *  komponenter: en komponent valgt ved oppslag under rendring er en ny
 *  komponent for React hver gang. */
function SymbolIcon({ info, size }: { info: SymbolInfo | null; size: number }) {
  const p = { className: s.icon, size, strokeWidth: 1.5, "aria-hidden": true } as const;
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

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export function AvalancheCard({ slug, lang, size = "lg" }: { slug: string; lang: Lang; size?: Size }) {
  const t = mapDict(lang);
  const forecast = useAvalanche(slug, lang);
  const level = forecast?.state === "level" ? forecast.level : null;
  const colors = level ? DANGER_COLORS[level] : null;

  const varsom = (
    <a href="https://varsom.no" target="_blank" rel="noreferrer">
      Varsom
    </a>
  );

  if (level && colors) {
    /* Teksten på de lyse gradene står i blekk, ikke i Varsoms mørkeblå. */
    const fg = colors.fg.toLowerCase() === "#ffffff" ? "#fff" : "var(--color-ink)";
    return (
      <div
        className={s.card}
        data-size={size}
        data-tone="danger"
        style={{ background: colors.bg, color: fg }}
        title={forecast?.mainText ?? undefined}
      >
        <span className={s.big}>{level}</span>
        <span className={s.text}>
          <strong>{t.dangerShort(t.dangerLevels[level - 1])}</strong>
          <span className={s.sub}>
            {forecast?.regionName ? <>{forecast.regionName} · </> : null}
            {varsom}
          </span>
        </span>
      </div>
    );
  }

  const message =
    forecast === null
      ? t.dangerLoading
      : forecast.state === "notAssessed"
        ? t.dangerNotAssessed
        : forecast.state === "outsideRegion"
          ? t.dangerOutsideRegion
          : t.dangerUnavailable;

  return (
    <div className={s.card} data-size={size} data-tone="quiet" aria-live="polite">
      <span className={s.text}>
        <strong>{t.avalancheTitle}</strong>
        <span className={s.sub}>
          {message} {varsom}
        </span>
      </span>
    </div>
  );
}

export function WeatherCard({
  slug,
  lat,
  lng,
  lang,
  size = "lg",
}: {
  slug: string;
  lat: number;
  lng: number;
  lang: Lang;
  size?: Size;
}) {
  const t = weatherDict(lang);
  const forecast = useWeather(slug);
  const locale = lang === "en" ? "en-GB" : "nb-NO";
  const yr = (
    <a href={yrUrl(lat, lng, lang)} target="_blank" rel="noreferrer" className={s.yr}>
      {t.yr}
    </a>
  );

  if (forecast?.state !== "ok") {
    return (
      <div className={s.card} data-size={size} data-tone={size === "lg" ? "card" : "tint"} aria-live="polite">
        <span className={s.text}>
          <strong>{t.title}</strong>
          <span className={s.sub}>
            {forecast === null ? t.loading : t.unavailable} {yr}
          </span>
        </span>
      </div>
    );
  }

  const info = describeSymbol(forecast.now.symbol, lang);
  const temp = Math.round(forecast.now.temperature).toLocaleString(locale);
  const wind = capitalize(
    t.windNow(
      forecast.now.windSpeed.toLocaleString(locale, { maximumFractionDigits: 0 }),
      compassFrom(forecast.now.windFrom, lang),
    ),
  );

  return (
    <div
      className={s.card}
      data-size={size}
      data-tone={size === "lg" ? "card" : "tint"}
      title={t.note}
    >
      {size === "lg" ? <SymbolIcon info={info} size={28} /> : null}
      <span className={s.big}>{temp}°</span>
      <span className={s.text} data-muted>
        <span>
          {t.onSummitNow}
          {info ? `, ${info.text.toLowerCase()}` : ""}
        </span>
        <span>
          {wind} · {yr}
        </span>
      </span>
    </div>
  );
}
