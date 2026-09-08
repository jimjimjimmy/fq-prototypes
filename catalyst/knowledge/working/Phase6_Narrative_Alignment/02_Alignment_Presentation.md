# FloQast Close Rearchitecture — Alignment Presentation

> **Slide-by-slide outline for stakeholder alignment deck**
> Audience-specific sections: Executive Leadership, Product Team, Engineering Leadership, Design Team
> Author: Benjamin Ellis, Product Design Manager | March 2026

---

## Universal Section (All Audiences) — Slides 1-8

---

### Slide 1: Title

- **Title:** "From Folders to Tasks: The FloQast Close Rearchitecture"
- **Subtitle:** Transforming from folder-centric to task-centric architecture
- **Author:** Benjamin Ellis, Product Design Manager
- **Date:** March 2026
- **Visual treatment:** Full-bleed gradient background with a simplified icon depicting a folder morphing into a task checkbox. FloQast brand mark in the bottom corner.

---

### Slide 2: The Problem in One Image

- **Visual:** Side-by-side comparison — left panel shows the current folder tree with 200+ nested folders; right panel shows the proposed search-first task inbox with a clean, flat list.
- **Stat callout:** Average preparer navigates 12+ folders per close cycle just to locate their work items.
- **Quote:** _"I can't find what I need"_ — most common demo feedback from prospective and existing customers.
- **Speaker notes:** This is the single most repeated frustration across user research, competitive loss analyses, and customer support tickets. The folder tree was built for a world where accounting teams had 20 reconciliations. Our largest customers now have 2,000+.

---

### Slide 3: The Triple-Duty Folder Problem

- **Layout:** Three columns, each representing one role the folder currently plays:
  - **Column 1 — Organization:** Folders group checklist items by account type, entity, or team convention. Changing the grouping means moving items and breaking saved views.
  - **Column 2 — Permissions:** Folder membership determines who can see and act on items. Reassigning a person to different work requires restructuring the folder tree.
  - **Column 3 — Storage Sync:** Folders map 1:1 to cloud storage directories (Box, SharePoint, Google Drive). Renaming or moving a folder risks breaking the sync anchor.
- **Callout:** All three concerns are tightly coupled — changing one breaks the others.
- **Bottom line:** This is a 10-year-old design decision that served the product well in the early years but has become our architectural ceiling. Every major feature request (cross-entity views, dynamic permissions, AI-driven workflows) runs into this coupling.

---

### Slide 4: Competitive Landscape

- **Numeric:**
  - Task-centric data model from day one
  - 40% replacement claim in competitive positioning
  - Series B funding — moving fast with modern UX
  - Threat level: High for net-new deals in the mid-market
- **BlackLine:**
  - Enterprise lock-in through compliance depth and SAP integration
  - Aging UX — customers report frustration but high switching costs
  - Threat level: Low for displacement, moderate for blocking enterprise expansion
- **Workday:**
  - Native ERP advantage — accounting close embedded in the platform
  - Threat level: Long-term strategic risk if they invest in close workflows
- **Our window:** Rearchitect now while we hold the market share advantage. Every quarter we delay, Numeric closes the feature gap and wins more competitive deals on UX alone.

---

### Slide 5: The Vision — "IDE for Accountants"

- **Three core shifts:**
  1. **Folder-centric to Task-centric:** The checklist item becomes the master object — a rich container, not a row in a spreadsheet.
  2. **Static to Event-Driven:** Workflow logic moves from hardcoded rules to configurable event-driven automation.
  3. **Manual to AI-Augmented:** AI agents handle sub-tasks (transaction matching, variance commentary, flux analysis) with human oversight.
- **The Super Task:** A single task object that aggregates sub-tasks, transactions, documents, agents, review notes, and dependencies into one rich container. Accountants see everything about a piece of work in one place.
- **The "5-second rule":** Everything a user needs to understand and act on a task should be reachable within 5 seconds of opening the application.

---

### Slide 6: Prototype Demo Screenshots

- **Task Inbox:**
  - Priority-sorted list with smart defaults (my tasks, due today, flagged by AI)
  - AI-generated summary for each task (e.g., "3 of 5 sub-tasks auto-completed, 1 needs review")
  - Search-first: global search bar is the primary navigation mechanism
- **Super Task Drill-Down:**
  - Aggregated view showing all context for a single task: linked transactions, attached documents, agent activity log, review notes thread, sub-task checklist
  - No folder navigation required — everything is on one screen
- **Close Timeline:**
  - Gantt-style visualization of the close cycle across entities
  - Bottleneck identification: AI highlights tasks that are blocking downstream work
  - Color-coded status (on track, at risk, overdue, completed)
- **Speaker notes:** Walk through a live demo of the prototype if time allows. Fallback to annotated screenshots.

---

### Slide 7: What Users Get

- **Preparer (Staff Accountant / Senior Accountant):**
  - "Inbox zero" — see only my tasks, sorted by priority, with AI-completed sub-tasks already done
  - No more hunting through folders to find assignments
- **Reviewer (Controller / Senior Accountant):**
  - Unified review queue with full context: see the task, the evidence, the AI work, and the history without navigating away
  - One-click approve/reject with inline annotation
- **Manager (Controller / VP Finance):**
  - Real-time close timeline showing cross-entity progress
  - Bottleneck identification in 5 seconds — know exactly what is late and why
- **Executive (VP Finance / CFO):**
  - Cross-entity health dashboard with drill-down capability
  - AI ROI metrics: hours saved, tasks automated, close duration trends

---

### Slide 8: 8 Architecture Principles

| # | Principle | One-Line Description |
|---|-----------|---------------------|
| 1 | **Task as Master Object** | The checklist item is the atomic unit of work — everything attaches to it. |
| 2 | **Search-First Navigation** | Users find work through search and filters, not folder hierarchies. |
| 3 | **Event-Driven Workflows** | State changes emit events; automation reacts to events, not polling. |
| 4 | **Relationship-Based Access** | Permissions derive from relationships (role, entity, task assignment), not folder membership. |
| 5 | **AI as Co-Worker** | AI agents operate as sub-task performers with human oversight, not black-box automation. |
| 6 | **Progressive Enhancement** | Every phase delivers standalone value; no "big bang" migration. |
| 7 | **Data Unification via FloLake** | All source data flows through the FloLake Silver Layer for consistency. |
| 8 | **Strangler Fig Migration** | New services wrap and gradually replace legacy services — no parallel rewrites. |

---

## Executive Deep-Dive (VP Eng, VP Product, CEO) — Slides 9-12

---

### Slide 9: Strategic Positioning

- **Market narrative:** "FloQast evolved from close management to an accounting operations platform." The rearchitecture is the technical foundation that makes this narrative real — not just a positioning statement.
- **Competitive moat:** The combination of deep data model + AI agents + unified workflow engine + 3,500-customer dataset creates a moat that is extremely hard for a startup (Numeric) to replicate and too niche for a platform player (Workday) to prioritize.
- **Revenue implications:**
  - Expand TAM from close management (~$2B) to full accounting operations (~$8B)
  - Enable upsell motions: AI agent seats, advanced analytics, workflow automation tiers
  - Reduce churn by addressing the structural UX and performance complaints that drive competitive displacement
- **Speaker notes:** This slide frames the rearchitecture as a business investment, not a technical project. The audience should leave understanding that this is about market positioning and revenue growth, not just "cleaning up tech debt."

---

### Slide 10: ROI Model

- **AI hours saved per close cycle:**
  - Projected: 20-40 hours per entity per month
  - Based on current agent capabilities (transaction matching, flux commentary) scaled to the Super Task model
  - Conservative estimate assumes 30% of sub-tasks are AI-eligible in Phase 1
- **Reduced close duration:**
  - Target: 2-day reduction in average close cycle within 12 months of full rollout
  - Mechanism: Parallelized task execution, AI pre-work, real-time bottleneck resolution
- **Customer retention impact:**
  - Address top 5 churn reasons documented in the pain point analysis (navigation complexity, lack of cross-entity visibility, slow search, rigid permissions, limited automation)
  - Projected retention improvement: 3-5 percentage points (based on comparable SaaS rearchitecture case studies)
- **Win rate improvement:**
  - Target: Recover competitive win rate vs. Numeric in mid-market deals
  - Mechanism: Demo the task inbox and timeline instead of the folder tree — lead with the modern UX

---

### Slide 11: Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| **Migration risk** | High | Strangler fig pattern — no big-bang cutover. New services run alongside old. Feature flags control rollout per customer. |
| **Customer disruption** | Medium | Progressive enhancement — existing workflows are preserved during transition. Opt-in migration with rollback capability. |
| **Timeline risk** | Medium | 6-quarter roadmap with quarterly deliverables. Each quarter produces a shippable increment. Scope can be adjusted without losing prior work. |
| **Resource requirements** | High | Dedicated squad required (estimated 6-8 engineers). Cross-team dependencies on Search, AI, and Platform teams must be negotiated. |
| **Data integrity** | High | Dual-write with reconciliation checks. ID mapping tables maintained throughout migration. Automated data validation pipelines. |

---

### Slide 12: Investment Ask

- **Phase 1 (Q1-Q2 2026):** Search infrastructure + Task Service API
  - Deliverables: OpenSearch deployment, Task Service read API, search-first navigation prototype
  - Resources: 4-6 engineers, 1 PM, 1 designer (6 months)
  - Aligns with Project Catalyst navigation and search shell delivery
- **Phase 2 (Q3-Q4 2026):** Workflow engine + Transaction bridge
  - Deliverables: Event-driven workflow engine, transaction aggregation into Super Task, dual-write implementation
  - Resources: Expand to 6-8 engineers, add 1 data engineer
- **Phase 3 (Q5-Q6 2027):** AI orchestration + Full vision
  - Deliverables: Unified AI orchestration layer, full task inbox as primary navigation, legacy decommission begins
  - Resources: Optimization phase — team size stabilizes, focus shifts to polish and migration completion
- **Decision needed:** Approve Phase 1 staffing and authorize a 4-week technical spike to validate the Task Service data model against the top 40 use cases.

---

## Product Deep-Dive — Slides 13-16

---

### Slide 13: User Research Foundation

- **5 personas defined:**
  1. Staff Accountant (Preparer) — executes reconciliations and journal entries
  2. Senior Accountant (Preparer/Reviewer) — handles complex items, reviews junior work
  3. Controller (Manager/Reviewer) — oversees close progress, approves work
  4. VP Finance (Executive) — monitors cross-entity health, reports to CFO
  5. Admin (System Administrator) — configures workflows, manages permissions
- **Journey maps:** 6 current-state + 6 aspirational journey maps covering the full close lifecycle for each persona
- **23 pain points** scored by frequency, severity, and solvability — then prioritized into a ranked backlog
- **Key finding:** Implementing just three services — Search Service, Task Service, and ReBAC — addresses 15 of 23 documented pain points. This is the highest-leverage investment we can make.

---

### Slide 14: Competitive Differentiation

- **What Numeric has that we lack:**
  - Task-centric data model built from scratch
  - Modern, clean UX with minimal navigation depth
  - Quick setup experience (onboarding in hours, not weeks)
- **What we have that Numeric lacks:**
  - Deep ERP integrations across 50+ systems
  - Reconciliation depth: matching engines, variance analysis, transaction-level detail
  - 3,500 customers generating rich data patterns
  - FloLake data platform — unified data layer across all FloQast products
- **The play:** Combine our data depth with Numeric's UX paradigm, then add AI advantages that neither competitor can match due to our data volume and integration breadth.
- **Feature parity targets:** Match Numeric on navigation speed, task clarity, and onboarding simplicity. Differentiate on data richness, AI automation, and enterprise configurability.

---

### Slide 15: Use Case Validation

- **40 use cases** tested against the proposed task-centric architecture, spanning all 5 personas and all major close workflows (reconciliation, journal entry, flux analysis, intercompany, consolidation, reporting).
- **Results:**
  - 39 of 40 use cases fully supported by the proposed system
  - Validated across simple (single-entity, basic reconciliation) and complex (multi-entity, intercompany elimination) scenarios
- **1 gap identified:** ERP write-back (posting journal entries back to the source ERP system)
  - Deferred to a future phase — requires partner API access and bilateral data agreements
  - Does not block any Phase 1-3 deliverables
  - Workaround: Export-and-import flow continues to function as it does today
- **Confidence level:** High. The data model supports the full range of current customer workflows plus the aspirational AI-augmented workflows.

---

### Slide 16: Phased Rollout Strategy

- **Phase 1: Search + New Navigation (Catalyst Alignment)**
  - Deploy OpenSearch backend powering global search
  - Ship new left-nav structure (Project Catalyst)
  - Customer impact: Faster task discovery, no workflow changes required
  - Standalone value: Addresses the #1 pain point (can't find what I need)
- **Phase 2: Super Task MVP (Read-Only Aggregated View)**
  - Task drill-down page that aggregates data from existing collections
  - Read-only — no write-path changes to existing systems
  - Customer impact: Full context on one screen, eliminates tab-switching
  - Standalone value: Reviewers and managers see immediate efficiency gains
- **Phase 3: Task Inbox Replaces Folder Navigation**
  - Task inbox becomes the default landing page (feature-flagged, reversible)
  - Folder view remains accessible as an alternative navigation mode
  - Customer impact: Fundamental UX shift — preparers work from an inbox, not a tree
  - Standalone value: "Inbox zero" experience for preparers
- **Phase 4: Full Workflow Engine + Transaction Bridge**
  - Event-driven workflow engine replaces Step Functions for close orchestration
  - Transaction bridge connects FloLake Silver Layer directly to Super Tasks
  - Customer impact: Automated task creation, dynamic dependencies, AI-driven workflows
  - Standalone value: Close cycle automation at scale

---

## Engineering Deep-Dive — Slides 17-20

---

### Slide 17: Current Architecture Pain Points

- **MongoDB collection coupling:**
  - `procedures` (checklist items) tightly coupled to `checklistFolders` (organization) and `storagemetadatas` (sync anchors)
  - Changing one collection requires cascading updates across all three
  - No clean abstraction layer — business logic embedded in data shape
- **5 fragmented AI services:**
  - Transaction matching, flux analysis, variance commentary, anomaly detection, and document extraction all operate independently
  - No unified orchestration — each service has its own trigger mechanism, retry logic, and output format
  - Result: Inconsistent AI behavior, duplicated infrastructure, difficult to add new agent capabilities
- **No search backend:**
  - Current "search" is MongoDB text indexes — slow, limited, no relevance ranking
  - Critical gap: Search-first navigation is impossible without a dedicated search infrastructure
  - This is the single biggest technical blocker for the Catalyst UX vision
- **Step Functions for workflow:**
  - Close workflow orchestration uses AWS Step Functions
  - Rigid: Adding a new step or condition requires redeploying the state machine
  - Hard to modify per-customer — no runtime configurability

---

### Slide 18: Target Service Architecture

- **8 core services:**

| Service | Responsibility | Data Store |
|---------|---------------|------------|
| **Task Service** | CRUD for Super Tasks, sub-tasks, dependencies | MongoDB (task collection) |
| **Workflow Service** | Event-driven close orchestration, rule evaluation | MongoDB (workflow definitions), SNS/SQS (events) |
| **Search Service** | Full-text + faceted search across all entities | OpenSearch |
| **Document Service** | Document storage, versioning, sync management | S3, MongoDB (metadata) |
| **Permission Service (ReBAC)** | Relationship-based access control evaluation | Dedicated graph store or MongoDB |
| **AI Orchestration Service** | Unified agent dispatch, monitoring, result aggregation | MongoDB (agent state), SQS (job queue) |
| **Analytics Service** | Close metrics, AI ROI, bottleneck detection | Snowflake |
| **Integration Service (FloLake)** | Data ingestion from ERPs and external systems | FloLake Silver Layer, S3 |

- **Communication patterns:**
  - Async: SNS/SQS event bus for state change propagation (task completed, review submitted, agent finished)
  - Sync: API Gateway for user-facing reads and writes
  - WebSocket: AppSync for real-time UI updates (existing pattern, extended to task events)
- **Infrastructure:** Follows the ECS migration pattern already proven for other FloQast services. No new infrastructure paradigm required.

---

### Slide 19: Migration Strategy (Strangler Fig)

- **Phase 1 — Read Alongside:**
  - Deploy Task Service as a read-only API that queries existing MongoDB collections
  - Task Service transforms `procedures` + `checklistFolders` + `storagemetadatas` into the Super Task shape
  - Existing checklist API remains the system of record for all writes
  - Risk: Low — no write-path changes, Task Service is additive
- **Phase 2 — Dual Write:**
  - Both systems receive writes: legacy API writes to existing collections, Task Service writes to new task collection
  - Reconciliation jobs run continuously to detect drift between the two data stores
  - Task Service begins to become the source of truth for reads (feature-flagged)
  - Risk: Medium — dual-write consistency must be monitored closely
- **Phase 3 — Read/Write Cutover:**
  - Task Service becomes the primary system of record (feature-flagged per customer)
  - Legacy API becomes a thin adapter that reads from the Task Service
  - Customers can be migrated individually; rollback is per-customer
  - Risk: Medium — requires thorough per-customer validation before cutover
- **Phase 4 — Decommission Legacy:**
  - Remove legacy checklist API and associated MongoDB collections
  - Archive historical data in Snowflake for compliance
  - Risk: Low — only executed after all customers are migrated and stable
- **Supporting infrastructure:**
  - ID mapping tables maintained throughout migration (old ID to new ID)
  - Background migration jobs for historical data
  - Reconciliation checks: automated comparison of legacy and new data stores
  - Feature flags managed via Harness (existing infrastructure)

---

### Slide 20: Technical Risks & Mitigations

| Risk | Description | Mitigation |
|------|-------------|------------|
| **Dual data model consistency** | During migration, the same data lives in two places (legacy MongoDB collections and new Task collection). Drift between them causes bugs. | ID mapping tables + continuous reconciliation jobs that compare records and alert on drift. Automated repair scripts for known drift patterns. |
| **Search index consistency** | OpenSearch index could fall behind the source of truth if events are lost or delayed. | Event-driven indexing via SQS with dead letter queue (DLQ). Failed indexing events are retried automatically; DLQ triggers alerts for manual investigation. |
| **Permission migration** | Moving from folder-based permissions to ReBAC could inadvertently grant or revoke access. | Parallel evaluation: both old and new permission systems run simultaneously. Log discrepancies. Gradual rollover — start with the new system for new customers, migrate existing customers after validation. |
| **Performance under load** | New Task Service must handle the same query volume as the existing API without regression. | Cache layer (Redis/ElastiCache) for hot queries. Read replicas for MongoDB. Async processing for non-critical writes. Load testing with production-scale data before cutover. |
| **AI orchestration reliability** | Unified AI orchestration introduces a single point of failure for all agent capabilities. | Circuit breaker pattern: if AI Orchestration Service is down, tasks degrade gracefully to manual mode. Health checks and auto-scaling. Independent agent queues so one agent type's failure does not block others. |

---

## Design Deep-Dive — Slides 21-24

---

### Slide 21: Catalyst Alignment

- **Core message:** This rearchitecture initiative builds ON Project Catalyst, not beside it. They are complementary — Catalyst is the UX delivery vehicle, and the rearchitecture provides the data model that makes Catalyst's views actually functional.
- **What Catalyst provides:**
  - Left nav redesign (simplified, role-aware navigation)
  - Global search UI (search bar, filter chips, results layout)
  - Drill-down view pattern (detail panels, tabbed content areas)
- **What the rearchitecture provides:**
  - Unified data model that populates Catalyst views with task-centric data instead of folder-centric data
  - Search backend (OpenSearch) that powers global search with relevance ranking and faceted filtering
  - Event-driven updates that keep Catalyst views in real-time sync with underlying state
- **Timeline alignment:**
  - Catalyst ships the navigation and search shell (FQGO Spring 2026 showcase)
  - Rearchitecture fills the shell with task-centric data (Phase 1-2, Q1-Q4 2026)
  - Neither initiative is complete without the other — they must stay in sync

---

### Slide 22: Information Architecture Shift

- **Current IA model:**
  - Folder tree → Checklist → Item
  - Deep hierarchy (3-5 levels of nesting)
  - Position-based: an item's location in the tree determines its context and permissions
  - Users must know the folder structure to find anything
- **Proposed IA model:**
  - Search/Filter → Task List → Super Task
  - Flat structure: tasks are independent objects with attributes, not positions in a tree
  - Attribute-based: filter and sort by account, entity, status, assignee, due date, keyword, or any combination
  - Users find work through search, not navigation
- **Navigation depth guarantee:** 2 clicks maximum from anywhere in the application to any specific task
- **Responsive to different mental models:**
  - Search by account name (for accountants who think in terms of their accounts)
  - Search by entity (for managers overseeing specific subsidiaries)
  - Filter by status (for reviewers looking at what needs approval)
  - Filter by person (for managers checking on team member progress)
  - Keyword search (for anyone looking for something specific)

---

### Slide 23: Design System Implications

- **New components needed:**
  - **Task Inbox list:** Priority-sorted, scannable, with inline status, assignee, due date, and AI summary
  - **Super Task drill-down layout:** Tabbed or sectioned layout aggregating sub-tasks, transactions, documents, agents, review notes
  - **Timeline/Gantt component:** Horizontal timeline with swimlanes per entity, color-coded task bars, dependency arrows
  - **Entity heatmap:** Grid visualization showing close health across entities (red/yellow/green)
  - **Agent status indicators:** Visual treatment for AI agent states (queued, running, completed, failed, needs review)
- **Existing components to extend:**
  - **Status badges:** Expand from current states to support 8 task states (Not Started, In Progress, Waiting on AI, Ready for Review, In Review, Needs Revision, Approved, Closed)
  - **Progress bars:** Add agent overlay showing AI-contributed vs. human-contributed progress
  - **Review note threads:** Adapt existing comment/note patterns for the Super Task context (threaded, inline, with @mentions)
- **Color system:**
  - Semantic color usage must be consistent across all new views:
    - Green: Completed / On Track
    - Red: Overdue / Failed / Blocked
    - Yellow/Amber: At Risk / Needs Attention
    - Blue: In Progress / Active
    - Purple: AI/Agent Activity
  - All colors must meet WCAG 2.1 AA contrast requirements

---

### Slide 24: Design Next Steps

- **Usability testing plan for prototype:**
  - 3 test scenarios: (1) Find and complete a task from the inbox, (2) Review a Super Task with AI-completed sub-tasks, (3) Identify a bottleneck on the close timeline
  - 5 participants per round (mix of preparers, reviewers, and managers)
  - Success metrics: Task completion rate, time to first action, System Usability Scale (SUS) score
- **Component specification for design system:**
  - Detailed specs for each new component (Task Inbox, Super Task, Timeline, Heatmap, Agent indicators)
  - Interaction patterns, states, responsive behavior, accessibility requirements
  - Handoff to engineering with Figma-to-code guidelines
- **Responsive/mobile considerations:**
  - Mobile-friendly views deferred to a future phase but IA must support it from the start
  - Task inbox is inherently mobile-friendly (list-based)
  - Super Task drill-down needs a stacked mobile layout (tabs become sections)
- **Accessibility audit of new patterns:**
  - Screen reader compatibility for timeline/Gantt (provide list-based alternative view)
  - Keyboard navigation for task inbox (arrow keys, enter to open, escape to close)
  - Color-blind safe palette for status indicators (use icons + color, not color alone)

---

## Closing — Slide 25

---

### Slide 25: The Ask

**Four things we need from this group:**

1. **Align on the task-centric vision as our north star.**
   - Agree that the folder-centric model is our architectural ceiling and that the task-centric model is the target state. All product, engineering, and design decisions should be evaluated against this direction.

2. **Approve Phase 1 engineering investment (Search + Task Service API).**
   - Staff a dedicated squad (4-6 engineers, 1 PM, 1 designer) to build the Search Service (OpenSearch) and Task Service read API over 2 quarters. Authorize a 4-week technical spike immediately to validate the data model.

3. **Commit to Project Catalyst as the UX delivery vehicle.**
   - Ensure Catalyst and the rearchitecture stay in sync. Catalyst ships the navigation shell; the rearchitecture fills it with task-centric data. These are not competing initiatives — they are two halves of the same vision.

4. **Schedule quarterly architecture reviews to stay on track.**
   - Establish a quarterly review cadence (VP Eng, VP Product, Design leadership) to assess migration progress, adjust scope, and make go/no-go decisions for subsequent phases.

---

> **Next step:** Schedule 30-minute follow-ups with each audience group to discuss their deep-dive section and gather feedback before finalizing the deck for the all-hands presentation.
