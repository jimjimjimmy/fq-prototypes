# Catalyst — Productization Plan

## Vision

Catalyst is a React prototype demonstrating FloQast's next-gen close management vision — task-centric workflows, "invisible AI" agents, multi-view task management, and search-first navigation. It was built from deep research covering the Super Task model, 3 personas (Sarah/David/Maria), 4 end-to-end scenarios, and an 18-month backend roadmap.

**Phased approach:**
- **Phase 1 (M1–M4):** Functional interactive prototype — well-architected code, typed data layer, decomposed components, URL-based routing, and swappable persona-specific scenario data.
- **Phase 2 (M5–M6+):** Production foundation — testing, CI/CD, and API integration as backend services come online.

The visuals are excellent and must be preserved throughout. Every refactoring milestone maintains visual parity with the current prototype.

---

## Execution Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Branch strategy** | One branch per milestone, merge to main before starting next | Clean history, easy rollback |
| **Router timing** | Deferred to new M3.5 (after component decomposition) | Decomposing with prop-drilling first is less risky than swapping the nav model while components are still monolithic |
| **Orphan cleanup** | First commit on M1 branch | Get it out of the way before structural work |
| **Nav callbacks** | NavigationContext in M1 as stepping stone | Centralizes nav state without introducing router complexity during foundation work |
| **Verification** | Manual spot-check after each milestone | `npm run dev`, all pages render, interactive features work |

---

## Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Routing** | React Router v7 (installed in M3.5) | Industry standard, lightweight, supports search params for filter/sort/view state. Replaces NavigationContext. |
| **State mgmt** | React Context + hooks | App has minimal true global state (sidebar, AI panel, persona). Task/filter/view state goes in URL search params. No need for Redux/Zustand. |
| **Data layer** | `src/data/` (mock) + `src/services/` (async) | Services return Promises wrapping mock data. When real APIs arrive, swap one file per service. |
| **Styling** | Keep Tailwind v4 + add CSS custom property design tokens | Extend existing `globals.css` `:root` block with named FloQast tokens. Progressive replacement of hardcoded hex values. |
| **Testing** | Vitest + React Testing Library (M5) | Lightweight, Vite-native. Tests for services, hooks, and core user flows. |

---

## Target File Structure

```
src/
  types/                          # Shared TypeScript interfaces
    task.ts                       # Task, SubTask, ActiveFilters, TaskStatus, SortableColumn
    workflow.ts                   # WorkflowRow, WorkflowType, ConnectionStatus, Region
    navigation.ts                 # PageName, TaskView, TaskSort, NavigationState
    insight.ts                    # InsightCard
    notification.ts               # NotificationItem
    user.ts                       # User, Persona (M4)
    index.ts                      # Barrel export
  data/                           # Scenario-driven mock data
    tasks.ts                      # Task[] (20 items) + isTaskOverdue()
    workflows.ts                  # WorkflowRow[] (20 items)
    insights.ts                   # InsightCard[] (4 items)
    notifications.ts              # NotificationItem[] (5 items)
    users.ts                      # Persona definitions (M4)
    personas/                     # Persona-specific data (M4)
      sarah-chen.ts
      david-kim.ts
      maria-rodriguez.ts
      index.ts
  services/                       # Async service layer (Promise-based)
    task-service.ts               # getTasks(), getTaskById(), checkTaskOverdue()
    workflow-service.ts           # getWorkflows()
    notification-service.ts       # getNotifications()
    insight-service.ts            # getInsights()
  contexts/                       # React Contexts
    NavigationContext.tsx          # Nav state + callbacks (M1, replaced by router in M3.5)
    UIContext.tsx                  # Sidebar/search/AI panel/notification overlay state (M2)
    PersonaContext.tsx             # Active persona (M4)
  hooks/                          # Custom React hooks
    use-sidebar.ts                # Sidebar collapse/accordion state (M2)
    use-task-filters.ts           # Filter state management (M3)
    use-task-sort.ts              # Sort state and comparison (M3)
    use-pagination.ts             # Table pagination (M3)
    use-task-url-state.ts         # URL search params for view/filter/sort (M3.5)
  routes/                         # Route components (M3.5)
    RootLayout.tsx                # Sidebar + Header + Outlet + AI Panel + overlays
    router.tsx                    # Route config
  components/
    layout/
      Sidebar/                    # Split from 1,839-line monolith (M2)
        Sidebar.tsx               # Orchestrator (~150 lines)
        SidebarNav.tsx            # Workspace nav items
        SidebarCollapsed.tsx      # Slim icon-only mode
        SidebarAdminNav.tsx       # Admin accordion nav
        SidebarFooter.tsx         # Settings + profile
        index.ts                  # Barrel export
    dashboard/                    # Split from 1,028-line Dashboard.tsx (M2)
      Dashboard.tsx               # Composition root (~100 lines)
      InsightCarousel.tsx         # AI insight card carousel
      MetricsGrid.tsx             # 4 KPI cards
      MetricCard.tsx              # Individual KPI card
      RecentReviewNotes.tsx       # Review notes column
    tasks/                        # Split from 1,791-line TaskManagement.tsx (M3)
      TaskToolbar.tsx             # View switcher + filter button + sort
      TaskCard.tsx                # Kanban card component
      TaskRow.tsx                 # Table row component
      views/
        BoardView.tsx             # Kanban columns
        TableView.tsx             # Sortable table with pagination
        TimelineView.tsx          # Gantt chart
        CalendarView.tsx          # Calendar
    task-detail/                  # Split from 1,230-line DrilldownTemplate.tsx (M3)
      TaskDetailPage.tsx          # Layout (~150 lines)
      TaskHeader.tsx              # Breadcrumb + status
      TaskWorkflow.tsx            # 4-stage workflow vis
      TaskEvidence.tsx            # Supporting evidence
      TaskReviewNotes.tsx         # Notes thread
      TaskAttachments.tsx         # File list
      AIWorkspacePanel.tsx        # Agent work summary
    shared/                       # Extracted reusable primitives (M2)
      AgentStatusBadge.tsx        # Agent status indicator
      StatusBadge.tsx             # Task status badge
      UserAvatar.tsx              # Initials avatar
      CloseAgentBadge.tsx         # "Prepared by Close Agent" badge
      PersonaSwitcher.tsx         # Persona dropdown (M4)
    ai/
      AIPanel.tsx                 # Slide-in panel (existing)
    overlays/
      SearchModal.tsx             # Global search (existing)
      NotificationDropdown.tsx    # Notifications (existing)
    ui/                           # shadcn/ui (unchanged, 48 components)
  assets/
    icons/                        # (future: renamed from imports/)
    placeholders.ts               # Avatar SVG generators
  styles/
    globals.css                   # Extended with FloQast design tokens (M4)
```

---

## Milestones & Issues

### M1: Foundation — Branch `m1/foundation`

**Goal:** Establish the architectural skeleton without changing visuals. Typed data, service layer, centralized navigation via context.

**Exit criteria:** All 3 pages render. All mock data in `src/data/`, typed via `src/types/`. Navigation state centralized in NavigationContext. `npm run dev` works, `tsc --noEmit` passes (no new errors).

| # | Title | Description |
|---|-------|-------------|
| 1 | **Clean up orphaned files** | FIRST COMMIT. Delete `TasksFromFigma.tsx`, `TasksNew.tsx`, `figma/ImageWithFallback.tsx`, ~89 orphaned files in `src/imports/`. Keep ~29 `svg-*.ts` files that ARE actively imported. Don't rename yet. Verify: `npm run dev` starts, all 3 pages render. |
| 2 | **Define TypeScript type system** | Create `src/types/` with: `task.ts` (Task, TaskStatus, ActiveFilters, SortableColumn — from TaskManagement.tsx:32-47, 318-326, 1036), `workflow.ts` (WorkflowRow, WorkflowType, ConnectionStatus, Region — from WorkflowManagement.tsx:7-22), `navigation.ts` (PageName, TaskView, TaskSort, NavigationState — new), `insight.ts` (InsightCard — from Dashboard.tsx:14-31), `notification.ts` (NotificationItem — new), `index.ts` barrel. Update TaskManagement.tsx and WorkflowManagement.tsx to import from `@/types/`. |
| 3 | **Extract mock data into `src/data/`** | Move: tasks (20 items) + `isTaskOverdue()` from TaskManagement.tsx:49-315/16-29, workflowData from WorkflowManagement.tsx:24-45, insightCards from Dashboard.tsx:14-31, notifications from NotificationDropdown.tsx:69-95 (convert inline JSX to data array). **Critical:** Dashboard.tsx:11 imports from TaskManagement — after extraction both import from `@/data/tasks`. |
| 4 | **Create service layer** | Create `src/services/` with async wrappers: `task-service.ts` (getTasks, getTaskById, checkTaskOverdue), `workflow-service.ts`, `notification-service.ts`, `insight-service.ts`. **Additive only** — not consumed yet. Components keep importing from `@/data/` directly. Wiring happens in M3 Issue #16. |
| 5 | **Add NavigationContext** | Create `src/contexts/NavigationContext.tsx`. Move from App.tsx: `currentPage`, `selectedTaskId`, `taskInitialView`, `taskInitialSort`, `taskInitialFilter`, `taskKey` + all 6 `handleNavigateTo*` functions. Keep in App.tsx: `isSidebarCollapsed`, `isSearchOpen`, `isAIPanelOpen`, `isNotificationOpen`, refs. Modify: App.tsx (wrap in Provider, shrinks ~150→~80 lines), Dashboard.tsx (remove 6 callback props → useNavigation()), Sidebar.tsx (onNavigate prop → useNavigation()), MyPriorities.tsx (if it receives nav callbacks, switch to context). **Risk:** Highest in M1. Test all 6 nav paths. |

**Execution order:** #1 first → #2 and #3 can be done together → #4 additive → #5 last (highest risk)

**Docs update:** Update `docs/architecture.md` to document new `src/types/`, `src/data/`, `src/services/`, `src/contexts/` directories. Update `docs/plan.md` milestone sequence.

---

### M2: Sidebar + Dashboard Decomposition — Branch `m2/sidebar-dashboard`

**Goal:** Break the two largest non-task components into composable pieces. Extract shared UI primitives. Eliminate prop drilling for UI overlay state.

**Exit criteria:** Sidebar.tsx under 200 lines. Dashboard.tsx under 150 lines. No file over 400 lines. All behavior preserved.

| # | Title | Description |
|---|-------|-------------|
| 6 | **Decompose Sidebar** | Split 1,839 lines into `src/components/layout/Sidebar/`: `Sidebar.tsx` (~150 lines orchestrator), `SidebarNav.tsx`, `SidebarCollapsed.tsx`, `SidebarAdminNav.tsx`, `SidebarFooter.tsx`, `index.ts` barrel. |
| 7 | **Extract Sidebar state into hook** | Create `src/hooks/use-sidebar.ts`. Encapsulate 27+ useState hooks. Accordion "only-one-open" logic (4 independent booleans) → single `expandedSection: string \| null`. |
| 8 | **Decompose Dashboard** | Split 1,028 lines into `src/components/dashboard/`: `Dashboard.tsx` (~100 lines composition root), `InsightCarousel.tsx`, `MetricsGrid.tsx`, `MetricCard.tsx`, `RecentReviewNotes.tsx`. MyPriorities.tsx (455 lines) and ProgressBar.tsx (68 lines) already separate — leave as-is. |
| 9 | **Extract shared UI primitives** | Create `src/components/shared/`: `AgentStatusBadge.tsx`, `StatusBadge.tsx`, `UserAvatar.tsx`, `CloseAgentBadge.tsx`. Currently duplicated inline across components. Needed by M3's TaskCard/TaskRow. |
| 10 | **Add UIContext for overlay state** | Create `src/contexts/UIContext.tsx` for: `isSearchOpen`, `isAIPanelOpen`, `isNotificationOpen`, `isSidebarCollapsed`. Modify: App.tsx (wraps in UIProvider), Header.tsx, Sidebar.tsx — all switch from props to `useUI()`. |

**Execution order:** #6 + #8 in parallel → #7 after #6 → #9 anytime → #10 last

**Risk areas:** Sidebar collapse animation, insight carousel autoplay, admin accordion behavior.

---

### M3: Task Management — Data Runtime + Decomposition — Branch `m3/tasks`

**Goal:** Build a lightweight simulation engine (TaskStore) that makes the prototype feel like a real application. Decompose TaskManagement.tsx (1,791 lines) and DrilldownTemplate.tsx (1,230 lines) into focused, config-driven components. Tasks and drilldown pages are populated from config files; user interactions mutate state (status changes, sign-off, comments).

**Exit criteria:** TaskStore context + reducer operational. TaskManagement parent under 100 lines. Each view under 400 lines. DrilldownTemplate replaced by composable config-driven sections. Skeleton loaders for all data-dependent views. 20 task detail configs across 3 tiers.

| # | Title | Description |
|---|-------|-------------|
| 11 | **Build TaskStore runtime** | Create `src/runtime/TaskStore.tsx` — React context + `useReducer` state machine. Seed from `src/data/tasks.ts` + task detail configs. Actions: `UPDATE_TASK_STATUS`, `TOGGLE_SIGN_OFF`, `ADD_COMMENT`, `SUBMIT_JOURNAL_ENTRY`, `SET_WORKFLOW_STAGE`. Components read via `useTaskStore()` hook. Configurable artificial delay (becomes real API latency later). |
| 12 | **Create task detail configs** | Create `src/data/task-details.ts` with detail configs for all 20 tasks in 3 tiers: **Tier 1** (5 tasks — ids 1, 3, 5, 9, 4): full AI workflow, evidence, review notes, attachments, sign-off flow. **Tier 2** (8 tasks — ids 2, 6, 7, 11, 13, 15, 19, 12): medium detail with workflow + evidence + notes. **Tier 3** (7 tasks — ids 8, 10, 14, 16, 17, 18, 20): light detail with basic workflow stage display. No-agent tasks (agentStatus: null) skip AI workspace; in complete state, recommend automation. |
| 13 | **Extract 4 task views** | Create `src/components/tasks/views/`: `BoardView.tsx`, `TableView.tsx`, `TimelineView.tsx`, `CalendarView.tsx`. TaskManagement.tsx becomes a thin orchestrator. SVG path imports must follow the correct view. |
| 14 | **Extract filter + sort + toolbar** | Create `src/hooks/use-task-filters.ts`, `src/hooks/use-task-sort.ts`, `src/hooks/use-pagination.ts`, `src/components/tasks/TaskToolbar.tsx`. |
| 15 | **Decompose DrilldownTemplate** | Split 1,230 lines into `src/components/task-detail/`: `TaskDetailPage.tsx` (~150 lines), `TaskHeader.tsx`, `TaskWorkflow.tsx`, `TaskEvidence.tsx`, `TaskReviewNotes.tsx`, `TaskAttachments.tsx`, `AIWorkspacePanel.tsx`. All sections read from TaskStore config — no hardcoded data. |
| 16 | **Create TaskCard and TaskRow** | `src/components/tasks/TaskCard.tsx` (for BoardView) and `TaskRow.tsx` (for TableView). Use shared primitives from M2. Read from TaskStore. |
| 17 | **Wire everything + skeleton loaders** | All task views and detail pages consume TaskStore. Add shimmer skeleton loaders for loading states (configurable artificial delay). Status mutations dispatched from UI interactions (status dropdown, sign-off button, comment submission). |

**Execution order:** #11 + #12 first (data runtime foundation) → #13-#14 in parallel (view extraction) → #15 + #16 after views → #17 last (wiring + loading states)

**Risk areas:** Table pagination sync, SVG imports landing in wrong view, DrilldownTemplate sign-off flow state, skeleton loader timing.

**Task Detail Tier Design:**

| Tier | Tasks | Detail Level |
|------|-------|-------------|
| **Tier 1 — Full** | 1 (fixed asset amort), 3 (cash clearing recon), 5 (bank recon WF), 9 (bank recon Chase — complete), 4 (deferred rev — blocked) | Full AI workflow with 4 stages, supporting evidence table, review notes thread, attachments, sign-off flow. Complete tasks show signed-off state + PostMortemInsight. Blocked tasks show earlier workflow stages. |
| **Tier 2 — Medium** | 2 (prepaid rollforward), 6 (monthly invoicing), 7 (SBC review), 11 (depreciation), 12 (rev rec), 13 (inventory), 15 (intercompany), 19 (payroll accrual) | Workflow visualization + evidence + review notes. No AI workspace deep-dive. |
| **Tier 3 — Light** | 8 (S&M accrual), 10 (bank recon MMA — complete), 14 (tax provision), 16 (lease liability — not started), 17 (AR aging — complete), 18 (AP aging — complete), 20 (close package — not started) | Basic workflow stage indicator + summary card. Minimal detail. |

---

### M3.5: React Router — Branch `m3.5/router`

**Goal:** Replace NavigationContext with URL-based routing. Deep linking, browser back/forward, view/filter/sort in URL params.

**Exit criteria:** All pages at their own URLs (`/`, `/tasks`, `/tasks/:id`, `/workflows`). Browser back/forward works. View/filter/sort persisted in URL search params. NavigationContext removed entirely.

| # | Title | Description |
|---|-------|-------------|
| 18 | **Install React Router and configure routes** | Add `react-router-dom`. Create `src/routes/RootLayout.tsx` (Sidebar + Header + `<Outlet/>` + AI Panel + overlays), `src/routes/router.tsx` (route config: `/` → Dashboard, `/tasks` → TaskList, `/tasks/:id` → TaskDetail, `/workflows` → Workflows). |
| 19 | **Migrate NavigationContext → router** | Replace context methods with `useNavigate()` and `<Link>`. Remove NavigationContext entirely. Sidebar uses `<Link to="/">`, Dashboard metrics use `<Link to="/tasks?filter=late">`. |
| 20 | **Move view/filter/sort to URL search params** | Create `src/hooks/use-task-url-state.ts` using `useSearchParams()`. URL structure: `/tasks?view=board&sort=dueDate:asc&filter=dueDateRange:late`. Remove `taskInitialView`, `taskInitialSort`, `taskInitialFilter`, `taskKey` from any remaining state. |

**Execution order:** #17 → #18 → #19 (sequential, each builds on prior)

**Risk areas:** Browser back/forward, deep linking to `/tasks/5`, page transition animations (may need AnimatePresence around Outlet).

---

### M4: Scenario Data, Persona Switching & Dependency Logic — Branch `m4/personas`

**Goal:** Replace generic mock data with research-backed scenario data. Add persona switching. Wire dependency graph logic into TaskStore. Finish with a full documentation audit.

**Exit criteria:** Three persona scenarios navigable via header switcher. Dependency cascading logic functional in TaskStore. All project documentation accurately reflects current codebase and architecture.

| # | Title | Description |
|---|-------|-------------|
| 21 | **Persona data structure** | Create `src/types/user.ts` (User, Persona), `src/data/users.ts`, `src/data/personas/index.ts`. |
| 22 | **Create Sarah Chen scenario** | `src/data/personas/sarah-chen.ts` — preparer: bank recs, month-end close tasks. |
| 23 | **Create David Kim scenario** | `src/data/personas/david-kim.ts` — reviewer: approve/reject queue. |
| 24 | **Create Maria Rodriguez scenario** | `src/data/personas/maria-rodriguez.ts` — controller: cross-entity oversight, timeline. |
| 25 | **Persona switcher UI** | `src/contexts/PersonaContext.tsx` + `src/components/shared/PersonaSwitcher.tsx` in Header. Switches active data set. |
| 26 | **SuperTask type fields (slim)** | Add remaining optional fields to `src/types/task.ts`: `processGroup`, `agents[]`, `statusHistory[]`, `agentHistory[]`. Note: `subTasks[]`, `dependencies[]`, and `aiInsights[]` already exist in `task-detail.ts`. |
| 27 | **Design token cleanup (slim)** | Audit hardcoded hex colors in components (e.g. TaskRow, TaskCard, BoardView) and replace with existing CSS custom properties. Infrastructure (`:root` vars, `@theme inline`) already in place. |
| 28 | **Dependency graph logic in TaskStore** | Add `ADD_DEPENDENCY`/`REMOVE_DEPENDENCY` actions, `getBlockedBy(taskId)` and `getDependencyGraph()` selectors, and auto-unblock cascading (when a blocking task completes, downstream tasks move `Blocked` → `Not Started`). Enables a future dependency view without building the view itself. |
| 29 | **Documentation audit** | Rewrite all docs (`docs/`, `README.md`, `guidelines/`) to accurately reflect current codebase architecture, component catalog, data model, state management (TaskStore, contexts), and file structure. Remove outdated references and ensure consistency across all documentation files. |

**Execution order:** #21 first → #22-24 in parallel → #25 → #26+#27 in parallel → #28 → #29 last

---

### M5: Testing & Polish (Phase 2)

**Goal:** Testing infrastructure, linting, and performance optimization.

**Exit criteria:** Core flows tested. Lighthouse >90. ESLint/Prettier configured.

| # | Title | Description |
|---|-------|-------------|
| 30 | **Configure ESLint + Prettier** | TypeScript-ESLint, React plugin, import ordering, `@/` path aliases. |
| 31 | **Add Vitest + React Testing Library** | Unit tests for services, hooks, and type guards. |
| 32 | **Integration tests for core flows** | Dashboard, task navigation, filter, task detail, sidebar flows. |
| 33 | **Performance optimization** | `React.memo`, `useMemo`, lazy-load CalendarView/TimelineView. |

---

### M6: Production Readiness (Future)

**Goal:** Transition from prototype to production-capable front-end as backend services come online.

**Exit criteria:** API integration layer functional. CI/CD pipeline operational. Production build deployed.

| # | Title | Description |
|---|-------|-------------|
| 34 | **API integration layer** | Swap mock service implementations for real API clients. Services already return Promises — replace mock data with `fetch` calls. |
| 35 | **Backend alignment with Task Service** | Integrate with the Task Service API (Q2+ timeline). Map SuperTask fields to backend schema. Handle pagination, error states, and loading. |
| 36 | **Permissions integration (ReBAC)** | Integrate with FloQast's Relationship-Based Access Control system (Q4+ timeline). Conditionally render UI based on user permissions. |
| 37 | **Configure GitHub Actions CI** | Workflow: install → type check → lint → test → build. Branch protection rules. |
| 38 | **Analytics instrumentation** | Add tracking for key user interactions: view switches, task drilldowns, persona usage, AI panel engagement. |

---

## Execution Sequence Summary

```
M1: #1 (orphan cleanup) → #2 (types) → #3 (data) → #4 (services) → #5 (NavigationContext)
    #2 and #3 can be done together; #4 is additive; #5 last (highest risk)

M2: #6+#8 in parallel (sidebar + dashboard decomposition)
    #7 after #6 (sidebar hook needs decomposed sidebar)
    #9 anytime (shared primitives)
    #10 last (UIContext)

M3: #11+#12 first (TaskStore runtime + task detail configs)
    #13+#14 in parallel (views, filters, toolbar)
    #15+#16 after views (drilldown decomp + TaskCard/Row)
    #17 last (wire to TaskStore + skeleton loaders)

M3.5: #18 → #19 → #20 (sequential, each builds on prior)

M4: #21 first (data structure) → #22-24 in parallel (persona data)
    → #25 (switcher) → #26+#27 in parallel (SuperTask slim + token cleanup)
    → #28 (dependency graph logic) → #29 last (documentation audit)

M5: Sequential: lint → test setup → integration tests → perf (#30-33)

M6: #34-35 sequential (API layer then backend)
    #36 independent (permissions)
    #37-38 anytime (CI, analytics)
```

---

## Key Files Being Transformed

| File | Lines | Milestone | Outcome |
|------|-------|-----------|---------|
| `src/App.tsx` | 150 | M1, M3.5 | M1: wraps in NavigationProvider (~80 lines). M3.5: becomes thin router root layout. |
| `src/components/TaskManagement.tsx` | 1,791 | M1+M3 | M1: data/types extracted. M3: split into ~8 files, parent <100 lines. |
| `src/components/Sidebar.tsx` | 1,839 | M2 | Split into 5 files, parent <200 lines. |
| `src/components/Dashboard.tsx` | 1,028 | M2 | Split into 6 files, parent <150 lines. |
| `src/components/DrilldownTemplate.tsx` | 1,230 | M3 | Split into 7 files, parent <200 lines. |
| `src/styles/globals.css` | 251 | M4 | Extended with design tokens. |

---

## Verification

After each milestone merge:
- `npm run dev` starts without errors
- All 3 pages render correctly
- Sidebar collapse/expand, AI panel slide, search modal, notifications all work
- All 4 task views switch correctly
- Task drilldown opens and sign-off flow works
- `tsc --noEmit` passes (or at least no new errors vs baseline)

After all Phase 1 milestones:
- Three persona scenarios navigable with coherent data
- All pages at their own URLs with deep linking
- Architecture supports future API integration by swapping service implementations
