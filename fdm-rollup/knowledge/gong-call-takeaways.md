# Gong Call Takeaways — Will + Edith, 2026-04-28

21-minute sync. Will brought several context items the PRD doesn't fully document. Captured here so future-Edith and future-Carmen don't have to re-watch the recording.

## Resolves PRD open questions

- **Q1 — Save model:** Page-level, not per-panel. The prototype's per-panel save buttons are misleading. Real FDM saves the whole page; the existing mapping rules sidebar has its own save button but it commits the whole page. *Action: build single page-level save in this prototype.*
- **Q3 — Drag feasibility:** Opinionated FlexLayout. Hierarchy nodes drag freely. **Mapping table tabs move together as one widget** — never allow individual tabs to be torn out. Same likely applies to mapping rules.

## Expands scope beyond the PRD

- **Three co-equal widgets, not one panel + table:** rollup structure, mapping table, mapping rules. The PRD only treats the rollup panel as new; Will sees all three as draggable/focusable widgets long-term.
- **Default layout:** rollup left, mapping right. User can close either to focus on the other.
- **Filters/search are widget-scoped, not page-fixed.** Today the table's filters live at the top of the page. If rules become their own widget, rules-related filters move with it. PRD doesn't address this.
- **AI Structuring Agent (IDEA-1989) is converging.** Will wants the agent's output to land directly in the in-app rollup structure, not produce a template. Even though IDEA-1989 is "out of scope" for this PRD, the entry-point question ("do you want AI to build your rollup?") needs design consideration.
- **Empty-state problem:** Will is iffy on default templates ("annoying to dump something that doesn't fit your business and tell them to edit it"). Leaning toward an AI-guided setup question instead.

## Three motivations for hierarchy edits (today's pain points)
1. **Rename** — simplest case, "I didn't name this well"
2. **Break out levels** — most painful; today, rules don't follow level changes, forcing reimplementation
3. **Add new items** — users sometimes delete the internal-id column in the template, breaking everything

## Constraints to honor
- Don't reinvent the mapping experience — additive only
- Indent/outdent freedom assumes IDEA-2308 ships first (fine to prototype as if it has)
- Will wants to share the HTML output with devs early to shape scope — legibility of intent > pixel polish
- "Don't take my prototype as gospel" — Will explicitly flagged Claude-code hallucinations in his version, especially around save behavior

## Logistics
- Will's HTML prototype lives at `/Users/edithesp/Downloads/IDEA-2246-prototype 6.html` — minified React + Tailwind, 607 real account nodes. Use as visual/intent reference only, not source code to extend.
- Carmen returns Mon/Tue 2026-05-04. Edith out Thurs 2026-04-30 + Fri 2026-05-01.
- Goal: shareable prototype by EOD 2026-04-29.
- Will's preferred path: vibe-code the HTML, share with him, then run it past devs. Don't sink Figma time until layout and interactions feel right.
