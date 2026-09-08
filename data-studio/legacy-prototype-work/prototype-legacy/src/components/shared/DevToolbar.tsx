import { useState } from 'react'

export type AiMode = 'directed' | 'conversational'

interface DevToolbarProps {
  mode: AiMode
  onModeChange: (mode: AiMode) => void
}

export default function DevToolbar({ mode, onModeChange }: DevToolbarProps) {
  const [minimized, setMinimized] = useState(false)

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
      >
        AI: {mode === 'directed' ? 'Directed' : 'Chat'}
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white rounded-lg shadow-lg p-3 w-52">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-400">AI Mode</span>
        <button
          onClick={() => setMinimized(true)}
          className="text-gray-400 hover:text-white text-xs"
        >
          —
        </button>
      </div>
      <div className="flex flex-col gap-1">
        <button
          onClick={() => onModeChange('directed')}
          className={`text-left px-3 py-1.5 rounded text-xs transition-colors ${
            mode === 'directed'
              ? 'bg-green-700 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          Directed Inline
        </button>
        <button
          onClick={() => onModeChange('conversational')}
          className={`text-left px-3 py-1.5 rounded text-xs transition-colors ${
            mode === 'conversational'
              ? 'bg-green-700 text-white'
              : 'text-gray-300 hover:bg-gray-800'
          }`}
        >
          Conversational Chat
        </button>
      </div>
    </div>
  )
}
