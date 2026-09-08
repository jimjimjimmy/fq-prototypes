export interface FieldError {
  field: 'classification' | 'reasonCode' | 'plImpact';
  message: string;
  suggestion: string;
}

export interface ReconcilingItem {
  id: number;
  accountNumber: string;
  accountName: string;
  date: string;
  description: string;
  amount: number;
  classification: string | null;
  reasonCode: string | null;
  plImpact: string | null;
  status: 'Valid' | 'Needs Correction' | 'Not classified';
  ageCurrent: number;
  age1to30: number;
  age31to60: number;
  age61to90: number;
  age91to120: number;
  age120plus: number;
  ageUnidentified: number;
  errors?: FieldError[];
}

export const MOCK_RECONCILING_ITEMS: ReconcilingItem[] = [
  // 10-10000 Wells Fargo
  { id: 9,  accountNumber: '10-10000', accountName: 'Wells Fargo',           date: '3/15/2025', description: 'Bank fee - wire transfer',                   amount:   350.00, classification: 'Bank Charge',       reasonCode: 'Bank Fee',           plImpact: 'B/S Only',   status: 'Valid',            ageCurrent: 350.00,   age1to30: 0,      age31to60: 0,      age61to90: 0,      age91to120: 0,    age120plus: 0,    ageUnidentified: 0 },
  { id: 10, accountNumber: '10-10000', accountName: 'Wells Fargo',           date: '3/12/2025', description: 'Outstanding check #8823 - utilities',        amount:  2200.00, classification: 'Timing',            reasonCode: 'Outstanding Check',  plImpact: 'B/S Only',   status: 'Valid',            ageCurrent: 2200.00,  age1to30: 0,      age31to60: 0,      age61to90: 0,      age91to120: 0,    age120plus: 0,    ageUnidentified: 0 },
  { id: 11, accountNumber: '10-10000', accountName: 'Wells Fargo',           date: '3/10/2025', description: 'Deposit in transit - customer payment',      amount:  8400.00, classification: null,                reasonCode: null,                  plImpact: null,         status: 'Needs Correction', ageCurrent: 0,        age1to30: 8400.00, age31to60: 0,      age61to90: 0,      age91to120: 0,    age120plus: 0,    ageUnidentified: 0, errors: [{ field: 'classification', message: 'Missing required field', suggestion: 'Deposit in Transit' }] },

  // 10-10010 Cash
  { id: 1, accountNumber: '10-10010', accountName: 'Cash',                 date: '3/14/2025', description: 'Outstanding check #4521 - vendor payment',  amount: 10000.00, classification: 'Known Difference',  reasonCode: 'Outstanding Check',  plImpact: 'B/S Only',   status: 'Valid',            ageCurrent: 10000.00, age1to30: 0,      age31to60: 0,      age61to90: 0,      age91to120: 0,    age120plus: 0,    ageUnidentified: 0 },
  { id: 2, accountNumber: '10-10010', accountName: 'Cash',                 date: '3/14/2025', description: 'Pending ACH deposit from client',             amount:  5000.00, classification: 'Timing',            reasonCode: 'Outstanding Chk',    plImpact: null,         status: 'Needs Correction', ageCurrent: 0,        age1to30: 5000.00, age31to60: 0,      age61to90: 0,      age91to120: 0,    age120plus: 0,    ageUnidentified: 0, errors: [{ field: 'reasonCode', message: 'Typo in field name', suggestion: 'Outstanding Check' }] },
  { id: 3, accountNumber: '10-10010', accountName: 'Cash',                 date: '3/14/2025', description: 'Month-end accrual reversal',                  amount: 20000.00, classification: null,                reasonCode: 'Unposted JE',        plImpact: 'P&L Impact', status: 'Needs Correction', ageCurrent: 0,        age1to30: 0,       age31to60: 20000.00, age61to90: 0,    age91to120: 0,    age120plus: 0,    ageUnidentified: 0, errors: [{ field: 'classification', message: 'Missing required field', suggestion: 'Known Difference' }] },

  // 20-40100 Accounts Receivable
  { id: 4, accountNumber: '20-40100', accountName: 'Accounts Receivable',  date: '3/10/2025', description: 'Wire transfer pending clearance',             amount:  3500.00, classification: 'Timing',            reasonCode: 'Deposit in Transit', plImpact: 'B/S Only',   status: 'Valid',            ageCurrent: 3500.00,  age1to30: 0,      age31to60: 0,      age61to90: 0,      age91to120: 0,    age120plus: 0,    ageUnidentified: 0 },
  { id: 5, accountNumber: '20-40100', accountName: 'Accounts Receivable',  date: '3/05/2025', description: 'Intercompany settlement - Q1',                amount:  7200.00, classification: 'Known Difference',  reasonCode: 'Unposted JE',        plImpact: 'P&L Impact', status: 'Valid',            ageCurrent: 0,        age1to30: 7200.00, age31to60: 0,      age61to90: 0,      age91to120: 0,    age120plus: 0,    ageUnidentified: 0 },

  // 30-70200 Prepaid Expenses
  { id: 6, accountNumber: '30-70200', accountName: 'Prepaid Expenses',     date: '2/28/2025', description: 'Prepaid insurance - annual premium split',   amount:  1800.00, classification: 'Known Difference',  reasonCode: 'Immaterial Variance', plImpact: 'P&L Impact', status: 'Valid',           ageCurrent: 0,        age1to30: 1800.00, age31to60: 0,      age61to90: 0,      age91to120: 0,    age120plus: 0,    ageUnidentified: 0 },

  // 40-80500 Accrued Liabilities
  { id: 7, accountNumber: '40-80500', accountName: 'Accrued Liabilities',  date: '12/01/2024', description: 'Accrued payroll - December run',            amount: 12500.00, classification: null,                reasonCode: null,                  plImpact: null,         status: 'Not classified',   ageCurrent: 0,        age1to30: 0,       age31to60: 0,      age61to90: 0,      age91to120: 12500.00, age120plus: 0, ageUnidentified: 0 },
  { id: 8, accountNumber: '40-80500', accountName: 'Accrued Liabilities',  date: '12/10/2024', description: 'Vendor invoice pending approval',           amount:  4750.00, classification: null,                reasonCode: null,                  plImpact: null,         status: 'Not classified',   ageCurrent: 0,        age1to30: 0,       age31to60: 0,      age61to90: 0,      age91to120: 0,    age120plus: 0,    ageUnidentified: 4750.00 },
];

export const ACCOUNTS = [...new Set(MOCK_RECONCILING_ITEMS.map(r => r.accountNumber))].map(num => ({
  number: num,
  name: MOCK_RECONCILING_ITEMS.find(r => r.accountNumber === num)!.accountName,
}));
