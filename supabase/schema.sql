-- ─────────────────────────────────────────────────────────────
-- Marian Barnow Spiritual Training — client portal database
-- Run once in Supabase → SQL Editor → New query → Run.
-- ─────────────────────────────────────────────────────────────

-- Profiles: one row per client, created automatically at sign-up
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Free meditations and webinars
create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('meditation', 'webinar')),
  title text not null,
  description text,
  media_url text,          -- YouTube, Vimeo, or a direct .mp3 / .mp4 link
  thumbnail_url text,
  duration_minutes integer,
  theme text,              -- e.g. Grounding, Sleep, Sacred Geometry
  live_at timestamptz,     -- webinars: start of the live session (empty for recordings)
  join_url text,           -- webinars: Zoom / Meet link, shown 15 min before start
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Which items a client has marked as done
create table if not exists public.content_completions (
  user_id uuid not null references auth.users (id) on delete cascade,
  content_id uuid not null references public.content_items (id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, content_id)
);

-- Prices for Momence classes, matched against the class name
-- e.g. name_match 'Meditation Class' → 2000 (= €20)
create table if not exists public.class_pricing (
  id uuid primary key default gen_random_uuid(),
  name_match text not null,
  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'eur',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Paid places in in-person classes
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  momence_session_id bigint not null,
  session_name text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  location text,
  amount_cents integer not null,
  currency text not null default 'eur',
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'needs_attention', 'cancelled')),
  stripe_checkout_id text unique,
  stripe_payment_intent text,
  momence_member_id bigint,
  momence_booking_id bigint,
  error text,
  created_at timestamptz not null default now()
);
create index if not exists bookings_user_idx on public.bookings (user_id, starts_at);

-- ─── Row-level security ──────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.content_items enable row level security;
alter table public.content_completions enable row level security;
alter table public.class_pricing enable row level security;
alter table public.bookings enable row level security;

drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles
  for select to authenticated using (auth.uid() = id);

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- Clients may change their name, never their admin flag
revoke update on public.profiles from authenticated;
grant update (full_name) on public.profiles to authenticated;

drop policy if exists "signed-in clients read published content" on public.content_items;
create policy "signed-in clients read published content" on public.content_items
  for select to authenticated using (published = true);

drop policy if exists "manage own completions" on public.content_completions;
create policy "manage own completions" on public.content_completions
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "read own bookings" on public.bookings;
create policy "read own bookings" on public.bookings
  for select to authenticated using (auth.uid() = user_id);

-- class_pricing has no client policies: only the server (service role) reads it.
-- Content, pricing and bookings are written by the server after checking is_admin.

-- ─── Starting prices (edit to match your offers) ─────────────
insert into public.class_pricing (name_match, price_cents) values
  ('Meditation Class', 2000),
  ('Spiritual Intuition', 5000),
  ('Sanctuary Meditation', 5000)
on conflict do nothing;

-- ─── Make yourself admin after you have signed up once ───────
-- update public.profiles set is_admin = true
--   where id = (select id from auth.users where email = 'marianbarnow@gmail.com');
