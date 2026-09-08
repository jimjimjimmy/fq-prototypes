# Research — Repo Divergence Inventory (captured)

Survey of AG Grid usage across the `product-and-design` repo, 2026-07-08. The evidence for why standardization is needed: the "single source of truth" exists in intent but has fragmented in practice.

_Note: these are **repo prototypes** (design explorations), distinct from **production** impl (which spans FQUI / FlowUI / AG Grid — see `../tiers/surface-census.md`)._

## The headline
~545 files mention AG Grid; **24 files are real `<AgGridReact>` implementations** across **~16 prototypes**. The shared brand theme (`floqastGridTheme`) is **copy-pasted, not imported**, and has forked into **5+ file variants across ~14 copies**, plus **~4 inline re-authors** that bypass the shared theme entirely.

## Theme fork variants
| Variant | Copies | Note |
|---|---|---|
| Canonical + header comment | 5 (accrual-aggrid, accrual-v2-e2e, jem-home, jem-victor, figma-prototype-setup asset) | Identical |
| Canonical, reformatted | 3 (admin-agent, bulk-invite-user, data-studio/prototype scaffold) | Same params, different file |
| No-comment variant | 3 (playspace/data-studio, recs-ag-grid, data-studio legacy) | Stripped |
| **Token-sourced** | 1 (fq-folders-checks-test) | **Best** — pulls from `tokens.ts` to stay in sync |
| Checkbox-params-stripped | 1 (ai-variance-prototype) | Drift |
| Eval fixture | 1 (design-fix eval) | Test copy |

**Any brand-token change today requires editing ~14 files.**

## Inline re-authors (bypass the shared theme — real visual drift)
- **catalyst `recsGridTheme`** — worst offender: `fontSize 14` (vs 12), `spacing 4` (vs 8), **`accentColor #1a7b4b` (vs brand #1FAC76)**, `foregroundColor #424867` (vs #1D2433), asymmetric border radius. *Ships an unused canonical theme right next to the wrong hand-rolled one.*
- **defender `defenderGridTheme`** — drops `iconSetMaterial`, adds blue odd-row bg, `rowBorder:false`.
- **ai-variance `aivGridTheme`** — uses `var(--flo-sem-color-*)` semantic tokens (the *best* theming approach, but a separate re-author).
- **accruals-prototype / accruals-test** — inline `themeQuartz` local consts.

## Four theming strategies in play
1. Copy the shared file (most)
2. **Properly extend it** via `.withParams()` — `adminLiteGridTheme` (the good pattern)
3. Re-author inline per prototype (catalyst, defender, ai-variance)
4. Legacy CSS classes — `close-accruals` uses `ag-theme-quartz.css` + classnames (pre-Theming-API)

## Two SDK packaging styles
- **Modular** `@ag-grid-community/*` + explicit `ModuleRegistry` (most, v32.3.9)
- **All-in-one** `ag-grid-react`/`ag-grid-community` + `AllCommunityModule` + `.css` imports (close-accruals) — and the newest `reporting-bu-q3` uses unified v33 + `AllEnterpriseModule`

## Renderers reinvented per prototype
Custom filter headers, portal kebab menus, status badges, currency formatters, side panels — each re-implemented in accruals-test, catalyst, defender, ai-variance rather than shared. Documented in `knowledge/design-system/examples/ag-grid/README.md` but nothing *packages* them.

## Docs duplicated
The AG Grid guide is copied across `knowledge/design-system/`, `.claude/skills/flow-ui-design-system/references/`, the MCP skill copy, and `playspace/shareable-package/` — the 248L knowledge copy and 214L skill copy are already out of sync.

## The two good models already in-repo
- **fq-folders `tokens.ts`-sourced theme** — divergence-resistant (reads from tokens).
- **admin `adminLiteGridTheme`** — the one place a theme is properly `.withParams()`-extended rather than copied.

## Three assets to consolidate in Phase 2 → ONE package
1. `floqastGridTheme` (forked ~14×)
2. The **accruals pattern library** (`knowledge/design-system/examples/ag-grid/` — numbered patterns #3 FilterHeader, #6 pinned actions, #14 slide-out panels, #16 external filter, #17 toggleable columns — the de-facto internal spec)
3. Will Guardado's emerging **`agGridConfig`** module (`reporting-bu-q3`: theme, defaultColDef, sideBarConfig, getZebraRowStyle, compactTheme)
