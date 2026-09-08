/**
 * BulkReviewGrid — read-only AG Grid that validates the imported invite rows
 * (Step 2 of the bulk wizard). Reuses the validated admin profile
 * (`adminLiteGridTheme`) and FlowUI `TableStatusBadge`, so it matches the
 * Users table on the entry screen.
 *
 * Read-only by design: users add/change people by re-importing the CSV (Step 1),
 * not by editing in the grid. Each row shows its validation status; rows with
 * issues are tinted and explained inline, and are simply excluded from Send.
 */
import { useMemo } from 'react'
import { AgGridReact } from '@ag-grid-community/react'
import type { ColDef, ICellRendererParams } from '@ag-grid-community/core'
// @ts-ignore — FlowUI is a JS package; skipLibCheck covers node_modules
import TableStatusBadge from '@floqastinc/flow-ui_core/TableStatusBadge'
import { adminLiteGridTheme } from '../grid/adminLiteGridTheme'
import { validateInviteRow, type InviteRow, type RowStatus } from '../../data/invite'
import { workspacesSummary } from '../../data/workspaces'

/** Validation status → TableStatusBadge color (note: FlowUI uses "danger", not "error"). */
const BADGE_COLOR: Record<Exclude<RowStatus, 'empty'>, string> = {
  ready: 'success',
  warning: 'warning',
  error: 'danger',
}

function StatusCell(p: ICellRendererParams<InviteRow>) {
  if (!p.data) return null
  const v = validateInviteRow(p.data)
  if (v.status === 'empty') return <span className="text-[12px] text-[#adb2bb]">—</span>
  return (
    <TableStatusBadge color={BADGE_COLOR[v.status]} size="default" hasIcon={false}>
      {v.label}
    </TableStatusBadge>
  )
}

export function BulkReviewGrid({ rows }: { rows: InviteRow[] }) {
  const columnDefs = useMemo<ColDef<InviteRow>[]>(
    () => [
      { colId: 'status', headerName: 'Status', width: 150, sortable: false, cellRenderer: StatusCell },
      { colId: 'email', headerName: 'Email', valueGetter: (p) => p.data?.email || '—', flex: 1.4, minWidth: 220 },
      { colId: 'role', headerName: 'Role', valueGetter: (p) => p.data?.role || '—', flex: 1, minWidth: 130 },
      { colId: 'loginType', headerName: 'Login Type', valueGetter: (p) => p.data?.loginType || '—', flex: 1, minWidth: 120 },
      {
        colId: 'workspaces',
        headerName: 'Workspaces',
        valueGetter: (p) => (p.data ? workspacesSummary(p.data.workspaces) || '—' : '—'),
        flex: 1.1,
        minWidth: 150,
      },
    ],
    [],
  )

  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      resizable: false,
      suppressMovable: true,
      filter: false,
      autoHeight: true,
      cellStyle: { display: 'flex', alignItems: 'center' },
    }),
    [],
  )

  return (
    <AgGridReact<InviteRow>
      theme={adminLiteGridTheme}
      rowData={rows}
      columnDefs={columnDefs}
      defaultColDef={defaultColDef}
      getRowId={(p) => p.data.id}
      domLayout="autoHeight"
      suppressCellFocus
      loadThemeGoogleFonts={false}
    />
  )
}
