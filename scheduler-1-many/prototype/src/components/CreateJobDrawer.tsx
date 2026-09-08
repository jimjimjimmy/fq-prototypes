import { useEffect, useState } from 'react'
// @ts-ignore — FlowUI core is JS; skipLibCheck covers node_modules
import SideDrawer from '@floqastinc/flow-ui_core/SideDrawer'
// @ts-ignore
import Button from '@floqastinc/flow-ui_core/Button'
// @ts-ignore
import Input from '@floqastinc/flow-ui_core/Input'
// @ts-ignore
import InputWrapper from '@floqastinc/flow-ui_core/InputWrapper'
// @ts-ignore
import Select from '@floqastinc/flow-ui_core/Select'
// @ts-ignore
import CalendarSelectBox from '@floqastinc/flow-ui_core/CalendarSelectBox'
// @ts-ignore
import DropdownButton from '@floqastinc/flow-ui_core/DropdownButton'
// @ts-ignore
import Close from '@floqastinc/flow-ui_icons/material/Close'
// @ts-ignore
import DateRange from '@floqastinc/flow-ui_icons/material/DateRange'
import {
  computeNextRunDate,
  formatLongDate,
  formatRunTime,
  getAnchorDay,
  shortTimezoneCode,
  type RunBasis,
} from '../lib/jobDates'

export type { RunBasis }

export interface JobConfig {
  name: string
  entities: string[]
  repeats: string
  runTime: string
  timezone: string
  initialRunDate: string // ISO date 'YYYY-MM-DD'
  runBasis: RunBasis // empty when not applicable (hourly / daily / ad-hoc)
}

interface CreateJobDrawerProps {
  open: boolean
  onClose: () => void
  onSave: (config: JobConfig) => void
  initialValues?: JobConfig
}

export const ENTITY_OPTIONS = [
  { label: 'ACME Corporation', value: 'acme' },
  { label: 'Ghostbusters Inc.', value: 'ghostbusters' },
  { label: 'Pizza Planet', value: 'pizza-planet' },
  { label: 'Stark Industries', value: 'stark' },
  { label: 'Wonka Chocolates', value: 'wonka' },
]

export const REPEAT_OPTIONS = [
  { label: 'Hourly', value: 'hourly' },
  { label: 'Daily', value: 'daily' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Ad Hoc', value: 'ad-hoc' },
]

export const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour24 = Math.floor(i / 2)
  const minute = i % 2 === 0 ? '00' : '30'
  const period = hour24 < 12 ? 'AM' : 'PM'
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24
  const label = `${hour12}:${minute} ${period}`
  const value = `${String(hour24).padStart(2, '0')}:${minute}`
  return { label, value }
})

export const TIMEZONE_OPTIONS = [
  { label: 'Pacific Time (PT)', value: 'America/Los_Angeles' },
  { label: 'Mountain Time (MT)', value: 'America/Denver' },
  { label: 'Central Time (CT)', value: 'America/Chicago' },
  { label: 'Eastern Time (ET)', value: 'America/New_York' },
  { label: 'UTC', value: 'UTC' },
  { label: 'London (GMT/BST)', value: 'Europe/London' },
  { label: 'Paris (CET/CEST)', value: 'Europe/Paris' },
  { label: 'Tokyo (JST)', value: 'Asia/Tokyo' },
  { label: 'Sydney (AEST/AEDT)', value: 'Australia/Sydney' },
]

const EMPTY_CONFIG: JobConfig = {
  name: '',
  entities: [],
  repeats: '',
  runTime: '',
  timezone: 'America/New_York',
  initialRunDate: '',
  runBasis: '',
}

export function CreateJobDrawer({
  open,
  onClose,
  onSave,
  initialValues,
}: CreateJobDrawerProps) {
  const isEdit = !!initialValues
  const today = new Date()
  const [name, setName] = useState(initialValues?.name ?? EMPTY_CONFIG.name)
  const [entities, setEntities] = useState<string[]>(
    initialValues?.entities ?? EMPTY_CONFIG.entities,
  )
  const [repeats, setRepeats] = useState<string>(initialValues?.repeats ?? EMPTY_CONFIG.repeats)
  const [runTime, setRunTime] = useState<string>(initialValues?.runTime ?? EMPTY_CONFIG.runTime)
  const [timezone, setTimezone] = useState<string>(
    initialValues?.timezone ?? EMPTY_CONFIG.timezone,
  )
  const [initialRunDate, setInitialRunDate] = useState<string>(
    initialValues?.initialRunDate ?? EMPTY_CONFIG.initialRunDate,
  )
  const [runBasis, setRunBasis] = useState<RunBasis>(
    initialValues?.runBasis ?? EMPTY_CONFIG.runBasis,
  )
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [activePeriod, setActivePeriod] = useState<{ month: number; year: number }>({
    month: today.getMonth() + 1,
    year: today.getFullYear(),
  })

  // Re-seed state when the drawer opens (handles edit↔create transitions and reopens)
  useEffect(() => {
    if (!open) return
    const seed = initialValues ?? EMPTY_CONFIG
    setName(seed.name)
    setEntities(seed.entities)
    setRepeats(seed.repeats)
    setRunTime(seed.runTime)
    setTimezone(seed.timezone)
    setInitialRunDate(seed.initialRunDate)
    setRunBasis(seed.runBasis)
    setIsCalendarOpen(false)
  }, [open, initialValues])

  const isMonthly = repeats === 'monthly'
  const isQuarterly = repeats === 'quarterly'
  const isAdHoc = repeats === 'ad-hoc'
  const showBasis = isMonthly || isQuarterly
  const showJobFields = !!repeats && !isAdHoc
  const periodWord = isQuarterly ? 'quarter' : 'month'

  // Keep runBasis consistent with repeats. Default to 'calendar-date' when
  // monthly/quarterly is selected; clear when switching to other cadences.
  useEffect(() => {
    if (showBasis && !runBasis) {
      setRunBasis('calendar-date')
    } else if (!showBasis && runBasis) {
      setRunBasis('')
    }
  }, [showBasis, runBasis])

  const BASIS_OPTIONS = [
    { label: 'Calendar date', value: 'calendar-date' },
    { label: 'Business day', value: 'business-day' },
    { label: `Last day of ${periodWord}`, value: 'last-day' },
  ]
  const basisLabel =
    BASIS_OPTIONS.find((o) => o.value === runBasis)?.label || 'Select basis'

  const initialDateObj = initialRunDate ? new Date(`${initialRunDate}T00:00:00`) : null
  const anchorDay = getAnchorDay(initialDateObj, runBasis)
  const nextRunDate = computeNextRunDate(initialRunDate, repeats as never, runBasis)

  const entitiesLabel =
    entities.length === 0
      ? 'Select Entities'
      : entities.length === 1
        ? ENTITY_OPTIONS.find((o) => o.value === entities[0])?.label || '1 selected'
        : `${entities.length} selected`

  const repeatsLabel = REPEAT_OPTIONS.find((o) => o.value === repeats)?.label || 'Select Frequency'
  const runTimeLabel = TIME_OPTIONS.find((o) => o.value === runTime)?.label || 'Select Run Time'
  const timezoneLabel = TIMEZONE_OPTIONS.find((o) => o.value === timezone)?.label || 'Select Timezone'

  // Form-wide validation: every required field must be filled before save.
  // Ad Hoc skips job-specific fields (initial date, run time, timezone).
  const jobFieldsValid = isAdHoc
    ? true
    : !!initialRunDate &&
      !!runTime &&
      !!timezone &&
      (showBasis ? !!runBasis : true)
  const canSave =
    !!name.trim() && entities.length > 0 && !!repeats && jobFieldsValid
  // The "Next scheduled run" callout uses the same gate plus a valid computed date.
  const showNextRun = canSave && !isAdHoc && !!nextRunDate
  const tzShort = shortTimezoneCode(timezoneLabel)
  const nextRunDisplay =
    showNextRun && nextRunDate
      ? `${formatLongDate(nextRunDate)} at ${formatRunTime(runTime)}${tzShort ? ` ${tzShort}` : ''}`
      : ''

  const handleSave = () => {
    onSave({
      name: name.trim() || 'Untitled Job',
      entities,
      repeats,
      runTime,
      timezone,
      initialRunDate,
      runBasis,
    })
  }

  return (
    <SideDrawer show={open} onCancel={onClose} width="md">
      <SideDrawer.Header>
        <SideDrawer.Title>{isEdit ? 'Edit Job' : 'Create Job'}</SideDrawer.Title>
        <SideDrawer.Subtitle>
          Configure the job details and run settings.
        </SideDrawer.Subtitle>
        <SideDrawer.TopRight>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex items-center justify-center w-6 h-6 text-[#424867] hover:text-[#1d2433]"
          >
            <Close size={20} />
          </button>
        </SideDrawer.TopRight>
      </SideDrawer.Header>

      <SideDrawer.Body>
        <div className="flex flex-col gap-5 w-full">
          <InputWrapper isRequired className="w-full">
            <InputWrapper.Label>Job Name</InputWrapper.Label>
            <Input
              value={name}
              onChange={setName}
              placeholder="e.g. Cash Accounts Daily Matching"
            />
          </InputWrapper>

          {/* TODO: scope-tree-picker — replace flat multi-select with hierarchical
              Entity → Account checkbox tree per Figma node 206:67798. Tracked in deviations.md. */}
          <InputWrapper isRequired className="w-full">
            <InputWrapper.Label>Entities</InputWrapper.Label>
            <Select
              className="w-full"
              selectionMode="multiple"
              value={entities}
              onChange={(newValue: string[]) => setEntities(newValue ?? [])}
              options={ENTITY_OPTIONS}
              buttonLabel={entitiesLabel}
              filterPlaceholder="Search entities and accounts"
            />
          </InputWrapper>

          <InputWrapper isRequired className="w-full">
            <InputWrapper.Label>Repeats</InputWrapper.Label>
            <Select
              className="w-full"
              selectionMode="single"
              value={repeats}
              onChange={(newValue: string) => setRepeats(newValue ?? '')}
              options={REPEAT_OPTIONS}
              buttonLabel={repeatsLabel}
              disableFilter
            />
          </InputWrapper>

          {showBasis && (
            <InputWrapper isRequired className="w-full">
              <InputWrapper.Label>On</InputWrapper.Label>
              <div className="flex items-center gap-2 w-full">
                <div className="flex-1 min-w-0">
                  <Select
                    className="w-full"
                    selectionMode="single"
                    value={runBasis}
                    onChange={(newValue: string) =>
                      setRunBasis((newValue as RunBasis) ?? '')
                    }
                    options={BASIS_OPTIONS}
                    buttonLabel={basisLabel}
                    disableFilter
                  />
                </div>
                {anchorDay !== null && runBasis !== 'last-day' && (
                  <div
                    aria-label="Day"
                    className="shrink-0 h-10 min-w-[44px] px-3 flex items-center justify-center border border-[#e1e6ef] bg-[#f8fafc] rounded-sm text-[14px] text-[#1d2433]"
                  >
                    {anchorDay}
                  </div>
                )}
              </div>
            </InputWrapper>
          )}

          {showJobFields && (
            <>
              <InputWrapper isRequired className="w-full">
                <InputWrapper.Label>Initial Date</InputWrapper.Label>
                <CalendarSelectBox
                  open={isCalendarOpen}
                  onOpenChange={setIsCalendarOpen}
                  value={initialRunDate || undefined}
                  activePeriod={activePeriod}
                  onChange={(val: string) => {
                    setInitialRunDate(val)
                    setIsCalendarOpen(false)
                  }}
                  onMonthChange={(period: { month: number; year: number }) =>
                    setActivePeriod(period)
                  }
                  trigger={
                    <DropdownButton open={isCalendarOpen}>
                      <DateRange size={20} color="var(--flo-sem-color-icon-secondary)" />
                      {initialDateObj ? formatLongDate(initialDateObj) : 'Select date'}
                    </DropdownButton>
                  }
                />
              </InputWrapper>

              <InputWrapper isRequired className="w-full">
                <InputWrapper.Label>Run Time</InputWrapper.Label>
                <Select
                  className="w-full"
                  selectionMode="single"
                  value={runTime}
                  onChange={(newValue: string) => setRunTime(newValue ?? '')}
                  options={TIME_OPTIONS}
                  buttonLabel={runTimeLabel}
                  filterPlaceholder="Search times"
                />
              </InputWrapper>

              <InputWrapper isRequired className="w-full">
                <InputWrapper.Label>Timezone</InputWrapper.Label>
                <Select
                  className="w-full"
                  selectionMode="single"
                  value={timezone}
                  onChange={(newValue: string) => setTimezone(newValue ?? '')}
                  options={TIMEZONE_OPTIONS}
                  buttonLabel={timezoneLabel}
                  filterPlaceholder="Search timezones"
                />
              </InputWrapper>
            </>
          )}

          {showNextRun && (
            <div className="mt-2 border border-[#e1e6ef] bg-[#f8fafc] rounded-sm p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-[#6b7280] mb-1">
                Next scheduled run
              </div>
              <div className="text-[14px] text-[#1d2433]">{nextRunDisplay}</div>
            </div>
          )}
        </div>
      </SideDrawer.Body>

      <SideDrawer.Footer>
        <div className="flex justify-end items-center gap-4 w-full">
          <Button color="secondary" variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            color="primary"
            variant="filled"
            size="md"
            onClick={handleSave}
            disabled={!canSave}
          >
            {isEdit ? 'Save Changes' : 'Save'}
          </Button>
        </div>
      </SideDrawer.Footer>
    </SideDrawer>
  )
}
