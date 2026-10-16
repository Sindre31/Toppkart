"use client";

import Link from "next/link";

import { CapsText } from "@/components/CapsText";
import { formatDate } from "@/lib/dates";
import type { Lang } from "@/lib/i18n";
import { marksDict } from "@/lib/i18n/marks";
import { doneTotals, type TourMark } from "@/lib/tour-marks";
import { useTourMarks } from "./useTourMarks";

/** Det lista trenger å vite om en tur — ferdig oversatt av serveren, så
 *  turkatalogen med all geometrien blir liggende der. */
export interface MyTourInfo {
  slug: string;
  name: string;
  region: string;
  verticalM: number;
}

const MUTED_60 = "color-mix(in srgb, var(--color-text) 60%, transparent)";

/** Favorittene og turene leseren har gått, på `/mine-turer`.
 *
 *  Bare lister og lenker. Markeringene endres der turen står — på guiden og i
 *  kartpanelet — så det finnes ett sted å trykke og ingen to knapper som kan
 *  komme i utakt. Lista leses fra enheten; kan den ikke leses, sier delen det,
 *  i stedet for å se ut som en tom liste. */
export function MyTours({ tours, lang }: { tours: MyTourInfo[]; lang: Lang }) {
  const t = marksDict(lang);
  const { state } = useTourMarks();
  const bySlug = new Map(tours.map((tour) => [tour.slug, tour]));
  const marks: TourMark[] | null =
    state.status === "ready" ? [...state.marks.values()] : state.status === "unavailable" ? null : [];

  const known = (marks ?? [])
    .map((mark) => ({ mark, tour: bySlug.get(mark.slug) }))
    .filter((x): x is { mark: TourMark; tour: MyTourInfo } => Boolean(x.tour));

  const favorites = known
    .filter((x) => x.mark.favorite)
    .sort((a, b) => a.tour.name.localeCompare(b.tour.name, "nb"));
  const done = known
    .filter((x) => x.mark.doneOn)
    .sort((a, b) => b.mark.doneOn!.localeCompare(a.mark.doneOn!));
  const totals = doneTotals(marks ?? [], (slug) => bySlug.get(slug)?.verticalM);
  const vertical = totals.verticalM.toLocaleString(lang === "en" ? "en-GB" : "nb-NO");

  const row = (slug: string, aside: string) => {
    const tour = bySlug.get(slug)!;
    return (
      <li
        key={slug}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 12,
          padding: "10px 0",
          borderBottom: "1px solid var(--color-divider)",
        }}
      >
        <Link href={`/tur/${slug}`} style={{ fontWeight: 600, textDecoration: "none" }}>
          <CapsText>{tour.name}</CapsText>
        </Link>
        <span style={{ fontSize: 13, color: MUTED_60, textAlign: "right" }}>{aside}</span>
      </li>
    );
  };

  const list = { listStyle: "none", margin: "0 0 8px", padding: 0 } as const;
  const head = {
    fontSize: 16,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    margin: "0 0 6px",
  } as const;

  return (
    <section style={{ padding: "0 0 48px" }}>
      {marks === null ? (
        <p style={{ fontSize: 14, color: MUTED_60, margin: 0 }}>{t.unavailable}</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
            gap: "24px clamp(20px, 3vw, 40px)",
          }}
        >
          <div>
            <h2 style={head}>{t.favoritesTitle}</h2>
            {favorites.length ? (
              <ul style={list}>
                {favorites.map(({ tour }) => row(tour.slug, `${tour.region} · ↑ ${tour.verticalM} m`))}
              </ul>
            ) : (
              <p style={{ fontSize: 14, color: MUTED_60, margin: 0 }}>{t.emptyFavorites}</p>
            )}
          </div>
          <div>
            <h2 style={head}>{t.doneTitle}</h2>
            {done.length ? (
              <>
                <p style={{ fontSize: 13, color: MUTED_60, margin: "0 0 4px" }}>
                  {t.doneTotals(totals.count, vertical)}
                </p>
                <ul style={list}>
                  {done.map(({ tour, mark }) => row(tour.slug, formatDate(mark.doneOn!, lang)))}
                </ul>
              </>
            ) : (
              <p style={{ fontSize: 14, color: MUTED_60, margin: 0 }}>{t.emptyDone}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
