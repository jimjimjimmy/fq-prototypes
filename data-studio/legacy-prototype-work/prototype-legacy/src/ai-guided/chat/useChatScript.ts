import { useCallback } from 'react'
import { useAIGuided, type CanvasTab } from '../state/AIGuidedContext'
import { SCENARIO } from '../script/scenario'
import { matchKeyword } from '../script/keywords'
import type { ChatMessage, ScenarioStepId } from '../types'

/**
 * When the AI advances to one of these steps, also nudge the canvas so the
 * user can see what the conversation is about. User remains free to navigate
 * away after; this only fires on the moment the step runs.
 */
const STEP_SIDE_EFFECTS: Partial<
  Record<ScenarioStepId, { activeTab?: CanvasTab; hasStarted?: boolean; creatingConnector?: boolean }>
> = {
  'offer-create-connector': { activeTab: 'connectors', hasStarted: true },
  'ask-data-type': { activeTab: 'connectors', hasStarted: true },
  'connector-type': { activeTab: 'connectors', hasStarted: true, creatingConnector: true },
  'connector-form-opened': { activeTab: 'connectors', hasStarted: true, creatingConnector: true },
  'connector-created': { activeTab: 'connectors', hasStarted: true },
  'offer-entity-mapping': { activeTab: 'connectors', hasStarted: true },
  'offer-create-model': { activeTab: 'catalog', hasStarted: true },
  'model-created': { activeTab: 'catalog', hasStarted: true },
}

function nextId() {
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

/**
 * Drives the scripted conversation. Safe to call from multiple components —
 * auto-welcome runs once inside AIGuidedProvider, not here.
 */
export function useChatScript() {
  const { appendMessage, setActiveTab, setHasStarted, setCreatingConnector } = useAIGuided()

  const emitStep = useCallback(
    (stepId: ScenarioStepId) => {
      const step = SCENARIO[stepId]
      if (!step) return
      step.aiMessages.forEach((m) => {
        const msg: ChatMessage = {
          id: nextId(),
          role: 'ai',
          timestamp: Date.now(),
          ...m,
        }
        appendMessage(msg)
      })
      const sideEffect = STEP_SIDE_EFFECTS[stepId]
      if (sideEffect?.hasStarted) setHasStarted(true)
      if (sideEffect?.activeTab) setActiveTab(sideEffect.activeTab)
      if (sideEffect?.creatingConnector) setCreatingConnector(true)
    },
    [appendMessage, setActiveTab, setHasStarted, setCreatingConnector],
  )

  const sendUserQuickReply = useCallback(
    (label: string, advanceTo?: ScenarioStepId) => {
      appendMessage({
        id: nextId(),
        role: 'user',
        text: label,
        timestamp: Date.now(),
      })
      if (advanceTo) {
        // Small delay so the user message renders first
        window.setTimeout(() => emitStep(advanceTo), 250)
      }
    },
    [appendMessage, emitStep],
  )

  const sendUserText = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return
      appendMessage({
        id: nextId(),
        role: 'user',
        text: trimmed,
        timestamp: Date.now(),
      })
      const matched = matchKeyword(trimmed)
      window.setTimeout(() => {
        if (matched) {
          emitStep(matched)
        } else {
          // Generic fallback — acknowledge and nudge toward next action.
          appendMessage({
            id: nextId(),
            role: 'ai',
            timestamp: Date.now(),
            text: "I'm a scripted prototype for now, so I can't fully parse that — but I can help with any of these:",
            quickReplies: [
              { id: 'cc', label: 'Create a connector', advanceTo: 'offer-create-connector' },
              { id: 'cm', label: 'Create a model', advanceTo: 'offer-create-model' },
              { id: 'help', label: 'Show me around', advanceTo: 'generic-help' },
            ],
          })
        }
      }, 250)
    },
    [appendMessage, emitStep],
  )

  return { emitStep, sendUserQuickReply, sendUserText }
}
