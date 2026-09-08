# figma-diff — Source Datasets Phase B (Group + Link modals)
**Date:** 2026-07-08
**Figma (For-Dev):** file `2lWgrzEE6mc6yW3fM1MrUI`
- Group Datasets modal — instance `771:27561` ([node](https://www.figma.com/design/2lWgrzEE6mc6yW3fM1MrUI/?node-id=771-27561))
- Link Datasets modal — instance `738:22136` ([node](https://www.figma.com/design/2lWgrzEE6mc6yW3fM1MrUI/?node-id=738-22136))
- Group card (post-create) — `738:21262`

**Prototype:** `projects/data-studio/prototype` — http://localhost:5186/data-studio/model/us-accounts/source-datasets
**Method:** figma-build pipeline (extract → resolve → assemble) + authored stitch, verified in-place in the running prototype.
**Result:** both modals ✓ · DOM-keyed diff now VIABLE (was impossible in Phase A) · 0 console errors · deviations all declared

> **Contrast with Phase A.** The Phase A report (`figma-diff-2026-07-08.md`) said: *"Zero `data-figma-node`
> stamps were found in the rendered DOM, so verify-spec.mjs could not run DOM-keyed comparison."* Phase B was
> rebuilt via figma-build specifically to close that gap. Every stamp is now present and DOM-verified.

---

## Pipeline resolution (closed-set)

| Modal | Node | Components | Tier-1 | Escalations resolved |
|---|---|---|---|---|
| Group Datasets | 771:27561 | 9 | **100%** | `Alerts / Inline-alert`→`InlineAlert`, close-icon (dropped) |
| Link Datasets | 738:22136 | 10 | **100%** | `Atomic-helpers / Divider`→`Divider`, close-icon (dropped) |

Two aliases were added to `knowledge/design-system/code-connect/figma-code-name-map.json` via the convergence
loop (`add-name-alias.mjs`, closed-set-validated) — future builds resolve them deterministically.

---

## ✓ B1 — Structure (DOM-keyed, the Phase A gap)

Every `data-figma-node` stamp in the rendered DOM was cross-checked against the extracted Figma skeleton:

| Modal | Skeleton nodes | Distinct DOM stamps | Stamps matching a real skeleton node |
|---|---|---|---|
| Group Datasets | 57 | 19 | **19 / 19** ✓ |
| Link Datasets | 69 | 23 | **23 / 23** ✓ |

Every stamp maps to a real Figma node → `verify-spec` / `parity-check` DOM-keyed comparison is now viable.
Unstamped skeleton nodes are internal primitives folded into real FlowUI components (Modal chrome, radio
control internals, icon internals) — correct: stamps sit on the semantic structure, not every leaf.

## ✓ B2 — Lint / console

`tsc --noEmit` clean. Console clean at rest AND fully interacted (open both modals, toggle checkboxes, create
group, open kebab, Ungroup, link, add-dataset, fix-link) — only the benign library-wide
`Support for defaultProps will be removed` FlowUI warning; no React errors, prop-type value errors, key or
DOM-nesting warnings.

## ✓ B3 — Visual

Verified by side-by-side screenshot vs the Figma frames (both modals + the group card 738:21262 + the
post-link panel state). Structure, tokens, and copy match. Screenshots captured during the build session.

---

## Component identities (resolved → FlowUI)

- Modal → `Modal` (compound `Modal.Header` / `Modal.Body` / `Modal.Footer` / `FooterCancelBtn` / `FooterActionBtn`), `size="sm"` = 500px
- Alert → `InlineAlert color="info"` (renders its own icon + close)
- Group name field → `Input`
- Join-field pickers → `Select` (options/value/onChange)
- Unmatched-rows → `RadioGroup` + `Radio` (value + `sublabel` for the description line)
- Divider → `Divider`
- Primary badge / Group badge → `TableStatusBadge color="info" size="xs" hasIcon={false}`
- Row actions / kebab trigger → `IconButton size="table"`
- Group kebab menu → `SubpanelDropdown` (`.Trigger` / `.Content` / `.Item onSelect`) — action menu, not a select
- Group icon → `Schema` (FloQast custom set, `flow-ui_icons/fq/Schema`)

---

## Declared deviations (design-forks — intentional, per designer review 2026-07-08)

| # | Deviation | Reason |
|---|---|---|
| 1 | Link confirm button = "Save" (Figma: "Continue") | Designer decision — linking finalizes here |
| 2 | Link radio 2 = "Keep only matching rows" (Figma: "Only show rows that match across all datasets") | Designer decision — parallel to option 1 |
| 3 | Group member list uses **checkboxes**, not the Figma's trash buttons | Uncheck to exclude without leaving the modal; count tracks checked |
| 4 | Primary section bg uses `surface-info-weakest` + `border-info-medium` | Designer L2 note — semantic tokens; current (non-deprecated) equivalents |
| 5 | "Linked via" chip placed UNDER dataset info; removed from the primary dataset | Designer decision — primary is the "linked on" reference |
| 6 | Group card icon = `Schema`; badge = "Primary" (not "Group") | Designer decision — the group is now the primary dataset |
| 7 | Dropped the assembler's `ClearXClose` icon | Modal renders its own close (would duplicate) |

## Coverage notes

- **Both modals** ARE fully stamped and DOM-verified (above).
- **Base Selected Datasets + Available Sources cards ARE stamped** (added 2026-07-08 in the panel-QA pass).
  Extracted panel skeletons `738:20720` (Selected Datasets / "linked datasets") and `738:20605`
  (Available Sources); the header, action buttons, ungrouped rows (checkbox / name / badge / subtitle /
  make-primary / delete), rows container, footer hint, and both card headers now carry `data-figma-node`
  stamps — **26/26 Selected-panel + 3/3 Available-panel stamps verified to map to real skeleton nodes.**
- **Group card IS stamped** (added 2026-07-08). Extracted `738:21262`; the card container, header, name row,
  icon, name + "Group" subtitle (Frame 12), Primary badge, kebab, members container, and Primary/Secondary
  member cards + their name/subtitle nodes all carry stamps — **16/16 verified to map to real skeleton nodes.**
  (The card's icon is `Schema` per designer direction, stamped at Figma's `folders` icon node `738:21275` — a
  declared icon-identity deviation.)
- **Link-state overlays ARE stamped** (added 2026-07-08). Extracted the linked-success state `738:22503`;
  the link summary row (`772:28588`), the "Linked via" chip (`738:22565`/`738:22582` + label/value), and the
  not-linked warning (`738:22599` + icon/text) all carry stamps — **9/9 verified to map to real skeleton
  nodes** — and were aligned to the Figma (blue join field, bordered chip, amber warning + dark link).
- **Net result: the entire Source Datasets surface is DOM-keyed** — both modals, both base cards, the group
  card, and the link-state overlays. figma-diff can run DOM-keyed verification across the whole feature.

## Summary
| Composition | Status | Notes |
|---|---|---|
| Group Datasets modal | ✓ | 100% tier-1, 19/19 stamps, console clean |
| Link Datasets modal | ✓ | 100% tier-1, 23/23 stamps, console clean |
| Group card + kebab menu | ✓ | matches 738:21262; SubpanelDropdown action menu |
| Panel linked/not-linked states | ✓ | matches reviewed spec (hand-authored, unstamped) |
