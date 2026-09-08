/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AgGridReact } from '@ag-grid-community/react'
import { ModuleRegistry } from '@ag-grid-community/core'
import type { ColDef } from '@ag-grid-community/core'
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import { floqastGridTheme } from '../grid/floqastGridTheme'
import { getDimensionById } from '../../data/dimensions'
import type { DimensionValue, DimensionModel } from '../../data/dimensions'

ModuleRegistry.registerModules([ClientSideRowModelModule])

function computeBreakdown(total: number, models: DimensionModel['modelsUsing']) {
  if (models.length === 0 || total === 0) return []
  const weights = models.map((_, i) => Math.pow(0.6, i))
  const sum = weights.reduce((a, b) => a + b, 0)
  return models.map((m, i) => ({ name: m.name, count: Math.round(total * weights[i] / sum) }))
}

// Module-level ref so cell renderer can call back into component state
let _onWarningClick: ((v: DimensionValue) => void) | undefined

function ValueNameCell(params: any) {
  const d = params.data as DimensionValue
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', height: '100%' }}>
      {d.warning ? (
        <button
          onClick={e => { e.stopPropagation(); _onWarningClick?.(d) }}
          title={d.warning}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1.5L12.5 11.5H1.5L7 1.5Z" stroke="#D97706" strokeWidth="1.4" strokeLinejoin="round" fill="#FEF3C7" />
            <path d="M7 5.5V8" stroke="#D97706" strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="7" cy="10" r="0.65" fill="#D97706" />
          </svg>
        </button>
      ) : (
        <div style={{ width: '14px', flexShrink: 0 }} />
      )}
      <span style={{ fontSize: '13px', color: '#1d2433' }}>{d.value}</span>
    </div>
  )
}

function makeLinkedRecordsCell(maxCount: number, models: DimensionModel['modelsUsing']) {
  return function LinkedRecordsCell({ data }: { data: any }) {
    const d = data as DimensionValue
    const pct = maxCount > 0 ? (d.recordCount / maxCount) * 100 : 0
    const isEmpty = d.recordCount === 0
    const breakdown = computeBreakdown(d.recordCount, models)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '100px', height: '5px', borderRadius: '3px', backgroundColor: '#f1f5f9', overflow: 'hidden', flexShrink: 0 }}>
            {!isEmpty && <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#93c5fd', borderRadius: '3px' }} />}
          </div>
          <span style={{ fontSize: '13px', fontWeight: 500, color: isEmpty ? '#adb2bb' : '#1d2433', fontVariantNumeric: 'tabular-nums' }}>
            {isEmpty ? '—' : d.recordCount.toLocaleString()}
          </span>
        </div>
        {!isEmpty && breakdown.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', overflow: 'hidden' }}>
            {breakdown.map((b, i) => (
              <span key={i} style={{ fontSize: '11px', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                {b.count.toLocaleString()} <span style={{ color: '#6b7280' }}>{b.name}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }
}

function WarningDrawer({ value, onClose }: { value: DimensionValue; onClose: () => void }) {
  const suspectedMatch = value.warning?.match(/['"]([^'"]+)['"]\s*$/)?.[ 1]
  return (
    <div style={{
      borderTop: '2px solid #FCD34D', backgroundColor: '#FFFBEB',
      padding: '16px 20px', flexShrink: 0, display: 'flex', gap: '12px', alignItems: 'flex-start',
    }}>
      <svg width="18" height="18" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: '1px' }}>
        <path d="M7 1.5L12.5 11.5H1.5L7 1.5Z" stroke="#D97706" strokeWidth="1.4" strokeLinejoin="round" fill="#FEF3C7" />
        <path d="M7 5.5V8" stroke="#D97706" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="7" cy="10" r="0.65" fill="#D97706" />
      </svg>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#92400e', marginBottom: '4px' }}>
          {value.warning}
        </div>
        <div style={{ fontSize: '12px', color: '#78350f', lineHeight: 1.5 }}>
          <strong>"{value.value}"</strong>
          {value.recordCount > 0
            ? ` has ${value.recordCount.toLocaleString()} linked records`
            : ' has no linked records'
          }
          {suspectedMatch && ` — if this is the same as "${suspectedMatch}", those records may be grouped separately in downstream reporting.`}
          {!suspectedMatch && ' — this key collision may cause records to be dropped or duplicated in downstream reporting.'}
        </div>
      </div>
      <button
        onClick={onClose}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#92400e', fontSize: '18px', lineHeight: 1, padding: '0 4px', flexShrink: 0 }}
      >
        ×
      </button>
    </div>
  )
}

export default function DimensionValuesSection() {
  const { id } = useParams<{ id: string }>()
  const dimension = id ? getDimensionById(id) : undefined

  const [filterText, setFilterText]       = useState('')
  const [showIssuesOnly, setShowIssuesOnly] = useState(false)
  const [selectedWarning, setSelectedWarning] = useState<DimensionValue | null>(null)

  _onWarningClick = (v) => setSelectedWarning(prev => prev?.id === v.id ? null : v)

  const getRowHeight = useCallback(() => 56, [])

  const allValues = dimension?.values ?? []
  const issueCount = allValues.filter(v => v.warning).length

  const displayValues = useMemo(() => {
    const filtered = showIssuesOnly ? allValues.filter(v => v.warning) : allValues
    return [...filtered].sort((a, b) => a.value.localeCompare(b.value))
  }, [allValues, showIssuesOnly])

  const maxCount = useMemo(
    () => Math.max(...allValues.map(v => v.recordCount), 0),
    [allValues]
  )

  const colDefs: ColDef<DimensionValue>[] = useMemo(() => [
    {
      headerName: 'Value', field: 'value', flex: 1, minWidth: 200,
      cellRenderer: ValueNameCell, sortable: true,
    },
    {
      headerName: 'Linked Records', field: 'recordCount', flex: 3, minWidth: 320,
      cellRenderer: makeLinkedRecordsCell(maxCount, dimension?.modelsUsing ?? []),
      sortable: true,
    },
  ], [maxCount, dimension])

  if (!dimension) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Toolbar */}
      <div style={{ padding: '16px 24px 12px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <div style={{ position: 'relative', flex: '0 0 240px' }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', color: '#adb2bb', pointerEvents: 'none' }}>
            <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.3" />
            <path d="M9 9l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <input
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            placeholder="Search values…"
            style={{
              width: '100%', height: '32px', paddingLeft: '28px', paddingRight: '10px',
              fontSize: '12px', border: '1px solid #e1e6ef', borderRadius: '6px',
              outline: 'none', color: '#1d2433', boxSizing: 'border-box',
            }}
          />
        </div>

        {issueCount > 0 && (
          <button
            onClick={() => { setShowIssuesOnly(v => !v); setSelectedWarning(null) }}
            style={{
              height: '32px', padding: '0 12px', fontSize: '12px', cursor: 'pointer',
              borderRadius: '6px', border: `1px solid ${showIssuesOnly ? '#D97706' : '#e1e6ef'}`,
              backgroundColor: showIssuesOnly ? '#FEF3C7' : 'white',
              color: showIssuesOnly ? '#92400e' : '#6b7280', fontWeight: showIssuesOnly ? 600 : 400,
              display: 'flex', alignItems: 'center', gap: '6px',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M7 1.5L12.5 11.5H1.5L7 1.5Z" stroke="#D97706" strokeWidth="1.4" strokeLinejoin="round" fill={showIssuesOnly ? '#FEF3C7' : 'none'} />
            </svg>
            {issueCount} {issueCount === 1 ? 'issue' : 'issues'}
          </button>
        )}

        <span style={{ fontSize: '12px', color: '#adb2bb', marginLeft: 'auto' }}>
          {displayValues.length} of {dimension.records} values
          {dimension.modelsUsing.length > 0 && ` · across ${dimension.modelsUsing.map(m => m.name).join(', ')}`}
        </span>
      </div>

      {/* Grid */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <AgGridReact<DimensionValue>
          theme={floqastGridTheme}
          rowData={displayValues}
          columnDefs={colDefs}
          getRowHeight={getRowHeight}
          suppressCellFocus
          suppressMovableColumns
          quickFilterText={filterText}
          defaultColDef={{ resizable: true }}
        />
      </div>

      {/* Warning drawer */}
      {selectedWarning && (
        <WarningDrawer value={selectedWarning} onClose={() => setSelectedWarning(null)} />
      )}
    </div>
  )
}
