# Data Studio: Platform Features — Scheduling (DRAFT)

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
| Depends on | Model Creation & Source Config (IDEA-2412) — model must be Published before scheduling applies; Connections — source dataset configuration must exist |
| Related sub-PRDs | [On-demand Refresh](prd-on-demand-refresh.md) · [Logging & Audit](prd-logging-audit.md) · [Error Patterns & Handling](prd-error-patterns.md) |

---

## 🎯 Objective

This PRD defines the Scheduling capability for Data Studio — the ability for admins to configure time-based automated data runs for published models. It covers schedule configuration, enable/disable controls, default sync frequency for API and Fivetran connections, run visibility, failure notifications, and the audit trail required for SOC 1 compliance.

This PRD does NOT cover: on-demand (manual) run triggers (see On-demand Refresh PRD), event-based triggers such as SAP job completion signals, schedule dependency chains across models, or email/Slack notifications.

The primary users are Data Studio admins who configure and manage data models.

---

## 🔤 Definitions

For a complete glossary of terms used across this series, see the shared [Data Studio: Definitions & Terms](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869099) page.

---

## 🏅 Why This Is Important

Data runs in Data Studio are currently triggered manually by engineering on the back end — there is no admin-facing scheduling capability in the product. The one exception is SFTP push connections, where an inbound file delivery may trigger eventing that initiates a run. All other data refreshes depend on an engineering action, making the data collection layer entirely outside the customer's control and disconnected from the accounting close cycle.

This is a fundamental gap. Finance teams rely on timely, accurate data to execute the close — but today they have no control over when that data is collected. Scheduling puts this control in the hands of the admin, enabling reliable automated data collection without engineering involvement.

---

## 🔐 Value Unlocked

Once delivered, admins can configure a schedule once and trust that data is collected automatically — every day, every close cycle, without manual intervention or engineering support. The accounting team opens their workflows with fresh data as a baseline, not as a best-effort outcome. For EMEA enterprise prospects, scheduling satisfies a formal commitment requirement that is currently blocking deal closures.

---

## 🗝️ Key Examples

- **Example 1:** A finance team closes the books monthly. Their admin configures a nightly schedule (11 PM daily) for the General Ledger model so accounting team members have fresh data when they start close tasks each morning — no engineering ticket required.
- **Example 2:** An enterprise prospect in Germany (Enemotics, ~€500K ARR) has issued a formal written commitment requirement for "the ability to call SAP from the application, trigger a job, run a report" by H2 2027. Scheduling is the capability that satisfies this requirement.
- **Example 3:** During an active close, source system volume spikes. An admin updates the model's schedule from nightly to every 4 hours to keep data current. The change takes effect on the next cycle and is logged in the audit trail — no engineering involvement.

---

## 💡 Key Benefits

- Admins configure data collection once; it runs automatically every close cycle
- Accounting teams start close workflows with data they can trust is current
- Removes the scheduling objection for EMEA enterprise deals — faster sales, fewer DQs and escalations (per Josh Lewis, Sr. Sales Manager EMEA)
- Satisfies SOC 1 6.18 compliance requirements for scheduled job change control
- Default 24-hour sync frequency for API and Fivetran connections provides an immediate baseline before custom scheduling is configured

---

## ✅ Use Cases

| # | Persona | Scenario | Expected Outcome |
|---|---|---|---|
| 1 | Admin | Configures a nightly schedule on a published model so data refreshes automatically before the team's workday starts | Schedule fires at the configured time; model runs without manual intervention |
| 2 | Admin | Needs to pause a schedule during source system maintenance | Disables the schedule; it is preserved but does not fire until re-enabled |
| 3 | Admin | Discovers a large batch of transactions was posted after the last sync and updates the schedule frequency for the remainder of close | Schedule updates on next cycle; change is logged in audit trail |
| 4 | Admin | Wants to verify a connection is syncing on the expected cadence | Views current schedule, enabled/disabled state, and next scheduled run time on the model detail page |
| 5 | Compliance Administrator | Auditor requests a record of all schedule configuration changes for the past 90 days | Audit log provides actor, timestamp, action, and before/after state for every schedule change |

---

## 📊 Success Metrics

| Goal | Metric | Baseline | Target |
|---|---|---|---|
| Reduce engineering-triggered runs | % of data runs triggered by scheduled automation vs. engineering action | 0% | TBD |
| Schedule reliability | Scheduled run success rate | N/A | >95% |
| Admin adoption | % of published models with a schedule configured | 0% | TBD |
| Compliance readiness | SOC 1 6.18 audit findings related to schedule change control | N/A | 0 findings |

---

## 🤔 Assumptions

**Established**
- Scheduling is configured at the model level, not the connection level
- Schedules use UTC for system execution; UI displays in the admin's local timezone
- The initial release covers time-based schedules only; event-based triggers (e.g., SAP job completion) are a future iteration
- Scheduling is an admin-only capability
- Failed runs do not auto-retry in v1; on-demand re-run covers the recovery path
- A model must be in Published state to have a schedule configured
- Default sync frequency for API and Fivetran connections is 24 hours; this is fixed in v1 and not configurable per connection

**Open Items to Confirm**
- Does the Enemotics SAP requirement need event-based (job completion) or time-based (scheduled poll) triggering? Needs clarification before SAP is scoped
- Does SOC 1 6.18 require a 4-eyes approval flow for schedule changes, or is admin-level access sufficient for self-authorization?
- If a scheduled run is still in progress when the next schedule fires, does it queue or skip?
- What is the maximum schedule frequency floor (e.g., no more frequent than every 15 minutes)?

---

## 🌟 Milestones

| Milestone | Owner | Target Date |
|---|---|---|
| Phase 1: Default 24-hour sync for API and Fivetran connections | (assign) | TBD |
| Phase 2: Admin schedule configuration UI (daily, weekly, custom cron) | (assign) | TBD |
| Phase 3: Failure notifications + audit log | (assign) | TBD |
| Phase 4: SOC 1 6.18 compliance verification | Alex Kearns / Vicky | TBD — target operating by 2026-09-30 |

---

## 🗺️ Scope

### 🚗 In Scope
- Default sync frequency for API and Fivetran connections: once every 24 hours
- Configure a time-based (cron-style) schedule on a published model
- Schedule options: hourly, daily (with time-of-day), weekly (with day + time), custom cron expression
- Enable / disable a schedule without deleting it
- View current schedule configuration and next run time on the model detail page
- Run history log: timestamp, trigger type (scheduled / manual), duration, status
- In-app notification on job failure
- Audit log: all schedule create / update / delete / enable / disable actions with actor, timestamp, and before/after state (SOC 1 6.8, 6.18)

### 🚦 Out of Scope
- Configurable connection sync frequency (v1 fixed at 24 hours; flexibility is a future iteration)
- Event-based / webhook triggers (e.g., SAP job completion signals) — future iteration
- Schedule cascades (Model B runs after Model A completes)
- Email / SMS / Slack notifications — in-app only for v1
- Schedule templates or inheritance across models
- Retry logic for failed runs
- Scheduling for Draft models
- 4-eyes approval flow for schedule changes (pending Compliance confirmation)

---

## 📋 Requirements — User Stories

### Quick Reference

| # | Story | Importance |
|---|---|---|
| SC1 | Default 24-hour sync for API and Fivetran connections | High |
| SC2 | Configure a schedule on a published model | High |
| SC3 | Enable and disable a schedule | High |
| SC4 | View and edit an existing schedule | High |
| SC5 | View run history | High |
| SC6 | Failure notification | Medium |
| SC7 | Audit log for schedule changes (SOC 1 6.18) | High |

---

### SC1 — Default 24-Hour Sync Frequency

**User Story:** As an admin, I can rely on my API and Fivetran connections syncing automatically every 24 hours so that my models stay current without manual intervention.

**Importance:** High

**Details:** When an API or Fivetran connection is configured, a default sync frequency of once every 24 hours is applied automatically. This fires a data run for all published models using that connection. Admins can see the frequency in connection settings but cannot change it in v1.

**Notes:** Additional frequency flexibility (hourly, custom intervals) is explicitly deferred to a future iteration.

**Acceptance Criteria:**

**AC-SC1-01 — Default frequency applied on connection save**
```
Given I configure an API or Fivetran connection in Data Studio
When the connection is saved
Then a default sync frequency of once every 24 hours is automatically applied
```

**AC-SC1-02 — Sync fires at 24-hour cadence**
```
Given a connection has a 24-hour sync frequency
When 24 hours have elapsed since the last sync
Then a data run is triggered automatically for all published models using that connection
```

**AC-SC1-03 — Frequency visible but not editable**
```
Given I view a connection's settings
When I look at the sync frequency
Then I see "Every 24 hours" displayed and cannot modify it in v1
```

---

### SC2 — Configure a Schedule on a Published Model

**User Story:** As an admin, I can configure an automated run schedule on a published model so that data is refreshed without manual intervention.

**Importance:** High

**Details:** Admins can set a recurring schedule (hourly, daily, weekly, or custom cron) on any published model. The schedule fires runs automatically. Draft models cannot be scheduled.

**Notes:** Scheduling is admin-only. All schedule saves are logged to the audit trail.

**Acceptance Criteria:**

**AC-SC2-01 — Schedule section visible on published model**
```
Given I am an admin viewing a model in Published state
When I navigate to the model's Settings or Overview tab
Then I see a Schedule section with options to configure a recurring run schedule
```

**AC-SC2-02 — Schedule fires at configured time**
```
Given I configure a schedule with a frequency and save
When the schedule time arrives
Then a model run is triggered automatically with trigger_type = "Scheduled"
```

**AC-SC2-03 — Draft models cannot be scheduled**
```
Given I attempt to configure a schedule on a Draft model
When I access the Schedule section
Then the UI displays "Publish this model before configuring a schedule" and the save action is disabled
```

**AC-SC2-04 — Schedule creation is audit logged**
```
Given I save a new schedule
When the save completes
Then the action is recorded in the audit log with: actor, timestamp, action = "Schedule Created", and the schedule configuration
```

---

### SC3 — Enable and Disable a Schedule

**User Story:** As an admin, I can temporarily disable a schedule without deleting it so I can pause runs during source system maintenance.

**Importance:** High

**Acceptance Criteria:**

**AC-SC3-01 — Disable preserves schedule config**
```
Given a model has an active schedule configured
When I toggle the schedule to disabled
Then the schedule is preserved but no further runs are triggered until re-enabled
```

**AC-SC3-02 — Re-enable fires at next scheduled time**
```
Given a schedule is disabled
When I re-enable it
Then the next run fires at the next scheduled time, not immediately
```

**AC-SC3-03 — Toggle is audit logged**
```
Given I toggle a schedule
When the action completes
Then the change is recorded in the audit log with actor, timestamp, and action = "Schedule Enabled" or "Schedule Disabled"
```

---

### SC4 — View and Edit an Existing Schedule

**User Story:** As an admin, I can view and edit the current schedule on a model so I can adjust timing during the close period.

**Importance:** High

**Acceptance Criteria:**

**AC-SC4-01 — Current schedule is visible**
```
Given a model has a schedule configured
When I view the model's Schedule section
Then I see the current schedule (frequency, time, timezone, enabled/disabled state) and next scheduled run time
```

**AC-SC4-02 — Schedule edit takes effect at next window**
```
Given I edit an existing schedule and save
When the save completes
Then the new schedule takes effect at the next scheduled window
And the in-progress run (if any) is not interrupted
And the change is recorded in the audit log with before and after values
```

---

### SC5 — View Run History

**User Story:** As an admin, I can see a log of past runs for a model so I can verify data was collected successfully and diagnose failures.

**Importance:** High

**Acceptance Criteria:**

**AC-SC5-01 — Run history list**
```
Given I am viewing a model's Logs tab
When I open the run history
Then I see runs sorted by most recent, each showing: timestamp, trigger type, duration, and status
```

**AC-SC5-02 — Failed run detail**
```
Given a run has status = Failed
When I expand the run entry
Then I see a human-readable error message and a Re-run action
```

**AC-SC5-03 — In-progress run visibility**
```
Given a run is currently in progress
When I view the run list
Then the in-progress run is shown at the top with a spinner and elapsed time
```

---

### SC6 — Failure Notification

**User Story:** As an admin, I want to receive a notification when a scheduled run fails so I can take action before it affects the close.

**Importance:** Medium

**Acceptance Criteria:**

**AC-SC6-01 — In-app notification on failure**
```
Given a scheduled run completes with status = Failed
When the failure is recorded
Then an in-app notification is sent to all Data Studio admins with: model name, failure timestamp, and a link to the run detail
```

**AC-SC6-02 — Notification links to run detail**
```
Given I receive a failure notification
When I click through to the run detail
Then I see the error reason and a Re-run action
```

---

### SC7 — Audit Log for Schedule Changes (SOC 1 6.18)

**User Story:** As a compliance administrator, I can view an audit log of all schedule configuration changes so I can demonstrate authorized change control for SOC 1 audits.

**Importance:** High

**Acceptance Criteria:**

**AC-SC7-01 — All schedule actions are logged**
```
Given any admin performs a schedule action (create / update / enable / disable / delete)
When the action is saved
Then the following is recorded: actor, timestamp (UTC), action type, affected model, and before/after state
```

**AC-SC7-02 — Log covers requested time range**
```
Given an auditor requests a schedule change log
When the log is viewed or exported
Then it includes all schedule actions across all models for the requested time range, sorted chronologically
```

---

## ▶️ User Flow Reference

Scheduling maps to the post-publish phase of the Model Creation user flow:
- After a model is Published, the admin configures a schedule from the model detail page
- Schedule configuration → Enable → First automated run

(Link to full user flow document — assign)

---

## 🎨 User Interaction & Design

> To be completed by Natasha Clark. Key questions to resolve:
>
> - Where does the Schedule section live on the model detail page — Overview tab or a dedicated Settings tab?
> - What is the visual treatment for an enabled vs. disabled schedule?
> - How is the "next scheduled run" time displayed — relative ("in 4 hours") or absolute ("Tomorrow at 11:00 PM EST")?
> - What does the custom cron input look like — raw expression only, or with a human-readable preview?

---

## ✏️ UI Changes

- New Schedule section on the model detail page (Overview or Settings tab — design to confirm)
- Schedule configuration modal or panel (frequency picker, time selector, timezone, enable/disable toggle)
- Run history table: new Trigger column to distinguish Scheduled / Manual / API runs
- In-app notification for schedule run failures

---

## 😎 Future Considerations

- **Configurable connection sync frequency:** v1 fixes API and Fivetran at 24 hours. Future iteration allows per-connection custom intervals.
- **Event-based / SAP triggers:** The Enemotics commitment may require event-based triggering where SAP signals job completion. Deferred pending clarification on whether time-based scheduling satisfies their requirement.
- **Schedule cascades:** Running Model B automatically after Model A completes — useful for dependent data pipelines.
- **Email and Slack notifications:** In-app only for v1; email/Slack failure alerts are a high-value follow-on.
- **4-eyes approval for schedule changes:** Pending Compliance confirmation on SOC 1 6.18 interpretation.

---

## ❓ Open Questions

| # | Question | Owner | Status | Answer |
|---|---|---|---|---|
| OQ-1 | Does the Enemotics SAP requirement need event-based or time-based triggering? | Alex K / Josh Lewis | Open | |
| OQ-2 | Does SOC 1 6.18 require 4-eyes approval for schedule changes, or is admin self-authorization sufficient? | Alex K / Vicky (Compliance) | Open | |
| OQ-3 | If a scheduled run is still in progress when the next window fires, does it queue or skip? | Engineering | Open | |
| OQ-4 | What is the minimum schedule frequency allowed (floor)? | Engineering | Open | |
| OQ-5 | Where does the Schedule section live — Overview tab or Settings tab? | Natasha Clark | Open | |

---

## 🚫 Gaps

| # | Gap | Impact | Proposed Resolution |
|---|---|---|---|
| G1 | Configurable connection sync frequency | Medium | Deferred to future iteration; v1 fixed at 24 hours |
| G2 | Event-based / SAP trigger | High | Clarify with Josh Lewis whether time-based scheduling satisfies the Enemotics commitment before H2 2027 |
| G3 | Email / Slack failure notifications | Medium | In-app only for v1; add to backlog for follow-on |
| G4 | Schedule cascade / dependency chains | Low | No current customer requirement; add to future considerations |

---

## 📚 References

### Related Sub-PRDs
- [On-demand Refresh](prd-on-demand-refresh.md)
- [Logging & Audit Requirements](prd-logging-audit.md)
- [Error Patterns & Handling](prd-error-patterns.md)

### Design Resources
- Figma: Lineage Product — https://www.figma.com/design/pF3J27wNhb7TRnCmmJGrB9/Lineage---Product?node-id=1-2

### Engineering References
- SOC 1 controls: 6.1, 6.8, 6.18 (sourced from Vicky via Steve Raedar)
- Sales call context: Steve Raedar, Josh Lewis (Sr. Sales Mgr EMEA), John Phillips (GM EMEA) — March 2026
- Enemotics deal: ~€500K ARR, H2 2027 commitment deadline
