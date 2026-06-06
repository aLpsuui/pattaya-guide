import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'

interface BlogPost {
  id: string
  slug: string
  title: string
  description: string
  author: string
  author_title: string
  published_at: string
  category: string
  hero_image: string
  read_time: number
  content_html: string
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  if (error || !data) return null
  return data as BlogPost
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) notFound()

  return (
    <>
      <style>{`
        :root{
          --read-max:760px;
        }
        .progress-bar{position:fixed;top:0;left:0;height:3px;background:var(--grad-cta);z-index:200;transition:width .1s linear}
        .blog-content{max-width:var(--read-max);margin:0 auto}
        .blog-content h2{font-family:var(--display);font-size:clamp(24px,2.6vw,32px);line-height:1.15;margin:var(--s8) 0 var(--s4);font-weight:800;color:var(--ink-900)}
        .blog-content h3{font-family:var(--display);font-size:22px;line-height:1.3;margin:var(--s5) 0 var(--s3);font-weight:700;color:var(--ink-900)}
        .blog-content h4{font-family:var(--display);font-size:17px;font-weight:700;margin-bottom:8px;color:var(--ink-900)}
        .blog-content p{font-size:17px;line-height:1.75;color:var(--ink-700);margin-bottom:var(--s4)}
        .blog-content ul,.blog-content ol{padding-left:var(--s5);margin-bottom:var(--s4)}
        .blog-content li{font-size:17px;line-height:1.7;color:var(--ink-700);margin-bottom:6px}
        .blog-content a{color:var(--ocean);text-decoration:underline;text-underline-offset:3px}
        .blog-content img{border-radius:var(--r-lg);margin:var(--s6) 0}
        .blog-content table{width:100%;border-collapse:collapse;margin:var(--s6) 0;font-size:15px}
        .blog-content th{background:var(--blue-50);color:var(--steel);font-family:var(--display);font-weight:700;padding:10px 14px;text-align:left;border-bottom:2px solid var(--line)}
        .blog-content td{padding:10px 14px;border-bottom:1px solid var(--line);color:var(--ink-700)}
        .blog-content tr:hover td{background:var(--paper)}
        .blog-content blockquote{border-left:3px solid var(--lagoon);padding:var(--s4) var(--s5);background:var(--blue-50);border-radius:0 var(--r-md) var(--r-md) 0;margin:var(--s5) 0;font-size:17px;color:var(--ink-700)}
        .art-wrap{padding:var(--s8) 0 var(--s9)}
        .art-container{max-width:var(--container);margin:0 auto;padding:0 var(--s5);display:grid;grid-template-columns:1fr 280px;gap:var(--s7);align-items:start}
        @media(max-width:1080px){.art-container{grid-template-columns:1fr}}
        .art-sidebar{position:sticky;top:100px}
        .toc{background:var(--paper);border:1px solid var(--line);border-radius:var(--r-lg);padding:var(--s5)}
        .toc h4{font-family:var(--display);font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--ink-500);margin-bottom:var(--s3)}
        .toc ol{list-style:none;padding:0;counter-reset:toc}
        .toc li{counter-increment:toc;margin-bottom:8px;display:flex;align-items:flex-start;gap:8px;font-size:13px}
        .toc li::before{content:counter(toc);width:18px;height:18px;border-radius:50%;background:var(--blue-50);color:var(--ocean);font-family:var(--display);font-weight:700;font-size:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px}
        .toc a{color:var(--ink-700);transition:.18s}
        .toc a:hover{color:var(--ocean)}
        .art-head{max-width:var(--container);margin:0 auto;padding:var(--s7) var(--s5) 0}
        .breadcrumb{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--ink-400);margin-bottom:var(--s5);font-family:var(--display);font-weight:500;flex-wrap:wrap}
        .breadcrumb a{color:var(--ink-500);transition:.18s}
        .breadcrumb a:hover{color:var(--ocean)}
        .breadcrumb .sep{color:var(--ink-400)}
        .art-kicker{display:flex;align-items:center;gap:var(--s3);flex-wrap:wrap;margin-bottom:var(--s4)}
        .art-hero{position:relative;height:480px;border-radius:var(--r-xl);overflow:hidden;margin-top:var(--s6)}
        .art-hero img{width:100%;height:100%;object-fit:cover}
        .art-hero-overlay{position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(2,46,92,.7) 100%)}
        .author-row{display:flex;align-items:center;gap:var(--s4);margin-top:var(--s5);padding-top:var(--s5);border-top:1px solid var(--line)}
        .av{width:44px;height:44px;border-radius:50%;background:var(--grad-cta);display:flex;align-items:center;justify-content:center;color:#fff;font-family:var(--display);font-weight:700;font-size:15px;flex-shrink:0}
        .av-info b{font-family:var(--display);font-size:14px;color:var(--ink-900);display:block}
        .av-info span{font-size:13px;color:var(--ink-400)}
        .tldr{background:var(--blue-50);border:1px solid var(--blue-100);border-radius:var(--r-lg);padding:var(--s5) var(--s6);margin:var(--s6) 0}
        .tldr h3{font-size:16px;text-transform:uppercase;letter-spacing:.1em;color:var(--ocean);margin:0 0 var(--s3)}
        .tldr ul{padding-left:var(--s4)}
        .tldr li{font-size:15px;color:var(--ink-700);margin-bottom:6px}
        .pill{display:inline-flex;align-items:center;gap:6px;padding:5px 13px;border-radius:999px;font-size:13px;font-weight:600;font-family:var(--display)}
        .pill-blue{background:var(--blue-50);color:var(--ocean)}
        .pill-sun{background:#fdf3d9;color:#9a6e10}
        .pill-success{background:#e4f6ee;color:#1ba672}
        .pill-warn{background:#fcf2e0;color:#9a6e10}
        .pill-danger{background:#fce5e3;color:#e0524d}
        .pros-cons{display:grid;grid-template-columns:1fr 1fr;gap:var(--s4);margin:var(--s6) 0}
        @media(max-width:640px){.pros-cons{grid-template-columns:1fr}}
        .pros-box,.cons-box{padding:var(--s5);border-radius:var(--r-lg);border:1px solid}
        .pros-box{background:#f0faf4;border-color:#b8e8cc}
        .cons-box{background:#fdf0ef;border-color:#f5c4c2}
        .pros-box h4{color:#1ba672}.cons-box h4{color:#e0524d}
        .month-block{border:1px solid var(--line);border-radius:var(--r-lg);overflow:hidden;margin:var(--s5) 0}
        .month-head{background:var(--blue-50);padding:var(--s4) var(--s5);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px}
        .month-head h3{margin:0;font-size:19px}
        .month-body{padding:var(--s5)}
        .month-body p{margin-bottom:var(--s3)}
        .month-row{display:flex;gap:var(--s5);flex-wrap:wrap;margin-top:var(--s4)}
        .month-col{flex:1;min-width:200px}
        .month-col h4{font-size:13px;text-transform:uppercase;letter-spacing:.08em;color:var(--ink-400);margin-bottom:var(--s2)}
        .month-col ul{list-style:none;padding:0}
        .month-col li{font-size:14px;color:var(--ink-700);padding:5px 0;border-bottom:1px dashed var(--line);display:flex;align-items:center;gap:6px}
        .faq-item{border:1px solid var(--line);border-radius:var(--r-md);margin-bottom:10px;overflow:hidden}
        .faq-q{padding:var(--s4) var(--s5);font-family:var(--display);font-weight:600;font-size:16px;color:var(--ink-900);cursor:pointer;display:flex;justify-content:space-between;align-items:center}
        .faq-a{padding:0 var(--s5) var(--s4);font-size:15px;color:var(--ink-700);line-height:1.65}
        .cta-box{background:var(--grad-cta);color:#fff;border-radius:var(--r-xl);padding:var(--s7);text-align:center;margin:var(--s8) 0}
        .cta-box h2{color:#fff;font-size:28px;margin:0 0 var(--s3)}
        .cta-box p{color:rgba(255,255,255,.85);margin-bottom:var(--s5)}
        .related-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--s4);margin-top:var(--s5)}
        @media(max-width:860px){.related-grid{grid-template-columns:1fr}}
        .related-card{background:#fff;border:1px solid var(--line);border-radius:var(--r-lg);overflow:hidden;transition:.2s}
        .related-card:hover{transform:translateY(-3px);box-shadow:var(--sh-lg)}
        .related-card .rph{height:160px;background:var(--grad-brand);background-size:cover;background-position:center}
        .related-card .rpb{padding:var(--s4)}
        .related-card h4{font-family:var(--display);font-size:16px;font-weight:700;color:var(--ink-900);margin-bottom:6px;line-height:1.3}
        .related-card p{font-size:13px;color:var(--ink-500)}
      `}</style>

      <div className="progress-bar" id="progress"></div>

      {/* Article Head */}
      <div className="art-head">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span className="sep">›</span>
          <a href="/blog">Blog</a>
          <span className="sep">›</span>
          <span>{post.title}</span>
        </nav>

        <div className="art-kicker">
          <span className="pill pill-blue">{post.category}</span>
          <span style={{fontSize:13,color:'var(--ink-400)'}}>
            {new Date(post.published_at).toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'})}
          </span>
          <span style={{fontSize:13,color:'var(--ink-400)'}}>· {post.read_time} min read</span>
        </div>

        <h1>{post.title}</h1>
        <p style={{fontSize:19,color:'var(--ink-500)',marginTop:'var(--s4)',maxWidth:'68ch',lineHeight:1.6}}>{post.description}</p>

        <div className="author-row">
          <div className="av">{post.author?.split(' ').map((n:string) => n[0]).join('')}</div>
          <div className="av-info">
            <b>{post.author}</b>
            <span>{post.author_title}</span>
          </div>
        </div>

        {post.hero_image && (
          <div className="art-hero">
            <img src={post.hero_image} alt={post.title} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
            <div className="art-hero-overlay"></div>
          </div>
        )}
      </div>

      {/* Article Content */}
      <div className="art-wrap">
        <div className="art-container">
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content_html }}
          />
        </div>
      </div>

      <script dangerouslySetInnerHTML={{__html:`
        // Progress bar
        const bar = document.getElementById('progress');
        if (bar) {
          window.addEventListener('scroll', () => {
            const h = document.documentElement;
            const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
            bar.style.width = pct + '%';
          }, {passive:true});
        }
      `}}/>
    </>
  )
}
