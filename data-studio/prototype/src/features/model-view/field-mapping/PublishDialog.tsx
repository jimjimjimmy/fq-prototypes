import { useState } from 'react'
import type { FieldMapping } from '../../../data/field-mappings'

interface PublishDialogProps {
  isOpen: boolean
  onClose: () => void
  mappings: FieldMapping[]
}

export default function PublishDialog({ isOpen, onClose, mappings }: PublishDialogProps) {
  const [effectiveDate, setEffectiveDate] = useState('2026-01-01')
  const [published, setPublished] = useState(false)

  if (!isOpen) return null

  const unmappedMandatory = mappings.filter(m => m.isMandatory && m.sourceFields.length === 0)
  const canPublish = unmappedMandatory.length === 0
  const isHistoricalBackfill = effectiveDate === '1900-01-01'

  const handlePublish = () => {
    setPublished(true)
    setTimeout(() => {
      setPublished(false)
      onClose()
    }, 1500)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed z-50 bg-white rounded-lg shadow-2xl w-full max-w-lg"
        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">Publish Model Configuration</h2>
          <p className="text-xs text-gray-500 mt-0.5">Review and confirm before publishing</p>
        </div>

        <div className="px-6 py-5 space-y-4">

          {/* Validation */}
          {!canPublish && (
            <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm">
              <svg className="size-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
              </svg>
              <div>
                <div className="font-medium text-red-800 mb-1">Cannot publish — fix the following first:</div>
                <ul className="text-xs text-red-700 space-y-0.5 list-disc list-inside">
                  {unmappedMandatory.map(f => (
                    <li key={f.id}>{f.fqFieldName} — mandatory field has no source mapping</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {canPublish && !published && (
            <div className="flex gap-3 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
              <svg className="size-4 text-green-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
              </svg>
              All mandatory fields are mapped. Ready to publish.
            </div>
          )}

          {published && (
            <div className="flex gap-3 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
              <svg className="size-4 text-green-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
              </svg>
              Model published successfully! Data processing has begun.
            </div>
          )}

          {/* Model info */}
          <div className="border border-gray-200 rounded-lg p-4 space-y-3 text-sm">
            <div>
              <div className="text-xs text-gray-500 mb-0.5">Model Name</div>
              <div className="font-medium text-gray-900">US Accounts</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-0.5">Current Status</div>
              <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-700 rounded font-medium">Draft</span>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-0.5">Mapped Fields</div>
              <div className="font-medium text-gray-900">{mappings.filter(m => m.sourceFields.length > 0).length} / {mappings.length}</div>
            </div>
          </div>

          {/* Effective date */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Effective Date</label>
            <input
              type="date"
              value={effectiveDate}
              onChange={e => setEffectiveDate(e.target.value)}
              disabled={!canPublish}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#186749] disabled:bg-gray-50 disabled:text-gray-400"
            />
            {isHistoricalBackfill && (
              <p className="mt-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
                <strong>Historical backfill:</strong> Effective date of Jan 1, 1900 will trigger a full historical backfill. This may take significant time.
              </p>
            )}
          </div>

          {/* What happens */}
          {canPublish && (
            <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 space-y-1">
              <div className="font-medium text-gray-700 mb-1.5">What happens next</div>
              <div>• Model status changes from Draft → Active</div>
              <div>• Data processing begins for configured source datasets</div>
              <div>• Historical data processed based on effective date</div>
              <div>• Monitor progress in the Logs tab</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            disabled={!canPublish || published}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-[#186749] text-white rounded-md hover:bg-[#145a3e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"/>
            </svg>
            Publish Model
          </button>
        </div>
      </div>
    </>
  )
}
