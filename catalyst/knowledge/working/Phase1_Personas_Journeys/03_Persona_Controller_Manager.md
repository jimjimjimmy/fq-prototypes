# Persona: Maria Gonzalez — Controller / Accounting Manager

**Role:** Controller / Accounting Manager
**Archetype:** The Orchestrator — "I need to see the whole close at a glance and know where the bottlenecks are within 5 seconds."

---

## Demographics & Context

| Attribute | Detail |
|-----------|--------|
| Title | Controller, Assistant Controller, Accounting Manager |
| Experience | 10-20 years in accounting; 2-5 years on FloQast |
| Reports to | VP Finance or CFO |
| Team size | Oversees 8-25 accountants across 3-8 entities |
| Entity scope | All entities in her business unit |
| Daily FloQast time | 1-2 hours during close; 20-30 min outside close |
| Technical comfort | Moderate-high; strategic user, not a power user |
| CPA status | Licensed CPA with public accounting background |

## Key Responsibilities

1. **Monitor close progress** — Track completion status across all entities, identify bottlenecks, and ensure deadlines are met
2. **Manage team workload** — Balance task assignments, handle PTO coverage, escalate staffing issues
3. **Resolve bottlenecks** — Intervene when tasks are blocked, dependencies stall, or team members are overloaded
4. **Report to leadership** — Provide close status updates to VP Finance/CFO, forecast completion dates, explain delays
5. **Ensure compliance** — Verify that SOX controls are followed, sign-offs are timely, and audit evidence is complete
6. **Drive continuous improvement** — Analyze close cycle trends, identify automation opportunities, optimize processes

## Goals & Motivations

- **5-second situational awareness** — Wants to land on a dashboard and immediately know: What percentage of close is complete? What's late? Who's blocked? Where should I intervene? (Source: Carlos Avila's "5-Second Rule," Doc 02 Sec 3.3)
- **Bottleneck identification and resolution** — When something is late, Maria needs to drill down to the root cause: Is it a person issue, a dependency chain, a data pipeline delay, or a process problem?
- **Period-over-period trending** — "Last month AP took 4 days. This month it's on day 5 and only 60% complete. What changed?" (Source: Doc 04 Sec 2E)
- **Predictive close management** — Wants the system to predict: "Based on current velocity, this close will finish 1.5 days late unless the AR team accelerates."
- **Demonstrate ROI** — Needs to justify FloQast's cost by showing measurable improvements: days saved, error reduction, automation hours

## Pain Points (Current State)

### Critical (Daily friction during close)
1. **No real-time close timeline** — The existing timeline view shows due dates on a calendar but doesn't show actual progress, critical path, or dynamic bottleneck visualization. Maria must mentally reconstruct close status from the overview dashboard tiles, which show percentages but not workflow dependencies. (Source: Doc 02 Sec 1.3, Doc 04 Sec 2E)
2. **Cannot identify root-cause bottlenecks** — When the dashboard shows "AP is at 45%," Maria can't determine if it's because tasks are actually late, or because 3 tasks are blocked by a dependency on Treasury that hasn't been signed off. She must manually investigate by clicking through folders and filtering. (Source: Carlos Avila, Doc 02 Sec 3.3)
3. **Cross-entity monitoring is tedious** — Maria oversees 6 entities. Checking status requires switching entities one by one, re-loading the dashboard, and mentally aggregating across all six. (Source: Doc 01 Sec 4.1)

### Significant (Weekly friction)
4. **Workload rebalancing is manual** — When an accountant is overloaded or on PTO, Maria must: (1) identify the imbalance, (2) determine which tasks to reassign, (3) ask an admin to make the changes. There's no drag-and-drop reassignment or self-service delegation. (Source: Doc 02 Sec 2.3)
5. **Analytics are backward-looking only** — Workflow analytics show what happened after the close, not what's happening during the close. Maria wants real-time insights, not post-mortem reports. (Source: Doc 02 Sec 2.8 Workflow Analytics)
6. **Dependency chains are invisible** — The dependency system exists (tasks can be linked), but there's no visualization showing the critical path or which dependencies are creating cascading delays. (Source: Tim Gibson, Doc 02 Sec 3.4)

### Moderate (Quarterly friction)
7. **No close forecasting** — Maria can't answer "When will this close finish?" with data. She estimates based on gut feel and past experience. (Source: Doc 04 Sec 2E Compare Mode)
8. **Template management across entities** — When Maria wants to standardize a process improvement across all 6 entities, the template system doesn't support global updates. Changes must be made entity by entity. (Source: Doc 01 Sec 1.1)
9. **Audit preparation is manual** — Pulling evidence for auditors requires navigating to each item, downloading attachments, and compiling manually. (Source: Doc 01 Sec 4.3)

## Aspirational Experience (Future State)

### The Command Center: "Scan → Spot → Drill → Act"
Maria opens FloQast at 9:00 AM on close day 3 and lands on her **Close Timeline** — a Gantt-style visualization showing all work streams (Cash, AR, AP, Payroll, Revenue, Fixed Assets) across her 6 entities. Each stream shows a progress bar with color-coded status. An AI summary reads: *"Close is 58% complete, tracking 0.5 days ahead of last month. AP - Entity C is behind: 3 tasks blocked by the Treasury bank reconciliation. Recommended action: Reassign Treasury bank rec from James (overloaded, 8 tasks remaining) to Lisa (2 tasks remaining)."*

Maria clicks the AP bottleneck. The timeline zooms into the dependency chain: Treasury Bank Rec → AP Sub-Ledger Validation → AP Accrual JE → AP Close Sign-Off. The bank rec is showing red — James has 8 tasks due today. Maria clicks "Reassign" and selects Lisa from a dropdown of available team members with appropriate permissions. The system confirms: *"Lisa has Entity C access and is available. Reassigning Treasury Bank Rec and sending notification."*

She opens the **Period-over-Period Compare** overlay. Side by side, she sees this month's AP stream vs. last month's. Last month, AP finished by day 4. This month, the bank rec was 1 day late getting started because the data feed from the new bank was delayed. She notes this for the process improvement discussion.

### Key Principle Manifestations
- **Principle 1 (Master Object):** Each work stream rolls up from individual super tasks, each containing full context — Maria can drill from timeline → stream → individual task without losing orientation
- **Principle 2 (No Folders):** Maria views close by work stream, entity, assignee, or status — not by folder hierarchy. Grouping is dynamic and contextual
- **Principle 6 (Event-Driven):** The system knows James is overloaded because it's tracking real-time task velocity. The reassignment recommendation is event-driven, not manually calculated
- **Principle 7 (Search-First):** Maria searches "blocked tasks Entity C" to instantly filter to the problem area
- **Principle 8 (Invisible AI):** The "0.5 days ahead" prediction, the bottleneck identification, and the reassignment recommendation all happen automatically

## Technology & Tools

| Tool | Usage |
|------|-------|
| FloQast | Close monitoring, team management, compliance |
| ERP | High-level financial review, posting confirmation |
| Excel/BI tools | Ad-hoc analysis, board reporting |
| Slack/Teams | Team communication, escalation |
| Email | Leadership updates, auditor communication |

## Quotes (Synthesized from Research)

> "Don't make me click through six entities to figure out where we are. I should land on one page and know." — Reflecting Carlos Avila's 5-second rule

> "I can tell you AP is always the bottleneck, but I can't PROVE it with data or show the dependency chain. I need that visibility." — Reflecting Doc 02 Sec 3.3

> "Last month we closed in 5 days. This month we're on day 6. What changed? I shouldn't have to investigate that manually — the system should tell me." — Reflecting Doc 04 Sec 2E Compare Mode

## Metrics That Matter to Maria

- **Close completion %** (real-time, not end-of-day) — Her primary pulse metric
- **Days to close** — Period-over-period trend; reported to CFO
- **Bottleneck identification** — Which work streams, entities, or people are causing delays
- **Team utilization** — Who's overloaded vs. who has capacity
- **Dependency chain health** — How many tasks are blocked and for how long
- **Agent ROI** — Hours saved by AI automation this period
- **On-time %** — Percentage of tasks signed off by due date
