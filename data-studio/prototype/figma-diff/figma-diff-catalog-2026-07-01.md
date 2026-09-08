# figma-diff — Data Studio › Catalog

**Date:** 2026-07-01
**Figma:** "Data Studio — For Dev" · frame `5:30130` (Catalog) — https://www.figma.com/design/2lWgrzEE6mc6yW3fM1MrUI/Data-Studio---For-Dev?node-id=5-30130
**Prototype:** `projects/data-studio/prototype` — `src/features/catalog/` (dev server: http://localhost:5186/data-studio/catalog)
**Method:** figma-tooling engine (extract-skeleton → build-region-manifest → decompose → resolve-records) for the *expected* side; rendered-DOM + source capture for the *actual* side. **Read-only — this report is the only file written.**
**Result:** 0 high · 3 medium · 3 low · 1 coverage-gap · 2 confirmed-intentional (no action)

---

## Headline: the architecture is faithful

The engine resolved only **15% (15/98)** of the Content Area's components to first-tier FlowUI atoms. That is **not** a fidelity problem — it's a signal about the design's construction. The escalations are dominated by AG Grid design-kit components:

> `Grid cell` ×26 · `Column header` ×7 · `Floating filter` ×7 · `.Resize-Handle` ×6 · `.Input Filter` ×6 · `.Filter_list` ×6 · `Ag-Grid / Tool Panel` · `_filter-theme-material` · `.Ag-Grid / Icons / filter`

**The Catalog was designed in Figma using the AG Grid UI kit, not FlowUI table atoms.** Our implementation — AG Grid Community + custom floating-filter headers + full-width group rows — is therefore architecturally aligned with the design intent. No table-framework change is warranted.

---

## Region map

| Figma region | Kind | Prototype file | Status |
|---|---|---|---|
| Navigation / Side-Navbar (`5:30131`) | chrome | `src/scaffold/global/GlobalRail.tsx` | scaffold (locked) — not audited |
| Admin Settings Navbar (`5:30134`) | chrome | `src/scaffold/global/AdminSettingsNav.tsx` | scaffold (locked) — not audited |
| Content Area (`5:30135`) | section | `src/features/catalog/*` | **audited below** |

The two chrome regions are the locked scaffold; per "Scaffold is law" they're out of scope for feature refinement. The "Tab Bar / Tab ×4" escalation resolves to the **L1 tab strip** (`Catalog · Connectors · Dimensions · Logs`), which lives in `L1Frame` (scaffold), not the Catalog feature.

---

## ⚠ Content Area — `src/features/catalog/CatalogTable.tsx` + `CatalogPage.tsx`

Column set and order **match** the design: `Model · Version · Status · Records · Linked Datasets · Last Updated · ⋮`. Group-by-domain with full-width category rows matches. Search + per-column floating filters match the design's floating-filter pattern. Differences below.

### Medium

1. **Version format drift.** Figma renders version as **"Version 2" / "Version 1" / "Version 3"** (word + integer). Prototype renders **`v1.0` / `v2.0.1`** (abbreviated semver, from `models.ts`). Visible text mismatch — needs a designer call: match Figma's "Version N" label, or keep semver as the more realistic form. *(CatalogTable.tsx:311, models.ts version field.)*

2. **Linked Datasets is hand-rolled, not FlowUI.** The cell is a raw `<button>` with inline underline styling (CatalogTable.tsx:342–353). Figma's node resolves to a **"Text link"** — FlowUI ships `LinkButton`/`Link`. Behaviorally correct (navigates to Source Datasets) but reimplements a component FlowUI covers, so it misses FlowUI's color token, focus ring, and a11y semantics. **This is the clearest "hand-rolled where FlowUI has it" finding.**

3. **Link color.** Our link is `#000000` underline (CatalogTable.tsx:346). A FlowUI text link is a branded/link color, not black. Confirm intended treatment; likely should adopt the FlowUI link token via `LinkButton`. *(Folds into #2 if we switch to `LinkButton`.)*

### Low

4. **Group label "Custom Models" → "Custom".** Figma group reads **"Custom (0)"**; prototype renders **"Custom Models (0)"** (`models.ts` `domain: 'Custom Models'`). One-word mock-data fix.

5. **AG Grid Tool Panel absent.** Figma shows the right-edge **Columns / Filters** tool panel (`Ag-Grid / Tool Panel`). That's an **AG Grid Enterprise** feature; we're on Community, so it's a structural constraint, not a quick fix. Note only — flag if the design depends on it.

6. **One non-FlowUI icon in the design.** `cancel-theme-quartz` (icon-not-in-set) is an AG Grid theme glyph, not a FlowUI icon — informational; no prototype action.

### Coverage gap (honest limitation)

7. **No `data-figma-node` stamps → DOM comparators couldn't run keyed.** Our Catalog is hand-authored (not built by figma-build's `compose-frame`), so `verify-spec.mjs` / `parity-check.js` can't do node-keyed structural/value diffing. The comparison above was done **structurally by rendered content + source**, per the skill's "unverifiable-by-DOM" rule. If we want repeatable automated diffs later, stamp the Catalog region's nodes.

---

## ✓ Confirmed intentional — NOT drift (no action)

- **Status "Inactive" (Figma) → "Archived" (prototype).** Deliberate, designer-approved taxonomy decision in Phase 1 (`active | draft | archived`). The Figma frame predates that decision. Keep prototype.
- **Records "—" for the archived/no-run row (Figma shows "5,792" everywhere).** Prototype improvement per PRD AC-ML-4-04 (dash before first pipeline run). Keep prototype.

---

## Summary

| Item | Severity | Action |
|---|---|---|
| Version format `v2.0.1` vs "Version 2" | medium | designer decision |
| Linked Datasets hand-rolled vs FlowUI `LinkButton` | medium | fix candidate |
| Link color black vs FlowUI token | medium | folds into ↑ |
| "Custom Models" → "Custom" | low | one-word fix |
| AG Grid Tool Panel (Columns/Filters) | low | Enterprise-only — note |
| Non-FlowUI cancel icon | low | informational |
| No DOM stamps (comparator coverage) | coverage-gap | optional: stamp region |
| Status Inactive→Archived | intentional | keep |
| Records dash for no-run | intentional | keep |

**Prioritized action items:**
1. (medium) Swap the Linked Datasets `<button>` for FlowUI `LinkButton` — resolves both the hand-rolled-component and link-color findings.
2. (medium) Decide Version format: match Figma "Version N" or keep semver.
3. (low) Rename the "Custom Models" domain group to "Custom".
4. (note) AG Grid Tool Panel is Enterprise — out of reach on Community; revisit only if the design requires it.
