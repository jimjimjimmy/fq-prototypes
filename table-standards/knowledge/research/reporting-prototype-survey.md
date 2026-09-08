# Research — Reporting / Variance Prototype Survey (captured)

Survey of how the design team builds Reporting/Variance tables in-repo, 2026-07-08. Goal: extract requirements for P3b from what's actually being built. Key finding: **the target stack already exists — it just hasn't been declared canonical.**

## Timeline (recent, table-relevant)
| Date | Author | Prototype | What moved |
|---|---|---|---|
| Apr 8 | Edith Espinoza | `reporting-aiv` | Graduated AIV playspace→project |
| ~Apr 21 | Benjamin | `playspace/ai-variance` | `VarianceGrid.tsx` — deepest React variance grid |
| May 13–27 | Edith Espinoza | `reporting-aiv` | Material Variances, MoM/YoY, materiality, tx lightbox |
| May 13 | Greg → Tyler Davis | `ai-variance-prototype` | Focus-Mode grids; Tyler aligned typography |
| May 14–21 | Tyler Davis, Carmen Le | `fdm-rollup` | Account hierarchy/mapping table, views dropdown |
| May 29–Jun 1 | Carmen Le | `auditreportreboot` | Audit report builder |
| **Jun 26** | **Will Guardado** | **`reporting-bu-q3-2026-designs`** | **Newest — graduated fdm-rollup; unified v33 + real Enterprise + shared `agGridConfig`** |

## Four implementations / three packaging generations
| Prototype | Owner | Packaging | Enterprise |
|---|---|---|---|
| `reporting-aiv` | Edith | CDN v31 + `ag-theme-alpine` | **faked** in JS/CSS |
| `playspace/ai-variance` | Benjamin | scoped v32 + `row-grouping` | partial (real grouping) |
| `ai-variance-prototype` | Greg → Tyler | scoped v32, Community | none |
| **`reporting-bu-q3`** | Will ← Tyler/Carmen | **unified v33 + `AllEnterpriseModule`** | **real, fully** |

## Two sharp signals
1. **Edith is hand-building Enterprise chrome on Community** (fake row-group drop zone + side panel), with comments saying "Community doesn't ship this but power users expect it." → Proof Enterprise is a requirement. **Early win: convert `reporting-aiv` to real Enterprise** (license = watermark only, fine for prototypes).
2. **The variance grids go wide on purpose** — MoM + YoY comparison blocks side by side — and *tame* the width (pinned account anchor, foldable column groups, compact density, expand/collapse). Master/detail is reserved for transaction **drill-down in a drawer**, not the main grid. → The horizontal-space law differs by branch: workflow contains width via master/detail; analytical accepts + tames it.

## The target stack (`reporting-bu-q3`, generalize this)
- Unified v33 `ag-grid-community` + `ag-grid-enterprise` (`AllEnterpriseModule`, `ModuleRegistry`)
- Shared **`agGridConfig`** module: `{ theme, defaultColDef, sideBarConfig, getZebraRowStyle, compactTheme }`
- Real Enterprise: sidebar/tool-panel, aggregation (custom `consistentOrDash`), row selection (pinned checkbox), inline editing via `context`, period modes, saved views, view switching

## Requirements implied for P3b (from actual builds)
- **Grouping & aggregation** — user-regroupable (drag zone; `initialRowGroup` so it survives React re-render), subtotals/grand-totals/calc rows, custom aggs.
- **Comparison column blocks** — MoM + YoY as column groups; two-line, period-aware headers ("March 2026" / "Reporting Statement Aware").
- **Variance renderers** — signed $/% with materiality highlighting (≥20% or $50K/10%); in-grid AI explanation ("＋ Add" / "Draft with AI" on material rows, auto-height); sign-off state machine; avatar-stack ownership; status pills; progress/breakdown renderers for rollups.
- **Column/view management** — two-tier columns (core + optional default-hidden: YoY, preparer, reviewer); tool-panel sidebar; saved/custom reports as presets + default landing view.
- **Navigation** — summary → collection → focus; full-width drawer variant; transaction drill-down + deep-link "View in Grid" (row-flash).
- **Density** — pinned anchors + actions; variable row height for explanations; compact theme.

## Deeper Confluence context
- **AG Grid Optionality PRD** (R2R 4430209556) — ~13 grid toggles, presets (Audit/Compact/Extended), cascading persistence, <200ms perf.
- **Table Settings epic** (IDEA-2369 / REPORTING-14185) — `gridDisplay` + `gridData` config on `reportConfig.customSettings`; exports reflect grid view.
- **Variance Skills Management** (IDEA-2453); **DP 2.0 Secondary Dimension** (pivot/dimensions); **`@reporting/cache-client`** (perf — expensive queries repeat; the <200ms bar is real); **REPORTING-15548** confirms tested surface = Export/Sort/Group/Agg/Pivot/Filter.
