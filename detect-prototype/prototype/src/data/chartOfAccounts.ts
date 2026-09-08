import type { GLAccount } from './types';

/**
 * Parallax Labs chart of accounts (~50 accounts).
 *
 * Structure follows mid-market SaaS convention:
 *   1xxx Assets
 *   2xxx Liabilities
 *   3xxx Equity
 *   4xxx Revenue
 *   5xxx COGS
 *   6xxx Operating Expenses
 *
 * Parent accounts (1000, 1500, 6000, etc.) exist for reporting roll-ups;
 * child accounts are where transactions actually post.
 */
export const chartOfAccounts: GLAccount[] = [
  // ----- ASSETS -----
  { code: '1000', name: 'Cash & Cash Equivalents', type: 'asset', normalBalance: 'debit' },
  { code: '1010', name: 'Cash - Operating (JPMorgan)', type: 'asset', parentCode: '1000', normalBalance: 'debit' },
  { code: '1020', name: 'Cash - Payroll (JPMorgan)', type: 'asset', parentCode: '1000', normalBalance: 'debit' },
  { code: '1030', name: 'Cash - UK (HSBC)', type: 'asset', parentCode: '1000', normalBalance: 'debit' },
  { code: '1040', name: 'Cash - Canada (RBC)', type: 'asset', parentCode: '1000', normalBalance: 'debit' },
  { code: '1100', name: 'Accounts Receivable', type: 'asset', normalBalance: 'debit' },
  { code: '1200', name: 'Prepaid Expenses', type: 'asset', normalBalance: 'debit' },
  { code: '1210', name: 'Prepaid Software', type: 'asset', parentCode: '1200', normalBalance: 'debit' },
  { code: '1220', name: 'Prepaid Insurance', type: 'asset', parentCode: '1200', normalBalance: 'debit' },
  { code: '1500', name: 'Fixed Assets', type: 'asset', normalBalance: 'debit' },
  { code: '1510', name: 'Computer Equipment', type: 'asset', parentCode: '1500', normalBalance: 'debit' },
  { code: '1520', name: 'Furniture & Fixtures', type: 'asset', parentCode: '1500', normalBalance: 'debit' },
  { code: '1590', name: 'Accumulated Depreciation', type: 'asset', parentCode: '1500', normalBalance: 'credit' },

  // ----- LIABILITIES -----
  { code: '2000', name: 'Accounts Payable', type: 'liability', normalBalance: 'credit' },
  { code: '2100', name: 'Accrued Expenses', type: 'liability', normalBalance: 'credit' },
  { code: '2110', name: 'Accrued Payroll', type: 'liability', parentCode: '2100', normalBalance: 'credit' },
  { code: '2120', name: 'Accrued Bonus', type: 'liability', parentCode: '2100', normalBalance: 'credit' },
  { code: '2200', name: 'Deferred Revenue (Short-term)', type: 'liability', normalBalance: 'credit' },
  { code: '2210', name: 'Deferred Revenue (Long-term)', type: 'liability', normalBalance: 'credit' },
  { code: '2300', name: 'Accrued Taxes', type: 'liability', normalBalance: 'credit' },
  { code: '2400', name: 'Credit Card Liability', type: 'liability', normalBalance: 'credit' },

  // ----- EQUITY -----
  { code: '3010', name: 'Common Stock', type: 'equity', normalBalance: 'credit' },
  { code: '3020', name: 'Additional Paid-in Capital', type: 'equity', normalBalance: 'credit' },
  { code: '3030', name: 'Retained Earnings', type: 'equity', normalBalance: 'credit' },

  // ----- REVENUE -----
  { code: '4010', name: 'Subscription Revenue - Platform', type: 'revenue', normalBalance: 'credit' },
  { code: '4020', name: 'Subscription Revenue - AI Add-on', type: 'revenue', normalBalance: 'credit' },
  { code: '4030', name: 'Professional Services Revenue', type: 'revenue', normalBalance: 'credit' },
  { code: '4040', name: 'Other Revenue', type: 'revenue', normalBalance: 'credit' },

  // ----- COGS -----
  { code: '5010', name: 'Hosting Costs (AWS)', type: 'cogs', normalBalance: 'debit' },
  { code: '5020', name: 'Third-Party Data Licenses', type: 'cogs', normalBalance: 'debit' },
  { code: '5030', name: 'Customer Support Personnel', type: 'cogs', normalBalance: 'debit' },
  { code: '5040', name: 'Professional Services Delivery', type: 'cogs', normalBalance: 'debit' },
  { code: '5050', name: 'Payment Processing Fees', type: 'cogs', normalBalance: 'debit' },

  // ----- OPERATING EXPENSES -----
  { code: '6010', name: 'Salaries & Wages', type: 'opex', normalBalance: 'debit' },
  { code: '6020', name: 'Payroll Taxes', type: 'opex', normalBalance: 'debit' },
  { code: '6030', name: 'Benefits', type: 'opex', normalBalance: 'debit' },
  { code: '6040', name: 'Contractors & Consultants', type: 'opex', normalBalance: 'debit' },
  { code: '6050', name: 'Recruiting Fees', type: 'opex', normalBalance: 'debit' },
  { code: '6100', name: 'Software & Subscriptions', type: 'opex', normalBalance: 'debit' },
  { code: '6110', name: 'Development Tools', type: 'opex', parentCode: '6100', normalBalance: 'debit' },
  { code: '6120', name: 'Security & Identity', type: 'opex', parentCode: '6100', normalBalance: 'debit' },
  { code: '6130', name: 'Sales & Marketing Tools', type: 'opex', parentCode: '6100', normalBalance: 'debit' },
  { code: '6200', name: 'Marketing - Advertising', type: 'opex', normalBalance: 'debit' },
  { code: '6210', name: 'Marketing - Events & Conferences', type: 'opex', normalBalance: 'debit' },
  { code: '6220', name: 'Marketing - Content', type: 'opex', normalBalance: 'debit' },
  { code: '6300', name: 'Office Rent', type: 'opex', normalBalance: 'debit' },
  { code: '6310', name: 'Office Supplies', type: 'opex', normalBalance: 'debit' },
  { code: '6320', name: 'Utilities & Internet', type: 'opex', normalBalance: 'debit' },
  { code: '6400', name: 'Travel - Airfare', type: 'opex', normalBalance: 'debit' },
  { code: '6410', name: 'Travel - Hotels', type: 'opex', normalBalance: 'debit' },
  { code: '6420', name: 'Travel - Meals', type: 'opex', normalBalance: 'debit' },
  { code: '6430', name: 'Travel - Ground Transport', type: 'opex', normalBalance: 'debit' },
  { code: '6500', name: 'Legal Fees', type: 'opex', normalBalance: 'debit' },
  { code: '6510', name: 'Accounting & Audit Fees', type: 'opex', normalBalance: 'debit' },
  { code: '6520', name: 'Tax Preparation', type: 'opex', normalBalance: 'debit' },
  { code: '6600', name: 'Insurance - General Liability', type: 'opex', normalBalance: 'debit' },
  { code: '6610', name: 'Insurance - D&O', type: 'opex', normalBalance: 'debit' },
  { code: '6700', name: 'Depreciation Expense', type: 'opex', normalBalance: 'debit' },
  { code: '6900', name: 'Other Operating Expenses', type: 'opex', normalBalance: 'debit' },
];

export function getAccount(code: string): GLAccount | undefined {
  return chartOfAccounts.find((a) => a.code === code);
}

/**
 * Display helper: "6100 - Software & Subscriptions"
 */
export function formatAccount(code: string): string {
  const account = getAccount(code);
  return account ? `${account.code} - ${account.name}` : code;
}
