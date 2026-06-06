import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'

interface BlogPost {
  id: string
  slug: string
  title: string
  content_html: string
  styles_css: string | null
  is_published: boolean
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, slug, title, content_html, styles_css, is_published')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  if (error || !data) return null
  return data as BlogPost
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) return { title: 'Not Found' }
  return { title: post.title }
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
      {post.styles_css && (
        <style dangerouslySetInnerHTML={{ __html: post.styles_css }} />
      )}
      <div dangerouslySetInnerHTML={{ __html: post.content_html }} />
      <script dangerouslySetInnerHTML={{__html:`
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
