import { useState } from 'react'
import { useAiMode } from '../../context/AiModeContext'
import type { FieldMapping } from '../../data/field-mappings'

interface InlineTransformationEditorProps {
  mapping: FieldMapping
  onSave: (expression: string) => void
  onClose: () => void
  onPopOut: () => void
}

export default function InlineTransformationEditor({
  mapping,
  onSave,
  onClose,
  onPopOut,
}: InlineTransformationEditorProps) {
  const [expression, setExpression] = useState(mapping.transformation || '')
  const { aiMode } = useAiMode()

  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div
        className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-3 w-[500px]"
        style={{ top: '30%', left: '50%', transform: 'translateX(-50%)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="text-xs text-gray-500 mb-2 font-medium">{mapping.fqFieldName}</div>
        <textarea
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="Add functions for data transformation"
          className="w-full h-24 px-3 py-2 text-sm font-mono border border-gray-200 rounded-md bg-gray-50 resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
        />
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            {/* fx icon */}
            <button className="text-gray-400 hover:text-gray-600 text-sm font-mono font-bold" title="Function library">
              fx
            </button>
            {/* AI sparkle */}
            <button
              className="text-gray-400 hover:text-purple-500"
              title={aiMode === 'directed' ? 'AI suggestions' : 'AI chat'}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L9.5 5.5L14 7L9.5 8.5L8 13L6.5 8.5L2 7L6.5 5.5L8 1Z" fill="currentColor"/>
              </svg>
            </button>
            {/* Pop-out icon */}
            <button
              onClick={onPopOut}
              className="text-gray-400 hover:text-gray-600"
              title="Open in transformation window"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M8 1.5H12.5V6M12.5 1.5L6.5 7.5M5.5 1.5H2.5C1.95 1.5 1.5 1.95 1.5 2.5V11.5C1.5 12.05 1.95 12.5 2.5 12.5H11.5C12.05 12.5 11.5 12.05 12.5 11.5V8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (expression.trim()) onSave(expression.trim())
                else onClose()
              }}
              className="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-md hover:bg-emerald-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
