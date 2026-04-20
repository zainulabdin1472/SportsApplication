-- SportsApp marketplace schema (Supabase)
create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  phone text,
  city text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.listings (
  id uuid primary key default uuid_generate_v4(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null,
  price numeric(10,2) not null check (price > 0),
  condition text not null check (condition in ('new', 'like_new', 'used')),
  city text not null,
  sport_tag text not null,
  status text not null default 'active' check (status in ('active', 'sold', 'archived')),
  search_vector tsvector generated always as (
    to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,'') || ' ' || coalesce(sport_tag,''))
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists listings_search_idx on public.listings using gin(search_vector);
create index if not exists listings_city_idx on public.listings(city);
create index if not exists listings_price_idx on public.listings(price);

alter table public.profiles enable row level security;
alter table public.listings enable row level security;

create policy "Public profiles view" on public.profiles
for select using (true);

create policy "Users manage own profile" on public.profiles
for all using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Public active listings view" on public.listings
for select using (status = 'active' or auth.uid() = seller_id);

create policy "Sellers insert own listings" on public.listings
for insert with check (auth.uid() = seller_id);

create policy "Sellers update own listings" on public.listings
for update using (auth.uid() = seller_id)
with check (auth.uid() = seller_id);
