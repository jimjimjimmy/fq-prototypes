# Scheduler 1:Many

## Overview
Post-MVP exploration of FloQast's Scheduler concept — where a single schedule can orchestrate **many tasks** instead of one. The parent MVP (`projects/scheduler` on branch `project/scheduler`, owner: @minnienewman) lives inside Admin Settings as a one-job-per-schedule utility. This project explores the next iteration: Scheduler graduates out of Admin Settings into its own first-class module with a dedicated slot in the global left nav, and one schedule can drive an orchestrated sequence of tasks.

Also serving as Grant's first hands-on prototyping project.

## Goal
Stand up an interactive prototype that demonstrates the 1:Many model — a Schedule containing multiple ordered Tasks — and use it to explore the UX implications (creation flow, dependencies between tasks, run history at the schedule vs. task level, failure handling).

## Contributors
- @grantatherholt-floqast (Product Manager, project lead)

## Related Work
- **Parent MVP:** `project/scheduler` (not yet merged to main). Owner: Minnie Newman. The MVP prototype is the source of the global left rail, FlowUI setup, and core scheduling vocabulary. See `git show origin/project/scheduler:projects/scheduler/CLAUDE.md` for context. Coordinate with Minnie before changes that would affect the MVP scope.

## Status
Phase: exploration
Started: 2026-05-11

## Design System
Status: flowui
Notes: Mirrors the MVP scheduler's stack — React 18 + TypeScript + Vite + Tailwind 4 + FlowUI core/icons. Use the `flow-ui-design-system` skill and the `flow-ui-mcp` (`get-component-info`, `search-components`) before introducing any new UI component.

## Figma Files
- Project Schedule (working design): https://www.figma.com/design/OSbs5FfJ1zDwzDHlZl2kfh/Project-Schedule?node-id=91-107

## External Links
- Jira: https://floqast.atlassian.net/browse/IDEA-2576 (Discovery idea — shared with the MVP)
- Confluence: none

## Key Knowledge
- (Add research, decisions, and exploration notes here as the project grows.)

## Prototype
- **Stack:** React 18, TypeScript, Vite, Tailwind 4, FlowUI (`@floqastinc/flow-ui_core`, `@floqastinc/flow-ui_icons`)
- **Location:** `prototype/`
- **Run:** `cd prototype && npm install && npm run dev`
- **App shell:** `SchedulerAppShell.tsx` wraps a global FQ left rail (`SideNav.tsx`, adapted from the MVP) with a clock icon for the Scheduler slot in the lower nav group. The content area is intentionally blank — that's the canvas for 1:Many exploration.

## For Claude
When working on this project:
- Read `knowledge/` files for context before making suggestions
- This is an exploratory prototype, not production — prioritize clarity of the idea over polish
- The parent MVP (`project/scheduler`) is the source of truth for *current* scheduler vocabulary. Use the same terms (Job, Run, Schedule, etc.) unless a 1:Many concept genuinely needs a new word — flag new vocabulary to Grant first
- Keep the global FQ left rail consistent with the MVP version
- Don't import code from Minnie's branch into this project — duplicate cleanly to keep ownership separate. If the MVP changes a shared pattern, surface it to Grant rather than auto-syncing
- Track Figma file links — update this section when new files are added
