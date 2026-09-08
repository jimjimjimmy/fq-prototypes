# Data Explorer — Q3 2026 (DRAFT)

| Field | Value |
|---|---|
| **Target release** | 2026-09-30 |
| **Epic** | _(link to epic)_ |
| **Idea Link** | IDEA-2616 |
| **Document status** | DRAFT |
| **Document owner** | Alex Kearns |
| **Designer** | Natasha Clark · Kristin Johnson |
| **Tech lead** | _(assign)_ |
| **Technical writers** | _(assign)_ |
| **QA** | _(assign)_ |
| **Depends on** | Connection(s) must be configured, a Model with an Active version must exist, and at least one successful pipeline run must have completed. |
| **Related sub-PRDs** | [1 of 4: Model Creation & Source Configuration](https://floqast.atlassian.net/wiki/spaces/Data/pages/4450189505) · [2 of 4: Field Mapping](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449927443) · [3 of 4: Testing & Publishing](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449468593) · [4 of 4: Versioning & Lifecycle](https://floqast.atlassian.net/wiki/spaces/Data/pages/4443013309) |
| **Confluence** | https://floqast.atlassian.net/wiki/spaces/Data/pages/4619927662/Data+Explorer+Q3+2026 |

---

## 🎯 Objective

This PRD covers the Data Explorer tab within the Model detail view in Data Studio. (This tab was previously called "Data Preview" when Catalog & Lineage were distinct tabs.) It defines how users view, filter, and explore processed pipeline data (Source → Target) directly inside FloQast — without needing to query an external database, data lake, or lakehouse.

Navigation path: Data Studio → Catalog → [Select a Model] → Data Explorer

For dimension models (if the Dimensions tab is not redesigned to consolidate this view): Data Studio → Dimensions → [Select a Dimension] → Data Explorer

Primary users: FloQast admins, accountants, data stewards, and controllers who need to validate, explore, or audit processed pipeline output.

**Why "Data Explorer" and not "Data Preview":** The name "Data Preview" created semantic overlap with the "Data Test" tab (PRD 3 — Testing & Publishing), which also involves previewing data but in a pre-publish, admin-only context. Data Explorer better conveys the post-transformation, exploratory intent and serves a broader audience than testing.

---

## 🔤 Definitions

For a complete glossary of terms used across the Model Creation series, see the shared [Definitions & Terms (Data Studio)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409) page.

| Term | Definition |
|---|---|
| **Data Explorer** | The tab within the Model detail view where users explore post-transformation pipeline output. Read-only. |
| **Sensitive column** | A source column designated by an admin as containing sensitive or PII data. Designation propagates to all target columns derived from it. |
| **Obfuscation** | Masking a sensitive column's values in the Data Explorer grid. The column header is visible; values are hidden until revealed by an authorized user. |
| **Reveal** | The action of un-masking a sensitive column's values in the grid. Reveal actions are logged. |
| **Contributing lineage** | A model whose output populates the dimension's member set. |
| **Linked lineage** | A model that references a dimension's key as a foreign-key lookup. |
| **FK orphan** | A row in a linked model that references a dimension key that no longer exists or is inactive in the current dimension version. |

---

## 🏅 Why This Is Important

**What we have today:**

Users who want to inspect processed pipeline output must leave Data Studio and attempt to see data through a downstream application, or — if they are an internal user — must have access to internal APIs and know how to navigate them. This creates friction and requires technical knowledge that most accountants and data stewards do not have.

**This experience does not include:**

- Any in-platform visibility into what data the pipeline has produced
- The ability to audit historical data from previous model versions
- A self-service way for non-technical users to validate transformations
- Filtering or exploration tools suited to accounting workflows
- Sensitive data handling appropriate for a broader-audience read layer

**Why this is must-have for Q3:** Rebecca Beasley-Cockroft has confirmed that Data Explorer will be necessary for every customer implementation — not just an advanced feature for technical users. Implementation partners and admins will rely on it as part of standard setup, which elevates both the sequencing priority and the bar for sensitive column handling.

The Data Explorer tab addresses these gaps directly. Our clients place high value on auditability — the ability to prove what data was running through the system at any point in time is a critical requirement for audit-readiness. By supporting Archived version data, we give customers a reliable audit trail. By never showing Draft version data, we ensure users only see production-quality output.

---

## 💡 Key Benefits

- Validate pipeline output without leaving FloQast — no database access, SQL, API use, or support ticket required
- Audit historical data processed by any Active or Archived model version
- Filter and explore large datasets using interactive, column-type-aware controls
- Protect sensitive data through column-level obfuscation with reveal logging
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
| 6 | Admin | Triage — a user in Report Builder sees a bad value and needs to trace it back to the transformed pipeline output to find where the error originated | The admin locates the record in Data Explorer, identifies the unexpected value, and determines which source field or mapping rule produced it |
| 7 | Admin | Sensitive data access — an authorized user needs to inspect raw values in a column flagged as sensitive | The user reveals the column with a single click; the action is logged with their identity, the column name, and the timestamp |
| 8 | Accountant | AI-assisted discovery (V2) — the accountant types a natural language question to find specific records | The AI interprets the question and applies relevant filters to the grid for the user to review and confirm |

---

## 📊 Success Metrics

| Goal | Metric | Baseline | Target |
|---|---|---|---|
| Increase in-platform visibility into pipeline data | % of active Model users who visit the Data Explorer tab within 30 days of launch | 0% (new feature) | 60% |
| Reduce time to validate pipeline output | Median time from tab open to first filter applied | N/A | <30 seconds |
| Reduce support escalations | Support tickets related to "I can't see my pipeline data" | Establish pre-launch baseline | Decrease post-launch |
| Maintain good UX performance | P95 initial data load time | N/A | <3 seconds |
| Confirm audit use case adoption | % of Data Explorer sessions that use the version selector | N/A | Track post-launch |
| Track sensitive column usage | % of models with at least one sensitive column where a reveal action has occurred in the first 30 days | N/A | Track post-launch |

---

## 🤔 Assumptions

- Data processed by Archived versions is retained in storage and remains queryable after the version is archived.
- The AG-Grid component can be configured to operate in server-side data loading mode.
- Connection, Model, and pipeline infrastructure exist prior to this feature being built and are not in scope for this PRD.
- Draft version data must never be accessible via Data Explorer — this must be enforced at the API level, not only in the UI.
- Users who can view a Model have permission to view its Data Explorer tab; no new permission levels are required for V1 beyond the three-tier hierarchy described in DP1-LC.
- The version selector only shows versions that have at least one successful pipeline run (i.e., have actual data to display).
- Column display names in the grid use human-readable labels sourced from the Model field mapping configuration where available (see OQ-6 — closed).
- Sensitive column designation is configured in the source dataset configuration step (covered in PRD 1 of 4) and propagates to target columns via field mapping (covered in PRD 2 of 4). This PRD covers only the obfuscation and reveal behavior in the Data Explorer grid.
- Column-level metadata infrastructure is a new capability that must be confirmed with Engineering before Q3 scope is locked (see OQ-A).

---

## 🌟 Milestones

| Milestone | Description | Target Date |
|---|---|---|
| Phase 1 — Core Explorer (V1) | Data Explorer tab visible, AG-Grid with Active version data, basic sort/resize/reorder, version selector (Active + Archived), server-side pagination, empty state handling, dimension-linked column resolution, sensitive column obfuscation and reveal logging | TBD |
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
- Empty state handling for all pre-requisite failure cases
- Dimension-linked column resolution: columns backed by a dimension key display the resolved field name (human-readable), not the raw key; FK orphan rows are visually flagged
- Sensitive column obfuscation: columns flagged as sensitive are masked by default; values are hidden until the user explicitly reveals them
- Reveal action logging: each reveal is logged with user identity, column name, model, and timestamp

### Out of Scope

- Editing, modifying, or writing data through the Data Explorer tab (read-only only)
- Display of raw, unprocessed source data (only Source → Target output)
- Draft version data (never shown under any circumstances)
- Data export or download functionality (future phase consideration)
- Custom calculated columns or transformations within the explorer UI
- Real-time streaming data display
- Full BI/analytics experience — this is an inspection and audit tool
- Source data viewer for triage use case (directionally correct, deferred post-Q3)
- REBAC-gated reveal permissions (long-term direction; break-glass approval pattern is the eventual destination — Q3 builds the logging foundation)
- Sensitive column designation UI (owned by PRD 1 of 4 — Model Creation)
- Sensitivity propagation logic in field mapping (owned by PRD 2 of 4 — Field Mapping)

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
| DP7-LC | Dimension-Linked Column Resolution | High |
| DP8-LC | Sensitive Column Obfuscation | High |
| DP9-LC | Reveal Action Logging | High |
| DP10-LC | AI-Assisted Data Exploration (V2) | Medium |

---

### DP1-LC — View Active Model Data

**User Story:** As a Data Steward or Accountant, I want to view the processed data for the Active version of my Model so that I can validate the pipeline is producing correct output.

**Importance:** High

**Details:** When all pre-requisites are met (Connection exists, Model has had at least one successful pipeline run), the Data Explorer tab loads the most recent processed data from the Active version in an AG-Grid.

**Permission hierarchy for Data Explorer access:**

Three tiers govern who sees what in the Data Explorer. This is the target state; REBAC gates the tiers as it rolls out.

| Tier | Who | Access |
|---|---|---|
| 1 — Edit Model | Admins | Full configuration access — not the Data Explorer audience |
| 2 — Read Model configuration | Broader audience | View-only access to field mapping and model setup — not the Data Explorer audience |
| 3 — Preview output | Broadest audience | Data Explorer with obfuscation applied to sensitive columns |

**Acceptance Criteria:**

**AC-DP1-01 — Data loads when all pre-requisites are met**
- **Given** a Model exists and at least one successful pipeline run has completed
- **When** I navigate to Data Studio → Models → [Select a Model] → Data Explorer
- **Then** the processed data is displayed in an AG-Grid
- **And** the most recent Active version is selected by default in the version selector
- **And** in scenarios where there is no Active version, the most recent version with a successful pipeline run is shown instead

**AC-DP1-02 — Grid shows all target columns from the Model**
- **Given** data has loaded in the Data Explorer tab
- **When** I view the grid
- **Then** all processed target columns from the Model are displayed as column headers
- **And** column display names use human-readable labels sourced from the field mapping configuration where available
- **And** custom columns reflect the customer's field naming (not internal database column names)

**AC-DP1-03 — Grid is read-only**
- **Given** I am on the Data Explorer tab
- **When** I click or interact with any cell in the grid
- **Then** no editing is possible — cells are display-only

---

### DP2-LC — Filter Data by Column Values

**User Story:** As a Data Steward or Accountant, I want to filter the data grid by specific column values so that I can find the exact records I'm looking for without scrolling through the entire dataset.

**Importance:** High

**Details:** Each column in the grid has a filter control appropriate to its data type. Filters are applied server-side. An indicator shows the number of active filters and a "Clear all filters" action is available.

**Acceptance Criteria:**

**AC-DP2-01 — Text/string column filter options**
- **Given** I am on the Data Explorer tab with data loaded
- **When** I click the filter icon on a text or string column
- **Then** I can filter by: Contains, Does not contain, Equals, Does not equal, Starts with, Ends with
- **And** I can also multi-select from a list of distinct values present in that column

**AC-DP2-02 — Date column filter with date range picker**
- **Given** I am on the Data Explorer tab with data loaded
- **When** I click the filter icon on a date column
- **Then** I can filter by: a date range (from date / to date), specific date equals, before a date, after a date, or blank

**AC-DP2-03 — Numeric column filter options**
- **Given** I am on the Data Explorer tab with data loaded
- **When** I click the filter icon on a numeric column
- **Then** I can filter by: Equals, Does not equal, Greater than, Less than, Between (range), or Blank

**AC-DP2-04 — Active filter indicator shown**
- **Given** I have applied one or more column filters
- **When** I look above the grid
- **Then** I see an indicator showing how many filters are currently active
- **And** a "Clear all filters" action is available

**AC-DP2-05 — Filter state persists within session**
- **Given** I have applied filters and navigate away from the Data Explorer tab
- **When** I return to the Data Explorer tab in the same session
- **Then** my previously applied filters are still active
- **And** filter state does not persist across browser sessions, page refreshes, or users

---

### DP3-LC — Navigate Large Datasets (Pagination)

**User Story:** As a Data Steward or Accountant, I want to navigate large datasets without the page becoming slow or unresponsive so that I can work with production-scale data comfortably.

**Importance:** High

**Details:** Data is loaded in pages via server-side pagination. Page controls are shown at the bottom of the grid. Performance targets apply to all load operations.

**Acceptance Criteria:**

**AC-DP3-01 — Server-side pagination with page controls**
- **Given** the dataset has more rows than the page size (default: 100 rows per page)
- **When** I view the Data Explorer tab
- **Then** rows are loaded in pages with page controls at the bottom of the grid
- (Previous / Next / Page X of Y / total row count)

**AC-DP3-02 — Initial data load performance**
- **Given** the Data Explorer tab is accessed with a valid dataset and Active version selected
- **When** the page loads
- **Then** the first page of data is displayed within 3 seconds (P95)

**AC-DP3-03 — Filter application performance**
- **Given** I am on the Data Explorer tab with data loaded
- **When** I apply a filter
- **Then** the filtered results are displayed within 1 second

---

### DP4-LC — Switch Between Versions

**User Story:** As a Data Steward or Accountant, I want to select which version's data I'm inspecting so that I can compare output across different model versions.

**Importance:** High

**Details:** A version selector dropdown above the grid allows switching between Active and Archived versions. Draft versions never appear. Switching versions reloads the grid with the selected version's data and column schema.

**Acceptance Criteria:**

**AC-DP4-01 — Version selector shows only Active and Archived versions**
- **Given** a Model has multiple versions
- **When** I open the version selector dropdown
- **Then** I see all Active and Archived versions that have at least one successful pipeline run
- **And** Draft versions do not appear in the version selector under any circumstances

**AC-DP4-02 — Selecting a version reloads the grid**
- **Given** I have the Data Explorer tab open
- **When** I select a different version from the version selector
- **Then** the grid reloads with the data from the newly selected version
- **And** the column structure updates if the selected version has a different schema from the previous selection

**AC-DP4-03 — Version label includes version state**
- **Given** I have the version selector open
- **When** I view the list of available versions
- **Then** each version displays its name/number and its state (Active or Archived) clearly

---

### DP5-LC — Audit Archived Version Data

**User Story:** As a Controller or Auditor, I want to view data that was processed by an Archived version of the model so that I can satisfy audit requirements and demonstrate the pipeline's historical behavior.

**Importance:** High

**Details:** Data processed while a version was Active remains accessible after that version is Archived. This supports audit trail requirements. Draft data is never accessible at any layer.

**Acceptance Criteria:**

**AC-DP5-01 — Archived version data is accessible in Data Explorer**
- **Given** a model version has been Archived
- **When** I select that version from the version selector
- **Then** the data that was processed while that version was Active is displayed in the grid
- **And** the version selector label indicates the version is Archived

**AC-DP5-02 — Draft version data is never accessible**
- **Given** a version is in Draft state
- **When** the Data Explorer page loads or the API is queried
- **Then** Draft versions are never shown in the version selector
- **And** the backend API never returns data associated with Draft versions regardless of the request

---

### DP6-LC — Understand Empty States

**User Story:** As a Data Steward, I want to understand why the Data Explorer tab is empty (if it is) so that I know exactly which step to take next.

**Importance:** Medium

**Details:** Each unfulfilled pre-requisite triggers a distinct empty state with a clear message and actionable next step. A generic "no data" message is not acceptable.

**Acceptance Criteria:**

**AC-DP6-01 — Contextual empty state for missing Connection**
- **Given** no Connection has been configured, then no model exists
- **Then** I am unable to navigate to the Data Explorer section of the models tab

**AC-DP6-02 — Empty state for pipeline never run**
- **Given** a Connection and a model exist, but no pipeline run has ever completed successfully
- **When** I navigate to the Data Explorer tab
- **Then** I see the message: "Data will appear here after your pipeline runs successfully for the first time."

**AC-DP6-03 — Empty state when filters return no results**
- **Given** I have applied one or more filters
- **When** the filters return zero matching rows
- **Then** the grid shows: "No rows match the current filters."
- **And** a "Clear filters" inline link is available

---

### DP7-LC — Dimension-Linked Column Resolution

**User Story:** As a Data Steward or Accountant, I want to see human-readable dimension values in the grid — not raw foreign keys — so that the data is meaningful to me without cross-referencing a separate lookup table.

**Importance:** High

**Details:** When a Model has dimension-linked columns, the Data Explorer resolves those columns to their human-readable field name (as defined in the Dimension's field name mapping) rather than displaying the raw key value. Rows where the dimension key does not resolve — FK orphans — are visually flagged so users can identify data quality issues without the grid silently showing a blank value.

See the Dimensions PRD for the full dimension-specific Data Explorer variant (including member count, status, and data quality indicators that appear in the Dimension detail view).

**Acceptance Criteria:**

**AC-DP7-01 — Dimension-linked columns display resolved field names**
- **Given** a Model has one or more columns linked to a Dimension via a foreign key
- **When** data loads in the Data Explorer tab
- **Then** those columns display the Dimension's field name (human-readable display value)
- **And** not the raw dimension key value

**AC-DP7-02 — FK orphan rows are visually flagged**
- **Given** a row's dimension key value does not resolve to an active member in the current Dimension version
- **When** that row is displayed in the Data Explorer grid
- **Then** the cell is visually flagged (e.g., a warning indicator or distinct styling)
- **And** a tooltip or inline note explains that the key does not resolve to a current dimension member
- **And** the raw key value is shown alongside the flag so the user can identify the orphan

**AC-DP7-03 — Version-aware dimension resolution**
- **Given** I have selected an Archived model version in the version selector
- **When** dimension-linked columns are rendered
- **Then** dimension resolution uses the dimension version that was active at the time that model version was active
- **And** FK orphan detection is evaluated against the same point-in-time dimension state

---

### DP8-LC — Sensitive Column Obfuscation

**User Story:** As an admin or data steward, I want sensitive columns to be masked by default in the Data Explorer so that users with broad read access cannot see raw values for fields that contain PII or sensitive data unless they explicitly choose to reveal them.

**Importance:** High

**Details:** Sensitive column designation is set at the source column level during source dataset configuration (see PRD 1 of 4). That flag propagates to target columns through field mapping (see PRD 2 of 4). This story covers the obfuscation behavior in the Data Explorer grid only.

Columns are visible (header shown, column present) but values are hidden. Reveal is a deliberate per-column action. Seeing on screen and downloading are separate permission gates — this PRD covers the on-screen reveal tier; download is out of V1 scope.

**Acceptance Criteria:**

**AC-DP8-01 — Sensitive columns are masked by default**
- **Given** a Model has one or more target columns flagged as sensitive
- **When** data loads in the Data Explorer tab
- **Then** each sensitive column's header is visible in the grid
- **And** the column's values are masked (e.g., shown as "••••••" or a placeholder)
- **And** a visual indicator makes clear the column is sensitive and values are hidden

**AC-DP8-02 — User can reveal a sensitive column**
- **Given** a sensitive column is masked
- **When** I click the reveal control on that column
- **Then** the column's values are displayed in plain text for the duration of my session
- **And** the reveal action is logged (see DP9-LC)

**AC-DP8-03 — Sensitive column filter behavior**
- **Given** a column is sensitive and currently masked
- **When** I open the filter for that column
- **Then** I can filter by value (if my tier permits reveal) — the filter interaction implicitly reveals values in the filter UI but does not auto-unmask the column in the grid

**AC-DP8-04 — Sensitive columns remain masked on version switch**
- **Given** I have not revealed a sensitive column
- **When** I switch to a different version via the version selector
- **Then** the column remains masked in the newly loaded version

---

### DP9-LC — Reveal Action Logging

**User Story:** As a compliance owner or security reviewer, I want every sensitive column reveal action to be logged so that we have an audit trail of who accessed sensitive data, on which model, and when.

**Importance:** High

**Details:** This logging is the Q3 foundation for a future break-glass / REBAC approval pattern. Reveal logs must attribute actions to the human user even when the reveal is triggered via an agent or MCP session.

**Acceptance Criteria:**

**AC-DP9-01 — Reveal action is logged**
- **Given** a user reveals a sensitive column in the Data Explorer
- **When** the reveal action occurs
- **Then** a log entry is created containing: user identity, column name, model name, model version, timestamp

**AC-DP9-02 — Agent-initiated reveals are attributed to the human user**
- **Given** a reveal action is triggered via an AI agent or MCP session
- **When** the log entry is created
- **Then** the entry attributes the action to the initiating human user
- **And** includes a notation that the action occurred via an agent (e.g., "Alex Kearns via agent")

**AC-DP9-03 — Reveal logs are accessible to admins**
- **Given** reveal actions have been logged
- **When** an admin navigates to the appropriate log view (Logs tab or audit export — see Logging & Audit PRD)
- **Then** they can see a list of reveal events filterable by user, model, column, and date range

---

### DP10-LC — AI-Assisted Data Exploration (V2)

**User Story:** As an Accountant, I want to ask a natural language question about the data so that I can find what I'm looking for without constructing complex manual filter chains.

**Importance:** Medium

**Details:** This story is **deferred to V2**. The core grid, filtering, pagination, version selector, dimension resolution, and sensitive column features (DP1–DP9) must be delivered first. The AI interaction would be surfaced as a prompt bar above the grid. The AI would translate the user's question into filter criteria that the user can review before applying — the user remains in control.

Note: This is a high-value consideration but is not committed for V1. Feasibility and approach to be confirmed before design begins.

---

## 🎨 User Interaction & Design

_(To be completed by designer. Key questions to resolve:)_

- Should the version selector be displayed as a dropdown above the grid, or inline with the tab header? Is version selectable from the Data Explorer tab, or is there some other way to navigate to it?
- How should we communicate data freshness — should we show a "last run at" timestamp near the version selector?
- How should the grid handle very high cardinality columns in the multi-select filter — cap the list at N values, add a search-within-filter, or fall back to a text input?
- What should happen when a new pipeline run completes while the user has the Data Explorer tab open — auto-refresh, or a "new data available" banner with a manual refresh action?
- What is the visual treatment for masked sensitive columns — "••••••" placeholder, a lock icon, a distinct column header background, or some combination?
- What is the reveal control — a button in the column header, a right-click action, or something else? What confirmation (if any) is required before reveal?
- What is the visual treatment for FK orphan cells — a warning triangle, a yellow cell background, a tooltip?

**UI Changes**

- "Data Explorer" tab added to the Model detail view tab bar (replaces "Data Preview")
- Version selector dropdown positioned above the AG-Grid
- AG-Grid with column filter icons, sort controls, column resizing/reordering, and pagination bar at bottom
- Active filter indicator chip/bar above the grid showing filter count and "Clear all" action
- Sensitive column visual treatment: masked values, sensitive indicator in column header, reveal control
- FK orphan cell indicator for dimension-linked columns
- Contextual empty state components (per DP6-LC)

**Layout reference:**

```
[Version: Active v3 ▼]   [Active Filters: 2  ✕ Clear all]
┌────────────┬──────────────┬──────────┬──────────────┐
│ Field A    │ 🔒 Salary    │ Field C  │ Department   │
├────────────┼──────────────┼──────────┼──────────────┤
│ ...        │  ••••••      │ ...      │ Engineering  │
│ ...        │  ••••••      │ ...      │ ⚠ 42 (orphan)│
└────────────┴──────────────┴──────────┴──────────────┘
Showing rows 1–100 of 4,892    [< Prev]  Page 1 of 49  [Next >]
```

AG-Grid implementation must follow the platform standard (reference: [AG Grid Optionality — Report Builder Related Tables](https://floqast.atlassian.net/wiki/spaces/SYC/pages/4420763720)).

---

## 🔗 Dimensions — Data Explorer Variant

The Data Explorer described above applies to standard Models. **Dimension models** also expose a Data Explorer surface, but with dimension-specific additions. These requirements are documented in the Dimensions PRD and summarized here for cross-reference.

The Dimension detail view (Dimensions L1 tab → Dimension → Values subtab) serves as the dimension variant of the Data Explorer. Its purpose is distinct from the Model Data Explorer: it shows the dimension's **member set** (the reference data catalog), not joined pipeline row output.

**Additions specific to the Dimension Data Explorer:**

| Element | User-facing label | Description |
|---|---|---|
| Related Records | Related Records | Total distinct members in the dimension (e.g., "47 related records") |
| Member status | _(label TBD — needs design decision)_ | Active vs Inactive per member — critical for understanding the effect of archived contributing lineages |
| Field name column | Name | Human-readable display value alongside the key |
| Data quality flags | Warning | Possible duplicate values and duplicate keys surfaced inline in the grid |
| Contributing source indicator | Source | Which contributing lineage produced each member — relevant when multiple contributing lineages are active |

Design note: the existing Dimensions prototype Values tab is the starting point for this surface — the work is largely incremental from what is already built.

---

## 😎 Future Considerations

- AI-assisted data exploration (DP10-LC): Natural language query bar that translates user questions into filter criteria — deferred to V2. Feasibility and UX approach to be confirmed before design begins.
- Data export or download functionality for pipeline output — not in scope for V1. When it lands, download access is a separate permission gate from on-screen reveal; the ability to download implies the ability to see, but not vice versa.
- Source data viewer for the triage use case — directionally correct; would let users trace a bad transformed value back to its raw source. Deferred post-Q3; requires a decision about whether the surface lives in Data Explorer or as a separate tab.
- Real-time or near-real-time data refresh while the tab is open.
- REBAC-gated reveal permissions — break-glass approval pattern is the long-term direction. Q3 builds the logging infrastructure that makes this possible.
- Read-only Model configuration view — there is currently no PRD home for a view-only version of field mapping and model setup that non-admin users could access. This is a gap identified in Q3 planning.

---

## ❓ Open Questions

| # | Question | Owner | Status | Answer |
|---|---|---|---|---|
| OQ-1 | What is the data retention policy for data processed by Archived versions? Should we define a retention window (e.g., retain for 2 years) or retain indefinitely? This must be answered before the audit use case (DP5-LC) can be committed. | Engineering / Head of Data | Open | |
| OQ-2 | Which pagination approach should be used for V1? Options: (A) server-side pagination with page controls — recommended; (B) infinite scroll with server-side row model; (C) capped virtual scroll with a row limit. | PM / Engineering | Open | |
| OQ-3 | Should the AI-powered data exploration feature (DP10-LC) be included in V1 or deferred to V2? The core grid must ship first regardless. | PM | Open | |
| OQ-4 | What is the maximum expected dataset size (rows × columns) for a typical pipeline run? This directly informs the pagination strategy, performance budget, and whether a row cap is needed. | Head of Data / Engineering | Open | |
| OQ-5 | Are there any PII or data sensitivity concerns beyond what is covered by the sensitive column model in DP8-LC? Are field-level masking controls needed beyond what is spec'd here? | Engineering / Security | Open | |
| OQ-6 | Should column display names in the grid use the raw target field name from the data, or a human-readable label sourced from the Model field mapping configuration? | PM / Engineering | **Closed** | Human-readable label from field mapping configuration. Fallback to raw field name when no label exists. |
| OQ-7 | What should happen when a new pipeline run completes while the user has the Data Explorer tab open — should the data auto-refresh, or should we show a "new data available — click to refresh" indicator? | PM / UX / Engineering | Open | |
| OQ-8 | How should multi-select filters behave for very high cardinality columns (e.g., a column with >1,000 distinct values)? Options: cap the list, add a search-within-filter UX, or fall back to a free-text input. | PM / UX / Engineering | Open | |
| OQ-A | What is the engineering lift for column-level metadata across all four layers (source config, field mapping, pipeline, Data Explorer)? Column-level metadata does not exist today. Does the full sensitive column feature fit in Q3? | Engineering | Open | |
| OQ-B | How are reveal logs attributed when an automated pipeline or scheduled task accesses sensitive column data with no human in the session? | Engineering / Security | Open | |
| OQ-C | When a transformation genuinely de-identifies sensitive data (e.g., bucketing salary into ranges), what is the UX for an admin to explicitly mark the target output as non-sensitive? | PM / Design | Open | |
| OQ-D | Where does the read-only Model configuration view live, and which PRD owns it? | PM | Open | |
| OQ-E | What is the REBAC delivery timeline relative to Q3 Data Explorer? Does the obfuscation model need a fallback permission model if REBAC isn't ready? | Engineering | Open | |

---

## 🚫 Gaps

| # | Gap | Impact | Proposed Resolution |
|---|---|---|---|
| G1 | The Model versioning system must expose version state (Active / Archived / Draft) to the Data Explorer API layer. This dependency needs confirmation from Engineering before V1 scope can be finalized. | Blocks V1 implementation | Confirm with Engineering pre-V1 |
| G2 | No data retention policy currently exists for data processed by Archived versions. Engineering and Head of Data must define and document this policy before the audit use case (DP5-LC) can be committed. | Blocks audit use case commitment | Head of Data / Engineering to define policy pre-V1 |
| G3 | Column-level metadata infrastructure does not exist today. It is a foundational dependency for the entire sensitive column feature set (DP8-LC, DP9-LC) and threads across four layers: source config, field mapping, pipeline, and Data Explorer. | Blocks sensitive column feature | Engineering assessment required before Q3 scope locks (see OQ-A) |
| G4 | No PRD currently covers the read-only Model configuration view — a surface where non-admin users could see field mapping and model setup without edit access. This gap was identified during Data Explorer scoping. | Does not block Data Explorer V1 | Needs a PRD owner and home before Q3 scope locks |
| G5 | The Dimension-specific Data Explorer variant (member count, status, FK orphan count, contributing source indicator) is summarized here but requirements are not fully specified. | Does not block standard model Data Explorer | Dimensions PRD to carry full requirements for the Dimension detail Values subtab |

---

## 📚 References

- [1 of 4: Model Creation & Source Configuration](https://floqast.atlassian.net/wiki/spaces/Data/pages/4450189505) — source column sensitivity designation
- [2 of 4: Field Mapping](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449927443) — sensitivity propagation and field mapping sensitive indicator
- [3 of 4: Testing & Publishing](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449468593)
- [4 of 4: Versioning & Lifecycle](https://floqast.atlassian.net/wiki/spaces/Data/pages/4443013309)
- [Logging & Audit PRD](https://floqast.atlassian.net/wiki/spaces/Data/pages/4508254281) — reveal log surfacing
- [AG Grid Optionality — Report Builder Related Tables](https://floqast.atlassian.net/wiki/spaces/SYC/pages/4420763720) — AG-Grid platform standard
- Confluence: https://floqast.atlassian.net/wiki/spaces/Data/pages/4619927662/Data+Explorer+Q3+2026
- Q3 brainstorm: `playspace/data-studio/q3/data-preview/brainstorm.md`
