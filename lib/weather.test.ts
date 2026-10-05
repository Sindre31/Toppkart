import { describe, expect, it } from "vitest";

import {
  compassFrom,
  describeSymbol,
  summarize,
  type MetPayload,
  type MetStep,
} from "@/lib/weather";

const HOUR = 3_600_000;

/** En tidsserie med METs form: timesteg i 38 timer fra 10. januar kl. 10 UTC,
 *  så seks-timersblokker. Hvert timessteg har 0,5 mm neste time; på 00, 06,
 *  12 og 18 UTC har det i tillegg en seks-timersverdi på 3 mm — som beskriver
 *  det samme regnet og ikke skal telles med. Seks-timersblokkene etterpå har
 *  2 mm hver. Januar, så Norge er UTC+1. */
function series(): MetPayload {
  const start = Date.parse("2026-01-10T10:00:00Z");
  const steps: MetStep[] = [];
  for (let h = 0; h < 38; h++) {
    const t = new Date(start + h * HOUR);
    const hh = t.getUTCHours();
    steps.push({
      time: t.toISOString().replace(".000", ""),
      data: {
        instant: { details: { air_temperature: -h / 2, wind_speed: h === 20 ? 14 : 4, wind_from_direction: h === 20 ? 225 : 90 } },
        next_1_hours: { summary: { symbol_code: h === 0 ? "lightsnowshowers_day" : "cloudy" }, details: { precipitation_amount: 0.5 } },
        ...(hh % 6 === 0
          ? { next_6_hours: { summary: { symbol_code: "cloudy" }, details: { precipitation_amount: 3 } } }
          : {}),
        ...(hh % 6 === 0
          ? { next_12_hours: { summary: { symbol_code: hh === 6 ? "snow" : "cloudy" } } }
          : {}),
      },
    });
  }
  const sixStart = Date.parse("2026-01-12T00:00:00Z");
  for (let i = 0; i < 8; i++) {
    const t = new Date(sixStart + i * 6 * HOUR);
    steps.push({
      time: t.toISOString().replace(".000", ""),
      data: {
        instant: { details: { air_temperature: 1, wind_speed: 2, wind_from_direction: 0 } },
        next_6_hours: { summary: { symbol_code: "fair_day" }, details: { precipitation_amount: 2 } },
        next_12_hours: { summary: { symbol_code: t.getUTCHours() === 6 ? "clearsky_day" : "fair_day" } },
      },
    });
  }
  return { properties: { meta: { updated_at: "2026-01-10T09:31:00Z" }, timeseries: steps } };
}

const now = new Date("2026-01-10T10:30:00Z");

describe("summarize", () => {
  const f = summarize(series(), now, 1564.4);
  if (f.state !== "ok") throw new Error("expected a forecast");

  it("reads now from the step that has begun", () => {
    expect(f.now).toEqual({ temperature: 0, windSpeed: 4, windFrom: 90, symbol: "lightsnowshowers_day" });
    expect(f.altitude).toBe(1564);
  });

  it("splits the days on Norwegian midnight, not UTC", () => {
    expect(f.days.map((d) => d.date)).toEqual(["2026-01-10", "2026-01-11", "2026-01-12"]);
    /* I dag: 10–22 UTC er kl. 11–23 norsk tid, 13 timer. 23 UTC er i morgen. */
    expect(f.days[0].minTemp).toBe(-6);
    expect(f.days[0].maxTemp).toBe(0);
  });

  it("adds hourly precipitation without the six-hour value covering the same hours", () => {
    expect(f.days[0].precipitation).toBe(6.5);
    expect(f.days[1].precipitation).toBe(12);
  });

  it("switches to six-hour blocks where the series does", () => {
    /* 23 UTC (kl. 00) er siste timessteg, så fire blokker på 2 mm. */
    expect(f.days[2].precipitation).toBe(8.5);
  });

  it("takes the strongest wind of the day, and where it came from", () => {
    expect(f.days[1].maxWind).toBe(14);
    expect(f.days[1].maxWindFrom).toBe(225);
  });

  it("uses the twelve-hour symbol from 06 UTC for the day", () => {
    expect(f.days[1].symbol).toBe("snow");
    expect(f.days[2].symbol).toBe("clearsky_day");
  });

  it("never reports a negative zero", () => {
    const step = series().properties!.timeseries![0];
    step.data.instant.details.air_temperature = -0.04;
    const g = summarize({ properties: { meta: { updated_at: "x" }, timeseries: [step] } }, now, 0);
    expect(g.state === "ok" && Object.is(g.now.temperature, 0)).toBe(true);
  });

  it("is unavailable rather than empty when there is nothing to read", () => {
    expect(summarize({}, now, 0)).toEqual({ state: "unavailable" });
    expect(summarize({ properties: { meta: { updated_at: "x" }, timeseries: [] } }, now, 0)).toEqual({
      state: "unavailable",
    });
  });
});

describe("describeSymbol", () => {
  it("reads the sky codes", () => {
    expect(describeSymbol("clearsky_night", "no")).toEqual({ kind: "clear", night: true, text: "Klarvær" });
    expect(describeSymbol("partlycloudy_day", "en")).toEqual({ kind: "partly", night: false, text: "Partly cloudy" });
    expect(describeSymbol("fog", "no")?.text).toBe("Tåke");
  });

  it("builds precipitation from its parts", () => {
    expect(describeSymbol("lightsnow", "no")?.text).toBe("Lett snø");
    expect(describeSymbol("heavysnow", "en")?.text).toBe("Heavy snow");
    expect(describeSymbol("lightsnowshowers_day", "no")?.text).toBe("Lette snøbyger");
    expect(describeSymbol("sleetshowers_night", "en")).toEqual({ kind: "sleet", night: true, text: "Sleet showers" });
    expect(describeSymbol("heavyrainandthunder", "no")).toEqual({ kind: "thunder", night: false, text: "Kraftig regn og torden" });
  });

  it("reads MET's two misspelled codes like the rest", () => {
    expect(describeSymbol("lightssnowshowersandthunder_day", "no")?.text).toBe("Lette snøbyger og torden");
    expect(describeSymbol("lightssleetshowersandthunder_night", "en")?.text).toBe("Light sleet showers and thunder");
  });

  it("does not guess at a code it does not know", () => {
    expect(describeSymbol("volcanicash_day", "no")).toBeNull();
    expect(describeSymbol(null, "no")).toBeNull();
  });
});

describe("compassFrom", () => {
  it("names the sector the wind comes from", () => {
    expect(compassFrom(0, "no")).toBe("N");
    expect(compassFrom(359, "no")).toBe("N");
    expect(compassFrom(45, "no")).toBe("NØ");
    expect(compassFrom(210, "no")).toBe("SV");
    expect(compassFrom(210, "en")).toBe("SW");
    expect(compassFrom(-90, "en")).toBe("W");
  });
});
