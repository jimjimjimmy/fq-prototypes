# Design Decisions

This document explains the "why" behind the architectural choices in Catalyst. It draws from extensive research in the FloQast Close Rearchitecture research folder covering current-state analysis, persona journeys, the Super Task data model, system architecture, and stakeholder alignment.

## Task-Centric vs. Folder-Centric

### The Problem

FloQast Close's current architecture is folder-centric. Folders serve triple duty as:

1. **Organizational units** — grouping related checklist items and reconciliations
2. **Permission boundaries** — RBAC is tied to folder-level access
3. **ERP sync anchors** — data pipelines map to folder structure

This coupling creates cascading problems:
- **Template fragility** — folder reorganizations (merges, renames) break templates that match by folder name. When applied to older periods, they can inadvertently delete items.
- **Rigid hierarchy** — accountants need tag-based organization, dynamic grouping, and cross-cutting views that folders can't provide.
- **Navigation friction** — finding work requires drilling through folder hierarchies. Users can't answer "what's my next best action?" without clicking through multiple levels.
- **Permission granularity gaps** — folder-level permissioning is inadequate for RBAC within entities. Multiple enterprise customers demand more granular access control.

### The Solution

Catalyst replaces folder navigation with a **task-centric model** where:
- Tasks are first-class objects with rich metadata (tags, process groups, statuses)
- Navigation is driven by urgency grouping and search, not hierarchy
- Visual context (grouping by AP, AR, Cash, etc.) is preserved via data fields (`processGroup`, `tags`), not folder structure
- The prototype demonstrates this with direct navigation to filtered/sorted task views from the Dashboard

## Five-Status Task Model + Agent Status Overlay

### Status Design

The prototype uses 5 task statuses that map to the accounting close workflow:

| Status | When Applied |
|--------|-------------|
| **Not Started** | Period opened, no work begun |
| **In Progress** | Preparer actively working |
| **Ready for Review** | Preparer finished, awaiting reviewer sign-off |
| **Blocked** | Cannot proceed — missing data, dependency unmet, or issue flagged |
| **Complete** | Reviewer signed off |

This is a simplified version of the full 8-state model proposed in the rearchitecture spec (which adds `Agent Working`, `Changes Requested`, and `Redo`). The prototype uses 5 states to keep the demo focused while conveying the core workflow.

### Agent Status as Overlay

Agent involvement is tracked separately from task status via `agentStatus`:
- `Draft Ready` — agent prepared initial work product
- `Prepared` — agent completed a preparation step
- `Auto-Prepared` — agent autonomously completed the task
- `Awaiting Data` — agent blocked on external data

This separation is intentional. A task's workflow status (who needs to act next) is independent of whether AI contributed to the work. An "In Progress" task may have been auto-prepared by an agent but still needs human review. The overlay pattern makes agent involvement visible without conflating it with workflow state.

## AI Integration Philosophy

### "Invisible AI"

The prototype implements what the research calls "Invisible AI" — agents surface work passively rather than requiring users to change behavior. This manifests in several ways:

1. **Dashboard AI insight cards** — rotating carousel showing what agents have done (intercompany variance identified, depreciation schedule prepared, accrual entry drafted, bank confirmation package ready). Users see outcomes, not processes.

2. **Agent status badges on tasks** — small indicators showing agent involvement without changing the task's primary status or workflow.

3. **Drilldown AI workspace** — the `AIWorkspaceLinear` component shows agent activity timeline contextual to the task. It's embedded in the natural flow of reviewing a task, not a separate screen.

4. **Ask FloQast in search** — the AI assistant button is embedded in the search bar, positioning it as an extension of finding information rather than a separate mode.

### Hard ROI Visibility

The research emphasizes that AI must show "hard ROI (hours saved, fields transformed) directly in the UI." The drilldown template includes agent execution details — what was matched, what needs review, time saved — making the value concrete rather than abstract.

## Four Task Views

Each view serves a different workflow need:

| View | Primary User | Purpose |
|------|-------------|---------|
| **Board** (Kanban) | All personas | Workflow overview — see distribution across statuses at a glance. Best for daily standup-style check-ins. |
| **Table** | Sarah (Preparer) | Bulk operations — sort by due date, filter by type, scan large numbers of tasks efficiently. Supports the "what's overdue?" question. |
| **Timeline** (Gantt) | Maria (Controller) | Dependency visualization — see which tasks block others, identify the critical path, compare against expected progress. |
| **Calendar** | David (Reviewer) | Date-based planning — see what's due when, plan review scheduling, identify date clustering. |

The Dashboard links directly to specific views with pre-applied filters:
- "Late tasks" metric → Table view, filtered to overdue, sorted by due date
- "Due today" metric → Calendar view
- "Blocked" metric → Board view
- General navigation → Board view (default)

## Super Task Drill-Down

### Replacing Multi-Page Clicking

The current FloQast Close experience requires navigating through multiple pages to understand a single task: checklist page → reconciliation detail → review notes (separate area) → attachments → ERP data. This violates what the research calls the **"5-Second Rule"** — users should be able to identify their next best action within 5 seconds.

The `DrilldownTemplate` component (1,230 lines) demonstrates the "Master Object" concept by aggregating everything into one scrollable page:
- Task metadata and status
- Assignee cards with sign-off state
- Balance summary (GL, reconciled, variance, materiality)
- Journal entry suggestions with approve/reject
- Supporting evidence
- Threaded review notes
- Attachments (with agent-generated indicators)
- Contextual AI workspace
- Workflow context card

This design means a reviewer can open a task, understand its state, review agent work, read notes, check balances, and sign off — all without leaving the page.

## Navigation Model

### Search-First + Urgency Grouping

The prototype replaces folder-based navigation with two complementary patterns:

1. **Search-first** — the `SearchModal` (606 lines) is the primary way to find specific tasks, reconciliations, workflows, or people. It's triggered from a prominent search bar centered in the Header. This follows the NetSuite model where powerful search masks navigation complexity.

2. **Urgency grouping** — the Dashboard organizes work by urgency (late, due today, blocked, ready for review) rather than by folder. The `MyPriorities` widget shows the user's most urgent items with agent context, answering "what should I do next?" immediately.

### No Router Library (Temporary)

The prototype currently uses `currentPage` state with conditional rendering instead of a router:

```typescript
{currentPage === 'Home' && <Dashboard ... />}
{currentPage === 'Tasks' && <TaskManagement ... />}
{currentPage === 'Workflows' && <WorkflowManagement />}
```

This was intentional for the prototype — it avoids the complexity of URL-based routing while still demonstrating navigation patterns. Navigation state is now managed via `NavigationContext` (extracted in M1) which centralizes page routing, task deep-links, and view/sort/filter pre-configuration. Router integration remains a future consideration.

## Sidebar Design

### Workspace vs. Admin Toggle

The Sidebar (1,839 lines) implements two navigation modes toggled by the settings gear:

- **Workspace mode** — task-doer navigation (Home, Tasks, Workflows) with expandable workspace sections, plus bottom toolbar for Pinned Items, Agents, Defender, and Settings
- **Admin mode** — configuration navigation with expandable sections for Close, Compliance, Reporting, and Ops Workflow settings

This separation reflects the research finding that FloQast serves distinct personas who need different navigation. Preparers and reviewers spend 95% of their time in workspace mode. Controllers and admins occasionally need configuration access but shouldn't see it by default.

### Collapsible Design

The sidebar collapses to icon-only mode, giving the content area more horizontal space. In collapsed state, clicking any icon expands the sidebar and navigates simultaneously. This supports large-screen users who want maximum content area while maintaining quick access.

## Mock Data Strategy

All data is hard-coded directly in component files rather than fetched from an API or data layer. This is deliberate:

- **Realistic close-period data** — tasks represent actual accounting close scenarios (fixed asset amortization, prepaid expense rollforward, bank reconciliation, intercompany variance). The data simulates a February/March 2026 close period.
- **Named personas** — James Wilson (preparer), Joseph Smith/David Kim (reviewers) appear consistently across tasks and UI elements.
- **Agent involvement** — mock data includes realistic agent statuses and AI-generated content (insight cards, journal entries, prepared reconciliations).
- **No persistence** — state changes (clicking "approve", toggling sign-off) update React state but reset on refresh. This is appropriate for a demo prototype.
- **Hard-coded "today"** — February 25, 2026 is the reference date for overdue calculations, ensuring consistent behavior regardless of when the prototype is viewed.

## Persona Mapping

The prototype targets three personas identified in the research:

### Sarah Chen — Staff Accountant (Preparer)

**Primary screens:** Dashboard (My Priorities), Task Management (Table view)

**Key workflows:** Execute assigned tasks, review agent-prepared work, attach evidence, submit for review.

**How the prototype serves Sarah:**
- The `MyPriorities` widget on the Dashboard answers "what should I do next?" immediately — no folder drilling
- Table view lets her sort by due date and filter by type to plan her day
- Agent status badges (`Draft Ready`, `Prepared`) show which tasks have AI-prepared work waiting for her
- The drilldown page puts everything she needs in one scrollable view — she can review agent work, check balances, and submit without leaving the page

### David Kim — Senior Accountant (Reviewer)

**Primary screens:** Dashboard (metrics overview), Task Management (Board view), Drilldown

**Key workflows:** Review submitted tasks, approve/reject, identify bottlenecks, sign off.

**How the prototype serves David:**
- Board view gives an at-a-glance picture of where all tasks stand across status columns
- "Ready for Review" column surfaces exactly what needs his attention
- Drilldown sign-off flow lets him review notes, check attachments, approve journal entries, and sign off in one page
- Dashboard metrics (blocked count, late count) help him identify and escalate bottlenecks

### Maria Rodriguez — Accounting Manager (Controller)

**Primary screens:** Dashboard (close progress), Task Management (Timeline view), Workflow Management

**Key workflows:** Monitor close progress, identify blockers, manage workflows, track completion.

**How the prototype serves Maria:**
- Timeline view shows task dependencies and the critical path — she can spot what's blocking the close
- Dashboard progress bar and metrics give her a real-time pulse on close completion
- AI insight cards surface process-level intelligence (intercompany variance, depreciation ready, bank confirmation compiled)
- Workflow Management table lets her configure and monitor workflows across all entities and regions

## Competitive Context

The design decisions respond to specific competitive pressures identified in the research:

| Competitor | Threat | Catalyst Response |
|------------|--------|-------------------------|
| **Numeric** | Claiming 40% of their customers are FloQast replacements. Faster data loading, automatic account detection, AI-assisted explanations. | Agent status overlays, AI insight cards, contextual AI workspace in drilldown. Demonstrates that FloQast can match AI-forward UX while preserving accounting-specific depth. |
| **BlackLine** | Dashboard-driven navigation, timeline views, Verity AI. Abandoning mid-market but retains enterprise. | Similar dashboard and timeline patterns, but task-centric (not reconciliation-centric). Four views vs. one. Drill-down aggregation surpasses BlackLine's multi-page model. |
| **Workday** | Bundling basic close management "free" with ERP. | Prototype depth (Super Task drill-down, four views, agent integration, workflow config) demonstrates value beyond basic close tracking that can't be replicated as an ERP add-on. |

### Architectural Inspirations

The research also identifies positive patterns from non-competing products:

- **Slack** — left nav structure, channels sidebar, search-first navigation. Influenced the sidebar design.
- **Jira** — multi-view support (Gantt, Kanban), automation visibility. Influenced the four-view task management.
- **NetSuite** — search-as-solution to navigation complexity. Influenced the search-first approach.
- **Gmail/Inbox** — unified task + email model, inbox as aggregation. Influenced the urgency-grouped dashboard.

### FloQast's Differentiators

The research notes that **visual context** and **invisible AI** are FloQast's strongest competitive advantages:

1. **Visual context** — accountants value seeing work organized in familiar process groupings (AP, AR, Cash). The prototype preserves this via tags and process groups without the folder coupling. Period-over-period comparison (showing current close vs. prior close) leverages FloQast's unique historical data.

2. **Invisible AI** — background agents that prepare, validate, and flag without requiring behavior change. The prototype demonstrates this through agent status overlays, AI insight cards, and the drilldown AI workspace — all showing outcomes rather than requiring users to interact with AI tools directly.
