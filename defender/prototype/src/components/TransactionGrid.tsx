import { useEffect, useRef } from 'react';
import { AgGridReact } from '@ag-grid-community/react';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry, type ColDef, type RowClickedEvent, type ICellRendererParams, type ValueFormatterParams, type ValueGetterParams } from '@ag-grid-community/core';
import { themeQuartz } from '@ag-grid-community/theming';
import OpenInNew from '@floqastinc/flow-ui_icons/material/OpenInNew';
import Description from '@floqastinc/flow-ui_icons/material/Description';
import ExitToApp from '@floqastinc/flow-ui_icons/material/ExitToApp';
import TableStatusBadge from '@floqastinc/flow-ui_core/TableStatusBadge';
import type { Anomaly } from '../types';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

// Status → TableStatusBadge color (Figma: Open=warning/orange, Investigating=info/blue, Resolved=success/green)
const STATUS_BADGE_COLOR: Record<string, 'warning' | 'info' | 'success' | 'danger'> = {
  Open: 'warning',
  Investigating: 'info',
  Resolved: 'success',
  Deleted: 'danger',
  Dismissed: 'info',
};

// FloQast AG Grid theme — literal values from AG Grid Design System Figma (k66Ey9ccZnqVnEnM7GG4KF)
// and FloQast baseline theme in ag-grid-figma-guide.md
export const defenderGridTheme = themeQuartz.withParams({
  accentColor: '#1FAC76',
  backgroundColor: '#FFFFFF',
  borderColor: '#E1E6EF',
  browserColorScheme: 'light',
  fontFamily: 'Inter, sans-serif',
  fontSize: '12px',
  foregroundColor: '#1D2433',
  headerBackgroundColor: '#F8FAFC',
  headerFontSize: '12px',
  headerFontWeight: 600,
  headerTextColor: '#1B1F27',
  oddRowBackgroundColor: 'rgba(33, 150, 243, 0.08)',
  rowBorder: false,
  rowHoverColor: 'rgba(33, 150, 243, 0.2)',
  selectedRowBackgroundColor: 'rgba(33, 150, 243, 0.2)',
  spacing: '8px',
  wrapperBorderRadius: '6px',
});

export default function TransactionGrid({ rowData, onRowClicked, onTransactionIdClick, onOpenDetail, selectedId, defaultColDef }: {
  rowData: Anomaly[];
  onRowClicked: (data: Anomaly) => void;
  onTransactionIdClick: () => void;
  onOpenDetail: (data: Anomaly) => void;
  selectedId?: string | null;
  defaultColDef?: any;
}) {
  const gridRef = useRef<AgGridReact>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const colDefs = useRef<ColDef[]>([
    {
      field: 'date',
      headerName: 'Transaction Date',
      valueFormatter: (params: ValueFormatterParams) => {
        if (!params.value) return '';
        const [year, month, day] = params.value.split('-');
        return `${parseInt(month)}/${parseInt(day)}/${year}`;
      },
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      minWidth: 140,
    },
    {
      field: 'transactionId',
      headerName: 'Transaction ID',
      cellRenderer: (params: ICellRendererParams) => {
        if (!params.value) return '';
        const isSelected = params.context?.selectedId === params.data?.id;
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              params.context?.onTransactionIdClick?.();
            }}
            style={{
              color: 'var(--flo-sem-color-text-default, #1D2433)',
              textDecoration: 'underline',
              fontWeight: 600,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 12,
            }}
          >
            {params.value}
            {isSelected && params.data?.status !== 'Deleted' && (
              <span title="Open in ERP"><OpenInNew size={12} /></span>
            )}
            {params.data?.status === 'Deleted' && (
              <span title="Deleted from ERP — link no longer available" style={{ opacity: 0.4 }}><OpenInNew size={12} /></span>
            )}
          </button>
        );
      },
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      minWidth: 160,
    },
    {
      field: 'account',
      headerName: 'Account',
      valueFormatter: (params: ValueFormatterParams) => params.value ? params.value.replace(/-/g, ' ') : '',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      type: 'rightAligned',
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value == null) return '';
        return '$' + params.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      },
      filter: 'agNumberColumnFilter',
      floatingFilter: true,
      minWidth: 140,
    },
    {
      field: 'anomalyCount',
      headerName: 'Anomalies',
      cellStyle: { textAlign: 'center' },
      valueFormatter: (params: ValueFormatterParams) => params.value > 0 ? String(params.value) : '',
      filter: 'agNumberColumnFilter',
      floatingFilter: true,
      minWidth: 100,
    },
    {
      field: 'status',
      headerName: 'Status',
      cellRenderer: (params: ICellRendererParams) => {
        if (!params.data || params.data.anomalyCount === 0) return '';
        const status = params.value as string;
        const color = STATUS_BADGE_COLOR[status] ?? 'default';
        if (status === 'Deleted') {
          return (
            <span title="Deleted from ERP — data preserved for audit trail">
              <TableStatusBadge color={color} hasIcon={false}>{status}</TableStatusBadge>
            </span>
          );
        }
        return <TableStatusBadge color={color} hasIcon={false}>{status}</TableStatusBadge>;
      },
      filter: 'agTextColumnFilter',
      floatingFilter: true,
      minWidth: 130,
    },
    {
      colId: 'actions-col',
      headerName: '',
      valueGetter: (params: ValueGetterParams) => params.data?.comments?.length ?? 0,
      cellRenderer: (params: ICellRendererParams) => {
        const count = params.data?.comments?.length ?? 0;
        if (!count) return null;
        const isSelected = params.context?.selectedId === params.data?.id;
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: '100%' }}>
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Description size={18} color="var(--flo-sem-color-icon-secondary)" />
              <div style={{
                position: 'absolute',
                top: 2,
                right: -4,
                background: 'var(--flo-sem-color-danger)',
                color: 'white',
                borderRadius: '50%',
                width: 14,
                height: 14,
                fontSize: 9,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
              }}>
                {count}
              </div>
            </div>
            {isSelected && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  params.context?.onOpenDetail?.(params.data);
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
              >
                <ExitToApp size={16} color="var(--flo-sem-color-icon-secondary)" />
              </button>
            )}
          </div>
        );
      },
      sortable: false,
      resizable: false,
      width: 70,
      suppressHeaderMenuButton: true,
      floatingFilter: false,
    },
  ]).current;

  // Refresh selection-dependent cells when selectedId changes
  useEffect(() => {
    gridRef.current?.api?.refreshCells({ columns: ['transactionId', 'actions-col'], force: true });
  }, [selectedId]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      gridRef.current?.api?.refreshCells();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <AgGridReact
        ref={gridRef}
        theme={defenderGridTheme}
        rowData={rowData}
        columnDefs={colDefs}
        rowHeight={32}
        headerHeight={50}
        context={{ onTransactionIdClick, selectedId, onOpenDetail }}
        onRowClicked={(e: RowClickedEvent) => { if (e.data) onRowClicked(e.data); }}
        getRowStyle={(params) => params.data?.id === selectedId ? { backgroundColor: 'rgba(31, 172, 118, 0.12)', borderLeft: '3px solid #1fac76' } : undefined}
        defaultColDef={defaultColDef || { sortable: true, resizable: true }}
      />
    </div>
  );
}
