/**
 * UsersTable — the Team Members admin table, built on the lightweight admin
 * AG Grid profile (adminLiteGridTheme + single ClientSideRowModelModule,
 * sort-only, no filters/grouping/side panels).
 *
 * Columns mirror Figma node 2198:6632: Name, Account Role, Workspace Access,
 * FloQast Access, Login Type. Row height is content-driven (autoHeight) to fit
 * the multi-line workspace-access cell, with a sticky header (CSS in index.css).
 */
import { useMemo } from 'react'
import { AgGridReact } from '@ag-grid-community/react'
import type { ColDef } from '@ag-grid-community/core'
import { adminLiteGridTheme } from './grid/adminLiteGridTheme'
import { USERS, type User } from '../data/users'
import {
  UserIdentityCell,
  RoleCell,
  WorkspaceAccessCell,
  FqAccessCell,
  LoginTypeCell,
} from './cells'

export function UsersTable() {
  const columnDefs = useMemo<ColDef<User>[]>(
    () => [
      { colId: 'name', headerName: 'Name', field: 'name', flex: 1, minWidth: 300, cellRenderer: UserIdentityCell },
      { colId: 'role', headerName: 'Account Role', field: 'role', width: 240, sortable: false, cellRenderer: RoleCell },
      { colId: 'workspace', headerName: 'Workspace Access', width: 260, sortable: false, cellRenderer: WorkspaceAccessCell },
      { colId: 'fqAccess', headerName: 'FloQast Access', field: 'fqAccess', width: 200, sortable: false, cellRenderer: FqAccessCell },
      { colId: 'loginType', headerName: 'Login Type', field: 'loginType', width: 180, sortable: false, cellRenderer: LoginTypeCell },
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
      // top-align so multi-line cells read cleanly
      cellStyle: { display: 'flex', alignItems: 'flex-start' },
    }),
    [],
  )

  return (
    <div className="admin-grid">
      <AgGridReact<User>
        theme={adminLiteGridTheme}
        rowData={USERS}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        getRowId={(p) => p.data.id}
        domLayout="autoHeight"
        suppressCellFocus
        loadThemeGoogleFonts={false}
      />
    </div>
  )
}
