# Cross-cutting — Filtering

**Status:** Draft v2 · **Updated:** 2026-07-09 · Applies to: P1, P3a, P3b (P0 has none by default)

## Working direction (Benjamin, 2026-07-09) — two layers, prototyped
1. **Per-column filtering is the default base layer.** The most straightforward, out-of-the-box AG Grid mechanism (Set / Text / Number filters). We keep the native filter *engine* and **restyle its popup to look FlowUI** — Inter type, 6px radii, FQ-green accents, comfortable spacing — so it reads as a FloQast control, not raw AG Grid. Reached from the header filter icon; **not** always-on floating search boxes (Greg: "does that really need to be exposed?"), and **not** the right-side tool panel (Benjamin: breaks the Excel mental model).
2. **Above-table compound filters handle what a single column can't.** Cross-column predicates — "late items assigned to me" (due-date AND assignee), "due this week" — live in an above-table quick-filter bar (FlowUI pill chips), built on AG Grid's native external filter and composing *on top of* the per-column layer. Every active filter (column or chip) surfaces as a removable pill with a single **Clear all** (Steve Raeder).

Prototyped in the showcase (`prototypes/`): **P1** demonstrates the per-column base layer alone; **P3a/P3b** demonstrate base + compound composing. Restyle lives in `_kit/filters/filterStyles.css`; the compound layer in `_kit/filters/QuickFilterBar.tsx` (`useQuickFilters`) + `FilterStatusBar.tsx`.

Still validating: the chip set per surface, whether any per-column filter graduates to an always-visible control, and finishing the set-filter popup chrome restyle.

## The prior open question (context)
Placement — above-table, per-column, or a combination — was deliberately left open at kickoff (out-of-the-box AG Grid filtering is the single most-cited usability pain). The direction above is how we're resolving it: **per-column base + compound-above**, not one or the other.

## Why (evidence)
- **Benjamin** (Design Bar – JEM, Jun 18) — the move away from in-table AG Grid filters came from a **mismatch with accountants' mental models**; preference is filters **above** the table.
- **Jenny Chan** (Jul 1) — customers (and Sales, and Mike) find out-of-the-box filtering hard to use; stacked horizontal filters force users to scroll to find the right column filter.
- **greg.jones via Jenny** (Jun 25) — "the filter situation is too layered — entity/period selector + quick filters + table filters is a lot."
- **SCs** (Jul 1) — all prefer the **consolidated filter panel** over the prior visual; "a good direction."

(Full quotes: `../research/slack-feedback.md`, `../research/design-bar-feedback.md`.)

## Starting hypotheses (to validate — not decided)
1. **Placement is open.** Evidence leans toward above-table as the primary surface, but **per-column header filters are still in scope** — this work determines the mix. In-table filtering is not ruled out.
2. **Fewer layers likely help.** Stacking entity/period + quick filters + column filters as three competing systems is a known pain; consolidating is a strong hypothesis to test.
3. **One learnable pattern.** Global drawer dropdowns and column-level set filters use the **same** search-header + Select-All + checkbox-list model, so users learn it once.
4. **Always show state + a way out.** Surface what's active (chips/icons) and a "Reset filters" affordance whenever any filter/sort is applied.
5. **Typeahead on long lists** (Assigned To, Folders, Tags, Accounts); "Select All".

## Composition by profile
- **P1 · Filterable** — the core filtering surface: above-table quick filters + set/text filters + column show/hide. Saved views attach here (`saved-views.md`).
- **P3a · Workflow** — global filter drawer + quick-filter chips (Open Review Notes, Daily Recs, Due This Week…) + column-level Set/Multi filter and sort on every filterable column (the 73% slice). Filters apply across folders by default.
- **P3b · Analytical** — Set/Multi filter on grouped/comparison columns; filters as part of saved report presets; number-range filters for materiality (e.g. Difference > $X).

## Open questions
- What is the *standard* filter stack — how many surfaces, in what order? (the "too layered" fix needs a concrete target)
- Consolidated filter panel vs. inline quick-filter chips as the default — SCs prefer the panel; confirm the pattern.
- Column-level filter *icons* + active-state visibility (Pass 1.5 polish: explicit filter pills above the table?).

## Designer checklist
- [ ] Is primary filtering above the table?
- [ ] Have you collapsed redundant filter layers into as few surfaces as possible?
- [ ] Do global + column filters share one interaction model?
- [ ] Is active filter/sort state visible, with a reset?
- [ ] Do long dropdowns have typeahead + Select-All?
