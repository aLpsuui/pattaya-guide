import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface BlogPost {
  id: string
  slug: string
  title: string
  description: string
  author: string
  category: string
  hero_image: string
  read_time: number
  published_at: string
}

function getInitials(name: string) {
  return name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'PG'
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function categoryToFilter(category: string): string {
  const map: Record<string, string> = {
    'Eat & Drink': 'eat',
    'Eat & Drinks': 'eat',
    'Things to Do': 'things',
    'Wellness': 'wellness',
    'Wellness & Beauty': 'wellness',
    'Nightlife': 'nightlife',
    'Areas': 'areas',
    'Areas & Neighbourhoods': 'areas',
    'Travel Tips': 'travel',
  }
  return map[category] || 'travel'
}

async function getBlogPosts(): Promise<BlogPost[]> {
  const { data } = await supabase
    .from('blog_posts')
    .select('id, slug, title, description, author, category, hero_image, read_time, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
  return (data as BlogPost[]) || []
}

export const metadata = {
  title: 'Pattaya Blog — Honest Guides, Tips & Local Stories | Go To Pattaya',
  description: 'In-depth Pattaya guides written by locals: the best restaurants, things to do, wellness, nightlife, districts and practical travel tips.',
}

export default async function BlogPage() {
  const posts = await getBlogPosts()
  const [featured, ...rest] = posts

  return (
    <main id="main">
      {/* PAGE HERO */}
      <section className="page-hero">
        <div className="container inner">
          <nav className="crumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>
            <span className="cur">Blog</span>
          </nav>
          <div className="kicker" style={{marginTop:'var(--s3)'}}>The blog</div>
          <h1>Honest Pattaya guides &amp; stories</h1>
          <p className="lead">Written and re-checked by editors who live here. No sponsored rankings, no recycled travel-blog fluff — just the real Pattaya, explained.</p>
        </div>
      </section>

      {/* FILTER RAIL */}
      <div className="filter-rail">
        <div className="container">
          <div className="filterbar" role="group" aria-label="Filter by topic" data-filterbar="postGrid">
            <button className="chip active" data-filter="all" aria-pressed="true">All</button>
            <button className="chip" data-filter="eat" aria-pressed="false">Eat &amp; Drink</button>
            <button className="chip" data-filter="things" aria-pressed="false">Things to Do</button>
            <button className="chip" data-filter="wellness" aria-pressed="false">Wellness</button>
            <button className="chip" data-filter="nightlife" aria-pressed="false">Nightlife</button>
            <button className="chip" data-filter="areas" aria-pressed="false">Areas</button>
            <button className="chip" data-filter="travel" aria-pressed="false">Travel Tips</button>
          </div>
        </div>
      </div>

      {/* POST GRID */}
      <section className="section-sm">
        <div className="container">
          <div className="cards" id="postGrid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))'}}>

            {/* FEATURED — first post */}
            {featured && (
              <article className="post post--feature" data-tags={categoryToFilter(featured.category)}>
                <Link
                  href={`/blog/${featured.slug}`}
                  className="ph"
                  style={{backgroundImage:`url('${featured.hero_image}')`}}
                  aria-label={featured.title}
                >
                  <span className="k badge-live"><span className="dot"></span>Editor's pick</span>
                </Link>
                <div className="pb">
                  <span className="pill pill--blue" style={{alignSelf:'flex-start'}}>{featured.category}</span>
                  <h2><Link href={`/blog/${featured.slug}`}>{featured.title}</Link></h2>
                  <p>{featured.description}</p>
                  <div className="by">
                    <span className="av">{getInitials(featured.author)}</span>
                    <span>{featured.author}</span>
                    <span className="dot"></span>
                    <span>{featured.read_time} min read</span>
                    <span className="dot"></span>
                    <span>Updated {formatDate(featured.published_at)}</span>
                  </div>
                </div>
              </article>
            )}

            {/* REST OF POSTS */}
            {rest.map(post => (
              <article key={post.id} className="post" data-tags={categoryToFilter(post.category)}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="ph"
                  style={{backgroundImage:`url('${post.hero_image}')`}}
                  aria-label={post.title}
                >
                  <span className="k pill pill--blue">{post.category}</span>
                </Link>
                <div className="pb">
                  <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
                  <p>{post.description}</p>
                  <div className="by">
                    <span className="av">{getInitials(post.author)}</span>
                    <span>{post.author}</span>
                    <span className="dot"></span>
                    <span>{post.read_time} min read</span>
                    <span className="dot"></span>
                    <span>Updated {formatDate(post.published_at)}</span>
                  </div>
                </div>
              </article>
            ))}

          </div>

          {/* EMPTY STATE */}
          <div className="empty" data-filter-empty style={{display:'none'}}>
            <div className="eic">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"/></svg>
            </div>
            <h3>No articles in this topic yet</h3>
            <p>We're writing more every week. Try another topic or subscribe below.</p>
          </div>

        </div>
      </section>
    </main>
  )
}
