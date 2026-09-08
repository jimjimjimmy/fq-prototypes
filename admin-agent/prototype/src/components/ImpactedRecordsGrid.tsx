/**
 * ImpactedRecordsGrid — the impacted records shown on a CTA drilldown page.
 * The record set depends on which assistant raised the finding:
 *   - close    → Folder → Reconciliations / Checklist → item tree
 *   - entities → flat Entity table (Workflows & Entities Assistant)
 *   - users    → flat Users table (Users & Roles Assistant)
 *
 * AG Grid Community has no native tree data (Enterprise only), so the close
 * nesting is simulated: a flat list of folder / group / leaf rows with a custom
 * first-column renderer (chevron + icon + indentation) and React-managed
 * expand/collapse. Style follows the FlowUI AG Grid standard (Storybook
 * "Ag Grid"): the shared themeQuartz-based floqastGridTheme.
 */
import { useMemo, useState } from 'react'
import { AgGridReact } from '@ag-grid-community/react'
import type { ColDef, ICellRendererParams } from '@ag-grid-community/core'
import { floqastGridTheme } from './grid/floqastGridTheme'

export type RecordSet = 'close' | 'entities' | 'users'

// ============================ Close (tree) ============================
export interface Leaf {
  id: string
  description: string
  frequency: string
  preparer: string
  preparerDue: string
  reviewer: string
  reviewerDue: string
}
export interface Group {
  id: string
  label: string
  kind: 'reconciliation' | 'checklist'
  items: Leaf[]
}
export interface Folder {
  id: string
  label: string
  groups: Group[]
}

const PREP = 'preparer@placeholder.com'
const REV = 'reviewer@placeholder.com'

export const FOLDERS: Folder[] = [
  {
    id: 'f1',
    label: '01 Cash and Cash Equivalents',
    groups: [
      {
        id: 'f1-rec',
        label: 'Reconciliations',
        kind: 'reconciliation',
        items: [
          { id: 'r1', description: 'Wells Fargo Checking', frequency: 'Monthly', preparer: PREP, preparerDue: '3; 4', reviewer: REV, reviewerDue: '5' },
          { id: 'r2', description: 'Wells Fargo Clearing', frequency: 'Monthly', preparer: PREP, preparerDue: '3', reviewer: REV, reviewerDue: '5' },
        ],
      },
      {
        id: 'f1-chk',
        label: 'Checklist',
        kind: 'checklist',
        items: [
          { id: 'c1', description: 'Post all applicable cash receipts', frequency: 'Monthly', preparer: PREP, preparerDue: 'M', reviewer: REV, reviewerDue: 'W' },
          { id: 'c2', description: 'Download bank statement.', frequency: 'Monthly', preparer: PREP, preparerDue: 'start: 01/06/26', reviewer: REV, reviewerDue: 'start: 01/08/26' },
          { id: 'c3', description: 'Investigate any unusual reconciling items and clear in a timely fashion.', frequency: 'Quarterly', preparer: PREP, preparerDue: '3', reviewer: REV, reviewerDue: '3' },
          { id: 'c4', description: "Obtain this month's bank statements from all banks in order to support bank accounts.", frequency: 'Monthly', preparer: PREP, preparerDue: '3', reviewer: REV, reviewerDue: '3' },
          { id: 'c5', description: 'Review outstanding checks and void where appropriate.', frequency: 'Yearly', preparer: PREP, preparerDue: '3', reviewer: REV, reviewerDue: '3' },
          { id: 'c6', description: 'Confirm bank balances tie to the general ledger.', frequency: 'Monthly', preparer: PREP, preparerDue: '4', reviewer: REV, reviewerDue: '5' },
        ],
      },
    ],
  },
]

export type GridRow =
  | { id: string; kind: 'folder'; level: 0; label: string; count: number }
  | { id: string; kind: 'group'; level: 1; label: string; groupKind: Group['kind']; count: number }
  | ({ id: string; kind: 'leaf'; level: 2 } & Leaf)

function BranchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="6" cy="6" r="2.2" stroke="#1e8ae9" strokeWidth="1.6" />
      <circle cx="6" cy="18" r="2.2" stroke="#1e8ae9" strokeWidth="1.6" />
      <circle cx="18" cy="9" r="2.2" stroke="#1e8ae9" strokeWidth="1.6" />
      <path d="M6 8.2v7.6M8 6h4a4 4 0 014 4v-1" stroke="#1e8ae9" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
function CheckSquareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="3" stroke="#1FAC76" strokeWidth="1.6" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" stroke="#1FAC76" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function Chevron({ open }: { open: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`transition-transform ${open ? '' : '-rotate-90'}`}>
      <path d="M7 10l5 5 5-5" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TreeCell(params: ICellRendererParams<GridRow> & { toggle: (id: string) => void; expanded: Set<string> }) {
  const row = params.data
  if (!row) return null
  const expanded = params.expanded.has(row.id)

  if (row.kind === 'leaf') {
    return <span style={{ paddingLeft: 52 }} className="text-[#1d2433]">{row.description}</span>
  }

  const isFolder = row.kind === 'folder'
  return (
    <button onClick={() => params.toggle(row.id)} className="flex items-center gap-2 w-full text-left" style={{ paddingLeft: isFolder ? 0 : 24 }}>
      <Chevron open={expanded} />
      {row.kind === 'group' && (row.groupKind === 'reconciliation' ? <BranchIcon /> : <CheckSquareIcon />)}
      <span className="font-semibold text-[#1d2433]">{row.label}</span>
      <span className="text-[#9ca3af] font-normal">({row.count})</span>
    </button>
  )
}

function CloseRecordsGrid() {
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(FOLDERS.flatMap((f) => [f.id, ...f.groups.map((g) => g.id)])),
  )

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const rows = useMemo<GridRow[]>(() => {
    const out: GridRow[] = []
    for (const f of FOLDERS) {
      const fCount = f.groups.reduce((n, g) => n + g.items.length, 0)
      out.push({ id: f.id, kind: 'folder', level: 0, label: f.label, count: fCount })
      if (!expanded.has(f.id)) continue
      for (const g of f.groups) {
        out.push({ id: g.id, kind: 'group', level: 1, label: g.label, groupKind: g.kind, count: g.items.length })
        if (!expanded.has(g.id)) continue
        for (const item of g.items) out.push({ id: item.id, kind: 'leaf', level: 2, ...item })
      }
    }
    return out
  }, [expanded])

  const columnDefs = useMemo<ColDef<GridRow>[]>(
    () => [
      { colId: 'tree', headerName: 'Folder / Description', flex: 2, minWidth: 340, sortable: false, cellRenderer: TreeCell, cellRendererParams: { toggle, expanded } },
      { colId: 'frequency', headerName: 'Frequency', field: 'frequency', width: 130, sortable: false },
      { colId: 'preparer', headerName: 'Preparer', field: 'preparer', width: 230, sortable: false },
      { colId: 'preparerDue', headerName: 'Preparer Due', field: 'preparerDue', width: 140, sortable: false },
      { colId: 'reviewer', headerName: 'Reviewer', field: 'reviewer', width: 230, sortable: false },
      { colId: 'reviewerDue', headerName: 'Reviewer Due', field: 'reviewerDue', width: 140, sortable: false },
    ],
    [expanded],
  )

  return <FlatGrid<GridRow> rowData={rows} columnDefs={columnDefs} />
}

// ============================ Entities (flat) ============================
interface EntityRow {
  id: string
  name: string
  workflow: string
  gl: string
  teamMembers: number
  yearEnd: string
  currency: string
}
const ENTITIES: EntityRow[] = [
  { id: 'e1', name: 'FQ Taiwan', workflow: 'Monthly Close', gl: 'NetSuite', teamMembers: 6, yearEnd: '12/31', currency: 'TWD' },
  { id: 'e2', name: 'FQ US East', workflow: 'Monthly Close', gl: 'NetSuite', teamMembers: 12, yearEnd: '12/31', currency: 'USD' },
  { id: 'e3', name: 'FQ UK', workflow: 'Standard Close', gl: 'Sage Intacct', teamMembers: 4, yearEnd: '03/31', currency: 'GBP' },
  { id: 'e4', name: 'FQ Germany', workflow: 'Standard Close', gl: 'Sage Intacct', teamMembers: 5, yearEnd: '12/31', currency: 'EUR' },
  { id: 'e5', name: 'FQ Japan', workflow: 'Monthly Close', gl: 'Workday', teamMembers: 7, yearEnd: '03/31', currency: 'JPY' },
  { id: 'e6', name: 'FQ Canada', workflow: 'Monthly Close', gl: 'NetSuite', teamMembers: 3, yearEnd: '12/31', currency: 'CAD' },
]

function EntityRecordsGrid() {
  const columnDefs = useMemo<ColDef<EntityRow>[]>(
    () => [
      { headerName: 'Name', field: 'name', flex: 1, minWidth: 160 },
      { headerName: 'Workflow Name', field: 'workflow', width: 180 },
      { headerName: 'General Ledger', field: 'gl', width: 160 },
      { headerName: 'Team Members', field: 'teamMembers', width: 150 },
      { headerName: 'Year End', field: 'yearEnd', width: 120 },
      { headerName: 'Functional Currency', field: 'currency', width: 180 },
    ],
    [],
  )
  return <FlatGrid<EntityRow> rowData={ENTITIES} columnDefs={columnDefs} />
}

// ============================ Users (flat) ============================
interface UserRow {
  id: string
  name: string
  email: string
  userType: string
  workspace: string
  role: string
  status: string
}
const USERS: UserRow[] = [
  { id: 'u1', name: 'Aaron Rosenberg', email: 'aaron.rosenberg@acme.com', userType: 'Admin', workspace: '—', role: 'Manager', status: 'Active' },
  { id: 'u2', name: 'Brooke Smith', email: 'brook.smith@acme.com', userType: 'Admin', workspace: 'Corporate', role: 'Admin', status: 'Active' },
  { id: 'u3', name: 'Callie Arnold', email: 'callie.arnold@acme.com', userType: 'Admin', workspace: '—', role: 'Admin', status: 'Active' },
  { id: 'u4', name: 'Daniel Reyes', email: 'daniel.reyes@acme.com', userType: 'Admin', workspace: '—', role: 'Manager', status: 'Pending' },
  { id: 'u5', name: 'Erin Wallace', email: 'erin.wallace@acme.com', userType: 'Admin', workspace: 'EMEA', role: 'Advanced User', status: 'Active' },
  { id: 'u6', name: 'Marcus Lee', email: 'marcus.lee@acme.com', userType: 'Admin', workspace: '—', role: 'Manager', status: 'Active' },
]

function UserRecordsGrid() {
  const columnDefs = useMemo<ColDef<UserRow>[]>(
    () => [
      { headerName: 'Name', field: 'name', flex: 1, minWidth: 160 },
      { headerName: 'Email', field: 'email', width: 240 },
      { headerName: 'User Type', field: 'userType', width: 140 },
      { headerName: 'Workspace', field: 'workspace', width: 150 },
      { headerName: 'Role', field: 'role', width: 150 },
      { headerName: 'Status', field: 'status', width: 120 },
    ],
    [],
  )
  return <FlatGrid<UserRow> rowData={USERS} columnDefs={columnDefs} />
}

// ============================ Shared grid shell ============================
export function FlatGrid<T>({ rowData, columnDefs }: { rowData: T[]; columnDefs: ColDef<T>[] }) {
  const defaultColDef = useMemo<ColDef>(() => ({ resizable: false, suppressMovable: true, filter: false, sortable: false }), [])
  return (
    <div style={{ height: '100%' }}>
      <AgGridReact<T>
        theme={floqastGridTheme}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        suppressCellFocus
        loadThemeGoogleFonts={false}
      />
    </div>
  )
}

export function ImpactedRecordsGrid({ recordSet }: { recordSet: RecordSet }) {
  if (recordSet === 'entities') return <EntityRecordsGrid />
  if (recordSet === 'users') return <UserRecordsGrid />
  return <CloseRecordsGrid />
}
