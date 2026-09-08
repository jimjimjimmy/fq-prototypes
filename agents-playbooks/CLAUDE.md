# Agents & Playbooks

## Overview
A fully functional prototype for FloQast's Agents and Playbooks product. Covers the Agent Library
(folder hierarchy, playbook cards, empty states), the full Agent creation flow (AutoBuild chat
interface), the Playbook Viewer (content, test run, activity log, approval flow), and a live
cross-prototype integration with the COSO AI RCM prototype.

## Goal
Demonstrate the end-to-end lifecycle of an AI agent — from creation and COSO-compliant testing,
through approval and go-live, to automatic registration in the compliance manager's risk control matrix.

## Contributors
- @scottbai (PM/Designer)

## Status
Phase: prototyping
Started: 2026-04-08

## Design System
Status: flowui
Notes: Use Flow UI components wherever available. Fall back to custom styled components only when
no Flow UI equivalent exists. Always check flow-ui-mcp for live component props before implementing.

## Figma Files
- Agent Workspace: https://www.figma.com/design/WF9wfy2TeenerKzOz1ULOT/AI-Native-FloQast?node-id=1956-21121

## External Links
- Jira: none
- Confluence: none

## Key Knowledge
- Load the `agents-playbooks` skill for full domain knowledge (terminology, permissions model, phases, anti-patterns)

## Prototype Scope (Phase 1)
### Agent Library
1. Empty state — "Start by creating a folder"
2. Folder selected, no agents — folder hierarchy + empty right panel
3. Folder with agents — Playbook cards with Live/Draft badges

### New Agent Creation Flow (fully interactive, chat-based)
1. Blank — FloQast Agents headline + textarea + 3 suggestion cards
2. Typed — User has entered a request
3. Processing — AI responds with name radio options + processing status
4. Single-select question — paginated card (1 of N)
5. Multi-select question — paginated card (2 of N)
6. File upload — drag-and-drop card
7. Split view — chat history left, live Playbook document preview right

## Prototype Scope (Phase 2)
### COSO AI RCM Integration
1. Shield icon in GlobalNav loads the COSO AI RCM prototype in an iframe (full-screen swap)
2. When Three-Way Match Review (pb-7) is set to Live, a postMessage fires to the RCM iframe
3. RCM receives the message and injects Three-Way Match as a new agent in Key Systems → AI Agents
4. New agent appears at the top of the list with amber "New" badge and "Awaiting review" reliance chip

### Integration Architecture
- agents-playbooks hosts RCM at `http://localhost:5179/projects/coso-ai-rcm/` with `?embedded=true`
- `?embedded=true` suppresses RCM's own IconRail (no double nav)
- RCM starts on `key-systems` view when embedded (skips splash screen)
- postMessage payload: `{ type: 'agent-live', agentId: 'three-way-match' }`
- Three-Way Match capabilities: ING (data ingestion), PST (transaction processing), ORC (workflow orchestration)
- Dev servers: agents-playbooks on 5180, coso-ai-rcm on 5179
- To start both with a single command: `npm run dev:all` from `prototype/` (or `bash start.sh` from `projects/agents-playbooks/`)
- `start.sh` auto-creates the coso-ai-rcm worktree at `~/tmp/coso-ai-rcm` on first run — no manual setup needed

## For Claude
When working on this project:
- Load the `agents-playbooks` skill for domain terminology and product logic
- Load the `flow-ui-design-system` skill before any frontend component work
- Use `flow-ui-mcp` (`get-component-info`, `search-components`) for live Flow UI props
- The prototype lives in `prototype/` — it's a Vite + React + TypeScript app
- The COSO AI RCM companion prototype lives at `~/tmp/coso-ai-rcm` (git worktree from `project/coso-ai-rcm`)
- To start both dev servers: run `npm run dev:all` from `prototype/` — this calls `start.sh` which handles worktree setup on first run
- Both dev servers must be running for the cross-prototype integration (shield icon) to work
- Figma node IDs for key screens:
  - Empty library: 1956:23925
  - Library with folders (empty): 1956:24081
  - Library with agents: 1956:24375
  - New Agent (blank): 1956:21527
  - New Agent (typed): 1956:21692
  - Processing / name select: 1956:21857
  - Single-select question: 1956:22030
  - Multi-select question: 1956:22634
  - File upload: 1956:22404
  - Split view (chat + playbook): 1956:23191
  - Playbook viewer: 1956:24723
- Run `npm run dev` from `prototype/` to start the dev server
- Always check `get_design_context` on a specific node before implementing a component
