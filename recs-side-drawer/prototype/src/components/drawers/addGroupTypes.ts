export interface FilterRow {
  id: string
  dimension: string | null
  value: string | null
}

export interface AccountFilterState {
  id: string
  name: string
  rows: FilterRow[]
}

export interface AssigneeState {
  id: string
  name: string | null
  role: string | null
  dayType: string | null
  day: string
  estimatedTime: string
}

export interface GeneralSettingsState {
  currency: string | null
  threshold: string
  fixedBalance: string
}

// Shared between Add Group and Add Account - identical option lists in both drawers.
export const TARGET_CURRENCY_OPTIONS = [
  { label: 'No target currency', value: 'none' },
  { label: 'USD', value: 'usd' },
  { label: 'EUR', value: 'eur' },
  { label: 'MXN', value: 'mxn' },
  { label: 'JPY', value: 'jpy' },
  { label: 'CAD', value: 'cad' },
  { label: 'NTD', value: 'ntd' },
  { label: 'GBP', value: 'gbp' },
]

// Checklist's "Period" field (Add Task drawer) - a close period, not tied to
// any real calendar math in this prototype (see MOCK_DUE_DATE elsewhere for
// the same convention).
export const PERIOD_OPTIONS = [
  { label: 'January', value: 'january' },
  { label: 'February', value: 'february' },
  { label: 'March', value: 'march' },
  { label: 'April', value: 'april' },
  { label: 'May', value: 'may' },
  { label: 'June', value: 'june' },
  { label: 'July', value: 'july' },
  { label: 'August', value: 'august' },
  { label: 'September', value: 'september' },
  { label: 'October', value: 'october' },
  { label: 'November', value: 'november' },
  { label: 'December', value: 'december' },
]

export const FREQUENCY_OPTIONS = [
  { label: 'Non-Recurring', value: 'non-recurring' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Annual', value: 'annual' },
  { label: 'Custom', value: 'custom' },
]

export const CONTROL_OPTIONS = [
  {
    label: 'Cash-01: Cash Personnel Check',
    value: 'cash-01',
    sublabel: 'On a monthly basis, an Accounting Manager checks the digital history of cash box counts to confirm dual custody was maintained.',
  },
  {
    label: 'Cash-02: Bank Reconciliation Review',
    value: 'cash-02',
    sublabel: 'On a monthly basis, a Controller reviews the completed bank reconciliation for unresolved reconciling items over the threshold.',
  },
  {
    label: 'JE-01: Journal Entry Approval',
    value: 'je-01',
    sublabel: 'On a monthly basis, a Manager reviews and approves all manual journal entries above the materiality threshold before posting.',
  },
  {
    label: 'AR-01: Revenue Recognition Review',
    value: 'ar-01',
    sublabel: 'On a quarterly basis, the Revenue team reviews contract terms against recognized revenue for compliance with ASC 606.',
  },
  {
    label: 'FX-01: Intercompany Elimination Check',
    value: 'fx-01',
    sublabel: 'On a monthly basis, an Accounting Manager confirms intercompany balances net to zero prior to consolidation.',
  },
]

export const INITIAL_TAG_OPTIONS = [
  { label: '#journal_entry', value: 'journal-entry' },
  { label: '#pre_close', value: 'pre-close' },
  { label: '#high_risk', value: 'high-risk' },
  { label: '#non_close', value: 'non-close' },
  { label: '#team_gl', value: 'team-gl' },
  { label: '#pl_impact', value: 'pl-impact' },
  { label: '#automated', value: 'automated' },
]

export const GENERAL_CURRENCY_OPTIONS = [
  { label: 'USD - US Dollar', value: 'usd' },
  { label: 'EUR - Euro', value: 'eur' },
  { label: 'GBP - British Pound', value: 'gbp' },
]

export const DAY_TYPE_OPTIONS = [
  { label: 'Business Day', value: 'business-day' },
  { label: 'Calendar Day', value: 'calendar-day' },
]

export const DIMENSION_OPTIONS = [
  { label: 'Company', value: 'company' },
  { label: 'Bank Account', value: 'bank-account' },
  { label: 'Book Code', value: 'book-code' },
  { label: 'Region', value: 'region' },
  { label: 'Cost Center', value: 'cost-center' },
]

export const DIMENSION_VALUE_OPTIONS: Record<string, { label: string; value: string }[]> = {
  company: [
    { label: 'Global Modern Services, Inc. (USA)', value: 'global-modern-services' },
    { label: 'Doh Nuts, Inc. (USA)', value: 'doh-nuts-inc' },
    { label: 'Randys Donuts, Inc. (USA)', value: 'randys-donuts-inc' },
    { label: 'Forbidden Donuts, Ltd. (Canada)', value: 'forbidden-donuts-ltd' },
    { label: 'Lard Lad Donuts, Corp. (USA)', value: 'lard-lad-donuts-corp' },
  ],
  'bank-account': [
    { label: 'Morgan Stanley, (No Value)', value: 'morgan-stanley' },
    { label: 'Wells Fargo, (No Value)', value: 'wells-fargo' },
    { label: 'JPMorgan Chase, (No Value)', value: 'jpmorgan-chase' },
    { label: 'Bank of America, (No Value)', value: 'bank-of-america' },
    { label: 'Silicon Valley Bank, (No Value)', value: 'silicon-valley-bank' },
  ],
  'book-code': [
    { label: '(No Value)', value: 'no-value' },
    { label: 'Book 01 - US GAAP', value: 'book-01-us-gaap' },
    { label: 'Book 02 - IFRS', value: 'book-02-ifrs' },
    { label: 'Book 03 - Tax', value: 'book-03-tax' },
    { label: 'Book 04 - Management', value: 'book-04-management' },
  ],
  region: [
    { label: 'North America', value: 'north-america' },
    { label: 'EMEA', value: 'emea' },
    { label: 'APAC', value: 'apac' },
    { label: 'LATAM', value: 'latam' },
    { label: 'ANZ', value: 'anz' },
  ],
  'cost-center': [
    { label: 'CC-100 - Corporate', value: 'cc-100-corporate' },
    { label: 'CC-200 - Sales', value: 'cc-200-sales' },
    { label: 'CC-300 - Marketing', value: 'cc-300-marketing' },
    { label: 'CC-400 - Engineering', value: 'cc-400-engineering' },
    { label: 'CC-500 - Operations', value: 'cc-500-operations' },
  ],
}

export const ROLE_OPTIONS = [
  { label: 'Monthly Preparer', value: 'monthly-preparer' },
  { label: 'Monthly Reviewer', value: 'monthly-reviewer' },
]

// Generic placeholder headshots (i.pravatar.cc, seeded by name) for the
// mock preparer/reviewer names used throughout this prototype - avoids
// using any real person's likeness for filler avatar data.
export const AVATAR_SRC_BY_NAME: Record<string, string> = {
  'Elijah Wood': 'https://i.pravatar.cc/64?u=elijah-wood',
  'Viggo Mortensen': 'https://i.pravatar.cc/64?u=viggo-mortensen',
  'Billy Boyd': 'https://i.pravatar.cc/64?u=billy-boyd',
  'Ian McKellen': 'https://i.pravatar.cc/64?u=ian-mckellen',
  'Sean Bean': 'https://i.pravatar.cc/64?u=sean-bean',
  'Liv Tyler': 'https://i.pravatar.cc/64?u=liv-tyler',
  'Cate Blanchett': 'https://i.pravatar.cc/64?u=cate-blanchett',
  'Karl Urban': 'https://i.pravatar.cc/64?u=karl-urban',
  'Miranda Otto': 'https://i.pravatar.cc/64?u=miranda-otto',
  'Evangeline Lilly': 'https://i.pravatar.cc/64?u=evangeline-lilly',
}

export interface AccountOption {
  id: string
  name: string
}

export interface DependencyRow {
  id: string
  type: 'checklist' | 'reconciliation'
  relationshipType: string | null
  entity: string | null
  folder: string | null
  itemId: string | null
}

// Mock entities themed around fictional donut shops - a realistic multi-entity
// list to demo the Entity dropdown's search/scroll behavior, not real companies.
export const ENTITY_OPTIONS = [
  { label: 'Doh Nuts', value: 'doh-nuts' },
  { label: 'Randys Donuts', value: 'randys-donuts' },
  { label: 'Forbidden Donuts', value: 'forbidden-donuts' },
  { label: 'Holey Rollers', value: 'holey-rollers' },
  { label: 'Lard Lad Donuts', value: 'lard-lad-donuts' },
  { label: 'Sprinkle Donuts', value: 'sprinkle-donuts' },
  { label: 'Dough Delights', value: 'dough-delights' },
  { label: 'The Donut Hole', value: 'the-donut-hole' },
]

// Mock balance-sheet-style folder structure - a realistic 15-item list to
// demo the Folder dropdown's search/scroll behavior.
export const FOLDER_OPTIONS = [
  { label: '01 Cash and cash equivalents', value: 'cash-and-cash-equivalents' },
  { label: '02 Restricted cash', value: 'restricted-cash' },
  { label: '03 Marketable securities', value: 'marketable-securities' },
  { label: '04 Accounts receivable', value: 'accounts-receivable' },
  { label: '05 Deferred commissions', value: 'deferred-commissions' },
  { label: '06 Inventories', value: 'inventories' },
  { label: '07 Prepaid expenses and other assets', value: 'prepaid-expenses-and-other-assets' },
  { label: '08 Capitalized software', value: 'capitalized-software' },
  { label: '09 Property and equipment', value: 'property-and-equipment' },
  { label: '10 Intangible assets', value: 'intangible-assets' },
  { label: '11 Goodwill', value: 'goodwill' },
  { label: '12 Accounts payable', value: 'accounts-payable' },
  { label: '13 Accrued compensation', value: 'accrued-compensation' },
  { label: '14 Accrued expenses', value: 'accrued-expenses' },
  { label: '15 Deferred revenue', value: 'deferred-revenue' },
]

export const RELATIONSHIP_TYPE_OPTIONS = [
  { label: 'Blocked By', value: 'blocked-by' },
  { label: 'Blocks', value: 'blocks' },
]

// Capped at 5 - the Dependency picker's list is meant to fit without
// scrolling (see DependencyDrillIn's DependencyCard).
export const TASK_OPTIONS = [
  {
    label: 'Perform remeasurement for FS presentation purposes (JEV should auto reverse on the first of next month)',
    value: 'task-remeasurement',
  },
  { label: 'Download bank statements for Cash recs', value: 'task-bank-statements' },
  { label: 'Confirm Deposits for account SVB #12345', value: 'task-confirm-deposits' },
  { label: 'Reconcile intercompany balances before consolidation', value: 'task-intercompany-recon' },
  { label: 'Review accrual reversals for prior period', value: 'task-accrual-reversal' },
]

// Capped at 5, same rationale as TASK_OPTIONS - shown when a Dependency's
// type is Reconciliation, which resolves to an account rather than a task.
export const ACCOUNT_OPTIONS = [
  { label: '1010 - Cash in Bank - USD Operating', value: 'acct-1010' },
  { label: '1030 - Cash in Bank - EUR Operating', value: 'acct-1030' },
  { label: '1210 - Accounts Receivable - Trade', value: 'acct-1210' },
  { label: '2310 - Accrued Payroll', value: 'acct-2310' },
  { label: '2320 - Accrued Vendor Expenses', value: 'acct-2320' },
]

// Mock "due" reference shown on a Dependency summary row - this prototype has
// no real due-date model tying tasks/accounts to a date, so these are
// illustrative placeholders (not derived from anything live).
export const DUE_LABEL_BY_ITEM: Record<string, string> = {
  'task-remeasurement': 'Day 18',
  'task-bank-statements': 'Day 11',
  'task-confirm-deposits': 'Day 3',
  'task-intercompany-recon': 'Day 5',
  'task-accrual-reversal': 'Day 2',
  'acct-1010': 'Day 1',
  'acct-1030': 'Day 4',
  'acct-1210': 'Day 7',
  'acct-2310': 'Day 10',
  'acct-2320': 'Day 12',
}

// The full universe of accounts selectable in the Accounts multi-select
// popover. `AccountFilterState[]` (used by Account Balance Filters) is
// derived from whichever of these are currently checked.
export const ALL_ACCOUNTS: AccountOption[] = [
  { id: 'acct-1010', name: '1010 - Cash in Bank - USD Operating' },
  { id: 'acct-1020', name: '1020 - Cash in Bank - USD Payroll' },
  { id: 'acct-1030', name: '1030 - Cash in Bank - EUR Operating' },
  { id: 'acct-1040', name: '1040 - Cash in Bank - GBP Operating' },
  { id: 'acct-1050', name: '1050 - Petty Cash - HQ' },
  { id: 'acct-1060', name: '1060 - Petty Cash - Regional Office' },
  { id: 'acct-1070', name: '1070 - Money Market - Short Term' },
  { id: 'acct-1080', name: '1080 - Money Market - Investment' },
  { id: 'acct-1210', name: '1210 - Accounts Receivable - Trade' },
  { id: 'acct-1220', name: '1220 - Accounts Receivable - Other' },
  { id: 'acct-2310', name: '2310 - Accrued Payroll' },
  { id: 'acct-2320', name: '2320 - Accrued Vendor Expenses' },
]

// Seed data for "view existing settings" - opened via a Reconciliations
// table row's gear icon, as opposed to the empty "Add Group" flow. The
// wireframe table has no real per-row data model, so every row currently
// opens the same canned settings rather than something row-specific.
export interface ExistingGroupSettings {
  entity: string
  folder: string
  groupName: string
  selectedAccountIds: string[]
  targetCurrency: string
  frequency: string
  assignees: AssigneeState[]
  controls: string[]
  selectedTagIds: string[]
}

export const MOCK_EXISTING_GROUP_SETTINGS: ExistingGroupSettings = {
  entity: 'doh-nuts',
  folder: 'cash-and-cash-equivalents',
  groupName: 'Cash and Cash Equivalents',
  selectedAccountIds: ['acct-1010', 'acct-1020', 'acct-1030'],
  targetCurrency: 'usd',
  frequency: 'monthly',
  assignees: [
    { id: 'existing-assignee-1', name: 'Sean Bean', role: 'monthly-preparer', dayType: 'business-day', day: '15', estimatedTime: '05h 45m' },
    { id: 'existing-assignee-2', name: 'Ian McKellen', role: 'monthly-preparer', dayType: 'business-day', day: '15', estimatedTime: '05h 45m' },
  ],
  controls: ['cash-01'],
  selectedTagIds: ['journal-entry', 'pre-close'],
}

export const MOCK_AR_GROUP_SETTINGS: ExistingGroupSettings = {
  entity: 'randys-donuts',
  folder: 'accounts-receivable',
  groupName: 'Accounts Receivable',
  selectedAccountIds: ['acct-1210', 'acct-1220'],
  targetCurrency: 'usd',
  frequency: 'monthly',
  assignees: [
    { id: 'existing-assignee-3', name: 'Liv Tyler', role: 'monthly-preparer', dayType: 'business-day', day: '10', estimatedTime: '03h 30m' },
  ],
  controls: [],
  selectedTagIds: ['non-close'],
}

export const MOCK_ACCRUED_GROUP_SETTINGS: ExistingGroupSettings = {
  entity: 'forbidden-donuts',
  folder: 'accrued-expenses',
  groupName: 'Accrued Expenses',
  selectedAccountIds: ['acct-2310', 'acct-2320'],
  targetCurrency: 'none',
  frequency: 'monthly',
  assignees: [
    { id: 'existing-assignee-4', name: 'Cate Blanchett', role: 'monthly-reviewer', dayType: 'business-day', day: '20', estimatedTime: '02h 15m' },
  ],
  controls: [],
  selectedTagIds: ['high-risk'],
}

// A handful of named, clickable "Group" rows for the Reconciliations
// wireframe table - lets the table show a few real, distinct groups (with
// their own accounts) instead of every row opening the same canned mock.
export interface MockGroupRow {
  id: string
  settings: ExistingGroupSettings
}

export const MOCK_GROUP_ROWS: MockGroupRow[] = [
  { id: 'group-cash', settings: MOCK_EXISTING_GROUP_SETTINGS },
  { id: 'group-ar', settings: MOCK_AR_GROUP_SETTINGS },
  { id: 'group-accrued', settings: MOCK_ACCRUED_GROUP_SETTINGS },
]

// "View existing settings" seed for Checklist's Add Task drawer, opened via
// a table row's gear icon - the Checklist table has no per-row data model
// (every row is a generic placeholder, per the wireframe-only scope), so
// every row's gear opens this same canned, already-filled-out task, matching
// how Reconciliations' flat (non-Group) rows all open one canned settings
// object too.
export interface ExistingTaskSettings {
  entity: string
  period: string
  folder: string
  description: string
  frequency: string
  assignees: AssigneeState[]
  controls: string[]
  selectedTagIds: string[]
  dependencies: DependencyRow[]
}

export const MOCK_TASK_SETTINGS: ExistingTaskSettings = {
  entity: 'randys-donuts',
  period: 'august',
  folder: 'cash-and-cash-equivalents',
  description: 'One donut to rule them all.',
  frequency: 'monthly',
  assignees: [
    { id: 'existing-task-assignee-1', name: 'Sean Bean', role: 'monthly-preparer', dayType: 'business-day', day: '18', estimatedTime: '02h 00m' },
  ],
  controls: [],
  selectedTagIds: ['pre-close'],
  dependencies: [
    {
      id: 'existing-task-dependency-1',
      type: 'reconciliation',
      relationshipType: 'blocked-by',
      entity: 'doh-nuts',
      folder: 'cash-and-cash-equivalents',
      itemId: 'task-remeasurement',
    },
  ],
}

// Documents drawer (per Figma node 8703:50220). Neither table has a
// per-row data model (see MOCK_TASK_SETTINGS above), so every row's
// paperclip starts from this same canned seed until the user actually
// opens and saves that specific row - matching the "same canned settings
// for every row" convention used everywhere else in this prototype.
export interface DocumentFile {
  id: string
  name: string
  date: string
  addedBy: string
}

// Figma's reference screenshot uses "Michael Scott" for the first group,
// who isn't in this prototype's existing name roster (AVATAR_SRC_BY_NAME) -
// substituted with Elijah Wood to stay consistent with every other mock
// person used across this prototype.
export const MOCK_DOCUMENTS_SEED: DocumentFile[] = [
  { id: 'doc-1', name: 'FloQast_Checklist_Template_San_Jose_Fri_Jun_12_2026_95906_AM.xlsx', date: '06/23/2026', addedBy: 'Elijah Wood' },
  { id: 'doc-2', name: 'FloQast_Checklist_Template_San_Jose_Fri_Jun_12_2026_95906_AM.xlsx', date: '06/23/2026', addedBy: 'Elijah Wood' },
  { id: 'doc-3', name: 'FloQast_Checklist_Template_San_Jose_Fri_Jun_12_2026_95906_AM.xlsx', date: '06/23/2026', addedBy: 'Elijah Wood' },
  { id: 'doc-4', name: 'FloQast_Checklist_Template_San_Jose_Fri_Jun_12_2026_95906_AM.xlsx', date: '06/20/2026', addedBy: 'Cate Blanchett' },
  { id: 'doc-5', name: 'FloQast_Checklist_Template_San_Jose_Fri_Jun_12_2026_95906_AM.xlsx', date: '06/20/2026', addedBy: 'Cate Blanchett' },
  { id: 'doc-6', name: 'FloQast_Checklist_Template_San_Jose_Fri_Jun_12_2026_95906_AM.xlsx', date: '06/18/2026', addedBy: 'Karl Urban' },
]

// Review Notes drawer (per Figma node 8725:243259). The 4 reference frames
// are flattened screenshots, not real layers - there's no nested spec to
// pull props from, so layout/spacing below is read visually off those
// frames. Neither table has a per-row data model (see MOCK_TASK_SETTINGS/
// MOCK_DOCUMENTS_SEED above), so every row's comment icon opens the same
// canned reconciliation header.
export interface ReconciliationHeaderData {
  title: string
  descriptionFields: { label: string; value: string }[]
  tagIds: string[]
}

// Figma's own Description text is one run-on sentence ("1000 Cash - Book
// Code: ... - Company: ... - Ledger: ..."). Per explicit direction, this is
// deliberately NOT what's built here - the attached reference screenshot
// (account title + "Bank Account:"/"Book Code:" on their own lines) is used
// for the layout instead, with AccountBalanceFiltersSection's row styling
// (bold label + regular value) for the formatting.
export const MOCK_RECONCILIATION_HEADER: ReconciliationHeaderData = {
  title: '1010 - Cash in Bank - USD Operating',
  descriptionFields: [
    { label: 'Bank Account', value: 'Morgan Stanley' },
    { label: 'Book Code', value: 'Book Code A' },
  ],
  tagIds: ['high-risk', 'journal-entry', 'non-close'],
}

export interface ReviewNoteReply {
  id: string
  authorName: string
  date: string
  body: string
}

export interface ReviewNote {
  id: string
  authorName: string
  date: string
  // Maps to the compose screen's helper text ("Unassigned notes will
  // default to closed status") - assigning someone sets 'unresolved',
  // clearing the assignee falls back to 'closed'.
  status: 'unresolved' | 'closed'
  assignedTo: string | null
  body: string
  replies: ReviewNoteReply[]
}

// Figma reuses one demo user ("Jimmy Chen") for every avatar in the Review
// Notes mock (author, assignee, and reply) - substituted here with two
// distinct names from this prototype's existing roster (AVATAR_SRC_BY_NAME)
// so the seeded thread reads as a real back-and-forth, not one person
// replying to themselves.
export const MOCK_REVIEW_NOTES_SEED: ReviewNote[] = [
  {
    id: 'note-1',
    authorName: 'Elijah Wood',
    date: '08/04/2026',
    status: 'unresolved',
    assignedTo: 'Elijah Wood',
    body: 'Hi there.',
    replies: [{ id: 'reply-1', authorName: 'Cate Blanchett', date: '08/05/2026', body: "s'up" }],
  },
]

// Options for the compose/detail screens' "Assignee(s)" field - a subset of
// the existing name roster (AVATAR_SRC_BY_NAME), matching how AssigneesDrillIn
// scopes its own TEAM_MEMBER_OPTIONS.
export const NOTE_ASSIGNEE_OPTIONS = [
  { label: 'Elijah Wood', value: 'Elijah Wood' },
  { label: 'Cate Blanchett', value: 'Cate Blanchett' },
  { label: 'Karl Urban', value: 'Karl Urban' },
]
