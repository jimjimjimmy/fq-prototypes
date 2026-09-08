import { useState, useMemo, useCallback } from 'react'
import { Heading, PeriodRangeCalendar, Radio, RadioGroup } from '@floqastinc/flow-ui_core'

// Step 2 — Date Range. Quick preset radios (7/30/90 Days) for the most-used
// cases + a "Custom date range" option that reveals a FlowUI
// PeriodRangeCalendar trigger.
//
// firstActivePeriod is REQUIRED on PeriodRangeCalendar — sets which month
// appears in the left panel when the picker opens.
//
// Step is disabled until at least one event type is selected in Step 1.

type Preset = '7' | '30' | '90' | 'custom'

interface DateRangeStepProps {
  disabled?: boolean
}

export function DateRangeStep({ disabled }: DateRangeStepProps) {
  const [preset, setPreset] = useState<Preset>('7')
  const [range, setRange] = useState<unknown>()

  // PeriodRangeCalendar's firstActivePeriod is a CONTROLLED prop — the
  // component fires onMonthChange when the chevrons are clicked, and expects
  // the parent to feed the new value back. We hold it in state and update via
  // the callback so the chevrons actually navigate.
  //
  // Initial value: last month, so the two-panel view opens to last month +
  // this month (both selectable). Anchoring on this month would make the
  // right panel show next month — entirely future + disabled by maximumDate.
  const [firstActivePeriod, setFirstActivePeriod] = useState(() => {
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    return { month: lastMonth.getMonth() + 1, year: lastMonth.getFullYear() }
  })

  const handleMonthChange = useCallback(
    (newPeriod: { month: number; year: number }) => {
      setFirstActivePeriod(newPeriod)
    },
    [],
  )

  // Audit reports look backward only — disable any future dates in the
  // calendar so users can't pick a range that hasn't happened yet.
  const todayIso = useMemo(() => {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }, [])

  return (
    <section
      className={`rb-step${disabled ? ' rb-step-disabled' : ''}`}
      id="step-2"
      aria-disabled={disabled || undefined}
    >
      <header className="rb-step-header">
        <Heading variant="body-base">Select Date Range</Heading>
      </header>

      {disabled && (
        <div className="rb-step-disabled-banner">
          Select an event type first.
        </div>
      )}

      <div className="rb-step-body" aria-hidden={disabled || undefined}>
        <RadioGroup value={preset} onValueChange={(v) => setPreset(v as Preset)} name="audit-date">
          <Radio value="7">Past 7 Days</Radio>
          <Radio value="30">Past 30 Days</Radio>
          <Radio value="90">Past 90 Days</Radio>
          <Radio value="custom">Custom Date Range</Radio>
        </RadioGroup>

        {preset === 'custom' && (
          <div className="rb-custom-range">
            <PeriodRangeCalendar
              value={range}
              onChange={setRange}
              firstActivePeriod={firstActivePeriod}
              onMonthChange={handleMonthChange}
              placeholder="Select date range"
              // Hide the built-in preset side panel (Last 12 months, Today,
              // Yesterday, Next 7/14/30 Days) — the radio group above already
              // provides preset options. hideShortcutButtons collapses the
              // whitespace reserved for the panel too (unlike shortcutButtons=[]).
              hideShortcutButtons={true}
              // Audit reports look backward — disable future date selection.
              maximumDate={todayIso}
            />
          </div>
        )}
      </div>
    </section>
  )
}
