# Data Studio: Catalog/Lineage Merge (DRAFT)

| Field | Value |
|---|---|
| **Target release** | TBD |
| **Epic** | _(link to epic)_ |
| **Document status** | DRAFT |
| **Document owner** | Alex Kearns |
| **Designer** | _(assign)_ |
| **Tech lead** | _(assign)_ |
| **Technical writers** | _(assign)_ |
| **QA** | _(assign)_ |
| **Depends on** | None — this PRD defines the structural foundation that the Search & Filter PRD builds on |
| **Related PRDs** | [Catalog: Model Search & Filter](https://floqast.atlassian.net/wiki/spaces/Data/pages/4476731473) · [1 of 4: Model Creation & Source Configuration](https://floqast.atlassian.net/wiki/spaces/Data/pages/4450189505) · [2 of 4: Field Mapping](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449927443) · [4 of 4: Versioning & Lifecycle](https://floqast.atlassian.net/wiki/spaces/Data/pages/4443013309) · [Definitions & Terms](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409) |

---

## 🎯 Objective

Data Studio currently has three tabs: **Catalog**, **Connectors**, and **Lineage**. Catalog and Lineage serve overlapping purposes — both present a list of models and both provide model detail views — but with different entry points, different styling, and different information architectures. This creates a confusing, duplicative experience for admins.

This PRD defines the consolidation:

1. **Retire the Lineage tab.** The new unified **Catalog** tab takes its place, combining the best of both existing views.
2. **Retire the old Catalog landing page.** The new Catalog landing page is the AG Grid table defined in the [Catalog Search & Filter PRD](https://floqast.atlassian.net/wiki/spaces/Data/pages/4476731473).
3. **Define the unified Model detail view** — the single view that opens when a user clicks any model from the new Catalog landing.
4. **Move connector-level information** to the Connectors tab, where it belongs.

The result is a cleaner two-tab structure: **Catalog** (models) and **Connectors** (connectors.)

---

## 🔤 Definitions & Terms

For the complete glossary, see [Definitions & Terms (Data Studio)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409).

---

## 🏅 Why This Is Important

The current three-tab structure is an artifact of how Data Studio was built incrementally — Catalog came first, Lineage was added later, and the two never fully converged. From a user perspective, this means:

- Admins encounter two different entry points to the same models, with different information and different styling in each.
- Connector details appear inside model views, making it unclear whether connector configuration belongs to the model or to the connection itself.
- The term "Lineage" no longer reflects what the feature does and is being retired across the product.
- The old Catalog landing page is being replaced with a more capable AG Grid table — but that new table needs a clear home in the navigation.

Consolidating to a single Catalog tab removes the confusion, establishes a clean information hierarchy (models live in Catalog, connections live in Connectors), and provides the structural foundation for the Search & Filter PRD and all subsequent Data Studio work.

## 💡 Key Benefits

| Benefit | Who It Helps |
|---|---|
| Single entry point for all model-related work | FloQast Admin |
| Connector configuration clearly separated from model configuration | Admin, IT Manager |
| Consistent terminology ("Model" not "Lineage") across the product | All users |
| Clear structural foundation for future Data Studio features | Engineering, Design |

## ✅ Use Cases

| # | Use Case | Description |
|---|---|---|
| UC-1 | Admin navigates to their models | Admin opens Data Studio and lands directly on the Catalog tab — no need to choose between Catalog and Lineage. |
| UC-2 | Admin views model overview and linked files | Admin clicks a model and sees its status, record count, data freshness, and product feature coverage in the Overview tab, and linked files in the Source Datasets tab. |
| UC-3 | Admin edits field mappings | Admin navigates from the Catalog landing to Field Mappings tab in the Model detail — same flow regardless of previous entry point. |
| UC-4 | Admin manages connector settings | Admin navigates to Connectors tab (not inside a model) to view or edit connection configuration. |

---

## 🤔 Assumptions

### Established

- The three-tab structure (Catalog, Connectors, Lineage) is replaced with two tabs: **Catalog** and **Connectors**.
- The new Catalog landing page is the AG Grid table defined in the [Search & Filter PRD](https://floqast.atlassian.net/wiki/spaces/Data/pages/4476731473). The old card-based Catalog landing is retired.
- All references to "Lineage" in tab labels, page titles, and navigation are replaced with "Catalog" or "Model" per the canonical definitions.
- Connector-level configuration (credentials, sync frequency, next sync schedule) lives exclusively on the Connectors tab and is not surfaced inside Model detail views.
- Linked Datasets remain visible in the Model detail view — this is model-level configuration (which files from which connector feed this model), distinct from the connector configuration itself.
- The unified Model detail view has the following tabs: **Overview · Source Datasets · Field Mappings · Data Preview · Versions · Logs**. _(See OQ-1 — confirmed.)_
- Product Features (Reconciliations, AI Matching, AI Variance, JEM) remain visible in the Model detail **Overview tab**.
- The default tab when opening a Model detail is **Overview**.
- The new Catalog tab is the default/landing tab when a user navigates to Data Studio.

### Open Items to Confirm

| # | Assumption | Story | Confirm with | Status |
|---|---|---|---|---|
| A1 | The new Catalog tab is the default/landing tab when a user navigates to Data Studio. | CL-1 | PM + UX | CONFIRMED |
| A2 | Product Features checkboxes (Reconciliations, AI Matching, etc.) in the Overview tab are read-only in the model detail view, not editable inline. | CL-5 | PM + Engineering | |
| A3 | Connector name and next sync info are removed from the Model detail Overview view entirely (not just de-emphasized). | CL-5 | PM + Engineering | |
| A4 | The "Data Freshness" and "Last Sync Status" fields in the old Catalog Summary are retained in the new unified Overview tab. | CL-5 | PM + Engineering | |
| A5 | All existing URLs/deep links to the Lineage tab are redirected to the new Catalog tab. | CL-2 | Engineering | |

---

## 🗺️ Scope

### 🚗 In Scope

- Removing the Lineage tab from Data Studio navigation
- Renaming the surviving tab to "Catalog" (replacing the old Catalog tab)
- Retiring the old Catalog landing page (summary stats cards + card-based model list)
- Defining the unified Model detail view and its tab structure
- Removing connector-level configuration from Model detail views
- Terminology update: replacing "Lineage" with "Model" or "Catalog" throughout Data Studio UI

### 🚦 Out of Scope

- The AG Grid landing page itself (defined in [Catalog: Model Search & Filter PRD](https://floqast.atlassian.net/wiki/spaces/Data/pages/4476731473))
- Field Mappings tab content (Sub-PRD 2)
- Versioning tab content (Sub-PRD 4)
- Connectors tab redesign
- Any changes to how Product Features are assigned or configured (that is a separate capability)

---

## 🗒️ Requirements

### Quick Reference

| # | Story | Importance |
|---|---|---|
| CL-1 | Remove Lineage tab; rename surviving tab to "Catalog" | High |
| CL-2 | Replace old Catalog landing with new AG Grid table | High |
| CL-3 | Unify model detail entry point | High |
| CL-4 | Retire "Source Files" tab; move content to Source Datasets tab | High |
| CL-5 | Define unified Model detail: Overview tab | High |
| CL-6 | Remove connector configuration from Model detail | High |
| CL-7 | Define full 6-tab Model detail structure | High |
| CL-8 | Replace "Lineage" terminology throughout Data Studio UI | Medium |

---

### CL-1 — Remove Lineage Tab; Rename Surviving Tab to "Catalog"

**User Story:** As a FloQast Admin, I want a single, clearly named entry point for my models so that I don't have to choose between two tabs that both show models.

**Importance:** High

**Details:** The Lineage tab is removed from the Data Studio top-level navigation. The Catalog tab is retained and becomes the sole home for all model-related work. The tab label remains "Catalog." The Connectors tab is unchanged.

**Acceptance Criteria:**

**AC-CL-1-01 — Lineage tab no longer appears in Data Studio navigation**
```
Given I navigate to Data Studio
Then I see two tabs: "Catalog" and "Connectors"
And there is no "Lineage" tab
```

**AC-CL-1-02 — Catalog is the default tab**
```
Given I navigate to Data Studio
Then the Catalog tab is selected by default (see A1)
```

**AC-CL-1-03 — Existing Lineage deep links redirect to Catalog**
```
Given a user follows a link that previously pointed to the Lineage tab
Then they are redirected to the Catalog tab (see A5)
```

---

### CL-2 — Replace Old Catalog Landing with New AG Grid Table

**User Story:** As a FloQast Admin, I want the Catalog landing page to show the new searchable, filterable model table so that I can find and navigate to models efficiently.

**Importance:** High

**Details:** The old Catalog landing page — which displayed summary stat cards (Connectors count, Active Models count) above a card-based model list — is retired. The new Catalog landing page is the AG Grid table defined in the [Catalog: Model Search & Filter PRD](https://floqast.atlassian.net/wiki/spaces/Data/pages/4476731473). All behavior (grouping, search, filters, sorting) is defined there and not repeated here.

**Acceptance Criteria:**

**AC-CL-2-01 — Old Catalog landing page is retired**
```
Given I navigate to Data Studio → Catalog
Then I do not see the old summary stat cards (Connectors: 27, Active Models: 4) or the old card-based model list
```

**AC-CL-2-02 — New AG Grid table is the Catalog landing**
```
Given I navigate to Data Studio → Catalog
Then I see the AG Grid model table as defined in the Catalog: Model Search & Filter PRD
```

---

### CL-3 — Unify Model Detail Entry Point

**User Story:** As a FloQast Admin, I want clicking any model — from anywhere in Data Studio — to open the same unified Model detail view so that I always end up in the same place regardless of how I navigated there.

**Importance:** High

**Acceptance Criteria:**

**AC-CL-3-01 — Clicking a model row opens the unified Model detail**
```
Given I am on the Catalog landing (AG Grid table)
When I click a model row
Then I am navigated to the unified Model detail view, defaulting to the Overview tab
```

**AC-CL-3-02 — Back navigation returns to Catalog landing**
```
Given I am in a Model detail view
When I click the back arrow or navigate back
Then I return to the Catalog landing, preserving any active search or filters
```

---

### CL-4 — Retire "Source Files" as a Standalone Tab

**User Story:** As a FloQast Admin, I want to find linked file information in a predictable place without a separate "Source Files" tab cluttering the model detail navigation.

**Importance:** High

**Acceptance Criteria:**

**AC-CL-4-01 — No "Source Files" tab in Model detail**
```
Given I open any Model detail view
Then there is no "Source Files" tab in the tab navigation
```

**AC-CL-4-02 — Linked Files information is visible in Source Datasets tab**
```
Given I open a Model detail view and navigate to the Source Datasets tab
Then I can see the Linked Files/Tables associated with this model (connector name, file name, source type)
```

---

### CL-5 — Unified Model Detail: Overview Tab

**User Story:** As a FloQast Admin, I want an Overview tab that gives me a complete at-a-glance status of a Model — its health metrics and product feature coverage — in one place.

**Importance:** High

**Overview tab content:**

| Section | Fields | Source |
|---|---|---|
| **Status bar** | Total Records, Data Freshness, Last Sync Status, Version | Old Catalog Summary |
| **Product Features** | Reconciliations, AI Matching, AI Variance, JEM (read-only indicators) _(see A2)_ | Old Catalog Summary |

**Acceptance Criteria:**

**AC-CL-5-01 — Status bar shows health metrics**
```
Given I open a Model detail and view the Overview tab
Then I see Total Records, Data Freshness, Last Sync Status, and current Version (see A4)
```

**AC-CL-5-02 — Product Features section shows enabled capabilities**
```
Given I am on the Overview tab
Then I see the Product Features section showing which FQ product capabilities are enabled for this model (see A2)
```

**AC-CL-5-03 — Connector credentials and schedule are not shown**
```
Given I am on the Overview tab
Then I do not see connector-level fields: Sync Frequency, Next Sync timestamp, or connector credentials (see CL-6)
```

---

### CL-6 — Remove Connector Configuration from Model Detail

**User Story:** As a FloQast Admin, I want connector settings to live on the Connectors tab so that I know where to go when I need to manage a connection.

**Importance:** High

**Fields removed from all Model detail views:**
- Sync Frequency
- Next Sync timestamp
- Connector Name _(retained as read-only reference in Source Datasets tab — see OQ-3)_

**Acceptance Criteria:**

**AC-CL-6-01 — Sync Frequency is not shown in Model detail**
```
Given I am viewing any tab of a Model detail
Then I do not see a "Sync Frequency" field
```

**AC-CL-6-02 — Next Sync timestamp is not shown in Model detail**
```
Given I am viewing any tab of a Model detail
Then I do not see a "Next Sync" field
```

**AC-CL-6-03 — Connector name is visible as a read-only reference in Source Datasets tab**
```
Given I am on the Source Datasets tab
Then the connector name is shown as a label identifying which connector the file comes from (see OQ-3)
And clicking the connector name does not navigate to connector settings
```

---

### CL-7 — Define Full 6-Tab Model Detail Structure

**User Story:** As a FloQast Admin, I want the Model detail to have a complete, clearly organized tab structure so that all model management tasks are accessible from one place.

**Importance:** High

**Tab set:** Overview · Source Datasets · Field Mappings · Data Preview · Versions · Logs

**Acceptance Criteria:**

**AC-CL-7-01 — Model detail has six tabs**
```
Given I open a Model detail view
Then I see six tabs: Overview, Source Datasets, Field Mappings, Data Preview, Versions, Logs
```

**AC-CL-7-02 — Field Mappings tab is accessible**
```
Given I am in a Model detail view
When I click "Field Mappings"
Then I see the Field Mapping view as defined in Sub-PRD 2
```

**AC-CL-7-03 — Versions tab is accessible**
```
Given I am in a Model detail view
When I click "Versions"
Then I see the Version history as defined in Sub-PRD 4
```

**AC-CL-7-04 — Logs tab is accessible**
```
Given I am in a Model detail view
When I click "Logs"
Then I see the pipeline run logs as defined in Sub-PRD 4
```

---

### CL-8 — Replace "Lineage" Terminology Throughout Data Studio UI

**User Story:** As a FloQast Admin, I want consistent terminology across Data Studio so that "Model" and "Catalog" mean the same thing everywhere.

**Importance:** Medium

**Key replacements:**

| Old Term | New Term |
|---|---|
| Lineage (tab label) | _(tab retired)_ |
| Data Lineage (page title) | Catalog |
| Lineage (as a noun for a model) | Model |
| "Showing X lineages" | "Showing X models" |

**Acceptance Criteria:**

**AC-CL-8-01 — No user-visible instances of "Lineage" remain in Data Studio UI**
```
Given I navigate through all areas of Data Studio
Then I do not see the word "Lineage" used as a tab label, page title, or noun referring to a model
```

**AC-CL-8-02 — "Model" is used consistently as the singular noun**
```
Given I am anywhere in Data Studio
Then individual records are referred to as "Models" (not Lineages, not Schemas)
```

---

## 💻 UX Requirements

### Navigation Structure (Before vs. After)

| | Before | After |
|---|---|---|
| **Top-level tabs** | Catalog · Connectors · Lineage | Catalog · Connectors |
| **Catalog landing** | Summary stat cards + card grid | AG Grid model table (Search & Filter PRD) |
| **Model detail entry** | Two separate entry points | One entry point (Catalog row → unified Model detail) |
| **Model detail tabs** | Catalog: Summary / Data / Lineage / Logs / Versions; Lineage: Source Files / Field Mapping / Versions / Logs | Overview · Source Datasets · Field Mappings · Data Preview · Versions · Logs |
| **Connector info location** | Inside Model detail (Catalog Summary view) | Connectors tab only |

### Core Navigation Flow (After)

1. User navigates to Data Studio → Catalog tab loads by default
2. User sees AG Grid model table (grouped by FQ Model type)
3. User clicks a model row → Model detail opens, defaulting to **Overview tab**
4. Overview tab shows: status bar (Total Records, Data Freshness, Last Sync Status, Version), Product Features
5. User navigates to Source Datasets, Field Mappings, Data Preview, Versions, or Logs as needed
6. User clicks back arrow → returns to Catalog landing (filters preserved)
7. User navigates to Connectors tab to manage connection settings

---

## ❓ Open Questions

| # | Question | Owner | Status | Answer |
|---|---|---|---|---|
| OQ-1 | Is the Model detail tab set confirmed as: Overview / Source Datasets / Field Mappings / Data Preview / Versions / Logs? | PM | RESOLVED | Confirmed: 6 tabs — Overview · Source Datasets · Field Mappings · Data Preview · Versions · Logs |
| OQ-2 | Can users add or remove Linked Files/Tables from within the Source Datasets tab, or is that action restricted to the Model Creation / Source Configuration flow? | PM + Engineering | Open | |
| OQ-3 | Should the connector name in the Source Datasets tab be a clickable link or purely a read-only label? | PM + UX | Open | |
| OQ-4 | Should any summary information from the old Catalog landing be retained, or is it fully replaced by the AG Grid table? | PM + UX | Open | |
| OQ-5 | What happens to the "All / Active" filter toggle from the old Catalog landing? | PM | Open | |

---

## 🚫 Gaps

| # | Gap | Impact | Proposed Resolution |
|---|---|---|---|
| G1 | The content of the "Lineage" sub-tab within the old Catalog model detail is not defined in this PRD. | High | Alex to clarify what the "Lineage" sub-tab displayed before this PRD is finalized. |
| G2 | The behavior of Product Features checkboxes is ambiguous. | Medium | Confirm with PM + Engineering whether Product Features are set during model creation, edited inline, or managed elsewhere. |
| G3 | No error or loading states are defined for the Model detail Overview tab. | Low | Define loading and error states during UX design phase. |

---

## 📚 References

- [Catalog: Model Search & Filter PRD](https://floqast.atlassian.net/wiki/spaces/Data/pages/4476731473)
- [Definitions & Terms (Data Studio)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409)
- [Sub-PRD 1: Model Creation & Source Configuration](https://floqast.atlassian.net/wiki/spaces/Data/pages/4450189505)
- [Sub-PRD 2: Field Mapping](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449927443)
- [Sub-PRD 4: Versioning & Lifecycle](https://floqast.atlassian.net/wiki/spaces/Data/pages/4443013309)
- Confluence: https://floqast.atlassian.net/wiki/spaces/Data/pages/4470800387
