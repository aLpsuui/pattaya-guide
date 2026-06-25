import '../areas.css'
import './area-detail.css'
import './area-guide.css'
import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Icon from '@/app/components/Icon'
import { AREAS, areaBySlug } from '@/lib/areas'
import { SITE_URL } from '@/lib/site'
import BlogScript from '@/app/components/BlogScript'
import guidesData from './area-guides.json'

export const revalidate = 300

// FAQ accordions + in-page smooth scroll for the bespoke .det-area guides
// (the source page's inline script lived outside <main>, so it was dropped).
const AREA_GUIDE_SCRIPT = String.raw`
(function () {
  document.querySelectorAll('.det-area .acc .q').forEach(function (q) {
    q.addEventListener('click', function () {
      var acc = q.closest('.acc');
      var open = acc.classList.toggle('open');
      q.setAttribute('aria-expanded', String(open));
    });
  });
  document.querySelectorAll('.det-area a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href'); if (id === '#') return;
      var t = document.querySelector(id); if (!t) return;
      e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
`

const ASSETS = 'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets'
const guides = guidesData as Record<string, { name: string; html: string }>

const INFO: Record<string, { blurb: string; hero: string }> = {
  'central-pattaya': { blurb: 'The all-in-one heart of the bay — Beach Road, malls, street food and nightlife, all walkable.', hero: `${ASSETS}/pattaya-city-beach-2.webp` },
  'jomtien': { blurb: 'A long, calm beach with a residential feel — the family and long-stay pick.', hero: `${ASSETS}/best-island-pattaya.jpg` },
  'naklua': { blurb: 'The older, more local north end — fishing-village roots, seafood and a quieter pace.', hero: `${ASSETS}/pattaya-buddhist-pagoda-golden.jpg` },
  'pratumnak-hill': { blurb: 'The leafy headland between the two beaches — upscale, calm, with viewpoints and coves.', hero: `${ASSETS}/pattaya-city-beach-1.jpg` },
  'wong-amat': { blurb: 'The bay’s most refined beach — clean sand, boutique resorts and a peaceful escape.', hero: `${ASSETS}/pattaya-city-beach-1.jpg` },
  'walking-street': { blurb: 'The full-throttle nightlife strip and the sois around it — clubs, bars and late-night energy.', hero: `${ASSETS}/pattaya-night-clubs-1.jpg` },
  'islands': { blurb: 'Just offshore lie Koh Larn (Coral Island) and its neighbours — the clearest water and best sand.', hero: `${ASSETS}/Coral-Island-pattaya.jpg` },
}

interface AreaVenue {
  id: string; slug: string | null; name: string; rating: number | null; review_count: number | null
  venue_type: string | null; price_range: string | null; address: string | null; neighborhood: string | null; image_url: string | null
  categories: { name_en: string } | null
}

async function getAreaVenues(match: string[]): Promise<AreaVenue[]> {
  const or = match.map((m) => `neighborhood.ilike.%${m}%`).join(',')
  const { data } = await supabase
    .from('venues')
    .select('id, slug, name, rating, review_count, venue_type, price_range, address, neighborhood, image_url, categories(name_en)')
    .eq('is_active', true)
    .or(or)
    .order('rating', { ascending: false, nullsFirst: false })
    .order('review_count', { ascending: false, nullsFirst: false })
    .limit(60)
  return (data || []) as unknown as AreaVenue[]
}

export function generateStaticParams() {
  return AREAS.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const area = areaBySlug(slug)
  if (!area) return { title: 'Not Found', robots: { index: false } }
  const info = INFO[slug]
  return {
    title: `${area.name}, Pattaya — Area Guide | Go To Pattaya`,
    description: info?.blurb,
    alternates: { canonical: `/areas/${slug}` },
    openGraph: { title: `${area.name}, Pattaya`, description: info?.blurb, url: `${SITE_URL}/areas/${slug}`, images: info?.hero ? [{ url: info.hero }] : undefined },
  }
}

export default async function AreaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const area = areaBySlug(slug)
  if (!area) notFound()
  const info = INFO[slug]
  const guide = guides[slug]
  const venues = await getAreaVenues(area.match)

  return (
    <div className="adx">
      {guide ? (
        // Rich editorial area guide (bespoke .det-area design). translate="no"
        // keeps Google Translate from breaking the CSS grids (e.g. quick numbers).
        <>
          <div translate="no" dangerouslySetInnerHTML={{ __html: guide.html }} />
          <BlogScript script={AREA_GUIDE_SCRIPT} />
        </>
      ) : (
        // Fallback hero for areas without a guide (e.g. the islands)
        <section className="adx-hero">
          <img className="adx-hero__img" src={venues.find((v) => v.image_url)?.image_url || info?.hero || `${ASSETS}/pattaya-city-beach-1.jpg`} alt={`${area.name}, Pattaya`} />
          <div className="adx-hero__veil" aria-hidden="true" />
          <div className="adx-hero__inner">
            <div className="container">
              <Link href="/areas" className="adx-back"><Icon name="arrow-left" size={16} /> All areas</Link>
              <span className="kicker" style={{ color: '#bfe3ff' }}>Area guide</span>
              <h1>{area.name}</h1>
              <p className="adx-lead">{info?.blurb}</p>
              <div className="adx-vibes">{area.vibes.map((v) => <span key={v} className="adx-chip">{v}</span>)}</div>
            </div>
          </div>
        </section>
      )}

      {/* DB venues in this area */}
      <section className="adx-section">
        <div className="container">
          <div className="eat-head">
            <div className="titles">
              <p className="kicker">Where to go</p>
              <h2>Places in {area.name}</h2>
              <p>Restaurants, bars, spas and things to do we cover in this part of the bay — sorted by rating.</p>
            </div>
            {venues.length > 0 && <span className="pill pill--navy">{venues.length} {venues.length === 1 ? 'place' : 'places'}</span>}
          </div>

          {venues.length > 0 ? (
            <div className="eat-grid">
              {venues.map((v) => (
                <article key={v.id} className="eat-card">
                  <div className="eat-card__media">
                    {v.image_url && <img src={v.image_url} alt={v.name} loading="lazy" />}
                    <span className="eat-card__tag">{v.venue_type || v.categories?.name_en}</span>
                  </div>
                  <div className="eat-card__body">
                    {v.venue_type && <div className="eat-card__cuisine">{v.venue_type}</div>}
                    <h3><Link href={`/venues/${v.slug}`}>{v.name}</Link></h3>
                    {v.address && <div className="eat-card__loc"><Icon name="pin" size={16} className="ic" />{v.address}</div>}
                    <div className="eat-card__foot">
                      <span className="eat-card__rate"><span className="star">★</span> {v.rating?.toFixed(1) ?? '—'} {v.review_count != null && <span className="count">({v.review_count.toLocaleString()})</span>}</span>
                      <span className="eat-card__price">{v.price_range || ''}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="adx-empty">
              <Icon name="pin" size={32} style={{ color: 'var(--text-faint)' }} /><br />
              We don’t have individual places listed for {area.name} yet — explore it on the <a href="/areas#areas-map">map</a>.
            </p>
          )}

          <div className="adx-other">
            <span>Other areas:</span>
            {AREAS.filter((a) => a.slug !== slug).map((a) => (
              <Link key={a.slug} href={`/areas/${a.slug}`} className="adx-otherlink">{a.name}</Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
