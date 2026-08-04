import Link from "next/link";

import { Blueprint, SectionKicker } from "@/components/Blueprint";
import { AccountNav, SiteFooter, SiteNav } from "@/components/SiteChrome";
import { formatDate } from "@/lib/dates";
import type { Lang } from "@/lib/i18n";
import { commonDict } from "@/lib/i18n/common";
import { LEGAL_UPDATED, type LegalDocument as LegalDoc } from "@/lib/i18n/legal";

/** Shared shell for `/vilkar` and `/personvern`.
 *
 *  The two pages differ only in which document they hand over, so the layout,
 *  the numbering and the «last updated» line live here rather than being
 *  written twice and drifting apart.
 *
 *  Sections are numbered from their position — `01 · Om tjenesten` — the same
 *  way `GuideSections` numbers a tour guide, so a section can be inserted or
 *  moved without renumbering anything by hand.
 */
export function LegalDocument({ lang, doc }: { lang: Lang; doc: LegalDoc }) {
  const c = commonDict(lang);

  return (
    <div className="shell">
      <SiteNav lang={lang}>
        <Link href="/kart">{c.map}</Link>
        <AccountNav lang={lang} />
      </SiteNav>

      <main className="page page-narrow" style={{ paddingBottom: 72 }}>
        <header style={{ padding: "48px 0 8px" }}>
          <span className="kicker">{doc.kicker}</span>
          <h1
            style={{
              fontSize: "clamp(34px, 5vw, 52px)",
              lineHeight: 1.06,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              margin: "10px 0 0",
            }}
          >
            {doc.title}
          </h1>
          <p className="lede" style={{ margin: "18px 0 0" }}>
            {doc.lede}
          </p>
          <p className="note" style={{ margin: "16px 0 0" }}>
            {doc.updatedLabel} {formatDate(LEGAL_UPDATED, lang)}
          </p>
        </header>

        {doc.sections.map((section, index) => (
          <section key={section.title} style={{ marginTop: 40 }}>
            <SectionKicker>
              {String(index + 1).padStart(2, "0")} · {section.title}
            </SectionKicker>
            <Blueprint style={{ padding: "24px 28px" }}>
              {section.body.map((paragraph, i) => (
                <p
                  className="prose"
                  key={paragraph.slice(0, 48)}
                  style={{ margin: i === 0 ? 0 : "14px 0 0", maxWidth: "72ch" }}
                >
                  {paragraph}
                </p>
              ))}
            </Blueprint>
          </section>
        ))}
      </main>

      <SiteFooter lang={lang} />
    </div>
  );
}
