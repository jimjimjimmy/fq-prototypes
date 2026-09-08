import type { CustomCellRendererProps } from '@ag-grid-community/react'
import { palette } from '../tokens.ts'

/**
 * AI-explanation cell (P3b analytical). Accepted text renders inline; an empty cell shows an
 * "+ Add explanation" AI affordance. Mirrors the ai-variance explanation pattern.
 */
export function ExplanationRenderer(props: CustomCellRendererProps) {
  const text = props.value as string | null | undefined

  if (text) {
    return (
      <span className="text-[12px] leading-snug" style={{ color: palette.textSecondary }}>
        {text}
      </span>
    )
  }
  return (
    <button
      className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded"
      style={{ backgroundColor: palette.aiBg, color: palette.ai }}
      title="Draft an explanation with FloQast AI"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6z" />
      </svg>
      Add explanation
    </button>
  )
}
