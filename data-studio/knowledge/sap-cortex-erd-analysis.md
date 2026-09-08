# SAP S/4HANA & ECC — Cortex ERD Analysis for FloQast Integration

**Context:** A customer is using Google Cloud Cortex Framework (v5.4) to replicate SAP data into BigQuery. This analysis covers the underlying SAP base tables, how they map to Cortex reporting views, and what matters for FloQast's core use cases (close, reconciliation, flux, compliance).

**Date:** March 18, 2026

---

## How to Read the Cortex ERD

The Cortex ERD uses a color-coded legend:

| Symbol | Meaning |
|--------|---------|
| (no color) | **Base tables** — raw CDC replicas from SAP |
| (green) | **Reporting views** — pre-joined, consumer-ready |
| (blue) | **Utility / BQML views** — ML models, clustering |
| **L** | Contains language field (multi-language support) |
| **S/4** | Different structure for S/4HANA vs ECC |
| **M** | Contains MANDT (SAP client ID) — multi-tenant |
| **EXT** | Populated by external source or DAG, not SAP CDC |
| **T** | Materialized view (pre-computed) |
| **$** | Multiple currencies affect grain (important for FX) |

---

## Base Tables — Deep Analysis

### Tier 1: Core Accounting (must-have)

These are the tables every FloQast use case depends on.

**BKPF — Accounting Document Header**
- One row per accounting document
- Key fields: company code, document number, fiscal year, posting date, document type, reference number, ledger group
- This is the "envelope" for every financial posting in SAP
- **S/4 note:** Still exists in S/4HANA but ACDOCA is the primary source. BKPF becomes a compatibility view.

**BSEG — Accounting Document Line Items**
- One row per line item within a document
- Key fields: GL account, debit/credit amount, cost center, profit center, tax code, assignment, text, local/document/group currency amounts
- This is where the actual debits and credits live
- **S/4 note:** Same as BKPF — replaced by ACDOCA in S/4. BSEG becomes a compatibility view with performance limitations.

**ACDOCA — Universal Journal (S/4HANA only)**
- Replaces BKPF + BSEG + all sub-ledger tables in S/4HANA
- Single table containing GL, AR, AP, AA, CO, and ML postings in one row
- Key fields: everything from BKPF and BSEG combined, plus controlling fields (cost center, profit center, functional area, segment) that were previously in separate CO tables
- **This is the most important table for S/4 customers.** If the customer is on S/4, you'd query ACDOCA instead of BKPF+BSEG.

**SKA1 — GL Account Master (Chart of Accounts level)**
- One row per GL account per chart of accounts
- Key fields: account number, account type (P&L vs. BS), account group
- This defines what each account *is*

**SKAT — GL Account Text**
- Language-dependent descriptions for GL accounts
- Key fields: chart of accounts, account number, language key, short/medium/long text
- Need this to display readable account names

---

### Tier 2: Sub-Ledger Tables (reconciliation)

These are critical for subledger-to-GL reconciliation workflows.

**BSID — Customer Open Items (AR)**
- Open (unpaid) customer line items
- Key fields: customer number, company code, document number, posting date, amount, due date
- **S/4 note:** In S/4HANA, BSID doesn't exist as a real table. Open items are derived from ACDOCA with clearing status. Cortex abstracts this via CustomerOpenItems_BSID view.

**BSAD — Customer Cleared Items (AR)**
- Cleared (paid/matched) customer line items
- Same structure as BSID but for items that have been applied
- **S/4 note:** Same as BSID — derived from ACDOCA in S/4.

**BSIK — Vendor Open Items (AP)**
- Open (unpaid) vendor line items
- Key fields: vendor number, company code, document number, posting date, amount, due date, payment terms
- **S/4 note:** Same pattern — compatibility view on ACDOCA.

**BSAK — Vendor Cleared Items (AP)**
- Cleared (paid) vendor line items
- Same structure as BSIK

**RBKP — Vendor Invoice Header (Logistics Invoice Verification)**
- Header for incoming vendor invoices
- Key fields: invoice number, vendor, posting date, gross amount, company code

**RSEG — Vendor Invoice Line Items**
- Line items for vendor invoices, links to PO
- Key fields: PO number, PO line item, amount, quantity, material

**RBCO — Invoice Account Assignment**
- Account assignment for vendor invoice line items
- Key fields: GL account, cost center, order number

---

### Tier 3: Organizational & Master Data (dimensional)

These are lookup/dimension tables needed to make the transactional data meaningful.

**T001 — Company Codes**
- One row per company code (= FQ entity)
- Key fields: company code, company name, country, currency, chart of accounts, fiscal year variant
- **This is how you map SAP orgs to FloQast entities**

**TKA02 — Controlling Area to Company Code Assignment**
- Links controlling areas to company codes
- Needed if customer uses multiple controlling areas

**T009 / T009B — Fiscal Year Variant & Period Definition**
- T009: fiscal year variant definition (e.g., "K4" = calendar year)
- T009B: period definitions within each variant — maps calendar dates to fiscal periods
- **Critical for FloQast** — this defines what "Period 3" or "Q1" means for each customer

**TCURC / TCURX / TCURT — Currency Master**
- TCURC: currency codes
- TCURX: decimal places per currency (JPY=0, USD=2, etc.) — affects how you interpret amount fields
- TCURT: currency text descriptions

**FAGL_011PC / FAGL_011ZC — Financial Statement Version Assignments**
- Maps GL accounts to FSV nodes (how accounts roll up into BS/P&L structure)
- FAGL_011PC: standard FSV assignment
- FAGL_011ZC: additional FSV assignment
- **This defines the account hierarchy** — e.g., "Account 100000 rolls up to Current Assets -> Total Assets"

**FAGL_011QT — FSV Node Texts**
- Language-dependent text for each FSV node
- Key fields: FSV key, node, language, text

**CEPC / CEPCT — Profit Center Master**
- CEPC: profit center definition
- CEPCT: profit center text (language-dependent)

**CSKS / CSKT — Cost Center Master**
- CSKS: cost center definition
- CSKT: cost center text (language-dependent)

**SETHEADERT — Hierarchy Set Headers**
- Backs the flattened cost center and profit center hierarchies
- Used by Cortex to build CostCenterHierarchiesMD and ProfitCenterHierarchiesMD

**KNA1 — Customer Master (General)**
- One row per customer
- Key fields: customer number, name, country, industry

**LFA1 — Vendor Master (General)**
- One row per vendor
- Key fields: vendor number, name, country, industry

**ADRC / ADRCT / ADR6 — Address Master**
- ADRC: address data
- ADRCT: address text
- ADR6: email addresses
- Referenced by both customer and vendor master

---

### Tier 4: Procurement & Sales (secondary for FloQast)

Less likely needed for core close/rec, but relevant for AP/AR detail.

**EKKO / EKPO — Purchase Order Header & Line Items**
- EKKO: PO header (vendor, date, org data)
- EKPO: PO line items (material, quantity, price)

**EKKN — PO Account Assignment**
- Links PO lines to GL accounts, cost centers

**EKBE — PO History (Goods Receipt / Invoice Receipt)**
- Tracks GR and IR against PO lines — key for 3-way match

**EKET — PO Schedule Lines**
- Delivery schedule against PO lines

**VBAK / VBAP — Sales Order Header & Line Items**
- VBAK: SO header
- VBAP: SO line items

**VBRK / VBRP — Billing Document Header & Line Items**
- Billing/invoicing documents on the sales side

**LIKP / LIPS — Delivery Header & Line Items**
- Shipping/delivery documents

---

## ECC vs. S/4HANA: The Critical Fork

| Area | ECC | S/4HANA |
|---|---|---|
| **GL postings** | BKPF (header) + BSEG (line items) | **ACDOCA** (universal journal, single table) |
| **AR open items** | BSID (real table) | Derived from ACDOCA (BSID is a compatibility view) |
| **AR cleared items** | BSAD (real table) | Derived from ACDOCA |
| **AP open items** | BSIK (real table) | Derived from ACDOCA |
| **AP cleared items** | BSAK (real table) | Derived from ACDOCA |
| **Subledger totals** | GLT0, KNC1/3, LFC1/3 (aggregate tables) | Eliminated — calculated on the fly from ACDOCA |
| **Controlling** | COEP, COSS, COSP (separate CO tables) | Merged into ACDOCA |

**The implication:** If you build against BKPF+BSEG, it works for both ECC and S/4 (via compatibility views), but on S/4 you'd be leaving performance on the table. Building against ACDOCA is better for S/4 but doesn't exist in ECC.

If the customer is on **Cortex**, this is largely abstracted — the reporting views handle the ECC/S/4 difference. But if you're building a direct connector or need to understand what's underneath, this fork matters.

---

## Cortex Reporting Views — Mapping to Base Tables

| Cortex Reporting View | Underlying SAP Tables | FloQast Use Case |
|---|---|---|
| **FinancialStatement** | BKPF, BSEG, FAGL_011PC/ZC, SKA1, T001, fiscal_date_dim (or ACDOCA on S/4) | Trial Balance, GL |
| **BalanceSheet** | FinancialStatement + Language_T002, CurrencyConversion, FSVTextsMD, GLAccountsMD | Balance Sheet reporting by FSV node |
| **ProfitAndLoss** | FinancialStatement + Language_T002, CurrencyConversion, FSVTextsMD, GLAccountsMD, CompaniesMD | P&L reporting by FSV node |
| **AccountingDocumentsReceivable** | AccountingDocuments + CustomersMD + CompaniesMD | AR reconciliation |
| **CustomerOpenItems_BSID** | BKPF + BSEG (or ACDOCA on S/4) | AR aging, open items |
| **CustomerClearedItems_BSAD** | BKPF + BSEG (or ACDOCA on S/4) | AR cleared items |
| **AccountsPayable** | CurrencyConversion, AccountingDocuments, InvoiceDocuments_Flow, CompaniesMD, VendorConfig, PurchaseDocumentsHistory, VendorsMD | AP reconciliation |
| **AccountsPayableTurnover** | Derived from AccountsPayable | AP aging/turnover metrics |
| **DaysPayableOutstanding** | AccountsPayable + InventoryKeyMetrics | AP metrics |
| **GLAccountsMD** | SKA1, SKAT | Chart of accounts |
| **CompaniesMD** | T001, TKA02 | Entity mapping |
| **FSVTextsMD** | FAGL_011QT | Account hierarchy labels |
| **CostCenterHierarchiesMD** | SETHEADERT, CSKS | Cost center hierarchy |
| **ProfitCenterHierarchiesMD** | SETHEADERT, CEPC | Profit center hierarchy |
| **CurrencyConversion** | TCURC, TCURX, TCURT | FX rates |
| **FiscalPeriod** | T009B, T009 | Fiscal calendar |

---

## FloQast Integration — Priority Table Stack

| FloQast Use Case | Primary Cortex Views | Key SAP Tables Behind Them |
|---|---|---|
| **Trial Balance / GL** | FinancialStatement, GLAccountsMD | BKPF, BSEG, SKA1, FAGL_011PC/ZC (or ACDOCA on S/4) |
| **Reconciliation (GL-to-subledger)** | AccountingDocumentsReceivable, CustomerOpenItems_BSID, CustomerClearedItems_BSAD, AccountsPayable | BSID, BSAD, BSIK, BSAK, BKPF, BSEG |
| **Balance Sheet / P&L** | BalanceSheet, ProfitAndLoss, FSVTextsMD | FinancialStatement + FSV hierarchy (FAGL_011QT) |
| **Flux Analysis** | FinancialStatement, ProfitAndLoss, BalanceSheet | Period-over-period on the above |
| **Entity mapping** | CompaniesMD | T001 (company code) |
| **Account hierarchy** | FSVTextsMD, CostCenterHierarchiesMD, ProfitCenterHierarchiesMD | FAGL_011QT, SETHEADERT |
| **FX / Multi-currency** | CurrencyConversion, CurrenciesMD | TCURC, TCURX, TCURT |
| **Fiscal periods** | FiscalPeriod, FiscalDateDim | T009B, T009 |
| **AP aging / turnover** | AccountsPayable, AccountsPayableTurnover, DaysPayableOutstanding | BKPF, BSEG, RBKP, RSEG |

---

## Recommended Integration Approach

For a customer on Cortex, a **two-layer strategy**:

**Layer 1: Cortex reporting views** (fast path, covers 80% of use cases)
- FinancialStatement, BalanceSheet, ProfitAndLoss — TB, BS, P&L
- AccountsPayable, AccountingDocumentsReceivable — Rec support
- CompaniesMD, GLAccountsMD, FSVTextsMD — Dimensions

**Layer 2: Base CDC tables** (when you need granularity Cortex views don't provide)
- ACDOCA or BKPF+BSEG — individual journal entries for rec detail
- BSID/BSAD or BSIK/BSAK — open/cleared item detail for aging
- FAGL_011PC/ZC — custom FSV hierarchy mapping

### Key Considerations

1. **Cortex is a BigQuery layer, not a direct SAP connection.** The connector would point at BigQuery, not SAP directly. This is simpler than a direct SAP integration.

2. **The reporting views (green) are pre-joined and consumer-friendly.** Target those first rather than the raw base tables.

3. **Multi-currency is complex.** The $ symbol on several tables means currency creates additional grain. FinancialStatement has currency_decimal and multiple currency fields — you'll need to decide which currency representation to use (local, group, transaction).

4. **Hierarchies matter.** CostCenterHierarchiesMD and ProfitCenterHierarchiesMD are flattened views — these map to how customers typically structure their FloQast account hierarchies.

5. **FSV (Financial Statement Version) defines the account rollup structure.** This maps directly to how FloQast customers set up their account hierarchies. If you're pulling TB data, FSV defines the grouping.

6. **This is Cortex v5.4** — Cortex is actively maintained by Google, so the schema may evolve. Confirm which version the customer is on.
