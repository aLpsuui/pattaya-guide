import CategoryListing, { type CatConfig } from '@/app/components/CategoryListing'

export const revalidate = 600

export const metadata = {
  title: 'Pattaya Nightlife — Clubs, Bars & Go-Go Bars | Go To Pattaya',
  description:
    "An honest, locally verified guide to Pattaya nightlife — the big EDM clubs, Walking Street bars, go-go bars, lounges and night markets. Music, hours, entry and directions for every venue.",
  alternates: { canonical: '/nightlife' },
}

const cfg: CatConfig = {
  slug: 'nightlife',
  kicker: 'Nightlife · Pattaya',
  h1: 'Where Pattaya comes alive after dark',
  em: 'comes alive',
  lead: 'From the world-ranked mega-clubs to legendary Walking Street discos, go-go bars and late-night markets — a locally verified guide to every kind of night out.',
  heroImg: 'pattaya-night-clubs-1.jpg',
  heroImg2: 'pattaya-night-clubs-2.webp',
  badge: 'Locally verified · weekly',
  searchPlaceholder: 'Search clubs, bars, go-go, music…',
  unit: 'venues',
}

export default function NightlifePage() {
  return <CategoryListing cfg={cfg} />
}
