# FDM Rollup

## Overview
Prototype for FDM (Financial Data Model) in-app rollup structure editing. Today, customers manage their grouping hierarchy through an Excel template round-trip — download, edit, re-upload — which is high-friction, breaks mapping rules on inadvertent edits, and offers no real-time visibility while mapping accounts. This project explores bringing the rollup hierarchy into the app as a first-class object alongside the mapping table.

## Goal
A working prototype that demonstrates a side-by-side rollup structure + mapping table experience, with in-app CRUD on hierarchy nodes (rename, add, delete, reorder, indent/outdent) and account reassignment. Shareable with FDM engineers to shape scope.

## Contributors
- @edith.espinoza (Designer — supporting)
- Carmen (Designer — lead, returns Mon/Tue)
- Will Guardado (PM)
- Kyle Kodani (Tech Lead)

## Status
Phase: prototyping
Started: 2026-04-28

## Design System
Status: flowui
Notes: Using FlowUI components + Tailwind v4. Side-by-side widget layout (rollup left, mapping right) per Will's call. Mapping tabs move as one widget — do not allow individual tabs to be dragged out.

## Figma Files
- Carmen — FDM — Dimension Grouping — AI Assisted Groupings (Frame 2.2): https://www.figma.com/design/agLRzWvmpIWaptvKRIZ7Wq/FDM--Dimension-Grouping---AI-Assisted-Groupings (file key: `agLRzWvmpIWaptvKRIZ7Wq`)
- Edith — WIP user flow (rollup setup paths: empty / example / AI agent / Excel upload)

## External Links
- Jira (PRD): IDEA-2246 — https://floqast.atlassian.net/browse/IDEA-2246
- Confluence (PRD): https://floqast.atlassian.net/wiki/x/IoDOCgE
- Prerequisite: IDEA-2308 (Grouping Template Flexibility — Harrison's epic)
- Related: IDEA-1989 (AI Structuring Agent), IDEA-2068 (AI Assisted Mapping), IDEA-2307 (Destination CRUD), IDEA-2279 (Effective Dating)

## Reference Materials
- Will's HTML prototype: `/Users/edithesp/Downloads/IDEA-2246-prototype 6.html` — single-file React + Tailwind, 607-node sample hierarchy. Treat as intent reference, not source of truth (Will flagged "Claude code hallucinations" — page-level save was misrepresented as per-panel).
- Gong call transcript (2026-04-28, Will + Edith) — see `knowledge/gong-call-takeaways.md`

## Key Knowledge
- `knowledge/prd-summary.md` — IDEA-2246 requirements at a glance
- `knowledge/gong-call-takeaways.md` — what the Will + Edith sync added beyond the PRD
- `knowledge/scope-decisions.md` — what's being faked vs. built real

## For Claude
When working on this project:
- Read `knowledge/` files for research context before making suggestions
- **Use FlowUI components** — pull props from `flow-ui-mcp` (`get-component-info`, `search-components`) and design guidance from zeroHeight MCP before implementing UI. See `knowledge/design-system/flow-ui-mcp.md` in the repo root.
- **Save model is page-level**, not per-panel. Don't replicate the prototype's per-panel save buttons — entire page saves together (resolves PRD Q1).
- **Layout is opinionated**: rollup hierarchy left, mapping table right. Mapping tabs move as a single widget.
- **Faked features (don't build the real version):** rule-preservation logic, AI agent output, Excel up/download, save persistence beyond a toast.
- **Real features for Phase 1–2:** layout shell, expand/collapse, search, inline rename, add/delete/duplicate nodes, drag-reorder, indent/outdent, mapped-items count.
- Treat Will's HTML prototype as a visual/intent reference only — do not port its minified source. Re-implement clean.
