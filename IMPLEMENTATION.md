# Autonoma Environment Factory — integration checklist

SDK endpoint path: /api/autonoma

Stack: Next.js 16 (App Router) + Supabase (service-role writes). Factories reuse the
app's own service-role client (`lib/admin/db.ts`) and mirror the real creation paths
in `app/admin/_actions/*` and `app/[lang]/contact/actions.ts` / `lib/i18n/translateContent.ts`.

## Infrastructure
- [x] Install `@autonoma-ai/sdk` + `@autonoma-ai/server-web` + `zod`
- [x] `AUTONOMA_SHARED_SECRET` — read from provisioned env (not hardcoded)
- [x] `AUTONOMA_SIGNING_SECRET` — generated, added to `.env.local` (gitignored)
- [x] Endpoint `POST /api/autonoma` via `createHandler` (discover → 200, 13 models)
- [x] Auth callback returns real admin session cookie + login password (no placeholder)
- [x] Teardown per factory (no tenant scope in this app → per-record reverse-dependency delete)
- [x] Maintenance note appended to `AGENTS.md`

## Factories (every entity from entity-audit.md)
Roots (independently_created):
- [x] categories — mirrors `createCategory` (app/admin/_actions/categories.ts)
- [x] venues — mirrors `savePlace` insert (app/admin/_actions/places.ts)
- [x] venue_photos — mirrors `addVenuePhotos` insert (places.ts)
- [x] blog_posts — mirrors `saveBlog` insert (app/admin/_actions/blog.ts)
- [x] contact_messages — mirrors `submitContact` insert (app/[lang]/contact/actions.ts)
- [x] content_translations — mirrors `getTranslated` upsert + sha256 (lib/i18n/translateContent.ts)
- [x] site_settings — mirrors `saveSettings` upsert (app/admin/_actions/settings.ts)

Dependents (created via SQL seed in the app — insert copied into factory):
- [x] venue_menu_items
- [x] venue_facilities
- [x] venue_quick_facts
- [x] venue_treatment_tags
- [x] venue_highlights
- [x] venue_faqs

## Validation (full-recipe up exercised every factory; DB inspected before + after down)
All 13 factories validated via the full `sdk up` (73 rows + site_settings created,
counts matched exactly) → `sdk down` (all rows gone, site_settings restored):
- [x] categories (5)
- [x] venues (2)
- [x] venue_photos (10)
- [x] venue_menu_items (6)
- [x] venue_facilities (8)
- [x] venue_quick_facts (6)
- [x] venue_treatment_tags (6)
- [x] venue_highlights (8)
- [x] venue_faqs (6)
- [x] blog_posts (3)
- [x] contact_messages (3)
- [x] content_translations (10)
- [x] site_settings (1)

## Final gates
- [x] Full-recipe `sdk up` → all rows created → `sdk down` → all rows gone
- [x] Wrong-signature rejected (401)
- [x] Auth payload contains real credentials (pg_admin cookie + admin password)
- [x] Time-sensitive field (blog_posts.published_at) lands on intended side of now
      (published posts 2d/7d in the past, is_published=true; draft has null)
- [x] `sdk check` on recipe.json prints `"ok": true`
- [x] Concurrent-instances proof (`sdk up --repeat 3`) passes — 3 instances live at once
- [ ] Committed, pushed, PR opened

## Notes / decisions
- **No tenant scope.** This is a single-tenant content site; there is no
  organization/workspace root. `scopeField` is set to `venue_id` (the FK on the most
  models) purely for the discover schema. Teardown is per-record in reverse
  dependency order (the SDK derives order from the `_alias`/`_ref` graph).
- **Unique columns tokenized:** `categories.slug` (categories_slug_key),
  `venues.slug` (venues_slug_key), `blog_posts.slug` (blog_posts_slug_key) all carry
  `{{testRunShortId}}`. `content_translations` PK is composite
  (source_table, source_id, field, locale); source_id is a per-run UUID resolved via
  `_ref`, so it is unique per run without a token.
- **site_settings is a global singleton** (`id boolean primary key default true`,
  `check (id = true)`). Only one row can ever exist, so it cannot be made per-run.
  It does NOT block the concurrency proof: the factory upserts (never violates a
  unique constraint) and teardown restores the previous `logo_url` instead of deleting
  the shared row (deleting would remove non-test data).
- **published_at** is derived at seed time from `publishedMinutesAgo` (now − offset)
  so published posts stay recent/correctly ordered; drafts get no published_at
  (mirrors `saveBlog`, which only sets it when `status === 'published'`).
