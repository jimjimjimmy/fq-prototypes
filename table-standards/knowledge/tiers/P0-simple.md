# P0 · Simple

**Status:** Scoping · **Driver:** _TBD_ · **Updated:** 2026-07-08
**Alternate:** FlowUI Table (the off-ramp — teams may stay here for the simplest read-only cases)

## Product need
The user's job is to **look something up and move on.** Bounded row count, stable columns, read-dominant. No filtering workflow, no editing, no bulk actions. The bar: a table that's quiet, fast, and unremarkable — it should never feel "heavy."

## Surfaces it serves
Most of **Admin Settings** (Workflows, Entities, Roles, Group, API Keys, Connections, Checklist settings, FDM settings), **Compliance** Key Reports / Key Systems / Policies, **Projects** Agents. (See `surface-census.md`.)

## Capability this profile turns on
Display + optional single-column sort. Community modules only. Optional column show/hide. Nothing else by default.

## Requirements / functionality to honor
- **Quiet chrome** — no heavy borders, no busy header, no filter row unless explicitly invoked. Visually as light as a static/FlowUI table. *This is the linchpin: if P0 looks like out-of-the-box AG Grid, the whole "one engine" thesis collapses.*
- Right-align numerics; decimal consistency; left-align text.
- `adminLite` density (fontSize 13, spacing 12, headerHeight 44) — the existing good model.
- Graceful empty/loading states.

## Design principles
- **"Quiet until you need it."** Data-layer power is available but invisible until invoked.
- **FlowUI Table stays valid here** — graduation to AG Grid is gravity, not mandate. Compliance is the test bed for what correctly stays FlowUI.

## Open questions
- **The floor:** below what row/column count is P0 (AG Grid) overkill vs. just using FlowUI Table? Define the line so teams aren't reaching for AG Grid on a 3-row settings list.
- Which Admin/Compliance surfaces should *stay* FlowUI vs. migrate?

## Ideation log
- **2026-07-08** — Established. Model on `adminLiteGridTheme` (the one place a theme is properly `.withParams()`-extended today). The design challenge is making AG Grid P0 indistinguishable from a lightweight static table.

## Links
- `adminLiteGridTheme` + `projects/admin-agent/prototype` (reference impl)
- Tables Audit board — Admin Settings + Compliance sections
- Cross-cutting: `../cross-cutting/` (numeric conventions)
