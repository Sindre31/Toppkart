import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { isSupabaseConfigured } from "@/lib/config";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Logg inn" };

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
  const linkFailed = first(params.feil) === "1";

  return (
    <div className="shell">
      <SiteNav>
        <Link href="/kart">Kartet</Link>
      </SiteNav>

      <main style={{ display: "grid", placeItems: "center", padding: "48px 20px" }}>
        <div style={{ width: "min(420px, 100%)" }}>
          <LoginForm
            initialEmail={email}
            next={next}
            demoMode={!isSupabaseConfigured}
            linkFailed={linkFailed}
          />
          <p className="note" style={{ margin: "16px 0 0", textAlign: "center" }}>
            Ny her? <Link href="/betaling">Prøv gratis i 14 dager — deretter 29 kr/mnd</Link>
          </p>
        </div>
      </main>

      <div className="page">
        <SiteFooter />
      </div>
    </div>
  );
}
