/**
 * Shared ChatSeed builders so the same CTA opens the identical journey wherever
 * it's launched — the assistants list on the main page, or the entity-setup
 * success screen.
 */
import type { ChatSeed } from './AssistChat'
import type { RecordSet } from './ImpactedRecordsGrid'

/** "Create Users" — the bulk-invite flow: download template → fill → upload → validate. */
export function createUsersSeed(contextLabel = 'Users & Roles'): ChatSeed {
  const opening =
    "I'm here to help! Add people one at a time below, or import a spreadsheet if you have a lot. " +
    "I'll validate each person — checking for a valid email and flagging duplicates — before any invitations go out."
  return {
    recordSet: 'users',
    view: 'upload',
    uploadVariant: 'users',
    title: 'Create Users',
    contextLabel,
    opening,
    intro: {
      paragraph: opening,
      steps: [
        { title: 'Add people', desc: "Enter each person's name, email, and account role inline — or import a spreadsheet" },
        { title: 'Review & fix', desc: "I'll flag invalid emails and duplicates row by row; fix them in place (or re-upload your file)" },
        { title: 'Send invites', desc: "When everyone's ready, send the invitations and create the accounts" },
      ],
      readyHeading: 'What to have ready',
      readyItems: [
        'The names and email addresses of the people to invite',
        'The account role for each person (Advanced User, Manager, or Admin)',
      ],
      footer: 'Ready to start? Add your first person below, or import a spreadsheet.',
    },
    prompts: ['What account roles can I assign?', 'How do I import a spreadsheet?'],
  }
}

/**
 * "Create Entities" — the document-upload setup journey: upload accounting docs →
 * build → review & map → confirm. Launched from the Workflows & Entities assistant
 * and from the MVP "Getting Started" Configure Close step.
 */
export function createEntitiesSeed(
  contextLabel = 'Workflows & Entities',
  recordSet: RecordSet = 'entities',
  title = 'Create Entities',
): ChatSeed {
  const opening =
    "I'm here to help! Upload your accounting documents and I'll help you get started creating Entities."
  return {
    recordSet,
    view: 'upload',
    uploadVariant: 'entities',
    title,
    contextLabel,
    opening,
    intro: {
      paragraph: opening,
      steps: [
        { title: 'Upload', desc: 'Drop your accounting documents (trial balance, chart of accounts, close checklist)' },
        { title: 'Review & map', desc: "I'll extract your entities and accounts and propose a mapping you can adjust with clickable prompts" },
        { title: 'Confirm & generate', desc: 'After you confirm the configuration, I emit the mapping document inline for the preview pane' },
        { title: 'Refine', desc: "You can request edits; I'll regenerate as needed" },
      ],
      readyHeading: 'What to have ready',
      readyItems: [
        'Your trial balance or chart of accounts (Excel/CSV)',
        'Any existing close checklist or task list',
        'Knowledge of your fiscal year-end, close frequency, and team structure',
      ],
      footer: "Ready to start? Upload your documents and I'll begin the analysis.",
    },
    prompts: ['Use a sample file', 'What formats do you accept?'],
  }
}

/**
 * "Create Entity" — the entity-specific AI-assisted workflow (single entity,
 * copy-from-existing with a carry-set → validate → review → simulated create).
 * DISTINCT from createEntitiesSeed (the Configure Close doc-upload onboarding
 * flow), which is intentionally left unchanged.
 */
export function createEntityWorkflowSeed(contextLabel = 'Workflows & Entities'): ChatSeed {
  const opening =
    "I'll help you create a new entity. Start from an existing one to copy its setup, " +
    "choose what to carry over, then set the new entity's GL target — I'll validate and create it."
  return {
    recordSet: 'entities',
    view: 'create-entity',
    title: 'Create Entity',
    contextLabel,
    opening,
    prompts: ['What gets copied from the template?', 'Why is GL set per entity?'],
  }
}

/** A generic chat-only CTA seed (used for actions without a dedicated journey yet). */
export function genericSeed(action: string, contextLabel: string, recordSet: RecordSet = 'entities'): ChatSeed {
  return {
    recordSet,
    title: action,
    contextLabel,
    opening: `Let's work on "${action}". What would you like to do first?`,
    prompts: ['Walk me through it', 'What do I need to get started?'],
  }
}
