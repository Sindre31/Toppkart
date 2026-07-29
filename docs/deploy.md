# Deploying Toppkart

A checklist for taking the app from a clone to a working production deployment on Vercel with
real Supabase auth and real Stripe billing.

You do not have to do all of it at once. The app runs in demo mode with no configuration, and
each integration is switched on independently by its own environment variables, so it is
reasonable to get Supabase working first and add Stripe afterwards. Read `.env.example` alongside
this document — it lists every variable and where to find its value.

Do the Supabase and Stripe sections before the first real deploy. Vercel needs the environment
variables at build time, and both services need the deployment's URL, so expect one pass through
Vercel to get a domain, then a return trip to fill in redirect URLs and webhook endpoints.

---

## 1. Vercel

1. Push the repository to GitHub, GitLab or Bitbucket.
2. In Vercel, **Add New → Project**, import the repository. Vercel detects Next.js; leave the
   build command (`next build`) and output settings at their defaults.
3. Add the environment variables from `.env.example` under **Settings → Environment Variables**.
   Add them to Production and Preview separately — Preview deployments should point at Stripe
   test mode and, ideally, a separate Supabase project.
4. Deploy. Note the production URL.
5. Set `NEXT_PUBLIC_SITE_URL` to that URL (`https://toppkart.no`, no trailing slash) and redeploy.
   Without it the app falls back to the per-deployment `VERCEL_URL`, which changes on every
   deploy and will break Stripe return URLs and magic-link redirects.
6. If you are using a custom domain, add it under **Settings → Domains** first, then use the
   custom domain as `NEXT_PUBLIC_SITE_URL`.

Anything prefixed `NEXT_PUBLIC_` ends up in the browser bundle. Do not put the Supabase
service-role key or the Stripe secret key behind that prefix.

---

## 2. Supabase

Order matters here: schema before seed, and the redirect URL cannot be set until you know the
site's URL.

1. Create a project at <https://supabase.com/dashboard>. Pick a region close to your users
   (Frankfurt or Stockholm for Norwegian traffic).
2. Open the **SQL Editor** and run `supabase/schema.sql`. This creates the `tours`, `profiles`
   and `subscriptions` tables, enables row-level security and installs the policies that keep
   the gated tour columns away from non-subscribers.
3. Run `supabase/seed.sql` in the same editor. This loads the 24 tours and the Kirketaket guide
   content. Running it against a database without the schema will fail, so do not reorder these.
4. **Authentication → URL Configuration**: set **Site URL** to your `NEXT_PUBLIC_SITE_URL`, and
   add the magic-link callback to **Redirect URLs**:

   ```
   https://toppkart.no/**
   http://localhost:3000/**
   ```

   A magic link whose redirect target is not on this list is rejected by Supabase, which shows up
   as a sign-in that silently fails.
5. **Authentication → Providers → Email**: confirm the e-mail provider is enabled. Toppkart uses
   only passwordless sign-in (`signInWithOtp`), so you can leave passwords disabled.
6. Optional but recommended — **Project Settings → Authentication → SMTP Settings**: point
   Supabase Auth at Resend so magic links come from your own verified domain instead of
   Supabase's shared sender, which has a low rate limit and poor deliverability.

   ```
   Host:     smtp.resend.com
   Port:     587
   Username: resend
   Password: <your RESEND_API_KEY>
   Sender:   Toppkart <ingen-svar@toppkart.no>
   ```

   The sender domain must be verified in Resend first (**Domains → Add Domain**, then the DNS
   records it gives you).
7. Copy the project URL and the anon key from **Project Settings → API** into
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Copy the service-role key into
   `SUPABASE_SERVICE_ROLE_KEY` only if the webhook handler needs it — it bypasses RLS.

---

## 3. Stripe

1. Create the product in **Product catalogue → Add product**. Name it "Toppkart".
2. Add two recurring prices on that product:
   - **29 NOK**, recurring, billing period **monthly**.
   - **290 NOK**, recurring, billing period **yearly** (two months free relative to monthly).
3. Copy each price ID (`price_…`) into `STRIPE_PRICE_MONTHLY` and `STRIPE_PRICE_YEARLY`.
   The price ID is on the price row, not the product — do not use the `prod_…` ID.
4. Copy the secret key from **Developers → API keys** into `STRIPE_SECRET_KEY`. Use `sk_test_…`
   everywhere except production.
5. The trial is set on the Checkout Session in code (`trial_period_days: 14`) with a card
   required at signup, so you do not need to configure a trial on the price itself. Adding one
   there as well would apply it twice.
6. **Settings → Billing → Customer portal**: activate the portal and allow customers to update
   their payment method and to cancel at period end. `/min-side` sends people there for both.
7. **Developers → Webhooks → Add endpoint**. URL:

   ```
   https://toppkart.no/api/stripe/webhook
   ```

   Select these events, which are the ones the handler acts on:

   - `checkout.session.completed` — the trial has started; create or attach the subscription row.
   - `customer.subscription.updated` — status changes (`trialing` → `active`, `past_due`,
     scheduled cancellation), period end, card details.
   - `customer.subscription.created` — the subscription exists in Stripe; the row is upserted.
   - `customer.subscription.deleted` — the subscription has ended; access closes.
   - `invoice.paid` — a charge succeeded; the receipt appears on `/min-side`.
   - `invoice.payment_failed` — the charge bounced; the status moves to `past_due`.

8. Copy the endpoint's **Signing secret** (`whsec_…`) into `STRIPE_WEBHOOK_SECRET`. The handler
   verifies every request against it and rejects anything that does not match, so a missing or
   wrong secret makes all webhooks fail with a 400 and leaves subscription status stale.
9. Redeploy on Vercel so the new environment variables take effect, then send a test event from
   the webhook page and confirm it returns 200.

### Local webhook testing

Stripe cannot reach `localhost`, so forward events with the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

It prints a signing secret (`whsec_…`) when it starts. Put that value — not the dashboard one —
in your local `.env.local` as `STRIPE_WEBHOOK_SECRET`, and restart `npm run dev`. It is a
different secret from the deployed endpoint's and rotates each time you start `stripe listen`.

To drive a flow without clicking through Checkout:

```bash
stripe trigger checkout.session.completed
```

Card `4242 4242 4242 4242`, any future expiry and any CVC works in test mode.

---

## 4. Verify

Walk the real flow on the deployed site, not just the local one:

- [ ] `/` loads, and every «Prøv gratis» goes to `/betaling`.
- [ ] `/kart` renders the map with all tours; filters and the detail panel work.
- [ ] Signed out, the locked block on a tour detail shows and the guide text is genuinely absent
      from the page source — not merely hidden with CSS.
- [ ] `/logg-inn` sends a magic link that arrives and signs you in on the deployed domain.
- [ ] `/betaling` creates a Stripe Checkout session, the card is collected, and today's total is
      0 kr.
- [ ] The webhook fires and the subscription row in Supabase reaches status `trialing`.
- [ ] Gated content on `/tur/kirketaket` unlocks for that account.
- [ ] `/min-side` shows the plan, the trial end date and the card; "Endre betalingsmetode" opens
      the Customer Portal; cancelling sets `cancel_at_period_end` and keeps access until the
      period ends.
- [ ] Query the gated `tours` columns with the anon key while signed out and confirm RLS returns
      nothing. The server-side gate and RLS should both hold on their own.
