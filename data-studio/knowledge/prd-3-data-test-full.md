# Data Test

| Field                 | Value                                                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Status**            | DRAFT                                                                                                                                            |
| **Last updated**      | 2026-06-04                                                                                                                                       |
| **Owner**             | Alex Kearns                                                                                                                                      |
| **Target release**    | 2026-09-30                                                                                                                                       |
| **Epic**              | *(link to epic)*                                                                                                                                 |
| **Idea Link**         | IDEA-2627                                                                                                                                        |
| **Document status**   | DRAFT                                                                                                                                            |
| **Document owner**    | @Alex Kearns                                                                                                                                     |
| **Designer**          | Natasha Clark                                                                                                                                    |
| **Tech lead**         | *(assign)*                                                                                                                                       |
| **Technical writers** | *(assign)*                                                                                                                                       |
| **QA**                | *(assign)*                                                                                                                                       |
| **Depends on**        | PRD 2b (Mapping Expressions v2) — field-level mapping expression detail UI is directional pending PRD 2b UI evolution                            |
| **Related sub-PRDs**  | 1 of 4: Model Creation & Source Configuration · 2a of 4: Field Mapping (6/30) · 2b of 4: Mapping Expressions v2 · 4 of 4: Versioning & Lifecycle |
| **Supersedes**        | [3 of 4: Testing & Publishing (original Q2 PRD)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449468593)                                |
|                       |                                                                                                                                                  |

---

## Objective

This PRD covers the Data Test capability within Data Studio — the in-context testing surface that lets admins validate field mappings and mapping expressions against real data before publishing. Data Test is how admins build confidence in their models before they go live.

Data Test applies to **all model types** — including dimension-type models. A dimension is a model: it is built with the same Sources → Field Mappings → Versions structure as any other model in Catalog. Whether a model is accessed via the Catalog tab or the Dimensions tab (which is a managed, filtered view of dimension-type models), the Field Mappings sub-tab and Data Test surface are identical. Any reference in this PRD to "models" includes dimension-type models unless explicitly noted otherwise.

The original Testing & Publishing PRD (3 of 4) scoped this capability for Q2 (6/30) with mapped field values only. That scope has been unified: the 6/30 and 9/30 milestones are now a single Q3 delivery. This PRD replaces the original and incorporates brainstorm decisions made in May 2026, including the two-section results layout, a two-path data source model (sample vs. live), user-controlled row selection, and sensitive column error handling.

Publishing mechanics (Effective Date, version state transitions, publish-time validation) are included here as they are the final step in the same workflow, reached after testing confirms the model is ready.

---

## Definitions

See [Definitions & Terms](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409) for shared terminology used across the Model Creation PRD suite.

---

## Why This Is Important

Data Test is where admins go from "I think this is right" to "I know this is right." It is the point in the workflow where mapping errors — type coercion failures, null mismatches, expression logic bugs — can be caught and fixed before any data reaches downstream products. Without a capable test surface, admins have no reliable way to build that confidence; they must publish to discover failures.

**Current state limitations:**

- The existing test experience reads only from the connector's uploaded sample file and surfaces the first 5–6 rows — admins cannot target known edge-case rows or test against real production data
- Mapping expression output is not shown in the current test results; only source-to-target mappings are visible
- Sensitive field handling is undefined — error detail currently exposes raw failing values regardless of field sensitivity designation
- The "Fix this" navigation from an error back to the field mapping row is undefined, creating friction when iterating on errors
- Error messages are opaque — Marty Mammel (Reporting, May 2026): *"Data type mismatch as an error message is very opaque and hard to determine how to fix the error. The mapping rules have similarly difficult to understand errors like 'Cannot proceed: failed to apply SAFE_CAST_STRING'."* Admins cannot self-diagnose failures without escalating to engineering.

RBC has identified testing as a high-friction point in her current workflow — "running into issues" today — reinforcing that Q3 must address real gaps, not just add new surface area.

---

## Key Benefits

| Benefit | Description |
|---------|-------------|
| **Test against real data** | Live data option surfaces production-like edge cases that uploaded sample files miss — reduces surprise failures at publish time |
| **Targeted row testing** | Row selection lets admins focus the test on specific records — known problem rows, edge cases, specific entity subsets — rather than accepting whatever rows happen to be first |
| **Mapping expression output visible** | Admins can see the result of every mapping expression — not just source-to-target mapping — before publishing; iteration stays in the test surface |
| **Privacy-safe testing path** | Sample file path is a privacy-preserving option, particularly valuable for implementation partners setting up a new customer's model before real data has flowed |
| **Sensitive column error safety** | Error detail for sensitive fields does not expose raw failing values — compliance and privacy controls carry through from the field mapping layer into the test surface |

---

## Use Cases

### UC1 — Pre-publish validation of mapping expressions

An admin has defined mapping expressions for several fields (date format conversions, COALESCE logic, CASE WHEN normalization). Before publishing, the admin opens the test panel and runs the model against a selected date's live data. The test results show both raw source values and computed mapped outputs side by side. The admin identifies a type coercion failure on one field, uses "Fix this" to navigate to the field mapping row, corrects the expression, and re-runs the test — all without leaving the mapping context.

### UC2 — Edge-case targeting with row selection

An admin knows that a handful of specific rows in the source dataset have historically caused failures — unusual date formats, null vendor IDs, or multi-currency amounts. The admin opens the test panel, selects live data for a specific as-of date, and uses row selection to target those specific records. This gives confidence that the mapped model handles known edge cases before publishing.

### UC3 — Enum field validation across a wide row sample

An admin is mapping a source field to a FQ target field that only accepts a defined set of values — an enum. With the current test experience limited to the first 5–6 rows of the uploaded sample file, there is no way to know whether the full range of values in production will pass validation. Certain values may only appear in specific periods, entities, or transaction types that are not represented in those first rows. The admin uses row selection to pull a broader, more representative set of records — spanning multiple periods or entity types — and runs the test. A handful of source values that don't match the allowed enum surface as errors before publish. The admin corrects the mapping expression (e.g., using CASE_WHEN to normalize unexpected values) and re-runs without reconfiguring the test.

### UC4 — Privacy-preserving setup for a new customer


An implementation partner is setting up a new customer's GL transaction model, sourced from the customer's ERP via SFTP. The customer hasn't pushed their first real file yet — the connector is configured, the sample file has been uploaded, and the field mappings are defined, but no live data has flowed. The admin uses the sample file path to validate the mapping logic against the uploaded sample before go-live. The sample data path is intentionally surfaced as an option in the as-of date picker, not hidden behind a fallback.

### UC5 — Investigating an error on a sensitive field

An admin runs the test and sees a mapping error on a field tagged as sensitive (e.g., employee salary). The error card shows the field name, the error reason (type coercion failure), and the affected row reference — but does not expose the raw failing value. The admin navigates to the field mapping row to investigate without the test surface ever surfacing the underlying sensitive data.

### UC6 — Publishing the model after a clean test

An admin has run the test, resolved all errors, and confirmed mapped output looks correct. The admin clicks Publish, is prompted for an Effective Date, confirms the publish, and the model moves to Active. Data processing begins. The Data Explorer tab becomes available.

---

## Success Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| **Pre-publish error discovery rate** | % of mapping errors caught in the test surface vs. discovered post-publish | Increase vs. baseline (measure in beta) |
| **Test-to-publish iterations** | Median number of test runs before a successful publish | Decrease vs. baseline |
| **Time from test open to publish** | Median time from first opening the test panel to successful publish | Decrease vs. baseline |
| **Sensitive field error exposure incidents** | Count of raw sensitive values exposed in error detail | 0 |

---

## Assumptions

- Test functionality is admin-only access level — the same access level required for field mapping configuration. Admins are trusted users in a debugging context; masking source values in the test panel would make the feature unusable.
- Sensitive column designations from the field mapping layer carry through to the test surface — error detail must not expose raw values for fields flagged sensitive.
- The two-section results layout (Raw Source Data + Mapped Output) is established; the field-level mapping expression detail UI within the expanded row view is **directional and subject to revision** as PRD 2b's mapping expression authoring UI evolves.
- The sample file read capability already exists (first 5–6 rows from the connector's uploaded sample file); Q3 expands this, not replaces it.
- Mapping logic autosave (PRD 2b) means the test always reflects the current draft state, not a separately saved snapshot.

---

## Scope

### In Scope (Q3 — 9/30)

- Test panel accessible from the Field Mappings tab, inline/split-view — stays in mapping context
- Two-section test results layout: **Raw Source Data** (source columns and values) and **Mapped Output** (mapped field results with status indicators)
- Field-level mapping expression detail in expanded row view — shows source field(s) and value, mapping expression, and computed result per field (directional; subject to revision as PRD 2b UI evolves)
- **Two-path data source model:**
  - Sample file path — uses the connector's uploaded sample file; privacy-preserving; surfaced as an explicit option in the as-of date picker
  - Live data path — tests against real production data for a selected as-of date; requires data to have flowed through the connector
- Row selection — admins choose which rows to test against, not just the first 5–6
- Sensitive column error handling — error cards for sensitive fields show field name, error reason, and row reference only; raw failing value is not exposed
- Error surfacing per field in test results (inline on affected column)
- Error detail: failing field + human-readable reason + affected row reference
- Error count summary in header
- "Fix this" CTA — navigates back to the affected field mapping row
- Re-run test after fix without re-selecting filters
- Publish flow: Publish button, mandatory field validation before Effective Date prompt, Effective Date dialog, confirm publish, Draft → Active transition
- Data Explorer tab available post-publish

### Out of Scope

- Data Explorer tab content and layout — separate sub-PRD
- Testing against live data from a source not yet synced (partial dataset handling — see OQ-5)
- CSV upload for testing (decided against — sample file read already exists; live data fills the gap)
- Non-admin access to the test panel (REBAC / viewer access is a post-Q3 consideration — see Data Explorer PRD for the downstream surface)
- Scheduled or automated test runs
- Versioning and rollback mechanics for Effective Date — see Sub-PRD 4 (Versioning & Lifecycle)

---

## Requirements Quick Reference

| ID | Requirement | Priority |
|----|-------------|----------|
| DT1 | Test Panel & Two-Section Results Layout | High |
| DT2 | Data Source & As-Of Date Selection | High |
| DT3 | Row Selection & Filtering | High |
| DT4 | Sensitive Column Error Handling | High |
| DT5 | View and Resolve Field Mapping Errors | High |
| DT6 | Publish Model | High |

---

## Detailed Requirements

### DT1 — Test Panel & Two-Section Results Layout

**User Story:** As an admin, I want to run a test of my field mappings and see both the raw source values and the computed mapped output so I can validate correctness before publishing.

**Importance:** High

**Details:** The test panel is accessible from the Field Mappings tab and keeps admins in the mapping context — the exact presentation (inline split-view, drawer, or modal) is a design decision to be resolved with Natasha Clark. All three patterns are on the table; the key constraint is that the admin should be able to move between the test results and the field mapping rows without losing their test state. Results are organized into two sections: Raw Source Data (source columns and values as ingested) and Mapped Output (mapped field results with status indicators per field). When a row is expanded, a field-level detail view shows the mapping expression breakdown per field: source field(s) and value, mapping expression, and computed result. This field-level detail is directional and subject to revision as the PRD 2b mapping expression authoring UI evolves.

**Acceptance Criteria:**

**AC-DT1-01 — Test panel accessible from Field Mappings tab**
- Given I am on the Field Mappings tab
- When I open the test panel
- Then the test panel opens (inline, split-view, drawer, or modal — per design) and I remain in the mapping context without fully navigating away

**AC-DT1-02 — Test reflects current draft state**
- Given I have made changes to field mappings or expressions in the current draft
- When I open or refresh the test panel
- Then the test reflects the current draft state (not a separately saved snapshot or the last published version)
- And a clear "no data loaded" state is shown when no test has been run yet

**AC-DT1-03 — Two-section results layout**
- Given I have run a test
- When I view the test results
- Then results are organized into two sections: **Raw Source Data** (source columns and values as ingested) and **Mapped Output** (mapped field results with status indicators)
- And both sections are visible in the same results view

**AC-DT1-04 — Expanded row shows field-level mapping expression detail**
- Given I have run a test and results are displayed
- When I expand a result row
- Then I see a field-level breakdown for that row, showing per mapped field: source field name(s), source value, mapping expression, and computed result
- And error states in the field detail are visually distinguished (e.g., `—` result with error indicator for failures)

---

### DT2 — Data Source & As-Of Date Selection

**User Story:** As an admin, I want to choose between testing against my uploaded sample file or live production data so I can validate mappings in the right context for my situation.

**Importance:** High

**Details:** The as-of date picker surfaces two sections — Sample Data and Live Data — as an intentional, explicit choice. Sample Data uses the connector's uploaded sample file and is the privacy-preserving path suitable when real data has not yet flowed (e.g., new customer setup by an implementation partner). Live Data tests against real production data for the selected date. Both paths must be clearly labeled in the UI with enough context for the admin to choose deliberately. The default is the most recent date/source with available data.

**Acceptance Criteria:**

**AC-DT2-01 — Sample Data and Live Data options in the date picker**
- Given I open the data source / as-of date picker in the test panel
- When I view the options
- Then I see two distinct sections: **Sample Data** and **Live Data**
- And Sample Data references the connector's uploaded sample file
- And Live Data shows available dates for which real ingested data exists

**AC-DT2-02 — Default to most recent available data**
- Given I open the test panel
- When no explicit selection has been made
- Then the default selection is the most recent date or source with available data

**AC-DT2-03 — Loading state while data fetches**
- Given I have selected a data source and as-of date
- When data is being fetched for the test
- Then a loading state is shown while the test runs

**AC-DT2-04 — Sample Data path available when no live data has flowed**
- Given no live data has been ingested for this connector yet
- When I open the data source picker
- Then the Sample Data option is still available (using the uploaded sample file)
- And Live Data is shown as unavailable or empty with a clear explanation

---

### DT3 — Row Selection & Filtering

**User Story:** As an admin, I want to select which rows I test against so I can target specific edge cases or known problem records rather than accepting a fixed first-N sample.

**Importance:** High

**Details:** Row selection replaces the fixed first-5–6-row behavior. Admins can choose which records to include in the test run. When an entity field is mapped, an entity filter is also available. Row-level filters on any visible column are supported. The test runs against the selected/filtered dataset.

**Acceptance Criteria:**

**AC-DT3-01 — Row selection for test data**
- Given I have chosen a data source (sample or live)
- When I configure the test
- Then I can select which rows to include in the test run
- And I am not limited to the first 5–6 rows of the source

**AC-DT3-02 — Entity filter when entity field is mapped**
- Given an entity field is mapped in the model
- When I open row selection
- Then I can filter by entity — selecting one or more entities to include in the test
- And multi-entity selection is supported

**AC-DT3-03 — Select all when entity field not mapped**
- Given no entity field is mapped in the model
- When I open row selection
- Then all records are included by default (Select All behavior)

**AC-DT3-04 — Row-level column filters**
- Given I am configuring the test
- When I apply row-level filters
- Then I can filter rows by value on any visible column in the source data
- And the test runs against only the rows that satisfy the filter conditions

**AC-DT3-05 — Re-run test without re-selecting**
- Given I have run a test with a specific row selection and filter configuration
- When I fix a mapping error and want to re-run
- Then I can re-run the test without re-configuring row selection or filters

---

### DT4 — Sensitive Column Error Handling

**User Story:** As an admin, I want to see enough error detail to diagnose and fix a mapping failure on a sensitive field without the test surface exposing the underlying raw data value.

**Importance:** High

**Details:** Fields designated as sensitive in the field mapping layer carry that designation into the test surface. When a mapping error occurs on a sensitive field, the error detail card shows the field name, the error reason (e.g., type coercion failure), and the affected row reference — but does not expose the raw failing value. Non-sensitive fields are unaffected; their error detail may include the raw value as needed for diagnosis.

**Acceptance Criteria:**

**AC-DT4-01 — Sensitive field designation carries into test surface**
- Given a field is designated as sensitive in the field mapping configuration
- When a mapping error occurs on that field during a test run
- Then the error detail card does not expose the raw failing value
- And the card shows: field name, human-readable error reason, and row reference

**AC-DT4-02 — Non-sensitive field error detail unchanged**
- Given a field is not designated as sensitive
- When a mapping error occurs on that field during a test run
- Then the error detail card may include the raw failing value to aid diagnosis
- And behavior is consistent with current error surfacing

**AC-DT4-03 — Sensitive field indicator visible in test results**
- Given a field is designated as sensitive
- When I view test results columns in the Raw Source Data section
- Then a sensitive field indicator is shown on the column header (awareness only — no masking of values from admins in the test context)

---

### DT5 — View and Resolve Field Mapping Errors

**User Story:** As an admin, I want to see mapping errors clearly and navigate directly to the affected mapping row so I can fix them without losing my place in the test.

**Importance:** High

**Details:** Errors are surfaced per field inline on the affected column in test results. Runtime data errors (type coercion failures on specific rows, nulls in required fields, unexpected values) are captured — not just schema-level mismatches. An error summary count is shown in the test panel header. Each error has a "Fix this" CTA that navigates back to the affected field mapping row. After fixing, the admin can re-run the test without reconfiguring the test setup. Error rows are visually distinguished from successful rows; errors don't block viewing successful rows.

**Acceptance Criteria:**

**AC-DT5-01 — Errors surfaced inline per field**
- Given a test run produces errors
- When I view the test results
- Then errors are surfaced inline on the affected column for each failing field
- And successful rows are still visible alongside error rows

**AC-DT5-02 — Runtime data errors captured**
- Given a test run is executed against real or sample data
- When actual data values flow through the mapping expressions
- Then runtime errors are caught and surfaced: type coercion failures on specific rows, nulls in required fields, unexpected values that do not match the target type

**AC-DT5-03 — Error detail per field**
- Given an error is shown on a field in test results
- When I inspect the error
- Then I see: the failing field name, a human-readable error reason, and the affected row reference
- And for sensitive fields, the raw value is not shown (per DT4)

**AC-DT5-04 — Error count summary in header**
- Given a test run has produced one or more errors
- When I view the test panel
- Then a summary error count is shown in the test panel header

**AC-DT5-05 — "Fix this" navigates to affected field mapping row**
- Given an error is shown for a field in test results
- When I click "Fix this" (or equivalent action)
- Then I am navigated to the affected field mapping row in the Field Mappings tab
- And the row is highlighted or focused so I can immediately identify what to fix

---

### DT6 — Publish Model

**User Story:** As an admin, I want to publish a validated model so it becomes Active and downstream FQ products can begin receiving data.

**Importance:** High

> **Scope boundary:** This requirement covers the publish action itself — the mechanics of moving a Draft model to Active for the first time. Broader versioning concerns (creating a new Draft from a Published model, version-merge semantics, version history, rollback) are out of scope here and will be addressed as a separate PM workstream (Sub-PRD 4: Versioning & Lifecycle). The content here is still applicable; it just does not attempt to be the full versioning spec.

**Details:** Publish is the final step after testing confirms the model is ready. A Publish button in the model header or top-right initiates the flow. Before the Effective Date dialog appears, publish-time validation runs — mandatory unmapped fields block publish. The Effective Date dialog explains the implications of the selected date in plain language (including the V0 default of Jan 1, 1900 as a full historical backfill). After confirmation, the model transitions from Draft to Active and data processing begins.

**Acceptance Criteria:**

**AC-DT6-01 — Publish button accessible from model header**
- Given I am viewing a model in Draft state
- When I am ready to publish
- Then a Publish button is accessible in the model header or top-right

**AC-DT6-02 — Publish blocked if mandatory fields are unmapped**
- Given one or more mandatory target fields are unmapped
- When I attempt to publish
- Then publish is blocked and the specific unmapped mandatory fields are surfaced
- And the Effective Date dialog does not appear until mandatory fields are resolved

**AC-DT6-03 — Effective Date prompt before publish completes**
- Given mandatory field validation has passed
- When I proceed with publishing
- Then an Effective Date dialog appears before the publish completes
- And the dialog explains the implications of the selected date in plain language — including that the V0 default of Jan 1, 1900 triggers a full historical backfill

**AC-DT6-04 — Confirm Publish is deliberate**
- Given the Effective Date dialog is open
- When I confirm the publish
- Then the confirm action is deliberate (not a single-click accident) — a two-step confirmation or clear confirm button distinct from cancel

**AC-DT6-05 — Draft transitions to Active on successful publish**
- Given I have confirmed the publish
- When the publish completes successfully
- Then the model transitions from Draft to Active
- And data processing begins
- And the Data Explorer tab becomes available

**AC-DT6-06 — Failed publish returns model to Draft**
- Given a publish fails (e.g., infrastructure error, validation failure discovered late)
- When the failure occurs
- Then the model remains in Draft state
- And a clear error message explains the reason for failure
- And the admin can retry publish

---

## User Flow Reference

Data Test corresponds to the final pre-publish steps of the overall Model Creation workflow:

| Step | Description |
|------|-------------|
| Step 18 | Open test panel from Field Mappings tab |
| Step 19 | Select data source (sample or live) and as-of date |
| Step 20 | Select rows / apply filters |
| Step 21 | Run test — view Raw Source Data and Mapped Output |
| Step 22 | Resolve errors via "Fix this" → field mapping row → re-run |
| Step 23 | Publish — mandatory field check → Effective Date → confirm → Active |

---

## User Interaction & Design

### Key Design Questions

- How is the test panel presented — inline split-view alongside the field mapping grid, a drawer, or a modal? All three are on the table; the deciding factor is how well each supports moving between test results and field mapping rows without losing test state.
- How is row selection UI presented — a row picker modal, inline checkboxes, or a filter-based approach?
- What does the expanded row / field-level mapping expression detail look like as a component? How does it accommodate PRD 2b UI evolution?
- What does "Fix this" navigation look like — does the test panel minimize, collapse, or remain visible while the admin edits the field mapping row?
- How does the Effective Date dialog communicate full historical backfill implications clearly without alarming users?

### Key Design Decisions

- **Test panel stays in the Field Mappings context** — inline split-view, drawer, and modal are all viable patterns; the key requirement is that the admin can move between test results and field mapping rows without losing test state. Design decision owned by Natasha Clark.
- **Test access is admin-only** — no obfuscation or masking of source values (admins are trusted in a debugging context)
- **Sample Data and Live Data are explicit options** — not a fallback/primary hierarchy; both are intentional paths surfaced in the as-of date picker
- **Field-level mapping expression detail is directional** — not final; will be revised as PRD 2b's mapping expression authoring UI evolves

---

## UI Changes

| Change | Description |
|--------|-------------|
| Test panel | Inline/split-view within Field Mappings tab; two-section results layout (Raw Source Data + Mapped Output) |
| As-of date picker | Updated with Sample Data / Live Data groupings |
| Row selection | New — allows targeting specific rows, replacing fixed first-N behavior |
| Field-level mapping expression detail | Expanded row view showing source → expression → result per field (directional) |
| Sensitive field error cards | Show field name, reason, row ref only — no raw value exposure |
| "Fix this" CTA | Navigation from error card to affected field mapping row |

---

## Future Considerations

- **Dimension resolution preview** — For models with fields linked to a dimension sourced from a separate file (e.g., a `department_id` field on a GL Transactions model linked to a Department dimension), show in the test results whether each source value resolves to a matching entry in the dimension table. Values that don't match any dimension row would be flagged inline — giving admins referential integrity checking at test time, before publish. This is distinct from mapping expression validation (is the expression correct?) and adds a second layer: "will this data actually join cleanly to the dimension?" Post-Q3 candidate; complexity depends on whether the dimension data is available and queryable at test time.
- **Non-admin access to test results** — REBAC-gated viewer access to a read-only test output view; post-Q3, tracked alongside Data Explorer
- **Scheduled or automated test runs** — Running the test automatically as part of a scheduled refresh cycle; post-Q3
- **Partial dataset availability handling** — Clear UX for when only some entity data has synced for the selected date (see OQ-5)
- **CSV upload for testing** — Not prioritized given the sample file + live data two-path model; revisit if real implementation partner use cases emerge that the sample file path doesn't cover

---

## Open Questions

| # | Question | Status |
|---|----------|--------|
| OQ-1 | Jan 1, 1900 confirmed as default Effective Date for V0? What is the cost/time of a full historical backfill? | Open — Engineering / Data Platform |
| OQ-2 | Unmapped mandatory fields: hard block on publish, or warning with override? | Open — Engineering / PM |
| OQ-3 | Should V0 expose the Effective Date selector at all, or always default to Jan 1, 1900? | Open — PM |
| OQ-4 | Can users upload CSV to test when no data loaded? | **Resolved — No.** Sample file read already exists; Q3 adds live data option and row selection. CSV upload is not needed. |
| OQ-5 | Partial dataset availability for the selected date: proceed with warning, or block? | Open — Engineering / PM |
| OQ-6 | "Fix this" navigation: does the test panel minimize, collapse, or remain visible while the admin edits the field mapping row? | Open — PM / Design |
| OQ-NEW | Does the field-level mapping expression detail UI need to be redesigned before Q3 ships, or does PRD 2b land first? Sequencing and dependency needed. | Open — PM / Engineering |

---

## Gaps

| # | Gap | Impact | Proposed Resolution |
|---|-----|--------|---------------------|
| G1 | Error path for failed publish is undefined | High | Engineering to define failure states, user messaging, and retry mechanics for a failed publish operation |
| G2 | Jan 1, 1900 default not confirmed with Data Platform team | **Blocking** | Confirm with Engineering / Data Platform before Effective Date dialog can be designed |
| G3 | "Fix this" navigation pattern undefined | High | PM + Design to define navigation behavior — does the test panel minimize, collapse, or stay visible while the admin edits? |
| G4 | Partial dataset availability UX undefined | Medium | Engineering + PM to define behavior when only some entity data has synced for the selected date |

---

## References

### Related Sub-PRDs

- [Overview & Index](https://floqast.atlassian.net/wiki/spaces/Data/pages/4444455089)
- [1 of 4: Model Creation & Source Configuration](https://floqast.atlassian.net/wiki/spaces/Data/pages/4450189505)
- [2a of 4: Field Mapping — Visual Refresh + AI-Suggested Mappings (6/30)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449927443)
- 2b of 4: Mapping Expressions v2 (this PRD's primary dependency — see IDEA-2627)
- [4 of 4: Versioning & Lifecycle](https://floqast.atlassian.net/wiki/spaces/Data/pages/4443013309)

### Other References

- [Definitions & Terms](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409)
- [This PRD on Confluence](https://floqast.atlassian.net/wiki/spaces/Data/pages/4622778629/Test+Mapping+Expressions+Q3+2026) — page ID: 4622778629
- [Original Testing & Publishing PRD (superseded)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449468593)
- Data Test brainstorm session — `playspace/data-studio/q3/data-test/brainstorm.md`
- Design Resources — *(placeholder)*
- Engineering References — *(placeholder)*
