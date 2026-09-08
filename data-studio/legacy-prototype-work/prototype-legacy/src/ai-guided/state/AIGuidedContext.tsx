import { createContext, useContext, useEffect, useRef, useState, useCallback, type ReactNode } from 'react'
import type { Connector, Model, ChatMessage } from '../types'
import { SCENARIO } from '../script/scenario'

export type CanvasTab = 'catalog' | 'connectors' | 'dimensions' | 'logs'

type AIGuidedState = {
  // World state (what's on the canvas)
  connectors: Connector[]
  models: Model[]

  // Canvas navigation state (shared between chat & user clicks)
  hasStarted: boolean
  activeTab: CanvasTab
  creatingConnector: boolean
  connectorTypeSelected: boolean

  // Chat state
  messages: ChatMessage[]
  chatOpen: boolean

  // Mutations
  addConnector: (c: Connector) => void
  updateConnector: (id: string, patch: Partial<Connector>) => void
  addModel: (m: Model) => void
  appendMessage: (m: ChatMessage) => void
  setChatOpen: (open: boolean) => void
  setHasStarted: (v: boolean) => void
  setActiveTab: (t: CanvasTab) => void
  setCreatingConnector: (v: boolean) => void
  setConnectorTypeSelected: (v: boolean) => void
  reset: () => void
}

const Ctx = createContext<AIGuidedState | null>(null)

export function AIGuidedProvider({ children }: { children: ReactNode }) {
  const [connectors, setConnectors] = useState<Connector[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [chatOpen, setChatOpen] = useState(true)
  const [hasStarted, setHasStarted] = useState(false)
  const [activeTab, setActiveTab] = useState<CanvasTab>('connectors')
  const [creatingConnector, setCreatingConnectorRaw] = useState(false)
  const [connectorTypeSelected, setConnectorTypeSelected] = useState(false)

  const setCreatingConnector = useCallback((v: boolean) => {
    setCreatingConnectorRaw(v)
    if (!v) setConnectorTypeSelected(false)
  }, [])

  const addConnector = useCallback((c: Connector) => {
    setConnectors((prev) => [...prev, c])
  }, [])

  const updateConnector = useCallback((id: string, patch: Partial<Connector>) => {
    setConnectors((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }, [])

  const addModel = useCallback((m: Model) => {
    setModels((prev) => [...prev, m])
  }, [])

  const appendMessage = useCallback((m: ChatMessage) => {
    setMessages((prev) => [...prev, m])
  }, [])

  // Auto-welcome on first mount — runs exactly once even if useChatScript
  // is called from multiple components.
  const didWelcomeRef = useRef(false)
  useEffect(() => {
    if (didWelcomeRef.current) return
    didWelcomeRef.current = true
    if (messages.length > 0) return
    const step = SCENARIO.welcome
    step.aiMessages.forEach((m, i) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `m-init-${i}-${Math.random().toString(36).slice(2, 7)}`,
          role: 'ai',
          timestamp: Date.now() + i,
          ...m,
        },
      ])
    })
  }, [messages.length])

  const reset = useCallback(() => {
    setConnectors([])
    setModels([])
    setMessages([])
    setChatOpen(true)
    setHasStarted(false)
    setActiveTab('connectors')
    setCreatingConnectorRaw(false)
    setConnectorTypeSelected(false)
  }, [])

  return (
    <Ctx.Provider
      value={{
        connectors,
        models,
        messages,
        chatOpen,
        hasStarted,
        activeTab,
        creatingConnector,
        connectorTypeSelected,
        addConnector,
        updateConnector,
        addModel,
        appendMessage,
        setChatOpen,
        setHasStarted,
        setActiveTab,
        setCreatingConnector,
        setConnectorTypeSelected,
        reset,
      }}
    >
      {children}
    </Ctx.Provider>
  )
}

export function useAIGuided() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAIGuided must be used within AIGuidedProvider')
  return v
}
