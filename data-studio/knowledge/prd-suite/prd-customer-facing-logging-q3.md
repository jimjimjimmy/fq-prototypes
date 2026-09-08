# Data Studio: Customer-Facing Logging Adjustments (Q3 2026)

| Field             | Value                                                                                                                                                                         |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Target release    | TBD                                                                                                                                                                           |
| Epic              | IDEA-2624                                                                                                                                                                     |
| Idea Link         | https://floqast.atlassian.net/jira/polaris/projects/IDEA/ideas/view/11291632?selectedIssue=IDEA-2624                                                                          |
| Document status   | Q3 DRAFT                                                                                                                                                                      |
| Document owner    | Alex Kearns                                                                                                                                                                   |
| Designer          | Natasha Clark                                                                                                                                                                 |
| Tech lead         | (assign)                                                                                                                                                                      |
| Technical writers | (assign)                                                                                                                                                                      |
| QA                | (assign)                                                                                                                                                                      |
| Depends on        | All Data Studio PRDs — error patterns apply platform-wide                                                                                                                     |
| Related sub-PRDs  | [Scheduling](prd-scheduling.md) · [On-demand Refresh](prd-on-demand-refresh.md) · [Logging & Audit Q3](prd-logging-audit-q3.md) · [Notifications Q3](prd-notifications-q3.md) |
| Supersedes        | Error Patterns & Handling Q3 2026 (Confluence page ID: 4507173269) · prd-error-patterns-q3.md                                                                                |

---

## 🎯 Objective

This PRD defines the error taxonomy and user-facing error messages for Data Studio. It establishes platform-wide standards for how errors are surfaced, what language is used, where they appear in the UI, and how users recover.

Not covered: internal logging or monitoring infrastructure (see Logging & Audit PRD), retry logic (out of scope for v1), engineering-facing error codes and stack traces (internal only), or email notifications for failures (see Notifications PRD).

Primary users: Data Studio admins configuring models and managing runs.

---

## 🔤 Definitions

For a complete glossary of terms, see the shared [Data Studio: Definitions & Terms](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869099) page.

---

## 🏅 Why This Is Important

Error states in Data Studio today are handled inconsistently — some failures surface cryptic system messages, others fail silently. When an admin can't tell what went wrong or how to fix it, the result is a support escalation, a delayed close, or loss of confidence in the data platform. Consistent, plain-language, actionable error messaging is foundational to a trustworthy product.

This is especially critical for a platform that sits upstream of the financial close. A silent failure or an unintelligible error message at the data collection layer can cascade into incorrect reconciliations, missed close deadlines, and compliance risk.

---

## 🔐 Value Unlocked

Admins can independently diagnose and recover from configuration errors and run failures without filing a support ticket or waiting for engineering. Error messages tell them specifically what broke, where it broke, and what to do next — reducing mean time to recovery and reducing support burden on FloQast.

---

## 🗝️ Key Examples

- **Example 1:** A trial balance file is received where the Amount column contains text values instead of numbers. Instead of a silent failure, the admin sees: "FloQast was not able to process this file because 'Amount' is a text data type and was expected to be a number. Correct the column in your source file."
- **Example 2:** A file arrives named `QB_TrialBalance_2024.xlsx` but the expected pattern requires a date segment like `YYYYMM`. The error clearly states the naming pattern wasn't matched and shows what was expected.
- **Example 3:** A transform function has a syntax error in a field mapping. On publish attempt, the admin sees inline on the affected row: "The formula in 'Net Amount' has an error: Missing closing parenthesis. Fix the formula before publishing."
- **Example 4:** A run fails and the root cause is unknown. The error shown to the admin includes a reference ID they can give to support — no stack trace, no internal system state.

---

## 💡 Key Benefits

- Plain-language, actionable error messages reduce support escalations and let admins self-serve
- Inline errors caught at configuration time prevent failures from reaching production runs
- Consistent error placement (inline vs. banner vs. in-app notification) sets clear user expectations across the platform
- File naming and parsing errors surface before data is lost — not after a silent failure
- Internal vs. external error separation protects technical detail from end users while preserving it for engineering

---

## ✅ Use Cases

| # | Persona | Scenario | Expected Outcome |
|---|---|---|---|
| 1 | Admin | A file is received where a column's data type doesn't match what the field mapping expects | Error identifying the specific column, its actual type, and what type was expected |
| 2 | Admin | A file is received whose name doesn't match the expected naming pattern | Error stating the file name didn't match and showing what was expected |
| 3 | Admin | A file is received where the system can't extract the expected date segment from the name | Error identifying which segment was missing or unreadable |
| 4 | Admin | Writes an invalid transform function in field mapping | Inline error on the field row identifying the specific syntax issue before publish |
| 5 | Admin | Scheduled run fails due to expired OAuth token | In-app notification + model page banner directing them to re-authorize in Connections |
| 6 | Admin | A password-protected or corrupted file is received by Data Studio | Error surfaced identifying the issue and indicating what format is expected |
| 7 | Admin | Scheduled run hits an API rate limit | Run log entry with plain-language explanation; no raw error code shown |

---

## 📊 Success Metrics

| Goal | Metric | Baseline | Target |
|---|---|---|---|
| Reduce support escalations from error states | % of support tickets attributed to unclear error messages | Unknown | Reduction TBD post-launch |
| Self-service recovery | % of run failures where admin takes a recovery action without support contact | Unknown | TBD |
| Error catch rate at config time | % of configuration errors caught inline (pre-save) vs. at run time | Unknown | TBD |

---

## 🤔 Assumptions

**Established**
- Technical error detail (stack traces, error codes) is logged internally for engineering and never surfaced to customers
- Every user-facing error message includes what went wrong AND what to do next where possible
- Errors are scoped to the specific field, file, or model causing the issue — not generic platform messages
- Error placement is determined by where the error originates: inline for configuration errors, banner for persistent model-level errors, in-app notification for run failures
- **Generic error messages are only permissible when the root cause genuinely cannot be determined.** They must never be used as a fallback for known failure types
- **When the root cause is unknown, a reference ID must be included** so the admin can provide it to support. The reference ID maps to the run or upload record in the internal log. (Reference ID captured at the job log level — see Logging & Audit PRD, AC-LA1-04)
- **Field-level errors must call out each affected field individually.** Multiple field failures must not be collapsed into a single aggregated message
- Files must not be lost due to transient system disruptions. The system must retain uploaded files through processing lifecycle interruptions and resume when ready
- Email notifications for run failures are defined in the Notifications PRD, not here. In-app notifications for run failures are in scope for this PRD

**Open Items to Confirm**
- Should partial run failures trigger the same in-app notification as full failures, or a separate warning-level notification?
- Should connection/auth error banners on the model page persist until resolved, or dismiss after the user views them?

---

## 🗺️ Scope

### 🚗 In Scope
- User-facing error message catalog for all error categories in Data Studio
- Placement guidelines: inline (config errors), banner (model-level persistent errors), in-app notification (run failures)
- Inline error messages for: invalid join key, join key type mismatch, row-level field type/value errors (wrong type, null in non-nullable field), empty file, file format error, invalid transform function, missing source field, missing required field values in delivered rows, file naming pattern mismatch, file name segment parsing failure, schema drift/change detected
- Run failure messages for: connection failure, auth/credential expiry, rate limit exceeded, partial run failure
- File processing resilience — files retained through transient system disruptions
- In-app failure notifications for run failures
- Error severity classification

### 🚦 Out of Scope
- Email notifications for run failures — see Notifications PRD
- User-facing error codes
- Automated error correction or AI-suggested fixes
- Retry logic (see Scheduling PRD)
- Internal monitoring and alerting infrastructure (see Logging & Audit PRD)

---

## 📋 Requirements — User Stories

### Quick Reference

| # | Story | Importance |
|---|---|---|
| EP1 | Invalid join key — inline error | High |
| EP2 | Join key type mismatch — inline error | High |
| EP3 | Row-level field type / value errors | High |
| EP4 | Empty file / file format error | High |
| EP5 | Connection failure at run time | High |
| EP6 | Auth / credential expiry | High |
| EP7 | Invalid transform function — inline error | High |
| EP8 | Source field no longer exists | High |
| EP9 | Rate limit exceeded | Medium |
| EP10 | Partial run failure | Medium |
| EP11 | File processing resilience | High |
| EP12 | File naming pattern mismatch | High |
| EP13 | File name segment parsing failure | High |
| EP14 | Schema drift / change detected | High |
| EP15 | Missing required field values in delivered rows | High |

---

### EP1 — Invalid Join Key

**User Story:** As an admin, I can see a clear inline error when I specify a join key field that doesn't exist in the source file so that I can fix the configuration before saving.

**Importance:** High

**Acceptance Criteria:**

**AC-EP1-01 — Inline error on invalid join key**
```
Given I select a field as a join key that doesn't exist in one of the source files
When I attempt to save or the field is validated
Then an inline error appears on the join key selector identifying the field name, which source file it wasn't found in, and prompting them to check the field exists and is spelled correctly
```

---

### EP2 — Join Key Type Mismatch

**User Story:** As an admin, I can see a clear inline error when my join keys are different data types so that I can fix the mismatch before running.

**Importance:** High

**Acceptance Criteria:**

**AC-EP2-01 — Inline error on type mismatch**
```
Given the left and right join keys are different data types
When the join configuration is validated
Then an inline error appears identifying both field names, their respective types, and stating that both keys must be the same type to join
```

---

### EP3 — Row-Level Field Type / Value Errors

**User Story:** As an admin, I can see a clear error when a file contains rows where a field's value is the wrong data type or is null when the field is non-nullable, so that I can identify and correct the specific rows in the source file before resubmitting.

**Importance:** High

**Acceptance Criteria:**

**AC-EP3-01 — Error identifies the column, type mismatch, and scope**
```
Given a file is received where one or more rows contain a value that is the wrong data type for a mapped field, or null where the field is non-nullable
When the file is processed
Then an error is surfaced identifying:
  - The field name and which source file it belongs to
  - The expected data type and what was found instead (or that the value was null / empty)
  - The total number of rows affected
  - The row numbers of each affected row
  - Example values from those rows to aid triage (e.g., the actual cell value that failed)
```

**AC-EP3-02 — Error distinguishes sparse failures from widespread ones**
```
Given the type or value error affects only a subset of rows in the file
When the error is surfaced
Then the message makes clear how many rows were affected relative to the total
(e.g., "5 of 1,203 rows" vs. "all but 5 rows")
So the admin can quickly assess whether this is a localized data issue or a systematic one
```

---

### EP4 — File Processing Errors

**User Story:** As an admin, I can see a clear error when a file received by Data Studio is empty, corrupted, or in an unsupported format so that I can identify and correct the issue.

**Importance:** High

**Acceptance Criteria:**

**AC-EP4-01 — Empty file error**
```
Given a file is received that contains no data rows
When the file is processed
Then an error is surfaced stating the file appears to be empty and prompting the admin to ensure a version with data rows is delivered
```

**AC-EP4-02 — File format error**
```
Given a file is received that is corrupted, password-protected, or not a supported format
When the file is processed
Then an error is surfaced stating the file couldn't be read and indicating what supported formats are accepted and that the file must not be password-protected
```

---

### EP5 — Connection Failure at Run Time

**User Story:** As an admin, I can see a clear error when a scheduled or manual run fails due to a connection issue so that I know what happened and how to recover.

**Importance:** High

**Acceptance Criteria:**

**AC-EP5-01 — Run history entry with plain-language error**
```
Given a scheduled or manual model run fails because the source system is unreachable
When the failure is recorded
Then the run history entry shows a plain-language explanation naming the source, indicating it may be a temporary issue, and suggesting the admin try again or check connection settings if it persists
```

**AC-EP5-02 — In-app failure notification**
```
Given a run fails due to a connection issue
When the failure is recorded
Then an in-app notification is sent to Data Studio admins with the model name, failure time, and a link to the run detail
```

---

### EP6 — Auth / Credential Expiry

**User Story:** As an admin, I can see a clear notification when a connection's credentials have expired so that I can re-authorize before the next run fails.

**Importance:** High

**Acceptance Criteria:**

**AC-EP6-01 — In-app notification on auth failure**
```
Given a run fails because an OAuth token has expired or credentials have changed
When the failure is detected
Then an in-app notification is sent naming the source connection, stating it needs re-authorization, and linking directly to Connections settings
```

**AC-EP6-02 — Banner on model page**
```
Given a connection auth failure has occurred
When I view the affected model's detail page
Then a banner is displayed indicating the connection needs re-authorization with a link to Connections settings
```

---

### EP7 — Invalid Transform Function

**User Story:** As an admin, I can see a clear inline error when a transform function in a field mapping has a syntax error so that I can fix it before publishing.

**Importance:** High

**Acceptance Criteria:**

**AC-EP7-01 — Inline error on invalid formula**
```
Given a transform function in field mapping has invalid syntax
When the field is validated (on blur or publish attempt)
Then an inline error appears on the affected field row naming the target field and describing the specific syntax issue
```

**AC-EP7-02 — Publish blocked on invalid formula**
```
Given one or more field mappings have invalid transform functions
When I attempt to publish the model
Then the publish action is blocked and the errors are highlighted inline on each affected row
```

---

### EP8 — Source Field No Longer Exists

**User Story:** As an admin, I can see a clear error when a mapped source field no longer exists in the source system so that I can update the mapping before the next run.

**Importance:** High

**Acceptance Criteria:**

**AC-EP8-01 — Inline error on missing source field**
```
Given a source field used in a mapping no longer exists in the source system
When the model is validated or a run fails for this reason
Then an inline error appears on the affected mapping row naming the missing field, the source it was expected in, and prompting the admin to update the mapping before running
```

---

### EP9 — Rate Limit Exceeded

**User Story:** As an admin, I can see a plain-language explanation when a run fails due to an API rate limit so that I understand what happened without seeing a raw error code.

**Importance:** Medium

**Acceptance Criteria:**

**AC-EP9-01 — Plain-language run log entry**
```
Given a run fails because the source API returns a rate limit error
When the failure is recorded
Then the run history entry shows a plain-language explanation naming the source, indicating the API is temporarily limiting requests, that Data Studio will retry automatically, and suggesting the admin reduce schedule frequency if it persists
And no raw HTTP status code is shown to the user
```

---

### EP10 — Partial Run Failure

**User Story:** As an admin, I can see a clear summary when a run completes with some records processed and some failed so that I can investigate and decide how to recover.

**Importance:** Medium

**Acceptance Criteria:**

**AC-EP10-01 — Partial failure summary in run history**
```
Given a run completes with some records processed successfully and some failed
When the run is recorded
Then the run history entry shows how many records were processed successfully, how many failed, and indicates where the admin can find further detail
```

---

### EP11 — File Processing Resilience

**User Story:** As an admin, I can trust that uploaded files will not be lost due to transient system disruptions so that I don't have to re-upload or re-trigger processing manually after a system interruption.

**Importance:** High

**Acceptance Criteria:**

**AC-EP11-01 — Files retained through transient disruptions**
```
Given a file has been successfully uploaded
When a transient system disruption occurs during processing (e.g., service interruption, timeout)
Then the file is retained and processing resumes once the system is ready
And the file is not marked as failed or discarded due to the transient state alone
```

**AC-EP11-02 — Admin visibility into processing resumption**
```
Given processing was interrupted and has resumed
When the admin views the run or upload status
Then the status reflects the current processing state accurately
And the admin is not shown a failure that resolves without their action
```

---

### EP12 — File Naming Pattern Mismatch

**User Story:** As an admin, I can see a clear error when an uploaded file's name doesn't match the expected naming pattern so that I can correct the file name or update the pattern configuration.

**Importance:** High

**Acceptance Criteria:**

**AC-EP12-01 — Error on file name pattern mismatch**
```
Given a file is uploaded whose name does not match the configured naming pattern
When the file name is validated
Then an error message is shown stating that the file name did not match the expected pattern
And where possible, the expected pattern is shown so the admin understands what is required
```

**AC-EP12-02 — File is not processed until the name matches**
```
Given a file name pattern mismatch has been detected
When the error is shown
Then the file is not processed further until the naming issue is resolved
```

---

### EP13 — File Name Segment Parsing Failure

**User Story:** As an admin, I can see a clear error when the system cannot extract an expected segment from a file name (e.g., date, entity code) so that I know exactly what was unreadable and can correct it.

**Importance:** High

**Acceptance Criteria:**

**AC-EP13-01 — Error identifies the unreadable segment**
```
Given a file name is matched to the configured pattern
But a required segment (e.g., date, entity code, period) cannot be parsed from the name
When the file name is processed
Then an error message is shown stating that the system could not extract the specific segment from the file name
And identifies which segment was missing or unreadable
```

**Example message:** "FloQast was not able to detect the accounting period from the file name, based on the existing file configurations."

---

### EP14 — Schema Drift / Change Detected

**User Story:** As an admin, I can see a clear error when a source file's schema has changed from what was configured in Data Studio so that I understand why processing failed and know exactly what steps to take to resolve it.

**Importance:** High

**Context:** Data Studio does not currently support schema changes. When a schema change is detected (columns added, removed, or renamed), the file cannot be processed against the existing model configuration. The admin must either correct the source file to match the original schema, or create a new source dataset and rebuild the downstream models to reflect the new schema.

**Acceptance Criteria:**

**AC-EP14-01 — Error identifies the schema change and what changed**
```
Given a file is received whose schema differs from the configured source dataset definition
When the file is processed
Then an error is surfaced identifying that a schema change was detected
And the error names which column(s) were added, removed, or changed (including type changes where detectable)
```

**AC-EP14-02 — Error presents both resolution paths**
```
Given a schema change error has been detected
When the error is displayed to the admin
Then the message presents two resolution options:
  1. Fix the source file — revert the schema to match the existing dataset definition and re-deliver the file
  2. Create a new source dataset — if the schema change is intentional, a new source dataset definition and subsequent model(s) must be created to reflect the new structure
And the message makes clear that the existing model cannot process the changed file without one of these actions
```

---

### EP15 — Missing Required Field Values in Delivered Rows

**User Story:** As an admin, I can see a clear error when rows in a delivered file are missing values for required fields so that I can identify the specific rows, understand the scope of the problem, and correct the source file before resubmitting.

**Importance:** High

**Note:** This is distinct from EP8 (source field no longer exists in the mapping configuration). EP15 covers a data delivery problem — the column is present and mapped correctly, but individual rows contain no value where one is required.

**Acceptance Criteria:**

**AC-EP15-01 — Error identifies the field, affected rows, and scope**
```
Given a file is received where one or more rows have no value for a required field
When the file is processed
Then an error is surfaced identifying:
  - The required field name and which source file it belongs to
  - The total number of rows with a missing value for that field
  - The row numbers of each affected row
  - Example values from other fields on those rows to help the admin locate them in the source file
```

**AC-EP15-02 — Error distinguishes sparse failures from widespread ones**
```
Given the missing value occurs on only a subset of rows
When the error is surfaced
Then the message makes clear how many rows were affected relative to the total
(e.g., "3 of 892 rows are missing a value for 'Vendor ID'")
So the admin can quickly assess whether this is a localized gap or a systematic data issue
```

---

## 🎨 User Interaction & Design

Open UX questions for Natasha & Kristin:
- Visual treatment for inline errors — red border on the field, inline text below, or tooltip?
- Should auth/connection error banners on the model page be dismissible, or persist until the issue is resolved?
- Is there a distinct "warning" visual treatment for partial run failures vs. full failures?
- What does error detail look like in the run history for partial failures?

---

## ✏️ UI Changes

- Inline error states on join key selectors
- Inline error states on field mapping rows (invalid function, missing source field)
- Inline error states on file upload (empty file, format error, naming pattern mismatch, segment parsing failure)
- Publish validation gate — blocks publish and highlights errors when field mapping errors exist
- Run history: plain-language error detail on expand for failed runs
- In-app notification for run failures (connection, auth)
- Model page banner for persistent auth/connection errors

---

## 😎 Future Considerations

- **AI-suggested fixes:** For field mapping errors, proactively suggest the correct field name or syntax fix.
- **Error report download:** Customer-facing export of failed records for partial run failures.
- **Automated retry on connection failure:** Retry once after a configurable delay before marking a run as failed.

---

## ❓ Open Questions

| # | Question | Owner | Status | Answer |
|---|---|---|---|---|
| OQ-1 | Should partial run failures trigger the same in-app notification as full failures, or a warning level? | Alex K / Natasha | Open | |
| OQ-2 | Should auth error banners persist until resolved, or dismiss after the user views them? | Alex K / Natasha | Open | |
| OQ-3 | When a file name pattern mismatch is detected, is the file held for reprocessing once the issue is resolved, or must it be re-delivered? | Alex K / Engineering | Open | |
| OQ-4 | Is in-app re-run (triggering a new run from the Logs tab after a failure) supported in Q3? If not, references to run history as a recovery surface should be updated and the Re-run action deferred. | Alex K / Engineering | Open | |

---

## 🚫 Gaps

| # | Gap | Impact | Proposed Resolution |
|---|---|---|---|
| G1 | Error report download for partial failures | Medium | Deferred to future iteration |
| G2 | Automated retry on connection failure | Low | On-demand re-run is v1 recovery path |
| G3 | Visual design for error states not yet defined | Medium | UX open questions above; Natasha to resolve before engineering implementation |

---

## 📚 References

### Related Sub-PRDs
- [Logging & Audit Q3](prd-logging-audit-q3.md)
- [Notifications Q3](prd-notifications-q3.md)
- [Scheduling](prd-scheduling.md)
- [On-demand Refresh](prd-on-demand-refresh.md)

### Design Resources
- Figma: Lineage Product — https://www.figma.com/design/pF3J27wNhb7TRnCmmJGrB9/Lineage---Product?node-id=1-2

### Engineering References
- IDEA-2624: https://floqast.atlassian.net/jira/polaris/projects/IDEA/ideas/view/11291632?selectedIssue=IDEA-2624
