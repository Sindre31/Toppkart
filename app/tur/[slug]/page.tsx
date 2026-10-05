import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Lock } from "lucide-react";

import { Blueprint } from "@/components/Blueprint";
import { CapsText } from "@/components/CapsText";
import { JsonLd } from "@/components/JsonLd";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { ElevationProfile } from "@/components/guide/ElevationProfile";
import { GuidePreview, GuideSections } from "@/components/guide/GuideSections";
import { LockedGuide } from "@/components/guide/LockedGuide";
import { OfflineSave } from "@/components/guide/OfflineSave";
import { RouteMap } from "@/components/guide/RouteMap";
import { WeatherPanel } from "@/components/weather/WeatherPanel";
import { getViewer } from "@/lib/access";
import { SITE } from "@/lib/config";
import { guideSlugs } from "@/lib/guides";
import { OG_IMAGE } from "@/lib/seo";
import { breadcrumbJsonLd, tourJsonLd } from "@/lib/structured-data";
import { getLang } from "@/lib/i18n/server";
import { commonDict } from "@/lib/i18n/common";
import { getLocalizedGuide, localizeTour, localizeTours, teaserFor } from "@/lib/i18n/content";
import { elevationLabel, gradeLabel } from "@/lib/i18n/format";
import { guideDict } from "@/lib/i18n/guide";
import { getTour, regionAnchor, routeProfile, routesFor, toursInRegion } from "@/lib/tours";
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
  const { hasAccess } = await getViewer();
  const t = guideDict(lang);
  /* Rutas egen geometri — den samme linja `/kart` tegner. `RouteMap` bruker den
     til figuren over høydeprofilen; hver av de 86 sidene får sin egen. */
  const route = routeProfile(source);
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
      {/* Det samme sida viser, i den formen en søkerobot ikke trenger å tolke:
          artikkelen, fjellet med koordinater og høyde, og — for den som ikke
          har abonnement — hvor betalingsmuren står. Se `lib/structured-data.ts`.

          Brødsmulene går innom regionen, fordi `/turer#lyngen` er en ekte
          destinasjon lista allerede lenker til fra hoppmenyen sin, ikke et
          mellomledd oppfunnet for anledningen. */}
      <JsonLd
        data={[
          tourJsonLd({ tour, guide, lang, locked: !hasAccess }),
          breadcrumbJsonLd([
            { name: SITE.name, path: "/" },
            { name: commonDict(lang).tours, path: "/turer" },
            { name: tour.region, path: `/turer#${regionAnchor(source.region)}` },
            { name: tour.name },
          ]),
        ]}
      />

      <SiteNav lang={lang} />

      {/* `data-access` er det «Lagre offline» sjekker i sida den henter: den
          svarer 200 også når økta har gått ut, og da med den låste guiden. */}
      <main
        className="page page-narrow"
        style={{ paddingBottom: 64 }}
        data-access={hasAccess ? "open" : "locked"}
      >
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
              /* `target="_blank"` selv om `download` allerede sier at dette er
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
                 den. */
              <a
                className="btn btn-primary"
                href={`/api/gpx/${tour.slug}`}
                download={`${tour.slug}.gpx`}
                target="_blank"
                rel="noopener"
              >
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
            {hasAccess && route ? (
              <OfflineSave
                slug={tour.slug}
                name={tour.name}
                region={tour.region}
                lines={offlineLines(source)}
                lang={lang}
              />
            ) : null}
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

        {/* Været på toppen, rett under nøkkeltallene: det er det neste man
            spør om etter «hvor høyt og hvor langt» — og det avgjør om turen
            blir i dag. Åpent for alle, som på kartet. */}
        <section style={{ padding: "0 0 40px" }}>
          <Blueprint style={{ padding: "18px 20px" }}>
            <WeatherPanel
              slug={tour.slug}
              lat={tour.lat}
              lng={tour.lng}
              lang={lang}
              heading="h2"
            />
          </Blueprint>
        </section>

        <section className={styles.split}>
          {route && (
            <RouteMap
              peak={tour.name}
              points={route.points}
              distanceM={route.distanceM}
              gainM={route.gainM}
              trailhead={route.trailhead}
              lang={lang}
            >
              <Link href={mapHref}>{t.routeMapCaptionLink}</Link>.
            </RouteMap>
          )}

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

        {guide &&
          (hasAccess ? (
            <GuideSections guide={guide} lang={lang} />
          ) : (
            <>
              <GuidePreview guide={guide} lang={lang} />
              <LockedGuide lang={lang} />
            </>
          ))}

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

        <SiteFooter lang={lang} />
      </main>
    </div>
  );
}
