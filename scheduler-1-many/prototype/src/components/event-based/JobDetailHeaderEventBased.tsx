// @ts-ignore — FlowUI core is JS; skipLibCheck covers node_modules
import Button from '@floqastinc/flow-ui_core/Button'
// @ts-ignore
import ChevronLeft from '@floqastinc/flow-ui_icons/material/ChevronLeft'
// @ts-ignore
import Edit from '@floqastinc/flow-ui_icons/material/Edit'
import {
  type JobConfig,
  REPEAT_OPTIONS,
  TIME_OPTIONS,
  TIMEZONE_OPTIONS,
} from './CreateJobDrawerEventBased'

interface JobDetailHeaderProps {
  config: JobConfig
  onBack: () => void
  onEditJob: () => void
}

function buildSummary(config: JobConfig): string {
  const repeatsLabel = REPEAT_OPTIONS.find((o) => o.value === config.repeats)?.label
  const runTimeLabel = TIME_OPTIONS.find((o) => o.value === config.runTime)?.label
  const tzFull = TIMEZONE_OPTIONS.find((o) => o.value === config.timezone)?.label ?? ''
  // Prefer the short code in parens (e.g. "Eastern Time (ET)" → "ET")
  const tzShort = tzFull.match(/\(([^)]+)\)$/)?.[1]?.split('/')[0].trim() ?? tzFull.split(' ')[0]

  const n = config.entities.length
  const entityClause = n === 0 ? null : n === 1 ? '1 entity' : `${n} entities`
  const scope = entityClause ? ` across ${entityClause}` : ''

  if (config.repeats === 'ad-hoc') {
    return `Runs on demand${scope}.`
  }

  if (!repeatsLabel) {
    return 'Job not yet configured.'
  }

  const frequency = repeatsLabel.toLowerCase()
  const time = runTimeLabel ? ` at ${runTimeLabel}` : ''
  const tz = runTimeLabel && tzShort ? ` ${tzShort}` : ''
  return `Runs ${frequency}${time}${tz}${scope}.`
}

export function JobDetailHeaderEventBased({
  config,
  onBack,
  onEditJob,
}: JobDetailHeaderProps) {
  const summary = buildSummary(config)

  return (
    <div className="flex flex-col gap-1 px-8 pt-6 pb-4 shrink-0 border-b border-[#e1e6ef]">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-[12px] text-[#424867] hover:text-[#1d2433] mb-1 self-start"
      >
        <ChevronLeft size={14} />
        <span>Job</span>
      </button>
      <h1
        className="text-[#1d2433]"
        style={{
          fontFamily: "Museo_Sans, 'Museo Sans', sans-serif",
          fontSize: 26,
          fontWeight: 700,
          lineHeight: '32px',
          margin: 0,
        }}
      >
        {config.name}
      </h1>
      <div className="flex items-center gap-2 mt-0.5">
        <span className="text-[14px] text-[#424867] leading-[20px]">{summary}</span>
        <Button color="secondary" variant="ghost" size="sm" onClick={onEditJob}>
          <span className="flex items-center gap-1">
            <Edit size={14} />
            Edit
          </span>
        </Button>
      </div>
    </div>
  )
}
