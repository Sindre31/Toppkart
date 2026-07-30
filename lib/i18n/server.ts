/** The server-only half of the language plumbing.
 *
 *  `./index` is imported by the Edge middleware and by client components (the
 *  language switcher, the error boundary), so it has to stay free of
 *  `next/headers` — importing it there fails the build outright. Reading the
 *  cookie therefore lives here, in a module only Server Components, Route
 *  Handlers and `generateMetadata` reach for.
 */

import { cookies } from "next/headers";
import { LANG_COOKIE, toLang, type Lang } from "./index";

/** The active language for the current request. */
export async function getLang(): Promise<Lang> {
  const store = await cookies();
  return toLang(store.get(LANG_COOKIE)?.value);
}
