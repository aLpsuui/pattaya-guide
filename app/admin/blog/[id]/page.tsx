import { db } from '@/lib/admin/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Shell from '@/app/admin/_components/Shell'
import BlogForm, { type Post } from '@/app/admin/_components/BlogForm'
import { IconChevR } from '@/app/admin/_components/icons'

export const dynamic = 'force-dynamic'

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data } = await db
    .from('blog_posts')
    .select('id,title,slug,description,page_html,hero_image,category,author,tags,seo_title,meta_description,focus_keyword,noindex,status,is_published')
    .eq('id', id)
    .single()
  if (!data) notFound()

  return (
    <Shell active="blog" crumb={<><Link href="/admin/blog">Blog &amp; Guides</Link> <IconChevR /> Edit</>} title="Edit post">
      <BlogForm post={data as Post} />
    </Shell>
  )
}
