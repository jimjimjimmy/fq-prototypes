# PRD Summary — IDEA-2246

**Source:** [Confluence](https://floqast.atlassian.net/wiki/x/IoDOCgE) · **Status:** Draft · **PM:** Will Guardado · **Tech Lead:** Kyle Kodani · **Quarter:** Q2 2026

## Problem
FDM roll-up management is Excel-only today. Any change — adding a destination, fixing a label, reorganizing the hierarchy — requires download, edit in Excel, re-upload. This breaks data integrity (row shifts silently detach mapping rules) and offers no live visibility while users map accounts. It's also a blocker for the AI Structuring Agent and real-time hierarchy validation, which both require the hierarchy to be a first-class in-app object.

## Scope
Direct continuation of **IDEA-2308** (Template Flexibility — Harrison's epic, which relaxes the validation layer). This PRD brings hierarchy management into the app.

## Goals
1. Eliminate the Excel cycle for routine changes
2. Provide real-time hierarchy visibility
3. Support in-context account reassignment
4. Preserve data integrity — renames/moves keep rule associations intact
5. Retain Excel upload as a parallel escape hatch
6. Support large hierarchies performantly (500+ nodes)

## P0 Requirements (13)

| ID | What | Notes |
|---|---|---|
| P0-01 | Roll-up Structure panel | Opens with full hierarchy, layout persists across sessions |
| P0-02 | Hierarchy display + expand/collapse | Individual + bulk expand/collapse, performant at 500+ nodes |
| P0-03 | Inline rename | Double-click to edit, preserves all rule associations |
| P0-04 | Add nodes | Add child / sibling below / duplicate (with subtree) |
| P0-05 | Delete nodes | Confirm count of affected accounts; prompt for replacement destination |
| P0-06 | Drag-and-drop reorder | Visual drop indicator, subtree moves with parent |
| P0-07 | Indent/outdent | Move depth without re-entering data; rules preserved |
| P0-08 | Download/upload Excel | Parallel path; upload uses IDEA-2308 validation |
| P0-09 | Save | Explicit save with unsaved-changes warning on close (TBC — see Open Q1) |
| P0-14 | View mapped items per destination | Count indicator + expand to see accounts and mapping method |
| P0-15 | Reassign via searchable picker | Rule-based mapping → direct map with override warning |
| P0-16 | Reassign via drag-and-drop | Visually distinct from hierarchy reorder |
| P0-17 | Configure level names | Rename "Level 1" → "Statement", etc., persists across nodes |

**P2-18:** Search/filter within roll-up list

## Out of Scope
- Template validation rule changes (IDEA-2308)
- AI-assisted hierarchy structuring (IDEA-1989)
- Multi-select drag for bulk reassignment
- Undo/redo
- Effective dating (IDEA-2279)
- FlexLayout dockable panel system (split to separate epic Apr 9)

## Open Questions (status as of 2026-04-28)

| Q | PRD Status | Resolution from Gong call |
|---|---|---|
| Q1 — Save model: explicit vs. auto-save? | Open | **Resolved:** page-level save (whole page commits together; per-panel save is misleading) |
| Q2 — Deletion vs. published/draft state? | Open | Still open |
| Q3 — Drag-and-drop feasibility in target Figma frame? | Open | **Partial:** opinionated FlexLayout — hierarchy reorder yes, mapping tabs move as one widget (not individually draggable) |
