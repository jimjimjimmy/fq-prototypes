/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { AgGridReact } from '@ag-grid-community/react'
import { ModuleRegistry } from '@ag-grid-community/core'
import type { ColDef } from '@ag-grid-community/core'
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import { floqastGridTheme } from '../grid/floqastGridTheme'
import { dimensionData, formatDimensionDate } from '../../data/dimensions'
import type { DimensionModel, DimensionStatus } from '../../data/dimensions'

ModuleRegistry.registerModules([ClientSideRowModelModule])

// ── Cell renderers ────────────────────────────────────────────────────────────

function NameCell({ data }: { data: any }) {
  const d = data as DimensionModel
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <span style={{ fontSize: '13px', fontWeight: 600, color: '#1d2433' }}>
        {d.name}
      </span>
    </div>
  )
}

function UniqueValuesCell({ data }: { data: any }) {
  const d = data as DimensionModel
  if (d.records === null) return <span style={{ fontSize: '12px', color: '#adb2bb' }}>—</span>
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <span style={{ fontSize: '13px', color: '#1d2433', fontVariantNumeric: 'tabular-nums' }}>
        {d.records.toLocaleString()}
      </span>
    </div>
  )
}

function LinkedModelsCell({ data }: { data: any }) {
  const d = data as DimensionModel
  const models = d.modelsUsing
  if (models.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <span style={{ fontSize: '13px', color: '#adb2bb' }}>None</span>
      </div>
    )
  }
  const overflow = models.length - 1
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '3px', height: '100%' }}>
      <a
        href="#"
        onClick={e => e.preventDefault()}
        style={{ fontSize: '12px', color: '#2563eb', textDecoration: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
        onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
      >
        {models[0].name}
      </a>
      {overflow > 0 && (
        <span style={{ fontSize: '11px', color: '#6b7280' }}>+{overflow} more</span>
      )}
    </div>
  )
}

function LastUpdatedCell({ data }: { data: any }) {
  const d = data as DimensionModel
  if (!d.lastUpdated) return <span style={{ fontSize: '12px', color: '#adb2bb' }}>—</span>
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <span style={{ fontSize: '13px', color: '#6b7280' }}>{formatDimensionDate(d.lastUpdated)}</span>
    </div>
  )
}

const STATUS_CFG: Record<DimensionStatus, { dot: string; label: string; color: string }> = {
  active:          { dot: '#16a34a', label: 'Active',             color: '#15803d' },
  draft:           { dot: '#9ca3af', label: 'Draft',              color: '#6b7280' },
  'data-quality':  { dot: '#d97706', label: 'Data quality issue', color: '#92400e' },
  orphaned:        { dot: '#9ca3af', label: 'Orphaned',           color: '#6b7280' },
}

function StatusCell({ data }: { data: any }) {
  const d = data as DimensionModel
  const cfg = STATUS_CFG[d.status]
  const isWarning = d.status === 'data-quality' || d.status === 'orphaned'
  const tooltipText = d.dataQualityIssue ?? cfg.label

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '100%' }}>
      {isWarning ? (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0 }}>
          <path d="M6.5 1.5L11.5 11H1.5L6.5 1.5Z" stroke={cfg.dot} strokeWidth="1.4" strokeLinejoin="round"
            fill={d.status === 'data-quality' ? '#FEF3C7' : '#F3F4F6'} />
          <path d="M6.5 5.5V7.5" stroke={cfg.dot} strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="6.5" cy="9.5" r="0.6" fill={cfg.dot} />
        </svg>
      ) : (
        <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: cfg.dot, flexShrink: 0 }} />
      )}
      <span style={{ fontSize: '12px', color: cfg.color, fontWeight: isWarning ? 500 : 400 }}>
        {cfg.label}
      </span>
    </div>
  )
}

// ── Column defs ───────────────────────────────────────────────────────────────

const colDefs: ColDef<DimensionModel>[] = [
  { headerName: 'Name',          field: 'name',        flex: 2, minWidth: 180, cellRenderer: NameCell,
    tooltipValueGetter: p => p.data?.description },
  { headerName: 'Linked Models', field: 'modelsUsing', flex: 2, minWidth: 200, cellRenderer: LinkedModelsCell,
    tooltipValueGetter: p => p.data && p.data.modelsUsing.length > 1 ? p.data.modelsUsing.map(m => m.name).join(', ') : undefined },
  { headerName: 'Unique Values', field: 'records',     flex: 1, minWidth: 120, cellRenderer: UniqueValuesCell },
  { headerName: 'Last Updated',  field: 'lastUpdated', flex: 1, minWidth: 130, cellRenderer: LastUpdatedCell },
  { headerName: 'Status',        field: 'status',      flex: 2, minWidth: 160, cellRenderer: StatusCell,
    tooltipValueGetter: p => p.data?.dataQualityIssue },
]

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ onGoToCatalog }: { onGoToCatalog: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '420px', gap: '20px', padding: '48px 24px' }}>
      <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      <div style={{ textAlign: 'center', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1d2433', margin: 0 }}>No dimensions yet</h3>
        <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
          Dimensions standardize how your data is organized and consumed across all FloQast products—so categories like Department or Region mean the same thing everywhere.
        </p>
        <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
          To get started,{' '}
          <button
            onClick={onGoToCatalog}
            style={{ background: 'none', border: 'none', padding: 0, fontSize: '13px', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' }}
          >
            create or edit a model in the Catalog
          </button>
          .
        </p>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function DimensionsTable() {
  const navigate = useNavigate()
  const [showEmpty, setShowEmpty] = useState(false)
  const getRowHeight = useCallback(() => 48, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <span style={{ fontSize: '13px', color: '#6b7280' }}>
          {showEmpty ? 'No dimensions' : `${dimensionData.length} dimensions`}
        </span>
        <button
          onClick={() => setShowEmpty(v => !v)}
          style={{ fontSize: '11px', color: '#adb2bb', background: 'none', border: '1px solid #e1e6ef', borderRadius: '4px', padding: '2px 8px', cursor: 'pointer' }}
        >
          {showEmpty ? 'Show data' : 'Preview empty state'}
        </button>
      </div>

      {showEmpty ? (
        <EmptyState onGoToCatalog={() => navigate('/data-studio/catalog')} />
      ) : (
        <div style={{ flex: 1, minHeight: 0 }}>
          <AgGridReact<DimensionModel>
            theme={floqastGridTheme}
            rowData={dimensionData}
            columnDefs={colDefs}
            getRowHeight={getRowHeight}
            rowSelection="single"
            suppressCellFocus
            suppressMovableColumns
            enableBrowserTooltips
            defaultColDef={{ resizable: true, sortable: true }}
            rowStyle={{ cursor: 'pointer' }}
            onRowClicked={e => { if (e.data) navigate(`/data-studio/dimension/${e.data.id}/values`) }}
          />
        </div>
      )}
    </div>
  )
}
