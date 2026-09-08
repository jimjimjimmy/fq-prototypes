import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useAIGuided } from '../state/AIGuidedContext'
import { useChatScript } from './useChatScript'
import ChatMessage from './ChatMessage'
import type { QuickReply } from '../types'

export default function ChatPanel() {
  const { messages, setChatOpen } = useAIGuided()
  const { sendUserQuickReply, sendUserText } = useChatScript()
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages.length])

  const handleQuickReply = (qr: QuickReply) => {
    sendUserQuickReply(qr.label, qr.advanceTo)
  }

  const handleSubmit = () => {
    if (!input.trim()) return
    sendUserText(input)
    setInput('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <aside className="flex flex-col h-full w-[380px] bg-[#f8fafc] border-l border-[#e1e6ef]">
      {/* Header */}
      <div className="flex items-center justify-between h-[50px] px-4 border-b border-[#e1e6ef] bg-white shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#16a34a] to-[#186749] flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z" />
            </svg>
          </div>
          <span className="text-[13px] font-semibold text-[#1d2433]">FloQast Assistant</span>
        </div>
        <button
          onClick={() => setChatOpen(false)}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#f1f3f9] text-[#8b91a3]"
          aria-label="Minimize chat"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} onQuickReply={handleQuickReply} />
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-[#e1e6ef] bg-white p-3 shrink-0">
        <div className="flex items-end gap-2 rounded-[10px] border border-[#cbd2e1] bg-white focus-within:border-[#8b91a3] transition-colors px-2.5 py-1.5">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question…"
            rows={1}
            className="flex-1 resize-none bg-transparent text-[13px] leading-[1.5] text-[#1d2433] placeholder:text-[#adb2bb] focus:outline-none max-h-[100px]"
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="w-7 h-7 shrink-0 rounded-full bg-[#1d2433] text-white flex items-center justify-center hover:bg-[#2d3748] disabled:bg-[#cbd2e1] disabled:cursor-not-allowed transition-colors"
            aria-label="Send"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-[#adb2bb] mt-1.5 px-1">
          Prototype — responses are scripted.
        </p>
      </div>
    </aside>
  )
}
