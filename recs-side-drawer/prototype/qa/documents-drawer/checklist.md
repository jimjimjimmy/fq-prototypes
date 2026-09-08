# figma-build checklist - Documents drill-in drawer
Mode: BUILD
Source: Figma fileKey UIaAlxqDouOn9S1oVII9dl, nodeId 8703:50220 (Close-UX-Debt)
Started: 2026-09-08

## Phase 0 - Setup
- [x] Recorded component/asset folder convention (src/components/drawers/, drawers/sections/)
- [x] Identified preview entry file + directory (src/App.tsx)
- [x] Identified styling approach; noted custom theme tokens (Tailwind v4, no config, custom hex values inline)
- [x] Parsed fileKey + nodeId
- [x] Wrote STOP GATE 0 sentence

## Phase 0.5 - Checklist
- [x] Created qa/documents-drawer/
- [x] Wrote this checklist
- [x] Printed checklist path in reply

## Phase 1 - Spec pull
- [x] figma-fetch nodes: FAILED (no local token) -> fell back to Figma MCP get_metadata/get_screenshot/get_variable_defs (declared deviation, see spec doc)
- [x] figma screenshots captured (empty + populated states) via get_screenshot
- [x] Per-element spec written to qa/documents-drawer/specs/documents-drawer.md (exact values, tokens cited)
- [x] STOP GATE 1 satisfied (no "roughly" anywhere except declared badge judgment call)

## Phase 1.4 - Component inventory
- [x] Grepped project for each candidate component (via Explore agent + direct flowui-cache reads)
- [x] Components Referenced table written (REUSE / EXTEND / NEW, every NEW justified) - see below

## Phase 1.5 - Animation spec (skip if none)
- [x] N/A - drawer uses existing SideDrawer + Accordion's own built-in transitions

## Phase 2 - Asset download (skip if none)
- [x] N/A - no new icon assets; reused DeleteOutlined/AttachFileAdd already in the project

## Phase 3 - Implementation
### DocumentsDrawer (empty state)
- [x] Padding traced from spec (Spacing/Padding/16, py-[48px] centered column)
- [x] flex/gap match spec (gap-[8px] column)
- [x] font size/weight match spec (12px medium / 11px regular per tokens)
- [x] colors are exact tokens/hex (#f8fafc bg, #e1e6ef border, #3d7bf7 button)
- [x] interactive states present (Upload Files button, native drag-and-drop via FileUpload.DropZone)

### DocumentsDrawer (populated state)
- [x] Padding traced from spec (px-[16px] py-[12px] file rows)
- [x] flex/gap match spec (gap-[8px] avatar+label, gap-[16px] file row)
- [x] font size/weight match spec (11px label / 12px semibold name / 11px date)
- [x] colors are exact tokens/hex (#424867 text, #6b7280 secondary, #e1e6ef dividers)
- [x] interactive states present (expand/collapse per group, delete per file, verified live)

### Paperclip count badge
- [x] Corrected mid-build: reused IconButton's own numericalIndicator prop (real FlowUI feature, found by reading IconButton/index.js after a custom build crashed with React.Children.only) - not a new component
- [x] colors are exact tokens/hex (IconButton's own NumericalIndicator styling, --flo-base-color-neutral-700 bg)
- [x] interactive states present (0 hides it, verified live at count 6 and 5)

## Phase 4 - Three blocking gates
- [x] GATE 1 structure passed - every element from the populated-state screenshot present (dropzone, 3 "Added by" groups matching count/order, file rows with name+date+trash)
- [x] GATE 2 code passed (at rest AND on interaction) - tsc clean; live-tested expand/collapse, delete, Cancel-discards-delete, Save-persists-delete, cross-page (Reconciliations + Checklist) independence; only pre-existing defaultProps deprecation noise in console (present everywhere else in this app already), no new errors/warnings
- [x] GATE 3 visual passed (side-by-side vs Figma get_screenshot captures) - see DIFF below
- [x] All three ran; none skipped

**GATE 3 DIFF (rendered vs Figma get_screenshot on 8703:50042/8703:50045):**
- Dropzone: matches (dashed border, centered blue Upload Files button, "Or drop file here to upload", helper text)
- Populated file list: matches (dropzone pinned top, "Added by" grouped sections, chevron collapse/expand, file rows with name/date/trash)
- One intentional, declared substitution: Figma's first group is "Michael Scott" (not in this prototype's existing AVATAR_SRC_BY_NAME roster) - substituted with "Elijah Wood" to stay consistent with every other mock person already used in this prototype. Not a fidelity miss, a declared naming decision.
DIFF: none (beyond the declared name substitution above)

## Phase 5 - Pre-commit
- [x] No temp/localhost URLs in committed code (grep clean)
- [x] Zero console errors, zero 404s on reload (only pre-existing defaultProps warnings, confirmed not new)
- [x] build-log.md entry appended
- [x] Committed

## Phase 6 - Follow-ups
- [x] Listed unresolved items for the user (see final chat summary): npm audit vulnerabilities unrelated to this change, and the fq-intl init being a repo-wide gap other prototypes may also hit

### Follow-up (user visual review, annotated screenshot)
User flagged: dropzone/header/row heights too tall, and the collapse chevron
looked like a right-pointing "drill down" caret (reserved elsewhere in this
app for navigation) instead of a real expand/collapse toggle. Re-ran
`get_design_context` on 8703:50044 (succeeded this time - prior timeouts were
transient) and found two real bugs, both the same root cause:
- Dropzone: `FileUpload.DropZone` already applies its own 48px padding/8px
  gap (`FileUpload/index.styles.js`'s `DropArea`) - my own wrapper div added
  a SECOND 48px/8px on top, roughly doubling the box height. Fixed by
  removing the wrapper, letting DropZone's own spacing apply directly to its
  children. Verified: 190px rendered vs Figma's 184px spec (close enough -
  the small delta is the real Button's rendered height vs the spec's
  assumed 40px, not a spacing bug).
- "Added by" trigger row: `Accordion.Trigger`'s own standard-variant CSS
  already applies `12px 16px` padding (`Accordion/index.styles.js`'s Root ->
  Trigger override) - my inner div added ANOTHER `p-[12px]` on top. Verified
  via `getBoundingClientRect()`: 90px rendered before the fix, 66px after
  (Figma spec computes to 64px: 12+40(avatar)+12) - matches within 2px.
- Chevron: `Accordion.Trigger`'s built-in arrow is `KeyboardArrowRight`
  (Accordion/index.styles.js) that rotates 90deg on open - a drill-down
  caret shape, not this app's expand/collapse convention. Figma's own asset
  names for this exact row are `chevron-up-expand-less` (open) /
  `chevron-down-expand-more` (closed) - replaced the built-in arrow (hidden
  via `[&>svg]:hidden` on Trigger) with FlowUI's own `ExpandLess`/`ExpandMore`
  icons swapped on `openGroups.includes(group.addedBy)`.
- File rows: fixed to Figma's exact spec (`h-[60px]`, `p-[12px]`, `truncate`
  instead of wrapping, `w-[96px]` date column, `w-[60px]` delete column) -
  previously auto-height with wrapping text, which is what made rows read
  as inconsistently "tall."
- Avatar: `size="sm"` (28px) -> `size="lg"` (40px), matching Figma's
  `Avatar/Avatar` spec exactly (`sizes` map in `Avatar/index.styles.js`).
- Hover: added `hover:!bg-[#f1f3f9]` to Accordion.Trigger (previously
  transparent at rest with no hover of its own) - trash IconButton already
  had a built-in hover (confirmed via IconButton/index.styles.js), no fix
  needed there.
Re-verified via `getBoundingClientRect()` in-browser (not just a screenshot)
for dropzone/trigger/avatar/file-row heights - all match spec within a few
px. tsc clean, no new console errors.

### Follow-up 4 (regression from Follow-up 3's fix, plus a deliberate width increase)
- **File name still only showed 1 line, garbled/overlapping columns**:
  found via `getComputedStyle()` that my hand-typed arbitrary Tailwind
  properties (`[display:-webkit-box] [-webkit-box-orient:vertical]
  [-webkit-line-clamp:2]`) computed correctly for `-webkit-line-clamp`
  itself, but the real missing piece was `word-break` - these filenames
  have no spaces (only underscores), so without `break-all` the browser
  treats the whole string as one unbreakable "word" and never wraps at
  all, just overflows on one line. Switched to Tailwind's native
  `line-clamp-2` utility (well-tested, avoids hand-typed arbitrary-property
  syntax pitfalls) plus `break-all`. Verified via `getBoundingClientRect()`:
  name span height 40px (exactly 2 lines at 20px line-height), width
  correctly constrained to its column - confirmed genuinely wrapping now,
  not just visually clipped.
- **"Increase the width, read as many characters as possible, but still
  2 lines, use Elijah Wood's column as the guide" - first attempt (rejected
  by user)**: initially widened the whole `SideDrawer` to `width="lg"`
  (760px) plus a fixed `w-[400px]` name column. User immediately corrected:
  "No, same width of side drawer, pls don't stray from my direction" -
  the ask was to widen the NAME COLUMN only, not the drawer itself.
- **Corrected fix**: reverted to the default `SideDrawer` width (no `width`
  prop -> 500px, matching every other drawer in this app). Reclaimed space
  for the name column by trimming the date column (Figma's own spec value
  96px -> 72px, still comfortably fits "MM/DD/YYYY" at 11px) and the delete
  column (Figma's own 60px -> 44px, still a comfortable click target around
  the 16px icon). Widened the name column from Figma's own ~288px spec
  value to a fixed `w-[320px]`, with a `flex-1` spacer added before the
  date/delete columns to keep them pinned to the row's right edge at the
  unchanged drawer width. Verified: drawer still exactly 500px, name column
  320px (up from ~261px), height still exactly 40px (genuine 2-line wrap -
  e.g. "..._Jun_12_2026" / "_95906_AM.xlsx" split across 2 lines for the
  mock 67-char filename) - more readable per line, same overall drawer
  footprint as every sibling drawer.
tsc clean, no new console errors, tooltip-on-hover re-confirmed working at
the corrected width.

### Follow-up 6 (delete icon flush against the right edge, no padding)
Measured via `getBoundingClientRect()`: the row's fixed-width children
(name 320px + date 72px + trash 44px = 436px) plus the row's own 12px/12px
padding and 3x4px gaps totaled 472px - but the bordered group itself is
only 449px wide. Because every column has `shrink-0` (no shrink allowed),
the 23px overflow had nowhere to go except past the row's own right
padding, leaving the delete button flush against the card's border with
zero visible margin. Recomputed to fit inside the real available width with
room to spare: name 320px -> 300px, date 72px -> 68px (still fits
"MM/DD/YYYY" at 11px), trash 44px -> 40px (still a comfortable target
around the 16px icon). Verified via `getBoundingClientRect()`: the delete
button now sits 21px from the card's right edge (vs. 0px before), and the
row no longer overflows its own padding.

### Follow-up 7 ("only 3 recs and checklist accounts have documents")
Every row previously showed the badge (fell back to `MOCK_DOCUMENTS_SEED`
via a shared `defaultDocumentCount` prop) - unrealistic for a demo where
most rows shouldn't have any documents yet. Moved the seed data out of the
per-row fallback entirely: `savedDocumentsByRowKey`'s initial state in
`App.tsx` now pre-populates exactly 3 row keys per table
(`recs-data-0/1/3`, `checklist-data-0/1/2` - verified these are the exact
strings each table's own render loop generates for the first few non-group
rows) with `MOCK_DOCUMENTS_SEED`; every other row key falls through to a
`defaultDocumentCount={0}` (badge hidden, per `IconButton`'s own "0 hides
it" behavior) and `initialDocuments={... ?? []}` (drawer opens genuinely
empty, no accordion groups at all). Verified live: exactly 3 badged rows
per table (screenshot-counted), the group row and every other row show no
badge, and opening an unseeded row's drawer shows only the dropzone with
no file list.

### Follow-up 8 ("make sure the gutter is 24px, looks a bit tight")
No screenshot this time - checked the outer body wrapper's gap against the
literal Figma payload already on file rather than guessing: the "Document"
root container's own spec is `gap-[24px]` (`data-node-id="8703:50044"`),
but the drawer had been built with `gap-[16px]` between the dropzone and
the file list, an undetected deviation from earlier in this build. Changed
to `gap-[24px]`. Verified via `getBoundingClientRect()`: gap between the
dropzone's bottom edge and the first bordered group's top edge is now
exactly 24px (was 16px).

### Follow-up 9 ("are the gaps in between 24px?")
User asked directly whether the gaps BETWEEN the "Added by" group boxes
(not just dropzone-to-list, fixed in Follow-up 8) were also 24px. Measured
via `getBoundingClientRect()`: they were 12px - `Accordion`'s own
`variant="standard"` (the default, unset here) hardcodes `gap: 12px`
between Items (`Accordion/index.styles.js`'s Root). Figma's own "Document"
root treats the dropzone and every "Added by" group as siblings under one
uniform `gap-[24px]` flex column, so the gap between groups should match
the dropzone gap exactly. Added `className="!gap-[24px]"` to the Accordion
root to override the component's own 12px default. Verified via
`getBoundingClientRect()`: all three gaps (dropzone-to-first-group, and
between each pair of groups) now measure exactly 24px.

### Follow-up 2 (user visual review, annotated screenshots)
- **"Outline around the components, remove"**: the single shared
  `border ... rounded-[6px] overflow-hidden` wrapper around the whole
  `<Accordion>` didn't match Figma - each "Added by" group is independently
  bordered (`border-l/r/t rounded-[6px]`), not one continuous frame around
  the whole list. Moved the border to each `Accordion.Item` instead of the
  Accordion root.
- **"Save button should be disabled when nothing's changed"**: added
  `disabled={!hasUnsavedChanges}` to the Save button. Verified live: grey/
  disabled at rest, turns green/enabled immediately after a delete, and
  reverts to disabled after Discard.
- **"Row's border should span the full width" / "too much side padding"**:
  same root cause, found via `getBoundingClientRect()` - `Accordion.Content`
  always wraps children in its own `ContentInner` div, which (at the default
  `variant="standard"`) hardcodes 16px padding on every side
  (`Accordion/index.styles.js`). My file rows were nested a second layer of
  padding inside that, both inflating the horizontal gap AND insetting the
  row's own divider border away from the group's edges. Fixed with a
  `-m-[16px]` wrapper div to cancel ContentInner's padding exactly, then
  applied the row's own `p-[12px]` per Figma spec directly. Verified live:
  bordered-group width 451px vs row content width 449px - the 2px
  difference is exactly the group's own 1px+1px border, i.e. true edge-to-
  edge alignment.
- **"Max line of 2 for file name, tooltip shows full name on hover, doesn't
  need to track the cursor"**: reverted the previous round's single-line
  `truncate` (which was actually wrong against the real spec - the literal
  Figma markup has no ellipsis/nowrap on the filename, it's
  `word-break: break-word`, i.e. it's meant to wrap). Replaced with a
  2-line clamp (`-webkit-line-clamp: 2`) and wrapped the filename in
  FlowUI's real `Tooltip`/`Tooltip.Trigger`/`Tooltip.Content` (added ambient
  `.d.ts` types - this component wasn't previously used in this prototype).
  Confirmed via `CursorTooltip.tsx`'s own doc comment that FlowUI's real
  Tooltip anchors to the trigger element's bounding box (not the live
  cursor) - exactly "where the cursor is, doesn't have to move with it."
  Verified live: hovering a filename shows the full name in a dark tooltip
  bubble positioned at the row, not tracking the mouse.
tsc clean, no new console errors (only the same pre-existing defaultProps
deprecation noise present everywhere else in this app).

### Follow-up 3 (regression from Follow-up 2's Tooltip wrap - user caught immediately)
Wrapping the filename in `Tooltip`/`Tooltip.Trigger` broke the row's 3-column
layout entirely - date and trash disappeared, the name overlapped where they
used to be. Root cause: `Tooltip.Trigger` renders `RadixTooltip.Trigger
asChild` around an internal `Styled.TriggerWrapper` div hardcoded to
`width: fit-content` (`Tooltip/index.styles.js`) - not reachable via any
prop. Putting `flex-1 min-w-0` on the filename `<span>` INSIDE that wrapper
had no effect on the row's flex layout, since `TriggerWrapper` (not the
span) is the actual flex child, and its `fit-content` sizing let it - and
its unwrapped-in-the-DOM content - spill across the row rather than
constraining to the available column width. Fixed by moving `flex-1
min-w-0 overflow-hidden` onto a wrapper div OUTSIDE the `<Tooltip>`, so that
div (not TriggerWrapper) participates correctly in the row's flex layout;
`overflow-hidden` clips any residual overflow from the fit-content wrapper's
own sizing quirk. Verified via `getBoundingClientRect()`: name/date/trash
columns now sit side by side with clean 4px gaps (matching the row's own
`gap-[4px]`) and zero overlap. Tooltip on hover re-confirmed working.
