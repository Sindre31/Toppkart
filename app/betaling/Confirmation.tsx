import Link from "next/link";

import { Blueprint } from "@/components/Blueprint";

/** Bekreftelsestilstanden — vises både etter demo-kjøp (klientstate) og når
 *  Stripe sender brukeren tilbake til /betaling?status=ok. */
export function Confirmation({ trialEndDate }: { trialEndDate: string }) {
  return (
    <div style={{ display: "grid", placeItems: "center", padding: "48px 0" }}>
      <Blueprint style={{ padding: 32, width: "min(480px, 100%)", textAlign: "left" }}>
        <span className="kicker">Kvittering sendt på e-post</span>
        <h1
          style={{
            fontSize: 34,
            lineHeight: 1.08,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            margin: "10px 0 0",
          }}
        >
          Velkommen opp
        </h1>
        <p className="prose" style={{ margin: "12px 0 0" }}>
          Prøveperioden er i gang og varer til {trialEndDate}. Alle turguider, GPX-filer og
          skredterreng er nå åpne.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 22 }}>
          <Link className="btn btn-primary" href="/kart">
            Åpne kartet
          </Link>
          <Link className="btn btn-secondary" href="/min-side">
            Min side
          </Link>
        </div>
      </Blueprint>
    </div>
  );
}
