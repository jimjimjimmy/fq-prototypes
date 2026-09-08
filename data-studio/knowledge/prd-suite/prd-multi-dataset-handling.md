# PRD: Multi-Dataset Handling

| Field | Value |
|---|---|
| **Owner** | Alex Kearns |
| **Status** | Draft |
| **Epic** | IDEA-2487 — Multi-File Handling & Global Dimensions |
| **Dependencies** | None |

---

## Objective

Today, a Data Studio model (i.e. "lineage" or "recipe" specifying how the source datasets are normalized into a FQ canonical model) supports only a single source dataset. When a customer's data requires combining multiple source files to normalize into the FloQast Canonical Model, there is no way to do this within Data Studio — leaving customers unable to complete their configuration without external pre-processing.

This PRD defines the following new capabilities:

1. A model can reference multiple source datasets simultaneously
2. Datasets can be joined using Left Join or Inner Join, configured through a user-friendly UI
3. Datasets can be unioned/grouped, with a grouped set treated as a single logical dataset

**Initial limits:** A model supports up to 10 datasets (where a grouped set of datasets counts as 1). A single group may contain up to 10 individual datasets as members. These limits may be relaxed in future iterations.

**Customer outcome:** Users can define a complete recipe — a source-to-target mapping of their data into a FloQast Canonical Model — using multiple source datasets, without requiring data pre-processing outside of Data Studio.

---

### Dataset Prerequisites

Before a user builds a model, each source dataset has already been configured through the Dataset Wizard. Two configurations established at the dataset level are directly relevant to how joins work:

* **Entity Configuration (Step 5 of the Dataset Wizard):** Each dataset is configured to identify which FloQast entity each row or column of data belongs to. A dataset may be entity-mapped (one or more entities), or explicitly configured as "No Entity Information" (reference/global data).
* **Accounting Period Configuration (Step 4 of the Dataset Wizard):** Each dataset is configured to identify which accounting period an incoming file belongs to — either from the filename or from a column inside the file. A dataset may be period-configured, or explicitly tagged as "No Accounting Period Information" — typically for reference data (e.g. chart of accounts) or dimensional data (e.g. cost centers) that is not tied to a close cycle.

These configurations are established before the model is created. When a user configures joins in a model, they do not re-specify entity or period information — the model inherits this from the datasets. Both entity matching and accounting period scoping are applied by the system automatically at join time (see Assumptions).

---

## Key Benefits

| Beneficiary | Benefit |
| --- | --- |
| **Customer Users** | Reduced dependency on IT during onboarding and configuration. |
| **Customer IT Teams** | Lower lift required to support a FloQast implementation. |
| **FloQast Sales** | Stronger buy-in from IT stakeholders at prospective and existing accounts. |
| **FloQast Product (AI Variance, Transform)** | Richer, more complete datasets flowing into the Canonical Model unlocks better downstream product usage and creates natural upsell opportunities. |

---

## Why This Is Important

FloQast's current Data Studio offering is too rigid for the complexity of real customer data. Today, a model only supports a single source dataset — meaning customers whose data is spread across multiple files cannot fully configure their source-to-target mapping within Data Studio. This forces them to pre-process or consolidate data externally before it can be used, increasing IT burden and slowing implementation timelines.

Supporting multiple source datasets directly addresses this by:

* **Expanding product coverage** — richer, more complex customer data can be mapped into the FloQast Canonical Model without external intervention
* **Reducing implementation friction** — customers spend less time on data preparation, lowering IT lift during onboarding and configuration
* **Strengthening the Cloud Connect migration story** — this capability expands meaningfully on what Cloud Connect offers today, making it easier to move existing customers to Data Studio

This feature is targeted for Q2 2026. It is required to meet commitments to strategic customers (including Wayfair) and to establish Data Studio as a credible step forward from Cloud Connect from day one of general availability.

---

## User-Flow Diagrams

| **User Flow Diagram** | **User Flow Mark Down File** | **Description/ Overview** |
| --- | --- | --- |
|  | n/a | Landing page / navigation hub for the three diagrams. It lists the three diagrams as clickable cards (each links to its corresponding .html file), with a short summary. |
|  |  |  The top-level journey for an admin building a multi-dataset model, from Sources through to Publish. |
|  |  | The detailed flow for combining two or more datasets with identical schemas into a single logical unit (a union), and managing group membership afterward.  |
|  |  |  The detailed flow for configuring a join between any two datasets or groups, including AI-assisted ON condition suggestions.  |


## Preliminary Mock Ups/ Visual References

##

| **Prototype** | **Loom Video** | **Notes** |
| --- | --- | --- |
| [Figma File - Source Datasets in a Model](https://www.figma.com/make/shPr2fQIIEGWp7zqV8oZCp/Source-Datasets---Linking-and-Grouping?t=zx91iLvCp1FmRn1v-1) | https://www.loom.com/share/69ba977a442c4f2a8d6fb2ce48cf06f7  | Shows how to group & link datasets together. |
| [Reference from Design Team (on Source Datasets)](https://www.figma.com/design/2lWgrzEE6mc6yW3fM1MrUI/Data-Studio---For-Dev?node-id=33-37417&t=JPbKrRRZd3fMI7Vo-1)  |  | This more closely matches our look and feel, for your reference. |


---

## Use Cases

### UC-1: Adding and Linking Multiple Source Datasets to a Model

A user has already created connectors and defined source datasets. They navigate to the Catalog and create a new model, providing a name. Within the model, they go to **Sources**.

1. The user designates a **primary dataset** from the available connectors and datasets (existing functionality)
2. The user adds one or more **secondary datasets** via drag and drop
3. The user selects **"Link Datasets"** — the system loads the most recent available data for each dataset (sample data or data received via SFTP/transport), using up to the first 100 rows
4. Using AI, the system suggests an **ON condition** (join key) based on column names and sample data values. The suggestion quality is logged to support future model improvement
5. The user reviews the suggestion and either confirms it or defines their own ON condition. The ON condition supports multiple clauses (AND / OR)
6. The user selects a **join type** — presented in plain language in the UI (not as SQL terms), mapping to Left Join or Inner Join
7. The user proceeds to **Field Mappings**, where they define transformation functions. Column names are displayed with dataset attribution to help the user distinguish which source each field comes from

### UC-2: Grouping Datasets (Union)

A user has multiple source datasets with identical schemas that represent the same logical data (e.g. the same file from multiple entities or time periods). A common real-world trigger for this is **Islands** — separate tables placed in different locations within the same Excel or CSV file. Each island–entity association produces its own source dataset (confirmed by Engineering). When a user wants to treat these as a single logical dataset, they group them.

1. The user designates these datasets as a **Group**, providing a group name for reference
2. The system validates that all datasets in the group share an exact schema match — mismatches are surfaced as an error
3. The group is treated as a single logical dataset throughout the model and can be linked to other datasets using the same join flow as UC-1
4. The group name is used wherever this logical dataset is referenced in the UI (field mappings, lineage, etc.)

### UC-3: Combined Grouping and Linking in a Single Model

A user needs to build a model that combines both grouped datasets (union) and linked datasets (join).

1. The user defines one or more **Groups** (as in UC-2), giving each a name
2. The user then links groups and/or individual datasets together using a join (as in UC-1)
3. The UI guides the user to complete grouping before linking, though this order is not strictly enforced
4. **Order of operations:** Regardless of the order the user configures them in the UI, the system always performs unions before joins on the back end — grouped datasets are fully resolved into a single logical dataset before any join is applied

### UC-4: Edge Cases — File Arrival and Run Timing

The following scenarios arise when datasets in a model do not all arrive at the same time. These are partially open questions (see Open Questions section) but are called out here as use cases requiring defined behavior:

* **Only the primary dataset arrives:** If secondary datasets have not yet arrived, the system needs a defined behavior — wait, run partial, or error
* **Secondary dataset is reference data:** Some secondary datasets may be relatively static (e.g. a chart of accounts that rarely changes). The system should support joining to the most recent available version of that dataset even if no new file has arrived
* **New file arrives for one dataset in a model:** It is not yet defined whether a new file for any dataset triggers a model run, or whether all datasets must have new data present before a run is triggered
* **Grouped datasets — partial arrival:** If a group is defined but not all datasets within the group have arrived, it is not yet defined whether the system waits for all group members before running

---

## Open Items to Confirm

| # | Item | Owner |
| --- | --- | --- |
| 1 | **ON condition complexity for v1** — What is the agreed scope? Options: (a) single-field only, (b) AND/OR multi-clause, (c) nested conditions. Must be decided before requirements are finalized. Note that this does not include implicit join conditions (entity/period) as mentioned above. | Alex / Engineering |
| 2 | **Substring support in ON conditions** — Is substring matching required for v1, or deferred to a future iteration? | Alex / Engineering |
| 3 | **File arrival behavior — primary only** — If secondary datasets have not yet arrived when a run is triggered, what is the expected behavior: wait, run partial, or error? Does the arrival of the secondary at a later time trigger a re-run? | Engineering |
| 4 | **Reference data behavior** — Should the system support joining to the most recent available version of a static/reference dataset even when no new file has arrived? | Engineering |
| 5 | **Run trigger logic** — Does a new file arriving for any dataset in a model trigger a run, or must all datasets have new data present? | Engineering |
| 6 | **Grouped datasets — partial arrival** — If not all datasets within a group have arrived, does the system wait, run with what's available, or error? | Engineering |
| 7 | **Versioning & rehydration** — How does model versioning and teardown/rehydration work across this feature? Needs a separate definition and cross-reference. | TBD |
| 8 | **~~Implicit join conditions — Accounting Period & partial entity mapping~~** — **Resolved.** Both entity matching and accounting period scoping are applied automatically by the system at join time. The user does not specify these in the ON condition. See Assumptions 12–14. | Alex / Engineering |
| 9 | **Join topology** — When a model has a primary dataset and multiple secondary datasets, two topologies are possible: (a) **Star** — all secondary datasets join directly to the primary; (b) **Chain** — a secondary dataset may join to another secondary rather than to the primary. Ideally both are supported. If only one is feasible for v1, Star is the firm requirement. | Engineering |

---

## Assumptions — Established

The following decisions have been made and should be taken as given:

1. **Dataset limit:** A model supports a maximum of 10 datasets, where a grouped set counts as 1 toward that total. A single group may contain up to 10 individual datasets as members. These limits may be relaxed in future iterations but are fixed for v1.
2. **Supported join types:** Left Join and Inner Join only for v1. No other join types are in scope.
3. **Grouping requires exact schema match:** Datasets cannot be grouped unless their schemas are identical. Mismatches must be surfaced as an error.
4. **Order of operations:** The system always performs unions before joins on the back end, regardless of the order the user configures them in the UI. When a model contains multiple joins, the system determines the execution order automatically based on the join topology — the user does not specify join execution order. For star topology (all secondaries joining directly to the primary), join order does not affect the result. For chain topology (a secondary joining to another secondary), the system must resolve joins in dependency order. How the system determines and communicates execution order to the user is an open question pending resolution of the join topology open item (OQ #9).
5. **AI-suggested ON conditions:** The system will use AI to suggest join keys based on column names and sample data drawn from the most recent file arrival for each dataset. Sample size is a minimum of 100 rows where available. Suggestion quality will be logged to support future improvement.
6. **ON condition complexity:** TBD — see Open Items. Initial thinking is to support at least a single-field ON condition in v1, with AND/OR and nested conditions as a potential expansion. Scope must be agreed before requirements are finalized. Note: this complexity assessment covers only the user-defined business key condition — entity matching and accounting period scoping are applied automatically by the system and are not part of the ON condition scope (see Assumptions 12–14).
7. **Type casting:** When the fields selected for an ON condition are different types (e.g. integer vs. varchar), the system automatically applies basic type casting to allow the join to execute correctly — the user does not need to specify or manage this.
8. **UI language:** Join types are presented in plain, user-friendly language — SQL terminology (LEFT JOIN, INNER JOIN) is not surfaced to the user.
9. **Field mapping attribution:** In the field mapping step, column names must be displayed with their source dataset clearly indicated to reduce user confusion.
10. **Versioning, rehydration, and teardown:** How model versioning and the resulting teardown/rehydration behavior works is broader than this PRD and is not addressed here. This needs to be defined separately and cross-referenced once available.
11. **Islands are handled via the existing dataset model:** In Excel and some CSV files, users may place multiple separate tables in different locations within the same document. Each island–entity association is treated as an individual source dataset — confirmed by Engineering (Raghvendra Garg). An island that spans multiple entities may therefore produce more than one dataset. Multi-Island files are supported through the grouping and linking functionality defined in this PRD — no separate Island-specific handling is required.
12. **Entity join isolation — system-enforced:** A dataset mapped to one entity cannot be joined to a dataset mapped to a different entity. The system prevents this — it is not left to the user to avoid. Two valid join scenarios exist:

    * **Entity-matched join:** Both datasets are entity-mapped to the same entity. The system automatically scopes the join to matching entity data.
    * **Entity-to-reference join:** One dataset is entity-mapped; the other is configured as "No Entity Information" (reference/global data). The system permits this join without entity scoping on the reference side.


    Any attempt to join a dataset mapped to Entity A with a dataset mapped to Entity B is blocked by the system.


    **Unmapped entity rows:** A dataset may contain rows where the entity identifier value does not resolve to a known FloQast entity — for example, a new entity code that appears in the source file after the dataset was configured. These rows must not be silently dropped. They pass through the model run tagged as **unmapped**, consistent with the behavior defined in Rebecca Beasley-Cockroft's entity mapping PRD (IDEA-2478). The run log must capture the count of unmapped entity rows and surface the unrecognized values so the admin can update the entity mapping. This is not a run failure — it is a data quality signal.


13. **Accounting period scoping — automatic:** When a model run executes, it operates in the context of a specific accounting period. The system automatically scopes each dataset's contribution to data for that period, based on the dataset's pre-configured Accounting Period Configuration. The user does not include period matching in the ON condition — it is applied implicitly by the system. Two exceptions apply:

    * **Datasets tagged "No Entity Information":** Typically also tagged "No Accounting Period Information." The system joins to their most recent available snapshot without entity or period scoping.
    * **Datasets tagged "No Accounting Period Information":** Some datasets have no meaningful accounting period — typically reference data (e.g. chart of accounts, vendor master) or dimensional data (e.g. cost centers, entity lists) that is static or slowly-changing and not tied to a close cycle. These may or may not be entity-mapped. In either case, the system joins to the most recent available data for that dataset without period scoping. This is a valid configuration state, not a misconfiguration.

14. **ON condition scope:** The user-defined ON condition covers only the business relationship between datasets (e.g., a shared account code, transaction ID, or vendor key). Entity matching and accounting period scoping are system-applied automatic constraints, not part of the ON condition. This means the ON condition for a given join can be simpler than it might otherwise appear — entity and period are not clauses the user needs to express.
15. **Logging requirements:** Two categories of logging are required:

    * **Run Logs:** Capture when a model run occurred, row counts for each source dataset before and after processing, and whether the run completed successfully or failed
    * **Change Logs:** Capture user-initiated configuration changes, including adding/removing datasets, creating or modifying groups, and adjusting linking/join settings


---

## Scope

### In Scope

* Designating a primary dataset within a model (existing functionality, confirmed in scope)
* Adding one or more secondary datasets to a model via drag and drop
* Linking datasets using Left Join or Inner Join, with AI-suggested ON conditions
* ON condition configuration by the user, with type casting supported when field types differ
* Grouping datasets (union) where schemas are an exact match, with a user-defined group name
* Combining grouped datasets and linked datasets within a single model
* Field mapping with source dataset attribution displayed per column
* AI suggestion quality logging
* Run Logs and Change Logs (as defined in Assumptions)
* Entity join isolation enforcement (entity-mapped datasets cannot join to datasets mapped to a different entity)
* Error patterns & handling — user-facing error messages for failure states (e.g. invalid join key, schema mismatch, type conflict)

### Out of Scope

* **Other join types** (right join, full outer join, cross join, etc.) — deferred to future iterations
* **Substring matching in ON conditions** — deferred; basic type casting is supported in v1
* **Versioning & rehydration (full treatment)** — the broader versioning and teardown/rehydration model is out of scope here. However, two specific behaviors must be defined for v1:

    * **Adding a linked dataset (join):** This is a structural change to the model and must require the user to create a new version
    * **Adding a grouped dataset:** This is likely additive and may not require a version increment — to be confirmed with Engineering before implementation

* **Scheduling and run trigger configuration** — handled in separate PRDs (IDEA-2488)
* **Schema versioning for source datasets** — what happens when a source file's schema changes (new/removed columns, type changes) is not addressed here and needs its own definition

---

## Requirements

### Group 1: Sources

**US-1: View available datasets when building a model**
_As a user, I want to see all available connectors and datasets when setting up Sources, so that I can choose which data to include in my model._

* **AC1:** Given I am on the Sources step of a model, when the step loads, then I can see all connectors and datasets available to me
* **AC2:** Given I am on the Sources step, when I view the list, then each dataset is clearly identified by its name and associated connector

---

**US-2: Designate a primary dataset**
_As a user, I want to designate one dataset as the primary source for my model, so that there is a clear base dataset for my recipe._

* **AC1:** Given I am on the Sources step, when I select a dataset as primary, then it is visually distinguished from any secondary datasets
* **AC2:** Given I have designated a primary dataset, when I attempt to proceed without one, then the system prevents progression and displays an informative message
* **AC3:** Given I have a primary dataset designated, when I want to change it, then I must first designate another dataset as primary before the current one can be removed

---

**US-3: Add secondary datasets via drag and drop**
_As a user, I want to add secondary datasets to my model via drag and drop, so that I can incorporate multiple data sources into a single recipe._

* **AC1:** Given I have designated a primary dataset, when I drag and drop an additional dataset onto the Sources canvas, then it is added as a secondary dataset
* **AC2:** Given I have added one or more secondary datasets, when I view Sources, then secondary datasets are visually distinct from the primary dataset
* **AC3:** Given I have secondary datasets, when I remove one, then all other dataset configurations in the model are preserved

---

**US-4: Enforce dataset limit**
_As a user, I want the system to prevent me from exceeding supported limits, so that my model stays within what the system can reliably process._

* **AC1:** Given I have 10 datasets in a model (where a grouped set counts as 1 toward the total), when I attempt to add another dataset, then the system prevents the addition and displays a message explaining the limit
* **AC2:** Given a group already contains 10 individual datasets, when I attempt to add another dataset to that group, then the system prevents the addition and displays a message explaining the group membership limit

---

### Group 2: Grouping

**US-5: Create a group of datasets**
_As a user, I want to group multiple datasets together so that they are treated as a single logical dataset (union) within my model._

* **AC1:** Given I have two or more datasets available, when I designate them as a group, then the system validates that all datasets in the group have an exactly matching schema before confirming the group
* **AC2:** Given the schema validation passes, when the group is created, then it appears as a single logical dataset throughout the model (Sources, linking, field mapping)
* **AC3:** Given I attempt to group datasets with mismatched schemas, when I confirm the group, then the system surfaces an error identifying the mismatch and does not create the group

---

**US-6: Name a group**
_As a user, I want to give a group a name so that I can easily identify it throughout the model configuration._

* **AC1:** Given I am creating a group, when I confirm the group, then I am required to provide a name before the group is saved
* **AC2:** Given a group has been named, when it appears in Sources, field mapping, or lineage, then it is referenced by its group name rather than the individual dataset names
* **AC3:** Given I am naming a group, when I enter a name that is already used by another group in the same model, then the system prevents the group from being saved and displays an error indicating the name must be unique within the model
* **AC4:** Given I am renaming an existing group, when I enter a name that is already used by another group in the same model, then the system prevents the rename and displays the same error — uniqueness is enforced on both creation and rename

---

**US-7: Manage datasets within a group**
_As a user, I want to add or remove datasets from an existing group so that I can adjust my configuration without rebuilding the model._

* **AC1:** Given I have an existing group, when I add a new dataset to it, then the system validates schema match against the existing group members before confirming the addition
* **AC2:** Given I have an existing group, when I remove a dataset from it, then the remaining group members and all other model configuration are preserved
* **AC3:** Given I remove all but one dataset from a group, when the group has only one member remaining, then the system either dissolves the group or prompts the user to confirm whether to keep it as a group

---

### Group 3: Linking

**US-8: Initiate dataset linking**
_As a user, I want to link datasets together so that I can define how they relate to each other within my model._

* **AC1:** Given I have a primary dataset and at least one secondary dataset or group designated, when I select "Link Datasets," then the system initiates the linking configuration
* **AC2:** Given I am in the linking configuration, when I view it, then all datasets and groups in the model are available to link

---

**US-8a: Configure multiple links across three or more datasets**
_As a user, I want to be able to define links between all datasets in my model — not just two — so that a model with multiple secondary datasets is fully configured before I can publish._

* **AC1:** Given I have more than two datasets or groups in my model, when I am in the linking configuration, then I can define a separate ON condition and join type for each pair of datasets that need to be linked — each link is configured independently
* **AC2:** Given I have configured one link, when I return to the Sources canvas, then the configured link is visually represented and I can initiate configuration of the next link without losing prior work
* **AC3:** Given some links in a model are configured and others are not, when I view Sources, then the UI clearly distinguishes between links that are fully configured and dataset pairs that still require a link to be defined
* **AC4:** Given I have secondary datasets or groups in my model, when I attempt to proceed from Sources to Field Mapping, then the system checks that every secondary dataset and group has at least one link defined — if any are unlinked, the system prevents progression and clearly identifies which datasets or groups still need a link configured
* **AC5:** Given a model has one or more secondary datasets or groups without a configured link, when I attempt to publish the model, then the system blocks publishing and surfaces an error identifying the unlinked datasets or groups — a model with unlinked datasets cannot be published in any state
* **AC6:** Given I am viewing the model overview or Sources step, when the model has incomplete linking, then the UI surfaces a clear indicator that the model is not publishable due to missing links — the user should not have to attempt publishing to discover this

---

**US-9: Receive an AI-suggested ON condition**
_As a user, I want the system to suggest a join key for me so that I don't have to manually identify matching fields across datasets._

* **AC1:** Given I have initiated linking between two datasets, when the linking configuration loads, then the system presents an AI-suggested ON condition based on available data — the underlying data is not exposed to the user
* **AC2:** Given a suggestion is presented, when I view it, then the suggested fields from each dataset are clearly identified by name
* **AC3:** Given a suggestion is presented, when the system generates it, then the suggestion quality is logged internally to support future model improvement

---

**US-10: Confirm or modify the ON condition**
_As a user, I want to confirm or override the suggested ON condition so that I have control over how my datasets are joined._

* **AC1:** Given an ON condition has been suggested, when I confirm it, then the condition is saved and I can proceed to select a join type
* **AC2:** Given an ON condition has been suggested, when I modify it, then I can select different fields from either dataset to use as the join key
* **AC3:** Given I am configuring an ON condition, when I need to express a more complex condition, then I can add additional clauses using AND / OR operators
* **AC4:** Given I confirm or modify a suggested ON condition, when the action is saved, then the system logs whether the suggestion was accepted as-is or modified — including what the original suggestion was and what the user changed it to. This data is used to improve future AI suggestions.

---

**US-11: Type casting for mismatched field types**
_As a user, I want the system to handle type differences between join fields automatically so that I don't have to pre-process my data to make a join work._

* **AC1:** Given I select fields for an ON condition where the field types differ (e.g. integer and varchar), when I confirm the condition, then the system automatically applies type casting to allow the join to execute
* **AC2:** Given type casting is applied, when I view the ON condition, then the casting is indicated so I am aware of the type difference

---

**US-12: Select a join type**
_As a user, I want to select how my datasets are joined so that the output reflects the data relationship I intend._

* **AC1:** Given I have configured an ON condition, when I select a join type, then the options are presented in plain language (not SQL terminology)
* **AC2:** Given I select a join type, when the model runs, then the system applies the corresponding SQL join (Left Join or Inner Join) as defined by my selection
* **AC3:** Given I have not selected a join type, when I attempt to proceed, then the system prevents progression and prompts me to make a selection

---

**US-13: System automatically enforces entity isolation and accounting period scoping**
_As a user, I want the system to handle entity matching and period scoping automatically so that I cannot accidentally create cross-entity joins and do not need to include entity or period logic in my ON condition._

* **AC1:** Given I attempt to link a dataset mapped to Entity A with a dataset mapped to Entity B, when I initiate linking, then the system prevents the join and surfaces an informative error — this is not a warning the user can dismiss and proceed
* **AC2:** Given I link a dataset mapped to a specific entity with a dataset configured as "No Entity Information" (reference data), when I initiate linking, then the system permits the join
* **AC3:** Given a model run is triggered for a specific accounting period, when the system executes the join, then each entity-mapped dataset contributes only data for that period — the user does not specify period matching in the ON condition
* **AC4:** Given one dataset in a join is tagged "No Accounting Period Information" (with or without entity mapping), when the join executes, then that dataset contributes its most recent available snapshot without period filtering
* **AC5:** Given a dataset contains rows where the entity identifier value does not resolve to a known FloQast entity, when the model run executes, then those rows pass through the join tagged as **unmapped** — they are not silently dropped. The run log captures the count of unmapped entity rows and the unrecognized entity values, so the admin can update the entity mapping.

---

### Group 4: Field Mapping

**US-14: View field mapping with dataset attribution**
_As a user, I want to see which dataset each column comes from when configuring field mappings, so that I can accurately map source fields to the target canonical model without confusion._

* **AC1:** Given I am on the Field Mapping step of a model with multiple source datasets, when I view available source columns, then each column is labeled with the name of the dataset or group it originates from
* **AC2:** Given two or more datasets share a column name, when I view the field mapping, then the dataset attribution label clearly distinguishes which column belongs to which dataset
* **AC3:** Given a column originates from a grouped dataset, when I view the field mapping, then the attribution label shows the group name — not the names of the individual files within the group. For example, a column from a group named "GL Transactions" is labeled _"GL Transactions: Account Code"_, not _"GLTransactions_EMEA.csv: Account Code"_ or a list of all member files. Showing individual filenames within a group would make the field mapping unreadable for groups with many members.

---

**US-15: Map fields from multiple source datasets to the canonical model and custom fields**
_As a user, I want to map columns from any of my source datasets to the target canonical model fields or custom fields, so that I can build a complete recipe regardless of which dataset a field comes from._

* **AC1:** Given I have multiple linked datasets or groups in my model, when I configure field mappings, then columns from all datasets and groups are available for mapping
* **AC2:** Given I have mapped a field from a secondary dataset or group, when I save the mapping, then it is preserved and attributed to the correct source
* **AC3:** Given I am configuring field mappings, when I select a target field, then both canonical model fields and custom fields are available as mapping targets

---

### Group 5: Error Handling

**US-16: AI cannot suggest an ON condition**
_As a user, I want to be taken directly to manual field selection if the system cannot generate a suggestion, so that my workflow isn't interrupted._

* **AC1:** Given the system is unable to generate an ON condition suggestion, when linking loads, then the user is taken directly to the manual field selection interface without being shown an error
* **AC2:** Given a suggestion failure occurs, when the system falls back to manual selection, then the failure is logged internally for investigation and model improvement — it is not surfaced to the user

---

**US-17: Invalid or incomplete ON condition**
_As a user, I want the system to catch invalid join key configurations before I proceed, so that I don't encounter silent failures during a model run._

* **AC1:** Given I have defined an ON condition, when I attempt to proceed without selecting a field from both datasets, then the system surfaces an error and prevents progression
* **AC2:** Given I have defined an ON condition with incompatible field types and casting is not possible, when I attempt to confirm, then the system surfaces an informative error explaining the incompatibility

---

**US-18: Model run failure due to join or grouping**
_As a user, I want to be clearly informed when a model run fails due to a dataset configuration issue, so that I can diagnose and correct it._

* **AC1:** Given a model run fails due to a join error (e.g. no matching rows, key not found), when the run completes, then the user is shown an error message that identifies which datasets were involved and the nature of the failure
* **AC2:** Given a model run fails due to a grouping error (e.g. schema mismatch detected at run time), when the run completes, then the user is shown an error message that identifies the affected group and the nature of the failure
* **AC3:** Given a run failure occurs, when the user views the error, then the message is written in plain language — no raw SQL or system internals are exposed

---

**US-19: Entity mismatch detected when linking datasets**
_As a user, I want the system to catch entity mismatches at configuration time — not at run time — so that I cannot build a model with an invalid join that will fail silently or produce incorrect output._

* **AC1:** Given I attempt to link Dataset A (mapped to Entity X) with Dataset B (mapped to Entity Y, where Y ≠ X), when I initiate linking, then the system immediately blocks the action and displays an error identifying the two conflicting entities by name — for example: _"\[Dataset A\] is mapped to APAC. \[Dataset B\] is mapped to EMEA. Datasets mapped to different entities cannot be joined."_
* **AC2:** Given I attempt to link a dataset that is mapped to a specific entity with a dataset configured as "No Entity Information" (reference data), when I initiate linking, then the system permits the action — no error is shown
* **AC3:** Given I attempt to link two datasets with incompatible entity configurations, when I initiate the link, then the system blocks the link and surfaces the entity mismatch error at that point — the check is deferred to link time, not canvas addition time, because a dataset added to the canvas may be intended for grouping rather than linking, and grouping does not have the same entity restriction
* **AC4:** Given an entity mismatch error is displayed, when the user reads it, then the message names both datasets and both entities involved, and does not expose internal system identifiers or technical terms
* **AC5:** Given an entity mismatch error is displayed when attempting to link, when the user dismisses it, then the link is not created — the datasets remain on the canvas and the user can still group them or reconfigure their entity settings
* **AC6:** Given a model was saved with a valid entity configuration, and a dataset's entity mapping is subsequently changed such that a previously valid link now represents an entity mismatch, when the model next attempts to run, then the run is blocked — it does not execute partially and does not produce output. The error is logged against the model, identifying the affected datasets and the nature of the conflict. All subsequent runs for that model are blocked until the conflict is resolved — either by correcting the entity mapping or by removing the invalid link. The model's status must reflect this blocked state so the admin is not left wondering why runs are not executing.

---

### Group 6: Logging

**US-20: Run logs are captured and visible at the model level**
_As an administrator, I want to view a log of all runs for a specific model so that I can audit when data was processed and whether it succeeded._

* **AC1:** Given a model run is triggered, when the run completes (successfully or not), then a run log entry is created capturing: run timestamp, row count per source dataset before processing, row count after processing, and run outcome (success / failure)
* **AC2:** Given I am viewing a model, when I navigate to the Logs tab, then I can see all run log entries for that model in a table, with the ability to expand each entry to view per-dataset row count detail
* **AC3:** Given I am viewing the Logs tab, when I want to narrow results, then I can filter by run status and date range
* **AC4:** Given a run log entry exists, when I view it, then I can identify which model it belongs to and which datasets were involved

---

**US-21: Run logs are visible at the global model level**
_As an administrator, I want to view run logs across all models in one place so that I can monitor overall pipeline health without navigating into each model individually._

* **AC1:** Given I am viewing the global models list, when I navigate to the global Logs view, then I can see run log entries across all models
* **AC2:** Given I am viewing the global Logs view, when I want to narrow results, then I can filter by model, run status, and date range

---

**US-22: Configuration changes are captured in a change log**
_As an administrator, I want a log of user-initiated configuration changes so that I can audit how a model has been modified over time._

* **AC1:** Given a user adds or removes a dataset from a model, when the change is saved, then a change log entry is created capturing the action, the dataset affected, the user who made the change, and the timestamp
* **AC2:** Given a user creates, modifies, or removes a group, when the change is saved, then a change log entry is created with the same detail
* **AC3:** Given a user modifies a linking configuration (join type, ON condition), when the change is saved, then a change log entry is created with the same detail

---

### Group 7: Versioning

**US-23: Adding a linked dataset requires a new model version**
_As a user, I want the system to require a new version when I add a join to my model, so that structural changes are tracked and prior configurations are preserved._

* **AC1:** Given I have an active model, when I add a new linked dataset (join), then the system requires me to create a new version before the change can be saved
* **AC2:** Given a new version is required, when I create it, then I must set an effective date for when the new version takes effect
* **AC3:** Given a new version is being created due to a structural change (e.g. adding a join), when I am prompted, then the system must present an explicit choice about what happens to existing processed data — tearing down all data must not be the default or only option
* **AC4:** Given a new version is created, when I view the model's version history, then the prior configuration and its effective date remain accessible

---

**US-24: Model versions have an effective date**
_As a user, I want every model version to have an effective date so that I can control when a configuration change takes effect and maintain a clear history._

* **AC1:** Given I am creating a new model version, when I confirm the version, then I am required to set an effective date before the version is saved
* **AC2:** Given a version has an effective date, when I view version history, then each version displays its effective date alongside its configuration

---

**US-25: Adding a dataset to a group does not require a new model version**
_As a user, I want to add datasets to an existing group without being forced to version the model, so that additive grouping changes don't create unnecessary version overhead._

* **AC1:** Given I have an active model with an existing group, when I add a new dataset to that group (schema match confirmed), then the change is saved without requiring a new version
* **AC2:** Given the change is saved, when I view the change log, then the addition is recorded

> **Note:** This behavior is pending Engineering confirmation — see Open Items.

---

## UX Requirements

### Key Flows

The primary design reference for this PRD is the Figma prototype:
**Source Datasets — Linking and Grouping:** [https://www.figma.com/make/shPr2fQIIEGWp7zqV8oZCp/Source-Datasets---Linking-and-Grouping](https://www.figma.com/make/shPr2fQIIEGWp7zqV8oZCp/Source-Datasets---Linking-and-Grouping)

This prototype covers:

* The Sources canvas, including primary dataset designation and drag-and-drop addition of secondary datasets
* The linking configuration flow, including ON condition suggestion and join type selection
* The group creation flow, including group naming
* Field mapping with multi-dataset column attribution

---

### UX Constraints

1. **SQL abstraction:** Join types must be presented entirely in plain, user-friendly language. No SQL terminology (LEFT JOIN, INNER JOIN, ON, etc.) is to be exposed at any point in the UI — including error messages, tooltips, and log entries.
2. **Internationalization:** All UI text, labels, and messages must follow FloQast's standard internationalization requirements. This applies to all screens introduced by this feature.
3. **Date and timezone display:** All dates and timestamps displayed to the user — including run log entries, change log entries, and version effective dates — must reflect the user's locale and timezone settings, not server time.

---

### Open UX Questions for Design (Natasha Clark)

1. **Join suggestion UI** — The current prototype does not fully resolve the UX for presenting an AI-suggested ON condition. How is the suggestion displayed? How does the user confirm, modify, or dismiss it? What does the fallback state (no suggestion available) look like? This screen needs polish before implementation.
2. **Period-unspecified dataset indicator** — When a dataset in a join has no accounting period configured (e.g. reference data or dimensional data), the system joins to its most recent available snapshot without period scoping. How is this communicated to the user in the Sources or linking UI? Should the dataset be visually distinguished (e.g. a "No period" badge)? Should there be a tooltip or inline callout explaining the behavior? The user should not be surprised that this dataset doesn't follow the same period scoping as others in the model.
3. **Multi-link canvas design** — When a model has three or more datasets, the user must configure a separate link for each pair. How is the Sources canvas designed to support this? Key questions:

    * How are configured links visually represented between dataset nodes on the canvas?
    * How does the user initiate each new link (e.g. selecting a pair from the canvas, a dedicated "Add link" action)?
    * How does the canvas communicate which dataset pairs still need a link defined vs. which are already configured?
    * What does a partially-configured model (some links done, some not) look like vs. a fully-configured one?
    * For chain topology (if supported): how is the directionality and dependency order of the join chain communicated visually?


---

## Open Questions

1. **ON condition complexity for v1** — What is the agreed scope: single-field only, AND/OR multi-clause, or nested conditions? This must be resolved before requirements can be finalized. _(Owner: Alex / Engineering)_
2. **Substring support in ON conditions** — Is substring matching required for v1 or deferred? _(Owner: Alex / Engineering)_
3. **File arrival behavior** — When only the primary dataset has arrived and secondary datasets have not, what is the expected system behavior: wait, run partial, or error? _(Owner: Engineering)_
4. **Reference data joins** — Should the system support joining to the most recent available version of a static/reference dataset when no new file has arrived? _(Owner: Engineering)_
5. **Run trigger logic** — Does a new file arriving for any dataset in a model trigger a run, or must all datasets have new data present? _(Owner: Engineering)_
6. **Grouped datasets — partial arrival** — If not all datasets within a group have arrived, does the system wait, run with what's available, or error? _(Owner: Engineering)_
7. **Versioning — grouped dataset addition** — Does adding a dataset to an existing group require a version increment? Current assumption is no, pending Engineering confirmation. _(Owner: Alex / Engineering)_
8. **~~Implicit join conditions — Accounting Period & partial entity mapping~~** — **Resolved.** Accounting period scoping is automatic at run time. Entity matching is system-enforced. Neither is part of the user-defined ON condition. See Assumptions 12–14.
9. **Join topology** — When a model includes multiple secondary datasets, two topologies are possible: (a) **Star** — all secondary datasets join directly to the primary; (b) **Chain** — a secondary dataset may join to another secondary rather than to the primary. Ideally both are supported in v1. If only one is feasible, Star is the firm requirement. _(Owner: Engineering)_

---

## Gaps

1. **Join result preview / test** — The ability to preview or test the result of a join after configuration would significantly improve confidence for users. Intentionally deferred from v1 — flagged as a high-value future addition.
2. **Additional join types** — Right join, full outer join, and cross join are not supported in v1. Deferred pending usage data and customer demand.
3. **Substring matching in ON conditions** — Not supported in v1. May be required for customers whose join keys require partial string matching. Deferred pending Engineering feasibility and customer need.
4. **Full versioning & rehydration model** — The broader behavior of how versioning, teardown, and rehydration work across all of Data Studio is not defined in this PRD. A separate definition is needed and should be cross-referenced here once available.
5. **Schema versioning for source datasets** — What happens when a source file's schema changes (new/removed columns, type changes) is not addressed here. It is unclear whether field mappings break, whether there is version history for schemas, and how users are notified. This gap needs its own PRD or sub-section.
6. **Scheduling and run trigger configuration** — How and when multi-dataset models are triggered to run (e.g. schedule-based, arrival-based) is handled in separate PRDs under IDEA-2488 and is not addressed here.

---

## References

* **Figma Prototype — Source Datasets: Linking and Grouping:** [https://www.figma.com/make/shPr2fQIIEGWp7zqV8oZCp/Source-Datasets---Linking-and-Grouping](https://www.figma.com/make/shPr2fQIIEGWp7zqV8oZCp/Source-Datasets---Linking-and-Grouping)
* **IDEA-2487 — Multi-File Handling & Global Dimensions:** [https://floqast.atlassian.net/jira/software/c/projects/IDEA/boards?issueKey=IDEA-2487](https://floqast.atlassian.net/jira/software/c/projects/IDEA/boards?issueKey=IDEA-2487)
* **Definitions & Terms — Data Studio:** [https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409/Definitions+Terms+Data+Studio](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409)
* **Rebecca Beasley-Cockroft — Dataset Lifecycle PRD:** [https://floqast.atlassian.net/wiki/spaces/Data/pages/4491247636](https://floqast.atlassian.net/wiki/spaces/Data/pages/4491247636)

---

## Definitions & Terms

See the canonical [Definitions & Terms — Data Studio](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409) page for all terminology used in this PRD.
