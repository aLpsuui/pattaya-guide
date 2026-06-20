import { db } from '@/lib/admin/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Shell from '@/app/admin/_components/Shell'
import PlaceForm, { type Category, type Place } from '@/app/admin/_components/PlaceForm'
import { IconChevR } from '@/app/admin/_components/icons'

export const dynamic = 'force-dynamic'

export default async function EditPlace({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [{ data: place }, { data: cats }] = await Promise.all([
    db.from('venues').select('id,name,slug,category_id,neighborhood,tagline,address,price_range,image_url,seo_title,description,focus_keyword,canonical_url,noindex,status,is_active').eq('id', id).single(),
    db.from('categories').select('id,name_en').order('name_en'),
  ])
  if (!place) notFound()

  return (
    <Shell active="places" crumb={<><Link href="/admin/places">Places</Link> <IconChevR /> Edit</>} title="Edit place">
      <PlaceForm categories={(cats || []) as Category[]} place={place as Place} />
    </Shell>
  )
}
