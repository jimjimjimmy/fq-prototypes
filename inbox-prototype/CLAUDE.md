# Inbox Prototype

## Overview
Unified Accounting Inbox — a concept prototype exploring how FloQast can surface
all actionable accounting work into a single inbox UI. Based on the visual vocabulary
established in the Detect prototype.

## Goal
Demonstrate how an inbox model can unify: Accruals, Anomaly detection, Variance
explanation, Approvals, Recs exceptions, and Close tasks into one coherent action center.

## Contributors
- @gregjones

## Status
Phase: prototyping
Started: 2026-05-18

## Design System
Status: freeform
Notes: shadcn/ui + Tailwind CSS v4. Same visual vocabulary as detect-prototype
(Newsreader font, FloQast brand colors). Not a FlowUI prototype.

## For Claude
- Run: `npm install && npm run dev` from `prototype/`
- Port: 5178
- Entry: `prototype/src/app/App.tsx` — single-file component architecture
- Do NOT apply FlowUI tokens — this is a freeform exploration prototype
