import { useState } from 'react'
import Add from '@floqastinc/flow-ui_icons/material/Add'
import { RevealTransition } from '../RevealTransition'
import { EnterTransition } from '../EnterTransition'
import { SectionHeader } from './SectionHeader'
import { DimensionValueRow, nextRowId } from './DimensionValueRow'
import { DIMENSION_OPTIONS, DIMENSION_VALUE_OPTIONS, type AccountFilterState } from '../addGroupTypes'

interface AccountBalanceFiltersEditableProps {
  account: AccountFilterState
  onChange: (account: AccountFilterState) => void
}

// Edit-in-place variant for Add Account: same Cancel/Edit/Done pattern as
// General Settings (collapsed read-only summary until "Edit" is clicked,
// draft state committed only on "Done") - distinct from Add Group's
// single-account case, which stays always-shown with no trigger per its own
// spec (AccountBalanceFiltersInline).
export function AccountBalanceFiltersEditable({ account, onChange }: AccountBalanceFiltersEditableProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState<AccountFilterState>(account)

  const startEditing = () => {
    setDraft(account)
    setIsEditing(true)
  }
  const cancel = () => setIsEditing(false)
  const done = () => {
    onChange(draft)
    setIsEditing(false)
  }
  const hasChanges = JSON.stringify(draft) !== JSON.stringify(account)

  const addRow = () => setDraft((prev) => ({ ...prev, rows: [...prev.rows, { id: nextRowId(), dimension: null, value: null }] }))
  const updateRow = (rowId: string, patch: Partial<AccountFilterState['rows'][number]>) =>
    setDraft((prev) => ({ ...prev, rows: prev.rows.map((row) => (row.id === rowId ? { ...row, ...patch } : row)) }))
  const removeRow = (rowId: string) => setDraft((prev) => ({ ...prev, rows: prev.rows.filter((row) => row.id !== rowId) }))

  const appliedRows = account.rows.filter((row) => row.dimension)

  return (
    <div className="flex flex-col gap-[4px] w-full">
      <SectionHeader
        label="Account Balance Filters"
        isEditing={isEditing}
        doneDisabled={!hasChanges}
        onEdit={startEditing}
        onCancel={cancel}
        onDone={done}
      />

      <RevealTransition show={!isEditing}>
        <div className="border border-solid border-[#e1e6ef] rounded-[4px] flex flex-col gap-[4px] p-[16px] w-full">
          <p className="text-[12px] font-semibold text-[#1d2433] leading-[16px]">{account.name}</p>
          {appliedRows.length === 0 ? (
            <p className="text-[12px] text-[#6b7280] leading-[18px]">No filter applied</p>
          ) : (
            <ul className="flex flex-col gap-[2px]">
              {appliedRows.map((row) => {
                const dimensionLabel = DIMENSION_OPTIONS.find((o) => o.value === row.dimension)?.label
                const valueLabel = row.dimension
                  ? DIMENSION_VALUE_OPTIONS[row.dimension]?.find((o) => o.value === row.value)?.label
                  : undefined
                return (
                  <li key={row.id} className="text-[12px] leading-[18px]">
                    <span className="font-semibold text-[#1d2433]">{dimensionLabel}: </span>
                    <span className="text-[#1d2433]">{valueLabel ?? '(No Value)'}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </RevealTransition>

      <RevealTransition show={isEditing}>
        <div className="border border-solid border-[#e1e6ef] rounded-[6px] flex flex-col items-start px-[16px] w-full overflow-hidden">
          <p className="text-[12px] font-semibold text-[#1d2433] leading-[16px] pt-[12px] pb-[4px]">{account.name}</p>
          <div className="flex flex-col gap-[16px] items-start py-[12px] w-full">
            {draft.rows.map((row) => (
              <EnterTransition key={row.id} className="w-full">
                <DimensionValueRow row={row} onUpdate={(patch) => updateRow(row.id, patch)} onRemove={() => removeRow(row.id)} />
              </EnterTransition>
            ))}
            <button type="button" className="flex items-center gap-[8px] h-[26px] px-[6px]" onClick={addRow}>
              <Add className="size-[16px]" color="#6b7280" />
              <span className="text-[11px] font-bold text-[#6b7280]">Add Dimension</span>
            </button>
          </div>
        </div>
      </RevealTransition>
    </div>
  )
}
