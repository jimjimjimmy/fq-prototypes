# Definitions & Terms (Data Studio)

**Source:** [Confluence — Definitions & Terms](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409)
**Last updated:** Mar 10, 2026
**Owner:** Alex Kearns

Shared glossary for the Lineage Creation PRD series. Single source of truth for all product terminology.

---

## Open Questions

| # | Question | Owner | Status |
|---|----------|-------|--------|
| Q1 | Does "Connector Type" still exist as a distinct UI concept in the updated add-connector flow? | Rebecca Beasley-Cockroft | Open |
| Q2 | Does the Effective Date for Version 0 / First Publish default to Jan 1, 1900, and what triggers historical data reprocessing? | Data Platform Team | Open |

---

## Key Terms by Area

### Connectors
- **Connector** — A specific transmission type + credentials + source datasets used to transmit data from an external system (e.g., ERP)
- **Standard Connector** — Pre-built connector maintained by FQ with pre-configured source datasets and fixed transmission type
- **Source Type / Source** — Prebuilt connector or method of transmission
- **Transmission Type** — How data is provided to FQ (CDC/Fivetran, API, SFTP Push/Pull, Manual Upload, Standard Integration)
- ~~Connection~~ — Deprecated, use **Connector**

### Catalog (Models)
- **Model** — A normalized, FQ-defined format representing a source-to-target data mapping. A single TLC can have multiple models per FQ Model. Previously called "Lineage"
- **FQ Model** — Defines data columns and types for a specific normalized format (e.g., Accounts, GL Transactions, Balances) consumed by downstream FQ products
- **Model View** — Central workspace for a Model with six tabs: Overview, Source Datasets, Field Mappings, Data Preview, Versions, Logs
- **Linked Dataset(s)** — Source dataset(s) selected as inputs to a Model (previously "Linked Files")
- **Primary Dataset** — When multiple Linked Datasets are used, the one driving base join/normalization logic
- **Grouped Datasets** — Datasets sharing identical schema, UNIONed together before field mapping (for entity-split file sets)
- **Field Mapping (rule)** — Rule defining which source field(s) map to a given FQ target field, including transformation logic
- **Custom Field** — Non-mandatory FQ field the user can optionally map
- **Mandatory Field** — FQ target field that must be mapped before publishing
- **Many-to-One Mapping** — Multiple source fields combined to produce a single FQ target field
- **Transformation Logic** — Expression/formula applied to source fields to produce target FQ field output
- **Standard Model** — Model built on known integration pattern where default mappings are auto-applied without AI

### Version States
- **Draft** — Created but not published. Changes allowed freely. Only one Draft per model. → Active (publish) or → Deleted (discard)
- **Active** — Live published version processing data. Only one Active per model. → Archived (when newer version published)
- **Archived** — Previously Active, now superseded. Read-only. No further transitions.
- **Effective Date** — Date from which a published version's mappings are active. Past date triggers historical reprocessing.
- **Publish** — Making a Draft version Active; triggers data processing
- **Discard** — Permanently deleting a Draft version

### Entity Mapping
- **Entity** — FQ object grouping information across applications, used for permissioning and data organization
- **External Entity Identifier** — Identifier mapping from FQ entity to specific data within a Model

### FloQast Platform Terms
- **TLC (Top Level Client)** — The tenant; highest organizational unit per customer
- **CAS (Client Accounting Services)** — Firms handling outsourced accounting functions; CAS admin may manage 30+ client entities
- **Data Studio** — FQ product area centralizing external data intake
- **ERP** — Customer's financial system of record
