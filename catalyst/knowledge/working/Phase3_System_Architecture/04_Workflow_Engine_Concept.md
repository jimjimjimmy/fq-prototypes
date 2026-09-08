# Workflow Engine Concept

**Purpose:** Define an event-driven workflow engine that replaces FloQast Close's current static rule-based routing and Step Function orchestration with a flexible, auditable, event-condition-action system.

**Context:** Today, Close relies on direct Lambda invocations, 4 Replication Step Functions, 1 Bulk Edit Step Function, and 1 Adhoc Projects Step Function for async orchestration. There is no unified event bus, no cross-service event propagation, and no way for users to define custom workflow rules. Manual "traffic light" dependency indicators have no system enforcement. Tim Gibson's vision calls for event-driven milestones with transparent visualization ("Git Flow" style) for audit purposes.

**Depends On:** Super Task Model (Phase 2, `02_Super_Task_Model_Specification.md`), ReBAC Conceptual Model (`05_ReBAC_Conceptual_Model.md`)

---

## 1. Event Types

The workflow engine is driven by events. Every meaningful state change in the Close platform produces an event that the engine can consume, evaluate, and act upon.

### 1.1 Task Lifecycle Events

| Event | Payload | Trigger Source |
|-------|---------|----------------|
| `task.created` | Full task object | Checklist service on task creation |
| `task.updated` | Task ID + changed fields | Checklist service on any field update |
| `task.deleted` | Task ID + soft-delete metadata | Checklist service on deletion |
| `status.changed` | Task ID, `fromStatus`, `toStatus`, `changedBy`, `timestamp` | Checklist service on status transition |
| `signature.added` | Task ID, signature ID, signer user ID, signature type (preparer/reviewer) | Checklist service on sign-off |
| `signature.removed` | Task ID, signature ID, removed by, reason | Checklist service on sign-off revocation |

### 1.2 Data Events

| Event | Payload | Trigger Source |
|-------|---------|----------------|
| `data.arrived` | Source system, data type, account ID, entity ID, period ID, record count | FloLake Silver Layer (via existing SNS broadcast) |
| `data.changed_post_signoff` | Task ID, field changed, old value, new value | Reconciliation service on post-sign-off data modification |
| `document.uploaded` | Document ID, task ID, file metadata, uploaded by | Storage Provider Lambdas |
| `document.modified` | Document ID, task ID, modification type | Storage Provider Lambdas (cloud storage webhook) |
| `transaction.matched` | Transaction IDs, match rule ID, confidence score | AI Matching service |
| `transaction.unmatched` | Transaction ID, reason | AI Matching service |
| `balance.refreshed` | Account ID, entity ID, period ID, GL balance, reconciled balance, variance | GL Provider Lambdas |

### 1.3 Dependency Events

| Event | Payload | Trigger Source |
|-------|---------|----------------|
| `dependency.met` | Dependent task ID, dependency task ID, dependency type | Workflow Engine (self-generated after evaluating dependency graph) |
| `dependency.broken` | Dependent task ID, dependency task ID, reason (e.g., upstream task status reverted) | Workflow Engine |
| `dependency.created` | Source task ID, target task ID, dependency type | Checklist service when dependencies are configured |
| `dependency.removed` | Source task ID, target task ID | Checklist service |

### 1.4 Period Events

| Event | Payload | Trigger Source |
|-------|---------|----------------|
| `period.opened` | Entity ID, period ID, opened by | Period management service |
| `period.locked` | Entity ID, period ID, locked by | Period management service |
| `period.unlocked` | Entity ID, period ID, unlocked by, reason | Period management service |
| `replication.started` | Source period ID, target period ID, entity ID | Replication service |
| `replication.completed` | Source period ID, target period ID, entity ID, item count | Replication service |

### 1.5 People Events

| Event | Payload | Trigger Source |
|-------|---------|----------------|
| `delegation.started` | Delegator user ID, delegate user ID, scope (task IDs or entity-wide), start date, end date, reason | Delegation service |
| `delegation.ended` | Delegation ID, end reason (scheduled, manual, auto-revert) | Delegation service |
| `assignment.changed` | Task ID, role (preparer/reviewer), old user ID, new user ID, reason | Checklist service |

### 1.6 Agent Events

| Event | Payload | Trigger Source |
|-------|---------|----------------|
| `agent.triggered` | Agent ID, task ID, trigger reason, input data summary | AI Orchestration Service |
| `agent.completed` | Agent ID, task ID, result summary, items processed, hours saved, error count | AI Orchestration Service |
| `agent.failed` | Agent ID, task ID, error type, error message, retry count | AI Orchestration Service |

### 1.7 Event Envelope

Every event follows a standard envelope structure:

```typescript
interface WorkflowEvent {
  eventId: string;              // Globally unique, idempotency key
  eventType: string;            // Dot-notation type (e.g., "status.changed")
  source: string;               // Originating service name
  tlcId: string;                // Tenant isolation
  entityId?: string;            // Entity context
  periodId?: string;            // Period context
  timestamp: Date;              // When the event occurred
  correlationId: string;        // Traces related events across services
  payload: Record<string, any>; // Event-type-specific data
}
```

---

## 2. Rule Model: Event -> Condition -> Action

The core abstraction of the workflow engine is a **rule**: when an event occurs, evaluate a condition, and if true, execute one or more actions.

### 2.1 Rule Structure

```typescript
interface WorkflowRule {
  id: string;
  name: string;                         // Human-readable name
  description: string;                  // What this rule does and why
  tlcId: string;                        // Tenant-scoped (rules are per-customer)

  // === TRIGGER ===
  trigger: {
    eventType: string;                  // Which event activates this rule
    filters?: Record<string, any>;      // Pre-condition on event payload (cheap, evaluated before rule logic)
  };

  // === CONDITION ===
  condition: {
    expression: string;                 // Boolean expression evaluated against event + context
    contextQueries?: ContextQuery[];    // Additional data to fetch before evaluating (e.g., "get task tags")
  };

  // === ACTIONS ===
  actions: WorkflowAction[];           // Ordered list of actions to execute

  // === METADATA ===
  isBuiltIn: boolean;                  // System-provided vs. customer-defined
  isEnabled: boolean;                  // Can be toggled without deletion
  priority: number;                    // Execution order when multiple rules match
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  executionCount: number;              // Observability
  lastExecutedAt?: Date;
}
```

### 2.2 Condition Language

Conditions are boolean expressions evaluated against the event payload and optional context data. The expression language supports:

- **Field references:** `event.toStatus`, `task.tags`, `task.preparer.userId`
- **Operators:** `==`, `!=`, `>`, `<`, `>=`, `<=`, `contains`, `not_contains`, `in`, `not_in`, `matches` (regex)
- **Logical:** `AND`, `OR`, `NOT`, parentheses
- **Functions:** `count()`, `any()`, `all()`, `daysBetween()`, `isOverdue()`

**Examples:**

```
event.toStatus == "pending_review" AND task.tags contains "high-risk"
```

```
event.toStatus == "completed" AND all(task.dependencies, dep => dep.status == "completed")
```

```
daysBetween(task.dueDate, now()) <= 0 AND task.status != "completed"
```

### 2.3 Action Types

| Action Type | Description | Parameters |
|-------------|-------------|------------|
| `assign_reviewer` | Add or change a reviewer on a task | `userId`, `reason` |
| `assign_preparer` | Change the preparer on a task | `userId`, `reason` |
| `change_status` | Transition task to a new status | `toStatus`, `reason` |
| `notify` | Send notification to user(s) | `userIds[]`, `channel` (in-app, email, Slack), `template`, `variables` |
| `trigger_agent` | Start an AI agent execution | `agentId`, `taskId`, `inputConfig` |
| `create_review_note` | Auto-generate a review note on a task | `taskId`, `content`, `author` (system) |
| `add_tag` | Add a tag to a task | `taskId`, `tag` |
| `remove_tag` | Remove a tag from a task | `taskId`, `tag` |
| `lock_period` | Lock a period for an entity | `entityId`, `periodId` |
| `delegate_tasks` | Reassign tasks to a delegate | `fromUserId`, `toUserId`, `scope`, `endDate` |
| `revert_delegation` | Return tasks to original assignee | `delegationId` |
| `revoke_signoff` | Remove a sign-off (redo scenario) | `taskId`, `signatureId`, `reason` |
| `log_event` | Write to the audit trail | `message`, `severity`, `metadata` |
| `webhook` | Call an external URL | `url`, `method`, `headers`, `body` |

### 2.4 Example Rules

**Rule: High-Risk Additional Reviewer**
```yaml
name: "Assign additional reviewer for high-risk items entering review"
trigger:
  eventType: "status.changed"
  filters:
    toStatus: "pending_review"
condition:
  expression: 'task.tags contains "high-risk"'
  contextQueries:
    - type: "task"
      taskId: "event.taskId"
actions:
  - type: "assign_reviewer"
    userId: "{{entity.controller}}"
    reason: "Auto-assigned: high-risk item requires controller review"
  - type: "notify"
    userIds: ["{{entity.controller}}"]
    channel: "in-app"
    template: "high_risk_review_assigned"
    variables:
      taskTitle: "{{task.title}}"
      preparer: "{{task.preparer.name}}"
```

**Rule: Auto-Redo on Post-Sign-Off Data Change**
```yaml
name: "Revoke sign-off and flag redo when data changes after completion"
trigger:
  eventType: "data.changed_post_signoff"
condition:
  expression: 'task.status == "completed" AND event.field in ["glBalance", "reconciledBalance"]'
actions:
  - type: "revoke_signoff"
    taskId: "{{event.taskId}}"
    signatureId: "{{task.latestSignature.id}}"
    reason: "Data changed after sign-off: {{event.field}} from {{event.oldValue}} to {{event.newValue}}"
  - type: "change_status"
    toStatus: "redo"
    reason: "Post-sign-off data modification detected"
  - type: "notify"
    userIds: ["{{task.preparer.userId}}", "{{task.reviewer.userId}}"]
    channel: "in-app,email"
    template: "redo_data_change"
```

**Rule: PTO Delegation Auto-Revert**
```yaml
name: "Auto-revert delegated tasks when delegation period ends"
trigger:
  eventType: "delegation.ended"
  filters:
    endReason: "scheduled"
condition:
  expression: 'event.delegationId != null'
actions:
  - type: "revert_delegation"
    delegationId: "{{event.delegationId}}"
  - type: "notify"
    userIds: ["{{event.delegatorUserId}}", "{{event.delegateUserId}}"]
    channel: "in-app"
    template: "delegation_ended"
```

**Rule: Agent Trigger on Data Arrival**
```yaml
name: "Trigger AP Accrual Agent when AP data arrives"
trigger:
  eventType: "data.arrived"
  filters:
    dataType: "trial_balance"
condition:
  expression: 'event.accountId in agentConfig.watchedAccounts AND agentConfig.isEnabled'
  contextQueries:
    - type: "agent_config"
      agentId: "ap-accrual-agent"
actions:
  - type: "trigger_agent"
    agentId: "ap-accrual-agent"
    taskId: "{{matchingTask.id}}"
    inputConfig:
      accountId: "{{event.accountId}}"
      periodId: "{{event.periodId}}"
```

**Rule: Dependency Resolution**
```yaml
name: "Unblock downstream task when all upstream dependencies complete"
trigger:
  eventType: "status.changed"
  filters:
    toStatus: "completed"
condition:
  expression: 'any(task.dependents, dep => all(dep.upstreamDependencies, u => u.status == "completed"))'
actions:
  - type: "change_status"
    taskId: "{{unblockedTask.id}}"
    toStatus: "not_started"
    reason: "All dependencies met — task unblocked"
  - type: "notify"
    userIds: ["{{unblockedTask.preparer.userId}}"]
    channel: "in-app"
    template: "task_unblocked"
```

---

## 3. Built-In Rules

The system ships with a set of immutable, system-defined rules that encode core Close business logic. Customers cannot disable these (though they can be enhanced with additional actions).

### 3.1 Dependency Resolution Engine

**Purpose:** Automatically evaluate and enforce cross-task dependencies.

**Behavior:**
- When a task completes (`status.changed` to `completed`), the engine queries all tasks that list this task as a dependency.
- For each downstream task, it checks whether ALL upstream dependencies are now met.
- If all dependencies are met, the downstream task transitions from `blocked` to `not_started` and the preparer is notified.
- If an upstream task is re-opened or reverted (`status.changed` from `completed` to something else), all downstream tasks that were unblocked by it are re-evaluated. If dependencies are now broken, downstream tasks move to `blocked`.

**Circular dependency detection:** At rule creation time (when a user adds a dependency), the engine validates the dependency graph for cycles. Circular dependencies are rejected with a clear error message.

### 3.2 Auto-Redo on Post-Sign-Off Data Change

**Purpose:** Enforce the detective control that is core to FloQast's value proposition.

**Behavior:**
- When a GL balance refresh or cloud storage file modification occurs AFTER a task has been signed off, the engine revokes the sign-off, transitions the task to `redo` status, and notifies both preparer and reviewer.
- This replaces the current tightly coupled logic in the Reconciliation service with an event-driven, auditable rule.

### 3.3 PTO Delegation Auto-Revert

**Purpose:** Solve the current admin pain point where PTO delegation requires manual admin intervention.

**Behavior:**
- When a delegation's end date arrives, the engine generates a `delegation.ended` event.
- The built-in rule reassigns all delegated tasks back to the original owner.
- Both the delegator and delegate receive notifications.
- If the original owner's account is deactivated during the delegation period, the engine escalates to the entity controller instead.

### 3.4 Agent Auto-Trigger on Data Arrival

**Purpose:** Enable the "invisible AI" philosophy — agents act automatically when their input data arrives, requiring zero user intervention.

**Behavior:**
- When FloLake publishes a `data.arrived` event, the engine checks the agent registry for agents configured to watch that data source/account combination.
- Matching agents are triggered automatically.
- Agent results flow back as `agent.completed` events, which can trigger further downstream rules.

### 3.5 Period Lock Cascade

**Purpose:** When a period is locked, enforce downstream effects.

**Behavior:**
- When `period.locked` is received, the engine transitions all incomplete tasks in that period to `locked_incomplete` status.
- All active delegations scoped to that period are ended.
- Notifications are sent to assignees of any tasks that were not completed before lock.

---

## 4. Visualization: Dependency Chain Graph

Tim Gibson's vision: dependencies must be visualized transparently, like "Git Flow for audit transparency." The workflow engine maintains the data that powers two key visualizations.

### 4.1 Dependency Chain Graph

A directed acyclic graph (DAG) showing how tasks relate to each other within a close period.

```
┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│  Pull TB from  │────▶│  Bank Rec -    │────▶│  Controller    │
│  NetSuite      │     │  Operating     │     │  Sign-Off      │
│  ■ Completed   │     │  ◐ In Progress │     │  ○ Blocked     │
│  Agent: GL Sync│     │  Sarah Chen    │     │  Marcus Johnson│
└────────────────┘     └────────────────┘     └────────────────┘
                             │
                             ▼
                       ┌────────────────┐
                       │  AP Accrual    │
                       │  ○ Blocked     │
                       │  David Kim     │
                       └────────────────┘
```

**Data source:** The dependency graph is stored as part of the Super Task model (`dependencies: Dependency[]`). The workflow engine maintains a materialized view of the full dependency graph per entity/period for fast rendering.

**Visualization features:**
- Color-coded nodes by status (completed = green, in progress = blue, blocked = gray, late = red, redo = orange)
- Click-to-drill into any node (opens the Drill-Down Object View from Project Catalyst)
- Critical path highlighting (longest chain of incomplete dependencies)
- Animated status transitions (when a task completes, the graph updates in real-time via AppSync WebSocket)

### 4.2 Gantt Timeline Powered by Event History

The Close Timeline / Gantt View from Project Catalyst is powered by the workflow engine's event history.

**Data source:** Every event processed by the engine is logged to an event store (append-only). This creates a complete timeline of every state change, assignment, sign-off, agent execution, and dependency resolution for every task.

**Gantt rendering:**
- X-axis: calendar days in the close period
- Y-axis: tasks grouped by process group (Cash, AR, AP, Inventory, etc.)
- Bars: actual duration (start = first `status.changed` to `in_progress`, end = final `signature.added`)
- Markers: due date (diamond), dependency met (arrow), agent execution (robot icon)
- Compare mode: overlay previous period's actual timeline to identify where this period is ahead or behind

**Event history query example:**
```sql
SELECT
  task_id,
  event_type,
  timestamp,
  payload
FROM workflow_events
WHERE tlc_id = 'tenant-abc-123'
  AND period_id = '2026-02'
  AND entity_id = 'entity-us-ops'
ORDER BY timestamp ASC
```

This data lives in the workflow engine's event store (DynamoDB or Snowflake, depending on query patterns — DynamoDB for real-time UI, Snowflake for historical analytics).

---

## 5. Migration from Step Functions

Six Step Functions currently handle async orchestration in Close. Each must be mapped to an event-driven equivalent.

### 5.1 Replication Step Functions (4 SFs)

**Current state:**
- `replicate-queue-v2` — Main orchestrator
- `replicate-queue-item-v2` — Item-level replication
- `replicate-company` — Company-level replication
- `replicate-tlc` — Top-level client replication
- Triggered monthly by cron on the 1st

**Event-driven equivalent:**

The replication process becomes a sequence of events:

```
period.opened (cron or manual trigger)
  └──▶ replication.started (per entity)
        └──▶ replication.item_batch_created (chunked, N items per batch)
              └──▶ replication.item_batch_completed (per batch)
                    └──▶ replication.completed (when all batches done)
                          └──▶ task.created (for each replicated task — triggers downstream rules)
```

**Benefits over Step Functions:**
- **Observability:** Every step is a logged event with timestamps, not opaque Step Function state transitions.
- **Retry granularity:** Failed item batches can be retried individually via SQS dead-letter queue without restarting the entire replication.
- **Extensibility:** Other services can listen for `replication.completed` to trigger their own initialization (e.g., agent pre-configuration, delegation carry-forward).

**Migration approach:** Run both systems in parallel during transition. Step Function writes to MongoDB. Event-based system reads from MongoDB and publishes events. Once event consumers are validated, cut over the write path.

### 5.2 Bulk Edit Step Function (1 SF)

**Current state:**
- `fq-bulk-edit-init` → `fq-bulk-edit-preparer` → parallel `fq-bulk-edit-worker` / `fq-bulk-edit-template-worker` → `fq-bulk-edit-wrap-up`
- Concurrency controls: 25/100/50/25 reserved concurrency

**Event-driven equivalent:**

```
bulk_edit.initiated (user submits bulk edit request)
  └──▶ bulk_edit.batches_created (preparer splits into batches)
        └──▶ bulk_edit.batch_processing (N parallel SQS consumers)
              └──▶ bulk_edit.batch_completed (per batch)
                    └──▶ bulk_edit.all_batches_completed (aggregation check)
                          └──▶ bulk_edit.finalized (report generated, user notified)
```

**Concurrency control:** SQS maximum concurrency setting replaces Lambda reserved concurrency. Each batch is an SQS message consumed by the bulk edit worker ECS service with configurable concurrency limits.

**Key change:** Each individual item update within a bulk edit also emits standard `task.updated` and `status.changed` events. This means all downstream workflow rules (dependency resolution, notifications, agent triggers) fire automatically — currently, bulk edit has its own notification logic that duplicates core service behavior.

### 5.3 Adhoc Projects Step Function (1 SF)

**Current state:**
- `adhoc-project-wizard` orchestrates multi-Lambda project creation workflow

**Event-driven equivalent:**

```
project.creation_started (user initiates project wizard)
  └──▶ project.template_applied (template copied, tasks scaffolded)
        └──▶ task.created (for each task in the project — standard event)
              └──▶ project.creation_completed (all tasks created)
```

**Benefit:** Adhoc project tasks are now first-class Super Tasks that participate in the same dependency graph, search index, and workflow rules as close tasks. The artificial separation between "close tasks" and "project tasks" is eliminated.

---

## 6. Technology Recommendation

### 6.1 Event Bus: Amazon EventBridge

**Why EventBridge:**
- Already used by the Reporting team's FDM service (proven pattern at FloQast)
- Native AWS integration — no additional infrastructure to manage
- Schema registry for event validation
- Content-based routing rules (filter events by type, payload fields)
- Archive and replay capability (critical for debugging and reprocessing)
- Cross-account event routing (for multi-region production/production-eu)

**Event bus name:** `fq-close-events-{env}`

### 6.2 Event Consumption: Amazon SQS

**Why SQS:**
- Buffering between EventBridge and consumers prevents backpressure
- Dead-letter queues for failed processing with configurable retry
- FIFO queues available where ordering matters (dependency resolution)
- Visibility timeout prevents duplicate processing
- Aligns with patterns already used by FDM sync and Report Builder exports

**Queue topology:**

| Queue | Consumer | Type | Purpose |
|-------|----------|------|---------|
| `fq-workflow-rules-{env}` | Workflow Engine | Standard | Rule evaluation and action execution |
| `fq-search-indexer-{env}` | Search Indexer | Standard | Event-to-index propagation |
| `fq-notification-{env}` | Notification Service | Standard | User notifications (in-app, email, Slack) |
| `fq-audit-log-{env}` | Audit Logger | FIFO | Ordered audit trail writes |
| `fq-bulk-edit-{env}` | Bulk Edit Worker | Standard | Batch processing with concurrency control |
| `fq-replication-{env}` | Replication Worker | Standard | Period roll-forward batch processing |

### 6.3 Workflow Engine Service: ECS

**Service:** `close_workflow-engine` (ECS, following the monorepo `apps/` convention)

**Responsibilities:**
1. Consume events from `fq-workflow-rules-{env}` SQS queue
2. Match events against active rules (cached in memory, refreshed on rule change events)
3. Evaluate conditions (with optional context queries to MongoDB)
4. Execute actions (publish new events, call service APIs, update task status)
5. Log all rule evaluations and action outcomes to the event store

**Scaling:** Horizontal scaling via SQS consumer concurrency. The engine is stateless — all state is in the event store and MongoDB. Multiple instances can process different events concurrently.

### 6.4 Event Store: DynamoDB + Snowflake

| Store | Use Case | Query Pattern |
|-------|----------|---------------|
| DynamoDB | Real-time event history for UI (dependency graph, Gantt) | Point lookups by task ID, range queries by timestamp |
| Snowflake | Historical analytics, trend analysis, audit reports | Aggregations across periods, entities, tenants |

Events are written to DynamoDB first (low latency), then streamed to Snowflake via DynamoDB Streams + Lambda (or Kinesis Firehose) for analytics.

---

## 7. Architecture Diagram

```
                                ┌─────────────────────────────────────────────┐
                                │              EventBridge                     │
                                │         fq-close-events-{env}               │
                                └────────┬────────┬────────┬────────┬─────────┘
                                         │        │        │        │
                                    ┌────┴──┐ ┌───┴───┐ ┌──┴──┐ ┌──┴──┐
                                    │SQS    │ │SQS    │ │SQS  │ │SQS  │
                                    │Rules  │ │Search │ │Notif│ │Audit│
                                    └───┬───┘ └───┬───┘ └──┬──┘ └──┬──┘
                                        │         │        │       │
                                        ▼         ▼        ▼       ▼
┌──────────┐   events    ┌──────────────────┐  ┌──────┐ ┌─────┐ ┌─────┐
│ Checklist├────────────▶│                  │  │Search│ │Notif│ │Audit│
│ Service  │             │                  │  │Index │ │Svc  │ │Log  │
├──────────┤             │  Workflow Engine │  └──────┘ └─────┘ └─────┘
│ Review   ├────────────▶│  (ECS)           │
│ Notes    │             │                  │
├──────────┤             │  - Rule matching │
│ Recon    ├────────────▶│  - Condition eval│     ┌───────────────┐
│ Service  │             │  - Action exec   │────▶│  DynamoDB     │
├──────────┤             │                  │     │  (event store)│
│ FloLake  ├────────────▶│                  │     └───────┬───────┘
│          │             └──────────────────┘             │ stream
├──────────┤                     │                        ▼
│ AI       ├────────────▶        │ actions          ┌───────────────┐
│ Services │                     ▼                  │  Snowflake    │
└──────────┘             ┌──────────────────┐       │  (analytics)  │
                         │  Service APIs    │       └───────────────┘
                         │  (status change, │
                         │   assign, notify,│
                         │   trigger agent) │
                         └──────────────────┘
```

---

## 8. Custom Rules (Customer-Defined)

Beyond built-in rules, the workflow engine supports customer-defined rules created by Close administrators.

### 8.1 Rule Builder UI

A visual rule builder in the Close admin panel:

1. **Select trigger event** from a dropdown of supported event types
2. **Define conditions** using a form-based condition builder (field + operator + value, with AND/OR grouping)
3. **Choose actions** from the available action types, with parameterized configuration
4. **Test the rule** against historical events (replay from event store) to validate behavior before activation
5. **Enable/disable** with a toggle — no deletion required for temporary deactivation

### 8.2 Guardrails

- Maximum 50 custom rules per tenant (prevents runaway complexity)
- Rules cannot override built-in rules (can only extend with additional actions)
- Action rate limiting: a single rule can trigger at most 100 actions per minute per tenant
- Infinite loop detection: if a rule's action triggers an event that re-triggers the same rule, the engine halts after 3 cycles and alerts the admin
- SOX compliance: all rule changes are logged to the audit trail with before/after snapshots, user who made the change, and timestamp

---

## 9. Observability

### 9.1 Metrics

| Metric | Description | Alert Threshold |
|--------|-------------|-----------------|
| `events.received` | Events consumed per second | >1000/s (capacity warning) |
| `rules.evaluated` | Rule evaluations per second | -- (observability only) |
| `rules.matched` | Rules that matched per second | -- |
| `actions.executed` | Actions executed per second | -- |
| `actions.failed` | Failed action executions | >10/min (alert) |
| `event_processing.latency_p95` | Time from event receipt to action completion | >5s (alert) |
| `dlq.depth` | Messages in dead-letter queue | >0 (investigate) |

### 9.2 Event Store Queries

Administrators and auditors can query the event store to understand exactly what happened and why:

- "Show me all events for task X in chronological order"
- "Which rule triggered the redo on this reconciliation?"
- "How many tasks were auto-unblocked by dependency resolution this period?"
- "What is the average time between data arrival and agent completion?"

---

## 10. Open Questions

1. **Rule execution ordering** — When multiple rules match the same event, should they execute in priority order (sequential) or in parallel? Sequential is safer (later rules can depend on earlier rule outcomes) but slower. Recommend sequential with a configurable "parallel-safe" flag per rule.

2. **Event schema versioning** — As the event schema evolves, how do we handle backward compatibility? Recommend event version field + schema registry in EventBridge. Consumers must handle both old and new versions during migration windows.

3. **Cross-entity rules** — Should rules be able to span entities (e.g., "when all entities complete period lock, generate a consolidated report")? This adds significant complexity. Recommend deferring to Phase 2 of the workflow engine.

4. **Customer rule testing** — The "test against historical events" feature requires event replay capability. EventBridge archive supports this, but replayed events must be clearly marked as test events to prevent side effects. Recommend a dedicated test bus (`fq-close-events-test-{env}`).

5. **Transform integration** — Transform (AI Agents) currently has no permission model and no event system. Should the workflow engine subsume Transform's orchestration, or should Transform maintain its own? Recommend the workflow engine provides the event bus and Transform publishes/consumes events but maintains its own agent execution runtime.
