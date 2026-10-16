import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Blueprint, SectionKicker } from "@/components/Blueprint";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { DataPlate } from "@/components/landing/DataPlate";
import styles from "@/components/landing/landing.module.css";
import { RouteMap } from "@/components/guide/RouteMap";
import { VippsNumber } from "@/components/VippsNumber";
import { getLang } from "@/lib/i18n/server";
import { landingDict } from "@/lib/i18n/landing";
import { getTour, routeProfile } from "@/lib/tours";

export async function generateMetadata(): Promise<Metadata> {
  const t = landingDict(await getLang());
  return { title: t.metaTitle, description: t.metaDescription, alternates: { canonical: "/om" } };
}

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

/** `/om` — hva Toppkart er, og Vipps-nummeret. Forsida er selve kartet
 *  (`next.config.ts` skriver `/` om til `/kart`), så det som sto her før, er nå
 *  sida man går til for å lese om tjenesten. */
export default async function AboutPage() {
  const lang = await getLang();
  const t = landingDict(lang);

  const safetyPeak = getTour(SAFETY_PEAK.slug);
  const safetyRoute = safetyPeak ? routeProfile(safetyPeak) : null;

  return (
    <>
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
                <Link className="btn btn-primary" href="/">
                  {t.ctaMap}
                </Link>
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
                /* Fargelagt, som på tursidene. Gråtonen holdt forsidas
                   akkompagnement rent, men den gjorde også figuren til et
                   stemningsbilde: et grått kart leses som bakgrunn. Poenget med
                   seksjonen er at guidene er bygget rundt terrenget, og da må
                   terrenget være lesbart — skog mot snaufjell, bre, myr, merkede
                   løyper. Det er den samme figuren tursidene viser, som er
                   akkurat det seksjonen påstår. */
                caption={false}
              >
                <Link href={`/?tur=${SAFETY_PEAK.slug}`}>{t.safetyFigureLink}</Link>
              </RouteMap>
            ) : null}
          </section>

          {/* — 04 · Støtt Toppkart — */}
          <section id="stott" style={{ padding: "60px 0 48px" }}>
            <SectionKicker>{t.supportKicker}</SectionKicker>
            <div className="grid-split">
              <div>
                <h3 style={{ fontSize: 24, lineHeight: "24px", letterSpacing: "0.02em", textTransform: "uppercase", margin: 0 }}>
                  {t.supportHeading}
                </h3>
                <p className="prose" style={{ margin: "16px 0 0", maxWidth: "52ch" }}>
                  {t.supportBody}
                </p>
              </div>
              <Blueprint style={{ padding: 24 }}>
                <VippsNumber lang={lang} />
              </Blueprint>
            </div>
          </section>
        </main>

        <SiteFooter lang={lang} />
      </div>
    </>
  );
}
