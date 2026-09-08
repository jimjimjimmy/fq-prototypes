import type { CustomCellRendererProps } from '@ag-grid-community/react'
import { CURRENCY } from '../types.ts'
import { palette } from '../tokens.ts'

interface Props extends CustomCellRendererProps {
  currency?: string
}

/** Signed currency delta. Zero (in-balance) reads success-green; non-zero reads danger-red. */
export function DifferenceRenderer(props: Props) {
  const value = props.value as number | null | undefined
  if (value == null) return <span style={{ color: palette.textMuted }}>—</span>

  const isZero = Math.abs(value) < 0.005
  return (
    <span
      className="tabular-nums font-medium"
      style={{ color: isZero ? palette.success : palette.danger }}
    >
      {CURRENCY(props.currency ?? 'USD').format(value)}
    </span>
  )
}
