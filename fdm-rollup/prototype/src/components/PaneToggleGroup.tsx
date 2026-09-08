import { ListTree, Table2, GitBranch, Check } from 'lucide-react'

const MUSEO = "'Museo Sans', sans-serif"

export type PaneKey = 'rollup' | 'mapping' | 'rules'

interface PaneToggleGroupProps {
  visible: Set<PaneKey>
  onToggle: (pane: PaneKey) => void
}

export function PaneToggleGroup({ visible, onToggle }: PaneToggleGroupProps) {
  return (
    <div className="inline-flex items-center gap-1.5" role="group" aria-label="Toggle visible panes">
      <span
        className="text-[11px] text-[#adb2bb] whitespace-nowrap mr-0.5"
        style={{ fontFamily: MUSEO, fontWeight: 700 }}
      >
        Show:
      </span>
      <PillToggle
        icon={<Table2 size={13} />}
        label="Map"
        hint="Assign accounts at scale"
        active={visible.has('mapping')}
        onClick={() => onToggle('mapping')}
      />
      <PillToggle
        icon={<GitBranch size={13} />}
        label="Rules"
        hint="Automate with mapping rules"
        active={visible.has('rules')}
        onClick={() => onToggle('rules')}
      />
      <PillToggle
        icon={<ListTree size={13} />}
        label="Hierarchy"
        hint="Review the mapping hierarchy"
        active={visible.has('rollup')}
        onClick={() => onToggle('rollup')}
      />
    </div>
  )
}

function PillToggle({
  icon,
  label,
  hint,
  active,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  hint: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      title={hint}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border text-[11px] tracking-[-0.12px] transition-all ${
        active
          ? 'bg-[#e9f6f0] border-[#1fac76] text-[#186749]'
          : 'bg-white border-[#cbd2e1] text-[#424867] hover:border-[#adb2bb] hover:bg-[#f8fafc]'
      }`}
      style={{ fontFamily: MUSEO, fontWeight: 700 }}
    >
      {active ? <Check size={13} /> : icon}
      {label}
    </button>
  )
}
