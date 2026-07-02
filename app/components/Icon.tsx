// Go To Pattaya Icon System — 99 icons, stroke-based, currentColor
// Usage: <Icon name="search" size={20} className="text-blue-500" />

interface IconProps {
  name: string
  size?: number
  className?: string
  style?: React.CSSProperties
  'aria-hidden'?: boolean
}

const paths: Record<string, string> = {
  // Category & Discovery
  eat: '<path d="M5 3v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V3"/><path d="M8 11v10"/><path d="M19 21V3a4 4 0 0 0-4 4v6a2 2 0 0 0 2 2h2"/>',
  coffee: '<path d="M4 8h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 9h2.5a2.5 2.5 0 0 1 0 5H17"/><path d="M8 2.6c.6 1-.6 2 0 3"/><path d="M12 2.6c.6 1-.6 2 0 3"/>',
  bars: '<path d="M6 8h9v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z"/><path d="M15 11h2.5a2.5 2.5 0 0 1 0 5H15"/><path d="M6 11.5h9"/>',
  nightlife: '<path d="M5 5h14l-7 8z"/><path d="M12 13v6"/><path d="M8.5 19h7"/><path d="M14 8.5 18.5 5"/><circle cx="18.6" cy="4.9" r=".6" fill="currentColor" stroke="none"/>',
  tours: '<circle cx="12" cy="12" r="9"/><path d="M15.8 8.2 13.5 13.5 8.2 15.8 10.5 10.5z"/>',
  wellness: '<path d="M12 17C10 14.5 10 9.5 12 7c2 2.5 2 7.5 0 10z"/><path d="M12 17C9 16 6 14.5 5.5 11.5 8.5 11.8 11 13.5 12 17z"/><path d="M12 17c3-1 6-2.5 6.5-5.5C15.5 11.8 13 13.5 12 17z"/><path d="M5 18.6c2.4 1.3 11.6 1.3 14 0"/>',
  massage: '<ellipse cx="12" cy="7.5" rx="6" ry="2.3"/><ellipse cx="12" cy="12.5" rx="5" ry="2.1"/><ellipse cx="12" cy="17.3" rx="4" ry="2"/>',
  beach: '<path d="M4 12a8 8 0 0 1 16 0z"/><path d="M12 4v14"/><path d="M12 4c-2.4 1.4-3.9 4.4-3.9 8"/><path d="M12 4c2.4 1.4 3.9 4.4 3.9 8"/><path d="M9 21c1-1.2 2-1.2 3 0s2 1.2 3 0"/>',
  islands: '<path d="M6.5 19a5.5 5.5 0 0 1 11 0"/><path d="M13 19c0-3 .3-5.6 1-7.6"/><path d="M14 11.4c-1.6-1.6-3.9-2.2-5.9-1.6"/><path d="M14 11.4c1.6-1.6 3.9-2.2 5.9-1.6"/><path d="M14 11.4c-2.2-.8-4.7-.3-6.1 1.2"/><path d="M14 11.4c2.2-.8 4.7-.3 6.1 1.2"/><path d="M3 21c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0"/>',
  'water-sports': '<path d="M3 7q2.5-3 5 0t5 0t5 0"/><path d="M3 12q2.5-3 5 0t5 0t5 0"/><path d="M3 17q2.5-3 5 0t5 0t5 0"/>',
  diving: '<path d="M4 8h16a1.5 1.5 0 0 1 1.5 1.5V12a3.5 3.5 0 0 1-3.5 3.5h-1.6a2 2 0 0 1-1.9-1.3 1.6 1.6 0 0 0-3 0A2 2 0 0 1 7.6 15.5H6A3.5 3.5 0 0 1 2.5 12V9.5A1.5 1.5 0 0 1 4 8z"/><path d="M18 8V5.6a2 2 0 0 1 2-2"/>',
  stay: '<path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6"/><path d="M3 18h18"/><path d="M3 15h18"/><path d="M6 10V8.2A1.5 1.5 0 0 1 7.5 6.7h2A1.5 1.5 0 0 1 11 8.2V10"/><path d="M13 10V8.2a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 18 8.2V10"/><path d="M4 18v2"/><path d="M20 18v2"/>',
  shopping: '<path d="M5.5 8h13l-.9 11.1a2 2 0 0 1-2 1.9H8.4a2 2 0 0 1-2-1.9z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
  'muay-thai': '<path d="M7 9a4 4 0 0 1 8 0v2.5a3 3 0 0 1-3 3H7z"/><path d="M7 10.5H5.5a2 2 0 1 0 0 4H7"/><rect x="7" y="14.5" width="8" height="5" rx="1.5"/><path d="M7 17h8"/><path d="M11 7v3.5"/>',
  attractions: '<path d="M3.5 9 12 4l8.5 5"/><path d="M5 9h14"/><path d="M5.5 9v9"/><path d="M9.5 9v9"/><path d="M14.5 9v9"/><path d="M18.5 9v9"/><path d="M4 18h16"/><path d="M3 21h18"/>',
  transport: '<circle cx="6" cy="17.5" r="2.5"/><circle cx="18" cy="17.5" r="2.5"/><path d="M6 17.5 8.5 11H13"/><path d="M8 11h6"/><path d="M13.5 11 16 6.5h3"/><path d="M16 6.5 18 15"/><path d="M8.5 17.5h7"/>',
  // Core UI
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  menu: '<path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/>',
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5"/><path d="M9.5 21v-6h5v6"/>',
  map: '<path d="m9 4-6 2.5v13L9 17l6 2.5 6-2.5v-13L15 6.5z"/><path d="M9 4v13"/><path d="M15 6.5v13"/>',
  filter: '<path d="M3 5h18l-7 8v6l-4-2v-4z"/>',
  heart: '<path d="M12 20.3 4.6 12.9a4.7 4.7 0 0 1 6.6-6.6l.8.8.8-.8a4.7 4.7 0 0 1 6.6 6.6z"/>',
  share: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.8 7.6-3.6"/><path d="m8.2 13.2 7.6 3.6"/>',
  'arrow-left': '<path d="M19 12H5"/><path d="m11 6-6 6 6 6"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  'chevron-right': '<path d="m9 6 6 6-6 6"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  close: '<path d="M6 6 18 18"/><path d="M18 6 6 18"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M5 21c0-3.9 3.1-7 7-7s7 3.1 7 7"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.6 2.5 4 5.7 4 9s-1.4 6.5-4 9c-2.6-2.5-4-5.7-4-9s1.4-6.5 4-9z"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M3.5 9.5h17"/><path d="M8 3v4"/><path d="M16 3v4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 13.5a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H10a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V10a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
  pin: '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
  'external-link': '<path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"/>',
  // Venue Meta
  star: '<path d="M12 2.6 14.85 8.4 21.2 9.3l-4.6 4.4 1.1 6.3L12 17.4 6.3 20l1.1-6.3-4.6-4.4 6.35-.9z"/>',
  price: '<path d="M3.6 11.6 11.6 3.6a2 2 0 0 1 1.4-.6H19a2 2 0 0 1 2 2v6a2 2 0 0 1-.6 1.4l-8 8a2 2 0 0 1-2.8 0l-6-6a2 2 0 0 1 0-2.8z"/><circle cx="16" cy="8" r="1.3" fill="currentColor" stroke="none"/>',
  'open-now': '<circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.5 2.5 4.5-5"/>',
  phone: '<path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5z"/>',
  directions: '<path d="M21 3 3 10.5l7.5 2.8 2.8 7.5z"/><path d="m21 3-10.7 10.3"/>',
  wifi: '<path d="M2.5 8.5a16 16 0 0 1 19 0"/><path d="M5.5 12a11 11 0 0 1 13 0"/><path d="M8.5 15.5a6 6 0 0 1 7 0"/><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none"/>',
  parking: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M9.5 16.5v-9h3.5a2.75 2.75 0 0 1 0 5.5H9.5"/>',
  'sea-view': '<circle cx="12" cy="8.5" r="3.2"/><path d="M3 16c1.6-1.6 3.4-1.6 5 0s3.4 1.6 5 0 3.4-1.6 5 0"/><path d="M3 19.5c1.6-1.6 3.4-1.6 5 0s3.4 1.6 5 0 3.4-1.6 5 0"/>',
  outdoor: '<path d="M4 20C4 12 9 5 20 5c0 9-6 15-15 15"/><path d="M4.5 19.5c4-8 8-9 11-9.4"/>',
  'air-con': '<path d="M12 3v18"/><path d="M4.5 7.5 19.5 16.5"/><path d="M19.5 7.5 4.5 16.5"/><path d="m9.8 5.2 2.2-2 2.2 2"/><path d="m9.8 18.8 2.2 2 2.2-2"/><path d="m4.5 10.5-.3-3 2.9.8"/><path d="m19.5 13.5.3 3-2.9-.8"/><path d="m19.5 10.5.3-3-2.9.8"/><path d="m4.5 13.5-.3 3 2.9-.8"/>',
  languages: '<path d="M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v7a1.5 1.5 0 0 1-1.5 1.5H10l-4 3.5V15H5.5A1.5 1.5 0 0 1 4 13.5z"/><path d="M8 9h8"/><path d="M8 12h5"/>',
  verified: '<path d="M12 3 5 6v6c0 4 3 6.6 7 8 4-1.4 7-4 7-8V6z"/><path d="m9 12 2 2 4-4.5"/>',
  card: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3 9.5h18"/><path d="M7 14.5h3"/>',
  ticket: '<path d="M4 7.5A1.5 1.5 0 0 1 5.5 6h13A1.5 1.5 0 0 1 20 7.5v2a2 2 0 0 0 0 4v2a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 15.5v-2a2 2 0 0 0 0-4z"/><path d="M14 6.5v11" strokeDasharray="1.6 2"/>',
  // Brand
  sun: '<circle cx="12" cy="12" r="4.3"/><path d="M12 2v2.4"/><path d="M12 19.6V22"/><path d="m4.4 4.4 1.7 1.7"/><path d="m17.9 17.9 1.7 1.7"/><path d="M2 12h2.4"/><path d="M19.6 12H22"/><path d="m4.4 19.6 1.7-1.7"/><path d="m17.9 6.1 1.7-1.7"/>',
  sunset: '<path d="M7 18a5 5 0 0 1 10 0"/><path d="M3 18h2.5"/><path d="M18.5 18H21"/><path d="M12 3v6"/><path d="m9 6.2 3 3 3-3"/><path d="m4.6 12.6 1.6 1.2"/><path d="m19.4 12.6-1.6 1.2"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"/><path d="m17 5 .6 1.5L19 7l-1.4.5L17 9l-.6-1.5L15 7l1.4-.5z" fill="currentColor" stroke="none"/>',
  live: '<circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4"/><path d="M16.2 16.2a6 6 0 0 0 0-8.4"/><path d="M5 5a10 10 0 0 0 0 14"/><path d="M19 19a10 10 0 0 0 0-14"/>',
  'editors-pick': '<circle cx="12" cy="9" r="5.5"/><path d="m12 6.3 1 2 2.2.3-1.6 1.5.4 2.2-2-1.1-2 1.1.4-2.2L9 8.6l2.2-.3z" fill="currentColor" stroke="none"/><path d="M8 13.6 6.5 21 12 18.2 17.5 21 16 13.6"/>',
  'local-verified': '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><path d="m9.2 9.9 2 2 3.6-3.8"/>',
  'near-me': '<circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="2.1" fill="currentColor" stroke="none"/><path d="M12 2v3"/><path d="M12 19v3"/><path d="M2 12h3"/><path d="M19 12h3"/>',
  bookmark: '<path d="M6.5 4.5h11a1 1 0 0 1 1 1V21l-6.5-4-6.5 4V5.5a1 1 0 0 1 1-1z"/>',
  // Travel
  plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  bus: '<rect x="4" y="3.5" width="16" height="13" rx="2.5"/><path d="M4 10.5h16"/><path d="M9 7h6"/><path d="M4 13.5h1"/><path d="M19 13.5h1"/><circle cx="8" cy="17.5" r="1.7"/><circle cx="16" cy="17.5" r="1.7"/>',
  ferry: '<path d="M4 14h16l-2 4H6z"/><path d="M7 14v-4h7l2 4"/><path d="M9.5 11.5h3"/><path d="M10 10V7.5"/><path d="M3 20.5c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0"/>',
  train: '<rect x="5" y="3.5" width="14" height="13" rx="3"/><path d="M5 11h14"/><path d="M9 7h6"/><circle cx="9" cy="13.8" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="13.8" r="1" fill="currentColor" stroke="none"/><path d="M9 16.5 7 20"/><path d="M15 16.5 17 20"/>',
  taxi: '<path d="M3 16v-3.3a2 2 0 0 1 1.4-1.9L6 10.3l1.7-3.5A2 2 0 0 1 9.5 5.6h5a2 2 0 0 1 1.8 1.2L18 10.3l1.6.5A2 2 0 0 1 21 12.7V16"/><path d="M3 16h2"/><path d="M9.5 16h5"/><path d="M19 16h2"/><circle cx="7.5" cy="16.8" r="1.8"/><circle cx="16.5" cy="16.8" r="1.8"/><rect x="10" y="3" width="4" height="2.4" rx=".6"/>',
  car: '<path d="M3 16v-3.3a2 2 0 0 1 1.4-1.9L6 10.3l1.7-3.5A2 2 0 0 1 9.5 5.6h5a2 2 0 0 1 1.8 1.2L18 10.3l1.6.5A2 2 0 0 1 21 12.7V16"/><path d="M3 16h2"/><path d="M9.5 16h5"/><path d="M19 16h2"/><circle cx="7.5" cy="16.8" r="1.8"/><circle cx="16.5" cy="16.8" r="1.8"/>',
  songthaew: '<path d="M2 16V9h11v7"/><path d="M13 16v-4h3l2.5 3v1"/><path d="M2 12.5h11"/><path d="M5.5 9V6.5h7V9"/><circle cx="6" cy="16.5" r="1.7"/><circle cx="16" cy="16.5" r="1.7"/>',
  walk: '<circle cx="12.5" cy="4" r="2"/><path d="M12.5 6.5 10.5 12l2 1.5 1.5 6.5"/><path d="M10.5 12 9 17l-1.5 3"/><path d="M11 9l2.5 1.5"/>',
  luggage: '<rect x="5" y="8" width="14" height="12" rx="2.5"/><path d="M9 8V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V8"/><path d="M9.5 8v12"/><path d="M14.5 8v12"/>',
  passport: '<rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="9.5" r="2.8"/><path d="M10.5 9.5h3"/><path d="M9.5 16h5"/>',
  route: '<circle cx="6.5" cy="18.5" r="2.5"/><circle cx="17.5" cy="5.5" r="2.5"/><path d="M9 18.5h6a3.5 3.5 0 0 0 0-7H8a3.5 3.5 0 0 1 0-7h7"/>',
  anchor: '<circle cx="12" cy="5" r="2.5"/><path d="M12 7.5v13.5"/><path d="M5 13a7 7 0 0 0 14 0"/><path d="M5 13H3"/><path d="M19 13h2"/><path d="M9 9.5h6"/>',
  // Weather & Money
  rain: '<path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2"/><path d="M16 15v5"/><path d="M8 15v5"/><path d="M12 17v4"/>',
  storm: '<path d="M6 16.3A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 .5 9"/><path d="m13 12-3 5h4l-3 5"/>',
  umbrella: '<path d="M12 13v6a2.5 2.5 0 0 0 5 0"/><path d="M3 12a9 9 0 0 1 18 0z"/><path d="M12 3v9"/>',
  temperature: '<path d="M14 4.5a2.5 2.5 0 0 0-5 0v9.8a4 4 0 1 0 5 0z"/><circle cx="11.5" cy="17.5" r="1.6" fill="currentColor" stroke="none"/><path d="M11.5 16V8"/>',
  humidity: '<path d="M12 3.1 6.7 8.4a7.5 7.5 0 1 0 10.6 0z"/><path d="M9.5 14a2.5 2.5 0 0 0 2 2.4"/>',
  wind: '<path d="M3 8h10a2.5 2.5 0 1 0-2.5-2.6"/><path d="M3 12h15a2.5 2.5 0 1 1-2.5 2.6"/><path d="M3 16h7a2 2 0 1 1-2 2.1"/>',
  coins: '<circle cx="9" cy="9" r="5.5"/><path d="M8 7h1.5v4"/><path d="M16.2 9.3a5.5 5.5 0 1 1-7 7.4"/>',
  wallet: '<path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3"/><path d="M4 7.5V17a2 2 0 0 0 2 2h13a1 1 0 0 0 1-1v-3"/><path d="M21 9.5h-4a2.5 2.5 0 0 0 0 5h4a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1z"/>',
  cash: '<rect x="2.5" y="6.5" width="19" height="11" rx="2.5"/><circle cx="12" cy="12" r="2.3"/><path d="M6 9.5v5"/><path d="M18 9.5v5"/>',
  exchange: '<path d="M16 3.5 20 7.5l-4 4"/><path d="M20 7.5H8.5"/><path d="M8 20.5 4 16.5l4-4"/><path d="M4 16.5h11.5"/>',
  discount: '<path d="M3.6 11.6 11.6 3.6a2 2 0 0 1 1.4-.6H19a2 2 0 0 1 2 2v6a2 2 0 0 1-.6 1.4l-8 8a2 2 0 0 1-2.8 0l-6-6a2 2 0 0 1 0-2.8z"/><path d="m9.5 13.5 4-4"/><circle cx="9.7" cy="9.7" r=".7" fill="currentColor" stroke="none"/><circle cx="13.3" cy="13.3" r=".7" fill="currentColor" stroke="none"/>',
  gift: '<rect x="3.5" y="8.5" width="17" height="5" rx="1"/><path d="M5 13.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6.5"/><path d="M12 8.5V21"/><path d="M12 8.5C12 6 10.8 4.5 9 4.5a2 2 0 0 0 0 4z"/><path d="M12 8.5c0-2.5 1.2-4 3-4a2 2 0 0 1 0 4z"/>',
  // Safety & Health
  'shield-alert': '<path d="M12 3 5 6v6c0 4 3 6.6 7 8 4-1.4 7-4 7-8V6z"/><path d="M12 8.5v4"/><circle cx="12" cy="15.5" r=".7" fill="currentColor" stroke="none"/>',
  warning: '<path d="M12 4 2.7 20a1 1 0 0 0 .9 1.5h16.8a1 1 0 0 0 .9-1.5z"/><path d="M12 9.5v4.5"/><circle cx="12" cy="17.5" r=".7" fill="currentColor" stroke="none"/>',
  'first-aid': '<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7"/><path d="M12 10.5v6"/><path d="M9 13.5h6"/>',
  pharmacy: '<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7z"/><path d="m8.5 8.5 7 7"/>',
  police: '<path d="M7 18v-3a5 5 0 0 1 10 0v3z"/><path d="M5 21h14"/><path d="M12 6V3.5"/><path d="m5.5 9-1.5-1"/><path d="m18.5 9 1.5-1"/><circle cx="12" cy="3" r=".6" fill="currentColor" stroke="none"/>',
  emergency: '<path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4.5 6.2 2 2 0 0 1 6.5 4z"/><path d="M19 3v4"/><path d="M17 5h4"/>',
  insurance: '<path d="M12 3 5 6v6c0 4 3 6.6 7 8 4-1.4 7-4 7-8V6z"/><path d="M12 16.5s-3.3-2-3.3-4.4a1.8 1.8 0 0 1 3.3-1 1.8 1.8 0 0 1 3.3 1c0 2.4-3.3 4.4-3.3 4.4z"/>',
  'scam-alert': '<path d="M12 3 5 6v6c0 4 3 6.6 7 8 4-1.4 7-4 7-8V6z"/><path d="m9.8 9.8 4.4 4.4"/><path d="m14.2 9.8-4.4 4.4"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="8" r=".8" fill="currentColor" stroke="none"/>',
  kids: '<circle cx="12" cy="5" r="2.2"/><path d="M12 7.2v6.5"/><path d="M8.5 9.5h7"/><path d="m9 20 3-6 3 6"/>',
  family: '<circle cx="8" cy="6" r="2.5"/><path d="M3.5 20v-3.5a4.5 4.5 0 0 1 9 0V20"/><circle cx="16.5" cy="8" r="1.8"/><path d="M14 20v-3a3 3 0 0 1 6 0v3"/>',
  baby: '<path d="M9 9h6v8.5a3 3 0 0 1-3 3 3 3 0 0 1-3-3z"/><path d="M9.3 9 8.8 6.8h6.4L14.7 9"/><path d="M11 3.5h2v2.3h-2z"/><path d="M9.5 12.5h5"/><path d="M9.5 15h5"/>',
  accessible: '<circle cx="13" cy="4.3" r="1.7"/><path d="M13 6.5v6h4.5l1.5 5.5"/><path d="M13 9.5H9"/><circle cx="11" cy="16.5" r="4.8"/>',
  paw: '<circle cx="6.5" cy="11" r="1.7"/><circle cx="10.5" cy="8" r="1.7"/><circle cx="14.5" cy="8" r="1.7"/><circle cx="18" cy="11.5" r="1.7"/><path d="M8.5 15.5c1.6-2.3 5.4-2.3 7 0 .9 1.3.6 3-1.1 3.5-1.5.5-3.3.5-4.8 0-1.7-.5-2-2.2-1.1-3.5z"/>',
}

export default function Icon({ name, size = 24, className, style, 'aria-hidden': ariaHidden = true }: IconProps) {
  const p = paths[name]
  if (!p) return null
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden={ariaHidden}
      dangerouslySetInnerHTML={{ __html: p }}
    />
  )
}
