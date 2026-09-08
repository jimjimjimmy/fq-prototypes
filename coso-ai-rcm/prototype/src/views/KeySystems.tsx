import { useEffect, useRef } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import anime from 'animejs'
import { MoreHorizontal, Search, Filter, PlusCircle, Database, AlertCircle } from 'lucide-react'
import { capabilityShortLabel, traditionalSystems, type Agent, type Reliance, type Health, type TraditionalSystem } from '../data/agents'
import { CAPABILITY_LIBRARY } from '../data/risks-controls'
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

type Props = {
  agents: Agent[]
  onSelectAgent: (id: string) => void
  onCreateAgent?: () => void
}

export function KeySystems({ agents, onSelectAgent, onCreateAgent }: Props) {
  const newAgentCount = agents.filter((a) => a.isNewFromTransform).length
  return (
    <div className="px-10 py-8 max-w-[1400px]">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Key Systems</h1>
        <p className="mt-1 text-sm text-gray-500">
          Inventory of systems and AI workflows in scope for compliance.
        </p>
      </header>

      <Tabs.Root defaultValue="ai-agents">
        <Tabs.List className="flex items-center border-b border-gray-200 mb-6">
          <TabTrigger value="ai-agents" label="AI agents" count={agents.length} newCount={newAgentCount} />
          <TabTrigger value="traditional" label="Traditional systems" count={traditionalSystems.length} />
        </Tabs.List>

        <Tabs.Content value="ai-agents" className="focus:outline-none">
          <AIAgentsPanel agents={agents} onSelectAgent={onSelectAgent} onCreateAgent={onCreateAgent} />
        </Tabs.Content>

        <Tabs.Content value="traditional" className="focus:outline-none">
          <TraditionalPanel />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}

function TabTrigger({ value, label, count, newCount }: { value: string; label: string; count: number; newCount?: number }) {
  return (
    <Tabs.Trigger
      value={value}
      className="px-4 py-2.5 -mb-px text-sm font-medium text-gray-500 border-b-2 border-transparent transition-colors hover:text-gray-900 data-[state=active]:text-gray-900 data-[state=active]:border-[#186749] focus:outline-none flex items-center gap-2"
    >
      {label}
      <span className="text-[11px] font-semibold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
        {count}
      </span>
      {newCount !== undefined && newCount > 0 && (
        <span
          className="text-[11px] font-semibold text-white px-1.5 py-0.5 rounded"
          style={{ background: '#f59e0b' }}
          title={`${newCount} new ${newCount === 1 ? 'agent' : 'agents'} from Transform`}
        >
          {newCount} new
        </span>
      )}
    </Tabs.Trigger>
  )
}

function AIAgentsPanel({ agents, onSelectAgent, onCreateAgent }: { agents: Agent[]; onSelectAgent: (id: string) => void; onCreateAgent?: () => void }) {
  const tableRef = useRef<HTMLTableElement>(null)

  useEffect(() => {
    if (!tableRef.current) return
    const rows = tableRef.current.querySelectorAll('tbody tr')
    if (document.hidden) {
      rows.forEach(r => { (r as HTMLElement).style.opacity = '1'; (r as HTMLElement).style.transform = 'none' })
      return
    }
    anime({
      targets: rows,
      translateY: [12, 0],
      opacity: [0, 1],
      delay: anime.stagger(40, { start: 100 }),
      duration: 500,
      easing: 'easeOutExpo',
    })
  }, [])

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          Auto-populated from FloQast Transform. {agents.length} agent{agents.length !== 1 ? 's' : ''} in scope for AI governance.
        </p>
        <button
          onClick={() => onCreateAgent?.()}
          className="inline-flex items-center gap-2 bg-[#1fac76] text-white text-sm font-medium py-2 px-3.5 rounded-lg hover:bg-[#186749] transition-colors"
        >
          <PlusCircle size={16} />
          New agent
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search agents…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
          />
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
          <Filter size={14} />
          Filter
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table ref={tableRef} className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="text-left px-4 py-3 w-[26%]">Agent</th>
              <th className="text-left px-4 py-3 w-[14%]">Owner</th>
              <th className="text-left px-4 py-3 w-[18%]">Capabilities</th>
              <th className="text-left px-4 py-3 w-[12%]">Reliance</th>
              <th className="text-left px-4 py-3 w-[8%]">Open gaps</th>
              <th className="text-left px-4 py-3 w-[10%]">Frequency</th>
              <th className="text-left px-4 py-3 w-[10%]">Last run</th>
              <th className="text-left px-4 py-3 w-[6%]">Health</th>
              <th className="px-4 py-3 w-[40px]"></th>
            </tr>
          </thead>
          <tbody>
            {agents.map((a) => (
              <AgentRow key={a.id} agent={a} onClick={() => onSelectAgent(a.id)} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function AgentRow({ agent, onClick }: { agent: Agent; onClick: () => void }) {
  return (
    <tr
      onClick={() => { onClick() }}
      className="border-b border-gray-100 last:border-b-0 hover:bg-indigo-50/30 transition-colors cursor-pointer"
    >
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          <div className="font-medium text-gray-900">{agent.name}</div>
          {agent.isNewFromTransform && (
            <span
              className="inline-flex items-center text-[10px] font-semibold text-white px-1.5 py-0.5 rounded uppercase tracking-wide"
              style={{ background: '#f59e0b' }}
              title="Just registered in Transform — awaiting risk & control review"
            >
              New
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">{agent.description}</div>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 text-[11px] font-semibold flex items-center justify-center">
            {agent.owner.initials}
          </div>
          <span className="text-gray-700">{agent.owner.name}</span>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex flex-wrap gap-1">
          {agent.capabilityIds.map((id) => (
            <span
              key={id}
              title={CAPABILITY_LIBRARY[id].label}
              className="inline-flex items-center text-[11px] font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded"
            >
              {capabilityShortLabel(id)}
            </span>
          ))}
        </div>
      </td>
      <td className="px-4 py-3.5">
        {agent.isNewFromTransform ? (
          <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded border bg-amber-50 text-amber-700 border-amber-200">
            Awaiting review
          </span>
        ) : (
          <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded border ${relianceClass[agent.reliance]}`}>
            {relianceLabel[agent.reliance]}
          </span>
        )}
      </td>
      <td className="px-4 py-3.5">
        {agent.openGaps > 0 ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700">
            <AlertCircle size={12} />
            {agent.openGaps}
          </span>
        ) : (
          <span className="text-xs text-gray-400">—</span>
        )}
      </td>
      <td className="px-4 py-3.5 text-gray-700">{agent.frequency}</td>
      <td className="px-4 py-3.5 text-gray-700">{agent.lastRun}</td>
      <td className="px-4 py-3.5">
        <div className={`w-2 h-2 rounded-full ${healthDot[agent.health]}`} />
      </td>
      <td className="px-4 py-3.5">
        <button onClick={(e) => { e.stopPropagation(); }} className="text-gray-400 hover:text-gray-700 p-1 rounded">
          <MoreHorizontal size={16} />
        </button>
      </td>
    </tr>
  )
}

function TraditionalPanel() {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          IT systems and applications that house financial data — ERPs, reporting tools, spend platforms.
        </p>
        <button
          className="inline-flex items-center gap-2 bg-[#1fac76] text-white text-sm font-medium py-2 px-3.5 rounded-lg hover:bg-[#186749] transition-colors"
        >
          <PlusCircle size={16} />
          New system
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="text-left px-4 py-3 w-[30%]">System</th>
              <th className="text-left px-4 py-3 w-[20%]">Vendor</th>
              <th className="text-left px-4 py-3 w-[20%]">Category</th>
              <th className="text-left px-4 py-3 w-[15%]">Reliance</th>
              <th className="text-left px-4 py-3 w-[10%]">Health</th>
              <th className="px-4 py-3 w-[40px]"></th>
            </tr>
          </thead>
          <tbody>
            {traditionalSystems.map((s) => (
              <TraditionalRow key={s.id} system={s} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-start gap-3 p-4 bg-indigo-50/50 border border-indigo-100 rounded-lg text-sm text-indigo-900">
        <Database size={16} className="text-indigo-600 mt-0.5 shrink-0" />
        <div>
          <div className="font-medium">Traditional systems live alongside AI agents</div>
          <div className="text-indigo-800/80 mt-0.5">
            The AI agents tab is the focus of the COSO AI compliance experience. Traditional key systems
            still belong here — they share reliance designations, but their risk and control framework
            differs from the agentic workflows.
          </div>
        </div>
      </div>
    </>
  )
}

function TraditionalRow({ system }: { system: TraditionalSystem }) {
  return (
    <tr
      className="border-b border-gray-100 last:border-b-0 hover:bg-indigo-50/30 transition-colors cursor-pointer"
    >
      <td className="px-4 py-3.5 font-medium text-gray-900">{system.name}</td>
      <td className="px-4 py-3.5 text-gray-700">{system.vendor}</td>
      <td className="px-4 py-3.5 text-gray-700">{system.category}</td>
      <td className="px-4 py-3.5">
        <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded border ${relianceClass[system.reliance]}`}>
          {relianceLabel[system.reliance]}
        </span>
      </td>
      <td className="px-4 py-3.5">
        <div className={`w-2 h-2 rounded-full ${healthDot[system.health]}`} />
      </td>
      <td className="px-4 py-3.5">
        <button onClick={(e) => { e.stopPropagation(); }} className="text-gray-400 hover:text-gray-700 p-1 rounded">
          <MoreHorizontal size={16} />
        </button>
      </td>
    </tr>
  )
}
