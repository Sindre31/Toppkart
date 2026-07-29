import { Blueprint } from "@/components/Blueprint";
import type { Lang } from "@/lib/i18n";
import { landingDict } from "@/lib/i18n/landing";

/** «Toppkart — nøkkeldata»: tittelblokk + fire hairline-rader. */
export function DataPlate({ lang }: { lang: Lang }) {
  const t = landingDict(lang);
  return (
    <section aria-label={t.plateLabel} style={{ padding: "24px 0 60px" }}>
      <Blueprint className="plate">
        <header className="plate-head">
          <span>{t.plateLabel}</span>
          <span>TK-100</span>
          <span>{t.plateSheet}</span>
        </header>
        <table className="table">
          <tbody>
            {t.plateRows.map((row, index) => (
              <tr key={row.prop}>
                <td
                  className="hairline"
                  style={{
                    width: 72,
                    padding: "12px 0 12px 24px",
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    color: "var(--color-accent-700)",
                  }}
                >
                  {String(index + 1).padStart(2, "0")}
                </td>
                <td className="hairline" style={{ width: "30%", padding: "12px 24px 12px 0", fontSize: 15 }}>
                  {row.prop}
                </td>
                <td
                  className="hairline"
                  style={{
                    width: "22%",
                    padding: "12px 24px 12px 0",
                    fontFamily: "var(--font-heading)",
                    fontWeight: 600,
                    fontSize: 22,
                    letterSpacing: "0.02em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.val}
                </td>
                <td
                  className="hairline"
                  style={{
                    padding: "12px 24px 12px 0",
                    fontSize: 14,
                    color: "color-mix(in srgb, var(--color-text) 70%, transparent)",
                  }}
                >
                  {row.rem}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="plate-foot">{t.plateFoot}</p>
      </Blueprint>
    </section>
  );
}
