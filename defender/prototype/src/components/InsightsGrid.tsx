import { useMemo } from 'react';
import { AgGridReact } from '@ag-grid-community/react';
import { type ColDef, type ICellRendererParams } from '@ag-grid-community/core';
import { defenderGridTheme } from './TransactionGrid';
import { AgGroupIcon, AgColumnsIcon, AgFiltersIcon } from './ag-grid-icons';
import AutoAwesome from '@floqastinc/flow-ui_icons/material/AutoAwesome';
import type { Insight } from '../types';

const insightsGridTheme = defenderGridTheme.withParams({
  rowHeight: '60px',
});

function NameCellRenderer({ data }: ICellRendererParams<Insight>) {
  if (!data) return null;
  return (
    <div className="flex items-center gap-[8px] h-full">
      <AutoAwesome size={14} color="var(--flo-base-color-purple-600, #7c3aed)" />
      <span className="text-[12px] font-semibold leading-[18px]" style={{ color: 'var(--flo-sem-color-text-default, #1d2433)' }}>
        {data.name}
      </span>
    </div>
  );
}

function InsightCountCellRenderer({ value }: ICellRendererParams) {
  return (
    <span className="text-[12px] font-semibold" style={{ color: 'var(--flo-base-color-purple-600, #7c3aed)' }}>
      {value}
    </span>
  );
}

export default function InsightsGrid({ insights }: { insights: Insight[] }) {
  const columnDefs = useMemo<ColDef[]>(() => [
    {
      headerName: 'Name',
      field: 'name',
      flex: 1.2,
      sortable: true,
      filter: true,
      floatingFilter: true,
      cellRenderer: NameCellRenderer,
    },
    {
      headerName: 'Type',
      field: 'type',
      width: 180,
      sortable: true,
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: 'Description',
      field: 'description',
      flex: 3,
      sortable: false,
      filter: true,
      floatingFilter: true,
      wrapText: true,
      autoHeight: true,
      cellStyle: { whiteSpace: 'normal', lineHeight: '1.4', paddingTop: 10, paddingBottom: 10 },
    },
    {
      headerName: 'Insight Count',
      field: 'insightCount',
      width: 130,
      sortable: true,
      filter: true,
      floatingFilter: true,
      cellRenderer: InsightCountCellRenderer,
    },
  ], []);

  const defaultColDef = useMemo<ColDef>(() => ({
    suppressHeaderMenuButton: false,
    suppressMovable: true,
  }), []);

  return (
    <div className="h-full flex flex-col bg-white" style={{ border: '1px solid var(--flo-sem-color-border-default, #e1e6ef)', borderRadius: 6, overflow: 'hidden' }}>
      {/* Decorative grouping panel */}
      <div className="flex items-center px-4 shrink-0" style={{ height: 40, borderBottom: '1px solid var(--flo-sem-color-border-default, #e1e6ef)', background: 'var(--flo-sem-color-surface-secondary, #f8fafc)' }}>
        <AgGroupIcon />
        <span className="ml-2 text-[11px]" style={{ color: 'var(--flo-sem-color-text-tertiary, #adb2bb)' }}>Drag items here</span>
      </div>

      {/* Grid + tool panel */}
      <div className="flex flex-1 min-h-0">
        <div className="flex-1 min-h-0">
          <AgGridReact
            theme={insightsGridTheme}
            rowData={insights}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            suppressCellFocus
            animateRows
          />
        </div>

        {/* Tool panel sidebar */}
        <div className="flex flex-col shrink-0" style={{ width: 30, borderLeft: '1px solid var(--flo-sem-color-border-default, #e1e6ef)', background: 'var(--flo-sem-color-surface-secondary, #f8fafc)' }}>
          <button className="flex items-center justify-center" style={{ height: 80, border: 'none', background: 'none', cursor: 'pointer', borderBottom: '1px solid var(--flo-sem-color-border-default, #e1e6ef)' }} title="Columns">
            <span style={{ writingMode: 'vertical-lr', fontSize: 10, fontWeight: 600, color: 'var(--flo-sem-color-text-secondary, #6b7280)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <AgColumnsIcon /> Columns
            </span>
          </button>
          <button className="flex items-center justify-center" style={{ height: 80, border: 'none', background: 'none', cursor: 'pointer', borderBottom: '1px solid var(--flo-sem-color-border-default, #e1e6ef)' }} title="Filters">
            <span style={{ writingMode: 'vertical-lr', fontSize: 10, fontWeight: 600, color: 'var(--flo-sem-color-text-secondary, #6b7280)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <AgFiltersIcon /> Filters
            </span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 flex items-center px-4" style={{
        height: 36, borderTop: '1px solid var(--flo-sem-color-border-default, #e1e6ef)',
        fontSize: 11, color: 'var(--flo-sem-color-text-tertiary, #adb2bb)',
        fontFamily: 'Inter, sans-serif',
      }}>
        Showing: {insights.length}
      </div>
    </div>
  );
}
