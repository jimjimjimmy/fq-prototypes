import { useState } from 'react'
import { ActionableBadge, Checkbox, Input, Popover, TagDropdownButton } from '@floqastinc/flow-ui_core'
import SellOutlined from '@floqastinc/flow-ui_icons/material/SellOutlined'

interface TagsMultiSelectFieldProps {
  label: string
  options: { label: string; value: string }[]
  value: string[]
  onChange: (value: string[]) => void
}

// Built on the raw Popover + Checkbox (matching ControlsMultiSelectField)
// instead of FlowUI's native Select, so the bulk "Clear" link renders
// reliably - Select's own built-in clear option is driven by an i18n key
// this prototype doesn't have wired up and would render blank text.
export function TagsMultiSelectField({ label, options, value, onChange }: TagsMultiSelectFieldProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filteredOptions = options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))

  const toggle = (optionValue: string) => {
    onChange(value.includes(optionValue) ? value.filter((v) => v !== optionValue) : [...value, optionValue])
  }

  const removeTag = (tagValue: string) => onChange(value.filter((v) => v !== tagValue))

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
              <SellOutlined className="size-[20px]" />
              Select tags
            </span>
          }
        >
          {value.map((tagValue) => {
            const tag = options.find((o) => o.value === tagValue)
            if (!tag) return null
            return (
              <ActionableBadge key={tag.value} size="small" onClick={() => {}} onPointerDown={() => removeTag(tag.value)}>
                {tag.label}
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
            placeholder="Search tags"
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
            <div key={option.value} className="px-[8px] py-[8px] rounded-[6px] hover:bg-[#f1f3f9]">
              <Checkbox checked={value.includes(option.value)} onCheckedChange={() => toggle(option.value)} label={option.label} />
            </div>
          ))}
        </div>
      </Popover.Content>
    </Popover>
  )
}
