# Data Studio: Platform Features — Logging & Audit Requirements (Q3 2026)

| Field | Value |
|---|---|
| Target release | Target: operating effectively by 2026-09-30 |
| Epic | IDEA-2488 — Data Studio: Platform Features |
| Idea Link | https://floqast.atlassian.net/jira/polaris/projects/IDEA/ideas/view/11291632?selectedIssue=IDEA-2624 |
| Document status | Q3 DRAFT |
| Document owner | Alex Kearns |
| Designer | Natasha Clark |
| Tech lead | (assign) |
| Technical writers | (assign) |
| QA | (assign) |
| Depends on | Scheduling (schedule config changes); Model Creation & Source Config (model and connection config changes) |
| Related sub-PRDs | [Scheduling](prd-scheduling.md) · [On-demand Refresh](prd-on-demand-refresh.md) · [Customer-Facing Logging Adjustments](prd-customer-facing-logging-q3.md) |
| Supersedes | prd-logging-audit.md (Q2 draft) |

---

## 🎯 Objective

There are two primary objectives for this PRD:

1. **Customer Confidence** — Customers should have clear visibility into whether their data is reliably flowing, what went wrong when it isn't, and a path to resolve it — without involving FloQast support.
2. **Support for SOC 1 and COSO audit requirements** — Data Studio must demonstrate to auditors that all data jobs are logged and every configuration change is traceable to a responsible human.

The Q3 architecture centers on a clear split between two log types — **Runs** (pipeline execution history: did this run, when, did it succeed?) and **Change Log** (configuration change history: who changed what, when?) — surfaced at three levels: a **global Logs section** (L1 tab, all connectors and models), a **connector-level Logs tab**, and a **model-level Logs tab**. The global view is the entry point; admins drill down to the connector or model for full detail. AI-assisted changes carry explicit attribution so the authorization chain is auditable.

Not covered: internal monitoring infrastructure, user-facing error messages and error placement (see [Customer-Facing Logging Adjustments](prd-customer-facing-logging-q3.md)), retry logic. Primary users: admins, audit administrators.

---

## 🔤 Definitions

For a complete glossary of terms used across this series, see the shared [Data Studio: Definitions & Terms](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869099) page.

**Audit Administrator** — The persona responsible for accessing and reviewing Data Studio's audit trail and run history, typically in support of SOC 1 compliance reviews or internal governance requirements. This includes the SOC 1 admin role. Note: this term is distinct from users of FloQast's Compliance product.

---

## 🏅 Why This Is Important

Today, customers lack confidence that their data is reliably flowing. Without visibility into pipeline runs and configuration history, admins can't tell whether data is current, why something may have failed, or what changed and when. The only signal that something went wrong is often an accountant noticing a problem at close — by which point it's too late to act quietly.

Logging and audit visibility changes that. Admins can proactively see what's running, what failed, and why — and take action themselves without involving FloQast support.

On the compliance side, three SOC 1 controls apply to Data Studio and must be operating effectively by **2026-09-30**:

- **SOC 1 6.8** — All configuration changes affecting financial data must be logged (user access, integration setup, field mappings, transform logic, workflow rules)
- **SOC 1 6.1** — All data jobs must be logged and errors reported internally and externally
- **SOC 1 6.18** — Schedule configuration changes must be authorized, documented, tested, reviewed, and approved before production

Data Studio sits upstream of the financial close — unlogged configuration changes or unreported job failures have direct downstream implications. "How do we know about integration failures?" is now a standard question in enterprise security reviews, and the current answer doesn't hold up.

---

## 🔐 Value Unlocked

FloQast can demonstrate SOC 1 compliance to auditors: every configuration change logged with actor, timestamp, and before/after state; every data job recorded; AI-assisted changes fully attributable. Compliance risk in Data Studio is eliminated.

Customers gain confidence the system is working. Today, the only signal of a failure is an accountant noticing stale data. With this delivered, admins can see pipeline history, understand failures, and take action themselves — no support ticket required.

---

## 🗝️ Key Examples

- **Example 1:** An auditor requests evidence that all schedule configuration changes were authorized and logged for Q3 2026. The audit administrator pulls the audit log showing every schedule create/update/delete action with actor, timestamp, and before/after state — satisfying SOC 1 6.18.
- **Example 2:** A customer reports that their close data seems stale. Their admin checks the Logs tab on the relevant model and sees that the last 3 scheduled runs failed with a connection error — they can see exactly when the failures occurred and trigger a re-run without involving FloQast support.
- **Example 3:** FloQast engineering receives an alert that a customer's job failure rate has exceeded a threshold. They investigate using the full internal error detail — which is never exposed to the customer — and resolve the root cause.
- **Example 4:** An auditor asks whether field mapping changes involving AI suggestions were authorized by a qualified human. The Change Log shows each AI-suggested mapping accepted by the admin, including the admin's identity, timestamp, and the fact that the suggestion originated from AI — satisfying the authorization requirement under SOC 1 6.8.

---

## 💡 Key Benefits

- SOC 1 6.1, 6.8, and 6.18 compliance met
- Admins can see pipeline health and self-serve on failures — no support ticket needed
- Immutable audit trail for all configuration changes, including AI-assisted ones
- Engineering gets full internal error detail without exposing technical noise to customers
- At-a-glance Catalog status column surfaces model health across all models in one view

---

## ✅ Use Cases

| #   | Persona                | Scenario                                                                                                                               | Expected Outcome                                                                                                                                                                                                    |
| --- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Audit Administrator    | SOC 1 auditor requests evidence of authorized schedule changes for a time period                                                       | Audit log provides actor, timestamp, action, and before/after state for all schedule changes in the requested range                                                                                                 |
| 2   | Admin                  | Wants to know why their model's data is stale                                                                                          | Logs tab shows run history with timestamps, trigger type, duration, and status — plus error detail for failed runs                                                                                                  |
| 3   | Admin                  | Needs to verify a specific run completed successfully before the close deadline                                                        | Run history entry shows the completion time and a Success status                                                                                                                                                    |
| 4   | Engineering (internal) | On-call alert fires for a customer's repeated job failures                                                                             | Internal monitoring surfaces full error detail and run metadata to diagnose root cause                                                                                                                              |
| 5   | Audit Administrator    | Auditor asks whether configuration changes were tested and reviewed before production                                                  | Audit log combined with change management process demonstrates compliance with 6.18                                                                                                                                 |
| 6   | Admin                  | Opens Catalog home page and wants to quickly assess which models are healthy, processing, or failed — without clicking into each model | Status column shows a single combined label per model row (Current, Processing, Loading Historical Data, Long Running, Processing Failed, Draft) that accurately reflects both version state and pipeline run state |
| 7   | Admin                  | Wants to find and view a model that was archived last quarter                                                                          | Toggles "Show archived" on the Catalog home page to reveal archived models (hidden by default)                                                                                                                      |
| 8   | Audit Administrator    | Auditor asks whether AI-generated field mapping changes were authorized by a qualified human before taking effect                      | Change Log entry shows AI-assisted indicator, the originating AI system, and the human approver who accepted the change — satisfying the authorization chain requirement                                            |

---

## 📊 Success Metrics

| Goal                                 | Metric                                                                                     | Baseline | Target                   |
| ------------------------------------ | ------------------------------------------------------------------------------------------ | -------- | ------------------------ |
| Customer self-service on job history | % of job status inquiries resolved via self-service (Logs tab) vs. support ticket          | 0%       | TBD                      |
| Log coverage                         | % of data runs with a complete job log entry                                               | 0%       | 100%                     |
| Config change coverage               | % of configuration change events with an audit log entry                                   | 0%       | 100%                     |
| AI change attribution                | % of AI-assisted field mapping changes with complete AI provenance + approver in audit log | 0%       | 100%                     |

---

## 🤔 Assumptions

**Established**
- All job log events are emitted to an internal monitoring system (Engineering determines the stack — Datadog, CloudWatch, etc.)
- Technical error detail (stack traces, error codes) is logged internally and never surfaced to customers
- Audit log entries are immutable — they cannot be edited or deleted by any user, including admins
- Log retention minimum: 90 days visible in UI; longer-term archival determined by Engineering and Compliance
- Admin-level access is sufficient authorization for schedule changes in v1 (4-eyes TBD pending Compliance confirmation)
- The Catalog home page uses a **single combined Status column** — not separate Version and Run Status columns. This column merges version state (Draft/Active/Archived) and pipeline run state (Pending/In Progress/Complete/Failed) into a single user-facing label using the seven-label system defined in LA12
- **Access levels:** Both the Runs view and the Change Log are accessible to all users in v1. Access controls may be refined in the future as role-based permissions mature.
- AI-assisted configuration changes are governed by the same SOC 1 6.8 logging requirements as human-initiated changes. The AI system is recorded as a provenance marker; the human who accepted the AI suggestion is the authorizing actor.

**Open Items to Confirm**
- Does SOC 1 6.18 require 4-eyes approval for schedule changes, or is admin self-authorization sufficient?
- What is the required log retention period — 90 days? 1 year? Longer?
- Should customers have a log export capability (CSV download)?
- Is a cross-model activity log (all runs across all models) required for v1, or is per-model Logs tab sufficient?

---

## 🗺️ Scope

### 🚗 In Scope
- Job log for all model runs (scheduled + manual + API-triggered) — all fields defined in requirements
- Audit log for all configuration changes: user access, integration setup, model configuration, field mappings, schedule configuration, data relationships (SOC 1 6.8)
- **AI-assisted change attribution:** AI-generated changes — including field mapping suggestions, mapping rule generation, and API connector setup — carry explicit provenance in the audit log, identifying the AI system and the human who reviewed and accepted the change
- **Model-level Logs tab**: Runs view (run history, 90-day minimum) + Change Log view (version publishes, field mapping edits, source dataset links)
- **Connector-level Logs tab**: Runs view (all models, filterable) + Change Log view (schedule changes, OAuth events, file definition events, connection events)
- **Global Logs section** (L1 tab in Data Studio):
  - **Runs view** (default): all runs across all connectors/models, filterable
  - **Change Log view**: summary-level events across all connectors/models, with navigation links to detail
- Partial run inline expansion: count of skipped records + plain-language explanation inline in the run row (v1 — see LA7 / LA8 note)
- Replaced/superseded runs: hidden by default, revealed via "Show replaced runs" toggle
- **Catalog status column**: single combined Status column on Catalog home page — seven user-facing labels (Current, Processing, Loading Historical Data, Long Running, Processing Failed, Draft, Archived)
- **"Show archived" toggle** on Catalog home page — archived models hidden by default
- Internal job log emission to monitoring system
- Log retention: minimum 90 days

### 🚦 Out of Scope (v1)
- **Customer-facing audit log export (CSV download)** — visible in prototype as directional signal only; engineering must not build from prototype. High-value for enterprise customers but deferred to a future phase.
- **Programmatic run log access (API / webhook)** — future iteration; see [prd-programmatic-run-log-access.md](prd-programmatic-run-log-access.md).
- **Global Health view** (30-day status timelines, overall status banner, per-connector cards, recent incidents feed) — future consideration; not validated for Q3. Global Logs section ships with Runs + Change Log only.
- **4-eyes approval flow for schedule changes** — future story pending Compliance confirmation on OQ-1; see LA11. Logging of schedule changes is covered by LA2.
- Log search/filter within the Change Log feed beyond connector/model filter
- "View skipped records" navigation to a separate data grid — v1 is inline expansion only (see LA7/LA8 note)

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
| LA6 | Global health/status dashboard | Future consideration — not Q3 |
| LA7 | Global Runs view | High |
| LA8 | Global Change Log | High |
| LA9 | Replaced/superseded runs | Medium |
| LA10 | Internal monitoring emission | High |
| LA11 | Schedule change approval workflow | Future — pending Compliance confirmation on OQ-1 |
| LA12 | Catalog status column | High |
| LA13 | AI-assisted change attribution | High |

---

### LA1 — Job Log for All Model Runs

**User Story:** As an engineer or audit administrator, I can access a complete log of every data model run so that I can audit job execution and diagnose failures.

**Importance:** High

**Job log — what must be captured per run:**

| What must be captured | Notes |
|---|---|
| Unique run identifier | |
| Which model ran | |
| What triggered the run | Scheduled / manual / API / event (e.g. SFTP file drop, Fivetran sync — see Eventing PRD) |
| Who or what triggered it | User name for manual; calling system for API; system for scheduled; source connection name for event |
| Which schedule triggered it | If applicable |
| When the run started | UTC |
| When the run ended | UTC; null if still in progress |
| How long the run took | |
| Run outcome | Success / partial / failed (retrying) / failed (max retries reached) / pending / skipped |
| Whether a failure is transient or permanent | Transient = self-healing, system will retry; permanent = requires remediation, no further retries |
| How many retries have been attempted | And what the configured retry limit is |
| Records processed, skipped, and failed | Counts for each |
| User-facing error summary | Plain language; surfaced to customer on failure |
| A reference ID surfaceable to the user | When the root cause is unknown, the user must be shown a reference ID (e.g. run ID, upload ID) they can provide to support — allows engineering to locate the relevant logs without exposing internal detail |
| Internal technical error detail | Stack trace / error code; never surfaced to customer |

**Acceptance Criteria:**

**AC-LA1-01 — Job log entry created for every run**
```
Given any model run is triggered (scheduled, manual, or API)
When the run starts
Then a job log entry is created capturing: the run identifier, which model ran, what triggered it, who or what initiated it, and the start time
```

**AC-LA1-02 — Job log entry completed on run finish**
```
Given a model run completes (success, failure, or partial)
When the run finishes
Then the job log entry is updated with: end time, duration, outcome, record counts (processed / skipped / failed), user-facing error summary, and internal error detail
```

**AC-LA1-03 — Internal error detail not exposed to customer**
```
Given a run fails and technical error detail is logged internally
When an admin views the run history in the UI
Then they see only the plain-language error summary
And the internal technical detail is not visible in the customer-facing interface
```

**AC-LA1-04 — Unknown failures surface a reference ID**
```
Given a run fails and the root cause cannot be determined
When the admin views the failure in the UI
Then the error message includes a reference ID they can provide to support
And that reference ID maps to the run record in the internal log
```

---

### LA2 — Configuration Change Audit Log

**User Story:** As an audit administrator, I can access an audit log of all Data Studio configuration changes so that I can demonstrate compliance with SOC 1 6.8 and 6.18.

**Importance:** High

**Covered change categories:**
- User access / permissions
- Integration / connection setup and changes
- Model configuration (create, publish, archive, update)
- Field mappings (add, update, delete) — including AI-suggested mappings accepted by a user
- Mapping rules (add, update, delete) — including AI-generated rules accepted by a user
- API connector configuration — including AI-assisted setup where AI reads documentation and configures the connector on behalf of the user
- Schedule configuration (create, update, enable, disable, delete)
- Data relationships (join key add, update, remove)
- Sensitivity flag changes (e.g., column marked or unmarked as sensitive)

**Audit log — what must be captured per entry:**

| What must be captured | Notes |
|---|---|
| Unique entry identifier | |
| Whether the change was human-initiated or AI-assisted | Drives attribution display and AI provenance capture |
| Who made or approved the change | Display name / email of the human actor |
| AI provenance detail | Only when AI-assisted — see LA13 |
| When the change occurred | UTC |
| What category of change it was | e.g. field mapping update, sensitivity flag change, schedule update |
| What object was affected | Model, connector, schedule, field mapping, etc. — with its identifier |
| The state before the change | Sufficient detail to reconstruct what changed |
| The state after the change | Sufficient detail to reconstruct what changed |

**Acceptance Criteria:**

**AC-LA2-01 — Audit log entry on configuration change**
```
Given any admin performs a configuration change in a covered category
When the change is saved
Then an immutable audit log entry is created capturing: who made the change, when, what category of change it was, what object was affected, and the before/after state
```

**⚠️ Pre-Q3 Engineering Blocker — CLIENT_USER Placeholder:**
Production currently displays "CLIENT_USER" as the actor in audit log entries and version history. This is a known engineering placeholder. For SOC 1 compliance, the audit log is only meaningful if the actor field resolves to a real user's display name or email address. This is a **pre-Q3 engineering fix and a compliance blocker** — not a nice-to-have. The audit log cannot satisfy SOC 1 6.8 or 6.18 while this placeholder is present. Engineering must resolve this before the Q3 compliance deadline. This is not an AC that can be deferred; it gates everything else in LA2.

**AC-LA2-02 — Audit log covers requested time range**
```
Given an audit administrator views the configuration change log for a specified time range
When the view loads
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

**AC-LA2-05 — AI-assisted changes carry full provenance**
```
Given a user accepts an AI-suggested field mapping or mapping rule change
When the change is saved
Then the audit log entry is marked as AI-assisted
And the entry captures: which AI feature generated it, a reference to the specific suggestion, who approved it, and when approval occurred
And the human approver is recorded as the authorizing actor
```

---

### LA3 — Model-Level Logs Tab — Runs View

**User Story:** As an admin, I can view the run history for a model from the Logs tab so that I can verify data was collected and diagnose failures without contacting support.

**Importance:** High

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
⚠️ **The Re-run action is pending engineering confirmation for Q3 (see OQ-12).** If not confirmed, the expanded failed run shows the error message only — the Re-run action is deferred and this AC is updated accordingly.

**AC-LA3-04 — In-progress run visibility**
```
Given a run is currently in progress
When I view the Runs tab
Then the in-progress run appears at the top with status = In Progress and a pipeline stage indicator (Ingesting → Transforming → Loading)
```

**AC-LA3-05 — Partial run shows inline skipped record summary**
```
Given a run completed with status = Partial (some records processed, some skipped)
When I view the run entry
Then the entry shows: records processed count, skipped count, and a plain-language inline explanation of why records were skipped
And there is no separate navigation to a data grid for skipped records in v1
```

---

### LA4 — Model-Level Logs Tab — Change Log View

**User Story:** As an admin or audit administrator, I can view a Change Log for a model from the Logs tab so that I can see what configuration changes were made, when, and by whom.

**Importance:** High

**Events captured in the model Change Log:**

| Event | Example description |
|---|---|
| Model version published | "Published v3 — effective 2026-01-01. 4 prior runs reprocessed." |
| Draft created | "Draft created" |
| Field mapping edited | "Field mapping updated: GL Account → Account Code (was: GL Code)" |
| Field mapping edited (AI-assisted) | "Field mapping updated: GL Account → Account Code (was: GL Code) · AI-suggested, accepted by Alex Kearns" |
| Mapping rule added (AI-generated) | "Mapping rule added: [rule description] · AI-generated, accepted by Alex Kearns" |
| Source dataset linked | "Source dataset linked: QuickBooks — Trial Balance" |
| Model created | "Model created" |
| Sensitivity flag changed | "Sensitivity flag added: BALANCE column marked as sensitive" |
| Sensitivity flag changed | "Sensitivity flag removed: VENDOR_CODE column unmarked as sensitive" |

**Notes on sensitivity flag events:** Sensitivity flag changes are configuration changes with direct financial data implications and are covered by SOC 1 6.8. They must appear in the Change Log explicitly — they are not subsumed by generic "field mapping edits." Field names in Change Log entries are metadata, not data values; no masking is required.

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
Then I see entries for: version publishes, draft creation, field mapping edits, mapping rule edits, source dataset links, model creation, and sensitivity flag changes
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

**AC-LA4-06 — Sensitivity flag changes appear as named events**
```
Given an admin added or removed a sensitivity flag on a column
When I view the model Change Log
Then a distinct entry appears for that event (not grouped under "field mapping edits")
And the entry names the column and whether the flag was added or removed
```

**AC-LA4-07 — AI-assisted entries show visual indicator and approver**
```
Given a Change Log entry originated from an AI-suggested or AI-generated change
When I view that entry in the Change Log
Then the entry displays an "AI-suggested" or "AI-generated" indicator
And the actor shown is the human who accepted the change
And the entry does not appear identical to a manually-authored change
```

---

### LA5 — Connector-Level Logs Tab — Runs and Change Log

**User Story:** As an admin, I can view run history and configuration changes for a connector from the connector's Logs tab so that I can see aggregated run activity across all models and audit connector-level configuration events.

**Importance:** High

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
| Connection configured (AI-assisted) | "Connection configured (AI-assisted) — reviewed and accepted by Alex Kearns" |

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

### LA6 — Global Health / Status Dashboard *(Future Consideration — Not Q3)*

A global Health view — showing per-connector run status timelines, an overall health banner, and a recent incidents feed — is a future direction worth exploring but is not validated or scoped for Q3. The global Logs section ships in Q3 with Runs and Change Log only (see LA7, LA8). If a Health view is eventually built, it would likely become the default tab in the global Logs section, with Runs and Change Log accessible alongside it.

---

### LA7 — Global Runs View

**User Story:** As an admin or audit administrator, I can view all model runs across all connectors from the global Runs view so that I can audit pipeline activity at the tenant level.

**Importance:** High

**v1 behavior — partial runs and skipped records:** When a run completes with status = Partial, the run row shows the skipped record count inline with a plain-language explanation (e.g., "33 records skipped — missing vendor ID"). There is no "View skipped records" action that navigates to a separate data grid in v1. The fuller entity mapping gap insight feature (actionable links, per-value resolution paths) is post-Q3 — see Future Considerations.

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

**AC-LA7-03 — Partial run shows inline skipped summary**
```
Given a run has status = Partial
When I view that run entry in the global Runs view
Then the entry shows the skipped record count and a plain-language reason inline
And there is no navigation to a separate data grid for skipped records
```

**AC-LA7-04 — Global Runs is the default view**
```
Given I navigate to the global Logs section
When the page loads
Then "Runs" is selected by default in the toggle
And the Runs view is displayed (not Health)
```

---

### LA8 — Global Change Log

**User Story:** As a audit administrator, I can view a summary-level Change Log across all connectors and models so that I can audit significant configuration events at the tenant level and navigate to detailed records where needed.

**Importance:** High

**Design principle: global = summary only.** The global Change Log surfaces *what happened* — not the detailed before/after values. Detailed change information (e.g., which specific fields were remapped, what the exact schedule change was) lives at the model or connector level. Each global entry provides a navigation link to the relevant model or connector Change Log for full detail.

**AI-assisted changes at the global level:** When a change originated from an AI-assisted interaction, the global Change Log entry includes an AI indicator alongside the standard summary description. Clicking through to the model-level Change Log surfaces the full actor attribution and approver detail.

**Example global Change Log entries:**

| Event | Example description |
|---|---|
| Model version published | "Published v3 — Trial Balance [QuickBooks chip] [navigate →]" |
| Schedule updated | "Schedule updated — QuickBooks [connector chip] [navigate →]" |
| File definition added | "New file definition added — Intacct [connector chip] [navigate →]" |
| Connection created | "Connection created — NetSuite [connector chip] [navigate →]" |
| OAuth re-authorization | "OAuth re-authorized — QuickBooks [connector chip] [navigate →]" |
| Field mapping updated (AI-assisted) | "Field mapping updated (AI-assisted) — Trial Balance [QuickBooks chip] [navigate →]" |

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

**AC-LA8-05 — AI-assisted entries show indicator at summary level**
```
Given a configuration change in the global Change Log originated from an AI-assisted interaction
When I view that entry
Then the entry includes an AI-assisted indicator in the description
And clicking through to the model/connector Change Log shows the full approver attribution
```

---

### LA9 — Replaced / Superseded Runs

**User Story:** As an admin, I can understand when a historical run was superseded by a backdated version publish so that I can distinguish between the run that originally executed and the reprocessed result that replaced it.

**Importance:** Medium

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

**Note:** Engineering determines the monitoring stack (Datadog, CloudWatch, etc.). This requirement defines the data contract — what must be emitted, not how.

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
Then the internal technical error detail (stack trace) is included in the emitted event
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

### LA11 — Schedule Change Approval Workflow *(Future — Pending Compliance Confirmation)*

**Logging of schedule changes is already covered by LA2** — every schedule create, update, enable, disable, and delete is recorded in the audit log with actor, timestamp, and before/after state, satisfying the traceability requirement under SOC 1 6.18.

Whether SOC 1 6.18 additionally requires a 4-eyes approval gate — where a schedule change must be reviewed and approved by a second authorized person before taking effect — is an open question pending confirmation from Compliance (see OQ-1). If 4-eyes is required, the approval workflow (pending state, approver review, approve/reject with audit log entry) will be designed and scoped as a separate story. Engineering must not build toward an approval workflow until OQ-1 is resolved.

---

### LA12 — Catalog Status Column

**User Story:** As an admin, I can see a single Status column on the Catalog home page that reflects both the version state and pipeline run state of each model so that I can assess model health at a glance without navigating into each model.

**Importance:** High

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

### LA13 — AI-Assisted Change Attribution

**User Story:** As an audit administrator, I can distinguish AI-generated configuration changes from human-initiated changes in the audit log so that I can demonstrate the human authorization chain for every configuration change affecting financial data.

**Scope note:** AI-assisted changes are not limited to field mapping. This story covers any area of Data Studio where AI may act on behalf of a user — currently including field mapping suggestions, mapping rule generation, and API connection setup (where AI reads documentation and configures the connection). The attribution model applies consistently across all of these.

**Importance:** High

**AI provenance — what must be captured when a change is AI-assisted:**

| What must be captured | Notes |
|---|---|
| Which AI feature generated the suggestion | e.g. field mapping AI, mapping rule AI |
| A unique reference to the specific suggestion that was accepted | Supports audit reproducibility |
| Which version of the AI feature was active at the time | Supports audit reproducibility |
| Who accepted / approved the suggestion | Display name / email |
| When the approval occurred | UTC |

**Change Log display — AI-assisted entries:**
- Show an "AI-suggested" or "AI-generated" chip/badge on the entry
- Actor line reads: "Accepted by [human name]" (not "AI")
- Tooltip or expansion reveals AI system details for compliance audit purposes
- The human approver is always the primary displayed actor — AI is provenance, not actor

**Acceptance Criteria:**

**AC-LA13-01 — AI-assisted changes are flagged in the audit log**
```
Given an admin accepts an AI-suggested field mapping change
When the change is saved
Then the audit log entry is marked as AI-assisted
And the entry captures: which AI feature generated it, a unique reference to that suggestion, which version of the AI feature was active, who approved it, and when
```

**AC-LA13-02 — Human approver is the displayed actor**
```
Given I view a Change Log entry for an AI-assisted change
When I read the entry
Then the actor shown is the human who accepted the change (not "AI" or a system identifier)
And an "AI-suggested" indicator is visible on the entry
```

**AC-LA13-03 — AI provenance detail accessible for audit**
```
Given I am an audit administrator reviewing an AI-assisted Change Log entry
When I expand or inspect the entry
Then I can see which AI feature generated the suggestion, a reference to that specific suggestion, and the approver name and approval time
```

**AC-LA13-04 — Rejected AI suggestions are not logged**
```
Given AI suggests a field mapping change
And the admin dismisses or rejects the suggestion (does not accept it)
When the suggestion is discarded
Then no audit log entry is created for that suggestion
```

**AC-LA13-05 — All covered change categories support AI attribution**
```
Given any configuration change covered by LA2 can be AI-assisted
When such a change is made via AI suggestion
Then the AI attribution mechanism applies consistently across all change types
Regardless of whether it is a field mapping, mapping rule, or other covered change type
```

---

## ▶️ User Flow Reference

Logging applies throughout the Data Studio user flow:
- All configuration steps generate audit log entries (model setup, field mapping, schedule config, AI-assisted changes)
- All run executions generate job log entries
- Customer-facing visibility: Logs tab on model detail page (post-publish)
- Catalog home page status column surfaces combined version + run state across all models (LA12)

(Link to full user flow document — assign)

---

## 🎨 User Interaction & Design

**Prototype reference:** Three HTML prototypes have been built to validate the interaction model and inform these requirements:
- `playspace/data-studio-logs/model-logs.html` — Model-level Logs tab (Runs + Change Log toggle)
- `playspace/data-studio-logs/connector-logs.html` — Connector-level Logs tab (Runs + Change Log toggle)
- `playspace/data-studio-logs/global-health.html` — Global Logs section (Health / Runs / Change Log three-way toggle; note: Health tab is post-Q3, Q3 ships Runs + Change Log only)
- `playspace/data-studio-logs/logs-prototype.html` — Updated consolidated prototype

**Resolved design decisions (from prototype review):**
- Schedule change history lives in the **connector-level Change Log** (not the model Logs tab or the Schedule section)
- The Logs tab uses a **Runs / Change Log toggle** — they are separate views, not combined
- Failed run rows have a red left-border indicator and expand to show error detail + Re-run action
- In-progress runs show animated pipeline stage indicator (Ingesting → Transforming → Loading)
- The global view defaults to the **Runs** view in Q3 (Health tab is post-Q3)
- Partial runs show skipped record count + explanation inline; no data grid navigation in v1
- AI-assisted Change Log entries carry a visual indicator distinguishing them from human-initiated entries

**Open UX questions (for Natasha Clark):**
- Pagination vs. infinite scroll for run history tables
- Exact visual treatment for connector chip colors (established in prototype: QBO=green, Intacct=blue, Salesforce=purple, NetSuite=orange — confirm with design)
- Navigation target for global Change Log drill-down links: full page nav to model/connector, or side panel?
- Mobile/narrow viewport behavior (if applicable)
- Visual treatment for AI-assisted indicator in Change Log entries: badge, icon, or inline text?
- Does the AI provenance detail expand inline or require a separate panel?

---

## ✏️ UI Changes

**Model detail page — Logs tab:**
- Runs / Change Log segmented toggle
- Runs view: run history table (date/time, trigger type, duration, status), failed run expansion with error + Re-run, in-progress run with pipeline stage indicator, partial run inline skipped summary
- Change Log view: chronological activity feed (version publishes, field mapping edits, mapping rule edits, sensitivity flag changes, source dataset links, draft/model creation events, AI-assisted change entries with indicator)
- "Show replaced runs" toggle (hidden by default; revealed when superseded runs exist)

**Connector detail page — Logs tab (new):**
- Runs / Change Log segmented toggle
- Runs view: cross-model run table with Model column (color chip), Model filter dropdown
- Change Log view: connector-level events (schedule, OAuth, file definitions, connection lifecycle)

**Global Data Studio — Logs section (Q3, Runs + Change Log only):**
- Runs / Change Log two-way toggle (Health tab deferred — no Health tab in Q3 build)
- Runs view (default): all runs table with Connector + Model columns, both filterable; partial run inline skipped summary
- Change Log view: summary-level event feed with connector/model chips, navigation links to detail, AI-assisted indicator on applicable entries

**Catalog home page — Status column:**
- Single combined "Status" column replaces separate Version + Run Status columns
- Seven labels: Current · Processing · Loading Historical Data · Long Running · Processing Failed · Draft · Archived
- Archived models hidden by default; "Show archived" toggle reveals them

---

## 😎 Future Considerations

- **Customer-facing audit log export:** Raw CSV download of configuration change history for compliance and legal purposes — high value for enterprise customers. Out of scope v1.
- **Global Health view:** Per-connector 30-day status timelines, overall status banner, expandable model sub-rows, recent incidents feed. Concept not yet validated; deferred post-Q3. When shipped, the global Logs toggle expands to Health / Runs / Change Log and Health becomes the default. The trigger for that default change must be defined in the Health PRD.
- **Entity mapping gap insights:** When a run completes with skipped records due to unmapped entity values, this is a configuration health signal — not an error. The post-Q3 feature surfaces this as a distinct call-out on successful/partial runs: "Run complete — N records processed, M excluded (unmapped entities)." The actionable link reads "Review unmapped entities" and navigates directly to entity mapping configuration with the unmatched values pre-surfaced. Resolution paths: (1) Map it — add the entity mapping, auto-resolves on next run; (2) Ignore specific values — per-value suppression list, re-fires for new unknowns only; (3) Suppress all — global off-switch. This feature does NOT live in the error/failure class and does NOT live in the Change Log. It belongs in its own insight category. Named here so it has a clear home when the Error Patterns PRD is built out.
- **4-eyes approval for schedule changes:** Pending Compliance confirmation on SOC 1 6.18 interpretation.
- **Log search and filter:** Ability to filter run history by status, trigger type, or date range within the UI.
- **Schema change notifications:** When a source file's schema changes (new column added, column type changed, column removed), admins should be proactively notified with appropriate severity — warning for backwards-compatible additions, breaking error for type changes or removals. Two-part follow-up action: update the source schema definition, then create a new model version to incorporate the change. This belongs in the Error Patterns PRD and the Schema Versioning gap (IDEA-2487) — flagged here because it surfaced in the same Support Engineering conversation as the run log API.
- **Role-based log access:** As role-based permissions mature, it may make sense to differentiate access to the Change Log vs. the Runs view. Both are open to all users in v1.

---

## ❓ Open Questions

| # | Question | Owner | Status | Answer |
|---|---|---|---|---|
| OQ-1 | Does SOC 1 6.18 require 4-eyes approval for schedule changes? | Alex K / Vicky (Compliance) | Open | |
| OQ-2 | What is the required log retention period? | Alex K / Vicky / Engineering | Open | |
| OQ-3 | Should customers have a log export capability (CSV)? | Alex K | Open | |
| OQ-4 | Is a cross-connector/cross-model Runs view required for v1? | Alex K / Natasha | Resolved — global Runs view (LA7) is in scope | |
| OQ-5 | What is the SLA threshold that triggers an internal engineering alert? | Engineering | Open | |
| OQ-6 | What is the navigation target for global Change Log drill-down links? Full page nav or side panel? | Alex K / Natasha | Open | |
| OQ-7 | Should the global Change Log support date range filtering in v1? | Alex K | Open | |
| OQ-8 | Should status labels have distinct icon or color treatments in addition to text labels, or text-only? | Natasha | Open | |
| OQ-9 | What is the duration threshold that triggers "Long Running" status? | Engineering / Alex K | Open | |
| OQ-10 | What is the visual treatment for AI-assisted indicator in the Change Log — badge, icon, or inline text? | Natasha | Open | |
| OQ-11 | Does AI provenance detail expand inline in the Change Log, or require a separate detail panel? | Alex K / Natasha | Open | |
| OQ-NEW | When the Health view is eventually built, does the global section default change from Runs to Health? Define the trigger. | PM | Future | |
| OQ-12 | Is in-app re-run (triggering a new run from the Logs tab after a failure) supported in Q3? AC-LA3-03 includes a Re-run action contingent on this being confirmed. Current expectation: likely not Q3, but pursuing with engineering. If not confirmed, AC-LA3-03 is reduced to error message display only. | Alex K / Engineering | Open — likely not Q3 | |

---

## 🚫 Gaps

| # | Gap | Impact | Proposed Resolution |
|---|---|---|---|
| G1 | 4-eyes approval for schedule changes | Medium | Logging of schedule changes covered by LA2. Approval workflow (LA11) is a separate future story — gated on OQ-1 (Compliance confirmation). Engineering must not build the approval workflow until OQ-1 is resolved. |
| G2 | Customer-facing audit log export | Medium | Deferred to future iteration; add to backlog |
| G3 | Cross-connector/model log aggregation | Resolved | Global Runs view (LA7) addresses this — in scope |
| G4 | Log search and filter in UI | Low | Deferred; connector/model filter in global views is sufficient for v1 |
| G5 | Drill-down navigation target from global Change Log | Medium | Design decision pending (OQ-6) — full page nav vs. side panel |
| G6 | Status label precedence rules not yet implemented | Low | Defined in LA12 Notes — single status per row, precedence order documented |
| G7 | "Long Running" duration threshold not defined | Medium | Engineering needs to define the threshold before LA12 can be fully implemented; see OQ-9 |
| G8 | AI attribution visual design not defined | Medium | UX open questions OQ-10 and OQ-11; Natasha to resolve before engineering implementation |
| G9 | CLIENT_USER placeholder — pre-Q3 blocker | **High / Blocking** | Engineering must resolve before Q3 compliance deadline. Audit log cannot satisfy SOC 1 6.8 / 6.18 while this placeholder is present. |
| G10 | Programmatic run log access (API / webhook) | **High** | Future iteration — depends on core run log shipping first. See [prd-programmatic-run-log-access.md](prd-programmatic-run-log-access.md). Flagged as critical by Support Engineering (Jason Smith, May 2026); recurring question in enterprise security reviews. |

---

## 📚 References

### Related Sub-PRDs
- [Scheduling](prd-scheduling.md)
- [On-demand Refresh](prd-on-demand-refresh.md)
- [Customer-Facing Logging Adjustments](prd-customer-facing-logging-q3.md)
- [Programmatic Run Log Access (Future)](prd-programmatic-run-log-access.md)

### Design Resources
- Figma: Lineage Product — https://www.figma.com/design/pF3J27wNhb7TRnCmmJGrB9/Lineage---Product?node-id=1-2

### Engineering References
- SOC 1 controls 6.1, 6.8, 6.18 — sourced from Vicky (Compliance) via Steve Raedar
- Target: operating effectively by 2026-09-30
