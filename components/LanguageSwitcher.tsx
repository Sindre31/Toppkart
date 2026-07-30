"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { LANGS, LANG_NAMES, LANG_PARAM, type Lang } from "@/lib/i18n";
import { commonDict } from "@/lib/i18n/common";

/** NO/EN switch, rendered as two links rather than a JS control: each one
 *  points at the current URL with `?lang=` appended, which the middleware turns
 *  into the `tk_lang` cookie before redirecting back to the clean path. That
 *  keeps the switch working without JavaScript and keeps every URL shareable.
 */
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
        <Link
          key={code}
          href={hrefFor(code)}
          className="seg-opt"
          hrefLang={code === "en" ? "en" : "no"}
          aria-current={code === lang ? "true" : undefined}
          data-active={code === lang ? "true" : undefined}
        >
          {LANG_NAMES[code]}
        </Link>
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
        <Link
          key={code}
          href={`?${LANG_PARAM}=${code}`}
          className="seg-opt"
          hrefLang={code === "en" ? "en" : "no"}
          aria-current={code === lang ? "true" : undefined}
          data-active={code === lang ? "true" : undefined}
        >
          {LANG_NAMES[code]}
        </Link>
      ))}
    </div>
  );
}
