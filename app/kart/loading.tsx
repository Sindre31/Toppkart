import s from "./kart.module.css";

/** Kartets eget skjelett — det som står på forsida i øyeblikket før kartet
 *  kommer. Rammen her er en annen enn på resten av nettstedet, så rotskjelettet
 *  ville tegnet en side som ikke ligner den som kommer.
 *
 *  Klassene er de samme som `MapView` bruker (`kart.module.css`): topbaren på
 *  64px, panelet og kartflaten som to flytende flater med radius og skygge, og
 *  på telefon bare kartet. Da kan skjelettet ikke drive fra sida det står i for
 *  — det som strømmer inn, legger seg oppå og flytter ikke på noe.
 *
 *  Samme krav som rotskjelettet: statisk, ingen sesjon, ingen ordbok.
 *  Ordmerket er det ene ordet som er det samme på begge språk.
 */
export default function LoadingMap() {
  return (
    <div className={s.page} data-pane="map" aria-hidden="true">
      <header className={s.topbar}>
        <span className={s.brand}>Toppkart</span>
        <span className="skeleton-block" style={{ width: 56, height: 14 }} />
        <span className="skeleton-block" style={{ width: 70, height: 14 }} />
        <span className="skeleton-block" style={{ width: 120, height: 34, borderRadius: 999 }} />
      </header>

      <aside className={s.side}>
        <div className={s.panel} style={{ padding: 16, gap: 10 }}>
          <span className="skeleton-block" style={{ height: 42, borderRadius: 999 }} />
          <span className="skeleton-block" style={{ height: 30, width: "80%", borderRadius: 999 }} />
          <span className="skeleton-block" style={{ height: 30, width: "60%", borderRadius: 999 }} />
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="skeleton-block" style={{ height: 62, marginTop: i ? 4 : 12 }} />
          ))}
        </div>
      </aside>

      {/* Kartflaten er en rolig flate og ikke en puls: Leaflet tegner seg først
          etter at klienten har startet, så en puls her ville lovet noe som ikke
          kommer med denne strømmen. */}
      <div className={s.map}>
        <div className={s.mapFrame} style={{ background: "var(--color-tint-2)" }} />
      </div>
    </div>
  );
}
