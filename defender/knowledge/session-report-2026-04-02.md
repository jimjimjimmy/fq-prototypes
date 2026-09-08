# Data Defender: AI-Assisted Prototype Development Session Report

**Date:** April 2, 2026
**Author:** Benjamin Ellis, Product Design Manager
**Branch:** `defender/figma-full-pass` → `project/defender` → PR #47
**Scope:** Full Figma design pass, FlowUI compliance, new view implementation, end-to-end functional prototype

---

## What we built

This session took the Data Defender prototype from a Bolt-generated scaffold to a fully functional, FlowUI-compliant end-to-end product. The work happened across three phases over one extended Claude Code session, covering design matching, UI cleanup, and new feature implementation.

The PR tells the numbers: 38 files changed, 5,442 lines added, 1,353 removed. But the real output is a prototype that now works the way the Figma designs and Design Bar sessions intended it to — not just the way the original Bolt architecture happened to structure it.

### What shipped

**New views from Figma designs:**
- MetricCards — horizontal card strip with Metrics/Insight Cards tab switcher, trend arrows, clickable status counts that filter the transaction grid
- Insights Grid — full AG Grid table with 10 AI-generated insights across three types (Standard Check, Algorithm, Account Fingerprint), replacing a placeholder purple button
- Suggested Rules — categorized page with Transaction Analysis Rules and Common Accounting Anomalies sections, anomaly count badges, info banner, Load More pagination

**Rule editing (10 dead-end interactions fixed):**
- In-place editing with GroupBuilder for condition logic
- AI natural language input that generates rule conditions
- Interactive severity slider
- Role selectors that move assignees between Preparer and Reviewer
- Save modal with version tracking and period scope selection
- Version dropdown, old version read-only mode, deactivation workflow

**FlowUI compliance pass:**
- ~80 hardcoded hex colors replaced with CSS variables (`var(--flo-sem-color-*)`) across all components
- AI color standardized from purple to green per Tyler Davis's design system decision
- FlowUI Input, TextArea, Avatar, Button replacing raw HTML elements
- All select elements restyled with shared constant
- Three broken modals fixed (Manage Panels, Edit Layout, Save Layout)

**Infrastructure:**
- Transaction detail persistence — clicking a rule no longer clears the selected transaction
- `window.__test` harness for automated verification
- Backend persistence via json-server for status changes, comments, rule edits
- AG Grid icons extracted to shared component file
- Insight types and suggested rule categories as typed data

---

## Timeline

The session moved through distinct phases. Each built on what the previous one revealed.

### Phase 1: Design matching and architecture discovery
Started by pulling Figma design context for the Rule Details panel. Discovered that `get_design_context` silently returns empty on large component instances (>1500px). Built the Deep Instance Probe — a Figma Plugin API script that traverses inside opaque instances — and added it to the figma-fq skill as a permanent capability.

Used the probe to extract 80 nodes of design data from the Rule Details component. Cross-referenced with Design Bar NotebookLM sessions. Mapped 52 workflow sections across two Figma files (Rules and Transactions pages).

### Phase 2: Architecture correction and functional prototype
This is where the session's most important insight emerged. The Bolt prototype had architected rule editing as a separate form component, but Figma shows it as an in-place transformation of the same panel. We'd been treating the Bolt architecture as the source of truth and trying to match Figma into it. The correct approach was the inverse: treat Figma and Design Bar as the source of truth and reshape the code to match.

Rewrote the entire edit mode. Fixed all 10 dead-end interactions. Added version management, deactivation workflow, mock data enrichment, and backend persistence.

### Phase 3: UI cleanup and new views
Ran a systematic FlowUI audit (38 items across 12 files). Replaced all hardcoded hex colors with CSS variables. Fixed the three layout management modals. Then implemented three new views from fresh Figma design artifacts: MetricCards, InsightsGrid, and the Suggested Rules redesign.

The Manage Panels fix revealed a FlowUI API gotcha — the Checkbox component uses `onCheckedChange` instead of `onChange`. The checkboxes had been rendering correctly but never actually toggling state.

---

## What we learned

### On using Figma MCP tools

**What worked well:**
- `get_screenshot` is reliable across all node sizes and produces clear reference images
- `get_design_context` delivers excellent code output for nodes under ~1500px
- `get_metadata` provides the structural overview needed to navigate large files
- `use_figma` (Plugin API) can access data that the REST API tools cannot

**What didn't:**
- `get_design_context` silently returns empty for large nodes — no error, no warning, just missing data. This is the single biggest friction point. We spent significant time thinking the Figma file was structured differently before realizing the tool was hitting a size limit.
- Component instances that wrap many children become opaque to the REST API. The metadata shows the instance exists but can't read inside it.
- Read-only Figma files block `use_figma` — had to create an editable copy for Plugin API access.

**Opportunity:** The figma-fq skill should always attempt the Deep Instance Probe when `get_design_context` returns sparse data for a node that clearly has content (based on its dimensions). This should be automatic, not requiring user intervention.

### On Design Bar and NotebookLM

**What worked well:**
- Design Bar transcripts in NotebookLM provided attributed feedback with speaker context — knowing that Steve Raeder advocated floating modals vs. Tyler Davis standardizing AI colors gives different weight and applicability
- Querying NotebookLM for "insights" before implementation gave us the conceptual model (unknown unknowns, process drift, insight-to-rule conversion) that the Figma screenshots alone couldn't convey
- Cross-session queries surfaced patterns: 6 design system gaps identified from sessions that weren't about Defender specifically

**What didn't:**
- Text/chat communications from Design Bar aren't captured — only Gong audio transcripts are in NotebookLM. Slack threads where decisions happen between sessions are missing entirely.
- Specific terms from Figma (like "Standard Check" and "Account Fingerprint" as insight types) weren't in the transcripts — they appear to be product decisions that happened outside recorded sessions.

**Opportunity:** Post each Design Bar session, export the Gong chat log and any relevant Slack threads. Add them as text sources in NotebookLM alongside the audio transcript. Also create a brief one-pager summarizing what was decided, what needs testing, and what changed — this is the connective tissue between the full transcript and the next action.

### On FlowUI design system alignment

**What worked well:**
- CSS variables (`var(--flo-sem-color-*)`) with hex fallbacks are a clean pattern — the prototype works with or without the FlowUI theme loaded
- FlowUI Button, Modal, Avatar, Checkbox, Toggle, Accordion components are solid and match Figma designs closely
- The deviation lookup procedure in the figma-fq skill caught a real mismatch (SideDrawer z-index behavior)

**What didn't:**
- FlowUI doesn't have Radio, Select (styled dropdown), or Condition Builder components. The prototype uses raw HTML selects with custom styling — functional but divergent from what a FlowUI-first approach would produce.
- The Checkbox `onCheckedChange` vs `onChange` API inconsistency cost real debugging time. This is documented nowhere in the design system guidance we have.
- FlowUI Modal doesn't include default padding — every modal needs its own padding wrapper, which leads to inconsistency

**Opportunity:**
- FlowUI component prop documentation should be queryable at implementation time. The Flow UI MCP server provides component lists but not prop-level API details for every component. Expanding this to include callback prop names (onChange vs onCheckedChange vs onValueChange) would prevent the class of bug we hit.
- A "FlowUI component gaps" tracker — shared across product teams, not buried in project-specific knowledge files — would help the design system team prioritize additions based on actual demand.

### On the prototype development process

**What worked well:**
- Working in a git worktree isolated the session from other branches — no merge conflicts, clean history
- The `window.__test` harness made verification possible through `preview_eval` — without it, testing flexlayout interactions programmatically would require clicking through the UI screenshot by screenshot
- Committing frequently (20 commits for this session) created natural checkpoints and made the PR reviewable
- The plan mode workflow — explore, plan, get approval, execute — caught the architecture mismatch before we committed to a wrong approach

**What didn't:**
- The initial approach of matching Figma into Bolt's architecture wasted time. The prototype's code structure is a suggestion, not a constraint. Figma and Design Bar should always be treated as the source of truth for layout and interaction patterns.
- Testing by taking screenshots and visually inspecting is slow. The test harness helps, but we should build richer assertions: "this element should be visible," "this state should equal X."
- Context window pressure: this session covered enough ground that the conversation was compacted multiple times. Saving research to knowledge files before implementation (a lesson from a previous session) kept us from losing insights.

**Opportunity:** Create a pre-session checklist for Figma design implementation:
1. Pull ALL screenshots from the relevant Figma pages first — don't drill into specific nodes until you have the full picture
2. Query Design Bar for the product area before writing any code
3. Audit existing prototype code for what already exists (~40% was already built in our case)
4. Identify architecture mismatches between Figma's interaction model and the prototype's component structure
5. Build the data layer and types first — this catches structural issues before you're deep in JSX

---

## Appendix A: Detailed findings by surface

### A1. Figma MCP tools

| Tool | Reliability | Best Use | Limitation |
|------|------------|----------|------------|
| `get_screenshot` | High | Visual reference for any node | Limited to rendered output, can't extract data |
| `get_design_context` | Medium | Code generation for small-medium nodes | Silently returns empty for nodes >~1500px |
| `get_metadata` | High | Structural navigation, node discovery | Can't see inside component instances |
| `use_figma` (Plugin API) | High | Deep traversal, variable extraction | Requires editable file; new skill capability |
| `search_design_system` | Medium | Finding component matches | Underutilized in this session |
| `get_variable_defs` | High | Design token extraction | Works well, no issues observed |

**Recommendations:**
1. Add automatic fallback: if `get_design_context` returns sparse data for a node with area > 1500x1500, automatically trigger Deep Instance Probe
2. Log a warning when `get_design_context` returns fewer elements than `get_metadata` shows for the same node
3. Cache probe results per session to avoid redundant Plugin API calls

### A2. Design Bar sessions and NotebookLM

| Session | Key Contribution to This Work |
|---------|------------------------------|
| Gaurav Dhamija — Defender Demo | Insights conceptual model: unknown unknowns, process drift, insight-to-rule conversion |
| Steve Raeder, Tyler Davis — Modals | Non-modal/floating windows, AI color standardization (purple → green) |
| Greg Jones — Components | Sign-off component simplification, AI component standardization need |
| Carmen Le — Rules | Save Rule modal with period scope, versioning workflow |

**7 Design Principles Derived from Design Bar:**
1. Floating modals over screen-locking modals for data entry
2. No accordion inception — flat sections with clear headers
3. Action buttons in content areas, not in accordion/section headers
4. Strong visual breadcrumbs — selected row highlighting, panel persistence
5. Binary AI distinction — AI-generated content gets its own visual container
6. Distinct Dynamic Assignment container — separated from regular assignees
7. Consolidated layout actions — views, filters, columns in one dropdown

**Gap:** No structured process for capturing chat-based decisions. Audio transcripts miss Slack threads and text chat in Gong where follow-up decisions happen.

### A3. FlowUI design system

**Components used successfully:**
Button, Modal, SideDrawer, Toggle, Checkbox, Avatar, AvatarGroup, Tooltip, Accordion, Input, TextArea, Divider, Toast, CloseButton, DropdownButton

**Components needed but not available:**
- Radio (used raw `<input type="radio">` with accent-color)
- Select / Styled Dropdown (used `<select>` with appearance:none + SVG chevron)
- Condition Builder (custom GroupBuilder/ConditionBuilder)
- Severity Slider (custom implementation)
- Metric Card (custom MetricCards component)

**API inconsistencies discovered:**
- Checkbox uses `onCheckedChange`, not `onChange` — this cost ~30 minutes of debugging
- Modal requires manual padding wrapper — no default content padding
- SideDrawer throws prop warning when children is null (ActivityLogPanel conditional render)

**Token compliance:**
- Session started with ~120 hardcoded hex values across 12 component files
- Session ended with ~5 remaining (intentional: avatar color palette, ChatPanel backgrounds)
- All semantic colors now use `var(--flo-sem-color-*)` with hex fallbacks

### A4. Prototype architecture

**Files modified:** 38
**Lines added:** 5,442
**Lines removed:** 1,353
**New components:** 5 (MetricCards, InsightsGrid, ag-grid-icons, insights data, suggested rules data)
**Rewritten components:** 2 (SuggestedRules, RuleDetailPanelContent edit mode)
**Knowledge documents created:** 6

**Architecture decisions logged without explicit design source:** 7
1. Severity slider interactive in edit mode
2. Role selector auto-switches arrays
3. Save Rule modal reused for edits
4. AI Natural Language wired in edit mode
5. Green accent border for selected transaction
6. Dynamic Assignment container color (now green, was purple)
7. Backend persistence via json-server silent PATCH

**Mock data:**
- 75 transactions (including deleted, dismissed, multi-rule)
- 17 rules (including deactivated, versioned)
- 10 insights across 3 types
- 10 suggested rules across 2 categories
- 25 signoffs including partial scenarios

---

## Appendix B: Opportunities for improvement

### For the figma-fq skill
1. **Auto-detect large node failures** — if `get_design_context` returns fewer than 5 elements for a node with dimensions > 1500px, automatically trigger Deep Instance Probe
2. **FlowUI component compliance check** — compare prototype source against FlowUI component library; flag raw HTML that should use FlowUI
3. **Design token validation** — check that code uses CSS variables instead of hardcoded hex values
4. **Pre-load Design Bar context** — query NotebookLM for the product area at the start of any figma-fq session

### For Design Bar process
1. **Capture chat logs** — export Gong chat alongside audio transcript to NotebookLM
2. **Post-session decision summary** — one-pager capturing what was decided, what needs testing, what changed
3. **Cross-product findings index** — design system gaps should be tracked centrally, not buried in product-specific sessions
4. **Design-to-prototype handoff brief** — when a designer hands off Figma designs for prototyping, include: key interaction patterns, state transitions, which Design Bar decisions informed the design

### For FlowUI design system
1. **Add non-modal/floating window component** — Steve Raeder's top request, needed for Defender and other data-dense products
2. **Standardize AI components** — 3-5 patterns: chat panel, NL input, AI results display, sparkle indicator, AI container
3. **Add condition builder component** — reusable for any rule-based product
4. **Prop API documentation in MCP** — expand Flow UI MCP to include callback prop names and types
5. **Component gap tracker** — shared across teams so DS team can prioritize by demand

### For prototype development workflow
1. **Pre-session Figma overview** — pull all screenshots from relevant pages before drilling into specific nodes
2. **Design Bar query first** — query NotebookLM for the product area before writing code
3. **Code audit before implementation** — check what already exists; ~40% was already built in this session
4. **Architecture mismatch check** — compare Figma's interaction model with the prototype's component structure before committing to changes
5. **Richer test assertions** — extend `window.__test` with element visibility checks and state assertions, not just navigation commands

---

*This report was generated from a single Claude Code session on April 2, 2026. The session produced PR #47 to the FloQast product-and-design repository. All findings are documented in the project's knowledge/ directory for future reference.*
