import { t } from '../tokens.ts'
import type { QuickChip } from './QuickFilterBar.tsx'

/**
 * Shows what's currently filtering the grid — per-column filters AND active quick chips —
 * as removable pills, plus a single "Clear all" (Steve Raeder: "a clear filter button… so
 * people can wipe filters off"). Makes filter state VISIBLE so nothing filters invisibly
 * (Benjamin/Carmen: "no one is going to figure that out" re: hidden side-drawer filters).
 */
export function FilterStatusBar({
  api,
  columnFilterKeys,
  activeChips,
  chips,
  onRemoveChip,
  onClearAll,
}: {
  api: any
  /** Field keys currently present in api.getFilterModel(). */
  columnFilterKeys: string[]
  activeChips: string[]
  chips: QuickChip[]
  onRemoveChip: (id: string) => void
  onClearAll: () => void
}) {
  const hasColumn = columnFilterKeys.length > 0
  const hasChips = activeChips.length > 0
  if (!hasColumn && !hasChips) return null

  const headerFor = (field: string): string => {
    const col = api?.getColumn?.(field)
    return col?.getColDef?.()?.headerName ?? field
  }

  const removeColumn = (field: string) => {
    const model = { ...(api?.getFilterModel?.() ?? {}) }
    delete model[field]
    api?.setFilterModel?.(model)
  }

  return (
    <div className="flex flex-wrap items-center gap-2 py-1">
      <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: t.textMuted }}>
        Filters
      </span>

      {activeChips.map((id) => {
        const chip = chips.find((c) => c.id === id)
        if (!chip) return null
        return (
          <Pill key={`chip-${id}`} label={chip.label} onRemove={() => onRemoveChip(id)} accent />
        )
      })}

      {columnFilterKeys.map((field) => (
        <Pill key={`col-${field}`} label={headerFor(field)} onRemove={() => removeColumn(field)} />
      ))}

      <button
        onClick={onClearAll}
        className="text-[12px] font-semibold ml-1"
        style={{ color: t.info }}
      >
        Clear all
      </button>
    </div>
  )
}

function Pill({
  label,
  onRemove,
  accent,
}: {
  label: string
  onRemove: () => void
  accent?: boolean
}) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[12px] font-medium pl-2.5 pr-1.5 h-6 rounded-full border"
      style={{
        backgroundColor: accent ? 'rgba(31,172,118,0.10)' : t.surfaceWeaker,
        borderColor: accent ? t.success : t.border,
        color: accent ? t.success : t.textBodySecondary,
      }}
    >
      {label}
      <button onClick={onRemove} className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-black/5" title="Remove filter">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </span>
  )
}
