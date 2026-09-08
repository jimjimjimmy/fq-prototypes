import { useState, useMemo } from 'react';
import { ChevronRight, SlidersHorizontal, ChevronUp } from 'lucide-react';
import type { Collection, Status } from '../../../data/variances';
import { CURRENT_USER } from '../../../data/variances';
import { VarianceItemCard } from './VarianceItemCard';

interface Props {
  collections: Collection[];
  selectedItemId: string | null;
  onSelectItem: (id: string) => void;
}

type SortKey = 'account' | 'change-amount';
type SortDir = 'asc' | 'desc';

interface FilterState {
  statuses: Status[];
  sortBy: SortKey;
  sortDir: SortDir;
  hideSignedOff: boolean;
}

// ─── Filter panel ─────────────────────────────────────────────────────────────

function Toggle({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
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
      {label}
    </button>
  );
}

const STATUS_FILTERS: { key: Status; label: string }[] = [
  { key: 'not-started',      label: 'Not started' },
  { key: 'in-progress',      label: 'In progress' },
  { key: 'ready-for-review', label: 'Ready for review' },
];

interface FilterPanelProps {
  filters: FilterState;
  totalHidden: number;
  onChange: (next: Partial<FilterState>) => void;
  onClose: () => void;
}

function FilterPanel({ filters, totalHidden, onChange, onClose }: FilterPanelProps) {
  const toggleStatus = (s: Status) => {
    const next = filters.statuses.includes(s)
      ? filters.statuses.filter((x) => x !== s)
      : [...filters.statuses, s];
    onChange({ statuses: next });
  };

  return (
    <div className="space-y-3 border-b border-neutral-200 bg-neutral-50/60 px-4 py-3">
      {/* Filter pills */}
      <div>
        <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-neutral-500">
          Filter by status
        </div>
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map(({ key, label }) => (
            <Toggle
              key={key}
              label={label}
              active={filters.statuses.includes(key)}
              onClick={() => toggleStatus(key)}
            />
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-neutral-500">
          Sort by
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filters.sortBy}
            onChange={(e) => onChange({ sortBy: e.target.value as SortKey })}
            className="h-8 flex-1 rounded-md border border-neutral-200 bg-white px-2.5 text-sm text-neutral-800 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
          >
            <option value="change-amount">Change amount (default)</option>
            <option value="account">Account name</option>
          </select>
          <button
            type="button"
            onClick={() => onChange({ sortDir: filters.sortDir === 'asc' ? 'desc' : 'asc' })}
            className="inline-flex h-8 items-center rounded-md bg-white px-2.5 text-xs font-medium text-neutral-700 ring-1 ring-inset ring-neutral-200 hover:bg-neutral-50"
          >
            {filters.sortDir === 'asc' ? '↑ Asc' : '↓ Desc'}
          </button>
        </div>
      </div>

      {/* Display */}
      <div>
        <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-neutral-500">
          Display
        </div>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs text-neutral-600 select-none">
            Hide signed-off variances
            {filters.hideSignedOff && totalHidden > 0 && (
              <span className="ml-1 text-neutral-400">
                ({totalHidden} hidden)
              </span>
            )}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={filters.hideSignedOff}
            onClick={() => onChange({ hideSignedOff: !filters.hideSignedOff })}
            className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none ${
              filters.hideSignedOff ? 'bg-neutral-900' : 'bg-neutral-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                filters.hideSignedOff ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </label>
      </div>

      {/* Done */}
      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          Done
          <ChevronUp className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

// ─── Collection group ──────────────────────────────────────────────────────────

interface CollectionGroupProps {
  collection: Collection;
  selectedItemId: string | null;
  onSelectItem: (id: string) => void;
}

function CollectionGroup({ collection, selectedItemId, onSelectItem }: CollectionGroupProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-2 px-3 py-2.5 bg-neutral-50 border-b border-neutral-200 hover:bg-neutral-100 transition-colors"
      >
        <ChevronRight
          className={`h-3.5 w-3.5 text-neutral-400 transition-transform duration-150 shrink-0 ${expanded ? 'rotate-90' : ''}`}
        />
        <div className="flex-1 min-w-0 text-left">
          <p className="font-display text-sm font-semibold tracking-tight text-neutral-700 truncate">
            {collection.name}<span className="font-normal text-neutral-400"> ({collection.items.length})</span>
          </p>
          <p className="font-display text-[10px] tracking-tight text-neutral-400 mt-0.5">{collection.currentPeriod} · {collection.statementType}</p>
        </div>
      </button>

      {expanded && (
        <div>
          {collection.items.map((item) => (
            <VarianceItemCard
              key={item.id}
              item={item}
              selected={selectedItemId === item.id}
              onClick={() => onSelectItem(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── VarianceInbox ─────────────────────────────────────────────────────────────

export function VarianceInbox({ collections, selectedItemId, onSelectItem }: Props) {
  const [showFilters, setShowFilters] = useState(false);
  const [assignedToMe, setAssignedToMe] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    statuses: [],
    sortBy: 'change-amount',
    sortDir: 'desc',
    hideSignedOff: false,
  });

  const updateFilters = (next: Partial<FilterState>) =>
    setFilters((prev) => ({ ...prev, ...next }));

  const allItems = useMemo(() => collections.flatMap((c) => c.items), [collections]);
  const totalItems = allItems.length;
  const signedOffCount = allItems.filter((i) => i.status === 'signed-off').length;

  // Apply filtering and sorting to collections
  const filteredCollections = useMemo(() => {
    return collections.map((col) => {
      let items = [...col.items];

      if (filters.hideSignedOff) {
        items = items.filter((i) => i.status !== 'signed-off');
      }
      if (filters.statuses.length > 0) {
        items = items.filter((i) => filters.statuses.includes(i.status));
      }

      if (filters.sortBy === 'account') {
        items.sort((a, b) =>
          filters.sortDir === 'asc'
            ? a.accountName.localeCompare(b.accountName)
            : b.accountName.localeCompare(a.accountName),
        );
      } else {
        items.sort((a, b) =>
          filters.sortDir === 'asc'
            ? Math.abs(a.changeAmount) - Math.abs(b.changeAmount)
            : Math.abs(b.changeAmount) - Math.abs(a.changeAmount),
        );
      }

      return { ...col, items };
    }).filter((col) => col.items.length > 0);
  }, [collections, filters]);

  const visibleCount = filteredCollections.flatMap((c) => c.items).length;
  const hasActiveFilters =
    filters.statuses.length > 0 || filters.hideSignedOff;

  return (
    <aside className="w-[280px] shrink-0 flex flex-col border-r border-neutral-200 bg-white h-full">
      {/* Header */}
      <div className="border-b border-neutral-200 px-5 pb-4 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-normal tracking-tight text-neutral-900">
              Material Variances <span className="font-normal text-neutral-400">({visibleCount})</span>
            </h2>
            {assignedToMe && (
              <button
                type="button"
                onClick={() => setAssignedToMe(false)}
                className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 font-display text-[11px] font-medium tracking-tight text-neutral-600 hover:bg-neutral-200 transition-colors"
              >
                {CURRENT_USER.avatar
                  ? <img src={CURRENT_USER.avatar} alt={CURRENT_USER.name} className="h-3.5 w-3.5 rounded-full object-cover" />
                  : <span className="h-3.5 w-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ backgroundColor: CURRENT_USER.color }}>{CURRENT_USER.initials}</span>
                }
                Assigned to you
                <span className="text-neutral-400">×</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            aria-label="Filter & sort"
            className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors mt-0.5 ${
              showFilters || hasActiveFilters
                ? 'bg-neutral-200 text-neutral-900'
                : 'text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700'
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <FilterPanel
          filters={filters}
          totalHidden={signedOffCount}
          onChange={updateFilters}
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* Active filter chips */}
      {!showFilters && hasActiveFilters && (
        <div className="flex flex-wrap gap-1.5 px-4 py-2 border-b border-neutral-100">
          {filters.statuses.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => updateFilters({ statuses: filters.statuses.filter((x) => x !== s) })}
              className="inline-flex h-6 items-center gap-1 rounded-full bg-neutral-100 px-2.5 text-[11px] font-medium text-neutral-700 hover:bg-neutral-200 transition-colors"
            >
              {STATUS_FILTERS.find((f) => f.key === s)?.label}
              <span className="text-neutral-400">×</span>
            </button>
          ))}
          {filters.hideSignedOff && (
            <button
              type="button"
              onClick={() => updateFilters({ hideSignedOff: false })}
              className="inline-flex h-6 items-center gap-1 rounded-full bg-neutral-100 px-2.5 text-[11px] font-medium text-neutral-700 hover:bg-neutral-200 transition-colors"
            >
              Hide signed-off
              <span className="text-neutral-400">×</span>
            </button>
          )}
        </div>
      )}

      {/* Collection list */}
      <div className="flex-1 overflow-y-auto">
        {filteredCollections.length === 0 ? (
          <div className="flex h-full items-center justify-center p-8 text-center text-sm text-neutral-500">
            No variances match your filters.
          </div>
        ) : (
          filteredCollections.map((collection) => (
            <CollectionGroup
              key={collection.id}
              collection={collection}
              selectedItemId={selectedItemId}
              onSelectItem={onSelectItem}
            />
          ))
        )}
      </div>
    </aside>
  );
}
