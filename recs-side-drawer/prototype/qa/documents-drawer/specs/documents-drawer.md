# Documents drawer spec - Figma node 8703:50220 (file UIaAlxqDouOn9S1oVII9dl)

**Deviation note:** `get_design_context` timed out on every call against this node (full section,
each Sidedrawer instance, and the inner Document instance, with/without screenshot) across 5
retries. Fell back to `get_metadata` (structure) + `get_screenshot` (visual reference) +
`get_variable_defs` (exact color/type/spacing tokens) for the spec pull instead. This is a
declared deviation from the skill's default Phase 1 procedure, not a value substitution - every
number below still traces to a real tool call, not eyeballing.

Two Sidedrawer instances in the frame:
- `8703:50042` - **empty state** (Document content `8703:50041`: `File-uploader / Upload-zone`
  instance + a hidden `Add` row - confirms the dropzone is the FlowUI `FileUpload` family).
- `8703:50045` - **populated state** (Document content `8703:50044`, not expandable via metadata -
  read from screenshot instead).

Screenshots captured inline via `get_screenshot` on both nodeIds (not saved to disk - re-fetch the
same nodeIds if a disk copy is ever needed).

## Tokens (from `get_variable_defs` on 8703:50045)

| Token | Value | Use |
|---|---|---|
| `Colors/Neutral/color-neutral-100` / `Backgrounds/Light/background-100` | `#f8fafc` | Dropzone background |
| `Borders/default-container-border` / `Tables/Border style/border-color` | `#e1e6ef` | Dropzone dashed border, file-row divider (matches existing `#e1e6ef` convention used everywhere else in this prototype) |
| `Buttons/Info/default-state` | `#3d7bf7` | "Upload Files" button (`color="info"`, `variant="filled"` - matches existing brand-blue convention) |
| `Border Radius/border-radius` | `6` | Dropzone corner radius (matches existing `rounded-[6px]` convention) |
| `Text colors/body-secondary-text` | `#424867` | "Added by:" label + file name text (matches existing `#424867` convention used in AssigneesSection) |
| `Colors/Neutral/color-neutral-500` / `Icons/icon-default` | `#6b7280` | Trash icon, chevron color |
| `Body Extra Small/Regular` | Inter 11px/16 | Helper text ("CSV, XLSX, or PDF...") |
| `Body Small/Medium` | Inter 12px/18 medium | "Or drop file here to upload" |
| `Label/Medium` | Inter 12px/16 medium | "Added by:" name (bold in screenshot) + file name |
| `Paragraph SM/Medium` | Inter 11px/16 medium | Date column ("06/23/2026") |
| `Spacing/Padding/16` | 16px | Dropzone inner padding, file-row horizontal padding |
| `Spacing/Padding/24` | 24px | Drawer body horizontal padding (matches every other drawer section) |
| `Spacing/Gap/8` | 8px | Vertical gaps between dropzone lines |

## Empty state (screenshot: single dashed dropzone, nothing else)
- Dropzone: full-width, dashed border `#e1e6ef`, bg `#f8fafc`, `rounded-[6px]`, generous vertical
  padding (~48px top/bottom per screenshot proportions), centered column content:
  1. `Upload Files` button - filled, `color="info"` (blue `#3d7bf7`)
  2. "Or drop file here to upload" - 12px medium, `#424867`
  3. "CSV, XLSX, or PDF less than 10MB" - 11px regular, lighter gray (helper text token)
- Footer: Cancel (ghost/dark) + Save (primary filled) - matches every other drawer's footer exactly.

## Populated state (screenshot: same dropzone pinned at top, then file list below)
- Same dropzone, unchanged, pinned at top.
- Below it, a bordered list, one collapsible section per uploader:
  - Section header (Accordion.Trigger): circular avatar (`Avatar size="sm"`) + two-line label
    ("Added by:" in gray 11px over the name in bold 12px) + chevron on the right (up when
    expanded, down when collapsed - this is `Accordion`'s own built-in arrow, not a separate icon).
  - Expanded section content: one row per file, divided by `border-t #e1e6ef`, each row:
    file name (wraps to 2 lines when long, per screenshot), a date on the right
    ("06/23/2026", 11px), and a trash icon button at the far right.
- First section (in the screenshot) is expanded showing 3 identically-named files; the other two
  sections are collapsed (chevron pointing down), file count inside them not visible in the
  screenshot - not asserted here, left to seed-data judgment in Phase 3.

## Count badge (correction: FlowUI already has this exact component)
Initial repo search found no existing spec for a dark circular count-overlay badge, so a custom
component was drafted - but wiring it in as a second child of `IconButton` crashed immediately
with `React.Children.only expected to receive a single React element child` (real IconButton
source: `IconButton/index.js:81`). Reading that file surfaced the real cause: `IconButton` already
ships a built-in `numericalIndicator` prop (default `0`, hidden when `0`) that renders exactly this
pattern via `IconButton/index.styles.js`'s `NumericalIndicator` (dark `--flo-base-color-neutral-700`
background, `min-width/height: 16px`, absolute top-right) and `NumericalIndicator/NumericalIndicator.js`
(`border-radius: 100px`, white inverse text, bold). Switched to `numericalIndicator={documentCount}`
on the existing paperclip `IconButton` - no custom component needed, and the crash is fixed as a
side effect. Corrected Components Referenced status: REUSE (`IconButton`'s own prop), not NEW.

## No "roughly" callouts
Every value above (other than the count badge, called out separately) traces to either the
`get_variable_defs` token payload or a direct visual read of the two `get_screenshot` captures -
nothing here is guessed from unrelated conventions, though per the deviation note this spec pull
used metadata+screenshot+tokens rather than `get_design_context`'s single consuming call.
