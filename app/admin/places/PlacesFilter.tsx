'use client'
import { useEffect } from 'react'

// Client filter for the Places table: search by name, filter by category and
// by status. Operates on the server-rendered rows (data-name / data-cat /
// data-status), so all CRUD stays server-side.
export default function PlacesFilter() {
  useEffect(() => {
    const search = document.getElementById('placeSearch') as HTMLInputElement | null
    const catSel = document.getElementById('placeCat') as HTMLSelectElement | null
    const chipsWrap = document.getElementById('placeChips')
    const countEl = document.getElementById('placeCount')
    const emptyRow = document.getElementById('placeEmpty')
    const rows: HTMLElement[] = Array.from(document.querySelectorAll('tr[data-name]'))

    let status = 'all'

    function render() {
      const q = (search?.value || '').trim().toLowerCase()
      const cat = catSel?.value || 'all'
      let shown = 0
      rows.forEach((r) => {
        const okQ = !q || (r.getAttribute('data-name') || '').includes(q)
        const okCat = cat === 'all' || (r.getAttribute('data-cat') || '') === cat
        const okSt = status === 'all' || (r.getAttribute('data-status') || '') === status
        const match = okQ && okCat && okSt
        r.style.display = match ? '' : 'none'
        if (match) shown++
      })
      if (countEl) countEl.textContent = String(shown)
      if (emptyRow) emptyRow.style.display = shown === 0 ? '' : 'none'
    }

    function onChip(e: Event) {
      const b = (e.target as HTMLElement).closest('button[data-status]') as HTMLElement | null
      if (!b || !chipsWrap) return
      chipsWrap.querySelectorAll('button[data-status]').forEach((c) => c.classList.remove('active'))
      b.classList.add('active')
      status = b.getAttribute('data-status') || 'all'
      render()
    }

    search?.addEventListener('input', render)
    catSel?.addEventListener('change', render)
    chipsWrap?.addEventListener('click', onChip)
    render()

    return () => {
      search?.removeEventListener('input', render)
      catSel?.removeEventListener('change', render)
      chipsWrap?.removeEventListener('click', onChip)
    }
  }, [])

  return null
}
