# Implementation Roadmap: Folder-Centric to Task-Centric Architecture

**FloQast Close Rearchitecture Initiative**
**Author:** Benjamin Ellis, Product Design Manager
**Date:** March 2026
**Version:** 1.0

---

## Executive Summary

This roadmap outlines an 18-month transformation of FloQast Close from its current folder-centric architecture to a task-centric model. The plan is structured across six quarters with clearly defined success gates, rollback strategies, and team scaling. Each quarter builds on the previous, with dual-read/dual-write migration patterns ensuring zero disruption to the 3,500+ customer base.

The transformation follows a "strangle fig" pattern: new services are built alongside legacy systems, traffic is gradually shifted, and legacy components are decommissioned only after the new system has proven stability at scale.

---

## Visual Timeline

```
Quarter     Month 1-3          Month 4-6          Month 7-9          Month 10-12        Month 13-15        Month 16-18
            Q1 Foundations      Q2 Task MVP        Q3 Workflow         Q4 Permissions      Q5 AI & Cutover    Q6 Deprecation
            ================    ================    ================    ================    ================    ================

Search      [OpenSearch         [Faceted search]    [Transaction        [Cross-entity       [AI-powered         [Benchmarking
             cluster + index]                        search]             search]              search]             analytics]

Task        [Task API v1        [Task Service       [Dependency         [Task Inbox GA      [Primary read/      [Legacy
Service      read-only]          writes + tags]      engine]             dual-write]          write cutover]      decommission]

Permissions [ReBAC              [—]                 [—]                 [ReBAC v1 +         [—]                 [Folder
             proof-of-concept]                                          migration tooling]                       deprecation]

Workflow    [—]                 [Saved Views API]   [Event-driven       [Period-over-        [Agent              [Native
                                                     workflow engine]    period]              orchestration]      calc engine]

Data        [Index existing     [Dual-read          [FloLake            [Dual-write          [Legacy read-only   [Full migration
             collections]        begins]              transaction         begins]              fallback]           complete]
                                                     bridge]

Documents   [—]                 [—]                 [Document           [—]                 [—]                 [—]
                                                     Service v1]

AI          [—]                 [—]                 [—]                 [—]                 [Unified AI          [Optimization]
                                                                                             orchestration]

Customers   [Internal only]     [3 pilot            [Pilot              [All customers      [80% migrated]      [100% migrated,
                                 customers]           expansion]          opt-in]                                  folders gone]

Team Size   [6-8 engineers]     [10-12 engineers]   [12-15 engineers]   [15-18 engineers]   [15-18 engineers]   [12-15 engineers]
```

---

## Quarterly Roadmap

---

### Q1 (Months 1-3): Foundations -- Search & Task API

**Theme:** Lay the infrastructure groundwork. Prove that search-first navigation is viable and that existing data can be aggregated into a unified task view.

#### Engineering Focus

| Work Stream | Details |
|---|---|
| **OpenSearch Cluster** | Deploy AWS-managed OpenSearch cluster (3 data nodes, 2 master nodes). Configure VPC peering with existing ECS services. Establish index templates for tasks, documents, entities, and users. |
| **Search Indexing Pipeline** | Event-driven architecture using SNS/SQS. Change Data Capture (CDC) from MongoDB/DocumentDB triggers SNS topics. SQS consumers transform and index into OpenSearch. Dead-letter queues for failed indexing. |
| **Index Existing Data** | Backfill pipeline to index historical procedures, reconciliations, compliance tasks, and flux analysis items. Estimated 100K-500K documents across the customer base. |
| **Task Service API v1** | Read-only REST API deployed on ECS. Aggregates data from existing MongoDB collections (checklist items, reconciliations, compliance tasks) into a unified task schema. No new writes -- purely a read-aggregation layer. |
| **ReBAC Proof-of-Concept** | Specification document for Relationship-Based Access Control. Proof-of-concept using SpiceDB or equivalent. Model existing folder-based permissions as relationship tuples. Evaluate performance characteristics. |

#### Product Deliverables

- Search API powering Project Catalyst's global search UI component
- Task aggregation endpoint consumed by the Phase 5 prototype for validation
- Internal demo of search-first navigation with real customer data (anonymized staging)

#### Dependencies

| Dependency | Status | Risk |
|---|---|---|
| ECS migration in progress | Active -- prerequisite for deploying new services on ECS | Medium: delays push Q1 deliverables right |
| Catalyst navigation shell | Shipping concurrently -- search UI depends on nav shell | Low: search API can be validated independently |
| MongoDB CDC availability | Requires DocumentDB streams enabled | Low: straightforward configuration |

#### Success Gate

> Search returns relevant results in **<200ms p95** across **100K+ indexed tasks**. Task aggregation API successfully merges data from 3+ MongoDB collections into a coherent task response.

#### Key Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| ECS migration delays block new service deployment | Medium | High | Fall back to Lambda-based Task Service v1; deploy OpenSearch independently |
| Search relevance is poor with existing data quality | Medium | Medium | Invest in synonym dictionaries, field boosting, and customer-specific tuning in Q1 |
| OpenSearch cluster sizing is wrong | Low | Medium | Start with auto-scaling policies; monitor and right-size in Q2 |

#### Team Sizing

- **6-8 engineers**: 2 backend (search pipeline), 2 backend (Task Service), 1 infrastructure/DevOps, 1-2 frontend (Catalyst integration)
- **1 product designer** (shared with Catalyst)
- **1 TPM** (part-time, establishing program cadence)

#### Key Decision Points

1. **OpenSearch vs. Elasticsearch**: Finalize managed service choice by Week 2
2. **Task schema v0**: Agree on the initial read-only aggregation schema by Week 4 (informs Q2 write schema)
3. **ReBAC engine selection**: SpiceDB vs. custom implementation -- decision by end of Q1

#### Rollback Strategy

- Search is an additive capability -- no existing functionality is modified. Rollback is simply not shipping the search UI.
- Task API v1 is read-only -- no data mutation risk. Can be decommissioned by removing the ECS service.

---

### Q2 (Months 4-6): Task Service MVP

**Theme:** The Task Service becomes a writable system of record for new task operations. Pilot customers begin using Task Inbox as their primary navigation surface.

#### Engineering Focus

| Work Stream | Details |
|---|---|
| **Super Task Schema** | Finalize the canonical task schema informed by Q1 read-aggregation learnings. Rich container model: sub-tasks, dependencies, documents (references), review notes, tags, agent assignments, transaction links (placeholder). |
| **Task Service Writes** | Task Service accepts create, update status, assign, add sub-task, add tag operations. Event sourcing for audit trail. All writes publish events to SNS for downstream consumers. |
| **Tag/Classification System** | Replace folder-based organization with a flexible tagging and process group system. Hierarchical tags (e.g., "Revenue > ASC 606 > Contract Review"). Auto-tag migration from existing folder paths. |
| **Saved Views API** | Personal saved views (user-specific filters/sorts), shared views (team-level), and system views (e.g., "My Open Tasks", "Overdue This Period"). Backed by a lightweight views collection in MongoDB. |
| **Search Faceting** | Add faceted search capabilities: filter by entity, status, assignee, process group, tag, due date range, priority. Facet counts returned with search results. |

#### Product Deliverables

- **Task Inbox v1**: Replaces folder navigation for pilot customers. Shows personalized task queue with search, filters, saved views. Powered by Task Service + OpenSearch.
- **Drill-down v1**: Read-only aggregated view of a single task. Pulls data from existing systems. Shows sub-tasks, documents, review status, history. No new write operations in drill-down yet.

#### Dependencies

| Dependency | Status | Risk |
|---|---|---|
| Catalyst drill-down view component | In development | Medium: drill-down v1 may ship with limited UI polish |
| Q1 Task API v1 learnings | Required for schema finalization | Low: Q1 is internal-only |

#### Success Gate

> **3 pilot customers** using Task Inbox as primary navigation with **no increase in support tickets** related to task management. Saved Views adopted by at least 1 power user per pilot customer.

#### Migration Strategy: Dual-Read

- Task Service reads from both the new task schema AND legacy MongoDB collections
- Presents a unified view to the UI -- user sees one coherent task list
- Legacy systems continue to be the source of truth for writes (except new Task Service write operations)
- Any data discrepancy between new and legacy is logged and alerted

```
                    +------------------+
                    |   Task Inbox UI  |
                    +--------+---------+
                             |
                    +--------v---------+
                    |  Task Service    |
                    |  (read from both)|
                    +--------+---------+
                             |
              +--------------+--------------+
              |                             |
    +---------v----------+      +-----------v--------+
    | New Task Schema    |      | Legacy MongoDB     |
    | (new writes here)  |      | Collections        |
    +--------------------+      | (existing writes)  |
                                +--------------------+
```

#### Key Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Pilot customers encounter data inconsistency (dual-read mismatch) | Medium | High | Real-time reconciliation job comparing new vs. legacy; alert on drift; fall back to legacy-only read |
| Tag migration from folders produces confusing taxonomy | Medium | Medium | Work with pilot customers to validate tag hierarchy before migration; allow manual re-tagging |
| Task Inbox performance degrades at scale | Low | High | Load test with 10x pilot data volume; optimize OpenSearch queries and Task Service caching |

#### Team Sizing

- **10-12 engineers**: 3 backend (Task Service writes + events), 2 backend (search faceting + saved views), 2 frontend (Task Inbox + drill-down), 1 infrastructure, 1 data migration, 1 QA
- **1 product designer** (dedicated)
- **1 TPM** (full-time)

#### Key Decision Points

1. **Pilot customer selection**: Identify 3 customers (small, mid, large) willing to participate by Week 1 of Q2
2. **Tag taxonomy depth**: How many levels of hierarchy? Decision by Week 2
3. **Event sourcing vs. CRUD+events**: Finalize Task Service persistence strategy by Week 3

#### Rollback Strategy

- Pilot customers can be switched back to folder navigation via feature flag (instant rollback)
- Task Service writes are additive -- legacy systems are unmodified
- If dual-read produces unacceptable inconsistency, revert Task Inbox to legacy-only reads

---

### Q3 (Months 7-9): Workflow Engine & Transaction Bridge

**Theme:** Automation enters the picture. Tasks start reacting to data events automatically. The transaction-to-task bridge closes the gap between accounting data and close management.

#### Engineering Focus

| Work Stream | Details |
|---|---|
| **Event-Driven Workflow Engine** | Replace static Step Functions routing with a configurable workflow engine. Tasks transition states based on events (e.g., "all sub-tasks complete" triggers "ready for review"; "GL data received" triggers "data available"). Rules configurable per customer/entity. |
| **Dependency Engine** | Cross-task dependency graph stored in the Task Service. Automatic status propagation: when a blocking task completes, dependent tasks move to "ready". Cycle detection. Parallel vs. sequential dependency support. |
| **Transaction-Task Bridge** | Connect FloLake Silver Layer GL transaction data to tasks. Each task can reference specific GL accounts/transactions. Match status, variance calculations, and flux analysis data flow into the task context. |
| **Document Service v1** | Decouple document storage and retrieval from folder-based sync. Documents become first-class objects linked to tasks (many-to-many). Existing S3 storage backend, new metadata service. Support for multiple document sources (upload, ERP sync, email attachment). |

#### Product Deliverables

- Automated task status transitions visible in Task Inbox (tasks move states without manual intervention)
- Transaction table in drill-down view (linked GL data with match status, variance flags)
- Dependency visualization in close timeline (which tasks block which, critical path highlighting)

#### Dependencies

| Dependency | Status | Risk |
|---|---|---|
| FloLake Silver Layer availability | In development | High: transaction bridge depends on this entirely |
| Q2 Task Service write stability | Must be proven in pilot | Medium: workflow engine writes depend on Task Service |

#### Success Gate

> **50%+ of task state transitions** are automated (no manual status change required). Transactions linked for all pilot customer entities. Dependency graph correctly models at least one pilot customer's full close process.

#### Key Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| FloLake Silver Layer not ready | Medium | High | Build transaction bridge with mock data; switch to live when available; degrade gracefully (drill-down shows "transaction data pending") |
| Workflow engine rules are too complex for customers to configure | Medium | Medium | Ship with pre-built rule templates for common patterns; custom rules in Phase 2 |
| Dependency graph creates infinite loops or incorrect propagation | Low | High | Cycle detection at write time; propagation runs with circuit breaker (max 10 hops); manual override always available |
| Document Service migration disrupts existing document access | Medium | High | Document Service reads from existing S3 paths; no data migration required initially; new metadata layer is additive |

#### Team Sizing

- **12-15 engineers**: 3 backend (workflow engine), 2 backend (dependency engine), 2 backend (transaction bridge + FloLake integration), 2 backend (Document Service), 2 frontend (timeline + drill-down enhancements), 1 infrastructure, 1 QA
- **1 product designer** (dedicated)
- **1 TPM** (full-time)
- **1 data engineer** (FloLake integration)

#### Key Decision Points

1. **Workflow engine technology**: Custom engine vs. Temporal.io vs. AWS Step Functions v2 -- decision by Week 2
2. **Transaction matching strategy**: Real-time matching vs. batch reconciliation -- decision by Week 4
3. **Dependency graph storage**: Adjacency list in MongoDB vs. graph database (Neptune) -- decision by Week 3

#### Rollback Strategy

- Workflow engine is opt-in per customer -- disable via feature flag; tasks revert to manual status changes
- Transaction bridge is read-only from FloLake -- no data mutation risk
- Document Service maintains backward compatibility with existing S3 paths; can revert to legacy document access

---

### Q4 (Months 10-12): Permissions & Expanded Rollout

**Theme:** The hardest problem -- permissions decoupled from folders. Parallel evaluation ensures zero access control regressions. Task Inbox goes GA.

#### Engineering Focus

| Work Stream | Details |
|---|---|
| **ReBAC Service v1** | Relationship-Based Access Control service deployed on ECS. Models permissions as relationships (user -> role -> resource) rather than folder containment. Supports hierarchical roles (entity admin, process group reviewer, task assignee). |
| **Permission Migration Tooling** | Parallel evaluation engine: every permission check runs against BOTH legacy folder-based system AND new ReBAC. Results compared; discrepancies logged with full context. Dashboard showing agreement rate. |
| **Task Inbox GA** | Task Inbox available to all Close customers via feature flag. Opt-in initially. Folder navigation remains available as fallback. Customer success-assisted onboarding for early adopters. |
| **Dual-Write Migration** | All writes go to both legacy MongoDB collections AND Task Service. Consistency checker validates both stores stay in sync. This is the critical bridge to eventual legacy decommission. |

#### Product Deliverables

- Admin permission management UI: role-based permission assignment, not folder-based. Visual representation of who can access what.
- Task Inbox available to all customers (opt-in via feature flag, on by default for new customers)
- Period-over-period comparison in close timeline (compare current close progress to last month, last quarter, same period last year)

#### Dependencies

| Dependency | Status | Risk |
|---|---|---|
| Q3 workflow engine stability | Must handle production load | Medium: GA launch depends on workflow reliability |
| Customer Success capacity | Need onboarding support for broad rollout | Medium: coordinate with CS leadership |

#### Success Gate

> ReBAC produces **identical access decisions** as legacy system for **99.9%+ of evaluations** across all pilot customers. Dual-write consistency at 99.99%+.

#### Key Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| ReBAC disagrees with legacy permissions (false deny or false allow) | High | Critical | Parallel evaluation runs in shadow mode for 4+ weeks before any cutover; discrepancies trigger alerts; manual review of every disagreement |
| Dual-write introduces data consistency issues | Medium | High | Consistency checker runs continuously; any drift triggers alert; writes can be paused and replayed from event log |
| GA rollout causes support ticket spike | Medium | Medium | Phased rollout (5% -> 20% -> 50% -> 100% over 6 weeks); dedicated support channel for Task Inbox issues |
| Permission migration mismodels edge cases (e.g., shared folders, cross-entity access) | Medium | Critical | Exhaustive mapping of all legacy permission patterns in Q1-Q3; integration tests for every edge case; security review |

#### Team Sizing

- **15-18 engineers**: 3 backend (ReBAC service), 2 backend (permission migration tooling), 2 backend (dual-write infrastructure), 3 backend (Task Service stability + performance), 3 frontend (admin UI + GA polish), 1 infrastructure, 1 security engineer, 1 QA
- **1 product designer** (dedicated)
- **1 TPM** (full-time)
- **1 security lead** (ReBAC review)

#### Key Decision Points

1. **ReBAC cutover timing**: Shadow mode duration before any customer sees ReBAC decisions -- minimum 4 weeks, extend if disagreement rate > 0.1%
2. **GA rollout pace**: Aggressive (all customers in 4 weeks) vs. conservative (8 weeks) -- decision based on Q3 pilot expansion results
3. **Dual-write consistency threshold**: What disagreement rate triggers a pause? Recommend 0.01%

#### Rollback Strategy

- ReBAC runs in shadow mode only -- legacy permissions remain authoritative until explicit cutover
- Task Inbox GA is feature-flagged -- disable for any customer instantly
- Dual-write can be disabled per customer, reverting to legacy-only writes
- Permission migration tooling includes a "rollback report" showing what would change if reverted

---

### Q5 (Months 13-15): AI Orchestration & Full Vision

**Theme:** AI agents become first-class participants in the close process. The system begins to shift from human-driven to human-supervised.

#### Engineering Focus

| Work Stream | Details |
|---|---|
| **Unified AI Orchestration Layer** | Consolidate the existing 5 fragmented AI services (AutoRec suggestions, flux analysis, compliance extraction, document classification, anomaly detection) into a single orchestration layer. Common model registry, prompt management, and evaluation framework. |
| **Agent Assignment Engine** | Auto-assign routine sub-tasks to AI agents based on task type, complexity score, and historical accuracy. Assignment rules configurable per customer. Human-in-the-loop review required for all agent outputs initially. |
| **Agent Execution History & ROI** | Full audit trail of agent actions. Time-saved calculations per task, per entity, per month. Cost tracking (API calls, compute). ROI dashboard aggregating savings. |
| **Read/Write Cutover** | Task Service becomes the primary read/write system. Legacy MongoDB collections become read-only fallback. All new features built exclusively against Task Service. Legacy reads maintained for data not yet migrated. |

#### Product Deliverables

- AI-completed sub-tasks visible in drill-down (with "completed by agent" badge, one-click approve/reject)
- Agent ROI dashboard for managers (hours saved, accuracy rate, cost, trending)
- Predictive close date estimation (ML model trained on historical close data)
- "Ask FloQast" AI assistant with full task context (natural language queries against task data)

#### Dependencies

| Dependency | Status | Risk |
|---|---|---|
| AI model maturity (OpenAI/Bedrock) | Evolving | Medium: model capabilities may limit agent accuracy |
| Q4 dual-write stability | Must be proven at scale | Medium: cutover depends on write consistency |
| Customer trust in AI | Varies by customer | Medium: conservative customers may resist agent assignment |

#### Success Gate

> **15+ hours per entity per month saved** via agent automation across pilot customers. Agent accuracy (first-review approval rate) at **90%+**. Read/write cutover complete for 80%+ of customers with zero data loss.

#### Key Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| AI agents produce incorrect work, eroding customer trust | Medium | Critical | Mandatory human review for all agent outputs in V1; confidence scoring; auto-escalation on low-confidence tasks |
| Read/write cutover causes data loss or inconsistency | Low | Critical | Extensive dry-run testing; customer-by-customer cutover with 24-hour monitoring; instant rollback to dual-write |
| Unified AI layer introduces latency in existing AI features | Medium | Medium | Performance budget per AI operation; circuit breakers; fallback to direct model calls |
| ROI metrics are unconvincing (savings too low) | Medium | High | Validate ROI model with pilot customers before broad claims; focus agents on highest-value repetitive tasks |

#### Team Sizing

- **15-18 engineers**: 4 ML/AI engineers (orchestration + agent engine), 3 backend (cutover infrastructure + Task Service), 2 backend (ROI metrics + analytics), 3 frontend (agent UX + ROI dashboard + Ask FloQast), 1 infrastructure, 1 data scientist (predictive models), 1 QA
- **1 product designer** (dedicated)
- **1 TPM** (full-time)
- **1 AI/ML lead** (model evaluation and governance)

#### Key Decision Points

1. **Agent autonomy level**: Fully autonomous (auto-complete + auto-approve for high-confidence tasks) vs. always human-in-the-loop -- decision by Week 4 based on accuracy data
2. **Cutover sequencing**: By customer size (small first) vs. by customer readiness -- decision by Week 2
3. **AI model selection**: Per-task-type model selection vs. single foundation model -- decision by Week 3

#### Rollback Strategy

- AI agents can be disabled per customer via feature flag; sub-tasks revert to manual assignment
- Read/write cutover is reversible: re-enable dual-write, replay events to resync legacy collections
- Unified AI layer maintains backward-compatible API; individual AI services can be re-enabled independently
- ROI dashboard is purely analytical -- no rollback needed

---

### Q6+ (Months 16-18): Optimization & Folder Deprecation

**Theme:** The finish line. Folders are fully deprecated. The platform delivers the "IDE for Accountants" vision.

#### Engineering Focus

| Work Stream | Details |
|---|---|
| **Legacy Checklist Service Decommission** | Remove legacy checklist service after confirming zero active reads/writes. Archive data. Remove CDC pipelines that fed the dual-read/dual-write infrastructure. |
| **Folder Concept Deprecation** | Remove folder hierarchy from all UI surfaces. Tags, process groups, and saved views fully replace folder-based organization. Admin tools for customers still mentally mapped to folders (training, migration guides). |
| **Native Calculation Engine** | Embed spreadsheet-like calculation capabilities within tasks. Users can perform variance analysis, roll-forwards, and reconciliation math without leaving the task context. Replaces Excel round-tripping. |
| **Analytics Service v2** | Cross-entity trending and benchmarking. Compare close performance across entities, periods, and (anonymized) peer companies. Powered by Snowflake analytics and the Task Service event store. |
| **Performance Optimization** | Read replicas for Task Service. Aggressive caching (Redis/ElastiCache) for frequently accessed tasks and search results. CDN for static assets. Target: sub-100ms for all primary user actions. |

#### Product Deliverables

- Full "IDE for Accountants" experience: task-centric workspace with integrated search, workflow automation, AI agents, document management, and calculation capabilities
- Cross-entity health dashboard: real-time view of close progress across all entities, with drill-down to bottlenecks
- Benchmarking across customer base (anonymized): "Your close takes 6 days; similar companies average 4.5 days"
- Mobile-optimized views: responsive task inbox and drill-down for on-the-go close management

#### Dependencies

| Dependency | Status | Risk |
|---|---|---|
| Q5 cutover completion (80%+ customers) | Must be complete | Medium: remaining 20% may have complex migration needs |
| Customer communication and training | Requires CS coordination | Medium: folder deprecation is a behavioral change |

#### Success Gate

> **Zero customer-facing features depend on folder hierarchy**. Legacy checklist service fully decommissioned. All 3,500+ customers on Task Service. Performance targets met (p95 <200ms for all primary actions).

#### Key Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Customers resist folder deprecation ("we organized our close around folders") | High | Medium | Extended transition period; saved views that mirror folder structure; dedicated CSM support; training materials |
| Legacy decommission reveals hidden dependencies | Medium | High | Comprehensive dependency mapping before decommission; canary decommission (disable for 1 week, monitor for errors, then delete) |
| Calculation engine scope creep (trying to replace Excel entirely) | Medium | Medium | V1 scope limited to common accounting calculations (variance, roll-forward, balance comparison); full spreadsheet is a future phase |
| Performance optimization is insufficient at scale | Low | Medium | Load testing at 2x current scale; auto-scaling policies; progressive enhancement (fast basics, lazy-load advanced features) |

#### Team Sizing

- **12-15 engineers** (ramping down): 2 backend (legacy decommission), 2 backend (calculation engine), 2 backend (analytics v2), 2 frontend (IDE experience + mobile), 2 performance engineering, 1 infrastructure, 1 QA
- **1 product designer** (dedicated)
- **1 TPM** (part-time, transitioning to BAU)

#### Key Decision Points

1. **Folder deprecation timeline**: Hard cutoff date vs. indefinite dual-mode -- recommend hard cutoff 6 months after GA (end of Q6)
2. **Calculation engine scope**: What calculations are in-scope for V1? Decision by Week 2
3. **Benchmarking opt-in**: Require explicit customer opt-in for anonymized benchmarking -- decision by Week 4

#### Rollback Strategy

- Folder deprecation is the one irreversible milestone. Mitigation: maintain folder metadata in cold storage for 12 months post-deprecation; UI can re-render folder views from tags if absolutely necessary
- Legacy decommission follows a "dark launch" pattern: disable all traffic for 2 weeks before deleting infrastructure
- Calculation engine is additive -- no rollback needed
- Analytics v2 is additive -- v1 analytics remain available

---

## Cross-Cutting Concerns

### Data Migration Strategy

The overall migration follows a four-phase pattern applied across all quarters:

```
Phase 1: Dual-Read       (Q2)    New service reads from both new + legacy
Phase 2: Dual-Write      (Q4)    Writes go to both new + legacy
Phase 3: Primary Cutover (Q5)    New service is primary; legacy is fallback
Phase 4: Decommission    (Q6)    Legacy is removed
```

At every phase boundary, a consistency check must pass before advancing:
- Dual-Read: <0.1% data discrepancy rate
- Dual-Write: <0.01% write consistency failure rate
- Primary Cutover: Zero data loss in 2-week canary period
- Decommission: Zero active reads from legacy for 2 consecutive weeks

### Feature Flag Strategy

Every new capability is gated behind feature flags with the following levels:

| Level | Description | Usage |
|---|---|---|
| Internal Only | FloQast employees only | Q1 features |
| Pilot | Named customer accounts | Q2-Q3 features |
| Early Access | Opt-in for any customer | Q4 features |
| GA | On by default, opt-out available | Q4+ features |
| Mandatory | No opt-out | Q6 features (post-folder deprecation) |

### Observability Requirements

Every new service must ship with:
- Structured logging (JSON, correlation IDs)
- Distributed tracing (AWS X-Ray or OpenTelemetry)
- Custom CloudWatch metrics (latency histograms, error rates, business metrics)
- Alerting (PagerDuty integration) for p95 latency breaches and error rate spikes
- Dashboards in Datadog or CloudWatch showing service health

### Security Considerations

- All new services undergo security review before production deployment
- ReBAC permission changes require approval from security lead
- AI agent outputs are logged for audit compliance (SOC 2, SOX)
- Data encryption at rest (S3, MongoDB, OpenSearch) and in transit (TLS 1.2+)
- PII handling follows existing FloQast data classification policies

---

## Team Scaling Summary

| Quarter | Engineers | Designers | TPM | Specialists | Total |
|---|---|---|---|---|---|
| Q1 | 6-8 | 1 (shared) | 1 (part-time) | -- | 8-10 |
| Q2 | 10-12 | 1 | 1 | -- | 12-14 |
| Q3 | 12-15 | 1 | 1 | 1 data engineer | 15-18 |
| Q4 | 15-18 | 1 | 1 | 1 security lead | 18-21 |
| Q5 | 15-18 | 1 | 1 | 1 AI/ML lead, 1 data scientist | 19-22 |
| Q6 | 12-15 | 1 | 1 (part-time) | -- | 14-17 |

**Hiring Plan:**
- Q1: Staff with existing engineers redeployed from completed initiatives
- Q2: Hire 2-4 additional backend engineers, 1 dedicated designer
- Q3: Hire 1 data engineer (FloLake integration), backfill as needed
- Q4: Engage security lead (internal or contract), hire 2-3 frontend engineers
- Q5: Hire or contract 2 ML engineers, 1 data scientist
- Q6: Begin transition of engineers to other initiatives as decommission completes

---

## Decision Log Template

Each key decision should be recorded using this template:

| Field | Content |
|---|---|
| **Decision** | [What was decided] |
| **Date** | [When] |
| **Deciders** | [Who was involved] |
| **Context** | [Why this decision was needed] |
| **Options Considered** | [What alternatives were evaluated] |
| **Rationale** | [Why this option was chosen] |
| **Consequences** | [What changes as a result] |
| **Revisit Trigger** | [Under what conditions should this be reconsidered] |

---

## Appendix: Quarterly Success Gate Summary

| Quarter | Success Gate | Measurable Target |
|---|---|---|
| Q1 | Search performance | <200ms p95 across 100K+ tasks |
| Q2 | Pilot adoption | 3 customers, no support ticket increase |
| Q3 | Automation rate | 50%+ automated state transitions |
| Q4 | Permission parity | 99.9%+ agreement between ReBAC and legacy |
| Q5 | AI ROI | 15+ hours saved per entity per month |
| Q6 | Folder independence | Zero features depend on folder hierarchy |
