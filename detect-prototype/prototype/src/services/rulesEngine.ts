import type {
  AnomalyFlag,
  AnomalyRecord,
  MatchedCondition,
  Rule,
  Transaction,
} from '../data/types';
import { getPeriod } from '../data/company';
import { getVendor } from '../data/vendors';

/**
 * Rules engine.
 *
 * Given a list of transactions and a list of active rules, produces
 * AnomalyFlag objects. Each flag includes a `matchedConditions` payload
 * describing WHAT matched and WITH WHAT VALUES — that's the data the
 * rule-flag card displays inline.
 *
 * The engine is pure: same inputs → same outputs. It's called by the
 * store whenever rules are created/updated/deleted, so rule changes
 * immediately flow into the inbox.
 */

// ---------- Rule evaluators ----------
//
// Each evaluator takes a transaction + the rule + context and returns
// either `null` (rule didn't match) or a MatchedCondition[] describing
// how it matched.

type EvalContext = {
  priorTransactions: Transaction[]; // for duplicate-detection rules
};

type Evaluator = (
  tx: Transaction,
  rule: Rule,
  ctx: EvalContext,
) => MatchedCondition[] | null;

const evaluators: Record<string, Evaluator> = {
  'rule-self-approved': (tx) =>
    tx.submitterId === tx.approverId
      ? [
          {
            label: 'Submitter and approver are the same person',
            expected: 'Different submitter and approver',
            actual: `${tx.submitterId} submitted and approved`,
          },
        ]
      : null,

  'rule-after-hours': (tx) => {
    const submitted = new Date(tx.submittedAt);
    const hour = submitted.getUTCHours();
    const dow = submitted.getUTCDay(); // 0=Sun, 6=Sat
    const isWeekday = dow >= 1 && dow <= 5;
    const isAfterHours = hour < 8 || hour >= 18;
    if (!isAfterHours) return null;
    // After-hours counts even on weekends (the rule card will also list weekend)
    const timeStr = submitted.toISOString().slice(11, 16);
    const dayStr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dow];
    const matched: MatchedCondition[] = [
      {
        label: 'Submitted outside business hours',
        expected: '08:00–18:00',
        actual: `${timeStr} (${dayStr})`,
      },
    ];
    if (isWeekday) {
      matched.push({
        label: 'Submitted on a weekday',
        expected: 'Mon–Fri',
        actual: dayStr,
      });
    }
    return matched;
  },

  'rule-weekend-activity': (tx) => {
    const dow = new Date(tx.submittedAt).getUTCDay();
    if (dow !== 0 && dow !== 6) return null;
    return [
      {
        label: 'Submitted on weekend',
        expected: 'Monday–Friday',
        actual: dow === 0 ? 'Sunday' : 'Saturday',
      },
    ];
  },

  'rule-round-number': (tx) => {
    if (tx.amount < 10_000 || tx.amount % 1000 !== 0) return null;
    return [
      {
        label: 'Amount exceeds threshold',
        expected: '> $10,000',
        actual: formatMoney(tx.amount),
      },
      {
        label: 'Amount is a round number',
        expected: 'Divisible by $1,000',
        actual: `${formatMoney(tx.amount)} (exact)`,
      },
    ];
  },

  'rule-missing-documentation': (tx) => {
    if (tx.amount <= 5000 || tx.attachmentCount > 0) return null;
    return [
      {
        label: 'Amount exceeds documentation threshold',
        expected: '> $5,000',
        actual: formatMoney(tx.amount),
      },
      {
        label: 'No attachments on file',
        expected: '≥ 1 attachment',
        actual: '0 attachments',
      },
    ];
  },

  'rule-duplicate-invoice': (tx, _rule, ctx) => {
    if (!tx.invoiceNumber || !tx.vendorId) return null;
    const ninetyDays = 90 * 24 * 60 * 60 * 1000;
    const match = ctx.priorTransactions.find(
      (other) =>
        other.id !== tx.id &&
        other.vendorId === tx.vendorId &&
        other.invoiceNumber === tx.invoiceNumber &&
        Math.abs(new Date(tx.date).getTime() - new Date(other.date).getTime()) < ninetyDays,
    );
    if (!match) return null;
    return [
      {
        label: 'Invoice number matches a prior invoice from this vendor',
        expected: 'Unique invoice number per vendor per 90 days',
        actual: `INV ${tx.invoiceNumber} also appears on ${match.transactionId} (posted ${match.date})`,
      },
    ];
  },

  'rule-new-vendor-high-risk': (tx) => {
    if (!tx.vendorId) return null;
    const vendor = getVendor(tx.vendorId);
    if (!vendor) return null;
    const period = getPeriod(tx.periodId);
    if (!period) return null;
    const vendorFirstSeen = new Date(vendor.firstSeenDate).getTime();
    const periodStart = new Date(period.startDate).getTime();
    if (vendorFirstSeen < periodStart) return null;
    if (tx.amount <= 25_000) return null;
    return [
      {
        label: 'Vendor first appeared this period',
        expected: 'Vendor existed before current period',
        actual: `${vendor.name} first seen ${vendor.firstSeenDate}`,
      },
      {
        label: 'Amount exceeds new-vendor threshold',
        expected: '> $25,000',
        actual: formatMoney(tx.amount),
      },
    ];
  },

  'rule-rapid-approval': (tx) => {
    const gapSeconds =
      (new Date(tx.approvedAt).getTime() - new Date(tx.submittedAt).getTime()) / 1000;
    if (gapSeconds >= 300) return null;
    const mm = Math.floor(gapSeconds / 60);
    const ss = Math.floor(gapSeconds % 60);
    return [
      {
        label: 'Time from submission to approval',
        expected: '≥ 5 minutes',
        actual: `${mm} minute${mm === 1 ? '' : 's'} ${ss} seconds`,
      },
    ];
  },

  'rule-post-close-entry': (tx) => {
    const period = getPeriod(tx.periodId);
    if (!period || !period.closeDate) return null;
    const createdAt = new Date(tx.createdAt);
    const closeDate = new Date(period.closeDate);
    if (createdAt <= closeDate) return null;
    return [
      {
        label: 'Created after period close',
        expected: 'Before period close date',
        actual: `Created ${tx.date} for ${period.label} (closed ${period.closeDate})`,
      },
    ];
  },

  'rule-policy-threshold-gift': (tx) => {
    if (tx.amount <= 250) return null;
    if (!/\b(gift|bouquet|swag|gratuity)\b/i.test(tx.memo)) return null;
    return [
      {
        label: 'Memo references a gift category',
        expected: 'Non-gift expense, or within gift policy',
        actual: `Memo: "${tx.memo}"`,
      },
      {
        label: 'Amount exceeds gift policy threshold',
        expected: '≤ $250',
        actual: formatMoney(tx.amount),
      },
    ];
  },

  'rule-department-blank': (tx) => {
    if (tx.department && tx.department.trim() !== '') return null;
    return [
      {
        label: 'Department field is blank',
        expected: 'A valid department tag',
        actual: '(blank)',
      },
    ];
  },

  'rule-class-blank': (tx) => {
    if (tx.class != null && tx.class !== '') return null;
    return [
      {
        label: 'Class field is blank',
        expected: 'A valid class tag',
        actual: '(blank)',
      },
    ];
  },

  'rule-bypassed-description': (tx) => {
    const m = tx.memo.trim();
    const isFiller = m.length <= 3 || /^(none|n\/a|na|n\.a\.|tbd|placeholder|test)$/i.test(m);
    if (!isFiller) return null;
    return [
      {
        label: 'Memo appears to be filler text',
        expected: 'A descriptive memo',
        actual: m.length === 0 ? '(blank)' : `"${tx.memo}"`,
      },
    ];
  },

  'rule-location-blank': (tx) => {
    if (tx.location != null && tx.location !== '') return null;
    return [
      {
        label: 'Location field is blank',
        expected: 'A valid location tag',
        actual: '(blank)',
      },
    ];
  },

  'rule-different-year': (tx) => {
    const txYear = new Date(tx.date).getFullYear();
    const periodYear = parseInt(tx.periodId.split('-')[0], 10);
    if (txYear === periodYear) return null;
    return [
      {
        label: 'Transaction date is outside the posting period year',
        expected: `Year ${periodYear}`,
        actual: `${tx.date} (year ${txYear})`,
      },
    ];
  },

  'rule-negative-invoice': (tx) => {
    if (tx.type !== 'vendor-bill') return null;
    if (tx.amount >= 0) return null;
    return [
      {
        label: 'Vendor bill has a negative amount',
        expected: '≥ $0.00',
        actual: formatMoney(tx.amount),
      },
    ];
  },

  'rule-zero-dollar': (tx) => {
    if (tx.amount !== 0) return null;
    return [
      {
        label: 'Transaction amount is $0.00',
        expected: 'Non-zero amount',
        actual: '$0.00',
      },
    ];
  },

  'rule-prepaid-under-threshold': (tx) => {
    if (!/prepaid/i.test(tx.glAccountName)) return null;
    if (tx.amount >= 2500) return null;
    return [
      {
        label: 'Account contains "Prepaid"',
        expected: 'Account outside Prepaid Expenses',
        actual: tx.glAccountName,
      },
      {
        label: 'Amount is below capitalization limit',
        expected: '≥ $2,500',
        actual: formatMoney(tx.amount),
      },
    ];
  },

  'rule-unusual-memo': (tx) => {
    const KEYWORDS = /\b(urgent|per\s+ceo|temporary|temp\b|asap|bypass|override|exception\s+approved)\b/i;
    const match = tx.memo.match(KEYWORDS);
    if (!match) return null;
    return [
      {
        label: 'Memo contains escalation or override language',
        expected: 'Standard descriptive memo',
        actual: `Memo: "${tx.memo}"`,
      },
    ];
  },

  'rule-reversal-outside-window': (tx) => {
    if (tx.type !== 'journal-entry') return null;
    if (!/\b(reverse|reversal)\b/i.test(tx.memo)) return null;
    const monthMatch = tx.memo.match(
      /\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(20\d\d)\b/i,
    );
    if (!monthMatch) return null;
    const MONTH_IDX: Record<string, number> = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
    };
    const monthKey = monthMatch[1].slice(0, 3).toLowerCase();
    const year = parseInt(monthMatch[2], 10);
    const originalDate = new Date(Date.UTC(year, MONTH_IDX[monthKey], 1));
    const txDate = new Date(tx.date);
    const daysDiff = (txDate.getTime() - originalDate.getTime()) / (24 * 60 * 60 * 1000);
    if (daysDiff <= 60) return null;
    return [
      {
        label: 'Reversal is more than 60 days after the original accrual',
        expected: '≤ 60 days since original accrual',
        actual: `${Math.round(daysDiff)} days (original: ${monthMatch[1]} ${year})`,
      },
    ];
  },

  'rule-one-time-vendor-high-value': (tx) => {
    if (tx.amount < 10_000) return null;
    if (!/\b(misc(?:ellaneous)?|one.?time)\b/i.test(tx.memo)) return null;
    return [
      {
        label: 'Memo identifies vendor as one-time or miscellaneous',
        expected: 'Identified vendor with a master service agreement',
        actual: `Memo: "${tx.memo.slice(0, 80)}${tx.memo.length > 80 ? '…' : ''}"`,
      },
      {
        label: 'Amount exceeds one-time vendor threshold',
        expected: '< $10,000',
        actual: formatMoney(tx.amount),
      },
    ];
  },

  'rule-dept-account-conflict': (tx) => {
    if (!/legal/i.test(tx.glAccountName)) return null;
    if (tx.department?.toLowerCase() !== 'marketing') return null;
    return [
      {
        label: 'Legal Fees account used by Marketing department',
        expected: 'Department consistent with account',
        actual: `Department: ${tx.department} → Account: ${tx.glAccountName}`,
      },
    ];
  },
};

// ---------- Main entry point ----------

export interface RulesEngineResult {
  flagsByTransactionId: Record<string, AnomalyFlag[]>; // Transaction.id → flags
}

/**
 * Run all active rules against all transactions. Returns a map of
 * Transaction.id → AnomalyFlag[] (only transactions with at least one
 * flag appear in the map).
 */
export function evaluateRules(
  transactions: Transaction[],
  rules: Rule[],
): RulesEngineResult {
  const activeRules = rules.filter((r) => r.status === 'active');
  const ctx: EvalContext = { priorTransactions: transactions };

  const flagsByTransactionId: Record<string, AnomalyFlag[]> = {};

  for (const tx of transactions) {
    for (const rule of activeRules) {
      const evaluate = evaluators[rule.id];
      if (!evaluate) continue; // no registered evaluator; skip silently
      const matched = evaluate(tx, rule, ctx);
      if (!matched) continue;
      const flag: AnomalyFlag = {
        id: `flag-${rule.id}-${tx.id}`,
        source: {
          kind: 'rule',
          ruleId: rule.id,
          ruleName: rule.name,
          matchedConditions: matched,
        },
        severity: rule.severity,
        detectedAt: tx.approvedAt,
      };
      if (!flagsByTransactionId[tx.id]) {
        flagsByTransactionId[tx.id] = [];
      }
      flagsByTransactionId[tx.id].push(flag);
    }
  }

  return { flagsByTransactionId };
}

/**
 * Merge newly-computed rule flags into existing records, preserving AI flags
 * and user state (status, resolution, comments, assignees).
 */
export function mergeFlagsIntoRecords(
  existingRecords: AnomalyRecord[],
  engineResult: RulesEngineResult,
): AnomalyRecord[] {
  const byTxId = new Map<string, AnomalyRecord>();
  for (const r of existingRecords) byTxId.set(r.transactionId, r);

  const result: AnomalyRecord[] = [];

  // Update existing records: swap out their rule flags, keep AI flags
  for (const record of existingRecords) {
    const newRuleFlags = engineResult.flagsByTransactionId[record.transactionId] ?? [];
    const aiFlags = record.flags.filter((f) => f.source.kind === 'ai');
    const flags = [...newRuleFlags, ...aiFlags];
    // If this record has no flags now (rule removed, no AI either), still keep it
    // if status != open — it has history. If still open + no flags, drop it.
    if (flags.length === 0 && record.status === 'open') continue;
    result.push({
      ...record,
      flags,
      primarySeverity: flags.length > 0 ? Math.max(...flags.map((f) => f.severity)) : record.primarySeverity,
      updatedAt: new Date().toISOString(),
    });
  }

  // Add records for transactions that newly match rules but have no existing record
  for (const [txId, flags] of Object.entries(engineResult.flagsByTransactionId)) {
    if (byTxId.has(txId)) continue;
    result.push({
      id: `record-auto-${txId}`,
      transactionId: txId,
      flags,
      primarySeverity: Math.max(...flags.map((f) => f.severity)),
      status: 'open',
      assigneeIds: [],
      commentIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  return result;
}

// ---------- helpers ----------

function formatMoney(n: number): string {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
}
