# Transform Extract

## Overview
PDF extraction experience for FloQast — users upload a zip of source documents (invoices, statements, leases), pick or build an extraction template, process the batch, validate per-document extracted values, and approve. Prototype explores the template-builder UX, the values vs editor modes, an AI chat bar that can modify the template conversationally, and the state transitions between fresh/stale results.

## Goal
Define a clear, scalable UX for AI-assisted document extraction that handles the full lifecycle: template creation, processing, validation, approval, and the messy mid-flow cases (template changes, file replacement, unlocking approved data).

## Contributors
- @johnwoo (PM + design)

## Status
Phase: prototyping
Started: 2026-05-13

## Design System
Status: hybrid
Notes: Current prototype is hand-rolled CSS (Tailwind-style hex values). FlowUI audit completed — see `prototype/flowui-audit.md`. Migration to FlowUI components is planned but not blocking on UX exploration.

## Figma Files
- TBD

## External Links
- Jira: TBD
- Confluence: TBD

## Key Knowledge
- `knowledge/state-diagram.md` — right-panel state model (A/B/C/D/E), transitions, invalidate semantics, banner copy. **Read this before changing any right-panel flow.**
- `knowledge/state-diagram-original.png` — original diagram screenshot (pre-decisions, TBDs intact) for reference
- `prototype/flowui-audit.md` — FlowUI alignment audit (color/token deltas, component mapping, deviations)
- `prototype/template-builder.html` — current prototype (values mode + editor mode + AI chat + Excel-like table view)

## For Claude
When working on this project:
- Read `prototype/flowui-audit.md` before recommending design changes — color/token mappings are documented there
- The prototype follows a "stale on invalidate" model: any template or file change while in D (results showing) wipes processed values and resets Process button to primary. See `prototype/template-builder.html` invalidate() helper. Preserve this pattern when adding new flows.
- Design system is `hybrid`: use the `flow-ui-design-system` skill for FlowUI component lookups; the prototype itself is currently freeform CSS pending migration.
- Pull component props from the `flow-ui-mcp` (`get-component-info`, `search-components`) before recommending FlowUI swaps.
- The UX punch list from the initial audit (P0/P1/P2 items — navFile no-op, file-bar error badges, hardcoded validation map, etc.) is still pending. Surface relevant items when planning new work.
