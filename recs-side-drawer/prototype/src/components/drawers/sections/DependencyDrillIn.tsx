import { useState } from 'react'
import { IconButton, Radio, RadioGroup } from '@floqastinc/flow-ui_core'
import Add from '@floqastinc/flow-ui_icons/material/Add'
import BlockOutlined from '@floqastinc/flow-ui_icons/material/BlockOutlined'
import ChevronLeft from '@floqastinc/flow-ui_icons/material/ChevronLeft'
import Close from '@floqastinc/flow-ui_icons/material/Close'
import DeleteOutlined from '@floqastinc/flow-ui_icons/material/DeleteOutlined'
import DomainOutlined from '@floqastinc/flow-ui_icons/material/DomainOutlined'
import FolderOutlined from '@floqastinc/flow-ui_icons/material/FolderOutlined'
import { FormDropdownField } from '../../FormDropdownField'
import { EnterTransition } from '../EnterTransition'
import {
  ACCOUNT_OPTIONS,
  ENTITY_OPTIONS,
  FOLDER_OPTIONS,
  RELATIONSHIP_TYPE_OPTIONS,
  TASK_OPTIONS,
  type DependencyRow,
} from '../addGroupTypes'

let rowIdCounter = 0
function nextRowId() {
  rowIdCounter += 1
  return `dependency-${rowIdCounter}`
}

function blankDependency(): DependencyRow {
  return {
    id: nextRowId(),
    type: 'checklist',
    relationshipType: 'blocked-by',
    entity: null,
    folder: null,
    itemId: null,
  }
}

interface DependencyCardProps {
  row: DependencyRow
  onUpdate: (patch: Partial<DependencyRow>) => void
  onRemove: () => void
}

function DependencyCard({ row, onUpdate, onRemove }: DependencyCardProps) {
  // The Checklist/Reconciliation type toggle scopes which item list the
  // picker shows: Checklist depends on another Task, Reconciliation depends
  // on an Account.
  const itemOptions = row.type === 'checklist' ? TASK_OPTIONS : ACCOUNT_OPTIONS
  const itemHeading = row.type === 'checklist' ? `Tasks (${itemOptions.length})` : `Accounts (${itemOptions.length})`

  return (
    <div className="border border-solid border-[#e1e6ef] rounded-[6px] flex flex-col gap-[16px] px-[16px] py-[12px] w-full">
      <div className="flex items-center justify-between w-full">
        <RadioGroup
          orientation="horizontal"
          className="flex gap-[24px] items-center"
          value={row.type}
          onValueChange={(v) => onUpdate({ type: v as DependencyRow['type'], folder: null, itemId: null })}
        >
          <Radio value="checklist">Checklist</Radio>
          <Radio value="reconciliation">Reconciliation</Radio>
        </RadioGroup>
        <IconButton size="sm" onClick={onRemove}>
          <DeleteOutlined className="size-[20px]" />
        </IconButton>
      </div>

      <FormDropdownField
        label="Relationship Type"
        placeholder="Select"
        icon={<BlockOutlined className="size-[20px]" />}
        isRequired
        options={RELATIONSHIP_TYPE_OPTIONS}
        value={row.relationshipType}
        onChange={(v) => onUpdate({ relationshipType: v })}
      />

      <div className="flex gap-[16px] items-start w-full">
        <div className="flex-1 min-w-0">
          <FormDropdownField
            label="Entity"
            placeholder="Select entity"
            icon={<DomainOutlined className="size-[20px]" />}
            isRequired
            options={ENTITY_OPTIONS}
            value={row.entity}
            onChange={(v) => onUpdate({ entity: v, folder: null, itemId: null })}
          />
        </div>
        <div className="flex-1 min-w-0">
          <FormDropdownField
            label="Folder"
            placeholder="Select a Folder"
            icon={<FolderOutlined className="size-[20px]" />}
            isRequired
            disabled={!row.entity}
            options={FOLDER_OPTIONS}
            value={row.folder}
            onChange={(v) => onUpdate({ folder: v, itemId: null })}
          />
        </div>
      </div>

      {row.folder && (
        <div className="flex flex-col gap-[8px] items-start w-full">
          <p className="text-[#1d2433] text-[12px] leading-[16px] font-semibold">{itemHeading}</p>
          <RadioGroup
            className="flex flex-col gap-[12px] w-full"
            value={row.itemId ?? ''}
            onValueChange={(v) => onUpdate({ itemId: v })}
          >
            {itemOptions.map((opt) => (
              <Radio key={opt.value} value={opt.value} className="w-full">
                <span className="whitespace-normal break-words">{opt.label}</span>
              </Radio>
            ))}
          </RadioGroup>
        </div>
      )}
    </div>
  )
}

interface DependencyDrillInProps {
  dependencies: DependencyRow[]
  onCancel: () => void
  onDone: (dependencies: DependencyRow[]) => void
  onCloseAll: () => void
}

export function DependencyDrillIn({ dependencies, onCancel, onDone, onCloseAll }: DependencyDrillInProps) {
  const [draft, setDraft] = useState<DependencyRow[]>(dependencies.length ? dependencies : [blankDependency()])

  const addRow = () => setDraft((prev) => [...prev, blankDependency()])
  const removeRow = (id: string) => setDraft((prev) => prev.filter((r) => r.id !== id))
  const updateRow = (id: string, patch: Partial<DependencyRow>) =>
    setDraft((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))

  const isRowComplete = (row: DependencyRow) =>
    Boolean(row.relationshipType) && Boolean(row.entity) && Boolean(row.folder) && Boolean(row.itemId)
  // A row still in its just-added, nothing-picked-yet state (blankDependency
  // sets relationshipType but leaves entity/folder/itemId null) doesn't
  // count toward completeness - it gets silently dropped on Done same as
  // any other incomplete row, but it shouldn't block Done from picking up a
  // real, finished edit made to a different row.
  const isRowPristine = (row: DependencyRow) => row.entity === null && row.folder === null && row.itemId === null
  const meaningfulRows = draft.filter((row) => !isRowPristine(row))
  const hasChanges = JSON.stringify(meaningfulRows.filter(isRowComplete)) !== JSON.stringify(dependencies)
  const canDone = meaningfulRows.every(isRowComplete) && hasChanges

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex gap-[16px] items-center pb-[24px] px-[24px] pt-[24px] w-full shrink-0">
        <div className="flex flex-1 min-w-0 flex-col gap-[12px] items-start">
          <button type="button" className="flex gap-[4px] items-center" onClick={onCancel}>
            <ChevronLeft className="size-[16px]" color="black" />
            <span className="text-[11px] font-semibold text-black underline">Back</span>
          </button>
          <p className="font-[family-name:'Museo_Sans',sans-serif] font-bold text-[16px] leading-[20px] text-black">
            Add Dependency
          </p>
        </div>
        <IconButton size="md" onClick={onCloseAll}>
          <Close className="size-[20px]" />
        </IconButton>
      </div>

      <div className="flex-1 overflow-auto px-[24px]">
        <div className="flex flex-col gap-[16px] items-start w-full pb-[24px]">
          {draft.map((row) => (
            <EnterTransition key={row.id} className="w-full">
              <DependencyCard
                row={row}
                onUpdate={(patch) => updateRow(row.id, patch)}
                onRemove={() => removeRow(row.id)}
              />
            </EnterTransition>
          ))}

          <button type="button" className="flex items-center gap-[8px] h-[26px] px-[6px]" onClick={addRow}>
            <Add className="size-[16px]" color="#6b7280" />
            <span className="text-[11px] font-bold text-[#6b7280]">Add Dependency</span>
          </button>

          <div className="flex gap-[16px] items-center justify-end pb-[12px] mt-[8px] w-full">
            <button type="button" className="h-[32px] flex items-center text-[12px] font-bold text-[#6b7280] capitalize" onClick={onCancel}>
              Cancel
            </button>
            <button
              type="button"
              disabled={!canDone}
              className="h-[32px] flex items-center px-[16px] rounded-[6px] border-[1.4px] border-solid border-[#cbd2e1] text-[12px] font-bold text-[#6b7280] capitalize disabled:opacity-50"
              onClick={() => onDone(draft.filter(isRowComplete))}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
