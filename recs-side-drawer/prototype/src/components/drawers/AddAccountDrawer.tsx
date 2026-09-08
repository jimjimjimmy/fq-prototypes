import { useRef, useState } from 'react'
import { Button, Checkbox, CloseButton, SideDrawer } from '@floqastinc/flow-ui_core'
import DomainOutlined from '@floqastinc/flow-ui_icons/material/DomainOutlined'
import FolderOutlined from '@floqastinc/flow-ui_icons/material/FolderOutlined'
import FormatListBulletedOutlined from '@floqastinc/flow-ui_icons/material/FormatListBulletedOutlined'
import DateRange from '@floqastinc/flow-ui_icons/material/DateRange'
import { FormDropdownField } from '../FormDropdownField'
import { TagsMultiSelectField } from '../TagsMultiSelectField'
import { ControlsMultiSelectField } from '../ControlsMultiSelectField'
import { AccountBalanceFiltersEditable } from './sections/AccountBalanceFiltersEditable'
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
  type GeneralSettingsState,
} from './addGroupTypes'

type DrawerView = 'main' | 'assignees' | 'dependency'

const DEFAULT_GENERAL_SETTINGS: GeneralSettingsState = {
  currency: 'usd',
  threshold: '100.00',
  fixedBalance: '',
}

const ACCOUNT_OPTIONS = ALL_ACCOUNTS.map((a) => ({ label: a.name, value: a.id }))

interface AddAccountDrawerProps {
  show: boolean
  onCancel: () => void
  // Fired on a successful save - this drawer has no view/edit-existing mode
  // yet, so every save here is a genuine create.
  onCreated?: (label: string) => void
}

export function AddAccountDrawer({ show, onCancel, onCreated }: AddAccountDrawerProps) {
  const [view, setView] = useState<DrawerView>('main')
  const [isClosingDrillIn, setIsClosingDrillIn] = useState(false)
  // See AddGroupDrawer for why these two exist - same symmetric open/close
  // drill-in motion, reused verbatim here.
  const [hasReturnedFromDrillIn, setHasReturnedFromDrillIn] = useState(false)
  const [openingDrillIn, setOpeningDrillIn] = useState<Exclude<DrawerView, 'main'> | null>(null)

  const openDrillIn = (target: Exclude<DrawerView, 'main'>) => {
    setOpeningDrillIn(target)
    window.setTimeout(() => {
      setView(target)
      setOpeningDrillIn(null)
    }, SLIDE_MS)
  }

  const closeDrillIn = (after: () => void) => {
    setIsClosingDrillIn(true)
    window.setTimeout(() => {
      after()
      setIsClosingDrillIn(false)
      setHasReturnedFromDrillIn(true)
    }, SLIDE_MS)
  }

  const [entity, setEntity] = useState<string | null>(null)
  const [folder, setFolder] = useState<string | null>(null)
  const [accountId, setAccountId] = useState<string | null>(null)
  // The single account's own Dimension/Value filter rows - reset whenever a
  // different account is picked, matching Add Group's per-account reset.
  const [accountRows, setAccountRows] = useState<AccountFilterState['rows']>([])

  const updateAccountId = (v: string | null) => {
    setAccountId(v)
    setAccountRows([])
  }

  const entityLabel = ENTITY_OPTIONS.find((o) => o.value === entity)?.label
  const accountLabel = ACCOUNT_OPTIONS.find((o) => o.value === accountId)?.label ?? accountId ?? ''

  const [targetCurrency, setTargetCurrency] = useState<string | null>('none')
  const [frequency, setFrequency] = useState<string | null>(null)
  const [assignees, setAssignees] = useState<AssigneeState[]>([])
  const [controls, setControls] = useState<string[]>([])
  const [tagOptions] = useState(INITIAL_TAG_OPTIONS)
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [dependencies, setDependencies] = useState<DependencyRow[]>([])
  const [generalSettings, setGeneralSettings] = useState<GeneralSettingsState>(DEFAULT_GENERAL_SETTINGS)
  const [createAnother, setCreateAnother] = useState(false)
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false)

  // Unlike Add Group, General Settings/Assignees/Controls/Frequency are
  // always visible per Figma (node 8624:44779, the empty state already shows
  // them) - only Account Balance Filters, Conversion, Tags, and Dependency
  // wait for Entity+Folder+Account to all be set (node 8624:47318).
  const isExpanded = Boolean(entity) && Boolean(folder) && Boolean(accountId)

  const initialSnapshot = useRef({
    entity: null as string | null,
    folder: null as string | null,
    accountId: null as string | null,
    accountRows: [] as AccountFilterState['rows'],
    targetCurrency: 'none',
    frequency: null as string | null,
    controls: [] as string[],
    selectedTagIds: [] as string[],
    assignees: [] as AssigneeState[],
    generalSettings: DEFAULT_GENERAL_SETTINGS,
  }).current

  const hasUnsavedChanges =
    entity !== initialSnapshot.entity ||
    folder !== initialSnapshot.folder ||
    accountId !== initialSnapshot.accountId ||
    JSON.stringify(accountRows) !== JSON.stringify(initialSnapshot.accountRows) ||
    targetCurrency !== initialSnapshot.targetCurrency ||
    frequency !== initialSnapshot.frequency ||
    JSON.stringify(controls) !== JSON.stringify(initialSnapshot.controls) ||
    JSON.stringify(selectedTagIds) !== JSON.stringify(initialSnapshot.selectedTagIds) ||
    JSON.stringify(assignees) !== JSON.stringify(initialSnapshot.assignees) ||
    JSON.stringify(generalSettings) !== JSON.stringify(initialSnapshot.generalSettings) ||
    dependencies.length > 0

  const canSave = Boolean(entity) && Boolean(folder) && Boolean(accountId) && Boolean(frequency) && hasUnsavedChanges

  const resetForm = () => {
    setEntity(null)
    setFolder(null)
    setAccountId(null)
    setAccountRows([])
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
    onCreated?.(`${entityLabel ? `${entityLabel} - ` : ''}${accountLabel}`)
    if (createAnother) {
      resetForm()
    } else {
      onCancel()
    }
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
        <SideDrawer.Title>Add Account</SideDrawer.Title>
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
            onChange={(v) => {
              setEntity(v)
              setFolder(null)
            }}
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
          <FormDropdownField
            label="Account"
            placeholder="Add Account"
            icon={<FormatListBulletedOutlined className="size-[20px]" />}
            isRequired
            disabled={!entity}
            disabledTooltip="Please select an Entity first"
            options={ACCOUNT_OPTIONS}
            value={accountId}
            onChange={updateAccountId}
          />
          {isExpanded && (
            <RevealTransition show={isExpanded}>
              <AccountBalanceFiltersEditable
                account={{ id: accountId ?? '', name: accountLabel, rows: accountRows }}
                onChange={(updated) => setAccountRows(updated.rows)}
              />
            </RevealTransition>
          )}

          <FormDropdownField
            label="Frequency"
            placeholder="Select frequency"
            icon={<DateRange className="size-[20px]" />}
            isRequired
            options={FREQUENCY_OPTIONS}
            value={frequency}
            onChange={setFrequency}
          />

          {isExpanded && (
            <RevealTransition show={isExpanded}>
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
            </RevealTransition>
          )}

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

          {isExpanded && (
            <RevealTransition show={isExpanded}>
              <div className="flex flex-col gap-[24px] w-full">
                <TagsMultiSelectField
                  label="Tags"
                  options={tagOptions}
                  value={selectedTagIds}
                  onChange={setSelectedTagIds}
                />

                <DependencySection dependencies={dependencies} onEdit={() => openDrillIn('dependency')} />
              </div>
            </RevealTransition>
          )}
        </div>
      </SideDrawer.Body>
      <SideDrawer.Footer>
        <Checkbox
          checked={createAnother}
          onCheckedChange={(checked) => setCreateAnother(checked === true)}
          label="Create another"
        />
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
