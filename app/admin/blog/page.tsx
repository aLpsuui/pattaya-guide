import Link from 'next/link'
import { db } from '@/lib/admin/db'
import Shell from '@/app/admin/_components/Shell'
import RowDelete from '@/app/admin/_components/RowDelete'
import { deleteBlog } from '@/app/admin/_actions/blog'
import { statusPill } from '@/lib/admin/options'
import { IconChevR, IconPlus, IconDoc, IconEdit } from '@/app/admin/_components/icons'

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
  const { data } = await db
    .from('blog_posts')
    .select('id,title,slug,category,author,status,is_published,published_at,hero_image,seo_title,meta_description,description')
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(300)
  const rows = (data || []) as Row[]

  return (
    <Shell active="blog" crumb={<>Content <IconChevR /> Blog &amp; Guides</>} title="Blog &amp; Guides" search
      actions={<Link className="btn btn--primary btn--sm" href="/admin/blog/new"><IconPlus />New post</Link>}>
      <div className="page-head">
        <div className="ph-l"><h2>Blog &amp; Guides</h2><p>{rows.length} posts</p></div>
        <div className="ph-r"><Link className="btn btn--primary btn--sm" href="/admin/blog/new"><IconPlus />New post</Link></div>
      </div>

      <section className="panel">
        <div className="table-scroll">
          <table className="data">
            <thead>
              <tr><th>Post</th><th className="hide-xs">Pillar</th><th className="hide-xs">Author</th><th>Status</th><th className="hide-xs">SEO</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const sc = seoScore(r)
                const band = sc >= 75 ? 'good' : sc >= 50 ? 'mid' : 'low'
                const st = (r.status || (r.is_published ? 'published' : 'draft')).toLowerCase()
                return (
                  <tr key={r.id}>
                    <td>
                      <Link href={`/admin/blog/${r.id}`}>
                        <div className="cell-place">
                          <div className="thumb" style={r.hero_image ? { backgroundImage: `url(${r.hero_image})` } : { background: 'linear-gradient(135deg,#9277d8,#6c4cc4)' }} />
                          <div className="info"><b className="list-link">{r.title}</b><span><IconDoc />/blog/{r.slug}</span></div>
                        </div>
                      </Link>
                    </td>
                    <td className="hide-xs"><span className="pill pill--cat">{r.category || '—'}</span></td>
                    <td className="hide-xs muted-cell">{r.author || '—'}</td>
                    <td><span className={`pill ${statusPill[st] || 'pill--draft'}`}><span className="pdot" />{st.charAt(0).toUpperCase() + st.slice(1)}</span></td>
                    <td className="hide-xs"><span className={`score-badge ${band}`}>{sc}<span className="bar"><i style={{ width: `${sc}%` }} /></span></span></td>
                    <td>
                      <div className="row-act">
                        <Link className="act-btn" href={`/admin/blog/${r.id}`} aria-label="Edit"><IconEdit /></Link>
                        <RowDelete action={deleteBlog} id={r.id} name={r.title} />
                      </div>
                    </td>
                  </tr>
                )
              })}
              {rows.length === 0 && <tr><td colSpan={6}><div className="empty"><b>No posts yet</b><span>Write your first guide.</span></div></td></tr>}
            </tbody>
          </table>
        </div>
        <div className="table-foot"><div className="info">Showing <b>{rows.length}</b> posts</div></div>
      </section>
    </Shell>
  )
}
