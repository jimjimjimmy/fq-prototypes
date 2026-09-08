# File Connector Setup — User Flow

> End-to-end journey for an admin configuring a file connector (SFTP or Close Upload) through to a fully configured dataset.

## Overview

An admin initiates a new dataset and selects a transport type — either SFTP or Close Upload. SFTP requires credential setup (username/password, optional PGP encryption and/or SSH key) and system validation before proceeding. Close Upload skips credential setup entirely. Both transports then follow an identical path through source file selection, file naming pattern definition, schema definition, accounting period configuration, and entity configuration. A sample file can be uploaded if no pipeline files have landed yet, and this file is retained for use as test data in Field Mapping.

---

## Steps

### 1. Admin
**Type:** Entry point
**Description:** Admin initiates adding a new dataset and begins the file connector setup.
**Paths from here:**
- → Select Transport Type

---

### 2. Select Transport Type _(Decision)_
**Type:** Decision
**Description:** Admin chooses how files will be delivered to Data Studio for this dataset.
**Paths from here:**
- → SFTP Credential Setup (SFTP)
- → Source File Selection (Close Upload — skips credential setup)

---

### 3. SFTP Credential Setup
**Type:** User Action
**Description:** Admin enters a username and password for the SFTP connection.
**Paths from here:**
- → System: Provide SFTP Endpoint

---

### 4. System: Provide SFTP Endpoint
**Type:** System / Auto
**Description:** System displays the FQ-provided SFTP host and path that the customer will use to push files. Admin shares these details with their team or vendor.
**Paths from here:**
- → Optional encryption? (decision)

---

### 5. Optional encryption? _(Decision)_
**Type:** Decision
**Description:** Admin decides whether to add optional security layers to the SFTP connection.
**Paths from here:**
- → Configure PGP Encryption (PGP selected)
- → Upload SSH Key (SSH key selected)
- → System: Validate Credentials (neither — skip both)

---

### 6. Configure PGP Encryption
**Type:** User Action
**Description:** Admin pastes or uploads a PGP public key. Incoming files must be encrypted by the sender using the corresponding private key.
**Paths from here:**
- → System: Validate Credentials

---

### 7. Upload SSH Key
**Type:** User Action
**Description:** Admin uploads an SSH key as an authentication method for the SFTP connection.
**Paths from here:**
- → System: Validate Credentials

---

### 8. System: Validate Credentials
**Type:** System / Auto
**Description:** System tests the provided credentials (username, password, and any keys) against the SFTP configuration.
**Paths from here:**
- → Credentials valid? (decision)

---

### 9. Credentials valid? _(Decision)_
**Type:** Decision
**Paths from here:**
- → Credential Error (No — invalid)
- → Source File Selection (Yes — valid)

---

### 10. Credential Error _(Error)_
**Type:** Error / Block
**Description:** System surfaces the specific failure (invalid username, wrong password, key mismatch). Admin must correct and retry.
**Paths from here:**
- → SFTP Credential Setup (retry)

---

### 11. Source File Selection
**Type:** Screen / View
**Description:** Admin selects the source file that will be used to define the dataset's schema. Both SFTP and Close Upload paths converge here. Two options are always available regardless of whether files have landed — admin can choose either.
**Paths from here:**
- → Browse Files (admin wants to use a file already in the system)
- → Upload Sample File (admin wants to upload their own file)

---

### 12. Browse Files
**Type:** Screen / View
**Description:** System lists all files that have landed, regardless of transport type. Each file displays: transport type (SFTP or Close Upload), username (shown when multiple SFTP usernames exist), and date landed. Shows an empty state if no files have arrived yet.
**Paths from here:**
- → File Naming Pattern (file selected)

---

### 13. Upload Sample File
**Type:** User Action
**Description:** Admin uploads a sample file manually. Always available — even if pipeline files have already landed, the admin may prefer to use a controlled sample. This file is dual-purpose: it is used immediately for schema inference in the wizard, and it is retained as a test data source in Field Mapping (available under "Test with Sample Data" alongside "Test with Real Data").
**Paths from here:**
- → File Naming Pattern

---

### 14. File Naming Pattern
**Type:** Screen / View
**Description:** Admin defines the pattern used to identify which incoming files belong to this dataset. Required for both SFTP and Close Upload — since Close Upload is a recurring delivery method, not a one-time action, the system needs to route future uploads correctly.
**Paths from here:**
- → Schema Definition

---

### 15. Schema Definition
**Type:** System / Auto
**Description:** System infers column names and data types from the selected or uploaded file. Admin reviews and confirms the inferred schema. _Note: the schema definition process is being redesigned — that work is covered in a separate PRD and is out of scope for this flow._
**Paths from here:**
- → Schema valid? (decision)

---

### 16. Schema valid? _(Decision)_
**Type:** Decision
**Paths from here:**
- → Schema Error (Error — columns or types don't resolve)
- → Accounting Period Config (Valid)

---

### 17. Schema Error _(Error)_
**Type:** Error / Block
**Description:** System identifies the problematic column or type conflict. Admin must adjust the file or column mapping and retry inference.
**Paths from here:**
- → Schema Definition (retry)

---

### 18. Accounting Period Config
**Type:** Screen / View
**Description:** Admin defines how the system derives the accounting period for incoming files — either from the filename (via the naming pattern) or from a column inside the file. This step is required for both SFTP and Close Upload; Close Upload cannot provide accounting period context automatically. _Note: changes to this step are covered in a separate PRD and are out of scope for this flow._
**Paths from here:**
- → Entity Config

---

### 19. Entity Config
**Type:** Screen / View
**Description:** Admin defines how the system identifies which FloQast entity each row or file belongs to. Required for both transport types; neither SFTP nor Close Upload provides entity context automatically. _Note: changes to this step are covered in a separate PRD and are out of scope for this flow._
**Paths from here:**
- → Dataset Configured

---

### 20. Dataset Configured _(Terminal)_
**Type:** Success / Terminal
**Description:** Dataset configuration is saved and active. If a sample file was uploaded, it is retained and available as a test data source in Field Mapping (Test with Sample Data vs Test with Real Data). The dataset is now ready for field mapping.
**Paths from here:**
- (Terminal — proceed to Field Mapping)

---

## Gaps & Open Questions

- **Open Q:** Can a user have multiple SFTP connections (multiple usernames) under one account? If so, are they managed at the connector level or the dataset level?
- **Open Q:** Is the sample file stored permanently or only for the duration of the wizard session?
- **Open Q:** Can Close Upload be the sole long-term transport for a dataset, or is it expected to be a temporary bootstrap until SFTP is configured?
- **Open Q:** If a dataset has both SFTP and Close Upload files landed, how does the system handle differing naming conventions between the two transport types?
- **Open Q:** Can the transport type be changed after a dataset is configured (e.g. swap from Close Upload to SFTP once the pipeline is set up)?
- **Open Q:** For SFTP credential rotation — if a password changes, where does the admin update it? Is there a connector management screen outside the dataset wizard?
- **Open Q:** PGP/SSH UX specifics — does the admin paste a key, upload a file, or can a key pair be generated within the product?
- **Gap:** No cancellation path defined — if the admin exits mid-wizard, is partial configuration saved as a draft or discarded?
- **Gap:** No async/loading state defined for credential validation — what does the UI show while the system is checking SFTP credentials?
- **Gap:** Permissions not defined — can any admin configure any connector, or is access scoped?
