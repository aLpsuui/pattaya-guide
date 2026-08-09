import type { CatConfig, SubView } from '@/app/components/CategoryListing'

// Single source of truth for the category hero configs (shared by each pillar's
// /page.tsx and its /[type] subcategory pages) and the per-subcategory hero copy.
//
// Keyed by the DB category slug. SUBCOPY keys are the venueGroups group keys.

export const CONFIGS: Record<string, CatConfig> = {
  'eat-and-drinks': {
    slug: 'eat-and-drinks',
    kicker: 'Eat & Drinks · Pattaya',
    h1: 'Where Pattaya actually eats',
    em: 'actually',
    lead: 'From morning latte art to late-night rooftop plates - a hand-picked, honestly-ranked guide to the city’s tables, cafés and bars. No paid placements.',
    heroImg: 'best-restaurants-pattaya.webp',
    heroImg2: 'nitan-coffee-pattaya.webp',
    badge: 'Locally verified · weekly',
    searchPlaceholder: 'Search restaurants, cafés, cuisines…',
    unit: 'places',
    typeLabel: 'Type',
    typeIcon: 'eat',
  },
  'thinks-to-do': {
    slug: 'thinks-to-do',
    path: '/things-to-do',
    kicker: 'Things to Do · Pattaya',
    h1: 'Your Pattaya adventure starts here',
    em: 'adventure',
    lead: 'Island day-trips and boat tours, scuba and snorkelling, jungle ATV runs and skydives, plus bikes, cars and jet skis to rent - real, locally checked operators in one place.',
    heroImg: 'pattaya-best-tours.webp',
    heroImg2: 'best-island-pattaya.webp',
    badge: 'Locally verified operators',
    searchPlaceholder: 'Search tours, diving, ATV, rentals…',
    unit: 'activities',
  },
  'nightlife': {
    slug: 'nightlife',
    kicker: 'Nightlife · Pattaya',
    h1: 'Where Pattaya comes alive after dark',
    em: 'comes alive',
    lead: 'From the world-ranked mega-clubs to legendary Walking Street discos, go-go bars and rooftop lounges - a locally verified guide to every kind of night out.',
    heroImg: 'pattaya-night-clubs-1.webp',
    heroImg2: 'pattaya-night-clubs-2.webp',
    badge: 'Locally verified · weekly',
    searchPlaceholder: 'Search clubs, bars, go-go, music…',
    unit: 'venues',
  },
  'yoga-and-fitness': {
    slug: 'yoga-and-fitness',
    kicker: 'Gym, Muay Thai & Yoga · Pattaya',
    h1: 'Train hard, recover well in Pattaya',
    em: 'Train hard',
    lead: "From world-famous Muay Thai camps to 24-hour fitness gyms, yoga and pilates studios and climbing walls - find where to train, with real prices and the city's highest-rated coaches.",
    heroImg: 'pattaya-muay-thai-1.webp',
    heroImg2: 'pattaya-yoga-1.webp',
    badge: 'Locally verified · weekly',
    searchPlaceholder: 'Search gyms, Muay Thai, yoga…',
    unit: 'venues',
  },
  'wellness-and-beauty': {
    slug: 'wellness-and-beauty',
    kicker: 'Wellness & Beauty · Pattaya',
    h1: 'Relax, restore and be pampered',
    em: 'restore',
    lead: 'From honest neighbourhood Thai-massage shops to luxury spa resorts and beauty salons - a locally verified guide to where Pattaya unwinds, with real prices and hours.',
    heroImg: 'pattaya-wellness-1.webp',
    heroImg2: 'best-restaurants-pattaya.webp',
    badge: 'Locally verified · weekly',
    searchPlaceholder: 'Search spa, massage, beauty…',
    unit: 'venues',
  },
}

// Per-subcategory hero copy + SEO title/description. Keys: category slug → group key.
export interface SubCopy extends SubView { title: string; description: string }

export const SUBCOPY: Record<string, Record<string, SubCopy>> = {
  'eat-and-drinks': {
    cafes: {
      key: 'cafes', label: 'Cafés & Coffee',
      h1: 'Where Pattaya drinks its coffee', em: 'coffee',
      lead: 'Specialty roasters, garden cafés and all-day brunch spots - the city’s best places for a proper flat white, cake and a slow morning.',
      title: 'Best Cafés & Coffee Shops in Pattaya | Go To Pattaya',
      description: 'A locally verified guide to the best cafés and specialty coffee in Pattaya - roasters, brunch spots and garden cafés, with real hours and directions.',
    },
    restaurants: {
      key: 'restaurants', label: 'Restaurants',
      h1: 'Where Pattaya actually eats', em: 'actually',
      lead: 'From Thai street classics to seafood grills and international kitchens - a hand-picked, honestly-ranked guide to the city’s best restaurants. No paid placements.',
      title: 'Best Restaurants in Pattaya | Go To Pattaya',
      description: 'An honest, editor-curated guide to the best restaurants in Pattaya - Thai, seafood and international. No pay-to-play. Filter by area to find where to eat.',
    },
    markets: {
      key: 'markets', label: 'Night Markets',
      h1: 'Pattaya’s best night markets', em: 'night markets',
      lead: 'Street-food stalls, cheap eats and buzzing weekend crowds - the city’s liveliest night markets for a plate-in-hand dinner.',
      title: 'Best Night Markets in Pattaya | Go To Pattaya',
      description: 'A locally verified guide to Pattaya’s night markets - the best street food, snacks and shopping after dark, with hours and directions.',
    },
  },
  'thinks-to-do': {
    temples: {
      key: 'temples', label: 'Temples & Culture',
      h1: 'Temples & culture in Pattaya', em: 'culture',
      lead: 'Golden temples, giant Buddhas and landmark attractions - the sights that give Pattaya its history and its best photos.',
      title: 'Temples, Culture & Landmarks in Pattaya | Go To Pattaya',
      description: 'A locally verified guide to temples, culture and landmark attractions in Pattaya - what to see, opening hours and how to get there.',
    },
    diving: {
      key: 'diving', label: 'Diving & Snorkeling',
      h1: 'Diving & snorkeling in Pattaya', em: 'Diving',
      lead: 'PADI dive schools, wreck dives and easy snorkelling trips to the near islands - clear water and real, checked operators.',
      title: 'Diving & Snorkeling in Pattaya | Go To Pattaya',
      description: 'A locally verified guide to diving and snorkelling in Pattaya - PADI schools, wreck dives and island snorkel trips, with prices and directions.',
    },
    beaches: {
      key: 'beaches', label: 'Beaches & Water Sports',
      h1: 'Beaches & water sports in Pattaya', em: 'Beaches',
      lead: 'Island beaches, jet skis, parasailing and water parks - everywhere to get on, in or under the water around Pattaya.',
      title: 'Beaches & Water Sports in Pattaya | Go To Pattaya',
      description: 'A locally verified guide to beaches and water sports in Pattaya - islands, jet skis, parasailing and water parks, with directions.',
    },
    adventure: {
      key: 'adventure', label: 'Adventure & Adrenaline',
      h1: 'Adventure & adrenaline in Pattaya', em: 'adrenaline',
      lead: 'ATV trails, zip-lines, bungee, skydiving and go-kart tracks - the biggest thrills in and around the city.',
      title: 'Adventure & Adrenaline Activities in Pattaya | Go To Pattaya',
      description: 'A locally verified guide to adventure and adrenaline in Pattaya - ATV, zip-lines, bungee, skydiving and karting, with prices and directions.',
    },
    rental: {
      key: 'rental', label: 'Bike & Car Rental',
      h1: 'Bike & car rental in Pattaya', em: 'rental',
      lead: 'Scooters, big bikes and cars from checked local shops - clear prices, deposits and the fine print, so you drive away sorted.',
      title: 'Bike & Car Rental in Pattaya | Go To Pattaya',
      description: 'A locally verified guide to bike and car rental in Pattaya - scooters, motorbikes and cars, with real prices, deposits and directions.',
    },
    tours: {
      key: 'tours', label: 'Tours & Day Trips',
      h1: 'Tours & day trips from Pattaya', em: 'day trips',
      lead: 'Coral-island boat tours, city sightseeing and further-afield day trips - real, locally checked operators, not commission desks.',
      title: 'Tours & Day Trips from Pattaya | Go To Pattaya',
      description: 'A locally verified guide to tours and day trips from Pattaya - island boat tours, sightseeing and transfers, with real operators and prices.',
    },
  },
  'nightlife': {
    gogo: {
      key: 'gogo', label: 'Go-Go Bars',
      h1: 'Go-go bars in Pattaya', em: 'Go-go',
      lead: 'Walking Street and beyond - the city’s best-known go-go bars, with the honest lowdown on vibe, drinks and door.',
      title: 'Go-Go Bars in Pattaya | Go To Pattaya',
      description: 'A locally verified guide to go-go bars in Pattaya - Walking Street and beyond, with the honest lowdown on vibe, hours and directions.',
    },
    clubs: {
      key: 'clubs', label: 'Clubs',
      h1: 'Nightclubs in Pattaya', em: 'Nightclubs',
      lead: 'World-ranked mega-clubs and Walking Street discos - where Pattaya dances until sunrise, with the music, cover and crowd for each.',
      title: 'Best Nightclubs in Pattaya | Go To Pattaya',
      description: 'A locally verified guide to nightclubs in Pattaya - mega-clubs, EDM and Walking Street discos, with music, hours and directions.',
    },
    bars: {
      key: 'bars', label: 'Bars & Lounges',
      h1: 'Bars & lounges in Pattaya', em: 'lounges',
      lead: 'Rooftop lounges, craft-beer bars and easy neighbourhood spots - a drink for every mood, honestly ranked.',
      title: 'Best Bars & Lounges in Pattaya | Go To Pattaya',
      description: 'A locally verified guide to bars and lounges in Pattaya - rooftops, craft beer and neighbourhood spots, with hours and directions.',
    },
  },
  'yoga-and-fitness': {
    'muay-thai': {
      key: 'muay-thai', label: 'Muay Thai',
      h1: 'Muay Thai camps in Pattaya', em: 'Muay Thai',
      lead: 'From tourist-friendly gyms to hardcore fighter camps - train the national sport with Pattaya’s highest-rated coaches.',
      title: 'Muay Thai Camps & Gyms in Pattaya | Go To Pattaya',
      description: 'A locally verified guide to Muay Thai in Pattaya - camps and gyms for beginners to fighters, with real prices and directions.',
    },
    'martial-arts': {
      key: 'martial-arts', label: 'Martial Arts',
      h1: 'Martial arts in Pattaya', em: 'Martial arts',
      lead: 'BJJ, MMA, taekwondo and climbing walls - cross-train or start something new with checked local academies.',
      title: 'Martial Arts & MMA in Pattaya | Go To Pattaya',
      description: 'A locally verified guide to martial arts in Pattaya - MMA, BJJ, taekwondo and climbing, with prices, hours and directions.',
    },
    yoga: {
      key: 'yoga', label: 'Yoga & Pilates',
      h1: 'Yoga & pilates in Pattaya', em: 'Yoga',
      lead: 'Studio classes, reformer pilates and drop-in flows - where Pattaya stretches, breathes and resets.',
      title: 'Yoga & Pilates Studios in Pattaya | Go To Pattaya',
      description: 'A locally verified guide to yoga and pilates in Pattaya - studios, reformer classes and drop-in flows, with prices and directions.',
    },
    gyms: {
      key: 'gyms', label: 'Gyms & Fitness',
      h1: 'Gyms & fitness in Pattaya', em: 'fitness',
      lead: '24-hour gyms, CrossFit boxes and full-service fitness clubs - where to lift, sweat and stay on programme.',
      title: 'Best Gyms & Fitness in Pattaya | Go To Pattaya',
      description: 'A locally verified guide to gyms and fitness in Pattaya - 24-hour gyms, CrossFit and fitness clubs, with prices, hours and directions.',
    },
  },
}
