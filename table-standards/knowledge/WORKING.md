# Working in this space

How to collaborate in the AG Grid Standardization workspace. Read `README.md` first for the model; this is the day-to-day.

## Orientation — the doc map
- **`README.md`** — the model (one engine, tiered profiles P0–P3b) + phase plan.
- **`goals.md`** — why / objectives / anti-scope.
- **`rubric.md`** — the decision framework: which table, and the design laws that apply to all of them.
- **`DECISIONS.md`** — the running decision log (`D-###`) + parked open decisions.
- **`tiers/`** — one **home base per solution** (`P0-simple` … `P3b-analytical`) + `surface-census.md` (every FloQast table → profile).
- **`cross-cutting/`** — patterns that span solutions (`filtering`, `saved-views`, `settings-governance`, `horizontal-space`, `numeric`).
- **`research/`** — the evidence base (Slack, Design Bar, repo divergence, reporting survey). Cite it.
- **`../prototype/`** — the running showcase app (see architecture below).
- **`links.md`** — NotebookLM, Figma, Confluence PRDs, coordination map.

## How to contribute to a solution
Each solution (P0–P3b) has a home base in `tiers/`. To pick one up:
1. Read its doc + the cross-cutting patterns it links to + the relevant `research/`.
2. Add yourself as **Driver** (or a contributor) at the top.
3. Do the work — Figma, a prototype (below), notes.
4. **Log it in the Ideation log** — dated + initialed entry: what you explored, what you decided, what's still open. This is how async collaborators stay in sync.
5. Cross-cutting changes (e.g. a filtering decision) go in `cross-cutting/`, not buried in one solution — so every solution inherits it.
6. Real decisions → `DECISIONS.md`.

## Prototype architecture — consistency by construction

The goal: **common interaction patterns are shared, not re-authored per ideation.** Filtering, saved views, container chrome, cell renderers, and theme should be the *same* everywhere — so improving the filter pattern once propagates to every solution, and ideations stay comparable because they sit on the same substrate. (This is the anti-divergence lesson applied to our own prototypes — we've watched the theme fork ~14×; the kit prevents that recurring.)

Three layers:

**1. The shared table kit** — `prototype/src/_kit/` ✅ built
One import surface (`@kit`) exporting the common building blocks: `theme` (base) + `compactTheme` (default) + `comfortableTheme`, a **column factory** (`colDefs.ts` — encodes the Design Bar conventions: single-line headers, right-aligned amounts/dates, left-aligned account numbers), the **cell renderers** (`renderers/` — currency, difference, missing, badge, status dot+text, avatar-stack, person, two-line, date, actions, sign-off master/detail, variance $/%, materiality %, AI explanation), the **filtering layer** (`filters/` — restyled per-column native filters via `filterStyles.css` + `QuickFilterBar`/`useQuickFilters` for above-table compound filters + `FilterStatusBar` with clear-all), the **chrome** (`chrome/` — `TableToolbar` with density toggle + `SavedViewsMenu`), the **saved-views** mechanism (`savedViews.ts`), and `GridShell` (the one way to mount a grid with the shared theme + defaultColDef).
_Seeded from committed sources: `recs-ag-grid` renderers + `ai-variance` (variance/explanation/sign-off) + `fq-folders` token-sourced theme + `admin-agent` `.withParams()` density extension + the accruals pattern library. (Note: `reporting-bu-q3`'s `agGridConfig` existed only as patch text, not runnable source, so the pattern was reconstructed.)_

**2. The showcase** — `prototype/src/showcase/` + `prototype/src/profiles/` ✅ built
A single running app (`App.tsx`) with a left-nav route **per profile** (P0, P1, P2, P3a, P3b), each mounting a representative table built from the kit, plus a spec side-panel explaining which patterns are on and why. Deep-link a profile via the URL hash (`#p0` … `#p3b`). This is what you demo to align the team — the "run one instance, see all the P0–P3b variations" surface. Each profile lives in its own folder (`profiles/P0-simple/` …) and is edited in isolation; the showcase is what compiles them together.

**3. Individual ideations** — `prototype/src/profiles/<area>-<yyyy-mm-dd>/`
Focused explorations of a specific surface or idea (e.g. `recs-advanced-view-2026-07-15`) that **import the same kit** (`@kit`). Vary only the ideation-specific parts; inherit filtering/saving/chrome/theme for free. Because they share the substrate, two people ideating on different surfaces produce comparable, consistent work — and any pattern proven in an ideation can be promoted back into the kit.

**Flow:** prove a pattern in an ideation → promote it into `_kit/` → it appears in the showcase and every other ideation. Divergence becomes the exception, not the default.

### Adding a profile variant or ideation
- **New profile representative table:** edit that profile's folder under `prototype/src/profiles/`. Import building blocks from `@kit`; don't re-author theme/renderers/filters — extend the kit if something's missing. Update the `meta.patterns` so the spec panel stays accurate.
- **New standalone ideation:** create `prototype/src/profiles/<area>-<date>/` (or a sibling app) that imports `@kit`, and add it to `profiles/index.ts` if it should appear in the showcase nav.
- **Promote a pattern to the kit:** move the component into `_kit/` (renderer → `renderers/`, filter → `filters/`, chrome → `chrome/`), export it from `_kit/index.ts`, and swap the profiles to consume it.

## Running the showcase
- **First-time setup:** `npm --prefix projects/table-standards/prototype install` (requires FloQast npm registry access via your `~/.npmrc` — set up through the onboarding / figma-prototype-setup skill). `node_modules` is gitignored.
- **Preview from the repo root** — do NOT `cd` into the folder (that breaks the preview sandbox):
  `npm --prefix projects/table-standards/prototype run dev` (serves on **:5190**).
  There's also a launch.json entry, **"Table Standards Showcase"**, for the preview panel.
- **Stack:** React 18 + modular `@ag-grid-*@32` Enterprise + FlowUI 3.120.5. (Matched the resolved package set of other repo prototypes rather than unified AG Grid v34 — same Enterprise capabilities: set filters, master/detail, row grouping, aggregation.)
- Typecheck: `npm --prefix projects/table-standards/prototype run typecheck`.
- **AG Grid Enterprise**: used freely — the unlicensed **watermark is fine** for prototypes (no key needed); it logs a trial banner to the console, not a real error.
- Share via the **deploy-prototype** skill when ready.

## Figma
- Primary reference: **Tables Audit 2026** (Tyler Davis) — the product-wide census.
- Anti-pattern reference: the older flat **Checks – Recs in AG Grid** file.
- Link your ideation's Figma frame in the relevant solution doc's Links section.

## Conventions
- Ideation log entries: `**YYYY-MM-DD (initials)** — what/why/open`.
- Everything stays in `playspace/` (gitignored) until the effort graduates to a tracked project.
- Keep the shared kit the source of truth for common patterns — resist re-authoring filtering/saving/theme in an ideation; extend the kit instead.
