# Migration Checklist — Data Studio Prototype

> Generated from design audit on 2026-03-26
> Scope: Landing state (`/data-studio/catalog`)
> Work top-to-bottom — each phase builds on the previous one.

---

## Phase 1: Foundation
_Already complete. No action needed._

- [x] FlowUI packages installed (`flow-ui_core`, `flow-ui_icons`, `flow-ui_composite`)
- [x] `Theme.apply(null, { standalone: true })` in main.tsx
- [x] Tailwind CSS imported without `layer()` wrapper
- [x] Inter font loaded via Google Fonts in index.html
- [x] AG Grid packages installed
- [x] GlobalNavSidebar in use

---

## Phase 2: Quick Wins
_Direct component swaps — high impact, ~30 min total._

- [x] **#5 Status badges** — Replaced with `StatusBadge` from `@floqastinc/flow-ui_core` (`color="success"` / `color="neutral"`). Done as part of AG Grid migration.
- [x] **#3 Search input** — Replaced custom `<input>` + SVG with `<Input isSearchable placeholder="Start searching..." className="w-[312px]" />`.
- [x] **#2 Admin Settings tabs** — Replaced custom `<button>` tab strip with FlowUI `TabGroup` + `Tab`. `defaultValue="data-studio"`, non-active tabs use `disabled` prop.
- [x] **Inline SVG icons** — `SearchIcon` removed (FlowUI `Input` handles icon internally). `SortIcon` removed (AG Grid handles sort natively).

---

## Phase 3: AG Grid Migration
_The main event — migrate ModelsTable from custom HTML table to AG Grid._

- [x] **Install theme setup** — `floqastGridTheme` already existed in `src/components/grid/floqastGridTheme.ts`. No changes needed.
- [x] **Migrate ModelsTable** — Replaced `<table>` + `DomainAccordion` with `AgGridReact`. Used `isFullWidthRow` + `fullWidthCellRenderer` for the domain accordion (community-compatible alternative to enterprise row grouping). `domLayout="autoHeight"`, `rowHeight={70}`, `onRowClicked` for model navigation.
- [x] **Cell renderers** — Model name (name + version subtitle) and Status (`StatusBadge`) implemented as inline `cellRenderer` functions in column defs.
- [x] **Sort** — `SortIcon` SVG removed. AG Grid handles sort natively.

---

## Phase 4: Polish
_Cleanup after component migration._

- [x] Remove hand-rolled `SortIcon` and `SearchIcon` from component files (replaced in Phase 2/3 — already gone).
- [x] Audit remaining hardcoded hex colors — `#e1e6ef` borders and `#adb2bb`/`#1d2433` text in landing-state components are design-correct FlowUI values. Connections/EntityMappings files are deferred. No replacements needed at prototype scale.
- [x] Verify all text uses Inter — removed two redundant `fontFamily: 'Inter, sans-serif'` inline styles from `ModelsTable.tsx` GroupRowRenderer. Museo Sans on "Admin Settings" heading is intentional (noted in decisions).
- [x] Check focus states — `suppressCellFocus={true}` on AG Grid is correct. FlowUI `Input`, `TabGroup`, `Tab` handle their own focus rings. Nothing suppressed.

---

## Next Audit Scope (Phase 5)
_Not in this checklist — requires a separate audit pass._

- [ ] Run `/design-audit` on field mapping views: `FieldMappingView`, `AiBanner`, `ConversationalAiPanel`, `DirectedTransformationDropdown`, `PublishDialog`, `RunTestModal`
- [ ] Run `/design-audit` on `ConnectionsTable` and `EntityMappingsTable`
- [ ] Run `/design-audit` on Model detail views: `ModelView`, `ModelHeader`, `SidebarNav`, `OverviewSection`, `SourceDatasetsSection`
