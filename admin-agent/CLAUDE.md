# Admin Agent

## Overview
An AI agent that assists FloQast admins with their work. The agent acts as an
admin-facing copilot — understanding an admin's intent and helping them navigate
and complete tasks across the product. The initial focus is **settings &
configuration**: helping admins find, understand, and safely change FloQast
configuration without hunting through nested menus.

## Goal
Reduce the time and expertise required to administer FloQast — letting an admin
describe what they want in plain language and have the agent guide or execute the
configuration change, rather than knowing exactly where every setting lives.

## Contributors
- @grant-atherholt (Product Manager)

## Status
Phase: exploration
Started: 2026-06-05

## Design System
Status: flowui
Notes: Build with published FlowUI components. Pull component props from
`flow-ui-mcp` and design intent from the Storybook / zeroHeight MCP before
implementing any UI. Look up color tokens — never guess a hex.

## Figma Files
- (none yet — add frames here as designs are created)

## External Links
- Jira: none
- Confluence: none

## Key Knowledge
- (none yet — research and design notes will be added to `knowledge/` as the project evolves)

## Prototype setup
The prototype uses FloQast's private packages (`@floqastinc/*`), served from
GitHub Packages. `npm install` will 404 unless npm knows to route the
`@floqastinc` scope there. The repo gitignores all `.npmrc` (so no token is ever
committed), so each machine needs this locally:

- `prototype/.npmrc` (gitignored) must contain:
  `@floqastinc:registry=https://npm.pkg.github.com`
- `~/.npmrc` must have a GitHub Packages auth token with `read:packages` scope:
  `//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}` plus
  `export NODE_AUTH_TOKEN=$(gh auth token)`

See the `deploy-prototype` skill for the full auth/troubleshooting guide.

## For Claude
When working on this project:
- Read knowledge/ files for research context before making suggestions
- The prototype lives in `prototype/` (Vite + React + TS + Tailwind v4 + FlowUI)
- First-scope is settings & configuration; keep early exploration narrow to a
  concrete admin scenario before broadening the agent's surface area
- This is an **AI agent** concept — think through the interaction model
  (conversational? inline suggestions? confirm-before-act?), trust/safety
  (previewing changes, undo, permissions), and how the agent surfaces what it can
  and can't do. Frame design choices in terms of admin trust and product goals.
- Use the `flow-ui-design-system` skill for all frontend work
- Pull component props from `flow-ui-mcp` (`get-component-info`, `search-components`)
  and design guidance from the Storybook/zeroHeight MCP before implementing any UI
- Look up FlowUI color tokens from `knowledge/design-system/foundation/colors.md` —
  never hardcode a guessed hex
- Track Figma file links — update the Figma Files section when new frames are added
