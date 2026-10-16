-- ============================================================================
-- Toppkart — database schema
-- ----------------------------------------------------------------------------
-- Paste this whole file into the Supabase SQL editor. It is idempotent: every
-- statement is `if not exists` / `or replace` / `drop … if exists` so it can be
-- re-run after edits without dropping data.
--
-- Data model follows design-reference/README.md → «Datamodell».
--
-- Toppkart is free: every tour and every guide is open to everyone, and
-- readers have no accounts. Sign-in exists only for /admin (ADMIN_EMAILS).
--
--   * `public.tk_tours` is readable by everyone, published rows only.
--   * `public.tk_tours_public` is a view of the card columns, kept for callers
--     that only want what the map shows.
--
-- The subscription tables and `tk_has_active_subscription()` from when
-- Toppkart was sold as a subscription are dropped in section 8.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ============================================================================
-- 1. Tables
-- ============================================================================

-- ----------------------------------------------------------------------------
-- tours — the ski tours. The card columns (name … teaser) are also exposed
-- through `tk_tours_public`.
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

  -- --- editorial content -------------------------------------------------
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
  'Ski tours, all columns open to everyone. The card columns are also served through public.tk_tours_public.';
comment on column public.tk_tours.avalanche_notes is
  'Array of {title, body} blocks, mirroring TourGuide.avalanche in lib/types.ts.';

-- ----------------------------------------------------------------------------
-- profiles — one row per auth user (admins only, now that readers have no
-- accounts).
-- ----------------------------------------------------------------------------
create table if not exists public.tk_profiles (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  email       text,
  locale      text not null default 'no' check (locale in ('no', 'en')),
  created_at  timestamptz not null default now()
);

comment on table public.tk_profiles is 'Application profile per auth.users row. email mirrors auth.users.email.';

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
  -- Null means unhandled. A timestamp rather than a boolean: «behandlet» and
  -- «behandlet den 5. august» cost the same to store, and only one of them can
  -- answer «how long did that sit there».
  handled_at timestamptz,
  created_at timestamptz not null default now()
);

-- Re-run safety.
alter table public.tk_feedback add column if not exists handled_at timestamptz;

comment on table public.tk_feedback is
  'Messages from the «Gi tilbakemelding» button. Written only by the service role (app/api/tilbakemelding); nobody reads it through the API — query it in the SQL editor.';

-- ----------------------------------------------------------------------------
-- tour_marks — the reader's favourites and the tours they have done.
--
-- One row per reader and tour. `favorite` and `done_on` live on the same row
-- because a reader marks a tour, not a list: the star and the tick on a guide
-- are two facts about the same peak. A row with neither is deleted by the app
-- rather than kept as a row that says nothing (`lib/tour-marks.ts`), and the
-- check below makes such a row impossible to write.
--
-- `slug` is not a foreign key to `tk_tours`: the app's tour list lives in
-- `lib/tours.ts`, and the route (`app/api/turmerker`) only accepts slugs from
-- it. A mark for a tour that is later removed lingers harmlessly and is not
-- counted.
--
-- Written through the reader's own session, not the service role, so the RLS
-- policies in section 5 are the boundary. `user_id` cascades on account
-- deletion: a reader who asks to be forgotten takes their list with them.
-- ----------------------------------------------------------------------------
create table if not exists public.tk_tour_marks (
  user_id    uuid not null references auth.users (id) on delete cascade,
  slug       text not null check (slug ~ '^[a-z0-9-]{1,80}$'),
  favorite   boolean not null default false,
  done_on    date,
  updated_at timestamptz not null default now(),
  primary key (user_id, slug),
  constraint tk_tour_marks_not_empty check (favorite or done_on is not null)
);

comment on table public.tk_tour_marks is
  'A reader''s favourite tours and the tours they have done. Written through the reader''s own session (app/api/turmerker); RLS pins every row to auth.uid().';

-- ----------------------------------------------------------------------------
-- Rate limit counters.
--
-- What it protects: `tk_feedback`, which is written by an endpoint that does not
-- require signing in. That is a deliberate product decision — the people most
-- likely to have something useful to say are the ones who have not signed up —
-- and it leaves the table one loop away from being full of whatever a script
-- feels like putting there. The honeypot in the route catches a naive form
-- filler; it does nothing at all against someone who reads the request in the
-- network tab and repeats it.
--
-- **`key` is a hash, never an address.** The route hashes the caller's IP with
-- a salt before it gets here, so this table cannot say who visited, only that
-- *something* did — and only for the length of one window. See `lib/rate-limit.ts`.
--
-- Counting in Postgres rather than in the app is the whole point: the app runs
-- as however many lambdas Vercel felt like starting, and a counter in each of
-- their memories is not a limit, it is a suggestion. `insert … on conflict do
-- update` takes a row lock, so two requests arriving in the same millisecond
-- come out as 1 and 2 rather than both as 1.
-- ----------------------------------------------------------------------------
create table if not exists public.tk_rate_limit (
  key          text primary key,
  window_start timestamptz not null default now(),
  count        integer not null default 0
);

comment on table public.tk_rate_limit is
  'Fixed-window request counters, keyed by a salted hash of the caller. Written only by public.tk_rate_limit_hit(); rows are disposable and swept after a day.';

-- ============================================================================
-- 2. Indexes
-- ============================================================================

create index if not exists tk_tours_region_idx    on public.tk_tours (region);
create index if not exists tk_tours_grade_idx     on public.tk_tours (grade);
create index if not exists tk_tours_published_idx on public.tk_tours (published);

create index if not exists tk_feedback_created_at_idx on public.tk_feedback (created_at desc);
create index if not exists tk_feedback_handled_at_idx on public.tk_feedback (handled_at);
create index if not exists tk_profiles_email_idx   on public.tk_profiles (lower(email));

-- Only the sweep in tk_rate_limit_hit() reads by this column; every other access
-- is a primary-key lookup.
create index if not exists tk_rate_limit_window_idx on public.tk_rate_limit (window_start);

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

-- ============================================================================
-- 4. The rate limiter
-- ----------------------------------------------------------------------------
-- One call, one answer: may this request proceed? Counts the hit and returns
-- true while the caller is inside its allowance for the current window.
--
-- Fixed window, not sliding. A fixed window lets someone spend a full allowance
-- at the end of one window and another at the start of the next, so the real
-- worst case is twice the limit over a short stretch. That is a known and
-- accepted property: this protects a feedback table from a loop, it is not a
-- traffic shaper, and the sliding version costs a row per request to store the
-- timestamps a slide needs.
--
-- The counter is incremented *before* the answer is given, so a caller already
-- over the limit keeps pushing its own window's count up. That is intended —
-- someone hammering the endpoint stays locked out until they stop for a full
-- window, rather than being handed one free request per window boundary.
-- ============================================================================

create or replace function public.tk_rate_limit_hit(
  p_key            text,
  p_window_seconds integer,
  p_limit          integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count   integer;
  v_expired boolean;
begin
  insert into public.tk_rate_limit as r (key, window_start, count)
  values (p_key, now(), 1)
  on conflict (key) do update
    set count = case
          when r.window_start < now() - make_interval(secs => p_window_seconds) then 1
          else r.count + 1
        end,
        window_start = case
          when r.window_start < now() - make_interval(secs => p_window_seconds) then now()
          else r.window_start
        end
  returning count, count = 1 into v_count, v_expired;

  -- Housekeeping, only when a window has just opened. Every row here is
  -- disposable the moment its window is over, and nothing reads them back, so
  -- the table would otherwise grow one row per distinct caller for ever.
  -- Tying the sweep to a fresh window keeps it off the hot path without
  -- needing a scheduled job in a project that has none.
  if v_expired then
    delete from public.tk_rate_limit where window_start < now() - interval '1 day';
  end if;

  return v_count <= p_limit;
end;
$$;

comment on function public.tk_rate_limit_hit(text, integer, integer) is
  'Counts one hit against a fixed window and returns true while the caller is within p_limit. Called by lib/rate-limit.ts with the service role.';

-- The service role is the only caller, and it is the only one that should be:
-- an anonymous visitor who could call this could also spend someone else''s
-- allowance for them, given a key they can guess.
revoke all on function public.tk_rate_limit_hit(text, integer, integer) from public;
grant execute on function public.tk_rate_limit_hit(text, integer, integer) to service_role;

-- ============================================================================
-- 5. Row Level Security
-- ============================================================================

alter table public.tk_tours         enable row level security;
alter table public.tk_profiles      enable row level security;
alter table public.tk_feedback      enable row level security;
alter table public.tk_rate_limit    enable row level security;
alter table public.tk_tour_marks    enable row level security;

-- ---------------------------------------------------------------- tours -----

-- Everything on a published tour is open to everyone — Toppkart is free.
-- The old subscriber-only policy is dropped by name so a re-run on an existing
-- database replaces it.
drop policy if exists "tk_tours: subscribers read published rows" on public.tk_tours;
drop policy if exists "tk_tours: everyone reads published rows" on public.tk_tours;
create policy "tk_tours: everyone reads published rows"
  on public.tk_tours
  for select
  to anon, authenticated
  using (published);

-- Protects: editorial content. No insert/update/delete policy exists on
-- `tours`, so writes are possible only through the service role (which bypasses
-- RLS) — i.e. the editorial pipeline, never the browser.

-- Read-only for both roles; the policy above decides which rows.
grant select on public.tk_tours to anon, authenticated;
-- `grant select` adds; it does not take away. Supabase's default privileges on
-- `public` hand every new table full write access to both roles, so the write
-- bits survive unless they are revoked explicitly. RLS would refuse these
-- writes anyway (there is no write policy), but a grant nobody should hold is
-- one dropped policy away from being a hole.
revoke insert, update, delete, truncate on public.tk_tours from anon, authenticated;

-- ------------------------------------------------------------- profiles -----

-- Protects: other users' email addresses. A user may only ever see their own
-- profile row.
drop policy if exists "tk_profiles: read own row" on public.tk_profiles;
create policy "tk_profiles: read own row"
  on public.tk_profiles
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Protects: profile ownership. A user may create and edit their own row only.
-- user_id is pinned in both USING and WITH CHECK so a row can never be moved
-- to someone else.
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

-- `authenticated` keeps insert and update for the two policies above; they pin
-- the row to auth.uid().
-- Nobody deletes a profile from the browser, and a signed-out caller has no
-- business writing at all — RLS already refuses both, but the grants should
-- not be sitting there waiting for a policy edit to go wrong.
revoke insert, update, delete, truncate on public.tk_profiles from anon;
revoke delete, truncate on public.tk_profiles from authenticated;

-- ----------------------------------------------------------- tour_marks -----

-- Protects: what other readers have marked. A reader may read, add, change
-- and remove their own marks and nobody else's. user_id is pinned in both
-- USING and WITH CHECK so a row can never be moved to someone else.
drop policy if exists "tk_tour_marks: read own rows" on public.tk_tour_marks;
create policy "tk_tour_marks: read own rows"
  on public.tk_tour_marks
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "tk_tour_marks: insert own rows" on public.tk_tour_marks;
create policy "tk_tour_marks: insert own rows"
  on public.tk_tour_marks
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "tk_tour_marks: update own rows" on public.tk_tour_marks;
create policy "tk_tour_marks: update own rows"
  on public.tk_tour_marks
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "tk_tour_marks: delete own rows" on public.tk_tour_marks;
create policy "tk_tour_marks: delete own rows"
  on public.tk_tour_marks
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- A signed-out caller has nothing to mark. RLS already refuses `anon` (no
-- policy names it), but the grant should not be sitting there. `truncate`
-- ignores RLS entirely, so nobody outside the service role keeps it.
revoke all on public.tk_tour_marks from anon;
revoke truncate on public.tk_tour_marks from authenticated;
grant select, insert, update, delete on public.tk_tour_marks to authenticated;

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

-- tk_rate_limit --------------------------------------------------------------
-- Same shape and the same reasoning: no policies, and the grant taken back.
-- Only `tk_rate_limit_hit()` touches this table, and it runs as its owner, so
-- nothing needs to reach the rows directly. A caller who could write here could
-- also zero their own counter, which is the whole limit gone.
revoke all on public.tk_rate_limit from anon, authenticated;

-- ============================================================================
-- 6. tours_public — the card columns, for everyone
-- ----------------------------------------------------------------------------
-- Exposes exactly the fields lib/types.ts calls `Tour` (the map markers, the
-- list cards, the stats grid and the teaser). `has_guide` is derived.
--
-- It was the column-level half of the paywall: not `security_invoker`, so it
-- runs as its owner (postgres) and reads past RLS on `public.tk_tours`. With
-- the guides free that no longer hides anything, but the view still only
-- shows published rows, and Supabase's advisor will keep flagging it.
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
  'Card columns of public.tk_tours (published rows), world-readable.';

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
-- Every auth user gets a profile row from the moment they sign up. Only admins
-- sign in now.
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

-- ============================================================================
-- 8. Retired: the subscription
-- ----------------------------------------------------------------------------
-- Toppkart was sold as a subscription through Stripe until October 2026. The
-- Stripe account is closed, and nothing in the app reads or writes these any
-- more. The `tk_tours` policy that called the function is replaced in section
-- 5, so the function has no dependants left by the time it is dropped here.
-- ============================================================================

drop function if exists public.tk_has_active_subscription(uuid);
drop table if exists public.tk_invoices;
drop table if exists public.tk_subscriptions;
