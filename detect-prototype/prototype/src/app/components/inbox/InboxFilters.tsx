import { Sparkles, CircleDashed, User, ChevronUp, ChevronDown, Check } from 'lucide-react';
import type { InboxFilters as FiltersShape, SortKey } from '../../../data/types';
import { useAppStore } from '../../../store/useAppStore';
import { team, currentUserId, getTeamMember } from '../../../data/team';
import { Switch } from '../ui/switch';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';

interface Props {
  filters: FiltersShape;
  /** Optional explicit-close handler — renders a small "Done" button at the panel's bottom. */
  onClose?: () => void;
}

/**
 * Simplified secondary filter panel.
 *
 *   Filters: AI flagged · Rule flagged · Assigned to you  (pill toggles)
 *   Sort:    Severity score (default) · Amount · Account · Rule type
 *
 * All other filter dimensions (severity, entity, period, rule) removed
 * per design feedback — the inbox should stay calm.
 */
export function InboxFilters({ filters, onClose }: Props) {
  const setFilters = useAppStore((s) => s.setFilters);
  const records = useAppStore((s) => s.records);

  const aiOn = filters.source?.includes('ai') ?? false;
  const ruleOn = filters.source?.includes('rule') ?? false;

  // Selected assignee (single value from the dropdown). Undefined means
  // "no assignee filter" — show records assigned to anyone.
  const selectedAssigneeId = filters.assigneeId?.[0];
  const selectedAssignee = selectedAssigneeId ? getTeamMember(selectedAssigneeId) : null;

  // Count of records that would be hidden by the "hide signed off" toggle.
  // Only shown next to the label when the toggle is on.
  const hiddenCount = records.filter(
    (r) => r.status === 'resolved' || r.status === 'dismissed',
  ).length;

  const toggleSource = (kind: 'ai' | 'rule') => {
    const existing = filters.source ?? [];
    const next = existing.includes(kind)
      ? existing.filter((k) => k !== kind)
      : [...existing, kind];
    setFilters({ source: next });
  };

  const setAssignee = (id: string | null) => {
    setFilters({ assigneeId: id ? [id] : [] });
  };

  return (
    <div className="space-y-3 border-b border-slate-200 bg-slate-50/60 px-4 py-3">
      <div>
        <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
          Filter
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Toggle
            label="AI detected"
            active={aiOn}
            onClick={() => toggleSource('ai')}
            icon={<Sparkles className="h-3.5 w-3.5" />}
          />
          <Toggle
            label="Rule detected"
            active={ruleOn}
            onClick={() => toggleSource('rule')}
            icon={<CircleDashed className="h-3.5 w-3.5" />}
          />
          <AssigneeFilter
            selectedId={selectedAssigneeId ?? null}
            selectedName={
              selectedAssignee
                ? selectedAssigneeId === currentUserId
                  ? 'You'
                  : selectedAssignee.name
                : null
            }
            onSelect={setAssignee}
          />
        </div>
      </div>

      <div>
        <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
          Sort by
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters({ sortBy: e.target.value as SortKey })
            }
            className="h-8 flex-1 rounded-md border border-slate-200 bg-white px-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="severity">Severity score (default)</option>
            <option value="amount">Amount</option>
            <option value="account">Account</option>
            <option value="rule-type">Rule type</option>
          </select>
          <button
            type="button"
            onClick={() =>
              setFilters({ sortDir: filters.sortDir === 'asc' ? 'desc' : 'asc' })
            }
            title={filters.sortDir === 'asc' ? 'Ascending' : 'Descending'}
            className="inline-flex h-8 items-center rounded-md bg-white px-2.5 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
          >
            {filters.sortDir === 'asc' ? '↑ Asc' : '↓ Desc'}
          </button>
        </div>
      </div>
      <div>
        <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">
          Display
        </div>
        <label htmlFor="hide-signed-off" className="flex items-center justify-between cursor-pointer">
          <span className="text-xs text-slate-600 select-none">
            Hide signed off transactions
            {filters.hideSignedOff && (
              <span className="ml-1 text-slate-400">
                ({hiddenCount} hidden {hiddenCount === 1 ? 'transaction' : 'transactions'})
              </span>
            )}
          </span>
          <Switch
            id="hide-signed-off"
            checked={!!filters.hideSignedOff}
            onCheckedChange={(v) => setFilters({ hideSignedOff: v })}
          />
        </label>
      </div>

      {/* Subtle "Done" affordance — gives an explicit close target inside the
          panel for users who want to tidy up without selecting a record. */}
      {onClose && (
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            Done
            <ChevronUp className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}

function Toggle({
  label,
  active,
  onClick,
  icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors ${
        active
          ? 'bg-neutral-200 text-neutral-900 ring-1 ring-inset ring-neutral-300'
          : 'bg-white text-neutral-600 ring-1 ring-inset ring-neutral-200 hover:bg-neutral-50'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

/**
 * Assignee dropdown filter — replaces the old "Assigned to you" toggle.
 * Lets the reviewer surface someone else's queue (e.g. a teammate who's
 * left, or out for the close) without bulk-reassigning records.
 */
function AssigneeFilter({
  selectedId,
  selectedName,
  onSelect,
}: {
  selectedId: string | null;
  selectedName: string | null;
  onSelect: (id: string | null) => void;
}) {
  const active = selectedId !== null;
  // Reorder so "You" lives at the top regardless of seed order
  const orderedTeam = [
    ...team.filter((m) => m.id === currentUserId),
    ...team.filter((m) => m.id !== currentUserId),
  ];
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors ${
            active
              ? 'bg-neutral-200 text-neutral-900 ring-1 ring-inset ring-neutral-300'
              : 'bg-white text-neutral-600 ring-1 ring-inset ring-neutral-200 hover:bg-neutral-50'
          }`}
        >
          <User className="h-3.5 w-3.5" />
          Assignee{selectedName ? `: ${selectedName}` : ''}
          <ChevronDown className="h-3 w-3 opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        sideOffset={6}
        className="w-56 rounded-lg border border-neutral-200 bg-white p-1 shadow-xl"
      >
        <div className="max-h-64 overflow-y-auto py-1">
          <AssigneeOption
            label="Anyone"
            checked={selectedId === null}
            onSelect={() => onSelect(null)}
          />
          <div className="my-1 h-px bg-neutral-100" />
          {orderedTeam.map((m) => (
            <AssigneeOption
              key={m.id}
              label={m.id === currentUserId ? `${m.name} (You)` : m.name}
              checked={selectedId === m.id}
              onSelect={() => onSelect(m.id)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function AssigneeOption({
  label,
  checked,
  onSelect,
}: {
  label: string;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-neutral-800 hover:bg-neutral-100"
    >
      <span className="flex h-4 w-4 shrink-0 items-center justify-center">
        {checked ? <Check className="h-3.5 w-3.5 text-neutral-900" /> : null}
      </span>
      <span className="truncate">{label}</span>
    </button>
  );
}
