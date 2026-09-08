# Low-Eng Effort Punchlist

Synthesized from sessions: 2026-04-13, 2026-05-07
Last updated: 2026-05-07

> Effort tiers: **CSS-only** → **Label/config** → **Frontend logic** → **Requires backend**
> Items in Tier 3 marked ⚠️ — eng partner should sanity-check sizing before committing.
> This list excludes backend-dependent work and major layout reworks (see "Not on this list" section).

---

## Tier 1 — CSS / Styling only
*1–4 hour fixes. No logic, no data.*

| Item | Feature Area | Session | Mike's Quote |
|---|---|---|---|
| Right-align number columns in table | Journal Entries | May 7 | "Numbers right aligned, texts should be left aligned" |
| Fix header font alignment (middle or bottom, not top) | Documents | Apr 13 | "I don't think top aligned" |
| Add visual treatment to totals rows (bold, gray bg, or double underline) | Reconciliations | Apr 13 | "Something just to show that it's the total" |
| Reduce filter panel vertical footprint | Reconciliations | Apr 13 | "Filters gotta take up less space, way less space" |
| Slightly reduce font size in table | Journal Entries | May 7 | "I feel like this could be slightly smaller font" |
| Center-align notes column content | Journal Entries | May 7 | "I like center for the notes" |

---

## Tier 2 — Label / copy / config
*String swaps, route renames, terminology. Usually < 1 hour.*

| Item | Feature Area | Session | Mike's Quote |
|---|---|---|---|
| Rename "Search" tab → "Journal Entries" (or actual feature name) | Journal Entries | May 7 | "Why call it search? Just name it the thing" |
| Fix "reoccurring" → "recurring" everywhere | Journal Entries | May 7 | "I always get weirded out when I see reoccurring" |
| Add "Show filter" control that's easier to surface | Journal Entries | May 7 | "Should be easier to get to, maybe under controls" |

---

## Tier 3 — Frontend logic (no backend)
*State changes, scroll fixes, UI interactions. Likely 1–3 days each. ⚠️ Sizing unverified.*

| Item | Feature Area | Session | Mike's Quote |
|---|---|---|---|
| Fix filter panel scroll (currently broken) | Reconciliations | Apr 13 | "Filters can't like scroll down at all" |
| Fix sidebar scroll zone discoverability | Reconciliations | Apr 13 | "I didn't realize I had to be over here to scroll" |
| Add Expand All / Collapse All buttons (prepare + review) | Reconciliations | Apr 13 | "Expand all and collapse all…prepare and review" |
| Preserve total row when group is expanded (don't hide it) | Reconciliations | Apr 13 | "Then you have the visual tie back up" |
| Make clicking section header navigate to that section | Journal Entries | May 7 | "Make it so clicking here takes you to the section" |
| Add loading indicator on three-way match | Reconciliations | Apr 13 | "I didn't know when it loaded" |

---

## Not on this list (higher effort / roadmap items)

| Item | Why excluded |
|---|---|
| Text search in Journal Entries | Backend indexing required |
| Collapsible top panel / focus collapse | Significant layout rework |
| User profile page on avatar click | New feature — scoping needed |
| Overall table simplification | Design + eng scoping needed |
| Compliance app link-out with context | May require cross-app routing work |
