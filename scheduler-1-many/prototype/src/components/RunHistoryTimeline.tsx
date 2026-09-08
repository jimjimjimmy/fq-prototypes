import { useState } from 'react'
// @ts-ignore — FlowUI core is JS; skipLibCheck covers node_modules
import CalendarToday from '@floqastinc/flow-ui_icons/material/CalendarToday'
// @ts-ignore
import CheckCircle from '@floqastinc/flow-ui_icons/material/CheckCircle'
// @ts-ignore
import Error from '@floqastinc/flow-ui_icons/material/Error'
// @ts-ignore
import ExpandMore from '@floqastinc/flow-ui_icons/material/ExpandMore'
// @ts-ignore
import ExpandLess from '@floqastinc/flow-ui_icons/material/ExpandLess'

type RunStatus = 'Completed' | 'Failed' | 'Running'

interface TaskRun {
  taskName: string
  status: RunStatus
  startTime: string
  endTime: string
  duration: string
}

interface RunEntry {
  id: string
  status: RunStatus
  timeAgo: string
  date: string
  startTime: string
  endTime: string
  duration: string
  tasks: TaskRun[]
}

const SAMPLE_RUNS: RunEntry[] = [
  {
    id: 'run-1',
    status: 'Completed',
    timeAgo: '7d ago',
    date: 'Apr 13, 2026',
    startTime: '11:00 AM',
    endTime: '11:01 AM',
    duration: '1m 22s',
    tasks: [
      { taskName: 'Sync All',          status: 'Completed', startTime: '11:00:00 AM', endTime: '11:00:06 AM', duration: '6s' },
      { taskName: 'Apply Rules',       status: 'Completed', startTime: '11:00:06 AM', endTime: '11:00:48 AM', duration: '42s' },
      { taskName: 'Variance Detector', status: 'Completed', startTime: '11:00:48 AM', endTime: '11:01:06 AM', duration: '18s' },
      { taskName: 'Account Mapper',    status: 'Completed', startTime: '11:01:06 AM', endTime: '11:01:22 AM', duration: '16s' },
    ],
  },
  {
    id: 'run-2',
    status: 'Completed',
    timeAgo: '38d ago',
    date: 'Mar 13, 2026',
    startTime: '11:00 AM',
    endTime: '11:01 AM',
    duration: '1m 38s',
    tasks: [
      { taskName: 'Sync All',          status: 'Completed', startTime: '11:00:00 AM', endTime: '11:00:08 AM', duration: '8s' },
      { taskName: 'Apply Rules',       status: 'Completed', startTime: '11:00:08 AM', endTime: '11:00:55 AM', duration: '47s' },
      { taskName: 'Variance Detector', status: 'Completed', startTime: '11:00:55 AM', endTime: '11:01:20 AM', duration: '25s' },
      { taskName: 'Account Mapper',    status: 'Completed', startTime: '11:01:20 AM', endTime: '11:01:38 AM', duration: '18s' },
    ],
  },
  {
    id: 'run-3',
    status: 'Completed',
    timeAgo: '67d ago',
    date: 'Feb 12, 2026',
    startTime: '10:00 AM',
    endTime: '10:01 AM',
    duration: '1m 12s',
    tasks: [
      { taskName: 'Sync All',          status: 'Completed', startTime: '10:00:00 AM', endTime: '10:00:05 AM', duration: '5s' },
      { taskName: 'Apply Rules',       status: 'Completed', startTime: '10:00:05 AM', endTime: '10:00:42 AM', duration: '37s' },
      { taskName: 'Variance Detector', status: 'Completed', startTime: '10:00:42 AM', endTime: '10:00:58 AM', duration: '16s' },
      { taskName: 'Account Mapper',    status: 'Completed', startTime: '10:00:58 AM', endTime: '10:01:12 AM', duration: '14s' },
    ],
  },
]

function StatusIcon({ status, size = 16 }: { status: RunStatus; size?: number }) {
  if (status === 'Failed') {
    return <Error size={size} color="#d92d20" />
  }
  if (status === 'Running') {
    return (
      <div
        className="rounded-full border-2 border-[#1fac76] animate-spin border-r-transparent"
        style={{ width: size, height: size }}
      />
    )
  }
  return <CheckCircle size={size} color="#1fac76" />
}

function MetaRow({
  startTime,
  endTime,
  duration,
  status,
}: {
  startTime: string
  endTime: string
  duration: string
  status: RunStatus
}) {
  return (
    <div className="flex items-center gap-2 text-[12px] text-[#424867]">
      <StatusIcon status={status} size={14} />
      <span>
        <span className="text-[#6b7280]">Start</span> {startTime}
      </span>
      <span className="text-[#cbd2e1]">·</span>
      <span>
        <span className="text-[#6b7280]">End</span> {endTime}
      </span>
      <span className="text-[#cbd2e1]">·</span>
      <span>
        <span className="text-[#6b7280]">Duration</span> {duration}
      </span>
    </div>
  )
}

function RunRow({ run, isLast }: { run: RunEntry; isLast: boolean }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="flex">
      {/* Timeline rail */}
      <div className="relative w-[30px] shrink-0">
        <div className="absolute left-[10px] top-0 w-[2px] h-[6px] bg-[#e1e6ef]" />
        <div className="absolute left-[6px] top-[6px] w-[10px] h-[10px] rounded-full border-2 border-[#cbd2e1] bg-white" />
        {!isLast && (
          <div className="absolute left-[10px] top-[16px] bottom-0 w-[2px] bg-[#e1e6ef]" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-6 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[14px] font-semibold text-[#1d2433]">{run.status}</span>
          <span className="text-[12px] text-[#6b7280] shrink-0">{run.timeAgo}</span>
        </div>

        <div className="flex items-center gap-1.5 mt-1 text-[12px] text-[#6b7280]">
          <CalendarToday size={11} color="#6b7280" />
          <span>{run.date}</span>
        </div>

        <div className="mt-2">
          <MetaRow
            startTime={run.startTime}
            endTime={run.endTime}
            duration={run.duration}
            status={run.status}
          />
        </div>

        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="flex items-center gap-1 mt-2 text-[12px] font-semibold text-[#1fac76] hover:text-[#1c895f]"
        >
          {expanded ? <ExpandLess size={16} /> : <ExpandMore size={16} />}
          <span>{expanded ? 'Hide details' : 'Show details'}</span>
        </button>

        {expanded && (
          <div className="mt-3 border border-[#e1e6ef] rounded-sm bg-[#f8fafc] p-3 flex flex-col gap-2.5">
            {run.tasks.map((task) => (
              <div key={task.taskName} className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[13px] text-[#1d2433] font-semibold">
                  <StatusIcon status={task.status} size={14} />
                  <span>{task.taskName}</span>
                </div>
                <div className="pl-6 text-[12px] text-[#424867] flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span>
                    <span className="text-[#6b7280]">Start</span> {task.startTime}
                  </span>
                  <span className="text-[#cbd2e1]">·</span>
                  <span>
                    <span className="text-[#6b7280]">End</span> {task.endTime}
                  </span>
                  <span className="text-[#cbd2e1]">·</span>
                  <span>
                    <span className="text-[#6b7280]">Duration</span> {task.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function RunHistoryTimeline() {
  return (
    <div className="pt-5">
      {SAMPLE_RUNS.map((run, i) => (
        <RunRow key={run.id} run={run} isLast={i === SAMPLE_RUNS.length - 1} />
      ))}
    </div>
  )
}
