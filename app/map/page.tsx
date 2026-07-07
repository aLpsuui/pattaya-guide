import ExploreMap from '@/app/components/ExploreMap'

const title = 'Pattaya Map - Every venue & area on one map | Go To Pattaya'
const description = 'Explore Pattaya on an interactive map: spas, venues and districts. Filter by areas or places and open any spot.'
export const metadata = {
  title,
  description,
  alternates: { canonical: '/map' },
  openGraph: { title, description },
}

export default function MapPage() {
  return (
    <main id="main" className="exmap-page">
      <div className="exmap-page-head">
        <span className="kicker">Interactive map</span>
        <h1>Explore Pattaya on the map</h1>
        <p>Every venue and area across the city - filter by places or districts and tap any pin to open it.</p>
      </div>
      <ExploreMap />
    </main>
  )
}
