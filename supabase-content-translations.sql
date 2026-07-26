-- DB içeriği çeviri cache'i (Rusça i18n Phase 2).
-- EN kaynak metin → Claude ile çevrilir, buraya yazılır; sonraki render'lar
-- buradan okur. source_hash EN metnin hash'i: kaynak değişirse yeniden çevrilir.
-- Supabase → SQL Editor → yapıştır → Run.

create table if not exists public.content_translations (
  source_table text not null,      -- 'blog_posts' | 'venues' | 'categories'
  source_id    text not null,      -- kaydın id'si
  field        text not null,      -- 'title' | 'description' | 'page_html' | 'name' ...
  locale       text not null,      -- 'ru'
  source_hash  text not null,      -- EN metnin sha256'sı
  value        text,               -- çevrilmiş metin
  updated_at   timestamptz not null default now(),
  primary key (source_table, source_id, field, locale)
);

alter table public.content_translations enable row level security;

-- Herkese okuma açık (SEO — Rusça HTML sunulur). Yazma service-role ile yapılır.
drop policy if exists "content_translations public read" on public.content_translations;
create policy "content_translations public read" on public.content_translations
  for select to anon, authenticated using (true);

grant select on public.content_translations to anon, authenticated;
