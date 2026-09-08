import { useState } from 'react'
import { Plus, Trash2, GripVertical, Info, Maximize2, ChevronDown, ChevronRight, X } from 'lucide-react'

const MUSEO = "'Museo Sans', sans-serif"

interface MappingRulesPaneProps {
  destinationNames: string[]
  onClose?: () => void
  onMaximize?: () => void
}

interface SampleRule {
  id: string
  name: string
  description?: string
  field: string
  op: string
  value: string
  assignTo: string
  active: boolean
  catchAll: boolean
}

const SAMPLE_RULES: SampleRule[] = [
  {
    id: 'rule-1',
    name: 'Rule 1',
    field: 'Account No.',
    op: 'Starts with',
    value: '1',
    assignTo: 'Cash and Cash Equivalents',
    active: true,
    catchAll: false,
  },
  {
    id: 'rule-2',
    name: 'Rule 2',
    field: 'Account Name',
    op: 'Contains',
    value: 'Revenue',
    assignTo: 'Sales Revenue',
    active: true,
    catchAll: false,
  },
]

type Tab = 'active' | 'library'

export function MappingRulesPane({ destinationNames, onClose, onMaximize }: MappingRulesPaneProps) {
  const [tab, setTab] = useState<Tab>('library')

  return (
    <section
      className="flex flex-col h-full bg-white overflow-hidden"
      style={{ fontFamily: MUSEO }}
    >
      {/* Title */}
      <div className="flex items-start justify-between px-4 pt-4 pb-3 shrink-0">
        <div>
          <h3 className="text-[16px] font-bold text-[#1d2433]">Mapping Rules</h3>
        </div>
        <div className="flex items-center gap-2 mt-1">
          {onMaximize && (
            <button onClick={onMaximize} title="Maximize" className="text-[#adb2bb] hover:text-[#424867]">
              <Maximize2 size={14} />
            </button>
          )}
          {onClose && (
            <button onClick={onClose} title="Close" className="text-[#adb2bb] hover:text-[#424867]">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Tabs + Add Rule */}
      <div className="flex items-center justify-between px-4 border-b border-[#e1e6ef] shrink-0">
        <div className="flex items-center gap-4">
          <TabButton active={tab === 'active'} onClick={() => setTab('active')}>
            Active
          </TabButton>
          <TabButton active={tab === 'library'} onClick={() => setTab('library')}>
            Rule Library
          </TabButton>
        </div>
        <button
          className="inline-flex items-center gap-1 h-8 px-3 text-[12px] text-[#186749] hover:bg-[#f8fafc] rounded"
          style={{ fontWeight: 700 }}
        >
          <Plus size={14} />
          Add Rule
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto px-4 py-4">
        {tab === 'active' ? (
          <EmptyActiveRules />
        ) : (
          <div className="flex flex-col gap-3">
            {SAMPLE_RULES.map((rule) => (
              <RuleCard key={rule.id} rule={rule} destinationNames={destinationNames} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-[#e1e6ef] shrink-0">
        <button
          onClick={onClose}
          className="inline-flex items-center justify-center h-9 px-4 rounded-md border border-[#cbd2e1] text-[#424867] text-[12px] hover:bg-[#f8fafc]"
          style={{ fontFamily: MUSEO, fontWeight: 700 }}
        >
          Cancel
        </button>
        <button
          className="inline-flex items-center justify-center h-9 px-4 rounded-md bg-[#1fac76] hover:bg-[#17935f] text-white text-[12px]"
          style={{ fontFamily: MUSEO, fontWeight: 700 }}
        >
          Run Active Rules
        </button>
      </div>
    </section>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`relative h-10 text-[13px] ${
        active ? 'text-[#1d2433]' : 'text-[#6b7280] hover:text-[#1d2433]'
      }`}
      style={{ fontFamily: MUSEO, fontWeight: 700 }}
    >
      {children}
      {active && (
        <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-[#1fac76] rounded-full" />
      )}
    </button>
  )
}

function EmptyActiveRules() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-12">
      <div className="w-32 h-2 rounded bg-[#f1f3f9] mb-3" />
      <div className="w-48 h-2 rounded bg-[#f1f3f9] mb-3" />
      <div className="w-40 h-2 rounded bg-[#f1f3f9] mb-6" />
      <h4 className="text-[14px] font-bold text-[#1d2433]">There are no active rules</h4>
      <p className="text-[12px] text-[#6b7280] mt-1">
        Click "Add Rule" to add a rule to your rule library.
      </p>
      <button
        className="inline-flex items-center justify-center h-9 px-4 mt-4 rounded-md bg-[#1fac76] hover:bg-[#17935f] text-white text-[12px]"
        style={{ fontFamily: MUSEO, fontWeight: 700 }}
      >
        Add Rule
      </button>
    </div>
  )
}

function RuleCard({ rule, destinationNames }: { rule: SampleRule; destinationNames: string[] }) {
  const [expanded, setExpanded] = useState(false)
  const conditionSummary = `${rule.field} ${rule.op.toLowerCase()} "${rule.value}" → ${rule.assignTo}`

  return (
    <div className="border border-[#e1e6ef] rounded-md bg-white overflow-hidden">
      {/* Always-visible summary row */}
      <div
        className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-[#f8fafc]"
        onClick={() => setExpanded(v => !v)}
      >
        <GripVertical size={14} className="text-[#cbd2e1] shrink-0 cursor-grab" onClick={e => e.stopPropagation()} />
        <span className="text-[#6b7280]">
          {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        </span>
        <span className="flex-1 text-[12px] font-bold text-[#1d2433]">{rule.name}</span>
        {!expanded && (
          <span className="text-[11px] text-[#adb2bb] truncate max-w-[180px]">{conditionSummary}</span>
        )}
        <div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
          <ToggleSwitch defaultActive={rule.active} />
          <span className="text-[11px] font-bold text-[#424867]">Active</span>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-3 pb-3 border-t border-[#f1f3f9]">
          {/* Name + catch-all */}
          <div className="flex items-center gap-2 mt-3 mb-2">
            <input
              defaultValue={rule.name}
              className="flex-1 h-8 px-2 rounded border border-[#cbd2e1] text-[12px] text-[#1d2433] focus:outline-none focus:border-[#1fac76]"
              style={{ fontFamily: MUSEO }}
            />
            <label className="inline-flex items-center gap-1.5 text-[11px] text-[#424867] shrink-0">
              <input type="checkbox" defaultChecked={rule.catchAll} className="rounded border-[#cbd2e1]" />
              Catch-all
              <Info size={12} className="text-[#adb2bb]" />
            </label>
          </div>

          {/* Description */}
          <input
            placeholder="Description (optional)"
            className="w-full h-8 px-2 mb-3 rounded border border-[#cbd2e1] text-[12px] placeholder:text-[#adb2bb] focus:outline-none focus:border-[#1fac76]"
            style={{ fontFamily: MUSEO }}
          />

          {/* Condition row */}
          <div className="flex items-center gap-2 mb-2">
            <Select className="w-32" value={rule.field} options={['Account No.', 'Account Name', 'Department']} />
            <Select className="w-32" value={rule.op} options={['Contains', 'Starts with', 'Ends with', 'Equals']} />
            <input
              defaultValue={rule.value}
              className="flex-1 h-8 px-2 rounded border border-[#cbd2e1] text-[12px] focus:outline-none focus:border-[#1fac76]"
              style={{ fontFamily: MUSEO }}
            />
            <button className="text-[#adb2bb] hover:text-[#c1414f]" title="Remove condition">
              <Trash2 size={14} />
            </button>
          </div>

          <button className="inline-flex items-center gap-1 text-[12px] text-[#186749] mb-3" style={{ fontWeight: 700 }}>
            <Plus size={12} />
            Add Condition
          </button>

          {/* Assign to */}
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-[#424867] font-bold">Assign to</span>
            <Select
              className="flex-1"
              value={rule.assignTo}
              options={destinationNames.length > 0 ? destinationNames : [rule.assignTo]}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function Select({
  value,
  options,
  className,
}: {
  value: string
  options: string[]
  className?: string
}) {
  return (
    <select
      defaultValue={value}
      className={`h-8 px-2 rounded border border-[#cbd2e1] bg-white text-[12px] text-[#1d2433] focus:outline-none focus:border-[#1fac76] ${className ?? ''}`}
      style={{ fontFamily: MUSEO }}
    >
      {options.includes(value) ? null : <option value={value}>{value}</option>}
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  )
}

function ToggleSwitch({ defaultActive }: { defaultActive: boolean }) {
  const [on, setOn] = useState(defaultActive)
  return (
    <button
      onClick={() => setOn((v) => !v)}
      role="switch"
      aria-checked={on}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ${
        on ? 'bg-[#1fac76]' : 'bg-[#cbd2e1]'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
          on ? 'translate-x-[18px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}
