# Cross-cutting — Numeric Conventions

**Status:** Draft v1 · **Updated:** 2026-07-08 · Applies to: all profiles with numeric data

## Rules
- **Right-align** all numeric columns; **left-align** text. Enables fast vertical scanning/comparison.
- **Decimal consistency** within a column — same precision top to bottom.
- **Tabular / monospaced figures** for numbers (Roboto Mono per FlowUI conventions) so digits align.
- **Thousands separators**; currency symbol per locale (i18n: en/fr/de/ja).
- **Signed deltas** colored + signed: variance $ and % show green/red with explicit +/− (see variance renderers in `../tiers/P3b-analytical.md`).
- **Materiality highlighting** where relevant — threshold-driven pill (e.g. ≥20% or $50K/10%).
- **Missing/empty states** are explicit, not blank — e.g. Recs Reconciled Balance uses `Missing / Missing* / Value`; use a consistent dash for true nulls.
- **Sort on the primary value** for multi-value cells (e.g. Account sorts on number prefix) even though the cell shows all values.

## Open questions
- Negative representation — parentheses `(1,234)` (accounting convention) vs. minus `-1,234`? Confirm the standard.
- Zero vs. null vs. dash — one consistent treatment.

## Designer checklist
- [ ] Numerics right-aligned, tabular figures?
- [ ] Consistent decimals per column?
- [ ] Signed deltas colored + signed?
- [ ] Explicit missing/zero states?
