'use client'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// The floating concierge is interactive-only (no SEO value) and was hydrating in
// the initial bundle, adding to LCP render delay on mobile. Load it lazily:
// ssr:false keeps it out of the server HTML + main chunk, and we only mount it
// once the browser is idle after first paint, so it never competes with LCP.
const ChatWidget = dynamic(() => import('./ChatWidget'), { ssr: false })

export default function ChatWidgetLazy({ dict }: { dict?: Record<string, string> }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const ric: (cb: () => void) => number =
      (window as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback ||
      ((cb) => window.setTimeout(cb, 2000))
    const id = ric(() => setShow(true))
    return () => {
      const cic = (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback
      if (cic) cic(id)
      else window.clearTimeout(id)
    }
  }, [])
  return show ? <ChatWidget dict={dict} /> : null
}
