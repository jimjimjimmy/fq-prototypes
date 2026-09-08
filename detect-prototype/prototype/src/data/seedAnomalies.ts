import type {
  AnomalyFlag,
  AnomalyRecord,
  AssigneeReason,
  Comment,
  ActivityEntry,
  MatchedCondition,
  ScoreFactor,
} from './types';
import { getTeamMember } from './team';
import { transactions } from './transactions';
import { entities } from './company';
import { rules } from './rules';
import { chartOfAccounts } from './chartOfAccounts';

/**
 * Seeded anomaly records for the Detect prototype inbox.
 *
 * Each record references one transaction (via internal UUID) and carries
 * 1–N flags. Flags are produced by the rules in rules.ts OR by the AI.
 * Phase 3's rules engine will be able to re-derive the rule-sourced flags
 * from transactions + rules; the AI flags are hand-crafted and persist
 * in the store.
 *
 * Periods represented:
 *   - 2026-04 (in-progress, current period): mostly `open`
 *   - 2026-03 (closed): mix of `resolved` and `dismissed` — shows history
 *   - 2026-02 (closed): all `resolved` or `dismissed` — older history
 */

// ---------- helpers ----------

function txId(erpId: string): string {
  return `tx-${erpId.toLowerCase()}`;
}

let flagCounter = 1000;
function flagId(): string {
  flagCounter++;
  return `flag-${flagCounter}`;
}

let recordCounter = 1000;
function recordId(): string {
  recordCounter++;
  return `record-${recordCounter}`;
}

function ruleFlag(
  ruleId: string,
  ruleName: string,
  severity: number,
  detectedAt: string,
  matchedConditions: MatchedCondition[],
  scoreBreakdown?: ScoreFactor[],
): AnomalyFlag {
  return {
    id: flagId(),
    source: {
      kind: 'rule',
      ruleId,
      ruleName,
      matchedConditions,
    },
    severity,
    detectedAt,
    scoreBreakdown,
  };
}

function aiFlag(
  categoryLabel: string,
  modelReasoning: string,
  severity: number,
  confidence: number,
  detectedAt: string,
  scoreBreakdown?: ScoreFactor[],
): AnomalyFlag {
  return {
    id: flagId(),
    source: { kind: 'ai', categoryLabel, modelReasoning, confidence },
    severity,
    detectedAt,
    scoreBreakdown,
  };
}

/**
 * Generic fallback breakdown when no bespoke one is defined. Produces
 * a plausible decomposition so the hover tooltip always has content.
 */
function defaultBreakdown(severity: number, kind: 'rule' | 'ai'): ScoreFactor[] {
  const anomalyTypePts = Math.round(severity * 0.55);
  const dollarPts = Math.round(severity * 0.3);
  const historicalPts = severity - anomalyTypePts - dollarPts;
  return [
    {
      label: kind === 'rule' ? 'Rule severity weighting' : 'Anomaly type severity',
      points: anomalyTypePts,
    },
    { label: 'Dollar exposure', points: dollarPts },
    { label: 'Historical pattern deviation', points: historicalPts },
  ];
}

function record(
  opts: Omit<AnomalyRecord, 'id' | 'primarySeverity' | 'createdAt' | 'updatedAt' | 'commentIds'> & {
    createdAt: string;
    comments?: Comment[];
  },
): AnomalyRecord {
  // Ensure every flag has a score breakdown for the hover tooltip —
  // fill with the generic decomposition when none was provided.
  const flags = opts.flags.map((f) =>
    f.scoreBreakdown
      ? f
      : { ...f, scoreBreakdown: defaultBreakdown(f.severity, f.source.kind) },
  );
  const primarySeverity = Math.max(...flags.map((f) => f.severity));
  return {
    id: recordId(),
    transactionId: opts.transactionId,
    flags,
    primarySeverity,
    status: opts.status,
    resolution: opts.resolution,
    assigneeIds: opts.assigneeIds,
    assigneeReasons: opts.assigneeReasons,
    signOffs: opts.signOffs,
    commentIds: (opts.comments ?? []).map((c) => c.id),
    createdAt: opts.createdAt,
    updatedAt: opts.createdAt,
    sourceDeletedAt: opts.sourceDeletedAt,
  };
}

// ---------- April 2026 anomalies (current, mostly open) ----------

export const seedRecords: AnomalyRecord[] = [
  // 1. Self-approved — BILL-44022 (Marcus approved his own)
  // Demo of the Override badge: Priya signed off as herself AND signed
  // off on behalf of Samantha and Emily, so their chips render as
  // "Override" with a hover tooltip explaining who actually signed and why.
  record({
    transactionId: txId('BILL-44022'),
    status: 'resolved',
    resolution: {
      kind: 'no-action',
      at: '2026-04-21T14:30:00Z',
      byId: 'priya-patel',
    },
    signOffs: {
      'priya-patel':      { at: '2026-04-21T14:30:00Z', byId: 'priya-patel' },
      'samantha-sheldon': { at: '2026-04-21T14:31:00Z', byId: 'priya-patel', reason: 'Olivia out for the close — Priya cleared in her absence.' },
      'emily-chen':       { at: '2026-04-21T14:32:00Z', byId: 'priya-patel', reason: 'Reviewed jointly with Emily over Slack.' },
    },
    flags: [
      // AI flag (instead of a rule flag) so it survives mergeFlagsIntoRecords
      // when the rule engine re-evaluates — Gaurav's rules.ts no longer
      // includes 'rule-self-approved'.
      aiFlag(
        'Preparer / approver pattern deviation',
        'Marcus Rodriguez submitted and approved this $89,000 invoice within 4 minutes — a self-approval gap that is uncommon in his recent activity and breaches segregation of duties for amounts above $50K.',
        88,
        91,
        '2026-04-20T11:18:00Z',
        [
          { label: 'Self-approval (segregation of duties gap)', points: 56 },
          { label: 'High dollar amount ($89K)', points: 24 },
          { label: 'New/unvetted vendor', points: 8 },
        ],
      ),
    ],
    assigneeIds: ['samantha-sheldon', 'priya-patel', 'emily-chen'],
    // Mix of provenance types so the popover demo shows variety:
    // Samantha owns the account-level fallback, Priya is the
    // workspace Ultimate Owner, Emily was added manually by Samantha
    // during the close.
    assigneeReasons: {
      'samantha-sheldon': { type: 'account', entityName: 'FloQast Corporate', accountCode: '2100', accountName: 'Accrued Expenses' },
      'priya-patel':      { type: 'ultimate-owner' },
      'emily-chen':       { type: 'manual', assignedBy: 'Olivia Reed' },
    },
    createdAt: '2026-04-20T11:18:00Z',
  }),

  // 3. After-hours processing — BILL-44023 Sunday 2:47am
  // Demo of the Re-review badge: Samantha signed off on April 21, then a
  // brand-new "Frequency anomaly" rule fired on April 28 — so her sign-off
  // pre-dates one of the current flags and her chip flips to Re-review.
  // Uses AI flags because the seeded rule IDs we'd want
  // (after-hours, frequency) don't exist in the current rules.ts and
  // would be wiped by mergeFlagsIntoRecords.
  record({
    transactionId: txId('BILL-44023'),
    status: 'open',
    flags: [
      aiFlag(
        'Posting timing',
        'Submitted at 02:47 UTC on Sunday — well outside the typical 08:00–18:00 weekday window for AP entries on this account.',
        51,
        88,
        '2026-04-20T09:10:00Z',
      ),
      aiFlag(
        'Frequency anomaly',
        'Vendor frequency anomaly detected by a model retrained on April 28 — this transaction would not have been flagged on the original April 21 review.',
        58,
        82,
        '2026-04-28T11:30:00Z',
      ),
    ],
    assigneeIds: ['samantha-sheldon', 'lisa-zhang'],
    // Samantha lands here via her ownership of the "Frequency
    // Anomaly" rule that fired on this record; Lisa was added
    // directly during triage via Edit Assignees.
    assigneeReasons: {
      'samantha-sheldon': { type: 'rule', ruleName: 'Frequency Anomaly' },
      'lisa-zhang':       { type: 'manual', assignedBy: 'Olivia Reed' },
    },
    signOffs: {
      'samantha-sheldon': { at: '2026-04-21T16:00:00Z', byId: 'samantha-sheldon' },
    },
    createdAt: '2026-04-20T09:10:00Z',
  }),

  // 4. Round number + self-approved — PO-2026-318
  // Second Re-review demo: Samantha and Marcus both signed off on
  // April 20, then a model update on April 27 surfaced a Counterparty
  // pattern anomaly the original review couldn't have seen. Both
  // assignee chips show Re-review. AI flags used so the records
  // survive the rules-engine merge step.
  record({
    transactionId: txId('PO-2026-318'),
    status: 'open',
    flags: [
      aiFlag(
        'Preparer / approver pattern',
        'Submitter and approver are the same person on a $150,000 round-number transaction — high-risk segregation-of-duties pattern.',
        65,
        93,
        '2026-04-19T14:30:00Z',
      ),
      aiFlag(
        'Counterparty pattern',
        'Counterparty pattern flagged by a model update applied on April 27 — vendor activity has materially changed since the April 20 sign-offs.',
        62,
        86,
        '2026-04-27T10:15:00Z',
      ),
    ],
    assigneeIds: ['samantha-sheldon', 'marcus-rodriguez'],
    signOffs: {
      'samantha-sheldon': { at: '2026-04-20T11:00:00Z', byId: 'samantha-sheldon' },
      'marcus-rodriguez': { at: '2026-04-20T13:45:00Z', byId: 'marcus-rodriguez' },
    },
    createdAt: '2026-04-19T14:30:00Z',
  }),

  // 5. Missing documentation — BILL-44024
  // Re-attestation demo: Samantha signed off on April 20 after reviewing
  // the missing-documentation flag. On April 26 the "Missing Documentation"
  // rule threshold was lowered from $10K → $5K, causing the rule engine to
  // re-evaluate the transaction and raise a fresh flag. Samantha's sign-off
  // is retained (shown dimmed) but her toggle resets to amber — she needs
  // to re-attest under the updated rule. David has not yet signed off.
  record({
    transactionId: txId('BILL-44024'),
    status: 'open',
    flags: [
      ruleFlag('rule-missing-documentation', 'Missing Documentation', 52, '2026-04-18T10:42:00Z', [
        { label: 'Amount exceeds documentation threshold', expected: '> $5,000', actual: '$32,100' },
        { label: 'No attachments on file', expected: '≥ 1 attachment', actual: '0 attachments' },
      ]),
      // Rule updated April 26 — re-evaluation surfaced this re-attestation flag
      ruleFlag('rule-missing-documentation', 'Missing Documentation (Rule Updated)', 55, '2026-04-26T09:15:00Z', [
        { label: 'Rule threshold lowered from $10,000 to $5,000 on April 26', expected: 'Prior sign-off predates rule change', actual: 'Sign-off recorded April 20 — re-attestation required' },
        { label: 'Amount exceeds updated documentation threshold', expected: '> $5,000', actual: '$32,100' },
      ]),
    ],
    assigneeIds: ['samantha-sheldon', 'david-park'],
    signOffs: {
      'samantha-sheldon': { at: '2026-04-20T14:30:00Z', byId: 'samantha-sheldon' },
    },
    createdAt: '2026-04-18T10:42:00Z',
  }),

  // 6. New vendor high risk — BILL-44025 (Rule + AI mixed)
  // Re-attestation demo: Samantha and Jennifer both signed off on April 19
  // after initial review. The vendor risk scoring model was retrained on
  // April 24 and reclassified TechSoft Solutions as higher risk, surfacing
  // an additional AI flag. Both assignees' sign-offs are retained (dimmed)
  // but their toggles reset to amber — re-attestation required. Marcus and
  // Emily have not yet signed off.
  record({
    transactionId: txId('BILL-44025'),
    status: 'open',
    flags: [
      ruleFlag('rule-new-vendor-high-risk', 'New Vendor - High Risk', 59, '2026-04-18T14:20:00Z', [
        { label: 'Vendor first appeared this period', expected: 'Vendor existed before current period', actual: 'TechSoft Solutions first seen 2026-04-18' },
        { label: 'Amount exceeds new-vendor threshold', expected: '> $25,000', actual: '$28,750' },
      ]),
      aiFlag(
        'New vendor, large first payment',
        'TechSoft Solutions has no prior payment history in a 24-month lookback. The first invoice of $28,750 sits at the 96th percentile of first-payment amounts for newly onboarded vendors in account 6040 Contractors & Consultants. Median first payment for comparable vendors is $8,400.',
        63,
        0.78,
        '2026-04-18T14:21:00Z',
        [
          { label: 'First-payment amount at 96th percentile for new vendors', points: 38 },
          { label: 'Zero prior payment history (24-month window)', points: 16 },
          { label: 'High-risk account category (6040)', points: 9 },
        ],
      ),
      // Vendor risk model retrained April 24 — re-evaluation flag
      aiFlag(
        'Vendor risk reclassification',
        'TechSoft Solutions was reclassified to high-risk tier on April 24 following a vendor risk model update. Prior sign-offs on April 19 predate the reclassification — re-attestation required from all reviewers who signed off before the model update.',
        67,
        0.91,
        '2026-04-24T11:00:00Z',
        [
          { label: 'Vendor reclassified high-risk after model update', points: 40 },
          { label: 'Prior sign-offs predate reclassification', points: 27 },
        ],
      ),
    ],
    assigneeIds: ['samantha-sheldon', 'jennifer-wu', 'marcus-rodriguez', 'emily-chen'],
    signOffs: {
      'samantha-sheldon': { at: '2026-04-19T15:00:00Z', byId: 'samantha-sheldon' },
      'jennifer-wu':      { at: '2026-04-19T17:30:00Z', byId: 'jennifer-wu' },
    },
    createdAt: '2026-04-18T14:20:00Z',
  }),

  // 7. Weekend activity — EXP-44721
  // Re-attestation demo: Samantha signed off on April 22 after initial
  // review. The "Weekend Activity" rule was updated on April 29 to also
  // flag after-hours submissions (before 7am or after 8pm), catching an
  // additional pattern on this transaction. Samantha's sign-off is
  // retained (dimmed) but her toggle resets to amber. Lisa has not yet
  // signed off.
  record({
    transactionId: txId('EXP-44721'),
    status: 'open',
    flags: [
      ruleFlag('rule-weekend-activity', 'Weekend Activity', 44, '2026-04-19T10:22:00Z', [
        { label: 'Submitted on weekend', expected: 'Monday–Friday', actual: 'Saturday' },
      ]),
      // Rule updated April 29 — broadened to include after-hours
      ruleFlag('rule-weekend-activity', 'Weekend / After-Hours Activity (Rule Updated)', 51, '2026-04-29T08:00:00Z', [
        { label: 'Rule broadened on April 29 to include after-hours submissions', expected: 'Submission between 07:00–20:00', actual: 'Submitted 06:14 — outside updated business-hours window' },
        { label: 'Prior sign-off predates rule update', expected: 'Sign-off after rule change', actual: 'Sign-off recorded April 22 — re-attestation required' },
      ]),
    ],
    assigneeIds: ['samantha-sheldon', 'lisa-zhang'],
    signOffs: {
      'samantha-sheldon': { at: '2026-04-22T10:00:00Z', byId: 'samantha-sheldon' },
    },
    createdAt: '2026-04-19T10:22:00Z',
  }),

  // 8. Rapid approval — BILL-44026 (Rule-only)
  record({
    transactionId: txId('BILL-44026'),
    status: 'open',
    flags: [
      ruleFlag('rule-rapid-approval', 'Rapid Approval', 29, '2026-04-17T11:15:00Z', [
        { label: 'Time from submission to approval', expected: '≥ 5 minutes', actual: '2 minutes 30 seconds' },
      ]),
    ],
    assigneeIds: ['samantha-sheldon', 'lisa-zhang'],
    createdAt: '2026-04-17T11:15:00Z',
  }),

  // 9. Duplicate invoice number — BILL-44027
  record({
    transactionId: txId('BILL-44027'),
    status: 'open',
    flags: [
      ruleFlag('rule-duplicate-invoice', 'Duplicate Invoice Number', 56, '2026-04-16T09:48:00Z', [
        { label: 'Invoice number matches a prior invoice from this vendor', expected: 'Unique invoice number per vendor per 90 days', actual: 'INV SFDC-APR2026-001 also appears on BILL-44015 (posted 2026-04-15)' },
        { label: 'Time between duplicate invoices', expected: '> 90 days or different invoice number', actual: 'Same number reissued within 24 hours' },
      ]),
    ],
    assigneeIds: ['samantha-sheldon', 'david-park', 'priya-patel', 'emily-chen', 'lisa-zhang'],
    createdAt: '2026-04-16T09:48:00Z',
  }),

  // 10. Post-close entry — JE-2026-041 (posted Apr 15, March closed Apr 9)
  record({
    transactionId: txId('JE-2026-041'),
    status: 'open',
    flags: [
      ruleFlag(
        'rule-post-close-entry',
        'Post-Close Entry',
        92,
        '2026-04-15T15:47:00Z',
        [
          { label: 'Created after period close', expected: 'Before period close date', actual: 'Created 2026-04-15 for March 2026 period (closed 2026-04-09)' },
        ],
        [
          { label: 'Post-close entry (severe control break)', points: 60 },
          { label: 'Backdated to prior period', points: 25 },
          { label: 'Material amount ($18.4K)', points: 7 },
        ],
      ),
    ],
    assigneeIds: ['samantha-sheldon', 'marcus-rodriguez'],
    createdAt: '2026-04-15T15:47:00Z',
  }),

  // 11. Budget overrun — BILL-44028 (marketing events)
  record({
    transactionId: txId('BILL-44028'),
    status: 'open',
    flags: [
      ruleFlag('rule-unusual-memo', 'Unusual Memo Sentiment', 42, '2026-04-14T13:05:00Z', [
        { label: 'Memo contains "Urgent"', expected: 'Standard descriptive memo (no pressure keywords)', actual: '"Urgent: SaaStr 2026 booth upgrade — per CEO sign-off"' },
        { label: 'Memo contains "CEO"', expected: 'Standard descriptive memo (no pressure keywords)', actual: '"...per CEO sign-off"' },
      ],
      [
        { label: 'Two keyword matches in memo (Urgent + CEO)', points: 32 },
        { label: 'High dollar exposure ($47.5K)', points: 10 },
      ]),
    ],
    assigneeIds: ['samantha-sheldon', 'lisa-zhang'],
    createdAt: '2026-04-14T13:05:00Z',
  }),

  // 12. Policy threshold gift — EXP-44722
  record({
    transactionId: txId('EXP-44722'),
    status: 'open',
    flags: [
      ruleFlag('rule-bypassed-description', 'Bypassed Description', 48, '2026-04-12T10:20:00Z', [
        { label: 'Description is "." (filler character)', expected: 'Descriptive memo text', actual: '"." — filler bypassing the required description field' },
        { label: 'Amount requires a documented description', expected: 'Clear memo for amounts > $250', actual: '$620 submitted with no description' },
      ],
      [
        { label: 'Filler character used to bypass required field', points: 35 },
        { label: 'Amount requires documented description for audit trail', points: 8 },
        { label: 'Account 6900 requires expense justification', points: 5 },
      ]),
    ],
    assigneeIds: ['samantha-sheldon', 'lisa-zhang'],
    createdAt: '2026-04-12T10:20:00Z',
  }),

  // 13. Vendor bank change — BILL-44029 Nimbus (Rule-only)
  record({
    transactionId: txId('BILL-44029'),
    status: 'open',
    flags: [
      ruleFlag('rule-vendor-bank-change', 'Vendor Bank Account Change', 82, '2026-04-11T11:33:00Z', [
        { label: 'Vendor bank details recently changed', expected: '≥ 7 days since last bank change', actual: 'Bank routing number updated 2 days before this invoice (2026-04-09)' },
        { label: 'New routing destination', expected: 'Same bank institution', actual: 'Different regional bank (new routing prefix)' },
      ]),
    ],
    assigneeIds: ['samantha-sheldon', 'jennifer-wu', 'marcus-rodriguez'],
    createdAt: '2026-04-11T11:33:00Z',
  }),

  // 14. Multiple approver changes — PO-2026-319 (Rule-only)
  record({
    transactionId: txId('PO-2026-319'),
    status: 'open',
    flags: [
      ruleFlag('rule-department-blank', 'Department is Blank', 35, '2026-04-10T16:17:00Z', [
        { label: 'Department field is blank', expected: 'A valid department tag', actual: 'No department set on $73,200 Premier Office Solutions PO' },
      ],
      [
        { label: 'Untagged $73.2K transaction breaks cost-center attribution', points: 25 },
        { label: 'Account 6310 Office Supplies requires department for budget tracking', points: 10 },
      ]),
    ],
    assigneeIds: ['samantha-sheldon', 'marcus-rodriguez'],
    createdAt: '2026-04-10T16:17:00Z',
  }),

  // 17. JE reversal pattern — JE-2026-042 (Rule + AI mixed)
  record({
    transactionId: txId('JE-2026-042'),
    status: 'open',
    flags: [
      ruleFlag('rule-reversal-outside-window', 'Reversal Outside Window', 62, '2026-04-07T11:28:00Z', [
        { label: 'Transaction type is a journal entry reversal', expected: 'Journal entry reversal', actual: 'JE-2026-042' },
        { label: 'Original accrual is more than 60 days old', expected: '≤ 60 days since original accrual', actual: 'JE-2026-021 created 2026-02-01 (65 days before this reversal on 2026-04-07)' },
      ],
      [
        { label: 'Reversal lag 65 days vs. expected ≤ 60 days', points: 38 },
        { label: 'Revenue account (4010) reversal amplifies risk', points: 18 },
        { label: 'Material amount ($15.8K) after extended gap', points: 6 },
      ]),
      aiFlag(
        'Reversal pattern',
        'This is the third reversal posted by Emily Chen against account 4010 Subscription Revenue in 2026. Prior reversals resolved within 14 days of origination; this one is 65 days after JE-2026-021 — 4.2 standard deviations above the preparer\'s historical reversal-lag distribution (mean 11 days, σ 12.9 days).',
        72,
        0.79,
        '2026-04-07T11:29:00Z',
        [
          { label: 'Reversal lag 4.2σ above preparer\'s historical mean', points: 35 },
          { label: '3rd reversal this period for this preparer/account pair', points: 16 },
          { label: 'Revenue account amplifies audit exposure', points: 9 },
        ],
      ),
    ],
    assigneeIds: ['samantha-sheldon', 'emily-chen'],
    createdAt: '2026-04-07T11:28:00Z',
  }),

  // 18. Late-night AP run — PAY-2026-203 (Rule-only)
  record({
    transactionId: txId('PAY-2026-203'),
    status: 'open',
    flags: [
      ruleFlag('rule-after-hours', 'After-Hours Processing', 51, '2026-04-06T10:00:00Z', [
        { label: 'Submitted outside business hours', expected: '08:00–18:00', actual: '23:41 Sunday night' },
        { label: 'Submitted on a weekday', expected: 'Mon–Fri', actual: 'Sunday' },
      ]),
    ],
    assigneeIds: ['samantha-sheldon', 'jennifer-wu'],
    createdAt: '2026-04-06T10:00:00Z',
  }),

  // --- March 2026 anomalies (closed, mostly resolved) ---

  // 20. BILL-43920 — Priya self-approved WSGR
  record({
    transactionId: txId('BILL-43920'),
    status: 'open',
    flags: [
      ruleFlag('rule-self-approved', 'Self-Approved Transaction', 88, '2026-03-24T16:40:00Z', [
        { label: 'Submitter and approver are the same person', expected: 'Different submitter and approver', actual: 'Priya Patel submitted and approved' },
      ]),
    ],
    assigneeIds: ['samantha-sheldon', 'marcus-rodriguez'],
    createdAt: '2026-03-24T16:40:00Z',
  }),

  // 21. EXP-44605 — Gift policy exceeded
  record({
    transactionId: txId('EXP-44605'),
    status: 'open',
    flags: [
      ruleFlag('rule-policy-threshold-gift', 'Policy Threshold - Gift Limit', 48, '2026-03-22T12:18:00Z', [
        { label: 'Memo references a gift category', expected: 'Non-gift expense, or within gift policy', actual: 'Memo: "Client appreciation gift — Whole Foods hampers"' },
        { label: 'Amount exceeds gift policy threshold', expected: '≤ $250', actual: '$1,850' },
      ]),
    ],
    assigneeIds: ['samantha-sheldon', 'lisa-zhang'],
    createdAt: '2026-03-22T12:18:00Z',
  }),

  // 22. BILL-43922 — Missing documentation
  record({
    transactionId: txId('BILL-43922'),
    status: 'open',
    flags: [
      ruleFlag('rule-missing-documentation', 'Missing Documentation', 65, '2026-03-18T11:02:00Z', [
        { label: 'Amount exceeds documentation threshold', expected: '> $5,000', actual: '$38,400' },
        { label: 'No attachments on file', expected: '≥ 1 attachment', actual: '0 attachments' },
      ]),
    ],
    assigneeIds: ['emily-chen', 'priya-patel'],
    createdAt: '2026-03-18T11:02:00Z',
  }),

  // 23. BILL-43925 — Early-AM PwC (Rule + AI mixed)
  record({
    transactionId: txId('BILL-43925'),
    status: 'open',
    flags: [
      ruleFlag('rule-after-hours', 'After-Hours Processing', 72, '2026-03-14T09:08:00Z', [
        { label: 'Submitted outside business hours', expected: '08:00–18:00', actual: '05:22' },
        { label: 'Submitted on a weekday', expected: 'Mon–Fri', actual: 'Saturday' },
      ]),
      ruleFlag('rule-weekend-activity', 'Weekend Activity', 68, '2026-03-14T09:08:00Z', [
        { label: 'Submitted on weekend', expected: 'Monday–Friday', actual: 'Saturday' },
      ]),
      aiFlag(
        'Posting timing',
        'Invoice submitted at 05:22 on a Saturday — only 1.8% of vendor bill submissions to account 6520 Tax Preparation occur between midnight and 06:00. Pattern analysis of this preparer\'s prior 47 submissions shows all fell within normal business hours (08:00–20:00). No travel or out-of-office record on file for this date.',
        58,
        0.77,
        '2026-03-14T09:08:01Z',
        [
          { label: 'Submission time in lowest 1.8% of account activity', points: 33 },
          { label: 'Preparer\'s prior 47 submissions all in business hours', points: 17 },
          { label: 'Saturday — outside typical operating pattern', points: 8 },
        ],
      ),
    ],
    assigneeIds: ['samantha-sheldon', 'marcus-rodriguez'],
    createdAt: '2026-03-14T09:08:00Z',
  }),

  // ---------- AI-detected anomalies (April 2026, open) ----------

  // AI-1. Vendor payment velocity spike — BILL-44030 (AWS 3× normal)
  record({
    transactionId: txId('BILL-44030'),
    status: 'open',
    flags: [
      aiFlag(
        'Vendor payment velocity spike',
        'AWS received $284,000 this period — 2.98× the trailing 3-period average of $95,200. The payment exceeds 3 standard deviations from the vendor\'s monthly payment distribution over the past 12 months (σ = $18,400). No corresponding capacity event, reserved-instance purchase, or infrastructure incident is recorded in the ITSM system.',
        74,
        0.89,
        '2026-04-09T16:30:00Z',
        [
          { label: 'Payment spike 2.98× trailing 3-period average', points: 44 },
          { label: 'High dollar exposure ($284K)', points: 20 },
          { label: 'No corroborating capacity event on record', points: 10 },
        ],
      ),
    ],
    assigneeIds: ['samantha-sheldon', 'jennifer-wu', 'david-park'],
    createdAt: '2026-04-09T16:30:00Z',
  }),

  // AI-2. Duplicate transaction fingerprint — BILL-44031 (Deloitte extra fieldwork)
  record({
    transactionId: txId('BILL-44031'),
    status: 'open',
    flags: [
      aiFlag(
        'Duplicate transaction fingerprint',
        'BILL-44031 ($62,400, Deloitte, account 6510) shares a 94% fingerprint match with BILL-44020 ($61,800, Deloitte, account 6510) posted 2026-03-31. Matching attributes: vendor, GL account, amount within 1%, memo keyword overlap ("fieldwork"), and approver. Model assessed this as a probable re-submission of a prior invoice rather than a distinct engagement.',
        82,
        0.91,
        '2026-04-08T12:15:00Z',
        [
          { label: '94% fingerprint match to BILL-44020 (Mar 31)', points: 52 },
          { label: 'Amount within 1% of prior invoice ($61.8K vs $62.4K)', points: 20 },
          { label: 'Same vendor, account, approver, and memo keywords', points: 10 },
        ],
      ),
    ],
    assigneeIds: ['samantha-sheldon', 'emily-chen', 'priya-patel'],
    createdAt: '2026-04-08T12:15:00Z',
  }),

  // AI-3. Posting timing + Preparer/approver pattern — BILL-44033 (Deloitte Q1 audit)
  record({
    transactionId: txId('BILL-44033'),
    status: 'open',
    flags: [
      aiFlag(
        'Posting timing',
        'BILL-44033 was entered at 23:47 local time on a Wednesday. Only 2.1% of vendor bill submissions to account 6510 Accounting & Audit Fees occur after 22:00. This preparer\'s prior 63 submissions all fell between 08:00 and 21:00. The late-night pattern on a high-value invoice ($168,400) is a statistical outlier.',
        64,
        0.82,
        '2026-04-22T23:50:00Z',
        [
          { label: 'Submission time in bottom 2.1% for this account', points: 36 },
          { label: 'Preparer\'s prior 63 submissions all in normal hours', points: 18 },
          { label: 'High dollar exposure ($168K) amplifies risk', points: 10 },
        ],
      ),
      aiFlag(
        'Preparer / approver pattern',
        'Emily Chen (preparer) has been approved by Priya Patel on 31 prior invoices, but none exceeded $95,000. This $168,400 invoice is the first time this preparer/approver pair has processed an amount above $100K. Model detected a 99th-percentile deviation from the established approval-amount distribution for this pair.',
        71,
        0.85,
        '2026-04-22T23:51:00Z',
        [
          { label: 'Amount 77% above pair\'s prior maximum ($95K)', points: 42 },
          { label: 'First invoice > $100K for this preparer/approver pair', points: 19 },
          { label: 'No secondary approval despite >$150K threshold policy', points: 10 },
        ],
      ),
    ],
    assigneeIds: ['samantha-sheldon', 'priya-patel', 'emily-chen'],
    createdAt: '2026-04-22T23:50:00Z',
  }),

  // AI-4 (BILL-44034) intentionally removed so account 6040 has
  // exactly 4 anomaly records — matching the 4 anomalous transactions
  // surfaced from the Close → Recs / Transactions view. Keeps the
  // Close→Detect bridge count-consistent.

  // AI-5. Amount distribution outlier — BILL-44036 (ZoomInfo license expansion)
  record({
    transactionId: txId('BILL-44036'),
    status: 'open',
    flags: [
      aiFlag(
        'Amount distribution',
        'ZoomInfo invoice for $47,800 is 3.85× the vendor\'s trailing monthly average of $12,400 (account 6130 Sales & Marketing Tools). The prior 11 ZoomInfo invoices range from $10,200 to $14,800 with no comparable expansion events. Model found no corresponding contract amendment, seat-count change event, or budget exception in the available metadata.',
        68,
        0.83,
        '2026-04-20T14:45:00Z',
        [
          { label: 'Invoice 3.85× vendor\'s trailing 11-month average', points: 40 },
          { label: 'No contract amendment or expansion event found', points: 18 },
          { label: 'Largest single invoice from this vendor in 12 months', points: 10 },
        ],
      ),
    ],
    assigneeIds: ['samantha-sheldon', 'lisa-zhang', 'marcus-rodriguez'],
    createdAt: '2026-04-20T14:45:00Z',
  }),

  // AI-6. Round-trip transaction — JE-2026-044 (reverses JE-2026-043)
  record({
    transactionId: txId('JE-2026-044'),
    status: 'open',
    flags: [
      aiFlag(
        'Round-trip transaction',
        'JE-2026-044 debits account 2100 Accrued Expenses by $75,000 and was posted 4 days after JE-2026-043 credited the same account for the same amount. The net effect on account 2100 is zero within the current period. Model detected no business event or contract change that would justify creating and immediately reversing a $75,000 accrual.',
        85,
        0.94,
        '2026-04-17T16:50:00Z',
        [
          { label: 'Net zero impact on account 2100 within same period', points: 52 },
          { label: 'Originating JE posted only 4 days prior', points: 22 },
          { label: 'Different approver on reversal (pattern break)', points: 11 },
        ],
      ),
    ],
    assigneeIds: ['samantha-sheldon', 'emily-chen', 'priya-patel'],
    createdAt: '2026-04-17T16:50:00Z',
  }),

  // AI-7. Backdated entry — BILL-44037 (WSGR March IP filing)
  // Demo seed for the "Source Deleted" state: the transaction had
  // AI activity + investigation in progress, then the AP team voided
  // it in the ERP after re-issue. Detect preserves the audit trail.
  record({
    transactionId: txId('BILL-44037'),
    status: 'open',
    flags: [
      aiFlag(
        'Backdated entry',
        'BILL-44037 carries a GL date of 2026-04-02 but the system entry timestamp is 2026-04-24 — a 22-day gap. The invoice date (WSGR-2026-IP-MAR) references March activity. Model compares GL date to system entry date across all transactions; a gap exceeding 14 days for current-period entries falls in the top 5% of the distribution and indicates potential period manipulation.',
        78,
        0.93,
        '2026-04-24T14:25:00Z',
        [
          { label: '22-day gap between GL date and system entry date', points: 48 },
          { label: 'Invoice references prior-period activity (March)', points: 20 },
          { label: 'Legal Fees account — audit-sensitive category', points: 10 },
        ],
      ),
    ],
    assigneeIds: ['samantha-sheldon', 'emily-chen', 'priya-patel'],
    createdAt: '2026-04-24T14:25:00Z',
  }),

  // AI-8. Unusual posting user for account — BILL-44038 (Jennifer Wu → 6520 Tax Prep)
  record({
    transactionId: txId('BILL-44038'),
    status: 'open',
    flags: [
      aiFlag(
        'Unusual posting user for account',
        'Jennifer Wu submitted this invoice to account 6520 Tax Preparation. All 14 prior postings to 6520 over 18 months were by Emily Chen (11) or Priya Patel (3). Jennifer Wu has zero prior activity on this account. Model flags first-time account access by a user with no established posting history on sensitive tax-related GL accounts.',
        69,
        0.87,
        '2026-04-24T14:35:00Z',
        [
          { label: 'Submitter has zero prior history on account 6520', points: 42 },
          { label: 'Account normally restricted to 2 established preparers', points: 18 },
          { label: 'Tax-sensitive account with audit trail requirements', points: 9 },
        ],
      ),
    ],
    assigneeIds: ['samantha-sheldon', 'jennifer-wu', 'emily-chen'],
    createdAt: '2026-04-24T14:35:00Z',
  }),

  // AI-9. Elevated reversal rate — JE-2026-046
  record({
    transactionId: txId('JE-2026-046'),
    status: 'open',
    flags: [
      aiFlag(
        'Elevated reversal rate',
        'JE-2026-046 is the 4th journal entry reversal posted by Emily Chen in April 2026. Historical baseline for this preparer is 0.8 reversals per month (σ = 0.6). Four reversals in a single period is 5.3 standard deviations above the mean. Elevated reversal rates can indicate systematic accrual errors, late adjustments to cover discrepancies, or attempts to manipulate period-end balances.',
        77,
        0.88,
        '2026-04-23T11:41:00Z',
        [
          { label: '4 reversals this period vs. 0.8/month baseline (5.3σ)', points: 46 },
          { label: 'All 4 reversals posted by same preparer in 23 days', points: 21 },
          { label: 'Accrued Expenses account — period-end sensitivity', points: 10 },
        ],
      ),
    ],
    assigneeIds: ['samantha-sheldon', 'emily-chen', 'marcus-rodriguez'],
    createdAt: '2026-04-23T11:41:00Z',
  }),

  // AI-10. Frequency anomaly — BILL-44046 (Deloitte 3rd April invoice)
  record({
    transactionId: txId('BILL-44046'),
    status: 'open',
    flags: [
      aiFlag(
        'Frequency anomaly',
        'BILL-44046 is the third Deloitte invoice posted in April 2026. The trailing 12-month average for Deloitte is 1.1 invoices per period (σ = 0.4). Three invoices in a single period is 4.75 standard deviations above the mean. Model also notes that the combined April Deloitte spend ($168,400 + $62,400 + $38,500 = $269,300) is 2.4× the prior 12-month single-period maximum.',
        65,
        0.80,
        '2026-04-25T10:20:00Z',
        [
          { label: '3 invoices this period vs. 1.1/month baseline (4.75σ)', points: 38 },
          { label: 'Combined April spend 2.4× prior single-period maximum', points: 18 },
          { label: 'Third invoice lacks SOW reference', points: 9 },
        ],
      ),
    ],
    assigneeIds: ['samantha-sheldon', 'emily-chen', 'priya-patel'],
    createdAt: '2026-04-25T10:20:00Z',
  }),

  // AI-11. Entry source deviation — JE-2026-047 (manual JE to 6130)
  record({
    transactionId: txId('JE-2026-047'),
    status: 'open',
    flags: [
      aiFlag(
        'Entry source',
        'Account 6130 Sales & Marketing Tools has been exclusively populated via system integrations (HubSpot, Salesforce, ZoomInfo auto-sync) for the past 14 months — 100% of 218 prior entries have source type "system". JE-2026-047 is the first manual journal entry to this account. Manual entries to system-managed accounts bypass the automated reconciliation controls and can introduce undetected discrepancies.',
        93,
        0.88,
        '2026-04-23T16:01:00Z',
        [
          { label: 'First manual entry to account with 100% system-post history', points: 44 },
          { label: 'Bypasses automated reconciliation controls for account 6130', points: 18 },
          { label: 'Preparer has no prior posting history on this account', points: 10 },
        ],
      ),
    ],
    assigneeIds: ['marcus-rodriguez', 'jennifer-wu', 'samantha-sheldon'],
    createdAt: '2026-04-23T16:01:00Z',
  }),

  // AI-12. Currency anomaly — BILL-44047 (WSGR EUR invoice)
  record({
    transactionId: txId('BILL-44047'),
    status: 'open',
    flags: [
      aiFlag(
        'Currency anomaly',
        'WSGR has invoiced exclusively in USD across 23 payments over 3 years. BILL-44047 is denominated in EUR — the invoice reference "WSGR-UK-EUR-2026-APR" suggests a UK billing entity routed through a European subsidiary. No currency conversion memo or hedging note is attached. Model flags currency deviations from established vendor billing patterns as potential indicators of invoice fraud or routing anomalies.',
        76,
        0.91,
        '2026-04-24T15:00:00Z',
        [
          { label: 'First non-USD invoice from vendor in 3-year history', points: 46 },
          { label: 'No currency conversion memo or FX hedge on file', points: 20 },
          { label: 'Unusual billing entity (UK/EUR vs. US/USD pattern)', points: 10 },
        ],
      ),
    ],
    assigneeIds: ['samantha-sheldon', 'priya-patel', 'jennifer-wu'],
    createdAt: '2026-04-24T15:00:00Z',
  }),

  // AI-13. Counterparty pattern deviation — BILL-43818 (PwC Canada)
  record({
    transactionId: txId('BILL-43818'),
    status: 'open',
    flags: [
      aiFlag(
        'Counterparty pattern',
        'All 9 prior PwC invoices were processed through PwC US (vendor routing: US-ACH). BILL-43818 routes through PwC Canada (entity-ca, CAD billing prefix "PWC-CA"). Model detects this as a counterparty routing deviation — the same vendor appearing under a different legal entity than its established billing pattern. This can indicate a legitimate subsidiary engagement or, in edge cases, invoice interception via a spoofed entity.',
        58,
        0.76,
        '2026-04-03T14:20:00Z',
        [
          { label: 'Routing entity differs from vendor\'s established US pattern', points: 34 },
          { label: 'First use of PwC Canada billing entity', points: 15 },
          { label: 'No master service agreement on file for Canadian entity', points: 9 },
        ],
      ),
    ],
    assigneeIds: ['samantha-sheldon', 'marcus-rodriguez', 'priya-patel'],
    createdAt: '2026-04-03T14:20:00Z',
  }),

  // --- February 2026 anomalies (older history) ---

  // 24. BILL-43814 — Priya self-approved again (legal fee retainer)
  record({
    transactionId: txId('BILL-43814'),
    status: 'open',
    flags: [
      ruleFlag('rule-self-approved', 'Self-Approved Transaction', 88, '2026-02-22T14:08:00Z', [
        { label: 'Submitter and approver are the same person', expected: 'Different submitter and approver', actual: 'Priya Patel submitted and approved' },
      ]),
      ruleFlag('rule-missing-documentation', 'Missing Documentation', 65, '2026-02-22T14:08:00Z', [
        { label: 'Amount exceeds documentation threshold', expected: '> $5,000', actual: '$40,000' },
        { label: 'No attachments on file', expected: '≥ 1 attachment', actual: '0 attachments' },
      ]),
    ],
    assigneeIds: ['samantha-sheldon', 'priya-patel'],
    createdAt: '2026-02-22T14:08:00Z',
  }),

  // ── Ghost records ────────────────────────────────────────────────────
  // These represent expected-but-absent transaction lines. There is no
  // underlying posted entry — the AI inferred the absence by comparing
  // the current period against an account fingerprint.

  // Ghost 1: Missing AWS monthly accrual in Accrued Liabilities (2100)
  {
    id: 'record-ghost-001',
    transactionId: '__ghost__',
    kind: 'ghost',
    ghostContext: {
      glAccountCode: '2100',
      glAccountName: 'Accrued Expenses',
      categoryLabel: 'Missing accrual entry',
      modelReasoning:
        'Account 2100 Accrued Expenses received a monthly accrual entry from Amazon Web Services every month for the past 12 months (avg $47,200/mo). No such entry has been posted in April 2026 as of the close date. This is likely a missed accrual for cloud infrastructure costs.',
      expectedVendor: 'Amazon Web Services',
      typicalAmount: 47200,
      confidence: 91,
      severity: 72,
      fingerprint: [
        { periodLabel: 'Apr 2025', hasEntry: true,  transactionId: 'JE-2025-041', amount: 44800, vendorName: 'Amazon Web Services' },
        { periodLabel: 'May 2025', hasEntry: true,  transactionId: 'JE-2025-055', amount: 45600, vendorName: 'Amazon Web Services' },
        { periodLabel: 'Jun 2025', hasEntry: true,  transactionId: 'JE-2025-069', amount: 46100, vendorName: 'Amazon Web Services' },
        { periodLabel: 'Jul 2025', hasEntry: true,  transactionId: 'JE-2025-082', amount: 47000, vendorName: 'Amazon Web Services' },
        { periodLabel: 'Aug 2025', hasEntry: true,  transactionId: 'JE-2025-096', amount: 47400, vendorName: 'Amazon Web Services' },
        { periodLabel: 'Sep 2025', hasEntry: true,  transactionId: 'JE-2025-110', amount: 46800, vendorName: 'Amazon Web Services' },
        { periodLabel: 'Oct 2025', hasEntry: true,  transactionId: 'JE-2025-124', amount: 47600, vendorName: 'Amazon Web Services' },
        { periodLabel: 'Nov 2025', hasEntry: true,  transactionId: 'JE-2025-138', amount: 48200, vendorName: 'Amazon Web Services' },
        { periodLabel: 'Dec 2025', hasEntry: true,  transactionId: 'JE-2025-152', amount: 48900, vendorName: 'Amazon Web Services' },
        { periodLabel: 'Jan 2026', hasEntry: true,  transactionId: 'JE-2026-008', amount: 47800, vendorName: 'Amazon Web Services' },
        { periodLabel: 'Feb 2026', hasEntry: true,  transactionId: 'JE-2026-021', amount: 47100, vendorName: 'Amazon Web Services' },
        { periodLabel: 'Mar 2026', hasEntry: true,  transactionId: 'JE-2026-034', amount: 47500, vendorName: 'Amazon Web Services' },
        { periodLabel: 'Apr 2026', hasEntry: false },
      ],
    },
    flags: [
      {
        id: 'flag-ghost-001',
        source: {
          kind: 'ai',
          categoryLabel: 'Missing accrual entry',
          modelReasoning:
            'Account 2100 Accrued Expenses received a monthly accrual entry from Amazon Web Services every month for the past 12 months (avg $47,200/mo). No such entry has been posted in April 2026 as of the close date. This is likely a missed accrual for cloud infrastructure costs.',
          confidence: 91,
        },
        severity: 72,
        detectedAt: '2026-04-30T06:00:00Z',
        scoreBreakdown: [
          { label: 'Streak length (12 consecutive months)', points: 35 },
          { label: 'Amount materiality ($47K avg)', points: 25 },
          { label: 'AI confidence (91%)', points: 12 },
        ],
      },
    ],
    primarySeverity: 72,
    status: 'open',
    assigneeIds: ['samantha-sheldon', 'emily-chen'],
    commentIds: [],
    createdAt: '2026-04-30T06:00:00Z',
    updatedAt: '2026-04-30T06:00:00Z',
  },

  // Ghost 2: Missing prepaid rent amortization in Prepaid Expenses (1200)
  {
    id: 'record-ghost-002',
    transactionId: '__ghost__',
    kind: 'ghost',
    ghostContext: {
      glAccountCode: '1200',
      glAccountName: 'Prepaid Expenses',
      categoryLabel: 'Missing amortization entry',
      modelReasoning:
        'Account 1200 Prepaid Expenses has shown a monthly amortization entry of $8,333 every month for the past 9 months, consistent with a 12-month office lease prepayment. No amortization entry was posted in April 2026. If omitted, the prepaid balance will be overstated by approximately $8,333.',
      expectedVendor: 'Kilroy Realty (LA HQ)',
      typicalAmount: 8333,
      confidence: 87,
      severity: 58,
      fingerprint: [
        { periodLabel: 'Jul 2025', hasEntry: true,  transactionId: 'JE-2025-078', amount: 8333, vendorName: 'Kilroy Realty (LA HQ)' },
        { periodLabel: 'Aug 2025', hasEntry: true,  transactionId: 'JE-2025-092', amount: 8333, vendorName: 'Kilroy Realty (LA HQ)' },
        { periodLabel: 'Sep 2025', hasEntry: true,  transactionId: 'JE-2025-106', amount: 8333, vendorName: 'Kilroy Realty (LA HQ)' },
        { periodLabel: 'Oct 2025', hasEntry: true,  transactionId: 'JE-2025-120', amount: 8333, vendorName: 'Kilroy Realty (LA HQ)' },
        { periodLabel: 'Nov 2025', hasEntry: true,  transactionId: 'JE-2025-134', amount: 8333, vendorName: 'Kilroy Realty (LA HQ)' },
        { periodLabel: 'Dec 2025', hasEntry: true,  transactionId: 'JE-2025-148', amount: 8333, vendorName: 'Kilroy Realty (LA HQ)' },
        { periodLabel: 'Jan 2026', hasEntry: true,  transactionId: 'JE-2026-005', amount: 8333, vendorName: 'Kilroy Realty (LA HQ)' },
        { periodLabel: 'Feb 2026', hasEntry: true,  transactionId: 'JE-2026-018', amount: 8333, vendorName: 'Kilroy Realty (LA HQ)' },
        { periodLabel: 'Mar 2026', hasEntry: true,  transactionId: 'JE-2026-031', amount: 8333, vendorName: 'Kilroy Realty (LA HQ)' },
        { periodLabel: 'Apr 2026', hasEntry: false },
      ],
    },
    flags: [
      {
        id: 'flag-ghost-002',
        source: {
          kind: 'ai',
          categoryLabel: 'Missing amortization entry',
          modelReasoning:
            'Account 1200 Prepaid Expenses has shown a monthly amortization entry of $8,333 every month for the past 9 months, consistent with a 12-month office lease prepayment. No amortization entry was posted in April 2026. If omitted, the prepaid balance will be overstated by approximately $8,333.',
          confidence: 87,
        },
        severity: 58,
        detectedAt: '2026-04-30T06:00:00Z',
        scoreBreakdown: [
          { label: 'Streak length (9 consecutive months)', points: 28 },
          { label: 'Fixed amount pattern (100% match)', points: 18 },
          { label: 'AI confidence (87%)', points: 12 },
        ],
      },
    ],
    primarySeverity: 58,
    status: 'open',
    assigneeIds: ['samantha-sheldon', 'priya-patel'],
    commentIds: [],
    createdAt: '2026-04-30T06:02:00Z',
    updatedAt: '2026-04-30T06:02:00Z',
  },

  // ───── Prepaid Expenses (account 1300) — rec-1 bridge targets ─────
  // Three anomaly records on three transactions in the Prepaid Expenses
  // account so the Close → Detect bridge on rec-1 lands users on real
  // anomalies instead of an empty filtered inbox.

  record({
    transactionId: txId('JE-2026-091'),
    status: 'open',
    flags: [
      aiFlag(
        'Self-approval — Prepaid Expenses',
        'Lisa Zhang submitted and approved this $142,000 amortization journal in under 3 minutes — a self-approval gap that breaches segregation of duties for amortization entries above $50K.',
        72,
        89,
        '2026-04-22T16:21:00Z',
        [
          { label: 'Self-approval (segregation of duties gap)', points: 48 },
          { label: 'High dollar amount ($142K)', points: 18 },
          { label: 'Amortization category — material', points: 6 },
        ],
      ),
    ],
    assigneeIds: ['samantha-sheldon', 'priya-patel'],
    createdAt: '2026-04-22T16:21:00Z',
  }),

  record({
    transactionId: txId('BILL-44091'),
    status: 'open',
    flags: [
      aiFlag(
        'Posting timing',
        'Vendor bill posted at 22:14 UTC — well outside the typical 08:00–18:00 weekday window for prepaid retainers on this account.',
        45,
        82,
        '2026-04-19T08:05:00Z',
        [
          { label: 'After-hours submission (22:14 UTC)', points: 22 },
          { label: 'Retainer prepayment — high-risk pattern', points: 14 },
          { label: 'Accelerated billing cycle', points: 9 },
        ],
      ),
    ],
    assigneeIds: ['samantha-sheldon', 'emily-chen'],
    createdAt: '2026-04-19T08:05:00Z',
  }),

  record({
    transactionId: txId('JE-2026-092'),
    status: 'resolved',
    resolution: {
      kind: 'no-action',
      at: '2026-04-27T11:00:00Z',
      byId: 'samantha-sheldon',
    },
    signOffs: {
      'samantha-sheldon': { at: '2026-04-27T11:00:00Z', byId: 'samantha-sheldon' },
    },
    flags: [
      aiFlag(
        'Period boundary adjustment',
        'Prepaid insurance entry posted on April 26 covers a period that extends past quarter-end — coverage-period reclassification flagged for review.',
        38,
        76,
        '2026-04-26T11:00:00Z',
      ),
    ],
    assigneeIds: ['samantha-sheldon', 'jennifer-wu'],
    createdAt: '2026-04-26T11:00:00Z',
  }),

  // ---------- Accounts Receivable (account 1100) ----------
  // 4 anomaly records — 1 resolved + 3 open — so the FloQast EMEA ·
  // 1100 Accounts Receivable rec has matching anomaly data and the
  // Close→Detect bridge for that rec aligns at 4 inbox records.

  // AR-1. Large enterprise renewal — high-dollar revenue invoice
  // posted close to period end, flagged for ASC 606 revenue
  // recognition review. Resolved after Lisa attached the signed SOW.
  record({
    transactionId: txId('INV-CUST-44120'),
    status: 'resolved',
    resolution: {
      kind: 'no-action',
      at: '2026-04-23T15:30:00Z',
      byId: 'priya-patel',
    },
    signOffs: {
      'priya-patel': { at: '2026-04-23T15:30:00Z', byId: 'priya-patel' },
      'lisa-zhang':  { at: '2026-04-23T16:00:00Z', byId: 'lisa-zhang' },
    },
    flags: [
      aiFlag(
        'Late-period revenue posting',
        'INV-CUST-44120 ($312,400, Acme Health) posted April 22 with an effective service-start date of April 1. Service period of 90% complete by close — ASC 606 revenue allocation should be verified before recognition.',
        58,
        0.81,
        '2026-04-22T14:33:00Z',
      ),
    ],
    assigneeIds: ['lisa-zhang', 'priya-patel'],
    createdAt: '2026-04-22T14:33:00Z',
  }),

  // AR-2. Self-approved AR write-off (rule + AI). Jennifer wrote off
  // a $47.5K uncollectible receivable AND approved it herself — both
  // self-approval segregation-of-duties and the missing dual-approval
  // for write-offs above $25K trip.
  record({
    transactionId: txId('AR-WO-2026-04'),
    status: 'open',
    flags: [
      ruleFlag('rule-self-approved', 'Self-Approved Transaction', 78, '2026-04-20T17:52:00Z', [
        { label: 'Submitter and approver are the same person', expected: 'Different approver', actual: 'Jennifer Wu submitted and approved' },
        { label: 'Write-off exceeds dual-approval threshold', expected: '≤ $25,000 single-approver', actual: '$47,500 — requires CFO + Controller co-sign' },
      ]),
      aiFlag(
        'AR write-off pattern',
        'AR write-offs by Jennifer Wu over the past 60 days total $128,400 across 4 entries — 3.4× her trailing-12 average. Sequence is consistent with a year-end cleanup pattern that audit typically samples.',
        62,
        0.84,
        '2026-04-20T18:05:00Z',
        [
          { label: 'Self-approved write-off above $25K threshold', points: 38 },
          { label: 'Trailing 60-day write-off volume 3.4× baseline', points: 16 },
          { label: 'No supporting documentation attached', points: 8 },
        ],
      ),
    ],
    assigneeIds: ['priya-patel', 'samantha-sheldon', 'jennifer-wu'],
    createdAt: '2026-04-20T17:52:00Z',
  }),

  // AR-3. Duplicate customer invoice. Same PO number issued within
  // 30 days — high-confidence duplicate-billing risk that would
  // distort AR aging and revenue recognition.
  //
  // Modeled as an AI flag (not a rule flag) so it survives
  // mergeFlagsIntoRecords on hydrate — rule-duplicate-invoice isn't
  // in rules.ts, and the merge step drops open records whose only
  // flag is a non-existent rule.
  record({
    transactionId: txId('INV-CUST-44135'),
    status: 'open',
    flags: [
      aiFlag(
        'Duplicate invoice pattern',
        'INV-CUST-44135 ($89,200, Acme Health) shares the same PO number (ACME-2026-Q1-447) and amount as INV-CUST-44128 posted 8 days earlier — high-confidence duplicate-billing pattern that would distort AR aging and revenue recognition.',
        66,
        0.91,
        '2026-04-17T11:34:00Z',
        [
          { label: 'PO + customer + amount triplet matches a prior invoice', points: 42 },
          { label: 'Two invoices to the same customer within 30 days', points: 18 },
          { label: 'No credit memo or void entry on the prior invoice', points: 6 },
        ],
      ),
    ],
    assigneeIds: ['david-park', 'marcus-rodriguez', 'priya-patel'],
    createdAt: '2026-04-17T11:34:00Z',
  }),

  // AR-4. Revenue accrual posted late — service-period close was
  // April 9 (per Q1 close calendar) but the accrual hit the books
  // April 12. Post-close entries are a recurring audit finding.
  //
  // Modeled as an AI flag so it survives the rule-engine merge on
  // hydrate — rule-post-close-entry isn't defined in rules.ts.
  record({
    transactionId: txId('JE-2026-095'),
    status: 'open',
    flags: [
      aiFlag(
        'Post-close revenue accrual',
        'JE-2026-095 ($158,750) posted April 12 covers a service period that ended April 8 — accrual landed 4 days after the Q1 close cutoff (April 9). Post-close entries on revenue accounts are recurring audit findings.',
        72,
        0.85,
        '2026-04-12T10:40:00Z',
        [
          { label: 'Material amount ($158.7K)', points: 30 },
          { label: '4-day post-close lag', points: 28 },
          { label: 'Approver did not request a memo amendment', points: 6 },
        ],
      ),
    ],
    assigneeIds: ['emily-chen', 'priya-patel'],
    createdAt: '2026-04-12T10:40:00Z',
  }),

];

// ---------- Auto-derive assignment reasons for every assignee ----------
//
// Per Carmen 5.28.26: every avatar in the Assignees container must
// open a popover with one of the four canonical categories — rule /
// account / manual / ultimate-owner. Hand-seeding reasons across 35
// records is brittle; instead this function deterministically fills
// any missing entries with a plausible reason:
//
//   • Rule owner of any rule flag on the record → `rule` (highest
//     priority — matches Gaurav's "you are the rule owner" framing)
//   • Configured Ultimate Owner (priya-patel) → `ultimate-owner`
//   • Remaining assignees cycle through `account` (Entity + GL
//     code from the underlying transaction) and `manual` (added
//     by "Olivia Reed")
//
// Called from the store's hydrate() AFTER mergeFlagsIntoRecords, so
// rule flags added by the engine are visible to the deriver.
const ULTIMATE_OWNER_DEFAULT = 'priya-patel';
export function deriveAssigneeReasonsForRecords(
  records: AnomalyRecord[],
): AnomalyRecord[] {
  return records.map((record) => {
    const tx = transactions.find((t) => t.id === record.transactionId);
    const entityName = tx
      ? entities.find((e) => e.id === tx.entityId)?.shortName ?? tx.entityId
      : 'Unknown entity';
    const accountCode = tx?.glAccountCode ?? '0000';
    const accountName =
      chartOfAccounts.find((a) => a.code === accountCode)?.name ??
      tx?.glAccountName ??
      '';

    // Map (userId → ruleName) for every rule flag whose owner is on
    // this record. Look up by ruleId first, then by name — the
    // seedAnomalies flag IDs don't always match rules.ts IDs.
    const assigneeIdSet = new Set(record.assigneeIds);
    const ownerRuleNames: Record<string, string> = {};
    for (const flag of record.flags) {
      if (flag.source.kind !== 'rule') continue;
      const ruleSource = flag.source as { kind: 'rule'; ruleId: string; ruleName: string };
      const rule =
        rules.find((r) => r.id === ruleSource.ruleId) ??
        rules.find((r) => r.name === ruleSource.ruleName);
      const ownerId = rule?.createdById;
      if (ownerId && assigneeIdSet.has(ownerId) && !ownerRuleNames[ownerId]) {
        ownerRuleNames[ownerId] = ruleSource.ruleName;
      }
    }

    const existing = record.assigneeReasons ?? {};
    const next: Record<string, AssigneeReason> = { ...existing };
    let nonOwnerIdx = 0;
    for (const userId of record.assigneeIds) {
      if (next[userId]) continue;
      if (ownerRuleNames[userId]) {
        next[userId] = { type: 'rule', ruleName: ownerRuleNames[userId] };
        continue;
      }
      if (userId === ULTIMATE_OWNER_DEFAULT) {
        next[userId] = { type: 'ultimate-owner' };
        continue;
      }
      // Per Gaurav's assignment hierarchy + Carmen 5.28.26:
      // auto-derived (non-rule, non-ultimate-owner) assignees can
      // only be `account` (dynamic / fallback collapse here).
      // Manual is reserved for explicit Edit Assignees adds, which
      // happen at runtime via assignRecord.
      next[userId] = { type: 'account', entityName, accountCode, accountName };
      nonOwnerIdx++;
    }
    return { ...record, assigneeReasons: next };
  });
}

// ---------- Seed comments ----------

function cmt(
  authorId: string,
  at: string,
  text: string,
): Omit<Comment, 'id'> {
  const author = getTeamMember(authorId);
  return {
    author: author?.name ?? authorId,
    avatar: author?.avatar ?? '',
    at,
    text,
  };
}

/**
 * Realistic in-progress comment threads on most transactions — keyed
 * by transaction UUID. Populated into the store's comments map at
 * hydration time (below).
 */
const commentsByTransactionId: Record<string, Array<Omit<Comment, 'id'>>> = {
  [txId('BILL-44022')]: [
    cmt('priya-patel',     '2026-04-20T14:00:00Z', '@Marcus Rodriguez — can you explain why this went through without a second approver? Nimbus is a new vendor, and $89K is well above the dual-approval threshold.'),
    cmt('marcus-rodriguez','2026-04-20T17:50:00Z', 'Fair call. The Nimbus engagement letter requires a Q2 milestone payment by EOD — I approved it time-critically. Happy to walk through the SOW offline. Will add David as secondary on the next payment.'),
  ],
  [txId('BILL-44023')]: [
    cmt('lisa-zhang',      '2026-04-21T08:50:00Z', "The Q2 accelerator campaign launch had to go live Sunday midnight London time for the EMEA announcement. I was traveling, submitted at 8:47am BST which was 2:47 UTC. This is expected — I'll attach the campaign brief."),
    cmt('samantha-sheldon','2026-04-21T09:50:00Z', 'Makes sense — I can clear this one. Leaving a note for the next reviewer in case it recurs.'),
  ],
  [txId('PO-2026-318')]: [
    cmt('priya-patel',     '2026-04-20T14:00:00Z', 'UK entity formation is time-sensitive — WSGR has been counsel for years. Approved the retainer by email Friday. Will attach the engagement letter.'),
    cmt('samantha-sheldon','2026-04-20T15:50:00Z', 'Noted. Adding the engagement letter requirement to the Q3 rule update so this passes documentation cleanly next time.'),
  ],
  [txId('BILL-44024')]: [
    cmt('david-park',      '2026-04-21T05:50:00Z', "Chased Andreessen HR — their invoicing system had a 2-day outage last week. They're resending the invoice by Monday. Will upload when received."),
  ],
  [txId('BILL-44025')]: [
    cmt('jennifer-wu',     '2026-04-20T14:00:00Z', "Bank verification pending with Compliance. TechSoft's W-9 checks out but the routing number doesn't match any of the vendors in our registry. Holding payment until Compliance signs off."),
    cmt('priya-patel',     '2026-04-20T23:50:00Z', 'Thanks Jennifer. Let me know by end of day Monday if we need to escalate.'),
  ],
  [txId('EXP-44721')]: [
    cmt('emily-chen',      '2026-04-20T14:00:00Z', "Q2 enterprise kickoff dinners with three new accounts — all CFO-approved per the entertainment budget. Receipts are in the expense report bundle. I'll close this one out."),
  ],
  [txId('BILL-44026')]: [
    cmt('lisa-zhang',      '2026-04-20T10:00:00Z', 'Digital Reach creative was time-critical for the Q2 launch — Marcus approved on chat. Will upload the Slack thread as the approval record.'),
    cmt('marcus-rodriguez','2026-04-20T11:00:00Z', "Confirmed. Lisa, let's add a ticket for next quarter to route these through the standard approval queue so we don't need the chat-approval workaround."),
  ],
  [txId('BILL-44027')]: [
    cmt('david-park',      '2026-04-21T06:50:00Z', 'Salesforce rebilled after the payment method update last week. Same invoice number because their AR pulled the original draft. Emailed their billing team to reissue with a proper credit — will adjust once received.'),
  ],
  [txId('JE-2026-041')]: [
    cmt('emily-chen',      '2026-04-21T03:50:00Z', "This is the March accrual I raised at last week's close meeting — vendor true-up we missed before the 09 Apr close. Approved post-close by Priya given the materiality ($18.4K) is below threshold."),
    cmt('priya-patel',     '2026-04-21T05:50:00Z', 'Confirmed. Documenting the post-close exception in the March close file. No other adjustments expected for March.'),
    cmt('marcus-rodriguez','2026-04-21T07:50:00Z', 'Noted in the consolidations workbook. Will reflect in the April re-consolidation tie-out.'),
  ],
  [txId('BILL-44028')]: [
    cmt('lisa-zhang',      '2026-04-19T10:00:00Z', 'Used "Urgent" and "Per CEO" in the memo because Mike verbally approved the booth upgrade on the Q2 kickoff call. Will attach the Slack thread — the pipeline math fully justifies the events budget.'),
    cmt('samantha-sheldon','2026-04-20T10:00:00Z', 'Understood the context, but we need documented CEO approval on file — a Slack screenshot doesn\'t satisfy the control. Can you get Mike to countersign the events request form before I clear this?'),
  ],
  [txId('EXP-44722')]: [
    cmt('emily-chen',      '2026-04-19T10:00:00Z', 'Sorry — used "." as a placeholder in the description field and forgot to go back before submitting. This was a gift basket for the Helix Labs enterprise deal signing ($620, pre-approved by Priya via email). Updating the description now.'),
  ],
  [txId('BILL-44029')]: [
    cmt('jennifer-wu',     '2026-04-18T10:00:00Z', "Bank change came directly from Nimbus's Finance lead. Verified via phone call on 04-10 with their CFO before the invoice landed. Uploading the verification memo to the record."),
    cmt('samantha-sheldon','2026-04-18T11:00:00Z', "Thanks. Can we get a second data point — maybe a DocuSigned attestation from Nimbus going forward? The verbal verification is fine this time but let's tighten it for future bank changes."),
  ],
  [txId('PO-2026-319')]: [
    cmt('jennifer-wu',     '2026-04-16T10:00:00Z', "Left the department field blank when I entered this — the Q2 office fit-out spans Engineering and G&A and I wasn't sure which to use. Priya confirmed it should be tagged to Facilities. Updating now."),
  ],
  [txId('JE-2026-042')]: [
    cmt('emily-chen',      '2026-04-14T10:00:00Z', "Reversing JE-2026-021 from February — the enterprise customer cancellation was in legal dispute since early Feb and just settled. We held the original accrual while the contract terms were being negotiated."),
    cmt('marcus-rodriguez','2026-04-14T11:00:00Z', "Acknowledged. The 65-day gap will raise questions at audit — attach the legal correspondence confirming the cancellation date so reviewers can see why we held the reversal this long."),
  ],
  [txId('PAY-2026-203')]: [
    cmt('jennifer-wu',     '2026-04-14T10:00:00Z', "Weekly AP run defaulted to Sunday after the bank maintenance window shifted in March. I'm rescheduling to Monday mornings effective next week."),
  ],
  // AI-flagged records
  [txId('BILL-44030')]: [
    cmt('jennifer-wu',      '2026-04-10T09:15:00Z', 'Checked with David — the April AWS spike is the Q1 reserved-instance true-up plus the migration project burst compute. I\'ll pull the AWS Cost Explorer report and attach it.'),
    cmt('david-park',       '2026-04-10T10:40:00Z', 'Confirmed. We bought 3-year reserved instances for the new data pipeline cluster and the first full month is billing now. $140K of the $284K is the upfront amortization. Attaching the billing breakdown from AWS.'),
  ],
  [txId('BILL-44031')]: [
    cmt('emily-chen',       '2026-04-09T13:00:00Z', 'This is additional fieldwork from Deloitte for the Q1 close — they flagged three open items in the inventory counts that required extra audit procedures. Invoice reference matches the March SOW extension we signed on 03-28.'),
    cmt('priya-patel',      '2026-04-09T15:30:00Z', 'OK, I\'ll need the signed SOW extension attached before I can clear this. The amount and keywords look too close to the March invoice — auditors will ask the same question.'),
  ],
  [txId('BILL-44033')]: [
    cmt('emily-chen',       '2026-04-23T10:00:00Z', 'Q1 audit closeout invoice — Deloitte submitted it Wednesday evening after we wrapped the final fieldwork call. I approved late that night from my laptop while traveling. Happy to get a second sign-off from Marcus if needed.'),
    cmt('priya-patel',      '2026-04-23T11:30:00Z', 'Emily — for anything above $150K, we need dual approval per the updated policy. Please loop in Marcus as co-approver. I\'ll hold signing off until that\'s done.'),
  ],
  // BILL-44034 comment block intentionally removed alongside the
  // anomaly record (see note above) so account 6040 has exactly 4
  // records, matching the 4 anomalous transactions in the Close view.
  [txId('BILL-44036')]: [
    cmt('lisa-zhang',       '2026-04-21T08:30:00Z', 'ZoomInfo enterprise expansion — we added 45 new sales seats for the SDR team as part of the Q2 headcount plan. This was in the Q2 budget deck. I can attach the approved budget line if needed.'),
    cmt('marcus-rodriguez', '2026-04-21T09:45:00Z', 'I remember approving the headcount plan but I\'d like to see the ZoomInfo contract amendment before we release payment. Can you pull the order form, Lisa?'),
  ],
  [txId('JE-2026-044')]: [
    cmt('emily-chen',       '2026-04-18T08:00:00Z', 'JE-2026-043 was a Q2 accrual we posted prematurely based on an expected contract signature that fell through. Reversing it here to keep the April balance clean. No net impact intended.'),
    cmt('priya-patel',      '2026-04-18T09:30:00Z', 'Understood, but a $75K same-period create-and-reverse with a different approver is going to get flagged at audit. Let\'s add a proper memo to JE-2026-043 explaining the reversal reason and attach the contract termination notice.'),
  ],
  [txId('BILL-44037')]: [
    cmt('emily-chen',       '2026-04-24T15:00:00Z', 'WSGR submitted this invoice late — it covers March IP filings but they only sent it to us on April 22. I backdated the GL entry to April 2 to align with when the service was substantially complete. Will attach the original invoice date.'),
    cmt('marcus-rodriguez', '2026-04-24T16:30:00Z', 'Emily, April 2 GL date with an April 24 entry creates a 22-day gap that audit will flag. If the invoice is dated April, we should keep the GL date in April too. Please recheck the date and attach the WSGR invoice.'),
  ],
  [txId('BILL-44038')]: [
    cmt('jennifer-wu',      '2026-04-25T08:00:00Z', 'Emily asked me to post this PwC invoice while she was out — she\'s the one who owns the relationship. She approved via Slack before I submitted. I\'ll attach the Slack thread as the authorization record.'),
    cmt('samantha-sheldon', '2026-04-25T09:15:00Z', 'Jennifer — for sensitive accounts like 6520 Tax Prep, we need a written delegation on file, not just a Slack message. Can you have Emily email you a formal delegation note so we can document this properly?'),
  ],
  [txId('JE-2026-046')]: [
    cmt('emily-chen',       '2026-04-24T08:00:00Z', 'This is the last of the Q1 accrual clean-ups — the prior three reversals were for different vendor true-ups as invoices came in. This one closes out the final open item. I\'ll add a summary note cross-referencing all four so it\'s clear they\'re not related.'),
    cmt('marcus-rodriguez', '2026-04-24T09:30:00Z', 'Agreed on the summary note — that will help at audit. Going forward, let\'s stage these reversals across periods rather than batching them all in April. I\'ll add this to the close process doc.'),
  ],
  [txId('BILL-44046')]: [
    cmt('emily-chen',       '2026-04-25T11:00:00Z', 'Third Deloitte invoice this month — the first two were audit closeout ($168K) and extra Q1 fieldwork ($62K). This one is new: Q2 planning engagement that Priya approved as part of the strategic refresh. Contract is attached.'),
    cmt('priya-patel',      '2026-04-25T13:00:00Z', 'Confirmed. I approved this separately from the audit engagement — it\'s a discrete Q2 advisory SOW. Will add the signed contract to the record so future reviewers can distinguish the two scopes.'),
  ],
  [txId('JE-2026-047')]: [
    cmt('jennifer-wu',      '2026-04-23T08:30:00Z', 'Manual adjustment needed because the HubSpot API sync posted an incorrect seat count for Q1. The system auto-entry is now being corrected manually until HubSpot\'s billing team fixes their API. Marcus is aware — I\'ll attach the HubSpot support ticket.'),
    cmt('marcus-rodriguez', '2026-04-24T09:00:00Z', 'Confirmed — HubSpot opened ticket #HS-2026-0841 for the sync issue. In the meantime, Jennifer is authorized to post manual corrections to 6130 until the fix is deployed. I\'ll add a note to the account in the close workbook.'),
  ],
  [txId('BILL-44047')]: [
    cmt('priya-patel',      '2026-04-25T09:00:00Z', 'WSGR routed this through their London office since it covers UK IP filings. First time we\'ve seen a EUR invoice from them. I\'ve asked their billing team to clarify whether future UK work will be invoiced in GBP or EUR, and will update our vendor record accordingly.'),
    cmt('jennifer-wu',      '2026-04-25T10:15:00Z', 'Flagging for AP: we\'ll need a currency conversion rate and the corresponding FX gain/loss JE when we pay this. I\'ll set up a call with WSGR to understand their UK billing entity going forward.'),
  ],
  [txId('BILL-43818')]: [
    cmt('marcus-rodriguez', '2026-04-04T09:00:00Z', 'PwC Canada — this is for the Canadian GST/HST filing, handled by their Toronto practice. Different legal entity from PwC US. I\'ve worked with PwC Canada on prior Canadian tax matters; this is legitimate. Will add PwC Canada as a distinct vendor record.'),
  ],

  // Historical (resolved/dismissed) — single comment for context
  [txId('BILL-43920')]: [
    cmt('priya-patel',     '2026-03-25T10:00:00Z', 'Standing WSGR retainer — sole approver by design per legal policy §3.1. Adding to the close task list for controller review.'),
  ],
  [txId('BILL-43922')]: [
    cmt('emily-chen',      '2026-03-20T10:00:00Z', 'Invoice recovered from LinkedIn — original had bounced through spam filter. Posted correcting JE-2026-0319 to attach proper documentation.'),
  ],
};

export const seedComments: Record<string, Comment[]> = {};

// Hydrate comments into the seedComments map keyed by record ID and
// attach each record's commentIds so downstream UI can look them up.
let seedCommentCounter = 0;
for (const rec of seedRecords) {
  const tpl = commentsByTransactionId[rec.transactionId];
  if (!tpl || tpl.length === 0) continue;
  const hydrated: Comment[] = tpl.map((c) => ({
    ...c,
    id: `comment-seed-${++seedCommentCounter}`,
  }));
  seedComments[rec.id] = hydrated;
  rec.commentIds = hydrated.map((c) => c.id);
}

// ---------- Seed activity log ----------

/**
 * Seeded activity entries that replay the resolutions taken on the
 * closed-period historical records. Newest entries appear first in
 * the drawer; these give the Activity drawer a realistic starting state.
 */
function entry(
  recordId: string,
  byId: string,
  at: string,
  kind: ActivityEntry['kind'],
  message: string,
): ActivityEntry {
  return {
    id: `activity-seed-${recordId}-${kind}-${at}`,
    recordId,
    byId,
    at,
    kind,
    message,
  };
}

export const seedActivity: ActivityEntry[] = [];
for (const rec of seedRecords) {
  // Group flags into two buckets:
  //   • initial — detected at or within 1 hour of the record's createdAt
  //   • subsequent — detected more than 1 hour after (redo/re-evaluation flags)
  const createdTs = new Date(rec.createdAt).getTime();
  const ONE_HOUR_MS = 60 * 60 * 1000;
  const initialFlags = rec.flags.filter(
    (f) => new Date(f.detectedAt).getTime() - createdTs < ONE_HOUR_MS,
  );
  const subsequentFlags = rec.flags.filter(
    (f) => new Date(f.detectedAt).getTime() - createdTs >= ONE_HOUR_MS,
  );

  // Helper: build a "Rule detected: X" / "AI detected: X" label for one flag
  const flagLabel = (f: (typeof rec.flags)[number]): string =>
    f.source.kind === 'rule'
      ? `Rule detected: ${f.source.ruleName}`
      : `AI detected: ${f.source.categoryLabel}`;

  // Initial flag-added entry — one entry covering all flags raised at detection
  const initialPrimary = [...initialFlags].sort((a, b) => b.severity - a.severity)[0]
    ?? rec.flags[0];
  seedActivity.push({
    id: `activity-seed-${rec.id}-flag-added`,
    recordId: rec.id,
    byId: 'system',
    at: rec.createdAt,
    kind: 'flag-added',
    source: initialPrimary.source.kind === 'ai' ? 'ai' : 'rule',
    message: 'Flagged anomalies',
    details: initialFlags.map(flagLabel),
  });

  // Subsequent flag-added entries — one entry per distinct detection date
  // (covers redo/re-evaluation flags on BILL-44024, BILL-44025, EXP-44721)
  const byDate = new Map<string, typeof rec.flags>();
  for (const f of subsequentFlags) {
    const day = f.detectedAt.slice(0, 10);
    if (!byDate.has(day)) byDate.set(day, []);
    byDate.get(day)!.push(f);
  }
  for (const [, flags] of byDate) {
    seedActivity.push({
      id: `activity-seed-${rec.id}-flag-added-${flags[0].detectedAt}`,
      recordId: rec.id,
      byId: 'system',
      at: flags[0].detectedAt,
      kind: 'flag-added',
      source: flags[0].source.kind === 'ai' ? 'ai' : 'rule',
      message: 'Flagged anomalies',
      details: flags.map(flagLabel),
    });
  }

  // Every record: one consolidated assigned entry covering all initial assignees
  if (rec.assigneeIds.length > 0) {
    seedActivity.push({
      id: `activity-seed-${rec.id}-assigned`,
      recordId: rec.id,
      byId: 'system',
      at: rec.createdAt,
      kind: 'assigned',
      message: `Assigned ${rec.assigneeIds.length} assignees`,
      details: rec.assigneeIds.map((id) => `Added ${getTeamMember(id)?.name ?? id}`),
    });
  }

  // Resolved and dismissed records: seed the resolution event
  if (rec.status === 'resolved' && rec.resolution) {
    const r = rec.resolution;
    let msg = 'Signed off';
    if (r.kind === 'journal-entry') {
      msg = `Signed off — posted correcting ${r.jeNumber}`;
    } else if (r.kind === 'reconciliation') {
      msg = `Signed off — added to ${r.reconName}`;
    } else if (r.kind === 'close-task') {
      msg = `Signed off — created close task ${r.taskId}`;
    } else if (r.kind === 'flux-explanation') {
      msg = `Signed off — added flux note to ${r.fluxId}`;
    }
    seedActivity.push(entry(rec.id, r.byId, r.at, 'resolved', msg));
  } else if (rec.status === 'dismissed' && rec.resolution?.kind === 'dismissed') {
    seedActivity.push(
      entry(
        rec.id,
        rec.resolution.byId,
        rec.resolution.at,
        'dismissed',
        `Ignored — ${rec.resolution.reason}`,
      ),
    );
  }
}

// Seed comment-posted activity for non-current-user assignees who have seed
// comments on their assigned records. This powers the "Reviewed" state in
// both the ReviewHeader (V2) and the AssigneesModal (V1).
const commentedAssignees: Array<{ txERP: string; userId: string; at: string }> = [
  { txERP: 'BILL-44022', userId: 'priya-patel',      at: '2026-04-19T09:00:00Z' },
  { txERP: 'BILL-44023', userId: 'lisa-zhang',       at: '2026-04-20T10:30:00Z' },
  { txERP: 'BILL-44025', userId: 'jennifer-wu',      at: '2026-04-17T10:00:00Z' },
  { txERP: 'BILL-44027', userId: 'david-park',       at: '2026-04-08T12:00:00Z' },
  { txERP: 'JE-2026-047', userId: 'marcus-rodriguez', at: '2026-04-24T09:00:00Z' },
];
for (const { txERP, userId, at } of commentedAssignees) {
  const rec = seedRecords.find((r) => r.transactionId === txId(txERP));
  if (rec && rec.assigneeIds.includes(userId)) {
    seedActivity.push(entry(rec.id, userId, at, 'comment-posted', 'Posted a comment'));
  }
}
