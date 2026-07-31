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
6. If you are using a custom domain, add it under **Settings → Domains** first, then use the
   custom domain as `NEXT_PUBLIC_SITE_URL`.

> ### Do not skip step 5
>
> This is the single most common way to get a deployment that looks fine and quietly does not
> work, so it is worth understanding rather than just copying.
>
> `NEXT_PUBLIC_SITE_URL` is optional in the sense that nothing crashes without it. `lib/config.ts`
> falls back to `https://$VERCEL_URL`, which is the **per-deployment** hostname — something like
> `toppkart-qytwddyuz-yourteam.vercel.app`. A new one is minted on every single deploy. Two
> things are built from that value, and both break in ways that do not look like a URL problem:
>
> - **Magic links.** `emailRedirectTo` becomes `https://<per-deploy-host>/auth/callback`. Supabase
>   checks that against the Redirect URLs allow-list, which contains your real domain, not a
>   hostname that did not exist when you configured it. The mail sends, the user clicks, and
>   sign-in fails — with no error on your side, because the rejection happens at Supabase.
> - **Stripe returns.** `success_url` and `cancel_url` point at the deployment that happened to be
>   live when the session was created. After the next deploy that host is stale, so a customer
>   who pays can land somewhere unexpected instead of the confirmation screen.
>
> To check what it actually resolved to, create a Checkout session against the deployed API and
> read the URL back — this reports the real runtime value, not what you think you configured:
>
> ```bash
> curl -s -X POST https://your-domain/api/checkout \
>   -H 'Content-Type: application/json' -d '{"plan":"maned"}'
> # then, with your Stripe secret key:
> curl -s "https://api.stripe.com/v1/checkout/sessions?limit=1" -u "sk_test_…:" \
>   | grep -o '"success_url": *"[^"]*"'
> ```
>
> If the host in `success_url` is not your real domain, `NEXT_PUBLIC_SITE_URL` is not set on that
> environment. Set it and **redeploy** — environment variable changes do not apply to existing
> deployments.

Anything prefixed `NEXT_PUBLIC_` ends up in the browser bundle. Do not put the Supabase
service-role key or the Stripe secret key behind that prefix.

---

## 2. Supabase

Order matters here: schema before seed, and the redirect URL cannot be set until you know the
site's URL.

1. Create a project at <https://supabase.com/dashboard>. Pick a region close to your users
   (Frankfurt or Stockholm for Norwegian traffic).
2. Open the **SQL Editor** and run `supabase/schema.sql`. This creates the `tk_tours`, `tk_profiles`
   and `tk_subscriptions` tables, enables row-level security and installs the policies that keep
   the gated tour columns away from non-subscribers.
3. Run `supabase/seed.sql` in the same editor. This loads the 24 tours and the Kirketaket guide
   content. Running it against a database without the schema will fail, so do not reorder these.
4. **Authentication → URL Configuration**: set **Site URL** to your `NEXT_PUBLIC_SITE_URL`, and
   add the sign-in callback to **Redirect URLs**:

   ```
   https://toppkart.no/**
   http://localhost:3000/**
   ```

   A redirect target that is not on this list is rejected by Supabase, which shows up as a
   sign-in that silently fails.
5. **Authentication → Providers → Email**: enable it, and leave **Confirm email** off. The app
   uses only passwordless sign-in (`signInWithOtp`), so passwords can stay disabled. Confirmation
   is redundant here: receiving the magic link already proves the address, and leaving it on adds
   a second mail to every first sign-in.
6. **Authentication → Providers → Google**: enable it and paste in a client ID and secret from
   Google. **This path sends no e-mail at all** — the browser goes to Google, comes back to
   `/auth/callback` with a code, and the code is traded for a session. Supabase reads the address
   out of the Google profile, so the account still has an e-mail; nothing ever has to send one.
   It is the one way in that works with no SMTP configured.

   In the [Google Cloud console](https://console.cloud.google.com/):

   - **APIs & Services → OAuth consent screen**: pick *External*, fill in app name, support
     e-mail and developer e-mail. Add only the non-sensitive scopes — `openid`,
     `.../auth/userinfo.email`, `.../auth/userinfo.profile`. Sign-in needs nothing more, and
     scopes Google classes as sensitive or restricted are what drag you into its verification
     review. Check Google's current rules before adding anything beyond those three.
   - While the consent screen is in **Testing**, only accounts you list as test users can sign in,
     and their refresh tokens expire after a week. Publish it before launch.
   - **Credentials → Create credentials → OAuth client ID → Web application**. Under *Authorised
     redirect URIs* add the Supabase callback, which is the project URL plus `/auth/v1/callback`:

     ```
     https://<project-ref>.supabase.co/auth/v1/callback
     ```

     This is Supabase's URL, not the app's. Toppkart's own `/auth/callback` is where Supabase
     sends the browser afterwards, and it is covered by the Redirect URLs in step 4.
   - Copy the client ID and secret into the Supabase Google provider and save.

   Nothing needs to go into the app's environment: the secret lives in Supabase, and
   `app/api/auth/google/route.ts` only asks Supabase to start the round-trip.
7. **Project Settings → Authentication → SMTP Settings** — required the moment magic links
   matter. Point Supabase Auth at a sender you control:

   ```
   Host:     smtp.resend.com
   Port:     587
   Username: resend
   Password: <your RESEND_API_KEY>
   Sender:   Toppkart <ingen-svar@toppkart.no>
   ```

   The sender domain must be verified in Resend first (**Domains → Add Domain**, then the DNS
   records it gives you) — the same domain work as the `support@` mailbox in step 9, so do them
   together.

   **Treat this as required, not optional, the moment you start testing.** Supabase's built-in
   mailer allows roughly two messages per hour across the whole project. Past that,
   `signInWithOtp` fails with `429 over_email_send_rate_limit` — and because the app deliberately
   does not leak auth internals to the browser, all the reader sees is «Vi klarte ikke å sende
   innloggingslenken. Prøv igjen om litt.» The real reason is only in **Logs → Auth**, so look
   there before assuming the code is wrong. The account is still created when this happens; only
   the mail fails.

   Google sign-in is unaffected by all of this — it never touches SMTP. If the mail side is not
   ready yet, Google still gets people in.

   Do not confuse SMTP with `RESEND_API_KEY` in the app's own environment. That key is for
   `lib/email.ts`, which sends the welcome and receipt mail after a Stripe checkout, through
   Resend's own API rather than Supabase SMTP. The two are configured separately even when they
   use the same Resend account.

8. Copy the project URL and the anon key from **Project Settings → API** into
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Copy the service-role key into
   `SUPABASE_SERVICE_ROLE_KEY` as well: it bypasses RLS, so it is server-only and must never sit
   behind a `NEXT_PUBLIC_` prefix — but it is **required** as soon as Stripe is live. The webhook
   writes subscription rows for a user it is not authenticated as, which no other key can do, and
   returns 503 without it. Billing then appears to work while no one ever gains access.

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

## 3b. The support mailbox

`support@toppkart.no` is the one address a human reads. The app never sends *from* it — mail goes
out from the no-reply sender in `RESEND_FROM_EMAIL` — so it only ever has to **receive**. That
makes it cheap: you need MX records and somewhere for the mail to land, and nothing else.

It is referenced in three places, all from `SITE.supportEmail` in `lib/config.ts`:

- `Reply-To` on every message `lib/email.ts` sends, so a reply to a receipt reaches a person
  rather than a no-reply box nobody opens.
- The footer of those messages, in both languages.
- The «Kontakt» / «Contact» link in the site footer, on every page.

It is a constant, not an environment variable, because it is read in the browser bundle — a
variable without a `NEXT_PUBLIC_` prefix would silently be `undefined` there. Change the address
in `lib/config.ts`.

**Setting it up.** Receive-only forwarding is free at most registrars and at Cloudflare; a real
mailbox is not needed unless you want to reply from the address too.

1. At whoever holds the `toppkart.no` DNS, add the MX records for the provider you pick. If the
   domain is already on Cloudflare, **Email → Email Routing** gives forwarding to a personal
   inbox with the records added for you.
2. Point `support@toppkart.no` at whichever inbox is actually read.
3. Send a message from an outside address and confirm it lands. This is on the launch checklist
   below — it is easy to assume it works and find out otherwise from a customer.

If you later want to *reply* from the address rather than just read it, that is a mailbox
product (Google Workspace, Fastmail, Migadu and so on) and a separate cost. Nothing in the app
requires it.

Note the DNS overlap with step 7: verifying the domain in Resend for outbound SMTP touches the
same zone. Do both in one sitting — SPF and DKIM for sending, MX for receiving. They do not
conflict; a domain can send through Resend and receive through someone else.

---

## 4. Verify

Walk the real flow on the deployed site, not just the local one:

- [ ] `/` loads, and every «Prøv gratis» goes to `/betaling`.
- [ ] `/kart` renders the map with all tours; filters and the detail panel work.
- [ ] Signed out, the locked block on a tour detail shows and the guide text is genuinely absent
      from the page source — not merely hidden with CSS.
- [ ] `/logg-inn`, both ways in: "Fortsett med Google" signs you in on the deployed domain, and
      cancelling at Google's consent screen returns you to `/logg-inn` with the Google-specific
      error rather than a blank page.
- [ ] `/logg-inn` by e-mail: the magic link arrives from your own sender, not Supabase's, and
      signs you in. Send two in quick succession to confirm you are not on the built-in mailer's
      ~2/hour cap.
- [ ] `support@toppkart.no` receives a message sent from an outside address.
- [ ] `/betaling` creates a Stripe Checkout session, the card is collected, and today's total is
      0 kr.
- [ ] The webhook fires and the subscription row in Supabase reaches status `trialing`.
- [ ] Gated content on `/tur/kirketaket` unlocks for that account.
- [ ] `/min-side` shows the plan, the trial end date and the card; "Endre betalingsmetode" opens
      the Customer Portal; cancelling sets `cancel_at_period_end` and keeps access until the
      period ends.
- [ ] Query the gated `tk_tours` columns with the anon key while signed out and confirm RLS returns
      nothing. The server-side gate and RLS should both hold on their own.

---

## 5. Troubleshooting

Symptoms that were hit during the first real deployment of this app, and what they actually meant.

**«Vi fikk ikke kontakt med Google, eller innlogginga ble avbrutt.»**
Either the visitor backed out of Google's consent screen — in which case nothing is wrong — or the
Google provider is not enabled in Supabase. Check **Authentication → Providers → Google** first,
then **Logs → Auth** for the real error. While the OAuth consent screen is still in *Testing*, an
account that is not on the test-user list is refused here and looks identical.

**«Vi klarte ikke å fullføre innlogginga.»**
The round-trip came back but `exchangeCodeForSession` failed. Nearly always the redirect target is
not on Supabase's allow-list: compare it against **Authentication → URL Configuration**, and check
`NEXT_PUBLIC_SITE_URL` — see the warning in the Vercel section, which is the usual root cause.

**«Vi klarte ikke å sende innloggingslenken. Prøv igjen om litt.»**
The app never shows the underlying auth error, by design — it should not tell a stranger whether an
address exists. Look in **Logs → Auth** for the real one. In practice it is almost always
`429 over_email_send_rate_limit` (the built-in mailer's ~2/hour cap — configure SMTP, step 7) or
`400 email_address_invalid` (the address was rejected outright; `@example.com` and other reserved
test domains are, which makes them useless for probing this endpoint).

**The magic-link mail arrives, but the link does nothing.**
The redirect target is not on Supabase's allow-list. Compare the `redirect_to` inside the link
against **Authentication → URL Configuration**.

**Google rejects the redirect before the consent screen appears.**
The *Authorised redirect URI* in the Google Cloud credential must be Supabase's callback, the
project URL plus `/auth/v1/callback` — not the app's `/auth/callback`. Getting these two the wrong
way round is the most common setup mistake.

**Checkout succeeds but the guides stay locked.**
The webhook could not resolve the payer to an app user. Its log line is
`[stripe-webhook] abonnementshendelse uten brukertreff`. It resolves by `client_reference_id`
first, then by matching the Stripe customer email against `tk_profiles.email`, so this is expected
if the purchase was made while signed out. It also happens when `SUPABASE_SERVICE_ROLE_KEY` is
missing — but that returns 503 and shows up in Stripe's delivery attempts as a failure, so check
there to tell the two apart.

**Trial starts, nothing unlocks, and no Stripe session was ever created.**
Supabase and Stripe are configured independently, and the app switches each on its own key. With
Supabase live but `STRIPE_SECRET_KEY` absent, `/api/checkout` takes the demo path and writes the
demo cookies — which `getViewer()` never reads, because it is on the Supabase path. The user gets
the confirmation screen and no access. Configure both together, or neither.

**Anonymous users can write to the database.**
If you adapt `tk_tours_public` or add a view of your own, remember that a single-table view with
no aggregate is auto-updatable, Supabase grants writes on new objects to `anon` by default, and a
non-`security_invoker` view executes as its owner, which bypasses RLS. `schema.sql` revokes those
grants explicitly for that reason. Supabase's advisor does not flag this combination.
