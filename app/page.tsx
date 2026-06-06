import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Venue {
  id: string
  name: string
  rating: number
  review_count: number
  venue_type: string
  price_range: string
  address: string
  status: string
  image_url: string | null
  categories: { name_en: string; slug: string }
}

interface Category {
  id: string
  name_en: string
  slug: string
}

interface BlogPost {
  id: string
  slug: string
  title: string
  description: string
  author: string
  published_at: string
  category: string
  hero_image: string
  read_time: number
}

async function getBlogPosts(): Promise<BlogPost[]> {
  const { data } = await supabase
    .from('blog_posts')
    .select('id, slug, title, description, author, published_at, category, hero_image, read_time')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(3)
  return (data || []) as BlogPost[]
}

async function getTopVenues() {
  const { data } = await supabase
    .from('venues')
    .select('id, name, rating, review_count, venue_type, price_range, address, status, image_url, categories(name_en, slug)')
    .eq('is_active', true)
    .not('rating', 'is', null)
    .order('rating', { ascending: false })
    .order('review_count', { ascending: false })
    .limit(8)
  return (data || []) as unknown as Venue[]
}

async function getCategories() {
  const { data } = await supabase
    .from('categories')
    .select('id, name_en, slug')
    .order('name_en')
  return (data || []) as Category[]
}

async function getAdventureVenues() {
  const { data } = await supabase
    .from('venues')
    .select('id, name, rating, review_count, venue_type, price_range, address, status, image_url, categories!inner(name_en, slug)')
    .eq('is_active', true)
    .not('rating', 'is', null)
    .or('slug.eq.skydiving,slug.eq.tours', { referencedTable: 'categories' })
    .order('rating', { ascending: false })
    .order('review_count', { ascending: false })
    .limit(6)
  return (data || []) as unknown as Venue[]
}

async function getOpenCount() {
  const { count } = await supabase
    .from('venues')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Açık')
  return count || 0
}

const categoryMeta: Record<string, { photo: string; count: string; icon: string }> = {
  tours: { photo: 'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/imgi_5_30a4dff84cffd371f8aabdc0aefa5995ee9c9118cd0062581a0f727f523c19f5.png', count: '77 tours', icon: '🏝️' },
  cafes: { photo: 'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/imgi_124_40360161c5206c760df9b228482dfa480c658edaad32f4f1745231de3afe9358.jpg', count: '101 cafés', icon: '☕' },
  restaurants: { photo: 'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/imgi_129_iStock-1312283557-HEADER-DESKTOP.jpg', count: '73 restaurants', icon: '🍽️' },
  nightclubs: { photo: 'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/imgi_117_a8aecbcd2734c0097e1808212aeb96019326d828d01f08525486a0c4623d254a.jpg', count: '77 venues', icon: '🎵' },
  spas: { photo: 'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/imgi_135_c88b5db4b5413c41.jpg', count: '60 spas', icon: '💆' },
  skydiving: { photo: 'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/imgi_125_fff8cb1ff88f4005141bf5dc3190c52198b4efe2e8651b485066d49ff0a910d2.jpg', count: '21 spots', icon: '🪂' },
  gyms: { photo: 'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/imgi_22_8095e53d10eba6e77c7a6d5b4513c20322d7a512826fbf43739e03d5ad7658d7.jpg', count: '79 gyms', icon: '💪' },
  'rent-a-bike': { photo: 'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/imgi_127_ryutaro-uozumi-lsdURl-_ktc-unsplash-HEADER.jpg', count: '27 shops', icon: '🏍️' },
  'muay-thai': { photo: 'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/imgi_22_8095e53d10eba6e77c7a6d5b4513c20322d7a512826fbf43739e03d5ad7658d7.jpg', count: '46 camps', icon: '🥊' },
  massage: { photo: 'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/imgi_135_c88b5db4b5413c41.jpg', count: '23 spots', icon: '🤲' },
  yoga: { photo: 'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/imgi_5_30a4dff84cffd371f8aabdc0aefa5995ee9c9118cd0062581a0f727f523c19f5.png', count: '16 studios', icon: '🧘' },
}

const top6Slugs = ['tours', 'restaurants', 'nightclubs', 'spas', 'skydiving', 'gyms']

const SaveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#054C86" strokeWidth="2">
    <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/>
  </svg>
)

export default async function Home() {
  const [categories, topVenues, openCount, blogPosts, adventureVenues] = await Promise.all([
    getCategories(),
    getTopVenues(),
    getOpenCount(),
    getBlogPosts(),
    getAdventureVenues(),
  ])

  const top6 = categories
    .filter(c => top6Slugs.includes(c.slug))
    .sort((a, b) => top6Slugs.indexOf(a.slug) - top6Slugs.indexOf(b.slug))

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-overlay"></div>
        <div className="container hero-inner">
          <h1>Your complete guide<br/>to <span>Pattaya.</span></h1>
          <p className="intro">Restaurants, beaches, attractions, day trips, wellness, sports — 600+ places and 50+ in-depth guides. Plan your trip in 5 minutes.</p>
          <form className="hero-search" role="search">
            <label className="hsr" htmlFor="heroInput">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
              <input id="heroInput" type="search" placeholder="Search places, areas, or guides..." autoComplete="off"/>
            </label>
            <button type="submit" className="go" aria-label="Search">
              <span>Search</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </button>
          </form>
          <div className="hero-tags" role="list">
            <a href="#cats" className="qtag" role="listitem">🍽️ Eat</a>
            <a href="#cats" className="qtag" role="listitem">🏖️ Beaches</a>
            <a href="#cats" className="qtag" role="listitem">🏝️ Tours</a>
            <a href="#cats" className="qtag" role="listitem">💆 Wellness</a>
            <a href="#plan" className="qtag" role="listitem">📅 First-time visitor</a>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <div className="stats-strip">
        <div className="container stats-inner">
          <div className="stat-item">
            <b>600+</b><span>verified places</span>
          </div>
          <span className="stat-sep"></span>
          <div className="stat-item">
            <b>50+</b><span>in-depth guides</span>
          </div>
          <span className="stat-sep"></span>
          <div className="stat-item">
            <b style={{color:'var(--success)'}}>{openCount}</b><span>open right now</span>
          </div>
          <span className="stat-sep"></span>
          <div className="stat-item">
            <b>Weekly</b><span>re-checked</span>
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="section cats" id="cats">
        <div className="container">
          <div className="sec-head">
            <div className="titles">
              <div className="kicker">Browse Pattaya</div>
              <h2>Six categories. Every kind of day.</h2>
              <p>Six categories cover every kind of day in Pattaya. Re-checked weekly — if a place closes or changes, the page updates within days.</p>
            </div>
            <a href="#" className="viewall">All categories <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
          </div>
          <div className="cats-grid">
            {top6.map((cat, i) => {
              const meta = categoryMeta[cat.slug]
              return (
                <a key={cat.id} href={`/${cat.slug}`} className={`cat${i === 0 ? ' cat-feat' : ''}`}>
                  <div className="bg" style={{backgroundImage:`url(${meta?.photo})`,backgroundSize:'cover',backgroundPosition:'center'}}></div>
                  <div className="cat-ic">
                    <span style={{fontSize:20}}>{meta?.icon}</span>
                  </div>
                  <b>{cat.name_en}</b>
                  <div className="meta">
                    <span>{meta?.count}</span>
                    <span className="live"><i></i>Open now</span>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* EDITOR'S PICKS — Static for now */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <div className="titles">
              <div className="kicker">Editor&apos;s picks</div>
              <h2>The 30 best places in Pattaya</h2>
              <p>Hand-picked by our editorial team. Every place visited in person, photographed by us, re-checked weekly.</p>
            </div>
            <a href="#" className="viewall">View all 30 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
          </div>
          <div className="carousel-wrap">
            <div className="carousel" id="topCar">
              {topVenues.map((venue) => (
                <a key={venue.id} href={`/venues/${venue.id}`} className="place">
                  <div className="ph" style={{
                    backgroundImage: venue.image_url ? `url(${venue.image_url})` : 'var(--grad-brand)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}>
                    <span className="tagpill">{venue.categories?.name_en}</span>
                  </div>
                  <div className="pb">
                    <h4>{venue.name}</h4>
                    <div className="meta">
                      <span>{venue.venue_type}</span>
                      {venue.address && <span>· {venue.address.slice(0, 25)}</span>}
                    </div>
                    <div className="rate">
                      <div className="left"><span className="star">★</span> {venue.rating?.toFixed(1)} <span className="count">({venue.review_count?.toLocaleString()})</span></div>
                      <span className="price">{venue.price_range || '—'}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PLAN YOUR TRIP - Static */}
      <section className="section plan" id="plan">
        <div className="container">
          <div className="sec-head">
            <div className="titles">
              <div className="kicker">Plan your Pattaya trip</div>
              <h2>Start here if you&apos;re visiting Pattaya.</h2>
              <p>Four detailed guides covering the questions every first-time visitor asks before booking.</p>
            </div>
            <a href="#" className="viewall">All planning guides <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
          </div>
          <div className="plan-grid">
            {[
              { img: 'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/imgi_137_63e3c62ef0c5d.jpg', tag: 'When to go', title: 'Best time to visit Pattaya', sub: 'Month-by-month guide — weather, crowds and prices.' },
              { img: 'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/imgi_127_ryutaro-uozumi-lsdURl-_ktc-unsplash-HEADER.jpg', tag: 'Transport', title: 'Bangkok → Pattaya: every option', sub: 'Bus, taxi, minivan and private transfer — prices and tips.' },
              { img: 'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/imgi_129_iStock-1312283557-HEADER-DESKTOP.jpg', tag: 'Stay', title: 'Where to stay in Pattaya', sub: 'Five districts compared — what each one is actually like.' },
              { img: 'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/hero-bg.jpg', tag: 'First visit', title: 'First-time visitor guide', sub: 'The four things every first-timer gets wrong — and how to avoid them.' },
            ].map((card, i) => (
              <a key={i} href="#" className="plan-card">
                <div className="bg" style={{backgroundImage:`url(${card.img})`,backgroundSize:'cover',backgroundPosition:'center'}}></div>
                <div className="plan-c">
                  <span className="pill pill-glass">{card.tag}</span>
                  <div>
                    <h3>{card.title}</h3>
                    <p>{card.sub}</p>
                  </div>
                  <span className="plan-arrow">Read the guide <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* EXTREME / ADVENTURE — from database */}
      <section className="section extreme" id="adventure">
        <div className="container">
          <div className="sec-head">
            <div className="titles">
              <div className="kicker">For the adrenaline-hungry</div>
              <h2>Adrenaline &amp; adventure</h2>
              <p>Sky dives, paramotors, jet skis, PADI courses and bungee — every operator licensed and re-checked every 30 days.</p>
            </div>
            <a href="/skydiving" className="viewall">All adventures <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
          </div>
          <div className="carousel-wrap">
            <div className="carousel" id="extremeCar">
              {adventureVenues.map((venue) => {
                const meta = categoryMeta[venue.categories?.slug || '']
                return (
                  <a key={venue.id} href={`/venues/${venue.id}`} className="place place-dark">
                    <div className="ph" style={{
                      backgroundImage: venue.image_url ? `url(${venue.image_url})` : undefined,
                      background: venue.image_url ? undefined : 'var(--grad-brand)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}>
                      <span className="tagpill">{venue.categories?.name_en}</span>
                      <button className="save" aria-label="Save"><SaveIcon /></button>
                    </div>
                    <div className="pb">
                      <h4>{venue.name}</h4>
                      <div className="meta"><span>{venue.venue_type}</span></div>
                      <div className="rate">
                        <div className="left"><span className="star">★</span> {venue.rating?.toFixed(1)} <span className="count">({venue.review_count?.toLocaleString()})</span></div>
                        <span className="price">{venue.price_range || '—'}</span>
                      </div>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* DISTRICTS — Static */}
      <section className="section districts" id="districts">
        <div className="container">
          <div className="sec-head">
            <div className="titles">
              <div className="kicker">Neighborhoods</div>
              <h2>Pick your district</h2>
              <p>Pattaya is five very different cities in one. Each district has its own pace, prices and personality.</p>
            </div>
            <a href="#map" className="viewall">Open the map <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
          </div>
          <div className="dist-grid">
            {[
              { img: 'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/hero-bg.jpg', label: 'Most visited', name: 'Central Pattaya', count: '320 places', desc: 'Beach Road, Walking Street, Soi Buakhao' },
              { img: 'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/imgi_137_63e3c62ef0c5d.jpg', label: 'Family-friendly', name: 'Jomtien', count: '180 places', desc: 'Quieter beach, great seafood' },
              { img: 'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/imgi_129_iStock-1312283557-HEADER-DESKTOP.jpg', label: 'Sunset views', name: 'Pratumnak Hill', count: '90 places', desc: 'Between Pattaya and Jomtien' },
              { img: 'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/imgi_5_30a4dff84cffd371f8aabdc0aefa5995ee9c9118cd0062581a0f727f523c19f5.png', label: 'Quiet escape', name: 'Naklua', count: '110 places', desc: 'Local vibe, old Pattaya feel' },
              { img: 'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/imgi_125_fff8cb1ff88f4005141bf5dc3190c52198b4efe2e8651b485066d49ff0a910d2.jpg', label: 'Day trip', name: 'Koh Larn Island', count: '45 places', desc: '45 min ferry from Bali Hai' },
            ].map((d, i) => (
              <a key={i} href="#" className={`dist dist-${i+1}`}>
                <div className="dist-bg" style={{backgroundImage:`url(${d.img})`,backgroundSize:'cover',backgroundPosition:'center'}}></div>
                <div className="dist-content">
                  <span className="pill pill-glass">{d.label}</span>
                  <div>
                    <h3>{d.name}</h3>
                    <p>{d.count} · {d.desc}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* MAP PREVIEW — Static */}
      <section className="section" id="map">
        <div className="container">
          <div className="sec-head">
            <div className="titles">
              <div className="kicker">Interactive map</div>
              <h2>Every place. One map.</h2>
              <p>Filter by category or district. Save areas before you fly.</p>
            </div>
          </div>
          <div className="map-block">
            <div className="map-canvas">
              <div className="map-pin map-pin-1"><span className="lbl">Sanctuary of Truth</span><div className="pin"></div></div>
              <div className="map-pin map-pin-2 alt"><span className="lbl">Pattaya Beach</span><div className="pin"></div></div>
              <div className="map-pin map-pin-3"><span className="lbl">Walking Street</span><div className="pin"></div></div>
              <div className="map-pin map-pin-4"><span className="lbl">Sky Gallery</span><div className="pin"></div></div>
              <div className="map-pin map-pin-5 alt"><span className="lbl">Jomtien Beach</span><div className="pin"></div></div>
              <div className="map-fade">
                <div><b>600+ places visible</b><span style={{display:'block',fontSize:12,color:'var(--ink-500)'}}>all categories</span></div>
                <a href="#" className="btn btn-primary btn-sm">Open full map →</a>
              </div>
            </div>
            <div className="map-side">
              <h3>Top rated nearby</h3>
              <div className="map-list">
                {topVenues.slice(0, 5).map((venue, i) => (
                  <a key={venue.id} href={`/venues/${venue.id}`} className="map-row">
                    <div className="num">{i + 1}</div>
                    <div className="info">
                      <b>{venue.name}</b>
                      <span>{venue.categories?.name_en}</span>
                    </div>
                    <span className="star-r"><i>★</i> {venue.rating?.toFixed(1)}</span>
                  </a>
                ))}
              </div>
              <a href="#" className="viewall" style={{marginTop:'auto',paddingTop:12}}>See all {openCount} open →</a>
            </div>
          </div>
        </div>
      </section>

      {/* BLOG — from database */}
      <section className="section blog" id="blog">
        <div className="container">
          <div className="sec-head">
            <div className="titles">
              <div className="kicker">From the blog</div>
              <h2>50+ in-depth Pattaya guides</h2>
              <p>Long-form articles covering itineraries, food, transport, neighborhoods and seasonal updates.</p>
            </div>
            <Link href="/blog" className="viewall">All articles <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></Link>
          </div>
          <div className="blog-grid">
            {blogPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="post">
                <div className="ph" style={{
                  backgroundImage: post.hero_image ? `url(${post.hero_image})` : undefined,
                  background: post.hero_image ? undefined : 'var(--grad-brand)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}>
                  <span className="pill pill-white">{post.category}</span>
                </div>
                <div className="pb">
                  <div className="pmeta">
                    <span>{new Date(post.published_at).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'})}</span>
                    <i></i>
                    <span>{post.read_time} min read</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p className="excerpt">{post.description}</p>
                  <div className="author">
                    <div style={{width:32,height:32,borderRadius:'50%',background:'var(--grad-cta)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--display)',fontWeight:700,fontSize:13,flexShrink:0}}>
                      {post.author?.split(' ').map((n:string) => n[0]).join('')}
                    </div>
                    <div>
                      <b style={{fontFamily:'var(--display)',fontSize:13,color:'var(--ink-700)',display:'block'}}>{post.author}</b>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="section trust">
        <div className="container">
          <div className="sec-head" style={{justifyContent:'center',textAlign:'center'}}>
            <div className="titles" style={{textAlign:'center',margin:'0 auto'}}>
              <div className="kicker">What&apos;s inside</div>
              <h2>Everything you need to plan a Pattaya trip.</h2>
              <p style={{margin:'8px auto 0',maxWidth:'58ch'}}>From the first &quot;when should I go&quot; to the last &quot;how do I get back to Bangkok&quot; — free, no signup, no popups.</p>
            </div>
          </div>
          <div className="trust-grid">
            {[
              { icon: '📍', title: '600+ verified places', desc: 'Every place on Pattaya Guide was visited by a person, not scraped. Re-checked weekly.' },
              { icon: '⭐', title: 'No paid placements', desc: 'Rankings are based on quality, not who paid. We reject every offer that doesn\'t meet our standards.' },
              { icon: '🕐', title: 'Real opening hours', desc: 'We call ahead, visit in person and update pages the day things change. No stale Google data.' },
            ].map((card, i) => (
              <div key={i} className="trust-card">
                <div className="ic" style={{fontSize:28}}>{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="news">
        <div className="container">
          <div className="news-inner">
            <div className="kicker">Plan in 5 minutes</div>
            <h2>Get our free 1-week Pattaya itinerary.</h2>
            <p className="intro">A no-fluff itinerary we send to friends visiting Pattaya for the first time.</p>
            <form className="news-form" aria-label="Newsletter signup">
              <input type="email" placeholder="your@email.com" required aria-label="Email address"/>
              <button className="btn btn-primary btn-sm" type="submit">Send it →</button>
            </form>
            <div className="news-bullets">
              <span className="news-bullet">✓ One email a month</span>
              <span className="news-bullet">✓ No spam</span>
              <span className="news-bullet">✓ Unsubscribe anytime</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
