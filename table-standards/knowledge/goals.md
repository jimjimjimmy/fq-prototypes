# Goals — AG Grid Standardization

## Problem
FloQast tables are designed surface by surface, with no shared interaction standards. The result is a fragmented experience: filtering works differently on every table (above-table, per-column, stacked with selectors — no consistency), saved views are missing or inconsistent, the visual theme has forked ~14 ways, status chrome isn't recognizable across surfaces, and there's no shared answer for how tables should behave. Teams re-design the same patterns from scratch, engineering re-implements per surface, and users learn each table separately.

Underlying this is three-technology fragmentation (legacy FQUI, FlowUI, AG Grid) with no rubric for which to use or how to configure consistently — but the primary problem being solved is the **interaction design fragmentation**, not the technology choice.

## Vision
Every FloQast table uses the same interaction design language: a defined visual theme, consistent filtering behavior, predictable saved views, shared column management, and recognizable status patterns — regardless of which surface. The design standards exist once; feature teams apply them. Improvements propagate across the product instead of being re-designed per surface.

The shared engine (AG Grid Enterprise) is what makes this possible at scale. FlowUI Table remains a valid alternate for the very simplest read-only cases.

## Objectives
1. **Define the interaction patterns** — for each cross-cutting concern (filtering, saved views, column management, status chrome, density, numerics, settings governance, horizontal space), produce a clear design standard that any designer or PM can apply to a surface.
2. **Define the profile rubric** — a consistent, teachable answer to "which profile fits this surface," so teams stop re-litigating table choice per feature. (P0 Simple → P1 Filterable → P2 Manipulation → P3a Workflow-complex / P3b Analytical-complex.)
3. **Design and prototype each profile** — reference implementations proving each tier and the cross-cutting patterns in context. Sequenced by ROI (Recs/Checklist parity + header sort/filter first).
4. **Settle the AG Grid Enterprise position** — unblocks the recs, reporting-optionality, and table-settings PRDs that were stuck on the same license question.
5. **Hand off to engineering to productize** — this group delivers the strategy + prototype patterns; **engineering** then hardens them into one production implementation standardized across all features. Happens after this group's design/standardization work completes this quarter.

## Success metrics (draft — refine)
- Interaction patterns documented: each cross-cutting pattern has a design spec with clear do/don't guidance.
- Rubric adopted: directors align on the profile framework — teams stop re-debating table choice per feature.
- Shared prototype kit replaces per-surface re-authoring — proving common patterns can be built once and consumed by multiple ideation prototypes.
- Recs↔Checklist parity gap closed (the 73% / $12.7M ARR slice) using the shared patterns.
- No new surface designs a filtering or saved-views pattern from scratch (they reference the standard instead).

## In scope
- Interaction pattern designs and specs for all cross-cutting concerns.
- Profile rubric and tier specs (P0–P3b).
- Reference prototypes proving each tier + the cross-cutting patterns.
- Coordination with in-flight feature PRDs (recs, reporting) so they consume the standard rather than fork.

## Anti-scope (draw the line)
- **Not a BI tool.** Reporting is variance explanation, not Anaplan/Looker (Whitmire). The project decides which analytical complexity belongs in a FloQast table vs. out of scope.
- **Not forcing a big-bang migration.** FlowUI Table stays valid for simple cases; migration is gravity, not mandate.
- **Not owning feature-level product decisions** inside consumer PRDs — the project owns the table primitives and interaction standards; feature teams own their surfaces.
- **Not the production build.** This group delivers the strategy + prototypes; **engineering** hardens and standardizes the real AG Grid implementation across features, downstream, after this quarter.
