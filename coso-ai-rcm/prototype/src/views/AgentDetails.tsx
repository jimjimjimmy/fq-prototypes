import { useEffect, useMemo, useRef, useState } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import * as Dialog from '@radix-ui/react-dialog'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Tooltip from '@radix-ui/react-tooltip'
import anime from 'animejs'
import {
  ArrowRight, AlertCircle, MoreHorizontal, MoreVertical, Sparkles,
  ShieldCheck, FileText, Plus, X, GripVertical, Trash2, Check, Pencil,
  Download, Clipboard, ChevronRight, Layers,
} from 'lucide-react'
import { capabilityLabel, type Agent, type Reliance, type Health } from '../data/agents'
import {
  getAgentDetails, CAPABILITIES, CAPABILITY_LIBRARY, CONTROL_LIBRARY, DEFAULT_RISKS,
  type Severity, type ControlFrequency, type Enforcement,
  type Risk, type CapabilityId, type AgentDetails as AgentDetailsData,
  type DependencyItem, type DependencyStatus,
  type WorkflowStep, type WorkflowStepType, type RunRecord, type RunStatus, type AgentVersion,
} from '../data/risks-controls'
const relianceLabel: Record<Reliance, string> = {
  reliable: 'Reliable',
  'not-reliable': 'Not reliable',
  'out-of-scope': 'Out of scope',
}

const relianceClass: Record<Reliance, string> = {
  reliable: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'not-reliable': 'bg-red-50 text-red-700 border-red-200',
  'out-of-scope': 'bg-gray-100 text-gray-600 border-gray-200',
}

const healthDot: Record<Health, string> = {
  healthy: 'bg-emerald-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
}

const severityClass: Record<Severity, string> = {
  high: 'bg-red-50 text-red-700 border-red-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  low: 'bg-gray-100 text-gray-600 border-gray-200',
}

const frequencyClass: Record<ControlFrequency, string> = {
  'Multiple times per day': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Daily': 'bg-sky-50 text-sky-700 border-sky-200',
  'Weekly': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'Every two weeks': 'bg-teal-50 text-teal-700 border-teal-200',
  'Monthly': 'bg-amber-50 text-amber-700 border-amber-200',
  'Quarterly': 'bg-orange-50 text-orange-700 border-orange-200',
  'Annual': 'bg-violet-50 text-violet-700 border-violet-200',
  'As needed': 'bg-gray-100 text-gray-600 border-gray-200',
}

const enforcementIcon: Record<Enforcement, JSX.Element> = {
  'Automated in product': <Sparkles size={11} />,
  'Manual SOP': <FileText size={11} />,
  Hybrid: <ShieldCheck size={11} />,
}

const dependencyStatusClass: Record<DependencyStatus, string> = {
  'Not started': 'bg-gray-100 text-gray-600 border-gray-200',
  'In progress': 'bg-amber-50 text-amber-700 border-amber-200',
  'Ineffective': 'bg-red-50 text-red-700 border-red-200',
  'Effective': 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

type Props = {
  agentId: string
  agents: Agent[]
  onBack: () => void
}

export function AgentDetails({ agentId, agents, onBack }: Props) {
  const agent = agents.find(a => a.id === agentId)
  const details = useMemo(() => getAgentDetails(agentId), [agentId])

  // Custom risks the user adds during the session, keyed by capability
  const [customRisks, setCustomRisks] = useState<Record<CapabilityId, Risk[]>>({} as Record<CapabilityId, Risk[]>)
  const [activeTab, setActiveTab] = useState('overview')
  // Ref to the AI risk assessment panel — used to scroll past the inline alert
  // when navigating in via the KPI chip (or any other path to this tab)
  const riskPanelRef = useRef<HTMLDivElement>(null)

  function addCustomRisk(capability: CapabilityId, risk: Risk) {
    setCustomRisks((prev) => ({
      ...prev,
      [capability]: [...(prev[capability] ?? []), risk],
    }))
  }

  useEffect(() => {
    if (activeTab !== 'risk-assessment') return
    if (!riskPanelRef.current) return
    // Wait a frame for the tab content to mount before scrolling
    const id = requestAnimationFrame(() => {
      riskPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    return () => cancelAnimationFrame(id)
  }, [activeTab])

  if (!agent) return null

  const totalRiskCount = agent.capabilityIds.reduce(
    (sum, id) => sum + (details.defaultRisks[id]?.length ?? 0) + (customRisks[id]?.length ?? 0),
    0,
  )

  return (
    <div className="px-10 py-8 max-w-[1400px]">
      <header className="mb-6">
        <nav aria-label="Breadcrumb" className="text-xs font-medium mb-1 flex items-center gap-1">
          <span className="text-gray-400">Key Sources</span>
          <span className="text-gray-300">/</span>
          <button
            onClick={() => { onBack() }}
            className="text-gray-500 hover:text-indigo-700 hover:underline"
          >
            Key Systems
          </button>
          <span className="text-gray-300">/</span>
          <button
            onClick={() => { onBack() }}
            className="text-gray-500 hover:text-indigo-700 hover:underline"
          >
            AI agents
          </button>
        </nav>
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{agent.name}</h1>
            <p className="mt-1 text-sm text-gray-600 max-w-2xl">{agent.description}</p>
          </div>
          <button className="text-gray-400 hover:text-gray-700 p-1 rounded">
            <MoreHorizontal size={18} />
          </button>
        </div>

        {agent.openGaps > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
            <Stat label="Open gaps">
              <span className="inline-flex items-center gap-1 text-sm font-medium text-red-700">
                <AlertCircle size={14} />
                {agent.openGaps}
              </span>
            </Stat>
          </div>
        )}
      </header>

      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="flex items-center border-b border-gray-200 mb-6">
          <TabTrigger value="overview" label="Overview" />
          <TabTrigger value="risk-assessment" label="AI risk assessment" count={totalRiskCount} />
          <TabTrigger value="agent-overview" label="Agent Information" />
          <TabTrigger value="controls" label="Controls" count={details.controls.length} />
        </Tabs.List>

        <Tabs.Content value="overview" className="focus:outline-none">
          <OverviewPanel agent={agent} details={details} />
        </Tabs.Content>
        <Tabs.Content value="risk-assessment" className="focus:outline-none">
          {agent.isNewFromTransform && (
            <div className="mb-4">
              <NewAgentCallout />
            </div>
          )}
          {/* KPI strip moved from the Overview tab; ref here so navigation lands
              past the inline alert (if any) and lands at the chips + panel. */}
          <div ref={riskPanelRef} className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6 scroll-mt-6">
            <KPIChip
              label="Capabilities"
              value={String(details.capabilityIds.length)}
              tone="indigo"
            />
            <KPIChip
              label="Risks identified"
              value={String(totalRiskCount)}
              tone="amber"
            />
            <KPIChip
              label="Controls in place"
              value={String(details.controls.length)}
              tone="emerald"
              onClick={() => setActiveTab('controls')}
            />
          </div>
          <RiskAssessmentPanel
            agent={agent}
            agents={agents}
            details={details}
            customRisks={customRisks}
            onAddRisk={addCustomRisk}
          />
        </Tabs.Content>
        <Tabs.Content value="agent-overview" className="focus:outline-none">
          <AgentOverviewPanel agent={agent} details={details} />
        </Tabs.Content>
        <Tabs.Content value="controls" className="focus:outline-none">
          <ControlsPanel details={details} />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</div>
      {children}
    </div>
  )
}

function TabTrigger({ value, label, count, gapCount }: { value: string; label: string; count?: number; gapCount?: number }) {
  return (
    <Tabs.Trigger
      value={value}
      className="px-4 py-2.5 -mb-px text-sm font-medium text-gray-500 border-b-2 border-transparent transition-colors hover:text-gray-900 data-[state=active]:text-gray-900 data-[state=active]:border-[#186749] focus:outline-none flex items-center gap-2"
    >
      {label}
      {count !== undefined && (
        <span className="text-[11px] font-semibold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{count}</span>
      )}
      {gapCount !== undefined && gapCount > 0 && (
        <span className="text-[11px] font-semibold bg-red-50 text-red-700 px-1.5 py-0.5 rounded inline-flex items-center gap-0.5">
          <AlertCircle size={10} />
          {gapCount}
        </span>
      )}
    </Tabs.Trigger>
  )
}

// ---------- Overview tab ----------

function OverviewPanel({
  agent: _agent, details,
}: {
  agent: Agent
  details: AgentDetailsData
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const cards = ref.current.querySelectorAll('[data-anim-card]')
    if (document.hidden) {
      cards.forEach(c => { (c as HTMLElement).style.opacity = '1'; (c as HTMLElement).style.transform = 'none' })
      return
    }
    anime({ targets: cards, translateY: [12, 0], opacity: [0, 1], delay: anime.stagger(60), duration: 500, easing: 'easeOutExpo' })
  }, [])

  return (
    <div ref={ref} className="space-y-8">
      {/* Up next — at the top, surfaces the AI's prioritized work */}
      <UpNextCard items={details.upNext} />

      {/* Key System Details — full width */}
      <KeySystemDetailsCard agent={_agent} details={details} />

      {/* KPI strip moved to the AI risk assessment tab */}

      {/* Dependencies section */}
      <section>
        <SectionHeader
          title="Dependencies"
          description="Other key systems, reports, and agents this agent relies on or feeds into."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DependencyCard title="Dependent on" items={details.dependsOn} />
          <DependencyCard title="Depended on by" items={details.dependedOnBy} />
        </div>
      </section>
    </div>
  )
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500 mt-0.5">{description}</p>
    </div>
  )
}

// ---------- New-agent callout ----------

function NewAgentCallout() {
  return (
    <div
      data-anim-card
      className="flex items-start gap-3 p-4 rounded-lg border"
      style={{ background: '#fffbeb', borderColor: '#fde68a' }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: '#f59e0b', color: 'white' }}
      >
        <Sparkles size={16} />
      </div>
      <div className="flex-1">
        <div className="text-sm font-semibold text-amber-900">
          Just registered from Transform — risks &amp; controls await review
        </div>
        <p className="text-xs text-amber-800 leading-relaxed mt-0.5">
          FQ AI auto-generated a starter risk assessment from this agent&apos;s capabilities. Review the
          mapping, customize the controls if needed, and route to the control owner for acceptance.
        </p>
      </div>
    </div>
  )
}

// ---------- KPI strip ----------

type ChipTone = 'indigo' | 'amber' | 'emerald' | 'red'

function KPIChip({ label, value, onClick }: { label: string; value: string; tone?: ChipTone; onClick?: () => void }) {
  return (
    <button
      onClick={() => { onClick?.() }}
      className="group bg-white rounded-lg border border-gray-200 px-4 py-3 text-left hover:border-gray-300 hover:shadow-sm transition-all"
    >
      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider truncate">{label}</div>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-xl font-semibold text-gray-900 leading-none">{value}</span>
        <ArrowRight size={12} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </button>
  )
}

function passRateTone(tests: AgentDetailsData['tests']): ChipTone {
  if (tests.length === 0) return 'indigo'
  const pass = tests.filter(t => t.result === 'pass').length / tests.length
  if (pass >= 0.9) return 'emerald'
  if (pass >= 0.7) return 'amber'
  return 'red'
}

// ---------- Right column cards ----------

function KeySystemDetailsCard({
  agent, details,
}: { agent: Agent; details: AgentDetailsData }) {
  return (
    <section
      data-anim-card
      className="bg-white rounded-lg border border-gray-200 p-6 opacity-0"
      style={{ transform: 'translateY(12px)' as const }}
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-5">Key System Details</h2>

      {/* Agent metadata strip — 4-up row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-100">
        <DetailField
          label="Reliance"
          value={
            <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded border ${relianceClass[agent.reliance]}`}>
              {relianceLabel[agent.reliance]}
            </span>
          }
        />
        <DetailField
          label="Owner"
          value={
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-[10px] font-semibold flex items-center justify-center shrink-0">
                {agent.owner.initials}
              </div>
              <span className="text-sm text-gray-700 truncate">{agent.owner.name}</span>
            </div>
          }
        />
        <DetailField
          label="Capabilities"
          value={
            <div className="flex flex-wrap gap-1">
              {agent.capabilityIds.map((id) => (
                <span key={id} title={capabilityLabel(id)} className="inline-flex items-center text-[11px] font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                  {CAPABILITY_LIBRARY[id].shortLabel}
                </span>
              ))}
            </div>
          }
        />
        <DetailField label="Frequency" value={<span className="text-sm text-gray-700">{agent.frequency}</span>} />
      </div>

      {/* 2-column layout: left = structured fields, right = prose */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
        <DetailField label="Audit Project" value={<span className="text-sm text-gray-700">{details.keySystem.auditProject}</span>} />
        <DetailField label="Description" value={<p className="text-sm text-gray-700 leading-relaxed">{agent.description}</p>} />
        <DetailField
          label="Processes"
          value={
            <ul className="space-y-0.5">
              {details.keySystem.processes.map((p) => (
                <li key={p} className="text-sm text-indigo-700 hover:underline cursor-pointer">{p}</li>
              ))}
            </ul>
          }
        />
        <DetailField
          label="Additional Information"
          value={<p className="text-sm text-gray-700 leading-relaxed">{details.keySystem.additionalInformation}</p>}
        />
        <DetailField
          label="Key Reports Generated"
          value={
            <ul className="space-y-0.5">
              {details.keySystem.keyReports.map((r) => (
                <li key={r} className="text-sm text-indigo-700 hover:underline cursor-pointer">{r}</li>
              ))}
            </ul>
          }
        />
      </div>
    </section>
  )
}

function RecentRunsCard({
  agent, runs, embedded = false,
}: { agent: Agent; runs: AgentDetailsData['recentRuns']; embedded?: boolean }) {
  const wrapperClass = embedded
    ? 'border border-gray-200 rounded-lg p-4'
    : 'bg-white rounded-lg border border-gray-200 p-5 opacity-0'
  const wrapperStyle = embedded ? undefined : { transform: 'translateY(12px)' as const }
  return (
    <section
      data-anim-card={embedded ? undefined : true}
      className={wrapperClass}
      style={wrapperStyle}
    >
      <h2 className="text-sm font-semibold text-gray-900 mb-3">Recent runs</h2>
      <div className="grid grid-cols-2 gap-3 pb-3 mb-3 border-b border-gray-100">
        <div>
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Last run</div>
          <div className="text-sm text-gray-900">{agent.lastRun}</div>
        </div>
        <div>
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Health</div>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${healthDot[agent.health]}`} />
            <span className="text-sm text-gray-900 capitalize">{agent.health}</span>
          </div>
        </div>
      </div>
      <ul className="space-y-3">
        {runs.map((r) => (
          <li key={r.id} className="flex items-start gap-3">
            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
              r.status === 'success' ? 'bg-emerald-500' : r.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
            }`} />
            <div className="flex-1">
              <div className="text-sm text-gray-900">{r.summary}</div>
              <div className="text-xs text-gray-500 mt-0.5">{r.ranAt}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function UpNextCard({ items }: { items: AgentDetailsData['upNext'] }) {
  return (
    <section data-anim-card className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg p-5 text-white opacity-0" style={{ transform: 'translateY(12px)' }}>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={16} />
        <h2 className="text-sm font-semibold">Up next</h2>
      </div>
      <p className="text-xs text-indigo-100 mb-4">FQ AI surfaced these tasks for you, ordered by urgency.</p>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {items.map((t) => (
          <li key={t.id} className="bg-white/10 hover:bg-white/15 transition-colors rounded-lg p-3 cursor-pointer">
            <div className="flex items-start gap-2">
              <div className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${
                t.severity === 'urgent' ? 'bg-red-300' : t.severity === 'warning' ? 'bg-amber-300' : 'bg-indigo-200'
              }`} />
              <div className="flex-1">
                <div className="text-sm font-medium leading-snug">{t.title}</div>
                <div className="text-xs text-indigo-200 mt-0.5">{t.due}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function DetailField({
  label, value,
}: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{label}</dt>
      <dd className="text-sm text-gray-700">{value}</dd>
    </div>
  )
}

function DependencyCard({
  title, items, embedded = false,
}: { title: string; items: DependencyItem[]; embedded?: boolean }) {
  const wrapperClass = embedded
    ? 'border border-gray-200 rounded-lg overflow-hidden'
    : 'bg-white rounded-lg border border-gray-200 opacity-0'
  const wrapperStyle = embedded ? undefined : { transform: 'translateY(12px)' as const }
  return (
    <section
      data-anim-card={embedded ? undefined : true}
      className={wrapperClass}
      style={wrapperStyle}
    >
      <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        <button
          className="text-xs font-medium text-indigo-700 hover:text-indigo-800"
        >
          Edit
        </button>
      </div>
      <ul className="divide-y divide-gray-100">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-3 p-3 hover:bg-indigo-50/30 transition-colors cursor-pointer"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[11px] font-mono text-gray-400 shrink-0">{item.code}</span>
                <span className="text-sm font-medium text-gray-900">{item.title}</span>
              </div>
              <p className="text-xs text-gray-600 leading-snug">{item.description}</p>
            </div>
            <span className={`shrink-0 inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded border ${dependencyStatusClass[item.status]}`}>
              {item.status}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

// ---------- AI risk assessment tab ----------

function RiskAssessmentPanel({
  agent, agents, customRisks, onAddRisk,
}: {
  agent: Agent
  agents: Agent[]
  details: AgentDetailsData
  customRisks: Record<CapabilityId, Risk[]>
  onAddRisk: (capability: CapabilityId, risk: Risk) => void
}) {
  // Default selected capability: first one this agent uses; fallback to first overall
  const [selectedCapability, setSelectedCapability] = useState<CapabilityId>(
    agent.capabilityIds[0] ?? CAPABILITIES[0].id,
  )

  // Edit mode + per-session deletions for the lists. Declared before the memos
  // below so the deps arrays don't hit a temporal dead zone on first render.
  const [editingRisks, setEditingRisks] = useState(false)
  const [editingControls, setEditingControls] = useState(false)
  const [deletedRiskIds, setDeletedRiskIds] = useState<Set<string>>(new Set())
  const [deletedControlIds, setDeletedControlIds] = useState<Set<string>>(new Set())

  function deleteRisk(id: string) {
    setDeletedRiskIds((prev) => new Set(prev).add(id))
  }
  function deleteControl(id: string) {
    setDeletedControlIds((prev) => new Set(prev).add(id))
  }

  const risksForSelectedCap = useMemo(() => {
    const defaults = DEFAULT_RISKS[selectedCapability] ?? []
    const customs = customRisks[selectedCapability] ?? []
    return [...defaults, ...customs].filter((r) => !deletedRiskIds.has(r.id))
  }, [selectedCapability, customRisks, deletedRiskIds])

  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(
    risksForSelectedCap[0]?.id ?? null,
  )

  // When the selected capability changes (or its risk list changes), point at the first risk
  useEffect(() => {
    if (risksForSelectedCap.length === 0) {
      setSelectedRiskId(null)
      return
    }
    if (!risksForSelectedCap.find((r) => r.id === selectedRiskId)) {
      setSelectedRiskId(risksForSelectedCap[0].id)
    }
  }, [selectedCapability, risksForSelectedCap, selectedRiskId])

  const selectedRisk = risksForSelectedCap.find((r) => r.id === selectedRiskId) ?? null

  const controlsForSelectedRisk = useMemo(() => {
    if (!selectedRisk) return []
    return selectedRisk.controlIds
      .map((cid) => CONTROL_LIBRARY[cid])
      .filter(Boolean)
      .filter((c) => !deletedControlIds.has(c.id))
  }, [selectedRisk, deletedControlIds])

  // Global agent-count per capability (across all agents in the program)
  const agentCountByCapability = useMemo(() => {
    const counts = new Map<CapabilityId, number>()
    CAPABILITIES.forEach((c) => counts.set(c.id, 0))
    for (const a of agents) {
      for (const cid of a.capabilityIds) {
        counts.set(cid, (counts.get(cid) ?? 0) + 1)
      }
    }
    return counts
  }, [agents])

  return (
    <div className="grid grid-cols-3 border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* ---- Capabilities column ---- */}
      <div className="border-r border-gray-200 flex flex-col">
        <ColumnHeader title="Capabilities" subtitle={`${CAPABILITIES.length} types`} />
        <div className="flex-1">
          {CAPABILITIES.map((cap, i) => {
            const isSelected = cap.id === selectedCapability
            const numAgents = agentCountByCapability.get(cap.id) ?? 0
            const numRisks =
              (DEFAULT_RISKS[cap.id]?.length ?? 0) + (customRisks[cap.id]?.length ?? 0)
            return (
              <button
                key={cap.id}
                onClick={() => { setSelectedCapability(cap.id) }}
                className={`w-full text-left p-4 border-b border-gray-100 last:border-b-0 transition-colors ${
                  isSelected ? 'bg-emerald-50/50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-[11px] font-mono text-gray-400 mt-0.5 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`text-sm font-semibold leading-snug ${isSelected ? 'text-emerald-800' : 'text-gray-900'}`}>
                        {cap.label}
                      </h3>
                      <span className={`shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-medium border ${
                        isSelected
                          ? 'bg-white border-emerald-300 text-emerald-800'
                          : 'bg-white border-gray-200 text-gray-600'
                      }`}>
                        {numRisks}
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed mt-1 ${isSelected ? 'text-emerald-900/70' : 'text-gray-500'}`}>
                      {cap.description}
                    </p>
                    <div className="mt-2">
                      <span className="inline-flex items-center text-[10px] font-medium bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                        {numAgents} {numAgents === 1 ? 'agent' : 'agents'}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ---- Risks column ---- */}
      <div className="border-r border-gray-200 flex flex-col">
        <ColumnHeader
          title="Risks"
          subtitle={
            <>For <span className="font-medium text-gray-900">{CAPABILITY_LIBRARY[selectedCapability].label}</span></>
          }
          action={
            <div className="flex items-center gap-1">
              <AddRiskDialog capability={selectedCapability} onAdd={(risk) => onAddRisk(selectedCapability, risk)} />
              <ListKebabMenu
                kind="risks"
                isEditing={editingRisks}
                onToggleEdit={() => setEditingRisks((v) => !v)}
              />
            </div>
          }
        />
        <div className="flex-1">
          {risksForSelectedCap.map((risk) => {
            const isSelected = risk.id === selectedRiskId
            const content = (
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-semibold ${isSelected && !editingRisks ? 'text-emerald-800' : 'text-gray-900'}`}>
                  {risk.title}
                </h4>
                <div className="text-[11px] font-mono text-gray-400 mt-0.5">{risk.id}</div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <Tag tone={risk.isCustom ? 'violet' : 'indigo'}>
                    {risk.isCustom ? 'CUSTOM' : 'FQ DEFAULT'}
                  </Tag>
                  <Tag tone="gray">
                    {risk.controlIds.length} {risk.controlIds.length === 1 ? 'control' : 'controls'}
                  </Tag>
                </div>
              </div>
            )

            if (editingRisks) {
              return (
                <div
                  key={risk.id}
                  className="flex items-start gap-3 p-4 border-b border-gray-100 last:border-b-0"
                >
                  <button
                    aria-label="Drag to reorder"
                    className="text-gray-400 hover:text-gray-700 mt-0.5 cursor-grab active:cursor-grabbing"
                  >
                    <GripVertical size={16} />
                  </button>
                  {content}
                  <button
                    onClick={() => deleteRisk(risk.id)}
                    aria-label="Delete risk"
                    className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )
            }

            return (
              <button
                key={risk.id}
                onClick={() => { setSelectedRiskId(risk.id) }}
                className={`w-full text-left p-4 border-b border-gray-100 last:border-b-0 transition-colors ${
                  isSelected ? 'bg-emerald-50/50' : 'hover:bg-gray-50'
                }`}
              >
                {content}
              </button>
            )
          })}
        </div>
      </div>

      {/* ---- Mitigating controls column ---- */}
      <div className="flex flex-col">
        <ColumnHeader
          title="Mitigating controls"
          subtitle={
            selectedRisk
              ? <>Controls that mitigate <span className="font-medium text-gray-900">"{selectedRisk.title}"</span></>
              : 'Select a risk to see mitigating controls'
          }
          action={
            <div className="flex items-center gap-1">
              <button
                className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300"
              >
                <Plus size={12} />
                Map control
              </button>
              <ListKebabMenu
                kind="controls"
                isEditing={editingControls}
                onToggleEdit={() => setEditingControls((v) => !v)}
              />
            </div>
          }
        />
        <div className="flex-1">
          {selectedRisk && controlsForSelectedRisk.map((c) => {
            const content = (
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-[11px] font-mono text-gray-400 shrink-0">{c.id}</span>
                  <h4 className="text-sm font-semibold text-gray-900">{c.title}</h4>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mt-1">{c.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <Tag tone={frequencyTone[c.frequency]}>{c.frequency}</Tag>
                  <Tag tone="gray">{c.id.startsWith('C-GOV') ? 'Governance' : 'Agent-specific'}</Tag>
                  <Tag tone="indigo">FQ DEFAULT</Tag>
                </div>
              </div>
            )

            if (editingControls) {
              return (
                <div
                  key={c.id}
                  className="flex items-start gap-3 p-4 border-b border-gray-100 last:border-b-0"
                >
                  <button
                    aria-label="Drag to reorder"
                    className="text-gray-400 hover:text-gray-700 mt-0.5 cursor-grab active:cursor-grabbing"
                  >
                    <GripVertical size={16} />
                  </button>
                  {content}
                  <button
                    onClick={() => deleteControl(c.id)}
                    aria-label="Delete control"
                    className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )
            }

            return (
              <div key={c.id} className="p-4 border-b border-gray-100 last:border-b-0">
                {content}
              </div>
            )
          })}
          {(!selectedRisk || controlsForSelectedRisk.length === 0) && (
            <div className="p-6 text-center text-sm text-gray-500">
              No controls mapped yet for this risk.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ---- Helpers for the risk assessment 3-column layout ----

function ColumnHeader({
  title, subtitle, action,
}: {
  title: string
  subtitle?: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="px-5 py-4 border-b border-gray-200 flex items-start justify-between gap-3 min-h-[68px]">
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {subtitle && <div className="text-xs text-gray-500 mt-0.5 truncate">{subtitle}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

type TagTone = 'indigo' | 'violet' | 'gray' | 'sky' | 'amber' | 'emerald' | 'cyan' | 'teal' | 'orange'

const tagToneClass: Record<TagTone, string> = {
  indigo: 'bg-indigo-50 text-indigo-700',
  violet: 'bg-violet-50 text-violet-700',
  gray: 'bg-gray-100 text-gray-600',
  sky: 'bg-sky-50 text-sky-700',
  amber: 'bg-amber-50 text-amber-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  cyan: 'bg-cyan-50 text-cyan-700',
  teal: 'bg-teal-50 text-teal-700',
  orange: 'bg-orange-50 text-orange-700',
}

const frequencyTone: Record<ControlFrequency, TagTone> = {
  'Multiple times per day': 'emerald',
  'Daily': 'sky',
  'Weekly': 'cyan',
  'Every two weeks': 'teal',
  'Monthly': 'amber',
  'Quarterly': 'orange',
  'Annual': 'violet',
  'As needed': 'gray',
}

function Tag({ tone, children }: { tone: TagTone; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded ${tagToneClass[tone]}`}>
      {children}
    </span>
  )
}

function ListKebabMenu({
  kind, isEditing, onToggleEdit,
}: {
  kind: 'risks' | 'controls'
  isEditing: boolean
  onToggleEdit: () => void
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          aria-label={`More options for ${kind}`}
          className={`inline-flex items-center justify-center w-7 h-7 rounded-lg transition-colors ${
            isEditing
              ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <MoreVertical size={14} />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={4}
          className="min-w-[180px] bg-white rounded-lg shadow-lg border border-gray-200 p-1 z-50"
        >
          <DropdownMenu.Item
            onSelect={() => { onToggleEdit() }}
            className="flex items-center gap-2 px-2.5 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded cursor-pointer focus:outline-none focus:bg-gray-50"
          >
            {isEditing ? (
              <>
                <Check size={13} className="text-emerald-600" />
                Done editing
              </>
            ) : (
              <>
                <Pencil size={13} className="text-gray-500" />
                Edit {kind}
              </>
            )}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (e: React.MouseEvent) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={(e) => { e.stopPropagation(); onChange(e) }}
      className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${
        checked ? 'bg-emerald-500' : 'bg-gray-200'
      }`}
    >
      <div
        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
          checked ? 'translate-x-[18px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  )
}

// ---------- Add Risk dialog ----------

function AddRiskDialog({ capability, onAdd }: { capability: CapabilityId; onAdd: (risk: Risk) => void }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [severity, setSeverity] = useState<Severity>('medium')
  const [description, setDescription] = useState('')
  const [selectedControls, setSelectedControls] = useState<string[]>([])

  const allControls = useMemo(() => Object.values(CONTROL_LIBRARY), [])

  function reset() {
    setTitle('')
    setSeverity('medium')
    setDescription('')
    setSelectedControls([])
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    const id = `R-${capability}-CUSTOM-${Date.now().toString(36).slice(-4).toUpperCase()}`
    onAdd({ id, title: title.trim(), severity, description: description.trim() || '—', controlIds: selectedControls, isCustom: true })
    reset()
    setOpen(false)
  }

  function toggleControl(id: string) {
    setSelectedControls(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
  }

  return (
    <Dialog.Root open={open} onOpenChange={(o) => { setOpen(o); }}>
      <Dialog.Trigger asChild>
        <button className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300">
          <Plus size={12} />
          Add risk
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40" />
        <Dialog.Content className="fixed top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[560px] max-h-[85vh] overflow-y-auto bg-white rounded-lg shadow-2xl z-50 focus:outline-none">
          <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-3">
            <div>
              <Dialog.Title className="text-lg font-semibold text-gray-900">Add a custom risk</Dialog.Title>
              <Dialog.Description className="text-sm text-gray-500 mt-1">
                Adds to the {CAPABILITY_LIBRARY[capability].label} capability for this agent.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-700 p-1 rounded">
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Risk title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Threshold tampering by power user"
                required
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Severity</label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as Severity[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSeverity(s)}
                    className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wide rounded border transition-colors ${
                      severity === s ? severityClass[s] : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="What could go wrong?"
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1.5">
                Map to controls <span className="text-gray-400 font-normal">({selectedControls.length} selected)</span>
              </label>
              <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                {allControls.map((c) => (
                  <label key={c.id} className="flex items-start gap-2 p-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0">
                    <input
                      type="checkbox"
                      checked={selectedControls.includes(c.id)}
                      onChange={() => toggleControl(c.id)}
                      className="mt-0.5 accent-indigo-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">{c.title}</span>
                        <span className={`inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded border ${frequencyClass[c.frequency]}`}>
                          {c.frequency}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400 ml-auto">{c.id}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Dialog.Close asChild>
                <button type="button" className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={!title.trim()}
                className="px-3.5 py-1.5 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add risk
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

// ---------- Controls tab ----------

function ControlsPanel({ details }: { details: AgentDetailsData }) {
  // Index the agent's tests by control id so each row can show the most recent test status
  const testsByControl = useMemo(() => {
    const map = new Map<string, AgentDetailsData['tests']>()
    for (const t of details.tests) {
      const list = map.get(t.controlId) ?? []
      list.push(t)
      map.set(t.controlId, list)
    }
    return map
  }, [details.tests])

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <th className="text-left px-4 py-3 w-[8%]">ID</th>
            <th className="text-left px-4 py-3 w-[22%]">Control</th>
            <th className="text-left px-4 py-3 w-[12%]">Frequency</th>
            <th className="text-left px-4 py-3 w-[14%]">Enforcement</th>
            <th className="text-left px-4 py-3 w-[14%]">Owner</th>
            <th className="text-left px-4 py-3">Description</th>
            <th className="text-left px-4 py-3 w-[18%]">Test</th>
            <th className="px-4 py-3 w-[40px]"></th>
          </tr>
        </thead>
        <tbody>
          {details.controls.map((c) => {
            const tests = testsByControl.get(c.id) ?? []
            return (
              <tr key={c.id} className="border-b border-gray-100 last:border-b-0 hover:bg-indigo-50/30 transition-colors cursor-pointer">
                <td className="px-4 py-3.5 font-mono text-xs text-gray-500">{c.id}</td>
                <td className="px-4 py-3.5 font-medium text-gray-900">{c.title}</td>
                <td className="px-4 py-3.5">
                  <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded border ${frequencyClass[c.frequency]}`}>
                    {c.frequency}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center gap-1 text-xs text-gray-700">
                    {enforcementIcon[c.enforcement]}
                    {c.enforcement}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-[10px] font-semibold flex items-center justify-center">
                      {c.owner.initials}
                    </div>
                    <span className="text-gray-700">{c.owner.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-gray-600">{c.description}</td>
                <td className="px-4 py-3.5">
                  <ControlTestCell tests={tests} />
                </td>
                <td className="px-4 py-3.5">
                  <button onClick={(e) => { e.stopPropagation(); }} className="text-gray-400 hover:text-gray-700 p-1 rounded">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const testResultChipClass = {
  pass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  fail: 'bg-red-50 text-red-700 border-red-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
} as const

const testResultLabel = {
  pass: 'Pass',
  fail: 'Fail',
  pending: 'Pending',
} as const

function ControlTestCell({ tests }: { tests: AgentDetailsData['tests'] }) {
  if (tests.length === 0) {
    return <span className="text-xs text-gray-400">No test</span>
  }
  // Prefer the most recent failing test, then most recent test
  const failing = tests.find((t) => t.result === 'fail')
  const primary = failing ?? tests[0]
  const failCount = tests.filter((t) => t.result === 'fail').length

  return (
    <Tooltip.Provider delayDuration={150}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation() }}
            className="inline-flex items-center gap-1.5 cursor-pointer group"
          >
            <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded border transition-shadow group-hover:shadow-sm ${testResultChipClass[primary.result]}`}>
              {primary.result === 'pass' ? <Check size={11} /> : primary.result === 'fail' ? <AlertCircle size={11} /> : null}
              {testResultLabel[primary.result]}
            </span>
            {tests.length > 1 && (
              <span className="text-[11px] text-gray-500">
                +{tests.length - 1}
                {failCount > 1 ? ` · ${failCount} failing` : ''}
              </span>
            )}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            sideOffset={6}
            className="z-50 max-w-xs bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg leading-snug"
          >
            <div className="font-semibold mb-1">View test</div>
            <div className="text-gray-200">{primary.title}</div>
            <div className="text-gray-400 mt-1">{primary.cadence} · {primary.lastRun}</div>
            {primary.notes && <div className="text-gray-300 mt-1">{primary.notes}</div>}
            <Tooltip.Arrow className="fill-gray-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

// ---------- Agent Overview tab ----------

function AgentOverviewPanel({ agent, details }: { agent: Agent; details: AgentDetailsData }) {
  const [innerTab, setInnerTab] = useState('details')
  const [selectedRunId, setSelectedRunId] = useState<string | null>(
    details.runRecords[0]?.id ?? null
  )
  const initialVersionId = details.versions.find((v) => v.current)?.id ?? details.versions[0]?.id ?? ''
  const [selectedVersionId, setSelectedVersionId] = useState<string>(initialVersionId)
  const selectedVersion =
    details.versions.find((v) => v.id === selectedVersionId) ?? details.versions[0]

  return (
    // Fill the remaining viewport height (offset accounts for top toolbar + page padding + breadcrumb + outer tabs)
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-[calc(100vh-260px)] lg:min-h-[520px]">
      {/* Left: tabs container (Details / Run Records / Version History) */}
      <div className="lg:col-span-5 flex flex-col min-h-0">
        <Tabs.Root
          value={innerTab}
          onValueChange={setInnerTab}
          className="flex flex-col flex-1 min-h-0 bg-white rounded-lg border border-gray-200 overflow-hidden"
        >
          {/* Full-width 3-segment tab control fixed at top */}
          <Tabs.List className="grid grid-cols-3 border-b border-gray-200 shrink-0">
            <InnerTabTrigger value="details" label="Details" />
            <InnerTabTrigger value="run-records" label="Run Records" />
            <InnerTabTrigger value="version-history" label="Version History" />
          </Tabs.List>

          <Tabs.Content value="details" className="focus:outline-none flex-1 min-h-0 overflow-y-auto fq-scroll p-4 data-[state=inactive]:hidden">
            <AgentDetailsForm agent={agent} details={details} />
          </Tabs.Content>

          <Tabs.Content value="run-records" className="focus:outline-none flex-1 min-h-0 overflow-y-auto fq-scroll p-4 data-[state=inactive]:hidden">
            <div className="space-y-4">
              <RecentRunsCard agent={agent} runs={details.recentRuns} embedded />
              <ul className="space-y-3">
                {details.runRecords.map((run) => (
                  <RunListItem
                    key={run.id}
                    run={run}
                    isSelected={run.id === selectedRunId}
                    onSelect={() => setSelectedRunId(run.id === selectedRunId ? null : run.id)}
                  />
                ))}
              </ul>
            </div>
          </Tabs.Content>

          <Tabs.Content value="version-history" className="focus:outline-none flex-1 min-h-0 overflow-y-auto fq-scroll p-4 data-[state=inactive]:hidden">
            <VersionHistorySubTab details={details} />
          </Tabs.Content>
        </Tabs.Root>
      </div>

      {/* Right: workflow card — always visible regardless of active sub-tab */}
      <div className="lg:col-span-7 flex flex-col min-h-0">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col flex-1 min-h-0">
          <div className="flex items-start justify-between p-5 border-b border-gray-100 shrink-0">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Workflow</h3>
              <p className="text-xs text-gray-500 mt-0.5">Tap a block to view script.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 hidden md:block">Select a version to see the workflow</span>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 pl-2 pr-1 py-1 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  >
                    <Layers size={14} className="text-gray-600" />
                    <span className="inline-flex items-center text-xs font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                      {(selectedVersion?.version ?? 'v1.0').toUpperCase()}
                    </span>
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    align="end"
                    sideOffset={6}
                    className="z-50 min-w-[220px] bg-white rounded-lg border border-gray-200 shadow-lg py-1.5 focus:outline-none"
                  >
                    {details.versions.map((v) => {
                      const isSelected = v.id === selectedVersionId
                      return (
                        <DropdownMenu.Item
                          key={v.id}
                          onSelect={() => setSelectedVersionId(v.id)}
                          className="flex items-center justify-between gap-2 px-3 py-2 text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                        >
                          <span>Version {v.version.replace(/^v/i, '')}</span>
                          {isSelected && (
                            <span className="inline-flex items-center text-[11px] font-semibold text-white px-2 py-0.5 rounded" style={{ background: '#1fac76' }}>
                              Selected
                            </span>
                          )}
                        </DropdownMenu.Item>
                      )
                    })}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          </div>
          <div
            className="flex-1 min-h-0 overflow-y-auto fq-scroll p-6"
            style={{
              backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
              backgroundSize: '14px 14px',
              backgroundColor: '#fafafa',
            }}
          >
            <WorkflowDiagram steps={details.workflow} />
          </div>
        </div>
      </div>
    </div>
  )
}

function InnerTabTrigger({ value, label }: { value: string; label: string }) {
  return (
    <Tabs.Trigger
      value={value}
      className="px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 data-[state=active]:text-gray-900 data-[state=active]:bg-gray-50 focus:outline-none border-r border-gray-200 last:border-r-0"
    >
      {label}
    </Tabs.Trigger>
  )
}

// ----- Details sub-tab: read-only agent details -----

function AgentDetailsForm({ agent, details }: { agent: Agent; details: AgentDetailsData }) {
  return (
    <dl className="space-y-5">
      <ReadOnlyField label="Agent Name" value={agent.name} />
      <ReadOnlyField label="Description" value={agent.description} />
      <ReadOnlyField label="Entity" value={details.keySystem.auditProject} />
      <ReadOnlyField label="Additional Information" value={details.keySystem.additionalInformation} />
      <ReadOnlyField label="Human Review" value="Required — at least one human reviewer must approve each run." />
      <ReadOnlyField label="Modes" value="Formula processing disabled. Standard agent run mode." />
    </dl>
  )
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">{label}</dt>
      <dd className="text-base text-gray-900 leading-relaxed">{value}</dd>
    </div>
  )
}

function RunListItem({
  run, isSelected, onSelect,
}: { run: RunRecord; isSelected: boolean; onSelect: () => void }) {
  const hasArtifacts =
    (run.inputs?.length ?? 0) > 0 ||
    (run.outputs?.length ?? 0) > 0 ||
    !!run.humanReview
  return (
    <li
      className={`rounded-lg border transition-colors overflow-hidden ${
        isSelected
          ? 'border-indigo-300 bg-indigo-50/30'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <button
        onClick={onSelect}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-900">Run by {run.runBy.name}</span>
            <RunStatusBadge status={run.status} />
          </div>
          <div className="text-xs text-gray-500 mt-0.5">{run.ranAt}</div>
          <div className="text-[11px] font-mono text-gray-400 mt-0.5">{run.version}</div>
        </div>
        <ChevronRight size={16} className={`text-gray-400 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
      </button>
      {isSelected && hasArtifacts && (
        <div className="px-4 pb-4 pt-1 space-y-4 border-t border-indigo-100 bg-white">
          {run.inputs && run.inputs.length > 0 && (
            <ArtifactSection title="Inputs" artifacts={run.inputs} />
          )}
          {run.humanReview && <HumanInTheLoopSection review={run.humanReview} />}
          {run.outputs && run.outputs.length > 0 && (
            <ArtifactSection title="Outputs" artifacts={run.outputs} />
          )}
        </div>
      )}
    </li>
  )
}

const runStatusClass: Record<RunStatus, string> = {
  'In Progress': 'bg-indigo-50 text-indigo-700',
  'Completed': 'bg-emerald-50 text-emerald-700',
  'Failed': 'bg-red-50 text-red-700',
}

function RunStatusBadge({ status }: { status: RunStatus }) {
  return (
    <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded ${runStatusClass[status]}`}>
      {status}
    </span>
  )
}

function ArtifactSection({ title, artifacts }: { title: string; artifacts: { id: string; filename: string; description?: string }[] }) {
  const [copyToTestFile, setCopyToTestFile] = useState<{ filename: string; description?: string } | null>(null)
  return (
    <section>
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</h4>
      <ul className="space-y-2">
        {artifacts.map((a) => (
          <li key={a.id} className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 px-3 py-2.5">
            <div className="w-8 h-8 rounded bg-emerald-50 flex items-center justify-center shrink-0">
              <FileText size={14} className="text-emerald-700" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-900 truncate">{a.filename}</div>
              {a.description && (
                <div className="text-xs text-gray-500 truncate">{a.description}</div>
              )}
            </div>
            <button
              onClick={() => setCopyToTestFile({ filename: a.filename, description: a.description })}
              className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 hover:bg-gray-100 px-2 py-1 rounded transition-colors"
            >
              <Clipboard size={11} />
              Copy to Test
            </button>
            <button className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 hover:bg-gray-100 px-2 py-1 rounded transition-colors">
              <Download size={11} />
              Download
            </button>
          </li>
        ))}
      </ul>

      <CopyToTestModal
        open={copyToTestFile !== null}
        file={copyToTestFile}
        onClose={() => setCopyToTestFile(null)}
      />
    </section>
  )
}

const reviewStatusClass: Record<'pending' | 'approved' | 'rejected', string> = {
  pending: 'bg-amber-50 text-amber-700',
  approved: 'bg-emerald-50 text-emerald-700',
  rejected: 'bg-red-50 text-red-700',
}

const reviewStatusLabel: Record<'pending' | 'approved' | 'rejected', string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
}

function HumanInTheLoopSection({ review }: { review: NonNullable<RunRecord['humanReview']> }) {
  return (
    <section>
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Human in the loop</h4>
      <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 px-3 py-2.5">
        {review.decidedBy && (
          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 text-[11px] font-semibold flex items-center justify-center shrink-0">
            {review.decidedBy.initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-sm text-gray-900 truncate">{review.step}</div>
          {review.decidedBy && (
            <div className="text-xs text-gray-500 mt-0.5">{review.decidedBy.name}</div>
          )}
        </div>
        <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded ${reviewStatusClass[review.status]}`}>
          {reviewStatusLabel[review.status]}
        </span>
      </div>
    </section>
  )
}

// ----- Workflow diagram (vertical chain of step blocks with optional branches) -----

const workflowStepTypeClass: Record<WorkflowStepType, string> = {
  'Data Transformation': 'bg-emerald-50 text-emerald-700',
  'Pivot Table': 'bg-sky-50 text-sky-700',
  'Upload to Reconciliation': 'bg-indigo-50 text-indigo-700',
  'Human Review': 'bg-amber-50 text-amber-700',
  'Approval': 'bg-violet-50 text-violet-700',
}

const workflowStepTypeIcon: Record<WorkflowStepType, JSX.Element> = {
  'Data Transformation': <Sparkles size={14} className="text-emerald-700" />,
  'Pivot Table': <Sparkles size={14} className="text-sky-700" />,
  'Upload to Reconciliation': <FileText size={14} className="text-indigo-700" />,
  'Human Review': <ShieldCheck size={14} className="text-amber-700" />,
  'Approval': <Check size={14} className="text-violet-700" />,
}

function WorkflowDiagram({ steps }: { steps: WorkflowStep[] }) {
  if (steps.length === 0) {
    return <p className="text-xs text-gray-500">No workflow defined for this agent yet.</p>
  }
  return (
    <div className="flex flex-col items-center">
      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 mb-2">
        <Sparkles size={11} />
        STARTING POINT
      </span>
      {steps.map((step, i) => (
        <div key={step.id} className="flex flex-col items-center w-full max-w-[420px]">
          <WorkflowBlock step={step} />
          {i < steps.length - 1 && <WorkflowArrow />}
          {i === steps.length - 1 && step.branches && step.branches.length > 0 && (
            <BranchRow branches={step.branches} />
          )}
        </div>
      ))}
    </div>
  )
}

function WorkflowBlock({ step }: { step: WorkflowStep }) {
  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 px-4 py-3 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
          {workflowStepTypeIcon[step.type]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 leading-snug">{step.title}</div>
          <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded mt-1.5 ${workflowStepTypeClass[step.type]}`}>
            {step.type}
          </span>
        </div>
      </div>
    </div>
  )
}

function WorkflowArrow() {
  return (
    <div className="flex items-center justify-center my-2 text-gray-300">
      <svg width="2" height="20" viewBox="0 0 2 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="1" y1="0" x2="1" y2="14" stroke="currentColor" strokeWidth="1.5" />
        <polyline points="-3,12 1,20 5,12" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  )
}

function BranchRow({ branches }: { branches: NonNullable<WorkflowStep['branches']> }) {
  return (
    <div className="w-full mt-2">
      <div className="flex items-center justify-around mb-2">
        {branches.map((b, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="text-[11px] font-medium text-gray-500 mb-1">{b.label}</div>
            <svg width="2" height="16" viewBox="0 0 2 16" fill="none" className="text-gray-300">
              <line x1="1" y1="0" x2="1" y2="10" stroke="currentColor" strokeWidth="1.5" />
              <polyline points="-3,8 1,16 5,8" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
        ))}
      </div>
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${branches.length}, minmax(0, 1fr))` }}>
        {branches.map((b, i) => (
          <div
            key={i}
            className={`rounded-lg border px-3 py-2 text-center text-sm font-medium ${
              b.tone === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-700 border-dashed'
            }`}
          >
            {b.label}
          </div>
        ))}
      </div>
    </div>
  )
}

// ----- Version History sub-tab -----

function VersionHistorySubTab({ details }: { details: AgentDetailsData }) {
  return (
    <ul className="space-y-3">
      {details.versions.map((v) => (
        <VersionRow key={v.id} version={v} />
      ))}
    </ul>
  )
}

function VersionRow({ version }: { version: AgentVersion }) {
  return (
    <li className="flex items-start gap-4 p-3 rounded-lg border border-gray-200">
      <div className="w-12 shrink-0">
        <span className={`inline-flex items-center text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
          version.current ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {version.version}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-900">{version.releasedAt}</span>
          {version.current && (
            <span className="inline-flex items-center text-[11px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
              Current
            </span>
          )}
          <span className="text-xs text-gray-400">·</span>
          <span className="text-xs text-gray-500">by {version.author}</span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{version.changes}</p>
      </div>
    </li>
  )
}

// ---------- Copy to Test modal ----------

type TestType = 'control' | 'key-report'

function CopyToTestModal({
  open, file, onClose,
}: {
  open: boolean
  file: { filename: string; description?: string } | null
  onClose: () => void
}) {
  const [testType, setTestType] = useState<TestType>('control')
  const [controlTest, setControlTest] = useState<string>('')
  const [testPhase, setTestPhase] = useState<string>('')

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setTestType('control')
      setControlTest('')
      setTestPhase('')
    }
  }, [open])

  const canSave =
    (testType === 'control' && !!controlTest && !!testPhase) ||
    testType === 'key-report'

  function handleSave() {
    // Prototype: just close the modal
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] max-w-[90vw] bg-white rounded-xl shadow-2xl z-50 focus:outline-none">
          {/* Header */}
          <header className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <Dialog.Title className="text-base font-semibold text-gray-900">Copy to Test</Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-700 p-1 rounded">
                <X size={16} />
              </button>
            </Dialog.Close>
          </header>

          {/* Body */}
          <div className="px-5 py-5 space-y-5">
            {/* File card */}
            {file && (
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5">
                <div className="w-8 h-8 rounded bg-emerald-50 flex items-center justify-center shrink-0">
                  <FileText size={14} className="text-emerald-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{file.filename}</div>
                  {file.description && (
                    <div className="text-xs text-gray-500 truncate">{file.description}</div>
                  )}
                </div>
              </div>
            )}

            {/* Test type radio group */}
            <div>
              <div className="text-sm font-medium text-gray-900 mb-3">Select Test type</div>
              <div className="space-y-3">
                {/* Control Test option */}
                <div>
                  <RadioRow
                    selected={testType === 'control'}
                    onSelect={() => setTestType('control')}
                    label="Control Test"
                  />
                  {testType === 'control' && (
                    <div className="pl-6 ml-1.5 mt-3 border-l-2 border-emerald-400 space-y-3">
                      <ModalSelect
                        label="Select Control Test"
                        required
                        value={controlTest}
                        onChange={setControlTest}
                        options={[
                          { value: '', label: 'Default' },
                          { value: 'c-jdg-02', label: 'C-JDG-02 — Sampling-based accuracy test' },
                          { value: 'c-trf-02', label: 'C-TRF-02 — Sample re-run validation' },
                          { value: 'c-ing-01', label: 'C-ING-01 — Source-to-landing reconciliation' },
                        ]}
                      />
                      <ModalSelect
                        label="Test Phase"
                        value={testPhase}
                        onChange={setTestPhase}
                        options={[
                          { value: '', label: 'Default' },
                          { value: 'design', label: 'Design effectiveness' },
                          { value: 'operating', label: 'Operating effectiveness' },
                        ]}
                      />
                    </div>
                  )}
                </div>

                {/* Key Report Test option */}
                <RadioRow
                  selected={testType === 'key-report'}
                  onSelect={() => setTestType('key-report')}
                  label="Key Report Test"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100">
            <Dialog.Close asChild>
              <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={handleSave}
              disabled={!canSave}
              className="px-4 py-1.5 text-sm font-medium text-white rounded-lg transition-colors disabled:cursor-not-allowed"
              style={{
                background: canSave ? '#1fac76' : '#b8e3d2',
              }}
            >
              Save
            </button>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function RadioRow({
  selected, onSelect, label,
}: { selected: boolean; onSelect: () => void; label: string }) {
  return (
    <button
      onClick={onSelect}
      className="flex items-center gap-2.5 w-full text-left"
    >
      <span
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
          selected ? 'border-emerald-500' : 'border-gray-300'
        }`}
      >
        {selected && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
      </span>
      <span className={`text-sm font-medium ${selected ? 'text-gray-900' : 'text-gray-600'}`}>
        {label}
      </span>
    </button>
  )
}

function ModalSelect({
  label, required, value, onChange, options,
}: {
  label: string
  required?: boolean
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {required && <span className="text-red-500 mr-0.5">*</span>}
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
