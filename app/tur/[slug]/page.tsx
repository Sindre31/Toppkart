import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Lock } from "lucide-react";

import { Blueprint } from "@/components/Blueprint";
import { CapsText } from "@/components/CapsText";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { ElevationProfile } from "@/components/guide/ElevationProfile";
import { GuideSections } from "@/components/guide/GuideSections";
import { LockedGuide } from "@/components/guide/LockedGuide";
import { getViewer } from "@/lib/access";
import { SITE } from "@/lib/config";
import { guideSlugs } from "@/lib/guides";
import { OG_IMAGE } from "@/lib/seo";
import { getLang } from "@/lib/i18n/server";
import { getLocalizedGuide, localizeTour, localizeTours, teaserFor } from "@/lib/i18n/content";
import { elevationLabel, gradeLabel } from "@/lib/i18n/format";
import { guideDict } from "@/lib/i18n/guide";
import { getTour, toursInRegion } from "@/lib/tours";
import styles from "./guide.module.css";

/** Turguiden. Kart, nøkkeltall og høydeprofil er åpne for alle; rute-
 *  beskrivelse, nedkjøring, skredterreng og GPX ligger bak abonnement
 *  (`getViewer().hasAccess`).
 *
 *  The page reads two cookies — the viewer's subscription and `tk_lang` — so it
 *  renders per request. `generateStaticParams` is kept for the route's params
 *  contract, but nothing here was prerenderable before either: `getViewer()`
 *  has always made the guide dynamic. */

export function generateStaticParams(): { slug: string }[] {
  return guideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lang = await getLang();
  const tour = getTour(slug);
  if (!tour) return { title: guideDict(lang).notFoundTitle, robots: { index: false } };

  // Peak and region are proper nouns — the title is identical in both.
  const title = `${tour.name}, ${tour.region}`;
  const description = getLocalizedGuide(slug, lang)?.intro ?? teaserFor(slug, lang);
  const path = `/tur/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    /* Egen `openGraph` her, ikke arven fra rotlayouten: en delt guidelenke skal
       vise fjellet den handler om. Bildet må gjentas — Next erstatter hele
       `openGraph`-objektet når en side setter sitt eget. */
    openGraph: {
      type: "article",
      siteName: SITE.name,
      locale: lang === "en" ? "en_GB" : "nb_NO",
      title: `${SITE.name} — ${title}`,
      description,
      url: path,
      images: [{ ...OG_IMAGE, alt: title }],
    },
  };
}

export default async function TourGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lang = await getLang();
  const source = getTour(slug);
  if (!source) notFound();

  const tour = localizeTour(source, lang);
  const guide = getLocalizedGuide(slug, lang);
  const { hasAccess } = await getViewer();
  const t = guideDict(lang);
  const mapHref = `/kart?tur=${tour.slug}`;
  const neighbours = localizeTours(toursInRegion(source.region, source.slug), lang);

  const stats: { label: string; value: string }[] = [
    { label: t.statSummit, value: elevationLabel(tour.summitM, lang) },
    { label: t.statVertical, value: `↑ ${tour.verticalM} m` },
    { label: t.statTime, value: tour.duration },
    { label: t.statGrade, value: gradeLabel(tour.grade, lang) },
    { label: t.statAspect, value: tour.aspect },
  ];

  return (
    <div className="shell">
      <SiteNav lang={lang} />

      <main className="page page-narrow" style={{ paddingBottom: 64 }}>
        <header style={{ padding: "48px 0 32px" }}>
          <Link href={mapHref} style={{ fontSize: 13, textDecoration: "none" }}>
            {t.backToMap}
          </Link>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 20, flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: 13,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 600,
                color: "var(--color-accent-700)",
              }}
            >
              <CapsText>{tour.region}</CapsText>
            </span>
            <span
              className="tag tag-accent"
              style={{ letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}
            >
              {gradeLabel(tour.grade, lang)}
            </span>
            <span className="tag tag-neutral" style={{ letterSpacing: "0.06em", textTransform: "uppercase" }}>
              {t.seasonPrefix} {tour.season}
            </span>
          </div>
          <h1 className="display" style={{ fontSize: "clamp(44px, 6vw, 76px)", margin: "10px 0 0 -0.052em" }}>
            <CapsText>{tour.name}</CapsText>
          </h1>
          <p className="lede" style={{ margin: "18px 0 0" }}>
            {guide?.intro ?? tour.teaser}
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 22 }}>
            {hasAccess ? (
              <a className="btn btn-primary" href={`/api/gpx/${tour.slug}`} download={`${tour.slug}.gpx`}>
                {t.downloadGpx}
              </a>
            ) : (
              /* Uten abonnement er nedlastingen stengt både her og i API-et —
                 knappen leder dit tilgangen kjøpes. */
              <Link
                className="btn btn-secondary"
                href="/betaling"
                aria-label={t.downloadGpxLocked}
                title={t.requiresSubscription}
              >
                <Lock size={14} strokeWidth={1.5} />
                {t.downloadGpx}
              </Link>
            )}
            <Link className="btn btn-secondary" href={mapHref}>
              {t.openInMap}
            </Link>
          </div>
        </header>

        <section style={{ padding: "0 0 40px" }}>
          <Blueprint>
            {/* `min(150px, 100%)` so the two stat columns can fall below their
                floor on a narrow phone instead of widening the page. */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(150px, 100%), 1fr))",
              }}
            >
              {stats.map((s) => (
                <div
                  key={s.label}
                  style={{
                    padding: "14px 18px",
                    borderRight: "1px solid var(--color-divider)",
                    borderBottom: "1px solid var(--color-divider)",
                  }}
                >
                  <div className="stat-l">
                    <CapsText>{s.label}</CapsText>
                  </div>
                  <div className="stat-v" style={{ fontSize: 24 }}>
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          </Blueprint>
        </section>

        <section className={styles.split}>
          <Blueprint as="figure" className="duotone" style={{ margin: 0 }}>
            <Image
              src="/assets/kontur.png"
              alt={t.mapImageAlt(tour.name)}
              width={1500}
              height={1000}
              priority
              style={{ width: "100%", height: "auto", aspectRatio: "3 / 2", objectFit: "cover" }}
            />
            <figcaption style={{ padding: "8px 2px 0" }}>
              {t.figureCaption}
              <Link href={mapHref}>{t.figureCaptionLink}</Link>.
            </figcaption>
          </Blueprint>

          {guide ? (
            <ElevationProfile profile={guide.elevationProfile} lang={lang} />
          ) : (
            <Blueprint style={{ padding: "18px 20px" }}>
              <h2 style={{ fontSize: 18, letterSpacing: "0.02em", textTransform: "uppercase", margin: "0 0 12px" }}>
                {t.guidePendingTitle}
              </h2>
              <p className="note" style={{ margin: 0 }}>
                {t.guidePendingBody}
              </p>
            </Blueprint>
          )}
        </section>

        {guide && (hasAccess ? <GuideSections guide={guide} lang={lang} /> : <LockedGuide lang={lang} />)}

        {/* Naboturene. Regionen er den eneste slektskapen datasettet kjenner, og
            den er nok: den som leser om Slogen er som regel i ferd med å legge
            en uke i Sunnmørsalpene, ikke å velge mellom Slogen og Gaustatoppen.
            At de også gir hver guide inngående lenker fra sine naboer er en
            bivirkning — men det var mangelen på dem som var problemet. */}
        {neighbours.length > 0 && (
          <section className={styles.neighbours}>
            <h2 className="kicker">
              <CapsText>{t.moreInRegion(tour.region)}</CapsText>
            </h2>
            <hr className="kicker-rule" />
            <ul className={styles.neighbourList}>
              {neighbours.map((peak) => (
                <li key={peak.slug}>
                  <Link href={`/tur/${peak.slug}`}>
                    <CapsText>{peak.name}</CapsText>
                  </Link>
                  <span className="note">
                    {elevationLabel(peak.summitM, lang)} · {gradeLabel(peak.grade, lang)}
                  </span>
                </li>
              ))}
            </ul>
            <Link className="btn btn-secondary" href="/turer">
              {t.allTours}
            </Link>
          </section>
        )}

        <SiteFooter lang={lang}>
          <span className="push">{t.footerNote}</span>
        </SiteFooter>
      </main>
    </div>
  );
}
