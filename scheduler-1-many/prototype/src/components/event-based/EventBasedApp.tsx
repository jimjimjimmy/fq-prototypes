import { useState } from 'react'
// Shared chrome + data (NOT duplicated — kept consistent with the One-to-Many baseline)
import { AutopilotAppShell } from '../AutopilotAppShell'
import { getSampleTasksForJob } from '../../data/sampleTasks'
// Event Based view clones
import { JobPageHeaderEventBased } from './JobPageHeaderEventBased'
import { JobsTableEventBased, type Job } from './JobsTableEventBased'
import {
  CreateJobDrawerEventBased,
  type JobConfig,
} from './CreateJobDrawerEventBased'
import { JobDetailsDrawerEventBased } from './JobDetailsDrawerEventBased'
import { JobDetailPageEventBased } from './JobDetailPageEventBased'
import type { Task } from './TasksTableEventBased'

/**
 * Event Based version of the Autopilot app.
 *
 * Forked from the One-to-Many baseline (`App.tsx` → OneToManyApp) on 2026-06-09.
 * Currently an EXACT functional clone — same layout and logic — rendering the
 * duplicated `event-based/*` components. This is the workspace where the Event
 * Based concept will diverge; the One-to-Many baseline stays untouched.
 */

type View =
  | { kind: 'list' }
  | { kind: 'detail'; config: JobConfig; initialTasks: Task[] }
type DrawerMode = { kind: 'closed' } | { kind: 'create' } | { kind: 'edit' }

// Translate row-level sample data into a JobConfig so clicking a sample
// row's Edit can navigate to the detail page meaningfully. Best-effort only —
// sample rows don't carry full config, so we infer where we can.
function jobToConfig(row: Job): JobConfig {
  const lower = row.job.toLowerCase()
  let repeats = ''
  if (lower.includes('hour')) repeats = 'hourly'
  else if (lower.includes('daily')) repeats = 'daily'
  else if (lower.includes('weekly')) repeats = 'daily' // we removed Weekly; fall back to Daily
  else if (lower.includes('monthly')) repeats = 'monthly'
  else if (lower.includes('quarter')) repeats = 'quarterly'
  return {
    name: row.name,
    entities: [],
    triggerType: 'schedule',
    repeats,
    runTime: '06:00',
    timezone: 'America/New_York',
    initialRunDate: '',
    runBasis: '',
    triggerEvent: '',
    eventEntity: '',
    eventFolder: '',
    eventChecklistItem: '',
    eventPeriodStart: '',
    eventRepeats: '',
    filterAttribute: '',
    filterValue: '',
  }
}

export function EventBasedApp() {
  const [view, setView] = useState<View>({ kind: 'list' })
  const [drawer, setDrawer] = useState<DrawerMode>({ kind: 'closed' })
  const [selectedRow, setSelectedRow] = useState<Job | null>(null)

  const handleSave = (config: JobConfig) => {
    setDrawer({ kind: 'closed' })
    setView({ kind: 'detail', config, initialTasks: [] })
  }

  const handleRowEdit = (row: Job) => {
    setSelectedRow(null)
    setView({
      kind: 'detail',
      config: jobToConfig(row),
      initialTasks: getSampleTasksForJob(row.id),
    })
  }

  return (
    <AutopilotAppShell>
      {view.kind === 'list' ? (
        <>
          <JobPageHeaderEventBased onCreateClick={() => setDrawer({ kind: 'create' })} />
          <div className="flex-1 min-h-0 flex flex-col px-8 py-6">
            <JobsTableEventBased
              onRowClick={(row) => setSelectedRow(row)}
              onEdit={handleRowEdit}
              onRunNow={() => {}}
              onDelete={() => {}}
            />
          </div>
        </>
      ) : (
        <JobDetailPageEventBased
          config={view.config}
          initialTasks={view.initialTasks}
          onBack={() => setView({ kind: 'list' })}
          onEditJob={() => setDrawer({ kind: 'edit' })}
        />
      )}

      <CreateJobDrawerEventBased
        open={drawer.kind !== 'closed'}
        onClose={() => setDrawer({ kind: 'closed' })}
        onSave={handleSave}
        initialValues={
          drawer.kind === 'edit' && view.kind === 'detail' ? view.config : undefined
        }
      />

      <JobDetailsDrawerEventBased
        job={selectedRow}
        onClose={() => setSelectedRow(null)}
        onEdit={handleRowEdit}
        onDelete={() => setSelectedRow(null)}
        onRunNow={() => setSelectedRow(null)}
      />
    </AutopilotAppShell>
  )
}
