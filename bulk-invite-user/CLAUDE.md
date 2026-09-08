# Bulk Invite User

## Overview
Bulk user creation capability that lets an admin input details for multiple users
simultaneously rather than setting them up one at a time. Lives within the Admin
Settings → Team Members area of FloQast. Built from an existing Figma design using
real FlowUI / Storybook components.

## Goal
Eliminate the repetitive manual effort of one-at-a-time user data entry —
accelerating setup timelines and improving the administrative experience for
large-userbase customers.

## Contributors
- @grant-atherholt (Product Manager)

## Status
Phase: prototyping
Started: 2026-06-02

## Design System
Status: flowui
Notes: Build from the Figma source of truth using published FlowUI components.
Pull component props from `flow-ui-mcp` and design intent from the Storybook /
zeroHeight MCP before implementing any UI. Look up color tokens — never guess hex.

## Figma Files
- ⚙️ Admin Settings – Team Members (Bulk Invite entry point): https://www.figma.com/design/gkhrG2o5HuqbiXw0dQOdUy/%E2%9A%99%EF%B8%8F-Admin-Settings--Team-Members?node-id=2198-6632
  - File key: `gkhrG2o5HuqbiXw0dQOdUy`
  - Starting frame/node: `2198:6632`

## External Links
- Jira: none
- Confluence: none

## Key Knowledge
- (none yet — research and design notes will be added to `knowledge/` as the project evolves)

## For Claude
When working on this project:
- Read knowledge/ files for research context before making suggestions
- The prototype lives in `prototype/` (Vite + React + TS + Tailwind v4 + FlowUI)
- This is built **from Figma** — treat the Figma frame above as the source of truth
  for layout and content; treat the live FlowUI component library as the source of
  truth for implementation
- Use the `figma-match` / `figma-fq` skills to extract the design and the
  `flow-ui-design-system` skill for component implementation
- Pull component props from `flow-ui-mcp` (`get-component-info`, `search-components`)
  and design guidance from the Storybook/zeroHeight MCP before implementing any UI
- Look up FlowUI color tokens from `knowledge/design-system/foundation/colors.md` —
  never hardcode a guessed hex
- Track Figma file links — update the Figma Files section when new frames are added
