import { useState } from 'react'
import { AutopilotAppShell } from './components/AutopilotAppShell'
import { JobPageHeader } from './components/JobPageHeader'
import { JobsTable, type Job } from './components/JobsTable'
import {
  CreateJobDrawer,
  type JobConfig,
} from './components/CreateJobDrawer'
import { JobDetailsDrawer } from './components/JobDetailsDrawer'
import { JobDetailPage } from './components/JobDetailPage'
import { getSampleTasksForJob } from './data/sampleTasks'
import type { Task } from './components/TasksTable'
import { useVersion } from './version/VersionContext'
import { EventBasedApp } from './components/event-based/EventBasedApp'

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
    repeats,
    runTime: '06:00',
    timezone: 'America/New_York',
    initialRunDate: '',
    runBasis: '',
  }
}

function OneToManyApp() {
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
          <JobPageHeader onCreateClick={() => setDrawer({ kind: 'create' })} />
          <div className="flex-1 min-h-0 flex flex-col px-8 py-6">
            <JobsTable
              onRowClick={(row) => setSelectedRow(row)}
              onEdit={handleRowEdit}
              onRunNow={() => {}}
              onDelete={() => {}}
            />
          </div>
        </>
      ) : (
        <JobDetailPage
          config={view.config}
          initialTasks={view.initialTasks}
          onBack={() => setView({ kind: 'list' })}
          onEditJob={() => setDrawer({ kind: 'edit' })}
        />
      )}

      <CreateJobDrawer
        open={drawer.kind !== 'closed'}
        onClose={() => setDrawer({ kind: 'closed' })}
        onSave={handleSave}
        initialValues={
          drawer.kind === 'edit' && view.kind === 'detail' ? view.config : undefined
        }
      />

      <JobDetailsDrawer
        job={selectedRow}
        onClose={() => setSelectedRow(null)}
        onEdit={handleRowEdit}
        onDelete={() => setSelectedRow(null)}
        onRunNow={() => setSelectedRow(null)}
      />
    </AutopilotAppShell>
  )
}

/**
 * Entry point. Swaps the entire app between Autopilot versions based on the
 * active version in VersionContext (driven by the floating PrototypeController).
 * This is the canonical component-swap pattern — branch at the top, keep each
 * version's tree fully self-contained below it.
 */
export default function App() {
  const { version } = useVersion()
  return version === 'event-based' ? <EventBasedApp /> : <OneToManyApp />
}
