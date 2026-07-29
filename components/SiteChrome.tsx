import Link from "next/link";
import type { ReactNode } from "react";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import type { Lang } from "@/lib/i18n";
import { commonDict } from "@/lib/i18n/common";

/** Sticky top navigation. `children` carries the page-specific tail (CTA,
 *  account links); every page shares the brand and the link to the map. */
export function SiteNav({ lang, children }: { lang: Lang; children?: ReactNode }) {
  const t = commonDict(lang);
  return (
    <nav className="nav site-nav">
      <Link className="nav-brand" href="/" aria-label={t.brandHome}>
        Toppkart
      </Link>
      {children}
    </nav>
  );
}

/** The footer carries the language switcher on every page, so the English site
 *  is reachable from anywhere without hunting for a control in the nav. */
export function SiteFooter({
  lang,
  children,
  className = "",
}: {
  lang: Lang;
  children?: ReactNode;
  className?: string;
}) {
  const t = commonDict(lang);
  return (
    <footer className={`site-footer ${className}`.trim()}>
      <span>Toppkart</span>
      <Link href="/kart">{t.footerMap}</Link>
      {children}
      <LanguageSwitcher lang={lang} className="push" />
    </footer>
  );
}
