# P3b · Analytical-complex

**Status:** Scoping · **Driver:** _TBD_ · **Updated:** 2026-07-08
**Peer of:** P3a Workflow (same design law, different capability class)

## Product need
The user's job is to **analyze financials** — explain variances/flux, read statements, build reports. Reviewer validates the completeness of the variance control (all material variances in IS + BS explained) and signs off; preparer writes explanations from transactions, trends, prior periods. **Not a general BI tool** — Whitmire: "we can't be Anaplan + Looker." Drawing that scope line is part of this solution's job.

## Surfaces it serves
**Balance Sheet**, **Income Statement**, **Variance Analysis**, **AI Variance Analysis**, **Reporting (Report Builder)**, and possibly **Intercompany**. (See `surface-census.md`.) Mostly AG Grid today.

## Capability this profile turns on
+ Pivot / aggregate / reshape (peer of P3a's workflow depth): comparison analytics, master/detail on pivoted data, presets/saved reports, tiered/admin settings.

## Requirements / functionality to honor
_From the reporting prototype survey, Edith's use-case notes, and the AG Grid Optionality PRD (Confluence 4430209556):_
- **Grouping + aggregation** — user-regroupable; subtotals / grand-totals / calculated rows; custom aggs (`consistentOrDash`).
- **Comparison column blocks** — MoM + YoY as column groups, each = Amount / Var $ / Comparison / Var % / Explanation; **two-line, period-aware headers**.
- **Variance renderers** — signed $/% with **materiality highlighting** (≥20% or $50K/10%); in-grid **AI explanation** ("Draft with AI" on material rows); **sign-off finalization** on the collection; ownership avatar stacks; status pills; progress/breakdown for rollups.
- **Focus-mode transaction validation** — validate explanation against transactions, grouped by department to spot account movements.
- **Column / view management** — two-tier columns (core + optional default-hidden); real tool-panel sidebar; **saved/custom reports as presets** + default landing view.
- **Tiered / admin settings governance** — org "company standard reports," admin-controlled column visibility, app-level deviations (Steve Raeder). Cross-cutting, but P3b is its loudest consumer.
- **Settings drawer** — ~13 grid toggles (floating filter, grouping header, subtotals, wrap, expand-all…), presets (Audit / Compact / Extended); **cascading persistence** (child reports inherit); **< 200ms** grid-state apply (no layout shift).
- **Drill-down** — transaction drill-down; deep-link "View in Grid" (row-flash); NetSuite transaction deep-links (Confluence 4476666206).
- **Variance-completeness report**; appetite for "other reports" (expenses by vendor, revenue by product) — **scope-gate these.**

## Design principles
- **Accept width, but tame it** — comparison data is inherently horizontal; pin the anchor, fold MoM/YoY into **column groups**, offer a **compact density** theme, drill into **detail in a drawer**. Don't fight horizontality with endless filters.
- **Master/detail, not "Swiss cheese"** — don't pivot flat into sparse empty-cell grids; use summary counts + detail sub-tables.
- **Draw the scope line** — this is variance explanation, not a BI platform.
- Real Enterprise, not faked chrome (convert `reporting-aiv`).

## Open questions
- **How much analytical complexity is in-scope vs. out** (the Whitmire line)?
- **Tiered-settings governance model** — the least-defined piece; who controls what, and how it cascades.
- **Intercompany** — P3b or P3a?
- ~~Production AG Grid Enterprise position~~ → **DECIDED: build on Enterprise (D-008)** (P3b hard-depends on pivot / master-detail / sidebar).

## Ideation log
- **2026-07-08** — Established. Target stack already exists: `reporting-bu-q3` (unified v33 + real Enterprise + shared `agGridConfig`). Generalize that and layer in variance renderers proven by `ai-variance` + `reporting-aiv`.

## Links
- Target stack: `projects/reporting-bu-q3-2026-designs`; also `playspace/ai-variance`, `projects/reporting-aiv`, `projects/ai-variance-prototype`
- PRDs: Optionality 4430209556 (IDEA-2369/REPORTING-14185) · NetSuite linking 4476666206 · Variance Skills IDEA-2453 · FDM Saved Views 4432560453
- Tables Audit board — Reporting Tables section
- Cross-cutting: `../cross-cutting/settings-governance.md`, `saved-views.md`, `horizontal-space.md`
