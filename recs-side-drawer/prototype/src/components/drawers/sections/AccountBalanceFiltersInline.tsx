import Add from '@floqastinc/flow-ui_icons/material/Add'
import { EnterTransition } from '../EnterTransition'
import { DimensionValueRow, nextRowId } from './DimensionValueRow'
import type { AccountFilterState } from '../addGroupTypes'

interface AccountBalanceFiltersInlineProps {
  account: AccountFilterState
  onChange: (account: AccountFilterState) => void
  // Add Group shows this section under an "Accounts included" label (it sits
  // below the multi-account summary it replaces at exactly 1 account). Add
  // Account has no such summary to label - per Figma (node 8624:47320) the
  // box there has no header text at all, so this is opt-in per caller.
  label?: string
}

// Exactly-1-account variant of Account Balance Filters: no bulk section (bulk
// has nothing to apply to with one account), no Configure trigger to drill
// into - the dimension/value rows for that single account are just always
// shown inline, since there's no bulk-vs-individual distinction to manage.
export function AccountBalanceFiltersInline({ account, onChange, label }: AccountBalanceFiltersInlineProps) {
  const addRow = () => onChange({ ...account, rows: [...account.rows, { id: nextRowId(), dimension: null, value: null }] })

  const updateRow = (rowId: string, patch: Partial<AccountFilterState['rows'][number]>) =>
    onChange({ ...account, rows: account.rows.map((row) => (row.id === rowId ? { ...row, ...patch } : row)) })

  const removeRow = (rowId: string) => onChange({ ...account, rows: account.rows.filter((row) => row.id !== rowId) })

  return (
    <div className="flex flex-col gap-[8px] w-full pl-[20px]">
      {label && <p className="text-[#424867] text-[12px] leading-[18px] font-medium">{label}</p>}
      <div className="border border-solid border-[#e1e6ef] rounded-[6px] flex flex-col items-start px-[16px] w-full overflow-hidden">
        <p className="text-[12px] font-semibold text-[#1d2433] leading-[16px] pt-[12px] pb-[4px]">{account.name}</p>
        <div className="flex flex-col gap-[16px] items-start py-[12px] w-full">
          {account.rows.map((row) => (
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
    </div>
  )
}
