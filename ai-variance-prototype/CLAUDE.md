# AI Variance Prototype

## Status
Active — started May 2026

## Owner
Greg Jones (greg.jones@floqast.com)

## Goal
High-fidelity concept prototype for the AI Variance Analysis preparer flow.
Explores the "Focus Mode" inbox pattern: one item at a time, AI explanation pre-drafted,
simple accept-and-move-on interaction. Based on feedback from the May 8, 2026 JR Design Bar session.

## Key Design Decisions
- **Detect framework** (Tyler's prototype) as the UI baseline — shadcn/ui + Tailwind v4
- **Preparer-only view**: no Variance Summary tab, no Reporting tab (per Joe Ryan feedback)
- **Focus Mode as primary interaction**: left inbox tree → right focused explanation editor
- **AI explanations pre-drafted**: user edits/accepts rather than drafting from scratch
- **Mid-market persona** optimized: bare-bones, no configurability noise

## Tech Stack
- Vite + React 18 + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Lucide React icons
- No Zustand — React useState at App level (simpler for prototype)
- `npm install` and `npm run dev` from `prototype/`
- Port: 5178

## Directory
- `prototype/src/data/variances.ts` — all seed data (accounts, collections, AI explanations)
- `prototype/src/app/App.tsx` — root layout and state
- `prototype/src/app/components/inbox/` — left panel (VarianceInbox, VarianceItemCard)
- `prototype/src/app/components/focus/` — right panel (FocusPanel)
- `prototype/src/app/components/layout/` — CollapsedSideNav, nav-icons (from Detect)

## Design Context
- Video review: `/Users/gregjon/Desktop/5670278919656324565.playback.mp4`
- Transcript: `/Users/gregjon/Desktop/call-transcript--JR Design Bar - Bi-weekly.txt`
- Detect baseline: `projects/detect-prototype/` (live at https://sturdy-adventure-7p4zk32.pages.github.io/projects/detect-prototype/)
