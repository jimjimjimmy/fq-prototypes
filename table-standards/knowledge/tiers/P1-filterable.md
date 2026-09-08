# P1 · Filterable

**Status:** Scoping · **Driver:** _TBD_ · **Updated:** 2026-07-08

## Product need
The user's job is to **find a subset in a larger read-only dataset** — filter, sort, manage which columns show. Information-seeking, not editing. Think transaction lists, entity lists, account lists.

## Surfaces it serves
**All Workflows** Dashboard/Entities · **Reporting** Reporting Entities, Chart of Accounts, FDM ERP Tables/Connections · **Compliance** Programs, Risks, Issues, Controls · **Projects** Dashboard, Tasks · **Settings** Team Members (Users — large + bulk). (See `surface-census.md`.)

## Capability this profile turns on
+ Data operations: filtering, column show/hide/pin, larger data volume, sorting. Rows remain **read-only** (mutation is P2).

## Requirements / functionality to honor
- **Filters live ABOVE the table, not in it** — accountants' mental model rejects in-table filters (JEM Design Bar, Jun 18). This is a hard requirement, not a preference.
- **Don't over-layer filters** — entity/period selector + quick-filter chips + column filters is "too layered" (greg via Jenny). Consolidate; SCs prefer a single filter panel.
- Quick-filter chips, set/text filters, typeahead in long dropdowns, "Select All".
- Column show/hide (tool panel or a lightweight columns panel), pinned anchor column.
- "Reset filters" + at-a-glance visibility of what's active.
- Right-align numerics; sort indicators on headers.
- **Saved views** attaches here (cross-cutting) — customers want persistent views.

## Design principles
- Filters above the table; minimize filter layers.
- Anti-horizontal-scroll — pin the anchor column, avoid forcing scroll to reach a filter.
- Numeric conventions.

## Open questions
- How many filter layers are acceptable before it's "too much"? What's the standard stack?
- Consolidated filter panel vs. inline quick filters — SCs prefer the panel; what's the default?
- Where does saved-views live in the chrome (cross-cutting decision)?

## Ideation log
- **2026-07-08** — Established. Core tension: powerful filtering vs. the accountant preference for simplicity + above-table filters. The win is *fewer, clearer* filter surfaces, not more.

## Links
- `projects/defender` grids, `data-studio` CatalogTable (reference impls)
- Cross-cutting: `../cross-cutting/filtering.md`, `../cross-cutting/saved-views.md`
- Design Bar filtering feedback (see `../research/`)
