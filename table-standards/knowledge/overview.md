# AG Grid Standardization — FloQast Tables

**Status:** Prototyping · **Owner:** Benjamin Ellis · **Started:** 2026-07-08
**Home:** tracked project `projects/table-standards/` (graduated from playspace 2026-07-09). Confluence: AG Grid Table Standards (DES). This doc is the original scoping overview; see `../README.md` + `../CLAUDE.md` for the current entry points.

## The one-liner
Standardize the interaction patterns for tables across FloQast — filtering, saved views, column management, status chrome, density, numerics — so every surface uses the same design language and no team re-invents these from scratch. AG Grid Enterprise is the shared engine; the design work is the patterns.

## Why now
- Tables are the most-used element in the product, but every surface designs them independently: filtering works differently per table, saved views are missing or inconsistent, the visual theme has forked ~14 ways.
- No shared answer for "which table" or "how should it behave" → teams re-debate per feature, engineering re-implements per surface, customers learn each table separately.
- ~73% of customer table-state pain ($12.7M ARR) is addressable by header sort/filter + Recs↔Checklist parity — both depend on shared patterns, not per-surface builds.
- Engineering (greg.jones, abhijit.aghao) is blocked waiting on a reusable component that can only be built once the interaction standards exist.

## The model: cross-cutting patterns × profile ladder
**The patterns are the work.** These are what need to be designed and standardized:
- **Visual theme & density** — row height, header style, zebra, compact mode
- **Filtering** — placement (above-table / per-column / both), layers, controls, active-state visibility
- **Saved & persistent views** — how users save state, where presets live, who controls defaults
- **Column management** — show/hide, reorder, pin
- **Status & workflow chrome** — status badges, sign-off, flags, progress
- **Numerics** — alignment, decimals, signed deltas, zero vs. null
- **Settings governance** — user / admin / org control
- **Horizontal space** — pinning, master/detail, folding groups, drill-in

**The profiles are the context** — which patterns turn on at each complexity level:
```
                              ┌── P3a · Workflow-complex  → Recs / Checklist / Folders
P0 → P1 → P2 ─────────────────┤     status · sign-off · master/detail on hierarchy
(each = prev + one            └── P3b · Analytical-complex → Reporting / Variance
 capability class)                  pivot · aggregate · MoM/YoY column groups · presets

P0 · Simple        theme + light sort                       ← FlowUI Table = alternate P0
P1 · Filterable    + filtering · column mgmt · saved views
P2 · Manipulation  + inline edit · grouping · aggregation
P3a / P3b          + workflow OR analytical depth           (peers — treated the same)
```

## Folder architecture (proposed — architecting in chat)
```
ag-grid-standardization/
  README.md            ← this file (overview + model + status)
  goals.md             ← goals, objectives, success metrics, scope / anti-scope
  DECISIONS.md         ← running decision log
  links.md             ← NotebookLM, Figma, Confluence PRDs, Jira ideas, coordination map
  rubric.md            ← Phase 0 deliverable: "default to the FloQast table, pick your profile"
  tiers/               ← one spec per profile (P0 … P3b)
  cross-cutting/       ← filtering · saved-views · tiered-settings · chrome · horizontal-space · numeric
  research/            ← divergence inventory · design-bar feedback · slack feedback · reporting survey
  prototypes/          ← reference builds (later phases)
```

## Phase plan
- **Phase 0 — Align** (now): the rubric + production AG Grid Enterprise position + gap assessment. The artifact that goes to directors.
- **Phase 1 — Standards**: tier specs + cross-cutting modules. Sequence by ROI (Recs/Checklist parity + header sort/filter first).
- **Phase 2 — Productize (engineering-led, after this quarter)**: engineering hardens this group's strategy + prototype patterns into one production implementation standardized across all features (consolidating the 3 shared assets). This group's deliverable is the strategy + prototypes that spec it; engineering owns the production build.
