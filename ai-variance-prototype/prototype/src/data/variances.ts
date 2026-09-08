export type Status = 'not-started' | 'in-progress' | 'ready-for-review' | 'signed-off';

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  color: string;
  avatar: string;
}

export interface SupportingTransaction {
  id: string;
  date: string;
  effectiveDate?: string;
  jeNumber: string;
  description: string;
  debit: number;
  credit: number;
  amount: number;
  currency: string;
  glAccount: string;
  costCenter: string;
  postedBy: string;
  approvalStatus: 'approved' | 'pending' | 'under-review';
  docRef?: string;
}

export interface VarianceItem {
  id: string;
  accountName: string;
  accountNumber: string;
  department: string;
  currentAmount: number;
  priorAmount: number;
  changeAmount: number;
  changePercent: number;
  amountType: string;
  status: Status;
  /** AI-generated bullet explanations (pre-drafted) */
  aiExplanation: string[];
  /** User-edited free-text override — present when preparer has saved a draft */
  draftExplanation?: string;
  /** Explanation carried forward from the prior period for reference */
  priorPeriodExplanation?: string;
  notes?: string;
  preparer: TeamMember;
  reviewer: TeamMember;
  signedOffAt?: string;
  supportingTransactions?: SupportingTransaction[];
}

export interface Collection {
  id: string;
  name: string;
  periodType: string;
  statementType: string;
  currentPeriod: string;
  priorPeriod: string;
  items: VarianceItem[];
}

// ─── Team ────────────────────────────────────────────────────────────────────

export const TEAM: Record<string, TeamMember> = {
  brenda: { id: 'brenda', name: 'Brenda Song',    initials: 'BS', color: '#6366f1', avatar: 'https://i.pravatar.cc/56?img=47' },
  david:  { id: 'david',  name: 'David Jung',     initials: 'DJ', color: '#0ea5e9', avatar: 'https://i.pravatar.cc/56?img=69' },
  tyler:  { id: 'tyler',  name: 'Tyler Davis',    initials: 'TD', color: '#f59e0b', avatar: 'https://i.pravatar.cc/56?img=33' },
  edith:  { id: 'edith',  name: 'Edith Espinoza', initials: 'EE', color: '#10b981', avatar: 'https://i.pravatar.cc/56?img=25' },
};

export const CURRENT_USER = TEAM.brenda;

// ─── Seed data ────────────────────────────────────────────────────────────────

export const COLLECTIONS: Collection[] = [
  {
    id: 'multi-income-statement',
    name: 'MoM Income Statement',
    periodType: 'Month over Month',
    statementType: 'Income Statement',
    currentPeriod: 'Mar 2026',
    priorPeriod: 'Feb 2026',
    items: [
      {
        id: 'mis-sales',
        accountName: 'Sales',
        accountNumber: 'A101',
        department: 'Revenue',
        currentAmount: 812450,
        priorAmount: 767450,
        changeAmount: 45000,
        changePercent: 5.9,
        amountType: 'Functional Default',
        status: 'not-started',
        preparer: TEAM.brenda,
        reviewer: TEAM.david,
        aiExplanation: [
          'Enterprise license renewals drove +$28.4k, representing the Q1 annual renewal cycle for 14 accounts. Average contract value increased 6.2% vs. the prior renewal cohort.',
          'Platform services added +$11.2k from 3 new mid-market customers onboarded in March — Acme Corp, Pinnacle Financial, and NorthStar Logistics.',
          'Professional services contributed +$8.1k from Phase 2 implementation work on the Acme Corp ERP integration project (kicked off March 3).',
          'Standard tier showed -$2.7k due to 4 customer downgrades processed mid-month, moving to the Starter plan as part of a promotional retention offer.',
        ],
        supportingTransactions: [
          { id: 'je-mis-1', date: '2026-03-01', effectiveDate: '2026-03-01', jeNumber: 'JE-2026-0312', description: 'Acme Corp — Q1 enterprise license renewal (14 accounts)', debit: 0, credit: 28400, amount: 28400, currency: 'USD', glAccount: 'A101', costCenter: 'Revenue', postedBy: 'B. Song', approvalStatus: 'approved', docRef: 'MSA-2026-031' },
          { id: 'je-mis-2', date: '2026-03-05', effectiveDate: '2026-03-04', jeNumber: 'JE-2026-0318', description: 'Pinnacle Financial — platform onboarding', debit: 0, credit: 6200, amount: 6200, currency: 'USD', glAccount: 'A101', costCenter: 'Revenue', postedBy: 'B. Song', approvalStatus: 'approved', docRef: 'MSA-2026-028' },
          { id: 'je-mis-3', date: '2026-03-05', effectiveDate: '2026-03-04', jeNumber: 'JE-2026-0319', description: 'NorthStar Logistics — platform onboarding', debit: 0, credit: 5000, amount: 5000, currency: 'USD', glAccount: 'A101', costCenter: 'Revenue', postedBy: 'B. Song', approvalStatus: 'approved', docRef: 'MSA-2026-029' },
          { id: 'je-mis-4', date: '2026-03-10', effectiveDate: '2026-03-10', jeNumber: 'JE-2026-0324', description: 'Acme Corp — Phase 2 ERP implementation (professional services)', debit: 0, credit: 8100, amount: 8100, currency: 'USD', glAccount: 'A101', costCenter: 'Revenue', postedBy: 'B. Song', approvalStatus: 'approved' },
          { id: 'je-mis-5', date: '2026-03-15', effectiveDate: '2026-03-15', jeNumber: 'JE-2026-0341', description: 'Starter plan downgrade credits — 4 accounts', debit: 2700, credit: 0, amount: -2700, currency: 'USD', glAccount: 'A101', costCenter: 'Revenue', postedBy: 'B. Song', approvalStatus: 'under-review' },
        ],
      },
      {
        id: 'mis-sales-merch',
        accountName: 'Sales – Merchandise',
        accountNumber: 'A102',
        department: 'Revenue',
        currentAmount: 226000,
        priorAmount: 234000,
        changeAmount: -8000,
        changePercent: -3.4,
        amountType: 'Functional Default',
        status: 'in-progress',
        preparer: TEAM.brenda,
        reviewer: TEAM.david,
        aiExplanation: [
          'Merchandise revenue decline of $8,000 reflects end-of-season clearance sell-through that occurred in February — no comparable activity in March.',
          'March returns to normalized run rate; no active promotional pricing or markdown campaigns in the current period.',
          'Channel mix: direct sales down $5.2k, partially offset by distributor channel gains of $2.8k from expanded Pacific Northwest coverage.',
        ],
        draftExplanation:
          'Merchandise revenue declined $8k MoM primarily due to end-of-season clearance activity in February that did not recur in March. Direct channel down $5.2k, distributor channel up $2.8k. March reflects normalized run rate — no active promotions.',
        priorPeriodExplanation:
          'Merchandise revenue increased $12k in February driven by end-of-season clearance campaign (Jan 15 – Feb 10). Promotional pricing on 3 SKU categories contributed $9.4k; distributor channel flat. Expected to normalize in March once clearance activity winds down.',
        supportingTransactions: [
          { id: 'je-merch-1', date: '2026-03-03', effectiveDate: '2026-03-03', jeNumber: 'JE-2026-0315', description: 'Direct channel — March merchandise sales', debit: 5200, credit: 0, amount: -5200, currency: 'USD', glAccount: 'A102', costCenter: 'Revenue', postedBy: 'B. Song', approvalStatus: 'approved' },
          { id: 'je-merch-2', date: '2026-03-12', effectiveDate: '2026-03-11', jeNumber: 'JE-2026-0329', description: 'Pacific Northwest distributor — expanded coverage', debit: 0, credit: 2800, amount: 2800, currency: 'USD', glAccount: 'A102', costCenter: 'Revenue', postedBy: 'B. Song', approvalStatus: 'approved', docRef: 'PO-2026-0088' },
          { id: 'je-merch-3', date: '2026-03-28', effectiveDate: '2026-03-28', jeNumber: 'JE-2026-0358', description: 'End-of-season returns reversal', debit: 5600, credit: 0, amount: -5600, currency: 'USD', glAccount: 'A102', costCenter: 'Revenue', postedBy: 'T. Davis', approvalStatus: 'pending' },
        ],
      },
      {
        id: 'mis-sales-service',
        accountName: 'Sales – Service',
        accountNumber: 'A104',
        department: 'Revenue',
        currentAmount: 87000,
        priorAmount: 81500,
        changeAmount: 5500,
        changePercent: 6.7,
        amountType: 'Functional Default',
        status: 'not-started',
        preparer: TEAM.brenda,
        reviewer: TEAM.david,
        aiExplanation: [
          'Service revenue growth driven by 2 new managed service contracts activated March 1 — Pinnacle Financial ($42k ARR) and NorthStar Logistics ($36k ARR).',
          'Recurring maintenance fees increased $3.1k following annual rate adjustment (CPI + 4.2%), effective January 1, 2026.',
          'One-time implementation fee of $1.8k from Pinnacle Financial onboarding, partially offset by a $0.9k early-termination credit on a legacy contract.',
          'Supporting documentation: MSA-2026-031 (Pinnacle), MSA-2026-028 (NorthStar).',
        ],
        supportingTransactions: [
          { id: 'je-svc-1', date: '2026-03-01', effectiveDate: '2026-03-01', jeNumber: 'JE-2026-0310', description: 'Pinnacle Financial — managed service contract activation (pro-rated Mar)', debit: 0, credit: 2000, amount: 2000, currency: 'USD', glAccount: 'A104', costCenter: 'Revenue', postedBy: 'B. Song', approvalStatus: 'approved', docRef: 'MSA-2026-031' },
          { id: 'je-svc-2', date: '2026-03-01', effectiveDate: '2026-03-01', jeNumber: 'JE-2026-0311', description: 'NorthStar Logistics — managed service contract activation (pro-rated Mar)', debit: 0, credit: 1700, amount: 1700, currency: 'USD', glAccount: 'A104', costCenter: 'Revenue', postedBy: 'B. Song', approvalStatus: 'approved', docRef: 'MSA-2026-028' },
          { id: 'je-svc-3', date: '2026-03-01', effectiveDate: '2026-02-28', jeNumber: 'JE-2026-0313', description: 'Annual maintenance fee rate adjustment (CPI +4.2%) — monthly incremental', debit: 0, credit: 1500, amount: 1500, currency: 'USD', glAccount: 'A104', costCenter: 'Revenue', postedBy: 'E. Espinoza', approvalStatus: 'approved' },
          { id: 'je-svc-4', date: '2026-03-08', effectiveDate: '2026-03-08', jeNumber: 'JE-2026-0320', description: 'Pinnacle Financial — Phase 1 implementation fee', debit: 0, credit: 1200, amount: 1200, currency: 'USD', glAccount: 'A104', costCenter: 'Revenue', postedBy: 'B. Song', approvalStatus: 'approved', docRef: 'SOW-2026-014' },
          { id: 'je-svc-5', date: '2026-03-20', effectiveDate: '2026-03-20', jeNumber: 'JE-2026-0344', description: 'Legacy contract early-termination credit', debit: 900, credit: 0, amount: -900, currency: 'USD', glAccount: 'A104', costCenter: 'Revenue', postedBy: 'B. Song', approvalStatus: 'under-review' },
        ],
      },
    ],
  },
  {
    id: 'grid-variance-collection',
    name: 'QoQ Variance Collection',
    periodType: 'Quarter over Quarter',
    statementType: 'Income Statement',
    currentPeriod: 'Q1 2026',
    priorPeriod: 'Q4 2025',
    items: [
      {
        id: 'gvc-payroll',
        accountName: 'Payroll – Services',
        accountNumber: 'B201',
        department: 'G&A',
        currentAmount: 1245000,
        priorAmount: 1198000,
        changeAmount: 47000,
        changePercent: 3.9,
        amountType: 'Functional Default',
        status: 'not-started',
        preparer: TEAM.brenda,
        reviewer: TEAM.david,
        priorPeriodExplanation:
          'Payroll increase of $31k in Q4 2025 driven by annual merit increases effective October 1 (avg 3.8% across 42 employees) and one mid-quarter engineering contractor converted to FTE. Q4 also included $8.2k in year-end bonus accruals. Benefits costs stable QoQ.',
        aiExplanation: [
          'Headcount increase: 2 new engineering hires onboarded in January contributed $38k of incremental payroll cost on a full-quarter basis.',
          'Benefits cost increased $6.5k tied to the Q1 health plan enrollment period — 12 employees upgraded to family coverage.',
          'Q1 overtime hours totaled 340 hrs vs. 85 hrs in Q4 2025, driven by year-end close support and the product launch preparation sprint.',
          'Q4 2025 included $3k in contractor offboarding credits not present in Q1 2026.',
        ],
        supportingTransactions: [
          { id: 'je-pay-1', date: '2026-01-15', effectiveDate: '2026-01-01', jeNumber: 'JE-2026-0104', description: 'Engineering hire — L. Patel salary (full quarter)', debit: 19000, credit: 0, amount: 19000, currency: 'USD', glAccount: 'B201', costCenter: 'Engineering', postedBy: 'B. Song', approvalStatus: 'approved', docRef: 'OFFER-2026-ENG-01' },
          { id: 'je-pay-2', date: '2026-01-15', effectiveDate: '2026-01-01', jeNumber: 'JE-2026-0105', description: 'Engineering hire — M. Okonkwo salary (full quarter)', debit: 19000, credit: 0, amount: 19000, currency: 'USD', glAccount: 'B201', costCenter: 'Engineering', postedBy: 'B. Song', approvalStatus: 'approved', docRef: 'OFFER-2026-ENG-02' },
          { id: 'je-pay-3', date: '2026-01-31', effectiveDate: '2026-01-01', jeNumber: 'JE-2026-0118', description: 'Q1 health plan enrollment — 12 family upgrades', debit: 6500, credit: 0, amount: 6500, currency: 'USD', glAccount: 'B201', costCenter: 'G&A', postedBy: 'E. Espinoza', approvalStatus: 'approved' },
          { id: 'je-pay-4', date: '2026-03-31', effectiveDate: '2026-03-31', jeNumber: 'JE-2026-0401', description: 'Q1 overtime accrual — 340 hrs @ $7.35/hr avg', debit: 5500, credit: 0, amount: 5500, currency: 'USD', glAccount: 'B201', costCenter: 'Engineering', postedBy: 'B. Song', approvalStatus: 'pending' },
          { id: 'je-pay-5', date: '2025-12-31', effectiveDate: '2025-12-31', jeNumber: 'JE-2025-1218', description: 'Q4 2025 contractor offboarding credit (prior period)', debit: 0, credit: 3000, amount: -3000, currency: 'USD', glAccount: 'B201', costCenter: 'G&A', postedBy: 'T. Davis', approvalStatus: 'approved' },
        ],
      },
      {
        id: 'gvc-software',
        accountName: 'Software Subscriptions',
        accountNumber: 'B304',
        department: 'IT',
        currentAmount: 89500,
        priorAmount: 76200,
        changeAmount: 13300,
        changePercent: 17.5,
        amountType: 'Functional Default',
        status: 'not-started',
        preparer: TEAM.brenda,
        reviewer: TEAM.david,
        priorPeriodExplanation:
          'Software subscriptions decreased $4.2k in Q4 2025 due to decommissioning of two legacy tools (Basecamp $1.2k and Intercom pilot $3k). Salesforce renewal was not yet processed in Q4 — contract was under negotiation through December. No new tools added.',
        aiExplanation: [
          'Salesforce contract renewed in January at a 15% uplift — contributing $8,200 of the $13,300 quarterly increase.',
          'Two new SaaS tools approved in Q1: Snowflake data analytics platform ($3,100/mo) and Wiz security monitoring ($2,000/mo).',
          'Partially offset by decommissioning of legacy Basecamp project management tool, eliminated February 28 (-$1,200/quarter).',
        ],
        supportingTransactions: [
          { id: 'je-sw-1', date: '2026-01-01', effectiveDate: '2026-01-01', jeNumber: 'JE-2026-0101', description: 'Salesforce — annual renewal at 15% uplift', debit: 8200, credit: 0, amount: 8200, currency: 'USD', glAccount: 'B304', costCenter: 'IT', postedBy: 'B. Song', approvalStatus: 'approved', docRef: 'VENDOR-SF-2026' },
          { id: 'je-sw-2', date: '2026-01-15', effectiveDate: '2026-01-15', jeNumber: 'JE-2026-0109', description: 'Snowflake — data analytics platform (net of displaced legacy tooling)', debit: 4300, credit: 0, amount: 4300, currency: 'USD', glAccount: 'B304', costCenter: 'IT', postedBy: 'B. Song', approvalStatus: 'approved', docRef: 'PO-2026-0041' },
          { id: 'je-sw-3', date: '2026-02-01', effectiveDate: '2026-02-01', jeNumber: 'JE-2026-0201', description: 'Wiz — security monitoring (first month, Feb)', debit: 2000, credit: 0, amount: 2000, currency: 'USD', glAccount: 'B304', costCenter: 'IT', postedBy: 'E. Espinoza', approvalStatus: 'approved', docRef: 'PO-2026-0055' },
          { id: 'je-sw-4', date: '2026-02-28', effectiveDate: '2026-02-28', jeNumber: 'JE-2026-0267', description: 'Basecamp — decommission credit (Q1 remaining)', debit: 0, credit: 1200, amount: -1200, currency: 'USD', glAccount: 'B304', costCenter: 'IT', postedBy: 'T. Davis', approvalStatus: 'approved' },
        ],
      },
      {
        id: 'gvc-prof-services',
        accountName: 'Professional Services',
        accountNumber: 'C412',
        department: 'G&A',
        currentAmount: 334000,
        priorAmount: 298000,
        changeAmount: 36000,
        changePercent: 12.1,
        amountType: 'Functional Default',
        status: 'signed-off',
        signedOffAt: '2026-04-02',
        preparer: TEAM.brenda,
        reviewer: TEAM.david,
        aiExplanation: [
          'Year-end audit preparation services from Deloitte: $18,400 in Q1 vs. $0 in Q4 2025 (prior-period audit costs were recognized in Q3 2025).',
          'Legal retainer fees increased $12,000 following contract renegotiation — from $24k/quarter to $36k/quarter, effective January 2026.',
          'SOX compliance consulting added $6,200 for remediation work on control deficiencies identified in the Q3 2025 internal audit.',
          'Remaining $600 variance relates to travel and expense reimbursements for on-site visits in Q1.',
        ],
        draftExplanation:
          'Q1 increase driven by three factors: (1) Deloitte year-end audit prep $18.4k — not in Q4; (2) legal retainer renegotiated +$12k/qtr effective Jan 2026; (3) SOX remediation consulting $6.2k from Q3 audit findings. Remaining $600 is T&E.',
      },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formatDollar(n: number): string {
  const abs = Math.abs(n);
  const prefix = n < 0 ? '-' : '+';
  if (abs >= 1_000_000) return `${prefix}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000)     return `${prefix}$${(abs / 1_000).toFixed(0)}k`;
  return `${prefix}$${abs.toLocaleString('en-US')}`;
}

export function formatDollarFull(n: number): string {
  return `$${Math.abs(n).toLocaleString('en-US')}`;
}

export function formatPercent(n: number): string {
  return `${n > 0 ? '+' : ''}${n.toFixed(1)}%`;
}

export function allItems(collections: Collection[]): VarianceItem[] {
  return collections.flatMap((c) => c.items);
}

export function findItem(
  collections: Collection[],
  itemId: string,
): { item: VarianceItem; collection: Collection; index: number; total: number } | null {
  for (const collection of collections) {
    const idx = collection.items.findIndex((i) => i.id === itemId);
    if (idx !== -1) {
      return {
        item: collection.items[idx],
        collection,
        index: idx,
        total: collection.items.length,
      };
    }
  }
  return null;
}

/** Returns the item before the given one across all collections, or null. */
export function prevItem(
  collections: Collection[],
  itemId: string,
): VarianceItem | null {
  const flat = allItems(collections);
  const idx = flat.findIndex((i) => i.id === itemId);
  return idx > 0 ? flat[idx - 1] : null;
}

/** Returns the item after the given one across all collections, or null. */
export function nextItem(
  collections: Collection[],
  itemId: string,
): VarianceItem | null {
  const flat = allItems(collections);
  const idx = flat.findIndex((i) => i.id === itemId);
  return idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;
}
