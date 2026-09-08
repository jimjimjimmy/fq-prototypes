# Defender Figma Alignment — Session Plan

**Branch**: `defender/figma-alignment-checkpoint`
**Figma file**: `HkEqjwX3CjTWqinuISZYvV`
**Full screen node**: `26:17841`
**Figma URL**: `https://www.figma.com/design/HkEqjwX3CjTWqinuISZYvV/Untitled?node-id=26-17841`

This is a complete, self-contained plan for a single session. Start here. Work top to bottom.

---

## Why This Session Exists

Previous figma-match passes made changes that didn't produce measurable visual progress. Root causes documented in `figma-alignment.md`:

1. No visual baseline before making changes — working blind
2. Patching CSS on structurally wrong markup — never converges
3. FlowUI components recommended without verifying what they render
4. Mock data gaps mistaken for style gaps
5. Component-level scope when the real differences are screen-wide

This session uses a different approach: **zone-by-zone with screenshot comparison at every step**.

---

## Setup (Do First)

```bash
# Make sure you're on the checkpoint branch
git checkout defender/figma-alignment-checkpoint

# Start the dev server
cd projects/defender/prototype
npm run dev
```

Load the prototype in the browser. Select a transaction with anomalies (CHK-5621 or BILL-44021).

---

## Step 1: Establish Visual Baseline

**Before touching any code**, do this:

1. Take a screenshot of the full prototype (the whole browser window)
2. Run this Figma MCP call to get the reference screenshot:
   ```
   get_screenshot(fileKey: "HkEqjwX3CjTWqinuISZYvV", nodeId: "26:17841")
   ```
3. Put both screenshots side-by-side
4. Score each zone below as ✓ / ✗ / ~ before starting any fixes

**Zone Scorecard** (fill in at session start):
```
Zone 1: Top Nav          [ ]
Zone 2: Left Sidebar     [ ]
Zone 3: Tab Strip        [ ]
Zone 4: AG Grid          [ ]
Zone 5: Status Row       [ ]
Zone 6: Details Section  [ ]
Zone 7: Anomalies        [ ]
Zone 8: Comments         [ ]
Zone 9: Activity Log     [ ]
```

Target by end of session: **7 of 9 zones at ✓**

---

## Step 2: Build the Figma Node Map

Run in parallel:
```
get_metadata(fileKey: "HkEqjwX3CjTWqinuISZYvV", nodeId: "26:17841")
get_metadata(fileKey: "HkEqjwX3CjTWqinuISZYvV", nodeId: "26:17927")  ← Transaction Details panel
```

From the metadata output, identify node IDs for:
- Top nav frame
- Status row frame
- Details section frame
- Anomalies section (known: `26:29851`)
- Comments section frame
- Individual comment item frame
- Activity Log frame

**Known opaque node — NEVER call `get_design_context` on this directly:**
- `26:17929` — Transaction Details component instance. Its metadata returns empty. Always use sublayer IDs.

Store identified node IDs in this file as you find them.

---

## Step 3: Fetch Design Context (All Zones in Parallel)

Once node IDs are mapped, fetch design context for all zones in one parallel batch:
```
get_design_context on: status row node
get_design_context on: details section node
get_design_context on: 26:29851 (anomalies/comments — already know this one)
get_design_context on: comment item node
get_design_context on: top nav node
get_screenshot on: 26:17841 (if not already done in Step 1)
```

---

## Step 4: Fix Zones in Priority Order

Work through these one at a time. After each fix: refresh browser, screenshot, re-score that zone.

---

### Zone 5: Status Row ← START HERE (highest visual impact)

**Current**: "Status" text label + `<select>` element with colored background
**Figma**: "Status Open ∨" — a single colored badge/chip with the dropdown chevron inside it
**File**: `src/components/DetailPanel.tsx`

What to look for in the design context output:
- What component/element wraps "Status" + the colored chip?
- What is the padding, border-radius, font-weight on the chip?
- Does the chevron live inside the chip or next to it?

Approach: Replace the native `<select>` with a custom `<div>` styled as a badge, using a `<button>` trigger for the dropdown. Keep the same color logic (`currentStatusColors.bg`, `.text`). Match exact padding/radius from Figma.

---

### Zone 7: Anomalies ← CHECK FIRST, MAY ALREADY BE CLOSE

**Recent fix**: `maxWidth: 460` was added to anomaly cards (last session).
**Verify**: Do the cards now stop at 460px or do they still stretch?

Remaining gap: **Avatar colors**
**Current**: FlowUI `<Avatar>` with no color prop — renders gray by default
**Figma**: Avatars are colorful per-user (green, teal, orange)
**File**: `src/components/DetailPanel.tsx`

Fix: Add a deterministic color mapping. Hash the user's name to one of 6–8 FlowUI-compatible avatar colors, or use a static map for the known USERS list from `src/data/constants.ts`.

Check FlowUI Avatar props: does it accept a `color` prop? Run:
```
get-component-info("Avatar")
```

---

### Zone 8: Comments ← DATA GAP + STRUCTURAL VERIFY

**Problem A — Mock data gap**:
The selected transaction `CHK-5621` (which the prototype screenshot shows) has 0 mock comments. Figma shows 2 comments. Before judging the comment UI's styling, add mock comments to CHK-5621 in `src/data/constants.ts` (or wherever anomaly/comment data lives).

Add at minimum:
- 1 top-level comment with a body and timestamp
- 1 nested reply

**Problem B — Structural verify**:
Once data is populated, compare the rendered comment UI against Figma:
- Does each comment show: avatar + name + timestamp + body?
- Are there edit/delete icon buttons visible (pencil + trash)?
- Is the timestamp formatted as "Feb 3, 2026 | 1:18 PM"?
- Does the reply area show: avatar + textarea + "Send" button?

**File**: `src/components/DetailPanel.tsx` (comment render), `src/data/constants.ts` (mock data)

---

### Zone 6: Details Section

**Gap A — Fields button over-styled**:
**Current**: `<Button variant="outlined" color="dark" size="sm">Fields <ExpandMore /></Button>`
**Figma**: Plain text button/link, no visible border
**Fix**: Change to a ghost/text style button or plain `<button>` with text styling

**Gap B — Field column count**:
**Current**: ~3 fields per row (driven by `w-[236px]` on each field item)
**Figma**: ~4-5 fields per row (wider layout)
**Fix**: Reduce per-field width from `w-[236px]` to something like `w-[180px]` or `w-[200px]`, or change the grid container. Confirm exact values from design context.

**Gap C — Transaction ID field value**:
**Current**: Plain text value
**Figma**: Value + external link icon (OpenInNew)
**Fix**: For the Transaction ID field specifically, render `value + <OpenInNew size={12} />` inline

**File**: `src/components/DetailPanel.tsx`

---

### Zone 4: AG Grid

**Gap A — Odd-row striping**:
**Current**: `oddRowBackgroundColor: 'rgba(33, 150, 243, 0.08)'` in `defenderGridTheme`
**Figma**: No alternating row colors visible in reference screenshot
**Fix**: Remove `oddRowBackgroundColor` from the theme params (or set to `undefined`/`'transparent'`)
**File**: `src/components/TransactionGrid.tsx`

**Gap B — Horizontal scroll**:
**Current**: Prototype shows no horizontal scrollbar
**Figma**: Horizontal scrollbar visible at bottom of grid
**Check**: Is the grid container set to `overflow: hidden`? The `AllTransactionsView` or its parent may be clipping. Allow `overflow-x: auto`.

**Gap C — Transaction ID link icon**:
**Current**: `<OpenInNew>` only shows on the selected row
**Figma**: External link icon visible on more rows
**Check Figma**: Is the icon shown on ALL rows or just rows that are hovered? If hover-only, the current implementation may be correct and just needs hover state added.

**File**: `src/components/TransactionGrid.tsx`, `src/components/AllTransactionsView.tsx`

---

### Zone 3: Tab Strip

**Current**: 5 tabs (Transaction List, Rule List, Rule Details, Rule Creator, Suggested Rules)
**Figma**: 1 tab ("Transactions ×")

**Important**: This may NOT need fixing. Figma shows the "Transactions Focused" layout preset where extra panels are hidden. Check `src/data/constants.ts` — look for `PRESET_VIEWS`. If "Transactions Focused" is a named preset that hides the extra tabs, the prototype behavior may be correct (user can switch to that layout). Only "fix" this if the prototype doesn't support that layout mode at all.

---

### Zone 1: Top Navigation Bar

**Gap A — Period selector**:
**Current**: Calendar icon button (no dropdown)
**Figma**: "February 2026 ∨" — dropdown chip/badge
**File**: `src/components/TopNavbar.tsx`

**Gap B — Layout / Panels controls**:
**Current**: Not present
**Figma**: "Layout: Transactions Focused ∨" dropdown + "Panels" button
**Note**: These are functional controls in the Figma — they change which panels/layout are visible. They likely hook into the flexlayout state in `App.tsx`. This may require App-level callback wiring. Scope this as "add visual chrome, wire up later if time permits."

---

### Zone 2: Left Sidebar
Defer to end — likely close. Only fix if score is ✗ after initial screenshot comparison.

### Zone 9: Activity Log
Defer to end — both show collapsed state, likely matches.

---

## Step 5: Update figma-match Skill

After fixing all prioritized zones, update `SKILL.md` with the 5 gaps found this session.
File: `.claude/skills/figma-match/SKILL.md`

### Add: Step 0 — Visual Baseline (insert before Step 1 in skill)

```markdown
### 0. Establish visual baseline (mandatory)

Before any MCP calls or code reading:
1. Run `get_screenshot` on the Figma node
2. Ask the user for a current screenshot of the prototype
3. Annotate visible differences by zone — list each UI region and whether it matches
4. Only then proceed to MCP deep-fetch

**Why**: Every diff plan that skips this step risks making changes that are correct in isolation but wrong for the visible state of the prototype.
```

### Add: Screen Mode gate (insert in Step 2.6 area)

```markdown
### 2.6b. Screen Mode gate

After `get_metadata`, check if the root node is a full screen frame (FRAME type, width ≥ 1200px or children spanning the full viewport). If yes:
- Switch to **Screen Mode** — work zone-by-zone
- Create a zone scorecard (list each major UI region with ✓/✗/~)
- Fix zones in order of visual impact, re-scoring after each fix
- Do NOT attempt to fix all zones in a single diff plan
```

### Add: Structure Match Gate (in Step 4 Phase A)

```markdown
**Structure Match Gate (mandatory before proposing CSS changes)**:
Compare DOM hierarchy between Figma and current code. If the nesting structure doesn't match:
- Classify as **structural rebuild** (not CSS patch)
- Output the corrected JSX skeleton first
- Then layer CSS values onto the correct structure

CSS patches on structurally wrong markup never converge — they make individual properties correct while the overall layout remains wrong.
```

### Add: Mock Data Audit (in Step 4.7)

```markdown
**Mock data audit (add to Functional behavior audit)**:
For each content section (comments, activity log, anomaly cards, etc.), cross-reference with the mock data for the currently selected item. If a section appears empty:
1. First check whether mock data exists for that item — this is a **data gap**, not a style gap
2. Only diagnose styling issues after confirming data is present
3. Flag data gaps separately from style gaps in the diff plan
```

### Elevate: FlowUI visual verification (in Common Pitfalls)

Move the Accordion/visual-verification pitfall from the buried "Common Pitfalls" section to a mandatory checkpoint in Step 3.5:

```markdown
**FlowUI visual verification checkpoint (mandatory)**:
For any FlowUI component swap, before including it in the diff plan:
- Run `get_screenshot` on the Figma component to see what it renders visually, OR
- Confirm from prior knowledge what the component renders (e.g., Button, Avatar are well-known)
- Do NOT recommend a FlowUI component based solely on prop list similarity

The Accordion pitfall: `variant="standard"` adds a bordered container not visible in the Figma. Prop names do not reveal rendered output.
```

---

## Step 6: Commit and PR

After session work is done:

```bash
git add [modified files]
git commit -m "feat: defender figma alignment pass — zones 4-8

Zone-by-zone alignment against Figma node 26:17841. Fixes status row badge,
anomaly card width, avatar colors, comment mock data, and grid row striping.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

Update the zone scorecard in this file with final scores.

---

## Reference: Files and Their Zones

| File | Zones |
|---|---|
| `src/components/DetailPanel.tsx` | 5 (status), 6 (details), 7 (anomalies), 8 (comments), 9 (activity log) |
| `src/components/TransactionGrid.tsx` | 4 (grid theme and cell renderers) |
| `src/components/AllTransactionsView.tsx` | 4 (grid container/scroll) |
| `src/components/TopNavbar.tsx` | 1 (top nav) |
| `src/components/SideNavbar.tsx` | 2 (sidebar) |
| `src/App.tsx` | 3 (layout/tabs), wiring for Zone 1 controls |
| `src/data/constants.ts` | 8 (mock comments for CHK-5621) |
| `.claude/skills/figma-match/SKILL.md` | Skill improvements (Step 5) |

## Reference: Known Figma Nodes

| Zone | Node ID | Notes |
|---|---|---|
| Full screen | `26:17841` | Root — `get_metadata` here first |
| Transaction Details panel | `26:17927` | Panel wrapper |
| Transaction Details component | `26:17929` | **OPAQUE** — never `get_design_context` directly |
| Anomalies + Comments section | `26:29851` | Known good — full design context available |
| Other zones | TBD | Map via `get_metadata` on `26:17841` |
