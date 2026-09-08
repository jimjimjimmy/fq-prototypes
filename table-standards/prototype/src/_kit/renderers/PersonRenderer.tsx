import type { CustomCellRendererProps } from '@ag-grid-community/react'
import type { Person } from '../types.ts'
import { palette, avatarColor } from '../tokens.ts'

/** Single avatar + name. Accepts a Person, or a plain string name. */
export function PersonRenderer(props: CustomCellRendererProps) {
  const value = props.value as Person | string | undefined
  if (!value) return null
  const person: Person =
    typeof value === 'string'
      ? { name: value, initials: initialsOf(value) }
      : value

  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold text-white shrink-0"
        style={{ backgroundColor: avatarColor(person.name) }}
      >
        {person.initials}
      </span>
      <span className="text-[12px] truncate" style={{ color: palette.textBody }}>
        {person.name}
      </span>
    </span>
  )
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}
