import { useState } from 'react'
import { DropdownButton, Select } from '@floqastinc/flow-ui_core'
import DateRange from '@floqastinc/flow-ui_icons/material/DateRange'

export function Toolbar() {
  const [entity, setEntity] = useState<string | null>('all')
  const [period, setPeriod] = useState<string | null>('by-period')
  const [month, setMonth] = useState<string | null>('march-2025')
  const [entityOpen, setEntityOpen] = useState(false)
  const [periodOpen, setPeriodOpen] = useState(false)
  const [monthOpen, setMonthOpen] = useState(false)

  return (
    <div className="bg-white border-b border-solid border-[#e1e6ef] flex items-center gap-[12px] h-[72px] px-[24px] shrink-0">
      <Select
        options={[{ label: 'All Entities', value: 'all' }]}
        value={entity}
        disableClear
        contentWidth="var(--trigger-width)"
        isOpen={entityOpen}
        onOpenChange={setEntityOpen}
        onChange={(v) => {
          setEntity(v as string)
          setEntityOpen(false)
        }}
      />
      <Select
        options={[{ label: 'By Period', value: 'by-period' }]}
        value={period}
        disableClear
        contentWidth="var(--trigger-width)"
        isOpen={periodOpen}
        onOpenChange={setPeriodOpen}
        onChange={(v) => {
          setPeriod(v as string)
          setPeriodOpen(false)
        }}
        trigger={
          // DropdownButton's own `icon` prop replaces its default trailing
          // chevron entirely (single icon slot) - leading icon goes in
          // children instead, leaving the default chevron in place.
          <DropdownButton className="hover:!border-[#6b7280]">
            <span className="flex items-center gap-[8px]">
              <DateRange className="size-[16px]" />
              By Period
            </span>
          </DropdownButton>
        }
      />
      <Select
        options={[{ label: 'March 2025', value: 'march-2025' }]}
        value={month}
        disableClear
        contentWidth="var(--trigger-width)"
        isOpen={monthOpen}
        onOpenChange={setMonthOpen}
        onChange={(v) => {
          setMonth(v as string)
          setMonthOpen(false)
        }}
        trigger={
          <DropdownButton className="hover:!border-[#6b7280]">
            <span className="flex items-center gap-[8px]">
              <DateRange className="size-[16px]" />
              March 2025
            </span>
          </DropdownButton>
        }
      />
    </div>
  )
}
