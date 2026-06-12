import './yf.css'
import BlogScript from '@/app/components/BlogScript'

export const metadata = {
  title: 'Yoga & Fitness in Pattaya — Yoga Studios, Gyms & Muay Thai Camps | Go To Pattaya',
  description: 'Move your way in Pattaya. Browse yoga & pilates studios, fitness gyms and Muay Thai camps across three discipline lanes — Flow, Lift, Fight. Drop-ins welcome, locally verified.',
  alternates: { canonical: '/yoga-and-fitness' },
}

const HTML = String.raw`
<!-- Hidden inline icon sprite — only the symbols this page uses + authored pg-dumbbell -->
<svg aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">
  <symbol id="pg-muay-thai" viewBox="0 0 24 24"><path d="M7 9a4 4 0 0 1 8 0v2.5a3 3 0 0 1-3 3H7z"/><path d="M7 10.5H5.5a2 2 0 1 0 0 4H7"/><rect x="7" y="14.5" width="8" height="5" rx="1.5"/><path d="M7 17h8"/><path d="M11 7v3.5"/></symbol>
  <symbol id="pg-wellness" viewBox="0 0 24 24"><path d="M12 17C10 14.5 10 9.5 12 7c2 2.5 2 7.5 0 10z"/><path d="M12 17C9 16 6 14.5 5.5 11.5 8.5 11.8 11 13.5 12 17z"/><path d="M12 17c3-1 6-2.5 6.5-5.5C15.5 11.8 13 13.5 12 17z"/><path d="M5 18.6c2.4 1.3 11.6 1.3 14 0"/></symbol>
  <!-- AUTHORED to system spec: viewBox 0 0 24 24, stroke=currentColor, fill=none, stroke-width 2, round cap+join, ~20×20 live area -->
  <symbol id="pg-dumbbell" viewBox="0 0 24 24"><title>Gym / Dumbbell</title><path d="M9 12h6"/><path d="M6.5 8v8"/><path d="M4 9.5v5"/><path d="M17.5 8v8"/><path d="M20 9.5v5"/></symbol>
  <symbol id="pg-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></symbol>
  <symbol id="pg-pin" viewBox="0 0 24 24"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/></symbol>
  <symbol id="pg-map" viewBox="0 0 24 24"><path d="m9 4-6 2.5v13L9 17l6 2.5 6-2.5v-13L15 6.5z"/><path d="M9 4v13"/><path d="M15 6.5v13"/></symbol>
  <symbol id="pg-star" viewBox="0 0 24 24"><path d="M12 2.6 14.85 8.4 21.2 9.3l-4.6 4.4 1.1 6.3L12 17.4 6.3 20l1.1-6.3-4.6-4.4 6.35-.9z"/></symbol>
  <symbol id="pg-heart" viewBox="0 0 24 24"><path d="M12 20.3 4.6 12.9a4.7 4.7 0 0 1 6.6-6.6l.8.8.8-.8a4.7 4.7 0 0 1 6.6 6.6z"/></symbol>
  <symbol id="pg-share" viewBox="0 0 24 24"><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.8 7.6-3.6"/><path d="m8.2 13.2 7.6 3.6"/></symbol>
  <symbol id="pg-filter" viewBox="0 0 24 24"><path d="M3 5h18l-7 8v6l-4-2v-4z"/></symbol>
  <symbol id="pg-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></symbol>
  <symbol id="pg-near-me" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="2.1" fill="currentColor" stroke="none"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M2 12h3"/><path d="M19 12h3"/></symbol>
  <symbol id="pg-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.3"/><path d="M12 2v2.4"/><path d="M12 19.6V22"/><path d="m4.4 4.4 1.7 1.7"/><path d="m17.9 17.9 1.7 1.7"/><path d="M2 12h2.4"/><path d="M19.6 12H22"/><path d="m4.4 19.6 1.7-1.7"/><path d="m17.9 6.1 1.7-1.7"/></symbol>
  <symbol id="pg-moon" viewBox="0 0 24 24"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"/><path d="m17 5 .6 1.5L19 7l-1.4.5L17 9l-.6-1.5L15 7l1.4-.5z" fill="currentColor" stroke="none"/></symbol>
  <symbol id="pg-check" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7"/></symbol>
  <symbol id="pg-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="8" r=".8" fill="currentColor" stroke="none"/></symbol>
  <symbol id="pg-local-verified" viewBox="0 0 24 24"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><path d="m9.2 9.9 2 2 3.6-3.8"/></symbol>
  <symbol id="pg-air-con" viewBox="0 0 24 24"><path d="M12 3v18"/><path d="M4.5 7.5 19.5 16.5"/><path d="M19.5 7.5 4.5 16.5"/><path d="m9.8 5.2 2.2-2 2.2 2"/><path d="m9.8 18.8 2.2 2 2.2-2"/><path d="m4.5 10.5-.3-3 2.9.8"/><path d="m19.5 13.5.3 3-2.9-.8"/><path d="m19.5 10.5.3-3-2.9.8"/><path d="m4.5 13.5-.3 3 2.9-.8"/></symbol>
  <symbol id="pg-parking" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M9.5 16.5v-9h3.5a2.75 2.75 0 0 1 0 5.5H9.5"/></symbol>
  <symbol id="pg-card" viewBox="0 0 24 24"><rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3 9.5h18"/><path d="M7 14.5h3"/></symbol>
  <symbol id="pg-sea-view" viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="3.2"/><path d="M3 16c1.6-1.6 3.4-1.6 5 0s3.4 1.6 5 0 3.4-1.6 5 0"/><path d="M3 19.5c1.6-1.6 3.4-1.6 5 0s3.4 1.6 5 0 3.4-1.6 5 0"/></symbol>
  <symbol id="pg-water-sports" viewBox="0 0 24 24"><path d="M3 7q2.5-3 5 0t5 0t5 0"/><path d="M3 12q2.5-3 5 0t5 0t5 0"/><path d="M3 17q2.5-3 5 0t5 0t5 0"/></symbol>
  <symbol id="pg-chevron-right" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></symbol>
  <symbol id="pg-arrow-right" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></symbol>
  <symbol id="pg-calendar" viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M3.5 9.5h17"/><path d="M8 3v4"/><path d="M16 3v4"/></symbol>
  <symbol id="pg-discount" viewBox="0 0 24 24"><path d="M3.6 11.6 11.6 3.6a2 2 0 0 1 1.4-.6H19a2 2 0 0 1 2 2v6a2 2 0 0 1-.6 1.4l-8 8a2 2 0 0 1-2.8 0l-6-6a2 2 0 0 1 0-2.8z"/><path d="m9.5 13.5 4-4"/><circle cx="9.7" cy="9.7" r=".7" fill="currentColor" stroke="none"/><circle cx="13.3" cy="13.3" r=".7" fill="currentColor" stroke="none"/></symbol>
  <symbol id="pg-accessible" viewBox="0 0 24 24"><circle cx="13" cy="4.3" r="1.7"/><path d="M13 6.5v6h4.5l1.5 5.5"/><path d="M13 9.5H9"/><circle cx="11" cy="16.5" r="4.8"/></symbol>
  <symbol id="pg-kids" viewBox="0 0 24 24"><circle cx="12" cy="5" r="2.2"/><path d="M12 7.2v6.5"/><path d="M8.5 9.5h7"/><path d="m9 20 3-6 3 6"/></symbol>
</svg>

<div class="yf-page">

  <!-- ===================== 1 · KINETIC HERO ===================== -->
  <section class="yf-hero" aria-labelledby="yf-hero-h">
    <img class="yf-hero__img" src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-muay-thai-1.jpg"
         alt="Fighters training at a Muay Thai camp in Pattaya" width="1600" height="900">
    <div class="yf-hero__scrim" aria-hidden="true"></div>
    <div class="yf-hero__streak" aria-hidden="true"></div>
    <div class="yf-hero__inner">
      <div class="yf-wrap">
        <nav class="crumb" style="color:rgba(255,255,255,.7);margin-bottom:var(--s3)" aria-label="Breadcrumb">
          <a href="/" style="color:var(--lagoon)">Pattaya Guide</a>
          <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-chevron-right"></use></svg>
          <span class="cur" style="color:rgba(255,255,255,.85)">Yoga &amp; Fitness</span>
        </nav>
        <span class="kicker">Yoga &amp; Fitness</span>
        <h1 id="yf-hero-h">Flow. Lift. <em>Fight.</em></h1>
        <p class="yf-hero__lead">Three ways to move in Pattaya — calm yoga &amp; pilates studios, no-nonsense
          fitness gyms, and authentic Muay Thai camps. Pick your lane, drop in, and train.</p>

        <div class="search" role="search">
          <svg class="pg-icon is-20 is-muted" aria-hidden="true"><use href="#pg-search"></use></svg>
          <input type="search" id="yf-hero-search" aria-label="Search studios, gyms and Muay Thai camps"
                 placeholder="Search studios, gyms, Muay Thai camps…">
          <button class="go" type="button" aria-label="Search">
            <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-arrow-right"></use></svg>
          </button>
        </div>

        <div class="yf-hero__stats">
          <div class="yf-hero__stat"><b>186</b><span>studios &amp; camps</span></div>
          <div class="yf-hero__div" aria-hidden="true"></div>
          <div class="yf-hero__stat"><b>3</b><span>discipline lanes</span></div>
          <div class="yf-hero__div" aria-hidden="true"></div>
          <div class="yf-hero__stat"><b>Drop-ins</b><span>welcome everywhere</span></div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===================== 2 · DISCIPLINE SWITCHER ===================== -->
  <section class="yf-switch" aria-labelledby="yf-switch-h">
    <div class="yf-wrap">
      <div class="yf-head">
        <span class="kicker">Pick your lane</span>
        <h2 id="yf-switch-h">Three disciplines, one ocean</h2>
        <p>Every venue lives in one of three lanes. Tap a lane to jump straight to it.</p>
      </div>
      <div class="yf-lanes">
        <a class="yf-lanetile yf-lanetile--yoga" href="#lane-yoga" data-jump="yoga">
          <span class="yf-lanetile__vibe">Flow</span>
          <span class="yf-lanetile__med"><svg class="pg-icon is-32" aria-hidden="true"><use href="#pg-wellness"></use></svg></span>
          <h3>Yoga &amp; Pilates</h3>
          <p>Vinyasa, Yin, sound healing and reformer pilates — breathe, stretch and reset.</p>
          <span class="yf-lanetile__foot">
            <span class="yf-lanetile__count">62 studios</span>
            <span class="yf-lanetile__go">Explore <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-arrow-right"></use></svg></span>
          </span>
        </a>
        <a class="yf-lanetile yf-lanetile--gym" href="#lane-gym" data-jump="gym">
          <span class="yf-lanetile__vibe">Lift</span>
          <span class="yf-lanetile__med"><svg class="pg-icon is-32" aria-hidden="true"><use href="#pg-dumbbell"></use></svg></span>
          <h3>Gyms &amp; Fitness</h3>
          <p>Free weights, functional zones, cardio and 24/7 floors — build strength your way.</p>
          <span class="yf-lanetile__foot">
            <span class="yf-lanetile__count">78 gyms</span>
            <span class="yf-lanetile__go">Explore <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-arrow-right"></use></svg></span>
          </span>
        </a>
        <a class="yf-lanetile yf-lanetile--muay" href="#lane-muay" data-jump="muay">
          <span class="yf-lanetile__vibe">Fight</span>
          <span class="yf-lanetile__med"><svg class="pg-icon is-32" aria-hidden="true"><use href="#pg-muay-thai"></use></svg></span>
          <h3>Muay Thai Camps</h3>
          <p>Real fighter energy — pad work, sparring and fight prep, from first-timer to pro.</p>
          <span class="yf-lanetile__foot">
            <span class="yf-lanetile__count">46 camps</span>
            <span class="yf-lanetile__go">Explore <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-arrow-right"></use></svg></span>
          </span>
        </a>
      </div>
    </div>
  </section>

  <!-- ===================== 3 · FIND YOUR DISCIPLINE ===================== -->
  <section class="yf-find" aria-labelledby="yf-find-h">
    <div class="yf-wrap">
      <div class="yf-head" style="margin-bottom:var(--s3)">
        <span class="kicker">Not sure where to start?</span>
        <h2 id="yf-find-h">Find your discipline</h2>
        <p>Tell us your goal and we'll point you to the right lane.</p>
      </div>
      <div class="yf-find__chips" role="group" aria-label="Choose a fitness goal">
        <button class="chip yf-goal" type="button" aria-pressed="false" data-goal="gym" data-lane="Gyms &amp; Fitness" data-anchor="#lane-gym"
          data-tip="Free weights, machines and functional zones to add muscle and power.">
          <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-dumbbell"></use></svg>Build strength</button>
        <button class="chip yf-goal" type="button" aria-pressed="false" data-goal="yoga" data-lane="Yoga &amp; Pilates" data-anchor="#lane-yoga"
          data-tip="Vinyasa, Yin and reformer pilates to open up tight hips and shoulders.">
          <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-wellness"></use></svg>Get flexible</button>
        <button class="chip yf-goal" type="button" aria-pressed="false" data-goal="gym" data-lane="Gyms &amp; Fitness" data-anchor="#lane-gym"
          data-tip="Mix cardio floors with strength training — most gyms here do both.">
          <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-dumbbell"></use></svg>Lose weight</button>
        <button class="chip yf-goal" type="button" aria-pressed="false" data-goal="muay" data-lane="Muay Thai Camps" data-anchor="#lane-muay"
          data-tip="Beginner-friendly Muay Thai camps teach the basics with no pressure.">
          <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-muay-thai"></use></svg>Learn to fight</button>
        <button class="chip yf-goal" type="button" aria-pressed="false" data-goal="yoga" data-lane="Yoga &amp; Pilates" data-anchor="#lane-yoga"
          data-tip="Yin, breathwork and sound-healing classes are made for switching off.">
          <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-wellness"></use></svg>De-stress</button>
        <button class="chip yf-goal" type="button" aria-pressed="false" data-goal="muay" data-lane="Muay Thai Camps" data-anchor="#lane-muay"
          data-tip="Pro camps run fight-prep blocks with sparring and conditioning.">
          <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-muay-thai"></use></svg>Train for a fight</button>
      </div>

      <div class="yf-reveal" id="yf-reveal" role="status" aria-live="polite">
        <span class="yf-reveal__med" aria-hidden="true"><svg class="pg-icon is-24" id="yf-reveal-ic"><use href="#pg-wellness"></use></svg></span>
        <span>
          <b id="yf-reveal-title">Recommended lane</b>
          <span id="yf-reveal-tip">—</span>
        </span>
        <a class="btn btn--secondary btn--sm" id="yf-reveal-link" href="#lane-yoga">
          Go to lane <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-chevron-right"></use></svg>
        </a>
      </div>
    </div>
  </section>

  <!-- ===================== 4 · LANE 1 — YOGA & PILATES ===================== -->
  <section class="yf-lane yf-lane--yoga" id="lane-yoga" aria-labelledby="lane-yoga-h">
    <div class="yf-wrap">
      <div class="yf-lane__top">
        <div class="yf-lane__title">
          <span class="yf-lane__badge"><svg class="pg-icon is-28" aria-hidden="true"><use href="#pg-wellness"></use></svg></span>
          <div>
            <span class="kicker" style="color:var(--blue-500)">Lane 01 · Flow</span>
            <h2 id="lane-yoga-h">Yoga &amp; Pilates</h2>
          </div>
        </div>
        <span class="yf-lane__count">62 studios</span>
      </div>
      <p class="yf-lane__blurb" style="margin-bottom:var(--s4)">Soft mornings and slow breath. Drop into vinyasa
        flow, restorative Yin, sound-healing or a reformer pilates class.</p>

      <div class="filterbar" role="group" aria-label="Filter yoga & pilates by class type">
        <span class="yf-lane__filterlbl"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-filter"></use></svg> Class type</span>
        <button class="chip" type="button" aria-pressed="true"  data-filter-lane="yoga" data-type="all">All</button>
        <button class="chip" type="button" aria-pressed="false" data-filter-lane="yoga" data-type="vinyasa">Vinyasa</button>
        <button class="chip" type="button" aria-pressed="false" data-filter-lane="yoga" data-type="hatha">Hatha</button>
        <button class="chip" type="button" aria-pressed="false" data-filter-lane="yoga" data-type="yin">Yin</button>
        <button class="chip" type="button" aria-pressed="false" data-filter-lane="yoga" data-type="sound">Sound healing</button>
        <button class="chip" type="button" aria-pressed="false" data-filter-lane="yoga" data-type="reformer">Reformer Pilates</button>
      </div>

      <div class="yf-grid">
        <!-- Gaya Wellness Studio -->
        <article class="yf-card" data-lane="yoga" data-type="vinyasa hatha" data-name="gaya wellness studio">
          <div class="yf-card__media">
            <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-yoga-1.webp"
                 alt="Yoga class in progress at Gaya Wellness Studio, Pattaya" loading="lazy" width="600" height="450">
            <span class="yf-card__lanetag"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-wellness"></use></svg> Yoga</span>
            <button class="yf-card__save" type="button" aria-pressed="false" aria-label="Save Gaya Wellness Studio">
              <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="yf-card__body">
            <div class="yf-card__row">
              <h3>Gaya Wellness Studio</h3>
            </div>
            <div class="yf-card__row">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg>4.8 <span class="count">(212)</span></span>            </div>
            <div class="yf-card__fac" aria-label="Facilities">
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-air-con"></use></svg> Air-con</span>
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-parking"></use></svg> Parking</span>
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-card"></use></svg> Card</span>
            </div>
            <span class="yf-card__loc"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-pin"></use></svg> Central Pattaya</span>
            <span class="yf-card__price">Drop-in from ฿350 <span>· monthly ฿2,900</span></span>
            <div class="yf-card__foot">
              <a class="btn btn--primary btn--sm" href="#">View details</a>
              <a class="btn btn--secondary btn--sm" href="#"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-map"></use></svg> Map</a>
              <button class="btn btn--secondary btn--sm yf-card__savebtn" type="button" aria-pressed="false" aria-label="Save Gaya Wellness Studio">
                <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
            </div>
          </div>
        </article>

        <!-- Balance Yoga & Sound Healing -->
        <article class="yf-card" data-lane="yoga" data-type="sound yin vinyasa" data-name="balance yoga sound healing studio">
          <div class="yf-card__media">
            <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-yoga-2.jpg"
                 alt="Singing-bowl sound-healing session at Balance Yoga, Pattaya" loading="lazy" width="600" height="450">
            <span class="yf-card__lanetag"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-wellness"></use></svg> Yoga</span>
            <button class="yf-card__save" type="button" aria-pressed="false" aria-label="Save Balance Yoga & Sound Healing Studio">
              <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="yf-card__body">
            <div class="yf-card__row"><h3>Balance Yoga &amp; Sound Healing</h3></div>
            <div class="yf-card__row">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg>4.9 <span class="count">(168)</span></span>            </div>
            <div class="yf-card__fac" aria-label="Facilities">
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-air-con"></use></svg> Air-con</span>
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-card"></use></svg> Card</span>
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-accessible"></use></svg> Accessible</span>
            </div>
            <span class="yf-card__loc"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-pin"></use></svg> Pratumnak</span>
            <span class="yf-card__price">Drop-in from ฿450 <span>· monthly ฿3,400</span></span>
            <div class="yf-card__foot">
              <a class="btn btn--primary btn--sm" href="#">View details</a>
              <a class="btn btn--secondary btn--sm" href="#"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-map"></use></svg> Map</a>
              <button class="btn btn--secondary btn--sm yf-card__savebtn" type="button" aria-pressed="false" aria-label="Save Balance Yoga & Sound Healing Studio">
                <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
            </div>
          </div>
        </article>

        <!-- Boston Pilates -->
        <article class="yf-card" data-lane="yoga" data-type="reformer" data-name="boston pilates">
          <div class="yf-card__media">
            <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-yoga-1.webp"
                 alt="Reformer pilates studio with equipment at Boston Pilates, Pattaya" loading="lazy" width="600" height="450">
            <span class="yf-card__lanetag"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-wellness"></use></svg> Pilates</span>
            <button class="yf-card__save" type="button" aria-pressed="false" aria-label="Save Boston Pilates">
              <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="yf-card__body">
            <div class="yf-card__row"><h3>Boston Pilates</h3></div>
            <div class="yf-card__row">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg>4.7 <span class="count">(96)</span></span>            </div>
            <div class="yf-card__fac" aria-label="Facilities">
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-air-con"></use></svg> Air-con</span>
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-parking"></use></svg> Parking</span>
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-card"></use></svg> Card</span>
            </div>
            <span class="yf-card__loc"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-pin"></use></svg> Jomtien</span>
            <span class="yf-card__price">Drop-in from ฿550 <span>· monthly ฿4,200</span></span>
            <div class="yf-card__foot">
              <a class="btn btn--primary btn--sm" href="#">View details</a>
              <a class="btn btn--secondary btn--sm" href="#"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-map"></use></svg> Map</a>
              <button class="btn btn--secondary btn--sm yf-card__savebtn" type="button" aria-pressed="false" aria-label="Save Boston Pilates">
                <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
            </div>
          </div>
        </article>

        <!-- Chama Yoga & Sound Healing -->
        <article class="yf-card" data-lane="yoga" data-type="sound yin" data-name="chama yoga sound healing studio">
          <div class="yf-card__media">
            <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-yoga-2.jpg"
                 alt="Group yoga class at Chama Yoga & Sound Healing Studio, Pattaya" loading="lazy" width="600" height="450">
            <span class="yf-card__lanetag"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-wellness"></use></svg> Yoga</span>
            <button class="yf-card__save" type="button" aria-pressed="false" aria-label="Save Chama Yoga & Sound Healing Studio">
              <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="yf-card__body">
            <div class="yf-card__row"><h3>Chama Yoga &amp; Sound Healing</h3></div>
            <div class="yf-card__row">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg>4.8 <span class="count">(124)</span></span>            </div>
            <div class="yf-card__fac" aria-label="Facilities">
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-air-con"></use></svg> Air-con</span>
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-card"></use></svg> Card</span>
            </div>
            <span class="yf-card__loc"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-pin"></use></svg> Naklua</span>
            <span class="yf-card__price">Drop-in from ฿400 <span>· monthly ฿3,100</span></span>
            <div class="yf-card__foot">
              <a class="btn btn--primary btn--sm" href="#">View details</a>
              <a class="btn btn--secondary btn--sm" href="#"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-map"></use></svg> Map</a>
              <button class="btn btn--secondary btn--sm yf-card__savebtn" type="button" aria-pressed="false" aria-label="Save Chama Yoga & Sound Healing Studio">
                <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
            </div>
          </div>
        </article>

        <!-- Ashtanga Yoga Pattaya -->
        <article class="yf-card" data-lane="yoga" data-type="vinyasa hatha" data-name="ashtanga yoga pattaya">
          <div class="yf-card__media">
            <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-yoga-1.webp"
                 alt="Practitioner in downward-dog pose at Ashtanga Yoga Pattaya" loading="lazy" width="600" height="450">
            <span class="yf-card__lanetag"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-wellness"></use></svg> Yoga</span>
            <button class="yf-card__save" type="button" aria-pressed="false" aria-label="Save Ashtanga Yoga Pattaya">
              <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="yf-card__body">
            <div class="yf-card__row"><h3>Ashtanga Yoga Pattaya</h3></div>
            <div class="yf-card__row">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg>4.6 <span class="count">(83)</span></span>            </div>
            <div class="yf-card__fac" aria-label="Facilities">
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-air-con"></use></svg> Air-con</span>
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-card"></use></svg> Card</span>
            </div>
            <span class="yf-card__loc"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-pin"></use></svg> Central Pattaya</span>
            <span class="yf-card__price">Drop-in from ฿300 <span>· monthly ฿2,600</span></span>
            <div class="yf-card__foot">
              <a class="btn btn--primary btn--sm" href="#">View details</a>
              <a class="btn btn--secondary btn--sm" href="#"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-map"></use></svg> Map</a>
              <button class="btn btn--secondary btn--sm yf-card__savebtn" type="button" aria-pressed="false" aria-label="Save Ashtanga Yoga Pattaya">
                <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
            </div>
          </div>
        </article>

        <!-- LEK Thai Yoga Self-Healing -->
        <article class="yf-card" data-lane="yoga" data-type="hatha yin" data-name="lek thai yoga self-healing">
          <div class="yf-card__media">
            <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-yoga-2.jpg"
                 alt="Outdoor yoga class at LEK Thai Yoga Self-Healing, Pattaya" loading="lazy" width="600" height="450">
            <span class="yf-card__lanetag"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-wellness"></use></svg> Yoga</span>
            <button class="yf-card__save" type="button" aria-pressed="false" aria-label="Save LEK Thai Yoga Self-Healing">
              <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="yf-card__body">
            <div class="yf-card__row"><h3>LEK Thai Yoga Self-Healing</h3></div>
            <div class="yf-card__row">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg>4.9 <span class="count">(141)</span></span>            </div>
            <div class="yf-card__fac" aria-label="Facilities">
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-sea-view"></use></svg> Outdoor</span>
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-card"></use></svg> Card</span>
            </div>
            <span class="yf-card__loc"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-pin"></use></svg> Wong Amat</span>
            <span class="yf-card__price">Drop-in from ฿380 <span>· monthly ฿2,800</span></span>
            <div class="yf-card__foot">
              <a class="btn btn--primary btn--sm" href="#">View details</a>
              <a class="btn btn--secondary btn--sm" href="#"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-map"></use></svg> Map</a>
              <button class="btn btn--secondary btn--sm yf-card__savebtn" type="button" aria-pressed="false" aria-label="Save LEK Thai Yoga Self-Healing">
                <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
            </div>
          </div>
        </article>
      </div>
      <p class="yf-no-results" data-no-results="yoga" style="display:none;color:var(--text-muted);margin-top:var(--s4)">No studios match that class type yet — try another filter.</p>
    </div>
  </section>

  <!-- ===================== 5 · LANE 2 — GYMS & FITNESS ===================== -->
  <section class="yf-lane yf-lane--gym" id="lane-gym" aria-labelledby="lane-gym-h">
    <div class="yf-wrap">
      <div class="yf-lane__top">
        <div class="yf-lane__title">
          <span class="yf-lane__badge"><svg class="pg-icon is-28" aria-hidden="true"><use href="#pg-dumbbell"></use></svg></span>
          <div>
            <span class="kicker" style="color:var(--ocean)">Lane 02 · Lift</span>
            <h2 id="lane-gym-h">Gyms &amp; Fitness</h2>
          </div>
        </div>
        <span class="yf-lane__count">78 gyms</span>
      </div>
      <p class="yf-lane__blurb" style="margin-bottom:var(--s4)">Iron, cardio and functional floors. From budget locals'
        gyms to fully-loaded 24/7 clubs — drop in or sign up by the month.</p>

      <div class="filterbar" role="group" aria-label="Filter gyms & fitness by feature">
        <span class="yf-lane__filterlbl"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-filter"></use></svg> Features</span>
        <button class="chip" type="button" aria-pressed="true"  data-filter-lane="gym" data-type="all">All</button>
        <button class="chip" type="button" aria-pressed="false" data-filter-lane="gym" data-type="weights">Free weights</button>
        <button class="chip" type="button" aria-pressed="false" data-filter-lane="gym" data-type="functional">Functional</button>
        <button class="chip" type="button" aria-pressed="false" data-filter-lane="gym" data-type="cardio">Cardio</button>
        <button class="chip" type="button" aria-pressed="false" data-filter-lane="gym" data-type="247">24/7</button>
        <button class="chip" type="button" aria-pressed="false" data-filter-lane="gym" data-type="sauna">Sauna</button>
        <button class="chip" type="button" aria-pressed="false" data-filter-lane="gym" data-type="crossfit">CrossFit</button>
      </div>

      <div class="yf-grid">
        <!-- Universe Gym -->
        <article class="yf-card" data-lane="gym" data-type="weights functional cardio 247" data-name="universe gym">
          <div class="yf-card__media">
            <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-gym-1.jpg"
                 alt="Free-weights area at Universe Gym, Pattaya" loading="lazy" width="600" height="450">
            <span class="yf-card__lanetag"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-dumbbell"></use></svg> Gym</span>
            <button class="yf-card__save" type="button" aria-pressed="false" aria-label="Save Universe Gym">
              <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="yf-card__body">
            <div class="yf-card__row"><h3>Universe Gym</h3></div>
            <div class="yf-card__row">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg>4.7 <span class="count">(540)</span></span>            </div>
            <div class="yf-card__fac" aria-label="Facilities">
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-clock"></use></svg> 24/7</span>
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-air-con"></use></svg> Air-con</span>
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-parking"></use></svg> Parking</span>
            </div>
            <span class="yf-card__loc"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-pin"></use></svg> Central Pattaya</span>
            <span class="yf-card__price">Drop-in from ฿200 <span>· monthly ฿1,500</span></span>
            <div class="yf-card__foot">
              <a class="btn btn--primary btn--sm" href="#">View details</a>
              <a class="btn btn--secondary btn--sm" href="#"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-map"></use></svg> Map</a>
              <button class="btn btn--secondary btn--sm yf-card__savebtn" type="button" aria-pressed="false" aria-label="Save Universe Gym">
                <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
            </div>
          </div>
        </article>

        <!-- Jomtien Sauna & Gym -->
        <article class="yf-card" data-lane="gym" data-type="weights cardio sauna" data-name="jomtien sauna gym">
          <div class="yf-card__media">
            <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-gym-1.jpg"
                 alt="Indoor plunge pool and sauna at Jomtien Sauna & Gym, Pattaya" loading="lazy" width="600" height="450">
            <span class="yf-card__lanetag"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-dumbbell"></use></svg> Gym</span>
            <button class="yf-card__save" type="button" aria-pressed="false" aria-label="Save Jomtien Sauna & Gym">
              <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="yf-card__body">
            <div class="yf-card__row"><h3>Jomtien Sauna &amp; Gym</h3></div>
            <div class="yf-card__row">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg>4.5 <span class="count">(318)</span></span>            </div>
            <div class="yf-card__fac" aria-label="Facilities">
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-water-sports"></use></svg> Pool</span>
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-air-con"></use></svg> Air-con</span>
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-card"></use></svg> Card</span>
            </div>
            <span class="yf-card__loc"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-pin"></use></svg> Jomtien</span>
            <span class="yf-card__price">Drop-in from ฿250 <span>· monthly ฿1,800</span></span>
            <div class="yf-card__foot">
              <a class="btn btn--primary btn--sm" href="#">View details</a>
              <a class="btn btn--secondary btn--sm" href="#"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-map"></use></svg> Map</a>
              <button class="btn btn--secondary btn--sm yf-card__savebtn" type="button" aria-pressed="false" aria-label="Save Jomtien Sauna & Gym">
                <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
            </div>
          </div>
        </article>

        <!-- James GYM -->
        <article class="yf-card" data-lane="gym" data-type="weights functional 247" data-name="james gym">
          <div class="yf-card__media">
            <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-gym-1.jpg"
                 alt="Dumbbell rack and weights floor at James GYM, Pattaya" loading="lazy" width="600" height="450">
            <span class="yf-card__lanetag"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-dumbbell"></use></svg> Gym</span>
            <button class="yf-card__save" type="button" aria-pressed="false" aria-label="Save James GYM">
              <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="yf-card__body">
            <div class="yf-card__row"><h3>James GYM</h3></div>
            <div class="yf-card__row">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg>4.6 <span class="count">(274)</span></span>            </div>
            <div class="yf-card__fac" aria-label="Facilities">
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-clock"></use></svg> 24/7</span>
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-parking"></use></svg> Parking</span>
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-card"></use></svg> Card</span>
            </div>
            <span class="yf-card__loc"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-pin"></use></svg> Pratumnak</span>
            <span class="yf-card__price">Drop-in from ฿180 <span>· monthly ฿1,400</span></span>
            <div class="yf-card__foot">
              <a class="btn btn--primary btn--sm" href="#">View details</a>
              <a class="btn btn--secondary btn--sm" href="#"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-map"></use></svg> Map</a>
              <button class="btn btn--secondary btn--sm yf-card__savebtn" type="button" aria-pressed="false" aria-label="Save James GYM">
                <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
            </div>
          </div>
        </article>

        <!-- Fitness7 -->
        <article class="yf-card" data-lane="gym" data-type="cardio functional crossfit" data-name="fitness7">
          <div class="yf-card__media">
            <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-gym-1.jpg"
                 alt="Functional training area at Fitness7, Pattaya" loading="lazy" width="600" height="450">
            <span class="yf-card__lanetag"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-dumbbell"></use></svg> Gym</span>
            <button class="yf-card__save" type="button" aria-pressed="false" aria-label="Save Fitness7">
              <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="yf-card__body">
            <div class="yf-card__row"><h3>Fitness7</h3></div>
            <div class="yf-card__row">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg>4.4 <span class="count">(196)</span></span>            </div>
            <div class="yf-card__fac" aria-label="Facilities">
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-air-con"></use></svg> Air-con</span>
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-card"></use></svg> Card</span>
            </div>
            <span class="yf-card__loc"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-pin"></use></svg> Naklua</span>
            <span class="yf-card__price">Drop-in from ฿220 <span>· monthly ฿1,600</span></span>
            <div class="yf-card__foot">
              <a class="btn btn--primary btn--sm" href="#">View details</a>
              <a class="btn btn--secondary btn--sm" href="#"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-map"></use></svg> Map</a>
              <button class="btn btn--secondary btn--sm yf-card__savebtn" type="button" aria-pressed="false" aria-label="Save Fitness7">
                <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
            </div>
          </div>
        </article>

        <!-- Coco Fitness -->
        <article class="yf-card" data-lane="gym" data-type="cardio functional weights" data-name="coco fitness">
          <div class="yf-card__media">
            <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-gym-1.jpg"
                 alt="Sea-view spin-bike studio at Coco Fitness, Pattaya" loading="lazy" width="600" height="450">
            <span class="yf-card__lanetag"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-dumbbell"></use></svg> Gym</span>
            <button class="yf-card__save" type="button" aria-pressed="false" aria-label="Save Coco Fitness">
              <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="yf-card__body">
            <div class="yf-card__row"><h3>Coco Fitness</h3></div>
            <div class="yf-card__row">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg>4.8 <span class="count">(231)</span></span>            </div>
            <div class="yf-card__fac" aria-label="Facilities">
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-sea-view"></use></svg> Sea view</span>
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-air-con"></use></svg> Air-con</span>
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-card"></use></svg> Card</span>
            </div>
            <span class="yf-card__loc"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-pin"></use></svg> Wong Amat</span>
            <span class="yf-card__price">Drop-in from ฿300 <span>· monthly ฿2,200</span></span>
            <div class="yf-card__foot">
              <a class="btn btn--primary btn--sm" href="#">View details</a>
              <a class="btn btn--secondary btn--sm" href="#"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-map"></use></svg> Map</a>
              <button class="btn btn--secondary btn--sm yf-card__savebtn" type="button" aria-pressed="false" aria-label="Save Coco Fitness">
                <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
            </div>
          </div>
        </article>

        <!-- Decathlon Pattaya -->
        <article class="yf-card" data-lane="gym" data-type="cardio functional weights" data-name="decathlon pattaya">
          <div class="yf-card__media">
            <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-gym-1.jpg"
                 alt="Cardio zone at the Decathlon Pattaya fitness area" loading="lazy" width="600" height="450">
            <span class="yf-card__lanetag"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-dumbbell"></use></svg> Fitness</span>
            <button class="yf-card__save" type="button" aria-pressed="false" aria-label="Save Decathlon Pattaya">
              <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="yf-card__body">
            <div class="yf-card__row"><h3>Decathlon Pattaya</h3></div>
            <div class="yf-card__row">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg>4.5 <span class="count">(402)</span></span>            </div>
            <div class="yf-card__fac" aria-label="Facilities">
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-parking"></use></svg> Parking</span>
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-air-con"></use></svg> Air-con</span>
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-card"></use></svg> Card</span>
            </div>
            <span class="yf-card__loc"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-pin"></use></svg> Central Pattaya</span>
            <span class="yf-card__price">Drop-in from ฿150 <span>· monthly ฿1,200</span></span>
            <div class="yf-card__foot">
              <a class="btn btn--primary btn--sm" href="#">View details</a>
              <a class="btn btn--secondary btn--sm" href="#"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-map"></use></svg> Map</a>
              <button class="btn btn--secondary btn--sm yf-card__savebtn" type="button" aria-pressed="false" aria-label="Save Decathlon Pattaya">
                <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
            </div>
          </div>
        </article>
      </div>
      <p class="yf-no-results" data-no-results="gym" style="display:none;color:var(--text-muted);margin-top:var(--s4)">No gyms match that feature yet — try another filter.</p>
    </div>
  </section>

  <!-- ===================== 6 · LANE 3 — MUAY THAI CAMPS ===================== -->
  <section class="yf-lane yf-lane--muay" id="lane-muay" aria-labelledby="lane-muay-h">
    <div class="yf-wrap">
      <div class="yf-lane__top">
        <div class="yf-lane__title">
          <span class="yf-lane__badge"><svg class="pg-icon is-28" aria-hidden="true"><use href="#pg-muay-thai"></use></svg></span>
          <div>
            <span class="kicker" style="color:var(--steel)">Lane 03 · Fight</span>
            <h2 id="lane-muay-h">Muay Thai Camps</h2>
          </div>
        </div>
        <span class="yf-lane__count">46 camps</span>
      </div>
      <p class="yf-lane__blurb" style="margin-bottom:var(--s4)">The art of eight limbs, taught by people who fight.
        Pads, bags and sparring — walk in for one session or train full-time.</p>

      <div class="filterbar" role="group" aria-label="Filter Muay Thai camps by program">
        <span class="yf-lane__filterlbl"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-filter"></use></svg> Program</span>
        <button class="chip" type="button" aria-pressed="true"  data-filter-lane="muay" data-type="all">All</button>
        <button class="chip" type="button" aria-pressed="false" data-filter-lane="muay" data-type="pro">Pro camp</button>
        <button class="chip" type="button" aria-pressed="false" data-filter-lane="muay" data-type="kids">Kids</button>
        <button class="chip" type="button" aria-pressed="false" data-filter-lane="muay" data-type="fightprep">Fight prep</button>
        <button class="chip" type="button" aria-pressed="false" data-filter-lane="muay" data-type="dropin">Drop-in</button>
      </div>

      <div class="yf-grid">
        <!-- My Start Muay Thai School & Boxing Club -->
        <article class="yf-card" data-lane="muay" data-type="kids dropin" data-name="my start muay thai school boxing club">
          <div class="yf-card__media">
            <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-muay-thai-1.jpg"
                 alt="Punching bags and ring at My Start Muay Thai School, Pattaya" loading="lazy" width="600" height="450">
            <span class="yf-card__lanetag"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-muay-thai"></use></svg> Muay Thai</span>
            <button class="yf-card__save" type="button" aria-pressed="false" aria-label="Save My Start Muay Thai School & Boxing Club">
              <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="yf-card__body">
            <div class="yf-card__row"><h3>My Start Muay Thai School</h3></div>
            <div class="yf-card__row">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg>4.9 <span class="count">(187)</span></span>            </div>
            <div class="yf-card__fac" aria-label="Facilities">
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-kids"></use></svg> Kids</span>
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-parking"></use></svg> Parking</span>
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-card"></use></svg> Card</span>
            </div>
            <span class="yf-card__loc"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-pin"></use></svg> Central Pattaya</span>
            <span class="yf-card__price">Drop-in from ฿350 <span>· monthly ฿3,500</span></span>
            <div class="yf-card__foot">
              <a class="btn btn--primary btn--sm" href="#">View details</a>
              <a class="btn btn--secondary btn--sm" href="#"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-map"></use></svg> Map</a>
              <button class="btn btn--secondary btn--sm yf-card__savebtn" type="button" aria-pressed="false" aria-label="Save My Start Muay Thai School & Boxing Club">
                <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
            </div>
          </div>
        </article>

        <!-- Sityodtong Muay Thai Camp -->
        <article class="yf-card" data-lane="muay" data-type="pro fightprep dropin" data-name="sityodtong muay thai camp">
          <div class="yf-card__media">
            <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-muay-thai-2.png"
                 alt="Sparring knee-strike drill at Sityodtong Muay Thai Camp, Pattaya" loading="lazy" width="600" height="450">
            <span class="yf-card__lanetag"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-muay-thai"></use></svg> Muay Thai</span>
            <button class="yf-card__save" type="button" aria-pressed="false" aria-label="Save Sityodtong Muay Thai Camp">
              <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="yf-card__body">
            <div class="yf-card__row"><h3>Sityodtong Muay Thai Camp</h3></div>
            <div class="yf-card__row">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg>4.9 <span class="count">(263)</span></span>            </div>
            <div class="yf-card__fac" aria-label="Facilities">
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-parking"></use></svg> Parking</span>
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-card"></use></svg> Card</span>
            </div>
            <span class="yf-card__loc"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-pin"></use></svg> Naklua</span>
            <span class="yf-card__price">Drop-in from ฿400 <span>· monthly ฿4,500</span></span>
            <div class="yf-card__foot">
              <a class="btn btn--primary btn--sm" href="#">View details</a>
              <a class="btn btn--secondary btn--sm" href="#"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-map"></use></svg> Map</a>
              <button class="btn btn--secondary btn--sm yf-card__savebtn" type="button" aria-pressed="false" aria-label="Save Sityodtong Muay Thai Camp">
                <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
            </div>
          </div>
        </article>

        <!-- Rage Fight Academy -->
        <article class="yf-card" data-lane="muay" data-type="pro fightprep" data-name="rage fight academy">
          <div class="yf-card__media">
            <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-muay-thai-3.jpg"
                 alt="MMA cage and mats at Rage Fight Academy, Pattaya" loading="lazy" width="600" height="450">
            <span class="yf-card__lanetag"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-muay-thai"></use></svg> Muay Thai</span>
            <button class="yf-card__save" type="button" aria-pressed="false" aria-label="Save Rage Fight Academy">
              <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="yf-card__body">
            <div class="yf-card__row"><h3>Rage Fight Academy</h3></div>
            <div class="yf-card__row">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg>4.8 <span class="count">(154)</span></span>            </div>
            <div class="yf-card__fac" aria-label="Facilities">
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-air-con"></use></svg> Air-con</span>
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-parking"></use></svg> Parking</span>
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-card"></use></svg> Card</span>
            </div>
            <span class="yf-card__loc"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-pin"></use></svg> Pratumnak</span>
            <span class="yf-card__price">Drop-in from ฿380 <span>· monthly ฿4,000</span></span>
            <div class="yf-card__foot">
              <a class="btn btn--primary btn--sm" href="#">View details</a>
              <a class="btn btn--secondary btn--sm" href="#"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-map"></use></svg> Map</a>
              <button class="btn btn--secondary btn--sm yf-card__savebtn" type="button" aria-pressed="false" aria-label="Save Rage Fight Academy">
                <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
            </div>
          </div>
        </article>

        <!-- Max Muay Thai Stadium -->
        <article class="yf-card" data-lane="muay" data-type="dropin" data-name="max muay thai stadium pattaya">
          <div class="yf-card__media">
            <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-muay-thai-1.jpg"
                 alt="Entrance facade of Max Muay Thai Stadium, Pattaya" loading="lazy" width="600" height="450">
            <span class="yf-card__lanetag"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-muay-thai"></use></svg> Muay Thai</span>
            <button class="yf-card__save" type="button" aria-pressed="false" aria-label="Save Max Muay Thai Stadium">
              <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="yf-card__body">
            <div class="yf-card__row"><h3>Max Muay Thai Stadium</h3></div>
            <div class="yf-card__row">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg>4.6 <span class="count">(901)</span></span>            </div>
            <div class="yf-card__fac" aria-label="Facilities">
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-parking"></use></svg> Parking</span>
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-card"></use></svg> Card</span>
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-accessible"></use></svg> Accessible</span>
            </div>
            <span class="yf-card__loc"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-pin"></use></svg> Central Pattaya</span>
            <span class="yf-card__price">Drop-in from ฿300 <span>· monthly ฿3,200</span></span>
            <div class="yf-card__foot">
              <a class="btn btn--primary btn--sm" href="#">View details</a>
              <a class="btn btn--secondary btn--sm" href="#"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-map"></use></svg> Map</a>
              <button class="btn btn--secondary btn--sm yf-card__savebtn" type="button" aria-pressed="false" aria-label="Save Max Muay Thai Stadium">
                <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
            </div>
          </div>
        </article>

        <!-- Fairtex Hotel -->
        <article class="yf-card" data-lane="muay" data-type="pro fightprep dropin" data-name="fairtex hotel">
          <div class="yf-card__media">
            <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-muay-thai-2.png"
                 alt="Functional training area at the Fairtex Hotel training camp, Pattaya" loading="lazy" width="600" height="450">
            <span class="yf-card__lanetag"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-muay-thai"></use></svg> Muay Thai</span>
            <button class="yf-card__save" type="button" aria-pressed="false" aria-label="Save Fairtex Hotel training camp">
              <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="yf-card__body">
            <div class="yf-card__row"><h3>Fairtex Training Camp</h3></div>
            <div class="yf-card__row">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg>4.7 <span class="count">(488)</span></span>            </div>
            <div class="yf-card__fac" aria-label="Facilities">
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-water-sports"></use></svg> Pool</span>
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-air-con"></use></svg> Air-con</span>
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-parking"></use></svg> Parking</span>
            </div>
            <span class="yf-card__loc"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-pin"></use></svg> Pratumnak</span>
            <span class="yf-card__price">Drop-in from ฿500 <span>· monthly ฿6,000</span></span>
            <div class="yf-card__foot">
              <a class="btn btn--primary btn--sm" href="#">View details</a>
              <a class="btn btn--secondary btn--sm" href="#"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-map"></use></svg> Map</a>
              <button class="btn btn--secondary btn--sm yf-card__savebtn" type="button" aria-pressed="false" aria-label="Save Fairtex Hotel training camp">
                <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
            </div>
          </div>
        </article>

        <!-- Boughanem Gym -->
        <article class="yf-card" data-lane="muay" data-type="pro fightprep" data-name="boughanem gym">
          <div class="yf-card__media">
            <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-muay-thai-3.jpg"
                 alt="Fighters training at Boughanem Gym, Pattaya" loading="lazy" width="600" height="450">
            <span class="yf-card__lanetag"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-muay-thai"></use></svg> Muay Thai</span>
            <button class="yf-card__save" type="button" aria-pressed="false" aria-label="Save Boughanem Gym">
              <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="yf-card__body">
            <div class="yf-card__row"><h3>Boughanem Gym</h3></div>
            <div class="yf-card__row">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg>4.8 <span class="count">(132)</span></span>            </div>
            <div class="yf-card__fac" aria-label="Facilities">
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-air-con"></use></svg> Air-con</span>
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-card"></use></svg> Card</span>
            </div>
            <span class="yf-card__loc"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-pin"></use></svg> Jomtien</span>
            <span class="yf-card__price">Drop-in from ฿450 <span>· monthly ฿5,000</span></span>
            <div class="yf-card__foot">
              <a class="btn btn--primary btn--sm" href="#">View details</a>
              <a class="btn btn--secondary btn--sm" href="#"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-map"></use></svg> Map</a>
              <button class="btn btn--secondary btn--sm yf-card__savebtn" type="button" aria-pressed="false" aria-label="Save Boughanem Gym">
                <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
            </div>
          </div>
        </article>

        <!-- Sudsakorn Muay Thai Gym -->
        <article class="yf-card" data-lane="muay" data-type="dropin kids" data-name="sudsakorn muay thai gym">
          <div class="yf-card__media">
            <img src="https://jsxtfodewyvxnplbtfnv.supabase.co/storage/v1/object/public/assets/pattaya-muay-thai-1.jpg"
                 alt="Pad-work training at Sudsakorn Muay Thai Gym, Pattaya" loading="lazy" width="600" height="450">
            <span class="yf-card__lanetag"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-muay-thai"></use></svg> Muay Thai</span>
            <button class="yf-card__save" type="button" aria-pressed="false" aria-label="Save Sudsakorn Muay Thai Gym">
              <svg class="pg-icon is-20" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
          </div>
          <div class="yf-card__body">
            <div class="yf-card__row"><h3>Sudsakorn Muay Thai Gym</h3></div>
            <div class="yf-card__row">
              <span class="rate"><svg class="pg-icon is-16 is-rating" aria-hidden="true"><use href="#pg-star"></use></svg>4.9 <span class="count">(109)</span></span>            </div>
            <div class="yf-card__fac" aria-label="Facilities">
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-kids"></use></svg> Kids</span>
              <span><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-parking"></use></svg> Parking</span>
            </div>
            <span class="yf-card__loc"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-pin"></use></svg> Jomtien</span>
            <span class="yf-card__price">Drop-in from ฿300 <span>· monthly ฿3,000</span></span>
            <div class="yf-card__foot">
              <a class="btn btn--primary btn--sm" href="#">View details</a>
              <a class="btn btn--secondary btn--sm" href="#"><svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-map"></use></svg> Map</a>
              <button class="btn btn--secondary btn--sm yf-card__savebtn" type="button" aria-pressed="false" aria-label="Save Sudsakorn Muay Thai Gym">
                <svg class="pg-icon is-16" aria-hidden="true"><use href="#pg-heart"></use></svg></button>
            </div>
          </div>
        </article>
      </div>
      <p class="yf-no-results" data-no-results="muay" style="display:none;color:var(--text-muted);margin-top:var(--s4)">No camps match that program yet — try another filter.</p>
    </div>
  </section>

  <!-- ===================== 7 · YOUR WEEKLY RHYTHM ===================== -->
  <section class="yf-week" aria-labelledby="yf-week-h">
    <div class="yf-wrap">
      <span class="kicker">Mix it up</span>
      <h2 id="yf-week-h">Your weekly rhythm</h2>
      <p class="yf-week__sub">A sample balanced week mixing all three lanes — adjust the intensity to taste.
        Rest days matter as much as training days.</p>
      <div class="yf-week__strip" role="list" aria-label="Sample seven-day training week">
        <div class="yf-day yf-day--yoga" role="listitem">
          <span class="yf-day__d">Mon</span>
          <span class="yf-day__ic" aria-hidden="true"><svg class="pg-icon is-20"><use href="#pg-wellness"></use></svg></span>
          <b>Vinyasa</b><span>Flow &amp; mobility</span>
        </div>
        <div class="yf-day yf-day--muay" role="listitem">
          <span class="yf-day__d">Tue</span>
          <span class="yf-day__ic" aria-hidden="true"><svg class="pg-icon is-20"><use href="#pg-muay-thai"></use></svg></span>
          <b>Muay Thai</b><span>Pads &amp; bag</span>
        </div>
        <div class="yf-day yf-day--gym" role="listitem">
          <span class="yf-day__d">Wed</span>
          <span class="yf-day__ic" aria-hidden="true"><svg class="pg-icon is-20"><use href="#pg-dumbbell"></use></svg></span>
          <b>Strength</b><span>Upper body</span>
        </div>
        <div class="yf-day yf-day--rest" role="listitem">
          <span class="yf-day__d">Thu</span>
          <span class="yf-day__ic" aria-hidden="true"><svg class="pg-icon is-20"><use href="#pg-moon"></use></svg></span>
          <b>Rest</b><span>Recover &amp; sleep</span>
        </div>
        <div class="yf-day yf-day--muay" role="listitem">
          <span class="yf-day__d">Fri</span>
          <span class="yf-day__ic" aria-hidden="true"><svg class="pg-icon is-20"><use href="#pg-muay-thai"></use></svg></span>
          <b>Muay Thai</b><span>Sparring</span>
        </div>
        <div class="yf-day yf-day--gym" role="listitem">
          <span class="yf-day__d">Sat</span>
          <span class="yf-day__ic" aria-hidden="true"><svg class="pg-icon is-20"><use href="#pg-dumbbell"></use></svg></span>
          <b>Functional</b><span>Cardio &amp; core</span>
        </div>
        <div class="yf-day yf-day--yoga" role="listitem">
          <span class="yf-day__d">Sun</span>
          <span class="yf-day__ic" aria-hidden="true"><svg class="pg-icon is-20"><use href="#pg-sun"></use></svg></span>
          <b>Yin</b><span>Restore &amp; stretch</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ===================== 8 · LOCAL TIP ===================== -->
  <section class="yf-tip" aria-labelledby="yf-tip-h">
    <div class="yf-wrap">
      <h2 id="yf-tip-h" class="kicker" style="margin-bottom:var(--s3)">Good to know</h2>
      <div class="alert alert--info">
        <svg class="pg-icon is-24 is-steel" aria-hidden="true"><use href="#pg-info"></use></svg>
        <div>
          <b>Try before you commit.</b> Almost every studio, gym and camp in Pattaya offers a discounted
          trial or first-session rate — ask at the desk before buying a package. Bring your own towel and water,
          and for Muay Thai, hand wraps; most camps lend gloves and pads for your first class. Walk-in drop-ins
          are normal, so you rarely need to plan ahead.
          <span class="yf-tip__verify">
            <svg class="pg-icon is-20 is-ocean" aria-hidden="true"><use href="#pg-local-verified"></use></svg>
            Prices &amp; trial offers checked on the ground by the Pattaya Guide local team.
          </span>
        </div>
      </div>
    </div>
  </section>

</div>
`

const SCRIPT = String.raw`
(function(){
  "use strict";
  var page = document.querySelector('.yf-page');
  if(!page) return;

  /* ---- Save toggles (heart on media + heart in footer; both per card) ---- */
  page.addEventListener('click', function(e){
    var save = e.target.closest('.yf-card__save, .yf-card__savebtn');
    if(save){
      var pressed = save.getAttribute('aria-pressed') === 'true';
      var card = save.closest('.yf-card');
      // keep both save controls in a card in sync
      if(card){
        card.querySelectorAll('.yf-card__save, .yf-card__savebtn').forEach(function(b){
          b.setAttribute('aria-pressed', String(!pressed));
        });
      } else {
        save.setAttribute('aria-pressed', String(!pressed));
      }
      return;
    }
  });

  /* ---- Lane filter chips: show/hide cards by data-type within a lane ---- */
  function applyFilter(lane, type){
    var grid = document.getElementById('lane-' + lane);
    if(!grid) return;
    var cards = grid.querySelectorAll('.yf-card[data-lane="' + lane + '"]');
    var shown = 0;
    cards.forEach(function(card){
      var types = (card.getAttribute('data-type') || '').split(/\s+/);
      var match = (type === 'all') || types.indexOf(type) !== -1;
      card.classList.toggle('is-hidden', !match);
      if(match) shown++;
    });
    var empty = document.querySelector('[data-no-results="' + lane + '"]');
    if(empty) empty.style.display = shown === 0 ? 'block' : 'none';
  }

  page.querySelectorAll('.chip[data-filter-lane]').forEach(function(chip){
    chip.addEventListener('click', function(){
      var lane = chip.getAttribute('data-filter-lane');
      var type = chip.getAttribute('data-type');
      // single-select per lane bar
      page.querySelectorAll('.chip[data-filter-lane="' + lane + '"]').forEach(function(c){
        c.setAttribute('aria-pressed', String(c === chip));
      });
      applyFilter(lane, type);
    });
  });

  /* ---- "Find your discipline" goal chips → reveal recommended lane ---- */
  var reveal = document.getElementById('yf-reveal');
  var revealTitle = document.getElementById('yf-reveal-title');
  var revealTip = document.getElementById('yf-reveal-tip');
  var revealLink = document.getElementById('yf-reveal-link');
  var revealIcUse = document.querySelector('#yf-reveal-ic use');
  var ICONS = { yoga:'#pg-wellness', gym:'#pg-dumbbell', muay:'#pg-muay-thai' };

  page.querySelectorAll('.yf-goal').forEach(function(goal){
    goal.addEventListener('click', function(){
      var already = goal.getAttribute('aria-pressed') === 'true';
      page.querySelectorAll('.yf-goal').forEach(function(g){ g.setAttribute('aria-pressed','false'); });
      if(already){ reveal.classList.remove('show'); return; }
      goal.setAttribute('aria-pressed','true');
      var laneKey = goal.getAttribute('data-goal');
      revealTitle.innerHTML = 'Head to ' + goal.getAttribute('data-lane');
      revealTip.textContent = goal.getAttribute('data-tip');
      revealLink.setAttribute('href', goal.getAttribute('data-anchor'));
      if(revealIcUse) revealIcUse.setAttribute('href', ICONS[laneKey] || '#pg-wellness');
      reveal.classList.add('show');
    });
  });

  /* ---- Hero search: jump to first matching card by name (no booking) ---- */
  var heroSearch = document.getElementById('yf-hero-search');
  function runSearch(){
    var q = (heroSearch.value || '').trim().toLowerCase();
    if(!q) return;
    var cards = page.querySelectorAll('.yf-card');
    for(var i=0;i<cards.length;i++){
      var name = (cards[i].getAttribute('data-name') || '');
      if(name.indexOf(q) !== -1 && !cards[i].classList.contains('is-hidden')){
        cards[i].scrollIntoView({behavior:'smooth', block:'center'});
        cards[i].style.outline = '3px solid var(--lagoon)';
        cards[i].style.outlineOffset = '3px';
        (function(c){ setTimeout(function(){ c.style.outline=''; c.style.outlineOffset=''; }, 1800); })(cards[i]);
        return;
      }
    }
  }
  if(heroSearch){
    heroSearch.addEventListener('keydown', function(e){ if(e.key === 'Enter') runSearch(); });
    var goBtn = heroSearch.parentElement.querySelector('.go');
    if(goBtn) goBtn.addEventListener('click', runSearch);
  }
})();
`

export default function YogaFitnessPage() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: HTML }} />
      <BlogScript script={SCRIPT} />
    </>
  )
}
