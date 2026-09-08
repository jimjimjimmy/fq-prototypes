import { useState } from 'react'
// @ts-ignore — FlowUI core is JS; skipLibCheck covers node_modules
import ExpandMore from '@floqastinc/flow-ui_icons/material/ExpandMore'
// @ts-ignore
import ExpandLess from '@floqastinc/flow-ui_icons/material/ExpandLess'
import { getSampleTasksForJob } from '../../data/sampleTasks'

interface JobTasksAccordionProps {
  jobId?: string
}

export function JobTasksAccordionEventBased({ jobId }: JobTasksAccordionProps) {
  const [expanded, setExpanded] = useState(false)
  const tasks = getSampleTasksForJob(jobId)
  const labelById = new Map(tasks.map((t) => [t.id, t.taskLabel]))

  return (
    <div className="border-b border-[#e1e6ef]">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        className="w-full flex items-center justify-between py-3 text-left hover:bg-[#f8fafc]"
      >
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-semibold text-[#1d2433]">Tasks</span>
          <span className="text-[12px] text-[#6b7280]">({tasks.length})</span>
        </div>
        {expanded ? (
          <ExpandLess size={20} color="#424867" />
        ) : (
          <ExpandMore size={20} color="#424867" />
        )}
      </button>

      {expanded && (
        <div className="pb-4 flex flex-col gap-2">
          {tasks.map((task, i) => {
            const deps = task.dependencies
              .map((id) => labelById.get(id))
              .filter(Boolean)
              .join(', ')
            return (
              <div
                key={task.id}
                className="border border-[#e1e6ef] rounded-sm bg-[#f8fafc] p-3 flex flex-col gap-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-[#6b7280] w-5">
                    {i + 1}.
                  </span>
                  <span className="text-[14px] font-semibold text-[#1d2433]">
                    {task.taskLabel}
                  </span>
                </div>
                <div className="pl-7 grid grid-cols-[88px_1fr] gap-x-3 gap-y-1 text-[12px]">
                  <span className="text-[#6b7280]">Type</span>
                  <span className="text-[#1d2433]">{task.type}</span>
                  <span className="text-[#6b7280]">Dependencies</span>
                  <span className="text-[#1d2433]">{deps || '—'}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
