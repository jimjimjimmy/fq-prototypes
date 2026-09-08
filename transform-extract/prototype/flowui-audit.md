# Template Builder — FlowUI Migration Audit

Source: `prototype/template-builder.html` (1162 lines, self-contained HTML/CSS/JS).
Audit reference: FlowUI knowledge (`knowledge/design-system/`) + `flow-ui-mcp` live component schemas.
Scope: Analysis only — no code changes.

---

## 1. Color / Token Audit

The prototype uses Tailwind-style raw hex values (`#16a34a`, `#2563eb`, etc.) rather than FloQast's brand palette. FlowUI brand-green is `#1FAC76` (`color-brand-600` / `success-primary`), notably warmer and less saturated than the `#16a34a` Tailwind green used throughout. Every primary action needs to shift.

| Prototype hex | Where used (line) | Closest FlowUI token | Notes |
|---|---|---|---|
| `#16a34a` | `.btn-finish` (24), `.editor-btn-save` (145), chat send active (275 `#166534`), `.tpl-check` accent (182), `.tpl-add-table:hover` (190) | `success-primary` / `color-brand-600` = `#1FAC76` | Off-brand. Wrong green — Tailwind 600, not FloQast brand. |
| `#15803d` | `.btn-finish:hover` (25), `.editor-btn-save:hover` (146) | `color-brand-700` `#1C895F` (primary-hover) | Off-brand hover. |
| `#166534` | `.send-btn.active` (275), `.chat-bar:focus-within` shadow (270) | `color-brand-800` `#186749` | Close, but off-brand. |
| `#f0fdf4` | `.approved-banner` bg (194), `.preview-toggle.active` (160), `.tpl-table tr.highlighted` (176) | `success-secondary` `#ECFFF8` (`color-brand-50`) | Tailwind green-50; FlowUI's success bg is cooler/mintier. |
| `#bbf7d0` | `.approved-banner` border (194), `.preview-toggle.active` border (160) | `color-brand-100` `#B8F5DE` | Off-brand. |
| `#2563eb` | `.upload-btn` bg (63), `.fname:hover` color (41), `.edit-link` (108), focus rings (114, 167), `.btn-process` bg (221) | `info-primary` / `color-blue-600` = `#3D7BF7` | Off-brand info blue. FlowUI blue is warmer. |
| `#1d4ed8` | `.upload-btn:hover` (64), `.btn-process:hover` (222) | `color-blue-900` `#1E4EAE` (info-active) | Off-brand. |
| `#3b82f6` | `.fd-item.active .fd-dot` (54), focus rings (114, 127, 167, 231) | `color-blue-700` `#2F6FED` | Wrong family. |
| `#eff6ff` | `.fd-item.active` bg (52), `.val-table td input:focus` (127) | `info-secondary` `#F0F5FF` / `color-blue-100` | Off-brand. |
| `#bfdbfe`, `#dbeafe`, `#93c5fd` | process banner / button states (223, 224, 228, 230) | `color-blue-200`/`300`/`400` | Tailwind blue ramp — needs `color-blue-*` ramp. |
| `#fffbeb` / `#fde68a` | `.data-bar` (106) — yellow context strip | `warning-secondary` `#FFF8EB`, `color-warning-*` | No yellow `100/200` named token in FlowUI; warning ramp is single secondary. |
| `#ef4444` | required asterisk (116), error dots (55, 216), trash hover (71), validation icon stroke (384) | `danger-primary` `#D24747` | Off-brand. FlowUI red is muted, not Tailwind red-500. |
| `#fef2f2` | `.tpl-delete:hover` (184), `.trash-btn:hover` (71), `.tr.removing` (177) | `danger-secondary` `#FEF1F2` | Very close — but use the token. |
| `#fecaca`, `#fca5a5` | validation banner border (210), missing field border (117) | `color-danger-*` ramp | Tailwind red ramp. |
| `#991b1b`, `#7f1d1d`, `#166534` (banner copy) | validation banner text (210), approved banner (194 `#166534` for icon stroke) | `danger-active` `#981B25`, `color-brand-800` `#186749` | Off-brand text. |
| `#111827`, `#374151`, `#6b7280`, `#9ca3af`, `#d1d5db`, `#e5e7eb`, `#f3f4f6`, `#f9fafb`, `#fafafa` | every neutral (body 9, borders, muted text everywhere) | `header-text` (`#000000`), `body-text` (`color-neutral-800` `#1D2433`), `color-neutral-500` (`#6B7280`), `muted-text` (`color-neutral-400` `#ADB2BB`), `border-color` (`color-neutral-300` `#E1E6EF`), `color-neutral-100/200` | Tailwind gray ramp — entire neutral system needs swap. `#6B7280` happens to match `color-neutral-500` exactly; the rest don't. |
| `#c2410c` | `.pdf-card .logo` (76) | n/a | Decorative inside fake PDF render — leave as-is (it's content, not chrome). |
| `#f8f8f8`, `#f0f0f0`, `#e0e0e0`, `#c4c4c4` | Excel grid chrome (247, 248, 249, 254, 259, 260) | `color-neutral-100/200/300` | Cool-grey Excel look; FlowUI neutrals are slightly bluer (`#F8FAFC`/`#F1F3F9`/`#E1E6EF`). |

**No clean FlowUI equivalent:**
- `#fffbeb` / `#fde68a` (yellow data-bar) — FlowUI's `warning-secondary` `#FFF8EB` is close but no documented warning `300`-equivalent border token. Pattern is non-standard; warning ramp exists but isn't intended for this contextual-strip use case.
- The Excel cool-grey ramp (`#f8f8f8`, `#f0f0f0`, `#e0e0e0`) is custom and probably should not exist in product chrome — discussion in section 4.

---

## 2. Component Mapping

| Prototype surface | Line(s) | FlowUI replacement | Notes |
|---|---|---|---|
| **Toolbar Process button** (blue filled, icon + label) | 221, 296 | `<Button color="info" variant="filled">` | `Button` accepts `color="info"` and `disabled`; processing state is custom (no `loading` prop) — use spinner icon as `children`. |
| **Toolbar Approve button** (green filled) | 24, 300 | `<Button color="primary">` | Default color. After-approve state ("✓ Approved" disabled grey) maps to `disabled` + `Check` icon. |
| **Toolbar overflow `⋮`** and **close `✕`** | 26, 301, 302 | `<IconButton size="md">` + `<CloseButton>` | `IconButton` requires `icon` and `onClick`. For the overflow, pair with `DropdownPanel` / `Popover` (no `MoreMenu` exists — see DEVIATIONS row). |
| **Form / Table view toggle** (☰ Form / ⊞ Table) | 95–98, 413–416 | `<ButtonGroup>` of `<Button variant="group" isActive>` OR `<Toggle>` | `Toggle` is a 2-state switch — likely too binary. Recommend `ButtonGroup` of `Button variant="group"` with `isActive`. |
| **Template `<select>`** (Invoice / Bank / Lease / + Create New) | 105, 406–410 | `<Select>` (or `<DropdownButton>` + `<DropdownPanel>`) | `Select` has no exposed props in MCP — likely spreads native props. The `+ Create New Template` row inside the menu maps to `DropdownPanel`'s `onAddOption` / `addOptionInputProps` pattern. |
| **File dropdown** (filename trigger ▾ with per-file red dot rows) | 48–55, 340–350 | `<DropdownPanel>` with `<SelectOption>` children + `<StatusDot color="danger">` per row | `DropdownPanel` supports filter, custom options, `size="trigger-width"`. The red error dot maps to `StatusDot color="danger"`. |
| **PDF nav `‹ ›` buttons** | 43, 329, 334 | `<IconButton size="sm" icon={ChevronLeft}>` | Native chevron icons in `@floqastinc/flow-ui_icons`. |
| **Trash icon (remove all files)** | 70, 335 | `<IconButton icon={Trash}>` (paired with `<Modal>` confirm dialog) | Current `confirm()` should become a real FlowUI `<Modal size="sm">`. |
| **Edit Template link** | 108, 411 | `<LinkButton>` or `<Link>` | DEVIATIONS notes empty props in MCP; check Storybook for actual API. |
| **Download icon (`.dl-btn`)** | 99, 417 | `<IconButton icon={Download} size="md">` | |
| **Validation banner** (red, expandable details) | 210–218, 382–389 | `<InlineAlert>` (danger / error variant) | DEVIATIONS row: `InlineAlert` props empty in MCP — verify in Storybook. The expandable "Show details" pattern is custom; FlowUI alert is single-message. Consider a `<Modal>` or `<TablePopover>` for the per-file detail list. |
| **Process banner** (blue, progress bar) | 228–231, 390–396 | `<InlineAlert color="info">` + `<ProgressBar>` | `ProgressBar` exists but props array empty in MCP (DEVIATIONS). The composition (banner with embedded progress) is not a documented FlowUI pattern. |
| **Approved banner** (green, checkmark, "Values are locked") | 194–196, 397–401 | `<InlineAlert color="success">` | Standard pattern. |
| **General Info form inputs** (Total Amount, Invoice #, etc.) | 111–120, 433–440 | `<Input>` with `label`, `isRequired`, `isInvalid`, `sublabel` | `Input.isInvalid` and `isRequired` map cleanly. The "Required" error text under each field is `Input.sublabel` or footnote text — verify in Storybook. |
| **Values table** (Line Item / Description / Qty / Unit Price; inline editable) | 123–129, 444–476 | `<Table>` w/ cell-level `<Input>` OR AG Grid (see `knowledge/design-system/components/table/ag-grid.md`) | This is an editable grid pattern. FlowUI's `Table` props are empty (DEVIATIONS) — cells are composed from sub-components. For row count this size, AG Grid with inline-edit cellRenderers is the FloQast-standard implementation. |
| **Editor table** (Field Type / Label / Extraction Keywords / Required / delete) | 170–184, 616–648 | `<Table>` or `<BaseTable>` with `<Select>`, `<Input>`, `<Checkbox>`, `<IconButton icon={Trash}>` cells | Drag-handle (`⠿`, line 178) is custom — no `<DragHandle>` in FlowUI. `<SortableContainer>` exists (search-components result) and may cover this. |
| **Required checkbox** in editor rows | 182, 751 | `<Checkbox>` | Native `accent-color: #16a34a` should become `color-brand-600`. |
| **Editor "Back" / "Cancel" / "Save" buttons** | 139–146, 547–558 | `<Button variant="outlined">` (Back/Cancel), `<Button color="primary">` (Save) | Standard. |
| **Preview PDF toggle** (with green-tinted active state) | 158–161, 553–556 | `<Button variant="outlined" isActive>` or `<Toggle>` w/ label | The toggle's `bg + border + color` swap on active maps to `Button.isActive`. |
| **`+ Add Field` / `+ Add Column` / `+ Add Table`** | 185–191, 628, 647, 650 | `<Button variant="ghost" color="primary">` w/ `Plus` icon | The big `+ Add Table` outlined block (189) is a ghost-button-as-zone — non-standard but `Button variant="ghost"` with full-width and outlined border is the closest. |
| **Floating chat bar** (rounded, AI dot, send button) | 263–276, 656–665 | **Not in FlowUI** — see section 4 | Custom pattern. |
| **Typing dots** | 277–281 | **Not in FlowUI** | Custom AI affordance. |
| **Chat response bubble** | 264–268 | Closest: `<Toast>` for transient messages | Toast is right for the auto-dismiss behavior (4.5s timeout at line 874). |
| **Excel-like table** (row-num column, sticky header, bottom sheet tabs) | 244–260, 482–536 | `AG Grid` (per `knowledge/design-system/components/table/ag-grid.md`) | The Excel chrome (row numbers, sticky header, bottom sheet tabs) is non-standard product chrome — see section 4. |
| **Sheet tabs** (Filtered Data / Purchase Orders / Invoices) | 254–257, 530–534 | Closest `<TabGroup>` + `<Tab>` | But TabGroup is a top nav pattern, not a bottom-of-grid pattern. Genuine mismatch. |
| **Empty state** (Upload Zip / Add sample PDFs) | 58–67, 314–325 | `<EmptyState>` or `<ZeroItemsEmptyState>` | DEVIATIONS notes empty props in MCP. Multiple variants exist (`Empty`, `EmptyState`, `DashboardEmptyState`, `NoResultsEmptyState`, `ZeroItemsEmptyState`, `PageDownEmptyState`). |
| **Upload Zip button** in empty state | 63, 320 | `<FileUpload>` (composite) + `<Button>` | DEVIATIONS: documented as "File Uploader", actual export is `FileUpload`. Props: `children`, `onChange`, `multiple`, `allowedFileTypes`. |
| **Shell header** (small grey breadcrumb-style strip) | 14, 286 | Closest: `<SectionHeader>` or `<Breadcrumbs>` | Functions as a workflow-step label. DEVIATIONS: no full `PageHeader`, only `SectionHeader` (heading-only). |
| **Modal frame** (full-screen modal-as-page) | 15, 288 | `<Modal size="lg">` | `Modal` exists with `size: sm/md/lg`; "lg" is the largest documented size, no fullscreen variant. |

---

## 3. Spacing / Typography Deltas

The prototype uses arbitrary px values everywhere. FlowUI's spacing scale is `4/8/12/16/24/32/48/96`. Anything off this grid needs to snap.

**Worst offenders by component:**

- **Toolbar** (line 18): `height: 48px` ✓ (on-scale, `spacing-48`), but `padding: 0 18px` is off-scale — should be `16px` or `24px`. Gap `10px` (line 19) and `8px` (line 23) — `8px` ✓, `10px` not on scale.
- **Editor toolbar** (136): `padding: 12px 24px` ✓ both on-scale.
- **Buttons** (24, 145, 221): `padding: 7px 20px` — neither value is on the spacing scale; FlowUI `Button size="sm"` handles this internally. Same with `6px 16px` (142), `9px 24px` (63). Switching to `<Button>` eliminates these.
- **PDF bar** (38): `padding: 8px 16px` ✓. `border-radius: 5px` (43), `6px` (everywhere) — FlowUI uses `4px` / `8px` / `12px` consistently; `5px` and `6px` are off.
- **Form fields** (105, 113, 166, 179, 180): `padding: 8px 12px` ✓, `6px 8px` and `6px 9px` and `7px 10px` — off-scale. `border-radius: 5px`/`6px` should be `4px` or `8px`.
- **Validation banner** (210), **process banner** (228), **approved banner** (194): all `padding: 10px 14px`, `border-radius: 6px`, `margin-bottom: 14px/18px` — none on scale. Should be `12px 16px` padding, `8px` radius, `16px` bottom margin.
- **Editor template table** (170, 173): `padding: 10px 12px` and `8px 10px` — should be `8px 12px` consistently.
- **Chat bar wrap** (263, 269): `bottom: 20px`, `padding: 10px 16px`, `border-radius: 14px`, `gap: 10px`, `gap: 8px` — almost everything off-scale. Border radius `14px` is unusual; FlowUI shows `8px` / `12px` rounded surfaces.

**Typography deltas:** FlowUI defaults to **Museo Sans** (typography.md line 13) at **12px** body M (Default) and 18px line-height. The prototype uses `-apple-system, BlinkMacSystemFont, "Segoe UI"` (line 9) and freely mixes `9px` → `16px` font sizes. Worst:
- 9px / 10px PDF text (76–91): fine for the fake document render.
- `11px` / `12.5px` (245, 250): non-standard — FlowUI uses `12px` body M. The `.excel-table` at 12.5px is unusual.
- `13px` for nearly every label and button (24, 38, etc.): FlowUI typically lands on `12px`. The mix of `12/13/14/15/16` font-sizes (lines 21, 61, 103, 110, 121, 138, 142, 168) compresses to 2–3 FlowUI sizes.
- Font-weight `600` vs `500` is inconsistent (107, 122, 124, 169, 171). FlowUI typography only documents Regular (400), Medium (500), Semibold (600).

---

## 4. Patterns Missing From FlowUI

| Pattern | Where (line) | FlowUI status | Recommendation |
|---|---|---|---|
| **Floating AI chat bar** (centered, fixed-bottom, with dot indicator, typing dots, auto-dismiss responses) | 263–281, 656–665 | **Genuinely not in FlowUI.** `ai-enhancements.md` is general guidance only ("documentation on styling is general guidance rather than finalized components", line 8). No `Chat`, `AIBar`, or similar component. Closest tokens: `Button color="ai"` (Button MCP confirms `color="ai"` is a valid value) and the `MagicAIStar` icon. | Build as a custom React component; reuse `<Button color="ai">` + Museo Sans + brand-600 focus ring. Document as a candidate for FlowUI promotion (Design Bar territory). |
| **Typing dots** (3-dot pulse) | 277–281 | Not in FlowUI. | Keep custom; pair with AI chat work above. |
| **Animated "highlighted" row green flash** (newly-added editor row briefly tints `#f0fdf4`) | 175, 176, 745, 920–924 | Not a documented FlowUI motion pattern. Adjacent: `Toast` for confirmation. | Acceptable custom flourish; just swap the green to `color-brand-50`. |
| **Removing-row red-fade-out** | 177, 763–765, 904–907 | Not documented. AG Grid has row animation hooks for FloQast-standard grids. | Keep, but switch to `danger-secondary` red. |
| **Excel-like grid with sticky headers + bottom sheet tabs + faux scrollbar** | 244–260, 482–535 | **Adjacent — not a clean match.** FloQast's standard is **AG Grid** for product tables (`knowledge/design-system/components/table/ag-grid.md`). AG Grid supports sticky headers, but the Excel chrome (row numbers, bottom sheet tabs `Filtered Data / Purchase Orders / Invoices`, faux horizontal scrollbar) is **not a FlowUI pattern**. The bottom sheet tabs especially: `TabGroup` is top-of-page navigation, not Excel-style spreadsheet tabs. | Two options: (a) lean into AG Grid and drop the Excel chrome (row numbers and bottom tabs), surfacing the dataset switching via `<DropdownPanel>` or `<TabGroup>` at the top of the table; (b) keep the Excel metaphor for product-fit reasons and treat as a deliberate exception. The dataset is small enough that AG Grid would be overkill if the goal is purely visual — but for any production version, AG Grid is the standard. |
| **Per-file validation dropdown with red dots** | 48–55, 340–350 | Adjacent. `DropdownPanel` + `StatusDot color="danger"` covers it. | Map cleanly to `DropdownPanel`. |
| **Yellow context strip** (`data-bar`, output-data-for-file label) | 106–109, 426–428 | Adjacent — closest is `<InlineAlert color="warning">` but that overstates severity. This is a contextual scope label, not a warning. | Genuinely missing. Build with neutral surface (`color-neutral-100` `#F8FAFC` + `color-neutral-300` border) and a `Link` "Edit". Don't use warning yellow. |
| **"+ Add Table" as a full-width outlined zone** | 189–191, 650 | Not documented. Closest: `Button variant="ghost"` made full-width. | Acceptable composition. |
| **Drag handle for reordering** (`⠿`) | 178, 747 | No `DragHandle` component. `SortableContainer` exists (search result). | Use `SortableContainer` from core. |

---

## 5. Deviations Check (for components recommended above)

Flagging entries from `knowledge/design-system/DEVIATIONS.md` that affect this migration:

- **`<EmptyState>` family** — DEVIATIONS row "Empty State: Low — Props not extractable". Library has `Empty`, `EmptyState`, `DashboardEmptyState`, `NoResultsEmptyState`, `ZeroItemsEmptyState`, `PageDownEmptyState`; props empty in MCP. **Check Storybook** before picking a variant for the upload empty state.
- **`<FileUpload>`** — DEVIATIONS row "File Uploader: Low — name mismatch". Doc says "File Uploader"; component exported as `FileUpload`. Props confirmed (`children`, `onChange`, `multiple`, `allowedFileTypes`, `customInputRef`).
- **`<Table>` / `<BaseTable>`** — DEVIATIONS row "Table: Low — No typed props in MCP". Cells are composed from sub-components (`TableTagGroup`, `TableStatusBadge`, etc.). For the editor table and values table, expect to compose cell content manually.
- **`<TablePopover>`** — DEVIATIONS row "TablePopover: Medium — No size prop". If used for the validation-banner-detail popover, sizing will be CSS/content-driven.
- **`<ProgressBar>`** — DEVIATIONS row "Progress Bar: Low — Empty props from MCP". Props exist per Storybook but not extractable. **Check Storybook** before wiring the process progress bar.
- **`<InlineAlert>` / `<StandardAlert>` / `<SystemAlert>`** — MCP confirms all three exist. `InlineAlert` props empty (likely spread). Use `InlineAlert` for in-container banners (validation, processing, approved). `SystemAlert` would only apply if a banner spans the full page.
- **`<Select>`** — MCP confirms exists, props empty. Likely spreads native `<select>` props plus FlowUI styling.
- **No `<MoreMenu>` component** — DEVIATIONS row "More Menu: Medium — Not a standalone component". The toolbar `⋮` overflow must be composed from `<IconButton>` + `<DropdownPanel>` or `<Popover>`.
- **No `<PageHeader>` / `<BackBar>`** — DEVIATIONS rows. The shell header (line 14) and editor "Back" button (139, 547) are application-level compositions; only `<SectionHeader>` exists for the heading text portion.
- **`<Link>` / `<LinkButton>`** — DEVIATIONS row "Text Links: Low". `Link` props empty in MCP — likely spreads native anchor props.

No critical blockers — but expect to consult Storybook before finalizing prop usage for `EmptyState`, `ProgressBar`, `InlineAlert`, and the `Table` family.
