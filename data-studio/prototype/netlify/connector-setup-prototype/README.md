# Connector Setup Prototype

A clickable prototype that stitches together two threads of in-flight design work for Data Studio's "Add a Connector" experience:

- **Front half** — V2 progressive disclosure picker (Q1 Pre-Built / Custom → Q2 system or transmission type → Q3 QBO Basic vs. Enhanced when applicable). Ported from Natasha Clark's [knowledge/connectors](../knowledge/connectors/) ideation and the lowfi React export `~/Downloads/Connector Selection Prototype _Standalone_.html`.
- **Back half** — 3-step setup wizard (Connect → Manage endpoints → Review). Ported from Kristin Johnson's local prototype (`~/Downloads/kris-connectors/`). Step 2 (Manage endpoints) is the most fleshed-out per her [DC_API_CONNECTOR_SPEC.md](../../../../../Downloads/kris-connectors/DC_API_CONNECTOR_SPEC.md).

The picker's final selection (`ConnectorChoice`) drives which wizard branch opens:

| Picker path | Wizard branch | Why |
|---|---|---|
| Pre-Built → NetSuite / Sage / Salesforce / Workday | CDC wizard (Connect → Select Tables → Validate) | Fivetran-backed sources, Kristin's CDC components |
| Pre-Built → QBO (Basic or Enhanced) | DC API wizard | QBO direct, no QBO-specific wizard yet |
| Custom → API | DC API wizard | The wizard's heart — `EndpointSetup` + per-endpoint detail |
| Custom → File / SFTP | DC API wizard (placeholder) | Wizard not truly tailored for these — flagged for future work |

## Run

```bash
cd projects/data-studio/connector-setup-prototype
npm install
npm run dev
```

Opens on **http://localhost:5174/** (the Lineage prototype at `projects/data-studio/` runs on 5173 — they're isolated).

## What's where

- `src/App.tsx` — top-level state machine (`shell` → `picker` → `wizard`)
- `src/lib/connectorChoice.ts` — types, options, and the `v2AnswersToChoice` / `chooseWizardBranch` helpers
- `src/components/picker/` — V2 progressive disclosure components
- `src/components/shell/` — Data Studio top nav + Connectors empty state
- `src/components/WizardApp.tsx` — Kristin's wizard logic, refactored to accept a `ConnectorChoice` prop and to expose `onCancel` / `onBackToPicker`
- `src/components/{ConnectStep,EndpointSetup,...}.tsx`, `src/components/cdc/` — Kristin's wizard pieces, copied verbatim
- `src/index.css` — design tokens. Variable names are Kristin's, values are reskinned to the lowfi palette (FloQast brand `#13362A`, accent `#90E39A`, near-black `#11201A`)
- `src/_kristin_App.reference.tsx` — Kristin's original `App.tsx`, kept as reference for reading her state machine. Not imported.

## Design system note

This prototype does **not** use FlowUI components. It uses plain Tailwind v4 + CSS variables (mirroring the lowfi React export) for speed. If we graduate the picker to mid-fi, swap the picker components to FlowUI primitives at that point.

## Known caveats

- **Framing tension.** Kristin's wizard was specced as an *internal support-staff tool* ("non-expert support staff configuring DC API connectors on behalf of customers"). The V2 picker is *customer-facing*. The combined prototype treats both as one customer-facing flow for stakeholder review purposes only — don't read this as a product commitment.
- **File / SFTP paths fall through to the DC API wizard** as a stand-in. Kristin's wizard isn't tailored for these; we'd need new wizard variants to make those paths land cleanly.
- **No real validation, no real API calls** — all "Test Connection" / "Test endpoint" results are simulated with a ~900ms delay and always succeed.

## Credits

- **Natasha Clark** — V2 picker ideation, lowfi prototype, this combined integration
- **Kristin Johnson** — DC API connector spec and wizard prototype
- **Alex Kearns** — Data Studio PRDs (CDC, Manual Upload)
- **Rebecca Beasley-Cockroft** — question-driven framing for V2

## Background reading

- [knowledge/connectors/README.md](../knowledge/connectors/README.md) — design rationale for V1 vs. V2
- [knowledge/connectors/connector-select-flow-v2.html](../knowledge/connectors/connector-select-flow-v2.html) — V2 wireframes
- [knowledge/connectors/prototype-prompt.md](../knowledge/connectors/prototype-prompt.md) — original prompt that produced the lowfi
- [`~/Downloads/kris-connectors/DC_API_CONNECTOR_SPEC.md`](../../../../../Downloads/kris-connectors/DC_API_CONNECTOR_SPEC.md) — Kristin's wizard spec
