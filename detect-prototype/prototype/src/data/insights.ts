import { entities } from './company';
import { chartOfAccounts } from './chartOfAccounts';
import type { AssigneeReason } from './types';

/**
 * Insights data — per-account "expected but missing" activity that
 * the AI flags from the lookback window. Each Insight corresponds
 * to a single GL account inside a single entity; the missing
 * transactions are listed as sub-rows in the detail middle pane.
 *
 * Per the 5.14.26 sync with Gaurav:
 *   - "It needs to be on a per-account basis, because we don't
 *     want to create a ton of noise here."
 *   - Insights are aggregated at the account level; sign-off is
 *     at the account level too.
 *   - The middle pane shows the lookback context (pulled from
 *     Settings → General → Lookback Period) and the list of
 *     potentially missing transactions.
 *   - "We don't need transaction details here. We just need a
 *     sentence. We're just pointing the customer in a direction."
 *     → the missing-transactions table is intentionally minimal.
 */

export interface InsightMissingTransaction {
  id: string;
  /** Vendor or counterparty the AI expected to see post a
   *  transaction in this account during the lookback window. */
  vendor: string;
  /** Amount the AI predicts — typically derived from the rolling
   *  average of the vendor's historical postings. */
  amount: number;
  /** Optional context fields. Surfaced sparingly in the missing-
   *  transactions table so it stays a "pointer" rather than a
   *  full GL grid. */
  averageHistorical?: number;
  lastPostedPeriod?: string;
  /** Marker for missing transactions that surfaced AFTER the user
   *  signed off on this insight. Drives the redo-state row
   *  highlight + "New" pill in the missing-transactions table. */
  isNew?: boolean;
}

export type InsightStatus = 'open' | 'resolved' | 'redo';

export interface Insight {
  id: string;
  /** Which entity owns this insight. Matches entities.id. */
  entityId: string;
  /** GL account this insight rolls up. Matches chartOfAccounts.code. */
  accountCode: string;
  accountName: string;
  /** Sum of missingTransactions[].amount — cached so the inbox
   *  row doesn't have to recompute on every render. */
  totalAmount: number;
  /** Number of items the AI flagged as missing. */
  missingCount: number;
  /** Human-readable lookback strip ("Last 12 months · May 2025 –
   *  Apr 2026") pulled from Settings → General → Lookback Period
   *  at insight-generation time. */
  lookbackMonths: number;
  lookbackLabel: string;
  /** ISO timestamp the AI surfaced this insight. */
  detectedAt: string;
  status: InsightStatus;
  /** One-sentence framing of what the AI noticed. Shown at the
   *  top of the detail pane — Gaurav: "we just need a sentence
   *  pointing the customer in a direction." */
  summary: string;
  /** Team members assigned to review this insight. Reuses the
   *  same team-member IDs as everywhere else in the prototype. */
  assigneeIds: string[];
  /** Per-assignee reason mapping. Powers the AssigneeReasonPopover
   *  in the Insights detail rail. Optional — falls back to a
   *  generic "manual" rendering for insights without seeded data. */
  assigneeReasons?: Record<string, AssigneeReason>;
  /** Audit trail for the sign-off lifecycle. Populated when status
   *  flips to 'resolved'; cleared / overwritten when the redo
   *  state triggers a re-review. */
  resolvedById?: string;
  resolvedAt?: string;
  /** Per-assignee sign-offs. Key is the member's id. `byId` is the
   *  user who attested (may equal the assignee for a self sign-off,
   *  or differ for an override). `at` is the ISO timestamp of the
   *  attestation, used to detect stale sign-offs in the redo state
   *  (a new missing transaction surfaced after this timestamp). */
  signOffs?: Record<string, { byId: string; at: string }>;
  missingTransactions: InsightMissingTransaction[];
}

/** Helper — entity short name for an insight, for headers/labels. */
export function entityShortName(insight: Insight): string {
  return (
    entities.find((e) => e.id === insight.entityId)?.shortName ??
    insight.entityId
  );
}

/** Helper — pull the chart-of-accounts entry for additional context
 *  (e.g. account type) when the inbox row wants it. */
export function accountFor(insight: Insight) {
  return chartOfAccounts.find((a) => a.code === insight.accountCode);
}

// ──────────────────────────────────────────────────────────────────
// Seed insights
// ──────────────────────────────────────────────────────────────────

export const insights: Insight[] = [
  {
    id: 'ins-accrued-expenses-us',
    entityId: 'entity-us',
    accountCode: '2100',
    accountName: 'Accrued Expenses',
    totalAmount: 128_000,
    missingCount: 6,
    lookbackMonths: 12,
    lookbackLabel: 'Last 12 months · May 2025 – Apr 2026',
    detectedAt: '2026-05-14T09:00:00Z',
    status: 'open',
    summary:
      "Six recurring accrual vendors that typically post to this account every period have no activity for the current period. Detect expected ~$128,000 in total.",
    assigneeIds: ['samantha-sheldon', 'marcus-rodriguez'],
    assigneeReasons: {
      'samantha-sheldon': { type: 'account', entityName: 'FloQast Corporate', accountCode: '2300' },
      'marcus-rodriguez': { type: 'manual', assignedBy: 'Olivia Reed' },
    },
    missingTransactions: [
      {
        id: 'ins-tx-1',
        vendor: 'Amazon Web Services',
        amount: 20_000,
        averageHistorical: 19_400,
        lastPostedPeriod: 'April 2026',
      },
      {
        id: 'ins-tx-2',
        vendor: 'Google Cloud Platform',
        amount: 45_000,
        averageHistorical: 43_800,
        lastPostedPeriod: 'April 2026',
      },
      {
        id: 'ins-tx-3',
        vendor: 'Snowflake',
        amount: 28_500,
        averageHistorical: 27_900,
        lastPostedPeriod: 'April 2026',
      },
      {
        id: 'ins-tx-4',
        vendor: 'Datadog',
        amount: 14_200,
        averageHistorical: 13_800,
        lastPostedPeriod: 'April 2026',
      },
      {
        id: 'ins-tx-5',
        vendor: 'Salesforce',
        amount: 12_300,
        averageHistorical: 12_100,
        lastPostedPeriod: 'April 2026',
      },
      {
        id: 'ins-tx-6',
        vendor: 'Slack Technologies',
        amount: 8_000,
        averageHistorical: 7_900,
        lastPostedPeriod: 'April 2026',
      },
    ],
  },
  {
    id: 'ins-prepaid-software-us',
    entityId: 'entity-us',
    accountCode: '1210',
    accountName: 'Prepaid Software',
    totalAmount: 45_200,
    missingCount: 4,
    lookbackMonths: 12,
    lookbackLabel: 'Last 12 months · May 2025 – Apr 2026',
    detectedAt: '2026-05-14T09:00:00Z',
    status: 'open',
    summary:
      'Recurring annual prepaid software renewals typically posted in May are absent for this period.',
    assigneeIds: ['samantha-sheldon'],
    assigneeReasons: {
      'samantha-sheldon': { type: 'ultimate-owner' },
    },
    missingTransactions: [
      {
        id: 'ins-tx-7',
        vendor: 'Adobe Creative Cloud',
        amount: 18_600,
        averageHistorical: 18_000,
        lastPostedPeriod: 'May 2025',
      },
      {
        id: 'ins-tx-8',
        vendor: 'Figma',
        amount: 12_400,
        averageHistorical: 11_800,
        lastPostedPeriod: 'May 2025',
      },
      {
        id: 'ins-tx-9',
        vendor: 'Notion Labs',
        amount: 8_400,
        averageHistorical: 8_200,
        lastPostedPeriod: 'May 2025',
      },
      {
        id: 'ins-tx-10',
        vendor: 'GitHub Enterprise',
        amount: 5_800,
        averageHistorical: 5_700,
        lastPostedPeriod: 'May 2025',
      },
    ],
  },
  {
    id: 'ins-marketing-us',
    entityId: 'entity-us',
    accountCode: '6200',
    accountName: 'Marketing - Advertising',
    totalAmount: 68_500,
    missingCount: 3,
    lookbackMonths: 12,
    lookbackLabel: 'Last 12 months · May 2025 – Apr 2026',
    detectedAt: '2026-05-14T09:00:00Z',
    status: 'open',
    summary:
      'Monthly digital marketing spend has a steady ~$68K run rate; this period has no posted activity for the top three platforms.',
    assigneeIds: ['emily-chen'],
    missingTransactions: [
      {
        id: 'ins-tx-11',
        vendor: 'Google Ads',
        amount: 38_900,
        averageHistorical: 37_400,
        lastPostedPeriod: 'April 2026',
      },
      {
        id: 'ins-tx-12',
        vendor: 'LinkedIn Marketing',
        amount: 18_200,
        averageHistorical: 17_800,
        lastPostedPeriod: 'April 2026',
      },
      {
        id: 'ins-tx-13',
        vendor: 'Meta Business Suite',
        amount: 11_400,
        averageHistorical: 11_100,
        lastPostedPeriod: 'April 2026',
      },
    ],
  },
  {
    id: 'ins-consulting-us',
    entityId: 'entity-us',
    accountCode: '6040',
    accountName: 'Contractors & Consultants',
    totalAmount: 105_000,
    missingCount: 3,
    lookbackMonths: 12,
    lookbackLabel: 'Last 12 months · May 2025 – Apr 2026',
    detectedAt: '2026-05-14T09:00:00Z',
    status: 'redo',
    summary:
      'Two recurring consulting engagements with a consistent monthly cadence have no activity in the current period. A new finding surfaced after sign-off.',
    assigneeIds: ['samantha-sheldon', 'david-park'],
    // Pre-seeded redo example. Both assignees had signed off; the
    // insight reached the resolved state. Then KPMG (isNew) was
    // flagged after the sign-offs — both attestations are now
    // stale and need re-review.
    resolvedById: 'samantha-sheldon',
    resolvedAt: '2026-05-14T17:30:00Z',
    signOffs: {
      'samantha-sheldon': {
        byId: 'samantha-sheldon',
        at: '2026-05-14T17:30:00Z',
      },
      'david-park': {
        byId: 'david-park',
        at: '2026-05-14T16:15:00Z',
      },
    },
    missingTransactions: [
      {
        id: 'ins-tx-14',
        vendor: 'Deloitte Consulting',
        amount: 62_000,
        averageHistorical: 60_500,
        lastPostedPeriod: 'April 2026',
      },
      {
        id: 'ins-tx-15',
        vendor: 'PwC Advisory',
        amount: 27_500,
        averageHistorical: 27_000,
        lastPostedPeriod: 'April 2026',
      },
      {
        id: 'ins-tx-15b',
        vendor: 'KPMG Advisory',
        amount: 15_500,
        averageHistorical: 15_200,
        lastPostedPeriod: 'April 2026',
        isNew: true,
      },
    ],
  },
  {
    id: 'ins-utilities-uk',
    entityId: 'entity-uk',
    accountCode: '6320',
    accountName: 'Utilities & Internet',
    totalAmount: 8_900,
    missingCount: 3,
    lookbackMonths: 12,
    lookbackLabel: 'Last 12 months · May 2025 – Apr 2026',
    detectedAt: '2026-05-14T09:00:00Z',
    status: 'open',
    summary:
      'Three London-office utility providers that bill monthly have no posted invoices for this period.',
    assigneeIds: ['lisa-zhang'],
    missingTransactions: [
      {
        id: 'ins-tx-16',
        vendor: 'British Gas',
        amount: 4_200,
        averageHistorical: 4_100,
        lastPostedPeriod: 'April 2026',
      },
      {
        id: 'ins-tx-17',
        vendor: 'EDF Energy',
        amount: 3_100,
        averageHistorical: 3_050,
        lastPostedPeriod: 'April 2026',
      },
      {
        id: 'ins-tx-18',
        vendor: 'Thames Water',
        amount: 1_600,
        averageHistorical: 1_550,
        lastPostedPeriod: 'April 2026',
      },
    ],
  },
  {
    id: 'ins-subscriptions-us',
    entityId: 'entity-us',
    accountCode: '6100',
    accountName: 'Software & Subscriptions',
    totalAmount: 12_400,
    missingCount: 8,
    lookbackMonths: 12,
    lookbackLabel: 'Last 12 months · May 2025 – Apr 2026',
    detectedAt: '2026-05-14T09:00:00Z',
    status: 'open',
    summary:
      'Eight small recurring SaaS subscriptions with monthly cadence are missing this period.',
    assigneeIds: ['samantha-sheldon'],
    missingTransactions: [
      { id: 'ins-tx-19', vendor: 'Linear', amount: 2_400, averageHistorical: 2_400, lastPostedPeriod: 'April 2026' },
      { id: 'ins-tx-20', vendor: 'Loom', amount: 1_800, averageHistorical: 1_800, lastPostedPeriod: 'April 2026' },
      { id: 'ins-tx-21', vendor: '1Password', amount: 1_600, averageHistorical: 1_600, lastPostedPeriod: 'April 2026' },
      { id: 'ins-tx-22', vendor: 'Vercel', amount: 1_500, averageHistorical: 1_500, lastPostedPeriod: 'April 2026' },
      { id: 'ins-tx-23', vendor: 'Sentry', amount: 1_400, averageHistorical: 1_400, lastPostedPeriod: 'April 2026' },
      { id: 'ins-tx-24', vendor: 'PagerDuty', amount: 1_300, averageHistorical: 1_300, lastPostedPeriod: 'April 2026' },
      { id: 'ins-tx-25', vendor: 'Mixpanel', amount: 1_200, averageHistorical: 1_200, lastPostedPeriod: 'April 2026' },
      { id: 'ins-tx-26', vendor: 'Intercom', amount: 1_200, averageHistorical: 1_200, lastPostedPeriod: 'April 2026' },
    ],
  },
  {
    id: 'ins-legal-fees-us',
    entityId: 'entity-us',
    accountCode: '6500',
    accountName: 'Legal Fees',
    totalAmount: 42_800,
    missingCount: 2,
    lookbackMonths: 12,
    lookbackLabel: 'Last 12 months · May 2025 – Apr 2026',
    detectedAt: '2026-05-14T09:00:00Z',
    status: 'open',
    summary:
      'Outside counsel typically bills monthly retainers in this account. Two long-standing firms have no invoices for this period.',
    assigneeIds: ['marcus-rodriguez', 'jennifer-wu'],
    missingTransactions: [
      {
        id: 'ins-tx-27',
        vendor: 'Wilson Sonsini Goodrich & Rosati',
        amount: 28_500,
        averageHistorical: 27_900,
        lastPostedPeriod: 'April 2026',
      },
      {
        id: 'ins-tx-28',
        vendor: 'Latham & Watkins',
        amount: 14_300,
        averageHistorical: 14_000,
        lastPostedPeriod: 'April 2026',
      },
    ],
  },
  {
    id: 'ins-hosting-us',
    entityId: 'entity-us',
    accountCode: '5010',
    accountName: 'Hosting Costs (AWS)',
    totalAmount: 36_200,
    missingCount: 2,
    lookbackMonths: 12,
    lookbackLabel: 'Last 12 months · May 2025 – Apr 2026',
    detectedAt: '2026-05-13T09:00:00Z',
    status: 'resolved',
    summary:
      'Two infrastructure providers with monthly billing cadence had no posted activity in the current period.',
    assigneeIds: ['david-park'],
    resolvedById: 'david-park',
    resolvedAt: '2026-05-14T15:42:00Z',
    signOffs: {
      'david-park': { byId: 'david-park', at: '2026-05-14T15:42:00Z' },
    },
    missingTransactions: [
      {
        id: 'ins-tx-29',
        vendor: 'Cloudflare',
        amount: 22_800,
        averageHistorical: 22_300,
        lastPostedPeriod: 'April 2026',
      },
      {
        id: 'ins-tx-30',
        vendor: 'MongoDB Atlas',
        amount: 13_400,
        averageHistorical: 13_100,
        lastPostedPeriod: 'April 2026',
      },
    ],
  },
  {
    id: 'ins-payment-fees-us',
    entityId: 'entity-us',
    accountCode: '5050',
    accountName: 'Payment Processing Fees',
    totalAmount: 58_700,
    missingCount: 2,
    lookbackMonths: 12,
    lookbackLabel: 'Last 12 months · May 2025 – Apr 2026',
    detectedAt: '2026-05-14T09:00:00Z',
    status: 'open',
    summary:
      'Payment processor settlement fees have a steady run rate; this period is missing the two largest processors.',
    assigneeIds: ['emily-chen', 'marcus-rodriguez'],
    missingTransactions: [
      {
        id: 'ins-tx-31',
        vendor: 'Stripe',
        amount: 41_200,
        averageHistorical: 40_100,
        lastPostedPeriod: 'April 2026',
      },
      {
        id: 'ins-tx-32',
        vendor: 'PayPal',
        amount: 17_500,
        averageHistorical: 17_100,
        lastPostedPeriod: 'April 2026',
      },
    ],
  },
  {
    id: 'ins-insurance-us',
    entityId: 'entity-us',
    accountCode: '6600',
    accountName: 'Insurance - General Liability',
    totalAmount: 18_400,
    missingCount: 1,
    lookbackMonths: 12,
    lookbackLabel: 'Last 12 months · May 2025 – Apr 2026',
    detectedAt: '2026-05-12T09:00:00Z',
    status: 'resolved',
    summary:
      'Annual general liability renewal historically posts in May. No activity for this period.',
    assigneeIds: ['samantha-sheldon', 'jennifer-wu'],
    resolvedById: 'jennifer-wu',
    resolvedAt: '2026-05-13T11:20:00Z',
    signOffs: {
      'samantha-sheldon': { byId: 'samantha-sheldon', at: '2026-05-13T10:55:00Z' },
      'jennifer-wu': { byId: 'jennifer-wu', at: '2026-05-13T11:20:00Z' },
    },
    missingTransactions: [
      {
        id: 'ins-tx-33',
        vendor: 'Chubb Insurance',
        amount: 18_400,
        averageHistorical: 17_900,
        lastPostedPeriod: 'May 2025',
      },
    ],
  },
  {
    id: 'ins-travel-airfare-ca',
    entityId: 'entity-ca',
    accountCode: '6400',
    accountName: 'Travel - Airfare',
    totalAmount: 14_900,
    missingCount: 3,
    lookbackMonths: 12,
    lookbackLabel: 'Last 12 months · May 2025 – Apr 2026',
    detectedAt: '2026-05-14T09:00:00Z',
    status: 'open',
    summary:
      'Toronto-based sales team typically books monthly customer-visit airfare. No travel activity has posted this period.',
    assigneeIds: ['lisa-zhang'],
    missingTransactions: [
      {
        id: 'ins-tx-34',
        vendor: 'Air Canada',
        amount: 8_400,
        averageHistorical: 8_100,
        lastPostedPeriod: 'April 2026',
      },
      {
        id: 'ins-tx-35',
        vendor: 'WestJet',
        amount: 4_200,
        averageHistorical: 4_050,
        lastPostedPeriod: 'April 2026',
      },
      {
        id: 'ins-tx-36',
        vendor: 'Porter Airlines',
        amount: 2_300,
        averageHistorical: 2_200,
        lastPostedPeriod: 'April 2026',
      },
    ],
  },
  {
    id: 'ins-office-rent-ca',
    entityId: 'entity-ca',
    accountCode: '6300',
    accountName: 'Office Rent',
    totalAmount: 22_500,
    missingCount: 1,
    lookbackMonths: 12,
    lookbackLabel: 'Last 12 months · May 2025 – Apr 2026',
    detectedAt: '2026-05-14T09:00:00Z',
    status: 'open',
    summary:
      'Toronto office lease has posted on the 1st of every month with a consistent cadence. May rent is not yet recorded.',
    assigneeIds: ['lisa-zhang', 'samantha-sheldon'],
    missingTransactions: [
      {
        id: 'ins-tx-37',
        vendor: 'Brookfield Properties',
        amount: 22_500,
        averageHistorical: 22_500,
        lastPostedPeriod: 'April 2026',
      },
    ],
  },
  {
    id: 'ins-marketing-events-uk',
    entityId: 'entity-uk',
    accountCode: '6210',
    accountName: 'Marketing - Events & Conferences',
    totalAmount: 31_800,
    missingCount: 2,
    lookbackMonths: 12,
    lookbackLabel: 'Last 12 months · May 2025 – Apr 2026',
    detectedAt: '2026-05-14T09:00:00Z',
    status: 'open',
    summary:
      'EMEA hosts a recurring London finance summit in Q2. Sponsorship and venue invoices have not yet posted.',
    assigneeIds: ['emily-chen', 'lisa-zhang'],
    missingTransactions: [
      {
        id: 'ins-tx-38',
        vendor: 'ExCeL London',
        amount: 22_400,
        averageHistorical: 21_800,
        lastPostedPeriod: 'May 2025',
      },
      {
        id: 'ins-tx-39',
        vendor: 'Eventbrite UK',
        amount: 9_400,
        averageHistorical: 9_100,
        lastPostedPeriod: 'May 2025',
      },
    ],
  },
  {
    id: 'ins-recruiting-us',
    entityId: 'entity-us',
    accountCode: '6050',
    accountName: 'Recruiting Fees',
    totalAmount: 47_500,
    missingCount: 2,
    lookbackMonths: 12,
    lookbackLabel: 'Last 12 months · May 2025 – Apr 2026',
    detectedAt: '2026-05-14T09:00:00Z',
    status: 'open',
    summary:
      'Two retained search firms have posted placement fees with a consistent monthly cadence. No invoices have been received yet for the current period.',
    assigneeIds: ['marcus-rodriguez'],
    missingTransactions: [
      {
        id: 'ins-tx-40',
        vendor: 'Heidrick & Struggles',
        amount: 32_000,
        averageHistorical: 31_400,
        lastPostedPeriod: 'April 2026',
      },
      {
        id: 'ins-tx-41',
        vendor: 'Korn Ferry',
        amount: 15_500,
        averageHistorical: 15_200,
        lastPostedPeriod: 'April 2026',
      },
    ],
  },
  {
    id: 'ins-prepaid-insurance-us',
    entityId: 'entity-us',
    accountCode: '1220',
    accountName: 'Prepaid Insurance',
    totalAmount: 9_600,
    missingCount: 1,
    lookbackMonths: 12,
    lookbackLabel: 'Last 12 months · May 2025 – Apr 2026',
    detectedAt: '2026-05-13T09:00:00Z',
    status: 'resolved',
    summary:
      'Quarterly D&O insurance prepayment historically posts at the start of May. No entry recorded yet for this period.',
    assigneeIds: ['samantha-sheldon'],
    resolvedById: 'samantha-sheldon',
    resolvedAt: '2026-05-14T09:18:00Z',
    signOffs: {
      'samantha-sheldon': { byId: 'samantha-sheldon', at: '2026-05-14T09:18:00Z' },
    },
    missingTransactions: [
      {
        id: 'ins-tx-42',
        vendor: 'AIG',
        amount: 9_600,
        averageHistorical: 9_400,
        lastPostedPeriod: 'February 2026',
      },
    ],
  },
];

// ---------- Auto-derive assignment reasons for every insight assignee ----------
//
// Mirrors the seedAnomalies deriver. Insights are AI-surfaced (no
// rule flags), so the only auto-derived categories are `account`
// (dynamic / fallback) and `ultimate-owner`. Carmen 5.28.26.
const ULTIMATE_OWNER_DEFAULT = 'priya-patel';
for (const insight of insights) {
  const entityName =
    entities.find((e) => e.id === insight.entityId)?.shortName ?? insight.entityId;
  const existing = insight.assigneeReasons ?? {};
  const next: Record<string, AssigneeReason> = { ...existing };
  for (const userId of insight.assigneeIds) {
    if (next[userId]) continue;
    if (userId === ULTIMATE_OWNER_DEFAULT) {
      next[userId] = { type: 'ultimate-owner' };
      continue;
    }
    next[userId] = {
      type: 'account',
      entityName,
      accountCode: insight.accountCode,
      accountName: insight.accountName,
    };
  }
  insight.assigneeReasons = next;
}
