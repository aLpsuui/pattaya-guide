import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Icon from '@/app/components/Icon'
import EatFilters from './EatFilters'

const ASSETS = 'https://cdn.gotopattaya.com/Assets'

interface Venue {
  id: string
  name: string
  rating: number | null
  review_count: number | null
  venue_type: string | null
  price_range: string | null
  address: string | null
  status: string | null
  image_url: string | null
  slug: string | null
  categories: { name_en: string; slug: string }
}

async function getEatVenues(): Promise<Venue[]> {
  const { data } = await supabase
    .from('venues')
    .select('id, name, rating, review_count, venue_type, price_range, address, status, image_url, slug, categories!inner(name_en, slug)')
    .eq('is_active', true)
    .eq('categories.slug', 'eat-and-drinks')
    .order('rating', { ascending: false })
    .order('review_count', { ascending: false })
  return (data || []) as unknown as Venue[]
}

// Map a venue_type string into one of the sub-nav filter keys.
function catKey(venueType: string | null): string {
  const t = (venueType || '').toLowerCase()
  if (/cafe|café|coffee|roaster/.test(t)) return 'cafe'
  if (/bar|rooftop|pub|club|cocktail/.test(t)) return 'bar'
  if (/seafood/.test(t)) return 'seafood'
  if (/street/.test(t)) return 'street'
  if (/vegan|healthy|plant/.test(t)) return 'vegan'
  return 'restaurant'
}

function isOpen(status: string | null): boolean {
  return /açık|open/i.test(status || '')
}

export const metadata = {
  title: 'Eat & Drinks in Pattaya — Where Pattaya Actually Eats | Go To Pattaya',
  description:
    'An honest, editor-curated guide to the best restaurants, cafés and rooftop bars in Pattaya. No pay-to-play. Filter by category and find where to eat.',
  alternates: { canonical: '/eat-and-drinks' },
}

export default async function EatDrinksPage() {
  const venues = await getEatVenues()

  const total = venues.length
  const cafeCount = venues.filter(v => catKey(v.venue_type) === 'cafe').length
  const barCount = venues.filter(v => catKey(v.venue_type) === 'bar').length
  const rated = venues.filter(v => typeof v.rating === 'number')
  const avg = rated.length ? (rated.reduce((s, v) => s + (v.rating || 0), 0) / rated.length).toFixed(1) : '—'

  const picks = venues.slice(0, 3)
  const rooftops = venues.filter(v => catKey(v.venue_type) === 'bar').slice(0, 8)

  return (
    <div className="eat-page">
      {/* 1 · HERO */}
      <section className="eat-hero">
        <div className="container eat-hero__inner">
          <div className="eat-hero__copy">
            <div className="eat-hero__meta">
              <span><b>{total || '—'}</b> places</span><span className="dot" aria-hidden="true"></span>
              <span>Updated <b>weekly</b></span><span className="dot" aria-hidden="true"></span>
              <span>Reviewed by local food editors</span>
            </div>
            <p className="kicker">Eat &amp; Drinks · Pattaya</p>
            <h1>Where Pattaya <span>actually</span> eats</h1>
            <p className="eat-hero__lead">From morning latte art to late-night rooftop plates — a hand-picked, honestly-ranked guide to the city&apos;s tables, cafés and bars. No paid placements.</p>

            <form className="search" role="search">
              <Icon name="search" size={20} style={{ color: 'var(--text-faint)' }} />
              <input type="search" id="eatSearch" placeholder="Search restaurants, cafés, cuisines…" aria-label="Search restaurants, cafés and cuisines" autoComplete="off" />
              <button type="submit" className="go" aria-label="Search">
                <Icon name="arrow-right" size={20} />
              </button>
            </form>

            <div className="eat-hero__stats" role="list" aria-label="Section overview">
              <div className="st" role="listitem"><b>{total || '—'}</b><span>Verified places</span></div>
              <div className="st" role="listitem"><b>{cafeCount}</b><span>Cafés &amp; coffee</span></div>
              <div className="st" role="listitem"><b>{avg}★</b><span>Avg. rating</span></div>
              <div className="st" role="listitem"><b>{barCount}</b><span>Rooftops &amp; bars</span></div>
            </div>
          </div>

          <div className="eat-hero__art" aria-hidden="true">
            <div className="eat-hero__img main" style={{ backgroundImage: `url('${ASSETS}/best-restaurants-pattaya.webp')` }}></div>
            <div className="eat-hero__img sub" style={{ backgroundImage: `url('${ASSETS}/nitan-coffee-pattaya.webp')` }}></div>
            <div className="eat-hero__badge">
              <Icon name="local-verified" size={20} className="ic" />
              <b>Locally verified · weekly</b>
            </div>
          </div>
        </div>
      </section>

      {/* 2 · CATEGORY CHIP SUB-NAV */}
      <nav className="eat-subnav" aria-label="Filter by category">
        <div className="container">
          <div className="filterbar" id="catFilter" role="group" aria-label="Category filters">
            <button className="chip" data-filter="all" aria-pressed="true"><Icon name="eat" size={16} /> All</button>
            <button className="chip" data-filter="restaurant" aria-pressed="false"><Icon name="eat" size={16} /> Restaurants</button>
            <button className="chip" data-filter="cafe" aria-pressed="false"><Icon name="coffee" size={16} /> Cafés &amp; Coffee</button>
            <button className="chip" data-filter="bar" aria-pressed="false"><Icon name="bars" size={16} /> Bars &amp; Rooftops</button>
            <button className="chip" data-filter="seafood" aria-pressed="false"><Icon name="sea-view" size={16} /> Seafood</button>
            <button className="chip" data-filter="street" aria-pressed="false"><Icon name="eat" size={16} /> Street Food</button>
            <button className="chip" data-filter="vegan" aria-pressed="false"><Icon name="outdoor" size={16} /> Vegan &amp; Healthy</button>
          </div>
        </div>
      </nav>

      {/* 3 · EDITOR'S PICKS */}
      {picks.length > 0 && (
        <section className="sec sec--alt" aria-labelledby="picks-h">
          <div className="container">
            <div className="eat-head">
              <div className="titles">
                <p className="kicker">Editor&apos;s picks · this month</p>
                <h2 id="picks-h">The ones we keep <span>going back</span> to</h2>
                <p>Tasted, returned to, and paid for ourselves. These are the tables that earned a spot — not a slot.</p>
              </div>
              <a href="#all-h" className="eat-viewall">See all {total} <Icon name="arrow-right" size={16} /></a>
            </div>
            <div className="eat-grid">
              {picks.map(v => (
                <article key={v.id} className="eat-card">
                  <div className="eat-card__media">
                    {v.image_url && <img src={v.image_url} alt={v.name} loading="eager" fetchPriority="high" />}
                    <span className="eat-card__tag">{v.venue_type || v.categories?.name_en}</span>
                    <span className="eat-card__pick"><span className="star" aria-hidden="true">★</span> Editor&apos;s pick</span>
                    {isOpen(v.status) && <span className="eat-card__open"><span className="dot" aria-hidden="true"></span>Open now</span>}
                  </div>
                  <div className="eat-card__body">
                    {v.venue_type && <div className="eat-card__cuisine">{v.venue_type}</div>}
                    <h3><Link href={`/venues/${v.slug}`}>{v.name}</Link></h3>
                    {v.address && <div className="eat-card__loc"><Icon name="pin" size={16} className="ic" />{v.address}</div>}
                    <div className="eat-card__foot">
                      <span className="eat-card__rate"><span className="star">★</span> {v.rating?.toFixed(1) ?? '—'} {v.review_count != null && <span className="count">({v.review_count.toLocaleString()})</span>}</span>
                      <span className="eat-card__price">{v.price_range || '—'}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4 · MAIN LISTING GRID — filterable */}
      <section className="sec" aria-labelledby="all-h">
        <div className="container">
          <div className="eat-head">
            <div className="titles">
              <p className="kicker">The full table</p>
              <h2 id="all-h">Every place <span>worth a detour</span></h2>
              <p>Filter with the categories above — the list updates instantly.</p>
            </div>
            <span className="pill pill--navy" id="resultCount" aria-live="polite">{total} {total === 1 ? 'place' : 'places'}</span>
          </div>

          <div className="eat-grid" id="eatGrid">
            {venues.map((v, i) => {
              const open = isOpen(v.status)
              return (
                <article
                  key={v.id}
                  className="eat-card"
                  data-cat={catKey(v.venue_type)}
                  data-name={`${v.name} ${v.venue_type || ''}`.toLowerCase()}
                >
                  <div className="eat-card__media">
                    {v.image_url && <img src={v.image_url} alt={v.name} loading={i < 8 ? 'eager' : 'lazy'} fetchPriority={i < 8 ? 'high' : undefined} />}
                    <span className="eat-card__tag">{v.venue_type || v.categories?.name_en}</span>
                    {open && <span className="eat-card__open"><span className="dot" aria-hidden="true"></span>Open now</span>}
                  </div>
                  <div className="eat-card__body">
                    {v.venue_type && <div className="eat-card__cuisine">{v.venue_type}</div>}
                    <h3><Link href={`/venues/${v.slug}`}>{v.name}</Link></h3>
                    {v.address && <div className="eat-card__loc"><Icon name="pin" size={16} className="ic" />{v.address}</div>}
                    <div className="eat-card__foot">
                      <span className="eat-card__rate"><span className="star">★</span> {v.rating?.toFixed(1) ?? '—'} {v.review_count != null && <span className="count">({v.review_count.toLocaleString()})</span>}</span>
                      <span className="eat-card__price">{v.price_range || '—'}</span>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <p className={`eat-empty${total === 0 ? ' on' : ''}`} id="eatEmpty" role="status">
            <Icon name="search" size={32} style={{ color: 'var(--text-faint)' }} /><br />
            {total === 0
              ? 'No Eat & Drinks places are published yet. Add venues in this category to see them here.'
              : 'No places in this category. Try another filter.'}
          </p>
        </div>
      </section>

      {/* 5 · ROOFTOPS FOR GOLDEN HOUR — carousel */}
      {rooftops.length > 0 && (
        <section className="sec" aria-labelledby="roof-h">
          <div className="container">
            <div className="eat-head">
              <div className="titles">
                <p className="kicker">Golden hour</p>
                <h2 id="roof-h">Rooftops for the <span>last of the light</span></h2>
                <p>Time your drink with the sunset. Arrive early for the good seats.</p>
              </div>
            </div>
            <div className="carousel-wrap">
              <button className="car-btn car-prev" type="button" aria-label="Scroll rooftops left" data-car="prev"><Icon name="arrow-left" size={20} /></button>
              <div className="carousel" id="roofCar">
                {rooftops.map(v => (
                  <article key={v.id} className="roof-card">
                    <div className="roof-card__media">
                      {v.image_url && <img src={v.image_url} alt={v.name} loading="lazy" />}
                      <div className="roof-card__scrim" aria-hidden="true"></div>
                    </div>
                    <div className="roof-card__cap">
                      <span className="pill pill--sun"><Icon name="sunset" size={16} /> Sunset deck</span>
                      <h3>{v.name}</h3>
                      <div className="sub">
                        <span className="m"><span className="star" aria-hidden="true">★</span>{v.rating?.toFixed(1) ?? '—'}</span>
                        {v.price_range && <span className="m">{v.price_range}</span>}
                        {v.address && <span className="m"><Icon name="pin" size={16} />{v.address}</span>}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <button className="car-btn car-next" type="button" aria-label="Scroll rooftops right" data-car="next"><Icon name="arrow-right" size={20} /></button>
            </div>
          </div>
        </section>
      )}

      {/* 6 · HOW WE RANK — trust note */}
      <section className="sec sec--alt sec--tight" aria-labelledby="rank-h">
        <div className="container">
          <div className="trust-grid">
            <div>
              <p className="kicker">How we rank</p>
              <h2 id="rank-h">No <span>pay-to-play</span>. Ever.</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 18, maxWidth: '52ch' }}>
                Restaurants can&apos;t buy a higher spot on this page. Our ordering blends real visit notes, fresh review trends and local reporting — then we re-check the list every week.
              </p>
              <ul className="trust-list">
                <li><Icon name="check" size={24} className="ic" /><span><b>We pay our own bills.</b> Editors visit anonymously; no comped meals influence a ranking.</span></li>
                <li><Icon name="check" size={24} className="ic" /><span><b>Reviews are weighted, not counted.</b> We discount suspicious spikes and reward consistency over time.</span></li>
                <li><Icon name="check" size={24} className="ic" /><span><b>Listings ≠ rankings.</b> A venue paying for a listing never moves up the order.</span></li>
              </ul>
            </div>

            <div className="trust-aside">
              <div className="alert alert--info">
                <Icon name="info" size={24} />
                <div>
                  <b>Spotted something off?</b><br />
                  Hours change, kitchens close, owners move on. If a detail here is stale, flag it from any venue page and a local editor will verify it.
                </div>
              </div>
              <div className="author">
                <span className="ava" aria-hidden="true">PG</span>
                <div className="who">
                  <b>The Go To Pattaya local desk</b>
                  <span className="role"><Icon name="local-verified" size={16} style={{ verticalAlign: '-3px' }} /> Locally verified</span>
                  <p>On-the-ground in Pattaya since 2019 — eating, drinking and double-checking so the list stays honest.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <EatFilters />
    </div>
  )
}
