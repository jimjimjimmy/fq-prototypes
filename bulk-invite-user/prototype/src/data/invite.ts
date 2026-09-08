/**
 * Shared invite logic for both the single-user form and the bulk entry table.
 * Single source of truth for roles, workspace presets, email validation, and
 * the submit payload — so the two flows can't drift apart.
 */
import { USERS } from './users'
import { workspaceIdsByNames } from './workspaces'

/** Canonical role list for the invite flows (superset of the table's display roles). */
export const INVITE_ROLES = [
  'Admin',
  'Manager',
  'Sys Admin',
  'Advanced User',
  'Ops User',
  'Variance User',
] as const
export type InviteRole = (typeof INVITE_ROLES)[number]

export const LOGIN_TYPES = ['Password', 'SAML SSO'] as const
export type LoginType = (typeof LOGIN_TYPES)[number]

/** Emails already active in the workspace (duplicate detection). Includes the seeded table users. */
const KNOWN_ACTIVE_EMAILS = new Set<string>([
  'sarah.chen@acme.com',
  ...USERS.map((u) => u.email.toLowerCase()),
])
/** Emails belonging to deactivated users (re-invite reactivates them). */
const KNOWN_DEACTIVATED_EMAILS = new Set<string>(['tom.bradley@acme.com'])

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Format-only email check. Returns an error message, or null when the format is valid. */
export function validateEmail(email: string): string | null {
  if (!email.trim()) return null
  return EMAIL_RE.test(email.trim()) ? null : 'Invalid email format'
}

export type RowStatus = 'empty' | 'ready' | 'warning' | 'error'

export interface InviteRow {
  id: string
  email: string
  role: InviteRole | ''
  loginType: LoginType | ''
  /** Selected workspace ids (multi-select, spans products). Optional, like the single flow. */
  workspaces: string[]
}

export interface RowValidation {
  status: RowStatus
  /** Specific badge label — the reason is conveyed here, e.g. "Invalid email", "Needs role". */
  label: string
}

/**
 * Validate one bulk row. The label is the specific reason (shown in the status
 * badge): empty → "—", bad format → "Invalid email", already-active →
 * "Already active", deactivated → "Deactivated", missing role/login type →
 * "Needs role"/"Needs login type", otherwise → "Ready". Workspaces are optional.
 */
export function validateInviteRow(row: InviteRow): RowValidation {
  const email = row.email.trim().toLowerCase()
  if (!email) return { status: 'empty', label: '—' }

  if (validateEmail(email)) return { status: 'error', label: 'Invalid email' }
  if (KNOWN_ACTIVE_EMAILS.has(email)) return { status: 'error', label: 'Already active' }
  if (KNOWN_DEACTIVATED_EMAILS.has(email)) return { status: 'warning', label: 'Deactivated' }

  if (!row.role) return { status: 'warning', label: 'Needs role' }
  if (!row.loginType) return { status: 'warning', label: 'Needs login type' }
  return { status: 'ready', label: 'Ready' }
}

/** Roll-up counts for the bulk footer summary. */
export function summarize(rows: InviteRow[]) {
  let ready = 0
  let incomplete = 0
  let errors = 0
  for (const r of rows) {
    const v = validateInviteRow(r)
    if (v.status === 'ready') ready++
    else if (v.status === 'warning') incomplete++
    else if (v.status === 'error') errors++
  }
  return { ready, incomplete, errors }
}

/** Discriminated submit payload — single object vs. bulk array. */
export type InvitePayload =
  | { mode: 'single'; email: string; role: string; loginType: string; workspaces: string[]; sendWelcome: boolean }
  | { mode: 'bulk'; sendWelcome: boolean; rows: { email: string; role: string; loginType: string; workspaces: string[] }[] }

/**
 * Prototype submit stub. In production: single → POST /users; bulk → POST
 * /users/bulk (array / async job) returning per-row results.
 */
export function submitInvites(payload: InvitePayload) {
  // eslint-disable-next-line no-console
  console.log('submitInvites', payload)
}

// ---- CSV import / template -------------------------------------------------

/** A parsed CSV row (no id — the table assigns ids on insert). */
export type ParsedInviteRow = Pick<InviteRow, 'email' | 'role' | 'loginType' | 'workspaces'>

/** Downloadable CSV template: header + one example row. Workspaces are ';'-separated. */
export function buildInviteTemplateCsv(): string {
  return [
    'Email,Role,Login Type,Workspaces',
    'jane.doe@company.com,Manager,SAML SSO,FloQast US - East;FloQast EU',
    'john.smith@company.com,Advanced User,Password,',
  ].join('\n')
}

/** Trigger a browser download of the CSV template. */
export function downloadInviteTemplate() {
  const blob = new Blob([buildInviteTemplateCsv()], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'bulk-invite-template.csv'
  a.click()
  URL.revokeObjectURL(url)
}

function normalizeRole(raw: string): InviteRole | '' {
  const match = INVITE_ROLES.find((r) => r.toLowerCase() === raw.trim().toLowerCase())
  return match ?? ''
}

function normalizeLoginType(raw: string): LoginType | '' {
  const match = LOGIN_TYPES.find((l) => l.toLowerCase() === raw.trim().toLowerCase())
  return match ?? ''
}

/**
 * Parse the bulk-invite CSV (columns: Email, Role, Login Type, Workspaces;
 * workspaces ';'-separated names). A header row containing "email" is skipped.
 * Unknown roles / login types / workspace names are dropped to '' / [] (rows
 * still import and surface their validation state in the grid).
 */
export function parseInviteCsv(text: string): ParsedInviteRow[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  if (lines.length === 0) return []
  if (lines[0].toLowerCase().includes('email')) lines.shift()

  return lines.map((line) => {
    const cells = line.split(',').map((c) => c.replace(/^"|"$/g, '').trim())
    const [email = '', role = '', loginTypeRaw = '', workspacesRaw = ''] = cells
    const names = workspacesRaw ? workspacesRaw.split(/[;|]/).map((s) => s.trim()).filter(Boolean) : []
    return {
      email,
      role: normalizeRole(role),
      loginType: normalizeLoginType(loginTypeRaw),
      workspaces: workspaceIdsByNames(names),
    }
  })
}
