import Add from '@floqastinc/flow-ui_icons/material/Add'
import { SectionHeader } from './SectionHeader'
import { EnterTransition } from '../EnterTransition'
import { DIMENSION_OPTIONS, DIMENSION_VALUE_OPTIONS, type AccountFilterState } from '../addGroupTypes'

interface AccountBalanceFiltersSectionProps {
  accounts: AccountFilterState[]
  onEdit: () => void
}

export function AccountBalanceFiltersSection({ accounts, onEdit }: AccountBalanceFiltersSectionProps) {
  return (
    <div className="flex flex-col gap-[8px] w-full pl-[20px]">
      <SectionHeader label="Accounts included" editLabel="Configure" editCaret onEdit={onEdit} />
      <div className="border border-solid border-[#e1e6ef] rounded-[6px] flex flex-col w-full overflow-hidden">
        <button
          type="button"
          className="flex items-center gap-[8px] px-[12px] py-[12px] w-full border-0 border-b border-solid border-[#e1e6ef] hover:bg-[#f1f3f9]"
          onClick={onEdit}
        >
          <Add className="size-[16px]" color="#6b7280" />
          <span className="text-[11px] font-semibold text-[#6b7280]">Bulk Account Balance Filters</span>
        </button>
        {accounts.map((account, i) => (
          <EnterTransition
            key={account.id}
            className={`flex flex-col gap-[8px] px-[12px] py-[12px] w-full ${i > 0 ? 'border-t border-solid border-[#e1e6ef]' : ''}`}
          >
            <p className="text-[11px] font-semibold text-[#1d2433] leading-[16px]">{account.name}</p>
            {account.rows.length === 0 || account.rows.every((row) => !row.dimension) ? (
              <p className="text-[11px] text-[#adb2bb] leading-[16px]">No filter applied</p>
            ) : (
              <ul className="flex flex-col gap-[2px]">
                {account.rows
                  .filter((row) => row.dimension)
                  .map((row) => {
                    const dimensionLabel = DIMENSION_OPTIONS.find((o) => o.value === row.dimension)?.label
                    const valueLabel = row.dimension
                      ? DIMENSION_VALUE_OPTIONS[row.dimension]?.find((o) => o.value === row.value)?.label
                      : undefined
                    return (
                      <li key={row.id} className="text-[11px] leading-[16px]">
                        <span className="font-semibold text-[#1d2433]">{dimensionLabel}: </span>
                        <span className="text-[#1d2433]">{valueLabel ?? '(No Value)'}</span>
                      </li>
                    )
                  })}
              </ul>
            )}
          </EnterTransition>
        ))}
      </div>
    </div>
  )
}
