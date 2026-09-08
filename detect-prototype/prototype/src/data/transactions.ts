import type { Transaction, TransactionType } from './types';
import { getVendor, vendors } from './vendors';
import { getAccount } from './chartOfAccounts';

/**
 * Parallax Labs transactions across Feb/Mar/Apr 2026.
 *
 * Composed of three layers:
 *
 * 1. GENERATED RECURRING BILLS — monthly SaaS / infrastructure invoices from
 *    vendors with `typicalMonthlySpend`. Produces ~150 clean transactions
 *    across the three periods that form the "normal" backdrop.
 *
 * 2. HAND-CRAFTED REFERENCE TRANSACTIONS — one-off but normal transactions
 *    (payroll runs, rent, insurance renewals) for context.
 *
 * 3. HAND-CRAFTED ANOMALY TRANSACTIONS — each one carefully designed to trip
 *    one or more rules in rules.ts. These become the AnomalyRecords seeded
 *    in seedAnomalies.ts.
 *
 * Periods:
 *   2026-02 closed | 2026-03 closed | 2026-04 in-progress (current)
 */

// ======================================================================
// Helpers
// ======================================================================

// BILL starts at 44100 so auto-generated recurring bills (44101–44174)
// never collide with the explicit anomaly IDs (44019–44036).
const invoiceCounter = { BILL: 44100, PO: 300, JE: 20, EXP: 44600, PAY: 180 };
function nextId(type: TransactionType): string {
  const map = {
    'vendor-bill': 'BILL',
    'purchase-order': 'PO',
    'journal-entry': 'JE',
    'expense-report': 'EXP',
    payment: 'PAY',
  } as const;
  const prefix = map[type];
  invoiceCounter[prefix]++;
  if (prefix === 'BILL' || prefix === 'EXP') {
    return `${prefix}-${invoiceCounter[prefix]}`;
  }
  return `${prefix}-2026-${String(invoiceCounter[prefix]).padStart(3, '0')}`;
}

function businessHour(baseIso: string): string {
  // Return a time on the given date within normal business hours
  const d = new Date(baseIso + 'T00:00:00Z');
  const hour = 9 + Math.floor(Math.random() * 8); // 9a–4p
  const minute = Math.floor(Math.random() * 60);
  d.setUTCHours(hour, minute, 0, 0);
  return d.toISOString();
}

/**
 * Deterministic "Line N" label per transaction id. Matches NetSuite/QuickBooks
 * convention where lines are just sequentially numbered — the parent
 * transaction's total line count is implicit from the source system. Stays
 * stable across reloads since it's seeded from the transactionId. N ranges
 * 1–8.
 */
function generateTransactionLine(transactionId: string): string {
  let h = 0;
  for (let i = 0; i < transactionId.length; i++) {
    h = (h * 31 + transactionId.charCodeAt(i)) | 0;
  }
  const line = 1 + (Math.abs(h) % 8); // 1..8
  return `Line ${line}`;
}

function tx(input: Partial<Transaction> & {
  type: TransactionType;
  entityId: string;
  periodId: string;
  date: string;
  amount: number;
  vendorId?: string;
  glAccountCode: string;
  glAccountName: string;
  submitterId: string;
  approverId: string;
  memo: string;
}): Transaction {
  const transactionId = input.transactionId ?? nextId(input.type);
  const createdAt = input.createdAt ?? businessHour(input.date);
  const submittedAt = input.submittedAt ?? createdAt;
  const approvedAt = input.approvedAt ?? new Date(
    new Date(submittedAt).getTime() + (10 + Math.floor(Math.random() * 50)) * 60 * 1000,
  ).toISOString();
  const vendorName = input.vendorId ? getVendor(input.vendorId)?.name : undefined;

  return {
    id: `tx-${transactionId.toLowerCase()}`,
    transactionId,
    type: input.type,
    entityId: input.entityId,
    periodId: input.periodId,
    date: input.date,
    amount: input.amount,
    currency: input.currency ?? 'USD',
    vendorId: input.vendorId,
    vendorName: input.vendorName ?? vendorName,
    glAccountCode: input.glAccountCode,
    glAccountName: input.glAccountName,
    transactionLine: input.transactionLine ?? generateTransactionLine(transactionId),
    submitterId: input.submitterId,
    approverId: input.approverId,
    department: input.department ?? 'General & Administrative',
    class: 'class' in input ? input.class : 'Operations',
    location: 'location' in input ? input.location : 'United States',
    memo: input.memo,
    attachmentCount: input.attachmentCount ?? 1,
    invoiceNumber: input.invoiceNumber ?? `INV-${transactionId.split('-').pop()}`,
    createdAt,
    submittedAt,
    approvedAt,
  };
}

// ======================================================================
// Layer 1 — Generated recurring bills (~150 tx across 3 periods)
// ======================================================================

const recurringSchedule: Array<{
  vendorId: string;
  periodsToGenerate: string[]; // which periods produce a bill
  dayOfMonth: number;
  approver: string;
  submitter: string;
}> = [
  // Cloud infra
  { vendorId: 'vendor-aws', periodsToGenerate: ['2026-02', '2026-03', '2026-04'], dayOfMonth: 5, approver: 'marcus-rodriguez', submitter: 'david-park' },
  { vendorId: 'vendor-snowflake', periodsToGenerate: ['2026-02', '2026-03', '2026-04'], dayOfMonth: 7, approver: 'marcus-rodriguez', submitter: 'david-park' },
  { vendorId: 'vendor-datadog', periodsToGenerate: ['2026-02', '2026-03', '2026-04'], dayOfMonth: 9, approver: 'marcus-rodriguez', submitter: 'david-park' },
  { vendorId: 'vendor-cloudflare', periodsToGenerate: ['2026-02', '2026-03', '2026-04'], dayOfMonth: 12, approver: 'marcus-rodriguez', submitter: 'david-park' },
  { vendorId: 'vendor-equinix', periodsToGenerate: ['2026-02', '2026-03', '2026-04'], dayOfMonth: 14, approver: 'marcus-rodriguez', submitter: 'david-park' },
  // Dev tools
  { vendorId: 'vendor-github', periodsToGenerate: ['2026-02', '2026-03', '2026-04'], dayOfMonth: 6, approver: 'marcus-rodriguez', submitter: 'david-park' },
  { vendorId: 'vendor-linear', periodsToGenerate: ['2026-02', '2026-03', '2026-04'], dayOfMonth: 6, approver: 'marcus-rodriguez', submitter: 'david-park' },
  { vendorId: 'vendor-figma', periodsToGenerate: ['2026-02', '2026-03', '2026-04'], dayOfMonth: 6, approver: 'marcus-rodriguez', submitter: 'david-park' },
  { vendorId: 'vendor-notion', periodsToGenerate: ['2026-02', '2026-03', '2026-04'], dayOfMonth: 8, approver: 'marcus-rodriguez', submitter: 'david-park' },
  { vendorId: 'vendor-1password', periodsToGenerate: ['2026-02', '2026-03', '2026-04'], dayOfMonth: 10, approver: 'marcus-rodriguez', submitter: 'david-park' },
  { vendorId: 'vendor-vercel', periodsToGenerate: ['2026-02', '2026-03', '2026-04'], dayOfMonth: 11, approver: 'marcus-rodriguez', submitter: 'david-park' },
  // SaaS
  { vendorId: 'vendor-salesforce', periodsToGenerate: ['2026-02', '2026-03', '2026-04'], dayOfMonth: 15, approver: 'priya-patel', submitter: 'david-park' },
  { vendorId: 'vendor-hubspot', periodsToGenerate: ['2026-02', '2026-03', '2026-04'], dayOfMonth: 15, approver: 'marcus-rodriguez', submitter: 'david-park' },
  { vendorId: 'vendor-slack', periodsToGenerate: ['2026-02', '2026-03', '2026-04'], dayOfMonth: 4, approver: 'marcus-rodriguez', submitter: 'david-park' },
  { vendorId: 'vendor-zoom', periodsToGenerate: ['2026-02', '2026-03', '2026-04'], dayOfMonth: 4, approver: 'marcus-rodriguez', submitter: 'david-park' },
  { vendorId: 'vendor-okta', periodsToGenerate: ['2026-02', '2026-03', '2026-04'], dayOfMonth: 8, approver: 'marcus-rodriguez', submitter: 'david-park' },
  { vendorId: 'vendor-docusign', periodsToGenerate: ['2026-02', '2026-03', '2026-04'], dayOfMonth: 8, approver: 'marcus-rodriguez', submitter: 'david-park' },
  // Marketing
  { vendorId: 'vendor-gartner', periodsToGenerate: ['2026-02', '2026-03', '2026-04'], dayOfMonth: 18, approver: 'priya-patel', submitter: 'lisa-zhang' },
  { vendorId: 'vendor-zoominfo', periodsToGenerate: ['2026-02', '2026-03', '2026-04'], dayOfMonth: 18, approver: 'marcus-rodriguez', submitter: 'lisa-zhang' },
  { vendorId: 'vendor-linkedin-ads', periodsToGenerate: ['2026-02', '2026-03', '2026-04'], dayOfMonth: 20, approver: 'marcus-rodriguez', submitter: 'lisa-zhang' },
  // Facilities
  { vendorId: 'vendor-wework', periodsToGenerate: ['2026-02', '2026-03', '2026-04'], dayOfMonth: 2, approver: 'priya-patel', submitter: 'jennifer-wu' },
  { vendorId: 'vendor-comcast', periodsToGenerate: ['2026-02', '2026-03', '2026-04'], dayOfMonth: 3, approver: 'marcus-rodriguez', submitter: 'jennifer-wu' },
  // HR
  { vendorId: 'vendor-rippling', periodsToGenerate: ['2026-02', '2026-03', '2026-04'], dayOfMonth: 15, approver: 'priya-patel', submitter: 'jennifer-wu' },
  { vendorId: 'vendor-carta', periodsToGenerate: ['2026-02', '2026-03', '2026-04'], dayOfMonth: 21, approver: 'marcus-rodriguez', submitter: 'jennifer-wu' },
];

function generateRecurring(): Transaction[] {
  const out: Transaction[] = [];
  for (const entry of recurringSchedule) {
    const vendor = getVendor(entry.vendorId);
    if (!vendor || !vendor.typicalMonthlySpend) continue;
    for (const periodId of entry.periodsToGenerate) {
      const month = periodId.split('-')[1];
      const date = `${periodId.split('-')[0]}-${month}-${String(entry.dayOfMonth).padStart(2, '0')}`;
      // Small natural variance, +/- 5%
      const variance = (Math.random() - 0.5) * 0.1;
      const amount = Math.round(vendor.typicalMonthlySpend * (1 + variance));
      const acct = getAccount(vendor.defaultGLAccount);
      out.push(
        tx({
          type: 'vendor-bill',
          entityId: 'entity-us',
          periodId,
          date,
          amount,
          vendorId: vendor.id,
          glAccountCode: vendor.defaultGLAccount,
          glAccountName: acct?.name ?? vendor.defaultGLAccount,
          submitterId: entry.submitter,
          approverId: entry.approver,
          memo: `${
            new Date(date + 'T00:00:00Z').toLocaleString('en-US', { month: 'long', year: 'numeric' })
          } subscription invoice`,
          attachmentCount: 1,
        }),
      );
    }
  }
  return out;
}

export const recurringTransactions = generateRecurring();

// ======================================================================
// Layer 2 — Hand-crafted reference transactions (clean, non-anomalous)
// ======================================================================

export const referenceTransactions: Transaction[] = [
  tx({
    type: 'journal-entry',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-01',
    amount: 428_500,
    glAccountCode: '6010',
    glAccountName: 'Salaries & Wages',
    submitterId: 'jennifer-wu',
    approverId: 'priya-patel',
    memo: 'April 2026 payroll run — US entity',
    attachmentCount: 3,
  }),
  tx({
    type: 'journal-entry',
    entityId: 'entity-uk',
    periodId: '2026-04',
    date: '2026-04-01',
    amount: 87_200,
    glAccountCode: '6010',
    glAccountName: 'Salaries & Wages',
    submitterId: 'jennifer-wu',
    approverId: 'priya-patel',
    memo: 'April 2026 payroll run — UK entity',
    attachmentCount: 3,
  }),
  tx({
    type: 'vendor-bill',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-15',
    amount: 48_000,
    vendorId: 'vendor-deloitte',
    glAccountCode: '6510',
    glAccountName: 'Accounting & Audit Fees',
    submitterId: 'emily-chen',
    approverId: 'priya-patel',
    memo: 'Q1 2026 audit fieldwork',
    attachmentCount: 2,
  }),
  tx({
    type: 'vendor-bill',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-22',
    amount: 9_400,
    vendorId: 'vendor-chubb',
    glAccountCode: '6600',
    glAccountName: 'Insurance - General Liability',
    submitterId: 'jennifer-wu',
    approverId: 'marcus-rodriguez',
    memo: 'April 2026 general liability premium',
    attachmentCount: 1,
  }),
  // Reference accrual — paired with JE-2026-044 to form the round-trip pattern
  tx({
    transactionId: 'JE-2026-043',
    type: 'journal-entry',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-14',
    amount: 75_000,
    glAccountCode: '2100',
    glAccountName: 'Accrued Expenses',
    submitterId: 'emily-chen',
    approverId: 'priya-patel',
    memo: 'Q2 consulting accrual — legal and advisory services',
    attachmentCount: 1,
    createdAt: '2026-04-14T10:30:00Z',
    submittedAt: '2026-04-14T10:30:00Z',
    approvedAt: '2026-04-14T11:45:00Z',
  }),

  // Prepaid Expenses (account 1300) — added so the Recs → Detect bridge
  // on rec-1 (Dec 2026 · Prepaid Expenses) lands users on real anomalies.
  tx({
    transactionId: 'JE-2026-091',
    type: 'journal-entry',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-22',
    amount: 142_000,
    glAccountCode: '1300',
    glAccountName: 'Prepaid Expenses',
    submitterId: 'lisa-zhang',
    approverId: 'lisa-zhang',
    memo: 'Annual software prepayment amortization — 12-month spread',
    attachmentCount: 0,
    createdAt: '2026-04-22T16:18:00Z',
    submittedAt: '2026-04-22T16:18:00Z',
    approvedAt: '2026-04-22T16:21:00Z',
  }),
  tx({
    transactionId: 'BILL-44091',
    type: 'vendor-bill',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-18',
    amount: 68_500,
    vendorId: 'vendor-nimbus-advisors',
    glAccountCode: '1300',
    glAccountName: 'Prepaid Expenses',
    submitterId: 'david-park',
    approverId: 'priya-patel',
    memo: 'Q3 retainer prepayment — accelerated billing cycle',
    attachmentCount: 1,
    createdAt: '2026-04-18T22:14:00Z',
    submittedAt: '2026-04-18T22:14:00Z',
    approvedAt: '2026-04-19T09:30:00Z',
  }),
  tx({
    transactionId: 'JE-2026-092',
    type: 'journal-entry',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-26',
    amount: 24_800,
    glAccountCode: '1300',
    glAccountName: 'Prepaid Expenses',
    submitterId: 'jennifer-wu',
    approverId: 'marcus-rodriguez',
    memo: 'Prepaid insurance — coverage period adjustment',
    attachmentCount: 2,
    createdAt: '2026-04-26T09:42:00Z',
    submittedAt: '2026-04-26T09:42:00Z',
    approvedAt: '2026-04-26T10:55:00Z',
  }),

  // Accounts Receivable (account 1100) — 4 transactions added so the
  // FloQast EMEA · 1100 Accounts Receivable rec has real seedAnomalies
  // counterparts. The 4 transactions below all match anomaly records
  // in seedAnomalies.ts (1 resolved + 3 open) so the Close→Detect
  // bridge count for this rec aligns at 4.
  tx({
    transactionId: 'INV-CUST-44120',
    type: 'journal-entry',
    entityId: 'entity-uk',
    periodId: '2026-04',
    date: '2026-04-22',
    amount: 312_400,
    glAccountCode: '1100',
    glAccountName: 'Accounts Receivable',
    submitterId: 'lisa-zhang',
    approverId: 'priya-patel',
    memo: 'Q1 customer invoice — Acme Health enterprise renewal',
    attachmentCount: 2,
    createdAt: '2026-04-22T14:18:00Z',
    submittedAt: '2026-04-22T14:18:00Z',
    approvedAt: '2026-04-22T14:33:00Z',
  }),
  tx({
    transactionId: 'AR-WO-2026-04',
    type: 'journal-entry',
    entityId: 'entity-uk',
    periodId: '2026-04',
    date: '2026-04-20',
    amount: 47_500,
    glAccountCode: '1100',
    glAccountName: 'Accounts Receivable',
    submitterId: 'jennifer-wu',
    approverId: 'jennifer-wu', // self-approved write-off
    memo: 'AR write-off — uncollectible balance, customer in liquidation',
    attachmentCount: 0,
    createdAt: '2026-04-20T17:50:00Z',
    submittedAt: '2026-04-20T17:50:00Z',
    approvedAt: '2026-04-20T17:52:00Z',
  }),
  tx({
    transactionId: 'INV-CUST-44135',
    type: 'journal-entry',
    entityId: 'entity-uk',
    periodId: '2026-04',
    date: '2026-04-17',
    amount: 89_200,
    glAccountCode: '1100',
    glAccountName: 'Accounts Receivable',
    submitterId: 'david-park',
    approverId: 'marcus-rodriguez',
    memo: 'Customer invoice — duplicate of INV-CUST-44128 (same PO #)',
    attachmentCount: 1,
    createdAt: '2026-04-17T11:02:00Z',
    submittedAt: '2026-04-17T11:02:00Z',
    approvedAt: '2026-04-17T11:34:00Z',
  }),
  tx({
    transactionId: 'JE-2026-095',
    type: 'journal-entry',
    entityId: 'entity-uk',
    periodId: '2026-04',
    date: '2026-04-12',
    amount: 158_750,
    glAccountCode: '1100',
    glAccountName: 'Accounts Receivable',
    submitterId: 'emily-chen',
    approverId: 'priya-patel',
    memo: 'Revenue accrual — service period closed but invoice posted late',
    attachmentCount: 1,
    createdAt: '2026-04-12T09:15:00Z',
    submittedAt: '2026-04-12T09:15:00Z',
    approvedAt: '2026-04-12T10:40:00Z',
  }),
];

// ======================================================================
// Layer 3 — Hand-crafted anomaly transactions
// ======================================================================

/**
 * Each transaction below is deliberately designed to trip one or more rules.
 * The corresponding AnomalyRecords (with flags) live in seedAnomalies.ts.
 *
 * IDs follow the ERP-style convention (BILL-44NNN / PO-2026-NNN / etc.) so
 * they display naturally in the inbox per the ID convention in the plan.
 */
export const anomalyTransactions: Transaction[] = [
  // 1. Duplicate payment — two identical bills 2 hours apart (trips AI dup-payment + after-hours if late)
  tx({
    transactionId: 'BILL-44019',
    type: 'vendor-bill',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-21',
    amount: 125_000,
    vendorId: 'vendor-acme-consulting',
    glAccountCode: '6040',
    glAccountName: 'Contractors & Consultants',
    submitterId: 'david-park',
    approverId: 'marcus-rodriguez',
    memo: 'Q2 advisory retainer',
    attachmentCount: 1,
    createdAt: '2026-04-21T14:12:00Z',
    submittedAt: '2026-04-21T14:12:00Z',
    approvedAt: '2026-04-21T14:38:00Z',
    invoiceNumber: 'ACME-2026-Q2-001',
  }),
  tx({
    transactionId: 'BILL-44021',
    type: 'vendor-bill',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-21',
    amount: 125_000,
    vendorId: 'vendor-acme-consulting',
    glAccountCode: '6040',
    glAccountName: 'Contractors & Consultants',
    submitterId: 'david-park',
    approverId: 'marcus-rodriguez',
    memo: 'Q2 advisory retainer',
    attachmentCount: 1,
    createdAt: '2026-04-21T16:21:00Z',
    submittedAt: '2026-04-21T16:21:00Z',
    approvedAt: '2026-04-21T16:47:00Z',
    invoiceNumber: 'ACME-2026-Q2-001',
  }),

  // 2. Self-approved transaction (trips self-approved + round-number)
  tx({
    transactionId: 'BILL-44022',
    type: 'vendor-bill',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-20',
    amount: 89_000,
    vendorId: 'vendor-nimbus-advisors',
    glAccountCode: '6040',
    glAccountName: 'Contractors & Consultants',
    submitterId: 'marcus-rodriguez',
    approverId: 'marcus-rodriguez', // self-approved
    memo: 'Strategic review engagement',
    attachmentCount: 0, // also no attachments (light anomaly)
    invoiceNumber: 'NIMBUS-APR-01',
  }),

  // 3. After-hours processing — Sunday 2:47am
  tx({
    transactionId: 'BILL-44023',
    type: 'vendor-bill',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-20',
    amount: 67_800,
    vendorId: 'vendor-linkedin-ads',
    glAccountCode: '6200',
    glAccountName: 'Marketing - Advertising',
    submitterId: 'lisa-zhang',
    approverId: 'marcus-rodriguez',
    memo: 'Q2 sponsored campaign — accelerator program',
    attachmentCount: 2,
    createdAt: '2026-04-19T08:47:00Z', // Sunday 2:47am Pacific → early UTC on a weekend
    submittedAt: '2026-04-19T08:47:00Z',
    approvedAt: '2026-04-19T09:05:00Z',
  }),

  // 4. Round number transaction — $150,000 even
  tx({
    transactionId: 'PO-2026-318',
    type: 'purchase-order',
    entityId: 'entity-uk',
    periodId: '2026-04',
    date: '2026-04-19',
    amount: 150_000,
    vendorId: 'vendor-wsgr',
    glAccountCode: '6500',
    glAccountName: 'Legal Fees',
    submitterId: 'priya-patel',
    approverId: 'priya-patel', // also self-approved (double flag)
    memo: 'UK entity formation legal work — estimated retainer',
    attachmentCount: 0,
  }),

  // 5. Missing documentation — $32,100 with 0 attachments
  tx({
    transactionId: 'BILL-44024',
    type: 'vendor-bill',
    entityId: 'entity-uk',
    periodId: '2026-04',
    date: '2026-04-18',
    amount: 32_100,
    vendorId: 'vendor-andreessen-hr',
    glAccountCode: '6040',
    glAccountName: 'Contractors & Consultants',
    submitterId: 'david-park',
    approverId: 'marcus-rodriguez',
    memo: 'Executive search services',
    attachmentCount: 0,
  }),

  // 6. New vendor - high risk — TechSoft, new vendor, $28,750
  tx({
    transactionId: 'BILL-44025',
    type: 'vendor-bill',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-18',
    amount: 28_750,
    vendorId: 'vendor-techsoft',
    glAccountCode: '6040',
    glAccountName: 'Contractors & Consultants',
    submitterId: 'david-park',
    approverId: 'marcus-rodriguez',
    memo: 'Initial integration services',
    attachmentCount: 1,
  }),

  // 7. Weekend activity — Saturday posting
  tx({
    transactionId: 'EXP-44721',
    type: 'expense-report',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-18',
    amount: 4_280,
    glAccountCode: '6420',
    glAccountName: 'Travel - Meals',
    submitterId: 'emily-chen',
    approverId: 'priya-patel',
    memo: 'Client dinners — Q2 enterprise kickoffs',
    attachmentCount: 1,
    createdAt: '2026-04-18T21:14:00Z', // Saturday
    submittedAt: '2026-04-18T21:14:00Z',
    approvedAt: '2026-04-19T10:22:00Z',
  }),

  // 8. Rapid approval — <5 minutes
  tx({
    transactionId: 'BILL-44026',
    type: 'vendor-bill',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-17',
    amount: 42_500,
    vendorId: 'vendor-digital-reach',
    glAccountCode: '6200',
    glAccountName: 'Marketing - Advertising',
    submitterId: 'lisa-zhang',
    approverId: 'marcus-rodriguez',
    memo: 'Q2 campaign creative services',
    attachmentCount: 1,
    createdAt: '2026-04-17T11:02:00Z',
    submittedAt: '2026-04-17T11:02:00Z',
    approvedAt: '2026-04-17T11:04:30Z', // approved 2.5 min later
  }),

  // 9. Duplicate invoice number — re-uses INV-SFDC-2604
  tx({
    transactionId: 'BILL-44027',
    type: 'vendor-bill',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-16',
    amount: 34_000,
    vendorId: 'vendor-salesforce',
    glAccountCode: '6130',
    glAccountName: 'Sales & Marketing Tools',
    submitterId: 'david-park',
    approverId: 'marcus-rodriguez',
    memo: 'April 2026 platform subscription',
    attachmentCount: 1,
    invoiceNumber: 'SFDC-APR2026-001', // same as BILL-44015 (older)
  }),

  // 10. Post-close entry — JE posted to Mar 2026 on Apr 15 (after March close Apr 9)
  tx({
    transactionId: 'JE-2026-041',
    type: 'journal-entry',
    entityId: 'entity-us',
    periodId: '2026-03',
    date: '2026-04-01',
    amount: 18_400,
    glAccountCode: '2100',
    glAccountName: 'Accrued Expenses',
    submitterId: 'emily-chen',
    approverId: 'marcus-rodriguez',
    memo: 'March 2026 accrual adjustment — vendor true-up',
    attachmentCount: 1,
    createdAt: '2026-04-15T13:22:00Z', // after close
    submittedAt: '2026-04-15T13:22:00Z',
    approvedAt: '2026-04-15T15:47:00Z',
  }),

  // 11. Budget overrun — marketing events 180% of budget
  tx({
    transactionId: 'BILL-44028',
    type: 'vendor-bill',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-14',
    amount: 47_500,
    vendorId: 'vendor-saastr',
    glAccountCode: '6210',
    glAccountName: 'Marketing - Events & Conferences',
    submitterId: 'lisa-zhang',
    approverId: 'priya-patel',
    memo: 'Annual conference booth — premium sponsorship',
    attachmentCount: 2,
  }),

  // 12. Policy threshold — gift > $250
  tx({
    transactionId: 'EXP-44722',
    type: 'expense-report',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-12',
    amount: 620,
    glAccountCode: '6900',
    glAccountName: 'Other Operating Expenses',
    submitterId: 'emily-chen',
    approverId: 'marcus-rodriguez',
    memo: '.',
    attachmentCount: 1,
  }),

  // 13. Vendor bank change — Nimbus bank account changed 2 days before invoice
  tx({
    transactionId: 'BILL-44029',
    type: 'vendor-bill',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-11',
    amount: 58_900,
    vendorId: 'vendor-nimbus-advisors',
    glAccountCode: '6040',
    glAccountName: 'Contractors & Consultants',
    submitterId: 'david-park',
    approverId: 'marcus-rodriguez',
    memo: 'Project milestone 1 payment',
    attachmentCount: 1,
  }),

  // 14. Multiple approver changes — PO reassigned 3 times
  tx({
    transactionId: 'PO-2026-319',
    type: 'purchase-order',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-10',
    amount: 73_200,
    vendorId: 'vendor-premier-office',
    glAccountCode: '6310',
    glAccountName: 'Office Supplies',
    submitterId: 'jennifer-wu',
    approverId: 'priya-patel', // 3rd approver
    memo: 'Q2 office fit-out',
    department: '', // department intentionally left blank — trips rule-department-blank
    attachmentCount: 1,
  }),

  // 15. Clean Feb (closed period) anomaly — resolved already, for history
  tx({
    transactionId: 'BILL-43918',
    type: 'vendor-bill',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-05',
    amount: 45_600,
    vendorId: 'vendor-gartner',
    glAccountCode: '6220',
    glAccountName: 'Marketing - Content',
    submitterId: 'lisa-zhang',
    approverId: 'lisa-zhang', // self-approved
    memo: 'Annual research contract renewal',
    attachmentCount: 1,
  }),

  // 16. Unusual vendor pattern — AWS 3x normal (AI-detected)
  tx({
    transactionId: 'BILL-44030',
    type: 'vendor-bill',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-09',
    amount: 284_000,
    vendorId: 'vendor-aws',
    glAccountCode: '5010',
    glAccountName: 'Hosting Costs (AWS)',
    submitterId: 'david-park',
    approverId: 'marcus-rodriguez',
    memo: 'April reserved instances true-up',
    attachmentCount: 2,
  }),

  // 17. Contract deviation — Deloitte rate higher than contract
  tx({
    transactionId: 'BILL-44031',
    type: 'vendor-bill',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-08',
    amount: 62_400,
    vendorId: 'vendor-deloitte',
    glAccountCode: '6510',
    glAccountName: 'Accounting & Audit Fees',
    submitterId: 'emily-chen',
    approverId: 'priya-patel',
    memo: 'Additional Q1 fieldwork',
    attachmentCount: 2,
  }),

  // 18. JE reversal pattern (journal entry reversing prior within period)
  tx({
    transactionId: 'JE-2026-042',
    type: 'journal-entry',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-07',
    amount: 158_000,
    glAccountCode: '4010',
    glAccountName: 'Subscription Revenue - Platform',
    submitterId: 'emily-chen',
    approverId: 'marcus-rodriguez',
    memo: 'February 2026 consulting accrual reversal',
    attachmentCount: 1,
  }),

  // 19. Late-night AP run (after-hours + Sunday)
  tx({
    transactionId: 'PAY-2026-203',
    type: 'payment',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-06',
    amount: 92_400,
    glAccountCode: '1010',
    glAccountName: 'Cash - Operating (JPMorgan)',
    submitterId: 'jennifer-wu',
    approverId: 'marcus-rodriguez',
    memo: 'Weekly AP run — batch payment',
    attachmentCount: 1,
    createdAt: '2026-04-05T23:41:00Z', // Sunday night
    submittedAt: '2026-04-05T23:41:00Z',
    approvedAt: '2026-04-06T09:12:00Z',
  }),

  // 20. AI — unusual category spend for 6900
  tx({
    transactionId: 'BILL-44032',
    type: 'vendor-bill',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-05',
    amount: 8_200,
    glAccountCode: '6900',
    glAccountName: 'Other Operating Expenses',
    submitterId: 'jennifer-wu',
    approverId: 'marcus-rodriguez',
    memo: 'Q2 operational services',
    attachmentCount: 0,
  }),

  // ---- New AI-only transactions (high severity, above the fold) ----
  // 21. AI-only — unusual approval-chain behavior
  tx({
    transactionId: 'BILL-44033',
    type: 'vendor-bill',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-22',
    amount: 168_400,
    vendorId: 'vendor-deloitte',
    glAccountCode: '6510',
    glAccountName: 'Accounting & Audit Fees',
    submitterId: 'emily-chen',
    approverId: 'priya-patel',
    memo: 'Q1 audit closeout',
    attachmentCount: 2,
  }),

  // 22. AI-only — vendor concentration risk
  tx({
    transactionId: 'BILL-44034',
    type: 'vendor-bill',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-22',
    amount: 96_500,
    vendorId: 'vendor-acme-consulting',
    glAccountCode: '6040',
    glAccountName: 'Contractors & Consultants',
    submitterId: 'david-park',
    approverId: 'marcus-rodriguez',
    memo: 'Additional advisory hours',
    attachmentCount: 1,
  }),

  // 23. AI-only — layered transaction pattern (split invoice)
  tx({
    transactionId: 'BILL-44035',
    type: 'vendor-bill',
    entityId: 'entity-uk',
    periodId: '2026-04',
    date: '2026-04-21',
    amount: 24_900,
    vendorId: 'vendor-techsoft',
    glAccountCode: '6040',
    glAccountName: 'Contractors & Consultants',
    submitterId: 'david-park',
    approverId: 'marcus-rodriguez',
    memo: 'Implementation phase 2',
    attachmentCount: 1,
  }),

  // 24. AI-only — volume / spend behavior anomaly
  tx({
    transactionId: 'BILL-44036',
    type: 'vendor-bill',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-20',
    amount: 47_800,
    vendorId: 'vendor-zoominfo',
    glAccountCode: '6130',
    glAccountName: 'Sales & Marketing Tools',
    submitterId: 'lisa-zhang',
    approverId: 'marcus-rodriguez',
    memo: 'Q2 enterprise license expansion',
    attachmentCount: 2,
  }),

  // 25. AI — backdated entry: GL date Apr 2, system entry Apr 24 (22-day gap)
  tx({
    transactionId: 'BILL-44037',
    type: 'vendor-bill',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-02', // GL date manually backdated
    amount: 31_500,
    vendorId: 'vendor-wsgr',
    glAccountCode: '6500',
    glAccountName: 'Legal Fees',
    submitterId: 'emily-chen',
    approverId: 'priya-patel',
    memo: 'March IP filing supplement',
    attachmentCount: 1,
    createdAt: '2026-04-24T09:15:00Z', // system posting date — 22 days after GL date
    submittedAt: '2026-04-24T09:15:00Z',
    approvedAt: '2026-04-24T14:22:00Z',
    invoiceNumber: 'WSGR-2026-IP-MAR',
  }),

  // 26. AI — round-trip: reverses JE-2026-043 in the same period, different approver
  tx({
    transactionId: 'JE-2026-044',
    type: 'journal-entry',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-17',
    amount: 75_000,
    glAccountCode: '2100',
    glAccountName: 'Accrued Expenses',
    submitterId: 'emily-chen',
    approverId: 'marcus-rodriguez', // different approver from JE-2026-043 (priya-patel)
    memo: 'Q2 consulting accrual reversal',
    attachmentCount: 0,
    createdAt: '2026-04-17T14:22:00Z',
    submittedAt: '2026-04-17T14:22:00Z',
    approvedAt: '2026-04-17T16:45:00Z',
  }),

  // 27. AI — unusual posting user: Jennifer Wu posts to 6520 Tax Prep (never done before)
  tx({
    transactionId: 'BILL-44038',
    type: 'vendor-bill',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-24',
    amount: 22_400,
    vendorId: 'vendor-pwc',
    glAccountCode: '6520',
    glAccountName: 'Tax Preparation',
    submitterId: 'jennifer-wu', // all 14 prior 6520 postings: emily-chen or priya-patel
    approverId: 'marcus-rodriguez',
    memo: 'Q1 2026 tax provision computation',
    attachmentCount: 1,
    createdAt: '2026-04-24T11:05:00Z',
    submittedAt: '2026-04-24T11:05:00Z',
    approvedAt: '2026-04-24T14:32:00Z',
    invoiceNumber: 'PWC-2026-TPROV-Q1',
  }),

  // 21-26. March 2026 anomalies (mostly resolved by now)
  tx({
    transactionId: 'BILL-43920',
    type: 'vendor-bill',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-08',
    amount: 95_000,
    vendorId: 'vendor-wsgr',
    glAccountCode: '6500',
    glAccountName: 'Legal Fees',
    submitterId: 'priya-patel',
    approverId: 'priya-patel',
    memo: 'Series C follow-on legal services',
    attachmentCount: 1,
  }),
  tx({
    transactionId: 'EXP-44605',
    type: 'expense-report',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-06',
    amount: 1_850,
    glAccountCode: '6420',
    glAccountName: 'Travel - Meals',
    submitterId: 'emily-chen',
    approverId: 'marcus-rodriguez',
    memo: 'Client appreciation gift — Whole Foods hampers',
    attachmentCount: 1,
  }),
  tx({
    transactionId: 'BILL-43922',
    type: 'vendor-bill',
    entityId: 'entity-uk',
    periodId: '2026-04',
    date: '2026-04-04',
    amount: 38_400,
    vendorId: 'vendor-linkedin-ads',
    glAccountCode: '6200',
    glAccountName: 'Marketing - Advertising',
    submitterId: 'lisa-zhang',
    approverId: 'marcus-rodriguez',
    memo: 'UK market entry campaign',
    attachmentCount: 0,
  }),
  tx({
    transactionId: 'BILL-43925',
    type: 'vendor-bill',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-02',
    amount: 25_400,
    vendorId: 'vendor-pwc',
    glAccountCode: '6520',
    glAccountName: 'Tax Preparation',
    submitterId: 'emily-chen',
    approverId: 'priya-patel',
    memo: '2025 tax return preparation',
    attachmentCount: 2,
    createdAt: '2026-04-02T05:22:00Z', // early AM
    submittedAt: '2026-04-02T05:22:00Z',
  }),

  // 27-30. February 2026 anomalies (history)
  tx({
    transactionId: 'BILL-43814',
    type: 'vendor-bill',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-09',
    amount: 40_000,
    vendorId: 'vendor-wsgr',
    glAccountCode: '6500',
    glAccountName: 'Legal Fees',
    submitterId: 'priya-patel',
    approverId: 'priya-patel',
    memo: 'Ongoing counsel retainer',
    attachmentCount: 0,
  }),
  tx({
    transactionId: 'BILL-43818',
    type: 'vendor-bill',
    entityId: 'entity-ca',
    periodId: '2026-04',
    date: '2026-04-03',
    amount: 27_500,
    vendorId: 'vendor-pwc',
    glAccountCode: '6520',
    glAccountName: 'Tax Preparation',
    submitterId: 'marcus-rodriguez',
    approverId: 'priya-patel',
    memo: 'Canada GST/HST filing',
    attachmentCount: 1,
  }),

  // ---- New rule-targeted anomaly transactions ----

  // rule-class-blank: class explicitly left blank
  tx({
    transactionId: 'BILL-44039',
    type: 'vendor-bill',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-16',
    amount: 4_800,
    vendorId: 'vendor-gusto',
    glAccountCode: '6030',
    glAccountName: 'Payroll Processing',
    submitterId: 'jennifer-wu',
    approverId: 'marcus-rodriguez',
    memo: 'April 2026 contractor payroll run',
    class: '',
    attachmentCount: 1,
  }),

  // rule-location-blank: location explicitly left blank
  tx({
    transactionId: 'BILL-44040',
    type: 'vendor-bill',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-17',
    amount: 7_250,
    vendorId: 'vendor-comcast',
    glAccountCode: '6320',
    glAccountName: 'Internet & Telecom',
    submitterId: 'jennifer-wu',
    approverId: 'marcus-rodriguez',
    memo: 'April 2026 internet service',
    location: '',
    attachmentCount: 1,
  }),

  // rule-different-year: GL date is 2025, period is 2026-04
  tx({
    transactionId: 'BILL-44041',
    type: 'vendor-bill',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2025-04-14',
    amount: 12_400,
    vendorId: 'vendor-marsh-insurance',
    glAccountCode: '6610',
    glAccountName: 'D&O Insurance',
    submitterId: 'jennifer-wu',
    approverId: 'priya-patel',
    memo: 'D&O renewal premium',
    attachmentCount: 1,
    createdAt: '2026-04-14T10:00:00Z',
    submittedAt: '2026-04-14T10:00:00Z',
    approvedAt: '2026-04-14T11:30:00Z',
  }),

  // rule-negative-invoice: vendor bill with negative amount (should be credit memo)
  tx({
    transactionId: 'BILL-44042',
    type: 'vendor-bill',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-11',
    amount: -3_200,
    vendorId: 'vendor-salesforce',
    glAccountCode: '6130',
    glAccountName: 'Sales & Marketing Tools',
    submitterId: 'david-park',
    approverId: 'marcus-rodriguez',
    memo: 'Credit memo for overpayment on SFDC-APR2026-001',
    attachmentCount: 1,
    invoiceNumber: 'SFDC-CR-2026-04',
  }),

  // rule-zero-dollar: $0.00 placeholder journal entry
  tx({
    transactionId: 'JE-2026-045',
    type: 'journal-entry',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-08',
    amount: 0,
    glAccountCode: '2100',
    glAccountName: 'Accrued Expenses',
    submitterId: 'emily-chen',
    approverId: 'priya-patel',
    memo: 'Q2 vendor invoice accrual',
    attachmentCount: 0,
    createdAt: '2026-04-08T09:10:00Z',
    submittedAt: '2026-04-08T09:10:00Z',
    approvedAt: '2026-04-08T10:45:00Z',
  }),

  // rule-prepaid-under-threshold: prepaid account, amount < $2,500
  tx({
    transactionId: 'BILL-44043',
    type: 'vendor-bill',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-09',
    amount: 1_850,
    vendorId: 'vendor-1password',
    glAccountCode: '1510',
    glAccountName: 'Prepaid Software Licenses',
    submitterId: 'david-park',
    approverId: 'marcus-rodriguez',
    memo: 'Annual license renewal (prepaid)',
    attachmentCount: 1,
  }),

  // rule-one-time-vendor-high-value: no established vendor, memo calls it out
  tx({
    transactionId: 'BILL-44044',
    type: 'vendor-bill',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-23',
    amount: 112_000,
    vendorName: 'Peak Project Consulting LLC',
    glAccountCode: '6040',
    glAccountName: 'Contractors & Consultants',
    submitterId: 'david-park',
    approverId: 'marcus-rodriguez',
    memo: 'Strategic project support',
    attachmentCount: 1,
    invoiceNumber: 'PEAK-APR-2026-001',
  }),

  // rule-dept-account-conflict: Marketing department coded to Legal Fees account
  tx({
    transactionId: 'BILL-44045',
    type: 'vendor-bill',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-15',
    amount: 18_500,
    vendorId: 'vendor-wsgr',
    glAccountCode: '6500',
    glAccountName: 'Legal Fees',
    department: 'Marketing',
    submitterId: 'lisa-zhang',
    approverId: 'marcus-rodriguez',
    memo: 'Trademark filing for Q2 campaign materials',
    attachmentCount: 1,
  }),

  // AI — elevated reversal rate: Emily Chen's 4th JE reversal this period
  tx({
    transactionId: 'JE-2026-046',
    type: 'journal-entry',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-23',
    amount: 23_400,
    glAccountCode: '2100',
    glAccountName: 'Accrued Expenses',
    submitterId: 'emily-chen',
    approverId: 'priya-patel',
    memo: 'Q1 vendor accrual true-up',
    attachmentCount: 0,
    createdAt: '2026-04-23T10:15:00Z',
    submittedAt: '2026-04-23T10:15:00Z',
    approvedAt: '2026-04-23T11:40:00Z',
  }),

  // AI — frequency anomaly: Deloitte's 3rd invoice in April (historical avg 1.1/month)
  tx({
    transactionId: 'BILL-44046',
    type: 'vendor-bill',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-25',
    amount: 38_500,
    vendorId: 'vendor-deloitte',
    glAccountCode: '6510',
    glAccountName: 'Accounting & Audit Fees',
    submitterId: 'emily-chen',
    approverId: 'priya-patel',
    memo: 'Additional Q2 planning and transition services',
    attachmentCount: 1,
    invoiceNumber: 'DTT-2026-APR-003',
  }),

  // AI — entry source: manual JE to account 6130 (normally system-posted via integrations)
  tx({
    transactionId: 'JE-2026-047',
    type: 'journal-entry',
    entityId: 'entity-us',
    periodId: '2026-04',
    date: '2026-04-23',
    amount: 142_000,
    glAccountCode: '6130',
    glAccountName: 'Sales & Marketing Tools',
    submitterId: 'jennifer-wu',
    approverId: 'marcus-rodriguez',
    memo: 'Q1 seat overage correction',
    attachmentCount: 1,
    class: '',
    location: 'United States',
    createdAt: '2026-04-23T14:30:00Z',
    submittedAt: '2026-04-23T14:30:00Z',
    approvedAt: '2026-04-23T16:00:00Z',
  }),

  // AI — currency anomaly: WSGR invoice submitted in EUR (all prior invoices in USD)
  tx({
    transactionId: 'BILL-44047',
    type: 'vendor-bill',
    entityId: 'entity-uk',
    periodId: '2026-04',
    date: '2026-04-24',
    amount: 45_800,
    vendorId: 'vendor-wsgr',
    glAccountCode: '6500',
    glAccountName: 'Legal Fees',
    submitterId: 'priya-patel',
    approverId: 'marcus-rodriguez',
    memo: 'UK IP filing (EUR-denominated)',
    attachmentCount: 1,
    invoiceNumber: 'WSGR-UK-EUR-2026-APR',
  }),
];

// ======================================================================
// Export: all transactions combined
// ======================================================================

export const transactions: Transaction[] = [
  ...recurringTransactions,
  ...referenceTransactions,
  ...anomalyTransactions,
];

export function getTransaction(id: string): Transaction | undefined {
  return transactions.find((t) => t.id === id);
}

export function getTransactionByERPId(erpId: string): Transaction | undefined {
  return transactions.find((t) => t.transactionId === erpId);
}
