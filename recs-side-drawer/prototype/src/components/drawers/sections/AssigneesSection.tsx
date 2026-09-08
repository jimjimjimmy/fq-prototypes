import { Avatar } from '@floqastinc/flow-ui_core'
import ChevronRight from '@floqastinc/flow-ui_icons/material/ChevronRight'
import PersonAddOutlined from '@floqastinc/flow-ui_icons/material/PersonAddOutlined'
import { SectionHeader } from './SectionHeader'
import { AVATAR_SRC_BY_NAME, ROLE_OPTIONS, type AssigneeState } from '../addGroupTypes'

// Exactly two - a third made the suggestions row wrap to a second line at
// the drawer's width, which reads worse than losing "always 2 remaining"
// after one gets added.
const SUGGESTIONS = [
  { name: 'Sean Bean', role: 'monthly-preparer', label: 'Sean Bean - Preparer' },
  { name: 'Ian McKellen', role: 'monthly-reviewer', label: 'Ian McKellen - Reviewer' },
]

// This prototype has no real date-math tying an assignee's Day Type/Day
// scheduling fields to an actual calendar due date - matching the Figma
// reference exactly (both example rows share one date), this is an
// illustrative placeholder, not derived from `day`/`dayType`.
const MOCK_DUE_DATE = '12/25/2026'

interface AssigneesSectionProps {
  assignees: AssigneeState[]
  onEdit: (seed?: AssigneeState[]) => void
  onAddAssignee: (assignee: AssigneeState) => void
}

export function AssigneesSection({ assignees, onEdit, onAddAssignee }: AssigneesSectionProps) {
  const addedNames = new Set(assignees.map((a) => a.name))
  const availableSuggestions = SUGGESTIONS.filter((s) => !addedNames.has(s.name))

  const suggestionsRow = availableSuggestions.length > 0 && (
    <div className="flex gap-[8px] items-center pl-[12px]">
      <p className="text-[#adb2bb] text-[11px]">Suggestions:</p>
      {availableSuggestions.map((s) => (
        <button
          key={s.label}
          type="button"
          className="bg-[#f1f3f9] rounded-[4px] px-[4px] py-[2px] text-[10px] font-semibold text-[#6b7280] hover:bg-[#e1e6ef]"
          onClick={() =>
            onAddAssignee({ id: `seed-${s.name}`, name: s.name, role: s.role, dayType: 'business-day', day: '', estimatedTime: '' })
          }
        >
          {s.label}
        </button>
      ))}
    </div>
  )

  if (assignees.length === 0) {
    return (
      <div className="flex flex-col gap-[8px] w-full">
        <SectionHeader label="Assignees" />
        <button
          type="button"
          className="border border-solid border-[#e1e6ef] rounded-[4px] flex items-center gap-[8px] px-[12px] py-[8px] w-full hover:!border-[#6b7280]"
          onClick={() => onEdit()}
        >
          <PersonAddOutlined className="size-[20px]" color="#6b7280" />
          <span className="flex-1 text-left text-[12px] font-bold text-[#6b7280]">Add...</span>
          <ChevronRight className="size-[20px]" color="#6b7280" />
        </button>
        {suggestionsRow}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-[8px] w-full">
      <SectionHeader label="Assignees" editLabel="Manage" editCaret onEdit={() => onEdit()} />
      <div className="border border-solid border-[#e1e6ef] rounded-[6px] flex flex-col items-start w-full overflow-hidden">
        <div className="border-b border-solid border-[#e1e6ef] flex h-[40px] items-center w-full px-[16px]">
          <span className="flex-1 text-[12px] font-medium text-black">Assignees</span>
          <span className="w-[152px] text-[12px] font-medium text-black">Roles</span>
          <span className="w-[104px] text-[12px] font-medium text-black">Due Date</span>
        </div>
        {assignees.map((a, i) => (
          <div
            key={a.id}
            className={`flex h-[48px] items-center w-full px-[16px] ${i > 0 ? 'border-t border-solid border-[#e1e6ef]' : ''}`}
          >
            <span className="flex-1 flex items-center gap-[8px] text-[12px] text-[#424867]">
              <Avatar size="sm" fallback={a.name ?? undefined} src={a.name ? AVATAR_SRC_BY_NAME[a.name] : undefined} />
              {a.name}
            </span>
            <span className="w-[152px] text-[12px] text-[#424867]">
              {ROLE_OPTIONS.find((r) => r.value === a.role)?.label ?? '-'}
            </span>
            <span className="w-[104px] text-[12px] text-[#424867]">{a.day ? MOCK_DUE_DATE : '-'}</span>
          </div>
        ))}
        <div className="border-t border-solid border-[#e1e6ef] flex flex-col items-start py-[4px] w-full">
          <button
            type="button"
            className="flex items-center gap-[8px] h-[32px] px-[16px] py-[8px] w-full hover:bg-[#f1f3f9]"
            onClick={() => onEdit()}
          >
            <PersonAddOutlined className="size-[20px]" color="#6b7280" />
            <span className="flex-1 text-left text-[12px] font-bold text-[#6b7280]">Add...</span>
            <ChevronRight className="size-[20px]" color="#6b7280" />
          </button>
        </div>
      </div>
      {suggestionsRow}
    </div>
  )
}
