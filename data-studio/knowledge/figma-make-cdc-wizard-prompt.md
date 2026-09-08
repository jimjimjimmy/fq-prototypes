# Figma Make Prompt: CDC Connection Setup Wizard

**Date:** March 23, 2026
**Purpose:** Generate a multi-screen prototype showing the CDC connection setup flow from Connectors tab through draft model creation
**Attach with this prompt:** Existing Figma design files (Connectors tab, Models tab, Model detail view) + prototype screenshots (Connectors list, Source Type selector modal)

---

## Prompt

Design a multi-screen prototype for a CDC connection setup wizard in FloQast's Data Studio product. This wizard lives inside the Admin Settings shell and follows a 4-step flow. Match the existing visual style from the attached reference designs (Connectors tab, Models tab, Source Type selector modal, Model detail view).

**Design context:**
- This is an enterprise B2B accounting product. Clean, professional, lots of white space.
- Use Inter font throughout. Colors: green primary (#186749), gray text hierarchy, white cards, light gray backgrounds.
- The shell has a left sidebar (Admin Settings nav) and horizontal tabs at the top (Models, Connectors). The wizard opens after clicking "+ Create Connector" on the Connectors tab.

**Screen 1: Select Data Source**
Modal overlay on the Connectors tab (same pattern as the "Select Source Type" modal in the reference). Replace the QBO/sFTP options with CDC sources:
- NetSuite — "Full ERP data including GL, AR, AP, and transaction detail"
- Sage Intacct — "Financial data including journal entries and dimensions"
- Workday — "HR and financial data including payroll and expenses"
Each source has a logo placeholder, title, and subtitle. Radio selection. Cancel and "Continue →" buttons at bottom.

**Screen 2: Step 1 — Name**
Wizard stepper at top showing 4 steps: Name (active) → Credentials → Tables → Validate. Shows the source logo and name (e.g., "NetSuite") in the header.
- Single field: "Connection Name" with placeholder text "e.g., Acme Corp — NetSuite"
- Helper text: "This name will identify your connection in Data Studio."
- Cancel and "Next →" buttons.

**Screen 3: Step 2 — Credentials**
Same wizard stepper, step 2 active. Source-specific credential fields for NetSuite:
- Account ID (helper: "Found in NetSuite under Setup → Company")
- Consumer Key (helper: "Generated in NetSuite Integration setup")
- Consumer Secret
- Token ID
- Token Secret
- "← Back" and "Next →" buttons. Next is disabled until all fields are filled.

**Screen 4: Step 3 — Table Selection (Provision)**
Same wizard stepper, step 3 active. This is the key screen. Two sections:

**Standard Tables** (locked, pre-selected, cannot be deselected):
- ☑ Transactions (locked icon)
- ☑ Accounts (locked icon)
- ☑ GL Lines (locked icon)
A note: "Standard tables are required for FloQast models and cannot be removed."

**Additional Tables** (optional, checkboxes):
- ☐ Vendors
- ☐ Customers
- ☐ Subsidiaries
- ☐ Departments
- ☐ Journal Entries

"← Back" and "Next →" buttons.

**Screen 5: Step 4 — Validate**
Same wizard stepper, step 4 active. Auto-runs validation on load. Show progressive status:
- ✓ Connection authenticated
- ✓ Transactions — accessible
- ✓ Accounts — accessible
- ⟳ GL Lines — checking...

On success state: "Your connection is ready." with "← Back" and "Save & Connect" button (green, enabled).

**Screen 6: Post-Setup — Connectors Tab**
Return to the Connectors tab (match the reference design). The new connection appears at the top of the list:
- "Acme Corp — NetSuite" with source badge "CDC"
- Status: "● Initial Data Load" (amber/yellow indicator)
- Entity: "—"
- Last Synced: "Never"
Show the other existing connections below it from the reference design.

**Screen 7: Post-Setup — Models Tab with Draft Models**
Switch to the Models tab (match the reference design with FQ Model type groupings). New draft models have appeared at the top:
- "Transactions" — Version 1 — Draft (blue badge) — 0 records — "Acme Corp — NetSuite" — Just now
- "Accounts" — Version 1 — Draft (blue badge) — 0 records — "Acme Corp — NetSuite" — Just now
- "GL Lines" — Version 1 — Draft (blue badge) — 0 records — "Acme Corp — NetSuite" — Just now
Show these above the existing models from the reference design. Include a notification banner at the top: "3 new draft models are ready for review from Acme Corp — NetSuite."

---

## PRD Reference

Based on: CDC Connection Setup PRD (AK) — stories CDC-1 through CDC-6, plus post-setup states.
Key constraints:
- Standard tables are locked (cannot be deselected) — per RBC + AK alignment
- User-facing language never mentions "Fivetran" — source name only (e.g., "NetSuite")
- Wizard steps 1-2 (Name, Credentials) follow the same pattern as QBO Connection (RBC)
- Steps 3-4 (Table Selection, Validate) are the CDC-specific screens
