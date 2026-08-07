import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import BlogScript from '@/app/components/BlogScript'
import { SITE_URL } from '@/lib/site'
import { hasLocale } from '@/lib/i18n/config'
import { getTranslated } from '@/lib/i18n/translateContent'
import { localeAlternates, clampDescription, pageTitle } from '@/lib/seo'
import { BLOG_TEMPLATE_SCRIPT } from './blogTemplate'
import './blog-template.css'

// ISR + pre-render all published posts at build so blog pages serve from the
// edge cache (HIT) rather than being dynamically rendered each request.
// Only English is pre-rendered at build; Russian pages generate on-demand on
// first visit (they translate + cache DB content, which we don't want to run
// for every post at build time).
export const revalidate = 3600
export async function generateStaticParams() {
  const { data } = await supabase.from('blog_posts').select('slug').eq('is_published', true).limit(2000)
  return (data || []).map((p: { slug: string }) => ({ lang: 'en', slug: p.slug }))
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
const IMG_BASE = 'https://cdn.gotopattaya.com/Blogs'
const ROUTE_MAP: Record<string, string> = {
  '01-homepage-v5.html': '/',
  'blog.html': '/blog',
  'plan-my-trip.html': '/plan-my-trip',
  'pillar-areas.html': '/areas',
  'pillar-things-to-do.html': '/things-to-do',
  'pillar-wellness-beauty.html': '/wellness-and-beauty',
  'pillar-eat-drink.html': '/eat-and-drinks',
  // Some posts were authored with the plural file name - same pillar page.
  'pillar-eat-drinks.html': '/eat-and-drinks',
  'pillar-yoga-fitness.html': '/yoga-and-fitness',
  // Authored venue detail pages map to their live /venues/ slug.
  'detail-eat-nitan-coffee.html': '/venues/nitan-coffee-s-tale-pattaya',
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

// Posts sometimes link to planned-but-not-yet-published articles (the authored
// HTML ships the whole content plan's cross-links). A link to a post that is
// not live is a 404 for users and crawlers, so unwrap it - keep the anchor
// text, drop the <a>. Because pages re-render through ISR, the link comes back
// by itself the moment the target post is published.
function unwrapDeadBlogLinks(html: string, publishedSlugs: Set<string>): string {
  return html.replace(
    /<a\b[^>]*href="\/blog\/([^"/?#]+)"[^>]*>([\s\S]*?)<\/a>/g,
    (full, slug: string, inner: string) => (publishedSlugs.has(slug) ? full : inner),
  )
}

function rewriteHtml(html: string, author?: string | null, publishedSlugs?: Set<string>): string {
  // All authored image folders map flat into the Supabase `blog` bucket.
  let out = html
    .replace(/\.\.\/yeni-blog-gorselleri\//g, IMG_BASE + '/')
    .replace(/\.\.\/Pattaya-Tum-Gorseller-Resized\//g, IMG_BASE + '/')
    .replace(/\.\.\/pattaya-fotograflar\//g, IMG_BASE + '/')
  // Every blog body image is served as .webp on the CDN. Map any authored
  // .png/.jpg/.jpeg under the Blogs/ folder to its .webp twin so the post
  // always requests the format that's actually uploaded.
  out = out.replace(/(https:\/\/cdn\.gotopattaya\.com\/Blogs\/[^"]+?)\.(?:png|jpe?g)(?=")/gi, '$1.webp')
  if (author) out = normalizeAuthor(out, author)
  out = out.replace(/href="([^"]+\.html)"/g, (_m, file: string) => {
    if (ROUTE_MAP[file]) return `href="${ROUTE_MAP[file]}"`
    const blog = file.match(/^blog-(.+)\.html$/)
    if (blog) return `href="/blog/${blog[1]}"`
    return `href="/${file.replace(/\.html$/, '')}"`
  })
  if (publishedSlugs) out = unwrapDeadBlogLinks(out, publishedSlugs)
  return out
}

// Published slugs power the dead-link unwrap above; one tiny cached query
// shared by every post render (invalidated with the same 'blog' tag as posts).
async function getPublishedSlugs(): Promise<Set<string>> {
  const { data } = await supabase.from('blog_posts').select('slug').eq('is_published', true).limit(2000)
  return new Set((data || []).map((p: { slug: string }) => p.slug))
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

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  const post = await getBlogPost(slug)
  if (!post) return { title: 'Not Found', robots: { index: false } }
  const locale = hasLocale(lang) ? lang : 'en'
  const [title, description] = await Promise.all([
    getTranslated('blog_posts', post.id, 'title', post.title, locale),
    getTranslated('blog_posts', post.id, 'description', post.description, locale),
  ])
  const canonical = `/${locale}/blog/${post.slug}`
  return {
    title: pageTitle(title),
    description: clampDescription(description),
    alternates: localeAlternates(locale, `/blog/${post.slug}`),
    openGraph: {
      type: 'article',
      title,
      description,
      url: `${SITE_URL}${canonical}`,
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at_post || post.published_at || undefined,
      authors: post.author ? [post.author] : undefined,
      images: post.hero_image ? [{ url: post.hero_image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.hero_image ? [post.hero_image] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params
  const post = await getBlogPost(slug)
  if (!post) notFound()
  const publishedSlugs = await getPublishedSlugs()
  const locale = hasLocale(lang) ? lang : 'en'
  const [title, description, pageHtml] = await Promise.all([
    getTranslated('blog_posts', post.id, 'title', post.title, locale),
    getTranslated('blog_posts', post.id, 'description', post.description, locale),
    getTranslated('blog_posts', post.id, 'page_html', post.page_html, locale),
  ])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: title,
        description,
        image: post.hero_image ? [post.hero_image] : undefined,
        datePublished: post.published_at || undefined,
        dateModified: post.updated_at_post || post.published_at || undefined,
        author: post.author
          ? { '@type': 'Person', name: post.author, jobTitle: post.author_title?.split('·')[0].trim() || undefined }
          : undefined,
        publisher: { '@id': `${SITE_URL}/#organization` },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/${locale}/blog/${post.slug}` },
        articleSection: post.category || undefined,
        inLanguage: locale,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/${locale}` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/${locale}/blog` },
          { '@type': 'ListItem', position: 3, name: title, item: `${SITE_URL}/${locale}/blog/${post.slug}` },
        ],
      },
    ],
  }

  // Always emit Article + BreadcrumbList. The authored schema_jsonld only carried
  // the site-wide WebSite/Organization/City nodes (already emitted globally in the
  // root layout), so we drop those but keep any FAQPage it defined.
  const graph: unknown[] = [...jsonLd['@graph']]
  if (post.schema_jsonld) {
    try {
      const stored = JSON.parse(rewriteSchema(post.schema_jsonld, post.author))
      const nodes = Array.isArray(stored) ? stored : (stored['@graph'] || [stored])
      for (const n of nodes) if (n && n['@type'] === 'FAQPage') graph.push(n)
    } catch { /* ignore malformed stored schema */ }
  }
  const finalJsonLd = { '@context': 'https://schema.org', '@graph': graph }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(finalJsonLd) }}
      />
      {pageHtml && <div dangerouslySetInnerHTML={{ __html: rewriteHtml(pageHtml, post.author, publishedSlugs) }} />}
      <BlogScript script={BLOG_TEMPLATE_SCRIPT} />
    </>
  )
}
