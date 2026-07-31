import { env } from "@/lib/config";

/** The origin the browser actually asked for, e.g. `https://toppkart.no`.
 *
 *  Every redirect that has to come *back* to a signed-in browser — the OAuth
 *  round-trip, the magic link, Stripe's return URLs — has to land on the origin
 *  the visitor started on. Building those from `NEXT_PUBLIC_SITE_URL` looks
 *  right until the variable is unset: `env.siteUrl` then falls back to
 *  `https://$VERCEL_URL`, so a visitor on the custom domain is sent to
 *  `*.vercel.app` instead. The session cookie is set on that origin, and they
 *  return to the real domain still signed out. Preview deployments break the
 *  same way, and every one of them has a different hostname, so no single
 *  configured value can be right for all of them.
 *
 *  Reading it off the request removes the class of bug: you come back to
 *  wherever you left from.
 *
 *  `x-forwarded-*` is set by the proxy in front of the app and is what Vercel
 *  populates; `host` covers running the server directly. The `Host` header is
 *  caller-controlled in principle, but nothing here trusts it as a security
 *  boundary — Supabase checks `redirect_to` against its own Redirect URL
 *  allow-list and Stripe checks its return URLs, both server-side. A forged
 *  host is rejected there unless it is already a domain you allow-listed.
 */
export function requestOrigin(request: Request): string {
  const first = (value: string | null) => value?.split(",")[0]?.trim() || "";

  const url = new URL(request.url);
  const proto = first(request.headers.get("x-forwarded-proto")) || url.protocol.replace(":", "");
  const host =
    first(request.headers.get("x-forwarded-host")) ||
    first(request.headers.get("host")) ||
    url.host;

  if (!host) return env.siteUrl;
  return `${proto || "https"}://${host}`;
}
