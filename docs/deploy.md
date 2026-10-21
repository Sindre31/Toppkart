# Deploying Toppkart

A checklist for taking the app from a clone to a working production deployment on Vercel with
real Supabase behind the feedback table and the admin sign-in.

Toppkart is free: every guide is open to everyone, readers have no accounts, and there is no
billing. Voluntary support goes to a Vipps number (`VIPPS` in `lib/config.ts`). The app runs in
demo mode with no configuration. Read `.env.example` alongside this document — it lists every
variable and where to find its value.

Do the Supabase section before the first real deploy. Vercel needs the environment variables at
build time, and Supabase needs the deployment's URL, so expect one pass through Vercel to get a
domain, then a return trip to fill in redirect URLs.

---

## 1. Vercel

1. Push the repository to GitHub, GitLab or Bitbucket.
2. In Vercel, **Add New → Project**, import the repository. Vercel detects Next.js; leave the
   build command (`next build`) and output settings at their defaults.
3. Add the environment variables from `.env.example` under **Settings → Environment Variables**.
   Add them to Production and Preview separately — Preview deployments should ideally point at a
   separate Supabase project.
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
> **The redirect that comes back to a signed-in browser no longer reads it.** Google sign-in is
> built from `requestOrigin()` in
> `lib/origin.ts`, which reads the origin off the incoming request. You come back to whatever
> domain you left from — apex, `www`, or a preview host that did not exist when anything was
> configured. This used to be the single most effective way to break sign-in: a visitor on
> `toppkart.no` was sent back to `*.vercel.app`, the session cookie was set on that origin, and
> they returned to the real domain still signed out.
>
> **What still reads it**, and so still wants setting:
>
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
service-role key behind that prefix.

---

## 2. Supabase

Order matters here: schema before seed, and the redirect URL cannot be set until you know the
site's URL.

1. Create a project at <https://supabase.com/dashboard>. Pick a region close to your users
   (Frankfurt or Stockholm for Norwegian traffic).
2. Open the **SQL Editor** and run `supabase/schema.sql`. This creates the `tk_tours`,
   `tk_profiles`, `tk_feedback`, `tk_rate_limit` and `tk_tour_marks` tables, enables row-level
   security and installs the policies. The file is idempotent — re-run it after any change to
   it, which is also how an existing deployment picks up new tables and functions, and drops the
   retired subscription tables (section 8 of the file).
3. Run `supabase/seed.sql` in the same editor. This loads all 90 tours and their guide content.
   Running it against a database without the schema will fail, so do not reorder these.
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

8. Copy the project URL and the anon key from **Project Settings → API** into
   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Copy the service-role key into
   `SUPABASE_SERVICE_ROLE_KEY` as well: it bypasses RLS, so it is server-only and must never sit
   behind a `NEXT_PUBLIC_` prefix — but the feedback dialog and the admin page need it: readers
   are never signed in, and `tk_feedback` has RLS on with no policies.

---

## 3. Stripe — retired

Toppkart used to be sold as a subscription through Stripe. The subscriptions are cancelled, the
Stripe account is closed, and the code is gone. `supabase/schema.sql` drops the old
`tk_subscriptions` and `tk_invoices` tables and `tk_has_active_subscription()` when it is
re-run. There is nothing to configure.

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

## 3b. The support mailbox

`support@toppkart.no` is the one address a human reads. The app sends no mail, so it only ever
has to **receive**. That makes it cheap: you need MX records and somewhere for the mail to land,
and nothing else.

It is referenced from `SITE.supportEmail` in `lib/config.ts`: the «Kontakt» / «Contact» link in
the site footer, on every page, and the contact paragraphs on `/vilkar` and `/personvern`.

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

---

## 3c. Google Search Console

The app serves everything a crawler needs on its own — you do not configure any of this in
Vercel, and there is no verification key to paste into the code.

This section is the operational checklist. `docs/seo.md` covers the code side, including the
August 2026 Bing audit and the fixes that were priced and deliberately not made.

- `app/robots.ts` → `/robots.txt`. In production it opens the site and points at the sitemap.
  **Everywhere else it answers `Disallow: /`**, and every page additionally renders
  `noindex, nofollow`. A preview deploy is the whole site, same text, on its own domain; indexed,
  it competes with `toppkart.no` for the same searches. The switch is `VERCEL_ENV === "production"`
  in `lib/seo.ts`.
- `app/sitemap.ts` → `/sitemap.xml`. The front page, the map, the tour list, the 94 tour guides and
  the two legal pages — 99 URLs, built from `TOURS`, so a new tour is in the sitemap the moment it
  is in the data. Account and checkout pages are not listed, and say `noindex` in their own
  metadata. `lib/seo.test.ts` asserts that every URL listed here actually resolves.
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
   discovered-URL count within a day or so; 99 is the number to expect today.
2. **URL Inspection** on `https://toppkart.no/` and one guide, e.g. `/tur/slogen` → **Test live
   URL**. Confirm it says crawling is allowed, indexing is allowed, and that the rendered HTML
   holds the guide's intro text. Then **Request indexing** for both — it seeds the crawl instead
   of waiting for it.
3. Expect **Pages** and **Performance** to stay empty for a few days to a couple of weeks. That is
   normal; nothing is wrong until a URL shows up under a specific exclusion reason.

One exclusion is expected rather than a fault: `/logg-inn`, `/mine-turer` and `/admin/*` will
report "Excluded by 'noindex' tag", which is the intended outcome, not a problem to fix. Guides
are open in full, so every guide page carries its whole text.

---

## 4. Verify

Walk the real flow on the deployed site, not just the local one:

- [ ] `/` loads, shows the Vipps number under «04 · Støtt Toppkart», and nothing offers a trial.
- [ ] `/kart` renders the map with all tours; filters and the detail panel work.
- [ ] A guide, e.g. `/tur/kirketaket`, shows ascent, descent and avalanche terrain, and «Last ned
      GPX» downloads the file — all without signing in.
- [ ] «Favoritt» and «Har gått» on a guide show up on `/mine-turer`.
- [ ] `/om` shows the Vipps number with a working «Kopier nummer» button.
- [ ] `/betaling` and `/min-side` redirect to `/` and `/mine-turer`.
- [ ] `/logg-inn` (linked from nowhere): "Fortsett med Google" signs an `ADMIN_EMAILS` address in
      on the deployed domain and lands on `/admin/tilbakemeldinger`.
- [ ] `support@toppkart.no` receives a message sent from an outside address.
- [ ] `/vilkar` and `/personvern` load and are linked from the footer of every page.

      Both pages describe Toppkart as a privately run project with no company behind it, and
      route all contact to `SITE.supportEmail`. That is accurate while this is a side project.
      Register an entity, or grow into having to, and two things change together: the operator
      and controller paragraphs in `lib/i18n/legal.ts` need a name and address. They are marked
      in that file.
- [ ] `https://toppkart.no/robots.txt` allows crawling and names the sitemap;
      `https://toppkart.no/sitemap.xml` lists 99 URLs on the production domain — not on a
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

**Anonymous users can write to the database.**
If you adapt `tk_tours_public` or add a view of your own, remember that a single-table view with
no aggregate is auto-updatable, older Supabase databases grant writes on new objects to `anon` by default, and a
non-`security_invoker` view executes as its owner, which bypasses RLS. `schema.sql` revokes those
grants explicitly for that reason. Supabase's advisor does not flag this combination.
