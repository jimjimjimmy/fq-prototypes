import { useState } from 'react'
import { availableEntities, availableModels } from '../../data/entity-mappings'

interface Props {
  onClose: () => void
  onAdd: (entity: string, model: string, identifier: string) => void
}

export default function AddMappingModal({ onClose, onAdd }: Props) {
  const [entity, setEntity] = useState('')
  const [model, setModel] = useState('')
  const [identifier, setIdentifier] = useState('')

  const canSubmit = entity && model && identifier.trim()

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div
        className="fixed z-50 bg-white rounded-xl shadow-2xl"
        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '520px' }}
      >
        <div className="px-7 pt-7 pb-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-[17px] font-semibold text-gray-900">Add New Entity Mapping</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none pl-2"
            >
              ×
            </button>
          </div>
          <p className="text-[13px] text-gray-500 mb-6">
            Add a new entity mapping to a lineage model and its identifier.
          </p>

          {/* Form */}
          <div className="flex flex-col gap-5 mb-7">
            {/* Entity */}
            <div>
              <label className="block text-[13px] font-medium text-gray-900 mb-1.5">Entity</label>
              <select
                value={entity}
                onChange={e => setEntity(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-[13px] text-gray-700 bg-white focus:outline-none focus:border-gray-400 appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                }}
              >
                <option value="" disabled>Select entity</option>
                {availableEntities.map(e => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>

            {/* Lineage Model */}
            <div>
              <label className="block text-[13px] font-medium text-gray-900 mb-1.5">Lineage Model</label>
              <select
                value={model}
                onChange={e => setModel(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-[13px] text-gray-700 bg-white focus:outline-none focus:border-gray-400 appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239CA3AF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                }}
              >
                <option value="" disabled>Select model</option>
                {availableModels.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Identifier */}
            <div>
              <label className="block text-[13px] font-medium text-gray-900 mb-1.5">Identifier</label>
              <input
                type="text"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="Enter identifier (e.g., US_ENTITY_001)"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-[13px] text-gray-700 bg-white focus:outline-none focus:border-gray-400 placeholder:text-gray-400"
              />
              <p className="text-[11px] text-gray-400 mt-1.5">
                This identifier will be used to map data to this entity
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-700 font-medium"
            >
              Cancel
            </button>
            <button
              disabled={!canSubmit}
              onClick={() => canSubmit && onAdd(entity, model, identifier.trim())}
              className="px-5 py-2 text-sm rounded-md font-medium transition-colors"
              style={{
                backgroundColor: canSubmit ? '#186749' : '#E5E7EB',
                color: canSubmit ? '#fff' : '#9CA3AF',
                cursor: canSubmit ? 'pointer' : 'not-allowed',
              }}
            >
              Add Mapping
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
