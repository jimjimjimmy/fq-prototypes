# Detect Prototype

## Overview
Exploration of how FloQast surfaces anomalous transactions for user review and resolution. The prototype models an AI-powered anomaly detection inbox — flagged transactions organized by risk score, with inline review and comment workflows.

## Goal
Establish a high-fidelity concept prototype for the Detect experience. Explore how users triage, investigate, and resolve flagged transactions within a structured inbox model.

## Contributors
- @TylerDav (Sr Mgr, Product Design)

## Status
Phase: prototyping
Started: 2026-04-23

## Design System
Status: migrating to FlowUI
Notes: Originally built with shadcn/ui + Tailwind CSS v4. Now moving toward FlowUI alignment — new components and visual updates should match FlowUI styling and tokens. Where the FlowUI npm packages aren't available, replicate FlowUI's visual look using Tailwind (reference Figma + Flow UI MCP for specs).

## Figma Files
- (none yet)

## External Links
- Jira: none
- Confluence: none

## Key Knowledge
- (none yet — add to knowledge/ as the project develops)

## For Claude
When working on this project:
- Read knowledge/ files for research context before making suggestions
- Uses npm (not pnpm) — run `npm install` and `npm run dev` from `prototype/`
- Design system is migrating to FlowUI — favor FlowUI styling/tokens for new work; if FlowUI packages aren't installed, match the visual look using Tailwind (reference Flow UI MCP for component specs)
- **Always use FlowUI semantic colour tokens, never guess hex values.** When a colour is needed (success/warning/danger/info/highlight/neutral, hover/active/focus states, brand/severity/risk treatments), look up the exact token from `knowledge/design-system/foundation/colors.md` and the semantic-mapping tables in `components/table/ag-grid.md` (or the relevant component doc) before picking a value. Examples:
  - Success → bg `#ecfff8` (brand-50), text `#1fac76` (brand-600)
  - Warning → bg `#fff8eb` (warning-secondary), text `#db7712` (warning-primary)
  - Brand green → `#1fac76` default · `#1c895f` hover · `#186749` active
  - Neutral border → `#cbd2e1` default · `#e1e6ef` lighter
  Inline a short comment next to the hex value naming the token (e.g. `bg-[#ecfff8] /* --flo-sem-color-success-background */`) so the intent is auditable.
- Prototype runs on port 5177 (`npm run dev` from prototype/)
- App entry: `prototype/src/app/App.tsx` (1500+ line single-component file from Figma Make)
- Styles: `prototype/src/styles/index.css` imports fonts, tailwind, and theme
