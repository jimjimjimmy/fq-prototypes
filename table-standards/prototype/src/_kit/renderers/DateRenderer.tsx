import type { CustomCellRendererProps } from '@ag-grid-community/react'
import { palette } from '../tokens.ts'

interface Props extends CustomCellRendererProps {
  /** Optional flag field on the row that marks the date overdue → renders danger. */
  overdueField?: string
}

/** Right-aligned date. Optionally colors danger when an overdue flag is set. */
export function DateRenderer(props: Props) {
  const value = props.value as string | null | undefined
  if (!value) return <span style={{ color: palette.textMuted }}>—</span>
  const overdue = props.overdueField ? Boolean(props.data?.[props.overdueField]) : false
  return (
    <span
      className="tabular-nums"
      style={{ color: overdue ? palette.danger : palette.textBody }}
    >
      {value}
    </span>
  )
}
