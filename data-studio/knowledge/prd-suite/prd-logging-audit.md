# Data Studio: Platform Features — Logging & Audit Requirements (DRAFT)

| Field | Value |
|---|---|
| Target release | Target: operating effectively by 2026-09-30 |
| Epic | IDEA-2488 — Data Studio: Platform Features |
| Idea Link | https://floqast.atlassian.net/jira/polaris/projects/IDEA/ideas/view/11291632?selectedIssue=IDEA-2488 |
| Document status | DRAFT |
| Document owner | Alex Kearns |
| Designer | Natasha Clark |
| Tech lead | (assign) |
| Technical writers | (assign) |
| QA | (assign) |
| Depends on | Scheduling (schedule config changes); Model Creation & Source Config (model and connection config changes) |
| Related sub-PRDs | [Scheduling](prd-scheduling.md) · [On-demand Refresh](prd-on-demand-refresh.md) · [Error Patterns & Handling](prd-error-patterns.md) |

---

## 🎯 Objective

This PRD defines the logging and audit requirements for Data Studio, driven by three SOC 1 compliance controls: 6.1 (all data jobs logged and errors reported internally and externally), 6.8 (all configuration changes affecting financial data are logged), and 6.18 (changes to scheduled job configurations are authorized, documented, tested, reviewed, and approved).

It covers what Data Studio must log, the structure of job and audit logs, what customers can see vs. what is internal-only, the UI requirements for customer-facing log visibility at three hierarchy levels: model, connector, and global, and the **Catalog status column** — a single combined status indicator on the Catalog home page that surfaces both version state and pipeline run state in a unified, user-facing label.

**Two distinct log types surface in the UI:**
- **Runs** — Pipeline execution history (job logs). Answers: "Did this run? When? Did it succeed?"
- **Change Log** — Configuration change audit history. Answers: "Who changed what, when?" Satisfies SOC 1 6.8 and 6.18.

Every Logs tab in the product (model, connector, global) presents both views via a Runs / Change Log toggle.

This PRD does NOT cover internal monitoring infrastructure or alerting stacks (Engineering concern — this PRD defines the data contract), user-facing error messages (see Error Patterns PRD), or retry logic.

Primary users: Data Studio admins (run history visibility, pipeline health), compliance administrators (audit log access).

---

## 🔤 Definitions

For a complete glossary of terms used across this series, see the shared [Data Studio: Definitions & Terms](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869099) page.

---

## 🏅 Why This Is Important

Three SOC 1 controls directly apply to Data Studio and must be operating effectively by **2026-09-30**:

- **SOC 1 6.8** — Log all configuration changes that could impact financial data, control execution, or system behavior. Scope: user access/permissions, integration setup/changes, mapping/data relationship changes, transform logic changes, workflow/automation rules.
- **SOC 1 6.1** — All data jobs must be logged, monitored, and errors reported — internally to FQ engineering, and externally to customers. Customers need visibility into job completion (timestamps, job log).
- **SOC 1 6.18** — Changes to scheduled job configurations must be authorized, documented, tested, reviewed, and approved before production.

Without these requirements in place, FloQast is exposed to SOC 1 audit findings. Because Data Studio sits upstream of the financial close, any unlogged configuration change or unreported job failure has direct implications for the integrity of financial data downstream.

---

## 🔐 Value Unlocked

Once delivered, FloQast can demonstrate to auditors that Data Studio meets SOC 1 requirements: every configuration change is logged with actor, timestamp, and before/after state; every data job is recorded with outcome; and customers have visibility into job execution without needing to contact engineering. Compliance risk in the Data Studio platform is eliminated.

---

## 🗝️ Key Examples

- **Example 1:** An auditor requests evidence that all schedule configuration changes were authorized and logged for Q3 2026. The compliance admin pulls the audit log showing every schedule create/update/delete action with actor, timestamp, and before/after state — satisfying SOC 1 6.18.
- **Example 2:** A customer reports that their close data seems stale. Their admin checks the Logs tab on the relevant model and sees that the last 3 scheduled runs failed with a connection error — they can see exactly when the failures occurred and trigger a re-run without involving FloQast support.
- **Example 3:** FloQast engineering receives an alert that a customer's job failure rate has exceeded a threshold. They investigate using the full internal error detail — which is never exposed to the customer — and resolve the root cause.

---

## 💡 Key Benefits

- SOC 1 6.1, 6.8, and 6.18 compliance requirements met by 2026-09-30 deadline
- Customers can self-serve on job history — no support ticket needed to understand data freshness
- Immutable audit trail for all configuration changes — protects FloQast in the event of a dispute
- Engineering has full internal error detail for diagnostics, without exposing technical noise to customers
- Admins can see every model's current state at a glance from the Catalog home page — no need to click into each model to check pipeline health

---

## ✅ Use Cases

| # | Persona | Scenario | Expected Outcome |
|---|---|---|---|
| 1 | Compliance Administrator | SOC 1 auditor requests evidence of authorized schedule changes for a time period | Audit log provides actor, timestamp, action, and before/after state for all schedule changes in the requested range |
| 2 | Admin | Wants to know why their model's data is stale | Logs tab shows run history with timestamps, trigger type, duration, and status — plus error detail for failed runs |
| 3 | Admin | Needs to verify a specific run completed successfully before the close deadline | Run history entry shows completed_at timestamp and status = Success |
| 4 | Engineering (internal) | On-call alert fires for a customer's repeated job failures | Internal monitoring surfaces full error detail and run metadata to diagnose root cause |
| 5 | Compliance Administrator | Auditor asks whether configuration changes were tested and reviewed before production | Audit log combined with change management process demonstrates compliance with 6.18 |
| 6 | Admin | Opens Catalog home page and wants to quickly assess which models are healthy, processing, or failed — without clicking into each model | Status column shows a single combined label per model row (Current, Processing, Loading Historical Data, Long Running, Processing Failed, Draft) that accurately reflects both version state and pipeline run state |
| 7 | Admin | Wants to find and view a model that was archived last quarter | Toggles "Show archived" on the Catalog home page to reveal archived models (hidden by default) |

---

## 📊 Success Metrics

| Goal | Metric | Baseline | Target |
|---|---|---|---|
| SOC 1 compliance | Audit findings related to Data Studio logging | Unknown | 0 findings by 2026-09-30 |
| Customer self-service on job history | % of job status inquiries resolved via self-service (Logs tab) vs. support ticket | 0% | TBD |
| Log coverage | % of data runs with a complete job log entry | 0% | 100% |
| Config change coverage | % of configuration change events with an audit log entry | 0% | 100% |

---

## 🤔 Assumptions

**Established**
- All job log events are emitted to an internal monitoring system (Engineering determines the stack — Datadog, CloudWatch, etc.)
- Technical error detail (stack traces, error codes) is logged internally and never surfaced to customers
- Audit log entries are immutable — they cannot be edited or deleted by any user, including admins
- Log retention minimum: 90 days visible in UI; longer-term archival determined by Engineering and Compliance
- Admin-level access is sufficient authorization for schedule changes in v1 (4-eyes TBD pending Compliance confirmation)
- The Catalog home page uses a **single combined Status column** — not separate Version and Run Status columns. This column merges version state (Draft/Active/Archived) and pipeline run state (Pending/In Progress/Complete/Failed) into a single user-facing label using the seven-label system defined in LA12

**Open Items to Confirm**
- Does SOC 1 6.18 require 4-eyes approval for schedule changes, or is admin self-authorization sufficient?
- What is the required log retention period — 90 days? 1 year? Longer?
- Should customers have a log export capability (CSV download)?
- Is a cross-model activity log (all runs across all models) required for v1, or is per-model Logs tab sufficient?

---

## 🌟 Milestones

| Milestone | Owner | Target Date |
|---|---|---|
| Phase 1: Job log for all model runs (scheduled + manual) | (assign) | TBD — target by 2026-09-30 |
| Phase 2: Configuration change audit log (6.8 + 6.18) | (assign) | TBD — target by 2026-09-30 |
| Phase 3: Customer-facing Logs tab (run history UI) | (assign) | TBD — target by 2026-09-30 |
| Phase 4: Internal monitoring emission + alerting | Engineering | TBD — target by 2026-09-30 |

---

## 🗺️ Scope

### 🚗 In Scope
- Job log for all model runs (scheduled + manual + API-triggered) — all fields defined in requirements
- Audit log for all configuration changes: user access, integration setup, model configuration, field mappings, schedule configuration, data relationships (SOC 1 6.8)
- **Model-level Logs tab**: Runs view (run history, 90-day minimum) + Change Log view (version publishes, field mapping edits, source dataset links)
- **Connector-level Logs tab**: Runs view (all models, filterable) + Change Log view (schedule changes, OAuth events, file definition events, connection events)
- **Global Logs section** (L1 tab in Data Studio):
  - Health view: per-connector 30-day status timelines, overall status banner, model sub-rows, recent incidents feed
  - Runs view: all runs across all connectors/models, filterable
  - Change Log view: summary-level events across all connectors/models, with navigation links to detail
- Replaced/superseded runs: hidden by default, revealed via "Show replaced runs" toggle
- **Catalog status column**: single combined Status column on Catalog home page — seven user-facing labels (Current, Processing, Loading Historical Data, Long Running, Processing Failed, Draft, Archived)
- **"Show archived" toggle** on Catalog home page — archived models hidden by default
- Internal job log emission to monitoring system
- Log retention: minimum 90 days

### 🚦 Out of Scope
- Customer-facing audit log export (raw download) — v1
- 4-eyes approval flow for schedule changes — pending Compliance confirmation
- Log search/filter within the Change Log feed beyond connector/model filter — v1

---

## 📋 Requirements — User Stories

### Quick Reference

| # | Story | Importance |
|---|---|---|
| LA1 | Job log for all model runs | High |
| LA2 | Configuration change audit log (backend schema) | High |
| LA3 | Model-level Logs tab — Runs view | High |
| LA4 | Model-level Logs tab — Change Log view | High |
| LA5 | Connector-level Logs tab — Runs + Change Log | High |
| LA6 | Global health/status dashboard | High |
| LA7 | Global Runs view | High |
| LA8 | Global Change Log | High |
| LA9 | Replaced/superseded runs | Medium |
| LA10 | Internal monitoring emission | High |
| LA11 | Schedule change approval workflow | High |
| LA12 | Catalog status column | High |

---

### LA1 — Job Log for All Model Runs

**User Story:** As an engineer or compliance administrator, I can access a complete log of every data model run so that I can audit job execution and diagnose failures.

**Importance:** High

**Details:** Every model run (scheduled, manual, or API-triggered) generates a job log entry. The entry includes all fields defined in the schema below. Technical error detail is stored internally and never surfaced to customers.

**Job Log Schema:**

| Field | Description |
|---|---|
| `run_id` | Unique identifier for the run |
| `model_id` | The model that ran |
| `trigger_type` | "scheduled", "manual", "api", or "event" (event = inbound source system event, e.g. SFTP file drop or Fivetran sync completion — see Eventing PRD) |
| `triggered_by` | User ID + name (manual); calling system (api); system (scheduled); source connection name (event) |
| `schedule_id` | Reference to the schedule that triggered (if applicable) |
| `start_time` | UTC timestamp |
| `end_time` | UTC timestamp (null if in progress) |
| `duration_ms` | Run duration in milliseconds |
| `status` | success / failed / pending / skipped |
| `records_processed` | Count of records successfully processed |
| `records_failed` | Count of records that failed |
| `error_message` | User-facing error summary (if failed) |
| `error_detail` | Internal technical detail — not surfaced to customer |

**Acceptance Criteria:**

**AC-LA1-01 — Job log entry created for every run**
```
Given any model run is triggered (scheduled, manual, or API)
When the run starts
Then a job log entry is created with run_id, model_id, trigger_type, triggered_by, and start_time
```

**AC-LA1-02 — Job log entry completed on run finish**
```
Given a model run completes (success or failure)
When the run finishes
Then the job log entry is updated with: end_time, duration_ms, status, records_processed, records_failed, error_message, and error_detail
```

**AC-LA1-03 — Internal error detail not exposed to customer**
```
Given a run fails and has error_detail logged internally
When an admin views the run history in the UI
Then they see only the error_message (plain language)
And error_detail is not visible in the customer-facing interface
```

---

### LA2 — Configuration Change Audit Log

**User Story:** As a compliance administrator, I can access an audit log of all Data Studio configuration changes so that I can demonstrate compliance with SOC 1 6.8 and 6.18.

**Importance:** High

**Details:** All configuration changes in the categories below generate an immutable audit log entry. Entries include actor, timestamp, action type, affected object, and before/after state.

**Covered change categories:**
- User access / permissions
- Integration / connection setup and changes
- Model configuration (create, publish, archive, update)
- Field mappings (add, update, delete)
- Schedule configuration (create, update, enable, disable, delete)
- Data relationships (join key add, update, remove)

**Acceptance Criteria:**

**AC-LA2-01 — Audit log entry on configuration change**
```
Given any admin performs a configuration change in a covered category
When the change is saved
Then an immutable audit log entry is created with: actor (user ID + name), timestamp (UTC), action type, affected object, and before/after state
```

**Note:** Production currently displays "CLIENT_USER" as the actor in version history and audit events. This is an engineering placeholder and must not appear in any customer-facing UI. The actor field must resolve to the actual user's display name or email address.

**AC-LA2-02 — Audit log covers requested time range**
```
Given an auditor or compliance admin requests a configuration change log
When they view or export the log for a specified time range
Then all covered configuration changes in that range are included, sorted chronologically
```

**AC-LA2-03 — Audit log entries cannot be modified**
```
Given an audit log entry has been created
When any user (including admins) attempts to edit or delete the entry
Then the action is rejected — audit log entries are immutable
```

**AC-LA2-04 — Failed changes are not logged**
```
Given a user attempts a configuration change that fails (e.g., validation error)
When the change is rejected before saving
Then no audit log entry is created for that attempt
```

---

### LA3 — Model-Level Logs Tab — Runs View

**User Story:** As an admin, I can view the run history for a model from the Logs tab so that I can verify data was collected and diagnose failures without contacting support.

**Importance:** High

**Details:** The Logs tab on the model detail page presents two views via a **Runs / Change Log** toggle. This story covers the **Runs** view. Run history covers the past 90 days minimum. Each entry shows: run date/time (local timezone), trigger type, duration, status. Failed runs show the user-facing error message and a Re-run action.

**Acceptance Criteria:**

**AC-LA3-01 — Runs / Change Log toggle present**
```
Given I am viewing a model's Logs tab
When the page loads
Then I see a segmented toggle with two options: "Runs" and "Change Log"
And "Runs" is selected by default
```

**AC-LA3-02 — Run history visible in Runs view**
```
Given I am on the Runs view of a model's Logs tab
When the view loads
Then I see a list of runs sorted by most recent, covering at least the past 90 days
And each entry shows: run date/time (local timezone), trigger type, duration, status
```

**AC-LA3-03 — Failed run detail and recovery**
```
Given a run has status = Failed
When I expand the run entry
Then I see the user-facing error message and a Re-run action
```

**AC-LA3-04 — In-progress run visibility**
```
Given a run is currently in progress
When I view the Runs tab
Then the in-progress run appears at the top with status = In Progress and a pipeline stage indicator (Ingesting → Transforming → Loading)
```

---

### LA4 — Model-Level Logs Tab — Change Log View

**User Story:** As an admin or compliance administrator, I can view a Change Log for a model from the Logs tab so that I can see what configuration changes were made, when, and by whom.

**Importance:** High

**Details:** The **Change Log** view (second option in the Runs / Change Log toggle on the model Logs tab) shows a chronological activity feed of model configuration events. Each entry shows: actor, timestamp, and a plain-language description of the change. The Change Log surfaces detailed change information at the model level — this is where field-level and version-level detail lives.

**Events captured in the model Change Log:**

| Event | Example description |
|---|---|
| Model version published | "Published v3 — effective 2026-01-01. 4 prior runs reprocessed." |
| Draft created | "Draft created" |
| Field mapping edited | "Field mapping updated: GL Account → Account Code (was: GL Code)" |
| Source dataset linked | "Source dataset linked: QuickBooks — Trial Balance" |
| Model created | "Model created" |

**Acceptance Criteria:**

**AC-LA4-01 — Change Log view accessible via toggle**
```
Given I am on a model's Logs tab
When I select "Change Log" from the Runs / Change Log toggle
Then the run history table is replaced with the Change Log activity feed
```

**AC-LA4-02 — Change Log shows covered events**
```
Given I view the model Change Log
When I look at the feed
Then I see entries for: version publishes, draft creation, field mapping edits, source dataset links, and model creation
And each entry shows: actor name, timestamp, and a plain-language description
```

**AC-LA4-03 — Version publish entry includes effective date and reprocessed count**
```
Given a model version was published with a backdated effective date
When I view the version publish entry in the Change Log
Then I see the effective date and the number of historical runs that were reprocessed
```

**AC-LA4-04 — Field mapping edit entry shows old and new values**
```
Given a field mapping was changed
When I view the Change Log entry for that event
Then I see both the old and new field names (before → after)
```

**AC-LA4-05 — Raw config values not exposed**
```
Given I view any Change Log entry
When I read the description
Then it is written in plain language
And internal field names, cron expressions, or system identifiers are not exposed directly
```

---

### LA5 — Connector-Level Logs Tab — Runs and Change Log

**User Story:** As an admin, I can view run history and configuration changes for a connector from the connector's Logs tab so that I can see aggregated run activity across all models and audit connector-level configuration events.

**Importance:** High

**Details:** The connector detail page includes a Logs tab with the same **Runs / Change Log** toggle pattern as the model Logs tab. The Runs view shows runs across all models linked to this connector (with a Model filter). The Change Log captures connector-level configuration events — not model-level events (those live in the model's own Change Log).

**Events captured in the connector Change Log:**

| Event | Example description |
|---|---|
| Schedule created or updated | "Schedule updated: daily at 9 PM → daily at 6 PM" |
| OAuth token auto-refreshed | "OAuth token auto-refreshed" |
| OAuth token manually refreshed | "OAuth token manually refreshed by Alex Kearns" |
| File definition added | "File definition added: Trial Balance (*.xlsx)" |
| File naming pattern changed | "File naming pattern updated: Trial Balance" |
| Connection re-authorized | "Connection re-authorized by Alex Kearns" |
| Connection created | "Connection created by Alex Kearns" |

**Acceptance Criteria:**

**AC-LA5-01 — Connector Logs tab present with Runs / Change Log toggle**
```
Given I am viewing a connector detail page
When I navigate to the Logs tab
Then I see a Runs / Change Log toggle
And "Runs" is selected by default
```

**AC-LA5-02 — Connector Runs view shows all linked models**
```
Given I am on the Runs view of a connector's Logs tab
When the view loads
Then I see runs from all models linked to this connector
And each run entry shows: model name (with color chip), run date/time, trigger type, duration, status
```

**AC-LA5-03 — Connector Runs view supports model filter**
```
Given I am on the connector Runs view
When I use the Model filter
Then the run list is filtered to only show runs from the selected model(s)
```

**AC-LA5-04 — Connector Change Log shows covered events**
```
Given I view the connector Change Log
When I look at the feed
Then I see entries for: schedule changes, OAuth events (auto and manual), file definition adds/edits, connection re-authorization, and connection creation
And each entry shows: actor name, timestamp, and a plain-language description
```

**AC-LA5-05 — OAuth events distinguish auto vs. manual**
```
Given an OAuth token was refreshed
When I view the connector Change Log entry
Then the entry clearly indicates whether the refresh was automatic (system) or manual (actor name shown)
```

---

### LA6 — Global Health / Status Dashboard

**User Story:** As an admin, I can view a global pipeline health dashboard for all connectors in Data Studio so that I can quickly identify unhealthy connectors and assess overall data freshness without checking each connector individually.

**Importance:** High

**Details:** The global Logs section in Data Studio (L1 tab) presents three views via a **Health / Runs / Change Log** toggle. This story covers the **Health** view. The Health view follows a status-page pattern (similar to a product status page): an overall status banner, per-connector cards with 30-day run timelines, expandable model sub-rows, and a recent incidents feed for failures or degraded states.

**Health states:**

| State | Color | Meaning |
|---|---|---|
| Successful | Green | All runs for this day succeeded |
| Partial | Amber | Some runs succeeded, some failed |
| Failed | Red | All runs for this day failed |
| No runs | Gray | No runs were scheduled or executed |

**Acceptance Criteria:**

**AC-LA6-01 — Global Health view accessible**
```
Given I am in Data Studio
When I navigate to the global Logs section
Then I see a Health / Runs / Change Log toggle
And "Health" is selected by default
```

**AC-LA6-02 — Overall status banner reflects worst-case state**
```
Given any connector has a failed run in the current period
When I view the Health dashboard
Then the overall status banner reflects the worst state across all connectors (Healthy / Degraded / Outage)
```

**AC-LA6-03 — Per-connector cards with 30-day timeline**
```
Given I am on the Health view
When the view loads
Then I see one card per connector
And each card shows a 30-day timeline bar where each day is color-coded by run outcome (green / amber / red / gray)
```

**AC-LA6-04 — Timeline tooltip shows day detail**
```
Given I hover over a day in a connector's timeline bar
When the tooltip appears
Then it shows the date and a plain-language summary (e.g., "Mar 31: All runs successful" or "Mar 28: 1 of 3 runs failed")
```

**AC-LA6-05 — Model sub-rows expandable per connector**
```
Given I click on a connector card to expand it
When the card expands
Then I see one sub-row per linked model, each with its own mini 30-day timeline
```

**AC-LA6-06 — Recent incidents feed**
```
Given one or more failed or degraded run events have occurred
When I view the Health dashboard
Then a Recent Incidents section shows a chronological feed of failures and degraded states
And each entry shows: connector name, model name (if applicable), date/time, and a plain-language description
```

---

### LA7 — Global Runs View

**User Story:** As an admin or compliance administrator, I can view all model runs across all connectors from the global Runs view so that I can audit pipeline activity at the tenant level.

**Importance:** High

**Details:** The **Runs** view (second option in the global Health / Runs / Change Log toggle) shows a table of all runs across all connectors and models. Supports filtering by connector and model.

**Acceptance Criteria:**

**AC-LA7-01 — Global Runs view shows all runs**
```
Given I am on the global Runs view
When the view loads
Then I see runs from all connectors and models, sorted by most recent
And each entry shows: connector (with chip), model (with chip), run date/time, trigger type, duration, status
```

**AC-LA7-02 — Connector and model filters**
```
Given I am on the global Runs view
When I use the Connector or Model filter
Then the run list is filtered to only show runs matching the selected connector and/or model
```

---

### LA8 — Global Change Log

**User Story:** As a compliance administrator, I can view a summary-level Change Log across all connectors and models so that I can audit significant configuration events at the tenant level and navigate to detailed records where needed.

**Importance:** High

**Details:** The **Change Log** view (third option in the global Health / Runs / Change Log toggle) shows a summary-level activity feed of configuration events across the entire tenant.

**Design principle: global = summary only.** The global Change Log surfaces *what happened* — not the detailed before/after values. Detailed change information (e.g., which specific fields were remapped, what the exact schedule change was) lives at the model or connector level. Each global entry provides a navigation link to the relevant model or connector Change Log for full detail.

**Example global Change Log entries:**

| Event | Example description |
|---|---|
| Model version published | "Published v3 — Trial Balance [QuickBooks chip] [navigate →]" |
| Schedule updated | "Schedule updated — QuickBooks [connector chip] [navigate →]" |
| File definition added | "New file definition added — Intacct [connector chip] [navigate →]" |
| Connection created | "Connection created — NetSuite [connector chip] [navigate →]" |
| OAuth re-authorization | "OAuth re-authorized — QuickBooks [connector chip] [navigate →]" |

**Acceptance Criteria:**

**AC-LA8-01 — Global Change Log shows summary-level entries**
```
Given I am on the global Change Log view
When the view loads
Then I see a chronological feed of configuration events across all connectors and models
And each entry shows: event description (plain language, summary level), connector chip, model chip (if applicable), actor, timestamp
```

**AC-LA8-02 — Global entries do not expose field-level detail**
```
Given a field mapping was changed on a model
When I view the global Change Log entry for that event
Then I see a summary description (e.g., "Field mapping updated — Trial Balance")
And I do not see the specific before/after field names (those are in the model-level Change Log)
```

**AC-LA8-03 — Navigation link to model or connector Change Log**
```
Given I am viewing any entry in the global Change Log
When I click the navigation link on the entry
Then I am taken to the relevant model or connector's Change Log view, scoped to that event
```

**AC-LA8-04 — Connector and model filter**
```
Given I am on the global Change Log
When I use the Connector or Model filter
Then the feed is filtered to show only events from the selected connector and/or model
```

---

### LA9 — Replaced / Superseded Runs

**User Story:** As an admin, I can understand when a historical run was superseded by a backdated version publish so that I can distinguish between the run that originally executed and the reprocessed result that replaced it.

**Importance:** Medium

**Details:** When a model version is published with a backdated effective date, all runs that fall within the new version's effective range are reprocessed. The original runs are superseded — they still occurred, but their output is no longer the active result. These superseded runs are hidden by default in the run history UI to reduce noise, but can be revealed by the user.

**Acceptance Criteria:**

**AC-LA9-01 — Superseded runs hidden by default**
```
Given a version publish has reprocessed historical runs
When I view the model's Runs view
Then the superseded (replaced) runs are hidden by default
And a "Show replaced runs" control is visible
```

**AC-LA9-02 — Superseded runs visible on demand**
```
Given I click "Show replaced runs"
When the view refreshes
Then superseded runs appear in the list, visually distinguished (e.g., muted styling, "Replaced" label)
And the replacement run (the reprocessed run) is linked or shown adjacent to the superseded run
```

**AC-LA9-03 — Version publish entry references reprocessed count**
```
Given a version was published with a backdated effective date
When I view the version publish entry in the model's Change Log
Then the entry shows how many historical runs were reprocessed (e.g., "4 prior runs reprocessed")
```

---

### LA10 — Internal Monitoring Emission

**User Story:** As a FloQast engineer, I can monitor job health across all customer tenants so that I can proactively detect and resolve failures before they impact customers.

**Importance:** High

**Details:** All job log events are emitted to an internal monitoring system (stack determined by Engineering). Alerts fire when job failure rate exceeds threshold or job duration exceeds SLA. Engineering has access to full error_detail.

**Notes:** Engineering determines the monitoring stack (Datadog, CloudWatch, etc.). This requirement defines the data contract — what must be emitted, not how.

**Acceptance Criteria:**

**AC-LA10-01 — Job events emitted to monitoring**
```
Given any model run completes or fails
When the run status is recorded
Then a job log event is emitted to the internal monitoring system with all fields from the job log schema
```

**AC-LA10-02 — Full error detail available internally**
```
Given a run fails
When the failure is recorded
Then error_detail (technical detail, stack trace) is included in the emitted event
And is accessible to FloQast engineering
```

**AC-LA10-03 — Repeated failures do not produce alert storms**
```
Given the same job fails on multiple consecutive runs
When each failure is recorded and emitted
Then alert deduplication or escalation logic prevents flooding
And subsequent failures produce an escalation rather than a new independent alert
```

---

### LA11 — Schedule Change Approval Workflow

**User Story:** As FloQast (compliance), scheduling configuration changes must be authorized before taking effect in production so that unauthorized changes cannot alter data delivery timing without oversight.

**Importance:** High

**Details:** When an admin saves a change to a scheduling configuration, the change enters a pending state and does not immediately take effect. An authorized approver must review and approve the change before it is applied. The approval decision is recorded in the audit log (LA2). Rejected changes leave the existing schedule unchanged.

**Notes:** Whether this requires a second authorized user (4-eyes) or admin self-authorization is pending Compliance confirmation (see OQ-1). The approval workflow design (in-product UI vs. external tooling) is TBD with design.

**Acceptance Criteria:**

**AC-LA11-01 — Schedule config change enters pending state**
```
Given an admin saves a change to a scheduling configuration
When the change is submitted
Then the change is saved as "pending" and does not take effect in production
And the admin sees a confirmation that the change requires approval
```

**AC-LA11-02 — Authorized approver can review and approve the change**
```
Given a scheduling change is pending
When an authorized approver reviews it
Then they can approve or reject the change
And the decision (with approver identity and timestamp) is recorded in the audit log
```

**AC-LA11-03 — Approved change takes effect; rejected change is discarded**
```
Given a scheduling change is approved
When approval is confirmed
Then the new schedule takes effect on the next applicable schedule window

Given a scheduling change is rejected
When rejection is confirmed
Then the existing schedule remains unchanged
And the rejection reason is recorded in the audit log
```

**AC-LA11-04 — Pending changes visible to submitter and approver**
```
Given a scheduling change is pending
When either the submitter or an approver views the model's schedule section
Then they can see the pending change and its current approval status
```

---

### LA12 — Catalog Status Column

**User Story:** As an admin, I can see a single Status column on the Catalog home page that reflects both the version state and pipeline run state of each model so that I can assess model health at a glance without navigating into each model.

**Importance:** High

**Details:** The Catalog home page replaces the previous separate "Version" and "Run Status" columns with a single combined **Status** column. This column surfaces one of seven user-facing labels per model row, determined by the combination of version state and pipeline run state. Archived models are hidden by default and revealed via a "Show archived" toggle.

**Seven status labels:**

| Label | When shown | Notes |
|---|---|---|
| **Current** | Active version exists, last run succeeded | The "all good" state |
| **Processing** | Active version exists, run currently in progress | Standard pipeline run in progress |
| **Loading Historical Data** | Active version exists, backfill or tear-down/rehydrate operation in progress | User-facing label for both initial publish backfill (Scenario C, PRD 3) and re-publish rehydrate (Scenario B, PRD 4). "Backfill" is never shown to users. |
| **Long Running** | Active version exists, run in progress but has exceeded the expected duration threshold | Deliberately uses engineering-adjacent terminology — "Delayed" was rejected (implies SFTP file missing), "Taking Longer Than Expected" is too verbose |
| **Processing Failed** | Active version exists, last run failed | |
| **Draft** | No Active version exists — model has only a Draft | Model has never been published |
| **Archived** | Model is archived | Hidden by default; revealed via "Show archived" toggle |

**Notes:**
- "Loading Historical Data" is the user-facing label for both Scenario B (tear-down/rehydrate after re-publish) and Scenario C (initial publish backfill). The distinction is internal.
- The "Long Running" threshold is not yet defined — see OQ-9 and G7.
- Only one status applies at a time — precedence: Archived → Draft → Processing / Loading Historical Data / Long Running → Processing Failed → Current.

**Acceptance Criteria:**

**AC-LA12-01 — Single Status column on Catalog home page**
```
Given I am on the Catalog home page
When the page loads
Then I see a single "Status" column (not separate Version and Run Status columns)
And each model row shows exactly one of the seven status labels
```

**AC-LA12-02 — "Current" shown when Active and last run succeeded**
```
Given a model has an Active version
And the last run completed successfully
When I view the Catalog
Then the model's Status shows "Current"
```

**AC-LA12-03 — "Processing" shown when run is in progress**
```
Given a model has an Active version
And a pipeline run is currently in progress (standard run)
When I view the Catalog
Then the model's Status shows "Processing"
```

**AC-LA12-04 — "Loading Historical Data" shown during backfill or rehydrate**
```
Given a model has an Active version
And a backfill or tear-down/rehydrate operation is currently in progress
When I view the Catalog
Then the model's Status shows "Loading Historical Data"
And "Loading Historical Data" is used regardless of whether this is an initial publish backfill or a re-publish rehydrate
```

**AC-LA12-05 — "Long Running" shown when run exceeds duration threshold**
```
Given a model has an Active version
And a run is in progress that has exceeded the expected duration threshold
When I view the Catalog
Then the model's Status shows "Long Running"
```

**AC-LA12-06 — "Processing Failed" shown when last run failed**
```
Given a model has an Active version
And the last run completed with a failure status
When I view the Catalog
Then the model's Status shows "Processing Failed"
```

**AC-LA12-07 — "Draft" shown when no Active version exists**
```
Given a model has never been published (Draft only)
When I view the Catalog
Then the model's Status shows "Draft"
```

**AC-LA12-08 — Archived models hidden by default**
```
Given one or more models in the Catalog are archived
When I open the Catalog home page
Then archived models are not shown in the default table view
And a "Show archived" toggle or control is visible
```

**AC-LA12-09 — "Show archived" toggle reveals archived models**
```
Given I am on the Catalog home page
When I toggle "Show archived" on
Then archived models appear in the table
And each archived model's Status shows "Archived"
And archived models are visually distinguished from active models
```

**AC-LA12-10 — Status updates in real time during active runs**
```
Given a model's Status is "Current" or "Processing Failed"
When a run starts on that model
Then the Status updates to "Processing" (or "Loading Historical Data" / "Long Running" as applicable) without requiring a page refresh
```

---

## ▶️ User Flow Reference

Logging applies throughout the Data Studio user flow:
- All configuration steps generate audit log entries (model setup, field mapping, schedule config)
- All run executions generate job log entries
- Customer-facing visibility: Logs tab on model detail page (post-publish)
- Catalog home page status column surfaces combined version + run state across all models (LA12)

(Link to full user flow document — assign)

---

## 🎨 User Interaction & Design

**Prototype reference:** Three HTML prototypes have been built to validate the interaction model and inform these requirements:
- `playspace/data-studio-logs/model-logs.html` — Model-level Logs tab (Runs + Change Log toggle)
- `playspace/data-studio-logs/connector-logs.html` — Connector-level Logs tab (Runs + Change Log toggle)
- `playspace/data-studio-logs/global-health.html` — Global Logs section (Health / Runs / Change Log three-way toggle)

**Resolved design decisions (from prototype review):**
- Schedule change history lives in the **connector-level Change Log** (not the model Logs tab or the Schedule section)
- The Logs tab uses a **Runs / Change Log toggle** — they are separate views, not combined
- Failed run rows have a red left-border indicator and expand to show error detail + Re-run action
- In-progress runs show animated pipeline stage indicator (Ingesting → Transforming → Loading)
- The global view defaults to the **Health** view (status dashboard), not the Runs table

**Open UX questions (for Natasha Clark):**
- Pagination vs. infinite scroll for run history tables
- Exact visual treatment for connector chip colors (established in prototype: QBO=green, Intacct=blue, Salesforce=purple, NetSuite=orange — confirm with design)
- Navigation target for global Change Log drill-down links: full page nav to model/connector, or side panel?
- Mobile/narrow viewport behavior (if applicable)

---

## ✏️ UI Changes

**Model detail page — Logs tab:**
- Runs / Change Log segmented toggle
- Runs view: run history table (date/time, trigger type, duration, status), failed run expansion with error + Re-run, in-progress run with pipeline stage indicator
- Change Log view: chronological activity feed (version publishes, field mapping edits, source dataset links, draft/model creation events)
- "Show replaced runs" toggle (hidden by default; revealed when superseded runs exist)

**Connector detail page — Logs tab (new):**
- Runs / Change Log segmented toggle
- Runs view: cross-model run table with Model column (color chip), Model filter dropdown
- Change Log view: connector-level events (schedule, OAuth, file definitions, connection lifecycle)

**Global Data Studio — Logs section (new, L1 tab):**
- Health / Runs / Change Log three-way toggle
- Health view: overall status banner, per-connector cards with 30-day color-coded timeline bars, expandable model sub-rows with mini-timelines, recent incidents feed
- Runs view: all runs table with Connector + Model columns, both filterable
- Change Log view: summary-level event feed with connector/model chips and navigation links to detail

**Catalog home page — Status column:**
- Single combined "Status" column replaces separate Version + Run Status columns
- Seven labels: Current · Processing · Loading Historical Data · Long Running · Processing Failed · Draft · Archived
- Archived models hidden by default; "Show archived" toggle reveals them

---

## 😎 Future Considerations

- **Customer-facing audit log export:** Raw CSV download of configuration change history for compliance and legal purposes — high value for enterprise customers.
- **Cross-model activity log:** A single view showing all runs across all models for a given tenant — useful for admins managing many models.
- **4-eyes approval for schedule changes:** Pending Compliance confirmation on SOC 1 6.18 interpretation.
- **Log search and filter:** Ability to filter run history by status, trigger type, or date range within the UI.

---

## ❓ Open Questions

| # | Question | Owner | Status | Answer |
|---|---|---|---|---|
| OQ-1 | Does SOC 1 6.18 require 4-eyes approval for schedule changes? | Alex K / Vicky (Compliance) | Open | |
| OQ-2 | What is the required log retention period? | Alex K / Vicky / Engineering | Open | |
| OQ-3 | Should customers have a log export capability (CSV)? | Alex K | Open | |
| OQ-4 | Is a cross-connector/cross-model Runs view required for v1? | Alex K / Natasha | Partially resolved — global Health + Runs view is now in scope; full requirements in LA6/LA7 | |
| OQ-5 | What is the SLA threshold that triggers an internal engineering alert? | Engineering | Open | |
| OQ-6 | What is the navigation target for global Change Log drill-down links? Does clicking a global entry open the model/connector detail page scoped to the Change Log tab, or open a focused side panel? | Alex K / Natasha | Open | |
| OQ-7 | Should the global Change Log support date range filtering in v1, or is connector/model filter sufficient? | Alex K | Open | |
| OQ-8 | Should status labels have distinct icon or color treatments in addition to text labels, or text-only? | Natasha | Open | |
| OQ-9 | What is the duration threshold that triggers "Long Running" status? | Engineering / Alex K | Open | |

---

## 🚫 Gaps

| # | Gap | Impact | Proposed Resolution |
|---|---|---|---|
| G1 | 4-eyes approval for schedule changes | Medium | Pending Compliance confirmation; add to backlog if required |
| G2 | Customer-facing audit log export | Medium | Deferred to future iteration; add to backlog |
| G3 | Cross-connector/model log aggregation | Resolved | Global Runs view (LA7) addresses this — now in scope |
| G4 | Log search and filter in UI | Low | Deferred; connector/model filter in global views is sufficient for v1 |
| G5 | Drill-down navigation target from global Change Log | Medium | Design decision pending (OQ-6) — full page nav vs. side panel |
| G6 | Status label precedence rules not yet implemented | Low | Defined in LA12 Notes — single status per row, precedence order documented |
| G7 | "Long Running" duration threshold not defined | Medium | Engineering needs to define the threshold before LA12 can be fully implemented; see OQ-9 |

---

## 📚 References

### Related Sub-PRDs
- [Scheduling](prd-scheduling.md)
- [On-demand Refresh](prd-on-demand-refresh.md)
- [Error Patterns & Handling](prd-error-patterns.md)

### Design Resources
- Figma: Lineage Product — https://www.figma.com/design/pF3J27wNhb7TRnCmmJGrB9/Lineage---Product?node-id=1-2

### Engineering References
- SOC 1 controls 6.1, 6.8, 6.18 — sourced from Vicky (Compliance) via Steve Raedar
- Target: operating effectively by 2026-09-30
