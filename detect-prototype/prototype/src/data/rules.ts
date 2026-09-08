import type { Rule } from './types';

// Rule definitions — conditions are display metadata; evaluators are in rulesEngine.ts
export const rules: Rule[] = [

  {
    id: 'rule-department-blank',
    name: 'Department is Blank',
    description: 'Transaction posted without a department tag.',
    status: 'active',
    severity: 35,
    conditions: [
      {
        id: 'c1',
        field: 'department',
        operator: 'is-blank',
        value: '',
        label: 'Department field is blank',
        expectedText: 'A valid department tag',
      },
    ],
    createdById: 'samantha-sheldon',
    createdAt: '2026-04-29T09:00:00Z',
    lastEditedById: 'samantha-sheldon',
    lastEditedAt: '2026-04-29T09:00:00Z',
  },

  {
    id: 'rule-class-blank',
    name: 'Class is Blank',
    description: 'Transaction missing a Class tag.',
    status: 'active',
    severity: 30,
    conditions: [
      {
        id: 'c1',
        field: 'class',
        operator: 'is-blank',
        value: '',
        label: 'Class field is blank',
        expectedText: 'A valid class tag',
      },
    ],
    createdById: 'samantha-sheldon',
    createdAt: '2026-04-29T09:00:00Z',
    lastEditedById: 'marcus-rodriguez',
    lastEditedAt: '2026-05-03T14:20:00Z',
    version: 2,
    versionHistory: [
      {
        version: 2,
        editedAt: '2026-05-03T14:20:00Z',
        editedById: 'marcus-rodriguez',
        scope: 'with-historical',
        historicalPeriods: ['2025-10', '2025-11', '2025-12'],
        prevSnapshot: {
          name: 'Class is Blank',
          description: 'Transaction missing a Class tag.',
          severity: 2,
          conditions: [
            { field: 'class', operator: 'equals', value: 'Uncategorized' },
          ],
        },
        nextSnapshot: {
          name: 'Class is Blank',
          description: 'Transaction missing a Class tag.',
          severity: 2,
          conditions: [
            { field: 'class', operator: 'is-blank', value: '' },
          ],
        },
      },
    ],
  },

  {
    id: 'rule-bypassed-description',
    name: 'Bypassed Description',
    description: 'Users entering filler text (e.g. "None" or ".") to bypass a required field.',
    status: 'active',
    severity: 48,
    conditions: [
      {
        id: 'c1',
        field: 'description',
        operator: 'equals',
        value: 'None',
        label: 'Description is "None" (filler)',
        expectedText: 'Descriptive memo text',
      },
      {
        id: 'c2',
        field: 'description',
        operator: 'equals',
        value: '.',
        label: 'Description is "." (filler character)',
        expectedText: 'Descriptive memo text',
      },
      {
        id: 'c3',
        field: 'description',
        operator: 'is-blank',
        value: '',
        label: 'Description is blank',
        expectedText: 'Descriptive memo text',
      },
    ],
    createdById: 'samantha-sheldon',
    createdAt: '2026-04-29T09:00:00Z',
    lastEditedById: 'priya-patel',
    lastEditedAt: '2026-05-08T16:30:00Z',
    version: 3,
    versionHistory: [
      {
        version: 2,
        editedAt: '2026-05-01T10:00:00Z',
        editedById: 'samantha-sheldon',
        scope: 'current-and-future',
        prevSnapshot: {
          name: 'Bypassed Description',
          description: 'Memo field contains filler text.',
          severity: 2,
          conditions: [
            { field: 'description', operator: 'equals', value: 'None' },
          ],
        },
        nextSnapshot: {
          name: 'Bypassed Description',
          description: 'Users entering filler text to bypass a required field.',
          severity: 3,
          conditions: [
            { field: 'description', operator: 'equals', value: 'None' },
            { field: 'description', operator: 'equals', value: '.' },
          ],
        },
      },
      {
        version: 3,
        editedAt: '2026-05-08T16:30:00Z',
        editedById: 'priya-patel',
        scope: 'with-historical',
        historicalPeriods: ['2024-01', '2024-02', '2024-03'],
        prevSnapshot: {
          name: 'Bypassed Description',
          description: 'Users entering filler text to bypass a required field.',
          severity: 3,
          conditions: [
            { field: 'description', operator: 'equals', value: 'None' },
            { field: 'description', operator: 'equals', value: '.' },
          ],
        },
        nextSnapshot: {
          name: 'Bypassed Description',
          description: 'Users entering filler text (e.g. "None" or ".") to bypass a required field.',
          severity: 3,
          conditions: [
            { field: 'description', operator: 'equals', value: 'None' },
            { field: 'description', operator: 'equals', value: '.' },
            { field: 'description', operator: 'is-blank', value: '' },
          ],
        },
      },
    ],
  },

  {
    id: 'rule-location-blank',
    name: 'Location is Blank',
    description: 'Transaction missing the geographical entity tag.',
    status: 'active',
    severity: 30,
    conditions: [
      {
        id: 'c1',
        field: 'location',
        operator: 'is-blank',
        value: '',
        label: 'Location field is blank',
        expectedText: 'A valid location tag',
      },
    ],
    createdById: 'samantha-sheldon',
    createdAt: '2026-04-29T09:00:00Z',
    lastEditedById: 'samantha-sheldon',
    lastEditedAt: '2026-04-29T09:00:00Z',
  },

  {
    id: 'rule-different-year',
    name: 'Different Year',
    description: 'Transaction posted to a date outside of the current year.',
    status: 'active',
    severity: 65,
    conditions: [
      {
        id: 'c1',
        field: 'date',
        operator: 'notEquals',
        value: 2026,
        label: 'Transaction date is outside the current year (2026)',
        expectedText: 'Year 2026',
      },
    ],
    createdById: 'samantha-sheldon',
    createdAt: '2026-04-29T09:00:00Z',
    lastEditedById: 'emily-chen',
    lastEditedAt: '2026-05-07T11:00:00Z',
    version: 2,
    versionHistory: [
      {
        version: 2,
        editedAt: '2026-05-07T11:00:00Z',
        editedById: 'emily-chen',
        scope: 'current-and-future',
        prevSnapshot: {
          name: 'Different Year',
          description: 'Transaction posted to a date outside of the current year.',
          severity: 4,
          conditions: [
            { field: 'date', operator: 'notEquals', value: '2025' },
          ],
        },
        nextSnapshot: {
          name: 'Different Year',
          description: 'Transaction posted to a date outside of the current year.',
          severity: 4,
          conditions: [
            { field: 'date', operator: 'notEquals', value: '2026' },
          ],
        },
      },
    ],
  },

  {
    id: 'rule-negative-invoice',
    name: 'Negative Amount on Invoice',
    description: 'An invoice with a negative total (should likely be a Credit Memo).',
    status: 'active',
    severity: 55,
    conditions: [
      {
        id: 'c1',
        field: 'type',
        operator: 'equals',
        value: 'Invoice',
        label: 'Transaction type is Invoice',
        expectedText: 'Invoice',
      },
      {
        id: 'c2',
        field: 'amount',
        operator: 'lessThan',
        value: 0,
        label: 'Amount is negative',
        expectedText: '≥ $0.00',
      },
    ],
    createdById: 'samantha-sheldon',
    createdAt: '2026-04-29T09:00:00Z',
    lastEditedById: 'marcus-rodriguez',
    lastEditedAt: '2026-05-10T12:00:00Z',
    version: 4,
    versionHistory: [
      {
        version: 2,
        editedAt: '2026-05-02T09:00:00Z',
        editedById: 'samantha-sheldon',
        scope: 'current-and-future',
        prevSnapshot: {
          name: 'Negative Amount on Invoice',
          description: 'An invoice with a negative total.',
          severity: 3,
          conditions: [
            { field: 'type', operator: 'equals', value: 'Invoice' },
          ],
        },
        nextSnapshot: {
          name: 'Negative Amount on Invoice',
          description: 'An invoice with a negative total.',
          severity: 3,
          conditions: [
            { field: 'type', operator: 'equals', value: 'Invoice' },
            { field: 'amount', operator: 'lessThan', value: '0' },
          ],
        },
      },
      {
        version: 3,
        editedAt: '2026-05-05T15:00:00Z',
        editedById: 'samantha-sheldon',
        scope: 'with-historical',
        historicalPeriods: ['2024-09', '2024-10', '2024-11', '2024-12'],
        prevSnapshot: {
          name: 'Negative Amount on Invoice',
          description: 'An invoice with a negative total.',
          severity: 3,
          conditions: [
            { field: 'type', operator: 'equals', value: 'Invoice' },
            { field: 'amount', operator: 'lessThan', value: '0' },
          ],
        },
        nextSnapshot: {
          name: 'Negative Amount on Invoice',
          description: 'An invoice with a negative total (should likely be a Credit Memo).',
          severity: 4,
          conditions: [
            { field: 'type', operator: 'equals', value: 'Invoice' },
            { field: 'amount', operator: 'lessThan', value: '0' },
          ],
        },
      },
      {
        version: 4,
        editedAt: '2026-05-10T12:00:00Z',
        editedById: 'marcus-rodriguez',
        scope: 'with-historical',
        historicalPeriods: ['2024-03', '2024-04'],
        prevSnapshot: {
          name: 'Negative Amount on Invoice',
          description: 'An invoice with a negative total (should likely be a Credit Memo).',
          severity: 4,
          conditions: [
            { field: 'type', operator: 'equals', value: 'Invoice' },
            { field: 'amount', operator: 'lessThan', value: '0' },
          ],
        },
        nextSnapshot: {
          name: 'Negative Amount on Invoice',
          description: 'An invoice with a negative total (should likely be a Credit Memo).',
          severity: 3,
          conditions: [
            { field: 'type', operator: 'equals', value: 'Invoice' },
            { field: 'amount', operator: 'lessThan', value: '0' },
          ],
        },
      },
    ],
  },

  {
    id: 'rule-zero-dollar',
    name: 'Zero-Dollar Transaction',
    description: 'A line item with an amount of $0.00.',
    // Deactivated example — surfaces the inactive Status tag in the
    // Rules table so the design covers both active and deactivated
    // visual states.
    status: 'inactive',
    severity: 35,
    conditions: [
      {
        id: 'c1',
        field: 'amount',
        operator: 'equals',
        value: 0,
        label: 'Amount is $0.00',
        expectedText: 'Non-zero amount',
      },
    ],
    createdById: 'samantha-sheldon',
    createdAt: '2026-04-29T09:00:00Z',
    lastEditedById: 'samantha-sheldon',
    lastEditedAt: '2026-04-29T09:00:00Z',
    deactivatedAt: '2026-05-15T09:00:00Z',
  },

  {
    id: 'rule-prepaid-under-threshold',
    name: 'Prepaid Under Threshold',
    description: 'An item coded to "Prepaid Expenses" that is below the capitalization limit ($2,500).',
    status: 'active',
    severity: 45,
    conditions: [
      {
        id: 'c1',
        field: 'account',
        operator: 'matches',
        value: 'Prepaid',
        label: 'Account contains "Prepaid"',
        expectedText: 'Account outside Prepaid Expenses',
      },
      {
        id: 'c2',
        field: 'amount',
        operator: 'lessThan',
        value: 2500,
        label: 'Amount is below capitalization limit',
        expectedText: '≥ $2,500',
      },
    ],
    createdById: 'samantha-sheldon',
    createdAt: '2026-04-29T09:00:00Z',
    lastEditedById: 'samantha-sheldon',
    lastEditedAt: '2026-05-09T10:30:00Z',
    version: 3,
    versionHistory: [
      {
        version: 2,
        editedAt: '2026-05-04T14:00:00Z',
        editedById: 'david-park',
        scope: 'with-historical',
        historicalPeriods: ['2025-06', '2025-07'],
        prevSnapshot: {
          name: 'Prepaid Under Threshold',
          description: 'Prepaid item below the capitalization threshold ($1,000).',
          severity: 2,
          conditions: [
            { field: 'amount', operator: 'lessThan', value: '1000' },
          ],
        },
        nextSnapshot: {
          name: 'Prepaid Under Threshold',
          description: 'Prepaid item below the capitalization threshold ($2,500).',
          severity: 3,
          conditions: [
            { field: 'amount', operator: 'lessThan', value: '2500' },
          ],
        },
      },
      {
        version: 3,
        editedAt: '2026-05-09T10:30:00Z',
        editedById: 'samantha-sheldon',
        scope: 'current-and-future',
        prevSnapshot: {
          name: 'Prepaid Under Threshold',
          description: 'Prepaid item below the capitalization threshold ($2,500).',
          severity: 3,
          conditions: [
            { field: 'amount', operator: 'lessThan', value: '2500' },
          ],
        },
        nextSnapshot: {
          name: 'Prepaid Under Threshold',
          description: 'An item coded to "Prepaid Expenses" that is below the capitalization limit ($2,500).',
          severity: 3,
          conditions: [
            { field: 'amount', operator: 'lessThan', value: '2500' },
          ],
        },
      },
    ],
  },

  {
    id: 'rule-unusual-memo',
    name: 'Unusual Memo Sentiment',
    description: 'A memo containing keywords like "Urgent," "Per CEO," or "Temporary."',
    status: 'active',
    severity: 42,
    conditions: [
      {
        id: 'c1',
        field: 'memo',
        operator: 'matches',
        value: 'Urgent',
        label: 'Memo contains "Urgent"',
        expectedText: 'Standard descriptive memo',
      },
      {
        id: 'c2',
        field: 'memo',
        operator: 'matches',
        value: 'CEO',
        label: 'Memo contains "CEO"',
        expectedText: 'Standard descriptive memo',
      },
      {
        id: 'c3',
        field: 'memo',
        operator: 'matches',
        value: 'Temp',
        label: 'Memo contains "Temp"',
        expectedText: 'Standard descriptive memo',
      },
    ],
    createdById: 'samantha-sheldon',
    createdAt: '2026-04-29T09:00:00Z',
    lastEditedById: 'priya-patel',
    lastEditedAt: '2026-05-06T13:45:00Z',
    version: 2,
    versionHistory: [
      {
        version: 2,
        editedAt: '2026-05-06T13:45:00Z',
        editedById: 'priya-patel',
        scope: 'current-and-future',
        prevSnapshot: {
          name: 'Unusual Memo Sentiment',
          description: 'A memo containing the keyword "Urgent."',
          severity: 2,
          conditions: [
            { field: 'memo', operator: 'matches', value: 'Urgent' },
          ],
        },
        nextSnapshot: {
          name: 'Unusual Memo Sentiment',
          description: 'A memo containing keywords like "Urgent," "Per CEO," or "Temporary."',
          severity: 3,
          conditions: [
            { field: 'memo', operator: 'matches', value: 'Urgent' },
            { field: 'memo', operator: 'matches', value: 'CEO' },
            { field: 'memo', operator: 'matches', value: 'Temp' },
          ],
        },
      },
    ],
  },

  {
    id: 'rule-reversal-outside-window',
    name: 'Reversal Outside Window',
    description: 'An accrual from 2 months ago that is just now being reversed.',
    // Deactivated example — second inactive rule on the Rules table
    // so multiple deactivated rows render and the visual pattern is
    // clear at a glance.
    status: 'inactive',
    severity: 62,
    deactivatedAt: '2026-05-12T11:00:00Z',
    conditions: [
      {
        id: 'c1',
        field: 'type',
        operator: 'equals',
        value: 'Reversal',
        label: 'Transaction type is a reversal',
        expectedText: 'Reversal',
      },
      {
        id: 'c2',
        field: 'amount',
        operator: 'greaterThan',
        value: 60,
        label: 'Original accrual is more than 60 days old',
        expectedText: '≤ 60 days since original accrual',
      },
    ],
    createdById: 'samantha-sheldon',
    createdAt: '2026-04-29T09:00:00Z',
    lastEditedById: 'priya-patel',
    lastEditedAt: '2026-05-11T14:15:00Z',
    version: 5,
    versionHistory: [
      {
        version: 2,
        editedAt: '2026-04-30T10:00:00Z',
        editedById: 'samantha-sheldon',
        scope: 'current-and-future',
        prevSnapshot: {
          name: 'Reversal Outside Window',
          description: 'An accrual that is outside the standard reversal window.',
          severity: 3,
          conditions: [
            { field: 'type', operator: 'equals', value: 'Reversal' },
            { field: 'amount', operator: 'greaterThan', value: '90' },
          ],
        },
        nextSnapshot: {
          name: 'Reversal Outside Window',
          description: 'An accrual that is outside the standard reversal window.',
          severity: 3,
          conditions: [
            { field: 'type', operator: 'equals', value: 'Reversal' },
            { field: 'amount', operator: 'greaterThan', value: '75' },
          ],
        },
      },
      {
        version: 3,
        editedAt: '2026-05-02T11:30:00Z',
        editedById: 'samantha-sheldon',
        scope: 'current-and-future',
        prevSnapshot: {
          name: 'Reversal Outside Window',
          description: 'An accrual that is outside the standard reversal window.',
          severity: 3,
          conditions: [
            { field: 'type', operator: 'equals', value: 'Reversal' },
            { field: 'amount', operator: 'greaterThan', value: '75' },
          ],
        },
        nextSnapshot: {
          name: 'Reversal Outside Window',
          description: 'An accrual that is outside the standard reversal window.',
          severity: 3,
          conditions: [
            { field: 'type', operator: 'equals', value: 'Reversal' },
            { field: 'amount', operator: 'greaterThan', value: '60' },
          ],
        },
      },
      {
        version: 4,
        editedAt: '2026-05-06T09:45:00Z',
        editedById: 'marcus-rodriguez',
        scope: 'with-historical',
        historicalPeriods: ['2025-01', '2025-02'],
        prevSnapshot: {
          name: 'Reversal Outside Window',
          description: 'An accrual that is outside the standard reversal window.',
          severity: 3,
          conditions: [
            { field: 'type', operator: 'equals', value: 'Reversal' },
            { field: 'amount', operator: 'greaterThan', value: '60' },
          ],
        },
        nextSnapshot: {
          name: 'Reversal Outside Window',
          description: 'An accrual from 2 months ago that is being reversed late.',
          severity: 4,
          conditions: [
            { field: 'type', operator: 'equals', value: 'Reversal' },
            { field: 'amount', operator: 'greaterThan', value: '60' },
          ],
        },
      },
      {
        version: 5,
        editedAt: '2026-05-11T14:15:00Z',
        editedById: 'priya-patel',
        scope: 'with-historical',
        historicalPeriods: ['2024-02', '2024-03', '2024-04'],
        prevSnapshot: {
          name: 'Reversal Outside Window',
          description: 'An accrual from 2 months ago that is being reversed late.',
          severity: 4,
          conditions: [
            { field: 'type', operator: 'equals', value: 'Reversal' },
            { field: 'amount', operator: 'greaterThan', value: '60' },
          ],
        },
        nextSnapshot: {
          name: 'Reversal Outside Window',
          description: 'An accrual from 2 months ago that is just now being reversed.',
          severity: 4,
          conditions: [
            { field: 'type', operator: 'equals', value: 'Reversal' },
            { field: 'amount', operator: 'greaterThan', value: '60' },
          ],
        },
      },
    ],
  },

  {
    id: 'rule-one-time-vendor-high-value',
    name: 'One-Time Vendor High Value',
    description: 'A $100,000 payment to a vendor tagged as "Misc" or "One-Time."',
    status: 'active',
    severity: 75,
    conditions: [
      {
        id: 'c1',
        field: 'amount',
        operator: 'equals',
        value: 100000,
        label: 'Amount is $100,000',
        expectedText: '$100,000',
      },
      {
        id: 'c2',
        field: 'description',
        operator: 'matches',
        value: 'Misc',
        label: 'Description contains "Misc"',
        expectedText: 'Identified vendor name',
      },
      {
        id: 'c3',
        field: 'description',
        operator: 'matches',
        value: 'One Time',
        label: 'Description contains "One Time"',
        expectedText: 'Identified vendor name',
      },
      {
        id: 'c4',
        field: 'description',
        operator: 'matches',
        value: 'One-Time',
        label: 'Description contains "One-Time"',
        expectedText: 'Identified vendor name',
      },
    ],
    createdById: 'samantha-sheldon',
    createdAt: '2026-04-29T09:00:00Z',
    lastEditedById: 'emily-chen',
    lastEditedAt: '2026-05-05T16:00:00Z',
    version: 2,
    versionHistory: [
      {
        version: 2,
        editedAt: '2026-05-05T16:00:00Z',
        editedById: 'emily-chen',
        scope: 'with-historical',
        historicalPeriods: ['2025-11', '2025-12'],
        prevSnapshot: {
          name: 'One-Time Vendor High Value',
          description: 'A $50,000 payment to a vendor tagged as "Misc."',
          severity: 3,
          conditions: [
            { field: 'amount', operator: 'equals', value: '50000' },
            { field: 'description', operator: 'matches', value: 'Misc' },
          ],
        },
        nextSnapshot: {
          name: 'One-Time Vendor High Value',
          description: 'A $100,000 payment to a vendor tagged as "Misc" or "One-Time."',
          severity: 4,
          conditions: [
            { field: 'amount', operator: 'equals', value: '100000' },
            { field: 'description', operator: 'matches', value: 'Misc' },
            { field: 'description', operator: 'matches', value: 'One Time' },
            { field: 'description', operator: 'matches', value: 'One-Time' },
          ],
        },
      },
    ],
  },

  {
    id: 'rule-dept-account-conflict',
    name: 'Department/Account Conflict',
    description: 'A "Marketing" expense posted to a "Legal" department.',
    status: 'active',
    severity: 58,
    conditions: [
      {
        id: 'c1',
        field: 'account',
        operator: 'matches',
        value: 'Legal',
        label: 'Account contains "Legal"',
        expectedText: 'Account consistent with department',
      },
      {
        id: 'c2',
        field: 'department',
        operator: 'equals',
        value: 'Marketing',
        label: 'Department is Marketing',
        expectedText: 'Department consistent with account',
      },
    ],
    createdById: 'samantha-sheldon',
    createdAt: '2026-04-29T09:00:00Z',
    lastEditedById: 'samantha-sheldon',
    lastEditedAt: '2026-04-29T09:00:00Z',
  },

];

export function getRule(id: string): Rule | undefined {
  return rules.find((r) => r.id === id);
}

export function activeRules(): Rule[] {
  return rules.filter((r) => r.status === 'active');
}
