import { supabase } from '@/lib/supabase'
import Link from '@/app/components/LocaleLink'
import Icon from '@/app/components/Icon'
import CarButton from '@/app/components/CarButton'
import HeroSearch from '@/app/components/HeroSearch'
import ExploreMap from '@/app/components/ExploreMap'
import DailyDealPopup, { type Deal } from '@/app/components/DailyDealPopup'
import Star from '@/app/components/Star'
import type { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { hasLocale } from '@/lib/i18n/config'
import { translateMany, getTranslated } from '@/lib/i18n/translateContent'
import { cardImg, tileImg } from '@/lib/img'

const ASSETS = 'https://cdn.gotopattaya.com/Assets'

// Locale-aware canonical so /en and /ru each self-canonicalize (the root layout's
// default '/' would otherwise point both to the unprefixed root -> /en, dropping
// the Russian homepage from the index). Title/description inherit from the root.
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang : 'en'
  return { alternates: { canonical: `/${locale}` } }
}

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

const VCARD_COLS = 'id, slug, name, rating, review_count, venue_type, price_range, price_from, address, image_url, categories(name_en, slug)'

// Return the curated venues in the given slug order (filters out any missing).
async function bySlugs(slugs: string[]): Promise<Venue[]> {
  const { data } = await supabase.from('venues').select(VCARD_COLS).in('slug', slugs).eq('is_active', true)
  const rows = (data || []) as unknown as Venue[]
  return slugs.map((s) => rows.find((r) => r.slug === s)).filter(Boolean) as Venue[]
}

// Active "venue of the day" for the homepage popup. Returns null when there's no
// active deal (or the table isn't set up yet), so the homepage never breaks.
async function getDailyDeal(): Promise<Deal | null> {
  const { data, error } = await supabase
    .from('daily_deal')
    .select('label, active, venue:venues(slug, name, image_url, rating, review_count, venue_type, categories(name_en))')
    .eq('active', true)
    .maybeSingle()
  const v = (data as { label: string | null; venue: Record<string, unknown> | null } | null)?.venue
  if (error || !data || !v) return null
  const cats = v.categories as { name_en: string } | null
  return {
    slug: v.slug as string,
    name: v.name as string,
    image_url: (v.image_url as string) ?? null,
    rating: (v.rating as number) ?? null,
    review_count: (v.review_count as number) ?? null,
    venue_type: (v.venue_type as string) ?? null,
    category: cats?.name_en ?? null,
    label: (data as { label: string | null }).label ?? null,
  }
}

// Editor's Picks - "The best places in Pattaya", curated order (iconic
// landmarks first, then category best-of).
const EDITOR_PICKS_SLUGS = [
  'sanctuary-of-truth',
  'nong-nooch-tropical-garden',
  'pattaya-coral-island-sea-tours',
  'ramayana-water-park',
  'big-buddha-hill-wat-phra-yai',
  'khao-chi-chan-buddha-mountain',
  'living-green-elephant-sanctuary',
  'art-in-paradise-pattaya',
  'frost-magical-ice-of-siam',
  'tiffanys-show-pattaya',
]
async function getTopVenues() { return bySlugs(EDITOR_PICKS_SLUGS) }

// Adrenaline & adventure - curated air/land/water mix.
const ADVENTURE_SLUGS = [
  'thai-sky-adventures',
  'skydive-pattaya',
  'u-fly-vertical-wind-tunnel',
  'xbungy-pattaya-bungy-jump',
  'enduro-madness-pattaya',
  'flight-of-the-gibbon-chonburi',
  'pattaya-skyride',
  'parasailing-koh-larn',
  'pattaya-kart-speedway',
  'ramayana-water-park',
]
async function getAdventureVenues() { return bySlugs(ADVENTURE_SLUGS) }

// Curated homepage blog strip - 6 posts across the funnel (decide → plan →
// do → stay → eat → culture), in this exact order.
const HOMEPAGE_BLOG_SLUGS = [
  'is-pattaya-worth-visiting',
  'first-time-pattaya',
  'things-to-do-pattaya',
  'where-to-stay-in-pattaya',
  'best-restaurants-pattaya',
  'sanctuary-of-truth-pattaya',
]

async function getBlogPosts(): Promise<BlogPost[]> {
  const { data } = await supabase
    .from('blog_posts')
    .select('id, slug, title, description, author, published_at, category, hero_image, read_time')
    .in('slug', HOMEPAGE_BLOG_SLUGS)
    .eq('is_published', true)
  const rows = (data || []) as BlogPost[]
  // Keep the curated order (the `.in` query returns them unordered).
  return HOMEPAGE_BLOG_SLUGS.map((s) => rows.find((r) => r.slug === s)).filter(Boolean) as BlogPost[]
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
  { img: 'Koh-Sak.webp', pill: 'When to visit', href: '/blog/best-time-to-visit-pattaya', title: 'Best months for Pattaya', text: "Weather, crowds, prices - month by month, with the months we'd actually go.", arrow: 'Read the guide' },
  { img: 'pattaya-city-beach-1.webp', pill: 'Getting there', href: '/blog/bangkok-to-pattaya', title: 'Bangkok → Pattaya', text: 'Bus, taxi, train or private transfer - real prices, real travel times, no markup tricks.', arrow: 'Compare options' },
  { img: 'coral-island-pattaya-2.webp', pill: 'Where to stay', href: '/areas', title: 'Pick the right district', text: 'Central, Jomtien, Pratumnak, Naklua - choose your area before you book. Includes streets to avoid.', arrow: 'Compare districts' },
  { img: 'pattaya-floating-market.webp', pill: 'First-time tips', href: '/blog/first-time-pattaya-mistakes', title: '8 mistakes to skip', text: 'From baht-bus etiquette to which beach to avoid - the things first-timers always regret.', arrow: 'Read the guide' },
]

const districts = [
  { cls: 'dist-1', img: 'pattaya-night-clubs-1.webp', pill: 'Most central', name: 'Central Pattaya', href: '/areas/central-pattaya', desc: 'Beach Road, Walking Street, Soi Buakhao - the busy, loud, never-sleeping heart of the city.' },
  { cls: '', img: 'pattaya-city-beach-2.webp', pill: 'Calm & clean', name: 'Jomtien', href: '/areas/jomtien', desc: 'Longer, quieter beach. Best for families and longer stays.' },
  { cls: '', img: 'best-island-pattaya.webp', pill: 'Views & sunsets', name: 'Pratumnak Hill', href: '/areas/pratumnak-hill', desc: 'Quiet hill between Central & Jomtien. Rooftops, viewpoints, walkable.' },
  { cls: '', img: 'pattaya-buddhist-pagoda-golden.webp', pill: 'Local feel', name: 'Naklua', href: '/areas/naklua', desc: 'Northern fishing village vibe. Real Thai seafood and Sanctuary of Truth.' },
  { cls: '', img: 'Coral-Island-pattaya.webp', pill: 'Day trip', name: 'Koh Larn Island', href: '/areas/islands', desc: '40 minutes by ferry. White-sand beaches and snorkel coves.' },
]


const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
)

function VenueCard({ v, dark = false, tt = (s) => s }: { v: Venue; dark?: boolean; tt?: (s: string | null | undefined) => string | null | undefined }) {
  return (
    <Link href={`/venues/${v.slug}`} className="place">
      <div className="ph" style={{ backgroundImage: v.image_url ? `url(${cardImg(v.image_url)})` : 'var(--grad-brand)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <span className="tagpill">{tt(v.categories?.name_en || v.venue_type)}</span>
      </div>
      <div className="pb">
        <h4>{v.name}</h4>
        <div className="meta"><span>{tt(v.venue_type)}</span>{v.address && <span>· {v.address.slice(0, 25)}</span>}</div>
        <div className="rate">
          <div className="left"><Star /> {v.rating?.toFixed(1)} {v.review_count != null && <span className="count">({v.review_count.toLocaleString()})</span>}</div>
          {(v.price_from != null || v.price_range) && <span className="price">{v.price_from != null ? `from ฿${v.price_from.toLocaleString()}` : v.price_range}</span>}
        </div>
      </div>
    </Link>
  )
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang : 'en'
  const [dict, [topVenues, adventureVenues, blogPosts, deal]] = await Promise.all([
    getDictionary(locale),
    Promise.all([getTopVenues(), getAdventureVenues(), getBlogPosts(), getDailyDeal()]),
  ])
  const t = (s: string) => dict?.[s] ?? s

  // Translate DB card labels (venue_type + category). Venue NAMES stay Latin
  // (proper nouns). Repeated types are translated once and shared via the map.
  const cardVenues = [...topVenues, ...adventureVenues]
  const [typeMap, catMap] = await Promise.all([
    translateMany('venue_types', 'label', [...cardVenues.map((v) => v.venue_type), deal?.venue_type], locale),
    translateMany('categories', 'name_en', [...cardVenues.map((v) => v.categories?.name_en), deal?.category], locale),
  ])
  const tt = (s: string | null | undefined) => (s ? (typeMap.get(s) ?? catMap.get(s) ?? s) : s)
  const dealTr = deal ? { ...deal, venue_type: tt(deal.venue_type) ?? deal.venue_type, category: tt(deal.category) ?? deal.category } : null

  // Homepage blog cards: translate title/description (already cached from the
  // blog pages, so /ru shows Russian even without new API calls) plus the
  // category pill. Falls back to English gracefully if a value isn't cached yet.
  const blogTr = await Promise.all(
    blogPosts.map(async (p) => ({
      title: await getTranslated('blog_posts', p.id, 'title', p.title, locale),
      description: await getTranslated('blog_posts', p.id, 'description', p.description, locale),
    })),
  )
  // Category "tags" are a small fixed set → translate via the dictionary (t),
  // so they're instant and don't need the translation API.

  return (
    <>
      {dealTr && <DailyDealPopup deal={dealTr} dict={dict} />}
      {/* Preload the LCP hero background (a CSS background-image the browser
          would otherwise only discover after CSS parses). */}
      <link rel="preload" as="image" href={`${ASSETS}/hero-pattaya-1600.webp`} media="(min-width:769px)" fetchPriority="high" />
      <link rel="preload" as="image" href={`${ASSETS}/hero-pattaya-800.webp`} media="(max-width:768px)" fetchPriority="high" />
      {/* HERO */}
      <section className="hero">
        <div className="hero-media">
          <div className="hero-bg"></div>
          <div className="hero-overlay"></div>
        </div>
        <div className="container hero-inner">
          <h1>{t('Your complete guide')}<br /><span>{t('to Pattaya.')}</span></h1>
          <p className="intro">{t('Restaurants, beaches, attractions, day trips, wellness, sports - 500+ places and 50+ in-depth guides. Plan your trip in 5 minutes.')}</p>

          <HeroSearch dict={dict} />

          <Link href="/plan" className="hero-ai-cta" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.85rem', fontSize: '0.9rem', fontWeight: 600, color: '#fff', textDecoration: 'none' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v2m0 14v2M5 12H3m18 0h-2M6.3 6.3 4.9 4.9m12.8 1.4 1.4-1.4M6.3 17.7l-1.4 1.4m12.8-1.4 1.4 1.4" /><circle cx="12" cy="12" r="4" /></svg>
            <span>{t('New')}: <u style={{ textUnderlineOffset: '3px' }}>{t('Plan your trip with AI →')}</u></span>
          </Link>

          <div className="hero-tags" role="list">
            <a href="#cats" className="qtag" role="listitem"><Icon name="eat" size={14} /> {t('Eat')}</a>
            <a href="#cats" className="qtag" role="listitem"><Icon name="beach" size={14} /> {t('Beaches')}</a>
            <a href="#cats" className="qtag" role="listitem"><Icon name="tours" size={14} /> {t('Tours')}</a>
            <a href="#cats" className="qtag" role="listitem"><Icon name="wellness" size={14} /> {t('Wellness')}</a>
            <a href="#plan" className="qtag" role="listitem"><Icon name="calendar" size={14} /> {t('First-time visitor')}</a>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section cats" id="cats">
        <div className="container">
          <div className="sec-head">
            <div className="titles">
              <div className="kicker">{t('Browse Pattaya')}</div>
              <h2>{t('Six categories. Every kind of day.')}</h2>
              <p>{t('Six categories cover every kind of day in Pattaya. Re-checked weekly - if a place closes or changes, the page updates within days.')}</p>
            </div>
            <a href="/map" className="viewall">{t('All categories')} <Arrow /></a>
          </div>
          <div className="cats-grid">
            {categories.map(cat => (
              <Link key={cat.name} href={cat.href} className={`cat${cat.feat ? ' cat-feat' : ''}`}>
                <div className="bg" style={{ backgroundImage: `url(${tileImg(`${ASSETS}/${cat.img}`)})` }}></div>
                <div className="cat-ic"><Icon name={cat.icon} size={22} style={{ color: '#fff' }} /></div>
                <b>{t(cat.name)}</b>
                <div className="meta">{t(cat.meta)}</div>
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
              <div className="kicker">{t('Plan your Pattaya trip')}</div>
              <h2>{t("Start here if you're visiting Pattaya.")}</h2>
              <p>{t('Four detailed guides covering the questions every first-time visitor asks before booking - month, transport, district and the small things that catch people out.')}</p>
            </div>
            <a href="/plan-my-trip" className="viewall">{t('All planning guides')} <Arrow /></a>
          </div>
          <div className="plan-grid">
            {planCards.map(card => (
              <a key={card.title} href={card.href} className="plan-card">
                <div className="bg" style={{ backgroundImage: `url(${tileImg(`${ASSETS}/${card.img}`)})` }}></div>
                <span className="pill">{t(card.pill)}</span>
                <h3>{t(card.title)}</h3>
                <p>{t(card.text)}</p>
                <span className="arrow">{t(card.arrow)} <Arrow /></span>
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
              <div className="kicker">{t("Editor's picks")}</div>
              <h2>{t('The 10 best places in Pattaya')}</h2>
              <p>{t('Hand-picked by our editorial team. Every place visited in person, photographed by us, re-checked weekly.')}</p>
            </div>
            <a href="/map" className="viewall">{t('View all places')} <Arrow /></a>
          </div>
          <div className="carousel-wrap">
            <CarButton target="topCar" dir={-1} label="Previous" />
            <CarButton target="topCar" dir={1} label="Next" />
            <div className="carousel" id="topCar">
              {topVenues.map(v => <VenueCard key={v.id} v={v} tt={tt} />)}
            </div>
          </div>
        </div>
      </section>

      {/* EXTREME / ADRENALINE */}
      <section className="section extreme" id="adventure">
        <div className="container">
          <div className="sec-head">
            <div className="titles">
              <div className="kicker">{t('For the adrenaline-hungry')}</div>
              <h2>{t('Adrenaline & adventure')}</h2>
              <p>{t('Sky dives, paramotors, jet skis, PADI courses and bungee - every operator licensed in Thailand and re-checked every 30 days for safety standards.')}</p>
            </div>
            <a href="/things-to-do" className="viewall">{t('All adventures')} <Arrow /></a>
          </div>
          <div className="carousel-wrap">
            <CarButton target="extremeCar" dir={-1} label="Previous" />
            <CarButton target="extremeCar" dir={1} label="Next" />
            <div className="carousel" id="extremeCar">
              {adventureVenues.map(v => <VenueCard key={v.id} v={v} dark tt={tt} />)}
            </div>
          </div>
        </div>
      </section>

      {/* DISTRICTS */}
      <section className="section districts" id="districts">
        <div className="container">
          <div className="sec-head">
            <div className="titles">
              <div className="kicker">{t('Neighborhoods')}</div>
              <h2>{t('Pick your district')}</h2>
              <p>{t('Pattaya is five very different cities in one. Each district has its own pace, prices and personality - pick yours before you book.')}</p>
            </div>
            <Link href="/map" className="viewall">{t('Open the map')} <Arrow /></Link>
          </div>
          <div className="dist-grid">
            {districts.map(d => (
              <a key={d.name} href={d.href} className={`dist ${d.cls}`}>
                <div className="dist-bg" style={{ backgroundImage: `url(${tileImg(`${ASSETS}/${d.img}`)})` }}></div>
                <div className="dist-content">
                  <span className="pill pill-glass">{t(d.pill)}</span>
                  <h3>{t(d.name)}</h3>
                  <p>{t(d.desc)}</p>
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
              <div className="kicker">{t('Interactive map')}</div>
              <h2>{t('Every place. One map.')}</h2>
              <p>{t('Filter by category or district. Save areas before you fly. See exactly which neighborhood each guide is in.')}</p>
            </div>
          </div>
          <ExploreMap dict={dict} locale={locale} />
          <div style={{ marginTop: 'var(--s4)' }}>
            <Link href="/map" className="btn btn-primary btn-sm">{t('Open full map')} <Arrow /></Link>
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="section blog" id="blog">
        <div className="container">
          <div className="sec-head">
            <div className="titles">
              <div className="kicker">{t('From the blog')}</div>
              <h2>{t('50+ in-depth Pattaya guides')}</h2>
              <p>{t('Long-form articles covering itineraries, food, transport, neighborhoods and seasonal updates. No fluff, no AI rewrites, no affiliate-driven lists.')}</p>
            </div>
            <Link href="/blog" className="viewall">{t('All articles')} <Arrow /></Link>
          </div>
          <div className="blog-grid">
            {blogPosts.map((post, i) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="post">
                <div className="ph" style={{ backgroundImage: post.hero_image ? `url(${tileImg(post.hero_image)})` : 'var(--grad-brand)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <span className="pill pill-white">{t(post.category)}</span>
                </div>
                <div className="pb">
                  <div className="pmeta">
                    <span>{new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <i></i>
                    <span>{post.read_time} {t('min read')}</span>
                  </div>
                  <h3>{blogTr[i].title}</h3>
                  <p className="excerpt">{blogTr[i].description}</p>
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

      {/* WHAT'S INSIDE - trust block */}
      <section className="section trust">
        <div className="container">
          <div className="sec-head" style={{ justifyContent: 'center', textAlign: 'center' }}>
            <div className="titles" style={{ textAlign: 'center', margin: '0 auto' }}>
              <div className="kicker">{t("What's inside")}</div>
              <h2>{t('Everything you need to plan a Pattaya trip.')}</h2>
              <p style={{ margin: '8px auto 0', maxWidth: '58ch' }}>{t('From the first "when should I go" to the last "how do I get back to Bangkok" - Go To Pattaya covers it. Free, no signup, no popups.')}</p>
            </div>
          </div>
          <div className="trust-grid">
            <div className="trust-card">
              <div className="ic"><Icon name="pin" size={28} /></div>
              <h3>{t('500+ places, one map')}</h3>
              <p>{t('Restaurants, beaches, attractions, wellness, sports and markets - all in one searchable directory with real prices, real photos and an interactive map.')}</p>
            </div>
            <div className="trust-card">
              <div className="ic"><Icon name="book" size={28} /></div>
              <h3>{t('50+ in-depth guides')}</h3>
              <p>{t('Long-form articles for first-timers and returning visitors: when to go, where to stay, how to get around, what to eat. Built to answer real questions, not to chase keywords.')}</p>
            </div>
            <div className="trust-card">
              <div className="ic"><Icon name="open-now" size={28} /></div>
              <h3>{t('Free, no signup, no ads')}</h3>
              <p>{t('Use everything without an account. No popups, no email-gates, no "register to see prices" tricks. We don\'t run paid placements and don\'t dress ads up as reviews.')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* EBOOK LEAD MAGNET */}
      <section className="ebook">
        <div className="container ebook-inner">
          <div className="ebook-cover">
            <div className="book" aria-hidden="true">
              <span className="b-tag">{t('FREE PDF')}</span>
              <span className="b-k">Go To Pattaya</span>
              <h3>{t('The 7-Day Pattaya Itinerary')}</h3>
              <div className="b-d"></div>
              <span className="b-f">{t('Day-by-day plans · 2026 edition')}</span>
            </div>
          </div>
          <div className="ebook-content">
            <span className="kick"><Icon name="book" size={15} /> {t('Free travel ebook')}</span>
            <h2>{t('Get the free 7-day Pattaya itinerary.')}</h2>
            <p className="lede">{t('Detailed, day-by-day plans - where to eat, what to see and exactly how to get around. Learn Pattaya the smart way, from people who actually live here.')}</p>
            <ul className="ebook-bullets">
              <li><Icon name="check" size={14} /> {t('7 days mapped hour by hour')}</li>
              <li><Icon name="check" size={14} /> {t('Real local prices & travel times')}</li>
              <li><Icon name="check" size={14} /> {t('Offline-ready PDF')}</li>
            </ul>
            <form className="ebook-form">
              <input type="email" placeholder="your@email.com" aria-label="Email address" required />
              <button type="submit">{t('Send me the guide')} <Arrow /></button>
            </form>
            <div className="ebook-micro">
              <span><Icon name="check" size={14} /> {t('12,400+ travelers')}</span>
              <span><Icon name="check" size={14} /> {t('No spam')}</span>
              <span><Icon name="check" size={14} /> {t('1-click unsubscribe')}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
