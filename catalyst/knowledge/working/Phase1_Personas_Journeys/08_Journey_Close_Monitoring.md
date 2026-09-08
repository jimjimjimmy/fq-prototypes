# Journey Map: Close Monitoring

**Primary Persona:** Maria Gonzalez (Controller / Manager)
**Flow:** Manager monitors close progress → identifies bottlenecks → resolves blockers → reports status
**Frequency:** Daily during close window (days 1-7+)

---

## Current-State Journey

### Phase 1: Check Overall Status

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐
│  Open        │───►│  Overview     │───►│  See % tiles   │
│  FloQast     │    │  Dashboard   │    │  per workflow  │
│              │    │              │    │  (e.g., 62%)   │
└─────────────┘    └──────────────┘    └────────────────┘
                                              │
                                       ╔══════╧══════╗
                                       ║ PAIN POINT  ║
                                       ║ % complete  ║
                                       ║ tells Maria ║
                                       ║ HOW MUCH    ║
                                       ║ but not     ║
                                       ║ WHAT'S      ║
                                       ║ WRONG or    ║
                                       ║ WHO is      ║
                                       ║ blocked.    ║
                                       ╚═════════════╝
```

### Phase 2: Investigate Entity-by-Entity

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐    ┌──────────────┐
│  Select      │───►│  Load entity │───►│  Check % and   │───►│  Mental note │
│  Entity A    │    │  dashboard   │    │  late items    │    │  the status  │
└─────────────┘    └──────────────┘    └────────────────┘    └──────────────┘
       │                                                            │
       ▼                                                            ▼
┌─────────────┐    ┌──────────────┐    ┌────────────────┐    ┌──────────────┐
│  Select      │───►│  Load entity │───►│  Check % and   │───►│  Mental note │
│  Entity B    │    │  dashboard   │    │  late items    │    │  the status  │
└─────────────┘    └──────────────┘    └────────────────┘    └──────────────┘
       │
       ▼
    ... repeat for entities C, D, E, F ...

╔══════════════════════╗
║     PAIN POINT       ║
║  6 entities = 6      ║
║  navigation cycles.  ║
║  No cross-entity     ║
║  dashboard. Maria    ║
║  mentally aggregates ║
║  status.             ║
╚══════════════════════╝
```

**Time:** 10-20 minutes to assess all entities

### Phase 3: Identify Bottleneck Root Cause

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐    ┌──────────────┐
│  Entity C    │───►│  AP at 45%   │───►│  Click into    │───►│  See late    │
│  looks       │    │  — seems     │    │  AP folder     │    │  items, but  │
│  behind      │    │  behind      │    │              │    │  WHY?        │
└─────────────┘    └──────────────┘    └────────────────┘    └──────────────┘
                                                                    │
                                                             ╔══════╧══════╗
                                                             ║ PAIN POINT  ║
                                                             ║ Can see     ║
                                                             ║ WHAT's late ║
                                                             ║ but not WHY.║
                                                             ║ Is it a     ║
                                                             ║ person?     ║
                                                             ║ A data      ║
                                                             ║ dependency? ║
                                                             ║ A blocked   ║
                                                             ║ upstream    ║
                                                             ║ task?       ║
                                                             ║ Dependencies║
                                                             ║ are         ║
                                                             ║ invisible.  ║
                                                             ╚═════════════╝
```

### Phase 4: Take Action (Manual)

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐    ┌──────────────┐
│  Slack/call  │───►│  Ask: "Why   │───►│  Learn that    │───►│  Ask admin   │
│  the         │    │  is Treasury │    │  James is      │    │  to reassign │
│  preparer    │    │  bank rec    │    │  overloaded +  │    │  Treasury    │
│              │    │  not done?"  │    │  PTO Friday    │    │  bank rec    │
└─────────────┘    └──────────────┘    └────────────────┘    └──────────────┘
                                                                    │
                                                             ╔══════╧══════╗
                                                             ║ PAIN POINT  ║
                                                             ║ Cannot      ║
                                                             ║ reassign    ║
                                                             ║ directly.   ║
                                                             ║ Must go     ║
                                                             ║ through     ║
                                                             ║ admin.      ║
                                                             ║ Adds hours  ║
                                                             ║ of delay.   ║
                                                             ╚═════════════╝
```

### Phase 5: Report Status

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐
│  Open Excel  │───►│  Manually    │───►│  Email status  │
│  or Slack    │    │  compile     │    │  to VP         │
│              │    │  status from │    │  Finance       │
│              │    │  memory/     │    │                │
│              │    │  screenshots │    │                │
└─────────────┘    └──────────────┘    └────────────────┘
      │
╔═════╧═══════════╗
║   PAIN POINT    ║
║   No exportable ║
║   real-time     ║
║   status report.║
║   Maria builds  ║
║   it manually.  ║
╚═════════════════╝
```

---

## Aspirational Journey

### Phase 1: Instant Situational Awareness (Principle 7: Search-First)

```
┌─────────────┐    ┌─────────────────────────────────────────────────────┐
│  Open        │───►│  CLOSE TIMELINE (All Entities)                      │
│  FloQast     │    │                                                     │
│              │    │  February 2026 Close │ Day 4 of 7 │ 62% Complete   │
│              │    │  AI: "Tracking 0.5 days ahead of January.           │
│              │    │  AP - Entity C is the critical bottleneck.          │
│              │    │  3 tasks blocked by Treasury Bank Rec."             │
│              │    │                                                     │
│              │    │  ┌── Work Streams (Gantt) ────────────────────────┐│
│              │    │  │                   Day 1  2  3  4  5  6  7     ││
│              │    │  │ Cash & Banking    ████████████░░░░░            ││
│              │    │  │ Accounts Recv     █████████████████░░          ││
│              │    │  │ Accounts Payable  ██████████░░░░░░░░  ⚠️       ││
│              │    │  │ Revenue           ████████████████░░░          ││
│              │    │  │ Payroll           ███████████████████ ✅       ││
│              │    │  │ Fixed Assets      ██████████████░░░░░          ││
│              │    │  │ Intercompany      ░░░░░░░░░░░████░░░          ││
│              │    │  └────────────────────────────────────────────────┘│
│              │    │                                                     │
│              │    │  ┌── Entity Heatmap ──────────────────────────────┐│
│              │    │  │ Ent A: 71% ✅ │ Ent B: 68% ✅ │ Ent C: 45% ⚠️││
│              │    │  │ Ent D: 65% ✅ │ Ent E: 60% ✅ │ Ent F: 72% ✅││
│              │    │  └────────────────────────────────────────────────┘│
└─────────────┘    └─────────────────────────────────────────────────────┘

✅ ALL entities in one view — no entity-by-entity navigation
✅ Gantt timeline shows progress, not just percentages
✅ AI summary identifies the bottleneck instantly
✅ 5-second rule satisfied — Maria knows where to focus
```

**Time:** 5 seconds to assess (down from 10-20 minutes)

### Phase 2: Drill Into Bottleneck (Principle 6: Event-Driven Workflow)

```
┌─────────────┐    ┌─────────────────────────────────────────────────────┐
│  Click       │───►│  AP DEPENDENCY CHAIN — Entity C                     │
│  AP ⚠️       │    │                                                     │
│  Entity C    │    │  ┌─────────────┐    ┌─────────────┐    ┌─────────┐ │
│              │    │  │ Treasury    │───►│ AP Sub-     │───►│ AP      │ │
│              │    │  │ Bank Rec    │    │ Ledger Val  │    │ Accrual │ │
│              │    │  │ 🔴 BLOCKED  │    │ ⬜ Waiting  │    │ ⬜ Wait │ │
│              │    │  │ James (8    │    │             │    │         │ │
│              │    │  │ tasks due)  │    │             │    │         │ │
│              │    │  └─────────────┘    └─────────────┘    └─────────┘ │
│              │    │         │                                           │
│              │    │         ▼                                           │
│              │    │  Root Cause: James has 8 tasks due today.          │
│              │    │  Treasury Bank Rec is blocking 3 downstream tasks. │
│              │    │  James has PTO scheduled Friday.                    │
│              │    │                                                     │
│              │    │  ┌── AI Recommendation ───────────────────────────┐│
│              │    │  │ Reassign Treasury Bank Rec to Lisa (2 tasks    ││
│              │    │  │ remaining, Entity C access, reviewer-eligible) ││
│              │    │  │                     [Apply Recommendation ▶]   ││
│              │    │  └────────────────────────────────────────────────┘│
└─────────────┘    └─────────────────────────────────────────────────────┘

✅ Dependency chain visualized — not just "what's late" but "why"
✅ Root cause surfaced automatically — workload + PTO = bottleneck
✅ AI recommendation with one-click action — no admin intermediary
```

### Phase 3: Take Action Directly (Principle 2: No Folder Constraints)

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐
│  Click       │───►│  System:     │───►│  Dependency    │
│  "Apply      │    │  • Reassigns │    │  chain         │
│  Recommend-  │    │    to Lisa   │    │  unblocks.     │
│  ation"      │    │  • Notifies  │    │  AP tasks      │
│              │    │    both users│    │  become         │
│              │    │  • Updates   │    │  actionable.   │
│              │    │    timeline  │    │                │
│              │    │  • Logs      │    │  Updated ETA:  │
│              │    │    reason    │    │  AP on track   │
│              │    │              │    │  for day 6.    │
└─────────────┘    └──────────────┘    └────────────────┘

✅ Direct reassignment — no admin needed
✅ Permission-aware — system validates Lisa's access via ReBAC
✅ Audit trail — reassignment reason and authorizer logged
```

### Phase 4: Period-over-Period Comparison (Principle 8: Invisible AI)

```
┌─────────────┐    ┌─────────────────────────────────────────────────────┐
│  Toggle      │───►│  COMPARE MODE                                       │
│  "Compare    │    │                                                     │
│  vs Jan"     │    │  ┌── Work Streams ─────── Feb ────── Jan ─────────┐│
│              │    │  │ Cash & Banking         Day 4: 72%  Day 4: 68%  ││
│              │    │  │ Accounts Recv          Day 4: 85%  Day 4: 80%  ││
│              │    │  │ Accounts Payable       Day 4: 45%  Day 4: 62%  ││
│              │    │  │                         ▲ -17%     ⚠️           ││
│              │    │  │ Revenue                Day 4: 78%  Day 4: 75%  ││
│              │    │  │ Payroll                Day 4: 100% Day 4: 95%  ││
│              │    │  │ Fixed Assets           Day 4: 68%  Day 4: 70%  ││
│              │    │  └────────────────────────────────────────────────┘│
│              │    │                                                     │
│              │    │  AI Insight: "AP is 17% behind January pace.       │
│              │    │  January had no bank data feed delays. February's  │
│              │    │  new bank integration was 1 day late starting.     │
│              │    │  Once Treasury Bank Rec clears, AP should recover  │
│              │    │  to within 1 day of January's pace."              │
└─────────────┘    └─────────────────────────────────────────────────────┘

✅ Period-over-period in one view — unique FloQast advantage
✅ AI explains the delta — not just numbers, but root cause
✅ Predictive — "should recover" based on velocity modeling
```

### Phase 5: Report Status → Auto-Generated

```
┌─────────────┐    ┌──────────────────────────────────────────────────┐
│  Click       │───►│  CLOSE STATUS REPORT — Auto-Generated            │
│  "Share      │    │                                                  │
│  Status"     │    │  February 2026 Close — Day 4 Status             │
│              │    │  Overall: 62% complete (target: 60%) ✅          │
│              │    │                                                  │
│              │    │  Highlights:                                     │
│              │    │  • Payroll closed 1 day early                    │
│              │    │  • AR on track for day 5 completion             │
│              │    │                                                  │
│              │    │  Risk:                                           │
│              │    │  • AP - Entity C delayed by bank data feed       │
│              │    │  • Mitigated: task reassigned, ETA day 6         │
│              │    │                                                  │
│              │    │  AI Automation: 234 hours saved this period      │
│              │    │                                                  │
│              │    │  [Send to VP Finance] [Export PDF] [Copy Link]   │
└──────────────┘   └──────────────────────────────────────────────────┘

✅ Auto-generated from real-time data — no manual compilation
✅ Includes AI ROI metrics — hours saved prominently displayed
✅ Shareable via link, email, or PDF
```

---

## Improvement Summary

| Metric | Current State | Aspirational State | Improvement |
|--------|--------------|-------------------|-------------|
| Time to assess all entities | 10-20 min | 5 sec | 95%+ reduction |
| Bottleneck root-cause time | 15-30 min | Instant (AI) | 95%+ reduction |
| Task reassignment time | Hours (via admin) | 30 sec (direct) | 99% reduction |
| Status report creation | 20-30 min manual | Auto-generated | 100% elimination |
| Period comparison | Not available | Built-in | New capability |

## Architecture Principles Demonstrated

| Principle | How It Manifests |
|-----------|-----------------|
| 1. Master Object | Each timeline bar drills into full task context |
| 2. No Folders | Grouping by work stream, not folder hierarchy |
| 5. ReBAC | Reassignment validated against role-based permissions |
| 6. Event-Driven | Dependency chain visualization powered by event graph |
| 7. Search-First | Timeline + search replace entity-by-entity navigation |
| 8. Invisible AI | Bottleneck detection, root cause, recommendations, predictions |
