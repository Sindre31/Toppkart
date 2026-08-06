import { Blueprint } from "@/components/Blueprint";
import { CapsText } from "@/components/CapsText";
import type { Lang } from "@/lib/i18n";
import { guideDict } from "@/lib/i18n/guide";
import type { TourGuide } from "@/lib/types";

/** Høydeprofil — arealgraf over viewBox «0 0 600 220».
 *
 *  `profile.path` er selve linja; arealet under den lukkes her ved å føye til
 *  nedre kant, slik at guideinnholdet bare trenger å bære én path. Nullpunktet
 *  på x-aksen er alltid «0 km» og ligger derfor i visningen, ikke i dataene.
 *
 *  The labels arrive already localised (`localizeGuide`); only the heading and
 *  the accessible description come from the dictionary. */
export function ElevationProfile({
  profile,
  lang,
}: {
  profile: TourGuide["elevationProfile"];
  lang: Lang;
}) {
  const t = guideDict(lang);
  const area = `${profile.path} L600,220 L0,220 Z`;

  return (
    <Blueprint style={{ padding: "18px 20px" }}>
      <h2 style={{ fontSize: 18, letterSpacing: "0.02em", textTransform: "uppercase", margin: "0 0 12px" }}>
        <CapsText>{t.elevationTitle}</CapsText>
      </h2>
      <svg
        viewBox="0 0 600 220"
        style={{ width: "100%", height: "auto", display: "block" }}
        role="img"
        aria-label={t.elevationAria(profile.startLabel, profile.endLabel, profile.distanceLabel)}
      >
        <line x1="0" y1="55" x2="600" y2="55" stroke="#1d1f2029" strokeWidth="1" />
        <line x1="0" y1="110" x2="600" y2="110" stroke="#1d1f2029" strokeWidth="1" />
        <line x1="0" y1="165" x2="600" y2="165" stroke="#1d1f2029" strokeWidth="1" />
        <path d={area} fill="#5980a626" />
        <path d={profile.path} fill="none" stroke="#416180" strokeWidth="2.5" />
        <text x="6" y="196" fontSize="13" fill="#5d5d60" fontFamily="monospace">
          {profile.startLabel}
        </text>
        <text x="452" y="16" fontSize="13" fill="#5d5d60" fontFamily="monospace">
          {profile.endLabel}
        </text>
        <text x="6" y="216" fontSize="13" fill="#5d5d60" fontFamily="monospace">
          0 km
        </text>
        <text x="548" y="216" fontSize="13" fill="#5d5d60" fontFamily="monospace">
          {profile.distanceLabel}
        </text>
      </svg>
      <p className="note" style={{ margin: "12px 0 0" }}>
        {profile.caption}
      </p>
    </Blueprint>
  );
}
