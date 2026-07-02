-- ============================================================================
-- DELETE ALL BLOG POSTS
-- Empties public.blog_posts so a fresh batch (~120 new posts) can be imported.
-- No child tables reference blog_posts, so a plain delete is safe.
--
-- ⚠️  DESTRUCTIVE & IRREVERSIBLE. Run in the Supabase SQL editor.
-- The table structure (columns, schema_jsonld, RLS) is kept — only rows go.
-- ============================================================================

-- 1 · PREVIEW — how many posts exist now (optional)
select count(*) as posts from public.blog_posts;

-- 2 · DELETE — remove every blog post
delete from public.blog_posts;

-- 3 · VERIFY — should return 0
select count(*) as remaining from public.blog_posts;
