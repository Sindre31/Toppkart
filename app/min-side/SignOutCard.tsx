import { Blueprint } from "@/components/Blueprint";
import type { Lang } from "@/lib/i18n";
import { accountDict } from "@/lib/i18n/account";

/** «03 · Konto» — signing out.
 *
 *  It used to be a bare link in the nav of this page and nowhere else, which
 *  put the one destructive control in the bar people scan for navigation, and
 *  hid it from anyone who never opened Min side. Down here it sits with the
 *  other account settings, where you would go looking for it.
 *
 *  A plain form posting to the route handler: no client JavaScript, and a POST
 *  rather than a link so no prefetch or crawler can sign anyone out.
 */
export function SignOutCard({ lang }: { lang: Lang }) {
  const t = accountDict(lang);

  return (
    <Blueprint style={{ padding: "20px 24px", display: "flex", flexDirection: "column" }}>
      <h2
        style={{
          fontSize: 18,
          letterSpacing: "0.02em",
          textTransform: "uppercase",
          margin: "0 0 12px",
        }}
      >
        {t.signOutCardTitle}
      </h2>
      <p className="note" style={{ margin: 0 }}>
        {t.signOutCardNote}
      </p>
      <form action="/api/auth/signout" method="post" style={{ margin: "16px 0 0" }}>
        <button type="submit" className="btn btn-secondary">
          {t.signOutCardAction}
        </button>
      </form>
    </Blueprint>
  );
}
