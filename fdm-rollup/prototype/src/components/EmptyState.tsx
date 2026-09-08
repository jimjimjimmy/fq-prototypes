import { FilePlus, LayoutTemplate, Sparkles, FileSpreadsheet, ArrowRight } from 'lucide-react'

const MUSEO = "'Museo Sans', sans-serif"

interface EmptyStateProps {
  onStartScratch: () => void
  onUseExample: () => void
  onUseAI: () => void
  onUploadExcel: () => void
}

export function EmptyState({ onStartScratch, onUseExample, onUseAI, onUploadExcel }: EmptyStateProps) {
  return (
    <div
      className="flex items-center justify-center h-full p-8 overflow-auto"
      style={{ fontFamily: MUSEO }}
    >
      <div className="max-w-[560px] w-full">
        <div className="mb-5">
          <h2
            className="text-[18px] leading-[24px] tracking-[-0.3px] text-[#1d2433]"
            style={{ fontWeight: 700 }}
          >
            Set up your Financial Statement
          </h2>
          <p className="text-[13px] text-[#6b7280] mt-1">
            Choose how you'd like to begin. You can change direction later.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <OptionRow
            icon={<Sparkles size={16} />}
            title="Use the AI agent"
            description="AI proposes a structure based on your chart of accounts."
            cta="Generate with AI"
            badge="New"
            highlight
            onClick={onUseAI}
          />
          <OptionRow
            icon={<LayoutTemplate size={16} />}
            title="Start from an example"
            description="Begin with a standard template and customize as you go."
            cta="Use template"
            onClick={onUseExample}
          />
          <OptionRow
            icon={<FileSpreadsheet size={16} />}
            title="Upload an Excel template"
            description="Import an existing structure from a spreadsheet."
            cta="Upload file"
            onClick={onUploadExcel}
          />
          <OptionRow
            icon={<FilePlus size={16} />}
            title="Start from scratch"
            description="Build your hierarchy one group at a time."
            cta="Start blank"
            onClick={onStartScratch}
          />
        </div>
      </div>
    </div>
  )
}

interface OptionRowProps {
  icon: React.ReactNode
  title: string
  description: string
  cta: string
  badge?: string
  highlight?: boolean
  onClick: () => void
}

function OptionRow({ icon, title, description, cta, badge, highlight, onClick }: OptionRowProps) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center gap-4 text-left bg-white border rounded-md px-4 py-3 transition-all hover:border-[#1fac76] hover:shadow-[0_1px_4px_rgba(31,172,118,0.08)] ${
        highlight ? 'border-[#1fac76]' : 'border-[#e1e6ef]'
      }`}
      style={{ fontFamily: MUSEO }}
    >
      <div
        className={`flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-md ${
          highlight ? 'bg-[#e9f6f0] text-[#186749]' : 'bg-[#eef4ff] text-[#3b5cb8]'
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-[#1d2433]" style={{ fontWeight: 700 }}>
            {title}
          </span>
          {badge && (
            <span
              className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#1fac76] text-white text-[10px]"
              style={{ fontWeight: 700 }}
            >
              {badge}
            </span>
          )}
        </div>
        <p className="text-[12px] text-[#6b7280] leading-[16px] mt-0.5">{description}</p>
      </div>
      <span
        className={`flex-shrink-0 inline-flex items-center gap-1 text-[12px] whitespace-nowrap ${
          highlight ? 'text-[#186749]' : 'text-[#3b5cb8]'
        } group-hover:gap-2 transition-all`}
        style={{ fontWeight: 700 }}
      >
        {cta}
        <ArrowRight size={12} />
      </span>
    </button>
  )
}
