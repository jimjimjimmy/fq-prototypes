# Persona 2 — IT / Compliance Manager Experience

> Source of truth for the prototype. Lists who Persona 2 is, what they need, and the screens being built to serve those needs. Updated as screens land.

## Who they are

The company's compliance or IT governance lead. They own the AI compliance program: maintaining the agent inventory, facilitating risk assessments, designing controls, and ensuring the first line (accounting managers) follows them. In some organizations this is a dedicated compliance team; in others it's a single person in the IT shop responsible for all things compliance. The title varies — VP of Compliance, IT compliance manager, risk manager — but the function is the same: build and maintain the control framework so auditors can validate it.

> **Key distinction from Persona 3:** This persona is the **management/compliance function** that designs and maintains the program, not the audit function that validates it. Blaine Brooks confirmed: *"Internal auditors cannot define the controls. They can only validate them. So it is a different person."*

## How they interact with the feature

The compliance manager's experience spans **five core workflows**:

1. **Agent inventory management.** When an accounting manager creates a new agent in Transform, the compliance module adds it to the asset inventory automatically. The compliance manager sees every agent, its owner, its capabilities, and its risk status.

2. **Risk assessment facilitation.** The product auto-generates a risk assessment for each agent by mapping it to COSO capability types (the 7 capabilities are standard — customers won't create custom ones). The compliance manager reviews the proposed mapping, ensures it's complete, and the control owner (Persona 1) accepts it. Vicky argued customers can't be expected to select capabilities from a dropdown — *"it took us hours to get there"* — so the product should propose and the human validates.

3. **Control design and assignment.** Based on the risk assessment, the product proposes controls. The compliance manager validates these, customizes where needed, and assigns control ownership. Each risk may have multiple controls; not all controls apply to every agent.

4. **Ongoing monitoring and task management.** Sets up recurring compliance tasks (periodic testing, accuracy reviews, approval audits) and ensures they're completed on cadence. Tracks evidence collection. The compliance module should push tasks to accountants (*"it's time for your annual validation test"*) and collect the results automatically.

5. **Gap and remediation tracking.** Flags gaps, assigns owners, sets deadlines, tracks to closure. Prepares the environment so auditors (Persona 3) can walk in and validate without a separate request list.

## What they need from the product

| Need | Description |
| --- | --- |
| Agent / asset inventory | Auto-populated registry of every AI agent: owner, capability types, risk status, run frequency, health |
| Risk assessment facilitation | Auto-generated capability → risk → control mapping per agent. Review, customize, and route to control owners for acceptance |
| Control design workspace | Define and assign controls per risk. One risk may have multiple controls; not all controls apply to every workflow |
| Recurring task orchestration | Schedule and track periodic compliance tasks (testing, reviews, approvals). Push tasks to control owners and collect evidence automatically |
| Evidence repository | Central store for all compliance evidence — auto-captured from Transform plus manually attached artifacts |
| Reliance classification | Designate reliance per workflow, informed by actual usage-pattern data (approval-without-edit rates, human intervention frequency, override trends) |
| Control effectiveness signals | Exception trends, loosened thresholds, intervention rate shifts |
| Gap & remediation tracking | Flag gaps, assign owners, set deadlines, track to closure |

## Do they have what they need today?

**No.** Today there's no product-level visibility into what the AI features are doing from a risk/control perspective. They'd have to interview the accounting team, manually inspect configurations, and build their own testing documentation outside of FloQast.

## What we want this to be

**The compliance manager's command center for AI governance** — a living, auto-populated view that turns FloQast's AI activity into auditable, capability-mapped evidence without requiring the accounting team to do anything extra.

---

## Screens in the prototype

The Figma entry-point design (`s5mhthDXZDrhn7T4yP8UMe`, node `2030:2249`) shows four frames. The prototype builds these out one at a time.

| # | Screen | Status | Purpose |
| --- | --- | --- | --- |
| 0 | Shared chrome (icon rail + section nav) | in progress | The navigation frame around every Persona 2 view |
| 1 | Home / AI Capabilities landing | in progress | First view on entry; orientation to the AI compliance program |
| 2 | Key Systems table | in progress | Agent inventory — the central Persona 2 surface |
| 3 | Agent overview drilldown | pending | Compliance posture summary for one agent ("Up Next" task block) |
| 4 | Agent details drilldown | pending | Tabbed deep-dive: risks, controls, tests, evidence |

### Net-new screens proposed beyond the Figma

The four Figma frames cover entry → inventory → drilldown, but skip a few surfaces Persona 2 needs based on their five workflows. Adding to the prototype as we go:

- **Risk assessment review** — facilitate the auto-generated capability → risk → control mapping. Reviewing/customizing/routing to control owners. (Workflow 2.)
- **Control library + design workspace** — browse standard controls, customize, assign owners. (Workflow 3.)
- **Recurring task orchestration** — schedule periodic testing, reviews, approvals; track completion. (Workflow 4.)
- **Gap + remediation tracker** — list of open gaps with owner, deadline, status. (Workflow 5.)

---

## Resolved design decisions

Martin walked through the open questions on 2026-05-08. Notes below:

- **AI agents are a sub-type of Key System.** Per Andrew's earlier suggestion, the Key Systems page splits into two tabs: **Traditional systems** (NetSuite, Workiva, ERPs, etc. — IT systems housing financial data) and **AI agents** (the agentic workflows). Both share the Key Systems IA so reliance and basic governance attributes carry over, but their risk/control models diverge. *Implemented in the prototype as Radix Tabs on the Key Systems screen.*
- **Reliance designations live on the Key System itself.** Three values for now: **Reliable**, **Not reliable**, **Out of scope**. Reliance is a top-level column on both tabs of the Key Systems table. *Implemented; replaced the old "Risk status" column.*
- **AI risk assessment lives in its own tab on the agent drilldown.** Because Key Systems don't carry "traditional risks" in the same way, and because the controls derived from the COSO AI RCM aren't surfaced where traditional controls are linked, the agent drilldown gets a dedicated **AI risk assessment** tab. Open question: how active vs. read-only this surface is. The compliance manager mostly reviews the auto-generated capability → risk → control mapping rather than authoring it, but they may need to validate, annotate, and route to control owners for acceptance — so it's review-with-light-action, not pure read-only. *Pending — to be built on the agent details drilldown screen.*
- **A gap is a failed test.** When a test fails, the result is a gap on the agent. The presence of gaps is what triggers the conversation about reclassifying reliance from Reliable to Not reliable, and it surfaces additional testing as a remediation step. *Implemented as an "Open gaps" column on the AI agents table; clicking through to a gap-and-remediation tracker is pending.*

## Canonical capability / risk / control library

Sourced from the Figma "AI Capabilities" matrix (`s5mhthDXZDrhn7T4yP8UMe`, node `2029:86`). The default risks and recommended controls are **starter templates** — Martin's note: the team will work with internal compliance to refine these before customers see them. Users can add their own risks on top of the defaults (the prototype's "Add risk" dialog demonstrates this).

The matrix includes **8 capability types**, **17 default risks**, and **19 controls** (some shared across capabilities, especially the cross-cutting C-GOV-* ones).

### Capability types

| ID | Capability | Description |
| --- | --- | --- |
| ING | Data extraction and ingestion | Capture and interpret raw data from structured and unstructured sources |
| TRF | Data transformation and integration | Transform raw or unstructured data into usable data by cleaning, normalizing, or combining it |
| PST | Automated transaction processing and reconciliation | Automate high-volume tasks such as posting, matching, and reconciliation |
| ORC | Workflow orchestration and autonomous task execution | AI agents coordinate and perform multi-step tasks with minimal human input |
| JDG | Judgment, forecasting, and insight generation | Produce forecasts, insights, or draft analyses |
| MON | AI-powered monitoring and continuous review | Continuously scan activity for anomalies, drift, or emerging risks |
| KNW | Knowledge retrieval and summarization | Summarize large volumes of information from policy, regulatory, or document stores |
| INT | Human-AI collaboration | Augment human capabilities through chat-based interfaces |

### Control stages

The matrix uses **Stage** rather than the more familiar Preventive/Detective/Corrective taxonomy. Stage tells the compliance manager *when* the control fires:

- **Design-time** — set up before the agent goes live (posting authority matrix, source-of-truth registration)
- **Runtime / HITL** — fires during the run, often with a human in the loop (completeness check, mandatory citation, pre-post approval)
- **Post-run** — fires after the run, often automated (sample re-runs, accuracy tests, bias audits)
- **Monitoring** — continuous (step-failure SLA, edit-rate monitoring, alert-ack SLA)
- **Change mgmt** — fires when the agent or its config changes (2-person approval, threshold change governance, vendor change notification)

### "Add risk" affordance

Default risks come from the matrix. The compliance manager can add a custom risk per capability via a dialog that captures: title, severity (low/medium/high), description, and which controls to map it to (multi-select from the full control library). Custom risks are tagged "Custom" in the UI to keep them visually distinct from the auto-generated defaults.

## Still open

- **Action surface inside the AI risk assessment tab** — beyond review-and-add, what actions live here? Tabled per Martin (2026-05-08); will be designed when the real flow needs to land.
- **What "Not reliable" routes to** — when an agent is classified Not reliable because of failed tests, does it auto-pause? Get flagged for engineering? Get pulled out of the close workflow until reliance is restored? Shapes the gap-tracker surface.
- **Refining the default risks/controls library** — Martin's note: the current matrix is a starting point. Internal compliance will refine the defaults before they're customer-facing.
