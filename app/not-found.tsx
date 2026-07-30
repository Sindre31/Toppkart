import type { Metadata } from "next";
import Link from "next/link";
import { Blueprint } from "@/components/Blueprint";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { getLang } from "@/lib/i18n/server";
import { commonDict } from "@/lib/i18n/common";
import { systemDict } from "@/lib/i18n/system";

export async function generateMetadata(): Promise<Metadata> {
  const t = systemDict(await getLang());
  return { title: t.notFoundMetaTitle };
}

export default async function NotFound() {
  const lang = await getLang();
  const t = systemDict(lang);
  const c = commonDict(lang);

  return (
    <div className="shell">
      <SiteNav lang={lang}>
        <Link href="/kart">{c.map}</Link>
      </SiteNav>
      <main style={{ display: "grid", placeItems: "center", padding: "48px 20px" }}>
        <Blueprint style={{ padding: 32, width: "min(480px, 100%)" }}>
          <span className="kicker">{t.notFoundKicker}</span>
          <h1 style={{ fontSize: 34, lineHeight: 1.08, letterSpacing: "0.02em", textTransform: "uppercase", margin: "10px 0 0" }}>
            {t.notFoundTitle}
          </h1>
          <p className="prose" style={{ margin: "12px 0 0" }}>
            {t.notFoundBody}
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 22 }}>
            <Link className="btn btn-primary" href="/kart">
              {t.notFoundMap}
            </Link>
            <Link className="btn btn-secondary" href="/">
              {t.notFoundHome}
            </Link>
          </div>
        </Blueprint>
      </main>
      <SiteFooter lang={lang} />
    </div>
  );
}
