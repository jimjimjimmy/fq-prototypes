import { useState } from 'react'
import type { FieldMapping } from '../../../data/field-mappings'
import { generateAiResponse, AI_GENERATION_DELAY_MS } from './mockAiResponses'

interface ConversationalAiPanelProps {
  mapping: FieldMapping
  onInsert: (expression: string) => void
  onClose: () => void
}

type PanelState = 'prompt' | 'generating' | 'result'

export default function ConversationalAiPanel({
  mapping,
  onInsert,
  onClose,
}: ConversationalAiPanelProps) {
  const [state, setState] = useState<PanelState>('prompt')
  const [chatInput, setChatInput] = useState('')
  const [result, setResult] = useState('')

  const sourceFieldNames = mapping.sourceFields.map(f => f.name)

  const suggestions = mapping.sourceFields.length >= 2
    ? [
        `Combine ${sourceFieldNames[0]} and ${sourceFieldNames[1]}`,
        'Convert to uppercase',
        'Remove special characters',
      ]
    : [
        'Convert to uppercase',
        'Trim whitespace',
        'Format as date',
      ]

  function handleGenerate(prompt: string) {
    setState('generating')
    setTimeout(() => {
      const response = generateAiResponse(prompt, sourceFieldNames)
      setResult(response.expression)
      setState('result')
    }, AI_GENERATION_DELAY_MS)
  }

  return (
    <div className="border border-purple-200 rounded-lg overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-purple-600">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white">
          <path d="M8 1L9.5 5.5L14 7L9.5 8.5L8 13L6.5 8.5L2 7L6.5 5.5L8 1Z" fill="currentColor"/>
        </svg>
        <span className="text-sm font-medium text-white">FloQast AI Assistant</span>
        <button onClick={onClose} className="ml-auto text-purple-200 hover:text-white">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="p-4 bg-purple-50/30">
        {/* Source field chips */}
        {mapping.sourceFields.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {mapping.sourceFields.map(sf => (
              <span key={sf.id} className="px-2 py-0.5 bg-white border border-gray-200 rounded text-xs text-gray-600">
                {sf.name}
              </span>
            ))}
          </div>
        )}

        {/* Context badge */}
        <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-500 mb-3">
          Row: {mapping.fqFieldName}
        </div>

        {state === 'prompt' && (
          <>
            <p className="text-sm text-gray-600 mb-3">
              What would you like to do with the selected source fields?
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleGenerate(s)}
                  className="px-3 py-1.5 bg-white border border-purple-200 rounded-full text-xs text-purple-700 hover:bg-purple-50 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </>
        )}

        {state === 'generating' && (
          <div className="flex items-center gap-3 py-4 justify-center">
            <div className="animate-spin w-5 h-5 border-2 border-purple-300 border-t-purple-600 rounded-full" />
            <span className="text-sm text-purple-600">Thinking...</span>
          </div>
        )}

        {state === 'result' && (
          <div className="mb-3">
            <div className="border border-purple-200 rounded-md p-3 bg-white font-mono text-sm text-gray-800 mb-2">
              {result}
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => { setState('prompt'); setResult('') }}
                className="text-xs text-purple-600 hover:text-purple-700 px-2 py-1"
              >
                Try again
              </button>
              <button
                onClick={() => onInsert(result)}
                className="text-sm text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-md transition-colors"
              >
                Insert
              </button>
            </div>
          </div>
        )}

        {/* Chat input */}
        <div className="flex gap-2">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Write a prompt..."
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-400 bg-white"
            onKeyDown={e => {
              if (e.key === 'Enter' && chatInput.trim()) {
                handleGenerate(chatInput)
                setChatInput('')
              }
            }}
          />
          <button
            onClick={() => {
              if (chatInput.trim()) {
                handleGenerate(chatInput)
                setChatInput('')
              }
            }}
            className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14 2L7 9M14 2L10 14L7 9M14 2L2 6L7 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
