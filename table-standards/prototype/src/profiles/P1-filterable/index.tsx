import { useMemo, useState } from 'react'
import type { ColDef } from '@ag-grid-community/core'
import {
  GridShell,
  TableToolbar,
  SavedViewsMenu,
  FilterStatusBar,
  ColumnPickerMenu,
  useGridState,
  textCol,
  setCol,
  badgeCol,
  currencyCol,
  dateCol,
  personCol,
  type Density,
  type BadgeColor,
} from '@kit'
import { makeTransactions, type TransactionRow } from '@kit/data/mock.ts'
import type { ProfileMeta } from '../types.ts'

export const meta: ProfileMeta = {
  id: 'p1',
  code: 'P1',
  title: 'Filterable',
  subtitle: 'Find a subset in a larger read-only dataset. + filter · column mgmt · saved views.',
  surface: 'Transactions · AI Matching · transaction detail lists',
  patterns: [
    { name: 'Per-column filtering (base layer)', detail: 'Native AG Grid Set/Text/Number filters — the straightforward, out-of-the-box mechanism — restyled to read as FlowUI (Inter, 6px radii, FQ greens). Opened from the header, NOT always-on search boxes.' },
    { name: 'Active-filter visibility + clear all', detail: 'Every active filter shows as a removable pill with a single "Clear all" — nothing filters invisibly (the hidden-side-drawer trap).' },
    { name: 'Saved views', detail: 'Save + recall column layout, sort, and filters. Greenfield pattern defined once in the kit.' },
    { name: 'Column management', detail: 'Show/hide/reorder via the Columns panel — column control, not filter control, so the right panel stays acceptable.' },
  ],
}

const STATUS_COLORS: Record<string, BadgeColor> = {
  Matched: 'success',
  Unmatched: 'warning',
  Excluded: 'default',
}

export default function P1Filterable() {
  const [density, setDensity] = useState<Density>('compact')
  const [quickSearch, setQuickSearch] = useState('')
  const { api, onGridReady, columnFilterKeys, onFilterChanged } = useGridState()
  const rowData = useMemo(() => makeTransactions(180), [])

  const columnDefs = useMemo<ColDef<TransactionRow>[]>(
    () => [
      textCol('id', 'Txn ID', { width: 120, pinned: 'left' }),
      dateCol('date', 'Date', { width: 120 }),
      textCol('description', 'Description', { flex: 1, minWidth: 180 }),
      setCol('account', 'Account', { width: 200 }),
      setCol('entity', 'Entity', { width: 160 }),
      setCol('source', 'Source', { width: 130 }),
      badgeCol('status', 'Status', { width: 130, colorMap: STATUS_COLORS }),
      currencyCol('amount', 'Amount', { width: 150 }),
      personCol('assignedTo', 'Assigned to', { width: 180 }),
    ],
    [],
  )

  return (
    <div className="h-full flex flex-col">
      <TableToolbar
        title="Transactions"
        quickSearch={quickSearch}
        onQuickSearch={setQuickSearch}
        density={density}
        onDensityChange={setDensity}
      >
        <ColumnPickerMenu api={api} />
        <SavedViewsMenu profileId="p1" api={api} />
      </TableToolbar>

      <FilterStatusBar
        api={api}
        columnFilterKeys={columnFilterKeys}
        activeChips={[]}
        chips={[]}
        onRemoveChip={() => {}}
        onClearAll={() => api?.setFilterModel(null)}
      />

      <div className="flex-1 min-h-0">
        <GridShell
          density={density}
          rowData={rowData}
          columnDefs={columnDefs}
          quickFilterText={quickSearch}
          onGridReady={onGridReady}
          onFilterChanged={onFilterChanged}
        />
      </div>
    </div>
  )
}
