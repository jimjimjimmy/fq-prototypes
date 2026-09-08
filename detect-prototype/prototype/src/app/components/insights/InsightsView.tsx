import { Fragment, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  Check,
  ChevronDown,
  ChevronRight,
  Columns3,
  ListFilter,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import {
  insights as seedInsights,
  entityShortName,
  type Insight,
  type InsightMissingTransaction,
  type InsightStatus,
} from '../../../data/insights';
import { team, getTeamMember, currentUserId } from '../../../data/team';
import { useAppStore } from '../../../store/useAppStore';
import { CommentsCard } from '../detail/CommentsCard';
import { ActivityCard } from '../detail/ActivityCard';
import { AssigneeReasonPopover } from '../shared/AssigneeReasonPopover';
import { FilterSortModal } from '../inbox/FilterSortModal';
import { InsightsFilterChips } from './InsightsFilterChips';

/**
 * Insights — top-level surface for AI-detected "expected but
 * missing" activity. Mirrors the Transactions tab's inbox + detail
 * structure but rolls everything up to the GL account level so the
 * inbox stays low-noise (Gaurav 5.14.26: "per-account basis,
 * because we don't want to create a ton of noise here").
 *
 * Layout:
 *   ┌────────────────────────────────────────────────────────────┐
 *   │ InsightsInbox (left rail)  │ InsightsDetail (middle)        │
 *   │                            │                                │
 *   │ Header: Insights · count   │ Account header + amount        │
 *   │ Search · Filter · Sort     │ Lookback context strip         │
 *   │ ─────────                  │ Missing transactions table     │
 *   │ Account row                │ Sign-off CTA                   │
 *   │ Account row [Redo]         │                                │
 *   │ Account row [Resolved]     │                                │
 *   └────────────────────────────────────────────────────────────┘
 *
 * The right rail (Assignees / Comments / Activity Log) is the next
 * phase — the existing Transactions components will be reused.
 */
export function InsightsView({
  selectedEntityId,
  selectedPeriodId,
}: {
  /** Active entity from the global toolbar selector. `'all'` shows
   *  every entity; otherwise the inbox filters to insights whose
   *  entityId matches. Mirrors the entity filter behavior on the
   *  Transactions tab. */
  selectedEntityId: string;
  /** Active period from the global toolbar selector ("YYYY-MM").
   *  Anchors the Current Period column in the missing-transactions
   *  table and the three historical comparisons that walk back
   *  from it. */
  selectedPeriodId: string;
}) {
  const [insights, setInsights] = useState<Insight[]>(seedInsights);
  const [selectedId, setSelectedId] = useState<string | null>(
    seedInsights[0]?.id ?? null,
  );

  // AI reveal flash on first mount — every Insight is AI-generated,
  // so every row gets the same purple-to-white fade-in the
  // Transactions inbox uses for AI-flagged rows. Settles after the
  // 2.4s animation completes.
  const [flashing, setFlashing] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setFlashing(false), 2400);
    return () => clearTimeout(t);
  }, []);

  // Edit Assignees modal — `editingAssigneesFor` holds the insight
  // id currently being edited (or null). Mirrors the Transactions
  // pattern (record-scoped) so the modal is keyed to a specific
  // insight even if the user navigates between rows.
  const [editingAssigneesFor, setEditingAssigneesFor] = useState<string | null>(
    null,
  );

  const updateAssignees = (insightId: string, newIds: string[]) => {
    setInsights((prev) =>
      prev.map((i) =>
        i.id !== insightId
          ? i
          : {
              ...i,
              assigneeIds: newIds,
              // Drop sign-offs for any member who's no longer
              // assigned. Signed-off members can't be removed via
              // the modal, so in practice this is a defensive
              // cleanup — covers edge cases where state diverges.
              signOffs: Object.fromEntries(
                Object.entries(i.signOffs ?? {}).filter(([memberId]) =>
                  newIds.includes(memberId),
                ),
              ),
            },
      ),
    );
    addActivity({
      recordId: insightId,
      byId: currentUserId,
      kind: 'assigned',
      message: 'Updated insight assignees.',
    });
  };

  // Filter against the global entity selector. `'all'` shows the
  // full list; otherwise scope to the chosen entity. We apply this
  // here (not inside InsightsInbox) so the detail-pane selection
  // logic can correctly drop into "no insight selected" when the
  // currently-selected insight is filtered out.
  const entityFilteredInsights = useMemo(
    () =>
      selectedEntityId === 'all'
        ? insights
        : insights.filter((i) => i.entityId === selectedEntityId),
    [insights, selectedEntityId],
  );

  // If the user switches entities and the currently-selected
  // insight isn't in the filtered list, auto-select the first row
  // (or clear selection if the new list is empty). Keeps the
  // detail pane in sync with whatever the inbox is showing.
  useEffect(() => {
    if (
      selectedId &&
      !entityFilteredInsights.some((i) => i.id === selectedId)
    ) {
      setSelectedId(entityFilteredInsights[0]?.id ?? null);
    }
  }, [entityFilteredInsights, selectedId]);

  const selected = useMemo(
    () => entityFilteredInsights.find((i) => i.id === selectedId) ?? null,
    [entityFilteredInsights, selectedId],
  );

  // Local status-mutation handlers. Insight rows stay in this
  // component (no Zustand slice) since Insights are scaffolded —
  // easy to lift later when persistence is wired. The Activity Log
  // for each insight, however, is written to the global store
  // (via addActivity) so the ActivityCard in the right rail picks
  // it up alongside the Transactions activity stream.
  const addActivity = useAppStore((s) => s.addActivity);

  // Derive the resolved-state from sign-offs. Mirrors the
  // Transactions pattern: a record is "resolved" once every
  // assignee has signed off (whether self or via override). This
  // is the source of truth — status === 'resolved' iff every
  // assignee has an entry in signOffs (and the insight isn't in
  // redo). When new findings surface, status flips to redo even
  // if sign-offs still exist, and those sign-offs are treated as
  // stale until re-attested.
  const recomputeStatus = (i: Insight): Insight => {
    if (i.status === 'redo') return i; // redo is sticky until resolved
    const signOffs = i.signOffs ?? {};
    const allSigned = i.assigneeIds.every((id) => !!signOffs[id]);
    return { ...i, status: allSigned ? 'resolved' : 'open' };
  };

  const toggleSignOff = (insightId: string, memberId: string) => {
    setInsights((prev) =>
      prev.map((i) => {
        if (i.id !== insightId) return i;
        const signOffs = { ...(i.signOffs ?? {}) };
        const existing = signOffs[memberId];
        if (existing) {
          delete signOffs[memberId];
        } else {
          signOffs[memberId] = {
            byId: currentUserId,
            at: new Date().toISOString(),
          };
        }
        // If we're in the redo state, accepting a fresh sign-off
        // also clears the redo flag for that line — the user is
        // re-attesting after seeing the new finding. The redo
        // remains until ALL assignees re-sign-off.
        let nextStatus: InsightStatus = i.status;
        let nextMissing = i.missingTransactions;
        if (i.status === 'redo' && !existing) {
          // re-attesting: clear isNew markers since the user has
          // now acknowledged the new items.
          const allSignedAfter = i.assigneeIds.every(
            (id) => !!signOffs[id],
          );
          if (allSignedAfter) {
            nextStatus = 'resolved';
            nextMissing = nextMissing.map((t) => ({ ...t, isNew: false }));
          }
        }
        const next: Insight = {
          ...i,
          signOffs,
          status: nextStatus,
          missingTransactions: nextMissing,
          resolvedById:
            nextStatus === 'resolved' ? currentUserId : undefined,
          resolvedAt:
            nextStatus === 'resolved' ? new Date().toISOString() : undefined,
        };
        return recomputeStatus(next);
      }),
    );
    addActivity({
      recordId: insightId,
      byId: currentUserId,
      kind: 'resolved',
      message: `Toggled sign-off for ${getTeamMember(memberId)?.name ?? memberId}.`,
    });
  };

  const markReviewed = (id: string) => {
    // Shortcut for "sign me off." Adds the current user's
    // attestation; status auto-flips to 'resolved' iff every
    // assignee has signed off.
    setInsights((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const signOffs = {
          ...(i.signOffs ?? {}),
          [currentUserId]: {
            byId: currentUserId,
            at: new Date().toISOString(),
          },
        };
        const allSigned = i.assigneeIds.every((aid) => !!signOffs[aid]);
        const nextStatus: InsightStatus = allSigned ? 'resolved' : 'open';
        return {
          ...i,
          signOffs,
          status: nextStatus,
          resolvedById: allSigned ? currentUserId : undefined,
          resolvedAt: allSigned ? new Date().toISOString() : undefined,
          missingTransactions: allSigned
            ? i.missingTransactions.map((t) => ({ ...t, isNew: false }))
            : i.missingTransactions,
        };
      }),
    );
    addActivity({
      recordId: id,
      byId: currentUserId,
      kind: 'resolved',
      message: 'Marked insight as reviewed.',
    });
  };

  return (
    <div className="flex min-h-0 flex-1 bg-white">
      <InsightsInbox
        insights={entityFilteredInsights}
        selectedId={selectedId}
        onSelect={setSelectedId}
        flashing={flashing}
      />
      <InsightsDetail
        insight={selected}
        selectedPeriodId={selectedPeriodId}
        onToggleSignOff={(memberId) =>
          selected && toggleSignOff(selected.id, memberId)
        }
        onEditAssignees={() =>
          selected && setEditingAssigneesFor(selected.id)
        }
      />

      {/* Edit Assignees modal — mounted at the InsightsView level
           so it overlays the entire detail surface (not constrained
           to the right rail). Mirrors the Transactions DetailPanel
           pattern. */}
      {editingAssigneesFor &&
        (() => {
          const insightBeingEdited = insights.find(
            (i) => i.id === editingAssigneesFor,
          );
          if (!insightBeingEdited) return null;
          return (
            <InsightAssigneeModal
              insight={insightBeingEdited}
              onClose={() => setEditingAssigneesFor(null)}
              onSave={(ids) => {
                updateAssignees(editingAssigneesFor, ids);
                setEditingAssigneesFor(null);
              }}
            />
          );
        })()}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// Inbox rail
// ══════════════════════════════════════════════════════════════════

function InsightsInbox({
  insights,
  selectedId,
  onSelect,
  flashing,
}: {
  insights: Insight[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** When true, every visible row plays the AI-reveal purple flash
   *  animation. Mirrors the Transactions inbox' AI-fade-in pattern.
   *  Driven by InsightsView's `flashing` state which auto-clears
   *  after the animation completes. */
  flashing: boolean;
}) {
  // Inbox-local filter state. Per Gaurav 5.18.2026 sync, the
  // status filter is now a tab row (Open · Resolved) with count
  // pills, replacing the previous Include Resolved toggle. We
  // derive the active tab from the shared store filter so that
  // "Clear all" (which resets filters.view to 'open') auto-syncs
  // the tab UI back to Open.
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const setFilters = useAppStore((s) => s.setFilters);

  // Global store filters + sort (driven by the Sort and Filter
  // modal). Defaults to amount-desc when the user hasn't picked a
  // sort yet — matches the modal's implicit default selection so
  // the inbox always shows the largest expected gap first.
  const filters = useAppStore((s) => s.filters);
  const sortBy = filters.sortBy ?? 'amount';
  const sortDir = filters.sortDir ?? 'desc';

  // Active tab derives from the shared filters.view so the Insights
  // inbox stays in lockstep with whatever the user sets (Clear all
  // resets filters.view to 'open' — that lands the tab back on Open).
  const activeTab: 'open' | 'resolved' | 'all' =
    filters.view === 'resolved'
      ? 'resolved'
      : filters.view === 'all'
        ? 'all'
        : 'open';
  const setActiveTab = (next: 'open' | 'resolved' | 'all') => {
    setFilters({ view: next });
  };

  // Tab counts — computed against the insight pool with every active
  // filter applied EXCEPT the status tab itself. So if the user
  // searches "AWS" or picks an assignee, the pills show how many of
  // those matches are open vs resolved, not the global totals.
  const tabPool = useMemo(() => {
    const q = search.trim().toLowerCase();
    return insights.filter((i) => {
      if (q) {
        const hit =
          i.accountCode.toLowerCase().includes(q) ||
          i.accountName.toLowerCase().includes(q);
        if (!hit) return false;
      }
      if (
        filters.assigneeId?.length &&
        !i.assigneeIds.some((id) => filters.assigneeId!.includes(id))
      ) {
        return false;
      }
      if (
        filters.accountCode?.length &&
        !filters.accountCode.includes(i.accountCode)
      ) {
        return false;
      }
      if (
        filters.entityId?.length &&
        !filters.entityId.includes(i.entityId)
      ) {
        return false;
      }
      return true;
    });
  }, [insights, search, filters]);

  const openCount = tabPool.filter((i) => i.status !== 'resolved').length;
  const resolvedCount = tabPool.filter((i) => i.status === 'resolved').length;

  const visibleInsights = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = insights.filter((i) => {
      // Local status tab — Open hides resolved rows, Resolved
      // shows only resolved.
      if (activeTab === 'open' && i.status === 'resolved') return false;
      if (activeTab === 'resolved' && i.status !== 'resolved') return false;

      // Local search box — account code OR name substring match.
      if (q) {
        const hit =
          i.accountCode.toLowerCase().includes(q) ||
          i.accountName.toLowerCase().includes(q);
        if (!hit) return false;
      }

      // Modal filters — each clause skips when unset.
      if (filters.view === 'open' && i.status === 'resolved') return false;
      if (filters.view === 'resolved' && i.status !== 'resolved') return false;
      if (
        filters.assigneeId?.length &&
        !i.assigneeIds.some((id) => filters.assigneeId!.includes(id))
      ) {
        return false;
      }
      if (
        filters.accountCode?.length &&
        !filters.accountCode.includes(i.accountCode)
      ) {
        return false;
      }
      if (
        filters.entityId?.length &&
        !filters.entityId.includes(i.entityId)
      ) {
        return false;
      }

      return true;
    });

    // Sort — amount (default) or account code, asc/desc.
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...list].sort((a, b) => {
      if (sortBy === 'account') {
        return a.accountCode.localeCompare(b.accountCode) * dir;
      }
      // Amount is the default Insights sort.
      return (a.totalAmount - b.totalAmount) * dir;
    });
  }, [insights, activeTab, search, filters, sortBy, sortDir]);

  return (
    <aside className="flex h-full w-[420px] shrink-0 flex-col border-r border-[#e1e6ef] bg-white">
      {/* Header — two rows.
            Row 1: title (left) + "Showing N of N" count (right, inline).
            Row 2: search input + filter icon, side-by-side. Mirrors
            the Transactions inbox header for consistency. */}
      <div className="flex flex-col gap-3 border-b border-[#e1e6ef] px-6 py-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-header text-base font-bold leading-5 text-[#1d2433]">
            Insights
          </h2>
          <p className="shrink-0 font-['Inter'] text-[11px] leading-4 text-[#adb2bb]">
            Showing {visibleInsights.length} of {insights.length} total
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search input — matches account code or name. */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 text-[#adb2bb]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for..."
              className="h-10 w-full rounded-md border border-[#e1e6ef] bg-white pl-9 pr-2 font-['Inter'] text-xs font-normal leading-4 text-[#1d2433] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] placeholder:text-[#adb2bb] focus:border-[#3d7bf7] focus:outline-none"
            />
          </div>

          {/* Sort and Filter trigger — inline with the search input. */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => setShowFilters((v) => !v)}
                aria-label="Sort and Filter"
                className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border transition-colors ${
                  showFilters
                    ? 'border-[#cbd2e1] bg-[#f1f3f9] text-[#1d2433]'
                    : 'border-[#e1e6ef] bg-white text-[#6b7280] hover:border-[#cbd2e1] hover:text-[#1d2433]'
                }`}
              >
                <ListFilter className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Sort and Filter</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Active filter chips — only the Insights-applicable subset
           (assignee, account, status, entity, period). Sits below
           the header, spans the inbox width, hidden when no filters
           are applied. */}
      <InsightsFilterChips filters={filters} />

      {/* Status tab row — Open · Resolved, each with a count pill.
           Per Gaurav 5.18.2026: "Just open and Resolved. Just a
           total count of the two." Replaces the prior Include
           Resolved toggle — clicking a tab filters the inbox to
           that status. Borrowed from the file's Transactions
           reference frame at 50:6197. */}
      <div className="flex shrink-0 items-end gap-6 border-b border-[#e1e6ef] px-6">
        {([
          { key: 'all', label: 'All', count: openCount + resolvedCount },
          { key: 'open', label: 'Open', count: openCount },
          { key: 'resolved', label: 'Resolved', count: resolvedCount },
        ] as const).map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
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

      {/* Row list */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {visibleInsights.length === 0 ? (
          <p className="px-6 py-8 text-center font-['Inter'] text-xs font-normal leading-4 text-[#adb2bb]">
            No insights match your filters.
          </p>
        ) : (
          visibleInsights.map((insight) => (
            <InsightRow
              key={insight.id}
              insight={insight}
              selected={insight.id === selectedId}
              onClick={() => onSelect(insight.id)}
              flashing={flashing}
            />
          ))
        )}
      </div>

      {/* Sort and Filter modal — variant="insights" tailors the
           available sort options (Amount, Account; Amount default)
           and removes the Transaction-only filter rows (anomaly
           type, transaction type, transaction date). The modal
           still writes to the global Transactions filter store
           until we split filter state per surface, so picks here
           flow through there. */}
      <FilterSortModal
        open={showFilters}
        onClose={() => setShowFilters(false)}
        variant="insights"
      />
    </aside>
  );
}

// ──────────────────────────────────────────────────────────────────
// Inbox row — per-account roll-up. Visual structure mirrors the
// Transactions InboxCard:
//   • Same row shell: full-width button, bottom border, px-6 py-4,
//     bg-white default / bg-slate-50 hover / bg-[#F1F3F9] selected.
//   • Left content stack:
//       Line 1 — account code · account name (the unit of work)
//       Line 2 — entity short name
//       Line 3 — "N potentially missing entries" (matches the
//                "1 anomaly" line on Transactions cards)
//   • Right rail: amount on top, status pill below (Transactions
//     stacks amount + severity badge in the same shape).
// ──────────────────────────────────────────────────────────────────

function InsightRow({
  insight,
  selected,
  onClick,
  flashing,
}: {
  insight: Insight;
  selected: boolean;
  onClick: () => void;
  flashing: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'block w-full border-b border-[#e1e6ef] px-6 py-4 text-left',
        flashing
          ? '[animation:insight-ai-flash_2400ms_cubic-bezier(0.2,0,0,1)_both]'
          : 'transition-colors',
        flashing
          ? ''
          : selected
            ? 'bg-[#F1F3F9]'
            : 'bg-white hover:bg-slate-50',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Keyframes scoped per card so the row's purple-to-white
           fade-in works without depending on a parent stylesheet.
           Mirrors the Transactions InboxCard pattern (same color
           ramp, same easing, same 2.4s duration). */}
      <style>{`
        @keyframes insight-ai-flash {
          0%   { background-color: rgba(168, 85, 247, 0.18); }
          25%  { background-color: rgba(168, 85, 247, 0.12); }
          100% { background-color: rgba(255, 255, 255, 1); }
        }
      `}</style>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          {/* Line 1 — account formatted "{code} {name}" with just a
               space separator, matching the convention used by the
               Transactions inbox card, GL Impact table, and other
               account-display surfaces across the prototype. Both
               halves render at the same semibold weight since they
               read as a single account identifier. */}
          <div className="truncate font-['Inter'] text-xs font-semibold leading-4 text-[#1d2433]">
            {insight.accountCode} {insight.accountName}
          </div>

          {/* Line 2 — entity. Renders in the lighter neutral
               `text-[#adb2bb]` that the Transactions inbox uses for
               the second line (TruncatableAccountLine). Subtler
               than the row's primary text so the entity reads as
               supporting context. */}
          <div className="mt-0.5 truncate font-['Inter'] text-xs font-normal leading-4 text-[#adb2bb]">
            {entityShortName(insight)}
          </div>
        </div>

        {/* Right rail — stat-style suggestion count above the
             status pill. The count is the actionable signal: how
             big a triage am I facing? On resolved insights, the
             stat is hidden — the green check stamp carries the
             "this row is done" read on its own; pairing it with a
             count would imply there's still work left to do. */}
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          {insight.status !== 'resolved' && (
            <div className="flex flex-col items-end leading-tight">
              <span className="font-['Inter'] text-[18px] font-bold leading-6 tabular-nums text-[#1d2433]">
                {insight.missingCount}
              </span>
              <span className="font-['Inter'] text-[10px] font-medium leading-[14px] uppercase tracking-[0.06em] text-[#6b7280]">
                {insight.missingCount === 1 ? 'suggestion' : 'suggestions'}
              </span>
            </div>
          )}
          <InsightStatusPill status={insight.status} />
        </div>
      </div>
    </button>
  );
}

function InsightStatusPill({ status }: { status: InsightStatus }) {
  // Resolved uses the same filled green check-stamp as the
  // Transactions inbox so "this row is done" reads consistently
  // across surfaces. Open and Redo render no pill — Open is the
  // default state, and the Redo state surfaces through richer
  // affordances on the detail pane (amber alert banner, amber
  // stale sign-off toggles, "New" pill + amber row background
  // on the surfaced transaction).
  if (status === 'resolved') {
    return (
      <span
        aria-label="Resolved"
        title="Resolved"
        className="inline-flex items-center justify-center rounded-full bg-[#1FAC76] p-1 text-white"
      >
        <Check className="h-2.5 w-2.5" strokeWidth={2.5} />
      </span>
    );
  }
  return null;
}

// ══════════════════════════════════════════════════════════════════
// Missing-transactions table helpers
// ──────────────────────────────────────────────────────────────────
// Each row shows three historical reference periods plus the
// current period (where Detect didn't find the posting it expected).
// Anchored to the current prototype month (May 2026): prior month =
// March 2026, prior quarter = January 2026, prior year = April 2025.
//
// Department is sourced from a vendor-name lookup map. Keeps the
// data file lean — adding a column shouldn't mean touching 40+
// seed rows.
// ══════════════════════════════════════════════════════════════════

const VENDOR_DEPARTMENT: Record<string, string> = {
  'Amazon Web Services': 'Engineering',
  'Google Cloud Platform': 'Engineering',
  'Snowflake': 'Engineering',
  'Datadog': 'Engineering',
  'Salesforce': 'Sales',
  'Slack Technologies': 'G&A',
  'Adobe Creative Cloud': 'Marketing',
  'Figma': 'Design',
  'Notion Labs': 'G&A',
  'GitHub Enterprise': 'Engineering',
  'Google Ads': 'Marketing',
  'LinkedIn Marketing': 'Marketing',
  'Meta Business Suite': 'Marketing',
  'Deloitte Consulting': 'Finance',
  'PwC Advisory': 'Finance',
  'KPMG Advisory': 'Finance',
  'British Gas': 'Facilities',
  'EDF Energy': 'Facilities',
  'Thames Water': 'Facilities',
  'Linear': 'Engineering',
  'Loom': 'G&A',
  '1Password': 'IT',
  'Vercel': 'Engineering',
  'Sentry': 'Engineering',
  'PagerDuty': 'Engineering',
  'Mixpanel': 'Product',
  'Intercom': 'Customer Success',
  'Wilson Sonsini Goodrich & Rosati': 'Legal',
  'Latham & Watkins': 'Legal',
  'Cloudflare': 'Engineering',
  'MongoDB Atlas': 'Engineering',
  'Stripe': 'Finance',
  'PayPal': 'Finance',
  'Chubb Insurance': 'Finance',
  'Air Canada': 'Sales',
  'WestJet': 'Sales',
  'Porter Airlines': 'Sales',
  'Brookfield Properties': 'Facilities',
  'ExCeL London': 'Marketing',
  'Eventbrite UK': 'Marketing',
  'Heidrick & Struggles': 'People',
  'Korn Ferry': 'People',
  'AIG': 'Finance',
};

/** Three reference periods for the historical comparison columns.
 *  Anchored to the current prototype month (May 2026): prior year
 *  is Apr 2025, prior quarter is Jan 2026, prior month is Mar 2026.
 *  Amounts are derived from each row's averageHistorical with a
 *  small seasonality variation so the columns don't read as
 *  identical. */
function referenceAmounts(row: InsightMissingTransaction) {
  const base = row.averageHistorical ?? row.amount;
  return {
    priorYear: Math.round(base * 0.88),
    priorQuarter: Math.round(base * 0.95),
    priorMonth: Math.round(base),
  };
}

function formatMoney(n: number) {
  return `$${n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function shiftMonth(year: number, monthIdx: number, monthsBack: number) {
  const total = year * 12 + monthIdx - monthsBack;
  return { year: Math.floor(total / 12), monthIdx: ((total % 12) + 12) % 12 };
}

function parsePeriodId(periodId: string): { year: number; monthIdx: number } | null {
  const m = /^(\d{4})-(\d{2})$/.exec(periodId);
  if (!m) return null;
  return { year: Number(m[1]), monthIdx: Number(m[2]) - 1 };
}

function monthIdToLabel(monthId: string): string {
  const p = parsePeriodId(monthId);
  if (!p) return monthId;
  return `${MONTH_NAMES[p.monthIdx]} ${p.year}`;
}

/** Returns "YYYY-MM" for a month N months before the current period. */
function monthsBack(periodId: string, n: number): string {
  const p = parsePeriodId(periodId);
  if (!p) return periodId;
  const shifted = shiftMonth(p.year, p.monthIdx, n);
  return `${shifted.year}-${String(shifted.monthIdx + 1).padStart(2, '0')}`;
}

/** Default comparison months relative to the selected period:
 *  prior month (-1), same month prior quarter (-3), same month prior year (-12). */
function defaultComparisonMonths(periodId: string): string[] {
  return [monthsBack(periodId, 1), monthsBack(periodId, 3), monthsBack(periodId, 12)];
}

/** Build the picker options: last 24 months before the current period,
 *  newest first. */
function comparisonMonthOptions(periodId: string): { id: string; label: string }[] {
  const p = parsePeriodId(periodId);
  if (!p) return [];
  const out: { id: string; label: string }[] = [];
  for (let n = 1; n <= 24; n++) {
    const s = shiftMonth(p.year, p.monthIdx, n);
    const id = `${s.year}-${String(s.monthIdx + 1).padStart(2, '0')}`;
    out.push({ id, label: `${MONTH_NAMES[s.monthIdx]} ${s.year}` });
  }
  return out;
}

/** Synthetic but deterministic amount for an arbitrary historical month,
 *  given a row. For the three "canonical" offsets (1/3/12 months back)
 *  we keep the existing referenceAmounts values so the picker default
 *  matches what users already saw. For other months we vary base by a
 *  stable hash so the numbers stay realistic and don't all read identical. */
function amountForMonth(
  row: InsightMissingTransaction,
  monthId: string,
  periodId: string,
): number {
  const refs = referenceAmounts(row);
  if (monthId === monthsBack(periodId, 1)) return refs.priorMonth;
  if (monthId === monthsBack(periodId, 3)) return refs.priorQuarter;
  if (monthId === monthsBack(periodId, 12)) return refs.priorYear;
  const base = row.averageHistorical ?? row.amount;
  const h = hashId(`${row.id}:${monthId}`);
  // 0.70 – 1.10 range so prior months read varied but plausible
  const factor = 0.7 + ((Math.abs(h) % 41) / 100);
  return Math.round(base * factor);
}

/** Resolve the four reference-period labels (current, prior month,
 *  prior quarter, prior year) from the global period-selector id.
 *  Expects "YYYY-MM" — falls back to a no-op label set if the id
 *  doesn't parse.
 */
function periodLabels(periodId: string) {
  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const formatYM = (year: number, monthIdx: number) =>
    `${MONTHS[monthIdx]} ${year}`;
  const shift = (year: number, monthIdx: number, monthsBack: number) => {
    const total = year * 12 + monthIdx - monthsBack;
    return { year: Math.floor(total / 12), monthIdx: ((total % 12) + 12) % 12 };
  };
  const m = /^(\d{4})-(\d{2})$/.exec(periodId);
  if (!m) {
    return {
      current: periodId,
      priorMonth: '',
      priorQuarter: '',
      priorYear: '',
    };
  }
  const year = Number(m[1]);
  const monthIdx = Number(m[2]) - 1;
  const pm = shift(year, monthIdx, 1);
  const pq = shift(year, monthIdx, 3);
  const py = shift(year, monthIdx, 12);
  return {
    current: formatYM(year, monthIdx),
    priorMonth: formatYM(pm.year, pm.monthIdx),
    priorQuarter: formatYM(pq.year, pq.monthIdx),
    priorYear: formatYM(py.year, py.monthIdx),
  };
}

/** Cheap, stable hash so each row picks the same reasoning
 *  archetype across renders. */
function hashId(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** A reasoning archetype tells a distinct story about why the AI
 *  surfaced this row. Each row is mapped to exactly one archetype
 *  via a stable hash of its id, so different vendors get different
 *  narratives even when the underlying data shape is identical.
 *  `prose` is the body text, `actions` are the suggested-next-step
 *  CTAs to render beneath. */
type ReasoningAction = {
  label: string;
  primary?: boolean;
};
type Reasoning = {
  prose: ReactNode;
  actions: ReasoningAction[];
};

function reasoningForRow(
  row: InsightMissingTransaction,
  insight: Insight,
  dept: string,
  currentLabel: string,
  priorMonthLabel: string,
): Reasoning {
  const accountLabel = `${insight.accountCode} ${insight.accountName}`;
  const archetypes: Reasoning[] = [
    // 0 — Monthly cadence, missed posting window
    {
      prose: (
        <>
          {row.vendor} bills{' '}
          <span className="font-semibold text-[#1d2433]">monthly</span>,
          typically posting between the{' '}
          <span className="font-semibold text-[#1d2433]">1st and 5th</span>
          . {currentLabel} is past that window and{' '}
          {accountLabel} has no matching entry — likely a late
          invoice rather than a discontinued vendor.
        </>
      ),
      actions: [
        { label: 'Create accrual JE', primary: true },
        { label: 'Reach out to vendor' },
        { label: 'Dismiss as expected' },
      ],
    },
    // 1 — Recurring contract / auto-renewal
    {
      prose: (
        <>
          {row.vendor} is on a{' '}
          <span className="font-semibold text-[#1d2433]">
            recurring annual contract
          </span>{' '}
          for {accountLabel}. Last renewal posted in {priorMonthLabel}.
          The current period would mark the next expected charge, but
          no posting has been ingested yet.
        </>
      ),
      actions: [
        { label: 'Check renewal status', primary: true },
        { label: 'Create accrual JE' },
        { label: 'Dismiss as expected' },
      ],
    },
    // 2 — Cross-vendor / ingestion signal
    {
      prose: (
        <>
          Three other {dept} vendors are also missing postings for{' '}
          {currentLabel} on {accountLabel}. This pattern often points
          to an{' '}
          <span className="font-semibold text-[#1d2433]">
            upstream ingestion delay
          </span>{' '}
          (ERP sync, mailroom backlog) rather than a vendor-level
          gap.
        </>
      ),
      actions: [
        { label: 'Verify ingestion job', primary: true },
        { label: 'Re-run sync' },
        { label: 'Dismiss for now' },
      ],
    },
    // 3 — Recently active / probationary vendor
    {
      prose: (
        <>
          {row.vendor} only became active in {accountLabel} in the
          last{' '}
          <span className="font-semibold text-[#1d2433]">
            8 months
          </span>{' '}
          and has posted in 8 of those 8 cycles. {currentLabel} would
          be the 9th — Detect flagged this since dropping a recently
          consistent vendor is uncommon.
        </>
      ),
      actions: [
        { label: 'Reach out to vendor', primary: true },
        { label: 'Create accrual JE' },
        { label: 'Dismiss as expected' },
      ],
    },
    // 4 — High variance, but recent trend exceeded
    {
      prose: (
        <>
          {row.vendor}'s postings to {accountLabel} have averaged{' '}
          <span className="font-semibold text-[#1d2433]">
            {formatMoney(row.amount)}
          </span>{' '}
          over the trailing 3 periods with low variance (±4%). A
          missing entry of this size will materially understate
          {' '}{accountLabel} for the close.
        </>
      ),
      actions: [
        { label: 'Create accrual JE', primary: true },
        { label: 'Reach out to AP team' },
        { label: 'Dismiss as expected' },
      ],
    },
  ];
  return archetypes[hashId(row.id) % archetypes.length];
}

// ══════════════════════════════════════════════════════════════════
// Detail middle pane
// ══════════════════════════════════════════════════════════════════

function InsightsDetail({
  insight,
  selectedPeriodId,
  onToggleSignOff,
  onEditAssignees,
}: {
  insight: Insight | null;
  selectedPeriodId: string;
  onToggleSignOff: (memberId: string) => void;
  onEditAssignees: () => void;
}) {
  const labels = periodLabels(selectedPeriodId);
  // Comparison months — user-customizable, max 3. Defaults to the
  // historical three (prior month, same month prior quarter, same
  // month prior year). Re-derives whenever the global period changes
  // so the table starts from a sensible state each time.
  const [comparisonMonths, setComparisonMonths] = useState<string[]>(() =>
    defaultComparisonMonths(selectedPeriodId),
  );
  useEffect(() => {
    setComparisonMonths(defaultComparisonMonths(selectedPeriodId));
  }, [selectedPeriodId]);
  const [columnsPickerOpen, setColumnsPickerOpen] = useState(false);
  const toggleComparisonMonth = (monthId: string) => {
    setComparisonMonths((prev) => {
      if (prev.includes(monthId)) {
        return prev.filter((m) => m !== monthId);
      }
      if (prev.length >= 3) return prev;
      // Keep chronological order (most recent first) so the table
      // reads left-to-right oldest data on the right.
      return [...prev, monthId].sort((a, b) => (a < b ? 1 : a > b ? -1 : 0));
    });
  };
  // Expanded-row state for the missing-transactions table. Each
  // row toggles a "Why this suggestion" panel below itself. Keyed
  // by row id and scoped to the currently selected insight; reset
  // whenever the user navigates to a different insight so an open
  // row doesn't bleed across selections.
  const [expandedRowIds, setExpandedRowIds] = useState<Set<string>>(
    () => new Set(),
  );
  useEffect(() => {
    setExpandedRowIds(new Set());
  }, [insight?.id]);
  const toggleRow = (rowId: string) => {
    setExpandedRowIds((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  };

  if (!insight) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#f8fafc] text-[#6b7280]">
        <p className="font-['Inter'] text-sm">Select an insight to view details.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 overflow-y-auto bg-[#f8fafc]">
      {/* Outer page padding — mirrors the Transactions DetailPanel
           wrapper (px-6 pb-6 pt-4) so both surfaces sit on the same
           visual rhythm. */}
      <div className="flex w-full flex-col gap-6 px-6 pb-6 pt-4">
        {/* Two-column inner layout — main white card + right rail.
             Mirrors the Transactions DetailPanel pattern exactly. */}
        <div className="flex flex-col items-stretch gap-6 xl:flex-row xl:items-start">
        <article className="min-w-0 flex-1 overflow-hidden rounded-lg border border-neutral-200 bg-white">
          {/* Header — account identity + amount + status pill. Same
               px-6 py-4 box + divider-below pattern Transactions
               uses for its anomaly title row. */}
          {/* Header — pared down to the account identity only. The
               entity, total amount, and missing-transaction count
               are already covered by the inbox row + the AI summary
               card + the missing-transactions table below, so the
               header just anchors which account this insight is
               about. Status pill stays inline since it's a state
               affordance, not a content fact. */}
          <header className="flex items-center justify-between gap-3 px-6 py-4">
            <h1 className="min-w-0 truncate font-header text-base font-bold leading-5 text-[#1d2433]">
              {insight.accountCode} {insight.accountName}
            </h1>
            <InsightStatusPill status={insight.status} />
          </header>

          <div className="border-t border-[#e1e6ef]" />

          {/* Body — AI summary, lookback strip, missing transactions
               table, footer actions. Same px-6 py-4 inner box the
               Transactions card uses below its header divider. */}
          <div className="flex flex-col gap-6 px-6 py-4">
          {/* AI summary card — one-sentence framing per Gaurav:
               "we just need a sentence pointing the customer in a
               direction." Border uses the FlowUI AI-primary purple
               (#7c3aed); Sparkles icon sits bare next to the prose
               (no circular background) so the banner stays compact
               and reads as a single horizontal strip. */}
          <div className="flex items-center gap-3 rounded-md border border-[#7c3aed] bg-[#faf5ff] px-4 py-3">
            <Sparkles
              className="h-4 w-4 shrink-0 text-[#7c3aed]"
              strokeWidth={2}
            />
            <p className="font-['Inter'] text-[12px] font-normal leading-[18px] text-[#1d2433]">
              {insight.summary}
            </p>
          </div>

          {/* Missing transactions table — sticky gray header, 42px
               row height, neutral borders. Each row is expandable:
               clicking the chevron (or the row) toggles a "Why
               this suggestion" panel below the row showing the
               historical comparison Detect used. Columns now show
               three explicit reference periods plus the 3-month
               average that drives the expectation. */}
          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="font-header text-sm font-bold leading-5 text-[#1d2433]">
                Missing Transactions
              </h2>
              <Popover open={columnsPickerOpen} onOpenChange={setColumnsPickerOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-7 items-center gap-1.5 rounded-md border border-[#cbd2e1] bg-white px-2.5 font-['Inter'] text-[12px] font-medium leading-4 text-[#424867] transition-colors hover:border-[#6b7280] hover:text-[#1d2433]"
                  >
                    <Columns3 className="h-3.5 w-3.5" strokeWidth={2} />
                    <span>Compare months</span>
                    <span className="text-[#6b7280]">({comparisonMonths.length}/3)</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-[240px] p-0">
                  <div className="border-b border-[#e1e6ef] px-3 py-2">
                    <p className="font-['Inter'] text-[11px] font-semibold leading-4 text-[#1d2433]">
                      Compare against (max 3)
                    </p>
                    <p className="font-['Inter'] text-[11px] font-normal leading-4 text-[#6b7280]">
                      {comparisonMonths.length} of 3 selected
                    </p>
                  </div>
                  <div className="max-h-[280px] overflow-y-auto py-1">
                    {comparisonMonthOptions(selectedPeriodId).map((opt) => {
                      const checked = comparisonMonths.includes(opt.id);
                      const disabled = !checked && comparisonMonths.length >= 3;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={disabled}
                          onClick={() => toggleComparisonMonth(opt.id)}
                          className={[
                            'flex w-full items-center gap-2 px-3 py-1.5 text-left font-[\'Inter\'] text-[12px] leading-4 transition-colors',
                            disabled
                              ? 'cursor-not-allowed text-[#adb2bb]'
                              : 'text-[#1d2433] hover:bg-[#f1f3f9]',
                          ].join(' ')}
                        >
                          <span
                            className={[
                              'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                              checked
                                ? 'border-[#1FAC76] bg-[#1FAC76] text-white'
                                : 'border-[#cbd2e1] bg-white',
                            ].join(' ')}
                          >
                            {checked && <Check className="h-3 w-3" strokeWidth={3} />}
                          </span>
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="overflow-x-auto rounded-md border border-[#e1e6ef] bg-white">
              <table className="w-full font-['Inter']">
                <thead>
                  {/* Single header row. Two-line cells: bold date on
                       top, muted role descriptor below (per Gaurav
                       5.15.2026). Column order: Current Period and
                       Expected Amount sit together as the focal
                       "actual vs expected" pair, followed by the
                       three historical references walking back in
                       time (Prior Month → Prior Quarter Same Month
                       → Prior Year). */}
                  <tr>
                    <th className="sticky top-0 z-10 h-[50px] border-b border-[#e1e6ef] bg-[#f8fafc] px-4 text-left text-[12px] font-semibold leading-4 text-[#1b1f27]">
                      Vendor
                    </th>
                    <th className="sticky top-0 z-10 h-[50px] w-[140px] border-b border-[#e1e6ef] bg-[#f8fafc] px-4 text-left text-[12px] font-semibold leading-4 text-[#1b1f27]">
                      Department
                    </th>
                    <th className="sticky top-0 z-10 h-[50px] w-[140px] border-b border-[#e1e6ef] bg-[#f8fafc] px-4 text-right text-[12px] font-semibold leading-4 text-[#1b1f27]">
                      <div className="flex flex-col items-end leading-tight">
                        <span>{labels.current}</span>
                        <span className="font-normal text-[11px] text-[#6b7280]">Current Period</span>
                      </div>
                    </th>
                    {comparisonMonths.map((monthId) => (
                      <th
                        key={monthId}
                        className="sticky top-0 z-10 h-[50px] w-[140px] border-b border-[#e1e6ef] bg-[#f8fafc] px-4 text-right text-[12px] font-semibold leading-4 text-[#1b1f27]"
                      >
                        <span>{monthIdToLabel(monthId)}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {insight.missingTransactions.map((row, idx) => {
                    const lastDataIdx =
                      insight.missingTransactions.length - 1;
                    const isLast = idx === lastDataIdx;
                    const isExpanded = expandedRowIds.has(row.id);
                    // Row borders: a thin neutral separator between
                    // rows. The final row drops its bottom border —
                    // the table container's own border carries the
                    // closing edge. Expanded rows hand the bottom
                    // border off to the expansion row below.
                    const borderClass = isExpanded
                      ? ''
                      : isLast
                        ? ''
                        : 'border-b border-[#e1e6ef]';
                    const expansionBorderClass = isLast
                      ? ''
                      : 'border-b border-[#e1e6ef]';
                    // `isNew` rows render with the amber redo
                    // background; everyone else gets white.
                    const rowBg = row.isNew ? 'bg-[#fff8eb]' : 'bg-white';
                    const dept =
                      VENDOR_DEPARTMENT[row.vendor] ?? '—';
                    const amounts = referenceAmounts(row);
                    return (
                      <Fragment key={row.id}>
                        <tr className={`${rowBg} transition-colors`}>
                          <td
                            className={`${borderClass} px-4 py-3 text-[12px] font-semibold leading-4 text-[#424867] align-top`}
                          >
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <span className="truncate">{row.vendor}</span>
                                {row.isNew && (
                                  <span className="shrink-0 inline-flex items-center rounded-[4px] bg-[#db7712] px-1.5 py-0.5 font-['Inter'] text-[10px] font-semibold leading-[14px] text-white">
                                    New
                                  </span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => toggleRow(row.id)}
                                aria-expanded={isExpanded}
                                className="inline-flex items-center gap-1 self-start whitespace-nowrap font-['Inter'] text-[11px] font-normal leading-4 text-[#6b7280] transition-colors hover:text-[#1d2433]"
                              >
                                {isExpanded ? (
                                  <ChevronDown
                                    className="h-3 w-3 shrink-0"
                                    strokeWidth={2}
                                  />
                                ) : (
                                  <ChevronRight
                                    className="h-3 w-3 shrink-0"
                                    strokeWidth={2}
                                  />
                                )}
                                Why this suggestion?
                              </button>
                            </div>
                          </td>
                          <td
                            className={`${borderClass} h-[42px] px-4 py-3 text-[12px] font-normal leading-4 text-[#424867]`}
                          >
                            {dept}
                          </td>
                          <td
                            className={`${borderClass} h-[42px] px-4 py-3 text-right text-[12px] font-semibold leading-4 text-[#1d2433] tabular-nums`}
                          >
                            {formatMoney(row.amount)}
                          </td>
                          {comparisonMonths.map((monthId) => (
                            <td
                              key={monthId}
                              className={`${borderClass} h-[42px] px-4 py-3 text-right text-[12px] font-medium leading-4 text-[#1d2433] tabular-nums`}
                            >
                              {formatMoney(amountForMonth(row, monthId, selectedPeriodId))}
                            </td>
                          ))}
                        </tr>
                        {isExpanded && (() => {
                          const reasoning = reasoningForRow(
                            row,
                            insight,
                            dept,
                            labels.current,
                            labels.priorMonth,
                          );
                          return (
                            <tr className="bg-[#f8fafc]">
                              <td
                                colSpan={3 + comparisonMonths.length}
                                className={`${expansionBorderClass} px-6 py-4`}
                              >
                                <div className="flex flex-col gap-3">
                                  <p className="font-['Inter'] text-[12px] font-normal leading-[18px] text-[#424867]">
                                    {reasoning.prose}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-['Inter'] text-[11px] font-medium leading-4 text-[#6b7280]">
                                      Suggested next step:
                                    </span>
                                    {reasoning.actions.map((a) => (
                                      <button
                                        key={a.label}
                                        type="button"
                                        className={
                                          a.primary
                                            ? "inline-flex h-7 items-center rounded-md bg-[#1FAC76] px-3 font-header text-[11px] font-bold leading-4 text-white transition-colors hover:bg-[#1c895f]"
                                            : "inline-flex h-7 items-center rounded-md border border-[#cbd2e1] bg-white px-3 font-header text-[11px] font-bold leading-4 text-[#424867] transition-colors hover:border-[#6b7280] hover:text-[#1d2433]"
                                        }
                                      >
                                        {a.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })()}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          </div>{/* end card body */}
        </article>

        {/* Right rail — Assignees, Comments, Activity Log. Comments
             and Activity reuse the existing Transactions components
             keyed by the insight's id (the store accepts opaque
             record ids, so insight-scoped threads stay separate
             from transaction threads automatically). */}
        {/* Right rail width pinned to xl:w-[480px] to match the
             Transactions DetailPanel sidebar. Lets the AssigneesCard
             use the same 3-column grid widths (w-40 / toggle / w-40)
             without overflowing. */}
        <aside className="flex w-full shrink-0 flex-col gap-4 xl:w-[480px]">
          <InsightAssigneesCard
            insight={insight}
            onToggleSignOff={onToggleSignOff}
            onEditAssignees={onEditAssignees}
          />
          <CommentsCard recordId={insight.id} />
          <ActivityCard recordId={insight.id} />
        </aside>
        </div>{/* end two-column inner */}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// Insight-specific Assignees card. Mirrors the Comments / Activity
// collapsible-header pattern so the three right-rail cards read as
// a coherent stack. Lighter than the Transactions AssigneesCard
// (no Preparer/Reviewer sign-off chain) — Insights are signed off
// at the account level by anyone in the assignee list.
// ══════════════════════════════════════════════════════════════════

/**
 * Insights Assignees card. Now mirrors the Transactions
 * AssigneesCard behavior:
 *   • 3-column grid per row: avatar+name / sign-off toggle /
 *     signer panel (or empty placeholder when not signed off)
 *   • Clicking your own toggle signs you off (or revokes); clicking
 *     someone else's signs off on their behalf (override)
 *   • In the redo state, existing sign-offs render stale (amber
 *     toggle + amber check on the SignerPanel) until re-attested
 *
 * Stripped from the Transactions version: no Preparer/Reviewer
 * split (Insights aren't submitted by anyone; the AI surfaces
 * them), no override-reason capture, no per-flag stale detection
 * — staleness here is a flat property of the redo state.
 */
function InsightAssigneesCard({
  insight,
  onToggleSignOff,
  onEditAssignees,
}: {
  insight: Insight;
  onToggleSignOff: (memberId: string) => void;
  onEditAssignees: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const assignees = insight.assigneeIds
    .map((id) => getTeamMember(id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));
  const signOffs = insight.signOffs ?? {};
  const isRedo = insight.status === 'redo';

  return (
    <div className="overflow-hidden rounded-md border border-[#e1e6ef] bg-white">
      {/* Header — matches the Transactions AssigneesCard layout:
           title on the left (its own click-target to toggle collapse)
           with Edit Assignees + chevron on the right. */}
      <div className="flex items-center justify-between gap-2 px-6 py-4">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex flex-1 items-center text-left"
        >
          <span className="font-header text-base font-bold leading-5 text-[#1d2433]">
            Assignees
          </span>
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onEditAssignees}
            className="inline-flex h-8 items-center justify-center rounded-md border-[1.4px] border-[#cbd2e1] bg-transparent px-3 font-header text-xs font-bold leading-4 tracking-[-0.12px] text-[#6b7280] transition-colors hover:border-[#6b7280] hover:text-[#1d2433]"
          >
            Edit Assignees
          </button>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-label={expanded ? 'Collapse assignees' : 'Expand assignees'}
            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[#6b7280] hover:bg-neutral-100 hover:text-neutral-900"
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      {expanded && <div className="border-t border-[#e1e6ef]" />}
      {expanded && (
        <div className="px-6 py-4">
          {assignees.length === 0 ? (
            <p className="font-['Inter'] text-xs italic text-[#adb2bb]">
              No one assigned yet.
            </p>
          ) : (
            <div className="grid grid-cols-[auto_auto_auto] items-center gap-x-3 gap-y-4">
              {assignees.map((member) => {
                const so = signOffs[member.id];
                const memberSignedOff = !!so;
                const stale = memberSignedOff && isRedo;
                const signer = so ? getTeamMember(so.byId) : null;

                return (
                  <Fragment key={member.id}>
                    {/* Cell 1: avatar + name — w-40 matches Transactions.
                         Avatar wrapped in AssigneeReasonPopover so a
                         reviewer can audit why each teammate is on
                         this insight. */}
                    <div className="flex w-40 min-w-0 items-center gap-3 overflow-hidden">
                      <AssigneeReasonPopover
                        memberId={member.id}
                        reason={insight.assigneeReasons?.[member.id]}
                      >
                        <button
                          type="button"
                          aria-label={`Why is ${member.name} assigned?`}
                          // No hover/focus visual states — the cursor
                          // pointer alone signals clickability (Carmen
                          // 5.28.26). Native browser focus outline
                          // still appears on keyboard nav for a11y.
                          className="shrink-0 rounded-full"
                        >
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="h-7 w-7 rounded-full border border-neutral-200 object-cover"
                          />
                        </button>
                      </AssigneeReasonPopover>
                      <p className="truncate font-['Inter'] text-xs font-semibold leading-[18px] text-[#1b1f27]">
                        {member.name}
                      </p>
                    </div>

                    {/* Cell 2: sign-off toggle */}
                    <div className="flex shrink-0 flex-col items-center gap-1">
                      <InsightSignOffToggle
                        signedOff={memberSignedOff}
                        stale={stale}
                        onClick={() => onToggleSignOff(member.id)}
                        title={
                          stale
                            ? `Re-attest sign-off for ${member.name}`
                            : memberSignedOff
                              ? member.id === currentUserId
                                ? 'Click to remove your sign-off'
                                : `Remove ${member.name}'s sign-off`
                              : member.id === currentUserId
                                ? 'Click to sign off'
                                : `Sign off for ${member.name}`
                        }
                      />
                    </div>

                    {/* Cell 3: signer info OR empty placeholder. w-40
                         keeps Col 3's width invariant across signed /
                         unsigned states — no horizontal shift on
                         toggle. */}
                    {so && signer ? (
                      <InsightSignerPanel
                        signer={signer}
                        date={so.at}
                        stale={stale}
                      />
                    ) : (
                      <div className="h-8 w-40" />
                    )}
                  </Fragment>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Sign-off toggle — mirrors the Transactions MemberSignOffToggle.
// Green track when signed off, neutral-gray when not. Stale (redo)
// renders the track amber with the thumb in the OFF position to
// communicate "previous sign-off no longer counts — re-attest."
// ──────────────────────────────────────────────────────────────────
function InsightSignOffToggle({
  signedOff,
  stale = false,
  onClick,
  title,
}: {
  signedOff: boolean;
  stale?: boolean;
  onClick: () => void;
  title: string;
}) {
  const trackBg = stale
    ? 'bg-[#D97706]'
    : signedOff
      ? 'bg-[#1FAC76]'
      : 'bg-neutral-200';
  const thumbX = stale
    ? 'translate-x-0.5'
    : signedOff
      ? 'translate-x-[22px]'
      : 'translate-x-0.5';
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full transition-colors ${trackBg}`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${thumbX}`}
      />
    </button>
  );
}

// ──────────────────────────────────────────────────────────────────
// SignerPanel — mirrors the Transactions SignerPanel exactly.
// Shows the signer avatar + name + small check pill + date. When
// stale, swaps brand-green for amber and dims the whole block.
// ──────────────────────────────────────────────────────────────────
function InsightSignerPanel({
  signer,
  date,
  stale = false,
}: {
  signer: { name: string; avatar: string };
  date: string;
  stale?: boolean;
}) {
  const checkBg = stale ? 'bg-[#D97706]' : 'bg-[#1FAC76]';
  const nameColor = stale ? 'text-[#9CA3AF]' : 'text-[#1b1f27]';
  return (
    <div
      className={`flex w-40 min-w-0 items-center gap-2 overflow-hidden ${
        stale ? 'opacity-60' : ''
      }`}
    >
      <img
        src={signer.avatar}
        alt={signer.name}
        className="h-7 w-7 shrink-0 rounded-full border border-neutral-200 object-cover"
      />
      <div className="min-w-0">
        <p
          className={`truncate font-['Inter'] text-xs font-semibold leading-[18px] ${nameColor}`}
        >
          {signer.name}
        </p>
        <div className="flex items-center gap-1 font-['Inter'] text-[10px] font-medium leading-[14px] text-[#6b7280]">
          <span
            className={`inline-flex h-3 w-3 shrink-0 items-center justify-center rounded-full ${checkBg}`}
          >
            <Check className="h-2 w-2 text-white" strokeWidth={3} />
          </span>
          <span>{formatShortDate(date)}</span>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────

function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

// ══════════════════════════════════════════════════════════════════
// Edit Assignees modal. Mirrors the Transactions AssigneeModal:
//   • One row per current assignee, plus N empty rows added via the
//     "Add Assignee" button at the bottom
//   • Each row is a dropdown trigger + trash button
//   • Members who have signed off can't be removed (lock row,
//     show signer panel where the dropdown would be)
//   • Save replaces the insight's assigneeIds; Cancel discards
// ══════════════════════════════════════════════════════════════════

function InsightAssigneeModal({
  insight,
  onClose,
  onSave,
}: {
  insight: Insight;
  onClose: () => void;
  onSave: (ids: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>(insight.assigneeIds);
  const [pendingEmptyRows, setPendingEmptyRows] = useState(0);
  const [openDropdownIdx, setOpenDropdownIdx] = useState<number | null>(null);

  // Members who have signed off can't be removed — their attestation
  // is bound to their identity, same lock semantics as Transactions.
  const signedOffIds = useMemo(() => {
    const set = new Set<string>();
    Object.entries(insight.signOffs ?? {}).forEach(([memberId, signoff]) => {
      if (signoff) set.add(memberId);
    });
    return set;
  }, [insight.signOffs]);

  function pickMember(rowIdx: number, newId: string) {
    setSelected((prev) => {
      const next = [...prev];
      if (rowIdx < prev.length) {
        next[rowIdx] = newId;
      } else {
        next.push(newId);
      }
      return next;
    });
    if (rowIdx >= selected.length && pendingEmptyRows > 0) {
      setPendingEmptyRows((n) => Math.max(0, n - 1));
    }
    setOpenDropdownIdx(null);
  }

  function removeMember(id: string) {
    setSelected((prev) => prev.filter((x) => x !== id));
  }

  function addEmptyRow() {
    setPendingEmptyRows((n) => n + 1);
  }

  function removeEmptyRow(rowIdx: number) {
    setPendingEmptyRows((n) => Math.max(0, n - 1));
    if (openDropdownIdx === rowIdx) setOpenDropdownIdx(null);
  }

  // Selected members first, then N empty rows for new picks.
  const rows: { memberId: string | null; key: string }[] = [
    ...selected.map((id) => ({ memberId: id, key: id })),
    ...Array.from({ length: pendingEmptyRows }, (_, i) => ({
      memberId: null as string | null,
      key: `empty-${i}`,
    })),
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-md border border-[#e1e6ef] bg-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e1e6ef] px-6 py-4">
          <h2 className="font-header text-base font-bold leading-5 text-[#1d2433]">
            Edit Assignees
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[#6b7280] hover:bg-neutral-100 hover:text-[#1d2433]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-2">
            {rows.map((row, idx) => {
              const member = row.memberId ? getTeamMember(row.memberId) : null;
              const isLocked = !!row.memberId && signedOffIds.has(row.memberId);
              const removeDisabled = isLocked || selected.length === 1;
              const removeTooltip = isLocked
                ? 'This user has already signed off and cannot be removed.'
                : 'At least one assignee is required.';
              const lockedSignOff =
                isLocked && row.memberId
                  ? insight.signOffs?.[row.memberId]
                  : null;
              const lockedSigner = lockedSignOff
                ? getTeamMember(lockedSignOff.byId)
                : null;

              if (isLocked && member) {
                // Locked row — mirrors the right-rail Assignees card
                // layout: avatar + name | signed-off toggle (visual
                // only) | signer panel.
                return (
                  <div
                    key={row.key}
                    className="flex h-10 cursor-not-allowed items-center gap-3 px-1 opacity-70"
                    aria-disabled="true"
                  >
                    <div className="flex w-44 min-w-0 items-center gap-2">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="h-7 w-7 shrink-0 rounded-full border border-neutral-200 object-cover"
                      />
                      <span className="truncate font-['Inter'] text-xs font-semibold leading-[18px] text-[#6b7280]">
                        {member.name}
                      </span>
                    </div>
                    {/* Disabled signed-off toggle (visual only) */}
                    <span className="relative inline-flex h-5 w-10 shrink-0 rounded-full bg-[#1FAC76]">
                      <span className="absolute top-0.5 h-4 w-4 translate-x-[22px] rounded-full bg-white shadow-sm" />
                    </span>
                    {/* Signer panel */}
                    {lockedSignOff && lockedSigner ? (
                      <div className="flex min-w-0 items-center gap-2">
                        <img
                          src={lockedSigner.avatar}
                          alt={lockedSigner.name}
                          className="h-7 w-7 shrink-0 rounded-full border border-neutral-200 object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-['Inter'] text-xs font-semibold leading-[18px] text-[#1b1f27]">
                            {lockedSigner.name}
                          </p>
                          <div className="flex items-center gap-1 font-['Inter'] text-[10px] font-medium leading-[14px] text-[#6b7280]">
                            <span className="inline-flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-[#1FAC76]">
                              <Check
                                className="h-2 w-2 text-white"
                                strokeWidth={3}
                              />
                            </span>
                            <span>{formatShortDate(lockedSignOff.at)}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span />
                    )}
                  </div>
                );
              }

              return (
                <Popover
                  key={row.key}
                  open={openDropdownIdx === idx}
                  onOpenChange={(open) =>
                    setOpenDropdownIdx(open ? idx : null)
                  }
                >
                  <div className="flex items-center gap-2">
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="flex h-10 flex-1 items-center justify-between rounded-md border border-[#e1e6ef] bg-white px-2 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-colors hover:border-[#cbd2e1]"
                      >
                        {member ? (
                          <div className="flex min-w-0 items-center gap-2">
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="h-6 w-6 shrink-0 rounded-full border border-neutral-200 object-cover"
                            />
                            <span className="truncate font-['Inter'] text-xs font-medium leading-4 text-[#1d2433]">
                              {member.name}
                            </span>
                          </div>
                        ) : (
                          <span className="font-['Inter'] text-xs font-normal leading-4 text-[#adb2bb]">
                            Select an assignee
                          </span>
                        )}
                        <ChevronDown className="h-4 w-4 shrink-0 text-[#6b7280]" />
                      </button>
                    </PopoverTrigger>
                    {row.memberId ? (
                      removeDisabled ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              disabled
                              className="inline-flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-md text-[#cbd2e1]"
                              aria-label={removeTooltip}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="z-[80]">
                            {removeTooltip}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <button
                          type="button"
                          onClick={() => removeMember(row.memberId!)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#6b7280] hover:bg-neutral-100 hover:text-[#1d2433]"
                          aria-label={`Remove ${member?.name ?? 'assignee'}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeEmptyRow(idx)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#6b7280] hover:bg-neutral-100 hover:text-[#1d2433]"
                        aria-label="Remove empty assignee row"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <PopoverContent
                    side="bottom"
                    align="start"
                    sideOffset={4}
                    className="z-[80] w-[var(--radix-popover-trigger-width)] rounded-md border border-[#e1e6ef] bg-white p-0 shadow-xl"
                  >
                    <InsightAssigneePicker
                      assignedIds={selected}
                      onPick={(id) => pickMember(idx, id)}
                    />
                  </PopoverContent>
                </Popover>
              );
            })}
          </div>

          {/* Add Assignee */}
          <button
            type="button"
            onClick={addEmptyRow}
            className="mt-3 inline-flex items-center gap-1 font-header text-xs font-bold leading-4 text-[#424867] hover:text-[#1d2433] hover:underline"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Assignee
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-[#e1e6ef] bg-[#f8fafc] px-6 py-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 items-center justify-center rounded-md px-3 font-header text-xs font-bold leading-4 text-[#6b7280] hover:bg-neutral-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(selected)}
            className="inline-flex h-8 items-center justify-center rounded-md bg-[#1FAC76] px-3 font-header text-xs font-bold leading-4 text-white transition-colors hover:bg-[#186749]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// Picker panel inside the assignee dropdown — search + filtered
// team list. Already-assigned members are filtered out so the
// list only surfaces candidates the user hasn't picked yet.
function InsightAssigneePicker({
  assignedIds,
  onPick,
}: {
  assignedIds: string[];
  onPick: (id: string) => void;
}) {
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return team.filter((m) => {
      if (assignedIds.includes(m.id)) return false;
      if (!q) return true;
      return m.name.toLowerCase().includes(q);
    });
  }, [search, assignedIds]);

  return (
    <div className="flex flex-col">
      <div className="border-b border-[#e1e6ef] p-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#adb2bb]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="h-8 w-full rounded-md border border-[#e1e6ef] bg-white pl-8 pr-2 font-['Inter'] text-xs font-normal leading-4 text-[#1d2433] placeholder:text-[#adb2bb] focus:border-[#3d7bf7] focus:outline-none"
          />
        </div>
      </div>
      <div className="max-h-56 overflow-y-auto p-1">
        {filtered.length === 0 ? (
          <p className="px-2 py-2 font-['Inter'] text-[11px] text-[#adb2bb]">
            No matches
          </p>
        ) : (
          filtered.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onPick(m.id)}
              className="flex w-full items-center gap-2 rounded-[4px] px-2 py-1.5 text-left transition-colors hover:bg-[#f1f3f9]"
            >
              <img
                src={m.avatar}
                alt=""
                className="h-6 w-6 rounded-full object-cover"
              />
              <span className="min-w-0 flex-1 truncate font-['Inter'] text-xs font-semibold leading-[18px] text-[#1d2433]">
                {m.name}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
