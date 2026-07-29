import Link from "next/link";
import type { ReactNode } from "react";

/** Sticky top navigation. `right` carries the page-specific tail (CTA, account
 *  links); every page shares the brand and the link to the map. */
export function SiteNav({ children }: { children?: ReactNode }) {
  return (
    <nav className="nav site-nav">
      <Link className="nav-brand" href="/">
        Toppkart
      </Link>
      {children}
    </nav>
  );
}

export function SiteFooter({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return (
    <footer className={`site-footer ${className}`.trim()}>
      <span>Toppkart</span>
      <Link href="/kart">Kartet</Link>
      {children}
    </footer>
  );
}
