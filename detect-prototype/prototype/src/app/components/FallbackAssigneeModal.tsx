import { useState, useRef } from 'react';
import { ChevronDown, ChevronRight, Download, Upload, AlertCircle } from 'lucide-react';
import { chartOfAccounts } from '../../data/chartOfAccounts';
import { team } from '../../data/team';

interface Props {
  onSave: (assignments: Record<string, string>) => void;
  onSkip: () => void;
}

const STORAGE_KEY = 'detect-fallback-assignees';

export function useFallbackAssignees() {
  const [assigneesDone, setAssigneesDone] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) !== null;
  });

  const saveAssignees = (assignments: Record<string, string>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
    setAssigneesDone(true);
  };

  const skipAssignees = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({}));
    setAssigneesDone(true);
  };

  return { assigneesDone, saveAssignees, skipAssignees };
}

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

function downloadTemplate(currentAssignments: Record<string, string>) {
  const nameById = Object.fromEntries(team.map((m) => [m.id, m.name]));
  const validNames = team.map((m) => m.name).join(' | ');
  const rows = [
    [`# Valid assignee names: ${validNames}`],
    ['Account Code', 'Account Name', 'Assignee Name'],
    ...chartOfAccounts.map((a) => [
      a.code,
      a.name,
      nameById[currentAssignments[a.code]] ?? '',
    ]),
  ];
  const csv = rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'detect-fallback-assignees.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function parseCSV(text: string): Record<string, string> {
  const nameToId = Object.fromEntries(
    team.map((m) => [m.name.toLowerCase(), m.id])
  );
  const result: Record<string, string> = {};
  const lines = text.split('\n').filter((l) => l.trim() && !l.startsWith('#'));
  for (const line of lines.slice(1)) { // skip header row
    const cols = line.split(',').map((c) => c.replace(/^"|"$/g, '').trim());
    const [code, , assigneeName] = cols;
    if (code && assigneeName) {
      const userId = nameToId[assigneeName.toLowerCase()];
      if (userId) result[code] = userId;
    }
  }
  return result;
}

/**
 * Optional third step of the setup flow. Lets users define a fallback
 * assignee per GL account for AI-detected anomalies when dynamic
 * assignment fails. Supports bulk download/upload via CSV.
 */
export function FallbackAssigneeModal({ onSave, onSkip }: Props) {
  const [assignments, setAssignments] = useState<Record<string, string>>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  });

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadCount, setUploadCount] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploadCount(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = parseCSV(ev.target?.result as string);
        const count = Object.keys(parsed).length;
        if (count === 0) {
          setUploadError('No matching assignees found. Check that names match exactly.');
        } else {
          setAssignments((prev) => ({ ...prev, ...parsed }));
          setUploadCount(count);
        }
      } catch {
        setUploadError('Could not parse the file. Make sure it is a valid CSV.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const groups = groupByType();

  const setAccount = (code: string, userId: string) => {
    setAssignments((prev) => ({ ...prev, [code]: userId }));
  };

  const setGroup = (type: string, userId: string) => {
    const codes = groups[type].map((a) => a.code);
    setAssignments((prev) => {
      const next = { ...prev };
      for (const code of codes) next[code] = userId;
      return next;
    });
  };

  const toggleCollapse = (type: string) => {
    setCollapsed((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const assignedCount = Object.values(assignments).filter((v) => v).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-slate-900/10 flex flex-col max-h-[90vh]">

        <header className="shrink-0 border-b border-slate-200 px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Fallback Assignees
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">
                When dynamic assignment fails, these users will be assigned AI-detected anomalies for each GL account.
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
              Optional
            </span>
          </div>
        </header>

        {/* Bulk actions toolbar */}
        <div className="shrink-0 flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-2.5">
          <span className="text-xs text-slate-500">
            Bulk assign via CSV
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => downloadTemplate(assignments)}
              className="inline-flex items-center gap-1.5 h-7 rounded-md bg-white px-2.5 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
            >
              <Download className="h-3 w-3" />
              Download Template
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 h-7 rounded-md bg-white px-2.5 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
            >
              <Upload className="h-3 w-3" />
              Upload CSV
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>

        {/* Upload feedback */}
        {(uploadError || uploadCount !== null) && (
          <div className={[
            'shrink-0 flex items-center gap-2 px-5 py-2 text-xs',
            uploadError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700',
          ].join(' ')}>
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {uploadError ?? `${uploadCount} assignment${uploadCount !== 1 ? 's' : ''} imported from file.`}
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto">
          {TYPE_ORDER.map((type) => {
            const accounts = groups[type];
            if (!accounts?.length) return null;
            const isCollapsed = collapsed[type];
            const groupAssigned = accounts.filter((a) => assignments[a.code]).length;

            return (
              <div key={type} className="border-b border-slate-100 last:border-0">
                {/* Group header */}
                <div className="flex items-center justify-between gap-3 px-5 py-2.5 bg-slate-50">
                  <button
                    type="button"
                    onClick={() => toggleCollapse(type)}
                    className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 hover:text-slate-700"
                  >
                    {isCollapsed
                      ? <ChevronRight className="h-3.5 w-3.5" />
                      : <ChevronDown className="h-3.5 w-3.5" />
                    }
                    {TYPE_LABELS[type]}
                    <span className="ml-1 font-normal text-slate-400">
                      ({accounts.length} accounts{groupAssigned > 0 ? `, ${groupAssigned} assigned` : ''})
                    </span>
                  </button>

                  {/* Set all in group */}
                  <div className="relative shrink-0">
                    <select
                      value=""
                      onChange={(e) => { if (e.target.value) setGroup(type, e.target.value); }}
                      className="h-7 appearance-none rounded-md bg-white pl-2.5 pr-7 text-xs text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 focus:outline-none cursor-pointer"
                    >
                      <option value="">Set all…</option>
                      {team.map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                {/* Account rows */}
                {!isCollapsed && (
                  <div className="divide-y divide-slate-100">
                    {accounts.map((account) => {
                      const isChild = !!account.parentCode;
                      const assigned = assignments[account.code];
                      return (
                        <div
                          key={account.code}
                          className="flex items-center justify-between gap-3 px-5 py-2"
                          style={{ paddingLeft: isChild ? '2.5rem' : undefined }}
                        >
                          <div className="min-w-0 flex items-baseline gap-2">
                            <span className="shrink-0 text-xs font-mono text-slate-400">{account.code}</span>
                            <span className="truncate text-sm text-slate-700">{account.name}</span>
                          </div>
                          <div className="relative shrink-0">
                            <select
                              value={assigned ?? ''}
                              onChange={(e) => setAccount(account.code, e.target.value)}
                              className={[
                                'h-7 appearance-none rounded-md pl-2.5 pr-7 text-xs ring-1 ring-inset focus:outline-none cursor-pointer',
                                assigned
                                  ? 'bg-white text-slate-900 ring-slate-300'
                                  : 'bg-white text-slate-400 ring-slate-200 hover:bg-slate-50',
                              ].join(' ')}
                            >
                              <option value="">Unassigned</option>
                              {team.map((m) => (
                                <option key={m.id} value={m.id}>{m.name}</option>
                              ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

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
            onClick={() => onSave(assignments)}
            className="inline-flex h-9 items-center rounded-md bg-neutral-900 px-4 text-sm font-medium text-white hover:bg-neutral-800"
          >
            {assignedCount > 0
              ? `Save ${assignedCount} Assignment${assignedCount !== 1 ? 's' : ''}`
              : 'Save'}
          </button>
        </footer>

      </div>
    </div>
  );
}
