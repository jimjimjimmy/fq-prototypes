# Links & Reference Index — AG Grid Standardization

## NotebookLM
- **Project notebook (this project):** `28a5e655-a96f-4c03-95df-70dabfc8afc8`
  https://notebooklm.google.com/notebook/28a5e655-a96f-4c03-95df-70dabfc8afc8
  _Sources to add: the Confluence PRDs below, the research/ docs, key Design Bar transcripts._
- **Design Bar (shared research):** `a09c7a5a-755e-4b6a-9cfc-e34d8d32fccd` — 30+ session transcripts, mined for table feedback.

## Figma
- **Tables Audit 2026 (Tyler Davis)** — FigJam board, the product-wide table census. **Primary reference.**
  https://www.figma.com/board/sN41bXHuEpEIEx70GiOoy0/Tables-Audit
  7 sections / ~40 surfaces: Close Tables (Checklist, Recs, JEM Homepage, AI Matching, Amort/Depreciation) · All Workflows (Dashboard/Entities, Folders) · Reporting Tables (Balance Sheet, Income Statement, Reporting Entities, Adjustment Entries, Chart of Accounts, Variance Analysis, AI Variance Analysis, Reporting, Intercompany, FDM ERP Connections/Tables/Dimension Grouping) · Projects (Dashboard, Tasks, Agents) · Transform · Compliance Tables (Programs, Scoping, Risks, Controls, Key Reports, Key Systems, Issues, Evidence Requests, Certifications, Policies) · Admin Settings (Workflows, Entities, Users, Roles, Group, Checklist, API Keys, FDM, Connections).
  Annotations: Minnie tagged AG-Grid surfaces + "JEM missing latest views"; Edith tagged "replaced by JEM/FDM" legacy surfaces + variance use-case notes.
- **Checks - Recs in AG Grid** — older exploration. **ANTI-PATTERN reference** (flat horizontal table, heavy filtering to build views — NOT the complex-content-grouping direction we want).
  https://www.figma.com/design/aoTXrOSj1wLJDcM7Er6yAA/Checks---Recs-in-AG-Grid
- _TBD — high-fidelity tier mockups as we build them._

## Confluence
**This project's page:** ✅ **PUBLISHED** — Design (DES) space, top-level. Page ID **4678844741**.
https://floqast.atlassian.net/wiki/spaces/DES/pages/4678844741/AG+Grid+Table+Standards
Source draft: `confluence-page.md` (update there, then re-publish via `twg confluence page update`). Cross-link to the Reporting/Compliance Design Journeys + consumer PRDs below. _(No design-system-team cross-link — deprecated.)_

### Referenced PRDs (Reporting = R2R space; Recs = personal space)
| Doc | Page ID | Why it matters |
|---|---|---|
| PRD — Close Reconciliations: Table States (Q3 Pass 1), IDEA-2641 | 4632215793 | The recs Pass 1 spec (73% slice). Frames Recs·Checklist·Folders unification. Asks the shared-wrapper question. |
| R2R — AG Grid Optionality — Report Builder & Related Tables | 4430209556 | Reporting's own standardization PRD: ~13 grid toggles, presets, cascading persistence, <200ms perf. |
| R2R — NetSuite Transaction Linking (Report Builder & Variance) | 4476666206 | Deep-link cell renderer standard. |
| IPOD — FDM Saved Views | 4432560453 | Saved-views cross-cutting module input. |
| Variance Skills Management, IDEA-2453 | 4663607354 | AI variance skills (xyflow lane). |

## Jira (ideas / epics)
- **IDEA-2641** — Close Design Revamp: Table States, Filters, Sorting (recs; Phase A Recs, follow-ons Checklist/Folders)
- **IDEA-2369 / REPORTING-14185** — Table Settings epic (11 AG Grid config settings; gridDisplay + gridData config)
- **IDEA-2453** — Variance Skills Management
- Related recs deps: IDEA-2456 (Multi-Currency), IDEA-613 (Risk Rating) — Pass 2 column-add consumers
- REPORTING-13896 (master/detail on pivoted data), REPORTING-13784 (tx drill-down), REPORTING-15548 (E2E: Export/Sort/Group/Agg/Pivot/Filter)

## In-repo prototypes (existing table implementations)
- `playspace/ai-variance/src/components/VarianceGrid.tsx` — deepest React variance grid (Enterprise row grouping)
- `projects/ai-variance-prototype/` — Focus-Mode grids (Community; summary→drill→focus nav)
- `projects/reporting-aiv/` — Edith's Material Variances (vanilla v31; **fakes** Enterprise chrome)
- `projects/reporting-bu-q3-2026-designs/` — **target stack**: unified v33 + real Enterprise + shared `agGridConfig`
- `playspace/close-table-states/proto-table-q3-pass1-v4.html` — Edson's recs Pass 1 prototype (+ SESSION-HANDOFF.md)
- Shared assets to consolidate: `floqastGridTheme` (forked ~14×) · accruals pattern library (`knowledge/design-system/examples/ag-grid/`) · Will's `agGridConfig` module

## Coordination map (who to align with)
- **Recs / Close:** Edson Rodriguez (PM), Romulus (eng), Minnie Newman (parity)
- **Reporting / Variance:** Tyler Davis, Carmen Le, Will Guardado, Edith Espinoza (design); Steve Raeder, Marc Reicher (tiered settings)
- **Engineering (waiting on package):** greg.jones, abhijit.aghao
- **Org alignment / paralysis:** Tyler Davis, Kristin Johnson, Martin Mijares, Natasha Clark

## Codebase (planned resource — not yet cloned)
- **close-monorepo** — https://github.com/FloQastInc/close-monorepo
  The production Close codebase (Checklist, Recs, and related). **Why we need it:** before design iterations on Checklist/Recs tables, parse the real feature source to enumerate *all* current functionality (every column, action, filter, edge case, permission) so ideations don't silently drop capabilities.
  **When:** not needed now; check out locally when we start Checklist/Recs design work.
  **How:** `gh auth switch --user benjaminell_floqast` first, then clone to a local GitHub folder (outside this repo, or a gitignored path). Confirm branch/scope with Benjamin before cloning (large monorepo).

## Slack
- `#team-reporting-report-builder` — Report Builder onboarding canvas (source of truth per Confluence mirror)
- _TBD — dedicated channel for this project (Confluence hub + Slack channel is the tracking decision)._
