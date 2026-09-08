# Migration Notes — Connections View

> Audit date: 2026-03-26
> Use this file to track decisions, deferred items, and questions as you migrate.

---

## Decisions

| Decision | Rationale | Date |
|---|---|---|
| Keep `SourceBadge` local | Domain-specific brand colors (QBO blue/purple, sFTP grey, API green) — no FlowUI equivalent | 2026-03-26 |
| Keep `ErrorBanner` local | No FlowUI inline-row error banner component exists | 2026-03-26 |
| Keep QBO wizard stepper custom | Tight coupling to step state; check FlowUI ProgressSteps before final call | 2026-03-26 |
| Keep "Connect to QuickBooks" button custom | #2CA01C is Intuit's brand green — must not be replaced with FloQast brand green | 2026-03-26 |

## Open Questions

- **Syncing pulse animation**: Local `StatusBadge` animates the dot with `animate-pulse` for "Syncing" status. FlowUI `StatusBadge` does not. Options: (1) drop the animation, (2) keep a wrapper that adds `animate-pulse` to a surrounding element. Decide before implementing #3.
- **3-dot menu danger + disabled states**: Verify FlowUI `DropdownButton` supports per-item `disabled` and `color="danger"` before starting #6. Use `flow-ui-mcp get-component-info` for DropdownButton.
- **CustomEndpointWizard container**: Modal vs SideDrawer decision deferred to implementation. The two-panel layout (left sidebar nav + right content) may not fit standard FlowUI patterns well. Could stay as a custom layout inside a `Modal`.
- **FlowUI ProgressSteps**: QBO wizard uses a custom 4-step stepper. Check `flow-ui-mcp search-components ProgressSteps` — if it exists and fits, migrate; otherwise keep custom.

## Deferred Items

- [ ] `connections/Badges.tsx` cleanup: after StatusBadge swap (#3), this file will only contain `SourceBadge` and `ErrorBanner`. Consider renaming to reflect remaining contents.
- [ ] Field Mapping view — not audited yet. Run separate `/design-audit` pass.
- [ ] Model detail views — not audited. See prior deferred view summary.

## Session Log

### 2026-03-26 (session 1 — audit)
- Audit completed for Connections view (`/data-studio/connections`)
- Screenshot captured: `audit/screenshot-connections-2026-03-26.png`
- Components analyzed: ConnectionsTable, Badges, AddConnectorModal, QBOBasicFlow, CustomEndpointWizard, EndpointLibrary
- 8 Green, 6 Yellow (including 2 AG Grid migrations), 4 Red
- Effort: L — two AG Grid migrations + three modal/overlay rewrites drive size

### 2026-03-26 (session 2 — Phase 2 + Phase 3 migration)
- All Phase 2 items completed: StatusBadge swap, Input isSearchable, Button swaps across all components, LibraryStatusBadge, QBOBasicFlow/EndpointLibrary buttons
- Phase 3 completed in full:
  - #15 FloQast Entity select → FlowUI Select (QBOBasicFlow)
  - #19b Category filter → FlowUI Select (EndpointLibrary)
  - #9 AddConnectorModal shell → FlowUI Modal size="md"
  - #11 QBOBasicFlow shell → FlowUI Modal size="md"; fixed duplicate footer bug
  - #6 3-dot menu → FlowUI Popover (uncontrolled; openMenuId state removed)
  - #16 CustomEndpointWizard → FlowUI Modal size="lg" (two-panel layout preserved as raw children)
  - #18 EndpointLibrary panel → FlowUI SideDrawer width="lg"
  - #7 ConnectionsTable → AgGridReact + floqastGridTheme; 6 named cell renderers; error/warning rows as isFullWidthRow + fullWidthCellRenderer; openEndpointLibrary passed via context
- Key decisions:
  - Popover uncontrolled (each row owns its state) — multiple menus can technically be open simultaneously but acceptable for prototype
  - CustomEndpointWizard: Modal not SideDrawer — two-panel left+right layout can't be expressed in SideDrawer
  - hasWarning bug in original ConnectorRow (undefined variable) fixed naturally by removing ConnectorRow
  - Syncing animate-pulse dot dropped — FlowUI StatusBadge doesn't support animation
- `tsc --noEmit` clean at end of session
- Open: Phase 4 cleanup (styled-components removal), Phase 5 polish, #5 entity tags

### 2026-03-26 (session 3 — visual polish)
- Fixed AG Grid row height: added `rowHeight={64}`, `getRowHeight` now only overrides error rows (44px)
- Fixed cell renderers: removed `height: 100%` wrapper divs; renderers return content directly
- `React` import removed (was only needed for `React.CSSProperties`)
- SourceBadge: changed `borderRadius` from 4px → 20px (pill), reduced to 10px font, settled on `padding: '3px 8px'` + `lineHeight: 1`
- Entity chips: changed `rounded` → `rounded-full`, `text-[11px]` → `text-[10px]`, `py-0.5` → `py-[3px]`, added `leading-none`
- Status column: removed FlowUI `StatusBadge` (bordered pill); replaced with custom dot + text (7px colored circle + 12px gray text). `STATUS_COLOR` map replaced with `STATUS_DOT` hex map
- `StatusBadge` import removed from FlowUI import line
- `tsc --noEmit` clean at end of session
