# Recs Multicurrency

## Overview
Prototype of FloQast's Reconciliations page with Standard/Multi Currency toggle, built with FlowUI Table components (not AG Grid). Originated from a Figma design exploration that also drove improvements to the figma-fq skill's table detection and chrome awareness.

## Goal
Demonstrate the recs multicurrency view using native FlowUI Table cell patterns. Validate figma-fq's new FlowUI Table matching path and chrome pre-scan.

## Contributors
- @benjaminell_floqast (Product Design Manager)

## Status
Phase: prototyping
Started: 2026-03-31

## Design System
Status: flowui
Notes: Pure FlowUI Table — no AG Grid. Uses FlowUI Table cell patterns (Content-cell, Item-cell, Avatar-cell, Task-icon-cell) composed in HTML `<table>` structure.

## Figma Files
- Recs AG Grid (multicurrency designs): https://www.figma.com/design/IROzHx3l0JXxVpYeCBPlxB/Recs---AG-Grid?node-id=5059-68917
  - Default state: node `5059:68918`
  - Multi Currency On: node `5059:70971`

## External Links
- Jira: none
- Confluence: none

## Key Knowledge
- `knowledge/origins.md` — How this project started and what it proved about FlowUI tables

## For Claude
When working on this project:
- Read knowledge/ files for research context before making suggestions
- This prototype uses `_shared` components — ensure `@source "../../_shared"` is in `src/index.css`
- Data model and mock data are adapted from `playspace/recs-ag-grid/` — same `ReconciliationRow` type
- Use `flow-ui-design-system` skill for any component work
- Use `figma-fq` skill (with the new FlowUI Table path) for design matching
- The Figma file name says "AG-Grid" but the actual design uses FlowUI Table cell components
