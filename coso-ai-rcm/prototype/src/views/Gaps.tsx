import { useMemo, useState } from 'react'
import { Search, Filter, AlertCircle, MoreHorizontal, Calendar, ArrowRight } from 'lucide-react'
import {
  gaps, gapsOpenCount, gapsOverdueCount, gapsHighSeverityCount, gapsAvgDaysOpen,
  type GapSeverity, type GapStatus,
} from '../data/gaps'
type Props = {
  onSelectAgent: (agentId: string) => void
}

type FilterId = 'all' | 'overdue' | 'high' | 'open' | 'in-progress' | 'pending-review'

const statusFilters: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'high', label: 'High severity' },
  { id: 'open', label: 'Open' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'pending-review', label: 'Pending review' },
]

const severityClass: Record<GapSeverity, string> = {
  high: 'bg-red-50 text-red-700 border-red-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  low: 'bg-gray-100 text-gray-600 border-gray-200',
}

const statusClass: Record<GapStatus, string> = {
  open: 'bg-red-50 text-red-700 border-red-200',
  'in-progress': 'bg-amber-50 text-amber-700 border-amber-200',
  'pending-review': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  closed: 'bg-gray-100 text-gray-600 border-gray-200',
}

const statusLabel: Record<GapStatus, string> = {
  open: 'Open',
  'in-progress': 'In progress',
  'pending-review': 'Pending review',
  closed: 'Closed',
}

export function Gaps({ onSelectAgent }: Props) {
  const [filter, setFilter] = useState<FilterId>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let list = gaps
    if (filter === 'overdue') list = list.filter((g) => g.status !== 'closed' && g.daysToDeadline < 0)
    if (filter === 'high') list = list.filter((g) => g.status !== 'closed' && g.severity === 'high')
    if (filter === 'open') list = list.filter((g) => g.status === 'open')
    if (filter === 'in-progress') list = list.filter((g) => g.status === 'in-progress')
    if (filter === 'pending-review') list = list.filter((g) => g.status === 'pending-review')
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.agentName.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q),
      )
    }
    return list
  }, [filter, search])

  return (
    <div className="px-10 py-8 max-w-[1400px]">
      <header className="mb-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Open gaps</h1>
            <p className="mt-1 text-sm text-gray-500">
              Compliance gaps requiring remediation — driven by failed tests, missing evidence, or governance breaches.
            </p>
          </div>
          <button
            className="inline-flex items-center gap-1.5 bg-white text-gray-700 text-sm font-medium py-2 px-3.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Export status report
          </button>
        </div>
      </header>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KPICard
          label="Open gaps"
          value={String(gapsOpenCount())}
          tone="indigo"
          active={filter === 'all'}
          onClick={() => setFilter('all')}
        />
        <KPICard
          label="Overdue"
          value={String(gapsOverdueCount())}
          tone="red"
          active={filter === 'overdue'}
          onClick={() => setFilter('overdue')}
        />
        <KPICard
          label="High severity"
          value={String(gapsHighSeverityCount())}
          tone="amber"
          active={filter === 'high'}
          onClick={() => setFilter('high')}
        />
        <KPICard
          label="Avg days open"
          value={String(gapsAvgDaysOpen())}
          tone="indigo"
          active={false}
        />
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search gaps, agents, descriptions…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
          />
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {statusFilters.map((f) => (
            <button
              key={f.id}
              onClick={() => { setFilter(f.id) }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                filter === f.id
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <button className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
            <Filter size={14} />
            Filter
          </button>
        </div>
      </div>

      {/* List of gap cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-10 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 mb-3">
              <AlertCircle size={20} />
            </div>
            <div className="text-sm font-medium text-gray-900 mb-1">No gaps match the current filter</div>
            <div className="text-xs text-gray-500">Reduce filters to see other open gaps in the program.</div>
          </div>
        )}
        {filtered.map((g) => {
          const overdue = g.daysToDeadline < 0 && g.status !== 'closed'
          return (
            <article
              key={g.id}
              className="bg-white rounded-lg border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className={`mt-1 w-1.5 h-12 rounded-full shrink-0 ${
                  g.severity === 'high' ? 'bg-red-500' : g.severity === 'medium' ? 'bg-amber-500' : 'bg-gray-400'
                }`} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h2 className="text-sm font-semibold text-gray-900">{g.title}</h2>
                        <span className={`inline-flex items-center text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded border ${severityClass[g.severity]}`}>
                          {g.severity}
                        </span>
                        <span className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded border ${statusClass[g.status]}`}>
                          {statusLabel[g.status]}
                        </span>
                        <span className="text-[10px] font-mono text-gray-400">{g.id.toUpperCase()}</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{g.description}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); }}
                      className="text-gray-400 hover:text-gray-700 p-1 rounded shrink-0"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
                    <FieldInline label="Agent">
                      <button
                        onClick={(e) => { e.stopPropagation(); onSelectAgent(g.agentId) }}
                        className="text-indigo-700 hover:underline"
                      >
                        {g.agentName}
                      </button>
                    </FieldInline>
                    <FieldInline label="Source">
                      <span className="text-gray-700">{g.source}</span>
                    </FieldInline>
                    <FieldInline label="Assignee">
                      <div className="inline-flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-700 text-[10px] font-semibold flex items-center justify-center">
                          {g.assignee.initials}
                        </div>
                        <span className="text-gray-700">{g.assignee.name}</span>
                      </div>
                    </FieldInline>
                    <FieldInline label="Opened">
                      <span className="text-gray-700">{g.openedAt}</span>
                    </FieldInline>
                    <FieldInline label="Deadline">
                      <span className={`inline-flex items-center gap-1 ${overdue ? 'text-red-700 font-medium' : 'text-gray-700'}`}>
                        <Calendar size={12} className={overdue ? 'text-red-600' : 'text-gray-400'} />
                        {g.deadline}
                        {overdue && <span className="text-red-700 font-medium">({Math.abs(g.daysToDeadline)}d overdue)</span>}
                      </span>
                    </FieldInline>
                  </div>

                  <div className="mt-3 p-3 rounded-lg bg-indigo-50/40 border border-indigo-100 flex items-start gap-2">
                    <ArrowRight size={14} className="text-indigo-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="text-[11px] font-semibold text-indigo-900 uppercase tracking-wider mb-0.5">Recommended action</div>
                      <div className="text-sm text-indigo-900/90">{g.recommendedAction}</div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

function FieldInline({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
      <span className="text-xs">{children}</span>
    </div>
  )
}

// ---- KPI card ----

type Tone = 'indigo' | 'amber' | 'emerald' | 'red'

function KPICard({ label, value, active, onClick }: { label: string; value: string; tone?: Tone; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={() => { if (onClick) { onClick() } }}
      disabled={!onClick}
      className={`bg-white rounded-lg border px-4 py-3 text-left transition-all ${
        active ? 'border-gray-400 shadow-sm' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
      } ${!onClick ? 'cursor-default' : ''}`}
    >
      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider truncate">{label}</div>
      <div className="text-xl font-semibold text-gray-900 leading-none mt-1">{value}</div>
    </button>
  )
}
