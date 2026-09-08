# PRD 1: Model Creation & Source Configuration

**Source:** [Confluence — 1 of 4](https://floqast.atlassian.net/wiki/spaces/Data/pages/4450189505)
**Status:** DRAFT (rated "Good" by Natasha)
**Last updated:** Mar 10, 2026
**Owner:** Alex Kearns
**Target release:** 2026-06-30

---

## Summary

Covers the first phase: initiating a new model, selecting the target FQ domain, naming it, and configuring source dataset(s) — including linked datasets, primary dataset designation, and grouped datasets for high-volume schema-identical file sets.

## Key Requirements

### MC1: Create a New Model (High)
- Create Model modal from Models tab
- Requires unique name within TLC + FQ Model selection
- Creates Draft at Version 1, navigates to Model View (Overview tab)
- Multiple models per FQ Model supported

### MC2: Define Grouped Datasets (Medium-High)
- Select multiple schema-identical datasets to group
- Grouped datasets are UNIONed before mapping
- Adding datasets to existing group doesn't trigger versioning
- A Grouped Dataset can be designated as Primary

### MC3: Define Linked Datasets and Primary Dataset (High)
- Available datasets shown bucketed by Connector
- First dataset added is automatically Primary
- User can change Primary designation
- Primary is clearly labeled with visual indicator

## Design Implications

- **Models tab** replaces Catalog + Lineage (2 tabs instead of 3)
- **Table view** replaces cards for model listing
- **Create Model modal** with name + FQ Model selection
- **Source Datasets tab** with Available Datasets panel (by Connector) and Linked Datasets panel
- **Zero-state** when no Connectors exist: gate blocking model creation, directing to Connector setup
- Need to handle 100+ files in Available Datasets panel

## Open Questions

| # | Question | Status |
|---|----------|--------|
| OQ-1 | Dataset preview/schema inspector in Source Datasets tab? | Open |
| OQ-2 | Enforced limit on Models per TLC? | Open |

## Gaps

| # | Gap | Impact |
|---|-----|--------|
| G1 | No zero-state gate preventing model creation without Connectors | High |
| G2 | Entity Mapping tab behavior unowned | High |

## User Flow Steps
Steps 1-12 of Lineage Creation user flow:
1. Models Tab → Create Model Modal → Name Check → System Creates Draft
2. Model View → Source Datasets Tab
3. Drag/Drop Datasets → Grouped Files Decision → Define Groups → Primary File → Done
