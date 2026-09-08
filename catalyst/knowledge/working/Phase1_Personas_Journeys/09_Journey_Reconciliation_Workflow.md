# Journey Map: Reconciliation Workflow

**Primary Personas:** Sarah Chen (Preparer) + David Park (Reviewer)
**Flow:** Preparer imports data → matches transactions → resolves exceptions → signs off → Reviewer evaluates → approves/rejects
**Frequency:** Monthly (typically close days 1-5)

---

## Current-State Journey

### Phase 1: Preparer — Set Up Reconciliation Data

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐    ┌──────────────┐
│  Navigate to │───►│  Open rec    │───►│  Check GL      │───►│  GL balance  │
│  folder with │    │  for the     │    │  balance       │    │  is stale    │
│  the account │    │  period      │    │  (per TB)      │    │  or missing  │
└─────────────┘    └──────────────┘    └────────────────┘    └──────────────┘
                                                                    │
                                                             ╔══════╧══════╗
                                                             ║ PAIN POINT  ║
                                                             ║ GL balance  ║
                                                             ║ doesn't     ║
                                                             ║ always      ║
                                                             ║ auto-pull.  ║
                                                             ║ Manual      ║
                                                             ║ refresh or  ║
                                                             ║ wait for    ║
                                                             ║ next cycle. ║
                                                             ╚═════════════╝
                                                                    │
                                                                    ▼
┌─────────────┐    ┌──────────────┐    ┌────────────────┐    ┌──────────────┐
│  Open Excel  │───►│  Update      │───►│  Ensure #FQ    │───►│  Save to     │
│  workbook    │    │  formulas &  │    │  anchor tag    │    │  cloud       │
│  from cloud  │    │  data        │    │  is correct    │    │  storage     │
│  storage     │    │              │    │                │    │              │
└─────────────┘    └──────────────┘    └────────────────┘    └──────────────┘
                                              │
                                       ╔══════╧══════╗
                                       ║ PAIN POINT  ║
                                       ║ #FQ anchor  ║
                                       ║ is brittle. ║
                                       ║ Wrong cell, ║
                                       ║ broken      ║
                                       ║ formula, or ║
                                       ║ moved file  ║
                                       ║ = broken    ║
                                       ║ rec.        ║
                                       ╚═════════════╝
```

### Phase 2: Preparer — Transaction Matching (High-Volume Accounts)

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐    ┌──────────────┐
│  Export      │───►│  Format CSV  │───►│  Upload to     │───►│  Navigate to │
│  transactions│    │  to match    │    │  FloQast AI    │    │  AI Matching │
│  from bank/  │    │  FloQast     │    │  Matching      │    │  module      │
│  sub-ledger  │    │  format      │    │  module        │    │  (different  │
│              │    │              │    │                │    │  product     │
│              │    │              │    │                │    │  area)       │
└─────────────┘    └──────────────┘    └────────────────┘    └──────────────┘
      │                   │                                        │
╔═════╧═════╗      ╔══════╧══════╗                          ╔═════╧══════╗
║ PAIN POINT║      ║ PAIN POINT  ║                          ║ PAIN POINT ║
║ No direct ║      ║ 15-30 min   ║                          ║ AI Matching║
║ connectors║      ║ formatting  ║                          ║ is a       ║
║ for many  ║      ║ CSVs each   ║                          ║ separate   ║
║ sources.  ║      ║ month.      ║                          ║ module —   ║
╚═══════════╝      ╚═════════════╝                          ║ context    ║
                                                             ║ switch     ║
                                                             ║ from rec   ║
                                                             ║ page.      ║
                                                             ╚════════════╝
```

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐
│  Train AI    │───►│  Review      │───►│  Manually      │
│  with sample │    │  AI-generated│    │  resolve       │
│  matches     │    │  matches     │    │  exceptions    │
└─────────────┘    └──────────────┘    └────────────────┘
```

### Phase 3: Preparer — Verify and Sign Off

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐    ┌──────────────┐
│  Navigate    │───►│  Check       │───►│  Variance      │───►│  Upload      │
│  back to rec │    │  GL vs       │    │  within        │    │  support &   │
│  page        │    │  reconciled  │    │  materiality?  │    │  sign off    │
│              │    │  balance     │    │                │    │              │
└─────────────┘    └──────────────┘    └────────────────┘    └──────────────┘
                                              │
                                       ╔══════╧══════╗
                                       ║ PAIN POINT  ║
                                       ║ If variance ║
                                       ║ exceeds     ║
                                       ║ materiality,║
                                       ║ sign-off is ║
                                       ║ suspended.  ║
                                       ║ Must trace  ║
                                       ║ the $s back ║
                                       ║ through     ║
                                       ║ Excel — no  ║
                                       ║ linked      ║
                                       ║ transaction ║
                                       ║ drill-down. ║
                                       ╚═════════════╝
```

### Phase 4: Reviewer — Evaluate Reconciliation

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐    ┌──────────────┐
│  Open rec    │───►│  Check       │───►│  Open Excel    │───►│  Verify      │
│  from        │    │  balances    │    │  workbook to   │    │  formulas &  │
│  checklist   │    │  match       │    │  verify work   │    │  evidence    │
│  (nav away)  │    │              │    │                │    │              │
└─────────────┘    └──────────────┘    └────────────────┘    └──────────────┘
      │                                       │
╔═════╧══════╗                         ╔══════╧══════╗
║ PAIN POINT ║                         ║ PAIN POINT  ║
║ Loses      ║                         ║ Must open   ║
║ place in   ║                         ║ Excel to    ║
║ review     ║                         ║ verify; no  ║
║ queue.     ║                         ║ in-app      ║
╚════════════╝                         ║ workbook    ║
                                       ║ preview.    ║
                                       ╚═════════════╝
```

---

## Aspirational Journey

### Phase 1: Data Flows Automatically (Principle 4: Universal Ingestion)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  BEFORE SARAH EVEN OPENS FLOQAST (overnight)                            │
│                                                                         │
│  ┌── FloLake Silver Layer ────────────────────────────────────────────┐ │
│  │  • GL trial balance pulled from ERP API (every 15 min)            │ │
│  │  • Bank transactions pulled via direct bank API                   │ │
│  │  • Credit card transactions pulled via Ramp/Amex API              │ │
│  │  • Sub-ledger data pulled via ERP integration                     │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                              │                                          │
│                              ▼                                          │
│  ┌── AI Agent ────────────────────────────────────────────────────────┐ │
│  │  • Applied learned matching rules from prior periods              │ │
│  │  • Matched 142/150 bank transactions (94.7%)                      │ │
│  │  • Flagged 8 exceptions with reason codes                         │ │
│  │  • Computed reconciled balance: $2,345,122                        │ │
│  │  • Compared to GL: $2,345,678 → Variance: $556 (within mat.)     │ │
│  │  • Logged all actions for audit trail                             │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ✅ No CSV export/upload — data arrives automatically                   │
│  ✅ No #FQ anchor tags — balances computed natively                     │
│  ✅ No Excel dependency — matching happens inside FloQast               │
│  ✅ No manual refresh — data is always current                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Phase 2: Preparer Reviews Agent Work (Principle 1: Master Object, Principle 8: Invisible AI)

```
┌─────────────┐    ┌─────────────────────────────────────────────────────┐
│  Open task   │───►│  SUPER TASK: Bank Rec - Operating Account           │
│  from inbox  │    │                                                     │
│              │    │  ┌── Status ──────────────────────────────────────┐ │
│              │    │  │ Agent completed 4/6 sub-tasks automatically.   │ │
│              │    │  │ Your action: Review 8 exceptions, then sign.   │ │
│              │    │  └───────────────────────────────────────────────┘  │
│              │    │                                                     │
│              │    │  ┌── Balances (live) ─────────────────────────────┐ │
│              │    │  │ GL (per TB): $2,345,678 (as of 6:00 AM)       │ │
│              │    │  │ Reconciled:  $2,345,122                        │ │
│              │    │  │ Variance:    $556 ✅ within $5,000 threshold   │ │
│              │    │  └───────────────────────────────────────────────┘  │
│              │    │                                                     │
│              │    │  ┌── Exceptions (8) ──────────────────────────────┐ │
│              │    │  │ $312.50  │ Check #4521 │ No match │ [Resolve] │ │
│              │    │  │ $89.00   │ Wire 02/27  │ Timing   │ [Accept]  │ │
│              │    │  │ ...6 more                                      │ │
│              │    │  └───────────────────────────────────────────────┘  │
│              │    │                                                     │
│              │    │  ┌── Matched Transactions (142) ──────────────────┐ │
│              │    │  │ Confidence: 98% avg │ Method: Rule-based       │ │
│              │    │  │ [Expand to view all matches]                   │ │
│              │    │  └───────────────────────────────────────────────┘  │
│              │    │                                                     │
│              │    │  ┌── Agent Execution Log ─────────────────────────┐ │
│              │    │  │ Run: Feb 28, 6:00 AM │ Duration: 4.2s         │ │
│              │    │  │ Transactions processed: 150                     │ │
│              │    │  │ Rules applied: 3 (date+amount, ref ID, desc)   │ │
│              │    │  │ Time saved vs manual: ~2.5 hours               │ │
│              │    │  └───────────────────────────────────────────────┘  │
│              │    │                                                     │
│              │    │  Sarah resolves 6 exceptions, marks 2 as           │
│              │    │  "pending bank confirmation"                        │
│              │    │                           [Sign Off as Preparer ▶] │
└─────────────┘    └─────────────────────────────────────────────────────┘
```

### Phase 3: Reviewer Evaluates (Principle 3: Transactions as Atomic)

```
┌─────────────┐    ┌─────────────────────────────────────────────────────┐
│  David opens │───►│  SUPER TASK: Bank Rec (Review Mode)                 │
│  from review │    │                                                     │
│  queue       │    │  All of Sarah's view PLUS:                          │
│              │    │                                                     │
│              │    │  ┌── Review Context ──────────────────────────────┐ │
│              │    │  │ Preparer: Sarah Chen │ Signed: Feb 28, 3:15 PM│ │
│              │    │  │ Prior period variance: $1,200 (within mat.)   │ │
│              │    │  │ 3-period trend: $800 → $1,200 → $556         │ │
│              │    │  │ Agent confidence this period: 94% (vs 91%)    │ │
│              │    │  └───────────────────────────────────────────────┘  │
│              │    │                                                     │
│              │    │  ┌── Transaction Detail (FloLake) ────────────────┐ │
│              │    │  │ David can drill into ANY matched transaction   │ │
│              │    │  │ to see: source data, match confidence, rule    │ │
│              │    │  │ applied, and whether it appeared in prior      │ │
│              │    │  │ periods. No Excel workbook needed.             │ │
│              │    │  └───────────────────────────────────────────────┘  │
│              │    │                                                     │
│              │    │  [✅ Approve]  [❌ Reject with Note]  [⏭ Next]     │
└─────────────┘    └─────────────────────────────────────────────────────┘

✅ Full transaction-level detail from FloLake — no Excel verification
✅ Period-over-period trend inline — variance direction visible
✅ Agent confidence visible — reviewer knows where to focus scrutiny
✅ One-click approve with auto-advance to next review item
```

---

## Improvement Summary

| Metric | Current State | Aspirational State | Improvement |
|--------|--------------|-------------------|-------------|
| Data preparation (CSV) | 15-30 min/account | 0 (automatic) | 100% elimination |
| Transaction matching | 1-3 hours manual | 4 sec (agent) | 99%+ reduction |
| Excel dependency | Required | Eliminated | Full elimination |
| #FQ anchor maintenance | Monthly per account | Eliminated | Full elimination |
| Reviewer context assembly | 5-10 min per item | 0 (inline) | 100% elimination |
| End-to-end rec time | 2-4 hours | 15-30 min | 85-90% reduction |

## Architecture Principles Demonstrated

| Principle | How It Manifests |
|-----------|-----------------|
| 1. Master Object | Rec task contains balances, transactions, matches, exceptions, docs, notes |
| 3. Transactions as Atomic | Individual transactions from FloLake linked to rec task |
| 4. Universal Ingestion | Bank/card/sub-ledger data arrives via API, not CSV |
| 5. Native Calculation | Balance computation inside FloQast, not Excel |
| 6. Event-Driven | Agent triggers on data arrival; sign-off triggers reviewer notification |
| 8. Invisible AI | Agent matches 95%+ of transactions overnight with zero user input |
