import { DropdownButton, Select } from '@floqastinc/flow-ui_core'
import FormatListBulletedOutlined from '@floqastinc/flow-ui_icons/material/FormatListBulletedOutlined'
import { CursorTooltip } from './CursorTooltip'
import type { AccountOption } from './drawers/addGroupTypes'

const SELECT_ALL_VALUE = '__select_all__'

interface AccountsMultiSelectFieldProps {
  label: string
  accounts: AccountOption[]
  value: string[]
  disabled?: boolean
  // Shown on hover while disabled - e.g. "Please select an Entity first".
  // Only rendered when both `disabled` and this are set.
  disabledTooltip?: string
  isRequired?: boolean
  onChange: (value: string[]) => void
}

export function AccountsMultiSelectField({
  label,
  accounts,
  value,
  disabled,
  disabledTooltip,
  isRequired = true,
  onChange,
}: AccountsMultiSelectFieldProps) {
  const allSelected = accounts.length > 0 && value.length === accounts.length

  const options = [
    { label: 'Select All', value: SELECT_ALL_VALUE },
    ...accounts.map((a) => ({ label: a.name, value: a.id })),
  ]

  // The Select component treats "Select All" as an ordinary option - it has
  // no built-in select-all semantics. When it's the toggled option, override
  // the default per-option toggle with "select every real account" / "clear
  // all" instead of just adding/removing the marker itself.
  const handleChange = (newValue: string | string[] | null, context?: { action: string; targetValue?: string }) => {
    if (context?.targetValue === SELECT_ALL_VALUE) {
      onChange(allSelected ? [] : accounts.map((a) => a.id))
      return
    }
    onChange((Array.isArray(newValue) ? newValue : []).filter((v) => v !== SELECT_ALL_VALUE))
  }

  const selectValue = allSelected ? [SELECT_ALL_VALUE, ...value] : value
  const buttonLabel = value.length === 0 ? 'Select Account' : `${value.length} Account${value.length === 1 ? '' : 's'} Selected`

  const select = (
    <Select
      options={options}
      value={selectValue}
      selectionMode="multiple"
      filterPlaceholder="Search"
      disableClear
      contentWidth="var(--trigger-width)"
      onChange={handleChange}
      trigger={
        <DropdownButton
          label={label}
          isRequired={isRequired}
          disabled={disabled}
          className="hover:!border-[#6b7280] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center gap-[8px]">
            <FormatListBulletedOutlined className="size-[20px]" />
            {buttonLabel}
          </span>
        </DropdownButton>
      }
    />
  )

  return (
    <CursorTooltip disabled={Boolean(disabled)} tooltip={disabledTooltip}>
      {select}
    </CursorTooltip>
  )
}
