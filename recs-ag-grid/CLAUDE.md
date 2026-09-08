# Recs AG Grid

## Overview
Prototype of FloQast's Reconciliations page rebuilt with **real AG Grid** (ag-grid-react +
ag-grid-community + ag-grid-enterprise), to compare a true grid engine against the
FlowUI-native `<table>` approach used in the sibling `recs-multicurrency` project.

## Goal
Demonstrate the recs multicurrency view in AG Grid: Standard / Multi Currency toggle,
tree-data row grouping for the folder hierarchy, total footer rows, and custom cell
renderers for the currency columns. Match the two Figma states.

## Status
Phase: prototyping
Started: 2026-06-25

## Design System
Status: flowui
Notes: AG Grid with the FloQast-branded `themeQuartz` config (see `src/theme.ts`).
Theming API is built into `ag-grid-community` (v33+). Tree data + group total rows are
AG Grid Enterprise features.

## Figma Files
- Recs AG Grid: https://www.figma.com/design/IROzHx3l0JXxVpYeCBPlxB/Recs---AG-Grid
  - Default / Standard state: node `5059:68918`
  - Multi Currency On: node `5059:70971`

## Scope
This prototype focuses on the **recs table view + Standard/Multi Currency toggle** only.
It deliberately does NOT port the full `recs-multicurrency` app shell (demo-scenario menu,
setup banners, FX Rates pages, setup wizard). Data model and mock data are ported from
`recs-multicurrency` (same `ReconciliationRow` type).

## For Claude
- Use the `flow-ui-design-system` skill for component/token work.
- AG Grid theme lives in `src/theme.ts` - always apply `floqastGridTheme`.
- Use `figma-match` / `design-to-code-qa` for design matching against the two nodes.
- Tree data and group total rows require `ag-grid-enterprise` (no license key = watermark).
