# Data Studio PRD Suite — Executive Summary

**Scope:** 18 Confluence pages across Alex Kearns (AK) and Rebecca Beasley-Cockroft (RBC)
**As of:** March 19, 2026

---

## Reference Docs

| # | Reference Doc | Author | Summary |
|---|---------------|--------|---------|
| 1 | [Definitions & Terms](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409) | AK | Shared glossary defining Model, Connector, Grouped Dataset, Effective Date, Version states, and Entity across the entire PRD suite. |
| 2 | [Overview & Index of "Model Creation" PRDs](https://floqast.atlassian.net/wiki/spaces/Data/pages/4444455089) | AK | Parent of 5 sub-PRD cases around model creation. |
| 3 | [Parent QBO Page](https://floqast.atlassian.net/wiki/spaces/Data/pages/4430200905/QBO+Data+Ingestion+and+Transformation) | RBC | Parent of all PRD cases outlining the "what" / "why". |

## PRD Index

| #   | PRD                                                                                                                                  | Author   | Summary                                                                                                                                                                                                |
| --- | ------------------------------------------------------------------------------------------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | [Merging Catalog & Lineage Tabs](https://floqast.atlassian.net/wiki/spaces/Data/pages/4470800387)                                    | AK       | Consolidates the 3-tab layout into 2 tabs (Catalog, Connectors), retires card-based Catalog, and standardizes the 6-tab Model detail view.                                                             |
| 2   | [Catalog — Search and Filter](https://floqast.atlassian.net/wiki/spaces/Data/pages/4476731473)                                       | AK       | Defines AG Grid table behavior for the Catalog tab: FQ Model type groupings, status badges, real-time search, column filters, and active filter chips.                                                 |
| 3   | [QBO Connection](https://floqast.atlassian.net/wiki/spaces/Data/pages/4442718323/QBO+Connection)                                     | RBC      | Covers both QBO Basic (Direct API / OAuth 2.0) and QBO Advanced (Fivetran) connection paths, including credential storage, token refresh, and the Connections tab at scale (~35k connections).         |
| 4   | [QBO Endpoint Handling](https://floqast.atlassian.net/wiki/spaces/Data/pages/4447568254)                                             | RBC      | Manages per-connection API endpoint configuration: auto-provisioned endpoints, custom activation, sync frequency, and on-demand data run triggers with <60s SLA.                                       |
| 5   | [CDC Connection Setup](https://floqast.atlassian.net/wiki/spaces/Data/pages/4462575617)                                              | AK       | Self-service CDC connection wizard (e.g., NetSuite via Fivetran) with table selection, auto-created models, and full vendor abstraction — no Fivetran language surfaces to users.                      |
| 6   | [Manual Upload Connector](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449337387/Data+Studio+Manual+Upload+Connector+DRAFT) | AK       | New connector type for Excel/CSV uploads with schema inference, manual type overrides, rich validation, and as-of date per upload.                                                                     |
| 7   | [Model Creation & Source Configuration (1/4)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4450189505)                       | AK       | Model naming, FQ Model selection, linking source datasets, Primary Dataset designation, and Grouped Datasets (UNION of schema-identical files) for high-file-count customers.                          |
| 8a  | [Field Mapping — Visual Refresh + AI-Suggested Mappings (2a/4)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449927443)     | AK       | **Target: 6/30.** Redesigned field mapping page, AI-suggested source-to-target mappings on first draft, many-to-one source field mapping, and custom field support.                                    |
| 8b  | Field Mapping — AI-Assisted Transformation Functions (2b/4)                                                                          | AK       | **Target: 9/30.** Per-row transformation logic editor with manual functions and AI Chat Modal for natural language → expression authoring. Depends on 8a and RBC's QBO Transformation Functions (#14). |
| 9   | [Testing & Publishing (3/4)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449468593)                                        | AK       | Test/preview with as-of date and entity filter, publish action with Effective Date selector and validation, plus row-level error surfacing.                                                            |
| 10  | [Versioning & Lifecycle (4/4)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4443013309)                                      | AK + RBC | Post-publish version lifecycle: new Drafts (manual and auto-triggered), one-Draft constraint, discard, archive, Logs tab, and Versions tab.                                                            |
| 11  | [QBO Standard Mapping](https://floqast.atlassian.net/wiki/spaces/Data/pages/4465296047/QBO+Standard+Mapping)                         | RBC      | Auto-provisioned field mappings for QBO (API and Fivetran): Accounts, Balances, Transactions, Companies, FX Rates, and Dimensions with opt-in customization and Reset to Standard.                     |
| 12  | [Entity Mapping](https://floqast.atlassian.net/wiki/spaces/Data/pages/4476535512/Entity+Mapping)                                     | RBC      | Entity-to-model linking via a proposed Data Domains intermediate layer between FQ entities, models, and connections; predates current architecture.                                                    |
| 13  | [Data Preview Tab](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449632496/Model+Creation+Data+Preview+Tab+DRAFT)            | AK       | Read-only AG Grid view of processed pipeline data with version selection, per-column filters, and server-side pagination; AI-assisted query deferred to V2.                                            |
| 14  | [QBO Transformation Functions](https://floqast.atlassian.net/wiki/spaces/Data/pages/4484530409/QBO+Transformation+Functions+DRAFT)   | RBC      | Defines the transformation functions needed to define source-to-target mapping for QBO into normalized FQ format (will support more than QBO).                                                         |

---

## 1. Navigation & UX Structure

**Merging Catalog & Lineage Tabs** (AK) consolidates the previous 3-tab layout (Catalog, Connectors, Lineage) into 2 tabs (Catalog, Connectors) and retires the card-based Catalog view in favor of an AG Grid table. The Model detail view standardizes to 6 vertical tabs: Overview · Source Datasets · Field Mappings · Data Preview · Versions · Logs.

**Catalog — Search and Filter** (AK) defines the AG Grid table behavior: FQ Model type groupings (collapsible), status badges, global real-time search, column filters, and active filter chips.

Together these two PRDs define the complete shell UX. Neither addresses RBAC — both flag it as an open gap (G1/G2 respectively) and defer to a future access control PRD.

---

## 2. Connectors

| PRD | Owner | Type | Status |
|-----|-------|------|--------|
| QBO Connection | RBC | Direct API + Fivetran | Draft |
| QBO Endpoint Handling | RBC | API endpoint mgmt | Draft |
| CDC Connection Setup | AK | Fivetran (CDC) | Draft |
| Manual Upload Connector | AK | Excel/CSV upload | Draft |

**QBO Connection** (RBC) covers both "QBO Basic" (Direct API / OAuth 2.0) and "QBO Advanced" (Fivetran) paths. Handles credential storage, token refresh, realmId capture, and the Connections tab (infinite scroll + search). Scale: up to ~35k connections.

**QBO Endpoint Handling** (RBC) manages API endpoint configuration per connection. Auto-provisions TrialBalance and Accounts endpoints, supports custom endpoint activation and nested calls, sets sync frequency (default 24h), and defines on-demand data run triggers for downstream apps (Close rec refresh, <60s SLA).

**CDC Connection Setup** (AK) covers CDC connections (e.g., NetSuite) via Fivetran. Users self-select tables from an FQ-controlled list; models are auto-created with pre-defined Source-to-Target mappings. The 4-step wizard abstracts Fivetran entirely — no vendor language surfaces to users.

**Manual Upload Connector** (AK) is a new connector type supporting Excel (.xlsx) and CSV. Schema inferred from sample upload with manual type overrides, rich validation feedback, and as-of date required per upload. Customer trigger: Twilio request.

---

## 3. Model Creation Workflow

The core workflow is documented across 5 sequential PRDs (all AK), plus a shared Definitions & Terms glossary:

**Definitions & Terms** (AK) — shared glossary for all sub-PRDs. Defines Model, Connector, Grouped Dataset, Effective Date, Version states, Entity. Two open questions: whether "Connector Type" still appears in UI; whether Effective Date for Version 0 defaults to Jan 1, 1900.

**1/4: Model Creation & Source Configuration** (AK) — Model naming, FQ Model selection, linking source datasets, designating Primary Dataset, creating Grouped Datasets (UNION of schema-identical files). Primary use case: customer with 200+ files split by entity.

**2a/4: Field Mapping — Visual Refresh + AI-Suggested Mappings** (AK, target 6/30) — Redesigned field mapping page with AI-suggested source-to-target mappings on first draft, many-to-one source field mapping, custom fields, and inline validation/error handling (unmapped required fields, type mismatches, invalid combinations). Gaps: autosave failure behavior (G2), AI empty/low-confidence state (G1).

**2b/4: Field Mapping — AI-Assisted Transformation Functions** (AK, target 9/30) — Per-row transformation logic editor with manual function-based logic and AI Chat Modal for natural language → expression authoring. Defines the supported function library (resolves former blocking gap G3). Depends on PRD 2a and RBC's QBO Transformation Functions PRD.

**3/4: Testing & Publishing** (AK) — Test/preview with as-of date, entity filter, row-level filter, and runtime error surfacing (catches data-level issues like type coercion failures on specific rows). Publish action with Effective Date selector and publish-time validation. Critical open question: Jan 1, 1900 default unconfirmed with data platform team.

**4/4: Versioning & Lifecycle** (AK + RBC) — Post-publish version lifecycle: creating new Drafts (manual and auto-triggered by structural changes), one-Draft constraint, discard, archive, Logs tab, Data Preview tab, autosave, Versions tab. 17 user stories. RBAC model undefined (G2).

---

## 4. Standard Mapping, Entity Linking & Transformations

**QBO Standard Mapping** (RBC) defines the auto-provisioned field mappings for QBO (both API and Fivetran paths): Accounts, Balances (debit - credit aggregation from Trial Balance), Transactions (Fivetran only), Companies (hard-coded per connection), FX Rates (N/A for QBO), Dimensions (Vendor, Customer, Class, Department via Fivetran). Customization is opt-in; Reset to Standard is available.

**Entity Mapping** (RBC) — earlier PRD (predates current architecture) covering entity-to-model linking. Proposes Data Domains as an intermediate layer between FQ entities, models, and connections. The current Merging Catalog/Lineage PRD (AK) references Entity Mappings as a third tab placeholder, but the data model for entity linking is only defined here in Rebecca's older document.

**QBO Transformation Functions** (RBC) — defines the transformation functions needed to define source-to-target mapping for QBO into FQ's normalized format. Scoped to QBO initially but intended to support additional connector types.

**Data Preview Tab** (AK) — read-only AG Grid view of processed pipeline data. Supports Active and Archived version selection, per-column filters, server-side pagination. V2 deferred: AI-assisted natural language query.

---

## 5. Discrepancies & Cross-Author Gaps

### 5a. Effective Date Default (Jan 1, 1900)
**Where it appears:** Testing & Publishing PRD (AK, marked critical), Definitions & Terms (AK, open question Q2), and Versioning PRD (AK + RBC).
**Status:** Unconfirmed with the data platform team. This is a blocking assumption — if the default is not Jan 1, 1900, the historical backfill mechanic changes significantly. Neither author has confirmed resolution.

### 5b. "Source" vs. "File" Terminology
**Rebecca's PRDs** (QBO Connection, QBO Endpoint Handling, Standard Mapping) use "Source" consistently throughout. **Alex's earlier PRDs** (Model Creation 1/4 and the current prototype) use "Linked Files" and "File Label." The Definitions & Terms glossary does not fully reconcile this — "Source Dataset" is defined, but "File Label" (a field in the prototype today) has no canonical definition. This creates UI copy inconsistency risk.

### 5c. Standard Mapping Ownership Gap
The **CDC PRD** (AK) assumes "standard Source-to-Target mappings" exist as a dependency for auto-created CDC models but explicitly marks standard mapping as out of scope. The only standard mapping definition in the suite is the **QBO Standard Mapping** (RBC), which is QBO-specific. There is no PRD covering standard mappings for CDC sources (e.g., NetSuite). If CDC models are auto-created with pre-defined mappings, someone needs to define what those mappings are.

### 5d. Entity Mapping Architecture Mismatch
**Alex's Merging Catalog/Lineage PRD** includes "Entity Mappings" as a top-level L1 tab (placeholder). **Rebecca's Ability to Link Entities PRD** proposes a Data Domains intermediate layer as the linking mechanism. These two documents reflect different architectural assumptions — the tab exists in the current navigation design but the underlying data model is based on a pre-Data Studio architecture document. This needs reconciliation before Entity Mapping is built.

### 5e. Connection Error States
**Rebecca's QBO Endpoint Handling PRD** defines detailed connection error states and downstream notification SLAs (<60s). **Alex's CDC PRD** explicitly marks connection status and error states as out of scope, deferring to a future PRD. The result: connection error handling is defined for QBO but undefined for CDC, and there's no shared PRD that establishes common error state patterns across connector types.

### 5f. RBAC / Permissions
Neither author owns a permissions PRD. It's listed as an open gap in at least 3 documents (Catalog Search & Filter G1, Merging Catalog/Lineage, Versioning & Lifecycle G2). Given that publish actions, version management, and connector credential access all carry access control implications, this is a cross-cutting gap that needs its own PRD or a dedicated section in an umbrella document.

### 5g. Fivetran Vendor Abstraction Consistency
**Alex's CDC PRD** is explicit: user-facing language must never mention Fivetran — it's abstracted as FQ infrastructure. **Rebecca's QBO Connection PRD** uses "QBO Advanced (Fivetran)" as the user-facing label in the Connections tab. These are inconsistent. Either Fivetran is abstracted everywhere (CDC approach) or surfaced where relevant (QBO approach) — this needs a product decision.

---

## 6. Open Blockers Summary (Cross-Suite)

| Blocker | Status | Owner |
|---------|--------|-------|
| Jan 1, 1900 Effective Date default | Unconfirmed with data platform | AK |
| Standard mapping for non-QBO sources (CDC) | No PRD exists | Unowned |
| RBAC / permissions model | No PRD exists | Unowned |
| Entity mapping architecture (Data Domains vs. tab) | Conflicting approaches | AK + RBC |
| Fivetran vendor abstraction policy | Inconsistent between PRDs | AK + RBC |
| Autosave failure behavior | Undefined | AK |
| ~~Supported transformation function library~~ | ~~Undefined~~ — **Resolved:** Now explicitly owned by PRD 2b: AI-Assisted Transformation Functions (target 9/30). No longer blocks the 6/30 release. | AK |
