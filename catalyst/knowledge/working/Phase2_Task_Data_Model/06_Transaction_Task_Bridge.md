# Transaction-Task Bridge: Connecting Close to Reporting via FloLake

**Purpose:** Define how Close Super Tasks connect to Reporting's transaction-based architecture through FloLake, creating the unified data foundation for cross-product experiences.

---

## The Opportunity

The Reporting team has already rearchitected around **transactions as the atomic entity** (Doc 02 Sec 4, Principle 3). FloLake's Silver Layer normalizes ERP data into a standardized transaction format. Today, Close and Reporting operate on completely separate data paths — a customer's NetSuite integration for Close and their NetSuite integration for Reporting are essentially independent.

The Transaction-Task Bridge creates a direct link: every transaction in FloLake can be associated with a Super Task, and every Super Task can surface its underlying transactions.

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                          ERP SYSTEMS                              │
│  NetSuite    SAP    Dynamics 365    Sage    QuickBooks    Other   │
└──────┬────────┬────────┬────────────┬────────┬────────────┬──────┘
       │        │        │            │        │            │
       ▼        ▼        ▼            ▼        ▼            ▼
┌──────────────────────────────────────────────────────────────────┐
│                    FloLake BRONZE LAYER                           │
│         Raw ERP data, per-connector format                       │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                    FloLake SILVER LAYER                           │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ NORMALIZED TRANSACTION                                      │ │
│  │                                                             │ │
│  │ id: string              (FloLake transaction ID)            │ │
│  │ tenantId: string        (TLC isolation)                     │ │
│  │ accountId: string       (GL account number)                 │ │
│  │ accountName: string     (GL account name)                   │ │
│  │ entityId: string        (Entity/subsidiary)                 │ │
│  │ periodId: string        (YYYY-MM)                           │ │
│  │ amount: number          (Transaction amount)                │ │
│  │ currency: string        (ISO currency code)                 │ │
│  │ transactionDate: date   (Posting date)                      │ │
│  │ transactionType: string (JE, invoice, payment, etc.)        │ │
│  │ referenceId: string     (ERP transaction reference)         │ │
│  │ description: string     (Transaction memo/description)      │ │
│  │ source: string          (ERP system name)                   │ │
│  │ dimensions: object      (FDM-mapped custom dimensions)      │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
┌────────────────────────┐  ┌────────────────────────┐
│   CLOSE (Super Tasks)  │  │  REPORTING (Reports)   │
│                        │  │                        │
│   TransactionLink      │  │  Report Builder        │
│   connects tasks to    │  │  queries transactions  │
│   their underlying     │  │  for financial reports  │
│   transaction data     │  │                        │
└────────────────────────┘  └────────────────────────┘
```

## TransactionLink Model

```typescript
interface TransactionLink {
  id: string;
  taskId: string;                      // Super Task reference
  floLakeTransactionId: string;        // FloLake Silver Layer reference

  // Denormalized from FloLake for performance
  accountId: string;
  accountName: string;
  amount: number;
  currency: string;
  transactionDate: Date;
  description: string;
  source: string;

  // Close-specific attributes
  matchStatus: MatchStatus;
  matchConfidence?: number;            // 0-100, from AI matching
  matchedToTransactionId?: string;     // For rec matching (bank ↔ GL)
  matchRule?: string;                  // Which rule matched this
  exceptionReason?: string;            // Why it didn't match

  // Audit
  linkedAt: Date;
  linkedBy: 'system' | 'agent' | 'user';
}

type MatchStatus =
  | 'auto_matched'     // AI matched with high confidence
  | 'manual_matched'   // User confirmed/corrected match
  | 'unmatched'        // No match found
  | 'exception'        // Match found but flagged for review
  | 'excluded';        // Intentionally excluded from matching
```

## Linkage Patterns

### Pattern 1: Account-Level Linkage (Balance Reconciliation)

For reconciliation-type Super Tasks, ALL transactions for the linked GL account in the period are automatically associated:

```
Super Task: "Bank Rec - Operating Account 1010"
  Entity: Entity A  |  Period: Feb 2026
  Account: 1010

  TransactionLinks (automatic):
  ├── All GL transactions for account 1010 in Feb 2026
  │   ├── JE-001: $50,000 (deposit)
  │   ├── JE-002: -$12,345 (wire payment)
  │   ├── JE-003: -$8,900 (check payment)
  │   └── ... (47 total GL transactions)
  │
  └── All bank transactions for account 1010 in Feb 2026
      ├── BNK-001: $50,000 (deposit)
      ├── BNK-002: -$12,345 (wire)
      ├── BNK-003: -$8,900 (check)
      └── ... (150 total bank transactions)

  AI Matching Result:
  ├── 142 matched pairs (auto_matched)
  ├── 5 timing differences (exception)
  └── 3 unmatched (unmatched)
```

### Pattern 2: Journal Entry Linkage

For JE-type Super Tasks, the specific journal entry transactions are linked:

```
Super Task: "Revenue Accrual JE"
  Entity: Entity A  |  Period: Feb 2026

  TransactionLinks:
  ├── Debit: Revenue Accrual (4010) $125,000
  └── Credit: Accrued Revenue (3650) -$125,000

  Status: Posted to ERP ✓ (linked back via FloLake sync)
```

### Pattern 3: Variance Analysis Linkage

For analysis-type tasks, transactions are linked to explain variances:

```
Super Task: "Revenue Variance Analysis"
  Entity: Entity A  |  Period: Feb 2026

  TransactionLinks:
  ├── Current period revenue transactions: $2.1M
  ├── Prior period revenue transactions: $1.9M
  ├── Variance: +$200K
  └── Top contributors:
      ├── New contract: Acme Corp ($150K)
      └── Expansion: BigCo ($50K)
```

## Data Flow: How Transactions Arrive

```
1. ERP sync runs (daily/hourly/15-min)
   └──► FloLake Bronze Layer receives raw ERP data

2. FloLake normalization runs
   └──► Silver Layer creates/updates normalized transactions
   └──► SNS notification: "transactions_updated" {entityId, periodId, accounts[]}

3. Close Task Service receives SNS event
   └──► For each affected account:
        └──► Find Super Tasks linked to that account + period
        └──► Create/update TransactionLinks
        └──► If task is reconciliation:
             └──► Recalculate GL balance from transactions
             └──► Trigger AI matching agent if new transactions arrived
             └──► If balance changed post-sign-off → trigger "redo" event

4. Real-time UI update
   └──► WebSocket notification to users viewing affected tasks
   └──► "Balance updated: GL now $2,345,678 (was $2,345,500)"
```

## Balance Computation (Replaces #FQ Anchor)

```typescript
// Current: #FQ anchor scans Excel cell for balance
// Target: Balance computed from FloLake transactions

interface ReconciliationBalance {
  // GL balance = sum of all GL transactions for this account + period
  glBalance: {
    amount: number;
    asOfDate: Date;
    transactionCount: number;
    source: 'FloLake';
  };

  // Reconciled balance = sum of all matched bank/sub-ledger transactions
  reconciledBalance: {
    amount: number;
    matchedCount: number;
    unmatchedCount: number;
    source: 'AI_Matching' | 'Manual';
  };

  // Variance
  variance: number;
  isWithinMateriality: boolean;
  materialityThreshold: number;
}

// No more Excel dependency
// No more #FQ anchor tags
// No more cloud storage sync for balance data
// Balance is ALWAYS current (computed from latest FloLake transactions)
```

## Cross-Product Queries Enabled

The bridge enables queries that are impossible today:

| Query | Current State | With Bridge |
|-------|--------------|-------------|
| "Show me the transactions behind this rec variance" | Must open Excel workbook | Click variance → see transactions inline |
| "What's the GL activity for this account this period?" | Navigate to Reporting module | Visible in Super Task drill-down |
| "Compare this rec to last month's transactions" | Manual period toggle + Excel comparison | Side-by-side in task view |
| "Which recs are affected by today's JE posting?" | Unknown until next refresh cycle | Real-time notification via event |
| "Show me all transactions above $50K across all entities" | Not possible in Close | Search query with amount filter |

## FDM Integration

FloLake's Financial Data Model (FDM) service provides dimension groupings. These can enrich TransactionLinks:

```
Transaction: $50,000 deposit
  FloLake dimensions (via FDM):
  ├── Department: Sales
  ├── Location: San Francisco
  ├── Project: Q4 Campaign
  └── Custom1: Product Line A

  This context is available in the Super Task drill-down,
  enabling the reviewer to understand the business context
  of each transaction without leaving FloQast.
```

## Migration Considerations

1. **Phase 1:** Build TransactionLink for reconciliation-type tasks only (highest value)
2. **Phase 2:** Extend to JE-type tasks (link posted entries)
3. **Phase 3:** Enable cross-product queries (Close → Reporting)
4. **Phase 4:** Enable Reporting → Close navigation (click transaction → see task)

During migration, existing #FQ anchor-based recs continue to work. New recs use TransactionLink. Feature flag controls which path a given entity uses.
