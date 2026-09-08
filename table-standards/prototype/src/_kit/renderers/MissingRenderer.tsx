import type { CustomCellRendererProps } from '@ag-grid-community/react'
import { TableStatusBadge } from '@floqastinc/flow-ui_core'
import { CURRENCY } from '../types.ts'

interface Props extends CustomCellRendererProps {
  currency?: string
}

/** Currency value, or a FlowUI warning badge when null. */
export function MissingRenderer(props: Props) {
  const value = props.value as number | null | undefined
  if (value == null) {
    const size = props.context?.density === 'comfortable' ? 'default' : 'xs'
    return (
      <TableStatusBadge color="warning" size={size} hasIcon={false}>
        Missing
      </TableStatusBadge>
    )
  }
  return <span className="tabular-nums">{CURRENCY(props.currency ?? 'USD').format(value)}</span>
}
