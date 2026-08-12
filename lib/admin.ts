import { notFound } from "next/navigation";

import { getIdentity } from "@/lib/access";
import { adminEmailList } from "@/lib/config";

/** Who may open `/admin/*`.
 *
 *  The list is an environment variable rather than a column or a hardcoded
 *  address, so changing who has access is a Vercel setting and a redeploy
 *  rather than a code change.
 *
 *  **It fails closed.** An unset or empty `ADMIN_EMAILS` means nobody is an
 *  admin — not everybody. That distinction is the whole security model here, so
 *  it is worth being explicit: a misconfiguration locks the owner out, which is
 *  recoverable, instead of opening reader e-mail addresses to the internet,
 *  which is not.
 */

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const list = adminEmailList();
  if (!list.length) return false;
  return list.includes(email.trim().toLowerCase());
}

/** Gate for an admin page. Returns the viewer's e-mail, or renders the 404.
 *
 *  `notFound()` rather than a 403: a signed-out visitor and a signed-in
 *  non-admin should both see exactly what someone who mistyped a URL sees. A
 *  «forbidden» page confirms the address is real and worth attacking, and this
 *  one is behind nothing but a session.
 */
export async function requireAdmin(): Promise<string> {
  const { email } = await getIdentity();
  if (!isAdminEmail(email)) notFound();
  return email!;
}

/** The same gate for a Server Action, which throws instead of rendering.
 *
 *  Actions are their own entry point — a POST to one does not go through the
 *  page that rendered the form, so checking on the page only would leave the
 *  mutation open to anyone who can construct the request. `notFound()` is for
 *  something being rendered; here there is nothing to render, so it throws. */
export async function assertAdminAction(): Promise<void> {
  const { email } = await getIdentity();
  if (!isAdminEmail(email)) throw new Error("Ikke tilgang.");
}
