import { Blueprint } from "@/components/Blueprint";
import { CapsText } from "@/components/CapsText";
import type { Lang } from "@/lib/i18n";
import { guideDict } from "@/lib/i18n/guide";
import type { TourGuide } from "@/lib/types";
import styles from "./GuideSections.module.css";

const VARSOM = "varsom.no";

/** Skredtekstene er ren tekst i datamodellen; den ene omtalen av varsom.no
 *  lenkes opp her, slik at innholdet slipper å bære markup. The domain is the
 *  same in both languages, so the English prose links itself the same way. */
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

function Paragraphs({ items }: { items: string[] }) {
  return (
    <div className={styles.prose}>
      {items.map((text, i) => (
        <p key={i}>{text}</p>
      ))}
    </div>
  );
}

/** Ankrene i guiden. Innholdslista (`GuideToc`) og seksjonene leser dem
 *  herfra, så en lenke aldri peker på et id som er omdøpt. Norske ord også på
 *  engelsk: en delt lenke til `#nedkjoring` skal virke uansett språk. */
export const GUIDE_ANCHORS = {
  conditions: "forhold",
  route: "rute",
  ascent: "oppstigning",
  descent: "nedkjoring",
  avalanche: "skredterreng",
} as const;

/** Seksjonsoverskrift i guiden: nummeret og tittelen som en ekte `h2`, over en
 *  hårstrek.
 *
 *  Tidligere sto tittelen som en 13px-kicker («01 · OPPSTIGNING») — riktig som
 *  etikett på en side man leser fra toppen, men for liten til å finne igjen når
 *  man ruller tilbake etter nedkjøringen. Nummeret er det samme som i
 *  innholdslista, så de to peker på hverandre. */
export function GuideHeading({ num, children }: { num: number; children: string }) {
  return (
    <>
      <h2 className={styles.heading}>
        <span className={styles.num}>{String(num).padStart(2, "0")}</span>
        {/* Egen `span`: overskriften er en flex-rad, og uten den ble hver
            bit `CapsText` deler teksten i («NEDKJ», «Ø», «RING») et eget
            flex-element med mellomrom imellom. */}
        <span>
          <CapsText>{children}</CapsText>
        </span>
      </h2>
      <hr className={styles.rule} />
    </>
  );
}

/** Oppstigning · Nedkjøring · Skredterreng — hele guideteksten.
 *
 *  `guide` is expected to be localised already (`getLocalizedGuide`); the
 *  headings come from the dictionary. `firstNum` is the number of the first of
 *  the three, since the page puts its own sections ahead of them. */
export function GuideSections({
  guide,
  lang,
  firstNum,
}: {
  guide: TourGuide;
  lang: Lang;
  firstNum: number;
}) {
  const t = guideDict(lang);
  return (
    <>
      <section id={GUIDE_ANCHORS.ascent} className={styles.section}>
        <GuideHeading num={firstNum}>{t.ascentTitle}</GuideHeading>
        <Paragraphs items={guide.ascent} />
      </section>

      <section id={GUIDE_ANCHORS.descent} className={styles.section}>
        <GuideHeading num={firstNum + 1}>{t.descentTitle}</GuideHeading>
        <Paragraphs items={guide.descent} />
      </section>

      <section id={GUIDE_ANCHORS.avalanche} className={styles.section}>
        <GuideHeading num={firstNum + 2}>{t.avalancheTitle}</GuideHeading>
        <div className="grid-auto" style={{ gap: "clamp(16px, 2.5vw, 32px)" }}>
          {guide.avalanche.map((cell) => (
            <Blueprint key={cell.title} style={{ padding: "18px 20px" }}>
              <h3 style={{ fontSize: 17, letterSpacing: "0.02em", textTransform: "uppercase", margin: "0 0 8px" }}>
                <CapsText>{cell.title}</CapsText>
              </h3>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: "22px",
                  margin: 0,
                  color: "color-mix(in srgb, var(--color-text) 78%, transparent)",
                }}
              >
                <AvalancheBody body={cell.body} linkTitle={t.varsomLinkTitle} />
              </p>
            </Blueprint>
          ))}
        </div>
      </section>
    </>
  );
}
