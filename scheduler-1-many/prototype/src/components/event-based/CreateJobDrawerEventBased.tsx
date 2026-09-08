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
import DropdownPanel from '@floqastinc/flow-ui_core/DropdownPanel'
// @ts-ignore
import ButtonGroup from '@floqastinc/flow-ui_core/ButtonGroup'
// @ts-ignore
import Close from '@floqastinc/flow-ui_icons/material/Close'
// @ts-ignore
import DateRange from '@floqastinc/flow-ui_icons/material/DateRange'
// FlowUI Material icons for the trigger-type segmented control. ScheduleIcon is
// the library's "Schedule" clock glyph (external name); EventIcon is "FlashOn".
// @ts-ignore
import ScheduleIcon from '@floqastinc/flow-ui_icons/material/Schedule'
// @ts-ignore
import EventIcon from '@floqastinc/flow-ui_icons/material/FlashOn'
// @ts-ignore
import Add from '@floqastinc/flow-ui_icons/material/Add'
// @ts-ignore
import ChevronRight from '@floqastinc/flow-ui_icons/material/ChevronRight'
// @ts-ignore
import ExpandMore from '@floqastinc/flow-ui_icons/material/ExpandMore'
import {
  computeNextRunDate,
  formatLongDate,
  formatRunTime,
  getAnchorDay,
  shortTimezoneCode,
  type RunBasis,
} from '../../lib/jobDates'

export type { RunBasis }

export type TriggerType = 'schedule' | 'event'

export interface JobConfig {
  name: string
  entities: string[]
  // How the job is triggered. 'schedule' = time-based cadence (the One-to-Many
  // model); 'event' = fired by a registry event. Event Based only.
  triggerType: TriggerType
  // Schedule-mode fields (used when triggerType === 'schedule')
  repeats: string
  runTime: string
  timezone: string
  initialRunDate: string // ISO date 'YYYY-MM-DD'
  runBasis: RunBasis // empty when not applicable (hourly / daily / ad-hoc)
  // Event-mode fields (used when triggerType === 'event')
  triggerEvent: string // selected trigger type, e.g. 'checklist-prepared'
  // Trigger Event criteria — the specific action config (varies by trigger type;
  // for the prototype we model the Checklist task shape).
  eventEntity: string
  eventFolder: string
  eventChecklistItem: string
  eventPeriodStart: string // e.g. '2026-01'
  eventRepeats: string // 'yes' | 'no'
  filterAttribute: string // optional filter attribute, e.g. 'totalAmount'
  filterValue: string // optional filter value for the chosen attribute
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

// Trigger Type options, organized into expandable groups for the DropdownPanel.
// Prototype scope: only the Checklist Event group is populated; the rest are
// placeholders ("Coming soon") until those event domains are built out.
export const TRIGGER_GROUPS: {
  label: string
  value: string
  options: { label: string; value: string }[]
}[] = [
  {
    label: 'Checklist Event',
    value: 'checklist',
    options: [
      { label: 'Checklist Prepared', value: 'checklist-prepared' },
      { label: 'Checklist Reviewed', value: 'checklist-reviewed' },
      { label: 'Checklist Completed', value: 'checklist-completed' },
      { label: 'Folder Complete', value: 'folder-complete' },
      { label: 'Folder Locked', value: 'folder-locked' },
      { label: 'Review Note Rolled Forward', value: 'review-note-rolled-forward' },
    ],
  },
  { label: 'Reconciliation Event', value: 'reconciliation', options: [] },
  { label: 'Journal Entry Management Event', value: 'jem', options: [] },
  { label: 'Transform Event', value: 'transform', options: [] },
  { label: 'AI Variance Event', value: 'ai-variance', options: [] },
]

const ALL_TRIGGER_OPTIONS = TRIGGER_GROUPS.flatMap((g) => g.options)

// Trigger Event criteria options (prototype data for the Checklist task shape).
export const FOLDER_OPTIONS = [
  { label: 'Cash & Bank', value: 'cash-bank' },
  { label: 'Accounts Payable', value: 'ap' },
  { label: 'Accounts Receivable', value: 'ar' },
  { label: 'Fixed Assets', value: 'fixed-assets' },
  { label: 'Payroll', value: 'payroll' },
  { label: 'Revenue', value: 'revenue' },
]

export const CHECKLIST_ITEM_OPTIONS = [
  { label: 'Reconcile bank accounts', value: 'reconcile-bank' },
  { label: 'Review AP aging', value: 'review-ap-aging' },
  { label: 'Post depreciation', value: 'post-depreciation' },
  { label: 'Accrue expenses', value: 'accrue-expenses' },
  { label: 'Review journal entries', value: 'review-jes' },
  { label: 'Tie out subledger', value: 'tie-out-subledger' },
]

// Initial Period Start — "Month YYYY". Static list for the prototype.
export const PERIOD_OPTIONS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
].map((m, i) => ({ label: `${m} 2026`, value: `2026-${String(i + 1).padStart(2, '0')}` }))

export const YES_NO_OPTIONS = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
]

// Which group contains a given option value (used to auto-expand on edit).
const groupValueForOption = (optionValue: string): string | null =>
  TRIGGER_GROUPS.find((g) => g.options.some((o) => o.value === optionValue))?.value ?? null

// Sentinel prefix so a group-header row can be told apart from a real option in onChange.
const GROUP_PREFIX = '__group__:'

// Filter (Attribute/Value) shows at the bottom of the Trigger Event criteria.
const FILTER_ENABLED = true

// Filter attributes available on an event, and the values each can take.
// Value options are keyed by attribute so the Value dropdown is contextual.
export const FILTER_ATTRIBUTE_OPTIONS = [
  { label: 'Total amount', value: 'totalAmount' },
  { label: 'Currency', value: 'currency' },
  { label: 'Region', value: 'region' },
  { label: 'Customer tier', value: 'customerTier' },
  { label: 'Payment method', value: 'paymentMethod' },
]

export const FILTER_VALUE_OPTIONS: Record<string, { label: string; value: string }[]> = {
  totalAmount: [
    { label: 'Over $500', value: 'gt-500' },
    { label: 'Over $1,000', value: 'gt-1000' },
    { label: 'Over $5,000', value: 'gt-5000' },
    { label: 'Over $25,000', value: 'gt-25000' },
  ],
  currency: [
    { label: 'USD', value: 'USD' },
    { label: 'EUR', value: 'EUR' },
    { label: 'GBP', value: 'GBP' },
    { label: 'JPY', value: 'JPY' },
  ],
  region: [
    { label: 'North America', value: 'NA' },
    { label: 'EMEA', value: 'EMEA' },
    { label: 'APAC', value: 'APAC' },
    { label: 'LATAM', value: 'LATAM' },
  ],
  customerTier: [
    { label: 'Enterprise', value: 'enterprise' },
    { label: 'Mid-market', value: 'mid-market' },
    { label: 'SMB', value: 'smb' },
  ],
  paymentMethod: [
    { label: 'Credit card', value: 'credit-card' },
    { label: 'ACH', value: 'ach' },
    { label: 'Wire', value: 'wire' },
    { label: 'PayPal', value: 'paypal' },
  ],
}

const EMPTY_CONFIG: JobConfig = {
  name: '',
  entities: [],
  triggerType: 'schedule',
  repeats: '',
  runTime: '',
  timezone: 'America/New_York',
  initialRunDate: '',
  runBasis: '',
  triggerEvent: '',
  eventEntity: '',
  eventFolder: '',
  eventChecklistItem: '',
  eventPeriodStart: '',
  eventRepeats: '',
  filterAttribute: '',
  filterValue: '',
}

export function CreateJobDrawerEventBased({
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
  const [triggerType, setTriggerType] = useState<TriggerType>(
    initialValues?.triggerType ?? EMPTY_CONFIG.triggerType,
  )
  const [triggerEvent, setTriggerEvent] = useState<string>(
    initialValues?.triggerEvent ?? EMPTY_CONFIG.triggerEvent,
  )
  const [eventEntity, setEventEntity] = useState<string>(
    initialValues?.eventEntity ?? EMPTY_CONFIG.eventEntity,
  )
  const [eventFolder, setEventFolder] = useState<string>(
    initialValues?.eventFolder ?? EMPTY_CONFIG.eventFolder,
  )
  const [eventChecklistItem, setEventChecklistItem] = useState<string>(
    initialValues?.eventChecklistItem ?? EMPTY_CONFIG.eventChecklistItem,
  )
  const [eventPeriodStart, setEventPeriodStart] = useState<string>(
    initialValues?.eventPeriodStart ?? EMPTY_CONFIG.eventPeriodStart,
  )
  const [eventRepeats, setEventRepeats] = useState<string>(
    initialValues?.eventRepeats ?? EMPTY_CONFIG.eventRepeats,
  )
  const [filterAttribute, setFilterAttribute] = useState<string>(
    initialValues?.filterAttribute ?? EMPTY_CONFIG.filterAttribute,
  )
  const [filterValue, setFilterValue] = useState<string>(
    initialValues?.filterValue ?? EMPTY_CONFIG.filterValue,
  )
  // Filter is opt-in: shown once "Add filter" is clicked, or pre-shown when
  // editing a job that already has a filter attribute.
  const [showFilter, setShowFilter] = useState<boolean>(!!initialValues?.filterAttribute)
  const [isTriggerOpen, setIsTriggerOpen] = useState(false)
  // Which trigger-type groups are expanded in the panel. Auto-expand the group
  // holding the current selection (so editing reveals it); collapsed otherwise.
  const [expandedGroups, setExpandedGroups] = useState<string[]>(() => {
    const g = groupValueForOption(initialValues?.triggerEvent ?? '')
    return g ? [g] : []
  })
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
    setTriggerType(seed.triggerType ?? 'schedule')
    setTriggerEvent(seed.triggerEvent ?? '')
    setEventEntity(seed.eventEntity ?? '')
    setEventFolder(seed.eventFolder ?? '')
    setEventChecklistItem(seed.eventChecklistItem ?? '')
    setEventPeriodStart(seed.eventPeriodStart ?? '')
    setEventRepeats(seed.eventRepeats ?? '')
    setFilterAttribute(seed.filterAttribute ?? '')
    setFilterValue(seed.filterValue ?? '')
    setShowFilter(!!seed.filterAttribute)
    setIsTriggerOpen(false)
    const seedGroup = groupValueForOption(seed.triggerEvent ?? '')
    setExpandedGroups(seedGroup ? [seedGroup] : [])
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
  const isEvent = triggerType === 'event'
  const triggerLabel =
    ALL_TRIGGER_OPTIONS.find((o) => o.value === triggerEvent)?.label || 'Select a trigger type'
  // Trigger Event criteria labels
  const eventEntityLabel =
    ENTITY_OPTIONS.find((o) => o.value === eventEntity)?.label || 'Select entity'
  const eventFolderLabel =
    FOLDER_OPTIONS.find((o) => o.value === eventFolder)?.label || 'Select folder'
  const eventChecklistItemLabel =
    CHECKLIST_ITEM_OPTIONS.find((o) => o.value === eventChecklistItem)?.label ||
    'Select checklist item'
  const eventPeriodStartLabel =
    PERIOD_OPTIONS.find((o) => o.value === eventPeriodStart)?.label || 'Select period'
  const eventRepeatsLabel =
    YES_NO_OPTIONS.find((o) => o.value === eventRepeats)?.label || 'Select'
  // Filter: Value options are scoped to the chosen Attribute.
  const filterValueOptions = filterAttribute ? FILTER_VALUE_OPTIONS[filterAttribute] ?? [] : []
  const filterAttributeLabel =
    FILTER_ATTRIBUTE_OPTIONS.find((o) => o.value === filterAttribute)?.label || 'Select attribute'
  const filterValueLabel =
    filterValueOptions.find((o) => o.value === filterValue)?.label || 'Select value'
  // Schedule mode requires a cadence + its fields; Event mode requires a trigger
  // event (filter condition is optional).
  const triggerValid = isEvent ? !!triggerEvent : !!repeats && jobFieldsValid
  const canSave = !!name.trim() && entities.length > 0 && triggerValid
  // The "Next scheduled run" callout only applies to schedule-triggered jobs.
  const showNextRun = !isEvent && canSave && !isAdHoc && !!nextRunDate
  const tzShort = shortTimezoneCode(timezoneLabel)
  const nextRunDisplay =
    showNextRun && nextRunDate
      ? `${formatLongDate(nextRunDate)} at ${formatRunTime(runTime)}${tzShort ? ` ${tzShort}` : ''}`
      : ''

  const handleSave = () => {
    onSave({
      name: name.trim() || 'Untitled Job',
      entities,
      triggerType,
      repeats,
      runTime,
      timezone,
      initialRunDate,
      runBasis,
      triggerEvent,
      eventEntity,
      eventFolder,
      eventChecklistItem,
      eventPeriodStart,
      eventRepeats,
      // Only persist the filter when it's shown and an attribute is chosen.
      filterAttribute: showFilter ? filterAttribute : '',
      filterValue: showFilter ? filterValue : '',
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

          {/* Trigger type — segmented control gating Schedule vs Event config.
              Defaults to Schedule; placed directly above the content it controls,
              per FlowUI Button Group guidance. Event Based only. */}
          <ButtonGroup className="w-full">
            <ButtonGroup.Button
              isActive={!isEvent}
              onClick={() => setTriggerType('schedule')}
              aria-pressed={!isEvent}
              className="flex-1 justify-center gap-2"
            >
              <ScheduleIcon size={18} />
              Schedule
            </ButtonGroup.Button>
            <ButtonGroup.Button
              isActive={isEvent}
              onClick={() => setTriggerType('event')}
              aria-pressed={isEvent}
              className="flex-1 justify-center gap-2"
            >
              <EventIcon size={18} />
              Event
            </ButtonGroup.Button>
          </ButtonGroup>

          {/* ── Schedule trigger: the existing One-to-Many cadence config ── */}
          {!isEvent && (
          <>
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
          </>
          )}

          {/* ── Event trigger: pick a Trigger Type from grouped registry events ── */}
          {isEvent && (
            <>
              <InputWrapper isRequired className="w-full">
                <InputWrapper.Label>Trigger Type</InputWrapper.Label>
                {/* DropdownButton's root wrapper sizes to content; force it full
                    width (and the panel follows via size="trigger-width") so the
                    field mirrors the Repeats Select. Scoped here — baseline
                    date-picker DropdownButton is unaffected. */}
                <div className="w-full [&_[data-flow-name=dropdown-button]]:w-full">
                <DropdownPanel
                  isOpen={isTriggerOpen}
                  onOpenChange={setIsTriggerOpen}
                  selectedValues={triggerEvent}
                  disableFilter
                  onChange={(newValue: string | string[]) => {
                    const v = Array.isArray(newValue) ? newValue[0] ?? '' : newValue ?? ''
                    // Group-header rows toggle expansion in place; they don't select or close.
                    if (v.startsWith(GROUP_PREFIX)) {
                      const g = v.slice(GROUP_PREFIX.length)
                      setExpandedGroups((prev) =>
                        prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g],
                      )
                      return
                    }
                    setTriggerEvent(v)
                    setIsTriggerOpen(false)
                  }}
                >
                  <DropdownPanel.Trigger>
                    <DropdownButton open={isTriggerOpen} className="w-full">
                      {triggerLabel}
                    </DropdownButton>
                  </DropdownPanel.Trigger>
                  <DropdownPanel.Content size="trigger-width">
                    {/* Collapsed by default: only the group headers show. Clicking a
                        header expands it to reveal its second-level options. FlowUI's
                        DropdownPanel has no native collapse, so we drive it with
                        expandedGroups state + header sentinel values. */}
                    {TRIGGER_GROUPS.flatMap((group) => {
                      const expanded = expandedGroups.includes(group.value)
                      const rows = [
                        <DropdownPanel.Option key={`hdr-${group.value}`} value={`${GROUP_PREFIX}${group.value}`}>
                          <span className="flex items-center gap-2 w-full font-semibold text-[#1d2433]">
                            {expanded ? (
                              <ExpandMore size={18} color="var(--flo-sem-color-icon-secondary)" />
                            ) : (
                              <ChevronRight size={18} color="var(--flo-sem-color-icon-secondary)" />
                            )}
                            {group.label}
                          </span>
                        </DropdownPanel.Option>,
                      ]
                      if (expanded) {
                        if (group.options.length > 0) {
                          group.options.forEach((o) =>
                            rows.push(
                              <DropdownPanel.Option key={o.value} value={o.value}>
                                <span className="pl-7">{o.label}</span>
                              </DropdownPanel.Option>,
                            ),
                          )
                        } else {
                          rows.push(
                            <DropdownPanel.Option
                              key={`ph-${group.value}`}
                              value={`__ph-${group.value}`}
                              isDisabled
                            >
                              <span className="pl-7 text-[#9aa0ab]">Coming soon</span>
                            </DropdownPanel.Option>,
                          )
                        }
                      }
                      return rows
                    })}
                  </DropdownPanel.Content>
                </DropdownPanel>
                </div>
              </InputWrapper>

              {/* ── Trigger Event: the specific action config for the selected
                  trigger type. Varies by type; the prototype models the Checklist
                  task shape. Appears only once a Trigger Type is chosen. ── */}
              {triggerEvent && (
                <>
                  <div className="mt-1 pt-4 border-t border-[#e1e6ef] text-[13px] font-semibold text-[#1d2433]">
                    Trigger Event
                  </div>

                  <InputWrapper className="w-full">
                    <InputWrapper.Label>Entity</InputWrapper.Label>
                    <Select
                      className="w-full"
                      selectionMode="single"
                      value={eventEntity}
                      onChange={(newValue: string) => setEventEntity(newValue ?? '')}
                      options={ENTITY_OPTIONS}
                      buttonLabel={eventEntityLabel}
                      filterPlaceholder="Search entities"
                    />
                  </InputWrapper>

                  <InputWrapper className="w-full">
                    <InputWrapper.Label>Folder</InputWrapper.Label>
                    <Select
                      className="w-full"
                      selectionMode="single"
                      value={eventFolder}
                      onChange={(newValue: string) => setEventFolder(newValue ?? '')}
                      options={FOLDER_OPTIONS}
                      buttonLabel={eventFolderLabel}
                      filterPlaceholder="Search folders"
                    />
                  </InputWrapper>

                  <InputWrapper className="w-full">
                    <InputWrapper.Label>Checklist Item</InputWrapper.Label>
                    <Select
                      className="w-full"
                      selectionMode="single"
                      value={eventChecklistItem}
                      onChange={(newValue: string) => setEventChecklistItem(newValue ?? '')}
                      options={CHECKLIST_ITEM_OPTIONS}
                      buttonLabel={eventChecklistItemLabel}
                      filterPlaceholder="Search checklist items"
                    />
                  </InputWrapper>

                  <InputWrapper className="w-full">
                    <InputWrapper.Label>Initial Period Start</InputWrapper.Label>
                    <Select
                      className="w-full"
                      selectionMode="single"
                      value={eventPeriodStart}
                      onChange={(newValue: string) => setEventPeriodStart(newValue ?? '')}
                      options={PERIOD_OPTIONS}
                      buttonLabel={eventPeriodStartLabel}
                      filterPlaceholder="Search periods"
                    />
                  </InputWrapper>

                  <InputWrapper className="w-full">
                    <InputWrapper.Label>Repeats</InputWrapper.Label>
                    <Select
                      className="w-full"
                      selectionMode="single"
                      value={eventRepeats}
                      onChange={(newValue: string) => setEventRepeats(newValue ?? '')}
                      options={YES_NO_OPTIONS}
                      buttonLabel={eventRepeatsLabel}
                      disableFilter
                    />
                  </InputWrapper>

                  {/* Optional filter — at the bottom of the selection criteria */}
                  {FILTER_ENABLED &&
                    (!showFilter ? (
                      <div>
                        <Button
                          color="primary"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowFilter(true)}
                        >
                          <Add size={18} /> Add filter
                        </Button>
                      </div>
                    ) : (
                      <>
                        <InputWrapper className="w-full">
                          <InputWrapper.Label>Attribute</InputWrapper.Label>
                          <Select
                            className="w-full"
                            selectionMode="single"
                            value={filterAttribute}
                            onChange={(newValue: string) => {
                              setFilterAttribute(newValue ?? '')
                              setFilterValue('') // reset value when attribute changes
                            }}
                            options={FILTER_ATTRIBUTE_OPTIONS}
                            buttonLabel={filterAttributeLabel}
                            disableFilter
                          />
                        </InputWrapper>

                        <InputWrapper className="w-full">
                          <InputWrapper.Label>Value</InputWrapper.Label>
                          <Select
                            className="w-full"
                            selectionMode="single"
                            value={filterValue}
                            onChange={(newValue: string) => setFilterValue(newValue ?? '')}
                            options={filterValueOptions}
                            buttonLabel={filterValueLabel}
                            disableFilter
                          />
                        </InputWrapper>

                        <button
                          type="button"
                          onClick={() => {
                            setShowFilter(false)
                            setFilterAttribute('')
                            setFilterValue('')
                          }}
                          className="self-start text-[12px] text-[#6b7280] hover:text-[#1d2433] hover:underline"
                        >
                          Remove filter
                        </button>
                      </>
                    ))}
                </>
              )}
            </>
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
