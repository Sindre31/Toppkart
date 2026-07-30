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
            {/* The cells are styled from globals rather than inline so the
                narrow-screen rule can restack them — an inline `width` would
                out-specify any media query and keep forcing four columns. */}
            {t.plateRows.map((row, index) => (
              <tr key={row.prop}>
                <td className="hairline plate-idx">{String(index + 1).padStart(2, "0")}</td>
                <td className="hairline plate-prop">{row.prop}</td>
                <td className="hairline plate-val">{row.val}</td>
                <td className="hairline plate-rem">{row.rem}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="plate-foot">{t.plateFoot}</p>
      </Blueprint>
    </section>
  );
}
