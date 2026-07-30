"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, type MouseEvent } from "react";

import { LANGS, LANG_CODES, LANG_NAMES, LANG_PARAM, langCookie, type Lang } from "@/lib/i18n";
import { commonDict } from "@/lib/i18n/common";

/** One option in the NO/EN switch.
 *
 *  The `href` is the no-JavaScript path: `?lang=` reaches the middleware, which
 *  writes the `tk_lang` cookie and redirects back to the clean URL. That keeps
 *  the switch working with scripting off and keeps `/kart?lang=en` shareable.
 *
 *  With JavaScript we deliberately do not follow it. Going through the redirect
 *  is a navigation, and Next's Router Cache keys on URL — so landing back on the
 *  clean path re-used the payload already cached under it and the page kept the
 *  previous language until something else evicted the entry. Writing the cookie
 *  here and refetching the current route avoids the round trip entirely: no URL
 *  change, no cache entry to go stale, and client state survives. On `/kart`
 *  that is the difference between retranslating the map in place and tearing
 *  Leaflet down to rebuild it tile by tile.
 *
 *  `prefetch={false}` is load-bearing either way. These hrefs have a side
 *  effect, and prefetching them set the language before anyone clicked — with
 *  one link per language, whichever prefetch landed last silently won.
 */
function LangLink({ code, href, lang }: { code: Lang; href: string; lang: Lang }) {
  const router = useRouter();

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    // Modified clicks mean "open elsewhere" — leave those to the browser, and
    // let the href do the work in the new tab.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    document.cookie = langCookie(code);
    router.refresh();
  }

  return (
    <Link
      href={href}
      prefetch={false}
      onClick={onClick}
      className="seg-opt"
      hrefLang={code === "en" ? "en" : "no"}
      aria-current={code === lang ? "true" : undefined}
      data-active={code === lang ? "true" : undefined}
    >
      {/* Both labels ship; CSS picks one by width. Doing it in JS would need the
          viewport at render time, which the server does not have. `display:none`
          keeps the hidden one out of the accessibility tree, so it is never
          announced twice. */}
      <span className="lang-full">{LANG_NAMES[code]}</span>
      <span className="lang-short">{LANG_CODES[code]}</span>
    </Link>
  );
}

function Switcher({ lang, className = "" }: { lang: Lang; className?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = commonDict(lang);

  const hrefFor = (code: Lang) => {
    const params = new URLSearchParams(searchParams);
    params.set(LANG_PARAM, code);
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className={`seg lang-switch ${className}`.trim()} role="group" aria-label={t.langLabel}>
      {LANGS.map((code) => (
        <LangLink key={code} code={code} href={hrefFor(code)} lang={lang} />
      ))}
    </div>
  );
}

/** `useSearchParams` needs a Suspense boundary, or every page rendering the
 *  switcher opts out of static rendering. The fallback is the same control
 *  without the query-preserving hrefs. */
export function LanguageSwitcher({ lang, className }: { lang: Lang; className?: string }) {
  return (
    <Suspense fallback={<SwitcherFallback lang={lang} className={className} />}>
      <Switcher lang={lang} className={className} />
    </Suspense>
  );
}

function SwitcherFallback({ lang, className = "" }: { lang: Lang; className?: string }) {
  const t = commonDict(lang);
  return (
    <div className={`seg lang-switch ${className}`.trim()} role="group" aria-label={t.langLabel}>
      {LANGS.map((code) => (
        <LangLink key={code} code={code} href={`?${LANG_PARAM}=${code}`} lang={lang} />
      ))}
    </div>
  );
}
