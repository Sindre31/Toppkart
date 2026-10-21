import type { Metadata } from "next";
import Image from "next/image";

import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import styles from "@/components/landing/landing.module.css";
import { MyTours, type MyTourInfo } from "@/components/marks/MyTours";
import { getLang } from "@/lib/i18n/server";
import { localizeTours } from "@/lib/i18n/content";
import { marksDict } from "@/lib/i18n/marks";
import { TOURS } from "@/lib/tours";

export async function generateMetadata(): Promise<Metadata> {
  const t = marksDict(await getLang());
  /* Innholdet er leserens egen liste, lest i nettleseren. En robot ser en tom
     side, og det er ingenting her å finne i et søk. */
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    robots: { index: false, follow: true },
  };
}

/** `/mine-turer` — favorittene og turene leseren har gått.
 *
 *  Lista ligger på enheten (se `components/marks/useTourMarks.ts`); serveren
 *  sender bare navn, region og høydemeter for hver tur, ferdig oversatt, så
 *  klienten kan slå opp det den finner der uten å laste turkatalogen. */
export default async function MineTurerPage() {
  const lang = await getLang();
  const t = marksDict(lang);
  const tours: MyTourInfo[] = localizeTours(TOURS, lang).map(({ slug, name, region, verticalM }) => ({
    slug,
    name,
    region,
    verticalM,
  }));

  return (
    <div className="shell">
      {/* Relieffet fra `/om`, bak hele vinduet (se `.pageBackdrop`). Dekor,
          derfor tom alt. */}
      <div className={styles.pageBackdrop} aria-hidden>
        <div className={styles.backdropFrame}>
          <Image src="/assets/hero-relief.webp" alt="" fill priority sizes="(max-width: 760px) 170vw, 78vw" />
        </div>
      </div>

      <SiteNav lang={lang} current="/mine-turer" />

      <main className={`page ${styles.fullPage}`}>
        <header className={styles.pageHeader}>
          <h1 className="display" style={{ fontSize: "clamp(56px, 6.5vw, 84px)" }}>
            {t.heading}
          </h1>
        </header>

        <MyTours tours={tours} lang={lang} />

        <SiteFooter lang={lang} />
      </main>
    </div>
  );
}
