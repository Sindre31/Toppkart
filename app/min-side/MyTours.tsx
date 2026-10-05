import Link from "next/link";

import { SectionKicker } from "@/components/Blueprint";
import { CapsText } from "@/components/CapsText";
import { formatDate } from "@/lib/dates";
import type { Lang } from "@/lib/i18n";
import { localizeTours } from "@/lib/i18n/content";
import { marksDict } from "@/lib/i18n/marks";
import { doneTotals, type TourMark } from "@/lib/tour-marks";
import { getTour } from "@/lib/tours";

const MUTED_60 = "color-mix(in srgb, var(--color-text) 60%, transparent)";

/** «03 · Mine turer»: favorittene og turene leseren har gått.
 *
 *  Bare lister og lenker. Markeringene endres der turen står — på guiden og i
 *  kartpanelet — så det finnes ett sted å trykke og ingen to knapper som kan
 *  komme i utakt. `marks` er null når lista ikke kunne hentes; da sier delen
 *  det, i stedet for å se ut som en tom liste. */
export function MyTours({ marks, lang }: { marks: TourMark[] | null; lang: Lang }) {
  const t = marksDict(lang);

  const known = (marks ?? [])
    .map((mark) => ({ mark, tour: getTour(mark.slug) }))
    .filter((x): x is { mark: TourMark; tour: NonNullable<typeof x.tour> } => Boolean(x.tour));
  const localized = new Map(
    localizeTours(
      known.map((x) => x.tour),
      lang,
    ).map((tour) => [tour.slug, tour]),
  );

  const favorites = known
    .filter((x) => x.mark.favorite)
    .sort((a, b) => a.tour.name.localeCompare(b.tour.name, "nb"));
  const done = known
    .filter((x) => x.mark.doneOn)
    .sort((a, b) => b.mark.doneOn!.localeCompare(a.mark.doneOn!));
  const totals = doneTotals(marks ?? [], (slug) => getTour(slug)?.verticalM);
  const vertical = totals.verticalM.toLocaleString(lang === "en" ? "en-GB" : "nb-NO");

  const row = (slug: string, aside: string) => {
    const tour = localized.get(slug)!;
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
      <SectionKicker>{t.kicker}</SectionKicker>
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
                {favorites.map(({ tour }) => {
                  const l = localized.get(tour.slug)!;
                  return row(tour.slug, `${l.region} · ↑ ${l.verticalM} m`);
                })}
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
