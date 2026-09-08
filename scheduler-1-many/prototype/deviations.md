# Prototype Deviations Log

Per-run record of where this prototype's implementation deviates from the Figma source.
See `knowledge/design-system/deviations-registry.json` for the cross-project registry.

---

## Run 1 — 2026-05-22 — Schedule Main View (node 114:51168)

Figma: https://www.figma.com/design/OSbs5FfJ1zDwzDHlZl2kfh/Project-Schedule?node-id=114-51168

### Deferred (deliberately simplified for first build)

- **Table is static HTML, not AG Grid.** Figma + designer notes call for an AG Grid with per-column filter funnels, sort, pagination, and a right-rail Columns/Filters tabs panel. First build uses a styled HTML table with sort-arrow affordances only. No real sort/filter/pagination logic.
  - *Impact:* visual approximation only — no interactivity beyond hover.
  - *Upgrade path:* swap `SchedulesTable.tsx` for an AG Grid implementation using the canonical pattern at `knowledge/design-system/examples/ag-grid/accruals-table.example.tsx`.

- **Right-rail Columns/Filters tabs not implemented.** Figma shows a vertical tabs panel attached to the right edge of the table. Not present in the first build.
  - *Impact:* missing visual element on the right side of the table.

- **Pagination footer is a static "Page 1 of 1" / "Showing 25" label.** No real pagination control.

- **No row click / detail navigation wired up.** Figma's "Details View" section implies row click opens a detail panel. Out of scope for this build.

### Code Connect ambiguity

- **Status pill: `Tag` vs `StatusBadge`.** The Code Connect map for node 114:51168 returned both `Tag` (×15 instances) and `StatusBadge` (×3 instances). The Figma designer used some instances of each. I chose `StatusBadge` because:
  - The Figma renders show a colored dot + text — that matches `StatusBadge` (Circle icon + text), not `Tag` (SellOutlined / price-tag icon + text).
  - `StatusBadge` has the semantic color API (`neutral` | `info` | `success` | `warning` | `danger`) needed for the various statuses ("Running", "Completed", "Failed", etc.).
  - `Tag` has no color/variant prop in the live source — it's purely text + a fixed tag icon.
  - *Action item:* surface to designer — should "Running" / "Completed" / etc. be `StatusBadge` or `Tag`? Today they may have mixed usage in the Figma component library.

- **Status color → semantic color mapping.** Mapped per the design system's semantic intent:
  - Running → `info` (in-progress)
  - Completed → `success`
  - Completed with Issues → `warning`
  - Failed → `danger`
  - Disabled / Scheduled → `neutral`
  - *Action item:* confirm these mappings against the "All Statuses for MVP" notes section of the Figma file.

### Phantom prop caught by live-API validation

- **`Input` does not have a `leftItem` prop.** First draft of `SchedulePageHeader.tsx` passed `<Input leftItem={...}>`. Live source check (`node_modules/@floqastinc/flow-ui_core/Input/index.js`) confirmed the real API: `<Input><Input.LeftItem>{icon}</Input.LeftItem></Input>` — a compound child, not a prop. Code corrected before commit.
  - *Why it happened:* Code Connect for the Input node returned source location only, no snippet (`hasTemplate: false`). The skill normally falls back to `flow-ui-mcp` live API validation, but the MCP wasn't registered in this session. Source grep of `node_modules` filled the gap.
  - *Action item:* register `flow-ui-mcp` so this validation is automatic next session. Per `CLAUDE.md`, run `./mcp/setup.sh`.

### Approximations not yet verified

- **Column widths** are guesses based on the Figma small-render screenshot — `2fr / 1.2fr / 1.2fr / 1.2fr / 1.5fr / 1.2fr / 1.5fr / 72px / 48px` for the 9 columns. Will need fine-tuning against a higher-res Figma capture or a frame comparison.
- **Header background `#f8fafc`** for column-header and footer rows is a guess. Figma may specify a different neutral.
- **Subtitle color `#424867`** uses the FloQast secondary body text token. Confirm it matches Figma.

### Deferred sub-components (phased approach)

- **Scope picker is a flat multi-select, not a hierarchical tree.** Figma node `206:67798` shows the Scope field opened as a custom tree composition:
  - "Select All Entities and Accounts" master row
  - Collapsible Entity rows with `0/N Selected` counter pills
  - Nested Account rows (indented checkboxes)
  - Three-state checkboxes (none / partial / all)

  Code Connect returns `Select` for the closed-state node (`206:68115`) but the opened state is a custom composition not available off-the-shelf in `@floqastinc/flow-ui_core` or the Figma library (searched for entity/scope/tree/multi-select — only "folders" matched, unrelated).

  Current prototype uses flat multi-select `Select` with 5 entity options. Visually matches the closed state; differs significantly when opened.
  - *Impact:* the entity↔account scoping UX — likely a core insight of 1:Many Scheduler — is not yet demonstrable.
  - *Marker in code:* `// TODO: scope-tree-picker` in `CreateScheduleDrawer.tsx` above the Scope field.
  - *Upgrade path:* build a custom component using FlowUI `Checkbox` + `Expandable` (or `TreeView` shell) with externally-managed selection state including parent indeterminate states.

### Out of scope for this run

- The other 7 sections of the Project Schedule frame (Add New Schedule wizard, Details View, Activity Log, Delete, Disable/Enable, Completed with Issues variant, Default Schedule notes). Each becomes its own future build.
