import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { isSupabaseConfigured } from "@/lib/config";
import { getLang } from "@/lib/i18n/server";
import { accountDict } from "@/lib/i18n/account";
import { commonDict } from "@/lib/i18n/common";
import LoginForm from "./LoginForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = accountDict(await getLang());
  return { title: t.loginMetaTitle, description: t.loginMetaDescription };
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

/** `?next=` is attacker-controlled: only same-origin relative paths pass. */
function safeNext(value: string): string {
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return "/kart";
  return value;
}

export default async function LoggInnPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const next = safeNext(first(params.next));
  const email = first(params.email);
  const failure = first(params.feil);
  const linkFailed = failure === "1";
  const googleFailed = failure === "google";

  const lang = await getLang();
  const t = accountDict(lang);
  const c = commonDict(lang);

  return (
    <div className="shell">
      <SiteNav lang={lang}>
        <Link href="/kart">{c.map}</Link>
      </SiteNav>

      <main style={{ display: "grid", placeItems: "center", padding: "48px 20px" }}>
        <div style={{ width: "min(420px, 100%)" }}>
          <LoginForm
            initialEmail={email}
            next={next}
            demoMode={!isSupabaseConfigured}
            linkFailed={linkFailed}
            googleFailed={googleFailed}
            lang={lang}
          />
          <p className="note" style={{ margin: "16px 0 0", textAlign: "center" }}>
            {t.newHere} <Link href="/betaling">{t.newHereLink}</Link>
          </p>
        </div>
      </main>

      <div className="page">
        <SiteFooter lang={lang} />
      </div>
    </div>
  );
}
