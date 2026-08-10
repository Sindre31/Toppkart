import { Blueprint, SectionKicker } from "@/components/Blueprint";
import { CapsText } from "@/components/CapsText";
import type { Lang } from "@/lib/i18n";
import { guideDict } from "@/lib/i18n/guide";
import type { TourGuide } from "@/lib/types";

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
    <div style={{ maxWidth: "68ch", fontSize: 15, lineHeight: "24px" }}>
      {items.map((text, i) => (
        <p key={i} style={{ margin: i === items.length - 1 ? 0 : "0 0 16px" }}>
          {text}
        </p>
      ))}
    </div>
  );
}

/** Hvor mange avsnitt av oppstigninga som står åpne for en leser uten
 *  abonnement.
 *
 *  Ett. Det er nok til at sida sier noe ingen annen side sier — hvor turen
 *  starter, hvilken dal den går i, hvor skogen slipper — og lite nok til at
 *  ruta som helhet fortsatt er det man betaler for: guiden er åtte–ni avsnitt,
 *  og de som avgjør turen (det bratte partiet, nedkjøringa, skredterrenget)
 *  ligger alle bak muren.
 *
 *  Grunnen til at det ikke er null er at null var det som ikke virket. En
 *  utlogget robot så navnet, innledningen og fem tall på samtlige 86 tursider,
 *  altså den samme malen 86 ganger, og Google svarte med å la 54 av dem ligge
 *  uindeksert. En side som ikke er indeksert selger ingen abonnementer. Dette
 *  er ett tall å skru på: sett det til 0 for å stenge igjen, høyere for å åpne
 *  mer.
 */
export const PREVIEW_PARAGRAPHS = 1;

/** Åpningen av guiden, for den som ikke har abonnement.
 *
 *  Samme overskrift, samme `Paragraphs`, samme utseende som seksjon 01 under —
 *  det er med vilje. Leseren skal se begynnelsen på det som er der, ikke en
 *  egen «smakebit»-flate, og roboten skal se nøyaktig det leseren ser.
 *  `LockedGuide` kommer rett under og sier hva som mangler; sammen leses de to
 *  som én tekst som stopper. */
export function GuidePreview({ guide, lang }: { guide: TourGuide; lang: Lang }) {
  const t = guideDict(lang);
  const preview = guide.ascent.slice(0, PREVIEW_PARAGRAPHS);
  if (preview.length === 0) return null;

  return (
    <section style={{ padding: "0 0 24px" }}>
      <SectionKicker>01 · {t.ascentTitle}</SectionKicker>
      <Paragraphs items={preview} />
    </section>
  );
}

/** 01 Oppstigning · 02 Nedkjøring · 03 Skredterreng — hele den lukkede delen
 *  av guiden. Rendres bare for abonnenter (se `app/tur/[slug]/page.tsx`).
 *
 *  `guide` is expected to be localised already (`getLocalizedGuide`); the
 *  headings come from the dictionary. */
export function GuideSections({ guide, lang }: { guide: TourGuide; lang: Lang }) {
  const t = guideDict(lang);
  return (
    <>
      <section style={{ padding: "0 0 40px" }}>
        <SectionKicker>01 · {t.ascentTitle}</SectionKicker>
        <Paragraphs items={guide.ascent} />
      </section>

      <section style={{ padding: "0 0 40px" }}>
        <SectionKicker>02 · {t.descentTitle}</SectionKicker>
        <Paragraphs items={guide.descent} />
      </section>

      <section style={{ padding: "0 0 40px" }}>
        <SectionKicker>03 · {t.avalancheTitle}</SectionKicker>
        <div className="grid-auto" style={{ gap: "clamp(16px, 2.5vw, 32px)" }}>
          {guide.avalanche.map((cell) => (
            <Blueprint key={cell.title} style={{ padding: "18px 20px" }}>
              <h2 style={{ fontSize: 17, letterSpacing: "0.02em", textTransform: "uppercase", margin: "0 0 8px" }}>
                <CapsText>{cell.title}</CapsText>
              </h2>
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
