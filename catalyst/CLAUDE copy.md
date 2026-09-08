# Project Catalyst

## Overview
Project Catalyst is a UX redesign initiative for FloQast Close — rethinking navigation, task management, and AI integration. It includes a working React/TypeScript prototype and deep research into FloQast's current architecture, personas, and data model.

## Goal
Demonstrate a task-centric UX vision for FloQast Close at FQGO Spring 2026, moving away from the folder-centric model toward search-first navigation, rich task drill-downs, and integrated AI assistance.

## Contributors
- @bellis (Product Design Manager, project lead)

## Status
Phase: prototyping
Started: 2026-02-01

## Design System
Status: hybrid
Notes: Prototype uses shadcn/ui components (src/components/ui/) styled to approximate FlowUI patterns. Not directly importing FlowUI — this is an exploration prototype.

## Figma Files
- Catalyst explorations: check with @bellis for current Figma links

## External Links
- Jira: none
- Confluence: referenced in knowledge/fqcurrent/ docs (internal FloQast Confluence)

## Key Knowledge
- `knowledge/fqcurrent/` — Current state analysis: Close product deep dive, technical architecture, project reference
- `knowledge/fqcurrent/CLAUDE.md` — Detailed context on the research documents
- `knowledge/working/` — Working research phases: personas/journeys, task data model, system architecture, use cases, narrative alignment
- `guidelines/Guidelines.md` — Design and interaction guidelines for the prototype
- `docs/architecture.md` — Prototype code architecture
- `docs/plan.md` — Development plan and roadmap
- `docs/design-decisions.md` — Key design decisions and rationale

## Prototype
- **Stack:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Location:** `prototype/`
- **Run:** `cd prototype && npm install && npm run dev`
- **Key patterns:** Persona-driven demo (persona switcher), mock data layer (src/data/), context-based state (src/contexts/)

## For Claude
When working on this project:
- Read knowledge/ files for research context before making suggestions
- Read `guidelines/Guidelines.md` before making UI changes
- Read `docs/architecture.md` to understand prototype structure
- The prototype is a design exploration tool, not production code — prioritize visual fidelity and demo-ability
- SVG imports in `src/imports/` are Figma-generated — don't modify them by hand
- Persona data in `src/data/personas/` drives the demo experience
