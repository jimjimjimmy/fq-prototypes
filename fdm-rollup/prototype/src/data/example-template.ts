import type { RollupNode } from '../types'

// Curated example template — clean L1→L5 financial statement hierarchy.
// Used by EmptyState "Start from an example" and the AI / Excel stub flows.
export const exampleTemplate: RollupNode[] = [
  {
    id: 'tpl-balance-sheet',
    name: 'Balance Sheet',
    level: 1,
    children: [
      {
        id: 'tpl-assets',
        name: 'Assets',
        level: 2,
        children: [
          {
            id: 'tpl-current-assets',
            name: 'Current Assets',
            level: 3,
            children: [
              {
                id: 'tpl-cash',
                name: 'Cash and Cash Equivalents',
                level: 4,
                children: [
                  { id: 'tpl-cash-operating', name: 'Operating Cash', level: 5 },
                  { id: 'tpl-cash-restricted-st', name: 'Restricted Cash, Short-Term', level: 5 },
                ],
              },
              {
                id: 'tpl-ar',
                name: 'Accounts Receivable, Net',
                level: 4,
                children: [
                  { id: 'tpl-ar-trade', name: 'Trade Accounts Receivable', level: 5 },
                  { id: 'tpl-ar-unbilled', name: 'Unbilled Revenue', level: 5 },
                  { id: 'tpl-ar-allowance', name: 'Allowance for Bad Debts', level: 5 },
                ],
              },
              {
                id: 'tpl-prepaid',
                name: 'Prepaid Expenses and Other Current Assets',
                level: 4,
                children: [
                  { id: 'tpl-prepaid-software', name: 'Prepaid Software Licenses', level: 5 },
                  { id: 'tpl-prepaid-insurance', name: 'Prepaid Insurance', level: 5 },
                  { id: 'tpl-prepaid-other', name: 'Other Current Assets', level: 5 },
                ],
              },
              { id: 'tpl-def-comm-current', name: 'Deferred Commissions, Current', level: 4 },
            ],
          },
          {
            id: 'tpl-noncurrent-assets',
            name: 'Non-Current Assets',
            level: 3,
            children: [
              {
                id: 'tpl-ppe',
                name: 'Property and Equipment, Net',
                level: 4,
                children: [
                  { id: 'tpl-ppe-computer', name: 'Computer Equipment', level: 5 },
                  { id: 'tpl-ppe-furniture', name: 'Furniture and Fixtures', level: 5 },
                  { id: 'tpl-ppe-leasehold', name: 'Leasehold Improvements', level: 5 },
                  { id: 'tpl-ppe-depreciation', name: 'Accumulated Depreciation', level: 5 },
                ],
              },
              {
                id: 'tpl-intangibles',
                name: 'Intangible Assets, Net',
                level: 4,
                children: [
                  { id: 'tpl-intangibles-tech', name: 'Developed Technology', level: 5 },
                  { id: 'tpl-intangibles-cr', name: 'Customer Relationships', level: 5 },
                  { id: 'tpl-intangibles-tm', name: 'Trademarks', level: 5 },
                  { id: 'tpl-intangibles-amort', name: 'Accumulated Amortization', level: 5 },
                ],
              },
              { id: 'tpl-goodwill', name: 'Goodwill', level: 4 },
              {
                id: 'tpl-rou',
                name: 'Right-of-Use Assets, Net',
                level: 4,
                children: [
                  { id: 'tpl-rou-finance', name: 'Finance Lease ROU Assets', level: 5 },
                  { id: 'tpl-rou-operating', name: 'Operating Lease ROU Assets', level: 5 },
                ],
              },
              { id: 'tpl-def-comm-lt', name: 'Deferred Commissions, Non-Current', level: 4 },
              { id: 'tpl-other-lt-assets', name: 'Other Non-Current Assets', level: 4 },
            ],
          },
        ],
      },
      {
        id: 'tpl-liabilities',
        name: 'Liabilities',
        level: 2,
        children: [
          {
            id: 'tpl-current-liabilities',
            name: 'Current Liabilities',
            level: 3,
            children: [
              { id: 'tpl-ap', name: 'Accounts Payable', level: 4 },
              {
                id: 'tpl-accrued',
                name: 'Accrued Expenses',
                level: 4,
                children: [
                  { id: 'tpl-accrued-payroll', name: 'Accrued Payroll', level: 5 },
                  { id: 'tpl-accrued-bonus', name: 'Accrued Bonus', level: 5 },
                  { id: 'tpl-accrued-commissions', name: 'Accrued Commissions', level: 5 },
                  { id: 'tpl-accrued-professional', name: 'Accrued Professional Fees', level: 5 },
                ],
              },
              {
                id: 'tpl-def-rev-current',
                name: 'Deferred Revenue, Current',
                level: 4,
                children: [
                  { id: 'tpl-def-rev-sub', name: 'Subscription Deferred Revenue', level: 5 },
                  { id: 'tpl-def-rev-ps', name: 'Professional Services Deferred Revenue', level: 5 },
                ],
              },
              { id: 'tpl-current-ltd', name: 'Current Portion of Long-Term Debt', level: 4 },
              { id: 'tpl-lease-current', name: 'Lease Liability, Current', level: 4 },
            ],
          },
          {
            id: 'tpl-noncurrent-liabilities',
            name: 'Non-Current Liabilities',
            level: 3,
            children: [
              {
                id: 'tpl-ltd',
                name: 'Long-Term Debt, Net',
                level: 4,
                children: [
                  { id: 'tpl-ltd-notes', name: 'Senior Secured Notes', level: 5 },
                  { id: 'tpl-ltd-issuance', name: 'Unamortized Debt Issuance Costs', level: 5 },
                ],
              },
              { id: 'tpl-def-rev-lt', name: 'Deferred Revenue, Non-Current', level: 4 },
              { id: 'tpl-lease-lt', name: 'Operating Lease Liability, Non-Current', level: 4 },
              { id: 'tpl-deferred-tax-liab', name: 'Deferred Tax Liability', level: 4 },
              { id: 'tpl-other-lt-liab', name: 'Other Long-Term Liabilities', level: 4 },
            ],
          },
        ],
      },
      {
        id: 'tpl-equity',
        name: "Stockholders' Equity",
        level: 2,
        children: [
          { id: 'tpl-equity-common', name: 'Common Stock', level: 3 },
          { id: 'tpl-equity-apic', name: 'Additional Paid-In Capital', level: 3 },
          { id: 'tpl-equity-retained', name: 'Retained Earnings', level: 3 },
          { id: 'tpl-equity-oci', name: 'Accumulated Other Comprehensive Income', level: 3 },
          { id: 'tpl-equity-treasury', name: 'Treasury Stock', level: 3 },
        ],
      },
    ],
  },
  {
    id: 'tpl-income-statement',
    name: 'Income Statement',
    level: 1,
    children: [
      {
        id: 'tpl-revenue',
        name: 'Revenue',
        level: 2,
        children: [
          {
            id: 'tpl-subscription-revenue',
            name: 'Subscription Revenue',
            level: 3,
            children: [
              {
                id: 'tpl-sub-enterprise',
                name: 'Enterprise',
                level: 4,
                children: [
                  { id: 'tpl-sub-ent-close', name: 'Close Management', level: 5 },
                  { id: 'tpl-sub-ent-recs', name: 'Reconciliation', level: 5 },
                  { id: 'tpl-sub-ent-je', name: 'Journal Entry', level: 5 },
                  { id: 'tpl-sub-ent-detect', name: 'Detect', level: 5 },
                ],
              },
              { id: 'tpl-sub-smb', name: 'SMB', level: 4 },
              { id: 'tpl-sub-intercompany', name: 'Intercompany Revenue', level: 4 },
            ],
          },
          {
            id: 'tpl-ps-revenue',
            name: 'Professional Services Revenue',
            level: 3,
            children: [
              { id: 'tpl-ps-rev-impl', name: 'Implementation Services', level: 4 },
              { id: 'tpl-ps-rev-training', name: 'Training', level: 4 },
            ],
          },
          { id: 'tpl-other-revenue', name: 'Other Revenue', level: 3 },
        ],
      },
      {
        id: 'tpl-cor',
        name: 'Cost of Revenue',
        level: 2,
        children: [
          {
            id: 'tpl-cor-subscription',
            name: 'Cost of Subscription Revenue',
            level: 3,
            children: [
              { id: 'tpl-cor-hosting', name: 'Hosting and Infrastructure', level: 4 },
              {
                id: 'tpl-cor-support',
                name: 'Support and Customer Success',
                level: 4,
                children: [
                  { id: 'tpl-cor-support-salary', name: 'Salaries and Benefits', level: 5 },
                  { id: 'tpl-cor-support-sbc', name: 'Stock-Based Compensation', level: 5 },
                ],
              },
              { id: 'tpl-cor-amort', name: 'Amortization of Acquired Technology', level: 4 },
            ],
          },
          {
            id: 'tpl-cor-ps',
            name: 'Cost of Professional Services',
            level: 3,
            children: [
              { id: 'tpl-cor-ps-delivery', name: 'Delivery Partner Costs', level: 4 },
              { id: 'tpl-cor-ps-salary', name: 'PS Salaries and Benefits', level: 4 },
            ],
          },
        ],
      },
      { id: 'tpl-gross-profit', name: 'Gross Profit', level: 2 },
      {
        id: 'tpl-opex',
        name: 'Operating Expenses',
        level: 2,
        children: [
          {
            id: 'tpl-rd',
            name: 'Research and Development',
            level: 3,
            children: [
              {
                id: 'tpl-rd-salary',
                name: 'Engineering Salaries',
                level: 4,
                children: [
                  { id: 'tpl-rd-salary-base', name: 'Base Salary', level: 5 },
                  { id: 'tpl-rd-salary-bonus', name: 'Bonus', level: 5 },
                  { id: 'tpl-rd-salary-sbc', name: 'Stock-Based Compensation', level: 5 },
                ],
              },
              { id: 'tpl-rd-cloud', name: 'Cloud Computing', level: 4 },
              { id: 'tpl-rd-software', name: 'Software and Tools', level: 4 },
            ],
          },
          {
            id: 'tpl-sm',
            name: 'Sales and Marketing',
            level: 3,
            children: [
              {
                id: 'tpl-sm-commissions',
                name: 'Sales Salaries and Commissions',
                level: 4,
                children: [
                  { id: 'tpl-sm-ae', name: 'AE Salaries', level: 5 },
                  { id: 'tpl-sm-sdr', name: 'SDR Salaries', level: 5 },
                  { id: 'tpl-sm-commission', name: 'Commission Expense', level: 5 },
                ],
              },
              { id: 'tpl-sm-demand', name: 'Demand Generation', level: 4 },
              { id: 'tpl-sm-partner', name: 'Partner Program', level: 4 },
            ],
          },
          {
            id: 'tpl-ga',
            name: 'General and Administrative',
            level: 3,
            children: [
              { id: 'tpl-ga-exec', name: 'Executive Compensation', level: 4 },
              { id: 'tpl-ga-legal', name: 'Legal Fees', level: 4 },
              { id: 'tpl-ga-audit', name: 'Audit and Accounting Fees', level: 4 },
              { id: 'tpl-ga-insurance', name: 'Insurance', level: 4 },
            ],
          },
        ],
      },
      { id: 'tpl-operating-income', name: 'Operating Income', level: 2 },
      {
        id: 'tpl-other-income',
        name: 'Other Income and Expense',
        level: 2,
        children: [
          { id: 'tpl-interest-income', name: 'Interest Income', level: 3 },
          { id: 'tpl-interest-expense', name: 'Interest Expense', level: 3 },
          { id: 'tpl-fx', name: 'Foreign Exchange Gain / Loss', level: 3 },
        ],
      },
      { id: 'tpl-ebt', name: 'Net Income Before Tax', level: 2 },
      { id: 'tpl-tax', name: 'Income Tax Provision', level: 2 },
      { id: 'tpl-net-income', name: 'Net Income', level: 2 },
    ],
  },
]
