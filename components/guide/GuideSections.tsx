import type { ReactNode } from "react";

import type { Lang } from "@/lib/i18n";
import { guideDict } from "@/lib/i18n/guide";
import type { TourGuide } from "@/lib/types";
import { leadIn, slopeFigure } from "./stages";
import styles from "./GuideSections.module.css";

const VARSOM = "varsom.no";

/** Skredtekstene er ren tekst i datamodellen; den ene omtalen av varsom.no
 *  lenkes opp her, slik at innholdet slipper å bære markup. Domenet er det
 *  samme på begge språk, så den engelske teksten lenkes på samme måte. */
function AvalancheBody({ body, linkTitle }: { body: string; linkTitle: string }) {
  const at = body.indexOf(VARSOM);
  if (at === -1) return <>{body}</>;
  return (
    <>
      {body.slice(0, at)}
      <a href="https://varsom.no" target="_blank" rel="noopener" title={linkTitle}>
        {VARSOM}
      </a>
      {body.slice(at + VARSOM.length)}
    </>
  );
}

/** Ankrene i guiden. Norske ord også på engelsk: en delt lenke til
 *  `#nedkjoring` skal virke uansett språk. Innholdslista er borte — kartet står
 *  ved siden av teksten nå — men ankrene står, så gamle lenker lander riktig. */
export const GUIDE_ANCHORS = {
  conditions: "forhold",
  route: "rute",
  ascent: "oppstigning",
  descent: "nedkjoring",
  avalanche: "skredterreng",
} as const;

/** Seksjon i lesekolonnen: en `h2` i Instrument Serif over innholdet. */
export function GuideSection({
  id,
  title,
  aside,
  children,
}: {
  id?: string;
  title: string;
  /** Dempet tekst til høyre for overskriften. */
  aside?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={styles.section}>
      {aside ? (
        <div className={styles.headRow}>
          <h2 className={styles.heading}>{title}</h2>
          <span className={styles.aside}>{aside}</span>
        </div>
      ) : (
        <h2 className={styles.heading}>{title}</h2>
      )}
      {children}
    </section>
  );
}

/** «Ned» og «Skredterreng» — det som kommer etter oppstigningen.
 *
 *  Nedkjøringen er en punktliste: hvert avsnitt et punkt, med det korte
 *  innledende leddet («Vanligste feil:») i fet skrift når avsnittet har ett.
 *  Skredterrenget er kort med gradtallet stort, når teksten nevner ett.
 *
 *  `guide` er allerede oversatt (`getLocalizedGuide`); overskriftene kommer
 *  fra ordboka. */
export function GuideSections({ guide, lang }: { guide: TourGuide; lang: Lang }) {
  const t = guideDict(lang);
  return (
    <>
      <GuideSection id={GUIDE_ANCHORS.descent} title={t.downTitle}>
        <ul className={styles.bullets}>
          {guide.descent.map((text, i) => {
            const { lead, rest } = leadIn(text);
            return (
              <li key={i}>
                <span className={styles.bullet} aria-hidden="true" />
                <span>
                  {lead ? <strong>{lead}</strong> : null}
                  {rest}
                </span>
              </li>
            );
          })}
        </ul>
      </GuideSection>

      <GuideSection id={GUIDE_ANCHORS.avalanche} title={t.avalancheTitle}>
        <div className={styles.cards}>
          {guide.avalanche.map((cell) => {
            const figure = slopeFigure(cell.body);
            return (
              <div key={cell.title} className={styles.card}>
                <div className={styles.cardLabel}>{cell.title}</div>
                {figure ? <div className={styles.cardFigure}>{figure}</div> : null}
                <p className={styles.cardBody}>
                  <AvalancheBody body={cell.body} linkTitle={t.varsomLinkTitle} />
                </p>
              </div>
            );
          })}
        </div>
      </GuideSection>
    </>
  );
}
