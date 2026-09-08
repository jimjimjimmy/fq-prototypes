export type Connector = {
  id: string
  name: string
  type: 'sftp' | 'api' | 'erp' | 'manual'
  status: 'connected' | 'pending' | 'error'
  host?: string
  filePattern?: string
  createdAt: string
  entityMappingFqEntity?: string
}

export type Model = {
  id: string
  name: string
  fqDomain: string
  status: 'draft' | 'active' | 'archived'
  version: string
  createdAt: string
  sourceConnectorIds: string[]
}

export type ChatRole = 'ai' | 'user'

export type QuickReply = {
  id: string
  label: string
  /** scenarioStepId this reply advances to */
  advanceTo?: string
  /** optional side-effect identifier (e.g. 'create-connector') */
  action?: string
}

export type InlineCardKind = 'connector-picker' | 'connector-form' | 'entity-mapper' | 'model-form' | 'dataset-picker' | 'field-mapping-preview'

export type ChatMessage = {
  id: string
  role: ChatRole
  text?: string
  card?: { kind: InlineCardKind }
  quickReplies?: QuickReply[]
  timestamp: number
}

export type ScenarioStepId =
  | 'welcome'
  | 'offer-create-connector'
  | 'ask-data-type'
  | 'connector-type'
  | 'connector-form-opened'
  | 'connector-type-chosen'
  | 'connector-created'
  | 'offer-entity-mapping'
  | 'entity-mapping-done'
  | 'offer-create-model'
  | 'model-created'
  | 'offer-source-datasets'
  | 'datasets-linked'
  | 'offer-field-mapping'
  | 'ai-suggestions'
  | 'transformation-example'
  | 'all-done'
  | 'generic-help'
