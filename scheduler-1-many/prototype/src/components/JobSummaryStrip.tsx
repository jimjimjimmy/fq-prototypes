// @ts-ignore — FlowUI core is JS; skipLibCheck covers node_modules
import Button from '@floqastinc/flow-ui_core/Button'
// @ts-ignore
import Edit from '@floqastinc/flow-ui_icons/material/Edit'
import {
  type JobConfig,
  ENTITY_OPTIONS,
  REPEAT_OPTIONS,
  TIME_OPTIONS,
  TIMEZONE_OPTIONS,
} from './CreateJobDrawer'

interface JobSummaryStripProps {
  config: JobConfig
  onEdit: () => void
}

function scopeLabel(entities: string[]): string {
  if (entities.length === 0) return '—'
  if (entities.length === 1) {
    return ENTITY_OPTIONS.find((o) => o.value === entities[0])?.label ?? '1 entity'
  }
  return `${entities.length} entities`
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="text-[11px] font-semibold text-[#6b7280] uppercase tracking-wide">
        {label}
      </span>
      <span className="text-[14px] text-[#1d2433] truncate" title={value}>
        {value || '—'}
      </span>
    </div>
  )
}

export function JobSummaryStrip({ config, onEdit }: JobSummaryStripProps) {
  const repeats = REPEAT_OPTIONS.find((o) => o.value === config.repeats)?.label ?? '—'
  const runTime = TIME_OPTIONS.find((o) => o.value === config.runTime)?.label ?? '—'
  const timezone = TIMEZONE_OPTIONS.find((o) => o.value === config.timezone)?.label ?? '—'

  return (
    <div className="shrink-0 flex items-center gap-8 px-4 py-3 border border-[#e1e6ef] rounded-sm bg-white">
      <div className="flex-1 grid grid-cols-[1.4fr_1fr_1fr_1.4fr] gap-6 min-w-0">
        <Field label="Scope" value={scopeLabel(config.entities)} />
        <Field label="Repeats" value={repeats} />
        <Field label="Run Time" value={runTime} />
        <Field label="Timezone" value={timezone} />
      </div>
      <Button color="secondary" variant="ghost" size="sm" onClick={onEdit}>
        <span className="flex items-center gap-1">
          <Edit size={16} />
          Edit
        </span>
      </Button>
    </div>
  )
}
