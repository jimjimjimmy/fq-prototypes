import { useEffect, useMemo, useRef, useState } from 'react';
import { ListFilter, Search } from 'lucide-react';
import { InboxCard } from './InboxCard';
import { GhostInboxCard } from './GhostInboxCard';
import { FilterSortModal } from './FilterSortModal';
import { ActiveFilterChips } from './ActiveFilterChips';
import { InboxZero } from './InboxZero';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import {
  useAppStore,
  selectVisibleRecords,
  selectInboxCounts,
  isRecordFullyResolved,
  transactions,
} from '../../../store/useAppStore';
import { getEntity } from '../../../data/company';
import { currentUserId } from '../../../data/team';

interface Props {
  onOpenRules: () => void;
  collapsed: boolean;
  onToggleCollapse?: () => void;
  /** Post-scan reveal phase used to stage Rule then AI-flagged items */
  revealPhase?: 'rule-only' | 'ai-revealing' | 'normal';
  /** When a specific entity is selected, suppress per-card subsidiary labels */
  selectedEntityId?: string;
  /** When true, hides transaction list and shows a neutral empty state (pre-acknowledgment) */
  locked?: boolean;
}

/**
 * The left-side inbox panel.
 *
 * Always visible in the header: Open / Flagged / Dismissed segmented view,
 * search input, Filter button. Clicking Filter slides a secondary filter
 * panel in below the header. Active filters render as chips just below.
 */
export function InboxPanel({ onOpenRules, collapsed, revealPhase = 'normal', selectedEntityId, locked }: Props) {
  const records = useAppStore((s) => s.records);
  const filters = useAppStore((s) => s.filters);
  const setFilters = useAppStore((s) => s.setFilters);
  const selectedRecordId = useAppStore((s) => s.selectedRecordId);
  const selectRecord = useAppStore((s) => s.selectRecord);
  const resolveRecord = useAppStore((s) => s.resolveRecord);
  const reopenRecord = useAppStore((s) => s.reopenRecord);

  // Compute derived views with useMemo — calling selectVisibleRecords /
  // selectInboxCounts directly through useAppStore triggers React 18's
  // "getSnapshot should be cached" infinite-loop warning since each call
  // returns a new array/object. useMemo gives us a stable reference.
  const allVisibleRecords = useMemo(
    () => selectVisibleRecords({ records, filters } as any),
    [records, filters],
  );

  // Phase-aware visible records: in 'rule-only' phase, hide records with
  // ONLY AI flags (records that have at least one rule flag stay visible).
  // Also respects the top-level Subsidiary dropdown — when a specific
  // entity is selected, only records whose underlying transaction lives
  // in that entity are shown.
  const visibleRecords = useMemo(() => {
    let list = allVisibleRecords;
    if (revealPhase === 'rule-only') {
      list = list.filter((r) => r.flags.some((f) => f.source.kind === 'rule'));
    }
    if (selectedEntityId && selectedEntityId !== 'all') {
      list = list.filter((r) => {
        const tx = transactions.find((t) => t.id === r.transactionId);
        return tx?.entityId === selectedEntityId;
      });
    }
    return list;
  }, [allVisibleRecords, revealPhase, selectedEntityId]);

  const aiOnlyIds = useMemo(() => {
    const ids = new Set<string>();
    for (const r of allVisibleRecords) {
      const hasRule = r.flags.some((f) => f.source.kind === 'rule');
      const hasAI = r.flags.some((f) => f.source.kind === 'ai');
      if (hasAI && !hasRule) ids.add(r.id);
    }
    return ids;
  }, [allVisibleRecords]);

  const counts = useMemo(
    () => selectInboxCounts({ records, filters } as any),
    [records, filters],
  );

  // Status-tab counts. Computed against the record pool with every
  // active filter applied EXCEPT the status filter itself — so the
  // pills tell the user "how many matches in each status" given the
  // current search / entity / modal filters. Without this, pills
  // stay glued to global totals and a user searching "AWS" sees a
  // jarring "Open 32" with a 1-row inbox.
  const tabPool = useMemo(() => {
    let list = selectVisibleRecords({
      records,
      filters: { ...filters, view: 'all', hideSignedOff: undefined },
    } as any);
    if (selectedEntityId && selectedEntityId !== 'all') {
      list = list.filter((r) => {
        const tx = transactions.find((t) => t.id === r.transactionId);
        return tx?.entityId === selectedEntityId;
      });
    }
    return list;
  }, [records, filters, selectedEntityId]);

  const tabCounts = useMemo(() => {
    let open = 0;
    let resolved = 0;
    for (const r of tabPool) {
      if (r.status === 'dismissed') continue; // dismissed sit outside Open/Resolved
      if (isRecordFullyResolved(r)) resolved++;
      else open++;
    }
    return { open, resolved };
  }, [tabPool]);

  // Global denominator for the "Showing N of N" line — scoped to the
  // entity selector but NOT to search / modal filters. As the user
  // narrows the list with filters, the numerator (visibleRecords)
  // moves while this anchor stays stable, so "Showing 1 of 35" means
  // "1 record matches your filters out of 35 in the workspace."
  const globalTotal = useMemo(() => {
    let total = 0;
    for (const r of records) {
      if (r.status === 'dismissed') continue;
      if (selectedEntityId && selectedEntityId !== 'all') {
        const tx = transactions.find((t) => t.id === r.transactionId);
        if (tx?.entityId !== selectedEntityId) continue;
      }
      total++;
    }
    return total;
  }, [records, selectedEntityId]);

  const activeTab: 'open' | 'resolved' | 'all' =
    filters.view === 'resolved'
      ? 'resolved'
      : filters.view === 'all'
        ? 'all'
        : 'open';

  // Note: no auto-select on initial load. The DetailPanel shows its own
  // empty state when nothing is selected, which is what we want on first
  // landing — the user picks which transaction to investigate rather than
  // being dropped into the first one in the list. Post-resolve/dismiss
  // auto-advance is still handled in the store actions (resolveRecord,
  // dismissRecord, reopenRecord) which set selectedRecordId: nextId before
  // persisting, so the inbox doesn't go blank between actions.

  // ---------- Exit-animation bookkeeping ----------
  // When a record leaves the current view (user ignored/resolved/reopened),
  // hold it in the rendered list briefly so its exit animation plays.
  // During exit, its height collapses, which naturally shifts the next
  // record up into its place.
  const [displayedRecords, setDisplayedRecords] = useState(visibleRecords);
  const [exitingIds, setExitingIds] = useState<Set<string>>(new Set());
  const prevVisibleRef = useRef(visibleRecords);

  // Track the active status tab so we can detect tab switches and
  // skip the per-record exit animation. Without this, switching
  // from Open → Resolved holds every Open record in the list while
  // it collapses, which reads as the inbox "shifting up."
  const prevViewRef = useRef(filters.view);

  useEffect(() => {
    const prev = prevVisibleRef.current;
    const currentIds = new Set(visibleRecords.map((r) => r.id));
    const removed = prev.filter((r) => !currentIds.has(r.id));

    // Detect tab switch — skip the exit animation entirely and just
    // snap to the new list. The exit animation is for one-off
    // resolve/dismiss/reopen actions, not bulk view changes.
    const tabSwitched = prevViewRef.current !== filters.view;
    prevViewRef.current = filters.view;

    if (removed.length > 0 && !tabSwitched) {
      // Start exit animation — keep the removed records in the display
      // list, merge in any freshly-added records at the end.
      const merged = [...prev];
      for (const r of visibleRecords) {
        if (!prev.some((p) => p.id === r.id)) merged.push(r);
      }
      setDisplayedRecords(merged);
      setExitingIds(new Set(removed.map((r) => r.id)));

      const t = setTimeout(() => {
        setExitingIds(new Set());
        setDisplayedRecords(visibleRecords);
        prevVisibleRef.current = visibleRecords;
      }, 420);

      return () => clearTimeout(t);
    }

    setExitingIds(new Set());
    setDisplayedRecords(visibleRecords);
    prevVisibleRef.current = visibleRecords;
  }, [visibleRecords, filters.view]);

  const [showFilters, setShowFilters] = useState(false);

  // Count of open records assigned to the current user. Drives the inbox-
  // zero celebration even when filters are active.
  const myOpenCount = useMemo(
    () =>
      records.filter(
        (r) =>
          (r.status === 'open' || r.status === 'flagged') &&
          r.assigneeIds.includes(currentUserId),
      ).length,
    [records],
  );

  const transactionsById = useMemo(() => {
    const map = new Map<string, (typeof transactions)[number]>();
    for (const t of transactions) map.set(t.id, t);
    return map;
  }, []);

  const hasActiveFilters =
    !!filters.search ||
    (filters.severity?.length ?? 0) > 0 ||
    (filters.source?.length ?? 0) > 0 ||
    (filters.entityId?.length ?? 0) > 0 ||
    (filters.periodId?.length ?? 0) > 0 ||
    (filters.assigneeId?.length ?? 0) > 0 ||
    (filters.ruleId?.length ?? 0) > 0;

  return (
    <aside
      className={`flex h-full flex-col border-r border-[#e1e6ef] bg-white transition-[width] duration-300 ${
        collapsed ? 'w-0 overflow-hidden' : 'w-[420px]'
      }`}
    >
      {/* Header — two rows.
            Row 1: title (left) + "Showing N of N" count (right, inline).
            Row 2: search input + filter icon, side-by-side. Matches
            the design reference at Figma 50:6197.  */}
      <div className="flex flex-col gap-3 border-b border-[#e1e6ef] px-6 py-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-header text-base font-bold leading-5 text-[#1d2433]">
            Transactions
          </h2>
          <p className="shrink-0 font-['Inter'] text-[11px] leading-4 text-[#adb2bb]">
            Showing {visibleRecords.length} of {globalTotal} total
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 text-[#adb2bb]" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              placeholder="Search for..."
              className="h-10 w-full rounded-md border border-[#e1e6ef] bg-white pl-9 pr-2 font-['Inter'] text-xs font-normal leading-4 text-[#1d2433] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] placeholder:text-[#adb2bb] focus:border-[#3d7bf7] focus:outline-none"
            />
          </div>

          {/* Sort and Filter trigger — sits inline with the search
               input so the two "narrow the list" controls live
               together. */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => setShowFilters((v) => !v)}
                aria-label="Sort and Filter"
                className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md transition-colors ${
                  showFilters
                    ? 'bg-[#f1f3f9] text-[#1d2433]'
                    : 'text-[#6b7280] hover:bg-[#f1f3f9] hover:text-[#1d2433]'
                }`}
              >
                <ListFilter className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Sort and Filter
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Filter & sort modal */}
      <FilterSortModal open={showFilters} onClose={() => setShowFilters(false)} />

      {/* Active filter chips */}
      <ActiveFilterChips filters={filters} />

      {/* Status tab row — Open · Resolved with count pills (Gaurav
           5.18.2026). Replaces the prior Include Resolved toggle;
           clicking a tab sets filters.view to that status and
           clears any leftover hideSignedOff. */}
      <div className="flex shrink-0 items-end gap-6 border-b border-[#e1e6ef] px-6">
        {([
          { key: 'all' as const,      label: 'All',      count: tabCounts.open + tabCounts.resolved },
          { key: 'open' as const,     label: 'Open',     count: tabCounts.open },
          { key: 'resolved' as const, label: 'Resolved', count: tabCounts.resolved },
        ]).map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilters({ view: tab.key, hideSignedOff: undefined })}
              className={`inline-flex items-center gap-1.5 border-b-2 pb-2 pt-2.5 transition-colors ${
                isActive
                  ? 'border-[#1FAC76]'
                  : 'border-transparent hover:border-[#cbd2e1]'
              }`}
            >
              <span
                className={`font-['Inter'] text-[12px] font-semibold leading-[18px] ${
                  isActive ? 'text-[#1d2433]' : 'text-[#6b7280]'
                }`}
              >
                {tab.label}
              </span>
              <span
                className={`inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#f1f3f9] px-1.5 font-['Inter'] text-[10px] font-semibold leading-[14px] tabular-nums ${
                  isActive ? 'text-[#1d2433]' : 'text-[#6b7280]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {locked ? (
          <div className="flex h-full items-center justify-center p-8 text-center text-sm text-neutral-400">
            Acknowledgment required to view transactions.
          </div>
        ) : visibleRecords.length === 0 ? (
          // Inbox-zero celebration fires whenever the current user has no
          // open records assigned to them — even with active filters (e.g.
          // they filtered to "Assigned to me" and just cleared the last
          // one). Otherwise the generic "no matches" message shows because
          // there's still work to do, just not in the current filter view.
          myOpenCount === 0 ? (
            <InboxZero />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
              <Search className="h-6 w-6 text-[#adb2bb]" />
              <p className="font-header text-sm font-bold leading-5 text-[#1d2433]">
                No matches found
              </p>
              <p className="font-['Inter'] text-xs font-normal leading-4 text-[#6b7280]">
                Try adjusting your filters to see more transactions.
              </p>
            </div>
          )
        ) : (
          <>
            {/* Ghost records (expected-but-absent transactions) are
                 hidden for now per request — keep the partition/render
                 logic below intact so we can re-enable them later by
                 dropping `.filter((r) => r.kind !== 'ghost')` from the
                 line below. */}
            {[
              ...displayedRecords.filter((r) => r.kind !== 'ghost'),
            ].map((r) => {
              const tx = transactionsById.get(r.transactionId);
              // Ghost records have no underlying transaction — render differently
              if (!tx) {
                if (r.kind !== 'ghost') return null;
                const exiting = exitingIds.has(r.id);
                return (
                  <div
                    key={r.id}
                    className={[
                      exiting ? 'overflow-hidden' : '',
                      exiting ? '[animation:card-exit_400ms_cubic-bezier(0.4,0,0.2,1)_both]' : '',
                    ].filter(Boolean).join(' ')}
                    style={{ pointerEvents: exiting ? 'none' : undefined }}
                  >
                    <GhostInboxCard
                      record={r}
                      selected={selectedRecordId === r.id}
                      onClick={() => {
                        selectRecord(r.id);
                        if (showFilters) setShowFilters(false);
                      }}
                    />
                  </div>
                );
              }
              const entity = getEntity(tx.entityId);
              const exiting = exitingIds.has(r.id);
              const isAIOnly = aiOnlyIds.has(r.id);
              const flashing = isAIOnly && revealPhase === 'ai-revealing';
              return (
                <div
                  key={r.id}
                  className={[
                    // Only clip the wrapper while an animation is using
                    // max-height — otherwise overflow:hidden chops the
                    // severity score's hover tooltip.
                    exiting || flashing ? 'overflow-hidden' : '',
                    exiting ? '[animation:card-exit_400ms_cubic-bezier(0.4,0,0.2,1)_both]' : '',
                    flashing ? '[animation:card-ai-slide_2400ms_cubic-bezier(0.2,0,0,1)_both]' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={{ pointerEvents: exiting ? 'none' : undefined }}
                >
                  <InboxCard
                    record={r}
                    transaction={tx}
                    entityShortName={selectedEntityId && selectedEntityId !== 'all' ? undefined : entity?.shortName}
                    selected={selectedRecordId === r.id}
                    onClick={() => {
                      selectRecord(r.id);
                      // Auto-collapse the filter panel — selecting a record is
                      // a strong signal the reviewer is done filtering and is
                      // moving on to investigation. Keeps the inbox visually
                      // tidy without requiring an explicit "close" click.
                      if (showFilters) setShowFilters(false);
                    }}
                    flashing={flashing}
                    inboxCollapsed={collapsed}
                  />
                </div>
              );
            })}
            <style>{`
              @keyframes card-exit {
                0%   { opacity: 1; max-height: 140px; transform: translateX(0); }
                40%  { opacity: 0; transform: translateX(24px); max-height: 140px; }
                100% { opacity: 0; transform: translateX(24px); max-height: 0; padding-top: 0; padding-bottom: 0; border-bottom-width: 0; }
              }
              @keyframes card-ai-slide {
                0%   { opacity: 0; max-height: 0; transform: translateY(-12px); }
                30%  { opacity: 1; max-height: 200px; transform: translateY(0); }
                100% { opacity: 1; max-height: 200px; transform: translateY(0); }
              }
            `}</style>
          </>
        )}
      </div>
    </aside>
  );
}
