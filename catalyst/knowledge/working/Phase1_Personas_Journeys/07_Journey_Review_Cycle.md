# Journey Map: Review Cycle

**Primary Persona:** David Park (Senior Accountant / Reviewer)
**Flow:** Reviewer receives items for review → evaluates with full context → approves or rejects with notes
**Frequency:** Monthly (peak during close days 3-7)

---

## Current-State Journey

### Phase 1: Assemble Review Queue

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐    ┌──────────────┐
│  Open        │───►│  Navigate to │───►│  Filter by     │───►│  Note items  │
│  Checklist   │    │  Global      │    │  "Ready for    │    │  awaiting    │
│  view        │    │  Checklist   │    │  Review" +     │    │  review      │
│              │    │  page        │    │  assigned to me│    │  (count)     │
└─────────────┘    └──────────────┘    └────────────────┘    └──────────────┘
                                                                    │
                                              ┌─────────────────────┘
                                              ▼
┌─────────────┐    ┌──────────────┐    ┌────────────────┐
│  Switch to   │───►│  Filter by   │───►│  Note rec      │
│  Global Recs │    │  "Ready for  │    │  items         │
│  view        │    │  Review"     │    │  awaiting      │
│              │    │              │    │  review        │
└─────────────┘    └──────────────┘    └────────────────┘
      │
╔═════╧═══════════╗
║   PAIN POINT    ║
║   TWO separate  ║
║   queues for    ║
║   the same job. ║
║   No unified    ║
║   review queue. ║
╚═════════════════╝
```

**Actions:** Navigate to Global Checklist → Filter → Count items → Navigate to Global Recs → Filter → Count items → Mentally merge queues
**Emotion:** Frustrated — "Why are these two different lists?"
**Time:** 3-5 minutes to assemble a mental review queue

### Phase 2: Review Individual Item

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐
│  Click item  │───►│  See limited │───►│  Click into    │
│  in checklist│    │  row data    │    │  rec detail    │
│  grid        │    │  (no balance,│    │  page for      │
│              │    │   no docs)   │    │  full context  │
└─────────────┘    └──────────────┘    └────────────────┘
                          │                    │
                   ╔══════╧══════╗      ╔══════╧══════╗
                   ║ PAIN POINT  ║      ║ PAIN POINT  ║
                   ║ Grid row    ║      ║ Navigating   ║
                   ║ lacks the   ║      ║ to rec page  ║
                   ║ context to  ║      ║ = lose place ║
                   ║ make a      ║      ║ in checklist ║
                   ║ decision.   ║      ║ grid. Must   ║
                   ╚═════════════╝      ║ re-filter    ║
                                        ║ afterward.   ║
                                        ╚═════════════╝
                                               │
                                               ▼
┌─────────────┐    ┌──────────────┐    ┌────────────────┐
│  Check       │───►│  Open cloud  │───►│  Review        │
│  balance     │    │  storage     │    │  attached      │
│  (GL vs rec) │    │  workbook    │    │  evidence      │
└─────────────┘    └──────────────┘    └────────────────┘
      │
╔═════╧══════╗
║ PAIN POINT ║
║ Balance may║
║ be stale.  ║
║ No way to  ║
║ know when  ║
║ last       ║
║ refresh.   ║
╚════════════╝
```

### Phase 3: Approve or Reject

```
┌─────────────┐         ┌──────────────┐
│  If OK:      │────────►│  Sign off    │
│  Approve     │         │  as reviewer │
└─────────────┘         └──────────────┘
                               │
                               ▼
                        ┌──────────────┐    ┌────────────────┐
                        │  Navigate    │───►│  Re-apply      │
                        │  BACK to     │    │  filters.      │
                        │  checklist   │    │  Find next     │
                        │  grid        │    │  item.         │
                        └──────────────┘    └────────────────┘
                               │                    │
                        ╔══════╧══════╗      ╔══════╧══════╗
                        ║ PAIN POINT  ║      ║ PAIN POINT  ║
                        ║ Lost place  ║      ║ 30-90 sec   ║
                        ║ in list.    ║      ║ cognitive    ║
                        ║ Scroll/     ║      ║ reload per   ║
                        ║ search to   ║      ║ item × 40   ║
                        ║ resume.     ║      ║ items =      ║
                        ╚═════════════╝      ║ 20-60 min    ║
                                             ║ wasted.      ║
                                             ╚═════════════╝

┌─────────────┐         ┌──────────────┐    ┌────────────────┐
│  If NOT OK:  │────────►│  Open review │───►│  Write note.   │
│  Reject      │         │  notes       │    │  Preparer gets │
│              │         │  (separate   │    │  notification. │
│              │         │  section)    │    │  Item reverts. │
└─────────────┘         └──────────────┘    └────────────────┘
                               │
                        ╔══════╧══════╗
                        ║ PAIN POINT  ║
                        ║ No central  ║
                        ║ view of     ║
                        ║ "my open    ║
                        ║ review      ║
                        ║ notes."     ║
                        ╚═════════════╝
```

### Phase 4: Track Open Review Notes

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐
│  Remember    │───►│  Revisit     │───►│  Check if      │
│  which items │    │  each item   │    │  preparer      │
│  I left      │    │  individually│    │  responded     │
│  notes on    │    │              │    │                │
└─────────────┘    └──────────────┘    └────────────────┘
      │
╔═════╧═══════════╗
║   PAIN POINT    ║
║   Must manually ║
║   track which   ║
║   items have    ║
║   unresolved    ║
║   review notes. ║
║   No aggregated ║
║   view.         ║
╚═════════════════╝
```

---

## Aspirational Journey

### Phase 1: Unified Review Queue → **Instant** (Principle 7: Search-First)

```
┌─────────────┐    ┌─────────────────────────────────────────────────────┐
│  Open        │───►│  REVIEW QUEUE                                       │
│  FloQast     │    │                                                     │
│              │    │  28 items awaiting your review                      │
│              │    │  AI: "3 items exceed materiality. 5 have carried-   │
│              │    │  forward review notes from last period."            │
│              │    │                                                     │
│              │    │  ┌─ 🔴 Exceptions (3) ────────────────────────────┐ │
│              │    │  │ Deferred Rev - Entity B ($45K over threshold)  │ │
│              │    │  │ Bank Rec - Entity A (agent confidence: 72%)    │ │
│              │    │  │ AP Accrual - Entity C (prior period carryover) │ │
│              │    │  └───────────────────────────────────────────────┘  │
│              │    │  ┌─ 🟡 Ready for Review (18) ────────────────────┐ │
│              │    │  │ Revenue Rec - Entity A ✓ within materiality   │ │
│              │    │  │ Payroll Accrual - Entity B ✓ agent-verified   │ │
│              │    │  │ ...16 more                                    │ │
│              │    │  └───────────────────────────────────────────────┘  │
│              │    │  ┌─ 💬 Awaiting Response (5) ────────────────────┐ │
│              │    │  │ Items where David wrote review notes; waiting │ │
│              │    │  │ for preparer responses.                       │ │
│              │    │  └───────────────────────────────────────────────┘  │
│              │    │  ┌─ ✅ Compliance (2) ───────────────────────────┐ │
│              │    │  │ SOX Control 4.2 - Entity A                   │ │
│              │    │  │ SOX Control 7.1 - Entity B                   │ │
│              │    │  └───────────────────────────────────────────────┘  │
└─────────────┘    └─────────────────────────────────────────────────────┘

✅ UNIFIED queue — checklists, recs, and compliance in one list
✅ AI-prioritized — exceptions and high-risk items surface first
✅ "Awaiting Response" section — tracks open review notes automatically
✅ Cross-entity — all entities in one view, filterable
```

### Phase 2: Review with Full Context → **One Page** (Principle 1: Master Object)

```
┌─────────────┐    ┌─────────────────────────────────────────────────────┐
│  Click item  │───►│  SUPER TASK DRILL-DOWN (Review Mode)                │
│  from queue  │    │                                                     │
│              │    │  Deferred Revenue Rec │ Entity B │ Feb 2026         │
│              │    │  Preparer: Sarah Chen │ Signed: Feb 26             │
│              │    │                                                     │
│              │    │  ┌── Balances ─────────────────────────────────────┐│
│              │    │  │ GL: $2,400,000 │ Reconciled: $2,355,000        ││
│              │    │  │ Variance: $45,000 │ ⚠️ EXCEEDS materiality     ││
│              │    │  │ Prior period variance: $12,000                  ││
│              │    │  └────────────────────────────────────────────────┘│
│              │    │  ┌── Linked Transactions (FloLake) ───────────────┐│
│              │    │  │ 47 deferred revenue transactions this period   ││
│              │    │  │ Top 3 by amount: [expandable]                  ││
│              │    │  │ New this period: 5 contracts ($38K total)       ││
│              │    │  └────────────────────────────────────────────────┘│
│              │    │  ┌── Agent Execution Log ─────────────────────────┐│
│              │    │  │ AI matched 42/47 transactions (89%)            ││
│              │    │  │ Confidence: 94% avg │ Lowest: 72% (flagged)    ││
│              │    │  │ Runtime: 4.2 sec │ Last run: 6:00 AM today     ││
│              │    │  └────────────────────────────────────────────────┘│
│              │    │  ┌── Documents ────────────────────────────────────┐│
│              │    │  │ Deferred_Rev_Schedule.xlsx │ Contract_List.pdf  ││
│              │    │  └────────────────────────────────────────────────┘│
│              │    │  ┌── Review History ───────────────────────────────┐│
│              │    │  │ Prior period: Approved by David, Feb 3         ││
│              │    │  │ 2 periods ago: 1 review note (resolved)        ││
│              │    │  └────────────────────────────────────────────────┘│
│              │    │                                                     │
│              │    │  [✅ Approve]  [❌ Reject with Note]  [⏭ Skip]     │
└─────────────┘    └─────────────────────────────────────────────────────┘

✅ Full context in one view — no navigation to separate pages
✅ Linked transactions from FloLake — not just summary balances
✅ Agent execution visible — David knows what AI did and its confidence
✅ Prior period comparison inline — trend is immediately visible
✅ Decision buttons right here — approve, reject, or skip without leaving
```

### Phase 3: Approve → **Auto-Advance** (Principle 6: Event-Driven)

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐
│  Click       │───►│  System:     │───►│  Auto-advance  │
│  "Approve"   │    │  • Signs off │    │  to NEXT item  │
│              │    │  • Notifies  │    │  in review     │
│              │    │    preparer  │    │  queue         │
│              │    │  • Updates   │    │                │
│              │    │    deps      │    │  (no back-     │
│              │    │  • Logs      │    │   navigation   │
│              │    │    audit     │    │   needed)      │
└─────────────┘    └──────────────┘    └────────────────┘

✅ One-click approval — no confirmation dialogs for routine items
✅ Auto-advance — queue position preserved, next item loads immediately
✅ Event cascade — downstream notifications and state changes fire automatically
✅ Audit trail — sign-off logged with timestamp, balance snapshot, and agent state
```

### Phase 4: Track Review Notes → **Built-In** (Principle 1: Master Object)

```
┌─────────────────────────────────────────────────────┐
│  REVIEW QUEUE — "Awaiting Response" Tab              │
│                                                      │
│  5 items with open review notes from David           │
│                                                      │
│  │ Item                 │ Note Sent │ Status        │ │
│  │ AP Accrual - Ent C   │ 2 days    │ 🔴 No reply  │ │
│  │ Inventory - Ent A    │ 1 day     │ 🟡 Reply rcvd│ │
│  │ Prepaid - Ent B      │ 4 hours   │ ⚪ Pending   │ │
│  │ ...                  │           │               │ │
│                                                      │
│  "AP Accrual - Ent C" has been unresponded for 2     │
│  days. Escalation recommended.                       │
└─────────────────────────────────────────────────────┘

✅ Centralized tracking — all open review notes in one view
✅ Age tracking — David sees how long each note has been pending
✅ AI escalation suggestion — flags stale notes automatically
```

---

## Improvement Summary

| Metric | Current State | Aspirational State | Improvement |
|--------|--------------|-------------------|-------------|
| Time to assemble review queue | 3-5 min | 0 (automatic) | 100% elimination |
| Pages visited per review | 3-4 | 1 | 67-75% reduction |
| Context reload time per item | 30-90 sec | 0 (auto-advance) | 100% elimination |
| Total review cycle (40 items) | 4-6 hours | 1.5-2.5 hours | 55-63% reduction |
| Open review note tracking | Manual/memory | Automatic dashboard | 100% elimination |

## Architecture Principles Demonstrated

| Principle | How It Manifests |
|-----------|-----------------|
| 1. Master Object | Drill-down shows balances, transactions, docs, notes, agent logs in one view |
| 3. Transactions as Atomic | FloLake transactions linked directly to rec tasks |
| 6. Event-Driven | Approval triggers cascading notifications and state changes |
| 7. Search-First | Unified queue replaces two separate filtered views |
| 8. Invisible AI | Agent confidence scores guide reviewer attention |
