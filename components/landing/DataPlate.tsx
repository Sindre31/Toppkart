import { Blueprint } from "@/components/Blueprint";

/** «Toppkart — nøkkeldata»: tittelblokk + fire hairline-rader. */
const SPECS: ReadonlyArray<{ num: string; prop: string; val: string; rem: string }> = [
  { num: "01", prop: "Toppturer i kartet", val: "214", rem: "Fra Lyngen i nord til Sirdal i sør" },
  { num: "02", prop: "Regioner", val: "12", rem: "Alle med lokal rutebeskrivelse" },
  { num: "03", prop: "Pris per måned", val: "29 kr", rem: "Ingen binding" },
  { num: "04", prop: "Gratis prøveperiode", val: "14 dager", rem: "Kort kreves — første trekk etter prøveperioden" },
];

export function DataPlate() {
  return (
    <section aria-label="Toppkart — nøkkeldata" style={{ padding: "24px 0 60px" }}>
      <Blueprint className="plate">
        <header className="plate-head">
          <span>Toppkart — nøkkeldata</span>
          <span>TK-100</span>
          <span>Ark 01 av 04</span>
        </header>
        <table className="table">
          <tbody>
            {SPECS.map((row) => (
              <tr key={row.num}>
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
                  {row.num}
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
        <p className="plate-foot">
          Turene er kvalitetssikret mot kart, bratthetsdata og lokale kjentfolk. Sjekk alltid skredvarselet på
          varsom.no før du går.
        </p>
      </Blueprint>
    </section>
  );
}
