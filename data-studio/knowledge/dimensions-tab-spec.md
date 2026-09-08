# Dimensions Tab — Spec

**Owner:** Alex Kearns
**Status:** In progress — prototype built April 24, 2026
**Created:** April 24, 2026
**Updated:** April 24, 2026
**Context:** Brainstormed from engineering mockups (April 23–24, 2026). Updated after prototype session same day to reflect design decisions made in the prototype.

---

## What This Is

The Dimensions tab is a **management and catalog view** for dimension objects across the TLC. It is not the primary creation surface — dimensions are created either by building a new model (type = Dimension) in Catalog, or by defining a dimension from within an existing model. The Dimensions tab is where all of those end up, and where users manage them over time.

---

## Architecture Notes

**A dimension is a model.** It is created with the same Sources → Mapping → Versions structure as any other model in Catalog. What makes it a dimension is its *role* — it is a lookup/reference table that other models reference for categorization. As a result, a dimension appears in two places: in Catalog (as a model object) and in the Dimensions tab (as a managed dimension). The Dimensions tab is effectively a filtered view of Catalog for dimension-type models, with a health/dependency layer on top.

**Dimensions are entity-agnostic.** Even when the source data is entity-scoped (e.g., a GL Transactions file mapped to a specific legal entity), the dimension produced from it applies across all entities. A common pattern: a GL Transactions file contains a department column and no dedicated department master file exists — the Department dimension can be derived from that same file and still applies globally, not just to that entity. The Dimensions tab does not need entity filtering.

The edge case of entity-specific dimensional data (e.g., a department structure unique to one subsidiary) is considered unlikely and not in scope for V1. Worth revisiting if multi-subsidiary customers raise it.

**Entity is not a dimension in Data Studio.** Entity is a special concept managed in another part of FloQast (org structure and permissioning). It does not appear in this tab.

**No dimensions are required.** There is no FQ-prescribed list of dimensions that must exist. The tab is entirely user-driven. Dimensions accumulate over time as users build models — primarily surfaced via AI-suggested dimensions in the model's Dimensions sub-tab.

**Key/label structure.** Every dimension has two logical fields: a **key** (stable identifier used by models to reference the dimension) and a **label** (display value populated from the source). Sources provide label values; models join on the key. This convention is surfaced in the Data Flow view on the dimension detail page.

---

## Two Creation Paths

Both paths produce a dimension object that appears in this tab.

| Path | Entry Point | When to Use |
|---|---|---|
| **Create a new model** | Catalog → New Model → Type: Dimension | User has a dedicated source file for dimension data (e.g., a departments master list via SFTP) |
| **Create a dimension from an existing model** | Model → Dimensions sub-tab → Define/Link Dimension | User's dimension data is embedded in a fact file, or they want to define a dimension inline while building a model |

---

## Tab Contents — Management View

A table/grid of all dimension objects in the TLC. One row per dimension. Values sorted alphabetically.

### Columns

| Column | Notes |
|---|---|
| **Name** | Dimension name. Tooltip shows description. |
| **Linked Models** | Names of models that reference this dimension. Shows first model name + overflow count ("+N more"). Primary health signal — this is the dependency map. |
| **Unique Values** | Count of unique dimension members (e.g., 47 departments). Sanity check. |
| **Last Updated** | When the dimension data was last refreshed. |
| **Status** | See status states below. |

### Status States

| Status | Meaning |
|---|---|
| **Draft** | Dimension defined but not yet active |
| **Active** | Dimension is live and being used |
| **⚠ Data quality** | Duplicate keys or blank values detected in dimension data |
| **⚠ Orphaned** | Dimension has 0 models using it — likely a cleanup candidate |

Note: "Stale" (source not synced recently) is intentionally excluded — dimensions change slowly enough that this is not a meaningful health signal.

---

## Empty State

When a TLC has no dimensions configured:

- **Headline:** No dimensions yet
- **Body:** "Dimensions standardize how your data is organized and consumed across all FloQast products—so categories like Department or Region mean the same thing everywhere."
- **CTA (inline text link):** "To get started, create or edit a model in the Catalog." — links directly to Catalog.

Both creation paths are accessed via Catalog. No need for separate CTAs on the empty state.

---

## Dimension Detail View

Clicking a dimension row opens a detail view with:

- **Header:** Dimension name, status badge, source connector chip(s), last updated
- **Left sidebar nav:** Values | Data Flow

### Values Tab

A table of all dimension member values, sorted alphabetically by default, with:
- Value name — warning icon for data quality issues (clickable)
- Linked record count — inline bar chart relative to the max value, with per-model breakdown
- Warning detail drawer — expands below the grid on warning icon click
- Search filter and "Show issues only" toggle (visible when issues exist)

### Data Flow Tab

A lineage graph showing the dimension's data relationships: **Sources → Dimension → Models**

Two display modes toggled at the top right:

**Overview** — node-level view. Source cards on the left, dimension card in the center, model cards on the right, connected by bezier curves with arrowheads. Model cards are clickable and navigate to that model's detail view.

**Fields** — expands each card to show field-level connections:
- Left side: `source field → dimension label`
- Right side: `dimension key → model field`

Model cards carry a role badge:
- **Primary** — this model is where the dimension's values originate
- **Linked** — this model references the dimension as a lookup on a shared key

---

## Health Indicators

Two health signals are in scope:

**Orphaned** — a dimension with 0 models using it. Surfaced as a status badge in the table. A "Show orphaned" filtered view is a candidate for a future iteration.

**Data quality warning** — duplicate key values or blank name/value fields. Surfaced on the dimension row (status badge) and inside the Values tab (per-row warning icons with a detail drawer). This is the beginning of the "dimensions as data validation" use case: if a fact model references a dimension and some rows have key values that don't exist in the dimension, that is a data error. The full spec for what gets flagged is TBD.

---

## Open Questions

| # | Question | Notes |
|---|----------|-------|
| 1 | Can a dimension be deleted? | If models are referencing it, deletion should be blocked or require confirmation. Needs a safety story. |
| 2 | Who can create/edit dimensions? | Role-based permissions — FQ Admin only, or broader? |
| 3 | Data quality as a model-level health signal | Eventually, a model should surface "X rows have a dimension key value that doesn't match any known dimension member." Is this V1? |
| 4 | Does the Dimensions tab replace or absorb Entity Mappings? | Entity Mappings is currently a placeholder tab. Needs alignment on whether it stays, gets retired, or gets merged here. |
| 5 | Entity-specific dimensional data | Could a dimension ever be scoped to a single entity? Current assessment: unlikely and not in scope. Worth revisiting if multi-subsidiary customers raise it. |
