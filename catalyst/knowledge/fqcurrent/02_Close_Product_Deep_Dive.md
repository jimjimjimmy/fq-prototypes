# FloQast Close: Deep Product Architecture & Pain Point Analysis

**Source:** Close Architecture NotebookLM (7 Gong demo recordings), Project Catalyst NotebookLM (co-founder & leadership conversations)
**Date:** February 27, 2026
**Status:** Research Compilation — Living Document

---

## 1. How FloQast Close Works Today

### 1.1 The Organizational Hierarchy

FloQast Close is built on a four-level hierarchy: **Entity → Period → Folder → Checklist Item/Reconciliation**.

**Entities** sit at the top. While traditionally representing legal entities or subsidiaries, entities are used flexibly — some customers organize by business process area, shared service capacity, location, or individual client (for managed service providers). Each entity has its own distinct, customizable folder structure and setup. Entities serve as the primary filter for dashboarding, giving controllers quick visibility into how specific units are tracking against close deadlines.

**Periods** segment all work across monthly, quarterly, or annual cycles. FloQast automatically rolls the close structure forward from period to period — when one period begins, the system replicates the folder hierarchy, checklist assignments, and applicable reconciliation files into the next period without manual intervention.

**Folders** represent specific business process areas or account groupings, typically following a balance sheet approach (Accounts Payable, Accounts Receivable, Deferred Revenue, PP&E, etc.). The Folders view is the primary day-to-day workspace for staff and senior accountants. Clicking into a specific folder for a given period presents a unified screen with all checklist items, supporting documents, and reconciliations for that process. Critically, the folder structure mirrors the organization's cloud storage environment (SharePoint, OneDrive, Google Drive, Box, Dropbox) via API integration — documents in FloQast are live links to files in the shared drive.

**Checklist Items** are the actionable tasks required to close the books — booking journal entries, running reports, performing reconciliations. Each item has:

- Preparer and reviewer assignments with customizable due dates (calendar or business days, adjusted for holidays)
- Evidence attachment (screenshots, invoices, workpapers)
- Digital timestamp sign-offs for both preparer and reviewer (audit trail)
- Review notes with Slack/Teams integration (replies sync back into FloQast)
- Compliance tagging (SOX controls linkage — sign-off evidence flows to compliance module)
- Intra-task dependencies (specific tasks must complete before others can be signed off)

### 1.2 The Reconciliation System

Reconciliations are the most architecturally complex area of Close. The system has three layers:

**GL Balance Integration:** FloQast pulls ending trial balance data directly from the ERP via API or SFTP. This data populates a "Per TB" column in the reconciliation view. The integration can refresh on configurable cadences — daily, hourly, or every 15 minutes during critical close periods.

**The #FQ Anchor Point System:** For Excel-based reconciliations, users type a plain text identifier into their existing Excel workbooks (e.g., `#FQ-1253` for GL account 1253). FloQast scans the linked cloud storage file, locates the hashtag, and pulls the adjacent ending balance into the "Reconciled Balance" column. This powers two internal controls:

- **Preventative control:** If the ERP balance and Excel reconciled balance don't match within a materiality threshold, the sign-off button is suspended.
- **Detective control:** If a late adjusting JE alters the ERP balance or someone modifies the Excel file after sign-off, the reconciliation is flagged as "Redo," sign-offs are revoked, and the preparer/reviewer are notified.

**AI Transaction Matching:** For high-volume accounts (bank accounts, credit cards, clearing accounts), FloQast offers AI-powered line-by-line matching. Data flows in through bank integrations (Trovata, BAI2 files), API connections, or manual CSV/Excel uploads. The accountant performs sample matches, the AI identifies patterns (reference IDs, dates, amounts), and generates a matching rule in plain English. The user can modify the rule (e.g., expand the date window from 1 to 3 days for weekend timing). FloQast generates Python code behind the scenes to execute the logic across the full dataset.

### 1.3 Views & Navigation

**Overview Dashboard:** Landing page with tiles representing different workflows (month-end close, FP&A, tax, AP). Shows real-time progress tracking — actual completion percentage vs. expected target based on due dates.

**Timeline View:** Calendar-based visualization showing what's due on each day across all entities, flagging late items immediately.

**Folders View:** The granular, process-focused workspace. The most-used view for staff accountants.

**Global Checklist / Global Reconciliations:** Cross-entity views for managers. Supports filtering by tags (high-risk, troublemaker, CFO review), status (Late, Ready for Review, Redo), assignee, and entity.

**Analytics Module:** Tracks historical KPIs — Days to Close, bottleneck identification (recurring late items, overloaded team members), workload allocation, review note volume.

### 1.4 Workflow & Automation Features

**Amortization Schedules:** Auto-generate straight-line amortization schedules. Limited to simple schedules — cannot handle complex variable schedules like ASC 842/IFRS 16 lease accounting.

**Transform (AI Agents):** Deterministic agents that automate repetitive data manipulation tasks — PO accruals, data formatting, field mapping. Agents are trained by example (the user does a sample, AI generates the rule). Agents generate Python code and are execution-deterministic, not probabilistic. Data input is via SFTP, API, or manual CSV upload.

**Journal Entry Management (JEM):** Generates journal entries from automated calculations. Currently in beta for certain ERPs. The "copy-paste gap" is a major pain point — JEM generates entries, but users must manually export and paste into the ERP. Bi-directional API post-back is aspirational.

---

## 2. Deficiencies Identified from Demo Recordings

### 2.1 The Excel Dependency Problem

FloQast's competitive origin story — "we work with your existing Excel workbooks" — has become an architectural liability. The #FQ anchor tag system, while elegant for adoption, creates:

- **Brittle data architecture:** Reconciliation logic lives *outside* the application in customer-owned spreadsheets. If an accountant breaks a formula, alters a synced file, or changes a folder path, it triggers "Redo" status and forces manual resubmission.
- **External tampering vulnerability:** The audit trail is only as strong as the cloud storage permissions. FloQast can lock files to read-only after sign-off, but the pre-sign-off period is vulnerable.
- **Limited calculation capability:** Complex accounting models (lease accounting, variable amortization) must stay in Excel because FloQast's native tools can't handle them.

### 2.2 The Copy-Paste Gap

When FloQast automates a calculation (amortization, AI agent output, JEM entry), the result cannot be automatically posted back to the ERP. Users must:
1. Export the FloQast output
2. Open the ERP
3. Manually paste/import the data
4. Wait for the ERP to refresh
5. Wait for FloQast to re-pull the updated TB

This breaks the automation promise. For Dynamics 365 specifically, prospects noted that FloQast's JE output format doesn't match D365's required multi-segment account string format — forcing users to maintain a separate "pre-formulated schedule" in Excel to rearrange columns.

### 2.3 Rigid Workflow Routing

- **No dynamic reviewer selection:** Preparers cannot select a specific reviewer from a dropdown. Entries go to a pool of permissioned users; the team self-regulates who reviews.
- **PTO is an admin problem:** When an accountant goes on PTO, an admin must alter workflow rules to reassign tasks. Users cannot self-delegate.
- **Template inheritance doesn't exist:** If a firm improves a close template, pushing that update to existing clients/entities cannot be done globally — it must be manually updated client-by-client.

### 2.4 Data Pipeline Gaps

- **Manual CSV uploads for AI features:** If no pre-built connector exists, prospects must manually export CSVs from external systems (Stripe, Ramp, credit card portals) and upload to FloQast for AI matching or agent processing.
- **Cloud storage requirement:** The #FQ anchor system requires cloud storage. On-premise network drive customers cannot integrate without migrating to the cloud.
- **Missing integrations:** No Odoo integration. Ramp integration doesn't share PO information. Budget data requires manual upload only.

### 2.5 Prospect Pushbacks (from Demo Recordings)

- **ERP feature overlap:** Prospects question paying for FloQast modules their ERP already handles (D365 fixed asset depreciation, Odoo bank matching). This delays purchasing.
- **Low-volume ROI:** Small firms (fractional CFOs, <100 invoices/year) see the product as overkill over a well-configured ERP.
- **AI agent rigidity:** In highly acquisitive companies where cost centers and entities shift constantly, deterministic agents break and require constant rebuilding.

### 2.6 Competitive Benchmarks from Demos

- **BlackLine:** Legacy gold standard. Most familiar to prospects for close management and reconciliations.
- **Trintech (Cadency):** Enterprise competitor. Pulls GL ending balances natively via API (vs. FloQast's anchor system).
- **OneStream:** Used for consolidations and reconciliations. Slow and clunky for high-volume recs but established in enterprise.
- **AuditBoard/Workiva:** Primary competitors FloQast's compliance module must displace.

---

## 3. Leadership Vision for Rearchitecture

### 3.1 Mike Whitmire (Co-Founder/CEO)

**Core thesis:** The folder structure is not sacred and can be eliminated. Excel should transition from "working file" to "output file." Documents should be considered audit evidence, not where work happens.

**Navigation:** Admires NetSuite's approach — powerful global search masks navigation complexity. Users should be able to type a query and instantly reach any object in the system.

**AI philosophy (the "Spam Filter"):** The ideal AI integration runs in the background, requires zero behavior change, and delivers massive value. No chatbot-first interactions for basic tasks.

**The "IDE for Accountants":** Envisions FloQast becoming like "Replit for accounting" — a blank, configurable spreadsheet UI with an adjacent AI assistant where users build and execute custom accounting templates *inside* FloQast, eliminating the need to leave the platform.

**Continuous Close reality check:** "The continuous close is sort of dumb" — accountants need period-end cutoffs. But agents should silently prepare data throughout the month so that when period-end hits, everything is already buttoned up.

### 3.2 Chris Sluty (Co-Founder/CRO)

**Visual context as differentiator:** Providing visual context for accountants will be FloQast's biggest competitive advantage against raw AI models and competitors.

**The Salesforce Lightning analogy:** Compares the rearchitecture to Salesforce's Lightning overhaul — a fundamental UI modernization that preserved core value while enabling a new generation of capabilities.

**AI must show ROI:** Hard metrics (hours saved, fields transformed) should be surfaced directly in the UI. AI can't be a black box.

### 3.3 Carlos Avila (Head of Close Engineering/Product)

**Engineering velocity is the bottleneck:** The legacy architecture slows engineers and frustrates them. Maintaining fringe features (ad-hoc projects, legacy to-do lists) costs excessive money and degrades performance.

**Drill-down Object View is the lowest-effort, highest-impact win:** Aggregating all context (review notes, documents, sub-tasks, dependencies) into a single immersive view for a checklist item is the quickest tactical improvement.

**The "5-Second Rule":** Users should be able to identify their next best action within 5 seconds of landing on any page. The current grid fails this test.

### 3.4 Tim Gibson (Close Product Lead)

**Opinionated Task Inbox:** The platform needs an "inbox-zero" experience where preparers see only their 10-15 items for today, highlighting what's late, due, or blocked. Strip away generic database views.

**Period selector friction:** Users should not have to constantly toggle periods when switching between preparer and reviewer roles across products.

**Event-driven dependencies:** Manual traffic light indicators must evolve into event-driven milestones. Agents should act as both preparer and reviewer, completing tasks only when dependency conditions are met. Must be visualized transparently ("Git Flow" style) for audit purposes.

### 3.5 Greg Jones (Design Director)

**UX as competitive advantage:** The rearchitecture is an opportunity to turn FloQast's UX into a competitive moat. Don't bolt AI onto an outdated framework — build native UI components that serve as the execution layer for automation.

**Global search must replace navigation bloat:** The current multi-layered vertical/horizontal navigation exists because search is inadequate.

---

## 4. Emerging Architecture Principles

Based on the combined inputs from demos, leadership conversations, and product strategy, the following architectural principles emerge:

1. **The Checklist Item becomes the Master Object.** Elevate from a row in a grid to a rich container that aggregates sub-tasks, dependencies, documents, review notes, AI agents, and transaction data. Think of it as the "super task" that represents a complete business SOP.

2. **Eliminate the folder as an organizing primitive.** Replace with tags, groups, or dynamic views that provide the visual context accountants value without the rigidity, permissioning limitations, and template fragility of the current folder system.

3. **Transactions become the atomic data unit.** Align with Reporting's rearchitecture — transactions flow into the system, get mapped to accounts and periods, and aggregate under tasks. This creates the bridge between Close and Reporting.

4. **Build a universal data ingestion layer.** Replace per-product, per-ERP custom integrations with a shared, normalized data foundation (the "FloLake Silver Layer" concept).

5. **Native calculation engine replaces Excel dependency.** An embedded spreadsheet-like interface ("IDE for Accountants") where work happens inside FloQast, producing audit evidence as a byproduct.

6. **Event-driven workflow engine.** Replace static rule-based routing with a dynamic state machine that supports dependency-triggered automation, self-service delegation, and transparent audit trails.

7. **Search-first navigation.** Powerful global search as the primary navigation mechanism, complemented by opinionated inbox views for preparers and command center dashboards for managers.

8. **Invisible AI.** Background agents that prepare, validate, and flag — requiring zero behavior change. Surface hard ROI metrics. Reserve conversational AI for complex, context-rich queries.

---

## 5. Key Questions Still Open

1. **What is the actual Close database schema?** We need ERDs showing how entities, folders, checklist items, reconciliations, review notes, dependencies, templates, and permissions relate at the data level.

2. **How does the Reporting team's transaction architecture work in detail?** What is the schema? How do FDM and Report Builder relate? Can it serve as the foundation for Close?

3. **What are the migration constraints?** 3,500+ existing customers. What can be evolved gradually vs. what requires a hard cutover?

4. **What is the real engineering cost of maintaining the dual codebase** (checklist-client vs. close-client-v2)?

5. **How do competitors handle the working-file-to-audit-evidence transition?** Numeric, Trintech, and BlackLine all have different approaches.

6. **What does the ReBAC (Relationship-Based Access Control) work look like?** This is scheduled for 2026 and directly impacts whether permissioning can be decoupled from folders.
