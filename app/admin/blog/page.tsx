import Link from 'next/link'
import { db } from '@/lib/admin/db'
import Shell from '@/app/admin/_components/Shell'
import { deleteBlog } from '@/app/admin/_actions/blog'
import { statusPill } from '@/lib/admin/options'
import { IconChevR, IconPlus } from '@/app/admin/_components/icons'
import BlogReorder, { type BlogRow } from './BlogReorder'

export const dynamic = 'force-dynamic'

type Row = {
  id: string; title: string; slug: string; category: string | null; author: string | null
  status: string | null; is_published: boolean | null; published_at: string | null; hero_image: string | null
  seo_title: string | null; meta_description: string | null; description: string | null
}

function seoScore(r: Row) {
  let s = 0
  if (r.seo_title || r.title) s += 25
  if ((r.meta_description || r.description || '').length >= 80) s += 25
  if (r.hero_image) s += 25
  if (/^[a-z0-9-]+$/.test(r.slug)) s += 25
  return s
}

export default async function BlogPage() {
  const cols = 'id,title,slug,category,author,status,is_published,published_at,hero_image,seo_title,meta_description,description'
  // Order by the drag sort_order; fall back gracefully if the column hasn't
  // been added yet (run supabase-blog-order.sql).
  let res = await db.from('blog_posts').select(cols)
    .order('sort_order', { ascending: true, nullsFirst: false })
    .order('published_at', { ascending: false, nullsFirst: false }).limit(300)
  if (res.error) {
    res = await db.from('blog_posts').select(cols)
      .order('published_at', { ascending: false, nullsFirst: false }).limit(300)
  }
  const rows = (res.data || []) as Row[]

  const posts: BlogRow[] = rows.map((r) => {
    const sc = seoScore(r)
    const st = (r.status || (r.is_published ? 'published' : 'draft')).toLowerCase()
    return {
      id: r.id, title: r.title, slug: r.slug, category: r.category, author: r.author,
      hero_image: r.hero_image, sc, band: sc >= 75 ? 'good' : sc >= 50 ? 'mid' : 'low',
      st, stPill: statusPill[st] || 'pill--draft',
    }
  })

  return (
    <Shell active="blog" crumb={<>Content <IconChevR /> Blog &amp; Guides</>} title="Blog &amp; Guides" search
      actions={<Link className="btn btn--primary btn--sm" href="/admin/blog/new"><IconPlus />New post</Link>}>
      <div className="page-head">
        <div className="ph-l"><h2>Blog &amp; Guides</h2><p>{rows.length} posts</p></div>
        <div className="ph-r"><Link className="btn btn--primary btn--sm" href="/admin/blog/new"><IconPlus />New post</Link></div>
      </div>

      <BlogReorder posts={posts} deleteAction={deleteBlog} />
    </Shell>
  )
}
