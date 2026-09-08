# PRD: Dataset Entity Configuration (DRAFT)

| Field | Value |
|---|---|
| Target release | 2026-06-30 |
| Epic | IDEA-2488 — Data Studio: Platform Features |
| Idea Link | https://floqast.atlassian.net/jira/polaris/projects/IDEA/ideas/view/11291632?selectedIssue=IDEA-2488 |
| Document status | DRAFT |
| Document owner | Alex Kearns |
| Designer | Natasha Clark |
| Tech lead | (assign) |
| Technical writers | (assign) |
| QA | (assign) |
| Depends on | Schema Definition PRD (Step 3 — column list used in pattern detection); File Naming Pattern PRD (Step 2 — tokens may inform entity context) |
| Related sub-PRDs | [Schema Definition](prd-schema-definition.md) · [Accounting Config](prd-accounting-config.md) · [Error Patterns](prd-error-patterns.md) · [Logging & Audit](prd-logging-audit.md) |
| Related PRDs | IDEA-2478 — Entity Mapping (Rebecca Beasley-Cockroft): connection-level entity registration, null tag handling, rehydration, entity-scoped query interface |

---

## 🎯 Objective

This PRD defines **Step 5 of the Add Dataset wizard: Entity Configuration**. It covers how the platform detects the entity structure of an incoming dataset, presents it to the admin for review and confirmation, and allows corrections before the dataset is published.

Entity Configuration determines how the platform identifies which FloQast entity each row or column of data belongs to. Because FloQast entities are already defined in the system (via Entity Mappings), this step does not ask the admin to create entities — it asks them to confirm how entity information is encoded in the file and, where needed, align detected column/row patterns to canonical entity names.

In the Add Dataset wizard, Entity Configuration is Step 5. In dataset Edit mode, it is accessible directly as a tab.

Primary users: Data Studio admins and FloQast implementation team members configuring a new dataset within a Connector.

---

## 🔤 Definitions

See the canonical Data Studio Definitions & Terms page: https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869099

**Key terms for this PRD:**

- **Entity** — A FloQast organizational unit (e.g., a legal entity, subsidiary, or business unit). Entities are defined system-wide in FloQast and exist prior to dataset configuration.
- **Entity Pattern** — The structural way entity information is encoded in a dataset file. Six patterns are supported (see Requirements).
- **Entity Reconciliation** — The process of mapping detected column headers or block identifiers to canonical FloQast entity names. Required for Wide Format and Column Blocks patterns where entity identity is embedded in column naming.
- **Entity Identifier Column** — A file structure where a single column contains an entity identifier value per row, and each row belongs to exactly one entity based on that value (e.g., a `Company_Code` column with values `NAMR`, `EMEA`, `APAC`). The entity each row belongs to can be read directly from the data.
- **Wide Format** — A file structure where some columns are shared across all entities and other columns are entity-specific (e.g., `Account` is shared; `NAMR_balance`, `EMEA_balance`, `APAC_balance` are entity-specific). Entity identity is encoded in the column naming.
- **Column Blocks** — A file structure where all columns are entity-specific with no shared columns, organized as repeating groups — each group representing one entity with the same field set (e.g., `NAMR_Amount`, `NAMR_Budget`, `EMEA_Amount`, `EMEA_Budget`). Similar to Wide Format but without any shared columns.
- **Row Sections** — A file structure where specific row ranges are hard-coded to specific entities (e.g., rows 2–50 belong to NAMR, rows 51–100 belong to EMEA). There is no column value that identifies the entity — the mapping is defined by row position and must be specified by the admin explicitly. Auto-detection is not possible for this pattern.
- **Single Entity** — A file that contains data for exactly one entity. The entity is specified by the admin explicitly rather than detected from the data.
- **No Entity Information** — A file where no entity context is embedded. This is an explicit configuration choice indicating the dataset is not entity-partitioned.

---

## 🏅 Why This Is Important

FloQast is a multi-entity platform. Close data, Flux analysis, and compliance workflows all operate at the entity level — and incorrect entity assignment produces incorrect downstream data. If the platform doesn't know which entity each row or column belongs to, it cannot correctly partition or route data to FloQast products.

Today, entity configuration for a dataset requires engineering involvement. Admins cannot configure it themselves. Making entity configuration self-service — with AI-assisted pattern detection and a guided reconciliation UI for complex patterns — is a prerequisite for Data Studio Beta.

The challenge is that entities can be encoded in files many different ways. Some files have one row per entity. Some have one column block per entity. Some serve a single entity only. Some have no entity context at all. Each pattern requires different configuration logic, and the platform must support all of them.

---

## 🔐 Value Unlocked

Admins and implementation teams can configure entity identification themselves as part of the standard Add Dataset wizard — no engineering involvement. The platform correctly partitions data by entity for every incoming file from the moment the dataset is published.

---

## 🗝️ Key Examples

- **Example 1 (Entity Identifier Column):** A GL file has a `Company_Code` column with values like `NAMR`, `EMEA`, `APAC`. Each row belongs to one entity based on its value in that column. The platform detects this pattern, the admin confirms the column, and maps each detected value to the corresponding FloQast entity.
- **Example 2 (Wide Format):** A trial balance file has columns `NAMR_balance`, `EMEA_balance`, `APAC_balance` alongside a shared `Account` column. The platform detects the wide format pattern, surfaces a reconciliation table showing which detected column prefixes correspond to which FloQast entities, and the admin confirms or corrects the mapping.
- **Example 3 (Column Blocks):** A report file has columns `NAMR_Amount`, `NAMR_Budget`, `EMEA_Amount`, `EMEA_Budget` with no shared columns — every column belongs to an entity block. The platform groups these into blocks and asks the admin to confirm which block maps to which entity.
- **Example 4 (Row Sections):** A file exported from a legacy ERP always places NAMR data in rows 2–50 and EMEA data in rows 51–100, with no column that identifies the entity. There is no way to detect this from the data — the admin selects "Row Sections" and manually specifies the row ranges for each entity.
- **Example 5 (Single Entity):** A vendor delivers a flat file for their US entity only. There is no entity column or column prefix — all data is for one entity. The admin selects "Single Entity" and picks the FloQast entity from a list.
- **Example 6 (No Entity Information):** A reference dataset (e.g., a chart of accounts lookup table) is not entity-scoped. The admin selects "No entity information" and the dataset is treated as global.

---

## 💡 Key Benefits

- Admins configure entity identification without engineering or integrations team involvement
- Six entity patterns are supported, covering the full range of real-world file structures
- AI-assisted pattern detection reduces manual configuration for standard cases
- Entity reconciliation UI for Wide Format and Column Blocks allows admins to correct misdetections without opening a support ticket
- Configuration is set once at the dataset level and applied automatically to every future file

---

## ✅ Use Cases

| # | Persona | Scenario | Expected Outcome |
|---|---|---|---|
| 1 | Admin / Implementation Team | File has a column with entity identifier values per row (Entity Identifier Column) | Admin confirms the entity column and maps each detected value to a FloQast entity |
| 2 | Admin / Implementation Team | File has entity-prefixed columns alongside shared columns (Wide Format) | Admin reviews reconciliation table, confirms or corrects column prefix → entity mapping |
| 3 | Admin / Implementation Team | File has repeating entity column blocks with no shared columns (Column Blocks) | Admin reviews reconciliation table, confirms or corrects block → entity mapping |
| 4 | Admin / Implementation Team | File has entity data in hard-coded row ranges with no entity column (Row Sections) | Admin selects Row Sections and manually specifies the row range for each entity |
| 5 | Admin / Implementation Team | File contains data for exactly one entity with no entity field | Admin selects Single Entity, picks the entity from the list |
| 6 | Admin / Implementation Team | Dataset is a reference/lookup table with no entity scope | Admin selects "No entity information" explicitly |
| 7 | Admin / Implementation Team | Wide format file has a column the platform couldn't match to any entity (orphan column) | Admin uses the reconciliation UI to manually assign the orphan column to an entity |
| 8 | Admin / Implementation Team | Admin is editing an existing dataset's Entity Configuration | Admin opens Edit mode, navigates to Entity Configuration tab, makes changes, and saves |

---

## 📊 Success Metrics

| Goal | Metric | Baseline | Target |
|---|---|---|---|
| Self-service entity config | % of dataset entity configs completed without integrations team involvement | ~0% (all currently manual) | >90% post-launch |
| Pattern auto-detection accuracy | % of datasets where platform correctly detects entity pattern on first attempt | Unknown | TBD |
| Reconciliation correction rate | % of wide/colblock configs requiring manual correction to the auto-detected mapping | Unknown | TBD |

---

## 🤔 Assumptions

**Established**
- FloQast entities are already defined in the system (via Entity Mappings). Entity Configuration does not create or modify entities — it only maps dataset content to existing entities.
- The FQ entity list is maintained within FloQast and is available for retrieval when an admin configures entity settings for a dataset.
- FQ entity names displayed in the entity picker in Data Studio match the names as they appear in the entity management section of FloQast.
- Six entity patterns are supported in v1: Entity Identifier Column, Single Entity, Wide Format, Column Blocks, Row Sections, No Entity Information.
- The platform attempts to auto-detect the entity pattern from the schema confirmed in Step 3.
- When auto-detection produces a suggestion, the admin must review and confirm (or override) before proceeding.
- "No entity information" is an explicit, intentional configuration choice — not a fallback or error state.
- Row Sections pattern is in scope for v1.
- Wide Format and Column Blocks require entity reconciliation: mapping detected column identifiers to canonical FloQast entity names.
- The entity list available for mapping is the set of entities defined in the FloQast system for the relevant tenant (TLC).
- If the FloQast tenant has only a single FQ entity, the Entity Configuration step is bypassed automatically. No admin action is required; all records are assigned to the single entity.
- Records ingested before any entity mapping is configured are stored with a null entity tag. They are not dropped, quarantined, or flagged as errors — they are retained in the data layer and are eligible for retroactive rehydration once a mapping is configured.
- Rehydration of null-tagged records is a supported (though not automatically triggered) operation. The triggering mechanism — manual or automated — will be defined during engineering design.
- The entity selection component in Step 5 is a multi-select control. All selected entities are stored and applied as potential tags at ingestion time. No upper limit is defined at this time (to be confirmed by engineering).
- When a FQ application (e.g., reconciliation, close management) requests data and provides an FQ entity parameter, the platform returns only records tagged with that entity, regardless of the originating dataset.

**Open Items to Confirm**
- When the platform detects the Entity Identifier Column pattern, does it read all distinct values in the entity column from the sample file, or only a limited set?
- For Entity Identifier Column pattern: are values expected to be exact FloQast entity codes, or can they be fuzzy-matched?
- Can a dataset be configured with no entity pattern and later edited to add one? What happens to previously processed data?
- Does changing Entity Configuration on a published dataset trigger a new dataset version?

---

## 🌟 Milestones

### Phase 1 — Entity Configuration at Dataset Level (Target: 2026-06-30)

| Milestone | Owner | Target Date |
|---|---|---|
| Step 5 UI — entity picker (multi-select) + pattern selection + reconciliation tables | Natasha Clark | TBD |
| Entity pattern auto-detection | Engineering | TBD |
| Row Sections entity extraction | Engineering | TBD |
| Wide Format entity reconciliation | Engineering | TBD |
| Column Blocks entity reconciliation | Engineering | TBD |
| Entity mapping to FQ entity list | Engineering | TBD |
| Null entity tag storage and rehydration mechanism | Engineering | TBD |
| Single-entity tenant auto-bypass | Engineering | TBD |
| GL Transaction null-entity warning | Engineering | TBD |
| Entity configuration event logging | Engineering | TBD |

### Phase 2 — Entity Mapping by Company (Future / Out of Scope)

Support for tagging data with a company that is unrelated to an FQ entity. This phase is noted for planning awareness but is explicitly out of scope for this release.

---

## 🗺️ Scope

### 🚗 In Scope
- Auto-detection of entity pattern from schema
- Six entity patterns: Entity Identifier Column, Single Entity, Wide Format, Column Blocks, Row Sections, No Entity Information
- Multi-select entity picker: admin selects which FQ entities this dataset serves (populates from FQ entity management)
- Entity reconciliation UI for Wide Format and Column Blocks (column identifier → FloQast entity mapping)
- Manual correction of auto-detected pattern and reconciliation results
- Mapping to FloQast entities defined in the system
- Single-entity tenant auto-bypass: Entity Configuration step is skipped when the tenant has only one FQ entity
- Null entity tag: records ingested without entity mapping are stored with a null entity tag (not dropped)
- Rehydration mechanism: retroactive application of entity tags to null-tagged records (manual trigger; mechanism TBD in design)
- Entity-scoped query interface: downstream FQ applications can request records filtered by FQ entity parameter
- Warning when a GL Transaction model is configured with "No Entity Information"
- Logging of entity configuration events: who made changes, when, and what changed
- Entity Configuration as Step 5 of the Add Dataset wizard
- Entity Configuration as a directly-accessible tab in dataset Edit mode
- All data model types in scope for IDEA-2487: Accounts, Balances, GL Transactions, Companies, FX Rates

### 🚦 Out of Scope
- Creating or modifying FloQast entities (managed in Entity Mappings, separate workflow)
- Multi-period file splitting (separate concern from entity partitioning)
- Custom entity identifier formats beyond supported patterns
- Entity configuration for non-file-based connectors (API, CDC) — to be evaluated separately
- Historical re-processing when entity config changes on a published dataset
- Company tagging: tagging data with a company unrelated to an FQ entity (deferred to Phase 2)
- Automatic or rule-based entity mapping (e.g., auto-assigning entities based on account codes or data content)
- Write-back of entity associations to source systems — FloQast reads only; no push to external systems
- User-level entity access controls: which users can see which entity-tagged data is governed by FloQast's existing permissions model, not this PRD

---

## 📋 Requirements — User Stories

### Quick Reference

| # | Story | Importance |
|---|---|---|
| EC1 | Auto-detect entity pattern and present for confirmation | High |
| EC2 | Configure Entity Identifier Column pattern | High |
| EC3 | Configure Wide Format pattern and reconcile entities | High |
| EC4 | Configure Column Blocks pattern and reconcile entities | High |
| EC5 | Configure Row Sections pattern | High |
| EC6 | Configure Single Entity pattern | High |
| EC7 | Configure No Entity Information | High |
| EC8 | Correct entity reconciliation mismatches (orphan rows) | High |
| EC9 | Override auto-detected pattern | Medium |
| EC10 | Select which FQ entities this dataset serves (multi-select picker) | High |
| EC11 | Auto-bypass entity configuration for single-entity tenants | High |
| EC12 | Warn when GL Transaction model has no entity configuration | High |
| EC13 | Retain unmapped records with null entity tag | High |
| EC14 | Rehydrate null-tagged records once entity mapping is configured | High |
| EC15 | Log entity configuration changes | High |

---

### EC1 — Auto-Detect Entity Pattern and Present for Confirmation

**User Story:** As an admin, the platform detects how entity information is structured in my file and presents a suggested pattern so I can confirm or correct it rather than selecting from scratch.

**Importance:** High

**Details:** On entering Step 5, the platform analyzes the schema confirmed in Step 3 and presents a suggested entity pattern. The suggestion is labeled as such and the admin must take an explicit action to confirm (or override). If detection confidence is low or the platform cannot determine a pattern, it prompts the admin to select manually.

Note: **Row Sections cannot be auto-detected.** Because row ranges are defined by position rather than any value in the data, there is no signal in the schema from which the platform can infer this pattern. If a dataset uses Row Sections, the admin must select it manually.

**Acceptance Criteria:**

**AC-EC1-01 — Suggested pattern is displayed on entering Step 5**
```
Given I have completed Step 3 (Schema Definition)
When I enter Step 5 (Entity Configuration)
Then the platform displays a suggested entity pattern based on schema analysis
And the suggestion is labeled as "Detected" or "Suggested" (not presented as confirmed)
```

**AC-EC1-02 — Admin must confirm or override before proceeding**
```
Given a suggested pattern is displayed
When I attempt to proceed past Step 5 without taking action
Then the system requires me to confirm or override the suggestion
```

**AC-EC1-03 — Manual selection available when detection is inconclusive**
```
Given the platform cannot confidently determine an entity pattern
When I enter Step 5
Then the UI presents all six pattern options for manual selection
And no pattern is pre-selected
```

---

### EC2 — Configure Entity Identifier Column Pattern

**User Story:** As an admin, I can identify the column that contains entity identifier values so that each row is correctly assigned to a FloQast entity based on that column's value.

**Importance:** High

**Details:** The admin selects the column that contains entity identifier values per row (e.g., `Company_Code`, `Region`). The platform reads distinct values from that column in the sample file and displays them for mapping to FloQast entities. Unlike Row Sections, the entity assignment is data-driven — the platform can read which entity a row belongs to from the file itself.

**Acceptance Criteria:**

**AC-EC2-01 — Admin selects the entity identifier column**
```
Given I select "Entity Identifier Column" as the entity pattern
When the configuration panel renders
Then I can select the entity identifier column from the Step 3 schema columns
```

**AC-EC2-02 — Distinct values are shown for mapping**
```
Given I have selected an entity identifier column
When the mapping panel renders
Then all distinct values detected in that column from the sample file are displayed
And each value has a mapping selector to a FloQast entity
```

**AC-EC2-03 — All detected values must be mapped before proceeding**
```
Given the entity identifier column has been selected
When I attempt to proceed with one or more values unmapped
Then the system blocks progression and indicates which values require mapping
```

**AC-EC2-04 — Mapped values persist in Edit mode**
```
Given an Entity Identifier Column configuration was saved
When I open the Entity Configuration tab in Edit mode
Then the column selection and all value-to-entity mappings are pre-populated
```

---

### EC3 — Configure Wide Format Pattern and Reconcile Entities

**User Story:** As an admin, I can review how the platform has grouped entity-specific columns and correct any mismatches so that the platform correctly associates each column with the right FloQast entity.

**Importance:** High

**Details:** In Wide Format, entity information is encoded in column naming (e.g., `NAMR_balance`, `EMEA_balance`). The platform groups columns by detected entity prefix and presents a reconciliation table — rows represent detected entities (prefixes), columns represent shared field names. The admin reviews this table, confirms correct groupings, and maps each detected entity prefix to a FloQast entity. Orphan columns (detected but not matched to any entity prefix) can be manually assigned.

**Acceptance Criteria:**

**AC-EC3-01 — Reconciliation table shown after pattern confirmation**
```
Given I confirm or select "Wide Format" as the entity pattern
When the reconciliation panel renders
Then a table is displayed with:
  - One row per detected entity prefix (e.g., NAMR, EMEA, APAC)
  - Columns representing the shared fields detected across those rows
  - Cells showing the specific column that maps to each field for each entity
```

**AC-EC3-02 — Each detected prefix must be mapped to a FloQast entity**
```
Given the reconciliation table is shown
When I review each row
Then I can map each detected prefix to a FloQast entity from a dropdown
And all rows must be mapped before I can proceed
```

**AC-EC3-03 — Orphan columns can be manually assigned**
```
Given a column exists in the schema that was not auto-matched to any entity prefix
When I view the reconciliation table
Then the orphan column is surfaced (e.g., in an "Unassigned" section or highlighted row)
And I can assign it to an existing entity row via a dropdown
```

**AC-EC3-04 — Column assignments can be moved between entity rows**
```
Given a column has been assigned to the wrong entity row (either auto-detected or manually)
When I interact with that cell
Then I can reassign it to a different entity row via a move/reassign action
```

---

### EC4 — Configure Column Blocks Pattern and Reconcile Entities

**User Story:** As an admin, I can review how the platform has grouped repeating column blocks and confirm or correct which block corresponds to which FloQast entity.

**Importance:** High

**Details:** In Column Blocks, columns repeat in groups — each group representing one entity (e.g., `NAMR_Amount`, `NAMR_Budget`, `EMEA_Amount`, `EMEA_Budget`). The platform detects the repeating structure and presents a reconciliation table analogous to Wide Format. The admin confirms block-to-entity mapping and corrects any misdetections.

**Acceptance Criteria:**

**AC-EC4-01 — Reconciliation table shows detected column blocks**
```
Given I confirm or select "Column Blocks" as the entity pattern
When the reconciliation panel renders
Then a table is displayed with:
  - One row per detected column block (entity group)
  - Columns representing the repeating fields within each block
  - Cells showing the specific column mapped to each field for each block
```

**AC-EC4-02 — Each block must be mapped to a FloQast entity**
```
Given the reconciliation table is shown
When I review each block row
Then I can map each block to a FloQast entity from a dropdown
And all blocks must be mapped before I can proceed
```

**AC-EC4-03 — Column assignments can be corrected between blocks**
```
Given a column has been assigned to the wrong block
When I interact with that cell
Then I can reassign it to a different block via a move/reassign action
```

---

### EC5 — Configure Row Sections Pattern

**User Story:** As an admin, I can specify which row ranges in this file belong to which entity so the platform can correctly partition data when the entity assignment is determined by row position rather than a column value.

**Importance:** High

**Details:** Row Sections is used when a file's entity assignment is hard-coded by row position — not readable from any column value. The admin manually specifies the row range that belongs to each entity (e.g., rows 2–50 = NAMR, rows 51–100 = EMEA). This pattern cannot be auto-detected by the platform and must always be configured manually.

**Acceptance Criteria:**

**AC-EC5-01 — Admin specifies row ranges for each entity**
```
Given I select "Row Sections" as the entity pattern
When the configuration panel renders
Then I can add one or more row range entries
And for each entry I specify a start row, an end row, and the FloQast entity it belongs to
```

**AC-EC5-02 — Row ranges must be non-overlapping and cover all data rows**
```
Given I have entered one or more row range entries
When I attempt to proceed
Then the system validates that no two ranges overlap
And warns if data rows exist outside all defined ranges
```

**AC-EC5-03 — All row range entries must have an entity mapped**
```
Given one or more row range entries are defined
When I attempt to proceed with any entry missing an entity assignment
Then the system blocks progression and indicates which entries require mapping
```

**AC-EC5-04 — Row Sections configuration persists in Edit mode**
```
Given a Row Sections configuration was saved
When I open the Entity Configuration tab in Edit mode
Then all row range entries and their entity mappings are pre-populated
```

---

### EC6 — Configure Single Entity Pattern

**User Story:** As an admin, I can indicate that all data in this dataset belongs to a single FloQast entity so the platform routes all records correctly without needing to read any column.

**Importance:** High

**Acceptance Criteria:**

**AC-EC6-01 — Admin selects a single FloQast entity**
```
Given I select "Single Entity" as the entity pattern
When the configuration panel renders
Then I can select one FloQast entity from the list of entities defined in the system
And all data from this dataset will be assigned to that entity
```

**AC-EC6-02 — Entity selection is required before proceeding**
```
Given I have selected "Single Entity"
When I attempt to proceed without selecting an entity
Then the system blocks progression and indicates entity selection is required
```

---

### EC7 — Configure No Entity Information

**User Story:** As an admin, I can explicitly mark a dataset as having no entity scope so the platform treats it as a global reference dataset rather than entity-partitioned data.

**Importance:** High

**Details:** "No entity information" is an explicit, intentional choice — not a fallback. It is appropriate for reference datasets (e.g., chart of accounts lookup tables) that are shared across all entities.

**Acceptance Criteria:**

**AC-EC7-01 — "No entity information" is presented as a first-class option**
```
Given I am on the Entity Configuration step
When I view the pattern selection options
Then "No entity information" is listed as an explicit selectable option
And it is clearly labeled as intentional (not an error or skip)
```

**AC-EC7-02 — Selecting "No entity information" requires no further input**
```
Given I select "No entity information"
When I confirm
Then no column selection or mapping is required
And the step is considered complete
```

---

### EC8 — Correct Entity Reconciliation Mismatches (Orphan Rows)

**User Story:** As an admin, I can identify and resolve unmatched columns or blocks that the platform couldn't automatically assign so that no data is lost or misrouted.

**Importance:** High

**Details:** In Wide Format and Column Blocks, auto-detection may fail to match some columns or blocks to an entity. These appear as orphan rows or unassigned columns in the reconciliation table. The admin must resolve all orphans before the configuration can be saved.

**Acceptance Criteria:**

**AC-EC8-01 — Orphan rows are visually distinguished**
```
Given the reconciliation table contains one or more rows the platform could not match
When the table renders
Then unmatched rows are visually distinct from confirmed rows (e.g., different background, warning indicator)
```

**AC-EC8-02 — Orphan rows must be resolved before proceeding**
```
Given one or more orphan rows exist in the reconciliation table
When I attempt to proceed past Entity Configuration
Then the system blocks progression and identifies the unresolved rows
```

**AC-EC8-03 — Orphan rows can be assigned via the reconciliation UI**
```
Given an orphan row is present
When I interact with it
Then I can assign it to an existing entity via a dropdown
Or I can explicitly mark it as "not applicable" if the column should not be entity-mapped
```

---

### EC9 — Override Auto-Detected Pattern

**User Story:** As an admin, I can override the platform's suggested entity pattern if it is incorrect so I can specify the actual structure of my file.

**Importance:** Medium

**Acceptance Criteria:**

**AC-EC9-01 — Pattern override is available from the suggested state**
```
Given the platform has displayed a suggested entity pattern
When I choose not to accept the suggestion
Then I can select any of the six supported patterns manually
And the configuration panel updates to reflect the selected pattern
```

---

### EC10 — Select Which FQ Entities This Dataset Serves

**User Story:** As an admin, I can select which FloQast entities this dataset will produce data for so the platform knows which entity tags to apply at ingestion and what options to show in reconciliation tables.

**Importance:** High

**Details:** At the start of entity configuration (before pattern selection), the admin sees a multi-select entity picker populated from the FQ entity list maintained in FloQast. The entities selected here constrain the options available in all subsequent reconciliation tables and entity pickers within Step 5. The component displays entity names (not IDs) as shown in FQ entity management.

**Acceptance Criteria:**

**AC-EC10-01 — Entity picker displays FQ entity names**
```
Given I am on the Entity Configuration step
When the entity picker renders
Then it displays FQ entity names (not internal IDs) as they appear in FloQast entity management
```

**AC-EC10-02 — Multi-select with clear count indication**
```
Given the entity picker is visible
When I select one or more entities
Then the count of selected entities is clearly displayed
And I can add or remove entities from the selection
```

**AC-EC10-03 — Entity selection constrains reconciliation table options**
```
Given I have selected a set of entities in the picker
When I proceed to pattern-specific configuration (EC2–EC6)
Then only the selected entities appear as options in reconciliation tables and entity dropdowns
```

**AC-EC10-04 — Entity associations can be modified after initial setup**
```
Given entity configuration has been saved and the dataset is in Edit mode
When I open the Entity Configuration tab and modify the entity selection
Then the change is applied without disrupting previously ingested data
```

---

### EC11 — Auto-Bypass Entity Configuration for Single-Entity Tenants

**User Story:** As the platform, I automatically handle entity assignment when the tenant has only one FQ entity so admins don't need to take any action in Step 5.

**Importance:** High

**Details:** If the FloQast tenant has exactly one FQ entity, the entity mapping decision is trivial — all records belong to that entity. The platform should detect this condition and skip Step 5 entirely without requiring admin input.

**Acceptance Criteria:**

**AC-EC11-01 — Step 5 is bypassed when tenant has one entity**
```
Given the FloQast tenant has exactly one FQ entity defined
When the admin reaches Step 5 of the Add Dataset wizard
Then the step is auto-completed and the admin is advanced to the next step
And no entity selection or pattern configuration is required
```

**AC-EC11-02 — Records are assigned to the single entity automatically**
```
Given the Step 5 auto-bypass has occurred
When data is ingested from this dataset
Then all records are tagged with the single FQ entity
```

---

### EC12 — Warn When GL Transaction Model Has No Entity Configuration

**User Story:** As an admin, I am warned when I configure a GL Transaction model with "No Entity Information" so I understand that records will be ingested without entity tags.

**Importance:** High

**Details:** GL Transaction data is entity-sensitive — downstream products (Close, Flux) depend on entity tagging to route it correctly. When the model type is GL Transaction and the admin selects "No Entity Information," the platform must surface a clear warning before the admin can proceed.

**Acceptance Criteria:**

**AC-EC12-01 — Warning is surfaced for GL Transaction + No Entity Information**
```
Given the model type is GL Transaction
And I select "No Entity Information" as the entity pattern
When I attempt to proceed
Then a warning is displayed explaining that all records will be stored with a null entity tag
```

**AC-EC12-02 — Admin must explicitly acknowledge the warning**
```
Given the warning has been displayed
When I acknowledge it
Then I can proceed past Step 5
And the "No Entity Information" selection is saved
```

---

### EC13 — Retain Unmapped Records with Null Entity Tag

**User Story:** As the platform, I retain records that arrive before entity mapping is configured with a null entity tag so they are not lost and can be rehydrated when mapping is added.

**Importance:** High

**Details:** If a file is ingested before Step 5 has been configured (or when entity configuration is "No Entity Information" for a dataset that later gets mapping added), records are stored with a null entity tag. These records are not dropped, quarantined, or flagged as errors.

**Acceptance Criteria:**

**AC-EC13-01 — Records ingested without entity mapping receive null entity tag**
```
Given a dataset has no entity mapping configured
When a file is ingested
Then each record is stored with a null entity tag (not discarded)
```

**AC-EC13-02 — Null-tagged records are distinct from error states**
```
Given records have been stored with a null entity tag
When reviewing run logs or data preview
Then null entity tag is shown as a valid data state, not as an error or failure
```

**AC-EC13-03 — Null-tagged records are accessible for rehydration**
```
Given records have been stored with a null entity tag
When entity mapping is subsequently configured
Then null-tagged records are accessible to the rehydration mechanism (EC14)
```

---

### EC14 — Rehydrate Null-Tagged Records Once Entity Mapping Is Configured

**User Story:** As an admin, I can trigger rehydration of previously ingested null-tagged records once entity mapping has been configured so historical data is correctly tagged.

**Importance:** High

**Details:** Rehydration is not automatically triggered — it is an explicit operation available once entity mapping is configured. The mechanism and triggering (manual or automated) will be determined during engineering design.

**Acceptance Criteria:**

**AC-EC14-01 — Rehydration mechanism is available after entity mapping is configured**
```
Given entity mapping has been configured for a dataset
And records were previously ingested with a null entity tag
When the admin initiates rehydration
Then the system retroactively applies entity tags to null-tagged records based on the current mapping
```

**AC-EC14-02 — Rehydration is not automatically triggered**
```
Given entity mapping is configured or updated
When the mapping is saved
Then rehydration does NOT run automatically
And an explicit action or trigger is required to initiate it
```

**AC-EC14-03 — Rehydration event is logged**
```
Given rehydration has been triggered
When the operation completes
Then a log entry records: who triggered it, when, and what records were affected
```

---

### EC15 — Log Entity Configuration Changes

**User Story:** As an admin, I can view a log of who made entity configuration changes, when, and what was changed so I can audit configuration history.

**Importance:** High

**Details:** All entity configuration events — including initial setup, pattern changes, entity picker changes, and rehydration — must be captured in the audit log. See [Logging & Audit PRD](prd-logging-audit.md) for the overall logging framework; entity configuration events are a required addition.

**Acceptance Criteria:**

**AC-EC15-01 — Entity configuration creation is logged**
```
Given an admin completes entity configuration for a dataset for the first time
When the configuration is saved
Then a log entry records: user, timestamp, dataset, and configuration choices made
```

**AC-EC15-02 — Entity configuration edits are logged**
```
Given an admin modifies existing entity configuration (pattern, entity picker, reconciliation table)
When the change is saved
Then a log entry records: user, timestamp, dataset, and what changed (before/after)
```

**AC-EC15-03 — Log entries are accessible to admins**
```
Given entity configuration log entries exist
When an admin views the dataset's log or audit trail
Then they can see entity configuration events alongside other dataset events
```

---

## ▶️ User Flow Reference

Step 5 of the Add Dataset wizard (5-step flow):
1. Step 1: Dataset Name & Config
2. Step 2: Confirm Filename Pattern
3. Step 3: Define Schema
4. Step 4: Accounting Config
5. **Step 5: Entity Configuration ← this PRD**

In **Edit mode**, the wizard is replaced by a tab bar. The admin can navigate directly to the Entity Configuration tab without stepping through prior steps.

(Link to full user flow document — assign)

---

## 🎨 User Interaction & Design

> To be completed by Natasha Clark. Key questions to resolve:
>
> - How are the six pattern options presented — radio buttons, selectable cards, or another treatment? Should the detected pattern be visually emphasized over others?
> - What does the confidence indicator look like for auto-detected patterns — a confidence label, a badge, a tooltip?
> - How does the reconciliation table handle many columns (20+) in wide format files — horizontal scroll, column grouping, or truncation?
> - In Edit mode, should changing the entity pattern (e.g., from Row Sections to Single Entity) trigger a warning that existing entity assignments will be lost?
> - What is the visual treatment for orphan rows — warning row color, inline alert, or a separate "needs attention" section?

Prototype reference: `playspace/file-definition-design/file-wizard-merged.html` — Step 5 (Entity Configuration)

---

## ✏️ UI Changes

- Entity Configuration step in the Add Dataset wizard: pattern selection (six options) + pattern-specific configuration panel
- Entity Identifier Column: entity identifier column picker + value-to-entity mapping table
- Row Sections: row range builder (start row, end row, entity) + validation for overlapping/uncovered rows
- Wide Format: entity reconciliation table (entity prefix rows × shared field columns) + entity dropdown per row + orphan column assignment
- Column Blocks: entity reconciliation table (block rows × repeating field columns) + entity dropdown per row + inter-row column reassignment
- Single Entity: entity picker (single select from FQ entity list)
- No Entity Information: confirmation UI only, no further input
- In Edit mode: same content accessible directly as a tab; "Save Changes / Cancel" action bar replaces Back/Next wizard navigation

---

## 😎 Future Considerations

- **Entity inference from filename tokens:** If the filename pattern (Step 2) contains an entity token, pre-populate Single Entity or Row Sections configuration automatically.
- **Fuzzy entity value matching:** For Entity Identifier Column, allow values that don't exactly match FQ entity codes to be fuzzy-matched (e.g., "North America" → `NAMR`).
- **Historical re-processing:** When entity configuration changes on a published dataset, provide an option to re-process historical files under the new configuration from a specified effective date.
- **Unmapped value handling:** When an Entity Identifier Column file arrives with a new entity value not in the configured mapping, surface this as a run warning rather than a silent skip.
- **Row Sections row count mismatch:** When a Row Sections file arrives with more rows than the configured ranges cover, provide a clear run warning with the row count discrepancy.
- **Phase 2 — Company tagging:** Support for tagging data with a company that is unrelated to an FQ entity. This is a confirmed future need but is explicitly deferred and not in scope for this release.

---

## ❓ Open Questions

| # | Question | Owner | Status | Answer |
|---|---|---|---|---|
| OQ-1 | When auto-detecting the Entity Identifier Column pattern, does the platform read all distinct values from the sample file's entity column, or is there a cap on how many values are read? | Engineering | Open | |
| OQ-2 | For Entity Identifier Column pattern, are values expected to be exact FloQast entity codes, or is fuzzy/alias matching supported? | Engineering / Product | Open | |
| OQ-3 | If an admin changes the entity pattern on a published dataset (e.g., from Row Sections to Single Entity), what happens to data already processed under the old configuration? Is re-processing required? If so, should the admin be able to specify an effective date? | Engineering / Product | Open | |
| OQ-4 | Does changing Entity Configuration on a published dataset trigger a new dataset version? | Engineering | Open | |
| OQ-5 | In Entity Identifier Column pattern: if a file arrives with a new entity value that wasn't in the configured mapping, how is this handled — run failure, warning, or silent skip? | Engineering | Open | |
| OQ-6 | For Wide Format auto-detection: what heuristic is used to identify entity prefixes from column names? Is this ML-based, pattern-based, or rules-based? | Engineering | Open | |
| OQ-7 | For Row Sections: what happens if a file arrives with more rows than the configured range covers — are extra rows silently dropped, flagged as a warning, or treated as a run failure? | Engineering | Open | |
| OQ-8 | Is there a maximum number of FQ entities that can be mapped to a single dataset? Are there performance implications at scale (e.g., 50+ entities per dataset)? | Engineering | Open | |

---

## 🚫 Gaps

| # | Gap | Impact | Proposed Resolution |
|---|---|---|---|
| G1 | Run-time behavior when an Entity Identifier Column file arrives with an unmapped entity value is not covered in Error Patterns PRD | High | Add new error case to Error Patterns PRD |
| G2 | Entity Identifier Column value resolution failure (unrecognized entity code) has no defined error case | Medium | Add to Error Patterns PRD |
| G3 | Historical re-processing when entity config changes on a published dataset | Medium | Deferred to future release; add effective date OQ to cross-cutting PRD-1 open questions |

---

## 📚 References

### Related Sub-PRDs
- [Schema Definition](prd-schema-definition.md) — Step 3; provides the column list used in entity pattern detection
- [Accounting Config](prd-accounting-config.md) — Step 4; entity config is a separate step and must not be conflated
- [Error Patterns & Handling](prd-error-patterns.md) — entity mapping failures need to be added as new error cases
- [Logging & Audit](prd-logging-audit.md) — entity assignment events should be logged per file load

### Design Resources
- Prototype: `playspace/file-definition-design/file-wizard-merged.html` — Step 5 (Entity Configuration)
- Figma: (assign when available)

### Engineering References
- IDEA-2487: https://floqast.atlassian.net/jira/polaris/projects/IDEA/ideas/view/11291632?selectedIssue=IDEA-2487
- IDEA-2478 (Entity Mapping — Rebecca Beasley-Cockroft): covers entity registration, null tag handling, rehydration, and entity-scoped query interface. Placement resolved to dataset level, aligning with this PRD.
