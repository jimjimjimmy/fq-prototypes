# Model Creation — 2a of 4: Field Mapping — Visual Refresh + AI-Suggested Mappings (DRAFT)

| Field | Value |
|-------|-------|
| **Source** | [Confluence — 2 of 4](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449927443) |
| **Status** | DRAFT |
| **Last updated** | Mar 19, 2026 |
| **Owner** | Alex Kearns |
| **Target release** | 2026-06-30 |
| **Related sub-PRDs** | 1 of 4: Model Creation & Source Configuration (6/30) · 2b of 4: AI-Assisted Transformation Functions (9/30) · 3 of 4: Testing & Publishing (6/30) · 4 of 4: Versioning & Lifecycle (6/30) |
| **Related PRDs** | [QBO Transformation Functions (RBC)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4484530409/QBO+Transformation+Functions+DRAFT) |

---

## Objective

Model Lineage (also called "Model") is the source-to-target mapping capability within Data Studio. It enables admins and implementation team members to bring in external datasets, map fields to FQ's normalized format, and publish so downstream products (Close, Flux, Compliance, Consolidation) can consume the data. This PRD covers the Field Mapping step — the highest-effort, highest-risk step in Model configuration. Errors here propagate silently into downstream FQ products.

This PRD has been split into two releases. This document (PRD 2a, target 6/30) covers the field mapping page redesign, AI-suggested source-to-target mappings, many-to-one mapping, custom fields, and field-level validation. Transformation logic definition (function-based and AI-assisted rule authoring via AI Chat Modal) is covered in PRD 2b: AI-Assisted Transformation Functions (target 9/30). See also QBO Transformation Functions (RBC) at https://floqast.atlassian.net/wiki/spaces/Data/pages/4484530409/QBO+Transformation+Functions+DRAFT

The Field Mapping page is where the admin defines how each source field maps to each FQ target field. AI-suggested mappings are provided on first load, but always require user confirmation. Many-to-one source field mapping enables customers with complex schemas to map multiple source fields to a single FQ target field. Custom fields allow admins to extend the target schema beyond the mandatory FQ fields.

---

## Why This Is Important

Model creation currently requires significant engineering involvement from both FQ implementation team and customer IT. The field mapping step is the most time-consuming and error-prone part of this process. AI-native, self-service field mapping will reduce time from contract to first data in FQ products.

**Current experience limitations:**

The current field mapping experience uses a 1-to-1 "Actions" lightning bolt pattern that is unintuitive and slow. Field mappings are defined one at a time, with no AI assistance, and there is no visual feedback about progress or completion.

**This experience does not include some critical functionality such as:**

- **Many-to-one source field mapping** — customers with complex schemas (e.g., first name + last name → full name) cannot map multiple source fields to a single FQ target field today
- **Transformation logic definition (functions)** — admins cannot define transformation rules (e.g., To_Upper, date parsing, conditional logic) as part of the field mapping workflow *(targeted for 9/30 in PRD 2b: AI-Assisted Transformation Functions)*
- **AI-assisted transformation authoring** — admins cannot describe a transformation in natural language and have AI generate the expression *(targeted for 9/30 in PRD 2b: AI-Assisted Transformation Functions)*

---

## Key Benefits

- **Zero-engineering field mapping** — admins can configure field mappings without FQ engineering involvement
- **AI-native mapping (hours to minutes)** — AI suggests source-to-target mappings on first load, dramatically reducing time spent on initial configuration
- **Many-to-one mapping support** — unblocks customer schemas that were previously unsupported (e.g., 200+ file customers with split fields)
- **AI-assisted normalization/mapping logic** — AI helps with data format normalization and mapping logic definition *(target: 9/30 — see PRD 2b)*

---

## Use Cases

### UC1 — First-time field mapping for a new model

An admin creates a new model, links source datasets, and navigates to the Field Mappings tab. AI analyzes the linked source schema and suggests source-to-target mappings. The admin reviews each suggestion, confirms or overrides, and saves.

### UC2 — Mapping source fields to mandatory FQ target fields

An admin sees all mandatory FQ target fields pre-populated in the field mapping grid. Unmapped mandatory fields are visually distinguished. The admin maps each mandatory field and sees a progress indicator showing completion.

### UC3 — Many-to-one source field mapping (e.g., first name + last name → full name)

An admin needs to map multiple source fields to a single FQ target field. They select multiple source fields for the target field, and the UI clearly represents the multi-field selection.

> **Note:** The selection of multiple source fields for a single target is in scope for the 6/30 release. The concatenation/combination logic definition (e.g., how first name and last name are combined into full name) is covered in PRD 2b: AI-Assisted Transformation Functions (target 9/30).

### UC4 — Adding a custom field

An admin needs to map a source field that does not correspond to any mandatory FQ target field. They add a custom field, define its data type, and map it to the source field.

### UC5 — Date parsing transformation (e.g., "MM/DD/YYYY" → "YYYY-MM-DD")

An admin needs to define a transformation rule that parses dates from the source format into the FQ target format.

> **Note:** This use case is moved to PRD 2b: AI-Assisted Transformation Functions (target 9/30). The transformation logic editor required for date parsing is out of scope for the 6/30 release.

### UC6 — Reviewing and adjusting AI-suggested mappings

An admin reviews the AI-suggested mappings, confirms correct suggestions, and overrides incorrect ones. The admin can also clear a suggestion and manually select a different source field.

---

## Assumptions

- AI suggestions are generated once on initial Draft creation only (pending confirmation — see OQ-3)
- Standard Models bypass AI and use pre-defined default mappings
- Source selector for custom fields is populated exclusively from Linked Datasets
- Autosave is the only save mechanism (no manual Save button)
- Tab is not accessible until source datasets are linked (Sub-PRD 1 dependency)
- Field mappings are per-model, not shared across models

---

## Milestones

| Phase | Description | Target |
|-------|-------------|--------|
| Phase 1 | Natural Language Transformation Authoring (AI Chat Modal) | 9/30 — Moved to PRD 2b |
| Phase 2 | Field Mapping Grid Redesign + AI-Suggested Mappings | 6/30 |
| Phase 3 | Many-to-One Mapping + Custom Fields + Validation | 6/30 |

---

## Scope

### In Scope (6/30)

- Field mapping grid redesign (visual refresh)
- AI-suggested source-to-target mappings on first draft
- Many-to-one source field mapping (selection UI)
- Custom field creation and mapping
- Autosave with visual indicator
- Progress indicator (mapped vs total required)
- Unmapped mandatory field visual distinction
- Field mapping validation and error handling (FM6-LC)

### Out of Scope

- Field rule logic definition — manual (functions) and AI-assisted (moved to PRD 2b: AI-Assisted Transformation Functions, target 9/30)
- AI Chat Modal for natural language transformation authoring (moved to PRD 2b)
- Transformation function library / syntax definition (moved to PRD 2b)
- Entity Mapping tab behavior (unowned — see Overview PRD)
- Data Preview tab (Sub-PRD 5)

---

## Requirements Quick Reference

| ID | Requirement | Priority |
|----|-------------|----------|
| FM1-LC | Field Mapping List — AI-Assisted | High |
| FM2-LC | AI Draft of Field Mappings | Medium |
| FM3-LC | Many-to-One Source Field Mapping | High |
| FM4-LC | Add Custom Fields | High |
| FM6-LC | Field Mapping Validation & Error Handling | High |

> **Note:** FM5-LC (Define Transformation Logic — AI & Functions) has been moved to PRD 2b: AI-Assisted Transformation Functions (target 9/30).

---

## Detailed Requirements

### FM1-LC — Field Mapping List — AI-Assisted

**User Story:** As an admin, I want to see all mandatory FQ target fields pre-populated in the field mapping grid so that I know exactly which fields need to be mapped.

**Importance:** High

**Details:** When the admin navigates to the Field Mappings tab, all mandatory FQ target fields for the selected domain are pre-populated in a grid. Each row shows the field name, data type, and current mapping status. Unmapped mandatory fields are visually distinguished from mapped fields. A progress indicator shows mapped vs total required fields. The tab is not accessible until source datasets are linked (Sub-PRD 1).

**Acceptance Criteria:**

**AC-FM1-01 — Mandatory fields pre-populated**
- Given I navigate to the Field Mappings tab
- When source datasets have been linked
- Then all mandatory FQ target fields for the selected domain are displayed as rows in the grid

**AC-FM1-02 — Row displays field metadata**
- Given I am on the Field Mappings tab
- When I view a field mapping row
- Then I see the target field name, data type, and current mapping status (unmapped, AI suggested, confirmed, custom)

**AC-FM1-03 — Unmapped fields visually distinguished**
- Given mandatory FQ target fields exist that are not yet mapped
- When I view the field mapping grid
- Then unmapped mandatory fields are visually distinguished from mapped fields (e.g., highlighted, icon, badge)

**AC-FM1-04 — Progress indicator**
- Given I am on the Field Mappings tab
- When I have mapped some but not all mandatory fields
- Then a progress indicator shows the count and/or percentage of mapped vs total required fields

**AC-FM1-05 — Tab gated on source datasets**
- Given I have not linked any source datasets
- When I attempt to navigate to the Field Mappings tab
- Then the tab is disabled or shows a zero-state directing me to link source datasets first

---

### FM2-LC — AI Draft of Field Mappings

**User Story:** As an admin, I want AI to analyze my linked source schema and suggest source-to-target field mappings so that I can start from an intelligent draft rather than mapping from scratch.

**Importance:** Medium

**Details:** When the admin first opens the Field Mappings tab on a new Draft, AI analyzes the linked source datasets' schemas and suggests source-to-target mappings. Suggestions are displayed inline on each row, labeled "AI suggested." Suggestions require user confirmation — they are not auto-applied. For Standard Models, AI is bypassed and pre-defined default mappings are used instead. A loading state is shown during AI analysis.

**Acceptance Criteria:**

**AC-FM2-01 — AI generates suggestions on first load**
- Given I navigate to the Field Mappings tab for the first time on a new Draft
- When source datasets are linked
- Then AI analyzes the source schema and suggests source-to-target mappings for each mandatory FQ target field

**AC-FM2-02 — Suggestions displayed inline**
- Given AI has generated mapping suggestions
- When I view the field mapping grid
- Then each suggested mapping is displayed inline on the corresponding row, labeled "AI suggested"

**AC-FM2-03 — Suggestions require confirmation**
- Given AI has suggested a mapping for a target field
- When I review the suggestion
- Then I can confirm, override, or clear the suggestion
- And no suggestion is applied without my explicit confirmation

**AC-FM2-04 — Standard Models use defaults**
- Given I am creating a Standard Model (not custom)
- When I navigate to the Field Mappings tab
- Then pre-defined default mappings are used instead of AI suggestions

**AC-FM2-05 — Loading state during AI analysis**
- Given AI is analyzing the source schema
- When I am on the Field Mappings tab
- Then a loading state is displayed indicating that AI is generating suggestions

---

### FM3-LC — Many-to-One Source Field Mapping

**User Story:** As an admin, I want to select multiple source fields for a single FQ target field so that I can handle schemas where target data spans multiple source columns.

**Importance:** High

**Details:** Admins can select multiple source fields from linked datasets for a single FQ target field. The UI clearly represents multi-field selections (e.g., chips, tags). Existing 1-to-1 mappings are unaffected.

**Notes:** This is a net-new capability that unblocks customer schemas that were previously unsupported. Transformation logic for defining how multiple source fields are combined will be covered in PRD 2b (9/30). At 6/30, the selection UI is delivered but complex combination logic (concatenation, coalescing, conditional) requires PRD 2b.

**Acceptance Criteria:**

**AC-FM3-01 — Select multiple source fields**
- Given I am mapping a source field to an FQ target field
- When I open the source field selector
- Then I can select multiple source fields from the linked datasets

**AC-FM3-02 — Multi-field selection UI**
- Given I have selected multiple source fields for a target field
- When I view the field mapping row
- Then the selected source fields are clearly represented (e.g., chips, tags, comma-separated list)

> **Note:** At 6/30, the transformation logic editor for multi-field mappings shows a placeholder state indicating that transformation functions are coming in the 9/30 release (PRD 2b).

**AC-FM3-03 — Existing 1-to-1 unaffected**
- Given I have existing 1-to-1 field mappings
- When many-to-one is enabled
- Then my existing 1-to-1 mappings continue to work without change

---

### FM4-LC — Add Custom Fields

**User Story:** As an admin, I want to add custom fields to the field mapping grid so that I can map source fields that do not correspond to mandatory FQ target fields.

**Importance:** High

**Details:** Admins can add custom target fields to the grid beyond the mandatory FQ fields. The source selector is populated exclusively from Linked Datasets. Custom fields are visually distinguished from mandatory fields. The admin defines the data type for each custom target field.

**Acceptance Criteria:**

**AC-FM4-01 — Add custom field**
- Given I am on the Field Mappings tab
- When I click "Add Custom Field" (or equivalent action)
- Then a new row is added to the grid for the custom target field

**AC-FM4-02 — Source selector from linked datasets**
- Given I am adding or editing a custom field mapping
- When I open the source field selector
- Then available source fields are populated exclusively from Linked Datasets

**AC-FM4-03 — Custom fields visually distinguished**
- Given I have added custom fields
- When I view the field mapping grid
- Then custom fields are visually distinguished from mandatory FQ target fields (e.g., different icon, label, or section)

**AC-FM4-04 — Define data type for custom field**
- Given I am adding a custom target field
- When I configure the field
- Then I must define the data type for the custom target field

> **Note:** Transformation logic for custom fields will be fully available in PRD 2b (9/30). At 6/30, custom fields support 1:1 source-to-target mapping without transformation.

---

### FM5-LC — Define Transformation Logic (AI & Functions) — MOVED TO PRD 2b

> This story and all its acceptance criteria (AC-FM5-01 through AC-FM5-05) have been moved to PRD 2b: AI-Assisted Transformation Functions (target 9/30). See that document for full details.
>
> Cross-ref: [QBO Transformation Functions (RBC)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4484530409/QBO+Transformation+Functions+DRAFT) defines the QBO-specific function set that serves as the foundation for the function library.

---

### FM6-LC — Field Mapping Validation & Error Handling

**User Story:** As an admin, I want the system to validate my field mappings and surface errors inline so that I can fix issues before publishing.

**Importance:** High

**Details:** Validation runs on save/autosave and on publish attempt. Errors are surfaced inline on affected rows. Publish is blocked if any mandatory FQ target fields are unmapped or if there are blocking validation errors. This is critical because type mismatches and mapping errors may not be caught by schema-level checks alone — runtime data errors (e.g., row 55 has a text value in a numeric target) are caught during testing (Sub-PRD 3, TP4).

**Acceptance Criteria:**

**AC-FM6-01 — Publish blocked on unmapped mandatory fields**
- Given I attempt to publish (Sub-PRD 3)
- When one or more mandatory FQ target fields have no source mapping defined
- Then publish is blocked
- And I see a clear error indicating which specific fields are unmapped

**AC-FM6-02 — Data type mismatches flagged inline**
- Given I map a source field to an FQ target field
- When the source field data type is incompatible with the target field data type (e.g., text to numeric)
- Then a warning is displayed inline on that mapping row
- And the warning explains the type mismatch

**AC-FM6-03 — Validation runs on save/autosave and publish**
- Given I am on the Field Mappings tab
- When mappings are autosaved or I attempt to publish
- Then validation runs against all mapping rows
- And errors are surfaced inline on affected rows, not just as a generic banner

**AC-FM6-04 — Duplicate mapping warning**
- Given a source field is mapped to multiple target fields
- When this may be unintentional
- Then a warning is displayed indicating the duplicate
- And the warning does not block publish (it is informational)

**AC-FM6-05 — Invalid many-to-one combinations flagged**
- Given I have selected multiple source fields for a single target field
- When the selected source fields have incompatible data types
- Then an error is displayed on that mapping row
- And I cannot publish until the error is resolved

**AC-FM6-06 — All blocking errors must be resolved before publish**
- Given one or more blocking validation errors exist
- When I attempt to publish
- Then publish is blocked
- And each blocking error is clearly indicated with a path to resolution

---

## User Flow Reference

The Field Mapping workflow spans Steps 13–18 of the overall Lineage Creation user flow:

| Step | Description |
|------|-------------|
| Step 13 | Navigate to Field Mappings tab |
| Step 14 | AI analyzes source schema and suggests mappings (loading state) |
| Step 15 | Review mandatory FQ target fields — confirm or override AI suggestions |
| Step 16 | Add custom fields and map source fields |
| Step 17 | ~~Define Transformation Logic~~ (moved to PRD 2b) |
| Step 18 | Autosave — mappings are saved automatically |

---

## User Interaction & Design

### Key Design Questions

- How are AI suggestions visually distinguished from user-confirmed mappings?
- What does the source field selector look like for many-to-one mapping?
- How is the progress indicator displayed (badge, bar, percentage)?
- What is the zero-state when no source datasets are linked?
- How are custom fields visually distinguished from mandatory fields?
- What does the autosave indicator look like?

> **Note:** The following design questions are now PRD 2b scope:
> - What does the transformation logic editor look like?
> - How is the AI transformation assistant invoked?

### Key Design Decisions

- **Directed inline flow** is the primary AI interaction model for the 6/30 release — AI suggests source-to-target mappings inline, user reviews/confirms per row
- **Vertical left nav** replaces old sub-navigation under "Lineage"
- **Actions lightning bolt removed** — replaced by inline mapping UX
- **Autosave with visual indicator** — no manual Save button

---

## UI Changes

| Change | Description |
|--------|-------------|
| Field Mapping grid redesign | New grid layout with field name, data type, mapping status, source field selector per row |
| AI suggestion labels | "AI suggested" label/badge on rows with AI-generated mappings |
| Many-to-one chip UI | Multi-select chips/tags for rows with multiple source fields |
| Custom field section | Visually distinguished section or styling for custom fields |
| Progress indicator | Mapped vs total required fields indicator |
| Autosave indicator | Visual indicator for autosave status |
| Vertical left nav | Replaces old sub-navigation |
| Actions lightning bolt removed | Old pattern replaced by inline mapping UX |

> **Note:** "AI Chat Modal introduced" is now PRD 2b scope. The conversational AI interaction pattern for transformation authoring is not part of the 6/30 release.

---

## Future Considerations

- Transformation logic definition via function library and AI Chat Modal (PRD 2b, 9/30)
- Bulk operations (map/unmap multiple fields at once)
- Field mapping templates (reuse mappings across models)
- Source schema change detection and mapping update suggestions
- Mapping validation against sample data (preview before publish)

---

## Open Questions

| # | Question | Status |
|---|----------|--------|
| OQ-1 | Is adding a custom field a change requiring new version? | Resolved — Yes, adding a custom field creates a new Draft |
| OQ-2 | Loading state for AI suggestion — design + timing? | Open |
| OQ-3 | Does AI auto-suggestion run only once on initial draft? Product decision or technical constraint? | Open |

---

## Gaps

| # | Gap | Impact | Owner / Next Step |
|---|-----|--------|-------------------|
| G1 | Behavior when AI can't suggest mappings is undefined. What does the user see? Fallback to manual? Error state? | High | Product to define fallback UX |
| G2 | Autosave failure behavior is undefined. What happens if autosave fails? Does the user see an error? Can they retry? | High | Engineering + Product to define |
| G3 | The supported function library and syntax for transformation logic is undefined. **UPDATE: This gap is now owned by PRD 2b (target 9/30) and is no longer blocking the 6/30 release.** Engineering must define this before the transformation editor in PRD 2b can be fully designed or built. | ~~Blocking~~ Resolved for 6/30 | Engineering to publish the function library spec for PRD 2b. |
| G6 | Custom fields cannot use many-to-one mapping with transformation logic until PRD 2b delivers the transformation editor. At 6/30, custom fields support 1:1 mapping only. | High | Blocked on PRD 2b (9/30) |

---

## References

- [Overview & Index](https://floqast.atlassian.net/wiki/spaces/Data/pages/4444455089)
- [1 of 4: Model Creation & Source Configuration](https://floqast.atlassian.net/wiki/spaces/Data/pages/4450189505)
- [2 of 4: Field Mapping (original, pre-split)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449927443)
- 2b of 4: AI-Assisted Transformation Functions (9/30)
- [3 of 4: Testing & Publishing](https://floqast.atlassian.net/wiki/spaces/Data/pages/4449468593)
- [4 of 4: Versioning & Lifecycle](https://floqast.atlassian.net/wiki/spaces/Data/pages/4443013309)
- [Definitions & Terms](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409)
- [QBO Transformation Functions (RBC)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4484530409/QBO+Transformation+Functions+DRAFT) — https://floqast.atlassian.net/wiki/spaces/Data/pages/4484530409/QBO+Transformation+Functions+DRAFT
- [Jira Idea IDEA-2412](https://floqast.atlassian.net/jira/polaris/projects/IDEA/ideas/view/11291632?selectedIssue=IDEA-2412)
