# Audit Report Reboot

## Overview
Redesign of the Admin Settings > Reports page in FloQast. Expanding the Audit Report with a more comprehensive product list, workspace groupings, event type filters, and updated export options.

## Goal
Deliver a refined audit report UI that covers all FloQast products and surfaces configurational vs. operational event filtering.

## Contributors
- @gaurav.dhamija (PM)

## Status
Phase: prototyping
Started: 2026-05-19

## Design System
Status: flowui
Notes: React + Vite + TypeScript + Tailwind v4. Uses FlowUI tokens via `Theme.apply()` and the shared `GlobalNavSidebar` from `_shared/`.

## Figma Files
- None yet

## External Links
- Jira: none
- Confluence: none

## Key Knowledge
- No knowledge files yet

## For Claude
When working on this project:
- The prototype is a React + Vite + TypeScript app at `prototype/`. Entry: `prototype/src/App.tsx`.
- Run locally with `npm run dev --prefix projects/auditreportreboot/prototype` (port 5183), or start the "Audit Report Reboot" preview from `.claude/launch.json`.
- The original single-file HTML prototype is preserved at `prototype/index.legacy.html` for reference.
- Shared chrome (`GlobalNavSidebar`, etc.) lives in `projects/auditreportreboot/_shared/`. Imported via the `@shared/*` alias.
- The Admin Settings top nav is in `prototype/src/components/TopNav.tsx` with Reports active.
- The four-column report builder content is in `prototype/src/components/ReportBuilder.tsx`.
- Uses FlowUI color tokens (brand green #1FAC76) and the `Theme.apply()` setup from `main.tsx`.
- `node_modules`, `dist`, `.vite` are gitignored.
- Read knowledge/ files for research context before making suggestions.
