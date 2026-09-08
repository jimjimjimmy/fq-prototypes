# Recs Multicurrency Prototype

## What This Is
Prototype of FloQast's Reconciliations page with Standard/Multi Currency toggle.
Built with FlowUI Table components (NOT AG Grid) to test FlowUI table patterns from Figma.

## Design System
- **design-system:** flowui-table
- **No AG Grid** — this prototype uses native HTML `<table>` with FlowUI cell component patterns
- Use `flow-ui-design-system` skill for any component work

## Figma Reference
- Design: https://www.figma.com/design/IROzHx3l0JXxVpYeCBPlxB/Recs---AG-Grid?node-id=5059-68917
- Default state: node `5059:68918`
- Multi Currency state: node `5059:70971`

## Tech Stack
- React 18 + TypeScript + Vite 8
- Tailwind CSS v4 (imported WITHOUT layer — see root CLAUDE.md)
- FlowUI core + icons (no AG Grid)
- Mock data from recs-ag-grid (shared ReconciliationRow type)

## Key Patterns
- Currency formatting: `Intl.NumberFormat` with `fontVariantNumeric: 'tabular-nums'`
- Table cells: Composed from FlowUI component patterns (Avatar-cell, Content-cell, etc.)
- Toggle: Standard/Multi Currency button pair switches column layout
- Grouping: Folder-based accordion with expand/collapse + Total footer rows
