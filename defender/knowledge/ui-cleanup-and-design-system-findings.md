# UI Cleanup & Design System Findings

## Session Context
This audit examines the Defender prototype for FlowUI component usage, visual consistency, and design system gaps. Sources include: visual screenshots, code audit, Design Bar NotebookLM sessions (all sessions, not just Defender), and the Living Design System project.

---

## Part 1: Design System Feedback from Design Bar (Cross-Product)

These findings come from querying ALL Design Bar sessions in NotebookLM — they represent the design team's broader thinking about FlowUI and component quality.

### DS-1: AI Color Transition (Purple → Green)
**Source:** Tyler Davis, Carmen Le (Design Bar session)
**Finding:** Tyler is standardizing AI visual identity — moving from "AI purple" to "brand green" and updating the sparkle icon.
**Impact on Defender:** Our Dynamic Assignment container uses purple (#f8f5ff bg, #e9dffc border) and the AutoAwesome sparkle. Both may need updating.
**Action:** Flag for design review — don't change yet since the new standard isn't finalized.

### DS-2: Non-Modal / Floating Windows Needed
**Source:** Steve Raeder, Tyler Davis, Natasha Clark
**Finding:** Standard FlowUI Modal is a "dead end alley" — locks the screen, can't interact with data behind it. Team wants: movable, resizable, minimizable windows for data entry.
**Impact on Defender:** Our DeactivateRuleModal and Save Rule Modal use screen-locking FlowUI Modal. Steve specifically advocated floating modals for Data Defender rule editing.
**Action:** Document as design system gap. Current Modal usage is acceptable for prototype testing but should be flagged as a known limitation.

### DS-3: Sign-Off Component Repetition
**Source:** Greg Jones
**Finding:** The sign-off status component repetitively shows avatar + name + role for every assignee. Greg suggests simplifying.
**Impact on Defender:** Our Transaction Details anomaly cards show full assignee info for each person. Could be condensed.
**Action:** Low priority for prototype — note for production implementation.

### DS-4: AI Component Standardization
**Source:** Greg Jones, Tyler Davis
**Finding:** Teams are "rebuilding the same thing over and over" with AI side-drawers and chat windows. Need 3-5 standard AI components.
**Impact on Defender:** Our AI NL input in the Rule Builder is a custom implementation. Should eventually align with standard AI components.
**Action:** Document pattern for future alignment.

### DS-5: Inconsistent AG Grid Patterns
**Source:** Sergey Yeremenko, Tyler Davis, Benjamin Ellis
**Finding:** Refresh buttons, table settings, and loading states are implemented differently across the app.
**Impact on Defender:** Our AG Grid has a "Last refreshed today at 9:00 am" footer and custom refresh behavior. Should follow a standard pattern.
**Action:** Note for production — prototype is acceptable.

### DS-6: Designers Feel Confined by DS
**Source:** Joanna Liu, Edson Rodriguez
**Finding:** Designers feel restricted by existing FlowUI components when trying to build next-gen interfaces. Components that don't exist in code get replaced with worse alternatives.
**Impact on Defender:** Several elements in the prototype use custom implementations because FlowUI equivalents don't exist or don't fit (e.g., condition builder, severity slider, metric cards).
**Action:** Log as design system improvement opportunity.

---

## Part 2: Prototype-Specific FlowUI Audit

### Category A: Raw HTML That Should Be FlowUI (from automated audit)

**Total findings: 38 items (12 HIGH, 18 MEDIUM, 8 LOW)**

#### HIGH Priority — User-Facing Form Interactions (12 items)

| Location | Current | Should Be | Fixed? |
|----------|---------|-----------|--------|
| RuleDetailPanelContent — Name input | Raw `<input>` | FlowUI `Input` | **YES** (this session) |
| RuleDetailPanelContent — Description | Raw `<textarea>` | FlowUI `TextArea` | **YES** (this session) |
| RuleDetailPanelContent — Avatar circles | Custom div | FlowUI `Avatar` | **YES** (this session) |
| ConditionBuilder — Field select | Raw `<select>` | FlowUI Select | No |
| ConditionBuilder — Operator select | Raw `<select>` | FlowUI Select | No |
| ConditionBuilder — Value input | Raw `<input>` | FlowUI Input | No |
| GroupBuilder — AND/OR toggle | Raw `<button>` | FlowUI Button variant="ghost" | No |
| GroupBuilder — Delete group | Raw `<button>` | FlowUI IconButton | No |
| GroupBuilder — Add Condition | Raw `<button>` | FlowUI Button variant="ghost" | No |
| GroupBuilder — Add Group | Raw `<button>` | FlowUI Button variant="ghost" | No |
| RuleSummaryItem — Menu buttons | Raw `<button>` | FlowUI DropdownButton | No |
| DetailPanel — Comment action buttons | Raw `<button>` | FlowUI IconButton | No |

#### MEDIUM Priority — Visual Consistency (18 items)

| Location | Current | Should Be |
|----------|---------|-----------|
| RuleDetailPanelContent — Rule Owner select | Raw `<select>` | FlowUI Select |
| RuleDetailPanelContent — Role selects | Raw `<select>` | FlowUI Select |
| RuleDetailPanelContent — Section headers | Custom function | FlowUI SectionHeader |
| RuleDetailPanelContent — ~15 divider lines | `<div style>` | FlowUI Divider |
| RuleDetailPanelContent — Activity Log toggle | Raw `<button>` + manual chevron | FlowUI Accordion |
| RuleDetailPanelContent — AI accordion toggle | Raw `<button>` + manual rotate | FlowUI Accordion |
| RuleDetailPanelContent — Version dropdown buttons | Raw `<button>` | FlowUI DropdownButton |
| RuleDetailPanelContent — Kebab menu buttons | Raw `<button>` | FlowUI DropdownButton |
| DeactivateRuleModal — Radio buttons | Raw `<input type="radio">` | FlowUI Radio |
| RulesGrid — Kebab dropdown | Custom div | FlowUI DropdownButton |
| RulesGrid — Status badge | Inline span | FlowUI StatusBadge |
| RuleSummaryItem — Tooltip | Custom hardcoded | FlowUI Tooltip |
| TopNavbar — Tab buttons | Raw `<button>` | FlowUI Button |
| TopNavbar — Active tab border | Hardcoded `#186749` | CSS variable |
| TransactionGrid — Selected row style | getRowStyle inline | AG Grid theme param |
| DetailPanel — Status dropdown buttons | Raw `<button>` | FlowUI DropdownButton |
| DetailPanel — Divider patterns | border-gray-200 | FlowUI Divider |
| DetailPanel — Avatar color array | Hardcoded 6 colors | Design token set |

#### LOW Priority — Code Quality (8 items)

| Location | Issue |
|----------|-------|
| RuleDetailPanelContent — 150+ inline styles | Should extract to Tailwind classes |
| DetailPanel — 80+ inline styles | Should extract to Tailwind classes |
| TopNavbar — 15 inline styles | Should extract to Tailwind classes |
| Custom SectionHeader function | Duplicates FlowUI SectionHeader |
| Custom AvatarCircle function | Now uses FlowUI Avatar (FIXED) |
| Multiple files — `fontFamily: 'Inter'` | Should inherit from theme |
| Multiple files — `fontFamily: 'Museo Sans'` | Should use CSS variable |
| RuleBuilderContent — custom dropdown UI | Parallel implementation to ConditionBuilder |

### Category B: Hardcoded Values That Should Be Design Tokens

| Location | Current | Should Be |
|----------|---------|-----------|
| RuleDetailPanelContent `tok` object | 15 hardcoded hex colors (#1d2433, #424867, etc.) | CSS variables (var(--flo-sem-color-text-default), etc.) |
| RuleDetailPanelContent — All font-family declarations | Inline `fontFamily: 'Inter, sans-serif'` / `'"Museo Sans", sans-serif'` | Inherited from FlowUI theme or CSS variables |
| DeactivateRuleModal — Warning colors | `#fff8eb`, `#92400e` | FlowUI semantic warning tokens |
| RulesGrid — Status badge colors | Hardcoded in StatusCellRenderer | FlowUI StatusBadge component |
| DetailPanel — "Deleted from ERP" banner | `#fef2f2`, `#991b1b` | FlowUI semantic danger tokens |

### Category C: Visual Issues Identified in Screenshots

| View | Issue | Severity |
|------|-------|----------|
| Rule Details — View mode | Metric cards border radius (6px) looks different from Figma (which may use 8px per FlowUI standard) | Low |
| Rule Details — Edit mode | Name/Description inputs are narrower (max-width: 400px) than the section width — creates unbalanced layout | Medium |
| Rule Details — Edit mode | GroupBuilder condition dropdowns use a different visual style than the rest of the edit form (gray background, different border color) — comes from the shared component | Medium |
| Rules Grid | Column headers truncated when panel is narrow — "Unresolved An..." | Low |
| Transaction Details | "Configure Fields" button looks slightly different from other FlowUI buttons in the same view | Low |

---

## Part 3: Figma-FQ Skill Improvement Opportunities

Based on this cleanup effort, these improvements would help future sessions:

### Skill Gap 1: FlowUI Component Detection
The figma-fq skill compares visual design to code but doesn't check whether the CODE uses FlowUI components. A future enhancement could:
- Scan the prototype source for raw HTML elements
- Cross-reference with FlowUI component library
- Flag mismatches in the diff plan

### Skill Gap 2: Design Token Validation
The skill uses `get_variable_defs` to extract Figma tokens but doesn't validate that the CODE actually uses CSS variables instead of hardcoded hex values. Could add a "token compliance" check.

### Skill Gap 3: Cross-Session Design Bar Context
The skill currently queries NotebookLM per-request. A pre-loaded "design principles" context from all Design Bar sessions would avoid repeated queries and ensure consistency.

---

## Part 4: Design System Improvement Recommendations

### For FlowUI Team
1. **Add non-modal/floating window component** — Steve's top request, needed for Defender and other data-dense products
2. **Standardize AI components** — 3-5 patterns: chat panel, NL input, AI results display, sparkle indicator, AI container
3. **Add condition builder component** — Defender's GroupBuilder/ConditionBuilder pattern is reusable for any rule-based product
4. **Add severity/risk slider** — reusable for any product with priority scoring

### For Design Bar Process
1. **Capture chat logs** — text decisions aren't in NotebookLM
2. **Post-session decision summary** — one-pager capturing what was decided, what needs testing
3. **Cross-product findings index** — Design Bar feedback about DS gaps (like floating windows) should be tracked centrally, not buried in product-specific sessions

### For Figma-FQ Skill
1. Add FlowUI component compliance check to the diff plan
2. Add design token validation (CSS variables vs hardcoded hex)
3. Pre-load Design Bar principles context to avoid repeated queries

---

## Part 5: Removed Items

### Figma Match Overlay
**Removed:** `figmaMatchPlugin()` from `vite.config.ts`
**Reason:** No longer needed for this phase — the overlay was for individual component matching, which is complete. The dev-tools files (`src/dev-tools/`) are still in the project for future use.
