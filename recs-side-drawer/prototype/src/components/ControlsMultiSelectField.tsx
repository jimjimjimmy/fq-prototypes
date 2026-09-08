import { useState } from 'react'
import { ActionableBadge, Checkbox, Input, Popover, TagDropdownButton } from '@floqastinc/flow-ui_core'
import KeyOutlined from '@floqastinc/flow-ui_icons/material/KeyOutlined'
import VerifiedUserOutlined from '@floqastinc/flow-ui_icons/material/VerifiedUserOutlined'

export interface ControlOption {
  label: string
  value: string
  sublabel: string
}

interface ControlsMultiSelectFieldProps {
  label: string
  options: ControlOption[]
  value: string[]
  onChange: (value: string[]) => void
}

// FlowUI's Select only supports a plain-string label per option (its search
// filter runs `contains(item.label, ...)`), so it has no slot for a
// title + truncated description + trailing icon row like the Controls
// picker needs. Built directly on the raw Popover + Checkbox (which does
// support `sublabel` natively) instead of forcing Select to do this.
export function ControlsMultiSelectField({ label, options, value, onChange }: ControlsMultiSelectFieldProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filteredOptions = options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))

  const toggle = (optionValue: string) => {
    onChange(value.includes(optionValue) ? value.filter((v) => v !== optionValue) : [...value, optionValue])
  }

  const removeControl = (optionValue: string) => onChange(value.filter((v) => v !== optionValue))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        <TagDropdownButton
          label={label}
          open={open}
          disableSearchIcon
          className="hover:!border-[#6b7280]"
          placeholder={
            <span className="flex items-center gap-[8px]">
              <VerifiedUserOutlined className="size-[20px]" />
              Select Controls
            </span>
          }
        >
          {value.map((controlValue) => {
            const control = options.find((o) => o.value === controlValue)
            if (!control) return null
            return (
              <ActionableBadge key={control.value} size="small" onClick={() => {}} onPointerDown={() => removeControl(control.value)}>
                {control.label}
              </ActionableBadge>
            )
          })}
        </TagDropdownButton>
      </Popover.Trigger>
      <Popover.Content
        align="start"
        sideOffset={4}
        className="bg-white border border-solid border-[#e1e6ef] rounded-[6px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden"
        style={{ width: 'var(--radix-popover-trigger-width)' }}
      >
        <div className="p-[8px] border-b border-solid border-[#e1e6ef]">
          <Input
            type="search"
            placeholder="Search controls"
            value={search}
            onChange={setSearch}
            styleOverrides={{ inputWrapper: { boxShadow: 'none', borderColor: 'var(--flo-sem-color-border)' } }}
          />
        </div>
        <div className="flex flex-col max-h-[324px] overflow-y-auto p-[8px] gap-[4px]">
          {value.length > 0 && (
            <button
              type="button"
              className="text-[12px] font-bold text-[#3b82f6] text-left px-[8px] py-[4px] w-fit"
              onClick={() => onChange([])}
            >
              Clear
            </button>
          )}
          {filteredOptions.map((option) => (
            <div key={option.value} className="flex items-start justify-between gap-[8px] px-[8px] py-[8px] rounded-[6px] hover:bg-[#f1f3f9]">
              <div className="flex-1 min-w-0">
                <Checkbox
                  checked={value.includes(option.value)}
                  onCheckedChange={() => toggle(option.value)}
                  label={option.label}
                  sublabel={option.sublabel}
                  styleOverrides={{
                    sublabel: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
                  }}
                />
              </div>
              <KeyOutlined className="size-[20px] shrink-0" color="#6b7280" />
            </div>
          ))}
        </div>
      </Popover.Content>
    </Popover>
  )
}
