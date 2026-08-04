import { notFound } from "next/navigation";

import { getViewer } from "@/lib/access";
import { env } from "@/lib/config";

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

function adminList(): string[] {
  return env.adminEmails
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const list = adminList();
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
  const { email } = await getViewer();
  if (!isAdminEmail(email)) notFound();
  return email!;
}
