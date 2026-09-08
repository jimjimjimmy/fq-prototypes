# Model Creation — Data Preview Tab (DRAFT)

| Field | Value |
|---|---|
| **Target release** | 2026-06-30 |
| **Epic** | _(link to epic)_ |
| **Idea Link** | _(add link)_ |
| **Document status** | DRAFT |
| **Document owner** | Alex Kearns |
| **Designer** | _(assign)_ |
| **Tech lead** | _(assign)_ |
| **Technical writers** | _(assign)_ |
| **QA** | _(assign)_ |
| **Depends on** | Connection(s) must be configured, a Model with an Active version must exist, and at least one successful pipeline run must have completed. |
| **Related sub-PRDs** | [1 of 4: Model Creation & Source Configuration](https://floqast.atlassian.net/wiki/spaces/Data/pages/4450189505) · [2 of 4: Field Mapping](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449927443) · [3 of 4: Testing & Publishing](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449468593) · [4 of 4: Versioning & Lifecycle](https://floqast.atlassian.net/wiki/spaces/Data/pages/4443013309) |

---

## 🎯 Objective

This PRD covers the Data Preview tab within the Model detail view in Data Studio. It defines how users view, filter, and explore processed pipeline data (Source → Target) directly inside FloQast — without needing to query an external database, data lake, or lakehouse.

Navigation path: Data Studio → Models → [Select a Model] → Data Preview

Primary users: FloQast admins, accountants, data stewards, and controllers who need to validate, explore, or audit processed pipeline output.

---

## 🔤 Definitions

For a complete glossary of terms used across the Model Creation series, see the shared [Definitions & Terms (Data Studio)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409) page.

---

## 🏅 Why This Is Important

**What we have today:**

Users who want to inspect processed pipeline output must leave FloQast and query their underlying database, data lake, or lakehouse directly. This creates friction and requires technical knowledge that most accountants and data stewards do not have.

**This experience does not include:**

- Any in-platform visibility into what data the pipeline has produced
- The ability to audit historical data from previous model versions
- A self-service way for non-technical users to validate transformations
- Filtering or exploration tools suited to accounting workflows

The Data Preview tab addresses these gaps directly. Our clients place high value on auditability — the ability to prove what data was running through the system at any point in time is a critical requirement for audit-readiness. By supporting Archived version data, we give customers a reliable audit trail. By never showing Draft version data, we ensure users only see production-quality output.

---

## 💡 Key Benefits

- Validate pipeline output without leaving FloQast — no database access or SQL required
- Audit historical data processed by any Active or Archived model version
- Filter and explore large datasets using interactive, column-type-aware controls
- Build user confidence in the data transformation process through direct inspection
- Lay the groundwork for AI-assisted data exploration in a future phase
- Reduce support escalations related to "I can't see what my pipeline is producing"

---

## ✅ Use Cases

| # | Persona | Scenario | Expected Outcome |
|---|---|---|---|
| 1 | Data Steward | Post-run validation — after a pipeline run completes, the steward wants to confirm the output looks correct | Data loads in the grid and the steward can scroll, sort, and spot-check records without leaving FloQast |
| 2 | Accountant | Data reconciliation — the accountant wants to compare processed data against the source system to confirm accuracy | The accountant can filter by date range or account to isolate specific records for comparison |
| 3 | Controller / Auditor | Audit review — the auditor needs to see what data was processed by a specific historical version | The user selects an Archived version from the version selector and views the data processed while that version was active |
| 4 | Data Steward | Schema change validation — after activating a new version with different columns, the steward confirms the new schema is correct | The version selector updates column headers to reflect the new version's schema |
| 5 | Accountant | Targeted data exploration — the accountant needs to find all records where a specific field meets a condition | The accountant uses column filters (multi-select, numeric range, or date range) to narrow results to the relevant rows |
| 6 | Accountant | AI-assisted discovery (V2) — the accountant types a natural language question to find specific records | The AI interprets the question and applies relevant filters to the grid for the user to review and confirm |

---

## 📊 Success Metrics

| Goal | Metric | Baseline | Target |
|---|---|---|---|
| Increase in-platform visibility into pipeline data | % of active Model users who visit the Data Preview tab within 30 days of launch | 0% (new feature) | 60% |
| Reduce time to validate pipeline output | Median time from tab open to first filter applied | N/A | <30 seconds |
| Reduce support escalations | Support tickets related to "I can't see my pipeline data" | (establish pre-launch baseline) | Decrease post-launch |
| Maintain good UX performance | P95 initial data load time | N/A | <3 seconds |
| Confirm audit use case adoption | % of Data Preview sessions that use the version selector | N/A | Track post-launch |

---

## 🤔 Assumptions

- Data processed by Archived versions is retained in storage and remains queryable after the version is archived.
- The AG-Grid component can be configured to operate in server-side data loading mode.
- Connection, Model, and pipeline infrastructure exist prior to this feature being built and are not in scope for this PRD.
- Draft version data must never be accessible via Data Preview — this must be enforced at the API level, not only in the UI.
- Users who can view a Model have permission to view its Data Preview tab; no new permission levels are required for V1.
- The version selector only shows versions that have at least one successful pipeline run (i.e., have actual data to display).
- Column display names in the grid are sourced from the Model field mapping configuration where available.

---

## 🌟 Milestones

| Milestone | Description | Target Date |
|---|---|---|
| Phase 1 — Core Preview (V1) | Data Preview tab visible, AG-Grid with Active version data, basic sort/resize/reorder, version selector (Active + Archived), server-side pagination, empty state handling | TBD |
| Phase 2 — Rich Filtering (V1.5) | Per-column filter types (multi-select, date range, numeric), active filter indicator, "Clear all filters" action, filter state persistence within session | TBD |
| Phase 3 — AI Exploration (V2) | Natural language query bar, AI translates user questions into filter criteria, user reviews and confirms before filters are applied | TBD |

---

## 🗺️ Scope

### In Scope

- Read-only grid view of processed (Source → Target) data
- Support for Active and Archived version data
- AG-Grid with sorting, column resizing, and column reordering
- Version selector (Active and Archived versions only)
- Per-column filtering: multi-select (text), date range picker (date), numeric comparators (number)
- Server-side pagination
- Empty state handling for all pre-requisite failure cases (no connection, no active version, no pipeline run, no data for filter)

### Out of Scope

- Editing, modifying, or writing data through the Data Preview tab (read-only only)
- Display of raw, unprocessed source data (only Source → Target output)
- Draft version data (never shown under any circumstances)
- Data export or download functionality (future phase consideration)
- Custom calculated columns or transformations within the preview UI
- Real-time streaming data display
- Full BI/analytics experience — this is an inspection and audit tool

---

## 📋 Requirements — User Stories

### Quick Reference

| # | Story | Importance |
|---|---|---|
| DP1-LC | View Active Model Data | High |
| DP2-LC | Filter Data by Column Values | High |
| DP3-LC | Navigate Large Datasets (Pagination) | High |
| DP4-LC | Switch Between Versions | High |
| DP5-LC | Audit Archived Version Data | High |
| DP6-LC | Understand Empty States | Medium |
| DP7-LC | AI-Assisted Data Exploration (V2) | Medium |

---

### DP1-LC — View Active Model Data

**User Story:** As a Data Steward or Accountant, I want to view the processed data for the Active version of my Model so that I can validate the pipeline is producing correct output.

**Importance:** High

**Acceptance Criteria:**

**AC-DP1-01 — Data loads when all pre-requisites are met**
```
Given a Model exists and at least one successful pipeline run has completed
When I navigate to Data Studio → Models → [Select a Model] → Data Preview
Then the processed data is displayed in an AG-Grid
And the most recent Active version is selected by default in the version selector.
In scenarios where there is no "Active" version, we should show the most recent version with a successful pipeline run.
```

**AC-DP1-02 — Grid shows all target columns from the Model**
```
Given data has loaded in the Data Preview tab
When I view the grid
Then all processed target columns from the Model are displayed as column headers
And column display names use readable labels where available from the field mapping configuration
And custom columns reflect the customer's selection
```

**AC-DP1-03 — Grid is read-only**
```
Given I am on the Data Preview tab
When I click or interact with any cell in the grid
Then no editing is possible — cells are display-only
```

---

### DP2-LC — Filter Data by Column Values

**User Story:** As a Data Steward or Accountant, I want to filter the data grid by specific column values so that I can find the exact records I'm looking for without scrolling through the entire dataset.

**Importance:** High

**Acceptance Criteria:**

**AC-DP2-01 — Text/string column filter options**
```
Given I am on the Data Preview tab with data loaded
When I click the filter icon on a text or string column
Then I can filter by: Contains, Does not contain, Equals, Does not equal, Starts with, Ends with
And I can also multi-select from a list of distinct values present in that column
```

**AC-DP2-02 — Date column filter with date range picker**
```
Given I am on the Data Preview tab with data loaded
When I click the filter icon on a date column
Then I can filter by: a date range (from date / to date), specific date equals, before a date, after a date, or blank
```

**AC-DP2-03 — Numeric column filter options**
```
Given I am on the Data Preview tab with data loaded
When I click the filter icon on a numeric column
Then I can filter by: Equals, Does not equal, Greater than, Less than, Between (range), or Blank
```

**AC-DP2-04 — Active filter indicator shown**
```
Given I have applied one or more column filters
When I look above the grid
Then I see an indicator showing how many filters are currently active
And a "Clear all filters" action is available
```

**AC-DP2-05 — Filter state persists within session**
```
Given I have applied filters and navigate away from the Data Preview tab
When I return to the Data Preview tab in the same session
Then my previously applied filters are still active
And filter state does not persist across browser sessions or page refreshes
```

---

### DP3-LC — Navigate Large Datasets (Pagination)

**User Story:** As a Data Steward or Accountant, I want to navigate large datasets without the page becoming slow or unresponsive so that I can work with production-scale data comfortably.

**Importance:** High

**Acceptance Criteria:**

**AC-DP3-01 — Server-side pagination with page controls**
```
Given the dataset has more rows than the page size (default: 100 rows per page)
When I view the Data Preview tab
Then rows are loaded in pages with page controls at the bottom of the grid (Previous / Next / Page X of Y / total row count)
```

**AC-DP3-02 — Initial data load performance**
```
Given the Data Preview tab is accessed with a valid dataset and Active version selected
When the page loads
Then the first page of data is displayed within 3 seconds (P95)
```

**AC-DP3-03 — Filter application performance**
```
Given I am on the Data Preview tab with data loaded
When I apply a filter
Then the filtered results are displayed within 1 second
```

---

### DP4-LC — Switch Between Versions

**User Story:** As a Data Steward or Accountant, I want to select which version's data I'm inspecting so that I can compare output across different model versions.

**Importance:** High

**Acceptance Criteria:**

**AC-DP4-01 — Version selector shows only Active and Archived versions**
```
Given a Model has multiple versions
When I open the version selector dropdown
Then I see all Active and Archived versions that have at least one successful pipeline run
And Draft versions do not appear in the version selector under any circumstances
```

**AC-DP4-02 — Selecting a version reloads the grid**
```
Given I have the Data Preview tab open
When I select a different version from the version selector
Then the grid reloads with the data from the newly selected version
And the column structure updates if the selected version has a different schema from the previous selection
```

**AC-DP4-03 — Version label includes version state**
```
Given I have the version selector open
When I view the list of available versions
Then each version displays its name/number and its state (Active or Archived) clearly
```

---

### DP5-LC — Audit Archived Version Data

**User Story:** As a Controller or Auditor, I want to view data that was processed by an Archived version of the model so that I can satisfy audit requirements and demonstrate the pipeline's historical behavior.

**Importance:** High

**Acceptance Criteria:**

**AC-DP5-01 — Archived version data is accessible in Data Preview**
```
Given a model version has been Archived
When I select that version from the version selector
Then the data that was processed while that version was Active is displayed in the grid
And the version selector label indicates the version is Archived
```

**AC-DP5-02 — Draft version data is never accessible**
```
Given a version is in Draft state
When the Data Preview page loads or the API is queried
Then Draft versions are never shown in the version selector
And the backend API never returns data associated with Draft versions regardless of the request
```

---

### DP6-LC — Understand Empty States

**User Story:** As a Data Steward, I want to understand why the Data Preview tab is empty (if it is) so that I know exactly which step to take next.

**Importance:** Medium

**Acceptance Criteria:**

**AC-DP6-01 — Contextual empty state for missing Connection**
```
Given no Connection has been configured, then no model exists
Then I am unable to get to the Data Preview section of the models tab
```

**AC-DP6-02 — Empty state for pipeline never run**
```
Given a Connection and a model, but no pipeline run has ever completed successfully
When I navigate to the Data Preview tab
Then I see the message: "Data will appear here after your pipeline runs successfully for the first time."
```

**AC-DP6-03 — Empty state when filters return no results**
```
Given I have applied one or more filters
When the filters return zero matching rows
Then the grid shows: "No rows match the current filters."
And a "Clear filters" inline link is available
```

---

### DP7-LC — AI-Assisted Data Exploration (V2)

**User Story:** As an Accountant, I want to ask a natural language question about the data so that I can find what I'm looking for without constructing complex manual filter chains.

**Importance:** Medium

**Details:** This story is **deferred to V2**. The core grid, filtering, pagination, and version selector features (DP1–DP6) must be delivered first. The AI interaction would be surfaced as a prompt bar above the grid. The AI would translate the user's question into filter criteria that the user can review before applying — the user remains in control.

Note: This is a high-value consideration but is not committed for V1. Feasibility and approach to be confirmed before design begins.

---

## 🎨 User Interaction & Design

_(To be completed by designer. Key questions to resolve:)_

- Should the version selector be displayed as a dropdown above the grid, or inline with the tab header?
- How should we communicate data freshness — should we show a "last run at" timestamp near the version selector?
- How should the grid handle very high cardinality columns in the multi-select filter?
- What should happen when a new pipeline run completes while the user has the Data Preview tab open?
- Should column display names use the raw target field name from the Model, or a human-readable label from the field mapping configuration? (See OQ-6)

**UI Changes**

- New "Data Preview" tab added to the Model detail view tab bar
- Version selector dropdown positioned above the AG-Grid
- AG-Grid with column filter icons, sort controls, column resizing/reordering, and pagination bar at bottom
- Active filter indicator chip/bar above the grid showing filter count and "Clear all" action
- Contextual empty state components (per DP6-LC)

**Layout reference:**

```
[Version Selector ▼]   [Active Filters: 2]  [Clear All]
┌────────────┬──────────────┬──────────┬──────────────┐
│ Field A    │ Field B      │ Field C  │ Field D      │
├────────────┼──────────────┼──────────┼──────────────┤
│ ...        │ ...          │ ...      │ ...          │
└────────────┴──────────────┴──────────┴──────────────┘
Showing rows 1–100 of 4,892    [< Prev]  Page 1 of 49  [Next >]
```

AG-Grid implementation must follow the platform standard (reference: [AG Grid Optionality — Report Builder Related Tables](https://floqast.atlassian.net/wiki/spaces/SYC/pages/4420763720)).

---

## 😎 Future Considerations

- AI-assisted data exploration (DP7-LC): Natural language query bar — deferred to V2.
- Data export or download functionality for pipeline output — not in scope for V1 but a logical next step.
- Real-time or near-real-time data refresh while the tab is open.
- Field-level masking or role-based access controls for PII/sensitive columns — dependent on security review (see OQ-5).

---

## ❓ Open Questions

| # | Question | Owner | Status | Answer |
|---|---|---|---|---|
| OQ-1 | What is the data retention policy for data processed by Archived versions? Should we define a retention window (e.g., retain for 2 years) or retain indefinitely? | Engineering / Head of Data | Open | |
| OQ-2 | Which pagination approach should be used for V1? Options: (A) server-side pagination with page controls — recommended; (B) infinite scroll; (C) capped virtual scroll with a row limit. | PM / Engineering | Open | |
| OQ-3 | Should the AI-powered data exploration feature (DP7-LC) be included in V1 or deferred to V2? | PM | Open | |
| OQ-4 | What is the maximum expected dataset size (rows × columns) for a typical pipeline run? | Head of Data / Engineering | Open | |
| OQ-5 | Are there any PII or data sensitivity concerns with displaying raw pipeline output in the Data Preview UI? | Engineering / Security | Open | |
| OQ-6 | Should column display names in the grid use the raw target field name from the data, or a human-readable label sourced from the Model field mapping configuration? | PM / Engineering | Open | |
| OQ-7 | What should happen when a new pipeline run completes while the user has the Data Preview tab open — auto-refresh, or a "new data available" indicator? | PM / UX / Engineering | Open | |
| OQ-8 | How should multi-select filters behave for very high cardinality columns (e.g., a column with >1,000 distinct values)? | PM / UX / Engineering | Open | |

---

## 🚫 Gaps

| # | Gap | Impact | Proposed Resolution |
|---|---|---|---|
| G1 | The Model versioning system must expose version state (Active / Archived / Draft) to the Data Preview API layer. | Blocks V1 implementation | Confirm with Engineering pre-V1 |
| G2 | No data retention policy currently exists for data processed by Archived versions. | Blocks audit use case commitment | Head of Data / Engineering to define policy pre-V1 |

---

## 📚 References

- [1 of 4: Model Creation & Source Configuration](https://floqast.atlassian.net/wiki/spaces/Data/pages/4450189505)
- [2 of 4: Field Mapping](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449927443)
- [3 of 4: Testing & Publishing](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449468593)
- [4 of 4: Versioning & Lifecycle](https://floqast.atlassian.net/wiki/spaces/Data/pages/4443013309)
- Confluence: https://floqast.atlassian.net/wiki/spaces/Data/pages/4449632496
