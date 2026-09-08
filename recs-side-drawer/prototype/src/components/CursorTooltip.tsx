import { useState } from 'react'
import { createPortal } from 'react-dom'

interface CursorTooltipProps {
  // No-op wrapper (renders children directly, no listeners) unless both are set.
  disabled: boolean
  tooltip?: string
  children: React.ReactNode
}

const GAP_ABOVE_CURSOR = 20

// FlowUI's real Tooltip anchors to the trigger element's bounding box, not
// the live cursor position - there's no virtualRef escape hatch exposed
// through its public Tooltip.Trigger API (traced into the Radix Popper
// source in flowui-cache to confirm). For a full-width disabled row, that
// means the tooltip stays centered on the row regardless of where within it
// you're actually hovering. This re-creates FlowUI's Tooltip.Content visual
// (same color/font tokens, same arrow) but positions it relative to the
// mouse position instead, updating as the cursor moves.
export function CursorTooltip({ disabled, tooltip, children }: CursorTooltipProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)

  if (!disabled || !tooltip) return <>{children}</>

  return (
    <div
      className="block w-full cursor-not-allowed"
      onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
      onMouseLeave={() => setPos(null)}
    >
      {children}
      {pos &&
        createPortal(
          <div
            className="fixed z-[10000] flex flex-col items-center pointer-events-none"
            style={{ left: pos.x, top: pos.y - GAP_ABOVE_CURSOR, transform: 'translate(-50%, -100%)' }}
          >
            <div
              style={{
                backgroundColor: 'var(--flo-sem-color-surface-neutral-strong)',
                color: 'var(--flo-sem-color-content-neutral-inverse)',
                fontFamily: 'var(--flo-sem-font-family-body)',
                fontSize: 'var(--flo-base-font-size-2)',
                fontWeight: 'var(--flo-base-font-weight-4)',
                lineHeight: 'var(--flo-base-line-height-2)',
              }}
              className="rounded-[4px] px-[12px] py-[8px] whitespace-nowrap"
            >
              {tooltip}
            </div>
            <div
              className="w-0 h-0"
              style={{
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid var(--flo-sem-color-surface-neutral-strong)',
              }}
            />
          </div>,
          document.body,
        )}
    </div>
  )
}
