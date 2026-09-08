import type { ChatMessage, ScenarioStepId, QuickReply } from '../types'

type ScenarioStep = {
  id: ScenarioStepId
  /** message(s) the AI sends when this step is triggered */
  aiMessages: Array<Omit<ChatMessage, 'id' | 'role' | 'timestamp'>>
  /** quick replies shown after the AI's last message (also available as .quickReplies on last message) */
  quickReplies?: QuickReply[]
}

/**
 * Scripted scenario for the Bank Transaction SFTP happy path.
 * Each step is a node the controller can jump to via a QuickReply.advanceTo
 * or via a keyword match. Steps are independent — they don't auto-advance.
 */
export const SCENARIO: Record<ScenarioStepId, ScenarioStep> = {
  welcome: {
    id: 'welcome',
    aiMessages: [
      {
        text: "Hi — I'm the FloQast Assistant. I can help you set up a new data flow end-to-end: creating a connector, mapping it to FloQast entities, building a model, and defining field mappings and transformations.",
      },
      {
        text: "It looks like you don't have anything set up yet. Want me to walk you through creating your first one?",
        quickReplies: [
          { id: 'start', label: 'Yes, let\'s start', advanceTo: 'offer-create-connector' },
          { id: 'tour', label: 'Just give me a tour', advanceTo: 'generic-help' },
        ],
      },
    ],
  },

  'offer-create-connector': {
    id: 'offer-create-connector',
    aiMessages: [
      {
        text: "Great. The first step is creating a **connector** — that's how FloQast pulls in your external data.\n\nTo get started, what kind of connection are you setting up?",
        quickReplies: [
          { id: 'file', label: 'File / SFTP', advanceTo: 'ask-data-type' },
          { id: 'sap', label: 'SAP', advanceTo: 'ask-data-type' },
          { id: 'cdc', label: 'Change data capture', advanceTo: 'ask-data-type' },
          { id: 'third-party', label: 'Third-party connector', advanceTo: 'ask-data-type' },
          { id: 'api', label: 'Push via API', advanceTo: 'ask-data-type' },
        ],
      },
    ],
  },

  'ask-data-type': {
    id: 'ask-data-type',
    aiMessages: [
      {
        text: "And what kind of data are you bringing in?",
        quickReplies: [
          { id: 'bank', label: 'Bank transactions', advanceTo: 'connector-form-opened' },
          { id: 'gl', label: 'General ledger', advanceTo: 'connector-form-opened' },
          { id: 'ap', label: 'Accounts payable', advanceTo: 'connector-form-opened' },
          { id: 'ar', label: 'Accounts receivable', advanceTo: 'connector-form-opened' },
          { id: 'payroll', label: 'Payroll', advanceTo: 'connector-form-opened' },
          { id: 'other', label: 'Something else', advanceTo: 'connector-form-opened' },
        ],
      },
    ],
  },

  'connector-type': {
    id: 'connector-type',
    aiMessages: [
      {
        text: "Bank transaction exports — good choice to start with. The typical setup is: your bank drops a daily CSV on an SFTP server, and we pick it up on a schedule.\n\nI've opened the connector creation flow on the left. Pick **File** to set up an SFTP connection.",
      },
    ],
  },

  'connector-form-opened': {
    id: 'connector-form-opened',
    aiMessages: [
      {
        text: "I've opened the connector creation flow on the left. Pick a connection type to continue — only **File** is available at the moment.",
      },
    ],
  },

  'connector-type-chosen': {
    id: 'connector-type-chosen',
    aiMessages: [
      {
        text: "Good pick. Fill in a **name** for the connector, the **SFTP host** to pick files up from, and a **file pattern** to match (e.g. a glob like `*.csv`). Hit **Create connector** when you're ready.",
      },
    ],
  },

  'connector-created': {
    id: 'connector-created',
    aiMessages: [
      {
        text: "Nice — your connector is live. You'll see it on the **Connectors** tab.\n\nThe next step is to tell FloQast which **entity** this data represents. Entity mapping lives inside the connector's settings — I can open it and walk you through.",
        quickReplies: [
          { id: 'map', label: 'Map it to an entity', advanceTo: 'offer-entity-mapping' },
          { id: 'skip', label: 'I\'ll come back to this', advanceTo: 'offer-create-model' },
        ],
      },
    ],
  },

  'offer-entity-mapping': {
    id: 'offer-entity-mapping',
    aiMessages: [
      {
        text: '_Entity mapping flow — not yet scaffolded. This is where I\'d walk you through picking which FQ entity this connector\'s data belongs to (e.g., your company\'s "US Operating Bank Account").\n\nComing in the next checkpoint._',
      },
    ],
  },

  'entity-mapping-done': {
    id: 'entity-mapping-done',
    aiMessages: [{ text: '_Entity mapping confirmation — coming in the next checkpoint._' }],
  },

  'offer-create-model': {
    id: 'offer-create-model',
    aiMessages: [
      {
        text: "_Model creation flow — coming in the next checkpoint. This is where we'd name the model and choose its FQ domain (GL Transactions, for bank data)._",
      },
    ],
  },

  'model-created': {
    id: 'model-created',
    aiMessages: [{ text: '_Model created — coming in the next checkpoint._' }],
  },

  'offer-source-datasets': {
    id: 'offer-source-datasets',
    aiMessages: [{ text: '_Source dataset linking — coming in the next checkpoint._' }],
  },

  'datasets-linked': {
    id: 'datasets-linked',
    aiMessages: [{ text: '_Datasets linked — coming in the next checkpoint._' }],
  },

  'offer-field-mapping': {
    id: 'offer-field-mapping',
    aiMessages: [{ text: '_Field mapping flow — coming in the next checkpoint._' }],
  },

  'ai-suggestions': {
    id: 'ai-suggestions',
    aiMessages: [{ text: '_AI-suggested field mappings — coming in the next checkpoint._' }],
  },

  'transformation-example': {
    id: 'transformation-example',
    aiMessages: [{ text: '_Transformation example — coming in the next checkpoint._' }],
  },

  'all-done': {
    id: 'all-done',
    aiMessages: [{ text: '_All done — coming in the next checkpoint._' }],
  },

  'generic-help': {
    id: 'generic-help',
    aiMessages: [
      {
        text: "No problem — feel free to click around. Whenever you want me to pitch in, just open the chat and ask, or pick one of these:",
        quickReplies: [
          { id: 'create-connector', label: 'Help me create a connector', advanceTo: 'offer-create-connector' },
          { id: 'create-model', label: 'Help me create a model', advanceTo: 'offer-create-model' },
        ],
      },
    ],
  },
}

/**
 * Default form values for the connector. Empty so the user fills them in —
 * the chat provides guidance but doesn't pre-populate the form.
 */
export const CONNECTOR_FORM_DEFAULTS = {
  name: '',
  type: 'sftp' as const,
  host: '',
  filePattern: '',
}
