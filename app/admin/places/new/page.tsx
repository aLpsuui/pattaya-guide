import { db } from '@/lib/admin/db'
import Link from 'next/link'
import Shell from '@/app/admin/_components/Shell'
import PlaceForm, { type Category } from '@/app/admin/_components/PlaceForm'
import { IconChevR } from '@/app/admin/_components/icons'

export const dynamic = 'force-dynamic'

export default async function NewPlace() {
  const { data } = await db.from('categories').select('id,name_en').order('name_en')
  return (
    <Shell active="places" crumb={<><Link href="/admin/places">Places</Link> <IconChevR /> Add</>} title="Add place">
      <PlaceForm categories={(data || []) as Category[]} />
    </Shell>
  )
}
