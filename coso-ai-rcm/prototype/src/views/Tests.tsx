import { useMemo, useState } from 'react'
import { Search, Filter, PlusCircle, Clock, CheckCircle2, AlertCircle, Send, MoreHorizontal, Calendar } from 'lucide-react'
import {
  complianceTasks, tasksOverdue, tasksDueThisWeek, tasksAwaitingResult, tasksPassRate,
  type TaskResult, type TaskStatus,
} from '../data/compliance-tasks'
type Props = {
  onSelectAgent: (agentId: string) => void
}

type FilterId = 'all' | 'overdue' | 'due-soon' | 'failing' | 'awaiting-result'

const statusFilters: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'due-soon', label: 'Due soon' },
  { id: 'failing', label: 'Failing' },
  { id: 'awaiting-result', label: 'Awaiting result' },
]

const resultClass: Record<TaskResult, string> = {
  pass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  fail: 'bg-red-50 text-red-700 border-red-200',
  pending: 'bg-gray-100 text-gray-600 border-gray-200',
}

const resultLabel: Record<TaskResult, string> = {
  pass: 'Pass',
  fail: 'Fail',
  pending: 'Pending',
}

const statusDotClass: Record<TaskStatus, string> = {
  'on-track': 'bg-emerald-500',
  'due-soon': 'bg-amber-500',
  'overdue': 'bg-red-500',
  'awaiting-result': 'bg-indigo-500',
}

export function Tests({ onSelectAgent }: Props) {
  const [filter, setFilter] = useState<FilterId>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let list = complianceTasks
    if (filter === 'overdue') list = list.filter((t) => t.status === 'overdue')
    if (filter === 'due-soon') list = list.filter((t) => t.status === 'due-soon')
    if (filter === 'failing') list = list.filter((t) => t.lastResult === 'fail')
    if (filter === 'awaiting-result') list = list.filter((t) => t.status === 'awaiting-result')
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.agentName.toLowerCase().includes(q) ||
          t.controlTitle.toLowerCase().includes(q),
      )
    }
    return list
  }, [filter, search])

  return (
    <div className="px-10 py-8 max-w-[1400px]">
      <header className="mb-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Tests</h1>
            <p className="mt-1 text-sm text-gray-500">
              Recurring compliance tests across all AI agents — schedule, push to control owners, track results.
            </p>
          </div>
          <button
            className="inline-flex items-center gap-2 bg-[#1fac76] text-white text-sm font-medium py-2 px-3.5 rounded-lg hover:bg-[#186749] transition-colors"
          >
            <PlusCircle size={16} />
            Schedule test
          </button>
        </div>
      </header>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KPICard
          label="Total tests"
          value={String(complianceTasks.length)}
          tone="indigo"
          active={filter === 'all'}
          onClick={() => setFilter('all')}
        />
        <KPICard
          label="Overdue"
          value={String(tasksOverdue())}
          tone="red"
          active={filter === 'overdue'}
          onClick={() => setFilter('overdue')}
        />
        <KPICard
          label="Due this week"
          value={String(tasksDueThisWeek())}
          tone="amber"
          active={filter === 'due-soon'}
          onClick={() => setFilter('due-soon')}
        />
        <KPICard
          label="Awaiting result"
          value={String(tasksAwaitingResult())}
          tone="indigo"
          active={filter === 'awaiting-result'}
          onClick={() => setFilter('awaiting-result')}
        />
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tests, agents, controls…"
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
          />
        </div>
        <div className="flex items-center gap-1">
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
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-gray-500">Pass rate: <span className="font-semibold text-gray-900">{tasksPassRate()}%</span></span>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
            <Filter size={14} />
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="text-left px-4 py-3 w-[24%]">Test</th>
              <th className="text-left px-4 py-3 w-[16%]">Agent</th>
              <th className="text-left px-4 py-3 w-[10%]">Cadence</th>
              <th className="text-left px-4 py-3 w-[12%]">Owner</th>
              <th className="text-left px-4 py-3 w-[12%]">Last run</th>
              <th className="text-left px-4 py-3 w-[10%]">Result</th>
              <th className="text-left px-4 py-3 w-[12%]">Next due</th>
              <th className="px-4 py-3 w-[80px]"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-500">
                  No tests match the current filter.
                </td>
              </tr>
            )}
            {filtered.map((t) => (
              <tr key={t.id} className="border-b border-gray-100 last:border-b-0 hover:bg-indigo-50/30 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex items-start gap-2">
                    <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${statusDotClass[t.status]}`} />
                    <div>
                      <div className="font-medium text-gray-900">{t.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{t.controlId} · {t.controlTitle}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <button
                    onClick={() => { onSelectAgent(t.agentId) }}
                    className="text-sm text-indigo-700 hover:underline text-left"
                  >
                    {t.agentName}
                  </button>
                </td>
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center text-[11px] font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                    {t.cadence}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 text-[10px] font-semibold flex items-center justify-center">
                      {t.owner.initials}
                    </div>
                    <span className="text-gray-700 text-sm">{t.owner.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-gray-700 text-sm inline-flex items-center gap-1.5">
                  <Clock size={12} className="text-gray-400" />
                  {t.lastRun}
                </td>
                <td className="px-4 py-3.5">
                  <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded border ${resultClass[t.lastResult]}`}>
                    {t.lastResult === 'pass' ? <CheckCircle2 size={11} /> : t.lastResult === 'fail' ? <AlertCircle size={11} /> : <Clock size={11} />}
                    {resultLabel[t.lastResult]}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} className={t.status === 'overdue' ? 'text-red-600' : 'text-gray-400'} />
                    <span className={`text-sm ${t.status === 'overdue' ? 'text-red-700 font-medium' : 'text-gray-700'}`}>
                      {t.dueIn}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1 justify-end">
                    <button
                      title="Push to owner"
                      className="text-gray-400 hover:text-indigo-700 p-1 rounded transition-colors"
                    >
                      <Send size={14} />
                    </button>
                    <button className="text-gray-400 hover:text-gray-700 p-1 rounded">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ---- KPI card ----

type Tone = 'indigo' | 'amber' | 'emerald' | 'red'

function KPICard({ label, value, active, onClick }: { label: string; value: string; tone?: Tone; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={() => { onClick?.() }}
      className={`bg-white rounded-lg border px-4 py-3 text-left transition-all ${
        active ? 'border-gray-400 shadow-sm' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider truncate">{label}</div>
      <div className="text-xl font-semibold text-gray-900 leading-none mt-1">{value}</div>
    </button>
  )
}
