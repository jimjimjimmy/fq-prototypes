import { useAIGuided } from '../state/AIGuidedContext'

export default function ChatFloatingButton() {
  const { setChatOpen, messages } = useAIGuided()
  const hasUnread = messages.length > 0 && messages[messages.length - 1].role === 'ai'

  return (
    <button
      onClick={() => setChatOpen(true)}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full bg-gradient-to-br from-[#16a34a] to-[#186749] text-white shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="w-5 h-5 flex items-center justify-center">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z" />
        </svg>
      </div>
      <span className="text-[13px] font-semibold">Ask AI</span>
      {hasUnread && (
        <span className="w-2 h-2 rounded-full bg-white ml-0.5 animate-pulse" />
      )}
    </button>
  )
}
