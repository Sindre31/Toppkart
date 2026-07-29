import Link from "next/link";

import { Blueprint } from "@/components/Blueprint";
import type { Lang } from "@/lib/i18n";
import { checkoutDict } from "@/lib/i18n/checkout";

/** Bekreftelsestilstanden — vises både etter demo-kjøp (klientstate) og når
 *  Stripe sender brukeren tilbake til /betaling?status=ok. */
export function Confirmation({ lang, trialEndDate }: { lang: Lang; trialEndDate: string }) {
  const t = checkoutDict(lang);
  return (
    <div style={{ display: "grid", placeItems: "center", padding: "48px 0" }}>
      <Blueprint style={{ padding: 32, width: "min(480px, 100%)", textAlign: "left" }}>
        <span className="kicker">{t.confirmKicker}</span>
        <h1
          style={{
            fontSize: 34,
            lineHeight: 1.08,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            margin: "10px 0 0",
          }}
        >
          {t.confirmHeading}
        </h1>
        <p className="prose" style={{ margin: "12px 0 0" }}>
          {t.confirmBody(trialEndDate)}
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 22 }}>
          <Link className="btn btn-primary" href="/kart">
            {t.confirmOpenMap}
          </Link>
          <Link className="btn btn-secondary" href="/min-side">
            {t.confirmAccount}
          </Link>
        </div>
      </Blueprint>
    </div>
  );
}
