// @ts-ignore — FlowUI core is JS; skipLibCheck covers node_modules
import StatusBadge from '@floqastinc/flow-ui_core/StatusBadge'
// @ts-ignore
import Button from '@floqastinc/flow-ui_core/Button'
// @ts-ignore
import ZeroItemsEmptyState from '@floqastinc/flow-ui_core/ZeroItemsEmptyState'
// @ts-ignore
import ArrowDownward from '@floqastinc/flow-ui_icons/material/ArrowDownward'
import type { Task } from './TasksTable'

interface TasksFlowViewProps {
  tasks: Task[]
  onAddTask: () => void
}

/**
 * Topologically sort tasks into levels. Level 0 = no dependencies; level N = depends on
 * tasks at levels 0..N-1. Tasks at the same level can run in parallel.
 */
function buildLevels(tasks: Task[]): Task[][] {
  const taskById = new Map(tasks.map((t) => [t.id, t]))
  const levelByTaskId = new Map<string, number>()

  // Iteratively assign levels until all tasks have one.
  // A task's level = max(level of each dep) + 1, or 0 if no deps.
  let changed = true
  while (changed) {
    changed = false
    for (const task of tasks) {
      if (levelByTaskId.has(task.id)) continue
      const depLevels = task.dependencies
        .map((depId) => levelByTaskId.get(depId))
        .filter((l): l is number => l !== undefined)
      const allDepsResolved = task.dependencies.every((depId) =>
        taskById.has(depId) ? levelByTaskId.has(depId) : true,
      )
      if (allDepsResolved) {
        const level = depLevels.length === 0 ? 0 : Math.max(...depLevels) + 1
        levelByTaskId.set(task.id, level)
        changed = true
      }
    }
  }

  const maxLevel = Math.max(0, ...Array.from(levelByTaskId.values()))
  const levels: Task[][] = Array.from({ length: maxLevel + 1 }, () => [])
  for (const task of tasks) {
    const level = levelByTaskId.get(task.id) ?? 0
    levels[level].push(task)
  }
  return levels
}

function TaskCard({ task, taskNameById }: { task: Task; taskNameById: Map<string, string> }) {
  const depLabels = task.dependencies
    .map((id) => taskNameById.get(id))
    .filter(Boolean) as string[]

  return (
    <div className="w-[280px] border border-[#e1e6ef] rounded-sm bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="px-4 py-3 border-b border-[#e1e6ef] flex items-center justify-between gap-2">
        <span className="text-[12px] font-semibold text-[#424867] uppercase tracking-wide">
          {task.type}
        </span>
        <StatusBadge color="neutral" size="sm">
          Scheduled
        </StatusBadge>
      </div>
      <div className="px-4 py-3">
        <div className="text-[14px] font-semibold text-[#1d2433] mb-1">{task.taskLabel}</div>
        {depLabels.length > 0 && (
          <div className="text-[12px] text-[#6b7280] mt-2">
            After: {depLabels.join(', ')}
          </div>
        )}
      </div>
    </div>
  )
}

export function TasksFlowView({ tasks, onAddTask }: TasksFlowViewProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex-1 min-h-0 border border-[#e1e6ef] rounded-sm bg-white flex items-center justify-center p-12">
        <ZeroItemsEmptyState
          title="No tasks yet"
          subtitle="Add a task to see the dependency flow."
          primaryButton={
            <Button color="primary" variant="filled" size="md" onClick={onAddTask}>
              Add Task
            </Button>
          }
        />
      </div>
    )
  }

  const levels = buildLevels(tasks)
  const taskNameById = new Map(tasks.map((t) => [t.id, t.taskLabel]))

  return (
    <div className="flex-1 min-h-0 border border-[#e1e6ef] rounded-sm bg-[#f8fafc] overflow-auto p-8">
      <div className="flex flex-col items-center gap-2">
        {levels.map((levelTasks, levelIdx) => (
          <div key={levelIdx} className="flex flex-col items-center gap-2 w-full">
            <div className="flex flex-row flex-wrap items-stretch justify-center gap-4">
              {levelTasks.map((task) => (
                <TaskCard key={task.id} task={task} taskNameById={taskNameById} />
              ))}
            </div>
            {levelIdx < levels.length - 1 && (
              <div className="flex items-center justify-center py-2">
                <ArrowDownward size={20} color="#adb2bb" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
