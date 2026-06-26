'use client'
import { useEffect } from 'react'

// Client interactivity for the left-rail category directory.
// Operates on the server-rendered DOM (data-cat / data-area / data-name …).
//   · primary TYPE  — single select (radio rail)
//   · AREA          — multi select (checkboxes)
//   · search · sort · active chips · count · load-more · mobile drawer
export default function EatFilters() {
  useEffect(() => {
    const dir = document.getElementById('eatDir')
    const grid = document.getElementById('eatGrid')
    if (!dir || !grid) return
    const cards: HTMLElement[] = Array.from(grid.querySelectorAll('.eat-card'))
    const countEl = document.getElementById('resultCount')
    const activeEl = document.getElementById('eatActive')
    const emptyEl = document.getElementById('eatEmpty')
    const typeBar = document.getElementById('typeFilter')
    const clearBtn = document.getElementById('clearFilters')
    const sortSel = document.getElementById('sortSel') as HTMLSelectElement | null
    const badge = document.getElementById('filterBadge')
    const loadMoreBtn = document.getElementById('loadMore')
    const searchInput = document.getElementById('eatSearch') as HTMLInputElement | null
    const searchForm = searchInput?.closest('form') || null
    const unit = grid.getAttribute('data-unit') || 'places'
    const unitSingular = grid.getAttribute('data-unit-singular') || unit.replace(/s$/, '')

    const STEP = 18
    const state = { primary: 'all', sort: 'editor', q: '', areas: new Set<string>(), limit: STEP }

    const areaLabel = (slug: string) => {
      const inp = document.querySelector(`.fopt input[data-group="area"][value="${slug}"]`)
      return inp?.getAttribute('data-label') || slug
    }
    const typeLabel = (slug: string) => {
      const b = typeBar?.querySelector(`button[data-type="${slug}"]`)
      return b?.getAttribute('data-label') || slug
    }

    function matchCard(card: HTMLElement) {
      if (state.primary !== 'all' && (card.getAttribute('data-cat') || '') !== state.primary) return false
      if (state.areas.size && !state.areas.has(card.getAttribute('data-area') || '')) return false
      if (state.q) {
        const hay = (card.getAttribute('data-name') || '').toLowerCase()
        if (hay.indexOf(state.q) === -1) return false
      }
      return true
    }

    function sortVisible(list: HTMLElement[]) {
      const s = state.sort
      return list.slice().sort((a, b) => {
        if (s === 'rating') return (+(b.dataset.rating || 0)) - (+(a.dataset.rating || 0))
        if (s === 'reviews') return (+(b.dataset.reviews || 0)) - (+(a.dataset.reviews || 0))
        if (s === 'az') return (a.dataset.sortname || '').localeCompare(b.dataset.sortname || '')
        return (+(a.dataset.order || 999)) - (+(b.dataset.order || 999))
      })
    }

    function renderChips() {
      if (!activeEl) return
      activeEl.innerHTML = ''
      let total = 0
      const add = (label: string, remove: () => void) => {
        total++
        const chip = document.createElement('span')
        chip.className = 'achip'
        chip.appendChild(document.createTextNode(label))
        const btn = document.createElement('button')
        btn.type = 'button'
        btn.setAttribute('aria-label', 'Remove ' + label)
        btn.innerHTML = '<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>'
        btn.addEventListener('click', remove)
        chip.appendChild(btn)
        activeEl.appendChild(chip)
      }
      if (state.primary !== 'all') add(typeLabel(state.primary), () => setPrimary('all'))
      state.areas.forEach((slug) => add(areaLabel(slug), () => {
        state.areas.delete(slug)
        const inp = document.querySelector(`.fopt input[data-group="area"][value="${slug}"]`) as HTMLInputElement | null
        if (inp) inp.checked = false
        state.limit = STEP; render()
      }))
      if (total) {
        const lbl = document.createElement('span')
        lbl.className = 'lbl'
        lbl.textContent = total + (total === 1 ? ' filter' : ' filters')
        activeEl.insertBefore(lbl, activeEl.firstChild)
      }
      if (badge) { badge.textContent = String(total); (badge as HTMLElement).hidden = total === 0 }
    }

    function render() {
      dir!.setAttribute('data-primary', state.primary)
      const shown: HTMLElement[] = []
      cards.forEach((c) => { if (matchCard(c)) shown.push(c) })
      const ordered = sortVisible(shown)
      // reorder DOM + apply the page-size limit
      let visible = 0
      ordered.forEach((c) => {
        const show = visible < state.limit
        c.classList.toggle('is-hidden', !show)
        grid!.appendChild(c)
        if (show) visible++
      })
      cards.forEach((c) => { if (!matchCard(c)) c.classList.add('is-hidden') })
      if (countEl) countEl.innerHTML = '<b>' + shown.length + '</b> ' + (shown.length === 1 ? unitSingular : unit)
      if (emptyEl) emptyEl.classList.toggle('on', shown.length === 0)
      if (loadMoreBtn) loadMoreBtn.style.display = shown.length > visible ? '' : 'none'
      renderChips()
    }

    function setPrimary(slug: string) {
      state.primary = slug
      typeBar?.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x.getAttribute('data-type') === slug ? 'true' : 'false'))
      state.limit = STEP; render()
    }

    // primary type (single)
    function onType(e: Event) {
      const b = (e.target as HTMLElement).closest('button[data-type]') as HTMLElement | null
      if (!b) return
      setPrimary(b.getAttribute('data-type') || 'all')
    }
    if (typeBar) typeBar.addEventListener('click', onType)

    // area checkboxes (multi)
    const areaInputs: HTMLInputElement[] = Array.from(document.querySelectorAll('.fopt input[data-group="area"]'))
    function onArea(this: HTMLInputElement) {
      if (this.checked) state.areas.add(this.value); else state.areas.delete(this.value)
      state.limit = STEP; render()
    }
    areaInputs.forEach((i) => i.addEventListener('change', onArea))

    // sort
    function onSort() { if (sortSel) { state.sort = sortSel.value; render() } }
    if (sortSel) sortSel.addEventListener('change', onSort)

    // load more
    function onLoadMore() { state.limit += STEP; render() }
    if (loadMoreBtn) loadMoreBtn.addEventListener('click', onLoadMore)

    // search
    function runSearch(scroll: boolean) {
      if (!searchInput) return
      state.q = searchInput.value.trim().toLowerCase()
      state.limit = STEP; render()
      if (scroll && state.q) dir!.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    function onSubmit(e: Event) { e.preventDefault(); runSearch(true) }
    function onInput() { if (searchInput && searchInput.value === '') runSearch(false) }
    if (searchForm) searchForm.addEventListener('submit', onSubmit)
    if (searchInput) searchInput.addEventListener('input', onInput)

    // clear all
    function onClear() {
      state.primary = 'all'; state.sort = 'editor'; state.q = ''; state.areas.clear(); state.limit = STEP
      areaInputs.forEach((i) => { i.checked = false })
      typeBar?.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x.getAttribute('data-type') === 'all' ? 'true' : 'false'))
      if (sortSel) sortSel.value = 'editor'
      if (searchInput) searchInput.value = ''
      render()
    }
    if (clearBtn) clearBtn.addEventListener('click', onClear)

    // collapsible groups
    const groupHeads: HTMLElement[] = Array.from(document.querySelectorAll('button.fgroup__t'))
    function onGroup(this: HTMLElement) {
      const grp = this.closest('.fgroup')
      if (!grp) return
      const open = !grp.classList.toggle('collapsed')
      this.setAttribute('aria-expanded', open ? 'true' : 'false')
    }
    groupHeads.forEach((t) => t.addEventListener('click', onGroup))

    // mobile drawer
    const openBtn = document.getElementById('railToggle')
    const closeBtn = document.getElementById('railClose')
    const backdrop = document.getElementById('railBackdrop')
    const openRail = () => document.body.classList.add('rail-open')
    const closeRail = () => document.body.classList.remove('rail-open')
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') closeRail() }
    if (openBtn) openBtn.addEventListener('click', openRail)
    if (closeBtn) closeBtn.addEventListener('click', closeRail)
    if (backdrop) backdrop.addEventListener('click', closeRail)
    window.addEventListener('keydown', onKey)

    render()

    return () => {
      if (typeBar) typeBar.removeEventListener('click', onType)
      areaInputs.forEach((i) => i.removeEventListener('change', onArea))
      if (sortSel) sortSel.removeEventListener('change', onSort)
      if (loadMoreBtn) loadMoreBtn.removeEventListener('click', onLoadMore)
      if (searchForm) searchForm.removeEventListener('submit', onSubmit)
      if (searchInput) searchInput.removeEventListener('input', onInput)
      if (clearBtn) clearBtn.removeEventListener('click', onClear)
      groupHeads.forEach((t) => t.removeEventListener('click', onGroup))
      if (openBtn) openBtn.removeEventListener('click', openRail)
      if (closeBtn) closeBtn.removeEventListener('click', closeRail)
      if (backdrop) backdrop.removeEventListener('click', closeRail)
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('rail-open')
    }
  }, [])

  return null
}
