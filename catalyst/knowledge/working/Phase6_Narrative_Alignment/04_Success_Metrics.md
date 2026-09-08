# Success Metrics: FloQast Close Rearchitecture

**FloQast Close Rearchitecture Initiative**
**Author:** Benjamin Ellis, Product Design Manager
**Date:** March 2026
**Version:** 1.0

---

## Executive Summary

This document defines the success metrics for the FloQast Close rearchitecture initiative across six dimensions: User Experience, Close Performance, AI Impact, Architecture Health, Business Impact, and Adoption. Each metric includes a definition, current baseline (or plan to establish one), target, measurement method, and reporting cadence.

These metrics serve three purposes:
1. **Validate the investment** -- Prove that the rearchitecture delivers measurable improvements
2. **Guide prioritization** -- Surface which areas need the most attention each quarter
3. **Build confidence** -- Give leadership, customers, and the team evidence of progress

---

## 1. User Experience Metrics

These metrics measure whether the rearchitecture achieves its core promise: accountants spend less time navigating and more time doing meaningful work.

### 1.1 Time-to-Next-Action

| Attribute | Detail |
|---|---|
| **Definition** | Elapsed time from login (session start) to the first meaningful task action (status change, document upload, review approval, comment, or data entry) |
| **Current Baseline (estimated)** | >2 minutes. Users must navigate folder tree, identify the correct checklist, find their assigned item, and open it before any action is possible. |
| **Target** | <30 seconds by Q4 GA launch |
| **Data Source** | Front-end analytics (event tracking). Measure timestamp delta between `session_start` event and first `task_action` event. |
| **Calculation** | Median and p95 of `(first_task_action_timestamp - session_start_timestamp)` per user per session, excluding sessions where no task action occurs. |
| **Baseline Plan** | Instrument current application in Q1 to capture this metric. Run baseline measurement for 4 weeks before any rearchitecture features ship. |
| **Reporting Cadence** | Weekly (internal dashboard), Monthly (leadership review) |

### 1.2 Task Discovery Time

| Attribute | Detail |
|---|---|
| **Definition** | Elapsed time from the moment a user initiates a search or navigation action to when they open the target task's drill-down view |
| **Current Baseline (estimated)** | 45-90 seconds. Requires navigating folder hierarchy (2-4 clicks), scanning checklist grid, identifying correct row. |
| **Target** | <10 seconds via search by Q2 (pilot), <15 seconds via browse by Q3 |
| **Data Source** | Front-end analytics. Measure from `search_initiated` or `navigation_started` to `task_drilldown_opened`. |
| **Calculation** | Median of `(task_drilldown_opened_timestamp - search_initiated_timestamp)` per search session. Segment by discovery method (search vs. browse vs. saved view). |
| **Baseline Plan** | Instrument folder navigation path in Q1. Compare against search-based discovery once available. |
| **Reporting Cadence** | Weekly |

### 1.3 Review Cycle Time

| Attribute | Detail |
|---|---|
| **Definition** | Elapsed time from a task's status changing to "ready for review" to the reviewer's sign-off (approve or request changes) |
| **Current Baseline** | To be measured. Estimated at 4-8 hours for routine tasks, 1-3 days for complex reconciliations. |
| **Target** | 30% reduction from baseline by Q4 |
| **Data Source** | Task Service event log. Measure delta between `status_changed_to_review` and `reviewer_action` events. |
| **Calculation** | Median review cycle time per task type, per entity. Exclude weekends and non-business hours. |
| **Baseline Plan** | Extract historical review timestamps from existing checklist data in Q1. Establish per-task-type baselines. |
| **Reporting Cadence** | Monthly |

### 1.4 Context Switches per Task

| Attribute | Detail |
|---|---|
| **Definition** | Number of distinct page navigations (URL changes or major view transitions) required to complete one task from start to finish |
| **Current Baseline (estimated)** | 5-8 context switches. Typical flow: folder list -> checklist grid -> item detail -> document viewer -> back to grid -> reviewer view -> sign-off. Often includes switching to Excel, ERP, or email. |
| **Target** | 2 or fewer in-app context switches by Q3 (drill-down consolidates all task context) |
| **Data Source** | Front-end analytics. Track `page_navigation` events between `task_opened` and `task_completed` for the same task. |
| **Calculation** | Median count of `page_navigation` events per task completion. Segment by task type. |
| **Baseline Plan** | Instrument current navigation flow in Q1. Track for 4 weeks. |
| **Reporting Cadence** | Monthly |

### 1.5 "5-Second Rule" Compliance

| Attribute | Detail |
|---|---|
| **Definition** | Percentage of task drill-down views where the user takes a meaningful action within 5 seconds of the view loading (indicating they could immediately understand what to do) |
| **Current Baseline** | Not currently measurable. Estimated low compliance due to information fragmentation across multiple views. |
| **Target** | 70% compliance by Q3, 85% by Q5 |
| **Data Source** | Front-end analytics. Measure time from `drilldown_loaded` to first interaction (scroll, click, or action). |
| **Calculation** | `(drilldown sessions with first_interaction < 5s) / (total drilldown sessions) * 100`. Exclude sessions where user immediately navigates away (bounce). |
| **Baseline Plan** | Establish after drill-down v1 ships in Q2. Baseline will be the initial Q2 measurement. |
| **Reporting Cadence** | Weekly |

---

## 2. Close Performance Metrics

These metrics measure whether the rearchitecture translates UX improvements into actual close process acceleration.

### 2.1 Close Duration

| Attribute | Detail |
|---|---|
| **Definition** | Calendar days from period end date to the date when all tasks for that entity/period are marked complete (books closed) |
| **Current Baseline** | Varies widely. Industry average: 6-10 business days. FloQast customers: estimated 5-8 business days. To be measured per entity. |
| **Target** | 2-day reduction from baseline by Q5 |
| **Data Source** | Task Service (new) or checklist completion timestamps (legacy). Period end date from entity configuration. |
| **Calculation** | `close_date - period_end_date` in calendar days. Report as median per entity size tier (small: <50 tasks, medium: 50-200, large: 200+). |
| **Baseline Plan** | Extract historical close duration data from existing checklist completion timestamps. Build per-entity baseline over 3 close periods in Q1. |
| **Reporting Cadence** | Monthly (per close cycle) |

### 2.2 Task Completion Rate by Day X

| Attribute | Detail |
|---|---|
| **Definition** | Percentage of tasks completed by a specific day relative to period end (e.g., Day 3, Day 5, Day 7) |
| **Current Baseline** | To be measured. Estimated: 40-50% by Day 3, 65-75% by Day 5. |
| **Target** | 85% by Day 5 for pilot customers by Q4 |
| **Data Source** | Task Service event log or legacy checklist timestamps. |
| **Calculation** | `(tasks completed by Day X) / (total tasks for period) * 100`. Segment by entity, task type, and priority. |
| **Baseline Plan** | Analyze last 6 close periods for pilot customers in Q1-Q2. |
| **Reporting Cadence** | Per close cycle (typically monthly) |

### 2.3 Bottleneck Identification Time

| Attribute | Detail |
|---|---|
| **Definition** | Time for a manager to identify the single biggest blocker in the current close process (longest overdue task, most blocked dependencies, or resource bottleneck) |
| **Current Baseline (estimated)** | 10-30 minutes. Requires reviewing multiple checklists across entities, manually cross-referencing status, and often asking team members directly. |
| **Target** | <5 seconds via close timeline view by Q4 |
| **Data Source** | Qualitative user research (timed task testing) + quantitative proxy: time from `timeline_opened` to `bottleneck_task_clicked`. |
| **Calculation** | Median time in user testing sessions. Quantitative proxy: median of `(bottleneck_task_clicked - timeline_opened)`. |
| **Baseline Plan** | Conduct timed user testing with 5 managers in Q1 using current product. Repeat quarterly with new features. |
| **Reporting Cadence** | Quarterly (user research cadence) |

### 2.4 Period-over-Period Improvement

| Attribute | Detail |
|---|---|
| **Definition** | Trend in close duration and task completion rates across consecutive close periods for the same entity |
| **Current Baseline** | Most customers are flat or slightly improving (1-2% per quarter based on maturity). |
| **Target** | Measurable improvement trend for 80% of active entities by Q5 |
| **Data Source** | Task Service analytics. Historical comparison of close duration and completion curves. |
| **Calculation** | Linear regression of close duration over 6+ periods. Report slope (days reduced per period) and R-squared. |
| **Baseline Plan** | Historical trend analysis in Q1 using existing data. |
| **Reporting Cadence** | Quarterly |

---

## 3. AI Impact Metrics

These metrics measure the value delivered by AI agents and automation introduced in Q3-Q5.

### 3.1 AI Hours Saved per Entity per Month

| Attribute | Detail |
|---|---|
| **Definition** | Estimated hours of human work replaced by AI agent task completion, calculated per entity per close period |
| **Current Baseline** | 0 hours (no AI agent task completion today; existing AI features are suggestions only) |
| **Target** | 20-40 hours per entity per month by Q6 |
| **Data Source** | Agent execution log + task time estimates. Each task type has an estimated manual completion time (established via time studies and customer input). |
| **Calculation** | `SUM(estimated_manual_time for all agent-completed sub-tasks)` per entity per period. Validated against actual time reduction reported by customers. |
| **Baseline Plan** | Establish task time estimates via customer surveys and time-motion studies in Q2-Q3. |
| **Reporting Cadence** | Monthly (per close cycle) |

### 3.2 Agent Task Completion Rate

| Attribute | Detail |
|---|---|
| **Definition** | Percentage of agent-assigned sub-tasks that are completed by the agent without requiring human intervention (re-assignment back to human) |
| **Current Baseline** | N/A (agents not yet deployed) |
| **Target** | >80% by Q5, >90% by Q6 |
| **Data Source** | Agent execution log in Task Service. |
| **Calculation** | `(agent-assigned sub-tasks completed by agent) / (total agent-assigned sub-tasks) * 100`. Exclude sub-tasks where agent explicitly escalated due to insufficient data. |
| **Baseline Plan** | Begin measurement when agent assignment engine ships in Q5. |
| **Reporting Cadence** | Weekly |

### 3.3 Agent Accuracy (First-Review Approval Rate)

| Attribute | Detail |
|---|---|
| **Definition** | Percentage of agent-completed work that is approved by a human reviewer on first review without requesting changes |
| **Current Baseline** | N/A |
| **Target** | >90% first-review approval rate by Q5, >95% by Q6 |
| **Data Source** | Review events in Task Service. Track `agent_work_reviewed` events with outcome (approved, changes_requested, rejected). |
| **Calculation** | `(agent tasks approved on first review) / (total agent tasks reviewed) * 100`. Segment by task type and agent confidence score. |
| **Baseline Plan** | Begin measurement when human-in-the-loop review ships in Q5. |
| **Reporting Cadence** | Weekly |

### 3.4 AI ROI (Cost vs. Value)

| Attribute | Detail |
|---|---|
| **Definition** | Ratio of estimated value of time saved (at blended hourly rate) to cost of AI services (API calls, compute, storage) |
| **Current Baseline** | N/A |
| **Target** | 10:1 ROI by Q6 (every $1 spent on AI saves $10 in labor value) |
| **Data Source** | AI hours saved (3.1) * blended hourly rate ($75/hour industry average for accounting staff) / AI service costs (AWS billing, OpenAI/Bedrock API costs). |
| **Calculation** | `(hours_saved * hourly_rate) / ai_service_costs`. Report monthly with 3-month rolling average. |
| **Baseline Plan** | Track AI service costs from Q3 (workflow engine). Pair with hours saved data from Q5. |
| **Reporting Cadence** | Monthly |

---

## 4. Architecture Health Metrics

These metrics ensure the new technical infrastructure meets performance, reliability, and migration requirements.

### 4.1 Search Latency

| Attribute | Detail |
|---|---|
| **Definition** | Response time for search queries from the OpenSearch cluster, measured at the API gateway |
| **Current Baseline** | N/A (no search service today) |
| **Targets** | p50: <100ms, p95: <200ms, p99: <500ms |
| **Data Source** | CloudWatch metrics on the Search API. X-Ray traces for latency breakdown. |
| **Calculation** | Percentile distribution of `search_response_time` across all queries. Segment by query complexity (simple text vs. faceted vs. aggregate). |
| **Baseline Plan** | Establish from Day 1 of OpenSearch deployment in Q1. |
| **Reporting Cadence** | Real-time dashboard, Daily summary, Weekly review |

### 4.2 Task Service Availability

| Attribute | Detail |
|---|---|
| **Definition** | Percentage of time the Task Service API returns successful responses (non-5xx) within acceptable latency |
| **Current Baseline** | N/A (new service) |
| **Target** | 99.9% uptime (allowing ~8.7 hours of downtime per year) |
| **Data Source** | CloudWatch/Datadog synthetic monitoring. Health check endpoint polled every 30 seconds. |
| **Calculation** | `(successful_health_checks / total_health_checks) * 100` over rolling 30-day window. Also: `(non_5xx_responses / total_responses) * 100`. |
| **Baseline Plan** | Monitoring from first deployment in Q1. |
| **Reporting Cadence** | Real-time alerting, Weekly SLA report |

### 4.3 Event Processing Lag

| Attribute | Detail |
|---|---|
| **Definition** | Time from a data change event (MongoDB CDC) to the corresponding update appearing in the search index |
| **Current Baseline** | N/A |
| **Target** | <5 seconds for 99% of events |
| **Data Source** | Custom metric: timestamp in CDC event vs. timestamp of OpenSearch index acknowledgment. Published to CloudWatch. |
| **Calculation** | `index_update_timestamp - cdc_event_timestamp`. Report as p50, p95, p99. Alert on sustained >10s lag. |
| **Baseline Plan** | Instrument from Q1 pipeline deployment. |
| **Reporting Cadence** | Real-time dashboard, Daily summary |

### 4.4 Permission Evaluation Latency

| Attribute | Detail |
|---|---|
| **Definition** | Time to evaluate a single permission check via the ReBAC service (does user X have permission Y on resource Z?) |
| **Current Baseline** | Legacy folder-based permission check: ~20-50ms (MongoDB query). |
| **Target** | <50ms per check (p95) |
| **Data Source** | ReBAC service response time metrics (CloudWatch/Datadog). |
| **Calculation** | Percentile distribution of `permission_check_response_time`. Segment by relationship depth (direct role vs. inherited). |
| **Baseline Plan** | Measure legacy permission check latency in Q1. Compare against ReBAC in Q4. |
| **Reporting Cadence** | Real-time dashboard, Weekly review |

### 4.5 Migration Completeness

| Attribute | Detail |
|---|---|
| **Definition** | Percentage of active customers whose primary read/write operations are served by the new Task Service |
| **Current Baseline** | 0% |
| **Quarterly Targets** | Q2: 5% (pilot), Q3: 20%, Q4: 50%, Q5: 80%, Q6: 100% |
| **Data Source** | Feature flag service (LaunchDarkly or equivalent) + Task Service traffic metrics. |
| **Calculation** | `(customers with Task Service as primary) / (total active Close customers) * 100`. A customer is counted when >90% of their task reads come from Task Service. |
| **Baseline Plan** | Tracking begins in Q2 with pilot customer onboarding. |
| **Reporting Cadence** | Weekly |

---

## 5. Business Impact Metrics

These metrics connect the rearchitecture to business outcomes that matter to FloQast leadership and investors.

### 5.1 Customer Retention (Churn Reduction)

| Attribute | Detail |
|---|---|
| **Definition** | Reduction in customer churn specifically attributed to "outgrowing the product" -- customers who leave because Close cannot handle their complexity, scale, or workflow needs |
| **Current Baseline** | To be measured. Product-led churn reasons are tracked in Salesforce. Estimated: 15-25% of total churn is "outgrow" churn. |
| **Target** | 50% reduction in "outgrow" churn category by Q6 |
| **Data Source** | Salesforce churn reason codes + exit interview data from Customer Success. |
| **Calculation** | `(outgrow_churn_customers_this_quarter / outgrow_churn_customers_baseline_quarter) * 100`. Baseline is average of 4 quarters before rearchitecture. |
| **Baseline Plan** | Audit Salesforce churn reason codes in Q1. Standardize "outgrow" categorization with CS leadership. |
| **Reporting Cadence** | Quarterly |

### 5.2 Win Rate vs. Numeric (Competitive)

| Attribute | Detail |
|---|---|
| **Definition** | Percentage of competitive deals against Numeric (primary competitor) where FloQast wins |
| **Current Baseline** | Estimated 55-65% (declining from historical 70%+). Numeric's modern UX is a competitive advantage in new logo deals. |
| **Target** | Return to 70%+ win rate by Q5 |
| **Data Source** | Salesforce opportunity data, filtered to competitive deals where Numeric is identified as competitor. Win/loss analysis from Sales. |
| **Calculation** | `(deals won vs. Numeric) / (total deals where Numeric was competitor) * 100`. Rolling 4-quarter average. |
| **Baseline Plan** | Pull historical win rate data from Salesforce in Q1. Establish quarterly trend. |
| **Reporting Cadence** | Quarterly |

### 5.3 NPS Improvement (Task Management Sub-Score)

| Attribute | Detail |
|---|---|
| **Definition** | Net Promoter Score improvement specifically for the task management / close management experience (sub-score within overall FloQast NPS survey) |
| **Current Baseline** | To be measured. Overall FloQast NPS is tracked; task-specific sub-score needs to be added to the survey. |
| **Target** | +15 points from baseline by Q5 |
| **Data Source** | Customer NPS survey (quarterly). Add task management satisfaction questions: "How easy is it to find and manage your close tasks?" (1-10), "How satisfied are you with the close management workflow?" (1-10). |
| **Calculation** | Standard NPS methodology on task-specific questions. `(% Promoters - % Detractors)`. |
| **Baseline Plan** | Add task management questions to Q1 NPS survey. Q1 result is baseline. |
| **Reporting Cadence** | Quarterly |

### 5.4 Expansion Revenue

| Attribute | Detail |
|---|---|
| **Definition** | Revenue from existing Close customers who expand to additional FloQast products (Reporting, Compliance) enabled by the unified task model |
| **Current Baseline** | Current cross-sell rate from Close to other products. To be pulled from Salesforce. |
| **Target** | 20% increase in cross-sell conversion rate by Q6 |
| **Data Source** | Salesforce expansion opportunity data. Track customers who adopted Close rearchitecture features AND subsequently purchased additional products. |
| **Calculation** | `(close_customers_who_expanded_this_quarter / total_close_customers) * 100`. Compare to pre-rearchitecture baseline. |
| **Baseline Plan** | Pull historical cross-sell data in Q1. Establish quarterly conversion rate baseline. |
| **Reporting Cadence** | Quarterly |

### 5.5 Support Ticket Volume (Navigation Confusion)

| Attribute | Detail |
|---|---|
| **Definition** | Number of support tickets related to navigation confusion, inability to find tasks, folder structure issues, or "where is my item?" queries |
| **Current Baseline** | To be measured. Requires tagging existing Zendesk tickets by category. Estimated: significant volume based on leadership interviews citing "folder confusion" as a top complaint. |
| **Target** | 80% reduction in this ticket category by Q5 |
| **Data Source** | Zendesk ticket data, filtered by tags/categories related to navigation and folder confusion. |
| **Calculation** | Count of tickets in the "navigation/folder confusion" category per month. Report absolute count and as percentage of total ticket volume. |
| **Baseline Plan** | Work with Support to retroactively tag last 6 months of tickets in Q1. Establish monthly baseline. |
| **Reporting Cadence** | Monthly |

---

## 6. Adoption Metrics

These metrics track whether users are actually embracing the new task-centric paradigm versus falling back to legacy folder navigation.

### 6.1 Task Inbox Adoption

| Attribute | Detail |
|---|---|
| **Definition** | Percentage of active users who use Task Inbox as their primary navigation method (more than 50% of their sessions start with Task Inbox rather than folder navigation) |
| **Current Baseline** | 0% (Task Inbox does not exist yet) |
| **Quarterly Targets** | Q2: 80% of pilot users, Q3: 50% of early access users, Q4: 40% of all users, Q5: 70% of all users, Q6: 90% of all users |
| **Data Source** | Front-end analytics. Track `session_start` -> first navigation action (Task Inbox vs. folder tree). |
| **Calculation** | `(users where Task Inbox sessions > 50% of total sessions) / (total active users) * 100`. Rolling 30-day window. |
| **Baseline Plan** | Measurement begins when Task Inbox ships in Q2. |
| **Reporting Cadence** | Weekly |

### 6.2 Search Usage

| Attribute | Detail |
|---|---|
| **Definition** | Average number of search queries performed per active user per day |
| **Current Baseline** | Near zero. Current product has minimal search capability. |
| **Target** | 5+ searches per user per day by Q4 (indicates search-first behavior has become habitual) |
| **Data Source** | Search API request logs. Deduplicate by user and session. Exclude automated/API searches. |
| **Calculation** | `(total_user_search_queries_per_day) / (daily_active_users)`. Report as daily average with 7-day rolling trend. |
| **Baseline Plan** | Instrument current (minimal) search usage in Q1. Begin tracking new search from Q1 launch. |
| **Reporting Cadence** | Daily (dashboard), Weekly (review) |

### 6.3 Agent Utilization

| Attribute | Detail |
|---|---|
| **Definition** | Percentage of sub-tasks eligible for agent assignment that are actually assigned to and processed by AI agents |
| **Current Baseline** | 0% (no agent capability today) |
| **Target** | 60%+ of eligible sub-tasks by Q6 |
| **Data Source** | Agent assignment engine logs. Eligibility determined by task type configuration (admin-configurable). |
| **Calculation** | `(sub-tasks assigned to agents) / (sub-tasks meeting eligibility criteria) * 100`. Segment by task type, entity, and customer. |
| **Baseline Plan** | Define eligibility criteria in Q4. Begin measurement in Q5 when agent assignment ships. |
| **Reporting Cadence** | Weekly |

### 6.4 Saved Views Created

| Attribute | Detail |
|---|---|
| **Definition** | Number of saved views (personal and shared) created by users, indicating they find value in personalized navigation |
| **Current Baseline** | 0 (feature does not exist) |
| **Target** | Average of 3+ saved views per active user by Q4 |
| **Data Source** | Saved Views API (Task Service). Count `view_created` events. |
| **Calculation** | `(total saved views created) / (active users who have access to saved views)`. Also track: views created vs. views actively used (opened at least once per week). |
| **Baseline Plan** | Measurement begins when Saved Views ships in Q2. |
| **Reporting Cadence** | Monthly |

---

## Measurement Framework

### Data Collection Architecture

```
+-------------------+     +-------------------+     +-------------------+
|   Front-End       |     |   Back-End        |     |   Infrastructure  |
|   Analytics       |     |   Event Logs      |     |   Metrics         |
|                   |     |                   |     |                   |
| - Page navigation |     | - Task Service    |     | - CloudWatch      |
| - Click events    |     |   events          |     | - X-Ray traces    |
| - Session timing  |     | - Search queries  |     | - OpenSearch      |
| - Feature usage   |     | - Agent execution |     |   cluster stats   |
|                   |     | - Permission      |     | - ECS service     |
|                   |     |   evaluations     |     |   health          |
+--------+----------+     +--------+----------+     +--------+----------+
         |                         |                          |
         v                         v                          v
+--------+-------------------------+---------------------------+---------+
|                        Snowflake Data Warehouse                        |
|                                                                        |
|  - Raw event tables (append-only, partitioned by date)                 |
|  - Aggregated metric tables (hourly, daily, weekly rollups)            |
|  - Customer-level metric snapshots (monthly)                           |
|  - Historical baselines (pre-rearchitecture reference data)            |
+--------+--------------------------------------------------------------+
         |
         v
+--------+----------+
|   Reporting &      |
|   Dashboards       |
|                    |
| - Looker/Mode      |
| - Real-time ops    |
|   dashboards       |
| - Executive        |
|   summary          |
| - Customer-facing  |
|   ROI reports      |
+--------------------+
```

### Baseline Establishment Plan

Establishing accurate baselines in Q1 is critical. Without baselines, improvement claims are unverifiable.

| Metric Category | Baseline Method | Timeline | Owner |
|---|---|---|---|
| **UX Metrics** | Instrument current application with analytics events. Run 4-week data collection period before any rearchitecture features ship. | Q1 Weeks 1-4 | Product Analytics |
| **Close Performance** | Extract historical data from existing checklist completion timestamps. Analyze last 6 close periods. | Q1 Weeks 1-6 | Data Engineering |
| **AI Impact** | Conduct time-motion studies with 10 customers. Establish per-task-type manual completion time estimates. | Q2-Q3 | Product Research |
| **Architecture Health** | Measure current system performance (legacy API latency, uptime). New service metrics start from deployment. | Q1 ongoing | Platform Engineering |
| **Business Impact** | Pull Salesforce data (churn, win rate, expansion). Tag Zendesk tickets. Add NPS sub-questions. | Q1 Weeks 1-8 | Sales Ops, CS, Support |
| **Adoption** | Baseline is 0% for all new features. Track legacy feature usage patterns for comparison. | Q1-Q2 | Product Analytics |

### Reporting Cadence Summary

| Cadence | Audience | Content | Format |
|---|---|---|---|
| **Real-time** | Engineering, On-call | Architecture health metrics, error rates, latency | Datadog/CloudWatch dashboards |
| **Daily** | Product team, Engineering leads | Search usage, Task Inbox sessions, event processing lag | Automated Slack digest |
| **Weekly** | Product leadership, Engineering leadership | UX metrics trends, adoption metrics, migration completeness, architecture health summary | Dashboard review in team standup |
| **Monthly** | VP Product, VP Engineering, CTO | Close performance metrics, AI impact metrics, support ticket trends, business metrics preview | Slide deck with trend analysis |
| **Quarterly** | Executive leadership, Board (summary) | Full metrics review across all 6 dimensions, business impact, competitive positioning, customer retention | Executive report with narrative |

### Metrics Dashboard Description

The primary metrics dashboard should be organized into four views:

#### View 1: Real-Time Operations

- **Top row**: Service health indicators (green/yellow/red) for Search, Task Service, ReBAC, Workflow Engine
- **Middle row**: Latency charts (p50, p95, p99) for search and Task Service API
- **Bottom row**: Event processing lag, error rates, active alerts

#### View 2: User Experience & Adoption

- **Top row**: Time-to-next-action trend (daily, 30-day rolling), Task discovery time by method (search vs. browse)
- **Middle row**: Task Inbox adoption curve (% users, weekly trend), Search usage per user (daily average)
- **Bottom row**: Context switches per task (weekly average), "5-second rule" compliance rate, Saved Views created (cumulative)

#### View 3: Close Performance & AI

- **Top row**: Close duration trend (per entity, rolling 6 periods), Task completion rate by Day X (current period vs. prior periods)
- **Middle row**: AI hours saved (per entity, monthly), Agent accuracy rate (weekly rolling), Agent utilization (% of eligible tasks)
- **Bottom row**: Bottleneck identification heatmap (which task types / entities are most delayed), Predictive close date vs. actual

#### View 4: Business Impact

- **Top row**: Customer retention trend (churn rate, "outgrow" churn category highlighted), Win rate vs. Numeric (quarterly)
- **Middle row**: NPS trend (overall + task management sub-score), Expansion revenue (quarterly)
- **Bottom row**: Support ticket volume (navigation category, monthly trend), Migration completeness (% customers on Task Service)

### Metric Interdependencies

Some metrics are leading indicators for others. Understanding these relationships helps prioritize:

```
Search Latency (4.1)  ──>  Task Discovery Time (1.2)  ──>  Time-to-Next-Action (1.1)
                                                              │
Task Inbox Adoption (6.1) ──────────────────────────────────>─┘
                                                              │
Context Switches (1.4) ──>  Review Cycle Time (1.3) ──>  Close Duration (2.1)
                                                              │
Agent Accuracy (3.3) ──>  Agent Utilization (6.3)  ──>  AI Hours Saved (3.1)
                                                              │
                                                              v
                                              Customer Retention (5.1)
                                              Win Rate vs. Numeric (5.2)
                                              NPS Improvement (5.3)
```

**Key insight**: Architecture health metrics (Section 4) are foundational -- if search is slow, all downstream UX and adoption metrics suffer. Invest in architecture health first, then optimize for user experience, then expect business impact to follow with a 1-2 quarter lag.

---

## Metric Ownership

| Metric Category | Primary Owner | Data Owner | Reporting Owner |
|---|---|---|---|
| User Experience (1.x) | Product Design | Product Analytics | Product Analytics |
| Close Performance (2.x) | Product Management | Data Engineering | Product Analytics |
| AI Impact (3.x) | AI/ML Lead | AI/ML Engineering | Product Analytics |
| Architecture Health (4.x) | Platform Engineering | DevOps/SRE | Platform Engineering |
| Business Impact (5.x) | Product Leadership | Sales Ops / CS | Business Intelligence |
| Adoption (6.x) | Product Management | Product Analytics | Product Analytics |

---

## Appendix: Metric Quick Reference

| # | Metric | Target | When Measurable | Cadence |
|---|---|---|---|---|
| 1.1 | Time-to-next-action | <30 seconds | Q1 (baseline), Q2+ (new) | Weekly |
| 1.2 | Task discovery time | <10 seconds (search) | Q1 (baseline), Q2+ (new) | Weekly |
| 1.3 | Review cycle time | 30% reduction | Q1 (baseline), Q3+ (new) | Monthly |
| 1.4 | Context switches per task | 2 or fewer | Q1 (baseline), Q3+ (new) | Monthly |
| 1.5 | "5-second rule" compliance | 85% by Q5 | Q2+ | Weekly |
| 2.1 | Close duration | 2-day reduction | Q1 (baseline), Q4+ (improvement) | Monthly |
| 2.2 | Task completion by Day 5 | 85% | Q1 (baseline), Q4+ (improvement) | Per close cycle |
| 2.3 | Bottleneck identification time | <5 seconds | Q1 (baseline), Q4+ (new) | Quarterly |
| 2.4 | Period-over-period improvement | 80% of entities improving | Q3+ | Quarterly |
| 3.1 | AI hours saved per entity | 20-40 hours/month | Q5+ | Monthly |
| 3.2 | Agent task completion rate | >80% | Q5+ | Weekly |
| 3.3 | Agent accuracy | >90% first-review | Q5+ | Weekly |
| 3.4 | AI ROI | 10:1 | Q5+ | Monthly |
| 4.1 | Search latency | p95 <200ms | Q1+ | Real-time |
| 4.2 | Task Service availability | 99.9% | Q1+ | Real-time |
| 4.3 | Event processing lag | <5 seconds | Q1+ | Real-time |
| 4.4 | Permission evaluation latency | <50ms p95 | Q4+ | Real-time |
| 4.5 | Migration completeness | 100% by Q6 | Q2+ | Weekly |
| 5.1 | Customer retention (outgrow churn) | 50% reduction | Q3+ (lagging) | Quarterly |
| 5.2 | Win rate vs. Numeric | 70%+ | Q4+ (lagging) | Quarterly |
| 5.3 | NPS improvement | +15 points | Q1 (baseline), Q3+ | Quarterly |
| 5.4 | Expansion revenue | 20% increase in cross-sell | Q4+ (lagging) | Quarterly |
| 5.5 | Support ticket volume | 80% reduction | Q1 (baseline), Q3+ | Monthly |
| 6.1 | Task Inbox adoption | 90% by Q6 | Q2+ | Weekly |
| 6.2 | Search usage | 5+ per user per day | Q1+ | Daily |
| 6.3 | Agent utilization | 60%+ eligible | Q5+ | Weekly |
| 6.4 | Saved Views created | 3+ per user | Q2+ | Monthly |
