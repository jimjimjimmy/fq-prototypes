# Data Studio

The working space for FloQast's Data Platform product and design team. This project holds prototypes, user research, PRDs, and design knowledge for **Data Studio** — FloQast's admin interface for connecting external data sources, defining data models, and publishing normalized data across the product suite (Close, Flux, Compliance, Consolidation).

## Team

| Name | Role |
|------|------|
| Benjamin Ellis | Product Design Manager |
| Natasha Clark | Senior Product Designer |
| Kristin Johnson | Senior Product Designer |
| Prathyusha Moduga | Senior Product Designer |
| Alex Kearns | Senior Product Manager |
| Rebecca Beasley-Cockroft | Director of Product Management - Data Platform |

## What's in here

| Path | What |
|------|------|
| `prototype/` | Active v2 prototype — React + Vite + FlowUI + AG Grid |
| `prototype/netlify/` | Standalone prototypes deployed to Netlify (see below) |
| `legacy-prototype-work/` | Archived v1 prototype — preserved for reference |
| `research/` | User research sessions, study artifacts, and transcripts |
| `knowledge/` | PRD summaries, definitions glossary, personas, connector research |
| `user-flows/` | User flow diagrams |
| `audit/` | Design audit artifacts |
| `confluence-sync/` | PRD sync tooling (Confluence → NotebookLM) |

## Live prototypes

Three standalone prototypes are deployed and shareable:

| Prototype | URL |
|-----------|-----|
| API Setup Wizard | https://fq-api-setup-052026.netlify.app/ |
| API Setup Wizard — AI, Version 1 | https://fq-connector-wizard.netlify.app/ |
| API Setup Wizard — AI, Version 2 (Hover Context) | https://fq-connector-wizard-hover.netlify.app/ |

Source for each lives under `prototype/netlify/`.

## Running the local prototype (v2)

```bash
cd projects/data-studio/prototype
npm install        # first time only
npm run dev
```

Opens on http://localhost:5173.

## Key resources

**Design**
- [Figma: Data Studio Dev Ready Designs](https://www.figma.com/design/2lWgrzEE6mc6yW3fM1MrUI/Data-Studio---For-Dev?node-id=0-1&t=A0mBbAiqS5Vlg0cb-1)
- [Confluence: Data Platform Designs & Mock-ups List](https://floqast.atlassian.net/wiki/spaces/Data/pages/4537155591/Data+Platform+Designs+Mock-ups)

**Product**
- [Confluence: Data Platform 2.0](https://floqast.atlassian.net/wiki/spaces/Data/pages/4199940097/Data+Platform+2.0)
- [Confluence: PRD Overview & Index](https://floqast.atlassian.net/wiki/spaces/Data/pages/4444455089)
- [Definitions & Terms](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409)

**PRDs**
- [NotebookLM: Data Studio PRDs](https://notebooklm.google.com/notebook/ae917453-c037-4d8b-adb5-cb59deaf5242)

  > This notebook contains `.md` file copies of Data Studio PRDs and other key documentation from the Data space in Confluence, making them queryable via NotebookLM's AI and MCP. It is updated frequently via the `/check-ds-prds`, `/add-ds-prd`, and `/sync-ds-prds` skills in Claude Code.
  >
  > Use the `/review-against-ds-prds` skill to audit a design, prototype, or feature description against the full PRD suite and surface requirement gaps or conflicts before handoff.

## Contributing

Work branches off `project/data-studio` — the long-lived integration branch for this project. Feature branches eventually merge to `project/data-studio` via PR, which then syncs to `main` periodically.

**Branch naming:** `data-studio/{short-description}` (e.g. `data-studio/catalog-filters`)

**Adding a feature to the local prototype:**
1. Create a folder under `prototype/src/features/{feature-name}/`
2. Add a `routes.tsx` exporting your route fragment and a `README.md` with owner + Figma link
3. Register your route in `prototype/src/routes/registry.ts` (one import + one line)
4. Open a PR to `project/data-studio`

**Scaffold is law.** The files under `prototype/src/scaffold/`, `prototype/src/routes/registry.ts`, and `prototype/src/main.tsx` are locked architectural primitives. Any PR touching those files requires designer review from Natasha Clark or Kristin Johnson before merging. Flag it explicitly in your PR description.

**Accounts:** All commits must use your FloQast GitHub account. The repo enforces this via git hooks.

For full working conventions, branch rules, and Claude Code setup, see [`CLAUDE.md`](CLAUDE.md).
