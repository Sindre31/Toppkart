import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Blueprint, SectionKicker } from "@/components/Blueprint";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { DataPlate } from "@/components/landing/DataPlate";
import { TrialSignupRow } from "@/components/landing/TrialSignupRow";
import styles from "@/components/landing/landing.module.css";

export const metadata: Metadata = {
  title: "Alle toppturene. Ett kart.",
  description:
    "Toppkart er en feltguide for skiturer i Norge: kvalitetssikrede toppturer på ett kart, med rute, høydemeter, bratthet og skredterreng. 29 kr/mnd, 14 dager gratis.",
};

/** Årsprisen (290 kr/år — to måneder gratis) er skrudd av. Sett til true for å vise raden. */
const SHOW_ANNUAL = false;

const GUIDE_CELLS: ReadonlyArray<{ title: string; body: string }> = [
  {
    title: "Rute og nedkjøring",
    body: "Opptegnet rute med høydeprofil, normal tidsbruk og beskrivelse av både oppstigning og nedkjøring — inkludert hvor folk pleier å gjøre feil. GPX-fil til klokke og app.",
  },
  {
    title: "Skredterreng",
    body: "Bratthetskart, utløpssoner og hvilke himmelretninger ruta eksponerer deg mot — koblet til dagens skredvarsel fra Varsom, rett i turguiden.",
  },
  {
    title: "Sesong og forhold",
    body: "Når på året turen er på sitt beste, hvor snøen legger seg, og alternative ruter når forholdene ikke spiller på lag. Skrevet av folk som går turene selv.",
  },
];

const PLAN_POINTS: ReadonlyArray<{ num: string; text: string }> = [
  { num: "01", text: "14 dager gratis prøveperiode" },
  { num: "02", text: "Alle turguider, GPX og høydeprofiler" },
  { num: "03", text: "Skredterreng og Varsom-varsel per tur" },
  { num: "04", text: "Ingen binding — avslutt når som helst" },
];

const muted = (percent: number) => `color-mix(in srgb, var(--color-text) ${percent}%, transparent)`;

export default function LandingPage() {
  return (
    <>
      <SiteNav>
        <Link href="/kart">Kartet</Link>
        <a href="#innhold">Innhold</a>
        <a href="#pris">Pris</a>
        <Link className="nav-muted" href="/logg-inn">
          Logg inn
        </Link>
        <Link className="btn btn-primary" href="/betaling">
          Prøv gratis
        </Link>
      </SiteNav>

      <div className="page">
        <main>
          {/* — hero — */}
          <section style={{ padding: "96px 0 72px" }}>
            <h1 className="display" style={{ fontSize: "clamp(46px, 7vw, 92px)" }}>
              <span style={{ display: "block" }}>Alle toppturene.</span>
              <span style={{ display: "block" }}>Ett kart.</span>
            </h1>
            <p className="lede" style={{ margin: "32px 0 0" }}>
              Toppkart er en feltguide for skiturer i Norge: kvalitetssikrede toppturer på ett kart, med rute,
              høydemeter, bratthet og skredterreng — skrevet for at du skal komme trygt opp og trygt ned. For deg som
              går din første topptur, og for deg som går din hundrede.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginTop: 28 }}>
              <Link className="btn btn-primary" href="/betaling">
                Prøv gratis i 14 dager
              </Link>
              <Link className="btn btn-secondary" href="/kart">
                Se kartet
              </Link>
              <span style={{ fontSize: 13, color: muted(60) }}>Deretter 29 kr/mnd. Ingen binding.</span>
            </div>
          </section>

          {/* — nøkkeldata — */}
          <DataPlate />

          {/* — 02 · Hva hver turguide holder — */}
          <section id="innhold" style={{ padding: "72px 0 60px" }}>
            <SectionKicker>02 · Hva hver turguide holder</SectionKicker>
            <div className="grid-auto">
              {GUIDE_CELLS.map((cell) => (
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
              <SectionKicker>03 · Trygghet først</SectionKicker>
              <h2 className="h-section">Skrevet for å komme hjem</h2>
              <p className="prose" style={{ margin: "16px 0 0", maxWidth: "48ch" }}>
                I snitt dør fem mennesker i snøskred i Norge hvert år — de fleste på topptur. Hver guide i Toppkart er
                derfor bygget rundt terrenget, ikke rundt bildene: bratthet, utløpssoner og trygge alternativer står
                først, pudderpratet sist.
              </p>
            </div>
            <Blueprint as="figure" className="duotone" style={{ margin: 0 }}>
              <Image
                src="/assets/kontur.png"
                alt="Toppturfoto — skiløper på vei opp"
                width={1500}
                height={1000}
                priority
                style={{ width: "100%", height: "auto", aspectRatio: "3 / 2", objectFit: "cover" }}
              />
            </Blueprint>
          </section>

          {/* — sitat — */}
          <section style={{ padding: "48px 0 84px" }}>
            <figure style={{ margin: 0 }}>
              <blockquote
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 600,
                  fontSize: "clamp(26px, 2.8vw, 36px)",
                  lineHeight: "36px",
                  maxWidth: "36ch",
                  margin: 0,
                  textIndent: "-0.316em",
                }}
              >
                «Vi brukte guiden til Kirketaket i februar. Beskrivelsen av nedkjøringen stemte på meteren — også der
                vi ikke burde kjøre.»
              </blockquote>
              <figcaption
                style={{ fontSize: 15, lineHeight: "24px", color: muted(70), margin: "40px 0 0", textIndent: "-0.885em" }}
              >
                — Betabruker, Romsdalen
              </figcaption>
            </figure>
          </section>

          {/* — 04 · Abonnement — */}
          <section id="pris" style={{ padding: "60px 0 48px" }}>
            <SectionKicker>04 · Abonnement</SectionKicker>
            <div className="grid-split">
              <div>
                <h3 style={{ fontSize: 24, lineHeight: "24px", letterSpacing: "0.02em", textTransform: "uppercase", margin: 0 }}>
                  Hele kartet. Alle guidene.
                </h3>
                <p className="prose" style={{ margin: "16px 0 0", maxWidth: "52ch" }}>
                  Én pris, alt åpent. Nye turer legges til hver sesong, og guidene revideres når terrenget eller
                  normalruta endrer seg. Avslutt når du vil — abonnementet stopper ved neste trekk.
                </p>
                <TrialSignupRow />
                <p className="note" style={{ margin: "12px 0 0" }}>
                  Vi sender en innloggingslenke på e-post — ingen passord. Betaling håndteres sikkert av Stripe. Du
                  legger inn kort ved start — første trekk etter 14 dager.
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
                    29 kr
                  </span>
                  <span style={{ fontSize: 15, color: muted(70) }}>per måned</span>
                </div>
                {SHOW_ANNUAL ? (
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 10 }}>
                    <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 26, lineHeight: 1 }}>
                      290 kr
                    </span>
                    <span style={{ fontSize: 14, color: muted(70) }}>per år — to måneder gratis</span>
                  </div>
                ) : null}
                <hr className="hr" style={{ margin: "20px 0" }} />
                <ul className="numbered">
                  {PLAN_POINTS.map((point) => (
                    <li key={point.num}>
                      <span>{point.num}</span>
                      {point.text}
                    </li>
                  ))}
                </ul>
              </Blueprint>
            </div>
          </section>
        </main>

        <SiteFooter>
          <span className="push">Norsk / English</span>
        </SiteFooter>
      </div>
    </>
  );
}
