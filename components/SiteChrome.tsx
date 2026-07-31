import Link from "next/link";
import type { ReactNode } from "react";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getViewer } from "@/lib/access";
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

/** The account end of the nav, resolved from the session rather than hardcoded
 *  per page.
 *
 *  It used to be written out by hand in each nav, which meant every page was
 *  guessing: the landing page always offered «Logg inn» and «Prøv gratis», and
 *  the guide page always offered «Min side» — so one of them was wrong for any
 *  given reader. Signed in you get «Min side» everywhere; signed out you get
 *  the way in and the trial.
 *
 *  A server component, so the session is read where the session lives. `/kart`
 *  cannot use it — its topbar is inside a client component — so it takes the
 *  same decision as a `signedIn` prop instead.
 */
export async function AccountNav({ lang }: { lang: Lang }) {
  const t = commonDict(lang);
  const { userId } = await getViewer();

  if (userId) {
    return (
      <Link className="nav-muted" href="/min-side">
        {t.account}
      </Link>
    );
  }
  /* Signed out there is one call to action and no «Logg inn» beside it. The
     trial page opens with «Fortsett med Google», and that single button both
     creates an account and signs an existing one in — so a second nav item
     pointing at the same round-trip only spent space a phone does not have. */
  return (
    <Link className="btn btn-primary" href="/betaling">
      {t.trial}
    </Link>
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
