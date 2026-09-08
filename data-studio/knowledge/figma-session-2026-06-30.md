# Figma Match Session — Catalog (2026-06-30)

**Target:** Catalog screen — `src/features/catalog/`
**Figma:** "Data Studio — For Dev", frame `5:30130` ("Data Studio > Catalog")
**Method:** figma-fq, Screen Mode (FRAME node). Tokens via `get_variable_defs`,
structure via `get_metadata`, model-row code via `get_design_context` (5:30166).

## Canonical design (what Figma specifies)

**Column set (7):** `Model | Version | Status | Records | Linked Datasets | Last Updated | ⋮`
- **Model** — single line, 12px Inter SemiBold, color `#424867` (body-secondary-text), 12px left indent. NOT bold+large, NO version subtitle.
- **Version** — its OWN column ("Version 2", "Version 1", "Version 3").
- **Status** — `<TableStatusBadge color="success">Active</TableStatusBadge>` (Active=success green; General Ledger shows **"Inactive"** grey).
- **Records** — "5,792" plain.
- **Linked Datasets** — underlined **text link** "2 Linked Datasets" (link-primary `#000000`, underline), not a bare number.
- **Last Updated** — **absolute date** "3/22/2026" (M/D/YYYY), not relative.
- **Actions** — `MoreVert` kebab in a 32px rounded button, right-aligned.

**Density / tokens:**
- Row height **42px** (`size/ag-row-height`); header **50px** (`size/ag-header-height`).
- Cell padding `px-16 py-12`, gap 8. Cell text 12px Inter, `#424867`.
- Borders `#e1e6ef`; header bg `#f8fafc`; radius 6.
- Group header rows: **42px, single line**, chevron + "Group Name (N)" — e.g.
  "Transactions (3)", "Custom (0)". Collapsed groups show chevron-right.

**Filter / chrome UX:**
- Per-column **floating filter row** (50px) under headers: text input + funnel icon per column.
- Each column header has a **kebab (⋮) column menu**.
- **Right-edge vertical tool panel** with "Columns" and "Filters" tabs (AG Grid sideBar — Enterprise).
- Grouping panel exists but is hidden by default.
- Search ("Search by model name or type...") + Create Model on the tab row (right) — matches current build.

## Diff vs current Phase-1 build

| Area | Figma | Current build | Action |
|---|---|---|---|
| Model/Version | two columns | one cell (name bold + version subtitle) | split into Model + Version columns; single-line 12px |
| Linked Datasets | underlined text link | bare number | render as text link |
| Last Updated | absolute M/D/YYYY | relative "3 Hours Ago" | switch mock data + formatter to absolute |
| Row height | 42px single-line | 64px two-line | reduce to 42px |
| Group header | 42px "Name (N)" | 56px two-line "N Models" | single line, parenthetical count |
| Cell text | 12px `#424867` uniform | mixed bold `#1d2433` + grey | uniform 12px body-secondary |
| Filtering | floating filters + right Columns/Filters tool panel | toolbar Status dropdown + chips | DECISION (Enterprise vs Community) |
| Status term | "Inactive" | "Archived" (our earlier choice) | DECISION (terminology) |
| L1 tab order | Catalog · Connectors · Dimensions · Logs | Catalog · Dimensions · Connectors · Logs | SCAFFOLD — flag only, don't touch |

## Already matches
- Search + Create Model in tab-row right slot · `TableStatusBadge` component ·
  header height 50px · page header / tabs (scaffold) · borders/radius tokens.

## Key tokens (get_variable_defs)
- `size/ag-row-height` 42 · `size/ag-header-height` 50 · `comp/ag-border-color` #e1e6ef ·
  `comp/ag-header-background-color` #f8fafc · `space/ag-cell-horizontal-padding` 12 ·
  Badge success: bg #ecfff8 / text #1fac76 · Badge neutral: bg #f1f3f9 / text #6b7280 ·
  body text #424867 · link-primary #000000 underline · Inter body / Museo Sans headers.

## Open decisions (asked of designer)
1. Filtering UX: match Figma (Enterprise tool panel + floating filters) vs keep Community toolbar+chips vs middle (Community floating filters, no tool panel).
2. Status terminology: Figma "Inactive" vs our chosen "Archived".
