# Research — Design Bar Feedback (captured)

Mined from the Design Bar NotebookLM (`a09c7a5a-755e-4b6a-9cfc-e34d8d32fccd`), 2026-07-08. Quotes attributed to speaker + session + date. This is the qualitative evidence base for the design principles.

## Horizontal scrolling is a real hardware-driven problem
- **Scott Bair** (MWCS Design Bar, Jan 22) — accountants navigate with **mice, not trackpads**; horizontal scroll is unnatural → design for vertical scroll.
- **Carlos Avila** (Close Reimagine, Feb 11) — a massive data grid is a false "silver bullet": "all it's doing is flattening the data anyways, and you were just trading it off for a horizontal scroll."
- **Rams / Mike Whitmire** + **Will Emmons** (MWCS Apr 29 / JR Bi-weekly May 8) — dense reporting view forced "**dual horizontal scrolls**"; real-estate challenge worsened by the left nav staying open.

→ **Principle:** minimize horizontal scroll. Workflow-complex contains width via master/detail; analytical-complex tames it via pinned anchors + foldable column groups + compact density + drill-in-drawer.

## Flat architecture → containerization
- **Joe Ryan** (Compliance Operational Audits, Feb 24) — "I want to undo some of the FloQast thinking of the past where it's all just flat and you have to jump around... things have context."
- **Benjamin Ellis** (MWCS Feb 26) — drill-down pages built from "**containerizations** of this information" that dynamically populate and resize.

→ **Principle:** containerization over more filters. Customers overuse filters because tables are too wide.

## Master/detail beats "Swiss cheese" pivots
- **Andrew Baranak** (AG Grid QoL, Mar 18) — heavily pivoting flat tables across periods creates "**Swiss cheese** data structure" (sparse, empty cells); row grouping showed an incoherent dash/value mix. Solution landed: AG Grid **master/detail detail-tables** + **summary counts** (hide child data until expanded) + **subtable column picker** + custom per-detail filters.

→ **Principle:** don't pivot flat into sparse grids; use summary counts + detail sub-tables.

## Expand-row, not popover
- **Jimmy Chen / Tyler Davis / Benjamin Ellis** (Recs Multicurrency, May 19) — Jimmy used a popover ("show 3 more") to avoid growing the row; Tyler + Benjamin pushed back: FloQast users **expect the row to expand vertically** ("we have infinite vertical space"). If a popover is used for usability, add a **badge** so the user anticipates it rather than an expanding detail row.

→ **Principle:** expand-row is the default; popover requires a distinct visual indicator.

## Reporting-specific (why AG Grid has a bad rep)
- **Marc Reicher** (MWCS Jan 22) — "infinite requests" about default column order; users delete columns in Excel after **every** export. Column management is a top complaint.
- **Steve Raeder** (AG Grid QoL, Mar 18) — per-table column visibility is "not very scalable"; strong demand for **tiers of settings**: org "company standard reports," admin ability to hide columns from exposure entirely, app-level deviations ("even though it's all ag grid, different experiences might demand deviations").
- **Steve Raeder** (Data Studio, Jan 28) — **workflow disconnect**: users map data in FDM, then must jump to Report Builder to see if the output is right. No in-context validation.
- **Martin Mijares + Tyler Davis** (Compliance Homepage, Apr 30) — Reporting "has a lot of nested items," must stay AG Grid even as other areas move away. Tyler: "simpler is better when you can get away with it," and "we're getting negative feedback around some of the implementation decisions around ag grids." *(Supports unify-on-AG-Grid: Reporting can't go to FlowUI Table.)*
- **Mike Whitmire** (JR Bi-weekly, May 8) — the name "Reporting" sets Anaplan+Looker expectations; it's really for variance explanations. Wants to **rename to "Variance Reports"** and scope down: "we can't say yes to everything."

→ **Principles:** tiered/admin settings is a governance module; draw the scope line (not a BI tool); real Enterprise beats faked chrome.

## Edith Espinoza — variance use-case notes (from Tables Audit board stickies)
- **AI Variance Analysis:** reviewer wants oversight of how work is grouped into collections + team progress on assignments; preparer wants "what's assigned to me across collections and its status."
- **Material Variances:** reviewer reviews completed explanations + signs off on the whole collection (finalization); preparer writes explanations using transactions/trends/prior explanations/notes + addresses review notes.
- **Focus mode (transaction table):** validate explanation against transaction data; group transactions by department to identify account movements.
- **Variance Analysis Reports:** validate completeness of the variance control (all material variances in IS + BS explained); compare to historical periods via amount values (not a chart).
- **Other reports appetite:** expenses by vendor, revenue by product; a variance-completeness report to assess gaps.
