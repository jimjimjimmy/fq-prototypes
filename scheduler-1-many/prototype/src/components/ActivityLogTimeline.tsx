// @ts-ignore — FlowUI core is JS; skipLibCheck covers node_modules
import CalendarToday from '@floqastinc/flow-ui_icons/material/CalendarToday'
// @ts-ignore
import AddCircle from '@floqastinc/flow-ui_icons/material/AddCircle'
// @ts-ignore
import Add from '@floqastinc/flow-ui_icons/material/Add'
// @ts-ignore
import Remove from '@floqastinc/flow-ui_icons/material/Remove'
// @ts-ignore
import SwapVert from '@floqastinc/flow-ui_icons/material/SwapVert'
// @ts-ignore
// FlowUI Material icon whose library export is named "Schedule" (a clock glyph).
// That's the icon library's name, NOT our domain term — the import path stays as-is
// (external API). Aliased to JobIcon locally to match our terminology.
import JobIcon from '@floqastinc/flow-ui_icons/material/Schedule'
// @ts-ignore
import Edit from '@floqastinc/flow-ui_icons/material/Edit'
// @ts-ignore
import Person from '@floqastinc/flow-ui_icons/material/Person'
// @ts-ignore
import ToggleOn from '@floqastinc/flow-ui_icons/material/ToggleOn'
// @ts-ignore
import ToggleOff from '@floqastinc/flow-ui_icons/material/ToggleOff'
// @ts-ignore
import ArrowForward from '@floqastinc/flow-ui_icons/material/ArrowForward'

type ActivityType =
  | 'created'
  | 'task_added'
  | 'task_removed'
  | 'dependency_changed'
  | 'cadence_changed'
  | 'agent_changed'
  | 'renamed'
  | 'enabled'
  | 'disabled'

interface ActivityEntry {
  id: string
  type: ActivityType
  title: string
  user: string
  date: string
  time: string
  timeAgo: string
  before?: string
  after?: string
}

const ACTIVITIES_BY_JOB: Record<string, ActivityEntry[]> = {
  // Cash Accounts Daily Matching — 4 tasks, rich history
  '1': [
    {
      id: 'a1-7',
      type: 'cadence_changed',
      title: 'Changed job cadence',
      user: 'Grant Atherholt',
      date: 'Apr 12, 2026',
      time: '3:42 PM',
      timeAgo: '8d ago',
      before: 'Every 4 hours',
      after: 'Every hour',
    },
    {
      id: 'a1-6',
      type: 'task_added',
      title: 'Added task',
      user: 'Grant Atherholt',
      date: 'Apr 10, 2026',
      time: '10:18 AM',
      timeAgo: '10d ago',
      after: 'Account Mapper',
    },
    {
      id: 'a1-5',
      type: 'dependency_changed',
      title: 'Reordered tasks',
      user: 'Minnie Newman',
      date: 'Mar 28, 2026',
      time: '2:05 PM',
      timeAgo: '23d ago',
      before: 'Apply Rules → Sync All',
      after: 'Sync All → Apply Rules',
    },
    {
      id: 'a1-4',
      type: 'task_added',
      title: 'Added task',
      user: 'Minnie Newman',
      date: 'Mar 20, 2026',
      time: '11:30 AM',
      timeAgo: '31d ago',
      after: 'Variance Detector',
    },
    {
      id: 'a1-3',
      type: 'task_added',
      title: 'Added task',
      user: 'Grant Atherholt',
      date: 'Mar 14, 2026',
      time: '9:12 AM',
      timeAgo: '37d ago',
      after: 'Apply Rules',
    },
    {
      id: 'a1-2',
      type: 'task_added',
      title: 'Added task',
      user: 'Grant Atherholt',
      date: 'Mar 14, 2026',
      time: '9:08 AM',
      timeAgo: '37d ago',
      after: 'Sync All',
    },
    {
      id: 'a1-1',
      type: 'created',
      title: 'Created job',
      user: 'Grant Atherholt',
      date: 'Mar 14, 2026',
      time: '9:00 AM',
      timeAgo: '37d ago',
    },
  ],

  // Revenue Recognition Reclass — 1 task, simple history
  '2': [
    {
      id: 'a2-3',
      type: 'agent_changed',
      title: 'Changed agent',
      user: 'Aaron Tang',
      date: 'Apr 8, 2026',
      time: '4:22 PM',
      timeAgo: '12d ago',
      before: 'Allocation Engine',
      after: 'Period Allocator',
    },
    {
      id: 'a2-2',
      type: 'task_added',
      title: 'Added task',
      user: 'Aaron Tang',
      date: 'Mar 2, 2026',
      time: '1:45 PM',
      timeAgo: '49d ago',
      after: 'Period Allocator',
    },
    {
      id: 'a2-1',
      type: 'created',
      title: 'Created job',
      user: 'Aaron Tang',
      date: 'Mar 2, 2026',
      time: '1:40 PM',
      timeAgo: '49d ago',
    },
  ],

  // AP Aging Reconciliation — 6 tasks
  '3': [
    {
      id: 'a3-4',
      type: 'task_added',
      title: 'Added task',
      user: 'Rebecca Choi',
      date: 'Apr 5, 2026',
      time: '11:10 AM',
      timeAgo: '15d ago',
      after: 'Variance Detector',
    },
    {
      id: 'a3-3',
      type: 'dependency_changed',
      title: 'Reordered tasks',
      user: 'Rebecca Choi',
      date: 'Mar 30, 2026',
      time: '10:02 AM',
      timeAgo: '21d ago',
      before: 'Apply Rules → Sync All',
      after: 'Sync All → Apply Rules',
    },
    {
      id: 'a3-2',
      type: 'cadence_changed',
      title: 'Changed job cadence',
      user: 'Rebecca Choi',
      date: 'Feb 22, 2026',
      time: '3:15 PM',
      timeAgo: '57d ago',
      before: 'Daily at 6:00 AM',
      after: 'Weekly on Mon at 7:00 AM',
    },
    {
      id: 'a3-1',
      type: 'created',
      title: 'Created job',
      user: 'Rebecca Choi',
      date: 'Feb 15, 2026',
      time: '9:30 AM',
      timeAgo: '64d ago',
    },
  ],

  // Intercompany Eliminations — 3 tasks
  '4': [
    {
      id: 'a4-3',
      type: 'task_removed',
      title: 'Removed task',
      user: 'Minnie Newman',
      date: 'Apr 2, 2026',
      time: '2:45 PM',
      timeAgo: '18d ago',
      before: 'Legacy IC validation',
    },
    {
      id: 'a4-2',
      type: 'renamed',
      title: 'Renamed job',
      user: 'Minnie Newman',
      date: 'Mar 18, 2026',
      time: '10:30 AM',
      timeAgo: '33d ago',
      before: 'IC Eliminations',
      after: 'Intercompany Eliminations',
    },
    {
      id: 'a4-1',
      type: 'created',
      title: 'Created job',
      user: 'Minnie Newman',
      date: 'Feb 1, 2026',
      time: '8:15 AM',
      timeAgo: '78d ago',
    },
  ],

  // Multi-Currency FX Sync — 1 task
  '5': [
    {
      id: 'a5-2',
      type: 'disabled',
      title: 'Disabled job',
      user: 'Aaron Tang',
      date: 'Apr 3, 2026',
      time: '5:00 PM',
      timeAgo: '17d ago',
    },
    {
      id: 'a5-1',
      type: 'created',
      title: 'Created job',
      user: 'Aaron Tang',
      date: 'Jan 28, 2026',
      time: '11:00 AM',
      timeAgo: '82d ago',
    },
  ],

  // Bank Reconciliation Sweep — 5 tasks
  '6': [
    {
      id: 'a6-3',
      type: 'enabled',
      title: 'Enabled job',
      user: 'Grant Atherholt',
      date: 'Apr 3, 2026',
      time: '8:00 AM',
      timeAgo: '17d ago',
    },
    {
      id: 'a6-2',
      type: 'cadence_changed',
      title: 'Changed job cadence',
      user: 'Grant Atherholt',
      date: 'Mar 10, 2026',
      time: '2:20 PM',
      timeAgo: '41d ago',
      before: 'Daily at 6:00 AM',
      after: 'Every 4 hours',
    },
    {
      id: 'a6-1',
      type: 'created',
      title: 'Created job',
      user: 'Grant Atherholt',
      date: 'Jan 20, 2026',
      time: '10:00 AM',
      timeAgo: '90d ago',
    },
  ],

  // Sales Tax Allocations — 2 tasks
  '7': [
    {
      id: 'a7-2',
      type: 'task_added',
      title: 'Added task',
      user: 'Rebecca Choi',
      date: 'Apr 1, 2026',
      time: '9:45 AM',
      timeAgo: '19d ago',
      after: 'Apply Rules',
    },
    {
      id: 'a7-1',
      type: 'created',
      title: 'Created job',
      user: 'Rebecca Choi',
      date: 'Mar 5, 2026',
      time: '1:00 PM',
      timeAgo: '46d ago',
    },
  ],
}

function EventIcon({ type, size = 14 }: { type: ActivityType; size?: number }) {
  // Brand green for created; neutral for everything else, with red for removals.
  const NEUTRAL = '#424867'
  const BRAND = '#1fac76' // --flo-sem-color-success / brand-600
  const DANGER = '#d92d20'

  switch (type) {
    case 'created':
      return <AddCircle size={size} color={BRAND} />
    case 'task_added':
      return <Add size={size} color={NEUTRAL} />
    case 'task_removed':
      return <Remove size={size} color={DANGER} />
    case 'dependency_changed':
      return <SwapVert size={size} color={NEUTRAL} />
    case 'cadence_changed':
      return <JobIcon size={size} color={NEUTRAL} />
    case 'agent_changed':
      return <Person size={size} color={NEUTRAL} />
    case 'renamed':
      return <Edit size={size} color={NEUTRAL} />
    case 'enabled':
      return <ToggleOn size={size} color={BRAND} />
    case 'disabled':
      return <ToggleOff size={size} color={NEUTRAL} />
  }
}

function ChangeDetail({ before, after }: { before?: string; after?: string }) {
  if (!before && !after) return null
  if (before && after) {
    return (
      <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[12px] text-[#424867]">
        <span className="px-1.5 py-0.5 rounded-sm bg-[#f8fafc] border border-[#e1e6ef] text-[#6b7280] line-through">
          {before}
        </span>
        <ArrowForward size={12} color="#adb2bb" />
        <span className="px-1.5 py-0.5 rounded-sm bg-[#f8fafc] border border-[#e1e6ef] text-[#1d2433]">
          {after}
        </span>
      </div>
    )
  }
  // Add-only or remove-only — just show the single value.
  const value = after ?? before
  return (
    <div className="mt-1 text-[12px] text-[#424867]">
      <span className="px-1.5 py-0.5 rounded-sm bg-[#f8fafc] border border-[#e1e6ef] text-[#1d2433]">
        {value}
      </span>
    </div>
  )
}

function ActivityRow({ entry, isLast }: { entry: ActivityEntry; isLast: boolean }) {
  return (
    <div className="flex">
      {/* Timeline rail */}
      <div className="relative w-[30px] shrink-0">
        <div className="absolute left-[10px] top-0 w-[2px] h-[6px] bg-[#e1e6ef]" />
        <div className="absolute left-[3px] top-[3px] w-[16px] h-[16px] rounded-full border-2 border-[#cbd2e1] bg-white flex items-center justify-center">
          <EventIcon type={entry.type} size={10} />
        </div>
        {!isLast && (
          <div className="absolute left-[10px] top-[20px] bottom-0 w-[2px] bg-[#e1e6ef]" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-6 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[14px] font-semibold text-[#1d2433]">{entry.title}</span>
          <span className="text-[12px] text-[#6b7280] shrink-0">{entry.timeAgo}</span>
        </div>

        <ChangeDetail before={entry.before} after={entry.after} />

        <div className="flex items-center gap-2 mt-2 text-[12px] text-[#424867]">
          <Person size={12} color="#6b7280" />
          <span>{entry.user}</span>
          <span className="text-[#cbd2e1]">·</span>
          <CalendarToday size={11} color="#6b7280" />
          <span>
            {entry.date} at {entry.time}
          </span>
        </div>
      </div>
    </div>
  )
}

interface ActivityLogTimelineProps {
  jobId?: string
}

export function ActivityLogTimeline({ jobId }: ActivityLogTimelineProps) {
  const entries = jobId ? ACTIVITIES_BY_JOB[jobId] : undefined

  if (!entries || entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-[14px] text-[#6b7280]">
        No activity recorded yet.
      </div>
    )
  }

  return (
    <div className="pt-5">
      {entries.map((entry, i) => (
        <ActivityRow key={entry.id} entry={entry} isLast={i === entries.length - 1} />
      ))}
    </div>
  )
}
