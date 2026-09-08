# Project Catalyst

## Overview
Project Catalyst is a UX redesign initiative for FloQast Close — rethinking navigation, task management, and AI integration. It includes a working React/TypeScript prototype and deep research into FloQast's current architecture, personas, and data model.

## Goal
Demonstrate a task-centric UX vision for FloQast Close at FQGO Spring 2026, moving away from the folder-centric model toward search-first navigation, rich task drill-downs, and integrated AI assistance.

## Contributors
- @bellis (Product Design Manager, project lead)

## Status
Phase: prototyping
Started: 2026-02-01

## Design System
Status: hybrid
Notes: Prototype uses shadcn/ui components (src/components/ui/) styled to approximate FlowUI patterns. Not directly importing FlowUI — this is an exploration prototype.

## Figma Files
- Recs AG Grid page layout:  `IROzHx3l0JXxVpYeCBPlxB`  node `5002:36880`
- AG Grid design system:     `HTRkotXIS3qOvr7JEOR2eJ`  node `240:1170531`
- FlowUI component library:  `k66Ey9ccZnqVnEnM7GG4KF`  node `240:1170531`
- Catalyst explorations: check with @bellis for additional Figma links

## Debug Protocol
Before making ANY change:
- Read the actual file with cat first
- Check localhost:5173 DOM via browser tools
- Check floqast.app/completeness as reference
- Make one change at a time
- Verify in browser after every change
- Never guess. Always read code and DOM first.

## External Links
- Jira: none
- Confluence: referenced in knowledge/fqcurrent/ docs (internal FloQast Confluence)

## Key Knowledge
- `knowledge/fqcurrent/` — Current state analysis: Close product deep dive, technical architecture, project reference
- `knowledge/fqcurrent/CLAUDE.md` — Detailed context on the research documents
- `knowledge/working/` — Working research phases: personas/journeys, task data model, system architecture, use cases, narrative alignment
- `guidelines/Guidelines.md` — Design and interaction guidelines for the prototype
- `docs/architecture.md` — Prototype code architecture
- `docs/plan.md` — Development plan and roadmap
- `docs/design-decisions.md` — Key design decisions and rationale

## Prototype
- **Stack:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Location:** `prototype/`
- **Run:** `cd prototype && npm install && npm run dev`
- **Key patterns:** Persona-driven demo (persona switcher), mock data layer (src/data/), context-based state (src/contexts/)

## For Claude
When working on this project:
- Read knowledge/ files for research context before making suggestions
- Read `guidelines/Guidelines.md` before making UI changes
- Read `docs/architecture.md` to understand prototype structure
- The prototype is a design exploration tool, not production code — prioritize visual fidelity and demo-ability
- SVG imports in `src/imports/` are Figma-generated — don't modify them by hand
- Persona data in `src/data/personas/` drives the demo experience

---

## Prototype Technical Reference

> Added 2026-03 from hands-on Figma + codebase analysis session.
> Covers implementation detail Claude needs when working on the prototype.

### Structure

```
prototype/src/
  App.tsx                          ← Root layout + hash routing
  main.tsx
  components/
    Header.tsx
    layout/Sidebar/
    dashboard/
    reconciliations/
      ReconciliationsPage.tsx      ← Legacy — DO NOT TOUCH
      ReconciliationsPageAG.tsx    ← Active AG Grid version
      EditGroupSlideout.tsx        ← Stable slideout — DO NOT TOUCH
    tasks/
    shared/
      UserAvatar.tsx               ← Reusable avatar component
      PersonaSwitcher.tsx
    task-detail/
    ui/                            ← shadcn/ui primitives
  contexts/
    NavigationContext.tsx          ← useNavigation(), hash routing
    UIContext.tsx
    PersonaContext.tsx
  runtime/
    TaskStore.tsx
```

### Routing
Hash-based via `NavigationContext`. To add a page:
1. Create `prototype/src/components/<feature>/<Name>.tsx`
2. Add `{currentPage === 'my-route' && <Name />}` in `App.tsx`

Routes: `#home`, `#tasks`, `#workflows`, `#recs`, `#recs-ag`

### Never modify
- `ReconciliationsPage.tsx` — legacy reference only
- `EditGroupSlideout.tsx` — stable, wired to slideout state
- `src/contexts/` — unless explicitly asked
- `src/imports/` — Figma-generated SVGs

---

### FloQast Design Tokens

From `get_variable_defs` on Figma file `IROzHx3l0JXxVpYeCBPlxB`. Use these exact values.

#### Colors
```
/* Brand */
Primary green (nav):         #186749    Navbar/close
Primary green (buttons):     #1fac76    Themes/Buttons/Primary/primary-state
Toggle ON:                   #1a7b4b    sign-off toggles
Warning:                     #db7712    brand/warning-primary

/* Surfaces */
Page / row bg:               #ffffff
Header / alt row bg:         #f8fafc    Colors/Neutral/color-neutral-100
Row hover:                   #f9fafb
Selected row:                #f0f5ff    Semantic Colors/info-secondary
Badge neutral bg:            #f1f3f9    Colors/Neutral/color-neutral-200
Badge info bg:               #f0f5ff

/* Text */
Text primary:                #1d2433    Colors/Neutral/color-neutral-800
Text body:                   #424867    Colors/Neutral/color-neutral-600
Text header:                 #000000    Text colors/header-text
Text header-secondary:       #1b1f27    Text colors/header-secondary-text
Text muted:                  #adb2bb    Colors/Neutral/color-neutral-400
Text link:                   #000000 + underline
Text link muted:             #adb2bb

/* Badges */
Badge neutral text:          #6b7280    Badges/Neutral/badge-text-color
Badge neutral count bg:      #424867    Badges/Neutral/icon-default-color
Badge info text:             #3d7bf7    Semantic Colors/info-primary
Badge info count bg:         #3d7bf7

/* Borders */
Border default:              #e1e6ef    Borders/default-container-border
Border button:               #cbd2e1    Borders/button-stroke
Border resize handle:        #dddddd    theme/quartz/comp/ag-secondary-border-color
```

#### Typography
```
Header font:      Museo Sans  ← page titles (H1–H5) only
Body font:        Inter       ← all cell text, labels, badges, buttons

Label/Semibold:   Inter SemiBold  12px  lh 16px   ← AG Grid column headers
Paragraph MD/Med: Inter Medium    14px  lh 20px   ← cell body text
Paragraph MD/SB:  Inter SemiBold  14px  lh 20px
Label/Medium:     Inter Medium    12px  lh 16px
Label SM/Medium:  Inter Medium    11px  lh 16px
Time atom:        Inter Medium    10px  lh 14px   ← dates in sign-off rows
```

---

### Shared Components

#### UserAvatar
```tsx
<UserAvatar
  initials="SB"      // first letter of first + last name
  size="sm"          // "xs"=24px | "sm"=28px | "md"=32px | "lg"=48px
  variant="user"     // "user" (green gradient) | "agent" (blue gradient)
/>
// Use size="sm" inside AG Grid sign-off rows
```

#### Toggle (inline, not a shared component)
```tsx
const Toggle = ({ on }: { on: boolean }) => (
  <div className={`relative w-10 h-5 rounded-full flex-shrink-0 transition-colors
    ${on ? 'bg-[#1a7b4b]' : 'bg-[#d1d5db]'}`}>
    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm
      transition-transform duration-150
      ${on ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
  </div>
)
```

#### Buttons
```tsx
// Outlined secondary
<button className="flex items-center gap-1.5 border border-[#e1e6ef] rounded-md
  h-9 px-3 text-[13px] text-[#424867] font-medium hover:bg-[#f9fafb] transition-colors">
  <Icon className="size-4" /> Label
</button>

// Primary green
<button className="flex items-center gap-1.5 bg-[#186749] hover:bg-[#145a3e]
  text-white rounded-md h-9 px-3 text-[13px] font-medium transition-colors">
  <Plus className="size-4" /> Add
</button>
```

#### Badges
```tsx
// Neutral: Tags, Blocks, Blocked By, Account Balance Filters
<span className="inline-flex items-center gap-2 h-6 px-1.5 py-1
  bg-[#f1f3f9] rounded text-[#6b7280] text-[12px] font-medium whitespace-nowrap">
  {label}
  {count && (
    <span className="flex items-center justify-center h-4 min-w-[20px] px-0.5
      bg-[#424867] rounded-full text-white text-[11px] font-medium">{count}</span>
  )}
</span>

// Info / blue: Controls, Rec Type / Daily Rec
<span className="inline-flex items-center gap-2 h-6 px-1.5 py-1
  bg-[#f0f5ff] rounded text-[#3d7bf7] text-[12px] font-medium whitespace-nowrap">
  {label}
</span>
```

---

### AG Grid — ReconciliationsPageAG.tsx

#### Golden rules (hard-won — don't break these)
1. **One theming system** — `themeQuartz.withParams({})` only. Never also inject CSS
   via `document.head.appendChild`. They conflict unpredictably.
2. **No `autoHeight: true`** on any column — overrides fixed `rowHeight`, rows expand.
3. **No negative margins** in cell renderers — bleeds into adjacent columns.
4. **One checkbox column** — `checkboxSelection` only on the explicit colDef, never in `defaultColDef`.
5. **Sign-off cells = two 50px sub-rows** — outer `height:100px; overflow:hidden`,
   each sub-row `height:50px; overflow:hidden`.

#### Theme setup
```tsx
import { themeQuartz } from '@ag-grid-community/theming'

const recsGridTheme = themeQuartz.withParams({
  backgroundColor: '#ffffff',
  oddRowBackgroundColor: '#ffffff',
  headerBackgroundColor: '#f8fafc',
  borderColor: '#e1e6ef',
  rowBorder: true,
  headerHeight: 50,
  rowHeight: 100,
  fontFamily: { googleFont: 'Inter' },
  fontSize: 14,
  headerFontSize: 12,
  headerFontWeight: 600,
  headerTextColor: '#000000',
  foregroundColor: '#424867',
  selectedRowBackgroundColor: '#f0f5ff',
  rowHoverColor: '#f9fafb',
  checkboxUncheckedBorderColor: '#cbd2e1',
  accentColor: '#1a7b4b',
  wrapperBorderRadius: '4px',
  columnBorder: true,
  cellHorizontalPaddingScale: 0.75,
})

// <AgGridReact theme={recsGridTheme} rowHeight={100} headerHeight={50} />
// No className="ag-theme-alpine" needed with JS theming API
```

#### Column widths (Figma node 5002:36880)
```
checkbox              48px   pinned: 'left'
entity               160px
period               120px
folder               200px
account              190px
tags                 170px
blockedBy            180px
blocks               170px
controls             170px
recType              170px
autoRecMatching      170px
accountBalanceFilters 223px
fqId                 223px
glBalance            164px   rightAligned
viewTransactions     180px
recBalance           185px   rightAligned
recItems             180px   rightAligned
difference           145px   rightAligned
preparer             205px
preparerDueDate      120px
preparerSignOff      150px
reviewer             278px
reviewerDueDate      120px
reviewerSignOff      150px
additionalSignOffs   305px
actions              172px
```

#### Currency formatter
```tsx
const currencyFormatter = (params: ValueFormatterParams) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 2,
  }).format(params.value ?? 0)
```

---

### Figma-to-Code Workflow

1. `get_design_context` — fileKey + nodeId from Figma URL
2. `get_variable_defs` — confirm exact token values
3. `get_screenshot` — visual reference
4. Map Figma tokens → Tailwind using tables above
5. Use `UserAvatar` from shared, icons from `lucide-react` only
6. Place file in `prototype/src/components/<feature>/`, register route in `App.tsx`
7. Run `/figma-match` to compare running component against Figma design
