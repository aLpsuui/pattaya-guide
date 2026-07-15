'use client'
import { useState, type ReactNode } from 'react'

// Two sub-tabs for the analytics page: Google Analytics and Search Console.
// Both panels are server-rendered and passed in as nodes; we just toggle which
// one is visible (kept mounted via display:none so switching is instant).
export default function AnalyticsTabs({ ga, search }: { ga: ReactNode; search: ReactNode }) {
  const [tab, setTab] = useState<'ga' | 'sc'>('ga')
  return (
    <>
      <div className="seg an-tabs">
        <button className={tab === 'ga' ? 'on' : ''} onClick={() => setTab('ga')}>Google Analytics</button>
        <button className={tab === 'sc' ? 'on' : ''} onClick={() => setTab('sc')}>Search Console</button>
      </div>
      <div style={{ display: tab === 'ga' ? 'block' : 'none' }}>{ga}</div>
      <div style={{ display: tab === 'sc' ? 'block' : 'none' }}>{search}</div>
    </>
  )
}
