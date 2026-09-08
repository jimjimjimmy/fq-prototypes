# Journey Map: Monthly Close Execution

**Primary Persona:** Sarah Chen (Staff Accountant / Preparer)
**Flow:** Preparer receives assignments → executes tasks → attaches evidence → signs off
**Frequency:** Monthly (5-7 day close window)

---

## Current-State Journey

### Phase 1: Orient (Day 1, Morning)

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐    ┌──────────────┐
│  Log into    │───►│  Select      │───►│  Navigate to   │───►│  Scan grid   │
│  FloQast     │    │  entity +    │    │  Checklist or  │    │  for "my"    │
│              │    │  period      │    │  Folders view  │    │  items       │
└─────────────┘    └──────────────┘    └────────────────┘    └──────────────┘
                                                                    │
                                                             ╔══════╧══════╗
                                                             ║ PAIN POINT  ║
                                                             ║ Grid shows  ║
                                                             ║ ALL items,  ║
                                                             ║ all people. ║
                                                             ║ Must filter ║
                                                             ║ to find my  ║
                                                             ║ 15 tasks.   ║
                                                             ║ Fails the   ║
                                                             ║ 5-sec rule. ║
                                                             ╚═════════════╝
```

**Actions:** Log in → Select entity → Select period → Navigate to Checklist → Filter by "Assigned to me" → Sort by due date
**Touchpoints:** Login page, entity selector, period selector, Checklist grid page
**Emotion:** Mild frustration — "Where do I start?"
**Time:** 2-5 minutes to orient

### Phase 2: Execute Task (Repeated 10-20x per day)

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐    ┌──────────────┐
│  Click into  │───►│  Navigate to │───►│  Open Excel    │───►│  Do the work │
│  checklist   │    │  folder to   │    │  workbook from │    │  (calc, JE,  │
│  item row    │    │  find files  │    │  cloud storage │    │  rec, etc.)  │
└─────────────┘    └──────────────┘    └────────────────┘    └──────────────┘
      │                    │
      │             ╔══════╧══════╗
      │             ║ PAIN POINT  ║
      │             ║ Must know   ║
      │             ║ which folder║
      │             ║ has which   ║
      │             ║ accounts.   ║
      │             ║ Navigation  ║
      │             ║ by folder   ║
      │             ║ hierarchy.  ║
      │             ╚═════════════╝
      │
      ▼
┌─────────────┐    ┌──────────────┐    ┌────────────────┐
│  Upload      │───►│  Check rec   │───►│  Sign off as   │
│  evidence /  │    │  balance     │    │  preparer      │
│  attach docs │    │  matches TB  │    │                │
└─────────────┘    └──────────────┘    └────────────────┘
                          │
                   ╔══════╧══════╗
                   ║ PAIN POINT  ║
                   ║ Balance may ║
                   ║ not refresh ║
                   ║ from ERP.   ║
                   ║ Manual      ║
                   ║ refresh or  ║
                   ║ wait.       ║
                   ╚═════════════╝
```

**Actions:** Open item → Navigate to related rec/folder → Open workbook → Complete work in Excel → Upload evidence → Verify balance match → Sign off
**Touchpoints:** Checklist grid, Folder view, Rec detail page, Cloud storage, Excel, ERP
**Emotion:** Tedious — "So much clicking between pages to do one task"
**Time:** 15-60 minutes per task depending on complexity

### Phase 3: Handle AI Matching (For Bank Recs)

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐    ┌──────────────┐
│  Export CSV  │───►│  Upload to   │───►│  Configure AI  │───►│  Review      │
│  from bank   │    │  FloQast AI  │    │  matching      │    │  matches &   │
│  portal      │    │  matching    │    │  rules         │    │  exceptions  │
└─────────────┘    └──────────────┘    └────────────────┘    └──────────────┘
      │                    │
╔═════╧═════╗       ╔══════╧══════╗
║ PAIN POINT║       ║ PAIN POINT  ║
║ No direct ║       ║ Manual CSV  ║
║ bank      ║       ║ upload for  ║
║ connector ║       ║ each source ║
║ for many  ║       ║ = 30 min    ║
║ sources.  ║       ║ of prep.    ║
╚═══════════╝       ╚═════════════╝
```

### Phase 4: Respond to Review Notes

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐    ┌──────────────┐
│  Receive     │───►│  Navigate to │───►│  Find the      │───►│  Respond &   │
│  Slack/email │    │  the item    │    │  context to    │    │  re-sign     │
│  notification│    │  in FloQast  │    │  answer        │    │  if needed   │
└─────────────┘    └──────────────┘    └────────────────┘    └──────────────┘
                          │                    │
                   ╔══════╧══════╗      ╔══════╧══════╗
                   ║ PAIN POINT  ║      ║ PAIN POINT  ║
                   ║ Loses place ║      ║ Review note  ║
                   ║ in checklist║      ║ opens in     ║
                   ║ when        ║      ║ separate     ║
                   ║ navigating  ║      ║ context.     ║
                   ║ to item.    ║      ║ Must rebuild ║
                   ╚═════════════╝      ║ mental model.║
                                        ╚═════════════╝
```

---

## Aspirational Journey

### Phase 1: Orient → **Instant** (Principle 7: Search-First, Principle 1: Master Object)

```
┌─────────────┐    ┌─────────────────────────────────────────────────────┐
│  Open        │───►│  TASK INBOX                                         │
│  FloQast     │    │                                                     │
│              │    │  AI Summary: "12 tasks today. 2 moved to Redo       │
│              │    │  overnight. Bank Rec agent matched 142/150 txns."   │
│              │    │                                                     │
│              │    │  ┌─ 🔴 Late ─────────────────────────────────────┐  │
│              │    │  │ AP Accrual - Entity A (due yesterday)         │  │
│              │    │  │ Fixed Assets Depreciation (due yesterday)     │  │
│              │    │  └───────────────────────────────────────────────┘  │
│              │    │  ┌─ 🟡 Due Today ────────────────────────────────┐  │
│              │    │  │ Bank Rec - Operating (agent: 95% complete)    │  │
│              │    │  │ Revenue Recognition JE                        │  │
│              │    │  │ Payroll Accrual                               │  │
│              │    │  └───────────────────────────────────────────────┘  │
│              │    │  ┌─ ⚪ Upcoming ──────────────────────────────────┐  │
│              │    │  │ Intercompany Eliminations (day 4)             │  │
│              │    │  │ ...5 more                                     │  │
│              │    │  └───────────────────────────────────────────────┘  │
└─────────────┘    └─────────────────────────────────────────────────────┘

✅ No entity/period selection needed — inbox auto-scopes to user's assignments
✅ No filtering needed — inbox is opinionated, showing only Sarah's items
✅ 5-second rule satisfied — next action is immediately obvious
```

**Time:** 5 seconds to orient (down from 2-5 minutes)

### Phase 2: Execute Task → **In-Context** (Principle 1: Master Object, Principle 8: Invisible AI)

```
┌─────────────┐    ┌─────────────────────────────────────────────────────┐
│  Click task  │───►│  SUPER TASK DRILL-DOWN                              │
│  "Bank Rec   │    │                                                     │
│  Operating"  │    │  Account: 1010 - Operating  │ Entity A │ Feb 2026   │
│              │    │  ┌── Balances ─────────────────────────────────────┐ │
│              │    │  │ GL (per TB): $2,345,678  Reconciled: $2,345,122│ │
│              │    │  │ Variance: $556 (within materiality ✓)          │ │
│              │    │  └────────────────────────────────────────────────┘ │
│              │    │  ┌── Sub-Tasks ────────────────────────────────────┐ │
│              │    │  │ ✅ Import bank transactions (Agent: complete)   │ │
│              │    │  │ ✅ Match transactions (Agent: 142/150 matched)  │ │
│              │    │  │ 🟡 Review 8 exceptions (You — in progress)     │ │
│              │    │  │ ⬜ Preparer sign-off                            │ │
│              │    │  │ ⬜ Reviewer sign-off (David Park)               │ │
│              │    │  └────────────────────────────────────────────────┘ │
│              │    │  ┌── Exceptions ───────────────────────────────────┐ │
│              │    │  │ 8 unmatched transactions (expand to review)     │ │
│              │    │  └────────────────────────────────────────────────┘ │
│              │    │  ┌── Documents (3) ────────────────────────────────┐ │
│              │    │  │ Bank_Statement_Feb2026.pdf                      │ │
│              │    │  │ Operating_Rec_Workbook.xlsx                     │ │
│              │    │  └────────────────────────────────────────────────┘ │
│              │    │  ┌── Review Notes ─────────────────────────────────┐ │
│              │    │  │ (none yet)                                      │ │
│              │    │  └────────────────────────────────────────────────┘ │
│              │    │                           [Sign Off as Preparer ▶] │
└─────────────┘    └─────────────────────────────────────────────────────┘

✅ No page navigation — everything in one drill-down view
✅ Agent work visible — 142 matches done automatically overnight
✅ Only exceptions need human attention — Sarah reviews 8, not 150
✅ Sign-off available right here — no navigating back to checklist
```

**Time:** 10-20 minutes per task (down from 15-60 minutes)

### Phase 3: Handle AI Matching → **Automatic** (Principle 4: Universal Ingestion, Principle 8: Invisible AI)

```
                    ┌─────────────────────────────────────────────┐
                    │  AI agent ran overnight:                     │
                    │  • Connected to bank via API (no CSV needed) │
                    │  • Imported 150 transactions automatically   │
                    │  • Applied learned matching rules            │
                    │  • Matched 142/150 with 98% confidence       │
                    │  • Flagged 8 exceptions for human review     │
                    │  • Logged execution for audit trail          │
                    │                                              │
                    │  Sarah's only action: Review 8 exceptions    │
                    └─────────────────────────────────────────────┘

✅ No CSV export/upload — direct bank API integration
✅ No manual rule configuration — agent learned from prior periods
✅ Zero behavior change required — agent ran invisibly
```

### Phase 4: Review Notes → **Threaded In-Context** (Principle 1: Master Object)

```
┌─────────────┐    ┌─────────────────────────────────────────────────────┐
│  Notification│───►│  SUPER TASK DRILL-DOWN (same view)                  │
│  "David left │    │                                                     │
│  a note on   │    │  ┌── Review Notes ─────────────────────────────────┐│
│  Bank Rec"   │    │  │ David Park (2 min ago):                         ││
│              │    │  │ "The $556 variance — can you confirm this is    ││
│              │    │  │  the timing difference from the Feb 28 deposit?"││
│              │    │  │                                                  ││
│              │    │  │ [Reply...                                      ] ││
│              │    │  │                                                  ││
│              │    │  │ Sarah's reply appears here — full context        ││
│              │    │  │ (balances, transactions, docs) visible above.    ││
│              │    │  └─────────────────────────────────────────────────┘│
└─────────────┘    └─────────────────────────────────────────────────────┘

✅ Notification links directly to drill-down — no navigation hunt
✅ Review note is in-context — Sarah sees the balance + transactions while replying
✅ No place-in-list lost — she can return to inbox with one click
```

---

## Improvement Summary

| Metric | Current State | Aspirational State | Improvement |
|--------|--------------|-------------------|-------------|
| Time to orient | 2-5 min | 5 sec | 95%+ reduction |
| Pages visited per task | 3-5 | 1 | 60-80% reduction |
| Time per bank rec task | 45-60 min | 10-20 min | 55-67% reduction |
| CSV uploads per close | 5-10 | 0 | 100% elimination |
| Context switches per day | 40-80 | 10-15 | 75-80% reduction |

## Architecture Principles Demonstrated

| Principle | How It Manifests |
|-----------|-----------------|
| 1. Checklist Item as Master Object | Super Task drill-down aggregates all context |
| 2. Eliminate Folders | Inbox replaces folder navigation |
| 4. Universal Data Ingestion | Bank API replaces CSV uploads |
| 6. Event-Driven Workflow | Sign-off triggers automatic notifications and state changes |
| 7. Search-First Navigation | Inbox + global search replace grid filtering |
| 8. Invisible AI | Agent runs overnight, results visible in sub-task list |
