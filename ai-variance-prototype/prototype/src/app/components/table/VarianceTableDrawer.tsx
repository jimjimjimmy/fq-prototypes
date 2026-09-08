import { useCallback, useMemo } from 'react';
import { AgGridReact } from '@ag-grid-community/react';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import type { ColDef, ICellRendererParams } from '@ag-grid-community/core';
import { X } from 'lucide-react';
import type { Collection, VarianceItem } from '../../../data/variances';
import { formatDollar, formatPercent } from '../../../data/variances';
import { floqastGridTheme } from './floqastGridTheme';

interface RowData {
  id: string;
  accountName: string;
  accountNumber: string;
  collection: string;
  periodType: string;
  currentPeriod: string;
  priorPeriod: string;
  currentAmount: number;
  priorAmount: number;
  changeAmount: number;
  changePercent: number;
  status: string;
  explanation: string[];
}

// ─── Cell renderers ───────────────────────────────────────────────────────────

function ChangeCellRenderer({ data }: ICellRendererParams<RowData>) {
  if (!data) return null;
  const isUp = data.changeAmount >= 0;
  return (
    <span style={{ color: isUp ? '#059669' : '#dc2626', fontVariantNumeric: 'tabular-nums' }}>
      {formatDollar(data.changeAmount)}
    </span>
  );
}

function PercentCellRenderer({ data }: ICellRendererParams<RowData>) {
  if (!data) return null;
  const isUp = data.changeAmount >= 0;
  return (
    <span style={{ color: isUp ? '#059669' : '#dc2626', fontVariantNumeric: 'tabular-nums' }}>
      {formatPercent(data.changePercent)}
    </span>
  );
}

function StatusCellRenderer({ data }: ICellRendererParams<RowData>) {
  if (!data) return null;
  const map: Record<string, { label: string; bg: string; color: string }> = {
    'not-started':      { label: 'Not started',       bg: '#f3f4f6', color: '#6b7280' },
    'in-progress':      { label: 'In progress',        bg: '#eff6ff', color: '#3b82f6' },
    'ready-for-review': { label: 'Ready for review',   bg: '#fefce8', color: '#ca8a04' },
    'signed-off':       { label: 'Signed off',         bg: '#f0fdf4', color: '#16a34a' },
  };
  const s = map[data.status] ?? map['not-started'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 8px', borderRadius: 9999,
      fontSize: 11, fontWeight: 500,
      backgroundColor: s.bg, color: s.color,
    }}>
      {s.label}
    </span>
  );
}

function ExplanationCellRenderer({ data }: ICellRendererParams<RowData>) {
  if (!data || !data.explanation.length) {
    return <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>No explanation drafted</span>;
  }
  const preview = data.explanation[0];
  const more = data.explanation.length - 1;
  return (
    <span style={{ color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
      {preview}
      {more > 0 && <span style={{ color: '#9ca3af', marginLeft: 6 }}>+{more} more</span>}
    </span>
  );
}

// ─── VarianceTableDrawer ──────────────────────────────────────────────────────

interface Props {
  open: boolean;
  collections: Collection[];
  filteredCollectionId?: string | null;
  onClose: () => void;
  onSelectItem: (id: string) => void;
}

export function VarianceTableDrawer({ open, collections, filteredCollectionId, onClose, onSelectItem }: Props) {
  const visibleCollections = filteredCollectionId
    ? collections.filter((c) => c.id === filteredCollectionId)
    : collections;

  const rowData = useMemo<RowData[]>(() =>
    visibleCollections.flatMap((col) =>
      col.items.map((item: VarianceItem) => ({
        id: item.id,
        accountName: item.accountName,
        accountNumber: item.accountNumber,
        collection: col.name,
        periodType: col.periodType,
        currentPeriod: col.currentPeriod,
        priorPeriod: col.priorPeriod,
        currentAmount: item.currentAmount,
        priorAmount: item.priorAmount,
        changeAmount: item.changeAmount,
        changePercent: item.changePercent,
        status: item.status,
        explanation: item.draftExplanation
          ? [item.draftExplanation]
          : item.aiExplanation,
      })),
    ),
  [visibleCollections]);

  const colDefs = useMemo<ColDef<RowData>[]>(() => [
    {
      field: 'accountName',
      headerName: 'Account',
      width: 160,
      pinned: 'left',
      cellStyle: { fontWeight: 500 },
    },
    {
      field: 'accountNumber',
      headerName: 'Acct #',
      width: 80,
      cellStyle: { color: '#9ca3af', fontVariantNumeric: 'tabular-nums' },
    },
    {
      field: 'collection',
      headerName: 'Rule',
      width: 180,
    },
    {
      field: 'priorPeriod',
      headerName: 'Prior Period',
      width: 110,
      cellStyle: { color: '#6b7280' },
    },
    {
      headerName: 'Prior Amt',
      field: 'priorAmount',
      width: 120,
      type: 'numericColumn',
      valueFormatter: ({ value }) => `$${Math.abs(value).toLocaleString('en-US')}`,
      cellStyle: { fontVariantNumeric: 'tabular-nums', color: '#374151' },
    },
    {
      field: 'currentPeriod',
      headerName: 'Current Period',
      width: 120,
      cellStyle: { color: '#6b7280' },
    },
    {
      headerName: 'Current Amt',
      field: 'currentAmount',
      width: 120,
      type: 'numericColumn',
      valueFormatter: ({ value }) => `$${Math.abs(value).toLocaleString('en-US')}`,
      cellStyle: { fontVariantNumeric: 'tabular-nums', color: '#374151' },
    },
    {
      headerName: 'Change $',
      field: 'changeAmount',
      width: 110,
      type: 'numericColumn',
      cellRenderer: ChangeCellRenderer,
    },
    {
      headerName: 'Change %',
      field: 'changePercent',
      width: 100,
      type: 'numericColumn',
      cellRenderer: PercentCellRenderer,
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 150,
      cellRenderer: StatusCellRenderer,
    },
    {
      headerName: 'Explanation',
      field: 'explanation',
      flex: 1,
      minWidth: 320,
      cellRenderer: ExplanationCellRenderer,
    },
  ], []);

  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    resizable: true,
  }), []);

  const onRowClicked = useCallback(({ data }: { data?: RowData }) => {
    if (data) {
      onSelectItem(data.id);
      onClose();
    }
  }, [onSelectItem, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/20 transition-opacity duration-300 ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-[calc(100vw-48px)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-6 py-4">
          <div>
            <h2 className="font-display text-base font-semibold tracking-tight text-neutral-900">
              {filteredCollectionId ? visibleCollections[0]?.name : 'Table View'}
            </h2>
            <p className="mt-0.5 font-display text-xs tracking-tight text-neutral-500">
              {rowData.length} variance{rowData.length !== 1 ? 's' : ''}{!filteredCollectionId && ` across ${collections.length} rule collections`} — click a row to open in Focus Mode
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-hidden p-4">
          <AgGridReact
            theme={floqastGridTheme}
            modules={[ClientSideRowModelModule]}
            rowData={rowData}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
            rowHeight={40}
            headerHeight={36}
            onRowClicked={onRowClicked}
            rowClass="cursor-pointer"
            suppressMovableColumns={false}
            suppressCellFocus
          />
        </div>
      </div>
    </>
  );
}
