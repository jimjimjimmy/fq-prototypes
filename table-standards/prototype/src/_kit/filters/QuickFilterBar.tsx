import { useCallback, useEffect, useRef, useState } from 'react'
import { t } from '../tokens.ts'

/**
 * A compound, cross-column quick filter — the layer ABOVE per-column filters.
 * Handles predicates a single column can't express, e.g. "late items assigned to me"
 * (dueDate < today AND me ∈ assignees). Implemented via AG Grid's native EXTERNAL filter.
 */
export interface QuickChip {
  id: string
  label: string
  /** Returns true if the row passes this chip's predicate. */
  predicate: (row: any) => boolean
}

/**
 * Owns the active-chip set and returns the two callbacks AG Grid's external filter needs.
 * Wire the returned props onto <AgGridReact> and pass `bar` into <QuickFilterBar/>.
 *
 *   const q = useQuickFilters(CHIPS)
 *   <QuickFilterBar {...q.bar} />
 *   <AgGridReact isExternalFilterPresent={q.isExternalFilterPresent}
 *                doesExternalFilterPass={q.doesExternalFilterPass} ... />
 *   // call q.onGridReady(api) once, so toggling a chip re-runs the filter
 */
export function useQuickFilters(chips: QuickChip[]) {
  const [active, setActive] = useState<string[]>([])
  const [api, setApi] = useState<any>(null)
  // The grid's external-filter callbacks read the CURRENT active set from a ref, so the
  // callbacks stay stable and never evaluate a stale closure. The effect re-runs the filter
  // AFTER React commits the new active set.
  const activeRef = useRef<string[]>(active)
  useEffect(() => {
    activeRef.current = active
    api?.onFilterChanged()
  }, [active, api])

  const toggle = useCallback((id: string) => {
    setActive((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  const clear = useCallback(() => setActive([]), [])

  const isExternalFilterPresent = useCallback(() => activeRef.current.length > 0, [])

  const doesExternalFilterPass = useCallback(
    (node: any) => {
      const act = activeRef.current
      if (!act.length) return true
      // A row must pass EVERY active chip (AND semantics).
      return act.every((id) => {
        const chip = chips.find((c) => c.id === id)
        return chip ? chip.predicate(node.data) : true
      })
    },
    [chips],
  )

  return {
    active,
    clear,
    isExternalFilterPresent,
    doesExternalFilterPass,
    onGridReady: (a: any) => setApi(a),
    bar: { chips, active, onToggle: toggle },
  }
}

export function QuickFilterBar({
  chips,
  active,
  onToggle,
}: {
  chips: QuickChip[]
  active: string[]
  onToggle: (id: string) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => {
        const on = active.includes(chip.id)
        return (
          <button
            key={chip.id}
            onClick={() => onToggle(chip.id)}
            className="text-[12px] font-medium px-3 h-7 rounded-full border transition-colors"
            style={{
              backgroundColor: on ? t.success : t.surfaceBase,
              borderColor: on ? t.success : t.strokeForms,
              color: on ? '#ffffff' : t.textBodySecondary,
            }}
          >
            {chip.label}
          </button>
        )
      })}
    </div>
  )
}
