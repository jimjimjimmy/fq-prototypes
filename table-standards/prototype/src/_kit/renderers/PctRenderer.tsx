import type { CustomCellRendererProps } from '@ag-grid-community/react'
import { palette } from '../tokens.ts'

interface Props extends CustomCellRendererProps {
  /** Materiality threshold (fraction, e.g. 0.2 = 20%). Above → highlighted danger pill. */
  threshold?: number
}

/** Percent value with materiality highlight — flags variance ≥ threshold (default 20%). */
export function PctRenderer(props: Props) {
  const value = props.value as number | null | undefined
  if (value == null) return <span style={{ color: palette.textMuted }}>—</span>
  const threshold = props.threshold ?? 0.2
  const material = Math.abs(value) >= threshold
  const sign = value > 0 ? '+' : ''
  const label = `${sign}${(value * 100).toFixed(1)}%`

  if (material) {
    return (
      <span
        className="tabular-nums font-semibold text-[11px] px-1.5 py-0.5 rounded"
        style={{ backgroundColor: palette.dangerBg, color: palette.danger }}
      >
        {label}
      </span>
    )
  }
  return (
    <span className="tabular-nums" style={{ color: palette.textSecondary }}>
      {label}
    </span>
  )
}
