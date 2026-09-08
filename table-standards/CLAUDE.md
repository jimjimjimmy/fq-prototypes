# Table Standards

## Overview
A design-standardization effort to bring consistent interaction patterns to tables across FloQast. The real work is **the cross-cutting patterns** — filtering, saved views, column management, status chrome, density, numerics — applied consistently across a **profile ladder** (P0 Simple → P1 Filterable → P2 Manipulation → P3a Workflow-complex / P3b Analytical-complex), all on one table engine (AG Grid Enterprise, with FlowUI Table as an alternate for the simplest read-only P0 cases). The profiles are the *context* in which the patterns apply; the patterns are the deliverable.

## Goal
Define, design, and prototype the interaction standards so every FloQast table uses the same design language — then hand engineering a clear, consistent target to harden in production. Design + PM own strategy + prototypes this quarter (Q3 2026); engineering owns the production build downstream.

## Contributors
- @bellis (Product Design Manager — driver)
- Open to designers/PMs across BUs — see `knowledge/WORKING.md` to pick up a profile.

## Status
Phase: prototyping
Started: 2026-07-09

## Design System
Status: hybrid
Notes: FlowUI as the visual base (real `@floqastinc/flow-ui*` + `Theme.apply()`) + AG Grid Enterprise for the tables, themed via the shared kit so a user "can't tell it's AG Grid." The kit encodes Design Bar guidance: single-line headers, compact-by-default, right-align amounts/dates + left-align account numbers, master/detail over pivot-expand, summary counts over dashes, filters not in the right tool panel.

## Figma Files
- Tables Audit 2026 (Tyler Davis) — product-wide table census / primary reference: https://www.figma.com/board/sN41bXHuEpEIEx70GiOoy0/Tables-Audit
- Checks – Recs in AG Grid — anti-pattern reference (flat, filter-heavy; the direction we're moving away from): https://www.figma.com/design/aoTXrOSj1wLJDcM7Er6yAA/Checks---Recs-in-AG-Grid

## External Links
- Confluence: AG Grid Table Standards (DES space): https://floqast.atlassian.net/wiki/spaces/DES/pages/4678844741/AG+Grid+Table+Standards
- NotebookLM (project research): https://notebooklm.google.com/notebook/28a5e655-a96f-4c03-95df-70dabfc8afc8
- Consumer PRDs: Recs Table States (IDEA-2641), Reporting AG Grid Optionality (IDEA-2369) — see `knowledge/links.md`

## Key Knowledge
- `knowledge/rubric.md` — which table + how it behaves (the Phase 0 framework)
- `knowledge/DECISIONS.md` — running decision log (D-001…D-012, open decisions OD-1…OD-4)
- `knowledge/WORKING.md` — how to collaborate + prototype architecture + how to run
- `knowledge/goals.md` / `knowledge/overview.md` — problem, vision, the model
- `knowledge/tiers/` — one home base per profile (P0…P3b) + `surface-census.md`
- `knowledge/cross-cutting/` — the pattern specs (filtering, saved-views, settings-governance, horizontal-space, numeric)
- `knowledge/research/` — evidence base (Design Bar, Slack, repo divergence, reporting survey)

## For Claude
When working on this project:
- **Read `knowledge/` first** — especially `WORKING.md` (architecture + conventions), `DECISIONS.md`, and the relevant `cross-cutting/` pattern before touching the prototype.
- **The prototype is `prototype/`** — a React + Vite + FlowUI app: a shared `_kit/` (`@kit`) consumed by a `showcase/` that compiles all five profiles (`profiles/P0-simple` … `P3b-analytical`). Run: `npm --prefix projects/table-standards/prototype run dev` (first time: `npm install`). Deep-link profiles via `#p0`…`#p3b`.
- **Consistency by construction** — common patterns (theme, renderers, filters, chrome) live in `_kit/`. Don't re-author them per profile; extend the kit and let it propagate. Promote patterns proven in an ideation back into `_kit/`.
- **Filtering direction** (OD-4, Benjamin 2026-07-09): per-column native filters as the default base, restyled to look FlowUI; above-table compound pill-chips for cross-column predicates ("late items assigned to me"). Both compose.
- Design system is `hybrid` — use the `flow-ui-design-system` skill for FlowUI work; pull component props from `flow-ui-mcp` and guidance from the zeroHeight MCP before implementing UI.
- Run `npm --prefix projects/table-standards/prototype run typecheck` after changes.
- AG Grid Enterprise runs on the trial watermark (fine for prototypes) — the license banner in the console is expected, not an error.
