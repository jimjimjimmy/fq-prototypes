# Data Studio: Catalog — Model Search & Filter (DRAFT)

| Field | Value |
|---|---|
| **Target release** | 2026-06-30 |
| **Epic** | _(link to epic)_ |
| **Document status** | DRAFT |
| **Document owner** | Alex Kearns |
| **Designer** | _(assign)_ |
| **Tech lead** | _(assign)_ |
| **Technical writers** | _(assign)_ |
| **QA** | _(assign)_ |
| **Depends on** | Catalog/Lineage Merge PRD _(tab structure must be resolved before implementation)_ |
| **Related PRDs** | [1 of 4: Model Creation & Source Configuration](https://floqast.atlassian.net/wiki/spaces/Data/pages/4450189505) · [2 of 4: Field Mapping](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449927443) · [3 of 4: Testing & Publishing](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449468593) · [4 of 4: Versioning & Lifecycle](https://floqast.atlassian.net/wiki/spaces/Data/pages/4443013309) · [Definitions & Terms](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409) · [AG Grid Optionality — Report Builder](https://floqast.atlassian.net/wiki/spaces/SYC/pages/4420763720) |

---

## 🎯 Objective

This PRD covers the redesign of the Data Studio model landing page — transitioning from the current card-based view to an AG Grid table, and introducing search, column-level filtering, and sorting capabilities. The goal is to make the growing catalog of Models navigable, consistent with the broader FQ product experience, and self-serviceable at scale.

It does not cover Model creation ([Sub-PRD 1](https://floqast.atlassian.net/wiki/spaces/Data/pages/4450189505)), field mapping, versioning, or the Catalog/Lineage tab merge (covered in a separate PRD).

---

## 🔤 Definitions & Terms

For the complete glossary of terms used across the Data Studio PRD series, see the shared [Definitions & Terms (Data Studio)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409) page.

---

## 🏅 Why This Is Important

As the number of Models a customer configures in Data Studio grows — across ERP types, entities, and data shapes — the current card-based view becomes unnavigable. Cards show limited metadata, can't be filtered or searched, and don't scale to enterprise deployments where dozens of Models may exist.

This redesign has two goals: usability and scale.

- **Usability**: A FloQast Admin needs to quickly find a specific Model, understand its current state, and take action — without scrolling through cards or remembering where things are.
- **Scale**: Data Studio is designed to be fully self-service. As more customers onboard and configure more Models, the interface must allow them to manage their own catalog without FQ support intervention. A searchable, filterable table is the foundation for that, especially for CAS customers.

The move to AG Grid also aligns Data Studio with Report Builder, establishing a consistent interaction pattern across FQ for power-user table experiences.

## 💡 Key Benefits

| Benefit | Who It Helps |
|---|---|
| Find a specific Model quickly by name or status | FloQast Admin managing a large catalog (especially CAS customers) |
| Understand the state of all Models at a glance | Controller, Data Steward |
| Filter to only Draft models needing attention | Admin performing onboarding/setup |
| Consistent AG Grid experience across FQ products | All Data Studio users familiar with Report Builder |
| Supports self-service at scale — no FQ support needed to navigate | Enterprise customers with 10+ Models |

## ✅ Use Cases

| # | Use Case | Description |
|---|---|---|
| UC-1 | Finding a specific Model by name | An Admin has 15 models configured and needs to navigate to "Chase Bank Transactions" without scrolling through all cards. |
| UC-2 | Reviewing all Draft models | An Admin wants to see which Models still need to be published before go-live. |
| UC-3 | Checking record counts across all Models | A Controller wants a quick read on which Models have data flowing and how much. |
| UC-4 | Filtering to models updated recently | An Admin wants to see which Models were modified in the last week. |
| UC-5 | Reviewing models by FQ Model type | An Admin wants to see all "Transactions"-type models to evaluate coverage. |

## 📊 Success Metrics

| Metric | Target | Notes |
|---|---|---|
| Time to locate a specific model | < 10 seconds | Measured from landing on Catalog tab to opening target Model |
| Support tickets related to "finding/navigating models" | Reduction vs. baseline | Proxy for self-service success |
| Filter/search feature adoption | ≥ 40% of sessions with 5+ models | % of sessions where search or filter is used |

---

## 🤔 Assumptions

### Established

- The Catalog tab will display all Models for the TLC, regardless of status.
- Models are grouped by FQ Model type (e.g., Accounts, Entities, and Structures / Transactions / Currencies / Balances and Summaries / Custom Models).
- Each group is collapsible and expandable via a chevron control.
- Each Model row displays a user-defined Model Name with the current version number as a subtitle.
- Table columns include: Model Name, Status, Records, Linked Datasets, Last Updated. _(See OQ-2 for final column set confirmation.)_
- Status values displayed are: Active, Draft, Archived. _(See OQ-3 for badge naming alignment.)_
- Global search filters Model Names in real-time (client-side).
- Column filters use AG Grid's native filter panels.
- Active filter chips appear above the table when one or more column filters are applied.
- Sorting is available on all columns via column header click.
- The AG Grid implementation should be consistent with the [Report Builder AG Grid pattern](https://floqast.atlassian.net/wiki/spaces/SYC/pages/4420763720) where applicable.
- This PRD assumes the Catalog/Lineage tab merge is resolved separately. The landing page described here is the result of that merge.

### Open Items to Confirm

| # | Assumption | Story | Confirm with |
|---|---|---|---|
| A1 | Groups are expanded by default on page load. | ML-2 | PM + UX |
| A2 | Search matches against Model Name only (not FQ Model type group names). | ML-5 | PM + Engineering |
| A3 | Sorting within a group preserves group structure (rows don't move across groups). | ML-8 | Engineering |
| A4 | Active filter chips are dismissible individually and via a "Clear All" action. | ML-9 | UX |
| A5 | Column widths are resizable by the user (AG Grid native behavior). | ML-1 | Engineering |
| A6 | The "Last Updated" timestamp reflects the last publish or structural change to the Model, not the last data pipeline run. | ML-7 | PM + Engineering |

---

## 🗺️ Scope

### 🚗 In Scope

- Replacing the card-based model list with an AG Grid table
- FQ Model type grouping with collapsible/expandable group rows
- Table columns: Model Name (with version subtitle), Status, Records, Linked Datasets, Last Updated
- Global search bar (filters model names in real-time)
- Column-level filter panels: text filter (Model Name), set filter (Status), date range (Last Updated)
- Active filter chips row with per-chip and clear-all dismiss
- Column sorting (ascending/descending)
- Empty state when no models match the active search or filters

### 🚦 Out of Scope

- Model creation, editing, or deletion (see Sub-PRDs 1–4)
- Catalog/Lineage tab merge and navigation restructure (separate PRD)
- AG Grid Settings Panel / custom view saving
- Bulk actions on models (e.g., bulk publish, bulk archive)
- Pagination or infinite scroll

---

## 🗒️ Requirements

### Quick Reference

| # | Story | Importance |
|---|---|---|
| ML-1 | Replace card view with AG Grid table | High |
| ML-2 | Display Models grouped by FQ Model type | High |
| ML-3 | Collapsible / expandable group rows | Medium |
| ML-4 | Table columns: Model Name, Status, Records, Linked Datasets, Last Updated | High |
| ML-5 | Global search — real-time filter by Model Name | High |
| ML-6 | Column filter: Model Name (text contains) | Medium |
| ML-7 | Column filter: Last Updated (date range) | Low |
| ML-8 | Column filter: Status (set filter) | High |
| ML-9 | Active filter chips with dismiss | Medium |
| ML-10 | Sort by column | Medium |
| ML-11 | Empty state — no results | High |
| ML-12 | Clear all filters | Medium |

---

### ML-1 — Replace Card View with AG Grid Table

**User Story:** As a FloQast Admin, I want to see my Models displayed in a table instead of cards so that I can see more models at once and interact with them consistently with other FQ grid experiences.

**Importance:** High

**Acceptance Criteria:**

**AC-ML-1-01 — Table renders on Catalog tab load**
```
Given I navigate to Data Studio → Catalog
Then I see an AG Grid table (not cards) displaying all Models for my TLC
```

**AC-ML-1-02 — AG Grid native behaviors available**
```
Given I am viewing the Models table
Then column headers are visible and the grid renders with appropriate FQ design tokens
```

**AC-ML-1-03 — Column widths are resizable**
```
Given I am viewing the Models table
When I drag a column border
Then the column resizes accordingly (see A5)
```

---

### ML-2 — Display Models Grouped by FQ Model Type

**User Story:** As a FloQast Admin, I want my Models organized by their FQ Model type so that I can quickly orient myself within the catalog.

**Importance:** High

**Acceptance Criteria:**

**AC-ML-2-01 — Group rows display FQ Model type and model count**
```
Given I am viewing the Models table
Then each FQ Model type group is represented as a group row showing the group name and count (e.g., "Transactions — 3 Models")
```

**AC-ML-2-02 — Model rows are indented beneath their group**
```
Given I am viewing the Models table
Then each individual Model row appears indented beneath its corresponding FQ Model type group row
```

**AC-ML-2-03 — Groups with zero models are shown**
```
Given a FQ Model type group has no Models configured
Then the group row is still displayed (e.g., "Custom Models — 0 Models")
```

---

### ML-3 — Collapsible / Expandable Group Rows

**User Story:** As a FloQast Admin, I want to collapse and expand FQ Model type groups so that I can focus on the categories I care about.

**Importance:** Medium

**Acceptance Criteria:**

**AC-ML-3-01 — Groups are expanded by default**
```
Given I navigate to the Models table
Then all groups are expanded (see A1)
```

**AC-ML-3-02 — Clicking chevron collapses group**
```
Given a group is expanded
When I click the chevron on the group row
Then the child Model rows are hidden
```

**AC-ML-3-03 — Clicking chevron expands group**
```
Given a group is collapsed
When I click the chevron
Then the child Model rows are shown again
```

---

### ML-4 — Table Columns: Model Name, Status, Records, Linked Datasets, Last Updated

**User Story:** As a FloQast Admin, I want each Model row to show key metadata at a glance.

**Importance:** High

| Column | Content | Notes |
|---|---|---|
| Model Name | User-defined Model name (bold) with current version number as subtitle | e.g., "US Accounts" / "Version 1.0" |
| Status | State badge: Active (green), Draft (yellow), Archived (grey) | See OQ-3 for badge text alignment |
| Records | Count of records in the most recent data run | Blank if no pipeline has run |
| Linked Datasets | Count of Linked Datasets for this Model | e.g., "2 Linked Datasets" |
| Last Updated | Relative or absolute timestamp of last change | See A6 for definition of "updated" |

**Acceptance Criteria:**

**AC-ML-4-01 — Model Name column shows name and version**
```
Given I am viewing a Model row
Then the Model Name column shows the user-defined name and the current version number as secondary text
```

**AC-ML-4-02 — Status badge reflects Model state**
```
Given I am viewing a Model row
Then the Status column shows a badge reflecting the Model's current state (see OQ-3)
```

**AC-ML-4-03 — Records column shows record count**
```
Given a Model has completed a pipeline run
Then the Records column shows the record count from that run
```

**AC-ML-4-04 — Records column is blank before first pipeline run**
```
Given a Model has never completed a pipeline run
Then the Records column is blank or shows a dash
```

**AC-ML-4-05 — Clicking a Model row navigates to Model View**
```
Given I am viewing the Models table
When I click a Model row
Then I am navigated to that Model's Model View (Overview tab)
```

---

### ML-5 — Global Search: Real-Time Filter by Model Name

**User Story:** As a FloQast Admin, I want to type in a search bar to instantly filter the model list by name.

**Importance:** High

**Acceptance Criteria:**

**AC-ML-5-01 — Search bar is visible above the table**
```
Given I am on the Models table
Then a search input with placeholder text (e.g., "Start searching...") is displayed above the table
```

**AC-ML-5-02 — Typing filters the table in real-time**
```
Given I type a string in the search bar
Then only Model rows whose names contain the search string (case-insensitive) are displayed
```

**AC-ML-5-03 — Group row updates count to reflect matches**
```
Given I have typed a search string
Then group rows that have at least one matching Model show an updated count (e.g., "1 of 3 Models match")
```

**AC-ML-5-04 — Groups with no matches are hidden**
```
Given I have typed a search string
And a group has no matching Models
Then that group row is hidden entirely
```

**AC-ML-5-05 — Clearing search restores full table**
```
Given I have an active search string
When I clear the search input
Then all Models and groups are displayed again
```

**AC-ML-5-06 — Empty state shown when no models match**
```
Given I have typed a search string that matches no Models
Then the table shows the empty state (see ML-11)
```

---

### ML-6 — Column Filter: Model Name (Text Contains)

**Importance:** Medium

**Acceptance Criteria:**

**AC-ML-6-01 — Filter icon appears on Model Name header hover**
```
Given I hover over the Model Name column header
Then a filter funnel icon is displayed
```

**AC-ML-6-02 — Clicking filter icon opens text filter panel**
```
Given I click the filter icon on the Model Name header
Then a filter panel opens with a text input for "contains" filtering
```

**AC-ML-6-03 — Entering text filters the Model list**
```
Given the text filter panel is open
When I enter text
Then the table updates to show only Models whose names contain the entered text
```

**AC-ML-6-04 — Active filter is visually indicated on the column header**
```
Given a text filter is active on Model Name
Then the filter icon on the column header is shown in an active/highlighted state
```

---

### ML-7 — Column Filter: Last Updated (Date Range)

**Importance:** Low

**Acceptance Criteria:**

**AC-ML-7-01 — Filter icon appears on Last Updated header hover**
```
Given I hover over the Last Updated column header
Then a filter funnel icon is displayed
```

**AC-ML-7-02 — Clicking filter icon opens date range filter panel**
```
Given I click the filter icon on the Last Updated header
Then a filter panel opens with date inputs for a "from" and "to" range
```

**AC-ML-7-03 — Date range filters the model list**
```
Given I have set a date range in the filter panel
Then only Models whose Last Updated timestamp falls within that range are displayed
```

---

### ML-8 — Column Filter: Status (Set Filter)

**Importance:** High

**Acceptance Criteria:**

**AC-ML-8-01 — Filter icon appears on Status header hover**
```
Given I hover over the Status column header
Then a filter funnel icon is displayed
```

**AC-ML-8-02 — Clicking filter icon opens set filter panel**
```
Given I click the filter icon on the Status header
Then a filter panel opens showing checkboxes for each status value: Active, Draft, Archived
```

**AC-ML-8-03 — Selecting a status filters the list**
```
Given the set filter panel is open
When I deselect one or more status values
Then only Models with a selected status are displayed
```

**AC-ML-8-04 — Multiple statuses can be selected**
```
Given the set filter panel is open
When I select both "Active" and "Draft"
Then Models with either status are displayed (OR logic)
```

---

### ML-9 — Active Filter Chips with Dismiss

**Importance:** Medium

**Acceptance Criteria:**

**AC-ML-9-01 — Filter chips row appears when column filters are active**
```
Given I have applied one or more column filters
Then a filter chips row appears between the search bar and the table
```

**AC-ML-9-02 — Each active filter is represented as a chip**
```
Given the filter chips row is visible
Then each active column filter is shown as a chip with the column name and filter value
```

**AC-ML-9-03 — Dismissing a chip removes that filter**
```
Given filter chips are visible
When I click the X on a chip
Then that filter is removed and the table updates accordingly
```

**AC-ML-9-04 — "Clear All" removes all filters**
```
Given multiple filter chips are visible
When I click "Clear All"
Then all column filters are removed and the table shows all Models (see A4)
```

---

### ML-10 — Sort by Column

**Importance:** Medium

**Acceptance Criteria:**

**AC-ML-10-01 — Clicking column header sorts ascending**
```
Given no sort is applied
When I click a column header
Then the table sorts by that column ascending
```

**AC-ML-10-02 — Second click sorts descending**
```
Given a column is sorted ascending
When I click the same column header again
Then the sort direction reverses to descending
```

**AC-ML-10-03 — Sort is scoped within groups**
```
Given a sort is applied
Then Model rows sort within their FQ Model type group; group rows themselves do not reorder (see A3)
```

---

### ML-11 — Empty State: No Results

**Importance:** High

**Acceptance Criteria:**

**AC-ML-11-01 — Empty state: no models configured**
```
Given the TLC has no Models created
Then the table shows a message indicating no models exist yet
And a CTA to create a new Model is displayed
```

**AC-ML-11-02 — Empty state: no search/filter matches**
```
Given a search or filter is active that matches no Models
Then the table shows a message indicating no results match
And a suggestion to clear the search or filters is displayed
```

---

### ML-12 — Clear All Filters

**Importance:** Medium

**Acceptance Criteria:**

**AC-ML-12-01 — Clear all resets search and all column filters**
```
Given one or more of (search, column filters) are active
When I activate "Clear All"
Then the search input is cleared and all column filters are removed
And the table displays all Models
```

---

## 💻 UX Requirements

### Table Layout

| Column | Width | Sortable | Filterable |
|---|---|---|---|
| Model Name | Flexible | Yes | Yes (text) |
| Status | Flexible | Yes | Yes (set) |
| Records | Flexible | Yes | No |
| Linked Datasets | Flexible | Yes | No |
| Last Updated | Flexible | Yes | Yes (date range) |
| Actions | Fixed (icon) | No | No |

### Core Flow

1. Admin navigates to Data Studio → Catalog
2. Table renders with all Models grouped by FQ Model type, all groups expanded
3. Admin can: (a) type in the search bar to filter by name, (b) hover a column header and click the filter icon to open a column filter, (c) click a column header to sort
4. Active filters are shown as chips; admin can dismiss individual chips or clear all
5. Admin clicks a Model row → navigates to Model View

---

## ❓ Open Questions

| # | Question | Owner | Status | Answer |
|---|---|---|---|---|
| OQ-1 | What is the final tab name after the Catalog/Lineage merge — "Catalog", "Models", or something else? | PM | Closed | Catalog |
| OQ-2 | Is the column set confirmed as: Model Name, Status, Records, Linked Datasets, Last Updated? | PM + UX | Open | |
| OQ-3 | Should "Archived" appear as "Archived" or "Inactive" in the status badge? | PM + UX | Open | |
| OQ-4 | What is the complete, canonical list of FQ Model type groups? | PM + Engineering | Open | |
| OQ-5 | Should matching text within Model Names be highlighted in search results? | PM + UX | Open | |
| OQ-6 | If both a global search and a Model Name column filter are active simultaneously, how do they interact? | Engineering | Open | |
| OQ-7 | What does "Last Updated" reflect — last field mapping change, last publish, or last pipeline run? | PM + Engineering | Open | |
| OQ-8 | Is pagination needed, or can the full model list be loaded client-side? | Engineering | Open | |

---

## 🚫 Gaps

| # | Gap | Impact | Proposed Resolution |
|---|---|---|---|
| G1 | No RBAC / permissions model is defined. | High | Define a permissions matrix before implementation. |
| G2 | The interaction between the global search and the column-level Model Name filter is undefined. | Medium | Define the precedence and combination logic (see OQ-6). |
| G3 | It is unclear what actions are available per Model row in the Actions column. | Medium | Scope the actions column in a follow-on requirement or flag as a UX open question. |
| G4 | The behavior of the table when the Catalog/Lineage merge is not yet complete is undefined. | High | Resolve Catalog/Lineage merge PRD first. |
| G5 | Unclear what happens when no models exist yet. | High | |
| G6 | If Draft and Active versions both exist, how is that represented? | High | |

---

## 📚 References

- [AG Grid Optionality — Report Builder & Related Tables](https://floqast.atlassian.net/wiki/spaces/SYC/pages/4420763720)
- [Definitions & Terms (Data Studio)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409)
- Confluence: https://floqast.atlassian.net/wiki/spaces/Data/pages/4476731473
