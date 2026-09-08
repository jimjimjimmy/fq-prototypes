# FloQast Close: Technical Architecture from Confluence

**Source:** Confluence C4 Level 2 Architecture Docs, Service Design Specifications, Gold Layer Data Model, ADRs
**Date:** February 27, 2026
**Status:** Research Compilation — Living Document
**Author of Architecture Docs:** Sam Hall (Close C4 Level 2 series, published Feb 25, 2026)

---

## 1. Close Platform Architecture Overview

FloQast Close runs on AWS as a collection of **Lambda functions** behind Application Load Balancers (ALBs), with an active migration underway to **ECS (Elastic Container Service)** for key services. The primary data store is **MongoDB/DocumentDB** (referred to as `CoreDB`), with **Snowflake** used for analytics and the Reporting team's data warehouse layer. Async orchestration uses **AWS Step Functions** and direct Lambda invocations (notably, not SQS/EventBridge for most Close services).

### 1.1 Core Database: MongoDB/DocumentDB Collections

The Close platform accesses the following MongoDB collections via `fq-layer-core-db`:

| Collection | Used By | Purpose |
|---|---|---|
| `procedures` | Checklist, Items, Replication, Bulk Edit, Workflow Analytics | Checklist items (the core work unit) |
| `templates` | Checklist, Template, Replication | Checklist item templates (timeless definitions) |
| `folders` | Checklist, Items, Replication, Tasks, Workflow Analytics, Recs | Folder hierarchy and lock status |
| `companies` | Checklist, Replication, Bulk Edit, Workflow Analytics, Recs | Company config, GL settings |
| `toplevelclients` | Checklist, Items, Replication, Tasks, Adhoc-Projects, Workflow Analytics, Recs | Top-level client settings and feature flags |
| `users` | Checklist, Bulk Edit, Workflow Analytics, Adhoc-Projects, Recs | User profiles and assignments |
| `workflows` | Checklist, Review Notes, Workflow Analytics | Workflow definitions |
| `reviewnotes` | Review Notes, Workflow Analytics, Recs | Review notes on items/recs |
| `recs` | Workflow Analytics, Review Notes | Reconciliation records |
| `reconciliations` | Bulk Edit, Recs | Reconciliation data with signatures |
| `tags` | Checklist, Recs | Custom and predefined tags |
| `storagemetadatas` | Checklist | Cloud storage file metadata |
| `procedurejournalentries` | Checklist | Journal entry data linked to procedures |
| `tasks` | Tasks | Ad-hoc project tasks |
| `adhoc-projects` | Adhoc-Projects | Ad-hoc project definitions |
| `bulkeditjobs` | Bulk Edit | Job tracking for bulk operations |
| `workflow-analytics-export-information` | Workflow Analytics | Analytics export job metadata |

### 1.2 Integration Provider Lambdas

**GL (General Ledger) Provider Lambdas** — ERP integrations that pull trial balance data:
- `fq-gl-netsuite` — NetSuite integration
- `fq-gl-ms-dynamics` — Microsoft Dynamics 365
- `fq-gl-sap` — SAP integration
- `fq-gl-tb` — Generic trial balance import
- `fq-gl-creds-lambda` — Credential management

**Storage Provider Lambdas** — Cloud storage integrations for document sync:
- `fq-storage-provider-box`
- `fq-storage-provider-egnyte`
- `fq-storage-provider-dropbox`
- `fq-storage-provider-gdrive`
- `fq-storage-provider-onedrive`

---

## 2. Close Service Architecture (C4 Level 2)

### 2.1 CHECKLIST Service

The Checklist is a **multi-Lambda system** with three API entry points:
- **`item`** — Checklist item CRUD, sign-offs, documents, JEM routes
- **`template`** — Template management
- **`template-super`** — Super template operations

**Key characteristics:**
- No SQS or EventBridge consumers — async operations use direct Lambda invocations and Step Functions
- Currently being migrated to ECS (see Section 3)
- Accesses `procedures`, `templates`, `folders`, `companies`, `toplevelclients`, `tags`, `users`, `workflows`, `procedurejournalentries`, `storagemetadatas`, `reviewnotes` collections
- Invokes GL Provider Lambdas and Storage Provider Lambdas

### 2.2 ITEMS Service

Extends the Checklist's item Lambda with connections to:
- GL Provider Lambdas for trial balance data retrieval
- Storage Provider Lambdas for document operations
- The same CoreDB collections as Checklist

### 2.3 REPLICATION Service

Handles **period roll-forward** — the monthly process of copying the close structure into the next period.

**Architecture:** 12+ Lambdas orchestrated by 4 Step Functions:
- `replicate-queue-v2` — Main orchestrator
- `replicate-queue-item-v2` — Item-level replication
- `replicate-company` — Company-level replication
- `replicate-tlc` — Top-level client replication

**Trigger:** Monthly cron on the 1st of each month.

**Collections accessed:** `companies`, `procedures`, `folders`, `toplevelclients`

### 2.4 TEMPLATE Service

Template management Lambda handling:
- Template CRUD operations
- GL Provider Lambda invocations for account data
- Storage Provider Lambda invocations for file operations
- COA (Chart of Accounts) caching via `@floqastinc/fq-cache-sdk` (S3-backed cache + MongoDB metadata)

**Open question from docs:** What is the underlying backing technology for `fq-layer-core-db` — MongoDB vs. DocumentDB, cluster details?

### 2.5 REVIEW-NOTES Service

- Currently a Lambda, **actively being migrated to ECS** (`review-notes_service`)
- Accesses: `toplevelclients`, `companies`, `procedures`, `recs`, `workflows`, `reviewnotes`, `users`, `folders`
- Publishes to a Todos SNS topic via `@floqastinc/todos-event-sdk`

### 2.6 AUTOREC Service

Auto-reconciliation system. Architecture doc is primarily a diagram (Mermaid rendered as PNG) showing ingress, Lambda compute, async processing, and data stores. Covers automated reconciliation balance checking and refresh workflows.

### 2.7 AI MATCHING Service

Transaction matching system. Architecture doc shows ingress, Lambda compute (Node.js + Python), async processing via Step Functions, and data stores. Complex multi-Lambda system for AI-powered transaction matching.

### 2.8 WORKFLOW ANALYTICS Service

- **ECS migration in progress** (`workflow-analytics_service`)
- Accesses: `procedures`, `recs`, `companies`, `folders`, `users`, `toplevelclients`, `reviewnotes`, `workflow-analytics-export-information`
- Uses a separate **Analytics DB** (`fq-layer-analytics-db`) in addition to CoreDB
- Export flow: User requests → Excel generated → S3 storage → WebSocket notification (or email via `export-queue` worker)
- API routes cover: Settings, Progress (entities/folders/teams/forecasts/metrics), Trends (close duration/late items), Export

### 2.9 BULK EDIT Service

Multi-Lambda system with Step Function orchestration for bulk editing checklist items and reconciliations.

**Step Function flow:** init → preparer (creates batches) → parallel workers (item + template) → wrap-up (finalize, report, notify)

**Concurrency controls:**
- Preparer: 25 reserved concurrency
- Worker: 100 reserved concurrency
- Template-worker: 50 reserved concurrency
- Wrap-up: 25 reserved concurrency

**Lambdas:**
| Lambda | Type | Description |
|---|---|---|
| `fq-bulk-edit-init` | API | Entry point, validates payload, starts Step Function |
| `fq-bulk-edit-status` | API | Returns job status and report URL |
| `fq-bulk-edit-preparer` | Worker | Fetches items, applies forward logic, creates batches |
| `fq-bulk-edit-worker` | Worker | Processes item batches (signatures, smart rules) |
| `fq-bulk-edit-template-worker` | Worker | Processes template batches for apply-forward |
| `fq-bulk-edit-wrap-up` | Worker | Finalizes job, generates report, sends email |
| `fq-bulk-edit-error-handler` | Worker | Handles errors, notifies user of failures |

### 2.10 TASKS & ADHOC-PROJECTS Services

**Tasks:** Lambda accessing `tasks`, `toplevelclients`, `folders` collections. Tasks belong to Ad-Hoc Projects — invokes `fq-adhoc-projects-api` for validation. Comments managed via centralized `comments` service.

**Adhoc-Projects:** Lambda with Step Function (`adhoc-project-wizard`) orchestrating multi-Lambda workflows. Accesses `adhoc-projects`, `toplevelclients`, `users` collections.

### 2.11 REPORTS Service

Lambda that prepares report data, stores large payloads in S3 (`${env}-large-payload-store`), then delegates file generation to export Lambdas (`fq-export-file`, `fq-export-formatted-file`).

---

## 3. ECS Migration — Checklist Service

A formal migration plan exists to move the Checklist **item** Lambda to ECS (`apps/close_checklist`).

### Route Mapping (Lambda → ECS)

| Current (Lambda) | Proposed (ECS) |
|---|---|
| `GET /items` | `GET /checklist/v1/items` |
| `POST /item` | `POST /checklist/v1/items` |
| `PUT /item/${id}` | `PUT /checklist/v1/items/:itemId` |
| `DELETE /item/${id}` | `DELETE /checklist/v1/items/:itemId` |
| `POST /item/${id}/signatures/${sigId}/signoff` | `POST /checklist/v1/items/:itemId/signatures/:signatureId/signoff` |
| `PUT /item/${id}/signatures/${sigId}/remove-signoff` | `DELETE /checklist/v1/items/:itemId/signatures/:signatureId/signoff` |
| `POST /item/${id}/doc` | `POST /checklist/v1/items/:itemId/documents` |
| `DELETE /item/${id}/docs/${docId}` | `DELETE /checklist/v1/items/:itemId/documents/:documentId` |
| `GET /item/${id}/journal-entries` | `GET /checklist/v1/items/:itemId/journal-entries` |
| `POST /item/${id}/journal-entries/${jeId}/clone` | `POST /checklist/v1/items/:itemId/journal-entries/:journalEntryId/clone` |
| `PATCH /item/${id}/journal-entries/sync-status` | `PATCH /checklist/v1/items/:itemId/journal-entries/sync-status` |

### Migration Phases

1. **Phase 1 — Item CRUD + Sign-offs:** Stand up `apps/close_checklist` in monorepo, implement 6 high-priority routes, update `checklist-client` to use `serviceRequest()`, ALB routing split, feature-flag toggle
2. **Phase 2 — Documents:** Implement document routes on ECS, migrate client calls
3. **Phase 3 — JEM routes:** Implement journal-entry routes on ECS, migrate client calls
4. **Phase 4 — Cleanup:** Decommission `item` Lambda, remove feature flags and legacy `lambdaRequest()` code paths

**Note:** Template and template-super Lambdas are **out of scope** for this phase.

---

## 4. AI Architecture

### 4.1 AI Services Inventory

| Service | Components | Runtime | AI Provider |
|---|---|---|---|
| AI Matching System | API, Worker, LLM Lambda, Code Runner | Lambda (Node.js/Python) | OpenAI |
| FloQL Backend | Transaction Analytics | Lambda (Python) | AWS Bedrock (Claude 3.5 Sonnet) |
| Monitors Agent | SQL Generation | Bedrock Agent | AWS Bedrock (Claude 3.5 Sonnet v2) |
| Remind Language Processor | Message Generation | Lambda (Node.js) | OpenAI |
| Checkmate API | Checklist Generation | Lambda (Node.js) | OpenAI |

### 4.2 AI Model Usage

| Service | Provider | Model | API Type |
|---|---|---|---|
| AI Matching (rules) | OpenAI | gpt-4o | Chat Completions |
| AI Matching (code gen) | OpenAI | gpt-4o → gpt-4-turbo-preview fallback | Chat Completions |
| FloQL Backend | AWS Bedrock | claude-3-5-sonnet-20240620-v1:0 | Messages API |
| Monitors Agent | AWS Bedrock | claude-3-5-sonnet-20241022-v2:0 | Bedrock Agent |
| Remind Language | OpenAI | gpt-4o | Chat Completions |
| Checkmate | OpenAI | gpt-4-1106-preview | Chat Completions + Tools |

### 4.3 Code Execution Security (AI Matching)

The `fq-matching-copilot-code-runner-lambda` runs LLM-generated Python code in a hardened environment:

| Control | Implementation |
|---|---|
| Network Isolation | Dedicated VPC with no internet gateway |
| Egress Restriction | Security group allows only S3 VPC endpoint (port 443) |
| Secret Denial | Explicit IAM DENY on all SSM/Secrets Manager operations |
| Limited Runtime | Only `re`, `pandas`, `defaultdict` available |
| Code Validation | Regex extraction — only Python in markdown blocks accepted |
| Function Check | Must define `match_transactions` function |
| Time Limit | 900s maximum execution time |
| Memory Limit | 10GB maximum allocation |

### 4.4 MatchQL Domain-Specific Language

AI Matching includes a DSL called **MatchQL** for defining matching rules:
- Supports `sources` with filtering and grouping
- Supports `match` conditions with operators: `=`, `>=`, `<=`, `>`, `<`, `within`, `contains`
- Supports `virtual` fields with AI expressions
- MatchQL is generated by LLM but validated/parsed server-side — translated to Python code for execution

### 4.5 Tenant Isolation for AI

- All data access scoped by `tlcId` identifier at API authorization and database query layers
- Snowflake uses schema-per-tenant: `TLC_{tlcId}`
- S3 paths prefixed with tenant identifier
- LLM Lambda does NOT receive `tlcId` — data already isolated via S3 path prefixes
- Data classification: Transaction data (structured fields only) sent to LLMs; raw files, `tlcId`, user IDs never sent

---

## 5. Close Gold Layer Data Model

**Author:** Mide Seni | **Status:** V1.0 (updated Feb 26, 2026)

The Gold Layer is a **star schema** in Snowflake designed for analytics (ThoughtSpot, dashboards).

### 5.1 Silver → Gold Source Mapping

Silver sources required: checklist items, reconciliations, signatures array, company object, period object, `deleted_at` field.

**Signature Flattening Rule:** Uses the FINAL required signature for KPI evaluation. Completion = All required signatures signed. `final_signed_date = MAX(signedDate)` when `is_fully_signed = 1`.

### 5.2 Star Schema Tables

**`dim_date`** — Standard date dimension (reused from Compliance Gold Layer)

**`dim_company`** — `company_key` (hash), `company_id` (Mongo ID), `fiscal_year_end`, `created_at`

**`dim_project` (Close Period)** — `project_key` (YYYY-MM hash), `period_year`, `period_month`, `period_label`

**`dim_item_type`** — Static dimension: `CHECKLIST` or `RECONCILIATION`

**`dim_folder`** (Optional) — `folder_key`, `folder_id`, `folder_name`, `is_locked`

**`fact_close_item_status`** — Grain: One row per Close item per period

| Column | Type | Description |
|---|---|---|
| `item_key` | string | Hash of item |
| `item_id` | string | Mongo ID |
| `company_key` | string | FK → dim_company |
| `project_key` | string | FK → dim_project |
| `item_type_key` | string | FK → dim_item_type |
| `folder_key` | string | FK → dim_folder |
| `due_date_key` | int | FK → dim_date |
| `signed_date_key` | int | FK → dim_date |
| `is_signed` | boolean | Signed flag |
| `is_on_time_flag` | int | 1 if signed ≤ due |
| `is_late_flag` | int | 1 if signed > due |
| `is_overdue_flag` | int | 1 if not signed & past due |

### 5.3 KPI: On-Time %

```sql
On-Time % = SUM(is_on_time_flag) / COUNT(DISTINCT item_key)
WHERE deleted_at IS NULL AND due_date IS NOT NULL AND due_date <= CURRENT_DATE
```

---

## 6. Reporting/R2R Architecture

### 6.1 Financial Data Model (FDM) Service

**Purpose:** FDM provides a mechanism to organize and categorize ERP data into "custom dimension groupings" used across FloQast.

**What it does NOT do:** Transactions, balances, direct ERP interaction, writing to FloLake.

**Architecture:** Previously a Lambda (`reporting_financial-data-models`), now split into two ECS services:
- `reporting_fdm-service` — HTTP API traffic
- `reporting_fdm-sync` — Cron syncs with FloLake

**Data stores:**
- **MongoDB** — Source configurations (heavily tied to `connection` in Mongo)
- **Snowflake** — Dimension groupings data (read-heavy, large infrequent writes, needs JOIN/SQL power)

**Multi-tenancy:** MongoDB is shared database with `tlcId`. Snowflake is **schema-per-tenant**.

**Async pattern:** FloLake broadcasts SNS messages on 5T (five-table) sync. FDM sync consumes via SQS, re-runs FDM rules, then publishes its own SNS message to downstream consumers.

### 6.2 Report Builder Service (`flosight_service`)

**Purpose:** Comprehensive platform for creating, managing, and exporting financial reports with filtering, grouping, pivoting, and aggregation.

**Architecture:**
- `flosight_service` — Main API (ECS, 512 CPU units, 1GB memory)
- `flosight_service-worker` — Export processing (ECS, 1024 CPU units, 2GB memory)
- SQS FIFO queue for export jobs (`fq-flosight-exports-queue.fifo`)

**Data stores:**
- **MongoDB** — Report definitions, folder hierarchy, export job metadata
- **Snowflake** — Financial data (read-only, analytical queries)
- **S3** — Export files (temporary, signed URLs)

**Key dependency:** AI Variance service uses Report Builder's `getReportData` and `getCompanies` endpoints — meaning Report Builder going down also breaks AI Variance.

**Autoscaling:** Min 3, Max 120 instances (production). CPU+Memory target 50%. MongoDB connection pool: min 5, max 10 per instance.

### 6.3 Core Recs Service (DRAFT)

**Purpose:** CRUD for reconciliations and reconciliation templates. Does NOT perform rec refreshes, balance updates, or auto sign-off.

**Architecture:** API + Worker pattern (SQS for bulk operations), ECS-targeted.

**Key data ownership:**
- Reconciliations (`reconciliations` collection) — complex nested documents with signatures, docs, periods
- Templates (`templates` collection) — embedded rec templates
- Uses `fq-gl-sdk`, `fq-storage-provider-sdk`, `fq-sox-controls`, `fq-snowflake-creds-manager`

**Multi-tenancy:** Shared database with `tlcId`. All DAO methods require `tlcId` parameter (explicit, not middleware-enforced).

---

## 7. Platform Architecture

### 7.1 Global Authentication (GAuth) — ADR 2026-02-25

**Status:** Pending

**Problem:** Auth sprawl across 173+ services via `fq-auth-middleware`, `auth-module-server`, and Lambda layers. No unified ingress. No service identity model. Security gaps (no `aud`/`iss` validation, fail-open revocation).

**Proposed architecture:**

| Component | Role |
|---|---|
| GAuth API (`pl-global-auth-gw`) | Global token mint + refresh authority |
| Gateway (`fq-gateway`) | Regional ingress for all outside-cluster traffic |
| Security Token Service (STS) | S2S authentication and internal token exchange |
| SDKs | Generated per-service API SDKs + shared GAuth SDK |

**Token architecture:**
- **Edge tokens:** access_token (JWT, short TTL), id_token (JWT), refresh_token (opaque, single-use rotation), csrfToken (HMAC)
- **Internal tokens:** Service identity token (STS-issued), Delegation assertion (30-60s TTL), Delegated access token (2-5min TTL, audience-bound)

**Migration phases:** A (bridge + principals) → B (GAuth portal + STS) → C (SDK adoption) → D (STS for S2S + delegation) → E (legacy removal)

### 7.2 Service Design Specification Template

Mark Thomas (Platform) published a standardized template used across Reporting, Compliance, and Close teams. The template covers:

1. Purpose & Boundaries (with Service Granularity Check — disintegrators/integrators)
2. Architecture Diagrams
3. State & Data (statelessness, data ownership, connection pools, caching, multi-tenancy)
4. Communication Patterns (sync/async, API contracts)
5. Concurrency & Resource Management
6. Health Checks & Resilience (failure modes, load shedding)
7. Scaling & Resource Constraints

**Notable:** The template explicitly lists `ReBAC` as a module option, confirming it is a recognized architectural component in the platform.

### 7.3 Transform Permissions (Relevant to Close)

Transform currently has **no meaningful permission model**. Workflows are tied to Close entities — if a user has entity access, they can see and run every workflow. There is no way to restrict creation, execution, or what automations can do once running.

---

## 8. ReBAC & Permissioning Status

Based on Confluence search results, ReBAC (Relationship-Based Access Control) has the following footprint:
- A **Platform folder** exists for "ReBAC DRP Drills" (disaster recovery planning)
- The Service Design Template lists "ReBAC" as a recognized module
- The Transform team has documented a **permissions gap** as a critical problem
- Platform teams are actively working on **Audit Log Coverage** (48 of 62 critical routes lacking audit logs)
- A **Custom Role Permissions** use case (UC-U6) documents admin role modification with SOX segregation of duties compliance

**No comprehensive ReBAC architectural design document was found.** This remains a gap — the work is known and planned but may not yet have formal architecture documentation in Confluence.

---

## 9. Infrastructure Patterns

### 9.1 Common Patterns Across Services

- **Compute:** Lambda (migrating to ECS for high-traffic services)
- **Database:** MongoDB/DocumentDB via `fq-layer-core-db` shared layer
- **Analytics DB:** Separate `fq-layer-analytics-db` for analytics workloads
- **Data Warehouse:** Snowflake (schema-per-tenant for Reporting, shared queries for Close analytics)
- **Async:** Step Functions for orchestration, SQS for queue-based processing
- **Storage:** S3 for exports, large payloads, and temporary files
- **Notifications:** AppSync (WebSocket) for real-time UI updates
- **Auth:** JWT-based with `tlcId` tenant isolation, migrating to GAuth
- **Infrastructure as Code:** Terraform (`terraform-module-lambda-platform`, `terraform-module-ecs`)
- **Env-parameterized naming:** All resources use `${env}` prefix (fq2, fq4, fq7, automation, production, production-eu)

### 9.2 Autoscaling Pattern (ECS Services)

- Combined CPU + Memory utilization target: 50%
- Production: min 3, max 120 instances
- Dev: min 1, max 5
- Scale-out cooldown: 30 minutes
- Scale-in cooldown: 5 minutes
- Constraint: MongoDB connection pool size caps effective instance count

### 9.3 Multi-Tenancy Model

| Layer | Isolation |
|---|---|
| MongoDB | Shared database, `tlcId` filter on all queries |
| Snowflake (Reporting) | Schema-per-tenant: `TLC_{tlcId}` |
| S3 | Path prefix: `${tlcId}/...` |
| AI/LLM | Data pre-isolated before reaching AI; `tlcId` never sent to LLM providers |

---

## 10. Key Architectural Implications for Rearchitecture

### 10.1 The `procedures` Collection Is Central

The `procedures` MongoDB collection (representing checklist items) is accessed by nearly every Close service — Checklist, Items, Replication, Bulk Edit, Workflow Analytics, and indirectly by Review Notes and Recs. Any rearchitecture of the checklist item model directly impacts the core data store that all services depend on.

### 10.2 Folder Coupling Is Deep

The `folders` collection is used by 7+ services. Folders serve as both an organizational unit AND a permissioning boundary AND a storage sync anchor. Decoupling folders from tasks requires addressing all three concerns simultaneously.

### 10.3 Lambda → ECS Migration Creates an Opportunity Window

The active migration of Checklist, Review Notes, and Workflow Analytics from Lambda to ECS provides a natural opportunity to restructure APIs (as evidenced by the route cleanup in the ECS migration plan). The `/checklist/v1/` prefix and consistent REST conventions are being established now.

### 10.4 The Reporting Team's Architecture Is Ahead

Reporting has already:
- Moved to ECS
- Established Snowflake schema-per-tenant isolation
- Built the FDM service for dimension management
- Implemented the FloLake SNS/SQS event-driven sync pattern
- Published comprehensive service design specifications

This creates a natural model for Close to follow, and the FDM's dimension groupings could serve as the shared taxonomy bridge between Close and Reporting.

### 10.5 AI Services Are Modular but Fragmented

Five distinct AI services exist with different providers (OpenAI vs. Bedrock), different languages (Node.js vs. Python), and separate deployment patterns. A unified AI orchestration layer doesn't exist yet — each service independently calls its AI provider.

### 10.6 Authentication Overhaul Is In Flight

The GAuth ADR affects all 173+ services. The phased migration (with legacy token bridge) means the rearchitecture should plan for both legacy and GAuth token formats during the transition period.

---

## Source Index — Confluence Pages Referenced

| Page Title | Page ID | Space | Author | Last Modified |
|---|---|---|---|---|
| CHECKLIST Architecture (C4 Level 2) | 4443504863 | Close | Sam Hall | Feb 25, 2026 |
| ITEMS Architecture (C4 Level 2) | 4443865128 | Close | Sam Hall | Feb 25, 2026 |
| REPLICATION Architecture (C4 Level 2) | 4443865143 | Close | Sam Hall | Feb 25, 2026 |
| TEMPLATE Architecture (C4 Level 2) | 4443701365 | Close | Sam Hall | Feb 25, 2026 |
| REVIEW-NOTES Architecture (C4 Level 2) | 4443341436 | Close | Sam Hall | Feb 25, 2026 |
| Autorec Architecture (C4 Level 2) | 4443897874 | Close | Sam Hall | Feb 25, 2026 |
| AI Matching Architecture (C4 Level 2) | 4443996186 | Close | Sam Hall | Feb 25, 2026 |
| Workflow Analytics Architecture (C4 Level 2) | 4443963416 | Close | Sam Hall | Feb 25, 2026 |
| Bulk Edit Architecture (C4 Level 2) | 4443668515 | Close | Sam Hall | Feb 25, 2026 |
| TASKS Architecture (C4 Level 2) | 4444094468 | Close | Sam Hall | Feb 25, 2026 |
| ADHOC-PROJECTS Architecture (C4 Level 2) | 4443832416 | Close | Sam Hall | Feb 25, 2026 |
| REPORTS Architecture (C4 Level 2) | 4444061704 | Close | Sam Hall | Feb 25, 2026 |
| CHECKLIST ECS Migration — Proposed Architecture | 4443996199 | Close | Sam Hall | Feb 25, 2026 |
| AI Data Flow Architecture | 4444028968 | Close | Sam Hall | Feb 25, 2026 |
| AI Security Architecture | 4443766888 | Close | Sam Hall | Feb 25, 2026 |
| Close Gold Layer Data Model V1.0 | 4446290055 | Mide Seni | Mide Seni | Feb 26, 2026 |
| FDM API Service Design Specification | 4320460902 | R2R | Kyle Kodani | Feb 19, 2026 |
| Report Builder Service Design Specification | 4319117387 | R2R | Mason Rich | Feb 05, 2026 |
| Core Recs Service Design [DRAFT] | 4312563725 | Romulus | Matthew Spahr | Dec 18, 2025 |
| ADR 2026-02-25: Global Authentication | 4445569040 | Architecture | Kristopher Morris | Feb 25, 2026 |
| Service Design Specification Template | 4310138909 | Platform | Mark Thomas | Jan 08, 2026 |
| Transform Permissions | 4443144776 | Transform | Tyler Lu | Feb 27, 2026 |
