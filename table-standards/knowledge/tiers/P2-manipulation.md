# P2 · Manipulation

**Status:** Scoping · **Driver:** _TBD_ · **Updated:** 2026-07-08

## Product need
The user's job is to **do work in the table** — edit values, create adjustments, group and aggregate, match records. This is where mutation begins, which is the real complexity line (dirty state, validation, save, undo).

## Surfaces it serves
**AI Matching**, **Amort / Depreciation**, **Adjustment Entries**, **FDM Dimension Grouping Mapping**. (Variance is P3b — it shares mutation but is analytically complex. See `surface-census.md`.)

## Capability this profile turns on
+ Mutation & aggregation: inline editing, row grouping with user-regrouping, subtotals / grand-totals / calculated rows, custom aggregations.

## Requirements / functionality to honor
- **Inline editing** — a standard interaction + validation + dirty-state + save model (per-cell vs. batch — decide). Undo where feasible.
- **Row grouping** the user can re-drag — must survive React re-renders (use `initialRowGroup`/`initialHide`, not controlled `rowGroup`+`hide`, which fight the user's drag). Documented gotcha from `ai-variance`.
- **Subtotals / grand-totals / calculated rows** with distinct styling; custom aggs (e.g. `consistentOrDash` for mixed child types — avoids the "noisy dash/value mix" Andrew flagged).
- **Bulk row selection + actions** (checkbox column pinned left, row numbers).
- Right-align numerics; signed/colored deltas where relevant.

## Design principles
- **Mutation is the dividing line** — everything above P1 is about doing, not just seeing.
- Prefer **master/detail** over ever-wider grids when hierarchy appears (anti-horizontal-scroll).
- Group cleanly (summary counts, hide child data until expanded) rather than pivoting flat into "Swiss cheese."

## Open questions
- Standard inline-edit interaction + save model (per-cell autosave vs. batch commit)?
- How much of grouping/aggregation is P2 vs. escalates to P3b analytical?
- AI Matching: is it P2 (act/match) or does its volume push it toward P1-with-actions?

## Ideation log
- **2026-07-08** — Established. The `ai-variance` VarianceGrid is the deepest reference for grouping mechanics; the `fdm-rollup` mapping table for edit-heavy interaction.

## Links
- `playspace/ai-variance/src/components/VarianceGrid.tsx` (grouping, custom renderers)
- `fdm-rollup` (Tyler/Carmen — mapping/edit) → matured in `reporting-bu-q3`
- Cross-cutting: `../cross-cutting/` (horizontal-space, numeric)
