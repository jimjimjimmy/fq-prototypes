# Current State Entity-Relationship Diagram

**Purpose:** Document the current MongoDB/DocumentDB data model for FloQast Close, annotating the triple-duty folder problem and cross-service dependencies.

**Source:** `03_Technical_Architecture_Confluence.md` Sec 1.1, Sec 2, Sec 5

---

## Entity-Relationship Diagram (Mermaid)

```mermaid
erDiagram
    TOPLEVELCLIENTS ||--o{ COMPANIES : "has"
    TOPLEVELCLIENTS ||--o{ USERS : "has"
    TOPLEVELCLIENTS ||--o{ ADHOC_PROJECTS : "has"
    TOPLEVELCLIENTS {
        string _id PK
        string name
        object featureFlags "570+ legacy flags"
        string tlcId "Tenant isolation key"
    }

    COMPANIES ||--o{ FOLDERS : "has"
    COMPANIES ||--o{ WORKFLOWS : "has"
    COMPANIES {
        string _id PK
        string tlcId FK
        string name
        object glSettings "ERP connection config"
        string fiscalYearEnd
        string currency
    }

    FOLDERS ||--o{ PROCEDURES : "contains"
    FOLDERS ||--o{ RECONCILIATIONS : "contains"
    FOLDERS ||--o{ STORAGEMETADATAS : "syncs"
    FOLDERS {
        string _id PK
        string companyId FK
        string name "⚠️ Template match key"
        boolean isLocked
        string parentFolderId "Hierarchy"
        string storageProviderId "⚠️ Storage sync anchor"
        object permissions "⚠️ Permission boundary"
    }

    PROCEDURES ||--o{ SIGNATURES : "has"
    PROCEDURES ||--o{ REVIEWNOTES : "has"
    PROCEDURES ||--o{ STORAGEMETADATAS : "has"
    PROCEDURES ||--o{ PROCEDURE_JES : "has"
    PROCEDURES {
        string _id PK
        string folderId FK "⚠️ Coupled to folder"
        string workflowId FK
        string name
        string status "enum: incomplete|complete|redo"
        string preparer FK "→ USERS"
        string reviewer FK "→ USERS"
        date dueDate
        date completedDate
        array dependencies "→ other PROCEDURES"
        array tags FK "→ TAGS"
        string type "checklist|reconciliation"
    }

    TEMPLATES ||--o{ TEMPLATE_ITEMS : "contains"
    TEMPLATES {
        string _id PK
        string tlcId FK
        string name
        string folderName "⚠️ Matches by folder NAME"
        boolean isTimeless "No period association"
    }

    RECONCILIATIONS {
        string _id PK
        string folderId FK "⚠️ Coupled to folder"
        string procedureId FK
        object glBalance "Per TB from ERP"
        object reconciledBalance "From #FQ anchor"
        number materialityThreshold
        array signatures "Embedded sign-offs"
        array anchorPoints "#FQ anchor references"
        string storageFileId "Excel workbook link"
    }

    REVIEWNOTES {
        string _id PK
        string procedureId FK
        string recId FK "Optional"
        string authorId FK "→ USERS"
        string content
        date createdAt
        boolean isResolved
        string threadId "Slack/Teams sync"
    }

    SIGNATURES {
        string _id PK
        string procedureId FK
        string userId FK "→ USERS"
        string type "preparer|reviewer"
        date signedDate
        boolean isSigned
    }

    STORAGEMETADATAS {
        string _id PK
        string folderId FK
        string procedureId FK
        string fileName
        string storageProvider "box|gdrive|onedrive|etc"
        string externalFileId
        date lastModified
    }

    TAGS {
        string _id PK
        string tlcId FK
        string name "e.g., high-risk, CFO review"
        string type "predefined|custom"
    }

    WORKFLOWS {
        string _id PK
        string companyId FK
        string name "e.g., Month-End Close"
        object rules "Static routing rules"
    }

    PROCEDURE_JES {
        string _id PK
        string procedureId FK
        object journalEntry
        string syncStatus "pending|synced|failed"
    }

    TASKS {
        string _id PK
        string tlcId FK
        string folderId FK
        string adhocProjectId FK
        string name
        string status
    }

    ADHOC_PROJECTS {
        string _id PK
        string tlcId FK
        string name
        array members
    }

    USERS {
        string _id PK
        string tlcId FK
        string email
        string name
        string role "admin|user|viewer"
        array entityAccess "→ COMPANIES"
    }

    BULKEDITJOBS {
        string _id PK
        string tlcId FK
        string status "pending|processing|complete|failed"
        object report "Results summary"
    }

    WORKFLOW_ANALYTICS_EXPORTS {
        string _id PK
        string tlcId FK
        string s3Key "Export file location"
    }
```

---

## The Triple-Duty Folder Problem

The `FOLDERS` collection serves three fundamentally different purposes, creating tight coupling that cascades across the entire system:

```
                        ┌─────────────────────────┐
                        │        FOLDERS           │
                        │                          │
                ┌───────┤  1. ORGANIZATION         │
                │       │     - name               │
                │       │     - parentFolderId      │
                │       │     - hierarchy           │
                │       │                          │
                │       │  2. PERMISSIONS           │
                │       │     - permissions object  │
                │       │     - user access grants  │
                │       │     - entity scoping      │
                │       │                          │
                │       │  3. STORAGE SYNC          │
                │       │     - storageProviderId   │
                │       │     - cloud folder path   │
                │       │     - #FQ anchor location │
                └───────┤                          │
                        └─────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
            ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
            │ PROCEDURES  │ │ RECONCIL.   │ │ TEMPLATES   │
            │ folderId FK │ │ folderId FK │ │ folderName  │
            │             │ │             │ │ (match key) │
            └─────────────┘ └─────────────┘ └─────────────┘
```

### Cascading Impacts

| Action | Organization Impact | Permission Impact | Storage Impact |
|--------|-------------------|-------------------|----------------|
| **Rename folder** | Templates break (name-matching) | None | Storage sync path changes |
| **Merge folders** | Items may be orphaned/deleted | Permission grants must be rebuilt | Storage anchor points lost |
| **Delete folder** | All procedures orphaned | All user access revoked | All linked files disconnected |
| **Change permissions** | None | Desired effect | None |
| **Change storage provider** | None | None | All #FQ anchors break |

---

## Service-to-Collection Access Map

| Service | procedures | folders | companies | tlc | users | recs | reviewnotes | templates | tags | storage |
|---------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Checklist | RW | R | R | R | R | — | R | RW | R | RW |
| Items | RW | R | R | R | R | — | — | — | — | RW |
| Replication | RW | RW | R | R | — | — | — | — | — | — |
| Bulk Edit | RW | — | R | R | R | RW | — | RW | — | — |
| Review Notes | R | R | R | R | R | R | RW | — | — | — |
| Workflow Analytics | R | R | R | R | R | R | R | — | — | — |
| Tasks | — | R | — | R | — | — | — | — | — | — |
| Adhoc Projects | — | — | — | R | R | — | — | — | — | — |
| Recs | — | R | R | R | R | RW | R | R | R | — |

**Key observation:** The `procedures` collection is accessed by 6 services (read-write by 4). The `folders` collection is accessed by 7+ services. These are the two most heavily coupled collections in the system.

---

## Gold Layer (Snowflake Analytics)

The Close Gold Layer maps this operational data into a star schema:

```
                    ┌──────────────┐
                    │  dim_date    │
                    └──────┬───────┘
                           │
┌──────────────┐    ┌──────┴───────┐    ┌──────────────┐
│ dim_company  ├────┤ fact_close_  ├────┤ dim_project  │
│              │    │ item_status  │    │ (period)     │
└──────────────┘    └──────┬───────┘    └──────────────┘
                           │
                    ┌──────┴───────┐    ┌──────────────┐
                    │              ├────┤ dim_item_type│
                    │              │    └──────────────┘
                    │              │
                    │              ├────┐
                    └──────────────┘    │
                                 ┌─────┴──────┐
                                 │ dim_folder  │
                                 │ (optional)  │
                                 └────────────┘
```

**Note:** The Gold Layer's `dim_folder` is marked as "optional" — an early indicator that even the analytics team recognizes folders may not be a durable dimension.
