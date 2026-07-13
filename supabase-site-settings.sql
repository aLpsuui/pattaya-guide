-- Genel site ayarları için tekil (singleton) tablo. Şimdilik sadece logo_url.
-- Supabase → SQL Editor → yapıştır → Run.

create table if not exists public.site_settings (
  id         boolean primary key default true,
  logo_url   text,
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = true)
);

insert into public.site_settings (id) values (true)
on conflict (id) do nothing;

alter table public.site_settings enable row level security;

drop policy if exists "site_settings public read" on public.site_settings;
create policy "site_settings public read" on public.site_settings
  for select to anon, authenticated using (true);

grant select on public.site_settings to anon, authenticated;
