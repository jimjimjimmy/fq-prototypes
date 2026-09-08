# Data Studio — Lineage Creation

## Overview
Prototype exploring the Lineage Creation workflow within FloQast's Data Studio product. Lineage Creation is the source-to-target data mapping capability that enables admins to bring in external datasets, define field mappings to FQ's normalized format, and publish for downstream products (Close, Flux, Compliance, Consolidation).

## Goal
Explore and validate two competing AI interaction models for the field mapping workflow:
1. **Directed inline flow** — AI suggests mappings inline, user reviews/confirms per row
2. **Conversational chat** — AI Chat Modal for natural language transformation descriptions

The prototype needs to convey the "feel of the core AI interaction model" (per Greg Jones). Working session planned for week of 2026-03-17.

## Contributors
- @benjamin-ellis (Product Design Manager)
- @natasha-clark (Product Designer)
- @alex-kearns (Product Manager)

## Status
Phase: prototyping
Started: 2026-03-13

## Design System
Status: hybrid
Notes: Flow UI as base design system + Tailwind for layout utilities. Flow UI components for all standard UI elements; Tailwind for rapid layout and spacing adjustments.

## Figma Files
- Lineage Product: https://www.figma.com/design/pF3J27wNhb7TRnCmmJGrB9/Lineage---Product?node-id=1-2
- Design Image Layout (prototype): https://www.figma.com/make/fAX7tFsW9OKwD2dehgFZGd/Design-Image-Layout

## External Links
- Jira Idea: https://floqast.atlassian.net/jira/polaris/projects/IDEA/ideas/view/11291632?selectedIssue=IDEA-2412
- Confluence PRDs:
  - [Definitions & Terms](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409)
  - [Overview & Index](https://floqast.atlassian.net/wiki/spaces/Data/pages/4444455089)
  - [1 of 4: Model Creation & Source Config](https://floqast.atlassian.net/wiki/spaces/Data/pages/4450189505)
  - [2 of 4: Field Mapping](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449927443)
  - [3 of 4: Testing & Publishing](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449468593)
  - [4 of 4: Versioning & Lifecycle](https://floqast.atlassian.net/wiki/spaces/Data/pages/4443013309)
- Loom walkthroughs:
  - https://www.loom.com/share/82aae4d2abc84e649c33f99e0e5a9736
  - https://www.loom.com/share/cc8e53b97ae04a20bfa79b3a0f63abc9

## Key Knowledge
- `knowledge/definitions.md` — Shared glossary of all Data Studio terms
- `knowledge/overview.md` — PRD suite overview, key benefits, blockers
- `knowledge/prd-1-model-creation.md` — Model creation, source datasets, grouped datasets
- `knowledge/prd-2-field-mapping.md` — AI-assisted field mapping, many-to-one, transformations
- `knowledge/prd-3-testing-publishing.md` — Test preview, publish mechanics, effective dates
- `knowledge/prd-4-versioning-lifecycle.md` — Versioning, drafts, archiving, pipeline logs

## User Research Library

Session transcripts and metadata from user research on Data Studio prototypes, committed to the repo for team access.

- **Path:** `research/` — sessions, analysis
- **NotebookLM:** "Data Studio User Research Sessions" — ID: `503f457f-015c-4004-bbad-93d0ef8090fe`
- **How to add a session:** See `research/README.md` for step-by-step instructions

Studies underway:
- Connector Setup — API Connection Flow (ATC sessions, 2026-05)

## PRD Sync System

A Confluence-to-NotebookLM sync system that tracks Data Studio PRD pages in a single NotebookLM notebook ("Data Studio PRDs"). The notebook serves as a shared, AI-queryable reference layer for the team during design and requirements review.

### Skills

- **`/check-ds-prds`** — Check Confluence for PRD changes. Detects tracked page changes and new untracked pages, sends Slack DM (if configured), suggests next actions.
- **`/sync-ds-prds`** — Sync changed pages to NotebookLM. Fetches tracked pages, compares against local snapshots, updates NotebookLM sources.
- **`/add-ds-prd`** — Add new Confluence pages to the tracked set and NotebookLM notebook.
- **`/review-against-ds-prds`** — Review a design against PRD requirements. Accepts Figma URLs, screenshots, prototype source code, or feature descriptions.

### Setup

**Slack notifications (optional):** Copy `confluence-sync/user-config.template.json` to `confluence-sync/user-config.local.json` and replace with your Slack user ID. This file is gitignored. If not configured, skills skip the Slack DM and report in the conversation only.

### Constraints

- Confluence access goes through the **TWG CLI** (`twg confluence ...`), not the Atlassian MCP. You must be authenticated to TWG for FloQast — run `twg login` and `twg whoami --site floqast` if you've never set it up. The skills check this at startup and bail with a clear error if TWG isn't ready.
- Slack and NotebookLM still go through their cloud MCP connectors from your claude.ai account. If those are missing from a CLI session, restarting Claude Code typically restores them.
- All four skills (`/check-ds-prds`, `/sync-ds-prds`, `/add-ds-prd`, `/review-against-ds-prds`) work in both the CLI and the desktop app now that Confluence access no longer depends on the Atlassian MCP.

### Files

- `confluence-sync/config.json` — Notebook IDs, Confluence site prefix (`"floqast"`), tracked page assignments
- `confluence-sync/snapshots/` — Local markdown copies of all tracked pages (used for change detection)
- `confluence-sync/changelog.md` — Running log of sync operations

## For Claude
When working on this project:
- Read knowledge/ files for research context before making suggestions
- Track Figma file links — update this section when new files are added
- Since design-system is `hybrid`: use the `flow-ui-design-system` skill for all frontend work. Pull component props from the `flow-ui-mcp` (`get-component-info`, `search-components`) and design guidance from the zeroHeight MCP (`get-page`, `list-pages` with styleguide ID `99570`) before implementing any UI.
- Two AI interaction approaches are under exploration — prototype should support toggling between them
- Prefer floating panels over modals for the AI interaction pattern
- L1 horizontal tabs: **Catalog** (models table) · **Dimensions** · **Connectors** · **Logs**. Routes: `/data-studio/catalog`, `/data-studio/dimensions`, `/data-studio/connectors`, `/data-studio/logs`. (Historical: previously labeled "Connections" and "Entity Mappings" — those names are deprecated.)
- The workflow is sequential: Catalog → Create Model → Source Datasets → Field Mapping → Publish (testing is inline in Field Mappings)
- Model View has vertical left nav with 6 tabs (canonical, per designer decision 2026-07-02): Overview, Source Datasets, Field Mapping, Data Preview, Versions, Logs. (The "For Dev" Figma diverges — it shows a 7th "Entity Mappings" tab and plural "Field Mappings"; that is intentionally NOT reflected here, as Entity Mappings has open IA questions. Source of truth: `features/model-view/sections.ts`.)
- Use mock data in src/data/ rather than real API calls
- **Tailwind + Flow UI CSS setup**: Tailwind v4 is imported WITHOUT a layer (`@import "tailwindcss/theme"` + `@import "tailwindcss/utilities"`) because Flow UI's `Theme.apply()` injects unlayered global styles. Do NOT change the import to `@import "tailwindcss" layer(...)` — it will silently break all Tailwind utilities. See `knowledge/design-system/flowui-reference.md` for details.
- **Typography (two fonts)**: **Inter** = body / data / form text (loaded via Google Fonts in `index.html`; FlowUI doesn't bundle it). **Museo Sans** = headings *and* FloQast chrome titles/tabs — page headers, section titles, the "Admin Settings" label + product tabs — per Figma (Museo IS loaded in this environment). FlowUI's `Theme.apply()` hijacks all text to **Open Sans**, which is *not actually loaded* (it renders a system-sans fallback), so `main.tsx` injects an override: `html, body, #root` → Inter `!important`, `h1–h6` → Museo `!important`. Non-heading chrome that must be Museo (AdminSettingsNav title + tab buttons, which don't inherit) sets `fontFamily` inline. Caveat: this `!important` approach **diverges** from the canonical recipe in `knowledge/design-system/prototype-setup.md` (source-order override + inline Museo, no `!important`) — reconcile the two if typography friction recurs.

## Scaffold is law

The Data Studio v2 prototype (under `prototype/`) has a **locked
architectural scaffold** that must not be modified during feature work.
The scaffold is the visual and structural foundation every feature builds
on — change it and every feature inherits the change.

### What's locked

| Path | What |
|---|---|
| `prototype/src/scaffold/global/` | 56px FQ rail + Admin Settings header (portable — could move to `projects/_shared/scaffold/` later) |
| `prototype/src/scaffold/data-studio/` | L1 tabs, page header, L2 sidebar, frame compositions, fullscreen mode |
| `prototype/src/scaffold/grid/` | AG Grid theme + module registration baseline |
| `prototype/src/routes/registry.ts` | Routing seam — features add their routes here |
| `prototype/src/main.tsx` | App boot (FlowUI Theme.apply, Inter font shim, AG Grid module registration) |

### The rule

**Any PR that touches files under `prototype/src/scaffold/`,
`prototype/src/routes/registry.ts`, or `prototype/src/main.tsx` requires
designer review from Natasha Clark or Kristin Johnson before merging into
`project/data-studio`.**

This is convention-enforced, not hook-enforced. Trust the rule and name
it explicitly in PR descriptions ("touches scaffold? YES → designer
review required" / "touches scaffold? NO") so reviewers know when to
escalate.

**Who actually needs to review.** The gate exists to guarantee a *designer*
evaluates any scaffold change — its real purpose is catching non-designers
(engineers, PMs) altering the scaffold without design context. So:

- A scaffold change **authored by a designer (Natasha or Kristin) satisfies
  the gate on its own.** The author can self-approve an incidental scaffold
  tweak; a second designer's review is courtesy, not a requirement.
- A scaffold change authored by **anyone else** must get Natasha's or
  Kristin's review before merge.
- The "other designer as reviewer" step in *How to legitimately change the
  scaffold* below applies only to the **deliberate scaffold-redesign flow**
  (update the canonical Figma frame → figma-fq → apply the diff) — not to
  small incidental changes like a token or background tweak.

### Why locked

The scaffold is visually verified against canonical Figma frames in the
[Data Studio Scaffold Figma file](https://www.figma.com/design/JuKJL3qnOlL88CFBje5cBr/Data-Studio-Scaffold--Claude-).
If the scaffold drifts from Figma, every feature inherits the drift.
Locking it means features can be built confidently inside a known-good
frame, and any change to the foundation gets reviewed by someone with
the design context to evaluate the trade-off.

### Where feature work goes

Features live under `prototype/src/features/{feature-name}/`. Each
feature is self-contained and never imports from another feature.
Features may import from `prototype/src/scaffold/` (read-only) and from
`prototype/src/data/` (mock data).

To add a feature route:

1. Create `prototype/src/features/{feature}/routes.tsx`
2. Export a route fragment (see existing features for the shape)
3. Import + register in `prototype/src/routes/registry.ts`

Adding a route registration is a one-line change to `registry.ts` — that
file IS scaffold and requires designer review, but the diff is trivial
and review is fast.

### How to legitimately change the scaffold

The right flow for a scaffold change:

1. Designer (Natasha or Kristin) opens branch `data-studio/scaffold-{change}`
2. Update the canonical Figma frame first
3. Run `figma-fq` against the updated frame to produce a diff plan
4. Apply the diff to files in `prototype/src/scaffold/`
5. PR to `project/data-studio` with the other designer as reviewer
6. After merge, announce in the team channel so feature branches pull
   and pause for any breakage

### Pointer files

For the canonical structural overview, see
[`prototype/src/scaffold/README.md`](prototype/src/scaffold/README.md).
For AG Grid feature conventions (canonical accruals example + 22-pattern
citation rule), see
[`prototype/src/scaffold/grid/README.md`](prototype/src/scaffold/grid/README.md).
