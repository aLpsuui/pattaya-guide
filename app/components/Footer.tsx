import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="brand">
              <svg viewBox="0 0 220 240" xmlns="http://www.w3.org/2000/svg" width="36">
                <path fill="#fff" d="M110 8C56 8 14 49 14 102c0 70 78 122 92 128 3 1 5 1 8 0 14-6 92-58 92-128C206 49 164 8 110 8Z"/>
                <circle cx="110" cy="98" r="74" fill="#054C86"/>
                <circle cx="110" cy="80" r="20" fill="#2FBDDC"/>
                <path fill="#A3CBE5" d="M44 120c14-10 24-10 38 0s24 10 38 0 24-10 38 0 24 10 38 0v22c-14 10-24 10-38 0s-24-10-38 0-24-10-38 0-24-10-38 0Z"/>
              </svg>
              <div className="wm"><i style={{color:'#fff'}}>Pattaya</i><u>Guide</u></div>
            </Link>
            <p>Your complete guide to Pattaya. 600+ places · 50+ guides · Updated weekly · Free to use, no signup required.</p>
            <div className="socials">
              <a href="#" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg></a>
              <a href="#" aria-label="TikTok"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.5 7.5a5.5 5.5 0 0 1-4.5-2.4V16a5 5 0 1 1-5-5v3a2 2 0 1 0 2 2V2h3a5.5 5.5 0 0 0 4.5 5.5Z"/></svg></a>
              <a href="#" aria-label="YouTube"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8A26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5 3-5 3Z"/></svg></a>
              <a href="#" aria-label="Facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M14 13.5h2.5l1-4H14v-2c0-1 .5-2 2-2h1.5V2.1S16.1 2 14.7 2C11.9 2 10 3.7 10 6.9V9.5H7v4h3V22h4v-8.5Z"/></svg></a>
            </div>
          </div>
          <div>
            <h5>Explore</h5>
            <ul>
              <li><a href="#">Eat &amp; Coffee</a></li>
              <li><a href="#">Beaches &amp; Islands</a></li>
              <li><a href="#">Things to do</a></li>
              <li><a href="#">Wellness &amp; Spa</a></li>
              <li><a href="#">Sports &amp; Adventure</a></li>
              <li><a href="#">Markets &amp; Shopping</a></li>
            </ul>
          </div>
          <div>
            <h5>Districts</h5>
            <ul>
              <li><a href="#">Central Pattaya</a></li>
              <li><a href="#">Jomtien</a></li>
              <li><a href="#">Pratumnak Hill</a></li>
              <li><a href="#">Naklua</a></li>
              <li><a href="#">Koh Larn Island</a></li>
            </ul>
          </div>
          <div>
            <h5>Plan</h5>
            <ul>
              <li><a href="#">Best time to visit</a></li>
              <li><a href="#">Bangkok → Pattaya</a></li>
              <li><a href="#">Where to stay</a></li>
              <li><a href="#">First-time tips</a></li>
              <li><a href="#">Itineraries</a></li>
              <li><a href="#">Editorial standards</a></li>
            </ul>
          </div>
          <div>
            <h5>About</h5>
            <ul>
              <li><a href="#">About us</a></li>
              <li><a href="#">Editorial team</a></li>
              <li><a href="#">Travel blog</a></li>
              <li><a href="#">Submit a venue</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Pattaya Guide · Made in Pattaya 🇹🇭</span>
          <div className="legal">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
            <a href="#">Editorial standards</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
