/**
 * TransformationWindow — floating manual transformation editor.
 *
 * AI-driven editing (generate / refine / suggest, sparkle button,
 * directed dropdown, conversational chat panel) was intentionally
 * stripped during the v2 port. The window is now a pure manual editor:
 * expression textarea, source→destination viz, save/cancel.
 *
 * To restore AI behavior: re-add `useAiMode` from ./AiModeContext,
 * `generateAiResponse` + `AI_GENERATION_DELAY_MS` from ./ai/mockAiResponses,
 * the AI state machine (aiState / aiPrompt / aiResult / refinePrompt),
 * the sparkle (✦) toolbar button, and the directed + conversational
 * conditional render blocks. The original implementation lives at
 * `legacy-prototype-work/prototype-legacy/src/components/field-mapping/TransformationWindow.tsx`
 * if you need to lift it verbatim.
 */

import { useState } from 'react'
import type { FieldMapping } from '../../../data/field-mappings'

type WindowSize = 'normal' | 'minimized' | 'expanded'

interface TransformationWindowProps {
  mapping: FieldMapping
  onSave: (expression: string) => void
  onClose: () => void
}

export default function TransformationWindow({ mapping, onSave, onClose }: TransformationWindowProps) {
  const [size, setSize] = useState<WindowSize>('normal')
  const [expression, setExpression] = useState(mapping.transformation || '')

  const width = size === 'expanded' ? 900 : 640
  const height = size === 'minimized' ? 48 : 816

  // Minimized state
  if (size === 'minimized') {
    return (
      <div
        className="fixed bottom-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg flex items-center px-4 cursor-pointer hover:shadow-xl transition-shadow"
        style={{ width: 300, height }}
        onClick={() => setSize('normal')}
      >
        <span className="text-sm font-medium text-gray-700 truncate flex-1">{mapping.fqFieldName}</span>
        <button className="text-gray-400 hover:text-gray-600 ml-2">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-50 bg-white border border-gray-200 rounded-xl shadow-2xl flex flex-col overflow-hidden"
      style={{ width, height, maxHeight: 'calc(100vh - 100px)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
        <span className="text-sm font-semibold text-gray-900">{mapping.fqFieldName}</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSize('minimized')}
            className="text-gray-400 hover:text-gray-600 p-1"
            title="Minimize"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <button
            onClick={() => setSize(size === 'expanded' ? 'normal' : 'expanded')}
            className="text-gray-400 hover:text-gray-600 p-1"
            title={size === 'expanded' ? 'Shrink' : 'Expand'}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1.5 5V1.5H5M9 1.5H12.5V5M12.5 9V12.5H9M5 12.5H1.5V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
            title="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Source → Destination visualization */}
      <div className="px-5 py-4 flex items-center gap-4">
        {mapping.sourceFields.length > 0 && (
          <>
            {/* fx icon for multi-field */}
            {mapping.sourceFields.length > 1 && expression && (
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-500 text-xs font-mono font-bold shrink-0">
                fx
              </div>
            )}
            <div className="flex-1 border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Source</div>
              <div className="flex flex-wrap gap-1.5">
                {mapping.sourceFields.map(sf => (
                  <span key={sf.id} className="text-sm text-gray-700">
                    {sf.name} <span className="text-gray-400 text-xs">({sf.dataType})</span>
                  </span>
                ))}
              </div>
            </div>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 text-gray-300">
              <path d="M4 10H16M16 10L12 6M16 10L12 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="flex-1 border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-400 mb-1">Destination</div>
              <div className="text-sm text-gray-700">
                {mapping.fqFieldName} <span className="text-gray-400 text-xs">({mapping.dataType})</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Expression editor */}
      <div className="px-5 flex-1 flex flex-col min-h-0">
        <div className="text-sm font-medium text-gray-900 mb-2">Transformation Expression</div>
        <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden flex flex-col min-h-[200px]">
          <div className="flex-1 flex">
            {/* Line numbers */}
            <div className="bg-gray-50 px-2 py-3 text-right text-xs text-gray-400 font-mono select-none border-r border-gray-100" style={{ minWidth: 32 }}>
              {(expression || '\n').split('\n').map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="Enter transformation expression..."
              className="flex-1 px-3 py-3 text-sm font-mono resize-none focus:outline-none bg-white"
            />
          </div>

          {/* Bottom toolbar — manual editing only. The AI sparkle (✦) button
              was here in the original; restore it (alongside its AI state)
              when AI features come back online. */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2">
              <button className="text-gray-400 hover:text-gray-600 text-sm font-mono font-bold" title="Function library">
                fx
              </button>
            </div>
            <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded px-2.5 py-1">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4 6L6 8L11 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Test Expression
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-100 mt-auto">
        <button
          onClick={onClose}
          className="text-sm text-gray-600 hover:text-gray-800 px-4 py-2"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(expression)}
          className={`text-sm text-white px-4 py-2 rounded-md transition-colors ${
            expression.trim()
              ? 'bg-emerald-600 hover:bg-emerald-700'
              : 'bg-emerald-300 cursor-not-allowed'
          }`}
          disabled={!expression.trim()}
        >
          Save
        </button>
      </div>
    </div>
  )
}
