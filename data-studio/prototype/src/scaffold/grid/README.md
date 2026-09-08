# Grid — AG Grid baseline (scaffold)

This folder is part of the **scaffold** (`src/scaffold/`) and is locked
per the rules in [the parent README](../README.md). Any change to
`floqastGridTheme.ts` requires designer review.

## What's here

- **`floqastGridTheme.ts`** — the canonical AG Grid v32 theme for every
  grid in the prototype. FQ accent green, brand border, Inter font, 8px
  spacing. Copied verbatim from v1.

## Module registration (one place, app boot)

`ClientSideRowModelModule` is registered globally in `src/main.tsx`.
**Feature grids do not need to call `ModuleRegistry.registerModules()`
themselves** — just import `AgGridReact` and use the theme.

If a feature needs a module that isn't registered yet (e.g.
`RowGroupingModule`, `MasterDetailModule`, `RichSelectModule`), add it to
the registration call in `src/main.tsx` and flag it in the PR description.

## How to build a feature grid

1. **Start from the canonical example.** Read
   [`knowledge/design-system/examples/ag-grid/accruals-table.example.tsx`](../../../../../knowledge/design-system/examples/ag-grid/accruals-table.example.tsx)
   — 880 lines covering 22 patterns (status badges, currency formatting,
   custom cell renderers, pagination, AI-decision cells, etc.).

2. **Find your pattern in the index.** The 22 patterns are catalogued at
   [`knowledge/design-system/examples/ag-grid/README.md`](../../../../../knowledge/design-system/examples/ag-grid/README.md).

3. **Cite the pattern when you borrow.** When you copy a pattern from
   the accruals example, leave a one-line code comment naming the
   pattern number + line range. Example:

   ```tsx
   // AG-Grid pattern #7 (status badge cell renderer) —
   // accruals-table.example.tsx:412-455
   const StatusBadgeRenderer = (params: CustomCellRendererProps) => { ... }
   ```

   This makes code review traceable: a reviewer can open the canonical
   example and verify the borrowed pattern is intact.

4. **Extend the theme, don't replace it.** Per-feature tweaks go through
   `.withParams(...)`:

   ```ts
   import { floqastGridTheme } from '../../../scaffold/grid/floqastGridTheme';

   const myFeatureTheme = floqastGridTheme.withParams({
     foregroundColor: '#424867',  // softer body text for this grid
   });
   ```

## Why this lives in scaffold

Every feature grid extends the same theme. Putting it in `src/scaffold/`
treats it the same way the rail and tabs are treated — single source of
truth, designer-reviewed, no drive-by tweaks. A feature is free to
override params for its grid, but the base theme stays constant.
