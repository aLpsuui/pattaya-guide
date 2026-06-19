import Link from 'next/link'
import Icon from '@/app/components/Icon'

const ASSETS = 'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets'

export const metadata = {
  title: 'About Go To Pattaya — The Honest Local Guide to Pattaya, Thailand',
  description:
    'Who we are and how we work. Go To Pattaya is an independent, locally-run directory of 600+ verified places — no paid placements, updated weekly by editors who actually live in Pattaya.',
  alternates: { canonical: '/about' },
}

const stats = [
  { n: '600+', l: 'Verified places' },
  { n: '50+', l: 'In-depth guides' },
  { n: '9', l: 'Districts mapped' },
  { n: '0', l: 'Paid placements' },
]

const rules = [
  { icon: 'verified', h: 'Verified on the ground', p: "Every venue is visited or re-checked in person by a local editor before it's published." },
  { icon: 'calendar', h: 'Updated weekly', p: 'Hours, prices and openings change fast here. We re-verify the directory every single week.' },
  { icon: 'editors-pick', h: 'No pay-to-play', p: "Rankings can't be bought. Sponsored content is always labelled and never affects a rating." },
  { icon: 'local-verified', h: 'Written by locals', p: 'Editors who live in Pattaya — fluent in the food, the seasons, and the scams to skip.' },
]

const team = [
  { av: 'OV', name: 'Olga Vavilova', role: 'Editor · Wellness & Community', bio: "Covers spas, yoga and Pattaya's Russian-speaking community. 6 years local." },
  { av: 'NS', name: 'Niran "Nine" Sukjai', role: 'Local Editor · Food & Nightlife', bio: 'Born in Chonburi. Knows every street-food soi and rooftop bar worth your baht.' },
  { av: 'JC', name: 'James Carter', role: 'Editor · Things to Do', bio: "Tests the tours, islands and dive trips so the listings reflect what you'll actually get." },
]

const Arrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
)

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* HERO */}
      <section className="page-hero">
        <div className="container inner">
          <nav className="crumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            <span className="cur">About</span>
          </nav>
          <div className="kicker" style={{ marginTop: 'var(--s3)' }}>Who we are</div>
          <h1>The honest local guide to Pattaya.</h1>
          <p className="lead">Go To Pattaya is an independent directory built by people who actually live here. We verify every place on the ground, update weekly, and never accept money to rank a venue higher. Just the real Pattaya — clearly mapped.</p>
          <div className="row" style={{ marginTop: 'var(--s4)', flexWrap: 'wrap' }}>
            <Link href="/plan-my-trip" className="btn btn-primary">Plan my trip</Link>
            <Link href="/eat-and-drinks" className="btn btn-secondary">Browse all places</Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section bleed">
        <div className="container">
          <div className="stat-band">
            {stats.map(s => (
              <div key={s.l} className="stat"><b>{s.n}</b><span>{s.l}</span></div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="section">
        <div className="container split">
          <div className="prose">
            <div className="kicker">Our story</div>
            <h2>Built in Pattaya, for everyone who visits it.</h2>
            <p>Pattaya is one of the most visited cities in the world — and one of the hardest to navigate honestly. Most &quot;top 10&quot; lists are paid, outdated, or written by people who have never set foot here.</p>
            <p>We started Go To Pattaya to fix that. Our editors live across Central Pattaya, Jomtien and Naklua. We eat at the restaurants, take the tours, and sit in the cafés before a single one of them goes on the site.</p>
            <p>If a place slips — prices jump, quality drops, it closes — we update it. The guide you read today reflects the Pattaya of <strong>this week</strong>, not last year.</p>
            <Link href="/blog" className="viewall">Read our latest guides <Arrow /></Link>
          </div>
          <div className="media"><img src={`${ASSETS}/pattaya-city-beach-1.jpg`} alt="Pattaya city beach and bay seen from above at daytime" loading="lazy" /></div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="section bleed-sunken">
        <div className="container">
          <div className="sec-head">
            <div className="titles">
              <div className="kicker">How we work</div>
              <h2>Four rules we never break</h2>
              <p>The standards behind every listing, rating and recommendation on Go To Pattaya.</p>
            </div>
          </div>
          <div className="grid g4">
            {rules.map(r => (
              <article key={r.h} className="feature">
                <div className="fic"><Icon name={r.icon} size={24} /></div>
                <h3>{r.h}</h3>
                <p>{r.p}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <div className="titles">
              <div className="kicker">The editors</div>
              <h2>Real people, on the ground</h2>
              <p>A small, multilingual team covering food, wellness, nightlife and things to do.</p>
            </div>
          </div>
          <div className="grid g3">
            {team.map(t => (
              <div key={t.name} className="author">
                <div className="ava">{t.av}</div>
                <div className="who">
                  <b>{t.name}</b>
                  <span className="role">{t.role}</span>
                  <p>{t.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROMISE */}
      <section className="section bleed">
        <div className="container split">
          <div className="media"><img src={`${ASSETS}/pattaya-temputre.webp`} alt="Golden Buddhist temple detail in Pattaya, Thailand" loading="lazy" /></div>
          <div className="prose">
            <div className="kicker">Our promise</div>
            <h2>If it&apos;s on Go To Pattaya, we&apos;d send our own friends there.</h2>
            <ul>
              <li>We label every partnership and affiliate link — clearly.</li>
              <li>We remove places that decline quietly, no exceptions.</li>
              <li>We answer corrections from readers and owners within 2 business days.</li>
              <li>We keep the core guide free, with no signup wall.</li>
            </ul>
            <Link href="/blog" className="viewall">Found something off? Tell us <Arrow /></Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-band">
            <div className="kicker">Ready when you are</div>
            <h2>Start planning your Pattaya trip</h2>
            <p>Tell us your dates and interests and we&apos;ll build a day-by-day itinerary from verified places — free, no signup.</p>
            <div className="row" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/plan-my-trip" className="btn btn-primary">Plan my trip</Link>
              <Link href="/blog" className="btn btn-secondary">Read the blog</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
