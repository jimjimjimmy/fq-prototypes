# Mapping Expressions v2

| Field | Value |
|-------|-------|
| **Status** | DRAFT |
| **Last updated** | 2026-05-19 |
| **Owner** | Alex Kearns |
| **Target release** | 2026-09-30 |
| **Epic** | *(link to epic)* |
| **Idea Link** | *(new JPD idea to be created after engineering scope sign-off — IDEA-2412 retired due to material scope change)* |
| **Document status** | DRAFT |
| **Document owner** | @Alex Kearns |
| **Designer** | Natasha Clark |
| **Tech lead** | *(assign)* |
| **Technical writers** | *(assign)* |
| **QA** | *(assign)* |
| **Depends on** | Sub-PRD 2a (Field Mapping — Visual Refresh + AI-Suggested Mappings) must be complete |
| **Related sub-PRDs** | 1 of 4: Model Creation & Source Configuration · 2a of 4: Field Mapping (6/30) · 3 of 4: Testing & Publishing · 4 of 4: Versioning & Lifecycle |
| **Related PRDs** | [QBO Transformation Functions (RBC)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4484530409/QBO+Transformation+Functions+DRAFT) |
| **Supersedes** | [Model Creation 2 of 4: Field Mapping (DRAFT)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449927443) · [Field Mapping — AI Assisted Transformation Functions (DRAFT)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4490559489) |

---

## Objective

This PRD covers the AI-assisted mapping logic layer for field mappings within Data Studio's Model Lineage capability. Mapping logic defines how source field values are converted into FQ target field values — enabling data normalization, format conversion, conditional logic, and multi-field combination.

This document was split from the original Field Mapping PRD (2 of 4) to allow the field mapping grid redesign and AI-suggested mappings to ship first. PRD 2a: Field Mapping — Visual Refresh + AI-Suggested Mappings (target 6/30) delivers the redesigned mapping grid, AI-suggested source-to-target mappings, many-to-one source field selection, and custom fields. This PRD (2b, target 9/30) builds on that foundation by adding mapping logic definition — both manual function-based logic and AI-assisted natural language authoring via the AI Chat Modal.

Rebecca's [QBO Transformation Functions PRD](https://floqast.atlassian.net/wiki/spaces/Data/pages/4484530409/QBO+Transformation+Functions+DRAFT) defines the QBO-specific mapping functions needed for source-to-target mapping. While initially scoped to QBO, it is intended to support additional connector types and serves as the foundation for the function library defined in this PRD.

The AI Chat Modal (or floating panel) is the primary AI interaction surface for this PRD, enabling admins to describe mappings in natural language and have AI generate the corresponding expressions. This is the "core AI interaction model" identified during prototype exploration.

---

## Definitions

See [Definitions & Terms](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409) for shared terminology used across the Model Creation PRD suite.

---

## Why This Is Important

Mapping logic is what turns simple field mappings into powerful data normalization. Without it, admins can only map source fields to target fields 1-to-1 without any value conversion — leaving complex data shapes, format mismatches, and multi-field combinations unsupported.

**Current experience limitations:**

Today, a limited set of mapping functions exists (To_Upper, To_Lower, Safe Cast, Strip Currency Symbols, Right, Left, Substring, Split Column, Default Value, Trim Spaces), but the current implementation lacks:

- **Complex conditional logic** — no if/else capability, so admins cannot define rules like "if country = US, use date format MM/DD/YYYY; otherwise use YYYY-MM-DD"
- **AI-assisted authoring** — admins must know function syntax to define mappings; there is no natural language interface
- **Combination logic for many-to-one mappings** — PRD 2a (6/30) delivers the ability to select multiple source fields for a single target, but the concatenation/combination logic that defines *how* those fields are merged requires the mapping editor delivered in this PRD
- **Mapping preview** — admins cannot see the output of a mapping against sample data before applying it, leading to downstream data quality issues discovered only at publish or runtime

The AI Chat Modal is the "core AI interaction model" from the prototype exploration. It enables business users to describe mappings in plain language ("combine first name and last name with a space between them", "convert MM/DD/YYYY to ISO format") and have AI generate the expression — unlocking true self-service for non-technical users.

---

## Key Benefits

| Benefit | Description |
|---------|-------------|
| **AI-assisted mapping logic** | Reduces need for engineering support on complex normalization rules — admins can define mappings with AI assistance instead of filing support tickets |
| **Natural language mapping authoring** | Empowers business users to define mapping logic without technical expertise — describe what you want in plain language, AI generates the expression |
| **Expanded function library** | If/Else, Concatenate, Date formatting, Numeric rounding, and Lookup functions unlock data shapes that were previously unsupported or required custom engineering |
| **Mapping preview** | Reduces downstream data quality issues by letting admins catch errors before publish — preview mapping output against sample data in real time |

---

## Use Cases

### UC1 — Date format conversion

An admin needs to convert a date field from the source format (e.g., "MM/DD/YYYY") to the FQ target format ("YYYY-MM-DD"). The admin opens the mapping editor on the field mapping row and either selects the Date format function from the library or invokes the AI assistant and describes the conversion in plain language. The expression is previewed against sample data before applying.

### UC2 — Natural language mapping authoring

An admin needs to define a complex mapping but does not know the function syntax. The admin invokes the AI Chat Modal from the field mapping row, describes the mapping in plain language (e.g., "strip the dollar sign, convert to a number, and round to two decimal places"), and AI generates the expression. The admin previews the output and applies it.

### UC3 — Many-to-one concatenation logic

An admin has already selected multiple source fields for a single target field (using the many-to-one UI delivered in PRD 2a). Now the admin needs to define how those fields are combined — for example, concatenating first name and last name with a space delimiter. The admin uses the mapping editor or AI assistant to define the concatenation expression.

### UC4 — Conditional logic (if/else)

An admin needs to apply conditional logic to a field mapping — for example, "if the source field 'country' equals 'US', use date format A; otherwise use date format B." The admin defines this using the If/Else function in the mapping editor or describes the rule in natural language via the AI assistant.

### UC5 — Applying an existing function

An admin needs to normalize a text field by converting all values to uppercase. The admin opens the mapping editor, browses or searches the function library, selects To_Upper, configures the parameters, and saves. No AI assistance needed for this straightforward use case.

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
- Mapping logic is autosaved (same autosave behavior as PRD 2a)
- **Field mapping is intra-row only.** Joins between source datasets are handled upstream in the Source Datasets / Model Config layer, not in this PRD. Aggregations (SUM / COUNT / AVG / GROUP BY) are also out of scope here — they reshape the row-set rather than apply per-row mapping logic and are scoped in a separate sub-PRD (2c — Aggregations).
- **Display formatting of native-typed target fields belongs to the application layer**, not the mapping layer. Mapping only formats values *as part of string composition* via `FORMAT_DATE` and `FORMAT_NUMBER`. Target fields typed as DATE, DECIMAL, INTEGER, etc., are stored as native types; the app layer renders them for display.
- **Terminology — CONSTANT vs. DEFAULT_VALUE:** `CONSTANT` always writes a configured literal to every record regardless of source value. `DEFAULT_VALUE` writes a configured literal only when the source field is null or empty. These are distinct functions with distinct semantics; the AI Chat must surface the right one based on user intent.

---

## Scope

### In Scope (9/30)

- Per-row mapping logic editor (manual functions and AI-assisted)
- AI Chat Modal / floating panel for natural language, Excel formula, and SQL/regex mapping authoring
- Supported function library definition (extending existing functions + new: If/Else, **CASE_WHEN** (native multi-branch), Concatenate, Date format, Numeric rounding, **FORMAT_NUMBER**, Lookup, REGEXP_EXTRACT, REGEXP_REPLACE, REPLACE, COALESCE, **NULLIF**, FORMAT_DATE, TO_TITLE_CASE, EXTRACT_JSON_FIELD, **EXTRACT_DAY**, EXTRACT_MONTH, EXTRACT_YEAR, **FIRST_DAY_OF_MONTH**, **LAST_DAY_OF_MONTH**, **DATE_FROM_PARTS**, CONSTANT, **arithmetic operators (`+`, `-`, `*`, `/`)**)
- Expression nesting support — using the output of one function as the argument to another, capped at **5 levels deep** (resolved OQ-10). Required for complex conditional and multi-part string construction; see G9.
- Row filtering (WHERE conditions) — equality, not-equal, IN, comparison operators, IS NULL / IS NOT NULL, LIKE / NOT LIKE / ILIKE, AND/OR logic between simple conditions, **parenthesized AND/OR condition groups** (e.g., `(A OR B) AND (C OR D)`), parameterized date values, **auto-populated default rules for Fivetran soft-delete metadata**, **common filter templates per source-system type** (NetSuite `ISINACTIVE`/`DUPLICATE`, Coupa `ACTIVE`/`STATUS`)
- Simple source dataset joins — INNER JOIN and LEFT JOIN with a single join condition, enabling enrichment from related tables within the same source connection (e.g., resolving a currency ID to its name)
- Mapping preview against sample data
- Mapping validation (syntax errors, type mismatches, null handling)
- Autosave for mapping logic

### Out of Scope

- Field mapping grid UI redesign (delivered in PRD 2a, 6/30)
- AI-suggested source-to-target mappings (delivered in PRD 2a, 6/30)
- Many-to-one source field selection UI (delivered in PRD 2a, 6/30)
- Custom field creation (delivered in PRD 2a, 6/30)
- Testing mappings against live data (Sub-PRD 3)
- Publishing (Sub-PRD 3)
- **Aggregation (SUM / COUNT / AVG / GROUP BY) — scoped in parallel Sub-PRD 2c (Aggregations), still Q3-targeted. Architecturally distinct because aggregation reshapes the row-set and forces every other field into a GROUP BY dimension or another aggregate.**
- User-extensible custom functions (deferred — see OQ-8)
- Cross-connection JOINs — joining tables across two different source connections (e.g., Coupa + NetSuite in the same query); post-Q3
- Multi-condition JOINs with function expressions in the join condition; post-Q3
- Reusable named lookup tables — `Lookup/reference` is inline `{key: value}` sugar over CASE WHEN, not a first-class reusable asset (resolved 2026-05-18 — see Lookup AC). Reusable named lookup tables are a post-Q3 candidate.
- `POSITION()` function — dynamic character position lookup; addressable via REGEXP_EXTRACT for Q3 use cases
- Array indexing in `EXTRACT_JSON_FIELD` (e.g., `'items[0].name'`); single-key and dot-path syntax are in scope (see AC-FM5b-13)

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

**Details:** Each field mapping row in the grid supports an optional mapping expression. The admin can define mappings using the function library (manual) or via AI-assisted natural language authoring. Mapping logic supports both 1-to-1 and many-to-one source field mappings. Expressions are autosaved. Invalid logic is flagged before publish.

**Acceptance Criteria:**

**AC-FM5-01 — Mapping editor accessible per row**
- Given I am on the Field Mappings tab
- When I select a field mapping row
- Then I can access a mapping editor for that row

**AC-FM5-02 — Manual function-based logic**
- Given I have opened the mapping editor for a field mapping row
- When I want to define a mapping manually
- Then I can select from the supported function library and configure parameters

**AC-FM5-03 — AI-assisted mapping logic**
- Given I have opened the mapping editor for a field mapping row
- When I want AI to help define a mapping
- Then I can invoke the AI Chat Modal / floating panel and describe the mapping in natural language

**AC-FM5-04 — Mapping logic autosaved**
- Given I have defined a mapping expression for a field mapping row
- When the expression is valid
- Then it is autosaved (same autosave behavior as PRD 2a)

**AC-FM5-05 — Invalid logic flagged before publish**
- Given I have defined a mapping expression that contains errors (syntax, type mismatch, null handling)
- When I save or attempt to publish
- Then the errors are flagged inline on the field mapping row

---

### FM5a-LC — AI Chat Modal for Mapping Authoring

**User Story:** As an admin, I want to describe mappings in my own terms — whether natural language, an Excel formula, or a SQL expression — and have AI generate the equivalent mapping so I don't need to learn a new function syntax.

**Importance:** High

**Details:** The AI Chat Modal (or floating panel) is one of two parallel entry points to mapping authoring — alongside the visual Builder. Both converge on the same mapping expression: the Builder provides a guided, step-by-step interface; the Chat accepts free-form input. The Chat recognizes three input modes: natural language descriptions, Excel formulas, and SQL/regex expressions. In all cases, the AI translates the input into a valid Data Studio mapping expression, shows the translation explicitly, and previews output against sample data. If the input maps to an unsupported function, the AI returns the closest supported approximation and explains the difference. The builder and chat are bidirectionally synced — manual edits in the builder are reflected in the chat state.

**Acceptance Criteria:**

**AC-FM5a-01 — Invoke AI from field mapping row**
- Given the mapping editor is open for a field mapping row
- When I click the AI assist button
- Then the AI Chat Modal / floating panel opens, contextualized to that field mapping row

**AC-FM5a-02 — Describe mapping in natural language**
- Given the AI Chat Modal / floating panel is open
- When I describe the desired mapping in plain language (e.g., "convert MM/DD/YYYY to ISO format")
- Then AI generates a mapping expression based on my description

**AC-FM5a-03 — Iterate on AI suggestion**
- Given AI has suggested a mapping expression
- When I provide follow-up instructions (e.g., "also handle nulls", "add a default value")
- Then AI refines the expression based on my feedback

**AC-FM5a-04 — Preview AI suggestion before applying**
- Given AI has generated a mapping expression
- When I review the suggestion
- Then I see a preview of the output against sample source data before applying

**AC-FM5a-05 — Applied expression saved to mapping row**
- Given I accept an AI-generated mapping expression
- When I click "Apply" (or equivalent action)
- Then the expression is saved to the field mapping row and autosaved

**AC-FM5a-06 — Excel formula input recognized and translated**
- Given the AI Chat Modal is open
- When I enter an Excel formula (e.g., `=RIGHT(A1, 3)` or `=TEXTAFTER(A1, ":", -1)`)
- Then the AI recognizes it as an Excel formula and translates it to the equivalent Data Studio mapping function(s)
- And the translation is shown explicitly before the preview (e.g., "Recognized an Excel formula. Here's how it maps: Step 1 — SPLIT_COLUMN(field, ':', -1)")
- And a preview of the output is shown against sample source data

**AC-FM5a-07 — SQL and regex expression input recognized and translated**
- Given the AI Chat Modal is open
- When I enter a SQL expression or regex pattern (e.g., `REGEXP_EXTRACT(field, ':([0-9]+) ·')`)
- Then the AI recognizes it as a technical expression and maps it to the equivalent Data Studio function
- And the translation is shown explicitly before the preview

**AC-FM5a-08 — Closest approximation when formula maps to unsupported function**
- Given I have entered a formula or expression in the AI Chat Modal
- When the formula maps to a function not currently in the Data Studio library
- Then the AI returns the closest supported approximation
- And explains what differs from the original formula (e.g., "Your formula uses TEXTAFTER with last-occurrence support. We've approximated this with SPLIT_COLUMN(field, ':', -1) — review the preview to confirm the output matches your expectation")

**AC-FM5a-09 — Bidirectional sync between chat and builder**
- Given a mapping has been generated via AI Chat and applied to the builder
- When I manually edit the mapping steps in the builder
- Then the AI Chat Modal reflects the updated mapping state
- And subsequent chat interactions build on the current builder state, not the originally generated expression

---

### FM5b-LC — Function Library

**User Story:** As an admin, I want access to a comprehensive set of mapping functions so I can handle various data normalization needs.

**Importance:** High

**Details:** The function library defines the supported set of mapping functions available in the mapping editor. It includes all existing functions plus new functions needed for complex data normalization. Each function has documentation including name, description, parameter definitions, return type, and example usage. The library is browsable and searchable from the mapping editor.

**Cross-ref:** [QBO Transformation Functions (RBC)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4484530409/QBO+Transformation+Functions+DRAFT) defines the QBO-specific function set. This PRD's function library is a superset that includes QBO functions and extends to other sources.

**Date handling principle:** Date values should be stored as date types in target fields. Display formatting (e.g., MM/DD/YY vs. YYYY-MM-DD) is the responsibility of the application layer, not the mapping layer. The one exception is `FORMAT_DATE`, which is valid when a date must be embedded within a string field — for example, combining a description field with a formatted date to produce a transaction label like `"Invoice Payment — 04/30/26"`. `FORMAT_DATE` should not be used to populate date-typed target fields — use `SAFE_CAST_DATE` for those.

**Acceptance Criteria:**

**AC-FM5b-01 — Existing functions remain available**
- Given I open the mapping editor
- When I browse or search the function library
- Then all current functions are available: To_Upper, To_Lower, Safe Cast, Strip Currency Symbols, Right, Left, Substring, Split Column, Default Value, Trim Spaces
- And Split Column supports index `-1` to return the last segment of the delimited string; if the delimiter does not match or the index is out of range, the output is null and a warning is logged on the affected record

**AC-FM5b-02 — New functions available**
- Given I open the mapping editor
- When I browse or search the function library
- Then the following new functions are available: If/Else, **CASE_WHEN** (native multi-branch — see AC-FM5b-16), Concatenate (see AC-FM5b-15), Date format conversion, Numeric rounding/truncation, **FORMAT_NUMBER** (see AC-FM5b-18), Lookup/reference, REGEXP_EXTRACT, REGEXP_REPLACE, REPLACE, COALESCE, **NULLIF** (see AC-FM5b-19), FORMAT_DATE, CONSTANT, **EXTRACT_DAY**, EXTRACT_MONTH, EXTRACT_YEAR (see AC-FM5b-08), **FIRST_DAY_OF_MONTH**, **LAST_DAY_OF_MONTH** (see AC-FM5b-20), **DATE_FROM_PARTS** (see AC-FM5b-21), TO_TITLE_CASE, EXTRACT_JSON_FIELD
- And **arithmetic operators** are available: `+`, `-`, `*`, `/` (see AC-FM5b-17)

**AC-FM5b-03 — Function documentation**
- Given I view a function in the library
- When I inspect its details
- Then I see the function name, description, parameter definitions, return type, and example usage

**AC-FM5b-04 — Library browsable and searchable**
- Given I am in the mapping editor
- When I want to find a function
- Then I can browse the full function library or search by name/keyword

**AC-FM5b-05 — REGEXP_EXTRACT available**
- Given I open the mapping editor
- When I browse or search the function library
- Then `REGEXP_EXTRACT` is available, accepting a source field, a regex pattern, and an optional capture group index (default: full match)
- And if the pattern does not match, the output is null and a warning is logged on the affected record without halting the pipeline

**AC-FM5b-06 — SPLIT_COLUMN last-segment support**
- Given I configure `SPLIT_COLUMN` with index `-1`
- When the mapping runs against a source field with a variable number of segments
- Then the last segment is returned regardless of total segment count
- And if the delimiter does not match, the output is null and a warning is logged

**AC-FM5b-07 — CONSTANT function available**
- Given I open the mapping editor
- When I browse or search the function library
- Then `CONSTANT` is available, accepting a literal string value defined at configuration time
- And the configured value is written to every record in the mapping run regardless of source field value
- And this behavior is distinct from `DEFAULT_VALUE`, which applies only when the source field is null or empty

**AC-FM5b-08 — Date part extraction available**
- Given I open the mapping editor
- When I browse or search the function library
- Then `EXTRACT_MONTH`, `EXTRACT_YEAR`, and `EXTRACT_DAY` are available, each accepting a date-typed source field and returning an integer (month: 1–12; year: e.g., 2026; day: 1–31)
- And these can be used independently across multiple mapping rows that share a single source date field (e.g., one source date → three target rows producing discrete year / month / day target columns)

**AC-FM5b-09 — String cleanup functions available**
- Given I open the mapping editor
- When I browse or search the function library
- Then `REPLACE` is available, accepting a source field, a literal find string, and a replacement string
- And `REGEXP_REPLACE` is available, accepting a source field, a regex pattern, and a replacement string
- And both handle cases where source field values contain formatting characters (commas, quotes, parentheses) that prevent correct type casting

**AC-FM5b-10 — COALESCE available**
- Given I open the mapping editor
- When I browse or search the function library
- Then `COALESCE` is available, accepting two or more source fields and returning the first non-null value
- And if all inputs are null, the output is null
- And this is distinct from `DEFAULT_VALUE` (null → constant) — COALESCE evaluates fields in sequence and returns the first that is non-null

**AC-FM5b-11 — FORMAT_DATE available (string composition only)**
- Given I open the mapping editor
- When I browse or search the function library
- Then `FORMAT_DATE` is available, accepting a date-typed source field and an output format string (e.g., `'MM/DD/YY'`, `'YYYY-MM-DD'`)
- And the output is a string — `FORMAT_DATE` is intended only for cases where a date must be embedded within a string value (e.g., as a component of a `CONCATENATE_COLUMNS` expression)
- And `FORMAT_DATE` should not be used to populate date-typed target fields — use `SAFE_CAST_DATE` for those

**AC-FM5b-12 — TO_TITLE_CASE available**
- Given I open the mapping editor
- When I browse or search the function library
- Then `TO_TITLE_CASE` is available, accepting a source string field and returning it with the first letter of each word capitalized (equivalent to SQL `INITCAP`)
- And this can be chained with `REPLACE` to handle cases where separators (e.g., underscores) should be converted to spaces after casing (e.g., `approved_pending` → `Approved Pending`)

**AC-FM5b-13 — EXTRACT_JSON_FIELD available**
- Given I open the mapping editor
- When I browse or search the function library
- Then `EXTRACT_JSON_FIELD` is available, accepting a JSON/semi-structured source field and a **path expression**, and returning the value at that path as a string
- And the path expression supports both single-key form (`'memo'`) and **dot-path form** for nested access (`'group.name'`) — e.g., `EXTRACT_JSON_FIELD(custom_fields, 'group.name')` returns the value of `name` inside the nested `group` object
- And if any key along the path does not exist, the output is null and a warning is logged
- And the result can be chained with type casting functions (e.g., `SAFE_CAST_DATE`) for further mapping
- And array indexing within the path (e.g., `'items[0].name'`) is out of scope for Q3 — defer to post-Q3 if real customer use cases emerge

**AC-FM5b-14 — IF_THEN condition operators**
- Given I am configuring an `IF_THEN` condition
- When I define the condition expression
- Then the following operators are supported: `=`, `!=`, `>`, `>=`, `<`, `<=`, `IN`, `NOT IN`, `LIKE`, `NOT LIKE`, `ILIKE` (case-insensitive match), `IS NULL`, `IS NOT NULL`
- And conditions can be combined with `AND` and `OR` logic, including **parenthesized condition groups** (e.g., `(currency = 'US' AND status = 'paid') OR (currency = 'EU' AND priority = 'high')`)
- And the true/false branch of an IF_THEN may be any function expression (including `COALESCE`, `CONCATENATE_COLUMNS`, arithmetic, nested IF_THEN, etc.) — not limited to literals or single-field references (resolves OQ-13)

**AC-FM5b-15 — CONCATENATE_COLUMNS available** *(spec gap SG1 resolved)*
- Given I open the mapping editor
- When I browse or search the function library
- Then `CONCATENATE_COLUMNS` is available, accepting **N inputs (≥ 2)** in any combination of source fields, literal strings, and function expressions
- And inputs are concatenated left-to-right in the order specified; literal separators are positional arguments interleaved between fields by the author (matches SQL `CONCAT` form — e.g., `CONCATENATE_COLUMNS(first_name, ' ', last_name)`)
- And null inputs are treated as empty strings by default (so `CONCATENATE_COLUMNS(display_name, ' (', name, ')')` produces a clean result even when `display_name` is null)
- And the result can be chained with other string functions or wrapped in `IF_THEN`/`CASE_WHEN`

**AC-FM5b-16 — CASE_WHEN multi-branch conditional**
- Given I open the mapping editor
- When I browse or search the function library
- Then `CASE_WHEN` is available, accepting an arbitrary number of `(condition, expression)` pairs plus an optional `ELSE` expression
- And conditions reuse the same operator set as IF_THEN (per AC-FM5b-14), including AND/OR and parenthesized groups
- And branch expressions follow the same rules as IF_THEN branches (any function expression allowed, not just literals)
- And evaluation is short-circuit — the first matching branch wins; if no branch matches and no ELSE is provided, the output is null
- Use case: NetSuite transaction-type normalization (`CASE_WHEN type='FinChrg' THEN 'Finance Charge' / type='VendBill' THEN 'Vendor Bill' / ... / ELSE type`) — 8–10+ branches without burning expression-nesting budget

**AC-FM5b-17 — Arithmetic operators** *(spec gap SG2 resolved)*
- Given I open the mapping editor
- When I browse or search the function library
- Then arithmetic operators are available: `+`, `-`, `*`, `/`
- And operands can be source fields, literal numeric values, or function expressions (validated by FX-conversion patterns like `amount * fx_rate`, line totals `qty * unit_price`, and ratios `(revenue - cost) / revenue`)
- And null operands propagate (any null input → result is null); callers must use `COALESCE(field, 0)` for explicit null-to-zero coercion
- And type rules: decimal + integer → decimal; division always produces a decimal result (no integer division); output precision matches the wider operand
- And modulo (`%`) and exponentiation (`^`) are out of scope for Q3 — defer to post-Q3 if real use cases emerge

**AC-FM5b-18 — FORMAT_NUMBER available (string composition only)**
- Given I open the mapping editor
- When I browse or search the function library
- Then `FORMAT_NUMBER` is available, accepting a numeric-typed source field and a format string (e.g., `'FM999,999,990.00'`, `'$#,##0.00'`)
- And the output is a string — `FORMAT_NUMBER` is intended only for cases where a number must be embedded within a string value (e.g., as a component of a `CONCATENATE_COLUMNS` expression producing a human-readable label)
- And `FORMAT_NUMBER` should not be used to populate numeric-typed target fields — store the value as the native numeric type and let the application layer handle display formatting
- This mirrors `FORMAT_DATE` (AC-FM5b-11) in shape and intent

**AC-FM5b-19 — NULLIF available**
- Given I open the mapping editor
- When I browse or search the function library
- Then `NULLIF` is available, accepting a source field and a value, and returning null when the field equals that value (and the source field's value otherwise)
- Canonical use: `NULLIF(field, '')` — coerce empty strings to null so downstream `SAFE_CAST_DATE` / `SAFE_CAST_DECIMAL` / etc. handle them cleanly instead of erroring or producing garbage
- And this is the inverse direction of `COALESCE` (which converts null → value) and `DEFAULT_VALUE` (which converts null → constant)

**AC-FM5b-20 — Period boundary date functions available**
- Given I open the mapping editor
- When I browse or search the function library
- Then `FIRST_DAY_OF_MONTH` and `LAST_DAY_OF_MONTH` are available, each accepting a date-typed source field and returning a date-typed value representing the first or last calendar day of that field's month
- Canonical use: producing period-anchored "as of" dates for close workflows — e.g., `LAST_DAY_OF_MONTH(transaction_date) → period_end_date`
- And both correctly handle month lengths (28/29/30/31) including February leap-year handling

**AC-FM5b-21 — Date construction from parts available**
- Given I open the mapping editor
- When I browse or search the function library
- Then `DATE_FROM_PARTS` is available, accepting three integer inputs — year, month, day — and returning a date-typed value
- Canonical use: reconstructing a date when the source dataset stores year / month / day in separate columns (common in legacy ERP exports)
- And invalid combinations (e.g., month=13, day=31 in February) return null with a warning on the affected record, rather than throwing

---

### FM5c-LC — Mapping Preview & Validation

**User Story:** As an admin, I want to preview mapping output before applying it so I can catch errors early.

**Importance:** Medium

**Details:** The mapping preview shows the output of the current expression against sample source data. Validation runs inline and catches syntax errors, type mismatches, and null handling issues. Errors are surfaced on the field mapping row, not just at publish time.

**Acceptance Criteria:**

**AC-FM5c-01 — Preview against sample data**
- Given I have defined a mapping expression (manually or via AI)
- When I click "Preview" (or equivalent action)
- Then I see the mapping output against sample source data

**AC-FM5c-02 — Syntax errors caught inline**
- Given I have entered a mapping expression with a syntax error
- When the expression is validated
- Then the syntax error is displayed inline in the mapping editor

**AC-FM5c-03 — Type mismatch warnings**
- Given the mapping expression produces an output type that does not match the target field data type
- When the expression is validated
- Then a type mismatch warning is displayed on the field mapping row

**AC-FM5c-04 — Null handling issues flagged**
- Given the mapping expression does not account for null or empty source values
- When the expression is validated
- Then a null handling warning is displayed

**AC-FM5c-05 — Errors surfaced inline on field mapping row**
- Given a mapping expression has validation errors
- When I view the field mapping grid
- Then errors are surfaced inline on the affected field mapping row, not just at publish time

---

### FM5d-LC — Row Filtering (WHERE Conditions)

**User Story:** As an admin, I want to define filter conditions on source data so that only records meeting specific criteria are included in the model output.

**Importance:** High

**Details:** Row filtering defines which rows from the source dataset are included in the mapping output — equivalent to a SQL WHERE clause. Filters are evaluated after ingestion and before field-level mappings are applied. Supported conditions for Q3 cover the patterns seen in real customer queries across multiple connector types (NetSuite, Coupa): equality, not-equal, multi-value IN, comparison operators, null checks, pattern matching, and AND/OR logic between simple conditions. Complex grouped OR blocks (full parenthesized condition sets) are post-Q3.

**Acceptance Criteria:**

**AC-FM5d-01 — Equality and not-equal conditions**
- Given I am configuring row filters for a model
- When I define a filter condition
- Then I can specify equality (`field = value`) and not-equal (`field != value`) conditions against a source field

**AC-FM5d-02 — Multi-value matching (IN)**
- Given I am configuring row filters
- When I define a filter condition on a field with multiple allowed values
- Then I can specify an IN condition (`field IN (value1, value2, ...)`) that includes rows matching any of the listed values
- And IN supports both string and numeric values

**AC-FM5d-03 — Comparison operators for numeric and date fields**
- Given I am configuring row filters
- When I define a filter on a numeric or date field
- Then I can use comparison operators: `>`, `>=`, `<`, `<=`

**AC-FM5d-04 — NULL checks**
- Given I am configuring row filters
- When I define a filter condition
- Then I can specify `IS NULL` and `IS NOT NULL` conditions to include or exclude records based on whether a field has a value

**AC-FM5d-05 — Pattern matching (LIKE / NOT LIKE / ILIKE)**
- Given I am configuring row filters
- When I define a filter condition on a string field
- Then I can use `LIKE` (e.g., `field LIKE 'prefix%'`, `field LIKE '%substring%'`), `NOT LIKE`, and `ILIKE` (case-insensitive match)

**AC-FM5d-06 — AND / OR logic between conditions**
- Given I have defined two or more filter conditions
- When the filters are evaluated
- Then conditions can be combined with AND (all must be satisfied) and OR (any must be satisfied) logic
- And **parenthesized condition groups** are supported — e.g., `period = {$Period} AND (department <> 'Facilities' OR location = 'Boston')` — letting authors express mixed AND/OR logic that doesn't flatten to a pure AND chain. Validated by real customer queries (Shared Services Allocation, Complex Queries reference).

**AC-FM5d-07 — Parameterized date values**
- Given I am configuring a date range or date equality filter
- When I define the filter bounds
- Then I can reference parameterized date values (e.g., `{$Start Date}`, `{$End Date}`, `{$Period}`) that are provided at run time
- And these parameters connect to the scheduling and on-demand refresh configuration (per PRD: Scheduling and On-Demand Refresh)

**AC-FM5d-08 — COALESCE in filter conditions**
- Given a source field may be null due to connector metadata (e.g., Fivetran soft-delete flags)
- When I define a filter condition on that field
- Then I can use `COALESCE(field, fallback_value)` as part of the condition expression (e.g., `COALESCE(_FIVETRAN_DELETED, FALSE) = FALSE`)

**AC-FM5d-09 — Auto-populated and template-based filter rules**
- Given I create a new model on a Fivetran-connected source
- When the row-filter configuration loads
- Then a default filter rule of `COALESCE(_FIVETRAN_DELETED, FALSE) = FALSE` is pre-populated as a visible, editable rule (not a hidden system filter)
- And I can adjust or remove the rule if I explicitly need to include soft-deleted rows (audit / reconciliation use cases)
- And the row-filter UI exposes a **"Common filter templates"** picker that offers source-system-specific patterns the user can apply with one click, including:
  - **Exclude inactive records (NetSuite)** — pre-populates `WHERE ISINACTIVE = 'F'`
  - **Exclude duplicates (NetSuite)** — pre-populates `WHERE DUPLICATE = 'F'`
  - **Active lookups only (Coupa)** — pre-populates `WHERE ACTIVE = TRUE`
  - **Exclude deleted / cancelled orders (Coupa)** — pre-populates `WHERE STATUS NOT IN ('deleted', 'cancelled')`
- And templates produce ordinary editable filter rules — no special "template-locked" state
- And the template list is extensible by FloQast (engineering + PM) as new common patterns emerge

---

## User Flow Reference

The mapping logic workflow corresponds to Step 17 of the overall Lineage Creation user flow, which was deferred from PRD 2a:

| Step | Description |
|------|-------------|
| Step 17 | Define mapping logic — open mapping editor, define expression (manual or AI-assisted), preview output, apply and autosave |

> **Context:** Steps 13–16 and 18 are delivered in PRD 2a (6/30). Step 17 was deferred to this PRD to allow the field mapping grid redesign to ship first.

---

## User Interaction & Design

### Key Design Questions

- What does the mapping logic editor look like — inline text field, modal, code editor?
- How is the AI mapping assistant invoked — floating panel, slide-over, or modal?
- How does the AI panel interact with the field mapping grid — side-by-side, overlay?
- How is function documentation surfaced — inline tooltips, separate panel, searchable library?
- How is mapping preview displayed — inline expansion, split view, modal?

### Key Design Decisions

- **Floating panel preferred** over modal for the AI interaction pattern (per project CLAUDE.md)
- **AI Chat Modal / floating panel** is the "core AI interaction model" from prototype exploration
- **Per-row mapping editor** accessible from the field mapping grid delivered in PRD 2a

---

## UI Changes

| Change | Description |
|--------|-------------|
| AI Chat Modal / floating panel | Conversational AI interface for natural language mapping authoring — invoked from a field mapping row |
| Per-row mapping editor | Accessible from the field mapping grid, supports manual function-based and AI-assisted expression authoring |
| Function library browser | Browsable and searchable function library accessible from the mapping editor |

> **Note:** The AI Chat Modal / floating panel was noted as PRD 2b scope in PRD 2a. This is the conversational AI interaction pattern for mapping authoring.

---

## Future Considerations

- **Pattern-based mapping rules** — Allow admins to define a rule once and apply it to all fields matching a pattern (e.g., "all date fields should use ISO format")
- **Mapping logic history / rollback** — Store a history of changes per field row with revert capability
- **Conflict detection** — Flag when two field rules produce conflicting outputs for the same target field
- **User-extensible function library** — Allow admins to define custom functions (pending OQ-8)
- **Bulk mapping application** — Apply the same mapping to multiple fields at once
- **Cross-connection JOINs** — Joining tables across two different source connections (e.g., Coupa + NetSuite in the same model); requires a shared compute layer across connections
- **Multi-condition JOINs with function expressions** — JOIN conditions involving function calls or multiple conditions; extends beyond Q3 simple single-condition join scope
- **Grouped AND/OR WHERE blocks** — Complex parenthesized condition groups (e.g., `(condition_set_A) OR (condition_set_B)`) for highly conditional row filtering
- **`POSITION()` function** — Dynamic character position lookup; addressable via `REGEXP_EXTRACT` for Q3 use cases but a native POSITION function improves expressibility for non-regex users

---

## Open Questions

| # | Question | Status |
|---|----------|--------|
| OQ-4 | What is the full supported function library for 9/30? Should it be limited to QBO functions initially, or include all source types? | **Resolved 2026-05-18 — ship the full library at 9/30, not a QBO-only subset.** The full set is the union of existing functions (To_Upper, To_Lower, SAFE_CAST_*, Strip Currency Symbols, Right, Left, Substring, Split Column with `-1`, Default Value, Trim Spaces) + Q3 additions (IF_THEN, CASE_WHEN, CONCATENATE_COLUMNS, FORMAT_DATE, FORMAT_NUMBER, Numeric rounding/truncation, Lookup/reference, REGEXP_EXTRACT, REGEXP_REPLACE, REPLACE, COALESCE, NULLIF, TO_TITLE_CASE, EXTRACT_JSON_FIELD, EXTRACT_DAY, EXTRACT_MONTH, EXTRACT_YEAR, FIRST_DAY_OF_MONTH, LAST_DAY_OF_MONTH, DATE_FROM_PARTS, CONSTANT, arithmetic operators `+ - * /`). Rationale: customer SQL evidence (Coupa, NetSuite, Intacct in the Complex Queries reference) requires the full superset; per-connector gating would create artificial parity gaps. Rebecca's QBO PRD remains the QBO-specific subset that informs this library. *(Updated 2026-05-19 with EXTRACT_DAY + period-boundary + DATE_FROM_PARTS additions per OQ-9 resolution.)* |
| OQ-5 | How does the AI Chat Modal interact with the field mapping grid — floating panel, slide-over, or modal? | **Direction set 2026-05-18 — floating panel is the preferred pattern.** Aligned with the project-wide preference (per project CLAUDE.md: "prefer floating panels over modals for the AI interaction pattern") and prototype exploration. Final visuals to be confirmed in the design phase by Benjamin Ellis + Natasha Clark. |
| OQ-6 | Can AI-generated mapping expressions be edited manually after generation, or only regenerated? | **Resolved 2026-05-19 — yes, manual edit allowed.** All expressions (AI-generated or hand-authored) are equally editable in the Mapping Builder. AI Chat produces output that lands in the Builder; from there it's editable like any other expression. No separate "AI-locked" state. Per AC-FM5a-09, AI Chat picks up wherever the Builder currently is — bidirectional sync. Aligned with Tyler Lu's "AI starting point, not blank page" principle. |
| OQ-7 | How are mapping expressions versioned? If a user changes a mapping on a published model, does it trigger a new Draft? | **Resolved 2026-05-19 — mapping expressions are read-only unless the model is in Draft state.** To edit any mapping on a Published model, the user must first move the model to Draft (or create a new Draft from the Published version). Once in Draft, all mapping expressions become editable; on republish, they lock back to read-only. The Published version remains untouched and serving until the new Draft is published over it. Resolves G8. Cross-ref Sub-PRD 4 (Versioning & Lifecycle) for the Draft-creation flow and version-merge semantics. |
| OQ-8 | Should the function library be user-extensible (custom functions), or FQ-managed only? | **Resolved 2026-05-19 — FQ-managed only for Q3.** The full library (D6) covers observed customer SQL patterns; no evidence of insufficient coverage. User-extensible custom functions would add scope (definition UI, validation, sharing, security review, AI Chat awareness of custom functions) without a clear Q3 need. Defer to post-Q3; revisit if real usage reveals gaps. New function requests in the meantime flow through standard product feedback channels. |
| OQ-9 | RBC's date extraction requirement produces discrete month and year as separate output fields from a single source date field. Does the current architecture support mapping one source field to two target fields with different functions applied to each, or does this require two separate mapping rows pointing to the same source? | **Resolved 2026-05-19 — Approach A: two separate mapping rows, shared source.** Each target field is its own mapping row even when multiple rows reference the same source. Preserves the "one target = one mapping row" invariant from PRD 2a. RBC's date-split becomes two rows: `fq_period_year ← EXTRACT_YEAR(source_date)` and `fq_period_month ← EXTRACT_MONTH(source_date)`. Zero new architecture, simpler AI Chat output, predictable UX. Revisit fan-out shortcuts post-Q3 if observed pain emerges. **Also adds new date functions to library:** `EXTRACT_DAY`, `FIRST_DAY_OF_MONTH`, `LAST_DAY_OF_MONTH`, `DATE_FROM_PARTS(year, month, day)` — see AC-FM5b-20 and AC-FM5b-21. |
| OQ-10 | What depth limit, if any, applies to expression nesting — unbounded, or a practical maximum (e.g., 3 levels)? This decision gates the mapping editor UI model and the AI Chat output format. | **Resolved 2026-05-18 — 5 levels.** Observed customer query patterns require 2–4 levels; cap at 5 provides safe headroom while remaining bounded. AI Chat / Builder UX can assume tree depth ≤5 when generating, displaying, or validating expressions. |
| OQ-11 | Should the AI Chat Modal use a single free-form input field (AI detects whether the user entered natural language, an Excel formula, or a SQL expression) or an explicit mode selector? | **Direction set 2026-05-19 — single free-form input field with AI auto-detection.** AC-FM5a-06 and AC-FM5a-07 already imply auto-detection works (the AI "recognizes" Excel formulas / SQL expressions). Lower-friction UX, matches modern AI tool conventions, aligned with "starting point not blank page" principle. Detection ambiguity is mitigated by the explicit "Recognized as: ..." translation confirmation step before preview (per AC-FM5a-06). Final visual + interaction design owned by Natasha Clark. If post-launch user testing reveals confusion, can add an opt-in explicit selector. |
| OQ-12 | For Fivetran-connected sources, should filtering on `_FIVETRAN_DELETED = FALSE` be applied automatically by the system as a default behavior, rather than requiring admins to configure it manually as a row filter each time? | **Resolved 2026-05-19 — auto-add as a visible, editable default rule (not silent system filter).** When a model is created on a Fivetran-connected source, Data Studio pre-populates a row filter rule of `COALESCE(_FIVETRAN_DELETED, FALSE) = FALSE`. The rule appears in the row-filter configuration UI like any other rule — visible, auditable, editable. Users can adjust or remove it if they explicitly need to include soft-deleted rows (audit / reconciliation use cases). Generalizes to common filter templates for other source systems — see AC-FM5d-09 and D8. |
| OQ-13 | Does `IF_THEN` support `COALESCE` as a branch output — i.e., can the true/false branch of a condition return the result of a COALESCE expression rather than a constant? Relevant to JE Name and Combined Name patterns. | **Resolved 2026-05-18 — yes.** IF_THEN true/false branches accept arbitrary function expressions, not just literals or single-field refs. This is enabled by expression nesting (OQ-10 resolved at depth 5). AI Chat must generate IF_THEN with arbitrary expressions in branch positions. |

---

## Gaps

| # | Gap | Impact | Proposed Resolution |
|---|-----|--------|---------------------|
| G3 | Supported function library/syntax undefined — this was blocking in PRD 2a, now owned here | **Blocking** | Engineering to publish the function library spec before mapping editor can be fully designed or built |
| G5 | AI behavior when mapping description is ambiguous or unsupported is undefined | High | PM + Engineering to define fallback UX (e.g., clarifying questions, error message, suggested alternatives) |
| G7 | Error handling for AI-generated expressions that produce runtime errors on real data is undefined | High | Engineering to define runtime error surfacing — how are errors displayed, can the user revert, is the expression flagged? |
| G8 | No definition of how mapping logic interacts with versioning (does editing a mapping on a published model trigger a new Draft?) | **Resolved 2026-05-19 (OQ-7)** | Mapping expressions are read-only when the model is Published; editing requires moving the model to Draft (or creating a new Draft from Published). Cross-ref Sub-PRD 4 for the Draft-creation flow. ACs to update: AC-FM5-04 (autosave only applies in Draft state), Mapping Editor visibility (read-only chrome when published). |
| G9 | Sequential chain model is insufficient — full expression nesting required; **Q3 blocker** | **Blocking** | The current mapping pipeline supports sequential chaining but not nesting (using the output of one function as an argument to another). This limitation applies broadly: IF_THEN branches, CONCATENATE_COLUMNS arguments, ARITHMETIC operands, and any function whose input requires pre-processing. Complex field mappings confirmed as Q3 scope (e.g., Engagement Number, Engagement Name, Combined Name Logic) require 2–4 levels of nesting and cannot be expressed in a chain-only model. Resolution requires moving from a pipeline execution model to an expression tree model. This also affects AI Chat output format and the visual builder's UI representation. **Depth constraint resolved 2026-05-18 (OQ-10): cap at 5 levels.** Engineering still owns defining the execution model (pipeline → expression tree). |
| G10 | No intermediate computed field reference — forces expression repetition | High | The mapping model evaluates each target field independently from source fields only. There is no mechanism to define a derived field and reference its output as an input to another field's mapping on the same row — equivalent to a SQL CTE or subquery alias. This forces expression repetition, as seen in customer queries where CASE WHEN logic referencing a computed value must be repeated verbatim across multiple branches. Resolution: engineering to determine whether computed intermediate fields can be materialized and referenced within the same mapping pass, or whether this requires a two-pass model. |
| G11 | JSON/semi-structured field extraction not in current function library | High | Customer data from connectors including Coupa and NetSuite contains custom fields stored as JSON objects (e.g., `custom_fields['memo']`). Extracting values from these fields by key requires a dedicated `EXTRACT_JSON_FIELD` function that does not currently exist. Without it, any field mapped from a JSON source column cannot be mapped. Resolution: add `EXTRACT_JSON_FIELD(field, key)` to the function library (see AC-FM5b-13). |

---

## References

### Related Sub-PRDs

- [Overview & Index](https://floqast.atlassian.net/wiki/spaces/Data/pages/4444455089)
- [1 of 4: Model Creation & Source Configuration](https://floqast.atlassian.net/wiki/spaces/Data/pages/4450189505)
- [2a of 4: Field Mapping — Visual Refresh + AI-Suggested Mappings (6/30)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449927443)
- [3 of 4: Testing & Publishing](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449468593)
- [4 of 4: Versioning & Lifecycle](https://floqast.atlassian.net/wiki/spaces/Data/pages/4443013309)
- Data Explorer Tab (Sub-PRD 5)

### Related PRDs

- [QBO Transformation Functions (RBC)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4484530409/QBO+Transformation+Functions+DRAFT)

### Other References

- [Definitions & Terms](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409)
- [This PRD on Confluence](https://floqast.atlassian.net/wiki/spaces/Data/pages/4594892801/Mapping+Expressions+v2) — page ID: 4594892801
- Design Resources — *(placeholder)*
- Engineering References — *(placeholder)*

> **Note:** IDEA-2412 was the original Jira Polaris idea seeded for this work and has been retired from this PRD due to material scope change. A fresh JPD idea will be created after engineering signs off on the Q3 scope expansion (see G3 + G9).
