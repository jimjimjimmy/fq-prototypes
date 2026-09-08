# Design Audit Report

> Prototype: Data Studio (Lineage Creation)
> Audited: 2026-03-26
> Scope: Landing state — `/data-studio/catalog` (Catalog tab, Models table)

---

## At a Glance

| Metric | Value |
|---|---|
| Components audited (landing state) | 5 |
| Green (direct swap or already correct) | 1 |
| Yellow (needs adaptation) | 4 |
| Red (custom / keep) | 0 |
| Overall migration effort | **M (Medium)** |

**The good news:** The foundation is nearly perfect. FlowUI is installed and wired correctly, Theme.apply() is in place, Tailwind is imported without layer conflicts, AG Grid packages are installed, Inter font is loaded, and GlobalNavSidebar is already in use. No lucide-react. This prototype is well set up — the remaining work is component-level, not architectural.

---

## Component Analysis

### #1 — Left navigation rail (GREEN) ✅

**What it is:** The icon sidebar on the far left of the screen — app navigation, user avatar, settings.

**What it should become:** Already using `GlobalNavSidebar` from `@shared/components/GlobalNavSidebar`. This is correct.

**Effort:** None

**Why:** The shared component was purpose-built for this prototype pattern. No changes needed.

---

### #2 — Admin Settings header and tab strip (YELLOW) ⚠️

**What it is:** The "Admin Settings" page heading and the horizontal tab bar below it (Workflows, Entities, Team Members… Data Studio, etc.).

**What it should become:** The tab bar buttons are custom `<button>` elements with hardcoded Tailwind colors. These should use FlowUI `TabGroup` + `Tab`, the same pattern already used correctly in DataStudioShell (#3 below). The "Admin Settings" heading uses Museo Sans via inline style — that's intentional brand typography for a top-level page heading and is fine as-is.

- Import: `import { TabGroup, Tab } from '@floqastinc/flow-ui_core'`
- The active tab color (`#186749`) and inactive color (`#6b7280`) are hardcoded — FlowUI TabGroup handles these tokens automatically.

**Effort:** S

**Why:** The pattern is already proven in DataStudioShell. Copy that implementation. The main risk here is tab routing — the Admin Settings tabs are mostly non-functional placeholders, so no routing logic is needed.

---

### #3 — Data Studio tab bar + search input (YELLOW) ⚠️

**What it is:** The "Data Studio" page heading, the Catalog / Connections / Entity Mappings tab strip, and the search box in the top-right corner.

**What it should become:**
- **Heading** — Already uses FlowUI `Heading variant="xl"`. ✅ No change needed.
- **TabGroup/Tab** — Already uses FlowUI `TabGroup` and `Tab`. ✅ No change needed.
- **Search input** — Custom `<input>` element with a hand-rolled SVG search icon. Should use FlowUI `Input` with a search variant (or `isSearchable` prop if available). Check Storybook for the current search input prop API.

  ```tsx
  import { Input } from '@floqastinc/flow-ui_core'
  // <Input placeholder="Start searching..." isSearchable />
  ```

**Effort:** S

**Why:** The tab implementation is already correct — only the search input needs a swap. FlowUI's Input handles the icon, focus ring, and placeholder styling automatically.

---

### #4 — Models table (YELLOW) ⚠️

**What it is:** The main content area — a table of models grouped by domain (e.g., "Transactions", "Payroll") with expandable accordion rows. Each row shows: model name, version, status badge, record count, linked files, last updated.

**What it should become:** This is a custom HTML `<table>` with manually managed accordion state. At FloQast, tabular data of this complexity belongs in **AG Grid**. AG Grid is already installed in this project. Specifically:

- **Row grouping** → AG Grid's native row grouping replaces the custom `DomainAccordion` component
- **Column headers with sort** → AG Grid handles sorting natively; the custom `SortIcon` SVGs go away
- **Row click navigation** → AG Grid's `onRowClicked` callback
- **Status badge** → See #5 below — migrate to FlowUI `Badge` component at the same time
- **AG Grid theme** → Use the `floqastGridTheme` from `knowledge/design-system/ag-grid.md`

**Effort:** M

**Why:** AG Grid migration is the most significant change in this audit. The custom table works, but it won't scale — sorting, filtering, virtualization, and future column additions all become engineering work instead of configuration. Since AG Grid is already installed, the setup cost is already paid.

---

### #5 — Status badges ("Active" / "Inactive") (YELLOW) ⚠️

**What it is:** Small colored pill labels on each model row showing its status.

**What it should become:** Custom `<span>` elements with hardcoded background and text colors (`#ecfff8 / #1fac76` for active, `#f1f3f9 / #6b7280` for inactive). Should use FlowUI `Badge` or `StatusBadge` component.

```tsx
import { Badge } from '@floqastinc/flow-ui_core'
// <Badge variant="success">Active</Badge>
// <Badge variant="neutral">Inactive</Badge>
```

Check Storybook for the exact variant names — `success` and `neutral` are the likely values but confirm props.

**Effort:** S

**Why:** Hardcoded hex colors won't automatically update if the design token for "success green" changes. FlowUI Badge is a 2-minute swap.

---

## Architecture Assessment

| Area | Status | Notes |
|---|---|---|
| FlowUI packages | ✅ Installed | `flow-ui_core`, `flow-ui_icons`, `flow-ui_composite` all present |
| Theme.apply() | ✅ Correct | `Theme.apply(null, { standalone: true })` in main.tsx before render |
| Tailwind CSS setup | ✅ Correct | Imported without `layer()` — documented in CLAUDE.md, do not change |
| Inter font | ✅ Loaded | Via Google Fonts in index.html |
| AG Grid | ✅ Installed | All 4 packages present. Just not yet used in ModelsTable. |
| GlobalNavSidebar | ✅ In use | Correctly imported from `@shared/components` |
| lucide-react | ✅ Absent | No lucide dependency — custom SVGs used sparingly |
| File decomposition | ✅ Good | Components are split across logical files, no 300+ line monoliths |
| DevToolbar | ✅ Keep | Dark floating AI mode switcher — prototype dev tool, not product UI |

**One thing to note:** `AdminSettingsShell.tsx` has two custom inline SVGs (the sort icon in ModelsTable and the search icon in DataStudioShell). These should be replaced with FlowUI icons from `@floqastinc/flow-ui_icons` — but since lucide isn't present, this is a minor clean-up, not a migration.

---

## Out-of-scope views (not audited)

The following routes exist but are outside the landing state audit scope:

- `/data-studio/connections` — ConnectionsTable
- `/data-studio/entity-mappings` — EntityMappingsTable
- `/data-studio/model/:id` — Model detail (Overview, Source Datasets, Field Mapping, Data Preview, Versions, Logs)
- Field mapping views include: FieldMappingTable, AiBanner, ConversationalAiPanel, DirectedTransformationDropdown, PublishDialog, RunTestModal — these should be audited in a separate pass focused on the field mapping workflow.
