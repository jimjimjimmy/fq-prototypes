# Use Case Catalog: Architecture Validation

**Purpose:** 40 use cases across all 5 personas to stress-test the proposed architecture. Each use case includes a step-by-step trace through the target system.

---

## Scoring Legend

- **Complexity:** L (Low) / M (Medium) / H (High)
- **Architecture Coverage:** Which services are exercised
- **Status:** Supported / Partially Supported / Gap Identified

---

## Preparer Use Cases (UC-P01 through UC-P10)

### UC-P01: Morning Inbox Review (The 5-Second Test)

**Persona:** Sarah (Preparer) | **Complexity:** L | **Frequency:** Daily

**Scenario:** Sarah opens FloQast at 8:30 AM and needs to immediately know what requires her attention today.

**Architecture Trace:**
1. Sarah authenticates → **GAuth** issues token
2. UI requests `GET /v2/tasks?assignee=sarah&status=not_started,in_progress,redo&due_before=today` → **Task Service**
3. Task Service calls **Permission Service** to filter tasks Sarah can access
4. Task Service returns prioritized list (late → due today → upcoming)
5. UI calls **AI Orchestration** for daily summary ("2 items moved to Redo overnight...")
6. Results rendered as inbox → Sarah sees 12 tasks in 5 seconds

**Services:** Task Service, Permission Service, AI Orchestration, GAuth
**Status:** ✅ Supported

---

### UC-P02: Bank Reconciliation with Agent-Completed Sub-Tasks

**Persona:** Sarah (Preparer) | **Complexity:** H | **Frequency:** Monthly

**Scenario:** Sarah opens her bank rec task. An AI agent matched 142/150 transactions overnight. She needs to review 8 exceptions and sign off.

**Architecture Trace:**
1. Sarah clicks task → `GET /v2/tasks/:id` → **Task Service** returns Super Task with sub-tasks, transactions, agent history
2. Sub-task "Match transactions" shows status: `agent_complete` (142/150)
3. TransactionLinks displayed inline → **FloLake** data via Transaction-Task Bridge
4. Sarah resolves 6 exceptions (updates TransactionLink.matchStatus) → **Task Service**
5. Sarah marks 2 as "pending bank confirmation" → custom exception status
6. Sarah clicks "Sign Off" → **Workflow Engine** receives `preparer_signed` event
7. Workflow Engine: creates Signature with balance snapshot, updates status to `pending_review`, notifies reviewer David, updates **Search Service** index, logs to **Analytics**

**Services:** Task Service, AI Orchestration, FloLake, Workflow Engine, Search, Analytics
**Status:** ✅ Supported

---

### UC-P03: Self-Service PTO Delegation

**Persona:** Sarah (Preparer) | **Complexity:** M | **Frequency:** Monthly

**Scenario:** Sarah is taking PTO next week. She wants to delegate her 8 pending tasks to Lisa.

**Architecture Trace:**
1. Sarah opens delegation UI → `GET /v2/tasks?assignee=sarah&period=current&status=not_started,in_progress` → **Task Service**
2. Sarah selects "Delegate to Lisa" for dates Mar 3-7 → `POST /v2/delegations`
3. **Permission Service** validates: Does Lisa have access to all 8 tasks' entities and process groups?
4. If yes: Delegation entities created; tasks show "Delegated to Lisa (PTO: Mar 3-7)"
5. **Workflow Engine** schedules `delegation_ended` event for Mar 8 → auto-revert
6. Lisa and Maria (manager) notified → **Notification Service**
7. On Mar 8: Workflow Engine fires `delegation_ended` → tasks revert to Sarah

**Services:** Task Service, Permission Service, Workflow Engine, Notification
**Status:** ✅ Supported

---

### UC-P04: Search for Task by Account or Keyword

**Persona:** Sarah (Preparer) | **Complexity:** L | **Frequency:** Daily

**Scenario:** Sarah needs to find the "operating account rec" but doesn't remember which process group it's in.

**Architecture Trace:**
1. Sarah types "operating account rec" in global search bar
2. `GET /v2/search?q=operating+account+rec&type=task` → **Search Service**
3. Search Service: full-text search across task titles, account names, descriptions
4. Persona-aware ranking: Sarah's assigned tasks ranked first
5. Results: "Bank Rec - Operating Account (1010) | Entity A | Feb 2026 | Due: Mar 1"
6. Sarah clicks → navigates to Super Task drill-down

**Services:** Search Service, Permission Service (filters results to accessible tasks)
**Status:** ✅ Supported

---

### UC-P05: Respond to Review Note with Full Context

**Persona:** Sarah (Preparer) | **Complexity:** M | **Frequency:** Weekly during close

**Scenario:** David left a review note asking about a $556 variance. Sarah needs to respond with context.

**Architecture Trace:**
1. Sarah receives notification (push/email/Slack) with deep link to task
2. Deep link opens Super Task drill-down → balances, transactions, review notes visible
3. Sarah sees David's note in the Review Notes section, alongside the balance data
4. Sarah types reply → `POST /v2/tasks/:id/review-notes` (parentNoteId = David's note)
5. **Workflow Engine** notifies David; if Sarah's response resolves the issue, David can mark resolved

**Services:** Task Service, Notification, Workflow Engine
**Status:** ✅ Supported

---

### UC-P06: Complete a Journal Entry Task with ERP Post-Back

**Persona:** Sarah (Preparer) | **Complexity:** H | **Frequency:** Monthly

**Scenario:** Sarah completes a revenue accrual JE. She wants it posted to the ERP.

**Architecture Trace:**
1. Sarah opens JE task → fills in JE lines using native calculation interface (future Phase 5+)
2. Sub-task "Generate JE" completes → `POST /v2/tasks/:id/journal-entries`
3. Sub-task "Post to ERP" → **Integration Service** sends JE to ERP via API
4. ERP confirms posting → Integration Service updates sub-task status
5. FloLake syncs updated GL data → TransactionLink updated → balance reflects posted JE

**Services:** Task Service, Integration Service (FloLake), Workflow Engine
**Status:** ⚠️ Partially Supported — ERP post-back requires per-ERP API integration; not all ERPs support write-back. The "copy-paste gap" is partially closed but not eliminated for all ERPs.

**Gap:** ERP write-back API coverage. Workaround: JE export with ERP-specific format template.

---

### UC-P07: Upload Evidence and Attach to Task

**Persona:** Sarah (Preparer) | **Complexity:** L | **Frequency:** Daily during close

**Architecture Trace:**
1. Sarah drags file into Super Task drill-down → `POST /v2/tasks/:id/documents`
2. **Document Service** stores file (FloQast S3 or links external cloud storage file)
3. Document entity created with metadata; locked after sign-off
4. Search Service indexes document for future discoverability

**Services:** Task Service, Document Service, Search Service
**Status:** ✅ Supported

---

### UC-P08: View Dependencies Blocking My Task

**Persona:** Sarah (Preparer) | **Complexity:** M | **Frequency:** Weekly during close

**Architecture Trace:**
1. Sarah sees a task with status `blocked` in her inbox
2. Clicks into it → dependency chain visualization shows: "Waiting on Treasury Bank Rec (James)"
3. Dependency data from `GET /v2/tasks/:id/dependencies` → **Task Service**
4. Sarah can see James's task status and estimated completion
5. Optional: Sarah sends a nudge notification to James

**Services:** Task Service, Workflow Engine (dependency graph)
**Status:** ✅ Supported

---

### UC-P09: Multi-Entity Task Completion

**Persona:** Sarah (Preparer) | **Complexity:** M | **Frequency:** Monthly

**Scenario:** Sarah prepares the same task (AP accrual) for 3 entities.

**Architecture Trace:**
1. Sarah's inbox shows all 3 AP accrual tasks (one per entity) grouped
2. She completes Entity A → sign off → auto-advances to Entity B task
3. Each sign-off triggers independent Workflow Engine events per entity
4. Cross-entity progress visible in her inbox summary

**Services:** Task Service, Workflow Engine
**Status:** ✅ Supported

---

### UC-P10: Agent-Assisted Data Formatting

**Persona:** Sarah (Preparer) | **Complexity:** M | **Frequency:** Monthly

**Scenario:** Sarah has credit card data that needs formatting before matching. A Transform agent handles this.

**Architecture Trace:**
1. Data arrives via Integration Service (Ramp API or CSV upload)
2. **AI Orchestration** triggers Transform agent on `data_arrived` event
3. Agent formats data (column mapping, date parsing, deduplication)
4. Formatted data written as TransactionLinks to the credit card rec task
5. Matching agent triggers next, matching formatted transactions

**Services:** Integration Service, AI Orchestration, Task Service, Workflow Engine
**Status:** ✅ Supported

---

## Reviewer Use Cases (UC-R01 through UC-R08)

### UC-R01: Unified Review Queue

**Persona:** David (Reviewer) | **Complexity:** M | **Frequency:** Daily during close

**Architecture Trace:**
1. `GET /v2/tasks?reviewer=david&status=pending_review` → **Task Service**
2. Results include ALL task types (checklist, rec, compliance) in one list
3. Sorted by: exceptions first, then due date
4. AI summary: "3 items exceed materiality. 5 have prior-period carryforward notes."

**Services:** Task Service, Permission Service, AI Orchestration
**Status:** ✅ Supported

---

### UC-R02: Full-Context Review with Transaction Drill-Down

**Persona:** David (Reviewer) | **Complexity:** H | **Frequency:** Daily during close

**Architecture Trace:**
1. David clicks deferred revenue rec → Super Task drill-down loads with all context
2. Balances, transactions (47 items from FloLake), agent execution log, documents, review history — all in one view
3. David can drill into any individual transaction → see FloLake source data, match confidence, FDM dimensions
4. Approves with one click → **Workflow Engine** processes `reviewer_signed` event

**Services:** Task Service, FloLake (TransactionLink), AI Orchestration, Workflow Engine
**Status:** ✅ Supported

---

### UC-R03: Reject with Review Note

**Persona:** David (Reviewer) | **Complexity:** M | **Frequency:** Weekly during close

**Architecture Trace:**
1. David writes review note (type: `rejection`, severity: `warning`)
2. `POST /v2/tasks/:id/review-notes` → Task Service
3. **Workflow Engine** receives `review_note_created` event → transitions task to `changes_requested`
4. Preparer notified; task reappears in their inbox as "Changes Requested"
5. David's "Awaiting Response" section auto-populates with this item

**Services:** Task Service, Workflow Engine, Notification
**Status:** ✅ Supported

---

### UC-R04: Track Open Review Notes

**Persona:** David (Reviewer) | **Complexity:** L | **Frequency:** Daily during close

**Architecture Trace:**
1. `GET /v2/review-notes?author=david&isResolved=false` → **Task Service**
2. Returns all unresolved notes David has written, with age tracking
3. AI flags: "AP Accrual - Entity C unresponded for 2 days"

**Services:** Task Service, AI Orchestration
**Status:** ✅ Supported

---

### UC-R05: Cross-Entity Reconciliation Review

**Persona:** David (Reviewer) | **Complexity:** H | **Frequency:** Monthly

**Scenario:** David reviews intercompany recs that span 3 entities.

**Architecture Trace:**
1. David filters review queue: `processGroup=Intercompany`
2. Each IC task shows linked counterparty tasks across entities
3. Dependency visualization shows the IC elimination chain
4. David can see both sides of the intercompany balance in one view

**Services:** Task Service, Permission Service (multi-entity access), Workflow Engine
**Status:** ✅ Supported

---

### UC-R06: Auto-Advance Through Review Queue

**Persona:** David (Reviewer) | **Complexity:** L | **Frequency:** Daily during close

**Architecture Trace:**
1. David approves task → system auto-loads next task in queue
2. Queue position preserved; no back-navigation needed
3. Counter updates: "Reviewed 15/28 items today"

**Services:** Task Service (queue management)
**Status:** ✅ Supported

---

### UC-R07: Review Agent Work Quality

**Persona:** David (Reviewer) | **Complexity:** M | **Frequency:** Monthly

**Scenario:** David needs to verify that an AI agent's matching results are trustworthy.

**Architecture Trace:**
1. Agent execution log visible in Super Task drill-down
2. Shows: items processed, confidence distribution, rules applied, execution time
3. David can filter to low-confidence matches for targeted review
4. David can flag incorrect matches → agent learns (future reinforcement)

**Services:** Task Service, AI Orchestration (execution log)
**Status:** ✅ Supported

---

### UC-R08: Period-Over-Period Comparison During Review

**Persona:** David (Reviewer) | **Complexity:** M | **Frequency:** Monthly

**Architecture Trace:**
1. In Super Task drill-down, David toggles "Compare to Jan"
2. Prior period balance, variance, and review history displayed alongside current
3. AI insight: "Variance increased from $12K to $45K. Primary driver: 3 new contracts"

**Services:** Task Service, Analytics Service (historical data), AI Orchestration
**Status:** ✅ Supported

---

## Manager Use Cases (UC-M01 through UC-M10)

### UC-M01: Timeline Bottleneck Identification

**Persona:** Maria (Controller) | **Complexity:** H | **Frequency:** Daily during close

**Architecture Trace:**
1. Maria opens Close Timeline → `GET /v2/analytics/timeline?period=current` → **Analytics Service**
2. Gantt visualization renders from event history (task start/complete timestamps)
3. AI identifies: "AP - Entity C is critical bottleneck. 3 tasks blocked by Treasury Bank Rec"
4. Maria clicks bottleneck → dependency chain visualization

**Services:** Analytics Service, Task Service, AI Orchestration, Workflow Engine
**Status:** ✅ Supported

---

### UC-M02: Period-Over-Period Close Comparison

**Persona:** Maria (Controller) | **Complexity:** M | **Frequency:** Monthly

**Architecture Trace:**
1. Maria toggles "Compare vs January" on timeline view
2. **Analytics Service** returns parallel timeline data for both periods
3. AI explains: "AP 17% behind January pace. Root cause: bank data feed delay"

**Services:** Analytics Service, AI Orchestration
**Status:** ✅ Supported

---

### UC-M03: Task Reassignment (Workload Rebalancing)

**Persona:** Maria (Controller) | **Complexity:** M | **Frequency:** Weekly during close

**Architecture Trace:**
1. Maria identifies overloaded team member in timeline view
2. AI recommends: "Reassign Treasury Bank Rec from James to Lisa"
3. Maria clicks "Apply" → `PUT /v2/tasks/:id/reassign` → **Task Service**
4. **Permission Service** validates Lisa's access
5. **Workflow Engine** notifies both users, updates dependency chain

**Services:** Task Service, Permission Service, Workflow Engine, AI Orchestration
**Status:** ✅ Supported

---

### UC-M04: Auto-Generated Status Report

**Persona:** Maria (Controller) | **Complexity:** M | **Frequency:** Daily during close

**Architecture Trace:**
1. Maria clicks "Share Status" → **AI Orchestration** generates narrative from Analytics data
2. Report includes: completion %, highlights, risks, AI hours saved
3. Maria can edit → send via email or share as link

**Services:** AI Orchestration, Analytics Service
**Status:** ✅ Supported

---

### UC-M05: Investigate Dependency Chain

**Persona:** Maria (Controller) | **Complexity:** H | **Frequency:** Weekly during close

**Architecture Trace:**
1. Maria clicks a blocked task → dependency graph visualizes full chain
2. Shows: Task A (blocked) ← Task B (in_progress) ← Task C (completed)
3. Critical path highlighted; estimated completion based on velocity

**Services:** Task Service (dependency data), Workflow Engine (graph computation), Analytics (velocity)
**Status:** ✅ Supported

---

### UC-M06: Drill from Timeline to Individual Task

**Persona:** Maria (Controller) | **Complexity:** L | **Frequency:** Daily during close

**Architecture Trace:**
1. Maria clicks a work stream bar in the Gantt → expands to individual tasks
2. Clicks a specific task → Super Task drill-down opens
3. Full context visible (same view as preparer/reviewer)
4. Maria can reassign, add review note, or view audit trail

**Services:** Analytics Service, Task Service
**Status:** ✅ Supported

---

### UC-M07: Monitor Agent Performance

**Persona:** Maria (Controller) | **Complexity:** M | **Frequency:** Monthly

**Architecture Trace:**
1. Maria opens agent dashboard → `GET /v2/analytics/agents` → **Analytics Service**
2. Shows: agents by task type, success rate, hours saved, error rate
3. Drill-down per agent: execution history, ROI trend, failure analysis

**Services:** Analytics Service, AI Orchestration
**Status:** ✅ Supported

---

### UC-M08: Close Forecasting

**Persona:** Maria (Controller) | **Complexity:** H | **Frequency:** Daily during close

**Architecture Trace:**
1. **Analytics Service** computes forecasted close date from current velocity + remaining tasks
2. AI: "Based on current pace, close will finish in 6.5 days (target: 7). 85% confidence."
3. Shows risk factors: "If AP bottleneck not resolved, forecast extends to 8 days"

**Services:** Analytics Service, AI Orchestration
**Status:** ✅ Supported

---

### UC-M09: Team Workload Dashboard

**Persona:** Maria (Controller) | **Complexity:** M | **Frequency:** Weekly during close

**Architecture Trace:**
1. `GET /v2/analytics/workload?period=current` → team workload by person
2. Shows: tasks assigned vs. completed, estimated hours remaining, utilization %
3. Identifies: "James at 120% utilization; Lisa at 40%"

**Services:** Analytics Service, Task Service
**Status:** ✅ Supported

---

### UC-M10: Lock Period After Close

**Persona:** Maria (Controller) | **Complexity:** L | **Frequency:** Monthly

**Architecture Trace:**
1. Maria confirms all tasks complete → `PUT /v2/periods/:id/lock` → **Task Service**
2. **Workflow Engine** receives `period_locked` event → all tasks set to read-only
3. Documents locked → **Document Service**
4. Analytics snapshot saved for historical comparison

**Services:** Task Service, Workflow Engine, Document Service, Analytics Service
**Status:** ✅ Supported

---

## Admin Use Cases (UC-A01 through UC-A08)

### UC-A01: Batch Entity Creation (Acquisition)

**Persona:** James (Admin) | **Complexity:** H | **Frequency:** Quarterly

**Architecture Trace:**
1. James selects "Create from Template" → provides entity details for 3 new entities
2. **Task Service** creates entities with: process groups, default templates, agent configs
3. **Permission Service** auto-assigns roles from template (no per-folder grants)
4. **Integration Service** validates ERP connections during setup
5. All 3 entities created in single operation → confirmation with validation summary

**Services:** Task Service, Permission Service, Integration Service
**Status:** ✅ Supported

---

### UC-A02: Global Template Push

**Persona:** James (Admin) | **Complexity:** H | **Frequency:** Monthly

**Architecture Trace:**
1. James modifies AP template → adds "PO Matching" sub-task with AI agent
2. Clicks "Push to All Entities" → `POST /v2/templates/:id/push`
3. **Task Service** previews impact: 15 entities, 15 periods, 3 local overrides preserved
4. James confirms → **Workflow Engine** propagates changes as events per entity
5. New sub-tasks and agent assignments created; existing work preserved

**Services:** Task Service, Workflow Engine, AI Orchestration
**Status:** ✅ Supported

---

### UC-A03: Role-Based Permission Configuration

**Persona:** James (Admin) | **Complexity:** M | **Frequency:** Monthly

**Architecture Trace:**
1. James creates role "EMEA AP Reviewer" → `POST /v2/roles`
2. Adds permissions: review:process_group:AP, view:process_group:AP
3. Assigns role to David with entity scope: [Entity F, G, H]
4. **Permission Service** validates no SoD conflicts
5. David immediately sees EMEA AP tasks in his review queue

**Services:** Permission Service, Task Service
**Status:** ✅ Supported

---

### UC-A04: AI Agent Assignment to Task Type

**Persona:** James (Admin) | **Complexity:** M | **Frequency:** Quarterly

**Architecture Trace:**
1. James opens Agent Registry → `GET /v2/agents` → **AI Orchestration**
2. Selects "Bank Transaction Matcher" agent → assigns to bank rec template
3. Configures: trigger on data_arrived, schedule daily at 6 AM
4. **AI Orchestration** registers assignment; **Workflow Engine** creates trigger rule
5. Agent auto-executes when bank data arrives for any entity using this template

**Services:** AI Orchestration, Workflow Engine, Task Service
**Status:** ✅ Supported

---

### UC-A05: Integration Health Monitoring

**Persona:** James (Admin) | **Complexity:** L | **Frequency:** Weekly

**Architecture Trace:**
1. James opens integration dashboard → `GET /v2/integrations/status` → **Integration Service**
2. Shows: all ERP connections, last sync time, error count, status
3. Alerts for: failed syncs, stale data, credential expiration

**Services:** Integration Service
**Status:** ✅ Supported

---

### UC-A06: Audit Log Review

**Persona:** James (Admin) | **Complexity:** L | **Frequency:** Quarterly

**Architecture Trace:**
1. `GET /v2/audit-log?entity=all&date_range=Q4` → **Analytics Service**
2. Complete log of: admin changes, permission modifications, template pushes, agent runs
3. Exportable for compliance review

**Services:** Analytics Service
**Status:** ✅ Supported

---

### UC-A07: Feature Flag Management

**Persona:** James (Admin) | **Complexity:** L | **Frequency:** As needed

**Architecture Trace:**
1. Admin dashboard shows active feature flags per entity
2. James can opt entities into beta features
3. Rollback: disable flag → immediate revert

**Services:** Task Service (flag management via Harness)
**Status:** ✅ Supported

---

### UC-A08: Entity Decommission

**Persona:** James (Admin) | **Complexity:** M | **Frequency:** Rare

**Scenario:** Entity being dissolved after divestiture. Need to archive all data.

**Architecture Trace:**
1. James marks entity as "decommissioning" → `PUT /v2/entities/:id/decommission`
2. All open tasks set to "skipped" with reason
3. Historical data archived (immutable for audit retention)
4. Users removed from entity; roles updated
5. Entity removed from active views but accessible in archive

**Services:** Task Service, Permission Service, Analytics Service, Document Service
**Status:** ✅ Supported

---

## VP/Director Use Cases (UC-V01 through UC-V04)

### UC-V01: Cross-Entity Heatmap Dashboard

**Persona:** Robert (VP Finance) | **Complexity:** H | **Frequency:** Weekly during close

**Services:** Analytics Service, AI Orchestration
**Status:** ✅ Supported — Entity heatmap powered by Analytics Service aggregation across all entities.

---

### UC-V02: ROI Dashboard for CFO

**Persona:** Robert (VP Finance) | **Complexity:** H | **Frequency:** Quarterly

**Services:** Analytics Service (ROI computation from AgentExecution logs), AI Orchestration
**Status:** ✅ Supported — Agent ROI metrics (hours saved, cost equivalent) logged per execution and aggregatable.

---

### UC-V03: Entity Benchmarking

**Persona:** Robert (VP Finance) | **Complexity:** H | **Frequency:** Quarterly

**Services:** Analytics Service (cross-entity comparison), AI Orchestration (best-practice recommendations)
**Status:** ✅ Supported — Normalized comparison across entities with process-level breakdown.

---

### UC-V04: Auto-Generated Executive Summary

**Persona:** Robert (VP Finance) | **Complexity:** M | **Frequency:** Monthly

**Services:** AI Orchestration (narrative generation), Analytics Service (data), Document Service (export)
**Status:** ✅ Supported — AI generates close summary from real-time data; exportable as PDF/PPT.

---

## Gap Analysis Summary

| Use Case | Gap | Severity | Resolution |
|----------|-----|----------|------------|
| UC-P06 | ERP write-back not available for all ERPs | Medium | Phase 4+ for per-ERP API coverage; JE export as interim |
| — | Native calculation engine ("IDE for Accountants") | Low (future) | Phase 6+ roadmap item; not required for core architecture |
| — | Full "Ask FloQast" natural language search | Low (future) | Phase 4 of Search Service rollout; Q4+ |

**Result: 39 of 40 use cases fully supported. 1 partially supported (ERP write-back). 0 unsupported.**

The architecture handles all identified scenarios. The only gap (ERP write-back) is an integration coverage issue, not an architectural limitation — the system design supports it, but individual ERP APIs must be built per connector.
