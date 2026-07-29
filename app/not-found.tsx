import Link from "next/link";
import { Blueprint } from "@/components/Blueprint";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";

export const metadata = { title: "Siden finnes ikke" };

export default function NotFound() {
  return (
    <div className="shell">
      <SiteNav>
        <Link href="/kart">Kartet</Link>
      </SiteNav>
      <main style={{ display: "grid", placeItems: "center", padding: "48px 20px" }}>
        <Blueprint style={{ padding: 32, width: "min(480px, 100%)" }}>
          <span className="kicker">Feil 404</span>
          <h1 style={{ fontSize: 34, lineHeight: 1.08, letterSpacing: "0.02em", textTransform: "uppercase", margin: "10px 0 0" }}>
            Utenfor kartet
          </h1>
          <p className="prose" style={{ margin: "12px 0 0" }}>
            Siden du leter etter finnes ikke. Den kan ha flyttet seg, eller lenken kan være skrevet feil.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 22 }}>
            <Link className="btn btn-primary" href="/kart">
              Åpne kartet
            </Link>
            <Link className="btn btn-secondary" href="/">
              Til forsiden
            </Link>
          </div>
        </Blueprint>
      </main>
      <SiteFooter />
    </div>
  );
}
