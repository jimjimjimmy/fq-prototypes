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
