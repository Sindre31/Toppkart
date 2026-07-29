"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Blueprint } from "@/components/Blueprint";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="shell">
      <main style={{ display: "grid", placeItems: "center", padding: "48px 20px" }}>
        <Blueprint style={{ padding: 32, width: "min(480px, 100%)" }}>
          <span className="kicker">Noe gikk galt</span>
          <h1 style={{ fontSize: 34, lineHeight: 1.08, letterSpacing: "0.02em", textTransform: "uppercase", margin: "10px 0 0" }}>
            Uventet feil
          </h1>
          <p className="prose" style={{ margin: "12px 0 0" }}>
            Vi klarte ikke å laste siden. Prøv på nytt — hjelper det ikke, gå tilbake til kartet.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 22 }}>
            <button type="button" className="btn btn-primary" onClick={reset}>
              Prøv på nytt
            </button>
            <Link className="btn btn-secondary" href="/kart">
              Åpne kartet
            </Link>
          </div>
        </Blueprint>
      </main>
    </div>
  );
}
