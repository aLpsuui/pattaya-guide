import Link from 'next/link'
import Icon from '@/app/components/Icon'
import PlanForm from './PlanForm'

export const metadata = {
  title: 'Plan My Trip to Pattaya — Build a Custom Itinerary | Go To Pattaya',
  description:
    'Tell us your dates, interests and pace and get a custom Pattaya itinerary built from 600+ verified places — day by day, free and with no signup.',
}

const perks = [
  { icon: 'verified', h: 'Verified places only', p: 'Every stop is a real, in-person-checked venue from our 600+ directory.' },
  { icon: 'route', h: 'Smart by area', p: "We group your days by district so you're not crossing the city twice." },
  { icon: 'card', h: 'Matched to budget', p: 'From street-food days to premium nights — your plan respects your spend.' },
]

const days = [
  {
    n: '1', title: 'Arrival & the beach', sub: 'Central Pattaya · easy pace',
    items: [
      { t: '10:00', b: 'Coffee at Nitan Roasters', d: 'Specialty coffee in Pratumnak to start slow.' },
      { t: '12:30', b: 'Lunch at Bali Hai Seafood', d: 'Beachfront seafood by the pier.' },
      { t: '15:00', b: 'Pattaya Beach walk', d: 'Sunbeds, swim and people-watching.' },
      { t: '19:00', b: 'Sunset rooftop dinner', d: 'Drinks above Beach Road as the lights come on.' },
    ],
  },
  {
    n: '2', title: 'Islands & culture', sub: 'Koh Larn + Naklua',
    items: [
      { t: '08:30', b: 'Ferry to Koh Larn', d: 'Snorkel and lunch on Coral Island.' },
      { t: '15:30', b: 'Sanctuary of Truth', d: 'All-teak carved temple on the cape.' },
      { t: '19:30', b: 'Naklua seafood market', d: 'Pick your catch, grilled to order.' },
    ],
  },
  {
    n: '3', title: 'Reset & go', sub: 'Wellness day',
    items: [
      { t: '10:00', b: 'Yunomori Onsen & Spa', d: 'Japanese onsen + Thai massage.' },
      { t: '13:00', b: 'Yoga at Gaya Wellness', d: 'Drop-in class with a sea breeze.' },
      { t: '16:00', b: 'Last coffee & souvenirs', d: 'Central Festival before departure.' },
    ],
  },
]

export default function PlanMyTripPage() {
  return (
    <div className="plan-page">
      {/* HERO */}
      <section className="page-hero page-hero--dark">
        <div className="container inner">
          <nav className="crumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            <span className="cur">Plan My Trip</span>
          </nav>
          <div className="kicker" style={{ marginTop: 'var(--s3)' }}>Free trip planner</div>
          <h1>Build your perfect Pattaya itinerary</h1>
          <p className="lead">Answer a few questions and we&apos;ll put together a day-by-day plan from verified places — matched to your dates, interests and pace. No signup, no spam.</p>
        </div>
      </section>

      {/* FORM */}
      <section className="section">
        <div className="container form-layout">
          <PlanForm />
          <aside className="stack-4">
            {perks.map(p => (
              <div key={p.h} className="feature">
                <div className="fic"><Icon name={p.icon} size={24} /></div>
                <h3>{p.h}</h3>
                <p>{p.p}</p>
              </div>
            ))}
          </aside>
        </div>
      </section>

      {/* SAMPLE PLAN */}
      <section className="section bleed-sunken">
        <div className="container">
          <div className="sec-head">
            <div className="titles">
              <div className="kicker">Need inspiration?</div>
              <h2>A sample 3-day Pattaya plan</h2>
              <p>Here&apos;s what a balanced first trip can look like — yours is tailored to your answers above.</p>
            </div>
          </div>
          <div className="grid g3">
            {days.map(day => (
              <div key={day.n} className="day">
                <div className="dh">
                  <span className="n">{day.n}</span>
                  <div><b>{day.title}</b><br /><span>{day.sub}</span></div>
                </div>
                <ul className="dl">
                  {day.items.map(it => (
                    <li key={it.t}>
                      <span className="t">{it.t}</span>
                      <span className="d"><b>{it.b}</b><span>{it.d}</span></span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-band">
            <div className="kicker">Already know what you love?</div>
            <h2>Start from your saved places</h2>
            <p>Heart the spots you like as you browse, and we&apos;ll build the itinerary around them.</p>
            <div className="row" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/eat-and-drinks" className="btn btn-primary">Browse places</Link>
              <Link href="/blog" className="btn btn-secondary">Read the blog</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
