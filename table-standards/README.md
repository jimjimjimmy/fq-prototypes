# Table Standards

> Consistent interaction patterns for tables across FloQast — one engine, tiered profiles.

## What This Is
A design-standardization effort. FloQast tables are designed surface by surface today — filtering works differently everywhere, saved views are inconsistent, the grid theme has forked ~14 ways. This project defines and prototypes the **cross-cutting interaction patterns** (filtering, saved views, column management, status chrome, density, numerics) so every table uses the same design language, delivered as one AG Grid engine with tiered profiles (P0 → P1 → P2 → P3a/P3b). Design + PM own the strategy and prototypes this quarter; engineering hardens the production build downstream.

## Team

| Name | Role |
|------|------|
| Benjamin Ellis (@bellis) | Product Design Manager — driver |
| Open | Designers / PMs across BUs — see `knowledge/WORKING.md` |

## Quick Links

- **Confluence:** [AG Grid Table Standards](https://floqast.atlassian.net/wiki/spaces/DES/pages/4678844741/AG+Grid+Table+Standards)
- **Research (NotebookLM):** [notebook](https://notebooklm.google.com/notebook/28a5e655-a96f-4c03-95df-70dabfc8afc8)
- **Figma census:** [Tables Audit 2026](https://www.figma.com/board/sN41bXHuEpEIEx70GiOoy0/Tables-Audit)

## The Prototype
A React + Vite + FlowUI showcase in `prototype/` — a shared kit (`_kit/`) consumed by a master showcase that compiles all five profiles, each independently iterable.

```bash
npm --prefix projects/table-standards/prototype install   # first time (needs FloQast npm registry access)
npm --prefix projects/table-standards/prototype run dev    # serves on :5190
```
Deep-link a profile via the URL hash: `#p0` (Simple) · `#p1` (Filterable) · `#p2` (Manipulation) · `#p3a` (Workflow-complex) · `#p3b` (Analytical-complex).

## Current State
Graduated from playspace (2026-07-09). Kit + showcase built and verified across all five profiles. Next: assign profile drivers, iterate the patterns (filtering placement, saved views), and wire real surfaces as ideations. See `knowledge/DECISIONS.md` for the decision log and `knowledge/WORKING.md` for how to contribute.
