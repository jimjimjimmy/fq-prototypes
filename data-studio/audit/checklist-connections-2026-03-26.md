# Migration Checklist — Connections View

> Generated from design audit on 2026-03-26
> Work top-to-bottom — each phase builds on the previous one.
> Reference: `audit/report-connections-2026-03-26.md`

---

## Phase 2: Quick Wins
_Direct component swaps — buttons, inputs, badges. High impact, low effort._

- [x] **#1 Add Connector button**: swapped to FlowUI `Button` in ConnectionsTable.tsx (header + EmptyState)
- [x] **#2 Search input**: swapped to `Input isSearchable` in ConnectionsTable.tsx; SVG icon wrapper removed
- [x] **#3 Local StatusBadge → FlowUI StatusBadge**: deleted local StatusBadge from Badges.tsx; ConnectionsTable imports FlowUI StatusBadge with STATUS_COLOR map; Syncing pulse animation dropped (using label text instead)
- [ ] **#5 Entity tags**: swap `<span className="bg-gray-100">` chips → `<StatusBadge color="neutral">` (low priority — do last)
- [x] **#10 AddConnectorModal footer buttons**: Cancel → `Button variant="outlined" color="dark"`, Continue → `Button`
- [x] **#13 QBOBasicFlow wizard buttons**: all Next/Back/Cancel/Finish/Validate/Retry swapped to FlowUI `Button`
- [x] **#14 Connection name input**: swapped to `Input` with `label` prop
- [x] **#17 CustomEndpointWizard inputs + buttons**: Field helper rewritten with `Input`; all action buttons swapped to FlowUI `Button`; `mono` prop dropped (not available on FlowUI Input)
- [x] **#19a Endpoint library search**: swapped to `Input isSearchable`; SVG wrapper removed
- [x] **#20 LibraryStatusBadge**: function rewritten using FlowUI `StatusBadge`
- [x] **#21 Endpoint library buttons**: Activate → `Button`, Configured → `Button outlined`, Cancel → `Button outlined`, Activate Endpoint → `Button`, Add Custom Endpoint → `Button outlined`

---

## Phase 3: Adaptations
_Larger structural changes — AG Grid, modals, select dropdowns._

- [x] **#15 FloQast Entity select**: native `<select>` → FlowUI `Select selectionMode="single" disableClear` in QBOBasicFlow.tsx step 3
- [x] **#19b Category filter select**: native `<select>` → FlowUI `Select disableFilter disableClear` in EndpointLibrary.tsx
- [x] **#9 AddConnectorModal shell**: custom overlay → FlowUI `Modal open={true} onOpenChange={v => !v && onClose()} size="md"` with Modal.Header/Body/Footer; source type cards stay custom inside body
- [x] **#11 QBOBasicFlow modal shell**: custom overlay → FlowUI `Modal size="md"` with Modal.Header/Body/Footer; footer layout uses `flex justify-between w-full`; wizard stepper + step content stay custom; duplicate footer buttons removed
- [x] **#6 3-dot action menu**: hand-rolled useRef/mousedown popover → FlowUI `Popover` (uncontrolled); openMenuId state removed; each row manages its own open state; uses Popover.Trigger + Popover.Content side="bottom" align="end"
- [x] **#16 CustomEndpointWizard container**: used `Modal size="lg"` (not SideDrawer) — two-panel layout (sidebar stepper + main content) doesn't map to SideDrawer; raw children inside Modal with custom flex div preserves layout while getting backdrop/focus trap
- [x] **#18 Endpoint library side panel**: custom right-side panel → FlowUI `SideDrawer show={true} onCancel={onClose} width="lg"` with SideDrawer.Body; config panel stays custom (no SideDrawer two-panel support)
- [x] **#7 Connections data table**: custom CSS grid → `AgGridReact` with `floqastGridTheme`; community edition; named cell renderers for all 6 columns; error/warning banner rows inserted as full-width rows via `isFullWidthRow` + `fullWidthCellRenderer`; Popover 3-dot menu passes `openEndpointLibrary` via AG Grid `context`; `hasWarning` bug in original ConnectorRow fixed

---

## Phase 4: Architecture
_Structural cleanup._

- [ ] Remove `styled-components` from `package.json` if confirmed unused across all views
- [ ] Consider moving `SourceBadge` and `ErrorBanner` out of `connections/Badges.tsx` into more descriptive filenames (e.g., `connections/SourceBadge.tsx`, `connections/ErrorBanner.tsx`) — avoids the `StatusBadge` naming confusion

---

## Phase 5: Polish

- [ ] Audit entity tag spacing inside AG Grid cells (4px/8px grid)
- [ ] Verify all FlowUI `Button` sizes are consistent across the view (default `md`)
- [ ] Run `tsc --noEmit` clean across all changed files
- [ ] Verify Inter font rendering in AG Grid cells (theme already sets `fontFamily: { googleFont: "Inter" }`)
