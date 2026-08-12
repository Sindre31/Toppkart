import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Blueprint, SectionKicker } from "@/components/Blueprint";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { DataPlate } from "@/components/landing/DataPlate";
import { TrialSignupRow } from "@/components/landing/TrialSignupRow";
import styles from "@/components/landing/landing.module.css";
import { RouteMap } from "@/components/guide/RouteMap";
import { getViewer } from "@/lib/access";
import { getLang } from "@/lib/i18n/server";
import { landingDict } from "@/lib/i18n/landing";
import { siteJsonLd } from "@/lib/structured-data";
import { getTour, routeProfile } from "@/lib/tours";

export async function generateMetadata(): Promise<Metadata> {
  const t = landingDict(await getLang());
  return { title: t.metaTitle, description: t.metaDescription, alternates: { canonical: "/" } };
}

/** Årsprisen (290 kr/år — to måneder gratis) er skrudd av. Sett til true for å vise raden. */
const SHOW_ANNUAL = false;

/** Turen figuren i seksjon 03 tegner.
 *
 *  Her lå `/assets/kontur.png`, som var det siste oppdiktede terrenget på
 *  nettstedet. Bildet var en generert konturgrafikk med «1439 moh» brent inn i
 *  streken — og 1439 er Kirketaket, fordi prototypen tegnet den. Tursidene fikk
 *  ekte kart i #67 og sluttet å bruke bildet; forsida ble stående igjen med det,
 *  under en alternativ tekst som lovte «Toppturfoto — skiløper på vei opp».
 *  Altså tre påstander som ikke stemte samtidig: ikke et foto, ikke en skiløper,
 *  og en høyde uten et fjell under seg.
 *
 *  Nå tegner figuren Kirketakets faktiske normalrute med `RouteMap` — den samme
 *  komponenten tursidene bruker, matet av de samme punktene `/kart` tegner. Tallet
 *  1439 er sant igjen, fordi det nå er fjellet det alltid tilhørte. */
const SAFETY_PEAK = { slug: "kirketaket", name: "Kirketaket" } as const;

const muted = (percent: number) => `color-mix(in srgb, var(--color-text) ${percent}%, transparent)`;

export default async function LandingPage() {
  const lang = await getLang();
  const t = landingDict(lang);

  /* Forsida sto og solgte prøveperioden til folk som allerede hadde kjøpt.
     «Prøv gratis i 14 dager» i heroen og påmeldingsfeltet i seksjon 04 pekte
     begge til kassa, og en abonnent som trykker der starter abonnement nummer
     to — ikke fordi vedkommende vil det, men fordi sida ikke visste bedre.

     Navigasjonen har alltid visst det (`AccountNav` bytter «Prøv gratis» mot
     «Min side» så snart det finnes en sesjon); det var bare sidekroppen som
     ikke spurte. Nå gjør den det. `hasAccess`, ikke bare «er innlogget»: en
     som er logget inn uten abonnement skal fortsatt få tilbudet. */
  const { hasAccess } = await getViewer();

  /* Geometrien er fri — den står allerede på `/kart` for alle. Det er
     ruteteksten, høydeprofilen og skredterrenget som er bak betalingsmuren, og
     ingen av dem er her. */
  const safetyPeak = getTour(SAFETY_PEAK.slug);
  const safetyRoute = safetyPeak ? routeProfile(safetyPeak) : null;

  return (
    <>
      {/* Hvem nettstedet er. Står bare her: forsida er den ene sida som
          representerer hele nettstedet, og `WebSite` gjentatt på 90 sider er
          det samme utsagnet 90 ganger. */}
      <JsonLd data={siteJsonLd(lang)} />

      <SiteNav lang={lang} />

      <div className="page">
        <main>
          {/* — hero — */}
          <section className={styles.hero}>
            {/* Dekor: teksten over sier det bildet viser, så en alt-tekst her
                ville lest opp det samme en gang til. */}
            <Image
              src="/assets/hero-relief.webp"
              alt=""
              aria-hidden
              fill
              priority
              sizes="(max-width: 1160px) 100vw, 1160px"
              className={styles.heroImage}
            />
            <div className={styles.heroContent}>
              <h1 className="display display-hero">
                <span style={{ display: "block" }}>{t.heroLine1}</span>
                <span style={{ display: "block" }}>{t.heroLine2}</span>
              </h1>
              <p className="lede" style={{ margin: "32px 0 0" }}>
                {t.lede}
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginTop: 28 }}>
                {hasAccess ? (
                  /* Kartet er det abonnenten kom for. Det står som andreknapp
                     for alle andre, og rykker opp til første her. */
                  <>
                    <Link className="btn btn-primary" href="/kart">
                      {t.ctaMap}
                    </Link>
                    <Link className="btn btn-secondary" href="/turer">
                      {t.ctaTours}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link className="btn btn-primary" href="/betaling">
                      {t.ctaTrial}
                    </Link>
                    <Link className="btn btn-secondary" href="/kart">
                      {t.ctaMap}
                    </Link>
                  </>
                )}
                <span style={{ fontSize: 13, color: muted(60) }}>
                  {hasAccess ? t.priceNoteActive : t.priceNote}
                </span>
              </div>
            </div>
          </section>

          {/* — nøkkeldata — */}
          <DataPlate lang={lang} />

          {/* — 02 · Hva hver turguide holder — */}
          <section id="innhold" style={{ padding: "72px 0 60px" }}>
            <SectionKicker>{t.guidesKicker}</SectionKicker>
            <div className="grid-auto">
              {t.guideCells.map((cell) => (
                <Blueprint key={cell.title} style={{ padding: 24 }}>
                  <h2 className="h-cell">{cell.title}</h2>
                  <p className="prose" style={{ margin: "16px 0 0" }}>
                    {cell.body}
                  </p>
                </Blueprint>
              ))}
            </div>
          </section>

          {/* — 03 · Trygghet først — */}
          <section className={styles.split57}>
            <div>
              <SectionKicker>{t.safetyKicker}</SectionKicker>
              <h2 className="h-section">{t.safetyHeading}</h2>
              <p className="prose" style={{ margin: "16px 0 0", maxWidth: "48ch" }}>
                {t.safetyBody}
              </p>
            </div>
            {safetyRoute ? (
              <RouteMap
                peak={SAFETY_PEAK.name}
                points={safetyRoute.points}
                distanceM={safetyRoute.distanceM}
                gainM={safetyRoute.gainM}
                trailhead={safetyRoute.trailhead}
                lang={lang}
                caption={false}
              >
                <Link href={`/kart?tur=${SAFETY_PEAK.slug}`}>{t.safetyFigureLink}</Link>
              </RouteMap>
            ) : null}
          </section>

          {/* — 04 · Abonnement — */}
          <section id="pris" style={{ padding: "60px 0 48px" }}>
            <SectionKicker>{t.planKicker}</SectionKicker>
            <div className="grid-split">
              <div>
                <h3 style={{ fontSize: 24, lineHeight: "24px", letterSpacing: "0.02em", textTransform: "uppercase", margin: 0 }}>
                  {t.planHeading}
                </h3>
                <p className="prose" style={{ margin: "16px 0 0", maxWidth: "52ch" }}>
                  {t.planBody}
                </p>
                {hasAccess ? (
                  /* Prisplata ved siden av blir stående: den beskriver
                     produktet, og det er like sant for en abonnent. Det er
                     bare oppfordringa om å begynne som ikke er det. */
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
                    <Link className="btn btn-primary" href="/min-side">
                      {t.planAccount}
                    </Link>
                  </div>
                ) : (
                  <TrialSignupRow lang={lang} />
                )}
                <p className="note" style={{ margin: "12px 0 0" }}>
                  {hasAccess ? t.planNoteActive : t.planNote}
                </p>
              </div>
              <Blueprint style={{ padding: 24 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 600,
                      fontSize: 64,
                      lineHeight: 1,
                      letterSpacing: "0.01em",
                    }}
                  >
                    {t.planPrice}
                  </span>
                  <span style={{ fontSize: 15, color: muted(70) }}>{t.planPriceUnit}</span>
                </div>
                {SHOW_ANNUAL ? (
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 10 }}>
                    <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 26, lineHeight: 1 }}>
                      {t.planAnnualPrice}
                    </span>
                    <span style={{ fontSize: 14, color: muted(70) }}>{t.planAnnualUnit}</span>
                  </div>
                ) : null}
                <hr className="hr" style={{ margin: "20px 0" }} />
                <ul className="numbered">
                  {t.planPoints.map((point, index) => (
                    <li key={point}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </Blueprint>
            </div>
          </section>
        </main>

        <SiteFooter lang={lang} />
      </div>
    </>
  );
}
