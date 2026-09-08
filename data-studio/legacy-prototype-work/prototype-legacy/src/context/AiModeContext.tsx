/* eslint-disable react-refresh/only-export-components -- context + hook co-located by design */
import { createContext, useContext, useState, type ReactNode } from 'react'
import type { AiMode } from '../components/shared/DevToolbar'

interface AiModeContextValue {
  aiMode: AiMode
  setAiMode: (mode: AiMode) => void
}

const AiModeContext = createContext<AiModeContextValue | null>(null)

export function AiModeProvider({ children }: { children: ReactNode }) {
  const [aiMode, setAiMode] = useState<AiMode>('directed')
  return (
    <AiModeContext.Provider value={{ aiMode, setAiMode }}>
      {children}
    </AiModeContext.Provider>
  )
}

export function useAiMode(): AiModeContextValue {
  const ctx = useContext(AiModeContext)
  if (!ctx) throw new Error('useAiMode must be used within AiModeProvider')
  return ctx
}
