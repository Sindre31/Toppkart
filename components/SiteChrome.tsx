import Link from "next/link";
import type { ReactNode } from "react";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { NavMenu } from "@/components/NavMenu";
import { SITE } from "@/lib/config";
import type { Lang } from "@/lib/i18n";
import { commonDict } from "@/lib/i18n/common";

/** Sticky top navigation. Merket, de faste destinasjonene og språkvelgeren —
 *  i den rekkefølgen, på hver side.
 *
 *  The switcher is the last item, so it lands in the top-right corner — the
 *  same corner on every page, visible without scrolling. `.nav-brand` takes
 *  `margin-right: auto`, which is what pushes this whole tail to the right.
 *
 *  Menyen er den samme uansett hvor man står i den, så den hører hjemme her —
 *  ikke i ti kall som må huske å si det samme.
 *
 *  På telefon ligger lenkene bak hamburgerknappen (`NavMenu`). På skjerm er det
 *  den samme markupen i den samme raden — se `.nav-menu` i globals.
 *
 *  Ingen kontodel: Toppkart har ingen brukerkontoer.
 */
export function SiteNav({
  lang,
  current,
}: {
  lang: Lang;
  /** Stien til sida man står på, når den er en av destinasjonene i menyen. */
  current?: string;
}) {
  const t = commonDict(lang);

  return (
    <nav className="nav site-nav">
      <Link className="nav-brand" href="/" aria-label={t.brandHome}>
        Toppkart
      </Link>
      <NavMenu label={t.menu} closeLabel={t.menuClose}>
        <NavLinks lang={lang} current={current} />
      </NavMenu>
      <LanguageSwitcher lang={lang} />
    </nav>
  );
}

/** Destinasjonene i menyen. Én liste, to steder som rendrer den: `SiteNav` og
 *  kartets egen topbar, som ligger i en klientkomponent — `/kart` får denne inn
 *  som prop.
 *
 *  Poenget med å ha den her framfor to steder er at «lik meny på kartet» ikke
 *  skal være noe noen må huske: det er den samme funksjonen som kjører begge
 *  steder, så de kan ikke drive fra hverandre.
 */
export function NavLinks({ lang, current }: { lang: Lang; current?: string }) {
  const t = commonDict(lang);
  const here = (href: string) => (href === current ? ("page" as const) : undefined);

  return (
    <>
      <Link className="nav-link" href="/turer" aria-current={here("/turer")}>
        {t.tours}
      </Link>
      <Link className="nav-link" href="/" aria-current={here("/")}>
        {t.map}
      </Link>
      <Link className="nav-link" href="/mine-turer" aria-current={here("/mine-turer")}>
        {t.myTours}
      </Link>
      <Link className="nav-link" href="/om" aria-current={here("/om")}>
        {t.about}
      </Link>
    </>
  );
}

/** Page footer. The language switcher lives in the nav rather than down here —
 *  same corner on every page, no scrolling to reach it.
 *
 *  «Vilkår» and «Personvern» sit on every page deliberately, so they are
 *  reachable without hunting. «Støtt» points at the Vipps section on `/om`. */
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
      {/* Ordmerket sto først i rada, som avsender. Det står allerede øverst på
          hver side, og en bunnlinje som gjentar hvem nettstedet er, rett før
          lenkene til vilkårene, er den ene tingen her ingen skal noe sted med. */}
      <Link href="/turer">{t.footerTours}</Link>
      <Link href="/">{t.footerMap}</Link>
      <Link href="/vilkar">{t.footerTerms}</Link>
      <Link href="/personvern">{t.footerPrivacy}</Link>
      <Link href="/om#stott">{t.footerSupportUs}</Link>
      <a href={`mailto:${SITE.supportEmail}`}>{t.footerSupport}</a>
      {children}
    </footer>
  );
}
