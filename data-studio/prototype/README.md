# Data Studio v2 — Prototype

The active v2 prototype for FloQast Data Studio. Built with React + Vite +
FlowUI + Tailwind v4 + AG Grid.

## Layout

```
prototype/
├── src/
│   ├── scaffold/           ← Locked architectural primitives (Step 2)
│   │   ├── global/         ← FloQast rail + admin header (portable)
│   │   ├── data-studio/    ← L1 tabs, page header, Model View nav
│   │   └── grid/           ← floqastGridTheme.ts
│   ├── features/           ← Feature folders, one per workstream
│   ├── routes/registry.ts  ← Where feature routes are composed
│   ├── data/               ← Mock data
│   ├── App.tsx
│   └── main.tsx
├── netlify/                ← Currently-live standalone Netlify prototypes
│   └── connector-setup-prototype/
└── (Vite + TS configs)
```

## Running

```bash
cd projects/data-studio/prototype
npm install        # first time only
npm run dev
```

Opens on http://localhost:5173.

## Running other prototypes in this project

- **Legacy v1 prototype:**
  `cd ../legacy-prototype-work/prototype-legacy && npm install && npm run dev`
- **Live connector setup prototype** (deployed to Netlify):
  `cd netlify/connector-setup-prototype && npm install && npm run dev`

## Important conventions

**Scaffold is law.** Files under `src/scaffold/` and `src/routes/registry.ts`
require designer review (Natasha or Kristin) on any PR that touches them.
The scaffold is verified against canonical Figma frames via the `figma-fq`
skill and Code Connect; drift breaks visual parity for the whole team.

**Tailwind + FlowUI:** Tailwind v4 is imported *without* `layer()` because
FlowUI's `Theme.apply()` injects unlayered global styles. Do not change
this — see `src/index.css` for the load-bearing pattern.

**Inter font:** Loaded via Google Fonts in `index.html`. Required because
FlowUI's npm package doesn't bundle Inter but its Figma designs use it.
A runtime shim in `src/main.tsx` re-applies Inter after FlowUI loads.

## Plan

Full rebuild plan at
`/Users/natashacla/.claude/plans/i-d-like-to-explore-bright-steele.md`.
