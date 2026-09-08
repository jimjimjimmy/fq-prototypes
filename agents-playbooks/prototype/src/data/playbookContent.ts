export const COUPA_PLAYBOOK_CONTENT = `
<h1>1. Role and Objective</h1>
<p>The Coupa Accrual Agent automates the month-end accrual process for open Purchase Orders sourced from Coupa. At period end, goods or services covered by an issued PO may have been partially or fully delivered but not yet invoiced. This Playbook calculates the prorated expense obligation for each open PO, deducts any approved invoices already processed within the period, and produces a balanced Journal Entry ready for ERP import.</p>
<p>This process runs once per accounting period, typically on the last business day of the month. The output is a Draft JE pending staff accountant review before posting. No entries are committed to the ERP without explicit human approval.</p>

<h1>2. Required Input Data</h1>
<p>The Agent requires two source files exported from Coupa and one user-supplied parameter. All files must be uploaded before the run begins. The system will reject missing or malformed inputs before any processing starts.</p>
<table>
  <thead><tr><th>Input</th><th>Source</th><th>Required Fields</th></tr></thead>
  <tbody>
    <tr><td><a href="#">coupa_purchase_orders.csv</a></td><td>Coupa → Reports → Open POs</td><td>PO_NUMBER, PO_LINE_NUM, VENDOR_NAME, VENDOR_CODE, CONTRACT_START_DATE, CONTRACT_END_DATE, EXPENSE_ACCOUNT</td></tr>
    <tr><td><a href="#">coupa_purchase_orders.csv</a></td><td>Coupa → Reports → Invoice Export</td><td>INVOICE_ID, PO_NUMBER, PO_LINE_NUM, INVOICE_DATE, CONTRACT_START_DATE, CONTRACT_END_DATE</td></tr>
    <tr><td>Accrual Date</td><td>User-supplied at run time</td><td>Single date value (e.g. 2/28/2026)</td></tr>
  </tbody>
</table>

<h1>3. Core Processing Logic</h1>
<h2>3.1 Date Handling and Proration</h2>
<p>The Agent uses inclusive date math throughout. Both the start date and the end date count as active days, which prevents single-day contracts from calculating to zero days and ensures cross-month contracts prorate accurately at period boundaries.</p>
<table>
  <thead><tr><th>PO Number</th><th>Vendor</th><th>Status</th><th>PO Amount</th><th>Contract Start</th><th>Contract End</th></tr></thead>
  <tbody>
    <tr><td><a href="#">PO-89234</a></td><td>Office Supplies Inc</td><td>issued</td><td>$5,800.00</td><td>2/1/2026</td><td>2/28/2026</td></tr>
    <tr><td><a href="#">PO-89235</a></td><td>Acme Consulting</td><td>issued</td><td>$24,000.00</td><td>1/15/2026</td><td>3/14/2026</td></tr>
  </tbody>
</table>

<h2>3.2 Proration Example</h2>
<p>For a contract spanning February 1–28 with a total value of $5,800: total days = 28, period days = 28, prorated amount = $5,800.00.</p>

<h2>3.3 Invoice Matching</h2>
<p>Each approved invoice is matched to its parent PO line. Invoice amounts reduce the gross accrual for that line. The net accrual = prorated obligation − matched invoice total.</p>

<h2>3.4 Matching Output</h2>
<table>
  <thead><tr><th>PO Number</th><th>Gross Accrual</th><th>Invoiced Amount</th><th>Net Accrual</th></tr></thead>
  <tbody>
    <tr><td><a href="#">PO-89234</a></td><td>$5,800.00</td><td>$0.00</td><td>$5,800.00</td></tr>
    <tr><td><a href="#">PO-89235</a></td><td>$10,909.09</td><td>$8,000.00</td><td>$2,909.09</td></tr>
  </tbody>
</table>

<h1>4. Output & JE Format</h1>
<p>The Agent produces a balanced, import-ready Journal Entry. Each line item corresponds to one PO line's net accrual. Debits post to the expense account from the PO. Credits post to the Accrued Liabilities clearing account (2100).</p>

<h2>4.1 Sample JE</h2>
<table>
  <thead><tr><th>Account</th><th>Description</th><th>Debit</th><th>Credit</th></tr></thead>
  <tbody>
    <tr><td>6100</td><td>Office Supplies — PO-89234</td><td>$5,800.00</td><td></td></tr>
    <tr><td>6210</td><td>Consulting — PO-89235 (net)</td><td>$2,909.09</td><td></td></tr>
    <tr><td>2100</td><td>Accrued Liabilities Clearing</td><td></td><td>$8,709.09</td></tr>
  </tbody>
</table>

<h1>5. Validation</h1>
<p>Before generating the JE, the Agent runs a validation pass. Any failed check halts processing and returns a specific, actionable error. The Agent never saves a partial or unverified output.</p>

<h1>6. Exception Handling</h1>
<p>If the Agent cannot process a PO line, it logs the line as an exception with a specific reason code and continues processing all other lines. Exceptions are listed in a separate section of the run trace for human review.</p>

<h1>7. Approval & Posting</h1>
<p>The output JE is created in Draft status. The assigned reviewer receives a notification with a link to the approval surface. The reviewer can approve (post to ERP), reject (with required comment), or request clarification. Posting is irreversible — the reviewer is responsible for confirming accuracy before approving.</p>

<h1>8. Period-End Checklist</h1>
<p>Before running this Playbook, confirm: Coupa PO report pulled as of the accrual date. Invoice export covers all approved invoices through the accrual date. Accrual date matches the period-end date in the ERP. Prior period JEs have been posted or reversed.</p>
`

export const THREE_WAY_MATCH_CONTENT = `
<h1>1. Role and Objective</h1>
<p>The Three-Way Match Review Playbook matches Purchase Orders, receiving reports, and vendor invoices at the line item level. It surfaces quantity discrepancies, price variances, and terms mismatches before invoices are approved for payment, reducing erroneous disbursements and strengthening AP controls.</p>
<p>This process runs on demand as invoices arrive and on a scheduled nightly sweep for any unmatched items older than 48 hours. All exceptions require human resolution before payment authorization proceeds.</p>

<h1>2. Required Input Data</h1>
<p>Three source files are required. All must be current as of the match run date. The system validates column headers and rejects files with missing required fields before any matching begins.</p>
<table>
  <thead><tr><th>Input</th><th>Source</th><th>Required Fields</th></tr></thead>
  <tbody>
    <tr><td><a href="#">pending_invoices.csv</a></td><td>Coupa → Pending Approval</td><td>INVOICE_ID, PO_NUMBER, LINE_NUM, INVOICED_QTY, INVOICED_UNIT_PRICE, EXTENDED_AMOUNT</td></tr>
    <tr><td><a href="#">po_lines.csv</a></td><td>Coupa → PO Lines</td><td>PO_NUMBER, LINE_NUM, ORDERED_QTY, AGREED_UNIT_PRICE, PAYMENT_TERMS</td></tr>
    <tr><td><a href="#">receipts.csv</a></td><td>ERP → Receiving</td><td>RECEIPT_ID, PO_NUMBER, LINE_NUM, RECEIVED_QTY, RECEIPT_DATE</td></tr>
  </tbody>
</table>

<h1>3. Match Tolerances</h1>
<p>The Playbook applies configurable tolerance thresholds before raising a match exception. Variances within tolerance are approved automatically. Variances that exceed any threshold are flagged for review with a specific reason code and routed to the appropriate owner.</p>
<table>
  <thead><tr><th>Match Type</th><th>Tolerance</th><th>Action on Breach</th></tr></thead>
  <tbody>
    <tr><td>Quantity variance</td><td>±2% or 1 unit</td><td>Flag for AP review</td></tr>
    <tr><td>Unit price variance</td><td>±1% or $5.00</td><td>Flag for buyer review</td></tr>
    <tr><td>Payment terms</td><td>Exact match required</td><td>Hold invoice, notify buyer</td></tr>
  </tbody>
</table>

<h1>4. Exception Workflow</h1>
<p>Invoices with match exceptions are routed to the appropriate owner: price variances go to the Procurement team, quantity variances go to the receiving supervisor, and terms mismatches go to the AP manager. The invoice remains on hold until the exception is resolved or formally accepted.</p>
<p>Each exception record includes: invoice ID, PO line reference, variance type, variance amount, and a timestamp. Owners have 48 hours to resolve before the item escalates to the AP Controller. All resolutions are logged in the audit trail with the approver name and decision rationale.</p>
`

// ─── pb-3: Unbilled & GRNI Accrual ──────────────────────────────────────────
export const GRNI_ACCRUAL_CONTENT = `
<h1>1. Role and Objective</h1>
<p>The Unbilled & GRNI Accrual Playbook identifies goods received but not yet invoiced (GRNI) from the ERP receiving log, calculates the accrual obligation per PO line at period end, and produces draft journal entries for reviewer approval before ERP posting.</p>
<p>This process runs once per accounting period. Receipts with no matching approved invoice as of the accrual date are treated as unbilled liabilities. The output is a Draft JE that must be reviewed and approved before any amounts are posted to the ledger.</p>

<h1>2. Required Input Data</h1>
<p>Two source files are required, both exported as of the accrual date. The system validates row counts and required columns before processing begins. Submissions with missing or malformed data are rejected with a specific error message.</p>
<table>
  <thead><tr><th>Input</th><th>Source</th><th>Required Fields</th></tr></thead>
  <tbody>
    <tr><td><a href="#">receiving_log.csv</a></td><td>ERP → Receiving</td><td>RECEIPT_ID, PO_NUMBER, LINE_NUM, RECEIVED_QTY, UNIT_COST, RECEIPT_DATE, VENDOR_CODE</td></tr>
    <tr><td><a href="#">approved_invoices.csv</a></td><td>Coupa → Approved Invoices</td><td>INVOICE_ID, PO_NUMBER, LINE_NUM, INVOICED_AMOUNT, INVOICE_DATE</td></tr>
  </tbody>
</table>

<h1>3. GRNI Identification Logic</h1>
<p>The Agent joins receiving records to approved invoices by PO number and line number. Any receipt line with no matching approved invoice — or where the invoiced amount is less than the received cost — is treated as GRNI. The uninvoiced balance is calculated as: received cost minus approved invoice total for that line.</p>
<table>
  <thead><tr><th>Receipt ID</th><th>PO Number</th><th>Received Cost</th><th>Invoiced</th><th>GRNI Balance</th></tr></thead>
  <tbody>
    <tr><td>RC-40021</td><td>PO-89241</td><td>$12,400.00</td><td>$0.00</td><td>$12,400.00</td></tr>
    <tr><td>RC-40022</td><td>PO-89244</td><td>$7,800.00</td><td>$5,000.00</td><td>$2,800.00</td></tr>
  </tbody>
</table>

<h1>4. Output & JE Format</h1>
<p>The Agent produces a balanced journal entry. Debits post to each vendor's expense account. Credits post to the GRNI Clearing account (2110). Each line includes the receipt ID and vendor name for traceability.</p>

<h1>5. Validation</h1>
<p>Before finalizing the JE, the Agent confirms: total debits equal total credits, all GRNI lines have a valid expense account, and no receipt dates fall outside the accrual period. Failed checks halt processing and return a specific error.</p>

<h1>6. Exception Handling</h1>
<p>Receipt lines without a matching PO in the system, or with a unit cost of zero, are logged as exceptions and excluded from the JE. Exceptions are listed separately in the run trace for manual follow-up.</p>

<h1>7. Approval & Posting</h1>
<p>The draft JE is routed to the assigned Staff Accountant. The reviewer confirms GRNI balances against the receiving log before approving. Posting is irreversible; any correction after posting requires a reversing entry in the following period.</p>

<h1>8. Period-End Checklist</h1>
<p>Before running: confirm the receiving log is current through the last day of the period. Confirm all invoices approved before the cutoff date are included in the invoice export. Confirm the prior period GRNI JE has been reversed.</p>
`

// ─── pb-4: AP Aging Analysis ─────────────────────────────────────────────────
export const AP_AGING_CONTENT = `
<h1>1. Role and Objective</h1>
<p>The AP Aging Analysis Playbook generates a stratified accounts payable aging report as of the run date. It flags invoices overdue by 30, 60, and 90+ days, surfaces potential duplicate invoices, and identifies vendors with unusually high payment concentration for management review.</p>
<p>This process runs on demand and on a scheduled nightly sweep. Output is a read-only report — no journal entries are produced. Distribution requires explicit approval from the AP Manager.</p>

<h1>2. Required Input Data</h1>
<p>One source file is required, exported from the AP sub-ledger as of the analysis date.</p>
<table>
  <thead><tr><th>Input</th><th>Source</th><th>Required Fields</th></tr></thead>
  <tbody>
    <tr><td><a href="#">open_ap_items.csv</a></td><td>ERP → AP Sub-ledger</td><td>INVOICE_ID, VENDOR_CODE, VENDOR_NAME, INVOICE_DATE, DUE_DATE, OPEN_AMOUNT, PAYMENT_TERMS, GL_ACCOUNT</td></tr>
  </tbody>
</table>

<h1>3. Aging Calculation Logic</h1>
<p>Each open item is bucketed into an aging tier based on the number of days between the due date and the run date. Items with a future due date are classified as Current. The Agent applies the company's standard aging buckets: 1–30 days, 31–60 days, 61–90 days, and 90+ days past due.</p>
<table>
  <thead><tr><th>Aging Bucket</th><th>Definition</th><th>Action</th></tr></thead>
  <tbody>
    <tr><td>Current</td><td>Due date ≥ run date</td><td>No action required</td></tr>
    <tr><td>1–30 days</td><td>1–30 days past due date</td><td>Flag for AP review</td></tr>
    <tr><td>31–60 days</td><td>31–60 days past due date</td><td>Notify vendor manager</td></tr>
    <tr><td>61–90 days</td><td>61–90 days past due date</td><td>Escalate to AP Controller</td></tr>
    <tr><td>90+ days</td><td>More than 90 days past due</td><td>Escalate to CFO</td></tr>
  </tbody>
</table>

<h1>4. Duplicate Invoice Detection</h1>
<p>The Agent scans for duplicate invoice candidates: same vendor, same amount, within a 30-day window. Candidates are flagged for manual confirmation — the Agent does not automatically exclude them. Each flagged pair includes the invoice IDs, amounts, and dates for side-by-side review.</p>

<h1>5. Output & Report Format</h1>
<p>The output is an aging summary with vendor-level detail, a duplicate invoice flag list, and a payment concentration table showing the top 10 vendors by open balance. All outputs are attached to the run record and available for export.</p>

<h1>6. Exception Handling</h1>
<p>Items with a missing due date default to the invoice date for aging purposes and are flagged with a data quality warning. Items with a negative open balance (credits) are excluded from aging buckets and listed in a separate credits schedule.</p>

<h1>7. Distribution & Sign-off</h1>
<p>The AP Manager reviews the aging report before it is distributed to Finance leadership. The reviewer confirms the report date, total AP balance, and that flagged items have been noted. Distribution to senior stakeholders is blocked until sign-off is recorded.</p>
`

// ─── pb-5: Invoice Completeness Review ───────────────────────────────────────
export const INVOICE_COMPLETENESS_CONTENT = `
<h1>1. Role and Objective</h1>
<p>The Invoice Completeness Review Playbook reconciles vendor invoices received against purchase orders issued and goods receipts logged, identifying missing or unmatched invoices that require AP follow-up before period close. It surfaces completeness gaps, not payment decisions.</p>
<p>This process runs on demand during the period-close window and as a scheduled sweep three business days before month end. No journal entries are produced; all exceptions require human resolution.</p>

<h1>2. Required Input Data</h1>
<p>Three source files are required. All must reflect data as of the review date. The system validates that PO numbers in the invoice and receipt files have corresponding entries in the PO master before processing begins.</p>
<table>
  <thead><tr><th>Input</th><th>Source</th><th>Required Fields</th></tr></thead>
  <tbody>
    <tr><td><a href="#">po_master.csv</a></td><td>Coupa → PO Master</td><td>PO_NUMBER, LINE_NUM, VENDOR_CODE, PO_AMOUNT, STATUS</td></tr>
    <tr><td><a href="#">invoices_received.csv</a></td><td>Coupa → Invoice Register</td><td>INVOICE_ID, PO_NUMBER, LINE_NUM, INVOICE_AMOUNT, INVOICE_DATE, STATUS</td></tr>
    <tr><td><a href="#">receipts.csv</a></td><td>ERP → Receiving</td><td>RECEIPT_ID, PO_NUMBER, LINE_NUM, RECEIVED_QTY, RECEIPT_DATE</td></tr>
  </tbody>
</table>

<h1>3. Completeness Match Logic</h1>
<p>The Agent performs a three-way join: PO lines are matched to receipts, then receipts are matched to invoices. Any PO line with a receipt and no corresponding invoice is flagged as an expected-but-missing invoice. Any invoice with no matching PO line is flagged as an orphan invoice requiring justification.</p>

<h2>3.1 Unmatched Invoice Handling</h2>
<p>Orphan invoices — those without a valid PO line — are not automatically routed for payment. They are held in a separate exception queue and assigned to the AP Analyst for PO creation or rejection. An invoice that remains unmatched for more than 5 business days is escalated to the AP Manager.</p>

<h1>4. Exception Workflow</h1>
<p>Each exception is assigned a reason code (Missing Invoice, Orphan Invoice, Quantity Shortfall, Terms Mismatch) and routed to the appropriate owner. Owners have 48 hours to resolve or formally accept each exception before the item escalates. All resolutions are logged with the approver name, decision, and timestamp.</p>

<h1>5. Output & Report</h1>
<p>The output is a completeness exception schedule with one row per unmatched item, showing PO reference, vendor, expected amount, days open, and current owner. The schedule is attached to the run record and linked to the period-close checklist.</p>

<h1>6. Approval & Period-Close</h1>
<p>The AP Manager reviews the open exception schedule before period close is confirmed. All exceptions must be resolved or formally deferred with a documented rationale. Period close is blocked if any exception remains open without a recorded decision.</p>
`

// ─── pb-6: AP Cutoff Test ─────────────────────────────────────────────────────
export const AP_CUTOFF_CONTENT = `
<h1>1. Role and Objective</h1>
<p>The AP Cutoff Test Playbook verifies that invoices dated on or before period-end are recorded in the correct accounting period and that post-cutoff invoices are excluded from the close. It produces a cutoff exception schedule for auditor and management review.</p>
<p>This process runs at period close and is a required step before the Controller signs off on the AP sub-ledger. Output is a read-only exception schedule — no adjusting entries are generated automatically.</p>

<h1>2. Required Input Data</h1>
<p>Two source files are required, both exported after the sub-ledger is closed for the period but before the hard close deadline.</p>
<table>
  <thead><tr><th>Input</th><th>Source</th><th>Required Fields</th></tr></thead>
  <tbody>
    <tr><td><a href="#">ap_transactions.csv</a></td><td>ERP → AP Transaction Detail</td><td>INVOICE_ID, VENDOR_CODE, INVOICE_DATE, POSTING_DATE, AMOUNT, PERIOD_CODE</td></tr>
    <tr><td><a href="#">receipts.csv</a></td><td>ERP → Receiving</td><td>RECEIPT_ID, PO_NUMBER, RECEIPT_DATE, AMOUNT</td></tr>
  </tbody>
</table>

<h1>3. Cutoff Determination Logic</h1>
<p>The Agent compares each invoice's invoice date against the period-end cutoff date. An invoice is a cutoff exception if its invoice date falls on or before the cutoff date but its posting date falls in the subsequent period, or if it was posted in the current period but its invoice date is after the cutoff.</p>
<table>
  <thead><tr><th>Scenario</th><th>Invoice Date</th><th>Posting Date</th><th>Classification</th></tr></thead>
  <tbody>
    <tr><td>Correct — current period</td><td>≤ cutoff date</td><td>Current period</td><td>No exception</td></tr>
    <tr><td>Late posting</td><td>≤ cutoff date</td><td>Next period</td><td>Cutoff exception — understatement</td></tr>
    <tr><td>Early recording</td><td>&gt; cutoff date</td><td>Current period</td><td>Cutoff exception — overstatement</td></tr>
  </tbody>
</table>

<h1>4. Exception Schedule</h1>
<p>Each cutoff exception is listed with: invoice ID, vendor, invoice date, posting date, amount, period code, and exception type (understatement or overstatement). The schedule includes an aggregate impact row showing the net effect on the period's AP balance. All exception data is retained in the run record for auditor access.</p>

<h1>5. Auditor Review & Approval</h1>
<p>The Controller reviews the cutoff exception schedule and determines whether any items require an adjusting journal entry. The determination — adjust, defer, or accept as immaterial — is recorded in the approval surface before the AP sub-ledger sign-off can proceed. Auditors can access the completed schedule and approval record directly from the run history.</p>
`

// ─── pb-8: Vendor Statement Reconciliation ───────────────────────────────────
export const VENDOR_RECON_CONTENT = `
<h1>1. Role and Objective</h1>
<p>The Vendor Statement Reconciliation Playbook reconciles vendor-provided statements to the AP sub-ledger, identifying outstanding invoices, unapplied credits, timing differences, and disputed items. It produces a reconciliation memo for management review and external audit support.</p>
<p>This process runs on demand for priority vendors and on a monthly schedule for all vendors with statement balances above a configurable threshold. No payments or postings are triggered by this Playbook — all exceptions require human resolution.</p>

<h1>2. Required Input Data</h1>
<p>Two source files are required per vendor reconciliation. The vendor statement must be the most recent statement provided by the vendor, dated within 45 days of the reconciliation date.</p>
<table>
  <thead><tr><th>Input</th><th>Source</th><th>Required Fields</th></tr></thead>
  <tbody>
    <tr><td><a href="#">vendor_statement.csv</a></td><td>Vendor-provided</td><td>INVOICE_NUMBER, INVOICE_DATE, INVOICE_AMOUNT, PAYMENT_APPLIED, BALANCE_DUE</td></tr>
    <tr><td><a href="#">ap_subledger.csv</a></td><td>ERP → AP Sub-ledger</td><td>INVOICE_ID, VENDOR_CODE, INVOICE_DATE, ORIGINAL_AMOUNT, OPEN_AMOUNT, LAST_PAYMENT_DATE</td></tr>
  </tbody>
</table>

<h1>3. Reconciliation Logic</h1>
<p>The Agent matches vendor statement line items to AP sub-ledger records by invoice number. Items present on the vendor statement but not in the sub-ledger are flagged as unrecorded liabilities. Items in the sub-ledger not on the vendor statement are flagged as potential duplicates or timing differences. Payment amounts are reconciled separately — any payment recorded in one system but not the other is flagged as an unapplied payment.</p>

<h1>4. Discrepancy Resolution</h1>
<p>Each reconciling item is categorized: Timing Difference (expected to clear), Unapplied Credit, Disputed Invoice, or Unrecorded Liability. Categories drive the routing logic — disputed items go to the Procurement team, unrecorded liabilities go to AP for invoice creation, and unapplied credits go to the AP Analyst for payment matching. Items unresolved after 10 business days escalate to the AP Controller.</p>

<h1>5. Output & Reconciliation Memo</h1>
<p>The output includes: a side-by-side balance comparison (sub-ledger vs. vendor statement), a categorized reconciling items schedule, and an overall reconciliation status (Balanced, Reconciling Items Noted, or Unresolved Exceptions). The memo is formatted for external auditor delivery and attached to the run record.</p>

<h1>6. Approval & Signoff</h1>
<p>The AP Manager reviews and signs off on the reconciliation memo before it is filed or shared externally. Memos with unresolved exceptions require a documented management response before signoff is permitted. All approvals are time-stamped and stored in the run history.</p>
`

// ─── pb-9: Payment Run Validation ─────────────────────────────────────────────
export const PAYMENT_RUN_CONTENT = `
<h1>1. Role and Objective</h1>
<p>The Payment Run Validation Playbook validates the AP payment run against authorized invoices, checks for duplicate payments, confirms bank account accuracy for new or recently changed vendors, and flags any payments that exceed configured approval thresholds before the payment file is released to the bank.</p>
<p>This process is a required pre-release gate for every payment run. The payment file is held until validation passes and a human approver explicitly releases it. No payment is transmitted without a recorded approval.</p>

<h1>2. Required Input Data</h1>
<p>Three source files are required. All must reflect the same payment run ID. The system rejects mismatched run IDs across files.</p>
<table>
  <thead><tr><th>Input</th><th>Source</th><th>Required Fields</th></tr></thead>
  <tbody>
    <tr><td><a href="#">payment_proposal.csv</a></td><td>ERP → Payment Proposal</td><td>PAYMENT_ID, VENDOR_CODE, INVOICE_ID, PAYMENT_AMOUNT, PAYMENT_DATE, BANK_ACCOUNT_NUM</td></tr>
    <tr><td><a href="#">authorized_invoices.csv</a></td><td>Coupa → Approved Invoices</td><td>INVOICE_ID, VENDOR_CODE, APPROVED_AMOUNT, APPROVAL_DATE, APPROVER_ID</td></tr>
    <tr><td><a href="#">vendor_master.csv</a></td><td>ERP → Vendor Master</td><td>VENDOR_CODE, BANK_ACCOUNT_NUM, BANK_ACCOUNT_UPDATED_DATE, PAYMENT_TERMS</td></tr>
  </tbody>
</table>

<h1>3. Payment Validation Rules</h1>
<p>The Agent applies six validation rules in sequence. Any rule failure blocks the payment and generates a stop-payment alert. Payments may not bypass a failed rule without a documented override approved by the Controller.</p>
<table>
  <thead><tr><th>Rule</th><th>Description</th><th>Failure Action</th></tr></thead>
  <tbody>
    <tr><td>Invoice authorization</td><td>Every payment must have a corresponding approved invoice</td><td>Block payment — flag unauthorized</td></tr>
    <tr><td>Amount match</td><td>Payment amount must match approved invoice amount (±$0.01)</td><td>Block payment — variance alert</td></tr>
    <tr><td>Approval threshold</td><td>Payments above $50,000 require Controller pre-approval</td><td>Hold for approval</td></tr>
    <tr><td>Duplicate check</td><td>Same vendor, same amount within 30 days</td><td>Flag — manual confirmation required</td></tr>
    <tr><td>Bank account match</td><td>Payment bank account matches vendor master</td><td>Block — route to AP for verification</td></tr>
    <tr><td>New/changed vendor</td><td>Bank account changed within 90 days</td><td>Hold — require independent verification</td></tr>
  </tbody>
</table>

<h1>4. Duplicate & Fraud Detection</h1>
<p>The Agent runs a secondary duplicate scan using fuzzy matching on vendor name and amount to catch cases where a vendor has been entered under a slightly different name or code. All fuzzy matches are flagged for human review — the Agent does not automatically block on fuzzy matches. Results are included in the validation report with a confidence score for each flagged pair.</p>

<h1>5. Bank Account Verification</h1>
<p>Any vendor whose bank account was updated in the last 90 days is subject to an enhanced hold. The AP Analyst must confirm the new account details against a vendor-provided remittance document before the hold is released. The confirmation is logged with the analyst's name, document reference, and timestamp.</p>

<h1>6. Approval & Payment Authorization</h1>
<p>All validation results are presented to the authorized payment approver in a summary view before the payment file is released. The approver must confirm: no unresolved blocks exist, all flags have been reviewed, and the total payment amount matches the approved run total. Release is irreversible — once the file is transmitted to the bank, recalls require manual bank intervention.</p>
`

export const PLAYBOOK_CONTENT: Record<string, string> = {
  'pb-3': GRNI_ACCRUAL_CONTENT,
  'pb-4': AP_AGING_CONTENT,
  'pb-5': INVOICE_COMPLETENESS_CONTENT,
  'pb-6': AP_CUTOFF_CONTENT,
  'pb-7': THREE_WAY_MATCH_CONTENT,
  'pb-8': VENDOR_RECON_CONTENT,
  'pb-9': PAYMENT_RUN_CONTENT,
}

export const PLAYBOOK_TOC: Record<string, string[]> = {
  'pb-3': [
    '1. Role and Objective',
    '2. Required Input Data',
    '3. GRNI Identification Logic',
    '4. Output & JE Format',
    '5. Validation',
    '6. Exception Handling',
    '7. Approval & Posting',
    '8. Period-End Checklist',
  ],
  'pb-4': [
    '1. Role and Objective',
    '2. Required Input Data',
    '3. Aging Calculation Logic',
    '4. Duplicate Invoice Detection',
    '5. Output & Report Format',
    '6. Exception Handling',
    '7. Distribution & Sign-off',
  ],
  'pb-5': [
    '1. Role and Objective',
    '2. Required Input Data',
    '3. Completeness Match Logic',
    '3.1 Unmatched Invoice Handling',
    '4. Exception Workflow',
    '5. Output & Report',
    '6. Approval & Period-Close',
  ],
  'pb-6': [
    '1. Role and Objective',
    '2. Required Input Data',
    '3. Cutoff Determination Logic',
    '4. Exception Schedule',
    '5. Auditor Review & Approval',
  ],
  'pb-7': [
    '1. Role and Objective',
    '2. Required Input Data',
    '3. Match Tolerances',
    '4. Exception Workflow',
  ],
  'pb-8': [
    '1. Role and Objective',
    '2. Required Input Data',
    '3. Reconciliation Logic',
    '4. Discrepancy Resolution',
    '5. Output & Reconciliation Memo',
    '6. Approval & Signoff',
  ],
  'pb-9': [
    '1. Role and Objective',
    '2. Required Input Data',
    '3. Payment Validation Rules',
    '4. Duplicate & Fraud Detection',
    '5. Bank Account Verification',
    '6. Approval & Payment Authorization',
  ],
}

export const PENDING_APPROVAL_NOTES: Record<string, { submittedBy: string; submittedDate: string; note: string; reviewerName: string }> = {}

export interface TestStep {
  title: string
  detail: string
  link?: string
  type?: 'manual-check'       // amber badge + UserCheck icon in step list
  evidenceDialogId?: string   // triggers a required evidence review in the summary
}

export interface EvidenceDialogData {
  title: string
  intro: string
  tableHeaders: string[]
  tableRows: string[][]
  tableFootnote?: string
  confirmLabel: string
}

export interface TestRunData {
  steps: TestStep[]
  summary: {
    title: string
    bullets: string[]
    detailLabel: string
  }
  evidenceDialogs?: Record<string, EvidenceDialogData>
  approvalMessage?: {
    confirmWarning: string   // shown in the confirmation step before posting
    headline: string         // collapsible section header after posting
    body: string             // AI response body text
    attachment?: string      // file chip label
  }
}

export const PLAYBOOK_RUN_DATA: Record<string, TestRunData> = {
  'pb-1': {
    steps: [
      {
        title: 'Loaded Coupa Accruals Playbook',
        detail: 'Playbook loaded. Scope confirmed: unbilled vendor services, open POs past due, and prepaid amortization.',
        link: 'View',
      },
      {
        title: 'Retrieved 31 open POs from Coupa',
        detail: 'Step 1 of 5 complete. Retrieved 31 open POs from Coupa for March 2026.',
        link: 'View PO list',
      },
      {
        title: 'Identified 18 vendors with $987,400 in unbilled balances',
        detail: 'Step 2 of 5 complete. Identified 18 vendors with unbilled balances totaling $987,400.',
        link: 'View Vendor Breakdown',
      },
      {
        title: 'Accrual calculated across 27 POs. Total: $961,200',
        detail: 'Step 3 of 5 complete. Accrual calculated across 27 POs. Total: $961,200.',
      },
      {
        title: 'Compared to February baseline. 2 items flagged',
        detail: 'Step 4 of 5 complete. Compared to February baseline of $1,204,500. 2 items need your attention before you approve.\n\nDeloitte Advisory — accrual decreased by $118,000. February PO fully invoiced in March.\n\nTechServ Inc — accrual increased by $47,500. New PO opened March 14 with no invoice received.',
      },
      {
        title: 'Journal entries mapped to GL accounts across 3 entities',
        detail: 'Step 5 of 5 complete. Journal entries mapped to GL accounts across all 3 entities.',
      },
      {
        title: 'Run complete — 2 items flagged for review',
        detail: 'March 2026 Coupa accrual is ready for your review. The $243,300 decrease from February is explained by the Deloitte PO closing out. Both flagged items are consistent with March activity.',
      },
    ],
    summary: {
      title: 'Accrual Summary',
      bullets: [
        'Total accrual: $961,200',
        'Vendors included: 18 Entities — FQ US Holdings LLC, FQ US Operations Inc, FQ US Realty LLC',
        'Prior month: $1,204,500  ·  Change: −$243,300 (−20.2%)',
      ],
      detailLabel: 'View Accrual Detail',
    },
    approvalMessage: {
      confirmWarning: 'Approve and post journal entries to Close? This cannot be undone.',
      headline: 'Approval recorded — Journal entries posted to Close',
      body: 'Journal entries posted to Close for March 2026. Run complete. Run record is saved in your run history and available to export for audit documentation.',
      attachment: 'Journal Entry',
    },
  },
  'pb-7': {
    steps: [
      {
        title: 'Loaded Three-Way Match Review Playbook',
        detail: 'Playbook loaded. Scope confirmed: pending invoices from Coupa, open PO lines, and receiving records from ERP.',
      },
      {
        title: 'Retrieved 47 pending invoices from Coupa',
        detail: 'Step 1 of 5 complete. Retrieved 47 pending invoices from Coupa pending approval. Record count confirmed — no truncation detected.',
        link: 'View Invoice List',
      },
      {
        title: 'Matched 47 invoices to PO lines. 3 price variances detected',
        detail: 'Step 2 of 5 complete. Matched 47 invoices to 47 PO lines. Price variances found on 3 lines — all exceed the ±1% / $5.00 tolerance.',
        link: 'View PO Match',
      },
      {
        title: 'Confidence and benchmark validation passed — 44 of 47 above threshold',
        detail: 'Steps 3–4 of 5 complete. 44 of 47 matches exceeded the confidence threshold (94%). Deterministic benchmark check confirmed 5 of 5 sampled matches.',
        link: 'View Benchmark Detail',
      },
      {
        title: 'Verified quantities and payment terms across all matched lines',
        detail: 'Step 5 of 5 complete. 1 quantity variance detected (3 units short). All 47 invoice payment terms match agreed PO terms.',
        link: 'View Receiving Report',
      },
      {
        title: 'Exceptions routed. 3 items flagged for owner review',
        detail: '2 price variances routed to Procurement team. 1 quantity variance routed to Receiving Supervisor. 3 low-confidence matches routed to AP review queue.',
      },
      {
        title: 'Run complete — 3 exceptions flagged for review',
        detail: 'Three-Way Match is ready for your review. 3 exceptions require attention before payment authorization can proceed. 44 of 47 invoices matched without exception.',
      },
    ],
    summary: {
      title: 'Match Summary',
      bullets: [
        'Total invoices reviewed: 47',
        'Matched without exception: 44',
        'Exceptions flagged: 3 (2 price variance, 1 quantity variance)',
        'Routing: 2 to Procurement, 1 to Receiving Supervisor',
        'Confidence threshold pass rate: 44 of 47 (94%)',
      ],
      detailLabel: 'View Match Detail',
    },
    approvalMessage: {
      confirmWarning: 'Approve and route exceptions for payment processing? This cannot be undone.',
      headline: 'Approval recorded — Exceptions routed for review',
      body: '44 invoices approved for payment processing. 3 exceptions routed to owners for resolution. Run record is saved in your run history and available to export for audit documentation.',
      attachment: 'Match Report',
    },
  },
}

export const PLAYBOOK_TEST_RUN: Record<string, TestRunData> = {
  'pb-7': {
    steps: [
      {
        title: 'Loaded Three-Way Match Review Playbook',
        detail: 'Playbook loaded. Scope confirmed: pending invoices from Coupa, open PO lines, and receiving records from ERP. Run parameters, model configuration, and data provenance will be logged on completion.',
      },
      {
        title: 'ICFR reliance posture confirmed',
        detail: 'This run is classified as a reliance scenario: management will depend on agent output as evidence for the three-way match control\'s operating effectiveness. Evidence standards applied: documented prompt and configuration version, clear exception resolution, and retained audit artifacts.',
      },
      {
        title: 'SoD confirmed — creator is not the approver',
        detail: 'Role separation verified. Joseph Vu (creator) is not assigned as the approver for this agent. Sarah Chen holds the approver role. This satisfies COSO\'s segregation of duties requirement for automated transaction processing controls.',
      },
      {
        title: 'Retrieved 47 pending invoices from Coupa',
        detail: 'Step 1 of 7 complete. Retrieved 47 pending invoices from Coupa pending approval. Record count confirmed against Coupa export total — no truncation detected.',
        link: 'View Invoice List',
        type: 'manual-check',
        evidenceDialogId: 'invoice-data',
      },
      {
        title: 'Vendor and template pattern drift check passed',
        detail: 'Step 2 of 7 complete. Compared current invoice structures, vendor billing frequencies, and line-item templates against the prior period baseline. No structural changes detected across all 47 vendor templates. No pattern drift alerts triggered.',
      },
      {
        title: 'Matched 47 invoices to PO lines. 3 price variances detected',
        detail: 'Step 3 of 7 complete. Matched 47 invoices to 47 PO lines. Price variances found on 3 lines — all exceed the ±1% / $5.00 tolerance.',
        link: 'View PO Match',
      },
      {
        title: 'Confidence score validation passed — 44 of 47 above threshold',
        detail: 'Step 4 of 7 complete. Match confidence scores logged for all 47 invoice-to-PO matches. 44 of 47 (94%) exceeded the validated confidence threshold. 3 matches fell below threshold and were routed to the human review queue with full context attached.',
      },
      {
        title: 'Deterministic benchmark check passed — 5 of 5 sampled matches confirmed',
        detail: 'Step 5 of 7 complete. Re-performed matching logic on a sample of 5 invoice-PO pairs using a deterministic rule-based algorithm independent of the AI model. All 5 results were consistent with agent output. No discrepancies detected.',
        link: 'View Benchmark Detail',
      },
      {
        title: 'Verified quantities against 52 receiving records',
        detail: 'Step 6 of 7 complete. Verified quantities against 52 receiving records. 1 quantity variance detected exceeding the ±2% / 1-unit threshold.',
        link: 'View Receiving Report',
      },
      {
        title: 'Checked payment terms across all matched lines',
        detail: 'Step 7 of 7 complete. All 47 invoice payment terms match agreed PO terms. No exceptions.',
      },
      {
        title: 'Exceptions routed. 3 items flagged for owner review',
        detail: '2 price variances routed to Procurement team. 1 quantity variance routed to Receiving Supervisor. 3 low-confidence matches routed to AP review queue.',
        type: 'manual-check',
        evidenceDialogId: 'exception-routing',
      },
      {
        title: 'Run complete — 3 exceptions flagged for review',
        detail: 'Three-Way Match is ready for your review. 3 exceptions require attention before payment authorization can proceed. 44 of 47 invoices matched without exception. Bill of materials logged to Activity Log.',
      },
    ],
    summary: {
      title: 'Match Summary',
      bullets: [
        'Total invoices reviewed: 47',
        'Matched without exception: 44',
        'Exceptions flagged: 3 (2 price variance, 1 quantity variance)',
        'Routing: 2 to Procurement, 1 to Receiving Supervisor',
        'Confidence threshold pass rate: 44 of 47 (94%)',
        'Vendor/template drift: None detected',
        'Benchmark validation: 5 of 5 sampled matches confirmed',
      ],
      detailLabel: 'View Match Detail',
    },
    evidenceDialogs: {
      'invoice-data': {
        title: 'Invoice Data — 47 Records',
        intro: 'Review the invoices retrieved from Coupa. Confirm the record count and scope are correct before matching begins.',
        tableHeaders: ['Invoice ID', 'Vendor', 'PO Number', 'Amount', 'Status'],
        tableRows: [
          ['INV-2026-0891', 'Acme Corp', 'PO-89234', '$12,400.00', 'Pending'],
          ['INV-2026-0892', 'GlobalTech Ltd', 'PO-89235', '$8,750.00', 'Pending'],
          ['INV-2026-0893', 'SupplyBase Inc', 'PO-89236', '$3,200.00', 'Pending'],
          ['INV-2026-0894', 'Meridian Services', 'PO-89237', '$22,100.00', 'Pending'],
          ['INV-2026-0895', 'Apex Solutions', 'PO-89238', '$5,600.00', 'Pending'],
        ],
        tableFootnote: '42 additional records not shown. Total: 47 invoices, $284,350.00',
        confirmLabel: 'Confirm — record count and data scope are accurate',
      },
      'exception-routing': {
        title: 'Exception Routing — 3 Items',
        intro: 'Review the exception routing decisions. All items must be confirmed before payment authorization can proceed.',
        tableHeaders: ['Invoice ID', 'Exception Type', 'Variance', 'Assigned To'],
        tableRows: [
          ['INV-2026-0912', 'Price variance', '+$847 (2.3% above PO)', 'Procurement team'],
          ['INV-2026-0923', 'Price variance', '−$215 (1.8% below PO)', 'Procurement team'],
          ['INV-2026-0934', 'Quantity variance', '3 units short of receipt', 'Receiving Supervisor'],
        ],
        confirmLabel: 'Confirm — exception routing and escalation decisions are correct',
      },
    },
  },
}

// ─────────────────────────────────────────────
// Workflow canvas types & data
// ─────────────────────────────────────────────

export type WorkflowNodeType = 'data-transform' | 'human-review' | 'post-je' | 'notification'

export interface WorkflowControl {
  id: string          // e.g. 'C-TRF-01'
  title: string
  frequency: string
  enforcement: string
}

export interface WorkflowNode {
  id: string
  label: string
  type: WorkflowNodeType
  isStart?: boolean
  controls?: WorkflowControl[]
}

export interface WorkflowEdge {
  from: string
  to: string
  label?: string
}

export interface WorkflowDef {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

export const WORKFLOW_DATA: Record<string, WorkflowDef> = {
  'pb-2': {
    nodes: [
      {
        id: 'n1', label: 'Join prior accruals to actuals', type: 'data-transform', isStart: true,
        controls: [
          { id: 'C-ING-01', title: 'Source-to-landing reconciliation',  frequency: 'Daily',                  enforcement: 'Automated in product' },
          { id: 'C-TRF-03', title: 'Lineage capture & retention',       frequency: 'Multiple times per day', enforcement: 'Automated in product' },
        ],
      },
      {
        id: 'n2', label: 'Identify material variances', type: 'data-transform',
        controls: [
          { id: 'C-TRF-01', title: 'Transformation rule change review', frequency: 'As needed',              enforcement: 'Manual SOP' },
          { id: 'C-JDG-01', title: 'Explainability artifact on every output', frequency: 'Multiple times per day', enforcement: 'Automated in product' },
        ],
      },
      {
        id: 'n3', label: 'Summarize variances by account', type: 'data-transform',
        controls: [
          { id: 'C-TRF-02', title: 'Sample re-run validation',          frequency: 'Monthly',                enforcement: 'Automated in product' },
        ],
      },
      {
        id: 'n4', label: 'Upload variance summary to Reconciliation', type: 'data-transform',
        controls: [
          { id: 'C-TRF-03', title: 'Lineage capture & retention',       frequency: 'Multiple times per day', enforcement: 'Automated in product' },
          { id: 'C-ORC-01', title: 'Step failure alerting & SLA',       frequency: 'Multiple times per day', enforcement: 'Automated in product' },
        ],
      },
      {
        id: 'n5', label: 'Ask for Controller Approval', type: 'human-review',
        controls: [
          { id: 'C-PST-02', title: 'Pre-post human approval > $X',      frequency: 'Multiple times per day', enforcement: 'Hybrid' },
          { id: 'C-JDG-03', title: 'Edit-rate monitoring',              frequency: 'Daily',                  enforcement: 'Automated in product' },
          { id: 'C-GOV-01', title: 'Agent-change 2-person approval',    frequency: 'As needed',              enforcement: 'Hybrid' },
        ],
      },
      {
        id: 'n6', label: 'Post true-up journal entries', type: 'post-je',
        controls: [
          { id: 'C-PST-01', title: 'Posting authority matrix',          frequency: 'Multiple times per day', enforcement: 'Manual SOP' },
          { id: 'C-PST-02', title: 'Pre-post human approval > $X',      frequency: 'Multiple times per day', enforcement: 'Hybrid' },
        ],
      },
      {
        id: 'n7', label: 'Escalate material variances for review', type: 'notification',
        controls: [
          { id: 'C-ORC-01', title: 'Step failure alerting & SLA',       frequency: 'Multiple times per day', enforcement: 'Automated in product' },
        ],
      },
    ],
    edges: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4' },
      { from: 'n4', to: 'n5' },
      { from: 'n5', to: 'n6', label: 'Approved' },
      { from: 'n5', to: 'n7', label: 'Rejected' },
    ],
  },
}

// Maps playbook ID → section heading text → controls for that section
// Used by PlaybookViewer to inject control callout strips into the narrative document
export const PLAYBOOK_DOC_CONTROLS: Record<string, Record<string, WorkflowControl[]>> = {
  'pb-1': {
    '2. Required Input Data': [
      { id: 'C-ING-01', title: 'Source-to-landing reconciliation', frequency: 'Daily',                   enforcement: 'Automated in product' },
      { id: 'C-ING-02', title: 'Completeness check on ingestion',  frequency: 'Daily',                   enforcement: 'Hybrid' },
    ],
    '3. Core Processing Logic': [
      { id: 'C-TRF-01', title: 'Transformation rule change review', frequency: 'As needed',              enforcement: 'Manual SOP' },
      { id: 'C-TRF-03', title: 'Lineage capture & retention',       frequency: 'Multiple times per day', enforcement: 'Automated in product' },
    ],
    '3.3 Invoice Matching': [
      { id: 'C-TRF-02', title: 'Sample re-run validation',          frequency: 'Monthly',                enforcement: 'Automated in product' },
    ],
    '5. Validation': [
      { id: 'C-ING-02', title: 'Completeness check on ingestion',   frequency: 'Daily',                  enforcement: 'Hybrid' },
    ],
    '7. Approval & Posting': [
      { id: 'C-PST-01', title: 'Posting authority matrix',          frequency: 'Multiple times per day', enforcement: 'Manual SOP' },
      { id: 'C-PST-02', title: 'Pre-post human approval > $X',      frequency: 'Multiple times per day', enforcement: 'Hybrid' },
      { id: 'C-GOV-01', title: 'Agent-change 2-person approval',    frequency: 'As needed',              enforcement: 'Hybrid' },
    ],
  },

  'pb-3': {
    '2. Required Input Data': [
      { id: 'C-ING-01', title: 'Source-to-landing reconciliation', frequency: 'Daily',                   enforcement: 'Automated in product' },
      { id: 'C-ING-02', title: 'Completeness check on ingestion',  frequency: 'Daily',                   enforcement: 'Hybrid' },
    ],
    '3. GRNI Identification Logic': [
      { id: 'C-TRF-01', title: 'Transformation rule change review', frequency: 'As needed',              enforcement: 'Manual SOP' },
      { id: 'C-TRF-03', title: 'Lineage capture & retention',       frequency: 'Multiple times per day', enforcement: 'Automated in product' },
    ],
    '5. Validation': [
      { id: 'C-ING-02', title: 'Completeness check on ingestion',   frequency: 'Daily',                  enforcement: 'Hybrid' },
      { id: 'C-TRF-02', title: 'Sample re-run validation',          frequency: 'Monthly',                enforcement: 'Automated in product' },
    ],
    '7. Approval & Posting': [
      { id: 'C-PST-01', title: 'Posting authority matrix',          frequency: 'Multiple times per day', enforcement: 'Manual SOP' },
      { id: 'C-PST-02', title: 'Pre-post human approval > $X',      frequency: 'Multiple times per day', enforcement: 'Hybrid' },
    ],
  },

  'pb-4': {
    '2. Required Input Data': [
      { id: 'C-ING-01', title: 'Source-to-landing reconciliation', frequency: 'Daily',                   enforcement: 'Automated in product' },
      { id: 'C-ING-02', title: 'Completeness check on ingestion',  frequency: 'Daily',                   enforcement: 'Hybrid' },
    ],
    '3. Aging Calculation Logic': [
      { id: 'C-TRF-01', title: 'Transformation rule change review', frequency: 'As needed',              enforcement: 'Manual SOP' },
      { id: 'C-TRF-03', title: 'Lineage capture & retention',       frequency: 'Multiple times per day', enforcement: 'Automated in product' },
      { id: 'C-JDG-01', title: 'Explainability artifact on every output', frequency: 'Multiple times per day', enforcement: 'Automated in product' },
    ],
    '4. Duplicate Invoice Detection': [
      { id: 'C-TRF-02', title: 'Sample re-run validation',          frequency: 'Monthly',                enforcement: 'Automated in product' },
    ],
    '7. Distribution & Sign-off': [
      { id: 'C-PST-02', title: 'Pre-post human approval > $X',      frequency: 'Multiple times per day', enforcement: 'Hybrid' },
      { id: 'C-JDG-03', title: 'Edit-rate monitoring',              frequency: 'Daily',                  enforcement: 'Automated in product' },
    ],
  },

  'pb-5': {
    '2. Required Input Data': [
      { id: 'C-ING-01', title: 'Source-to-landing reconciliation', frequency: 'Daily',                   enforcement: 'Automated in product' },
      { id: 'C-ING-02', title: 'Completeness check on ingestion',  frequency: 'Daily',                   enforcement: 'Hybrid' },
    ],
    '3. Completeness Match Logic': [
      { id: 'C-TRF-01', title: 'Transformation rule change review', frequency: 'As needed',              enforcement: 'Manual SOP' },
      { id: 'C-TRF-03', title: 'Lineage capture & retention',       frequency: 'Multiple times per day', enforcement: 'Automated in product' },
    ],
    '4. Exception Workflow': [
      { id: 'C-ORC-01', title: 'Step failure alerting & SLA',       frequency: 'Multiple times per day', enforcement: 'Automated in product' },
    ],
    '6. Approval & Period-Close': [
      { id: 'C-PST-02', title: 'Pre-post human approval > $X',      frequency: 'Multiple times per day', enforcement: 'Hybrid' },
      { id: 'C-GOV-01', title: 'Agent-change 2-person approval',    frequency: 'As needed',              enforcement: 'Hybrid' },
    ],
  },

  'pb-6': {
    '2. Required Input Data': [
      { id: 'C-ING-01', title: 'Source-to-landing reconciliation', frequency: 'Daily',                   enforcement: 'Automated in product' },
      { id: 'C-ING-02', title: 'Completeness check on ingestion',  frequency: 'Daily',                   enforcement: 'Hybrid' },
    ],
    '3. Cutoff Determination Logic': [
      { id: 'C-TRF-01', title: 'Transformation rule change review', frequency: 'As needed',              enforcement: 'Manual SOP' },
      { id: 'C-JDG-01', title: 'Explainability artifact on every output', frequency: 'Multiple times per day', enforcement: 'Automated in product' },
    ],
    '4. Exception Schedule': [
      { id: 'C-TRF-03', title: 'Lineage capture & retention',       frequency: 'Multiple times per day', enforcement: 'Automated in product' },
      { id: 'C-ORC-01', title: 'Step failure alerting & SLA',       frequency: 'Multiple times per day', enforcement: 'Automated in product' },
    ],
    '5. Auditor Review & Approval': [
      { id: 'C-PST-01', title: 'Posting authority matrix',          frequency: 'Multiple times per day', enforcement: 'Manual SOP' },
      { id: 'C-PST-02', title: 'Pre-post human approval > $X',      frequency: 'Multiple times per day', enforcement: 'Hybrid' },
    ],
  },

  'pb-7': {
    '2. Required Input Data': [
      { id: 'C-ING-01', title: 'Source-to-landing reconciliation', frequency: 'Daily',                   enforcement: 'Automated in product' },
      { id: 'C-ING-02', title: 'Completeness check on ingestion',  frequency: 'Daily',                   enforcement: 'Hybrid' },
    ],
    '3. Match Tolerances': [
      { id: 'C-TRF-01', title: 'Transformation rule change review', frequency: 'As needed',              enforcement: 'Manual SOP' },
      { id: 'C-JDG-01', title: 'Explainability artifact on every output', frequency: 'Multiple times per day', enforcement: 'Automated in product' },
    ],
    '4. Exception Workflow': [
      { id: 'C-PST-02', title: 'Pre-post human approval > $X',      frequency: 'Multiple times per day', enforcement: 'Hybrid' },
      { id: 'C-ORC-01', title: 'Step failure alerting & SLA',       frequency: 'Multiple times per day', enforcement: 'Automated in product' },
      { id: 'C-GOV-01', title: 'Agent-change 2-person approval',    frequency: 'As needed',              enforcement: 'Hybrid' },
    ],
  },

  'pb-8': {
    '2. Required Input Data': [
      { id: 'C-ING-01', title: 'Source-to-landing reconciliation', frequency: 'Daily',                   enforcement: 'Automated in product' },
      { id: 'C-ING-02', title: 'Completeness check on ingestion',  frequency: 'Daily',                   enforcement: 'Hybrid' },
    ],
    '3. Reconciliation Logic': [
      { id: 'C-TRF-01', title: 'Transformation rule change review', frequency: 'As needed',              enforcement: 'Manual SOP' },
      { id: 'C-TRF-03', title: 'Lineage capture & retention',       frequency: 'Multiple times per day', enforcement: 'Automated in product' },
    ],
    '4. Discrepancy Resolution': [
      { id: 'C-JDG-01', title: 'Explainability artifact on every output', frequency: 'Multiple times per day', enforcement: 'Automated in product' },
      { id: 'C-ORC-01', title: 'Step failure alerting & SLA',       frequency: 'Multiple times per day', enforcement: 'Automated in product' },
    ],
    '6. Approval & Signoff': [
      { id: 'C-PST-01', title: 'Posting authority matrix',          frequency: 'Multiple times per day', enforcement: 'Manual SOP' },
      { id: 'C-PST-02', title: 'Pre-post human approval > $X',      frequency: 'Multiple times per day', enforcement: 'Hybrid' },
      { id: 'C-GOV-01', title: 'Agent-change 2-person approval',    frequency: 'As needed',              enforcement: 'Hybrid' },
    ],
  },

  'pb-9': {
    '2. Required Input Data': [
      { id: 'C-ING-01', title: 'Source-to-landing reconciliation', frequency: 'Daily',                   enforcement: 'Automated in product' },
      { id: 'C-ING-02', title: 'Completeness check on ingestion',  frequency: 'Daily',                   enforcement: 'Hybrid' },
    ],
    '3. Payment Validation Rules': [
      { id: 'C-TRF-01', title: 'Transformation rule change review', frequency: 'As needed',              enforcement: 'Manual SOP' },
      { id: 'C-JDG-01', title: 'Explainability artifact on every output', frequency: 'Multiple times per day', enforcement: 'Automated in product' },
    ],
    '4. Duplicate & Fraud Detection': [
      { id: 'C-TRF-02', title: 'Sample re-run validation',          frequency: 'Monthly',                enforcement: 'Automated in product' },
      { id: 'C-TRF-03', title: 'Lineage capture & retention',       frequency: 'Multiple times per day', enforcement: 'Automated in product' },
    ],
    '5. Bank Account Verification': [
      { id: 'C-ING-02', title: 'Completeness check on ingestion',   frequency: 'Daily',                  enforcement: 'Hybrid' },
    ],
    '6. Approval & Payment Authorization': [
      { id: 'C-PST-01', title: 'Posting authority matrix',          frequency: 'Multiple times per day', enforcement: 'Manual SOP' },
      { id: 'C-PST-02', title: 'Pre-post human approval > $X',      frequency: 'Multiple times per day', enforcement: 'Hybrid' },
      { id: 'C-GOV-01', title: 'Agent-change 2-person approval',    frequency: 'As needed',              enforcement: 'Hybrid' },
    ],
  },
}
