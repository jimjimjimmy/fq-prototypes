/**
 * UsersFilters — the sub-tabs (Team Members / Auditors) and the status filter
 * pills (Active / Pending / Unassigned / Deactivated) below them.
 * Mirrors Figma node 2198:6654 (Tabs & Filters).
 *
 * Built as a custom tab bar + pills so the count chips render exactly as in
 * the design (FlowUI TabGroup titles are plain strings). Active underline and
 * pill colors use FlowUI neutral/brand tokens.
 */
import { useState } from 'react'
import { STATUS_FILTERS, TAB_COUNTS } from '../data/users'

type TabKey = 'team' | 'auditors'

function CountChip({ value, active }: { value: number; active?: boolean }) {
  return (
    <span
      className={`inline-flex items-center justify-center min-w-[20px] h-[18px] px-1.5 rounded-full text-[11px] font-semibold ${
        active ? 'bg-[#e1e6ef] text-[#1d2433]' : 'bg-[#f1f3f9] text-[#6b7280]'
      }`}
    >
      {value}
    </span>
  )
}

export function UsersFilters() {
  const [tab, setTab] = useState<TabKey>('team')
  const [activeFilter, setActiveFilter] = useState('Active')

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: 'team', label: 'Team Members', count: TAB_COUNTS.teamMembers },
    { key: 'auditors', label: 'Auditors', count: TAB_COUNTS.auditors },
  ]

  return (
    <div className="flex flex-col gap-4">
      {/* Sub-tabs */}
      <div className="flex items-center gap-6 border-b border-[#e1e6ef]">
        {tabs.map((t) => {
          const isActive = t.key === tab
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 pb-2.5 -mb-px border-b-2 text-[14px] font-semibold transition-colors ${
                isActive
                  ? 'border-[#186749] text-[#1d2433]'
                  : 'border-transparent text-[#6b7280] hover:text-[#1d2433]'
              }`}
            >
              {t.label}
              <CountChip value={t.count} active={isActive} />
            </button>
          )
        })}
      </div>

      {/* Status filter pills */}
      <div className="flex items-center gap-2">
        {STATUS_FILTERS.map((f) => {
          const isActive = f.label === activeFilter
          return (
            <button
              key={f.label}
              onClick={() => setActiveFilter(f.label)}
              className={`h-6 px-2.5 rounded-full text-[12px] font-medium transition-colors ${
                isActive
                  ? 'bg-[#424867] text-white' /* Badges/Neutral hover bg + white text */
                  : 'bg-[#f1f3f9] text-[#6b7280] hover:bg-[#e1e6ef]'
              }`}
            >
              {f.label} ({f.count})
            </button>
          )
        })}
      </div>
    </div>
  )
}
