# Data Defender: Usability & Customer Validation Testing Plan

**Date:** April 2, 2026
**Author:** Benjamin Ellis, Product Design Manager
**Prototype:** `projects/defender/prototype` (PR #47)
**Status:** Active research planning

---

## Overview

This testing plan defines two parallel research tracks for Data Defender:

1. **Internal Usability Testing** — FloQast employees (many with accounting backgrounds) evaluating core usability, particularly flexbox layout manipulation, panel interconnectivity, and workflow clarity
2. **External Customer Testing** — Beta customers, design partners, and recruited participants evaluating desirability, workflow completeness, and accounting domain fit

Both tracks use the same interactive prototype but ask different questions. Internal testing catches interaction friction before customers see it. External testing validates whether the product concept solves real problems worth paying for.

---

## What We Need to Learn

### Internal (Usability)

| Question | Why It Matters | Risk If Untested |
|----------|---------------|-----------------|
| Can users understand that clicking in one panel updates another panel? | Benjamin and Steve flagged cross-panel mental model as the #1 cognitive risk | Users get confused, lose context, open multiple browser tabs instead |
| Can users customize their layout without feeling like they "broke something"? | Greg Jones warned that layout change warnings create anxiety | Users avoid customization — defeating the purpose of flex layout |
| Do users understand where a newly created rule goes after saving? | Benjamin flagged this during Design Bar — rule appears in a different panel | Users create duplicate rules, can't find what they just made |
| Can users distinguish between transaction status (Open/Investigating/Resolved) and sign-off status? | Benjamin identified conflicting resolution signals | Users don't know which signal to trust, inconsistent completion markers |
| Is the severity slider intuitive for setting rule priority? | Implementation decision #1 — made without Design Bar guidance | Users accidentally change severity without understanding downstream impact |

### External (Desirability & Functionality)

| Question | Why It Matters | Risk If Untested |
|----------|---------------|-----------------|
| Does the rules-based anomaly detection model match how accountants think about controls? | Core product-market fit question | Building rules engine when accountants think in checklists or narratives |
| Are the AI-generated insights (process drift, Benford's law) understood and trusted? | Insights are the differentiation from manual rules | Customers dismiss AI findings as noise, or don't understand the statistical methods |
| Would accountants adopt Suggested Rules, or do they want to build from scratch? | Determines whether AI bootstrapping is a feature or a gimmick | Investment in suggestion engine that users ignore |
| Is the Preparer → Reviewer sign-off workflow natural for anomaly resolution? | Maps to existing accounting close processes | Workflow doesn't match existing organizational hierarchy/process |
| Do controllers need the multi-panel layout, or is a simpler view sufficient? | Steve's data density hypothesis needs validation | Over-engineering the interface for a simpler need |
| Does "Dynamic Assignment" using AI make sense, or do teams want explicit control? | Novel AI feature with no precedent in accounting tools | Feature that sounds impressive but creates distrust in assignment decisions |

---

## Track 1: Internal Usability Testing

### Participants
- 6-8 FloQast employees with accounting backgrounds (PMs, CSMs, internal accounting)
- Sessions: 45-60 minutes each
- Format: Moderated, think-aloud, task-based with the interactive prototype
- Recording: Screen + audio (with consent)

### Environment Setup
- Prototype running at localhost:5173 with API server on :3001
- Default "FloQast Default" layout preset loaded
- Facilitator has `window.__test` access for recovery if participant gets stuck
- Period set to "March 2026" with full mock data (70 transactions, 19 rules, 10 insights)

### Task Scenarios

#### Task 1: Transaction Investigation (Preparer Workflow)
**Persona:** Sarah Chen — Staff Accountant
**Setup:** Default layout, no transaction selected
**Task prompt:** "You've just logged in for your daily close work. You need to find and investigate any transactions flagged as anomalous, then document your findings."

**Steps to observe:**
1. Does the participant scan the Transaction List grid and identify anomaly indicators?
2. Do they click a transaction row? Do they notice the Transaction Details panel updating on the right?
3. Can they scroll through the detail panel to find anomaly cards?
4. Do they understand the status dropdown (Open → Investigating → Resolved)?
5. Can they add a comment explaining their investigation?
6. Do they find and use the sign-off toggle?

**Success criteria:**
- Participant identifies an anomalous transaction within 30 seconds
- Participant changes status AND adds a comment
- Participant completes sign-off without prompting

**Usability signals to watch:**
- Does the participant look for the transaction detail in the wrong panel?
- Do they try to edit the transaction directly in the grid row?
- Do they confuse "status" change with "sign-off"? (Benjamin's conflicting signals concern)
- Do they understand that the green border on the selected row maps to the detail panel?

---

#### Task 2: Cross-Panel Navigation (Flex Layout Mental Model)
**Persona:** David Park — Senior Accountant / Reviewer
**Setup:** Transaction BILL-44100 selected, details showing
**Task prompt:** "You're reviewing this transaction and you notice it was flagged by the 'Missing Department' rule. You want to understand that rule's logic and see if it's flagging too many transactions."

**Steps to observe:**
1. Can the participant find the rule name in the anomaly card and click it?
2. Do they notice the left panel switched from Transaction List to Rule Details?
3. Do they notice the Transaction Details panel on the right STAYED (persistence fix)?
4. Can they find the "Show Anomalies" button to see all transactions flagged by this rule?
5. Can they navigate back to the original transaction?

**Success criteria:**
- Participant clicks rule name without prompting
- Participant notices both panels have relevant content simultaneously
- Participant can return to their original transaction

**Usability signals to watch:**
- Does the participant lose their place when panels update?
- Do they panic when the left panel changes content?
- Do they try to use browser back button instead of tab navigation?
- How many seconds of confusion after the first cross-panel update?

**This is the highest-priority internal test** — Benjamin and Steve specifically called out cross-panel interconnectivity as the biggest cognitive risk.

---

#### Task 3: Rule Creation (Manager Workflow)
**Persona:** Maria Gonzalez — Controller
**Setup:** Rule List tab active
**Task prompt:** "Your team has been manually checking for round dollar amounts over $10,000. You want to create a rule to automate this check."

**Steps to observe:**
1. Does the participant find "Add Rule" button or "Suggested Rules" tab?
2. If they go to Suggested Rules, can they find and adopt "Round Dollar Amount Review"?
3. If they create from scratch, can they use the Rule Creator form?
4. Do they try the AI natural language input?
5. Can they configure the condition builder (field, operator, value)?
6. Do they understand severity (1-5 scale)?
7. Can they assign preparers and reviewers?
8. Do they find and complete the save flow (including period scope)?

**Success criteria:**
- Rule is created with at least one condition
- Participant assigns at least one person
- Participant completes the save modal

**Usability signals to watch:**
- Do they understand what "Add Rule" does vs. "Suggested Rules"?
- When the Rule Creator tab opens, do they understand where they are?
- Is the condition builder (AND/OR, field/operator/value) intuitive?
- Do they understand the severity slider's impact?
- Do they know where the rule went after saving?

---

#### Task 4: Layout Customization (Flex Layout Manipulation)
**Persona:** Any
**Setup:** Default layout
**Task prompt:** "You want to set up your workspace so you can see the rules list and transaction details side by side. You also want to save this layout so you can use it again tomorrow."

**Steps to observe:**
1. Can the participant figure out how to rearrange panels? (drag tabs, resize dividers)
2. Do they find the layout config dropdown (gear icon)?
3. Can they use "Manage Panels" to add/remove panels?
4. Do they understand "Save as New Layout"?
5. Does the layout change warning (if visible) cause confusion or anxiety?

**Success criteria:**
- Participant successfully rearranges at least one panel
- Participant saves a custom layout

**Usability signals to watch:**
- Does the participant try to resize by dragging the divider between panels?
- Do they discover tab dragging (the primary reflow mechanism)?
- Does the gear icon / layout dropdown feel discoverable?
- Greg Jones's warning: does the layout change indicator make them think they "broke something"?

---

#### Task 5: Rule Editing and Version Management
**Persona:** Maria Gonzalez — Controller
**Setup:** Rule "Transaction >$1M" selected in Rule Details (view mode)
**Task prompt:** "The $1M threshold is too low — you're getting too many false positives. Change the threshold to $5M and save it as a new version."

**Steps to observe:**
1. Can the participant find "Edit Rule" button?
2. Do they understand the in-place transformation (view → edit in same panel)?
3. Can they modify the condition value from 1000000 to 5000000?
4. Do they complete the save modal (version increment, period scope)?
5. Can they view the version history dropdown and see the old version?

**Success criteria:**
- Participant edits the condition value
- Participant saves successfully with the version modal
- Participant can view the old version as read-only

**Usability signals to watch:**
- Is the in-place edit surprising or natural?
- Does the save modal feel like friction or valuable confirmation?
- Do they understand version history and why old versions are read-only?

---

### Analysis Framework (Internal)

After each session, score each task on:
- **Task completion rate** (completed / attempted)
- **Time on task** (seconds from prompt to completion)
- **Error count** (wrong clicks, backtracks, dead ends)
- **Confusion events** (verbal "I don't know where to..." / visible hesitation >5 seconds)
- **Satisfaction** (post-task rating 1-5: "How easy was that?")

Aggregate across sessions to identify:
- Tasks with <70% completion = **critical usability issues**
- Tasks with >2 confusion events average = **learnability issues**
- Tasks where participants create workarounds = **conceptual model mismatches**

---

## Track 2: External Customer Testing

### Participants
- 8-12 accounting professionals across segments:
  - 3-4 from existing beta/design partner accounts
  - 3-4 from prospect pipeline (recruited via CSM/Sales)
  - 2-4 from accounting advisory board
- Mix of roles: 4 preparers/staff, 4 seniors/reviewers, 2-4 controllers/managers
- Sessions: 60-75 minutes each
- Format: Moderated, semi-structured — task-based first half, open discussion second half
- Compensation: Gift card + early access commitment

### Session Structure

**Part 1: Concept Validation (15 min — no prototype yet)**
Show a one-page concept brief describing Data Defender. Ask:
1. "Walk me through how your team currently catches errors in journal entries or transactions."
2. "What happens when someone finds something wrong? What's the resolution process?"
3. "If you could automatically flag certain transactions for review, what would you flag?"
4. "How do you currently track which transactions have been reviewed and signed off?"

*Purpose:* Establish baseline. Understand their current process before showing the prototype. Their answers become the benchmark for whether Defender's model fits.

**Part 2: Guided Prototype Walkthrough (25 min)**
Walk through three scenarios, letting the participant drive:

**Scenario A: "Your daily review"**
- Show the Transaction List with anomaly indicators
- Let them explore a flagged transaction
- Watch: Do anomaly types (rule names) make sense? Do they understand what "Missing Department" or "Transaction >$1M" means?
- Ask: "What would you do next with this transaction?"

**Scenario B: "Setting up rules"**
- Show the Suggested Rules page
- Ask: "These are rules the system is suggesting based on your data. Which of these would be valuable for your team?"
- Show the Rule Creator if they want to create a custom rule
- Ask: "Is there a check you do today that you'd want to automate?"

**Scenario C: "Understanding AI Insights"**
- Show the Insights grid
- Explain: "These are patterns the AI detected — things you didn't ask for but might be important"
- Ask: "How useful would this be? Would you trust it? What would you do with this information?"
- Show insight types: Standard Check, Algorithm (Benford's Law), Account Fingerprint
- Ask: "Do these categories make sense? Would you need to understand the methodology?"

**Part 3: Open Discussion (20 min)**
- "How does this compare to your current process?"
- "What would need to be true for you to adopt this?"
- "Who on your team would use this? When during the close cycle?"
- "What's missing that you'd need before going live?"
- "If this existed today, would you pay for it?"

**Part 4: Feature Prioritization (10 min)**
Card sort exercise. Give participant 10 feature cards:
1. Rule-based anomaly detection
2. AI-generated insights (unknown unknowns)
3. Suggested rules based on your data
4. Flexible panel layout
5. Preparer/Reviewer sign-off workflow
6. Dynamic AI assignment
7. Version history for rules
8. Activity log for audit trail
9. Period-over-period trend comparison
10. Conversion of insights to rules

Ask: "Rank these from most to least valuable for your team."

*Purpose:* Forces prioritization tradeoffs. Reveals which features are "must have" vs. "nice to have" from a customer perspective.

### Analysis Framework (External)

**Desirability Signals:**
- Unprompted positive reactions ("Oh, we need this")
- Feature requests that extend existing concepts (vs. rejecting the concept)
- Willingness to participate in beta / pay quotes
- Comparison to manual process: "This would save us X hours"

**Concern Signals:**
- Trust hesitation: "How does it know?" / "What if it's wrong?"
- Process mismatch: "That's not how we work" / "Our auditors wouldn't accept that"
- Complexity pushback: "This seems like a lot to set up"
- Role confusion: "Who would maintain this?"

**Kill Signals (concept-level risks):**
- "We already have controls for this in [ERP/other tool]"
- "Our auditors need [specific format/workflow] that this doesn't support"
- "The team that would use this doesn't have time to set it up"

Score each participant on:
- **Concept fit** (1-5): Does the rules + insights model match their mental model?
- **Workflow fit** (1-5): Does the Preparer → Reviewer flow match their org?
- **Feature desirability** (rank order from card sort)
- **Adoption likelihood** (1-5): "How likely are you to adopt this in the next 12 months?"
- **Key concern** (open text): The single biggest barrier they identified

---

## Prototype Readiness Assessment

### Ready for Testing
| Feature | Status | Notes |
|---------|--------|-------|
| Transaction List + Detail Panel | Ready | 70 transactions, full detail fields, status changes persist |
| Rule List + Rule Details | Ready | 19 rules, version badges, risk scores, assignees |
| Rule Edit Mode (in-place) | Ready | GroupBuilder, AI NL input, severity, save modal |
| Suggested Rules | Ready | 10 categorized rules, anomaly badges, Add Rule flow |
| Insights Grid | Ready | 10 insights, 3 types, AG Grid with filtering |
| Sign-off Workflow | Ready | Toggle, override display, remove signoff modal |
| Comments | Ready | Add, edit, delete, threaded replies |
| Layout Customization | Ready | Manage panels, save/load layouts, drag tabs |
| Deactivation Workflow | Ready | Modal, period scope, reactivation |
| Status Changes | Ready | Open → Investigating → Resolved → Dismissed |

### Known Limitations (brief participants)
| Limitation | Workaround | Impact |
|-----------|------------|--------|
| No real ERP data | Mock data with realistic accounting entries | Low — participants understand prototype context |
| Single period (March 2026) | No period switching | Medium — can't test period comparison workflows |
| No multi-entity | Single subsidiary | Medium — controllers can't test cross-entity views |
| No error modals | Save always succeeds | Low — doesn't affect core workflow testing |
| No real AI | NL input uses pattern matching, not LLM | Low — concept testing, not AI accuracy testing |
| Trend percentages hardcoded | Static +/- values | Low — visual only |

---

## Recommended Sequence

| Week | Activity | Track |
|------|----------|-------|
| 1 | Finalize test scripts, recruit internal participants | Internal |
| 1 | Create concept brief and feature cards for external | External |
| 2 | Run 4 internal sessions (2 per day) | Internal |
| 2 | Begin external recruitment via CSM/Sales/advisory | External |
| 3 | Run remaining 2-4 internal sessions | Internal |
| 3 | Analyze internal findings, prioritize fixes | Internal |
| 3 | Apply critical fixes to prototype | Both |
| 4 | Run 4-6 external sessions | External |
| 5 | Run remaining 4-6 external sessions | External |
| 6 | Synthesize findings, create recommendation deck | Both |

### Deliverables
1. **Internal findings report** — Task completion rates, confusion hotspots, recommended fixes (prioritized)
2. **External findings report** — Concept fit scores, feature priority rankings, adoption barriers, key quotes
3. **Combined recommendation deck** — For product/design/engineering alignment on what to build, what to change, what to cut

---

## Design Bar Concerns to Validate

These specific usability risks were raised during Design Bar sessions. Each maps to a test task:

| Concern | Source | Maps to Task | What We'll Learn |
|---------|--------|-------------|-----------------|
| Cross-panel interconnectivity confusion | Benjamin Ellis | Task 2 | Whether visual indicators (green border, filter pills) are sufficient |
| Layout change warning anxiety | Greg Jones | Task 4 | Whether the config dropdown creates "broke something" feeling |
| Conflicting resolution signals (status vs sign-off) | Benjamin Ellis | Task 1 | Whether users understand the two-layer resolution model |
| "Where did my rule go?" after saving | Benjamin Ellis | Task 3 | Whether tab-based navigation is disorienting after save |
| Data density overwhelming users | Steve Raeder | Task 1 | Whether the flex layout actually helps or just adds complexity |
| Accordion inception / over-designed forms | Tyler Davis | Task 5 | Whether flat sections feel better than nested accordions |
| Screen-locking modals as "dead end alley" | Steve Raeder | Task 3, 5 | Whether save/deactivation modals block too much context |

---

*This testing plan was developed from: Figma design analysis (52 workflow sections), Design Bar NotebookLM transcripts (4+ sessions), Catalyst persona research (Sarah Chen, David Park, Maria Gonzalez), implementation decision log (7 decisions needing validation), and the complete user journey audit (5 journeys, 62 steps).*
