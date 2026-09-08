import { useState } from 'react'
import { mockEntityMappings } from '../../data/entity-mappings'
import type { EntityMapping } from '../../data/entity-mappings'
import AddMappingModal from './AddMappingModal'

type SortKey = 'entity' | 'model' | 'identifier' | 'createdDate' | 'createdBy'
type SortDir = 'asc' | 'desc'

export default function EntityMappingsTable() {
  const [mappings, setMappings] = useState<EntityMapping[]>(mockEntityMappings)
  const [showModal, setShowModal] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = [...mappings].sort((a, b) => {
    if (!sortKey) return 0
    const av = a[sortKey].toLowerCase()
    const bv = b[sortKey].toLowerCase()
    return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
  })

  const handleAdd = (entity: string, model: string, identifier: string) => {
    const newMapping: EntityMapping = {
      id: `em-${Date.now()}`,
      entity,
      model,
      identifier,
      createdDate: new Date().toISOString().split('T')[0],
      createdBy: 'admin@company.com',
    }
    setMappings(prev => [...prev, newMapping])
    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    setMappings(prev => prev.filter(m => m.id !== id))
  }

  return (
    <div>
      {/* Section header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-[15px] font-semibold text-gray-900 mb-0.5">Entity Mappings</h3>
          <p className="text-[12px] text-gray-500">
            Manage entity mappings to lineage models and their identifiers
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium text-white rounded-md transition-colors hover:bg-[#145a3e]"
          style={{ backgroundColor: '#186749' }}
        >
          <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Add Mapping
        </button>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        {/* Header */}
        <div
          className="grid px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-400 uppercase tracking-wider"
          style={{ gridTemplateColumns: '1fr 1.5fr 1.2fr 1fr 1.2fr 120px' }}
        >
          <SortHeader label="Entity" sortKey="entity" currentKey={sortKey} dir={sortDir} onClick={handleSort} />
          <SortHeader label="Model" sortKey="model" currentKey={sortKey} dir={sortDir} onClick={handleSort} />
          <SortHeader label="Identifier" sortKey="identifier" currentKey={sortKey} dir={sortDir} onClick={handleSort} />
          <SortHeader label="Created Date" sortKey="createdDate" currentKey={sortKey} dir={sortDir} onClick={handleSort} />
          <SortHeader label="Created By" sortKey="createdBy" currentKey={sortKey} dir={sortDir} onClick={handleSort} />
          <span>Actions</span>
        </div>

        {/* Rows */}
        {sorted.length === 0 ? (
          <EmptyState onAdd={() => setShowModal(true)} />
        ) : (
          sorted.map(mapping => (
            <div
              key={mapping.id}
              className="grid items-center px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
              style={{ gridTemplateColumns: '1fr 1.5fr 1.2fr 1fr 1.2fr 120px' }}
            >
              <span className="text-[13px] text-gray-900">{mapping.entity}</span>
              <span className="text-[13px] text-gray-900">{mapping.model}</span>
              <span className="text-[13px] text-gray-500 font-mono">{mapping.identifier}</span>
              <span className="text-[12px] text-gray-500">{mapping.createdDate}</span>
              <span className="text-[12px] text-gray-500">{mapping.createdBy}</span>
              <div className="flex items-center gap-3">
                <button className="text-[13px] text-gray-700 hover:text-gray-900 transition-colors">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(mapping.id)}
                  className="text-[13px] text-gray-700 hover:text-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <p className="text-[12px] text-gray-400 mt-3">Total mappings: {mappings.length}</p>

      {/* Modal */}
      {showModal && (
        <AddMappingModal onClose={() => setShowModal(false)} onAdd={handleAdd} />
      )}
    </div>
  )
}

/* ── Sort header cell ── */
function SortHeader({
  label,
  sortKey,
  currentKey,
  dir,
  onClick,
}: {
  label: string
  sortKey: SortKey
  currentKey: SortKey | null
  dir: SortDir
  onClick: (key: SortKey) => void
}) {
  const isActive = currentKey === sortKey
  return (
    <button
      onClick={() => onClick(sortKey)}
      className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors bg-transparent border-0 p-0 cursor-pointer"
    >
      {label}
      <svg width="8" height="12" viewBox="0 0 8 12" fill="none" className="shrink-0">
        <path
          d="M4 1L7 4.5H1L4 1Z"
          fill={isActive && dir === 'asc' ? '#374151' : '#D1D5DB'}
        />
        <path
          d="M4 11L1 7.5H7L4 11Z"
          fill={isActive && dir === 'desc' ? '#374151' : '#D1D5DB'}
        />
      </svg>
    </button>
  )
}

/* ── Empty state ── */
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="py-14 flex flex-col items-center text-center">
      <p className="text-[14px] font-semibold text-gray-700 mb-1">No entity mappings yet</p>
      <p className="text-[12px] text-gray-400 mb-4">
        Add your first entity mapping to connect entities to lineage models.
      </p>
      <button
        onClick={onAdd}
        className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium text-white rounded-md"
        style={{ backgroundColor: '#186749' }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        Add Mapping
      </button>
    </div>
  )
}
