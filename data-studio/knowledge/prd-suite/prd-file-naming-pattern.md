# 📄 PRD: File Naming Pattern (Dataset Definition)

| Field | Value |
|---|---|
| **Owner** | Alex Kearns |
| **Status** | Draft |
| **Target** | Q2 2026 (June 30, 2026) |
| **Epic** | IDEA-2487 — Data Studio: Multi-File Handling & Global Dimensions |
| **Related PRDs** | Eventing, Scheduling, On-demand Refresh, Logging & Audit (all IDEA-2488); Dataset Linking (IDEA-2487) |
| **Dependencies** | Eventing PRD (file arrival triggers inbound runs); Logging & Audit PRD (file receipt and pattern match events must be logged) |
| **Design Reference** | HTML Prototype — Add File Wizard (playspace/file-definition-design/add-file-wizard.html); Figma — Connections_ParsingName (https://www.figma.com/design/Xc1ppal31OxzdiEECQl7BQ/Connections_ParsingName) |

---

## 🎯 Objective

Today, configuring an SFTP file pattern in Data Studio requires manual intervention from the FloQast integrations team. Clients and implementation teams have no way to define or manage file configurations themselves — every new connector setup, file addition, or pattern change must be routed through an internal team that writes raw regular expressions on behalf of the client. This creates onboarding bottlenecks and limits Data Studio's ability to scale as a self-service platform.

This PRD defines three new capabilities:

1. **Self-service file configuration** — clients and implementation teams can add and manage file definitions directly within Data Studio, without FloQast integrations team involvement
2. **AI-assisted pattern detection** — when a user uploads a sample file, the system automatically infers the filename pattern and surfaces the parts that change over time (e.g., month, year) as named tokens
3. **Token-based pattern confirmation** — users confirm or adjust the detected pattern through a visual, no-code interface; regex is never exposed to the end user

When this ships, a client or implementation team member can configure a new SFTP file definition end-to-end in minutes, without technical knowledge of regular expressions.

---

---

## 💡 Why This Is Important

**Operational bottleneck today**
Every SFTP file configuration in Data Studio today requires the FloQast integrations team to manually write a regular expression on behalf of the client. This is a hidden dependency in every new connector onboarding — clients cannot go live with file-based data sources until an internal technical resource is available to configure it. As Data Studio scales to more clients and more connectors, this bottleneck compounds.

> 📊 **Data to pull:** Query volume of file configurations currently managed by the integrations team (configs per month, per client, total active) and volume of related support requests. This will quantify the operational burden and support the business case.

**Self-service is required for Data Studio Beta**
Data Studio's path to Beta requires clients and implementation teams to own their configuration end-to-end. File pattern setup is one of the last steps in connector onboarding that remains gated on FloQast internal resources. Removing that gate is essential to making Data Studio genuinely self-service.

**Regex is the wrong abstraction for this audience**
The current approach asks non-technical users to understand and write regular expressions — a skill set that has no overlap with the accounting and finance users who configure FloQast. The AI-assisted pattern detection replaces a technical requirement with a confirmation step, which is the right abstraction for this audience.

---

## 📖 Definitions & Terms

See the canonical Data Studio Definitions & Terms page: https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869099

## ⭐ Key Benefits

**Clients and end users**
Can configure and manage SFTP file definitions themselves without waiting for FloQast involvement. Onboarding a new file type goes from a support request with a multi-day turnaround to a self-service task completed in minutes.

**Implementation teams**
Can complete connector setup end-to-end during client onboarding without handoffs to the integrations team. Faster time to live for new Data Studio deployments.

**FloQast Integrations team**
Freed from manual regex configuration work. Support requests for file pattern setup are eliminated, allowing the team to focus on higher-value work.

**FloQast as a business**
Data Studio can scale to more clients and more connectors without a linear increase in integrations team headcount. Self-service file configuration is a prerequisite for Data Studio reaching Beta with live clients.

**Data and model quality (downstream)**
Named tokens extracted from filenames (e.g., `month_name`, `year`) are available for downstream model configuration via Linked Files — making data ingestion more reliable and reducing the chance of files being mismatched or silently dropped.

---

> ⚠️ **Action needed:** The following terms introduced by this PRD should be added to the Definitions page before this PRD is finalized:
> - **File Definition** — a named configuration that describes how to recognize and process a specific type of incoming SFTP file
> - **Named Token** — a labeled variable extracted from a filename (e.g., `month_name`, `year`) that represents the part of the filename that changes over time
> - **Pattern Detection** — the AI-assisted process of inferring the filename structure from a sample file

---

## 🧩 Use Cases

### UC1: Client adds a new file to an existing SFTP connector

An implementation team member is onboarding a new client. The client's SFTP connector is already configured, but the client has multiple file types they push — Trial Balance, AR Aging, Budget — and each needs its own file definition. The user navigates to Admin Settings → Data Studio → Connectors → [SFTP Connector] → Add File. They upload a sample filename, the system detects the pattern (e.g., `TrialBalance_2025-11.csv` → static prefix + `month_year` token), and the user confirms. The file definition is saved and future arrivals matching that pattern are automatically recognized.

### UC2: Filename contains multiple date-like strings (transmission date problem)

A client's SFTP feed produces filenames like `Health_TrialBalance_2025-11_20251104.155200.csv`. This filename contains two date-like strings: the accounting period (`2025-11`, representing November 2025) and a transmission timestamp (`20251104`, the date the file was generated). When the AI detects multiple date-like strings in the filename, it cannot confidently determine which represents the accounting period. Instead of guessing, the system automatically switches to guided highlight mode (Path B): the user is shown the filename and prompted to highlight the portion that represents the accounting period. The transmission date portion is labeled as "Ignore" — it is captured in the pattern (so the system can still match the file) but is not extracted as a named token.

### UC2b: User manually invokes guided highlight when AI detection is uncertain

The AI presents a pattern it detected with low confidence, or a user reviews the auto-detected result and believes it is wrong. Rather than editing the regex directly, the user can select "Adjust pattern manually" to enter the same guided highlight flow as UC2. The user highlights segments of the filename and assigns each a token type (Accounting Period, Entity, Client Name, Version, Ignore, or Custom). The system builds the pattern from the user's selections.

### UC3: Multiple files per connector

A connector receives three distinct file types — Trial Balance, AR Aging, and Budget — each with a different naming convention. The user adds each as a separate file definition within the same connector. Each definition has its own label, pattern, and token configuration. Incoming files are matched against all active definitions for that connector, and each is routed to the appropriate file definition based on which pattern matches.

### UC4: User edits an existing file definition

A client changes the naming convention for their Trial Balance file (e.g., begins including the entity name in the filename). The user navigates to the existing file definition, clicks Edit, uploads a new sample filename under the updated convention, and confirms the revised pattern. The updated pattern takes effect for future file arrivals. Historical data already ingested under the prior pattern is not re-processed.

> ❓ **Open question for Engineering:** What happens to in-flight or queued files when a pattern is edited? Does the old pattern remain active until the new one is saved, or is there a gap window?

### UC5: Incoming file does not match any configured pattern

An SFTP file arrives for a connector but does not match any of the active file definitions configured for that connector. The file is not silently dropped — an event is logged (per the Logging & Audit PRD) and the connector shows an unmatched file alert. The user can review the unmatched filename and either (a) create a new file definition to handle it, or (b) confirm the file is expected and the existing definition needs adjustment.

> ❓ **Open question for Engineering:** Confirm the exact behavior for unmatched files — logged and surfaced vs. logged silently. Align with Eventing PRD on what events are emitted.

---

## ✅ Assumptions — Established

These decisions have been made and should not be re-opened during implementation planning.

**Scope: SFTP only for v1**
This PRD covers file pattern configuration for SFTP connectors only. Table-based connectors (e.g., direct database or API sources) have a different data delivery model and will require a separate design. This is explicitly out of scope.

**Regex is generated by the system and never shown by default**
The system generates the underlying regular expression from the user's confirmed token selections. The user never sees or interacts with regex in the default flow. This is intentional — regex is not the right abstraction for the target audience.

**Advanced regex editing is available but not the default**
Users who need to edit the raw regex directly can access it via a clearly labeled advanced mode (e.g., a toggle or "Edit regex" option tucked below the visual pattern). This is not surfaced in the primary flow. Usage of advanced regex editing must be logged so that FloQast can track whether clients are reaching for it — high usage would indicate either missing pattern types that should be added to the standard token set, or a more technically sophisticated user base than expected.

**A sample filename is required to configure a pattern**
At least one sample filename must be provided before pattern detection can run. Users can either upload a file (the filename is extracted) or paste a filename string directly. Both input methods are supported. The file contents are not required — the filename string alone is sufficient.

**Token names are system-defined for v1**
The standard token types (Accounting Period, Report Name, Entity, Client Name, Version, Ignore, Custom) are defined by the system. For the "Custom" token type, the user provides a label for the token. Freeform naming for standard token types is not supported in v1.

**Pattern matching is exact per file definition**
Each file definition has exactly one pattern. A file arriving on a connector is tested against all active file definitions for that connector and matched to the first definition whose pattern it satisfies. There is no fuzzy matching — a file either matches a definition or it does not.

**Editing a definition does not reprocess historical data**
When a user edits an existing file definition (e.g., updates the pattern), the change applies to future file arrivals only. Files already ingested under the prior pattern are not re-processed or re-matched.

> ❓ **Open question for Engineering:** Confirm whether AI-assisted pattern detection runs server-side (assumed) or involves any client-side processing. This affects latency expectations and what feedback we can give the user while detection is in progress.

---

## 🖥️ UX Requirements

**Design references**
- HTML Prototype — Add File Wizard: `playspace/file-definition-design/add-file-wizard.html`
- HTML Prototype — Guided Highlight (v2): `playspace/file-definition-design/filename-parser-v2.html`
- Figma: https://www.figma.com/design/Xc1ppal31OxzdiEECQl7BQ/Connections_ParsingName

---

**Screen 1: Connector Detail — File Definitions List**
The connector detail page is the entry point for managing file definitions. It must show all configured definitions for the connector, each with its dataset name, pattern (rendered as token chips), and status. The "Add File" action initiates the wizard. Edit and Delete actions are accessible per definition. The treatment for an unmatched file alert on this page is to be determined by design (see open question, Chunk 6).

**Screen 2: Add File Wizard — Step 1: Dataset Name & File**
The user provides two inputs: a dataset name (free text) and a sample filename (upload or paste). Pattern detection runs in the background as soon as a filename is provided. The step should communicate that detection is running without blocking the user from completing the dataset name field.

**Screen 3: Add File Wizard — Step 2: Confirm Pattern (Path A)**
The primary confirmation screen. The filename is shown at the top. Below it, the detected pattern is rendered as a horizontal sequence of chips — static text segments in a neutral style, named tokens as colored chips (color varies by token type). Supported token types and their example use: Accounting Period (`2025-11`), Report Name (`TrialBalance`), Entity (`Health`), Client Name, Version, Ignore (transmission timestamps, etc.), Custom (user-labeled). The user can confirm as-is, enter guided highlight via "Adjust pattern manually," or access the advanced regex editor via a secondary toggle. A test section sits below the pattern for validating additional filenames before saving.

**Screen 3b: Add File Wizard — Step 2: Guided Highlight (Path B)**
Triggered automatically when multiple dates are detected, or manually from the Adjust option. The full filename is displayed as selectable text. The user drags to highlight segments; a token type picker appears after each selection, offering all seven token types. Each labeled segment is reflected immediately in the pattern visual below. The interface must make clear which portions of the filename are still unlabeled.

**Screen 4: Add File Wizard — Step 3: Accounting Config + Entity Scope**
Out of scope for this PRD. Covered by separate requirements. The wizard must support navigation to this step after pattern confirmation.

---

**Decisions left for the designer**
- Visual treatment for the unmatched file alert on the connector detail page
- Token chip color palette (one distinct color per token type — seven types total)
- Loading/progress state during background pattern detection on Step 1
- Placement and visual weight of the "Edit regex" advanced mode toggle on Step 2
- How the guided highlight interface handles edge cases: overlapping selections, very long filenames, filenames with special characters

---

## 🔍 Open Items to Confirm

| # | Question | Owner | Priority |
|---|---|---|---|
| 1 | Does AI-assisted pattern detection run server-side? What is the expected latency, and what loading state should we show the user while detection is in progress? | Engineering | High |
| 2 | What happens to in-flight or queued files when a file definition pattern is edited mid-stream? Does the old pattern remain active until save, or is there a gap window where neither pattern is active? | Engineering | High |
| 3 | When a file arrives and matches no configured definition, what is the exact behavior? Is it logged silently, surfaced to the connector admin, or both? Needs to align with the Eventing PRD on which events are emitted. | Engineering + Eventing PRD | High |
| 4 | Is the Linked Files token passthrough (extracted tokens available for downstream model configuration) in scope for this PRD, or is it tracked separately under the Dataset Linking PRD (IDEA-2487)? If in scope here, requirements need to be added. | Alex Kearns + Dataset Linking PRD owner | Medium |
| 5 | What is the maximum number of file definitions supported per connector? Are there technical constraints that should inform UX (e.g., a list view that needs to handle 20+ definitions)? | Engineering | Low |
| 6 | When a user uploads a sample file, is the file content stored (e.g., for loading/caching purposes), or is only the filename string retained? If file content is stored, define a maximum file size and retention policy. This affects both UX (loading state, progress indicator) and infrastructure. | Engineering | High |
| 7 | Should users be able to provide multiple sample filenames to improve AI detection confidence (e.g., 3 examples from different months)? Or is a single sample sufficient for v1? Separate from testing — see item below. | Engineering + Design | Medium |

---

## 📐 Scope

### In Scope

- **SFTP connector file definitions** — create, edit, and delete file definitions within an SFTP connector in Data Studio
- **AI-assisted pattern detection (Path A)** — user provides a sample filename; system infers the pattern and surfaces named tokens for confirmation
- **Guided highlight fallback (Path B)** — automatically triggered when multiple date-like strings are detected; also available as a manual "adjust" option when the user wants to override or refine the AI result
- **Token types** — Accounting Period, Report Name, Entity, Client Name, Version, Ignore, Custom (user-labeled)
- **Sample filename input** — user can upload a file (filename extracted) or paste a filename string directly; both are supported
- **Pattern test section** — after confirming a pattern, user can paste additional sample filenames to verify matches before saving
- **Advanced regex edit mode** — accessible via toggle for power users; usage is logged; not the default path
- **Unmatched file alerting** — when an incoming file matches no active definition on a connector, the event is logged and surfaced to the connector admin

### Out of Scope

- **Non-SFTP connectors** — table-based connectors, API sources, and other data delivery models are not covered by this PRD; file pattern configuration for those source types requires a separate design
- **File content processing** — this feature is about filename pattern matching only; the contents of uploaded files are not parsed, validated, or used for any purpose beyond extracting the filename string
- **Bulk import of file definitions** — adding multiple file definitions at once via import or template is not in scope for v1
- **Linked Files / token passthrough to models** — the downstream use of extracted tokens (e.g., `month_name`, `year`) in Data Studio model configuration is tracked under the Dataset Linking PRD (IDEA-2487); this PRD covers token extraction only, not how tokens are consumed
- **Date format transformation** — users can confirm and label the date format in a filename; converting or normalizing the date value itself is out of scope
- **Regex as the primary interface** — regex editing is available as an advanced mode only; it is not a supported primary workflow

---

## 📋 Requirements

### Chunk 1: Adding a File Definition (Path A — AI Detection)

**US-1: As a client or implementation team member, I want to add a new file definition to an SFTP connector so that incoming files of that type are automatically recognized.**

*AC1 — Navigating to Add File:*
- **Given** I am on the connector detail page for an SFTP connector in Admin Settings → Data Studio → Connectors
- **When** I click "Add File"
- **Then** I am taken to the Add File wizard, starting at Step 1: Dataset Name & File

*AC2 — Providing a sample filename:*
- **Given** I am on Step 1 of the Add File wizard
- **When** I upload a file or paste a filename string into the sample filename field
- **Then** the filename is displayed on screen and pattern detection begins automatically in the background

*AC3 — AI detects the pattern on input:*
- **Given** I have provided a sample filename
- **When** I advance to Step 2: Confirm Pattern
- **Then** the detected pattern is already loaded — the filename is shown as a visual breakdown of token chips (e.g., `TrialBalance_` as static text, `2025-11` as an Accounting Period token) with no additional wait required

*AC4 — User confirms the pattern:*
- **Given** the system has presented a detected pattern on Step 2
- **When** I review the token breakdown and click Confirm
- **Then** the file definition is saved with the confirmed pattern and I am advanced to the next configuration step

> 📌 **v1 scope note:** In Path A, AI detection identifies accounting period (date-based) tokens only. Detection of non-date tokens such as Entity, Client Name, and Version via AI is future scope. Users who need to label non-date segments must use the guided highlight flow (Path B / US-4).

---

### Chunk 2: Guided Highlight (Path B)

**US-2: As a user configuring a file definition, when the system detects multiple date-like strings in the filename, I want to be guided to identify the correct accounting period so that the pattern is not ambiguous.**

*AC1 — Auto-trigger on multiple dates:*
- **Given** I have provided a sample filename that contains two or more date-like strings (e.g., `Health_TrialBalance_2025-11_20251104.155200.csv`)
- **When** pattern detection runs
- **Then** the system does not auto-confirm a pattern; instead it presents the guided highlight interface with a message explaining that multiple date-like values were found and asking me to identify the accounting period

*AC2 — User highlights the accounting period:*
- **Given** I am in the guided highlight interface
- **When** I drag to select the portion of the filename that represents the accounting period
- **Then** the selected segment is highlighted and a token type picker appears, with "Accounting Period" pre-selected if the selected text matches a recognized date format

*AC3 — Transmission date marked as Ignore:*
- **Given** I have labeled the accounting period segment
- **When** I select the remaining date-like segment and assign it the "Ignore" token type
- **Then** the segment is included in the pattern (so the system can still match the full filename) but is not extracted as a named token available for downstream use

*AC4 — Pattern saved from guided highlight:*
- **Given** I have labeled all variable segments of the filename
- **When** I click Confirm
- **Then** the pattern is built from my selections and saved as the file definition; the confirmed pattern is displayed as token chips consistent with the Path A confirmation view

---

**US-3: As a user, I want to manually invoke the guided highlight flow when I believe the AI-detected pattern is incorrect, so that I can correct it without editing regex.**

*AC1 — Adjust option available on Step 2:*
- **Given** the system has presented an AI-detected pattern on Step 2
- **When** I review the result and believe it is wrong
- **Then** an "Adjust pattern manually" option is visible on the page

*AC2 — Entering guided highlight from Adjust:*
- **Given** I click "Adjust pattern manually"
- **When** the guided highlight interface loads
- **Then** the filename is shown in full and I can drag to select and label any segment; any prior AI-detected tokens are cleared

---

**US-4: As a user, I want to label non-date segments of a filename (such as an entity name or client name) so that those values are captured and available for downstream use.**

*AC1 — Non-date token types available in guided highlight:*
- **Given** I am in the guided highlight interface
- **When** I select a segment of the filename
- **Then** the token type picker shows all available types: Accounting Period, Report Name, Entity, Client Name, Version, Ignore, and Custom

*AC2 — Custom token label:*
- **Given** I select "Custom" as the token type for a segment
- **When** I enter a label name
- **Then** the segment is saved with that label as the token name and appears as a distinctly colored chip in the pattern visual

> 📌 **Future scope:** AI-assisted detection of non-date token types (Entity, Client Name, Version) in Path A. In v1, these token types are only available via the guided highlight interface.

---

### Chunk 3: Pattern Testing

**US-5: As a user, I want to test my confirmed pattern against additional sample filenames before saving, so that I can verify it will match future files correctly.**

*AC1 — Test input available after pattern confirmation:*
- **Given** I have confirmed a pattern on Step 2
- **When** the pattern is displayed
- **Then** a test section is visible below the pattern where I can paste one or more additional filenames

*AC2 — Match result shown:*
- **Given** I paste a filename into the test section
- **When** the test runs
- **Then** the filename is shown with a clear match or no-match result; if it matches, the extracted token values are displayed (e.g., `month_name: November`, `year: 2025`)

*AC3 — No-match feedback:*
- **Given** I paste a filename that does not match the confirmed pattern
- **When** the test runs
- **Then** the filename is marked as not matched and I am able to go back and adjust the pattern before saving

---

### Chunk 4: Advanced Regex Edit Mode

**US-6: As a power user, I want to edit the raw regex for a file definition so that I can handle patterns the standard token flow doesn't support.**

*AC1 — Advanced mode accessible but not prominent:*
- **Given** I am on Step 2 reviewing a confirmed pattern
- **When** I look for an advanced option
- **Then** an "Edit regex" toggle or link is visible but secondary — not in the primary action area

*AC2 — Regex editable in advanced mode:*
- **Given** I activate the advanced regex edit mode
- **When** the regex editor opens
- **Then** the system-generated regex is pre-populated and I can edit it directly; the token chip visual updates to reflect my changes where possible

*AC3 — Advanced mode usage is logged:*
- **Given** a user activates the advanced regex edit mode and saves a file definition
- **When** the definition is saved
- **Then** the event is logged with sufficient detail for FloQast to identify that advanced mode was used (user, connector, timestamp) — this data informs whether standard token types are covering real-world patterns

---

### Chunk 5: Managing Definitions

**US-7: As a user, I want to view all file definitions configured for an SFTP connector so that I can understand what file types are being handled.**

*AC1 — File definitions listed on connector detail:*
- **Given** I am on the connector detail page for an SFTP connector
- **When** I view the page
- **Then** all active file definitions are listed, each showing the dataset name, the pattern (as token chips), and its status (Active / Inactive)

---

**US-8: As a user, I want to edit an existing file definition so that I can update the pattern when a client changes their file naming convention.**

*AC1 — Edit available on each definition:*
- **Given** I am viewing the file definitions list on a connector detail page
- **When** I select Edit on a definition
- **Then** the Add File wizard opens pre-populated with the existing dataset name, sample filename, and confirmed pattern

*AC2 — Pattern update takes effect on save:*
- **Given** I have updated the pattern in the wizard
- **When** I save the definition
- **Then** the updated pattern is applied to future incoming files; previously ingested files are not re-processed

---

**US-9: As a user, I want to delete a file definition so that files of that type are no longer processed.**

*AC1 — Delete requires confirmation:*
- **Given** I select Delete on a file definition
- **When** the delete action is initiated
- **Then** I am shown a confirmation prompt before the definition is removed; the prompt notes that future files matching this pattern will no longer be recognized

---

### Chunk 6: Unmatched File Handling

**US-10: As a connector admin, I want to be notified when an incoming file doesn't match any configured definition so that I can take action rather than having files silently dropped.**

*AC1 — Unmatched file is not silently dropped:*
- **Given** a file arrives on an SFTP connector
- **When** the file does not match any active file definition for that connector
- **Then** the file is held and the connector admin is alerted

*AC2 — Unmatched filename is visible:*
- **Given** an unmatched file alert has been raised
- **When** the admin investigates
- **Then** the filename of the unmatched file is visible so they can determine whether to create a new definition or update an existing one

*AC3 — Event is logged:*
- **Given** a file arrives and matches no active definition
- **When** the file is received
- **Then** a file receipt event with a pattern match failure status is logged per the Logging & Audit PRD

> ❓ **Open question — Design:** The mechanism by which an unmatched file alert is surfaced to the connector admin is not yet defined. Options include an in-app indicator on the connector detail page, a notification, an email, or a combination. This requires a design decision before requirements can be finalized.

---

## ❓ Open Questions

| # | Question | Owner |
|---|---|---|
| 1 | What is the visual/notification mechanism for surfacing unmatched file alerts to the connector admin? In-app indicator, notification, email, or combination? | Design |
| 2 | Does AI-assisted pattern detection run server-side? What is the expected latency, and what loading state should we show the user while detection is running in the background? | Engineering |
| 3 | What happens to in-flight or queued files when a file definition pattern is edited? Does the old pattern remain active until save, or is there a gap window? | Engineering |
| 4 | Is the Linked Files token passthrough (extracted tokens available for downstream model configuration) in scope for this PRD, or tracked separately under the Dataset Linking PRD? | Alex Kearns |
| 5 | When a user uploads a sample file, is file content stored server-side (e.g., for loading purposes), or is only the filename string retained? If stored, what is the file size limit and retention policy? | Engineering |
| 6 | Should users be able to provide multiple sample filenames to improve AI detection confidence, or is a single sample sufficient for v1? | Engineering + Design |

---

## 🕳️ Gaps

**File schema and column mapping**
This PRD defines how a file is *recognized* by its filename pattern. It does not address how the system knows what data type each column contains, or whether the file has a header row. This is required for Data Studio to correctly ingest and interpret file contents, and will need its own design exploration and requirements. Tracked in the to-do list as "File Schema / Column Mapping."

**Non-date token detection via AI (Path A)**
In v1, AI-assisted detection identifies accounting period (date-based) tokens only. Automatically detecting non-date segments such as Report Name, Entity, or Client Name from a filename requires additional AI capability. Deferred to a future release.

**Non-SFTP connectors**
File pattern configuration for table-based connectors, API sources, and other data delivery models is not addressed here. A separate design will be required as Data Studio expands beyond SFTP.

**Bulk file definition management**
There is no mechanism in v1 for importing, exporting, or bulk-managing file definitions across connectors. Deferred.

---

## 📎 References

- **HTML Prototype — Add File Wizard:** `playspace/file-definition-design/add-file-wizard.html`
- **HTML Prototype — Guided Highlight (v2):** `playspace/file-definition-design/filename-parser-v2.html`
- **Figma — Connections_ParsingName:** https://www.figma.com/design/Xc1ppal31OxzdiEECQl7BQ/Connections_ParsingName
- **Data Studio Definitions & Terms:** https://floqast.atlassian.net/wiki/spaces/Data/pages/4464869099
- **Related PRD — Logging & Audit:** Confluence page ID 4508254281 / `playspace/data-studio-prd/prd-logging-audit.md`
- **Related PRD — Eventing:** IDEA-2488
- **Related PRD — Scheduling:** Confluence page ID 4504485941 / `playspace/data-studio-prd/prd-scheduling.md`
- **Epic:** IDEA-2487 — Data Studio: Multi-File Handling & Global Dimensions
