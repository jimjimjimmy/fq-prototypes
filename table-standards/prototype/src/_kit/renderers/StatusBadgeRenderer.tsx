import type { CustomCellRendererProps } from '@ag-grid-community/react'
import { TableStatusBadge } from '@floqastinc/flow-ui_core'
import type { StatusValue, BadgeColor } from '../types.ts'

const STATUS_COLORS: Record<StatusValue, BadgeColor> = {
  'Not started': 'default',
  'In progress': 'info',
  'In review': 'warning',
  Complete: 'success',
  Overdue: 'danger',
  Blocked: 'danger',
}

export function StatusBadgeRenderer(props: CustomCellRendererProps) {
  const value = props.value as StatusValue | undefined
  if (!value) return null
  const size = props.context?.density === 'comfortable' ? 'default' : 'xs'
  return (
    <TableStatusBadge color={STATUS_COLORS[value] ?? 'default'} size={size} hasIcon={false}>
      {value}
    </TableStatusBadge>
  )
}
