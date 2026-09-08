import { useMemo, type ReactNode } from 'react'
import { AlertTriangle, ShieldCheck, ClipboardCheck, ArrowRight, Plus } from 'lucide-react'
import {
  CAPABILITIES, CONTROL_LIBRARY, DEFAULT_RISKS,
  type Capability, type Control, type Risk, type ControlFrequency,
} from '../data/risks-controls'

// One row of the matrix represents a single (capability, risk, control) triple.
// Capability and Risk cells use rowspan to merge over their respective groups.
type MatrixRow = {
  capability: Capability
  risk: Risk
  control: Control
  isFirstOfCap: boolean
  isFirstOfRisk: boolean
  capRowspan: number
  riskRowspan: number
}

export function AICapabilities() {
  const rows = useMemo<MatrixRow[]>(() => {
    const out: MatrixRow[] = []
    for (const capability of CAPABILITIES) {
      const risks = DEFAULT_RISKS[capability.id] ?? []
      const capRowspan = risks.reduce((sum, r) => sum + r.controlIds.length, 0)
      let isFirstOfCap = true
      for (const risk of risks) {
        const riskRowspan = risk.controlIds.length
        let isFirstOfRisk = true
        for (const cid of risk.controlIds) {
          const control = CONTROL_LIBRARY[cid]
          if (!control) continue
          out.push({
            capability,
            risk,
            control,
            isFirstOfCap,
            isFirstOfRisk,
            capRowspan,
            riskRowspan,
          })
          isFirstOfCap = false
          isFirstOfRisk = false
        }
      }
    }
    return out
  }, [])

  return (
    <div className="px-10 py-8 max-w-[1400px]">
      {/* Page header + workflow explainer */}
      <section className="mb-10">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">AI Capabilities</h1>
        </header>

        <div className="flex items-center gap-1 text-xs font-semibold text-[#186749] mb-2 tracking-wider uppercase">
          <Plus size={12} strokeWidth={2.5} />
          How COSO AI RCM works
        </div>
        <p className="text-sm text-gray-500 max-w-3xl mb-6">
          These capabilities including risks and controls will be auto-applied when an agent is registered.
          You can customize each agent in Key Systems.
        </p>
        <div className="flex items-stretch gap-3">
          <PhaseCard
            icon={<AlertTriangle size={22} strokeWidth={2} />}
            title="Identify Risks"
            description="Surface process risks from your documents."
            role="Risk Owner"
          />
          <PhaseArrow />
          <PhaseCard
            icon={<ShieldCheck size={22} strokeWidth={2} />}
            title="Map Controls"
            description="Match the right controls to each risk."
            role="Control Owner"
          />
          <PhaseArrow />
          <PhaseCard
            icon={<ClipboardCheck size={22} strokeWidth={2} />}
            title="Test & Report"
            description="Validate effectiveness and share findings."
            role="Auditor"
          />
        </div>
      </section>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-gray-500 border-b border-gray-200 w-[18%]">
                Capability
              </th>
              <th className="text-left px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-gray-500 border-b border-gray-200 w-[22%]">
                Risk
              </th>
              <th className="text-left px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-gray-500 border-b border-gray-200 w-[10%]">
                Control ID
              </th>
              <th className="text-left px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-gray-500 border-b border-gray-200">
                Control
              </th>
              <th className="text-left px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-gray-500 border-b border-gray-200 w-[10%]">
                Frequency
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.isFirstOfCap && (
                  <td
                    rowSpan={row.capRowspan}
                    className="align-top px-5 py-4 border-b border-r border-gray-200"
                  >
                    <div className="text-sm font-semibold text-gray-900 leading-snug">
                      {row.capability.label}
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed mt-1.5">
                      {row.capability.description}
                    </p>
                  </td>
                )}
                {row.isFirstOfRisk && (
                  <td
                    rowSpan={row.riskRowspan}
                    className="align-top px-5 py-4 border-b border-r border-gray-200"
                  >
                    <div className="text-[11px] font-mono text-gray-400">{row.risk.id}</div>
                    <div className="text-sm font-semibold text-gray-900 leading-snug mt-0.5">
                      {row.risk.title}
                    </div>
                  </td>
                )}
                <td className="align-top px-5 py-4 border-b border-gray-100">
                  <span className="text-[11px] font-mono text-gray-500">{row.control.id}</span>
                </td>
                <td className="align-top px-5 py-4 border-b border-gray-100">
                  <div className="text-sm font-semibold text-gray-900">{row.control.title}</div>
                  <p className="text-xs text-gray-500 leading-relaxed mt-1">
                    {row.control.description}
                  </p>
                </td>
                <td className="align-top px-5 py-4 border-b border-gray-100">
                  <FrequencyTag frequency={row.control.frequency} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const frequencyClass: Record<ControlFrequency, string> = {
  'Multiple times per day': 'bg-emerald-50 text-emerald-700',
  'Daily': 'bg-sky-50 text-sky-700',
  'Weekly': 'bg-cyan-50 text-cyan-700',
  'Every two weeks': 'bg-teal-50 text-teal-700',
  'Monthly': 'bg-amber-50 text-amber-700',
  'Quarterly': 'bg-orange-50 text-orange-700',
  'Annual': 'bg-violet-50 text-violet-700',
  'As needed': 'bg-gray-100 text-gray-600',
}

function FrequencyTag({ frequency }: { frequency: ControlFrequency }) {
  return (
    <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded ${frequencyClass[frequency]}`}>
      {frequency}
    </span>
  )
}

// ---- Explainer phase cards ----

function PhaseCard({
  icon, title, description, role,
}: {
  icon: ReactNode
  title: string
  description: string
  role: string
}) {
  return (
    <div className="flex-1 bg-gray-50 rounded-lg border border-gray-200 p-4 flex items-start gap-3">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0"
        style={{ background: '#186749' }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0 flex flex-col">
        <h3 className="text-sm font-semibold text-gray-900 leading-tight">{title}</h3>
        <p className="text-xs text-gray-600 mt-1 mb-2 flex-1">{description}</p>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full self-start">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {role}
        </span>
      </div>
    </div>
  )
}

function PhaseArrow() {
  return (
    <div className="flex items-center justify-center self-center shrink-0">
      <ArrowRight size={20} className="text-[#186749]" />
    </div>
  )
}
