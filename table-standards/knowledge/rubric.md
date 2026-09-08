# The FloQast Table Rubric

**Status:** Draft v1 (Phase 0) · **Updated:** 2026-07-08
**Audience:** directors aligning on strategy + designers/PMs picking a table for a surface.
**Purpose:** one consistent answer to "which table, and how should it behave" across every FloQast surface.

---

## The position (what we're aligning on)

**FloQast standardizes on one table engine — AG Grid Enterprise — delivered as one shared container with tiered profiles (P0–P3b).** You don't choose a *library* per surface; you default to the FloQast table and pick a *profile* for the job. **FlowUI Table remains a valid alternate for the simplest read-only cases (P0)** — an off-ramp, not a competing standard. Complexity graduates to AG Grid; that's the gravity.

This replaces the old, unanswered "FlowUI vs. AG Grid" debate with a single default + a profile picker.

### What this settles
- **We are NOT replacing every table overnight.** FlowUI Table stays valid for simple surfaces; migration is gravity, not a mandate. (Answers Tyler, Kristin.)
- **AG Grid Enterprise is decided.** The solution builds on Enterprise (pivot, master/detail, sidebar, set/multi filter). Prototypes run on the watermark; formal licensing is an eng/business step. (Answers the license question 3 PRDs were stuck on.)
- **The problem was the container, not AG Grid.** Complaints trace to the out-of-the-box baseline. We standardize the wrapper so no one hand-rolls raw config. (Benjamin, May 20.)
- **The current state spans three technologies** — legacy FQUI, FlowUI, and AG Grid. Convergence onto one engine (retiring FQUI, deciding where FlowUI stays) is the point.

---

## The profile picker

Pick the **lowest** profile that covers the job. Each profile is the one below it plus one capability class.

| If the user's job is… | Profile | Turns on |
|---|---|---|
| Look something up and move on (bounded, read) | **P0 · Simple** _(or FlowUI Table)_ | display + light sort |
| Find a subset in a larger read-only dataset | **P1 · Filterable** | + filter, column mgmt, volume |
| Do work in the table — edit, adjust, group | **P2 · Manipulation** | + inline edit, grouping, aggregation |
| Manage accounting work — status, sign-off, hierarchy | **P3a · Workflow-complex** | + status, sign-off, master/detail |
| Analyze financials — variance, statements, reports | **P3b · Analytical-complex** | + pivot, comparison, presets |

**P3a and P3b are peers**, not a linear climb — workflow-complex and analytical-complex are two *kinds* of "most complex," both built on P0–P2, both governed by the same design laws below.

### When FlowUI Table (alt-P0) is the right call
- Bounded rows, stable columns, no filtering workflow, no editing, no bulk actions.
- The surface genuinely never needs the data layer (sort/filter/column mgmt/saved views).
- **Compliance is the test bed** — much of it may correctly *stay* FlowUI. If a surface later needs data-layer power, it graduates to AG Grid P0/P1.

_Open: the exact floor — below what row/column count is AG Grid P0 overkill vs. FlowUI Table? (see `tiers/P0-simple.md`.)_

---

## The design laws (apply to every table, every profile)

1. **Quiet until you need it.** The data layer is powerful but invisible until invoked. A simple table must *look* simple — never like out-of-the-box AG Grid.
2. **Filtering is a lead open question (not pre-decided).** Placement — above-table, per-column header, or both — and how many layers is what this work will determine. Early evidence leans above-table with fewer layers, but per-column filtering is explicitly still on the table. (see `cross-cutting/filtering.md`)
3. **Prefer vertical; prioritize key data before any horizontal scroll.** Fit vertically where you can; when width is unavoidable, key data appears before the scroll (column order + pinning). (see `cross-cutting/horizontal-space.md`)
4. **Containerization over more filters.** Customers overuse filters because tables are too wide; the fix is master/detail, expandable groups, and focused containers.
5. **Consistent numerics.** Right-align, decimal consistency, colored signed deltas. (see `cross-cutting/numeric.md`)
6. **One theme, one config.** No per-prototype re-authoring; consume the shared package. (Phase 2)

---

## The gaps we're actually solving (not "AG Grid fixes everything")

Per Martin's challenge to name the gaps, not assume the tool: (a) column-level **header sort/filter** — the 73% / $12.7M ARR slice; (b) **better filtering** that matches accountant workflows (placement TBD by this work); (c) **saved/persistent views**; (d) **tiered/admin settings** + column visibility; (e) **cross-surface consistency**. AG Grid Enterprise is the substrate for (a)–(d) — none are free out of the box; the container is what delivers them.

## What's out of scope
- **Not a BI tool.** Reporting is variance explanation, not Anaplan/Looker (Whitmire). P3b draws the line on which analytical complexity belongs in a FloQast table.
- **Not a big-bang migration.** Prioritized, ROI-first (parity + header sort/filter lands first).

## How in-flight work relates
This rubric is the standard; feature PRDs are consumers. Recs Table States (IDEA-2641) and the Reporting AG Grid Optionality PRD implement against these profiles + laws rather than each re-deciding. Coordination map in `links.md`.
