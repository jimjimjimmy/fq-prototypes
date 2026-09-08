# figma-diff — Source Datasets (Phase A)
**Date:** 2026-07-08
**Figma (Empty):** https://www.figma.com/design/2lWgrzEE6mc6yW3fM1MrUI/?node-id=738:20280
**Figma (Adding):** https://www.figma.com/design/2lWgrzEE6mc6yW3fM1MrUI/?node-id=3053:49054
**Prototype:** `projects/data-studio/prototype` — http://localhost:5186
**Result:** 1 high · 2 medium · 2 low · all regions unverifiable-by-DOM

> **Coverage note:** This prototype is hand-authored (not assembled by figma-build). Zero `data-figma-node`
> stamps were found in the rendered DOM, so `verify-spec.mjs` could not run DOM-keyed comparison.
> All findings below are **source-level** (resolved Figma records vs prototype source files). DOM-keyed
> verification is available if stamps are added in a future pass.

---

## ⚠ Available Sources panel — unverifiable-by-DOM
**Prototype file:** `src/features/model-view/source-datasets/AvailableSourcesPanel.tsx`
**Figma region:** `available sources` (738:20605 / 738:20300)

**Diff:**
- ✓ Two-panel layout (grid-cols-2) present
- ✓ Search input — Figma: `Form / Text-input` + search icon → prototype: FlowUI `Input` + `Search` icon ✅
- ✓ Connector headers — chevron expand icon + connector name + transport subtitle ✅
- ✓ Dataset cards — bordered cards, name + category subtitle, add icon ✅
- ✓ "Added" state — muted checkmark + "Added" text in place of add icon ✅
- ⚠ **Drag-indicator icons on some dataset cards** — Figma shows a `drag-indicator` icon on several cards (reorder handles). Prototype has none. Icon is available as `DragIndicator` from `@floqastinc/flow-ui_icons/material/DragIndicator`. Whether drag-reorder is in Phase A scope is a design call — flag only.
- ⚠ **Explicit Scroll-bar component** — Figma renders a `Scroll-bar` inside the Available Sources list. Prototype uses native `overflow-y-auto`. Visually indistinct on modern OS but worth aligning if the design intends a styled scrollbar.

**Recommendations:**
1. (low) Decide if drag-reorder handles belong in Phase A. If yes, add `DragIndicator` to each card row.
2. (low) Scroll-bar: no action needed for Phase A — the functional behavior is identical.

---

## ✗ "Primary" badge — wrong component
**Prototype file:** `src/features/model-view/source-datasets/SelectedDatasetsPanel.tsx` line ~114
**Figma node:** `Badges` (738:20737)

**Diff:**
- ✗ **Identity:** Figma `Badges` component resolves to **`TableStatusBadge color="info"`** (`@floqastinc/flow-ui_core`). Prototype renders a raw `<span>` with hardcoded hex colors.
- ✓ **Value:** Colors match exactly — `#f0f5ff` fill / `#3d7bf7` text are the bound info token values for this component. Visual output is correct.
- ✗ **Structure:** `TableStatusBadge` is the right component identity — it carries semantic meaning (aria, variant system) that a raw span lacks.

Resolved props:
```
<TableStatusBadge color="info">Primary</TableStatusBadge>
```

**Recommendations:**
1. **(high)** Replace the raw `<span>` badge with `TableStatusBadge color="info"`. Verify the import path from `@floqastinc/flow-ui_core` — the component resolves with high confidence (tier 1) from the cache.

---

## ⚠ Delete action button — pattern divergence
**Prototype file:** `src/features/model-view/source-datasets/SelectedDatasetsPanel.tsx` line ~133
**Figma node:** `Atomic-helpers / Action-buttons` (escalated: `name-not-in-map`)

**Diff:**
- ⚠ Figma uses an `Atomic-helpers / Action-buttons` pattern for the delete affordance. This component escalated as `name-not-in-map` — it's an internal design-system helper without a direct FlowUI counterpart in the cache.
- ⚠ Prototype uses a custom `<button>` (32×32, rounded-full, icon-only). This is a reasonable handcrafted equivalent.
- ⚠ **Icon variant:** Figma specifies `delete` (filled); prototype was updated to `DeleteOutlined` (user-directed). This is an intentional divergence — flagged for awareness, not recommended to revert.

**Recommendations:**
2. (medium) If `Atomic-helpers / Action-buttons` is a shared pattern across multiple screens, extract it as a reusable `IconButton` component so the implementation is consistent. Not required for Phase A.

---

## ⚠ Selected Datasets panel (rows) — unverifiable-by-DOM
**Prototype file:** `src/features/model-view/source-datasets/SelectedDatasetsPanel.tsx`
**Figma region:** `linked datasets` (738:20720)

**Diff:**
- ✓ `Form / Checkbox-only` → FlowUI `Checkbox` (subpath import) ✅
- ✓ Row layout: name + Primary badge + subtitle (connector · category) ✅ (badge component diverges — see above)
- ✓ `Form / Button` "Button xs" → `Button color="dark" variant="ghost" size="sm"` for Make Primary ✅
- ✓ Header: "Selected Datasets (N)" + two `Form / Button` instances → `Button outlined` + `Button filled` ✅
- ✓ Info footer: `info` icon + grouping hint text ✅
- ⚠ **Info icon:** Figma uses `info` (filled); prototype uses `InfoOutlined`. Low visual impact; same as the delete-icon divergence above (user-preference for outlined).

**Recommendations:**
3. (low) Info icon: decide on filled vs outlined consistently across the screen. Currently delete + info are both outlined; this is internally consistent even if it diverges from Figma.

---

## ⚠ Empty state — unverifiable-by-DOM
**Prototype:** http://localhost:5186/data-studio/model/vendor-master/source-datasets

**Diff:**
- ✓ "Selected Datasets (0)" heading ✅
- ✓ Both action buttons disabled ✅
- ✓ Placeholder copy: "Select datasets to be mapped for this model" + subtext ✅
- ✓ All Available Sources connectors and cards visible ✅

**Recommendations:** none — aligned.

---

## Summary
| Composition | Status | Issues |
|---|---|---|
| Available Sources panel | ⚠ | 1 low (drag handles), 1 low (scrollbar) |
| "Primary" badge | ✗ | **1 high** — should be `TableStatusBadge color="info"` |
| Delete action button | ⚠ | 1 medium (pattern), 1 low (icon variant — user-directed) |
| Selected Datasets rows | ⚠ | see badge finding above + 1 low (info icon) |
| Empty state | ✓ | 0 |

**Action items (priority order):**
1. **(high)** `SelectedDatasetsPanel.tsx` ~L114: Replace `<span>` Primary badge with `<TableStatusBadge color="info">Primary</TableStatusBadge>`
2. (medium) Design call: add `DragIndicator` reorder handles to Available Sources cards if drag-reorder is in scope
3. (low) Design call: align icon style (filled vs outlined) for delete + info icons across the screen
4. (future) Add `data-figma-node` stamps to enable DOM-keyed diff in subsequent runs
