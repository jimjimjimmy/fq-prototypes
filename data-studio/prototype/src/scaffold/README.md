# Scaffold — LAW (do not modify without designer review)

Every file in this directory is part of the locked Data Studio prototype
scaffold. Changes here affect every feature folder under `src/features/`
and every contributor working on the prototype.

## The rule

**Any PR that touches `src/scaffold/` requires designer review from Natasha
Clark or Kristin Johnson before merging into `project/data-studio`.**

This is convention-enforced (per the rebuild plan), not hook-enforced. Trust
the rule, name it explicitly in PR descriptions ("touches scaffold? YES →
designer review required"), and the team will catch drift in code review.

## Why locked

The scaffold (global FloQast rail, Admin Settings header, L1 tabs, page
header, L2 sidebar, fullscreen mode, frame compositions) is visually
verified against canonical Figma frames in the Data Studio Scaffold file:
https://www.figma.com/design/JuKJL3qnOlL88CFBje5cBr/Data-Studio-Scaffold--Claude-

If the scaffold drifts from Figma, every feature built on top of it
inherits the drift. Locking it means features can be built confidently
inside a known-good frame.

## Structure

```
scaffold/
├── README.md                   # this file
├── global/                     # portable — could move to projects/_shared/scaffold/ later
│   ├── GlobalRail.tsx          # 56px FQ rail (adapted from side-nav anchor)
│   ├── AdminSettingsNav.tsx    # Admin Settings top bar (built new)
│   └── index.ts
├── data-studio/                # Data Studio-specific
│   ├── L1Frame.tsx             # composition wrapper for top-level routes
│   ├── L2Frame.tsx             # composition wrapper for detail routes (fullscreen owner)
│   ├── L1Tabs.tsx              # Catalog / Connectors / Dimensions / Logs
│   ├── PageHeader.tsx          # supports L1 and L2 modes
│   ├── L2Sidebar.tsx           # collapsible vertical nav inside detail views
│   └── index.ts
└── grid/                       # AG Grid theme baseline (see grid/README.md)
    ├── floqastGridTheme.ts     # canonical theme — copied verbatim from v1
    └── README.md               # usage + citation convention
```

## AG Grid in feature code

`ClientSideRowModelModule` is registered once globally in `src/main.tsx`.
Feature grids do not call `ModuleRegistry.registerModules()` themselves —
just import `AgGridReact` and extend `floqastGridTheme` via `.withParams(...)`.

The canonical reference implementation is the accruals table at
`knowledge/design-system/examples/ag-grid/accruals-table.example.tsx`
(22 patterns indexed in the sibling `README.md`). **When borrowing a
pattern, cite it by pattern number + line range in a code comment** so
reviewers can trace back to the canonical example. See
[`grid/README.md`](./grid/README.md) for the full convention.

## Provenance

- **`global/GlobalRail.tsx`** — copy-based anchor from
  `knowledge/design-system/composition-references/chrome/side-nav.tsx`,
  customized for Data Studio (no product app active, Settings icon active).
- **Branded SVG icons** in `prototype/public/icons/` — copied from
  `knowledge/design-system/composition-references/branded-icons/`.
- **All other scaffold components** — built new from Figma frames using
  FlowUI primitives via `flow-ui-mcp`.

## How to change the scaffold

The right flow for a scaffold change is in
[the rebuild plan](https://github.com/FloQastInc/product-and-design)
(see "Handling the shell when it does need to change"):

1. Designer opens branch `data-studio/scaffold-{change}`
2. Update the canonical Figma frame first
3. Run `figma-fq` against the updated frame to produce a diff plan
4. Apply diff to files in this directory
5. PR to `project/data-studio` with the other designer as reviewer
6. After merge, announce to the team so feature branches pull and pause
   for any breakage
