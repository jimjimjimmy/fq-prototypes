import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { getModelById } from '../../data/models'

type IdentifierType = 'constant' | 'column' | 'filename'

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  draft: 'bg-yellow-100 text-yellow-700',
}

const MOCK_COLUMNS = ['entity_id', 'company_code', 'region', 'account_id']

export default function OverviewSection() {
  const { id } = useParams<{ id: string }>()
  const model = id ? getModelById(id) : undefined

  const [identifierType, setIdentifierType] = useState<IdentifierType>('constant')
  const [constantValue, setConstantValue] = useState('')
  const [selectedColumn, setSelectedColumn] = useState('')
  const [filenamePattern, setFilenamePattern] = useState('')

  return (
    <div className="p-6 space-y-5 max-w-3xl">

      {/* Model Information */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Model Information</h4>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <div>
            <div className="text-gray-500 mb-1">Model Name</div>
            <div className="font-medium text-gray-900">{model?.name ?? '—'}</div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">Status</div>
            <span className={`inline-block px-2 py-0.5 text-xs rounded font-medium ${STATUS_STYLES[model?.status ?? 'draft']}`}>
              {model?.status ? model.status.charAt(0).toUpperCase() + model.status.slice(1) : '—'}
            </span>
          </div>
          <div>
            <div className="text-gray-500 mb-1">Version</div>
            <div className="font-medium text-gray-900">{model?.version ?? '—'}</div>
          </div>
          <div>
            <div className="text-gray-500 mb-1">Last Updated</div>
            <div className="font-medium text-gray-900">{model?.lastUpdated ?? '—'}</div>
          </div>
        </div>
      </div>

      {/* Entity Identifier Definition */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <h4 className="text-sm font-semibold text-gray-900 mb-1">Entity Identifier Definition</h4>
        <p className="text-xs text-gray-500 mb-5">
          Define how this model identifies which entity a record belongs to.
        </p>

        <div className="space-y-5">
          {/* Type selector */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Select how to define the identifier for entity mapping
            </label>
            <select
              value={identifierType}
              onChange={(e) => setIdentifierType(e.target.value as IdentifierType)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#186749] focus:border-transparent"
            >
              <option value="constant">Constant Value</option>
              <option value="column">Column Value</option>
              <option value="filename">File Name Pattern</option>
            </select>
          </div>

          {/* Constant Value */}
          {identifierType === 'constant' && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Constant Identifier Value
              </label>
              <input
                type="text"
                value={constantValue}
                onChange={(e) => setConstantValue(e.target.value)}
                placeholder="e.g., US_ENTITY_001"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#186749] focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                All records in this model will be mapped to the same entity.
              </p>
            </div>
          )}

          {/* Column Value */}
          {identifierType === 'column' && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Select Column
              </label>
              <select
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#186749] focus:border-transparent"
              >
                <option value="" disabled>Choose a column</option>
                {MOCK_COLUMNS.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                The value of this column will be used to determine the entity for each record.
              </p>
            </div>
          )}

          {/* File Name Pattern */}
          {identifierType === 'filename' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  File Name Pattern
                </label>
                <input
                  type="text"
                  value={filenamePattern}
                  onChange={(e) => setFilenamePattern(e.target.value)}
                  placeholder="e.g., *_Entity_{identifier}_*.csv"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#186749] focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use <code className="bg-gray-100 px-1 rounded">{'{identifier}'}</code> to mark the portion of the filename to extract.
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Example File Name
                </label>
                <input
                  type="text"
                  value="Sample_File_Entity_1_GL_Transactions_Feb_2025.csv"
                  disabled
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
                />
              </div>
            </div>
          )}

          {/* Save */}
          <div className="flex justify-end pt-2">
            <button className="px-4 py-2 bg-[#186749] text-white text-sm font-medium rounded-md hover:bg-[#145a3e] transition-colors">
              Save Identifier Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
