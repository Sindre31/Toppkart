import { Blueprint } from "@/components/Blueprint";
import { TRIAL_DAYS } from "@/lib/config";

/** «Oppsummering» — blueprint-plate med tittelblokk, planrad, prøveperiode-
 *  fradrag, hårstrek og «Å betale i dag». Datoen for første trekk regnes ut
 *  fra dagen i dag (i dag + 14 dager), ikke hardkodet som i prototypen. */
export function Summary({
  planLabel,
  planPrice,
  firstChargeDate,
}: {
  planLabel: string;
  planPrice: string;
  firstChargeDate: string;
}) {
  return (
    <Blueprint as="section" style={{ padding: 0 }}>
      <header
        style={{
          padding: "14px 22px",
          borderBottom: "1px solid var(--color-divider)",
          fontSize: 13,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        Oppsummering
      </header>
      <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 15 }}>
          <span>{planLabel}</span>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 600,
              fontSize: 18,
              whiteSpace: "nowrap",
            }}
          >
            {planPrice}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 15 }}>
          <span>Prøveperiode {TRIAL_DAYS} dager</span>
          <span
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 600,
              fontSize: 18,
              color: "var(--color-accent-700)",
              whiteSpace: "nowrap",
            }}
          >
            − {planPrice}
          </span>
        </div>
        <hr style={{ height: 1, border: 0, margin: "4px 0", background: "var(--color-divider)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
          <span style={{ fontSize: 15, fontWeight: 700 }}>Å betale i dag</span>
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 32 }}>0 kr</span>
        </div>
        <p className="note" style={{ margin: "4px 0 0" }}>
          Første trekk ({planPrice}) den {firstChargeDate}. Avslutt før det, så trekkes ingenting.
        </p>
      </div>
    </Blueprint>
  );
}
