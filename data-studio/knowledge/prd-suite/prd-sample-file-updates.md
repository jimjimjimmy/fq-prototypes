# PRD: Sample File Updates

| Field | Value |
|---|---|
| **Owner** | Alex Kearns |
| **Status** | Draft |
| **Epic / Jira** | IDEA-2630 |
| **Last Updated** | 2026-06-18 |
| **Target Release** | 2026-09-30 |
| **Dependencies** | Data Test |

---

## Objective

Today, when configuring a source dataset, admins provide a sample file by uploading it manually through the UI. This creates two gaps: first, admins who have already set up their connector and have files arriving programmatically still need to locate and upload a separate sample — even when a real file is already in the system. Second, the manually uploaded sample may differ from what actually arrives at runtime — different filename conventions, minor structural variations, or additional columns. There is also no way to delete a sample file once uploaded.

This PRD introduces two improvements to sample file management for file-based connectors:

1. **Select from connector files** — Admins can choose a sample file directly from files already received via the connector, rather than uploading one manually. The selected file drives the file identification pattern the same way a manually uploaded sample does today.
2. **Delete sample file** — Admins can remove an uploaded sample file. Behavior differs depending on whether the dataset has been saved — unsaved datasets clear derived fields; saved datasets preserve configuration but warn the admin of implications for data testing on linked models.

When this ships, admins can use real, programmatically delivered files as their sample — eliminating the need for a separate manual upload when files are already flowing, and reducing the gap between setup-time configuration and what actually arrives at runtime.

---

## Definitions & Terms

See the canonical [Definitions & Terms](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409) page.

---

## Why This Is Important

Sample file configuration is the foundation of source dataset setup — it drives the file identification pattern, informs the schema, and establishes the baseline for data testing. Getting it wrong, or working around it with an imperfect substitute, creates downstream problems that are hard to diagnose.

Today's manual upload-only approach introduces unnecessary friction at two points. During initial setup, admins who have already connected their SFTP and have real files arriving are forced to re-upload a file they already have in the system — an extra step that adds no value and introduces the risk of using a stale or slightly different file. Later, if the real file differs structurally from the uploaded sample, the mismatch is silent — there's no warning, and the implications only surface when testing or processing fails.

The inability to delete a sample file compounds this — once uploaded, admins have no recourse if the wrong file was used or if the source format has changed.

These are solvable friction points with meaningful downstream impact. Letting admins work with the files that are actually in their connector removes a class of setup errors before they happen.

---

## Key Benefits

| Beneficiary | Benefit |
|---|---|
| **Data Studio admins** | Can use real connector files as the sample — no need to locate and re-upload a file that's already in the system |
| **Data Studio admins** | Can remove a sample file that's no longer needed or was uploaded in error |
| **Engineering / Support** | Reduces a class of silent setup errors caused by mismatch between the sample file and the actual incoming file |

---

## Use Cases

1. **Select from connector files during setup** — An admin has configured their SFTP connector and files are already arriving. Rather than uploading a separate sample, they select an existing connector file directly from the source file list to drive the file identification pattern and schema configuration.

2. **Select from connector files on an existing dataset** — An admin wants to update the sample file on a dataset that's already saved. They select a file from the connector. If the new file has a different schema (columns or data types), they are warned before the change is applied.

3. **Delete a sample file** — An admin removes a sample file that was uploaded in error. If the dataset hasn't been saved yet, derived fields are cleared. If the dataset has already been saved, the admin is warned that this sample file will no longer be available as a test file for linked models.

---

## Assumptions — Established

1. This feature applies to file-based connectors only — CDC and API connectors are out of scope.
2. Selecting a file from the connector behaves identically to a manual upload for file identification pattern derivation — the filename is used to populate the pattern the same way it is today.
3. When a connector file is selected as the sample, it is not labeled as a "sample" in the Data Test — it is treated as a regular file.
4. Schema comparison on file replacement checks column names and data types only.
5. Deleting a sample file on an unsaved dataset clears all derived fields (file identification pattern, schema).
6. Deleting a sample file on a saved dataset preserves all derived fields but warns the admin that this sample file will no longer be available as a test file for linked models.

---

## Open Items to Confirm

| # | Item | Owner | Status |
|---|---|---|---|
| OI-1 | When an admin selects a new file from the connector on a saved dataset and the schema differs, do they see the warning and can still proceed, or is the change blocked until they acknowledge? | Engineering / PM | Open |
| OI-2 | Is there a file size or age limit on which connector files are available for selection as a sample? | Engineering | Open |
| OI-3 | If two source datasets within the same connector select the same file as their sample, is there a conflict? Should the system surface a warning or prevent it? | Engineering / PM | Open |

---

## Scope

**In Scope**

- Select a sample file from files already received via the connector (file-based connectors only)
- Upload a sample file manually (existing behavior — preserved)
- Delete a sample file
- Warning when deleting a sample file on a saved dataset
- Warning when replacing a sample file on a saved dataset with a file that has a different schema (columns or data types)
- File identification pattern derived from connector file selection, same as manual upload today

**Out of Scope**

- CDC and API connectors — file-based connectors only
- Schema mismatch handling beyond the replacement warning — no automatic schema migration or field remapping
- Automatic re-processing or re-testing when a sample file is replaced
- Schema versioning or change management triggered by sample file updates
- Ability to preview the source dataset — future consideration

---

## Requirements

### Story 1: Select a sample file from connector files

**As a** Data Studio admin, **I want to** select a sample file from files already received via the connector **so that** I can configure my dataset using a real file without needing to upload a separate sample.

**Acceptance Criteria:**
- AC1: In the source file selection step, the admin is presented with two options: "Select from Connector Files" and "Upload Sample File"
- AC2: The "Select from Connector Files" tab shows files already received via the connector, including file name, user, folder, received date, and size
- AC3: The connector files list is sortable, with sort by date received as the default
- AC4: The admin can select one file from the list to use as the sample
- AC5: Selecting a file from the connector drives the file identification pattern using the same logic as a manually uploaded sample file
- AC6: The selected connector file is not labeled as a "sample" in the Data Test — it is treated as a regular file
- AC7: This option is only available for file-based connectors — it does not appear for CDC or API connectors

---

### Story 2: Delete a sample file

**As a** Data Studio admin, **I want to** delete a sample file **so that** I can remove a file that was uploaded in error or is no longer relevant.

**Acceptance Criteria:**
- AC1: An admin can delete a sample file from the source file configuration step
- AC2: If the dataset has **not yet been saved**, deleting the sample file clears all derived fields — including the file identification pattern and schema
- AC3: If the dataset has **already been saved**, the admin is shown a warning that this sample file will no longer be available as a test file for linked models — other received files can still be used for testing
- AC4: On a saved dataset, confirming the delete removes the sample file reference but preserves all derived fields — the file identification pattern and schema remain intact
- AC5: After deletion the admin can upload a new sample file or select one from the connector

---

### Story 3: Replace a sample file with schema warning

**As a** Data Studio admin, **I want to** be warned when I replace a sample file with one that has a different schema **so that** I understand the implications before the change is applied to a saved dataset.

**Acceptance Criteria:**
- AC1: When an admin selects a new sample file on a saved dataset — either by uploading or selecting from connector files — the system compares the new file's schema against the existing schema
- AC2: If the new file has a different schema (columns or data types differ), the admin is shown a warning before the change is applied
- AC3: The warning identifies what has changed — columns added, removed, or with changed data types
- AC4: The admin can proceed with the replacement after acknowledging the warning, or cancel and keep the existing sample file
- AC5: If the new file's schema matches the existing schema, no warning is shown and the replacement proceeds normally

---

## UX Requirements

**Reference:** [Sample File Updates prototype — Figma Make](https://www.figma.com/make/G0V2o5tpQmUUZLgrgBnSJf/SFTP---CSP---File-Upload)

**Source File Selection — two tabs**
- "Select from Connector Files" tab shows a paginated table of files received via the connector: file name, user, folder, received date, size
- Table is sorted by date received by default
- "Upload Sample File" tab preserves the existing manual upload experience (drag and drop, file size limit, supported formats)
- The currently selected sample file is shown regardless of which tab is active

**Select from Connector Files**
- Files are paginated
- Admin selects one file via a radio button
- Selected file is confirmed visually before saving

**Delete Sample File**
- Delete action is available from the sample file configuration step
- Triggers a confirmation with context-appropriate warning (saved vs. unsaved dataset)

**Replace with Schema Warning**
- Warning appears before the replacement is confirmed
- Identifies specific schema differences (added/removed columns, changed data types)

**Open UX questions for designer:**
- What is the empty state when no sample file has been selected and no connector files are available yet?
- How is the currently active sample file indicated in the connector files list if it was previously selected from there?
- Does the schema warning appear as a modal, inline banner, or confirmation dialog?

---

## Open Questions

| # | Question | Owner |
|---|---|---|
| OQ-1 | When an admin selects a new file from the connector on a saved dataset and the schema differs, do they see the warning and can still proceed, or is the change blocked until they acknowledge? | Engineering / PM |
| OQ-2 | Is there a file size or age limit on which connector files are available for selection as a sample? | Engineering |
| OQ-3 | If two source datasets within the same connector select the same file as their sample, is there a conflict? Should the system surface a warning or prevent it? | Engineering / PM |

---

## Gaps

1. **Schema mismatch handling beyond replacement warning** — When a sample file is replaced and the schema differs, the admin is warned but no automatic remediation is offered. Field mappings that reference removed or renamed columns will be broken after the replacement. Resolving those mappings is left entirely to the admin with no guided workflow. A future guided re-mapping flow would close this gap.

2. **Source dataset preview** — There is no ability to preview the contents of a selected connector file before committing it as the sample. Admins are selecting based on filename, date, and size alone. A preview capability is a natural follow-on.

3. **File list management** — Connector files are never removed from the system today, meaning the list of available files will grow indefinitely over time. No archiving, filtering, or cleanup mechanism is defined in this PRD.

---

## References

| Resource | Link |
|---|---|
| Definitions & Terms | [Confluence](https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869409) |
| Sample File Updates prototype | [Figma Make](https://www.figma.com/make/G0V2o5tpQmUUZLgrgBnSJf/SFTP---CSP---File-Upload) |
| IDEA-2630 — Refining File Ingestion Experience | [Jira](https://floqast.atlassian.net/jira/polaris/projects/IDEA/ideas/view/11291632?selectedIssue=IDEA-2630) |
