import type { Metadata } from "next";
import Link from "next/link";

import { Blueprint, SectionKicker } from "@/components/Blueprint";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { requireAdmin } from "@/lib/admin";
import { formatDateTime } from "@/lib/dates";
import { getLang } from "@/lib/i18n/server";
import { commonDict } from "@/lib/i18n/common";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

/** `/admin/tilbakemeldinger` — the messages from the feedback button.
 *
 *  Norwegian only, deliberately, and the one page in the app that breaks the
 *  NO/EN rule. It is operator tooling with a single reader, not product: a
 *  second column of translations would be maintained for nobody.
 *
 *  Reading needs the service role. `tk_feedback` has RLS on and no policies at
 *  all, so the anon and authenticated clients see nothing no matter who is
 *  signed in — the gate is `requireAdmin()` above the query, not the database.
 */

export const metadata: Metadata = {
  title: "Tilbakemeldinger",
  robots: { index: false, follow: false },
};

/** Never cached: it is a live list of what people just wrote, and it is
 *  per-viewer by definition. */
export const dynamic = "force-dynamic";

const MAX_ROWS = 200;

interface FeedbackRow {
  id: string;
  created_at: string;
  email: string | null;
  message: string;
  path: string | null;
  lang: string | null;
}

const MUTED = "color-mix(in srgb, var(--color-text) 60%, transparent)";
const HAIRLINE = "1px solid color-mix(in srgb, var(--color-text) 8%, transparent)";

export default async function TilbakemeldingerPage() {
  await requireAdmin();

  const lang = await getLang();
  const c = commonDict(lang);
  const admin = getSupabaseAdminClient();

  let rows: FeedbackRow[] = [];
  let failed = false;

  if (!admin) {
    failed = true;
  } else {
    const { data, error } = await admin
      .from("tk_feedback")
      .select("id, created_at, email, message, path, lang")
      .order("created_at", { ascending: false })
      .limit(MAX_ROWS);
    if (error) {
      console.error("[admin/tilbakemeldinger] kunne ikke lese:", error.message);
      failed = true;
    } else {
      rows = (data ?? []) as FeedbackRow[];
    }
  }

  return (
    <div className="shell">
      <SiteNav lang={lang}>
        <Link href="/kart">{c.map}</Link>
        <Link className="nav-muted" href="/min-side">
          {c.account}
        </Link>
      </SiteNav>

      <main className="page page-narrow" style={{ paddingBottom: 72 }}>
        <header style={{ padding: "48px 0 8px" }}>
          <span className="kicker">Admin</span>
          <h1
            style={{
              fontSize: "clamp(30px, 4vw, 44px)",
              lineHeight: 1.08,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
              margin: "10px 0 0",
            }}
          >
            Tilbakemeldinger
          </h1>
          <p className="note" style={{ margin: "14px 0 0" }}>
            {failed
              ? "Klarte ikke å lese tabellen."
              : rows.length === 0
                ? "Ingen tilbakemeldinger ennå."
                : rows.length === MAX_ROWS
                  ? `Viser de ${MAX_ROWS} nyeste. Det finnes flere — hent resten i SQL-editoren.`
                  : `${rows.length} ${rows.length === 1 ? "melding" : "meldinger"}, nyeste først.`}
          </p>
        </header>

        <section style={{ marginTop: 32 }}>
          <SectionKicker>01 · Innboks</SectionKicker>

          {failed ? (
            <Blueprint style={{ padding: "24px 28px" }}>
              <p className="prose" style={{ margin: 0 }}>
                Tabellen svarte ikke. Vanligste årsak er at{" "}
                <code>SUPABASE_SERVICE_ROLE_KEY</code> mangler i miljøet — uten den kan ingenting
                lese <code>tk_feedback</code>, som med vilje er utilgjengelig for alle andre roller.
              </p>
            </Blueprint>
          ) : rows.length === 0 ? (
            <Blueprint style={{ padding: "24px 28px" }}>
              <p className="prose" style={{ margin: 0 }}>
                Ingenting har kommet inn. Knappen står nederst til høyre på alle sider unntatt
                kartet.
              </p>
            </Blueprint>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {rows.map((row) => (
                <Blueprint key={row.id} style={{ padding: "18px 22px" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      flexWrap: "wrap",
                      alignItems: "baseline",
                      paddingBottom: 12,
                      borderBottom: HAIRLINE,
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 600 }}>
                      {row.email ?? "Ikke innlogget"}
                    </span>
                    <span style={{ fontSize: 12, color: MUTED, marginLeft: "auto" }}>
                      {formatDateTime(row.created_at, "no")}
                    </span>
                  </div>

                  {/* `pre-wrap` because people press Enter, and a feedback note
                      collapsed into one paragraph loses the shape they gave it. */}
                  <p
                    className="prose"
                    style={{ margin: "12px 0 0", whiteSpace: "pre-wrap", maxWidth: "72ch" }}
                  >
                    {row.message}
                  </p>

                  {(row.path || row.lang) && (
                    <p className="note-sm" style={{ margin: "12px 0 0" }}>
                      {row.path ? `Skrevet fra ${row.path}` : null}
                      {row.path && row.lang ? " · " : null}
                      {row.lang ? row.lang.toUpperCase() : null}
                    </p>
                  )}
                </Blueprint>
              ))}
            </div>
          )}
        </section>
      </main>

      <SiteFooter lang={lang} />
    </div>
  );
}
