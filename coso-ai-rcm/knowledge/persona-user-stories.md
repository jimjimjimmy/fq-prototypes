# COSO AI RCM — Persona User Stories

> Local snapshot of the Confluence page (last fetched 2026-05-07).
> Source of truth: https://floqast.atlassian.net/wiki/spaces/Endor/pages/4535910714/COSO+AI+RCM+Persona+User+Stories
> Authored by Vicky LeVay's compliance team. Three personas mapped to the three lines of defense from enterprise risk management.

## Structural Framework: Three Lines of Defense

The three personas map to the **three lines of defense** model from enterprise risk management (raised by Matt Slager in the April 2026 call with Vicky LeVay's compliance team):

- **1st line:** Operational management / process owners (Persona 1 — Accounting Manager)
- **2nd line:** Risk and compliance functions providing oversight (Persona 2 — IT / Compliance Manager)
- **3rd line:** Independent assurance — audit (Persona 3 — Internal & External Auditor)

---

## Persona 1: Accounting Manager (First Line of Defense)

**Who they are:** A staff accountant or accounting manager on the close team. They use FloQast Transform, AI Matching, AI Accruals, etc. to speed up their work. They're not thinking about COSO, risk matrices, or audit readiness. They're thinking about closing the books on time. But their role has expanded: Vicky LeVay described them as **"a people manager over an agent"** — they own the risks, perform the controls, and bear recurring testing obligations that didn't exist in traditional IT-controlled environments.

### What they want

To automate repetitive accounting work and trust the output. They want to set up an AI-powered workflow (e.g., "pull my Ramp transactions, classify fixed asset purchases, draft the depreciation JE"), review the results, approve or adjust, and move on.

They don't fill out compliance forms. They don't tag COSO principles. They don't even know their usage is being tracked for audit purposes. But every action they take — every approval, every edit, every rejection — is building the evidence trail that makes their automation auditable.

### What they need from the product

| Need | Description |
| --- | --- |
| Transparency | See what the AI did — data pulled, classification logic, policy applied, uncertainty flags |
| Exception queue | Low-confidence items with enough context to make a quick decision |
| Risk acceptance at agent creation | When an agent is built in Transform, the product proposes a risk assessment (capabilities → risks → controls). The accounting manager reviews and accepts it as the first line of defense. Compliance facilitates, but the control owner signs off. |
| Recurring accuracy/reasonableness testing | COSO calls for periodic testing of agent outputs — comparing to expected results, last year's results, edge cases. This is not IT functional testing. The accounting manager does it because they understand what correct output looks like. |
| Multi-level approvals | Depending on materiality, some outputs require multiple sign-offs before use. The accounting manager needs to know the rules (e.g., "this one requires 3 different people to approve it") and collect date-stamped evidence of those approvals. |
| Acceptance/rejection rate monitoring | Track and review rates of accepted vs. rejected AI outputs over time — a form of quality monitoring that feeds into compliance evidence. |
| SOPs / documentation of manual obligations | Some controls will be enforced in-product; others won't. The accounting manager needs documentation (SOPs) telling them what rules to follow outside the tool. |
| Productized evals | Run expected-output tests ("gold data") against the agent on a recurring cadence, in the background. Results become audit evidence and fulfill the governance control for regular testing. |

### Why reliance matters here (even though they don't think about it)

Their usage pattern is what defines reliance. Approving based on AI output = reliance. Re-performing the work independently = non-reliance. The product captures this so the determination can be made downstream.

The shift from traditional IT controls to AI means the accounting manager now bears testing responsibilities that used to sit with IT. In the old model, IT made a change, it stayed static, and IT re-validated on the next change. With AI, the output can drift without any configuration change — because the model is non-deterministic. The person who understands whether the output is reasonable — the accounting manager — is now the one who must check in periodically. COSO codifies this shift.

### What we want this to be

An AI feature that's delightful to use for the accounting team — and happens to **generate a complete, COSO-aligned audit trail** as a side effect. The accounting manager's job is to close the books. FloQast's job is to make sure everything they did is auditable.

---

## Persona 2: IT / Compliance Manager (Second Line of Defense)

**Who they are:** The company's compliance or IT governance lead. They own the AI compliance program: maintaining the agent inventory, facilitating risk assessments, designing controls, and ensuring the first line (accounting managers) follows them. In some organizations this is a dedicated compliance team; in others it's a single person in the IT shop responsible for all things compliance. The title varies — VP of Compliance, IT compliance manager, risk manager — but the function is the same: build and maintain the control framework so auditors can validate it.

> **Key distinction from Persona 3:** This persona is now the **management/compliance function** that designs and maintains the program, not the audit function that validates it. Blaine Brooks confirmed: "Internal auditors cannot define the controls. They can only validate them. So it is a different person."

### How they interact with the feature

The compliance manager's experience spans five core workflows:

**1. Agent inventory management.** When an accounting manager creates a new agent in Transform, the compliance module adds it to the asset inventory automatically. The compliance manager sees every agent, its owner, its capabilities, and its risk status.

**2. Risk assessment facilitation.** The product auto-generates a risk assessment for each agent by mapping it to COSO capability types (the 7 capabilities are standard — customers won't create custom ones). The compliance manager reviews the proposed mapping, ensures it's complete, and the control owner (Persona 1) accepts it. Vicky argued customers can't be expected to select capabilities from a dropdown — "it took us hours to get there" — so the product should propose and the human validates.

**3. Control design and assignment.** Based on the risk assessment, the product proposes controls. The compliance manager validates these, customizes where needed, and assigns control ownership. Each risk may have multiple controls; not all controls apply to every agent.

**4. Ongoing monitoring and task management.** Sets up recurring compliance tasks (periodic testing, accuracy reviews, approval audits) and ensures they're completed on cadence. Tracks evidence collection. The compliance module should push tasks to accountants ("it's time for your annual validation test") and collect the results automatically.

**5. Gap and remediation tracking.** Flags gaps, assigns owners, sets deadlines, tracks to closure. Prepares the environment so auditors (Persona 3) can walk in and validate without a separate request list.

### What they need from the product

| Need | Description |
| --- | --- |
| Agent/asset inventory | Auto-populated registry of every AI agent: owner, capability types, risk status, run frequency, health |
| Risk assessment facilitation | Auto-generated capability → risk → control mapping per agent. Review, customize, and route to control owners for acceptance |
| Control design workspace | Define and assign controls per risk. One risk may have multiple controls; not all controls apply to every workflow |
| Recurring task orchestration | Schedule and track periodic compliance tasks (testing, reviews, approvals). Push tasks to control owners and collect evidence automatically |
| Evidence repository | Central store for all compliance evidence — auto-captured from Transform plus manually attached artifacts |
| Reliance classification | Designate reliance per workflow, informed by actual usage-pattern data (approval-without-edit rates, human intervention frequency, override trends) |
| Control effectiveness signals | Exception trends, loosened thresholds, intervention rate shifts |
| Gap & remediation tracking | Flag gaps, assign owners, set deadlines, track to closure |

### Do they have what they need today?

No. Today there's no product-level visibility into what the AI features are doing from a risk/control perspective. They'd have to interview the accounting team, manually inspect configurations, and build their own testing documentation outside of FloQast.

### What we want this to be

The compliance manager's command center for AI governance — a living, auto-populated view that turns FloQast's AI activity into auditable, capability-mapped evidence without requiring the accounting team to do anything extra.

---

## Persona 3: Internal & External Auditor (Third Line of Defense)

**Who they are:** An internal audit team member or external firm auditor (Big 4, regional) engaged to independently validate the company's AI controls over financial reporting. Internal auditors work year-round with deeper access; external auditors work concentrated fieldwork periods (2–4 weeks) with read-only access. Both do the same core job: verify that the controls Persona 2 designed are operating as intended, and that Persona 1 followed them. They cannot define or modify controls — only validate and flag issues.

> **Why IA and EA are one persona:** Vicky and Blaine agreed: internal and external auditors "do the exact same job." One is inside the company, one is outside. The difference is permission level, not function. Internal auditors have write access (flag issues, document findings); external auditors have read-only plus export.

### What they want

To log into FloQast, see exactly what AI is doing inside the financial close, inspect the controls and evidence, and form an opinion — without sending the client a request list or waiting for someone to export a config file. Self-service, auditor-grade.

### How they interact with the feature

The auditor's experience starts with one question per AI workflow: has management designated this as reliance? That single flag determines everything that follows. For a reliance workflow, they're evaluating the AI as an automated control: is the configuration sound, did the control operate effectively throughout the period, is the evidence sufficient? For a non-reliance workflow, the AI is irrelevant to them — they test the human review process instead.

They log in and see a scoped view — just the AI workflows, controls, and evidence relevant to their engagement period and entity. They start with the reliance designations the compliance manager (Persona 2) already made, then validate them against the data. This is where human intervention metrics become critical: if management says they rely on the AI but the data shows the accounting manager edits 40% of outputs, the auditor will challenge that designation.

For reliance workflows, they drill into the evidence package the product assembled automatically: documented configuration and model version, sampling rationale, exception resolution records, and operating effectiveness evidence across the period. They check that thresholds weren't changed mid-period without governance. They look at exception volumes and resolution patterns. They review the compliance manager's (Persona 2) test results to avoid duplicating work.

When they shift to writing conclusions, they pivot to the COSO principle view — that's how their workpapers are organized. The data is the same, just reorganized. Then they export: PDF or structured output that drops into their audit file without reformatting. Timestamped, versioned, ready.

If they find a risk the library doesn't cover, or if they disagree with a reliance classification, they flag it — but they can't modify anything. Their comments become part of the record the compliance manager acts on.

### What they need from the product

| Need | Description |
| --- | --- |
| Scoped access | Workflows, controls, evidence for their engagement period/entity only. Internal auditors get write access for testing and findings; external auditors get read-only plus export. |
| Reliance designation visibility | First thing per workflow — determines their entire audit approach |
| Reliance evidence package | Auto-packaged: config/model version, sampling rationale, exception resolution, operating effectiveness |
| Human intervention metrics | Override/edit/rejection rates and trends — validates or challenges reliance |
| Capability type orientation | Understand what the AI does before moving to compliance assessment |
| COSO-aligned reporting view | Pivot by principle for workpaper structure |
| Evidence drill-down | One click per control: implementation, owner, run-level logs/exceptions/approvals |
| Compliance manager's work | Test results, reliance rationale, deficiencies, remediation status — review Persona 2's output to avoid duplicating work |
| Export | PDF or structured output, timestamped and versioned, ready for the audit file |

### How they use it

Concentrated usage during fieldwork (2–4 weeks for external; ongoing for internal). They log in, orient themselves to the AI landscape via capability types, scope in the relevant workflows, drill into controls and evidence, pivot to the principle view for their conclusions, and export. They may return during reporting to verify remediation.

### What we want this to be

The reason an auditor tells their client: "Keep using FloQast for your AI — it's the only place I can see what happened, verify the controls, and sign off without a separate request list."

---

## Design tensions worth discussing

**Auto-generated vs. curated risks library.** The capability-to-risk library gives everyone a strong starting point. But should the compliance manager be able to add risks the library didn't anticipate, adjust severity, or add supplementary controls beyond what the product enforces? Probably yes — with the auto-generated mapping as the foundation they customize from.

**Agent-level vs. step-level capability mapping.** Capabilities map at the agent level, not per step within the agent. Vicky was clear: "I don't think you're going step-by-step and mapping those to capabilities. That's too detailed." One agent maps to one or more of the 7 COSO capabilities. Risks flow from the capabilities assigned to the agent as a whole.

**Standard vs. custom risk libraries.** COSO capabilities are static — customers won't create new ones. Risks per capability are broad and standardized. The group concluded customers are unlikely to add custom capabilities or even custom risks. The findings of risk assessments vary per agent, but the risk categories themselves stay consistent. Build the risk library as a static, curated foundation. Allow customization of controls, not capabilities.

**Auto-generated risk assessments (human-in-the-loop).** When an agent is created in Transform, the compliance module should propose a risk assessment automatically: identify which COSO capabilities apply, inherit the associated risks, and suggest controls. The user accepts or adjusts. Vicky argued customers can't be expected to select capabilities from a dropdown — "it took us hours to get there, so I don't see our customers being able to select which capability" — so the product should propose and the human validates.

**Transform ↔ Compliance module synergy.** Evidence should flow automatically from Transform into the compliance module. Blaine: "You're gonna feel like you can't have one without the other, or life is so much better with both." The compliance module pushes tasks to accountants; Transform pushes evidence back. This cross-product integration is a core value proposition.

**Productized evals as compliance evidence.** Engineering-style evals (run expected data, compare to expected output) could run in the background on a cadence and serve as audit evidence. No other AI product does this today. Near-term value for deterministic workflows; critical for future autonomous agents.

---

## Summary

**Persona 1 (Accounting Manager — 1st Line of Defense):** They own the risks and execute the controls day to day. When they build an agent, the product proposes a risk assessment (capabilities → risks → controls) that they review and accept as the first line of defense. They bear recurring testing obligations — periodic accuracy checks, quality-rate monitoring, multi-level approvals — that the product automates as far as possible. Evidence is logged automatically.

**Persona 2 (IT / Compliance Manager — 2nd Line of Defense):** They own the AI compliance program. They maintain the agent inventory, facilitate risk assessments, design controls, assign ownership, and set up recurring compliance tasks. They ensure the first line is following the framework — so when auditors arrive, everything is already documented and evidenced.

**Persona 3 (Internal & External Auditor — 3rd Line of Defense):** Independent assurance over the AI control environment. They validate that the compliance manager's framework is sound, that control owners followed their obligations, and that the evidence supports reliance — or they expand substantive testing where it doesn't. Internal auditors have write access (flag issues, document findings); external auditors have read-only plus export. Both consume the same data, organized the same way.
