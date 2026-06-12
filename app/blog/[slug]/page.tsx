import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import BlogScript from '@/app/components/BlogScript'

interface BlogPost {
  id: string
  slug: string
  title: string
  description: string
  page_html: string | null
  styles_css: string | null
  blog_script: string | null
  is_published: boolean
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const { data } = await supabase
    .from('blog_posts')
    .select('id, slug, title, description, page_html, styles_css, blog_script, is_published')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  return data as BlogPost || null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) return { title: 'Not Found' }
  return { title: `${post.title} | Go To Pattaya`, description: post.description }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) notFound()

  return (
    <>
      {post.styles_css && <style dangerouslySetInnerHTML={{ __html: post.styles_css }} />}
      {post.page_html && <div dangerouslySetInnerHTML={{ __html: post.page_html }} />}
      {post.blog_script && <BlogScript script={post.blog_script} />}
    </>
  )
}
