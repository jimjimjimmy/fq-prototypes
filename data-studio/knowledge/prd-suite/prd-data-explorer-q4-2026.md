# Data Explorer — Q4 2026 (DRAFT)

| Field | Value |
|---|---|
| **Target release** | Q4 2026 (date TBD) |
| **Epic** | _(link to epic)_ |
| **Idea Link** | IDEA-2616 |
| **Document status** | DRAFT |
| **Document owner** | Alex Kearns |
| **Designer** | Natasha Clark · Kristin Johnson |
| **Tech lead** | _(assign)_ |
| **Technical writers** | _(assign)_ |
| **QA** | _(assign)_ |
| **Depends on** | [Data Explorer Q3](./prd-data-explorer.md) must be shipped. Column-level metadata infrastructure must be confirmed (see OQ-A). |
| **Related sub-PRDs** | [1 of 4: Model Creation & Source Configuration](https://floqast.atlassian.net/wiki/spaces/Data/pages/4450189505) · [2 of 4: Field Mapping](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449927443) · [3 of 4: Testing & Publishing](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449468593) · [4 of 4: Versioning & Lifecycle](https://floqast.atlassian.net/wiki/spaces/Data/pages/4443013309) |
| **Confluence** | https://floqast.atlassian.net/wiki/spaces/Data/pages/4633362841/Data+Explorer+Q4+2026+Enhancements |
| **Q3 predecessor** | [Data Explorer — Q3 2026 Scoped Release](./prd-data-explorer-q3.md) |

---

## 🎯 Objective

This PRD covers the Q4 enhancements to the Data Explorer tab introduced in Q3. The Q3 release established the core grid — last successful run data, filtering, sorting, and pagination. Q4 adds:

- **Version selector** — users can inspect data from any Active or Archived model version, enabling audit workflows
- **Dimension-linked column resolution** — FK columns display human-readable field names; orphan rows are flagged
- **Sensitive column obfuscation** — PII columns are masked by default with explicit reveal and audit logging

Navigation path: Data Studio → Catalog → [Select a Model] → Data Explorer

For dimension models: Data Studio → Dimensions → [Select a Dimension] → Data Explorer

---

## 🔤 Definitions

| Term | Definition |
|---|---|
| **Sensitive column** | A source column designated by an admin as containing sensitive or PII data. Designation propagates to all target columns derived from it. |
| **Obfuscation** | Masking a sensitive column's values in the Data Explorer grid. The column header is visible; values are hidden until revealed by an authorized user. |
| **Reveal** | The action of un-masking a sensitive column's values in the grid. Reveal actions are logged. |
| **Contributing lineage** | A model whose output populates the dimension's member set. |
| **Linked lineage** | A model that references a dimension's key as a foreign-key lookup. |
| **FK orphan** | A row in a linked model that references a dimension key that no longer exists or is inactive in the current dimension version. |

For the full glossary see [Definitions & Terms (Data Studio)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409).

---

## 🏅 Why This Matters

The Q3 release gives users visibility into what their pipeline is currently producing. Q4 extends this in two important directions:

**Audit readiness:** Customers need to prove what data was running through the system at any point in time. Version selection and archived version data give controllers and auditors a reliable historical trail directly inside FloQast.

**Sensitive data handling:** Showing pipeline output to a broader audience (data stewards, accountants) creates exposure risk for PII fields. The Q3 grid defers masking; Q4 closes this gap before Data Explorer is rolled out broadly.

**Data quality context:** Raw FK values in a grid are meaningless to non-technical users. Dimension-linked column resolution makes the data interpretable without cross-referencing a separate lookup table.

---

## ✅ Use Cases

| # | Persona | Scenario | Expected Outcome |
|---|---|---|---|
| 1 | Controller / Auditor | Audit review — the auditor needs to see what data was processed by a specific historical version | The user selects an Archived version from the version selector and views the data processed while that version was active |
| 2 | Data Steward | Schema change validation — after activating a new version with different columns, the steward confirms the new schema is correct | The version selector updates column headers to reflect the new version's schema |
| 3 | Admin | Sensitive data access — an authorized user needs to inspect raw values in a column flagged as sensitive | The user reveals the column with a single click; the action is logged with their identity, the column name, and the timestamp |
| 4 | Accountant | Dimension value lookup — the accountant sees a FK key value in the grid and wants to understand what it refers to | The column already displays the resolved field name; the raw key is accessible on hover |
| 5 | Compliance owner | Audit trail review — the compliance owner wants to see who has revealed sensitive columns and when | Reveal logs are accessible in the Logs tab, filterable by user / model / column / date |

---

## 📊 Success Metrics

| Goal | Metric | Baseline | Target |
|---|---|---|---|
| Confirm audit use case adoption | % of Data Explorer sessions that use the version selector | 0% (new feature) | Track post-launch |
| Track sensitive column usage | % of models with at least one sensitive column where a reveal action has occurred in the first 30 days | 0% (new feature) | Track post-launch |
| Reduce FK confusion support tickets | Support tickets referencing "what does this ID mean" in Data Explorer | Establish pre-launch baseline | Decrease post-launch |

---

## 🤔 Assumptions

- Data Explorer Q3 is shipped and stable before Q4 work begins.
- Data processed while a version was Active remains accessible after that version is Archived.
- The Model versioning system must expose version state (Active / Archived / Draft) to the Data Explorer layer — this dependency needs engineering confirmation before Q4 scope is finalised (see G1).
- Column-level metadata infrastructure exists or is delivered alongside this work (see OQ-A).
- Sensitive column designation is configured in source dataset configuration (PRD 1 of 4) and propagates via field mapping (PRD 2 of 4). This PRD covers only the obfuscation and reveal behavior in the grid.
- Draft version data must never be accessible via Data Explorer under any circumstances.
- The version selector only shows versions that have at least one successful pipeline run.

---

## 🌟 Milestones

| Milestone | Description | Target Date |
|---|---|---|
| Phase 2 — Version Audit + Masking (Q4) | Version selector enabling users to view data from any Active or Archived version, sensitive column obfuscation and reveal logging, dimension-linked column resolution, FK orphan flagging | Q4 2026 TBD |
| Phase 3 — AI Exploration (V2) | Natural language query bar, AI translates user questions into filter criteria | Post-Q4 TBD |

---

## 🗺️ Scope

### In Scope (Q4)

- Version selector: switch between Active and Archived versions; grid reloads with selected version's data and schema
- Archived version data access: data processed while a version was Active remains accessible after archiving
- Dimension-linked column resolution: FK columns display the Dimension's human-readable field name; version-aware resolution
- FK orphan flagging: rows where a dimension key does not resolve are visually flagged with the raw key shown
- Sensitive column obfuscation: columns flagged as sensitive are masked by default (header visible, values hidden)
- Sensitive column reveal: per-column reveal action; values shown in plain text for session duration
- Reveal action logging: each reveal logged with user identity, column name, model, model version, timestamp
- Agent-initiated reveals attributed to the initiating human user

### Out of Scope (Q4)

- Editing, modifying, or writing data through the Data Explorer tab (read-only only)
- Draft version data (never shown under any circumstances)
- Data export or download functionality
- REBAC-gated reveal permissions (long-term direction; Q4 builds the logging foundation)
- Sensitive column designation UI (owned by PRD 1 of 4)
- Sensitivity propagation logic in field mapping (owned by PRD 2 of 4)
- AI-assisted data exploration (V2 — post-Q4)

---

## 📋 Requirements — User Stories

### Quick Reference

| # | Story | Importance |
|---|---|---|
| DP4-LC | Switch Between Versions | High |
| DP5-LC | Audit Archived Version Data | High |
| DP7-LC | Dimension-Linked Column Resolution | High |
| DP8-LC | Sensitive Column Obfuscation | High |
| DP9-LC | Reveal Action Logging | High |
| DP10-LC | AI-Assisted Data Exploration (V2) | Medium |

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

**AC-DP4-04 — Default selection on tab load**
- **Given** I navigate to the Data Explorer tab
- **When** the tab loads
- **Then** the most recent Active version is selected by default
- **And** in scenarios where there is no Active version, the most recent version with a successful pipeline run is shown instead

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
- **When** I navigate to the Data Explorer tab
- **Then** Draft versions are never shown in the version selector
- **And** data associated with Draft versions is never displayed under any circumstances

---

### DP7-LC — Dimension-Linked Column Resolution

**User Story:** As a Data Steward or Accountant, I want to see human-readable dimension values in the grid — not raw foreign keys — so that the data is meaningful to me without cross-referencing a separate lookup table.

**Importance:** High

**Details:** When a Model has dimension-linked columns, the Data Explorer resolves those columns to their human-readable field name (as defined in the Dimension's field name mapping) rather than displaying the raw key value. Rows where the dimension key does not resolve — FK orphans — are visually flagged.

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

Columns are visible (header shown, column present) but values are hidden. Reveal is a deliberate per-column action. Seeing on screen and downloading are separate permission gates — this PRD covers the on-screen reveal tier; download is out of scope.

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

**Details:** This logging is the Q4 foundation for a future break-glass / REBAC approval pattern. Reveal logs must attribute actions to the human user even when the reveal is triggered via an agent or MCP session.

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

**Details:** This story is **deferred to V2 (post-Q4)**. The AI interaction would be surfaced as a prompt bar above the grid. The AI would translate the user's question into filter criteria that the user can review before applying — the user remains in control.

Note: Feasibility and approach to be confirmed before design begins.

---

## 🎨 User Interaction & Design

_(To be completed by designer. Key questions to resolve:)_

- Should the version selector be displayed as a dropdown above the grid, or inline with the tab header?
- How should we communicate that you're viewing an Archived (historical) version — banner, version label color, or something else?
- What is the visual treatment for masked sensitive columns — "••••••" placeholder, a lock icon, a distinct column header background, or some combination?
- What is the reveal control — a button in the column header, a right-click action, or something else? What confirmation (if any) is required before reveal?
- What is the visual treatment for FK orphan cells — a warning triangle, a yellow cell background, a tooltip?

**UI Changes (Q4 additions to Q3 grid)**

- Version selector dropdown positioned above the AG-Grid
- Archived version indicator (label or banner when viewing a non-current version)
- Sensitive column visual treatment: masked values, sensitive indicator in column header, reveal control
- FK orphan cell indicator for dimension-linked columns

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

---

## 🔗 Dimensions — Data Explorer Variant

The Data Explorer described above applies to standard Models. **Dimension models** also expose a Data Explorer surface, but with dimension-specific additions. Requirements are documented in the Dimensions PRD and summarized here for cross-reference.

The Dimension detail view (Dimensions L1 tab → Dimension → Values subtab) serves as the dimension variant of the Data Explorer. Its purpose is distinct from the Model Data Explorer: it shows the dimension's **member set** (the reference data catalog), not joined pipeline row output.

**Additions specific to the Dimension Data Explorer:**

| Element | User-facing label | Description |
|---|---|---|
| Related Records | Related Records | Total distinct members in the dimension (e.g., "47 related records") |
| Member status | _(label TBD — needs design decision)_ | Active vs Inactive per member — critical for understanding the effect of archived contributing lineages |
| Field name column | Name | Human-readable display value alongside the key |
| Data quality flags | Warning | Possible duplicate values and duplicate keys surfaced inline in the grid |
| Contributing source indicator | Source | Which contributing lineage produced each member — relevant when multiple contributing lineages are active |

---

## 😎 Future Considerations

- **AI-assisted data exploration (DP10-LC):** Natural language query bar deferred to V2 post-Q4. Feasibility and UX approach to be confirmed before design begins.
- **Data export / download:** When it lands, download access is a separate permission gate from on-screen reveal; the ability to download implies the ability to see, but not vice versa.
- **Source data viewer for triage:** Would let users trace a bad transformed value back to its raw source. Deferred post-Q4; requires a decision on whether the surface lives in Data Explorer or as a separate tab.
- **REBAC-gated reveal permissions:** Break-glass approval pattern is the long-term direction. Q4 builds the logging infrastructure that makes this possible.
- **Read-only Model configuration view:** No PRD currently covers a view-only version of field mapping and model setup for non-admin users. This is a gap identified in Q3 planning (see G4).

---

## ❓ Open Questions

| # | Question | Owner | Status | Answer |
|---|---|---|---|---|
| OQ-1 | What is the data retention policy for data processed by Archived versions? Should we define a retention window (e.g., retain for 2 years) or retain indefinitely? This must be answered before the audit use case (DP5-LC) can be committed. | Engineering / Head of Data | Open | |
| OQ-3 | Should the AI-powered data exploration feature (DP10-LC) be included in Q4 or deferred further? | PM | Open | |
| OQ-5 | Are there any PII or data sensitivity concerns beyond what is covered by the sensitive column model in DP8-LC? Are field-level masking controls needed beyond what is spec'd here? | Engineering / Security | Open | |
| OQ-A | What is the engineering lift for column-level metadata across all four layers (source config, field mapping, pipeline, Data Explorer)? Column-level metadata does not exist today. Does the full sensitive column feature fit in Q4? | Engineering | Open | |
| OQ-F | How are reveal logs attributed when an automated pipeline or scheduled task accesses sensitive column data with no human in the session? | Engineering / Security | Open | |
| OQ-C | When a transformation genuinely de-identifies sensitive data (e.g., bucketing salary into ranges), what is the UX for an admin to explicitly mark the target output as non-sensitive? | PM / Design | Open | |
| OQ-D | Where does the read-only Model configuration view live, and which PRD owns it? | PM | Open | |
| OQ-E | What is the REBAC delivery timeline relative to Q4 Data Explorer? Does the obfuscation model need a fallback permission model if REBAC isn't ready? | Engineering | Open | |

---

## 🚫 Gaps

| # | Gap | Impact | Proposed Resolution |
|---|---|---|---|
| G1 | The Model versioning system must expose version state (Active / Archived / Draft) to the Data Explorer API layer. This dependency needs confirmation from Engineering before Q4 scope can be finalized. | Blocks version selector and archived audit (DP4, DP5) | Confirm with Engineering pre-Q4 |
| G2 | No data retention policy currently exists for data processed by Archived versions. Engineering and Head of Data must define and document this policy before the audit use case (DP5-LC) can be committed. | Blocks audit use case commitment | Head of Data / Engineering to define policy pre-Q4 |
| G3 | Column-level metadata infrastructure does not exist today. It is a foundational dependency for the entire sensitive column feature set (DP8-LC, DP9-LC) and threads across four layers: source config, field mapping, pipeline, and Data Explorer. | Blocks sensitive column feature | Engineering assessment required before Q4 scope locks (see OQ-A) |
| G4 | No PRD currently covers the read-only Model configuration view — a surface where non-admin users could see field mapping and model setup without edit access. | Does not block Data Explorer Q4 | Needs a PRD owner and home |
| G5 | The Dimension-specific Data Explorer variant (member count, status, FK orphan count, contributing source indicator) is summarized here but requirements are not fully specified. | Does not block standard model Data Explorer | Dimensions PRD to carry full requirements for the Dimension detail Values subtab |

---

## 📚 References

- [1 of 4: Model Creation & Source Configuration](https://floqast.atlassian.net/wiki/spaces/Data/pages/4450189505) — source column sensitivity designation
- [2 of 4: Field Mapping](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449927443) — sensitivity propagation and field mapping sensitive indicator
- [3 of 4: Testing & Publishing](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449468593)
- [4 of 4: Versioning & Lifecycle](https://floqast.atlassian.net/wiki/spaces/Data/pages/4443013309)
- [Logging & Audit PRD](https://floqast.atlassian.net/wiki/spaces/Data/pages/4508254281) — reveal log surfacing
- [AG Grid Optionality — Report Builder Related Tables](https://floqast.atlassian.net/wiki/spaces/SYC/pages/4420763720) — AG-Grid platform standard
- Q3 predecessor: [Data Explorer — Q3 2026 Scoped Release](./prd-data-explorer-q3.md)
- Confluence (Q3): https://floqast.atlassian.net/wiki/spaces/Data/pages/4633067751/Data+Explorer+Q3+2026
- Confluence (Q4): https://floqast.atlassian.net/wiki/spaces/Data/pages/4633362841/Data+Explorer+Q4+2026+Enhancements
