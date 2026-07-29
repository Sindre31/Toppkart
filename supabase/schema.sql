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
--   1. `public.tours` itself is readable only by users that pass
--      `public.has_active_subscription()`. That row carries every gated column.
--   2. `public.tours_public` is a view that projects **only the free columns**
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
create table if not exists public.tours (
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
alter table public.tours add column if not exists description_up   text;
alter table public.tours add column if not exists description_down text;
alter table public.tours add column if not exists avalanche_notes  jsonb;
alter table public.tours add column if not exists gpx_path         text;
alter table public.tours add column if not exists published        boolean not null default false;
alter table public.tours add column if not exists created_at       timestamptz not null default now();
alter table public.tours add column if not exists updated_at       timestamptz not null default now();

comment on table public.tours is
  'Ski tours. Free columns are served through public.tours_public; description_up/description_down/avalanche_notes/gpx_path are subscriber-only.';
comment on column public.tours.avalanche_notes is
  'Array of {title, body} blocks, mirroring TourGuide.avalanche in lib/types.ts.';

-- ----------------------------------------------------------------------------
-- profiles — one row per auth user. Also the lookup table the Stripe webhook
-- uses to map a customer email back onto an app user.
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  email       text,
  locale      text not null default 'no' check (locale in ('no', 'en')),
  created_at  timestamptz not null default now()
);

comment on table public.profiles is 'Application profile per auth.users row. email mirrors auth.users.email so the Stripe webhook can resolve a user without a client_reference_id.';

-- ----------------------------------------------------------------------------
-- subscriptions — Stripe state, mirrored by app/api/stripe/webhook/route.ts.
--
-- NB: the column names below are the contract with lib/access.ts, which selects
--     status, plan, cancel_at_period_end, current_period_end, trial_end,
--     created_at, card_brand, card_last4, card_exp_month, card_exp_year.
--     Do not rename without updating that file.
-- ----------------------------------------------------------------------------
create table if not exists public.subscriptions (
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
alter table public.subscriptions add column if not exists stripe_customer_id     text;
alter table public.subscriptions add column if not exists stripe_subscription_id text;
alter table public.subscriptions add column if not exists plan                   text;
alter table public.subscriptions add column if not exists cancel_at_period_end   boolean not null default false;
alter table public.subscriptions add column if not exists current_period_end     timestamptz;
alter table public.subscriptions add column if not exists trial_end              timestamptz;
alter table public.subscriptions add column if not exists card_brand             text;
alter table public.subscriptions add column if not exists card_last4             text;
alter table public.subscriptions add column if not exists card_exp_month         integer;
alter table public.subscriptions add column if not exists card_exp_year          integer;
alter table public.subscriptions add column if not exists created_at             timestamptz not null default now();
alter table public.subscriptions add column if not exists updated_at             timestamptz not null default now();

comment on table public.subscriptions is
  'Stripe subscription state. Written only by the service role (the webhook); users may read their own row.';

-- ----------------------------------------------------------------------------
-- invoices — optional local mirror of Stripe invoices, so «02 · Kvitteringer»
-- on Min side can render without a round trip to Stripe.
-- ----------------------------------------------------------------------------
create table if not exists public.invoices (
  id                 text primary key,       -- Stripe invoice id (in_…)
  user_id            uuid references auth.users (id) on delete cascade,
  amount_total       integer,                -- minor units (øre)
  currency           text,
  status             text,                   -- Stripe invoice status, verbatim
  hosted_invoice_url text,
  invoice_pdf        text,
  created_at         timestamptz not null default now()
);

comment on table public.invoices is 'Mirror of Stripe invoices for the receipts table on Min side. Optional — Stripe remains the source of truth.';

-- ============================================================================
-- 2. Indexes
-- ============================================================================

create index if not exists tours_region_idx    on public.tours (region);
create index if not exists tours_grade_idx     on public.tours (grade);
create index if not exists tours_published_idx on public.tours (published);

create index if not exists subscriptions_stripe_customer_id_idx
  on public.subscriptions (stripe_customer_id);
create index if not exists subscriptions_stripe_subscription_id_idx
  on public.subscriptions (stripe_subscription_id);

create index if not exists invoices_user_id_idx on public.invoices (user_id);
create index if not exists profiles_email_idx   on public.profiles (lower(email));

-- ============================================================================
-- 3. updated_at trigger
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tours_set_updated_at on public.tours;
create trigger tours_set_updated_at
  before update on public.tours
  for each row execute function public.set_updated_at();

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

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

create or replace function public.has_active_subscription(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.subscriptions s
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

comment on function public.has_active_subscription(uuid) is
  'True when the user may read gated guide content. Mirrors grantsAccess() in lib/access.ts.';

revoke all on function public.has_active_subscription(uuid) from public;
grant execute on function public.has_active_subscription(uuid) to anon, authenticated, service_role;

-- ============================================================================
-- 5. Row Level Security
-- ============================================================================

alter table public.tours         enable row level security;
alter table public.profiles      enable row level security;
alter table public.subscriptions enable row level security;
alter table public.invoices      enable row level security;

-- ---------------------------------------------------------------- tours -----

-- Protects: every gated column on `tours` (description_up, description_down,
-- avalanche_notes, gpx_path). Only a signed-in user with a running trial or an
-- active subscription may read a published tour row at all. Everyone else is
-- expected to read `public.tours_public` instead.
drop policy if exists "tours: subscribers read published rows" on public.tours;
create policy "tours: subscribers read published rows"
  on public.tours
  for select
  to authenticated
  using (
    published
    and public.has_active_subscription(auth.uid())
  );

-- Protects: editorial content. No insert/update/delete policy exists on
-- `tours`, so writes are possible only through the service role (which bypasses
-- RLS) — i.e. the editorial pipeline, never the browser.

-- Anonymous visitors have no business touching the base table; the view is
-- their entry point. `authenticated` keeps the grant, but the policy above
-- still decides which rows they actually see.
revoke all on public.tours from anon;
grant select on public.tours to authenticated;

-- ------------------------------------------------------------- profiles -----

-- Protects: other users' email addresses. A user may only ever see their own
-- profile row.
drop policy if exists "profiles: read own row" on public.profiles;
create policy "profiles: read own row"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Protects: profile ownership. A user may create and edit their own row only —
-- used by «03 · Konto» on Min side (change email, switch locale). user_id is
-- pinned in both USING and WITH CHECK so a row can never be moved to someone
-- else.
drop policy if exists "profiles: insert own row" on public.profiles;
create policy "profiles: insert own row"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "profiles: update own row" on public.profiles;
create policy "profiles: update own row"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- -------------------------------------------------------- subscriptions -----

-- Protects: billing state. A user may read their own subscription and nothing
-- else — this row is what Min side renders.
drop policy if exists "subscriptions: read own row" on public.subscriptions;
create policy "subscriptions: read own row"
  on public.subscriptions
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Protects: the integrity of the paywall. There is deliberately NO insert,
-- update or delete policy on `subscriptions`. Only the service role — i.e.
-- app/api/stripe/webhook/route.ts using getSupabaseAdminClient() — can write
-- here, so a user cannot grant themselves a subscription from the browser.
revoke insert, update, delete on public.subscriptions from anon, authenticated;

-- ------------------------------------------------------------- invoices -----

-- Protects: receipts. A user reads only their own invoices; the webhook (service
-- role) is the only writer, same reasoning as `subscriptions`.
drop policy if exists "invoices: read own rows" on public.invoices;
create policy "invoices: read own rows"
  on public.invoices
  for select
  to authenticated
  using (auth.uid() = user_id);

revoke insert, update, delete on public.invoices from anon, authenticated;

-- ============================================================================
-- 6. tours_public — the free columns, for everyone
-- ----------------------------------------------------------------------------
-- This view is the column-level half of the gate. It exposes exactly the fields
-- lib/types.ts calls `Tour` (the map markers, the list cards, the stats grid and
-- the teaser) and nothing else. `has_guide` is derived, so the client can show
-- «Åpne turguiden →» without learning anything about the guide's contents.
--
-- It is intentionally NOT `security_invoker`: it runs as its owner (postgres)
-- and therefore reads past the RLS policy on `public.tours`. That is the whole
-- point — anonymous visitors get the free columns, and only the free columns.
-- Supabase's advisor flags owner-privileged views; this one is deliberate.
--
-- `security_barrier` stops a caller from smuggling a cheap, leaky function into
-- a WHERE clause and having the planner run it before the view's own filter.
-- ============================================================================

drop view if exists public.tours_public;
create view public.tours_public
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
  from public.tours t
  where t.published;

comment on view public.tours_public is
  'Free columns of public.tours, world-readable. The gated columns are not projected here — this is how column-level gating is implemented on top of row-level RLS.';

grant select on public.tours_public to anon, authenticated;

-- ============================================================================
-- 7. Keep profiles in step with auth.users
-- ----------------------------------------------------------------------------
-- The Stripe webhook falls back to matching profiles.email against the Stripe
-- customer email when no client_reference_id is present, so every auth user
-- needs a profile row from the moment they sign up.
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, email)
  values (new.id, new.email)
  on conflict (user_id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update of email on auth.users
  for each row execute function public.handle_new_user();
