# Connector Selection Flow — Working Summary

This folder captures the entry-and-selection design exploration for **adding a new connector** in Data Studio. Scope is the user journey from landing in Data Studio through choosing a connector type — *not* the setup wizards that follow selection.

---

## Context

**Data Studio** is FloQast's self-service data integration platform. **Connectors** bring external data into FQ's normalized models for downstream use (Close, Flux, Compliance, Consolidation). A connector is a transmission type + credentials + source datasets.

Today the prototype has a working `AddConnectorModal` with four options: QBO Basic, QBO Enhanced, sFTP, API Connector. As more sources come online (NetSuite, Sage Intacct, Salesforce, Workday) and the Manual Upload connector lands, the picker needs to evolve — both to handle volume and to accommodate the structural distinctions PMs want to surface (pre-built vs. custom, system tiers).

**This work** explores two competing models for that picker and produces low-fi wireframes to compare presentation patterns.

---

## Source material

### PRDs reviewed (in `../`)
- **CDC Connection Setup** (`prd-fivetran-cdc-connection.md`) — defines self-serve table selection for Fivetran-backed sources (NetSuite, etc.). 4-step wizard: Name → Credentials → Provision → Validate. Fivetran is *abstracted* — never surfaced in UI.
- **Manual Upload Connector** (`prd-manual-upload-connector.md`) — new connector type for .xlsx / .csv with schema inference. 2-step wizard: Name → Define Schema. No source, no credentials.
- **PRD Executive Summary** (`prd-executive-summary.md`) — overview of the full PRD suite plus cross-author discrepancies that the selection flow must resolve.
- **Definitions & Terms** (`definitions.md`) — glossary; canonical use of "Connector" (replaces "Connection"), "Source Type", "Transmission Type".

### Stakeholder input
- **Kristin Johnson** (designer) — produced an early mockup ("What Are We Connecting Today?") with two columns: System + Data. Decided to keep current SFTP/API support and continue iterating toward May 8 CDC connection delivery.
- **Rebecca Beasley-Cockroft** (PM, RBC) — proposed a question-driven framing: pre-built vs. custom → which system / connection type → basic vs. enhanced if applicable → plus an express path for power users.
- **Alex Kearns** (PM, AK) — flagged that SFTP needed a clear home in any new framework.

### Existing prototype state
- `src/components/connections/AddConnectorModal.tsx` — current 4-option modal picker
- `src/components/layout/DataStudioShell.tsx` — L1 nav with Catalog / Connectors / Entity Mappings tabs
- Empty state copy: *"No connections yet"* / *"Add your first connector to start syncing data."* — preserved in wireframes verbatim

---

## Cross-PRD tensions surfaced (and resolved)

| Tension | Resolution |
|---|---|
| **Source-driven** (CDC PRD: pick NetSuite, never see "CDC") **vs. type-driven** (Manual Upload PRD: pick "Manual Upload" as the type) | Hybrid: mostly source-driven, with Manual Upload (and other custom paths) presented as siblings to systems |
| **Fivetran abstraction** — CDC PRD strict (never surface), QBO PRD uses "QBO Advanced (Fivetran)" | Never surface "Fivetran" in user-facing labels |
| **Where does Manual Upload live** | First-class option, alongside API and SFTP, under "Custom" |
| **QBO Basic vs. Enhanced** placement | After QBO is selected, on a sub-screen — not on the main picker |
| **Naming step** placement | After source/type selection, not before |
| **Repeat-source behavior** ("user already has NetSuite, picks again") | Allow at selection step. Guardrails come downstream from naming, dataset config, etc. — not the selection step's concern. |

---

## The two flow approaches

### V1 — Flat single-screen picker

> File: `connector-select-flow.html`

Every option visible at once on one screen, organized into two visual groups on the same tier:

- **Pre-Built** — QBO, NetSuite, Sage Intacct, Salesforce, Workday, …
- **Custom** — File (Manual Upload), API, SFTP

No hierarchy implied between groups. Within each group, every option is an equal sibling. Only QBO branches further (Basic vs. Enhanced) on a follow-up screen; everything else proceeds straight to its setup wizard.

**Best for** — power users, returning admins, anyone who knows what they want and doesn't need narrowing. Closest to Kristin's original mockup pattern (minus the "Which Data?" column).

### V2 — Progressive disclosure (recommended)

> File: `connector-select-flow-v2.html`

A question-driven decision tree, presented as progressive disclosure on a single screen (Dropbox onboarding pattern). Questions reveal sequentially as the user answers each one:

- **Q1 — Pre-Built or Custom?** First question, frames the path
- **Q2 — Which system?** (if Pre-Built) or **Which connection type?** (if Custom). The slot's content swaps based on Q1
- **Q3 — Basic or Enhanced?** Conditional — only fires for systems with multiple tiers (QBO today)

Plus a de-emphasized **"Show all connector types"** escape hatch that bypasses the guided flow and opens V1's flat picker for power users.

**Best for** — first-time users, infrequent admins (most admins set up connectors maybe once a quarter), anyone who benefits from being walked through the choices.

### Relationship between V1 and V2

V2 is the recommended default. V1 isn't a competing alternative — it's what V2's escape hatch points to. Same picker, different audiences.

---

## Key structural decisions

| # | Decision | Why |
|---|---|---|
| 1 | Pre-Built and Custom on the **same tier**, not parent-child | All connector types deserve equal status; one isn't a fallback for another |
| 2 | QBO Basic vs. Enhanced on a **sub-screen**, not on the main grid | The choice is consequential enough to warrant explanation; cluttering the source list with two QBO entries forces decisions without context |
| 3 | Vendor abstraction — **never surface Fivetran** | Per CDC PRD; reinforces the "FloQast-owned integration" framing |
| 4 | V2 default, V1 as escape hatch — **not a gating choice** | Drop directly into the guided experience; offer the bypass via a de-emphasized link, not a "Guided or express?" question |
| 5 | Empty state and populated state diverge **only in the entry CTA** | Same selection screen for first-timers and returning users — no separate first-run path |
| 6 | Search / filter omitted for v1 | With ~8 options today the grid is scannable. Add search input when option count crosses ~12. |
| 7 | Repeat-source selection allowed | Guardrails (uniqueness, naming) live downstream — not the selection step |

---

## Wireframes

Low-fi structural wireframes are in the **Data Studio (Models + Platform) Working File** Figma file, on the page **"↳ Connector Selection — Wireframes"** (file key `na83aD6BKigNV6fPUI1BqY`). The wireframes section sits at **y = 1700** on that page, below pre-existing content.

**Layout:** 3 columns × 5 rows + annotation column to the right.
- **Columns:** Full-page · Modal · Side panel (presentation comparison)
- **Rows:** Shared entry · V1 Selection · V1 QBO sub-screen · V2 Initial · V2 Expanded
- **Annotations:** numbered design-decision callouts in a column at x=3180

Total: 14 wireframes + 5 annotation cards.

---

## Open questions (deferred)

- **Naming.** "Pre-Built" and "Custom" are working labels — may be jargony. Alternatives: `Standard / Custom`, `Connect a system / Bring your own data`, `FQ-supported / User-defined`. Worth a separate naming pass.
- **Q1 visual treatment.** Big two-up cards? Radio + helper text? Segmented control? The choice signals which path is the "default" expectation.
- **Q2 system picker layout.** Logo grid: how many visible vs. behind a "More sources" expand? Sort order? Source descriptions inline or on hover?
- **Q3 reveal motion.** Fade in? Slide in? Just appear?
- **Express link placement.** Top-right? Footer? In-context near Q1?
- **Progress indicator style.** Continuous bar (Dropbox-style) or stepped dots? Stepped reads as "you have N steps total" which conflicts with conditional questions.
- **Source unavailable / coming soon.** Pattern for sources on the roadmap but not yet live.
- **Categorization.** If sources span ERPs, CRMs, HRIS, billing systems, the grid may eventually need category groupings.

---

## Files in this folder

| File | Purpose |
|---|---|
| `README.md` | This summary |
| `connector-select-flow.html` | V1 — flat single-screen picker (full reasoning + decision tree) |
| `connector-select-flow-v2.html` | V2 — progressive disclosure (full reasoning, question framework, trade-offs) |
| `prototype-prompt.md` | Prompt for spinning up a clickable prototype of V1 + V2 |

---

## Contributors

- **Natasha Clark** (designer) — flow exploration, V1/V2 docs, low-fi wireframes
- **Kristin Johnson** (designer) — earlier mockup, ongoing CDC connection design
- **Alex Kearns** (PM) — Data Studio PRDs, CDC and Manual Upload framing
- **Rebecca Beasley-Cockroft** (PM) — QBO PRDs, question-driven framing for V2
