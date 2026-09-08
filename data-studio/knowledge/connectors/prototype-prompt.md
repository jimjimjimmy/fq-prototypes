# Prototype Prompt — Connector Selection Flow

A copy-pasteable prompt for spinning up a clickable prototype of the V1 and V2 selection flows.

---

## How to use this

Open Claude Design (or your prototype tool) and paste the prompt below. Attach or share the supporting files in this folder if the tool supports it:
- `README.md` — full context summary
- `connector-select-flow.html` — V1 flow doc with decision tree
- `connector-select-flow-v2.html` — V2 flow doc with decision tree

If the tool also accepts visual references, share the Figma wireframes page (file key `na83aD6BKigNV6fPUI1BqY`, page **"↳ Connector Selection — Wireframes"**, content at y≥1700).

---

## The prompt

```
Build a clickable prototype demonstrating two competing UX flows for adding a new
connector in FloQast's Data Studio product. The prototype should let me toggle
between flows and walk through each end-to-end so I can compare them with PMs and
the rest of the design team.

CONTEXT
Data Studio is a self-service data integration platform. A "connector" brings
external data into FloQast — either from a pre-built integration (QBO, NetSuite,
etc.) or via custom transmission (file upload, API, SFTP). Today the prototype has
a basic 4-option modal picker. We're exploring two evolutions of that picker.

STACK
React + TypeScript + Vite + Tailwind. Use simple components — no need for a full
design system. Inter font. Neutral grays and a single dark accent for primary CTAs.
This is a clickable prototype for stakeholder review, not production code, but the
visual fidelity should feel like real product UI (not gray boxes). No real system
logos — use placeholder squares with the system's first letter.

LAYOUT SHELL (shared by both flows)
- Top L1 nav: "Data Studio" wordmark left, then horizontal tabs:
  Catalog · Connectors (active) · Entity Mappings
- Section header below: "Connectors" title left, "+ Add Connector" CTA top-right,
  subtitle "Configure and monitor your data source connections"
- Content area below the header

ENTRY STATES
1. Empty state (no connectors yet):
   - Centered icon placeholder
   - Heading: "No connections yet"
   - Subtext: "Add your first connector to start syncing data."
   - CTA: "+ Add Connector"
2. Populated state:
   - Search bar
   - Table with 4 mock rows. Columns: Connection · Source · Status · Last Synced ·
     Actions menu. Mock rows: "QBO — Production" (Connected), "NetSuite — Main"
     (Syncing), "Sage Intacct — Acme" (Error), "Manual JE Upload" (Connected).
   - "+ Add Connector" CTA top-right of section header

Both states open the selection experience when "+ Add Connector" is clicked.
The selection experience can be presented in THREE patterns (toggle between them
— see TOGGLES section below):

PRESENTATION PATTERNS
1. Full-page — selection takes over the main content area. L1 nav stays at the
   top. The section header changes to "Add a connector" with a "✕ Cancel" link
   top-right (replacing the "+ Add Connector" CTA). Content area is the picker.
2. Modal — centered modal (~600px wide) over a dimmed populated state. Modal has
   a close (✕) button top-right. The Connectors tab is faintly visible behind a
   scrim.
3. Side panel — slides in from the right edge. Panel is ~360–400px wide, full
   content-area height. The Connectors tab to the left is dimmed with a light
   scrim. Panel has a close (✕) button top-right.

The same flow content (V1 or V2) renders inside whichever presentation pattern
is active — only the chrome changes.

============================================================
FLOW V1 — Flat single-screen picker
============================================================
On opening: modal shows the heading "What do you want to connect?", a small
"Show all connector types →" link top-right (in V1 this is redundant — keep it for
parity with V2), and two side-by-side groups:

GROUP 1: "Pre-Built" (subtitle: "FQ-supported integrations")
  Tiles: QBO · NetSuite · Sage Intacct · Salesforce · Workday
  Each tile: small placeholder logo + system name. Hover state: subtle border
  highlight. Click → see destination logic below.

GROUP 2: "Custom" (subtitle: "User-defined transmission methods")
  Tiles: File (Manual Upload) · API · SFTP
  Same tile pattern. Click → "Selected: [option]" success screen.

The two groups are visually distinct (e.g., bordered region with a label) but on
the SAME tier — neither is subordinate.

CLICK DESTINATIONS
- Click QBO → opens a sub-screen INSIDE the same modal (replaces the picker
  content): heading "How do you want to connect QuickBooks Online?", subtitle
  "Two paths — pick the one that matches your data needs.", two side-by-side
  cards. A "← Back to all connectors" link returns to the picker.
  - Card 1: "QBO Basic" / "Direct API · OAuth" / bullets: Accounts, Trial Balance,
    Daily sync. "Select →"
  - Card 2: "QBO Enhanced" / "Continuous sync · broader scope" / bullets:
    Accounts + Balances, Transactions, Dimensions, Continuous sync. "Select →"
  - Click either → "Selected: QBO [Basic|Enhanced]" success screen
- Click any other system or any Custom option → "Selected: [option]" success screen

============================================================
FLOW V2 — Progressive disclosure
============================================================
On opening: modal shows the heading "Add a connector", subtitle "A few quick
questions to get you connected", a thin progress bar at top, and a "Show all
connector types →" link top-right (this is the de-emphasized escape hatch that
swaps to V1's picker).

Q1 — "Pre-Built or Custom?" appears first as two big side-by-side cards:
  - Card 1: "Pre-Built" — "FQ-supported integrations like QuickBooks Online,
    NetSuite, Sage Intacct."
  - Card 2: "Custom" — "Bring your own data via file upload, API, or SFTP."

Continue button at bottom of modal — DISABLED until an answer is selected.

ANSWER BEHAVIOR
When the user picks an answer:
- The Q1 row collapses to a compact summary: "Pre-Built or Custom?" label small,
  the chosen answer prominent, a green ✓, and an "Edit" link at right.
- Q2 reveals BELOW Q1 (smooth fade-in or slide-in).
- Progress bar advances.

Q2 content depends on Q1:
- If "Pre-Built" → Q2 is "Which system?" with a logo grid of QBO, NetSuite, Sage
  Intacct, Salesforce, Workday.
- If "Custom" → Q2 is "Which connection type?" with three options: File (Manual
  Upload), API, SFTP.

When Q2 is answered:
- Q2 also collapses to a compact summary row with checkmark + Edit link.
- If Q2's answer is QBO → Q3 reveals: "How do you want to connect QBO?" with a
  subtitle "Since you picked QBO, we need one more thing." and Basic vs. Enhanced
  cards (same content as V1's QBO sub-screen). Continue stays disabled until Q3
  is answered.
- If Q2's answer is anything else → Continue activates immediately (no Q3).

Click Continue → "Selected: [path summary]" success screen.

ESCAPE HATCH
Click "Show all connector types →" anytime → swap to V1's flat picker. The user
can continue from V1 normally.

EDITING ANSWERS
Clicking Edit on any collapsed answer row should re-expand that question and
discard downstream answers (Q2 and below).

============================================================
TOGGLES (two of them)
============================================================
Provide a small floating control in the corner (or pinned to the L1 nav header)
with TWO independent toggles:

1. FLOW toggle: V1 (flat picker) ↔ V2 (progressive disclosure)
2. PRESENTATION toggle: Full-page · Modal · Side panel

Switching either toggle re-renders the active selection experience using the
new combination. The same +Add Connector CTA opens whichever flow + presentation
is currently active. All 6 combinations (2 flows × 3 presentations) should be
walkable end-to-end.

============================================================
WIZARD PLACEHOLDER SCREEN
============================================================
After any final selection (V1: clicking a connector tile or QBO Basic/Enhanced;
V2: clicking Continue when all required questions are answered), transition to
a placeholder "setup wizard" screen. This stands in for the real wizard, which
is out of scope.

The wizard placeholder screen should:
- Render INSIDE the same presentation pattern that was active (full-page,
  modal, or side panel — don't switch chrome mid-flow)
- Show a step indicator: "Step 1 of 4 — Name" (greyed out steps 2–4 visible)
- Heading: "Set up [option name]" (e.g., "Set up NetSuite", "Set up QBO Basic",
  "Set up File (Manual Upload)")
- Body: a placeholder input for "Connector name" with helper text, then a
  greyed-out content block with the text "Setup wizard steps continue here —
  out of scope for this prototype"
- Footer: "← Back" link (returns to the selection screen with prior answers
  preserved) and "Cancel" link that closes the experience back to the
  populated Connectors tab

This gives stakeholders a sense of "what happens next" without committing to
real wizard design.

============================================================
WHAT'S OUT OF SCOPE
============================================================
- Setup wizards after selection (Name / Credentials / Provision / Validate)
- Real authentication, real data, real API calls
- Real system logos
- Mobile / responsive variants — desktop only
- Final copy polish — placeholders are fine

DELIVERABLE
A single Vite + React + TypeScript project that boots with `npm run dev` and
shows the Connectors tab as the default route. Provide the two toggles for
switching between V1/V2 flows and Full-page/Modal/Side-panel presentations
(6 combinations). Keep components small and readable so the design team can
tweak copy and layout directly.
```

---

## Notes for the prompter

- **Why two toggles** — the prototype needs to support two comparison axes: which *flow* (V1 vs. V2) and which *presentation* (full-page vs. modal vs. side panel). All six combinations should be walkable so stakeholders can evaluate them independently.
- **Why a wizard placeholder instead of a success screen** — gives stakeholders a sense of "what happens after selection" without committing to real wizard design. Helps them mentally complete the flow.
- **Why no real logos** — speed, plus copyright. Use first-letter placeholders (e.g., "Q" for QBO, "N" for NetSuite) inside a soft-gray rounded square.
- **What to test in review** — have stakeholders walk both flows end-to-end with the same starting intent ("I want to add NetSuite" / "I want to upload a file" / "I want to add QBO"). Ask which flow feels more natural, then switch presentation patterns and ask the same question. Watch for where they hesitate.

---

## After the prototype is built

Suggested follow-ups before mid-fi:
1. Walk it with Alex and Rebecca — confirm the question framing in V2 reads correctly
2. Walk it with Kristin — confirm V1's flat picker doesn't conflict with her ongoing CDC work
3. Decide: V1 or V2 as the lead, or run both in parallel for an A/B test
4. Take the chosen flow into mid-fi with FlowUI components and real copy
