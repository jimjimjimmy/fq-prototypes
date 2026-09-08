import type { ColDef, ColGroupDef } from '@ag-grid-community/core'
import type { BadgeColor } from './types.ts'
import {
  CurrencyRenderer,
  DifferenceRenderer,
  MissingRenderer,
  VarianceRenderer,
  PctRenderer,
  BadgeRenderer,
  StatusBadgeRenderer,
  AvatarStackRenderer,
  PersonRenderer,
  TwoLineRenderer,
  DateRenderer,
  ActionRenderer,
} from './renderers/index.ts'

/**
 * Shared defaultColDef. Encodes the Design Bar baseline so no profile re-decides it:
 *  - single-line headers (wrapHeaderText:false) — Tyler: "kill the stacked headers"
 *  - per-column filter reachable from the header menu, NOT an always-on floating search box
 *    — Greg: "does that really need to be exposed?"  (floatingFilter defaults off)
 *  - sort + resize on by default.
 */
export const defaultColDef: ColDef = {
  sortable: true,
  filter: true,
  floatingFilter: false,
  resizable: true,
  wrapHeaderText: false,
  autoHeaderHeight: false,
  menuTabs: ['filterMenuTab', 'generalMenuTab'],
  // Vertically center + left-align cell content by default (D-014). Headers are
  // left-aligned everywhere (we do NOT use AG Grid's built-in numericColumn type,
  // which right-aligns headers). Only material-amount columns opt into RIGHT_ALIGNED_CELL.
  cellStyle: { display: 'flex', alignItems: 'center' },
}

/**
 * Cell style for material-amount columns (currency, numeric quantities). Because
 * cells are flex containers (for vertical centering), `text-align: right` is ignored —
 * we push content right with justify-content instead. Headers stay left-aligned (D-014).
 */
const RIGHT_ALIGNED_CELL = { display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }

/**
 * Locks the right edge of the table so no blank space can appear at the table's
 * right side (D-013). Two things:
 *  1. The rightmost non-pinned column gets `resizable: false` — its right edge has
 *     no drag handle, so a user can't drag it inward and leave a gap. (Every other
 *     column stays resizable; those handles sit on their own right edge, to the left.)
 *  2. If no column declares `flex`, the rightmost one gets `flex: 1` so the grid
 *     always fills its container. (All current profiles already have a flex column,
 *     so this is a safety net for future tables.)
 * GridShell applies this to every profile — consistency by construction.
 */
export function lockRightEdge(
  colDefs: (ColDef | ColGroupDef)[],
): (ColDef | ColGroupDef)[] {
  if (!colDefs?.length) return colDefs
  const isGroup = (c: ColDef | ColGroupDef): c is ColGroupDef => 'children' in c

  // Last top-level, non-grouped, non-pinned-right column = the true right edge.
  let lastIdx = -1
  for (let i = colDefs.length - 1; i >= 0; i--) {
    const c = colDefs[i]
    if (isGroup(c)) continue
    if (c.pinned === 'right') continue
    lastIdx = i
    break
  }
  if (lastIdx === -1) return colDefs

  const hasFlex = colDefs.some((c) => !isGroup(c) && c.flex != null)
  return colDefs.map((c, i) => {
    if (i !== lastIdx) return c
    const col = c as ColDef
    return { ...col, resizable: false, ...(hasFlex ? {} : { flex: 1 }) }
  })
}

type Opts = Partial<ColDef>

/** Left-aligned free text (default filter = text). */
export const textCol = (field: string, headerName: string, opts: Opts = {}): ColDef => ({
  field,
  headerName,
  filter: 'agTextColumnFilter',
  ...opts,
})

/** Categorical column with the (restyled) Set filter — the per-column default for enums. */
export const setCol = (field: string, headerName: string, opts: Opts = {}): ColDef => ({
  field,
  headerName,
  filter: 'agSetColumnFilter',
  ...opts,
})

/** Right-aligned numeric quantity (left-aligned header) with the number filter. */
export const numberCol = (field: string, headerName: string, opts: Opts = {}): ColDef => ({
  field,
  headerName,
  filter: 'agNumberColumnFilter',
  cellStyle: RIGHT_ALIGNED_CELL,
  ...opts,
})

/** Right-aligned currency (CurrencyRenderer). */
export const currencyCol = (
  field: string,
  headerName: string,
  opts: Opts & { currency?: string } = {},
): ColDef => {
  const { currency, ...rest } = opts
  return {
    field,
    headerName,
    filter: 'agNumberColumnFilter',
    cellRenderer: CurrencyRenderer,
    cellRendererParams: currency ? { currency } : undefined,
    cellStyle: RIGHT_ALIGNED_CELL,
    ...rest,
  }
}

/** Right-aligned currency that shows a "Missing" pill for nulls. */
export const missingCol = (field: string, headerName: string, opts: Opts = {}): ColDef => ({
  field,
  headerName,
  filter: 'agNumberColumnFilter',
  cellRenderer: MissingRenderer,
  cellStyle: RIGHT_ALIGNED_CELL,
  ...opts,
})

/** Right-aligned signed difference (zero = green, non-zero = red). */
export const differenceCol = (field: string, headerName: string, opts: Opts = {}): ColDef => ({
  field,
  headerName,
  filter: 'agNumberColumnFilter',
  cellRenderer: DifferenceRenderer,
  cellStyle: RIGHT_ALIGNED_CELL,
  ...opts,
})

/** Right-aligned signed variance (positive = green, negative = red). */
export const varianceCol = (field: string, headerName: string, opts: Opts = {}): ColDef => ({
  field,
  headerName,
  filter: 'agNumberColumnFilter',
  cellRenderer: VarianceRenderer,
  cellStyle: RIGHT_ALIGNED_CELL,
  ...opts,
})

/** Right-aligned percent with materiality highlight. */
export const pctCol = (
  field: string,
  headerName: string,
  opts: Opts & { threshold?: number } = {},
): ColDef => {
  const { threshold, ...rest } = opts
  return {
    field,
    headerName,
    filter: 'agNumberColumnFilter',
    cellRenderer: PctRenderer,
    cellRendererParams: threshold != null ? { threshold } : undefined,
    cellStyle: RIGHT_ALIGNED_CELL,
    ...rest,
  }
}

/** Left-aligned date (D-014: only material amounts are right-aligned; dates read as text). */
export const dateCol = (field: string, headerName: string, opts: Opts = {}): ColDef => ({
  field,
  headerName,
  filter: 'agTextColumnFilter',
  cellRenderer: DateRenderer,
  ...opts,
})

/** Left-aligned account NUMBER (Rams: account numbers are left-aligned, unlike amounts).
 *  Left is AG Grid's default alignment; kept as an explicit factory to document the convention. */
export const accountNumberCol = (field: string, headerName: string, opts: Opts = {}): ColDef => ({
  field,
  headerName,
  filter: 'agTextColumnFilter',
  ...opts,
})

/** Two-line cell: primary value + a secondary pill/text (e.g. account name + type). */
export const twoLineCol = (
  field: string,
  headerName: string,
  opts: Opts & { secondaryField?: string; secondaryAsPill?: boolean; colorMap?: Record<string, { bg: string; text: string }> } = {},
): ColDef => {
  const { secondaryField, secondaryAsPill, colorMap, ...rest } = opts
  return {
    field,
    headerName,
    filter: 'agTextColumnFilter',
    cellRenderer: TwoLineRenderer,
    cellRendererParams: { secondaryField, secondaryAsPill, colorMap },
    ...rest,
  }
}

/** Status dot+text with a Set filter. */
export const statusCol = (field: string, headerName: string, opts: Opts = {}): ColDef => ({
  field,
  headerName,
  filter: 'agSetColumnFilter',
  cellRenderer: StatusBadgeRenderer,
  ...opts,
})

/** Tag/badge pills with a Set filter. colorMap keys are cell values; values are FlowUI BadgeColor names. */
export const badgeCol = (
  field: string,
  headerName: string,
  opts: Opts & { colorMap?: Record<string, BadgeColor> } = {},
): ColDef => {
  const { colorMap, ...rest } = opts
  return {
    field,
    headerName,
    filter: 'agSetColumnFilter',
    cellRenderer: BadgeRenderer,
    cellRendererParams: colorMap ? { colorMap } : undefined,
    ...rest,
  }
}

/** Avatar-stack people column (not filterable/sortable). */
export const peopleCol = (field: string, headerName: string, opts: Opts = {}): ColDef => ({
  field,
  headerName,
  cellRenderer: AvatarStackRenderer,
  filter: false,
  sortable: false,
  ...opts,
})

/** Single-person avatar + name. */
export const personCol = (field: string, headerName: string, opts: Opts = {}): ColDef => ({
  field,
  headerName,
  filter: 'agSetColumnFilter',
  cellRenderer: PersonRenderer,
  ...opts,
})

/** Pinned-right row actions (not filterable/sortable/resizable). */
export const actionsCol = (opts: Opts = {}): ColDef => ({
  headerName: '',
  cellRenderer: ActionRenderer,
  pinned: 'right',
  width: 190,
  filter: false,
  sortable: false,
  resizable: false,
  ...opts,
})
