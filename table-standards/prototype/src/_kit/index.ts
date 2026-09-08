// The FloQast table kit — one import surface for every profile + ideation.
// Prove a pattern in an ideation, promote it here, it propagates everywhere.

export * from './tokens.ts'
export * from './types.ts'
export type { BadgeColor } from './types.ts'
export * from './theme.ts'
export * from './colDefs.ts'
export * from './renderers/index.ts'
export { GridShell } from './GridShell.tsx'
export { registerGridModules } from './moduleRegistry.ts'
export { useGridState } from './useGridState.ts'

// Filtering — per-column (restyled native) + above-table compound layer
export { QuickFilterBar, useQuickFilters, type QuickChip } from './filters/QuickFilterBar.tsx'
export { FilterStatusBar } from './filters/FilterStatusBar.tsx'

// Chrome
export { TableToolbar } from './chrome/TableToolbar.tsx'
export { SavedViewsMenu } from './chrome/SavedViewsMenu.tsx'
export { ColumnPickerMenu } from './chrome/ColumnPickerMenu.tsx'

// Decisions
export { ALL_DECISIONS, decisionsForProfile, type Decision, type DecisionStatus } from './decisions.ts'

// Saved views
export * from './savedViews.ts'
