-- ============================================================================
-- Toppkart — database schema
-- ----------------------------------------------------------------------------
-- Paste this whole file into the Supabase SQL editor. It is idempotent: every
-- statement is `if not exists` / `or replace` / `drop … if exists` so it can be
-- re-run after edits without dropping data.
--
-- Data model follows design-reference/README.md → «Datamodell».
--
-- The access rule the whole product hangs on:
--   * The map and the key figures are open to everyone.
--   * Route description, GPX, elevation profile and avalanche terrain require a
--     running trial or an active subscription.
--
-- Postgres RLS is *row*-level, not column-level, so "some columns are free and
-- some are paid" cannot be expressed as a single policy on `tours`. This file
-- solves it the honest way instead of pretending otherwise:
--
--   1. `public.tk_tours` itself is readable only by users that pass
--      `public.tk_has_active_subscription()`. That row carries every gated column.
--   2. `public.tk_tours_public` is a view that projects **only the free columns**
--      and is granted to `anon` and `authenticated`. The view is owned by
--      `postgres` and deliberately *not* `security_invoker`, so it reads past
--      the RLS policy on the base table — that is what makes the free columns
--      world-readable without exposing the paid ones.
--
-- Anything unauthenticated or unsubscribed must query `tours_public`.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ============================================================================
-- 1. Tables
-- ============================================================================

-- ----------------------------------------------------------------------------
-- tours — the 24+ ski tours. Free columns (name … teaser) are exposed through
-- `tours_public`; the description/GPX columns are subscriber-only.
-- ----------------------------------------------------------------------------
create table if not exists public.tk_tours (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique,
  name              text not null,
  region            text not null,
  lat               double precision not null,
  lng               double precision not null,
  summit_m          integer not null,        -- summit elevation, m.a.s.l.
  vertical_m        integer not null,        -- vertical gain, metres
  duration          text not null,           -- e.g. '5–6 t'
  grade             integer not null check (grade between 1 and 4),
  aspect            text not null,           -- N, S, Ø, V, NV, NØ, SV, SØ
  season            text not null,           -- e.g. 'des–mai'
  teaser            text not null,

  -- --- gated editorial content -------------------------------------------
  description_up    text,                    -- «01 · Oppstigning», paragraphs separated by a blank line
  description_down  text,                    -- «02 · Nedkjøring», same convention
  avalanche_notes   jsonb,                   -- «03 · Skredterreng»: [{"title": "...", "body": "..."}]
  gpx_path          text,                    -- object path in Supabase Storage

  published         boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Re-run safety: bring an older `tours` up to date without touching data.
alter table public.tk_tours add column if not exists description_up   text;
alter table public.tk_tours add column if not exists description_down text;
alter table public.tk_tours add column if not exists avalanche_notes  jsonb;
alter table public.tk_tours add column if not exists gpx_path         text;
alter table public.tk_tours add column if not exists published        boolean not null default false;
alter table public.tk_tours add column if not exists created_at       timestamptz not null default now();
alter table public.tk_tours add column if not exists updated_at       timestamptz not null default now();

comment on table public.tk_tours is
  'Ski tours. Free columns are served through public.tk_tours_public; description_up/description_down/avalanche_notes/gpx_path are subscriber-only.';
comment on column public.tk_tours.avalanche_notes is
  'Array of {title, body} blocks, mirroring TourGuide.avalanche in lib/types.ts.';

-- ----------------------------------------------------------------------------
-- profiles — one row per auth user. Also the lookup table the Stripe webhook
-- uses to map a customer email back onto an app user.
-- ----------------------------------------------------------------------------
create table if not exists public.tk_profiles (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  email       text,
  locale      text not null default 'no' check (locale in ('no', 'en')),
  created_at  timestamptz not null default now()
);

comment on table public.tk_profiles is 'Application profile per auth.users row. email mirrors auth.users.email so the Stripe webhook can resolve a user without a client_reference_id.';

-- ----------------------------------------------------------------------------
-- subscriptions — Stripe state, mirrored by app/api/stripe/webhook/route.ts.
--
-- NB: the column names below are the contract with lib/access.ts, which selects
--     status, plan, cancel_at_period_end, current_period_end, trial_end,
--     created_at, card_brand, card_last4, card_exp_month, card_exp_year.
--     Do not rename without updating that file.
-- ----------------------------------------------------------------------------
create table if not exists public.tk_subscriptions (
  user_id                uuid primary key references auth.users (id) on delete cascade,
  stripe_customer_id     text,
  stripe_subscription_id text,
  status                 text not null default 'none'
                           check (status in ('none', 'trialing', 'active', 'past_due', 'canceled')),
  plan                   text check (plan in ('maned', 'ar')),
  cancel_at_period_end   boolean not null default false,
  current_period_end     timestamptz,
  trial_end              timestamptz,
  card_brand             text,
  card_last4             text,
  card_exp_month         integer,
  card_exp_year          integer,
  created_at             timestamptz not null default now(),   -- «Medlem siden» on Min side
  updated_at             timestamptz not null default now()
);

-- Re-run safety.
alter table public.tk_subscriptions add column if not exists stripe_customer_id     text;
alter table public.tk_subscriptions add column if not exists stripe_subscription_id text;
alter table public.tk_subscriptions add column if not exists plan                   text;
alter table public.tk_subscriptions add column if not exists cancel_at_period_end   boolean not null default false;
alter table public.tk_subscriptions add column if not exists current_period_end     timestamptz;
alter table public.tk_subscriptions add column if not exists trial_end              timestamptz;
alter table public.tk_subscriptions add column if not exists card_brand             text;
alter table public.tk_subscriptions add column if not exists card_last4             text;
alter table public.tk_subscriptions add column if not exists card_exp_month         integer;
alter table public.tk_subscriptions add column if not exists card_exp_year          integer;
alter table public.tk_subscriptions add column if not exists created_at             timestamptz not null default now();
alter table public.tk_subscriptions add column if not exists updated_at             timestamptz not null default now();

comment on table public.tk_subscriptions is
  'Stripe subscription state. Written only by the service role (the webhook); users may read their own row.';

-- ----------------------------------------------------------------------------
-- invoices — optional local mirror of Stripe invoices, so «02 · Kvitteringer»
-- on Min side can render without a round trip to Stripe.
-- ----------------------------------------------------------------------------
create table if not exists public.tk_invoices (
  id                 text primary key,       -- Stripe invoice id (in_…)
  user_id            uuid references auth.users (id) on delete cascade,
  amount_total       integer,                -- minor units (øre)
  currency           text,
  status             text,                   -- Stripe invoice status, verbatim
  hosted_invoice_url text,
  invoice_pdf        text,
  created_at         timestamptz not null default now()
);

comment on table public.tk_invoices is 'Mirror of Stripe invoices for the receipts table on Min side. Optional — Stripe remains the source of truth.';

-- ----------------------------------------------------------------------------
-- feedback — messages from the «Gi tilbakemelding» button.
--
-- Write-only from the app: `app/api/tilbakemelding` inserts with the service
-- role, and nothing reads it back through the API. Read it in the SQL editor:
--
--   select created_at, email, path, message
--   from public.tk_feedback order by created_at desc limit 50;
--
-- `user_id` cascades on account deletion, so a reader who asks to be forgotten
-- takes their messages with them. Feedback left signed out has no user_id and
-- is unaffected.
-- ----------------------------------------------------------------------------
create table if not exists public.tk_feedback (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users (id) on delete cascade,
  email      text,
  message    text not null,
  path       text,
  lang       text,
  created_at timestamptz not null default now()
);

comment on table public.tk_feedback is
  'Messages from the «Gi tilbakemelding» button. Written only by the service role (app/api/tilbakemelding); nobody reads it through the API — query it in the SQL editor.';

-- ============================================================================
-- 2. Indexes
-- ============================================================================

create index if not exists tk_tours_region_idx    on public.tk_tours (region);
create index if not exists tk_tours_grade_idx     on public.tk_tours (grade);
create index if not exists tk_tours_published_idx on public.tk_tours (published);

create index if not exists tk_subscriptions_stripe_customer_id_idx
  on public.tk_subscriptions (stripe_customer_id);
create index if not exists tk_subscriptions_stripe_subscription_id_idx
  on public.tk_subscriptions (stripe_subscription_id);

create index if not exists tk_invoices_user_id_idx on public.tk_invoices (user_id);
create index if not exists tk_feedback_created_at_idx on public.tk_feedback (created_at desc);
create index if not exists tk_profiles_email_idx   on public.tk_profiles (lower(email));

-- ============================================================================
-- 3. updated_at trigger
-- ============================================================================

create or replace function public.tk_set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tk_tours_set_updated_at on public.tk_tours;
create trigger tk_tours_set_updated_at
  before update on public.tk_tours
  for each row execute function public.tk_set_updated_at();

drop trigger if exists tk_subscriptions_set_updated_at on public.tk_subscriptions;
create trigger tk_subscriptions_set_updated_at
  before update on public.tk_subscriptions
  for each row execute function public.tk_set_updated_at();

-- ============================================================================
-- 4. The access predicate
-- ----------------------------------------------------------------------------
-- Mirrors grantsAccess() in lib/access.ts exactly: trialing and active grant
-- access, and a cancelled subscription keeps access until the period it has
-- already paid for runs out.
--
-- security definer + a pinned search_path so it can read `subscriptions`
-- through that table's own RLS policy without the caller needing rights on it,
-- and so it cannot be hijacked by a caller-controlled search_path.
-- ============================================================================

create or replace function public.tk_has_active_subscription(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.tk_subscriptions s
    where s.user_id = uid
      and (
        s.status in ('trialing', 'active')
        or (
          s.status = 'canceled'
          and s.current_period_end is not null
          and s.current_period_end > now()
        )
      )
  );
$$;

comment on function public.tk_has_active_subscription(uuid) is
  'True when the user may read gated guide content. Mirrors grantsAccess() in lib/access.ts.';

revoke all on function public.tk_has_active_subscription(uuid) from public;
grant execute on function public.tk_has_active_subscription(uuid) to anon, authenticated, service_role;

-- ============================================================================
-- 5. Row Level Security
-- ============================================================================

alter table public.tk_tours         enable row level security;
alter table public.tk_profiles      enable row level security;
alter table public.tk_subscriptions enable row level security;
alter table public.tk_invoices      enable row level security;
alter table public.tk_feedback      enable row level security;

-- ---------------------------------------------------------------- tours -----

-- Protects: every gated column on `tours` (description_up, description_down,
-- avalanche_notes, gpx_path). Only a signed-in user with a running trial or an
-- active subscription may read a published tour row at all. Everyone else is
-- expected to read `public.tk_tours_public` instead.
drop policy if exists "tk_tours: subscribers read published rows" on public.tk_tours;
create policy "tk_tours: subscribers read published rows"
  on public.tk_tours
  for select
  to authenticated
  using (
    published
    and public.tk_has_active_subscription(auth.uid())
  );

-- Protects: editorial content. No insert/update/delete policy exists on
-- `tours`, so writes are possible only through the service role (which bypasses
-- RLS) — i.e. the editorial pipeline, never the browser.

-- Anonymous visitors have no business touching the base table; the view is
-- their entry point. `authenticated` keeps the grant, but the policy above
-- still decides which rows they actually see.
revoke all on public.tk_tours from anon;
grant select on public.tk_tours to authenticated;
-- `grant select` adds; it does not take away. Supabase's default privileges on
-- `public` hand every new table full write access to both roles, so the write
-- bits survive unless they are revoked explicitly. RLS would refuse these
-- writes anyway (there is no write policy), but a grant nobody should hold is
-- one dropped policy away from being a hole.
revoke insert, update, delete, truncate on public.tk_tours from authenticated;

-- ------------------------------------------------------------- profiles -----

-- Protects: other users' email addresses. A user may only ever see their own
-- profile row.
drop policy if exists "tk_profiles: read own row" on public.tk_profiles;
create policy "tk_profiles: read own row"
  on public.tk_profiles
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Protects: profile ownership. A user may create and edit their own row only —
-- used by «03 · Konto» on Min side (change email, switch locale). user_id is
-- pinned in both USING and WITH CHECK so a row can never be moved to someone
-- else.
drop policy if exists "tk_profiles: insert own row" on public.tk_profiles;
create policy "tk_profiles: insert own row"
  on public.tk_profiles
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "tk_profiles: update own row" on public.tk_profiles;
create policy "tk_profiles: update own row"
  on public.tk_profiles
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- `authenticated` keeps insert and update because the two policies above are
-- what «03 · Konto» writes through; the policies pin the row to auth.uid().
-- Nobody deletes a profile from the browser, and a signed-out caller has no
-- business writing at all — RLS already refuses both, but the grants should
-- not be sitting there waiting for a policy edit to go wrong.
revoke insert, update, delete, truncate on public.tk_profiles from anon;
revoke delete, truncate on public.tk_profiles from authenticated;

-- -------------------------------------------------------- subscriptions -----

-- Protects: billing state. A user may read their own subscription and nothing
-- else — this row is what Min side renders.
drop policy if exists "tk_subscriptions: read own row" on public.tk_subscriptions;
create policy "tk_subscriptions: read own row"
  on public.tk_subscriptions
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Protects: the integrity of the paywall. There is deliberately NO insert,
-- update or delete policy on `subscriptions`. Only the service role — i.e.
-- app/api/stripe/webhook/route.ts using getSupabaseAdminClient() — can write
-- here, so a user cannot grant themselves a subscription from the browser.
revoke insert, update, delete, truncate on public.tk_subscriptions from anon, authenticated;

-- ------------------------------------------------------------- invoices -----

-- Protects: receipts. A user reads only their own invoices; the webhook (service
-- role) is the only writer, same reasoning as `subscriptions`.
drop policy if exists "tk_invoices: read own rows" on public.tk_invoices;
create policy "tk_invoices: read own rows"
  on public.tk_invoices
  for select
  to authenticated
  using (auth.uid() = user_id);

revoke insert, update, delete, truncate on public.tk_invoices from anon, authenticated;

-- tk_feedback ----------------------------------------------------------------
-- No policies at all, deliberately. The table is written by the service role
-- (which bypasses RLS) and read by a human in the dashboard; with no policy,
-- every other role is refused outright.
--
-- The revoke is load-bearing, not decorative: Supabase's default privileges
-- hand `anon` and `authenticated` full DML on new tables in public, and neither
-- `enable row level security` nor a missing policy takes that grant away. RLS
-- refuses the writes on its own today — but a grant nobody should hold is one
-- mistake away from mattering.
revoke all on public.tk_feedback from anon, authenticated;

-- ============================================================================
-- 6. tours_public — the free columns, for everyone
-- ----------------------------------------------------------------------------
-- This view is the column-level half of the gate. It exposes exactly the fields
-- lib/types.ts calls `Tour` (the map markers, the list cards, the stats grid and
-- the teaser) and nothing else. `has_guide` is derived, so the client can show
-- «Åpne turguiden →» without learning anything about the guide's contents.
--
-- It is intentionally NOT `security_invoker`: it runs as its owner (postgres)
-- and therefore reads past the RLS policy on `public.tk_tours`. That is the whole
-- point — anonymous visitors get the free columns, and only the free columns.
-- Supabase's advisor flags owner-privileged views; this one is deliberate.
--
-- `security_barrier` stops a caller from smuggling a cheap, leaky function into
-- a WHERE clause and having the planner run it before the view's own filter.
-- ============================================================================

drop view if exists public.tk_tours_public;
create view public.tk_tours_public
  with (security_barrier = true)
as
  select
    t.id,
    t.slug,
    t.name,
    t.region,
    t.lat,
    t.lng,
    t.summit_m,
    t.vertical_m,
    t.duration,
    t.grade,
    t.aspect,
    t.season,
    t.teaser,
    (t.description_up is not null) as has_guide
  from public.tk_tours t
  where t.published;

comment on view public.tk_tours_public is
  'Free columns of public.tk_tours, world-readable. The gated columns are not projected here — this is how column-level gating is implemented on top of row-level RLS.';

grant select on public.tk_tours_public to anon, authenticated;

-- This revoke is load-bearing, and the reason is subtle.
--
-- `tk_tours_public` selects from a single table with no aggregate, DISTINCT or
-- GROUP BY, which makes it *auto-updatable*: Postgres will happily rewrite an
-- insert, update or delete against the view into one against `tk_tours`.
-- Supabase's default privileges grant exactly those verbs on every new object
-- to `anon` and `authenticated`. And because the view is deliberately not
-- `security_invoker`, anything routed through it runs as the owner, `postgres`,
-- which has `rolbypassrls`.
--
-- Stack those three facts together and an anonymous PostgREST caller can
-- `DELETE /rest/v1/tk_tours_public` and have the delete land on the base table
-- with RLS bypassed entirely. Read-only is the whole contract of this view.
revoke insert, update, delete, truncate on public.tk_tours_public from anon, authenticated;

-- The trigger function is reachable over `/rest/v1/rpc/` by default. Postgres
-- refuses to run a plpgsql trigger function outside a trigger context, so this
-- is tidiness rather than a live hole — but nothing should be able to call it.
revoke all on function public.tk_handle_new_user() from anon, authenticated;

-- ============================================================================
-- 7. Keep profiles in step with auth.users
-- ----------------------------------------------------------------------------
-- The Stripe webhook falls back to matching profiles.email against the Stripe
-- customer email when no client_reference_id is present, so every auth user
-- needs a profile row from the moment they sign up.
-- ============================================================================

create or replace function public.tk_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.tk_profiles (user_id, email)
  values (new.id, new.email)
  on conflict (user_id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists tk_on_auth_user_created on auth.users;
create trigger tk_on_auth_user_created
  after insert or update of email on auth.users
  for each row execute function public.tk_handle_new_user();
