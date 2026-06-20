import Link from 'next/link'
import { db } from '@/lib/admin/db'
import Shell from '@/app/admin/_components/Shell'
import { IconPin, IconDoc, IconImage, IconChevR, IconPlus, IconCheck, IconWarn } from '@/app/admin/_components/icons'

export const dynamic = 'force-dynamic'

async function countAll(table: string) {
  const { count } = await db.from(table).select('*', { count: 'exact', head: true })
  return count || 0
}
async function countWhere(table: string, col: string, val: unknown) {
  const { count } = await db.from(table).select('*', { count: 'exact', head: true }).eq(col, val)
  return count || 0
}

export default async function Dashboard() {
  const [venues, venuesPub, posts, postsPub, draftVenues] = await Promise.all([
    countAll('venues'),
    countWhere('venues', 'is_active', true),
    countAll('blog_posts'),
    countWhere('blog_posts', 'is_published', true),
    countWhere('venues', 'is_active', false),
  ])

  const kpis = [
    { ic: 'blue', icon: <IconPin />, val: venues, label: 'Total places' },
    { ic: 'green', icon: <IconCheck />, val: venuesPub, label: 'Published places' },
    { ic: 'amber', icon: <IconDoc />, val: posts, label: 'Blog posts' },
    { ic: 'red', icon: <IconWarn />, val: draftVenues, label: 'Places in draft' },
  ]
  const quick = [
    { href: '/admin/places/new', icon: <IconPin />, title: 'Add a place', sub: 'New venue + SEO' },
    { href: '/admin/blog/new', icon: <IconDoc />, title: 'Write a post', sub: 'New guide' },
    { href: '/admin/media', icon: <IconImage />, title: 'Upload media', sub: 'Images to storage' },
    { href: '/admin/seo', icon: <IconCheck />, title: 'SEO health', sub: 'Coverage audit' },
  ]

  return (
    <Shell active="dashboard" crumb={<>Overview <IconChevR /> Dashboard</>} title="Dashboard">
      <div className="page-head">
        <div className="ph-l"><h2>Dashboard</h2><p>Content overview · {venues} places · {posts} posts</p></div>
        <div className="ph-r">
          <Link className="btn btn--ghost btn--sm" href="/admin/blog/new"><IconPlus />New post</Link>
          <Link className="btn btn--primary btn--sm" href="/admin/places/new"><IconPlus />Add place</Link>
        </div>
      </div>

      <div className="kpi-grid">
        {kpis.map((k) => (
          <div className="kpi" key={k.label}>
            <div className="kpi-top"><div className={`kpi-ic ${k.ic}`}>{k.icon}</div></div>
            <div className="kpi-val">{k.val.toLocaleString()}</div>
            <div className="kpi-label">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="panel">
        <div className="panel-head"><div><h3>Quick actions</h3></div></div>
        <div className="panel-body">
          <div className="quick-grid">
            {quick.map((q) => (
              <Link className="quick" href={q.href} key={q.title}>
                <div className="q-ic">{q.icon}</div>
                <div><b>{q.title}</b><span>{q.sub}</span></div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <p className="foot-note">Pattaya Guide Admin · connected to Supabase · {postsPub} posts published.</p>
    </Shell>
  )
}
