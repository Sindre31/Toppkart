import Link from "next/link";
import { Lock } from "lucide-react";
import { Blueprint } from "@/components/Blueprint";
import { PRICE, TRIAL_DAYS } from "@/lib/config";

/** Låst tilstand: erstatter seksjon 01–03 for besøkende uten tilgang.
 *  Kart, nøkkeltall og høydeprofil står åpne, som i prototypen. */
export function LockedGuide() {
  return (
    <Blueprint as="section" style={{ padding: 24, marginBottom: 40 }}>
      <span className="kicker" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <Lock size={14} strokeWidth={1.5} />
        Resten av guiden er låst
      </span>
      <p
        style={{
          fontSize: 14,
          lineHeight: "22px",
          margin: "10px 0 16px",
          color: "color-mix(in srgb, var(--color-text) 70%, transparent)",
          maxWidth: "52ch",
        }}
      >
        Rutebeskrivelse, nedkjøring og skredterreng åpnes med abonnement — {TRIAL_DAYS} dager gratis, deretter{" "}
        {PRICE.monthly.label}/mnd.
      </p>
      <Link className="btn btn-primary" href="/betaling">
        Start gratis prøveperiode
      </Link>
    </Blueprint>
  );
}
