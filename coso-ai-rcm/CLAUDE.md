# COSO AI RCM

## Overview
Designing the product experience for FloQast's COSO-aligned AI Risk and Control Matrix (RCM) — the compliance program around AI agents used in financial close. The work is structured around three personas mapped to the **three lines of defense**: the Accounting Manager (1st line, owns risks and runs controls), the IT/Compliance Manager (2nd line, designs and maintains the program), and the Internal/External Auditor (3rd line, validates).

## Goal
A "command center for AI governance" that turns FloQast's AI activity into auditable, capability-mapped evidence — without the accounting team having to do anything extra. Auto-populated agent inventory, auto-generated risk assessments, recurring task orchestration, evidence repository, and gap tracking.

## Contributors
- @martinmij (Senior Product Designer)

## Status
Phase: exploration
Started: 2026-05-07

## Design System
Status: flowui
Notes: The current Figma entry-point design uses FlowUI-style components — sidebar nav, data tables, cards with tabs. New screens proposed in this project should follow FlowUI conventions.

## Figma Files
- COSO AI (entry points, node `2030:2249`): https://www.figma.com/design/s5mhthDXZDrhn7T4yP8UMe/COSO-AI?node-id=2030-2249

## External Links
- Persona user stories (Confluence): https://floqast.atlassian.net/wiki/spaces/Endor/pages/4535910714/COSO+AI+RCM+Persona+User+Stories
- Key Systems and Key Reports (Confluence): https://floqast.atlassian.net/wiki/spaces/Yavin/pages/3121086467/Introduction+to+Key+Systems+and+Key+Reports
- Persona workflow diagram: `knowledge/po-accruals-workflow.svg` (PO Accruals AI-augmented process, condensed)
- Jira: none
- Claude artifact (AI Workflows RCM): private link, content captured in `knowledge/ai-workflows-rcm-artifact.md`

## Three Personas (Three Lines of Defense)
- **Persona 1 — Accounting Manager (1st line):** owns risks, runs controls, performs recurring testing on agent outputs
- **Persona 2 — IT/Compliance Manager (2nd line):** owns the AI compliance program — agent inventory, risk assessments, control design, monitoring, gap tracking
- **Persona 3 — Internal & External Auditor (3rd line):** independent assurance; validates the framework and the evidence

## Key Knowledge
- `knowledge/persona-user-stories.md` — Snapshot of the Confluence persona doc (kept locally for offline reference)
- `knowledge/po-accruals-workflow.svg` — AI-augmented PO Accruals process diagram with HITL checkpoints, reliance points, and the 9 AI governance controls
- `knowledge/persona-2-experience.md` — Walkthrough of the Persona 2 (IT/Compliance Manager) experience screen by screen *(in progress)*
- `knowledge/persona-1-journey-maps.md` — Two flowcharts for Persona 1 (creation flow + day-to-day operation), also rendered in FigJam
- `knowledge/component-patterns.md` — Catalog of reusable prototype patterns + how-to-adopt guide for other designers
- `knowledge/ai-workflows-rcm-artifact.md` — Reference notes from the Claude design artifact *(to be captured)*

## For Claude
When working on this project:
- Read `knowledge/persona-user-stories.md` first — it is the foundation for every design decision
- Treat the **three lines of defense** as the structural framework. Persona 2 specifically is the 2nd line — distinct from auditors, distinct from the accounting team
- The 7 COSO capabilities are static; risks per capability are standardized; controls are customizable. Don't propose UI that lets users invent new capabilities
- Auto-generation with human-in-the-loop is the dominant interaction pattern (per Vicky LeVay: "it took us hours to get there, so I don't see our customers being able to select which capability")
- Existing FloQast IA already has "Key Systems" and "Key Reports" — the current Figma design surfaces AI agents inside Key Systems. Respect that hook unless there's a strong reason to deviate
- Use the `flow-ui-design-system` skill for any UI work. Pull component props via the `flow-ui-mcp` and design guidance from zeroHeight before implementing. The Storybook is the source of truth: https://flow-ui.fq1.floqast.engineering/storybook/
- This project has no prototype yet. If/when one is added, follow the standard Vite + React + FlowUI setup
