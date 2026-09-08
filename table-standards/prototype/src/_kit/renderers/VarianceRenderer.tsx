import type { CustomCellRendererProps } from '@ag-grid-community/react'
import { CURRENCY } from '../types.ts'
import { palette } from '../tokens.ts'

interface Props extends CustomCellRendererProps {
  currency?: string
}

/** Signed variance amount. Positive → success, negative → danger, zero → muted. */
export function VarianceRenderer(props: Props) {
  const value = props.value as number | null | undefined
  if (value == null) return <span style={{ color: palette.textMuted }}>—</span>
  const color =
    Math.abs(value) < 0.005 ? palette.textMuted : value > 0 ? palette.success : palette.danger
  const sign = value > 0 ? '+' : ''
  return (
    <span className="tabular-nums font-medium" style={{ color }}>
      {sign}
      {CURRENCY(props.currency ?? 'USD').format(value)}
    </span>
  )
}
