# PRD 2a: Field Mapping — Visual Refresh + AI-Suggested Mappings

**Source:** [Confluence — 2 of 4](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449927443)
**Status:** DRAFT
**Last updated:** Mar 19, 2026
**Owner:** Alex Kearns
**Target release:** 2026-06-30

---

## Summary

Covers the Field Mapping page redesign and AI-suggested source-to-target field mappings. This PRD focuses on the visual refresh of the field mapping grid, AI auto-suggestions for initial draft mappings, many-to-one source field mapping, and custom field support.

Transformation logic definition (function-based and AI-assisted rule authoring) is out of scope for this release and covered in [PRD 2b: AI-Assisted Transformation Functions (9/30)](prd-2b-field-mapping-transformations.md).

**This is the highest-effort, highest-risk step in Model configuration.** Errors propagate silently into downstream FQ products.

## Key Requirements

### FM1: Field Mapping List (High)
- All mandatory FQ target fields pre-populated for the selected domain
- Each row shows field name, data type, current mapping status
- Unmapped mandatory fields visually distinguished
- Progress indicator (mapped vs total required)
- Tab not accessible until source datasets are linked

### FM2: AI Draft of Field Mappings (Medium)
- AI analyzes linked source schema and auto-suggests mappings on first load
- Suggestions displayed inline, labeled "AI suggested"
- **Suggestions require user confirmation** — not auto-applied
- Runs once on initial Draft only (pending confirmation)
- Standard Models bypass AI and use pre-defined default mappings
- Loading state shown during AI suggestion

### FM3: Many-to-One Source Field Mapping (High — NEW capability)
- Select multiple source fields for single FQ target field
- UI clearly represents multi-field selections (chips, etc.)
- Existing 1-to-1 mappings unaffected
- Note: Transformation logic for multi-field mappings will be defined in PRD 2b (9/30)

### FM4: Add Custom Fields (High — existing, must maintain)
- Source selector populated exclusively from Linked Datasets
- Custom fields visually distinguished from mandatory
- User defines data type for custom target field

### FM6: Field Mapping Validation & Error Handling (High)
- Publish is blocked if any mandatory FQ target fields are unmapped — user sees a clear error indicating which fields are missing
- Data type mismatches between source and target fields are flagged inline (e.g., mapping a text field to a numeric target)
- Validation runs on save/autosave and on publish attempt — errors surfaced inline on the affected row, not just as a generic banner
- Duplicate mappings (same source field mapped to multiple targets unintentionally) are flagged as a warning
- Clear error states for: unmapped required fields, type mismatches, invalid many-to-one combinations (e.g., incompatible data types across selected source fields)
- User cannot publish until all blocking validation errors are resolved

## Out of Scope (moved to PRD 2b — 9/30)

- **FM5: Define Transformation Logic — AI & Functions** — Per-row transformation editor, manual function-based logic, AI-generated transformations via AI Chat Modal, natural language → expression, function library definition
- **AI Chat Modal** — The conversational AI interaction pattern for describing transformations in natural language
- **Function library / syntax** — The supported transformation function set (To_Upper, To_Lower, Safe Cast, if/else, etc.)

## Design Implications

- **Field Mapping grid** is the core workspace for this PRD
- **Directed inline flow** — AI suggests source-to-target mappings inline, user reviews/confirms per row. This is the primary AI interaction model for the 6/30 release.
- **Vertical left nav** replaces old sub-navigation under "Lineage"
- Actions lightning bolt removed
- Autosave with visual indicator (no Save button)

## Current State (What Exists Today)
- Custom fields supported
- Source-to-target field mappings (1-to-1 only via "Actions" lightning bolt)
- Functions: To_Upper, To_Lower, Safe Cast, Strip Currency Symbols, Right, Left, Substring, Split Column, Default Value, Trim Spaces

## What's New in This Release (6/30)
- Redesigned field mapping page
- AI-suggested source-to-target mappings on first draft
- Multiple source fields per target (many-to-one)

## Open Questions

| # | Question | Status |
|---|----------|--------|
| OQ-1 | Is adding a custom field a change requiring new version? | Open |
| OQ-2 | Loading state for AI suggestion — design + timing? | Open |
| OQ-3 | Does AI auto-suggestion run only once on initial draft? Product decision or technical constraint? | Open |

## Gaps

| # | Gap | Impact |
|---|-----|--------|
| G1 | Behavior when AI can't suggest mappings undefined | High |
| G2 | Autosave failure behavior undefined | High |
| G6 | Custom fields can't use many-to-one mapping yet (blocked on FM3) | High |

## User Flow Steps
Steps 13-18: Field Mappings Tab → AI Suggests → Review Mandatory Fields → Override/Adjust → Autosave
