# Data Studio: Platform Features — On-demand Refresh (DRAFT)

| Field | Value |
|---|---|
| Target release | TBD |
| Epic | IDEA-2488 — Data Studio: Platform Features |
| Idea Link | https://floqast.atlassian.net/jira/polaris/projects/IDEA/ideas/view/11291632?selectedIssue=IDEA-2488 |
| Document status | DRAFT |
| Document owner | Alex Kearns |
| Designer | Natasha Clark |
| Tech lead | (assign) |
| Technical writers | (assign) |
| QA | (assign) |
| Depends on | Model Creation & Source Config (IDEA-2412) — model must be Published; Scheduling — shares run execution infrastructure |
| Related sub-PRDs | [Scheduling](prd-scheduling.md) · [Logging & Audit](prd-logging-audit.md) · [Error Patterns & Handling](prd-error-patterns.md) |

---

## 🎯 Objective

This PRD defines the On-demand Refresh capability for Data Studio — the ability to trigger a data model run immediately, outside of any configured schedule, either through the admin UI or via a programmatic internal API for downstream FloQast applications (e.g., Close).

It covers two trigger surfaces: (1) a UI-based "Run now" action for admins, and (2) an internal API contract that downstream FloQast applications can use to request a data run and be notified when it completes. Both surfaces share the same underlying run execution — only the trigger entry point differs.

This PRD does NOT cover: scheduled / time-based runs (see Scheduling PRD), external API access for non-FloQast systems, ReBAC-based permissions (admin-only in v1), or the Close-side implementation of the downstream trigger (owned by Rebecca Beasley-Cockroft).

The primary users are Data Studio admins (UI trigger) and downstream FloQast applications acting on behalf of their users (programmatic trigger).

---

## 🔤 Definitions

For a complete glossary of terms used across this series, see the shared [Data Studio: Definitions & Terms](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869099) page.

---

## 🏅 Why This Is Important

Data runs in Data Studio are currently triggered manually by engineering on the back end — there is no admin-facing trigger in the product UI and no internal API contract for downstream FloQast applications to request a data run programmatically. The one exception is SFTP push connections, where an inbound file delivery may trigger eventing that initiates a run.

This means every data refresh is either an engineering action or an infrastructure event outside the customer's control. There is no way for an admin to say "run now" when a change occurs in the source system, no way for a Close user's rec refresh to pull genuinely current data, and no way for admins to validate field mappings against live data during Model Testing.

---

## 🔐 Value Unlocked

During Model Testing, admins can trigger a live data pull to validate field mappings against real, current source data — not a stale cached sample. And Close users get reconciliation refreshes backed by up-to-date data, without knowing or caring that Data Studio is running behind the scenes.

When a model has a configured schedule (e.g., API sync every 24 hours, SFTP sync every 4 hours) but a change in the source system needs to be processed immediately, admins can trigger a run now without waiting for the next scheduled window.

---

## 🗝️ Key Examples

- **Example 1:** A Close user clicks "Refresh" on a reconciliation. Close sends an internal trigger to Data Studio for the relevant model. Data Studio executes the run, transforms the data, and notifies Close when fresh data is available — all without the user knowing Data Studio was involved.
- **Example 2:** An admin is validating field mappings during Model Testing for an API-based connection. They trigger an on-demand refresh to pull a live data sample and confirm the mappings are correct before publishing.
- **Example 3:** A model is configured to sync from an SFTP server every 4 hours, but a corrected file was just pushed to the server. An admin triggers an immediate run to process the new file now rather than waiting for the next scheduled window.

---

## 💡 Key Benefits

- Admins can get fresh data immediately when the source changes — no waiting for the next scheduled window and no engineering ticket
- Field mappings can be validated against live data during Model Testing, not stale cached responses
- Close and other downstream FQ applications can request fresh data programmatically, enabling near-real-time data availability for workflows like rec refreshes
- Establishes the internal trigger and notification contract that enables FloQast products to interoperate on a shared data layer

---

## ✅ Use Cases

| # | Persona | Scenario | Expected Outcome |
|---|---|---|---|
| 1 | Admin | Source system had a batch of transactions posted after the last sync; admin needs to process them now | Triggers "Run now" from model detail page; fresh run completes without waiting for next scheduled window |
| 2 | Close (downstream application) | Close user triggers a rec refresh; Close requests fresh data from Data Studio via internal API | Data Studio runs and notifies Close on completion; Close user sees updated data |
| 3 | Admin | In Model Testing for an API-based connection; wants to validate field mappings against real current data | Triggers on-demand refresh from Test view; live data sample pulled from source system |
| 4 | Admin | Scheduled run failed; admin resolves the connection issue and needs to recover now | Triggers re-run from the run history log; does not wait for next scheduled window |
| 5 | Admin | Just published a new model version and wants to verify it works with live data | Triggers on-demand run immediately after publish |

---

## 📊 Success Metrics

| Goal | Metric | Baseline | Target |
|---|---|---|---|
| Reduce engineering-triggered runs | % of manual data runs triggered by admins vs. engineering | 0% | TBD |
| Downstream adoption | # of downstream applications using the internal trigger API | 0 | ≥1 (Close) at launch |
| Model Testing quality | % of published models that had an on-demand refresh during Testing phase | Unknown | TBD |
| Rec refresh data freshness | Time between Close rec refresh trigger and data availability | Unknown | Under 30 seconds end-to-end (subject to external API constraints) |

---

## 🤔 Assumptions

**Established**
- On-demand runs use the same execution infrastructure as scheduled runs; only the trigger type differs
- Admin-only for UI-triggered runs in v1; ReBAC will enable finer-grained permissions in a future iteration
- The programmatic trigger is an internal API only — not a public-facing API for external systems
- A model must be in Published state to accept an on-demand trigger (exception: Model Testing — design to confirm)
- On-demand runs are logged with trigger_type = "manual" (UI) or trigger_type = "api" (programmatic)
- ReBAC is not in scope for v1
- **Target SLA: under 30 seconds** end-to-end from trigger receipt to data-available notification; subject to external API constraints (aligned with Rebecca Beasley-Cockroft's On Demand Data PRD)
- **Concurrent run queue depth: 1.** If a run is in progress and a second request arrives, it is queued. If a run is in progress AND a queued run already exists, a third request is rejected — the calling application is returned the ID of the existing queued run to monitor instead

**Open Items to Confirm**
- What constitutes "same parameters" for run deduplication — model ID alone, or endpoint set, date range, and other run config? Engineering to define
- Notification mechanism for downstream apps — push event, polling endpoint, or webhook? Engineering and downstream app teams to align
- Whether the "Run now" trigger is available during Model Testing (Draft state) or only on Published models
- ReBAC timeline and whether it affects v1 admin-only scope

---

## 🌟 Milestones

| Milestone | Owner | Target Date |
|---|---|---|
| Phase 1: Admin UI trigger ("Run now" + "Re-run") | (assign) | TBD |
| Phase 2: Internal programmatic trigger API + completion notification | (assign) | TBD |
| Phase 3: Model Testing surface (on-demand refresh in Test view) | (assign) | TBD |

---

## 🗺️ Scope

### 🚗 In Scope
- "Run now" action on a published model's detail page (admin only)
- "Re-run" action from the run history log on any completed run (success or failed)
- On-demand refresh available during Model Testing for API-based connections (design to confirm exact surface)
- Internal API endpoint for downstream FloQast applications to request a data run
- Completion notification from Data Studio to the calling application (status + timestamp)
- Concurrent run queue management: queue one request behind an active run (max queue depth: 1); reject a third request and return the queued run ID to the caller
- Run history: on-demand runs appear with trigger_type = "Manual" or "API"
- Audit log: on-demand run triggers logged (actor for UI; calling system for API)
- Historical request detection: flag full historical data pull requests as long-running, communicate to the caller that the 30-second SLA does not apply, and do not process under the standard on-demand path

### 🚦 Out of Scope
- Public external API trigger (non-FloQast systems) — future scope, related to SAP event-based triggers
- ReBAC-based permissions — admin-only in v1
- User-facing "Refresh" button inside Close or other downstream apps — Close owns its UI
- Scheduled-to-on-demand fallback logic (auto-trigger on schedule failure) — future iteration
- Queue depth beyond 1 — one request may queue behind an active run; stacking additional requests beyond that is not supported
- Fivetran-connected data sources — separate configuration path; not governed by this PRD
- Full historical data run processing — flagged and routed separately; not subject to this PRD's 30-second SLA (see historical request detection requirement below)

---

## 📋 Requirements — User Stories

### Quick Reference

| # | Story | Importance |
|---|---|---|
| OR1 | Trigger a run from the model detail page | High |
| OR2 | Re-run from run history | High |
| OR3 | On-demand refresh during Model Testing | High |
| OR4 | Downstream application triggers a run via internal API | High |
| OR5 | Completion notification to calling application | High |
| OR6 | Distinguish on-demand runs in run history | Medium |
| OR7 | Historical request detection and flagging | High |

---

### OR1 — Trigger a Run from the Model Detail Page

**User Story:** As an admin, I can trigger a data run on demand from a model's detail page so I can get fresh data immediately without waiting for the next scheduled sync.

**Importance:** High

**Details:** A "Run now" button is available on Published models. On click, a run starts immediately and appears in run history as Pending. If a run with the same parameters is already in progress, the trigger is rejected with a clear message.

**Notes:** Admin-only in v1. Button is disabled on Draft models.

**Acceptance Criteria:**

**AC-OR1-01 — Run now initiates a run**
```
Given I am an admin viewing a Published model
When I click "Run now"
Then a data run is initiated immediately
And the run appears in run history with status = Pending
```

**AC-OR1-02 — Second run queued when one is in progress**
```
Given a run is already in progress for the same model
When I click "Run now"
Then I see: "A run is in progress. Your request has been queued and will start when it completes."
And the queued run appears in run history with status = Queued
```

**AC-OR1-02b — Third run rejected when active + queued already exist**
```
Given a run is in progress AND a queued run already exists for the same model
When I click "Run now"
Then I see: "A run is already queued. Monitor the current run for updates."
And no additional run is created
```

**AC-OR1-03 — Draft models cannot be triggered**
```
Given I view a Draft model
When I look at the Run now button
Then it is disabled with a tooltip: "Publish this model before running"
```

**AC-OR1-04 — Completion triggers notification**
```
Given a run I triggered completes
When it finishes (success or failure)
Then an in-app notification is sent and run history updates to show the final status
```

---

### OR2 — Re-run from Run History

**User Story:** As an admin, I can re-run a model from its run history so I can recover quickly from a failed run.

**Importance:** High

**Details:** A "Re-run" action is available on any completed run (success or failed). Re-runs are not limited to failure recovery. The new run appears as a separate entry — the original is not overwritten.

**Acceptance Criteria:**

**AC-OR2-01 — Re-run on failed run**
```
Given a run has status = Failed in the run history
When I click "Re-run"
Then a new on-demand run is initiated and appears at the top of run history as Pending
```

**AC-OR2-02 — Re-run on successful run**
```
Given a run has status = Success in the run history
When I click "Re-run"
Then a new on-demand run is initiated
```

**AC-OR2-03 — Original run entry preserved**
```
Given I trigger a re-run
When the new run completes
Then the new run entry appears separately from the original
And the original entry is unchanged
```

---

### OR3 — On-demand Refresh During Model Testing

**User Story:** As an admin, I can trigger an on-demand data pull during Model Testing so I can validate field mappings against real, current source data before publishing.

**Importance:** High

**Details:** Available in the Test view for API-based connections. Pulls a fresh live sample rather than relying on a cached response. Allows admins to confirm mappings are correct against current source data.

**Notes:** Exact surface location in the Test view to be confirmed with design. Confirm whether this is available on Draft models or only after a first publish.

**Acceptance Criteria:**

**AC-OR3-01 — Refresh available in Model Testing**
```
Given I am in the Model Testing view for an API-based connection
When I trigger an on-demand refresh
Then a live data pull is executed against the source system
And the Test view updates to display the fresh sample
```

**AC-OR3-02 — Fresh data, not cached**
```
Given a previous test run was completed
When I trigger another on-demand refresh
Then the system fetches new data from the source system
And does not return a cached result from the previous run
```

---

### OR4 — Downstream Application Triggers a Run via Internal API

**User Story:** As a downstream FloQast application, I can trigger a Data Studio data run programmatically so that I can provide users with near-real-time data without requiring them to manually refresh in Data Studio.

**Importance:** High

**Details:** An internal API endpoint accepts trigger requests specifying model ID or endpoint set. Returns run_id and accepted/rejected status. Rejected if a duplicate run is already in progress.

**Notes:** Internal only — not exposed to external systems. Calling system identity is logged.

**Acceptance Criteria:**

**AC-OR4-01 — Valid trigger accepted**
```
Given a downstream application sends a valid trigger request to the internal API
When the request is received
Then Data Studio initiates a run
And returns: run_id and status = "accepted"
```

**AC-OR4-02 — Second trigger queued when run is in progress**
```
Given a run is already in progress for the same model
When a trigger request arrives
Then Data Studio queues the request and returns: status = "queued", run_id of the new queued run, and active_run_id of the in-progress run
```

**AC-OR4-02b — Third trigger rejected when active + queued already exist**
```
Given a run is in progress AND a queued run already exists for the same model
When a trigger request arrives
Then Data Studio returns: status = "rejected", reason = "A run is already queued", and the queued_run_id for the calling application to monitor
```

**AC-OR4-03 — Draft model rejected**
```
Given a trigger request specifies a model in Draft state
When the request is processed
Then Data Studio returns an error: "Model [ID] is not published and cannot be run"
```

---

### OR5 — Completion Notification to Calling Application

**User Story:** As a downstream FloQast application, I can receive a notification when a Data Studio run completes so that I can update my users with fresh data.

**Importance:** High

**Details:** When a run triggered via internal API completes (success or failure), Data Studio sends a completion notification to the calling application containing run_id, status, completed_at timestamp, and error summary if failed.

**Notes:** Notification mechanism (push event, webhook, polling endpoint) to be confirmed by Engineering and downstream teams.

**Acceptance Criteria:**

**AC-OR5-01 — Completion notification on success**
```
Given a run initiated via API trigger completes with status = Success
When the run finishes
Then Data Studio sends a notification to the calling application containing: run_id, status = "success", completed_at timestamp
```

**AC-OR5-02 — Completion notification on failure**
```
Given a run initiated via API trigger completes with status = Failed
When the run finishes
Then Data Studio sends a notification containing: run_id, status = "failed", completed_at timestamp, error summary
```

---

### OR6 — Distinguish On-demand Runs in Run History

**User Story:** As an admin, I can see how each run was triggered in the run history so I can understand data freshness and distinguish manual actions from automated ones.

**Importance:** Medium

**Acceptance Criteria:**

**AC-OR6-01 — Trigger type visible in run history**
```
Given I view a model's run history
When I look at the trigger column
Then each run is labeled: "Scheduled", "Manual" (UI trigger), or "API" (programmatic trigger)
```

**AC-OR6-02 — API trigger shows calling application**
```
Given a run was triggered via API by Close
When I expand that run entry
Then I see the calling application identified (e.g., "Triggered by: Close")
```

---

### OR7 — Historical Request Detection

**User Story:** As the system, I want to detect when an on-demand trigger is for a full historical data range so that I can communicate the correct SLA to the caller and not process it under the standard 30-second path.

**Importance:** High

**Details:** On-demand requests are expected to be incremental — scoped to a specific period, date range, or entity. If a request arrives without a defined scope, or with a scope that indicates a full historical pull, it must be flagged, the caller must be informed that the request is long-running, and it must not be processed under the standard on-demand SLA. The threshold for "full historical" is TBD with Engineering.

**Acceptance Criteria:**

**AC-OR7-01 — Incremental request accepted normally**
```
Given a trigger request includes a specific period or date range scope
When the request is received
Then Data Studio processes it under the standard on-demand path
And targets the under-30-second SLA
```

**AC-OR7-02 — Full historical request flagged**
```
Given a trigger request indicates a full historical data pull (threshold TBD with Engineering)
When the request is received
Then Data Studio flags the request as long-running
And returns a response communicating that the request will take significantly longer than a standard on-demand sync
And does not process it under the 30-second SLA
```

---

## ▶️ User Flow Reference

On-demand Refresh maps to multiple points in the Data Studio user flow:
- During Model Testing: on-demand refresh before publish
- Post-publish operations: "Run now" from model detail, "Re-run" from run history
- External workflow trigger: downstream application API call during Close rec refresh

(Link to full user flow document — assign)

---

## 🎨 User Interaction & Design

> To be completed by Natasha Clark. Key questions to resolve:
>
> - Where does "Run now" live on the model detail page — adjacent to the Schedule section, or in a separate action area?
> - What is the "Re-run" treatment in the run history — inline button, row hover action, or 3-dot menu?
> - How does the "Run now" button communicate state — does it change to "Running…" with a spinner, or does it disable until the run completes?
> - Where exactly in the Model Testing view does the on-demand refresh trigger appear?
> - Should API-triggered runs be surfaced differently in the run history UI (e.g., different row color or icon)?

---

## ✏️ UI Changes

- "Run now" button on the model detail page (Published models only)
- "Re-run" action in the run history table (all completed runs)
- On-demand refresh trigger in the Model Testing view (design to confirm exact surface)
- Run history Trigger column: Scheduled / Manual / API with calling application detail on expand

---

## 😎 Future Considerations

- **Extended queue depth:** v1 supports a maximum queue depth of 1 (one active + one queued). Future iteration could support deeper queuing or priority ordering for downstream applications.
- **ReBAC:** Admin-only in v1. Future ReBAC implementation will enable finer-grained permissions — e.g., allowing specific Close users to trigger refreshes directly.
- **External API trigger:** Today internal only. Future scope could expose a public trigger API for external systems (e.g., SAP event-based triggers).
- **Auto-retry on failure:** If a run fails, automatically trigger a re-run after a configurable delay. Currently deferred; on-demand re-run covers the recovery path in v1.

---

## ❓ Open Questions

| # | Question | Owner | Status | Answer |
|---|---|---|---|---|
| OQ-1 | What constitutes "same parameters" for run deduplication — model ID alone, or endpoint set, date range, etc.? | Engineering | Open | |
| OQ-2 | What is the target SLA for programmatic trigger completion? | Alex K / Rebecca / Engineering | **Resolved** | Under 30 seconds end-to-end from trigger receipt to notification; subject to external API constraints. Aligned with Rebecca Beasley-Cockroft's On Demand Data PRD. |
| OQ-3 | What is the notification mechanism for downstream apps — push event, webhook, or polling? | Engineering / Rebecca | Open | |
| OQ-4 | Is the on-demand refresh in Model Testing available on Draft models, or only after first publish? | Alex K / Natasha | Open | |
| OQ-5 | Does the Close trigger fire from a direct user action (Refresh button) or automatically from a Close workflow? | Rebecca | Open | |
| OQ-6 | What is the threshold for a "full historical" request vs. an incremental one? (e.g., date range exceeding N months, or absence of period scoping) Needed to implement OR7. | Engineering | Open | |
| OQ-7 | What is the migration path from existing fetch-on-demand behavior in wwwclose and GL-SDK? Current behavior fetches data when a user requests it. This work centralizes that pattern — backward compatibility and cutover approach need definition. | PM / Engineering / Rebecca | Open | |
| OQ-8 | Does per-endpoint sub-logging (a log entry per endpoint for multi-endpoint runs) need to be specified in this PRD, or is it fully covered by the Logging & Audit PRD? Rebecca's On Demand Data PRD requires sub-logs per endpoint. | Alex K / Logging & Audit PRD | Open | |

---

## 🚫 Gaps

| # | Gap | Impact | Proposed Resolution |
|---|---|---|---|
| G1 | ~~Target SLA undefined~~ | ~~High~~ | Resolved — under 30 seconds end-to-end; aligned with Rebecca Beasley-Cockroft's On Demand Data PRD |
| G2 | Notification mechanism unspecified | High | Engineering + downstream teams to align on push vs. webhook vs. polling before implementation |
| G3 | Queue depth beyond 1 | Low | v1 supports one active + one queued; deeper queuing deferred to future iteration |
| G4 | ReBAC / non-admin UI trigger | Medium | Admin-only in v1; Close users cannot trigger directly — Close triggers on their behalf via API |

---

## 📚 References

### Related Sub-PRDs
- [Scheduling](prd-scheduling.md)
- [Logging & Audit Requirements](prd-logging-audit.md)
- [Error Patterns & Handling](prd-error-patterns.md)

### Design Resources
- Figma: Lineage Product — https://www.figma.com/design/pF3J27wNhb7TRnCmmJGrB9/Lineage---Product?node-id=1-2

### Engineering References
- Direct API Data Platform 2.0: Data Ingestion (Rebecca Beasley-Cockroft) — https://floqast.atlassian.net/wiki/spaces/Data/pages/4490330192/Direct+API+Data+Platform+2.0+Data+Ingestion+DRAFT
- On Demand Data PRD (Rebecca Beasley-Cockroft) — https://floqast.atlassian.net/wiki/spaces/Data/pages/4491214936/On+Demand+Data — aligned on: 30-second SLA, queue-of-1 concurrency model, historical request detection, per-endpoint sub-logging
