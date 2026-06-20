import Shell from '@/app/admin/_components/Shell'
import BlogForm from '@/app/admin/_components/BlogForm'
import { IconChevR } from '@/app/admin/_components/icons'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function NewPost() {
  return (
    <Shell active="blog" crumb={<><Link href="/admin/blog">Blog &amp; Guides</Link> <IconChevR /> New</>} title="New post">
      <BlogForm />
    </Shell>
  )
}
