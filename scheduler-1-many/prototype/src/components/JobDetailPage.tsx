import { useState } from 'react'
// @ts-ignore — FlowUI core is JS; skipLibCheck covers node_modules
import Button from '@floqastinc/flow-ui_core/Button'
// @ts-ignore
import ButtonGroup from '@floqastinc/flow-ui_core/ButtonGroup'
// @ts-ignore
import TableChart from '@floqastinc/flow-ui_icons/material/TableChart'
// @ts-ignore
import CallSplit from '@floqastinc/flow-ui_icons/material/CallSplit'
import { JobDetailHeader } from './JobDetailHeader'
import { TasksTable, type Task } from './TasksTable'
import { TasksFlowView } from './TasksFlowView'
import { AddTaskDrawer, TYPE_OPTIONS, type NewTask, type EditingTask } from './AddTaskDrawer'
import type { JobConfig } from './CreateJobDrawer'

type TasksView = 'table' | 'flow'

interface JobDetailPageProps {
  config: JobConfig
  initialTasks?: Task[]
  onBack: () => void
  onEditJob: () => void
}

export function JobDetailPage({
  config,
  initialTasks,
  onBack,
  onEditJob,
}: JobDetailPageProps) {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [tasks, setTasks] = useState<Task[]>(initialTasks ?? [])
  const [view, setView] = useState<TasksView>('table')

  const editingTask: EditingTask | null = (() => {
    if (!editingTaskId) return null
    const t = tasks.find((x) => x.id === editingTaskId)
    if (!t) return null
    return {
      id: t.id,
      type: t.type,
      taskLabel: t.taskLabel,
      aiTask: t.aiTask,
      accounts: t.accounts,
      agent: t.agent,
      dependencies: t.dependencies,
    }
  })()

  const handleSaveTask = (newTask: NewTask) => {
    const mappedType: Task['type'] =
      TYPE_OPTIONS.find((o) => o.value === newTask.type)?.label ?? newTask.type

    if (editingTaskId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTaskId
            ? {
                ...t,
                type: mappedType,
                taskLabel: newTask.taskLabel,
                dependencies: newTask.dependencies,
                aiTask: newTask.aiTask,
                accounts: newTask.accounts,
                agent: newTask.agent,
              }
            : t,
        ),
      )
      setEditingTaskId(null)
    } else {
      const task: Task = {
        id: `task-${tasks.length + 1}-${Date.now()}`,
        type: mappedType,
        taskLabel: newTask.taskLabel,
        dependencies: newTask.dependencies,
        aiTask: newTask.aiTask,
        accounts: newTask.accounts,
        agent: newTask.agent,
      }
      setTasks([...tasks, task])
    }
    setIsAddTaskOpen(false)
  }

  const handleEditTask = (task: Task) => {
    setEditingTaskId(task.id)
    setIsAddTaskOpen(true)
  }

  const handleDeleteTask = (task: Task) => {
    setTasks((prev) =>
      prev
        .filter((t) => t.id !== task.id)
        // Drop dangling references to the deleted task from other tasks' deps
        .map((t) => ({ ...t, dependencies: t.dependencies.filter((d) => d !== task.id) })),
    )
  }

  const handleDrawerClose = () => {
    setIsAddTaskOpen(false)
    setEditingTaskId(null)
  }

  return (
    <>
      <JobDetailHeader
        config={config}
        onBack={onBack}
        onEditJob={onEditJob}
      />
      <div className="flex-1 min-h-0 flex flex-col px-8 py-6 gap-4">
        <div className="shrink-0 flex items-center justify-between">
          <ButtonGroup>
            <ButtonGroup.Button
              isActive={view === 'table'}
              onClick={() => setView('table')}
              aria-label="Table view"
              aria-pressed={view === 'table'}
            >
              <TableChart size={18} />
            </ButtonGroup.Button>
            <ButtonGroup.Button
              isActive={view === 'flow'}
              onClick={() => setView('flow')}
              aria-label="Flow view"
              aria-pressed={view === 'flow'}
            >
              <CallSplit size={18} />
            </ButtonGroup.Button>
          </ButtonGroup>

          <Button
            color="primary"
            variant="filled"
            size="md"
            onClick={() => setIsAddTaskOpen(true)}
          >
            Add Task
          </Button>
        </div>

        {view === 'table' ? (
          <TasksTable
            tasks={tasks}
            onAddTask={() => setIsAddTaskOpen(true)}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        ) : (
          <TasksFlowView tasks={tasks} onAddTask={() => setIsAddTaskOpen(true)} />
        )}
      </div>

      <AddTaskDrawer
        key={editingTaskId ?? 'new'}
        open={isAddTaskOpen}
        onClose={handleDrawerClose}
        onSave={handleSaveTask}
        editingTask={editingTask}
        existingTasks={tasks
          .filter((t) => t.id !== editingTaskId)
          .map((t) => ({ id: t.id, label: t.taskLabel }))}
      />
    </>
  )
}
