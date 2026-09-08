import { useMemo, useState } from 'react'
import type { ColDef, ColGroupDef, GetRowIdParams, RowDoubleClickedEvent } from '@ag-grid-community/core'
import {
  GridShell,
  TableToolbar,
  SavedViewsMenu,
  ColumnPickerMenu,
  useGridState,
  ExplanationRenderer,
  setCol,
  currencyCol,
  varianceCol,
  pctCol,
  personCol,
  statusCol,
  palette,
  t,
  type Density,
} from '@kit'
import { makeVariance, makeTransactions, type VarianceRow, type TransactionRow } from '@kit/data/mock.ts'
import type { ProfileMeta } from '../types.ts'

export const meta: ProfileMeta = {
  id: 'p3b',
  code: 'P3b',
  title: 'Analytical-complex',
  subtitle: 'Analyze financials — variance, statements, reports. + comparison groups · presets · drill-in.',
  surface: 'Variance / AI Variance · Balance Sheet · Income Statement · Reporting',
  patterns: [
    { name: 'MoM / YoY comparison column groups', detail: 'Foldable column groups (expand for %) — intentional comparison headers, distinct from the "stacked headers" we killed. Tames width instead of one flat wide grid.' },
    { name: 'Aggregation + regroupable', detail: 'Grouped by category with subtotals and a grand-total row; drag to regroup.' },
    { name: 'Materiality highlight', detail: 'Variance ≥ 20% flags a danger pill (PctRenderer) so the eye goes to what matters.' },
    { name: 'Saved presets + pinned anchor', detail: 'Account pinned left as the reading anchor; saved presets recall a report layout. In-grid AI explanation cell.' },
    { name: 'Drill-in drawer', detail: 'Double-click a row to open transactions in a focused drawer — master/detail is reserved for tx drill-down, not the main grid.' },
  ],
}

export default function P3bAnalytical() {
  const [density, setDensity] = useState<Density>('compact')
  const [quickSearch, setQuickSearch] = useState('')
  const [drillRow, setDrillRow] = useState<VarianceRow | null>(null)
  const { api, onGridReady } = useGridState()
  const rowData = useMemo(() => makeVariance(), [])
  const allTx = useMemo(() => makeTransactions(180), [])

  const columnDefs = useMemo<(ColDef<VarianceRow> | ColGroupDef<VarianceRow>)[]>(
    () => [
      setCol('category', 'Category', { rowGroup: true, hide: true }),
      { field: 'account', headerName: 'Account', pinned: 'left', minWidth: 200, filter: 'agTextColumnFilter' },
      currencyCol('currentPeriod', 'Current', { width: 140, aggFunc: 'sum' }),
      currencyCol('priorPeriod', 'Prior month', { width: 140, aggFunc: 'sum' }),
      {
        headerName: 'Month over Month',
        marryChildren: true,
        children: [
          varianceCol('momDollar', 'Δ $', { width: 130, aggFunc: 'sum' }),
          pctCol('momPct', 'Δ %', { width: 110, threshold: 0.2, columnGroupShow: 'open' }),
        ],
      },
      currencyCol('priorYear', 'Prior year', { width: 140, aggFunc: 'sum' }),
      {
        headerName: 'Year over Year',
        marryChildren: true,
        children: [
          varianceCol('yoyDollar', 'Δ $', { width: 130, aggFunc: 'sum' }),
          pctCol('yoyPct', 'Δ %', { width: 110, threshold: 0.2, columnGroupShow: 'open' }),
        ],
      },
      { field: 'explanation', headerName: 'Explanation', minWidth: 220, flex: 1, cellRenderer: ExplanationRenderer, sortable: false, filter: false },
      personCol('owner', 'Owner', { width: 160 }),
      statusCol('status', 'Status', { width: 150 }),
    ],
    [],
  )

  const autoGroupColumnDef = useMemo<ColDef>(
    () => ({ headerName: 'Category', minWidth: 220, pinned: 'left', cellRendererParams: { suppressCount: false } }),
    [],
  )

  return (
    <div className="h-full flex flex-col relative">
      <TableToolbar
        title="AI Variance"
        quickSearch={quickSearch}
        onQuickSearch={setQuickSearch}
        density={density}
        onDensityChange={setDensity}
      >
        <ColumnPickerMenu api={api} />
        <SavedViewsMenu profileId="p3b" api={api} />
      </TableToolbar>

      <div className="text-[12px] pb-2" style={{ color: t.textMuted }}>
        Expand a comparison group for %. Double-click a row to drill into transactions.
      </div>

      <div className="flex-1 min-h-0">
        <GridShell
          density={density}
          rowData={rowData}
          columnDefs={columnDefs}
          autoGroupColumnDef={autoGroupColumnDef}
          rowGroupPanelShow="always"
          groupDefaultExpanded={1}
          grandTotalRow="bottom"
          suppressAggFuncInHeader
          quickFilterText={quickSearch}
          getRowId={(p: GetRowIdParams<VarianceRow>) => p.data.id}
          onGridReady={onGridReady}
          onRowDoubleClicked={(e: RowDoubleClickedEvent<VarianceRow>) => e.data && setDrillRow(e.data)}
        />
      </div>

      {drillRow && (
        <DrillDrawer
          row={drillRow}
          transactions={allTx.filter((tx) => tx.account === drillRow.account).slice(0, 12)}
          onClose={() => setDrillRow(null)}
        />
      )}
    </div>
  )
}

function DrillDrawer({
  row,
  transactions,
  onClose,
}: {
  row: VarianceRow
  transactions: TransactionRow[]
  onClose: () => void
}) {
  return (
    <div className="absolute top-0 right-0 h-full w-[420px] flex flex-col z-30"
      style={{ backgroundColor: palette.surfaceBase, borderLeft: `1px solid ${palette.border}`, boxShadow: '-8px 0 24px rgba(29,36,51,0.10)' }}
    >
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${palette.border}` }}>
        <div>
          <div className="text-[14px] font-semibold" style={{ color: palette.textBody }}>{row.account}</div>
          <div className="text-[12px]" style={{ color: palette.textMuted }}>{row.category} · transaction detail</div>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded flex items-center justify-center hover:bg-black/5" style={{ color: palette.textTertiary }} title="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-[12px]">
          <thead>
            <tr style={{ backgroundColor: palette.surfaceWeakest, color: palette.textHeaderSecondary }}>
              <th className="text-left font-semibold px-3 py-2">Date</th>
              <th className="text-left font-semibold px-3 py-2">Description</th>
              <th className="text-right font-semibold px-3 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 && (
              <tr><td colSpan={3} className="px-3 py-4 text-center" style={{ color: palette.textMuted }}>No transactions</td></tr>
            )}
            {transactions.map((tx) => (
              <tr key={tx.id} style={{ borderBottom: `1px solid ${palette.border}` }}>
                <td className="px-3 py-2 tabular-nums" style={{ color: palette.textBody }}>{tx.date}</td>
                <td className="px-3 py-2" style={{ color: palette.textBody }}>{tx.description}</td>
                <td className="px-3 py-2 text-right tabular-nums" style={{ color: palette.textBody }}>
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tx.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
