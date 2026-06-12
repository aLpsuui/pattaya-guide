'use client'
import { useEffect } from 'react'

export default function BlogScript({ script }: { script: string }) {
  useEffect(() => {
    const el = document.createElement('script')
    el.textContent = script
    document.body.appendChild(el)
    return () => { document.body.removeChild(el) }
  }, [script])
  return null
}