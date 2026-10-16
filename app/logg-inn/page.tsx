import type { Metadata } from "next";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { getLang } from "@/lib/i18n/server";
import { accountDict } from "@/lib/i18n/account";
import LoginForm from "./LoginForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = accountDict(await getLang());
  /* `?next=` gjør innloggingssida til like mange adresser som det er sider å
     komme fra. Ingen av dem skal rangere på noe. */
  return {
    title: t.loginMetaTitle,
    description: t.loginMetaDescription,
    robots: { index: false, follow: true },
  };
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function first(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

/** Where a sign-in lands by default: the only thing a session is for. */
const ADMIN_HOME = "/admin/tilbakemeldinger";

/** `?next=` is attacker-controlled: only same-origin relative paths pass. */
function safeNext(value: string): string {
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return ADMIN_HOME;
  return value;
}

/** `?feil=` comes back from `/auth/callback`; anything else is ignored. */
function failureOf(value: string): "google" | "1" | null {
  return value === "google" || value === "1" ? value : null;
}

export default async function LoggInnPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const next = safeNext(first(params.next));
  const failure = failureOf(first(params.feil));

  const lang = await getLang();

  return (
    <div className="shell">
      <SiteNav lang={lang} />

      <main style={{ display: "grid", placeItems: "center", padding: "48px 20px" }}>
        <div style={{ width: "min(420px, 100%)" }}>
          <LoginForm next={next} failure={failure} lang={lang} />
        </div>
      </main>

      <div className="page">
        <SiteFooter lang={lang} />
      </div>
    </div>
  );
}
