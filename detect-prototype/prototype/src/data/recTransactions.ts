/**
 * Transactions for the Reconciliations → Transactions page.
 *
 * Builds the per-rec transaction list dynamically from the canonical
 * Detect data so that:
 *   1. Each rec shows transactions in its OWN GL account — opening a
 *      1300 Prepaid Expenses rec no longer shows 6040 Contractors
 *      transactions.
 *   2. The anomalous rows in this view are exactly the transactions
 *      that have anomaly records in /data/seedAnomalies.ts for the
 *      rec's account. Click → bridge → Detect filters to the same
 *      transactions, counts always match.
 *
 * The 5 non-anomalous rows are synthesized for visual context per
 * account (so the table doesn't render with only anomalies). They use
 * synthetic `JE-…` ids because they have no Detect counterpart and
 * aren't clickable.
 */

import { recs } from './recs';
import { transactions } from './transactions';
import { seedRecords } from './seedAnomalies';

export interface RecTransaction {
  id: string;
  date: string; // ISO
  name: string; // vendor / counterparty
  description: string;
  department: string;
  class: string;
  location: string;
  amount: number;
  currency: string;
  createdAt: string; // ISO datetime
  /** When > 0, the row renders an anomaly badge and becomes clickable. */
  anomalyCount: number;
  /** Drives the badge label in the Anomalies column — "Open" (orange)
   *  when the anomaly is unresolved, "Resolved" (green) once it's
   *  been cleared in Detect. Only meaningful when `anomalyCount > 0`. */
  anomalyStatus?: 'open' | 'resolved';
}

/**
 * Filler context rows used when an account doesn't have enough real
 * transactions in /data/transactions.ts to feel like a populated rec.
 * These are intentionally synthetic (JE-12345…) so they're easy to
 * distinguish from real ERP IDs and they don't bridge to Detect.
 */
const FILLER_ROWS: Omit<RecTransaction, 'id'>[] = [
  {
    date: '2026-04-19',
    name: 'Eight Sleep',
    description: 'Late period accrual reversal',
    department: 'Engineering',
    class: 'Software',
    location: 'San Francisco',
    amount: 18_492.0,
    currency: 'USD',
    createdAt: '2026-04-19T08:14:00Z',
    anomalyCount: 0,
  },
  {
    date: '2026-04-19',
    name: 'Eight Sleep',
    description: 'Friday Team Lunch — onsite catering',
    department: 'Engineering',
    class: 'Office',
    location: 'San Francisco',
    amount: 612.85,
    currency: 'USD',
    createdAt: '2026-04-19T11:02:00Z',
    anomalyCount: 0,
  },
  {
    date: '2026-04-15',
    name: 'Salesforce',
    description: 'Salesforce — CRM seats (annual prepayment)',
    department: 'Go-to-Market',
    class: 'Software',
    location: 'San Francisco',
    amount: 28_400.0,
    currency: 'USD',
    createdAt: '2026-04-15T09:11:00Z',
    anomalyCount: 0,
  },
  {
    date: '2026-04-09',
    name: 'Brex',
    description: 'Corporate card spend — April cycle',
    department: 'Operations',
    class: 'Travel & Expense',
    location: 'San Francisco',
    amount: 9_240.18,
    currency: 'USD',
    createdAt: '2026-04-09T07:55:00Z',
    anomalyCount: 0,
  },
  {
    date: '2026-04-08',
    name: 'WeWork',
    description: 'WeWork — April office lease',
    department: 'Operations',
    class: 'Facilities',
    location: 'San Francisco',
    amount: 24_000.0,
    currency: 'USD',
    createdAt: '2026-04-08T10:12:00Z',
    anomalyCount: 0,
  },
];

export function getRecTransactions(recId: string): RecTransaction[] {
  const rec = recs.find((r) => r.id === recId);
  if (!rec) return [];

  // 1. Look up real transactions in this rec's GL account. transactions.ts
  //    is the canonical source — using it guarantees the rec view and the
  //    Detect inbox draw from the same dataset.
  const accountTxs = transactions.filter(
    (t) => t.glAccountCode === rec.accountCode,
  );

  // 2. Index Detect's anomaly records by internal transaction id so we
  //    can look up the anomaly count + resolution status per tx.
  const anomalyByInternalTxId = new Map<
    string,
    { count: number; allResolved: boolean }
  >();
  for (const record of seedRecords) {
    const prior = anomalyByInternalTxId.get(record.transactionId);
    const isResolved = record.status === 'resolved';
    if (prior) {
      prior.count += 1;
      prior.allResolved = prior.allResolved && isResolved;
    } else {
      anomalyByInternalTxId.set(record.transactionId, {
        count: 1,
        allResolved: isResolved,
      });
    }
  }

  // 3. Convert real transactions to RecTransaction shape. ERP-style id
  //    (e.g. "BILL-44022") is used as the row id so the Close→Detect
  //    bridge can look up the matching Detect record.
  const real: RecTransaction[] = accountTxs.map((t) => {
    const anomaly = anomalyByInternalTxId.get(t.id);
    return {
      id: t.transactionId,
      date: t.date,
      name: t.vendorName ?? '—',
      description: t.memo,
      department: t.department ?? '—',
      class: t.class ?? '—',
      location: t.location ?? '—',
      amount: t.amount,
      currency: t.currency,
      createdAt: t.createdAt,
      anomalyCount: anomaly?.count ?? 0,
      anomalyStatus: anomaly
        ? anomaly.allResolved
          ? 'resolved'
          : 'open'
        : undefined,
    };
  });

  // 4. Top up with filler rows if the account has fewer than ~5 real
  //    transactions, so the table still feels populated. Filler rows
  //    are synthetic and never have anomalies.
  const fillerNeeded = Math.max(0, 5 - real.length);
  const filler: RecTransaction[] = FILLER_ROWS.slice(0, fillerNeeded).map(
    (f, i) => ({ id: `JE-1234${i + 5}`, ...f }),
  );

  // 5. Sort chronologically (newest first) so anomalies tend to surface
  //    near the top when they're recent — better demo flow.
  return [...real, ...filler].sort((a, b) => b.date.localeCompare(a.date));
}
