# Organizational Model: From Folders to Tags, Groups & Views

**Purpose:** Define how tasks are organized, discovered, and displayed without relying on the folder hierarchy. This document addresses the first of the folder's three duties: **Organization**.

---

## The Problem

Today, folders provide the only way to organize close tasks. The hierarchy `Entity → Period → Folder` determines:
- What tasks appear in a given view
- How tasks are visually grouped on screen
- What users see when they navigate the close

This creates rigidity: tasks can only belong to one folder, folders can't be reorganized without risk, and there's no way to create cross-cutting views (e.g., "all high-risk items across all entities").

## The Solution: Three Orthogonal Axes

Replace the single folder axis with three independent, composable axes:

```
┌────────────────────────────────────────────────────────────┐
│                    TASK ORGANIZATION                        │
│                                                            │
│  Axis 1: PROCESS GROUPS (structural)                       │
│  ─────────────────────────────────                         │
│  Replaces: Folder hierarchy                                │
│  Examples: Cash & Banking, AP, AR, Revenue, Payroll,       │
│            Fixed Assets, Intercompany, Tax, Other          │
│  Properties:                                               │
│  • Predefined by admin (like folders, but simpler)         │
│  • One per task (primary classification)                   │
│  • Tied to GL account ranges                               │
│  • Used for timeline visualization (Gantt work streams)    │
│                                                            │
│  Axis 2: TAGS (descriptive, additive)                      │
│  ────────────────────────────────────                      │
│  Replaces: Nothing (expanded from current limited tags)    │
│  Examples:                                                 │
│  • Risk: high-risk, CFO-review, audit-focus                │
│  • Status: troublemaker, recurring-issue                   │
│  • Workflow: quarter-end-only, year-end-only               │
│  • Custom: intercompany, multi-entity, manual-process      │
│  Properties:                                               │
│  • Multiple per task (composable)                          │
│  • Admin-defined + user-created                            │
│  • Used for filtering, searching, and reporting            │
│  • Can trigger workflow rules (e.g., "high-risk" → extra   │
│    reviewer required)                                      │
│                                                            │
│  Axis 3: SAVED VIEWS (personalized lenses)                 │
│  ────────────────────────────────────────                  │
│  Replaces: Hardcoded Checklist/Folders/Global views        │
│  Examples:                                                 │
│  • "My Tasks Today" (filter: assigned to me, due ≤ today)  │
│  • "High-Risk Items" (filter: tag = high-risk)             │
│  • "AP Across All Entities" (filter: processGroup = AP)    │
│  • "Late Items" (filter: status = late)                    │
│  Properties:                                               │
│  • Personal or shared (team-level)                         │
│  • Configurable: filters, sorting, grouping, columns       │
│  • Persistent across sessions                              │
│  • Shareable via URL                                       │
└────────────────────────────────────────────────────────────┘
```

## Process Group Definition

```typescript
interface ProcessGroup {
  id: string;
  tenantId: string;
  name: string;                    // "Cash & Banking"
  category: GroupCategory;
  sortOrder: number;               // For timeline display
  accountRanges?: AccountRange[];  // Auto-classify tasks by GL account
  icon?: string;                   // Visual identifier
  color?: string;                  // For timeline bars
}

type GroupCategory =
  | 'balance_sheet_asset'
  | 'balance_sheet_liability'
  | 'balance_sheet_equity'
  | 'income_statement'
  | 'other';

interface AccountRange {
  startAccount: string;            // "1000"
  endAccount: string;              // "1999"
}
```

### Default Process Groups

| Process Group | Category | Typical Account Range | Timeline Order |
|--------------|----------|----------------------|----------------|
| Cash & Banking | BS - Asset | 1000-1099 | 1 |
| Accounts Receivable | BS - Asset | 1100-1299 | 2 |
| Inventory | BS - Asset | 1300-1499 | 3 |
| Prepaid & Other Assets | BS - Asset | 1500-1999 | 4 |
| Fixed Assets | BS - Asset | 2000-2499 | 5 |
| Accounts Payable | BS - Liability | 3000-3299 | 6 |
| Accrued Liabilities | BS - Liability | 3300-3599 | 7 |
| Deferred Revenue | BS - Liability | 3600-3799 | 8 |
| Debt & Financing | BS - Liability | 3800-3999 | 9 |
| Equity | BS - Equity | 4000-4999 | 10 |
| Revenue | IS | 5000-5999 | 11 |
| COGS | IS | 6000-6999 | 12 |
| Operating Expenses | IS | 7000-7999 | 13 |
| Intercompany | Other | Various | 14 |
| Tax | Other | Various | 15 |
| Payroll | Other | Various | 16 |

Admins can customize: rename, reorder, add/remove groups, adjust account ranges.

## Tag System

```typescript
interface Tag {
  id: string;
  tenantId: string;
  name: string;
  type: TagType;
  color: string;
  createdBy: string;
  isSystemTag: boolean;            // Predefined vs. custom
}

type TagType =
  | 'risk'         // high-risk, audit-focus, CFO-review
  | 'frequency'    // monthly, quarterly, annual
  | 'workflow'     // requires-dual-review, agent-eligible
  | 'custom';      // user-defined

// Tags can trigger workflow rules
interface TagRule {
  tagId: string;
  action: TagAction;
}

type TagAction =
  | { type: 'require_additional_reviewer' }
  | { type: 'require_evidence_count'; min: number }
  | { type: 'flag_on_dashboard' }
  | { type: 'auto_assign_agent'; agentId: string };
```

## Saved View Model

```typescript
interface SavedView {
  id: string;
  tenantId: string;
  userId?: string;                 // null = shared view
  name: string;
  isDefault: boolean;

  // What to show
  filters: ViewFilter[];
  sorting: ViewSort[];
  grouping: ViewGrouping;
  columns: ViewColumn[];

  // Display
  viewType: 'list' | 'board' | 'timeline' | 'calendar';
}

interface ViewFilter {
  field: string;                   // "processGroup", "tags", "status", "preparer", etc.
  operator: 'equals' | 'in' | 'not_in' | 'contains' | 'before' | 'after';
  value: any;
}

interface ViewSort {
  field: string;
  direction: 'asc' | 'desc';
}

interface ViewGrouping {
  groupBy: string;                 // "processGroup", "status", "entity", "preparer"
  subGroupBy?: string;
}

interface ViewColumn {
  field: string;
  width?: number;
  visible: boolean;
}
```

### Preset Views (System-Provided)

| View Name | Audience | Filters | Grouping | Sort |
|-----------|----------|---------|----------|------|
| My Tasks | Preparer | assigned to me | by status (late → due today → upcoming) | due date asc |
| Review Queue | Reviewer | pending my review | by entity | due date asc |
| Close Timeline | Manager | all tasks, current period | by process group | timeline (Gantt) |
| Late Items | Manager | status = late | by entity | days overdue desc |
| High Risk | Manager/VP | tag = high-risk | by entity | due date asc |
| All Tasks | Admin | none | by process group | due date asc |
| Agent Dashboard | Admin | has agent assignments | by agent status | last execution |

## How Grouping Replaces Folders

### Current: Folder-Based View
```
Entity A > February 2026 > Accounts Payable (folder)
├── AP Sub-Ledger Reconciliation
├── AP Aging Report
├── AP Accrual Journal Entry
├── Vendor Payment Reconciliation
└── AP Cutoff Analysis
```

### Target: Process Group + Tags View
```
Accounts Payable (process group)        Tags: [high-risk] [quarterly]
├── AP Sub-Ledger Reconciliation        [monthly] [agent-eligible]
├── AP Aging Report                     [monthly]
├── AP Accrual Journal Entry            [monthly] [agent-eligible]
├── Vendor Payment Reconciliation       [monthly] [high-risk]
└── AP Cutoff Analysis                  [quarterly] [audit-focus]
```

**The visual experience is nearly identical** — accountants see the same grouping. But:
- Tasks can be viewed via OTHER groupings (by assignee, by status, by tag)
- Tags add rich metadata (risk, frequency, automation eligibility)
- No folder rename/merge/delete risks
- No permission coupling
- No storage sync coupling

## Migration: Folders → Process Groups + Tags

| Current Folder Attribute | Maps To |
|------------------------|---------|
| `folder.name` (e.g., "Accounts Payable") | `processGroup.name` |
| `folder.parentFolderId` | `processGroup.category` (if nested) |
| `folder.permissions` | `ROLE` + `ROLE_PERMISSION` (ReBAC) |
| `folder.storageProviderId` | `DOCUMENT.storageProvider` (per-document) |
| `folder.isLocked` | `PERIOD.status = 'locked'` (period-level lock) |

### Migration Rules
1. Each unique top-level folder name → Process Group
2. Sub-folders → merged into parent Process Group (or new group if distinct)
3. Items inherit their folder's process group assignment
4. Folder-level tags → preserved as-is
5. Folder permissions → converted to Role + Permission grants
6. Storage sync → Document-level storage provider links
