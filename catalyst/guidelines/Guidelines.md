# Catalyst Project Guidelines

## General

- Only use absolute positioning when necessary. Default to flexbox and grid for responsive layouts.
- Keep component files under **400 lines**. Large components are decomposition targets.
- Put helper functions and sub-components in their own files when they exceed ~50 lines.
- Preserve existing visual fidelity — refactoring must not cause visual regressions.

## TypeScript

- **Strict mode** enabled (`strict: true` in tsconfig.json)
- `noUnusedLocals` and `noUnusedParameters` are relaxed (`false`) due to Figma-generated code
- Use **path aliases**: `@/*` maps to `./src/*`
- Prefer named exports over default exports for components
- Types live in `src/types/` with barrel export from `src/types/index.ts`

## Styling — Tailwind CSS v4

- **CSS-first configuration** — no `tailwind.config.js`. Theme is defined via `@theme inline` in `src/styles/globals.css`.
- Design tokens are CSS custom properties in `:root` (50+ tokens defined).
- **Font family**: Inter (loaded via Google Fonts in `index.html`)
- Use Tailwind utility classes. Avoid inline `style` attributes unless needed for dynamic values.

### Design Tokens

Use semantic design tokens instead of hardcoded hex values. Tokens are defined in `globals.css` `:root` and registered in `@theme inline` for Tailwind usage:

**Status colors** — use for task status badges:
```
bg-status-complete-bg text-status-complete-text
bg-status-in-progress-bg text-status-in-progress-text
bg-status-review-bg text-status-review-text
bg-status-blocked-bg text-status-blocked-text
bg-status-not-started-bg text-status-not-started-text
```

**Semantic text** — use instead of hardcoded grays:
```
text-text-primary    (#101828) — headings, task names
text-text-secondary  (#475467) — labels, metadata
text-text-tertiary   (#6b7280) — muted counts, hints
text-text-overdue    (#DC2626) — overdue date indicators
```

**Borders and tags:**
```
border-border-default  (#e4e7ec) — standard borders
bg-tag-bg text-tag-text — tag pill styling
```

**Brand:**
```
text-floqast-deep / fill: var(--floqast-deep)  — FloQast deep green
text-agent-green — agent active states
```

### Brand Colors

| Token | Value | Usage |
|-------|-------|-------|
| Sidebar gradient start | `#014a3d` | Deep forest green |
| Sidebar gradient end | `#00332a` | Darker green |
| `--floqast-deep` | `#013A30` | Brand deep green |
| `--floqast-accent` | `#C0E8D7` | Brand accent green |
| `--agent-green` | `#00A651` | Toggle switches, active states |
| Content background | `#f9fafb` | Light gray content area |
| `--destructive` | `#d4183d` | Error states, destructive actions |

## Component Patterns

### shadcn/ui

- 48 pre-installed components in `src/components/ui/`
- Import the `cn()` utility from `@/components/ui/utils` for class merging
- Uses Radix UI primitives under the hood
- To add new shadcn components: copy source into `src/components/ui/`, install Radix deps

### Icons

- Use `lucide-react` for all icons
- SVG path data from Figma is in `src/imports/svg-*.ts` files — reference by key

### Animations

- Use `motion/react` (Framer Motion) for all animations
- Standard timing: `duration: 0.5`, `ease: "easeOut"`
- Use `AnimatePresence` for enter/exit transitions

## Data & State

- Mock data lives in `src/data/` (tasks, task-details, workflows, insights, notifications, personas)
- State management: `useReducer`-based TaskStore + React contexts (PersonaContext, NavigationContext, UIContext)
- Navigation: state-driven via `NavigationContext` (no router library)
- Persona system: `PersonaContext` provides active persona + persona-specific insights/notifications
- Persona filtering: `usePersonaTasks()` hook filters tasks by active persona's `taskFilter` — used in TaskManagement, MetricsGrid, MyPriorities
- Hard-coded "today": `new Date(2026, 1, 25)` in `src/data/tasks.ts:4`
- TaskStore handles dependency graph logic with auto-unblock cascading
- Cross-persona dependency demo: Task #3 (Sarah prepares, David reviews) → completing unblocks Task #5 for Sarah
