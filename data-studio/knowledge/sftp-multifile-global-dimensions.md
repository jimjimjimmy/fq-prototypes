# SFTP Multi-File Handling & Global Dimensions — Working Document

**Owner:** Alex Kearns
**Status:** Early thinking — not yet a PRD
**Date:** March 23, 2026
**Context:** Assigned to AK in the Data Platform Execution document. Captures initial product thinking to align with Steve and Rebecca before PRD drafting.

---

## What This Covers

Two related capabilities that are more connected than they first appear:

1. **Multi-file handling** — How users work with multiple source files that have different schemas within a single model (grouped datasets, primary/secondary designation, and file-to-file relationships)
2. **Global Dimensions** — Standard accounting dimensions (Entity, Department, Cost Center, Region, Currency) that serve as a shared contract between Data Studio and downstream FloQast products

---

## Multi-File Handling

### What exists today (PRD 1/4)
- **Grouped Datasets** — UNION of schema-identical files (same columns, stack the rows). Already defined in Model Creation PRD.
- **Primary Dataset designation** — first dataset added is automatically Primary, user can change.
- **Linked Datasets** — available datasets shown bucketed by Connector.

### What's missing: different-schema file relationships
When a model includes files with *different* schemas (e.g., Transactions + Accounts), users need to specify how the files relate to each other. Today there's no self-service path for this.

**The core problem:** Engineering's proposed approach is to have users specify a join. But joins are SQL concepts — the target user (FQ Admin, implementation team member) is not necessarily someone familiar with SQL terminology. Asking them to choose between "inner join" and "left join" breaks self-service.

### Proposed approach: Plain-language relationship definition

**Step 1 — AI-suggested relationship keys**
- System analyzes both file schemas and detects likely relationship fields (same field name, same data type, matching sample values)
- Suggests: "These files share an Account ID field. Should I link them on that?"
- Same pattern as AI-suggested field mappings (FM2) — familiar interaction model

**Step 2 — Plain-language join type**
Instead of "inner join" vs. "left join," frame as a question about what happens to unmatched rows:

> "Some rows in **Transactions** don't have a matching row in **Accounts**."
>
> - **Keep them anyway** (show blank for Account fields)
> - **Exclude them** (only show rows that match in both files)

This is the same mental model as Excel VLOOKUP — what happens when the lookup doesn't find a match?

**Step 3 — Preview the impact**
Show the user: "12 rows in Transactions have no match in Accounts. Keep or exclude?" — makes the consequence tangible before they commit.

AI can also have an opinion: *"I recommend keeping unmatched rows since Transactions is your primary file — you can filter them out later."*

### Relationship to Global Dimensions
Global Dimensions may simplify this further — see below.

---

## Global Dimensions

### What they are
Standard organizational/financial dimensions used across all of accounting:
- **Entity** (e.g., FQ US, FQ UK, FQ DE)
- **Department**
- **Cost Center**
- **Region**
- **Currency**

These are the axes that accounting teams use to slice data everywhere in FloQast — Close, Flux, Compliance, Consolidation, Reporting.

### Dual purpose

**Upstream (Data Studio):**
- During field mapping, users map their source fields to Global Dimensions (alongside other mandatory FQ fields)
- Global Dimensions become the connective tissue between files — if Transactions and Accounts both map a field to "Entity," the system knows how they relate
- This could reduce or eliminate the need for explicit join specification in many cases

**Downstream (Close, Flux, Compliance, Reporting):**
- Standard axes for slicing/dicing data across all models
- Every model publishes data tagged with Global Dimensions
- Downstream products consume data consistently regardless of source

### Where do they live?
**Open question:** Are Global Dimensions...
- Defined once at the Data Studio level and inherited by all models? (shared schema/contract)
- Part of the mandatory FQ target field list in FM1? (per-model mapping)
- Both? (defined centrally, mapped per-model during field mapping)

### Relationship to existing PRDs

| PRD | Connection |
|-----|-----------|
| **Entity Mapping (RBC)** | Rebecca's "Data Domains as an intermediate layer" may be solving for the same concept as Global Dimensions. Her Entity Mapping PRD proposes linking entities to models — Global Dimensions could be the mechanism. This would resolve executive summary discrepancy 5d (entity mapping architecture mismatch). |
| **Field Mapping 2a (AK)** | Global Dimensions may be a subset of mandatory FQ target fields — or a separate mapping step. Needs design input. |
| **CDC Connection Setup (AK)** | CDC auto-created models would need Global Dimension mappings applied automatically as part of Source-to-Target mappings. |
| **QBO Standard Mapping (RBC)** | QBO standard mappings already define some of these (Companies = Entity, Departments = Department). Global Dimensions would formalize this across all connector types. |

---

## How These Connect

```
Multi-file handling          Global Dimensions
        │                           │
        │  Files share a Global     │
        │  Dimension mapping?  ─────┤
        │         │                 │
        │    YES: System infers     │
        │    the relationship       │
        │         │                 │
        │    NO: User specifies     │
        │    relationship key       │
        │    (AI-suggested)         │
        │         │                 │
        ▼         ▼                 ▼
   "Keep or exclude          Downstream products
    unmatched rows?"         slice by these dimensions
```

Global Dimensions don't eliminate the need for multi-file relationship specification entirely, but they handle the most common case (files linked by standard accounting dimensions) automatically. The explicit "match on + keep/exclude" flow is the fallback for non-standard relationships.

---

## Open Questions

| # | Question | Notes |
|---|----------|-------|
| 1 | Are Global Dimensions the same concept as Rebecca's "Data Domains"? | Need to align with RBC. If yes, this resolves a known architecture gap. |
| 2 | Where are Global Dimensions defined — centrally or per-model? | Likely centrally with per-model mapping. |
| 3 | Is the "keep or exclude unmatched rows" framing sufficient, or do users need more relationship types? | Start simple. Full outer join and cross join are edge cases that can be deferred. |
| 4 | How does this interact with Grouped Datasets? | Grouped Datasets are same-schema UNIONs. Multi-file joins are different-schema relationships. They're complementary, not overlapping. |
| 5 | Does this need its own PRD, or does it extend PRD 1/4 (Model Creation)? | Probably its own PRD given the scope — multi-file + Global Dimensions is non-trivial. |
| 6 | How do Global Dimensions interact with Steve's resource ask? | Cross-cutting: touches Data Platform BU (Data Studio) and Reporting BU (downstream consumption). Worth flagging. |

---

## Next Steps

- [ ] Align with Rebecca on whether Global Dimensions = Data Domains
- [ ] Discuss with Jason Smith (Integrations) on how this affects entity mapping architecture
- [ ] Raise with Steve as a cross-BU concern in 1:1 or planning sessions
- [ ] Decide: separate PRD or extend PRD 1/4
- [ ] Once aligned, draft PRD using FloQast format

---

## PRD Index (for reference)

### Reference Docs

| # | Reference Doc | Author | Summary |
|---|---------------|--------|---------|
| 1 | [Definitions & Terms](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409) | AK | Shared glossary defining Model, Connector, Grouped Dataset, Effective Date, Version states, and Entity across the entire PRD suite. |
| 2 | [Overview & Index of "Model Creation" PRDs](https://floqast.atlassian.net/wiki/spaces/Data/pages/4444455089) | AK | Parent of 5 sub-PRD cases around model creation. |
| 3 | [Parent QBO Page](https://floqast.atlassian.net/wiki/spaces/Data/pages/4430200905/QBO+Data+Ingestion+and+Transformation) | RBC | Parent of all PRD cases outlining the "what" / "why". |

### PRDs by Engineering Category

| #   | PRD                                                                                                                                  | Author   | Eng Category        | Summary                                                                                                                                                                                                |
| --- | ------------------------------------------------------------------------------------------------------------------------------------ | -------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | [Merging Catalog & Lineage Tabs](https://floqast.atlassian.net/wiki/spaces/Data/pages/4470800387)                                    | AK       | Foundational        | Consolidates the 3-tab layout into 2 tabs (Catalog, Connectors), retires card-based Catalog, and standardizes the 6-tab Model detail view.                                                             |
| 2   | [Catalog — Search and Filter](https://floqast.atlassian.net/wiki/spaces/Data/pages/4476731473)                                       | AK       | Foundational        | Defines AG Grid table behavior for the Catalog tab: FQ Model type groupings, status badges, real-time search, column filters, and active filter chips.                                                 |
| 3   | [QBO Connection](https://floqast.atlassian.net/wiki/spaces/Data/pages/4442718323/QBO+Connection)                                     | RBC      | QBO                 | Covers both QBO Basic (Direct API / OAuth 2.0) and QBO Advanced (Fivetran) connection paths, including credential storage, token refresh, and the Connections tab at scale (~35k connections).         |
| 4   | [QBO Endpoint Handling](https://floqast.atlassian.net/wiki/spaces/Data/pages/4447568254)                                             | RBC      | QBO                 | Manages per-connection API endpoint configuration: auto-provisioned endpoints, custom activation, sync frequency, and on-demand data run triggers with <60s SLA.                                       |
| 5   | [CDC Connection Setup](https://floqast.atlassian.net/wiki/spaces/Data/pages/4462575617)                                              | AK       | CDC                 | Self-service CDC connection wizard (e.g., NetSuite via Fivetran) with table selection, auto-created models, and full vendor abstraction — no Fivetran language surfaces to users.                      |
| 6   | [Manual Upload Connector](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449337387/Data+Studio+Manual+Upload+Connector+DRAFT) | AK       | Manual Upload       | New connector type for Excel/CSV uploads with schema inference, manual type overrides, rich validation, and as-of date per upload.                                                                     |
| 7   | [Model Creation & Source Configuration (1/4)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4450189505)                       | AK       | Multi-File Handling | Model naming, FQ Model selection, linking source datasets, Primary Dataset designation, and Grouped Datasets (UNION of schema-identical files) for high-file-count customers.                          |
| 8a  | [Field Mapping — Visual Refresh + AI-Suggested Mappings (2a/4)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449927443)     | AK       | Foundational        | **Target: 6/30.** Redesigned field mapping page, AI-suggested source-to-target mappings on first draft, many-to-one source field mapping, and custom field support.                                    |
| 8b  | Field Mapping — AI-Assisted Transformation Functions (2b/4)                                                                          | AK       | Foundational        | **Target: 9/30.** Per-row transformation logic editor with manual functions and AI Chat Modal for natural language → expression authoring. Depends on 8a and RBC's QBO Transformation Functions (#14). |
| 9   | [Testing & Publishing (3/4)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449468593)                                        | AK       | Foundational        | Test/preview with as-of date and entity filter, publish action with Effective Date selector and validation, plus row-level error surfacing.                                                            |
| 10  | [Versioning & Lifecycle (4/4)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4443013309)                                      | AK + RBC | Foundational        | Post-publish version lifecycle: new Drafts (manual and auto-triggered), one-Draft constraint, discard, archive, Logs tab, and Versions tab.                                                            |
| 11  | [QBO Standard Mapping](https://floqast.atlassian.net/wiki/spaces/Data/pages/4465296047/QBO+Standard+Mapping)                         | RBC      | QBO                 | Auto-provisioned field mappings for QBO (API and Fivetran): Accounts, Balances, Transactions, Companies, FX Rates, and Dimensions with opt-in customization and Reset to Standard.                     |
| 12  | [Entity Mapping](https://floqast.atlassian.net/wiki/spaces/Data/pages/4476535512/Entity+Mapping)                                     | RBC      | Foundational        | Entity-to-model linking via a proposed Data Domains intermediate layer between FQ entities, models, and connections; predates current architecture.                                                    |
| 13  | [Data Preview Tab](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449632496/Model+Creation+Data+Preview+Tab+DRAFT)            | AK       | Foundational        | Read-only AG Grid view of processed pipeline data with version selection, per-column filters, and server-side pagination; AI-assisted query deferred to V2.                                            |
| 14  | [QBO Transformation Functions](https://floqast.atlassian.net/wiki/spaces/Data/pages/4484530409/QBO+Transformation+Functions+DRAFT)   | RBC      | Foundational        | Defines the transformation functions needed to define source-to-target mapping for QBO into normalized FQ format (will support more than QBO).                                                         |
| —   | *(No PRD yet)*                                                                                                                       | —        | Direct API          | **Gap:** Engineering has a Direct API category but no PRD coverage exists. Needs scoping.                                                                                                              |

### Coverage Summary

| Eng Category            | PRD Count                                | Owner    | Notes                                                                         |
| ----------------------- | ---------------------------------------- | -------- | ----------------------------------------------------------------------------- |
| **Foundational**        | 9 (PRDs 1, 2, 8a, 8b, 9, 10, 12, 13, 14) | AK + RBC | Core platform — source-agnostic                                               |
| **QBO**                 | 3 (PRDs 3, 4, 11)                        | RBC      | QBO-specific connection, endpoints, standard mapping                          |
| **CDC**                 | 1 (PRD 5)                                | AK       | CDC/Fivetran connection setup                                                 |
| **Multi-File Handling** | 1 (PRD 7)                                | AK       | Grouped datasets, primary/secondary, joins. Expanding — see this working doc. |
| **Manual Upload**       | 1 (PRD 6)                                | AK       | Excel/CSV connector                                                           |
| **Direct API**          | 0                                        | —        | **No PRD coverage. Gap to address.**                                          |
