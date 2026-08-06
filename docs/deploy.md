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
> `toppkart-qytwddyuz-yourteam.vercel.app`. A new one is minted on every single deploy.
>
> **The four redirects that come back to a signed-in browser no longer read it.** Google sign-in,
> and Stripe's `success_url` / `return_url` are built from `requestOrigin()` in
> `lib/origin.ts`, which reads the origin off the incoming request. You come back to whatever
> domain you left from — apex, `www`, or a preview host that did not exist when anything was
> configured. This used to be the single most effective way to break sign-in: a visitor on
> `toppkart.no` was sent back to `*.vercel.app`, the session cookie was set on that origin, and
> they returned to the real domain still signed out.
>
> **What still reads it**, and so still wants setting:
>
> - **Links inside e-mail** (`lib/email.ts` — welcome, receipts, trial-ending). These are sent
>   from the Stripe webhook, where there is no browser request to read an origin from. Unset, the
>   buttons in those mails point at a stale per-deploy hostname.
> - **Supabase's own Site URL** field, which you paste this value into in step 4 below. That is
>   configured in the dashboard, not read from the app.
>
> Set it to `https://toppkart.no`, no trailing slash, and **redeploy** — environment variable
> changes do not apply to existing deployments.
>
> Whatever it is set to, the Redirect URLs allow-list in step 4 has to cover every origin people
> actually arrive on. `requestOrigin()` will faithfully send them back to a preview hostname, and
> Supabase will reject it unless the wildcard covers it.

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

   **This is the single most common way to break sign-in, and it fails misleadingly.** When a
   `redirect_to` is missing from the list, Supabase does not report an error — it quietly
   substitutes the **Site URL** instead. Site URL is normally a bare domain with no path, so the
   browser arrives at `https://your-site/?code=…` rather than `/auth/callback?code=…`. If Site URL
   is still pointing at `http://localhost:3000` from early development, a visitor signing in on
   the live site is sent to *their own machine*.

   The tell is a `?code=` in the address bar on a page that is not `/auth/callback`, on a site
   that looks normal and simply is not signed in. `middleware.ts` forwards such a code to the
   callback so a bare Site URL still works, but that is a safety net: a rejected `redirect_to`
   also loses the `next` the visitor was heading to. Get the list right.

   Both entries above matter. Production sign-in needs the real domain; `localhost` is for
   development. If you use preview deployments, add a pattern that covers them too, or accept that
   sign-in only works on the domains listed here.
5. **Authentication → Providers → Email**: turn it **off**. Nothing in the app calls it — there is
   no password form and no magic link — and an enabled provider nobody uses is one more way in
   than the product has thought about. With it off there is no address to confirm and no
   confirmation mail: signing up *is* the Google round-trip.
6. **Authentication → Providers → Google**: enable it and paste in a client ID and secret from
   Google. **This is the only way into the product, and it sends no e-mail at all** — the browser
   goes to Google, comes back to `/auth/callback` with a code, and the code is traded for a
   session. Sign-up and sign-in are the same call: `signInWithOAuth` creates the account if it
   does not exist, so there is no separate registration step and nothing to confirm. Supabase
   reads the address out of the Google profile, so the account still has an e-mail; nothing ever
   has to send one. That is why the app needs no SMTP.

   In the [Google Cloud console](https://console.cloud.google.com/):

   - **APIs & Services → OAuth consent screen**: pick *External*, fill in app name, support
     e-mail and developer e-mail. The app homepage is `https://toppkart.no` and the privacy
     policy link is `https://toppkart.no/personvern` — Google asks for both before it will let
     you publish, which is why that page has to exist before launch rather than after.
     Add only the non-sensitive scopes — `openid`,
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
7. **Project Settings → Authentication → SMTP Settings: leave it alone.** Supabase Auth sends no
   mail in this product, so there is nothing to configure and nothing to pay for.

   Do not confuse this with `RESEND_API_KEY` in the app's own environment. That key is for
   `lib/email.ts`, which sends the welcome and receipt mail after a Stripe checkout, through
   Resend's own API rather than Supabase SMTP. It is billing correspondence and unrelated to
   signing in; the product runs without it, and those sends log and no-op when the key is absent.

8. Copy the project URL and the anon key from **Project Settings → API** into
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Copy the service-role key into
   `SUPABASE_SERVICE_ROLE_KEY` as well: it bypasses RLS, so it is server-only and must never sit
   behind a `NEXT_PUBLIC_` prefix — but it is **required** as soon as Stripe is live. The webhook
   writes subscription rows for a user it is not authenticated as, which no other key can do, and
   returns 503 without it. Billing then appears to work while no one ever gains access.

---

## 3. Stripe

### Which account

Toppkart needs **its own Stripe account**, not a section of one that already sells something
else. An account carries one legal entity and one tax ID, one statement descriptor, one set of
public business information and one payout bank account — so a customer who subscribes to
Toppkart and sees somebody else's business name on their card statement is a dispute waiting to
happen, and the reporting never separates cleanly afterwards.

One login can own any number of accounts. In the Dashboard, click the account name in the
upper-left corner and choose **New account**; the switcher in the same menu moves between them
afterwards. A new account inherits nothing from the old one — not its pricing, not its
verification status — so it goes through business verification on its own. If two accounts belong
to the same legal entity, they can share a tax ID and even a payout account; they still need
distinct public business information so customers can tell which one charged them.

Every key, price ID, portal configuration and webhook secret below belongs to one account. Mixing
them across two is the failure this section is arranged to prevent: `--account` on the setup
script exists for exactly that reason.

### With the setup script

`scripts/stripe-setup.mjs` does steps 1–3 and 6–8 below in one command — product, both prices,
the customer portal configuration and the webhook endpoint — and prints the environment variables
they produce. It is idempotent, so running it twice is safe, and it never deletes anything.

```bash
STRIPE_SECRET_KEY=sk_test_… npm run stripe:setup                 # dry run, changes nothing
STRIPE_SECRET_KEY=sk_test_… npm run stripe:setup -- --apply      # creates what is missing
```

It reads the key from `.env.local` if it is not in the environment, and prints the account id,
the display name and whether the key is live before it writes anything. Pass
`--account acct_…` to make it abort unless the key belongs to that account, and `--site
https://toppkart.no` to set the origin the webhook URL and the legal links are built from
(default: `NEXT_PUBLIC_SITE_URL`, then `https://toppkart.no`).

Two things it deliberately leaves alone. It does not enable plan switching in the portal — see
step 6 for the trial trap behind that — and it cannot show you the webhook signing secret for an
endpoint that already existed, because Stripe returns that once, at creation.

### By hand

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

   **The portal has to be activated before `/min-side` can open it.** Until it is, every click on
   «Endre betalingsmetode» comes back as «Vi fikk ikke åpnet betalingsportalen» — the reader sees
   a transient-looking error and the real cause is only in the server log, which
   `app/api/portal/route.ts` writes as `[portal] kunne ikke opprette portaløkt`.

   The setup script writes these settings as a portal *configuration* and prints its id as
   `STRIPE_PORTAL_CONFIGURATION`. Set that variable and every portal session is created against
   that configuration; leave it unset and sessions use whatever is default in the dashboard. Both
   work — the variable is what makes the settings reviewable in the repository rather than only
   in a settings page.

   Under **Business information**, link the two legal pages — `https://toppkart.no/vilkar` and
   `https://toppkart.no/personvern`. Leave **Redirect link** empty: `app/api/portal/route.ts`
   sets `return_url` on every session from `requestOrigin()`, which overrides anything configured
   here, so a value in that field is dead config that can only go stale.

   If you also let customers switch between the monthly and yearly plan, turn **off** «End trials
   on subscription updates». With it on, a customer who upgrades on day 3 of the trial has the
   trial ended immediately and is charged there and then — the opposite of what checkout promised
   them. The webhook handles the switch either way: `planFor()` reads the new price id and updates
   the `plan` column.
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

## 3a. The admin page

`/admin/tilbakemeldinger` lists what people wrote in the feedback dialog, including the e-mail
addresses of those who were signed in. Nothing links to it; you reach it by typing the address.

Set `ADMIN_EMAILS` to the address on the Google account you sign in with — comma-separated if
there is more than one — and redeploy. Matching is case-insensitive.

**It fails closed, and that is the whole security model.** Unset means *nobody* is an admin, not
everybody, so the page answers 404 for every visitor including you. A misconfiguration locks you
out, which you can fix; the other way round would publish readers' e-mail addresses, which you
cannot take back.

Non-admins get the 404 rather than a «forbidden» page, so a mistyped URL and a real one are
indistinguishable. Reading the table needs `SUPABASE_SERVICE_ROLE_KEY` as well — `tk_feedback`
has row-level security on with no policies at all, so no other role can see it whoever is signed
in.

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

## 3c. Google Search Console

The app serves everything a crawler needs on its own — you do not configure any of this in
Vercel, and there is no verification key to paste into the code.

- `app/robots.ts` → `/robots.txt`. In production it opens the site and points at the sitemap.
  **Everywhere else it answers `Disallow: /`**, and every page additionally renders
  `noindex, nofollow`. A preview deploy is the whole site, same text, on its own domain; indexed,
  it competes with `toppkart.no` for the same searches. The switch is `VERCEL_ENV === "production"`
  in `lib/seo.ts`.
- `app/sitemap.ts` → `/sitemap.xml`. The front page, the map, the 39 tour guides and the two legal
  pages — 43 URLs, built from `TOURS`, so a new tour is in the sitemap the moment it is in the
  data. Account and checkout pages are not listed, and say `noindex` in their own metadata.
- Canonical URLs and Open Graph tags come from `metadataBase` in `app/layout.tsx` plus an
  `alternates.canonical` on each public page. `/kart?tur=…&rute=…` canonicalises to `/kart`: the
  parameters are navigation, and the tour's own page at `/tur/<slug>` is what should rank on the
  peak's name.

Both files build their addresses from `NEXT_PUBLIC_SITE_URL`, falling back to `SITE.url`
(`https://toppkart.no`) — deliberately **not** `env.siteUrl`, which falls back to the per-deploy
`$VERCEL_URL`. A sitemap full of hostnames that expire at the next push is worse than no sitemap.

**Verifying the property.** The domain is normally verified with a DNS TXT record at the
registrar — a domain property covers `www`, apex and every subdomain at once, which is what you
want. Vercel's Search Console integration and the HTML-tag method both work too; none of them
need a code change.

Once verified:

1. **Sitemaps → Add a new sitemap →** `sitemap.xml`. Search Console reports "Success" and a
   discovered-URL count within a day or so; 43 is the number to expect today.
2. **URL Inspection** on `https://toppkart.no/` and one guide, e.g. `/tur/slogen` → **Test live
   URL**. Confirm it says crawling is allowed, indexing is allowed, and that the rendered HTML
   holds the guide's intro text. Then **Request indexing** for both — it seeds the crawl instead
   of waiting for it.
3. Expect **Pages** and **Performance** to stay empty for a few days to a couple of weeks. That is
   normal; nothing is wrong until a URL shows up under a specific exclusion reason.

Two exclusions are expected rather than faults. Guides are half-gated — intro, map, key figures
and elevation profile are open, the route description and avalanche notes are not — so a guide
page is genuinely indexable, but thin compared to what a subscriber sees. And `/logg-inn`,
`/betaling`, `/min-side` and `/admin/*` will report "Excluded by 'noindex' tag", which is the
intended outcome, not a problem to fix.

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
- [ ] `/betaling` signed out shows the Google button and **no** payment form; the trial cannot be
      started without a session. Signing in from there returns you to the same plan.
- [ ] `support@toppkart.no` receives a message sent from an outside address.
- [ ] `/vilkar` and `/personvern` load and are linked from the footer of every page.

      Both pages describe Toppkart as a privately run project with no company behind it, and
      route all contact to `SITE.supportEmail`. That is accurate while this is a side project.
      Register an entity, or grow into having to, and two things change together: the operator
      and controller paragraphs in `lib/i18n/legal.ts` need a name and address, and the price
      paragraph needs to say whether VAT is included. They are marked in that file.
- [ ] `/betaling` creates a Stripe Checkout session, the card is collected, and today's total is
      0 kr.
- [ ] The webhook fires and the subscription row in Supabase reaches status `trialing`.
- [ ] Gated content on `/tur/kirketaket` unlocks for that account.
- [ ] `/min-side` shows the plan, the trial end date and the card; "Endre betalingsmetode" opens
      the Customer Portal; cancelling sets `cancel_at_period_end` and keeps access until the
      period ends.
- [ ] Query the gated `tk_tours` columns with the anon key while signed out and confirm RLS returns
      nothing. The server-side gate and RLS should both hold on their own.
- [ ] `https://toppkart.no/robots.txt` allows crawling and names the sitemap;
      `https://toppkart.no/sitemap.xml` lists 43 URLs on the production domain — not on a
      `*.vercel.app` host. The same two files on a preview deploy say `Disallow: /`.
- [ ] View source on `/` and on one guide: `<link rel="canonical">` points at the production
      domain, and `/kart?tur=slogen` canonicalises to `/kart`.

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
not on Supabase's allow-list: compare it against **Authentication → URL Configuration**.

**You land on `/?code=…` — the wrong path, or even the wrong domain.**
Supabase rejected the `redirect_to` the app sent and fell back to its **Site URL**. Nothing in the
app produces that address, so the value you see is whatever is in **Authentication → URL
Configuration → Site URL**; landing on `localhost` from the live site means that field was never
moved off the development default. Fix both fields there: Site URL to the real origin, and add
`https://your-domain/**` to **Redirect URLs**. `middleware.ts` forwards a stray code to
`/auth/callback` so this still completes, but the allow-list is the actual fix.

**Google sends you round the loop and you end up signed out, with no error.**
Look at where the round-trip is actually pointed — this needs no browser and no credentials:

```bash
curl -s -o /dev/null -w '%{redirect_url}\n' 'https://toppkart.no/api/auth/google?next=%2Fkart'
```

Decode the `redirect_to` parameter in what comes back. It must be **the same origin you asked
from**. If you ask `toppkart.no` and `redirect_to` says `toppkart.vercel.app`, the session cookie
is being set on a domain you are not browsing, which is exactly what "signed in, then still signed
out" looks like. Since `requestOrigin()` landed this cannot come from a missing environment
variable any more; check for a proxy or redirect in front of the app rewriting the `Host` header,
and confirm the origin is in the Redirect URLs allow-list.

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
