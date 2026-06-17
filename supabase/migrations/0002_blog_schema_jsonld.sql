-- ============================================================================
-- Add `schema_jsonld` to blog_posts.
-- The blog CSV ships a ready-made JSON-LD payload per post (Article +
-- BreadcrumbList + ItemList + FAQPage). Storing it lets the blog page output
-- that rich structured data verbatim instead of the minimal auto-generated one.
-- Idempotent. Run in the Supabase SQL editor before importing the CSV.
-- ============================================================================
alter table public.blog_posts add column if not exists schema_jsonld text;
