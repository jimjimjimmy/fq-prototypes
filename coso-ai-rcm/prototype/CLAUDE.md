# COSO AI RCM Prototype

## What This Is
Prototype of the COSO-aligned AI Risk and Control Matrix compliance experience. Initial focus is **Persona 2 — IT/Compliance Manager** (2nd line of defense): agent inventory, risk assessment facilitation, control design, recurring task orchestration, and gap/remediation tracking.

## Design System
- **design-system:** custom (Radix + Tailwind, no FlowUI)
- The FloQast `@floqastinc/flow-ui_*` packages live on a private npm registry that this project doesn't have auth for. We're approximating FlowUI visually with Radix primitives + Tailwind utilities.
- The Figma "entry points" design at https://www.figma.com/design/s5mhthDXZDrhn7T4yP8UMe/COSO-AI?node-id=2030-2249 is the visual reference. When translating a screen, use `figma-fq` to capture the design and adapt it manually to Radix + Tailwind.
- If FloQast registry access becomes available later, swap Radix for `@floqastinc/flow-ui_core` to gain pixel-true fidelity.

## Figma Reference
- File: COSO AI (`s5mhthDXZDrhn7T4yP8UMe`)
- Entry points node: `2030:2249` (4 frames at 1920×1080: AI Capabilities landing, Key Systems table, agent overview, agent details)

## Tech Stack
- React 18 + TypeScript + Vite 8
- Tailwind CSS v4
- Radix UI primitives (Dialog, Dropdown Menu, Tabs, Tooltip)
- `lucide-react` for icons
- `animejs` for entry animations and micro-interactions
- `howler` for audio feedback ("haptic" feedback via short click sounds)
- Port: 5179

## Motion + Sound Conventions
- **Entry animations:** stagger headline → body → CTA on mount with `easeOutExpo`
- **Click feedback:** play `click.wav` and run a small scale pulse on the button
- **Adding new sounds:** drop the file in `public/sounds/` and reference as `/projects/coso-ai-rcm/sounds/<name>.wav`
- Keep audio subtle (volume 0.3–0.5). Web pages can't trigger device haptics — audio is the closest analogue

## Running
```bash
npm install
npm run dev      # http://localhost:5179/projects/coso-ai-rcm/
npm run build    # outputs to ../../../docs/projects/coso-ai-rcm/
```

## Source of Truth
- Persona research: `../knowledge/persona-user-stories.md`
- Workflow diagram: `../knowledge/po-accruals-workflow.svg`
- Persona 2 walkthrough (in progress): `../knowledge/persona-2-experience.md`
