# Recs Translation for Workday

## Overview
Prototype exploring currency translation in FloQast Reconciliations for Workday ERP. Shows how GL balances, rec balances, and differences display when accounts have target currencies - including translated value badges, exchange rate popovers, error states for unavailable rates, and a side drawer for per-account and group-level currency settings.

## Goal
Validate the translation UX for Workday reconciliation accounts - how translated values appear in the table, how currency settings work in the side drawer, and how error states (rate unavailable, API down) are communicated to users.

## Contributors
- @jimmychen_floqast (Product Designer)

## Status
Phase: prototyping
Started: 2026-03-13

## Design System
Status: freeform
Notes: Static HTML prototype using Tailwind CDN + Inter font + Material Icons. Not using FlowUI components - this is a design exploration artifact.

## Figma Files
- None yet

## External Links
- Jira: none
- Confluence: none

## Key Knowledge
- No knowledge files yet - add research findings and design decisions as the project evolves

## For Claude
When working on this project:
- The prototype is a single self-contained HTML file at `prototype/index.html`
- It uses Tailwind CDN, Inter font, and Material Icons Outlined - no build step needed
- Key interactive features: currency translation toggle in side drawer, group expand/collapse, exchange rate popovers, error states
- The side drawer supports both individual account and group views with different settings