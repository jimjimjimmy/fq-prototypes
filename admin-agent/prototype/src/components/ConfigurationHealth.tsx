/**
 * ConfigurationHealth — a "Configuration Health" summary card for the Overview
 * surface. Each admin configuration area is shown as a bold circular score
 * gauge, color-coded green / amber / red, with its status badge beneath.
 *
 * Design-system grounding (researched before building):
 *  - FlowUI Status Badge / Status Icons (Storybook): semantic tint + icon
 *    prefixed before text; icons are color-locked (check-circle = success,
 *    report-problem/Warning = warning, error = danger).
 *  - Accessibility (Carbon / Koru): status is conveyed by color + number +
 *    icon + text label — never color alone (red/green colorblindness).
 *  - Semantic tokens (knowledge/design-system/foundation/colors.md):
 *      success  arc #1FAC76 / tint #ECFFF8 / fg #186749
 *      warning  arc #DB7712 / tint #FFF8EB / fg #A55503
 *      danger   arc #D24747 / tint #FEF1F2 / fg #981B25
 *  - Gauge visual (radial progress with rounded cap + gradient arc) is modeled
 *    on the score-ring reference; track uses neutral #f1f3f9.
 */
// @ts-ignore — FlowUI is a JS package; skipLibCheck covers node_modules
import CheckCircle from '@floqastinc/flow-ui_icons/material/CheckCircle'
// @ts-ignore
import Warning from '@floqastinc/flow-ui_icons/material/Warning'
// @ts-ignore
import Error from '@floqastinc/flow-ui_icons/material/Error'

type HealthStatus = 'healthy' | 'attention' | 'action'

type IconComponent = React.ComponentType<{ size?: number; color?: string }>

const STATUS: Record<
  HealthStatus,
  { label: string; tint: string; fg: string; arc: [string, string]; Icon: IconComponent }
> = {
  // arc = [lighter, saturated] gradient stops, matching the score-ring reference.
  healthy: { label: 'Healthy', tint: '#ECFFF8', fg: '#186749', arc: ['#68D1A9', '#1FAC76'], Icon: CheckCircle },
  attention: { label: 'Needs Attention', tint: '#FFF8EB', fg: '#A55503', arc: ['#F3B765', '#DB7712'], Icon: Warning },
  action: { label: 'Action Required', tint: '#FEF1F2', fg: '#981B25', arc: ['#E78B8B', '#D24747'], Icon: Error },
}

/** FlowUI Status Badge: tint + semantic icon prefixed before the label. */
function StatusBadge({ status }: { status: HealthStatus }) {
  const { label, tint, fg, Icon } = STATUS[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 h-6 px-2 rounded-[6px] text-[12px] font-semibold"
      style={{ backgroundColor: tint, color: fg }}
    >
      <Icon size={14} color={fg} />
      {label}
    </span>
  )
}

/** Radial score gauge — bold centered number with a gradient progress arc. */
function ScoreGauge({ score, status }: { score: number; status: HealthStatus }) {
  const { arc } = STATUS[status]
  const size = 132
  const stroke = 12
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  const filled = (Math.max(0, Math.min(100, score)) / 100) * circumference
  const gradientId = `gauge-grad-${status}`

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={arc[0]} />
            <stop offset="100%" stopColor={arc[1]} />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f3f9" strokeWidth={stroke} />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[34px] font-bold leading-none text-[#1d2433] tabular-nums">{score}</span>
      </div>
    </div>
  )
}

// First three map to the assistant accordions below; Data & Connections is an
// additional health area.
const AREAS: { label: string; status: HealthStatus; score: number }[] = [
  { label: 'Users & Roles', status: 'healthy', score: 88 },
  { label: 'Close', status: 'action', score: 32 },
  { label: 'Workflows & Entities', status: 'attention', score: 64 },
  { label: 'Data & Connections', status: 'healthy', score: 100 },
]

export function ConfigurationHealth() {
  return (
    <section className="rounded-[6px] border border-[#e1e6ef] bg-white p-6">
      <h2 className="text-[16px] font-semibold leading-6 text-[#1d2433]">Configuration Health</h2>

      <div className="mt-6 grid grid-cols-4 gap-6">
        {AREAS.map((area) => (
          <div key={area.label} className="flex flex-col items-center gap-3 text-center">
            <ScoreGauge score={area.score} status={area.status} />
            <span className="text-[14px] font-semibold text-[#1d2433]">{area.label}</span>
            <StatusBadge status={area.status} />
          </div>
        ))}
      </div>
    </section>
  )
}
