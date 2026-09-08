/**
 * Saved views — capture/restore a grid's column layout (order, width, visibility, sort, grouping)
 * plus its active filters, persisted to localStorage per profile. This pattern is greenfield in
 * the repo (no existing component) — the kit is where it gets defined once for everyone.
 */

export interface SavedView {
  id: string
  name: string
  columnState: unknown
  filterModel: unknown
}

const keyFor = (profileId: string) => `agstd:savedViews:${profileId}`

export function loadViews(profileId: string): SavedView[] {
  try {
    const raw = localStorage.getItem(keyFor(profileId))
    return raw ? (JSON.parse(raw) as SavedView[]) : []
  } catch {
    return []
  }
}

export function persistViews(profileId: string, views: SavedView[]) {
  try {
    localStorage.setItem(keyFor(profileId), JSON.stringify(views))
  } catch {
    /* ignore quota / private-mode errors in a prototype */
  }
}

/** Snapshot the grid's current column + filter state. */
export function captureState(api: any): Pick<SavedView, 'columnState' | 'filterModel'> {
  return {
    columnState: api?.getColumnState?.() ?? null,
    filterModel: api?.getFilterModel?.() ?? null,
  }
}

/** Apply a saved view back onto the grid. */
export function applyState(api: any, view: SavedView) {
  if (view.columnState) api?.applyColumnState?.({ state: view.columnState, applyOrder: true })
  api?.setFilterModel?.(view.filterModel ?? null)
}

/** Stable id from name + index — avoids Date.now()/Math.random (unavailable in some contexts). */
export function makeViewId(name: string, existing: SavedView[]): string {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'view'
  let id = base
  let n = 1
  while (existing.some((v) => v.id === id)) id = `${base}-${++n}`
  return id
}
