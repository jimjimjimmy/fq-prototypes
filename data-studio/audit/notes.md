# Migration Notes

> Use this file to track decisions, deferred items, and questions as you migrate.

## Decisions

| Decision | Rationale | Date |
|---|---|---|
| Keep DevToolbar as-is | It's a dev tool for toggling AI modes, not product UI. Dark theme is intentional. | 2026-03-26 |
| Keep Museo Sans on "Admin Settings" heading | Intentional FloQast brand typography for top-level page headings. | 2026-03-26 |
| Keep Tailwind CSS import as-is | Without `layer()` is correct for FlowUI compatibility. Documented in CLAUDE.md. Do not change. | 2026-03-26 |
| AG Grid accordion via `isFullWidthRow` not native row grouping | Enterprise row grouping not installed. `isFullWidthRow` + `fullWidthCellRenderer` is the community-compatible approach. Domain group rows are embedded in `rowData` with `_rowType: 'group'`; `rowData` is rebuilt via `useMemo` when a group is toggled. | 2026-03-26 |
| `StatusBadge` not `Badge` | FlowUI doesn't export a generic `Badge` component. `StatusBadge` is the correct component for status pills. Colors: `success` = Active (green dot), `neutral` = Inactive (grey dot). | 2026-03-26 |

## Deferred Items

- [ ] Field mapping views (FieldMappingTable, AiBanner, ConversationalAiPanel, etc.) — needs separate audit pass
- [ ] ConnectionsTable — needs separate audit pass
- [ ] EntityMappingsTable — needs separate audit pass
- [ ] Model detail views — needs separate audit pass

## Questions

- What are the exact FlowUI `Badge` variant names for "Active" (green) and "Inactive" (grey)? Check Storybook.
- Does FlowUI `Input` have an `isSearchable` prop or a search-specific variant? Check Storybook.
- For AG Grid row grouping, should the domain group rows be collapsible (current behavior) or always expanded?

## Session Log

### 2026-03-26 (Phase 4)
- Phase 4 polish completed
- `SortIcon`/`SearchIcon` confirmed already removed in Phase 2/3
- Hardcoded hex colors audited — all in-scope values (`#e1e6ef`, `#adb2bb`, `#1d2433`) are design-correct FlowUI values, no token replacements needed at prototype scale
- Removed 2 redundant `fontFamily: 'Inter, sans-serif'` inline styles from `ModelsTable.tsx` GroupRowRenderer (Inter is already the default font)
- Focus states verified clean: `suppressCellFocus={true}` on grid, FlowUI components handle their own rings
- TypeScript: clean build
- Migration of landing state (catalog) is complete

### 2026-03-26
- Initial audit completed — landing state only
- Foundation: all green, no changes needed
- 4 yellow items identified: Admin Settings tabs, search input, ModelsTable (AG Grid migration), status badges
- Screenshots generated: `screenshot-original.png`, `screenshot-annotated.png`

- Phase 2 + Phase 3 migration completed:
  - `DataStudioShell.tsx`: `SearchIcon` SVG + raw `<input>` → FlowUI `Input isSearchable`
  - `AdminSettingsShell.tsx`: custom `<button>` tab strip → FlowUI `TabGroup` + `Tab` (defaultValue="data-studio")
  - `ModelsTable.tsx`: full rewrite — HTML table + `DomainAccordion` → AG Grid with `isFullWidthRow` accordion, `StatusBadge` for status cells, native sort
- TypeScript: clean build (`tsc --noEmit` passes)
- Next: Phase 4 polish (token colors, Inter font audit, focus states)
