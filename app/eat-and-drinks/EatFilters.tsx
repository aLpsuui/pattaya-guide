'use client'
import { useEffect } from 'react'

// Client-side interactivity for the Eat & Drinks pillar:
// category chip filter, hero search, save-heart toggle and rooftop carousel.
// Operates on the server-rendered DOM (data-cat / data-name attributes),
// mirroring the original static page's vanilla script.
export default function EatFilters() {
  useEffect(() => {
    const filterBar = document.getElementById('catFilter')
    const grid = document.getElementById('eatGrid')
    const cards: HTMLElement[] = grid ? Array.from(grid.querySelectorAll('.eat-card')) : []
    const countEl = document.getElementById('resultCount')
    const emptyEl = document.getElementById('eatEmpty')

    let activeFilter = 'all'

    function render(query = '') {
      const q = query.trim().toLowerCase()
      let shown = 0
      cards.forEach(card => {
        const cats = (card.getAttribute('data-cat') || '').split(/\s+/)
        const matchCat = activeFilter === 'all' || cats.indexOf(activeFilter) !== -1
        const hay = (card.getAttribute('data-name') || '').toLowerCase()
        const matchQ = q === '' || hay.indexOf(q) !== -1
        const show = matchCat && matchQ
        card.classList.toggle('is-hidden', !show)
        if (show) shown++
      })
      if (countEl) countEl.textContent = shown + (shown === 1 ? ' place' : ' places')
      if (emptyEl) emptyEl.classList.toggle('on', shown === 0)
    }

    function onFilterClick(e: Event) {
      const btn = (e.target as HTMLElement).closest('.chip') as HTMLElement | null
      if (!btn || !filterBar) return
      filterBar.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', 'false'))
      btn.setAttribute('aria-pressed', 'true')
      activeFilter = btn.getAttribute('data-filter') || 'all'
      render()
    }
    if (filterBar) filterBar.addEventListener('click', onFilterClick)

    // Hero search
    const searchInput = document.getElementById('eatSearch') as HTMLInputElement | null
    const searchForm = searchInput?.closest('form') || null
    function onSearch() {
      if (!searchInput) return
      if (filterBar) {
        filterBar.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', 'false'))
        filterBar.querySelector('[data-filter="all"]')?.setAttribute('aria-pressed', 'true')
        activeFilter = 'all'
      }
      render(searchInput.value)
      if (searchInput.value.trim() !== '' && grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    function onSubmit(e: Event) { e.preventDefault(); onSearch() }
    function onInput() { if (searchInput && searchInput.value === '') render() }
    if (searchForm) searchForm.addEventListener('submit', onSubmit)
    if (searchInput) searchInput.addEventListener('input', onInput)

    // Save (favourite) toggle
    const saveBtns: HTMLElement[] = Array.from(document.querySelectorAll('[data-save]'))
    function onSave(this: HTMLElement, e: Event) {
      e.preventDefault()
      const active = this.classList.toggle('active')
      this.setAttribute('aria-pressed', active ? 'true' : 'false')
    }
    saveBtns.forEach(b => b.addEventListener('click', onSave))

    // Rooftop carousel scroll buttons
    const car = document.getElementById('roofCar')
    const carBtns: HTMLElement[] = Array.from(document.querySelectorAll('[data-car]'))
    function onCar(this: HTMLElement) {
      if (!car) return
      const step = Math.min(car.clientWidth * 0.9, 340)
      car.scrollBy({ left: this.getAttribute('data-car') === 'next' ? step : -step, behavior: 'smooth' })
    }
    carBtns.forEach(b => b.addEventListener('click', onCar))

    return () => {
      if (filterBar) filterBar.removeEventListener('click', onFilterClick)
      if (searchForm) searchForm.removeEventListener('submit', onSubmit)
      if (searchInput) searchInput.removeEventListener('input', onInput)
      saveBtns.forEach(b => b.removeEventListener('click', onSave))
      carBtns.forEach(b => b.removeEventListener('click', onCar))
    }
  }, [])

  return null
}
