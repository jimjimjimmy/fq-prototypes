/* eslint-disable @typescript-eslint/no-explicit-any -- AG Grid cell renderer params are untyped */
import { useState } from 'react'
import { AgGridReact } from '@ag-grid-community/react'
import { ModuleRegistry } from '@ag-grid-community/core'
import type { ColDef } from '@ag-grid-community/core'
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import { mockConnections, formatDate } from '../../data/connections'
import type { Connection, ConnectionStatus, SourceType, EndpointDef } from '../../data/connections'
import { SourceBadge, ErrorBanner } from '../connections/Badges'
import { Button, Input, Popover } from '@floqastinc/flow-ui_core'
import AddConnectorModal from '../connections/AddConnectorModal'
import QBOBasicFlow from '../connections/QBOBasicFlow'
import EndpointLibrary from '../connections/EndpointLibrary'
import CustomEndpointWizard from '../connections/CustomEndpointWizard'
import NetSuiteEnhancedWizard from '../connections/NetSuiteEnhancedWizard'
import { floqastGridTheme } from '../grid/floqastGridTheme'
import { useCdc } from '../../context/CdcContext'

ModuleRegistry.registerModules([ClientSideRowModelModule])

type ModalState =
  | null
  | { type: 'add' }
  | { type: 'qbo-basic' }
  | { type: 'api-connector' }
  | { type: 'netsuite-enhanced' }
  | { type: 'endpoint-library'; connectionId: string }

/* ── Row types ── */
type ConnectionRow = Connection & { _rowType: 'connection' }
type ErrorRow = {
  _rowType: 'error'
  _parentId: string
  errorType: Connection['errorType']
  errorMessage: Connection['errorMessage']
  status: Connection['status']
}
type TableRow = ConnectionRow | ErrorRow

const STATUS_DOT: Record<ConnectionStatus, string> = {
  Connected:          '#16a34a',
  Syncing:            '#16a34a',
  Connecting:         '#2563eb',
  Error:              '#dc2626',
  Paused:             '#6b7280',
  Warning:            '#d97706',
  'Initial Data Load':'#d97706',
}

/* ── Cell renderers — defined outside component, named functions ── */

function NameCellRenderer({ data }: { data: any }) {
  if (data?._rowType !== 'connection') return null
  return (
    <div className="flex flex-col gap-0.5">
      <div className="text-[13px] font-semibold text-gray-900 leading-tight">{data.name}</div>
      <div className="text-[11px] text-gray-400 leading-tight">{data.endpoint.name}</div>
    </div>
  )
}

function SourceCellRenderer({ data }: { data: any }) {
  if (data?._rowType !== 'connection') return null
  return <SourceBadge sourceType={data.sourceType} />
}

function EntitiesCellRenderer({ data }: { data: any }) {
  if (data?._rowType !== 'connection') return null
  return (
    <div className="flex flex-wrap gap-1">
      {data.entities.map((e: string) => (
        <span key={e} className="text-[10px] text-gray-600 bg-gray-100 px-2 py-[3px] rounded-full leading-none">{e}</span>
      ))}
    </div>
  )
}

function StatusCellRenderer({ data }: { data: any }) {
  if (data?._rowType !== 'connection') return null
  const dotColor = STATUS_DOT[data.status as ConnectionStatus]
  return (
    <div className="flex items-center gap-1.5">
      <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: dotColor, flexShrink: 0 }} />
      <span className="text-[12px] text-gray-700">{data.status}</span>
    </div>
  )
}

function LastSyncedCellRenderer({ data }: { data: any }) {
  if (data?._rowType !== 'connection') return null
  return <span className="text-[12px] text-gray-500">{formatDate(data.lastSync)}</span>
}

function ActionCellRenderer({ data, context }: { data: any; context: any }) {
  if (data?._rowType !== 'connection') return null
  const hasError = data.status === 'Error'
  const isPaused = data.status === 'Paused'

  const menuItems = [
    { label: 'View Endpoints', action: () => context.openEndpointLibrary(data.id) },
    { label: 'Edit', action: () => {} },
    { label: isPaused ? 'Resume' : 'Pause', action: () => {}, disabled: data.status === 'Connecting' },
    { label: 'Reconnect', action: () => {}, disabled: ['Connected', 'Syncing', 'Connecting'].includes(data.status), danger: hasError },
  ]

  return (
    <Popover>
      <Popover.Trigger>
        <button className="w-7 h-7 flex items-center justify-center rounded border border-transparent hover:bg-gray-100 hover:border-gray-200 text-gray-500 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5"/>
            <circle cx="12" cy="12" r="1.5"/>
            <circle cx="12" cy="19" r="1.5"/>
          </svg>
        </button>
      </Popover.Trigger>
      <Popover.Content side="bottom" align="end" sideOffset={4}>
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg min-w-[168px] overflow-hidden">
          {menuItems.map(item => (
            <button
              key={item.label}
              disabled={item.disabled}
              onClick={() => { if (!item.disabled) item.action() }}
              className="flex items-center w-full px-3.5 py-2.5 text-[13px] text-left hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              style={{ color: item.disabled ? '#D1D5DB' : item.danger ? '#DC2626' : '#374151' }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </Popover.Content>
    </Popover>
  )
}

function ErrorBannerCellRenderer({ data }: { data: any }) {
  if (data?._rowType !== 'error') return null
  const type = data.status === 'Warning' ? 'warning' : 'error'
  let actions: { label: string; primary?: boolean; link?: boolean }[] = []
  if (data.errorType === 'oauth_expired') {
    actions = [{ label: 'Reconnect', primary: true }]
  } else if (data.errorType === 'auth_error') {
    actions = [{ label: 'Reconnect', primary: true }, { label: 'View Sync Log', link: true }]
  }
  return <ErrorBanner type={type} message={data.errorMessage} actions={actions} />
}

/* ── Shared cell style — flex center, let renderers fill height ── */
const CELL: ColDef['cellStyle'] = { display: 'flex', alignItems: 'center', padding: '0 16px' }

/* ── Column definitions ── */
const columnDefs: ColDef[] = [
  {
    headerName: 'Connection',
    field: 'name',
    flex: 2.2,
    minWidth: 180,
    cellRenderer: NameCellRenderer,
    cellStyle: CELL,
  },
  {
    headerName: 'Source',
    field: 'sourceType',
    width: 120,
    cellRenderer: SourceCellRenderer,
    cellStyle: CELL,
  },
  {
    headerName: 'Entities',
    field: 'entities',
    flex: 1.4,
    minWidth: 120,
    cellRenderer: EntitiesCellRenderer,
    cellStyle: CELL,
  },
  {
    headerName: 'Status',
    field: 'status',
    width: 110,
    cellRenderer: StatusCellRenderer,
    cellStyle: CELL,
  },
  {
    headerName: 'Last Synced',
    field: 'lastSync',
    flex: 1,
    minWidth: 130,
    cellRenderer: LastSyncedCellRenderer,
    cellStyle: CELL,
  },
  {
    headerName: '',
    field: 'id',
    width: 48,
    sortable: false,
    cellRenderer: ActionCellRenderer,
    cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px' },
  },
]

/* ── Main component ── */
export default function ConnectionsTable() {
  const [connections, setConnections] = useState<Connection[]>(mockConnections)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<ModalState>(null)
  const [, setPendingSource] = useState<SourceType | null>(null)
  const { addDraftModels } = useCdc()

  const filtered = connections.filter(c => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return c.name.toLowerCase().includes(q) || c.entities.some(e => e.toLowerCase().includes(q))
  })

  /* Flatten connections + inline error/warning banners into a single row array */
  const rowData: TableRow[] = []
  for (const conn of filtered) {
    rowData.push({ ...conn, _rowType: 'connection' })
    const hasError = conn.status === 'Error'
    const hasWarning = conn.status === 'Warning'
    if ((hasError || hasWarning) && conn.errorMessage) {
      rowData.push({
        _rowType: 'error',
        _parentId: conn.id,
        errorType: conn.errorType,
        errorMessage: conn.errorMessage,
        status: conn.status,
      })
    }
  }

  /* ── Flow orchestration ── */
  const handleSourceSelected = (type: SourceType) => {
    setPendingSource(type)
    if (type === 'QBO Basic') {
      setModal({ type: 'qbo-basic' })
    } else if (type === 'API Connector') {
      setModal({ type: 'api-connector' })
    } else if (type === 'NetSuite Enhanced') {
      setModal({ type: 'netsuite-enhanced' })
    } else {
      addNewConnection(`New ${type} Connection`, type)
    }
  }

  const handleNetSuiteComplete = (connectionName: string) => {
    const newConn: Connection = {
      id: `c${Date.now()}`,
      name: connectionName,
      sourceType: 'NetSuite Enhanced',
      entities: [],
      status: 'Initial Data Load',
      lastSync: 'Never',
      endpoint: {
        name: `NetSuite Enhanced — ${connectionName}`,
        url: 'https://pending.configuration.com',
        syncFrequency: 'Real-time',
      },
      models: [],
      endpoints: [],
      syncLog: [],
    }
    setConnections(prev => [newConn, ...prev])
    addDraftModels(connectionName, [
      { id: `draft-${Date.now()}-1`, name: 'Transactions', connectionName },
      { id: `draft-${Date.now()}-2`, name: 'Accounts', connectionName },
      { id: `draft-${Date.now()}-3`, name: 'GL Lines', connectionName },
    ])
    setModal(null)
    setPendingSource(null)
  }

  const handleQBOComplete = (connectionName: string) => {
    addNewConnection(connectionName, 'QBO Basic')
  }

  const addNewConnection = (name: string, sourceType: SourceType) => {
    const newConn: Connection = {
      id: `c${Date.now()}`,
      name,
      sourceType,
      entities: ['New Entity'],
      status: 'Connecting',
      lastSync: 'Never',
      endpoint: {
        name: `${sourceType} — ${name}`,
        url: 'https://pending.configuration.com',
        syncFrequency: sourceType === 'QBO Enhanced' ? 'Real-time' : 'Every 6 hours',
      },
      models: [],
      endpoints: [],
      syncLog: [],
    }
    setConnections(prev => [newConn, ...prev])
    setModal(null)
    setPendingSource(null)
  }

  const addEndpointToConnection = (connectionId: string, endpoint: EndpointDef) => {
    setConnections(prev =>
      prev.map(c =>
        c.id === connectionId ? { ...c, endpoints: [...c.endpoints, endpoint] } : c
      )
    )
  }

  const closeModal = () => { setModal(null); setPendingSource(null) }

  const libraryConnection = modal?.type === 'endpoint-library'
    ? connections.find(c => c.id === modal.connectionId)
    : undefined

  const gridContext = {
    openEndpointLibrary: (connectionId: string) => setModal({ type: 'endpoint-library', connectionId }),
  }

  return (
    <div>
      {/* Section header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-[15px] font-semibold text-gray-900 mb-0.5">Connectors</h3>
          <p className="text-[12px] text-gray-500">Configure and monitor your data source connections</p>
        </div>
        <Button onClick={() => setModal({ type: 'add' })}>
          Add Connector
        </Button>
      </div>

      {/* Search */}
      <div className="mb-3.5">
        <Input
          isSearchable
          value={search}
          onChange={(e: unknown) => setSearch((e as React.ChangeEvent<HTMLInputElement>).target.value)}
          placeholder="Search by connection name or entity…"
          className="w-full"
        />
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        {filtered.length === 0 ? (
          <EmptyState search={search} onAdd={() => setModal({ type: 'add' })} />
        ) : (
          <AgGridReact
            theme={floqastGridTheme}
            columnDefs={columnDefs}
            rowData={rowData}
            domLayout="autoHeight"
            rowHeight={64}
            suppressCellFocus={true}
            context={gridContext}
            getRowId={(params) => {
              const row = params.data as TableRow
              return row._rowType === 'error'
                ? `error-${row._parentId}`
                : `conn-${(row as ConnectionRow).id}`
            }}
            getRowHeight={(params) => params.data?._rowType === 'error' ? 44 : undefined}
            isFullWidthRow={(params) => params.rowNode.data?._rowType === 'error'}
            fullWidthCellRenderer={ErrorBannerCellRenderer}
          />
        )}
      </div>

      {/* ── Modals ── */}
      {modal?.type === 'add' && (
        <AddConnectorModal onClose={closeModal} onContinue={handleSourceSelected} />
      )}
      {modal?.type === 'qbo-basic' && (
        <QBOBasicFlow onClose={closeModal} onComplete={handleQBOComplete} />
      )}
      {modal?.type === 'api-connector' && (
        <CustomEndpointWizard
          onClose={closeModal}
          onSave={ep => {
            addNewConnection(ep.name || 'New API Connection', 'API Connector')
          }}
        />
      )}
      {modal?.type === 'netsuite-enhanced' && (
        <NetSuiteEnhancedWizard onClose={closeModal} onComplete={handleNetSuiteComplete} />
      )}
      {modal?.type === 'endpoint-library' && libraryConnection && (
        <EndpointLibrary
          connectionEndpoints={libraryConnection.endpoints}
          onClose={closeModal}
          onAddEndpoint={ep => addEndpointToConnection(modal.connectionId, ep)}
        />
      )}
    </div>
  )
}

/* ── Empty state ── */
function EmptyState({ search, onAdd }: { search: string; onAdd: () => void }) {
  return (
    <div className="py-14 flex flex-col items-center text-center">
      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="8.5" cy="8.5" r="5.5" stroke="#9CA3AF" strokeWidth="1.4"/><path d="M13 13L17 17" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round"/></svg>
      </div>
      <p className="text-[14px] font-semibold text-gray-700 mb-1">{search ? 'No results found' : 'No connections yet'}</p>
      <p className="text-[12px] text-gray-400 mb-4">
        {search ? `No connections match "${search}".` : 'Add your first connector to start syncing data.'}
      </p>
      {!search && (
        <Button onClick={onAdd}>Add Connector</Button>
      )}
    </div>
  )
}
