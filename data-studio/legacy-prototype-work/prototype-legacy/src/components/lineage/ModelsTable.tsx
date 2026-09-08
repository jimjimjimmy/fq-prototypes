import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCdc } from '../../context/CdcContext'
import { AgGridReact } from '@ag-grid-community/react'
import { ModuleRegistry } from '@ag-grid-community/core'
import type { ColDef, IsFullWidthRowParams } from '@ag-grid-community/core'
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import { floqastGridTheme } from '../grid/floqastGridTheme'
import { modelData } from '../../data/models'
import type { Model, RunStatus } from '../../data/models'

ModuleRegistry.registerModules([ClientSideRowModelModule])

// ── Row types ────────────────────────────────────────────────────────────────

interface GroupRow {
  _rowType: 'group'
  id: string
  domain: string
  count: number
  isExpanded: boolean
}

type ModelRow = Model & { _rowType: 'model' }
type GridRow = GroupRow | ModelRow

// ── Group header renderer ─────────────────────────────────────────────────────

function GroupRowRenderer({
  data,
  toggleGroup,
}: {
  data: GroupRow
  toggleGroup: (domain: string) => void
}) {
  return (
    <div
      onClick={() => toggleGroup(data.domain)}
      style={{
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '0 12px',
        cursor: 'pointer',
        background: 'white',
        borderBottom: '1px solid #e1e6ef',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = '#f9fafb')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
    >
      <svg
        style={{
          width: '16px',
          height: '16px',
          color: '#adb2bb',
          flexShrink: 0,
          transform: data.isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 0.15s',
        }}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#1d2433',
            lineHeight: '18px',
          }}
        >
          {data.domain}
        </span>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: '#adb2bb',
            lineHeight: '18px',
          }}
        >
          {data.count} {data.count === 1 ? 'Model' : 'Models'}
        </span>
      </div>
    </div>
  )
}

// ── Run status cell ───────────────────────────────────────────────────────────

function RunStatusCell({ status }: { status: RunStatus }) {
  if (!status) return null
  if (status === 'success') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <circle cx="7.5" cy="7.5" r="7" stroke="#16a34a" strokeWidth="1.2" />
          <path d="M4.5 7.5l2 2 4-4" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize: '12px', color: '#16a34a' }}>Success</span>
      </div>
    )
  }
  if (status === 'failed') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <circle cx="7.5" cy="7.5" r="7" stroke="#dc2626" strokeWidth="1.2" />
          <path d="M7.5 4.5v3.5" stroke="#dc2626" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="7.5" cy="10.5" r="0.7" fill="#dc2626" />
        </svg>
        <span style={{ fontSize: '12px', color: '#dc2626' }}>Failed</span>
      </div>
    )
  }
  if (status === 'pending') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <circle cx="7.5" cy="7.5" r="7" stroke="#6b7280" strokeWidth="1.2" />
          <path d="M7.5 4.5V7.5l2 1.5" stroke="#6b7280" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize: '12px', color: '#6b7280' }}>Pending</span>
      </div>
    )
  }
  return null
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ModelsTable() {
  const navigate = useNavigate()
  const { draftModels, connectionName, dismiss } = useCdc()

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const s = new Set<string>()
    modelData.forEach((g) => {
      if (g.defaultExpanded) s.add(g.domain)
    })
    return s
  })

  const toggleGroup = useCallback((domain: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(domain)) next.delete(domain)
      else next.add(domain)
      return next
    })
  }, [])

  const rowData = useMemo<GridRow[]>(() => {
    const rows: GridRow[] = []
    for (const group of modelData) {
      const isExpanded = expandedGroups.has(group.domain)
      rows.push({
        _rowType: 'group',
        id: `group-${group.domain}`,
        domain: group.domain,
        count: group.models.length,
        isExpanded,
      })
      if (isExpanded) {
        for (const model of group.models) {
          rows.push({ ...model, _rowType: 'model' })
        }
      }
    }
    return rows
  }, [expandedGroups])

  const isFullWidthRow = useCallback((params: IsFullWidthRowParams) => {
    return (params.rowNode.data as GridRow)?._rowType === 'group'
  }, [])

  // Pass toggleGroup via fullWidthCellRendererParams so the renderer
  // doesn't close over stale state
  const fullWidthCellRendererParams = useMemo(
    () => ({ toggleGroup }),
    [toggleGroup],
  )

  const fullWidthCellRenderer = useCallback(
    (params: { data: GroupRow; toggleGroup: (domain: string) => void }) => (
      <GroupRowRenderer data={params.data} toggleGroup={params.toggleGroup} />
    ),
    [],
  )

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: 'Model Name',
        field: 'name',
        flex: 2,
        minWidth: 180,
        sortable: true,
        cellStyle: { display: 'flex', alignItems: 'center' },
        cellRenderer: (params: { data: GridRow }) => {
          const row = params.data as ModelRow
          if (!row || row._rowType !== 'model') return null
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '28px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#1d2433', lineHeight: '18px' }}>
                {row.name}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#adb2bb', lineHeight: '18px' }}>
                {row.version}
              </span>
            </div>
          )
        },
      },
      {
        headerName: 'Status',
        field: 'status',
        flex: 1,
        minWidth: 100,
        sortable: true,
        cellStyle: { display: 'flex', alignItems: 'center' },
        cellRenderer: (params: { data: GridRow }) => {
          const row = params.data as ModelRow
          if (!row || row._rowType !== 'model') return null
          const isActive = row.status === 'active'
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: isActive ? '#16a34a' : '#6b7280', flexShrink: 0 }} />
              <span style={{ fontSize: '12px', color: isActive ? '#16a34a' : '#6b7280' }}>
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          )
        },
      },
      {
        headerName: 'Records',
        field: 'records',
        flex: 1,
        minWidth: 100,
        sortable: true,
        cellStyle: { display: 'flex', alignItems: 'center' },
        valueFormatter: (params) =>
          typeof params.value === 'number' ? params.value.toLocaleString() : '',
      },
      {
        headerName: 'Linked Files',
        field: 'linkedFiles',
        flex: 1,
        minWidth: 110,
        sortable: true,
        cellStyle: { display: 'flex', alignItems: 'center' },
      },
      {
        headerName: 'Last Run Date',
        field: 'lastRunDate',
        flex: 1,
        minWidth: 120,
        sortable: true,
        cellStyle: { display: 'flex', alignItems: 'center' },
        cellRenderer: (params: { data: GridRow }) => {
          const row = params.data as ModelRow
          if (!row || row._rowType !== 'model') return null
          if (!row.lastRunDate) return null
          return (
            <span style={{ fontSize: '12px', color: '#6b7280' }}>{row.lastRunDate}</span>
          )
        },
      },
      {
        headerName: 'Last Run Status',
        field: 'lastRunStatus',
        flex: 1,
        minWidth: 130,
        sortable: true,
        cellStyle: { display: 'flex', alignItems: 'center' },
        cellRenderer: (params: { data: GridRow }) => {
          const row = params.data as ModelRow
          if (!row || row._rowType !== 'model') return null
          return <RunStatusCell status={row.lastRunStatus} />
        },
      },
    ],
    [],
  )

  const onRowClicked = useCallback(
    (params: { data: GridRow }) => {
      const row = params.data
      if (!row || row._rowType === 'group') return
      navigate(`/data-studio/model/${row.id}/overview`)
    },
    [navigate],
  )

  return (
    <div style={{ width: '100%' }}>
      {draftModels.length > 0 && (
        <DraftModelsBanner
          connectionName={connectionName}
          models={draftModels}
          onDismiss={dismiss}
        />
      )}
      <AgGridReact
        theme={floqastGridTheme}
        columnDefs={columnDefs}
        rowData={rowData}
        rowHeight={80}
        getRowHeight={(params) => (params.data as GridRow)?._rowType === 'group' ? 64 : 80}
        domLayout="autoHeight"
        isFullWidthRow={isFullWidthRow}
        fullWidthCellRenderer={fullWidthCellRenderer}
        fullWidthCellRendererParams={fullWidthCellRendererParams}
        onRowClicked={onRowClicked}
        suppressCellFocus={true}
        getRowId={(params) => (params.data as GridRow).id}
      />
    </div>
  )
}

/* ── Draft Models Banner ── */

import type { CdcDraftModel } from '../../context/CdcContext'

function DraftModelsBanner({ connectionName, models, onDismiss }: {
  connectionName: string
  models: CdcDraftModel[]
  onDismiss: () => void
}) {
  return (
    <div
      className="rounded-lg mb-4 overflow-hidden"
      style={{ border: '1px solid #A7F3D0', backgroundColor: '#F0FDF9' }}
    >
      {/* Banner header */}
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #A7F3D0' }}>
        <div className="flex items-center gap-2.5">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <circle cx="8" cy="8" r="7.25" fill="#186749" />
            <path d="M5 8l2.5 2.5 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[13px] font-semibold" style={{ color: '#14532D' }}>
            {models.length} new draft {models.length === 1 ? 'model' : 'models'} ready for review from {connectionName}
          </span>
        </div>
        <button
          onClick={onDismiss}
          className="w-5 h-5 flex items-center justify-center rounded hover:bg-green-100 transition-colors"
          style={{ color: '#6B7280' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Draft model rows */}
      <div>
        {models.map((model, i) => (
          <div
            key={model.id}
            className={`flex items-center gap-4 px-4 py-2.5 ${i > 0 ? '' : ''}`}
            style={{ borderTop: i > 0 ? '1px solid #D1FAE5' : undefined }}
          >
            {/* Name */}
            <div className="flex-1 flex items-center gap-2.5">
              <div className="pl-7">
                <div className="text-[12px] font-semibold text-gray-900">{model.name}</div>
                <div className="text-[11px] text-gray-400">Version 1</div>
              </div>
            </div>
            {/* Draft badge */}
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' }}
            >
              Draft
            </span>
            {/* Records */}
            <span className="text-[12px] text-gray-400 w-16 text-right">0 records</span>
            {/* Connection */}
            <span className="text-[11px] text-gray-400 w-40 truncate text-right">{model.connectionName}</span>
            {/* Time */}
            <span className="text-[11px] text-gray-400 w-16 text-right">Just now</span>
          </div>
        ))}
      </div>
    </div>
  )
}
