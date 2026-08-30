-- Rezervasyon (booking) lead'leri + venue booking flag.
-- Supabase → SQL Editor → Run (bir kez).

-- 1) Hangi venue'de booking widget'ı gösterilecek (gelecek partnerler için flag).
alter table public.venues add column if not exists booking_enabled boolean not null default false;
update public.venues set booking_enabled = true where slug = 'pattaya-jungle-atv-ride';

-- 2) Booking lead'leri. gotopattaya lead'i sahiplenir (komisyon); ekip /admin/bookings'ten görür.
create table if not exists public.bookings (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  venue_id       uuid references public.venues(id) on delete set null,
  venue_slug     text,
  venue_name     text,
  tour           text,                    -- seçilen tur (section)
  items          jsonb not null default '[]'::jsonb,  -- [{name, qty, price}]
  preferred_date date,
  headcount      integer,
  total_baht     integer,
  customer_name  text not null,
  customer_contact text not null,         -- telefon / WhatsApp
  customer_email text,
  note           text,
  locale         text,
  status         text not null default 'new',  -- new | contacted | confirmed | cancelled
  constraint bookings_status_chk check (status in ('new','contacted','confirmed','cancelled'))
);

create index if not exists idx_bookings_created on public.bookings (created_at desc);
create index if not exists idx_bookings_venue on public.bookings (venue_id);
create index if not exists idx_bookings_status on public.bookings (status);

-- RLS: açık + hiç politika yok = anon/authenticated ERİŞEMEZ. Sadece service_role
-- (server action + admin) okur/yazar. contact_messages ile aynı desen (PII korunur).
alter table public.bookings enable row level security;
