import type { Person, StatusValue } from '../types.ts'

/** Deterministic PRNG (LCG) so mock data is stable across renders — no Math.random. */
function makeRng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 2 ** 32
  }
}
const pick = <T,>(arr: T[], r: () => number): T => arr[Math.floor(r() * arr.length)]
const range = (n: number) => Array.from({ length: n }, (_, i) => i)
const money = (r: () => number, min: number, max: number) =>
  Math.round((min + r() * (max - min)) * 100) / 100

const NAMES = [
  'Ava Chen', 'Marcus Bell', 'Priya Nair', 'Diego Ramos', 'Sara Okafor',
  'Tom Whitfield', 'Lena Park', 'Owen Frye', 'Nina Petrov', 'Cole Barnes',
]
const initialsOf = (name: string) =>
  name.split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('')
export const PEOPLE: Person[] = NAMES.map((name) => ({ name, initials: initialsOf(name) }))
/** The "me" identity for quick-filter demos ("assigned to me"). */
export const ME = PEOPLE[0]

const ENTITIES = ['Meridian Corp', 'Meridian UK Ltd', 'Meridian EU GmbH', 'Meridian APAC']
const STATUSES: StatusValue[] = ['Not started', 'In progress', 'In review', 'Complete', 'Overdue']

// ─── P0 · Simple — chart of accounts (system-of-record) ───────────────────────
export interface AccountRow {
  accountNumber: string
  accountName: string
  accountType: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense'
  category: string
  entity: string
  status: 'Active' | 'Inactive'
  balance: number
}
const ACCT_NAMES: [string, AccountRow['accountType'], string][] = [
  ['Cash - Operating', 'Asset', 'Current Assets'],
  ['Accounts Receivable', 'Asset', 'Current Assets'],
  ['Prepaid Expenses', 'Asset', 'Current Assets'],
  ['Fixed Assets', 'Asset', 'Non-current Assets'],
  ['Accumulated Depreciation', 'Asset', 'Non-current Assets'],
  ['Accounts Payable', 'Liability', 'Current Liabilities'],
  ['Accrued Liabilities', 'Liability', 'Current Liabilities'],
  ['Deferred Revenue', 'Liability', 'Current Liabilities'],
  ['Long-term Debt', 'Liability', 'Non-current Liabilities'],
  ['Common Stock', 'Equity', 'Equity'],
  ['Retained Earnings', 'Equity', 'Equity'],
  ['Product Revenue', 'Revenue', 'Revenue'],
  ['Services Revenue', 'Revenue', 'Revenue'],
  ['Cost of Goods Sold', 'Expense', 'COGS'],
  ['Salaries & Wages', 'Expense', 'Operating Expenses'],
  ['Rent Expense', 'Expense', 'Operating Expenses'],
]
export function makeAccounts(): AccountRow[] {
  const r = makeRng(101)
  return ACCT_NAMES.map(([accountName, accountType, category], i) => ({
    accountNumber: `${1000 + i * 100}`,
    accountName,
    accountType,
    category,
    entity: pick(ENTITIES, r),
    status: r() > 0.15 ? 'Active' : 'Inactive',
    balance: money(r, -50000, 500000),
  }))
}

// ─── P1 · Filterable — transactions ───────────────────────────────────────────
export interface TransactionRow {
  id: string
  date: string
  description: string
  account: string
  entity: string
  amount: number
  type: 'Debit' | 'Credit'
  source: 'NetSuite' | 'Intacct' | 'Bank' | 'Manual'
  status: 'Matched' | 'Unmatched' | 'Excluded'
  assignedTo: string
}
const DESCRIPTIONS = [
  'ACH deposit', 'Vendor payment', 'Payroll run', 'Wire transfer', 'Card settlement',
  'Refund issued', 'Interest income', 'Bank fee', 'Intercompany transfer', 'Subscription charge',
]
export function makeTransactions(n = 180): TransactionRow[] {
  const r = makeRng(202)
  const accts = ACCT_NAMES.map(([name]) => name)
  return range(n).map((i) => ({
    id: `TXN-${10000 + i}`,
    date: `2026-06-${String((i % 28) + 1).padStart(2, '0')}`,
    description: pick(DESCRIPTIONS, r),
    account: pick(accts, r),
    entity: pick(ENTITIES, r),
    amount: money(r, 25, 48000),
    type: r() > 0.5 ? 'Debit' : 'Credit',
    source: pick(['NetSuite', 'Intacct', 'Bank', 'Manual'] as const, r),
    status: pick(['Matched', 'Unmatched', 'Excluded'] as const, r),
    assignedTo: pick(NAMES, r),
  }))
}

// ─── P2 · Manipulation — amortization schedules (inline edit + grouping) ───────
export interface AmortRow {
  id: string
  asset: string
  method: 'Straight-line' | 'Declining balance' | 'Units of production'
  entity: string
  startDate: string
  termMonths: number
  monthlyAmount: number
  remaining: number
  status: StatusValue
}
const ASSETS = [
  'Prepaid Insurance', 'Software License', 'Office Buildout', 'Prepaid Rent',
  'Prepaid Marketing', 'Equipment Lease', 'Domain Renewal', 'Prepaid Support',
  'Data Center', 'Consulting Retainer', 'Prepaid Taxes', 'Fleet Vehicles',
]
export function makeAmortization(n = 36): AmortRow[] {
  const r = makeRng(303)
  return range(n).map((i) => {
    const term = pick([12, 24, 36, 48], r)
    const monthly = money(r, 200, 9000)
    return {
      id: `AMZ-${2000 + i}`,
      asset: `${pick(ASSETS, r)} ${i + 1}`,
      method: pick(['Straight-line', 'Declining balance', 'Units of production'] as const, r),
      entity: pick(ENTITIES, r),
      startDate: `2026-0${(i % 9) + 1}-01`,
      termMonths: term,
      monthlyAmount: monthly,
      remaining: money(r, 0, monthly * term),
      status: pick(STATUSES, r),
    }
  })
}

// ─── P3a · Workflow-complex — reconciliations (sign-off + master/detail) ───────
export interface ReconRow {
  id: string
  entity: string
  accountNumber: string
  accountName: string
  accountType: 'Standard' | 'AutoRec' | 'AI Accruals'
  perGL: number
  recBalance: number | null
  difference: number
  tags: string[]
  assignees: Person[]
  status: StatusValue
  dueDate: string
  overdue: boolean
  noteCount: number
  attachmentCount: number
  isFollowed: boolean
}
export function makeRecs(n = 28): ReconRow[] {
  const r = makeRng(404)
  return range(n).map((i) => {
    const perGL = money(r, 1000, 900000)
    const missing = r() > 0.85
    const recBalance = missing ? null : perGL + money(r, -400, 400)
    const difference = recBalance == null ? perGL : perGL - recBalance
    const nAssignees = 1 + Math.floor(r() * 3)
    const assignees: Person[] = range(nAssignees).map((k) => {
      const base = pick(PEOPLE, r)
      const signedOff = r() > 0.5
      return {
        ...base,
        role: k === 0 ? 'Preparer' : 'Reviewer',
        signedOff,
        signOffDate: signedOff ? '07/0' + ((i % 8) + 1) + '/2026' : undefined,
      }
    })
    const signed = assignees.filter((a) => a.signedOff).length
    const overdue = r() > 0.8
    const status: StatusValue = overdue
      ? 'Overdue'
      : signed === assignees.length
        ? 'Complete'
        : signed > 0
          ? 'In review'
          : 'In progress'
    const [accountName, , ] = ACCT_NAMES[i % ACCT_NAMES.length]
    return {
      id: `REC-${3000 + i}`,
      entity: pick(ENTITIES, r),
      accountNumber: `${1000 + (i % 16) * 100}`,
      accountName,
      accountType: pick(['Standard', 'AutoRec', 'AI Accruals'] as const, r),
      perGL,
      recBalance,
      difference,
      tags: [...new Set([pick(['Bank', 'AI', 'IC', 'SOX'], r)].concat(r() > 0.7 ? ['SOX'] : []))],
      assignees,
      status,
      dueDate: `2026-07-${String((i % 27) + 1).padStart(2, '0')}`,
      overdue,
      noteCount: Math.floor(r() * 4),
      attachmentCount: Math.floor(r() * 3),
      isFollowed: r() > 0.7,
    }
  })
}

// ─── P3b · Analytical-complex — variance / flux ───────────────────────────────
export interface VarianceRow {
  id: string
  account: string
  category: string
  currentPeriod: number
  priorPeriod: number
  momDollar: number
  momPct: number
  priorYear: number
  yoyDollar: number
  yoyPct: number
  explanation: string | null
  owner: string
  status: StatusValue
}
export function makeVariance(): VarianceRow[] {
  const r = makeRng(505)
  return ACCT_NAMES.map(([account, , category], i) => {
    const currentPeriod = money(r, 20000, 800000)
    const priorPeriod = currentPeriod * (0.7 + r() * 0.6)
    const priorYear = currentPeriod * (0.5 + r() * 0.8)
    const momDollar = currentPeriod - priorPeriod
    const yoyDollar = currentPeriod - priorYear
    const material = Math.abs(momDollar / priorPeriod) >= 0.2
    return {
      id: `VAR-${4000 + i}`,
      account,
      category,
      currentPeriod,
      priorPeriod,
      momDollar,
      momPct: momDollar / priorPeriod,
      priorYear,
      yoyDollar,
      yoyPct: yoyDollar / priorYear,
      explanation: material ? null : pick(
        ['Timing difference on accruals', 'Volume-driven increase', 'FX revaluation', 'Reclass from prior period'],
        r,
      ),
      owner: pick(NAMES, r),
      status: material ? 'In progress' : 'Complete',
    }
  })
}
