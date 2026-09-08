import { useMemo, useCallback } from 'react'
import { AgGridReact } from '@ag-grid-community/react'
import type { ColDef } from '@ag-grid-community/core'
import { floqastGridTheme } from '../../../scaffold/grid/floqastGridTheme'
import type { FieldMapping } from '../../../data/field-mappings'
import FqFieldRenderer from './cell-renderers/FqFieldRenderer'
import SourceFieldRenderer from './cell-renderers/SourceFieldRenderer'
import DataTypeRenderer from './cell-renderers/DataTypeRenderer'
import TransformationCellRenderer from './cell-renderers/TransformationCellRenderer'

// AG Grid modules (ClientSideRowModelModule) are registered globally
// in `src/main.tsx`. No per-component registration needed in v2.

interface FieldMappingTableProps {
  rowData: FieldMapping[]
  onEditTransformation: (mapping: FieldMapping) => void
}

export default function FieldMappingTable({ rowData, onEditTransformation }: FieldMappingTableProps) {
  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    resizable: true,
    filter: true,
    floatingFilter: true,
    suppressHeaderMenuButton: false,
  }), [])

  const transformationCellRenderer = useCallback(
    (params: Parameters<typeof TransformationCellRenderer>[0]) => (
      <TransformationCellRenderer {...params} onEditTransformation={onEditTransformation} />
    ),
    [onEditTransformation],
  )

  const columnDefs = useMemo<ColDef<FieldMapping>[]>(() => [
    {
      headerName: 'FQ Field',
      field: 'fqFieldName',
      width: 230,
      cellRenderer: FqFieldRenderer,
    },
    {
      headerName: 'Source Fields',
      field: 'sourceFields',
      width: 240,
      cellRenderer: SourceFieldRenderer,
      sortable: false,
    },
    {
      headerName: 'Data Type',
      field: 'dataType',
      width: 125,
      cellRenderer: DataTypeRenderer,
    },
    {
      headerName: 'Transformation',
      field: 'transformation',
      flex: 1,
      minWidth: 600,
      cellRenderer: transformationCellRenderer,
      sortable: false,
    },
  ], [transformationCellRenderer])

  return (
    <div className="flex-1 w-full">
      <AgGridReact<FieldMapping>
        theme={floqastGridTheme}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        domLayout="autoHeight"
        rowHeight={42}
        headerHeight={50}
        floatingFiltersHeight={50}
        getRowId={(params) => params.data.id}
        suppressCellFocus
      />
    </div>
  )
}
