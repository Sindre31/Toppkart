import type { Metadata } from "next";
import Link from "next/link";

import { Blueprint } from "@/components/Blueprint";
import { AccountNav, SiteFooter, SiteNav } from "@/components/SiteChrome";
import { getLang } from "@/lib/i18n/server";
import { commonDict } from "@/lib/i18n/common";
import { localizeTours } from "@/lib/i18n/content";
import { durationLabel, elevationLabel, gradeLabel, seasonLabel } from "@/lib/i18n/format";
import { toursDict } from "@/lib/i18n/tours";
import { regionAnchor, toursByRegion } from "@/lib/tours";
import styles from "./turer.module.css";

/** `/turer` — hver tur som en vanlig lenke, gruppert på region.
 *
 *  Kartet er den morsomme veien inn, men det er også en JavaScript-flate:
 *  lenka til en turguide finnes først når noen har trukket opp en topp i
 *  detaljpanelet. En crawler klikker ikke, og en leser som vil bla gjennom
 *  utvalget uten å dra i et kart hadde ingen side å gjøre det på. Resultatet
 *  var 39 guider uten en eneste inngående lenke fra nettstedet selv — funnet
 *  bare gjennom sitemap-et, som sier at de finnes og ingenting om hva de er.
 *
 *  Derfor er dette bevisst enkelt: statisk HTML, `<a>`-er med fjellnavnet som
 *  lenketekst, og regionen som overskrift over dem. Det er samtidig den eneste
 *  sida på nettstedet som kan svare på «toppturer i Lyngen» — kartet kan det
 *  ikke, fordi innholdet der aldri står i kildekoden.
 */

export async function generateMetadata(): Promise<Metadata> {
  const t = toursDict(await getLang());
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: { canonical: "/turer" },
  };
}

export default async function TurerPage() {
  const lang = await getLang();
  const t = toursDict(lang);
  const common = commonDict(lang);

  /* Grupperinga er språknøytral — regionene er egennavn — så turene lokaliseres
     etter at de er delt opp, ikke før. */
  const groups = toursByRegion().map(({ region, tours }) => ({
    region,
    anchor: regionAnchor(region),
    tours: localizeTours(tours, lang),
  }));
  const total = groups.reduce((sum, group) => sum + group.tours.length, 0);

  return (
    <div className="shell">
      <SiteNav lang={lang}>
        <Link href="/turer" aria-current="page">
          {common.tours}
        </Link>
        <Link href="/kart">{common.map}</Link>
        <AccountNav lang={lang} />
      </SiteNav>

      <main className="page" style={{ paddingBottom: 64 }}>
        <header style={{ padding: "48px 0 40px" }}>
          <span className="kicker">{t.kicker}</span>
          <hr className="kicker-rule" />
          <h1 className="display" style={{ fontSize: "clamp(40px, 5.5vw, 72px)" }}>
            {t.heading}
          </h1>
          <p className="lede" style={{ margin: "18px 0 0" }}>
            {t.lede(total, groups.length)}
          </p>
          <div style={{ marginTop: 24 }}>
            <Link className="btn btn-secondary" href="/kart">
              {t.openMap}
            </Link>
          </div>

          {/* Snarveiene ned i sida. På en 39-raders liste er det forskjellen på
              å bla og å lete — og hvert anker er samtidig en lenke Google kan
              følge til riktig del av lista. */}
          <nav className={styles.jump} aria-label={t.regionsLabel}>
            {groups.map((group) => (
              <a key={group.anchor} className={styles.jumpItem} href={`#${group.anchor}`}>
                {group.region}
                <span className={styles.jumpCount}>{group.tours.length}</span>
              </a>
            ))}
          </nav>
        </header>

        {groups.map((group) => (
          <section key={group.anchor} style={{ padding: "0 0 48px" }}>
            {/* `.kicker` er ellers en `<span>` (se `SectionKicker`). Her er
                regionen den faktiske overskrifta over turene sine, så den skal
                være en `<h2>` — samme utseende, riktig dokumentstruktur. */}
            <h2 className="kicker" id={group.anchor} style={{ scrollMarginTop: 80 }}>
              {group.region}
              <span className={styles.regionCount}>{t.tourCount(group.tours.length)}</span>
            </h2>
            <hr className="kicker-rule" />

            <div className="grid-auto">
              {group.tours.map((tour) => (
                <Blueprint as="article" key={tour.slug} className={styles.card}>
                  <h3 className="h-cell">
                    <Link className={styles.cardLink} href={`/tur/${tour.slug}`}>
                      {tour.name}
                    </Link>
                  </h3>
                  <div className={styles.tags}>
                    <span className="tag tag-accent">{gradeLabel(tour.grade, lang)}</span>
                    <span className="tag tag-neutral">
                      {t.seasonPrefix} {seasonLabel(tour.season, lang)}
                    </span>
                  </div>
                  <p className="prose" style={{ margin: 0 }}>
                    {tour.teaser}
                  </p>
                  <dl className={styles.stats}>
                    <div>
                      <dt className="stat-l">{t.statSummit}</dt>
                      <dd className="stat-v">{elevationLabel(tour.summitM, lang)}</dd>
                    </div>
                    <div>
                      <dt className="stat-l">{t.statVertical}</dt>
                      <dd className="stat-v">↑ {tour.verticalM} m</dd>
                    </div>
                    <div>
                      <dt className="stat-l">{t.statTime}</dt>
                      <dd className="stat-v">{durationLabel(tour.duration, lang)}</dd>
                    </div>
                  </dl>
                </Blueprint>
              ))}
            </div>
          </section>
        ))}
      </main>

      <SiteFooter lang={lang} />
    </div>
  );
}
