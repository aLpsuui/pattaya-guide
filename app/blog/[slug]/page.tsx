import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import BlogScript from '@/app/components/BlogScript'
import { SITE_URL } from '@/lib/site'
import { BLOG_TEMPLATE_SCRIPT } from './blogTemplate'
import './blog-template.css'

// ISR + pre-render all published posts at build so blog pages serve from the
// edge cache (HIT) rather than being dynamically rendered each request.
export const revalidate = 3600
export async function generateStaticParams() {
  const { data } = await supabase.from('blog_posts').select('slug').eq('is_published', true).limit(2000)
  return (data || []).map((p: { slug: string }) => ({ slug: p.slug }))
}

interface BlogPost {
  id: string
  slug: string
  title: string
  description: string
  author: string | null
  author_title: string | null
  category: string | null
  hero_image: string | null
  published_at: string | null
  updated_at_post: string | null
  page_html: string | null
  schema_jsonld: string | null
  is_published: boolean
}

// The blog HTML is authored against the old static-site paths. Rewrite its
// internal links to real Next routes and its image paths to the Supabase
// `blog` storage bucket at render time.
const IMG_BASE = 'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/blog'
const ROUTE_MAP: Record<string, string> = {
  '01-homepage-v5.html': '/',
  'blog.html': '/blog',
  'plan-my-trip.html': '/plan-my-trip',
  'pillar-areas.html': '/areas',
  'pillar-things-to-do.html': '/things-to-do',
  'pillar-wellness-beauty.html': '/wellness-and-beauty',
  'pillar-eat-drink.html': '/eat-and-drinks',
  'pillar-yoga-fitness.html': '/yoga-and-fitness',
}
function authorInitials(name: string): string {
  return name.split(/\s+/).filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}

// The page HTML bakes in a placeholder byline/bio author (Daniel Reyes, Olga
// Vavilova, …). Swap it for the post's real DB author so the detail page matches
// the author shown on the blog list/home cards.
function normalizeAuthor(html: string, author: string): string {
  const m = html.match(/<div class="who">\s*<b>([^<]+)<\/b>/)
  if (!m) return html
  const oldName = m[1].trim()
  const oldFirst = oldName.split(/\s+/)[0]
  const newFirst = author.split(/\s+/)[0]
  const initials = authorInitials(author)
  // full name in the byline and end bio heading
  let out = html.split(oldName).join(author)
  // first-name mentions, scoped to the end-bio paragraph only (avoids e.g. "Tom Yum")
  out = out.replace(
    /(<div class="bio[^"]*">[\s\S]*?<p>)([\s\S]*?)(<\/p>)/,
    (_full, pre: string, body: string, tail: string) =>
      pre + body.replace(new RegExp(`\\b${oldFirst}\\b`, 'g'), newFirst) + tail,
  )
  // avatar initials in the byline (.av) and bio (.ava)
  return out
    .replace(/(<div class="av">)[^<]*(<\/div>)/g, `$1${initials}$2`)
    .replace(/(<div class="ava">)[^<]*(<\/div>)/g, `$1${initials}$2`)
}

// The per-post schema_jsonld is authored with the hard-coded production domain
// (gotopattaya.com) and the placeholder author. Align it with the configured
// site domain (SITE_URL) and the post's real author so the structured data is
// consistent with canonicals/OG and matches the visible byline.
function rewriteSchema(schema: string, author?: string | null): string {
  let out = schema.split('https://gotopattaya.com').join(SITE_URL)
  if (author) {
    out = out.replace(/("author":\s*\{[^}]*?"name":\s*")[^"]+(")/g, `$1${author}$2`)
  }
  return out
}

function rewriteHtml(html: string, author?: string | null): string {
  // All authored image folders map flat into the Supabase `blog` bucket.
  let out = html
    .replace(/\.\.\/yeni-blog-gorselleri\//g, IMG_BASE + '/')
    .replace(/\.\.\/Pattaya-Tum-Gorseller-Resized\//g, IMG_BASE + '/')
    .replace(/\.\.\/pattaya-fotograflar\//g, IMG_BASE + '/')
  if (author) out = normalizeAuthor(out, author)
  out = out.replace(/href="([^"]+\.html)"/g, (_m, file: string) => {
    if (ROUTE_MAP[file]) return `href="${ROUTE_MAP[file]}"`
    const blog = file.match(/^blog-(.+)\.html$/)
    if (blog) return `href="/blog/${blog[1]}"`
    return `href="/${file.replace(/\.html$/, '')}"`
  })
  return out
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const { data } = await supabase
    .from('blog_posts')
    .select('id, slug, title, description, author, author_title, category, hero_image, published_at, updated_at_post, page_html, schema_jsonld, is_published')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  return (data as BlogPost) || null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) return { title: 'Not Found', robots: { index: false } }
  const canonical = `/blog/${post.slug}`
  return {
    title: `${post.title} | Go To Pattaya`,
    description: post.description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: `${SITE_URL}${canonical}`,
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at_post || post.published_at || undefined,
      authors: post.author ? [post.author] : undefined,
      images: post.hero_image ? [{ url: post.hero_image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.hero_image ? [post.hero_image] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: post.title,
        description: post.description,
        image: post.hero_image ? [post.hero_image] : undefined,
        datePublished: post.published_at || undefined,
        dateModified: post.updated_at_post || post.published_at || undefined,
        author: post.author
          ? { '@type': 'Person', name: post.author, jobTitle: post.author_title || undefined }
          : undefined,
        publisher: { '@id': `${SITE_URL}/#organization` },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
        articleSection: post.category || undefined,
        inLanguage: 'en',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: post.schema_jsonld ? rewriteSchema(post.schema_jsonld, post.author) : JSON.stringify(jsonLd),
        }}
      />
      {post.page_html && <div dangerouslySetInnerHTML={{ __html: rewriteHtml(post.page_html, post.author) }} />}
      <BlogScript script={BLOG_TEMPLATE_SCRIPT} />
    </>
  )
}
