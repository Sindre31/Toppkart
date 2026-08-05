import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Blueprint, SectionKicker } from "@/components/Blueprint";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { DataPlate } from "@/components/landing/DataPlate";
import { TrialSignupRow } from "@/components/landing/TrialSignupRow";
import styles from "@/components/landing/landing.module.css";
import { getLang } from "@/lib/i18n/server";
import { commonDict } from "@/lib/i18n/common";
import { landingDict } from "@/lib/i18n/landing";

export async function generateMetadata(): Promise<Metadata> {
  const t = landingDict(await getLang());
  return { title: t.metaTitle, description: t.metaDescription, alternates: { canonical: "/" } };
}

/** Årsprisen (290 kr/år — to måneder gratis) er skrudd av. Sett til true for å vise raden. */
const SHOW_ANNUAL = false;

const muted = (percent: number) => `color-mix(in srgb, var(--color-text) ${percent}%, transparent)`;

export default async function LandingPage() {
  const lang = await getLang();
  const t = landingDict(lang);
  const c = commonDict(lang);

  return (
    <>
      {/* «Innhold» og «Pris» er det eneste sidespesifikke i navigasjonen på
          hele nettstedet: de scroller forsida, og finnes bare her. */}
      <SiteNav lang={lang}>
        <a className="nav-jump" href="#innhold">
          {c.contents}
        </a>
        <a className="nav-jump" href="#pris">
          {c.price}
        </a>
      </SiteNav>

      <div className="page">
        <main>
          {/* — hero — */}
          <section style={{ padding: "96px 0 72px" }}>
            <h1 className="display display-hero">
              <span style={{ display: "block" }}>{t.heroLine1}</span>
              <span style={{ display: "block" }}>{t.heroLine2}</span>
            </h1>
            <p className="lede" style={{ margin: "32px 0 0" }}>
              {t.lede}
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginTop: 28 }}>
              <Link className="btn btn-primary" href="/betaling">
                {t.ctaTrial}
              </Link>
              <Link className="btn btn-secondary" href="/kart">
                {t.ctaMap}
              </Link>
              <span style={{ fontSize: 13, color: muted(60) }}>{t.priceNote}</span>
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
            <Blueprint as="figure" className="duotone" style={{ margin: 0 }}>
              <Image
                src="/assets/kontur.png"
                alt={t.safetyPhotoAlt}
                width={1500}
                height={1000}
                priority
                style={{ width: "100%", height: "auto", aspectRatio: "3 / 2", objectFit: "cover" }}
              />
            </Blueprint>
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
                <TrialSignupRow lang={lang} />
                <p className="note" style={{ margin: "12px 0 0" }}>
                  {t.planNote}
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
