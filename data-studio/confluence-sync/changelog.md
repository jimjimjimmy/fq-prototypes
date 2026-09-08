# PRD Sync Changelog

Tracks changes detected in Confluence PRD pages synced to NotebookLM notebooks.

---

## 2026-07-10 14:34 — Natasha Clark — Added 6 New Pages (User Access Control, Event Contract, RBAC, Accounting Config, SAP S/4HANA, SAP ECC)
- **User Access Control - Options and Comparison Concerns** (page 4678844434) — added to Data Studio PRDs
  - Alex Kearns. Strategic companion to the Detect User Access Control mechanics page. Compares three access control approaches (Option 1: FQ Entities, Option 2: New FQ Workspace, Option 3: Combination) and frames this as a platform-wide decision — GL Transactions are consumed by Close AI Matching, Reporting FDM, AI Variance, Transform, and Detect, so any access primitive change affects all of them. Related to IDEA-2628. 11,386 chars.
- **Data Studio: Event Contract (Q3 2026)** (page 4674978092) — added to Data Studio PRDs
  - Alex Kearns. Defines the standard event contract DS publishes through FloQast's Scheduling Service for downstream consumers (Transform, Report Builder). Key events: DATA_PROCESSING, DATA_AVAILABLE, DATA_FAILED — correlated by Run ID. Enables Transform agents to run against fresh data and exposes breaking changes (schema/mapping rule changes) proactively instead of at runtime. IDEA-2628. 21,697 chars.
- **RBAC Support for DP2.0 APIs (Q3 2026)** (page 4663181551) — added to Data Studio PRDs
  - Alex Kearns. Q3 blocker for Detect GA. DP 2.0 APIs currently return data for all entities within a TLC regardless of the requesting user's access — a compliance risk. This PRD requires APIs to read the authorized entity list from the JWT and apply it as a default filter, with an optional entity ID filter param for narrowing. No Platform RBAC service call needed — entity access is already in the JWT. IDEA-2906. 13,792 chars.
- **Accounting Config Attributes in Models (Q3 2026)** (page 4653613342) — added to Data Studio PRDs
  - Alex Kearns. Supersedes Q2 draft (prd-accounting-config.md). Extends accounting config to 4 parseable source dataset-level attributes (accounting period, period mode, subledger name, folder name), adds Excel reference cell as a supported parsing source, and makes all parsed attributes fully available in mapping expressions including CASE_WHEN. Enables branching mapping logic (e.g., "if subledger is AP, map this way"). IDEA-2630. 19,969 chars.
- **SAP S/4HANA Private Cloud — Data Studio Connector Sub-PRD** (page 4665180233) — added to Data Studio PRDs
  - Rebecca Beasley-Cockroft. Prebuilt connector for SAP S/4HANA Private Cloud via SFTP. Uses ACDOCA as the universal journal (distinct from ECC's BKPF/BSEG/FAGLFLEXT tables). Zero file configuration required — naming conventions pre-established with ActionFI. Auto-configures models, mappings, and dimensions at connection setup. Designer TBD. IDEA-2792. 25,296 chars.
- **SAP ECC — Data Studio Connector Sub-PRD** (page 4665049179) — added to Data Studio PRDs
  - Rebecca Beasley-Cockroft. Prebuilt connector for SAP ECC via SFTP. Formalizes the previously manual Engineering-dependent setup into a standardized repeatable path. Auto-configures models, mappings, and dimensions. Distinct from S/4HANA (different SAP data tables). Designer TBD. IDEA-2791. 23,644 chars.
- **Data Access** (page 4678615160) — tracked for change detection only; page currently empty (12 chars), skipped for NLM
  - Alex Kearns. Placeholder page — will be picked up on the next sync once content is added.
- All adds targeted the Data Studio PRDs notebook
- Local snapshots created, config.json updated (119 → 126 tracked pages)

---

## 2026-07-10 14:24 — Natasha Clark — Synced 3 Pages (Versioning, Data Explorer, Entity Mapping v2)
- **Versioning (Q3 2026)** (page 4644307106) — updated by Alex Kearns (Jun 29)
  - Q3 replacement for the old prd-4-versioning-lifecycle.md (Q2 draft). Introduces non-destructive publish with forward-looking effective dates — admins set an effective date on publish and historical data is preserved. Open dependency (OQ-6): whether teardown is suppressed on publish or whether rehydration (currently SFTP-only) is what achieves non-destructive behavior — this affects Q3 deliverability. Related sub-PRDs: Logging & Audit Q3, Error Patterns Q3.
  - Source deleted and re-added in NotebookLM (Data Studio PRDs)
  - Local snapshot updated
- **Data Explorer (Q3 2026)** (page 4633067751) — updated by Alex Kearns (Jul 9)
  - Significant update: page has been substantially expanded (grew from earlier thin draft to 27,924 chars). Renamed from "Data Preview" to "Data Explorer" to resolve semantic overlap with the Data Test tab. Q3 scope locked: last-successful-run viewer with filterable/sortable grid, no version selector. Q4 follow-on deferred: version selector, archived version audit, dimension-linked column resolution, sensitive column masking.
  - Source deleted and re-added in NotebookLM (Data Studio PRDs)
  - Local snapshot updated
- **Entity Mapping (v2)** (page 4600561831) — updated by Alex Kearns (Jul 1)
  - Two significant additions on Jul 1: (1) Consolidation Entities — layered tagging for roll-up targets, where records need both leaf entity and Consolidation Entity tags for downstream queries (EM10); (2) reference-table entity resolution — for sources like NetSuite's Subsidiary table where entity is encoded on a separate reference table joined against fact records (EM11). CAS customer constraint also clarified: CAS datasets must be single-entity per record by definition.
  - Source deleted and re-added in NotebookLM (Data Studio PRDs)
  - Local snapshot updated
- 64 pages unchanged

---

## 2026-06-24 12:54 — Natasha Clark — Added 2 New Pages (Transform Integration, Sample File Upload)
- **Transform Integration with Data Platform (Q3 2026)** (page 4651450379) — added to Data Studio PRDs
  - Alex Kearns. PRD covering how Transform connects into the Data Platform in Q3 2026, likely addressing DP2.0 integration points for the transformation pipeline. 16,907 chars of content.
- **Sample File Upload (Q3 2026)** (page 4649451573) — added to Data Studio PRDs
  - Alex Kearns. PRD for the Sample File Upload feature in Q3 2026, covering file-based data ingestion flow for connector setup. 13,280 chars of content.
- All added as file sources to NotebookLM (Data Studio PRDs)
- Local snapshots created, config.json updated (117 → 119 tracked pages)

## 2026-06-17 16:04 — Natasha Clark — Added 2 New Pages (Extend Tables CDC, Versioning Q3 2026)
- **Extend Tables in CDC Connectors (Q3 2026)** (page 4642865771) — added to Data Studio PRDs
  - Alex Kearns. PRD for extending table support within CDC connectors, Q3 2026 scope. 14,818 chars of content.
- **Versioning (Q3 2026)** (page 4644307106) — tracked for change detection; page currently empty (0 chars), skipped for NLM
  - Alex Kearns. Created today — likely a placeholder. Will be picked up on the next check once content is added.
- All adds targeted the Data Studio PRDs notebook
- Local snapshots created, config.json updated (115 → 117 tracked pages)

---

## 2026-06-16 18:15 — Natasha Clark — Added 29 New Pages (Q3/Q4 2026 Feature PRDs, JEM, SAP, CDC, Global Dimensions)
- **Custom Data Models (Q3 2026)** (page 4640407556) — added to Data Studio PRDs
- **Transform using DP2.0 (Q3 2026)** (page 4632739923) — tracked for change detection; page currently empty, skipped for NLM
- **Logging & Audit (Q3 2026)** (page 4624515155) — added to Data Studio PRDs
- **Customer Facing Logging Adjustments (Q3 2026)** (page 4624613420) — added to Data Studio PRDs
- **Entity Mapping (Q3 2026)** (page 4619829339) — added to Data Studio PRDs
- **Data Explorer (Q3 2026)** (page 4633067751) — added to Data Studio PRDs
- **Data Explorer (Q4 2026 Enhancements)** (page 4633362841) — added to Data Studio PRDs
- **Dimensions View (Q3 2026)** (page 4626776226) — added to Data Studio PRDs
- **Usability Enhancement (Q3 2026)** (page 4626317445) — added to Data Studio PRDs
- **Logging, Versioning, Notifications & Warnings (Q3 2026)** (page 4624547926) — added to Data Studio PRDs
- **Notifications (Q3 2026)** (page 4625072135) — added to Data Studio PRDs
- **Versioning & Lifecycle of Models (Q3 2026)** (page 4624646370) — added to Data Studio PRDs
- **AI Field Mapping Editor** (page 4619763787) — added to Data Studio PRDs
- **Unmapped Entity Identification** (page 4619731022) — added to Data Studio PRDs
- **Hierarchical Data Model Support** (page 4596039687) — added to Data Studio PRDs
- **PRD: Entity Scope Grouping** (page 4594303031) — added to Data Studio PRDs
- **PRD: Field Tooltips on Mapping Page** (page 4589224242) — added to Data Studio PRDs
- **PRD: Model Groups** (page 4589453417) — added to Data Studio PRDs
- **Global Dimensions — Dimensions Tab PRD** (page 4562714769) — added to Data Studio PRDs
- **SAP Integrations — Master PRD (DRAFT)** (page 4643192911) — added to Data Studio PRDs
- **Master PRD: Data Studio — JEM Master Data Support** (page 4591517938) — added to Data Studio PRDs
- **PRD: Source Data Management Tab (File-Based Connections)** (page 4585980069) — added to Data Studio PRDs
- **Data Studio: JEM Support Requirements Outline** (page 4587520322) — added to Data Studio PRDs
- **Intacct Sub-PRD 1 — Connection Management** (page 4594073712) — added to Data Studio PRDs
- **CDC Sub-PRD 1 — Connection Setup & Configuration** (page 4568547394) — added to Data Studio PRDs
- **Sub-PRD 1 — Connection Management** (page 4575166527) — added to Data Studio PRDs
- **Bank Transaction Data Model (DRAFT)** (page 4577298150) — added to Data Studio PRDs
- **DP2.0 Models** (page 4576739512) — tracked for change detection; page currently empty, skipped for NLM
- **CDC Connector Framework** (page 4568875091) — added to Data Studio PRDs
- 27 pages added as file sources to NotebookLM (Data Studio PRDs); 2 empty pages tracked only
- Local snapshots created for all 29 pages, config.json updated (86 → 115 total tracked pages)

---

## 2026-06-16 17:00 — Natasha Clark — Replaced 2 Tombstone Sources, Added 2 Missing Pages
- **Field Mapping - AI Assisted Transformation Functions** (page 4490559489) — removed from tracking and NLM; page is a tombstone redirect
- **Model Creation 2 of 4: Field Mapping** (page 4449927443) — removed from tracking and NLM; page is a tombstone redirect
- **Model Creation 2b of 4: AI-Assisted Mapping Rules** (page 4594892801) — added as replacement; source added to NotebookLM (Data Studio PRDs), snapshot created, added to config.json
- **Companies endpoint** (page 4500947063) — was tracked but not in NLM; source added to NotebookLM (Data Studio PRDs)
- config.json updated: 87 → 86 tracked pages

---

## 2026-06-16 16:57 — Natasha Clark — Synced 4 Pages (Entity Mapping, Error Patterns, Data Preview, SFTP)
- **Entity Mapping (v2)** (page 4600561831) — updated by Alex Kearns (Jun 15)
  - Content updated since Jun 1 snapshot; large page (125k chars)
  - Source deleted and re-added in NotebookLM (Data Studio PRDs)
  - Local snapshot updated
- **Data Studio: Platform Features — Error Patterns & Handling (DRAFT)** (page 4507173269) — updated by Alex Kearns (Jun 5)
  - Content updated since Apr 21 snapshot
  - Source deleted and re-added in NotebookLM (Data Studio PRDs)
  - Local snapshot updated
- **Model Creation — Data Preview Tab (DRAFT)** (page 4449632496) — updated by Alex Kearns (Jun 3)
  - Content updated since Apr 21 snapshot; page now notes it is superseded by Data Explorer page
  - Source deleted and re-added in NotebookLM (Data Studio PRDs)
  - Local snapshot updated
- **SFTP Multi File Handling + Global Dimension** (page 4500947136) — updated by Alex Kearns (Apr 27)
  - Content updated since Apr 21 snapshot
  - Source deleted and re-added in NotebookLM (Data Studio PRDs)
  - Local snapshot updated
- **Companies endpoint** (page 4500947063) — updated by Rebecca Beasley-Cockroft (Apr 21) — snapshot updated, no matching NotebookLM source found (page was tracked but never synced to notebook)
- **Field Mapping - AI Assisted Transformation Functions (DRAFT)** (page 4490559489) — tombstone updated by Alex Kearns (May 19) — snapshot updated to reflect redirect notice; NotebookLM source pending review
- **Model Creation 2 of 4: Field Mapping (DRAFT)** (page 4449927443) — tombstone updated by Alex Kearns (May 19) — snapshot updated to reflect redirect notice; NotebookLM source pending review
- **Note:** Pages 4490559489 and 4449927443 are now tombstone redirects pointing to *Model Creation 2b of 4: AI-Assisted Mapping Rules* (page 4594892801). Their old NotebookLM sources were left in place pending decision to remove them and add the replacement page.
- 80 pages unchanged

---

## 2026-06-04 3:16 PM CT — Natasha Clark — Added 1 New Page (Test Mapping Expressions Q3 2026)
- **Test Mapping Expressions (Q3 2026)** (page 4622778629) — added to Data Studio PRDs; authored by Alex Kearns; Q3 sub-PRD for testing field mapping expressions before model publish, deferred from an earlier release; IDEA-2627
- Added as file source to NotebookLM
- Local snapshot created, config.json updated (87 total tracked pages)

---

## 2026-06-01 2:55 PM CT — Natasha Clark — Added 6 New Pages (additional Data Studio PRDs)
- **Logging & Error Handling Requirements** (page 4606590983) — added to Data Studio PRDs
- **Source File and Model Edit Lifecycle PRD** (page 4604264674) — added to Data Studio PRDs
- **API Connection Management: Push API, AI Setup & Source Expansion** (page 4601020433) — added to Data Studio PRDs
- **Entity Mapping (v2)** (page 4600561831) — added to Data Studio PRDs; authored by Alex Kearns
- **Foreign Key Alignment Warning — PRD** (page 4600528949) — added to Data Studio PRDs
- **Data Studio Customer Onboarding — Q3 2026 PRD** (page 4600397974) — added to Data Studio PRDs
- All other pages authored by Rebecca Beasley-Cockroft
- All added as file sources to NotebookLM
- Local snapshots created, config.json updated (86 total tracked pages)

## 2026-06-01 2:48 PM CT — Natasha Clark — Added 8 New Pages (Intacct Sub-PRDs 2–8 + NetSuite Sub-PRD 8)
- **Intacct Sub-PRD 2 — Entity Management** (page 4600103051) — added to Data Studio PRDs
- **Intacct Sub-PRD 3 — Auto-Setup & Standard Mapping** (page 4600496148) — added to Data Studio PRDs
- **Intacct Sub-PRD 4 — Mapping Configuration** (page 4600791177) — added to Data Studio PRDs
- **Intacct Sub-PRD 5 — Scheduling** (page 4600529015) — added to Data Studio PRDs
- **Intacct Sub-PRD 6 — Notifications & Logging** (page 4600824036) — added to Data Studio PRDs
- **Intacct Sub-PRD 7 — Additional Endpoint Configuration** (page 4607279135) — added to Data Studio PRDs
- **Intacct Sub-PRD 8 — Legacy Migration** (page 4606885925) — added to Data Studio PRDs
- **Sub-PRD 8: Legacy Migration — NetSuite Direct API** (page 4606722077) — added to Data Studio PRDs; completes the NetSuite Sub-PRD suite (was a placeholder in Master PRD)
- All authored by Rebecca Beasley-Cockroft
- All added as text/file sources to NotebookLM
- Local snapshots created, config.json updated (80 total tracked pages)

## 2026-06-01 2:45 PM CT — Natasha Clark — Synced 2 Pages (Intacct + NetSuite Master PRDs)
- **Intacct Direct API — Master PRD** (page 4593582175) — updated by Rebecca Beasley-Cockroft
  - Added IDEA link (IDEA-2620) to the front-matter metadata table
  - Source deleted and re-added in NotebookLM (Data Studio PRDs)
  - Local snapshot updated
- **NetSuite Direct API — Master PRD** (page 4575461451) — updated by Rebecca Beasley-Cockroft
  - Added Idea link (IDEA-2623) to the front-matter metadata table
  - Source deleted and re-added in NotebookLM (Data Studio PRDs)
  - Local snapshot updated
- 70 pages unchanged

## 2026-05-21 4:55 PM CT — Natasha Clark — Added 2 New Pages (Intacct & NetSuite Direct API Master PRDs)
- **NetSuite Direct API — Master PRD** (page 4575461451) — added to Data Studio PRDs; parent/index for the NetSuite Direct API Sub-PRD suite (Sub-PRDs 2–7 already tracked), covers objective, key benefits, use cases, success metrics, milestones, scope, and REQ-01–09
- **Intacct Direct API — Master PRD** (page 4593582175) — added to Data Studio PRDs; parent/index for the new Intacct Direct API Sub-PRD suite (XML-based API, two-step session token auth, locations/books/multi-currency, legacy migration), covers objective, key benefits, use cases, success metrics, milestones, scope, and REQ-01–09
- Both authored by Rebecca Beasley-Cockroft
- All added as text sources to NotebookLM
- Local snapshots created, config.json updated (72 total tracked pages)

## 2026-05-12 5:48 PM CT — Natasha Clark — Added 3 New Pages (NetSuite Direct API Sub-PRDs 5 detail, 6, 7)
- **Sub-PRD 5 (Detail) — Scheduling & On-Demand Refresh (NetSuite Direct API)** (page 4575887400) — added to Data Studio PRDs; child page of tracked Sub-PRD 5 (4581523546), covers incremental/full sync logic, missed run handling, rate limiting, and on-demand refresh detail
- **Sub-PRD 6 — Notifications & Logging (NetSuite Direct API)** (page 4583850074) — added to Data Studio PRDs; covers machine-to-machine notifications, error email patterns, job log schema, and NS-specific data change count extension
- **Sub-PRD 7 — Additional Endpoint Configuration (NetSuite Direct API)** (page 4584013971) — added to Data Studio PRDs; covers standard endpoint auto-provisioning, Accounts/Balances SOAP operations, dimensional config, endpoint library, and lifecycle management
- All added as text sources to NotebookLM
- Local snapshots created, config.json updated (70 total tracked pages)

## 2026-05-11 3:41 PM CT — Natasha Clark — Added 4 New Pages (NetSuite Direct API Sub-PRDs)
- **Sub-PRD 2 — Entity Management (NetSuite Direct API)** (page 4577068106) — added to Data Studio PRDs
- **Sub-PRD 3 — Auto-Setup & Standard Mapping (NetSuite Direct API)** (page 4580245790) — added to Data Studio PRDs
- **Sub-PRD 4 — Mapping Configuration (NetSuite Direct API)** (page 4575821882) — added to Data Studio PRDs
- **Sub-PRD 5 — Scheduling (NetSuite Direct API)** (page 4581523546) — added to Data Studio PRDs
- All added as text sources to NotebookLM
- Local snapshots created, config.json updated (67 total tracked pages)

## 2026-05-04 — Natasha Clark — Consolidated Two Notebooks into One (Data Studio PRDs)
- Created new NotebookLM notebook "Data Studio PRDs" (ID: ae917453-c037-4d8b-adb5-cb59deaf5242)
- Added 56 sources from local snapshots (7 pages skipped — empty stubs with no content)
- Old notebooks archived (not deleted):
  - Q2 Data Studio PRDs (Connections & Endpoints) — ID: 4378e386-1efb-4928-9d0a-92d30dcce5c6
  - Q2 Data Studio PRDs (Models & Platform Features) — ID: 3192528f-c3db-4567-a095-99caa6c9fe16
- Reason: NotebookLM Plus account confirmed at 300-source limit; two-notebook split was unnecessary
- Updated config.json, all four sync skills, and data-studio/CLAUDE.md


## 2026-04-28 — Natasha Clark — Added 2 New Pages (Retry Logic, Connector Status Reference)
- **Retry Logic** (page 4564516868) — added to Connections & Endpoints
  - New sub-PRD by Rebecca Beasley-Cockroft. Defines Data Studio's retry behavior for API ingestion failures: 3 strategies (Exponential Backoff with Jitter, Fixed Interval, No Retry), error type handling (retryable vs non-retryable), Retry-After header override, nested endpoint short-circuit behavior. REQ-01 through REQ-06.
- **Connector Status Reference** (page 4564287500) — added to Connections & Endpoints
  - New companion PRD to Connection Lifecycle Management by Rebecca Beasley-Cockroft. Defines all 7 connection statuses (Draft, Pending, Active, Warning, Error, Auth Expired, Archived), rollup rules from endpoint health, full state transition table, blocked transitions, auto-recovery behavior. REQ-01 through REQ-07.
- Both added as text sources to NotebookLM (Connections & Endpoints)
- Local snapshots created, config.json updated (64 total tracked pages)

## 2026-04-22 4:35 PM CT — Natasha Clark — Synced 1 Page (SL Transactions endpoint)
- **SL Transactions endpoint** (page 4500717796) — updated by Rebecca Beasley-Cockroft
  - Subsequent edit by Rebecca ~6 hours after today's earlier sync. Minor formatting changes: zero-width non-joiner (`‌`) separators added between sections (6, 7, 8, 10, 11) and between subsections within Sections 7, 8, 9, and 10. No structural or requirement-content changes detected.
  - Source deleted and re-added in NotebookLM (Connections & Endpoints)
  - Local snapshot updated
- 60 pages unchanged

## 2026-04-22 — Natasha Clark — Synced 1 Page (SL Transactions endpoint)
- **SL Transactions endpoint** (page 4500717796) — updated by Rebecca Beasley-Cockroft
  - Full sub-PRD spec for POST /sl-transactions: required/optional fields, account_type classification (13 allowable values), submit modes (append/upsert/replace with period + entity + account_type scope), SCD Type 2 versioning, custom field passthrough, FloQast-applied metadata. Includes 7 open questions and REQ-SL-01 through REQ-SL-05.
  - Snapshot was empty (0 bytes) and source was missing from NotebookLM (Connections & Endpoints) — added fresh as text source
  - Local snapshot populated
- Noted: Balances endpoint (4501078152) and Companies endpoint (4500947063) are also tracked in config but missing from NotebookLM — flagged for follow-up
- Added `ignored_page_ids` to config.json: *Data Platform Designs & Mock-ups* (4537155591) will now be skipped silently on future `/check-ds-prds` runs
- 60 pages unchanged

## 2026-04-21 — Natasha Clark — Synced 1 Page + Added 1 New Page (FX Rates endpoint, Onboarding Guide)
- **FX Rates endpoint** (page 4500652124) — updated by Rebecca Beasley-Cockroft
  - Major content addition: page went from empty to full sub-PRD spec (field-level specification for POST /fx-rates, bi-temporal date model, submit modes including upsert, 12-decimal precision requirement, high-volume batch session support, REQ-FX-01 through REQ-FX-06)
  - Added as new source in NotebookLM (Connections & Endpoints) — was missing from notebook
  - Local snapshot updated
- **Data Studio: Onboarding Guide** (page 4552884252) — added to Models & Platform Features
  - Engineer quick-start guide covering end-to-end setup: Connectors → Catalog → Field Mapping → Publish
  - Added as text source to NotebookLM
  - Local snapshot created, config.json updated (61 total tracked pages)
- Untracked page *Data Platform Designs & Mock-ups* (4537155591) intentionally skipped — it is a design prototype registry (Figma/Loom link table), not PRD content
- 59 pages unchanged

## 2026-04-15 3:30 PM CT — Natasha Clark — Synced 2 Pages (GL Transactions endpoint, Direct API Data Ingestion)
- **GL Transactions endpoint** (page 4500652131) — updated by Rebecca Beasley-Cockroft
  - Content updates to GL Transactions endpoint specification
  - Source deleted and re-added in NotebookLM (Connections & Endpoints)
  - Local snapshot updated
- **Direct API Data Platform 2.0 Data Ingestion** (page 4490330192) — updated by Rebecca Beasley-Cockroft
  - Content updates to API endpoint management PRD
  - Source deleted and re-added in NotebookLM (Connections & Endpoints)
  - Local snapshot updated
- 57 pages unchanged

## 2026-04-15 — Natasha Clark — Synced 2 Pages (GL Transactions endpoint, Direct API Data Platform 2.0)
- **GL Transactions endpoint** (page 4500652131) — updated by Rebecca Beasley-Cockroft
  - Major content addition: page went from empty to full sub-PRD spec (field-level specification for POST /gl-transactions, submit modes, custom fields, dimensions, requirements REQ-GL-01 through REQ-GL-08)
  - Source deleted and re-added in NotebookLM (Connections & Endpoints)
  - Local snapshot updated
- **Direct API Data Platform 2.0 Data Ingestion** (page 4490330192) — updated by Rebecca Beasley-Cockroft
  - Updated prototype link and formatting changes
  - Source deleted and re-added in NotebookLM (Connections & Endpoints)
  - Local snapshot updated
- 58 pages unchanged

## 2026-04-13 — Natasha Clark — Added 1 New Page (Multi-Dataset Handling)
- **Data Studio: Multi-Dataset Handling (DRAFT)** (page 4535714119) — added to Connections & Endpoints
- Added as text source to NotebookLM
- Local snapshot created, config.json updated (58 total tracked pages)

## 2026-04-09 — Natasha Clark — Synced 1 Page (SFTP Multi File Handling)
- **SFTP Multi File Handling(4/30) + Global Dimension (Q2)** (page 4500947136) — updated by Alex Kearns
  - Major expansion: added self-service dataset definition scope (MF4), Data Preview (MF8), new use cases, expanded sub-PRD list, target release moved to 4/30, join types answered
  - Source deleted and re-added in NotebookLM (Connections & Endpoints)
  - Local snapshot updated
- 56 pages unchanged

## 2026-04-07 — Natasha Clark — Synced 1 Page (Entity Mapping)
- **Entity Mapping** (page 4476535512) — updated by Rebecca Beasley-Cockroft
  - Page merged into Dataset Definition Wizard PRD (Entity Configuration — Step 5)
  - Source deleted and re-added in NotebookLM (Models & Platform Features)
  - Local snapshot updated
- 56 pages unchanged

## 2026-04-06 — Natasha Clark — Added 2 New Pages (Error Patterns, Eventing)
- **Data Studio: Error Patterns & Handling (DRAFT)** (page 4523229282) — added to Models & Platform Features notebook
- **Data Studio: Platform Features — Eventing (DRAFT)** (page 4523098246) — added to Models & Platform Features notebook
- Both by Alex Kearns, added as text sources to NotebookLM
- Local snapshots created, config.json updated (59 total tracked pages)

## 2026-04-06 — Natasha Clark — Added 3 New Pages (Schema Definition, Accounting Config, Entity Configuration)
- **Data Studio: Schema Definition — Dataset Definition (DRAFT)** (page 4523196435) — added to Models & Platform Features notebook
- **Data Studio: Accounting Config — Dataset Definition (DRAFT)** (page 4523163672) — added to Models & Platform Features notebook
- **Data Studio: Entity Configuration — Dataset Definition (DRAFT)** (page 4522967047) — added to Models & Platform Features notebook
- All three by Alex Kearns, added as text sources to NotebookLM
- Local snapshots created, config.json updated (57 total tracked pages)

## 2026-04-06 — Natasha Clark — Synced 1 Page (Auth and API Key Management)
- **Auth and API Key Management** (page 4501078174) — modified by Rebecca Beasley-Cockroft (Apr 2)
  - Source deleted and re-added in NotebookLM (Connections & Endpoints notebook)
  - Local snapshot updated
- 5 other pages modified in Data space but not in tracked list (new/untracked pages)

## 2026-04-02 — Natasha Clark — Synced 2 Pages (Testing & Publishing, Versioning & Lifecycle)
- **Model Creation 3 of 4: Testing & Publishing** (page 4449468593) — updated by Alex Kearns
- **Model Creation 4 of 4: Versioning & Lifecycle** (page 4443013309) — updated by Alex Kearns
- Sources deleted and re-added in NotebookLM (Models & Platform Features notebook)
- Local snapshots updated

## 2026-04-01 — Natasha Clark — Initial Setup (54 Pages)
- Created notebook: **Q2 Data Studio PRDs (Connections & Endpoints)** (30 pages)
- Created notebook: **Q2 Data Studio PRDs (Models & Platform Features)** (24 pages)
- Initial content synced from Confluence
