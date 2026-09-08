# Lineage Creation — Overview & Index

**Source:** [Confluence — Overview & Index](https://floqast.atlassian.net/wiki/spaces/Data/pages/4444455089)
**Status:** DRAFT
**Last updated:** Mar 10, 2026
**Owner:** Alex Kearns
**Target release:** 2026-06-30

---

## Summary

Top-level index for the Lineage Creation PRD suite. Model Lineage (also called "Model") is the source-to-target mapping capability within Data Studio. It enables admins and implementation team members to bring in external datasets, map fields to FQ's normalized format, and publish so downstream products (Close, Flux, Compliance, Consolidation) can consume the data.

## Sub-PRDs

| # | Sub-PRD | Covers | Status |
|---|---------|--------|--------|
| 1 | Model Creation & Source Configuration | Creating models, naming, linking source datasets, grouped datasets | DRAFT |
| 2 | Field Mapping | AI-assisted and manual mapping, many-to-one, custom fields, transformations | DRAFT |
| 3 | Testing & Publishing | Test preview, publish mechanics, effective dates, validation | DRAFT |
| 4 | Versioning & Lifecycle | New versions, discarding drafts, archiving, version history, logs | DRAFT |
| 5 | Data Preview Tab | Viewing processed pipeline output, AG-Grid, filtering, sorting | DRAFT |

## Why This Matters

Model creation currently requires significant engineering involvement from both FQ implementation team and customer IT. This creates onboarding delays and limits go-live speed.

AI-native, self-service Model creation will:
- Reduce time from contract to first data in FQ products
- Eliminate FQ engineering involvement in standard onboarding
- Simplify IT requirements for customers
- Scale implementation capacity without headcount

**Key example:** One customer delivers 200+ files (same dataset, split by entity). Without Grouped Dataset support, each needs separate lineage rules — unsustainable.

## Key Benefits
- Zero-engineering model creation
- AI-native mapping (hours → minutes)
- Grouped Dataset support
- Faster time to first data
- Safer updates via Draft → Publish versioning
- Pipeline output visibility via Data Preview

## Overall Blockers

| # | Description | Blocks |
|---|-------------|--------|
| B1 | Effective Date for Version 0: confirm Jan 1, 1900 default and operational implications | Sub-PRD 3 |
| B2 | Grouped Datasets definition is blank — needs formal definition and customer use case | Sub-PRD 1 |
| B3 | Sample data upload pre-publish: can users upload CSV when no data loaded yet? | Sub-PRD 3 |
| B4 | Reconcile existing Versioning PRD with Sub-PRD 4 | Sub-PRD 4 |
| B5 | No delete/discard path exists for Draft version or entire model | Sub-PRD 4 |

## Design Implications for Prototype

- Primary users are FQ admins and implementation team members (non-engineers)
- Workflow is sequential: Create Model → Source Datasets → Field Mapping → Test → Publish
- Model View has 6 tabs in vertical left nav: Overview, Source Datasets, Field Mappings, Data Preview, Versions, Logs
- UI simplification: Catalog + Lineage merged, 3 tabs → 2 tabs (Models, Connections), cards → table view
- AI is central to field mapping — the "core AI interaction model" Greg referenced
