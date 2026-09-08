# Recs AG Grid

A prototype of FloQast's Reconciliations page built with **real AG Grid**, as a counterpart
to the FlowUI-native-table `recs-multicurrency` prototype.

- **Stack:** React 18 + TypeScript + Vite, AG Grid (community + enterprise), FlowUI tokens.
- **Data:** ported `ReconciliationRow` type and mock data from `recs-multicurrency`.
- **Features:** Standard / Multi Currency toggle, tree-data folder grouping, total rows,
  custom currency cell renderers.

## Run

```bash
cd prototype
npm install
npm run dev
```

## Figma
- Default / Standard: `5059:68918`
- Multi Currency On: `5059:70971`
- File: `IROzHx3l0JXxVpYeCBPlxB`

## Match status (2026-06-25)
Both states matched structurally and visually: full app shell, Period/Folder +
rich Account cells, tree grouping (Medium Rare Donuts > 1000 Checking children),
Functional (MXN) / Local (JPY) column groups (Standard = Functional only, no group
header), currency-prefixed amounts with asterisk on Rec. Balance, parenthesised
negatives, dash for null, two-row Assignees with toggles, Completed with status
icons, and a Total + Close Group footer.

Known remaining gaps (data-level, not structural):
- Local (JPY) figures are derived from the ported mock data (MXN-scale values shown
  as JPY), so they differ from the specific JPY numbers in the Figma mock.
- Assignee toggles reflect the data (reviewer not signed off = gray); the Figma mock
  shows both on.
- Assignees / Completed columns are a touch narrow, so long names can truncate.
- Page-chrome headings use Inter (Museo Sans is a commercial font and FlowUI is not
  installed here - see CLAUDE.md). The grid uses Inter, matching FlowUI's AG Grid theme.
