import ChevronRight from '@floqastinc/flow-ui_icons/material/ChevronRight'
import FormatListBulleted from '@floqastinc/flow-ui_icons/material/FormatListBulleted'
import { CursorTooltip } from '../../CursorTooltip'
import { SectionHeader } from './SectionHeader'
import {
  ACCOUNT_OPTIONS,
  ENTITY_OPTIONS,
  FOLDER_OPTIONS,
  TASK_OPTIONS,
  DUE_LABEL_BY_ITEM,
  type DependencyRow,
} from '../addGroupTypes'

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start w-full text-[12px] leading-[18px] text-[rgba(29,36,51,0.9)]">
      <p className="font-semibold shrink-0 w-[64px]">{label}:</p>
      <p className="flex-1 min-w-0">{value}</p>
    </div>
  )
}

function DependencyItem({ row }: { row: DependencyRow }) {
  const entity = ENTITY_OPTIONS.find((o) => o.value === row.entity)?.label ?? '-'
  const folder = FOLDER_OPTIONS.find((o) => o.value === row.folder)?.label ?? '-'
  const itemOptions = row.type === 'checklist' ? TASK_OPTIONS : ACCOUNT_OPTIONS
  const item = itemOptions.find((o) => o.value === row.itemId)?.label ?? '-'
  const itemFieldLabel = row.type === 'checklist' ? 'Task' : 'Account'
  const due = (row.itemId && DUE_LABEL_BY_ITEM[row.itemId]) || 'Day 1'

  return (
    <div className="flex flex-col gap-[2px] items-start w-full pl-[24px]">
      <DetailLine label="Entity" value={entity} />
      <DetailLine label="Folder" value={folder} />
      <DetailLine label={itemFieldLabel} value={item} />
      <DetailLine label="Due" value={due} />
    </div>
  )
}

// Groups dependencies by relationship direction - "Blocked by" (what this
// item depends on) and "Blocks" (what depends on this item) - each with a
// count in its heading, per the updated Figma (node 8617:61578). The two
// groups render in one card, separated by a divider when both are present.
function groupByRelationship(dependencies: DependencyRow[]) {
  return {
    blockedBy: dependencies.filter((r) => r.relationshipType !== 'blocks'),
    blocks: dependencies.filter((r) => r.relationshipType === 'blocks'),
  }
}

interface DependencySectionProps {
  dependencies: DependencyRow[]
  onEdit: () => void
  // Matches the live app's confirmed precondition: "Add Dependency" stays
  // disabled until the task/group itself is minimally valid (Folder,
  // Description, Frequency all filled in on Checklist's Add Task).
  disabled?: boolean
  // Shown on hover while disabled - e.g. "Please select a Frequency first".
  // Only rendered when both `disabled` and this are set.
  disabledTooltip?: string
}

interface AddButtonProps {
  disabled: boolean
  disabledTooltip?: string
  onClick: () => void
  className: string
  labelClassName: string
}

// Same pattern as FormDropdownField/AccountsMultiSelectField.
function AddButton({ disabled, disabledTooltip, onClick, className, labelClassName }: AddButtonProps) {
  return (
    <CursorTooltip disabled={disabled} tooltip={disabledTooltip}>
      <button type="button" disabled={disabled} className={className} onClick={onClick}>
        <FormatListBulleted className="size-[20px]" color="#6b7280" />
        <span className={labelClassName}>Add...</span>
        <ChevronRight className="size-[20px]" color="#6b7280" />
      </button>
    </CursorTooltip>
  )
}

export function DependencySection({ dependencies, onEdit, disabled = false, disabledTooltip }: DependencySectionProps) {
  if (dependencies.length === 0) {
    return (
      <div className="flex flex-col gap-[4px] items-start w-full">
        <SectionHeader label="Dependency" />
        <AddButton
          disabled={disabled}
          disabledTooltip={disabledTooltip}
          onClick={onEdit}
          className="border border-solid border-[#e1e6ef] rounded-[4px] flex items-center gap-[8px] px-[12px] py-[8px] w-full hover:!border-[#6b7280] disabled:opacity-50 disabled:cursor-not-allowed"
          labelClassName="flex-1 text-left text-[12px] font-bold text-[#6b7280]"
        />
      </div>
    )
  }

  const { blockedBy, blocks } = groupByRelationship(dependencies)
  const groups = [
    { key: 'blocked-by', label: `Blocked by (${blockedBy.length})`, rows: blockedBy },
    { key: 'blocks', label: `Blocks (${blocks.length})`, rows: blocks },
  ].filter((group) => group.rows.length > 0)

  return (
    <div className="flex flex-col gap-[4px] items-start w-full">
      <SectionHeader label="Dependencies" editLabel="Manage" editCaret onEdit={onEdit} />
      <div className="border border-solid border-[#e1e6ef] rounded-[6px] flex flex-col items-start w-full overflow-hidden">
        {groups.map((group, i) => (
          <div
            key={group.key}
            className={`flex flex-col gap-[8px] items-start px-[16px] py-[8px] w-full ${i > 0 ? 'border-t border-solid border-[#e1e6ef]' : ''}`}
          >
            <p className="font-semibold text-[12px] leading-[18px] text-[rgba(29,36,51,0.9)] whitespace-nowrap">{group.label}</p>
            {group.rows.map((row, j) => (
              <div key={row.id} className="flex flex-col items-start w-full">
                {j > 0 && <div className="h-px w-full bg-[#e1e6ef] mb-[8px]" />}
                <DependencyItem row={row} />
              </div>
            ))}
          </div>
        ))}
        <div className="border-t border-solid border-[#e1e6ef] flex flex-col items-start py-[4px] w-full">
          <AddButton
            disabled={disabled}
            disabledTooltip={disabledTooltip}
            onClick={onEdit}
            className="flex items-center gap-[8px] h-[32px] px-[16px] py-[8px] w-full hover:enabled:bg-[#f1f3f9] disabled:opacity-50 disabled:cursor-not-allowed"
            labelClassName="flex-1 text-left text-[12px] font-bold text-[#6b7280] capitalize"
          />
        </div>
      </div>
    </div>
  )
}
