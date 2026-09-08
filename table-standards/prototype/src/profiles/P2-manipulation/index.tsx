import { useMemo, useState } from 'react'
import type { ColDef, GetRowIdParams } from '@ag-grid-community/core'
import {
  GridShell,
  TableToolbar,
  SavedViewsMenu,
  ColumnPickerMenu,
  useGridState,
  textCol,
  setCol,
  currencyCol,
  numberCol,
  statusCol,
  dateCol,
  t,
  type Density,
} from '@kit'
import { makeAmortization, type AmortRow } from '@kit/data/mock.ts'
import type { StatusValue } from '@kit'
import type { ProfileMeta } from '../types.ts'

export const meta: ProfileMeta = {
  id: 'p2',
  code: 'P2',
  title: 'Manipulation',
  subtitle: 'Do work in the table — edit, adjust, group. + inline edit · grouping · aggregation.',
  surface: 'Amortization / Depreciation schedules · Adjustment Entries · FDM mapping',
  patterns: [
    { name: 'Inline editing', detail: 'Double-click Term, Monthly, or Status to edit in place — native cell editors, no modal round-trip.' },
    { name: 'User-regroupable grouping', detail: 'Drag a column into the group bar to regroup. Grouped by Method to start.' },
    { name: 'Summary counts, not dashes', detail: 'Group rows show a child count + aggregated totals (Andrew Baranak) — never the noisy dash/value mix.' },
    { name: 'Aggregation', detail: 'Monthly + Remaining sum per group, with a grand-total row.' },
  ],
}

const STATUS_VALUES: StatusValue[] = ['Not started', 'In progress', 'In review', 'Complete', 'Overdue']

export default function P2Manipulation() {
  const [density, setDensity] = useState<Density>('compact')
  const [quickSearch, setQuickSearch] = useState('')
  const { api, onGridReady } = useGridState()
  const rowData = useMemo(() => makeAmortization(36), [])

  const columnDefs = useMemo<ColDef<AmortRow>[]>(
    () => [
      textCol('asset', 'Asset', { minWidth: 200, flex: 1 }),
      setCol('method', 'Method', { rowGroup: true, hide: true }),
      setCol('entity', 'Entity', { width: 160 }),
      dateCol('startDate', 'Start', { width: 120 }),
      numberCol('termMonths', 'Term (mo)', { width: 120, editable: true }),
      currencyCol('monthlyAmount', 'Monthly', { width: 150, editable: true, aggFunc: 'sum' }),
      currencyCol('remaining', 'Remaining', { width: 150, aggFunc: 'sum' }),
      statusCol('status', 'Status', {
        width: 160,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: { values: STATUS_VALUES },
      }),
    ],
    [],
  )

  const autoGroupColumnDef = useMemo<ColDef>(
    () => ({ headerName: 'Method', minWidth: 240, pinned: 'left', cellRendererParams: { suppressCount: false } }),
    [],
  )

  return (
    <div className="h-full flex flex-col">
      <TableToolbar
        title="Amortization Schedules"
        quickSearch={quickSearch}
        onQuickSearch={setQuickSearch}
        density={density}
        onDensityChange={setDensity}
      >
        <ColumnPickerMenu api={api} />
        <SavedViewsMenu profileId="p2" api={api} />
      </TableToolbar>

      <div className="text-[12px] pb-2" style={{ color: t.textMuted }}>
        Double-click Term, Monthly, or Status to edit. Drag a column header into the group bar to regroup.
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
          getRowId={(p: GetRowIdParams<AmortRow>) => p.data.id}
          onGridReady={onGridReady}
          stopEditingWhenCellsLoseFocus
        />
      </div>
    </div>
  )
}
