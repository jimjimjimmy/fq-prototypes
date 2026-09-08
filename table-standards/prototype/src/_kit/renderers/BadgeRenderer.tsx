import type { CustomCellRendererProps } from '@ag-grid-community/react'
import { TableStatusBadge } from '@floqastinc/flow-ui_core'
import { palette } from '../tokens.ts'
import type { BadgeColor } from '../types.ts'

/** Default color mapping for common tag values across all profiles. */
const BADGE_COLORS: Record<string, BadgeColor> = {
  // Source / integration tags
  Bank: 'info',
  'Bank Rec': 'info',
  Amortization: 'info',
  AutoRec: 'info',
  // AI tags
  AI: 'highlight',
  'AI Accruals': 'highlight',
  // Compliance / risk tags
  SOX: 'danger',
  IC: 'warning',
}

interface Props extends CustomCellRendererProps {
  /** Per-column FlowUI color overrides, keyed by cell value. */
  colorMap?: Record<string, BadgeColor>
}

/** One or more FlowUI TableStatusBadge pills. Overflow beyond 3 collapses to "+N". */
export function BadgeRenderer(props: Props) {
  const value = props.value
  if (value == null || value === '') return null
  const items: string[] = Array.isArray(value) ? value : [String(value)]
  if (!items.length) return null

  const map = { ...BADGE_COLORS, ...(props.colorMap ?? {}) }
  const shown = items.slice(0, 3)
  const overflow = items.length - shown.length
  const size = props.context?.density === 'comfortable' ? 'default' : 'xs'

  return (
    <div className="flex flex-wrap items-center gap-1">
      {shown.map((item, i) => (
        <TableStatusBadge key={`${item}-${i}`} color={map[item] ?? 'default'} size={size} hasIcon={false}>
          {item}
        </TableStatusBadge>
      ))}
      {overflow > 0 && (
        <span className="text-[10px] font-semibold" style={{ color: palette.textMuted }}>
          +{overflow}
        </span>
      )}
    </div>
  )
}
