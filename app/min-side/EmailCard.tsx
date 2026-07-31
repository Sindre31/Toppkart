import { Blueprint } from "@/components/Blueprint";
import type { Lang } from "@/lib/i18n";
import { accountDict } from "@/lib/i18n/account";

/** «03 · Konto» — the e-mail card, read-only.
 *
 *  It used to offer a change-address form backed by `supabase.auth.updateUser`.
 *  With Google as the only way in, that field had nowhere useful to go: the
 *  identity is the Google account, so editing the stored address would not
 *  change how you sign in — it would only split the address the receipts go to
 *  away from the one you actually log in with. It also sent a confirmation
 *  mail, which is the SMTP dependency this product deliberately does not have.
 *
 *  So the address is shown, not edited. Change it at Google and it follows.
 */
export function EmailCard({ email, lang }: { email: string; lang: Lang }) {
  const t = accountDict(lang);

  return (
    <Blueprint style={{ padding: "20px 24px" }}>
      <h2
        style={{
          fontSize: 18,
          letterSpacing: "0.02em",
          textTransform: "uppercase",
          margin: "0 0 12px",
        }}
      >
        {t.emailCardTitle}
      </h2>
      <p style={{ margin: 0, fontWeight: 500 }}>{email}</p>
      <p className="note" style={{ margin: "10px 0 0" }}>
        {t.emailCardNote}
      </p>
    </Blueprint>
  );
}
