import CategoryListing, { type CatConfig } from '@/app/components/CategoryListing'

export const revalidate = 600

const title = 'Gyms, Muay Thai & Yoga in Pattaya | Go To Pattaya'
const description =
  'A locally verified guide to training in Pattaya - Muay Thai camps, gyms, CrossFit, yoga and pilates studios, with prices, hours and directions.'
export const metadata = {
  title,
  description,
  alternates: { canonical: '/yoga-and-fitness' },
  openGraph: { title, description },
}

const cfg: CatConfig = {
  slug: 'yoga-and-fitness',
  kicker: 'Gym, Muay Thai & Yoga · Pattaya',
  h1: 'Train hard, recover well in Pattaya',
  em: 'Train hard',
  lead: "From world-famous Muay Thai camps to 24-hour fitness gyms, yoga and pilates studios and climbing walls - find where to train, with real prices and the city's highest-rated coaches.",
  heroImg: 'pattaya-muay-thai-1.webp',
  heroImg2: 'pattaya-yoga-1.webp',
  badge: 'Locally verified · weekly',
  searchPlaceholder: 'Search gyms, Muay Thai, yoga…',
  unit: 'venues',
}

export default function YogaFitnessPage() {
  return <CategoryListing cfg={cfg} />
}
