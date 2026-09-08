# Architecture

This document describes how the Catalyst prototype is structured — its layout shell, navigation model, component hierarchy, data model, state management, styling system, and animations.

## Getting Started

Catalyst is a Vite-powered React application. To run locally:

```bash
npm install
npm run dev
# Opens at http://localhost:5173
```

See the [Setup Guide](./setup-guide.md) for full development reference. For Figma Make migration history, see [figma-make-reference.md](./figma-make-reference.md) — the `src/imports/` directory contains 118 Figma-generated files, most of which are orphaned.

## Application Shell

`App.tsx` orchestrates the top-level layout using a flexbox shell with three nested context providers:

```
PersonaProvider          ← Active persona + persona-specific data
  └── NavigationProvider ← Page routing, task deep-links
       └── UIProvider    ← Sidebar, search, AI panel, notification state
            └── TaskStoreProvider ← Centralized task state machine
                 └── AppContent   ← Layout shell
```

```
┌─────────────────────────────────────────────────────────┐
│ ┌──────────┐ ┌────────────────────────────────┐ ┌──────┐│
│ │          │ │  Header (PersonaSwitcher, Bell) │ │      ││
│ │          │ ├────────────────────────────────┤ │  AI  ││
│ │ Sidebar  │ │                                │ │ Panel││
│ │ (collap- │ │     Content Area               │ │(slide││
│ │  sible)  │ │  (Dashboard | Tasks |          │ │ -in) ││
│ │          │ │   Workflows)                   │ │      ││
│ │          │ │                                │ │      ││
│ └──────────┘ └────────────────────────────────┘ └──────┘│
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │  Modal overlays: SearchModal, NotificationDropdown  │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

- **Sidebar** — Left-docked, collapsible. Decomposed into `layout/Sidebar/` (5 files: Sidebar, SidebarNav, SidebarAdminNav, SidebarCollapsed, SidebarFooter). FloQast branded gradient background (`#014a3d` to `#00332a`). Toggles between workspace and admin navigation modes.
- **Header** — Fixed at top, spans full width. Contains centered search trigger, "Ask FloQast" AI button, notification bell with badge, and PersonaSwitcher dropdown (persona avatar + name).
- **Content area** — Fills remaining space. Animates its `marginRight` when the AI panel opens (pushes content left rather than overlaying).
- **AI Panel** — Fixed-position, slides in from the right at 386px width. Positioned below the header (`top: 55px`).
- **Modal overlays** — SearchModal and NotificationDropdown render conditionally on top of everything.

## Navigation Model

Navigation is state-driven via `NavigationContext` — there is no router library. The context provides `currentPage`, navigation callbacks, and deep-link parameters:

```typescript
// NavigationContext provides:
{
  currentPage: PageName;           // 'Home' | 'Tasks' | 'Workflows'
  selectedTaskId: number | null;
  taskInitialView: TaskView;
  taskInitialSort: TaskSort | null;
  taskInitialFilter: ActiveFilters | null;
  taskKey: number;                 // Forces TaskManagement remount
  navigateToTask: (id: number) => void;
  navigateToTasks: (opts?) => void;
  setCurrentPage: (page: PageName) => void;
}
```

Page transitions are triggered by:
1. **Sidebar navigation** — clicking nav items calls `setCurrentPage(page)`
2. **Dashboard deep links** — clicking cards/metrics navigates to Tasks with specific filters, sorts, and views pre-applied
3. **Search results** — selecting a task navigates to Tasks with that task selected

## Component Hierarchy

```
App.tsx (PersonaProvider → NavigationProvider → UIProvider → TaskStoreProvider)
├── layout/Sidebar/
│   ├── Sidebar.tsx (orchestrator)
│   ├── SidebarNav.tsx (workspace navigation)
│   ├── SidebarAdminNav.tsx (admin navigation)
│   ├── SidebarCollapsed.tsx (slim icon-only mode)
│   ├── SidebarFooter.tsx (bottom toolbar)
│   └── panels: PinnedItemsPanel, AgentsPanel, DefenderPanel, SettingsPanel
├── Header.tsx + shared/PersonaSwitcher.tsx
├── dashboard/
│   ├── Dashboard.tsx (orchestrator)
│   ├── InsightCarousel.tsx (AI insight cards)
│   ├── MetricsGrid.tsx (close progress stats)
│   ├── RecentReviewNotes.tsx (activity feed)
│   └── MyPriorities.tsx (urgency-grouped tasks)
├── tasks/
│   ├── TaskToolbar.tsx (view switcher, filters, search)
│   ├── TaskCard.tsx (board card)
│   ├── TaskRow.tsx (table row)
│   ├── TaskSkeletons.tsx (loading states)
│   └── views/
│       ├── BoardView.tsx (Kanban columns)
│       ├── TableView.tsx (sortable/filterable table)
│       ├── TimelineView.tsx (Gantt chart)
│       └── CalendarView.tsx (month grid)
├── task-detail/
│   ├── TaskDetailPage.tsx (config-driven detail layout)
│   ├── ItemDetailsCard.tsx (evidence/balance summary)
│   ├── TaskReviewNotes.tsx (threaded conversation)
│   ├── TaskAttachments.tsx (file list)
│   ├── WorkflowProgressTracker.tsx (stage progress)
│   └── PostMortemInsight.tsx (AI automation insights)
├── TaskManagement.tsx (page: toolbar + views + drilldown)
├── TaskDrilldown.tsx (bridge: loads detail from TaskStore)
├── DrilldownTemplate.tsx (legacy full detail — being replaced by task-detail/)
├── WorkflowManagement.tsx (page: workflow config table)
├── SearchModal.tsx (overlay)
├── AIPanel.tsx (slide-in)
├── AIWorkspaceLinear.tsx (in-drilldown AI workspace)
├── WorkflowCard.tsx (workflow context card)
└── NotificationDropdown.tsx (overlay)
```

**Shared utilities** in `components/shared/`:
- `AgentStatusBadge.tsx` — AI agent status indicator
- `CloseAgentBadge.tsx` — "Prepared by Close Agent" pill
- `HoverPanelTrigger.tsx` — Hover-activated popover wrapper
- `SidebarIcons.tsx` — Custom sidebar SVG icons
- `StatusBadge.tsx` — Task status color badge
- `UserAvatar.tsx` — Initials-based avatar circle
- `PersonaSwitcher.tsx` — Header persona dropdown

## Data Model

### Type System

Types are defined in `src/types/` and barrel-exported from `src/types/index.ts`:

```
types/
├── task.ts         → Task, TaskStatus, ActiveFilters, SortableColumn, AgentRecord, StatusChange
├── task-detail.ts  → TaskDetail, WorkflowStage, ReviewNote, Attachment, Subtask, TaskDependency, etc.
├── workflow.ts     → WorkflowRow, WorkflowType, ConnectionStatus, Region
├── navigation.ts   → PageName, TaskView, TaskSort, TaskFilter
├── insight.ts      → InsightCard
├── notification.ts → NotificationItem
├── user.ts         → User, Persona, PersonaId
└── index.ts        → Barrel export
```

### Task Interface

```typescript
interface Task {
  id: number;
  name: string;
  type: string;                    // 'Checklist' | 'Reconciliation' | 'Analysis' | 'Key Reports'
  status: TaskStatus;              // 'Not Started' | 'In Progress' | 'Ready for Review' | 'Blocked' | 'Complete'
  dueDate: string;                 // Format: "Feb 24", "Mar 3"
  preparer: string;
  reviewer: string;
  tags: string[];
  agentStatus: string | null;      // 'Draft Ready' | 'Prepared' | 'Auto-Prepared' | 'Awaiting Data' | null
  attachments?: number;
  comments?: number;
  journals?: number;
  startDate?: string;
  dependencies?: number[];         // Task IDs this task depends on
  processGroup?: string;
  agents?: string[];
  statusHistory?: StatusChange[];
  agentHistory?: AgentRecord[];
}
```

### TaskDetail Interface

Rich detail data for the drill-down view. Supports three tiers of detail density:
- **Tier 1** (full): AI workflow stages, evidence, review notes, sign-off
- **Tier 2** (medium): Workflow stages, review notes, attachments
- **Tier 3** (light): Basic metadata only

### Mock Data Layer

All data lives in `src/data/`:

```
data/
├── tasks.ts         → 20 Task records + isTaskOverdue() helper
├── task-details.ts  → TaskDetail configs keyed by task ID (tiers 1-3)
├── workflows.ts     → 20 WorkflowRow records
├── insights.ts      → Default InsightCard[] (5 cards)
├── notifications.ts → Default NotificationItem[] (5 items)
├── users.ts         → Persona definitions (Sarah, David, Maria)
└── personas/
    ├── index.ts     → getPersonaData() lookup
    ├── sarah-chen.ts    → Preparer insights + notifications
    ├── david-kim.ts     → Reviewer insights + notifications
    └── maria-rodriguez.ts → Controller insights + notifications
```

The current "today" date is hard-coded as **February 25, 2026** in `src/data/tasks.ts:4`.

## State Management

State is managed through React contexts and a useReducer-based store. No external libraries (Redux, Zustand).

### Context Architecture

| Context | File | Purpose |
|---------|------|---------|
| `PersonaContext` | `contexts/PersonaContext.tsx` | Active persona, persona-specific data (insights, notifications), persona switcher |
| `NavigationContext` | `contexts/NavigationContext.tsx` | Page routing, task deep-links, view/sort/filter pre-configuration |
| `UIContext` | `contexts/UIContext.tsx` | Sidebar collapse, search modal, AI panel, notification dropdown, ref management |
| `TaskStoreProvider` | `runtime/TaskStore.tsx` | Centralized task state machine (see below) |

### TaskStore (State Machine)

`runtime/TaskStore.tsx` manages all task mutations via `useReducer`:

**Actions:**
| Action | Effect |
|--------|--------|
| `UPDATE_TASK_STATUS` | Changes task status + auto-advances workflow stages on Complete + auto-unblocks downstream tasks |
| `TOGGLE_SIGN_OFF` | One-way sign-off → marks Complete + auto-unblocks downstream |
| `SUBMIT_JOURNAL_ENTRY` | Marks journal as submitted |
| `ADD_COMMENT` | Appends review note + increments comment count |
| `SET_WORKFLOW_STAGE` | Advances workflow stage tracker |
| `ADD_DEPENDENCY` | Adds a dependency edge between tasks |
| `REMOVE_DEPENDENCY` | Removes a dependency edge |
| `RESET` | Returns to seed data |

**Dependency Graph:**
The store exposes a `dependencyGraph` with:
- `edges` — all `{ from, to }` dependency pairs
- `getBlockers(taskId)` — tasks blocking this task
- `getBlocked(taskId)` — tasks this task blocks
- `isBlocked(taskId)` — whether any incomplete blockers exist

**Auto-unblock cascading:** When a task completes (via status update or sign-off), all downstream tasks that were `Blocked` and whose dependencies are now all `Complete` are automatically moved to `Not Started`.

**Selectors:**
- `getTask(id)` — find task by ID
- `getTaskDetail(id)` — find detail config by ID
- `getTasksByStatus(status)` — filter tasks by status

### Simulated Loading

`TaskStoreProvider` includes a configurable `simulatedDelay` (default 600ms) that holds `isLoading: true` before revealing data. Components render skeleton loaders (`TaskSkeletons.tsx`) during this period.

## Persona System

Three personas represent different user roles:

| Persona | Role | Default View | Focus |
|---------|------|--------------|-------|
| Sarah Chen | Staff Accountant (Preparer) | Table | Bank recs, revenue, month-end close |
| David Kim | Senior Accountant (Reviewer) | Board | Review queue, approvals, QA |
| Maria Rodriguez | Accounting Manager (Controller) | Timeline | Cross-entity oversight, dependencies |

Switching personas changes:
- **Task visibility** — TaskManagement, MetricsGrid, and MyPriorities filter tasks via `usePersonaTasks()` hook. Sarah sees tasks where she's preparer, David sees tasks where he's reviewer, Maria sees all.
- Dashboard insight cards (persona-specific AI insights)
- Dashboard metrics and "Up Next" priorities (scoped to persona's tasks)
- Notification items (persona-specific alerts)
- Header avatar initials and dropdown

### Cross-Persona Dependency Demo

The seed data is configured to demonstrate the dependency auto-unblock flow across personas:
1. **Task #3** (Reconcile cash clearing account) — preparer: Sarah Chen, reviewer: David Kim, status: Ready for Review
2. **Task #5** (Bank reconciliation - Wells Fargo) — preparer: Sarah Chen, reviewer: David Kim, status: Blocked, depends on Task #3

**Flow:** Switch to David → sign off on Task #3 → it completes → Task #5 auto-unblocks from Blocked to Not Started → switch to Sarah → Task #5 is now actionable.

## Styling Architecture

### Tailwind CSS v4

The project uses Tailwind CSS v4 with the `@theme inline` directive in `globals.css`. This is the CSS-first configuration approach (no `tailwind.config.js`).

### Design Tokens

CSS custom properties in `:root` provide semantic tokens:

**Status colors** (used in TaskRow, TaskCard, BoardView):
| Token | Value | Usage |
|-------|-------|-------|
| `--status-complete-bg/text` | `#e3f5e6` / `#2a6a39` | Complete status badges |
| `--status-in-progress-bg/text` | `#e3edf6` / `#507fc0` | In Progress badges |
| `--status-review-bg/text` | `#f4eef9` / `#73418a` | Ready for Review badges |
| `--status-blocked-bg/text` | `#fdebd7` / `#e15015` | Blocked badges |
| `--status-not-started-bg/text` | `#f2f1f0` / `#555352` | Not Started badges |

**Semantic colors:**
| Token | Value | Usage |
|-------|-------|-------|
| `--text-primary` | `#101828` | Primary text |
| `--text-secondary` | `#475467` | Secondary text |
| `--text-tertiary` | `#6b7280` | Tertiary/muted text |
| `--border-default` | `#e4e7ec` | Default borders |
| `--floqast-deep` | `#013A30` | FloQast brand deep green |
| `--floqast-accent` | `#C0E8D7` | FloQast accent green |
| `--agent-green` | `#00A651` | Agent active states |

### Brand Colors

FloQast's brand identity is expressed through:
- **Sidebar gradient**: `bg-gradient-to-b from-[#014a3d] to-[#00332a]` — deep forest green
- **Accent green**: `#90E39A` — used sparingly for AI/agent indicators
- **Agent green**: `#00A651` — toggle switches, active states
- **Background**: `#f9fafb` — light gray content area

### Custom CSS

`globals.css` includes non-Tailwind additions:
- `.nav-no-scrollbar` / `.scrollbar-hide` — hides scrollbars on navigation and card containers
- `.animate-fadeIn` — CSS keyframe animation for insight card transitions
- `.settings-panel-scroll` — custom scrollbar styling for the dark sidebar panels
- Base typography layer for `h1`–`h4`, `p`, `label`, `button`, `input`

## Animation

The project uses `motion/react` (Framer Motion's React package) for all animations:

| Animation | Component | Behavior |
|-----------|-----------|----------|
| Sidebar collapse | App.tsx / Sidebar | Width transition on collapse toggle |
| AI panel slide-in | App.tsx | `x: '100%' → 0` with 0.5s ease-out |
| Content push | App.tsx | `marginRight: 0 → '386px'` when AI panel opens |
| Page transitions | TaskManagement | `AnimatePresence` for view switching |
| Insight card carousel | Dashboard | `AnimatePresence` with fade/blur |
| Board cards | BoardView | Staggered fade-in with delay per column/card |
| Skeleton loaders | TaskSkeletons | Pulse animation during simulated loading |

All transitions use `duration: 0.5` and `ease: "easeOut"` for a consistent feel.
