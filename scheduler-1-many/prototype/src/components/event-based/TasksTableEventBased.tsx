// @ts-ignore — FlowUI core is JS; skipLibCheck covers node_modules
import ZeroItemsEmptyState from '@floqastinc/flow-ui_core/ZeroItemsEmptyState'
// @ts-ignore
import Button from '@floqastinc/flow-ui_core/Button'
// @ts-ignore
import StatusBadge from '@floqastinc/flow-ui_core/StatusBadge'
// @ts-ignore
import ArrowUpward from '@floqastinc/flow-ui_icons/material/ArrowUpward'
import { RowActionsMenuEventBased } from './RowActionsMenuEventBased'

export interface Task {
  id: string
  type: string // task type display label
  taskLabel: string
  dependencies: string[] // dependency task IDs
  // Optional granular fields preserved for edit round-trip. Sample tasks
  // (seeded from the Jobs table Edit flow) don't carry these.
  aiTask?: string
  accounts?: string[]
  agent?: string
}

interface TasksTableProps {
  tasks: Task[]
  onAddTask: () => void
  onEditTask?: (task: Task) => void
  onDeleteTask?: (task: Task) => void
}

const COLS = 'grid-cols-[1.2fr_1.4fr_2fr_1.6fr_1.2fr_1.5fr_48px]'

function ColumnHeader({ label, sortable = true }: { label: string; sortable?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-1 px-3 py-2 text-[12px] font-semibold text-[#424867] uppercase tracking-wide select-none">
      <span>{label}</span>
      {sortable && <ArrowUpward size={14} color="#adb2bb" />}
    </div>
  )
}

export function TasksTableEventBased({ tasks, onAddTask, onEditTask, onDeleteTask }: TasksTableProps) {
  const isEmpty = tasks.length === 0
  const taskNameById = new Map(tasks.map((t) => [t.id, t.taskLabel]))

  return (
    <div className="flex-1 min-h-0 border border-[#e1e6ef] rounded-sm bg-white flex flex-col overflow-hidden">
      <div className={`grid ${COLS} border-b border-[#e1e6ef] bg-[#f8fafc]`}>
        <ColumnHeader label="Status" />
        <ColumnHeader label="Type" />
        <ColumnHeader label="Task" />
        <ColumnHeader label="Dependencies" />
        <ColumnHeader label="Last Run" />
        <ColumnHeader label="Next Run" />
        <div />
      </div>

      {isEmpty ? (
        <div className="flex-1 overflow-auto flex items-center justify-center p-12">
          <ZeroItemsEmptyState
            title="No tasks yet"
            subtitle="Add a task to define what this job will run."
            primaryButton={
              <Button color="primary" variant="filled" size="md" onClick={onAddTask}>
                Add Task
              </Button>
            }
          />
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          {tasks.map((task) => {
            const depLabels = task.dependencies
              .map((id) => taskNameById.get(id))
              .filter(Boolean)
              .join(', ')
            return (
              <div
                key={task.id}
                className={`grid ${COLS} border-b border-[#e1e6ef] hover:bg-[#f8fafc] items-center`}
              >
                <div className="px-3 py-2">
                  <StatusBadge color="neutral" size="sm">
                    Scheduled
                  </StatusBadge>
                </div>
                <div className="px-3 py-2 text-[14px] text-[#1d2433] truncate">{task.type}</div>
                <div className="px-3 py-2 text-[14px] text-[#1d2433] truncate">{task.taskLabel}</div>
                <div className="px-3 py-2 text-[14px] text-[#424867] truncate">
                  {depLabels || '—'}
                </div>
                <div className="px-3 py-2 text-[14px] text-[#424867]">—</div>
                <div className="px-3 py-2 text-[14px] text-[#424867]">—</div>
                <div className="px-2 py-2 flex justify-center">
                  <RowActionsMenuEventBased
                    ariaLabel="Task actions"
                    items={[
                      { label: 'Edit', onSelect: () => onEditTask?.(task) },
                      { label: 'Delete', onSelect: () => onDeleteTask?.(task) },
                    ]}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
