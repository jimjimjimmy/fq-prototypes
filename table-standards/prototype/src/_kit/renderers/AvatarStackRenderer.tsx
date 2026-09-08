import type { CustomCellRendererProps } from '@ag-grid-community/react'
import type { Person } from '../types.ts'
import { palette, avatarColor } from '../tokens.ts'

/** Overlapping avatar stack (max 4) + optional signed-off count, from a Person[] value. */
export function AvatarStackRenderer(props: CustomCellRendererProps) {
  const people = props.value as Person[] | undefined
  if (!people?.length) return null

  const signed = people.filter((p) => p.signedOff).length
  const hasSignOff = people.some((p) => p.signedOff !== undefined)

  return (
    <div className="flex items-center gap-1">
      <div className="flex -space-x-1.5">
        {people.slice(0, 4).map((p, i) => (
          <div
            key={p.initials + i}
            className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold text-white border-2 border-white"
            style={{ backgroundColor: avatarColor(p.name) }}
            title={`${p.name}${p.role ? ` (${p.role})` : ''}${p.signedOff ? ' ✓' : ''}`}
          >
            {p.initials}
          </div>
        ))}
        {people.length > 4 && (
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold border-2 border-white"
            style={{ backgroundColor: palette.border, color: palette.textTertiary }}
          >
            +{people.length - 4}
          </div>
        )}
      </div>
      {hasSignOff && (
        <span className="text-[11px] ml-1" style={{ color: palette.textTertiary }}>
          {signed}/{people.length}
        </span>
      )}
    </div>
  )
}
