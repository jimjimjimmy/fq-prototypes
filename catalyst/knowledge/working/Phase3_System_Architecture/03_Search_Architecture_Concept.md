# Search Architecture Concept

**Purpose:** Define the search backend that powers FloQast Close's search-first navigation strategy. This is a **critical gap** — no search backend exists today. The entire Project Catalyst vision of replacing folder-based navigation with global search depends on this service being built.

**Context:** Project Catalyst proposes a prominent search toolbar at the top of all pages, with results including top matches, filtered views, recent searches, suggestions, saved queries, and AI-assisted "Ask FloQast" natural language queries. None of this has backend infrastructure today. Close services query MongoDB/DocumentDB directly with `tlcId`-scoped filters — there is no full-text search, no relevance ranking, no faceted filtering, and no cross-entity search capability.

**Depends On:** Super Task Model (Phase 2, `02_Super_Task_Model_Specification.md`), Transaction-Task Bridge (`06_Transaction_Task_Bridge.md`), Organizational Model (`04_Organizational_Model.md`)

---

## 1. What Is Searchable

The search service must index every object a user interacts with in the Close platform. Each object type has distinct searchable fields and relevance weighting.

### 1.1 Tasks (Super Tasks)

The primary search target. Every Super Task is indexed with the following fields:

| Field | Search Type | Weight | Example |
|-------|------------|--------|---------|
| `title` | Full-text | Highest | "Bank Reconciliation - Operating" |
| `description` | Full-text | Medium | "Monthly reconciliation of primary operating..." |
| `processGroup` | Exact + facet | High | "Cash & Banking" |
| `accountId` | Exact + prefix | High | "1010 - Operating Account" |
| `entityId` / `entityName` | Exact + facet | High | "US Operations" |
| `periodId` | Exact + facet | High | "2026-02" |
| `status` | Exact + facet | High | "pending_review" |
| `taskType` | Exact + facet | Medium | "reconciliation", "checklist", "compliance" |
| `tags[]` | Exact + facet | Medium | "high-risk", "SOX", "CFO-review" |
| `preparer.name` | Full-text + facet | Medium | "Sarah Chen" |
| `reviewer.name` | Full-text + facet | Medium | "Marcus Johnson" |
| `dueDate` | Range + sort | Medium | "2026-03-05" |
| `agents[].name` | Full-text | Low | "AP Accrual Agent" |
| `subTasks[].title` | Full-text | Low | "Pull TB from NetSuite" |

### 1.2 Documents

Documents attached to tasks, stored in cloud storage (SharePoint, OneDrive, Google Drive, Box, Dropbox) with metadata indexed from `storagemetadatas` collection.

| Field | Search Type | Weight | Example |
|-------|------------|--------|---------|
| `fileName` | Full-text | Highest | "Q1_2026_Bank_Rec.xlsx" |
| `fileType` | Exact + facet | Medium | "xlsx", "pdf", "csv" |
| `contentPreview` | Full-text | Medium | First 500 chars of extracted text |
| `parentTaskId` | Exact | High | Link back to owning task |
| `uploadedBy` | Exact + facet | Low | "Sarah Chen" |
| `uploadedAt` | Range + sort | Low | "2026-02-28T14:30:00Z" |
| `tags[]` | Exact + facet | Medium | "workpaper", "evidence", "journal-entry" |

**Note:** Full document content indexing (OCR for PDFs, cell extraction for Excel) is deferred to Phase 2. Phase 1 indexes metadata and filename only.

### 1.3 Transactions

Transaction records flowing through the FloLake Silver Layer, linked to tasks via the Transaction-Task Bridge.

| Field | Search Type | Weight | Example |
|-------|------------|--------|---------|
| `amount` | Range + exact | High | 15234.50 |
| `referenceId` | Exact + prefix | Highest | "INV-2026-0042" |
| `date` | Range + sort | High | "2026-02-15" |
| `accountId` | Exact + facet | High | "2010 - Accounts Payable" |
| `vendorName` / `counterparty` | Full-text | Medium | "Acme Corp" |
| `description` | Full-text | Medium | "Monthly software subscription" |
| `source` | Exact + facet | Medium | "NetSuite", "Stripe", "manual" |
| `matchStatus` | Exact + facet | Medium | "matched", "unmatched", "partial" |

### 1.4 Review Notes

Threaded discussion on tasks, synced from Slack/Teams.

| Field | Search Type | Weight | Example |
|-------|------------|--------|---------|
| `content` | Full-text | Highest | "This balance looks off by $2K..." |
| `author.name` | Full-text + facet | Medium | "Marcus Johnson" |
| `parentTaskId` | Exact | High | Link to owning task |
| `createdAt` | Range + sort | Medium | "2026-02-28T16:45:00Z" |
| `isResolved` | Exact + facet | Medium | true/false |

### 1.5 Agents

AI agents configured in the system (Transform agents, matching agents, monitors).

| Field | Search Type | Weight | Example |
|-------|------------|--------|---------|
| `name` | Full-text | Highest | "AP Accrual Agent" |
| `agentType` | Exact + facet | High | "transform", "matching", "monitor" |
| `status` | Exact + facet | High | "active", "paused", "error" |
| `description` | Full-text | Medium | "Calculates monthly AP accruals..." |
| `lastRunAt` | Range + sort | Low | "2026-02-28T08:00:00Z" |
| `assignedTasks[]` | Exact | Medium | Tasks this agent operates on |

---

## 2. Index Strategy

### 2.1 Technology: Elasticsearch / OpenSearch

**Recommendation:** AWS OpenSearch Service (managed Elasticsearch-compatible).

**Rationale:**
- FloQast already runs on AWS. OpenSearch is a managed service with built-in VPC integration, IAM authentication, and auto-scaling — no operational overhead for a new search cluster.
- OpenSearch supports full-text search, faceted aggregations, fuzzy matching, relevance tuning, and nested document indexing — all required for the query model below.
- The Reporting team's FDM service already demonstrates the SNS/SQS event-driven pattern. Search indexing can consume the same event stream.
- Alternative considered: Snowflake full-text search. Rejected — Snowflake is optimized for analytical queries, not sub-200ms interactive search. Latency would be 2-5x higher.

### 2.2 Index Design

Three primary indexes, each optimized for its object type:

```
fq-tasks-{env}          // Super Tasks — the primary index
fq-documents-{env}       // Documents — metadata and content previews
fq-transactions-{env}    // Transactions — amounts, references, dates
```

Supporting indexes:

```
fq-review-notes-{env}    // Review notes — content search
fq-agents-{env}          // Agent configurations and status
fq-search-history-{env}  // Per-user search history for suggestions
```

**Naming convention:** Follows the existing `${env}` prefix pattern used across all FloQast infrastructure (fq2, fq4, fq7, automation, production, production-eu).

### 2.3 Tenant Isolation

All indexes include `tlcId` as a mandatory field. Every query is filtered by `tlcId` at the query layer — this matches the existing MongoDB isolation pattern and ensures no cross-tenant data leakage.

```json
{
  "query": {
    "bool": {
      "filter": [
        { "term": { "tlcId": "tenant-abc-123" } }
      ],
      "must": [
        { "multi_match": { "query": "bank reconciliation", "fields": ["title^3", "description", "tags"] } }
      ]
    }
  }
}
```

**Security alignment:** The GAuth migration (ADR 2026-02-25) will provide the `tlcId` claim in edge tokens. The search service validates the token, extracts `tlcId`, and injects it as a mandatory filter. No query can execute without tenant scoping.

### 2.4 Real-Time Indexing via Event Consumption

The search service does **not** poll MongoDB. Instead, it consumes events published by Close services.

```
┌──────────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Close Services  │────▶│  EventBridge │────▶│   SQS Queue  │────▶│  Search      │
│  (ECS/Lambda)    │     │  (event bus) │     │  (buffering) │     │  Indexer      │
│                  │     │              │     │              │     │  (ECS)       │
└──────────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                                                                         │
                                                                         ▼
                                                                   ┌──────────────┐
                                                                   │  OpenSearch   │
                                                                   │  Cluster     │
                                                                   └──────────────┘
```

**Event sources:**
- Task CRUD operations from Checklist ECS service
- Document metadata updates from Storage Provider Lambdas
- Transaction ingestion from FloLake Silver Layer (via existing SNS broadcast)
- Review note creation from Review Notes ECS service
- Agent status changes from AI services

**Indexing flow:**
1. Service performs a write to MongoDB (source of truth)
2. Service publishes an event to EventBridge (e.g., `task.updated`)
3. EventBridge routes the event to the search indexer's SQS queue
4. Search indexer consumes the event, transforms the payload, and writes to OpenSearch
5. If indexing fails, the message returns to the queue with exponential backoff (SQS dead-letter queue after 3 retries)

**Consistency model:** Eventual consistency. The search index may lag MongoDB by up to 5 seconds (see performance targets). This is acceptable because search is a discovery mechanism, not the source of truth — clicking a search result always loads fresh data from MongoDB.

### 2.5 Bulk Reindexing

For initial data migration, index schema changes, or disaster recovery:

- **Bulk indexer job** (ECS task, not long-running service) scans MongoDB collections page by page and writes to OpenSearch using the Bulk API.
- Estimated initial load: ~50M tasks across all tenants, ~200M documents, ~500M transactions.
- Blue-green index strategy: build new index alongside old, swap alias when complete. Zero downtime.

---

## 3. Query Model

### 3.1 Full-Text Search

The primary search mode. Users type free-text in the global search bar and receive ranked results across all object types.

**Query strategy:** Multi-match across weighted fields with fuzzy matching for typo tolerance.

```
User types: "bank rec operating"

Search executes across:
  - tasks.title (weight 3x)
  - tasks.description (weight 1x)
  - tasks.processGroup (weight 2x)
  - tasks.accountId (weight 2x)
  - documents.fileName (weight 3x)
  - transactions.referenceId (weight 3x)
  - reviewNotes.content (weight 1x)
```

**Result aggregation:** Results from all indexes are merged, deduplicated (documents and review notes roll up under their parent task), and ranked by composite relevance score.

### 3.2 Faceted Filtering

Every search can be refined with facets. The UI presents available facet values with counts.

| Facet | Type | Example Values |
|-------|------|----------------|
| Entity | Multi-select | "US Operations", "UK Entity", "APAC Holding" |
| Period | Single-select | "2026-02", "2026-01", "2025-12" |
| Status | Multi-select | "not_started", "in_progress", "pending_review", "completed" |
| Process Group | Multi-select | "Cash & Banking", "AP", "AR", "Revenue", "Payroll" |
| Tags | Multi-select | "high-risk", "SOX", "CFO-review", "troublemaker" |
| Assignee | Multi-select | "Sarah Chen", "Marcus Johnson" |
| Task Type | Multi-select | "checklist", "reconciliation", "compliance" |
| Due Date | Range | "Overdue", "Due Today", "Due This Week", "Custom Range" |
| Object Type | Multi-select | "Task", "Document", "Transaction", "Review Note" |

**Dynamic facet counts:** As filters are applied, remaining facet values update in real-time to show only valid combinations and accurate counts. This is a standard Elasticsearch aggregation pattern.

### 3.3 Persona-Aware Ranking

Different user roles need different default sort orders. The search service adjusts ranking based on the authenticated user's role.

**Preparer (Staff Accountant):**
- Boost tasks where `preparer.userId == currentUser` by 5x
- Boost status `in_progress` and `not_started` (their actionable work)
- Secondary sort: `dueDate ASC` (most urgent first)
- De-boost completed tasks

**Reviewer (Manager):**
- Boost tasks where `reviewer.userId == currentUser` by 3x
- Boost status `pending_review` by 5x (items waiting on them)
- Boost tasks with `isLate == true` by 4x
- Boost tasks with unresolved review notes by 2x
- Secondary sort: `dueDate ASC`

**Admin (Controller / Close Manager):**
- No personal task boost — admin sees the full picture
- Boost tasks with status `blocked` or `redo` by 3x
- Boost tasks with `isLate == true` by 4x
- Boost tasks with `processGroup` matching their most-viewed groups by 1.5x (implicit personalization)
- Secondary sort: `entityName ASC`, then `dueDate ASC`

**Implementation:** Role is extracted from the GAuth token. A `function_score` query wraps the base query with role-specific boost functions.

### 3.4 Saved Searches and Recent Queries

- **Recent searches:** Stored per-user in `fq-search-history-{env}` index (last 50 queries, TTL 90 days).
- **Saved searches:** Users can bookmark a query + filter combination. Stored in MongoDB (source of truth) with metadata: name, query string, filters, sort order, created date.
- **Suggested searches:** When the search bar is focused but empty, the UI shows recent searches, saved searches, and system-generated suggestions (e.g., "My overdue tasks", "Items pending my review").

---

## 4. Search Result Model

Every search result, regardless of object type, is returned in a unified envelope:

```typescript
interface SearchResult {
  // === IDENTITY ===
  objectType: 'task' | 'document' | 'transaction' | 'reviewNote' | 'agent';
  objectId: string;                    // Direct link to the object

  // === DISPLAY ===
  title: string;                       // Primary display text
  subtitle: string;                    // Secondary context line
  breadcrumb: string[];                // Navigation path: ["US Operations", "2026-02", "Cash & Banking"]

  // === STATUS ===
  statusBadge?: {
    label: string;                     // "Late", "Pending Review", "Completed"
    color: 'red' | 'yellow' | 'green' | 'gray' | 'blue';
  };

  // === PEOPLE ===
  assignee?: {
    name: string;
    avatarUrl: string;
    role: 'preparer' | 'reviewer';
  };

  // === TIMING ===
  dueDate?: Date;
  isOverdue?: boolean;

  // === RELEVANCE ===
  relevanceScore: number;              // 0-1 normalized score
  matchHighlights: MatchHighlight[];   // Highlighted text fragments showing where the query matched

  // === CONTEXT ===
  metadata: Record<string, string>;    // Type-specific extra data (amount for transactions, file type for docs, etc.)
}

interface MatchHighlight {
  field: string;                       // Which field matched
  fragments: string[];                 // HTML fragments with <em> tags around matches
}
```

**Result examples by object type:**

| Type | Title | Subtitle | Breadcrumb | Status Badge |
|------|-------|----------|------------|--------------|
| Task | "Bank Reconciliation - Operating" | "Preparer: Sarah Chen" | US Ops > 2026-02 > Cash | Late (red) |
| Document | "Q1_Bank_Statement.pdf" | "Attached to: Bank Reconciliation" | US Ops > 2026-02 > Cash | -- |
| Transaction | "INV-2026-0042 — $15,234.50" | "Acme Corp, 2026-02-15" | US Ops > 2026-02 > AP | Unmatched (yellow) |
| Review Note | "Balance is off by $2K..." | "Marcus Johnson on Bank Rec" | US Ops > 2026-02 > Cash | Unresolved (yellow) |
| Agent | "AP Accrual Agent" | "Transform agent, last run 2h ago" | -- | Active (green) |

---

## 5. API Design

### 5.1 Search Endpoint

```
POST /search/v1/query
```

**Request:**
```json
{
  "query": "bank reconciliation",
  "filters": {
    "entityId": ["entity-us-ops"],
    "periodId": "2026-02",
    "status": ["in_progress", "pending_review"],
    "processGroup": ["Cash & Banking"],
    "objectType": ["task", "document"]
  },
  "sort": {
    "field": "relevanceScore",
    "order": "desc"
  },
  "pagination": {
    "offset": 0,
    "limit": 25
  },
  "includeFacets": true,
  "includeHighlights": true
}
```

**Response:**
```json
{
  "results": [ /* SearchResult[] */ ],
  "facets": {
    "status": [
      { "value": "in_progress", "count": 12 },
      { "value": "pending_review", "count": 8 }
    ],
    "processGroup": [
      { "value": "Cash & Banking", "count": 15 },
      { "value": "Accounts Payable", "count": 7 }
    ]
  },
  "total": 20,
  "queryTimeMs": 42
}
```

### 5.2 Suggestion Endpoint

```
GET /search/v1/suggest?q=ban&limit=5
```

Returns typeahead suggestions as the user types (prefix matching on titles, names, references).

### 5.3 History Endpoint

```
GET /search/v1/history?limit=10
POST /search/v1/saved
DELETE /search/v1/saved/{savedSearchId}
```

---

## 6. Phased Rollout

### Phase 1: Task Search (Quarter 1)

**Scope:** Index all Super Tasks. Full-text search on task title, description, process group, account, tags. Faceted filtering by entity, period, status, assignee. Persona-aware ranking.

**Why first:** Tasks are the primary object users interact with. Replacing folder navigation with task search delivers immediate value and validates the search-first strategy with real users.

**Engineering effort:** Stand up OpenSearch cluster, build indexer service (ECS), build search API (ECS), integrate with Checklist ECS service events, build frontend search UI component.

**Success metric:** 60% of navigation actions use search instead of folder clicks within 90 days of launch (measured via Amplitude/analytics).

### Phase 2: Document Search (Quarter 2)

**Scope:** Index document metadata (filename, type, upload date, parent task). Basic content preview extraction for text-based files (PDF text, CSV headers).

**Why second:** Documents are the second most-searched object. Staff accountants frequently search for specific workpapers by name. Metadata-only indexing is low-effort; content extraction is deferred.

**Engineering effort:** Extend indexer to consume Storage Provider events, add `fq-documents-{env}` index, update search API to include documents in results.

**Success metric:** Document search reduces average time-to-find-workpaper by 50% (measured via session recordings).

### Phase 3: Transaction Search (Quarter 3)

**Scope:** Index transactions from FloLake Silver Layer. Search by amount, reference ID, date range, counterparty, match status.

**Why third:** Depends on FloLake ingestion pipeline maturity and Transaction-Task Bridge implementation. Transaction search enables auditors and controllers to trace specific financial entries across the close.

**Engineering effort:** Consume FloLake SNS events, build `fq-transactions-{env}` index, handle high-volume indexing (transaction counts are 10-50x task counts).

**Success metric:** Auditors can find any transaction within 3 clicks from the global search bar.

### Phase 4: AI-Powered "Ask FloQast" (Quarter 4+)

**Scope:** Natural language queries processed by the AI Orchestration Service. User asks "Which high-risk reconciliations are late this period?" and receives a structured, filtered result set.

**Architecture:**
1. User submits natural language query
2. Search service routes to AI Orchestration Service
3. AI translates query to structured search (query string + filters + sort)
4. Structured search executes against OpenSearch
5. AI summarizes results in plain language alongside standard result cards

**Why last:** Requires AI Orchestration Service (see `05_AI_Orchestration_Concept.md`), robust search indexes for all object types, and sufficient training data from prior phases. Also the highest-risk, highest-reward feature.

**Success metric:** 80% of "Ask FloQast" queries return relevant results without the user needing to reformulate.

---

## 7. Performance Targets

| Metric | Target | Rationale |
|--------|--------|-----------|
| Search query latency (p50) | <100ms | Interactive feel — results appear as user types |
| Search query latency (p95) | <200ms | Worst-case still feels instantaneous |
| Search query latency (p99) | <500ms | Acceptable for complex multi-facet queries |
| Index propagation latency | <5 seconds | Event published to searchable in OpenSearch |
| Typeahead suggestion latency | <50ms | Must feel like autocomplete, not a search |
| Bulk reindex throughput | >10,000 docs/sec | Full reindex of 50M tasks in <2 hours |
| Index availability | 99.95% | Matches OpenSearch managed service SLA |
| Search availability | 99.9% | Degraded mode: fallback to MongoDB queries if OpenSearch is down |

### 7.1 Cluster Sizing Estimate

| Environment | Nodes | Instance Type | Storage | Estimated Cost |
|-------------|-------|---------------|---------|----------------|
| Production | 3 data + 3 master | r6g.xlarge | 500GB EBS/node | ~$3,200/mo |
| Production-EU | 3 data + 3 master | r6g.xlarge | 500GB EBS/node | ~$3,200/mo |
| Staging | 2 data + 1 master | r6g.large | 200GB EBS/node | ~$800/mo |
| Dev (fq2/fq4/fq7) | 1 data | t3.medium | 100GB EBS | ~$150/mo each |

### 7.2 Graceful Degradation

If OpenSearch is unavailable:
- Search UI shows a degraded state message
- Falls back to MongoDB `$text` index queries (slower, no facets, no ranking)
- Indexer queues events in SQS (messages persist up to 14 days)
- When OpenSearch recovers, indexer drains the backlog automatically

---

## 8. Relationship to Existing Systems

### 8.1 Replaces

- **Folder-based navigation** as the primary discovery mechanism (folders remain for backward compatibility but are no longer the entry point)
- **Global Checklist / Global Reconciliations views** — search with facets replaces these as cross-entity filtered views
- **MongoDB ad-hoc queries** used by Workflow Analytics for finding items by status/assignee

### 8.2 Depends On

- **Checklist ECS Service** — publishes task lifecycle events
- **Review Notes ECS Service** — publishes review note events
- **Storage Provider Lambdas** — publishes document metadata events
- **FloLake Silver Layer** — publishes transaction ingestion events (via existing SNS)
- **GAuth** — provides authenticated `tlcId` for tenant-scoped queries
- **EventBridge** — event routing bus (see `04_Workflow_Engine_Concept.md`)

### 8.3 Enables

- **Project Catalyst Global Search UI** — this is the backend that Catalyst's search bar calls
- **Task/Inbox View** — pre-filtered search query ("my tasks, due this week, sorted by due date")
- **Drill-Down View** — related items section powered by "more like this" search queries
- **Close Timeline / Gantt** — timeline data can be sourced from search aggregations (status counts by date range)
- **AI "Ask FloQast"** — structured search as the execution layer for natural language queries

---

## 9. Open Questions

1. **Full document content indexing** — Should we invest in OCR/text extraction for PDFs and Excel content parsing? High value for auditors but significant compute and storage cost. Evaluate after Phase 2 metadata-only launch.

2. **Cross-product search** — Should the search service also index Compliance tasks, Reporting reports, and Ops Workflow items? If so, each product team would publish events to the same bus and the search service indexes them. Recommend starting Close-only and expanding.

3. **Search analytics** — Should we track what users search for and what they click? This data would inform relevance tuning, surface popular queries as suggestions, and identify navigation gaps. Recommend yes, built into Phase 1.

4. **Permission-filtered results** — When ReBAC is implemented, search results must be filtered by the user's relationship-based permissions. This means the search query must either (a) include permission predicates or (b) post-filter results against a permission check. Option (a) requires denormalizing permissions into the search index. Option (b) is simpler but may return fewer results than the requested page size. Recommend starting with option (b) and evaluating performance.
