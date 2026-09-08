import { useMemo } from 'react';
import { AgGridReact } from '@ag-grid-community/react';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import type { ColDef, ICellRendererParams } from '@ag-grid-community/core';
import { floqastGridTheme } from '../table/floqastGridTheme';
import type { Collection, TeamMember } from '../../../data/variances';

interface SummaryRow {
  collectionId: string;
  collectionName: string;
  periodType: string;
  currentPeriod: string;
  priorPeriod: string;
  total: number;
  notStarted: number;
  inProgress: number;
  readyForReview: number;
  signedOff: number;
  preparers: TeamMember[];
  reviewers: TeamMember[];
  lastActivity: string | null;
}

// ─── Cell renderers ───────────────────────────────────────────────────────────

function CollectionCellRenderer({ data }: ICellRendererParams<SummaryRow>) {
  if (!data) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: 1 }}>
      <span style={{ fontWeight: 600, color: '#111827' }}>{data.collectionName}</span>
      <span style={{ fontSize: 11, color: '#9ca3af' }}>{data.periodType} · {data.priorPeriod} vs {data.currentPeriod}</span>
    </div>
  );
}

function ProgressCellRenderer({ data }: ICellRendererParams<SummaryRow>) {
  if (!data) return null;
  const pct = data.total > 0 ? (data.signedOff / data.total) * 100 : 0;
  const color = pct === 100 ? '#16a34a' : pct > 0 ? '#3b82f6' : '#9ca3af';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: '100%' }}>
      <div style={{ flex: 1, height: 4, borderRadius: 9999, backgroundColor: '#e5e7eb', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, backgroundColor: color, borderRadius: 9999, transition: 'width 0.3s ease' }} />
      </div>
      <span style={{ fontSize: 11, color: '#6b7280', whiteSpace: 'nowrap', minWidth: 36 }}>
        {data.signedOff}/{data.total}
      </span>
    </div>
  );
}

function StatusBreakdownCellRenderer({ data }: ICellRendererParams<SummaryRow>) {
  if (!data) return null;
  const items = [
    { count: data.notStarted,     label: 'Not started',   color: '#9ca3af', bg: '#f3f4f6' },
    { count: data.inProgress,     label: 'In progress',   color: '#3b82f6', bg: '#eff6ff' },
    { count: data.readyForReview, label: 'For review',    color: '#ca8a04', bg: '#fefce8' },
    { count: data.signedOff,      label: 'Signed off',    color: '#16a34a', bg: '#f0fdf4' },
  ].filter((i) => i.count > 0);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, height: '100%', flexWrap: 'wrap' }}>
      {items.map((i) => (
        <span key={i.label} style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '2px 7px', borderRadius: 9999, fontSize: 11,
          backgroundColor: i.bg, color: i.color, fontWeight: 500,
        }}>
          <span style={{ fontWeight: 700 }}>{i.count}</span> {i.label}
        </span>
      ))}
    </div>
  );
}

function AvatarStackCellRenderer({ value }: ICellRendererParams<SummaryRow, TeamMember[]>) {
  if (!value?.length) return <span style={{ color: '#d1d5db' }}>—</span>;
  const shown = value.slice(0, 3);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: '100%' }}>
      <div style={{ display: 'flex' }}>
        {shown.map((m, i) => (
          m.avatar ? (
            <img
              key={m.id}
              src={m.avatar}
              alt={m.name}
              title={m.name}
              style={{
                width: 24, height: 24, borderRadius: '50%',
                border: '2px solid white',
                marginLeft: i > 0 ? -6 : 0,
                objectFit: 'cover',
              }}
            />
          ) : (
            <div
              key={m.id}
              title={m.name}
              style={{
                width: 24, height: 24, borderRadius: '50%',
                border: '2px solid white',
                marginLeft: i > 0 ? -6 : 0,
                backgroundColor: m.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 700, color: 'white',
              }}
            >
              {m.initials}
            </div>
          )
        ))}
      </div>
      {value.length === 1 && (
        <span style={{ fontSize: 12, color: '#374151' }}>{value[0].name}</span>
      )}
      {value.length > 3 && (
        <span style={{ fontSize: 11, color: '#9ca3af' }}>+{value.length - 3}</span>
      )}
    </div>
  );
}

function OverallStatusCellRenderer({ data }: ICellRendererParams<SummaryRow>) {
  if (!data) return null;
  let label: string;
  let bg: string;
  let color: string;

  if (data.signedOff === data.total) {
    label = 'Complete'; bg = '#f0fdf4'; color = '#16a34a';
  } else if (data.readyForReview > 0) {
    label = 'In Review'; bg = '#fefce8'; color = '#ca8a04';
  } else if (data.inProgress > 0) {
    label = 'In Progress'; bg = '#eff6ff'; color = '#3b82f6';
  } else {
    label = 'Not Started'; bg = '#f3f4f6'; color = '#6b7280';
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <span style={{ padding: '3px 10px', borderRadius: 9999, fontSize: 11, fontWeight: 500, backgroundColor: bg, color }}>
        {label}
      </span>
    </div>
  );
}

// ─── VarianceSummaryView ──────────────────────────────────────────────────────

interface Props {
  collections: Collection[];
  onDrillInto: (collectionId: string) => void;
}

export function VarianceSummaryView({ collections, onDrillInto }: Props) {
  const rowData = useMemo<SummaryRow[]>(() =>
    collections.map((col) => {
      const preparers = [...new Map(col.items.map((i) => [i.preparer.id, i.preparer])).values()];
      const reviewers = [...new Map(col.items.map((i) => [i.reviewer.id, i.reviewer])).values()];
      const lastActivity = col.items
        .map((i) => i.signedOffAt)
        .filter(Boolean)
        .sort()
        .at(-1) ?? null;

      return {
        collectionId: col.id,
        collectionName: col.name,
        periodType: col.periodType,
        currentPeriod: col.currentPeriod,
        priorPeriod: col.priorPeriod,
        total: col.items.length,
        notStarted:      col.items.filter((i) => i.status === 'not-started').length,
        inProgress:      col.items.filter((i) => i.status === 'in-progress').length,
        readyForReview:  col.items.filter((i) => i.status === 'ready-for-review').length,
        signedOff:       col.items.filter((i) => i.status === 'signed-off').length,
        preparers,
        reviewers,
        lastActivity,
      };
    }),
  [collections]);

  const colDefs = useMemo<ColDef<SummaryRow>[]>(() => [
    {
      headerName: 'Rule Collection',
      field: 'collectionName',
      pinned: 'left',
      width: 260,
      cellRenderer: CollectionCellRenderer,
      rowDrag: false,
    },
    {
      headerName: 'Variances',
      field: 'total',
      width: 100,
      type: 'numericColumn',
      cellStyle: { fontWeight: 600, color: '#374151' },
    },
    {
      headerName: 'Sign-off Progress',
      field: 'signedOff',
      width: 180,
      cellRenderer: ProgressCellRenderer,
    },
    {
      headerName: 'Status Breakdown',
      field: 'notStarted',
      width: 320,
      cellRenderer: StatusBreakdownCellRenderer,
    },
    {
      headerName: 'Overall Status',
      field: 'inProgress',
      width: 140,
      cellRenderer: OverallStatusCellRenderer,
    },
    {
      headerName: 'Preparers',
      field: 'preparers',
      width: 160,
      cellRenderer: AvatarStackCellRenderer,
      sortable: false,
    },
    {
      headerName: 'Reviewers',
      field: 'reviewers',
      width: 160,
      cellRenderer: AvatarStackCellRenderer,
      sortable: false,
    },
    {
      headerName: 'Last Activity',
      field: 'lastActivity',
      width: 130,
      valueFormatter: ({ value }) => value ?? '—',
      cellStyle: { color: '#6b7280' },
    },
  ], []);

  const allItems = collections.flatMap((c) => c.items);
  const total        = allItems.length;
  const signedOff    = allItems.filter((i) => i.status === 'signed-off').length;
  const forReview    = allItems.filter((i) => i.status === 'ready-for-review').length;
  const inProgress   = allItems.filter((i) => i.status === 'in-progress').length;
  const notStarted   = allItems.filter((i) => i.status === 'not-started').length;
  const pct          = total > 0 ? (signedOff / total) * 100 : 0;

  const stats = [
    { label: 'Total',          value: total,       color: 'text-neutral-900' },
    { label: 'Signed off',     value: signedOff,   color: signedOff > 0 ? 'text-emerald-700' : 'text-neutral-400' },
    { label: 'Ready for review', value: forReview, color: forReview > 0 ? 'text-neutral-700' : 'text-neutral-400' },
    { label: 'In progress',    value: inProgress,  color: 'text-neutral-500' },
    { label: 'Not started',    value: notStarted,  color: 'text-neutral-400' },
  ];

  return (
    <div className="flex flex-1 flex-col min-h-0 bg-white">
      {/* Page header */}
      <div className="shrink-0 border-b border-neutral-200 px-8 pt-6 pb-0">
        <div className="flex items-start justify-between gap-8 pb-5">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-neutral-900">Variance Summary</h1>
            <p className="mt-1 font-display text-xs tracking-tight text-neutral-400">
              {collections.length} rule collections · click a row to drill into variances
            </p>
          </div>

          {/* Stats strip */}
          <div className="flex items-center gap-6 pt-0.5">
            {stats.map((s, i) => (
              <div key={s.label} className="flex items-center gap-6">
                {i > 0 && <div className="h-7 w-px bg-neutral-100" />}
                <div className="text-right">
                  <p className={`font-mono text-xl tabular-nums leading-none ${s.color}`}>{s.value}</p>
                  <p className="mt-1 font-display text-[10px] tracking-tight text-neutral-400">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar — full width, flush to border */}
        <div className="h-[3px] w-full bg-neutral-100">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-hidden p-6">
        <AgGridReact
          theme={floqastGridTheme}
          modules={[ClientSideRowModelModule]}
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={{ sortable: true, resizable: true }}
          rowHeight={52}
          headerHeight={36}
          onRowClicked={({ data }) => data && onDrillInto(data.collectionId)}
          rowClass="cursor-pointer"
          suppressCellFocus
          suppressMovableColumns={false}
        />
      </div>
    </div>
  );
}
