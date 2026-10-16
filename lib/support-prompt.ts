/** When to show the support prompt: on the third time the app is opened, once.
 *
 *  Pure apart from the two storages it is handed, so it can be tested without a
 *  browser. A «visit» is a browser session: `sessionStorage` survives reloads
 *  and navigation inside a tab but not a fresh tab or an app launch, which is
 *  what «opening the app» means to the reader. The count and the «already
 *  shown» flag live in `localStorage`.
 *
 *  Every storage call can throw — private windows, blocked site data — and a
 *  prompt that cannot remember it was shown must not risk showing on every
 *  visit, so any failure answers «don't show». */

export const SUPPORT_PROMPT_VISIT = 3;

const KEYS = {
  visits: "tk_visits",
  shown: "tk_support_shown",
  counted: "tk_visit_counted",
} as const;

type Store = Pick<Storage, "getItem" | "setItem">;

/** Counts this visit (once per session) and answers whether to show the prompt
 *  now. Marks it shown in the same breath, so a second tab opened before the
 *  first is closed does not show it again. */
export function nextVisit(local: Store, session: Store): boolean {
  try {
    if (local.getItem(KEYS.shown)) return false;
    if (session.getItem(KEYS.counted)) return false;
    session.setItem(KEYS.counted, "1");

    const visits = (Number.parseInt(local.getItem(KEYS.visits) ?? "0", 10) || 0) + 1;
    local.setItem(KEYS.visits, String(visits));
    if (visits < SUPPORT_PROMPT_VISIT) return false;

    local.setItem(KEYS.shown, new Date().toISOString());
    return true;
  } catch {
    return false;
  }
}
