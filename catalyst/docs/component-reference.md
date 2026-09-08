# Component Reference

Developer reference for components in the Catalyst prototype. Components are grouped by role: pages, shell, features, shared utilities, and shadcn/ui.

> **Milestone status:** M1-M3 decomposed the original monolithic components into focused files. The Sidebar, Dashboard, TaskManagement, and DrilldownTemplate have all been split. M4 added the persona system and dependency graph logic.

## Page Components

These are the three main content areas rendered by `App.tsx` based on `currentPage` state.

### Dashboard (`components/dashboard/Dashboard.tsx`)

Home screen. Displays AI insight cards (rotating carousel), close progress metrics, "My Priorities" widget, and recent review notes. Insight cards are persona-specific via `usePersona()`.

**Sub-components:**
| File | Purpose |
|------|---------|
| `InsightCarousel.tsx` | Animated AI insight card with fade/blur transitions |
| `MetricsGrid.tsx` | Close progress statistics (tasks by status, overdue count) |
| `RecentReviewNotes.tsx` | Recent review activity feed |
| `MyPriorities.tsx` | Urgency-grouped task list widget |

### TaskManagement (`components/TaskManagement.tsx`)

Task list page with four switchable views plus drill-down navigation.

**Props:**
```typescript
{
  selectedTaskId?: number | null;
  initialView?: 'table' | 'board' | 'timeline' | 'calendar';
  initialSort?: TaskSort | null;
  initialFilter?: ActiveFilters | null;
}
```

**Sub-components:**
| File | Purpose |
|------|---------|
| `tasks/TaskToolbar.tsx` | View switcher, filter panel, search, sort controls |
| `tasks/TaskCard.tsx` | Kanban board card (used in BoardView) |
| `tasks/TaskRow.tsx` | Table row (used in TableView) |
| `tasks/TaskSkeletons.tsx` | Skeleton loading states for all views |
| `tasks/views/BoardView.tsx` | Kanban columns grouped by status |
| `tasks/views/TableView.tsx` | Sortable, filterable data table |
| `tasks/views/TimelineView.tsx` | Gantt-style horizontal bar chart |
| `tasks/views/CalendarView.tsx` | Month grid with tasks on due dates |

### WorkflowManagement (`components/WorkflowManagement.tsx`)

Admin-facing workflow configuration table. Displays 20 workflow rows with filtering by type, region, and connection status. Includes toggle switches for enabling/disabling workflows.

## Shell Components

### Sidebar (`components/layout/Sidebar/`)

Decomposed into 5 files:

| File | Purpose |
|------|---------|
| `Sidebar.tsx` | Orchestrator — renders correct mode based on collapse/nav state |
| `SidebarNav.tsx` | Workspace navigation (Home, Tasks, Workflows, Close section) |
| `SidebarAdminNav.tsx` | Admin navigation (Close, Compliance, Reporting, Ops) |
| `SidebarCollapsed.tsx` | Slim icon-only mode when sidebar is collapsed |
| `SidebarFooter.tsx` | Bottom toolbar (Pinned Items, Agents, Defender, Settings icons) |

**Sub-panels** slide out from the sidebar footer:
- `PinnedItemsPanel.tsx` — Quick-access pinned items
- `AgentsPanel.tsx` — Active AI agent status
- `DefenderPanel.tsx` — Security/compliance monitoring
- `SettingsPanel.tsx` — Triggers workspace-to-admin mode transition

### Header (`components/Header.tsx`)

Fixed top bar with centered search input, "Ask FloQast" AI button, notification bell with badge, and `PersonaSwitcher` dropdown showing active persona.

### SearchModal (`components/SearchModal.tsx`)

Global search overlay. Positioned dynamically relative to the Header search input. Features tabbed results (All, Tasks, Reconciliations, Workflows, People), keyboard navigation, and highlighted matching text.

### AIPanel (`components/AIPanel.tsx`)

Slide-in panel from the right. Chat-style AI assistant interface with message bubbles, suggested prompts, and decorative gradient blur effects. 386px width, positioned below header.

### NotificationDropdown (`components/NotificationDropdown.tsx`)

Dropdown below the notification bell. Shows persona-specific notifications with read/unread states and categorization. Data sourced from `usePersona()`.

## Task Detail Components

### TaskDrilldown (`components/TaskDrilldown.tsx`)

Bridge component that loads task detail from `TaskStore` and renders the detail page. Shows `DetailSkeleton` during loading.

### TaskDetailPage (`components/task-detail/TaskDetailPage.tsx`)

Config-driven detail layout that renders sections based on the task's `DetailTier` (1-3). Replaces much of the original `DrilldownTemplate` logic.

**Sub-components:**
| File | Purpose |
|------|---------|
| `ItemDetailsCard.tsx` | Evidence/balance summary section |
| `TaskReviewNotes.tsx` | Threaded review conversation |
| `TaskAttachments.tsx` | File list with agent-generated indicators |
| `WorkflowProgressTracker.tsx` | Visual workflow stage progress |
| `PostMortemInsight.tsx` | AI automation insights and recommendations |

### DrilldownTemplate (`components/DrilldownTemplate.tsx`)

The original monolithic Super Task drill-down view. Still active for certain task IDs. Contains the full "Master Object" layout: breadcrumb, header, assignees, balance summary, journal entries, evidence, review notes, attachments, AI workspace, and workflow context.

**Key sub-components:**
- `AIWorkspaceLinear.tsx` — Embedded AI panel with agent activity timeline
- `WorkflowCard.tsx` — Workflow context card

## Shared Components (`components/shared/`)

| File | Purpose |
|------|---------|
| `PersonaSwitcher.tsx` | Header dropdown for switching between personas |
| `AgentStatusBadge.tsx` | AI agent status indicator pill |
| `CloseAgentBadge.tsx` | "Prepared by Close Agent" badge |
| `HoverPanelTrigger.tsx` | Hover-activated popover wrapper |
| `SidebarIcons.tsx` | Custom sidebar SVG icons |
| `StatusBadge.tsx` | Task status color badge |
| `UserAvatar.tsx` | Initials-based avatar circle |

## Hooks (`hooks/`)

| File | Purpose |
|------|---------|
| `use-persona-tasks.ts` | Filters tasks by active persona's `taskFilter` — used in TaskManagement, MetricsGrid, MyPriorities |
| `use-task-filters.ts` | Filter state management (status, type, preparer, reviewer, due date) |
| `use-task-sort.ts` | Sort state management (column + direction) |
| `use-pagination.ts` | Pagination state for table view |

## Runtime (`runtime/`)

### TaskStore (`runtime/TaskStore.tsx`)

Centralized state machine for all task data. Uses `useReducer` with 8 action types. Provides dependency graph selectors and auto-unblock cascading logic. See [Architecture — TaskStore](./architecture.md#taskstore-state-machine) for details.

## Contexts (`contexts/`)

| File | Purpose |
|------|---------|
| `PersonaContext.tsx` | Active persona state, persona data (insights/notifications), switcher |
| `NavigationContext.tsx` | Page routing, task deep-links, view/sort/filter configuration |
| `UIContext.tsx` | Sidebar, search modal, AI panel, notification dropdown state |

## shadcn/ui Components

48 files in `components/ui/`, consisting of 46 `.tsx` component files and 2 utility files. These are the standard shadcn/ui component library generated during the Figma Make migration. Not all are actively used by custom components.

Key actively-used components: Button, Card, Badge, Tabs, Select, Switch, Tooltip, ScrollArea, Skeleton.
