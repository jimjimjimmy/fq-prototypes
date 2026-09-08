# Mike UX Feedback — April 2026

## Overview
A shared project for capturing, transcribing, and synthesizing UX feedback sessions from Mike Whitmire (CEO & Co-founder, FloQast). Sessions typically take the form of recorded walkthroughs where Mike reacts to prototypes and live product. The goal is to extract structured, actionable product insights from these sessions and make them available to the broader product and design team.

## Goal
Capture and synthesize Mike's recurring UX feedback sessions into actionable product insights.

## Contributors
- @gregjones (Sr. Director, Product Design — project lead)

## Status
Phase: research
Started: 2026-05-07

## Design System
Status: flowui
Notes: Prototype uses FlowUI components. Use the flow-ui-mcp for live component props and design guidance before implementing any UI.

## Figma Files
- Mike Feedback FigJam: https://www.figma.com/board/mpbfRvWdGUAofjqobttnq1/Mike-Feedback?node-id=44-27811&p=f&t=sEFIrWwMtIf2dPSE-0

## External Links
- Jira: none
- Confluence: none

## Key Knowledge
- `knowledge/session-2026-05-07.md` — Video transcript summary: Journal Entries UX feedback (~24 min)

## For Claude
When working on this project:
- Read knowledge/ files for prior session context before making suggestions — patterns repeat across sessions
- Mike is CEO & Co-founder; his feedback carries strategic weight, not just UX preference
- Look for recurring themes across sessions (search, alignment, complexity, collapsibility) — these are signals for roadmap priority
- If design-system is `flowui` or `hybrid`: use the `flow-ui-design-system` skill for all frontend work. Pull component props from the `flow-ui-mcp` (`get-component-info`, `search-components`) and design guidance from the zeroHeight MCP (`get-page`, `list-pages` with styleguide ID `99570`) before implementing any UI. See `knowledge/design-system/flow-ui-mcp.md` for setup and tool details.
- The FigJam file contains screenshots Mike has annotated — consult it when implementing feedback
- Each session file in knowledge/ should follow the naming convention: `session-YYYY-MM-DD.md`
