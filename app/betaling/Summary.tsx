import { Blueprint } from "@/components/Blueprint";
import { TRIAL_DAYS } from "@/lib/config";
import type { Lang } from "@/lib/i18n";
import { checkoutDict, priceLabel } from "@/lib/i18n/checkout";

/** «Oppsummering» — blueprint-plate med tittelblokk, planrad, prøveperiode-
 *  fradrag, hårstrek og «Å betale i dag». Datoen for første trekk regnes ut
 *  fra dagen i dag (i dag + 14 dager), ikke hardkodet som i prototypen.
 *
 *  `planLabel` and `planPrice` arrive already localised from the page. */
export function Summary({
  lang,
  planLabel,
  planPrice,
  firstChargeDate,
}: {
  lang: Lang;
  planLabel: string;
  planPrice: string;
  firstChargeDate: string;
}) {
  const t = checkoutDict(lang);
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
        {t.summaryHeading}
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
          <span>{t.trialRow(TRIAL_DAYS)}</span>
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
          <span style={{ fontSize: 15, fontWeight: 700 }}>{t.dueToday}</span>
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 32 }}>
            {priceLabel(0)}
          </span>
        </div>
        <p className="note" style={{ margin: "4px 0 0" }}>
          {t.firstCharge(planPrice, firstChargeDate)}
        </p>
      </div>
    </Blueprint>
  );
}
