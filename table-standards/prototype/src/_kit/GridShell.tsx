import { useCallback, useMemo, useRef, type CSSProperties } from 'react'
import { AgGridReact, type AgGridReactProps } from '@ag-grid-community/react'
import type { ColumnResizedEvent, GridApi } from '@ag-grid-community/core'
import { themeForDensity, type Density } from './theme.ts'
import { defaultColDef as kitDefaultColDef, lockRightEdge } from './colDefs.ts'

/** A finished, user-initiated column drag (not our own programmatic flex/api events). */
const isUserResize = (source?: string) =>
  source === 'uiColumnResized' || source === 'uiColumnDragged'

/**
 * Keeps the grid filled after a manual resize (D-013). AG Grid strips `flex` from any
 * column the user drags — by design, no way to opt out — so dragging the flex column
 * narrower leaves blank space on the right. When that happens we re-apply `flex: 1` to
 * the trailing column so it re-absorbs the slack. Scoped to this grid's DOM (a page can
 * mount more than one grid) and guarded so it never touches the column just dragged.
 */
function absorbTrailingGap(
  api: GridApi,
  wrapper: HTMLElement | null,
  resizedColId: string | null,
) {
  const cols = api.getDisplayedCenterColumns()
  if (!cols.length) return
  const total = cols.reduce((sum, c) => sum + c.getActualWidth(), 0)
  const viewport = wrapper?.querySelector<HTMLElement>('.ag-center-cols-viewport')
  const viewportWidth = viewport?.clientWidth ?? 0
  const gap = viewportWidth - total
  if (gap <= 1) return // no meaningful blank space

  // Absorb into the trailing column; never re-flex the one the user just dragged.
  let filler = cols[cols.length - 1]
  if (filler.getColId() === resizedColId && cols.length > 1) {
    filler = cols[cols.length - 2]
  }
  api.applyColumnState({ state: [{ colId: filler.getColId(), flex: 1 }] })
}

/**
 * The one way profiles mount a grid. Applies the shared density theme + defaultColDef so no
 * profile re-authors them (D-010 "consistency by construction"). Everything else passes through.
 * Note: with the Theming API you do NOT add an `ag-theme-*` CSS class — the `theme` prop is it.
 */
export function GridShell({
  density = 'compact',
  style,
  defaultColDef,
  columnDefs,
  context,
  onColumnResized,
  // Columns are managed via the toolbar (Columns dropdown), never by dragging a header
  // OUT of the grid to hide it — an uncontrolled path with no recovery on P0 (which has
  // no Columns button). Suppressed kit-wide so column behavior is consistent across the
  // ladder. Reordering within the grid still works. Overridable per profile.
  suppressDragLeaveHidesColumns = true,
  ...props
}: AgGridReactProps & { density?: Density; style?: CSSProperties }) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Lock the table's right edge so resizing can never leave blank space (D-013).
  const lockedColumnDefs = useMemo(
    () => (columnDefs ? lockRightEdge(columnDefs) : columnDefs),
    [columnDefs],
  )

  const handleColumnResized = useCallback(
    (e: ColumnResizedEvent) => {
      // applyColumnState below re-fires this with source 'flex'/'api' — the guard skips it.
      if (e.finished && isUserResize(e.source)) {
        absorbTrailingGap(e.api, wrapperRef.current, e.column?.getColId() ?? null)
      }
      onColumnResized?.(e)
    },
    [onColumnResized],
  )

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: '100%', ...style }}>
      <AgGridReact
        theme={themeForDensity(density)}
        defaultColDef={{ ...kitDefaultColDef, ...defaultColDef }}
        columnDefs={lockedColumnDefs}
        context={{ density, ...context }}
        onColumnResized={handleColumnResized}
        suppressDragLeaveHidesColumns={suppressDragLeaveHidesColumns}
        {...props}
      />
    </div>
  )
}
