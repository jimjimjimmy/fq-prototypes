# Mike Feedback — Engineering Punchlist
**Last updated:** 2026-05-07  
**Source:** 3 recorded feedback sessions (Apr 13 + May 7)  
**Prepared by:** Greg Jones, Product Design

> Items are ordered by priority within each effort tier.
> Tier 1–2 are confident estimates. Tier 3 items marked ⚠️ need eng sizing before scheduling.

---

## Tier 1 — CSS / Styling only
*No logic changes. Estimated 1–4 hours each.*

| # | Priority | Item | Feature Area |
|---|---|---|---|
| 1 | High | Fix filter panel scroll — currently broken, cannot scroll down | Reconciliations |
| 2 | High | Right-align number columns, left-align text columns | Journal Entries |
| 3 | High | Reduce filter panel vertical footprint | Reconciliations |
| 4 | Medium | Add visual treatment to totals rows (bold, gray background, or double underline) | Reconciliations |
| 5 | Medium | Fix header font alignment in Documents — middle or bottom, not top | Documents |
| 6 | Low | Center-align notes column content | Journal Entries |
| 7 | Low | Slightly reduce font size in Journal Entries table | Journal Entries |

---

## Tier 2 — Label / copy / config
*String swaps and renames. Estimated < 1 hour each.*

| # | Priority | Item | Feature Area |
|---|---|---|---|
| 8 | High | Rename "Search" tab → "Journal Entries" (or correct feature name) | Journal Entries |
| 9 | Medium | Fix "reoccurring" → "recurring" everywhere it appears | Journal Entries |
| 10 | Medium | Surface filter control more prominently — "Show filter" near Controls | Journal Entries |

---

## Tier 3 — Frontend logic, no backend ⚠️
*Please size before scheduling. Estimated 1–3 days each.*

| # | Priority | Item | Feature Area |
|---|---|---|---|
| 11 | High | Add Expand All / Collapse All buttons for prepare and review states | Reconciliations |
| 12 | High | Preserve total row when a group is expanded (currently disappears) | Reconciliations |
| 13 | High | Make section header clickable — navigates to that section in the page | Journal Entries |
| 14 | Medium | Add loading indicator on three-way match — unclear when load completes | Reconciliations |
| 15 | Medium | Fix sidebar scroll discoverability — scroll zone not obvious to users | Reconciliations |

---

## Out of scope for this list
*These came up in sessions but require scoping / backend work:*

- Text search in Journal Entries (backend indexing)
- Collapsible top panel / focus collapse mode (layout rework)
- User profile page on avatar click (new feature)
- Overall Journal Entries table simplification (design + eng scoping needed)
- Compliance app link-out with richer context (may require cross-app routing)
