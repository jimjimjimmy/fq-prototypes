import { X, Maximize2 } from 'lucide-react'

interface WidgetTabStripProps {
  label: string
  subtitle?: string
  onClose?: () => void
  onMaximize?: () => void
}

// Single-tab strip atop a widget. Mirrors Will's "Roll-up Structure ×"
// header. Close fires onClose when provided. Maximize fires onMaximize when
// provided — App-level pane visibility decides whether to offer it (e.g. it
// makes no sense if the pane is already the only one visible).
export function WidgetTabStrip({ label, subtitle, onClose, onMaximize }: WidgetTabStripProps) {
  return (
    <div className="flex items-center justify-between h-9 bg-[#f1f3f9] border-b border-[#e1e6ef] shrink-0">
      <div className="flex items-end h-full">
        <div className="flex items-center gap-2 h-full px-3 bg-white border-r border-[#e1e6ef]">
          <span className="text-[12px] font-semibold text-[#1d2433]">{label}</span>
          {subtitle && (
            <span className="text-[11px] text-[#adb2bb]">{subtitle}</span>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="text-[#adb2bb] hover:text-[#424867]"
              title="Close pane"
              aria-label={`Close ${label}`}
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>
      {onMaximize && (
        <button
          onClick={onMaximize}
          className="px-3 text-[#6b7280] hover:text-[#424867]"
          title="Maximize — show only this pane"
          aria-label={`Maximize ${label}`}
        >
          <Maximize2 size={14} />
        </button>
      )}
    </div>
  )
}
