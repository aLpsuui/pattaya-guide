-- Drag-and-drop ordering for blog posts.
-- Adds a sort_order column and seeds it from the current display order
-- (newest first). Lower sort_order = shown first.

alter table blog_posts add column if not exists sort_order integer;

with ordered as (
  select id,
         row_number() over (order by published_at desc nulls last, created_at desc) - 1 as rn
  from blog_posts
)
update blog_posts b
set sort_order = o.rn
from ordered o
where b.id = o.id
  and b.sort_order is null;

create index if not exists blog_posts_sort_order_idx on blog_posts (sort_order);
