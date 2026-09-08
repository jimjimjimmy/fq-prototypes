# Mapping Expressions v2

> **Supersedes:** Model Creation 2 of 4: Field Mapping (DRAFT) · Field Mapping — AI Assisted Transformation Functions (DRAFT). Both prior pages are marked deprecated and link forward here.

| Field                 | Value                                                                                                                                                                                                                                                                                                                                                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Status**            | DRAFT                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Last updated**      | 2026-06-11                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Owner**             | Alex Kearns                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Target release**    | 2026-09-30                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Epic**              | *(link to epic)*                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Idea Link**         | *(assign)*                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Document status**   | DRAFT                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Document owner**    | @Alex Kearns                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Designer**          | @Natasha Clark                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Tech lead**         | *(assign)*                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Technical writers** | *(assign)*                                                                                                                                                                                                                                                                                                                                                                                                                |
| **QA**                | *(assign)*                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Depends on**        | *(none)*                                                                                                                                                                                                                                                                                                                                                                                                                  |
| **Related sub-PRDs**  | [1 of 4: Model Creation & Source Configuration](https://floqast.atlassian.net/wiki/spaces/Data/pages/4450189505) · [2a of 4: Field Mapping (6/30)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449927443) · [3 of 4: Testing & Publishing](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449468593) · [4 of 4: Versioning & Lifecycle](https://floqast.atlassian.net/wiki/spaces/Data/pages/4443013309) |
| **Related PRDs**      | [QBO Transformation Functions (RBC)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4484530409/QBO+Transformation+Functions+DRAFT)                                                                                                                                                                                                                                                                                  |

---

## Objective

This PRD covers the AI-assisted mapping logic layer for field mappings within Data Studio's Model Lineage capability. Mapping logic defines how source field values are converted into FQ target field values — enabling data normalization, format conversion, conditional logic, and multi-field combination.

This document was split from the original Field Mapping PRD (2 of 4) to allow the field mapping grid redesign and AI-suggested mappings to ship first. PRD 2a: Field Mapping — Visual Refresh + AI-Suggested Mappings (target 6/30) is targeted to deliver the redesigned mapping grid, AI-suggested source-to-target mappings, many-to-one source field selection, and custom fields. This PRD (2b, target 9/30) builds on that foundation by adding mapping logic definition — both manual function-based logic and AI-assisted natural language authoring via the AI Chat Modal.

The AI Chat Modal (or floating panel) is the primary AI interaction surface for this PRD, enabling admins to describe mappings in natural language and have AI generate the corresponding expressions. This is the "core AI interaction model" identified during prototype exploration.

---

## Definitions

See [Definitions & Terms](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409) for shared terminology used across the Model Creation PRD suite.

---

## Why This Is Important

Mapping logic is what turns simple field mappings into powerful data normalization. A foundation already exists — type casting, string operations (LEFT, RIGHT, TRIM, SPLIT_COLUMN, etc.), conditional logic (CASE_WHEN, IF_THEN), ENUM support, and a per-field Data Preview. But the gaps between what's available and what real customer data normalization requires are significant.

**Current experience limitations:**

Despite the existing foundation, the current implementation lacks:

- **Limited conditional logic** — CASE_WHEN and IF_THEN exist, but the functions needed inside branches are missing (e.g., no date format conversion functions), and the Mapping Builder's chaining model prevents string transforms from being composed inside conditional branches — so rules like "if country = US, format this date as MM/DD/YYYY; otherwise use YYYY-MM-DD" still can't be expressed
- **AI-assisted authoring** — admins must know function syntax to define mappings; there is no natural language interface
- **Combination logic for many-to-one mappings** — PRD 2a (6/30) is targeted to deliver the ability to select multiple source fields for a single target, but the concatenation/combination logic that defines how those fields are merged requires the mapping editor delivered in this PRD
- **Inline validation** — the existing Data Preview shows output against 5 sample rows, but errors (type mismatches, null handling issues, syntax errors) are only visible when a preview is manually run. There is no proactive inline validation surfaced on the field mapping row itself — meaning errors that could be caught early are often discovered only at publish or runtime

The AI Chat Modal is the "core AI interaction model" from the prototype exploration. It enables business users to describe mappings in plain language ("combine first name and last name with a space between them", "convert MM/DD/YYYY to ISO format") and have AI generate the expression — unlocking true self-service for non-technical users.

---

## Key Benefits

| Benefit                                | Description                                                                                                                                                                                                          |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AI-assisted mapping logic**          | Reduces need for engineering support on complex normalization rules — admins can define mappings with AI assistance instead of filing support tickets                                                                |
| **Natural language mapping authoring** | Empowers business users to define mapping logic without technical expertise — describe what you want in plain language, AI generates the expression                                                                  |
| **Expanded function library**          | Date formatting, enhanced Concatenate with literal support, numeric rounding, REGEXP_EXTRACT, COALESCE, NULLIF, and arithmetic operators expand what admins can express — without workarounds or engineering support |
| **Inline mapping validation** | Syntax errors, type mismatches, and null handling issues are surfaced directly on the field mapping row — not just at publish time or when manually running a preview                                                                       |

---

## Use Cases

### UC1 — Date format conversion

An admin needs to convert a date field from the source format (e.g., `MM/DD/YYYY`) to the FQ target format (`YYYY-MM-DD`). The admin opens the mapping editor on the field mapping row and either selects the Date format function from the library or invokes the AI assistant and describes the conversion in plain language. The expression is previewed against sample data before applying.

### UC2 — Natural language mapping authoring

An admin needs to define a complex mapping but does not know the function syntax. The admin invokes the AI Chat Modal from the field mapping row, describes the mapping in plain language (e.g., "strip the dollar sign, convert to a number, and round to two decimal places"), and AI generates the expression. The admin previews the output and applies it.

### UC3 — Many-to-one concatenation logic

An admin has already selected multiple source fields for a single target field (using the many-to-one UI targeted in PRD 2a). Now the admin needs to define how those fields are combined — for example, concatenating first name and last name with a space delimiter. The admin uses the mapping editor or AI assistant to define the concatenation expression.

### UC4 — Conditional logic with date formatting

An admin needs to apply conditional logic combined with date formatting — for example, "if the source field 'country' equals 'US', format the date as MM/DD/YYYY; otherwise use YYYY-MM-DD." CASE_WHEN already exists for the branching, but FORMAT_DATE (net-new in Q3) is needed inside the branch. The admin defines this using CASE_WHEN with FORMAT_DATE expressions in each branch, or describes the rule in natural language via the AI assistant.

### UC5 — Applying an existing function

An admin needs to normalize a text field by converting all values to uppercase. The admin opens the mapping editor, browses or searches the function library, selects `TO_UPPER`, configures the parameters, and saves. No AI assistance needed for this straightforward use case.

### UC6 — Previewing a mapping

An admin has defined a mapping expression (manually or via AI) and wants to verify it produces the expected output before applying it. The admin clicks "Preview" and sees the mapping output against sample source data. If the output is incorrect, the admin iterates on the expression.

---

## Success Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| **Median time to define a mapping** | Median time from opening mapping editor to valid expression saved | Decrease vs baseline (measure in beta) |
| **AI suggestion acceptance rate** | % of AI-generated mapping expressions accepted without modification | 60%+ |
| **Self-service mapping rate** | % of mappings completed without engineering support ticket | Track from launch |
| **Post-publish mapping errors** | Number of mapping-related errors surfaced after publish | Decrease vs baseline |

---

## Assumptions

- PRD 2a (6/30) is complete — field mapping grid, AI-suggested mappings, many-to-one selection, and custom fields are already delivered
- The function library is FQ-managed, not user-extensible (pending OQ-8)
- AI mapping suggestions are context-aware — they consider the source field data type, target field data type, and sample values
- The AI Chat Modal (or floating panel) is the primary AI interaction surface for this PRD
- Mapping logic requires explicit save — admins save after configuring and previewing an expression
- **Field mapping is intra-row only** — joins between source datasets are handled upstream in the Source Datasets / Model Config layer, not in this PRD. Aggregations (SUM / COUNT / AVG / GROUP BY) are also out of scope here — they reshape the row-set rather than apply per-row mapping logic and are scoped in a separate sub-PRD (2c — Aggregations)
- **Display formatting** — display formatting of native-typed target fields belongs to the application layer, not the mapping layer. Mapping only formats values as part of string composition via `FORMAT_DATE` and `FORMAT_NUMBER`. Target fields typed as DATE, DECIMAL, INTEGER, etc., are stored as native types; the app layer renders them for display
- **CONSTANT vs. DEFAULT_VALUE** — `CONSTANT` always writes a configured literal to every record regardless of source value. `DEFAULT_VALUE` writes a configured literal only when the source field is null or empty. These are distinct functions with distinct semantics; the AI Chat must surface the right one based on user intent

---

## Scope

### In Scope (9/30)

- Per-row mapping logic editor (manual functions and AI-assisted)
- AI Chat Modal / floating panel for natural language, Excel formula, and SQL/regex mapping authoring
- Supported function library definition (extending existing functions + new: enhanced CONCATENATE_COLUMNS with literal support, Date format conversion, Numeric rounding/truncation, FORMAT_NUMBER, FORMAT_DATE, REGEXP_EXTRACT, REGEXP_REPLACE, REPLACE, COALESCE, NULLIF, CONSTANT, EXTRACT_DAY, EXTRACT_MONTH, EXTRACT_YEAR, FIRST_DAY_OF_MONTH, LAST_DAY_OF_MONTH, DATE_FROM_PARTS, TO_TITLE_CASE, EXTRACT_JSON_FIELD, arithmetic operators (`+`, `-`, `*`, `/`))
- Expression nesting support — using the output of one function as the argument to another, capped at 5 levels deep (resolved OQ-10)
- Row filtering (WHERE conditions) — equality, not-equal, IN, comparison operators, IS NULL / IS NOT NULL, LIKE / NOT LIKE / ILIKE, AND/OR logic, parenthesized condition groups, parameterized date values, common filter templates (NetSuite, Coupa)
- Mapping validation (syntax errors, type mismatches, null handling)

### Out of Scope

- Field mapping grid UI redesign — targeted in PRD 2a (6/30); note that adding the mapping expression editor, AI Chat entry point, and inline validation will likely require incidental UI changes to the grid — these are expected and in scope as needed
- AI-suggested source-to-target mappings — targeted in PRD 2a (6/30)
- Many-to-one source field selection UI — targeted in PRD 2a (6/30)
- Custom field creation — targeted in PRD 2a (6/30)
- Testing mappings against live data — Sub-PRD 3
- Publishing — Sub-PRD 3
- Aggregation (SUM / COUNT / AVG / GROUP BY) — scoped in parallel Sub-PRD 2c (Aggregations), still Q3-targeted
- User-extensible custom functions — deferred (see OQ-8)
- Simple source dataset joins (INNER JOIN / LEFT JOIN) — conditionally in scope only if required for Transform parity; not planned for Q3 unless that analysis confirms a gap
- Cross-connection JOINs — joining tables across two different source connections; post-Q3
- Multi-condition JOINs with function expressions in the join condition; post-Q3
- Reusable named lookup tables — Lookup/reference is inline {key: value} sugar over CASE_WHEN, not a first-class reusable asset (resolved 2026-05-18). Reusable named lookup tables are post-Q3
- `POSITION()` function — addressable via REGEXP_EXTRACT for Q3 use cases
- Array indexing in EXTRACT_JSON_FIELD (e.g., `'items[0].name'`) — single-key and dot-path syntax are in scope; array indexing is post-Q3

---

## Requirements Quick Reference

| ID | Requirement | Priority |
|----|-------------|----------|
| FM5-LC | Define Mapping Logic (AI & Functions) | High |
| FM5a-LC | AI Chat Modal for Mapping Authoring | High |
| FM5b-LC | Function Library | High |
| FM5c-LC | Mapping Preview & Validation | Medium |
| FM5d-LC | Row Filtering (WHERE Conditions) | High |

---

## Detailed Requirements

### FM5-LC — Define Mapping Logic (AI & Functions)

**User Story:** As an admin, I want to define mapping logic for a field mapping so that source values are converted to the correct format and structure for FQ target fields.

**Importance:** High

**Details:** Each field mapping row in the grid supports an optional mapping expression. The admin can define mappings using the function library (manual) or via AI-assisted natural language authoring. Mapping logic supports both 1-to-1 and many-to-one source field mappings. Expressions require explicit save. Invalid logic is flagged before publish.

**Acceptance Criteria:**

- **AC-FM5-01 — Mapping editor accessible per row**
  - Given I am on the Field Mappings tab
  - When I select a field mapping row
  - Then I can access a mapping editor for that row

- **AC-FM5-02 — Manual function-based logic**
  - Given I have opened the mapping editor for a field mapping row
  - When I want to define a mapping manually
  - Then I can select from the supported function library and configure parameters

- **AC-FM5-03 — AI-assisted mapping logic**
  - Given I have opened the mapping editor for a field mapping row
  - When I want AI to help define a mapping
  - Then I can invoke the AI Chat Modal / floating panel and describe the mapping in natural language

- **AC-FM5-04 — Mapping logic explicitly saved**
  - Given I have defined a mapping expression for a field mapping row
  - When I explicitly save after configuring and previewing
  - Then the expression is saved to the field mapping row

- **AC-FM5-05 — Invalid logic flagged before publish**
  - Given I have defined a mapping expression that contains errors (syntax, type mismatch, null handling)
  - When I save or attempt to publish
  - Then the errors are flagged inline on the field mapping row

---

### FM5a-LC — AI Chat Modal for Mapping Authoring

> **Note:** The direction for AI-assisted authoring is set — admins should be able to describe mappings in their own terms and have AI generate the expression. The specific interaction model, input modes, and UX details below are directional starting points. They will be refined through design iteration and user testing before requirements are finalized.

**User Story:** As an admin, I want to describe mappings in my own terms — whether natural language, an Excel formula, or a SQL expression — and have AI generate the equivalent mapping so I don't need to learn a new function syntax.

**Importance:** High

**Details:** The AI Chat Modal (or floating panel) is one of two parallel entry points to mapping authoring — alongside the visual Builder. Both converge on the same mapping expression: the Builder provides a guided, step-by-step interface; the Chat accepts free-form input. The Chat recognizes three input modes: natural language descriptions, Excel formulas, and SQL/regex expressions. In all cases, the AI translates the input into a valid Data Studio mapping expression, shows the translation explicitly, and previews output against sample data. If the input maps to an unsupported function, the AI returns the closest supported approximation and explains the difference. The builder and chat are bidirectionally synced — manual edits in the builder are reflected in the chat state.

**Acceptance Criteria:**

- **AC-FM5a-01 — Invoke AI from field mapping row**
  - Given the mapping editor is open for a field mapping row
  - When I click the AI assist button
  - Then the AI Chat Modal / floating panel opens, contextualized to that field mapping row

- **AC-FM5a-02 — Describe mapping in natural language**
  - Given the AI Chat Modal / floating panel is open
  - When I describe the desired mapping in plain language (e.g., "convert MM/DD/YYYY to ISO format")
  - Then AI generates a mapping expression based on my description

- **AC-FM5a-03 — Iterate on AI suggestion**
  - Given AI has suggested a mapping expression
  - When I provide follow-up instructions (e.g., "also handle nulls", "add a default value")
  - Then AI refines the expression based on my feedback

- **AC-FM5a-04 — Preview AI suggestion before applying**
  - Given AI has generated a mapping expression
  - When I review the suggestion
  - Then I see a preview of the output against sample source data before applying

- **AC-FM5a-05 — Applied expression saved to mapping row**
  - Given I accept an AI-generated mapping expression
  - When I click "Apply" (or equivalent action)
  - Then the expression is saved to the field mapping row

- **AC-FM5a-06 — Excel formula input recognized and translated**
  - Given the AI Chat Modal is open
  - When I enter an Excel formula (e.g., `=RIGHT(A1, 3)` or `=TEXTAFTER(A1, ":", -1)`)
  - Then the AI recognizes it as an Excel formula and translates it to the equivalent Data Studio mapping function(s)
  - And the translation is shown explicitly before the preview (e.g., "Recognized an Excel formula. Here's how it maps: Step 1 — SPLIT_COLUMN(field, ':', -1)")
  - And a preview of the output is shown against sample source data

- **AC-FM5a-07 — SQL and regex expression input recognized and translated**
  - Given the AI Chat Modal is open
  - When I enter a SQL expression or regex pattern
  - Then the AI recognizes it as a technical expression and maps it to the equivalent Data Studio function
  - And the translation is shown explicitly before the preview

- **AC-FM5a-08 — Closest approximation when formula maps to unsupported function**
  - Given I have entered a formula or expression in the AI Chat Modal
  - When the formula maps to a function not currently in the Data Studio library
  - Then the AI returns the closest supported approximation
  - And explains what differs from the original formula (e.g., "Your formula uses TEXTAFTER with last-occurrence support. We've approximated this with SPLIT_COLUMN(field, ':', -1) — review the preview to confirm the output matches your expectation")

- **AC-FM5a-09 — Bidirectional sync between chat and builder**
  - Given a mapping has been generated via AI Chat and applied to the builder
  - When I manually edit the mapping steps in the builder
  - Then the AI Chat Modal reflects the updated mapping state
  - And subsequent chat interactions build on the current builder state, not the originally generated expression

---

### FM5b-LC — Function Library

**User Story:** As an admin, I want access to a comprehensive set of mapping functions so I can handle various data normalization needs.

**Importance:** High

**Details:** The function library defines the supported set of mapping functions available in the mapping editor. It includes all existing functions plus new functions needed for complex data normalization. Each function has documentation including name, description, parameter definitions, return type, and example usage. The library is browsable and searchable from the mapping editor.

**Cross-ref:** QBO Transformation Functions (RBC) defines the QBO-specific function set. This PRD's function library is a superset that includes QBO functions and extends to other sources.

**Date handling principle:** Date values should be stored as date types in target fields. Display formatting is the responsibility of the application layer, not the mapping layer. The one exception is `FORMAT_DATE`, which is valid when a date must be embedded within a string field — for example, combining a description field with a formatted date to produce a transaction label like "Invoice Payment — 04/30/26". `FORMAT_DATE` should not be used to populate date-typed target fields — use `SAFE_CAST_DATE` for those.

**Acceptance Criteria:**

- **AC-FM5b-01 — Existing functions remain available**
  - Given I open the mapping editor
  - When I browse or search the function library
  - Then all current functions are available: `TO_UPPER`, `TO_LOWER`, `SAFE_CAST_*`, Strip Currency Symbols, `RIGHT`, `LEFT`, `SUBSTRING`, `SPLIT_COLUMN`, `DEFAULT_VALUE`, `TRIM_SPACES`
  - And `SPLIT_COLUMN` supports index `-1` to return the last segment; if the delimiter does not match or the index is out of range, the output is null and a warning is logged

- **AC-FM5b-02 — New functions available**
  - Given I open the mapping editor
  - When I browse or search the function library
  - Then the following new functions are available: enhanced CONCATENATE_COLUMNS (with literal support), Date format conversion, Numeric rounding/truncation, FORMAT_NUMBER, FORMAT_DATE, REGEXP_EXTRACT, REGEXP_REPLACE, REPLACE, COALESCE, NULLIF, CONSTANT, EXTRACT_DAY, EXTRACT_MONTH, EXTRACT_YEAR, FIRST_DAY_OF_MONTH, LAST_DAY_OF_MONTH, DATE_FROM_PARTS, TO_TITLE_CASE, EXTRACT_JSON_FIELD
  - And arithmetic operators are available: `+`, `-`, `*`, `/`

- **AC-FM5b-03 — Function documentation**
  - Given I view a function in the library
  - When I inspect its details
  - Then I see the function name, description, parameter definitions, return type, and example usage

- **AC-FM5b-04 — Library browsable and searchable**
  - Given I am in the mapping editor
  - When I want to find a function
  - Then I can browse the full function library or search by name/keyword

- **AC-FM5b-05 — REGEXP_EXTRACT available**
  - REGEXP_EXTRACT accepts a source field, a regex pattern, and an optional capture group index (default: full match)
  - If the pattern does not match, the output is null and a warning is logged without halting the mapping

- **AC-FM5b-06 — SPLIT_COLUMN last-segment support**
  - Given I configure SPLIT_COLUMN with index `-1`
  - When the mapping runs against a source field with a variable number of segments
  - Then the last segment is returned regardless of total segment count

- **AC-FM5b-07 — CONSTANT function available**
  - `CONSTANT` accepts a literal string value defined at configuration time
  - The configured value is written to every record regardless of source field value
  - This behavior is distinct from `DEFAULT_VALUE`, which applies only when the source field is null or empty

- **AC-FM5b-08 — Date part extraction available**
  - `EXTRACT_MONTH`, `EXTRACT_YEAR`, and `EXTRACT_DAY` each accept a date-typed source field and return an integer (month: 1–12; year: e.g., 2026; day: 1–31)
  - These can be used independently across multiple mapping rows that share a single source date field (e.g., one source date → three target rows producing discrete year / month / day columns)

- **AC-FM5b-09 — String cleanup functions available**
  - `REPLACE` accepts a source field, a literal find string, and a replacement string
  - `REGEXP_REPLACE` accepts a source field, a regex pattern, and a replacement string
  - Both handle cases where source field values contain formatting characters (commas, quotes, parentheses) that prevent correct type casting

- **AC-FM5b-10 — COALESCE available**
  - `COALESCE` accepts two or more source fields and returns the first non-null value
  - If all inputs are null, the output is null
  - Distinct from `DEFAULT_VALUE` (null → constant) — COALESCE evaluates fields in sequence

- **AC-FM5b-11 — FORMAT_DATE available (string composition only)**
  - `FORMAT_DATE` accepts a date-typed source field and an output format string (e.g., `'MM/DD/YY'`, `'YYYY-MM-DD'`)
  - Output is a string — intended only for cases where a date must be embedded within a string value
  - Should not be used to populate date-typed target fields — use `SAFE_CAST_DATE` for those

- **AC-FM5b-12 — TO_TITLE_CASE available**
  - Accepts a source string field and returns it with the first letter of each word capitalized (equivalent to SQL `INITCAP`)
  - Can be chained with `REPLACE` to handle separators (e.g., underscores → spaces after casing)

- **AC-FM5b-13 — EXTRACT_JSON_FIELD available**
  - Accepts a JSON/semi-structured source field and a path expression, returning the value at that path as a string
  - Supports single-key form (`'memo'`) and dot-path form (`'group.name'`)
  - If any key along the path does not exist, output is null and a warning is logged
  - Result can be chained with type casting functions
  - Array indexing within the path (e.g., `'items[0].name'`) is out of scope for Q3

- **AC-FM5b-14 — IF_THEN condition operators**
  - Supported operators: `=`, `!=`, `>`, `>=`, `<`, `<=`, `IN`, `NOT IN`, `LIKE`, `NOT LIKE`, `ILIKE`, `IS NULL`, `IS NOT NULL`
  - Conditions can be combined with AND and OR logic, including parenthesized condition groups
  - True/false branch may be any function expression (not limited to literals or single-field references) — resolves OQ-13

- **AC-FM5b-15 — CONCATENATE_COLUMNS available (spec gap SG1 resolved)**
  - Accepts N inputs (≥ 2) in any combination of source fields, literal strings, and function expressions
  - Inputs concatenated left-to-right; literal separators are positional arguments
  - Null inputs treated as empty strings by default
  - Result can be chained with other string functions or wrapped in IF_THEN/CASE_WHEN

- **AC-FM5b-16 — CASE_WHEN multi-branch conditional**
  - Accepts an arbitrary number of (condition, expression) pairs plus an optional ELSE expression
  - Conditions reuse the same operator set as IF_THEN (including AND/OR and parenthesized groups)
  - Branch expressions follow same rules as IF_THEN branches (any function expression allowed)
  - Evaluation is short-circuit — first matching branch wins; if no branch matches and no ELSE, output is null
  - Canonical use: NetSuite transaction-type normalization with 8–10+ branches without burning expression-nesting budget

- **AC-FM5b-17 — Arithmetic operators (spec gap SG2 resolved)**
  - Operators: `+`, `-`, `*`, `/`
  - Operands can be source fields, literal numeric values, or function expressions
  - Null operands propagate (any null input → result is null); use `COALESCE(field, 0)` for explicit null-to-zero coercion
  - Type rules: decimal + integer → decimal; division always produces a decimal result; output precision matches the wider operand
  - Modulo (`%`) and exponentiation (`^`) are out of scope for Q3

- **AC-FM5b-18 — FORMAT_NUMBER available (string composition only)**
  - Accepts a numeric-typed source field and a format string (e.g., `'FM999,999,990.00'`, `'$#,##0.00'`)
  - Output is a string — intended only for embedding a number within a string value
  - Should not be used to populate numeric-typed target fields
  - Mirrors FORMAT_DATE in shape and intent

- **AC-FM5b-19 — NULLIF available**
  - Accepts a source field and a value; returns null when the field equals that value (otherwise returns the source field's value)
  - Canonical use: `NULLIF(field, '')` — coerce empty strings to null for clean downstream type casting
  - Inverse direction of COALESCE and DEFAULT_VALUE

- **AC-FM5b-20 — Period boundary date functions available**
  - `FIRST_DAY_OF_MONTH` and `LAST_DAY_OF_MONTH` each accept a date-typed source field and return a date-typed value representing the first or last calendar day of that field's month
  - Both correctly handle month lengths (28/29/30/31) including February leap-year handling
  - Canonical use: producing period-anchored "as of" dates for close workflows

- **AC-FM5b-21 — Date construction from parts available**
  - `DATE_FROM_PARTS` accepts three integer inputs — year, month, day — and returns a date-typed value
  - Canonical use: reconstructing a date when the source dataset stores year / month / day in separate columns
  - Invalid combinations (e.g., month=13, day=31 in February) return null with a warning

---

### FM5c-LC — Mapping Preview & Validation

**User Story:** As an admin, I want mapping errors surfaced proactively on the field mapping row so I can catch and fix them before publish — without having to manually run a preview.

**Importance:** Medium

**Details:** A per-field Data Preview already exists (shows output against 5 sample rows). What's new is proactive inline validation: syntax errors, type mismatches, and null handling issues surfaced directly on the field mapping row without requiring the admin to run a preview.

**Acceptance Criteria:**

- **AC-FM5c-01 — Preview against sample data** *(existing behavior)*
  - Given I have defined a mapping expression (manually or via AI)
  - When I click "Preview" (or equivalent action)
  - Then I see the mapping output against sample source data

- **AC-FM5c-02 — Syntax errors caught inline**
  - Given I have entered a mapping expression with a syntax error
  - When the expression is validated
  - Then the syntax error is displayed inline in the mapping editor

- **AC-FM5c-03 — Type mismatch warnings**
  - Given the mapping expression produces an output type that does not match the target field data type
  - When the expression is validated
  - Then a type mismatch warning is displayed on the field mapping row

- **AC-FM5c-04 — Null handling issues flagged**
  - Given the mapping expression does not account for null or empty source values
  - When the expression is validated
  - Then a null handling warning is displayed

- **AC-FM5c-05 — Errors surfaced inline on field mapping row**
  - Given a mapping expression has validation errors
  - When I view the field mapping grid
  - Then errors are surfaced inline on the affected field mapping row, not just at publish time

---

### FM5d-LC — Row Filtering (WHERE Conditions)

**User Story:** As an admin, I want to define filter conditions on source data so that only records meeting specific criteria are included in the model output.

**Importance:** High

**Details:** Row filtering defines which rows from the source dataset are included in the mapping output — equivalent to a SQL WHERE clause. Filters are evaluated after ingestion and before field-level mappings are applied. Supported conditions for Q3 cover patterns from real customer queries across multiple connector types (NetSuite, Coupa): equality, not-equal, multi-value IN, comparison operators, null checks, pattern matching, and AND/OR logic. Complex grouped OR blocks (full parenthesized condition sets) are post-Q3.

**Acceptance Criteria:**

- **AC-FM5d-01 — Equality and not-equal conditions**
  - Given I am configuring row filters
  - When I define a filter condition
  - Then I can specify equality (`field = value`) and not-equal (`field != value`) conditions

- **AC-FM5d-02 — Multi-value matching (IN)**
  - `IN` condition supports both string and numeric values
  - Includes rows matching any of the listed values

- **AC-FM5d-03 — Comparison operators for numeric and date fields**
  - Supported operators: `>`, `>=`, `<`, `<=`

- **AC-FM5d-04 — NULL checks**
  - `IS NULL` and `IS NOT NULL` conditions supported

- **AC-FM5d-05 — Pattern matching (LIKE / NOT LIKE / ILIKE)**
  - `LIKE` (e.g., `field LIKE 'prefix%'`, `field LIKE '%substring%'`), `NOT LIKE`, and `ILIKE` (case-insensitive) supported

- **AC-FM5d-06 — AND / OR logic between conditions**
  - Conditions can be combined with AND and OR logic
  - Parenthesized condition groups supported (e.g., `period = {$Period} AND (department <> 'Facilities' OR location = 'Boston')`)

- **AC-FM5d-07 — Parameterized date values**
  - Date range/equality filters can reference parameterized date values (e.g., `{$Start Date}`, `{$End Date}`, `{$Period}`) provided at run time
  - Parameters connect to scheduling and on-demand refresh configuration

- **AC-FM5d-08 — COALESCE in filter conditions**
  - `COALESCE(field, fallback_value)` can be used as part of a filter condition expression


---

## User Interaction & Design

### Key Design Questions

- What does the mapping logic editor look like — inline text field, modal, code editor?
- How is the AI mapping assistant invoked — floating panel, slide-over, or modal?
- How does the AI panel interact with the field mapping grid — side-by-side, overlay?
- How is function documentation surfaced — inline tooltips, separate panel, searchable library?
- How is mapping preview displayed — inline expansion, split view, modal?

### Key Design Decisions

- Floating panel preferred over modal for the AI interaction pattern (per project CLAUDE.md)
- AI Chat Modal / floating panel is the "core AI interaction model" from prototype exploration
- Per-row Mapping Builder already exists in production — this PRD extends it with new functions, expression nesting, and AI Chat

### UI Changes

| Change | Description |
|--------|-------------|
| AI Chat Modal / floating panel | Conversational AI interface for natural language mapping authoring — invoked from a field mapping row |
| Per-row mapping editor | Accessible from the field mapping grid, supports manual function-based and AI-assisted expression authoring |
| Function library browser | Browsable and searchable function library accessible from the mapping editor |

---

## Future Considerations

- **Pattern-based mapping rules** — Define a rule once and apply it to all fields matching a pattern (e.g., "all date fields should use ISO format")
- **Mapping logic history / rollback** — Store a history of changes per field row with revert capability
- **Conflict detection** — Flag when two field rules produce conflicting outputs for the same target field
- **User-extensible function library** — Allow admins to define custom functions (pending OQ-8)
- **Bulk mapping application** — Apply the same mapping to multiple fields at once
- **Cross-connection JOINs** — Joining tables across two different source connections; requires a shared compute layer
- **Multi-condition JOINs with function expressions** — JOIN conditions involving function calls or multiple conditions
- **Grouped AND/OR WHERE blocks** — Complex parenthesized condition groups for highly conditional row filtering
- **POSITION() function** — Dynamic character position lookup; addressable via REGEXP_EXTRACT for Q3 use cases
- **Reusable named lookup tables** — Post-Q3 candidate

---

## Open Questions

| # | Question | Status |
|---|----------|--------|
| OQ-4 | What is the full supported function library for 9/30? Should it be limited to QBO functions initially, or include all source types? | Resolved 2026-05-18 — ship the full library at 9/30, not a QBO-only subset. Rationale: customer SQL evidence (Coupa, NetSuite, Intacct) requires the full superset; per-connector gating would create artificial parity gaps. |
| OQ-5 | How does the AI Chat Modal interact with the field mapping grid — floating panel, slide-over, or modal? | Direction set 2026-05-18 — floating panel. Final visuals to be designed by Natasha Clark. |
| OQ-6 | Can AI-generated mapping expressions be edited manually after generation, or only regenerated? | Resolved 2026-06-11 — yes, manual edit allowed. All expressions are equally editable in the Mapping Builder per AC-FM5a-09. |
| OQ-7 | How are mapping expressions versioned? If a user changes a mapping on a published model, does it trigger a new Draft? | Resolved 2026-06-11 — mapping expressions are read-only when the model is Published; editing requires moving to Draft. Cross-ref Sub-PRD 4. |
| OQ-8 | Should the function library be user-extensible (custom functions), or FQ-managed only? | Resolved 2026-06-11 — FQ-managed only for Q3. Revisit post-Q3 if real gaps emerge. |
| OQ-9 | RBC's date extraction requirement produces discrete month and year as separate output fields from a single source date field. Does the architecture support 1-to-many mapping? | Resolved 2026-06-11 — two separate mapping rows, shared source. Added: EXTRACT_DAY, FIRST_DAY_OF_MONTH, LAST_DAY_OF_MONTH, DATE_FROM_PARTS. |
| OQ-10 | What depth limit applies to expression nesting? | Resolved 2026-05-18 — 5 levels. |
| OQ-11 | Should the AI Chat Modal use a single free-form input field or an explicit mode selector? | Direction set 2026-06-11 — single free-form input with AI auto-detection. Final UX owned by Natasha. |
| OQ-13 | Does IF_THEN support COALESCE as a branch output? | Resolved 2026-05-18 — yes. IF_THEN branches accept arbitrary function expressions. |

---

## Gaps

| # | Gap | Impact | Proposed Resolution |
|---|-----|--------|---------------------|
| G3 | Supported function library/syntax undefined | Blocking | Engineering to publish the function library spec before mapping editor can be fully designed or built |
| G5 | AI behavior when mapping description is ambiguous or unsupported is undefined | High | PM + Engineering to define fallback UX (clarifying questions, error message, suggested alternatives) |
| G7 | Error handling for AI-generated expressions that produce runtime errors on real data is undefined | High | Engineering to define runtime error surfacing — how errors are displayed, whether the user can revert, whether the expression is flagged |
| G8 | No definition of how mapping logic interacts with versioning | Resolved 2026-06-11 (OQ-7) | Mapping expressions read-only when Published; editing requires moving to Draft. Cross-ref Sub-PRD 4. |
| G9 | Sequential chain model is insufficient — full expression nesting required; Q3 blocker | Blocking | Engineering must move from pipeline execution to expression tree model. Depth resolved 2026-05-18 (OQ-10): cap at 5 levels. |
| G10 | No intermediate computed field reference — forces expression repetition | High | Engineering to determine whether computed intermediate fields can be materialized and referenced within the same mapping pass, or whether this requires a two-pass model. |
| G11 | JSON/semi-structured field extraction not in current function library | High | Resolved by adding EXTRACT_JSON_FIELD(field, path) to the function library (see AC-FM5b-13). |

---

## References

### Related Sub-PRDs

- [Overview & Index](https://floqast.atlassian.net/wiki/spaces/Data/pages/4444455089)
- [1 of 4: Model Creation & Source Configuration](https://floqast.atlassian.net/wiki/spaces/Data/pages/4450189505)
- [2a of 4: Field Mapping — Visual Refresh + AI-Suggested Mappings (6/30)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449927443)
- [3 of 4: Testing & Publishing](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449468593)
- [4 of 4: Versioning & Lifecycle](https://floqast.atlassian.net/wiki/spaces/Data/pages/4443013309)
- [Data Preview Tab (Sub-PRD 5)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4594892801)

### Related PRDs

- [QBO Transformation Functions (RBC)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4484530409/QBO+Transformation+Functions+DRAFT)

### Other References

- [Definitions & Terms](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409)
- [Jira Idea IDEA-2412](https://floqast.atlassian.net/jira/polaris/projects/IDEA/ideas/view/11291632?selectedIssue=IDEA-2412)
- Design Resources — *(placeholder)*
- Engineering References — *(placeholder)*
