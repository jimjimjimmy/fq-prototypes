# Journey Map: Cross-Entity Oversight

**Primary Persona:** Robert Kim (VP Finance / Director)
**Flow:** Executive reviews close performance across all entities → identifies systemic issues → drives standardization → reports to CFO
**Frequency:** Weekly during close; monthly/quarterly for trending

---

## Current-State Journey

### Phase 1: Gather Status Across Entities

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐
│  Open        │───►│  Overview     │───►│  See aggregate │
│  FloQast     │    │  Dashboard   │    │  % for default │
│              │    │              │    │  entity        │
└─────────────┘    └──────────────┘    └────────────────┘
       │                                       │
       │                                ╔══════╧══════╗
       │                                ║ PAIN POINT  ║
       │                                ║ Dashboard   ║
       │                                ║ shows ONE   ║
       │                                ║ entity at   ║
       │                                ║ a time.     ║
       ▼                                ╚═════════════╝
┌─────────────┐    ┌──────────────┐
│  Switch to   │───►│  Note status │──── Repeat 14 more times
│  Entity 2    │    │  mentally    │
└─────────────┘    └──────────────┘
       │
╔══════╧══════════════╗
║      PAIN POINT     ║
║  15 entities =      ║
║  15 entity switches.║
║  20-40 minutes to   ║
║  compile a mental    ║
║  picture.            ║
╚═════════════════════╝
```

### Phase 2: Identify Systemic Issues

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐
│  Open        │───►│  View close  │───►│  See days-to-  │
│  Workflow    │    │  duration    │    │  close trend   │
│  Analytics   │    │  trends      │    │  for ONE entity│
└─────────────┘    └──────────────┘    └────────────────┘
                                              │
                                       ╔══════╧══════╗
                                       ║ PAIN POINT  ║
                                       ║ Analytics   ║
                                       ║ are per-    ║
                                       ║ entity, not ║
                                       ║ comparative.║
                                       ║ No side-by- ║
                                       ║ side entity ║
                                       ║ benchmarks. ║
                                       ╚═════════════╝

┌─────────────┐    ┌──────────────┐
│  Manually    │───►│  Try to spot │
│  toggle      │    │  patterns    │
│  entities    │    │  from memory │
│  in analytics│    │              │
└─────────────┘    └──────────────┘
       │
╔══════╧═══════════╗
║    PAIN POINT    ║
║  No cross-entity ║
║  pattern          ║
║  detection.       ║
║  Robert relies    ║
║  on intuition,    ║
║  not data.        ║
╚══════════════════╝
```

### Phase 3: Quantify ROI

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐
│  CFO asks:   │───►│  Check       │───►│  No aggregate  │
│  "What's     │    │  analytics   │    │  ROI dashboard │
│  FloQast     │    │  for hours-  │    │  exists.       │
│  saving us?" │    │  saved data  │    │                │
└─────────────┘    └──────────────┘    └────────────────┘
                                              │
                                       ╔══════╧══════╗
                                       ║ PAIN POINT  ║
                                       ║ No "hours   ║
                                       ║ saved" or   ║
                                       ║ "automation ║
                                       ║ ROI" metric ║
                                       ║ anywhere in ║
                                       ║ the product.║
                                       ║ Robert uses ║
                                       ║ anecdotes.  ║
                                       ╚═════════════╝
```

### Phase 4: Report to CFO

```
┌─────────────┐    ┌──────────────┐    ┌────────────────┐    ┌──────────────┐
│  Open Excel/ │───►│  Manually    │───►│  Add          │───►│  Email/      │
│  PowerPoint  │    │  compile     │    │  commentary   │    │  present to  │
│              │    │  data from   │    │  and charts   │    │  CFO         │
│              │    │  FloQast +   │    │              │    │              │
│              │    │  screenshots │    │              │    │              │
└─────────────┘    └──────────────┘    └────────────────┘    └──────────────┘
       │
╔══════╧═══════════╗
║    PAIN POINT    ║
║  30-60 minutes   ║
║  of manual       ║
║  report building ║
║  every month.    ║
╚══════════════════╝
```

---

## Aspirational Journey

### Phase 1: Organization-Wide Dashboard (Principle 7: Search-First)

```
┌─────────────┐    ┌─────────────────────────────────────────────────────┐
│  Open        │───►│  EXECUTIVE DASHBOARD                                │
│  FloQast     │    │                                                     │
│              │    │  February 2026 Close │ Day 5 of 7 │ 78% Complete   │
│              │    │                                                     │
│              │    │  ┌── Key Metrics ─────────────────────────────────┐ │
│              │    │  │ Days to Close (avg): 6.2  ↓ from 7.1 Q3       │ │
│              │    │  │ On-Time Rate: 91%         ↑ from 86% Q3       │ │
│              │    │  │ AI Hours Saved: 847 hrs   this quarter         │ │
│              │    │  │ Rework Rate: 3.2%         ↓ from 5.1% Q3      │ │
│              │    │  │ Audit Readiness: 98%      evidence complete    │ │
│              │    │  └───────────────────────────────────────────────┘  │
│              │    │                                                     │
│              │    │  ┌── Entity Heatmap ──────────────────────────────┐ │
│              │    │  │                                                │ │
│              │    │  │  Region: Americas                              │ │
│              │    │  │  ┌─────┐┌─────┐┌─────┐┌─────┐┌─────┐         │ │
│              │    │  │  │Ent A││Ent B││Ent C││Ent D││Ent E│         │ │
│              │    │  │  │ 88% ││ 82% ││ 65% ││ 79% ││ 85% │         │ │
│              │    │  │  │ ✅  ││ ✅  ││ ⚠️  ││ ✅  ││ ✅  │         │ │
│              │    │  │  └─────┘└─────┘└─────┘└─────┘└─────┘         │ │
│              │    │  │                                                │ │
│              │    │  │  Region: EMEA                                  │ │
│              │    │  │  ┌─────┐┌─────┐┌─────┐┌─────┐┌─────┐         │ │
│              │    │  │  │Ent F││Ent G││Ent H││Ent I││Ent J│         │ │
│              │    │  │  │ 90% ││ 52% ││ 75% ││ 80% ││ 77% │         │ │
│              │    │  │  │ ✅  ││ 🔴  ││ ✅  ││ ✅  ││ ✅  │         │ │
│              │    │  │  └─────┘└─────┘└─────┘└─────┘└─────┘         │ │
│              │    │  │  ...5 more entities                            │ │
│              │    │  └───────────────────────────────────────────────┘  │
│              │    │                                                     │
│              │    │  AI: "Entity G (EMEA) is 26% behind peer avg.     │
│              │    │  Root cause: New ERP migration caused 2-day data   │
│              │    │  delay. Entity C (Americas) AP bottleneck resolved │
│              │    │  yesterday — now trending to close on time."       │
└─────────────┘    └─────────────────────────────────────────────────────┘

✅ ALL 15 entities in one view — heatmap visualization
✅ Key metrics prominently displayed — ROI, efficiency, quality
✅ AI-generated narrative — root cause analysis across entities
✅ 5-second situational awareness — glance tells the whole story
```

### Phase 2: Cross-Entity Benchmarking (Principle 3: Transactions as Atomic)

```
┌─────────────┐    ┌─────────────────────────────────────────────────────┐
│  Click       │───►│  ENTITY BENCHMARKING                                │
│  "Compare    │    │                                                     │
│  Entities"   │    │  ┌── Close Duration (Last 6 Periods) ────────────┐ │
│              │    │  │ Entity  │ Sep │ Oct │ Nov │ Dec │ Jan │ Feb   │ │
│              │    │  │ Ent A   │ 6.5 │ 6.0 │ 5.5 │ 7.0*│ 5.5 │ 5.0 │ │
│              │    │  │ Ent B   │ 7.0 │ 6.5 │ 6.0 │ 8.0*│ 6.0 │ 5.5 │ │
│              │    │  │ Ent G   │ 8.0 │ 7.5 │ 7.0 │ 9.5*│ 8.0 │ est8│ │
│              │    │  │ Org Avg │ 6.8 │ 6.3 │ 5.8 │ 7.8 │ 6.2 │ 5.8 │ │
│              │    │  │ * = Q4 close (longer due to year-end)          │ │
│              │    │  └───────────────────────────────────────────────┘  │
│              │    │                                                     │
│              │    │  ┌── Process Efficiency ──────────────────────────┐ │
│              │    │  │ Best Practice: Ent A (AP closes in 2.5 days)  │ │
│              │    │  │ Laggard: Ent G (AP closes in 5.0 days)        │ │
│              │    │  │                                                │ │
│              │    │  │ AI: "Entity A uses AI matching for all bank   │ │
│              │    │  │ accounts. Entity G still uses manual Excel    │ │
│              │    │  │ recs for 60% of accounts. Deploying Entity A's│ │
│              │    │  │ agent configuration to Entity G could reduce  │ │
│              │    │  │ AP close time by an estimated 2 days."         │ │
│              │    │  └───────────────────────────────────────────────┘  │
└─────────────┘    └─────────────────────────────────────────────────────┘

✅ Side-by-side entity comparison — normalized for complexity
✅ Process-level analysis — which specific work streams lag
✅ Best-practice identification — AI spots what works and recommends replication
✅ Actionable insights — not just data, but recommended actions
```

### Phase 3: ROI Dashboard (Principle 8: Invisible AI)

```
┌─────────────┐    ┌─────────────────────────────────────────────────────┐
│  Click       │───►│  PLATFORM ROI DASHBOARD                             │
│  "ROI"       │    │                                                     │
│              │    │  ┌── Automation Impact (Q4 FY26) ────────────────┐ │
│              │    │  │                                                │ │
│              │    │  │  Hours Saved by AI Agents:         847 hrs    │ │
│              │    │  │  Cost Equivalent (@ $75/hr):       $63,525    │ │
│              │    │  │  Transactions Auto-Matched:        12,450     │ │
│              │    │  │  Manual Match Rate Reduction:      89%        │ │
│              │    │  │  Agent Success Rate:               97.2%      │ │
│              │    │  │                                                │ │
│              │    │  │  ┌── Trend ──────────────────────────────┐    │ │
│              │    │  │  │  Q1: 210 hrs │ Q2: 480 hrs │ Q3: 650 │    │ │
│              │    │  │  │  Q4: 847 hrs (↑ 30% QoQ)             │    │ │
│              │    │  │  └──────────────────────────────────────┘    │ │
│              │    │  └───────────────────────────────────────────────┘  │
│              │    │                                                     │
│              │    │  ┌── Close Efficiency Gains ──────────────────────┐ │
│              │    │  │  Avg Days to Close: 6.2 (down from 8.1 YoY)  │ │
│              │    │  │  = 1.9 days saved per close × 12 closes/yr   │ │
│              │    │  │  = 22.8 team-days saved annually              │ │
│              │    │  │                                                │ │
│              │    │  │  On-Time Rate: 91% (up from 74% YoY)         │ │
│              │    │  │  Rework Rate: 3.2% (down from 8.5% YoY)      │ │
│              │    │  └───────────────────────────────────────────────┘  │
│              │    │                                                     │
│              │    │  [Export to PDF]  [Schedule Monthly Email]          │
└─────────────┘    └─────────────────────────────────────────────────────┘

✅ Hard ROI numbers — hours saved, cost equivalent, trend
✅ CFO-ready format — exportable, schedulable
✅ Year-over-year trending — demonstrates compounding platform value
✅ Agent-specific metrics — granular automation ROI
```

### Phase 4: Auto-Generated Executive Report

```
┌─────────────┐    ┌──────────────────────────────────────────────────┐
│  "Generate   │───►│  MONTHLY CLOSE EXECUTIVE SUMMARY                 │
│  CFO         │    │  February 2026                                   │
│  Report"     │    │                                                  │
│              │    │  HEADLINE: Close completed in 6.0 days (target  │
│              │    │  7), 0.2 days faster than January.               │
│              │    │                                                  │
│              │    │  WINS:                                           │
│              │    │  • Payroll closed in 3 days (best ever)          │
│              │    │  • AI matching processed 12,450 transactions     │
│              │    │  • Zero audit findings for 4th consecutive close │
│              │    │                                                  │
│              │    │  RISKS:                                          │
│              │    │  • Entity G ERP migration causing ongoing delays │
│              │    │  • Recommendation: dedicated support for Q1      │
│              │    │                                                  │
│              │    │  INVESTMENT ROI:                                  │
│              │    │  • $63,525 in equivalent labor savings (Q4)      │
│              │    │  • 22.8 team-days saved annually                 │
│              │    │                                                  │
│              │    │  [Send to CFO]  [Edit]  [Export PDF/PPT]         │
└──────────────┘   └──────────────────────────────────────────────────┘

✅ AI-generated narrative from real data — not manually compiled
✅ Includes ROI quantification — justifies investment
✅ Editable before sending — Robert can add context
✅ Multiple export formats — email, PDF, PowerPoint
```

---

## Improvement Summary

| Metric | Current State | Aspirational State | Improvement |
|--------|--------------|-------------------|-------------|
| Cross-entity status check | 20-40 min | 5 sec (heatmap) | 95%+ reduction |
| Entity benchmarking | Not available | Built-in | New capability |
| ROI quantification | Anecdotal | Auto-calculated | New capability |
| Executive report generation | 30-60 min manual | Auto-generated | 95% reduction |
| Pattern detection | Intuition-based | AI-powered | New capability |

## Architecture Principles Demonstrated

| Principle | How It Manifests |
|-----------|-----------------|
| 3. Transactions as Atomic | Consistent data foundation enables cross-entity comparison |
| 4. Universal Ingestion | Standardized ERP connections enable benchmarking |
| 7. Search-First | Dashboard + search replaces entity-by-entity navigation |
| 8. Invisible AI | Benchmarking, ROI calculation, report generation, pattern detection |
