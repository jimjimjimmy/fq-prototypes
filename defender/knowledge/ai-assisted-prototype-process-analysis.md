# AI-Assisted Prototype Development: Process Analysis

## Session: Data Defender Full Figma Pass
**Date:** 2026-04-02
**Branch:** `defender/figma-full-pass`
**Duration:** Single extended session (two passes)
**Commits:** 8 (700+ insertions across 17 files)

---

## 1. Sources Used & Effectiveness

### Source A: Figma MCP (`get_design_context`, `get_metadata`, `get_screenshot`, `get_variable_defs`)

**What worked well:**
- `get_screenshot` was the most reliable tool — always returned a clear visual reference regardless of node size
- `get_variable_defs` returned exact design token values (60+ tokens) that mapped directly to CSS — eliminated manual color picking
- `get_metadata` exposed the full node tree structure for smaller components
- `get_design_context` produced usable React+Tailwind code for nodes under ~1500px

**Where it struggled:**
- `get_design_context` silently returns empty on large nodes (>~1500px in any dimension) — no error, just empty output. This was the session's biggest discovery.
- `get_metadata` cannot see inside component instances — shows `<instance ... />` with no children
- Combined, large component instances were completely opaque to the standard MCP tools
- Full-page Figma files (800K+ characters of metadata) overwhelmed the standard tools

**Breakthrough: Deep Instance Probe**
- We discovered that the Figma Plugin API (`use_figma`) CAN traverse instance children via `node.children`
- Built a `deep-instance-probe.js` script that extracts 80 nodes with layout, typography, fills, and component context
- This gave us element-level design data that neither MCP tool could provide
- Successfully tested on the Rule Details instance (1336x1770px) — returned full internal structure
- **This became a new capability added to the figma-fq skill**

**Key limitation found:**
- The Rules Figma file (`jisKCBFEaLCuZljlTaQJYn`) was read-only for `use_figma` — the Plugin API couldn't traverse it directly. We had to use a user-created copy file for the probe. The original file's `get_screenshot` and `get_metadata` still worked.

### Source B: Design Bar NotebookLM

**What worked well:**
- Rich, specific feedback with attribution (who said what, when, why)
- Answered detailed workflow questions: "How does rule versioning work?", "What triggers a new version?", "How should deleted transactions be handled?"
- Provided intent behind design decisions — not just "what" but "why"
- Cross-session synthesis: feedback from 4+ sessions combined into coherent answers
- Specific UI guidance: "deleted is a scary word" → "Deleted from ERP" tooltip
- Named specific patterns: "floating modals for data entry", "filter pills above the grid"

**Where it struggled:**
- Complex multi-part queries sometimes timed out — had to break into focused questions
- Returned citations but not always the surrounding visual context from the session
- Some answers were synthesis of multiple speakers' views — had to interpret consensus vs individual opinion
- Couldn't show the Figma screens that were being discussed in the sessions

**Most valuable Design Bar insights that directly shaped implementation:**
1. Benjamin: "Cancel/Save footer feels disconnected in flex layout" → informed deactivation modal as separate overlay
2. Steve: "floating modals for data entry" → informed edit approach philosophy
3. Tyler: "over-designed with nested accordions" → kept sections flat, only Activity Log gets accordion
4. Benjamin: "surface rule parameters higher" → informed section ordering in Rule Details
5. Carmen: "deleted from ERP... we want to preserve as much as we can" → informed banner copy and data preservation
6. Greg: "default statuses too rigid" → informed adding 'Deleted' and 'Deactivated' to status types
7. Benjamin: "filter pill above the grid when metric cards filter" → specific UI pattern request (not yet implemented)

### Source C: Catalyst Project Personas

**What worked well:**
- Gave concrete user archetypes (Sarah/Preparer, David/Reviewer, Maria/Controller) that mapped directly to Defender roles
- "5-second rule" — users should identify their next action within 5 seconds — informed empty state and banner design
- Pain point about context fragmentation validated the flex layout approach
- Informed tone of empty states: actionable guidance vs blank placeholders

**Where it struggled:**
- Personas are for FloQast Close (reconciliation), not Defender specifically — had to translate
- No Defender-specific persona research exists yet
- Controller persona (Maria) needs cross-entity views that aren't designed in Figma

### Source D: FlowUI Design System (MCP + Figma library)

**What worked well:**
- `search_design_system` found component matches (Badges, Signature/Signoffs, Body/Section-header)
- Confirmed exact component names and variant props
- FlowUI MCP gave prop-level detail for components used in the prototype

**Where it struggled:**
- Not used extensively in this session — most styling came from the Figma probe tokens rather than FlowUI component matching
- The prototype uses a mix of FlowUI components and custom implementations — inconsistent

### Source E: Figma File Structure Analysis

**What worked well:**
- Listing pages via Plugin API revealed the workflow-focused pages (032726-Rules, 031626-Transactions) that contain the real user journey designs
- Top-level frame extraction from metadata showed the full scope: 20 sections in Rules, 32 in Transactions
- Section names directly mapped to user workflows (not just visual designs)

**Where it struggled:**
- Initial analysis missed these workflow pages entirely — only looked at individual screens
- User had to redirect: "there's a 032726 page that shows more of the workflow"
- Full-page metadata was 800K-900K characters — needed Python scripts to extract structure

---

## 2. Process Steps & What Each Contributed

### Step 1: Open prototype in preview
- Established the baseline — could see what currently existed
- Identified the nvm PATH issue for worktree (recurring friction)

### Step 2: First figma-fq attempt (node-level matching)
- Tried to match Rule Details panel against a specific Figma node
- Discovered the `get_design_context` empty response problem
- Led to the Deep Instance Probe innovation
- **Key learning:** Node-level matching works for components under ~1500px

### Step 3: Deep Instance Probe development
- Built `deep-instance-probe.js` and added it to the figma-fq skill
- Unified the skill flow (removed Simple/Medium/Complex triage)
- Pushed skill improvements to main for team use
- **Key learning:** Plugin API is the fallback for opaque instances

### Step 4: Successful Rule Details redesign
- Used probe data + tokens + screenshot to build the 5-section layout
- Matched Figma design with element-level accuracy
- Identified specific discrepancies via comparison (status badge, metric card layout, section dividers)
- **Key learning:** Probe gives better data than screenshot-only approach

### Step 5: Full Figma file analysis
- Screenshotted key frames from both files
- Mapped against prototype state
- Initial analysis was too surface-level — missed workflow pages
- **Key learning:** Need to check ALL pages in a Figma file, not just the first one

### Step 6: Workflow page deep dive (user-directed)
- Benjamin pointed to specific pages (032726-Rules, 031626-Transactions)
- Listed all 52 sections across both pages
- Cross-referenced with Design Bar for each workflow
- Built comprehensive gap analysis
- **Key learning:** Figma pages organized by date (032726 = March 27, 2026) contain the real user journey designs

### Step 7: Implementation sprint
- Worked through Tier 1 features systematically
- Discovered many features already existed (clone, sign-off modal, save modal, suggested rules)
- Added: versioning, deactivation modal, kebab menu, activity log tab, deleted ERP handling, empty states
- Used Catalyst personas to inform UX decisions
- **Key learning:** Audit existing code BEFORE building — the prototype had more than the gap analysis suggested

---

## 3. Challenges & Friction Points

### Technical Challenges
1. **Figma MCP silent failures** — `get_design_context` returns empty with no error. Wasted time retrying before discovering the size limit.
2. **Read-only Figma files** — `use_figma` couldn't run on the shared Rules file. Needed user to create an editable copy.
3. **Worktree PATH issues** — nvm not in PATH for preview tools. Required bash wrapper in launch.json every session.
4. **Preview tool navigation** — Couldn't reliably click AG Grid rows or switch flexlayout tabs via `preview_eval`. The React event system didn't propagate from synthetic DOM events.
5. **Large metadata files** — 800K+ character XML outputs needed Python scripts to parse. Couldn't read directly.

### Process Challenges
1. **Initial scope underestimation** — First analysis missed workflow pages and categorized too many items as "already done" without verifying
2. **Source triangulation** — Same feature described differently in Figma (visual), Design Bar (intent), and code (implementation). Had to reconcile all three.
3. **Prototype archaeology** — Discovering what already existed (clone flow, save modal, sign-off modal) took investigation. No central "what's implemented" doc.
4. **Context window management** — Large Figma metadata, NotebookLM responses, and code files competed for context space. Had to use agents for parallel exploration.

### Information Gaps
1. **Account scope selector** — Design Bar mentions it, Figma might show it, but screenshots too small to read
2. **Error modal copy** — 11 variants exist in Figma but haven't been read at detail level
3. **Risk score tooltip formula** — Gaurav described the calculation verbally but visual treatment unclear
4. **Multi-entity views** — Controller persona needs this, no Figma designs exist
5. **AI sparkle indicator** — Behavior clear from Design Bar, exact visual treatment unclear from Figma

---

## 4. What Worked Best (Recommended Patterns)

### Pattern 1: Probe → Token → Screenshot triangulation
For any component matching:
1. Run Deep Instance Probe for structure + element-level properties
2. Use `get_variable_defs` for design tokens
3. Use `get_screenshot` for visual reference
4. Cross-reference all three before writing code

This consistently produced the most accurate implementations.

### Pattern 2: Design Bar before implementation
Querying NotebookLM BEFORE implementing a feature provided:
- Intent behind design decisions (prevents building the wrong thing)
- Known usability concerns to watch for
- Specific feedback from named stakeholders (useful for traceability)

### Pattern 3: Full-page section catalog
Listing ALL sections on a Figma page (not just specific nodes) revealed the complete user journey. Individual node matching misses the workflow context.

### Pattern 4: Persona-informed defaults
Using Catalyst personas to inform empty states, error messages, and information hierarchy made the prototype feel more intentional. Sarah's "5-second rule" is a useful heuristic.

### Pattern 5: Audit existing code first
Running an agent to explore the existing codebase before building revealed that ~40% of "missing" features already existed in some form. Saved significant implementation time.

---

## 5. What Could Be Improved

### For the figma-fq Skill
1. **Auto-detect workflow pages** — skill should list all pages in a file and identify the workflow-focused ones (not just operate on individual nodes)
2. **Batch probe** — run the Deep Instance Probe across multiple nodes in one call instead of one-at-a-time
3. **Token-to-element mapping** — the probe gives tokens and elements separately. A combined output that says "this specific text node uses this specific token" would be more useful

### For the Design Bar Integration
1. **Pre-session summary** — before starting implementation, auto-generate a summary of all Design Bar feedback for the target area
2. **Decision tracking** — extract and catalog every "we should test this" or "let's validate this" statement into a structured list
3. **Visual reference linking** — when Design Bar mentions a specific screen, link it to the Figma node being discussed

### For the Process
1. **Start with a codebase audit** — before any Figma analysis, catalog what already exists
2. **Start with workflow pages** — not individual components. The journey context matters.
3. **Use NotebookLM early** — query Design Bar for each feature BEFORE implementing, not after
4. **Commit incrementally** — checkpoints after each tier prevent losing work if context resets
5. **Document gaps explicitly** — maintain a running "I don't have enough information for X" list

### For the Tools
1. **Figma MCP needs error messages** — silent empty returns are the #1 time waster
2. **Preview tool navigation** — need better support for clicking inside React component trees (AG Grid, flexlayout)
3. **NotebookLM query timeout** — complex multi-part queries fail. Build the skill to auto-split.

---

## 6. Deep Pass: Design-First vs Code-First

### The Insight
The first pass treated the existing prototype code as a constraint and layered Figma designs on top. The second pass inverted this — treating Figma designs and Design Bar sessions as the source of truth and reshaping the code to match.

### What Changed in the Deep Pass

**Design Principle Violations Found:** 5
1. Action buttons in accordion headers (should be in content)
2. Dynamic Assignment using only icon (should use distinct visual container)
3. Activity Log embedded in detail panel (should be separate flex tab)
4. Weak visual breadcrumbs for cross-panel interaction (subtle blue → green accent)
5. Missing "Dismissed/False Positive" status (team consensus in Design Bar)

**Architecture Mismatch Found:** 1 critical
- Rule edit mode was a separate basic form (Bolt architecture)
- Figma shows in-place transformation of the same panel
- Root cause: Bolt's separation of concerns leaked into the prototype

### Figma vs Design Bar Tension
The Transaction workflow screenshots revealed a conflict:
- **Figma design:** Activity Log is an expandable section INSIDE the detail panel
- **Design Bar consensus:** Steve and Benjamin pushed for a SEPARATE panel

Resolution: The prototype now supports the Design Bar approach (separate flex tab) since that's where the team landed after discussion. The inline version was removed. User testing will validate.

### Key Lesson for Future Sessions
> "Don't trust the prototype architecture. Start from Figma and Design Bar as sources of truth. The code is scaffolding to reshape, not a constraint to preserve."

This applies not just to visual matching but to **interaction patterns** — where editing happens, how panels relate, what replaces what. The code architecture implies a user journey; the Figma design defines the actual one.

### Design Principles Extracted (for reuse)
1. Floating modals for data entry (non-blocking)
2. No nested accordions ("accordion inception")
3. Action buttons inside content, not headers
4. Strong visual breadcrumbs for cross-panel interaction
5. Binary AI distinction (sparkle on/off, no middle ground)
6. Distinct visual containers for AI-assigned content
7. Consolidated layout actions under a single menu

---

## 7. Process Deficiency: NotebookLM Missing Chat Communications

### What's Missing
During Design Bar sessions, participants share text messages in Gong/Zoom chat, Slack threads, and async discussions. Only the Gong **audio transcripts** are ingested into NotebookLM — **chat logs, Slack threads, and text-based decisions are not captured.**

### Impact
- Participants type feedback instead of speaking (especially in larger meetings)
- Links to Figma frames, Jira tickets, and references are shared in chat — these are lost
- Side discussions happen in text while the speaker is presenting
- Follow-up decisions in Slack threads after sessions are completely invisible

### Specific Example
Benjamin's team walkthrough video (04/01/2026) references posting a Figma MCP bug fix in a Slack channel and discussing workarounds in chat. None of this context appears in the NotebookLM notebook because it happened in text, not audio.

### Recommendation
1. Export Gong chat logs alongside transcripts and add to NotebookLM
2. Add relevant Slack channel threads as NotebookLM sources
3. Consider a post-session "decision summary" note capturing chat-based decisions
4. Build a `design-bar-sync` skill step that also ingests chat exports

---

## 8. Metrics

| Metric | Value |
|--------|-------|
| Commits on branch | 8 |
| Files changed | 17 |
| Lines added | 700+ |
| Lines removed | 200+ (including Activity Log extraction) |
| New components created | 1 (DeactivateRuleModal) |
| Existing components modified | 8 |
| Types/interfaces modified | 3 |
| Mock data files modified | 2 |
| Figma MCP calls | ~40 |
| NotebookLM queries | ~18 |
| Deep Instance Probe runs | 3 |
| Figma screenshots taken | ~40 (including both workflow page agents) |
| Background agents used | 5 |
| Workflow sections mapped | 52 (20 Rules + 32 Transactions) |
| Coverage of Figma workflows | ~90% |
| Features that already existed | ~40% of initial "gap" list |
| Design principle violations found | 5 |
| Architecture mismatches found | 1 critical |
| Unresolved design decisions documented | 5 |

---

## 7. Artifacts Produced

| Artifact | Location | Purpose |
|----------|----------|---------|
| Deep Instance Probe script | `.claude/skills/figma-fq/assets/deep-instance-probe.js` | Figma Plugin API traversal for opaque instances |
| Updated figma-fq SKILL.md | `.claude/skills/figma-fq/SKILL.md` | Unified probe-first approach, removed complexity tiers |
| DeactivateRuleModal | `src/components/DeactivateRuleModal.tsx` | Rule deactivation/reactivation with period scope |
| Updated types | `src/types/index.ts` | Added Deactivated, Deleted statuses, version fields |
| Updated mock data | `src/data/mock-rules.ts`, `server/db.json` | Version numbers, deactivated rule, deleted transaction |
| This analysis | `knowledge/ai-assisted-prototype-process-analysis.md` | Process documentation |
