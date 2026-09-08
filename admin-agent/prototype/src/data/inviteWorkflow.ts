/**
 * Invite workflow core — framework-free TS, modeled on the bulk-invite-user
 * prototype's data/invite.ts (read-only reference; not imported). Single source
 * of truth for the Create Users page: both the inline rows and the CSV import
 * build CandidateRow[] and converge on validateRow → submitInvites.
 *
 * Roles + the existing-users dedupe set come from data/users.ts (the canonical
 * Team Members list) — no separate role list.
 */
import { USERS, ROLE_OPTIONS, type AccountRole } from './users'

export { ROLE_OPTIONS }
export type { AccountRole }
export const DEFAULT_ROLE: AccountRole = 'Advanced User'

export type RowStatus = 'empty' | 'ready' | 'warning' | 'error'

export interface CandidateRow {
  id: string
  name: string
  email: string
  role: AccountRole | ''
}

export interface RowValidation {
  status: RowStatus
  label: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Format-only email check. Returns an error message, or null when valid. */
export function validateEmail(email: string): string | null {
  if (!email.trim()) return null
  return EMAIL_RE.test(email.trim()) ? null : 'Invalid email format'
}

/** Emails already active in the instance — reuses admin-agent's Team Members list. */
const KNOWN_ACTIVE_EMAILS = new Set<string>(USERS.map((u) => u.email.toLowerCase()))

let nextId = 0
export function makeRow(name = '', email = '', role: CandidateRow['role'] = DEFAULT_ROLE): CandidateRow {
  return { id: `r${++nextId}`, name, email, role }
}

/**
 * Validate one row in the context of the whole batch. Dedupe covers BOTH the
 * existing-users set AND in-batch duplicates (two identical emails typed in the
 * same list flag each other — the reference's known gap). Name is optional.
 */
export function validateRow(row: CandidateRow, allRows: CandidateRow[]): RowValidation {
  const email = row.email.trim().toLowerCase()
  const hasName = row.name.trim() !== ''
  if (!email && !hasName) return { status: 'empty', label: '—' }
  if (!email) return { status: 'warning', label: 'Needs email' }
  if (validateEmail(email)) return { status: 'error', label: 'Invalid email' }
  if (KNOWN_ACTIVE_EMAILS.has(email)) return { status: 'error', label: 'Already active' }
  if (allRows.some((r) => r.id !== row.id && r.email.trim().toLowerCase() === email)) {
    return { status: 'error', label: 'Duplicate in list' }
  }
  if (!row.role) return { status: 'warning', label: 'Needs role' }
  return { status: 'ready', label: 'Ready' }
}

/** Roll-up counts for the footer summary. */
export function summarize(rows: CandidateRow[]) {
  let ready = 0
  let incomplete = 0
  let errors = 0
  for (const r of rows) {
    const s = validateRow(r, rows).status
    if (s === 'ready') ready++
    else if (s === 'warning') incomplete++
    else if (s === 'error') errors++
  }
  return { ready, incomplete, errors }
}

export interface InvitePayload {
  rows: { name: string; email: string; role: string }[]
}
export interface InviteResult {
  invited: number
  rows: InvitePayload['rows']
}

/** Prototype submit stub — structured + simulated. Returns a real result the UI shows. */
export function submitInvites(payload: InvitePayload): InviteResult {
  // eslint-disable-next-line no-console
  console.log('submitInvites', payload)
  return { invited: payload.rows.length, rows: payload.rows }
}

// ---- CSV import / template (Name, Email, Role only) ------------------------

export type ParsedCandidateRow = Pick<CandidateRow, 'name' | 'email' | 'role'>

export function buildInviteTemplateCsv(): string {
  return [
    'Name,Email,Role',
    'Jane Doe,jane.doe@company.com,Manager',
    'John Smith,john.smith@company.com,Advanced User',
  ].join('\n')
}

export function downloadInviteTemplate(): void {
  const blob = new Blob([buildInviteTemplateCsv()], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'user-invite-template.csv'
  a.click()
  URL.revokeObjectURL(url)
}

function normalizeRole(raw: string): AccountRole | '' {
  return ROLE_OPTIONS.find((r) => r.toLowerCase() === raw.trim().toLowerCase()) ?? ''
}

/** Parse the invite CSV (columns: Name, Email, Role). A header row with "email" is skipped. */
export function parseInviteCsv(text: string): ParsedCandidateRow[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  if (lines.length === 0) return []
  if (lines[0].toLowerCase().includes('email')) lines.shift()
  return lines.map((line) => {
    const cells = line.split(',').map((c) => c.replace(/^"|"$/g, '').trim())
    const [name = '', email = '', role = ''] = cells
    return { name, email, role: normalizeRole(role) }
  })
}
