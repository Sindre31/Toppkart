import { createHash } from "node:crypto";

import { env } from "@/lib/config";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

/** Fixed-window rate limiting, counted in Postgres.
 *
 *  Counting in the app would not work. Vercel runs however many instances it
 *  likes and recycles them without asking, so a counter in one instance's memory
 *  limits one instance for as long as it happens to live — which is to say it
 *  does not limit anything. The count goes where there is exactly one of it:
 *  `public.tk_rate_limit_hit()` in `supabase/schema.sql`, which increments and
 *  answers in a single statement so two simultaneous requests cannot both read
 *  the same number.
 *
 *  **No address is stored.** The key is a SHA-256 of the caller's IP with a
 *  salt, truncated, and the salt is the service-role key — a secret this module
 *  already needs, so there is no new one to lose. That means the table cannot
 *  be turned back into a list of who visited: an attacker who steals it holds a
 *  set of hashes and no salt, and one who holds the salt already holds the
 *  database. The rows live one day and are swept.
 *
 *  It **fails open**. If Supabase is unreachable, or the function is missing
 *  because the schema has not been re-run, the request is allowed and a warning
 *  is logged. That is the right way round here: this guards a feedback table
 *  against a loop, and the cost of wrongly refusing is that a reader with
 *  something to say is told to go away. Compare `lib/admin.ts`, which fails
 *  closed, because there the cost of being wrong is other people's e-mail
 *  addresses.
 */

export interface RateLimit {
  /** How many requests one caller may make inside the window. */
  limit: number;
  /** Window length in seconds. */
  windowSeconds: number;
}

/** Reads the caller's address off the proxy headers Vercel sets.
 *
 *  `x-forwarded-for` is a list, appended to by each hop, and only the *first*
 *  entry is the client — the rest are proxies. It is also trivially forged by
 *  the client on a server that takes it at face value; behind Vercel it is
 *  rewritten, so what arrives is what Vercel saw. `x-real-ip` is the fallback
 *  for a self-hosted runner that sets only that one.
 *
 *  Returns null when neither header is present, which is the local `next dev`
 *  case — see `rateLimitKey`. */
function callerAddress(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  if (first) return first;
  return request.headers.get("x-real-ip")?.trim() || null;
}

/** `«tilbakemelding»` + a request → an opaque key, or null when there is no
 *  caller to key on.
 *
 *  Null means "do not limit this one". Without an address, every anonymous
 *  request on the machine shares a key, and one visitor would spend the
 *  allowance for all of them — a limiter that hands out a denial of service is
 *  worse than none. In practice that is only local development; behind Vercel
 *  the header is always there. */
export function rateLimitKey(scope: string, request: Request): string | null {
  const address = callerAddress(request);
  if (!address) return null;

  const digest = createHash("sha256")
    .update(`${env.supabaseServiceKey}:${scope}:${address}`)
    .digest("hex");
  /* 128 bits of the digest. Enough that two callers will not collide before the
     heat death of the feedback form, short enough to keep the key readable in
     the SQL editor. */
  return `${scope}:${digest.slice(0, 32)}`;
}

/** True when the request may proceed. */
export async function withinRateLimit(
  key: string | null,
  { limit, windowSeconds }: RateLimit,
): Promise<boolean> {
  if (!key) return true;

  const admin = getSupabaseAdminClient();
  if (!admin) return true;

  try {
    const { data, error } = await admin.rpc("tk_rate_limit_hit", {
      p_key: key,
      p_window_seconds: windowSeconds,
      p_limit: limit,
    });

    if (error) {
      console.warn(`[rate-limit] kunne ikke telle «${key}» — slipper gjennom:`, error.message);
      return true;
    }
    /* Funksjonen svarer boolean. Alt annet er et svar vi ikke forstår, og da er
       det ikke vår plass å avvise noen på grunnlag av det. */
    return data !== false;
  } catch (error) {
    console.warn(
      `[rate-limit] oppslaget feilet for «${key}» — slipper gjennom:`,
      error instanceof Error ? error.message : error,
    );
    return true;
  }
}
