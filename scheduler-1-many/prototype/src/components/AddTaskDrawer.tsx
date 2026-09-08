import { useState } from 'react'
// @ts-ignore — FlowUI core is JS; skipLibCheck covers node_modules
import SideDrawer from '@floqastinc/flow-ui_core/SideDrawer'
// @ts-ignore
import Button from '@floqastinc/flow-ui_core/Button'
// @ts-ignore
import InputWrapper from '@floqastinc/flow-ui_core/InputWrapper'
// @ts-ignore
import Select from '@floqastinc/flow-ui_core/Select'
// @ts-ignore
import Close from '@floqastinc/flow-ui_icons/material/Close'

export type TaskType =
  | 'ai-matching'
  | 'transform-agent'
  | 'report-delivery'
  | 'reminder'
  | 'jem-sync'
  | 'core-data-sync'
  | 'auto-certification'
  | 'variance-analysis'
  | 'sftp-log'
  | 'jem-sftp-export'

export interface NewTask {
  type: TaskType
  taskLabel: string
  detailLabel: string
  dependencies: string[]
  // Granular form fields, preserved so an edit round-trip can restore them.
  aiTask?: string
  accounts?: string[]
  agent?: string
}

export interface EditingTask {
  id: string
  type: string // display label of the task type
  taskLabel: string
  dependencies: string[]
  aiTask?: string
  accounts?: string[]
  agent?: string
}

interface AddTaskDrawerProps {
  open: boolean
  onClose: () => void
  onSave: (task: NewTask) => void
  existingTasks: { id: string; label: string }[]
  editingTask?: EditingTask | null
}

export const TYPE_OPTIONS = [
  { label: 'AI Matching', value: 'ai-matching' },
  { label: 'Transform Agent', value: 'transform-agent' },
  { label: 'Report Delivery', value: 'report-delivery' },
  { label: 'Reminder', value: 'reminder' },
  { label: 'JEM Sync', value: 'jem-sync' },
  { label: 'Core Data Sync', value: 'core-data-sync' },
  { label: 'Auto-Certification', value: 'auto-certification' },
  { label: 'Variance Analysis', value: 'variance-analysis' },
  { label: 'SFTP Log', value: 'sftp-log' },
  { label: 'JEM SFTP Export', value: 'jem-sftp-export' },
]

const AI_MATCHING_TASK_OPTIONS = [
  { label: 'Sync All', value: 'sync-all' },
  { label: 'Apply Rules', value: 'apply-rules' },
  { label: 'Sync and Apply Rules', value: 'sync-and-apply-rules' },
]

const ACCOUNT_OPTIONS = [
  { label: 'Cash — Operating', value: 'cash-operating' },
  { label: 'Cash — Savings', value: 'cash-savings' },
  { label: 'Accounts Receivable', value: 'ar' },
  { label: 'Accounts Payable', value: 'ap' },
  { label: 'Revenue — Subscription', value: 'revenue-sub' },
  { label: 'Revenue — Services', value: 'revenue-services' },
  { label: 'COGS', value: 'cogs' },
]

const AGENT_OPTIONS = [
  { label: 'Sales Tax Reclassifier', value: 'sales-tax' },
  { label: 'Multi-Currency Converter', value: 'fx-converter' },
  { label: 'Account Mapper', value: 'account-mapper' },
  { label: 'Period Allocator', value: 'period-allocator' },
  { label: 'Variance Detector', value: 'variance-detector' },
]

export function AddTaskDrawer({
  open,
  onClose,
  onSave,
  existingTasks,
  editingTask,
}: AddTaskDrawerProps) {
  const isEdit = !!editingTask

  // Lazy initial state from editingTask (with reverse-lookup fallback so
  // tasks missing granular fields can still populate from taskLabel).
  // Parent forces remount via `key` when switching tasks, so these
  // initializers run on every new edit.
  const initialTaskType: TaskType | '' = editingTask
    ? ((TYPE_OPTIONS.find((o) => o.label === editingTask.type)?.value as TaskType) ?? '')
    : ''

  const initialAiTask =
    editingTask?.aiTask ??
    (editingTask?.type === 'AI Matching'
      ? AI_MATCHING_TASK_OPTIONS.find((o) => o.label === editingTask.taskLabel)?.value ?? ''
      : '')

  const initialAgent =
    editingTask?.agent ??
    (editingTask?.type === 'Transform Agent'
      ? AGENT_OPTIONS.find((o) => o.label === editingTask.taskLabel)?.value ?? ''
      : '')

  const [taskType, setTaskType] = useState<TaskType | ''>(initialTaskType)
  const [aiTask, setAiTask] = useState(initialAiTask)
  const [accounts, setAccounts] = useState<string[]>(editingTask?.accounts ?? [])
  const [agent, setAgent] = useState(initialAgent)
  const [dependencies, setDependencies] = useState<string[]>(editingTask?.dependencies ?? [])

  const isFirstTask = existingTasks.length === 0

  const typeLabel = TYPE_OPTIONS.find((o) => o.value === taskType)?.label || 'Select Task Type'
  const aiTaskLabel = AI_MATCHING_TASK_OPTIONS.find((o) => o.value === aiTask)?.label || 'Select AI Matching Task'
  const accountsLabel =
    accounts.length === 0
      ? 'Select Accounts'
      : accounts.length === 1
        ? ACCOUNT_OPTIONS.find((o) => o.value === accounts[0])?.label || '1 selected'
        : `${accounts.length} selected`
  const agentLabel = AGENT_OPTIONS.find((o) => o.value === agent)?.label || 'Select Agent'
  const dependenciesLabel = isFirstTask
    ? 'No dependencies available'
    : dependencies.length === 0
      ? 'Select Dependencies'
      : dependencies.length === 1
        ? existingTasks.find((t) => t.id === dependencies[0])?.label || '1 selected'
        : `${dependencies.length} selected`

  const handleSave = () => {
    if (!taskType) return

    let taskLabel = ''
    let detailLabel = ''
    if (taskType === 'ai-matching') {
      taskLabel = AI_MATCHING_TASK_OPTIONS.find((o) => o.value === aiTask)?.label || 'AI Matching Task'
      detailLabel = accounts.length === 0
        ? '—'
        : `${accounts.length} account${accounts.length === 1 ? '' : 's'}`
    } else if (taskType === 'transform-agent') {
      taskLabel = AGENT_OPTIONS.find((o) => o.value === agent)?.label || 'Transform Agent'
      detailLabel = 'Agent'
    } else {
      // Other task types have no sub-config in this prototype — name the task
      // after its type and leave the detail blank.
      taskLabel = TYPE_OPTIONS.find((o) => o.value === taskType)?.label || 'Task'
      detailLabel = '—'
    }

    onSave({
      type: taskType,
      taskLabel: taskLabel || 'Untitled Task',
      detailLabel,
      dependencies,
      aiTask: taskType === 'ai-matching' ? aiTask : undefined,
      accounts: taskType === 'ai-matching' ? accounts : undefined,
      agent: taskType === 'transform-agent' ? agent : undefined,
    })
  }

  return (
    <SideDrawer show={open} onCancel={onClose} width="md">
      <SideDrawer.Header>
        <SideDrawer.Title>{isEdit ? 'Edit Task' : 'Add Task'}</SideDrawer.Title>
        <SideDrawer.Subtitle>
          Configure a task to run as part of this job.
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
            <InputWrapper.Label>Task Type</InputWrapper.Label>
            <Select
              className="w-full"
              selectionMode="single"
              value={taskType}
              onChange={(newValue: TaskType | null) => setTaskType(newValue ?? '')}
              options={TYPE_OPTIONS}
              buttonLabel={typeLabel}
              disableFilter
            />
          </InputWrapper>

          {taskType === 'ai-matching' && (
            <>
              <InputWrapper isRequired className="w-full">
                <InputWrapper.Label>AI Matching Task</InputWrapper.Label>
                <Select
                  className="w-full"
                  selectionMode="single"
                  value={aiTask}
                  onChange={(newValue: string | null) => setAiTask(newValue ?? '')}
                  options={AI_MATCHING_TASK_OPTIONS}
                  buttonLabel={aiTaskLabel}
                  disableFilter
                />
              </InputWrapper>

              <InputWrapper isRequired className="w-full">
                <InputWrapper.Label>Accounts</InputWrapper.Label>
                <Select
                  className="w-full"
                  selectionMode="multiple"
                  value={accounts}
                  onChange={(newValue: string[]) => setAccounts(newValue ?? [])}
                  options={ACCOUNT_OPTIONS}
                  buttonLabel={accountsLabel}
                  filterPlaceholder="Search accounts"
                />
              </InputWrapper>
            </>
          )}

          {taskType === 'transform-agent' && (
            <InputWrapper isRequired className="w-full">
              <InputWrapper.Label>Agent</InputWrapper.Label>
              <Select
                className="w-full"
                selectionMode="single"
                value={agent}
                onChange={(newValue: string | null) => setAgent(newValue ?? '')}
                options={AGENT_OPTIONS}
                buttonLabel={agentLabel}
                filterPlaceholder="Search agents"
              />
            </InputWrapper>
          )}

          <InputWrapper className="w-full">
            <InputWrapper.Label>Dependencies</InputWrapper.Label>
            <InputWrapper.Sublabel>
              {isFirstTask
                ? 'No tasks added yet — dependencies will be available after the first task.'
                : 'Select tasks that must complete before this one runs.'}
            </InputWrapper.Sublabel>
            {isFirstTask ? (
              <div
                aria-disabled
                className="w-full h-10 px-3 border border-[#e1e6ef] bg-[#f8fafc] text-[#adb2bb] text-[14px] rounded-sm flex items-center cursor-not-allowed select-none"
              >
                {dependenciesLabel}
              </div>
            ) : (
              <Select
                className="w-full"
                selectionMode="multiple"
                value={dependencies}
                onChange={(newValue: string[]) => setDependencies(newValue ?? [])}
                options={existingTasks.map((t) => ({ label: t.label, value: t.id }))}
                buttonLabel={dependenciesLabel}
                filterPlaceholder="Search tasks"
              />
            )}
          </InputWrapper>
        </div>
      </SideDrawer.Body>

      <SideDrawer.Footer>
        <div className="flex justify-end items-center gap-4 w-full">
          <Button color="secondary" variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" variant="filled" size="md" onClick={handleSave}>
            {isEdit ? 'Save Changes' : 'Add Task'}
          </Button>
        </div>
      </SideDrawer.Footer>
    </SideDrawer>
  )
}
