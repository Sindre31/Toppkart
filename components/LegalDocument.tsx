import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { formatDate } from "@/lib/dates";
import type { Lang } from "@/lib/i18n";
import { LEGAL_UPDATED, type LegalDocument as LegalDoc } from "@/lib/i18n/legal";

/** Shared shell for `/vilkar` and `/personvern`.
 *
 *  The two pages differ only in which document they hand over, so the layout,
 *  the numbering and the «last updated» line live here rather than being
 *  written twice and drifting apart.
 *
 *  Same grammar as the tour guide: the title in Instrument Serif, each section
 *  an `h2` in the same face over a card. No numbering and no capitals — the
 *  «01 · OM TJENESTEN» kicker belonged to the Industry look v3 replaced.
 */
export function LegalDocument({ lang, doc }: { lang: Lang; doc: LegalDoc }) {

  return (
    <div className="shell">
      <SiteNav lang={lang} />

      <main className="page page-narrow" style={{ width: "100%" }}>
        <header style={{ padding: "48px 0 8px" }}>
          <span className="kicker">{doc.kicker}</span>
          <h1 className="display" style={{ fontSize: "clamp(48px, 6vw, 72px)", margin: "8px 0 0 -0.03em" }}>
            {doc.title}
          </h1>
          <p className="lede" style={{ margin: "16px 0 0" }}>
            {doc.lede}
          </p>
          <p className="note" style={{ margin: "14px 0 0" }}>
            {doc.updatedLabel} {formatDate(LEGAL_UPDATED, lang)}
          </p>
        </header>

        {doc.sections.map((section) => (
          <section key={section.title} style={{ paddingTop: 40 }}>
            <h2 className="h-section" style={{ margin: "0 0 16px" }}>
              {section.title}
            </h2>
            <div className="card" style={{ padding: "20px 24px", gap: 0 }}>
              {section.body.map((paragraph, i) => (
                <p
                  className="prose"
                  key={paragraph.slice(0, 48)}
                  style={{ margin: i === 0 ? 0 : "14px 0 0", maxWidth: "72ch" }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}

        <SiteFooter lang={lang} />
      </main>
    </div>
  );
}
