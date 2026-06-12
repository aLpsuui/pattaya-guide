import type { Metadata } from 'next'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MobileTabBar from './components/MobileTabBar'

export const metadata: Metadata = {
  title: 'Go To Pattaya — Your complete guide to Pattaya',
  description: '600+ verified places, 50+ in-depth guides. Restaurants, beaches, tours, wellness and more.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <MobileTabBar />
      </body>
    </html>
  )
}
