import { useMemo, useCallback } from 'react';
import { AgGridReact } from '@ag-grid-community/react';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import type { ColDef, ICellRendererParams } from '@ag-grid-community/core';
import type { Collection, VarianceItem } from '../../../data/variances';
import { formatDollar, formatPercent } from '../../../data/variances';
import { floqastGridTheme } from '../table/floqastGridTheme';

interface RowData {
  id: string;
  accountName: string;
  accountNumber: string;
  currentAmount: number;
  priorAmount: number;
  changeAmount: number;
  changePercent: number;
  status: string;
  explanation: string[];
}

function ChangeCellRenderer({ data }: ICellRendererParams<RowData>) {
  if (!data) return null;
  const isUp = data.changeAmount >= 0;
  return <span style={{ color: isUp ? '#059669' : '#dc2626', fontVariantNumeric: 'tabular-nums' }}>{formatDollar(data.changeAmount)}</span>;
}

function PercentCellRenderer({ data }: ICellRendererParams<RowData>) {
  if (!data) return null;
  const isUp = data.changeAmount >= 0;
  return <span style={{ color: isUp ? '#059669' : '#dc2626', fontVariantNumeric: 'tabular-nums' }}>{formatPercent(data.changePercent)}</span>;
}

function StatusCellRenderer({ data }: ICellRendererParams<RowData>) {
  if (!data) return null;
  const map: Record<string, { label: string; bg: string; color: string }> = {
    'not-started':      { label: 'Not started',     bg: '#f3f4f6', color: '#6b7280' },
    'in-progress':      { label: 'In progress',     bg: '#eff6ff', color: '#3b82f6' },
    'ready-for-review': { label: 'Ready for review', bg: '#fefce8', color: '#ca8a04' },
    'signed-off':       { label: 'Signed off',       bg: '#f0fdf4', color: '#16a34a' },
  };
  const s = map[data.status] ?? map['not-started'];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 9999, fontSize: 11, fontWeight: 500, backgroundColor: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

function ExplanationCellRenderer({ data }: ICellRendererParams<RowData>) {
  if (!data || !data.explanation.length) return <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>No explanation drafted</span>;
  const preview = data.explanation[0];
  const more = data.explanation.length - 1;
  return (
    <span style={{ color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
      {preview}
      {more > 0 && <span style={{ color: '#9ca3af', marginLeft: 6 }}>+{more} more</span>}
    </span>
  );
}

interface Props {
  collection: Collection;
  onSelectItem: (id: string) => void;
}

export function CollectionTablePanel({ collection, onSelectItem }: Props) {
  const rowData = useMemo<RowData[]>(() =>
    collection.items.map((item: VarianceItem) => ({
      id: item.id,
      accountName: item.accountName,
      accountNumber: item.accountNumber,
      currentAmount: item.currentAmount,
      priorAmount: item.priorAmount,
      changeAmount: item.changeAmount,
      changePercent: item.changePercent,
      status: item.status,
      explanation: item.draftExplanation ? [item.draftExplanation] : item.aiExplanation,
    })),
  [collection]);

  const colDefs = useMemo<ColDef<RowData>[]>(() => [
    { field: 'accountName',   headerName: 'Account',      width: 180, pinned: 'left', cellStyle: { fontWeight: 500 } },
    { field: 'accountNumber', headerName: 'Acct #',       width: 80,  cellStyle: { color: '#9ca3af', fontVariantNumeric: 'tabular-nums' } },
    {
      headerName: `${collection.priorPeriod} Amt`, field: 'priorAmount', width: 130, type: 'numericColumn',
      valueFormatter: ({ value }) => `$${Math.abs(value).toLocaleString('en-US')}`,
      cellStyle: { fontVariantNumeric: 'tabular-nums', color: '#6b7280' },
    },
    {
      headerName: `${collection.currentPeriod} Amt`, field: 'currentAmount', width: 130, type: 'numericColumn',
      valueFormatter: ({ value }) => `$${Math.abs(value).toLocaleString('en-US')}`,
      cellStyle: { fontVariantNumeric: 'tabular-nums', color: '#374151' },
    },
    { headerName: 'Change $',   field: 'changeAmount',  width: 110, type: 'numericColumn', cellRenderer: ChangeCellRenderer },
    { headerName: 'Change %',   field: 'changePercent', width: 100, type: 'numericColumn', cellRenderer: PercentCellRenderer },
    { headerName: 'Status',     field: 'status',        width: 150, cellRenderer: StatusCellRenderer },
    { headerName: 'Explanation', field: 'explanation',  flex: 1, minWidth: 280, cellRenderer: ExplanationCellRenderer },
  ], [collection]);

  const onRowClicked = useCallback(({ data }: { data?: RowData }) => {
    if (data) onSelectItem(data.id);
  }, [onSelectItem]);

  return (
    <div className="flex-1 overflow-hidden p-6">
      <AgGridReact
        theme={floqastGridTheme}
        modules={[ClientSideRowModelModule]}
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={{ sortable: true, resizable: true }}
        rowHeight={40}
        headerHeight={36}
        onRowClicked={onRowClicked}
        rowClass="cursor-pointer"
        suppressCellFocus
      />
    </div>
  );
}
