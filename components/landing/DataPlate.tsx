import { Blueprint } from "@/components/Blueprint";
import type { Lang } from "@/lib/i18n";
import { landingDict, type PlateFigures } from "@/lib/i18n/landing";
import { REGIONS, TOURS } from "@/lib/tours";

/** Tallene plata oppgir, telt fra turkatalogen i stedet for skrevet inn i
 *  ordboka. Turtallet sto som «214» mot et kart som holdt 24 — et tall leseren
 *  motbeviser med ett klikk på «Se kartet».
 *
 *  Tellinga skjer her og ikke i ordboka med vilje: `lib/tours` drar med seg
 *  geometrien til hver eneste rute, og ordboka importeres også av en
 *  klientkomponent lenger ned på sida. Denne fila er en serverkomponent, så
 *  katalogen blir liggende på serveren og bare de ferdige tallene krysser over.
 *
 *  Nord og sør er regionene til de ytterste turene i breddegrad, slik at spennet
 *  i merknaden på rad 01 er det spennet kartet faktisk dekker. */
function plateFigures(): PlateFigures {
  const north = TOURS.reduce((a, b) => (b.lat > a.lat ? b : a));
  const south = TOURS.reduce((a, b) => (b.lat < a.lat ? b : a));
  return {
    tours: TOURS.length,
    regions: REGIONS.length,
    guides: TOURS.filter((tour) => tour.hasGuide).length,
    north: north.region,
    south: south.region,
  };
}

/** «Toppkart — nøkkeldata»: tittelblokk + fire hairline-rader. */
export function DataPlate({ lang }: { lang: Lang }) {
  const t = landingDict(lang);
  const figures = plateFigures();
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
            {t.plateRows(figures).map((row, index) => (
              <tr key={row.prop}>
                <td className="hairline plate-idx">{String(index + 1).padStart(2, "0")}</td>
                <td className="hairline plate-prop">{row.prop}</td>
                <td className="hairline plate-val">{row.val}</td>
                <td className="hairline plate-rem">{row.rem}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="plate-foot">{t.plateFoot(figures)}</p>
      </Blueprint>
    </section>
  );
}
