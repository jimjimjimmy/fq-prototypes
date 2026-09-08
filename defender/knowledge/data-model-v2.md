# Defender Prototype — Data Model v2

**Status**: Planned — implementation in progress as of 2026-03-24
**Branch**: `defender/figma-alignment-checkpoint`
**Goal**: Expand backend from 25 flat transactions to ~90 richly-attributed records across 3 months, with vendor metadata, period context, sign-offs, and AI insights — enabling all 10 narrative demo scenarios and realistic rule firing.

---

## Files Being Modified

| File | Change |
|---|---|
| `server/db.json` | Full rewrite — 7 collections, ~90 transactions |
| `server/middleware.js` | **New** — computes derived fields on each GET |
| `server/server.js` | **New** — custom json-server entrypoint |
| `src/data/mock-rules.ts` | 8 new rules + fix 4 existing broken rules |
| `src/types/index.ts` | New FieldTypes, expanded Anomaly, new interfaces |
| `src/utils/rule-engine.ts` | Bug fixes + new field evaluators |
| `package.json` | Server script → `node server/server.js` |

---

## Bug Fixes (Must Do First)

### 1. `rule-engine.ts` — Missing field evaluators
`evaluateCondition()` has no mapping for: **Department, Class, Location, Created By**.
These silently return `false` — any rule using them never fires.
Fix: add `case 'Department': return anomaly.department` etc.

### 2. `rule-engine.ts` — Anomaly count over-counting
`ruleCounts[rule.id].total += newAnomalyCount` should be `+= 1`.
When one anomaly matches 3 rules, each rule incorrectly adds 3 to its count.

### 3. `db.json` — Sign-offs missing
DetailPanel.tsx renders preparer/reviewer sign-off toggles with no backing data.
Fix: add `signoffs` collection.

---

## db.json Collections (v2)

### `vendors` (15 records)

```ts
interface Vendor {
  id: string
  name: string
  createdDate: string          // ISO date
  hasEin: boolean
  addressType: 'residential' | 'po_box' | 'commercial'
  bankAccountUpdatedDate: string | null
  normalPaymentRangeMin: number
  normalPaymentRangeMax: number
  primaryDepartment: string
  primaryGlAccount: string
  averageMonthlyInvoiceCount: number
  emailDomain: 'personal' | 'business'
  isActive: boolean
}
```

**Key scenario vendors:**
| id | name | createdDate | hasEin | addressType | Notes |
|---|---|---|---|---|---|
| V001 | Apex IT Solutions | 2024-01-15 | true | commercial | Duplicate bill scenario |
| V002 | Pacific Consulting LLC | 2026-02-28 | true | residential | Threshold creep scenario |
| V003 | Meridian Business Services | 2026-01-04 | false | po_box | Ghost vendor scenario |
| V004 | Global Tek Innovations | 2026-03-17 | true | commercial | Friday wire scenario; bankAccountUpdatedDate=2026-03-17 |
| V005 | Southwest Office Supplies | 2023-06-01 | true | commercial | Vendor flip; bankAccountUpdatedDate=2026-03-15 |
| V006 | FloQast Inc | 2022-03-01 | true | commercial | Process drift scenario |
| V007 | Acme Corp | 2021-05-01 | true | commercial | Carry-over |
| V008 | TechCorp | 2020-08-01 | true | commercial | Carry-over |
| V009 | Global Industries | 2019-11-01 | true | commercial | Carry-over |
| V010–V015 | Various clean vendors | 2020–2023 | true | commercial | Volume filler |

---

### `accounts` (20 records)

```ts
interface Account {
  id: string
  code: string
  name: string
  type: 'asset' | 'liability' | 'revenue' | 'expense' | 'equity'
  normalMonthlyMin: number
  normalMonthlyMax: number
  isCapex: boolean
  requiresPo: boolean
  approvalThreshold: number
  priorPeriodAverage: number
}
```

**Key accounts:**
| code | name | type | normalMonthlyMax | isCapex | Notes |
|---|---|---|---|---|---|
| 6420 | IT Operating Supplies | expense | 8000 | false | Capex misclassification target |
| 0500 | Business Consulting | expense | 50000 | false | PO bypass risk |
| 0620 | Legal Services | expense | 30000 | false | Process drift destination |
| 5000 | Intercompany Transfers | liability | 200000 | false | Cross-entity flag |
| 9900 | Suspense | asset | 0 | false | Always flagged |
| 4100 | Product Revenue | revenue | 500000 | false | Post-close JE target |
| 1700 | Computer Equipment | asset | 0 | true | Correct code for capex |
| 2200 | Deferred Revenue | liability | 100000 | false | Post-close JE source |

---

### `periods` (3 records)

```ts
interface Period {
  id: string
  name: string
  startDate: string
  closeDate: string | null
  isCurrentPeriod: boolean
  isClosed: boolean
}
```

| id | name | startDate | closeDate | isClosed |
|---|---|---|---|---|
| P001 | January 2026 | 2026-01-01 | 2026-02-03 | true |
| P002 | February 2026 | 2026-02-01 | 2026-03-04 | true |
| P003 | March 2026 | 2026-03-01 | null | false ← current |

---

### `signoffs` (~40 records)

```ts
interface Signoff {
  id: string
  transactionId: string
  ruleId: string
  userId: string
  role: 'preparer' | 'reviewer'
  signedAt: string
}
```

Populate for all `status: "Resolved"` and `status: "Investigating"` transactions.
Open transactions have no sign-off records (UI renders unsigned toggles).

---

### `insights` (12 records)

```ts
interface Insight {
  id: string
  type: 'benford' | 'zscore' | 'process_drift' | 'velocity'
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  affectedTransactionIds: string[]
  affectedVendorId: string | null
  affectedAccountId: string | null
  detectedDate: string
  statisticalDetail: string   // e.g. "4.2σ above vendor baseline"
}
```

**12 pre-written insights** (see `backend-overhaul-research.md` for full text):
1. Benford — first-digit anomaly in Vendor Bills (excess 4s and 9s)
2. Z-score — Pacific Consulting velocity 4.2σ above baseline
3. Process drift — FloQast Inc Finance → Legal routing change (Feb)
4. Z-score — Meridian Business Services 5.1σ above new-vendor baseline
5. Benford — February JE leading-digit distribution anomaly
6. Velocity — Global Tek Innovations large payment 4 days after creation
7. Process drift — 6420-IT Operating Supplies 42x normal monthly volume
8. Z-score — 4 Pacific Consulting invoices in 7-day window, all < $5k
9. Benford — expense report amounts cluster at 4s, 7s, 9s
10. Process drift — Southwest Office Supplies bank account change 4 days before payment
11. Velocity — 7 of 15 March JEs posted in last 3 business days of period
12. Z-score — Post-close JE: entered April 5, glDate March 31, $95k revenue

---

### `transactions` (~90 records)

**New fields added beyond existing schema:**

```ts
// Added to existing Anomaly type:
vendorId: string                       // ref → vendors.id
glDate: string                         // accounting date (may differ from enteredDate)
enteredDate: string                    // when typed into ERP
enteredBy: string                      // user id
approvedBy: string | null              // null = no approval on record
sameUserEnteredAndApproved: boolean
poReference: string | null             // null = no PO
hasAttachment: boolean
isRoundNumber: boolean                 // amount % 1000 === 0 && amount >= 5000
isPeriodEnd: boolean                   // glDate within last 3 days of period.closeDate
isPostClose: boolean                   // glDate in closed period, enteredDate after closeDate
dayOfWeek: number                      // 0–6, from enteredDate (0 = Sunday)
hourOfDay: number                      // 0–23, from enteredDate
vendorAgeAtTransaction: number         // days since vendor.createdDate at enteredDate
priorPeriodAccount: string | null      // GL code this vendor used last period
priorPeriodDepartment: string | null   // Department this vendor used last period
triggeredRules: string[]               // initial state, overridden by client rule engine
anomalyCount: number                   // initial state, overridden by client rule engine
```

**Volume:** ~90 transactions across 3 months:
- Jan 2026: 30 (18 clean, 12 anomaly)
- Feb 2026: 30 (18 clean, 12 anomaly)
- Mar 2026: 30 (15 clean, 15 anomaly — current period, more anomalies for demo richness)

---

### `comments` (~45 records)

Same structure as v1 (`id, transactionId, author, text, timestamp, parentId?`).
Each narrative scenario should have 3–5 comments telling the investigation story.

---

## Transaction Scenario Catalog

| # | Scenario | Key Transaction IDs | Rules Triggered |
|---|---|---|---|
| 1 | Duplicate Bill (Apex IT) | BILL-44200, BILL-44201 | Duplicate Invoice, Round Dollar |
| 2 | Threshold Creep (Pacific Consulting) | BILL-44210, BILL-44211, BILL-44212, BILL-44213 | Threshold Circumvention, New Vendor, Missing PO |
| 3 | Sleeping Accrual ($75k) | JE-22900, JE-22901 | Round Dollar, Missing Department |
| 4 | Ghost Vendor (Meridian) | BILL-44100, BILL-44101, BILL-44102 | New Vendor No EIN, Missing PO, Unusual Vendor Activity |
| 5 | Expense Double-Dip | EXP-00150, EXP-00151 | Duplicate Invoice |
| 6 | Friday Wire (Global Tek) | PAY-33400 | New Vendor Large Payment, Missing PO, Weekend/After-Hours |
| 7 | Capex Misclassification | BILL-44220 | Expense Misclassification, Transaction >$100k, Missing PO |
| 8 | Credit Memo Cover-Up | PAY-33410, CM-11200 | Unusual Credit Memo, Missing Approvals |
| 9 | Post-Close Adjustment | JE-22910 | Post-Close Entry, Round Dollar, Cross-Entity |
| 10 | Vendor Flip (Southwest) | PAY-33420 | High-Value, Missing Approvals |

---

## Rule Catalog (v2)

### Existing rules — fixes applied

| Rule | Fix Applied |
|---|---|
| Round Dollar Amounts | Condition changed from hardcoded list to `Is Round Number = true` |
| Weekend Transactions | Condition changed from `Memo Contains 'Sunday'` to `Day Of Week = 0 OR 6` |
| Missing Department | Condition changed to `Department Is Empty` |
| Missing Approvals | Condition changed to `Has PO = null AND Amount > 50000` |

### New rules added

| # | Rule Name | Condition (simplified) | Severity |
|---|---|---|---|
| 11 | Threshold Circumvention | Entry Type=Vendor Bill AND 4500 < Amount < 5000 AND Vendor Age < 30 | 8 |
| 12 | New Vendor Large Payment | Vendor Age < 30 AND Amount > 5000 | 8 |
| 13 | Post-Close Entry | Is Post Close = true | 9 |
| 14 | Duplicate Invoice | Entry Type=Vendor Bill AND Is Round Number = true AND Vendor Age < 365 | 7 |
| 15 | Process Drift | Department = "Legal" AND Account Contains "Business Consulting" | 6 |
| 16 | Missing PO on High Value | Has PO Is Empty AND Amount > 10000 AND Entry Type=Vendor Bill | 7 |
| 17 | Segregation of Duties | Amount > 25000 AND Memo Contains "self-approved" | 9 |
| 18 | New Vendor No EIN | Vendor Age < 60 AND Memo Contains "no EIN" | 7 |

> **Implementation note on approximations**: Rules 15, 17, 18 cannot express their true intent (cross-row comparison, HR data lookup) using the boolean rule engine. They use field-value conditions crafted to match the pre-built scenario transaction data exactly. This is acceptable for a prototype.

---

## Middleware (server/middleware.js)

Computes on every `GET /api/transactions` response per transaction:
```js
isRoundNumber = amount % 1000 === 0 && amount >= 5000
dayOfWeek = new Date(enteredDate).getDay()   // 0=Sun, 6=Sat
hourOfDay = new Date(enteredDate).getHours()
// vendorAgeAtTransaction: lookup vendor by vendorId, diff vs enteredDate
// isPostClose: lookup period by postingPeriod name, check isClosed && enteredDate > closeDate
// isPeriodEnd: check if glDate within 3 days of period.closeDate
```

---

## New FieldTypes for Rule Engine

Added to `FieldType` union in `types/index.ts`:
```ts
'Vendor' | 'Day Of Week' | 'Has PO' | 'Is Round Number' | 'Is Post Close' | 'Vendor Age'
```

Mapped in `rule-engine.ts` `evaluateCondition()`:
```ts
case 'Vendor': return anomaly.entity
case 'Day Of Week': return anomaly.dayOfWeek
case 'Has PO': return anomaly.poReference
case 'Is Round Number': return anomaly.isRoundNumber
case 'Is Post Close': return anomaly.isPostClose
case 'Vendor Age': return anomaly.vendorAgeAtTransaction
```

---

## Verification Checklist

1. `npm run server` starts without errors on :3001
2. `GET /api/transactions` returns ~90 records with all new fields present
3. `GET /api/insights` returns 12 records
4. `GET /api/vendors` returns 15 records
5. `GET /api/signoffs?transactionId=X` returns records for Resolved/Investigating transactions
6. Rule engine: `Department Is Empty` rule fires on transactions with `department: null`
7. Rule engine: anomaly matching 3 rules shows `anomalyCount: 3`; each rule `totalCount` increments by 1
8. Scenario 2 (Threshold Creep): 4 Pacific Consulting bills all < $5k, same week, trigger Threshold Circumvention
9. Scenario 9 (Post-Close): `isPostClose: true`, `glDate: "2026-03-31"`, `enteredDate: "2026-04-05"`
10. Process drift: FloQast Inc Feb records have `priorPeriodDepartment: "Finance & Accounting"`, `department: "Legal"`
11. Weekend rule fires on transactions with `dayOfWeek: 0` or `dayOfWeek: 6`
12. Round dollar rule fires on transactions with `isRoundNumber: true`
