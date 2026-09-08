export interface Assignee {
  name: string
  initials: string
  role: 'Preparer' | 'Reviewer'
  avatarColor: string
  avatarUrl: string
  signedOff: boolean
  signOffDate?: string
}

export interface ReconciliationRow {
  id: string
  entityName: string
  entityCurrency: string
  period: string
  folder: string
  accountNumber: string
  accountName: string
  accountType: 'Standard' | 'AutoRec Amortization' | 'AutoRec Cash' | 'AI Accruals'
  tags: string[]
  blockedBy: string
  blocks: string
  controls: string
  dailyRec: boolean
  autoRecType: string
  hashMarkers: number

  // Currency values — local (transactional)
  localCurrency: string
  perGL_local: number | null
  recBalance_local: number | null
  recItems_local: number | null

  // Currency values — functional
  functionalCurrency: string
  perGL_functional: number | null
  recBalance_functional: number | null
  recItems_functional: number | null

  // Currency values — reporting
  reportingCurrency: string
  perGL_reporting: number | null
  recBalance_reporting: number | null
  recItems_reporting: number | null

  // Multi-currency columns (MC mode)
  perWorkbook_local: number | null    // Per Workbook in local currency (e.g. JPY)
  translated_functional: number | null // Translated amount in functional currency (e.g. MXN)
  diffLocal: number | null            // Difference in local context

  // People
  assignees: Assignee[]
  dueDate: string

  // Actions
  noteCount: number
  attachmentCount: number
  isFollowed: boolean

  // Row type
  isParentRow: boolean
}

/** FX rates to USD (reporting currency) */
export const FX_RATES: Record<string, number> = {
  USD: 1,
  EUR: 1.09,
  GBP: 1.27,
  JPY: 0.0067,
  MXN: 0.058,
}

/** Compute difference for a currency tier */
export function computeDifference(
  perGL: number | null,
  recBalance: number | null,
  recItems: number | null,
): number | null {
  if (perGL == null) return null
  const rb = recBalance ?? 0
  const ri = recItems ?? 0
  return perGL - rb + ri
}

/** Get completion status string from assignees */
export function getCompletionSummary(assignees: Assignee[]): string {
  const signed = assignees.filter((a) => a.signedOff).length
  return `${signed}/${assignees.length}`
}

// ── Currency tier system ──────────────────────────────────────

export type CurrencyTier = 'wide' | 'extra-wide' | 'default'

export function getCurrencyTier(isoCode: string): CurrencyTier {
  if (['JPY', 'KRW'].includes(isoCode)) return 'wide'
  if (['KWD', 'BHD'].includes(isoCode)) return 'extra-wide'
  return 'default'
}

export interface TierWidths {
  perGL: number
  recBalance: number
  recItems: number
  difference: number
}

export const TIER_WIDTHS: Record<CurrencyTier, TierWidths> = {
  default:      { perGL: 120, recBalance: 140, recItems: 120, difference: 100 },
  wide:         { perGL: 150, recBalance: 170, recItems: 150, difference: 130 },
  'extra-wide': { perGL: 130, recBalance: 150, recItems: 130, difference: 110 },
}

// Sticky column widths
export const STICKY_WIDTHS = {
  periodFolder: 128,
  account: 280,
} as const

// Right column minimums and flex
export const RIGHT_COLS = {
  assignees:  { min: 250, flex: 3 },
  dueDate:    { min: 95,  flex: 1 },
  completed:  { min: 210, flex: 2 },
  actions:    { min: 120, flex: 1 },
} as const
