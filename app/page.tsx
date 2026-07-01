import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import Icon from '@/app/components/Icon'
import CarButton from '@/app/components/CarButton'
import HeroSearch from '@/app/components/HeroSearch'
import ExploreMap from '@/app/components/ExploreMap'

const ASSETS = 'https://cdn.gotopattaya.com/Assets'

// Re-generate this page from the database at most once every 60s (ISR),
// so newly published venues/blog posts appear without a full rebuild.
export const revalidate = 60

interface Venue {
  id: string
  slug: string
  name: string
  rating: number | null
  review_count: number | null
  venue_type: string | null
  price_range: string | null
  price_from: number | null
  address: string | null
  image_url: string | null
  categories: { name_en: string; slug: string }
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

async function getTopVenues(): Promise<Venue[]> {
  const { data } = await supabase
    .from('venues')
    .select('id, slug, name, rating, review_count, venue_type, price_range, price_from, address, image_url, categories(name_en, slug)')
    .eq('is_active', true)
    .not('rating', 'is', null)
    .order('rating', { ascending: false })
    .order('review_count', { ascending: false })
    .limit(8)
  return (data || []) as unknown as Venue[]
}

async function getAdventureVenues(): Promise<Venue[]> {
  const { data } = await supabase
    .from('venues')
    .select('id, slug, name, rating, review_count, venue_type, price_range, price_from, address, image_url, categories!inner(name_en, slug)')
    .eq('is_active', true)
    .not('rating', 'is', null)
    .or('slug.eq.skydiving,slug.eq.tours,slug.eq.thinks-to-do', { referencedTable: 'categories' })
    .order('rating', { ascending: false })
    .limit(6)
  return (data || []) as unknown as Venue[]
}

async function getBlogPosts(): Promise<BlogPost[]> {
  const { data } = await supabase
    .from('blog_posts')
    .select('id, slug, title, description, author, published_at, category, hero_image, read_time')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(6)
  return (data || []) as BlogPost[]
}

const categories = [
  { feat: true, img: 'best-restaurants-pattaya.webp', icon: 'eat', name: 'Eat & Cafés', meta: '174 restaurants & cafés', href: '/eat-and-drinks' },
  { feat: true, img: 'pattaya-best-tours.webp', icon: 'tours', name: 'Tours & Day Trips', meta: '77 islands, boats & tours', href: '/things-to-do' },
  { feat: false, img: 'pattaya-night-clubs-2.webp', icon: 'nightlife', name: 'Nightlife & Bars', meta: '77 clubs & bars', href: '/nightlife' },
  { feat: false, img: 'pattaya-wellness-1.webp', icon: 'wellness', name: 'Wellness & Spa', meta: '99 spa, massage & yoga', href: '/wellness-and-beauty' },
  { feat: false, img: 'pattaya-muay-thai-1.webp', icon: 'muay-thai', name: 'Gym & Muay Thai', meta: '125 gyms & training camps', href: '/yoga-and-fitness' },
  { feat: false, img: 'pattaya-parasiling.webp', icon: 'transport', name: 'Adventures', meta: '48 skydiving & bike rentals', href: '/things-to-do' },
]

const planCards = [
  { img: 'Koh-Sak.webp', pill: 'When to visit', href: '/blog/best-time-to-visit-pattaya', title: 'Best months for Pattaya', text: "Weather, crowds, prices — month by month, with the months we'd actually go.", arrow: 'Read the guide' },
  { img: 'pattaya-city-beach-1.webp', pill: 'Getting there', href: '/blog/bangkok-to-pattaya', title: 'Bangkok → Pattaya', text: 'Bus, taxi, train or private transfer — real prices, real travel times, no markup tricks.', arrow: 'Compare options' },
  { img: 'coral-island-pattaya-2.webp', pill: 'Where to stay', href: '/areas', title: 'Pick the right district', text: 'Central, Jomtien, Pratumnak, Naklua — choose your area before you book. Includes streets to avoid.', arrow: 'Compare districts' },
  { img: 'pattaya-floating-market.webp', pill: 'First-time tips', href: '/blog/first-time-pattaya-mistakes', title: '8 mistakes to skip', text: 'From baht-bus etiquette to which beach to avoid — the things first-timers always regret.', arrow: 'Read the guide' },
]

const districts = [
  { cls: 'dist-1', img: 'pattaya-night-clubs-1.webp', pill: 'Most central', name: 'Central Pattaya', href: '/areas/central-pattaya', desc: 'Beach Road, Walking Street, Soi Buakhao — the busy, loud, never-sleeping heart of the city.' },
  { cls: '', img: 'pattaya-city-beach-2.webp', pill: 'Calm & clean', name: 'Jomtien', href: '/areas/jomtien', desc: 'Longer, quieter beach. Best for families and longer stays.' },
  { cls: '', img: 'best-island-pattaya.webp', pill: 'Views & sunsets', name: 'Pratumnak Hill', href: '/areas/pratumnak-hill', desc: 'Quiet hill between Central & Jomtien. Rooftops, viewpoints, walkable.' },
  { cls: '', img: 'pattaya-buddhist-pagoda-golden.webp', pill: 'Local feel', name: 'Naklua', href: '/areas/naklua', desc: 'Northern fishing village vibe. Real Thai seafood and Sanctuary of Truth.' },
  { cls: '', img: 'Coral-Island-pattaya.webp', pill: 'Day trip', name: 'Koh Larn Island', href: '/areas/islands', desc: '40 minutes by ferry. White-sand beaches and snorkel coves.' },
]


const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
)

function VenueCard({ v, dark = false }: { v: Venue; dark?: boolean }) {
  return (
    <Link href={`/venues/${v.slug}`} className="place">
      <div className="ph" style={{ backgroundImage: v.image_url ? `url(${v.image_url})` : 'var(--grad-brand)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <span className="tagpill">{v.categories?.name_en || v.venue_type}</span>
      </div>
      <div className="pb">
        <h4>{v.name}</h4>
        <div className="meta"><span>{v.venue_type}</span>{v.address && <span>· {v.address.slice(0, 25)}</span>}</div>
        <div className="rate">
          <div className="left"><span className="star">★</span> {v.rating?.toFixed(1)} {v.review_count != null && <span className="count">({v.review_count.toLocaleString()})</span>}</div>
          {(v.price_from != null || v.price_range) && <span className="price">{v.price_from != null ? `from ฿${v.price_from.toLocaleString()}` : v.price_range}</span>}
        </div>
      </div>
    </Link>
  )
}

export default async function Home() {
  const [topVenues, adventureVenues, blogPosts] = await Promise.all([
    getTopVenues(), getAdventureVenues(), getBlogPosts(),
  ])

  return (
    <>
      {/* Preload the LCP hero background (a CSS background-image the browser
          would otherwise only discover after CSS parses). */}
      <link rel="preload" as="image" href={`${ASSETS}/pattaya-city-beach-1.webp`} fetchPriority="high" />
      {/* HERO */}
      <section className="hero">
        <div className="hero-media">
          <div className="hero-bg"></div>
          <div className="hero-overlay"></div>
        </div>
        <div className="container hero-inner">
          <h1>Your complete guide<br />to <span>Pattaya.</span></h1>
          <p className="intro">Restaurants, beaches, attractions, day trips, wellness, sports — 600+ places and 50+ in-depth guides. Plan your trip in 5 minutes.</p>

          <HeroSearch />

          <div className="hero-tags" role="list">
            <a href="#cats" className="qtag" role="listitem"><Icon name="eat" size={14} /> Eat</a>
            <a href="#cats" className="qtag" role="listitem"><Icon name="beach" size={14} /> Beaches</a>
            <a href="#cats" className="qtag" role="listitem"><Icon name="tours" size={14} /> Tours</a>
            <a href="#cats" className="qtag" role="listitem"><Icon name="wellness" size={14} /> Wellness</a>
            <a href="#plan" className="qtag" role="listitem"><Icon name="calendar" size={14} /> First-time visitor</a>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section cats" id="cats">
        <div className="container">
          <div className="sec-head">
            <div className="titles">
              <div className="kicker">Browse Pattaya</div>
              <h2>Six categories. Every kind of day.</h2>
              <p>Six categories cover every kind of day in Pattaya. Re-checked weekly — if a place closes or changes, the page updates within days.</p>
            </div>
            <a href="/map" className="viewall">All categories <Arrow /></a>
          </div>
          <div className="cats-grid" translate="no">
            {categories.map(cat => (
              <Link key={cat.name} href={cat.href} className={`cat${cat.feat ? ' cat-feat' : ''}`}>
                <div className="bg" style={{ backgroundImage: `url(${ASSETS}/${cat.img})` }}></div>
                <div className="cat-ic"><Icon name={cat.icon} size={22} style={{ color: '#fff' }} /></div>
                <b>{cat.name}</b>
                <div className="meta">{cat.meta}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PLAN YOUR TRIP */}
      <section className="section plan" id="plan">
        <div className="container">
          <div className="sec-head">
            <div className="titles">
              <div className="kicker">Plan your Pattaya trip</div>
              <h2>Start here if you&apos;re visiting Pattaya.</h2>
              <p>Four detailed guides covering the questions every first-time visitor asks before booking — month, transport, district and the small things that catch people out.</p>
            </div>
            <a href="/plan-my-trip" className="viewall">All planning guides <Arrow /></a>
          </div>
          <div className="plan-grid" translate="no">
            {planCards.map(card => (
              <a key={card.title} href={card.href} className="plan-card">
                <div className="bg" style={{ backgroundImage: `url(${ASSETS}/${card.img})` }}></div>
                <span className="pill">{card.pill}</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
                <span className="arrow">{card.arrow} <Arrow /></span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* EDITOR'S PICKS */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <div className="titles">
              <div className="kicker">Editor&apos;s picks</div>
              <h2>The 30 best places in Pattaya</h2>
              <p>Hand-picked by our editorial team. Every place visited in person, photographed by us, re-checked weekly.</p>
            </div>
            <a href="/map" className="viewall">View all 30 <Arrow /></a>
          </div>
          <div className="carousel-wrap">
            <CarButton target="topCar" dir={-1} label="Previous" />
            <CarButton target="topCar" dir={1} label="Next" />
            <div className="carousel" id="topCar">
              {topVenues.map(v => <VenueCard key={v.id} v={v} />)}
            </div>
          </div>
        </div>
      </section>

      {/* EXTREME / ADRENALINE */}
      <section className="section extreme" id="adventure">
        <div className="container">
          <div className="sec-head">
            <div className="titles">
              <div className="kicker">For the adrenaline-hungry</div>
              <h2>Adrenaline &amp; adventure</h2>
              <p>Sky dives, paramotors, jet skis, PADI courses and bungee — every operator licensed in Thailand and re-checked every 30 days for safety standards.</p>
            </div>
            <a href="/things-to-do" className="viewall">All adventures <Arrow /></a>
          </div>
          <div className="carousel-wrap">
            <CarButton target="extremeCar" dir={-1} label="Previous" />
            <CarButton target="extremeCar" dir={1} label="Next" />
            <div className="carousel" id="extremeCar">
              {adventureVenues.map(v => <VenueCard key={v.id} v={v} dark />)}
            </div>
          </div>
        </div>
      </section>

      {/* DISTRICTS */}
      <section className="section districts" id="districts">
        <div className="container">
          <div className="sec-head">
            <div className="titles">
              <div className="kicker">Neighborhoods</div>
              <h2>Pick your district</h2>
              <p>Pattaya is five very different cities in one. Each district has its own pace, prices and personality — pick yours before you book.</p>
            </div>
            <Link href="/map" className="viewall">Open the map <Arrow /></Link>
          </div>
          <div className="dist-grid" translate="no">
            {districts.map(d => (
              <a key={d.name} href={d.href} className={`dist ${d.cls}`}>
                <div className="dist-bg" style={{ backgroundImage: `url(${ASSETS}/${d.img})` }}></div>
                <div className="dist-content">
                  <span className="pill pill-glass">{d.pill}</span>
                  <h3>{d.name}</h3>
                  <p>{d.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* MAP PREVIEW */}
      <section className="section" id="map">
        <div className="container">
          <div className="sec-head">
            <div className="titles">
              <div className="kicker">Interactive map</div>
              <h2>Every place. One map.</h2>
              <p>Filter by category or district. Save areas before you fly. See exactly which neighborhood each guide is in.</p>
            </div>
          </div>
          <ExploreMap />
          <div style={{ marginTop: 'var(--s4)' }}>
            <Link href="/map" className="btn btn-primary btn-sm">Open full map <Arrow /></Link>
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="section blog" id="blog">
        <div className="container">
          <div className="sec-head">
            <div className="titles">
              <div className="kicker">From the blog</div>
              <h2>50+ in-depth Pattaya guides</h2>
              <p>Long-form articles covering itineraries, food, transport, neighborhoods and seasonal updates. No fluff, no AI rewrites, no affiliate-driven lists.</p>
            </div>
            <Link href="/blog" className="viewall">All articles <Arrow /></Link>
          </div>
          <div className="blog-grid">
            {blogPosts.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="post">
                <div className="ph" style={{ backgroundImage: post.hero_image ? `url(${post.hero_image})` : 'var(--grad-brand)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <span className="pill pill-white">{post.category}</span>
                </div>
                <div className="pb">
                  <div className="pmeta">
                    <span>{new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <i></i>
                    <span>{post.read_time} min read</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p className="excerpt">{post.description}</p>
                  <div className="author">
                    <div className="av">{post.author?.split(' ').map((n: string) => n[0]).join('')}</div>
                    <div><b>{post.author}</b></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S INSIDE — trust block */}
      <section className="section trust">
        <div className="container">
          <div className="sec-head" style={{ justifyContent: 'center', textAlign: 'center' }}>
            <div className="titles" style={{ textAlign: 'center', margin: '0 auto' }}>
              <div className="kicker">What&apos;s inside</div>
              <h2>Everything you need to plan a Pattaya trip.</h2>
              <p style={{ margin: '8px auto 0', maxWidth: '58ch' }}>From the first &quot;when should I go&quot; to the last &quot;how do I get back to Bangkok&quot; — Go To Pattaya covers it. Free, no signup, no popups.</p>
            </div>
          </div>
          <div className="trust-grid">
            <div className="trust-card">
              <div className="ic"><Icon name="pin" size={28} /></div>
              <h3>600+ places, one map</h3>
              <p>Restaurants, beaches, attractions, wellness, sports and markets — all in one searchable directory with real prices, real photos and an interactive map.</p>
            </div>
            <div className="trust-card">
              <div className="ic"><Icon name="book" size={28} /></div>
              <h3>50+ in-depth guides</h3>
              <p>Long-form articles for first-timers and returning visitors: when to go, where to stay, how to get around, what to eat. Built to answer real questions, not to chase keywords.</p>
            </div>
            <div className="trust-card">
              <div className="ic"><Icon name="open-now" size={28} /></div>
              <h3>Free, no signup, no ads</h3>
              <p>Use everything without an account. No popups, no email-gates, no &quot;register to see prices&quot; tricks. We don&apos;t run paid placements and don&apos;t dress ads up as reviews.</p>
            </div>
          </div>
        </div>
      </section>

      {/* EBOOK LEAD MAGNET */}
      <section className="ebook">
        <div className="container ebook-inner">
          <div className="ebook-cover">
            <div className="book" aria-hidden="true">
              <span className="b-tag">FREE PDF</span>
              <span className="b-k">Go To Pattaya</span>
              <h3>The 7-Day<br />Pattaya<br />Itinerary</h3>
              <div className="b-d"></div>
              <span className="b-f">Day-by-day plans · 2026 edition</span>
            </div>
          </div>
          <div className="ebook-content">
            <span className="kick"><Icon name="book" size={15} /> Free travel ebook</span>
            <h2>Get the free <em>7-day Pattaya</em> itinerary.</h2>
            <p className="lede">Detailed, day-by-day plans — where to eat, what to see and exactly how to get around. Learn Pattaya the smart way, from people who actually live here.</p>
            <ul className="ebook-bullets">
              <li><Icon name="check" size={14} /> 7 days mapped hour by hour</li>
              <li><Icon name="check" size={14} /> Real local prices &amp; travel times</li>
              <li><Icon name="check" size={14} /> Offline-ready PDF</li>
            </ul>
            <form className="ebook-form">
              <input type="email" placeholder="your@email.com" aria-label="Email address" required />
              <button type="submit">Send me the guide <Arrow /></button>
            </form>
            <div className="ebook-micro">
              <span><Icon name="check" size={14} /> 12,400+ travelers</span>
              <span><Icon name="check" size={14} /> No spam</span>
              <span><Icon name="check" size={14} /> 1-click unsubscribe</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
