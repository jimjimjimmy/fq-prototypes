import { useMemo, useState } from 'react'
import type { ColDef, GetRowIdParams } from '@ag-grid-community/core'
import {
  GridShell,
  TableToolbar,
  SavedViewsMenu,
  ColumnPickerMenu,
  FilterStatusBar,
  QuickFilterBar,
  useQuickFilters,
  useGridState,
  SignOffDetailRenderer,
  setCol,
  badgeCol,
  currencyCol,
  missingCol,
  differenceCol,
  statusCol,
  dateCol,
  peopleCol,
  actionsCol,
  type QuickChip,
  type Density,
} from '@kit'
import { makeRecs, ME, type ReconRow } from '@kit/data/mock.ts'
import type { ProfileMeta } from '../types.ts'

export const meta: ProfileMeta = {
  id: 'p3a',
  code: 'P3a',
  title: 'Workflow-complex',
  subtitle: 'Manage accounting work — status, sign-off, hierarchy. + master/detail · quick filters.',
  surface: 'Reconciliations · Checklist · Folders · JEM Homepage',
  patterns: [
    { name: 'Per-column filters (base) + compound quick filters (above)', detail: 'Restyled per-column filters handle single-column predicates; above-table chips handle what a column can\'t — "Assigned to me" = due-date AND assignee. The two layers compose (AG Grid external filter + column filters).' },
    { name: 'Status + sign-off', detail: 'FlowUI status dot+text; per-assignee sign-off toggles inside the detail panel.' },
    { name: 'Master/detail (not pivot-expand)', detail: 'Expand a row into a self-contained sign-off panel — Andrew Baranak\'s "detail table", never a horizontal Swiss-cheese expand.' },
    { name: 'Filter visibility + clear all', detail: 'Column + quick filters both surface as removable pills with one Clear all.' },
  ],
}

const CHIPS: QuickChip[] = [
  { id: 'mine', label: 'Assigned to me', predicate: (r: ReconRow) => r.assignees.some((a) => a.name === ME.name) },
  { id: 'overdue', label: 'Overdue', predicate: (r: ReconRow) => r.overdue || r.status === 'Overdue' },
  { id: 'notes', label: 'Open notes', predicate: (r: ReconRow) => (r.noteCount ?? 0) > 0 },
  { id: 'unsigned', label: 'Not fully signed off', predicate: (r: ReconRow) => r.assignees.some((a) => !a.signedOff) },
]

export default function P3aWorkflow() {
  const [density, setDensity] = useState<Density>('compact')
  const [quickSearch, setQuickSearch] = useState('')
  const { api, onGridReady, columnFilterKeys, onFilterChanged } = useGridState()
  const q = useQuickFilters(CHIPS)
  const rowData = useMemo(() => makeRecs(28), [])

  const columnDefs = useMemo<ColDef<ReconRow>[]>(
    () => [
      { field: 'accountName', headerName: 'Account', minWidth: 220, pinned: 'left', cellRenderer: 'agGroupCellRenderer', filter: 'agTextColumnFilter' },
      setCol('entity', 'Entity', { flex: 1, minWidth: 140 }),
      badgeCol('accountType', 'Type', { width: 130 }),
      badgeCol('tags', 'Tags', { width: 130, sortable: false }),
      currencyCol('perGL', 'Per GL', { width: 140 }),
      missingCol('recBalance', 'Rec. Balance', { width: 150 }),
      differenceCol('difference', 'Difference', { width: 140 }),
      peopleCol('assignees', 'Assignees', { width: 160 }),
      statusCol('status', 'Status', { width: 150 }),
      dateCol('dueDate', 'Due', { width: 110, cellRendererParams: { overdueField: 'overdue' } }),
      actionsCol(),
    ],
    [],
  )

  const clearAll = () => {
    api?.setFilterModel(null)
    q.clear()
  }

  return (
    <div className="h-full flex flex-col">
      <TableToolbar
        title="Reconciliations"
        quickSearch={quickSearch}
        onQuickSearch={setQuickSearch}
        density={density}
        onDensityChange={setDensity}
      >
        <ColumnPickerMenu api={api} />
        <SavedViewsMenu profileId="p3a" api={api} />
      </TableToolbar>

      <div className="pb-2">
        <QuickFilterBar {...q.bar} />
      </div>

      <FilterStatusBar
        api={api}
        columnFilterKeys={columnFilterKeys}
        activeChips={q.active}
        chips={CHIPS}
        onRemoveChip={(id) => q.bar.onToggle(id)}
        onClearAll={clearAll}
      />

      <div className="flex-1 min-h-0">
        <GridShell
          density={density}
          rowData={rowData}
          columnDefs={columnDefs}
          quickFilterText={quickSearch}
          masterDetail
          detailCellRenderer={SignOffDetailRenderer}
          detailRowAutoHeight
          getRowId={(p: GetRowIdParams<ReconRow>) => p.data.id}
          isExternalFilterPresent={q.isExternalFilterPresent}
          doesExternalFilterPass={q.doesExternalFilterPass}
          onGridReady={(e: any) => {
            onGridReady(e)
            q.onGridReady(e.api)
          }}
          onFilterChanged={onFilterChanged}
        />
      </div>
    </div>
  )
}
