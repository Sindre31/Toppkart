import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, Map as MapIcon } from "lucide-react";

import { Blueprint } from "@/components/Blueprint";
import { CapsText } from "@/components/CapsText";
import { JsonLd } from "@/components/JsonLd";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { ElevationProfile } from "@/components/guide/ElevationProfile";
import { GUIDE_ANCHORS, GuideHeading, GuideSections } from "@/components/guide/GuideSections";
import { GuideToc } from "@/components/guide/GuideToc";
import { distanceLabel } from "@/components/guide/RouteMap";
import { OfflineSave } from "@/components/guide/OfflineSave";
import { GuideMarks } from "@/components/marks/GuideMarks";
import { GuideMap } from "@/components/guide/GuideMap";
import { PeakPhoto } from "@/components/PeakPhoto";
import { WeatherPanel } from "@/components/weather/WeatherPanel";
import { AvalanchePanel } from "@/app/kart/AvalanchePanel";
import { SITE } from "@/lib/config";
import { guideSlugs } from "@/lib/guides";
import { OG_IMAGE } from "@/lib/seo";
import { breadcrumbJsonLd, tourJsonLd } from "@/lib/structured-data";
import { getLang } from "@/lib/i18n/server";
import { getLocalizedGuide, localizeTour, localizeTours, teaserFor } from "@/lib/i18n/content";
import { elevationLabel, gradeLabel } from "@/lib/i18n/format";
import { guideDict } from "@/lib/i18n/guide";
import { photoFor } from "@/lib/peak-photos";
import { getTour, routeProfile, routesFor, toursInRegion } from "@/lib/tours";
import styles from "./guide.module.css";

/** Turguiden. Alt er åpent for alle — kart, nøkkeltall, høydeprofil,
 *  rutebeskrivelse, nedkjøring, skredterreng og GPX. Toppkart er gratis.
 *
 *  The page reads the `tk_lang` cookie, so it renders per request.
 *  `generateStaticParams` is kept for the route's params contract. */

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
  /* Ukjent slug: `notFound()` her, ikke en tittel å rendre videre med.
   *
   *  `/tur/finnesikke` svarte `200 OK`. Riktig side kom fram — «Turen finnes
   *  ikke», `noindex` og det hele — men statuslinja sa at alt var i orden, og
   *  det er en myk 404. `/tur/*` er et ubegrenset URL-rom, så hver skrivefeil,
   *  hver avkortede lenke og hvert bortkomne søkeord under `/tur/` var en
   *  gyldig side å hente. Bing teller slikt som vår feil, og en katalog full
   *  av dem er en katalog det ikke lønner seg å krype — som er nøyaktig det
   *  «Discovered but not crawled» beskriver.
   *
   *  Grunnen til at `notFound()` i sidekomponenten ikke satte koden er
   *  rot-`loading.tsx`: en `loading`-grense gjør ruta til en Suspense-grense,
   *  og da strømmer Next svaret. Hodet er sendt — med `200` — før
   *  sidekomponenten har rukket å slå opp slug-en, og kastet kan bare bytte
   *  ut innholdet, ikke koden som allerede er ute.
   *
   *  Her i `generateMetadata` var rettelsen en stund ment å sitte, ut fra at
   *  `<head>` må være ferdig før den første byten. Det holdt ikke: med Next
   *  16.3 svarte også dette `200`, for alle brukeragenter, Bingbot og
   *  Googlebot med. Statusen settes nå i middleware, før noe rendres — se
   *  `unknownTour()` i `middleware.ts` og `docs/seo.md`.
   *
   *  Kallet står likevel. Det er det som gir riktig *innhold* — 404-sida og
   *  ikke en tittel å rendre videre med — og det er det som slår inn hvis
   *  slug-lista til middleware av en eller annen grunn er tom. */
  if (!tour) notFound();

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

/** Alle rutene opp som `[lat, lng]`-par, til flisene «Lagre offline» henter.
 *  Fire desimaler er ~10 m, langt under en flis på det tetteste nivået, og
 *  holder det som sendes med sida til noen få kilobyte. */
function offlineLines(tour: NonNullable<ReturnType<typeof getTour>>): [number, number][][] {
  const round = (v: number) => Math.round(v * 1e4) / 1e4;
  return routesFor(tour).map((r) => {
    const pts: [number, number][] = [];
    for (let i = 0; i < r.line.length; i += 3) pts.push([round(r.line[i]), round(r.line[i + 1])]);
    return pts;
  });
}

export default async function TourGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lang = await getLang();
  const source = getTour(slug);
  if (!source) notFound();

  const tour = localizeTour(source, lang);
  const guide = getLocalizedGuide(slug, lang);
  const t = guideDict(lang);
  /* Rutas egen geometri — den samme linja `/kart` tegner. `GuideMap` bruker den
     til kartet ved siden av høydeprofilen; hver av sidene får sitt eget. */
  const route = routeProfile(source);
  const photo = photoFor(source.slug);
  const mapHref = `/?tur=${tour.slug}`;
  const neighbours = localizeTours(toursInRegion(source.region, source.slug), lang);

  const otherRoutes = routesFor(source).slice(1);

  const stats: { label: string; value: string }[] = [
    { label: t.statSummit, value: elevationLabel(tour.summitM, lang) },
    { label: t.statVertical, value: `↑ ${tour.verticalM} m` },
    { label: t.statTime, value: tour.duration },
    { label: t.statGrade, value: gradeLabel(tour.grade, lang) },
    { label: t.statAspect, value: tour.aspect },
  ];

  /* Rekkefølgen er den samme som spørsmålene kommer i: kan jeg gå i dag, hvor
     går ruta, hvordan kommer jeg opp, hvordan kommer jeg ned, hva må jeg passe
     meg for. Nummeret i lista og i overskriftene følger av plassen her. */
  const toc = [
    { id: GUIDE_ANCHORS.conditions, label: t.conditionsTitle },
    ...(route ? [{ id: GUIDE_ANCHORS.route, label: t.routeTitle }] : []),
    ...(guide
      ? [
          { id: GUIDE_ANCHORS.ascent, label: t.ascentTitle },
          { id: GUIDE_ANCHORS.descent, label: t.descentTitle },
          { id: GUIDE_ANCHORS.avalanche, label: t.avalancheTitle },
        ]
      : []),
  ];
  const numOf = (id: string) => toc.findIndex((item) => item.id === id) + 1;

  return (
    <div className="shell">
      {/* Det samme sida viser, i den formen en søkerobot ikke trenger å tolke:
          artikkelen og fjellet med koordinater og høyde. Se
          `lib/structured-data.ts`. */}
      <JsonLd
        data={[
          tourJsonLd({ tour, guide, lang }),
          breadcrumbJsonLd([
            { name: SITE.name, path: "/" },
            { name: tour.name },
          ]),
        ]}
      />

      <SiteNav lang={lang} />

      {/* `data-access` er det «Lagre offline» sjekker i sida den henter. */}
      <main className={`page page-narrow ${styles.main}`} data-access="open">
        <header className={styles.header}>
          <Link href={mapHref} className={styles.back}>
            {t.backToMap}
          </Link>
          <div className={styles.tags}>
            <span className={styles.region}>
              <CapsText>{tour.region}</CapsText>
            </span>
            <span className={`tag tag-accent ${styles.tag}`}>{gradeLabel(tour.grade, lang)}</span>
            <span className={`tag tag-neutral ${styles.tag}`}>
              {t.seasonPrefix} {tour.season}
            </span>
          </div>
          <h1 className={`display ${styles.title}`}>
            <CapsText>{tour.name}</CapsText>
          </h1>
          <p className={`lede ${styles.lede}`}>{guide?.intro ?? tour.teaser}</p>

          {/* To rader med to slags handlinger. Den første er det man tar med
              seg på tur: fila, kartet og en kopi uten dekning. Den andre er
              leserens egen logg. Før sto alle fem på én rad med lik vekt, og
              på en telefon brøt de om tilfeldig. */}
          <div className={styles.actions}>
            {/* `target="_blank"` selv om `download` allerede sier at dette er
               en fil og ikke en side.

               På skrivebordet er det ingen forskjell: nettleseren laster ned
               og blir stående. På telefon er det ikke gitt. Mange
               mobilnettlesere — og hver eneste innebygde nettleser i en app —
               behandler `application/gpx+xml` som noe som skal *åpnes*, og
               gjør det ved å navigere dit. Da er guiden borte, og en fane som
               viser XML har verken tilbakeknapp eller navigasjon: eneste vei
               tilbake er å skrive adressa på nytt.

               Med `_blank` skjer det i en ny kontekst. Laster nettleseren ned
               fila, blir vi stående som før; åpner den den, står guiden urørt
               i fana bak. `rel="noopener"` fordi enhver `_blank` skal ha
               den. */}
            <a
              className="btn btn-primary"
              href={`/api/gpx/${tour.slug}`}
              download={`${tour.slug}.gpx`}
              target="_blank"
              rel="noopener"
            >
              <Download size={15} strokeWidth={1.75} aria-hidden="true" />
              {t.downloadGpx}
            </a>
            <Link className="btn btn-secondary" href={mapHref}>
              <MapIcon size={15} strokeWidth={1.5} aria-hidden="true" />
              {t.openInMap}
            </Link>
            {route ? (
              <OfflineSave
                slug={tour.slug}
                name={tour.name}
                region={tour.region}
                lines={offlineLines(source)}
                lang={lang}
              />
            ) : null}
          </div>
          <div className={styles.marks}>
            <GuideMarks slug={tour.slug} lang={lang} />
          </div>
        </header>

        {photo ? (
          <section className={styles.block}>
            <PeakPhoto photo={photo} peak={tour.name} lang={lang} aspect="21 / 9" priority />
          </section>
        ) : null}

        <section className={styles.block}>
          <Blueprint>
            <div className={styles.stats}>
              {stats.map((s) => (
                <div key={s.label} className={styles.stat}>
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

        <GuideToc items={toc} label={t.tocLabel} />

        {/* Forholdene først, rett under nøkkeltallene: «kan jeg gå i dag» er
            det neste man spør om etter «hvor høyt og hvor langt». Skredfaren
            sto før bare i kartpanelet, så den som kom rett inn på guiden — fra
            et søk eller en delt lenke — fikk været og ikke varselet. */}
        <section id={GUIDE_ANCHORS.conditions} className={styles.section}>
          <GuideHeading num={numOf(GUIDE_ANCHORS.conditions)}>{t.conditionsTitle}</GuideHeading>
          <div className={styles.conditions}>
            <Blueprint style={{ padding: "18px 20px" }}>
              <AvalanchePanel slug={tour.slug} lang={lang} heading="h3" className={styles.panel} />
            </Blueprint>
            <Blueprint style={{ padding: "18px 20px" }}>
              <WeatherPanel
                slug={tour.slug}
                lat={tour.lat}
                lng={tour.lng}
                lang={lang}
                heading="h3"
              />
            </Blueprint>
          </div>
          <p className="note" style={{ margin: "16px 0 0" }}>
            {t.conditionsNote}
          </p>
        </section>

        {route ? (
          <section id={GUIDE_ANCHORS.route} className={styles.section}>
            <GuideHeading num={numOf(GUIDE_ANCHORS.route)}>{t.routeTitle}</GuideHeading>
            <GuideMap
              peak={tour.name}
              points={route.points}
              distanceM={route.distanceM}
              gainM={route.gainM}
              trailhead={route.trailhead}
              lang={lang}
            >
              <Link href={mapHref}>{t.routeMapCaptionLink}</Link>.
            </GuideMap>

            <div className={styles.split}>
              {guide ? <ElevationProfile profile={guide.elevationProfile} lang={lang} /> : null}

              {/* Det man trenger for å finne fram til start: hvor, hvor langt og
                  hvor mye opp. Og de andre veiene opp, som ellers bare fantes i
                  rutevelgeren på kartet. */}
              <Blueprint style={{ padding: "18px 20px" }}>
                <dl className={styles.facts}>
                  <div>
                    <dt className="stat-l">
                      <CapsText>{t.routeStart}</CapsText>
                    </dt>
                    <dd>{route.trailhead}</dd>
                  </div>
                  <div>
                    <dt className="stat-l">
                      <CapsText>{t.routeLength}</CapsText>
                    </dt>
                    <dd>{distanceLabel(route.distanceM, lang)}</dd>
                  </div>
                  <div>
                    <dt className="stat-l">
                      <CapsText>{t.routeGain}</CapsText>
                    </dt>
                    <dd>↑ {route.gainM} m</dd>
                  </div>
                </dl>
                {otherRoutes.length > 0 ? (
                  <>
                    <h3 className={styles.otherHead}>
                      <CapsText>{t.otherRoutesTitle}</CapsText>
                    </h3>
                    <ul className={styles.otherList}>
                      {otherRoutes.map((r) => (
                        <li key={r.id}>
                          <span className={styles.otherName}>{r.name}</span>
                          <span className="note">
                            ↑ {r.gainM} m · {distanceLabel(r.distanceM, lang)} · {r.trailhead}
                          </span>
                          <Link href={`${mapHref}&rute=${encodeURIComponent(r.id)}`}>
                            {t.otherRouteLink} →
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </Blueprint>
            </div>
          </section>
        ) : null}

        {guide ? (
          <GuideSections guide={guide} lang={lang} firstNum={numOf(GUIDE_ANCHORS.ascent)} />
        ) : (
          <section className={styles.section}>
            <Blueprint style={{ padding: "18px 20px" }}>
              <h2 style={{ fontSize: 18, letterSpacing: "0.02em", textTransform: "uppercase", margin: "0 0 12px" }}>
                {t.guidePendingTitle}
              </h2>
              <p className="note" style={{ margin: 0 }}>
                {t.guidePendingBody}
              </p>
            </Blueprint>
          </section>
        )}

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
          </section>
        )}

        <SiteFooter lang={lang} />
      </main>
    </div>
  );
}
