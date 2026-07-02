-- ============================================================================
-- Venue detail schema
-- ----------------------------------------------------------------------------
-- Extends the existing `public.venues` table with the columns a venue single
-- (detail) page needs, and adds normalised child tables for the repeating
-- blocks on that page (gallery photos, treatment menu, facilities, quick facts,
-- treatment tags, "good to know" highlights and FAQs).
--
-- Design notes:
--   * One row per venue in `venues`; every repeating UI block is its own table
--     keyed by `venue_id` with a `sort_order` so the page renders in a stable,
--     editable order.
--   * The menu groups rows with a free-text `section` column instead of a
--     separate sections table — sections are presentational, not entities.
--   * Idempotent: uses `add column if not exists` / `create table if not exists`
--     and re-creatable policies, so it is safe to run more than once.
-- ============================================================================

-- Required for gen_random_uuid()
create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- 1 · Extend venues with detail-page columns
-- ----------------------------------------------------------------------------
alter table public.venues
  add column if not exists tagline             text,        -- hero sub-title
  add column if not exists description         text,        -- SEO meta description
  add column if not exists about               text[],      -- long copy, one element per paragraph
  add column if not exists neighborhood        text,        -- "Central Pattaya · Bang Lamung"
  add column if not exists nearby              text,        -- "In central Pattaya, near Soi Buakhao…"
  add column if not exists hours               text,        -- "Daily · 11:00–01:00"
  add column if not exists hours_note          text,        -- "confirm hours before visiting"
  add column if not exists website             text,
  add column if not exists website_label       text,        -- "RINN on Facebook"
  add column if not exists facebook_url        text,
  add column if not exists maps_query          text,        -- google-maps ?q= string
  add column if not exists latitude            numeric(9,6),
  add column if not exists longitude           numeric(9,6),
  add column if not exists price_from          integer,     -- numeric "from" price in THB
  add column if not exists price_from_label    text,        -- "Thai massage · from"
  add column if not exists menu_intro          text,        -- paragraph above the menu table
  add column if not exists menu_note           text,        -- info note below the menu table
  add column if not exists map_road_label      text,        -- schematic-map main road
  add column if not exists map_soi_label       text,        -- schematic-map side soi
  add column if not exists map_pin_label       text,        -- schematic-map pin caption
  add column if not exists locally_verified    boolean not null default false,
  add column if not exists gallery_more_count  integer not null default 0;

-- Needed so the seed can upsert a venue by slug and so detail pages route by slug.
create unique index if not exists venues_slug_key on public.venues (slug);

-- ----------------------------------------------------------------------------
-- 2 · Child tables
-- ----------------------------------------------------------------------------
create table if not exists public.venue_photos (
  id         uuid primary key default gen_random_uuid(),
  venue_id   uuid not null references public.venues(id) on delete cascade,
  url        text not null,
  alt        text,
  caption    text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.venue_menu_items (
  id          uuid primary key default gen_random_uuid(),
  venue_id    uuid not null references public.venues(id) on delete cascade,
  section     text,                     -- "À la carte (1 hour)", "Packages · 2 hours"…
  name        text not null,            -- "Thai Massage"
  detail      text,                     -- "— foot + aroma oil"
  duration    text,                     -- "60 min"
  price       text,                     -- "~฿390" / "฿1,100 (2,300)"
  is_featured boolean not null default false,  -- bold the row name
  sort_order  integer not null default 0
);

create table if not exists public.venue_facilities (
  id         uuid primary key default gen_random_uuid(),
  venue_id   uuid not null references public.venues(id) on delete cascade,
  icon       text not null default 'pg-check',   -- icon symbol id
  label      text not null,
  sort_order integer not null default 0
);

create table if not exists public.venue_quick_facts (
  id         uuid primary key default gen_random_uuid(),
  venue_id   uuid not null references public.venues(id) on delete cascade,
  icon       text not null default 'pg-info',
  value      text not null,             -- "4.5 / 5"
  label      text not null,             -- "709 reviews"
  sort_order integer not null default 0
);

create table if not exists public.venue_treatment_tags (
  id         uuid primary key default gen_random_uuid(),
  venue_id   uuid not null references public.venues(id) on delete cascade,
  label      text not null,
  color      text not null default 'blue',   -- 'blue' | 'cyan'
  sort_order integer not null default 0
);

create table if not exists public.venue_highlights (
  id         uuid primary key default gen_random_uuid(),
  venue_id   uuid not null references public.venues(id) on delete cascade,
  label      text not null,             -- a "Good to know" checklist line
  sort_order integer not null default 0
);

create table if not exists public.venue_faqs (
  id         uuid primary key default gen_random_uuid(),
  venue_id   uuid not null references public.venues(id) on delete cascade,
  question   text not null,
  answer     text not null,
  sort_order integer not null default 0
);

-- ----------------------------------------------------------------------------
-- 3 · Indexes on the foreign keys (every block is fetched by venue_id)
-- ----------------------------------------------------------------------------
create index if not exists idx_venue_photos_venue          on public.venue_photos(venue_id);
create index if not exists idx_venue_menu_items_venue       on public.venue_menu_items(venue_id);
create index if not exists idx_venue_facilities_venue       on public.venue_facilities(venue_id);
create index if not exists idx_venue_quick_facts_venue      on public.venue_quick_facts(venue_id);
create index if not exists idx_venue_treatment_tags_venue   on public.venue_treatment_tags(venue_id);
create index if not exists idx_venue_highlights_venue       on public.venue_highlights(venue_id);
create index if not exists idx_venue_faqs_venue             on public.venue_faqs(venue_id);

-- ----------------------------------------------------------------------------
-- 4 · Row Level Security — public (anon) read-only, matching venues/blog_posts
-- ----------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'venue_photos','venue_menu_items','venue_facilities','venue_quick_facts',
    'venue_treatment_tags','venue_highlights','venue_faqs'
  ]
  loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists "Public read %1$s" on public.%1$I;', t);
    execute format('create policy "Public read %1$s" on public.%1$I for select using (true);', t);
  end loop;
end $$;
