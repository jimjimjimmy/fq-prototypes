# Data Studio: CDC Connection Setup (DRAFT)

| | |
|---|---|
| **Target release** | TBD |
| **Epic** | (link to epic) |
| **Document status** | DRAFT |
| **Document owner** | @Alex Kearns |
| **Designer** | (assign) |
| **Tech lead** | (assign) |
| **Technical writers** | (assign) |
| **QA** | (assign) |
| **Depends on** | Sub-PRD 1: Model Creation & Source Configuration |
| **Related PRDs** | Merging Catalog & Lineage Tabs · Model Search & Filter · Sub-PRD 2: Field Mapping |

---

## Objective

CDC connections (e.g., NetSuite) are currently supported in Data Platform 1.0. Admins set up a connection by selecting a source, providing a connection name and credentials. However, the available tables for each connection are fixed — if a customer wants additional tables, engineering must manually add support. There is no self-serve path.

This PRD defines the expansion of the CDC connection experience into **Data Studio**, with two new capabilities:

1. **Self-serve table selection** — Admins can select additional tables beyond the default set without requiring an engineering ticket. The system surfaces a FQ-controlled list of supported tables for the connected source — only tables with pre-defined Source-to-Target mappings are available. Admins choose what to include from that list.
2. **Automatic model creation with Source-to-Target mappings** — Once a connection is established and tables are selected, Data Studio automatically creates FloQast standard models by applying pre-defined Source-to-Target field mapping rules that transform raw source data into the FloQast model schema. (See also: [QBO Standard Mapping (RBC)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4465296047/QBO+Standard+Mapping) — defines the equivalent auto-provisioned mappings for QBO connections.)

The result: a customer can set up a CDC connection, select their tables, and have fully mapped FloQast models ready to use — without engineering involvement.

> **Note (internal):** CDC connections are powered by Fivetran. This is an implementation detail — user-facing language refers to the data source being connected (e.g., "NetSuite"), not to Fivetran.

---

## Definitions & Terms

See [Definitions & Terms (Data Studio)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409/Definitions+Terms+Data+Studio) for the canonical glossary.

---

## Why This Is Important

Data Studio is FloQast's new self-service data integration product, designed to reduce implementation timelines and minimize the IT and professional services involvement required to get customers up and running. The goal is to put more control in the hands of admins — so customers can configure, expand, and manage their data connections without opening a support ticket or waiting on engineering.

Today, CDC connections exist but are limited. Customers who want tables beyond the standard set have no self-serve path — every additional table requires an engineering request. As demand for more advanced data connections grows (particularly from the Reporting Business Unit, which needs richer datasets to power reporting workflows), this bottleneck becomes a meaningful barrier to adoption and time-to-value.

This PRD addresses that gap by bringing CDC connection setup into Data Studio with self-serve table selection. It also establishes the repeatable foundation that makes self-serve scalable: rather than building a custom data setup for each customer, FloQast leverages Fivetran's logical data models and out-of-the-box source support to define standardized Source-to-Target mappings once — mappings that apply consistently across all customers using the same source. The result is a setup experience that is both customer-controlled and FloQast-governed.

---

## Key Benefits

| Benefit | Who It Helps |
|---|---|
| Admins can add additional data tables without engineering involvement | FloQast Admin, IT Manager |
| Reduced implementation timelines for advanced data connections | Customer, Professional Services |
| Standardized Source-to-Target mappings apply consistently across all customers | Engineering, Professional Services |
| FloQast models are created automatically after connection setup — no manual model creation required | FloQast Admin |
| Reporting BU can access richer datasets without waiting on support requests | Reporting Business Unit |

---

## Use Cases

| ID | Use Case | Actor |
|---|---|---|
| UC-1 | Admin sets up a new CDC connection from the Connectors tab, selecting tables from the FQ-supported list. **Note:** The current assumption is that only a FQ-curated subset of Fivetran tables are shown — not the full Fivetran catalog. Only tables with pre-defined Source-to-Target mappings are available. See OQ-10. | FloQast Admin |
| UC-2 | Admin monitors initial sync progress before CDC streaming begins. **Note:** See CDC-6 for detail. Progress is shown on the Connectors tab — exact UX (progress bar, per-table list, percentage) needs design input (see Key UX Questions). (Raised by RBC) | FloQast Admin |
| UC-3 | System automatically creates draft models with Source-to-Target mappings applied; models appear in Catalog with "Draft" status | System |
| UC-4 | Admin reviews draft models, enriches them (custom fields, adjusted mappings), and publishes them to go live | FloQast Admin |
| UC-5 | Admin adds additional tables to an existing connection; new draft models are auto-created and follow the same review/publish flow | FloQast Admin |
| UC-6 | Admin creates a custom model manually, defining it using any available connected tables (new or existing) | FloQast Admin |
| UC-7 | Admin troubleshoots a stalled or broken CDC connection | FloQast Admin |

---

## Assumptions — Established

- CDC connection setup is initiated from the **Connectors tab**, not from within a model.
- The list of available tables is FQ-controlled — only tables with pre-defined Source-to-Target mappings are surfaced to admins. Admins cannot add arbitrary tables from the raw source schema.
- A subset of available tables are pre-selected by default (the standard set for that source) and cannot be deselected. Admins can add additional supported tables during setup or later.
- Models are automatically created from selected tables after the initial sync completes — the admin does not need to manually create models.
- The initial sync (full historical load) must complete before CDC incremental streaming begins.
- CDC-sourced models are visible in the Catalog alongside batch-sourced models.
- Authentication to the source system (e.g., NetSuite credentials) is the admin's responsibility. Data Studio provides guidance but does not automate credential setup.
- Connections cannot be changed to a different type after setup. If a different connection type is needed, the admin must create a new connection.
- Draft model review is required before a model can be published and go live. Models cannot be activated directly from the auto-created draft state.
- Draft model enrichment (adding custom fields, adjusting mappings) is optional — admins may publish a model with only the auto-applied Source-to-Target mappings if no further customization is needed.
- User-facing language does not reference the underlying integration platform (e.g., "Fivetran") — it refers to the data source being connected.

---

## Open Items to Confirm

| ID | Assumption | Story | Owner | Status |
|---|---|---|---|---|
| A1 | CDC connector type is selectable from the same "Add Connector" flow as batch connectors, with CDC surfaced as a distinct option | CDC-1 | PM + Engineering | Pending |
| A2 | Data Studio surfaces the initial sync progress as a percentage or record count, not just a spinner. **RBC flag:** We may not have the ability to do this — Fivetran may not expose total row counts during initial load, so we don't know what "complete" looks like until it's done. Needs engineering confirmation. | CDC-3 | PM + Engineering | Pending |
| A3 | CDC-sourced models are visually distinguished from batch models in the Catalog AG Grid (e.g., a "CDC" badge or sync type column). **RBC flag:** Showing both Draft and Active/Published states per model could get messy at high volumes. See OQ-12. | CDC-4 | PM + UX | Pending |
| A4 | Failed CDC connections surface an actionable error code, not a generic failure state | CDC-5 | Engineering | Pending |
| A5 | Admins can pause a CDC connector without deleting it | CDC-2 | Engineering | Pending |
| A6 | Adding a new table to an existing Fivetran connection triggers a data load for that table only — without re-syncing existing tables. Needs engineering confirmation on whether Fivetran supports per-table incremental activation. (Raised by RBC on CDC-8) | CDC-8 | Engineering | Pending |

---

## Scope

### In Scope
- CDC connection setup in Data Studio (Connectors tab)
- FQ-controlled table selection (default tables pre-selected + admin can add additional supported tables)
- Initial sync progress visibility
- Auto-creation of draft models with Source-to-Target mappings applied
- Draft model review, enrichment, and publish flow
- Adding additional tables to an existing connection post-setup
- Browsable table library with metadata (name, description, columns, activation status) per connection
- Active table summary in connection detail view
- Connection status and error states on the Connectors tab

### Out of Scope
- Defining the actual Source-to-Target field mappings for each source/provider (this PRD assumes mappings exist as a dependency; authoring them is a separate workstream)
- Retroactive updates to existing customer models when FQ updates a standard prebuilt mapping (e.g., a customer set up in February will not automatically receive new field mappings added two years later)
- How FQ manages and names prebuilt connector options in the product (e.g., "NetSuite Advanced" vs. a generic CDC option — the taxonomy and administration of connector types is out of scope)
- User-defined custom model creation from connected tables (deferred — see CDC-9)
- Batch connector setup

---

## Requirements

### Story: CDC-1 — Select a Source to Connect

**User Story:** As a FloQast Admin, I want to select a data source to connect so that I can get started without needing to understand the underlying connection technology.

**Importance:** High

**Details:** From the Connectors tab, the admin initiates a new connection by selecting from a list of FQ-supported sources (e.g., NetSuite, Salesforce). The system handles the connection type (CDC, batch, etc.) automatically based on the source selected — the admin is never asked to choose a connection type explicitly.

> **Cross-ref:** The source selection flow is also covered in [QBO Connection (RBC)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4442718323/QBO+Connection). This story is retained here to ensure CDC sources are included in the shared flow.

**Acceptance Criteria:**
- AC-CDC-1-01 — Admin can initiate a new connection from the Connectors tab: Given I am on the Connectors tab, Then I see an option to add a new connection
- AC-CDC-1-02 — Supported sources are presented as a selectable list: Given I am adding a new connection, Then I see a list of FQ-supported sources to choose from
- AC-CDC-1-03 — Selecting a source routes to the correct setup flow: Given I select a source, Then I am taken into the setup flow for that source without being asked to choose a connection type

---

### Story: CDC-2 — Configure Source Credentials

**User Story:** As a FloQast Admin, I want to enter my source system credentials so that Data Studio can establish a connection to my data source.

**Importance:** High

**Details:** After selecting a source, the admin is presented with the credential fields specific to that source (e.g., NetSuite requires a connection name, account ID, and API token; other sources will have different requirements). Inline instructions explain where to find or generate each required credential. A "Test Connection" action validates credentials before proceeding.

> **Cross-ref:** Credential configuration is partially covered in [QBO Connection (RBC)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4442718323/QBO+Connection) for QBO-specific fields. This story expands scope beyond QBO to cover source-specific credential flows for all CDC sources (e.g., NetSuite, Sage Intacct).

**Acceptance Criteria:**
- AC-CDC-2-01 — Credential fields are source-specific: Given I have selected a source, Then I see only the credential fields relevant to that source
- AC-CDC-2-02 — Inline instructions are shown for each credential field: Given I am on the credentials step, Then each field includes guidance on where to find or generate the required value
- AC-CDC-2-03 — Test Connection validates credentials before proceeding: Given I click "Test Connection", Then Data Studio confirms the credentials are valid before allowing me to proceed
- AC-CDC-2-04 — Test Connection failure shows an actionable error: Given credentials are invalid, Then I see a specific error message indicating what failed

---

### Story: CDC-3 — Auto-Recommend Tables and Allow Optional Selection

**User Story:** As a FloQast Admin, I want the system to automatically identify and pre-select the recommended tables so that I don't need to know which tables are required — I can just focus on identifying any extra tables I think will add value.

**Importance:** High

**Details:** After credentials are validated, the admin is shown the FQ-controlled list of supported tables for their source (e.g., all NetSuite tables for which Source-to-Target mappings exist). The standard/default tables are pre-selected. The admin can deselect defaults or add additional supported tables. They cannot add tables outside the FQ-supported list. At least one table must be selected to proceed.

**Acceptance Criteria:**
- AC-CDC-3-01 — Only FQ-supported tables are shown: Given my credentials are valid, Then I see only the tables for which FloQast has pre-defined Source-to-Target mappings — not the full raw source schema
- AC-CDC-3-02 — Default tables are pre-selected: Given I am on the table selection step, Then the standard tables for this source are pre-selected by default
- AC-CDC-3-03 — Default tables are visually distinguished: Given I am on the table selection step, Then default/standard tables are visually indicated so the admin understands which are recommended
- ~~AC-CDC-3-04~~ — **Removed.** Standard/default tables cannot be deselected. These are required for FloQast standard models to function correctly. (Per RBC + AK alignment.)
- AC-CDC-3-05 — Admin can add additional supported tables: Given I want to include non-default tables, Then I can select additional tables from the FQ-supported list
- AC-CDC-3-06 — At least one table must be selected to proceed: Given I have selected zero tables, Then I cannot proceed and see a validation message
- AC-CDC-3-07 — Table selection is editable after setup: Given the CDC connection is configured, When I navigate to its settings on the Connectors tab, Then I can add or remove tables (within the FQ-supported list)

---

### Story: CDC-4 — Auto-Create Draft Models from Connected Tables

**User Story:** As a FloQast Admin, I want models to be automatically created in Draft status from my connected tables so that I have a ready-to-review starting point without having to build models from scratch.

**Importance:** High

**Details:** Once the initial sync completes, the system automatically creates a draft model for each selected table with Source-to-Target mappings pre-applied. Draft models appear in Catalog with a "Draft" status. The admin must review the draft before publishing — enrichment (adding custom fields, adjusting mappings) is optional. Models cannot go live until the admin has reviewed and published them. The admin is notified when draft models are ready for review.

> **Open:** If admins aren't enriching, is the Draft step necessary or should models go straight to Published? See OQ-11. (Raised by RBC)

**Acceptance Criteria:**
- AC-CDC-4-01 — Draft models are auto-created after initial sync: Given the initial sync for a CDC connection has completed, Then a draft model is automatically created for each selected table, without admin action
- AC-CDC-4-02 — Source-to-Target mappings are pre-applied: Given a draft model is auto-created, Then the Source-to-Target field mappings for that source are already applied
- AC-CDC-4-03 — Draft models appear in Catalog with "Draft" status: Given models have been auto-created, Then they appear in the Catalog AG Grid table with a "Draft" status indicator
- AC-CDC-4-04 — Auto-created models have a meaningful default name: Given a model is auto-created, Then it has a default name (not blank). For 1:1 table-to-model mappings, the default name matches the source table name. For multi-table models, a naming convention is needed. (RBC flagged: clarify whether models are always 1:1 with tables — see OQ-13)
- AC-CDC-4-05 — Admin can rename draft models: Given a model is in Draft status, Then the admin can rename it
- AC-CDC-4-06 — Review is required before publishing: Given a model is in Draft status, Then the admin must open and review it before they can publish it — the model cannot go live without this step
- AC-CDC-4-07 — Enrichment is optional: Given a model is in Draft status, Then the admin may optionally add custom fields or adjust mappings before publishing, but is not required to do so
- AC-CDC-4-08 — Admin is notified when draft models are ready: Given auto-creation is complete, Then the admin receives an in-app notification that their draft models are ready for review in Catalog

---

### Story: CDC-5 — Review, Enrich, and Publish Draft Models

**User Story:** As a FloQast Admin, I want to review my auto-created draft models and publish them when I'm ready so that I control when a model goes live.

**Importance:** High

**Details:** Draft models appear in Catalog with a "Draft" status. To publish, the admin opens the model and clicks "Publish" — this constitutes the required review step. Before publishing, the admin may optionally enrich the model by adding custom fields or adjusting mappings. Once published, the model status changes to "Active" and is available for use across FloQast.

> **Related PRDs:** Full publish behavior is defined in [Testing & Publishing (3 of 4)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449468593/Lineage+Creation+3+of+4+Testing+Publishing+DRAFT). Catalog view behavior is defined in [Catalog — Search and Filter](https://floqast.atlassian.net/wiki/spaces/Data/pages/4476731473/Catalog+-+Search+and+Filter+DRAFT).

**Acceptance Criteria:**
- AC-CDC-5-01 — Draft models are visible in Catalog with "Draft" status: Given draft models have been auto-created, Then they appear in the Catalog AG Grid with a "Draft" status indicator
- AC-CDC-5-02 — Opening a draft model and clicking "Publish" completes the review step: Given I open a draft model, Then I see a "Publish" action, and clicking it satisfies the required review step and publishes the model
- AC-CDC-5-03 — Model status changes to "Active" upon publishing: Given I publish a draft model, Then its status updates to "Active" in Catalog
- AC-CDC-5-04 — Admin can optionally enrich before publishing: Given I have a draft model open, Then I can optionally add custom fields or adjust mappings before clicking "Publish"
- AC-CDC-5-05 — Draft models cannot go live without being opened and published: Given a model is in "Draft" status, Then it is not available for use in FloQast until the admin has opened it and clicked "Publish"

---

### Story: CDC-6 — Monitor Initial Data Load Progress

**User Story:** As a FloQast Admin, I want to see the progress of the initial data load so that I know when my data will be ready and can set expectations with my team.

**Importance:** High

**Details:** After configuration, a one-time full historical data load runs before incremental streaming begins. Data Studio surfaces this as an "Initial Data Load" state on the Connectors tab, with progress shown as a record count or percentage per table. Once the initial data load completes, the connection transitions to "Active" and draft models are auto-created. Connection status is displayed on the Connectors tab only — Catalog shows model status (Draft, Active, etc.), not connection status.

> **RBC flag:** Per-table progress may not be technically feasible (see A2). Also unclear where per-table detail would live — inline on the Connectors tab row, in a connection detail view, or elsewhere. Needs engineering confirmation on data availability and UX input on placement.

**Acceptance Criteria:**
- AC-CDC-6-01 — Connector shows "Initial Data Load" status during historical load: Given the CDC connection has been configured and the initial data load is running, Then the Connectors tab shows the connection status as "Initial Data Load" (not "Active")
- AC-CDC-6-02 — Progress is shown per table: Given the initial data load is running, Then I can see sync progress (records synced or percentage) for each tracked table
- AC-CDC-6-03 — Status transitions to "Active" when initial data load completes: Given the initial data load has finished, Then the connection status updates to "Active"
- AC-CDC-6-04 — Draft models are auto-created once initial data load completes: Given the connection status transitions to "Active", Then draft models are automatically created in Catalog

---

### Story: CDC-7 — Connection Status and Error States on Connectors Tab

**User Story:** As a FloQast Admin, I want to understand the health of my connections at a glance so that I can quickly identify and resolve issues.

**Importance:** High

**Details:** Each connection on the Connectors tab displays the source name (e.g., "NetSuite"), current status, last synced timestamp, and any active errors. Actionable error messages are shown for known failure states so admins know what went wrong and what to do next.

**Acceptance Criteria:**
- AC-CDC-7-01 — Connections are identified by source name: Given I view the Connectors tab, Then each connection displays its source name (e.g., "NetSuite") rather than a technical connection type label
- AC-CDC-7-02 — Last synced timestamp is shown: Given a connection is active, Then I see when data was last successfully synced
- AC-CDC-7-03 — Authentication failure is surfaced with a recommended action: Given a connection's credentials have expired or been revoked, Then I see an error indicating authentication has failed with guidance on how to re-authenticate
- AC-CDC-7-04 — Source system unavailable error is surfaced: Given the source system cannot be reached, Then I see an error indicating the source is unavailable
- AC-CDC-7-05 — Sync delayed warning is surfaced: Given data has not refreshed within an expected threshold, Then I see a warning that the sync is delayed
- AC-CDC-7-06 — Table no longer available error is surfaced: Given a previously connected table is no longer available in the source, Then I see an error identifying which table is affected
- AC-CDC-7-07 — All error messages include a recommended action: Given any error state, Then the error message includes a specific recommended action (not a generic "sync failed" message)

---

### Story: CDC-8 — Add Additional Tables to an Existing Connection

**User Story:** As a FloQast Admin, I want to add more tables to an existing connection after initial setup so that I can expand my data without reconfiguring the whole connection.

**Importance:** High

**Details:** From the Connectors tab, the admin can navigate to an existing connection's settings and add additional tables from the FQ-supported list. Adding a new table triggers a data load for that table only. Once complete, a new draft model is auto-created for the added table and follows the same review and publish flow as the initial setup.

> **RBC flag:** The UX for how an admin accesses table management on an existing connection is undefined. Does it live in a connection detail view, a settings panel, or the table library (CDC-10)? Needs design input.

**Acceptance Criteria:**
- AC-CDC-8-01 — Admin can access table selection from an existing connection's settings: Given I navigate to an existing connection on the Connectors tab, Then I can view and edit the list of connected tables
- AC-CDC-8-02 — Only FQ-supported tables are shown: Given I am adding tables to an existing connection, Then I only see tables from the FQ-supported list that are not already connected
- AC-CDC-8-03 — Adding a table triggers a data load for that table only: Given I add a new table to an existing connection, Then a data load runs for that table only — existing connected tables are not affected
- AC-CDC-8-04 — A new draft model is auto-created after the data load completes: Given the data load for a newly added table completes, Then a draft model is automatically created for that table in Catalog
- AC-CDC-8-05 — Admin is notified when the new draft model is ready: Given the draft model for a newly added table has been created, Then the admin receives an in-app notification
- AC-CDC-8-06 — New draft model follows the same review and publish flow: Given a draft model has been created for a newly added table, Then the admin must open and publish it before it goes live

---

### Story: CDC-9 — Create a Custom User-Defined Model from Connected Tables (DEFERRED)

**User Story:** As a FloQast Admin, I want to create my own model using connected tables so that I can build models tailored to my specific needs beyond the auto-created defaults.

**Importance:** ~~High~~ Future — out of scope for initial release per RBC + AK alignment. Retain for future iteration.

**Details:** From Catalog, the admin can initiate a new model and select one or more connected tables as its source. The full model creation flow is defined in [Model Creation & Source Configuration (1 of 4)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4450189505/Lineage+Creation+1+of+4+Model+Creation+Source+Configuration+DRAFT). This story captures the specific requirement that connected CDC tables are available as source options within that flow.

**Acceptance Criteria:**
- AC-CDC-9-01 — Admin can initiate a new model from Catalog: Given I am on the Catalog landing, Then I see an option to create a new model
- AC-CDC-9-02 — Connected CDC tables are available as source options: Given I am creating a new model, Then I can select one or more tables from my existing CDC connections as the model source
- AC-CDC-9-03 — Custom models follow the same draft and publish flow: Given I create a custom model, Then it is created in "Draft" status and must be reviewed and published before going live

---

### Story: CDC-10 — Browse Available Fivetran Tables for a Connection

**User Story:** As a power user, I want to see which Fivetran tables are available for a given connection so I can activate what I need.

**Importance:** High

**Details:** Data Studio must provide a browsable library of available tables replicated by the Fivetran connector for a given connection. This library is accessible from the connection detail view and shows all tables that Fivetran supports for the connected source — both active and inactive. The library supports search and filtering to help admins find specific tables quickly at scale.

**Acceptance Criteria:**
- AC-CDC-10-01 — A browsable table library is accessible from the connection detail view: Given I navigate to an existing connection, Then I can access a library showing all available Fivetran tables for that connection
- AC-CDC-10-02 — The library includes both active and inactive tables: Given I am viewing the table library, Then I see all tables Fivetran supports for this source, regardless of activation status
- AC-CDC-10-03 — Admins can activate tables directly from the library: Given I find an inactive table in the library, Then I can activate it from that view without navigating elsewhere
- AC-CDC-10-04 — The library supports search: Given I am viewing the table library, Then I can search by table name to find specific tables

---

### Story: CDC-11 — View Table Details Before Activation

**User Story:** As a power user, I want to understand what each Fivetran table contains before activating it.

**Importance:** High

**Details:** Each table in the Fivetran library must display: table name, description, column list, and current activation status for this connection. This information allows admins to make informed decisions about which tables to activate without requiring external documentation or engineering support.

**Acceptance Criteria:**
- AC-CDC-11-01 — Table name is displayed: Given I am viewing a table in the library, Then I see the table name
- AC-CDC-11-02 — Table description is displayed: Given I am viewing a table in the library, Then I see a description explaining what data the table contains
- AC-CDC-11-03 — Column list is displayed: Given I am viewing a table in the library, Then I see the list of columns available in that table
- AC-CDC-11-04 — Activation status is displayed: Given I am viewing a table in the library, Then I see whether the table is currently active or inactive for this connection

---

### Story: CDC-12 — View Active Tables for a Connection

**User Story:** As an admin, I want to see which Fivetran tables are active for a connection at a glance.

**Importance:** High

**Details:** Users must be able to view a list of tables currently configured and active for a given Fivetran connection directly from the connection detail view. This provides a quick summary of what data is flowing through the connection without requiring the admin to open the full table library.

**Acceptance Criteria:**
- AC-CDC-12-01 — Active tables are listed in the connection detail view: Given I navigate to a connection's detail view, Then I see a list of all currently active tables for that connection
- AC-CDC-12-02 — Active table count is visible: Given I am viewing the connection detail, Then I see the total count of active tables
- AC-CDC-12-03 — Active tables link to the full table library: Given I see the active tables list, Then I can navigate to the full table library for more detail or to activate additional tables

---

## UX Requirements

### Connection Setup Wizard

The CDC connection setup follows a consistent 4-step wizard pattern, aligned with the QBO connection flow:

```
Connectors tab → "Create Connector" → Select Source
  → Step 1: Name
  → Step 2: Credentials
  → Step 3: Provision (table selection)
  → Step 4: Validate
```

> **Note:** Steps 1–2 (Name, Credentials) are covered in [QBO Connection (RBC)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4442718323/QBO+Connection) and follow the same shared pattern. This section focuses on Steps 3–4: how tables are viewable, selectable, and validated. (Per RBC feedback.)

#### Step 3: Provision (Table Selection)
- System automatically provisions standard tables for the selected source
- Standard tables are displayed as pre-selected
- Admin can add additional tables from the FQ-supported list
- Tables not in the FQ-supported list are not shown
- Admin must select at least one table to proceed

#### Step 4: Validate
- System tests the connection using the provided credentials
- Shows per-table validation status
- On success: connection is saved, initial data load begins, status shows "Initial Data Load" on Connectors tab
- On failure: actionable error message shown with recommended next step

---

### Post-Setup: Connectors Tab State

After setup, the connection appears on the Connectors tab with:
- **Source name** (e.g., "NetSuite") as the identifier
- **Status:** Initial Data Load → Active (once load completes)
- **Last Synced** timestamp
- **Files** count
- Error/warning indicators when applicable

---

### Post-Setup: Catalog State

Once the initial data load completes:
- Draft models appear in Catalog AG Grid with **"Draft"** status badge
- Admin receives in-app notification that models are ready for review
- Admin opens a draft model → reviews → optionally enriches → clicks **"Publish"**
- Model status changes to **"Active"**

---

### Wireframes

#### Screens 1–3: Source Selection, Name, Credentials

> See [QBO Connection (RBC)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4442718323/QBO+Connection) for the shared source selection, naming, and credential entry patterns. CDC sources follow the same flow.

#### Screen 4: Step 3 — Provision (Table Selection)
```
┌─────────────────────────────────────────┐
│ [logo] NetSuite                      ✕  │
│ ○──────○──────●──────○                  │
│ Name  Creds  Prov  Valid                │
│                                         │
│ Standard Tables                         │
│ Pre-selected for FloQast standard       │
│ models. Can be removed.                 │
│                                         │
│ ☑ Transactions                          │
│ ☑ Accounts                              │
│ ☑ GL Lines                              │
│                                         │
│ ── Additional Tables ───────────────────│
│ Optional. Add tables to power           │
│ custom models.                          │
│                                         │
│ ☐ Vendors                               │
│ ☐ Customers                             │
│ ☐ Subsidiaries                          │
│ ☐ Departments                           │
│                                         │
│           [← Back]       [Next →]       │
└─────────────────────────────────────────┘
```

Standard tables are locked and cannot be deselected — they are required for FloQast standard models.

#### Screen 5: Step 4 — Validate (auto-runs on load)
```
┌─────────────────────────────────────────┐
│ [logo] NetSuite                      ✕  │
│ ○──────○──────○──────●                  │
│ Name  Creds  Prov  Valid                │
│                                         │
│ Validating your connection...           │
│ This may take a moment.                 │
│                                         │
│ ✓ Connection authenticated              │
│ ✓ Transactions — accessible            │
│ ✓ Accounts — accessible                │
│ ⟳ GL Lines — checking...               │
│                                         │
│        [← Back]   [Save & Connect]      │
│              (disabled until complete)  │
└─────────────────────────────────────────┘
```

On success:
```
│ ✓ Connection authenticated              │
│ ✓ Transactions — accessible            │
│ ✓ Accounts — accessible                │
│ ✓ GL Lines — accessible                │
│                                         │
│ Your connection is ready.               │
│                                         │
│        [← Back]   [Save & Connect]      │
```

On failure:
```
│ ✓ Connection authenticated              │
│ ✕ Transactions — not found             │
│   Check that your Account ID has       │
│   access to transaction data.          │
│                                         │
│        [← Back]   [Save & Connect]      │
│                       (remains disabled)│
```

---

### Key UX Questions for Designer

- How is the source list presented — scrollable list, card grid, or categorized menu?
- How are standard tables visually distinguished from optional tables in the Provision step?
- How is Initial Data Load progress displayed on the Connectors tab — progress bar, per-table list, or percentage?
- What does the "Draft" badge look like in the Catalog AG Grid — color, label, icon?
- Where does the "Publish" action live in the model detail view — primary CTA button, action menu, or inline in the header?

---

## Open Questions

| ID | Question | Owner | Status |
|---|---|---|---|
| OQ-1 | What is the threshold for sync delay before a warning is triggered on the Connectors tab? | PM + Engineering | Open |
| OQ-6 | When FQ updates a standard prebuilt mapping (e.g., adds a new field), how do existing customers gain access to that update? Is there a manual migration path, an opt-in notification, or is it left to the customer to re-configure? | PM + Engineering | Open |
| OQ-8 | If a source system's schema changes (e.g., a field is renamed or removed), how is this handled? Does Fivetran absorb the change automatically, or does it surface as an error in Data Studio? And if a field in an existing model's Source-to-Target mapping no longer exists in the source, what happens to that model? | PM + Engineering | Open |
| OQ-14 | When a new table is added to an existing connection (CDC-8), should it always auto-create a new draft model? The added table might belong in an existing model rather than spawning a new one. Ties to OQ-13 (table-to-model cardinality). (Raised by RBC) | PM + Engineering | Open |
| OQ-13 | Is the relationship between tables and auto-created models always 1:1, or can multiple tables map to a single model? If multi-table models are supported, what is the default naming convention? (Raised by RBC + AK) | PM + Engineering | Open |
| OQ-12 | How should the Catalog handle models that have both an Active published version and a Draft in progress? At high volumes, showing both states per model could make the Catalog noisy. Need a UX pattern that makes it clear both exist without cluttering the table — e.g., a secondary indicator on the Active row, a collapsible sub-row, or filtering by version state. (Raised by RBC + AK) | PM + UX | Open |
| OQ-11 | Should there be an auto-publish option that takes auto-created models straight to "Active" without requiring manual review? The current PRD requires admins to open and publish each draft model (CDC-4, CDC-5), but admins who don't need to customize may want a hands-off path all the way through to publish. This would change the review-before-publish requirement. (Raised by RBC) | PM + Engineering | Open |
| OQ-10 | Should the table selection list be limited to a FQ-curated subset (only tables with pre-defined Source-to-Target mappings), or should admins have visibility into the full Fivetran catalog? The current assumption is FQ-curated only — but this limits flexibility for power users who may want tables FQ hasn't mapped yet. (Raised by RBC) | PM + Engineering | Open |
| OQ-9 | Should advanced table selection / configuration be gated as a premium feature? Need to consider access control for who can perform self-serve table selection vs. standard-only setup. (Raised by RBC) | PM + Product Strategy | Open |
| OQ-7 | For CAS customers (Client Accounting Services firms managing 30+ client entities, each with their own connection), what should the default model naming convention be? A CAS admin will have a high volume of auto-created draft models across entities — the naming convention needs to make Catalog navigable at scale. Proposed: `[Connection Name] — [FQ Model Name]`, assuming admins name connections after their client entities. **RBC flag:** Do we need to dictate this, or can it just be whatever the customer wants to call it? May not need a prescribed convention if admins can rename freely. | PM + UX | Open |

---

## Gaps

| ID | Gap | Severity | Owner |
|---|---|---|---|
| G4 | No mechanism exists for linking tables together via primary and foreign keys. When multiple tables are selected for a connection, admins will need a way to define relationships between them (e.g., designating primary keys and foreign keys). This is a prerequisite for multi-table models and joins. May require its own story or PRD. (Raised by RBC on CDC-4) | High | PM + Engineering |
| G1 | The FQ-supported table list per source is not defined. The self-serve table selection experience depends on pre-defined Source-to-Target mappings existing for each table offered to admins. This list needs to be owned, defined, and maintained. **RBC note:** There is already a standard set of tables configured today in Fivetran for NetSuite, Intacct, and Workday — start there as a baseline. | High | PM + Engineering to align on ownership and initial table list per supported source before this PRD is finalized |
| G2 | Notification delivery (in-app vs. email vs. Slack) for initial data load completion is not defined. | Medium | PM + Engineering |
| G3 | It's unclear whether connections support pause/resume behavior. If an admin needs to temporarily stop a connection, the expected behavior in Data Studio is undefined. | Medium | Engineering to confirm |

---

## References

- [Definitions & Terms (Data Studio)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409/Definitions+Terms+Data+Studio)
- [Merging Catalog & Lineage Tabs (DRAFT)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4470800387/Merging+Catalog+Lineage+Tabs+DRAFT)
- [Catalog — Search and Filter (DRAFT)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4476731473/Catalog+-+Search+and+Filter+DRAFT)
- [Model Creation & Source Configuration — Sub-PRD 1 of 4 (DRAFT)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4450189505/Lineage+Creation+1+of+4+Model+Creation+Source+Configuration+DRAFT)
- [Testing & Publishing — Sub-PRD 3 of 4 (DRAFT)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449468593/Lineage+Creation+3+of+4+Testing+Publishing+DRAFT)
- [QBO Endpoint Handling (DRAFT)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4447568254/QBO+Endpoint+Handling+DRAFT) — reference for connection setup wizard pattern
