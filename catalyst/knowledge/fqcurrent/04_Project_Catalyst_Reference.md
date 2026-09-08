# Project Catalyst — Reference Notes

> **Purpose**: Living reference document for the Project Catalyst (Close Reimagining) initiative. Use this to quickly understand what Catalyst is building, who is involved, what decisions have been made, and where the boundaries are relative to the full rearchitecture vision.

> **Sources**: Project Catalyst NotebookLM (8156a6a9), Design Bar NotebookLM sessions, Slack (#design-bar, #sme-close, #ai-product-and-design-tools), Close Reimagining call notes (178K chars of transcripts from Dec 2025 – Feb 2026).

> **Last Updated**: February 27, 2026

---

## 1. What is Project Catalyst?

Project Catalyst is a comprehensive **redesign initiative** at FloQast focused on modernizing the application's navigation, information architecture, and user experience. It represents a strategic shift from FloQast's traditional product-silo architecture toward a **unified platform approach**. The work is led by the Product Design team under Benjamin Ellis (Manager, Product Design) and Greg Jones (Sr Dir, Product Design), working closely with Carlos Avila (Sr Dir, Software Engineering) and Joe Ryan (SVP, Product).

The project is targeting inclusion in **Chris Sluty's showcase at FloQast Go** (the company's annual event), which is driving the current acceleration.

### Core Designers
- **Minnie Newman** (Sr Prod Designer) — Navigation architecture, task list views, close process views
- **Joanna Liu** (Prod Designer II) — Drill-down views, staff accountant/manager journey flows, workspace/IDE concept

### Key Stakeholders & Reviewers
- Joe Ryan (SVP, Product) — Biweekly reviews, priority-setting
- Chris Sluty (CPO) — Strategic alignment, FQGO showcase sponsor
- Mike Whitmire (CEO) — Vision alignment, enterprise risk assessment
- Carlos Avila (Sr Dir, Software Engineering) — Engineering feasibility, phasing
- Tim Boulay (Dir, Product Management) — Close product management
- Steve Raeder (Dir, Product Management) — Reporting/data product perspective
- Tracy Wong (Dir, Product Management) — Close product oversight
- Kevin Williams (Sr Mgr, Solutions Consulting) — Customer-facing feedback
- Sally Guerrero (Product Manager II) — Metrics and persona-specific UX
- Eugenio Aleman (Sr Product Marketing Manager) — PLG/expansion lens

---

## 2. What Catalyst IS Building (Current Scope)

### A. Navigation Redesign (Primary Focus)
- **Left Navigation Bar** — Reorganized into three clear sections:
  1. **User/Personal Area** (top): Home, Tasks/Inbox, Notifications
  2. **Applications Layer** (horizontal): Transform, Workflow, Agents, Detection — cross-product capabilities
  3. **Products Area** (vertical): Close, Compliance, Reporting, Ops Workflow, Consolidation
- **Top Toolbar** — Global search bar, AI Assistant entry point ("Ask FloQast"), user/admin settings
- Eliminates the current confusing mix of top nav + left nav + dropdowns + product-specific menus
- Minnie has built **interactive Figma prototypes** of the navigation pattern (as of Feb 2026)

### B. Global Search
- **Prominent search toolbar** at top of all pages
- Search results with top results, linked filtered views, recent searches, suggestions, saved/bookmarked queries
- **AI-Assisted Search** — "Ask FloQast" integration for deeper natural-language queries
- Phased approach: start with checklists and compliance, expand to full platform over 2–3 quarters
- Intended to replace folder-based navigation as the primary way users find their work

### C. Task/Inbox View
- **Unified Task List** — Consolidated view showing all user tasks across FloQast products
- Opinionated design: shows ~30 most relevant items (not hundreds), sorted by due date
- Status indicators: late, due today, waiting on me, blocked
- Performance metrics: close contribution %, average task duration, predicted duration
- AI summary support — plain-text description of what changed day-over-day
- Targets **"inbox zero"** behavior for staff accountant preparers

### D. Drill-Down / Object View
- **Full-screen aggregated detail view** for individual tasks — replaces need to click through multiple pages
- Dynamic sections based on entity type (rec vs. checklist vs. compliance item):
  - Task details, account, entity, period
  - Related links and dependencies
  - Unresolved review notes
  - Attachments
  - Automation/Agent execution history
  - AI insights and recommendations
- Joanna is iterating to make this **more AI-forward** for insights, recommendations, and actions (as of Feb 2026)

### E. Close Timeline / Gantt View
- For managers/reviewers (not preparers)
- Accounting work stream organization (Cash, AR, AP, Inventory, etc.)
- Completion percentages and status indicators
- **Compare Mode** — Period-over-period visual comparison of current vs. previous closes
- **Optimization View** — AI-driven recommendations for process improvement
- Customizable by assignee, project, task type

### F. AI / Assistant Integration
- Multiple entry points: toolbar quick access, full-page chat, in-context within drill-down
- Context-aware: detects current task and provides relevant suggestions
- Can launch agents/automations and display execution logs
- Passive AI benefits (anomaly detection) that require no behavior change

---

## 3. What Catalyst is NOT Building (Explicitly Out of Scope)

### Deferred to Future Phases
- **Complete global search** — Full implementation is 2–3 quarters; only key entities first
- **Accounting Workspace/IDE** — The "Replit for Accounting" concept is 1–2 years out
- **Full Transform/Automations Redesign** — Separate workstreams (Transform, Shobit teams)
- **Complete chat/messaging integration** — Referenced but not fully designed
- **Document management layer** — Chris Sluty identified this gap; not yet designed
- **Workflow selection UI** — How to handle multiple close/ops workflows in collapsed nav; deferred

### Architectural Boundaries
- Catalyst is a **UX/design-layer initiative** — it proposes new surfaces and navigation but does not rearchitect the underlying data model, database schema, or service boundaries
- No changes to the **folder-based data architecture** (folders collection, template coupling, etc.)
- No changes to the **dual codebase** (checklist-client vs. close-client-v2)
- No database simplification or migration from MongoDB to relational
- No service decomposition or microservice boundary changes
- No API redesign or backend search infrastructure (acknowledged as needed but separate effort)
- No changes to the **replication architecture** or cross-product data flow

---

## 4. Key Design Decisions Made

| Decision | Detail |
|----------|--------|
| Section-based nav | Three areas: User, Applications, Products (replaces layered nav) |
| Search-first navigation | Global search as primary way to find work; reduces folder dependency |
| Opinionated task list | ~30 items, strong defaults, not fully customizable |
| Unified task concept | Recs, checklists, compliance items all modeled as "tasks" (person + date + status) |
| Aggregated drill-down | Full-screen detail view replaces multi-page clicking |
| Process-focused timeline | Gantt for managers, not preparers; accounting-specific, not generic PM |
| Period-over-period comparison | Unique FloQast value leveraging recurring close patterns |
| AI at natural points | Multiple entry points; passive + active; context-aware |
| Role-based personas | Preparer (task-focused), Reviewer (oversight), Manager (process/timeline) |

---

## 5. Key Tensions & Unresolved Questions

1. **Navigation terminology** — What to call the horizontal applications layer (Applications? Automations? Services?)
2. **Workflow/period visibility** — How to surface multiple close workflows and period selectors in collapsed nav
3. **Secondary navigation / pinning** — Whether to add customizable sidebar for pinned items (Slack model vs. search-only)
4. **Breadcrumbs** — Joe says "no one has ever gotten breadcrumbs right"; may lean into search-based navigation instead
5. **Drill-down organization** — Tab-based vs. collapsed sections; persona-specific tab ordering
6. **Home flexibility** — Fixed layout vs. fully customizable dashboard
7. **Close vs. Projects** — Is the timeline view accounting-specific or generalized project management?
8. **Default vs. customization** — Strong defaults (Carlos: "so good users don't want to customize") vs. enterprise flexibility

---

## 6. Timeline & Phasing

| Phase | Scope | Timeline |
|-------|-------|----------|
| Current (Dec 2025 – Mar 2026) | Navigation prototypes, drill-down concepts, stakeholder reviews | Active |
| FQGO Showcase | Chris Sluty presenting Catalyst vision | Spring 2026 |
| Phase 1 Priority | Global Search (start with key entities) | 2–3 quarters |
| Phase 1 Priority | Drill-Down Page (start with recs/checklists) | Smallest engineering effort |
| Phase 1 Priority | Navigation Cleanup (iterate and refine) | Longer tail |
| Future | Accounting Workspace/IDE | 1–2 years |

### Rollout Strategy
- Feature flags (Harness migration) enable segmented rollout
- SMM (small/medium) customers first, enterprise second
- Precedent: Previous nav change done via opt-in over 6+ months with 60–70% adoption target
- Beta validation → user interviews → qualitative feedback before full release

---

## 7. Stakeholder Feedback Summary

### Joe Ryan (SVP, Product)
- **Priorities**: Search Bar → Drill Down → Navigation Cleanup
- Concerned vertical nav wastes above-fold space; products sink too low
- Advocates search over breadcrumbs; save search queries for repeat access
- Wants AI-driven plain-text summaries of day-over-day deltas
- Insists on ONE way to build workflows across the platform

### Chris Sluty (CPO)
- Positive on horizontal applications layer and search-first approach
- Identifies missing document/knowledge management capability
- Wants metrics at top of close dashboard (completion %, rec %, checklist %)
- Wants hard ROI metrics surfaced directly in UI

### Mike Whitmire (CEO)
- Folders are "not a sacred cow" — can be eliminated if visual context preserved
- Excel should become output file, not working file
- Admires NetSuite's search approach
- "IDE for Accountants" / "Replit for Accounting" vision
- Concerned about enterprise customer adoption risk

### Carlos Avila (Sr Dir, Software Engineering)
- Advocates search as primary solution to navigation
- Task = person + date + status as core concept
- Phased approach: search → navigation → other features
- Start with SMM customers; use feature flags for A/B testing

### Steve Raeder (Dir, Product Management)
- Enterprise-grade data tables with deep customization
- Bloomberg terminal inspiration for dockable panels/flex layouts
- Backend search architecture must be prioritized for viability
- Actionable metrics, not just summations
- Implicit system memory for AI features

### Tim Boulay (Dir, Product Management)
- Platform needs "inbox-zero" experience (10–15 items for today)
- Manual traffic lights → event-driven milestones
- Cross-product period switching needs solving

### Greg Jones (Sr Dir, Product Design)
- UX as competitive moat
- Global search must replace navigation bloat
- Build native AI UI components, don't bolt onto outdated framework

---

## 8. Competitive & Inspirational References

| Reference | What Catalyst Borrows |
|-----------|----------------------|
| Slack | Left nav, channels sidebar, search-first navigation |
| Jira | Multi-view (Gantt, Kanban), automation visibility |
| Asana | Inbox feature (mentions, tasks), timeline view |
| ClickUp | Multiple view types, customizable dashboards |
| Numeric | Navigation structure, visual polish |
| NetSuite | Search as solution to navigation complexity |
| BlackLine | Dashboard-driven navigation, timeline views |
| Ramp Sheets | Excel-like interface for data entry |
| Gmail/Inbox | Unified task + email model, inbox as aggregation |

---

## 9. Relationship to Full Rearchitecture

Project Catalyst is the **UX and design layer** of a broader rearchitecture need. It proposes new surfaces, navigation patterns, and user experiences that will require corresponding backend and data architecture changes to fully realize. The full rearchitecture investigation (documented in the FloQast Close Rearchitecture Report) identifies deeper structural issues that Catalyst's designs surface but do not solve:

- **Catalyst proposes** a unified task model → **Rearchitecture requires** evolving checklist items into "super tasks" with subtasks
- **Catalyst proposes** global search → **Rearchitecture requires** significant backend search infrastructure and data model changes
- **Catalyst proposes** aggregated drill-down views → **Rearchitecture requires** connecting Close's task architecture to Reporting's transaction-based architecture
- **Catalyst proposes** AI-driven insights → **Rearchitecture requires** the data pipeline, gold layer data model, and AI security architecture to support it
- **Catalyst proposes** period-over-period comparison → **Rearchitecture requires** a simplified, unified data model that makes cross-period queries feasible at scale

In short: **Catalyst is the vision; the rearchitecture is the foundation that makes the vision technically viable.**
