import { Blueprint, SectionKicker } from "@/components/Blueprint";
import type { TourGuide } from "@/lib/types";

const VARSOM = "varsom.no";

/** Skredtekstene er ren tekst i datamodellen; den ene omtalen av varsom.no
 *  lenkes opp her, slik at innholdet slipper å bære markup. */
function AvalancheBody({ body }: { body: string }) {
  const at = body.indexOf(VARSOM);
  if (at === -1) return <>{body}</>;
  return (
    <>
      {body.slice(0, at)}
      <a href="https://varsom.no" target="_blank" rel="noopener">
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

/** 01 Oppstigning · 02 Nedkjøring · 03 Skredterreng — hele den lukkede delen
 *  av guiden. Rendres bare for abonnenter (se `app/tur/[slug]/page.tsx`). */
export function GuideSections({ guide }: { guide: TourGuide }) {
  return (
    <>
      <section style={{ padding: "0 0 40px" }}>
        <SectionKicker>01 · Oppstigning</SectionKicker>
        <Paragraphs items={guide.ascent} />
      </section>

      <section style={{ padding: "0 0 40px" }}>
        <SectionKicker>02 · Nedkjøring</SectionKicker>
        <Paragraphs items={guide.descent} />
      </section>

      <section style={{ padding: "0 0 40px" }}>
        <SectionKicker>03 · Skredterreng</SectionKicker>
        <div className="grid-auto" style={{ gap: "clamp(16px, 2.5vw, 32px)" }}>
          {guide.avalanche.map((cell) => (
            <Blueprint key={cell.title} style={{ padding: "18px 20px" }}>
              <h2 style={{ fontSize: 17, letterSpacing: "0.02em", textTransform: "uppercase", margin: "0 0 8px" }}>
                {cell.title}
              </h2>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: "22px",
                  margin: 0,
                  color: "color-mix(in srgb, var(--color-text) 78%, transparent)",
                }}
              >
                <AvalancheBody body={cell.body} />
              </p>
            </Blueprint>
          ))}
        </div>
      </section>
    </>
  );
}
