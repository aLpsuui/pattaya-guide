import CategoryListing, { type CatConfig } from '@/app/components/CategoryListing'

export const revalidate = 600

export const metadata = {
  title: 'Spa, Massage & Wellness in Pattaya | Go To Pattaya',
  description:
    'A locally verified guide to wellness in Pattaya — Thai and oil massage, day spas, luxury spa resorts, beauty and nail salons. Real prices, hours and directions for every venue.',
  alternates: { canonical: '/wellness-and-beauty' },
}

const cfg: CatConfig = {
  slug: 'wellness-and-beauty',
  kicker: 'Wellness & Beauty · Pattaya',
  h1: 'Relax, restore and be pampered',
  em: 'restore',
  lead: 'From honest neighbourhood Thai-massage shops to luxury spa resorts and beauty salons — a locally verified guide to where Pattaya unwinds, with real prices and hours.',
  heroImg: 'pattaya-wellness-1.webp',
  heroImg2: 'best-restaurants-pattaya.webp',
  badge: 'Locally verified · weekly',
  searchPlaceholder: 'Search spa, massage, beauty…',
  unit: 'venues',
}

export default function WellnessPage() {
  return <CategoryListing cfg={cfg} />
}
