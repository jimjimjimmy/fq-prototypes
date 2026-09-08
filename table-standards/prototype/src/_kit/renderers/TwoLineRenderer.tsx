import type { CustomCellRendererProps } from '@ag-grid-community/react'
import { palette } from '../tokens.ts'

interface Props extends CustomCellRendererProps {
  /** Row field holding the secondary line (e.g. an account type). */
  secondaryField?: string
  /** Render the secondary line as a colored pill (default) or plain muted text. */
  secondaryAsPill?: boolean
  colorMap?: Record<string, { bg: string; text: string }>
}

const DEFAULT_PILL = { bg: palette.surfaceWeaker, text: palette.textTertiary }

/** Primary value on top, a smaller secondary line (pill or muted text) below. */
export function TwoLineRenderer(props: Props) {
  const primary = props.value
  if (primary == null) return null
  const secondary = props.secondaryField ? props.data?.[props.secondaryField] : undefined
  const asPill = props.secondaryAsPill ?? true
  const pill = (props.colorMap?.[secondary] as { bg: string; text: string }) ?? DEFAULT_PILL

  return (
    <div className="flex flex-col gap-0.5 py-1 leading-tight">
      <span className="text-[12px] font-medium truncate" style={{ color: palette.textBody }}>
        {String(primary)}
      </span>
      {secondary != null &&
        (asPill ? (
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded w-fit"
            style={{ backgroundColor: pill.bg, color: pill.text }}
          >
            {String(secondary)}
          </span>
        ) : (
          <span className="text-[11px]" style={{ color: palette.textMuted }}>
            {String(secondary)}
          </span>
        ))}
    </div>
  )
}
