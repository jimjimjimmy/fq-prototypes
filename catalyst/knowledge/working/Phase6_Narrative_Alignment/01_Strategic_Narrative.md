# From Folders to Tasks: The FloQast Close Transformation Story

**Author:** Benjamin Ellis, Product Design Manager
**Date:** March 2, 2026
**Status:** Strategic Narrative — Living Document

---

## 1. The Opening: Where We Are

FloQast Close is the market leader in accounting close management. Over 3,500 customers trust the platform to manage their month-end, quarter-end, and year-end close processes. The product was born in 2013 from a simple, powerful insight: accountants were managing close in Excel spreadsheets and physical binders, and they needed a tool that worked *with* their existing workflows, not against them. FloQast met them where they were — syncing with their cloud storage, reading their Excel workbooks, and providing a digital layer over the paper-and-binder process they already knew.

That architectural choice — building around **folders** as the primary organizing unit — mirrored how accountants had always worked. Entity, year, month, process folder. Accounts Payable. Accounts Receivable. Deferred Revenue. PP&E. The hierarchy was intuitive because it was inherited from the filing cabinet.

For a decade, this architecture served FloQast well. It powered the growth from startup to market leader. But today, that same architecture has become the ceiling for every feature the team tries to build.

### The Triple-Duty Folder Problem

The folder is not merely an organizational container. In FloQast Close, a single folder simultaneously serves three distinct purposes:

1. **Organization** — Folders define how checklist items, reconciliations, and documents are grouped and displayed. The folder hierarchy is the primary navigation mechanism for staff accountants.

2. **Permissioning** — Folder-level access controls determine who can see and act on tasks. If you need someone to review an item, they must have access to the folder that contains it. This was inherited from desktop file syncing (Box, SharePoint, Dropbox) and was never designed for enterprise role-based access control.

3. **Storage Sync** — Folders are anchored to cloud storage directories via API integration. Reconciliation files use the `#FQ Anchor Point` system to pull balances from Excel workbooks stored in those synced folders. Move a file, rename a folder, or reorganize the structure, and the reconciliation breaks.

These three responsibilities are tightly coupled. You cannot change the organization without affecting permissions. You cannot restructure permissions without risking storage sync. You cannot modernize navigation without confronting both. The `folders` MongoDB collection is accessed by seven or more services across the Close platform — Checklist, Items, Replication, Tasks, Workflow Analytics, Reconciliations, and more. The coupling is not superficial; it is architectural.

### What Customers Experience

The consequences of this coupling show up daily in the experience of every user persona:

**Fragmented workflows.** Users cannot fully work within the checklist because related work — reconciliations, review notes, attachments, dependencies — lives in different product areas. The checklist links users *elsewhere* rather than aggregating context in one place. As one internal stakeholder described it during Project Catalyst research: "Users are not fully working on the checklist table all the time because they would want to go to maybe a reconciliation, they want to go to the review notes, and that links them elsewhere."

**Navigation as archaeology.** Finding a specific task requires knowing which entity, which period, and which folder it lives in. There is no way to search for "the Deferred Revenue reconciliation that Sarah flagged last Tuesday" without manually navigating the hierarchy. The current grid page — the most-used page in FloQast — fails what the Close engineering team calls the **"5-Second Rule"**: users cannot identify their next best action within five seconds of landing on the page.

**Template fragility.** When customers reorganize folders — merging two process areas, renaming for clarity, restructuring after an acquisition — the template system can break. Templates are "timeless" definitions that match by folder name. Rename a folder, and applying the template to a prior period can inadvertently delete checklist items. This has produced real customer incidents (documented in support escalations around entity creation failures and folder merges).

**Entity creation failures.** The tight coupling of entities to folder structures in the database means that if folder creation fails during entity setup, the entire entity enters a "broken" state requiring manual database intervention by engineering.

**Siloed products.** FloQast has expanded from Close into Reconciliations, Compliance, Reporting, Transform (AI Agents), and AI Matching. But each product was built as a semi-independent module with its own data ingestion pipeline, its own entity model, and its own navigation. Integrating an ERP for Close does not set up the integration for Reporting. Entity selections do not persist reliably across product boundaries. Navigation between products involves full page transitions and context loss. CEO Mike Whitmire acknowledged: "We've ended up in a bad spot of like the combo of vertical and horizontal nav and kind of just messy stuff."

**Enterprise scaling strain.** Customers with 37+ entities and multiple workflows struggle with template management and cross-entity operations. The platform carries 570+ legacy feature flags accumulated over nearly a decade. Performance degrades with high-volume datasets and complex database queries.

### The Competitive Landscape Is Shifting

FloQast is not operating in a vacuum. The competitive terrain has changed materially:

**Numeric** is the most aggressive threat, claiming that 40% of their customers are FloQast replacements. Numeric was built task-centric from day one — no folder legacy, no architectural debt. Churning customers cite better AI features (contextual flux explanations), faster data loading (NetSuite transactions load "almost instantly" vs. 1+ minutes in FloQast), automatic account detection, cross-entity reconciliation flexibility, and real-time mid-month monitoring. Numeric's pricing is aggressive — similar or lower cost with more features included.

**BlackLine** is abandoning the mid-market to focus on enterprise, creating upmarket opportunity for FloQast. But BlackLine's Verity AI platform and consolidation capabilities remain threats in the enterprise segment where FloQast aims to expand.

**Workday Financial Close Management** bundles basic reconciliation, checklist, intercompany, and close dashboards with its ERP — often positioned as "free" to existing Workday customers. When the close management tool comes bundled with the ERP you already own, the bar for a standalone product rises dramatically.

The pattern is clear: competitors built on modern architectures are outpacing FloQast's ability to innovate, and the folder-centric data model is the primary constraint.

---

## 2. The Insight: Tasks, Not Folders

The rearchitecture does not begin with a technology decision. It begins with a realization about how accountants actually think.

Accountants do not think in folders. They think in tasks:

- "What do I need to do today?"
- "What's blocking me from completing this reconciliation?"
- "Am I on track to close on time?"
- "Which items still need my review?"

Every checklist item, every reconciliation, every compliance task, every ad-hoc project is fundamentally a **task** with context: who owns it, when it's due, what data it needs, what the status is, who needs to review it, and what happened last month.

The folder is an implementation detail. It was never the user's mental model — it was the system's mental model, inherited from the physical binder and the cloud storage directory. Accountants adopted it because FloQast gave them no alternative. But when you watch an accountant work, they are not browsing a folder tree for discovery. They are executing a known list of tasks, in a known sequence, with known dependencies. The folder is the friction between them and their work.

This insight was validated repeatedly during the Project Catalyst research:

- **Tim Gibson (Close Product Lead)** articulated the need for an "inbox-zero" experience where preparers see only their 10-15 items for today — not a database view of everything in the system.
- **Carlos Avila (Head of Close Engineering)** defined the core concept simply: a task is "person + date + status." Everything else is context.
- **Mike Whitmire (CEO)** pointed to NetSuite's approach as inspiration — powerful global search that masks navigation complexity — and described the long-term vision as "the IDE for Accountants."
- **Greg Jones (Design Director)** stated directly: "Global search must replace navigation bloat."

The "IDE for Accountants" metaphor is instructive. Software developers use Integrated Development Environments that aggregate code, tests, documentation, debugging tools, version control, and AI assistance in one place. They do not navigate folder hierarchies to find their work — they search, they use task lists, they rely on intelligent context. Accountants deserve the same: a unified workspace where every task surfaces the complete context needed to execute, review, and close.

---

## 3. The Vision: The Super Task

The centerpiece of the rearchitecture is the elevation of the checklist item from a row in a grid to a **rich container** — what we call the **Super Task**.

Today, a checklist item is a thin record: a name, a preparer, a reviewer, a due date, a sign-off timestamp, and a link to a folder where supporting files might live. To actually complete the task, the accountant must navigate away — to the reconciliation page, to the review notes panel, to the cloud storage folder, to the ERP for balances, to the compliance module for SOX tagging.

The Super Task inverts this model. Every task becomes a self-contained workspace that aggregates:

- **Sub-tasks** — Discrete steps within the business SOP (e.g., a Bank Reconciliation task contains "Import transactions," "Match transactions," "Review exceptions," "Sign off")
- **Documents** — Attached workpapers, invoices, screenshots, with evidence captured as a byproduct of work
- **Transactions** — GL balances, individual transaction lines, matched and unmatched items, all flowing from the ERP through a normalized data layer
- **Review notes** — Full conversation history with threaded replies, integrated with Slack and Teams
- **Dependencies** — Explicit links to upstream and downstream tasks, with event-driven status propagation
- **AI agents** — Background processes that have already prepared data, matched transactions, flagged anomalies, or generated draft entries before the human arrives
- **Audit trail** — Complete history of every action, sign-off, revision, and agent execution for compliance

### The 5-Second Rule, Realized

With the Super Task, the "5-Second Rule" becomes achievable. Within five seconds of opening any task, the user sees:

- The current status and what action is needed
- The relevant balances and transaction data
- What the AI agent has already completed
- Any open review notes or blockers
- The dependency chain and its status

No navigation. No context switching. No "let me go check the folder." The task *is* the workspace.

### Three Paradigm Shifts

The Super Task is the manifestation of three fundamental shifts in how FloQast operates:

#### Shift 1: From Folder Navigation to Search-First Discovery

Today, finding a task means knowing the entity, the period, and the folder. Tomorrow, users type what they need:

- "Deferred Revenue rec for Q4" — direct result
- "All items assigned to Sarah that are overdue" — filtered view
- "Bank reconciliation with unmatched transactions > $10,000" — contextual search

Global search with faceted filtering replaces the folder tree as the primary navigation mechanism. Saved searches and bookmarked views replace memorized folder paths. The folder structure can still exist as one organizational lens among many — alongside tags, process groups, assignee views, status filters, and AI-suggested priority ordering — but it is no longer the only way in.

#### Shift 2: From Static Checklists to Event-Driven Workflows

Today, checklist items are static rows. Completion depends on a human clicking "sign off." Dependencies are manual traffic-light indicators that someone must remember to update.

Tomorrow, tasks are reactive. When the ERP data refreshes, the relevant task's balance updates automatically. When an upstream dependency completes, the downstream task transitions from "blocked" to "ready." When an AI agent finishes matching transactions, the task's progress bar advances and the preparer receives a notification. When a review note is resolved, the reviewer's queue updates in real time.

This is powered by an event-driven workflow engine that replaces the current static rule-based routing. Dependencies become first-class objects with defined trigger conditions — not manual checkboxes. Tim Gibson's vision of "Git Flow"-style transparent dependency visualization becomes possible, providing the audit trail that compliance requires while enabling the automation that efficiency demands.

#### Shift 3: From Manual Execution to AI-Augmented Close

Today, AI in FloQast exists in isolated pockets: AI Matching for transaction reconciliation, Transform agents for data manipulation, Checkmate for checklist generation, FloQL for analytics queries. These are five separate AI services with different providers (OpenAI and AWS Bedrock), different languages (Node.js and Python), and separate deployment patterns. There is no unified orchestration layer.

Tomorrow, AI is invisible. Following Chris Sluty's "spam filter philosophy" — the best AI requires zero behavior change and delivers massive benefit — agents work silently throughout the month. They import GL data, match transactions, flag anomalies, draft journal entries, and pre-populate review summaries. When the preparer opens their task on close day, the routine work is already done. The human's role shifts from execution to review and judgment.

The key principle: agents prepare, humans decide. Every agent action is logged with a confidence score. High-confidence outputs (99%+ match accuracy on recurring items) proceed automatically. Lower-confidence items are surfaced for human review with full context on why the agent flagged them. Hard ROI metrics — hours saved, fields transformed, matches completed — are displayed directly in the UI, not hidden in a backend report.

---

## 4. What This Means for Each Audience

### For Preparers (Staff Accountants)

The staff accountant's daily experience transforms from "navigate folders to find my work" to "open my inbox and start executing."

**The "inbox zero" experience.** A unified task list shows only the 10-15 items that need attention today, sorted by priority: overdue items first, then items due today, then items that are ready because a dependency just completed. No scrolling through hundreds of rows in a grid. No filtering by entity and folder to find the three tasks that matter. The system knows what you own and surfaces it.

**AI agents as your prep team.** For a bank reconciliation task, before the preparer arrives on close day:
- The GL balance has refreshed from the ERP automatically
- The AI matching agent has processed 200 transaction lines, matching 185 with 99.4% confidence
- The remaining 15 unmatched items are flagged with suggested matches and reasons for exception
- The preparer opens the task, reviews the 15 exceptions, resolves them, and signs off

What used to take two hours takes twenty minutes. The preparer's skill is applied where it matters — judgment on exceptions — not where it is wasted — mechanical matching of routine items.

**One drill-down view with everything.** The Super Task contains the GL balance, the transaction detail, the agent's work history, the review notes from last month, the attached workpapers, and the dependency status. Everything needed to complete the task is in one place. The accountant never leaves the task view.

### For Reviewers (Senior Accountants)

**Unified review queue across all products.** Today, a reviewer checks the Close checklist for items awaiting review, then switches to Reconciliations, then to Compliance. Three products, three navigation flows, three sets of context. Tomorrow, a single review queue surfaces every item awaiting their approval — regardless of which product generated it — with full context embedded.

**Full context without navigation.** When a reviewer opens an item, they see the preparer's work, the agent's contribution (with confidence scores), the supporting documentation, the transaction detail, and the complete review note history. The reviewer can approve, reject with notes, or request additional evidence without leaving the task view.

**Agent confidence scores focus review time.** Not all items require the same level of scrutiny. The system surfaces confidence indicators: a bank reconciliation where the AI matched 100% of transactions at 99%+ confidence needs a quick scan. A revenue recognition task where the agent flagged three unusual accruals needs deep review. The reviewer's limited time is directed toward the items where human judgment adds the most value.

### For Managers (Controllers)

**Gantt-style timeline with real-time bottleneck identification.** The Close Timeline view shows the entire close process organized by accounting work stream (Cash, AR, AP, Inventory, Revenue, Intercompany) with real-time completion status. When a work stream falls behind, the timeline highlights the bottleneck — not just that it is late, but specifically which tasks and which assignees are blocking progress.

**Period-over-period trending.** "Are we faster than January?" is answered visually. The Compare Mode overlays current close progress against the prior period (or any historical period), showing where the team is ahead, where it is behind, and where new tasks have been added. This leverages FloQast's unique advantage: close processes are recurring, predictable, and comparable.

**AI recommendations for resource reallocation.** When the Deferred Revenue work stream is running two days behind because a key preparer is overloaded, the system recommends reallocation: "Move 3 items from Sarah (12 items, 2 overdue) to Michael (6 items, all on track)." The manager approves or adjusts. The reassignment cascades through the workflow engine, updating notifications and review queues automatically.

### For Executives (VP Finance / Directors)

**Cross-entity health dashboard with roll-up metrics.** A single view shows close progress across all 37 entities, all workflows, all work streams. Color-coded status indicators (on track, at risk, behind) aggregate upward from individual tasks through work streams through entities to the enterprise level.

**AI hours saved, quantified per close cycle.** Every agent action is tracked. The executive dashboard displays: "AI agents completed 1,247 sub-tasks this close cycle, saving an estimated 312 hours of manual work." This is not aspirational — it is derived from actual agent execution logs and historical task duration data. The ROI case for FloQast writes itself at renewal time.

**Predictive close date estimation.** Based on current velocity, historical patterns, and outstanding work, the system projects: "At current pace, all entities will close by Day 7. Entity 14 (EMEA) is at risk of extending to Day 9 due to 4 blocked reconciliations." The executive acts on leading indicators, not lagging ones.

### For Admins

**Template and entity management without folder fragility.** Templates are no longer coupled to folder names. They are defined against task definitions, process groups, and tags — identifiers that are stable, versionable, and independent of organizational structure. Renaming a process group does not break historical periods. Adding a new entity does not require replicating an exact folder hierarchy.

**Permissions based on roles and relationships, not folder access.** ReBAC (Relationship-Based Access Control) decouples permissions from the folder tree entirely. Access is defined by the relationship between the user and the object: "Sarah can prepare any task tagged 'Cash' in the US entities" or "Michael can review any reconciliation assigned to his direct reports." This is enterprise-grade access control that scales with organizational complexity — not folder-level gating inherited from desktop file sync.

**Self-service configuration that does not break existing workflows.** Admins can add entities, modify templates, restructure process groups, and adjust permissions without fear of cascading failures. The system validates changes and previews their impact before applying them.

---

## 5. The 8 Architecture Principles

The rearchitecture is guided by eight principles, each derived from specific deficiencies documented in the current state analysis and validated against the competitive landscape.

### Principle 1: Checklist Item as Master Object

The `procedures` MongoDB collection — representing checklist items — is already the most accessed data entity in Close, touched by nearly every service (Checklist, Items, Replication, Bulk Edit, Workflow Analytics, and indirectly by Review Notes and Recs). The rearchitecture formalizes this centrality by elevating the checklist item into the Super Task: a rich container with sub-tasks, dependencies, documents, transactions, review notes, agent execution history, and audit trail. The item is no longer a row — it is the atomic unit of work in the platform.

**How it manifests:** A new Task Service owns the Super Task lifecycle. Sub-tasks are first-class entities with their own status, assignee, and agent assignment. The drill-down view (designed in Project Catalyst) surfaces the complete task context in a single full-screen view.

### Principle 2: Eliminate Folder Coupling

The `folders` collection's triple duty (organization, permissioning, storage sync) is decoupled into independent concerns. Organization is handled by **tags, process groups, and saved views** — flexible, user-defined groupings that provide the visual context accountants value without the rigidity of a fixed hierarchy. Permissioning migrates to ReBAC. Storage references become direct document links, independent of folder path.

**How it manifests:** Users can view their tasks grouped by process area, by assignee, by status, by due date, by entity, or by any combination — without the system enforcing a single folder-based hierarchy. Folders can persist as one view option for customers who prefer them, but they are no longer the structural foundation.

### Principle 3: Transactions as Atomic Units

Transactions are the fundamental data units of accounting. The Reporting team has already rearchitected around this principle. Close adopts it by establishing a **transaction-task bridge**: all transactions for a given account within a period aggregate under the parent task for that account's reconciliation. A bank reconciliation task does not merely display a summary balance — it contains every transaction line, matched and unmatched, with source traceability back to the ERP.

**How it manifests:** The FloLake Silver Layer normalizes transaction data from all ERP sources. The Task Service's transaction view surfaces this data within the Super Task. Transaction-level anomalies detected by AI agents are linked to specific tasks for human review.

### Principle 4: Universal Ingestion via FloLake Silver Layer

Today, each ERP integration is a custom pipeline — `fq-gl-netsuite`, `fq-gl-ms-dynamics`, `fq-gl-sap`, and others — each with its own data format, refresh cadence, and failure modes. The FloLake Silver Layer creates a **single normalized data foundation** that powers all modules. Connect an ERP once, and Close, Reporting, Compliance, and Reconciliations all receive the data.

**How it manifests:** New ERP integrations are onboarded at the Silver Layer. Product teams consume a standardized schema. The FDM (Financial Data Model) service — already operational in Reporting — provides the shared dimension taxonomy that bridges Close and Reporting. SFTP-dependent implementations are progressively migrated to API-first ingestion.

### Principle 5: Native Calculation Engine

FloQast's origin as an Excel-companion tool means that reconciliation logic currently lives *outside* the application in customer-owned spreadsheets via the `#FQ Anchor Point` system. This creates brittle dependencies on external files, limits calculation capabilities to what Excel provides, and leaves the audit trail vulnerable to external file modifications.

**How it manifests:** An embedded calculation capability within the task view enables accountants to perform reconciliation work, amortization schedules, and variance analysis inside FloQast. This is Mike Whitmire's "IDE for Accountants" vision — a workspace with spreadsheet-grade calculation power where work happens natively, producing audit evidence as a byproduct. Excel transitions from "working file" to "output file."

### Principle 6: Event-Driven Workflow Engine

The current architecture relies on static rule-based routing and manual dependency tracking. Period roll-forward is handled by a 12+ Lambda replication system that copies structure forward on a monthly cron. Dependencies between tasks are manual traffic-light indicators with no automatic propagation.

**How it manifests:** A rules engine replaces static routing. Tasks react to events: an ERP data refresh triggers balance updates on affected tasks; completion of an upstream dependency transitions downstream tasks from "blocked" to "ready"; an AI agent completing a sub-task fires a notification to the preparer. The workflow engine supports self-service delegation (preparers can reassign during PTO without admin intervention), conditional automation (if variance < materiality threshold, auto-approve), and transparent audit logging of every state transition.

### Principle 7: Search-First Navigation

The current navigation requires users to know the exact location of their work within a folder hierarchy. Global search becomes the primary entry point for finding any object in the system — tasks, reconciliations, accounts, entities, documents, review notes — with faceted filtering by status, assignee, entity, period, tags, and keywords.

**How it manifests:** Project Catalyst has designed the search UX: a prominent search toolbar at the top of every page, with search results showing top matches, filtered views, recent searches, and AI-assisted natural language queries ("Show me all overdue reconciliations in EMEA entities"). Implementation begins with checklist items and compliance items, expanding to the full platform over two to three quarters. Saved searches replace bookmarked folder paths.

### Principle 8: Invisible AI

Five distinct AI services currently exist in the Close platform — AI Matching, FloQL Backend, Monitors Agent, Remind Language Processor, and Checkmate — with different providers (OpenAI, AWS Bedrock), different languages (Node.js, Python), and no unified orchestration layer. The rearchitecture introduces a coherent AI strategy aligned with Chris Sluty's "spam filter philosophy": the best AI requires zero behavior change.

**How it manifests:** A unified AI orchestration layer coordinates agent execution across the platform. Agents are assigned to sub-tasks within the Super Task and execute autonomously on schedule or in response to events. Agent work products are visible within the task view with confidence scores. Humans retain full oversight and approval authority. Hard ROI metrics (hours saved, matches completed, anomalies detected) are surfaced in the executive dashboard. Conversational AI is reserved for complex, context-rich queries — not forced onto routine operations.

---

## 6. How We Get There

### The Strangler Fig Pattern

The rearchitecture does not require a big-bang migration. FloQast has 3,500+ customers depending on the platform for their monthly close — there is no scenario where the system goes offline for a rebuild. Instead, the approach follows the **strangler fig pattern**: new services are built alongside existing ones, new capabilities are delivered through new interfaces, and traffic migrates gradually as confidence grows.

This is not theoretical. The pattern is already in practice:

- The **Checklist ECS migration** is moving the core item Lambda to ECS (`apps/close_checklist`) with a phased route migration plan, feature-flag toggles, and ALB routing splits. New REST conventions (`/checklist/v1/items`) are being established alongside legacy Lambda routes.
- The **Review Notes service** is actively migrating from Lambda to ECS.
- The **Reporting team** has already completed their migration to ECS, established Snowflake schema-per-tenant isolation, and implemented the FloLake SNS/SQS event-driven sync pattern.

The rearchitecture extends this pattern: the Task Service stands up alongside the existing `procedures` collection, reads from the same data store initially, and progressively takes over as the primary interface. Customers see new capabilities appearing — search, drill-down views, unified inbox — without losing existing functionality.

### Feature Flags Control Rollout

The migration from Harness feature flags (currently 570+ accumulated flags) to a modern feature management system enables segmented rollout. New capabilities are enabled per customer, per entity, or per user role. Small and medium customers adopt first. Enterprise customers with hundreds of users get extended migration windows with dedicated support.

Precedent exists: the previous navigation change was deployed via opt-in over 6+ months with a 60-70% adoption target before mandatory rollout. The rearchitecture follows the same playbook — beta validation, user interviews, qualitative feedback, progressive adoption.

### The 6-Quarter Roadmap

| Quarter | Focus | Key Deliverable |
|---------|-------|-----------------|
| **Q1** | Search Infrastructure | Backend search service, indexing pipeline for checklist items and reconciliations, global search UI (Project Catalyst) |
| **Q2** | Task Service MVP | Super Task data model, drill-down view, sub-task framework, unified inbox for preparers |
| **Q3** | Workflow Engine | Event-driven dependency propagation, automated status transitions, self-service delegation, PTO reassignment |
| **Q4** | Transaction Bridge | FloLake Silver Layer integration with Task Service, transaction-level data within Super Tasks, unified Reporting-Close data foundation |
| **Q5** | AI Orchestration | Unified agent framework, sub-task agent assignment, confidence scoring, ROI metrics dashboard, background execution scheduling |
| **Q6** | Full Vision | Native calculation engine, ReBAC rollout decoupling permissions from folders, advanced timeline/Gantt with AI recommendations, "IDE for Accountants" workspace |

Each quarter delivers standalone value. No quarter depends on a future quarter to be useful. Customers benefit progressively.

---

## 7. Why Now

Four forces converge to make this the right moment for the transformation.

### The Competitive Window Is Open — But Closing

Numeric is purpose-built on a task-centric architecture with no folder legacy. They claim 40% of their customers are FloQast replacements. Their product loads NetSuite data almost instantly (vs. FloQast's 1+ minute delays), detects new accounts automatically, and offers real-time mid-month monitoring. They are aggressively priced and gaining ground in FloQast's core market segment.

Today, Numeric is still small and their product has documented weaknesses — misleading dashboards, frustrating lead sheet maintenance, limitations that have caused some customers to regret switching. But every quarter that FloQast delays architectural modernization, Numeric matures. The window to leapfrog a greenfield competitor with a superior but architecturally limited product is measured in quarters, not years.

### The Technical Foundation Is Ready

The rearchitecture is not starting from zero. Critical infrastructure is already in flight:

- **ECS Migration** — The Checklist, Review Notes, and Workflow Analytics services are actively migrating from Lambda to ECS, establishing the containerized service architecture that the Task Service will build on. New REST conventions and API versioning are being established now.
- **FloLake Silver Layer** — The universal data ingestion initiative provides the normalized ERP data foundation. The Reporting team's FDM service has already proven the pattern.
- **GAuth (Global Authentication)** — The pending ADR for a unified authentication architecture across 173+ services provides the identity and authorization infrastructure needed for ReBAC.
- **Service Design Standards** — Mark Thomas's Service Design Specification template, adopted across Reporting, Compliance, and Close, ensures architectural consistency as new services stand up.
- **Snowflake Gold Layer** — The Close analytics data model (star schema with `fact_close_item_status`, dimensional tables) is designed and versioned, providing the foundation for the executive dashboards and period-over-period comparison features.

These are not proposals. They are active engineering workstreams. The rearchitecture leverages them rather than duplicating them.

### Project Catalyst Provides the UX Framework

Project Catalyst — the UX redesign initiative led by the Product Design team — has already designed the surface layer of the transformation: the left navigation with section-based organization (User, Applications, Products), the global search bar with AI-assisted queries, the unified task inbox, the full-screen drill-down view, and the Close Timeline with period-over-period comparison. Interactive Figma prototypes exist. Stakeholder reviews are complete. The FQGO Spring 2026 showcase is locked.

Catalyst is the vision; the rearchitecture is the foundation that makes the vision technically viable. The UX designs are ready to be built. What they need is the backend architecture to support them: search infrastructure, a task data model, event-driven workflow, and a unified data layer.

### AI Maturity Has Reached the Threshold

Two years ago, "invisible AI" was aspirational. Today, FloQast already runs five AI services in production: AI Matching generates Python code for transaction reconciliation with hardened security controls (network-isolated VPC, restricted runtime, 10GB memory allocation). Transform agents automate deterministic data manipulation trained by example. FloQL translates natural language to analytical queries against Snowflake. Monitors detect mid-month anomalies.

What is missing is not AI capability — it is orchestration. The five services operate independently with no unified coordination. The rearchitecture introduces the orchestration layer that transforms isolated AI features into a coherent "invisible AI" experience: agents assigned to sub-tasks within the Super Task, executing autonomously, surfacing results with confidence scores, and displaying hard ROI metrics.

### Customer Demand Is Documented and Consistent

Across 3,500+ customers, across Slack support channels, customer scoping feedback (25 documented sources), enterprise lighthouse program interviews (14 documented sources), and competitive churn analysis, one theme recurs: **"I can't find what I need."**

Customers cannot find tasks without knowing the folder structure. They cannot see all their work in one place. They cannot get context without navigating between products. They cannot reorganize their close structure without risking template breakage. They cannot review items across products in a unified queue. They cannot answer "are we on track?" without manually aggregating data across entities.

These are not edge cases. They are the daily experience of the platform's core users. The demand for a task-centric, search-first, context-rich experience is not a hypothesis — it is documented signal from the people who use FloQast every close cycle.

---

## 8. The Stakes

### If We Succeed

FloQast becomes the definitive accounting operations platform — not just close management, but the **IDE for Accountants** that makes every other tool feel like a file cabinet.

The Super Task model creates a moat that competitors cannot easily replicate. It is not a feature — it is an architecture. Numeric may have built task-centric from day one, but they do not have 3,500+ customers' worth of close process data, historical patterns, and operational intelligence to power AI agents. BlackLine has enterprise relationships, but they are not building for the mid-market. Workday bundles basic close tools with its ERP, but cannot match the depth of a platform purpose-built for accounting close.

The transformation unlocks product capabilities that are impossible on the current architecture:
- Cross-product unified experiences (Close + Reconciliations + Compliance in one workflow)
- AI-augmented close that gets smarter every cycle from historical data
- Enterprise-grade scalability with flexible permissions, multi-entity management, and self-service configuration
- Predictive analytics that move controllers from reactive to proactive
- "Always ready" close methodology where agents prepare continuously so period-end becomes a review exercise, not a fire drill

Every new customer onboarded onto the task-centric architecture reinforces the platform's intelligence. Every close cycle completed generates training data for AI agents. The flywheel accelerates.

### If We Don't

Incremental improvements preserve existing customers in the near term but fail to close the gap with purpose-built competitors. The folder architecture remains a ceiling on every feature the team tries to build:

- Search cannot be truly powerful because the data model is organized around folders, not tasks.
- AI orchestration cannot be unified because there is no coherent task model to attach agents to.
- Cross-product experiences remain fragmented because each product maintains its own data pipeline and entity model.
- Enterprise customers continue to struggle with template fragility, permission limitations, and scaling pain.
- Engineering velocity remains constrained by the dual codebase, the 570+ feature flags, and the deep folder coupling across 7+ services.

The competitive dynamic tilts steadily against FloQast. Numeric matures. Workday improves its bundled offering. New entrants build on modern architectures without legacy constraints. FloQast's 10-year head start in customer relationships — its most valuable asset — erodes as customers encounter increasingly capable alternatives that do not carry a decade of architectural debt.

The choice is not between building and not building. It is between building now — while the competitive window is open, the technical foundation is ready, the UX vision is designed, and the AI capabilities have matured — or building later, when the cost is higher, the competition is stronger, and the opportunity window has narrowed.

---

## Appendix: Source Attribution

This narrative draws from the following research compiled during the FloQast Close Rearchitecture investigation (February 2026):

- **Leadership Interviews:** Mike Whitmire (CEO), Chris Sluty (CPO), Carlos Avila (Sr Dir, Engineering), Tim Gibson (Close Product Lead), Greg Jones (Sr Dir, Product Design), Joe Ryan (SVP, Product), Steve Raeder (Dir, Product Management)
- **Technical Architecture:** Confluence C4 Level 2 documentation (12 service architecture documents by Sam Hall, Feb 25, 2026), Close Gold Layer Data Model (Mide Seni, Feb 26, 2026), GAuth ADR (Kristopher Morris, Feb 25, 2026), Service Design Specification Template (Mark Thomas, Jan 8, 2026)
- **Customer Signal:** Scoping Feedback (25 documented sources), Lighthouse Customer Program (14 enterprise customer interviews), Slack support channels (#product-talk, #support-general, #competitors, #sme-platform)
- **Competitive Intelligence:** Numeric churn analysis, BlackLine displacement tracking, Workday competitive positioning (via #competitors Slack channel and Gong recordings)
- **Product Strategy:** 6-pager strategy documents for Close Automation, Close Optimization, Compliance, Integrations, Transform, and Reporting business units
- **Project Catalyst:** UX design prototypes, stakeholder review notes, and 178K characters of transcripts from Close Reimagining sessions (Dec 2025 - Feb 2026)
