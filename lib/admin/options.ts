export const ADMIN_BASE = '/admin'

export const AREAS = [
  'Central Pattaya', 'Jomtien', 'Pratumnak Hill', 'Naklua', 'Wong Amat', 'Bang Saray',
]

export const PRICE_RANGES = [
  { value: '฿', label: '฿ — Budget' },
  { value: '฿฿', label: '฿฿ — Mid-range' },
  { value: '฿฿฿', label: '฿฿฿ — Premium' },
]

export const STATUSES = ['draft', 'pending', 'published'] as const
export type Status = (typeof STATUSES)[number]

export const BLOG_PILLARS = [
  'Wellness & Beauty', 'Eat & Drinks', 'Things to Do', 'Areas & Neighbourhoods', 'Yoga & Fitness', 'Plan Your Trip',
]

export const BLOG_AUTHORS = [
  'Pattaya Guide Editorial', 'Olcay Dikici', 'Daniel Reyes', 'Olga Vavilova', 'Naree Suwan', 'Tom Whitfield',
]

export const statusPill: Record<string, string> = {
  published: 'pill--pub', pending: 'pill--pend', draft: 'pill--draft',
}

export function slugify(s: string): string {
  return (s || '').trim().toLowerCase().replace(/&/g, 'and').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}
