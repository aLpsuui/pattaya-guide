import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface BlogPost {
  id: string
  slug: string
  title: string
  description: string
  author: string
  published_at: string
  category: string
  hero_image: string
  read_time: number
}

async function getBlogPosts(): Promise<BlogPost[]> {
  const { data } = await supabase
    .from('blog_posts')
    .select('id, slug, title, description, author, published_at, category, hero_image, read_time')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
  return (data || []) as BlogPost[]
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div style={{padding:'var(--s8) 0 var(--s9)'}}>
      <div className="container">
        <div style={{marginBottom:'var(--s7)'}}>
          <div className="kicker">Travel Blog</div>
          <h1 style={{fontSize:'clamp(32px,4vw,48px)',marginBottom:'var(--s3)'}}>Pattaya guides &amp; travel tips</h1>
          <p style={{fontSize:17,color:'var(--ink-500)',maxWidth:'58ch'}}>In-depth guides written by people who live in Pattaya. Updated regularly.</p>
        </div>

        <div className="blog-grid">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="post">
              <div
                className="ph"
                style={{
                  backgroundImage: post.hero_image ? `url(${post.hero_image})` : undefined,
                  background: post.hero_image ? undefined : 'var(--grad-brand)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <span className="pill pill-white">{post.category}</span>
              </div>
              <div className="pb">
                <div className="pmeta">
                  <span>{new Date(post.published_at).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})}</span>
                  <i></i>
                  <span>{post.read_time} min read</span>
                </div>
                <h3>{post.title}</h3>
                <p className="excerpt">{post.description}</p>
                <div className="author">
                  <div className="av" style={{width:32,height:32,borderRadius:'50%',background:'var(--grad-cta)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--display)',fontWeight:700,fontSize:13,flexShrink:0}}>
                    {post.author?.split(' ').map((n:string) => n[0]).join('')}
                  </div>
                  <div>
                    <b style={{fontFamily:'var(--display)',fontSize:13,color:'var(--ink-700)',display:'block'}}>{post.author}</b>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
