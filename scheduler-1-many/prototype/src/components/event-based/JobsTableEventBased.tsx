import { useState } from 'react'
// @ts-ignore — FlowUI core is JS; skipLibCheck covers node_modules
import StatusBadge from '@floqastinc/flow-ui_core/StatusBadge'
// @ts-ignore
import Toggle from '@floqastinc/flow-ui_core/Toggle'
// @ts-ignore
import ArrowUpward from '@floqastinc/flow-ui_icons/material/ArrowUpward'
import { RowActionsMenuEventBased } from './RowActionsMenuEventBased'

type Status = 'Running' | 'Completed' | 'Completed with Issues' | 'Failed' | 'Disabled' | 'Scheduled'

export interface Job {
  id: string
  name: string
  status: Status
  tasks: number
  type: string
  agent: string
  job: string
  lastRun: string
  nextRun: string
  enabled: boolean
}

const INITIAL_JOBS: Job[] = [
  { id: '1', name: 'Cash Accounts Daily Matching',  status: 'Running',   tasks: 4, type: 'Mixed',           agent: '—',                          job: 'Every hour',                lastRun: '12m ago',  nextRun: 'Today at 2:00 PM',     enabled: true },
  { id: '2', name: 'Revenue Recognition Reclass',   status: 'Completed', tasks: 1, type: 'Transform Agent', agent: 'Period Allocator',           job: 'Daily at 6:00 AM',          lastRun: '3h ago',   nextRun: 'Tomorrow at 6:00 AM',  enabled: true },
  { id: '3', name: 'AP Aging Reconciliation',       status: 'Completed', tasks: 6, type: 'Mixed',           agent: '—',                          job: 'Weekly on Mon at 7:00...',  lastRun: '2d ago',   nextRun: 'Tomorrow at 6:00 AM',  enabled: true },
  { id: '4', name: 'Intercompany Eliminations',     status: 'Completed', tasks: 3, type: 'Mixed',           agent: '—',                          job: 'Daily at 6:00 AM',          lastRun: '4d ago',   nextRun: 'Apr 30 at 5:00 PM',    enabled: true },
  { id: '5', name: 'Multi-Currency FX Sync',        status: 'Completed', tasks: 1, type: 'Transform Agent', agent: 'Multi-Currency Converter',   job: 'Daily at 6:00 AM',          lastRun: 'Apr 3',    nextRun: 'Apr 30 at 5:00 PM',    enabled: true },
  { id: '6', name: 'Bank Reconciliation Sweep',     status: 'Completed', tasks: 5, type: 'Mixed',           agent: '—',                          job: 'Every 4 hours',             lastRun: 'Apr 3',    nextRun: 'Today at 8:00 PM',     enabled: true },
  { id: '7', name: 'Sales Tax Allocations',         status: 'Completed', tasks: 2, type: 'AI Matching',     agent: '—',                          job: 'Weekly on Mon at 7:00...',  lastRun: 'Apr 1',    nextRun: 'Apr 30 at 5:00 PM',    enabled: true },
]

const STATUS_COLOR: Record<Status, 'neutral' | 'info' | 'success' | 'warning' | 'danger'> = {
  Running: 'info',
  Completed: 'success',
  'Completed with Issues': 'warning',
  Failed: 'danger',
  Disabled: 'neutral',
  Scheduled: 'neutral',
}

function ColumnHeader({ label, sortable = true }: { label: string; sortable?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-1 px-3 py-2 text-[12px] font-semibold text-[#424867] uppercase tracking-wide select-none">
      <span>{label}</span>
      {sortable && (
        <ArrowUpward size={14} color="#adb2bb" />
      )}
    </div>
  )
}

interface JobsTableProps {
  onRowClick?: (job: Job) => void
  onEdit?: (job: Job) => void
  onRunNow?: (job: Job) => void
  onDelete?: (job: Job) => void
}

export function JobsTableEventBased({
  onRowClick,
  onEdit,
  onRunNow,
  onDelete,
}: JobsTableProps = {}) {
  const [rows, setRows] = useState<Job[]>(INITIAL_JOBS)

  const handleToggle = (id: string, nextEnabled: boolean) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              enabled: nextEnabled,
              status: nextEnabled ? 'Scheduled' : 'Disabled',
            }
          : r,
      ),
    )
  }

  return (
    <div className="flex-1 min-h-0 border border-[#e1e6ef] rounded-sm bg-white flex flex-col overflow-hidden">
      <div className="grid grid-cols-[2fr_1.2fr_1.2fr_1.5fr_1.2fr_1.5fr_72px_48px] border-b border-[#e1e6ef] bg-[#f8fafc]">
        <ColumnHeader label="Job Name" />
        <ColumnHeader label="Status" />
        <ColumnHeader label="Tasks" />
        <ColumnHeader label="Job" />
        <ColumnHeader label="Last Run" />
        <ColumnHeader label="Next Run" />
        <ColumnHeader label="Active" sortable={false} />
        <div />
      </div>

      <div className="flex-1 overflow-auto">
        {rows.map((row) => (
          <div
            key={row.id}
            role={onRowClick ? 'button' : undefined}
            tabIndex={onRowClick ? 0 : undefined}
            onClick={() => onRowClick?.(row)}
            onKeyDown={(e) => {
              if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault()
                onRowClick(row)
              }
            }}
            className="grid grid-cols-[2fr_1.2fr_1.2fr_1.5fr_1.2fr_1.5fr_72px_48px] border-b border-[#e1e6ef] hover:bg-[#f8fafc] items-center cursor-pointer"
          >
            <div className="px-3 py-2 text-[14px] text-[#1d2433] truncate">{row.name}</div>
            <div className="px-3 py-2">
              <StatusBadge color={STATUS_COLOR[row.status]} size="sm">
                {row.status}
              </StatusBadge>
            </div>
            <div className="px-3 py-2 text-[14px] text-[#1d2433]">{row.tasks}</div>
            <div className="px-3 py-2 text-[14px] text-[#1d2433] truncate">{row.job}</div>
            <div className="px-3 py-2 text-[14px] text-[#424867]">{row.lastRun}</div>
            <div className="px-3 py-2 text-[14px] text-[#424867]">{row.nextRun}</div>
            <div
              className="px-3 py-2 flex justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Toggle
                checked={row.enabled}
                size="sm"
                onChange={(next: boolean) => handleToggle(row.id, next)}
              />
            </div>
            <div
              className="px-2 py-2 flex justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <RowActionsMenuEventBased
                items={[
                  { label: 'Run Now', onSelect: () => onRunNow?.(row) },
                  { label: 'Edit', onSelect: () => onEdit?.(row) },
                  { label: 'Delete', onSelect: () => onDelete?.(row) },
                ]}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between px-4 py-2 border-t border-[#e1e6ef] text-[12px] text-[#424867] bg-[#f8fafc]">
        <span>Showing 25</span>
        <span>Page 1 of 1</span>
      </div>
    </div>
  )
}
