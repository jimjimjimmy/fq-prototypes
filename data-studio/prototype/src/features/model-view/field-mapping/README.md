# Model View — Field Mapping

**Owners:** Natasha Clark · Alex Kearns
**Status:** ported from v1 (Step 7b, 2026-05-26); AI surfaces stripped (Step 8, 2026-05-26)
**Figma:** TBD — Field Mapping L2 section + AI interaction panels
**Last touched:** 2026-05-26

The headline feature of the prototype — admins map external dataset
fields to FloQast's canonical schema. AG Grid table + manual
transformation editor (floating `TransformationWindow`), with Run Test
and Publish dialogs.

**AI surfaces are intentionally NOT wired right now.** The AI files
(`AiBanner`, `DevToolbar`, `AiModeContext`, `ai/ConversationalAiPanel`,
`ai/DirectedTransformationDropdown`, `ai/mockAiResponses`) remain on
disk for future re-enablement but are not imported by any active route
or component. The two AI interaction models — directed inline and
conversational chat — were under exploration in v1 and will be
revisited later. See `routes.tsx` and `TransformationWindow.tsx` for
the exact re-enablement steps.

## Files

### Active files

| File | Purpose |
|---|---|
| `routes.tsx` | Route definition — renders `FieldMappingView` inside `L2Frame` |
| `FieldMappingView.tsx` | Top-level container — orchestrates table, transformation window, test/publish modals |
| `FieldMappingTable.tsx` | AG Grid table (uses `floqastGridTheme`); modules registered globally in `src/main.tsx` |
| `TransformationWindow.tsx` | Floating popup editor for transformations (manual editor only — AI sections stripped) |
| `PublishDialog.tsx` | "Publish" modal — confirms mapping changes |
| `RunTestModal.tsx` | "Run Test" modal — runs transformations against sample data |
| `cell-renderers/FqFieldRenderer.tsx` | AG Grid cell renderer for FQ field column |
| `cell-renderers/SourceFieldRenderer.tsx` | AG Grid cell renderer for source field column |
| `cell-renderers/DataTypeRenderer.tsx` | AG Grid cell renderer for data type column |
| `cell-renderers/TransformationCellRenderer.tsx` | AG Grid cell renderer for transformation column |

### Dormant files (not imported — kept for future AI re-enablement)

| File | Was used for |
|---|---|
| `AiBanner.tsx` | Banner above the table announcing AI assistance |
| `AiModeContext.tsx` | Context provider + `useAiMode()` hook (state: 'directed' \| 'conversational') |
| `DevToolbar.tsx` | Floating bottom-right toolbar to toggle AI mode |
| `InlineTransformationEditor.tsx` | In-row editor — was reachable via the directed AI path; now unreachable |
| `ai/ConversationalAiPanel.tsx` | Chat-driven AI interaction panel |
| `ai/DirectedTransformationDropdown.tsx` | Inline AI suggestion dropdown |
| `ai/mockAiResponses.ts` | Scripted AI responses (delay constants + response generator) |

## Port notes (from Step 7b)

Ported verbatim from
`legacy-prototype-work/prototype-legacy/src/components/field-mapping/`
plus two siblings (`context/AiModeContext.tsx` and
`components/shared/DevToolbar.tsx`) co-located here. Changes during port:

- All `'../../data/field-mappings'` imports rewrote to
  `'../../../data/field-mappings'` (top-level) or `'../../../../...'`
  (subfolder files) to match v2's `src/data/` location.
- Grid theme import rewrote from `'../grid/floqastGridTheme'` to
  `'../../../scaffold/grid/floqastGridTheme'`.
- `AiModeContext` and `DevToolbar` co-located as siblings; references
  updated to `'./AiModeContext'` / `'./DevToolbar'`.
- Per-component `ModuleRegistry.registerModules([ClientSideRowModelModule])`
  in `FieldMappingTable.tsx` removed — modules register globally in
  `src/main.tsx` (Step 5).

## Known visual polish (deferred to future branch)

`FieldMappingView` carries its own inline page header (title + Run Test
/ Publish buttons + search field) from v1. It visually duplicates
`L2Frame`'s section header. Cleanup options:

- **(a)** Refactor `FieldMappingView` to drop its inline header and pass
  action buttons through a new `L2Frame.sectionRightSlot` prop.
  This is a scaffold change (requires designer review).
- **(b)** Refactor `FieldMappingView` to drop both header and title,
  keeping search inline. Feature-only change.

Either is a separate branch — Step 7 is functional port only.
