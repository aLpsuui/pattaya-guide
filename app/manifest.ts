import type { MetadataRoute } from 'next'
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: 'Go To Pattaya',
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#034487',
    icons: [
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { src: '/manifest-icon-192', sizes: '192x192', type: 'image/png' },
      { src: '/manifest-icon-512', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/manifest-icon-512', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
