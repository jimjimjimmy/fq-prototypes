# Figma Alignment Notes — Defender Prototype

**Figma file**: `HkEqjwX3CjTWqinuISZYvV`
**Full screen node**: `26:17841`
**Session started**: 2026-03-23
**Status**: Checkpoint saved — alignment work begins next session

---

## Zone Scorecard

Score each zone after alignment pass: ✓ match / ✗ off / ~ partial

```
Zone 1: Top Nav          [ ] Period selector chip, Layout/Panels controls missing
Zone 2: Left Sidebar     [ ] Likely close — needs MCP confirmation
Zone 3: Tab Strip        [ ] Figma shows 1 tab ("Transactions Focused" layout)
Zone 4: AG Grid          [ ] Odd-row striping, horizontal scroll, TxID link icon
Zone 5: Status Row       [ ] ✗ — major: <select> vs badge+dropdown
Zone 6: Details Section  [ ] Fields button over-styled; field columns count off
Zone 7: Anomalies        [ ] maxWidth:460 applied; avatar colors; verify
Zone 8: Comments         [ ] CHK-5621 needs mock comments; verify structure
Zone 9: Activity Log     [ ] Likely matches
```

---

## Visual Diff Summary

### Zone 1: Top Navigation Bar

| Element | Prototype | Figma | Gap |
|---|---|---|---|
| Period selector | Calendar icon, no dropdown | "February 2026 ∨" dropdown chip | Needs dropdown behavior |
| Layout control | Not present | "Layout: Transactions Focused ∨" | Missing |
| Panels control | Not present | "Panels" button | Missing |
| Assistant button | FlowUI avatar | Green "Assistant" button | Style delta |

### Zone 3: Flexlayout Panels / Tab Strip

| Element | Prototype | Figma | Gap |
|---|---|---|---|
| Main panel tabs | 5 tabs | 1 tab ("Transactions ×") | Figma shows "Transactions Focused" layout |

**Note**: Multi-tab state may be intentional. Check `PRESET_VIEWS` in `src/data/constants.ts` — Figma shows a specific named layout preset where extra tabs are hidden.

### Zone 4: AG Grid

| Element | Prototype | Figma | Gap |
|---|---|---|---|
| Row striping | `rgba(33,150,243,0.08)` on odd rows | No alternating rows | Remove odd-row color |
| Transaction ID links | External link on selected row only | External link on more rows | Check Figma intent |
| Horizontal scroll | Not visible | Scrollbar visible | Grid may be over-constrained |

### Zone 5: Status Row ← MOST IMPACTFUL

| Element | Prototype | Figma |
|---|---|---|
| Component | "Status" label + `<select>` with colored bg | "Status Open ∨" — colored badge/chip with chevron |

Replace native `<select>` with a badge+dropdown pattern. The Figma shows the status as a self-contained colored pill with the chevron embedded inside it.

### Zone 6: Details Section

| Element | Prototype | Figma | Gap |
|---|---|---|---|
| "Fields" button | `<Button variant="outlined">` | Plain text button, no border | Downgrade styling |
| Field columns | ~3 per row | ~4-5 per row | Wider layout needed |
| Transaction ID value | Plain text | Text + external link icon | Add OpenInNew icon |
| Field value weight | Normal | Some values bold | Font-weight adjustment |

### Zone 7: Anomalies Section

| Element | Prototype | Figma | Gap |
|---|---|---|---|
| Card width | maxWidth: 460 (just applied) | ~460px | Verify |
| Avatar colors | Gray (FlowUI default) | Colorful per-user | Need user→color mapping |

### Zone 8: Comments Section

| Element | Prototype | Figma | Gap |
|---|---|---|---|
| Mock data | CHK-5621 has 0 comments | 2 comments visible | **Data gap** — add comments to mock data |

---

## Figma Node Map

| Zone | Node ID | Status |
|---|---|---|
| Full screen | `26:17841` | Root — run `get_metadata` first |
| Transaction Details panel | `26:17927` | Panel wrapper |
| Transaction Details component | `26:17929` | **OPAQUE** — do NOT call `get_design_context` on this node directly |
| Anomalies/Comments section | `26:29851` | Known good sublayer with full design context |
| Status row | TBD | Identify via `get_metadata` on `26:17841` |
| Details field section | TBD | Identify via `get_metadata` on `26:17841` |
| Comment item | TBD | Identify via `get_metadata` on `26:29851` or parent |

**Key lesson**: Node `26:17929` is an attached Figma component instance — its `get_metadata` returns an empty subtree and `get_design_context` returns only the component reference. Always use sublayer frame IDs (like `26:29851`) for design context. Start any session with `get_metadata` on the full screen node to build the node map.

---

## figma-match Skill Gaps Identified

### Gap 1: No visual comparison protocol (ROOT CAUSE)

Every diff pass was based on MCP output + code reading with no before/after screenshot comparison. Changes were made without confirming what the prototype currently looked like.

**Proposed fix**: Add mandatory "Step 0: Screenshot comparison":
1. `get_screenshot` on Figma node
2. Ask user for current prototype screenshot
3. Annotate visible differences by zone BEFORE consulting MCP values

### Gap 2: Component-scope vs screen-scope mismatch

Skill invokes on one component at a time. Visual differences spanning the full screen are missed by single-component passes.

**Proposed fix**: Add a "Screen Mode" gate — if Figma node is a full-frame, switch to zone-by-zone screen mode with a zone scorecard.

### Gap 3: FlowUI component visual verification not enforced

Accordion recommended from prop list without checking visual output. It added a bordered container not in the Figma.

**Proposed fix**: For any FlowUI component swap, require `get_screenshot` on the component OR explicit rendering description before including in diff plan. This is mentioned in pitfalls but needs to be a mandatory checkpoint.

### Gap 4: CSS patch on structurally wrong markup doesn't converge

Multiple rounds patched individual CSS properties on markup with wrong DOM hierarchy. CSS patches on wrong structure never converge.

**Proposed fix**: Add "Structure Match Gate" to step 4 Phase A. Verify DOM hierarchy matches Figma hierarchy before proposing CSS changes. If nesting doesn't match, classify as structural rebuild and output correct JSX skeleton first.

### Gap 5: Mock data gaps mistaken for style gaps

Comments showed "No comments yet." because of missing mock data — looked like a style issue.

**Proposed fix**: Add to step 4.7 Functional behavior audit: cross-reference visible sections with mock data. If a section appears empty, diagnose data vs. style cause before adding CSS.

---

## Files Modified in This Checkpoint

- `src/components/DetailPanel.tsx` — Multiple spacing/layout fixes, custom collapsible sections, Anomaly card structure
- `src/components/TransactionGrid.tsx` — `defenderGridTheme`, TableStatusBadge, selectedId highlighting, ExitToApp action
- `src/components/AllTransactionsView.tsx` — Removed card wrapper, `h-full flex flex-col` layout
- `src/components/SideNavbar.tsx` — New component: icon-only left nav
- `src/components/TopNavbar.tsx` — New component: top navigation bar
- `src/App.tsx` — State and callback wiring
- `src/data/constants.ts` — Field options, user constants
- `src/index.css` — Tailwind v4 imports, flexlayout overrides, AG Grid focus ring suppression
