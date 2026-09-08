# Cross-cutting — Horizontal Space

**Status:** Draft v1 · **Updated:** 2026-07-08 · Applies to: all profiles (P1+ especially)

## The stance
**Prefer solutions that fit vertically and avoid horizontal scroll — but this is a preference, not a hard rule.** Some AG Grid tables (especially P3b analytical comparisons) will legitimately exceed page width, and that's acceptable.

## What we harden (the actual rule)
**Key/priority data appears *before* any horizontal scroll.** When a table must exceed the viewport, deliberate column ordering + pinned anchors ensure the scroll only ever reveals *secondary* data. A user should never have to scroll right to see the information that defines the row.

- Lead with the identity/anchor column(s), pinned left (account name/number, entity, item).
- Order columns by priority — the data a preparer/reviewer needs at a glance sits left of the fold.
- Pin actions right where relevant.
- Secondary/optional columns (YoY, extra metadata) live past the scroll or default-hidden.

## Why (evidence)
- **Scott Bair** (Jan 22) — accountants use **mice, not trackpads**; horizontal scroll is unnatural.
- **Carlos Avila** (Feb 11) — a giant grid isn't a silver bullet: "all it's doing is flattening the data... trading it off for a horizontal scroll."
- **Rams / Mike Whitmire + Will Emmons** (Apr 29 / May 8) — dense reporting forced "dual horizontal scrolls"; worsened by the left nav staying open.
- **Joe Ryan** (Feb 24) / **Benjamin** (Feb 26) — undo flat architecture; build **containerizations** with context.

(Full quotes: `../research/design-bar-feedback.md`.)

## Mechanisms by branch
**P3a Workflow-complex — contain width:**
- **Master/detail** — rec → reconciling items → transactions in an expandable detail, not more columns.
- **Group-to-Count** — collapse account groups to a single row + Total; expand inline.
- **Single-entity column collapse** — drop "Entity /" from the leading column when filtered to one entity (recovers space).
- **Expand-row, not popover** — users expect a row to expand vertically ("infinite vertical space"); if a popover is used for usability, add a **badge** so they anticipate it (Recs Multicurrency, May 19).

**P3b Analytical-complex — accept width, but tame it:**
- Comparison data (MoM/YoY) is inherently horizontal → pin the anchor, fold comparisons into **foldable column groups**, offer a **compact density** theme, and drill into detail **in a drawer**.
- **Master/detail sub-tables, not "Swiss cheese"** — don't pivot flat into sparse empty-cell grids; use summary counts + detail tables (Andrew Baranak, Mar 18).

## Anti-patterns
- The older **"Checks – Recs in AG Grid"** exploration — a flat, horizontal table leaning on heavy filtering to build views. This is the direction we're moving *away* from.
- Over-pivoting a flat grid until it's sparse "Swiss cheese."
- Burying key columns behind a horizontal scroll.

## Designer checklist
- [ ] Anchor/identity column pinned left?
- [ ] Columns ordered so priority data sits before the scroll?
- [ ] Is there a vertical/containerized alternative (master/detail, expand-row) before going wide?
- [ ] If wide is unavoidable, are secondary columns foldable/optional/default-hidden?
- [ ] One horizontal scrollbar for the whole table area (no nested/dual scrolls)?
