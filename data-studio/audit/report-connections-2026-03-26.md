# Design Audit Report — Connections View

> Prototype: Data Studio
> Audited: 2026-03-26
> Scope: Connections tab (`/data-studio/connections`)
> Screenshot: `audit/screenshot-connections-2026-03-26.png`

---

## At a Glance

| Metric | Value |
|---|---|
| Components in scope | 16 |
| Green (direct swap) | 8 |
| Yellow (needs adaptation) | 6 |
| Red (keep as-is) | 4 |
| Overall migration effort | **L** |

Two AG Grid migrations and three modal/overlay rewrites drive the effort. The individual
component swaps (buttons, inputs, badges) are quick. Work the quick wins first, then
tackle the structural changes.

---

## Component Analysis

### Main View — `ConnectionsTable.tsx`

---

#### #1 — "Add Connector" button (Green ✅)

**What it is:** The primary CTA in the top-right of the Connectors section header — green button
with a plus icon.

**What it should become:** FlowUI `Button` (default filled variant). Remove the inline
`style={{ backgroundColor: '#186749' }}` and the hand-rolled SVG plus icon.

- Import: `import { Button } from '@floqastinc/flow-ui_core'`
- Key props: `onClick={() => setModal({ type: 'add' })}`
- The FlowUI `Button` uses the brand green automatically — no color prop needed.

**Effort:** S

---

#### #2 — Search input (Green ✅)

**What it is:** The search box below the section header — `<input>` with a hand-rolled SVG
magnifier icon positioned absolutely inside a wrapper div.

**What it should become:** FlowUI `Input isSearchable`. Handles the search icon, clear
button, and focus states automatically. The wrapper div and SVG go away entirely.

- Import: `import { Input } from '@floqastinc/flow-ui_core'`
- Key props: `isSearchable value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by connection name or entity…"`

**Effort:** S

---

#### #3 — Connection status badges (Green ✅)

**What it is:** The pill-shaped badges in the Status column showing Connected / Syncing /
Error / Paused / Warning / Connecting. Currently rendered by a local `StatusBadge` function
in `connections/Badges.tsx` — NOT the FlowUI component.

**What it should become:** FlowUI `StatusBadge`. The local component shadows the FlowUI
export name, which makes it easy to confuse. Delete the local version, update the import.

- Import: `import { StatusBadge } from '@floqastinc/flow-ui_core'`
- Color mapping: `Connected` → `success`, `Error` → `danger`, `Warning` → `warning`,
  `Paused` → `neutral`, `Syncing` → `success`, `Connecting` → `info`
- Note: The "Syncing" pulsing dot animation is not part of FlowUI StatusBadge. Either
  accept the loss of animation or keep it in the status label text ("Syncing…"). Log
  the decision in `audit/notes.md`.

**Effort:** S

---

#### #4 — Source badges (Red 🔴)

**What it is:** The colored pill badges in the Source column — QBO Basic (blue), QBO Enhanced
(purple), sFTP (grey), API Connector (green). Each has a distinct brand color and border.

**Status:** Keep as-is. These are domain-specific brand representations, not status
indicators. No FlowUI equivalent exists for per-source brand coloring. The local
`SourceBadge` component in `connections/Badges.tsx` is the right home for this.

---

#### #5 — Entity tags (Green, low priority ✅)

**What it is:** The small grey chips in the Entities column — `<span className="...bg-gray-100...">`.

**What it should become:** FlowUI `StatusBadge color="neutral"`. Low priority since
`neutral` StatusBadge renders nearly identically. Fine to defer to a polish pass.

**Effort:** XS

---

#### #6 — 3-dot action menu (Yellow 🟡)

**What it is:** The `•••` button on each row that opens a popover with 4 actions: View
Endpoints, Edit, Pause/Resume, Reconnect. Currently hand-rolled — `useRef` + `mousedown`
listener + absolutely-positioned `div`.

**What it should become:** FlowUI `DropdownButton` (ghost variant, icon-only) paired with a
custom `DropdownPanel` containing the action items. The `useRef`/`mousedown` logic and the
custom popover div go away.

- The menu items need danger styling on "Reconnect" (when in error state) and disabled
  states for Pause/Resume depending on connection status. Verify FlowUI `DropdownButton`
  supports these states via the MCP before implementing.
- This is a compound component — classify the trigger AND the panel together. The trigger
  is a clean Green swap; the content panel needs matching FlowUI treatment.

**Effort:** M

---

#### #7 — Connections data table (Yellow 🟡)

**What it is:** The main table showing connectors — custom CSS grid (`display: grid` with
`gridTemplateColumns`). Not AG Grid.

**What it should become:** `AgGridReact` with `floqastGridTheme`. The grid has 6 columns
(Connection, Source, Entities, Status, Last Synced, action). Cell renderers needed for
Status (FlowUI `StatusBadge`), Source (`SourceBadge` kept as-is), Entities (tag chips),
and the action column (3-dot menu).

- AG Grid community edition is installed and sufficient — no enterprise features needed.
- `domLayout="autoHeight"` recommended since row count is dynamic.
- The inline error banners (`ErrorBanner`) that render below rows need special handling —
  use a detail row or `fullWidthCellRenderer` pattern (same as the catalog models table).

**Effort:** M

---

#### #8 — Inline error banners (Red 🔴)

**What it is:** The red/orange banners that appear below rows with errors — custom
`ErrorBanner` component in `connections/Badges.tsx`. Shows message + action buttons
(Reconnect, View Sync Log).

**Status:** Keep as-is. No FlowUI equivalent for inline row-level error banners with
contextual actions. The custom implementation is well-contained.

---

### Add Connector Modal — `AddConnectorModal.tsx`

---

#### #9 — Modal shell (Yellow 🟡)

**What it is:** The "Select Source Type" modal — custom `fixed inset-0` backdrop + absolute
centered white card.

**What it should become:** FlowUI `Modal`. Handles backdrop, z-index, focus trap, and Escape
key automatically.

- Import: `import { Modal } from '@floqastinc/flow-ui_core'`
- The source type selection cards (the 4 option buttons) stay as custom content inside
  the modal body — no FlowUI equivalent for radio-card-style selectors.

**Effort:** S

---

#### #10 — Modal footer buttons (Green ✅)

**What it is:** Cancel and Continue buttons in `AddConnectorModal`.

**What it should become:** FlowUI `Button` components. Cancel → `variant="outlined"`,
Continue → default filled. Wrap in `ButtonGroup` for proper spacing.

**Effort:** XS

---

### QBO Basic Flow — `QBOBasicFlow.tsx`

---

#### #11 — Modal shell (Yellow 🟡)

**What it is:** The 4-step QBO Basic connection wizard — custom modal overlay (same
`fixed inset-0` + centered card pattern as `AddConnectorModal`).

**What it should become:** FlowUI `Modal`. Same swap as #9.

**Effort:** S

---

#### #12 — Custom wizard stepper (Red 🔴)

**What it is:** The 4-step progress indicator (Name → Authorize → Validate → Configure)
with circle steps, connecting lines, and check marks.

**Status:** Keep as-is. FlowUI has a `ProgressSteps` component — worth checking via MCP
before committing to keeping this. However, the custom implementation ties step state
tightly to the wizard content, so even if `ProgressSteps` exists, the migration effort
may not be worth it for a prototype.

---

#### #13 — Wizard action buttons (Green ✅)

**What it is:** The Next, Back, Cancel, and Finish buttons in QBOBasicFlow footer, plus
"Validate Connection" and "Simulate Error" buttons in step content.

**What it should become:** FlowUI `Button`. Back/Cancel → `variant="outlined"`,
primary actions → default filled. Disabled state handled via the `disabled` prop.

**Effort:** S

---

#### #14 — Connection name input (Green ✅)

**What it is:** The text input on step 0 ("Connection Name").

**What it should become:** FlowUI `Input` with a `label` prop.

**Effort:** XS

---

#### #15 — FloQast Entity select (Yellow 🟡)

**What it is:** The native `<select>` on step 3 for choosing the FloQast entity. We already
did this pattern in `RunTestModal.tsx` — same swap applies here.

**What it should become:** FlowUI `Select` with `options` array and `onChange`.

- Import: `import { Select } from '@floqastinc/flow-ui_core'`
- We already have the TypeScript stub in `flow-ui.d.ts`.

**Effort:** S

---

### Custom Endpoint Wizard — `CustomEndpointWizard.tsx`

---

#### #16 — Wizard container (Yellow 🟡)

**What it is:** The 5-step custom API setup wizard — custom full-screen overlay with a
left sidebar stepper and right main content area. Not a standard modal shape.

**What it should become:** FlowUI `SideDrawer` or `Modal`. Given the sidebar nav layout,
a wide `Modal` (or `SideDrawer` from the right) is the closest match. Check FlowUI
`SideDrawer` and `Modal` props via MCP to determine which fits better.

- The left sidebar stepper stays as custom content regardless.
- This is a medium-complexity swap because of the two-panel layout.

**Effort:** M

---

#### #17 — Form inputs and buttons throughout wizard (Green ✅)

**What it is:** All `<input>` fields (API Name, Base URL, endpoint path, param inputs) and
`<button>` elements (HTTP method toggle, auth type selectors, Next/Back/Save buttons).

**What it should become:** FlowUI `Input` for text fields, FlowUI `Button` for action
buttons. The HTTP Method and Auth Type button toggles are radio-style and can use
`Button variant="outlined"` with active state toggling. No FlowUI-specific toggle group
exists, so the custom toggle button pattern stays but uses FlowUI `Button` styling.

**Effort:** S (buttons) + S (inputs)

---

### Endpoint Library — `EndpointLibrary.tsx`

---

#### #18 — Library side panel (Yellow 🟡)

**What it is:** The full-height panel that slides in from the right when "View Endpoints"
is selected — custom div with fixed positioning and box shadow.

**What it should become:** FlowUI `SideDrawer`. Check if FlowUI's SideDrawer supports the
two-panel split layout (main list + config panel). If not, the outer shell can use
SideDrawer while the config panel stays custom.

**Effort:** M

---

#### #19 — Endpoint library search + category filter (Green + Yellow 🟡)

**What it is:** A search input (custom) and a `<select>` category dropdown inside
the library panel.

**What it should become:**
- Search: FlowUI `Input isSearchable` (Green ✅)
- Category select: FlowUI `Select` (Yellow 🟡) — same pattern as #15

**Effort:** S total

---

#### #20 — Library status badges (Green ✅)

**What it is:** The `LibraryStatusBadge` component at the bottom of `EndpointLibrary.tsx` —
another local badge that renders Active/Inactive/Not Added states.

**What it should become:** FlowUI `StatusBadge`. Color mapping: `Active` → `success`,
`Inactive` → `neutral`, `Not Added` → omit badge or use `neutral` with italic text.

**Effort:** XS

---

#### #21 — "Activate" and secondary buttons (Green ✅)

**What it is:** The "Activate", "Configured", and "Add Custom Endpoint" buttons throughout
the library panel.

**What it should become:** FlowUI `Button`. Activate → default filled, Configured →
`variant="outlined"`, Add Custom Endpoint → `variant="ghost"`.

**Effort:** XS

---

## Architecture — Current State

| Area | Status |
|---|---|
| FlowUI packages | ✅ Already installed |
| Theme.apply() | ✅ Present in main.tsx |
| Inter font override | ✅ JS injection after Theme.apply() |
| Tailwind CSS layers | ✅ No `layer()` wrapper |
| AG Grid (community) | ✅ Installed — needs to be used for this view |
| GlobalNavSidebar | ✅ From shared components |
| lucide-react | ✅ Not present |
| styled-components | ⚠️ Present in dependencies — still unused in scope |

Foundation is complete. No Phase 1 work needed for the connections view.

---

## Known Deviations Encountered

| Component | Deviation | Impact |
|---|---|---|
| `StatusBadge` in `connections/Badges.tsx` | Local component shadows FlowUI export name — easy to confuse during development | Swap local import to FlowUI — color values need remapping (see #3) |
| `LibraryStatusBadge` in `EndpointLibrary.tsx` | Another local badge with the same rendering pattern | Same swap applies |

---

## Recommended Next Steps

1. **Run `/design-fix playspace/data-studio`** to implement these findings. Start with Phase 2
   (quick wins — buttons, inputs, badge swaps) before tackling the AG Grid and modal work.
2. **AG Grid migration for ConnectionsTable** is the highest-impact Phase 3 item — the
   table is the primary view and the custom grid won't scale to more rows or sorting.
3. **Modals (AddConnectorModal, QBOBasicFlow) are quick wins in Phase 3** — the FlowUI
   `Modal` swap is straightforward once the Phase 2 items are done.
4. **Field Mapping view** (`/data-studio/model/:id/field-mapping`) remains unaudited —
   run a separate `/design-audit` pass when ready.
