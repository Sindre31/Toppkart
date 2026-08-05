/** Kartets eget skjelett. Rammen her er en annen enn på resten av nettstedet —
 *  fast topbar på 56px, 372px liste til venstre, kart som fyller resten — så
 *  rotskjelettet ville tegnet en side som ikke ligner den som kommer.
 *
 *  Samme krav som der: statisk, ingen sesjon, ingen ordbok. Målene speiler
 *  `kart.module.css`, slik at det som strømmer inn legger seg oppå og ikke
 *  flytter på noe.
 */
export default function LoadingMap() {
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden" }} aria-hidden="true">
      <header
        style={{
          position: "fixed",
          inset: "0 0 auto 0",
          height: 56,
          display: "flex",
          alignItems: "center",
          gap: 20,
          padding: "0 20px",
          background: "var(--color-bg)",
          borderBottom: "1px solid var(--color-divider)",
          zIndex: 1200,
        }}
      >
        <span className="skeleton-brand" style={{ marginRight: "auto" }}>
          Toppkart
        </span>
        <span className="skeleton-block" style={{ width: 56, height: 14 }} />
        <span className="skeleton-block" style={{ width: 44, height: 14 }} />
        <span className="skeleton-block" style={{ width: 70, height: 30 }} />
      </header>

      {/* Kartflata ligger under lista og fyller alt under baren — på telefon
          dekker lista 85vw av den. Den er en rolig flate og ikke en puls:
          Leaflet tegner seg først etter at klienten har startet, så en puls her
          ville lovet noe som ikke kommer med denne strømmen. */}
      <div
        style={{
          position: "fixed",
          inset: "56px 0 0 0",
          background: "color-mix(in srgb, var(--color-text) 5%, transparent)",
        }}
      />

      <aside
        style={{
          position: "fixed",
          top: 56,
          left: 0,
          bottom: 0,
          width: "min(372px, 85vw)",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          background: "var(--color-bg)",
          borderRight: "1px solid var(--color-divider)",
        }}
      >
        <span className="skeleton-block" style={{ height: 34 }} />
        <span className="skeleton-block" style={{ height: 30, width: "70%" }} />
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="skeleton-block" style={{ height: 78, marginTop: i ? 8 : 0 }} />
        ))}
      </aside>
    </div>
  );
}
