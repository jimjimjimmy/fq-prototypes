# Profile Design Decisions

**Source of truth:** `prototype/src/_kit/decisions.ts` (live, drives the prototype spec panel)  
**This file:** human-readable export for async review and Confluence updates. Update it when decisions are confirmed or changed.  
**Confluence:** [AG Grid Table Standards](https://floqast.atlassian.net/wiki/spaces/DES/pages/4678844741/AG+Grid+Table+Standards) — lagging source; update when a batch of decisions are confirmed.

---

## How this works

Decisions cascade down the profile ladder. A **P0** decision applies everywhere. A **P1** decision applies to P1, P2, P3a, and P3b. The prototype's spec panel shows all relevant decisions for the current profile level.

**Status meanings:**
- ✅ **Confirmed** — direction is set, use this as the standard
- 🟡 **Needs validation** — implemented a working direction, needs explicit approval or specification before locking in
- 🔵 **Open** — not yet decided

---

## P0 — applies to all profiles

| Decision | Status | Notes |
|----------|--------|-------|
| Search field always present in the toolbar | ✅ Confirmed | Right side, left of density toggle. Drives AG Grid quick filter. |
| No right rail — all controls in the toolbar | ✅ Confirmed | AG Grid side panel is disabled. Column management = toolbar dropdown. Filter state = pills above table. Columns can't be removed by dragging a header out of the grid (`suppressDragLeaveHidesColumns`, kit-wide) — no recovery on P0, which has no Columns button. Reordering within the grid still works. |
| Comfortable density at P0, compact from P1 onward | 🟡 Needs validation | P0 defaults comfortable (13px/48px rows). P1+ defaults compact (12px/36px). Should P0 have a density toggle at all, or always-comfortable? |
| Single-line column headers only | ✅ Confirmed | `wrapHeaderText` off. Exception: P3b MoM/YoY column groups (semantic groupings, not stacked metadata). |
| Locked right edge — no blank space, rightmost column not draggable | ✅ Confirmed | Applied by the kit (`GridShell`). (1) Every profile has a `flex` column that absorbs resizes of other columns. (2) The rightmost column is `resizable: false` — no right-edge drag handle, so it can't be pulled inward to expose blank space (`lockRightEdge`). (3) When the user drags the **flex column itself**, AG Grid strips its flex (by design) and a gap would open — an `onColumnResized` handler detects the trailing gap and re-applies `flex` to the trailing column, re-filling the width. Uses default column-resize behavior (not `colResizeDefault: "shift"`). |
| Left-align all headers; right-align material amounts in the rows | ✅ Confirmed | **All headers left-aligned** — no right-aligned headers. In row cells, only material amounts (currency + numeric quantities) are right-aligned with tabular nums; everything else (text, dates, account numbers, statuses, badges) is left-aligned. Kit factories apply a shared `RIGHT_ALIGNED_CELL` (`justify-content: flex-end` — flex cells ignore `text-align`). We do **not** use AG Grid's built-in `numericColumn`/`rightAligned` types (they right-align the header). |

---

## P1 — applies to P1, P2, P3a, P3b

| Decision | Status | Notes |
|----------|--------|-------|
| Column filter → filter pill above the table | ✅ Confirmed | Every active column filter shows as a removable pill in FilterStatusBar. "Clear all" dismisses everything. |
| Column management via toolbar dropdown (no right rail) | ✅ Confirmed | Checkbox list opens from a "Columns" toolbar button. AG Grid sidebar is disabled. |
| Saved views: save + recall column layout, sort, and filters | 🟡 Needs validation | "Views" button in the toolbar. Currently localStorage. Open: what exactly is saved? Are views personal or shared? Who sets the default? |

---

## P2 — applies to P2, P3a, P3b

| Decision | Status | Notes |
|----------|--------|-------|
| Grouping key is currently fixed to Category | 🟡 Needs validation | Amortization prototype groups by Category. Should any column be user-groupable, or is grouping key prescribed per surface? |
| Inline edit on Description column only | 🟡 Needs validation | One editable column as proof of concept. Which fields are actually editable at P2? Click-to-edit always on, or requires an "edit mode" toggle? |
| Summary rows show counts; null cells show "—" | ✅ Confirmed | Group summaries: "5 entries" (not dashes). Null/missing: "—" via MissingRenderer. |

---

## P3a — workflow-complex

| Decision | Status | Notes |
|----------|--------|-------|
| Sign-off interaction in a master/detail expand | 🟡 Needs validation | Expanding a rec row reveals per-assignee sign-off toggles. Alternatives: inline sign-off button on the row, or a side drawer. |
| Above-table quick-filter chips for cross-column predicates | ✅ Confirmed | Pill chips ("Assigned to me", "Overdue") drive AG Grid external filter. Composes with per-column filters. |

---

## P3b — analytical-complex

| Decision | Status | Notes |
|----------|--------|-------|
| MoM/YoY uses column groups with 2-line period headers | ✅ Confirmed | These are intentional semantic groupings (period labels), distinct from the "stacked headers we killed" (which were repeated metadata). |
| Materiality threshold hardcoded at 20% | 🟡 Needs validation | Highlights variances > 20% as material. Should this be configurable per surface, user, or org? |
| Drill-in drawer on row double-click | 🟡 Needs validation | Double-click → side drawer with deeper investigation context. Alternatives: click on an explicit expand icon. Double-click is spreadsheet-familiar but less discoverable on web. |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-07-09 | Initial decisions file created from prototype build review |
| 2026-07-09 | Added: locked right edge (no blank space; rightmost column resizable:false via kit `lockRightEdge`). Replaced the earlier `colResizeDefault: "shift"` approach, which still let the last column drag open a gap. P3a Entity → flex:1. |
| 2026-07-09 | Reworked alignment rule: **all headers left-aligned**, only material amounts right-aligned in rows (dates now left-aligned). Fixed the real bug — flex cells ignored `text-align: right`, so amounts were rendering left while headers were right. Dropped built-in `numericColumn`/`rightAligned` types in favor of a shared `RIGHT_ALIGNED_CELL` cellStyle. |
| 2026-07-09 | Right-edge fix, round 2: resizing the flex column itself still opened a gap (AG Grid strips flex on manual drag). Added an `onColumnResized` handler in GridShell that re-applies flex to the trailing column when a gap is detected, so the table always re-fills. |
| 2026-07-09 | Disabled drag-a-header-out-of-grid to hide columns (`suppressDragLeaveHidesColumns`, kit-wide) — no recovery on P0. Added an outer border + rounded corners to the P0 FlowUI alternate table. |
