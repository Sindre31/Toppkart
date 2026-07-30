/** Language primitives shared by every page.
 *
 *  Delivery model: the active language lives in the `tk_lang` cookie. The
 *  middleware promotes a `?lang=` query parameter into that cookie, so every
 *  URL stays shareable (`/kart?lang=en`) while normal navigation keeps the
 *  Norwegian paths the app already ships. Server Components read the cookie
 *  through `getLang()`; client components take `lang` as a prop.
 *
 *  Dictionaries are namespaced per page area (`./landing`, `./map`, …) rather
 *  than pooled in one object — each area owns its own file, and pages import
 *  only the strings they render.
 *
 *  Everything here must stay safe to import from anywhere: the Edge middleware
 *  and two client components depend on it. Reading the cookie needs
 *  `next/headers`, which neither can bundle, so `getLang()` lives in the
 *  server-only sibling `./server`.
 */

export type Lang = "no" | "en";

export const LANGS: readonly Lang[] = ["no", "en"];

export const DEFAULT_LANG: Lang = "no";

/** Cookie the active language is persisted in. Shares the `tk_` prefix used by
 *  the rest of the app's cookies (see `DEMO_COOKIE` in `lib/config.ts`). */
export const LANG_COOKIE = "tk_lang";

/** Query parameter the middleware reads before setting the cookie. */
export const LANG_PARAM = "lang";

/** One year — the choice is a preference, not session state. */
export const LANG_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLang(value: unknown): value is Lang {
  return value === "no" || value === "en";
}

/** The client-side counterpart to the cookie the middleware writes. It lives
 *  next to the constants so the two cannot drift apart on path, lifetime or
 *  SameSite — a mismatch there would leave two `tk_lang` cookies racing. */
export function langCookie(lang: Lang): string {
  return `${LANG_COOKIE}=${lang}; path=/; max-age=${LANG_COOKIE_MAX_AGE}; samesite=lax`;
}

/** Narrow an untrusted string (cookie, query param) to a supported language. */
export function toLang(value: unknown): Lang {
  return isLang(value) ? value : DEFAULT_LANG;
}

/** A NO/EN pair. Every namespaced dictionary is built from these. */
export type Translated<T> = Record<Lang, T>;

/** Pick the entry for `lang` out of a NO/EN pair. */
export function pick<T>(table: Translated<T>, lang: Lang): T {
  return table[lang] ?? table[DEFAULT_LANG];
}

/** BCP-47 tag for `<html lang>` and `Intl` formatters. */
export function htmlLang(lang: Lang): string {
  return lang === "en" ? "en" : "nb-NO";
}

/** The other language — what the switcher offers. */
export function otherLang(lang: Lang): Lang {
  return lang === "no" ? "en" : "no";
}

/** Endonyms for the switcher. Always shown in their own language. */
export const LANG_NAMES: Record<Lang, string> = {
  no: "Norsk",
  en: "English",
};

/** Short forms for narrow screens. The full endonyms need 133px, which a 56px
 *  topbar on a phone does not have — see the `.lang-short` rule in globals. */
export const LANG_CODES: Record<Lang, string> = {
  no: "NO",
  en: "EN",
};
