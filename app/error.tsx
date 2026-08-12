"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Blueprint } from "@/components/Blueprint";
import { DEFAULT_LANG, LANG_COOKIE, toLang, type Lang } from "@/lib/i18n";
import { systemDict } from "@/lib/i18n/system";

/** Reads the language straight off `document.cookie`.
 *
 *  An error boundary has to be a Client Component, so it cannot await
 *  `getLang()` — and it renders when the tree below it has already failed, so
 *  it cannot rely on a `lang` prop from a Server Component either. Reading the
 *  same `tk_lang` cookie the server reads keeps the two in step without a new
 *  cookie or a provider. The name comes from `LANG_COOKIE` so the two readers
 *  can never drift apart.
 */
function readLangCookie(): Lang {
  const match = document.cookie.match(new RegExp(`(?:^|; )${LANG_COOKIE}=([^;]*)`));
  return toLang(match ? decodeURIComponent(match[1]) : undefined);
}

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  // Norwegian for the first paint — the cookie is only readable once mounted,
  // and the default language is the one most readers are already on.
  const [lang, setLang] = useState<Lang>(DEFAULT_LANG);
  const t = systemDict(lang);

  /* Regelen har rett i det generelle: å sette tilstand fra en effekt gir en
     ekstra rendring. Her er den ekstra rendringa hele poenget. `document.cookie`
     finnes ikke under prerendringa, så språket kan ikke leses før komponenten
     står i nettleseren — og leses det i rendringa i stedet, spriker serverens
     HTML og klientens første rendring, som er en hydreringsfeil på en side som
     allerede vises fordi noe annet gikk galt.
     Feilgrensa kan heller ikke få språket inn som en prop: Next kaller den med
     `error` og `reset`, og ikke noe annet. */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLang(readLangCookie());
  }, []);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="shell">
      <main style={{ display: "grid", placeItems: "center", padding: "48px 20px" }}>
        <Blueprint style={{ padding: 32, width: "min(480px, 100%)" }}>
          <span className="kicker">{t.errorKicker}</span>
          <h1 style={{ fontSize: 34, lineHeight: 1.08, letterSpacing: "0.02em", textTransform: "uppercase", margin: "10px 0 0" }}>
            {t.errorTitle}
          </h1>
          <p className="prose" style={{ margin: "12px 0 0" }}>
            {t.errorBody}
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 22 }}>
            <button type="button" className="btn btn-primary" onClick={reset}>
              {t.errorRetry}
            </button>
            <Link className="btn btn-secondary" href="/kart">
              {t.errorMap}
            </Link>
          </div>
        </Blueprint>
      </main>
    </div>
  );
}
