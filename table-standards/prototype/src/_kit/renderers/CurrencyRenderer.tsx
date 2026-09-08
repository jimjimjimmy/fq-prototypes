import type { CustomCellRendererProps } from '@ag-grid-community/react'
import { CURRENCY } from '../types.ts'
import { palette } from '../tokens.ts'

interface Props extends CustomCellRendererProps {
  /** ISO currency code, or a row field name holding one. Defaults to USD. */
  currency?: string
  currencyField?: string
}

/** Right-aligned currency with tabular figures. Renders "—" for null. */
export function CurrencyRenderer(props: Props) {
  const value = props.value as number | null | undefined
  if (value == null) return <span style={{ color: palette.textMuted }}>—</span>

  const currency =
    props.currency ?? (props.currencyField ? props.data?.[props.currencyField] : undefined) ?? 'USD'

  return <span className="tabular-nums">{CURRENCY(currency).format(value)}</span>
}
