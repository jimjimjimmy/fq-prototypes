import { useState } from 'react'
import { Avatar, IconButton, Input } from '@floqastinc/flow-ui_core'
import Add from '@floqastinc/flow-ui_icons/material/Add'
import ChevronLeft from '@floqastinc/flow-ui_icons/material/ChevronLeft'
import Close from '@floqastinc/flow-ui_icons/material/Close'
import DeleteOutlined from '@floqastinc/flow-ui_icons/material/DeleteOutlined'
import { FormDropdownField } from '../../FormDropdownField'
import { EnterTransition } from '../EnterTransition'
import { AVATAR_SRC_BY_NAME, DAY_TYPE_OPTIONS, ROLE_OPTIONS, type AssigneeState } from '../addGroupTypes'

const GROUP_OPTIONS = [
  { label: 'Accounting Team', value: 'group-accounting' },
  { label: 'FP&A Team', value: 'group-fpa' },
]

const TEAM_MEMBER_OPTIONS = [
  { label: 'Elijah Wood', value: 'elijah-wood' },
  { label: 'Viggo Mortensen', value: 'viggo-mortensen' },
  { label: 'Billy Boyd', value: 'billy-boyd' },
  { label: 'Ian McKellen', value: 'ian-mckellen' },
  { label: 'Sean Bean', value: 'sean-bean' },
  { label: 'Liv Tyler', value: 'liv-tyler' },
  { label: 'Cate Blanchett', value: 'cate-blanchett' },
  { label: 'Karl Urban', value: 'karl-urban' },
  { label: 'Miranda Otto', value: 'miranda-otto' },
  { label: 'Evangeline Lilly', value: 'evangeline-lilly' },
]

// Flat list for value<->label lookups; the grouped shape below is only for
// how the Select renders its popover ("Groups" vs "Team Members" sections).
const PEOPLE_OPTIONS = [...GROUP_OPTIONS, ...TEAM_MEMBER_OPTIONS]

const PEOPLE_OPTION_GROUPS = [
  { groupLabel: 'Groups', options: GROUP_OPTIONS },
  { groupLabel: 'Team Members', options: TEAM_MEMBER_OPTIONS },
]

let assigneeIdCounter = 0
function nextAssigneeId() {
  assigneeIdCounter += 1
  return `assignee-${assigneeIdCounter}`
}

function blankAssignee(): AssigneeState {
  return {
    id: nextAssigneeId(),
    name: null,
    role: null,
    dayType: 'business-day',
    day: '',
    estimatedTime: '',
  }
}

interface AssigneesDrillInProps {
  assignees: AssigneeState[]
  onCancel: () => void
  onDone: (assignees: AssigneeState[]) => void
  onCloseAll: () => void
}

export function AssigneesDrillIn({ assignees, onCancel, onDone, onCloseAll }: AssigneesDrillInProps) {
  const [draft, setDraft] = useState<AssigneeState[]>(assignees.length ? assignees : [blankAssignee()])

  // Only rows with a name actually represent a saved assignee - a freshly
  // added blank row (or the placeholder row shown when there are none yet)
  // isn't a real change until it's given a name.
  const hasChanges = JSON.stringify(draft.filter((a) => a.name)) !== JSON.stringify(assignees)

  const addRow = () => setDraft((prev) => [...prev, blankAssignee()])

  const removeRow = (id: string) => setDraft((prev) => prev.filter((a) => a.id !== id))

  const updateRow = (id: string, patch: Partial<AssigneeState>) =>
    setDraft((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)))

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex gap-[16px] items-center pb-[24px] px-[24px] pt-[24px] w-full shrink-0">
        <div className="flex flex-1 min-w-0 flex-col gap-[12px] items-start">
          <button type="button" className="flex gap-[4px] items-center" onClick={onCancel}>
            <ChevronLeft className="size-[16px]" color="black" />
            <span className="text-[11px] font-semibold text-black underline">Back</span>
          </button>
          <p className="font-[family-name:'Museo_Sans',sans-serif] font-bold text-[16px] leading-[20px] text-black">
            Add Assignees
          </p>
        </div>
        <IconButton size="md" onClick={onCloseAll}>
          <Close className="size-[20px]" />
        </IconButton>
      </div>

      <div className="flex-1 overflow-auto px-[24px]">
        <div className="flex flex-col gap-[24px] items-start w-full pb-[24px]">
          <div className="border border-solid border-[#e1e6ef] rounded-[6px] flex flex-col items-start w-full overflow-hidden">
            {draft.map((assignee, i) => (
              <EnterTransition key={assignee.id} className="flex flex-col items-start px-[16px] w-full">
                {i > 0 && <div className="h-px w-full bg-[#e1e6ef]" />}
                <div className="flex gap-[16px] items-start pb-[8px] w-full">
                  <div className="flex flex-1 min-w-0 flex-col gap-[16px] items-start py-[12px]">
                    <div className="flex gap-[16px] items-start w-full">
                      <div className="flex-1 min-w-0">
                        <FormDropdownField
                          label="Assignee"
                          placeholder="Select assignee"
                          icon={
                            <Avatar
                              size="sm"
                              fallback={assignee.name ?? undefined}
                              src={assignee.name ? AVATAR_SRC_BY_NAME[assignee.name] : undefined}
                            />
                          }
                          options={PEOPLE_OPTION_GROUPS}
                          value={PEOPLE_OPTIONS.find((p) => p.label === assignee.name)?.value ?? null}
                          onChange={(v) => updateRow(assignee.id, { name: PEOPLE_OPTIONS.find((p) => p.value === v)?.label ?? null })}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <FormDropdownField
                          label="Role"
                          placeholder="Select role"
                          options={ROLE_OPTIONS}
                          value={assignee.role}
                          onChange={(v) => updateRow(assignee.id, { role: v })}
                        />
                      </div>
                    </div>
                    <div className="flex gap-[16px] items-end w-full">
                      <div className="flex gap-[16px] items-end w-[264px] min-w-[240px] shrink-0">
                        <div className="flex-1 min-w-0">
                          <FormDropdownField
                            label="Day Type"
                            placeholder="Select"
                            options={DAY_TYPE_OPTIONS}
                            value={assignee.dayType}
                            onChange={(v) => updateRow(assignee.id, { dayType: v })}
                          />
                        </div>
                        <div className="w-[54px] shrink-0">
                          <Input
                            label="Day"
                            placeholder="15"
                            value={assignee.day}
                            onChange={(v) => updateRow(assignee.id, { day: v })}
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <Input
                          label="Estimated Time"
                          placeholder="05h 45m"
                          value={assignee.estimatedTime}
                          onChange={(v) => updateRow(assignee.id, { estimatedTime: v })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start justify-center self-stretch pt-[38px] shrink-0">
                    <IconButton size="sm" onClick={() => removeRow(assignee.id)}>
                      <DeleteOutlined className="size-[20px]" />
                    </IconButton>
                  </div>
                </div>
              </EnterTransition>
            ))}
            <div className="flex flex-col items-start pb-[12px] pt-[4px] px-[12px] w-full">
              <button
                type="button"
                className="flex items-center gap-[8px] h-[32px] px-[12px] py-[8px] rounded-[6px]"
                onClick={addRow}
              >
                <Add className="size-[20px]" color="#6b7280" />
                <span className="text-[12px] font-bold text-[#6b7280] capitalize">Add Assignee</span>
              </button>
            </div>
          </div>

          <div className="flex gap-[16px] items-center justify-end pb-[12px] w-full">
            <button type="button" className="h-[32px] flex items-center text-[12px] font-bold text-[#6b7280] capitalize" onClick={onCancel}>
              Cancel
            </button>
            <button
              type="button"
              disabled={!hasChanges}
              className="h-[32px] flex items-center px-[16px] rounded-[6px] border-[1.4px] border-solid border-[#cbd2e1] text-[12px] font-bold text-[#6b7280] capitalize disabled:opacity-50"
              onClick={() => onDone(draft.filter((a) => a.name))}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
