# AI Field Mapping Editor

| Field | Value |
|-------|-------|
| **Status** | DRAFT |
| **Last updated** | 2026-06-11 |
| **Owner** | Alex Kearns |
| **Target release** | 2026-09-30 |
| **Epic** | *(link to epic)* |
| **Idea Link** | IDEA-2627 |
| **Document status** | DRAFT |
| **Document owner** | @Alex Kearns |
| **Designer** | Natasha Clark |
| **Tech lead** | *(assign)* |
| **Technical writers** | *(assign)* |
| **QA** | *(assign)* |
| **Depends on** | Sub-PRD 2a: Field Mapping — Visual Refresh + AI-Suggested Mappings (6/30) must be complete |
| **Sub-PRDs** | [Mapping Expressions v2](https://floqast.atlassian.net/wiki/spaces/Data/pages/4594892801/Mapping+Expressions+v2) · [Data Test](https://floqast.atlassian.net/wiki/spaces/Data/pages/4622778629/Test+Mapping+Expressions+Q3+2026) |
| **Related PRDs** | [QBO Mapping Functions (RBC)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4484530409/QBO+Transformation+Functions+DRAFT) |

---

## Objective

The AI Field Mapping Editor is the Q3 capability that meaningfully expands Data Studio's existing mapping foundation — taking field mapping from "a pipeline of basic transforms" to "define how data is shaped, validated, and ready to use." It builds on a Mapping Builder that already exists in production, with a function library, CASE_WHEN/IF_THEN conditional logic, Data Preview, and ENUM support. Q3 delivers three additions on top of that foundation:

- **AI-assisted authoring** — Admins can describe what they need in plain language, an Excel formula, or SQL, and AI generates the mapping expression. This is net-new; today there is no AI-assisted authoring in the mapping experience.

- **Expanded function library + expression composition** — Date extraction functions, string manipulation additions (REPLACE, REGEXP_EXTRACT, REGEXP_REPLACE, TO_TITLE_CASE), COALESCE, NULLIF, arithmetic operators, and enhanced CONCATENATE with literal support. Critically, Q3 also resolves a structural limitation of the current Mapping Builder: today, string transforms and conditional logic cannot be composed together (e.g., you cannot apply a string function inside a CASE_WHEN branch). Q3 introduces proper expression nesting that removes this constraint.

- **Data Test** — A model-level test surface distinct from the existing per-field Data Preview. Admins can test the complete model against live data or a sample file, select specific rows to target, and navigate directly from a surfaced error to the affected field mapping row — before publishing.

Together these capabilities give admins confidence in their models before they go live — closing the gap between "I set up the mapping" and "I know the mapping is correct."

This PRD covers the overarching objective, key benefits, use cases, and scope. Detailed requirements and acceptance criteria are in the sub-PRDs linked above.

---

## Definitions

See [Definitions & Terms](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409) for shared terminology used across the Data Studio PRD suite.

---

## Why This Is Important

Data Studio already ships a Mapping Builder with a meaningful function library — string operations, type casting, conditional logic (CASE_WHEN, IF_THEN), ENUM support, and a per-field Data Preview. That foundation covers a real set of use cases. But it has three gaps that limit what admins can actually accomplish on their own.

**The composition gap.** The Mapping Builder's current model is linear: functions are chained sequentially, and string transforms cannot be used inside conditional branches. An admin who needs to normalize values from a date field into an integer year today must chain `SAFE_CAST_STRING() | LEFT(4) | SAFE_CAST_INT()` rather than use a single date extraction function. More importantly, string transforms and conditional logic cannot be mixed in one expression — you can transform a value, or branch on it, but not both in the same step.

**The function library gap.** Date extraction (`EXTRACT_YEAR`, `EXTRACT_MONTH`, `EXTRACT_DAY`, `FIRST_DAY_OF_MONTH`, etc.), advanced string functions (`REPLACE`, `REGEXP_EXTRACT`, `REGEXP_REPLACE`, `TO_TITLE_CASE`), multi-source null coalescing, arithmetic operators, and enhanced concatenation with literals are all absent. These gaps produce workarounds — or escalations to engineering.

**The authoring and validation gap.** There is no AI assistance in the mapping experience today; admins must know function syntax or search documentation. And the Data Preview only shows the first 5 rows of a sample file — scoped to a single field's pipeline, not the full model. Admins have no way to validate the complete mapped output before publishing. The consequences show up downstream: data quality failures in Close, Flux, and other FQ products. RBC has called out testing as a high-friction point in her current workflow. Marty Mammel (Reporting team, May 2026): *"Data type mismatch as an error message is very opaque and hard to determine how to fix the error. The mapping rules have similarly difficult to understand errors like 'Cannot proceed: failed to apply SAFE_CAST_STRING'."* Admins cannot self-diagnose failures without escalating to engineering.

The AI Field Mapping Editor addresses all three: expression composition that removes the Mapping Builder's structural constraint, an expanded function library, AI-assisted authoring, and a model-level Data Test surface that gives admins confidence before publish.

---

## Key Benefits

| Benefit                            | Description                                                                                                                                                                                                                |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AI-assisted mapping authoring**  | Admins describe what they need in plain language, an Excel formula, or SQL — AI generates the mapping expression. No need to learn function syntax or file a support ticket                                                |
| **Comprehensive function library** | Date extraction, COALESCE, NULLIF, REGEXP_EXTRACT, REPLACE, TO_TITLE_CASE, arithmetic operators, and enhanced CONCATENATE with literal support expand what admins can express — without workarounds or engineering support |
| **Row filtering**                  | Admins define which source rows are included in a model — equivalent to a SQL WHERE clause — with support for equality, IN, comparison, null checks, pattern matching, AND/OR logic, and parameterized date values         |
| **Test against real data**         | Live data option surfaces production-like edge cases that uploaded sample files miss — reducing surprise failures at publish time                                                                                          |
| **Confidence before publishing**   | Admins see both raw source values and computed mapped output side by side, with inline error detail and a direct path back to fix affected field mapping rows                                                              |
| **Sample file path**               | Enables testing before live data has flowed — useful for implementation partners validating a new customer's model during initial setup, before the connector has ingested real data                                       |

---

## Use Cases

### AI-assisted date format conversion

An admin needs to convert a source date field from `MM/DD/YYYY` to ISO format for a date-typed FQ target field. Rather than looking up function syntax, the admin opens the AI Chat panel on the field mapping row, describes the conversion in plain language, and AI generates `SAFE_CAST_DATE(source_date, 'MM/DD/YYYY')`. The admin sees a preview of the output against sample data and applies it.

### Conditional logic without engineering support

An admin needs to normalize a transaction type field across 8–10 source values to FQ standard labels (e.g., `FinChrg` → `Finance Charge`, `VendBill` → `Vendor Bill`). CASE_WHEN already exists in the Mapping Builder, but authoring 8–10 branches manually is error-prone and time-consuming. The admin describes the rule to AI Chat in plain language — "map these source values to these FQ labels" — and AI generates the full CASE_WHEN expression. The admin reviews the branches, makes any corrections, and applies it without filing a support ticket.

### Many-to-one field combination

An admin has selected first name and last name as source fields for a single target field (using the many-to-one capability from PRD 2a). They now need to define how those fields are combined. Today, CONCATENATE_COLUMNS only supports columns — no literals — so adding a space between the two fields isn't possible. With Q3's enhanced CONCATENATE supporting literals, the admin defines the combination with a space literal between the two columns, previews the output, and applies.

### Pre-publish validation with targeted row testing

Before publishing, an admin opens the test panel and runs the model against live data for a specific as-of date. They use row selection to target a handful of records known to have unusual values — null vendor IDs, multi-currency amounts — and verify the mapping expressions handle them correctly. One row surfaces a type coercion error; the admin clicks "Fix this," corrects the expression, and re-runs without reconfiguring the test.

### Enum field validation across a wide row sample

An admin is mapping a source field to a FQ target field that only accepts a defined set of values (an enum). With the current test experience showing only the first 5–6 rows, they have no way to know whether the full range of source values in production will pass validation — some values may exist only in specific periods, entities, or transaction types. By selecting a broader and more representative set of rows to test against, the admin can surface enum mismatches before publishing and correct the mapping expression (e.g., using CASE_WHEN to normalize unexpected values) before any data reaches downstream products.

### Setup validation before live data flows

An implementation partner is setting up a new customer's GL transaction model, sourced from the customer's ERP via SFTP. The customer hasn't pushed their first real file yet — the connector is configured, the sample file has been uploaded, and the field mappings are defined, but no live data has flowed. The admin uses the sample file path to validate the mapping logic against the uploaded sample before go-live — the same sample-first approach that works in the existing Data Preview, now extended to the full model.

---

## Success Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| **Self-service mapping rate** | % of complex mappings (requiring expression logic) completed without engineering support ticket | Track from launch; establish baseline in beta |
| **AI suggestion acceptance rate** | % of AI-generated mapping expressions applied without modification | 60%+ |
| **Pre-publish error discovery rate** | % of mapping errors caught in the test surface vs. discovered post-publish | Increase vs. baseline |
| **Median time to publish** | Median time from model creation to first successful publish | Decrease vs. baseline |

---

## Assumptions

- Sub-PRD 2a (Field Mapping — Visual Refresh + AI-Suggested Mappings, 6/30) is complete — the field mapping grid, AI-suggested source-to-target mappings, many-to-one source field selection, and custom fields are already delivered when this ships
- **Applies to all model types** — including dimension-type models. A dimension is a model, built with the same Sources → Field Mappings → Versions structure. Whether accessed via the Catalog tab or the Dimensions tab, the Field Mappings sub-tab and all capabilities in this PRD are identical
- Mapping logic requires explicit save — admins save after configuring and previewing an expression
- Mapping expressions are read-only when a model is in Published state; editing requires moving the model to Draft first
- Test access is admin-only — admins are trusted users in a configuration context; source values are not masked in the test panel
- The function library is FQ-managed, not user-extensible, for Q3
- **Field mapping is intra-row only** — joins between source datasets are handled upstream in Source Datasets / Model Config; aggregations (SUM / COUNT / AVG / GROUP BY) are out of scope and addressed in a separate sub-PRD (2c — Aggregations)

---

## Scope

### Already Available in Production

The following capabilities exist in the current Mapping Builder and are not part of Q3 delivery:

**Function library (current)**
- String: `TRIM_SPACES`, `TO_UPPER`, `TO_LOWER`, `SPLIT_COLUMN`, `SUBSTRING` (fixed length), `LEFT`, `RIGHT`, `CONCATENATE_COLUMNS` (columns only — no literals)
- Null handling: `DEFAULT_VALUE` (null → literal fallback)
- Type casting: `SAFE_CAST_STRING`, `SAFE_CAST_INT`, and other SAFE_CAST variants

**Conditional logic (current)**
- `CASE_WHEN` — multi-branch conditional with AND/OR condition groups, ENUM-constrained output for enum-typed target fields, optional Else
- `IF_THEN` — single-condition variant
- Condition operators: exact string match (case-sensitive), numeric comparisons (`>`, `>=`, `<`, `<=`), string not equal, regex match

**Chaining and preview (current)**
- Mapping Builder — functions chained sequentially via `|` operator; reorderable, removable
- Data Preview — first 5 rows of sample file, scoped to a single field's pipeline; "Run Preview" shows original → final value

**Known limitations of current state**
- Mapping Builder's chaining model is linear — string transforms cannot be composed inside CASE_WHEN branches
- `CONCATENATE_COLUMNS` does not support literals (e.g., cannot add a space between first + last name)
- `SUBSTRING` requires a fixed, known character length — breaks for variable-length strings
- No date extraction functions — extracting a 4-digit year requires a 3-step workaround (`SAFE_CAST_STRING | LEFT(4) | SAFE_CAST_INT`)
- Data Preview shows first 5 rows only; no row selection, no live data

---

### Q3 Net-New (9/30)

**Mapping Expressions (see sub-PRD for full requirements)**
- AI Chat panel — natural language, Excel formula, and SQL/regex mapping authoring; net-new, no AI authoring exists today
- Expression nesting support — up to 5 levels deep, resolving the Mapping Builder's current composition limitation
- **New functions:**
  - Date: `EXTRACT_DAY`, `EXTRACT_MONTH`, `EXTRACT_YEAR`, `FIRST_DAY_OF_MONTH`, `LAST_DAY_OF_MONTH`, `DATE_FROM_PARTS`, `FORMAT_DATE`
  - String: `REPLACE`, `REGEXP_EXTRACT`, `REGEXP_REPLACE`, `TO_TITLE_CASE`, `EXTRACT_JSON_FIELD`
  - Numeric: `FORMAT_NUMBER`, arithmetic operators (`+`, `-`, `*`, `/`)
  - Null handling: `COALESCE` (first non-null across multiple columns), `NULLIF`
  - Concatenation: enhanced `CONCATENATE_COLUMNS` with literal support
  - Constant: `CONSTANT`
- Row filtering (WHERE conditions) — equality, not-equal, IN, comparison, IS NULL / IS NOT NULL, LIKE / NOT LIKE / ILIKE, AND/OR logic, parenthesized condition groups, parameterized date values, common filter templates (NetSuite, Coupa)
- Mapping validation — syntax errors, type mismatches, null handling

**Data Test (see sub-PRD for full requirements)**
- Model-level test panel — distinct from the per-field Data Preview; accessible from the Field Mappings tab; presentation (inline, split-view, drawer, or modal) is a design decision
- Two-section results layout: Raw Source Data + Mapped Output
- Field-level mapping expression detail in expanded row view (directional, pending Mapping Expressions UI evolution)
- Two-path data source model: sample file + live data (selectable)
- Row selection — user-chosen rows, not fixed first-N
- Error surfacing per field with "Fix this" CTA navigating to the affected field mapping row
- Publish flow — mandatory field validation, Effective Date prompt, Draft → Active transition

### Out of Scope

- Field mapping grid UI redesign — targeted in PRD 2a (6/30)
- AI-suggested source-to-target mappings — targeted in PRD 2a (6/30)
- Many-to-one source field selection UI — targeted in PRD 2a (6/30)
- Custom field creation — targeted in PRD 2a (6/30)
- Aggregation (SUM / COUNT / AVG / GROUP BY) — separate sub-PRD 2c, also Q3-targeted
- Versioning mechanics beyond the publish action (Draft creation from Published, version-merge semantics, rollback) — separate PM workstream, Sub-PRD 4
- Testing against live data from a source not yet synced
- Non-admin access to the test panel — post-Q3 (see Data Explorer PRD)
- Sensitive column error handling (masking raw values in error detail) — post-Q3
- Cross-connection JOINs (joining tables across two different source connections) — post-Q3
- User-extensible custom functions — post-Q3
- Data Explorer tab content and layout — separate sub-PRD

---

## References

### Sub-PRDs

| PRD | Description | Target |
|-----|-------------|--------|
| [Mapping Expressions v2](https://floqast.atlassian.net/wiki/spaces/Data/pages/4594892801/Mapping+Expressions+v2) | AI Chat panel, function library expansion, expression nesting, row filtering | 9/30 |
| [Data Test](https://floqast.atlassian.net/wiki/spaces/Data/pages/4622778629/Test+Mapping+Expressions+Q3+2026) | Test panel, data source selection, row selection, error handling, publish flow | 9/30 |

### Related Sub-PRDs (Model Creation Suite)

- [Overview & Index](https://floqast.atlassian.net/wiki/spaces/Data/pages/4444455089)
- [1 of 4: Model Creation & Source Configuration](https://floqast.atlassian.net/wiki/spaces/Data/pages/4450189505)
- [2a of 4: Field Mapping — Visual Refresh + AI-Suggested Mappings (6/30)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449927443)
- [4 of 4: Versioning & Lifecycle](https://floqast.atlassian.net/wiki/spaces/Data/pages/4443013309)

### Related PRDs

- [QBO Mapping Functions (RBC)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4484530409/QBO+Transformation+Functions+DRAFT)

---

## Future Considerations

- **Dimension resolution preview** — For models with fields linked to a dimension sourced from a separate file, show in the test results whether each source value resolves to a matching entry in the dimension table. Values with no match would be flagged inline, giving admins referential integrity checking at test time — before publish causes unmatched rows to silently produce nulls downstream. Post-Q3; depends on dimension data being queryable at test time and on the dimension linkage model being stable.
- **Aggregations** — SUM / COUNT / AVG / GROUP BY support in mapping expressions; architecturally distinct because aggregation reshapes the row-set. Addressed in parallel sub-PRD 2c (also Q3-targeted).
- **Pattern-based mapping rules** — Define a rule once and apply it to all fields matching a pattern (e.g., "all date fields use ISO format").
- **User-extensible function library** — Allow admins to define custom functions; deferred to post-Q3.
- **Extended Data Preview** — The current per-field Data Preview is limited to the first 5 rows of a sample file. A future enhancement could allow admins to test against more sample rows or a selectable row range — bridging the gap between the lightweight in-builder preview and the full model-level Data Test. Post-Q3.

---

### Other References

- [Definitions & Terms](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409)
- Design Resources — *(placeholder)*
- Engineering References — *(placeholder)*
