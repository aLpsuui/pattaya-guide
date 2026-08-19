'use client'
import { useState, type ReactNode } from 'react'

// Sub-tabs for the analytics page: Google Analytics, Search Console, and the
// weekly AI SEO recommendations. All panels are server-rendered and passed in as
// nodes; we just toggle which one is visible (kept mounted via display:none so
// switching is instant).
export default function AnalyticsTabs({ ga, search, aiseo }: { ga: ReactNode; search: ReactNode; aiseo: ReactNode }) {
  const [tab, setTab] = useState<'ga' | 'sc' | 'ai'>('ga')
  return (
    <>
      <div className="seg an-tabs">
        <button className={tab === 'ga' ? 'on' : ''} onClick={() => setTab('ga')}>Google Analytics</button>
        <button className={tab === 'sc' ? 'on' : ''} onClick={() => setTab('sc')}>Search Console</button>
        <button className={tab === 'ai' ? 'on' : ''} onClick={() => setTab('ai')}>AI SEO</button>
      </div>
      <div style={{ display: tab === 'ga' ? 'block' : 'none' }}>{ga}</div>
      <div style={{ display: tab === 'sc' ? 'block' : 'none' }}>{search}</div>
      <div style={{ display: tab === 'ai' ? 'block' : 'none' }}>{aiseo}</div>
    </>
  )
}
