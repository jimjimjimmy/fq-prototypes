export type PlaybookStatus = 'Live' | 'Draft' | 'Pending Approval' | 'Approved'
export type PlaybookType = 'Playbook' | 'Workflow' | 'Agent'

export interface Playbook {
  id: string
  name: string
  description: string
  type: PlaybookType
  status: PlaybookStatus
  version?: string
  lastRun?: string
  lastEdit?: string
  owners: string[]
  folderId: string
  isNew?: boolean
}

export interface Folder {
  id: string
  name: string
  parentId: string | null
}

export const FOLDERS: Folder[] = [
  { id: 'ap', name: 'Accounts Payable', parentId: null },
  { id: 'ar', name: 'Accounts Receivable', parentId: null },
  { id: 'fixed-assets', name: 'Fixed Assets', parentId: null },
  { id: 'leases', name: 'Leases', parentId: null },
  { id: 'corp-accruals', name: 'Accruals (Corporate / Non-AP)', parentId: null },
  { id: 'revenue', name: 'Revenue Recognition', parentId: null },
  { id: 'cash', name: 'Cash', parentId: null },
  { id: 'credit-cards', name: 'Credit Cards', parentId: null },
  { id: 'payroll', name: 'Payroll', parentId: null },
  { id: 'intercompany', name: 'Intercompany', parentId: null },
  { id: 'trial-balance', name: 'Trial Balance', parentId: null },
]

export const PLAYBOOKS: Playbook[] = [
  // Accounts Payable
  {
    id: 'pb-1',
    name: 'Coupa PO Accrual',
    description: 'Automates the identification and calculation of month-end accruals, scanning open POs, uninvoiced receipts, and vendor activity to generate draft journal entries with full auditability.',
    type: 'Playbook',
    status: 'Live',
    lastRun: 'Mar 25',
    owners: ['SC'],
    folderId: 'ap',
  },
  {
    id: 'pb-2',
    name: 'Accrual Variance & True-Up',
    description: 'Compares prior-period accruals to actual invoices received, identifies material variances, and generates recommended true-up journal entries to correct under- or over-accruals.',
    type: 'Workflow',
    status: 'Draft',
    lastEdit: '3/10/26',
    owners: ['SJ'],
    folderId: 'ap',
  },
  {
    id: 'pb-3',
    name: 'Unbilled & GRNI Accrual',
    description: 'Identifies goods received but not yet invoiced (GRNI) from the receiving log, calculates the accrual obligation per PO line, and stages draft JEs for review before ERP posting.',
    type: 'Playbook',
    status: 'Live',
    lastRun: '3/25/26',
    owners: ['SC', 'MK'],
    folderId: 'ap',
  },
  {
    id: 'pb-4',
    name: 'AP Aging Analysis',
    description: 'Generates a stratified AP aging report, flags invoices past due by 30/60/90+ days, identifies duplicate invoices, and surfaces vendors with unusual payment concentration.',
    type: 'Playbook',
    status: 'Live',
    lastRun: 'Mar 25',
    owners: ['SC'],
    folderId: 'ap',
  },
  {
    id: 'pb-5',
    name: 'Invoice Completeness Review',
    description: 'Reconciles vendor invoices received against POs issued and receipts logged, identifies missing or unmatched invoices, and flags exceptions requiring AP follow-up before period close.',
    type: 'Playbook',
    status: 'Live',
    lastRun: 'Mar 24',
    owners: ['MK'],
    folderId: 'ap',
  },
  {
    id: 'pb-6',
    name: 'AP Cutoff Test',
    description: 'Tests that invoices dated on or before period-end are recorded in the correct period and that post-cutoff invoices are excluded, producing a cutoff exception schedule for auditor review.',
    type: 'Playbook',
    status: 'Live',
    lastRun: 'Mar 25',
    owners: ['SC'],
    folderId: 'ap',
  },
  {
    id: 'pb-7',
    name: 'Three-Way Match Review',
    description: 'Matches POs, receiving reports, and vendor invoices to identify line-item discrepancies. Flags quantity, price, and terms mismatches before payment authorization.',
    type: 'Playbook',
    status: 'Draft',
    version: 'V1',
    lastEdit: 'May 6',
    owners: ['JV'],
    folderId: 'ap',
  },
  {
    id: 'pb-8',
    name: 'Vendor Statement Reconciliation',
    description: 'Reconciles vendor statements to the AP sub-ledger, identifies outstanding invoices, unapplied credits, and disputed items, and generates a reconciliation memo for management review.',
    type: 'Playbook',
    status: 'Live',
    lastRun: 'Mar 20',
    owners: ['SC'],
    folderId: 'ap',
  },
  {
    id: 'pb-9',
    name: 'Payment Run Validation',
    description: 'Validates the AP payment run against authorized invoices, checks for duplicate payments, confirms bank account accuracy for new or changed vendors, and flags payments exceeding approval thresholds.',
    type: 'Playbook',
    status: 'Live',
    lastRun: 'Mar 22',
    owners: ['SC'],
    folderId: 'ap',
  },
  {
    id: 'ag-1',
    name: 'Accounts Payable Agent',
    description: 'Matches POs to invoices and goods receipts; flags exceptions for review and routes discrepancies to the appropriate AP team member for resolution.',
    type: 'Agent',
    status: 'Live',
    lastRun: 'Mar 25',
    owners: ['SC'],
    folderId: 'ap',
  },
  {
    id: 'ag-2',
    name: 'AP Accruals Drafter',
    description: 'Drafts month-end accrual JEs from open POs and contracts, cross-referencing receiving logs and vendor terms to ensure completeness before controller review.',
    type: 'Agent',
    status: 'Live',
    lastRun: 'Mar 31',
    owners: ['SC'],
    folderId: 'ap',
  },

  // Accounts Receivable
  {
    id: 'ag-3',
    name: 'AR Aging Analyzer',
    description: 'Flags anomalies in customer aging buckets and unusual collection patterns, surfaces accounts at risk of write-off, and generates a prioritized collections action list.',
    type: 'Agent',
    status: 'Live',
    lastRun: 'Apr 1',
    owners: ['MK'],
    folderId: 'ar',
  },

  // Cash
  {
    id: 'ag-4',
    name: 'Bank Reconciliation Matcher',
    description: 'Matches bank statement transactions to GL entries, flags unreconciled items, and produces a daily reconciliation summary with exception details for treasury review.',
    type: 'Agent',
    status: 'Live',
    lastRun: 'Apr 2',
    owners: ['SC'],
    folderId: 'cash',
  },

  // Credit Cards
  {
    id: 'ag-5',
    name: 'Ramp Transaction Classifier',
    description: 'Classifies card transactions to GL accounts using policy rules, flags out-of-policy spend, and prepares a monthly coding summary for approval before journal entry posting.',
    type: 'Agent',
    status: 'Live',
    lastRun: 'Mar 31',
    owners: ['JV'],
    folderId: 'credit-cards',
  },

  // Fixed Assets
  {
    id: 'ag-6',
    name: 'Depreciation JE Drafter',
    description: 'Calculates and drafts monthly depreciation journal entries across all asset classes, validates against the fixed asset register, and flags additions or disposals requiring adjustment.',
    type: 'Agent',
    status: 'Live',
    lastRun: 'Mar 31',
    owners: ['SC'],
    folderId: 'fixed-assets',
  },

  // Leases
  {
    id: 'ag-7',
    name: 'Lease Schedule Computer',
    description: 'Computes ROU asset and lease liability amortization schedules under ASC 842, generates monthly journal entries, and reconciles balances to the lease management system.',
    type: 'Agent',
    status: 'Live',
    lastRun: 'Mar 31',
    owners: ['SC'],
    folderId: 'leases',
  },

  // Revenue Recognition
  {
    id: 'ag-8',
    name: 'Revenue Recognition Drafter',
    description: 'Drafts ASC 606 revenue allocation entries from contract performance obligations, applies variable consideration estimates, and prepares a disclosure-ready rollforward.',
    type: 'Agent',
    status: 'Live',
    lastRun: 'Mar 31',
    owners: ['SJ'],
    folderId: 'revenue',
    isNew: true,
  },
]
