import type { ChatMessage as ChatMessageType, QuickReply } from '../types'

type Props = {
  message: ChatMessageType
  onQuickReply: (reply: QuickReply) => void
}

function renderText(text: string) {
  // Minimal markdown: **bold** and _italic_
  const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith('_') && part.endsWith('_')) {
      return (
        <em key={i} className="italic text-[#6b7280]">
          {part.slice(1, -1)}
        </em>
      )
    }
    return <span key={i}>{part}</span>
  })
}

export default function ChatMessage({ message, onQuickReply }: Props) {
  const isAi = message.role === 'ai'

  return (
    <div className={`flex flex-col gap-2 ${isAi ? 'items-start' : 'items-end'}`}>
      {message.text && (
        <div
          className={`max-w-[90%] rounded-[10px] px-3 py-2 text-[13px] leading-[1.5] whitespace-pre-wrap ${
            isAi
              ? 'bg-white border border-[#e1e6ef] text-[#1d2433]'
              : 'bg-[#eaf3ee] text-[#1d2433]'
          }`}
        >
          {renderText(message.text)}
        </div>
      )}

      {message.quickReplies && message.quickReplies.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {message.quickReplies.map((qr) => (
            <button
              key={qr.id}
              onClick={() => onQuickReply(qr)}
              className="text-[12px] px-2.5 py-1 rounded-[14px] border border-[#cbd2e1] bg-white text-[#424867] hover:bg-[#f8fafc] hover:border-[#8b91a3] transition-colors"
            >
              {qr.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
