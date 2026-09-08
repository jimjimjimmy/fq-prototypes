import { useState } from 'react'
import { MoreVertical, RotateCcw } from 'lucide-react'

const MUSEO = "'Museo Sans', sans-serif"

interface PageHeaderProps {
  hasChanges: boolean
  onCancel: () => void
  onSaveDraft: () => void
  onSaveAndPublish: () => void
  onStartOver?: () => void
  canStartOver?: boolean
  isEmpty?: boolean
}

export function PageHeader({
  hasChanges,
  onCancel,
  onSaveDraft,
  onSaveAndPublish,
  onStartOver,
  canStartOver,
  isEmpty,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-3 bg-white border-b border-[#e1e6ef] shrink-0 flex-wrap" style={{ fontFamily: MUSEO }}>
      <div className="flex flex-col gap-0.5 min-w-0">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-[#adb2bb]">
          <a className="text-[#186749] hover:underline cursor-pointer" style={{ fontWeight: 700 }}>
            Dimension Grouping
          </a>
          <span>/</span>
          <span className="text-[#6b7280]">Financial Statement</span>
        </nav>
        <div className="flex items-center gap-2">
          <h2 className="text-[18px] leading-[24px] tracking-[-0.3px] text-[#1d2433]" style={{ fontWeight: 700 }}>
            Financial Statement
          </h2>
          <span className="relative group/source">
            <span className="text-[11px] text-[#6b7280] bg-[#f3f4f6] px-2 py-0.5 rounded cursor-default">
              NetSuite
            </span>
            <span className="pointer-events-none absolute left-0 top-full mt-1.5 z-20 whitespace-nowrap rounded bg-[#1d2433] text-white text-[11px] px-2.5 py-1.5 opacity-0 group-hover/source:opacity-100 transition-opacity shadow-md">
              <span className="block font-bold mb-0.5">Source connection</span>
              NetSuite — FloQast Data
            </span>
          </span>
        </div>
      </div>

      {!isEmpty && (
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <SecondaryButton label="Cancel" onClick={onCancel} disabled={!hasChanges} />
          <SecondaryButton label="Save as Draft" onClick={onSaveDraft} disabled={!hasChanges} />
          <PrimaryButton label="Save and Publish" onClick={onSaveAndPublish} disabled={!hasChanges} />
          <KebabButton onStartOver={onStartOver} canStartOver={canStartOver} />
        </div>
      )}
    </div>
  )
}

function SecondaryButton({
  label,
  onClick,
  disabled,
  muted,
}: {
  label: string
  onClick?: () => void
  disabled?: boolean
  muted?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center h-10 px-4 rounded-md border text-[12px] tracking-[-0.12px] whitespace-nowrap ${
        disabled
          ? 'border-[#e1e6ef] text-[#adb2bb] cursor-default'
          : muted
          ? 'border-[#cbd2e1] text-[#adb2bb] hover:bg-[#f8fafc]'
          : 'border-[#cbd2e1] text-[#424867] hover:bg-[#f8fafc]'
      }`}
      style={{ fontFamily: MUSEO, fontWeight: 700 }}
    >
      {label}
    </button>
  )
}

function PrimaryButton({ label, onClick, disabled }: { label: string; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center h-10 px-4 rounded-md text-white text-[12px] tracking-[-0.12px] whitespace-nowrap ${
        disabled ? 'bg-[#a8d8c2] cursor-default' : 'bg-[#1fac76] hover:bg-[#17935f]'
      }`}
      style={{ fontFamily: MUSEO, fontWeight: 700 }}
    >
      {label}
    </button>
  )
}

function KebabButton({
  onStartOver,
  canStartOver,
}: {
  onStartOver?: () => void
  canStartOver?: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        title="More actions"
        className="inline-flex items-center justify-center w-8 h-10 text-[#6b7280] hover:text-[#424867] rounded"
      >
        <MoreVertical size={18} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full mt-1 z-20 w-56 bg-white border border-[#e1e6ef] rounded-md shadow-lg py-1 text-[12px]"
            style={{ fontFamily: MUSEO }}
          >
            <button
              onClick={() => {
                if (canStartOver && onStartOver) {
                  if (
                    window.confirm(
                      'Clear the current hierarchy and return to the empty state? Unsaved changes will be lost.',
                    )
                  ) {
                    onStartOver()
                    setOpen(false)
                  }
                }
              }}
              disabled={!canStartOver}
              className={`flex items-center gap-2 w-full px-3 py-2 text-left ${
                canStartOver
                  ? 'text-[#1d2433] hover:bg-[#f8fafc]'
                  : 'text-[#cbd2e1] cursor-default'
              }`}
              style={{ fontWeight: 700 }}
            >
              <RotateCcw size={14} className={canStartOver ? 'text-[#6b7280]' : 'text-[#cbd2e1]'} />
              Start over
            </button>
          </div>
        </>
      )}
    </div>
  )
}

