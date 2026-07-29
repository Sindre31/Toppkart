import type { Metadata } from "next";

import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { getViewer } from "@/lib/access";
import { PRICE, TRIAL_DAYS, isStripeConfigured } from "@/lib/config";
import { addDays, formatNorwegianDate } from "@/lib/dates";
import type { Lang } from "@/lib/i18n";
import { getLang } from "@/lib/i18n";
import { checkoutDict, priceLabel } from "@/lib/i18n/checkout";

import { CheckoutForm } from "./CheckoutForm";
import { Confirmation } from "./Confirmation";
import styles from "./betaling.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = checkoutDict(await getLang());
  return { title: t.metaTitle, description: t.metaDescription };
}

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** «12. august 2026» / «12 August 2026». `lib/dates.ts` writes the Norwegian
 *  form the prototypes use; English takes the same day through `Intl` so the
 *  sentence around the date reads naturally. */
function formatTrialEnd(date: Date, lang: Lang): string {
  if (lang === "no") return formatNorwegianDate(date);
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function BetalingPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const plan = first(params.plan) === "ar" ? "ar" : "maned";
  const price = plan === "ar" ? PRICE.yearly : PRICE.monthly;

  const lang = await getLang();
  const t = checkoutDict(lang);

  // The figure comes from `PRICE`, the words around it from the dictionary —
  // see `priceLabel` in `lib/i18n/checkout.ts`.
  const planLabel = t.plans[plan].planLabel;
  const planPrice = priceLabel(price.amount);

  const viewer = await getViewer();
  const initialEmail = viewer.email ?? first(params.email) ?? "";

  // Første trekk / prøveperiodens slutt: i dag + 14 dager, ikke prototypens
  // hardkodede «12. august 2026».
  const trialEndDate = formatTrialEnd(addDays(new Date(), TRIAL_DAYS), lang);

  // Stripe sender brukeren tilbake hit med ?status=ok etter fullført Checkout.
  const done = first(params.status) === "ok";

  return (
    <div className="shell">
      <SiteNav lang={lang}>
        <span className="nav-muted">{t.navNote}</span>
      </SiteNav>

      <main
        style={{
          width: "100%",
          maxWidth: 980,
          margin: "0 auto",
          padding: "48px clamp(20px, 5vw, 64px) 64px",
        }}
      >
        {done ? (
          <Confirmation lang={lang} trialEndDate={trialEndDate} />
        ) : (
          <CheckoutForm
            lang={lang}
            plan={plan}
            planLabel={planLabel}
            planPrice={planPrice}
            trialEndDate={trialEndDate}
            initialEmail={initialEmail}
            stripeEnabled={isStripeConfigured}
          />
        )}
      </main>

      <SiteFooter lang={lang} className={styles.footer} />
    </div>
  );
}
