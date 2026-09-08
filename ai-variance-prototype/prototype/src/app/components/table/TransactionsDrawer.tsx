import { useCallback, useMemo } from 'react';
import { AgGridReact } from '@ag-grid-community/react';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import type { ColDef, ICellRendererParams } from '@ag-grid-community/core';
import { X } from 'lucide-react';
import type { VarianceItem } from '../../../data/variances';
import { formatDollar } from '../../../data/variances';
import { floqastGridTheme } from './floqastGridTheme';

interface Props {
  open: boolean;
  item: VarianceItem;
  onClose: () => void;
}

type RowData = {
  id: string;
  postingDate: string;
  effectiveDate: string;
  jeNumber: string;
  description: string;
  debit: number;
  credit: number;
  amount: number;
  currency: string;
  glAccount: string;
  costCenter: string;
  postedBy: string;
  approvalStatus: string;
  docRef: string;
};

// ─── Cell renderers ───────────────────────────────────────────────────────────

function AmountCellRenderer({ value, data }: ICellRendererParams<RowData>) {
  if (!data || value === 0) return <span style={{ color: '#d1d5db' }}>—</span>;
  const isUp = data.amount >= 0;
  return (
    <span style={{ color: isUp ? '#059669' : '#dc2626', fontVariantNumeric: 'tabular-nums' }}>
      ${Math.abs(value).toLocaleString('en-US')}
    </span>
  );
}

function NetCellRenderer({ data }: ICellRendererParams<RowData>) {
  if (!data) return null;
  const isUp = data.amount >= 0;
  return (
    <span style={{ fontWeight: 600, color: isUp ? '#059669' : '#dc2626', fontVariantNumeric: 'tabular-nums' }}>
      {formatDollar(data.amount)}
    </span>
  );
}

function StatusCellRenderer({ value }: ICellRendererParams<RowData>) {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    approved:     { label: 'Approved',     bg: '#f0fdf4', color: '#16a34a' },
    pending:      { label: 'Pending',      bg: '#fefce8', color: '#ca8a04' },
    'under-review': { label: 'Under review', bg: '#eff6ff', color: '#3b82f6' },
  };
  const s = map[value] ?? map['pending'];
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

function DocRefCellRenderer({ value }: ICellRendererParams<RowData>) {
  if (!value) return <span style={{ color: '#d1d5db' }}>—</span>;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 6px', borderRadius: 4,
      fontSize: 11, fontFamily: 'monospace',
      backgroundColor: '#f3f4f6', color: '#6b7280',
      cursor: 'pointer',
    }}>
      {value}
    </span>
  );
}

// ─── TransactionsDrawer ───────────────────────────────────────────────────────

export function TransactionsDrawer({ open, item, onClose }: Props) {
  const txs = item.supportingTransactions ?? [];

  const rowData = useMemo<RowData[]>(() =>
    txs.map((tx) => ({
      id: tx.id,
      postingDate: new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
      effectiveDate: tx.effectiveDate
        ? new Date(tx.effectiveDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
        : '—',
      jeNumber: tx.jeNumber,
      description: tx.description,
      debit: tx.debit,
      credit: tx.credit,
      amount: tx.amount,
      currency: tx.currency,
      glAccount: tx.glAccount,
      costCenter: tx.costCenter,
      postedBy: tx.postedBy,
      approvalStatus: tx.approvalStatus,
      docRef: tx.docRef ?? '',
    })),
  [txs]);

  const colDefs = useMemo<ColDef<RowData>[]>(() => [
    {
      headerName: 'Posting Date',
      field: 'postingDate',
      width: 120,
      pinned: 'left',
    },
    {
      headerName: 'Effective Date',
      field: 'effectiveDate',
      width: 120,
      cellStyle: { color: '#6b7280' },
    },
    {
      headerName: 'JE #',
      field: 'jeNumber',
      width: 140,
      cellStyle: { fontFamily: 'monospace', fontSize: 11, color: '#6b7280' },
    },
    {
      headerName: 'Description',
      field: 'description',
      flex: 1,
      minWidth: 260,
      cellStyle: { color: '#111827' },
    },
    {
      headerName: 'Debit',
      field: 'debit',
      width: 110,
      type: 'numericColumn',
      cellRenderer: AmountCellRenderer,
    },
    {
      headerName: 'Credit',
      field: 'credit',
      width: 110,
      type: 'numericColumn',
      cellRenderer: AmountCellRenderer,
    },
    {
      headerName: 'Net',
      field: 'amount',
      width: 110,
      type: 'numericColumn',
      cellRenderer: NetCellRenderer,
    },
    {
      headerName: 'Currency',
      field: 'currency',
      width: 90,
      cellStyle: { color: '#6b7280' },
    },
    {
      headerName: 'GL Account',
      field: 'glAccount',
      width: 110,
      cellStyle: { fontFamily: 'monospace', fontSize: 11, color: '#6b7280' },
    },
    {
      headerName: 'Cost Center',
      field: 'costCenter',
      width: 120,
      cellStyle: { color: '#374151' },
    },
    {
      headerName: 'Posted By',
      field: 'postedBy',
      width: 110,
      cellStyle: { color: '#374151' },
    },
    {
      headerName: 'Status',
      field: 'approvalStatus',
      width: 130,
      cellRenderer: StatusCellRenderer,
    },
    {
      headerName: 'Doc Ref',
      field: 'docRef',
      width: 130,
      cellRenderer: DocRefCellRenderer,
    },
  ], []);

  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    resizable: true,
    suppressMovable: false,
  }), []);

  const net = txs.reduce((s, t) => s + t.amount, 0);
  const isUp = net >= 0;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/20 transition-opacity duration-300 ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-[calc(100vw-160px)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-6 py-4">
          <div>
            <h2 className="font-display text-base font-semibold tracking-tight text-neutral-900">
              Transactions — {item.accountName}
            </h2>
            <p className="mt-0.5 font-display text-xs tracking-tight text-neutral-500">
              {txs.length} transaction{txs.length !== 1 ? 's' : ''} · Net{' '}
              <span className={`font-mono font-semibold ${isUp ? 'text-emerald-700' : 'text-red-600'}`}>
                {formatDollar(net)}
              </span>
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
            suppressCellFocus
          />
        </div>
      </div>
    </>
  );
}
