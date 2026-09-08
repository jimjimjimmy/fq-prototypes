// @ts-ignore — FlowUI core is JS; skipLibCheck covers node_modules
import SideDrawer from '@floqastinc/flow-ui_core/SideDrawer'
// @ts-ignore
import Button from '@floqastinc/flow-ui_core/Button'
// @ts-ignore
import StatusBadge from '@floqastinc/flow-ui_core/StatusBadge'
// @ts-ignore
import TabGroup from '@floqastinc/flow-ui_core/TabGroup'
// @ts-ignore
import Tab from '@floqastinc/flow-ui_core/Tab'
// @ts-ignore
import Close from '@floqastinc/flow-ui_icons/material/Close'
import type { Job } from './JobsTable'
import { RunHistoryTimeline } from './RunHistoryTimeline'
import { ActivityLogTimeline } from './ActivityLogTimeline'
import { JobTasksAccordion } from './JobTasksAccordion'

interface JobDetailsDrawerProps {
  job: Job | null
  onClose: () => void
  onEdit: (job: Job) => void
  onDelete: (job: Job) => void
  onRunNow: (job: Job) => void
}

const STATUS_COLOR: Record<
  Job['status'],
  'neutral' | 'info' | 'success' | 'warning' | 'danger'
> = {
  Running: 'info',
  Completed: 'success',
  'Completed with Issues': 'warning',
  Failed: 'danger',
  Disabled: 'neutral',
  Scheduled: 'neutral',
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[12px] text-[#6b7280]">{label}</span>
      <div className="text-[14px] font-semibold text-[#1d2433]">{value}</div>
    </div>
  )
}

export function JobDetailsDrawer({
  job,
  onClose,
  onEdit,
  onDelete,
  onRunNow,
}: JobDetailsDrawerProps) {
  const isOpen = job !== null

  return (
    <SideDrawer show={isOpen} onCancel={onClose} width="md">
      <SideDrawer.Header>
        <SideDrawer.Title>{job?.name ?? ''}</SideDrawer.Title>
        <SideDrawer.TopRight>
          <div className="flex items-center gap-2">
            <Button
              color="secondary"
              variant="outlined"
              size="sm"
              onClick={() => job && onEdit(job)}
            >
              Edit
            </Button>
            <button
              onClick={onClose}
              aria-label="Close"
              className="flex items-center justify-center w-6 h-6 text-[#424867] hover:text-[#1d2433]"
            >
              <Close size={20} />
            </button>
          </div>
        </SideDrawer.TopRight>
      </SideDrawer.Header>

      <SideDrawer.Body>
        {/* Persistent details */}
        {job && (
          <>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-5 pb-5 border-b border-[#e1e6ef]">
              <DetailRow
                label="Status"
                value={
                  <StatusBadge color={STATUS_COLOR[job.status]} size="sm">
                    {job.status}
                  </StatusBadge>
                }
              />
              <DetailRow label="Job" value={job.job} />
              <DetailRow label="Last Run" value={job.lastRun} />
              <DetailRow label="Next Run" value={job.nextRun} />
            </div>
            <JobTasksAccordion jobId={job.id} />
          </>
        )}

        {/* Tabs */}
        <TabGroup
          defaultValue="history"
          styleOverrides={{
            root: { display: 'flex', flexDirection: 'column', height: 'auto' },
            list: {
              height: 'auto',
              flexShrink: 0,
              borderBottom: '1px solid var(--flo-sem-color-border)',
              marginTop: '16px',
            },
          }}
        >
          <Tab tabId="history" title="Run History">
            <RunHistoryTimeline />
          </Tab>

          <Tab tabId="activity" title="Activity Log">
            <ActivityLogTimeline jobId={job?.id} />
          </Tab>
        </TabGroup>
      </SideDrawer.Body>

      <SideDrawer.Footer>
        <div className="flex justify-between items-center w-full">
          <Button
            color="danger"
            variant="outlined"
            size="md"
            onClick={() => job && onDelete(job)}
          >
            Delete
          </Button>
          <Button
            color="primary"
            variant="filled"
            size="md"
            onClick={() => job && onRunNow(job)}
          >
            Run Now
          </Button>
        </div>
      </SideDrawer.Footer>
    </SideDrawer>
  )
}
