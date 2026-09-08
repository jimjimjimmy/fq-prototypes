import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { chartOfAccounts } from '../../data/chartOfAccounts';
import { team } from '../../data/team';

// ─── Storage ────────────────────────────────────────────────────────────────

const MAPPINGS_KEY  = 'detect-erp-field-mappings';
const ASSIGNEES_KEY = 'detect-fallback-assignees';

export function useSetupDone() {
  const [done, setDone] = useState(() => {
    return (
      localStorage.getItem(MAPPINGS_KEY) !== null &&
      localStorage.getItem(ASSIGNEES_KEY) !== null
    );
  });

  const finish = (mappings: Record<string, string>, assignees: Record<string, string>) => {
    localStorage.setItem(MAPPINGS_KEY, JSON.stringify(mappings));
    localStorage.setItem(ASSIGNEES_KEY, JSON.stringify(assignees));
    setDone(true);
  };

  const skip = () => {
    localStorage.setItem(MAPPINGS_KEY, JSON.stringify({}));
    localStorage.setItem(ASSIGNEES_KEY, JSON.stringify({}));
    setDone(true);
  };

  return { setupDone: done, finishSetup: finish, skipSetup: skip };
}

// ─── ERP field list ──────────────────────────────────────────────────────────

const FLOQAST_FIELDS = [
  { id: 'transactionId',   label: 'Transaction ID' },
  { id: 'transactionLine', label: 'Transaction Line' },
  { id: 'transactionDate', label: 'Transaction Date' },
  { id: 'postingPeriod',   label: 'Posting Period' },
  { id: 'amount',          label: 'Amount' },
  { id: 'currency',        label: 'Currency' },
  { id: 'type',            label: 'Type' },
  { id: 'subsidiary',      label: 'Entity' },
  { id: 'account',         label: 'Account' },
  { id: 'vendor',          label: 'Vendor' },
  { id: 'memo',            label: 'Memo' },
  { id: 'department',      label: 'Department' },
  { id: 'class',           label: 'Class' },
  { id: 'location',        label: 'Location' },
  { id: 'createdDate',     label: 'Created Date' },
  { id: 'createdBy',       label: 'Created By' },
];

// ─── GL account groups ───────────────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
  asset:     'Assets',
  liability: 'Liabilities',
  equity:    'Equity',
  revenue:   'Revenue',
  cogs:      'Cost of Goods Sold',
  opex:      'Operating Expenses',
};
const TYPE_ORDER = ['asset', 'liability', 'equity', 'revenue', 'cogs', 'opex'];

function groupByType() {
  const groups: Record<string, typeof chartOfAccounts> = {};
  for (const type of TYPE_ORDER) {
    groups[type] = chartOfAccounts.filter((a) => a.type === type);
  }
  return groups;
}

// ─── Component ───────────────────────────────────────────────────────────────

interface Props {
  onFinish: (mappings: Record<string, string>, assignees: Record<string, string>) => void;
  onSkip: () => void;
}

type Tab = 'mapping' | 'assignees';

export function SetupModal({ onFinish, onSkip }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('mapping');

  // ERP field mapping state
  const [mappings, setMappings] = useState<Record<string, string>>(() => {
    const stored = localStorage.getItem(MAPPINGS_KEY);
    return stored ? JSON.parse(stored) : {};
  });

  // Fallback assignees state
  const [assignees, setAssignees] = useState<Record<string, string>>(() => {
    const stored = localStorage.getItem(ASSIGNEES_KEY);
    return stored ? JSON.parse(stored) : {};
  });
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const groups = groupByType();

  const mappedCount   = Object.values(mappings).filter((v) => v.trim()).length;
  const assignedCount = Object.values(assignees).filter((v) => v).length;

  const setField = (id: string, value: string) =>
    setMappings((prev) => ({ ...prev, [id]: value }));

  const setAccount = (code: string, userId: string) =>
    setAssignees((prev) => ({ ...prev, [code]: userId }));

  const setGroup = (type: string, userId: string) => {
    const codes = groups[type].map((a) => a.code);
    setAssignees((prev) => {
      const next = { ...prev };
      for (const code of codes) next[code] = userId;
      return next;
    });
  };

  const toggleCollapse = (type: string) =>
    setCollapsed((prev) => ({ ...prev, [type]: !prev[type] }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-slate-900/10 flex flex-col max-h-[90vh]">

        {/* Header */}
        <header className="shrink-0 border-b border-slate-200 px-5 pt-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Configure Detect</h2>
              <p className="mt-0.5 text-sm text-slate-500">
                Both steps are optional — skip anytime and return later in Settings.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
              Optional
            </span>
          </div>

          {/* Tabs */}
          <div className="flex gap-0">
            {([
              { id: 'mapping',  label: 'ERP Field Mapping', count: mappedCount },
              { id: 'assignees', label: 'Fallback Assignees', count: assignedCount },
            ] as { id: Tab; label: string; count: number }[]).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={[
                  'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-neutral-900 text-neutral-900'
                    : 'border-transparent text-slate-500 hover:text-slate-700',
                ].join(' ')}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-1.5 rounded-full bg-neutral-900 px-1.5 py-0.5 text-xs text-white">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </header>

        {/* Tab: ERP Field Mapping */}
        {activeTab === 'mapping' && (
          <>
            <div className="shrink-0 grid grid-cols-2 gap-3 border-b border-slate-100 bg-slate-50 px-5 py-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">FloQast Field</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Your ERP Field Name</span>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto divide-y divide-slate-100">
              {FLOQAST_FIELDS.map((field) => (
                <div key={field.id} className="grid grid-cols-2 items-center gap-3 px-5 py-2.5">
                  <span className="text-sm text-slate-700">{field.label}</span>
                  <input
                    type="text"
                    value={mappings[field.id] ?? ''}
                    onChange={(e) => setField(field.id, e.target.value)}
                    placeholder="e.g. GL Account"
                    className="h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20"
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Tab: Fallback Assignees */}
        {activeTab === 'assignees' && (
          <div className="min-h-0 flex-1 overflow-y-auto">
            {TYPE_ORDER.map((type) => {
              const accounts = groups[type];
              if (!accounts?.length) return null;
              const isCollapsed = collapsed[type];
              const groupAssigned = accounts.filter((a) => assignees[a.code]).length;

              return (
                <div key={type} className="border-b border-slate-100 last:border-0">
                  <div className="flex items-center justify-between gap-3 bg-slate-50 px-5 py-2.5">
                    <button
                      type="button"
                      onClick={() => toggleCollapse(type)}
                      className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-700"
                    >
                      {isCollapsed
                        ? <ChevronRight className="h-3.5 w-3.5" />
                        : <ChevronDown className="h-3.5 w-3.5" />}
                      {TYPE_LABELS[type]}
                      <span className="ml-1 font-normal text-slate-400">
                        ({accounts.length}{groupAssigned > 0 ? `, ${groupAssigned} assigned` : ''})
                      </span>
                    </button>
                    <div className="relative shrink-0">
                      <select
                        value=""
                        onChange={(e) => { if (e.target.value) setGroup(type, e.target.value); }}
                        className="h-7 appearance-none rounded-md bg-white pl-2.5 pr-7 text-xs text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 focus:outline-none cursor-pointer"
                      >
                        <option value="">Set all…</option>
                        {team.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                    </div>
                  </div>

                  {!isCollapsed && (
                    <div className="divide-y divide-slate-100">
                      {accounts.map((account) => (
                        <div
                          key={account.code}
                          className="flex items-center justify-between gap-3 px-5 py-2"
                          style={{ paddingLeft: account.parentCode ? '2.5rem' : undefined }}
                        >
                          <div className="flex min-w-0 items-baseline gap-2">
                            <span className="shrink-0 font-mono text-xs text-slate-400">{account.code}</span>
                            <span className="truncate text-sm text-slate-700">{account.name}</span>
                          </div>
                          <div className="relative shrink-0">
                            <select
                              value={assignees[account.code] ?? ''}
                              onChange={(e) => setAccount(account.code, e.target.value)}
                              className={[
                                'h-7 appearance-none rounded-md pl-2.5 pr-7 text-xs ring-1 ring-inset focus:outline-none cursor-pointer',
                                assignees[account.code]
                                  ? 'bg-white text-slate-900 ring-slate-300'
                                  : 'bg-white text-slate-400 ring-slate-200 hover:bg-slate-50',
                              ].join(' ')}
                            >
                              <option value="">Unassigned</option>
                              {team.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <footer className="shrink-0 flex items-center justify-between gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
          <button
            type="button"
            onClick={onSkip}
            className="text-sm text-slate-500 hover:text-slate-700 underline underline-offset-2"
          >
            Skip for Now
          </button>
          <button
            type="button"
            onClick={() => onFinish(mappings, assignees)}
            className="inline-flex h-9 items-center rounded-md bg-neutral-900 px-4 text-sm font-medium text-white hover:bg-neutral-800"
          >
            {mappedCount + assignedCount > 0
              ? `Save & Continue`
              : 'Save & Continue'}
          </button>
        </footer>

      </div>
    </div>
  );
}
