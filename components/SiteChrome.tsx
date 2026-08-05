import Link from "next/link";
import type { ReactNode } from "react";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { NavMenu } from "@/components/NavMenu";
import { getIdentity } from "@/lib/access";
import { SITE } from "@/lib/config";
import type { Lang } from "@/lib/i18n";
import { commonDict } from "@/lib/i18n/common";

/** Sticky top navigation. Merket, de faste destinasjonene, kontodelen og
 *  språkvelgeren — i den rekkefølgen, på hver side.
 *
 *  The switcher is the last item, so it lands in the top-right corner — the
 *  same corner on every page, visible without scrolling. `.nav-brand` takes
 *  `margin-right: auto`, which is what pushes this whole tail to the right.
 *
 *  Lenkene sto tidligere i hver enkelt side, og da var de i praksis ikke de
 *  samme to steder: forsida tilbød «Turene» og «Kartet», guidene det samme
 *  pluss konto, de juridiske sidene bare «Kartet», og /min-side sin egen
 *  variant av kontolenka. Menyen er den samme uansett hvor man står i den, så
 *  den hører hjemme her — ikke i ti kall som må huske å si det samme.
 *  `AccountNav` avgjør fortsatt kontoenden ut fra sesjonen.
 *
 *  På telefon ligger lenkene bak hamburgerknappen (`NavMenu`): raden vokste med
 *  hver lenke som ble lagt i den, og det er den veksten som er problemet, ikke
 *  den enkelte lenka. På skjerm er det den samme markupen i den samme raden —
 *  se `.nav-menu` i globals.
 *
 *  `aside` er det ene som står framme uansett bredde. I dag «Sikker betaling via
 *  Stripe» på kassa: et tillitssignal hører hjemme der kortet tastes inn, ikke
 *  bak en knapp.
 */
export async function SiteNav({
  lang,
  current,
  aside,
  menu = true,
}: {
  lang: Lang;
  /** Stien til sida man står på, når den er en av destinasjonene i menyen. */
  current?: string;
  aside?: ReactNode;
  /** Kassa slår den av: der er navigasjon bort fra sida det motsatte av det
   *  sida er til for. */
  menu?: boolean;
}) {
  const t = commonDict(lang);

  return (
    <nav className="nav site-nav">
      <Link className="nav-brand" href="/" aria-label={t.brandHome}>
        Toppkart
      </Link>
      {menu ? (
        <NavMenu label={t.menu} closeLabel={t.menuClose}>
          <NavLinks lang={lang} current={current} />
        </NavMenu>
      ) : null}
      {aside}
      <LanguageSwitcher lang={lang} />
    </nav>
  );
}

/** Destinasjonene i menyen. Én liste, to steder som rendrer den: `SiteNav` og
 *  kartets egen topbar, som ligger i en klientkomponent og derfor ikke kan kalle
 *  `AccountNav` selv — `/kart` får denne inn som prop i stedet.
 *
 *  Poenget med å ha den her framfor to steder er at «lik meny på kartet» ikke
 *  skal være noe noen må huske: det er den samme funksjonen som kjører begge
 *  steder, så de kan ikke drive fra hverandre.
 */
export async function NavLinks({ lang, current }: { lang: Lang; current?: string }) {
  const t = commonDict(lang);
  const here = (href: string) => (href === current ? ("page" as const) : undefined);

  return (
    <>
      <Link className="nav-link" href="/turer" aria-current={here("/turer")}>
        {t.tours}
      </Link>
      <Link className="nav-link" href="/kart" aria-current={here("/kart")}>
        {t.map}
      </Link>
      <AccountNav lang={lang} current={current} />
    </>
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
 *  Den spør `getIdentity()`, ikke `getViewer()`: her er spørsmålet «er noen
 *  logget inn», og abonnementsraden — som `getViewer()` alltid henter — hadde
 *  ingen leser på de sidene som bare rendrer denne. Det var én databasespørring
 *  per sidevisning på `/`, `/turer` og de juridiske sidene, til ingen nytte.
 *
 *  A server component, so the session is read where the session lives. Kartets
 *  topbar ligger i en klientkomponent og kan ikke kalle den selv; `/kart`
 *  rendrer `NavLinks` på serveren og sender resultatet inn som prop, slik at
 *  også kartet får kontoenden avgjort av sesjonen framfor av en `signedIn`-flagg
 *  som må holdes i takt.
 *
 *  Kalles fra `NavLinks`, ikke fra sidene: kontoenden av navigasjonen er den
 *  samme overalt, og den er avhengig av sesjonen, ikke av hvilken side man
 *  står på.
 */
export async function AccountNav({ lang, current }: { lang: Lang; current?: string }) {
  const t = commonDict(lang);
  const { userId } = await getIdentity();

  if (userId) {
    return (
      <Link className="nav-link nav-muted" href="/min-side" aria-current={current === "/min-side" ? "page" : undefined}>
        {t.account}
      </Link>
    );
  }
  /* Signed out: the way back in, then the way in for the first time.
   *
   *  This nav used to carry only «Prøv gratis», on the reasoning that
   *  `signInWithOAuth` both creates an account and signs an existing one in, so
   *  the trial page was already the door for everybody and a second link led to
   *  the same round trip. True of the mechanism, wrong about the reader: a
   *  returning subscriber looking for their account does not read «Prøv gratis»
   *  as «this is also how you sign in», and had nowhere obvious to click.
   *
   *  Kostnaden var ett element til i en rad som var trang på telefon. Den er
   *  borte nå: raden holder ikke lenkene lenger, menyen gjør. */
  return (
    <>
      <Link className="nav-link nav-muted" href="/logg-inn">
        {t.login}
      </Link>
      <Link className="btn btn-primary" href="/betaling">
        {t.trial}
      </Link>
    </>
  );
}

/** Page footer. The language switcher lives in the nav rather than down here —
 *  same corner on every page, no scrolling to reach it.
 *
 *  «Vilkår» and «Personvern» sit on every page deliberately. Both are linked
 *  from outside the app as well — the Stripe Customer Portal and Google's OAuth
 *  consent screen each take a URL — so they have to be reachable without a
 *  session and without hunting. */
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
      <Link href="/turer">{t.footerTours}</Link>
      <Link href="/kart">{t.footerMap}</Link>
      <Link href="/vilkar">{t.footerTerms}</Link>
      <Link href="/personvern">{t.footerPrivacy}</Link>
      <a href={`mailto:${SITE.supportEmail}`}>{t.footerSupport}</a>
      {children}
    </footer>
  );
}
