import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";

import { JsonLd } from "@/components/JsonLd";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { PeakPhoto } from "@/components/PeakPhoto";
import { AvalancheCard, WeatherCard } from "@/components/conditions/ConditionCards";
import { Checklist } from "@/components/guide/Checklist";
import { ElevationProfile } from "@/components/guide/ElevationProfile";
import { GuideMap } from "@/components/guide/GuideMap";
import { GUIDE_ANCHORS, GuideSection, GuideSections } from "@/components/guide/GuideSections";
import { StageHoverArea, StageList, StageProvider, type StageItem } from "@/components/guide/GuideStages";
import { OfflineSave } from "@/components/guide/OfflineSave";
import { distanceLabel } from "@/components/guide/RouteMap";
import {
  PROFILE_H,
  PROFILE_W,
  cumulativeM,
  deriveStages,
  splitLede,
  steepestStage,
  type ProfileGeometry,
  type Stage,
} from "@/components/guide/stages";
import { GuideMarks } from "@/components/marks/GuideMarks";
import { SITE } from "@/lib/config";
import { getGuide, guideSlugs } from "@/lib/guides";
import { OG_IMAGE } from "@/lib/seo";
import { breadcrumbJsonLd, tourJsonLd } from "@/lib/structured-data";
import type { Lang } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";
import { getLocalizedGuide, localizeTour, localizeTours, teaserFor } from "@/lib/i18n/content";
import { elevationLabel, gradeLabel } from "@/lib/i18n/format";
import { guideDict } from "@/lib/i18n/guide";
import { photoFor } from "@/lib/peak-photos";
import { getTour, routeProfile, routesFor, toursInRegion } from "@/lib/tours";
import styles from "./guide.module.css";

/** Turguiden, v3: lesekolonnen til venstre og kartet fast ved siden av.
 *
 *  Alt er åpent for alle — kart, nøkkeltall, høydeprofil, rutebeskrivelse,
 *  nedkjøring, skredterreng og GPX. Toppkart er gratis.
 *
 *  Rekkefølgen er den samme som spørsmålene kommer i når man planlegger: hvor
 *  høyt og hvor langt, kan jeg gå i dag og hva må med, hvor parkerer jeg,
 *  hvordan kommer jeg opp, hvordan kommer jeg ned, hva må jeg passe meg for.
 *  Oppstigningen er delt i etapper (`components/guide/stages.ts`) som er koblet
 *  til kartet og høydeprofilen: pek på én, og den utheves alle tre stedene.
 *
 *  Sida leser `tk_lang`-kaka, så den rendres per forespørsel.
 *  `generateStaticParams` står for kontraktens skyld. */

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

/** «520–900 moh» */
function rangeLabel(stage: Stage, lang: Lang): string {
  return `${stage.startM}–${elevationLabel(stage.endM, lang)}`;
}

/** Høydeprofilen i viewBox-koordinater: x langs ruta, y fra lavest til høyest
 *  med 10 enheter luft over og plass til etappenumrene under. */
function profileGeometry(
  elevations: readonly number[],
  cum: readonly number[],
  stages: readonly Stage[],
): ProfileGeometry {
  const total = cum[cum.length - 1] || 1;
  const min = Math.min(...elevations);
  const span = Math.max(1, Math.max(...elevations) - min);
  const round = (v: number) => Math.round(v * 10) / 10;
  const xy = elevations.map((e, i): [number, number] => [
    round((cum[i] / total) * PROFILE_W),
    round(10 + (1 - (e - min) / span) * (PROFILE_H - 20)),
  ]);
  return {
    xy,
    spans: stages.map((s) => ({
      from: s.from,
      to: s.to,
      x0: round(s.startFrac * PROFILE_W),
      x1: round(s.endFrac * PROFILE_W),
    })),
  };
}

/** Veibeskrivelse til starten. Kartappen på telefonen tar over derfra. */
function directionsUrl([lat, lng]: readonly [number, number]): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat.toFixed(5)},${lng.toFixed(5)}`;
}

export default async function TourGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lang = await getLang();
  const source = getTour(slug);
  if (!source) notFound();

  const tour = localizeTour(source, lang);
  const guide = getLocalizedGuide(slug, lang);
  const t = guideDict(lang);
  /* Rutas egen geometri — den samme linja `/kart` tegner. */
  const route = routeProfile(source);
  const photo = photoFor(source.slug);
  const mapHref = `/?tur=${tour.slug}`;
  const neighbours = localizeTours(toursInRegion(source.region, source.slug), lang);
  const otherRoutes = routesFor(source).slice(1);

  /* Etappene leses fra den norske teksten, så grensene er de samme på begge
     språk; avsnittene som vises er leserens. */
  const sourceGuide = getGuide(slug);
  const cum = route ? cumulativeM(route.points, route.distanceM) : [];
  const stages =
    route && guide && sourceGuide && sourceGuide.ascent.length === guide.ascent.length
      ? deriveStages(sourceGuide.ascent, route.elevations, cum)
      : [];
  const stageItems: StageItem[] = stages.map((stage, i) => ({
    title: rangeLabel(stage, lang),
    meta: distanceLabel(stage.lengthM, lang),
    body: guide!.ascent[i],
  }));
  const distance = route ? distanceLabel(route.distanceM, lang) : null;
  const steepest = steepestStage(stages);

  const lede = splitLede(guide?.intro ?? tour.teaser);
  const stats: { label: string; value: string }[] = [
    { label: t.statSummit, value: elevationLabel(tour.summitM, lang) },
    { label: t.statVertical, value: `↑ ${tour.verticalM} m` },
    ...(distance ? [{ label: t.routeLength, value: distance }] : []),
    { label: t.statTime, value: tour.duration },
    { label: t.statAspect, value: tour.aspect },
    { label: t.statGrade, value: gradeLabel(tour.grade, lang) },
  ];

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
      <main className={styles.main} data-access="open">
        <header className={styles.header}>
          <Link href={mapHref} className={styles.back}>
            {t.backToMap}
          </Link>
          <div className={styles.headRow}>
            <div className={styles.titleBlock}>
              <div className={styles.meta}>
                <span>{tour.region}</span>
                <span aria-hidden="true">·</span>
                <span>{gradeLabel(tour.grade, lang)}</span>
                <span aria-hidden="true">·</span>
                <span>
                  {t.seasonPrefix} {tour.season}
                </span>
              </div>
              <h1 className={styles.title}>{tour.name}</h1>
              <p className={styles.lede}>
                {lede.body}
                {lede.italic ? (
                  <>
                    {" "}
                    <em>{lede.italic}</em>
                  </>
                ) : null}
              </p>
            </div>

            <div className={styles.actions}>
              <GuideMarks slug={tour.slug} lang={lang} />
              {route ? (
                <OfflineSave
                  slug={tour.slug}
                  name={tour.name}
                  region={tour.region}
                  lines={offlineLines(source)}
                  lang={lang}
                />
              ) : null}
              {/* `target="_blank"` selv om `download` sier at dette er en fil.
                 Mange mobilnettlesere — og hver innebygde nettleser i en app —
                 *åpner* `application/gpx+xml` ved å navigere dit, og da er
                 guiden borte bak en fane med XML. I en ny kontekst blir guiden
                 stående urørt bak. */}
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
            </div>
          </div>
        </header>

        <StageProvider count={stages.length}>
          <div className={styles.grid}>
            <div className={styles.readCol}>
              <div className={styles.stats}>
                {stats.map((s) => (
                  <div key={s.label} className={styles.stat}>
                    <div className={styles.statLabel}>{s.label}</div>
                    <div className={styles.statValue}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Forholdene og det som må med, før noe om ruta: «kan jeg gå i
                  dag» er det neste man spør om etter «hvor høyt og hvor langt». */}
              <GuideSection id={GUIDE_ANCHORS.conditions} title={t.beforeTitle}>
                <div className={styles.conditions}>
                  <AvalancheCard slug={tour.slug} lang={lang} />
                  <WeatherCard slug={tour.slug} lat={tour.lat} lng={tour.lng} lang={lang} />
                </div>
                <Checklist slug={tour.slug} items={t.checklist} label={t.checklistLabel} />
              </GuideSection>

              {route ? (
                <GuideSection id={GUIDE_ANCHORS.route} title={t.accessTitle}>
                  <StageHoverArea index={0} className={styles.access}>
                    <div className={styles.accessMain}>
                      <div className={styles.accessName}>
                        <span className={styles.parking} aria-hidden="true">
                          P
                        </span>
                        <span>{route.trailhead}</span>
                      </div>
                      <p className={styles.accessText}>{route.routeName}</p>
                    </div>
                    <div className={styles.accessAside}>
                      <a href={directionsUrl(route.points[0])} target="_blank" rel="noopener">
                        {t.directions}
                      </a>
                      <span>
                        {elevationLabel(Math.round(route.elevations[0]), lang)} ·{" "}
                        {route.points[0][0].toFixed(4)}, {route.points[0][1].toFixed(4)}
                      </span>
                    </div>
                    {/* De andre veiene opp, som ellers bare finnes i
                        rutevelgeren på kartet. */}
                    {otherRoutes.length > 0 ? (
                      <div className={styles.otherRoutes}>
                        <div className={styles.otherHead}>{t.otherRoutesTitle}</div>
                        <ul>
                          {otherRoutes.map((r) => (
                            <li key={r.id}>
                              <span className={styles.otherName}>{r.name}</span>
                              <span className={styles.otherMeta}>
                                ↑ {r.gainM} m · {distanceLabel(r.distanceM, lang)} · {r.trailhead}
                              </span>
                              <Link href={`${mapHref}&rute=${encodeURIComponent(r.id)}`}>
                                {t.otherRouteLink} →
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </StageHoverArea>
                </GuideSection>
              ) : null}

              {guide ? (
                <>
                  <GuideSection
                    id={GUIDE_ANCHORS.ascent}
                    title={stageItems.length ? t.stagesTitle(stageItems.length) : t.ascentTitle}
                    aside={stageItems.length ? t.stagesHint : undefined}
                  >
                    {stageItems.length ? (
                      <StageList items={stageItems} />
                    ) : (
                      <div className={styles.prose}>
                        {guide.ascent.map((text, i) => (
                          <p key={i}>{text}</p>
                        ))}
                      </div>
                    )}
                    <p className={styles.darkNote}>
                      <em>{t.lineNoteLead}</em> {t.lineNote}
                    </p>
                  </GuideSection>
                  <GuideSections guide={guide} lang={lang} />
                </>
              ) : (
                <GuideSection title={t.guidePendingTitle}>
                  <p className={styles.pending}>{t.guidePendingBody}</p>
                </GuideSection>
              )}

              {photo ? (
                <GuideSection title={t.photoTitle}>
                  <PeakPhoto
                    photo={photo}
                    peak={tour.name}
                    lang={lang}
                    aspect="16 / 10"
                    className={styles.photo}
                  />
                </GuideSection>
              ) : null}

              {/* Naboturene. Regionen er den eneste slektskapen datasettet
                  kjenner, og den er nok: den som leser om Slogen er som regel i
                  ferd med å legge en uke i Sunnmørsalpene. */}
              {neighbours.length > 0 ? (
                <section className={styles.neighbours}>
                  <h2 className={styles.neighboursHead}>{t.moreInRegion(tour.region)}</h2>
                  <ul className={styles.neighbourList}>
                    {neighbours.map((peak) => (
                      <li key={peak.slug}>
                        <Link href={`/tur/${peak.slug}`} className={styles.neighbour}>
                          <span className={styles.neighbourName}>{peak.name}</span>
                          <span className={styles.neighbourMeta}>
                            {elevationLabel(peak.summitM, lang)} · {gradeLabel(peak.grade, lang)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>

            {route ? (
              <aside className={styles.mapCol}>
                <GuideMap
                  points={route.points}
                  stages={stages.map((stage, i) => ({
                    from: stage.from,
                    to: stage.to,
                    tooltip: `${i + 1} · ${rangeLabel(stage, lang)}`,
                  }))}
                  label={t.routeMapAria(tour.name, distance!, route.gainM)}
                  wholeLabel={t.wholeRoute(distance!)}
                  stageLabels={stages.map((stage, i) => t.stageLabel(i + 1, rangeLabel(stage, lang)))}
                  mapHref={mapHref}
                  openLabel={t.openInMainMap}
                  lang={lang}
                />
                <ElevationProfile
                  geometry={profileGeometry(route.elevations, cum, stages)}
                  title={t.elevationTitle}
                  summary={[
                    distance,
                    `↑ ${route.gainM} m`,
                    ...(steepest && stages.length > 1 ? [t.steepest(rangeLabel(steepest, lang))] : []),
                  ].join(" · ")}
                  label={t.elevationAria(
                    elevationLabel(Math.round(route.elevations[0]), lang),
                    elevationLabel(Math.round(Math.max(...route.elevations)), lang),
                    distance!,
                  )}
                  startLabel={elevationLabel(Math.round(route.elevations[0]), lang)}
                  endLabel={elevationLabel(Math.round(Math.max(...route.elevations)), lang)}
                />
              </aside>
            ) : null}
          </div>
        </StageProvider>

        <SiteFooter lang={lang} className={styles.footer}>
          <span className="push">{t.footerCredit}</span>
        </SiteFooter>
      </main>
    </div>
  );
}
