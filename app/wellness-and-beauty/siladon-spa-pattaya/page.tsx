import './venue.css'
import BlogScript from '@/app/components/BlogScript'

export const metadata = {
  title: 'Siladon Spa Pattaya — Naklua Day Spa with Promo Packages | Go To Pattaya',
  description:
    'Siladon Spa Pattaya in Naklua — a professional, couple- and family-friendly day spa using natural local products, with tiered 2–5 hour signature packages and big flash-sale promos. Menu and directions.',
  alternates: { canonical: '/wellness-and-beauty/siladon-spa-pattaya' },
}

// Swap these for the real venue images when available.
const A = 'https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/'

const HTML = String.raw`
<svg aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">
  <symbol id="pg-wellness" viewBox="0 0 24 24"><path d="M12 17C10 14.5 10 9.5 12 7c2 2.5 2 7.5 0 10z"/><path d="M12 17C9 16 6 14.5 5.5 11.5 8.5 11.8 11 13.5 12 17z"/><path d="M12 17c3-1 6-2.5 6.5-5.5C15.5 11.8 13 13.5 12 17z"/><path d="M5 18.6c2.4 1.3 11.6 1.3 14 0"/></symbol>
  <symbol id="pg-massage" viewBox="0 0 24 24"><ellipse cx="12" cy="7.5" rx="6" ry="2.3"/><ellipse cx="12" cy="12.5" rx="5" ry="2.1"/><ellipse cx="12" cy="17.3" rx="4" ry="2"/></symbol>
  <symbol id="pg-star" viewBox="0 0 24 24"><path d="M12 2.6 14.85 8.4 21.2 9.3l-4.6 4.4 1.1 6.3L12 17.4 6.3 20l1.1-6.3-4.6-4.4 6.35-.9z"/></symbol>
  <symbol id="pg-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></symbol>
  <symbol id="pg-pin" viewBox="0 0 24 24"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></symbol>
  <symbol id="pg-near-me" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="2.1" fill="currentColor" stroke="none"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M2 12h3"/><path d="M19 12h3"/></symbol>
  <symbol id="pg-directions" viewBox="0 0 24 24"><path d="M21 3 3 10.5l7.5 2.8 2.8 7.5z"/><path d="m21 3-10.7 10.3"/></symbol>
  <symbol id="pg-phone" viewBox="0 0 24 24"><path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5z"/></symbol>
  <symbol id="pg-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.6 2.5 4 5.7 4 9s-1.4 6.5-4 9c-2.6-2.5-4-5.7-4-9s1.4-6.5 4-9z"/></symbol>
  <symbol id="pg-calendar" viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M3.5 9.5h17"/><path d="M8 3v4"/><path d="M16 3v4"/></symbol>
  <symbol id="pg-air-con" viewBox="0 0 24 24"><path d="M12 3v18"/><path d="M4.5 7.5 19.5 16.5"/><path d="M19.5 7.5 4.5 16.5"/><path d="m9.8 5.2 2.2-2 2.2 2"/><path d="m9.8 18.8 2.2 2 2.2-2"/><path d="m4.5 10.5-.3-3 2.9.8"/><path d="m19.5 13.5.3 3-2.9-.8"/><path d="m19.5 10.5.3-3-2.9.8"/><path d="m4.5 13.5-.3 3 2.9-.8"/></symbol>
  <symbol id="pg-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.3"/><path d="M12 2v2.4"/><path d="M12 19.6V22"/><path d="m4.4 4.4 1.7 1.7"/><path d="m17.9 17.9 1.7 1.7"/><path d="M2 12h2.4"/><path d="M19.6 12H22"/><path d="m4.4 19.6 1.7-1.7"/><path d="m17.9 6.1 1.7-1.7"/></symbol>
  <symbol id="pg-check" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7"/></symbol>
  <symbol id="pg-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="8" r=".8" fill="currentColor" stroke="none"/></symbol>
  <symbol id="pg-local-verified" viewBox="0 0 24 24"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><path d="m9.2 9.9 2 2 3.6-3.8"/></symbol>
  <symbol id="pg-chevron-right" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></symbol>
  <symbol id="pg-arrow-right" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></symbol>
  <symbol id="pg-arrow-left" viewBox="0 0 24 24"><path d="M19 12H5"/><path d="m11 6-6 6 6 6"/></symbol>
  <symbol id="pg-close" viewBox="0 0 24 24"><path d="M6 6l12 12"/><path d="M18 6 6 18"/></symbol>
</svg>

<div class="det-yf">

  <!-- 1 · BREADCRUMB -->
  <nav class="det-yf__wrap det-yf__crumb crumb" aria-label="Breadcrumb">
    <a href="/">Home</a>
    <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-chevron-right"></use></svg>
    <a href="/wellness-and-beauty">Wellness &amp; Beauty</a>
    <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-chevron-right"></use></svg>
    <a href="/wellness-and-beauty">Day Spa</a>
    <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-chevron-right"></use></svg>
    <span class="cur" aria-current="page">Siladon Spa Pattaya</span>
  </nav>

  <!-- 2 · HERO / TITLE -->
  <section class="det-yf__hero" aria-labelledby="det-h1">
    <div class="det-yf__wrap det-yf__hero-inner">
      <div class="det-yf__title">
        <h1 id="det-h1">Siladon Spa Pattaya</h1>
      </div>
      <p class="det-yf__tagline">A professional Naklua day spa — clean, warm and couple- and family-friendly, using natural local Thai products, with tiered 2-to-5-hour packages currently at flash-sale prices.</p>

      <div class="det-yf__meta">
        <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg>4.9 <span class="count">· 902 reviews</span></span>
        <span class="det-yf__metaitem"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-pin"></use></svg> Naklua · Bang Lamung</span>
        <span class="pill pill--success"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-clock"></use></svg> Open daily · check ahead</span>
        <span class="det-yf__verified"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-local-verified"></use></svg> Locally verified</span>
      </div>
    </div>
  </section>

  <!-- 3 · GALLERY -->
  <section class="det-yf__wrap" aria-label="Photo gallery">
    <div class="det-yf__gallery" id="det-gallery">
      <button class="det-yf__gitem det-yf__gitem--hero" type="button" data-lb="0" aria-label="Open photo: Reception lounge at Siladon Spa Pattaya — a spa in Pattaya, Thailand.">
        <img src="${A}pattaya-massage-4.png" alt="Reception lounge at Siladon Spa Pattaya — a spa in Pattaya, Thailand." width="800" height="600">
      </button>
      <button class="det-yf__gitem" type="button" data-lb="1" aria-label="Open photo: Relaxation area at Siladon Spa Pattaya — a spa in Pattaya, Thailand.">
        <img src="${A}pattaya-wellness-1.jpeg" alt="Relaxation area at Siladon Spa Pattaya — a spa in Pattaya, Thailand." loading="lazy" width="400" height="300">
      </button>
      <button class="det-yf__gitem" type="button" data-lb="2" aria-label="Open photo: Spa reception at Siladon Spa Pattaya — a spa in Pattaya, Thailand.">
        <img src="${A}pattaya-massage-2.jpg" alt="Spa reception at Siladon Spa Pattaya — a spa in Pattaya, Thailand." loading="lazy" width="400" height="300">
      </button>
      <button class="det-yf__gitem" type="button" data-lb="3" aria-label="Open photo: Wellness lounge at Siladon Spa Pattaya — a spa in Pattaya, Thailand.">
        <img src="${A}pattaya-wellnes-2.jpg" alt="Wellness lounge at Siladon Spa Pattaya — a spa in Pattaya, Thailand." loading="lazy" width="400" height="300">
      </button>
      <button class="det-yf__gitem det-yf__gitem--hidemobile" type="button" data-lb="4" aria-label="Open photo: Aromatherapy treatment at Siladon Spa Pattaya — a spa in Pattaya, Thailand.">
        <img src="${A}pattaya-massage-1.jpeg" alt="Aromatherapy treatment at Siladon Spa Pattaya — a spa in Pattaya, Thailand." loading="lazy" width="400" height="300">
        <span class="det-yf__gmore" aria-hidden="true">+7 photos</span>
      </button>
    </div>
  </section>

  <!-- 2-COL LAYOUT -->
  <div class="det-yf__wrap det-yf__layout">

    <div class="det-yf__content">

      <!-- 4 · QUICK FACTS -->
      <section aria-labelledby="qf-h">
        <div class="det-yf__sechead">
          <span class="kicker">At a glance</span>
          <h2 id="qf-h">Quick facts</h2>
          <p>The essentials before you book — what Siladon offers and what it costs.</p>
        </div>
        <div class="det-yf__facts">
          <div class="det-yf__fact">
            <svg class="pg-icon is-24" aria-hidden="true"><use href="#pg-star"></use></svg>
            <b>4.9 / 5</b><span>902 reviews</span>
          </div>
          <div class="det-yf__fact">
            <svg class="pg-icon is-24" aria-hidden="true"><use href="#pg-info"></use></svg>
            <b>From ฿450</b><span>Promo foot massage</span>
          </div>
          <div class="det-yf__fact">
            <svg class="pg-icon is-24" aria-hidden="true"><use href="#pg-massage"></use></svg>
            <b>2–5 h packages</b><span>Tiered signatures</span>
          </div>
          <div class="det-yf__fact">
            <svg class="pg-icon is-24" aria-hidden="true"><use href="#pg-check"></use></svg>
            <b>Family-friendly</b><span>Couples &amp; kids</span>
          </div>
        </div>
        <div class="det-yf__styles" aria-label="Treatments offered">
          <span class="pill pill--blue">Thai massage</span>
          <span class="pill pill--blue">Aroma oil</span>
          <span class="pill pill--blue">Herbal ball</span>
          <span class="pill pill--cyan">Body scrub</span>
          <span class="pill pill--cyan">Spa facial</span>
          <span class="pill pill--cyan">Couples room</span>
        </div>
      </section>

      <!-- 5 · MENU -->
      <section aria-labelledby="menu-h">
        <div class="det-yf__sechead">
          <span class="kicker"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-massage"></use></svg> Treatments</span>
          <h2 id="menu-h">À la carte &amp; packages</h2>
          <p>Siladon is currently running an aggressive flash-sale promo across all services — promo prices shown below, with the normal rate in brackets. Promos apply to direct advance bookings.</p>
        </div>
        <div class="det-yf__tt-wrap">
          <table class="det-yf__tt">
            <caption class="visually-hidden">Siladon Spa Pattaya treatment menu and prices</caption>
            <thead>
              <tr><th scope="col">Treatment</th><th scope="col">Duration</th><th scope="col">Price</th></tr>
            </thead>
            <tbody>
              <tr class="det-yf__cat"><td colspan="3">À la carte (1 hour)</td></tr>
              <tr><td><b>Foot Massage</b></td><td class="dur">1 h</td><td class="price">฿450 (800)</td></tr>
              <tr><td><b>Thai Massage</b></td><td class="dur">1 h</td><td class="price">฿550 (800)</td></tr>
              <tr><td>Aroma Oil Massage</td><td class="dur">1 h</td><td class="price">฿650 (1,600)</td></tr>
              <tr><td>Body Scrub</td><td class="dur">1 h</td><td class="price">฿700 (1,400)</td></tr>
              <tr><td>Spa Facial</td><td class="dur">1 h</td><td class="price">฿900 (2,000)</td></tr>
              <tr class="det-yf__cat"><td colspan="3">Packages · 2 hours</td></tr>
              <tr><td><b>Siladon Harmony</b> — foot + aroma oil</td><td class="dur">2 h</td><td class="price">฿1,100 (2,300)</td></tr>
              <tr><td><b>Siladon Unwind</b> — herbal ball + aroma oil</td><td class="dur">2 h</td><td class="price">฿1,200 (2,500)</td></tr>
              <tr><td>Siladon Refresh — scrub + aroma oil</td><td class="dur">2 h</td><td class="price">฿1,300 (2,700)</td></tr>
              <tr class="det-yf__cat"><td colspan="3">Packages · 3–4 hours</td></tr>
              <tr><td><b>Siladon Indulge</b> — foot + herbal ball + aroma oil</td><td class="dur">3 h</td><td class="price">฿1,700 (3,300)</td></tr>
              <tr><td>Siladon Revive — foot + scrub + aroma oil</td><td class="dur">3 h</td><td class="price">฿1,800 (3,500)</td></tr>
              <tr><td>Siladon Voyage — foot + scrub + ball + oil</td><td class="dur">4 h</td><td class="price">฿2,200 (4,300)</td></tr>
              <tr><td>Siladon Royal — foot + scrub + oil + facial</td><td class="dur">4 h</td><td class="price">฿2,400 (4,700)</td></tr>
              <tr class="det-yf__cat"><td colspan="3">Package · 5 hours</td></tr>
              <tr><td><b>Siladon Bliss</b> — foot + scrub + ball + oil + facial</td><td class="dur">5 h</td><td class="price">฿2,800 (5,500)</td></tr>
            </tbody>
          </table>
        </div>
        <div class="det-yf__ttnote alert alert--info" role="note">
          <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-info"></use></svg>
          <span><b>Payment is cash or bank transfer only.</b> Promo prices apply to direct advance bookings; tax is included and tipping is optional.</span>
        </div>
      </section>

      <!-- 6 · FACILITIES -->
      <section aria-labelledby="fac-h">
        <div class="det-yf__sechead">
          <span class="kicker">On site</span>
          <h2 id="fac-h">Facilities</h2>
        </div>
        <div class="det-yf__fac-grid">
          <div class="det-yf__fac-item">
            <span class="ic" aria-hidden="true"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-massage"></use></svg></span>
            <b>Couples rooms</b>
          </div>
          <div class="det-yf__fac-item">
            <span class="ic" aria-hidden="true"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-check"></use></svg></span>
            <b>Child-friendly</b>
          </div>
          <div class="det-yf__fac-item">
            <span class="ic" aria-hidden="true"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-wellness"></use></svg></span>
            <b>Natural local products</b>
          </div>
          <div class="det-yf__fac-item">
            <span class="ic" aria-hidden="true"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-massage"></use></svg></span>
            <b>Private treatment rooms</b>
          </div>
          <div class="det-yf__fac-item">
            <span class="ic" aria-hidden="true"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-air-con"></use></svg></span>
            <b>Air-conditioned</b>
          </div>
          <div class="det-yf__fac-item">
            <span class="ic" aria-hidden="true"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-check"></use></svg></span>
            <b>Walk-ins welcome</b>
          </div>
          <div class="det-yf__fac-item">
            <span class="ic" aria-hidden="true"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-sun"></use></svg></span>
            <b>Post-massage refreshments</b>
          </div>
          <div class="det-yf__fac-item">
            <span class="ic" aria-hidden="true"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-globe"></use></svg></span>
            <b>English-speaking staff</b>
          </div>
        </div>
      </section>

      <!-- 7 · ABOUT -->
      <section aria-labelledby="about-h">
        <div class="det-yf__sechead">
          <span class="kicker">The space</span>
          <h2 id="about-h">About Siladon Spa</h2>
        </div>
        <div class="det-yf__prose">
          <p>Siladon Spa Pattaya is a professional day spa in the Naklua area, offering authentic Thai massage and holistic spa treatments from fully trained, experienced therapists. A twin-bed couples room and child-friendly arrangements make it suitable for couples and families.</p>
          <p>It offers a clean, warm environment and mostly uses natural, locally sourced Thai products. The spa is currently running an aggressive flash-sale discount across all services.</p>
          <p>Highlights include couple- and family-friendly rooms, natural local products, tiered 2-to-5-hour signature packages, and promo prices for direct advance bookings. Payment is cash or bank transfer only; tax is included and tipping is optional.</p>
        </div>
      </section>

      <!-- 8 · GOOD TO KNOW -->
      <section aria-labelledby="bring-h">
        <div class="det-yf__sechead">
          <span class="kicker">Good to know</span>
          <h2 id="bring-h">Good to know</h2>
        </div>
        <ul class="det-yf__bring">
          <li><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-check"></use></svg> Payment is cash or bank transfer only</li>
          <li><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-check"></use></svg> Promo prices apply to direct advance bookings</li>
          <li><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-check"></use></svg> Twin-bed couples room and child-friendly options</li>
          <li><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-check"></use></svg> Mostly natural, locally sourced Thai products</li>
          <li><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-check"></use></svg> Tax included; tipping optional</li>
          <li><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-check"></use></svg> Confirm opening hours before visiting</li>
        </ul>
      </section>

      <!-- 10 · GETTING THERE -->
      <section id="getting-there" aria-labelledby="get-h">
        <div class="det-yf__sechead">
          <span class="kicker"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-pin"></use></svg> Location</span>
          <h2 id="get-h">Getting there</h2>
        </div>
        <div class="det-yf__getting">
          <figure class="det-yf__mapfig" role="img" aria-label="Schematic map: Siladon Spa Pattaya is in Naklua, off Naklua 16 / Pho Samphan Alley.">
            <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <rect width="400" height="300" fill="#eef7fc"/>
              <rect x="40" y="40" width="110" height="64" rx="6" fill="#d6ebf6"/>
              <rect x="250" y="40" width="110" height="64" rx="6" fill="#d6ebf6"/>
              <rect x="40" y="196" width="120" height="70" rx="6" fill="#d6ebf6"/>
              <rect x="250" y="196" width="110" height="70" rx="6" fill="#d6ebf6"/>
              <rect x="0" y="120" width="400" height="24" fill="#ffffff" stroke="#cfe1ee"/>
              <rect x="180" y="0" width="24" height="300" fill="#ffffff" stroke="#cfe1ee"/>
              <rect x="214" y="150" width="96" height="38" rx="6" fill="#cfe8f5" stroke="#2fbddc" stroke-width="2"/>
              <circle cx="326" cy="160" r="5" fill="#1ba672" opacity=".5"/>
              <circle cx="336" cy="172" r="4" fill="#1ba672" opacity=".5"/>
              <text x="60" y="136" font-family="Manrope, sans-serif" font-size="9" fill="#5f6b75">Naklua Rd</text>
              <text x="186" y="290" font-family="Manrope, sans-serif" font-size="9" fill="#5f6b75" transform="rotate(-90 191 285)">Naklua Soi 16</text>
            </svg>
            <span class="det-yf__mappin" aria-hidden="true"><svg class="pg-icon is-40" aria-hidden="true"><use href="#pg-pin"></use></svg></span>
            <span class="det-yf__maplabel">Siladon Spa · Naklua</span>
          </figure>

          <div class="det-yf__addr">
            <div class="det-yf__addr-row">
              <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-pin"></use></svg>
              <span><b>Address</b>285/52 Moo 5, Naklua 16 (Pho Samphan Alley),<br>Naklua, Bang Lamung, Chon Buri 20150</span>
            </div>
            <div class="det-yf__addr-row">
              <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-near-me"></use></svg>
              <span><b>Nearby</b>In Naklua, near Wong Amat and the North Pattaya beachfront</span>
            </div>
            <div class="det-yf__addr-row">
              <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-clock"></use></svg>
              <span><b>Hours</b>Open daily · confirm hours before visiting</span>
            </div>
            <div class="det-yf__addr-actions">
              <a class="btn btn--primary btn--sm" href="https://maps.google.com/?q=Siladon+Spa+Pattaya+Naklua" target="_blank" rel="noopener">
                <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-directions"></use></svg> Get directions</a>
            </div>
          </div>
        </div>
      </section>

      <!-- 11 · FAQ -->
      <section aria-labelledby="faq-h">
        <div class="det-yf__sechead">
          <span class="kicker">Before you go</span>
          <h2 id="faq-h">Frequently asked</h2>
        </div>
        <div class="det-yf__faq">
          <div class="acc">
            <button class="q" type="button" aria-expanded="false">How do I pay?
              <svg class="pg-icon is-20 det-yf__pm" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path class="v" d="M12 5v14"/></svg></button>
            <div class="a"><div class="a-in">Payment is cash or bank transfer only. The promo prices apply to direct advance bookings.</div></div>
          </div>
          <div class="acc">
            <button class="q" type="button" aria-expanded="false">Is it suitable for couples and families?
              <svg class="pg-icon is-20 det-yf__pm" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path class="v" d="M12 5v14"/></svg></button>
            <div class="a"><div class="a-in">Yes — there's a twin-bed couples room and child-friendly arrangements, in a clean, warm setting.</div></div>
          </div>
          <div class="acc">
            <button class="q" type="button" aria-expanded="false">Are the discounts real?
              <svg class="pg-icon is-20 det-yf__pm" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path class="v" d="M12 5v14"/></svg></button>
            <div class="a"><div class="a-in">Siladon is running an aggressive flash-sale across all services; the promo price is shown with the normal rate in brackets. Book in advance directly to get the promo.</div></div>
          </div>
          <div class="acc">
            <button class="q" type="button" aria-expanded="false">What products are used?
              <svg class="pg-icon is-20 det-yf__pm" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/><path class="v" d="M12 5v14"/></svg></button>
            <div class="a"><div class="a-in">Mostly natural, locally sourced Thai products.</div></div>
          </div>
        </div>
      </section>

    </div><!-- /content -->

    <!-- 13 · INFO CARD (sticky aside) -->
    <aside class="det-yf__aside" aria-labelledby="card-h">
      <div class="det-yf__card">
        <div class="det-yf__card-head">
          <h2 id="card-h">Siladon Spa Pattaya</h2>
          <div class="det-yf__card-meta">
            <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg>4.9 <span class="count">· 902</span></span>
            <span class="pill pill--success"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-clock"></use></svg> Open daily · check ahead</span>
          </div>
        </div>

        <div class="det-yf__card-price">
          <b>฿450</b><span class="per">promo foot massage · from</span>
        </div>

        <div class="det-yf__card-list">
          <div class="row"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-pin"></use></svg>
            <span>285/52 Moo 5, Naklua 16, Naklua, Chon Buri 20150</span></div>
          <div class="row"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-clock"></use></svg>
            <span><span class="open">Open daily · check ahead</span></span></div>
          <div class="row"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-globe"></use></svg>
            <span><a href="https://www.siladonspas.com/pattaya" target="_blank" rel="noopener">siladonspas.com/pattaya</a></span></div>
          <div class="row"><svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-local-verified"></use></svg>
            <span>Locally verified by Pattaya Guide</span></div>
        </div>

        <div class="det-yf__card-actions">
          <a class="btn btn--primary" href="https://maps.google.com/?q=Siladon+Spa+Pattaya+Naklua" target="_blank" rel="noopener">
            <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-directions"></use></svg> Get directions</a>
          <a class="btn btn--secondary" href="https://www.siladonspas.com/pattaya" target="_blank" rel="noopener">
            <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-globe"></use></svg> Visit website</a>
        </div>
      </div>
    </aside>

  </div><!-- /layout -->

  <!-- 12 · MORE SPAS -->
  <section class="det-yf__wrap det-yf__more" aria-labelledby="more-h" style="padding-bottom:var(--s8)">
    <div class="det-yf__sechead">
      <span class="kicker">Keep exploring</span>
      <h2 id="more-h">More spas &amp; wellness</h2>
      <p>Other locally verified spas around Pattaya.</p>
    </div>
    <div class="carousel-wrap">
      <button class="car-btn car-prev" type="button" aria-label="Previous spas" data-car="prev">
        <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-arrow-left"></use></svg></button>
      <button class="car-btn car-next" type="button" aria-label="Next spas" data-car="next">
        <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-arrow-right"></use></svg></button>
      <div class="carousel" id="det-more">

        <a class="det-yf__morecard" href="/wellness-and-beauty/lets-relax-north-pattaya">
          <div class="det-yf__morecard__media">
            <img src="${A}pattaya-massage-1.jpeg" alt="Tropical garden courtyard at Let's Relax Spa, Pattaya — a spa in Pattaya, Thailand." loading="lazy" width="560" height="420">
            <span class="det-yf__morecard__tag"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-massage"></use></svg> Spa</span>
          </div>
          <div class="det-yf__morecard__body">
            <h3>Let's Relax North Pattaya</h3>
            <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg>4.3 <span class="count">(822)</span></span>
            <span class="det-yf__morecard__loc"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-pin"></use></svg> North Pattaya</span>
            <span class="det-yf__morecard__price">From ฿350 <span>· premium day spa</span></span>
          </div>
        </a>
        <a class="det-yf__morecard" href="/wellness-and-beauty/tea-tree-spa-pattaya">
          <div class="det-yf__morecard__media">
            <img src="${A}best-island-pattaya.jpg" alt="Ocean-view relaxation lounge at Tea Tree Spa Pattaya — a spa in Pattaya, Thailand." loading="lazy" width="560" height="420">
            <span class="det-yf__morecard__tag"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-massage"></use></svg> Hotel spa</span>
          </div>
          <div class="det-yf__morecard__body">
            <h3>Tea Tree Spa</h3>
            <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg>5.0 <span class="count">(804)</span></span>
            <span class="det-yf__morecard__loc"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-pin"></use></svg> Holiday Inn</span>
            <span class="det-yf__morecard__price">From ฿600 <span>· luxury hotel spa</span></span>
          </div>
        </a>
        <a class="det-yf__morecard" href="/wellness-and-beauty/lets-relax-onsen-and-spa-pattaya">
          <div class="det-yf__morecard__media">
            <img src="${A}pattaya-massage-2.jpg" alt="Courtyard stone fountain at Let's Relax Onsen &amp; Spa Pattaya — a spa in Pattaya, Thailand." loading="lazy" width="560" height="420">
            <span class="det-yf__morecard__tag"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-wellness"></use></svg> Onsen</span>
          </div>
          <div class="det-yf__morecard__body">
            <h3>Let's Relax Onsen &amp; Spa</h3>
            <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg>4.6 <span class="count">(776)</span></span>
            <span class="det-yf__morecard__loc"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-pin"></use></svg> Naklua</span>
            <span class="det-yf__morecard__price">From ฿750 <span>· onsen + spa</span></span>
          </div>
        </a>
        <a class="det-yf__morecard" href="/wellness-and-beauty/rinn-spa-massage">
          <div class="det-yf__morecard__media">
            <img src="${A}pattaya-wellnes-2.jpg" alt="Thai massage room at RINN Spa &amp; Massage — a spa in Pattaya, Thailand." loading="lazy" width="560" height="420">
            <span class="det-yf__morecard__tag"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-massage"></use></svg> Massage</span>
          </div>
          <div class="det-yf__morecard__body">
            <h3>RINN Spa &amp; Massage</h3>
            <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg>4.5 <span class="count">(709)</span></span>
            <span class="det-yf__morecard__loc"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-pin"></use></svg> Central Pattaya</span>
            <span class="det-yf__morecard__price">From ฿390 <span>· Thai &amp; oil massage</span></span>
          </div>
        </a>

      </div>
    </div>
  </section>

  <!-- LIGHTBOX -->
  <div class="det-yf__lb" id="det-lb" role="dialog" aria-modal="true" aria-label="Photo viewer">
    <button class="det-yf__lbclose" type="button" data-lb-close aria-label="Close photo viewer">
      <svg class="pg-icon is-24" aria-hidden="true"><use href="#pg-close"></use></svg></button>
    <button class="det-yf__lbnav det-yf__lbnav--prev" type="button" data-lb-prev aria-label="Previous photo">
      <svg class="pg-icon is-24" aria-hidden="true"><use href="#pg-arrow-left"></use></svg></button>
    <figure>
      <img id="det-lb-img" src="" alt="">
      <figcaption id="det-lb-cap"></figcaption>
    </figure>
    <button class="det-yf__lbnav det-yf__lbnav--next" type="button" data-lb-next aria-label="Next photo">
      <svg class="pg-icon is-24" aria-hidden="true"><use href="#pg-arrow-right"></use></svg></button>
  </div>

</div>
`

const SCRIPT = String.raw`
(function(){
  "use strict";
  var root = document.querySelector('.det-yf');
  if(!root) return;
  var photos = [
    {src:"${A}pattaya-massage-4.png", cap:"Reception lounge at Siladon Spa Pattaya — a spa in Pattaya, Thailand."},
    {src:"${A}pattaya-wellness-1.jpeg", cap:"Relaxation area at Siladon Spa Pattaya — a spa in Pattaya, Thailand."},
    {src:"${A}pattaya-massage-2.jpg", cap:"Spa reception at Siladon Spa Pattaya — a spa in Pattaya, Thailand."},
    {src:"${A}pattaya-wellnes-2.jpg", cap:"Wellness lounge at Siladon Spa Pattaya — a spa in Pattaya, Thailand."},
    {src:"${A}pattaya-massage-1.jpeg", cap:"Aromatherapy treatment at Siladon Spa Pattaya — a spa in Pattaya, Thailand."},
    {src:"${A}best-island-pattaya.jpg", cap:"Spa interior at Siladon Spa Pattaya — a spa in Pattaya, Thailand."},
    {src:"${A}pattaya-wellness-1.jpeg", cap:"Couples treatment room at Siladon Spa Pattaya — a spa in Pattaya, Thailand."}
  ];
  var lb = document.getElementById('det-lb');
  var lbImg = document.getElementById('det-lb-img');
  var lbCap = document.getElementById('det-lb-cap');
  var cur = 0, lastFocus = null;
  function show(i){
    cur = (i + photos.length) % photos.length;
    lbImg.src = photos[cur].src; lbImg.alt = photos[cur].cap; lbCap.textContent = photos[cur].cap;
  }
  function open(i){
    lastFocus = document.activeElement; show(i);
    lb.classList.add('open'); document.body.style.overflow = 'hidden';
    lb.querySelector('[data-lb-close]').focus();
  }
  function close(){
    lb.classList.remove('open'); document.body.style.overflow = '';
    if(lastFocus) lastFocus.focus();
  }
  document.querySelectorAll('#det-gallery [data-lb]').forEach(function(btn){
    btn.addEventListener('click', function(){ open(parseInt(btn.getAttribute('data-lb'),10)); });
  });
  lb.querySelector('[data-lb-close]').addEventListener('click', close);
  lb.querySelector('[data-lb-prev]').addEventListener('click', function(){ show(cur-1); });
  lb.querySelector('[data-lb-next]').addEventListener('click', function(){ show(cur+1); });
  lb.addEventListener('click', function(e){ if(e.target === lb) close(); });
  document.addEventListener('keydown', function(e){
    if(!lb.classList.contains('open')) return;
    if(e.key === 'Escape') close();
    else if(e.key === 'ArrowLeft') show(cur-1);
    else if(e.key === 'ArrowRight') show(cur+1);
  });
  root.querySelectorAll('.acc .q').forEach(function(q){
    q.addEventListener('click', function(){
      var acc = q.closest('.acc');
      var openState = acc.classList.toggle('open');
      q.setAttribute('aria-expanded', openState ? 'true' : 'false');
    });
  });
  var car = document.getElementById('det-more');
  root.querySelectorAll('.det-yf__more [data-car]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var amount = Math.min(car.clientWidth * 0.8, 320);
      car.scrollBy({ left: btn.getAttribute('data-car') === 'next' ? amount : -amount, behavior: 'smooth' });
    });
  });
})();
`

export default function SiladonSpaPattayaPage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: HTML }} />
      <BlogScript script={SCRIPT} />
    </>
  )
}
