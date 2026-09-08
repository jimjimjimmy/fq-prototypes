import { useState } from 'react'

/* ── Types ───────────────────────────────────────────────────── */
interface LinkedFile {
  id: string
  connector: string
  fileLabel: string
  fileName: string
  sourceType: 'Primary' | 'Secondary'
}

interface GroupedDataset {
  id: string
  name: string
  datasetIds: string[]
  isPrimary: boolean
}

/* ── Mock data ───────────────────────────────────────────────── */
const CONNECTORS = [
  {
    name: 'SFTP Connector',
    datasets: [
      { id: '1', name: 'Transaction Delta File Mock Data - File 1.csv', category: 'Transactions' },
      { id: '2', name: 'GL_01_2026.csv', category: 'GL Transactions' },
      { id: '3', name: 'accounting_dummy_data.csv', category: 'Account 1' },
      { id: '4', name: 'accounts.csv', category: 'Account' },
    ],
  },
  {
    name: 'GL Transactions for Demo',
    datasets: [
      { id: '5', name: 'Sample_File_Entity_1_GL_Transactions_Feb_2025.csv', category: 'Transactions' },
    ],
  },
  {
    name: 'GL transaction connector',
    datasets: [
      { id: '6', name: 'Sample_File_Entity_1_GL_Transactions_Feb_2025.csv', category: 'Daily Transactions' },
    ],
  },
  {
    name: 'RBC Test Connection',
    datasets: [
      { id: '7', name: 'gl-transactions_dec-2025.csv', category: '' },
    ],
  },
]

const INITIAL_LINKED: LinkedFile[] = [
  { id: '1', connector: 'Test EG', fileLabel: 'Test Transaction Account', fileName: 'accounts.csv', sourceType: 'Primary' },
]

/* ── Inline SVG icons ────────────────────────────────────────── */
function IconFile() {
  return (
    <svg className="size-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  )
}
function IconChevronDown() {
  return (
    <svg className="size-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
    </svg>
  )
}
function IconChevronRight() {
  return (
    <svg className="size-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
    </svg>
  )
}
function IconTrash() {
  return (
    <svg className="size-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
  )
}
function IconPlus() {
  return (
    <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}

/* ── Component ───────────────────────────────────────────────── */
export default function SourceDatasetsSection() {
  const [expandedConnectors, setExpandedConnectors] = useState<string[]>(['SFTP Connector'])
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([])
  const [linkedFiles, setLinkedFiles] = useState<LinkedFile[]>(INITIAL_LINKED)
  const [groupedDatasets, setGroupedDatasets] = useState<GroupedDataset[]>([])
  const [showGroupDialog, setShowGroupDialog] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')

  const toggleConnector = (name: string) =>
    setExpandedConnectors((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    )

  const toggleDataset = (id: string) =>
    setSelectedDatasets((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    )

  const createGroup = () => {
    if (!newGroupName || selectedDatasets.length === 0) return
    setGroupedDatasets((prev) => [
      ...prev,
      { id: Date.now().toString(), name: newGroupName, datasetIds: selectedDatasets, isPrimary: false },
    ])
    setSelectedDatasets([])
    setNewGroupName('')
    setShowGroupDialog(false)
  }

  const removeGroup = (id: string) =>
    setGroupedDatasets((prev) => prev.filter((g) => g.id !== id))

  const togglePrimary = (id: string) =>
    setGroupedDatasets((prev) =>
      prev.map((g) => ({ ...g, isPrimary: g.id === id ? !g.isPrimary : false }))
    )

  const removeLinkedFile = (id: string) =>
    setLinkedFiles((prev) => prev.filter((f) => f.id !== id))

  const updateSourceType = (id: string, value: 'Primary' | 'Secondary') =>
    setLinkedFiles((prev) => prev.map((f) => (f.id === id ? { ...f, sourceType: value } : f)))

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 gap-6">

        {/* ── Left: Available Datasets ─────────────────────────── */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Available Datasets</h4>
          <div className="border border-gray-200 rounded-lg bg-white divide-y divide-gray-200">
            {CONNECTORS.map((connector) => (
              <div key={connector.name}>
                <button
                  onClick={() => toggleConnector(connector.name)}
                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <IconFile />
                  <span className="flex-1 text-sm font-medium text-gray-800">{connector.name}</span>
                  {expandedConnectors.includes(connector.name) ? <IconChevronDown /> : <IconChevronRight />}
                </button>

                {expandedConnectors.includes(connector.name) && (
                  <div className="bg-gray-50 px-4 py-1 divide-y divide-gray-100">
                    {connector.datasets.map((dataset) => (
                      <label
                        key={dataset.id}
                        className="flex items-start gap-3 py-2.5 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedDatasets.includes(dataset.id)}
                          onChange={() => toggleDataset(dataset.id)}
                          className="mt-0.5 accent-[#186749]"
                        />
                        <div className="min-w-0">
                          <div className="text-sm text-gray-900 truncate">{dataset.name}</div>
                          {dataset.category && (
                            <div className="text-xs text-gray-500">{dataset.category}</div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Linked + Grouped ───────────────────────────── */}
        <div className="space-y-6">

          {/* Linked Datasets table */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Linked Datasets ({linkedFiles.length})
            </h4>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Connector', 'File Label', 'File Name', 'Source Type', ''].map((h) => (
                      <th key={h} className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {linkedFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2.5 text-gray-900">{file.connector}</td>
                      <td className="px-3 py-2.5 text-gray-900">{file.fileLabel}</td>
                      <td className="px-3 py-2.5 text-gray-900 truncate max-w-[120px]">{file.fileName}</td>
                      <td className="px-3 py-2.5">
                        <select
                          value={file.sourceType}
                          onChange={(e) => updateSourceType(file.id, e.target.value as 'Primary' | 'Secondary')}
                          className="border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#186749]"
                        >
                          <option>Primary</option>
                          <option>Secondary</option>
                        </select>
                      </td>
                      <td className="px-3 py-2.5">
                        <button onClick={() => removeLinkedFile(file.id)} className="hover:text-red-500 transition-colors">
                          <IconTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {linkedFiles.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-3 py-6 text-center text-sm text-gray-400">
                        No linked datasets yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Grouped Datasets */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-900">Grouped Datasets</h4>
              <button
                onClick={() => setShowGroupDialog(true)}
                disabled={selectedDatasets.length === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#186749] text-white rounded-md hover:bg-[#145a3e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <IconPlus />
                Create Group
              </button>
            </div>

            {groupedDatasets.length === 0 ? (
              <div className="border border-gray-200 rounded-lg p-6 text-center text-sm text-gray-400">
                Select datasets on the left and click "Create Group" to get started.
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 bg-white">
                {groupedDatasets.map((group) => (
                  <div key={group.id} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{group.name}</span>
                        {group.isPrimary && (
                          <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded font-medium">Primary</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{group.datasetIds.length} dataset(s)</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => togglePrimary(group.id)}
                        className="px-2.5 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                      >
                        {group.isPrimary ? 'Remove Primary' : 'Set as Primary'}
                      </button>
                      <button onClick={() => removeGroup(group.id)} className="hover:text-red-500 transition-colors">
                        <IconTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Create Group Dialog ───────────────────────────────── */}
      {showGroupDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-1">Create Grouped Dataset</h3>
            <p className="text-sm text-gray-500 mb-5">
              Group {selectedDatasets.length} selected dataset(s) under a single name.
            </p>

            <label className="block text-xs font-medium text-gray-700 mb-1.5">Group Name</label>
            <input
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Enter group name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#186749] focus:border-transparent"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && createGroup()}
            />

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => { setShowGroupDialog(false); setNewGroupName('') }}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createGroup}
                disabled={!newGroupName}
                className="px-4 py-2 text-sm bg-[#186749] text-white rounded-md hover:bg-[#145a3e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
