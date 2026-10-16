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
    north: north.region,
    south: south.region,
  };
}

/** «Toppkart i tall»: tallene fra katalogen som kort, i samme form som
 *  nøkkeltallene i turguiden — etikett, stort tall i Instrument Serif og en
 *  merknad under. Tidligere en blåkopi-plate med arknummer og radnumre, lånt
 *  fra «Industry»-uttrykket som v3 erstattet. */
export function DataPlate({ lang }: { lang: Lang }) {
  const t = landingDict(lang);
  const figures = plateFigures();
  return (
    <section aria-label={t.plateLabel} className="figures">
      <h2 className="figures-label">{t.plateLabel}</h2>
      <div className="figures-grid">
        {t.plateRows(figures).map((row) => (
          <div key={row.prop} className="figure">
            <div className="figure-label">{row.prop}</div>
            <div className="figure-value">{row.val}</div>
            <p className="figure-note">{row.rem}</p>
          </div>
        ))}
      </div>
      <p className="note figures-foot">{t.plateFoot}</p>
    </section>
  );
}
