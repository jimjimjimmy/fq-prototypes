# PRD 3: Testing & Publishing

**Source:** [Confluence — 3 of 4](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449468593)
**Status:** DRAFT (rated "Good" by Natasha)
**Last updated:** Mar 10, 2026
**Owner:** Alex Kearns
**Target release:** 2026-06-30

---

## Summary

Covers the final phase before going live: testing field mappings against actual data to validate correctness, and publishing the first version to make it Active. Addresses test/preview experience, publish mechanics, Effective Date, and publish-time validation.

**Testing before publish is the last line of defense against data quality issues reaching downstream FQ products.**

## Key Requirements

### TP1: Trigger Test/Preview (High)
- Test panel accessible from Field Mapping tab (stays in context)
- Reflects current draft mapping state (not last published)
- Shows source values alongside mapped output, multiple rows. **6/30 scope:** mapped values only (1:1 and many-to-one); transformation logic output added in 9/30 when PRD 2b lands.
- Clear "no data available" state when no data loaded

### TP2: Select As-Of Date (High)
- Date picker in test panel
- Only dates with available data are selectable
- Default: most recent date with available data
- Loading state while data is fetched

### TP3: Filter Test Data by Entity and Row (High)
- Entity filter when entity field is mapped
- "Select All" when entity field not mapped
- Multi-entity selection
- Row-level filters on any visible column
- Test runs against filtered dataset

### TP4: View and Resolve Field Mapping Errors (High)
- Errors surfaced per field in test results (inline on affected column)
- Catches **runtime data errors** when actual data flows through mappings — not just schema-level mismatches. Examples: type coercion failures on specific rows (e.g., row 55 has a text value in a numeric target), nulls in required fields, unexpected values that don't match the target type.
- Error detail: failing field + human-readable reason + affected row(s)
- Error summary count in header
- "Fix this" CTA navigates back to the field mapping row. **6/30 scope:** user resolves by adjusting the source-to-target mapping; transformation-based fixes available in 9/30 (PRD 2b).
- Re-run test after fix without re-selecting filters
- Errors don't block viewing successful rows

### TP5: Publish Model (High)
- Publish button in model header or top-right
- **Blocked if mandatory fields unmapped** (surfaces specific fields)
- Effective Date prompt before publish completes
- Version 0 defaults to Jan 1, 1900 (full historical backfill — must communicate clearly)
- Success: Draft → Active, data processing begins
- Data Preview tab available post-publish

## Design Implications

- **Test panel** is an inline/split-view experience within Field Mapping tab
- Progressive filtering: date → entity → row-level
- Error rows distinguished from successful rows (red indicators)
- Each error has "Fix this" CTA — navigation pattern TBD (inline/modal/tab)
- Publish validation failure shown BEFORE Effective Date dialog
- Effective Date dialog must explain historical backfill implications in plain language
- "Confirm Publish" must be deliberate (not single-click)

## Version State Transitions

| From | Trigger | To |
|------|---------|-----|
| (none) | Create model | Draft |
| Draft | Publish succeeds | Active |
| Draft | Publish fails | Draft (retry) |
| Draft | Unmapped fields | Draft (blocked) |
| Active | Newer version published | Archived |

## Open Questions

| # | Question | Status |
|---|----------|--------|
| OQ-1 | Jan 1, 1900 confirmed as default? Cost/time of full backfill? | Open |
| OQ-2 | Unmapped mandatory = hard block or warning with override? | Open |
| OQ-3 | Should V0 expose Effective Date selector at all? | Open |
| OQ-4 | Can users upload CSV to test when no data loaded? | Open |
| OQ-5 | Partial dataset availability: proceed with warning or block? | Open |
| OQ-6 | "Fix this" navigation: inline, modal, or tab? | Open |

## Gaps (9 total)

Key blocking gaps:
- **G1:** No path for testing when no source data loaded (CSV upload undefined)
- **G2:** Jan 1, 1900 default not confirmed with data platform team (blocking)
- **G4:** No error path for failed publish
- **G5:** Error resolution UX ("Fix this") pattern undefined
