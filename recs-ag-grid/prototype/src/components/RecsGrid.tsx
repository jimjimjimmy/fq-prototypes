import { useCallback, useMemo } from 'react'
import { AgGridReact } from 'ag-grid-react'
import {
  ModuleRegistry,
  type ColDef,
  type ColGroupDef,
  type ICellRendererParams,
  type ValueGetterParams,
  type GetRowIdParams,
} from 'ag-grid-community'
import { AllEnterpriseModule } from 'ag-grid-enterprise'
import { floqastGridTheme } from '../theme.ts'
import { MOCK_DATA } from '../data/mockData.ts'
import { computeDifference, type ReconciliationRow, type Assignee } from '../data/types.ts'

ModuleRegistry.registerModules([AllEnterpriseModule])

const TINTED_BG = '#F7F9FC'
const MUTED = '#6B7280'

// ── Currency formatting ───────────────────────────────────────
function decimalsFor(code: string): number {
  return ['JPY', 'KRW'].includes(code) ? 0 : 2
}

/** "MXN 10,327.55", "MXN (147.60)", "JPY 93,378", or "-" for null. */
function formatMoney(
  value: number | null | undefined,
  currency: string,
  opts: { star?: boolean } = {},
): string {
  if (value == null) return '-'
  const d = decimalsFor(currency)
  // Round first so floating-point near-zero (e.g. -7e-14) does not render as "(0.00)".
  const factor = 10 ** d
  const rounded = Math.round(value * factor) / factor
  const abs = Math.abs(rounded).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d })
  const body = rounded < 0 ? `(${abs})` : abs
  return `${currency} ${body}${opts.star ? '*' : ''}`
}

// ── Money cell renderer ───────────────────────────────────────
type Tier = 'functional' | 'local' | 'reporting'

function moneyRenderer(
  currencyOf: (r: ReconciliationRow | undefined) => string,
  opts: { star?: boolean; isDifference?: boolean } = {},
) {
  return (p: ICellRendererParams<ReconciliationRow>) => {
    // p.value resolves field columns AND valueGetter (difference) columns, and
    // AG Grid populates it with aggregated data on the grand-total row.
    const value = p.value as number | null | undefined
    const currency = currencyOf(p.data)
    if (value == null) return <span style={{ color: MUTED }}>-</span>
    return (
      <span
        style={{
          fontVariantNumeric: 'tabular-nums',
          color: '#1D2433',
        }}
      >
        {formatMoney(value, currency, { star: opts.star })}
      </span>
    )
  }
}

function differenceGetter(tier: Tier) {
  return (p: ValueGetterParams<ReconciliationRow>): number | null => {
    const src = p.node?.aggData ?? p.data
    if (!src) return null
    // Figma sign convention is recBalance - perGL - recItems, i.e. the negative
    // of the ported computeDifference (perGL - recBalance + recItems).
    const v = computeDifference(
      src[`perGL_${tier}`] ?? null,
      src[`recBalance_${tier}`] ?? null,
      src[`recItems_${tier}`] ?? null,
    )
    return v == null ? null : -v
  }
}

// ── Rich Account cell (also the tree group column) ────────────
function MetaLine({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 11, lineHeight: '15px', color: MUTED }}>{children}</div>
}

function AccountInner(p: ICellRendererParams<ReconciliationRow>) {
  // Grand-total (footer) row: "Total" label + "Close Group" collapse link.
  if (p.node.footer || p.node.rowPinned) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#1D2433' }}>Total</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#3D7BF7', cursor: 'pointer' }}>
          <span className="material-icons-outlined" style={{ fontSize: 14 }}>unfold_less</span>
          Close Group
        </span>
      </div>
    )
  }
  const d = p.data
  if (!d) return null
  const isBank = d.tags.includes('Bank')
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1, paddingTop: 8, paddingBottom: 8 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#1D2433', lineHeight: '16px' }}>{d.accountName}</div>
      <MetaLine>Company: {d.entityName}</MetaLine>
      {isBank && <MetaLine>Reporting Book: GAAP Accounting, (No Value)</MetaLine>}
      <MetaLine>Bank Account: {isBank ? 'BofA' : '(No Value)'}</MetaLine>
      {isBank && <MetaLine>Revenue Category: Opex</MetaLine>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: MUTED }}>
        #FQ-adf2304-123213
        <span className="material-icons-outlined" style={{ fontSize: 13, cursor: 'pointer' }}>content_copy</span>
      </div>
    </div>
  )
}

// ── Period / Folder cell (two-line) ───────────────────────────
function PeriodFolderCell(p: ICellRendererParams<ReconciliationRow>) {
  const d = p.data
  // Children (under a parent account) and the total row show nothing here.
  if (!d || d.parentId) return null
  if (p.node.footer || p.node.rowPinned) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 1, paddingTop: 8 }}>
      <div style={{ fontSize: 12, color: '#1D2433', lineHeight: '16px' }}>{d.period}:</div>
      <div style={{ fontSize: 12, color: '#1D2433', lineHeight: '16px' }}>{d.folder}</div>
    </div>
  )
}

// ── Assignees: stacked rows of avatar + name + role + toggle ──
function ToggleSwitch({ on }: { on: boolean }) {
  return (
    <div style={{ width: 32, height: 18, borderRadius: 9, background: on ? '#1FAC76' : '#CBD2E1', position: 'relative', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 2, left: on ? 16 : 2, width: 14, height: 14, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.25)' }} />
    </div>
  )
}

function AssigneesCell(p: ICellRendererParams<ReconciliationRow>) {
  const assignees: Assignee[] = p.data?.assignees ?? []
  if (p.node.footer || p.node.rowPinned || assignees.length === 0) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 10 }}>
      {assignees.map((a) => (
        <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src={a.avatarUrl} alt={a.name} style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '14px', flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1D2433' }}>{a.name}</span>
            <span style={{ fontSize: 11, color: MUTED }}>{a.role}</span>
          </div>
          {/* Toggle reflects active assignment (on for all), independent of sign-off. */}
          <ToggleSwitch on={true} />
        </div>
      ))}
    </div>
  )
}

// ── Due Date: stacked dates aligned to assignee rows ──────────
function DueDateCell(p: ICellRendererParams<ReconciliationRow>) {
  const assignees: Assignee[] = p.data?.assignees ?? []
  if (p.node.footer || p.node.rowPinned || assignees.length === 0) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 13 }}>
      {assignees.map((a) => (
        <div key={a.name} style={{ fontSize: 12, color: '#1D2433', height: 24, display: 'flex', alignItems: 'center' }}>
          {p.data?.dueDate || '11/26/2024'}
        </div>
      ))}
    </div>
  )
}

// ── Completed: name + date + status icon, stacked ─────────────
function CompletedCell(p: ICellRendererParams<ReconciliationRow>) {
  const assignees: Assignee[] = p.data?.assignees ?? []
  if (p.node.footer || p.node.rowPinned || assignees.length === 0) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 10 }}>
      {assignees.map((a) => (
        <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 6, height: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '14px' }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#1D2433' }}>{a.name}</span>
            <span style={{ fontSize: 11, color: MUTED }}>{a.signOffDate ?? ''}</span>
          </div>
          {a.signedOff ? (
            <span className="material-icons-outlined" style={{ fontSize: 16, color: '#1FAC76' }}>check_circle</span>
          ) : (
            <span className="material-icons-outlined" style={{ fontSize: 16, color: '#E8833A' }}>schedule</span>
          )}
        </div>
      ))}
    </div>
  )
}

function ActionsCell(p: ICellRendererParams<ReconciliationRow>) {
  if (p.node.footer || p.node.rowPinned) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingTop: 12, color: MUTED }}>
      <span className="material-icons-outlined" style={{ fontSize: 18, cursor: 'pointer' }}>chat_bubble_outline</span>
      <span className="material-icons-outlined" style={{ fontSize: 18, cursor: 'pointer' }}>insert_drive_file</span>
      <span className="material-icons-outlined" style={{ fontSize: 18, cursor: 'pointer' }}>settings</span>
      <span className="material-icons-outlined" style={{ fontSize: 18, cursor: 'pointer' }}>more_vert</span>
    </div>
  )
}

// Currency accessors per tier
const functionalCcy = (r: ReconciliationRow | undefined) => r?.functionalCurrency ?? 'MXN'
const localCcy = () => 'JPY' // Local block is shown in JPY per the Figma design

interface RecsGridProps {
  mcMode: boolean
}

export function RecsGrid({ mcMode }: RecsGridProps) {
  const getDataPath = useCallback((d: ReconciliationRow) => (d.parentId ? [d.parentId, d.id] : [d.id]), [])
  const getRowId = useCallback((p: GetRowIdParams<ReconciliationRow>) => p.data.id, [])

  const columnDefs = useMemo<(ColDef<ReconciliationRow> | ColGroupDef<ReconciliationRow>)[]>(() => {
    const periodFolder: ColDef<ReconciliationRow> = {
      headerName: 'Period/ Folder',
      colId: 'periodFolder',
      pinned: 'left',
      width: 168,
      wrapText: true,
      autoHeight: false,
      cellRenderer: PeriodFolderCell,
      cellStyle: { display: 'flex', alignItems: 'flex-start' },
    }

    // Account is the tree/group column (groupDisplayType="custom" lets it sit
    // after Period/Folder instead of being forced first by the auto column).
    const accountCol: ColDef<ReconciliationRow> = {
      headerName: 'Account',
      colId: 'account',
      pinned: 'left',
      width: 320,
      showRowGroup: true,
      cellRenderer: 'agGroupCellRenderer',
      cellRendererParams: { suppressCount: true, innerRenderer: AccountInner },
      cellStyle: { display: 'flex', alignItems: 'flex-start' },
    }

    const functionalChildren: ColDef<ReconciliationRow>[] = [
      { headerName: 'Per GL', field: 'perGL_functional', type: 'rightAligned', aggFunc: 'sum', width: 130, cellRenderer: moneyRenderer(functionalCcy) },
      { headerName: 'Rec. Balance', field: 'recBalance_functional', type: 'rightAligned', aggFunc: 'sum', width: 150, cellRenderer: moneyRenderer(functionalCcy, { star: true }) },
      { headerName: 'Rec. Items', field: 'recItems_functional', type: 'rightAligned', aggFunc: 'sum', width: 130, cellRenderer: moneyRenderer(functionalCcy) },
      { headerName: 'Difference', colId: 'diff_functional', type: 'rightAligned', width: 130, valueGetter: differenceGetter('functional'), cellRenderer: moneyRenderer(functionalCcy, { isDifference: true }) },
    ]

    const rightCols: ColDef<ReconciliationRow>[] = [
      { headerName: 'Assignees', colId: 'assignees', width: 248, cellRenderer: AssigneesCell, cellStyle: { display: 'flex', alignItems: 'flex-start' } },
      { headerName: 'Due Date', colId: 'dueDate', width: 110, cellRenderer: DueDateCell, cellStyle: { display: 'flex', alignItems: 'flex-start' } },
      { headerName: 'Completed', colId: 'completed', width: 200, cellRenderer: CompletedCell, cellStyle: { display: 'flex', alignItems: 'flex-start' } },
      { headerName: 'Actions', colId: 'actions', width: 130, pinned: 'right', cellRenderer: ActionsCell, cellStyle: { display: 'flex', alignItems: 'flex-start' } },
    ]

    if (!mcMode) {
      // Standard: flat 4 Functional columns, no group header row.
      return [periodFolder, accountCol, ...functionalChildren, ...rightCols]
    }

    // Multi Currency: Functional (MXN) group, then Local (JPY) group.
    const functionalGroup: ColGroupDef<ReconciliationRow> = {
      headerName: 'Functional (MXN)',
      children: functionalChildren,
    }
    const localGroup: ColGroupDef<ReconciliationRow> = {
      headerName: 'Local (JPY)',
      children: [
        { headerName: 'Rec. Balance', field: 'recBalance_local', type: 'rightAligned', aggFunc: 'sum', width: 140, headerStyle: { backgroundColor: TINTED_BG }, cellStyle: { backgroundColor: TINTED_BG }, cellRenderer: moneyRenderer(localCcy, { star: true }) },
        { headerName: 'Rec. Items', field: 'recItems_local', type: 'rightAligned', aggFunc: 'sum', width: 120, headerStyle: { backgroundColor: TINTED_BG }, cellStyle: { backgroundColor: TINTED_BG }, cellRenderer: moneyRenderer(localCcy) },
      ],
    }
    return [periodFolder, accountCol, functionalGroup, localGroup, ...rightCols]
  }, [mcMode])

  const defaultColDef = useMemo<ColDef<ReconciliationRow>>(
    () => ({ resizable: true, sortable: false, suppressHeaderMenuButton: true }),
    [],
  )

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <AgGridReact<ReconciliationRow>
        theme={floqastGridTheme}
        rowData={MOCK_DATA}
        treeData
        getDataPath={getDataPath}
        getRowId={getRowId}
        groupDisplayType="custom"
        groupDefaultExpanded={-1}
        grandTotalRow="bottom"
        suppressAggFuncInHeader
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        getRowHeight={(p) => {
          if (p.node.footer || p.node.rowPinned) return 44
          const a = (p.data?.assignees?.length ?? 0)
          const meta = p.data?.tags.includes('Bank') ? 96 : 76
          return Math.max(meta, a * 34 + 24)
        }}
        headerHeight={40}
        groupHeaderHeight={40}
      />
    </div>
  )
}
