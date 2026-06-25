import CategoryListing, { type CatConfig } from '@/app/components/CategoryListing'

export const revalidate = 600

export const metadata = {
  title: 'Things to Do in Pattaya — Tours, Islands, Diving & Adventures | Go To Pattaya',
  description:
    'A locally verified guide to the best things to do in Pattaya — island tours and boat trips, diving and snorkelling, ATV and adrenaline activities, plus bike, car and jet-ski rentals.',
  alternates: { canonical: '/things-to-do' },
}

// Note: the DB category slug is the legacy "thinks-to-do" (the public URL is /things-to-do).
const cfg: CatConfig = {
  slug: 'thinks-to-do',
  kicker: 'Things to Do · Pattaya',
  h1: 'Your Pattaya adventure starts here',
  em: 'adventure',
  lead: 'Island day-trips and boat tours, scuba and snorkelling, jungle ATV runs and skydives, plus bikes, cars and jet skis to rent — real, locally checked operators in one place.',
  heroImg: 'pattaya-best-tours.webp',
  heroImg2: 'best-island-pattaya.webp',
  badge: 'Locally verified operators',
  searchPlaceholder: 'Search tours, diving, ATV, rentals…',
  unit: 'activities',
}

export default function ThingsToDoPage() {
  return <CategoryListing cfg={cfg} />
}
