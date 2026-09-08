import { useState } from 'react'
import { DropdownButton, Select, type SelectOptionItem, type SelectOptionGroup } from '@floqastinc/flow-ui_core'
import { CursorTooltip } from './CursorTooltip'

interface FormDropdownFieldProps {
  label: string
  placeholder: string
  icon?: React.ReactNode
  isRequired?: boolean
  disabled?: boolean
  // Shown on hover while disabled - e.g. "Please select an Entity first".
  // Only rendered when both `disabled` and this are set.
  disabledTooltip?: string
  options: (SelectOptionItem | SelectOptionGroup)[]
  value: string | null
  onChange: (value: string | null) => void
}

export function FormDropdownField({
  label,
  placeholder,
  icon,
  isRequired,
  disabled,
  disabledTooltip,
  options,
  value,
  onChange,
}: FormDropdownFieldProps) {
  const [open, setOpen] = useState(false)
  const flatOptions = options.flatMap((o) => ('options' in o ? o.options : [o]))
  const selectedLabel = flatOptions.find((o) => o.value === value)?.label

  const select = (
    <Select
      options={options}
      value={value}
      filterPlaceholder="Search"
      disableClear
      contentWidth="var(--trigger-width)"
      isOpen={open}
      onOpenChange={setOpen}
      onChange={(v) => {
        onChange(v as string | null)
        setOpen(false)
      }}
      trigger={
        // DropdownButton's own `icon` prop replaces its default trailing
        // chevron entirely (single icon slot) - so the leading icon goes in
        // children instead, leaving the default 20px chevron in place.
        <DropdownButton
          label={label}
          isRequired={isRequired}
          disabled={disabled}
          className="hover:!border-[#6b7280] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center gap-[8px]">
            {icon}
            {selectedLabel ?? placeholder}
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
