import type { Metadata } from "next";
import Link from "next/link";

import { Blueprint, SectionKicker } from "@/components/Blueprint";
import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { requireAdmin } from "@/lib/admin";
import { formatDateTime } from "@/lib/dates";
import { getLang } from "@/lib/i18n/server";
import { commonDict } from "@/lib/i18n/common";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

import { setHandled } from "./actions";

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
  handled_at: string | null;
}

const MUTED = "color-mix(in srgb, var(--color-text) 60%, transparent)";
const HAIRLINE = "1px solid color-mix(in srgb, var(--color-text) 8%, transparent)";

function Message({ row }: { row: FeedbackRow }) {
  const handled = Boolean(row.handled_at);
  return (
    <Blueprint style={{ padding: "18px 22px", opacity: handled ? 0.72 : 1 }}>
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
        <span style={{ fontSize: 13, fontWeight: 600 }}>{row.email ?? "Ikke innlogget"}</span>
        <span style={{ fontSize: 12, color: MUTED, marginLeft: "auto" }}>
          {formatDateTime(row.created_at, "no")}
        </span>
      </div>

      {/* `pre-wrap` because people press Enter, and a feedback note collapsed
          into one paragraph loses the shape they gave it. */}
      <p className="prose" style={{ margin: "12px 0 0", whiteSpace: "pre-wrap", maxWidth: "72ch" }}>
        {row.message}
      </p>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
          marginTop: 14,
        }}
      >
        <span className="note-sm" style={{ margin: 0 }}>
          {row.path ? `Skrevet fra ${row.path}` : null}
          {row.path && row.lang ? " · " : null}
          {row.lang ? row.lang.toUpperCase() : null}
          {handled ? `${row.path || row.lang ? " · " : ""}Behandlet ${formatDateTime(row.handled_at!, "no")}` : null}
        </span>

        {/* A plain form, so the buttons work with JavaScript off. The desired
            state travels in the payload rather than being inferred from the
            row, so two open tabs cannot flip each other's change. */}
        <form action={setHandled} style={{ margin: "0 0 0 auto" }}>
          <input type="hidden" name="id" value={row.id} />
          <input type="hidden" name="handled" value={handled ? "0" : "1"} />
          <button type="submit" className={`btn ${handled ? "btn-secondary" : "btn-primary"}`}>
            {handled ? "Merk som ubehandlet" : "Merk som behandlet"}
          </button>
        </form>
      </div>
    </Blueprint>
  );
}

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
      .select("id, created_at, email, message, path, lang, handled_at")
      .order("created_at", { ascending: false })
      .limit(MAX_ROWS);
    if (error) {
      console.error("[admin/tilbakemeldinger] kunne ikke lese:", error.message);
      failed = true;
    } else {
      rows = (data ?? []) as FeedbackRow[];
    }
  }

  /* Partitioned here rather than in SQL. «Unhandled first, then newest first»
     is two sort keys the query builder cannot express in one `order`, and at
     200 rows the split costs nothing. */
  const unhandled = rows.filter((row) => !row.handled_at);
  const handled = rows.filter((row) => row.handled_at);

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
                : `${unhandled.length} ubehandlet, ${handled.length} behandlet.${
                    rows.length === MAX_ROWS
                      ? ` Viser de ${MAX_ROWS} nyeste — det finnes flere.`
                      : ""
                  }`}
          </p>
        </header>

        {failed ? (
          <section style={{ marginTop: 32 }}>
            <SectionKicker>01 · Innboks</SectionKicker>
            <Blueprint style={{ padding: "24px 28px" }}>
              <p className="prose" style={{ margin: 0 }}>
                Tabellen svarte ikke. Vanligste årsak er at{" "}
                <code>SUPABASE_SERVICE_ROLE_KEY</code> mangler i miljøet — uten den kan ingenting
                lese <code>tk_feedback</code>, som med vilje er utilgjengelig for alle andre roller.
              </p>
            </Blueprint>
          </section>
        ) : rows.length === 0 ? (
          <section style={{ marginTop: 32 }}>
            <SectionKicker>01 · Innboks</SectionKicker>
            <Blueprint style={{ padding: "24px 28px" }}>
              <p className="prose" style={{ margin: 0 }}>
                Ingenting har kommet inn. Knappen står nederst til høyre på alle sider unntatt
                kartet.
              </p>
            </Blueprint>
          </section>
        ) : (
          <>
            <section style={{ marginTop: 32 }}>
              <SectionKicker>01 · Ubehandlet ({unhandled.length})</SectionKicker>
              {unhandled.length === 0 ? (
                <Blueprint style={{ padding: "24px 28px" }}>
                  <p className="prose" style={{ margin: 0 }}>
                    Alt er behandlet.
                  </p>
                </Blueprint>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {unhandled.map((row) => (
                    <Message key={row.id} row={row} />
                  ))}
                </div>
              )}
            </section>

            {handled.length > 0 && (
              <section style={{ marginTop: 44 }}>
                <SectionKicker>02 · Behandlet ({handled.length})</SectionKicker>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {handled.map((row) => (
                    <Message key={row.id} row={row} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <SiteFooter lang={lang} />
    </div>
  );
}
