# Super Task Model Specification

**Purpose:** Define the "Super Task" — the unified core data entity that replaces checklist items, reconciliation items, compliance tasks, and ad-hoc project tasks with a single, rich container.

**Design Principle:** The Super Task is the **Master Object** (Principle 1) — a self-contained entity that aggregates all context a user needs to understand, execute, review, and audit a piece of accounting work.

---

## 1. Super Task Entity Definition

```typescript
interface SuperTask {
  // === IDENTITY ===
  id: string;                          // Globally unique, URL-addressable
  tlcId: string;                       // Tenant isolation
  entityId: string;                    // Company/entity reference
  periodId: string;                    // Accounting period (YYYY-MM)

  // === CLASSIFICATION (replaces folders) ===
  processGroup: string;                // "Cash & Banking", "Accounts Payable", etc.
  accountId?: string;                  // GL account linkage (e.g., "1010 - Operating")
  tags: Tag[];                         // Flexible classification
  taskType: TaskType;                  // Discriminator for type-specific behavior

  // === OWNERSHIP ===
  preparer: Assignment;                // Primary person responsible
  reviewer: Assignment;                // Primary reviewer
  delegates: Delegation[];             // Active delegations (PTO coverage)
  agents: AgentAssignment[];           // AI agents assigned to sub-tasks

  // === STATUS MACHINE ===
  status: TaskStatus;                  // Current lifecycle state
  statusHistory: StatusTransition[];   // Complete audit trail

  // === COMPOSITION ===
  subTasks: SubTask[];                 // Ordered list of discrete steps
  dependencies: Dependency[];          // Cross-task dependency graph
  documents: Document[];               // Attached evidence
  reviewNotes: ReviewNote[];           // Threaded discussion
  transactions: TransactionLink[];     // Linked GL data (via FloLake)
  reconciliation?: ReconciliationData; // Balance data (for rec-type tasks)
  calculations?: CalculationData;      // Native spreadsheet data (future)
  journalEntries?: JournalEntry[];     // JEM entries linked to this task

  // === SCHEDULING ===
  dueDate: Date;
  dueDateType: 'calendar' | 'business_day';
  holidays: string[];                  // Holiday calendar reference
  estimatedDuration?: number;          // In hours, for forecasting

  // === AI & AUTOMATION ===
  agentHistory: AgentExecution[];      // Agent run logs with ROI
  aiInsights: AIInsight[];             // Anomaly flags, recommendations
  automationEligibility: AutomationScore; // How automatable is this task

  // === METADATA ===
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  templateId?: string;                 // Source template reference
  version: number;                     // Optimistic concurrency
}
```

## 2. Task Types (Discriminator)

```typescript
type TaskType =
  | 'checklist'          // Standard checklist item (book JE, upload evidence)
  | 'reconciliation'     // Account reconciliation (balance matching)
  | 'compliance'         // SOX/controls task
  | 'journal_entry'      // JEM-generated entry
  | 'ad_hoc'             // Ad-hoc project task
  | 'agent_task';        // AI-created task (e.g., anomaly investigation)
```

Each type activates specific sub-task templates and validation rules, but the **core entity structure is identical** — enabling a truly unified inbox, search, and review experience.

## 3. Sub-Task Model

Sub-tasks represent the discrete SOP steps within a Super Task. This is **new** — it doesn't exist in the current architecture.

```typescript
interface SubTask {
  id: string;
  parentTaskId: string;
  title: string;
  description?: string;
  order: number;                       // Execution sequence
  status: SubTaskStatus;
  assignmentType: 'human' | 'agent' | 'system';
  assignedTo?: string;                 // User ID or Agent ID

  // Execution metadata
  completedAt?: Date;
  completedBy?: string;
  executionLog?: ExecutionLog;         // For agent-completed sub-tasks

  // Validation
  requiredEvidence?: EvidenceRequirement[];
  validationRules?: ValidationRule[];
}

type SubTaskStatus =
  | 'pending'           // Not started
  | 'in_progress'       // Being worked on (human or agent)
  | 'agent_complete'    // Agent finished; awaiting human review
  | 'complete'          // Done and verified
  | 'skipped'           // Intentionally skipped (with reason)
  | 'blocked';          // Waiting on dependency
```

### Example: Bank Reconciliation Sub-Tasks

```
Super Task: "Bank Rec - Operating Account" (type: reconciliation)
├── Sub-Task 1: "Import bank transactions"     [agent] → auto-complete
├── Sub-Task 2: "Import GL transactions"       [system] → auto-complete via ERP API
├── Sub-Task 3: "Match transactions"           [agent] → 142/150 matched
├── Sub-Task 4: "Review exceptions"            [human] → Sarah reviews 8 items
├── Sub-Task 5: "Verify materiality"           [system] → auto-check threshold
├── Sub-Task 6: "Preparer sign-off"            [human] → Sarah signs
└── Sub-Task 7: "Reviewer sign-off"            [human] → David signs
```

## 4. Status Machine

```typescript
type TaskStatus =
  | 'not_started'       // Period opened; task exists but no work begun
  | 'in_progress'       // At least one sub-task started
  | 'agent_working'     // AI agent is actively processing
  | 'pending_review'    // Preparer signed off; waiting for reviewer
  | 'review_in_progress'// Reviewer is actively evaluating
  | 'changes_requested' // Reviewer sent back with review notes
  | 'completed'         // All signatures obtained
  | 'redo'              // Data change after sign-off triggered re-review
  | 'blocked'           // Dependency not met
  | 'skipped';          // Intentionally excluded this period

// State transitions are EVENT-DRIVEN, not manually toggled
type StatusEvent =
  | 'period_opened'
  | 'sub_task_started'
  | 'agent_started'
  | 'agent_completed'
  | 'all_sub_tasks_complete'
  | 'preparer_signed'
  | 'reviewer_signed'
  | 'review_note_created'
  | 'data_changed_post_signoff'
  | 'dependency_met'
  | 'dependency_broken'
  | 'task_skipped';
```

### State Transition Diagram

```
                                    ┌───────────┐
                                    │   redo    │◄──── data_changed_post_signoff
                                    └─────┬─────┘
                                          │ sub_task_started
                                          ▼
┌───────────┐  period_opened  ┌───────────┐  sub_task_started  ┌───────────┐
│not_started │───────────────►│not_started │──────────────────►│in_progress │
└───────────┘                 └───────────┘                    └─────┬─────┘
                                    │                                │
                                    │ agent_started                  │ all_sub_tasks_complete
                                    ▼                                │ + preparer_signed
                              ┌───────────┐                          ▼
                              │  agent    │              ┌───────────────────┐
                              │  working  │              │  pending_review   │
                              └─────┬─────┘              └────────┬──────────┘
                                    │ agent_completed              │
                                    └──────►──────────►────────────┤
                                                                   │ reviewer starts
                                                                   ▼
                              ┌───────────┐              ┌───────────────────┐
                              │ changes   │◄─────────────│review_in_progress │
                              │ requested │  review_note │                   │
                              └─────┬─────┘              └────────┬──────────┘
                                    │ sub_task_started             │ reviewer_signed
                                    ▼                              ▼
                              ┌───────────┐              ┌───────────────────┐
                              │in_progress │              │    completed      │
                              └───────────┘              └───────────────────┘

  dependency_broken at any state → blocked
  blocked + dependency_met → previous state
  task_skipped at any state → skipped
```

## 5. Assignment & Delegation

```typescript
interface Assignment {
  userId: string;
  assignedAt: Date;
  assignedBy: string;                  // Could be system (template) or user
}

interface Delegation {
  id: string;
  originalAssignee: string;
  delegateTo: string;
  startDate: Date;
  endDate: Date;
  reason: 'pto' | 'workload_balance' | 'escalation' | 'other';
  createdBy: string;                   // Self or manager
  autoRevert: boolean;                 // Auto-reassign after endDate
  status: 'active' | 'completed' | 'cancelled';
}

interface AgentAssignment {
  agentId: string;
  agentName: string;                   // "Bank Transaction Matcher"
  subTaskIds: string[];                // Which sub-tasks this agent handles
  schedule: 'on_data_arrival' | 'daily' | 'manual';
  lastExecution?: AgentExecution;
}
```

## 6. Dependency Model

```typescript
interface Dependency {
  id: string;
  sourceTaskId: string;                // This task depends on...
  targetTaskId: string;                // ...this task being completed
  type: DependencyType;
  status: 'pending' | 'met' | 'broken';
  metAt?: Date;
}

type DependencyType =
  | 'finish_to_start'    // Target must complete before source starts
  | 'finish_to_finish'   // Target must complete before source completes
  | 'data_dependency'    // Source needs data that target produces
  | 'approval_chain';   // Source needs sign-off from target's reviewer
```

## 7. Transaction-Task Bridge

This is the critical link between Close tasks and Reporting transactions via FloLake.

```typescript
interface TransactionLink {
  id: string;
  taskId: string;
  floLakeTransactionId: string;        // Reference to FloLake Silver Layer
  accountId: string;                   // GL account
  periodId: string;                    // Accounting period
  amount: number;
  currency: string;
  transactionDate: Date;
  source: string;                      // ERP system name
  matchStatus?: 'matched' | 'unmatched' | 'exception';
  matchConfidence?: number;            // 0-100, from AI matching
  matchedTo?: string;                  // Other transaction ID (for recs)
}
```

## 8. Reconciliation Data (Type-Specific Extension)

```typescript
interface ReconciliationData {
  glBalance: Balance;                  // From ERP via FloLake
  reconciledBalance: Balance;          // Computed from matched transactions
  variance: number;
  materialityThreshold: number;
  isWithinMateriality: boolean;
  lastRefreshed: Date;
  refreshSource: 'api' | 'manual';
  balanceHistory: BalanceSnapshot[];   // Period-over-period
}

interface Balance {
  amount: number;
  currency: string;
  asOfDate: Date;
  source: string;                      // "NetSuite GL" or "FloQast Computed"
}
```

## 9. AI & Agent Execution

```typescript
interface AgentExecution {
  id: string;
  agentId: string;
  taskId: string;
  subTaskId: string;
  startedAt: Date;
  completedAt: Date;
  status: 'success' | 'partial' | 'failed';

  // Results
  itemsProcessed: number;
  itemsSucceeded: number;
  itemsFailed: number;
  confidenceAvg: number;

  // ROI metrics
  estimatedManualTime: number;         // Hours this would take manually
  actualExecutionTime: number;         // Seconds the agent took
  costSaved: number;                   // Computed from manual time × labor rate

  // Audit
  executionLog: string;                // Detailed log for compliance
  modelUsed: string;                   // "gpt-4o" or "claude-3-5-sonnet"
  inputDataHash: string;               // Reproducibility
}

interface AIInsight {
  id: string;
  taskId: string;
  type: 'anomaly' | 'recommendation' | 'prediction' | 'trend';
  title: string;
  description: string;
  confidence: number;
  createdAt: Date;
  acknowledged: boolean;
  actionTaken?: string;
}
```

## 10. Document Model (Decoupled from Folders)

```typescript
interface Document {
  id: string;
  taskId: string;
  fileName: string;
  fileType: string;
  fileSize: number;

  // Storage (first-class entity, not folder-dependent)
  storageLocation: StorageLocation;

  // Audit
  uploadedBy: string;
  uploadedAt: Date;
  isLocked: boolean;                   // Locked after sign-off
  version: number;

  // AI
  extractedData?: object;             // AI-parsed content (future)
}

interface StorageLocation {
  provider: 'floqast' | 'sharepoint' | 'gdrive' | 'box' | 'dropbox' | 's3';
  externalId?: string;                // For linked external files
  internalPath?: string;              // For FloQast-hosted files
  url?: string;                       // Direct access URL
}
```

## 11. Review Notes (Enhanced)

```typescript
interface ReviewNote {
  id: string;
  taskId: string;
  subTaskId?: string;                  // Can be scoped to a sub-task
  authorId: string;
  content: string;
  createdAt: Date;

  // Threading
  parentNoteId?: string;              // For reply chains

  // Status
  isResolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;

  // Integration
  externalThreadId?: string;          // Slack/Teams thread sync

  // Classification
  type: 'question' | 'rejection' | 'suggestion' | 'approval_note' | 'escalation';
  severity?: 'info' | 'warning' | 'critical';
}
```

---

## Design Decisions & Rationale

| Decision | Rationale |
|----------|-----------|
| Single entity type with discriminator (`taskType`) | Enables unified inbox, search, and review queue across all product areas. Type-specific behavior lives in sub-task templates and validation rules, not entity structure. |
| Sub-tasks as first-class entities | Enables granular automation (agent completes sub-task 3 while human does sub-task 4), granular progress tracking, and SOP-level visibility. |
| Event-driven status machine | Eliminates manual status toggling. Status is always a reflection of what actually happened (sign-offs, agent completions, data changes). Creates bulletproof audit trail. |
| `processGroup` replaces `folderId` | Provides the "visual context" accountants value (grouping by AP, AR, Cash, etc.) without the folder coupling. Multiple tasks can share a process group across entities. |
| `accountId` links to GL | Enables transaction-task bridge via FloLake. Every task can be linked to its underlying financial data. |
| Tags for flexible classification | Tags are additive and composable (high-risk + CFO review + intercompany). Unlike folders, a task can have multiple tags. |
| Delegation as a first-class concept | Enables self-service PTO coverage with automatic revert, eliminating admin bottleneck. |
| Agent execution with ROI metrics | Every agent run records time-saved, items-processed, and cost-equivalent. This powers the ROI dashboard executives need. |
| Documents decoupled from storage folders | Documents are attached to tasks, not stored in a folder hierarchy. Storage providers are just a location attribute. |
