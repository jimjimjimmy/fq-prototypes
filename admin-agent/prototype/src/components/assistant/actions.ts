/**
 * Assisted-action registry — the SINGLE SOURCE OF TRUTH for the AI actions a
 * user can launch. The MVP assistant panel and the Getting Started cards both
 * launch from here, so a given action always opens the same AI Assistant flow
 * with the same intent (ChatSeed).
 */
import type { ComponentType } from 'react'
// @ts-ignore — FlowUI is a JS package; skipLibCheck covers node_modules
import AutoAwesome from '@floqastinc/flow-ui_icons/material/AutoAwesome'
import type { ChatSeed } from '../AssistChat'
import { createUsersSeed, createEntityWorkflowSeed, genericSeed } from '../seeds'

export type ActionId = 'invite-users' | 'create-entities'

/** AI button treatments, kept continuous with the prior assistant panel. */
export type AiButtonVariant = 'ai-primary' | 'ai-ghost'

type IconComponent = ComponentType<{ size?: number; color?: string }>

/**
 * A generic assisted action. `intent` builds the ChatSeed that launches it;
 * `source` is an optional provenance label (e.g. "Getting started · Invite
 * users") that flows into the chat's Context chip. Callers without provenance
 * (the assistant panel) call intent() with no argument.
 */
export interface AssistedAction {
  id: string
  label: string
  icon: IconComponent
  variant: AiButtonVariant
  intent: (source?: string) => ChatSeed
}

export const ASSISTED_ACTIONS: Record<ActionId, AssistedAction> = {
  'invite-users': {
    id: 'invite-users',
    label: 'Invite users',
    icon: AutoAwesome,
    variant: 'ai-primary',
    intent: (source?: string) => createUsersSeed(source),
  },
  'create-entities': {
    id: 'create-entities',
    label: 'Create entities',
    icon: AutoAwesome,
    variant: 'ai-primary',
    intent: (source?: string) => createEntityWorkflowSeed(source),
  },
}

/** The exactly-two MVP actions, in display order. */
export const MVP_ACTION_IDS: ActionId[] = ['invite-users', 'create-entities']
export const MVP_ACTIONS: AssistedAction[] = MVP_ACTION_IDS.map((id) => ASSISTED_ACTIONS[id])

/** Future Ideation: the broader action set the assistants surface today. */
function fiAction(id: string, label: string, intent: () => ChatSeed): AssistedAction {
  return { id, label, icon: AutoAwesome, variant: 'ai-ghost', intent }
}

export const FUTURE_IDEATION_ACTIONS: AssistedAction[] = [
  ASSISTED_ACTIONS['create-entities'],
  ASSISTED_ACTIONS['invite-users'],
  fiAction('manage-users', 'Manage users', () => genericSeed('Manage Users', 'Users & Roles', 'users')),
  fiAction('create-workflows', 'Create workflows', () => genericSeed('Create Workflows', 'Workflows & Entities')),
  fiAction('manage-workflows', 'Manage workflows', () => genericSeed('Manage Workflows', 'Workflows & Entities')),
  fiAction('manage-entities', 'Manage entities', () => genericSeed('Manage Entities', 'Workflows & Entities')),
]
