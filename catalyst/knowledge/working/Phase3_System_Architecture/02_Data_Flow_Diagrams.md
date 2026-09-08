# Data Flow Diagrams: Proposed FloQast Close Architecture

**Purpose:** Define the end-to-end data flows for the proposed task-centric Close architecture. Each flow traces data from origin through processing to final consumption, illustrating the event-driven, service-oriented design that replaces the current tightly-coupled Lambda architecture.

**Companion Documents:**
- Phase2: `02_Super_Task_Model_Specification.md` (entity definitions)
- Phase2: `03_Target_State_ERD.md` (entity relationships)
- Phase2: `06_Transaction_Task_Bridge.md` (FloLake integration)
- Source: `03_Technical_Architecture_Confluence.md` (current state reference)

---

## 1. ERP Ingestion Flow

### Context

Today, Close pulls ERP data through a fragmented set of GL Provider Lambdas -- `fq-gl-netsuite`, `fq-gl-ms-dynamics`, `fq-gl-sap`, and `fq-gl-tb` -- each with its own connector logic, credential management (`fq-gl-creds-lambda`), and data format. Trial balance data flows directly into checklist items and reconciliations via these per-ERP Lambdas, with no shared normalization layer. The Reporting team independently pulls the same ERP data through its own connectors into FloLake.

The proposed architecture eliminates the per-ERP GL Provider Lambdas for Close and instead consumes normalized transaction data from FloLake's Silver Layer. This creates a single source of truth shared between Close, Reporting, and any future product.

### Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    participant ERP as ERP System<br/>(NetSuite, SAP, D365)
    participant Bronze as FloLake<br/>Bronze Layer
    participant Silver as FloLake<br/>Silver Layer
    participant SNS as SNS Topic<br/>(transactions_updated)
    participant TaskSvc as Task Service<br/>(ECS)
    participant DB as Task DB<br/>(DocumentDB)
    participant Agent as AI Matching<br/>Agent
    participant WS as AppSync<br/>(WebSocket)
    participant UI as Close UI

    Note over ERP,Bronze: Scheduled sync (daily / hourly / 15-min configurable)
    ERP->>Bronze: Raw ERP extract (GL transactions,<br/>trial balance, chart of accounts)
    Bronze->>Bronze: Store raw data per connector format
    Bronze->>Silver: Normalization pipeline executes
    Silver->>Silver: Transform to normalized transaction schema:<br/>accountId, entityId, periodId, amount, currency,<br/>transactionDate, dimensions (FDM-mapped)

    Silver->>SNS: Publish event:<br/>{ event: "transactions_updated",<br/>  tenantId, entityId, periodId,<br/>  accounts: ["1010","2010","4010"],<br/>  transactionCount: 47 }

    SNS->>TaskSvc: SQS subscription delivers event

    Note over TaskSvc,DB: For each affected account + period
    TaskSvc->>DB: Query: Find SuperTasks WHERE<br/>accountId IN accounts AND periodId = periodId
    DB-->>TaskSvc: Matching SuperTasks (e.g., "Bank Rec 1010")

    TaskSvc->>Silver: Fetch latest transactions for account + period
    Silver-->>TaskSvc: Normalized transaction set

    TaskSvc->>DB: Upsert TransactionLinks<br/>(create new, update existing, mark removed)
    TaskSvc->>DB: Recalculate ReconciliationData.glBalance<br/>= SUM(transaction amounts)

    alt Balance changed post sign-off
        TaskSvc->>DB: Emit StatusEvent: data_changed_post_signoff<br/>Task status transitions to "redo"
        TaskSvc->>DB: Log StatusTransition (immutable audit record)
    end

    alt New unmatched transactions arrived
        TaskSvc->>Agent: Trigger AI matching agent<br/>for reconciliation task
        Agent-->>TaskSvc: Match results (auto_matched,<br/>exception, unmatched)
        TaskSvc->>DB: Update TransactionLink.matchStatus
        TaskSvc->>DB: Recalculate reconciledBalance
    end

    TaskSvc->>WS: Push notification:<br/>{ taskId, type: "balance_updated",<br/>  glBalance: $2,345,678,<br/>  previousBalance: $2,345,500,<br/>  newTransactions: 3 }
    WS->>UI: Real-time update to task drill-down
```

### Flowchart: ERP Ingestion Decision Logic

```mermaid
flowchart TD
    A[FloLake Silver Layer<br/>publishes transactions_updated] --> B{Task Service<br/>receives event}
    B --> C[Query SuperTasks by<br/>accountId + periodId]
    C --> D{Any matching<br/>SuperTasks?}
    D -->|No| E[Log event, no action needed]
    D -->|Yes| F[Fetch latest transactions<br/>from Silver Layer]
    F --> G[Upsert TransactionLinks]
    G --> H[Recalculate GL Balance]
    H --> I{Task has active<br/>sign-offs?}
    I -->|No| J[Update balance,<br/>notify UI]
    I -->|Yes| K{Balance<br/>changed?}
    K -->|No| L[No disruption,<br/>notify UI of refresh]
    K -->|Yes| M[Trigger redo event<br/>Revoke sign-offs<br/>Log StatusTransition]
    M --> N{Reconciliation<br/>type task?}
    J --> N
    L --> N
    N -->|Yes| O[Trigger AI Matching<br/>Agent for new transactions]
    N -->|No| P[Update search index]
    O --> Q[Update match results<br/>and reconciled balance]
    Q --> P
    P --> R[Push WebSocket<br/>notification to UI]
```

### What This Replaces

| Current State | Proposed State |
|---|---|
| `fq-gl-netsuite` Lambda pulls NetSuite TB directly | FloLake Bronze to Silver normalizes NetSuite data |
| `fq-gl-ms-dynamics` Lambda pulls D365 TB directly | FloLake Bronze to Silver normalizes D365 data |
| `fq-gl-sap` Lambda pulls SAP TB directly | FloLake Bronze to Silver normalizes SAP data |
| `fq-gl-tb` Lambda handles generic TB import | FloLake handles all connectors with unified schema |
| Each Lambda writes to `procedures` collection directly | Task Service consumes SNS events, updates SuperTasks |
| `#FQ` anchor tag scans Excel for reconciled balance | Balance computed from FloLake transactions in real time |
| Per-ERP credential management via `fq-gl-creds-lambda` | FloLake manages all ERP credentials centrally |
| Close and Reporting pull ERP data independently | Single FloLake ingestion serves both products |

---

## 2. Task State Transition Flow

### Context

The current checklist system relies on manual status toggling. Users click sign-off buttons, and status is directly set. There is no formal state machine, no dependency evaluation, and no event propagation. The proposed architecture introduces an event-driven status machine where every state change is a response to a concrete event, dependency chains cascade automatically, and every transition is logged immutably for audit compliance.

### Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    participant Actor as User / Agent /<br/>System Event
    participant API as Task Service<br/>API Layer
    participant SM as Status Machine<br/>Engine
    participant DB as Task DB<br/>(DocumentDB)
    participant Dep as Dependency<br/>Evaluator
    participant Notify as Notification<br/>Service
    participant Search as Search Service
    participant Analytics as Analytics<br/>Service (Snowflake)

    Actor->>API: Action (e.g., preparer_signed,<br/>agent_completed, data_changed_post_signoff)

    API->>API: Validate: auth, permissions (ReBAC),<br/>business rules (all sub-tasks complete?)

    API->>SM: Submit StatusEvent

    SM->>SM: Evaluate current state +<br/>event against transition rules
    SM->>SM: Compute new status<br/>(e.g., in_progress to pending_review)

    SM->>DB: Write StatusTransition:<br/>{ taskId, fromStatus, toStatus,<br/>  event, actorId, timestamp,<br/>  metadata }

    SM->>DB: Update SuperTask.status

    alt Event is a sign-off
        SM->>DB: Write Signature record:<br/>{ taskId, signatureType,<br/>  userId, timestamp, signatureHash }
    end

    SM->>Dep: Evaluate downstream dependencies

    Note over Dep,DB: Check: Which tasks depend<br/>on this task completing?
    Dep->>DB: Query Dependencies WHERE<br/>targetTaskId = this task
    DB-->>Dep: Dependent tasks list

    loop For each dependent task
        Dep->>Dep: Evaluate dependency condition<br/>(finish_to_start, data_dependency, etc.)
        alt Dependency now met
            Dep->>SM: Submit StatusEvent:<br/>dependency_met for dependent task
            SM->>DB: Transition dependent task<br/>from blocked to previous state
            SM->>DB: Log StatusTransition
        end
    end

    par Async fan-out
        SM->>Notify: Send notifications<br/>(in-app, email, Slack/Teams)
        SM->>Search: Emit task_updated event<br/>for search index
        SM->>Analytics: Emit event to Snowflake<br/>Gold Layer pipeline
    end

    Notify->>Actor: Task 'Bank Rec 1010' moved<br/>to Pending Review
```

### Flowchart: Status Machine Evaluation

```mermaid
flowchart TD
    A[StatusEvent received] --> B[Validate actor permissions<br/>via ReBAC]
    B --> C{Authorized?}
    C -->|No| D[Return 403 Forbidden<br/>Log unauthorized attempt]
    C -->|Yes| E[Load current SuperTask state]
    E --> F{Valid transition?<br/>current state + event}
    F -->|No| G[Return 409 Conflict<br/>with explanation]
    F -->|Yes| H[Compute new status]
    H --> I[Write StatusTransition<br/>to audit log]
    I --> J[Update SuperTask.status]
    J --> K{Is sign-off event?}
    K -->|Yes| L[Write Signature record<br/>with cryptographic hash]
    K -->|No| M[Continue]
    L --> M
    M --> N[Evaluate dependencies]
    N --> O{Any dependent tasks<br/>unblocked?}
    O -->|Yes| P[Cascade: submit dependency_met<br/>events for each unblocked task]
    O -->|No| Q[Continue]
    P --> Q
    Q --> R[Emit to Notification Service]
    Q --> S[Emit to Search Service]
    Q --> T[Emit to Analytics pipeline]

    subgraph Cascade Chain
        P --> P1[Dependent Task A<br/>evaluates its own transition]
        P1 --> P2{Does Task A completing<br/>unblock further tasks?}
        P2 -->|Yes| P3[Continue cascading<br/>through dependency graph]
        P2 -->|No| P4[Cascade terminates]
    end
```

### Valid State Transitions

| Current Status | Event | New Status | Notes |
|---|---|---|---|
| `not_started` | `sub_task_started` | `in_progress` | First sub-task begins |
| `not_started` | `agent_started` | `agent_working` | AI agent begins processing |
| `agent_working` | `agent_completed` | `in_progress` | Agent done, human work remains |
| `in_progress` | `preparer_signed` | `pending_review` | Requires all sub-tasks complete |
| `pending_review` | `reviewer_signed` | `completed` | All required signatures obtained |
| `pending_review` | `review_note_created` | `changes_requested` | Reviewer sends back |
| `changes_requested` | `sub_task_started` | `in_progress` | Preparer resumes work |
| `completed` | `data_changed_post_signoff` | `redo` | Balance or data drift detected |
| `redo` | `sub_task_started` | `in_progress` | Re-work begins |
| *any* | `dependency_broken` | `blocked` | Upstream dependency no longer met |
| `blocked` | `dependency_met` | *previous state* | Restored to pre-blocked state |
| *any* | `task_skipped` | `skipped` | Intentionally excluded this period |

### Cascade Example: Month-End Sign-Off Chain

```
Revenue Accrual JE (preparer_signed -> pending_review -> reviewer_signed -> completed)
  |__ triggers dependency_met on:
      Revenue Variance Analysis (blocked -> not_started -> in_progress)
        |__ when completed, triggers dependency_met on:
            CFO Revenue Review (blocked -> not_started)
              |__ when completed, triggers dependency_met on:
                  Period Close Certification (blocked -> not_started)
```

This cascade replaces manual "traffic light" status indicators with automatic, auditable event propagation.

---

## 3. Search Indexing Flow

### Context

FloQast Close has no search infrastructure today. Users navigate exclusively through the folder hierarchy, entity/period selectors, and the checklist grid. Global Checklist and Global Reconciliation views provide cross-entity filtering, but only on predefined columns. There is no full-text search, no faceted filtering by tags, no search across review notes or document names, and no saved search queries.

The proposed architecture introduces a dedicated Search Service as a critical new capability, consuming events from the Task Service and maintaining a purpose-built search index. This is what enables the "search-first navigation" that Project Catalyst proposes and that both Mike Whitmire and Carlos Avila identified as the primary solution to navigation complexity.

### Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    participant TaskSvc as Task Service<br/>(ECS)
    participant Events as Event Bus<br/>(SNS/SQS)
    participant SearchSvc as Search Service<br/>(ECS)
    participant Index as Search Index<br/>(OpenSearch)
    participant UI as Close UI
    participant API as Search API

    Note over TaskSvc,Events: Events emitted on every task lifecycle change

    alt Task Created
        TaskSvc->>Events: task_created<br/>{ SuperTask full document }
    else Task Updated
        TaskSvc->>Events: task_updated<br/>{ taskId, changedFields, newValues }
    else Task Deleted
        TaskSvc->>Events: task_deleted<br/>{ taskId }
    else Sub-Task Changed
        TaskSvc->>Events: subtask_updated<br/>{ taskId, subTaskId, status }
    else Review Note Added
        TaskSvc->>Events: review_note_created<br/>{ taskId, noteId, content }
    else Document Attached
        TaskSvc->>Events: document_attached<br/>{ taskId, docId, fileName }
    end

    Events->>SearchSvc: SQS delivers event batch

    SearchSvc->>SearchSvc: Transform event to<br/>search document schema

    SearchSvc->>Index: Index/update/delete document

    Note over Index: Search document includes:<br/>- Task title, description<br/>- Entity name, process group<br/>- Tags (all), status<br/>- Assignee names (preparer, reviewer)<br/>- Account ID + name<br/>- Review note content (full text)<br/>- Document file names<br/>- Sub-task titles<br/>- Due date, completion date<br/>- Period (YYYY-MM)

    Note over UI,API: User initiates search

    UI->>API: Search request:<br/>{ query: "bank rec",<br/>  filters: {<br/>    status: ["in_progress","pending_review"],<br/>    entity: ["Entity A"],<br/>    processGroup: ["Cash and Banking"],<br/>    assignee: ["sarah@example.com"],<br/>    period: ["2026-02"],<br/>    tags: ["high-risk"]<br/>  },<br/>  sort: "dueDate:asc" }

    API->>Index: Translated search query<br/>(text match + facet filters)
    Index-->>API: Ranked results with<br/>facet counts and highlights

    API-->>UI: Search response:<br/>{ results: [...SuperTaskSummaries],<br/>  facets: {<br/>    status: { in_progress: 12, pending_review: 5 },<br/>    processGroup: { "Cash and Banking": 8, AP: 9 },<br/>    entity: { "Entity A": 17 }<br/>  },<br/>  total: 17,<br/>  query_time_ms: 42 }
```

### Flowchart: Search Document Indexing Logic

```mermaid
flowchart TD
    A[Event arrives at<br/>Search Service] --> B{Event Type}

    B -->|task_created| C[Build full search document<br/>from SuperTask]
    B -->|task_updated| D[Partial update: merge<br/>changed fields into existing doc]
    B -->|task_deleted| E[Remove document from index]
    B -->|subtask_updated| F[Update sub-task section<br/>of parent task document]
    B -->|review_note_created| G[Append review note content<br/>to full-text fields]
    B -->|document_attached| H[Add document filename<br/>to searchable fields]

    C --> I[Write to search index]
    D --> I
    E --> J[Delete from search index]
    F --> I
    G --> I
    H --> I

    I --> K[Index updated]
    J --> K

    K --> L[Ready for queries]

    subgraph Query Capabilities
        L --> M[Full-Text Search<br/>bank reconciliation operating]
        L --> N[Faceted Filtering<br/>status + entity + process group +<br/>tags + assignee + date range]
        L --> O[Saved Searches<br/>My overdue high-risk tasks]
        L --> P[Aggregations<br/>Tasks per entity per status]
        L --> Q[Autocomplete<br/>Type-ahead on task titles,<br/>account names, tag names]
    end
```

### Search Index Document Schema

```json
{
  "taskId": "st-abc-123",
  "tenantId": "tlc-001",
  "title": "Bank Rec - Operating Account 1010",
  "taskType": "reconciliation",
  "status": "pending_review",
  "entityId": "entity-a",
  "entityName": "Entity A",
  "periodId": "2026-02",
  "processGroup": "Cash & Banking",
  "accountId": "1010",
  "accountName": "Operating Cash Account",
  "preparerId": "user-sarah",
  "preparerName": "Sarah Chen",
  "reviewerId": "user-david",
  "reviewerName": "David Park",
  "dueDate": "2026-02-15",
  "completedDate": null,
  "tags": ["high-risk", "SOX-material", "intercompany"],
  "subTaskTitles": [
    "Import bank transactions",
    "Import GL transactions",
    "Match transactions",
    "Review exceptions",
    "Verify materiality",
    "Preparer sign-off",
    "Reviewer sign-off"
  ],
  "reviewNoteContent": "Please verify the three unmatched items...",
  "documentNames": ["Feb_2026_Bank_Statement.pdf", "Matching_Summary.xlsx"],
  "glBalance": 2345678.00,
  "variance": 178.50,
  "isOverdue": false,
  "fullText": "Bank Rec Operating Account 1010 Cash Banking high-risk..."
}
```

### What This Enables

| Capability | Current State | With Search Service |
|---|---|---|
| Find a task by name | Navigate entity, then period, then folder, then scan grid | Type "bank rec" in global search bar |
| Filter by tag | Limited tag filtering within a single folder view | Faceted filter across all entities and periods |
| Find tasks by assignee | Use "Assigned to Me" toggle per entity | Search "assignee:sarah" across entire organization |
| Find review notes | Navigate to specific task, then open review notes panel | Full-text search across all review note content |
| Cross-entity view | Global Checklist with limited column filters | Faceted search with entity as a filter dimension |
| Saved views | Not supported | Save search queries as bookmarks |

---

## 4. AI Agent Execution Flow

### Context

FloQast currently operates five separate AI services with different providers (OpenAI and AWS Bedrock), different runtimes (Node.js and Python), and independent deployment patterns. There is no unified orchestration layer -- AI Matching calls OpenAI directly, FloQL calls Bedrock directly, Checkmate calls OpenAI directly, and the Monitors Agent runs as a standalone Bedrock Agent. Each service independently manages model selection, prompt engineering, error handling, and execution logging.

The proposed architecture introduces a unified AI Orchestration layer that routes agent requests to the appropriate model, enforces tenant isolation, records execution metrics for ROI calculation, and integrates agent results directly into the Super Task model (via AgentExecution records and SubTask status updates).

### Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    participant Trigger as Trigger Source
    participant TaskSvc as Task Service<br/>(ECS)
    participant Orch as AI Orchestration<br/>Service (ECS)
    participant Router as Model Router
    participant OpenAI as OpenAI API<br/>(GPT-4o)
    participant Bedrock as AWS Bedrock<br/>(Claude 3.5 Sonnet)
    participant Sandbox as Code Runner<br/>(Isolated Lambda)
    participant DB as Task DB
    participant Metrics as Metrics<br/>Calculator
    participant Notify as Notification<br/>Service

    Note over Trigger: Three trigger types

    alt Data Arrival Trigger
        Trigger->>TaskSvc: transactions_updated event<br/>(new bank transactions arrived)
        TaskSvc->>Orch: Execute agent: Bank Transaction Matcher<br/>{ taskId, agentId, subTaskId,<br/>  triggerType: on_data_arrival }
    else Scheduled Trigger
        Trigger->>Orch: Cron fires daily agent run:<br/>{ agentId, triggerType: scheduled }
    else Manual Trigger
        Trigger->>TaskSvc: User clicks Run Agent<br/>in task drill-down
        TaskSvc->>Orch: Execute agent<br/>{ taskId, agentId, subTaskId,<br/>  triggerType: manual, userId }
    end

    Orch->>DB: Load agent configuration:<br/>model preference, prompt template,<br/>input data requirements

    Orch->>DB: Load task context:<br/>SuperTask + TransactionLinks +<br/>relevant sub-task data

    Orch->>Orch: Prepare input payload<br/>(tenant-isolated: no tlcId,<br/>no user IDs sent to LLM)

    Orch->>Router: Route to model based on<br/>agent config + capability match

    alt Transaction Matching / Code Generation
        Router->>OpenAI: Chat Completions API<br/>{ model: gpt-4o,<br/>  messages: [system prompt +<br/>  transaction data] }
        OpenAI-->>Router: Generated matching rules<br/>or Python code
        Router->>Sandbox: Execute generated code<br/>in isolated Lambda<br/>(VPC-isolated, no internet,<br/>no secrets access)
        Sandbox-->>Router: Execution results:<br/>{ matched: 142, exceptions: 5,<br/>  unmatched: 3 }
    else Analytics / Natural Language Query
        Router->>Bedrock: Messages API<br/>{ model: claude-3-5-sonnet,<br/>  messages: [system prompt +<br/>  structured data] }
        Bedrock-->>Router: Analysis results /<br/>SQL query / narrative
    end

    Router-->>Orch: Agent execution results

    Orch->>DB: Write AgentExecution record:<br/>{ agentId, taskId, subTaskId,<br/>  status: success,<br/>  itemsProcessed: 150,<br/>  itemsSucceeded: 142,<br/>  modelUsed: gpt-4o,<br/>  inputDataHash: sha256:... }

    Orch->>DB: Update SubTask status:<br/>subTaskId to agent_complete

    Orch->>DB: Update TransactionLink records<br/>(matchStatus, matchConfidence)

    Orch->>Metrics: Calculate ROI metrics

    Metrics->>Metrics: Compute:<br/>estimatedManualTime = 4.5 hours<br/>actualExecutionTime = 23 seconds<br/>costSaved = $337.50<br/>(4.5h x $75/hr labor rate)

    Metrics->>DB: Write ROI to AgentExecution record

    Orch->>TaskSvc: Emit StatusEvent:<br/>agent_completed

    TaskSvc->>Notify: Agent finished notification

    Notify->>Trigger: AI Matching Agent completed:<br/>142/150 matched (94.7%)<br/>5 exceptions need review<br/>Estimated time saved: 4.5 hours
```

### Flowchart: AI Orchestration Decision Logic

```mermaid
flowchart TD
    A[Agent Execution<br/>Request] --> B[Load Agent Config<br/>from DB]
    B --> C[Load Task Context<br/>+ TransactionLinks]
    C --> D[Prepare Input Payload<br/>Strip PII + tenant identifiers]
    D --> E{Agent Type}

    E -->|Transaction Matching| F[Route to OpenAI GPT-4o]
    E -->|Analytics / FloQL| G[Route to Bedrock Claude 3.5 Sonnet]
    E -->|Checklist Generation| H[Route to OpenAI GPT-4]
    E -->|Anomaly Detection| I[Route to Bedrock Claude 3.5 Sonnet]
    E -->|Data Transform| J[Route to OpenAI GPT-4o]

    F --> K{Code generation<br/>required?}
    K -->|Yes| L[Execute in sandboxed Lambda<br/>VPC-isolated, no internet,<br/>limited imports: re, pandas]
    K -->|No| M[Return structured results]
    G --> M
    H --> M
    I --> M
    J --> K
    L --> M

    M --> N[Write AgentExecution record]
    N --> O[Update SubTask status<br/>to agent_complete]
    O --> P[Calculate ROI metrics]
    P --> Q[Emit agent_completed<br/>StatusEvent]
    Q --> R[Status Machine evaluates<br/>task-level transition]
    R --> S{All sub-tasks<br/>complete?}
    S -->|Yes| T[Transition to<br/>pending_review]
    S -->|No| U[Remain in<br/>current status]

    T --> V[Notify preparer:<br/>ready for sign-off]
    U --> W[Notify user:<br/>agent finished, N items<br/>need manual review]
```

### What This Unifies

| Current Service | Provider | Proposed Integration |
|---|---|---|
| AI Matching (rules + code gen) | OpenAI GPT-4o | Routed through Orchestration; code execution in sandboxed Lambda |
| FloQL Backend (transaction analytics) | Bedrock Claude 3.5 Sonnet | Routed through Orchestration; results populate AIInsight entities |
| Monitors Agent (SQL generation) | Bedrock Claude 3.5 Sonnet v2 | Routed through Orchestration; scheduled execution pattern |
| Remind Language Processor | OpenAI GPT-4o | Routed through Orchestration; Notification Service integration |
| Checkmate (checklist generation) | OpenAI GPT-4 | Routed through Orchestration; creates SubTask templates |

### Tenant Isolation (Preserved)

The current AI security architecture is preserved and formalized:

- All data access scoped by `tlcId` at the API authorization layer
- `tlcId` and user IDs are never sent to LLM providers
- Transaction data sent to LLMs contains only structured fields (amounts, dates, descriptions)
- Code Runner Lambda operates in a dedicated VPC with no internet gateway
- Snowflake data accessed via schema-per-tenant: `TLC_{tlcId}`
- S3 data accessed via path prefix: `${tlcId}/...`

### Sandbox Security Controls (Preserved from Current Architecture)

| Control | Implementation |
|---|---|
| Network Isolation | Dedicated VPC with no internet gateway |
| Egress Restriction | Security group allows only S3 VPC endpoint (port 443) |
| Secret Denial | Explicit IAM DENY on all SSM/Secrets Manager operations |
| Limited Runtime | Only `re`, `pandas`, `defaultdict` available |
| Code Validation | Regex extraction -- only Python in markdown blocks accepted |
| Function Check | Must define `match_transactions` function |
| Time Limit | 900s maximum execution time |
| Memory Limit | 10GB maximum allocation |

---

## 5. Audit Trail Flow

### Context

The current audit trail relies primarily on the `signatures` array embedded within the `procedures` (checklist items) and `reconciliations` MongoDB collections. Sign-off timestamps, user IDs, and signature status are captured, but the trail covers only sign-off events. There is no centralized, immutable audit log for other state changes (delegations, agent executions, admin actions, permission changes). Platform teams have documented that 48 of 62 critical routes lack audit log coverage.

The proposed architecture expands the audit trail to cover every state change across the Super Task lifecycle. The trail is append-only, cryptographically linked, and queryable for compliance teams and external auditors.

### Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    participant Actor as Actor<br/>(User / Agent / System)
    participant TaskSvc as Task Service
    participant AuditSvc as Audit Service<br/>(ECS)
    participant AuditDB as Audit Store<br/>(Append-Only)
    participant Compliance as Compliance<br/>Query API
    participant Export as Export Service
    participant Auditor as External Auditor

    Note over Actor,AuditSvc: Every auditable action generates an audit event

    alt State Change
        Actor->>TaskSvc: preparer_signed / reviewer_signed /<br/>agent_completed / status change
        TaskSvc->>AuditSvc: AuditEvent: StatusTransition<br/>{ taskId, fromStatus, toStatus,<br/>  actorId, actorType, timestamp,<br/>  eventType, metadata }
    else Sign-Off
        Actor->>TaskSvc: Sign-off action
        TaskSvc->>AuditSvc: AuditEvent: Signature<br/>{ taskId, signatureType,<br/>  userId, timestamp,<br/>  signatureHash (SHA-256),<br/>  previousSignatureHash }
    else Delegation
        Actor->>TaskSvc: Delegate task to another user
        TaskSvc->>AuditSvc: AuditEvent: Delegation<br/>{ taskId, fromUserId, toUserId,<br/>  reason, startDate, endDate,<br/>  authorizedBy }
    else Agent Execution
        Actor->>TaskSvc: Agent completes sub-task
        TaskSvc->>AuditSvc: AuditEvent: AgentExecution<br/>{ taskId, subTaskId, agentId,<br/>  modelUsed, inputDataHash,<br/>  itemsProcessed, results }
    else Admin Action
        Actor->>TaskSvc: Permission change / role assignment /<br/>template modification / period lock
        TaskSvc->>AuditSvc: AuditEvent: AdminAction<br/>{ actionType, targetEntity,<br/>  previousValue, newValue,<br/>  authorizedBy }
    end

    AuditSvc->>AuditSvc: Validate event schema
    AuditSvc->>AuditSvc: Compute chain hash:<br/>hash = SHA-256(previousHash + eventData)
    AuditSvc->>AuditDB: Append to immutable store<br/>(no updates, no deletes)

    Note over Compliance: Compliance team queries

    Compliance->>AuditDB: Query: All sign-offs for<br/>Entity A, Feb 2026 period,<br/>SOX-material tagged tasks
    AuditDB-->>Compliance: Filtered audit records with<br/>complete chain of custody

    Compliance->>AuditDB: Query: All delegations where<br/>segregation of duties may be impacted
    AuditDB-->>Compliance: Delegation records with<br/>role overlap analysis

    Note over Export,Auditor: External audit export

    Compliance->>Export: Request audit export:<br/>{ entityIds, periodId, format: xlsx }
    Export->>AuditDB: Bulk read audit records
    AuditDB-->>Export: Complete audit trail
    Export->>Export: Generate formatted export<br/>(Excel with chain verification)
    Export->>Auditor: Signed, timestamped<br/>audit package (S3 signed URL)
```

### Flowchart: Audit Event Processing

```mermaid
flowchart TD
    A[Auditable Action Occurs] --> B{Event Category}

    B -->|State Transition| C[StatusTransition record:<br/>taskId, from, to, event,<br/>actor, timestamp]
    B -->|Sign-Off| D[Signature record:<br/>taskId, type, userId,<br/>timestamp, SHA-256 hash]
    B -->|Delegation| E[Delegation record:<br/>taskId, from, to, reason,<br/>dates, authorizer]
    B -->|Agent Execution| F[AgentExecution record:<br/>taskId, agentId, model,<br/>inputHash, results]
    B -->|Admin Action| G[AdminAction record:<br/>action, target, before,<br/>after, authorizer]
    B -->|Permission Change| H[PermissionChange record:<br/>userId, roleId, action,<br/>scope, authorizer]

    C --> I[Audit Service validates<br/>event schema]
    D --> I
    E --> I
    F --> I
    G --> I
    H --> I

    I --> J[Compute chain hash:<br/>SHA-256 of previous hash<br/>concatenated with event data]
    J --> K[Append to immutable store<br/>Write-once, no deletes]

    K --> L{SOX-relevant<br/>event?}
    L -->|Yes| M[Flag for compliance<br/>review queue]
    L -->|No| N[Standard retention]

    M --> O[Available for query<br/>and export]
    N --> O

    subgraph Compliance Queries
        O --> P[By entity + period]
        O --> Q[By user + date range]
        O --> R[By event type]
        O --> S[By tag: SOX-material,<br/>high-risk, CFO-review]
        O --> T[Segregation of duties<br/>violation detection]
    end

    subgraph Export Formats
        O --> U[Excel: formatted for<br/>external auditors]
        O --> V[JSON: machine-readable<br/>for audit tools]
        O --> W[PDF: signed report<br/>with chain verification]
    end
```

### Audit Entity Relationships

```mermaid
erDiagram
    SUPER_TASK ||--o{ STATUS_TRANSITION : "has"
    SUPER_TASK ||--o{ SIGNATURE : "has"
    SUPER_TASK ||--o{ DELEGATION : "has"
    SUPER_TASK ||--o{ AGENT_EXECUTION : "logged"
    SUPER_TASK ||--o{ ADMIN_ACTION : "targeted_by"

    STATUS_TRANSITION {
        string id PK
        string taskId FK
        string fromStatus
        string toStatus
        string event
        string actorId
        string actorType
        datetime timestamp
        string chainHash
        object metadata
    }

    SIGNATURE {
        string id PK
        string taskId FK
        string signatureType
        string userId FK
        datetime timestamp
        string signatureHash
        string previousSignatureHash
        boolean isActive
        string revokedReason
    }

    AGENT_EXECUTION {
        string id PK
        string taskId FK
        string subTaskId FK
        string agentId FK
        string modelUsed
        string inputDataHash
        number itemsProcessed
        number itemsSucceeded
        string executionLog
        number estimatedManualTime
        number actualExecutionTime
    }

    ADMIN_ACTION {
        string id PK
        string actionType
        string targetEntityType
        string targetEntityId
        object previousValue
        object newValue
        string authorizedBy FK
        datetime timestamp
        string chainHash
    }
```

### What This Expands

| Current Coverage | Proposed Coverage |
|---|---|
| Sign-off timestamps on `procedures` | Sign-offs as first-class Signature entities with cryptographic hashes |
| Sign-off timestamps on `reconciliations` | All task types covered under unified Signature model |
| No delegation audit trail | Full delegation history with reason, dates, authorizer |
| No agent execution audit trail | Complete AgentExecution records with model, input hash, results |
| No admin action audit trail | Every permission change, role assignment, period lock, template edit |
| 48 of 62 critical routes lack audit logs | All state-changing routes produce audit events |
| No chain verification | SHA-256 hash chain for tamper detection |
| Manual export via Workflow Analytics | Structured export API with multiple formats |

---

## 6. Cross-Product Sync Flow

### Context

Today, Close and Reporting operate on completely separate data paths. A customer's NetSuite integration for Close and their NetSuite integration for Reporting are essentially independent. The Reporting team has already rearchitected around transactions as the atomic entity, with FloLake's Silver Layer normalizing ERP data and the FDM (Financial Data Model) service providing dimension groupings. Close has no knowledge of Reporting's data, and Reporting has no awareness of Close task status.

The proposed architecture creates a bidirectional bridge where Reporting transactions surface in Close task drill-downs (enriched with FDM dimension context), and Close task completion status surfaces in Reporting dashboards (enabling "close-aware" financial reports).

### Sequence Diagram: Reporting to Close (Transactions Surface in Tasks)

```mermaid
sequenceDiagram
    autonumber
    participant ERP as ERP System
    participant Bronze as FloLake<br/>Bronze Layer
    participant Silver as FloLake<br/>Silver Layer
    participant FDM as FDM Service<br/>(Reporting)
    participant SNS as SNS Topics
    participant TaskSvc as Close Task Service
    participant DB as Close Task DB
    participant UI as Close UI<br/>(Task Drill-Down)

    ERP->>Bronze: Raw ERP data extract
    Bronze->>Silver: Normalize to standard<br/>transaction schema

    Silver->>SNS: transactions_updated<br/>{ tenantId, entityId, periodId,<br/>  accounts: [...] }

    par Close consumes transactions
        SNS->>TaskSvc: Task Service receives event
        TaskSvc->>Silver: Fetch transactions for<br/>affected accounts + period
        Silver-->>TaskSvc: Normalized transactions
        TaskSvc->>DB: Upsert TransactionLinks<br/>on matching SuperTasks
    and FDM enriches dimensions
        SNS->>FDM: FDM Sync receives event (via SQS)
        FDM->>FDM: Re-run FDM rules:<br/>map transactions to dimension groupings<br/>(Department, Location, Project, etc.)
        FDM->>SNS: fdm_sync_complete<br/>{ tenantId, entityId, dimensions_updated }
    end

    SNS->>TaskSvc: fdm_sync_complete event
    TaskSvc->>FDM: Fetch dimension data for<br/>linked transactions
    FDM-->>TaskSvc: Dimension groupings:<br/>{ department: Sales,<br/>  location: San Francisco,<br/>  project: Q4 Campaign }

    TaskSvc->>DB: Enrich TransactionLinks<br/>with FDM dimensions

    UI->>TaskSvc: User opens task drill-down
    TaskSvc->>DB: Load SuperTask +<br/>TransactionLinks + FDM dimensions
    DB-->>TaskSvc: Complete task context
    TaskSvc-->>UI: Render drill-down with:<br/>- GL transactions with amounts<br/>- FDM dimensions per transaction<br/>- Matching status<br/>- Balance computation
```

### Sequence Diagram: Close to Reporting (Task Status Surfaces in Reports)

```mermaid
sequenceDiagram
    autonumber
    participant TaskSvc as Close Task Service
    participant SNS as SNS Topics
    participant Gold as Close Gold Layer<br/>(Snowflake)
    participant ReportDB as Reporting<br/>Snowflake Schema
    participant ReportSvc as Report Builder<br/>(flosight_service)
    participant UI as Reporting UI

    Note over TaskSvc,SNS: Close task completes

    TaskSvc->>SNS: task_status_changed<br/>{ taskId, entityId, periodId,<br/>  accountId, processGroup,<br/>  status: completed,<br/>  completedDate, isOnTime }

    par Gold Layer update
        SNS->>Gold: Update fact_close_item_status:<br/>is_signed = true,<br/>signed_date_key = 20260215,<br/>is_on_time_flag = 1
    and Reporting schema update
        SNS->>ReportDB: Update close_task_status view:<br/>{ accountId, periodId, entityId,<br/>  taskStatus: completed,<br/>  completedDate, processGroup }
    end

    UI->>ReportSvc: User builds report:<br/>Revenue by Entity with Close Status
    ReportSvc->>ReportDB: Query joins:<br/>financial_transactions<br/>JOIN close_task_status<br/>ON accountId + periodId + entityId
    ReportDB-->>ReportSvc: Enriched report data

    ReportSvc-->>UI: Report shows:<br/>- Revenue by entity<br/>- Which accounts are closed vs. open<br/>- Which recs are complete vs. pending<br/>- Close progress % per entity
```

### Flowchart: Bidirectional Data Bridge

```mermaid
flowchart LR
    subgraph ERP Systems
        NS[NetSuite]
        SAP[SAP]
        D365[Dynamics 365]
    end

    subgraph FloLake
        Bronze[Bronze Layer<br/>Raw ERP Data]
        Silver[Silver Layer<br/>Normalized Transactions]
        FDM[FDM Service<br/>Dimension Groupings]
    end

    subgraph Close Product
        TaskSvc[Task Service]
        TaskDB[(Task DB<br/>SuperTasks +<br/>TransactionLinks)]
        CloseUI[Close UI<br/>Task Drill-Down]
    end

    subgraph Reporting Product
        ReportSvc[Report Builder<br/>flosight_service]
        ReportDB[(Reporting<br/>Snowflake Schema)]
        ReportUI[Reporting UI<br/>Financial Reports]
    end

    subgraph Shared Analytics
        Gold[Close Gold Layer<br/>Snowflake Star Schema]
    end

    NS --> Bronze
    SAP --> Bronze
    D365 --> Bronze
    Bronze --> Silver

    Silver -->|Normalized transactions<br/>via SNS event| TaskSvc
    Silver -->|Normalized transactions<br/>via SNS event| FDM
    Silver -->|Normalized transactions| ReportDB

    FDM -->|Dimension enrichment<br/>Department, Location, Project| TaskSvc
    FDM -->|Dimension groupings| ReportDB

    TaskSvc --> TaskDB
    TaskDB --> CloseUI

    TaskSvc -->|task_status_changed<br/>via SNS event| Gold
    TaskSvc -->|task_status_changed<br/>via SNS event| ReportDB

    Gold --> ReportSvc
    ReportDB --> ReportSvc
    ReportSvc --> ReportUI

    CloseUI -.->|Click: View in Reporting| ReportUI
    ReportUI -.->|Click: View Close Task| CloseUI
```

### Data Contracts Between Products

| Direction | Data | Transport | Event/Schema |
|---|---|---|---|
| FloLake to Close | Normalized transactions | SNS to SQS subscription | `{ tenantId, entityId, periodId, accounts[], transactionCount }` |
| FloLake to Reporting | Normalized transactions | Direct Snowflake write | FloLake Silver Layer schema (per-tenant Snowflake schema) |
| FDM to Close | Dimension groupings | HTTP API call (after SNS trigger) | `{ accountId, dimensions: { department, location, project, ... } }` |
| FDM to Reporting | Dimension groupings | Direct Snowflake write | FDM dimension tables in per-tenant schema |
| Close to Gold Layer | Task status events | SNS to Snowflake pipeline | `fact_close_item_status` star schema (see Gold Layer Data Model V1.0) |
| Close to Reporting | Task completion status | SNS to SQS subscription | `{ taskId, entityId, periodId, accountId, status, completedDate, isOnTime }` |
| Reporting to Close | Deep-link navigation | URL routing | `/reporting?account={id}&period={id}&entity={id}` |
| Close to Reporting | Deep-link navigation | URL routing | `/close/task/{taskId}` |

### FDM Dimension Enrichment Detail

The FDM service provides dimension groupings that transform raw account data into meaningful business context. When a transaction arrives in a Close task drill-down, it carries not just the amount and date, but the full organizational context:

```
Transaction: Wire payment -$12,345 (Feb 5, 2026)
  Account: 1010 - Operating Cash

  FDM Dimensions:
  +-- Department:    Treasury
  +-- Location:      San Francisco HQ
  +-- Cost Center:   CC-100 (Corporate)
  +-- Project:       N/A
  +-- Intercompany:  No
  +-- Custom Dim 1:  Domestic Operations

This enrichment happens automatically via the FDM sync pipeline.
The reviewer sees business context without leaving the task drill-down.
```

### Cross-Product Query Examples

| Query | Current State | With Cross-Product Bridge |
|---|---|---|
| Show me the transactions behind this rec variance | Must open Excel workbook | Click variance, see transactions inline in drill-down |
| What is the GL activity for this account this period? | Navigate to Reporting module | Visible in Super Task drill-down via TransactionLinks |
| Compare this rec to last month's transactions | Manual period toggle + Excel comparison | Side-by-side in task view with period-over-period data |
| Which recs are affected by today's JE posting? | Unknown until next refresh cycle | Real-time notification via SNS event cascade |
| Show me all transactions above $50K across all entities | Not possible in Close | Search query with amount filter via Search Service |
| Which accounts in this report are still open for close? | Not possible in Reporting | Close status badge on report line items |

---

## Summary: Data Flow Integration Map

The following diagram shows how all six data flows interconnect within the proposed architecture.

```mermaid
flowchart TB
    subgraph External
        ERP[ERP Systems]
        Auditor[External Auditors]
    end

    subgraph FloLake
        Bronze[Bronze Layer]
        Silver[Silver Layer]
        FDM[FDM Service]
    end

    subgraph Close Services
        TaskSvc[Task Service]
        SM[Status Machine]
        SearchSvc[Search Service]
        AIOrchr[AI Orchestration]
        AuditSvc[Audit Service]
        NotifySvc[Notification Service]
    end

    subgraph Data Stores
        TaskDB[(Task DB)]
        SearchIdx[(Search Index)]
        AuditStore[(Audit Store)]
        Gold[(Gold Layer<br/>Snowflake)]
    end

    subgraph Reporting
        ReportSvc[Report Builder]
        ReportDB[(Reporting DB)]
    end

    subgraph User Interfaces
        CloseUI[Close UI]
        ReportUI[Reporting UI]
    end

    ERP -->|1 ERP Ingestion| Bronze -->|1| Silver
    Silver -->|1| FDM
    Silver -->|1 SNS| TaskSvc

    CloseUI -->|2 State Transition| TaskSvc -->|2| SM
    SM -->|2| TaskDB
    SM -->|2 cascade| SM

    TaskSvc -->|3 Search Indexing| SearchSvc -->|3| SearchIdx
    CloseUI -->|3 query| SearchIdx

    TaskSvc -->|4 AI Execution| AIOrchr
    AIOrchr -->|4 results| TaskDB

    SM -->|5 Audit Trail| AuditSvc -->|5| AuditStore
    AuditStore -->|5 export| Auditor

    Silver -->|6 Cross-Product| ReportDB
    FDM -->|6| ReportDB
    FDM -->|6 dimensions| TaskSvc
    TaskSvc -->|6 status| Gold -->|6| ReportSvc
    TaskSvc -->|6 status| ReportDB
    ReportSvc --> ReportUI
    CloseUI <-.->|6 deep links| ReportUI

    SM -->|notify| NotifySvc --> CloseUI
```

### Flow Summary

| Flow | Primary Path | Event Transport | Key Innovation |
|---|---|---|---|
| 1. ERP Ingestion | ERP to FloLake to SNS to Task Service | SNS/SQS | Eliminates per-ERP GL Provider Lambdas; single ingestion serves all products |
| 2. Task State Transition | User/Agent to Status Machine to Dependency Cascade | Synchronous + event cascade | Automatic sign-off cascading through dependency chains |
| 3. Search Indexing | Task Service to Search Service to Search Index | SNS/SQS | Entirely new capability; enables search-first navigation |
| 4. AI Agent Execution | Trigger to AI Orchestration to Model to Task | Request/response + async | Unified orchestration replaces five fragmented AI services |
| 5. Audit Trail | Every state change to Audit Service to Immutable Store | Synchronous append | Expands from sign-off-only to full lifecycle audit with chain verification |
| 6. Cross-Product Sync | FloLake to/from Close to/from Reporting | SNS/SQS + Snowflake | First-ever bidirectional data flow between Close and Reporting |

### Communication Pattern Summary

| Flow | Async Pattern | Sync Pattern |
|---|---|---|
| 1. ERP Ingestion | SNS/SQS from FloLake to Close and Reporting | HTTP from Task Service to Silver Layer for transaction fetch |
| 2. Task State Transition | SNS fan-out to Search, Analytics, Notifications | Synchronous status machine evaluation and DB writes |
| 3. Search Indexing | SNS/SQS from Task Service to Search Service | HTTP search query from UI to Search API |
| 4. AI Agent Execution | SQS for scheduled and data-arrival triggers | HTTP from Orchestration to OpenAI/Bedrock APIs |
| 5. Audit Trail | Async audit event writes (non-blocking to primary flow) | Sync audit query and export request |
| 6. Cross-Product Sync | SNS fan-out to all consuming products | HTTP deep-link navigation between UIs |

### Architectural Principles Reflected

1. **Event-driven over request-driven** -- All cross-service communication uses async events (SNS/SQS), eliminating tight coupling between Close and other products. This follows the pattern the Reporting team established with FDM Sync.

2. **Single source of truth** -- FloLake Silver Layer is the single source for transaction data; the Task Service is the single source for task state; the Audit Store is the single source for audit events.

3. **Immutability for compliance** -- Audit events, signatures with cryptographic hashes, and status transitions are append-only. Nothing is edited or deleted.

4. **Eventual consistency with real-time UX** -- Cross-product data is eventually consistent (async fan-out), but users see real-time updates via WebSocket push on the surfaces they are viewing.

5. **Tenant isolation at every layer** -- Snowflake schema-per-tenant, `tlcId` on all events and queries, ReBAC permission filtering at query time, PII stripping before AI processing.

6. **Aligns with existing Reporting patterns** -- The SNS/SQS fan-out, FloLake Silver Layer consumption, and Snowflake Gold Layer writing all follow patterns the Reporting team has already established with FDM Sync and Report Builder. Close is adopting proven patterns rather than inventing new ones.

---

*Document Author: Benjamin Ellis, Product Design Manager*
*Date: March 2026*
*Status: Architecture Proposal -- Living Document*
