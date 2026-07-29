import type { Metadata } from "next";

import { SiteFooter, SiteNav } from "@/components/SiteChrome";
import { getViewer } from "@/lib/access";
import { PRICE, TRIAL_DAYS, isStripeConfigured } from "@/lib/config";
import { addDays, formatNorwegianDate } from "@/lib/dates";

import { CheckoutForm } from "./CheckoutForm";
import { Confirmation } from "./Confirmation";
import styles from "./betaling.module.css";

export const metadata: Metadata = {
  title: "Betaling",
  description:
    "Start prøveperioden på Toppkart: 14 dager gratis, deretter 29 kr/mnd. Kort kreves ved oppstart, ingen binding.",
};

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function BetalingPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const plan = first(params.plan) === "ar" ? "ar" : "maned";
  const price = plan === "ar" ? PRICE.yearly : PRICE.monthly;

  const viewer = await getViewer();
  const initialEmail = viewer.email ?? first(params.email) ?? "";

  // Første trekk / prøveperiodens slutt: i dag + 14 dager, ikke prototypens
  // hardkodede «12. august 2026».
  const trialEndDate = formatNorwegianDate(addDays(new Date(), TRIAL_DAYS));

  // Stripe sender brukeren tilbake hit med ?status=ok etter fullført Checkout.
  const done = first(params.status) === "ok";

  return (
    <div className="shell">
      <SiteNav>
        <span className="nav-muted">Sikker betaling via Stripe</span>
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
          <Confirmation trialEndDate={trialEndDate} />
        ) : (
          <CheckoutForm
            plan={plan}
            planLabel={price.planLabel}
            planPrice={price.label}
            trialEndDate={trialEndDate}
            initialEmail={initialEmail}
            stripeEnabled={isStripeConfigured}
          />
        )}
      </main>

      <SiteFooter className={styles.footer} />
    </div>
  );
}
