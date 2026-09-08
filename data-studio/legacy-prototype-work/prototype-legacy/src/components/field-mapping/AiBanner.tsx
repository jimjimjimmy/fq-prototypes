import { useState } from 'react'

export default function AiBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div className="flex items-center px-4 py-2 rounded-[6px] bg-[#f8f5ff] border border-solid border-[#8b54f7]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Purple sparkle icon */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0 text-violet-500">
          <path d="M12 2L13.8 9.2L21 11L13.8 12.8L12 20L10.2 12.8L3 11L10.2 9.2L12 2Z" fill="currentColor"/>
          <path d="M18 1L18.9 3.9L22 5L18.9 6.1L18 9L17.1 6.1L14 5L17.1 3.9L18 1Z" fill="currentColor" opacity="0.6"/>
        </svg>
        <span className="font-semibold text-[12px] text-[#1b1f27] leading-[16px] shrink-0 whitespace-nowrap">FloQast AI Assistant</span>
        <span className="text-[12px] text-[#1d2433] leading-[18px] truncate">
          We've automatically mapped <span className="font-bold">20</span> fields below. Review to make changes or{' '}
          <span className="underline font-semibold leading-[16px] cursor-pointer hover:text-violet-700">ask AI to adjust them</span>.
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 flex items-center justify-center px-3 py-2 rounded-[6px] text-[#6b7280] hover:text-[#1d2433] transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  )
}
