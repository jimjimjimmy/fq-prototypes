import type React from 'react'
import { t } from '../tokens.ts'
import type { Density } from '../theme.ts'

/**
 * Standard container chrome above every table: title on the left; quick search,
 * density toggle, and profile-specific controls (saved views, columns) on the right.
 * Consistent chrome across profiles = the table doesn't look re-invented per surface.
 */
export function TableToolbar({
  title,
  quickSearch,
  onQuickSearch,
  density,
  onDensityChange,
  children,
}: {
  title: string
  quickSearch?: string
  onQuickSearch?: (value: string) => void
  density?: Density
  onDensityChange?: (d: Density) => void
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3 pb-3">
      <div className="flex items-baseline gap-2">
        <h2 className="text-[15px] font-semibold" style={{ color: t.textBody }}>
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        {onQuickSearch && (
          <div className="relative">
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2"
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.textMuted} strokeWidth="2" strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              value={quickSearch ?? ''}
              onChange={(e) => onQuickSearch(e.target.value)}
              placeholder="Search"
              className="h-8 w-52 pl-8 pr-3 rounded-md border text-[12px]"
              style={{ borderColor: t.strokeForms, color: t.textBody, backgroundColor: t.surfaceBase }}
            />
          </div>
        )}

        {density && onDensityChange && (
          <DensityToggle density={density} onChange={onDensityChange} />
        )}

        {children}
      </div>
    </div>
  )
}

function DensityToggle({
  density,
  onChange,
}: {
  density: Density
  onChange: (d: Density) => void
}) {
  const opts: { id: Density; label: string }[] = [
    { id: 'compact', label: 'Compact' },
    { id: 'comfortable', label: 'Comfortable' },
  ]
  return (
    <div
      className="inline-flex rounded-md border overflow-hidden"
      style={{ borderColor: t.strokeForms }}
    >
      {opts.map((o) => {
        const on = density === o.id
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className="h-8 px-3 text-[12px] font-medium"
            style={{
              backgroundColor: on ? t.optionSelected : t.surfaceBase,
              color: on ? t.textBody : t.textMuted,
            }}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
