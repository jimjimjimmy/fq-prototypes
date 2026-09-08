import type { Rule } from '../types';

export type MockRule = Omit<Rule, 'icon'> & { iconId: string };

export const INITIAL_RULES: MockRule[] = [
  {
    id: '1',
    name: 'Transaction >$1M',
    totalCount: 0, unresolvedCount: 0, // computed dynamically by rule engine
    iconId: 'dollar-sign',
    status: 'Active',
    description: 'Flag transactions exceeding $1M threshold for immediate CFO review',
    version: 2,
    logic: {
      id: 'g1', type: 'group', logic: 'AND',
      items: [
        { id: 'c1', type: 'condition', field: 'Amount', operator: 'Greater Than', value: '1000000' }
      ]
    },
    activityLog: [
      { id: '1', timestamp: 'Jan 10, 2026, 09:30 AM', author: 'Maria Gonzalez', action: 'created', initialFields: { name: 'Transaction >$1M', description: 'Flag transactions exceeding $1M', status: 'Active' }, version: 1 },
      { id: '2', timestamp: 'Feb 15, 2026, 02:00 PM', author: 'Maria Gonzalez', action: 'edited', changes: [{ field: 'Description', oldValue: 'Flag transactions exceeding $1M', newValue: 'Flag transactions exceeding $1M threshold for immediate CFO review' }], version: 2, previousVersion: 1 }
    ],
    preparers: ['Sarah Chen'],
    reviewers: ['David Park'],
    ruleOwner: 'Maria Gonzalez',
    severity: 5
  },
  {
    id: '2',
    name: 'Missing Department',
    totalCount: 0, unresolvedCount: 0,
    iconId: 'tag',
    status: 'Active',
    description: 'Flag transactions without a department classification — required for departmental P&L accuracy',
    version: 1,
    logic: {
      id: 'g2', type: 'group', logic: 'AND',
      items: [
        { id: 'c2', type: 'condition', field: 'Department', operator: 'Is Empty', value: '' }
      ]
    },
    activityLog: [
      { id: '1', timestamp: 'Jan 5, 2026, 10:00 AM', author: 'Sarah Chen', action: 'created', initialFields: { name: 'Missing Department', description: 'Flag transactions without department', status: 'Active' }, version: 1 }
    ],
    preparers: ['Sarah Chen'],
    reviewers: ['David Park'],
    ruleOwner: 'Sarah Chen',
    severity: 3
  },
  {
    id: '3',
    name: 'Round Dollar Amounts',
    totalCount: 0, unresolvedCount: 0,
    iconId: 'dollar-sign',
    status: 'Active',
    description: 'Flag transactions with round dollar amounts ($5K+) that may indicate estimated or fabricated entries',
    version: 1,
    logic: {
      id: 'g3', type: 'group', logic: 'AND',
      items: [
        { id: 'c3a', type: 'condition', field: 'Is Round Number', operator: 'Equals', value: 'true' },
        { id: 'c3b', type: 'condition', field: 'Amount', operator: 'Greater Than or Equal', value: '5000' }
      ]
    },
    activityLog: [
      { id: '1', timestamp: 'Jan 5, 2026, 10:30 AM', author: 'David Park', action: 'created', initialFields: { name: 'Round Dollar Amounts', description: 'Flag round amounts', status: 'Active' }, version: 1 }
    ],
    preparers: ['Sarah Chen'],
    reviewers: ['David Park'],
    ruleOwner: 'David Park',
    severity: 2
  },
  {
    id: '4',
    name: 'Missing Approvals',
    totalCount: 0, unresolvedCount: 0,
    iconId: 'file',
    status: 'Active',
    description: 'Flag high-value transactions (>$5K) without a purchase order reference — potential control bypass',
    version: 1,
    logic: {
      id: 'g4', type: 'group', logic: 'AND',
      items: [
        { id: 'c4a', type: 'condition', field: 'Has PO', operator: 'Is Empty', value: '' },
        { id: 'c4b', type: 'condition', field: 'Amount', operator: 'Greater Than', value: '5000' }
      ]
    },
    activityLog: [
      { id: '1', timestamp: 'Jan 8, 2026, 11:00 AM', author: 'Maria Gonzalez', action: 'created', initialFields: { name: 'Missing Approvals', description: 'Flag high-value without PO', status: 'Active' }, version: 1 }
    ],
    preparers: ['Sarah Chen'],
    reviewers: ['David Park'],
    ruleOwner: 'Maria Gonzalez',
    severity: 4
  },
  {
    id: '5',
    name: 'Threshold Circumvention',
    totalCount: 0, unresolvedCount: 0,
    iconId: 'dollar-sign',
    status: 'Active',
    description: 'Flag transactions between $4,500-$4,999 from new vendors — potential split to avoid $5K approval threshold',
    version: 1,
    logic: {
      id: 'g5', type: 'group', logic: 'AND',
      items: [
        { id: 'c5a', type: 'condition', field: 'Amount', operator: 'Greater Than or Equal', value: '4500' },
        { id: 'c5b', type: 'condition', field: 'Amount', operator: 'Less Than', value: '5000' },
        { id: 'c5c', type: 'condition', field: 'Vendor Age', operator: 'Less Than', value: '30' }
      ]
    },
    activityLog: [
      { id: '1', timestamp: 'Jan 12, 2026, 09:00 AM', author: 'Maria Gonzalez', action: 'created', initialFields: { name: 'Threshold Circumvention', description: 'Detect split transactions', status: 'Active' }, version: 1 }
    ],
    preparers: ['Sarah Chen'],
    reviewers: ['Maria Gonzalez'],
    ruleOwner: 'Maria Gonzalez',
    severity: 5
  },
  {
    id: '6',
    name: 'New Vendor Large Payment',
    totalCount: 0, unresolvedCount: 0,
    iconId: 'tag',
    status: 'Active',
    description: 'Flag payments >$5K to vendors created within the last 30 days',
    version: 1,
    logic: {
      id: 'g6', type: 'group', logic: 'AND',
      items: [
        { id: 'c6a', type: 'condition', field: 'Vendor Age', operator: 'Less Than', value: '30' },
        { id: 'c6b', type: 'condition', field: 'Amount', operator: 'Greater Than', value: '5000' }
      ]
    },
    activityLog: [
      { id: '1', timestamp: 'Jan 12, 2026, 09:30 AM', author: 'David Park', action: 'created', initialFields: { name: 'New Vendor Large Payment', description: 'Flag new vendor payments', status: 'Active' }, version: 1 }
    ],
    preparers: ['Sarah Chen'],
    reviewers: ['David Park'],
    ruleOwner: 'David Park',
    severity: 4
  },
  {
    id: '7',
    name: 'Post-Close Entry',
    totalCount: 0, unresolvedCount: 0,
    iconId: 'file',
    status: 'Active',
    description: 'Flag transactions entered after the period close date — potential period manipulation',
    version: 1,
    logic: {
      id: 'g7', type: 'group', logic: 'AND',
      items: [
        { id: 'c7', type: 'condition', field: 'Is Post Close', operator: 'Equals', value: 'true' }
      ]
    },
    activityLog: [
      { id: '1', timestamp: 'Jan 15, 2026, 02:00 PM', author: 'Maria Gonzalez', action: 'created', initialFields: { name: 'Post-Close Entry', description: 'Flag post-close entries', status: 'Active' }, version: 1 }
    ],
    preparers: ['Sarah Chen'],
    reviewers: ['Maria Gonzalez'],
    ruleOwner: 'Maria Gonzalez',
    severity: 5
  },
  {
    id: '8',
    name: 'Weekend Transaction',
    totalCount: 0, unresolvedCount: 0,
    iconId: 'file',
    status: 'Active',
    description: 'Flag transactions posted on weekends when standard operations are closed',
    version: 1,
    logic: {
      id: 'g8', type: 'group', logic: 'OR',
      items: [
        { id: 'c8a', type: 'condition', field: 'Day Of Week', operator: 'Equals', value: '0' },
        { id: 'c8b', type: 'condition', field: 'Day Of Week', operator: 'Equals', value: '6' }
      ]
    },
    activityLog: [
      { id: '1', timestamp: 'Jan 15, 2026, 02:30 PM', author: 'David Park', action: 'created', initialFields: { name: 'Weekend Transaction', description: 'Flag weekend posts', status: 'Active' }, version: 1 }
    ],
    preparers: ['Sarah Chen'],
    reviewers: ['David Park'],
    ruleOwner: 'David Park',
    severity: 3
  },
  {
    id: '9',
    name: 'Expense Misclassification',
    totalCount: 0, unresolvedCount: 0,
    iconId: 'tag',
    status: 'Active',
    description: 'Flag large charges (>$50K) to IT Operating that may be capex items miscoded as opex',
    version: 1,
    logic: {
      id: 'g9', type: 'group', logic: 'AND',
      items: [
        { id: 'c9a', type: 'condition', field: 'Account', operator: 'Contains', value: '6420' },
        { id: 'c9b', type: 'condition', field: 'Amount', operator: 'Greater Than', value: '50000' }
      ]
    },
    activityLog: [
      { id: '1', timestamp: 'Feb 1, 2026, 10:00 AM', author: 'Maria Gonzalez', action: 'created', initialFields: { name: 'Expense Misclassification', description: 'Detect capex as opex', status: 'Active' }, version: 1 }
    ],
    preparers: ['Sarah Chen'],
    reviewers: ['Maria Gonzalez'],
    ruleOwner: 'Maria Gonzalez',
    severity: 4
  },
  {
    id: '10',
    name: 'Segregation of Duties',
    totalCount: 0, unresolvedCount: 0,
    iconId: 'file',
    status: 'Active',
    description: 'Flag transactions where the same person both entered and approved (>$10K)',
    version: 1,
    logic: {
      id: 'g10', type: 'group', logic: 'AND',
      items: [
        { id: 'c10a', type: 'condition', field: 'Amount', operator: 'Greater Than', value: '10000' },
        { id: 'c10b', type: 'condition', field: 'Memo', operator: 'Contains', value: 'self-approved' }
      ]
    },
    activityLog: [
      { id: '1', timestamp: 'Feb 5, 2026, 11:00 AM', author: 'David Park', action: 'created', initialFields: { name: 'Segregation of Duties', description: 'Detect SOD violations', status: 'Active' }, version: 1 }
    ],
    preparers: ['Dynamic Assignment'],
    reviewers: ['Maria Gonzalez'],
    ruleOwner: 'Maria Gonzalez',
    severity: 5
  },
  {
    id: '11',
    name: 'New Vendor No EIN',
    totalCount: 0, unresolvedCount: 0,
    iconId: 'tag',
    status: 'Active',
    description: 'Flag transactions from new vendors (< 90 days) where EIN is missing — ghost vendor risk',
    version: 1,
    logic: {
      id: 'g11', type: 'group', logic: 'AND',
      items: [
        { id: 'c11a', type: 'condition', field: 'Vendor Age', operator: 'Less Than', value: '90' },
        { id: 'c11b', type: 'condition', field: 'Memo', operator: 'Contains', value: 'no EIN' }
      ]
    },
    activityLog: [
      { id: '1', timestamp: 'Jan 20, 2026, 03:00 PM', author: 'Maria Gonzalez', action: 'created', initialFields: { name: 'New Vendor No EIN', description: 'Flag vendors without EIN', status: 'Active' }, version: 1 }
    ],
    preparers: ['Sarah Chen'],
    reviewers: ['David Park'],
    ruleOwner: 'Maria Gonzalez',
    severity: 5
  },
  {
    id: '12',
    name: 'Suspense Account Activity',
    totalCount: 0, unresolvedCount: 0,
    iconId: 'file',
    status: 'Active',
    description: 'Flag any activity in the Suspense account — all entries must be cleared within the period',
    version: 1,
    logic: {
      id: 'g12', type: 'group', logic: 'AND',
      items: [
        { id: 'c12', type: 'condition', field: 'Account', operator: 'Contains', value: '9900' }
      ]
    },
    activityLog: [
      { id: '1', timestamp: 'Jan 5, 2026, 09:00 AM', author: 'David Park', action: 'created', initialFields: { name: 'Suspense Account Activity', description: 'Monitor suspense account', status: 'Active' }, version: 1 }
    ],
    preparers: ['Sarah Chen'],
    reviewers: ['David Park'],
    ruleOwner: 'David Park',
    severity: 4
  },
  // Deactivated rule for testing
  {
    id: '13',
    name: 'Legacy Amount Check',
    totalCount: 0, unresolvedCount: 0,
    iconId: 'dollar-sign',
    status: 'Deactivated',
    description: 'Former threshold check — replaced by Transaction >$1M rule',
    version: 1,
    logic: {
      id: 'g13', type: 'group', logic: 'AND',
      items: [
        { id: 'c13', type: 'condition', field: 'Amount', operator: 'Greater Than', value: '500000' }
      ]
    },
    activityLog: [
      { id: '1', timestamp: 'Dec 1, 2025, 10:00 AM', author: 'Maria Gonzalez', action: 'created', initialFields: { name: 'Legacy Amount Check', status: 'Active' }, version: 1 },
      { id: '2', timestamp: 'Jan 10, 2026, 09:30 AM', author: 'Maria Gonzalez', action: 'deactivated', version: 1 }
    ],
    preparers: ['Sarah Chen'],
    reviewers: ['David Park'],
    ruleOwner: 'Maria Gonzalez',
    severity: 3
  }
];
