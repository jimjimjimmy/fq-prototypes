# Scope Decisions — What's Real vs. Faked in the Prototype

The prototype is meant to communicate intent to devs, not reproduce production behavior. This doc tracks what's a real interaction vs. a stub, so reviewers don't mistake fakery for finished work.

## Build real

- Two-widget layout (rollup left, mapping right) — CSS-grid based, not actual FlexLayout library
- Hierarchy tree: expand/collapse (individual + bulk)
- Inline rename via double-click
- Add child / sibling below / duplicate / delete (with confirmation that lists affected accounts)
- Drag-and-drop reorder with visual drop indicator
- Indent / outdent
- Search/filter within hierarchy
- Mapped-items count per node + expand to see accounts
- Account reassignment via searchable picker
- Account reassignment via drag-and-drop (visually distinct from node reorder)
- Page-level Save button in top bar (single, not per-panel)

## Fake / stub

- **Save persistence** — toast only. No localStorage, no backend.
- **Rule preservation logic** — toast says "rules preserved" without actually checking.
- **Rule-vs-direct-map override warning** — show the warning copy from PRD AC, no real rule data behind it.
- **Excel up/download** — buttons present, click is no-op or "coming soon" toast.
- **AI Structuring Agent output** — out of scope. Stub the entry-point question only ("do you want AI to build your rollup?") if time permits.
- **Configure level names (P0-17)** — defer to Phase 2/3.
- **Multiple mapping tabs** — show one tab; widget-scoped tabs concept is communicated visually, not via real tab CRUD.

## Phase ordering

| Phase | When | Scope |
|---|---|---|
| 0 | 2026-04-28 (today) | Project setup, port data, screenshots |
| 1 | 2026-04-28 → 2026-04-29 EOD | Layout shell + page-level save UI — share with Will before going dark |
| 2 | 2026-05-04+ (Carmen back) | Tree CRUD: expand/collapse, search, rename, add/delete, reorder, indent/outdent |
| 3 | Later | Mapped-items count + reassignment (P0-14, 15, 16) |
| 4 | Parking lot | Entry-point flow + AI agent question (Edith's user flow Figma) |
