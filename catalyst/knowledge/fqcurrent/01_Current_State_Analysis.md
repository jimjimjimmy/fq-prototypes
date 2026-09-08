# FloQast Close Rearchitecture: Current State Analysis

**Project:** FloQast Close Rearchitecture Investigation
**Author:** Benjamin Ellis, Product Design Manager
**Date:** February 27, 2026
**Status:** Initial Research Compilation — Living Document

---

## Executive Summary

FloQast has grown from a focused month-end close management tool into a multi-product platform spanning Close, Reconciliations, Compliance, Reporting, Automation (Transform), and AI capabilities. This growth — accumulated over 10+ years — has created significant architectural debt: siloed features, a legacy folder-based data model, fragmented navigation, and disconnected product experiences that prevent FloQast from delivering on its promise of becoming an integrated Accounting Transformation Platform (ATP).

This document compiles findings from internal leadership conversations (co-founders Mike Whitmire and Chris Sluty, Close leaders Carlos Avila and Tim Gibson, and design/product leadership), product strategy documents, customer feedback, competitive intelligence, and engineering discussions to map the current state of the platform and identify specific deficiencies that a rearchitecture should address.

---

## 1. Core Architectural Deficiencies

### 1.1 The Legacy Folder Structure

The folder system is the foundational organizing principle of FloQast Close, but it was designed for an era when the product was essentially a "cloud file sync" tool for Excel workbooks. Its limitations are now a major impediment to scalability and user productivity.

**How it works today:**
The hierarchy follows Entity → Year → Month → Process Folder. This structure gives FloQast its ability to filter and sort Checklist items and GL Reconciliations, and it serves as the primary permissioning vehicle. Reconciliation files are anchored within process folders using the #FQ Anchor Point system.

**Key problems identified:**

- **Permissioning tied to folders, not tasks or roles:** Folder-level permissioning was built for desktop file syncing (like Box or SharePoint). It does not support modern enterprise role-based access control needs. Multiple customers have raised the need for more granular RBAC within entities (see Slack discussion about ReBAC work scheduled for 2026).

- **Template fragility:** When customers reorganize folders (e.g., merging two folders), the template system can break items. Templates are "timeless" — they don't correspond to a specific period. When applied, they match by folder name. If a folder is renamed or merged, applying the template to an older period can inadvertently delete items. (Source: support discussion about UConn Health folder merge)

- **Entity creation failures:** The tight coupling of entities to folder structures in the database leads to "broken entity" errors when folder creation fails, requiring manual database intervention. (Source: support thread about Aquarian Holdings entity creation error)

- **Inflexible visual architecture:** While the folder structure provides visual context that accountants value (organizing tasks by process area), it imposes a rigid hierarchy that doesn't support cross-cutting views, tag-based organization, or dynamic grouping.

- **Co-founder perspective (Mike Whitmire):** The folder structure is "not a sacred cow" and can be eliminated, provided the "visual context" that accountants rely on is maintained. The key insight is that Excel should transition from being the "working file" to an "output file."

### 1.2 The Checklist Table ("Grid Page")

The checklist table is the most-used page in FloQast — it's where accountants spend the majority of their time. Yet it is widely acknowledged internally as a significant UX and architectural bottleneck.

**Key problems identified:**

- **Poor information density:** The grid flattens all data and forces horizontal scrolling. Internal stakeholders describe it as a page that "hurts my eyeballs." It fails what has been internally termed the "5-Second Rule" — users cannot glean their next best action within 5 seconds of landing on the page.

- **Context switching between silos:** Users cannot fully work within the checklist because related work (reconciliations, review notes, attachments, dependencies) lives in different product areas. The checklist links users elsewhere rather than aggregating context in one place. As noted in Project Catalyst: "Users are not fully working on the checklist table all the time because they would want to go to maybe a reconciliation, they want to go to the review notes and that links them elsewhere."

- **Clunky identifier system:** Checklist items rely on "entity period folder" naming identifiers rather than scalable, linkable ID anchors, making programmatic navigation and cross-referencing cumbersome.

- **Inconsistent behavior between views:** There are ongoing defects where functionality works on the Checklist page but not on the Folders page (or vice versa), because the two views are maintained in separate client codebases (checklist-client vs. close-client-v2). This is a direct result of the dual-view architecture.

- **Limited customizability:** Enterprise customers need the ability to choose which columns are visible, customize sorting/grouping (by dependencies, tags, assignee), and apply saved views. The current grid offers none of this.

### 1.3 Siloed Product Experiences

FloQast's products (Close, Reconciliations, Compliance, Reporting, Transform, AI Matching) were built as semi-independent modules. This creates several compounding problems:

- **Duplicate setup work:** Customers must undergo separate configurations for each module. Integrating an ERP for Close doesn't automatically set up the integration for Reporting or Compliance.

- **No shared data model:** Each product area has its own data ingestion pipeline and entity model. The Reporting team has recently rearchitected around the "transaction as the atomic entity," but this is not shared with Close or Compliance.

- **Fragmented navigation:** Co-founder Mike acknowledged: "We've ended up in a bad spot of like the combo of vertical and horizontal nav and kind of just messy stuff." Navigation between products involves full page transitions and context loss (entity selections don't persist reliably across product boundaries — see Slack discussion about entity switching defect).

- **Perception as point solutions:** The lack of cohesion makes FloQast look like a collection of disjointed tools. The Compliance module is perceived as SOX-specific rather than a broad GRC platform. Reporting and Close don't share dimensions or data foundations.

### 1.4 Integration & Data Architecture Fragmentation

- **ERP-by-ERP integration approach:** Each ERP integration is built as a custom pipeline, leading to inconsistent data formats, redundant logic, and long onboarding timelines.

- **No unified data layer:** The product strategy documents reference the "FloLake Silver Layer" initiative as the answer — a centralized, normalized data foundation. But this is still aspirational. Currently, if a customer connects NetSuite for Close, Reporting may need a separate mapping exercise.

- **SFTP dependency:** Many implementations still rely on manual SFTP file transfers, creating significant onboarding friction and delayed time-to-value.

- **Budget data isolation:** Budget data for variance analysis can currently only be brought in via upload — there is no integration path.

---

## 2. Leadership Vision & Strategic Direction

### 2.1 Co-Founder Perspectives (Mike Whitmire & Chris Sluty)

**On product simplification:**
Mike is clear that the accumulated navigation complexity and fragmented product experiences must be cleaned up. The folder structure can be replaced if visual context is preserved. The platform needs to evolve from Excel-as-working-file to Excel-as-output.

**On continuous close:**
Mike's perspective is pragmatic: "The continuous close is sort of dumb" as a marketing concept, because accountants need hard period-end cutoffs. However, the underlying principle — pre-preparing steps continuously via background automation so that when month-end hits, everything is already green — is powerful. The vision is not "always reviewing" but "always ready."

**On AI:**
Chris's "spam filter philosophy" is the guiding principle: the best AI is invisible AI that requires zero behavior change and delivers massive benefit. The platform should avoid "AI for the sake of AI" (forcing chat-bot interactions for basic tasks). Instead, AI should seamlessly clean data, highlight anomalies, generate templates, and orchestrate workflows in the background. Hard ROI metrics (hours saved, fields transformed) should be surfaced in the UI.

### 2.2 Close Leadership Perspectives (Carlos Avila & Tim Gibson, via Greg Jones)

**Core challenge:** The Close team is maintaining a legacy architecture while trying to build for the future. Engineering velocity is slowed by maintaining fringe features (disjointed to-do lists, ad hoc projects) and managing two parallel client codebases.

**Strategic priority:** Focus on the highest-traffic pages where 99.99% of users live. The grid page and drill-down experience are the #1 priority. The approach must be phased — cannot reimagine everything at once, and must balance the needs of 3,500+ existing customers against building for the next generation.

**Enterprise scaling concern:** Lean teams of 30 accountants will eagerly adopt new workflows, but enterprise customers with hundreds of users may see major UI overhauls as retraining risks.

### 2.3 Product Strategy Themes (from 6-Pager Documents)

Five strategic pillars are emerging across all business units:

1. **Centralize data ingestion** ("FloLake Silver Layer" / shared Data APIs) — eliminate redundant setup by creating a single normalized data foundation that powers all modules.

2. **Unlock enterprise-grade functionality** — custom fields, bulk actions, advanced RBAC, multi-entity/multi-currency support, audit logging.

3. **Embed AI that takes action, not just surfaces insights** — Transform evolving into the orchestration engine, JEM Copilot suggesting journal entries, AI Variance Rule Builder, AI-powered internal audit testing.

4. **Drive cross-platform cohesion** — Reporting as the control system for Close and Compliance, Transform's APIs enabling other products to plug in.

5. **Accelerate time-to-value** — self-service tools, AI-assisted setup, cutting agent creation from 36 hours to under 5 hours.

---

## 3. Competitive Pressure

### 3.1 Numeric

Numeric is the most aggressive competitor, claiming 40% of their customers are FloQast replacements. Key competitive advantages cited by churning customers:

- **Better AI features:** Customers can prompt AI and provide files as context for flux explanations. FloQast's AI explanations are seen as less useful.
- **Faster data loading:** NetSuite transactions load "almost instantly" vs. 1+ minutes in FloQast.
- **Automatic account detection:** New accounts appear in reconciliations instantly vs. manual addition in FloQast.
- **Cross-entity reconciliation flexibility:** One file can serve recs for accounts across multiple entities.
- **Real-time monitoring:** "Monitors" feature catches issues mid-month rather than during close.
- **More flexible reporting:** Seen as more flexible than native ERP reporting.
- **Aggressive pricing:** Coming in at similar or lower cost with more features included.

Notably, some customers who churned to Numeric have regretted the switch — Numeric's dashboarding shows combined rec/task completion percentages that mislead leadership about close progress, and their lead sheet maintenance is described as "extremely annoying."

### 3.2 BlackLine

BlackLine is abandoning the mid-market to focus on enterprise, creating an opportunity for FloQast upmarket. FloQast has been setting records for "BlackLine rips." However, BlackLine's Verity AI platform and their consolidation capabilities remain competitive threats in the enterprise segment.

### 3.3 Workday Financial Close Management

Workday offers basic reconciliation, checklist, intercompany, and close dashboards bundled with their ERP. Often positioned as "free" to existing Workday customers.

---

## 4. Customer Pain Points (from Slack & Support Channels)

### 4.1 Folder & Navigation Issues
- Navigating between product areas (Folders → Checklist → Recs) causes context loss, folder tree collapse, and entity switching bugs.
- Folder structures cannot be easily reorganized without risking template breakage.
- Adding folders requires navigating away from the context where the need was identified.

### 4.2 Reconciliation Workflow
- Reconciliation balance refresh is unreliable — balances sometimes don't pull from workbooks without manual refresh, even with nightly refresh cycles.
- 1GB+ reconciliation workbooks cannot be uploaded (hard limit), requiring customers to split files.
- Account number sorting within reconciliation listings doesn't follow numerical order.
- No unified view of reconciliation status across All Workflows.

### 4.3 Checklist & Task Management
- Strict folder locking behavior is inconsistent — some customers can lock folders with incomplete checklist items.
- Checklist items and reconciliations have different completion status indicators (green checkmarks vs. incomplete), creating confusion.
- No ability to delete signed-off checklist items without admin override, raising control deficiency concerns.

### 4.4 Enterprise Scalability
- Large customers (37+ entities, multiple workflows) struggle with template management and cross-entity operations.
- 570+ legacy feature flags accumulated over nearly a decade, now requiring a major migration effort.
- Performance degrades with high-volume datasets and complex database queries.

---

## 5. The Rearchitecture Opportunity

### 5.1 Task-Centric Architecture (Proposed Direction)

The current proposal is to evolve the Checklist Item into a "super task" that contains the complete business SOP with discrete subtasks (e.g., a Bank Reconciliation checklist item would contain sub-tasks like "Import transactions," "Match transactions," "Review exceptions," "Sign off"). This would:

- Enable granular automation of individual sub-tasks.
- Provide clear progress tracking at both the task and sub-task level.
- Allow AI agents to own and complete specific sub-tasks.
- Create a foundation for the "always ready" close methodology.

### 5.2 Transaction-Task Alignment

The Reporting team's rearchitecture around transactions as the atomic entity creates a natural connection point. If Close tasks are aligned to discrete periods, Reporting transactions can be connected to specific tasks — for example, all transactions for a bank account within a period would aggregate under the parent task for that bank account's reconciliation.

### 5.3 Database Simplification

The overarching thesis is that FloQast carries unnecessary complexity in its data model due to 10+ years of incremental feature additions. A rearchitecture could simplify the foundational entities (potentially from folders → tasks → transactions) to create a more connected system with fewer abstractions.

---

## 6. Information Gaps & Next Steps

### 6.1 Key Information Needed

1. **Current database schema documentation** — What are the actual entities, relationships, and constraints in the Close database today? How do folders, checklist items, reconciliations, review notes, and dependencies relate at the data level?

2. **Reporting team's transaction architecture** — Detailed documentation on how the Reporting BU rearchitected around transactions. What is the "Silver Layer" schema? How do FDM and Report Builder work architecturally? (Reference: Thien Le's architecture walkthrough recordings in Google Drive)

3. **Project Atlas NotebookLM content** — I notice there's no "Project Atlas" notebook in your NotebookLM. Could you share this or confirm its location?

4. **Close Architecture notebook deep dive** — The Close Architecture notebook has 7 Gong recordings (product demos). These could provide insight into how the product is currently positioned and where the UX breaks down. I was unable to query this notebook due to timeouts but should retry.

5. **Customer journey mapping** — How do different user personas (Controller, Senior Accountant, Staff Accountant, Auditor) actually flow through the product today? Where are the handoff points between products?

6. **Lighthouse customer feedback** — The Lighthouse Customer Program notebook has 14 sources of enterprise customer feedback. This likely contains critical signal about scaling pain points.

7. **AWS architecture diagram** — An infrastructure architecture diagram was published (referenced in Slack). Understanding the service topology would help assess rearchitecture feasibility.

8. **Mark Thomas's service design template** — Engineering leadership published a service design template being used across Reporting, Compliance, and Close teams. This could reveal the architectural patterns being adopted.

9. **Feature flag audit** — The 570+ legacy feature flag audit would reveal the scope of accumulated complexity and conditional behavior in the codebase.

10. **Gong product demo recordings** — Access to recent product demos would help identify where the current UX creates friction in real customer/prospect interactions.

### 6.2 Recommended Next Research Steps

1. Deep dive into the Close Architecture and Lighthouse notebooks when NotebookLM is more responsive.
2. Review the Reporting architecture walkthrough recordings.
3. Map the current entity-relationship model of the Close database.
4. Analyze Gong recordings for UX friction points in demos.
5. Interview engineering leads about the current service architecture and migration constraints.
6. Conduct a competitive UX teardown of Numeric's product.

---

## Source Index

### NotebookLM Projects Referenced
- **Project Catalyst** (8156a6a9) — 11 sources including co-founder recordings, Close reimagining call notes, design team info
- **Close Architecture** (5ce56ea0) — 7 Gong demo recordings
- **FloQast Product Strategy On-site** (51d4516f) — 6-pager strategy documents for Close Automation, Close Optimization, Compliance, Integrations, Transform, Reporting
- **Scoping Feedback** (222d5619) — 25 sources of customer scoping feedback
- **Lighthouse Customer Program** (ccf3a97b) — 14 sources of enterprise customer feedback

### Slack Channels Referenced
- #product-talk — Product discussions, feature requests, bug reports
- #support-general — Customer support escalations revealing product limitations
- #competitors — Competitive intelligence (Numeric, BlackLine, Workday)
- #sme-platform — Platform engineering defects and architecture issues
- #eng-tech-discussion — Service design templates, feature flag migration
- #rd-all — Company-wide R&D updates, GTM summaries
- #close-product-feedback — Close-specific product feedback pipeline
- #design-bar — Design team discussions about Close reimagining
- #reporting-engineering — Reporting BU architecture walkthroughs
