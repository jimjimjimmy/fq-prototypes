import { create } from 'zustand';
import type {
  AnomalyFlag,
  AnomalyRecord,
  Comment,
  ActivityEntry,
  InboxFilters,
  Resolution,
  Rule,
  Transaction,
  RecordStatus,
} from '../data/types';
import { company, periods, currentPeriodId } from '../data/company';
import { team, currentUserId, getTeamMember } from '../data/team';
import { chartOfAccounts } from '../data/chartOfAccounts';
import { vendors } from '../data/vendors';
import { transactions } from '../data/transactions';
import { rules as seedRules } from '../data/rules';
import { seedRecords, seedComments, seedActivity, deriveAssigneeReasonsForRecords } from '../data/seedAnomalies';
import { load, save, clear as clearPersistence } from '../services/persistence';
import { evaluateRules, mergeFlagsIntoRecords } from '../services/rulesEngine';

/**
 * Central application store — the "simulated database" for the prototype.
 *
 * Hydrates from localStorage on first read; if empty, seeds from /data/*.ts.
 * Every mutation writes back through the persistence layer.
 *
 * Split mental model:
 *   - Domain state (transactions, records, rules, comments, activity,
 *     resolution artifacts) is persisted
 *   - UI state (filters, selected record) is also persisted for demo
 *     continuity across reloads
 */

export interface PersistedState {
  records: AnomalyRecord[];
  rules: Rule[];
  comments: Record<string, Comment[]>; // recordId → comments
  activity: ActivityEntry[];
  filters: InboxFilters;
  selectedRecordId: string | null;
  // Downstream artifact counters (so IDs increment realistically)
  counters: {
    je: number;
    recon: number;
    task: number;
    flux: number;
  };
}

interface AppState extends PersistedState {
  // ---- Ephemeral (non-persisted) UI state ----
  // Map of recordId → array of userIds who have clicked "Mark as Reviewed" in V2.
  // This resets on every page load intentionally — it's a usability-test toggle, not domain state.
  reviewedMap: Record<string, string[]>;
  markReviewed: (recordId: string, userId: string) => void;

  // ---- Actions ----

  // Inbox / records
  selectRecord: (recordId: string | null) => void;
  setFilters: (patch: Partial<InboxFilters>) => void;
  clearFilters: () => void;

  // Record mutations
  dismissRecord: (recordId: string, reason: string, note?: string) => void;
  resolveRecord: (recordId: string, resolution: Resolution) => void;
  flagForReview: (recordId: string, reason: string) => void;
  reopenRecord: (recordId: string) => void;
  /** Sign off a record on behalf of another assignee (override). */
  signOffForMember: (recordId: string, memberId: string, reason: string) => void;
  /** Remove an override sign-off the current user performed on behalf of someone else. */
  removeOverrideSignOff: (recordId: string, memberId: string) => void;
  /** Remove another assignee's own sign-off (revoke their attestation). */
  removeMemberSignOff: (recordId: string, memberId: string) => void;
  /** Toggle the submitter's implicit sign-off chip on/off. */
  togglePreparerSignOff: (recordId: string) => void;
  assignRecord: (recordId: string, userIds: string[]) => void;
  postComment: (recordId: string, text: string) => void;
  editComment: (recordId: string, commentId: string, newText: string) => void;
  deleteComment: (recordId: string, commentId: string) => void;
  recordFeedback: (
    recordId: string,
    flagId: string,
    thumbs: 'up' | 'down',
    reason?: string,
  ) => void;
  clearFeedback: (recordId: string, flagId: string) => void;

  // Rules
  createRule: (rule: Omit<Rule, 'id' | 'createdAt' | 'lastEditedAt'>) => Rule;
  updateRule: (id: string, patch: Partial<Rule>) => Rule | null;
  deleteRule: (id: string) => void;
  /** Record a Save Rule action — increments the rule's version,
   *  appends a RuleVersionEntry capturing the scope (current+future or
   *  with-historical) and historical periods, and bumps lastEditedAt.
   *  When prevSnapshot/nextSnapshot are supplied the version entry stores
   *  them so the Activity Log can render before/after diffs.
   *  Fired from the Save Rule dialog's onConfirm. */
  bumpRuleVersion: (
    id: string,
    scope: import('../data/types').RuleSaveScope,
    historicalPeriods?: string[],
    prevSnapshot?: import('../data/types').RuleSnapshot,
    nextSnapshot?: import('../data/types').RuleSnapshot,
  ) => Rule | null;

  /** Append a free-form entry to the activity log. Public so
   *  surfaces outside the built-in record mutations (e.g. Insights)
   *  can write to the same activity stream. Internally consumed by
   *  the transaction-flow mutations defined in this store. */
  addActivity: (
    entry: Omit<import('../data/types').ActivityEntry, 'id' | 'at'>,
  ) => void;

  // Dev/demo
  resetToSeed: () => void;
  hydrated: boolean;
}

// ---------- Default/seed state ----------

function defaultFilters(): InboxFilters {
  return {
    // Land on the All tab by default (and after Clear all). The tab
    // strip is now All · Open · Resolved with All as the leading
    // tab — first thing the user sees on a fresh load or after
    // clearing filters.
    view: 'all',
    search: '',
    sortBy: 'severity',
    sortDir: 'desc',
  };
}

function seedState(): PersistedState {
  return {
    records: seedRecords,
    rules: seedRules,
    comments: seedComments,
    activity: seedActivity,
    filters: defaultFilters(),
    selectedRecordId: null,
    counters: { je: 412, recon: 18, task: 27, flux: 34 },
  };
}

// ---------- Store ----------

// Demo records whose sign-offs should always render as STALE on a fresh
// load — even if the user re-attested them in a previous session. The
// orange "needs re-review" toggle is a key story we want visible after
// every refresh, so we forcibly rewind these sign-offs to their
// pre-stale timestamps during hydration. Each entry maps a transaction
// ID to the {memberId → at} timestamps the seed originally used.
const DEMO_STALE_SIGNOFFS: Record<string, Record<string, string>> = {
  'tx-bill-44023': {
    'samantha-sheldon': '2026-04-21T16:00:00Z',
  },
  'tx-po-2026-318': {
    'samantha-sheldon': '2026-04-20T11:00:00Z',
    'marcus-rodriguez': '2026-04-20T13:45:00Z',
  },
};

function applyDemoStaleSignOffs(records: AppState['records']): AppState['records'] {
  return records.map((r) => {
    const overrides = DEMO_STALE_SIGNOFFS[r.transactionId];
    if (!overrides || !r.signOffs) return r;
    let mutated = false;
    const nextSignOffs = { ...r.signOffs };
    for (const [memberId, staleAt] of Object.entries(overrides)) {
      const existing = nextSignOffs[memberId];
      if (existing && existing.at !== staleAt) {
        nextSignOffs[memberId] = { ...existing, at: staleAt };
        mutated = true;
      }
    }
    return mutated ? { ...r, signOffs: nextSignOffs } : r;
  });
}

/**
 * Compress runs of sign-off toggle activity entries (`kind === 'reopened'`
 * or `'resolved'`) by the same user on the same record into the latest
 * entry. When a reviewer toggles a sign-off off→on→off→on… during demo
 * exploration, each click writes its own activity row; this collapses
 * those clusters to a single net-effect row so the Activity Log stays
 * readable.
 *
 * Window: 10 minutes between consecutive toggle entries. Anything farther
 * apart is treated as intentional history and preserved.
 */
// Helpers used by activity log entries that reference a prior comment's timestamp.
function fmtActivityDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  });
}
function fmtActivityTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', timeZone: 'UTC',
  });
}

const TOGGLE_KINDS = new Set(['reopened', 'resolved']);
function collapseToggleNoise(activity: ActivityEntry[]): ActivityEntry[] {
  const WINDOW_MS = 10 * 60 * 1000;
  const sorted = [...activity].sort(
    (a, b) => new Date(a.at).getTime() - new Date(b.at).getTime(),
  );
  const cleaned: ActivityEntry[] = [];
  for (const cur of sorted) {
    if (TOGGLE_KINDS.has(cur.kind)) {
      const curT = new Date(cur.at).getTime();
      let collapsed = false;
      for (let j = cleaned.length - 1; j >= 0; j--) {
        const prev = cleaned[j];
        const prevT = new Date(prev.at).getTime();
        if (curT - prevT > WINDOW_MS) break;
        if (
          TOGGLE_KINDS.has(prev.kind) &&
          prev.recordId === cur.recordId &&
          prev.byId === cur.byId
        ) {
          cleaned.splice(j, 1);
          collapsed = true;
          break;
        }
      }
      cleaned.push(cur);
      void collapsed;
    } else {
      cleaned.push(cur);
    }
  }
  return cleaned;
}

function hydrate(): PersistedState {
  const loaded = load<PersistedState>();
  const state = loaded ?? seedState();
  // Re-run the rules engine on every load so evaluator changes take effect
  // immediately without needing a manual rule save.
  const engineResult = evaluateRules(transactions, state.rules);
  const merged = mergeFlagsIntoRecords(state.records, engineResult);
  // Now that the engine has filled in rule flags, derive assignee
  // reasons for every assignee on every record (Carmen 5.28.26).
  // Running here (not at module init) means the deriver sees the
  // full flag set — including the "Class is Blank" rule that the
  // engine added for JE-2026-047, etc.
  const withReasons = deriveAssigneeReasonsForRecords(merged);
  // Force the demo "needs re-review" records back to their stale state on
  // every hydration — see DEMO_STALE_SIGNOFFS above.
  const records = applyDemoStaleSignOffs(withReasons);
  // Compress redundant sign-off toggle activity entries — see helper
  // doc comment above. Idempotent, so safe to run on every hydration.
  const activity = collapseToggleNoise(state.activity);
  // If we mutated the activity log, write it back so the next hydration
  // doesn't redo the same work (and so the cleaned state shows up
  // immediately in the UI without further user interaction).
  if (activity.length !== state.activity.length) {
    save({ ...state, records, activity, selectedRecordId: null });
  }
  // Filters are intentionally NOT restored from localStorage — every
  // refresh / new session starts the inbox unfiltered. Persisting
  // filters across sessions caused "the page feels broken" moments
  // where a leftover accountCode or transactionId whitelist hid
  // every record. Refreshing == fresh inbox.
  return {
    ...state,
    filters: defaultFilters(),
    selectedRecordId: null,
    records,
    activity,
  };
}

export const useAppStore = create<AppState>((set, get) => {
  const initial = hydrate();

  const persist = () => {
    const s = get();
    const payload: PersistedState = {
      records: s.records,
      rules: s.rules,
      comments: s.comments,
      activity: s.activity,
      filters: s.filters,
      selectedRecordId: s.selectedRecordId,
      counters: s.counters,
    };
    save(payload);
  };

  const addActivity = (entry: Omit<ActivityEntry, 'id' | 'at'>): void => {
    set((s) => ({
      activity: [
        ...s.activity,
        {
          ...entry,
          id: `activity-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          at: new Date().toISOString(),
        },
      ],
    }));
  };

  const patchRecord = (recordId: string, patch: Partial<AnomalyRecord>): void => {
    set((s) => ({
      records: s.records.map((r) =>
        r.id === recordId ? { ...r, ...patch, updatedAt: new Date().toISOString() } : r,
      ),
    }));
  };

  return {
    ...initial,
    hydrated: true,

    // ---- public activity-log writer ----
    // Exposes the internal addActivity helper so surfaces outside
    // the built-in record mutations (e.g. Insights sign-off /
    // redo) can write to the same activity stream the existing
    // ActivityCard already reads.
    addActivity,

    // ---- ephemeral state ----

    reviewedMap: {},
    markReviewed: (recordId, userId) => {
      set((s) => {
        const current = s.reviewedMap[recordId] ?? [];
        const alreadyReviewed = current.includes(userId);
        return {
          reviewedMap: {
            ...s.reviewedMap,
            [recordId]: alreadyReviewed
              ? current.filter((id) => id !== userId)
              : [...current, userId],
          },
        };
      });
    },

    // ---- inbox ----

    selectRecord: (recordId) => {
      set({ selectedRecordId: recordId });
      persist();
    },

    setFilters: (patch) => {
      set((s) => ({ filters: { ...s.filters, ...patch } }));
      // Clear the selection when switching views so the user always
      // makes an explicit first pick in the new context.
      if ('view' in patch) {
        set({ selectedRecordId: null });
      }
      persist();
    },

    clearFilters: () => {
      set({ filters: defaultFilters() });
      persist();
    },

    // ---- record mutations ----

    dismissRecord: (recordId, reason, note) => {
      // Advance to next visible record in the same view, same pattern
      // as reopen — the dismissed card animates out of the list.
      const visibleBefore = selectVisibleRecords(get());
      const idx = visibleBefore.findIndex((r) => r.id === recordId);
      const nextId =
        idx >= 0
          ? visibleBefore[idx + 1]?.id ?? visibleBefore[idx - 1]?.id ?? null
          : null;

      patchRecord(recordId, {
        status: 'dismissed',
        resolution: {
          kind: 'dismissed',
          reason,
          note,
          at: new Date().toISOString(),
          byId: currentUserId,
        },
      });
      addActivity({
        recordId,
        byId: currentUserId,
        kind: 'dismissed',
        message: `Dismissed — reason: ${reason}${note ? ` (${note})` : ''}`,
      });
      set({ selectedRecordId: nextId });
      persist();
    },

    resolveRecord: (recordId, resolution) => {
      // If "hide signed off" is on, the resolved record is about to disappear
      // from the list — pre-compute the next neighbour before patching.
      const hideSignedOff = get().filters.hideSignedOff;
      const visibleBefore = selectVisibleRecords(get());
      const idx = visibleBefore.findIndex((r) => r.id === recordId);
      const nextId =
        idx >= 0
          ? visibleBefore[idx + 1]?.id ?? visibleBefore[idx - 1]?.id ?? null
          : null;

      // Write the resolution AND record a per-member sign-off entry for
      // the current user so the assignee chip shows "Signed off" (not
      // "Override") in the review header.
      const existingRecord = get().records.find((r) => r.id === recordId);
      const nextSignOffs = {
        ...(existingRecord?.signOffs ?? {}),
        [currentUserId]: { at: resolution.at, byId: currentUserId },
      };
      patchRecord(recordId, {
        status: 'resolved',
        resolution,
        signOffs: nextSignOffs,
      });
      let message = 'Signed off';
      if (resolution.kind === 'journal-entry') {
        message = `Signed off — posted correcting ${resolution.jeNumber}`;
      } else if (resolution.kind === 'reconciliation') {
        message = `Signed off — added to ${resolution.reconName}`;
      } else if (resolution.kind === 'close-task') {
        const assignee = getTeamMember(resolution.assigneeId);
        message = `Signed off — created close task ${resolution.taskId} for ${assignee?.name ?? 'team member'}, due ${resolution.dueDate}`;
      } else if (resolution.kind === 'flux-explanation') {
        message = `Signed off — added flux note to ${resolution.fluxId} (${resolution.account})`;
      } else if (resolution.kind === 'no-action') {
        message = `Signed off — no downstream action taken`;
      }
      addActivity({ recordId, byId: currentUserId, kind: 'resolved', message });
      // Auto-advance to the next record only when "hide signed off" is on,
      // since the resolved item will vanish from the list. Otherwise stay put.
      set({ selectedRecordId: hideSignedOff ? nextId : recordId });
      persist();
    },

    flagForReview: (recordId, reason) => {
      patchRecord(recordId, { status: 'flagged' });
      addActivity({
        recordId,
        byId: currentUserId,
        kind: 'flagged-for-review',
        message: `Flagged for review — ${reason}`,
      });
      persist();
    },

    reopenRecord: (recordId) => {
      // Removing the main toggle only un-signs-off for the current user.
      // Other reviewers' sign-offs (including overrides the current user
      // performed on their behalf) stay intact — those are managed
      // through override mode.
      const existing = get().records.find((r) => r.id === recordId);
      const nextSignOffs = { ...(existing?.signOffs ?? {}) };
      delete nextSignOffs[currentUserId];
      patchRecord(recordId, {
        status: 'open',
        resolution: undefined,
        signOffs: nextSignOffs,
      });
      addActivity({
        recordId,
        byId: currentUserId,
        kind: 'reopened',
        message: 'Sign-off removed',
      });
      // Keep the reopened record in view — no auto-advance
      set({ selectedRecordId: recordId });
      persist();
    },

    removeOverrideSignOff: (recordId, memberId) => {
      const existing = get().records.find((r) => r.id === recordId);
      if (!existing?.signOffs) return;
      const entry = existing.signOffs[memberId];
      // Only remove an override sign-off the *current user* performed.
      // Self sign-offs and overrides made by other reviewers are off-limits.
      if (!entry || entry.byId === memberId || entry.byId !== currentUserId) return;
      const nextSignOffs = { ...existing.signOffs };
      // If this override replaced a previous entry (e.g. a stale Re-review
      // sign-off), restore it. Otherwise the chip just goes back to Pending.
      if (entry.supersedes) {
        nextSignOffs[memberId] = entry.supersedes;
      } else {
        delete nextSignOffs[memberId];
      }
      patchRecord(recordId, { signOffs: nextSignOffs });
      const target = getTeamMember(memberId);
      addActivity({
        recordId,
        byId: currentUserId,
        kind: 'reopened',
        message: `Removed override sign-off for ${target?.name ?? memberId}`,
        details: [`Removed ${target?.name ?? memberId}'s signoff`],
      });
      persist();
    },

    removeMemberSignOff: (recordId, memberId) => {
      const existing = get().records.find((r) => r.id === recordId);
      if (!existing?.signOffs) return;
      const entry = existing.signOffs[memberId];
      if (!entry) return;
      // If this was an override the *current user* placed, defer to the
      // override-specific path so any superseded prior entry is restored
      // and the activity log reads correctly.
      if (entry.byId === currentUserId && entry.byId !== memberId) {
        get().removeOverrideSignOff(recordId, memberId);
        return;
      }
      const nextSignOffs = { ...existing.signOffs };
      delete nextSignOffs[memberId];
      patchRecord(recordId, { signOffs: nextSignOffs });
      const target = getTeamMember(memberId);
      const signer = getTeamMember(entry.byId);
      addActivity({
        recordId,
        byId: currentUserId,
        kind: 'reopened',
        message:
          entry.byId === memberId
            ? `Revoked sign-off attributed to ${target?.name ?? memberId}`
            : `Revoked override sign-off ${signer?.name ?? entry.byId} placed for ${target?.name ?? memberId}`,
        details: [`Removed ${target?.name ?? memberId}'s signoff`],
      });
      persist();
    },

    togglePreparerSignOff: (recordId) => {
      const existing = get().records.find((r) => r.id === recordId);
      if (!existing) return;
      const nextRevoked = !existing.submitterSignOffRevoked;
      // When restoring (un-revoking), attribute the new sign-off to the
      // current user with a fresh timestamp so the SignerPanel reflects
      // who actually re-attested rather than the original preparer.
      // When revoking, clear any prior re-attestation override.
      patchRecord(recordId, {
        submitterSignOffRevoked: nextRevoked,
        submitterSignOffReattested: nextRevoked
          ? undefined
          : { byId: currentUserId, at: new Date().toISOString() },
      });
      const tx = transactions.find((t) => t.id === existing.transactionId);
      const submitter = tx ? getTeamMember(tx.submitterId) : null;
      addActivity({
        recordId,
        byId: currentUserId,
        kind: 'reopened',
        message: nextRevoked
          ? `Revoked submitter sign-off attributed to ${submitter?.name ?? 'submitter'}`
          : `Restored submitter sign-off attributed to ${submitter?.name ?? 'submitter'}`,
      });
      persist();
    },

    signOffForMember: (recordId, memberId, reason) => {
      const existingRecord = get().records.find((r) => r.id === recordId);
      if (!existingRecord) return;
      const trimmedReason = reason.trim();
      // If there's already a sign-off on this member (typically a stale
      // one in Re-review state), capture it on `supersedes` so the
      // remove-override flow can restore it later.
      const previous = existingRecord.signOffs?.[memberId];
      const nextSignOffs = {
        ...(existingRecord.signOffs ?? {}),
        [memberId]: {
          at: new Date().toISOString(),
          byId: currentUserId,
          // Only persist reason if the reviewer actually typed one — it's optional.
          ...(trimmedReason ? { reason: trimmedReason } : {}),
          ...(previous ? { supersedes: previous } : {}),
        },
      };
      patchRecord(recordId, { signOffs: nextSignOffs });
      const target = getTeamMember(memberId);
      addActivity({
        recordId,
        byId: currentUserId,
        kind: 'resolved',
        message: `Signed off on behalf of ${target?.name ?? memberId}`,
        details: [`Signed off on behalf of ${target?.name ?? memberId}`],
      });
      persist();
    },

    assignRecord: (recordId, userIds) => {
      // Capture provenance for users who are NEW to this record's
      // assignee list. Newly-added users got there via Edit
      // Assignees, so their reason is `manual` with the current
      // user as the assigner. Existing users keep whatever reason
      // they already had (rule / account / ultimate-owner etc).
      // Removed users have their reasons dropped to keep the map
      // clean. Carmen 5.28.26.
      const current = get().records.find((r) => r.id === recordId);
      const prevIds = new Set(current?.assigneeIds ?? []);
      const prevReasons = current?.assigneeReasons ?? {};
      const assignerName = getTeamMember(currentUserId)?.name ?? 'a teammate';
      const nextReasons: NonNullable<typeof current>['assigneeReasons'] = {};
      for (const uid of userIds) {
        if (prevIds.has(uid)) {
          if (prevReasons[uid]) nextReasons![uid] = prevReasons[uid];
        } else {
          nextReasons![uid] = { type: 'manual', assignedBy: assignerName };
        }
      }
      // Compute who was added vs removed so we can write descriptive entries
      const nextIds = new Set(userIds);
      const added = userIds.filter((id) => !prevIds.has(id));
      const removed = [...prevIds].filter((id) => !nextIds.has(id));

      patchRecord(recordId, {
        assigneeIds: userIds,
        assigneeReasons: nextReasons,
      });

      if (added.length > 0) {
        addActivity({
          recordId,
          byId: currentUserId,
          kind: 'assigned',
          message: `Added ${added.length} assignee(s)`,
          details: added.map((id) => `Added ${getTeamMember(id)?.name ?? id}`),
        });
      }
      if (removed.length > 0) {
        addActivity({
          recordId,
          byId: currentUserId,
          kind: 'unassigned',
          message: `Removed ${removed.length} assignee(s)`,
          details: removed.map((id) => `Removed ${getTeamMember(id)?.name ?? id}`),
        });
      }
      // If nothing changed (same set, e.g. reorder only), log a no-op
      if (added.length === 0 && removed.length === 0) {
        addActivity({
          recordId,
          byId: currentUserId,
          kind: 'assigned',
          message: 'Assignees updated',
          details: [],
        });
      }
      persist();
    },

    postComment: (recordId, text) => {
      const comment: Comment = {
        id: `comment-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        authorId: currentUserId,
        author: getTeamMember(currentUserId)?.name ?? currentUserId,
        avatar: getTeamMember(currentUserId)?.avatar ?? '',
        at: new Date().toISOString(),
        text,
      };
      set((s) => {
        const existing = s.comments[recordId] ?? [];
        const record = s.records.find((r) => r.id === recordId);
        return {
          comments: { ...s.comments, [recordId]: [...existing, comment] },
          records: record
            ? s.records.map((r) =>
                r.id === recordId
                  ? { ...r, commentIds: [...r.commentIds, comment.id], updatedAt: new Date().toISOString() }
                  : r,
              )
            : s.records,
        };
      });
      addActivity({
        recordId,
        byId: currentUserId,
        kind: 'comment-posted',
        message: `Commented`,
      });
      persist();
    },

    editComment: (recordId, commentId, newText) => {
      // Capture original timestamp before mutating so the activity entry
      // can reference "originally made on {date} at {time}".
      const originalAt = get().comments[recordId]?.find((c) => c.id === commentId)?.at;

      set((s) => ({
        comments: {
          ...s.comments,
          [recordId]: (s.comments[recordId] ?? []).map((c) =>
            c.id === commentId
              ? { ...c, text: newText, editedAt: new Date().toISOString() }
              : c,
          ),
        },
      }));

      addActivity({
        recordId,
        byId: currentUserId,
        kind: 'comment-edited',
        message: 'Edited a comment',
        details: originalAt
          ? [`Edited a comment originally made on ${fmtActivityDate(originalAt)} at ${fmtActivityTime(originalAt)}`]
          : [],
      });
      persist();
    },

    deleteComment: (recordId, commentId) => {
      // Capture original timestamp before removing the comment.
      const originalAt = get().comments[recordId]?.find((c) => c.id === commentId)?.at;

      set((s) => ({
        comments: {
          ...s.comments,
          [recordId]: (s.comments[recordId] ?? []).filter((c) => c.id !== commentId),
        },
        records: s.records.map((r) =>
          r.id === recordId
            ? { ...r, commentIds: r.commentIds.filter((id) => id !== commentId) }
            : r,
        ),
      }));

      addActivity({
        recordId,
        byId: currentUserId,
        kind: 'comment-deleted',
        message: 'Deleted a comment',
        details: originalAt
          ? [`Deleted a comment originally made on ${fmtActivityDate(originalAt)} at ${fmtActivityTime(originalAt)}`]
          : [],
      });
      persist();
    },

    recordFeedback: (recordId, flagId, thumbs, reason) => {
      // Capture the flag's label before mutating state so we can log it
      const flagLabel = (() => {
        const rec = get().records.find((r) => r.id === recordId);
        const flag = rec?.flags.find((f) => f.id === flagId);
        if (!flag) return undefined;
        return flag.source.kind === 'rule'
          ? `Rule detected: ${flag.source.ruleName}`
          : `AI detected: ${flag.source.categoryLabel}`;
      })();

      set((s) => ({
        records: s.records.map((r) => {
          if (r.id !== recordId) return r;
          return {
            ...r,
            flags: r.flags.map((f) => {
              if (f.id !== flagId) return f;
              if (f.source.kind !== 'ai') return f;
              return {
                ...f,
                feedback: {
                  thumbs,
                  reason,
                  at: new Date().toISOString(),
                  byId: currentUserId,
                },
              } as AnomalyFlag;
            }),
            updatedAt: new Date().toISOString(),
          };
        }),
      }));

      // For thumbs-down: log the anomaly as "removed" (incorrectly flagged)
      if (thumbs === 'down' && flagLabel) {
        addActivity({
          recordId,
          byId: 'system',
          kind: 'flag-removed',
          message: 'Removed anomalies',
          details: [flagLabel],
        });
      }

      addActivity({
        recordId,
        byId: currentUserId,
        kind: 'feedback-recorded',
        message:
          thumbs === 'up'
            ? 'Feedback: 👍 good catch'
            : `Feedback: 👎 wrong — ${reason ?? 'no reason'}`,
      });
      persist();
    },

    clearFeedback: (recordId, flagId) => {
      set((s) => ({
        records: s.records.map((r) => {
          if (r.id !== recordId) return r;
          return {
            ...r,
            flags: r.flags.map((f) => {
              if (f.id !== flagId || f.source.kind !== 'ai') return f;
              const { feedback: _f, ...rest } = f as AnomalyFlag & { feedback?: unknown };
              void _f;
              return rest as AnomalyFlag;
            }),
            updatedAt: new Date().toISOString(),
          };
        }),
      }));
      persist();
    },

    // ---- rules ----

    createRule: (ruleInput) => {
      const now = new Date().toISOString();
      const rule: Rule = {
        ...ruleInput,
        id: `rule-custom-${Date.now().toString(36)}`,
        createdAt: now,
        lastEditedAt: now,
      };
      set((s) => ({ rules: [...s.rules, rule] }));
      // Re-run the engine so the new rule takes effect
      const s = get();
      const engineResult = evaluateRules(transactions, s.rules);
      const updatedRecords = mergeFlagsIntoRecords(s.records, engineResult);
      set({ records: updatedRecords });
      addActivity({
        recordId: '',
        byId: currentUserId,
        kind: 'rule-updated',
        message: `Created rule "${rule.name}"`,
      });
      persist();
      return rule;
    },

    updateRule: (id, patch) => {
      const existing = get().rules.find((r) => r.id === id);
      if (!existing) return null;
      const updated: Rule = {
        ...existing,
        ...patch,
        lastEditedAt: new Date().toISOString(),
        lastEditedById: currentUserId,
      };
      set((s) => ({ rules: s.rules.map((r) => (r.id === id ? updated : r)) }));
      // Re-evaluate
      const s = get();
      const engineResult = evaluateRules(transactions, s.rules);
      const updatedRecords = mergeFlagsIntoRecords(s.records, engineResult);
      set({ records: updatedRecords });
      addActivity({
        recordId: '',
        byId: currentUserId,
        kind: 'rule-updated',
        message: `Updated rule "${updated.name}"`,
      });
      persist();
      return updated;
    },

    bumpRuleVersion: (id, scope, historicalPeriods, prevSnapshot, nextSnapshot) => {
      const existing = get().rules.find((r) => r.id === id);
      if (!existing) return null;
      const now = new Date().toISOString();
      const nextVersion = (existing.version ?? 1) + 1;
      const newEntry = {
        version: nextVersion,
        editedAt: now,
        editedById: currentUserId,
        scope,
        historicalPeriods:
          scope === 'with-historical' ? historicalPeriods ?? [] : undefined,
        prevSnapshot,
        nextSnapshot,
      };
      const updated: Rule = {
        ...existing,
        version: nextVersion,
        versionHistory: [...(existing.versionHistory ?? []), newEntry],
        lastEditedAt: now,
        lastEditedById: currentUserId,
      };
      set((s) => ({ rules: s.rules.map((r) => (r.id === id ? updated : r)) }));
      addActivity({
        recordId: '',
        byId: currentUserId,
        kind: 'rule-updated',
        message: `Saved rule "${updated.name}" to version ${nextVersion}`,
      });
      persist();
      return updated;
    },

    deleteRule: (id) => {
      const rule = get().rules.find((r) => r.id === id);
      if (!rule) return;
      set((s) => ({ rules: s.rules.filter((r) => r.id !== id) }));
      // Re-evaluate
      const s = get();
      const engineResult = evaluateRules(transactions, s.rules);
      const updatedRecords = mergeFlagsIntoRecords(s.records, engineResult);
      set({ records: updatedRecords });
      addActivity({
        recordId: '',
        byId: currentUserId,
        kind: 'rule-updated',
        message: `Deleted rule "${rule.name}"`,
      });
      persist();
    },

    // ---- dev/demo ----

    resetToSeed: () => {
      clearPersistence();
      set(seedState());
    },
  };
});

// ---------- Selectors (pure, external helpers for components) ----------

export function selectVisibleRecords(state: AppState): AnomalyRecord[] {
  const { records, filters } = state;

  let filtered = records;

  // A record counts as "resolved" only when EVERY assignee on it has
  // signed off. The legacy `record.status === 'resolved'` flag isn't
  // sufficient on its own — a record can be marked resolved while some
  // assignees still owe a sign-off.
  const isFullyResolved = (r: AnomalyRecord) => isRecordFullyResolved(r);

  // View filter — 'open' = anything not fully resolved (and not dismissed);
  // 'resolved' = fully signed-off; 'ignored' = dismissed; 'all' = everything.
  if (filters.view === 'open') {
    filtered = filtered.filter((r) => r.status !== 'dismissed' && !isFullyResolved(r));
  } else if (filters.view === 'resolved') {
    filtered = filtered.filter((r) => isFullyResolved(r));
  } else if (filters.view === 'ignored') {
    filtered = filtered.filter((r) => r.status === 'dismissed');
  }
  // 'all' — no filter applied here

  // Resolved-toggle filter — when on, hide every fully-signed-off record
  // plus dismissed records (both are "off the queue").
  if (filters.hideSignedOff) {
    filtered = filtered.filter((r) => !isFullyResolved(r) && r.status !== 'dismissed');
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    filtered = filtered.filter((r) => {
      const tx = transactions.find((t) => t.id === r.transactionId);
      if (!tx) return false;
      return (
        tx.transactionId.toLowerCase().includes(q) ||
        tx.memo.toLowerCase().includes(q) ||
        tx.vendorName?.toLowerCase().includes(q) ||
        tx.glAccountName.toLowerCase().includes(q)
      );
    });
  }

  if (filters.severity && filters.severity.length > 0) {
    filtered = filtered.filter((r) => filters.severity!.includes(severityBand(r.primarySeverity)));
  }

  if (filters.source && filters.source.length > 0) {
    filtered = filtered.filter((r) =>
      r.flags.some((f) => filters.source!.includes(f.source.kind)),
    );
  }

  if (filters.entityId && filters.entityId.length > 0) {
    filtered = filtered.filter((r) => {
      const tx = transactions.find((t) => t.id === r.transactionId);
      return tx ? filters.entityId!.includes(tx.entityId) : false;
    });
  }

  // Restrict to a specific list of underlying ERP txIds — used by the
  // Close→Detect bridge so the Detect inbox shows exactly the same
  // anomalous transactions surfaced in Close. Transaction IDs are
  // accepted in ERP form (e.g. "BILL-44022") and converted to internal
  // form (`tx-bill-44022`) for matching against r.transactionId.
  if (filters.transactionId && filters.transactionId.length > 0) {
    const internalIds = new Set(
      filters.transactionId.map((id) => `tx-${id.toLowerCase()}`),
    );
    filtered = filtered.filter((r) => internalIds.has(r.transactionId));
  }

  if (filters.periodId && filters.periodId.length > 0) {
    filtered = filtered.filter((r) => {
      const tx = transactions.find((t) => t.id === r.transactionId);
      return tx ? filters.periodId!.includes(tx.periodId) : false;
    });
  }

  if (filters.assigneeId && filters.assigneeId.length > 0) {
    filtered = filtered.filter((r) =>
      r.assigneeIds.some((id) => filters.assigneeId!.includes(id)),
    );
  }

  if (filters.ruleId && filters.ruleId.length > 0) {
    filtered = filtered.filter((r) =>
      r.flags.some(
        (f) => f.source.kind === 'rule' && filters.ruleId!.includes(f.source.ruleId),
      ),
    );
  }

  if (filters.accountCode && filters.accountCode.length > 0) {
    filtered = filtered.filter((r) => {
      const tx = transactions.find((t) => t.id === r.transactionId);
      return tx ? filters.accountCode!.includes(tx.glAccountCode) : false;
    });
  }

  if (filters.txType && filters.txType.length > 0) {
    filtered = filtered.filter((r) => {
      const tx = transactions.find((t) => t.id === r.transactionId);
      return tx ? filters.txType!.includes(tx.type) : false;
    });
  }

  if (filters.vendorId && filters.vendorId.length > 0) {
    filtered = filtered.filter((r) => {
      const tx = transactions.find((t) => t.id === r.transactionId);
      return tx?.vendorId ? filters.vendorId!.includes(tx.vendorId) : false;
    });
  }

  if (filters.department && filters.department.length > 0) {
    filtered = filtered.filter((r) => {
      const tx = transactions.find((t) => t.id === r.transactionId);
      return tx?.department ? filters.department!.includes(tx.department) : false;
    });
  }

  if (filters.class && filters.class.length > 0) {
    filtered = filtered.filter((r) => {
      const tx = transactions.find((t) => t.id === r.transactionId);
      return tx?.class ? filters.class!.includes(tx.class) : false;
    });
  }

  if (filters.location && filters.location.length > 0) {
    filtered = filtered.filter((r) => {
      const tx = transactions.find((t) => t.id === r.transactionId);
      return tx?.location ? filters.location!.includes(tx.location) : false;
    });
  }

  if (filters.currency && filters.currency.length > 0) {
    filtered = filtered.filter((r) => {
      const tx = transactions.find((t) => t.id === r.transactionId);
      return tx ? filters.currency!.includes(tx.currency) : false;
    });
  }

  if (filters.submitterId && filters.submitterId.length > 0) {
    filtered = filtered.filter((r) => {
      const tx = transactions.find((t) => t.id === r.transactionId);
      return tx ? filters.submitterId!.includes(tx.submitterId) : false;
    });
  }

  if (filters.memoQuery && filters.memoQuery.trim()) {
    const q = filters.memoQuery.trim().toLowerCase();
    filtered = filtered.filter((r) => {
      const tx = transactions.find((t) => t.id === r.transactionId);
      return tx ? tx.memo.toLowerCase().includes(q) : false;
    });
  }

  if (filters.commented) {
    filtered = filtered.filter((r) => {
      const hasComments = (state.comments[r.id]?.length ?? 0) > 0;
      return filters.commented === 'yes' ? hasComments : !hasComments;
    });
  }

  if (filters.dateFrom || filters.dateTo) {
    const fromMs = filters.dateFrom ? new Date(filters.dateFrom + 'T00:00:00Z').getTime() : -Infinity;
    const toMs = filters.dateTo ? new Date(filters.dateTo + 'T23:59:59Z').getTime() : Infinity;
    filtered = filtered.filter((r) => {
      const tx = transactions.find((t) => t.id === r.transactionId);
      if (!tx) return false;
      const ms = new Date(tx.date + 'T00:00:00Z').getTime();
      return ms >= fromMs && ms <= toMs;
    });
  }

  // sort
  filtered.sort((a, b) => {
    const key = filters.sortBy;
    let cmp = 0;
    if (key === 'severity') {
      cmp = a.primarySeverity - b.primarySeverity;
    } else if (key === 'amount') {
      const txA = transactions.find((t) => t.id === a.transactionId);
      const txB = transactions.find((t) => t.id === b.transactionId);
      cmp = (txA?.amount ?? 0) - (txB?.amount ?? 0);
    } else if (key === 'account') {
      const txA = transactions.find((t) => t.id === a.transactionId);
      const txB = transactions.find((t) => t.id === b.transactionId);
      cmp = (txA?.glAccountCode ?? '').localeCompare(txB?.glAccountCode ?? '');
    } else if (key === 'rule-type') {
      // Sort by the primary flag's rule name (AI flags sort to the end).
      const primaryName = (r: typeof a): string => {
        const primary = [...r.flags].sort((x, y) => y.severity - x.severity)[0];
        if (!primary) return 'zzz';
        return primary.source.kind === 'rule' ? primary.source.ruleName : 'zzz-ai';
      };
      cmp = primaryName(a).localeCompare(primaryName(b));
    }
    return filters.sortDir === 'asc' ? cmp : -cmp;
  });

  return filtered;
}

/**
 * Shared "is this record fully resolved?" predicate. A record counts
 * as resolved when every assignee has a sign-off AND none of those
 * sign-offs are stale (a flag detected after the sign-off marks the
 * attestation as needing re-review — that record belongs under Open
 * until the assignee re-signs).
 *
 * Submitter caveat: if the submitter is also an assignee, their
 * sign-off is implicit (the act of submitting) and is tracked via
 * `submitterSignOffRevoked` rather than `signOffs[id]`.
 */
export function isRecordFullyResolved(r: AnomalyRecord): boolean {
  if (r.assigneeIds.length === 0) return false;
  if (r.status === 'dismissed') return false;
  const tx = transactions.find((t) => t.id === r.transactionId);
  const submitterId = tx?.submitterId;
  const everySignedOff = r.assigneeIds.every((id) => {
    if (submitterId && id === submitterId) {
      return !r.submitterSignOffRevoked;
    }
    return Boolean(r.signOffs?.[id]);
  });
  if (!everySignedOff) return false;

  // Re-review state — if any flag was detected AFTER an assignee's
  // sign-off, that sign-off is stale and the record is back in the
  // Open queue until the assignee re-attests. Submitter implicit
  // sign-offs don't participate in the staleness check since they
  // don't carry a timestamp (they're inferred from submission).
  for (const id of r.assigneeIds) {
    if (submitterId && id === submitterId) continue;
    const so = r.signOffs?.[id];
    if (!so) return false;
    const soAt = new Date(so.at).getTime();
    const hasNewerFlag = r.flags.some(
      (f) => new Date(f.detectedAt).getTime() > soAt,
    );
    if (hasNewerFlag) return false;
  }
  return true;
}

export function selectInboxCounts(state: AppState): { visible: number; total: number } {
  const viewToStatus: Record<InboxFilters['view'], RecordStatus[]> = {
    open: ['open', 'flagged'],
    resolved: ['resolved'],
    ignored: ['dismissed'],
    all: ['open', 'flagged', 'resolved', 'dismissed'],
  };
  const viewTotal = state.records.filter((r) =>
    viewToStatus[state.filters.view].includes(r.status),
  ).length;
  const visible = selectVisibleRecords(state).length;
  return { visible, total: viewTotal };
}

function severityBand(severity: number): 'high' | 'medium' | 'low' {
  if (severity >= 80) return 'high';
  if (severity >= 50) return 'medium';
  return 'low';
}

// ---------- Shared readonly exports (convenience) ----------

export { company, periods, currentPeriodId, team, currentUserId, chartOfAccounts, vendors, transactions };
