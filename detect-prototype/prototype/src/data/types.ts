/**
 * Shared type system for the Detect prototype.
 *
 * This file contains two layers:
 *
 * 1. LEGACY TYPES (section A) — lifted verbatim from App.tsx so existing code
 *    and inline mock data keeps working during the phased refactor.
 *
 * 2. EXPANDED TYPES (section B) — the richer model documented in the plan:
 *    Transaction, AnomalyFlag, AnomalyRecord, Rule, Resolution, etc.
 *    These power the fake API + store + rules engine once Phase 3+ lands.
 *
 * When the store refactor (Phase 4) completes, the legacy types will be
 * retired and every import will point at the expanded model.
 */

// ======================================================================
// SECTION A — Legacy types (keep existing App.tsx working)
// ======================================================================

export type RiskLevel = 'high' | 'medium' | 'low';

export interface Comment {
  id: string;
  authorId?: string;
  author: string;
  avatar: string;
  at: string; // ISO 8601 — original post time (does not change on edit)
  text: string;
  /** Set when the comment is edited — used to show " · Edited" next to
   *  the timestamp. Originally posted-at remains in `at`. */
  editedAt?: string;
}

export interface AnomalyInfo {
  type: string;
  description: string;
  explanation: string;
  detectedBy: 'AI' | 'Rule';
  ruleName?: string;
  aiReasoning?: string;
  ruleCreatedBy?: string;
  ruleLastEditedBy?: string;
  ruleFlaggedAt?: string;
  aiFlaggedAt?: string;
}

export interface AnomalousTransaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  approver: string;
  submitter: string;
  status: string;
  accountName: string;
  accountCompany: string;
  riskScore: number;
  riskLevel: RiskLevel;
  anomaly: AnomalyInfo;
  comments: Comment[];
  preparer: { name: string; avatar: string };
  reviewers: { name: string; avatar: string }[];
  transactionId: string;
  postingPeriod: string;
  currency: string;
  type: string;
  subsidiary: string;
  account: string;
  name: string;
  memo: string;
  department: string;
  class: string;
  location: string;
  createdDate: string;
  createdBy: string;
  additionalAnomalies?: number;
}

// ======================================================================
// SECTION B — Expanded types (the future data model, rolled out in phases)
// ======================================================================

// ----- Company & org -----

export interface Entity {
  id: string;
  legalName: string;
  shortName: string;
  country: string;
  currency: string; // ISO 4217 — all USD-consolidated for this prototype
  parentEntityId?: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  erp: string;
  arr: number;
  headcount: number;
  stage: string;
  hqCity: string;
  hqState: string;
  closeCadence: string;
  entities: Entity[];
}

// ----- Chart of accounts -----

export type AccountType =
  | 'asset'
  | 'liability'
  | 'equity'
  | 'revenue'
  | 'cogs'
  | 'opex';

export interface GLAccount {
  code: string; // "6100"
  name: string; // "Software & Subscriptions"
  type: AccountType;
  parentCode?: string; // for roll-ups (e.g., 6000 parent of 6100)
  normalBalance: 'debit' | 'credit';
}

// ----- Vendors -----

export interface Vendor {
  id: string;
  name: string;
  category:
    | 'cloud-infra'
    | 'dev-tools'
    | 'saas'
    | 'pro-services'
    | 'hr-payroll'
    | 'facilities'
    | 'marketing'
    | 'travel'
    | 'legal'
    | 'other';
  defaultGLAccount: string; // GL code
  firstSeenDate: string; // ISO date
  // Used by the "New Vendor - High Risk" rule and some AI patterns
  typicalMonthlySpend?: number;
  // Mark a vendor as newly-onboarded for the period so the rules engine
  // can flag its first large invoice.
  flags?: Array<'new' | 'suspicious' | 'unverified-bank'>;
}

// ----- Team -----

export type TeamRole =
  | 'vp-controller'
  | 'assistant-controller'
  | 'senior-accountant'
  | 'staff-accountant';

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  avatar: string;
  role: TeamRole;
  roleLabel: string; // Display label (e.g., "VP, Controller")
  focus?: string; // e.g., "AP lead", "Revenue lead"
  email: string;
}

// ----- Periods -----

export type PeriodStatus = 'closed' | 'in-progress' | 'future';

export interface Period {
  id: string; // "2026-04"
  label: string; // "April 2026"
  startDate: string;
  endDate: string;
  closeDate?: string; // WD+7 target
  status: PeriodStatus;
  closedById?: string; // team member id
  closedAt?: string;
}

// ----- Transactions (immutable ERP records) -----

export type TransactionType =
  | 'vendor-bill'
  | 'purchase-order'
  | 'expense-report'
  | 'journal-entry'
  | 'payment';

export interface GLLine {
  lineNumber: number;
  accountCode: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
}

export interface Transaction {
  id: string; // internal UUID
  transactionId: string; // ERP-style (e.g., "BILL-44021") — displayed in UI
  type: TransactionType;
  entityId: string;
  periodId: string;
  date: string; // ISO date — when it posted to the GL
  amount: number;
  currency: string;
  vendorId?: string;
  vendorName?: string; // denormalized for convenience
  glAccountCode: string;
  glAccountName: string;
  /** ERP-style line label within the parent transaction (e.g.
   *  "Line 2 of 4"). Each anomaly inbox row corresponds to a single
   *  transaction line, so this disambiguates which line is flagged. */
  transactionLine?: string;
  /** Explicit GL impact lines. If omitted, derived automatically. */
  glLines?: GLLine[];
  /** ERP-style reversal transaction ID — populated when this transaction
   *  has been reversed (e.g. accrual reversal in the next period, voided
   *  bill, error correction). Renders as a clickable link to the
   *  reversing entry in the transaction details panel. */
  reversalId?: string;
  submitterId: string;
  approverId: string;
  department?: string;
  class?: string;
  location?: string;
  memo: string;
  attachmentCount: number;
  invoiceNumber?: string;
  createdAt: string; // ISO datetime
  submittedAt: string;
  approvedAt: string;
}

// ----- Rules -----

export type RuleStatus = 'active' | 'inactive' | 'draft';

export type RuleConditionOperator =
  // ── Figma-canonical operator set (Rules file node 2055:80203) ───
  | 'is'
  | 'is-not'
  | 'contains'
  | 'does-not-contain'
  | 'starts-with'
  | 'ends-with'
  | 'is-on-or-after'
  | 'is-on-or-before'
  | 'is-greater-than'
  | 'is-greater-than-or-equal'
  | 'is-less-than'
  | 'is-less-than-or-equal'
  | 'is-blank'
  | 'is-not-blank'
  | 'between'
  | 'is-any-of'
  // ── Legacy values still used by seeded rules + engine fallbacks ─
  | 'equals'
  | 'notEquals'
  | 'greaterThan'
  | 'lessThan'
  | 'matches'
  | 'doesNotContain'
  | 'startsWith'
  | 'endsWith'
  | 'isEmpty'
  | 'isNotEmpty'
  | 'outside'
  | 'in';

export interface RuleCondition {
  id: string;
  field: string; // e.g., "amount", "submittedAt.hour", "vendor.firstSeenInPeriod"
  operator: RuleConditionOperator;
  value: string | number | boolean | [number, number];
  label: string; // human-readable: "Submitted outside business hours"
  // The engine uses this to produce the matched-conditions payload:
  expectedText: string; // "08:00–18:00 weekdays"
  actualFormatter?: string; // template for the actual value display
}

/**
 * Scope of a Save Rule action — which periods the new rule version
 * applies to.
 *   - "current-and-future" → only the current open period and onward
 *   - "with-historical"    → current, future, AND the explicitly picked
 *                            historical periods (stored on the version
 *                            entry as `historicalPeriods: ["2024-03", ...]`)
 */
export type RuleSaveScope = 'current-and-future' | 'with-historical';

/**
 * Point-in-time snapshot of a rule's user-facing fields, captured
 * at each save event so the Activity Log can render before/after diffs.
 */
export interface RuleSnapshot {
  name: string;
  description: string;
  /** Severity on the 1–5 slider scale (not the 0–100 internal scale). */
  severity: number;
  /** Display-ready condition rows — field id, operator, and formatted
   *  value string. Rendered by the Activity Log using the same
   *  formatFieldName / operatorPhrase helpers as the read-only view. */
  conditions: Array<{ field: string; operator: string; value: string }>;
}

/**
 * One entry in a rule's version history — records a single save event.
 * The first entry (version 1) is created when the rule is first saved
 * with createRule; subsequent entries are appended each time the rule
 * is edited and re-saved.
 */
export interface RuleVersionEntry {
  /** Incrementing version number — 1 for the initial save. */
  version: number;
  editedAt: string;
  editedById: string;
  /** Save scope picked in the Save Rule confirmation dialog. */
  scope: RuleSaveScope;
  /** Period IDs (e.g. "2024-03") chosen when scope === "with-historical".
   *  Empty array or undefined for "current-and-future" saves. */
  historicalPeriods?: string[];
  /** Rule state immediately before this save — present for edits but not
   *  for the very first save (create). Used to render "Previously" in
   *  the Activity Log. */
  prevSnapshot?: RuleSnapshot;
  /** Rule state immediately after this save — present for edits. Used
   *  to render "Updated to" in the Activity Log. */
  nextSnapshot?: RuleSnapshot;
}

export interface Rule {
  id: string; // "rule-self-approved"
  name: string;
  description: string; // plain-English one-liner
  status: RuleStatus;
  severity: number; // 0–100 default severity for flags this rule produces
  conditions: RuleCondition[];
  // Ownership for the "Configured by ... Last edited ..." line
  createdById: string;
  createdAt: string;
  lastEditedById: string;
  lastEditedAt: string;
  /** Current version number. Increments by 1 every time the rule is
   *  saved through the Save Rule dialog. Defaults to 1 for seed data
   *  that doesn't set it. */
  version?: number;
  /** Per-save audit trail used to render the Activity Log. Entries are
   *  in chronological order (oldest first). Optional for backwards
   *  compatibility with seed data — the UI synthesizes a single
   *  "created" entry when this is absent. */
  versionHistory?: RuleVersionEntry[];
  /** ISO timestamp set when the rule is deactivated. Used to render a
   *  "Deactivated" entry in the Activity Log. Cleared (set to '') when
   *  the rule is re-activated so the entry no longer appears. */
  deactivatedAt?: string;
  /** ISO timestamp set when a previously-deactivated rule is re-activated.
   *  Used to render an "Activated" entry in the Activity Log. Cleared
   *  (set to '') when the rule is deactivated again. */
  activatedAt?: string;
}

// ----- Anomaly flags + records -----

export interface MatchedCondition {
  label: string; // "Submitted outside business hours"
  expected: string; // "08:00–18:00 weekdays"
  actual: string; // "02:47 Sunday"
}

export type FlagSource =
  | {
      kind: 'rule';
      ruleId: string;
      ruleName: string;
      matchedConditions: MatchedCondition[];
    }
  | {
      kind: 'ai';
      categoryLabel: string; // short label shown on the inbox card
      modelReasoning: string;
      confidence: number; // 0–100
    };

export interface FlagFeedback {
  thumbs: 'up' | 'down';
  reason?: string;
  at: string;
  byId: string; // team member id
}

export interface ScoreFactor {
  label: string;
  points: number; // contribution to the severity score (can be negative)
}

export interface AnomalyFlag {
  id: string;
  source: FlagSource;
  severity: number; // 0–100
  detectedAt: string;
  feedback?: FlagFeedback; // AI-only
  /**
   * Per-factor breakdown of how the severity score was composed.
   * Shown in the SeverityBadge hover so reviewers can interrogate the
   * score. Sum of points should equal (or approximate) severity.
   */
  scoreBreakdown?: ScoreFactor[];
}

export type RecordStatus = 'open' | 'resolved' | 'dismissed' | 'flagged';

// Resolution outcomes — one per `resolved` / `dismissed` record
export type Resolution =
  | {
      kind: 'journal-entry';
      jeId: string;
      jeNumber: string; // "JE-2026-0412"
      at: string;
      byId: string;
    }
  | {
      kind: 'reconciliation';
      reconId: string;
      reconName: string; // "April Bank Rec — 1010 Cash Operating"
      at: string;
      byId: string;
    }
  | {
      kind: 'close-task';
      taskId: string;
      assigneeId: string;
      dueDate: string;
      at: string;
      byId: string;
    }
  | {
      kind: 'flux-explanation';
      fluxId: string;
      account: string; // "6100 Software & Subscriptions"
      at: string;
      byId: string;
    }
  | {
      kind: 'dismissed';
      reason: string;
      note?: string;
      at: string;
      byId: string;
    }
  | {
      kind: 'no-action';
      note?: string;
      at: string;
      byId: string;
    };

export interface AccountFingerprintMonth {
  periodLabel: string; // e.g. "Apr 2025"
  hasEntry: boolean;
  transactionId?: string; // ERP id if entry exists
  amount?: number;
  vendorName?: string;
}

export interface GhostContext {
  glAccountCode: string;
  glAccountName: string;
  categoryLabel: string; // e.g. "Missing accrual entry"
  modelReasoning: string;
  expectedVendor?: string;
  typicalAmount?: number; // average of prior months
  confidence: number; // 0–100
  severity: number;
  fingerprint: AccountFingerprintMonth[]; // oldest → newest, current month last
}

/**
 * Why a particular user is assigned to a record. Drives the
 * AssigneeReasonPopover that opens on avatar click. Four canonical
 * assignment scenarios per Gaurav's 5.28.26 sync — no preparer /
 * reviewer split (Carmen 5.28.26):
 *   • rule           — assigned through a specific rule
 *   • account        — dynamic OR per-account fallback (same bucket)
 *   • manual         — manually assigned at the transaction level
 *                       via Edit Assignees; `assignedBy` is the user
 *                       who added them (optional — when absent the
 *                       bullet drops the assigner phrasing)
 *   • ultimate-owner — workspace Ultimate Owner (set in Onboarding)
 */
export type AssigneeReason =
  | { type: 'rule'; ruleName: string }
  | { type: 'account'; entityName: string; accountCode: string; accountName?: string }
  | { type: 'manual'; assignedBy?: string }
  | { type: 'ultimate-owner' };

export interface AnomalyRecord {
  id: string; // internal UUID — never shown to users
  /** '__ghost__' for absence-based anomalies that have no underlying transaction */
  transactionId: string;
  /** When 'ghost', this record represents an expected-but-absent transaction.
   *  ghostContext carries the account fingerprint and AI reasoning. */
  kind?: 'ghost';
  ghostContext?: GhostContext;
  flags: AnomalyFlag[];
  primarySeverity: number; // max(flags.severity) — sorted-by in the inbox
  status: RecordStatus;
  resolution?: Resolution;
  assigneeIds: string[];
  /** Per-assignee reason mapping. Optional — falls back to a default
   *  "manual" rendering if a record has no explicit reasons seeded. */
  assigneeReasons?: Record<string, AssigneeReason>;
  /**
   * Per-assignee sign-off entries. Keyed by member id.
   *   byId === memberId → the assignee signed off as themselves
   *   byId !== memberId → another reviewer signed off on their behalf
   *                       (the "Override" state — must include a reason)
   * Absence of an entry → the assignee is still pending.
   */
  signOffs?: Record<string, MemberSignOff>;
  /**
   * The submitter (preparer) is implicitly signed off by virtue of having
   * created the transaction. Set this flag to revoke that implicit
   * sign-off — the chip then renders as Pending and the user can click
   * to re-attest. Toggles back to undefined when re-attested.
   */
  submitterSignOffRevoked?: boolean;
  /**
   * When the preparer's sign-off is revoked and then re-attested, the
   * re-attestation is recorded here so the SignerPanel shows the current
   * user + current date instead of the original preparer/approval
   * timestamp.
   */
  submitterSignOffReattested?: { byId: string; at: string };
  commentIds: string[]; // → Comment[]
  createdAt: string;
  updatedAt: string;
  /**
   * Set when the underlying transaction has been deleted from the
   * source ERP. The record stays in Detect (read-only) to preserve
   * the audit trail — comments, sign-offs, activity log all remain
   * visible. ISO datetime captures *when* the source deletion was
   * detected so the banner can render it back to the user.
   */
  sourceDeletedAt?: string;
}

export interface MemberSignOff {
  at: string; // ISO datetime
  byId: string; // who actually performed the sign-off
  reason?: string; // required when byId !== memberId (override case)
  /**
   * The sign-off that was on this member before the current one was
   * applied. Captured when an override replaces an existing entry (e.g.
   * Samantha overrides Marcus's stale sign-off). On removal of the
   * override, this entry is restored — so reverting an override on a
   * stale chip returns it to its Re-review state, not Pending.
   */
  supersedes?: MemberSignOff;
}

export interface ActivityEntry {
  id: string;
  recordId: string; // → AnomalyRecord.id
  byId: string; // team member id
  at: string; // ISO datetime
  kind:
    | 'flag-added'
    | 'flag-removed'
    | 'assigned'
    | 'unassigned'
    | 'comment-posted'
    | 'comment-edited'
    | 'comment-deleted'
    | 'resolved'
    | 'dismissed'
    | 'reopened'
    | 'flagged-for-review'
    | 'rule-updated'
    | 'feedback-recorded';
  /** For flag-added entries: whether it was a rules-based or AI detection. */
  source?: 'rule' | 'ai';
  // Free-form message rendered in the activity log; may reference artifact IDs.
  message: string;
  /** For flag-added / flag-removed: bullet-list lines shown under the title.
   *  Format: "Rule detected: {name}" or "AI detected: {name}" */
  details?: string[];
}

// ----- Downstream artifacts (mocked handoff targets) -----

export interface JournalEntry {
  id: string;
  number: string; // "JE-2026-0412"
  entityId: string;
  periodId: string;
  memo: string;
  lines: Array<{
    glAccountCode: string;
    glAccountName: string;
    debit: number;
    credit: number;
  }>;
  status: 'draft' | 'submitted-for-approval' | 'approved' | 'posted';
  approverId?: string;
  submittedAt: string;
  submittedById: string;
  relatedRecordId?: string; // → AnomalyRecord.id
}

export interface ReconciliationItem {
  id: string;
  reconId: string; // → Reconciliation.id
  description: string;
  amount: number;
  note?: string;
  addedFromRecordId?: string; // → AnomalyRecord.id
  addedAt: string;
  addedById: string;
}

export interface Reconciliation {
  id: string; // "REC-APR-1010"
  name: string; // "April Bank Rec — 1010 Cash Operating"
  glAccountCode: string;
  entityId: string;
  periodId: string;
  state: 'balanced' | 'unbalanced' | 'in-progress';
  openItems: number;
  items: ReconciliationItem[];
}

export interface CloseTask {
  id: string; // "TASK-2026-04-027"
  checklistId: string; // → CloseChecklist.id
  title: string;
  description?: string;
  assigneeId: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'complete';
  createdAt: string;
  createdById: string;
  relatedRecordId?: string;
}

export interface CloseChecklist {
  id: string; // "CLOSE-2026-04"
  periodId: string;
  label: string; // "April 2026 Close"
  taskCount: number;
  completedCount: number;
}

export interface FluxExplanation {
  id: string; // "FLUX-APR-6100"
  periodId: string;
  comparisonPeriodId: string;
  glAccountCode: string;
  glAccountName: string;
  variance: number;
  variancePercent: number;
  explanation: string;
  complete: boolean;
  addedFromRecordId?: string;
  addedAt: string;
  addedById: string;
}

// ----- View / filter state (lives in the store) -----

export type ViewFilter = 'open' | 'resolved' | 'all';

export type SortKey =
  | 'severity' // default — the "risk score"
  | 'amount'
  | 'account'
  | 'rule-type';

export interface InboxFilters {
  view: ViewFilter;
  search: string;
  severity?: Array<'high' | 'medium' | 'low'>;
  source?: Array<'rule' | 'ai'>;
  entityId?: string[];
  periodId?: string[];
  assigneeId?: string[];
  ruleId?: string[];
  /** Multiselect on the transaction's GL account code. */
  accountCode?: string[];
  /** Restrict the visible records to anomaly records whose underlying
   *  transaction's ERP-style id (e.g. "BILL-44022") is in this list.
   *  Used by the Close→Detect bridge to guarantee the Detect inbox
   *  shows exactly the same anomalous transactions surfaced in the
   *  Close Recs/Transactions view, regardless of what other records
   *  the rule engine may add for the same GL account. */
  transactionId?: string[];
  /** Multiselect on the transaction's type (vendor-bill, journal-entry, etc.). */
  txType?: TransactionType[];
  /** Multiselects on additional transaction-detail fields. */
  vendorId?: string[];
  department?: string[];
  class?: string[];
  location?: string[];
  currency?: string[];
  /** Submitter ("Created By") on the underlying transaction. */
  submitterId?: string[];
  /** Substring search against the transaction memo. */
  memoQuery?: string;
  /** "yes" = only records with at least one comment; "no" = only records
   *  with zero comments. Undefined = no filter. */
  commented?: 'yes' | 'no';
  /** Inclusive transaction-date range. Either bound is optional. */
  dateFrom?: string; // ISO date
  dateTo?: string;   // ISO date
  sortBy: SortKey;
  sortDir: 'asc' | 'desc';
  hideSignedOff?: boolean;
}

export interface InboxCounts {
  visible: number;
  total: number;
}
