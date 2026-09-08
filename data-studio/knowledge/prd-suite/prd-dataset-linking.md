# Data Studio: Dataset Linking (DRAFT)

| Field | Value |
|---|---|
| **Target release** | 2026-06-30 |
| **Epic** | _(link to epic)_ |
| **Idea Link** | [IDEA-2487 — SFTP Multi-File Handling + Global Dimension](https://floqast.atlassian.net/browse/IDEA-2487) |
| **Document status** | DRAFT |
| **Document owner** | Alex Kearns |
| **Designer** | _(assign)_ |
| **Tech lead** | _(assign)_ |
| **Technical writers** | _(assign)_ |
| **QA** | _(assign)_ |
| **Depends on** | [Model Creation — 1 of 4: Model Creation & Source Configuration](https://floqast.atlassian.net/wiki/spaces/Data/pages/4450189505) _(parallel — some interactions expected)_ |
| **Related sub-PRDs** | [Model Creation 1 of 4](https://floqast.atlassian.net/wiki/spaces/Data/pages/4450189505) · Global Dimensions _(TBD)_ |

---

## 🎯 Objective

Today, customers whose data providers deliver data across multiple files have no self-service path to combine them in Data Studio. Joining datasets requires engineering intervention — custom scripting that is slow, hard to maintain, and doesn't scale as the customer base grows.

This PRD defines the Dataset Linking capability in Data Studio: a guided, no-code interface that allows admins and implementation team members to define how two or more source datasets connect — specifying the join key between them — without writing SQL or opening a support ticket. When this ships, any admin can configure a multi-dataset Model independently, making complex data source configurations self-service for the first time.

> ⚠️ **Production context (audit 2026-04-01):** The current production UI includes a "Secondary sources" section on the Sources tab that is non-functional. This section is the intended predecessor to the Dataset Linking capability defined in this PRD — the "Link Datasets" flow replaces and supersedes it. Engineering should remove or replace the non-functional Secondary sources section when this feature ships.

---

## 🔤 Definitions & Terms

For all terms used in this PRD, see the shared [Definitions & Terms (Data Studio)](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409) page. Key terms relevant to this PRD: **Join Key**, **Linked Dataset**, **Primary Dataset**, **Grouped Datasets**.

---

## 🏅 Why This Is Important

FloQast's Data Platform 2.0 is built to scale — but until now, each Model has been constrained to a single source dataset. For customers whose data providers deliver data across multiple files, combining those sources has required engineering intervention: custom scripting that is slow, error-prone, and impossible to maintain at scale.

Dataset Linking removes that constraint. By giving admins a self-service interface to define how datasets relate to one another, FloQast can support a broader range of customer data configurations without engineering involvement.

This capability matters on two fronts:

- **Source-side flexibility** — customers are no longer limited by how their data provider structures their data exports. Multi-file sources become first-class configurations in Data Studio.
- **Broader data for downstream products** — linking datasets on the source-to-target side gives Models more breadth of data to work with, unlocking downstream products like AI Variance and reporting that depend on richer data.

Without Dataset Linking, both the scalability of customer onboarding and the reach of AI-powered features are limited.

---

## 💡 Key Benefits

1. **Self-service for admins and implementation teams** — linking datasets no longer requires engineering involvement.
2. **Flexibility on the source side** — customers are no longer constrained by how their data provider structures file exports.
3. **Greater data breadth for downstream products** — linking datasets gives Models access to a wider set of fields, enabling AI Variance and reporting that depend on richer data.
4. **Scales with customer complexity** — as FloQast serves larger and more complex customers, Dataset Linking ensures that implementation complexity stays manageable without growing the engineering burden.

---

## ✅ Use Cases

| # | Persona | Scenario | Expected Outcome |
|---|---|---|---|
| 1 | Admin / Implementation Team | Customer delivers GL transactions in one file and a "Transaction Types" file separately each period. The shared field is `Transaction_Type_ID`. | Admin links both datasets in Data Studio, selects `Transaction_Type_ID` as the join key on each side, and the Model produces a combined output without pre-processing. |
| 2 | Admin / Implementation Team | The join key exists as a single column in one dataset, but in the other it is split across two columns that must be concatenated (e.g., `Entity_Code` + `Account_Code` → `Entity_Account`). | Admin defines a concatenated join key expression in the linking UI. |
| 3 | Admin / Implementation Team | The join relationship requires matching multiple columns simultaneously — a composite key (e.g., `Company_ID` + `Period` must both match). | Admin selects multiple fields on each side to form a composite join key. |
| 4 | Admin / Implementation Team | Admin has configured a link but the join key values don't align — e.g., one dataset uses numeric IDs and the other uses string codes for the same field. | The linking UI surfaces a preview showing unmatched rows, allowing the admin to identify and correct the mismatch before publishing. |
| 5 | Admin / Implementation Team | Customer's linked Model is configured and published. AI Variance consumes the Model's output. | AI Variance receives a wider set of fields from the combined dataset, enabling analysis that wasn't possible from a single-file source. |

---

## 🤔 Assumptions — Established

1. Admins and FloQast implementation teams are the only users who configure dataset linking. The flow is identical for both.
2. The linking UI abstracts all join logic — users select fields from dropdowns. Raw SQL is not exposed.
3. Connectors must be configured and datasets available in Data Studio before linking can be configured.
4. A Model with multiple Linked Datasets must have exactly one Primary Dataset designated.
5. Concatenated and composite join keys are in scope — a user may need to combine columns to produce a matching key.
6. Linking is always primary-anchored. When three or more datasets exist, each non-primary dataset has its own independent join configuration against the primary.
7. Left join and inner join are supported in v1. Additional join types will be evaluated in future releases.

---

## 🔲 Open Items to Confirm

| # | Question | Owner | Status |
|---|---|---|---|
| OI-1 | Left and inner join confirmed for v1. Confirm whether admin selects the join type or if a default is enforced. | Engineering | Open |
| OI-2 | Is there a limit on the number of datasets that can be linked in a single Model? | Engineering | Open |
| OI-3 | How are join key mismatches surfaced — in the linking UI preview, at publish time, or in the pipeline logs? | Engineering | Open |
| OI-4 | Does concatenation logic in a join key use the same expression syntax as field mapping transformation functions? | Engineering | Open |

---

## 🗺️ Scope

### In Scope

- Dataset linking for Models across all connector types (SFTP, CDC, Manual Upload, API)
- Simple join key definition — selecting a single matching field from each dataset
- Composite join keys — matching on multiple fields simultaneously
- Concatenated join keys — combining two or more columns in a source dataset to match a field in another
- Admin-selectable join type: left join and inner join
- Preview of linking output in the UI, including surfacing of unmatched rows
- Support for linking two or more Linked Datasets (including Grouped Datasets as one side of a join)
- AI-assisted join key suggestion, with fallback to exact and deductive column name matching

### Out of Scope

- **Additional join types beyond left and inner** (e.g., right, full outer) — may be added in a future release
- **End-user configuration** — dataset linking is not configurable by individual end users
- **Raw SQL access** — the UI abstracts all join logic. Direct SQL entry is not supported
- **Global Dimensions** — FloQast-managed shared dimensions are covered in a separate sub-PRD
- **Grouped Dataset configuration** — grouping schema-identical files is covered in Model Creation 1 of 4
- **Write-back / bi-directional sync** — read-only ingestion only

---

## 📋 Requirements

### Quick Reference

| # | Story | Importance |
|---|---|---|
| DL1 | Add Linked Datasets to a Model | High |
| DL2 | Open the Link Datasets modal and confirm or override the suggested join | High |
| DL3 | Define a composite join key | High |
| DL4 | Define a concatenated join key | High |
| DL5 | Select join type using plain-language options | High |
| DL6 | Link three or more datasets from the primary | High |
| DL7 | Preview linking output and identify mismatches | High |
| DL8 | Edit or remove a Linked Dataset | Medium |

---

### DL1 — Add Linked Datasets to a Model

**User Story:** As an admin, I can add one or more source datasets to a Model so that my Model draws from multiple sources.

**Acceptance Criteria:**

**AC-DL1-01 — "Link Datasets" button appears when the required dataset combination exists**
```
Given I am on the Source Datasets tab for a Model in Draft state
When I have added 2+ non-grouped datasets, 1+ non-grouped and 1+ grouped datasets, or 2+ grouped datasets
Then a "Link Datasets" button becomes available
```

**AC-DL1-02 — Primary Dataset must be designated before linking**
```
Given a Model has more than one Linked Dataset
When I attempt to link datasets without a Primary Dataset designated
Then the system requires me to designate a Primary Dataset first
And an inline prompt indicates this requirement
```

**AC-DL1-03 — A Grouped Dataset can serve as one side of a link**
```
Given I have a Grouped Dataset configured for this Model
When I add a second Linked Dataset
Then I can proceed to define a join key between the Grouped Dataset and the second dataset
```

---

### DL2 — Open the Link Datasets Modal and Confirm or Override the Suggested Join

**User Story:** As an admin, when I click "Link Datasets" I am shown a suggested join configuration that I can confirm or override.

**Acceptance Criteria:**

**AC-DL2-01 — Modal opens with a system-suggested join key**
```
Given I click "Link Datasets"
When the modal opens
Then the system displays a suggested join key based on AI-assisted matching, exact column name matching, or deductive column name matching — in that order of precedence
And the suggested fields are pre-selected on both sides
```

**AC-DL2-02 — User can accept the suggestion as-is**
```
Given the modal is open with a suggested join key
When I confirm the suggestion without changes
Then the join key is saved as suggested
```

**AC-DL2-03 — User can override the suggested join key**
```
Given the modal is open with a suggested join key
When I select different fields from the dropdowns on either side
Then the override replaces the suggestion
And I can save the updated join configuration
```

**AC-DL2-04 — Both sides of the join key must be defined before saving**
```
Given I am in the Link Datasets modal
When I attempt to save with one side of the join key undefined
Then the modal does not close
And an inline validation error indicates that both sides are required
```

---

### DL3 — Define a Composite Join Key

**User Story:** As an admin, I can match on multiple fields simultaneously when a single field is not sufficient to define the relationship between two datasets.

**Acceptance Criteria:**

**AC-DL3-01 — Additional field pairs can be added within the modal**
```
Given I am in the Link Datasets modal
When I add a second field pair to the join key
Then both field pairs are used together to define the relationship
```

**AC-DL3-02 — Each field pair in a composite key must have both sides defined**
```
Given I have added multiple field pairs
When I attempt to save with an incomplete field pair
Then the modal does not close
And an inline validation error indicates which pair is incomplete
```

---

### DL4 — Define a Concatenated Join Key

**User Story:** As an admin, I can combine two or more columns from one dataset into a single expression to match a field in the other dataset.

**Acceptance Criteria:**

**AC-DL4-01 — Concatenation can be defined on either side of a join key within the modal**
```
Given I am in the Link Datasets modal
When I select the concatenation option on one side
Then I can select two or more columns from that dataset to combine into a single join key expression
```

**AC-DL4-02 — A preview within the modal reflects the concatenated value**
```
Given I have defined a concatenated join key expression
When I view the modal preview
Then the concatenated value is shown alongside the corresponding field from the other dataset
```

---

### DL5 — Select Join Type Using Plain-Language Options

**User Story:** As an admin, I can select how unmatched rows are handled using plain-language options rather than SQL join terminology.

**Acceptance Criteria:**

**AC-DL5-01 — Join type is presented as plain-language options**
```
Given I am in the Link Datasets modal
When I select the join type
Then I am presented with two options:
  - "Keep all rows from primary dataset" (left join)
  - "Only keep rows which exist in primary and secondary sources" (inner join)
```

**AC-DL5-02 — Selected join type is indicated in the Source Datasets tab after saving**
```
Given I have saved a linking configuration
When I view the Source Datasets tab
Then the join type label is shown next to the primary dataset — either "Keep all rows" or "Keep only common rows"
```

---

### DL6 — Link Three or More Datasets from the Primary

**User Story:** As an admin, when I have three or more datasets, I can define a separate join configuration between the primary dataset and each additional dataset.

**Acceptance Criteria:**

**AC-DL6-01 — Each non-primary dataset has its own join configuration against the primary**
```
Given a Model has three or more Linked Datasets with one designated as Primary
When I open the Link Datasets modal
Then I can define a separate join key and join type between the Primary dataset and each additional dataset independently
```

**AC-DL6-02 — All non-primary datasets must have a join defined before the Model can be published**
```
Given a Model has three or more Linked Datasets
When I attempt to publish without a join defined for every non-primary dataset
Then publishing is blocked
And the system indicates which datasets are missing a join configuration
```

---

### DL7 — Preview Linking Output and Identify Mismatches

**User Story:** As an admin, I can preview the result of my linking configuration and identify rows that do not match before publishing.

**Acceptance Criteria:**

**AC-DL7-01 — A preview of the combined output is available after a join is saved**
```
Given I have saved a join configuration between two datasets
When I open the linking preview
Then I can see a sample of the combined output reflecting the defined join and join type
```

**AC-DL7-02 — Unmatched rows are surfaced in the preview**
```
Given my join key values do not fully align between datasets
When I view the linking preview
Then unmatched rows are visually indicated
And I can identify which rows from each dataset failed to match
```

---

### DL8 — Edit or Remove a Linked Dataset

**User Story:** As an admin, I can edit or remove a Linked Dataset from a Model in Draft state.

**Acceptance Criteria:**

**AC-DL8-01 — A Linked Dataset can be removed from a Model in Draft state**
```
Given a Model is in Draft state with multiple Linked Datasets
When I remove a Linked Dataset
Then the dataset is disassociated from the Model
And any join configuration referencing that dataset is also removed
```

**AC-DL8-02 — Removing the Primary Dataset requires a new Primary to be designated**
```
Given I remove the dataset currently designated as Primary
Then the system requires me to designate a new Primary Dataset before proceeding
And an inline prompt indicates this requirement
```

---

## 🎨 UX Requirements

### Source Datasets Tab — Linking Entry Point

The "Link Datasets" button appears on the Source Datasets tab once the user has added a qualifying combination of datasets (2+ non-grouped, 1+ non-grouped + 1+ grouped, or 2+ grouped). The button does not appear with a single dataset.

After a linking configuration is saved, the join type label is displayed next to the Primary Dataset on the Source Datasets tab:
- "Keep all rows" — if left join was selected
- "Keep only common rows" — if inner join was selected

To edit an existing linking configuration, the user clicks "Link Datasets" again from the Source Datasets tab. The modal reopens with the previously saved configuration pre-populated.

### Link Datasets Modal

The modal is the single interface for all linking configuration. It handles:

- Simple join key selection (field dropdowns on each side)
- Composite join keys (adding additional field pairs)
- Concatenated join keys (combining columns on one side)
- Join type selection via plain-language options
- System-suggested join key (AI-assisted → exact match → deductive name match)

For Models with 3+ datasets, each non-primary dataset has its own join configuration against the primary, defined within the same modal.

Prototype: [Source Datasets — Linking and Grouping](https://www.figma.com/make/shPr2fQIIEGWp7zqV8oZCp/Source-Datasets---Linking-and-Grouping?t=9paoCvzG7wTVEgyS-1)

### Designer to Define

The following states and interactions are intentionally left for the designer to specify:

- Visual treatment of the join type label on the Source Datasets tab
- Layout and interaction pattern for composite and concatenated key configuration within the modal
- How unmatched rows are visually indicated in the linking preview
- Error and validation state styling within the modal
- How 3+ dataset join configurations are presented within a single modal (e.g., tabs, accordion, sequential steps)

---

## ❓ Open Questions

| # | Question | Owner | Status |
|---|---|---|---|
| OQ-1 | What is the fallback behavior when the AI suggestion has low confidence — does it show a suggestion with a confidence indicator, or default to manual selection? | Engineering | Open |
| OQ-2 | How are join key mismatches surfaced — in the modal preview, at publish time, or in the pipeline logs? | Engineering | Open |
| OQ-3 | Does concatenation logic in a join key use the same expression syntax as field mapping transformation functions? If so, does `CONCATENATE_COLUMNS()` from the Transformation Logic library apply here, or is join key concatenation a separate implementation? | Engineering | Open |
| OQ-4 | Is there a limit on the number of datasets that can be linked in a single Model? | Engineering | Open |
| OQ-5 | When a linking configuration is changed on an existing published Model, does it trigger a new version or is it treated as a source configuration change? | Engineering / Product | Open |
| OQ-6 | Are there performance implications for joining large datasets that should be surfaced to the admin before publishing? | Engineering | Open |

---

## 🔍 Gaps

1. **Right join and full outer join** — left and inner join are supported in v1. Right join and full outer join are deferred to a future release as use cases become clearer.
2. **Linking configuration in versioning** — it is unclear how changes to a linking configuration interact with Model versioning (see OQ-5). This gap may surface requirements for a future update to the Versioning & Lifecycle sub-PRD.
3. **Linking validation in the pipeline** — the PRD defines preview-based mismatch detection in the UI, but does not specify how join errors are handled downstream in the pipeline. Deferred pending Engineering input on OQ-2.
4. **Suggested join quality feedback** — there is no mechanism defined for admins to provide feedback on whether a system suggestion was correct.
5. **Non-admin visibility into linking configuration** — read-only visibility of linking configuration for non-admin roles is not defined in this PRD.

---

## 📎 References

| Resource | Link |
|---|---|
| Figma Prototype — Source Datasets: Linking and Grouping | https://www.figma.com/make/shPr2fQIIEGWp7zqV8oZCp/Source-Datasets---Linking-and-Grouping?t=9paoCvzG7wTVEgyS-1 |
| JPD Idea — SFTP Multi-File Handling + Global Dimension | https://floqast.atlassian.net/browse/IDEA-2487 |
| Sub-PRD — Model Creation 1 of 4: Model Creation & Source Configuration | https://floqast.atlassian.net/wiki/spaces/Data/pages/4450189505 |
| Definitions & Terms (Data Studio) | https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409 |
| Confluence | https://floqast.atlassian.net/wiki/spaces/Data/pages/4500914307 |
