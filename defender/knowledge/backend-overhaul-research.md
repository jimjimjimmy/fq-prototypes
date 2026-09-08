# Defender Backend Overhaul — Research Findings

**Created**: 2026-03-24
**Purpose**: Capture accounting anomaly research and Design Bar session insights used to design the v2 backend. This allows future sessions to resume implementation without re-doing the research.

---

## Design Bar Session Insights (from NotebookLM)

### Product Intent
- **Core purpose**: Transform FloQast from episodic (month-end only) to a **daily workflow** tool
- Enables anomaly detection on both balance sheet AND income statement accounts (expansion from prior scope)
- "Conveyor belt" metaphor: as transactions post to GL, they continuously flow through active rules

### Key Stakeholder Feedback
- **Steve (CFO)**: Risk score must be account-contextual. A $1M anomaly in an account that normally sees millions is LOW risk. A $1M anomaly in an account averaging $10k is CRITICAL risk. Aggregating at rule level breaks down.
- **Greg**: Landing page didn't make him feel "super defended." Too focused on red callouts vs. giving a high-level view that the system is protecting the books.
- **Benjamin**: Avoid showing raw numbers like "12,547 transactions scanned." Metrics should prove the system is reducing the team's workload (anomalies closed, time saved, etc.). Risk should trend over time, not just a static score.
- **Gaurav (PM)**: Process drift example — "FloQast" vendor booked to Finance & Accounting last month, Legal this month → system should flag that deviation automatically.

### Detection Layers
1. **Rule-based (prescriptive)**: Users define explicit rules (Amount > $1M, Missing PO, etc.)
2. **AI/statistical (descriptive)**: System catches "unknown unknowns" via Z-scores, Benford's Law, process drift
3. **Steve's point**: Customer feedback shows heavy demand for prescriptive detection — don't over-rotate to pure AI

### Key Workflows Confirmed
- Open → Investigating → Resolved status flow (Greg questioned forcing rigid statuses — future consideration)
- Dynamic assignment: anomalies assigned based on who owns the affected reconciliation/flux
- Collaborative sign-off: preparer signs off, reviewer countersigns per rule
- Activity log: fully auditable trail of all rule changes and transaction resolutions

---

## Accounting Anomaly Research

### Transaction-Level Patterns

**Large/unusual amounts**
- Risk is relative to vendor history and account baseline, not absolute amount
- Typical ERP approval tiers: $5k (dual approval), $10k (manager), $50k (VP), $100k (CFO)
- A $3k invoice from a $400-average vendor is more anomalous than a $50k invoice from a $45k-average vendor

**Round dollar amounts**
- `amount % 1000 === 0` at statistically anomalous rate vs. baseline
- Fraud cases: HealthSouth (thousands of JEs just below $5k), Satyam (27 false invoices all multiples of $5k)
- AU-C Section 240 explicitly requires auditors to check round-number JE frequency

**Threshold circumvention (splitting)**
- Multiple transactions clustered just below approval threshold
- Classic pattern: 4x $4,900 bills when threshold is $5,000
- Detection: sum by vendor + week, compare aggregate to threshold

**Weekend/after-hours transactions**
- Authorization controls relax, approval chains bypassed
- High-value (>$5k) outside business hours is disproportionately suspicious
- Friday afternoon large wire transfers: hard to reverse, oversight gaps

**Duplicate entries**
- Industries lose 0.1–0.5% of AP spend to duplicates
- Exact match: same vendor + same amount + same date = highest confidence
- Near match: same vendor + same amount ± 3 days = high confidence
- Invoice number variants: INV-1234 vs. INV1234 (formatting change)
- Amount with penny variance: $4,872.00 and $4,872.01 same vendor, 14 days apart

**Missing required fields**
| Field | Risk | Implication |
|---|---|---|
| No PO reference | High | PO bypass — goods/services unverified |
| No department code | Medium | Budget accountability gap |
| No approver | Critical | Segregation of duties violation |
| No attachment | High | Unsubstantiated expense |
| No vendor EIN/TIN | High | Ghost vendor indicator |
| Blank memo on JE | Medium-High | Fraud concealment |

**Post-close / period-end**
- Transactions entered after period close with a backdated GL date = most common financial statement manipulation vector
- Last 3 business days of period: 3x normal volume is suspicious; large round JEs in this window are top risk
- After-hours JEs (10pm–4am) by users who normally work 9–5

### Vendor Anomalies

**New vendor patterns**
- New vendor (< 30 days) + large first invoice (> $5k) = 3–5x higher fraud probability
- New vendor + no PO = very high risk
- New vendor + no EIN = critical
- New vendor + bank account added same day = block/review
- "No PO, no pay" is the gold standard control

**Employee-vendor match (ghost vendor signal)**
- Vendor address matches employee home address
- Vendor bank ACH matches employee direct deposit
- Vendor email is personal (gmail, yahoo)

**Unusual frequency/amount patterns**
- Vendor receiving same amount every 29–31 days = suspicious consistency
- Sudden spike: 2 invoices/year for 2 years, then 24 in 1 month
- Dormant vendor (> 12 months inactive) suddenly activated with large payment

### GL/Account Anomalies

**Misclassification**
- Capex coded to opex (or reverse) — affects EBITDA vs. balance sheet
- Personal expenses in "meals & entertainment," "office supplies," "miscellaneous"
- Same vendor with rotating GL accounts each month
- Large amounts in "suspense" or "clearing" accounts never resolved

**Segregation of duties violations**
- Same user created vendor + approved invoice + processed payment
- Same user entered JE + posted JE
- Approver approved their own expense
- User changed vendor bank account + processed next payment to that vendor

### Risk Scoring Approach

Composite score — combination factors multiply risk:
| Factor | Risk Weight |
|---|---|
| SOD violation | Very High (often auto-escalate) |
| New vendor + large payment | High |
| Threshold circumvention | High |
| Post-close entry | High |
| Round number JE at period end | High (combination amplifies) |
| Employee-vendor address match | Critical |
| Missing required fields | Medium |
| Weekend/holiday transaction | Low-Medium |
| Duplicate invoice indicators | Medium-High |
| PO bypass | Medium |

**Key insight**: Two "Low" signals on the same transaction often escalate to "Medium" or "High" — combination scoring is the key differentiator.

---

## The 10 Narrative Scenarios

These scenarios are embedded as real transaction records in db.json for demo use.

### Scenario 1 — The Duplicate Bill
**Story**: Apex IT Solutions submits bill INV-2847 ($3,450) on March 3 — paid March 8. On March 11, same vendor submits INV2847 (no hyphen) for same amount. AP doesn't catch the formatting variant.
**Records**: BILL-44200 (paid, Resolved) + BILL-44201 (Open, pending investigation)
**Comments**: Thread on BILL-44201 — "Reached out to vendor, confirmed INV-2847 already paid. Issuing stop payment."

### Scenario 2 — Threshold Creep
**Story**: Employee in procurement submits 4 POs to Pacific Consulting LLC (created 18 days ago, residential ZIP matches employee ZIP) in one week: $4,900 / $4,750 / $4,850 / $4,925. Approval threshold is $5,000. Total: $19,425. All marked "verbal PO."
**Records**: BILL-44210 through BILL-44213 (all Open)
**Comments**: "Third Pacific Consulting invoice this week under $5k. Escalating to Mike — looks like threshold splitting."

### Scenario 3 — The Sleeping Accrual
**Story**: $75,000 accrual for "Q3 Marketing Consultant Services" posted Jan 31. Never reversed in February. New $75,000 accrual posted Feb 28. Original sits in accrued liabilities for 60+ days — no vendor invoice ever arrives.
**Records**: JE-22900 (Jan, Resolved — the accrual) + JE-22901 (Feb, Open — the duplicate)
**Comments**: "Why is this accrual still open? No vendor invoice received. Escalating to controller."

### Scenario 4 — The Ghost Vendor
**Story**: Meridian Business Services added Jan 4 (P.O. Box, Nevada, no EIN, gmail email). Receives 3 invoices of $7,500 each in January — all for "Business Consulting Services," no PO, no attachment. Adding user and approving user report to same manager.
**Records**: BILL-44100, BILL-44101, BILL-44102 (all Open)
**Comments**: "Meridian has no EIN on file, a P.O. Box address in Nevada, and a gmail contact. Flagging for vendor master review before any further payment."

### Scenario 5 — The Expense Double-Dip
**Story**: Employee submits expense report Feb 14 with a Marriott receipt ($342) for a Chicago client visit (Feb 10). Same receipt re-submitted March 2 in a new report with date altered to Feb 28 and city changed to Denver. Two different approving managers.
**Records**: EXP-00150 (Feb, Resolved) + EXP-00151 (Mar, Open)
**Comments**: "Receipt looks like the same Marriott stay as EXP-00150 in February. Merchant, amount, and last 4 card digits match. Requesting explanation from employee."

### Scenario 6 — The Friday Wire
**Story**: Friday March 21 at 4:47pm — $48,500 wire to Global Tek Innovations (vendor created March 17, bank account added March 17). No PO, no attachment. Processed before anyone reviews the weekend queue.
**Record**: PAY-33400 (Open)
**Comments**: "CFO verbal approval documented: this was pre-authorized by Steve verbally. But the vendor was created same day as the bank account — need vendor master vetting."

### Scenario 7 — The Capex Misclassification
**Story**: $180,000 server purchase coded to 6420-IT Operating Supplies (opex, normal monthly spend $4,200). Should be coded to 1700-Computer Equipment (capex, depreciated over 5 years). Entered by AP clerk, not controller. Reduces this year's taxable income by $180k instead of $36k/year.
**Record**: BILL-44220 (Investigating)
**Comments**: "Controller: confirmed this is a physical Dell server purchase, incorrectly coded by AP. Correcting to 1700-Computer Equipment. Corrected JE attached."

### Scenario 8 — The Credit Memo Cover-Up
**Story**: AP coordinator processes $12,000 payment to vendor X. Same day, issues $12,000 credit memo against a different legitimate vendor's invoice. No attachment on credit memo. Net AP balance unchanged, but $12k flows to suspicious vendor.
**Records**: PAY-33410 (Open) + CM-11200 (Open)
**Comments**: "Credit memo description says 'pricing adjustment per negotiation' — no supporting document. Credit memo same day as payment is unusual. Flagging for review."

### Scenario 9 — The Post-Close Adjustment
**Story**: March period closes April 3. On April 5, a $95,000 JE is entered with GL date March 31 (backdated). Debit Deferred Revenue / Credit Product Revenue — recognizes $95k of April revenue in March. Entered by finance team member who doesn't normally post JEs.
**Record**: JE-22910 (Open, isPostClose=true, glDate=2026-03-31, enteredDate=2026-04-05)
**Comments**: "This JE was flagged automatically — entered after period close with a backdated GL date. Escalated to Controller for review before sign-off."

### Scenario 10 — The Vendor Flip
**Story**: Southwest Office Supplies — legitimate vendor for 3 years. Someone (different employee than usual contact) edits their bank account routing on March 15. A $34,000 payment processes March 19 — 4 days after the change. Classic business email compromise / insider fraud pattern.
**Record**: PAY-33420 (Open)
**Comments**: "Vendor bank account was changed 4 days before this payment processed. Change was made by user ID emp-044 — not the usual vendor contact emp-019. Escalating immediately."

---

## Insights Panel — 12 Pre-Computed Records

| # | Type | Title | Severity | Key Detail |
|---|---|---|---|---|
| 1 | benford | First-digit anomaly in Vendor Bills | high | Excess of 4s and 9s — threshold-straddling behavior across 8 transactions |
| 2 | zscore | Pacific Consulting payment velocity | high | 4.2σ above vendor baseline — first payment within 2 days of creation |
| 3 | process_drift | FloQast Inc department routing change | medium | Finance & Accounting → Legal (Feb 2026), 3 transactions, $28,450 |
| 4 | zscore | Meridian Business Services early velocity | critical | 5.1σ above new-vendor baseline — 3 invoices in first 18 days |
| 5 | benford | February JE leading-digit distribution | medium | Anomalous first-digit pattern — possible earnings management signal |
| 6 | velocity | Global Tek Innovations — large payment day 4 | critical | $48,500 payment 4 days after vendor creation — fastest in dataset |
| 7 | process_drift | 6420 IT Operating Supplies volume spike | high | $180,000 single transaction vs. $4,200 monthly average — 42x normal |
| 8 | zscore | Pacific Consulting invoice clustering | high | 4 invoices in 7-day window, all < $5k approval threshold |
| 9 | benford | Expense report amount clustering | low | Leading digits cluster at 4s, 7s, 9s — threshold-aware behavior |
| 10 | process_drift | Southwest Office Supplies bank change | critical | Account changed 4 days before $34,000 payment — BEC pattern match |
| 11 | velocity | March period-end JE concentration | medium | 7 of 15 March JEs posted in last 3 business days |
| 12 | zscore | Post-close JE revenue recognition | critical | $95,000 JE entered April 5, backdated to March 31 — 1 of 1 post-close entries |
