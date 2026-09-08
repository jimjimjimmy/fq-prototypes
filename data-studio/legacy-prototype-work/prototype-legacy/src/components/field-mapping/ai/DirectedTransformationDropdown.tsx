import { useState } from 'react'
import { generateAiResponse, AI_GENERATION_DELAY_MS } from './mockAiResponses'

interface DirectedTransformationDropdownProps {
  sourceFieldNames: string[]
  onInsert: (expression: string) => void
  onClose: () => void
}

const FUNCTION_SUGGESTIONS = [
  { name: 'trim()', description: 'Remove leading and trailing whitespace' },
  { name: 'concat(value)', description: 'Concatenate with another value' },
  { name: 'removeSpecialChars()', description: 'Remove special characters' },
]

export default function DirectedTransformationDropdown({
  sourceFieldNames,
  onInsert,
  onClose,
}: DirectedTransformationDropdownProps) {
  const [aiPrompt, setAiPrompt] = useState('')
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  function handleGenerate() {
    if (!aiPrompt.trim()) return
    setGenerating(true)
    setTimeout(() => {
      const response = generateAiResponse(aiPrompt, sourceFieldNames)
      setResult(response.expression)
      setGenerating(false)
    }, AI_GENERATION_DELAY_MS)
  }

  return (
    <div className="w-full bg-white border border-[#e1e6ef] rounded-[6px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] flex flex-col gap-[4px] overflow-clip">
      {/* AI input section */}
      <div className="bg-[#f8f5ff] border border-[#e1e6ef] flex flex-col p-[16px] w-full shrink-0">
        {!result && !generating && (
          <button
            onClick={() => {
              const el = document.querySelector<HTMLInputElement>('[data-ai-prompt-input]')
              if (el) el.focus()
            }}
            className="flex gap-[12px] items-center w-full bg-white border border-[#e1e6ef] rounded-[6px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-[8px] overflow-clip cursor-pointer font-[family-name:'Inter',sans-serif]"
          >
            <div className="flex flex-[1_0_0] gap-[4px] items-center min-h-px min-w-px">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
                <path d="M10 1.5L11.8 6.8L17.5 8.5L11.8 10.2L10 15.5L8.2 10.2L2.5 8.5L8.2 6.8L10 1.5Z" fill="#9e70fa"/>
              </svg>
              <input
                data-ai-prompt-input
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                placeholder="Use AI to generate a transformation expression"
                className="flex-[1_0_0] text-[12px] leading-[16px] text-[#1d2433] placeholder-[#adb2bb] bg-transparent outline-none min-w-0 font-[family-name:'Inter',sans-serif]"
                onKeyDown={e => e.key === 'Enter' && handleGenerate()}
              />
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleGenerate() }}
              disabled={!aiPrompt.trim()}
              className="shrink-0 size-[26px] flex items-center justify-center bg-[rgba(158,112,250,0.3)] rounded-[6px] overflow-clip disabled:opacity-40"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 12V4M8 4L4.5 7.5M8 4L11.5 7.5" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </button>
        )}
        {generating && (
          <div className="flex items-center gap-[12px] w-full bg-white border border-[#e1e6ef] rounded-[6px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] p-[8px] overflow-clip">
            <div className="animate-spin w-5 h-5 border-2 border-purple-300 border-t-purple-600 rounded-full shrink-0" />
            <span className="text-[12px] leading-[16px] text-purple-600">Generating...</span>
          </div>
        )}
        {result && (
          <div>
            <div className="text-[12px] font-mono bg-purple-50 border border-purple-200 rounded-[6px] px-2 py-1.5 mb-2">{result}</div>
            <button
              onClick={() => { onInsert(result); onClose() }}
              className="w-full text-[12px] text-white bg-emerald-600 hover:bg-emerald-700 py-1.5 rounded-[6px] transition-colors"
            >
              Insert
            </button>
          </div>
        )}
      </div>

      {/* Function suggestions */}
      {!result && !generating && (
        <div>
          {FUNCTION_SUGGESTIONS.map(fn => (
            <button
              key={fn.name}
              onClick={() => { onInsert(fn.name); onClose() }}
              className="w-full text-left flex h-[45px] items-center p-[16px] hover:bg-gray-50 transition-colors font-[family-name:'Inter',sans-serif] font-normal"
            >
              <div className="flex flex-[1_0_0] gap-[8px] h-[32px] items-start min-h-px min-w-px">
                <div className="flex flex-[1_0_0] flex-col h-full text-ellipsis whitespace-nowrap">
                  <p className="text-[12px] leading-[18px] text-[#424867] overflow-hidden w-full">{fn.name}</p>
                  <p className="text-[10px] leading-[14px] text-[#6b7280] overflow-hidden w-full">{fn.description}</p>
                </div>
              </div>
            </button>
          ))}
          <button className="w-full text-left flex h-[45px] items-center px-[16px] py-[12px] gap-[8px] hover:bg-gray-50 font-[family-name:'Inter',sans-serif]">
            <span className="flex-[1_0_0] text-[11px] font-semibold leading-[16px] text-[#3d7bf7] text-ellipsis whitespace-nowrap overflow-hidden">
              More Options...
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
