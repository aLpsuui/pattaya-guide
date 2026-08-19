-- Haftalık AI SEO analizi raporlarını saklar. Generator (scripts/seo-analysis.mjs)
-- GSC + GA4 verisini okuyup Claude ile öneri üretir ve buraya yazar; admin
-- /admin/analytics sayfası en son raporu + geçmişi buradan gösterir.
-- Supabase → SQL Editor → yapıştır → Run (bir kez).

create table if not exists public.seo_recommendations (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  period_start date,
  period_end   date,
  model        text,
  summary      text,              -- kısa genel değerlendirme (TR)
  -- items: [{ priority:1|2|3, kind:'improve'|'gap', page_path, page_type,
  --           target, issue, impressions, clicks, ctr, position, action }]
  items        jsonb not null default '[]'::jsonb,
  meta         jsonb not null default '{}'::jsonb  -- toplamlar/sayaçlar
);

create index if not exists idx_seo_recs_created on public.seo_recommendations (created_at desc);

-- RLS: açık + hiç politika yok = anon/authenticated ERİŞEMEZ. Sadece service_role
-- (admin server, RLS'i baypas eder) okur/yazar. contact_messages ile aynı desen.
alter table public.seo_recommendations enable row level security;
