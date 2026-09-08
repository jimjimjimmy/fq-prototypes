import { useState } from 'react'
import { IconButton } from '@floqastinc/flow-ui_core'
import Add from '@floqastinc/flow-ui_icons/material/Add'
import ChevronLeft from '@floqastinc/flow-ui_icons/material/ChevronLeft'
import Close from '@floqastinc/flow-ui_icons/material/Close'
import { AccountsMultiSelectField } from '../../AccountsMultiSelectField'
import { RevealTransition } from '../RevealTransition'
import { EnterTransition } from '../EnterTransition'
import { DimensionValueRow, nextRowId } from './DimensionValueRow'
import type { AccountFilterState, FilterRow } from '../addGroupTypes'

interface AccountFiltersDrillInProps {
  accounts: AccountFilterState[]
  onCancel: () => void
  onDone: (accounts: AccountFilterState[]) => void
  onCloseAll: () => void
}

export function AccountFiltersDrillIn({ accounts, onCancel, onDone, onCloseAll }: AccountFiltersDrillInProps) {
  const [draft, setDraft] = useState<AccountFilterState[]>(accounts)
  const hasChanges = JSON.stringify(draft) !== JSON.stringify(accounts)

  const [bulkAccounts, setBulkAccounts] = useState<string[]>([])
  const [bulkRows, setBulkRows] = useState<FilterRow[]>([{ id: 'bulk-initial', dimension: null, value: null }])

  const updateRow = (accountId: string, rowId: string, patch: Partial<FilterRow>) => {
    setDraft((prev) =>
      prev.map((acct) =>
        acct.id === accountId
          ? { ...acct, rows: acct.rows.map((row) => (row.id === rowId ? { ...row, ...patch } : row)) }
          : acct,
      ),
    )
  }

  const addRow = (accountId: string) => {
    setDraft((prev) =>
      prev.map((acct) =>
        acct.id === accountId
          ? { ...acct, rows: [...acct.rows, { id: nextRowId(), dimension: null, value: null }] }
          : acct,
      ),
    )
  }

  const removeRow = (accountId: string, rowId: string) => {
    setDraft((prev) =>
      prev.map((acct) => (acct.id === accountId ? { ...acct, rows: acct.rows.filter((row) => row.id !== rowId) } : acct)),
    )
  }

  const clearBulk = () => {
    setBulkAccounts([])
    setBulkRows([{ id: 'bulk-initial', dimension: null, value: null }])
  }

  const updateBulkRow = (rowId: string, patch: Partial<FilterRow>) =>
    setBulkRows((prev) => prev.map((row) => (row.id === rowId ? { ...row, ...patch } : row)))

  const addBulkRow = () => setBulkRows((prev) => [...prev, { id: nextRowId(), dimension: null, value: null }])

  const removeBulkRow = (rowId: string) => setBulkRows((prev) => prev.filter((row) => row.id !== rowId))

  const applyBulk = () => {
    const rowsToApply = bulkRows.filter((row) => row.dimension)
    if (rowsToApply.length === 0 || bulkAccounts.length === 0) return
    setDraft((prev) =>
      prev.map((acct) => {
        if (!bulkAccounts.includes(acct.id)) return acct
        const newRows = rowsToApply.map((row) => ({ id: nextRowId(), dimension: row.dimension, value: row.value }))
        return { ...acct, rows: [...acct.rows, ...newRows] }
      }),
    )
    clearBulk()
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex gap-[16px] items-center pb-[24px] px-[24px] pt-[24px] w-full shrink-0">
        <div className="flex flex-1 min-w-0 flex-col gap-[12px] items-start">
          <button type="button" className="flex gap-[4px] items-center" onClick={onCancel}>
            <ChevronLeft className="size-[16px]" color="black" />
            <span className="text-[11px] font-semibold text-black underline">Back</span>
          </button>
          <p className="font-[family-name:'Museo_Sans',sans-serif] font-bold text-[16px] leading-[20px] text-black">
            Account Balance Filters
          </p>
        </div>
        <IconButton size="md" onClick={onCloseAll}>
          <Close className="size-[20px]" />
        </IconButton>
      </div>

      <div className="flex-1 overflow-auto px-[24px]">
        <div className="flex flex-col gap-[24px] items-start w-full pb-[24px]">
          <div className="flex flex-col gap-[4px] items-start w-full">
            <p className="text-[#424867] text-[12px] leading-[18px] font-medium">Bulk balance filters</p>
            <div className="border border-solid border-[#e1e6ef] rounded-[6px] flex flex-col gap-[16px] items-start px-[16px] py-[12px] w-full">
              <div className="w-full">
                <AccountsMultiSelectField
                  label="Applying to accounts:"
                  accounts={accounts}
                  value={bulkAccounts}
                  isRequired={false}
                  onChange={setBulkAccounts}
                />
              </div>
              <RevealTransition show={bulkAccounts.length > 0}>
                <div className="flex flex-col gap-[16px] items-start w-full">
                  {bulkRows.map((row) => (
                    <EnterTransition key={row.id} className="w-full">
                      <DimensionValueRow
                        row={row}
                        onUpdate={(patch) => updateBulkRow(row.id, patch)}
                        onRemove={() => removeBulkRow(row.id)}
                      />
                    </EnterTransition>
                  ))}
                  <button type="button" className="flex items-center gap-[8px] h-[26px] px-[6px]" onClick={addBulkRow}>
                    <Add className="size-[16px]" color="#6b7280" />
                    <span className="text-[11px] font-bold text-[#6b7280]">Add Dimension</span>
                  </button>
                  <div className="flex gap-[16px] items-start justify-end w-full">
                    <button type="button" className="h-[32px] flex items-center text-[12px] font-bold text-[#6b7280] capitalize" onClick={clearBulk}>
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="h-[32px] flex items-center px-[16px] rounded-[6px] border-[1.4px] border-solid border-[#cbd2e1] text-[12px] font-bold text-[#6b7280] capitalize"
                      onClick={applyBulk}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </RevealTransition>
            </div>
          </div>

          <div className="flex flex-col gap-[8px] items-start w-full">
            <p className="text-[#424867] text-[12px] leading-[18px] font-medium">Individual accounts</p>
            <div className="border border-solid border-[#e1e6ef] rounded-[6px] flex flex-col items-start w-full overflow-hidden">
              {draft.map((account, i) => (
                <div key={account.id} className={`flex flex-col items-start px-[16px] w-full ${i > 0 ? 'border-t border-solid border-[#e1e6ef]' : ''}`}>
                  <p className="text-[12px] font-semibold text-[#1d2433] leading-[16px] pt-[12px] pb-[4px]">{account.name}</p>
                  <div className="flex flex-col gap-[16px] items-start py-[12px] w-full">
                    {account.rows.map((row) => (
                      <EnterTransition key={row.id} className="w-full">
                        <DimensionValueRow
                          row={row}
                          onUpdate={(patch) => updateRow(account.id, row.id, patch)}
                          onRemove={() => removeRow(account.id, row.id)}
                        />
                      </EnterTransition>
                    ))}
                    <button
                      type="button"
                      className="flex items-center gap-[8px] h-[26px] px-[6px]"
                      onClick={() => addRow(account.id)}
                    >
                      <Add className="size-[16px]" color="#6b7280" />
                      <span className="text-[11px] font-bold text-[#6b7280]">Add Dimension</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-[16px] items-center justify-end pb-[12px] mt-[16px] w-full">
              <button type="button" className="h-[32px] flex items-center text-[12px] font-bold text-[#6b7280] capitalize" onClick={onCancel}>
                Cancel
              </button>
              <button
                type="button"
                disabled={!hasChanges}
                className="h-[32px] flex items-center px-[16px] rounded-[6px] border-[1.4px] border-solid border-[#cbd2e1] text-[12px] font-bold text-[#6b7280] capitalize disabled:opacity-50"
                onClick={() => onDone(draft)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
