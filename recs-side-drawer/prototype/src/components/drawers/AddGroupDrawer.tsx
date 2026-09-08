import { useRef, useState } from 'react'
import { Button, Checkbox, CloseButton, Input, SideDrawer } from '@floqastinc/flow-ui_core'
import DomainOutlined from '@floqastinc/flow-ui_icons/material/DomainOutlined'
import FolderOutlined from '@floqastinc/flow-ui_icons/material/FolderOutlined'
import DateRange from '@floqastinc/flow-ui_icons/material/DateRange'
import { FormDropdownField } from '../FormDropdownField'
import { AccountsMultiSelectField } from '../AccountsMultiSelectField'
import { TagsMultiSelectField } from '../TagsMultiSelectField'
import { ControlsMultiSelectField } from '../ControlsMultiSelectField'
import { AccountBalanceFiltersSection } from './sections/AccountBalanceFiltersSection'
import { AccountBalanceFiltersInline } from './sections/AccountBalanceFiltersInline'
import { AccountFiltersDrillIn } from './sections/AccountFiltersDrillIn'
import { AssigneesSection } from './sections/AssigneesSection'
import { AssigneesDrillIn } from './sections/AssigneesDrillIn'
import { DependencySection } from './sections/DependencySection'
import { DependencyDrillIn } from './sections/DependencyDrillIn'
import { GeneralSettingsSection } from './sections/GeneralSettingsSection'
import { DiscardConfirmDialog } from './DiscardConfirmDialog'
import { SlideScreen, SLIDE_MS } from './SlideScreen'
import { RevealTransition } from './RevealTransition'
import {
  ALL_ACCOUNTS,
  ENTITY_OPTIONS,
  FOLDER_OPTIONS,
  TARGET_CURRENCY_OPTIONS,
  FREQUENCY_OPTIONS,
  CONTROL_OPTIONS,
  INITIAL_TAG_OPTIONS,
  type AccountFilterState,
  type AssigneeState,
  type DependencyRow,
  type ExistingGroupSettings,
  type GeneralSettingsState,
} from './addGroupTypes'

type DrawerView = 'main' | 'account-filters' | 'assignees' | 'dependency'

const DEFAULT_GENERAL_SETTINGS: GeneralSettingsState = {
  currency: 'usd',
  threshold: '100.00',
  fixedBalance: '',
}

const MIN_ACCOUNTS_FOR_GROUP = 2

interface AddGroupDrawerProps {
  show: boolean
  onCancel: () => void
  // When provided, the drawer opens pre-populated with these values instead
  // of an empty form - used for "view existing settings" from a Reconciliations
  // table row's gear icon, as opposed to the "Add Group" empty-state flow.
  initialData?: ExistingGroupSettings
  // Fired on a successful save of a genuinely NEW group (never in
  // view/edit-existing mode - see `isViewingExisting` below). Lets the
  // Reconciliations page scroll to and highlight the new row.
  onCreated?: (label: string) => void
}

function deriveAccounts(ids: string[]): AccountFilterState[] {
  return ids.map((id) => ({ id, name: ALL_ACCOUNTS.find((a) => a.id === id)?.name ?? id, rows: [] }))
}

export function AddGroupDrawer({ show, onCancel, initialData, onCreated }: AddGroupDrawerProps) {
  const isViewingExisting = Boolean(initialData)
  const [view, setView] = useState<DrawerView>('main')
  const [isClosingDrillIn, setIsClosingDrillIn] = useState(false)
  // Once true, stays true - it only needs to distinguish the very first mount
  // of `main` (drawer just opened, nothing to return from - no entrance
  // animation) from every mount after that (main remounts fresh each time a
  // drill-in closes, and should always slide + fade in from the left).
  const [hasReturnedFromDrillIn, setHasReturnedFromDrillIn] = useState(false)
  // The drill-in view `main` is currently exiting toward, while its own
  // slide-out-to-the-left plays. Non-null makes `main`'s SlideScreen play its
  // exit; the actual `view` switch (mounting the drill-in) is delayed until
  // that exit finishes, so opening takes the same two-step, same-duration
  // motion as closing (outgoing screen slides out, then incoming slides in)
  // instead of the new screen just popping in over a vanished `main`.
  const [openingDrillIn, setOpeningDrillIn] = useState<Exclude<DrawerView, 'main'> | null>(null)

  const openDrillIn = (target: Exclude<DrawerView, 'main'>) => {
    setOpeningDrillIn(target)
    window.setTimeout(() => {
      setView(target)
      setOpeningDrillIn(null)
    }, SLIDE_MS)
  }

  // Plays the drill-in's exit (slide + fade to the right) before actually
  // swapping back to `main` - without this delay the screen would just
  // vanish instantly since `view` change unmounts it right away.
  const closeDrillIn = (after: () => void) => {
    setIsClosingDrillIn(true)
    window.setTimeout(() => {
      after()
      setIsClosingDrillIn(false)
      setHasReturnedFromDrillIn(true)
    }, SLIDE_MS)
  }
  const [entity, setEntity] = useState<string | null>(initialData?.entity ?? null)
  const [folder, setFolder] = useState<string | null>(initialData?.folder ?? null)
  const [groupName, setGroupName] = useState(initialData?.groupName ?? '')
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>(initialData?.selectedAccountIds ?? [])
  const [accounts, setAccounts] = useState<AccountFilterState[]>(() => deriveAccounts(initialData?.selectedAccountIds ?? []))

  // Folder is scoped to the chosen entity - switching entities invalidates
  // whatever folder was picked, matching the live app's cascading-select behavior.
  const updateEntity = (v: string | null) => {
    setEntity(v)
    setFolder(null)
  }

  const entityLabel = ENTITY_OPTIONS.find((o) => o.value === entity)?.label

  const groupNameHasSpecialChars = /[^a-zA-Z0-9 ]/.test(groupName)
  const groupNameTooLong = groupName.length > 42
  const groupNameTooShort = groupName.trim().length > 0 && groupName.trim().length < 3
  const groupNameValid =
    groupName.trim().length > 0 && !groupNameTooShort && !groupNameTooLong && !groupNameHasSpecialChars
  // Only the rules we actually enforce - "must be unique" is shown as
  // static guidance before typing but never checked, so it can't be a cause.
  const groupNameErrors = [
    groupNameTooShort && 'Min 3 characters',
    groupNameHasSpecialChars && 'No special characters',
    groupNameTooLong && 'Max 42 characters',
  ].filter(Boolean) as string[]

  // Keep `accounts` (the per-account filter-row state used by Account
  // Balance Filters) in sync with the Accounts multi-select: newly checked
  // accounts get an empty filter-row list, unchecked ones drop out, and
  // still-checked ones keep whatever rows they already had.
  const updateSelectedAccounts = (ids: string[]) => {
    setSelectedAccountIds(ids)
    setAccounts((prev) =>
      ids.map((id) => prev.find((a) => a.id === id) ?? {
        id,
        name: ALL_ACCOUNTS.find((a) => a.id === id)?.name ?? id,
        rows: [],
      }),
    )
  }

  const [targetCurrency, setTargetCurrency] = useState<string | null>(initialData?.targetCurrency ?? 'none')
  const [frequency, setFrequency] = useState<string | null>(initialData?.frequency ?? null)
  const [assignees, setAssignees] = useState<AssigneeState[]>(initialData?.assignees ?? [])
  const [controls, setControls] = useState<string[]>(initialData?.controls ?? [])
  const [tagOptions] = useState(INITIAL_TAG_OPTIONS)
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialData?.selectedTagIds ?? [])
  const [dependencies, setDependencies] = useState<DependencyRow[]>([])
  const [generalSettings, setGeneralSettings] = useState<GeneralSettingsState>(DEFAULT_GENERAL_SETTINGS)
  const [createAnother, setCreateAnother] = useState(false)
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false)

  // Matches Figma's "2.0 Required Filled" state: the rest of the form only
  // reveals once Entity, Folder, Group Name, and Accounts are all set.
  const isExpanded = Boolean(entity) && Boolean(folder) && groupName.trim().length > 0 && selectedAccountIds.length > 0

  // Snapshot of what the form looked like on open, captured once - comparing
  // current values against this (rather than just checking "is this field
  // non-empty") is what lets "Group Settings" tell an actual edit apart from
  // fields that were simply pre-filled from `initialData`. For the "Add
  // Group" empty-state flow this snapshot is all nulls/empties anyway, so the
  // comparison collapses back to the old non-empty check.
  const initialSnapshot = useRef({
    entity: initialData?.entity ?? null,
    folder: initialData?.folder ?? null,
    groupName: initialData?.groupName ?? '',
    selectedAccountIds: initialData?.selectedAccountIds ?? [],
    accounts: deriveAccounts(initialData?.selectedAccountIds ?? []),
    targetCurrency: initialData?.targetCurrency ?? 'none',
    frequency: initialData?.frequency ?? null,
    controls: initialData?.controls ?? [],
    selectedTagIds: initialData?.selectedTagIds ?? [],
    assignees: initialData?.assignees ?? [],
    generalSettings: DEFAULT_GENERAL_SETTINGS,
  }).current

  const hasUnsavedChanges =
    entity !== initialSnapshot.entity ||
    folder !== initialSnapshot.folder ||
    groupName !== initialSnapshot.groupName ||
    JSON.stringify(selectedAccountIds) !== JSON.stringify(initialSnapshot.selectedAccountIds) ||
    JSON.stringify(accounts) !== JSON.stringify(initialSnapshot.accounts) ||
    targetCurrency !== initialSnapshot.targetCurrency ||
    frequency !== initialSnapshot.frequency ||
    JSON.stringify(controls) !== JSON.stringify(initialSnapshot.controls) ||
    JSON.stringify(selectedTagIds) !== JSON.stringify(initialSnapshot.selectedTagIds) ||
    JSON.stringify(assignees) !== JSON.stringify(initialSnapshot.assignees) ||
    JSON.stringify(generalSettings) !== JSON.stringify(initialSnapshot.generalSettings) ||
    dependencies.length > 0

  // A "Group" fundamentally requires 2+ accounts - one account wouldn't need
  // grouping. Also requires a real edit - for "Group Settings" every required
  // field already starts valid (pre-filled from initialData), so without the
  // hasUnsavedChanges check Save would be enabled the instant the drawer
  // opens, before anything was actually changed. This is a no-op for the
  // empty "Add Group" flow: filling in a required field already changes it
  // away from the initial null/empty snapshot, so hasUnsavedChanges is true
  // by the time the other conditions are anyway.
  const canSave =
    Boolean(entity) &&
    Boolean(folder) &&
    groupNameValid &&
    selectedAccountIds.length >= MIN_ACCOUNTS_FOR_GROUP &&
    Boolean(frequency) &&
    hasUnsavedChanges

  const resetForm = () => {
    setEntity(null)
    setFolder(null)
    setGroupName('')
    setSelectedAccountIds([])
    setAccounts([])
    setTargetCurrency('none')
    setFrequency(null)
    setAssignees([])
    setControls([])
    setSelectedTagIds([])
    setDependencies([])
    setGeneralSettings(DEFAULT_GENERAL_SETTINGS)
  }

  const handleCancelRequest = () => {
    if (hasUnsavedChanges) {
      setShowDiscardConfirm(true)
    } else {
      onCancel()
    }
  }

  const handleSave = () => {
    if (!isViewingExisting) {
      onCreated?.(`${entityLabel ? `${entityLabel} - ` : ''}${groupName}`)
    }
    if (createAnother) {
      resetForm()
    } else {
      onCancel()
    }
  }

  if (view === 'account-filters') {
    return (
      <SideDrawer show={show} onCancel={handleCancelRequest}>
        <SlideScreen key="account-filters" exiting={isClosingDrillIn}>
          <AccountFiltersDrillIn
            accounts={accounts}
            onCancel={() => closeDrillIn(() => setView('main'))}
            onDone={(updated) =>
              closeDrillIn(() => {
                setAccounts(updated)
                setView('main')
              })
            }
            onCloseAll={handleCancelRequest}
          />
        </SlideScreen>
        <DiscardConfirmDialog open={showDiscardConfirm} onOpenChange={setShowDiscardConfirm} onDiscard={onCancel} />
      </SideDrawer>
    )
  }

  if (view === 'assignees') {
    return (
      <SideDrawer show={show} onCancel={handleCancelRequest}>
        <SlideScreen key="assignees" exiting={isClosingDrillIn}>
          <AssigneesDrillIn
            assignees={assignees}
            onCancel={() => closeDrillIn(() => setView('main'))}
            onDone={(updated) =>
              closeDrillIn(() => {
                setAssignees(updated)
                setView('main')
              })
            }
            onCloseAll={handleCancelRequest}
          />
        </SlideScreen>
        <DiscardConfirmDialog open={showDiscardConfirm} onOpenChange={setShowDiscardConfirm} onDiscard={onCancel} />
      </SideDrawer>
    )
  }

  if (view === 'dependency') {
    return (
      <SideDrawer show={show} onCancel={handleCancelRequest}>
        <SlideScreen key="dependency" exiting={isClosingDrillIn}>
          <DependencyDrillIn
            dependencies={dependencies}
            onCancel={() => closeDrillIn(() => setView('main'))}
            onDone={(updated) =>
              closeDrillIn(() => {
                setDependencies(updated)
                setView('main')
              })
            }
            onCloseAll={handleCancelRequest}
          />
        </SlideScreen>
        <DiscardConfirmDialog open={showDiscardConfirm} onOpenChange={setShowDiscardConfirm} onDiscard={onCancel} />
      </SideDrawer>
    )
  }

  return (
    <SideDrawer show={show} onCancel={handleCancelRequest}>
      <SlideScreen key="main" exiting={openingDrillIn !== null} from="left" animateEnter={hasReturnedFromDrillIn}>
      <SideDrawer.Header>
        <SideDrawer.Title>
          {isViewingExisting ? `${entityLabel ? `${entityLabel} ` : ''}Group Settings` : 'Add Group'}
        </SideDrawer.Title>
        <SideDrawer.TopRight>
          <CloseButton onClick={handleCancelRequest} color="dark" size="md" />
        </SideDrawer.TopRight>
      </SideDrawer.Header>
      <SideDrawer.Body>
        <div className="flex flex-col gap-[24px]">
          <FormDropdownField
            label="Entity"
            placeholder="Select entity"
            icon={<DomainOutlined className="size-[20px]" />}
            isRequired
            options={ENTITY_OPTIONS}
            value={entity}
            onChange={updateEntity}
          />
          <FormDropdownField
            label="Folder"
            placeholder="Select a Folder"
            icon={<FolderOutlined className="size-[20px]" />}
            isRequired
            disabled={!entity}
            disabledTooltip="Please select an Entity first"
            options={FOLDER_OPTIONS}
            value={folder}
            onChange={setFolder}
          />
          <div className="flex flex-col gap-[4px] w-full">
            <Input
              label="Group Name"
              placeholder="Group Name"
              isRequired
              value={groupName}
              onChange={setGroupName}
              isInvalid={!isViewingExisting && groupName.length > 0 ? !groupNameValid : undefined}
            />
            {!isViewingExisting && (
              groupName.length === 0 ? (
                <ul className="list-disc text-[#6b7280] text-[11px] leading-[16px] pl-[16.5px]">
                  <li>Name must be unique</li>
                  <li>No special characters</li>
                  <li>Min 3, max 42 characters</li>
                  <li>Press enter to save your group</li>
                </ul>
              ) : (
                groupNameErrors.length > 0 && (
                  <ul className="list-disc text-[var(--flo-sem-color-content-danger-medium)] text-[11px] leading-[16px] pl-[16.5px]">
                    {groupNameErrors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                )
              )
            )}
          </div>
          <div className="flex flex-col gap-[16px] w-full">
            <AccountsMultiSelectField
              label="Accounts"
              accounts={ALL_ACCOUNTS}
              value={selectedAccountIds}
              disabled={!entity}
              disabledTooltip="Please select an Entity first"
              onChange={updateSelectedAccounts}
            />
            <RevealTransition show={isExpanded}>
              {accounts.length === 1 ? (
                <AccountBalanceFiltersInline
                  account={accounts[0]}
                  onChange={(updated) => setAccounts([updated])}
                  label="Accounts included"
                />
              ) : (
                <AccountBalanceFiltersSection accounts={accounts} onEdit={() => openDrillIn('account-filters')} />
              )}
            </RevealTransition>
          </div>

          <RevealTransition show={isExpanded}>
            <div className="flex flex-col gap-[24px] w-full">
              <FormDropdownField
                label="Frequency"
                placeholder="Select frequency"
                icon={<DateRange className="size-[20px]" />}
                isRequired
                options={FREQUENCY_OPTIONS}
                value={frequency}
                onChange={setFrequency}
              />

              <div className="flex flex-col gap-[8px] w-full">
                <p className="text-[#424867] text-[12px] leading-[18px] font-medium">Conversion</p>
                <div className="border border-solid border-[#e1e6ef] rounded-[6px] flex flex-col gap-[8px] px-[16px] py-[12px] w-full">
                  <FormDropdownField
                    label="Target Currency"
                    placeholder="No target currency"
                    options={TARGET_CURRENCY_OPTIONS}
                    value={targetCurrency}
                    onChange={setTargetCurrency}
                  />
                  <p className="text-[rgba(29,36,51,0.65)] text-[11px] leading-[16px]">
                    Conversion only. No consolidation adjustments.
                  </p>
                </div>
              </div>

              <GeneralSettingsSection settings={generalSettings} onChange={setGeneralSettings} />

              <AssigneesSection
                assignees={assignees}
                onEdit={(seed) => {
                  if (seed) setAssignees(seed)
                  openDrillIn('assignees')
                }}
                onAddAssignee={(assignee) => setAssignees((prev) => [...prev, assignee])}
              />

              <ControlsMultiSelectField
                label="Controls"
                options={CONTROL_OPTIONS}
                value={controls}
                onChange={setControls}
              />

              <TagsMultiSelectField
                label="Tags"
                options={tagOptions}
                value={selectedTagIds}
                onChange={setSelectedTagIds}
              />

              <DependencySection
                dependencies={dependencies}
                onEdit={() => openDrillIn('dependency')}
                disabled={!frequency}
                disabledTooltip="Please select a Frequency first"
              />
            </div>
          </RevealTransition>
        </div>
      </SideDrawer.Body>
      <SideDrawer.Footer>
        {!isViewingExisting && (
          <Checkbox
            checked={createAnother}
            onCheckedChange={(checked) => setCreateAnother(checked === true)}
            label="Create another"
          />
        )}
        <div className="flex-1" />
        <Button variant="ghost" color="dark" size="md" onClick={handleCancelRequest}>
          Cancel
        </Button>
        <Button color="primary" variant="filled" size="md" disabled={!canSave} onClick={handleSave}>
          Save
        </Button>
      </SideDrawer.Footer>
      </SlideScreen>

      <DiscardConfirmDialog open={showDiscardConfirm} onOpenChange={setShowDiscardConfirm} onDiscard={onCancel} />
    </SideDrawer>
  )
}
