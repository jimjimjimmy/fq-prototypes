# PRD: Adding CDC Tables for Existing Sources

| Field | Value |
|---|---|
| **Owner** | Alex Kearns |
| **Status** | Draft |
| **Epic / Jira** | TBD |
| **Last Updated** | 2026-06-16 |
| **Target Release** | 2026-09-30 |
| **Dependencies** | CDC Connectors, Custom Data Models |
| **Confluence** | [Extend Tables in CDC Connectors Q3 2026](https://floqast.atlassian.net/wiki/spaces/Data/pages/4642865771/Extend+Tables+in+CDC+Connectors+Q3+2026) |

---

## Objective

Today, when FloQast Transform needs data from tables in a CDC (Fivetran) source that exist in the source system but fall outside the standard set of tables FloQast uses to build its canonical models, there is no self-serve path. Engineering must manually add the required tables through the Fivetran interface — a process that is slow, requires engineering involvement for what should be an admin-level configuration, and has no home in Data Studio once Transform is integrated with Data Platform.

This PRD defines the ability for Data Studio admins to add extra tables from an existing CDC (Fivetran) source connection directly within the connector setup flow. Tables added this way are brought in as Custom Data Models — a pass-through copy of the raw table — making them available for Transform and other downstream consumers without requiring engineering intervention.

When this ships, a Data Studio admin can expand what data a CDC (Fivetran) connector surfaces beyond FloQast's standard table set, using the same connector setup flow they already know.

---

## Definitions & Terms

See the canonical [Definitions & Terms](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409) page.

---

## Why This Is Important

FloQast's CDC (Fivetran) connectors are built around a standard set of tables that power the canonical data models — Accounts, Balances, Transactions, and others. But source systems contain far more data than what FloQast maps to those models. For customers using Transform, that additional data isn't just nice-to-have — it's required for the allocation logic, cross-dataset joins, and financial computations Transform performs.

Today, accessing that data requires an engineering request to manually add tables through the Fivetran interface. There is no admin-facing path, no audit trail, and no connection to the Data Studio workflow. As FloQast sunsets the legacy stack and brings Transform fully onto Data Platform, this manual process becomes a hard blocker — Transform customers will need tables that aren't in FloQast's standard set, and there will be no mechanism for admins to add them.

This PRD closes that gap by making table selection a first-class step in the connector setup flow, giving admins direct control over what data a CDC (Fivetran) connection surfaces — without engineering involvement.

---

## Key Benefits

| Beneficiary | Benefit |
|---|---|
| **Data Studio admins** | Self-serve control over which tables a CDC (Fivetran) connector surfaces — no engineering ticket required |
| **Transform customers** | Additional tables required for allocation logic and cross-dataset computations are available through a standard Data Studio workflow |
| **AI Variance** | Source tables outside FloQast's standard set — such as billing data — can be surfaced without a net-new canonical model |
| **Engineering** | Eliminates manual table additions through the Fivetran interface |

---

## Use Cases

1. **Transform adds a required table** — A Transform customer needs data from a table that exists in their CDC (Fivetran) source but isn't part of FloQast's standard table set. The Data Studio admin navigates to the connector setup flow, selects the additional table, and a Custom Data Model is automatically created using the naming convention `<connector name> <table name>`. The admin receives an email notification with a link to the new model once data sync completes.

2. **AI Variance adds a billing table** — An admin needs to surface billing data from an existing CDC (Fivetran) source for AI Variance analysis. They add the table through the connector setup flow, a Custom Data Model is auto-created, and the data becomes available downstream once published.

---

## Assumptions — Established

1. Adding an extra CDC (Fivetran) table creates two things: a source dataset (named after the table name as it exists in Fivetran) and a Custom Data Model (named `<connector name> <table name>`).
2. The source dataset is available in the Source Datasets subtab when configuring any model — this is standard platform behavior.
3. The auto-created Custom Data Model uses pass-through field mapping — source schema columns are listed in the order they appear in the source table.
4. The table selection step lives within the existing connector setup flow — no new top-level surface required.
5. Only tables that exist in the connected CDC (Fivetran) source are available for selection.
6. This capability is available for both new connector creation and existing connectors.
7. Adding extra tables increases CDC (Fivetran) processing costs — cost impact is not surfaced in this PRD (relates to CDC Cost Tracking PRD).

---

## Open Items to Confirm

| # | Item | Owner | Status |
|---|---|---|---|
| OI-1 | Should admins be able to join multiple extra tables together within a single model, rather than each table becoming its own standalone Custom Data Model? | Data Studio PM / Engineering | Open |
| OI-2 | Adding extra tables increases CDC (Fivetran) processing costs. Should there be guardrails, visibility into cost impact, or approval gates before a table is added? Relates to the CDC Cost Tracking PRD. | Data Studio PM / Engineering | Open |

---

## Scope

**In Scope**

- Ability for Data Studio admins to add extra tables from a CDC (Fivetran) source during connector creation
- Ability for Data Studio admins to add extra tables to an existing CDC (Fivetran) connector
- Auto-creation of a source dataset and a Custom Data Model for each added table
- Custom Data Model named `<connector name> <table name>`; source dataset named after the Fivetran table name
- Pass-through field mapping for auto-created Custom Data Models
- Archive and delete flows for extra tables, with warnings and cascade behavior to linked models
- Email notification with model name and link when sync completes

**Out of Scope**

- Joining multiple extra tables into a single model (open question — potential future capability)
- Adding tables from sources that are not CDC (Fivetran) connections
- Creating net-new CDC (Fivetran) connections (covered by existing connector setup)
- Cost visibility or guardrails at time of table addition (relates to CDC Cost Tracking PRD — separate effort)

---

## Requirements

### Story 1: Adding extra tables during connector creation

**As a** Data Studio admin, **I want to** select additional tables from a CDC (Fivetran) source during connector setup **so that** data outside FloQast's standard table set is available for downstream use from the moment the connector is configured.

**Acceptance Criteria:**
- AC1: During the connector setup flow, the admin is presented with FloQast's standard tables for that source — these are pre-selected and cannot be deselected
- AC2: The admin is also shown a list of additional available tables from the source that are not part of FloQast's standard set, and can select one or more to add
- AC3: Selected extra tables are clearly distinguished from standard tables in the setup flow
- AC4: The admin can proceed through connector setup without selecting any extra tables — this step is optional
- AC5: Each selected extra table results in an auto-created source dataset and Custom Data Model upon connector creation (covered in Story 3)

---

### Story 2: Adding extra tables to an existing connector

**As a** Data Studio admin, **I want to** add extra tables to a CDC (Fivetran) connector that has already been set up **so that** I can bring in additional data from a source without having to reconfigure the entire connection.

**Acceptance Criteria:**
- AC1: From an existing CDC (Fivetran) connector, the admin can access a table management view that shows both the standard tables already configured and any extra tables previously added
- AC2: The admin can select additional tables from the list of available tables in the source that have not yet been added
- AC3: Standard FloQast tables cannot be removed from the connector
- AC4: Previously added extra tables are visible and can be removed by the admin
- AC5: Adding a new extra table to an existing connector triggers auto-creation of a new source dataset and Custom Data Model (covered in Story 3)
- AC6: When an admin attempts to **delete** an extra table from the connector, they are shown a warning and prompted to consider archiving instead
- AC7: When an admin **archives** an extra table, they are warned that any Custom Data Models linked to that table will also be archived — on confirmation, the table and all linked models are archived together
- AC8: When an admin proceeds with **deleting** an extra table, the associated Custom Data Model is automatically deleted (or at minimum archived) — the admin is warned of this before confirming the deletion

---

### Story 3: Auto-creation of the source dataset and Custom Data Model

**As a** Data Studio admin, **I want** a source dataset and Custom Data Model to be automatically created when I add an extra table from a CDC (Fivetran) source **so that** the data is immediately available in the Catalog without requiring a separate model creation step.

**Acceptance Criteria:**
- AC1: When an extra table is added — either during connector creation or to an existing connector — a source dataset and Custom Data Model are automatically created
- AC2: The source dataset is named after the table name as it exists in Fivetran
- AC3: The Custom Data Model is named `<connector name> <table name>` and created in Draft status in the Catalog
- AC4: The auto-created Custom Data Model uses pass-through field mapping — source schema columns are listed in the order they appear in the source table
- AC5: The auto-created Custom Data Model follows the same lifecycle as any other Custom Data Model — it must be published before data is available downstream
- AC6: If a table is added but the connector creation fails, no source dataset or Custom Data Model is created
- AC7: If multiple extra tables are selected at once, a separate source dataset and Custom Data Model is created for each table
- AC8: The source dataset created is available in the Source Datasets subtab when configuring any model, following standard platform behavior

---

### Story 4: Post-creation notification

**As a** Data Studio admin, **I want** to be informed when my newly created Custom Data Model is ready **so that** I can find and configure it without having to search the Catalog.

**Acceptance Criteria:**
- AC1: After an extra CDC table is added, the admin is shown a confirmation that the Custom Data Model is being created and that data sync is in progress
- AC2: When the sync completes and the model is ready, the admin receives an email notification that includes the name and a direct link to each newly created Custom Data Model
- AC3: If multiple tables were added at once, the email notification includes the name and link for each model created
- AC4: The model is findable in the Catalog at any point after creation, regardless of whether the sync has completed

---

## UX Requirements

**Reference:** [Prototype — Figma](https://www.figma.com/design/2lWgrzEE6mc6yW3fM1MrUI/Data-Studio---For-Dev?node-id=1072-16225)

**Connector Setup Flow — New Connector**
- Table selection is presented as part of the connector setup wizard
- FloQast standard tables are pre-selected and locked — the admin cannot deselect them
- Additional available tables from the source are listed and selectable
- Standard and extra tables are visually distinguished from each other

**Connector Setup Flow — Existing Connector**
- The admin can access a table management view from an existing connector
- Both standard tables and any previously added extra tables are visible
- The admin can add new extra tables or remove/archive previously added ones
- Delete triggers a warning with a suggestion to archive instead
- Archive warns that linked Custom Data Models will also be archived

**Post-Addition Confirmation**
- Admin sees a confirmation that the Custom Data Model is being created and data sync is in progress
- No immediate link to the model — the email notification delivers that once sync completes

**Open UX questions for designer:**
- Where exactly in the connector setup flow does table selection appear — its own step, or an expansion within an existing step?
- How are standard vs. extra tables visually distinguished in the table list?
- What does the archive/delete warning state look like?
- How does the table management view surface from an existing connector — is it accessible from the connector detail page?
- Should column names within each table be visible during table selection to help admins identify the correct table?

---

## Open Questions

| # | Question | Owner |
|---|---|---|
| OQ-1 | Should admins be able to join multiple extra tables together within a single model, rather than each table becoming its own standalone Custom Data Model? | Data Studio PM / Engineering |
| OQ-2 | Adding extra tables increases CDC (Fivetran) processing costs. Should there be guardrails, visibility into cost impact, or approval gates before a table is added? Relates to the CDC Cost Tracking PRD. | Data Studio PM / Engineering |
| OQ-3 | Should column names within each table be visible during table selection to help admins identify the correct table? | Data Studio PM / Design |

---

## Gaps

1. **Cost visibility at time of table addition** — There is no mechanism in this PRD for surfacing the cost impact of adding an extra table at the point of selection. As CDC usage scales this could become a meaningful gap. Tracked as an open question and relates to the CDC Cost Tracking PRD.

2. **Joining extra tables into a single model** — Each extra table creates its own standalone Custom Data Model. If a use case emerges where an admin needs to combine multiple extra tables into a single model, that is not supported in this version.

3. **Table management at scale** — No filtering, search, or categorization is defined for the extra table selection UI. If a source system has a large number of tables, discoverability could become a problem.

---

## References

| Resource | Link |
|---|---|
| Definitions & Terms | [Confluence](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409) |
| Custom Data Model PRD | [prd-custom-data-model.md](../custom-data-modeling/prd-custom-data-model.md) |
| CDC Cost Tracking PRD | *(TBD — not yet written)* |
| Prototype | [Figma](https://www.figma.com/design/2lWgrzEE6mc6yW3fM1MrUI/Data-Studio---For-Dev?node-id=1072-16225) |
