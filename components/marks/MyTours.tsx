"use client";

import Link from "next/link";

import { formatDate } from "@/lib/dates";
import type { Lang } from "@/lib/i18n";
import { marksDict } from "@/lib/i18n/marks";
import { doneTotals, type TourMark } from "@/lib/tour-marks";
import { useTourMarks } from "./useTourMarks";
import s from "./MyTours.module.css";

/** Det lista trenger å vite om en tur — ferdig oversatt av serveren, så
 *  turkatalogen med all geometrien blir liggende der. */
export interface MyTourInfo {
  slug: string;
  name: string;
  region: string;
  verticalM: number;
}

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
      <li key={slug}>
        <Link href={`/tur/${slug}`} className={s.row}>
          <span className={s.name}>{tour.name}</span>
          <span className={s.aside}>{aside}</span>
        </Link>
      </li>
    );
  };

  return (
    <section className={s.section}>
      {marks === null ? (
        <p className={s.empty}>{t.unavailable}</p>
      ) : (
        <div className={s.grid}>
          <div className={s.card}>
            <h2 className={s.heading}>{t.favoritesTitle}</h2>
            {favorites.length ? (
              <ul className={s.list}>
                {favorites.map(({ tour }) => row(tour.slug, `${tour.region} · ↑ ${tour.verticalM} m`))}
              </ul>
            ) : (
              <p className={s.empty}>{t.emptyFavorites}</p>
            )}
          </div>
          <div className={s.card}>
            <h2 className={s.heading}>{t.doneTitle}</h2>
            {done.length ? (
              <>
                <p className={s.totals}>{t.doneTotals(totals.count, vertical)}</p>
                <ul className={s.list}>
                  {done.map(({ tour, mark }) => row(tour.slug, formatDate(mark.doneOn!, lang)))}
                </ul>
              </>
            ) : (
              <p className={s.empty}>{t.emptyDone}</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
