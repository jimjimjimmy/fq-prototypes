> **Status:** Phase 0 — kicking off (research & framing) · **Driver:** Benjamin Ellis · **Updated:** 2026-07-08
> This page is the **start** of a design standardization initiative to bring consistent interaction patterns to tables across FloQast — the inconsistencies we're solving, the patterns we're aligning on, and the questions we're working through. It is **not** a finished standard; decisions land here as the work progresses this quarter.

## The design problem

FloQast tables are everywhere — Recs, Checklist, Reporting, Variance, Data Studio, Admin, Compliance — but they've been designed surface by surface, with no shared interaction standards. Walk across the product and you encounter a different table experience on every page:

- **Filtering works differently on every surface.** Some tables have filter panels above the table. Others use in-column header controls. Others stack both on top of an entity/period selector. Customers learn each table separately — and frequently can't figure out how to reset.
- **Saved views and column management are inconsistent or missing.** Users configure a table for their workflow, then lose that state on navigation. Where persistence exists, it works differently per surface.
- **The visual theme has forked ~14 ways.** Row height, header style, density, zebra striping, even brand colors — each surface slightly different, built independently. Any token change touches 14 files.
- **Status chrome and workflow patterns aren't recognizable across surfaces.** Sign-off states, review flags, open/closed indicators — designed per feature, not as platform-level conventions.
- **No consistent answer for when or how to use a table.** Teams re-debate "FlowUI vs. AG Grid" per feature, with no rubric — and the answer changes every time.

The result: every feature team re-designs from scratch, engineering re-implements patterns per surface, and users face a fragmented experience that doesn't feel like a platform.

## What we're standardizing

This initiative defines — then designs and prototypes — the interaction patterns that should be consistent across every FloQast table, regardless of which surface:

| Pattern | The design question |
|---|---|
| **Visual theme & density** | What does a FloQast table look like — row height, header style, zebra striping, compact mode? |
| **Filtering** | Where do filters live — above the table, per-column header, or both? How many layers? What controls? How does the user know what's active and how to reset? |
| **Saved & persistent views** | How do users save and recall table state? Where do presets live? Who controls defaults — user, admin, or org? |
| **Column management** | Show/hide, reorder, pin — when is it available, what's the interaction, where does it live? |
| **Status & workflow chrome** | How do status badges, sign-off states, review flags, and progress indicators render consistently across surfaces? |
| **Numeric conventions** | Alignment, decimal consistency, signed delta colors, zero vs. null display. |
| **Settings governance** | Who controls what — individual user preference, admin default, or org-wide standard? |
| **Horizontal space** | When a table is inherently wide, how does it stay usable — column pinning, master/detail, folding groups, drill-in drawers? |

These patterns are the actual design work. Defining them once means improvements propagate across the product instead of getting re-designed on each surface.

## The profile model — context for how patterns apply

Not every table needs every pattern, and patterns behave differently at different complexity levels. We're mapping the above to four profiles, each building on the one below:

```
                              ┌── P3a · Workflow-complex  → Recs / Checklist / Folders
P0 → P1 → P2 ─────────────────┤
(each = prev + one            └── P3b · Analytical-complex → Reporting / Variance
 capability class)
```

| Profile | User's job | Patterns in play |
|---|---|---|
| **P0 · Simple** | Look something up | Theme · basic sort |
| **P1 · Filterable** | Find a subset in a larger dataset | + filtering · column mgmt · saved views |
| **P2 · Manipulation** | Do work in the table — edit, adjust, group | + inline edit · grouping · aggregation |
| **P3a · Workflow-complex** | Manage accounting work — status, sign-off, hierarchy | + status chrome · master/detail · sign-off |
| **P3b · Analytical-complex** | Analyze financials — variance, reports | + pivot · comparison columns · report presets |

P3a and P3b are peers — two kinds of "most complex," both built on P0–P2, both governed by the same interaction principles. The profiles describe when patterns turn on; the pattern designs define how they should look and behave.

**FlowUI Table** stays a valid option for the simplest read-only surfaces (P0) where no data-layer power is needed. Anything that benefits from filtering, sorting, or persistence graduates to AG Grid.

## What we believe vs. what we'll determine

**Going in firm:**
- Interaction patterns defined once, applied consistently — no more per-surface re-design.
- Simple tables must look and feel simple — never like out-of-the-box AG Grid with full chrome visible.
- Key data prioritized before any horizontal scroll (deliberate column ordering + pinning).
- Build on AG Grid Enterprise (prototypes run watermarked; production licensing is an engineering step).

**Open questions this work will resolve:**
- **Filtering** — above-table, per-column, or both? What placement and how many layers actually fit accountants' workflows? (This is a primary design decision, not a pre-determined answer.)
- **Saved views & settings governance** — what's the right model for user / admin / org control?
- **The P0 floor** — where is FlowUI Table the right call vs. graduating to AG Grid P0?
- **Analytical scope** — how much reporting complexity belongs in a FloQast table vs. a dedicated BI tool?
- **Pattern completeness** — for each cross-cutting pattern, do we ship a full reference design or a spec + annotated examples?

## The surface landscape

We're designing for the whole product — ~40 surfaces, mapped to profiles:
- **P0/P1 (system-of-record)** — most Admin Settings, Compliance lists, Projects, entity/account lookups. The majority of tables by count; the simple-tier patterns carry real weight here.
- **P2** — AI Matching, Amortization/Depreciation, Adjustment Entries, FDM mapping.
- **P3a (workflow)** — Recs, Checklist, Folders, JEM Homepage. The loudest pain around sign-off, filtering, and parity.
- **P3b (analytical)** — Balance Sheet, Income Statement, Variance / AI Variance, Reporting. The source of most horizontal-scroll and "too many filters" pain.

## How we'll work

- **Phase 0 — Research & framing (now):** the problems, the evidence base, the working framework.
- **Phase 1 — Pattern design & ideation (this quarter):** design and prototype each interaction pattern across profiles; sequence by ROI (Recs/Checklist parity + header sort/filter first).
- **Phase 2 — Engineering hardening (after this quarter):** engineering builds the production implementation and standardizes the patterns across all features.

**Ownership:** design + PM own research, pattern design, and prototypes this quarter. Engineering owns the production build. Prototypes share a common kit so patterns stay consistent and proven patterns graduate into the standard.

## Resources & how to get involved

- **Explore the research** — [AG Grid Standardization NotebookLM](https://notebooklm.google.com/notebook/28a5e655-a96f-4c03-95df-70dabfc8afc8): ask anything about the strategy and get sourced answers.
- **The product-wide table census** — [Tables Audit 2026 (Figma, Tyler Davis)](https://www.figma.com/board/sN41bXHuEpEIEx70GiOoy0/Tables-Audit).
- **Reference — direction we're moving away from** — [Checks – Recs in AG Grid (flat, filter-heavy exploration)](https://www.figma.com/design/aoTXrOSj1wLJDcM7Er6yAA/Checks---Recs-in-AG-Grid).
- **Work already in flight (consumers):** [Recs Table States — IDEA-2641](https://floqast.atlassian.net/wiki/spaces/~295675599/pages/4632215793) · [Reporting AG Grid Optionality — IDEA-2369](https://floqast.atlassian.net/wiki/spaces/R2R/pages/4430209556).
- **Related design journeys:** [Reporting Design Journey](https://floqast.atlassian.net/wiki/spaces/DES/pages/2606202979) · [Compliance – Design Journey](https://floqast.atlassian.net/wiki/spaces/DES/pages/2697101465).
- **Get involved:** comment here with a pattern or surface use-case we should account for, or reach out to **Benjamin Ellis** to help ideate on a profile. This page updates as findings land.
