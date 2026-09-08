# Catalyst

A React prototype demonstrating a task-centric rearchitecture vision for FloQast's Close product — shifting from folder-based navigation to urgency-driven task management with integrated AI.

## What This Is

Catalyst is an **interactive design prototype**, not production code. It was originally built in [Figma Make](https://www.figma.com/make/) and exported as React + Tailwind CSS to demonstrate how FloQast Close could be rearchitected around tasks instead of folders. The prototype is informed by extensive research covering current-state analysis, customer pain points, competitive positioning, and stakeholder alignment.

The Figma Make export has been fully migrated to a standard Vite + React development environment and is ready to run locally.

## Quick Start

```bash
npm install
npm run dev
# Open http://localhost:5173
```

## Key Features

- **Dashboard** — AI insight cards (rotating carousel), close progress metrics, urgency-grouped priorities, and recent activity feed
- **Task Management** — Four switchable views:
  - **Board** (Kanban) — tasks grouped by status columns
  - **Table** — sortable, filterable task grid with bulk operations
  - **Timeline** (Gantt) — task duration bars with dependency visualization
  - **Calendar** — month grid with tasks on due dates
- **Super Task Drill-Down** — single-page aggregated view of a task: balances, journal entries, review notes, attachments, agent activity, and workflow context
- **Workflow Management** — admin configuration table for 20 workflows across 8 workspaces and 3 regions
- **AI Panel** — slide-in chat assistant ("Ask FloQast") with contextual suggestions
- **Global Search** — modal with tabbed results across tasks, reconciliations, workflows, and people
- **Notifications** — dropdown with timestamped, categorized alerts
- **Collapsible Sidebar** — workspace mode (task-doer nav) and admin mode (configuration nav)

## Personas

| Persona | Role | Primary Screens |
|---------|------|----------------|
| **Sarah Chen** | Staff Accountant (Preparer) | Dashboard, Table view |
| **David Kim** | Senior Accountant (Reviewer) | Board view, Drilldown |
| **Maria Rodriguez** | Accounting Manager (Controller) | Timeline view, Workflows |

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI framework |
| TypeScript | 5.8 | Type safety |
| Tailwind CSS | v4 | Utility-first styling (CSS-based config) |
| Vite | 6 | Build tool & dev server |
| shadcn/ui | Latest | 48 pre-built UI components |
| motion/react | 12+ | Animations (sidebar, AI panel, transitions) |
| lucide-react | 0.487 | Icon library |

## Project Structure

```
Catalyst/
├── src/
│   ├── main.tsx                       # React entry point
│   ├── App.tsx                        # Root component — layout shell & navigation
│   ├── components/
│   │   ├── Dashboard.tsx              # Home page
│   │   ├── TaskManagement.tsx         # 4-view task manager
│   │   ├── Sidebar.tsx                # Collapsible nav, 2 modes
│   │   ├── DrilldownTemplate.tsx      # Super Task detail page
│   │   ├── WorkflowManagement.tsx     # Workflow config table
│   │   ├── SearchModal.tsx            # Global search
│   │   ├── AIPanel.tsx                # Slide-in AI assistant
│   │   ├── Header.tsx                 # Top bar
│   │   ├── AIWorkspaceLinear.tsx      # Task-contextual AI panel
│   │   ├── MyPriorities.tsx           # Dashboard priority widget
│   │   ├── figma/                     # Figma image utilities
│   │   └── ui/                        # 48 shadcn/ui components
│   ├── imports/                       # Figma-generated files (SVGs, component wrappers)
│   ├── assets/                        # Images
│   └── styles/
│       └── globals.css                # Tailwind v4 config & design tokens
├── docs/                              # Project documentation
├── guidelines/
│   └── Guidelines.md
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture](docs/architecture.md) | Application shell, navigation model, component hierarchy, data model, state management, styling, and animation |
| [Component Reference](docs/component-reference.md) | Developer reference for all 20 custom components and 48 shadcn/ui components |
| [Design Decisions](docs/design-decisions.md) | The "why" — task-centric rationale, AI philosophy, persona mapping, competitive context |
| [Productization Plan](docs/plan.md) | Milestones, issues, and execution roadmap |
| [Setup Guide](docs/setup-guide.md) | Development reference |
| [Migration Guide](docs/migration-guide.md) | How this project was migrated from Figma Make (completed) |
| [Figma Make Reference](docs/figma-make-reference.md) | What Figma Make generates and how it maps to standard React |

## Attributions

- [shadcn/ui](https://ui.shadcn.com/) components used under [MIT License](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md)
- Photos from [Unsplash](https://unsplash.com) used under [Unsplash License](https://unsplash.com/license)
