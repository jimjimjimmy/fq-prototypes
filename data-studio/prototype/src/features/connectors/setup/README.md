# Connectors — Setup wizard

**Owners:** Kristin Johnson · Natasha Clark · Rebecca Beasley-Cockroft
**Status:** ported from netlify connector-setup-prototype (Step 7c, 2026-05-26)
**Figma:** TBD — Connector setup flow + question picker
**Last touched:** 2026-05-26

Full-screen picker → wizard for adding a new connector. Mounted at
`/data-studio/connectors/setup` from the connectors L1 tab's "Add
Connector" button.

## Flow

```
ConnectorsListPage  ── click "Add Connector" ──▶  /connectors/setup
                                                          │
                                          ┌─── V2Picker (3 questions) ───┐
                                          │  Q1: Pre-built / Custom?     │
                                          │  Q2: Which system / type?    │
                                          │  Q3: Which QBO tier?         │
                                          │  (Q3 only for QBO pre-built) │
                                          └────── ConnectorChoice ───────┘
                                                          │
                                              ┌─── WizardApp ───┐
                                              │ Configures the  │
                                              │ chosen connector │
                                              └─────────────────┘
                                                          │
                                              Cancel → back to /connectors
```

## Files

| File | Purpose |
|---|---|
| `routes.tsx` | Phase state (picker \| wizard), full-screen render, navigation |
| `data.ts` | Mock data — cluster defaults, labels, test results, sample responses |
| `types.ts` | Shared types — EndpointState, Cluster, Ingestion, etc. |
| `lib/connectorChoice.ts` | Picker output types + utilities (`chooseWizardBranch`, `choiceLabel`) |
| `components/WizardApp.tsx` | Main wizard container — routes between branches |
| `components/WizardStepper.tsx` | Top step navigation |
| `components/ConnectStep.tsx` | Initial connection step (auth / credentials) |
| `components/EndpointSetup.tsx` | Endpoint configuration |
| `components/RequestDetails.tsx` | HTTP request shape |
| `components/QueryParams.tsx` | Query string parameters |
| `components/Schedule.tsx` | Sync mode + frequency |
| `components/GuidePanel.tsx` | Inline guidance / docs sidebar |
| `components/Sidebar.tsx` | Left section navigation |
| `components/SectionStepper.tsx` | Within-section progress |
| `components/FooterActions.tsx` | Bottom action bar (back/next/cancel) |
| `components/cdc/CdcConnectStep.tsx` | CDC-specific connect step |
| `components/cdc/CdcSelectTables.tsx` | CDC table selection |
| `components/picker/V2Picker.tsx` | 3-question picker container |
| `components/picker/Q1PreBuiltCustom.tsx` | Q1: pre-built vs custom |
| `components/picker/Q2SystemOrType.tsx` | Q2: which system / connection type |
| `components/picker/Q3QboTier.tsx` | Q3: QBO tier (only when Q1=pre-built, Q2=qbo) |
| `components/picker/CollapsedAnswerRow.tsx` | Collapsed view of an answered question |
| `components/picker/ProgressBar.tsx` | Picker progress indicator |

## Live netlify version

The original standalone Vite app stays live at
`prototype/netlify/connector-setup-prototype/`. It's NOT archived — it's a
parallel deployment. When updating the ported version here, decide
case-by-case whether to mirror the change back to the netlify version
(or vice versa).

Netlify deploy config update (when team is ready to redeploy): base
directory should be `projects/data-studio/prototype/netlify/connector-setup-prototype`.

## Port notes (from Step 7c)

Files **ported as-is** (no import changes — all paths internal to the folder):
- All `components/` (including `cdc/` and `picker/` subfolders)
- `data.ts`, `types.ts`, `lib/connectorChoice.ts`

Files **NOT ported**:
- `App.tsx` — replaced by this folder's `routes.tsx` (orchestrates the
  same picker → wizard phase logic but inside v2's routing instead of
  a standalone app)
- `main.tsx` — v2 has its own at `src/main.tsx`
- `index.css` — v2 has its own at `src/index.css`
- `_kristin_App.reference.tsx` — reference material, not active code
- `components/shell/DataStudioShell.tsx` — replaced by v2 scaffold
  (the wizard doesn't actually need it — renders full-screen)
- `components/shell/ConnectorsEmpty.tsx` — empty state belongs to the
  connectors LIST feature, will be ported into
  `features/connectors/ConnectorsListPage.tsx` when that's built out

## Chrome decision: no L1Frame

The picker + wizard render **full-screen** — no global rail, no L1 tabs,
no page header. This matches v1's behavior and is intentional: hiding
the L1 tabs prevents the user from accidentally navigating away
mid-wizard. The cancel button on the wizard's footer is the only way out,
and it routes back to `/data-studio/connectors`.

If we want to add some chrome later (e.g. a thin bar with "Setup
connector — step 2 of 5"), it should be a wizard-local component, not
the global L1Frame.
