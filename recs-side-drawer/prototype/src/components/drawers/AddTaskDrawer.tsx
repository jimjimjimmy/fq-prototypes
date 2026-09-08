import { useRef, useState } from 'react'
import { Button, Checkbox, CloseButton, SideDrawer, TextArea } from '@floqastinc/flow-ui_core'
import DomainOutlined from '@floqastinc/flow-ui_icons/material/DomainOutlined'
import FolderOutlined from '@floqastinc/flow-ui_icons/material/FolderOutlined'
import DateRange from '@floqastinc/flow-ui_icons/material/DateRange'
import { FormDropdownField } from '../FormDropdownField'
import { TagsMultiSelectField } from '../TagsMultiSelectField'
import { ControlsMultiSelectField } from '../ControlsMultiSelectField'
import { AssigneesSection } from './sections/AssigneesSection'
import { AssigneesDrillIn } from './sections/AssigneesDrillIn'
import { DependencySection } from './sections/DependencySection'
import { DependencyDrillIn } from './sections/DependencyDrillIn'
import { DiscardConfirmDialog } from './DiscardConfirmDialog'
import { SlideScreen, SLIDE_MS } from './SlideScreen'
import {
  ENTITY_OPTIONS,
  PERIOD_OPTIONS,
  FOLDER_OPTIONS,
  FREQUENCY_OPTIONS,
  CONTROL_OPTIONS,
  INITIAL_TAG_OPTIONS,
  type AssigneeState,
  type DependencyRow,
  type ExistingTaskSettings,
} from './addGroupTypes'

type DrawerView = 'main' | 'assignees' | 'dependency'

interface AddTaskDrawerProps {
  show: boolean
  onCancel: () => void
  // Fired on a successful save of a genuinely NEW task (never in
  // view/edit-existing mode - see `isViewingExisting` below).
  onCreated?: (label: string) => void
  // When provided, the drawer opens pre-populated with these values instead
  // of an empty form - used for "view existing settings" from a Checklist
  // table row's gear icon, as opposed to the empty "Add Task" flow.
  initialData?: ExistingTaskSettings
}

// Checklist's "Add Task" drawer - same drill-ins, suggestion chips, and
// footer/validation pattern as Add Group/Add Account, but a simpler field
// set per Figma (node 8673:68411): no Accounts, Account Balance Filters,
// Conversion, or General Settings, and every field is visible from the
// start (no isExpanded gating - matches the empty-state reference exactly).
export function AddTaskDrawer({ show, onCancel, onCreated, initialData }: AddTaskDrawerProps) {
  const isViewingExisting = Boolean(initialData)
  const [view, setView] = useState<DrawerView>('main')
  const [isClosingDrillIn, setIsClosingDrillIn] = useState(false)
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

  const [entity, setEntity] = useState<string | null>(initialData?.entity ?? null)
  const [period, setPeriod] = useState<string | null>(initialData?.period ?? null)
  const [folder, setFolder] = useState<string | null>(initialData?.folder ?? null)
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [frequency, setFrequency] = useState<string | null>(initialData?.frequency ?? null)
  const [assignees, setAssignees] = useState<AssigneeState[]>(initialData?.assignees ?? [])
  const [controls, setControls] = useState<string[]>(initialData?.controls ?? [])
  const [tagOptions] = useState(INITIAL_TAG_OPTIONS)
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialData?.selectedTagIds ?? [])
  const [dependencies, setDependencies] = useState<DependencyRow[]>(initialData?.dependencies ?? [])
  const [createAnother, setCreateAnother] = useState(false)
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false)

  const entityLabel = ENTITY_OPTIONS.find((o) => o.value === entity)?.label

  const initialSnapshot = useRef({
    entity: initialData?.entity ?? null,
    period: initialData?.period ?? null,
    folder: initialData?.folder ?? null,
    description: initialData?.description ?? '',
    frequency: initialData?.frequency ?? null,
    controls: initialData?.controls ?? [],
    selectedTagIds: initialData?.selectedTagIds ?? [],
    assignees: initialData?.assignees ?? [],
    dependencies: initialData?.dependencies ?? [],
  }).current

  const hasUnsavedChanges =
    entity !== initialSnapshot.entity ||
    period !== initialSnapshot.period ||
    folder !== initialSnapshot.folder ||
    description !== initialSnapshot.description ||
    frequency !== initialSnapshot.frequency ||
    JSON.stringify(controls) !== JSON.stringify(initialSnapshot.controls) ||
    JSON.stringify(selectedTagIds) !== JSON.stringify(initialSnapshot.selectedTagIds) ||
    JSON.stringify(assignees) !== JSON.stringify(initialSnapshot.assignees) ||
    JSON.stringify(dependencies) !== JSON.stringify(initialSnapshot.dependencies)

  const canSave =
    Boolean(entity) && Boolean(period) && description.trim().length > 0 && Boolean(frequency) && hasUnsavedChanges

  // Matches the live app's confirmed precondition for enabling "Add
  // Dependency": Folder, Description, and Frequency must all be filled in.
  const dependencyDisabled = !(folder && description.trim().length > 0 && frequency)

  const resetForm = () => {
    setEntity(null)
    setPeriod(null)
    setFolder(null)
    setDescription('')
    setFrequency(null)
    setAssignees([])
    setControls([])
    setSelectedTagIds([])
    setDependencies([])
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
      onCreated?.(`${entityLabel ? `${entityLabel} - ` : ''}${description}`)
    }
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
        <SideDrawer.Title>{isViewingExisting ? `${entityLabel ? `${entityLabel} ` : ''}Task Settings` : 'Add Task'}</SideDrawer.Title>
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
            onChange={setEntity}
          />
          <FormDropdownField
            label="Period"
            placeholder="Select period"
            icon={<DateRange className="size-[20px]" />}
            isRequired
            options={PERIOD_OPTIONS}
            value={period}
            onChange={setPeriod}
          />
          <FormDropdownField
            label="Folder"
            placeholder="Select a Folder"
            icon={<FolderOutlined className="size-[20px]" />}
            isRequired
            options={FOLDER_OPTIONS}
            value={folder}
            onChange={setFolder}
          />
          <TextArea
            label="Description"
            isLabelVisible
            isRequired
            placeholder="Add description"
            value={description}
            onChange={setDescription}
            styleOverrides={{ root: { width: '100%' }, textarea: { width: '100%' } }}
          />
          <FormDropdownField
            label="Frequency"
            placeholder="Select Frequency"
            icon={<DateRange className="size-[20px]" />}
            isRequired
            options={FREQUENCY_OPTIONS}
            value={frequency}
            onChange={setFrequency}
          />

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
            disabled={dependencyDisabled}
            disabledTooltip="Please complete Folder, Description, and Frequency first"
          />
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
