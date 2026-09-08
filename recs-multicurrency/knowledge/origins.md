# Origins

## How this project started

This prototype began as `playspace/recs-multicurrency/` on 2026-03-31, driven by the Figma design at `IROzHx3l0JXxVpYeCBPlxB` (node `5059:68917`).

**Key discovery:** The Figma design uses **FlowUI Table cell components** (`Table / Item-cell`, `Table / Content-cell`, `Table / Header-cell`, `Table / Avatar-cell`, `Table / Task-icon-cell`), NOT AG Grid — despite the Figma file being named "Recs - AG-Grid". This revealed that the figma-fq skill had no FlowUI Table matching path.

## What it proved

1. **FlowUI Table cell patterns work for complex financial tables** — the multicurrency view with currency group headers, accordion rows, and mixed cell types renders well using pure HTML `<table>` + FlowUI cell component patterns.

2. **figma-fq needed FlowUI Table detection** — the skill previously hard-routed all table detections to AG Grid. Now it classifies tables via step 2.6b and has a parallel FlowUI Table matching path (steps 3FL-5FL).

3. **Tailwind `@source` is required for `_shared` components** — discovered that all 4 prototypes using `playspace/_shared/` had broken sidebar rendering (38px instead of 56px) because Tailwind v4 doesn't follow Vite aliases. Fixed with `@source "../../_shared"` and documented in `prototype-setup.md`.

4. **figma-fq needed chrome awareness** — the skill's Screen Mode had no proactive detection of product chrome (sidebar, top nav). Added Chrome Pre-Scan (step SC-1) that auto-verifies known chrome using `_shared` components.

## Figma design variants

- **Default** (`5059:68918`, 1640×1100) — Standard view with single currency columns
- **Multi Currency On** (`5059:70971`, 1976×1140) — Adds "Functional (MXN)" and "Local (JPY)" group headers with expanded columns

## Reference prototype

Data model and mock data adapted from `playspace/recs-ag-grid/` (same `ReconciliationRow` interface, seeded random generator, FX rates). The key difference is the rendering: AG Grid → FlowUI Table.
