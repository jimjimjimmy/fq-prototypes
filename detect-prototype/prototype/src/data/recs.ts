/**
 * Reconciliation rows for the Close → Reconciliations page.
 *
 * Mirrors the Figma reference (node 87:43232). The table is a high-fidelity
 * scaffold for the prototype — a few rows surface anomaly badges so we can
 * demonstrate the Rex → Detect bridge per Gaurav's 5.8.26 sync.
 */

import { team } from './team';

export type RecAssigneeRole = 'Preparer' | 'Reviewer';

export interface RecAssignee {
  memberId: string; // → team member id
  role: RecAssigneeRole;
  signedOff: boolean;
  signedOffAt?: string; // ISO date
  /** When true, render the date in danger-orange (signed off late). */
  lateFlag?: boolean;
  dueDate: string;
}

export type RecBadgeTone = 'neutral' | 'warning' | 'info' | 'danger';

export interface RecBadge {
  label: string;
  tone: RecBadgeTone;
  count?: number;
}

export interface RecRow {
  id: string;
  entityName: string;
  entityTag?: string;
  periodFolder: string;
  riskBadges: RecBadge[]; // High Risk / Audit / Reports / +N more

  accountCode: string;
  accountName: string;
  accountSubtype?: string;
  workflowBadges: RecBadge[];

  perNetSuite: number;

  /** When the Rec. Balance is undefined/missing, the cell renders a
   *  "Missing" warning badge in place of the amount. Otherwise, the
   *  numeric `recBalance` is shown. */
  recBalanceStatus?: 'missing' | 'matched';
  recBalance: number;
  /** Number of reconciled line items in this rec. */
  recItems: number;
  difference: number;

  /** Anomaly count surfaced as a badge per Gaurav's 5.8.26 sync — drives
   *  the Rex → Detect pass-through. The standalone "Anomalies" column has
   *  been removed; the count instead lives inline as a chip elsewhere. */
  anomalyCount: number;

  assignees: RecAssignee[];

  commentCount?: number;
  attachmentCount?: number;
}

// Helper — map known team-member ids to their data so the seed reads
// naturally without hand-pasting avatars/names.
const M = (id: string) => team.find((t) => t.id === id)!;
void M;

export const recs: RecRow[] = [
  {
    id: 'rec-1',
    entityName: 'FloQast Corporate',
    entityTag: 'Try It',
    periodFolder: 'Dec 2026 · 01 Cash & Equivalents',
    riskBadges: [
      { label: 'High Risk', tone: 'danger' },
      { label: 'Audit', tone: 'neutral' },
      { label: 'Reports', tone: 'neutral' },
      { label: '+3 more', tone: 'info' },
    ],
    accountCode: '1300',
    accountName: 'Prepaid Expenses',
    accountSubtype: 'AutoRec Amortization',
    workflowBadges: [
      { label: 'Controls', tone: 'info', count: 2 },
      { label: 'Blocked By', tone: 'warning', count: 2 },
      { label: 'Blocks', tone: 'neutral', count: 2 },
    ],
    perNetSuite: 1934918.0,
    recBalanceStatus: 'missing',
    recBalance: 120000.0,
    recItems: 24,
    difference: 0.0,
    anomalyCount: 3,
    assignees: [
      { memberId: 'samantha-sheldon', role: 'Preparer', signedOff: true, signedOffAt: '2026-11-26', dueDate: '2026-11-26' },
      { memberId: 'emily-chen',       role: 'Preparer', signedOff: true, signedOffAt: '2026-11-27', dueDate: '2026-11-26', lateFlag: true },
      { memberId: 'marcus-rodriguez', role: 'Reviewer', signedOff: false, dueDate: '2026-11-26' },
    ],
    commentCount: 2,
    attachmentCount: 2,
  },
  {
    id: 'rec-2',
    entityName: 'FloQast EMEA',
    periodFolder: 'Dec 2026 · 02 Accounts Receivable',
    riskBadges: [
      { label: 'Audit', tone: 'neutral' },
      { label: 'Reports', tone: 'neutral' },
    ],
    accountCode: '1100',
    accountName: 'Accounts Receivable',
    workflowBadges: [{ label: 'Controls', tone: 'info', count: 1 }],
    perNetSuite: 4_212_840.32,
    recBalanceStatus: 'matched',
    recBalance: 4_212_840.32,
    recItems: 38,
    difference: 0.0,
    anomalyCount: 0,
    assignees: [
      { memberId: 'samantha-sheldon', role: 'Preparer', signedOff: true, signedOffAt: '2026-11-22', dueDate: '2026-11-22' },
      { memberId: 'jennifer-wu',      role: 'Reviewer', signedOff: true, signedOffAt: '2026-11-23', dueDate: '2026-11-23' },
    ],
    commentCount: 0,
    attachmentCount: 1,
  },
  {
    id: 'rec-3',
    entityName: 'FloQast Corporate',
    periodFolder: 'Dec 2026 · 04 Accrued Expenses',
    riskBadges: [{ label: 'High Risk', tone: 'danger' }],
    accountCode: '2100',
    accountName: 'Accrued Expenses',
    accountSubtype: 'Manual reconciliation',
    workflowBadges: [
      { label: 'Blocks', tone: 'neutral', count: 1 },
    ],
    perNetSuite: 318_492.18,
    recBalanceStatus: 'matched',
    recBalance: 295_842.18,
    recItems: 12,
    difference: 22_650.0,
    anomalyCount: 1,
    assignees: [
      { memberId: 'emily-chen',       role: 'Preparer', signedOff: false, dueDate: '2026-12-02' },
      { memberId: 'marcus-rodriguez', role: 'Reviewer', signedOff: false, dueDate: '2026-12-04' },
    ],
    commentCount: 4,
    attachmentCount: 0,
  },
  {
    id: 'rec-4',
    entityName: 'FloQast Canada',
    periodFolder: 'Dec 2026 · 05 Subscription Revenue',
    riskBadges: [
      { label: 'Audit', tone: 'neutral' },
      { label: '+1 more', tone: 'info' },
    ],
    accountCode: '4010',
    accountName: 'Subscription Revenue — Platform',
    accountSubtype: 'AutoRec — direct match',
    workflowBadges: [{ label: 'Controls', tone: 'info', count: 1 }],
    perNetSuite: 12_488_392.0,
    recBalanceStatus: 'matched',
    recBalance: 12_488_392.0,
    recItems: 47,
    difference: 0.0,
    anomalyCount: 2,
    assignees: [
      { memberId: 'priya-patel',      role: 'Preparer', signedOff: true, signedOffAt: '2026-11-29', dueDate: '2026-11-29' },
      { memberId: 'samantha-sheldon', role: 'Reviewer', signedOff: false, dueDate: '2026-12-01' },
    ],
    commentCount: 1,
    attachmentCount: 3,
  },
  {
    id: 'rec-5',
    entityName: 'FloQast Corporate',
    periodFolder: 'Dec 2026 · 06 Operating Expenses',
    riskBadges: [{ label: 'Reports', tone: 'neutral' }],
    accountCode: '6040',
    accountName: 'Contractors & Consultants',
    workflowBadges: [],
    perNetSuite: 87_240.0,
    recBalanceStatus: 'matched',
    recBalance: 87_240.0,
    recItems: 8,
    difference: 0.0,
    anomalyCount: 0,
    assignees: [
      { memberId: 'david-park',  role: 'Preparer', signedOff: true,  signedOffAt: '2026-11-25', dueDate: '2026-11-25' },
      { memberId: 'lisa-zhang',  role: 'Reviewer', signedOff: true,  signedOffAt: '2026-11-26', dueDate: '2026-11-26' },
    ],
    commentCount: 0,
    attachmentCount: 0,
  },
  {
    id: 'rec-6',
    entityName: 'FloQast Corporate',
    periodFolder: 'Dec 2026 · 07 Legal & Audit Fees',
    riskBadges: [
      { label: 'Audit', tone: 'neutral' },
      { label: 'High Risk', tone: 'danger' },
    ],
    accountCode: '6500',
    accountName: 'Legal Fees',
    accountSubtype: 'Manual reconciliation',
    workflowBadges: [{ label: 'Blocked By', tone: 'warning', count: 1 }],
    perNetSuite: 142_000.0,
    recBalanceStatus: 'missing',
    recBalance: 117_500.0,
    recItems: 16,
    difference: 24_500.0,
    anomalyCount: 4,
    assignees: [
      { memberId: 'emily-chen',       role: 'Preparer', signedOff: false, dueDate: '2026-12-05' },
      { memberId: 'marcus-rodriguez', role: 'Reviewer', signedOff: false, dueDate: '2026-12-08' },
    ],
    commentCount: 6,
    attachmentCount: 1,
  },
];
