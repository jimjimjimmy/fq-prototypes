# Entity Mapping v2 (DRAFT)

| Field                 | Value                                                                                                                                                                                                                                                                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Confluence**        | [Entity Mapping v2](https://floqast.atlassian.net/wiki/spaces/Data/pages/4600561831/Entity+Mapping+v2)                                                                                                                                                                                                                                                  |
| **Status**            | DRAFT                                                                                                                                                                                                                                                                                                                                                   |
| **Last updated**      | 2026-07-01                                                                                                                                                                                                                                                                                                                                              |
| **Owner**             | Alex Kearns                                                                                                                                                                                                                                                                                                                                             |
| **Target release**    | 2026-09-30                                                                                                                                                                                                                                                                                                                                              |
| **Epic**              | *(link to epic)*                                                                                                                                                                                                                                                                                                                                        |
| **Idea Link**         | [IDEA-2618](https://floqast.atlassian.net/browse/IDEA-2618)                                                                                                                                                                                                                                                                                             |
| **Document status**   | DRAFT                                                                                                                                                                                                                                                                                                                                                   |
| **Document owner**    | @Alex Kearns                                                                                                                                                                                                                                                                                                                                            |
| **Designer**          | Natasha Clark · Kristin Johnson                                                                                                                                                                                                                                                                                                                         |
| **Tech lead**         | *(assign)*                                                                                                                                                                                                                                                                                                                                              |
| **Technical writers** | *(assign)*                                                                                                                                                                                                                                                                                                                                              |
| **Related sub-PRDs**  | [1 of 4: Model Creation & Source Configuration](https://floqast.atlassian.net/wiki/spaces/Data/pages/4450189505) · [Mapping Expressions v2](https://floqast.atlassian.net/wiki/spaces/Data/pages/4594892801)                                                                                                                                            |

---

## Objective

Replace today's narrow, range-only entity-scope mechanism with a true entity-tagging data model that supports the full set of ways customers encode entity information in their source data. This PRD owns entity end-to-end in Data Studio — detection, configuration UX, the data-model contract, and downstream queryability — so there is one source of truth for how entity flows through the platform.

The output of this PRD is the ability for users to define other patterns by which `fq_entities` can be mapped to data. This data model is consumed by Close (entity-scoped reconciliation), Reporting (entity-keyed data requests), and is foundational to their adoption of Data Studio.

**CAS customers — special case.** For CAS (accounting service provider) customers, an entity *is* an end client. A CAS dataset must never carry more than one entity tag on a single record — multi-entity tagging exists for single-tenant customers (shared services rows, parent + subsidiaries, multi-region rows), but CAS datasets are by definition single-entity per record. Enforcement of this rule lives with the CAS connector mode — see UC8 and OQ-17.

**Consolidation Entities — layered tagging.** *(Added 2026-07-01.)* A Consolidation Entity is a regular FQ entity designated as a roll-up target; downstream queries scoped to it need records tagged with both their leaf entity and the Consolidation Entity. See **EM10**.

**Reference-table entity resolution.** *(Added 2026-07-01.)* Some sources (e.g., NetSuite's `Subsidiary` table) encode entity on a separate reference table/file that fact records join against, rather than as a column on the record itself. This is a trait of **Direct Integrations** (see Definitions) — not of any particular ingestion pipeline. See **EM11**.

### Today's Production Baseline

**Scope: this entire baseline applies to SFTP / file-upload connectors only.**  Entity scope is configured per-file inside the Connector → Edit File → **Entity Scope** tab — a file-config surface that only exists for file-based ingestion. **CDC and Direct API connectors have no entity-mapping mechanism today whatsoever** — not a lesser version of the row-range mechanism, none at all. For those connector types, this PRD isn't extending or replacing an existing capability — Pattern 10 (Connector-Level Assignment) and Pattern 11 (Entity via Reference Table) are the **first** entity-tagging capability those connector types get. This matters for scoping conversations: "today's baseline" language elsewhere in this PRD (e.g., the Depends-on field, What This PRD Changes) should be read as describing the file-connector experience specifically, not a floor that CDC/API connectors already meet.

For file-based connectors, the mechanism works as follows: for each entity the admin chooses, the system asks: Has Header (Y/N), Header Range (e.g., `A1:A1`), and Data Range (e.g., `A2:A11`). Each configured entity row produces a **synthetic source dataset** in the Catalog (auto-labeled `{FileLabel}-{entity}`, e.g., `AT Department-demo-US`). Models compose these synthetic sources by picking the per-entity slices they want.

**What this means in practice (file connectors):**
- Only one pattern is supported natively — **row-range per entity** (Pattern 5 in this PRD's framing). *Note that it can be used to support **no entity in file** (pattern 1), **multiple regions** (pattern 6), **entity-tagged columns** (pattern 7), and **repeated column blocks** (pattern 8), but none of these are very intuitive to the user.*
- Entity scope is encoded by *which synthetic source the records came from*. Synthetic-source slicing is the only mechanism that populates `fq_entity` today — there is no admin-configurable column / sheet / file / connector-level path.
- Multi-entity-per-row is possible, but not very straight forward and is separated by artificial "labels" for use within a specific model (i.e. recipe/ lineage.)
- Customers with Entity-Tagged Columns (e.g., `US Balances`, `UK Balances`  columns) work around this today by building a separate model per entity.
- The `{FileLabel}-{entity}` synthetic source name is backend naming and phases out— slicing is no longer load-bearing as the only way to tag records.

**What this means in practice (CDC / Direct API connectors):**
- No entity-tagging path exists at all. Every record from a CDC or API connector lands with no entity information today, regardless of whether the source schema (e.g., NetSuite's `Subsidiary`/`Transaction` relationship) actually carries entity information.
- This is the gap Pattern 10 and Pattern 11 close — see EM1 (connector-level default), EM3 AC-EM3-11 (Pattern 10), and EM11 (Pattern 11). Neither pattern is migrating an existing CDC/API mechanism; both are net-new capability for those connector types.

**What this means in practice (file-based Direct Integrations — e.g., SAP ECC / SAP S/4HANA, Q3):** *(Added 2026-07-01, per AK.)* This is a middle case, not covered by either bullet above. A file-based Direct Integration is transported the same way as a customer's own SFTP upload, so it technically inherits the file-connector row-range mechanism described above — but that mechanism only slices *one* file by row range. It has no concept of joining a fact file against a separate reference/dimension file (e.g., a SAP company-code-to-entity lookup file delivered alongside the transaction file). So while file-based Direct Integrations aren't at true "zero capability" like CDC/API, the specific reference-table join case is equally unaddressed today. This is the same gap Pattern 11 closes for CDC — see EM11, which is scoped to Direct Integrations generally (any transport), not CDC specifically.

### What This PRD Changes

1. **Extend `fq_entity` configuration paths.** Today, admins can't configure entity tagging via entity columns (pattern 2), entity per sheet (pattern 3), entity in value substring (pattern 9), or connector-level assignment (pattern 10). This PRD adds nine new admin-configurable patterns plus connector-level assignment, displacing slicing as the load-bearing mechanism. The synthetic-source label hack goes away. Migration of existing models that reference synthetic source datasets is required (see Gaps).
2. **Expand from one supported pattern (row-range) to eleven** — Shared/Global, Entity Column, Entity per Sheet, Entity per File, Row Range per Entity, Multiple Regions, Entity-Tagged Columns (wide-to-long), Repeated Column Blocks (wide-to-long), Entity in Value Substring, Connector-Level Assignment, and Entity via Reference Table (Direct Integrations) — added 2026-07-01, see EM11.
3. **Add detection + confirm UX** (DETECT → CONFIRM → SIDE-BY-SIDE → MANUAL) so admins stop hand-writing `A2:A11` ranges per entity.
4. **Introduce connector-level entity defaults with per-source override** — today's config exists only at the per-file level; the new model lets admins set entity behavior once at the connector and override per source dataset where needed.
5. **Support layered pattern composition** — a source is no longer limited to exactly one pattern. A row-value pattern (leaf entity per record) and a whole-dataset pattern (e.g., a Consolidation Entity applied across every record) can compose additively into a single `fq_entity` array — added 2026-07-01, see EM10.

---

## The Eleven Patterns at a Glance

*(Renamed from "Ten Patterns" 2026-07-01 — Pattern 11 added, see EM11.)*

The eleven ways a source can encode entity information. This is the orienting reference for the whole PRD — V1 support tiers, per-pattern behavior, and acceptance criteria are detailed in **EM3-LC** (patterns 1–10) and **EM11-LC** (pattern 11); full enumeration is in `patterns.md`.

| #   | Name                                    | Tier                       | Encoding location                                              |
| --- | ---------------------------------------- | -------------------------- | --------------------------------------------------------------- |
| 1   | **Shared / Global**                      | Core                       | (none — applies to all)                                         |
| 2   | **Entity Column**                        | Core                       | Column value(s) in source rows                                  |
| 3   | **Entity per Sheet**                     | Core                       | Sheet / tab name                                                 |
| 4   | **Entity per File**                      | Core                       | File-level / filename                                            |
| 5   | **Entity per Row Range**                 | Risky (warning)            | Row index ranges                                                 |
| 6   | **Multiple Regions**                     | Escape-hatch (manual-only) | Table-region position within file                                |
| 7   | **Entity-Tagged Columns**                | Core                       | Column headers (wide format)                                     |
| 8   | **Repeated Column Blocks**               | Core                       | Column blocks (repeating wide format)                            |
| 9   | **Entity in Value Substring**            | Core                       | Substring within values of a column (NOT the column name)        |
| 10  | **Connector-Level Assignment**           | Core                       | Connector configuration (post-ingestion)                         |
| 11  | **Entity via Reference Table (Direct Integrations)**     | Direct-Integration-defined (not runtime-detected) | Lookup against a joined reference/dimension table or file (e.g., NetSuite's `Subsidiary`; SAP ECC/S4HANA's expected company-code-style lookup file), available only for Turn Key Direct Integrations with a FloQast-built ERD relationship map — independent of which pipeline (CDC, SFTP, Direct API) that Direct Integration happens to use — *added 2026-07-01, broadened 2026-07-01, see EM11* |

Plus the cross-cutting mechanism in EM1: a **connector-level default** (any of the above applied once across all source datasets) with **per-source-dataset override**.

**Patterns are not mutually exclusive.** *(Added 2026-07-01.)* A row-value pattern (2, 7, 8, 9, 11 — determines the leaf entity per record) can be **composed** with a whole-dataset pattern (1, 3, 4, 10 — applies an additional entity, such as a Consolidation Entity, across every record in the source). The resulting `fq_entity` is the union of both. See **EM10**.

---

## Definitions

See [Definitions & Terms (Data Studio)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409) for shared terminology. Key terms for this PRD:

- **`fq_entity`** — the canonical entity field on every model. Typed as **`array<entity>`** — each value is a member of the FQ entity list. A single record can be tagged with zero, one, or many entities at once. Cardinality semantics (NULL = not configured · `[]` = explicit Shared/Global · `[A]` = single · `[A, B, …]` = multi, not for CAS) are defined in the **EM6 data-model table** — not duplicated here.
- **`entity_start_time`** — the effective start timestamp for an entity-mapping config version (timestamp precision, not date). Stored on the **config** (not on records). Records ingested at or after `entity_start_time` are tagged per this config. Setting `entity_start_time` to a past value when saving a new config is the mechanism that triggers backfill of historical records (see EM7).
- **Connector states** — defined in the [Connector Status Reference](https://floqast.atlassian.net/wiki/spaces/Data/pages/4564287500/Connector+Status+Reference): Draft, Pending, Active, Warning, Error, Auth Expired, Archived. Entity-mapping config is configured during connector **Draft** (initial setup) or via **edit + save** on an Active connector. There is no separate Draft / Published state machine for the entity-mapping config itself — it follows the connector's lifecycle.
- **Entity scope** — whether and how a file or connector encodes entity information. Can be: file-level (one or more entities per file), row-level (entity column with single or multi-value cells), section-level (per-tab, per-region, per-row-range), column-encoded (entity in column headers), or connector-level (assignment at the connector).
- **Pattern** — one of the eleven ways a source can encode entity information. See `patterns.md` for full enumeration of patterns 1–10; pattern 11 is specified in EM11-LC.
- **Direct Integration** *(added 2026-07-01; refined 2026-07-01 per AK)* — a FloQast-built, "Turn Key" connector for a specific named external system (e.g., NetSuite, SAP ECC, SAP S/4HANA) — pre-built by FloQast with knowledge of that system's schema/ERD baked in, as opposed to a generic file-upload connector or a generic API connector where FloQast has no prior knowledge of the customer's shape. **Pipeline (backbone) is a separate, orthogonal attribute of a Direct Integration, not part of what defines it** — a given Direct Integration rides on one of FloQast's ingestion pipelines (SFTP, Direct API, or CDC/Fivetran), but which pipeline it uses doesn't change its "Direct Integration" status. NetSuite happens to use the CDC pipeline; SAP ECC/S4HANA (expected Q3) happens to use the SFTP pipeline; a future Direct Integration could use the Direct API pipeline. What makes something a Direct Integration is FloQast's built-in schema/ERD knowledge, which is what makes Pattern 11 (Entity via Reference Table) possible for it — see EM11.
- **Detect + confirm** — the primary UX model: system parses the file, makes a best-guess about which pattern applies, and asks the admin to confirm rather than manually choose from a list.
- **Backfill** — applying a new (or changed) entity mapping config to records that have already been ingested. Mechanism: set `entity_start_time` to a past timestamp when saving the new config. Default behavior is forward-only (`entity_start_time` = save time → new config applies to future ingestion only). Explicit backfill = admin sets `entity_start_time` in the past, which triggers re-tagging of records ingested since that timestamp.
- **Destructive backfill** — a backfill in which one or more records *lose* a tag (e.g., wrong-client correction). Triggers the diff-preview confirmation gate and the audit log entry is marked as destructive.
- **Diff preview** — a pre-save summary of how saving a new entity-mapping config (with its chosen `entity_start_time`) will change `fq_entity` tags on existing records: "X records will be re-tagged; Y will have entity_A removed; Z will have entity_B added." Required for destructive backfills (any record loses a tag); surfaced for additive backfills too as informational.

---

## Why This Is Important

**Current production UX uses regex and hard-coded row references**, this does not match our best practice recommendations, or our most common use cases in FloQast today. 

**The Q3 goal:** a UX that supports the other patterns, which is something an Excel-fluent accountant can complete on their own for the common cases, with escape hatches for the edge cases.

**Why this matters strategically:**

- **Close adoption** — entity is foundational to reconciliation scoping
- **Reporting adoption** — current expectation is to be able to filter data by entity, this may change in the future.
- **Implementation partner time** — every customer's entity setup currently consumes Integrations team or ATC team time that should be self-service

---

## Key Benefits

| Benefit                                               | Description                                                                                                                                                                              |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Self-service entity setup for Excel-fluent admins** | Configure entity mapping in the connector without writing regex or escalating to Support                                                                                                 |
| **Detect + confirm primary flow**                     | System parses the file, proposes the encoding pattern, admin confirms — replaces "pick from list of 10 confusing options"                                                                |
| **Pattern coverage matches real customer files**      | V1 supports the most common encodings (entity column, entity per sheet, entity in value substring, and multi-entity files) + connector-level for APIs/CDC; advanced patterns supported with escape hatches |
| **Foundation for Reporting + Close adoption**         | Without reliable `fq_entity` tagging, downstream products can't trust the data                                                                                                           |

---

## Use Cases

| #   | Persona                                                                                                               | Scenario                                                                                                                                                                    | Expected outcome                                                                                                                                                                                                                                                                                                     |
| --- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| UC1 | Excel-fluent admin                                                                                                    | Sets up entity mapping for the first time on a single-source file-based connector where entity is in a column                                                               | System detects the entity column, proposes Entity Column pattern, admin one-click confirms; source values auto-match to FQ entities for review; admin saves and moves on                                                                                                                                             |
| UC2 | Excel-fluent admin                                                                                                    | Connector has multiple source datasets with different entity semantics (e.g., NetSuite TRANSACTION has entity column, NetSuite ACCOUNT is Shared/Global)                    | Connector-level default applies to most; admin uses per-source-dataset override for the outliers; system makes both states obvious in the configuration UI                                                                                                                                                           |
| UC3 | Admin (any tier)                                                                                                      | Post-launch wrong-client correction — discovers records were tagged with `entity_A` but should have been `entity_B`                                                         | Admin edits connector, changes the source-value mapping, backdates `entity_start_time`, sees the diff preview ("12,000 records will be re-tagged; entity_A loses 12,000; entity_B gains 12,000"), enters required reason, acknowledges destructive change, saves; backfill executes and audit log records the change |
| UC4 | Admin (any tier)                                                                                                      | Setting up entity mapping for a new customer; iterating on config as the customer reviews test data                                                                         | No model has been published against the source dataset yet (or no data has been processed through one) — the admin freely reconfigures without hitting the destructive gate or required-reason field, per the resolved Scenario A/D rule (EM7)                                                                                                       |
| UC5 | Admin                                                                                                                 | New source values arrive at runtime (e.g., a new entity code shows up in the entity column on next ingestion)                                                               | System applies the configured default behavior (Shared/Global or NULL per AC-EM4-06); admin gets a notification "N new source values were ingested without explicit FQ entity mapping. Review and confirm."                                                                                                          |
| UC6 | Controller / Auditor                                                                                                  | Auditing the entity tagging history for a model — "what entity was record X tagged with on 2026-Q1?"                                                                        | Audit log + historical configs (with `entity_start_time`) let the auditor reconstruct the tagging that was in effect for any record at any point in time                                                                                                                                                             |
| UC7 | Admin                                                                                                                 | Configuring entity mapping for an API/CDC connector (no file content, table schema only)                                                                                    | System inspects the table schema; for endpoints where entity should be Connector-Level Assignment (no file content), admin assigns entities directly to the connector; for endpoints with an entity column, Entity Column pattern is detected as in UC1                                                              |
| UC8 | Admin                                                                                                                 | Configuring a CAS-customer connector where data must belong to exactly one entity (no multi-tag)                                                                            | Connector is flagged as CAS mode (pending OQ-17 framing); setup flow gates the next step until a single entity is specified; multi-entity tagging is disabled for that connector                                                                                                                                     |
| UC9 | ATC running an implementation, experienced implementation partner, or experienced admin familiar with the source data | Knows the pattern up front, wants speed over guidance — skip detection, type ranges / regex directly, bulk-import 200+ source-value mappings rather than reviewing each one | Enables the "Advanced options" toggle (EM9); goes straight to the pattern picker; types raw range / regex / filename inputs; bulk-pastes the source-value mapping; completes setup in a fraction of the guided-flow time. Toggle persists per user across sessions and connectors.                                   |
| UC10 | Excel-fluent admin | Configuring a NetSuite CDC connector (or, in Q3, a SAP ECC/S4HANA Direct Integration) where entity lives on a separate reference table (`Subsidiary`) rather than a column on the transaction records | Pattern 11 is already active — no pattern to pick. Admin sees the reference table's distinct values (e.g., subsidiary names) and maps them to FQ entities, same flow as EM4. Every fact table/file that references the reference table resolves `fq_entity` automatically, with no per-table setup — including tables added to the connector later. |

---

## Success Metrics

| Goal                         | Metric                                                                                                                           | Baseline                                                          | Target                                                               |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------- |
| Detection accuracy           | % of detect-and-confirm proposals (Confirm layer) accepted by admin without override                                             | N/A                                                               | 70%+                                                                 |
| Backfill safety              | % of destructive backfill operations executed without subsequent rollback or correction                                          | N/A                                                               | 95%+ (i.e., admins get it right via the diff preview the first time) |
| Pattern coverage in the wild | % of customer source datasets that fit into Core patterns (1, 2, 3, 4, 7, 8, 9, 10) without using the manual / escape-hatch path | *(current — measure pre-launch via inspection of customer files)* | 90%+                                                                 |


---

## Assumptions

- **Storage operations and database structure are an engineering concern; this PRD specifies *capability and experience* requirements.** Where the PRD describes data shape (e.g., `fq_entity` as `array<entity>`, NULL vs empty array vs populated semantics, `entity_start_time` on the config, historical config preservation), it does so to define a **capability contract** — what admins must be able to *do*, what auditors must be able to *reconstruct*, and what downstream products must be able to *rely on*. The underlying storage mechanism, indexing strategy, table/column layout, and persistence pipeline are owned by engineering and are not prescribed here.
- The connector has been **established — at minimum its name and type** — before the user configures entity mapping. The type is a hard prerequisite: it drives the recommendation and which patterns are applicable (per EM5). **Sample data is *not* guaranteed to be present at this point:** API/CDC connectors may not have ingested a sample yet, and an admin setting a connector-level default ("apply entity mapping to all source datasets") may configure before any source content lands. Detection (EM5) is therefore best-effort — when no sample / source content is available, the flow falls back to manual selection or connector-level assignment (Pattern 10). Source datasets, where they exist, are produced by the connector but are not yet linked into downstream models.
- The FQ entity list is configured at the FloQast workspace level (out of scope for this PRD).
- `fq_entity` is typed as `array<entity>` and supports 0/1/N cardinality (see Definitions for NULL vs empty array vs populated semantics).
- **Entity mapping is configured within the connector, at one of two granularities — both in scope:**
  - **Connector-level default** — the admin indicates, once, which entities apply to *all* source datasets in the connector. This is the click-reduction path and the entry point (per EM1 / OQ-14).
  - **Per-source-dataset override** — the admin drills into an individual source dataset and configures it differently from the connector default. The source-dataset config is the source of truth where set; everything else inherits the connector default.

  Both granularities are reached from the connector surface — the admin starts at the connector and either sets the connector-level default or drills into a specific source dataset. Source-dataset configuration is a regular, fully-supported path, not an exception. Either way, configuration happens during connector Draft setup or via edit + save on an Active connector, and each saved config — connector-level or per-source — carries an `entity_start_time` that determines when it becomes effective. There is no separate Draft / Published state for the entity-mapping config itself — it follows the connector's lifecycle (per the [Connector Status Reference](https://floqast.atlassian.net/wiki/spaces/Data/pages/4564287500/Connector+Status+Reference)).
- **Historical entity-mapping configs are preserved** for audit. When a new config is saved with a forward-only `entity_start_time`, records ingested under the previous config retain their original tagging. When a new config is saved with a past `entity_start_time` (backfill), records since that timestamp are re-tagged per the backfill workflow (EM7).
- **Schema versioning is out of scope for this PRD** — when a source's columns change (added / removed / renamed), the entity-mapping config may break or need re-validation. The schema-versioning behavior is being defined in a separate PRD.
- Reporting's current entity dependency is a hard Q3 constraint; future direction (Dylan, 2026-04-30) may relax this but is not assumed here.
- Aggregate / data-domain entity modeling is out of scope (see Synthesis §4). The `fq_entity` array partially absorbs the multi-tag case but is not a full aggregates concept. The UX must not bake in assumptions that contradict a future aggregates concept.
- **`fq_entity` (or `fq_entities`) field likely already exists on records today**  — believed already present, populated today only by synthetic-source slicing. **Action: confirm with Engg before scope-lock.** If confirmed, this PRD *extends the field's population paths* rather than introducing the field, and both the migration story (Gap #0) and platform-side schema scope shrink materially. The sections that currently read as if the field is new (Depends on, Today's Production Baseline, What This PRD Changes #1, Gaps #0–1) get reframed at that point.

---


## Scope

### In Scope (9/30) — *proposed, pending confirmation*

Detail for each capability lives in its EM requirement; this is the scope boundary, not a re-spec.

- **All eleven encoding patterns** at the connector / source-data layer — tiers per **The Eleven Patterns at a Glance** (above); per-pattern behavior + ACs in **EM3** (patterns 1–10) and **EM11** (pattern 11). Core (detection-tier taxonomy): 1, 2, 3, 4, 7, 8, 9, 10. Pattern 11 sits outside that taxonomy entirely — it's Direct-Integration-defined, not detected or admin-picked (see EM11) — but is equally in-scope and equally high-priority. Patterns 7/8 add a wide-to-long pivot, pattern 9 adds value-substring extraction, and pattern 11 adds a reference-table join — all new source-data-layer capabilities. Most-common encodings in practice: 2, 3, 9, and multi-entity files.
- **Connector-level default + per-source-dataset override** — set entity once for the whole connector, override individual datasets where they differ; both are regular paths (**EM1**).
- **Layered pattern composition for Consolidation Entities** — a row-value pattern and a whole-dataset pattern can compose additively so a record carries both its leaf entity and a parent Consolidation Entity (**EM10**).
- **Entity via Reference Table (Pattern 11)** — for Direct Integrations (NetSuite first; SAP ECC/S4HANA expected in Q3) with a FloQast-built ERD relationship map. Defined per Direct Integration, not admin-configured or runtime-detected (see Definitions, **EM11**).
- **Detect → confirm → side-by-side → manual UX** — ingestion-type-aware (file / API / CDC / connector-only), with Excel-style interactive selection. Best-effort detection; graceful fallback when there's no sample content to detect against (**EM5**).
- **Source-value → FQ-entity mapping** — auto-match, 1-to-many fan-out, unmapped-value default, and runtime new-value handling (**EM4**).
- **`fq_entity` data-model contract** — `array<entity>` with NULL / `[]` / single / multi semantics, `entity_start_time` on the config, preserved historical configs, downstream queryability (**EM6**).
- **Live-data backfill via `entity_start_time`** — forward-only by default; a past timestamp triggers backfill, gated by diff preview → required reason → destructive type-to-confirm → replace semantics → audit log. Destructive treatment is evaluated per model/source dataset (published + data processed, per resolved OQ-19/20) rather than as a single connector-wide state (**EM7**).
- **Completeness warning at save time** — warn-and-allow when a source dataset would land `fq_entity = NULL` (**EM8**).
- **Escape-hatch literal assignment** — set `fq_entity` to a literal via a Mapping Expressions v2 `CONSTANT` rule, for edge cases where the patterns don't apply.
- **"Advanced options" toggle** — opt-in power-user controls (pattern-picker shortcut, raw range / regex / filename entry, bulk mapping import) inside the same flow (**EM9**).

### In Scope with escape hatch (V1)

Supported but requires explicit user confirmation — system won't auto-detect, but the manual path covers it:

- **Pattern 6 — Multiple table regions ("islands") in one file.** Admin selects each region and assigns an entity. Manual path only. Bryan Rodriguez flagged as less common.

### In Scope but flagged risky (V1)

- **Pattern 5 — Row sections per entity** (e.g., rows 2–102 = entity A, 103–210 = entity B). Supported but UX shows a fragility warning ("row references will break if rows are added or removed"). Both AK and Bryan Rodriguez flagged as fragile / less common.


### Out of Scope

- **Aggregate / data-domain entity modeling** — **owned by the Platform team, not Data Platform**. Explicitly out of scope for this PRD. The `fq_entity` array partially absorbs the multi-tag case but doesn't replace a first-class aggregates concept. UX must not contradict a future aggregates concept (see Synthesis §4) but doesn't try to model it.
- **AI-driven entity detection beyond rule-based heuristics** — chat-guided experience per Greg's 2026-04-17 framing. Depends on engineering AI capacity (OQ-4). Q3 ships rule-based detect + confirm; AI is an enhancement target.
- **Per-downstream-product UI for entity picking / display** — how Close / Reporting / CAS / Compliance / Consolidation surface entity selection, render NULL tags, display multi-entity badges, or implement entity-scoped query UI is owned by each downstream product's own PRDs. **This PRD owns the data contract** (`fq_entity` schema, NULL semantics, empty-array semantics, queryability rules — see EM6) — but the per-product consumption UX is not authored here.
- **FQ entity list management** — creating, archiving, renaming entities in the workspace. Workspace-level admin function, out of scope for this PRD. *(Interaction surfaced as OQ-11.)*
- **Reporting's future entity-free architecture** (Dylan, 2026-04-30) — treated as future direction. Q3 ships with the current Reporting-entity dependency assumed.
- **Elevated permission UX for destructive backfill** — V1 ships with connector-edit permission; explicit AK decision (2026-05-20) to defer the elevated-role UX to a later release. The V1 safety controls are diff preview + required reason field + audit log.
- **Cross-source entity reconciliation conflict resolution** — when two source datasets contribute different entity tags for the same joined record, the V1 behavior is to *union* the arrays (since `fq_entity` is multi-valued, both tags coexist). Conflict-driven precedence rules (one source wins over another) are deferred — surface if it comes up.

---

## Requirements Quick Reference

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| EM1-LC | Entity-mapping configuration in connector setup (connector-level default + per-source-dataset override) | High | Drafted 2026-05-20 |
| EM2-LC | Model view shows entity scope (derived, read-only, with click-through to source/connector for edits) | Medium | Drafted 2026-05-20 |
| EM3-LC | Pattern support — connector-level + file-level (patterns 1, 2, 3, 4, 7, 8, 9, 10 core; 6 escape hatch; 5 risky) | High | Pending |
| EM4-LC | Source-value → FQ-entity mapping with 1-to-many fan-out + auto-match + unmapped default + new-value-at-runtime handling | High | Drafted 2026-05-20 |
| EM5-LC | Detect-and-confirm + layered fallback (detect → confirm → side-by-side → manual) with interactive selection, ingestion-type-aware (file / API / CDC / connector-only) | High | Drafted 2026-05-20 |
| EM6-LC | `fq_entity` data model — `array<entity>` with NULL / empty / populated cardinality semantics; empty-array → "applies to all" flagged for engineering review (see OQ-18) | High | Drafted 2026-05-20 |
| EM7-LC | Live-data backfill via `entity_start_time` — diff preview, required reason, audit log, replace semantics; 4 scenarios including Implementation (D) deferred to OQs | High | Drafted 2026-05-20 |
| EM8-LC | Completeness warning at connector save time when entity mapping would produce NULL `fq_entity` on ingestion (source-dataset granularity, warn-and-allow override). Ingestion-time signal deferred to V2 per OQ-2. | Medium | Drafted 2026-05-21 · Scope locked 2026-05-28 |
| EM9-LC | "Advanced options" affordance for ATCs, partners, and experienced admins — opt-in toggle (default off, per-user persistence) surfacing pattern picker shortcut, raw range / regex / filename entry, and bulk source-value mapping paste / CSV or Excel import. Lives inside the same flow as the guided experience for Excel-fluent admins. | Medium | Drafted 2026-05-28 |
| EM10-LC | Layered pattern composition — a row-value pattern and a whole-dataset pattern apply additively to the same source, so `fq_entity` carries both the leaf entity and a layered-on entity (e.g., a Consolidation Entity). | High | Drafted 2026-07-01 |
| EM11-LC | Pattern 11 — Entity via Reference Table (Direct Integrations, any pipeline) — entity resolved via lookup against a joined reference/dimension table or file (e.g., NetSuite's `Subsidiary`; SAP ECC/S4HANA's expected company-code lookup) rather than a column on the fact-table row. Defined per Turn Key Direct Integration, independent of pipeline (CDC, SFTP, Direct API). | High | Drafted 2026-07-01; broadened 2026-07-01 |

---

## Detailed Requirements

### EM1-LC — Entity-mapping configuration in connector setup

**User Story:** As an admin configuring a connector, I want to set entity mapping once for the whole connector — and configure individual source datasets where they differ — so that I don't repeat the same setup per dataset, source datasets added later are protected from landing untagged, and there's no separate entity step in model setup.

**Importance:** High

**Details:**

> **Principle (locked 2026-05-28 per OQ-14):** The connector is the entry point and the default-bearing surface for entity assignment — chosen to reduce repeated clicks and to protect source datasets added later, **not** because entity must be defined connector-wide. From the connector surface the admin can set a blanket default for all datasets, drill into individual source datasets to configure or override them, or both. Per-source-dataset configuration is a regular path, not an exception. Confirmed by AK + Rebecca.

Entity-mapping configuration lives in **connector setup**, not in model setup. The admin can set the entity-mapping behavior once at the connector level, which becomes the default applied to all source datasets the connector produces. When source datasets within a connector differ in entity semantics (e.g., NetSuite TRANSACTION has an entity column but NetSuite ACCOUNT is shared / pattern 1), the admin can override the connector-level default with a source-dataset-specific config — reached as a drill-down from the connector surface.

**Why a connector-level default:** two reasons — (1) **click reduction** — configure once instead of repeating the work per source dataset; (2) **drift protection** — when a new source dataset is added to the connector later (a new file pattern, a new CDC table), it inherits the connector default rather than silently landing with `fq_entity = NULL`. The default is a convenience and a safety net, **not a constraint** — an admin who wants per-dataset control can configure entirely at the source-dataset level, and the completeness warning (EM8) catches any dataset left with no config at all.

On entering the entity-mapping section of connector setup, the system parses the connector's source datasets where sample / source content is available (sheets, headers, first N rows, filename — or table schema for API/CDC) and proposes a connector-level default with a confidence indication. Where no content exists yet (API/CDC before first sync, or an admin setting a connector-level default before any data lands), there is nothing to detect against — the admin goes straight to manual selection or connector-level assignment (Pattern 10). The admin reviews + confirms, or descends into per-source overrides where needed.

Models that compose source datasets from this connector inherit the tagging behavior automatically — there is no entity-mapping step in the model setup flow.

**Note on UI/copy terminology:** The terms "scope," "entity scope," and "entity mapping" are provisional throughout this PRD. User-facing menu navigation and labels may use a different term. Lock terminology before design begins — see **OQ-13**.

**Acceptance Criteria:**

**AC-EM1-01 — Entity-mapping config accessible during connector setup**
- Given I am configuring a new or existing connector
- When I complete the basic connector setup (auth + endpoint)
- Then the entity-mapping configuration is accessible as part of the connector setup flow

**AC-EM1-02 — Connector-level default applies to all source datasets**
- Given I configure a connector-level entity-mapping default
- When the connector ingests data via any of its source datasets
- Then the default applies to every source dataset that hasn't been overridden

**AC-EM1-03 — Per-source-dataset override available**
- Given a connector has a connector-level default configured
- When a specific source dataset within that connector has different entity semantics
- Then I can override the connector-level default with a source-dataset-specific config
- And the override applies only to that source dataset; other source datasets continue to use the connector-level default

**AC-EM1-04 — System parses connector's source datasets and proposes config on entry**
- Given I enter the entity-mapping section of connector setup
- When the section loads
- Then, **where sample / source content is available**, the system parses the connector's source datasets and proposes a connector-level default pattern + initial configuration with a confidence indication
- And **where no sample content exists yet** (e.g., API/CDC before first sync, or configuring a connector-level default before any data lands), the system skips detection and opens the manual / connector-level assignment path (Pattern 10) rather than proposing

**AC-EM1-05 — One-click confirmation for high-confidence proposals**
- Given a connector-level proposal is shown with high confidence
- When I review the proposal
- Then I can confirm with one click
- And the configuration is saved to the connector

**AC-EM1-06 — No entity-mapping step in model setup**
- Given a model composes source datasets from configured connectors
- When I navigate the model setup flow
- Then no Entity Mapping step appears
- And the model inherits `fq_entity` tagging from the source datasets' connector-level (or override) entity-mapping configs

**AC-EM1-07 — Save behavior: warn-and-allow override**
- Given a connector has source datasets without entity-mapping config (neither connector-level default nor override)
- When the admin attempts to save the connector
- Then a warning surfaces ("This connector has source datasets with no entity tagging — records will land with `fq_entity = NULL`")
- And the admin can proceed with save (per AK decision 2026-05-20 — warn-and-allow, not hard block)

---

### EM2-LC — Model view shows entity scope (derived) with edit click-through

**User Story:** As an admin viewing a model, I want to see what entities the model's data is tagged with and quickly jump to the source dataset or connector if I need to edit the entity-mapping config — without having to navigate the connector setup from scratch.

**Importance:** Medium

**Details:** The model view shows a **derived, read-only display** of the entity scope of the model's data — i.e., which entities appear in `fq_entity` arrays across the model's source datasets. The display is derived from the connector entity-mapping configs that contribute to the model, updated when new data lands or when the underlying connector configs change.

From the displayed entity scope, the admin can click through to the **source dataset** or **connector** where the entity-mapping config lives, in order to edit. The model view itself does not allow editing entity mapping — this preserves the connector-as-source-of-truth principle and avoids divergent edit surfaces.

**Acceptance Criteria:**

**AC-EM2-01 — Derived entity scope visible in model view**
- Given a model is in production with `fq_entity` tagging on its records (i.e., its connectors are configured and data has been ingested)
- When I view the model
- Then I see a list of entities the model's data is tagged with (e.g., "US, UK, CA, +8 more")

**AC-EM2-02 — Click-through to source dataset / connector for edit**
- Given the model view shows an entity scope
- When I want to edit the entity-mapping config for any source contributing to that scope
- Then I can click through to the source dataset (and from there to the connector) where the config lives

**AC-EM2-03 — Read-only in model view context**
- Given I am in the model view
- When I inspect the displayed entity scope
- Then I cannot edit the configuration from within the model view
- And the display is clearly marked as read-only / derived

**AC-EM2-04 — Empty / NULL entity scope display states**
- Given a model has records with `fq_entity = NULL` (no entity mapping configured for one or more sources)
- When the model view loads
- Then the scope display indicates "Some records have no entity tagging" with a link to the offending source dataset(s)
- Given a model has records with `fq_entity = []` (explicitly empty / shared / global)
- Then the scope display indicates "Applies to all entities" for those records

---

### EM3-LC — Pattern support for entity encoding

**User Story:** As an admin configuring a connector (or a source-dataset override), I want to choose from the set of supported entity-encoding patterns so that my source's actual entity structure is correctly captured and produces the right `fq_entity` tagging on every record.

**Importance:** High

**Details:**

Data Studio supports eleven patterns for how a source can encode entity information — this requirement (EM3) covers the ten detection-taxonomy patterns (1–10); Pattern 11 is specified separately in EM11 (see below). **Each pattern's configuration lives at the connector / source-data layer (per EM1), NOT at the model / field-mapping layer.** This architectural distinction matters:

- **Entity mapping** is about how the source *encodes* entity (input shape) — handled by this PRD at the connector/source-data layer.
- **Field mapping** is about how source columns transform into FQ canonical columns (output shape) — handled by Mapping Expressions v2 at the model layer.

Patterns that involve restructuring source data (pivot for 7/8, substring extraction for 9) execute at the source-data layer *before* the data reaches field mapping. They are NOT field-mapping functions.

**The eleven patterns at a glance:** see the **The Eleven Patterns at a Glance** section near the top of the PRD for the summary table (# · name · tier · encoding location). The V1 support tiers and per-pattern behavior for patterns 1–10 follow — all ten are runtime-detected or admin-selectable, per EM5. **Pattern 11 (Entity via Reference Table) is specified separately in EM11-LC** and is architecturally different from patterns 1–10: it's defined once per Direct Integration (see Definitions), not detected or configured per customer.

**V1 support tiers:**

| Tier | Patterns | Behavior |
|---|---|---|
| **Core — auto-detected + manual selectable** | 1 (Shared/Global), 2 (Entity Column), 3 (Entity per Sheet), 4 (Entity per File), 7 (Entity-Tagged Columns), 8 (Repeated Column Blocks), 9 (Entity in Value Substring) | System proposes via detection. Admin can also pick from the list. Full UI sub-flow per pattern. Patterns 7 and 8 include a wide-to-long pivot at the source-data layer (see AC-EM3-08, AC-EM3-09). Pattern 9 includes a value-substring extraction at the source-data layer (see AC-EM3-10) — closely related to pattern 2, but with extraction logic applied to each cell value. |
| **Core — picker-selectable + fallback recommendation** | 10 (Connector-Level Assignment) | Not auto-detected as a positive signal — there is nothing in source content to recognize, only the *absence* of patterns 1–9. Admin reaches Pattern 10 via (a) the pattern picker at any layered-fallback tier, or (b) Flow C / Flow D's short-circuit when sample inspection finds no entity dimension in source content. Lives in the same DETECT → CONFIRM → SIDE-BY-SIDE → MANUAL sequence as the auto-detected patterns to keep one consistent user experience (per OQ-1, closed 2026-05-28). |
| **Escape-hatch — manual-only** | 6 (Multiple Regions) | Admin must explicitly select; no auto-detection. Configured via interactive selection in the layered fallback's "Manual" tier (see EM5). Bryan Rodriguez flagged as less common. |
| **Flagged risky — supported with warning** | 5 (Entity per Row Range) | Supported but the UI surfaces a fragility warning that the admin must acknowledge. Bryan Rodriguez flagged as less common. |

Pattern selection lives in connector setup (per EM1). The connector-level default applies to all source datasets unless a source-dataset-level override is set. Pattern type can be changed via the connector's edit + save flow; the saved change carries an `entity_start_time` that drives forward-only vs backfill behavior (per EM7).

**Frequency note:** The most common encodings in practice are Pattern 2 (entity column), Pattern 3 (entity per sheet — a frequent customer request, not supported today), Pattern 9 (entity in value substring), and multi-entity files (Pattern 4 tagging several entities across the dataset). Pattern 1 (no entity) is the *least* common — the "no entity" path is for shared / dimensional data only, not the default case.

**Acceptance Criteria:**

**AC-EM3-01 — Pattern picker exists with all eight Core patterns**
- Given I am in the entity-mapping section of connector setup (or a source-dataset override)
- When I view the configuration options
- Then I can pick from the eight Core patterns: 1 (Shared / Global), 2 (Entity Column), 3 (Entity per Sheet), 4 (Entity per File), 7 (Entity-Tagged Columns), 8 (Repeated Column Blocks), 9 (Entity in Value Substring), 10 (Connector-Level Assignment)
- And pattern 5 (Entity per Row Range) and pattern 6 (Multiple Regions) are also pickable, with 5 surfacing a fragility warning and 6 accessible only via the layered fallback's Manual tier (per EM5)
- And the system's detection proposal (per AC-EM1-04) maps to one of the Core patterns when confidence is high

**AC-EM3-02 — Pattern 1 (Shared / Global) — No entity in the source**
- Given the admin selects pattern 1 (Shared / Global) or the system proposes it for a source with no detectable entity encoding
- When the admin confirms
- Then `fq_entity` is set to empty array `[]` on every record produced by that scope
- And no further configuration is required (one-click confirmation)
- And the source is treated as "shared / global" — applies to all entities (e.g., reference data, chart of accounts)

**AC-EM3-03 — Pattern 2 (Entity Column)**
- Given the admin selects pattern 2 (Entity Column) or the system detects an entity-bearing column
- When the admin confirms the column
- Then `fq_entity` is populated at ingestion from the values in the picked column(s)
- And the admin walks through **source-value → FQ-entity mapping** (per EM4) for any source values that don't match an FQ entity name exactly
- And **multi-value cells are supported** — cells containing multiple entity identifiers (e.g., `"US,UK"`) tag the record with all listed entities (subject to OQ-10 — parsing convention)
- And 1-to-many mapping is supported — a single source value can map to multiple FQ entities (per EM4)

**AC-EM3-04 — Pattern 3 (Entity per Sheet)**
- Given the admin selects pattern 3 (Entity per Sheet) or the system detects a multi-sheet file
- When the admin assigns sheets to entities
- Then each sheet maps to one or more FQ entities (multi-select supported — a sheet can be shared by multiple entities)
- And a bulk-assign option is available ("use sheet name as entity") when sheet names match FQ entity names exactly
- And `fq_entity` is populated per-sheet at ingestion — every record from sheet X is tagged with sheet X's assigned entity/entities

**AC-EM3-05 — Pattern 4 (Entity per File) — one file = one or more entities**
- Given the admin selects pattern 4 (Entity per File) or the system detects a single-entity file structure
- When the admin configures, two paths are available:
  - **(a) Explicit file-level entity selector** — admin picks one or more FQ entities; every record from this source is tagged with the selected entities
  - **(b) Filename-pattern auto-extraction** — admin specifies a filename pattern (e.g., `balances_{entity}.xlsx`) and the system extracts the entity identifier from each ingested file's name, mapping to FQ entities via the source-value mapping flow (per EM4)
- And multi-entity is supported — one file can carry multiple entity tags (e.g., a "Combined US + Canada" file)

**AC-EM3-06 — Pattern 5 (Entity per Row Range) — flagged risky**
- Given the admin selects pattern 5 (Entity per Row Range) — e.g., rows 2–102 = entity A, rows 103–210 = entity B
- When the admin attempts to configure
- Then the system surfaces a fragility warning: *"Row references break when rows are added or removed from the source. If possible, restructure the source so entity is encoded in a column or filename instead."*
- And the admin must explicitly acknowledge the warning to proceed
- And the connector setup view marks the source as "Pattern 5 in use — fragile" for ongoing visibility
- And pattern 5 is supported in V1 despite the warning

**AC-EM3-07 — Pattern 6 (Multiple Regions) — escape-hatch, manual-only**
- Given the admin needs to use pattern 6 (Multiple Regions) — multiple distinct table regions within one file, each mapping to a different entity
- When the admin selects "Manual" in the layered fallback (per EM5)
- Then the system does NOT auto-detect or auto-propose pattern 6 — admin enters explicitly
- And the admin manually identifies each region (drag-select on file content preview) and assigns it to one or more entities
- And `fq_entity` is populated per the admin's region configuration at ingestion

**AC-EM3-08 — Pattern 7 (Entity-Tagged Columns) with pre-mapping pivot**
- Given the admin selects pattern 7 (Entity-Tagged Columns) or the system detects entity-specific column names (e.g., `UK_balance`, `US_balance`, `consolidated_balance` alongside shared columns like `account_id`, `period`)
- When the admin confirms the configuration
- Then the admin identifies (a) which columns are entity-specific and (b) the entity each maps to (using source-value → FQ-entity mapping per EM4 where the entity is in the column name)
- And the system performs a **wide-to-long pivot at the source-data layer** before the data reaches field mapping — each input row produces N output rows (one per identified entity), with `fq_entity` set per the column-to-entity mapping and a single value-column carrying the per-entity value
- And shared columns (e.g., `account_id`, `period`) are carried forward to every output row of the pivot
- And the pivot output is what field mapping operates on (so the field-mapping admin sees the long-format schema, not the wide-format source)

**AC-EM3-09 — Pattern 8 (Repeated Column Blocks) with pre-mapping pivot**
- Given the admin selects pattern 8 (Repeated Column Blocks) — e.g., columns A–E are entity A's identical block, columns F–J are entity B's identical block
- When the admin identifies the block structure and assigns each block to one or more entities
- Then the system performs a **wide-to-long pivot at the source-data layer** (same mechanism as pattern 7) before the data reaches field mapping — each input row produces N output rows (one per block), with `fq_entity` set per block and the block's columns mapped to a single set of canonical columns
- And the pivot output is what field mapping operates on

**AC-EM3-10 — Pattern 9 (Entity in Value Substring) with source-data extraction**
- Given the admin selects pattern 9 (Entity in Value Substring) — entity is encoded as a substring within the values of a column (e.g., a column called `account_code` with values like `US-001-Cash`, `UK-002-AR`, where `US` / `UK` is the entity identifier)
- When the admin configures the extraction (pick the source column + specify how to extract the entity from each value — delimiter + position, fixed-position substring, or regex capture group)
- Then the system **extracts the entity substring from each cell value at the source-data layer** and uses it to populate `fq_entity` (one row per record, single-entity tag in the array unless the source column itself supports multi-value cells per pattern 2's logic)
- And the extracted substring is mapped to FQ entities via the source-value → FQ-entity mapping (per EM4) — same flow as pattern 2's value mapping
- And this extraction is NOT a Mapping Expressions v2 REGEXP function — it is an entity-mapping-layer concern at the connector/source-data layer, distinct from field mapping (which operates on the model layer)
- And no wide-to-long pivot is involved — pattern 9 produces one record per source row (unlike patterns 7 and 8). Pattern 9 is functionally close to pattern 2 with an extraction step prepended.

**AC-EM3-11 — Pattern 10 (Connector-Level Assignment)**
- Given the admin selects pattern 10 (Connector-Level Assignment) or the source is connector-level by nature (API, CDC, or SFTP where files don't encode entity)
- When the admin assigns entities to the connector or source dataset
- Then `fq_entity` is populated with the assigned entities for every record from that scope
- And 1-to-many is supported — a connector can serve multiple entities (e.g., a single API key serving a CAS customer's roster)
- And pattern 10 can be used in combination with file-level patterns: the connector-level assignment provides a baseline, and a file-level pattern (e.g., pattern 2) can add additional tags per record

**Scope implication:** Patterns 7 and 8 require a **wide-to-long pivot** capability at the source-data layer; pattern 9 requires **value-substring extraction** (not a pivot — it produces one record per source row, per AC-EM3-10). Both are non-trivial new additions to the source-data layer's responsibilities. Surface to engineering during PRD review; capture in the Gaps section if they warrant explicit eng scoping.

---

### EM4-LC — Source-value → FQ-entity mapping (with 1-to-many fan-out)

**User Story:** As an admin configuring a pattern (2, 4-filename, 7, 8, or 9), I want to map each distinct source value (or extracted substring) to one or more FQ entities so that the entity tagging on records reflects FQ's canonical entity list, even when source data uses different naming.

**Importance:** High

**Details:**

Patterns 2 (Entity Column), 4 (Entity per File with filename auto-extraction), 7 (Entity-Tagged Columns), 8 (Repeated Column Blocks), and 9 (Entity in Value Substring) all produce source-encoded entity identifiers that need to be translated to the FQ entity list. EM4 is the mapping mechanic.

The mapping lives in the connector / source-data layer (per EM1), part of the connector's entity-mapping config. It follows the connector's edit + save flow; saved changes carry an `entity_start_time` that drives forward-only vs backfill behavior (per EM7).

The system enumerates the distinct source values found in the relevant scope, attempts auto-matching to FQ entities, and presents the result for admin review. The admin can:
- Confirm auto-matches (bulk action available)
- Override individual auto-matches
- Set 1-to-many mappings (a single source value can map to multiple FQ entities — e.g., `"NORTH_AMERICA"` → `[US, CA, MX]`)
- Specify a default behavior for unmapped values (both current and new-at-runtime)

**One-to-many is counter-intuitive and easy to design/build out — it must not be treated as an edge case.** *(Called out 2026-07-01, per AK.)* Every source-value mapping picker (per-value in EM4, per-sheet in AC-EM3-04, per-file/connector in AC-EM3-05/AC-EM3-11, and the reference-table values in EM11) must default to a multi-select control, never a single-select dropdown. It's intuitive to assume "one source value = one entity," and single-select is the natural first build — but real source data routinely has values that legitimately belong to more than one entity (a regional rollup code, a shared-services subsidiary, a combined file). If any picker in this PRD ships single-select, the admin has no way to express a real, expected mapping and will either misconfigure or file a bug. This applies uniformly across every value-mapping surface in this PRD, not just AC-EM4-04 in isolation — see Design Question 6.

**Acceptance Criteria:**

**AC-EM4-01 — Distinct source values enumerated**
- Given the admin has selected a pattern that requires source-value mapping (2, 4-filename, 7, 8, 9)
- When the admin enters the source-value mapping step
- Then the system enumerates the distinct source values in the relevant scope (e.g., distinct values in the entity column for pattern 2; distinct filename extractions for pattern 4; distinct value substrings for pattern 9)
- And the count of distinct values is shown ("12 distinct source values found")
- **Note (added 2026-07-01):** for a CDC or Direct API pipeline, "enumerate the distinct source values" assumes the relevant source data has finished its initial load — a sync in progress can under-enumerate and produce a misleadingly small/incomplete list. This surfaced concretely for Pattern 11's reference-data enumeration (see AC-EM11-07) but applies to this AC generally whenever the enumerated scope sits on a CDC/API pipeline, not just Pattern 11. See OQ-24.

**AC-EM4-02 — Auto-match attempt**
- Given the system has enumerated distinct source values
- When the mapping UI loads
- Then the system attempts to auto-match each source value to an FQ entity using:
  - Case-insensitive exact match (e.g., source `"us"` → FQ `"US"`)
  - Alias match (if FQ entities have aliases configured)
- And matched values show the auto-suggested FQ entity for admin confirmation
- And unmatched values are visually flagged for explicit admin attention
- *(Fuzzy match strategy — exact only, or fuzzy with confidence threshold? — see OQ-16)*

**AC-EM4-03 — Admin maps source value → FQ entity (1-to-1)**
- Given the source-value mapping UI shows distinct source values
- When the admin selects an FQ entity from the picker for a source value
- Then the source value is mapped to that FQ entity
- And the mapping is saved to the connector's entity-mapping config

**AC-EM4-04 — 1-to-many fan-out supported**
- Given the admin needs to map a source value to multiple FQ entities (e.g., `"NORTH_AMERICA"` → `[US, CA, MX]`)
- When the admin opens the FQ entity picker for that source value
- Then the picker supports multi-select
- And the source value can be mapped to N FQ entities
- And records with that source value have `fq_entity` populated with all selected entities

**AC-EM4-05 — Bulk confirm for auto-matched values**
- Given the system has auto-matched a set of source values
- When the admin reviews the matches
- Then a bulk-confirm action is available ("Confirm all 8 auto-matched values")
- And individual auto-matches can be overridden before bulk confirm
- And only auto-matches with high confidence are eligible for bulk confirm; low-confidence matches require individual review

**AC-EM4-06 — Default behavior for unmapped values**
- Given some source values remain unmapped after admin review
- When the admin completes the mapping step
- Then the admin specifies the default behavior for unmapped values:
  - **(a) Treat as Shared / Global** — `fq_entity = []` (record applies to all entities)
  - **(b) Leave as NULL** — `fq_entity = NULL` (treated as "not configured" by downstream)
- And this default applies to both the currently-unmapped values AND new values seen at runtime (per AC-EM4-07)
- **Note (per AK 2026-05-20):** A third "Block ingestion" option was considered and rejected as too operationally disruptive. The setup-time gate is implicit — admin sees unmapped values during config and must either explicitly map them or accept the default. At runtime, ingestion continues gracefully per the chosen default + notification (AC-EM4-07). For the CAS scenario where stricter handling is desired, see OQ-17 (CAS connector mode).

**AC-EM4-07 — New source values at runtime**
- Given the mapping has a configured default behavior (per AC-EM4-06)
- When new source data arrives with a value not previously seen during mapping config
- Then the default behavior is applied automatically (Shared/Global or NULL, per AC-EM4-06 — "Block" was considered and rejected)
- And a notification is surfaced to the admin: "N new source values were seen during ingestion that have no explicit FQ entity mapping. Review and confirm."
- And the admin can review the new values via the connector edit flow (which auto-populates with the new values awaiting mapping) — admin enters edit mode, maps the new values, chooses `entity_start_time`, and saves

**AC-EM4-08 — Mapping is part of connector config (save + entity_start_time interaction)**
- Given the source-value mapping is configured
- When the connector is saved
- Then the mapping is part of the connector's entity-mapping configuration (per EM1)
- And the save carries an `entity_start_time` that determines whether changes apply forward-only or trigger backfill (per EM7)
- And mapping changes (e.g., remapping `"PARENT"` from entity A to entity B) that backdate `entity_start_time` trigger the EM7 backfill workflow (diff preview, required reason, audit log)

**AC-EM4-09 — New FQ entity added to workspace → notify connectors with complete coverage** *(per brainstorm 2026-06-01; detection refined 2026-06-02)*
- Given a connector whose entity scope **covered every entity that existed at the time** ("complete coverage") — there is **no stored "all entities" flag**; affected connectors are identified by comparing each connector's mapped set against the full entity list
- When a new entity is later added to the workspace FQ entity list
- Then the admin is notified ("A new entity was added — review your entity mapping") with a direct action that opens the connector's entity step
- And the connector's scope is **not** silently expanded; the admin decides whether the new entity belongs in scope
- *(Open: whether the trigger fires for any new entity or only those added after config, and whether it piggybacks existing entity-list-change events — confirm with Eng/Nikita. CAS workspaces are exempt: a new entity is a new end-client / new connector, so existing connectors are unaffected.)*

---

### EM5-LC — Detect-and-confirm + layered fallback with interactive selection

**User Story:** As an admin configuring entity mapping for any kind of source (file upload, SFTP, Direct API, CDC, push), I want the system to detect the encoding pattern automatically and walk me through confirmation in plain language — with graceful fallbacks when detection fails — so that I can complete entity setup without studying a list of 10 patterns or knowing what shape my source is in.

**Importance:** High

**Details:**

The detect-and-confirm UX is the primary mechanism for entity-mapping configuration, anchored in Greg Jones's 2026-04-17 Design Bar framing: "Extract everything we can from the source, make the best guess, have them confirm." Excel-fluent admins never study a list of 10 patterns — the system proposes, they confirm.

**Source preview is the visual anchor.** "Source preview" means different things by ingestion type but always provides the admin enough context to make decisions while staying in the flow:

| Ingestion type | What's in the source preview |
|---|---|
| File upload / SFTP | Sheets, column headers, first N rows, filename, file structure |
| Direct API | Endpoint schema, column names + types, sample records (if available) |
| CDC (Fivetran) | Table schema (columns + types) from the synced replica, sample records |
| Connector-level only (no source content to parse) | Connector metadata, endpoint list, available entity-assignment options |

**Pattern applicability varies by ingestion type.** Detection only proposes patterns that make sense for the source's shape:

| Pattern | File | API | CDC | Connector-only |
|---|---|---|---|---|
| 1 — Shared / Global | ✓ | ✓ | ✓ | ✓ |
| 2 — Entity Column | ✓ | ✓ | ✓ | — |
| 3 — Entity per Sheet | ✓ | — | — | — |
| 4 — Entity per File | ✓ | — | — | — |
| 5 — Entity per Row Range | ✓ | — | — | — |
| 6 — Multiple Regions | ✓ | — | — | — |
| 7 — Entity-Tagged Columns | ✓ | ✓ | ✓ | — |
| 8 — Repeated Column Blocks | ✓ | ✓ | ✓ | — |
| 9 — Entity in Value Substring | ✓ | ✓ | ✓ | — |
| 10 — Connector-Level Assignment | ✓ | ✓ | ✓ | ✓ |
| 11 — Entity via Reference Table *(added 2026-07-01, broadened 2026-07-01, see EM11)* | ✓¹ | limited¹ | ✓¹ | — |

¹ Pattern 11 doesn't go through runtime detection and isn't gated by ingestion pipeline (File/API/CDC) at all — it's offered only for Direct Integrations with a defined ERD relationship (see Definitions, EM11), regardless of pipeline. The File "✓" means "a Direct Integration whose pipeline happens to be SFTP" (e.g., SAP), not "any file-based source" — it never applies to arbitrary customer uploads or generic API connectors.

When detection runs, the system filters candidate patterns to those that apply to the ingestion type. Pattern 3, for example, only appears as a candidate for file-based sources with multiple sheets. Pattern 11 is the one pattern in this table that bypasses the detect-and-confirm flow entirely — its availability is a static property of the Direct Integration, not something inspected per customer at connector-setup time.

**Layered fallback** (per Greg's framing):

| Layer | When it fires | What the admin sees |
|---|---|---|
| **1. Detect** | On connector setup entry (initial or edit), where source content is available | Invisible — system computes pattern + confidence behind the scenes, scoped to applicable patterns. No content yet (API/CDC pre-sync, or a connector-wide default) → detection skipped, admin lands on manual / connector-level assignment (per AC-EM1-04) |
| **2. Confirm** | High confidence detection | Source preview + proposed pattern in plain-language summary + "Confirm" / "This isn't right" actions |
| **3. Side-by-side** | Medium confidence OR admin clicked "This isn't right" at layer 2 | Source preview on one side, top 2–3 applicable candidate patterns on the other with brief explanations. Admin picks. |
| **4. Manual** | Low confidence, no detection match, OR admin clicked "None of these" at layer 3 | Pattern picker showing only patterns applicable to the ingestion type, with per-pattern help text and example shapes |

**Interactive selection** at the visual layers — admin points at the source content to indicate which pattern applies. The available interactions depend on the source preview shape:

- **File/SFTP sources:** click column / sheet tab / drag region / drag rows / click filename pattern
- **API/CDC sources:** click column from schema view / select from table list / inspect endpoint metadata
- **Connector-level sources:** select entity from FQ list to assign

**Entity picker shape (per brainstorm 2026-06-01).** Wherever the admin selects FQ entities to assign (connector-level / Pattern 10, multi-entity file or sheet patterns), the picker shows **two alphabetical sections, unmapped first**: (1) **Not yet mapped** — entities with no current source, surfaced first because gaps are the priority; (2) **Already mapped to another connector** — selectable, shown with read-only context (e.g., "NetSuite CDC"). Controls: select all · clear all · individual select/unselect. **"Select all" is a snapshot** of the current FQ entity list at config time — there is **no persisted "all entities" flag**; it simply selects all then-current entities individually. Entities added later trigger the AC-EM4-09 notification (which targets connectors with complete coverage, derived by set comparison) rather than auto-expanding the selection. **CAS connectors are single-select only** — no multi-select and no "add another entity" affordance anywhere (UI guard, see OQ-17).

**AI assistance (additive, if engineering capacity allows — see OQ-4):** Greg's framing was that the visual flow and an AI chat should run simultaneously — "as they're clicking through, can they interact with chat and the visual simultaneously?" V1 ships with rule-based detect-and-confirm at minimum; AI chat is an additive enhancement layer that runs *alongside* (not replacing) the visual layers.

**Acceptance Criteria:**

**AC-EM5-01 — Detection runs on connector setup entry (all ingestion types)**
- Given I enter the entity-mapping section of connector setup (initial or edit)
- When the section loads
- Then the system inspects the connector's source(s) based on ingestion type:
  - File / SFTP: parses sheets, headers, first N rows, filename
  - Direct API / CDC: inspects endpoint or table schema (columns + types) + sample records when available
  - Connector-level only: surfaces connector metadata + entity-assignment picker
- And computes a pattern proposal with a confidence indication, scoped to patterns applicable to the ingestion type

**AC-EM5-02 — High-confidence detection → one-click Confirm layer**
- Given detection produces a high-confidence pattern match
- When the entity-mapping section renders
- Then the proposed pattern is shown alongside the source preview with a plain-language summary (e.g., "It looks like each sheet in this file is a different entity. Confirm?")
- And a one-click "Confirm" action is available
- And a "This isn't right" action escalates the admin to the side-by-side layer (AC-EM5-03)

**AC-EM5-03 — Medium confidence (or override) → side-by-side layer**
- Given detection produces a medium-confidence result, OR the admin clicked "This isn't right" at the Confirm layer
- When the side-by-side layer renders
- Then the source preview is shown alongside the top 2–3 candidate patterns *that apply to the ingestion type*
- And each candidate is described in plain language with a brief explanation of why the system thinks it might fit
- And the admin can pick a candidate (one click) or escalate to the Manual layer via "None of these"

**AC-EM5-04 — Low confidence (or escalation) → Manual layer**
- Given detection has low confidence, OR the admin clicked "None of these" at the side-by-side layer
- When the Manual layer renders
- Then the admin sees the pattern picker showing only patterns applicable to the ingestion type (per the applicability table in this PRD)
- And each pattern has help text (plain-language summary + example shape)
- And the source preview remains visible alongside the picker

**AC-EM5-05 — Interactive selection adapts to ingestion type**
- Given the admin is at the Confirm, Side-by-side, or Manual layer
- When the admin interacts with the source preview
- Then the available interactions match the ingestion type:
  - **File / SFTP:** click a column header → mark as entity column (pattern 2 or 9); click a sheet tab → mark as per-sheet (pattern 3); drag-select a region → enter pattern 6 manual config; drag-select rows → enter pattern 5 (with fragility warning per AC-EM3-06); inspect filename → enter pattern 4 filename auto-extraction
  - **Direct API / CDC:** click a column from schema view → mark as entity column (pattern 2 or 9); select endpoint/table from list (for connector-level pattern 10)
  - **Connector-level only:** select entities from the FQ list via picker
- And interactive selections immediately update the proposed configuration on the side

**AC-EM5-06 — Source preview always visible during configuration**
- Given the admin is at any layer of the entity-mapping flow
- When the layer is rendered
- Then the source preview is visible, scoped to the ingestion type (file content, table schema + sample records, or connector metadata)
- And for large sources, the preview shows the first N rows / N columns with an explicit indicator ("Showing 50 of 12,847 rows" or "Showing 10 of 47 columns")

**AC-EM5-07 — Plain-language explanations everywhere**
- Given any pattern is shown to the admin (Confirm, Side-by-side, or Manual layer)
- When the admin reviews
- Then the explanation uses plain language with example shapes — not pattern numbers or technical terms
- And technical terminology (e.g., "pattern 2") is hidden from primary copy but accessible in tooltips for power users

**AC-EM5-08 — AI chat layer (additive, if eng capacity allows — per OQ-4)**
- Given engineering capacity allows V1 AI chat integration (per OQ-4)
- When the admin is at any layer
- Then an AI chat surface is available alongside the visual flow (not replacing it)
- And the admin can describe their source in natural language ("this connector has UK and US data in separate tables") and have AI propose a pattern + config
- And AI proposals follow the same Confirm path as rule-based detection — one-click accept or override
- **V1 fallback:** if AI is not feasible in Q3 (per OQ-4 resolution), the rule-based detect-and-confirm flow ships standalone; AI is added in a later release

---


### EM6-LC — `fq_entity` data model

**User Story:** As an engineer building downstream products that consume Data Studio output (Close, Reporting, Compliance, Consolidation), I want a consistent, well-defined `fq_entity` data model on every model so that I can reliably build features that respect entity scoping — without ambiguity about NULL vs empty array vs populated tags.

**Importance:** High

**Details:**

*Capability contract, not storage prescription (see Assumptions). The shape and semantics below define what downstream products can rely on; storage, indexing, table layout, and serialization are engineering decisions.*

`fq_entity` is the canonical entity tagging field on every Data Studio model. Its data model is defined by this PRD and consumed by downstream products. The data model anchors the entire entity-mapping story — everything else in this PRD produces output that conforms to this schema.

**The schema:**

```
fq_entity:            array<entity>            -- nullable; defaults to NULL when not configured
entity_start_time:    timestamp (on config)    -- the effective start timestamp of the entity-mapping config that produced the tag
```

**Cardinality semantics:**

| Value | Meaning | When it occurs |
|---|---|---|
| `NULL` | "Not yet configured / unknown" | Entity mapping not configured for the source dataset (or default behavior is "Leave as NULL" per AC-EM4-06) |
| `[]` (empty array) | "Explicitly Shared / Global" (pattern 1) — interpretation flagged for engineering review (see AC-EM6-02) | Pattern 1 (Shared / Global) or default behavior is "Treat as Shared / Global" per AC-EM4-06 |
| `[entity_A]` | Single-entity tag | Most common case — record belongs to one entity |
| `[entity_A, entity_B, ...]` | Multi-entity tag | Record belongs to multiple entities (shared services allocation rows, parent + subsidiaries, multi-region rows, etc.). **Not applicable to CAS customers** — CAS records are always single-entity per the CAS clarification in Objective and OQ-17. |

**Acceptance Criteria:**

**AC-EM6-01 — `fq_entity` present on every model**
- Given a Data Studio model exists
- When the model schema is inspected
- Then `fq_entity` is a defined field on the model's output schema
- And the field is present whether or not entity mapping has been configured on its source(s)
- And the field type is `array<entity>` where `entity` is an enum member of the FQ entity list

**AC-EM6-02 — NULL is distinct from empty array** *(flagged for engineering review — per AK 2026-05-20)*
- Given a record in a model
- When `fq_entity` is queried
- Then NULL and empty array `[]` are distinct values with distinct semantics:
  - NULL → "this record has no entity mapping configured; do not assume scope"
  - `[]` → "explicit Shared / Global — pattern 1 was selected by the admin"
- And the API / query layer preserves the distinction (does NOT coerce empty array to NULL or vice versa)
- **The downstream meaning of `[]`** — "applies to all entities" (a) vs "no specific scope, queryable only by explicit ask" (b) — is an Eng-led decision with significant query-path implications. Full framing, the two interpretations, and the future-state caveat live in **OQ-18** (not duplicated here).

**AC-EM6-03 — Multi-tag arrays preserve all entities**
- Given an entity-mapping config produces multi-entity tagging for a record (e.g., pattern 2 with a multi-value source cell, or pattern 4 with multi-entity file)
- When the record is ingested
- Then `fq_entity` contains all assigned entities as distinct array elements
- And downstream queries can find the record by any of its tagged entities (e.g., "show all records where `entity_A` is in `fq_entity`" returns this record)
- And array element order is not semantically meaningful (sets, not sequences)

**AC-EM6-04 — `entity_start_time` is a config-level field**
- Given an entity-mapping config is saved on a connector
- When the config is persisted
- Then it carries an `entity_start_time` field (timestamp) indicating when the config becomes effective
- And `entity_start_time` is stored on the **config** (not on each tagged record — confirmed AK 2026-05-20)
- And `entity_start_time` is a **timestamp** (time-level precision), not a date
- And changing `entity_start_time` to a past value when saving triggers the backfill workflow (per EM7)

**AC-EM6-05 — Historical configs preserved**
- Given a connector's entity-mapping config has been changed (saved) one or more times
- When the system reconstructs the entity-mapping history
- Then each saved config version is preserved with its `entity_start_time`
- And for audit, the system can answer "what config was effective for records ingested on date X?" by finding the config with the latest `entity_start_time` ≤ X
- And historical config versions are not editable (only the current Active config can be edited; saves create new versions, not in-place updates)

**AC-EM6-06 — Downstream queryability**
- Given a model in production with records tagged with `fq_entity`
- When a downstream product queries the model
- Then the following query patterns are efficient (indexed or otherwise optimized):
  - "Records where `entity_A` is in `fq_entity`" — find records belonging to entity_A
  - "Records where `fq_entity IS NULL`" — find records with no entity mapping (e.g., for surfacing data-quality issues)
  - "Records where `fq_entity = []`" — find Shared / Global records explicitly
  - "Records where any of `[entity_A, entity_B, ...]` are in `fq_entity`" — find records belonging to any of a set
  - "Records where `array_length(fq_entity) > 1`" — find multi-tagged records (useful for CAS auditing)
- And these query patterns are the API contract that Close / Reporting / CAS-client views rely on

**AC-EM6-07 — Schema compatibility on FQ entity list changes** *(detail behavior pending OQ-11)*
- Given the FQ entity list changes at the workspace level (entity added, renamed, or archived)
- When existing records have `fq_entity` containing the affected entity
- Then the schema must support graceful handling:
  - **Added entity:** no effect on existing records
  - **Renamed entity:** the underlying entity ID is preserved; only the display name changes. Records retain their tag.
  - **Archived entity:** existing tags pointing to the archived entity remain valid (records are tagged historically); new records' tag assignments cannot include archived entities
- *(Detailed behavior is OQ-11 — see Open Questions)*

---

### EM7-LC — Live-data backfill via `entity_start_time`

**User Story:** As an admin who needs to correct entity mapping on data that's already been ingested, I want to control whether changes apply forward-only or retroactively (via backfill), with a clear preview of the impact and an audit trail of the change — so that I can fix mistakes safely, especially in CAS multi-client contexts where wrong tagging has compliance implications.

**Importance:** High

**Details:**

This requirement formalizes the live-data backfill mechanics summarized in Scope into ACs. The mechanism is `entity_start_time` (timestamp) on the saved config: setting it in the past triggers backfill of records ingested since that timestamp; leaving it at the default (current time) is forward-only.

**Four scenarios this handles:**

| Scenario | What's happening | Backfill considerations |
|---|---|---|
| **A — Initial config** | Connector setup; clean state; no production data yet | No backfill consideration. `entity_start_time` defaults to save time. |
| **B — Post-launch reconfigure** | Connector is live in production; admin is changing config (e.g., wrong-client correction, source remapping) | Full safety controls: diff preview, required reason, destructive gate. Default forward-only. |
| **C — Post-launch first-time config** | Connector has been ingesting with `fq_entity = NULL`; admin now wants to add entity mapping | Same as B — full safety controls. Backfill is opt-in via past `entity_start_time`. |
| **D — Client In Implementation** | Connector may be Active and ingesting test data, but no production downstream consumers yet | Lighter friction — see the resolved threshold below. Same underlying rule as Scenario A, just potentially spanning a longer period of iteration. |

**What actually determines destructive treatment (resolved 2026-07-01, closes OQ-19 + OQ-20, per AK):** Scenarios A–D are useful narrative descriptions, but the mechanical trigger for "is this destructive" is a single rule, evaluated **per model / source dataset, not per connector**: a model/source dataset is treated as "in implementation" (Scenario A/D territory — lighter friction, no destructive gate) until **both** (a) a model has been published that's tied to that source dataset, **and** (b) that published model has had data actually processed through the pipeline. Ingesting test data into a source dataset alone doesn't cross the threshold if no model consumes it yet; publishing a model with no data processed yet doesn't cross it either. Only once both are true does that model's records fall under Scenario B/C's full safety controls.

**Mixed case:** a single entity-mapping save can affect multiple models (per AC-EM7-02's per-model breakdown), some past the threshold and some not. If **any** affected model has crossed the threshold, the save escalates to the destructive-confirmation gate overall — but the diff preview and warning copy scope the destructive call-out to only the model(s) that actually crossed it (e.g., "Model X is live with data flowing and will lose 12 record tags. Model Y hasn't been published yet and is unaffected."), rather than implying every affected model is at risk.

**V1 safety controls (apply once a model/source dataset crosses the threshold above):**
1. Diff preview before save (AC-EM7-02)
2. Required reason field (AC-EM7-03)
3. Destructive confirmation gate (AC-EM7-04)
4. Audit log (AC-EM7-06)

Future elevated-permission UX is deferred per AK 2026-05-20.

**Acceptance Criteria:**

**AC-EM7-01 — `entity_start_time` chosen at save time**
- Given the admin is saving an entity-mapping config change (initial or edit) on a connector
- When the save form renders
- Then the admin can choose `entity_start_time`:
  - **Default = current time** — forward-only behavior; only affects future ingestion
  - **Past timestamp** — triggers backfill of records ingested since that timestamp
- And the chosen `entity_start_time` is persisted on the saved config
- And `entity_start_time` is timestamp-precision (time-level, not date-level)

**AC-EM7-02 — Diff preview before save (when backfill would trigger)**
- Given the admin has chosen a backfill-triggering `entity_start_time` (past timestamp) for the new config
- When the admin reviews the save
- Then the system renders a diff preview showing:
  - Total count of records that will be re-tagged
  - Split into additive vs destructive (records that lose a tag)
  - **Per-model breakdown** — which downstream models contain affected records and how many each, with each model's status against the destructive threshold (published + data processed, per the resolved rule above) — since one connector can feed multiple models, both the blast radius and which models are actually at risk need to be visible
  - Per-entity breakdown of tag changes (e.g., "12 records will have entity_A removed; 12 records will have entity_B added")
- And the diff preview is displayed before the admin commits the save

**AC-EM7-03 — Required reason field on entity-mapping changes**
- Given the admin is saving an entity-mapping config change affecting at least one model/source dataset that has crossed the destructive threshold (published + data processed, per the resolved rule above)
- When the admin reaches the save step
- Then a reason field is presented and is required (cannot be empty)
- And the reason is captured in the audit log per AC-EM7-06
- And this applies to **every** entity-mapping save once that threshold is crossed for any affected model — additive or destructive (per AK decision 2026-05-20)

**AC-EM7-04 — Destructive confirmation gate**
- Given a save would result in one or more records losing entity tags (destructive backfill — only possible when `entity_start_time` is backdated)
- When the admin reaches the save step
- Then the system displays a destructive-change confirmation gate that is visually distinct from a normal save: "This is a destructive change. N records will lose entity tags. Affected entity views (entity_A, entity_B) will no longer see these records."
- And the admin must complete a type-to-confirm action (type `BACKFILL`) to proceed — not a single-click acknowledgment (consistent with Flow B and Design question 8)
- And the audit log entry is marked as destructive

**AC-EM7-05 — Replace semantics on backfill**
- Given a backfill is triggered (saved config has `entity_start_time` in the past)
- When the backfill executes
- Then the new config is applied with **replace semantics**: `fq_entity` arrays on affected records are rewritten wholesale, not appended
- And records whose new tag set is empty under the new config will have `fq_entity = []` or `NULL` depending on the default behavior in AC-EM4-06
- And the previous tag values are preserved in the audit log per AC-EM7-06 but are NOT preserved on the records themselves

**AC-EM7-06 — Audit log per save**
- Given the admin saves an entity-mapping config change
- When the save completes (whether or not backfill ran)
- Then an audit log entry is created with the following fields:
  - Connector ID
  - New config version reference
  - `entity_start_time`
  - Admin user
  - Timestamp (of the save action)
  - Reason text (from AC-EM7-03)
  - Additive / destructive flag
  - Count of records affected (if backfill ran)
  - Per-model breakdown of affected records (if backfill ran)
  - Pointer to the prior config version for tag-set reconstruction
- And the audit log is queryable for compliance / forensics

**AC-EM7-07 — Historical configs preserved**
- Given a connector has had multiple entity-mapping config versions over time
- When the system reconstructs entity tagging history
- Then each saved config is preserved with its `entity_start_time` (per AC-EM6-05)
- And the system can reconstruct "what config was effective for records ingested between timestamp X and timestamp Y" by finding the chain of configs whose `entity_start_time` brackets that range

**AC-EM7-08 — Backfill operation observability**
- Given a backfill is running
- When the admin monitors the operation
- Then the system shows progress (records processed / total)
- And the admin receives a notification when backfill completes (success or failure)
- And backfill failures provide actionable detail (which records failed, why) so the admin can re-run or correct

**AC-EM7-09 — Source re-pull vs in-place re-tag (connector-dependent)** *(see OQ-8)*
- Given a backfill is triggered
- When the backfill executes
- Then the mechanism varies by connector type:
  - **CDC / Direct API connectors:** backfill may re-pull from source and re-ingest (source data is still available)
  - **SFTP / manual upload connectors:** backfill operates in-place on already-stored records (source files may not be retained)
- *(Detailed behavior — does in-place re-tag always work, or are some pattern types backfill-incompatible without source re-pull? See OQ-8.)*

**AC-EM7-10 — Downstream notification on destructive backfill** *(see OQ-9)*
- Given a destructive backfill has completed
- When affected entity views (Close, Reporting, CAS-client) are next accessed
- Then a "data correction occurred" signal is presented to those views
- *(V1 vs V2 scope of downstream notification + exact mechanism — banner, email, eventing — is OQ-9)*

**AC-EM7-11 — Permission model (V1)**
- Given the admin is configuring or editing an entity-mapping config on a connector
- When the admin attempts to save a backfill-triggering change (additive or destructive)
- Then the permission required to save is the same as the permission required to edit the connector
- And the V1 safety controls are: diff preview (AC-EM7-02) + required reason (AC-EM7-03) + destructive confirmation gate (AC-EM7-04) + audit log (AC-EM7-06)
- And future releases may add elevated-permission gates for destructive backfill (per AK decision 2026-05-20 — explicit deferral; V1 ships without elevated permissions)

**AC-EM7-12 — Scenario D (Client In Implementation) defaults** *(resolved 2026-07-01 — closes OQ-19 + OQ-20)*
- Given a model/source dataset has **not** crossed the destructive threshold — no model has been published against it, or a model is published but no data has been processed through the pipeline for it
- When the admin makes entity-mapping config changes affecting that model/source dataset
- Then the save skips the full Scenario B/C safety controls (no destructive gate, no required-reason requirement) for that model's/source dataset's records — the workflow is the same as Scenario A's
- And this holds regardless of how long the connector has been Active or how much test data has been ingested into the source dataset itself — what matters is whether a model has been published against it and processed data, not elapsed time or connector state
- And the moment a model/source dataset crosses the threshold (first publish + first pipeline run), subsequent entity-mapping changes affecting it are evaluated under Scenario B/C (per AC-EM7-13 for the mixed case)

**AC-EM7-13 — Mixed-scenario saves scope the destructive warning to the affected model(s)**
- Given a single entity-mapping config change affects multiple models/source datasets, some of which have crossed the destructive threshold and some of which have not
- When the admin reviews the save
- Then the system escalates the save to the destructive-confirmation gate (AC-EM7-04) if **any** affected model/source dataset has crossed the threshold
- And the diff preview and warning copy identify **which specific model(s)** triggered the destructive treatment (e.g., "Model X is live with data flowing and will lose 12 record tags") and which affected model(s) are unaffected because they haven't crossed the threshold (e.g., "Model Y hasn't been published yet")
- And the admin is not led to believe every affected model is at risk when only some are

---

### EM8-LC — Completeness warning at save time

**User Story:** As an admin saving a connector that's missing entity-mapping configuration (or where the config would produce `fq_entity = NULL` on ingestion), I want a clear, actionable warning so I can complete the setup deliberately rather than discovering data-quality issues downstream.

**Importance:** Medium

**Details:**

Two situations trigger the completeness warning at connector save time (per AC-EM1-07 — warn-and-allow override):

1. **No entity-mapping config** — one or more source datasets in the connector have no entity-mapping defined (neither connector-level default nor source-dataset override)
2. **Config would produce NULL `fq_entity`** — the entity-mapping is configured but its parameters would result in NULL tagging on ingestion. Examples:
   - Entity Column pattern selected, but no source-value → FQ-entity mappings configured AND default behavior is "Leave as NULL" (per AC-EM4-06)
   - Entity per File pattern with filename auto-extraction, but no filename pattern matches the ingested files
   - Connector-Level Assignment pattern with no entity assigned to the connector

**Warning is non-blocking** (warn-and-allow per AK 2026-05-20) — admin can choose to save and accept that records will land with `fq_entity = NULL`. This is intentional: there are legitimate use cases (e.g., admin is mid-iteration during implementation) where the admin knows the data won't be consumed yet.

**Schema-change validation is out of scope** — when a source's columns change (entity column added / removed / renamed), the entity-mapping config may break. The schema-change re-validation behavior is covered by the **separate schema-versioning PRD** per AK 2026-05-20. EM8 surfaces the completeness warning only; schema-change runtime handling lives in that other PRD.

**Completeness enforcement scope (V1):** EM8 commits to **save-time warnings** at the **source-dataset granularity** (the warning names the affected source datasets). Ingestion-time signal — surfacing a post-run count of records that landed with NULL `fq_entity` — is **deferred to V2** (per OQ-2, closed 2026-05-28). Rationale: save-time warning + warn-and-allow override gives the admin the moment of choice; if records do land NULL, downstream consumers (Close, Reporting, CAS) will surface their own consumption-time gaps. V1 doesn't add a new ingestion-time surface for the same signal. See Future Considerations.

**User-facing copy uses pattern names, not numbers** — per AC-EM3-07's plain-language principle, warning copy references patterns by name (e.g., "Entity Column," "Entity per File") rather than pattern numbers.

**Acceptance Criteria:**

**AC-EM8-01 — Save-time warning when connector has incomplete entity-mapping**
- Given the admin attempts to save a connector
- When one or more source datasets in the connector have no entity-mapping configured (neither connector-level default nor source-dataset override)
- Then the system displays a save-time warning identifying the affected source datasets by name
- And the warning is non-blocking — admin can proceed via a "Save anyway" action
- And if the admin proceeds, records from the unconfigured source datasets ingest with `fq_entity = NULL`

**AC-EM8-02 — Save-time warning when config would produce NULL `fq_entity`**
- Given the admin attempts to save a connector with entity-mapping configured
- When the config parameters would result in `fq_entity = NULL` on ingestion (no source-value mappings, no entity assigned to a Connector-Level Assignment, no filename pattern match, etc.)
- Then the system displays a save-time warning specific to the failure mode — using pattern names (not numbers) per AC-EM3-07. Examples:
  - *"Source dataset `X` uses the Entity Column pattern but no source values are mapped to FQ entities. Records will land with no entity assigned."*
  - *"Connector uses the Connector-Level Assignment pattern but no entities have been assigned. Records will land with no entity assigned."*
  - *"Source dataset `X` uses the Entity per File pattern with filename auto-extraction, but the configured filename pattern doesn't match any ingested files."*
- And the warning is non-blocking

**AC-EM8-03 — Warning text is specific and actionable**
- Given a completeness warning is shown
- When the admin reads the warning
- Then the warning identifies:
  - The specific source dataset(s) affected by name
  - The specific reason in plain language (no source-value mappings / no entity assigned / no filename match / etc.)
  - The downstream consequence ("records will land with no entity assigned" — note: user-facing copy avoids the technical phrase "`fq_entity = NULL`")
  - The next step (admin can configure entity mapping for this source, OR proceed with "Save anyway")
- And the warning avoids generic language like "configuration incomplete"

**AC-EM8-04 — Warning is non-blocking (warn-and-allow override)**
- Given a completeness warning is shown
- When the admin chooses to proceed
- Then a "Save anyway" action is available
- And the save completes with the incomplete entity-mapping config persisted
- And the connector's effective config still produces `fq_entity = NULL` for affected records on ingestion
- *(Future consideration — V2 ingestion-time signal surfacing post-run count of NULL `fq_entity` records on connector status / model view — see Future Considerations.)*

**AC-EM8-05 — Schema-change re-validation cross-ref**
- Given a source's schema changes (column added / removed / renamed) in a way that affects the entity-mapping config
- When the change is detected
- Then the behavior is defined in the **separate schema-versioning PRD** (per AK 2026-05-20) — out of scope for this PRD
- And from this PRD's side, the entity-mapping config either continues working (column still present) or surfaces a completeness warning on next save (column missing — same warning shape as AC-EM8-01 / AC-EM8-02)

---

### EM9-LC — Advanced options affordance for power users

**User Story:** As a power user (ATC running an implementation, experienced implementation partner, or experienced admin familiar with the source data), I want a way to bypass the detect-and-confirm pacing and operate on raw configuration inputs directly so I can set up entity mapping faster than the guided flow allows.

**Importance:** Medium

**Details:**

The guided flow in EM5 (DETECT → CONFIRM → SIDE-BY-SIDE → MANUAL) serves Excel-fluent admins. Power users — ATCs running implementations, experienced implementation partners, and experienced admins familiar with the source data — have different needs: speed over guidance, direct control over raw inputs (ranges, regex, mapping lists), and the ability to skip steps they don't need.

V1 does not build a separate "advanced mode" interface. Instead, an **"Advanced options" affordance** lives inside the same flow as an opt-in toggle. **The toggle is available to every user — no role or permission gating.** Defaulting to off keeps the guided flow as the primary experience for Excel-fluent admins; users who benefit from the advanced controls (ATCs, partners, experienced admins) opt in once and the preference persists.

**V1 advanced affordances:**

1. **Pattern picker shortcut** — open the full pattern picker (all 10 detection-taxonomy patterns¹) directly without waiting through DETECT → CONFIRM → SIDE-BY-SIDE. Useful when the admin already knows which pattern applies.
   - ¹ Pattern 11 is intentionally not in this picker — it's Direct-Integration-defined (per EM11), never admin-selected, so there's nothing for the advanced toggle to shortcut to.
2. **Raw range entry for Pattern 5 (Entity per Row Range)** — type a row range (e.g., `A2:A11`) directly as an alternative to click-and-drag selection.
3. **Raw regex entry for Pattern 9 (Entity in Value Substring)** — type a regex capture group directly as an alternative to the delimiter + position / fixed-position substring picker (see AC-EM3-10).
4. **Filename regex for Pattern 4 (Entity per File)** — type a filename pattern directly as an alternative to the guided filename pattern builder.
5. **Bulk source-value → FQ-entity mapping import** — paste a two-column list or upload a CSV or Excel mapping file in lieu of reviewing source values one at a time. Also serves the high-cardinality source-value UX (cross-ref OQ-15).

**Default state:** Off. Toggle persists **per user** (not per connector, not per workspace) — a power user enables it once and gets advanced controls across all subsequent sessions and connectors. Other users in the workspace are not affected.

**Where the toggle lives:** Visible in the entity-mapping section of connector setup. Exact UI placement is a design question (see User Interaction & Design key design questions).

**Terminology:** the label "Advanced options" is provisional. Final UI copy is locked under OQ-13. Avoid "Expert mode" / "Power user mode" framings that could feel exclusionary.

**Not in V1 (deferred to V2 — see Future Considerations):**
- Multi-connector bulk apply (apply the same entity-mapping config to N connectors at once)
- Raw config object editor (view / edit the underlying entity-mapping config as JSON or structured form)
- Saved "config templates" reusable across connectors

**Acceptance Criteria:**

**AC-EM9-01 — Advanced toggle is opt-in and persists per user**
- Given I am an admin in the entity-mapping section of any connector
- When I locate and enable the "Advanced options" toggle
- Then the advanced controls defined in EM9 V1 affordances become visible
- And my preference persists across sessions and across connectors
- And other users in the workspace are not affected by my toggle state

**AC-EM9-02 — Pattern picker shortcut available when toggle is on**
- Given the Advanced toggle is on
- When I enter the entity-mapping section of a connector
- Then I can open the full pattern picker without going through the DETECT / CONFIRM / SIDE-BY-SIDE tiers
- And the detect-and-confirm proposal still appears (if detection runs successfully), but the picker is available alongside it via a single click

**AC-EM9-03 — Raw entry available for ranges, regex, and filenames**
- Given the Advanced toggle is on
- And I have selected Pattern 4 (Entity per File), Pattern 5 (Entity per Row Range), or Pattern 9 (Entity in Value Substring)
- When I open the pattern's configuration step
- Then I can type a raw range, regex, or filename pattern directly
- And the value is validated against the source data live (preview shows what would match)
- And the guided controls remain available as the alternative for users who turn the toggle back off

**AC-EM9-04 — Bulk source-value mapping via paste / CSV / Excel**
- Given the Advanced toggle is on
- And I am in the source-value → FQ-entity mapping step for any pattern with a mapping list (patterns 2, 4, 7, 8, 9 — per EM4; Pattern 3 sheet assignment is handled in AC-EM3-04, not the source-value flow)
- When I open the bulk-import option
- Then I can paste a two-column list (source value → FQ entity) or upload a CSV or Excel file with the same shape
- And the system validates each FQ entity against the FQ entity list
- And unrecognized FQ entities are flagged for review (not silently dropped)
- And the import result is shown as a previewed mapping batch the admin confirms before saving

**AC-EM9-05 — Toggle does not change downstream config behavior**
- Given two configs are produced — one via the guided flow with the toggle off, one via the advanced flow with the toggle on — that resolve to the same intended entity-mapping logic
- Then the saved configuration is byte-identical in the underlying data model
- And `fq_entity` tagging behavior at ingestion time is identical regardless of which flow produced the config

---

### EM10-LC — Layered pattern composition (Consolidation Entities)

*(Added 2026-07-01.)*

**User Story:** As an admin configuring a connector, I want to layer a whole-dataset entity tag (e.g., a Consolidation Entity) on top of a row-level pattern so that records carry both their leaf entity and any parent entity a downstream query needs to find them by — without hand-authoring a second source or a Mapping Expressions constant.

**Importance:** High

**Details:**

Every other requirement in this PRD (EM1, EM3) frames pattern selection as a single choice per scope — one pattern per connector-level default, one pattern per source-dataset override. That's still the common case. EM10 adds a second, additive layer on top of it for a specific, recurring need: **Consolidation Entities**.

A Consolidation Entity is a regular FQ entity that's been designated, in Consolidation setup, as a parent / FX-translation target for one or more subsidiary entities below it in the entity hierarchy (see Objective). Data Studio has no hierarchy-aware query layer — `fq_entity` is queried by flat array containment (AC-EM6-06). So if Reporting or Close needs "every record that rolls up to Consolidated_NA," and a record is tagged only `[US]`, that query misses it. The record needs to be tagged `[US, Consolidated_NA]`.

**Composition model:** a source's entity configuration is no longer capped at one pattern. It supports:
- **Exactly one row-level pattern** (2, 7, 8, 9, or 11) — determines the leaf entity per record, as today.
- **Zero or more whole-dataset patterns** (1, 3, 4, or 10) — each additionally tags *every* record in the scope with the pattern's assigned entity/entities.

The `fq_entity` written to each record is the **union** of the row-level pattern's result and all layered whole-dataset patterns' results. This generalizes the existing AC-EM3-11 note ("pattern 10 can be used in combination with file-level patterns") from a Pattern-10-specific aside into a first-class, admin-configurable mechanism available to any whole-dataset pattern, and names the primary driving use case (Consolidation Entities) explicitly.

**This is a manual configuration, not hierarchy-derived.** V1 does not read the FQ entity hierarchy to auto-append ancestors — the admin explicitly adds the Consolidation Entity as a second, layered whole-dataset assignment. Whether Data Studio should later auto-derive ancestor tags from the entity hierarchy (removing the need for a second manual pattern) is an open question — see **OQ-23**.

**Not layering by default.** Composition is opt-in per source. A source with only a row-level pattern configured behaves exactly as it does elsewhere in this PRD — single leaf tag, no auto-added layers.

**Acceptance Criteria:**

**AC-EM10-01 — Whole-dataset pattern can be added alongside a row-level pattern**
- Given a source dataset (or connector-level default) has a row-level pattern configured (2, 7, 8, 9, or 11)
- When the admin opens the entity-mapping configuration for that scope
- Then the admin can add one or more whole-dataset patterns (1, 3, 4, or 10) as an additional layer, without replacing the row-level pattern
- And the UI makes clear this is additive ("also tag every record in this source with...") rather than a pattern switch

**AC-EM10-02 — `fq_entity` is the union of all composed patterns**
- Given a source has a row-level pattern and one or more layered whole-dataset patterns configured
- When records are ingested
- Then `fq_entity` on each record contains the leaf entity from the row-level pattern **and** every entity assigned by each layered whole-dataset pattern
- And duplicate entities across layers are deduplicated (a set, not a multiset — consistent with AC-EM6-03)

**AC-EM10-03 — Consolidation Entity is a regular FQ entity, no new type**
- Given the admin wants to layer a Consolidation Entity onto a source
- When the admin configures the whole-dataset layer
- Then the admin picks from the same FQ entity list used everywhere else in entity mapping (per EM5's entity picker) — there is no separate "Consolidation Entity" list or type
- And nothing in the data model (EM6) distinguishes a Consolidation Entity from any other entity — the distinction is functional (Consolidation setup's designation), not structural

**AC-EM10-04 — Composition is opt-in; single-pattern sources are unaffected**
- Given a source has only a row-level (or only a whole-dataset) pattern configured, with no additional layer added
- When records are ingested
- Then `fq_entity` behaves exactly as specified elsewhere in this PRD (EM3) — no implicit layering occurs

**AC-EM10-05 — Layered pattern participates in backfill and completeness checks**
- Given a layered whole-dataset pattern is added to, changed on, or removed from an existing source's configuration
- When the admin saves
- Then the change follows the same `entity_start_time` / diff-preview / backfill mechanics as any other entity-mapping config change (per EM7)
- And the completeness warning (EM8) accounts for records that would land with an incomplete union (e.g., row-level pattern maps successfully but the layered pattern has no entity assigned)

---

### EM11-LC — Pattern 11: Entity via Reference Table (Direct Integrations)

*(Added 2026-07-01; broadened 2026-07-01 per AK to cover Direct Integrations generally, not just CDC.)*

**User Story:** As an admin configuring a Direct Integration connector whose source system encodes entity as a separate reference table or file rather than a column on the fact record, I want to map that reference data's values to FQ entities once and have every fact table/file that references it resolve `fq_entity` automatically — with no need for me to understand or declare the connector's internal data relationships, regardless of whether that Direct Integration is CDC-synced or file-based — so entity tagging works without asking me to do something outside an Excel-fluent admin's skill set.

**Importance:** High

**Details:**

Pattern 2 (Entity Column) assumes the entity identifier is a value on the same row being tagged. That assumption breaks for **Direct Integrations** (see Definitions) where entity lives on a **reference table or file**, not a column on the fact record:
- **NetSuite:** `Subsidiary` (primary key `Subsidiary_ID`, display value `name`) is a synced reference table; fact tables like `Transaction` carry a `Subsidiary_ID` foreign key rather than the subsidiary name or entity code directly.
- **SAP ECC / SAP S/4HANA** (expected Q3, SFTP pipeline): the same structural shape is expected — a company-code-style lookup file delivered alongside transaction files, which transaction records reference by a key.

Resolving `fq_entity` in either case requires a **join/lookup against the reference data**, not a column read — and Pattern 10 (connector-level assignment) can't express it either, since it assigns one fixed entity set to the whole connector rather than varying by record.

**Pattern 11 is a special circumstance, not a generalization of patterns 1–10.** *(Reframed 2026-07-01.)* Patterns 1–10 work on arbitrary, previously-unseen customer shapes, which is why they rely on runtime detection (EM5) or admin-declared structure at the manual layer. A Direct Integration's data relationships are the opposite of arbitrary — every customer on NetSuite (or SAP) has the same ERD, because it's the source system's schema, not the customer's. That relationship is knowable once by FloQast, not something needing per-customer detection or admin declaration. Consequently:
- **The ERD relationship is defined by Eng/Integrations once per Direct Integration**, the same way a Direct Integration's field-mapping recipes and schema already are — not discovered at runtime, not declared by the admin.
- **Pattern 11 is only available for Direct Integrations with a defined ERD relationship** — no runtime-detection path and no admin-facing manual fallback (declaring these relationships isn't a reasonable ask of an Excel-fluent admin). Generic file uploads and non-Direct-Integration API connectors never get it, by definition.
- **The admin's only configuration step is the value mapping** — map the reference data's display values to FQ entities, exactly as EM4 already works. Nothing about tables, files, keys, or joins is ever admin-facing.
- **The resolution mechanism** (materialized join at ingestion vs. computed filter at query time) is an Engineering implementation decision, consistent with this PRD's capability-contract stance (see Assumptions).

**The real risk is ERD ownership and drift, not runtime detection** — which Direct Integrations get a map built, who maintains it, and what happens when the source schema evolves. See Gap #19 and **OQ-22**.

**Composability.** Pattern 11 is a row-level pattern (per EM10) — it can be layered with a whole-dataset pattern (e.g., a Consolidation Entity via Pattern 10) exactly like Pattern 2 can.

**Value-mapping timing for CDC/API-sourced reference data.** *(Added 2026-07-01, per AK.)* For a file-based reference source (an uploaded file), the complete set of distinct reference values is available the moment the file lands — there's nothing to wait for. For a CDC or Direct API pipeline, that's not true: the reference table (e.g., NetSuite's `Subsidiary`) is populated by an **initial sync/historical load that can take time and land incrementally**, the same way fact data does. If the value-mapping step (AC-EM11-02, AC-EM11-03) runs against the reference data before that initial load finishes, the admin sees a partial list of subsidiaries — maps what's visible, then more subsidiaries appear later, requiring rework that AC-EM4-07's "new value at runtime" handling wasn't really designed for (that mechanism assumes genuinely new values appearing during ongoing operation, not values that existed all along but hadn't synced yet). **The intended behavior is to defer the value-mapping step until the reference data's initial load is complete**, so the admin maps against the full, accurate list in one pass — consistent with how API connectors already work elsewhere in this PRD when no sample exists yet (see Assumptions, AC-EM1-04), but distinct from that case: here, sample data exists and is arriving, it's just not complete yet. Whether Data Studio has (or can get) a reliable "initial load complete" signal for a given Direct Integration is unconfirmed — see **OQ-24**.

**Acceptance Criteria:**

**AC-EM11-01 — Pattern 11 availability is defined per Direct Integration, not detected or admin-declared, and independent of pipeline**
- Given a Direct Integration (e.g., NetSuite, or SAP ECC/S4HANA) has a FloQast-defined ERD relationship mapping reference data to one or more fact tables/files (built by Eng/Integrations as part of building that Turn Key integration)
- When an admin configures entity mapping for a connector of that Direct Integration
- Then Pattern 11 (Entity via Reference Table) is offered, with the reference data, key, and dependent fact table(s)/file(s) already resolved from that Direct Integration's ERD definition — none of this is presented to the admin as a choice
- And this holds regardless of which pipeline the Direct Integration rides on (CDC, SFTP, or Direct API)
- And for connectors with no defined ERD relationship — including generic customer file uploads and generic API connectors that aren't a Turn Key Direct Integration — Pattern 11 is not offered; there is no runtime detection path and no admin-facing manual declaration of these relationships as a fallback

**AC-EM11-02 — Display value is the only thing the admin ever sees**
- Given Pattern 11 is active for a connector (per AC-EM11-01)
- When the admin opens the source-value mapping step
- Then the admin sees only the reference data's display values (e.g., `Subsidiary.name`; a SAP company-code description) to map to FQ entities — the underlying key (e.g., `Subsidiary_ID`; a SAP company code) is used internally for the join/lookup and is never surfaced as something the admin configures
- And the underlying mapping is keyed on the key's value internally, so a downstream rename of a display value does not invalidate existing mappings

**AC-EM11-03 — Source-value mapping reused from EM4, including 1-to-many**
- Given the reference data's distinct display values have been enumerated
- When the admin maps them to FQ entities
- Then the same auto-match, 1-to-many fan-out, unmapped-value default, and new-value-at-runtime mechanics from EM4 apply, with the reference data's rows as the enumerated "source values"
- And 1-to-many fan-out is a real, expected case here, not a theoretical one — e.g., a NetSuite `Subsidiary` row named `"Global Shared Services"` may legitimately need to map to multiple FQ entities rather than one, since shared-services subsidiaries commonly serve more than one entity. The value-mapping picker must support multi-select by default (per EM4's callout), not just for edge cases like regional rollup codes.

**AC-EM11-04 — Fact-table/file resolution is automatic across everything the ERD map declares**
- Given a reference-data value mapping (per AC-EM11-02, AC-EM11-03) is configured and saved
- When any fact table or file that the Direct Integration's ERD definition identifies as referencing the reference data's key ingests data
- Then `fq_entity` is resolved automatically for that fact table/file — with no per-table/per-file admin configuration step, because the relationship is already known from that Direct Integration's definition (per AC-EM11-01)

**AC-EM11-05 — A source table/file not yet in the Direct Integration's ERD map is a maintenance gap for that integration, not a per-customer task**
- Given a Direct Integration's schema/file set includes a fact table or file with a key referencing the reference data, but that table/file is not yet included in FloQast's ERD definition for that Direct Integration (e.g., the source system added a new subsidiary-linked table, or a new file section, after the integration was last updated)
- When data from that table/file ingests
- Then `fq_entity` is not resolved for it (it lands per default handling, e.g., NULL, surfaced via EM8's completeness warning)
- And closing this gap is a **maintenance task for Eng/Integrations on that specific Direct Integration** (updating its ERD definition) — **not** an admin-facing configuration action, and not something any individual customer's admin can resolve themselves
- See OQ-22 for Direct Integration ERD ownership and drift-detection process

**AC-EM11-06 — Pattern 11 composes with whole-dataset patterns**
- Given Pattern 11 is active for a fact table (per AC-EM11-01)
- When the admin also layers a whole-dataset pattern (e.g., a Consolidation Entity via Pattern 10) per EM10
- Then `fq_entity` on each fact record is the union of the automatically-resolved reference-table entity and the layered whole-dataset entity/entities

**AC-EM11-07 — Value mapping waits for the reference data's initial load to complete (CDC/API pipelines)** *(added 2026-07-01, per AK; mechanism pending OQ-24)*
- Given Pattern 11 is active for a Direct Integration on a CDC or Direct API pipeline, and the reference table's initial sync/historical load is still in progress
- When the admin reaches the entity-mapping section for that connector
- Then the value-mapping step (AC-EM11-02, AC-EM11-03) does not run against a partial enumeration of the reference data — the admin is shown that reference-data loading is still in progress rather than an incomplete list to map against
- And once the reference data's initial load completes, the system enumerates the full, accurate set of distinct display values for the admin to map in one pass
- And this is distinct from the "no sample yet" case in AC-EM1-04 (nothing to detect against at all) — here, data exists and is arriving; the distinction is completeness, not presence
- *(Whether Data Studio can obtain a reliable "initial load complete" signal per Direct Integration/connector, and what the interim admin-facing state looks like while waiting, is unconfirmed — see OQ-24 and Gap #20.)*

---

## User Flow Reference

The entity-mapping experience is anchored in a layered fallback model (per Greg Jones, Design Bar 2026-04-17): **DETECT → CONFIRM → SIDE-BY-SIDE → MANUAL**. At every step the system tries to start the admin from a confident default and invite correction (per the AI starting-point principle) rather than presenting a blank canvas.

*These flows are illustrative end-to-end walkthroughs. Authoritative behavior lives in the requirements — **EM5** for detection / layered fallback, **EM7** for backfill scenarios. A visual version is in `entity-mapping-flow.html` / `.md`.*

### Flow A — First-time connector setup (file-based ingestion, Excel-fluent admin)

1. **Connector created** — admin establishes the connector (name + type, auth) per existing connector flows. *(This flow assumes sample data has been ingested; for the no-sample path — API/CDC before first sync, or setting a connector-level default — see Flow D.)*
2. **Entity mapping step entered** — with sample data on hand, the system runs detection across the supported patterns (Shared/Global, Entity Column, Entity per Sheet, Entity per File, Wide-to-Long via Entity-Tagged Columns / Repeated Column Blocks, Entity in Value Substring).
3. **System proposes a pattern + a connector-level default** — single confident proposal with a preview ("We think this connector is using the **Entity Column** pattern, where `entity_code` carries the entity. Looks right?"). Pattern numbers are not surfaced — only the named pattern (per AC-EM3-07).
4. **Admin confirms or adjusts.**
   - **Confirm** → connector-level default locks; admin sees source-value mapping (drag-to-map / fuzzy auto-match against FQ entity list).
   - **Adjust pattern** → side-by-side picker shows the alternatives with thumbnails + plain-language descriptions; admin picks; flow continues.
   - **Manual fallback** → if no pattern detects confidently (or the admin rejects all detections), admin enters manual mode: Excel-style interactive cell/column/row selection (per the Excel-fluent persona principle).
5. **Per-source override (optional)** — admin can drill into any source dataset and override the connector-level default for that source. The UI makes clear that overrides exist only where intentionally set; everything else inherits.
6. **Source-value mapping** — for any pattern with a mapping list (Entity Column, Entity per File, Wide-to-Long, Entity in Value Substring — per EM4), admin reviews proposed source-value → FQ entity mappings; corrects or extends. Confirms when complete. (Entity per Sheet assigns sheets to entities directly — AC-EM3-04 — rather than running the source-value flow.)
7. **Save** — admin saves the config. `entity_start_time` is recorded automatically as the moment of save (timestamp, not date — level of precision matters). The save publishes; no separate "Publish" action exists for connectors (this is a Connector concept, not a Model concept).
8. **Forward-only by default** — newly ingested rows from this moment forward carry `fq_entity` per the config. Existing data is untouched unless the admin explicitly opts into backfill (Scenario A initial config typically does not need backfill since there is no production data yet; Scenario C does).

### Flow B — Edit and save an existing connector's entity mapping (post-launch)

The same edit surface drives all post-launch scenarios; the differentiator is which protective gates apply. The four scenarios — **A** (initial, no production data), **B** (reconfigure / wrong-client correction), **C** (first-time config over `fq_entity = NULL` data), **D** (Client In Implementation, lighter friction) — and their full mechanics (diff preview → required reason → destructive type-`BACKFILL` gate → replace semantics → audit log) are specified in **EM7-LC** (scenario table + AC-EM7-01..12). Not re-narrated here.

### Flow C — API / CDC connector setup (non-file ingestion)

Same DETECT → CONFIRM → SIDE-BY-SIDE → MANUAL spine, with the following adaptations:
- Pattern applicability is narrower (file-only patterns — Sheet, Entity per File, Row Range, Multiple Regions, Wide-to-Long patterns — are unavailable on API/CDC sources). The pattern picker hides or grays out non-applicable patterns with a tooltip ("Not applicable for this ingestion type").
- Sample-data detection runs over the most recent API/CDC batch instead of a sample file.
- For API/CDC connectors where no entity dimension exists in the payload at all, the flow short-circuits to connector-level assignment — see **Flow D**.

### Flow D — Connector-level assignment (no content to detect against, or an explicit connector-wide default)

This is the path whenever entity is assigned at the connector level rather than detected from source content. It covers three entry conditions:
- **No sample / source content to detect against** — API/CDC before first sync, or an admin setting a connector-wide default before any data has landed (per the Assumptions clarification). There is nothing to parse, so this is the *entry point*, not a fallback.
- **Connector-wide default (click reduction)** — the admin wants one assignment to apply to all source datasets in the connector (per-source overrides can be added later via drill-down).
- **CAS connectors / single-entity API connectors** — the connector represents one entity by nature.

1. Admin picks (or the system short-circuits to) "assign entities at the connector level."
2. Admin selects **one or more** FQ entities from the two-section picker (per EM5):
   - **Single-entity** (CAS, single-entity API) — one entity; CAS connectors are enforced single-select (OQ-17).
   - **Multi-entity** (one connector serving several entities — e.g., a CAS roster under a single API key, or a connector-wide default that spans entities) — select all that apply; "select all" is a snapshot (per AC-EM4-09), not a dynamic flag.
3. Save. Every record ingested from this connector — across all its source datasets — carries the assigned `fq_entity`, unless a per-source-dataset override narrows it.
4. **CAS-customer flag** (OQ-17) — if the connector is flagged as CAS, single-select is enforced (multi-entity disabled).

### Flow E — High-cardinality source-value mapping

When a source has many distinct entity values (e.g., 500+), the source-value mapping step is paginated with search-and-filter and bulk-import support (OQ-15 still open on the specific affordances). Auto-match runs as a first pass; the admin reviews the matched batch, then handles the remaining "unmatched" set explicitly.

### Flow F — Auditing tagging history (read-only)

A controller or auditor opens the connector's Entity Mapping tab and can view:
- The current config + `entity_start_time`
- Prior configs with their start times (immutable history)
- The most recent backfill events with reason field and operator
- Read-only across the board — edit/save requires connector-edit permission (per AC-EM7-11); elevated permission for destructive backfill is future work.

---

## User Interaction & Design

This section flags design needs for the **detailed design phase** with Natasha Clark and Kristin Johnson (designers), supported by Benjamin Ellis (lead designer). Requirements above describe *what* the experience does; the design phase will define *how* it looks and feels.

### Key design questions to resolve with Natasha + Kristin

1. **L1/L2 navigation surface for entity mapping** — is this a tab on the Connector page? A step in the connector setup wizard that's also editable post-setup? A dedicated section under Connector? The L1 tab is "Connectors"; the entity-mapping surface inside should mirror existing connector-edit affordances. (See OQ-13 on terminology — "Scope" is provisional.)
2. **Detect-and-confirm UI pattern** — what does the "we think it's the Entity Column pattern, looks right?" moment look like? Card + preview + Confirm / Adjust actions? Inline banner? Full-screen onboarding-style step? Aim for a pattern that scales to every detection moment in Data Studio (Mapping Expressions v2 has analogous moments).
3. **Side-by-side pattern picker** — when detection isn't confident or the admin rejects, how are the patterns shown for comparison? Visual thumbnails of the sample data with overlays? Plain-language descriptions only? A mix?
4. **Manual fallback Excel-style selection** — interactive sample-data grid where the admin can click columns, drag row ranges, and select cells. Reference Excel + Google Sheets selection idioms. Critical for the Excel-fluent persona.
5. **Connector-level default vs per-source override** — the connector page should make it obvious which sources inherit and which have overrides, ideally with a single visual scan. Avoid making the admin click into each source to find out. Per OQ-14, the *first-time* phrasing of this choice matters and should not force the admin to pick a config style before they understand the difference.
6. **Multi-entity tagging visualization** — when a record gets `fq_entity = [A, B, C]`, how is that surfaced downstream? In source-value mapping, how does an admin express "this value maps to entities A + B"? Tag chips? Multi-select? Also: the **two-section entity picker** ("Not yet mapped" / "Already mapped to another connector," per brainstorm 2026-06-01) — confirm layout, how the "already mapped" context reads, and the CAS single-select variant. **Hard requirement (per AK, 2026-07-01): every value-mapping picker in this PRD (per-source-value in EM4, per-sheet in AC-EM3-04, per-file/connector in AC-EM3-05/AC-EM3-11, reference-table values in EM11) must default to multi-select, never single-select — 1-to-many is expected, real-world behavior, not an edge case, and should ideally be one reused component rather than per-surface reinvention.** The CAS single-select variant (OQ-17) is the one deliberate, explicitly-flagged exception.
7. **Backfill diff preview** — how is "X records will be retagged, Y entities affected" visualized to be both informative and protective? Should include before/after sample rows.
8. **Destructive-action confirmation gate** — pattern for the "type BACKFILL to confirm" moment. Reused from existing FloQast destructive-action patterns where possible.
9. **Pattern names — copy** — the user-facing names ("Entity Column," "Entity per Sheet," etc.) need a copy pass with the tech writer. Avoid pattern numbers anywhere in the UI per AC-EM3-07.
10. **CAS-connector designation visibility** — if a connector is CAS-flagged, how is that surfaced on the connector page and in the entity-mapping step?
11. **"Advanced options" toggle placement and reveal pattern** — where does the toggle live in the entity-mapping section (top-right utility bar, settings menu, inline next to the pattern picker)? When it's on, do the advanced controls appear inline alongside the guided ones, in a separate panel, or as drawer-style reveals? Toggle state is per-user (AC-EM9-01) — does the UI signal it's a personal preference (avoid implying it changes config for other users)?

### Design system + reference

- **Design system:** FlowUI. Cross-reference the project-level CLAUDE.md `design-system` setting.
- **Deviation check:** before locking the design, review `knowledge/design-system/DEVIATIONS.md` for any flagged gaps relevant to detect-and-confirm patterns, multi-select tagging, and destructive-action gates.
- **Design Bar precedent:** Greg Jones (Design Bar 2026-04-17) framed the layered-fallback approach. Worth re-reviewing the recording / notes during design kickoff.
- **AI starting-point principle:** per Tyler Lu — every AI surface should start from a confident default and invite correction. Apply across detection, suggested mappings, fuzzy auto-match, and the pattern picker.

### Cross-functional design touchpoints

- **Connector status reference** ([Confluence 4564287500](https://floqast.atlassian.net/wiki/spaces/Data/pages/4564287500)) — entity mapping interacts with Draft / Pending / Active / Warning / Error / Auth Expired / Archived states. Design should consider how entity-mapping affordances behave in each state (e.g., is the edit surface available on a Pending or Auth-Expired connector?).
- **Mapping Expressions v2** ([Confluence 4594892801](https://floqast.atlassian.net/wiki/spaces/Data/pages/4594892801)) — `fq_entity` becomes available as a field for downstream mapping expressions. Design coordination so the field shows up naturally in the expression builder.
- **Data Preview + Data Test PRDs** (upcoming Q3) — the entity-mapping result should be inspectable from Data Preview and assertable in Data Test cases.

---

## Future Considerations

- **First-class aggregates / data domains** — Will Emmons (Slack) and RBC (via Sunil's data-domains concept) independently flagged that FQ's data model has no "aggregates" concept and entity has historically done double duty. The V1 `fq_entity` array partially absorbs the multi-tag case but doesn't replace a true aggregates concept (e.g., "this rollup = entities X + Y + Z" as a first-class named asset). **Owned by the Platform team, not Data Platform — explicitly out of scope for this PRD per AK 2026-05-20. Surfaced here for awareness only.**
- **Reporting independence from entity** — Dylan Caldwell's 2026-04-30 framing: if Reporting had a first-class "data source" concept, entity would be optional. Future direction; not Q3.
- **AI-assisted entity detection beyond pattern matching** — chat-guided experience per Greg's framing in the 2026-04-17 Design Bar. Depends on engineering AI capacity (OQ-4).
- **Elevated permission for destructive backfill** — V1 ships with connector-edit permission (per AC-EM7-11). Future release: elevated role (e.g., Data Steward or workspace admin) gates destructive backfill / rerun operations. Per AK 2026-05-20.
- **Downstream notification eventing for data corrections** — formal eventing pipeline for "entity tag changed on records" so Close, Reporting, and CAS-client views can refresh / surface "data updated since last visit" indicators. V1 may ship with banner-only notifications; eventing is a richer future state.
- **Ingestion-time NULL `fq_entity` signal** — post-run surface showing how many records landed with NULL `fq_entity` on the last ingestion (deferred from OQ-2). V1 ships save-time warning only; V2 candidate is either (a) a connector-status indicator surfacing the count on the connector page until acknowledged or resolved, or (b) an entry in the Connector Logs ingestion-event payload (cross-ref Logging & Audit PRD). Decide once V1 production usage shows whether downstream-consumer breakage is sufficient feedback or whether DS-side visibility is needed.
- **Advanced affordances beyond V1's toggle** (extending EM9) — multi-connector bulk apply (apply the same entity-mapping config to N connectors at once), raw config object editor (view / edit the underlying entity-mapping config as JSON or structured form), and saved "config templates" reusable across connectors. Deferred from EM9 V1 scope. Re-evaluate after V1 production usage shows where ATCs and customer power users actually hit ceilings.
- **Stronger Pattern 5 discouragement** (extending AC-EM3-06) — escalation options not taken in V1: (a) remove Pattern 5 from auto-detection so it is only reachable via the explicit picker, (b) active migration prompt on selection that inspects the source and previews Pattern 2 / 4 alternatives, (c) one-time migration banner for existing customers carrying Pattern 5 from today's row-range scope. V1 keeps warn-and-acknowledge as the discouragement (per OQ-6, closed 2026-05-28). Reopen if production usage shows row-reference breakage causing silent data-quality issues at scale.

---

## Open Questions

| #     | Question                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Owner                                | Status                                                                                                                                                                                 |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| OQ-1  | ~~Pattern 10 (connector-level) UX — separate surface or unified with file-level?~~                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | PM + Design                          | **Closed 2026-05-28 — unified flow.** Pattern 10 lives in the same DETECT → CONFIRM → SIDE-BY-SIDE → MANUAL sequence; not auto-detected (no positive signal — only the absence of patterns 1–9). Reached via picker or Flow C/D short-circuit. See EM3 AC-EM3-11. Per AK. **Note (2026-07-01, updated):** Pattern 11 (EM11) does not follow this decision at all — it was initially drafted as detection-based like Pattern 10, but was reframed as a connector-type-defined capability that bypasses the DETECT → CONFIRM → SIDE-BY-SIDE → MANUAL flow entirely (per EM11). It's offered or not offered based on a static property of the connector type, never inspected per customer. No reopening of this OQ needed — Pattern 11 simply sits outside its scope. |
| OQ-2  | ~~Completeness enforcement when `fq_entity` is optional — what triggers a warning? Per-source-dataset, per-connector, at connector save time, at ingestion time?~~                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | PM + Eng                             | **Closed 2026-05-28 — save-time only in V1**, source-dataset granularity, warn-and-allow ("Save anyway"). Two trigger conditions: no config, or config that would produce NULL `fq_entity`. Ingestion-time signal deferred to V2. Locked in EM8; see Future Considerations. Per AK. |
| OQ-3  | ~~Advanced mode for the 15% — needed for V1 or can power users use the same flow?~~                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | PM + Design                          | **Closed 2026-05-28 — "Advanced options" toggle in V1** (opt-in, default off, per-user, available to all). Surfaces pattern-picker shortcut, raw range/regex/filename entry, and bulk mapping import. Scoped in EM9-LC. Per AK. |
| OQ-4  | AI engineering capacity — is the detect+confirm + chat-guided experience buildable in Q3? Need non-AI fallback design?                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | PM + Eng (Nikita)                    | Open                                                                                                                                                                                   |
| OQ-5  | ~~Aggregates / data domains gap — open future PRD or revisit Sunil's rejected idea?~~ | PM + Eng leadership | **Closed 2026-05-20 — out of scope** (Platform team ownership, not Data Platform). See Out of Scope + Future Considerations. |
| OQ-6  | ~~Pattern 5 (row sections per entity) — discourage in UX or support fully? Both AK + RBC flagged as fragile.~~                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | PM                                   | **Closed 2026-05-28 — warn-and-acknowledge is sufficient for V1** (fragility warning + explicit ack + ongoing "fragile" marker, AC-EM3-06). No auto-detect removal / migration prompts / banners in V1. Stronger discouragement options noted in Future Considerations. Per AK. |
| OQ-7  | ~~Multi-entity-per-row (CAS, sub-entity rows) — defer to V2 or address now?~~                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | PM + RBC                             | **Resolved 2026-05-20 — in V1.** Natively supported by `fq_entity` as `array<entity>`. Pattern 2 detection handles multi-value cells; source-value mapping supports 1-to-many fan-out. |
| OQ-8  | Backfill on SFTP / manual upload connectors — does the system always have enough stored context to re-tag in place? Or are some pattern types backfill-incompatible without source re-pull?                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Engineering                          | Open                                                                                                                                                                                   |
| OQ-9  | Downstream notification on destructive backfill — V1 or V2? If V1, what mechanism (banner, email, eventing)? Which downstream products receive the signal?                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | PM + Eng + downstream product owners | Open                                                                                                                                                                                   |
| OQ-10 | Multi-value cell parsing in pattern 2 — does Data Studio parse cell content like `"US,UK,CA"` natively, or does the admin define a delimiter as part of the entity-column config?                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | PM + Eng                             | Open                                                                                                                                                                                   |
| OQ-11 | What happens when the FQ entity list itself changes (new entity added, existing entity renamed/archived) while entity mapping configs reference it? Auto-rebind, surface for confirmation, or break?                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | PM + Eng                             | Open                                                                                                                                                                                   |
| OQ-12 | Empty array vs explicit "all entities" tag — is empty array sufficient to mean "global / applies to all entities," or do we also need a literal "ALL" marker for clarity in downstream products? **Resolves with OQ-18** — if OQ-18 lands on (a) "applies to all," `[]` already carries that semantic and no additional marker is needed; if OQ-18 lands on (b) "no specific scope, explicit query," there is no data-layer "applies to all" concept to need a marker for. Either way, **no additional marker** is the most likely outcome — confirm after OQ-18 resolves. | PM + downstream product owners       | Open (resolves with OQ-18)                                                                                                                                                             |
| OQ-13 | UI/copy terminology — the word "scope" is provisional throughout this PRD (e.g., "entity scope," "Scope section in the PRD itself"). User-facing menu navigation and labels may use a different term ("Entity Coverage," "Entity Mapping," "Entity Tagging," etc.). Lock terminology before design begins.                                                                                                                                                                                                                                                                                                                                                                      | PM + Design + Tech writer            | Open                                                                                                                                                                                   |
| OQ-14 | ~~How does the connector setup flow ask the admin whether to use a connector-level default or per-source-dataset configuration?~~                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | PM + Design                          | **Closed 2026-05-28 — entity assignment always starts at the connector level**; per-source is a drill-down override, never the entry point. Codified in EM1-LC. Per AK + RBC. |
| OQ-15 | High-cardinality source-value UX. When a source has many distinct values (e.g., 500+ distinct entity identifiers), what's the mapping UX? Options: paginated review, search-and-filter, bulk-import via CSV, AI-suggested batch mapping. Defer to design or surface as a Q3 scope decision.                                                                                                                                                                                                                                                                                                                                                                                     | PM + Design                          | Open                                                                                                                                                                                   |
| OQ-16 | Auto-match fuzzy strategy. Beyond case-insensitive exact + alias matching, do we apply fuzzy matching (e.g., "U.S." → "US", "United States Of America" → "United States")? Risk of confident false matches; could surface as suggestions instead of auto-applied. Confirm with engineering on AI/heuristic feasibility.                                                                                                                                                                                                                                                                                                                                                         | PM + Eng                             | Open                                                                                                                                                                                   |
| OQ-17 | CAS-customer handling — per AK (2026-05-20): for CAS customers (accounting service providers), at the connector level, data can only belong to one entity. CAS connectors function differently enough that they may warrant a distinct setup mode. Open questions: (a) Is there a "CAS connector" designation/flag on the connector? (b) Does the designation enforce single-entity tagging (multi-entity disabled)? (c) Does it default to pattern 10 (Connector-Level Assignment)? (d) The setup flow should gate the "next step" if a CAS connector's entity is unspecified — but should NOT block live ingestion (per AK). (e) UI guard (per brainstorm 2026-06-01): single-select only, no "add another entity" affordance anywhere in a CAS workspace — enforced in UI, not just the data model (see EM5 entity-picker note). Surface design + product framing before locking. | PM + Design + RBC (CAS context)      | Open                                                                                                                                                                                   |
| OQ-18 | Empty-array `fq_entity = []` semantic interpretation — at the data layer, does empty array mean **(a) "applies to all entities"** (downstream queries for entity_A return these records) OR **(b) "no specific entity scope; queryable by explicit ask only"** (downstream queries for entity_A do NOT return these records; caller must explicitly query for empty)? Two interpretations have very different downstream behaviors. **Eng-led decision** (per AK 2026-05-28) — data-layer feasibility, query-path cost, and indexing strategy are Eng's call, with PM + downstream PMs as consultants on consumption preferences. **Future-state caveat:** today everything "asks" by entity (Reporting requests data by entity; Close uses entity for scoping; CAS separates end-clients by entity), but this is not the future — Dylan Caldwell flagged that Reporting's future direction may not require entity at all (see Future Considerations). Design the data contract for the future state, not for today's query patterns. Option (a)'s primary value — matching today's "include shared records in entity-keyed queries" pattern — decays if entity stops being the primary query dimension; (b)'s explicitness becomes more valuable. Flagged 2026-05-20 by AK; ownership clarified 2026-05-28. See AC-EM6-02. | Eng (Nikita) — lead; PM + downstream PMs (Sam, Dylan, CAS) — consultants | Open |
| OQ-19 | ~~"Client In Implementation" signal — what marks a connector as in-implementation vs production?~~ | PM + Eng + ATC | **Closed 2026-07-01 — evaluated per model/source dataset, not per connector.** A model/source dataset is "in implementation" until a model has been published against it AND that model has had data processed through the pipeline. Elapsed time and connector state (Draft/Pending/Active) are not the signal. See EM7 Scenario table, AC-EM7-12. Per AK. Eng still needs to confirm this pair of facts (model-published + data-processed) is queryable per source dataset — see Gap #13. |
| OQ-20 | ~~Scenario D behavior — how does entity-mapping save behavior differ in Implementation vs Production?~~ | PM + Eng + ATC | **Closed 2026-07-01.** Before the OQ-19 threshold, entity-mapping changes affecting that model/source dataset skip diff-preview escalation, the required-reason field, and the destructive gate — same as Scenario A. After the threshold, full Scenario B/C controls apply. Mixed-scenario saves (some affected models past threshold, some not) escalate to the destructive gate but scope the warning copy to only the model(s) that crossed it. See AC-EM7-12, AC-EM7-13. Per AK. |
| OQ-21 | Fate of today's per-file Entity Scope tab (Connector → Edit File → Entity Scope). **Conceptual direction locked 2026-05-28 — option (a) replace.** Entity assignment always starts at the connector level (per OQ-14 closure, confirmed AK + RBC); today's three-tab File Config / Accounting Config / Entity Scope structure reorganizes so that entity lives at the connector level with per-source override reachable as a drill-down. **Still open:** precise UI mechanics — does the per-file drill-down replace the current Entity Scope tab outright, become a "view source-dataset overrides" view inside the new connector-level surface, or take a different layout? TBD with design (Natasha + Kristin). Affects EM2 surface design. | PM + Design (Natasha + Kristin) | Open (conceptual direction locked; UI mechanics TBD) |
| OQ-22 | *(Added 2026-07-01; reframed 2026-07-01 per AK — Pattern 11 treated as a special circumstance, not runtime detection; broadened 2026-07-01 to cover Direct Integrations generally, not just CDC; corrected 2026-07-01 — scoped per Direct Integration, not per "connector type"/pipeline pairing — NetSuite and SAP are both Direct Integrations, just on different pipelines: CDC and SFTP respectively.)* Direct Integration ERD ownership for Pattern 11 — (a) which Turn Key Direct Integrations get an ERD relationship map built, on what timeline — confirmed: NetSuite (CDC pipeline); SAP ECC / SAP S/4HANA (SFTP pipeline, Q3); others (Intacct, Workday) TBD? (b) Who owns building and maintaining each Direct Integration's ERD definition — is this Integrations (who already owns connector schema/field-mapping recipes) or a new responsibility, and does the process differ by pipeline (CDC vs. SFTP vs. Direct API), or is it uniform across all Direct Integrations regardless of pipeline? (c) What's the process when a Direct Integration's underlying source schema/file format drifts (e.g., NetSuite adds a new subsidiary-linked table, or SAP's file layout adds a section) — is drift detected proactively, or does it surface reactively via EM8's completeness warning on affected customers? (d) Should a per-Direct-Integration "ERD map last verified" indicator exist so this doesn't silently rot? | PM + Eng (Nikita) + Integrations | Open |
| OQ-23 | *(Added 2026-07-01.)* Should Data Studio eventually auto-derive Consolidation Entity (or other ancestor) tags from the FQ entity hierarchy, rather than requiring the admin to manually layer a whole-dataset pattern per EM10? Depends on whether Data Studio has (or should gain) access to the entity parent/child hierarchy, which today is not confirmed to exist as data this PRD can reference — see EM10 composition model. If auto-derivation is feasible, EM10's manual layering becomes a V1 stopgap rather than the long-term mechanism. | PM + Eng | Open |
| OQ-24 | *(Added 2026-07-01, per AK.)* "Initial load complete" signal for CDC/API-sourced value enumeration — (a) does Data Studio (or the underlying pipeline — Fivetran for CDC, or the Direct API sync mechanism) expose a reliable signal that a reference table's (or any enumerated scope's) initial historical load has finished, distinct from "still syncing"? (b) If not, what's the fallback — a time-based heuristic, a manual admin-triggered "I'm ready to map" action, or something else? (c) What does the admin see in the entity-mapping section while the initial load is in progress and value-mapping (EM4/EM11) is deferred — a progress indicator, an estimated completion time, nothing? (d) Does this same completeness concern apply beyond Pattern 11 to other CDC/API-sourced patterns requiring enumeration (e.g., Pattern 2 on a CDC-synced fact table), per AC-EM4-01's note? See AC-EM11-07, AC-EM4-01, Gap #20. | PM + Eng (Nikita) | Open |

---

## Gaps

Gaps are *missing infrastructure, dependencies, or known-unknowns* that could block V1 — distinct from Open Questions (decisions to make). Surfaced for visibility; each requires resolution before or during the V1 build.

### Data-model / platform gaps

0. **Migration of existing models that reference synthetic-source datasets** — *Why this matters:* existing customer Models reference synthetic source datasets by their auto-generated names (e.g., "this Model uses `AT Department-demo-US`"). The moment those synthetic datasets disappear, every such Model breaks unless its reference is rewritten to point at the underlying source dataset and filter `fq_entity` for the right entity. This is the V1-blocking risk. Today, customers with entity scope configured produce N synthetic source datasets per file (`{FileLabel}-{entity}`). Models reference these synthetic sources directly. Once slicing is no longer the only `fq_entity` populator, those N synthetic sources collapse back into one underlying source dataset and `fq_entity` is populated through the new admin-configurable paths — but every existing model that picked the synthetic sources needs to keep working. **Required:** a migration that (a) preserves existing models' entity scoping by translating "model uses `AT Department-demo-US`" into "model filters underlying source where `fq_entity` contains `demo-US`," (b) preserves audit/historical references to the old synthetic source names, (c) handles the cutover without producing duplicate or missing data downstream. **Owner: Eng + PM.** Surface during planning; this is V1-blocking.
1. **Multi-tag readiness across the stack** — `fq_entity` exists today as an array (per Assumptions, pending Eng confirmation), but is only populated by synthetic-source slicing which yields single-element arrays in practice. Downstream products (Close, Reporting, CAS-client views, Compliance, Consolidation) and the query layer may not be tested or wired for multi-element arrays. The new patterns (Pattern 2 with multi-value cells, Pattern 4 with multi-entity files, etc.) introduce real multi-tag scenarios — each consumer needs verification that multi-element `fq_entity` is handled correctly end-to-end. **Owner: Eng (Nikita Mantri) + downstream product owners.** Confirm scope + risk during planning. See AC-EM6-02, OQ-18.
2. **`entity_start_time` storage + lifecycle** — needs a place on the connector record (timestamp, immutable per config version), plus prior-config history (see Flow F — auditing). Schema-versioning lives in a separate PRD but the `entity_start_time` mechanism itself is owned by this PRD. **Owner: Eng.** Confirm storage model.
3. **Backfill execution pipeline** — destructive rerun against ingested data needs an idempotent, observable pipeline that can: (a) re-tag records in place, (b) produce a diff for preview, (c) report progress + completion, (d) recover from partial failure. Today's rerun semantics may not cover all four. **Owner: Eng.** Validate against existing rerun infrastructure.
4. **Connector-level entity store** — Pattern 10 (Connector-Level Assignment) and the connector-level default both presume the connector record can carry an entity-mapping config object. Confirm the connector schema supports this. **Owner: Eng.**
5. **FQ entity list authority + change events** — entity mapping configs reference FQ entities by ID. When an entity is renamed, archived, or added, every config referencing it needs to react (auto-rebind, surface for confirmation, or break loudly). The eventing for this may not exist today. **Owner: Eng + downstream product owners.** See OQ-11.
5a. **Layered/composed pattern storage** *(added 2026-07-01)* — EM10 requires a source's entity-mapping config to hold more than one pattern (one row-level + N whole-dataset layers) and resolve them as a union at ingestion. Confirm the connector-level entity-mapping config schema (Gap #4) can represent a list of composed patterns rather than a single pattern value. **Owner: Eng.** See EM10, OQ-23.

### AI / detection gaps

6. **Detection model availability for Q3** — the DETECT layer presumes an AI-or-heuristic component that proposes a pattern from sample data with reasonable confidence. Today there is no shipped detection model for this. Engineering capacity to build it in Q3 is open (OQ-4). **Risk:** if detection isn't ready, V1 ships with the CONFIRM → SIDE-BY-SIDE → MANUAL layers only — the layered fallback still works, but the system never gets to *propose* and Excel-fluent admins see a side-by-side picker on day one instead of a confident suggestion. Lighter Day-1 experience but functional.
7. **Fuzzy auto-match for source-value mapping** — case-insensitive exact + alias matching is feasible; richer fuzzy ("U.S." → "US", "United States Of America" → "United States") depends on engineering AI/heuristic capacity. See OQ-16. **Risk if not delivered:** the high-cardinality flow (Flow E) becomes more manual.
8. **Multi-value cell parsing** — pattern 2 (Entity Column) needs to handle cells like `"US,UK,CA"` either natively (system parses) or by admin-defined delimiter. Today neither is implemented. **Owner: Eng.** See OQ-10.

### Ingestion / connector gaps

9. **Per-source override at the source-dataset level** — presumes source datasets are addressable individually from the connector's entity-mapping surface and that each can carry its own entity-mapping config block. Confirm. **Owner: Eng.**
10. **Wide-to-long pivot at the source-data layer** — patterns 7 (Entity-Tagged Columns) and 8 (Repeated Column Blocks) require pivoting wide → long *before* the records reach field mapping. This pivot may not exist as a primitive in the ingestion pipeline today. **Owner: Eng.** Material to V1 scope; if the pivot isn't buildable in Q3, patterns 7 + 8 cut from V1 and become V2.
11. **Backfill on SFTP / manual upload connectors** — the system may not always retain enough source-side context to re-tag in place; some pattern types may require source re-pull. See OQ-8. **Owner: Eng.** Confirm which patterns are backfill-compatible without re-pull.
12. **CAS-customer designation** — does a "CAS connector" flag exist on the connector or workspace record today? If not, V1 needs to add one. **Owner: Eng + RBC.** See OQ-17.
13. **Per-model/source-dataset "published + data processed" signal** *(updated 2026-07-01 — OQ-19/20 resolved the rule; this gap is now about whether the underlying data exists to evaluate it)* — the destructive-threshold rule (EM7 Scenario table, AC-EM7-12) requires knowing, per model/source dataset, whether a model has been published against it AND whether that model has had data processed through the pipeline. Confirm this pair of facts is queryable at that granularity today — if not, V1 needs to add it. **Owner: Eng + ATC.** See OQ-19, OQ-20.

### Downstream / cross-product gaps

14. **Downstream eventing for entity-tag changes** — destructive backfill ought to notify downstream products (Close, Reporting, CAS-client views) so they can refresh / surface "data updated since last visit" indicators. V1 may ship with banner-only notifications; richer eventing is future. **Owner: PM + downstream product owners.** See OQ-9.
15. **Empty-array `fq_entity = []` semantics across products** — V1 establishes `[]` as "shared / global / applies to all entities," but downstream products (Close, Reporting, Compliance, Consolidation) must each interpret it consistently. If one product treats `[]` as "no entity" and another as "all entities," queries diverge. **Owner: PM + downstream product owners.** See OQ-18.

### Design / UX gaps

16. **No FlowUI pattern for layered fallback (DETECT → CONFIRM → SIDE-BY-SIDE → MANUAL)** — needs to be designed from scratch (or generalized from analogous patterns in Mapping Expressions v2). **Owner: Natasha Clark + Kristin Johnson.** Log to `knowledge/design-system/DEVIATIONS.md` if the resulting pattern needs to become a new FlowUI primitive.
17. **No FlowUI pattern for destructive backfill confirmation gate** — the "type BACKFILL to confirm" + diff preview interaction may exceed existing FlowUI destructive-action patterns. **Owner: Design.** Cross-reference any existing FQ destructive patterns first.
18. **Manual selection grid (Excel-style)** — interactive cell / column / row selection on a sample-data grid is not a current FlowUI capability. Likely a bespoke component for V1. **Owner: Design + Eng.**

### Pattern 11 / value-enumeration gaps

19. **Per-Direct-Integration ERD definitions for Pattern 11** *(added 2026-07-01)* — Pattern 11 (EM11) depends on a FloQast-defined ERD relationship (reference table/file → dependent fact table(s)/file(s), keyed on an identifier) existing per **Direct Integration**, built and maintained by Eng/Integrations — not detected at runtime, not admin-declared, and independent of pipeline (CDC, SFTP, or Direct API). **Required before V1 can ship Pattern 11 for any Direct Integration:** (a) build the ERD definition for NetSuite (the original driving use case, on the CDC pipeline) and confirm whether SAP ECC / SAP S/4HANA's Q3 Direct Integration (on the SFTP pipeline) needs one built in the same timeframe; (b) establish where each Direct Integration's ERD definition lives and how it's versioned alongside that integration's existing schema/field-mapping recipe artifacts; (c) define the process for when a source system's schema/file format drifts. Until a Direct Integration has this definition, it does not get Pattern 11. **Owner: Eng (Nikita Mantri) + Integrations.** See OQ-22, AC-EM11-01, AC-EM11-05.
20. **"Initial load complete" signal for CDC/API value enumeration** *(added 2026-07-01)* — EM4's source-value enumeration (AC-EM4-01) and Pattern 11's reference-data enumeration (AC-EM11-07) both assume the enumerated scope has fully loaded before the admin maps against it. For CDC (Fivetran) and Direct API pipelines, the initial historical load can take time and land incrementally, and it's unconfirmed whether a reliable "initial load complete" signal exists today to gate the value-mapping step on. **Owner: Eng (Nikita Mantri).** See OQ-24.

---

## References

### Related PRDs

- [1 of 4: Model Creation & Source Configuration](https://floqast.atlassian.net/wiki/spaces/Data/pages/4450189505)
- [Mapping Expressions v2](https://floqast.atlassian.net/wiki/spaces/Data/pages/4594892801)

### Source Material

- `playspace/data-studio/q3/entity-mapping/synthesis.md` — 2026-05-11 synthesis (this PRD draws heavily on it)
- `playspace/data-studio/q3/entity-mapping/patterns.md` — the ten patterns enumerated
- `playspace/data-studio/q3/entity-mapping/rebecca-proposal-file-level-scope.md` — RBC's file-level scope proposal (2026-05-08)
- `playspace/data-studio/q3/entity-mapping/slack-will-emmons-aggregates.md` — Will Emmons aggregates reframe
- `playspace/data-studio/q3/entity-mapping/transcript-design-bar-2026-04-17.md` — Design Bar feedback
- `playspace/data-studio/q3/entity-mapping/transcript-dylan-call-2026-04-30.md`
- `playspace/data-studio/q3/entity-mapping/transcript-bryan-call-2026-05-04.md`
- `playspace/data-studio/q3/entity-mapping/transcript-rebecca-call-2026-05-08.md`
- `playspace/data-studio/q3/entity-mapping/brainstorm.md` — 2026-06-01 brainstorm (entity picker, notification model, CAS constraint)
- `playspace/data-studio/q3/entity-mapping/entity-mapping-flow.html` / `.md` — userflow diagram
- FigJam board: https://www.figma.com/board/v3HcdyW27eBmMSfiP4gaCl/Entity-Mapping-Approaches

### Other References

- [Definitions & Terms](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409)
