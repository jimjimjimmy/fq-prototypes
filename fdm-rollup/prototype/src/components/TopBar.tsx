import { ChevronRight, Upload, Download, Save } from 'lucide-react'

interface TopBarProps {
  selection: string
  onSave: () => void
}

export function TopBar({ selection, onSave }: TopBarProps) {
  return (
    <header className="flex items-center justify-between h-[56px] px-6 border-b border-[#e1e6ef] bg-white shrink-0">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] text-[#424867]">
        <span>Reports</span>
        <ChevronRight size={14} className="text-[#adb2bb]" />
        <span>FDM</span>
        <ChevronRight size={14} className="text-[#adb2bb]" />
        <span>Grouping</span>
        <ChevronRight size={14} className="text-[#adb2bb]" />
        <span className="text-[#1d2433] font-semibold">{selection}</span>
      </nav>

      <div className="flex items-center gap-2">
        <SecondaryButton icon={<Upload size={14} />} label="Upload Excel" />
        <SecondaryButton icon={<Download size={14} />} label="Download Excel" />
        <button
          onClick={onSave}
          className="inline-flex items-center gap-2 h-9 px-3 rounded-md bg-[#1fac76] hover:bg-[#17935f] text-white text-[12px] font-semibold"
        >
          <Save size={14} />
          Save changes
        </button>
      </div>
    </header>
  )
}

function SecondaryButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-[#cbd2e1] bg-white hover:bg-[#f8fafc] text-[12px] font-semibold text-[#424867]"
    >
      {icon}
      {label}
    </button>
  )
}
