import type { Insight } from '../types';

export const INSIGHTS: Insight[] = [
  {
    id: 'INS-001',
    name: 'Analysis Period Adjustment',
    type: 'Standard Check',
    description: 'This insight detects pairs of transactions that: occur in subsequent analysis periods, are reversals of each other, and/or occur within 20 days of each other...',
    insightCount: 5,
  },
  {
    id: 'INS-002',
    name: 'Cash Expenditure',
    type: 'Standard Check',
    description: 'This insight flags entries wherein cash or cash-equivalent accounts are credited.',
    insightCount: 10,
  },
  {
    id: 'INS-003',
    name: 'Duplicate',
    type: 'Standard Check',
    description: 'This insight flags duplicate transactions by matching credit and debit values with accounts and effective dates to avoid misstatement in the accounts.',
    insightCount: 8,
  },
  {
    id: 'INS-004',
    name: 'Empty Text Field',
    type: 'Account Fingerprint',
    description: 'This insight flags a given transaction when all of the entries within it contain blank Memo fields.',
    insightCount: 5,
  },
  {
    id: 'INS-005',
    name: 'Cash to Bad Debt Conversion',
    type: 'Algorithm',
    description: 'This insight flags entries containing matching monetary amounts from credited cash and cash-equivalent accounts are found as debits in a bad expense account. It is only triggered if the ba...',
    insightCount: 3,
  },
  {
    id: 'INS-006',
    name: 'Change in Account Trend',
    type: 'Algorithm',
    description: 'This insight flags entries that contain amounts that deviate from the expected trend over a period of time.',
    insightCount: 7,
  },
  {
    id: 'INS-007',
    name: 'Complex Instrument',
    type: 'Algorithm',
    description: 'This insight flags entries with specific keywords (e.g., "fair value", "swap", "option") found in the Memo field. Keywords can be added and/or removed as needed in the engagement\'s risk score...',
    insightCount: 4,
  },
  {
    id: 'INS-008',
    name: 'Complex Structure',
    type: 'Account Fingerprint',
    description: 'This insight flags transactions that are structurally complex, based on indicators related to transaction structures and monetary flows.',
    insightCount: 5,
  },
  {
    id: 'INS-009',
    name: 'End of Analysis Period',
    type: 'Account Fingerprint',
    description: 'This insight flags entries that occurred within the last 10 days of an analysis period. The time frame is configurable in the engagement\'s risk score settings.',
    insightCount: 5,
  },
  {
    id: 'INS-010',
    name: 'Benford\'s Law Distribution',
    type: 'Standard Check',
    description: 'Certain digits have a higher probability of occurring in a dataset than others. This insight flags entries wherein the first 2 digits occur more or less than expected, as determined by Benford\'s Law.',
    insightCount: 6,
  },
];
