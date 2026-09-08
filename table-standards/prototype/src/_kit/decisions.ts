/**
 * Cross-cutting design decisions for the table standards.
 * This file is the live source of truth — the knowledge/profile-decisions.md
 * is a human-readable export that feeds Confluence (updated when decisions are confirmed).
 *
 * Decisions cascade downward: a P0 decision applies to P0, P1, P2, P3a, P3b.
 * A P1 decision applies to P1, P2, P3a, P3b — and so on.
 */

export type DecisionStatus =
  | 'confirmed'       // direction is set, rationale is clear
  | 'needs-validation' // implemented a working direction — needs explicit approval or specification
  | 'open'            // not yet decided

export type ProfileLevel = 'P0' | 'P1' | 'P2' | 'P3a' | 'P3b'

export interface Decision {
  id: string
  title: string
  /** What was decided or implemented. */
  detail: string
  status: DecisionStatus
  /**
   * For needs-validation: the specific question that must be answered before this
   * becomes a confirmed standard. Shown in the spec panel as a prompt for review sessions.
   */
  validationNote?: string
  /**
   * The lowest profile level this decision applies from.
   * "P0" = applies everywhere; "P1" = P1 and above; etc.
   */
  appliesFrom: ProfileLevel
}

const PROFILE_ORDER: ProfileLevel[] = ['P0', 'P1', 'P2', 'P3a', 'P3b']

/** Returns decisions that apply to the given profile level (cascades down). */
export function decisionsForProfile(level: ProfileLevel): Decision[] {
  const idx = PROFILE_ORDER.indexOf(level)
  return ALL_DECISIONS.filter((d) => PROFILE_ORDER.indexOf(d.appliesFrom) <= idx)
}

// ---------------------------------------------------------------------------
// The decisions
// ---------------------------------------------------------------------------

export const ALL_DECISIONS: Decision[] = [
  // ── P0: applies everywhere ────────────────────────────────────────────────

  {
    id: 'search-always-present',
    title: 'Search field always present',
    detail:
      'Every table has a search field in the toolbar — right side, left of the density toggle. It drives AG Grid\'s built-in quick filter and is wired on all profiles.',
    status: 'confirmed',
    appliesFrom: 'P0',
  },
  {
    id: 'no-right-rail',
    title: 'No right rail — all controls in the toolbar',
    detail:
      'The AG Grid side panel (right rail) is disabled on all profiles. Column management uses a toolbar dropdown; filter actions surface as pills above the table. Nothing should open a panel that slides in from the right. Columns also cannot be removed by dragging a header OUT of the grid (suppressDragLeaveHidesColumns) — that is an uncontrolled path with no recovery on P0, which has no Columns button; suppressed kit-wide for consistency. Reordering within the grid still works.',
    status: 'confirmed',
    appliesFrom: 'P0',
  },
  {
    id: 'density-default',
    title: 'Comfortable density at P0, compact from P1 onward',
    detail:
      'P0 (system-of-record) defaults to comfortable (13 px / 48 px rows) — the read-first, look-something-up context. P1 and above default to compact (12 px / 36 px) — the working, data-heavy context. A toggle is available on all profiles.',
    status: 'needs-validation',
    validationNote:
      'Should P0 have a density toggle at all, or is it always comfortable? If P0 is always comfortable, remove the toggle there.',
    appliesFrom: 'P0',
  },
  {
    id: 'no-stacked-headers',
    title: 'Single-line column headers only',
    detail:
      'wrapHeaderText is off and no column definitions nest metadata in the header — no stacked sub-headers. Exception: intentional column groups for period comparison in P3b (MoM/YoY), which are semantic groupings, not stacked repetition.',
    status: 'confirmed',
    appliesFrom: 'P0',
  },
  {
    id: 'locked-right-edge',
    title: 'Locked right edge — no blank space, rightmost column not draggable',
    detail:
      'The table always fills its container and its right edge can never open a gap. Three mechanisms, all in the kit (GridShell) so no profile re-decides: (1) every profile has a flex column that absorbs resizes of OTHER columns; (2) the rightmost column has resizable:false — no right-edge drag handle, so it can\'t be pulled inward to expose blank space (lockRightEdge); (3) when the user drags the flex column ITSELF, AG Grid strips its flex (by design) and a gap would open — so an onColumnResized handler detects the trailing gap and re-applies flex to the trailing column, re-filling the width. Default column-resize behavior is used (NOT colResizeDefault "shift", which broke flex re-absorption on the last column).',
    status: 'confirmed',
    appliesFrom: 'P0',
  },
  {
    id: 'numeric-alignment',
    title: 'Left-align all headers; right-align material amounts in the rows',
    detail:
      'Every column header is left-aligned — no right-aligned headers anywhere. In the row cells, only material amounts (currency and numeric quantities) are right-aligned, with tabular nums so digits line up for scanning. Everything else — text, dates, account numbers, statuses, badges — is left-aligned. Implemented in the kit factories via a shared RIGHT_ALIGNED_CELL cellStyle (justify-content: flex-end, since flex cells ignore text-align); we deliberately do NOT use AG Grid\'s built-in numericColumn/rightAligned types, which right-align the header too.',
    status: 'confirmed',
    appliesFrom: 'P0',
  },

  // ── P1: applies to P1 and above ───────────────────────────────────────────

  {
    id: 'filter-pill-on-column-filter',
    title: 'Column filter → filter pill above the table',
    detail:
      'When a column filter is set, a removable pill appears in the FilterStatusBar above the grid — so the active filter state is always visible and clearable. A single "Clear all" dismisses everything.',
    status: 'confirmed',
    appliesFrom: 'P1',
  },
  {
    id: 'column-mgmt-dropdown',
    title: 'Column management via toolbar dropdown (no right rail)',
    detail:
      'Show/hide columns via a dropdown menu in the toolbar. The AG Grid side panel is disabled — clicking "Columns" opens a lightweight dropdown with checkboxes, not a sliding panel.',
    status: 'confirmed',
    appliesFrom: 'P1',
  },
  {
    id: 'saved-views',
    title: 'Saved views: save + recall column layout, sort, and filters',
    detail:
      'A "Views" button in the toolbar lets users save the current column visibility, sort, and filter state as a named view and recall it. Currently backed by localStorage in the prototype.',
    status: 'needs-validation',
    validationNote:
      'What exactly does a view save? Just columns + sort + filters, or also density? Who controls the default view — user, admin, or org? Should views be shared or personal?',
    appliesFrom: 'P1',
  },

  // ── P2: applies to P2 and above ───────────────────────────────────────────

  {
    id: 'grouping-key',
    title: 'Grouping key in P2 (currently fixed to Category)',
    detail:
      'P2 groups amortization rows by Category. The grouping key is fixed in the prototype — users cannot choose the grouping column.',
    status: 'needs-validation',
    validationNote:
      'Should any column be groupable (user-selectable), or is the grouping key prescribed per surface? For amortization, is Category the right default?',
    appliesFrom: 'P2',
  },
  {
    id: 'inline-edit-scope',
    title: 'Inline edit: only Description is editable at P2',
    detail:
      'P2 demonstrates inline edit with the Description column editable — a proof of concept. Other columns are read-only.',
    status: 'needs-validation',
    validationNote:
      'Which fields should actually be inline-editable at P2? Only text/memo fields? Or amounts as well? Does inline edit need an explicit "edit mode" toggle or is click-to-edit always on?',
    appliesFrom: 'P2',
  },
  {
    id: 'summary-counts-not-dashes',
    title: 'Summary rows show counts; null cells show "—" not blank',
    detail:
      'Group summary rows display a count (e.g., "5 entries") rather than dashes or blanks. Null/missing values in data cells render as "—" via MissingRenderer.',
    status: 'confirmed',
    appliesFrom: 'P2',
  },

  // ── P3a: applies to P3a (workflow) ────────────────────────────────────────

  {
    id: 'sign-off-master-detail',
    title: 'Sign-off interaction in a master/detail expand (P3a)',
    detail:
      'Expanding a reconciliation row opens a detail panel with per-assignee sign-off toggles. Uses AG Grid master/detail — the row expands vertically, not a side drawer.',
    status: 'needs-validation',
    validationNote:
      'Is master/detail the right sign-off interaction? Alternatives: inline sign-off button on the row, or a side drawer on row click. The expand interaction works well for surfacing multiple assignees.',
    appliesFrom: 'P3a',
  },
  {
    id: 'compound-quick-filters',
    title: 'Above-table quick-filter chips for cross-column predicates (P3a+)',
    detail:
      'Pill chips above the table drive AG Grid\'s external filter API for predicates a single column can\'t express — e.g., "Assigned to me" (assignee AND due-date context). Composes with per-column filters.',
    status: 'confirmed',
    appliesFrom: 'P3a',
  },

  // ── P3b: applies to P3b (analytical) ─────────────────────────────────────

  {
    id: 'mom-yoy-column-groups',
    title: 'MoM/YoY comparison uses intentional column groups with 2-line period headers',
    detail:
      'Period comparison columns are grouped under a header (e.g., "Jun 2026 / May 2026"). The 2-line period header is intentional and semantic — different from the "stacked headers we killed," which were repeated non-semantic metadata.',
    status: 'confirmed',
    appliesFrom: 'P3b',
  },
  {
    id: 'materiality-threshold',
    title: 'Materiality threshold hardcoded at 20%',
    detail:
      'Variance rows above 20% are highlighted as material. The threshold is currently a constant in PctRenderer.',
    status: 'needs-validation',
    validationNote:
      'Should materiality be configurable — per surface, per user, or org-controlled? 20% is a reasonable accounting default but may need to be a prop passed by each surface.',
    appliesFrom: 'P3b',
  },
  {
    id: 'drill-in-trigger',
    title: 'Drill-in drawer opens on row double-click (P3b)',
    detail:
      'Double-clicking an analytical row opens a side drawer for deeper investigation. Single-click selects the row; double-click opens the detail.',
    status: 'needs-validation',
    validationNote:
      'Is double-click the right trigger? Alternatives: an explicit expand icon on the row, or single click if row selection isn\'t needed. Double-click is familiar from spreadsheets but less discoverable on the web.',
    appliesFrom: 'P3b',
  },
]
