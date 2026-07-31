import Link from "next/link";
import type { ReactNode } from "react";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SITE } from "@/lib/config";
import type { Lang } from "@/lib/i18n";
import { commonDict } from "@/lib/i18n/common";

/** Sticky top navigation. `children` carries the page-specific tail (CTA,
 *  account links); every page shares the brand and the language switcher.
 *
 *  The switcher is the last item, so it lands in the top-right corner — the
 *  same corner on every page, visible without scrolling. `.nav-brand` takes
 *  `margin-right: auto`, which is what pushes this whole tail to the right. */
export function SiteNav({ lang, children }: { lang: Lang; children?: ReactNode }) {
  const t = commonDict(lang);
  return (
    <nav className="nav site-nav">
      <Link className="nav-brand" href="/" aria-label={t.brandHome}>
        Toppkart
      </Link>
      {children}
      <LanguageSwitcher lang={lang} />
    </nav>
  );
}

/** Page footer. The language switcher lives in the nav rather than down here —
 *  same corner on every page, no scrolling to reach it. */
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
      <a href={`mailto:${SITE.supportEmail}`}>{t.footerSupport}</a>
      {children}
    </footer>
  );
}
