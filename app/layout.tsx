import type { Metadata } from 'next'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MobileTabBar from './components/MobileTabBar'

export const metadata: Metadata = {
  title: 'Pattaya Guide — The honest local guide to Pattaya',
  description: '600+ verified places. Restaurants, beaches, tours, wellness and more.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
