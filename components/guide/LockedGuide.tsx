import Link from "next/link";
import { Lock } from "lucide-react";
import { Blueprint } from "@/components/Blueprint";
import { PRICE, TRIAL_DAYS } from "@/lib/config";
import type { Lang } from "@/lib/i18n";
import { guideDict } from "@/lib/i18n/guide";

/** Låst tilstand: erstatter seksjon 01–03 for besøkende uten tilgang.
 *  Kart, nøkkeltall og høydeprofil står åpne, som i prototypen. */
export function LockedGuide({ lang }: { lang: Lang }) {
  const t = guideDict(lang);
  return (
    <Blueprint as="section" style={{ padding: 24, marginBottom: 40 }}>
      <span className="kicker" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <Lock size={14} strokeWidth={1.5} />
        {t.lockedTitle}
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
        {t.lockedBody(TRIAL_DAYS, PRICE.monthly.label)}
      </p>
      <Link className="btn btn-primary" href="/betaling">
        {t.lockedCta}
      </Link>
    </Blueprint>
  );
}
