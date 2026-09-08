import { useState } from 'react'
import { useAiMode } from '../../context/AiModeContext'
import type { FieldMapping } from '../../data/field-mappings'
import { generateAiResponse, AI_GENERATION_DELAY_MS } from './ai/mockAiResponses'

type WindowSize = 'normal' | 'minimized' | 'expanded'
type AiState = 'idle' | 'input' | 'generating' | 'generated' | 'refining'

interface TransformationWindowProps {
  mapping: FieldMapping
  onSave: (expression: string) => void
  onClose: () => void
}

export default function TransformationWindow({ mapping, onSave, onClose }: TransformationWindowProps) {
  const [size, setSize] = useState<WindowSize>('normal')
  const [expression, setExpression] = useState(mapping.transformation || '')
  const { aiMode } = useAiMode()

  // AI state
  const [aiState, setAiState] = useState<AiState>('idle')
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiResult, setAiResult] = useState('')
  const [refinePrompt, setRefinePrompt] = useState('')

  const sourceFieldNames = mapping.sourceFields.map(f => f.name)
  const width = size === 'expanded' ? 900 : 640
  const height = size === 'minimized' ? 48 : 816

  function handleGenerate(prompt: string) {
    setAiState('generating')
    setTimeout(() => {
      const response = generateAiResponse(prompt, sourceFieldNames)
      setAiResult(response.expression)
      setAiState('generated')
    }, AI_GENERATION_DELAY_MS)
  }

  function handleInsert() {
    setExpression(prev => prev ? `${prev} | ${aiResult}` : aiResult)
    setAiState('idle')
    setAiPrompt('')
    setAiResult('')
  }

  function handleRefine() {
    setAiState('generating')
    setTimeout(() => {
      const response = generateAiResponse(refinePrompt || aiPrompt, sourceFieldNames)
      setAiResult(response.expression)
      setAiState('generated')
      setRefinePrompt('')
    }, AI_GENERATION_DELAY_MS)
  }

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

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2">
              <button className="text-gray-400 hover:text-gray-600 text-sm font-mono font-bold" title="Function library">
                fx
              </button>
              <button
                onClick={() => setAiState(aiState === 'idle' ? 'input' : 'idle')}
                className={`transition-colors ${aiState !== 'idle' ? 'text-purple-500' : 'text-gray-400 hover:text-purple-500'}`}
                title="AI assistant"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L9.5 5.5L14 7L9.5 8.5L8 13L6.5 8.5L2 7L6.5 5.5L8 1Z" fill="currentColor"/>
                </svg>
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

        {/* AI section — Directed mode */}
        {aiMode === 'directed' && aiState !== 'idle' && (
          <div className="mt-3 border-2 border-purple-200 rounded-lg p-4 bg-purple-50/30">
            {aiState === 'input' && (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-purple-500">
                    <path d="M8 1L9.5 5.5L14 7L9.5 8.5L8 13L6.5 8.5L2 7L6.5 5.5L8 1Z" fill="currentColor"/>
                  </svg>
                  <span className="text-sm font-medium text-purple-800">Use AI to Write Transformation</span>
                  <button onClick={() => setAiState('idle')} className="ml-auto text-purple-400 hover:text-purple-600">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Describe the transformation you'd like to generate"
                    className="flex-1 px-3 py-2 text-sm border border-purple-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-400 bg-white"
                    onKeyDown={e => e.key === 'Enter' && aiPrompt.trim() && handleGenerate(aiPrompt)}
                  />
                  <button
                    onClick={() => handleGenerate(aiPrompt)}
                    disabled={!aiPrompt.trim()}
                    className="px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Generate
                  </button>
                </div>
              </>
            )}

            {aiState === 'generating' && (
              <div className="flex items-center gap-3 py-4 justify-center">
                <div className="animate-spin w-5 h-5 border-2 border-purple-300 border-t-purple-600 rounded-full" />
                <span className="text-sm text-purple-600">Generating transformation...</span>
              </div>
            )}

            {aiState === 'generated' && (
              <>
                <div className="flex items-center gap-2 mb-3">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-purple-500">
                    <path d="M8 1L9.5 5.5L14 7L9.5 8.5L8 13L6.5 8.5L2 7L6.5 5.5L8 1Z" fill="currentColor"/>
                  </svg>
                  <span className="text-sm font-medium text-purple-800">AI Generated</span>
                </div>
                <div className="border-2 border-dashed border-purple-300 rounded-md p-3 bg-white font-mono text-sm text-gray-800 mb-3">
                  {aiResult}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button className="text-gray-400 hover:text-emerald-500" title="Thumbs up">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5 14V7L8 2L9.5 2.5L8.5 7H13.5L12 14H5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                    </button>
                    <button className="text-gray-400 hover:text-red-500" title="Thumbs down">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11 2V9L8 14L6.5 13.5L7.5 9H2.5L4 2H11Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAiState('refining')}
                      className="text-sm text-purple-600 hover:text-purple-700 px-3 py-1.5 border border-purple-200 rounded-md"
                    >
                      Refine
                    </button>
                    <button
                      onClick={handleInsert}
                      className="text-sm text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-md transition-colors"
                    >
                      Insert
                    </button>
                  </div>
                </div>
              </>
            )}

            {aiState === 'refining' && (
              <>
                <div className="border-2 border-dashed border-purple-300 rounded-md p-3 bg-white font-mono text-sm text-gray-800 mb-3">
                  {aiResult}
                </div>
                <div className="flex gap-2">
                  <input
                    value={refinePrompt}
                    onChange={(e) => setRefinePrompt(e.target.value)}
                    placeholder="Add context to refine results"
                    className="flex-1 px-3 py-2 text-sm border border-purple-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-400 bg-white"
                    onKeyDown={e => e.key === 'Enter' && handleRefine()}
                  />
                  <button
                    onClick={handleRefine}
                    className="px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Refine
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* AI section — Conversational mode */}
        {aiMode === 'conversational' && aiState !== 'idle' && (
          <ConversationalSection
            mapping={mapping}
            aiResult={aiResult}
            aiState={aiState}
            onGenerate={handleGenerate}
            onInsert={handleInsert}
            onClose={() => { setAiState('idle'); setAiResult('') }}
          />
        )}
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

// Conversational AI sub-section within TransformationWindow
function ConversationalSection({
  mapping,
  aiResult,
  aiState,
  onGenerate,
  onInsert,
  onClose,
}: {
  mapping: FieldMapping
  aiResult: string
  aiState: AiState
  onGenerate: (prompt: string) => void
  onInsert: () => void
  onClose: () => void
}) {
  const [chatInput, setChatInput] = useState('')
  const sourceFieldNames = mapping.sourceFields.map(f => f.name)

  const suggestions = mapping.sourceFields.length >= 2
    ? [
        `Combine ${sourceFieldNames[0]} and ${sourceFieldNames[1]}`,
        `Convert to uppercase`,
        `Remove special characters`,
      ]
    : [
        'Convert to uppercase',
        'Trim whitespace',
        'Format as date',
      ]

  return (
    <div className="mt-3 border border-purple-200 rounded-lg overflow-hidden">
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
        {/* Source field context */}
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
        <div className="text-xs text-gray-400 mb-2">
          Row: {mapping.fqFieldName}
        </div>

        {aiState === 'input' && (
          <>
            <p className="text-sm text-gray-600 mb-3">What would you like to do with the selected source fields?</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => onGenerate(s)}
                  className="px-3 py-1.5 bg-white border border-purple-200 rounded-full text-xs text-purple-700 hover:bg-purple-50 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </>
        )}

        {aiState === 'generating' && (
          <div className="flex items-center gap-3 py-4 justify-center">
            <div className="animate-spin w-5 h-5 border-2 border-purple-300 border-t-purple-600 rounded-full" />
            <span className="text-sm text-purple-600">Thinking...</span>
          </div>
        )}

        {aiState === 'generated' && (
          <div className="mb-3">
            <div className="border border-purple-200 rounded-md p-3 bg-white font-mono text-sm text-gray-800 mb-2">
              {aiResult}
            </div>
            <div className="flex justify-end">
              <button
                onClick={onInsert}
                className="text-sm text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-md transition-colors"
              >
                Insert
              </button>
            </div>
          </div>
        )}

        {/* Chat input */}
        <div className="flex gap-2 mt-2">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Write a prompt..."
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-400 bg-white"
            onKeyDown={e => {
              if (e.key === 'Enter' && chatInput.trim()) {
                onGenerate(chatInput)
                setChatInput('')
              }
            }}
          />
          <button
            onClick={() => {
              if (chatInput.trim()) {
                onGenerate(chatInput)
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
