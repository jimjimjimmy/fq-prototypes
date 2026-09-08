# P3a · Workflow-complex

**Status:** Scoping · **Driver:** _TBD_ · **Updated:** 2026-07-08
**Peer of:** P3b Analytical (same design law, different capability class)

## Product need
Accounting work that is simultaneously a **system of record** (status of every item, ownership, open/late/done) **and a system of work** (act on items, sign off, leave review notes). Preparer and reviewer both live here multiple times per close.

## Surfaces it serves
**Recs**, **Checklist**, **Folders**, and likely **JEM Homepage**. (Checklist is the parity *leader*; Recs the laggard. See `surface-census.md`.) All FlowUI today; migrating to AG Grid.

## Capability this profile turns on
+ Workflow & hierarchy: status model, preparer/reviewer sign-off chain, master/detail on hierarchy (rec → reconciling items → transactions), quick + global filters, cross-surface parity.

## Requirements / functionality to honor
_Anchored to Edson's PRD (IDEA-2641, Confluence 4632215793) — Recs Table States Pass 1:_
- **Column-level sort + set/multi filter** on every filterable column (the 73% / $12.7M ARR slice).
- **Global filter drawer** (search-header dropdowns) + **quick-filter chips**; add **Open Review Notes** chip and **Frequency** global filter (Checklist parity — Recs is the laggard).
- **Group-to-Count** reconciliation pattern: single group row → inline expand/collapse → child accounts + Total row + Close Group.
- **Single-entity column collapse** (drop "Entity /" when filtered to one entity) — recovers horizontal space.
- **Status model** incl. Recs-only Redo state; **sign-off state machine** (preparer → reviewer → reviewer 2); **review notes** with counts; **avatar-stack assignees**.
- **Master/detail** rec → items → transactions via expand-row / drawer.
- **Checklist parity** is Pass 1's core; **Folders** gets its own follow-on (folder roll-up math, sub-entity hierarchy).
- **Pass 2 "Advanced View"** = the containerized, column-split redesign (the anti-flat direction) — the P3a design target beyond parity.

## Design principles
- **Containerization over more filters** — customers overuse filters because tables are too wide; the fix is master/detail + expandable groups + focused containers, not another filter layer.
- **Anti-horizontal-scroll** — accountants use mice, not trackpads. Contain width via master/detail.
- **Expand-row, not popover** — FloQast users expect a row to expand vertically; if a popover is used, add a badge so they anticipate it (Recs Multicurrency, May 19).
- Filters above the table.

## Open questions
- **Parent vs. sibling to Edson's PRD?** (lean: parent — this owns the cross-surface wrapper + license + rewrite decisions his PRD punted).
- **P3a depth:** pattern spec vs. reference build of the "Advanced View" container?
- **Intercompany** — P3a or P3b? (tests the "treat peers the same" call.)
- Need **close-monorepo** checked out to enumerate ALL current Recs/Checklist functionality before ideating, so nothing gets dropped.

## Ideation log
- **2026-07-08** — Established. Pass 1 (Edson) is deliberately conservative/flat; our P3a design target is Pass 2's containerized direction. Sequence: parity first (fast, high-ARR), containerized redesign second.

## Links
- Recs PRD: Confluence 4632215793 (IDEA-2641); prototype `playspace/close-table-states/proto-table-q3-pass1-v4.html`
- `playspace/recs-ag-grid`, `projects/catalyst` recs pages
- Tables Audit board — Close Tables (Recs, Checklist, JEM)
- Cross-cutting: `../cross-cutting/horizontal-space.md`, `filtering.md`
