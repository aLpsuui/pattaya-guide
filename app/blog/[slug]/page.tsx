import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import BlogScript from '@/app/components/BlogScript'
import { SITE_URL, SITE_NAME } from '@/lib/site'

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
  styles_css: string | null
  blog_script: string | null
  is_published: boolean
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const { data } = await supabase
    .from('blog_posts')
    .select('id, slug, title, description, author, author_title, category, hero_image, published_at, updated_at_post, page_html, styles_css, blog_script, is_published')
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {post.styles_css && <style dangerouslySetInnerHTML={{ __html: post.styles_css }} />}
      {post.page_html && <div dangerouslySetInnerHTML={{ __html: post.page_html }} />}
      {post.blog_script && <BlogScript script={post.blog_script} />}
    </>
  )
}
