# Component patterns — for designers adopting this prototype

A catalog of reusable patterns from the `coso-ai-rcm` prototype, with file paths and brief notes on how to lift them into another project. The stack is **Vite + React + TypeScript + Tailwind v4 + Radix + animejs + howler** — same toolkit as `recs-multicurrency` and `detect-prototype`, so anything here drops cleanly into a sibling prototype.

If you only have 30 seconds: clone the repo, `cd projects/coso-ai-rcm/prototype && npm install && npm run dev`. The patterns below are file-and-line references — copy what you need.

---

## Three ways to adopt

### A. Fork a sibling prototype
Easiest path. Run `/new-project` to scaffold a new `projects/<your-name>/` with the same conventions, then copy the specific views/components you want. The shared `flow-ui-design-system` skill works the same way it does here.

### B. Lift specific files into your own project
Each view in `prototype/src/views/` is self-contained — minimal cross-imports beyond `data/` and `lib/sounds`. Drop a view into your project, swap the data imports for your own, and adjust copy.

### C. Push back into Figma
The repo's `figma-fq` skill captures the running prototype as a Figma frame. From any view: `/figma-fq`. Useful when you want a Figma surface to riff on — design changes can come back into the prototype later via the same skill.

---

## Layout patterns

### Catalyst-styled sidebar (`src/layout/SectionNav.tsx`, `src/layout/IconRail.tsx`)
The dark-green FloQast nav matches the catalyst project's sidebar. Tokens at the top of `SectionNav.tsx`:
```ts
const GRADIENT = 'linear-gradient(180deg, #014a3d 0%, #00332a 100%)'
const BORDER = '#1d583f'
// hover: bg-[#027965]/40
// active: bg-[#027965]/55
// item text: text-[#f3faf4]
// muted section header: text-[#769583]
```
Two-column shell: 60px icon rail + 240px section nav. Section nav driven by `src/data/nav.ts` — add an item id, then map it to a view in `itemToView`.

### App shell that locks the sidebar to the viewport (`src/layout/AppLayout.tsx`)
Outer is `h-screen overflow-hidden`. Sidebars get `h-screen`. Main is `flex-1 flex flex-col overflow-hidden` with the scrolling content inside `flex-1 overflow-y-auto`. Page never scrolls; only the inner content does.

### Global search toolbar with AI assistant dialog (`src/layout/SearchToolbar.tsx`)
48px sticky bar at the top of the main content. Holds a 530px search input with a magnifying glass on the left and a green "Ask FQ AI" pill on the right. The AI button opens a Radix Dialog with:
- Query input + Ask button
- Suggested prompts as chips → tailored fake results
- Result block (intro + bullet list with icons + follow-up chips)
- Generic fallback for free-form queries

Adopt this pattern when you want a "press / to query the data" affordance without building a full assistant.

---

## Page patterns

### KPI chip strip with click-to-filter / click-to-navigate
Two flavors live in the prototype:

- **Click-to-navigate** (Agent details Overview, `src/views/AgentDetails.tsx` ~ line 220): each chip is a `<button>` that switches the active tab via a controlled Radix Tabs state. Hover reveals an `ArrowRight` icon to telegraph clickability.
- **Click-to-filter** (Tests, Gaps): each chip toggles a filter state local to the view; active chip gets a darker border + shadow.

Both use the same chip shape: white card, 4px colored left border accent (indigo / amber / emerald / red — pass-rate colors are dynamic), `border-l-4 border-l-emerald-500` style, label small caps muted, value bold.

### 70/30 responsive column split (`src/views/AgentDetails.tsx` Overview)
`grid-cols-1 lg:grid-cols-10` with `lg:col-span-7` (focus column) + `lg:col-span-3` (context column). Below `lg` they stack. Inside the focus column, dependency cards stack at `md:grid-cols-2`.

### Three-column master/detail/detail (AI risk assessment tab)
Capability → Risks → Mitigating controls. `grid grid-cols-3 border border-gray-200 rounded-xl overflow-hidden bg-white`. Each column has its own `ColumnHeader` with title, subtitle, and optional action button. Selection state lifts to the panel; first-of-each-group gets a soft emerald tint.

### Flat read-only matrix with rowspan (`src/views/AICapabilities.tsx`)
For when you want a lookup table instead of a master/detail. 5-column table with rowspan on Capability and Risk cells so each (capability, risk, control) triple is its own row but the headers merge. Build the row data as a flat array first, then render — rowspan logic stays simple.

### Cross-agent table view (`src/views/Tests.tsx`, `src/views/KeySystems.tsx`)
Header + KPI strip + filter chips + search + table. Standard pattern: 12-column auto sizing, `border-collapse`, header bg-gray-50, rows with `hover:bg-indigo-50/30`, status dots / colored pills in cells. Each row's first cell can host a colored status indicator.

### Card-based list (Gaps, `src/views/Gaps.tsx`)
For items where the description matters. Each card has a colored severity bar on the left, title with severity + status pills + id, description paragraph, inline metadata fields, and a recommended-action callout in the brand color. Better than a table when you have 5–20 items with rich context.

---

## Component patterns

### Status pills with consistent palette
The prototype uses one palette across reliance, severity, status, results:
```
emerald  →  good (Reliable, Effective, Pass)
amber    →  warning (Needs review, In progress, Awaiting result, Medium)
red      →  bad (Not reliable, Ineffective, Fail, High, Overdue)
indigo   →  info (Pending review, Compliant alt)
gray     →  neutral (Out of scope, Not started, Closed, Low)
```
Defined per view as `Record<X, string>` maps; could be lifted into a shared file if needed.

### Stage tags (`AICapabilities.tsx`, `AgentDetails.tsx`)
COSO control stages with their own colors:
```
Design-time     →  violet
Runtime / HITL  →  amber
Post-run        →  sky
Monitoring      →  emerald
Change mgmt     →  indigo
```

### Up Next gradient card (`src/views/AgentDetails.tsx`)
Indigo → violet gradient card holding AI-surfaced tasks. Each task is a 2-column tile inside the card with a small severity dot, title, and due date. Used inline on the agent overview to draw the eye without breaking the white-card rhythm.

### Edit mode toggle on a list (`src/views/AgentDetails.tsx` risk + control columns)
Pattern: small kebab next to the list's primary CTA → opens a Radix DropdownMenu with a single "Edit" toggle. While editing, each row swaps from a button-shaped row to a flex container with `GripVertical` on the left + `Trash2` on the right. Toggling again returns to read mode.

### Dependency cards (Agent details Overview)
Two-column "Dependent on / Depended on by" view. Each item: code (mono), title, description, status pill on the right. Uses the same status palette as the tables.

### KPI cards as filter buttons (Gaps, Tests)
Same chip shape but with active state styling — when a filter is active, the chip border darkens and a subtle shadow appears. Click again on the same chip / "All" to reset.

### Notification badges (sidebar + tab + row)
Three layers used together for the new-from-Transform alert:
- **Sidebar item badge** — colored circle with count next to a nav label (`SectionNav` accepts a `badge` prop pattern)
- **Tab count badges** — neutral count + colored "X new" badge alongside the tab label (`KeySystems.tsx` TabTrigger)
- **Row pill** — small "NEW" pill next to the agent name; reliance cell shows "Awaiting review" instead of the standard pill
- **Callout banner** — full-width amber callout at the top of the agent overview when `agent.isNewFromTransform` is true, with a primary CTA that jumps to the relevant tab

Pick the layers you need depending on how prominent the alert should be.

---

## Motion + sound

### anime.js stagger entry (`src/views/Home.tsx`, `src/views/AgentDetails.tsx` Overview)
Entry animations on first render with `easeOutExpo`, staggered between elements. **Always include a `document.hidden` fallback** that snaps to final state — the FloQast preview tool runs the page in a hidden tab where `requestAnimationFrame` is throttled, and anime.js stalls without it.

### howler click chime (`src/lib/sounds.ts`)
Centralized `Howl` instance plays a tiny click on every navigation. Wrap any `onClick` with `() => { click.play(); doThing() }`. The asset (`public/sounds/click.wav`) is a generated 50ms tone; swap it for any audio file you prefer.

---

## Data patterns

### Mock data files (`src/data/`)
- `agents.ts` — 8 sample agents with realistic metadata (owner, capabilities, reliance, frequency, health, gaps, isNewFromTransform)
- `risks-controls.ts` — the canonical 8-capability COSO library + per-agent rich detail for the AP Accruals Drafter
- `compliance-tasks.ts` — 12 cross-agent tests with cadence, owner, last run, due date
- `gaps.ts` — 5 mock gaps with severity, assignee, deadline, recommended action
- `nav.ts` — sidebar structure

If you want to fork the prototype, these are the files to swap. Most views accept their data via imports, not props, so you can edit in-place.

### Per-session state for prototype interactivity
For things that should "work" in the demo but reset on reload:
- Custom risks added via the dialog (`customRisks` state in AgentDetails)
- Deleted risks/controls in edit mode (`deletedRiskIds` / `deletedControlIds` Sets)
- Selected capability + risk in the master/detail (`selectedCapability`, `selectedRiskId`)
- Active tab when KPI chips drive navigation (`activeTab`)

Pattern: lift state up to the component that owns the relevant scope, derive everything else with `useMemo`.

---

## Design tokens reference

### Sidebar tokens (Catalyst green)
Already documented above under "Catalyst-styled sidebar."

### FloQast accent green for primary CTAs
```
bg-[#1fac76]      hover:bg-[#186749]   text-white
```
Used by "New agent", "Schedule test", and the Ask button in the AI assistant dialog. The FQ AI sparkle button uses a softer pair: `#dff5e9` bg, `#1a7b4b` icon.

### Tabs (FloQast design system)
```
inactive:  text-gray-500
hover:     text-gray-900
active:    text-gray-900 + border-b-2 border-[#186749]
```

### Standard outlined secondary button
```
text-xs font-medium text-gray-600 hover:text-gray-900
px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300
```
Used for "Filter", "Map control", "Add risk".

---

## Quick reference: where to find something

| Pattern | File |
| --- | --- |
| Sidebar nav structure | `src/data/nav.ts` |
| Sidebar visual treatment | `src/layout/SectionNav.tsx`, `src/layout/IconRail.tsx` |
| App shell (locked sidebar) | `src/layout/AppLayout.tsx` |
| Search toolbar + AI dialog | `src/layout/SearchToolbar.tsx` |
| Home hero with stagger entry | `src/views/Home.tsx` |
| Agent inventory table | `src/views/KeySystems.tsx` |
| Agent details (5 tabs) | `src/views/AgentDetails.tsx` |
| AI risk assessment 3-column | `src/views/AgentDetails.tsx` `RiskAssessmentPanel` |
| Add Risk dialog | `src/views/AgentDetails.tsx` `AddRiskDialog` |
| Edit-mode kebab + drag/delete | `src/views/AgentDetails.tsx` `ListKebabMenu` |
| Tests orchestration | `src/views/Tests.tsx` |
| Gaps remediation tracker | `src/views/Gaps.tsx` |
| Read-only matrix (rowspan) | `src/views/AICapabilities.tsx` |
| KPI chip with filter / nav | All four list views above |
| Click sound | `src/lib/sounds.ts` |
| Mock agents | `src/data/agents.ts` |
| Mock risks/controls/library | `src/data/risks-controls.ts` |

---

## Pull request workflow for adopting this prototype

If you want to use this directly as the base for your own work:

1. Run `/new-project` (or copy `projects/coso-ai-rcm/` to a new directory)
2. Pull what you need: copy individual files from `prototype/src/views/` and `prototype/src/data/`
3. Run `npm install && npm run dev` from your new prototype's `prototype/` folder
4. Iterate locally
5. When ready, run `npm run build` to regenerate `docs/projects/<your-name>/`
6. Commit + push your project branch and PR into main — GitHub Pages picks it up automatically

For any questions on the patterns above, ping me (Martin Mijares) — happy to walk through them.
