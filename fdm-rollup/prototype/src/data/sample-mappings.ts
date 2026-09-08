import type { MappedAccount } from '../types'

// Stub mapped accounts for the prototype. These are display-only — no real
// rule logic, no persistence. Spread across many destination IDs so the
// roll-up tree shows realistic mapped counts on multiple leaves.
//
// Coverage spans the full chart of accounts: 1xxx assets, 2xxx liabilities,
// 3xxx equity, 4xxx revenue, 5xxx COGS, 6xxx operating expenses, 7xxx other
// income/expense, plus a couple of suspense/clearing accounts that are
// intentionally unassigned so the demo can show the Unassigned filter.

export const sampleMappings: MappedAccount[] = [
  // 1xxx — Assets
  { id: 'a1', number: '1000', name: 'Operating Cash - JPMorgan', destinationId: '87350ede-6ebd-42d1-8066-56c117f6707e.9868a748-d550-4107-9f43-06e21bf19a0d', costCenter: '000', department: 'Corporate', mappingMethod: 'rule', secondaryDimensionCount: 2, splitDimensions: [{ name: 'Department', value: 'Corporate' }] },
  { id: 'a2', number: '1010', name: 'Operating Cash - SVB', destinationId: '87350ede-6ebd-42d1-8066-56c117f6707e.9868a748-d550-4107-9f43-06e21bf19a0d', costCenter: '000', department: 'Corporate', mappingMethod: 'rule', secondaryDimensionCount: 1, splitDimensions: [{ name: 'Department', value: 'Engineering' }] },
  { id: 'a2b', number: '1010', name: 'Operating Cash - SVB', destinationId: '87350ede-6ebd-42d1-8066-56c117f6707e.9868a748-d550-4107-9f43-06e21bf19a0d', costCenter: '100', department: 'Finance', mappingMethod: 'rule', secondaryDimensionCount: 1, splitDimensions: [{ name: 'Department', value: 'Finance' }] },
  { id: 'a3', number: '1020', name: 'Money Market', destinationId: '87350ede-6ebd-42d1-8066-56c117f6707e.9868a748-d550-4107-9f43-06e21bf19a0d', costCenter: '000', department: 'Corporate', mappingMethod: 'rule' },
  { id: 'a4', number: '1100', name: 'Petty Cash - SF Office', destinationId: '87350ede-6ebd-42d1-8066-56c117f6707e.9868a748-d550-4107-9f43-06e21bf19a0d', costCenter: '100', department: 'Operations', mappingMethod: 'direct', isActive: false },
  { id: 'a5', number: '1200', name: 'Restricted Cash - Escrow', destinationId: '87350ede-6ebd-42d1-8066-56c117f6707e.fd4bb034-b755-4a65-98b5-009a6ad50f60', costCenter: '000', department: 'Corporate', mappingMethod: 'rule' },
  { id: 'a6', number: '1500', name: 'Long term debt - Term Loan', destinationId: '87350ede-6ebd-42d1-8066-56c117f6707e.988afae1-a305-4589-8bf0-cecc08ed8fb1', costCenter: '000', department: 'Corporate', mappingMethod: 'direct' },
  { id: 'a7', number: '1510', name: 'Long term debt - Revolver', destinationId: '87350ede-6ebd-42d1-8066-56c117f6707e.988afae1-a305-4589-8bf0-cecc08ed8fb1', costCenter: '000', department: 'Corporate', mappingMethod: 'rule', isActive: false },
  { id: 'a8', number: '1700', name: 'ROU Asset - HQ Lease', destinationId: '87350ede-6ebd-42d1-8066-56c117f6707e.87f65187-2fb2-417f-8b30-f4bb1df17581', costCenter: '100', department: 'Engineering', mappingMethod: 'rule', secondaryDimensionCount: 3, splitDimensions: [{ name: 'Department', value: 'Engineering' }] },
  { id: 'a8b', number: '1700', name: 'ROU Asset - HQ Lease', destinationId: '87350ede-6ebd-42d1-8066-56c117f6707e.87f65187-2fb2-417f-8b30-f4bb1df17581', costCenter: '110', department: 'Operations', mappingMethod: 'rule', secondaryDimensionCount: 3, splitDimensions: [{ name: 'Department', value: 'Operations' }] },
  { id: 'a8c', number: '1700', name: 'ROU Asset - HQ Lease', destinationId: '87350ede-6ebd-42d1-8066-56c117f6707e.87f65187-2fb2-417f-8b30-f4bb1df17581', costCenter: '120', department: 'Finance', mappingMethod: 'rule', secondaryDimensionCount: 3, splitDimensions: [{ name: 'Department', value: 'Finance' }] },
  { id: 'a9', number: '1710', name: 'ROU Asset - NYC Lease', destinationId: '87350ede-6ebd-42d1-8066-56c117f6707e.87f65187-2fb2-417f-8b30-f4bb1df17581', costCenter: '110', department: 'Operations', mappingMethod: 'rule' },
  { id: 'a10', number: '1800', name: 'Investments - Treasuries', destinationId: '87350ede-6ebd-42d1-8066-56c117f6707e.be0e0056-bdd6-4c22-965c-108b908a9485', costCenter: '000', department: 'Corporate', mappingMethod: 'direct' },

  // 2xxx — Liabilities
  { id: 'a13', number: '2001', name: 'Accounts Payable', destinationId: '87350ede-6ebd-42d1-8066-56c117f6707e.9c3dd20c-f25c-453f-b50b-2f3dd8a1cc29.cfe09454-cc34-43da-aa54-be451b6465f0', costCenter: '000', department: 'Corporate', mappingMethod: 'rule' },
  { id: 'a14', number: '2010', name: 'Accrued Liabilities', destinationId: '87350ede-6ebd-42d1-8066-56c117f6707e.9c3dd20c-f25c-453f-b50b-2f3dd8a1cc29.3956705a-7494-4a68-815e-4b5876416cfe', costCenter: '000', department: 'Corporate', mappingMethod: 'rule', isActive: false },
  { id: 'a15', number: '2100', name: 'Deferred Revenue - Short Term', destinationId: '87350ede-6ebd-42d1-8066-56c117f6707e.0cdcc80d-6d8a-4f97-80bf-bf62cd910f67.43f78df8-e994-49bc-91ca-409acc590f3a', costCenter: '000', department: 'Revenue', mappingMethod: 'direct' },
  { id: 'a16', number: '2200', name: 'Long Term Debt', destinationId: 'unassigned', costCenter: '000', department: 'Corporate', mappingMethod: 'unassigned' },

  // 3xxx — Equity
  { id: 'a17', number: '3001', name: 'Retained Earnings', destinationId: '87350ede-6ebd-42d1-8066-56c117f6707e.91052610-581a-4b62-9f2d-6d7da469af8f.c41eb70c-fea1-4b3d-b7c5-57c5d67823f7', costCenter: '000', department: 'Corporate', mappingMethod: 'rule' },
  { id: 'a18', number: '3100', name: 'Common Stock', destinationId: '87350ede-6ebd-42d1-8066-56c117f6707e.91052610-581a-4b62-9f2d-6d7da469af8f.42756d05-4fe1-4815-a709-0150daee8a77', costCenter: '000', department: 'Corporate', mappingMethod: 'rule' },

  // 4xxx — Revenue
  { id: 'a19', number: '4001', name: 'Subscription Revenue - Enterprise', destinationId: 'd6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.ca66a5ce-5917-4a11-908e-f164c7cc9368.3a4f6d65-26a9-421f-bdc7-63417effce2d', costCenter: '000', department: 'Revenue', mappingMethod: 'rule' },
  { id: 'a20', number: '4010', name: 'Subscription Revenue - SMB', destinationId: 'd6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.ca66a5ce-5917-4a11-908e-f164c7cc9368.3a4f6d65-26a9-421f-bdc7-63417effce2d', costCenter: '000', department: 'Revenue', mappingMethod: 'rule' },
  { id: 'a20b', number: '4020', name: 'PS Revenue - Implementation', destinationId: 'd6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.ca66a5ce-5917-4a11-908e-f164c7cc9368.a0d41348-685c-4e45-a01d-1352ee0778cd', costCenter: '000', department: 'Revenue', mappingMethod: 'rule' },
  { id: 'a20c', number: '4030', name: 'PS Revenue - Training', destinationId: 'd6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.ca66a5ce-5917-4a11-908e-f164c7cc9368.a0d41348-685c-4e45-a01d-1352ee0778cd', costCenter: '000', department: 'Revenue', mappingMethod: 'rule' },
  // 4001 split by Region — same account number, different region dimension
  { id: 'a19-amer', number: '4001', name: 'Subscription Revenue - Enterprise', destinationId: 'd6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.ca66a5ce-5917-4a11-908e-f164c7cc9368.3a4f6d65-26a9-421f-bdc7-63417effce2d', costCenter: '010', department: 'Revenue', mappingMethod: 'rule', splitDimensions: [{ name: 'Region', value: 'Americas' }] },
  { id: 'a19-emea', number: '4001', name: 'Subscription Revenue - Enterprise', destinationId: 'd6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.ca66a5ce-5917-4a11-908e-f164c7cc9368.3a4f6d65-26a9-421f-bdc7-63417effce2d', costCenter: '020', department: 'Revenue', mappingMethod: 'rule', splitDimensions: [{ name: 'Region', value: 'EMEA' }] },
  { id: 'a19-apac', number: '4001', name: 'Subscription Revenue - Enterprise', destinationId: 'd6e59fd0-a55a-4d5a-884e-437832ee2019.2c8fa019-6901-4377-933f-356b5cb8c72e.ca66a5ce-5917-4a11-908e-f164c7cc9368.3a4f6d65-26a9-421f-bdc7-63417effce2d', costCenter: '030', department: 'Revenue', mappingMethod: 'rule', splitDimensions: [{ name: 'Region', value: 'APAC' }] },

  // 5xxx — Cost of Revenue
  { id: 'a21', number: '5001', name: 'Cloud Hosting - AWS', destinationId: 'root-cost-of-revenues', costCenter: '100', department: 'Operations', mappingMethod: 'rule' },
  { id: 'a21b', number: '5002', name: 'Cloud Hosting - Azure', destinationId: 'root-cost-of-revenues', costCenter: '100', department: 'Operations', mappingMethod: 'rule' },
  { id: 'a21c', number: '5010', name: 'COGS - Salaries & Benefits', destinationId: 'root-cogs-salares-wages', costCenter: '100', department: 'Operations', mappingMethod: 'rule' },
  { id: 'a21d', number: '5020', name: 'COGS - Stock-Based Compensation', destinationId: 'root-cogs-stock-comp', costCenter: '100', department: 'Operations', mappingMethod: 'rule' },
  // 5001 AWS hosting split by Environment
  { id: 'a21-prod', number: '5001', name: 'Cloud Hosting - AWS', destinationId: 'root-cost-of-revenues', costCenter: '101', department: 'Operations', mappingMethod: 'rule', splitDimensions: [{ name: 'Environment', value: 'Production' }] },
  { id: 'a21-stg', number: '5001', name: 'Cloud Hosting - AWS', destinationId: 'root-cost-of-revenues', costCenter: '102', department: 'Operations', mappingMethod: 'rule', splitDimensions: [{ name: 'Environment', value: 'Staging' }] },
  { id: 'a21-dev', number: '5001', name: 'Cloud Hosting - AWS', destinationId: 'root-cost-of-revenues', costCenter: '103', department: 'Operations', mappingMethod: 'rule', splitDimensions: [{ name: 'Environment', value: 'Development' }] },

  // 6xxx — Operating Expenses
  { id: 'a22', number: '6010', name: 'Salaries - Engineering', destinationId: 'root-r-d-salaries-and-wages', costCenter: '200', department: 'R&D', mappingMethod: 'rule' },
  { id: 'a22b', number: '6011', name: 'Salaries - Product & Design', destinationId: 'root-r-d-salaries-and-wages', costCenter: '201', department: 'R&D', mappingMethod: 'rule' },
  { id: 'a22c', number: '6012', name: 'Salaries - Sales', destinationId: 'root-s-m-salaries-and-wages', costCenter: '400', department: 'Sales', mappingMethod: 'rule' },
  { id: 'a22d', number: '6013', name: 'Salaries - G&A', destinationId: 'root-g-a-salaries-and-wages', costCenter: '300', department: 'G&A', mappingMethod: 'rule' },
  // 6010 Engineering salaries split by Team
  { id: 'a22-plat', number: '6010', name: 'Salaries - Engineering', destinationId: 'root-r-d-salaries-and-wages', costCenter: '210', department: 'Engineering', mappingMethod: 'rule', splitDimensions: [{ name: 'Team', value: 'Platform' }] },
  { id: 'a22-app', number: '6010', name: 'Salaries - Engineering', destinationId: 'root-r-d-salaries-and-wages', costCenter: '211', department: 'Engineering', mappingMethod: 'rule', splitDimensions: [{ name: 'Team', value: 'Application' }] },
  { id: 'a22-infra', number: '6010', name: 'Salaries - Engineering', destinationId: 'root-r-d-salaries-and-wages', costCenter: '212', department: 'Engineering', mappingMethod: 'rule', splitDimensions: [{ name: 'Team', value: 'Infrastructure' }] },
  { id: 'a22-qa', number: '6010', name: 'Salaries - Engineering', destinationId: 'root-r-d-salaries-and-wages', costCenter: '213', department: 'Engineering', mappingMethod: 'rule', splitDimensions: [{ name: 'Team', value: 'QA' }] },
  // 6012 Sales salaries split by Region
  { id: 'a22c-amer', number: '6012', name: 'Salaries - Sales', destinationId: 'root-s-m-salaries-and-wages', costCenter: '410', department: 'Sales', mappingMethod: 'rule', splitDimensions: [{ name: 'Region', value: 'Americas' }] },
  { id: 'a22c-emea', number: '6012', name: 'Salaries - Sales', destinationId: 'root-s-m-salaries-and-wages', costCenter: '420', department: 'Sales', mappingMethod: 'rule', splitDimensions: [{ name: 'Region', value: 'EMEA' }] },
  { id: 'a23', number: '6020', name: 'Employee Benefits', destinationId: 'root-r-d-salaries-and-wages', costCenter: '200', department: 'R&D', mappingMethod: 'rule' },
  { id: 'a24', number: '6100', name: 'Rent Expense', destinationId: 'root-g-a-rent-or-lease', costCenter: '300', department: 'G&A', mappingMethod: 'direct' },
  { id: 'a25', number: '6200', name: 'Marketing - Paid Media', destinationId: 'unassigned', costCenter: '400', department: 'Sales & Marketing', mappingMethod: 'unassigned' },
  { id: 'a25b', number: '6210', name: 'Marketing - Events', destinationId: 'root-s-m-professional-fees', costCenter: '401', department: 'Marketing', mappingMethod: 'rule' },
  { id: 'a26', number: '6300', name: 'Travel & Entertainment', destinationId: 'd6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.f88cd2af-14e9-41b8-a76f-fb73ef827814.171fe1ff-c11c-4cfe-b43a-41a601ffd3bd', costCenter: '300', department: 'G&A', mappingMethod: 'rule' },
  { id: 'a27', number: '6400', name: 'Professional Services', destinationId: 'root-g-a-professional-fees', costCenter: '300', department: 'G&A', mappingMethod: 'rule', isActive: false },
  { id: 'a28', number: '6500', name: 'Software Subscriptions', destinationId: 'd6e59fd0-a55a-4d5a-884e-437832ee2019.b66ccbf5-9880-4287-bbeb-f76ae18ee10a.57c3c702-326d-4d74-bf5c-ef0c063e5569.a0ebb068-de06-48b1-ab58-36a29d414685', costCenter: '200', department: 'R&D', mappingMethod: 'rule' },
  { id: 'a28b', number: '6510', name: 'SaaS Tools - Sales', destinationId: 'root-s-m-professional-fees', costCenter: '400', department: 'Sales', mappingMethod: 'rule' },
  { id: 'a28c', number: '6600', name: 'Commissions - Sales', destinationId: 'root-s-m-commissions-expense', costCenter: '400', department: 'Sales', mappingMethod: 'rule' },
  // 6600 Commissions split by Region + Segment
  { id: 'a28c-ent', number: '6600', name: 'Commissions - Sales', destinationId: 'root-s-m-commissions-expense', costCenter: '411', department: 'Sales', mappingMethod: 'rule', splitDimensions: [{ name: 'Segment', value: 'Enterprise' }, { name: 'Region', value: 'Americas' }] },
  { id: 'a28c-smb', number: '6600', name: 'Commissions - Sales', destinationId: 'root-s-m-commissions-expense', costCenter: '412', department: 'Sales', mappingMethod: 'rule', splitDimensions: [{ name: 'Segment', value: 'SMB' }, { name: 'Region', value: 'Americas' }] },
  { id: 'a28c-emea', number: '6600', name: 'Commissions - Sales', destinationId: 'root-s-m-commissions-expense', costCenter: '420', department: 'Sales', mappingMethod: 'rule', splitDimensions: [{ name: 'Segment', value: 'Enterprise' }, { name: 'Region', value: 'EMEA' }] },

  // 7xxx — Other Income / Expense
  { id: 'a29', number: '7001', name: 'Interest Income', destinationId: 'd6e59fd0-a55a-4d5a-884e-437832ee2019.58687705-81bb-4066-96d4-d85f254f3dfe.981df063-8c9d-46b1-ab54-e9a1c318c59b.0dea1322-41c4-4ea2-bbf6-13957e1b7cbc', costCenter: '000', department: 'Corporate', mappingMethod: 'rule', isActive: false },
  { id: 'a30', number: '7100', name: 'Interest Expense', destinationId: 'd6e59fd0-a55a-4d5a-884e-437832ee2019.58687705-81bb-4066-96d4-d85f254f3dfe.981df063-8c9d-46b1-ab54-e9a1c318c59b.0dea1322-41c4-4ea2-bbf6-13957e1b7cbc', costCenter: '000', department: 'Corporate', mappingMethod: 'rule' },
  { id: 'a30b', number: '7200', name: 'Foreign Currency Gain/Loss', destinationId: 'd6e59fd0-a55a-4d5a-884e-437832ee2019.58687705-81bb-4066-96d4-d85f254f3dfe.981df063-8c9d-46b1-ab54-e9a1c318c59b.0dea1322-41c4-4ea2-bbf6-13957e1b7cbc', costCenter: '000', department: 'Corporate', mappingMethod: 'direct' },

  // Suspense / clearing — intentionally unassigned to demo the Unassigned filter
  { id: 'a11', number: '9999', name: 'Suspense - Unmapped', destinationId: 'unassigned', mappingMethod: 'unassigned' },
  { id: 'a12', number: '9998', name: 'Clearing - To Reclass', destinationId: 'unassigned', mappingMethod: 'unassigned' },

  // Do Not Map — explicitly excluded from the rollup structure
  { id: 'dnm1', number: '6800', name: 'Intercompany Eliminations', destinationId: 'do-not-map', costCenter: '000', department: 'Corporate', mappingMethod: 'do-not-map' },
  { id: 'dnm2', number: '6900', name: 'Parent Entity Allocations', destinationId: 'do-not-map', costCenter: '000', department: 'Corporate', mappingMethod: 'do-not-map' },

  // Extra dimension splits for account 1000 — used to demonstrate the
  // account-focus filter: clicking 1000 in the hierarchy should surface all
  // of these rows together regardless of mapping method (rule, direct,
  // unassigned). Same number/name, different department + cost center +
  // mapping method, sharing a single hierarchy row (deduped by number in
  // accountsByDestination).
  { id: 'a1-emea', number: '1000', name: 'Operating Cash - JPMorgan', destinationId: '87350ede-6ebd-42d1-8066-56c117f6707e.9868a748-d550-4107-9f43-06e21bf19a0d', costCenter: '100', department: 'EMEA', mappingMethod: 'direct', secondaryDimensionCount: 2, splitDimensions: [{ name: 'Department', value: 'EMEA' }] },
  { id: 'a1-canada', number: '1000', name: 'Operating Cash - JPMorgan', destinationId: 'unassigned', costCenter: '110', department: 'Canada', mappingMethod: 'unassigned', secondaryDimensionCount: 2, splitDimensions: [{ name: 'Department', value: 'Canada' }, { name: 'Location', value: 'Toronto' }] },
]

// Derives a rule name from the destination the account is mapped to.
// This keeps the rule label aligned with where the account sits in the hierarchy —
// e.g. an account under "Cash and Equivalents" shows "Cash and Equivalents Rule".
// Only meaningful for accounts with mappingMethod === 'rule'.
export function getRuleName(
  account: MappedAccount,
  destinationName: string | undefined,
): string | null {
  if (account.mappingMethod !== 'rule') return null
  if (!destinationName) return 'Mapping Rule'
  return `${destinationName} Rule`
}
